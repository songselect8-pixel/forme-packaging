"""One-time structural capture preparation. Never imports reference media or scripts."""
from pathlib import Path
import json, re

ROOT=Path(__file__).resolve().parents[1]
source=json.loads((ROOT/'output/reference/catalog.json').read_text(encoding='utf-8'))
specs=[
('wellness','rigid','A fitted presentation for skincare, sleep accessories and coordinated wellness products.'),
('holiday','rigid','Seasonal colors, metallic details and a fitted layout for a festive beauty collection.'),
('candle','rigid','A coordinated tray for candle jars, oils and small home-fragrance accessories.'),
('vial','rigid','A protective rigid presentation with individual cavities for sample vials and bottles.'),
('magnetic','rigid','A book-style rigid structure with concealed magnets, custom paper wrap and branded finishing.'),
('mailer','mailer','A corrugated self-locking mailer with print inside and out, made around your product.'),
('drawer','rigid','A sliding inner tray and wrapped outer sleeve, with an optional ribbon pull and fitted lining.'),
('tube','rigid','A round paperboard presentation with a fitted lid and continuous wraparound branding.'),
('bag','bags','A reinforced paper shopping bag with your choice of paper, handle and printed details.'),
('rigid','rigid','A classic two-piece rigid gift box with a lift-off lid and coordinated interior.'),
('vial','rigid','A magnetic presentation box with a product-specific insert to keep a multi-item set arranged.'),
('rigid','rigid','A wrapped rigid lid-and-base box finished with satin ribbon and an optional gift tag.'),
('mailer','mailer','A natural kraft mailer with a convenient tear-opening format and customized print.'),
('drawer','rigid','A compact drawer presentation with a tactile paper wrap and a soft jewelry insert.'),
('magnetic','rigid','A magnetic gift box with carefully placed metallic artwork and a coordinated paper wrap.'),
('bag','bags','A retail paper bag with satin ribbon handles, reinforced base and custom brand artwork.'),
('corporate','specialty','A coordinated presentation for graduation gifts, notebooks, drinkware and small accessories.'),
('ramadan','specialty','A festive floral presentation with rich color, metallic details and a fitted gift arrangement.'),
('ramadan','specialty','An illustrated festival hamper concept with coordinated paper, decorative detail and an inner tray.'),
('ramadan','specialty','A refined presentation concept for ceremonial gifting and coordinated premium accessories.'),
('retail','specialty','A printed folding retail carton with a die-cut hanging tab for peg displays.'),
('retail','specialty','A custom printed folding carton with a product-specific size and tuck closure.'),
('mailer','mailer','A corrugated product carton balancing protective construction with clear brand presentation.'),
('mailer','mailer','A shipping carton sized around the packed product and transport requirements.'),
('phone','specialty','A retail accessory box with a fitted phone-case tray and coordinated branded sleeve.'),
('magnetic','rigid','A magnetic box with a printed or foil-detailed inner lid for an extra brand moment.'),
('drawer','rigid','A jewelry presentation with a soft fitted interior and a carefully chosen opening format.'),
('rigid','rigid','A tactile gift box with a soft ribbon finish and coordinated paper colors.'),
('wellness','specialty','A coordinated launch kit with a tailored inner layout for product samples and brand cards.'),
('candle','rigid','A protective presentation for a glass candle jar, with a fitted insert and branded wrap.'),
('rigid','rigid','A spacious presentation for apparel, scarves and accessories with tissue and a brand card.'),
('elongated','specialty','An elongated gift presentation with a satin carry handle and a fitted interior.'),
('hexagon','specialty','A six-sided rigid gift box with a lift-off lid and a coordinated protective lining.'),
('heart','specialty','A heart-shaped presentation with soft lining for small gifts, jewelry or occasions.'),
('pyramid','specialty','A geometric favor carton with an apex ribbon closure for small gifts and celebrations.'),
('gable','specialty','A carry-away gift carton with a gable top, integrated handle and printed paper exterior.'),
('chocolate','specialty','A confectionery presentation with individual dividers and a coordinated rigid outer box.'),
('collapsible','rigid','A fold-flat magnetic presentation offered as a coordinated color collection.'),
('collapsible','rigid','A blush-tone collapsible gift box with ribbon detail and a simple assembly format.'),
('wine','specialty','A tall single-bottle presentation with a fitted cradle and protective rigid construction.'),
('chocolate','specialty','A festive confectionery box with separate cavities for dates, chocolates or other treats.'),
('corporate','specialty','A fitted presentation for coordinated company gifts, drinkware, stationery and accessories.'),
('mailer','mailer','A branded corrugated mailer with coordinated tissue and an interior print option.'),
('hero','specialty','A reference kit for reviewing paper texture, ribbon color and finishing choices together.'),
('magnetic','rigid','A contrasting-color magnetic presentation with printed interiors and a coordinated outer wrap.'),
('wellness','rigid','An ivory beauty presentation with a product-specific insert for bottles, jars and accessories.'),
('chocolate','specialty','A dark-tone confectionery gift box with metallic dividers and a coordinated lift-off lid.'),
('coffee','specialty','A natural kraft presentation with a tailored paper tray for beauty or personal-care products.'),
('calendar','specialty','A seasonal presentation cabinet with individual numbered drawers for a series of small gifts.'),
('cabinet','specialty','A two-door calendar cabinet with a sequence of inner gift compartments.'),
('ramadan','specialty','An arch-shaped festive calendar with decorative paper details and individual compartments.'),
('ramadan','specialty','A festive drawer calendar concept with coordinated geometric artwork and numbered gift spaces.'),
('wine','specialty','A rigid bottle presentation with a protective interior and a carefully proportioned exterior.'),
('medal','specialty','A display case with a fitted lining for medals, coins and small collectible objects.'),
('keepsake','specialty','A reusable keepsake presentation with soft paper colors, ribbon and coordinated storage spaces.'),
('book','specialty','A book or journal presentation with a fitted tray, ribbon lift and an optional pen compartment.'),
('wellness','rigid','A fragrance presentation with a shaped bottle insert and coordinated paper or fabric details.'),
('coffee','specialty','A gift arrangement for tea tins, coffee pouches and tasting accessories in a fitted paper tray.'),
('retail','specialty','A printed presentation carton with a front display window and a fitted product base.'),
('wellness','rigid','A multi-item beauty and fragrance presentation with coordinated colors and a fitted interior.')
]
assert len(source)==len(specs)==60
renames={16:'Custom Graduation Gift Set',17:'Floral Festival Gift Collection',18:'Artisan Festival Gift Hamper',19:'Prestige Celebration Gift Set'}
products=[]; used=set()
for i,(ref,(image,category,description)) in enumerate(zip(source,specs)):
    name=renames.get(i,ref['title']).replace('— Color Range','— Color Collection')
    slug=(ref.get('path') or '/products/'+re.sub(r'[^a-z0-9]+','-',name.lower()).strip('-')).split('/')[-1]
    if slug in used: slug=re.sub(r'[^a-z0-9]+','-',name.lower()).strip('-')
    if slug in used: slug+='-'+str(i+1)
    used.add(slug)
    technical=[(k,re.sub(r'\bFSC\s*','',v)) for k,v in ref['meta'] if k not in ['MOQ','Lead Time','Standard']]
    if not technical: technical=[('Finish','Custom print')]
    products.append({'id':f'p{i+1:02d}','slug':slug,'name':name,'image':image,'category':category,'label':re.sub(r'^[^A-Za-z]+','',ref['tag']).upper(),'description':description,'meta':[['MOQ','To confirm'],['Lead time','By project'],list(technical[-1])],'material':'Wrapped rigid board' if category=='rigid' else 'Kraft / corrugated board' if category=='mailer' else 'Printed paperboard','finish':'Foil · Print · Embossing','insert':'Paper tray · Fabric · Fitted support'})
(ROOT/'dist/catalog-data.js').write_text('export const products = '+json.dumps(products,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
css=(ROOT/'output/reference/home.css').read_text(encoding='utf-8')
css=re.sub(r'/\*.*?\*/','',css,flags=re.S)
css=css.replace("'Montserrat'","'Atelier Sans'").replace("'Inter'","'Atelier Sans'")
colors={'#C9A84C':'#28685d','#c9a84c':'#28685d','#E8C96A':'#367e70','#0A0A0F':'#f8f6f0','#0a0a0f':'#f8f6f0','#12121A':'#efeee7','#12121a':'#efeee7','#1C1C28':'#ffffff','#1c1c28':'#ffffff','#FFFFFF':'#203b36','#ffffff':'#203b36','#8A8A9A':'#667a73','#fff':'#203b36','#060608':'#e5e9df'}
for a,b in colors.items():css=css.replace(a,b)
css=re.sub(r'rgba\(\s*255\s*,\s*255\s*,\s*255\s*,', 'rgba(32,59,54,',css)
css=re.sub(r'rgba\(\s*201\s*,\s*168\s*,\s*76\s*,', 'rgba(40,104,93,',css)
css=re.sub(r'rgba\(\s*(?:6,6,10|4,4,8|10,10,15)\s*,','rgba(248,246,240,',css)
css=re.sub(r'url\([^)]*\)','none',css)
css="@font-face{font-family:'Atelier Sans';src:url('/assets/sans.ttf') format('truetype');font-weight:200 800;font-display:swap}\n"+css
(ROOT/'dist/reference-layout.css').write_text(css,encoding='utf-8')
print('Prepared 60 original product records and the captured layout stylesheet.')
