async page=>{
  page.setDefaultTimeout(10000);
  const checks=[];
  for(const width of [1440,390]){
    await page.setViewportSize({width,height:width===1440?1000:844});
    for(const slug of ['long-gift-box-with-handle','printed-skincare-white-card-carton']){
      await page.goto('http://127.0.0.1:4173/products/'+slug+'/',{waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      const data=await page.evaluate(()=>{
        const image=document.querySelector('.detail-media img'),r=image.getBoundingClientRect();
        return {image:{width:r.width,height:r.height,fit:getComputedStyle(image).objectFit},rows:new Set([...document.querySelectorAll('.hero-stats>div')].map(e=>Math.round(e.getBoundingClientRect().y))).size};
      });
      if(data.image.fit!=='contain'||Math.abs(data.image.width/data.image.height-1.5)>.03)throw new Error('Product photograph is cropped: '+JSON.stringify({slug,width,...data}));
      if(data.rows!==(width===1440?1:2))throw new Error('Uneven specification rows: '+JSON.stringify({slug,width,...data}));
      checks.push({slug,width,...data});
    }
  }
  const cards=[];
  for(const width of [1440,390]){
    await page.setViewportSize({width,height:width===1440?1000:844});
    await page.goto('http://127.0.0.1:4173/products/',{waitUntil:'networkidle'});
    await page.locator('.catalog-section').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));
    await page.locator('.product-img img').evaluateAll(async images=>{
      images.forEach(i=>i.loading='eager');
      await Promise.all(images.map(i=>i.decode()));
    });
    for(const hover of [false,true]){
      if(hover)await page.locator('.product-card').first().hover();
      const images=await page.locator('.product-img img').evaluateAll(xs=>xs.map(i=>{
        const r=i.getBoundingClientRect(),s=getComputedStyle(i);
        return {ratio:r.width/r.height,fit:s.objectFit,transform:s.transform,loaded:!!i.naturalWidth};
      }));
      if(images.length!==78||images.some(i=>Math.abs(i.ratio-1.5)>.03||i.fit!=='contain'||!['none','matrix(1, 0, 0, 1, 0, 0)'].includes(i.transform)||!i.loaded))throw new Error('Product card photograph is clipped');
      cards.push({width,hover,images:images.length,passed:true});
    }
    if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw new Error('Product catalog has horizontal overflow');
    await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    await page.screenshot({path:'output/playwright/image-refresh-'+(width===1440?'desktop':'mobile')+'.png'});
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  const teaser=page.locator('.teaser-video video');
  await teaser.scrollIntoViewIfNeeded();
  const film=await teaser.evaluate(async v=>{
    await v.play();
    const info={width:v.videoWidth,height:v.videoHeight,duration:v.duration,paused:v.paused};
    v.pause();return info;
  });
  if(film.width!==1280||film.height!==720||film.duration!==12||film.paused)throw new Error('Updated film does not play');
  return {passed:true,checks,cards,film};
}
