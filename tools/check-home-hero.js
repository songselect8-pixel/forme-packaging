async page=>{
  page.setDefaultTimeout(10000);
  const base=page.url(),checks=[],errors=[],failed=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)failed.push({url:r.url(),status:r.status()});});
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('#hero img').evaluate(i=>i.decode());
  for(const width of [320,390,768,1024,1440,1920,2560]){
    const height=width===390?844:width===2560?1229:1000;
    await page.setViewportSize({width,height});
    await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    const data=await page.evaluate(()=>{
      const hero=document.querySelector('#hero'),image=hero.querySelector('img'),r=hero.getBoundingClientRect(),m=image.getBoundingClientRect(),c=hero.querySelector('.hero-content').getBoundingClientRect();
      const h1=hero.querySelector('h1');
      return {width:document.documentElement.clientWidth,height:innerHeight,hero:{x:r.x,right:r.right,height:r.height},image:{x:m.x,y:m.y,right:m.right,width:m.width,height:m.height,naturalWidth:image.naturalWidth,naturalHeight:image.naturalHeight,fit:getComputedStyle(image).objectFit,display:getComputedStyle(image).display,attributesMatch:image.getAttribute('width')===String(image.naturalWidth)&&image.getAttribute('height')===String(image.naturalHeight)},copy:{right:c.right,bottom:c.bottom},headingOverflow:h1.scrollWidth>h1.clientWidth+1,overflow:document.documentElement.scrollWidth>innerWidth,heroVideo:!!hero.querySelector('video'),overlay:!!hero.querySelector('.hero-overlay'),schema:document.querySelectorAll('script[type="application/ld+json"]').length};
    });
    if(data.overflow||data.headingOverflow||data.heroVideo||data.overlay||Math.abs(data.hero.x)>1||Math.abs(data.hero.right-data.width)>1||data.image.x<0||data.image.right>data.width+1||data.image.fit!=='contain'||data.image.display==='none'||data.image.naturalWidth<1500||!data.image.attributesMatch||Math.abs(data.image.width/data.image.height-data.image.naturalWidth/data.image.naturalHeight)>.01||data.copy.right>data.width||(width>800?data.copy.right>data.image.x+1:data.copy.bottom>data.image.y+1))throw Error('Hero coverage or content failed: '+JSON.stringify(data));
    checks.push({viewport:width,...data});
    if(width===390||width===1440){
      await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
      await page.screenshot({path:'output/playwright/hero-refresh-'+(width===390?'mobile':'desktop')+'.png'});
    }
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(base,{waitUntil:'networkidle'});
  const showcase=page.locator('.products-showcase');
  await showcase.scrollIntoViewIfNeeded();
  await showcase.locator('img').evaluate(i=>i.decode());
  if(!await showcase.locator('img').getAttribute('src').then(s=>s.endsWith('/showcase.webp')))throw Error('Collection banner still reuses the hero');
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  await page.locator('#hero .btn-primary').click();await page.waitForURL(base+'quote/');
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('#hero .btn-outline').click();await page.waitForURL(base+'products/');
  if(errors.length||failed.length)throw Error(JSON.stringify({errors,failed}));
  return {passed:true,checks,heroLinks:true,errors,failed};
}
