/*
 * Factory Empire v0.4.7 alpha — one Production & Schedule sheet.
 * The full Gantt is reparented into a collapsed optional section INSIDE
 * the Production tab; no second main workspace is needed.
 * This is strictly presentation. Never resets or mutates factory saves.
 */
(function combinedProductionSheetV047(){
 'use strict';
 const orderRoot=document.getElementById('orderList');
 const orders=document.getElementById('orders');
 const gantt=document.getElementById('gantt');
 if(!orderRoot||!orders||!gantt)return;
 const section=orderRoot.closest('.section');
 if(!section)return;
 const sectionTitle=section.querySelector('h3');
 if(sectionTitle)sectionTitle.textContent='Production & Schedule';
 const sectionIntro=section.querySelector('.mini');
 if(sectionIntro)sectionIntro.textContent='One job per row · progress, material, due day and next 7 days in one sheet. Tap Details for a PO.';
 const oldSwitcher=document.querySelector('.workspace-switcher');
 const oldGanttPanel=document.getElementById('mainGanttPanel');
 const floor=document.querySelector('.gamegrid');
 if(floor)floor.hidden=false;
 document.body.classList.remove('main-gantt-view');
 if(oldSwitcher)oldSwitcher.remove();
 // Remove the second Gantt workspace link. Production's top nav is enough.
 const extraNav=document.querySelector('.main-nav [data-nav="gantt"]');
 if(extraNav)extraNav.remove();
 const rogueTab=document.querySelector('.operations-panel [data-tab="gantt"]');
 if(rogueTab)rogueTab.remove();
 // The one original real Gantt stays alive. We only move its DOM node.
 gantt.classList.remove('main-gantt-content');
 gantt.classList.add('sheet-gantt');
 gantt.classList.remove('tabpage');
 if(oldGanttPanel)oldGanttPanel.remove();
 const sheet=document.createElement('div');
 sheet.id='productionSheet';
 sheet.className='production-sheet';
 sheet.innerHTML='<div class="production-sheet-tools">'+
   '<div class="production-sheet-lead"><strong>▦ Live job schedule</strong>'+
   '<span id="productionSheetCount" aria-live="polite">0 jobs</span></div>'+
   '<div class="production-sheet-controls"><input id="productionSheetSearch" type="search" '+
   'placeholder="Find PO, part or customer…" aria-label="Search the production schedule" autocomplete="off">'+
   '<select id="productionSheetFilter" aria-label="Filter production jobs">'+
   '<option value="all">All jobs</option><option value="hot">🔥 HOT only</option>'+
   '<option value="risk">At risk</option><option value="active">On a machine</option>'+
   '</select></div></div>'+
   '<div class="production-sheet-scroller" role="region" tabindex="0" aria-label="Scrollable production schedule sheet">'+
   '<table class="production-sheet-table"><thead><tr>'+
   '<th scope="col">PO / Customer</th>'+
   '<th scope="col">Made / Qty</th>'+
   '<th scope="col">Material (kg)</th>'+
   '<th scope="col">Process</th>'+
   '<th scope="col">Due / ETA</th>'+
   '<th scope="col">Next 7 days <small>forecast*</small></th>'+
   '<th scope="col">Action</th></tr></thead><tbody id="productionSheetRows"></tbody></table></div>'+
   '<div class="production-sheet-key">'+
   '<span><i class="sheet-key-mat"></i> Material</span>'+
   '<span><i class="sheet-key-prog"></i> Programming</span>'+
   '<span><i class="sheet-key-cnc"></i> Machining</span>'+
   '<span>◆ Customer due</span>'+
   '<span>*Estimated: setup, scrap and shared minion delays not included</span></div>';
 // Place the sheet above the Job Radar and job card list.
 const radar=section.querySelector('.job-radar-tools');
 section.insertBefore(sheet,radar||orderRoot);

 const detail=document.createElement('details');
 detail.id='productionJobDetails';
 detail.className='sheet-disclosure';
 detail.innerHTML='<summary>▤ Individual PO details, material usage & HOT JOB dispatch <span>Tap to expand</span></summary>'+
   '<div class="sheet-detail-body"></div>';
 const detailBody=detail.querySelector('.sheet-detail-body');
 section.insertBefore(detail,radar||orderRoot);
 if(radar)detailBody.appendChild(radar);
 detailBody.appendChild(orderRoot);

 const forecast=document.createElement('details');
 forecast.id='productionDetailedGantt';
 forecast.className='sheet-disclosure';
 forecast.innerHTML='<summary>▦ Detailed Gantt & incoming material POs <span>Optional forecast</span></summary>'+
   '<div class="sheet-forecast-body"></div>';
 section.appendChild(forecast);
 forecast.querySelector('.sheet-forecast-body').appendChild(gantt);
 // Make the long forecast manageable on mobile without losing the old 28/42 range.
 const range=document.getElementById('ganttRange');
 if(range){range.value='14';range.dispatchEvent(new Event('change'));}
 const search=sheet.querySelector('#productionSheetSearch');
 const filter=sheet.querySelector('#productionSheetFilter');
 const rows=sheet.querySelector('#productionSheetRows');
 const count=sheet.querySelector('#productionSheetCount');
 const txt=v=>escapeHtml(String(v??''));
 const kilo=n=>(Math.max(0,Math.round((Number(n)||0)*10)/10)).toLocaleString('en-MY',{
   minimumFractionDigits:1,maximumFractionDigits:1
 });
 const weekday=d=>((d-1)%7+7)%7<5;
 function inflight(j){
   return state.machines.filter(m=>m.cutRemaining>0&&String(m.cutJobId)===String(j.id)).length;
 }
 function tally(j){
   const p=P[j.product];
   const good=Math.max(0,Number(j.done)||0),bad=Math.max(0,Number(j.scrap)||0),running=inflight(j);
   const need=Math.max(0,(Number(j.qty)||0)-good-running)*p.material;
   const used=(good+bad+running)*p.material;
   const open=state.jobs.reduce((sum,x)=>{
      const px=P[x.product];
      return sum+((px&&px.mat===p.mat)?
        Math.max(0,x.qty-x.done-inflight(x))*px.material:0);
   },0);
   return {used,need,short:Math.max(0,open-(Number(state[p.mat])||0)),name:p.mat};
 }
 function status(j){
   const cutting=state.machines.some(m=>m.cutJobId===j.id&&m.cutRemaining>0);
   const preparing=state.machines.some(m=>m.loadJobId===j.id&&m.loadRemaining>0 ||
     m.manualJobId===j.id&&m.setupFor===j.product&&m.setupRemaining>0);
   if(cutting)return {label:'CUTTING',cls:'cutting'};
   if(preparing)return {label:'SETUP / LOAD',cls:'setting'};
   const r=j.routing||{};
   if(r.phase==='awaiting_material')return {label:'MATERIAL',cls:'material'};
   if(r.phase==='programming')return {label:'PROGRAM',cls:'programming'};
   if(r.phase==='machining')return {label:'READY / CNC',cls:'ready'};
   return {label:'QUEUED',cls:'queued'};
 }
 function ganttForecasts(){
   // Use the SAME read-only forecast drawn by the original Gantt rather
   // than invent a second contradictory production ETA algorithm.
   const ganttRows=[...gantt.querySelectorAll('#ganttChart .gantt-job-row')];
   const byJob=new Map();
   const jobs=state.jobs.filter(j=>P[j.product]&&j.qty>0)
     .slice().sort((a,b)=>a.dueDay-b.dueDay||a.id-b.id);
   ganttRows.forEach((row,i)=>{
     const j=jobs[i];if(!j)return;
     const label=row.querySelector('.gantt-job')?.textContent||'';
     const matches=label.match(/ETA D(\d+)/);
     const eta=matches?Number(matches[1]):null;
     const cells=[...row.querySelectorAll('.gantt-cell')].slice(0,7);
     byJob.set(j.id,{eta,cells});
   });
   return byJob;
 }
 function miniTimeline(j,plan){
   return Array.from({length:7},(_,i)=>{
     const day=state.day+i,cell=plan?.cells?.[i];
     const kind=['material','program','machining'].find(v=>cell?.classList.contains(v));
     const weekend=!weekday(day);
     const due=j.dueDay===day;
     const text=due?'◆':kind==='material'?'M':kind==='program'?'P':kind==='machining'?'C':'·';
     const title='Day '+day+(due?' · customer due':kind==='material'?' · material waiting (estimate)':
       kind==='program'?' · programming (estimate)':kind==='machining'?' · machining (estimate)':
       weekend?' · weekend':' · not scheduled');
     return '<span class="sheet-day '+(kind||'empty')+(due?' due':'')+(weekend?' weekend':'')+'" title="'+txt(title)+'">'+
       '<small>D'+day+'</small><b>'+text+'</b></span>';
   }).join('');
 }
 function sheetRender(){
   if(currentTab!=='orders')return;
   const q=search.value.trim().toLowerCase(),f=filter.value;
   const projects=ganttForecasts();
   const jobs=state.jobs.slice().sort((a,b)=>a.dueDay-b.dueDay||a.id-b.id);
   let shown=0;
   let riskCount=0;
   const HTML=[];
   for(const j of jobs){
     const p=P[j.product];if(!p)continue;
     const mat=tally(j),pdone=Math.round(j.done/Math.max(1,j.qty)*100);
     const info=status(j),pr=projects.get(j.id);
     const risk=(pr?.eta!==null&&pr?.eta!==undefined&&pr.eta>j.dueDay)||mat.short>.001||j.dueDay<state.day;
     const assigned=state.machines.some(m=>m.manualJobId===j.id||m.cutJobId===j.id||m.loadJobId===j.id);
     if(risk)riskCount++;
     const hay=('PO '+j.id+' '+p.short+' '+p.name+' '+j.customer).toLowerCase();
     if(q&&!hay.includes(q))continue;
     if(f==='hot'&&!j.hot||f==='risk'&&!risk||f==='active'&&!assigned)continue;
     shown++;
     HTML.push('<tr class="'+(j.hot?'sheet-hot ':'')+(risk?'sheet-risk':'')+'" data-sheet-job="'+j.id+'">'+
       '<th scope="row"><div class="sheet-job-name">'+(j.hot?'🔥 ':'')+'#'+txt(j.id)+' '+txt(p.short)+'</div>'+
       '<small>'+txt(j.customer)+'</small></th>'+
       '<td><strong>'+txt(j.done)+' / '+txt(j.qty)+'</strong><div class="sheet-mini-progress"><i style="width:'+pdone+'%"></i></div></td>'+
       '<td><strong>'+kilo(mat.used)+' used</strong><small>'+kilo(mat.need)+' still needed</small>'+
         (mat.short>.001?'<small class="sheet-warn">Shared shortage '+kilo(mat.short)+'</small>':'')+'</td>'+
       '<td><span class="sheet-process '+info.cls+'">'+txt(info.label)+'</span></td>'+
       '<td><strong>D'+txt(j.dueDay)+'</strong><small>'+((pr?.eta!==null&&pr?.eta!==undefined)?'ETA D'+pr.eta:'ETA unknown')+'</small>'+
         (risk?'<small class="sheet-warn">Check risk</small>':'')+'</td>'+
       '<td><div class="sheet-week">'+miniTimeline(j,pr)+'</div></td>'+
       '<td><button type="button" class="sheet-open-job" data-sheet-open="'+j.id+'">Details ↗</button></td>'+
       '</tr>');
   }
   rows.innerHTML=HTML.join('')||'<tr><td colspan="7" class="sheet-no-jobs">'+
     (jobs.length?'No matching jobs. Clear the filter to see all production orders.':
       'No jobs yet. Accept a CNC RFQ to get started.')+'</td></tr>';
   count.textContent=shown+'/'+jobs.length+' jobs · '+riskCount+' need attention';
 }
 search.addEventListener('input',sheetRender);
 filter.addEventListener('change',sheetRender);
 function openJob(id){
   detail.open=true;
   const radarFilter=detail.querySelector('[data-radar-view="all"]');
   if(radarFilter)radarFilter.click();
   const radarSearch=detail.querySelector('#jobRadarSearch');
   if(radarSearch && radarSearch.value){radarSearch.value='';radarSearch.dispatchEvent(new Event('input'));}
   const card=[...orderRoot.querySelectorAll('.rfq[data-radar-job]')]
     .find(x=>Number(x.dataset.radarJob)===id);
   if(card){
     card.classList.add('job-radar-jump');
     card.scrollIntoView({behavior:'smooth',block:'center'});
   }else detail.scrollIntoView({behavior:'smooth',block:'start'});
 }
 sheet.addEventListener('click',e=>{
   const b=e.target.closest('[data-sheet-open]');
   if(!b)return;
   openJob(Number(b.dataset.sheetOpen));
 });
 // Equipment -> Show highlighted job must uncollapse hidden PO details.
 document.addEventListener('click',e=>{
   if(e.target.closest('[data-radar-find]'))detail.open=true;
 },true);
 const priorRender=render;
 render=function(){
   priorRender();
   sheetRender();
 };
 const tab=document.querySelector('[data-tab="orders"]');
 if(tab)tab.textContent='Production & Schedule';
 document.title='Factory Empire — Production & Schedule';
 render();
})();