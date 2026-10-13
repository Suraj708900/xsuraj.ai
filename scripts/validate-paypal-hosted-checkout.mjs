import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";

const html=readFileSync("payment/index.html","utf8");
const js=readFileSync("payment/paypal-checkout.js","utf8");
const config=JSON.parse(readFileSync("payment/paypal-links.json","utf8"));
const homepage=readFileSync("index.html","utf8");
const assistant=readFileSync("site-footer.js","utf8");
const keys=["website-starter","website-growth","website-pro","voice-normal","voice-pro","voice-ultra-pro"];
assert.equal(config.schema_version,1);
assert.equal(config.currency,"USD");
assert.deepEqual(Object.keys(config.plans),keys);
for(const key of keys) {
  const url=config.plans[key].paypal_url;
  assert(url===null || (typeof url==="string" && url.startsWith("https://") && /^https:\/\/(?:www\.)?paypal\.com\//.test(url)),"Configured checkout must be a real PayPal.com URL: "+key);
  assert(html.includes('id="checkout-status-'+key+'"'),"Missing checkout status for "+key);
  assert(html.includes('data-plan="'+key+'"'),"Missing active plan button for "+key);
}
assert(!html.includes("This is not a payment checkout."),"Old misleading notice still visible");
assert(!html.includes("There is no instant checkout"),"Legacy notice still visible");
assert(html.includes('<script src="/payment/paypal-checkout.js" defer></script>'));
assert(!homepage.includes("No payment is collected on this website."));
assert(!assistant.includes("this website does not directly process payments."));
new vm.Script(js);

function makeHarness(configuration,shouldFail=false) {
  const cards={};
  const statuses={};
  const notice={textContent:""};
  for(const plan of keys){
    const link={href:"#payment-request-form",target:"",rel:"",dataset:{plan},textContent:"Request verified payment link ↗",setAttribute:(k,v)=>{link[k]=v;},removeAttribute:k=>{delete link[k];}};
    cards[plan]={querySelector:sel=>sel==='a[data-plan]'?link:null,link};
    statuses["checkout-status-"+plan]={textContent:""};
  }
  const events={};
  const document={
    readyState:"loading",
    addEventListener:(name,cb)=>events[name]=cb,
    getElementById:id=>cards[id]||statuses[id]||(id==="paypal-checkout-status"?notice:null)
  };
  const context={document,URL,fetch:async()=>{if(shouldFail)throw new Error("network");return {ok:true,json:async()=>configuration}},Set,Object,String};
  vm.runInNewContext(js,context);
  return {cards,statuses,notice,events};
}
function fixtureLinks() {
  const c=JSON.parse(JSON.stringify(config));
  for(const k of keys) c.plans[k].paypal_url="https://www.paypal.com/ncp/payment/FAKE_EXAMPLE_FOR_UNIT_TEST_"+k;
  return c;
}
const noLinksConfig=JSON.parse(JSON.stringify(config));for(const key of keys)noLinksConfig.plans[key].paypal_url=null;
const noLinks=makeHarness(noLinksConfig);await noLinks.events.DOMContentLoaded();
assert(noLinks.notice.textContent.includes("after your business payment links are connected"));
for(const key of keys)assert.equal(noLinks.cards[key].link.href,"#payment-request-form");
const live=makeHarness(fixtureLinks());await live.events.DOMContentLoaded();
assert(live.notice.textContent.includes("All six checkout links are available"));
for(const key of keys) {
 const link=live.cards[key].link;
 assert(link.href.startsWith("https://www.paypal.com/ncp/payment/"),"Plan did not get PayPal checkout URL: "+key);
 assert.equal(link.target,"_blank");
 assert.equal(link.rel,"noopener noreferrer");
 assert.equal(link.dataset.paypalReady,"true");
 assert(live.statuses["checkout-status-"+key].textContent.includes("available"));
 assert(link.textContent.includes(key.startsWith("website-")?"Pay $":"Subscribe $"));
}
for(const hostile of ["http://www.paypal.com/ncp/payment/FAKE","https://evil.test/checkout","https://paypal.com.evil.test/path","https://example.com@evil.test/path","https://paypal.com/","javascript:alert(1)","https://www.paypal.com/signin"]){
 const c=fixtureLinks();c.plans["website-starter"].paypal_url=hostile;
 const harness=makeHarness(c);await harness.events.DOMContentLoaded();
 assert.equal(harness.cards["website-starter"].link.href,"#payment-request-form","Unsafe checkout link activated: "+hostile);
}
const mismatch=fixtureLinks();mismatch.plans["website-growth"].amount="1.00";
const bad=makeHarness(mismatch);await bad.events.DOMContentLoaded();
assert.equal(bad.cards["website-growth"].link.href,"#payment-request-form","Wrong price must block hosted checkout");
const outage=makeHarness(config,true);await outage.events.DOMContentLoaded();
assert.equal(outage.cards["website-pro"].link.href,"#payment-request-form","Fetch error should fail closed");

console.log("PASS: 6 PayPal hosted links, 6 fallback forms, secure-domain checks, USD amount/billing checks and bad-network handling.");
