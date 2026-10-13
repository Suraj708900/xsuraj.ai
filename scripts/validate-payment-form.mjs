import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import vm from "node:vm";
const read=p=>readFileSync(p,"utf8");
const html=read("payment/index.html");
const source=read("payment/payment-request.js");
const css=read("payment/payment-request.css");
const main=read("index.html");
assert(existsSync("payment/thanks/index.html"));
assert(html.includes('name="secure-payment-request" method="POST" action="/payment/thanks/" data-netlify="true"'),"Static Netlify form declaration missing");
assert(html.includes('name="form-name" value="secure-payment-request"'),"Netlify form-name hidden input missing");
assert(html.includes('netlify-honeypot="bot-field"'),"Honeypot missing");
for(const field of ['customer-name','customer-email','requested-plan','privacy-acknowledgement']){
 assert(html.includes('name="'+field+'"'),"Required form field missing: "+field);
}
const ids=["voice-normal","voice-pro","voice-ultra-pro","website-starter","website-growth","website-pro"];
for(const id of ids){
 assert(html.includes('href="#payment-request-form" data-plan="'+id+'"'),"Broken button: "+id);
 assert(html.includes('<option value="'+id+'">'),"Missing select value: "+id);
 assert(html.includes('id="'+id+'"'),"Missing card anchor: "+id);
 assert(main.includes('/payment/#'+id),"Homepage CTA to payment card missing: "+id);
}
assert.equal((html.match(/href="#payment-request-form" data-plan=/g)||[]).length,6,"Exactly six plan request buttons required");
assert(!/href="mailto:[^"]+">Request secure payment details/.test(html),"Broken mailto still present");
assert(html.includes("https://mail.google.com/mail/")&&html.includes("https://outlook.live.com/mail/0/deeplink/compose"),"Browser mail alternatives missing");
assert(html.includes('id="copy-payment-email"'),"Copy email button missing");
assert(html.includes('href="https://meet.google.com/"') && html.includes('src="/google-meet-icon.svg"'),"Direct Google Meet entry and icon missing from payment sidebar");
assert(html.includes('href="https://chat.google.com/"') && html.includes('src="/google-chat-icon.svg"'),"Direct Google Chat entry and icon missing from payment sidebar");
assert(html.includes('/contact/?service=meet#quote-form') && html.includes('/contact/?service=chat#quote-form'),"Meet and Chat contact request links missing");
assert(html.includes('they do not start a call or chat'),"Generic Google links must not pretend to contact the website owner directly");
assert(existsSync('google-meet-icon.svg') && existsSync('google-chat-icon.svg'),"Google icons missing from repository");

assert(css.includes("@media(max-width:590px)"),"Responsive form CSS missing");
assert(html.includes('src="/payment/payment-request.js"')&&html.includes('href="/payment/payment-request.css"'),"Assets not loaded");
new vm.Script(source);
const events={};
const options=[
 {value:"",textContent:"Choose a service plan"},
 ...ids.map(id=>({value:id,textContent:id.replaceAll("-"," ")}))
];
const select={options,value:"",get selectedOptions(){return [options.find(o=>o.value===this.value)];},addEventListener(type,cb){events["select:"+type]=cb;}};
const summary={textContent:""};
const gmail={href:""},outlook={href:""};
const link=({dataset:{plan:"website-starter"},addEventListener:(type,cb)=>{events["plan:"+type]=cb;}});
const copy={addEventListener:(type,cb)=>events["copy:"+type]=cb},result={textContent:""};
const elementIds={
 "secure-payment-request-form":{},
 "requested-plan":select,"payment-selected":summary,
 "payment-gmail-link":gmail,"payment-outlook-link":outlook,
 "copy-payment-email":copy,"copy-payment-result":result
};
const ctx={document:{getElementById:id=>elementIds[id]||null,querySelectorAll:q=>q==='a[data-plan][href="#payment-request-form"]'?[link]:[]},navigator:{clipboard:{writeText:async s=>{events.copied=s;}}},encodeURIComponent,Array,Error};
vm.runInNewContext(source,ctx);
assert.equal(typeof events["plan:click"],"function","Plan button handler missing");
events["plan:click"]();
assert.equal(select.value,"website-starter","Button did not preselect plan");
assert(summary.textContent.includes("website starter"),"Plan selection not shown");
assert(gmail.href.startsWith("https://mail.google.com/mail/"),"Gmail does not open in browser");
assert(outlook.href.startsWith("https://outlook.live.com/mail/"),"Outlook does not open in browser");
assert(gmail.href.includes("website%20starter"),"Gmail subject should carry selected plan");
select.value="voice-pro";events["select:change"]();
assert(gmail.href.includes("voice%20pro"),"Changing plan should update Gmail subject");
await events["copy:click"]();
assert.equal(events.copied,"kamdevsuraj03@gmail.com","Copy-email action failed");

for(const id of ['customer-business','customer-address','customer-message']){
  const field=html.match(new RegExp('<(?:input|textarea)\\b[^>]*id="'+id+'"[^>]*>'));
  assert(field && field[0].includes('required'),'Payment form must require '+id);
}
assert(!/Do not (?:submit|include) passwords/i.test(html),'Remove requested sensitive-data warning from payment form');
console.log("PASS: 6 payment buttons navigate to native Netlify Form, preselect plan, secure browser-email alternatives and clipboard fallback.");
