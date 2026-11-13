import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import path from 'node:path';

const basePath=(process.env.SITE_BASE_PATH||'').replace(/\/$/,'');
test('project-site URLs retain the repository path, including legacy redirects',{skip:!basePath},()=>{
  for(const file of readdirSync('dist',{recursive:true}).filter(n=>n.endsWith('.html'))){
    const html=readFileSync(path.join('dist',file),'utf8');
    for(const [,url] of html.matchAll(/(?:href|src|poster|action)="(\/[^"\s]*)"/g)){
      assert.ok(url.startsWith(basePath+'/'),`${file}: ${url} escapes the project website`);
    }
    for(const [,url] of html.matchAll(/http-equiv="refresh" content="\d+;url=([^\"]+)"/g)){
      assert.ok(url.startsWith(basePath+'/'),`${file}: redirect escapes the project website`);
    }
  }
  assert.match(readFileSync('dist/reference-layout.css','utf8'),/url\(['"]?\.\/assets\/sans\.ttf/);
  const home=readFileSync('dist/index.html','utf8');
  assert.ok(home.includes(`rel="canonical" href="${process.env.SITE_ORIGIN}/"`));
});
