const text=html=>String(html??'').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const concise=value=>{const s=text(value);return s.length<=165?s:s.slice(0,163).replace(/\s+\S*$/,'')+'…';};

export function pageSeo({route,title,content,site,products,series,articles,industries}){
  const origin=site.origin.replace(/\/$/,'');
  const canonical=origin+(route==='/'?'/':route+'/');
  const product=products.find(p=>route==='/products/'+p.slug);
  const group=series.find(g=>route==='/product-series/'+g.slug);
  const article=articles.find(a=>route==='/blog/'+a.slug);
  const industry=industries.find(i=>route==='/industries/'+i[0]);
  const descriptions={
    '/':'Custom rigid gift boxes, full-color corrugated shipping cartons, printed mailers and white-card folding cartons. Explore structures, artwork and fitted inserts.',
    '/products':'Explore 78 custom packaging concepts: rigid gift boxes, drawers, tubes, printed corrugated cartons, mailers and white-card boxes. Plan your size and artwork.',
    '/industries':'Packaging for beauty, jewelry, candles, tea, food, apparel and electronics. Compare gift boxes, printed mailers and shipping cartons around your product.',
    '/blog':'Practical custom-packaging guides covering box structures, print color, materials, fitted inserts, sample approval, order quantities and quotation planning.',
    '/quote':'Prepare a custom packaging brief with your box type, product dimensions, artwork, quantity and delivery needs. Compare illustrative planning estimates.',
    '/certifications':'Review the company, material and testing documents to request for a packaging project. Certificate holders, scope and validity require verified company records.',
    '/about':'Explore FORME Packaging’s gift and retail packaging range and project workflow, from structure and artwork planning to physical sample review.',
    '/case-studies':'Explore illustrative beauty, corporate, confectionery and calendar packaging concepts, with fitted interiors and coordinated printing and finishing.'
  };
  const lead=text((content.match(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/)||[])[1]);
  const description=concise(product?`${product.name}: ${product.description}`:group?`${group.intro} ${group.print}`:article?article.intro:industry?industry[2]:descriptions[route]||lead||title);
  const imageName=product?.image||group?.image||article?.image||industry?.[3]||(route==='/'?'hero':'showcase');
  const image=origin+'/assets/'+imageName+'.webp';
  const organization={'@type':'Organization','@id':origin+'/#organization',name:site.company,url:origin+'/'};
  if(site.email)organization.email=site.email;
  if(site.phone)organization.telephone=site.phone;
  const graph=[organization,{'@type':'WebSite','@id':origin+'/#website',name:site.company,url:origin+'/',inLanguage:'en'},{'@type':'WebPage','@id':canonical+'#webpage',url:canonical,name:title,description,inLanguage:'en',isPartOf:{'@id':origin+'/#website'},primaryImageOfPage:{'@type':'ImageObject',url:image}}];
  if(route!=='/'){
    const crumbs=[['Home','/']];
    if(product||group)crumbs.push(['Products','/products/']);
    else if(article)crumbs.push(['Packaging guides','/blog/']);
    else if(industry)crumbs.push(['Industries','/industries/']);
    crumbs.push([title,route+'/']);
    graph.push({'@type':'BreadcrumbList',itemListElement:crumbs.map(([name,url],i)=>({'@type':'ListItem',position:i+1,name,item:origin+url}))});
  }
  if(article)graph.push({'@type':'BlogPosting',headline:article.title,description,image:[image],inLanguage:'en',datePublished:'2026-10-21',dateModified:'2026-10-21',mainEntityOfPage:{'@id':canonical+'#webpage'},author:{'@type':'Organization',name:site.company+' editorial',url:origin+'/about/'},publisher:{'@id':origin+'/#organization'}});
  return {canonical,description,image,imageAlt:product?.name||group?.name||article?.title||(industry?industry[1]+' packaging':title),type:article?'article':'website',jsonLd:JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c')};
}
