import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import path from 'node:path';

test('canonical pages expose consistent metadata and parseable structured data',()=>{
  const pages=readdirSync('dist',{recursive:true}).filter(n=>n.endsWith('index.html')).map(n=>n.replaceAll('\\','/'));
  for(const file of pages){
    const html=readFileSync(path.join('dist',file),'utf8');
    const canonical=html.match(/rel="canonical" href="([^"]+)"/)[1];
    assert.ok(html.includes(`property="og:url" content="${canonical}"`),file);
    assert.match(html,/property="og:description" content="[^"]+"/,file);
    assert.match(html,/name="twitter:card" content="summary_large_image"/,file);
    const scripts=[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
    assert.equal(scripts.length,1,file);
    const graph=JSON.parse(scripts[0][1])['@graph'];
    assert.ok(graph.some(n=>n['@type']==='WebPage'&&n.url===canonical),file);
    if(file!=='index.html')assert.ok(graph.some(n=>n['@type']==='BreadcrumbList'),file);
    if(file.startsWith('blog')&&file!=='blog/index.html')assert.ok(graph.some(n=>n['@type']==='BlogPosting'),file);
    assert.ok(!graph.some(n=>n.offers||n.aggregateRating),file);
  }
});
