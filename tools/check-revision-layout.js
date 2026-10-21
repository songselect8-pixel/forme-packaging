async page=>{
 const out='output/playwright/';
 await page.setViewportSize({width:1440,height:1000});
 await page.goto('http://127.0.0.1:4173/product-series/color-printed-corrugated-cartons/',{waitUntil:'networkidle'});
 await page.screenshot({path:out+'revised-series-desktop.png'});
 await page.locator('.products-grid').first().scrollIntoViewIfNeeded();await page.waitForTimeout(250);
 await page.screenshot({path:out+'revised-series-applications.png'});
 await page.goto('http://127.0.0.1:4173/blog/custom-gift-boxes-buyer-guide/',{waitUntil:'networkidle'});
 await page.screenshot({path:out+'revised-article-desktop.png'});
 const image=await page.locator('.article-lead img').evaluate(e=>({width:e.clientWidth,height:e.clientHeight,loaded:e.naturalWidth>0}));
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:out+'revised-article-mobile.png'});
 await page.locator('.article-prose').scrollIntoViewIfNeeded();await page.screenshot({path:out+'revised-article-reading-mobile.png'});
 return {image,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)};
}