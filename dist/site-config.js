// 在这里统一替换品牌、邮箱、电话、WhatsApp 和地址，然后运行 npm run build。
import { products } from './catalog-data.js';
export { products };
export const site = {
  brand: 'FORME', company: 'FORME Packaging', tagline: 'Thoughtfully made. Beautifully received.',
  email: null, phone: null, whatsapp: null, address: null,
  origin: 'https://forme-packaging-studio.ready-vole-4943.chatgpt.site'
};

export function filterProducts(category = 'all') {
  return category === 'all' ? [...products] : products.filter(p => p.category === category);
}

export function createBrief(fields) {
  return `${site.company} — Packaging project brief\n\nName: ${fields.name || ''}\nEmail: ${fields.email || ''}\nPhone: ${fields.phone || 'Not specified'}\nCompany: ${fields.company || 'Not specified'}\nPackaging: ${fields.product || 'Please advise'}\nQuantity: ${fields.quantity || 'To discuss'}\nAttachment: ${fields.attachmentName || 'None selected'}\nConfidentiality: ${fields.nda ? 'NDA requested' : 'Not requested'}\n\nProject details\n${fields.message || ''}\n\nThis brief has not been sent. Please share it with your packaging contact.\n`;
}

export function estimateQuote(type,quantity,finish){
  const bases={magnetic:3.2,mailer:1.05,drawer:2.8,tube:2.6,foldable:2.2,bag:.95,rigid:2.5};
  const volumes={500:1,1000:.9,2000:.8,5000:.65,10000:.55};
  const finishes={standard:1,soft:1.12,foil:1.18,emboss:1.15,combined:1.4};
  if(!Object.hasOwn(bases,type)||!Object.hasOwn(volumes,quantity)||!Object.hasOwn(finishes,finish))throw new RangeError('Invalid planning selection');
  const unit=Math.round(bases[type]*volumes[quantity]*finishes[finish]*100)/100;
  return {unit,total:Math.round(unit*Number(quantity)*100)/100};
}

