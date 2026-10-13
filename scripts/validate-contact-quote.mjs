import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import vm from 'node:vm';
const read=p=>readFileSync(p,'utf8');
const home=read('index.html'),footer=read('site-footer.js'),templates=read('templates/templates.js'),contact=read('contact/index.html'),js=read('contact/contact.js'),css=read('premium-dark.css');
for(const path of ['contact/index.html','contact/contact.css','contact/contact.js','contact/thanks/index.html','contact/google-meet-booking.js','contact/google-meet-booking.json','contact/GOOGLE-CHAT-MEET-SETUP.md'])assert(existsSync(path),path+' missing');
assert(!home.includes('mailto:'),'Homepage still depends on a mailto handler');
assert(!footer.includes('mailto:'),'Footer or FAQ helper still depends on mailto');
assert(!templates.includes('mailto:'),'Template quote button still depends on mailto');
for(const path of ['/contact/?service=ai','/contact/?service=website','/contact/?service=quote','/contact/?service=demo'])assert(home.includes(path),'Homepage quote link missing '+path);
for(const id of ['feature-call-answering','feature-appointments','feature-faq'])assert(home.includes('href="#'+id+'"')&&home.includes('id="'+id+'"'),'Hero feature chip missing destination '+id);
for(const id of ['dental','salon','restaurant','retail','professional','education','travel','technology'])assert(home.includes('/templates/?industry='+id),'Industry chip missing '+id);
for(const key of ['dental','salon','restaurant','retail','professional','education','travel','technology'])assert(templates.includes(key+':'),'Gallery filter missing '+key);
assert(css.includes('.hero-effects a')&&css.includes('.industry-strip a'),'Clickable chip styles missing');
assert(contact.includes('name="website-quote-request"')&&contact.includes('data-netlify="true"')&&contact.includes('name="form-name" value="website-quote-request"'),'Native Netlify form missing');
assert(contact.includes('netlify-honeypot="bot-field"')&&contact.includes('name="bot-field"'),'Spam protection missing');
assert(contact.includes('action="/contact/thanks/"'),'Contact confirmation missing');
const payment=read('payment/index.html');
const subject='<input type="hidden" name="subject" value="New AI Suraj Teach enquiry - %{formName} (#%{submissionId})">';
assert(contact.includes(subject),'Quote form should attach a clear subject for Netlify notification emails');
assert(payment.includes(subject),'Payment request form should attach a clear subject for Netlify notification emails');
const quoteInputs=['name="service"','name="name"','name="email"','name="business"','name="message"'];
for(const field of quoteInputs)assert(contact.includes(field),'Quote lead email would miss '+field);
assert(payment.includes('name="secure-payment-request"')&&payment.includes('data-netlify="true"'),'Payment request Netlify form missing');
for(const field of ['name="requested-plan"','name="customer-name"','name="customer-email"','name="customer-business"','name="customer-message"'])assert(payment.includes(field),'Payment lead email would miss '+field);
assert(existsSync('contact/NETLIFY-LEAD-EMAIL-SETUP.md'),'Human dashboard activation instructions missing');
const setup=read('contact/NETLIFY-LEAD-EMAIL-SETUP.md');
assert(setup.includes('kamdevsuraj03@gmail.com')&&setup.includes('Forms > Submission notifications > Add notification'),'Email setup instructions incomplete');
for(const name of ['name="email"','name="message"','name="service"','name="privacy-consent"'])assert(contact.includes(name),'Missing form field '+name);
assert(contact.includes('id="quote-gmail-link"')&&contact.includes('id="quote-outlook-link"'),'Browser compose fallbacks missing');
for (const id of ['google-connect-heading','open-google-chat','copy-google-chat-email','google-meet-action','google-meet-status','quote-meeting-time']) assert(contact.includes('id="'+id+'"'),'Google integration UI missing '+id);
for (const value of ['chat','meet']) assert(contact.includes('<option value="'+value+'">'),'Missing Google service choice '+value);
assert(contact.includes('name="preferred-meeting-time"'),'Meet availability field must be captured in Netlify Forms');
assert(home.includes('/contact/?service=chat')&&home.includes('/contact/?service=meet'),'Homepage Google shortcuts missing');
assert(footer.includes('/contact/?service=chat')&&footer.includes('/contact/?service=meet'),'Site-wide Google shortcuts missing');
assert(footer.includes('Google Chat')&&footer.includes('Google Meet'),'Footer AI helper should answer Google communications queries');
const meetJS=read('contact/google-meet-booking.js'),meetConfig=JSON.parse(read('contact/google-meet-booking.json'));
new vm.Script(meetJS);
assert.equal(meetConfig.schema_version,1);
assert.equal(meetConfig.google_meet_booking_url,null,"Do not invent an appointment URL; replace only with owner's public page");
new vm.Script(js);
const handlers={};const controls={};
for(const id of ['quote-request-form','quote-service','quote-name','quote-email','quote-business','quote-message','quote-meeting-time','quote-gmail-link','quote-outlook-link','quote-copy-email','quote-copy-result','copy-google-chat-email','google-chat-copy-result']){
 controls[id]={value:'',href:'',textContent:'',addEventListener:(event,fn)=>handlers[id+':'+event]=fn};
}
const document={getElementById:id=>controls[id]};
controls['quote-service'].value='';
controls['quote-name'].value='Test Client';
controls['quote-email'].value='client@example.com';
const window={location:{search:'?service=website&template=25'}};
vm.runInNewContext(js,{document,window,URLSearchParams,Number,Object,navigator:{}});
assert.equal(controls['quote-service'].value,'website');
assert(controls['quote-message'].value.includes('template #25'));
for(const id of ['quote-gmail-link','quote-outlook-link']) {
 const url=new URL(controls[id].href);
 assert.equal(url.protocol,'https:');
 assert(url.hostname==='mail.google.com'||url.hostname==='outlook.live.com');
 assert(url.searchParams.toString().includes('kamdevsuraj03%40gmail.com'));
 assert(url.searchParams.get('body').includes('template #25'));
 assert(url.searchParams.get('body').includes('client@example.com'));
}
controls['quote-service'].value='demo';
handlers['quote-request-form:change']();
assert(new URL(controls['quote-gmail-link'].href).searchParams.get('su').includes('Demo request'));
// Meeting requests use the existing native Netlify form and preserve chosen date and timezone.
controls['quote-service'].value='meet';
controls['quote-meeting-time'].value='Friday 10:00 AM EST';
handlers['quote-request-form:change']();
assert(new URL(controls['quote-gmail-link'].href).searchParams.get('su').includes('Google Meet'));
assert(new URL(controls['quote-gmail-link'].href).searchParams.get('body').includes('Friday 10:00 AM EST'));
controls['quote-service'].value='chat';
handlers['quote-request-form:change']();
assert(new URL(controls['quote-outlook-link'].href).searchParams.get('subject').includes('Google Chat'));
assert(contact.includes('https://chat.google.com/'),'Google Chat must open its official page, not a fake direct DM URL');

async function simulateMeet(config,fail=false) {
  const btn={href:'/contact/?service=meet#quote-form',textContent:'Request Google Meet Call',target:'',rel:''};
  const msg={textContent:''};
  const document={
    readyState:'complete',
    getElementById:id=>id==='google-meet-action'?btn:id==='google-meet-status'?msg:null
  };
  const fetch=async()=>{if(fail)throw new Error('Network down');return {ok:true,json:async()=>config};};
  vm.runInNewContext(meetJS,{document,fetch,URL,Object});
  await new Promise(resolve=>setImmediate(resolve));
  return {btn,msg};
}
const noBooking=await simulateMeet(meetConfig);
assert.equal(noBooking.btn.href,'/contact/?service=meet#quote-form','Unconfigured Meet must send a real inquiry');
const availableBooking=await simulateMeet({schema_version:1,google_meet_booking_url:'https://calendar.app.google/TEST_PUBLIC_BOOKING'});
assert.equal(availableBooking.btn.href,'https://calendar.app.google/TEST_PUBLIC_BOOKING');
assert.equal(availableBooking.btn.target,'_blank');
assert(availableBooking.btn.textContent.includes('Book Google Meet'));
for(const unsafe of ['https://meet.google.com/abc-defg-hij','https://evil.example/book','http://calendar.app.google/book','https://calendar.app.google.evil.com/foo','javascript:alert(1)','https://calendar.google.com/']) {
  const bad=await simulateMeet({schema_version:1,google_meet_booking_url:unsafe});
  assert.equal(bad.btn.href,'/contact/?service=meet#quote-form','Unsafe Meet link activated: '+unsafe);
}
const outage=await simulateMeet(meetConfig,true);
assert.equal(outage.btn.href,'/contact/?service=meet#quote-form');
console.log('PASS: quote forms, Google Chat buttons, Meet scheduling fallback, valid public booking links, rejection of unsafe links, and existing Gmail/Outlook drafts.');
