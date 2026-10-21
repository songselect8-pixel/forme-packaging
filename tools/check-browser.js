async (page) => {
  const base='D:/SongSelect/礼盒网站/forme-packaging/output/playwright/';
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const assert=(ok,message)=>{if(!ok)throw new Error(message);};
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';document.querySelectorAll('video').forEach(v=>v.pause());});
  await page.locator('#products img').evaluateAll(images=>images.forEach(i=>i.loading='eager'));
  await page.waitForFunction(()=>[...document.querySelectorAll('#products img')].every(i=>i.complete&&i.naturalWidth>0),null,{timeout:10000});
  await page.screenshot({path:base+'rebuilt-home-desktop.png'});
  assert(await page.locator('[data-product-card]').count()===78,'Homepage needs 78 product cards');
  const layout=await page.evaluate(()=>({nav:document.querySelector('.site-nav').getBoundingClientRect().toJSON(),hero:document.querySelector('#hero').getBoundingClientRect().toJSON(),heroText:document.querySelector('.hero-content').getBoundingClientRect().toJSON(),overflow:document.documentElement.scrollWidth>innerWidth}));
  assert(!layout.overflow,'Desktop homepage overflow');
  await page.locator('.nav-dropdown').first().hover();await page.screenshot({path:base+'rebuilt-menu-desktop.png'});
  await page.mouse.move(20,400);
  for(const [selector,name] of [['#products .products-grid','rebuilt-grid-desktop'],['#why','rebuilt-why-desktop'],['#process','rebuilt-process-desktop'],['#quote','rebuilt-quote-desktop']]){
    await page.locator(selector).evaluate(e=>e.scrollIntoView({behavior:'instant',block:'start'}));await page.waitForTimeout(250);await page.screenshot({path:base+name+'.png'});
  }
  const teaser=page.locator('.teaser-video video');await teaser.evaluate(v=>v.play());await page.waitForTimeout(350);assert(await teaser.evaluate(v=>!v.paused&&v.videoWidth===1280),'Original film must play');await teaser.evaluate(v=>v.pause());
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:base+'rebuilt-home-mobile.png'});
  await page.locator('.nav-toggle').click();assert(await page.locator('.nav-toggle').getAttribute('aria-expanded')==='true','Mobile menu failed');await page.screenshot({path:base+'rebuilt-menu-mobile.png'});
  await page.locator('#navLinks > li > a').filter({hasText:'Products'}).first().click();
  await page.waitForLoadState('networkidle');
  await page.locator('[data-filter="bags"]').click();assert(await page.locator('.catalog-section [data-product-card]:visible').count()===2,'Bag filter needs exactly 2 results');
  for(const category of ['corrugated-cartons','corrugated-boxes','white-card']){await page.locator('[data-filter="'+category+'"]').click();assert(await page.locator('.catalog-section [data-product-card]:visible').count()===6,'New series filter '+category);}
  await page.locator('[data-filter="rigid"]').click();assert((await page.locator('.catalog-section [data-product-card]:visible').count())>10,'Rigid filter failed');
  await page.locator('.catalog-section [data-product-card]:visible .product-name a').first().click();
  await page.waitForLoadState('networkidle');
  await page.locator('.zoomable').first().click();assert(await page.locator('#image-dialog').evaluate(d=>d.open),'Image enlargement failed');await page.keyboard.press('Escape');
  await page.locator('.detail-body .btn-primary').click();await page.waitForLoadState('networkidle');assert((await page.locator('#q-product').inputValue()).includes('Wellness'),'Product inquiry prefill failed');
  await page.setViewportSize({width:1440,height:1000});
  await page.locator('#estType').selectOption('drawer');await page.locator('#estQty').selectOption('5000');await page.locator('#estFinish').selectOption('foil');
  assert(await page.locator('#estimate-unit').textContent()==='$2.15','Estimator unit calculation failed');await page.locator('#use-estimate').click();
  assert((await page.locator('#q-product').inputValue()).includes('Drawer'),'Calculator transfer failed');
  await page.locator('#q-name').fill('Preview Test');await page.locator('#q-company').fill('Demo Brand');await page.locator('#q-email').fill('preview@example.com');await page.locator('#q-phone').fill('+1 555 0100');
  await page.locator('#q-file').setInputFiles({name:'preview-logo.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\nPreview test only')});
  await page.locator('[data-save-draft]').click();await page.reload({waitUntil:'networkidle'});assert(await page.locator('#q-name').inputValue()==='Preview Test','Draft did not restore');
  await page.locator('[name=nda]').check();await page.locator('[name=consent]').check();await page.locator('.btn-submit').click();
  assert(await page.locator('#brief-dialog').evaluate(d=>d.open),'Brief dialog failed');assert((await page.locator('#brief-preview').textContent()).includes('NDA requested'),'NDA missing');
  const download=page.waitForEvent('download');await page.locator('#download-brief').click();await (await download).saveAs(base+'verified-project-brief.txt');await page.keyboard.press('Escape');
  await page.locator('[data-clear-draft]').click();assert(await page.evaluate(()=>localStorage.getItem('forme-packaging-inquiry'))===null,'Draft clear failed');
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:base+'rebuilt-quote-page-desktop.png'});
  await page.locator('.faq-q').first().click();assert(await page.locator('.faq-q').first().getAttribute('aria-expanded')==='true','FAQ failed');
  const responsive=[];
  for(const route of ['/','/products/','/products/custom-magnetic-rigid-gift-box-manufacturer/','/industries/','/quote/','/blog/custom-gift-boxes-cost/','/product-series/color-printed-corrugated-cartons/','/product-series/color-printed-corrugated-boxes/','/product-series/color-printed-white-card-boxes/','/blog/white-card-folding-cartons-guide/','/products/printed-skincare-white-card-carton/']){
    await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:4173'+route,{waitUntil:'networkidle'});const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert(!overflow,'Mobile overflow '+route);responsive.push({route,overflow});
  }
  await page.setViewportSize({width:1440,height:1000});await page.goto('http://127.0.0.1:4173/products/',{waitUntil:'networkidle'});await page.screenshot({path:base+'rebuilt-catalog-desktop.png'});
  await page.goto('http://127.0.0.1:4173/products/custom-magnetic-rigid-gift-box-manufacturer/',{waitUntil:'networkidle'});await page.screenshot({path:base+'rebuilt-product-detail-desktop.png'});
  await page.goto('http://127.0.0.1:4173/industries/',{waitUntil:'networkidle'});await page.screenshot({path:base+'rebuilt-industries-desktop.png'});
  await page.goto('http://127.0.0.1:4173/blog/white-card-folding-cartons-guide/',{waitUntil:'networkidle'});await page.screenshot({path:base+'revised-article-desktop.png'});const articleImage=await page.locator('.article-lead img').evaluate(e=>({width:e.clientWidth,height:e.clientHeight}));assert(articleImage.width<=340&&articleImage.height<=230,'Article image must remain compact');await page.setViewportSize({width:390,height:844});await page.screenshot({path:base+'revised-article-mobile.png'});await page.locator('.contents a').first().click();assert((await page.locator('.article-prose section').first().boundingBox()).y>=65,'Article TOC anchor clears nav');
  await page.goto('http://127.0.0.1:4173/quote/?product=p73',{waitUntil:'networkidle'});assert((await page.locator('#q-product').inputValue()).includes('Skincare White Card'),'New series query prefill');await page.locator('#estType').selectOption('white-card');await page.locator('#use-estimate').click();assert((await page.locator('#q-product').inputValue()).includes('White Card'),'New estimator transfer');
  assert(errors.length===0,'Application error: '+errors.join('; '));return {browserQA:'passed',desktop:layout,responsive,applicationErrors:errors};
}
