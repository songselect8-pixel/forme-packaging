import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { products, filterProducts, createBrief } from '../dist/site-config.js';

test('catalog filters preserve all products and match each family', () => {
  assert.equal(filterProducts('all').length, 6);
  assert.deepEqual(filterProducts('rigid').map(p => p.id), ['magnetic', 'rigid', 'drawer', 'tube']);
  assert.equal(filterProducts('retail')[0].id, 'bag');
  assert.equal(filterProducts('unknown').length, 0);
  assert.equal(new Set(products.map(p => p.id)).size, products.length);
});

test('inquiry brief preserves customer requirements without claiming delivery', () => {
  const brief = createBrief({name:'Alex', email:'alex@example.com', product:'Magnetic gift boxes', quantity:'500', message:'230 × 180 × 90 mm\nGold foil, green paper'});
  assert.match(brief, /Alex/);
  assert.match(brief, /500/);
  assert.match(brief, /230 × 180 × 90 mm\nGold foil, green paper/);
  assert.match(brief, /not been sent/i);
  assert.doesNotMatch(brief, /undefined|null/);
});

test('every published page has working local links, images and anchors', () => {
  const root=path.resolve('dist');
  const pages=readdirSync(root).filter(name=>name.endsWith('.html'));
  assert.equal(pages.length,15);
  for(const name of pages){
    const html=readFileSync(path.join(root,name),'utf8');
    assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${name} needs one main heading`);
    assert.doesNotMatch(html,/luxopack\.com|api\.whatsapp\.com|FSC.certified|[\w.-]+@example\.com/i);
    for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
      const url=match[1];if(/^(?:https?:|mailto:|tel:)/.test(url))continue;
      const [resource,fragment]=url.split('#');
      const target=path.join(root,(resource||name).split('?')[0]);
      assert.ok(existsSync(target),`${name} missing ${url}`);
      if(fragment && target.endsWith('.html'))assert.ok(readFileSync(target,'utf8').includes(`id="${fragment}"`),`${name} missing anchor ${url}`);
    }
  }
});
