async page=>{
  page.setDefaultTimeout(10000);
  const checks=[];
  for(const width of [390,1440,1920,2560]){
    const height=width===390?844:width===2560?1229:1000;
    await page.setViewportSize({width,height});
    await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
    await page.locator('#hero img').evaluate(i=>i.decode());
    const data=await page.evaluate(()=>{
      const hero=document.querySelector('#hero'),image=hero.querySelector('img'),r=hero.getBoundingClientRect(),m=image.getBoundingClientRect(),c=hero.querySelector('.hero-content').getBoundingClientRect();
      return {width:document.documentElement.clientWidth,height:innerHeight,hero:{x:r.x,right:r.right,height:r.height},image:{x:m.x,right:m.right,height:m.height,fit:getComputedStyle(image).objectFit,display:getComputedStyle(image).display},copyRight:c.right,overflow:document.documentElement.scrollWidth>innerWidth,heroVideo:!!hero.querySelector('video'),schema:document.querySelectorAll('script[type="application/ld+json"]').length};
    });
    if(data.overflow||data.heroVideo||data.hero.height<height-1||Math.abs(data.hero.x)>1||Math.abs(data.hero.right-data.width)>1||Math.abs(data.image.x)>1||Math.abs(data.image.right-data.width)>1||data.image.fit!=='cover'||data.image.display==='none'||data.copyRight>data.width)throw Error('Hero coverage or content failed: '+JSON.stringify(data));
    checks.push({viewport:width,...data});
    if(width===390||width===2560){
      await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
      await page.screenshot({path:'output/playwright/print-revision-home-'+(width===390?'mobile':'desktop')+'.png'});
    }
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  const showcase=page.locator('.products-showcase');
  await showcase.scrollIntoViewIfNeeded();
  await showcase.locator('img').evaluate(i=>i.decode());
  if(!await showcase.locator('img').getAttribute('src').then(s=>s.endsWith('/showcase.webp')))throw Error('Collection banner still reuses the hero');
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  await showcase.screenshot({path:'output/playwright/print-revision-showcase.png'});
  return {passed:true,checks};
}
