import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import vm from 'node:vm';
const read=p=>readFileSync(p,'utf8');
const home=read('index.html'),footer=read('site-footer.js'),templates=read('templates/templates.js'),contact=read('contact/index.html'),js=read('contact/contact.js'),css=read('premium-dark.css');
for(const path of ['contact/index.html','contact/contact.css','contact/contact.js','contact/thanks/index.html'])assert(existsSync(path),path+' missing');
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
new vm.Script(js);
const handlers={};const controls={};
for(const id of ['quote-request-form','quote-service','quote-name','quote-email','quote-business','quote-message','quote-gmail-link','quote-outlook-link','quote-copy-email','quote-copy-result']){
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
for(const service of ['meet','chat']){
  assert(home.includes('/contact/?service='+service+'#quote-form'),'Homepage '+service+' CTA missing');
  assert(footer.includes('/contact/?service='+service+'#quote-form'),'Footer '+service+' CTA missing');
  assert(contact.includes('<option value="'+service+'">'),'Contact form '+service+' service missing');
  assert(js.includes(service+': "Google'),'Contact script '+service+' subject missing');
}
assert(contact.includes('not a conversation with our team') && contact.includes('confirmed booking or chat invitation will be shared separately.'),'Google links must not pretend to open a direct customer meeting or chat invitation');
for(const url of ['https://calendar.google.com/calendar/u/0/r','https://chat.google.com/']) {
  assert(contact.includes(url) && footer.includes(url) && home.includes(url),'Google Calendar/Chat links should exist across the homepage, contact page, and footer: '+url);
}
assert(contact.includes('name="address"'),'Contact lead form should include an address field');
assert(payment.includes('name="customer-address"'),'Payment enquiry form should include an address field');

for(const [name,id] of [['business','quote-business'],['address','quote-address'],['message','quote-message']]){
  const field=contact.match(new RegExp('<(?:input|textarea)\\b[^>]*id="'+id+'"[^>]*>'));
  assert(field && field[0].includes('name="'+name+'"') && field[0].includes('required'),'Contact form must require '+name);
}
assert(!/Do not (?:submit|include) passwords/i.test(contact),'Remove requested sensitive-data warning from contact form');
console.log('PASS: Google Meet and Google Chat requests are selectable, prefilled and linked in homepage/footer; no fake meeting link.');
console.log('PASS: homepage, footer, 60 templates, 8 working industry filters, 3 working benefit chips, Netlify form and browser-based Gmail/Outlook quote drafts.');
