(function(){
  'use strict';
  const gallery=document.querySelector('.software-gallery');
  if(!gallery)return;
  const views=window.SoftwareViews;
  if(!Array.isArray(views)||!views.length)return;
  const language=window.PortfolioLanguage;
  const panel=gallery.querySelector('#software-panel');
  const stage=gallery.querySelector('.software-stage');
  const image=gallery.querySelector('.software-image');
  const placeholder=gallery.querySelector('.software-placeholder');
  const previous=gallery.querySelector('.software-prev');
  const next=gallery.querySelector('.software-next');
  const pagination=gallery.querySelector('.software-pagination');
  const picker=gallery.querySelector('.software-screen-picker');
  let current=0;
  let touch=null;
  const dots=views.map((view,index)=>{
    const button=document.createElement('button');
    button.type='button';button.id='software-tab-'+view.id;button.setAttribute('role','tab');button.setAttribute('aria-controls','software-panel');button.dataset.index=String(index);button.appendChild(document.createElement('span'));
    button.addEventListener('click',()=>select(index));pagination.appendChild(button);return button;
  });
  const screens=views.map((view,index)=>{
    const button=document.createElement('button');button.type='button';button.dataset.index=String(index);button.setAttribute('aria-controls','software-panel');button.addEventListener('click',()=>select(index));picker.appendChild(button);return button;
  });
  function caption(view){return view[language.get()]||view.en;}
  function select(index,announce=true){
    const nextIndex=Math.max(0,Math.min(views.length-1,index));
    const direction=nextIndex>=current?1:-1;
    const changed=nextIndex!==current;
    current=nextIndex;
    const view=views[current],copy=caption(view);
    panel.setAttribute('aria-labelledby',dots[current].id);
    gallery.querySelector('#software-screen-title').textContent=copy.title;
    gallery.querySelector('#software-screen-description').textContent=copy.description;
    gallery.querySelector('#software-slot-title').textContent=language.text('softwareSlotTitle').replace('{title}',copy.title);
    gallery.querySelector('#software-counter').textContent=(current+1)+' / '+views.length;
    const fullsize=gallery.querySelector('.software-fullsize');
    if(fullsize){fullsize.href=view.image;fullsize.setAttribute('aria-label',language.text('softwareFullsizeLabel').replace('{title}',copy.title));}
    placeholder.setAttribute('aria-label',language.text('softwareSlotTitle').replace('{title}',copy.title));
    previous.disabled=current===0;next.disabled=current===views.length-1;
    previous.setAttribute('aria-label',language.text('softwarePrevious'));next.setAttribute('aria-label',language.text('softwareNext'));
    pagination.setAttribute('aria-label',language.text('softwareChoose'));picker.setAttribute('aria-label',language.text('softwareChoose'));
    dots.forEach((button,i)=>{const title=caption(views[i]).title;button.setAttribute('aria-label',title);button.setAttribute('aria-selected',String(i===current));button.tabIndex=i===current?0:-1;});
    screens.forEach((button,i)=>{button.textContent=caption(views[i]).title;button.setAttribute('aria-pressed',String(i===current));});
    gallery.dataset.screen=view.id;
    image.hidden=true;placeholder.hidden=false;
    image.alt=language.text('softwareImageAlt').replace('{title}',copy.title);
    if(view.image){if(image.getAttribute('src')!==view.image)image.setAttribute('src',view.image);else if(image.complete&&image.naturalWidth>0){image.hidden=false;placeholder.hidden=true;}}
    else image.removeAttribute('src');
    if(announce)gallery.querySelector('#software-status').textContent=language.text('softwareAnnouncement').replace('{index}',String(current+1)).replace('{total}',String(views.length)).replace('{title}',copy.title);
    if(changed&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!document.documentElement.classList.contains('motion-disabled')&&panel.animate){panel.getAnimations().forEach(animation=>animation.cancel());panel.animate([{opacity:.5,transform:'translateX('+direction*10+'px)'},{opacity:1,transform:'translateX(0)'}],{duration:240,easing:'ease-out'});}
  }
  previous.addEventListener('click',()=>select(current-1));next.addEventListener('click',()=>select(current+1));
  pagination.addEventListener('keydown',event=>{
    let index=current;if(event.key==='ArrowRight')index=(current+1)%views.length;else if(event.key==='ArrowLeft')index=(current-1+views.length)%views.length;else if(event.key==='Home')index=0;else if(event.key==='End')index=views.length-1;else return;
    event.preventDefault();select(index);dots[index].focus();
  });
  panel.addEventListener('keydown',event=>{if(event.target!==panel)return;if(event.key==='ArrowRight'){event.preventDefault();select(current+1)}else if(event.key==='ArrowLeft'){event.preventDefault();select(current-1)}});
  stage.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse')touch={x:event.clientX,y:event.clientY};});
  stage.addEventListener('pointerup',event=>{if(!touch)return;const dx=event.clientX-touch.x,dy=event.clientY-touch.y;touch=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.2)select(current+(dx<0?1:-1));});
  stage.addEventListener('pointercancel',()=>{touch=null;});
  image.addEventListener('load',()=>{const view=views[current];if(view.image&&new URL(view.image,location.href).href===image.src&&image.naturalWidth>0){image.hidden=false;placeholder.hidden=true;}});
  image.addEventListener('error',()=>{image.hidden=true;placeholder.hidden=false;});
  document.addEventListener('portfolio:language',()=>select(current,false));
  gallery.querySelector('.software-controls').hidden=false;pagination.hidden=false;picker.hidden=false;select(0,false);
}());
