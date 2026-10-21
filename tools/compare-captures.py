"""Internal QA comparison sheets. These are screenshots, not website image assets."""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
root=Path(__file__).resolve().parents[1]/'output'
pairs=[('home-desktop','rebuilt-home-desktop'),('home-mobile','rebuilt-home-mobile'),('product-grid-desktop','rebuilt-grid-desktop'),('catalog-desktop','rebuilt-catalog-desktop'),('product-detail-desktop','rebuilt-product-detail-desktop'),('industries-desktop','rebuilt-industries-desktop'),('quote-page-desktop','rebuilt-quote-page-desktop'),('process-desktop','rebuilt-process-desktop'),('menu-mobile','rebuilt-menu-mobile')]
out=root/'comparison';out.mkdir(exist_ok=True)
for source,target in pairs:
    a=Image.open(root/'reference'/(source+'.png')).convert('RGB');b=Image.open(root/'playwright'/(target+'.png')).convert('RGB')
    assert a.size==b.size,(source,a.size,b.size)
    sheet=Image.new('RGB',(a.width*2,a.height+40),'#e9e9df');sheet.paste(a,(0,40));sheet.paste(b,(a.width,40));draw=ImageDraw.Draw(sheet);draw.text((16,12),'REFERENCE',fill='#203b36');draw.text((a.width+16,12),'IMPLEMENTATION - AUTHORIZED STYLE & ASSET CHANGE',fill='#203b36');sheet.save(out/(source+'.jpg'),quality=90)
print('Created',len(pairs),'same-viewport comparison sheets.')
