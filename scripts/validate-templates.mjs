import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const js=readFileSync('templates/templates.js','utf8');
const html=readFileSync('index.html','utf8');
const css=readFileSync('templates/templates.css','utf8');
const marker='const templatePhotoIds=';
const start=js.indexOf(marker);
assert(start>=0,'Photo map missing');
const end=js.indexOf(';',start);
const ids=JSON.parse(js.slice(start+marker.length,end));
assert.equal(ids.length,60,'Must have 60 mapped photos');
assert.equal(new Set(ids).size,60,'Photo IDs must be unique');
assert(js.includes('Dental & Healthcare'),'Missing dental category');
for(const price of ['$499','$899','$1,599','$399','$699','$999'])assert(html.includes(price),'Missing price '+price);
assert(html.includes('Every Business')&&html.includes('Dental'));
assert(!['$297','$597','$1,197'].some(price=>html.includes(price)),'Old pricing still visible');
assert(js.includes('handlePhotoErrors(grid)')&&js.includes('handlePhotoErrors(root)'));
assert(css.includes('.photo-unavailable'));
console.log('PASS: 60 different photos, pricing, all-business copy, image fallbacks.');
if(process.env.CHECK_REMOTE==='1'){
 const failures=[],responses={};let cursor=0;
 const workers=Array.from({length:7},async()=>{while(cursor<ids.length){const i=cursor++;const url='https://images.unsplash.com/photo-'+ids[i]+'?auto=format&fit=crop&w=120&q=25';try{const res=await fetch(url,{method:'HEAD',signal:AbortSignal.timeout(15000)});responses[res.status]=(responses[res.status]||0)+1;if(res.status===404||res.status===410)failures.push({id:i+1,photo:ids[i],status:res.status});}catch(e){console.log('Network uncertain for demo '+(i+1)+': '+e.message)}}});
 await Promise.all(workers);console.log('Image status counts',JSON.stringify(responses));console.log('Confirmed broken image URLs',JSON.stringify(failures));if(failures.length)process.exitCode=1;
}
