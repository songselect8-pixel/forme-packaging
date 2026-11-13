async page=>{
  const out='output/playwright/';
  async function ready(){
    await page.evaluate(()=>{
      document.documentElement.style.scrollBehavior='auto';
      document.querySelectorAll('*').forEach(e=>{if(getComputedStyle(e).contentVisibility==='auto')e.style.contentVisibility='visible'});
      document.querySelectorAll('video').forEach(v=>v.pause());
    });
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await ready();
  await page.locator('#unboxing').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));
  await page.locator('#unboxing img').evaluateAll(async xs=>{xs.forEach(i=>i.loading='eager');await Promise.all(xs.map(i=>i.decode()))});
  await page.screenshot({path:out+'local-home-unboxing.png'});
  await page.goto('http://127.0.0.1:4173/blog/',{waitUntil:'networkidle'});await ready();
  await page.locator('.blog-card-grid').scrollIntoViewIfNeeded();
  await page.locator('.blog-card img').evaluateAll(async xs=>{xs.forEach(i=>i.loading='eager');await Promise.all(xs.map(i=>i.decode()))});
  await page.screenshot({path:out+'local-blog-desktop.png'});
  await page.goto('http://127.0.0.1:4173/products/long-gift-box-with-handle/',{waitUntil:'networkidle'});
  await page.locator('.detail-media img').evaluate(i=>i.decode());
  await page.screenshot({path:out+'local-long-box-detail.png'});
  await page.setViewportSize({width:390,height:844});
  await page.goto('http://127.0.0.1:4173/industries/',{waitUntil:'networkidle'});await ready();
  await page.locator('.industry-card img').first().evaluate(i=>i.decode());
  await page.screenshot({path:out+'local-industries-mobile.png'});
  await page.goto('http://127.0.0.1:4173/blog/',{waitUntil:'networkidle'});await ready();
  await page.locator('.blog-card img').first().evaluate(i=>i.decode());
  await page.screenshot({path:out+'local-blog-mobile.png'});
  return {captured:5};
}
