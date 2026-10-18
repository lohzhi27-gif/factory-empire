
/* Factory Empire v0.3 dashboard: presentation only, preserves the existing simulation and save keys. */
(function dashboardUpgrade(){
  'use strict';
  const icons={
    factory:'<path d="M3 21V7l6 3V6l6 3V3l6 3v15z"/><path d="M7 15h2m3 0h2m3 0h1M7 19h2m3 0h2m3 0h1"/>',
    orders:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3.5h6M9 9h6M9 13h6M9 17h4"/>',
    customers:'<path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    machine:'<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 10h18M8 5v15M11 14h6M14 14v3M16 8h2"/>',
    money:'<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M5 9h1m12 6h1"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18M8 15h3m2 0h3"/>',
    truck:'<path d="M3 6h11v12H3zM14 10h4l3 4v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
    star:'<path d="m12 2 3.1 6.3 7 .9-5 5 .9 7-6-3.2L6 21l1-7-5-5 7-.9z"/>',
    wallet:'<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 10h18m-5 4h2"/>'
  };
  const ico=name=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+(icons[name]||icons.factory)+'</svg>';
  const grid=document.querySelector('.gamegrid');
  if(!grid)return;
  grid.classList.add('dashboard-v03');
  const left=grid.children[0],ops=grid.children[1];
  if(!left||!ops)return;
  left.classList.add('workshop-column');
  ops.classList.add('operations-panel');
  const lower=document.createElement('div');
  lower.className='lower-panels';
  [...left.querySelectorAll(':scope > .bottom-left')].forEach(row=>lower.appendChild(row));
  grid.appendChild(lower);
  const opsHeader=document.createElement('div');
  opsHeader.className='heading';
  opsHeader.innerHTML='<div class="heading-title"><span class="panel-icon">▤</span><div><h2>Production & orders</h2><small>Manage your contracts, machines and accounts</small></div></div>';
  ops.insertBefore(opsHeader,ops.firstChild);
  const title=document.querySelector('.identity h1');
  if(title)title.innerHTML='FACTORY <em>EMPIRE</em>';
  const logo=document.querySelector('.logo');
  if(logo){logo.textContent='F';logo.setAttribute('aria-label','Factory Empire original monogram');}
  const tagline=document.querySelector('.identity p');
  if(tagline)tagline.textContent='INDUSTRIAL TYCOON · PRODUCTION PREVIEW v0.3.2';
  document.title='Factory Empire — Industrial Tycoon v0.3';
  const topbar=document.querySelector('.topbar');
  const nav=document.createElement('nav');
  nav.className='main-nav';
  nav.setAttribute('aria-label','Game navigation');
  const navs=[
    ['workshop','Workshop','factory'],['orders','Production','orders'],['rfqs','Customers','customers'],
    ['machines','Machines','machine'],['reports','Finance','money']
  ];
  nav.innerHTML=navs.map(([key,label,ic])=>'<button type="button" data-nav="'+key+'" aria-label="'+label+'">'+ico(ic)+'<span>'+label+'</span></button>').join('')
    +'<span class="nav-spacer"></span><button type="button" class="nav-next" id="navNext">'+ico('calendar')+'<span>+ 1 Day</span></button>';
  topbar.after(nav);
  const stage=left.querySelector('.panel'),floor=stage?.querySelector('.factory');
  const stageTitle=stage?.querySelector('.heading h2');
  if(stageTitle)stageTitle.textContent='PERAI PRECISION WORKS — MAIN HALL';
  const stageSmall=stage?.querySelector('.heading small');
  if(stageSmall)stageSmall.textContent='Isometric workshop · tap machines to inspect';
  const badge=document.createElement('div');
  badge.className='scene-badge';
  badge.innerHTML='<span>FACTORY SIMULATION</span><strong id="sceneDay">DAY 1</strong>';
  if(floor)floor.appendChild(badge);
  const topActions=stage?.querySelector('.heading .tools');
  const focusButton=document.createElement('button');
  focusButton.className='btn minor ghost';
  focusButton.id='focusFactoryBtn';
  focusButton.textContent='⛶ Expand floor';
  focusButton.type='button';
  if(topActions)topActions.insertBefore(focusButton,topActions.firstChild);
  focusButton.addEventListener('click',()=>{
    document.body.classList.toggle('floor-expanded');
    focusButton.textContent=document.body.classList.contains('floor-expanded')?'✕ Close floor':'⛶ Expand floor';
    if(document.body.classList.contains('floor-expanded'))stage.scrollIntoView({block:'start'});
  });
  const tabLabels={rfqs:'New RFQs',orders:'Production',machines:'Equipment',reports:'Finance'};
  function highlight(key){
    nav.querySelectorAll('[data-nav]').forEach(btn=>{const active=btn.dataset.nav===key;btn.classList.toggle('active',active);btn.setAttribute('aria-current',active?'page':'false');});
  }
  function navigate(key){
    if(key==='workshop'){
      highlight(key);
      stage?.scrollIntoView({behavior:'smooth',block:'start'});
      return;
    }
    tabTo(key);
    highlight(key);
    ops.scrollIntoView({behavior:'smooth',block:'start'});
  }
  nav.addEventListener('click',e=>{
    const button=e.target.closest('button');
    if(!button)return;
    if(button.id==='navNext'){document.getElementById('nextDayBtn')?.click();return;}
    if(button.dataset.nav)navigate(button.dataset.nav);
  });
  const factoryTitle=left.querySelector('.heading h2');
  const sideTabs=ops.querySelector('.tabs');
  if(sideTabs)sideTabs.setAttribute('aria-label','Production and account views');
  document.addEventListener('click',e=>{
    const b=e.target.closest('button');
    if(b?.dataset?.tab)highlight(b.dataset.tab);
  });
  const statIcons=['money','calendar','orders','wallet','truck','star'];
  const originalStats=renderStats;
  renderStats=function(){
    originalStats();
    const cards=[...document.querySelectorAll('#stats .stat')];
    cards.forEach((card,i)=>{
      const em=document.createElement('span');
      em.className='stat-icon';
      em.innerHTML=ico(statIcons[i]);
      card.prepend(em);
    });
    const d=document.getElementById('sceneDay');
    if(d)d.textContent='DAY '+state.day;
  };
  // Keep the existing buttons; this direct shortcut is useful on phones.
  const ordersPage=ops.querySelector('#orders');
  if(ordersPage){
    const list=ordersPage.querySelector('#orderList');
    const clicker=document.createElement('button');
    clicker.type='button';
    clicker.className='btn gold';
    clicker.textContent='＋ Browse new RFQs';
    clicker.style.marginTop='12px';
    clicker.addEventListener('click',()=>navigate('rfqs'));
    list?.after(clicker);
  }
  const oldRender=render;
  render=function(){oldRender();if(currentTab!=='rfqs'||document.activeElement?.closest('.tabs'))highlight(currentTab);}
  render();
  highlight('workshop');
  console.info('Factory Empire v0.3 dashboard enhancement active');
})();
