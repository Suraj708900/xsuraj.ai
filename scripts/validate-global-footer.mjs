import assert from 'node:assert/strict';
import {readFileSync, existsSync, readdirSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync('site-footer.js','utf8');
const css=readFileSync('site-footer.css','utf8');
const articleDirs=readdirSync('blog',{withFileTypes:true}).filter(e=>e.isDirectory());
const pages=articleDirs.map(x=>'blog/'+x.name+'/index.html').filter(existsSync);
assert.equal(pages.length,100,'All 100 articles must exist');
for(const path of ['index.html','blog/index.html','templates/index.html','privacy-policy/index.html','preview-scenarios/index.html',...pages]){
 const html=readFileSync(path,'utf8');
 assert(html.includes('/site-footer.js'),'Missing script in '+path);
 assert(html.includes('/site-footer.css'),'Missing CSS in '+path);
}
for(const path of ['payment/index.html','feed.xml','robot-logo.svg','templates/index.html'])assert(existsSync(path), 'Missing linked resource '+path);
for(const text of ['Ready to get started?','Explore','AI Suraj Teach','Contact','AI Assistant','site footer','/payment/','/feed.xml','/blog/'])assert(source.includes(text),'Missing footer feature: '+text);
for(const text of ['.ast-footer-inner','.ast-start-panel','.ast-help-panel','@media(max-width:580px)'])assert(css.includes(text),'Missing footer CSS rule '+text);
const events=new Map();
function control(name){
 return {
  name, hidden:name==='panel', value:'', dataset:{astQuestion:'Website pricing'}, textContent:'',
  setAttribute:(key,value)=>events.set(name+':attribute:'+key,value),
  addEventListener:(type,fn)=>events.set(name+':'+type,fn),
  focus:()=>events.set(name+':focused',true),
  appendChild:(node)=>events.set(name+':child',node),
  querySelectorAll:()=>[]
 };
}
const toggle=control('toggle'),panel=control('panel'),close=control('close'),input=control('input'),answer=control('answer'),form=control('form'),quick=control('quick');
quick.dataset.astQuestion='Website pricing';
const helper={innerHTML:'',className:'',querySelector:(selector)=>({
 '#ast-help-toggle':toggle,'#ast-help-panel':panel,'.ast-help-close':close,
 '#ast-help-input':input,'#ast-help-answer':answer,'#ast-help-form':form
}[selector]),querySelectorAll:()=>[quick]};
const wrapper={innerHTML:'',id:''};const oldFooter={replaceWith:(newNode)=>events.set('footer:replaced',newNode)};
let divCount=0;
const doc={
 readyState:'complete',getElementById:()=>null,
 querySelector:()=>oldFooter,
 createElement:(tag)=>tag==='a'?control('link'):(divCount++===0?wrapper:helper),
 createTextNode:s=>({text:s}),body:{appendChild:node=>events.set('body:append',node)},
 addEventListener:(type,fn)=>events.set('document:'+type,fn)
};
const ctx={window:{},document:doc};
vm.runInNewContext(source,ctx,{timeout:2000});
assert.equal(wrapper.id,'ast-global-footer');
assert(wrapper.innerHTML.includes('Ready to get started?')&&wrapper.innerHTML.includes('AI SURAJ'));
assert.equal(events.get('footer:replaced'),wrapper);
assert.equal(events.get('body:append'),helper);
assert.equal(typeof events.get('toggle:click'),'function');
events.get('toggle:click')();
assert.equal(panel.hidden,false,'Assistant should open');
events.get('quick:click')();
assert(answer.textContent.includes('$399'),'Website quick answer missing pricing');
input.value='PayPal payment options';events.get('form:submit')({preventDefault(){}});
assert(answer.textContent.includes('UPI or PayPal'),'Payment guidance missing');
assert.equal(input.value,'','Ask field should clear after submitting');
events.get('close:click')();
assert.equal(panel.hidden,true,'Assistant should close');
console.log('PASS: 100 blog posts + shared resources, CTA/footer rendering, assistant interaction and quote/payment links.');
