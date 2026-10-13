import {readFileSync,readdirSync,existsSync,statSync} from "node:fs";
import {createHash} from "node:crypto";
import assert from "node:assert/strict";
const read = path => readFileSync(path,"utf8");
const home=read("index.html"),index=read("blog/index.html"),payment=read("payment/index.html"),css=read("premium-service-plans.css");
const gallery=read("templates/templates.js");
const manifest=JSON.parse(read("blog/photo-manifest.json"));
const blogPosts=readdirSync("blog",{withFileTypes:true}).filter(e=>e.isDirectory()&&e.name!=="images").map(e=>e.name);
const photos=readdirSync("blog/images").filter(name=>name.endsWith(".webp"));
assert.equal(blogPosts.length,100,"Expected 100 individual posts");
assert.equal(photos.length,100,"Expected 100 locally stored blog photo assets");
const sha=new Set();
for(const name of photos){
 const file="blog/images/"+name;
 const buf=readFileSync(file);
 assert(buf.length>2000,"Tiny photo: "+file);
 assert(buf.toString("ascii",0,4)==="RIFF"&&buf.toString("ascii",8,12)==="WEBP","Invalid WebP: "+file);
 sha.add(createHash("sha256").update(buf).digest("hex"));
}
assert.equal(sha.size,100,"Photos contain duplicate files");
for(const slug of blogPosts){
 const article=read("blog/"+slug+"/index.html");
 const src="/blog/images/"+slug+".webp";
 assert(article.includes('<figure class="hero-photo"><img src="'+src+'"'),"Wrong hero source: "+slug);
 assert(article.includes('content="https://xsurajteach.netlify.app'+src+'"'),"Wrong OG image: "+slug);
 assert(article.includes('<meta name="twitter:image"'),"Missing social cover: "+slug);
 assert(article.includes('/site-footer.js'),"Footer missing: "+slug);
}
const gallerySrc=[...index.matchAll(/<img class="card-photo" src="([^"]+)"/g)].map(x=>x[1]);
assert.equal(gallerySrc.length,100,"Missing blog cards");
assert.equal(new Set(gallerySrc).size,100,"Blog listing images repeated");
for(const src of gallerySrc)assert(existsSync(src.slice(1)),"Image URL missing: "+src);
assert.equal(manifest.categories.length,10);
assert.equal(new Set(manifest.categories.flatMap(x=>x.photoIds)).size,100);
const ids=[...home.matchAll(/\sid="([^"]+)"/g)].map(x=>x[1]);
assert.equal(new Set(ids).size,ids.length,"Duplicate homepage DOM id");

// Ordering requested by the owner: the website showcase/build plans sit at the
// start of the homepage, and the voice plans/blog preview follow the Features
// section in the middle. Keep the original six plan CTAs and four blog links.
const orderedSections=[
 "id=\"top\"",
 "id=\"design-examples\"",
 "id=\"service-plans\"",
 "id=\"scenarios\"",
 "id=\"problem\"",
 "id=\"how\"",
 "id=\"features\"",
 "id=\"ai-service-plans\"",
 "id=\"latest-blogs\"",
 "id=\"pricing\""
];
let lastSectionPos=-1;
for(const marker of orderedSections){
 const pos=home.indexOf(marker);
 assert(pos>lastSectionPos,`Homepage section order broken at ${marker}`);
 lastSectionPos=pos;
}
assert(home.includes('id="premium-website-plans"')&&home.includes('id="premium-voice-plans"'),"Website or AI price group missing");
assert(home.includes('href="#ai-service-plans"'),"Website pricing must link to later AI plans");
assert.equal((home.match(/class="featured-demo-card/g)||[]).length,5);
assert.equal((home.match(/class="premium-plan-card/g)||[]).length,6);
assert.equal((home.match(/class="premium-blog-card/g)||[]).length,4);
assert.equal((home.match(/class="premium-plan-mark" aria-hidden="true"><img src="\/robot-logo.svg"/g)||[]).length,3);
for(const plan of ["website-starter","website-growth","website-pro","voice-normal","voice-pro","voice-ultra-pro"]){
 assert(home.includes('/payment/#'+plan),"Missing CTA "+plan);
 assert(payment.includes('id="'+plan+'"'),"Missing payment destination "+plan);
}
for(const slug of ["ai-voice-receptionist-explained","reducing-missed-calls-at-dental-practices","local-seo-basics-for-new-business-websites","mobile-first-websites-for-service-businesses"]){
 assert(existsSync("blog/"+slug+"/index.html"),"Featured blog article missing: "+slug);
 assert(home.includes('/blog/images/'+slug+'.webp'),"Featured blog photo missing: "+slug);
}
for(const price of ["$399","$699","$999","$499","$899","$1,599"])assert(home.includes(price)&&payment.includes(price),"Pricing not aligned: "+price);
for(const bad of ["$297","$597","$1,197"])assert(!home.includes(bad),"Legacy price on homepage: "+bad);
assert(home.includes("id=\"auth-login\"")&&home.includes("id=\"scenario-grid\"")&&home.includes('href="/templates/"'));
assert(gallery.includes("const templatePhotoIds="),"60 template images lost");
assert(existsSync("robot-logo.svg")&&existsSync("site-footer.js"));
assert(css.includes("@media(max-width:750px)")&&css.includes("@media(max-width:460px)"));
console.log("PASS: 100 unique valid WebP images and blog covers; 5 example previews, 6 aligned payment plans, 4 blog previews, mobile layout and existing functionality preserved.");
