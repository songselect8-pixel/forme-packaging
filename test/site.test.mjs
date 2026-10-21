import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync,statSync} from 'node:fs';
import path from 'node:path';
import {products,filterProducts,createBrief,estimateQuote} from '../dist/site-config.js';

test('60 reference product slots have distinct detail routes and correct filters',()=>{
  assert.equal(products.length,60);assert.equal(new Set(products.map(p=>p.slug)).size,60);assert.equal(filterProducts('all').length,60);
  for(const category of ['rigid','mailer','specialty','bags']){assert.ok(filterProducts(category).length>0);assert.ok(filterProducts(category).every(p=>p.category===category));}
  assert.equal(filterProducts('unknown').length,0);
});
test('planning estimator handles quantity, finishes and invalid input',()=>{
  const basic=estimateQuote('magnetic',500,'standard');assert.equal(basic.unit,3.2);assert.equal(basic.total,1600);
  assert.ok(estimateQuote('magnetic',5000,'standard').unit<basic.unit);assert.ok(estimateQuote('magnetic',500,'foil').unit>basic.unit);
  for(const args of [['bad',500,'standard'],['magnetic',-1,'standard'],['magnetic',500,'bad']])assert.throws(()=>estimateQuote(...args),RangeError);
});
test('inquiry brief preserves product, phone, file and NDA without claiming delivery',()=>{
  const brief=createBrief({name:'Alex',email:'alex@example.com',phone:'+1 555 0100',product:'Magnetic gift boxes',quantity:'500',message:'230 × 180 × 90 mm\nGold foil',attachmentName:'logo.pdf',nda:'on'});
  for(const text of ['Alex','+1 555 0100','logo.pdf','NDA requested','230 × 180 × 90 mm\nGold foil'])assert.ok(brief.includes(text));
  assert.match(brief,/not been sent/i);assert.doesNotMatch(brief,/undefined|null/);
});
test('complete route and media graph excludes reference contacts and trackers',()=>{
  const root=path.resolve('dist');const pages=readdirSync(root,{recursive:true}).filter(n=>n.endsWith('.html'));assert.ok(pages.length>=100);
  for(const name of pages){const html=readFileSync(path.join(root,name),'utf8');assert.doesNotMatch(html,/luxopack|formspree|googletagmanager|clarity\.ms|8613352991594/i,name);if(html.includes('http-equiv="refresh"'))continue;assert.equal((html.match(/<h1[ >]/g)||[]).length,1,name);
    for(const [,url] of html.matchAll(/(?:href|src|poster)="([^"]+)"/g)){if(/^(?:https?:|mailto:|tel:|blob:|data:)/.test(url))continue;const [resource,fragment]=url.split('#');const pathname=resource.split('?')[0];let file=pathname?path.resolve(pathname.startsWith('/')?root:path.dirname(path.join(root,name)),pathname.startsWith('/')?'.'+pathname:pathname):path.join(root,name);if(existsSync(file)&&statSync(file).isDirectory())file=path.join(file,'index.html');assert.ok(existsSync(file),`${name} missing ${url}`);if(fragment&&file.endsWith('.html'))assert.ok(readFileSync(file,'utf8').includes(`id="${fragment}"`),`${name} missing #${fragment}`);}
  }
  const home=readFileSync(path.join(root,'index.html'),'utf8');assert.equal((home.match(/data-product-card/g)||[]).length,60);
  for(const id of ['hero','supplier-facts','price-moq','clients','products','finishing','comparison','unboxing','why','certs','process','faq-general','testimonials','faq-products','blog-preview','faq','quote','insights'])assert.ok(home.includes(`id="${id}"`),id);
});
