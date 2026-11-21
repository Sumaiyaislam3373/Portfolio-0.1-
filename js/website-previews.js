(function(){
  'use strict';
  const language=window.PortfolioLanguage;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const hover=matchMedia('(hover: hover) and (pointer: fine)');
  const previews=[];
  document.querySelectorAll('.website-preview').forEach(preview=>{
    const viewport=preview.querySelector('.website-preview-viewport');
    const image=preview.querySelector('img');
    const button=preview.querySelector('.website-preview-toggle');
    let animation=null,active=false;
    const manual=()=>reduced.matches||document.documentElement.classList.contains('motion-disabled');
    function labels(){
      button.textContent=language.text(active?'previewReset':manual()?'previewManual':'previewPlay');
      button.setAttribute('aria-pressed',String(active));
      viewport.setAttribute('aria-label',language.text('previewRegion').replace('{project}',preview.dataset.name));
      preview.querySelector('.website-preview-hint').textContent=language.text(manual()?'previewManualHint':'previewHoverHint');
    }
    function reset(){
      active=false;
      if(animation){animation.cancel();animation=null;}
      preview.classList.remove('is-previewing','preview-manual');
      viewport.scrollTop=0;
      labels();
    }
    function play(){
      if(!image.complete||!image.naturalWidth)return;
      active=true;preview.classList.add('is-previewing');
      if(manual())preview.classList.add('preview-manual');
      else{
        if(animation)animation.cancel();
        const distance=Math.max(0,image.getBoundingClientRect().height-viewport.clientHeight);
        animation=image.animate([{transform:'translateY(0)'},{transform:'translateY(-'+distance+'px)'}],{duration:Math.max(12000,Math.min(30000,distance/100*1000)),easing:'linear',fill:'forwards'});
      }
      labels();
    }
    button.addEventListener('click',()=>active?reset():play());
    viewport.addEventListener('click',()=>{if(!manual()&&!hover.matches)active?reset():play();});
    preview.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'&&hover.matches&&!manual())play();});
    preview.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse'&&hover.matches&&!manual())reset();});
    preview.addEventListener('focusout',event=>{if(!preview.contains(event.relatedTarget))reset();});
    preview.addEventListener('keydown',event=>{if(event.key==='Escape'){reset();button.focus();}});
    image.addEventListener('error',()=>{reset();preview.classList.add('preview-error');button.disabled=true;});
    document.addEventListener('portfolio:language',labels);
    reduced.addEventListener('change',reset);
    new ResizeObserver(()=>{if(active)reset();}).observe(viewport);
    if('IntersectionObserver' in window)new IntersectionObserver(entries=>{if(!entries[0].isIntersecting&&active)reset();}).observe(preview);
    previews.push(reset);labels();
  });
  new MutationObserver(()=>previews.forEach(resetPreview=>resetPreview())).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
}());
