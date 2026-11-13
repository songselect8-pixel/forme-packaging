async page => {
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  const routes=await page.evaluate(async()=>{
    const xml=new DOMParser().parseFromString(await(await fetch('/sitemap.xml')).text(),'application/xml');
    return [...xml.querySelectorAll('loc')].map(e=>new URL(e.textContent).pathname);
  });
  const results=[];
  for(const width of [1440,390]){
    await page.setViewportSize({width,height:width===1440?1000:844});
    for(const route of routes){
      const response=await page.goto('http://127.0.0.1:4173'+route,{waitUntil:'domcontentloaded'});
      await page.evaluate(()=>document.querySelectorAll('*').forEach(e=>{
        if(getComputedStyle(e).contentVisibility==='auto')e.style.contentVisibility='visible';
      }));
      const data=await page.evaluate(()=>({
        overflow:document.documentElement.scrollWidth>innerWidth+1,
        images:[...document.querySelectorAll('main img')].map(i=>{
          const r=i.getBoundingClientRect(),s=getComputedStyle(i);
          return {src:i.getAttribute('src'),context:i.parentElement.className||i.parentElement.parentElement.className,w:Math.round(r.width),h:Math.round(r.height),fit:s.objectFit};
        }).filter(i=>i.w>0&&i.h>i.w*1.05)
      }));
      if(data.overflow||data.images.length||response.status()!==200)results.push({route,width,status:response.status(),...data});
    }
  }
  return {pages:routes.length,viewports:2,flagged:results};
}
