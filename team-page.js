'use strict';
(() => {
  function openLegacyRoute() {
    if (!/^#\/(?:zh|en)\//.test(location.hash)) return false;
    location.replace('/browse.html' + location.search + location.hash);
    return true;
  }
  if (openLegacyRoute()) return;
  window.addEventListener('hashchange', openLegacyRoute);
  const profileCard = document.querySelector('a[data-profile-url]');
  if (profileCard) profileCard.href = profileCard.dataset.profileUrl;
  const field=document.getElementById('mentor-query');
  const pager=document.getElementById('mentor-pages');
  const cards=Array.from(document.querySelectorAll('#mentor-list > .gallery-list-item'));
  field.closest('label').hidden=false;
  pager.hidden=false;
  let page=1;
  function update(){
    const query=field.value.trim().toLocaleLowerCase();
    const found=cards.filter(card=>card.textContent.toLocaleLowerCase().includes(query));
    const count=Math.max(1,Math.ceil(found.length/18));
    page=Math.max(1,Math.min(page,count));
    for(const card of cards)card.hidden=true;
    for(const card of found.slice((page-1)*18,page*18))card.hidden=false;
    document.getElementById('mentor-count').textContent=found.length+' 位導師';
    pager.replaceChildren();
    if(count>1)for(let index=1;index<=count;index++){
      const button=document.createElement('button');
      button.type='button';button.textContent=index;button.dataset.page=index;
      if(index===page)button.setAttribute('aria-current','page');
      pager.append(button);
    }
  }
  field.addEventListener('input',()=>{page=1;update()});
  pager.addEventListener('click',event=>{const button=event.target.closest('button[data-page]');if(button){page=Number(button.dataset.page);update();document.getElementById('mentor-index').scrollIntoView()}});
  document.querySelector('.mobile-toggle')?.addEventListener('click',event=>{
    const button=event.currentTarget;
    const open=document.querySelector('.navbar-4').classList.toggle('menu-open');
    button.setAttribute('aria-expanded',String(open));
  });
  document.querySelector('.back2top')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  for(const form of document.querySelectorAll('form'))form.addEventListener('submit',event=>event.preventDefault());
  update();
})();
