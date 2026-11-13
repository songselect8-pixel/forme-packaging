async page => {
  const results=[];
  for(const width of [1440,390]){
    await page.setViewportSize({width,height:width===1440?1000:844});
    for(const [route,selector] of [['/','.unboxing-card img, #blog-preview .blog-card img'],['/blog/','.blog-card img'],['/industries/','.industry-card img']]){
      await page.goto('http://127.0.0.1:4173'+route,{waitUntil:'networkidle'});
      await page.evaluate(()=>document.querySelectorAll('*').forEach(e=>{
        if(getComputedStyle(e).contentVisibility==='auto')e.style.contentVisibility='visible';
      }));
      const images=await page.locator(selector).evaluateAll(xs=>xs.map(i=>{
        const r=i.getBoundingClientRect();
        return {src:i.getAttribute('src'),width:Math.round(r.width),height:Math.round(r.height)};
      }));
      results.push({route,viewport:width,images});
    }
  }
  const failures=results.flatMap(r=>r.images.filter(i=>i.height>i.width*.78).map(i=>({...i,route:r.route,viewport:r.viewport})));
  if(failures.length)throw new Error('Landscape images rendered too tall: '+JSON.stringify(failures));
  return {passed:true,checked:results.reduce((n,r)=>n+r.images.length,0),results};
}
