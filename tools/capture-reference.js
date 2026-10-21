async (page) => {
  const base='D:/SongSelect/礼盒网站/forme-packaging/output/reference/';
  await page.route(/googletagmanager|clarity\.ms|google-analytics/,route=>route.abort());
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('https://luxopack.com/',{waitUntil:'domcontentloaded',timeout:25000});
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';document.querySelectorAll('video').forEach(v=>v.pause());document.querySelectorAll('section,.product-card').forEach(e=>e.style.contentVisibility='visible');document.querySelectorAll('.reveal').forEach(e=>{e.style.opacity='1';e.style.transform='none';e.style.transition='none';});});
  await page.waitForTimeout(600);
  await page.screenshot({path:base+'home-desktop.png'});
  const layout=await page.evaluate(()=>({viewport:[innerWidth,innerHeight],nav:document.querySelector('nav').getBoundingClientRect().toJSON(),hero:document.querySelector('#hero').getBoundingClientRect().toJSON(),heroText:document.querySelector('.hero-content').getBoundingClientRect().toJSON(),products:document.querySelectorAll('#products .product-card').length,sections:[...document.querySelector('main').children].filter(e=>e.offsetHeight>0).map(e=>({id:e.id,height:Math.round(e.offsetHeight),heading:e.querySelector('h2')?.textContent.trim()}))}));
  for(const [selector,name] of [['#products .products-grid','product-grid-desktop'],['#why','why-desktop'],['#process','process-desktop'],['#quote','quote-desktop']]){
    await page.locator(selector).evaluate(e=>e.scrollIntoView({behavior:'instant',block:'start'}));
    await page.waitForTimeout(300);
    await page.screenshot({path:base+name+'.png'});
  }
  await page.locator('#faq-products .faq-q').first().click();
  await page.screenshot({path:base+'faq-open-desktop.png'});
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.screenshot({path:base+'home-mobile.png'});
  await page.locator('.nav-toggle').click();
  await page.screenshot({path:base+'menu-mobile.png'});
  await page.locator('.nav-toggle').click();
  await page.setViewportSize({width:1440,height:1000});
  for(const [route,name] of [['products','catalog-desktop'],['products/custom-magnetic-rigid-gift-box-manufacturer','product-detail-desktop'],['industries','industries-desktop'],['quote','quote-page-desktop']]){
    await page.goto('https://luxopack.com/'+route,{waitUntil:'domcontentloaded',timeout:20000});
    await page.waitForTimeout(300);
    await page.screenshot({path:base+name+'.png'});
  }
  return {referenceCapture:'passed',...layout};
}
