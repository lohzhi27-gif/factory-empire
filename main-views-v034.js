/*
 * Factory Empire v0.3.4 — main workspace selector.
 * Reparents the existing, functional Gantt rather than cloning it.
 * Simulation, inventory and saved machines are untouched.
 */
(function mainWorkspaceViews(){
 'use strict';
 const grid=document.querySelector('.gamegrid');
 const chart=document.getElementById('gantt');
 const nav=document.querySelector('.main-nav');
 if(!grid||!chart||!nav)return;

 const switcher=document.createElement('section');
 switcher.className='workspace-switcher';
 switcher.setAttribute('aria-label','Choose your main factory view');
 switcher.innerHTML=
   '<div class="workspace-choice" role="group" aria-label="Main workspace view">'+
   '<button type="button" id="productionViewBtn" class="workspace-option selected" aria-pressed="true">'+
   '<span class="workspace-number">1</span><span><strong>Production View</strong><small>Workshop floor and operations</small></span></button>'+
   '<button type="button" id="ganttViewBtn" class="workspace-option" aria-pressed="false">'+
   '<span class="workspace-number">2</span><span><strong>Gantt Chart View</strong><small>Job scheduling and material ETA</small></span></button>'+
   '</div><span class="workspace-message">Choose your workspace</span>';
 grid.before(switcher);
 const mainGantt=document.createElement('section');
 mainGantt.id='mainGanttPanel';
 mainGantt.className='panel main-gantt-panel';
 mainGantt.hidden=true;
 mainGantt.innerHTML='<div class="heading main-gantt-heading"><div class="heading-title">'+
  '<span class="panel-icon">▦</span><div><h2>PRODUCTION PLANNING — JOBBING GANTT</h2>'+
  '<small>Full-width material availability, RFQ deadlines and production forecast</small></div></div>'+
  '<button class="btn gold minor" type="button" id="returnWorkshop">← Production View</button></div>';
 grid.after(mainGantt);
 // There must be one chart. Moving the node preserves range selection,
 // refresh handlers, incoming material rows and expanded-view controls.
 chart.classList.remove('tabpage');
 chart.classList.add('main-gantt-content');
 mainGantt.appendChild(chart);
 const oldGanttTab=document.querySelector('.operations-panel [data-tab="gantt"]');
 if(oldGanttTab)oldGanttTab.remove();
 const prodButton=document.getElementById('productionViewBtn');
 const ganttButton=document.getElementById('ganttViewBtn');
 const backButton=document.getElementById('returnWorkshop');
 const note=switcher.querySelector('.workspace-message');

 function updateButtons(isGantt){
   prodButton.classList.toggle('selected',!isGantt);
   ganttButton.classList.toggle('selected',isGantt);
   prodButton.setAttribute('aria-pressed',String(!isGantt));
   ganttButton.setAttribute('aria-pressed',String(isGantt));
   note.textContent=isGantt?'Gantt: live order and material schedule':'Production: interactive factory floor';
 }
 function switchView(view,scroll=true){
   const gantt=view==='gantt';
   // Turn off any fullscreen mode before switching to avoid trapping mobile touch.
   if(document.body.classList.contains('floor-expanded')){
     document.body.classList.remove('floor-expanded');
     const btn=document.getElementById('focusFactoryBtn');
     if(btn)btn.textContent='⛶ Expand floor';
   }
   if(!gantt&&document.body.classList.contains('gantt-expanded')){
     document.getElementById('expandGantt')?.click();
   }
   document.body.classList.toggle('main-gantt-view',gantt);
   grid.hidden=gantt;
   mainGantt.hidden=!gantt;
   if(gantt){
     if(currentTab!=='gantt')tabTo('gantt');
     else render();
   }else if(currentTab==='gantt'){
     tabTo('orders');
   }
   updateButtons(gantt);
   if(scroll){
     switcher.scrollIntoView({behavior:'smooth',block:'start'});
   }
 }
 prodButton.addEventListener('click',()=>switchView('production'));
 ganttButton.addEventListener('click',()=>switchView('gantt'));
 backButton.addEventListener('click',()=>switchView('production'));

 // Keep Schedule in top navigation as an optional direct shortcut to the
 // MAIN view, not the narrow right panel. All other nav items exit Gantt.
 nav.addEventListener('click',e=>{
   const button=e.target.closest('button[data-nav]');
   if(!button)return;
   if(button.dataset.nav==='gantt'){
     e.preventDefault();
     e.stopImmediatePropagation();
     switchView('gantt');
   }else if(document.body.classList.contains('main-gantt-view')){
     switchView('production',false);
   }
 },true);

 // Purchasing button must reveal the production dashboard first,
 // otherwise it would scroll to the now-hidden inventory panel.
 const jump=document.getElementById('jumpMaterials');
 if(jump)jump.addEventListener('click',e=>{
   e.stopImmediatePropagation();
   switchView('production',false);
   document.getElementById('inventory')?.scrollIntoView({behavior:'smooth',block:'center'});
 },true);

 const tagline=document.querySelector('.identity p');
 if(tagline)tagline.textContent='INDUSTRIAL TYCOON · WORKSPACE V0.3.4';
 document.title='Factory Empire — Production & Gantt Views v0.3.4';
 updateButtons(false);
})();
