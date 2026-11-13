import {readFileSync,readdirSync} from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist');
const pages=readdirSync(root,{recursive:true}).filter(n=>n.endsWith('/index.html')||n.endsWith('\\index.html')||n==='index.html').map(file=>{
  const html=readFileSync(path.join(root,file),'utf8');
  const value=pattern=>(html.match(pattern)||[])[1]||'';
  return {file,title:value(/<title>(.*?)<\/title>/s),description:value(/<meta name="description" content="([^"]*)"/),canonical:value(/<link rel="canonical" href="([^"]*)"/),h1:(html.match(/<h1[ >]/g)||[]).length,schema:(html.match(/type="application\/ld\+json"/g)||[]).length,openGraph:html.includes('property="og:description"'),words:html.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<[^>]*>/g,' ').split(/\s+/).length};
});
const duplicates=key=>Object.entries(Object.groupBy(pages,p=>p[key])).filter(([text,rows])=>!text||rows.length>1).map(([text,rows])=>({text,files:rows.map(p=>p.file)}));
console.log(JSON.stringify({pages:pages.length,missingTitle:pages.filter(p=>!p.title).length,missingDescription:pages.filter(p=>!p.description).length,missingCanonical:pages.filter(p=>!p.canonical).length,invalidH1:pages.filter(p=>p.h1!==1).length,duplicateTitles:duplicates('title'),duplicateDescriptions:duplicates('description'),descriptionsOver180:pages.filter(p=>p.description.length>180).length,titlesOver70:pages.filter(p=>p.title.length>70).length,schemaPages:pages.filter(p=>p.schema).length,completeOpenGraph:pages.filter(p=>p.openGraph).length,canonicalOrigins:[...new Set(pages.map(p=>new URL(p.canonical).origin))],sitemapURLs:(readFileSync('dist/sitemap.xml','utf8').match(/<loc>/g)||[]).length},null,2));
