import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const script=new vm.Script(readFileSync('templates/templates.js','utf8'));
function boot(search){
 const events={};
 const elements=new Map();
 for(const id of ['app','template-search','template-category','template-grid','template-count'])elements.set(id,{innerHTML:'',textContent:'',value:id==='template-category'?'all':'',querySelectorAll:()=>[],addEventListener:(event,fn)=>{events[id+':'+event]=fn}});
 const doc={title:'',documentElement:{style:{setProperty:()=>{}}},getElementById:id=>elements.get(id)};
 const ctx={document:doc,location:{search},URLSearchParams,encodeURIComponent};
 script.runInNewContext(ctx,{timeout:2000});
 return {doc,elements,events};
}
let gallery=boot('');
const grid=gallery.elements.get('template-grid');
assert.equal((grid.innerHTML.match(/class="template-card"/g)||[]).length,60,'Gallery should show 60 cards');
assert.equal((grid.innerHTML.match(/data-business-photo/g)||[]).length,60,'Every card has an image');
assert.equal(gallery.elements.get('template-count').textContent,'60 templates found');
gallery.elements.get('template-category').value='Dental & Healthcare';gallery.events['template-category:change']();
assert.equal((grid.innerHTML.match(/class="template-card"/g)||[]).length,6,'Country/category filter must show 6');
gallery.elements.get('template-search').value='dental clinic';gallery.events['template-search:input']();
assert.equal((grid.innerHTML.match(/class="template-card"/g)||[]).length,1,'Search and category filter combine');
const heroImages=new Set();
for(let id=1;id<=60;id++){
 const demo=boot('?demo='+id);const h=demo.elements.get('app').innerHTML;
 assert(h.includes('class="demo-site'),'Missing demo for ID '+id);
 assert(h.includes('data-business-photo'),'Missing business photo for ID '+id);
 assert(h.includes('Request this design'),'Missing quote CTA for ID '+id);
 const src=h.match(/<div class="demo-photo"[^>]*><img src="([^"]+)"/);
 assert(src,'Hero image missing for ID '+id);
 heroImages.add(src[1]);
}
assert.equal(heroImages.size,60,'Every demo must have a distinct photo');
console.log('PASS: 60 gallery cards, image tags, category + search filters, 60 demo renders and quote links.');
