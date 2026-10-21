import { site, products, filterProducts, createBrief } from './site-config.js';

const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu(){ menu?.setAttribute('aria-expanded','false'); menu?.setAttribute('aria-label','Open navigation'); navigation?.classList.remove('is-open'); }
menu?.addEventListener('click',()=>{ const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded',String(open)); menu.setAttribute('aria-label',open?'Close navigation':'Open navigation'); navigation.classList.toggle('is-open',open); });
document.addEventListener('keydown',event=>{if(event.key==='Escape') closeMenu();});
document.addEventListener('click',event=>{if(!event.target.closest('.header')) closeMenu();});
navigation?.addEventListener('click',event=>{if(event.target.closest('a')) closeMenu();});

document.querySelectorAll('dialog').forEach(dialog=>{
  dialog.querySelector('[data-close-dialog]')?.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.target===dialog && (event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dialog.close();});
});
document.querySelectorAll('[data-policy]').forEach(button=>button.addEventListener('click',()=>document.querySelector('#policy-dialog').showModal()));
const filmDialog = document.querySelector('#film-dialog');
const video = filmDialog.querySelector('video');
document.querySelectorAll('[data-film]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();filmDialog.showModal();video.play().catch(()=>{});}));
filmDialog.addEventListener('close',()=>video.pause());

const filterButtons=[...document.querySelectorAll('[data-filter]')];
function filter(category){
  if(!filterButtons.some(b=>b.dataset.filter===category)) category='all';
  const matches=new Set(filterProducts(category).map(p=>p.id));
  document.querySelectorAll('.catalog-grid .product-card').forEach((card,index)=>{card.hidden=!matches.has(products[index].id);});
  filterButtons.forEach(b=>{const active=b.dataset.filter===category;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  const count=document.querySelector('#result-count');if(count)count.textContent=`${matches.size} collection${matches.size===1?'':'s'}`;
}
filterButtons.forEach(button=>button.addEventListener('click',()=>{filter(button.dataset.filter);const url=new URL(location.href);if(button.dataset.filter==='all')url.searchParams.delete('category');else url.searchParams.set('category',button.dataset.filter);history.replaceState(null,'',url);}));
if(filterButtons.length)filter(new URLSearchParams(location.search).get('category')||'all');

const form=document.querySelector('#inquiry-form');
if(form){
  const status=document.querySelector('#form-status');
  const draftKey='forme-packaging-inquiry';
  const names=['name','email','company','product','quantity','message'];
  let brief='';
  try{const saved=JSON.parse(localStorage.getItem(draftKey)||'null');if(saved && typeof saved==='object'){for(const name of names)if(typeof saved[name]==='string')form.elements[name].value=saved[name];status.textContent='Your saved draft has been restored on this device.';}}catch{/* Private browsing or a damaged draft must not prevent an inquiry. */}
  const requested=products.find(p=>p.id===new URLSearchParams(location.search).get('product'));
  if(requested)form.elements.product.value=requested.name;
  document.querySelector('#save-draft').addEventListener('click',()=>{try{const data=Object.fromEntries(names.map(name=>[name,form.elements[name].value]));localStorage.setItem(draftKey,JSON.stringify(data));status.textContent='Draft saved in this browser. Your details have not been sent.';}catch{status.textContent='This browser cannot save a draft. You can still prepare and download your project brief.';}});
  document.querySelector('#clear-draft').addEventListener('click',()=>{try{localStorage.removeItem(draftKey);status.textContent='Saved draft cleared from this browser.';}catch{status.textContent='Browser storage is unavailable.';}});
  form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const data=Object.fromEntries(new FormData(form));brief=createBrief(data);document.querySelector('#brief-preview').textContent=brief;document.querySelector('#brief-dialog').showModal();});
  document.querySelector('#download-brief').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([brief],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='forme-packaging-project-brief.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  document.querySelector('#email-brief')?.addEventListener('click',()=>{if(site.email)location.href=`mailto:${encodeURIComponent(site.email)}?subject=${encodeURIComponent('Custom packaging inquiry')}&body=${encodeURIComponent(brief)}`;});
}
