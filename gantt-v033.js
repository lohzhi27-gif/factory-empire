/*
 Factory Empire v0.3.3 — Read-only Jobbing Gantt
 Visual scheduling estimates are NOT commitments or stock reservations.
 Same production engine and same local save key as v0.3.2.
*/
(function jobbingGantt(){
 'use strict';
 const ops=document.querySelector('.operations-panel');
 const nav=document.querySelector('.main-nav');
 if(!ops||!nav)return;
 const tabs=ops.querySelector('.tabs'),scroll=ops.querySelector('.rightscroll');
 if(!tabs||!scroll)return;
 const ganttButton=document.createElement('button');
 ganttButton.className='tab';
 ganttButton.type='button';
 ganttButton.dataset.tab='gantt';
 ganttButton.textContent='Job Gantt';
 const orderTab=tabs.querySelector('[data-tab="orders"]');
 if(orderTab)orderTab.after(ganttButton);else tabs.appendChild(ganttButton);
 const navButton=document.createElement('button');
 navButton.type='button';
 navButton.dataset.nav='gantt';
 navButton.setAttribute('aria-label','Jobbing Gantt schedule');
 navButton.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4v16M4 7h8v3H4M4 12h14v3H4M4 17h10v3H4"/></svg><span>Schedule</span>';
 const prodNav=nav.querySelector('[data-nav="orders"]');
 if(prodNav)prodNav.after(navButton);else nav.appendChild(navButton);
 const tagline=document.querySelector('.identity p');
 if(tagline)tagline.textContent='INDUSTRIAL TYCOON · JOBBING GANTT v0.3.3';
 document.title='Factory Empire — Jobbing Gantt v0.3.3';
 const panel=document.createElement('div');
 panel.id='gantt';
 panel.className='tabpage';
 panel.innerHTML='<div class="section gantt-pane">'
  +'<div class="gantt-header"><div><h3>Jobbing production Gantt</h3>'
  +'<div class="mini">Material → programming → machining, compared against customer due dates.</div></div>'
  +'<div class="gantt-controls"><label for="ganttRange">View</label><select id="ganttRange" aria-label="Gantt days shown">'
  +'<option value="14">14 days</option><option value="28" selected>28 days</option><option value="42">42 days</option></select></div></div>'
  +'<div class="gantt-legend"><span><i class="legend-square mat"></i>Material waiting</span>'
  +'<span><i class="legend-square prog"></i>Programming</span>'
  +'<span><i class="legend-square cnc"></i>Machining</span>'
  +'<span><i class="legend-square po"></i>Incoming PO</span>'
  +'<span><i class="legend-square late"></i>Due date</span></div>'
  +'<div class="gantt-summary" id="ganttSummary"></div>'
  +'<div class="gantt-scroller" id="ganttScroll" tabindex="0" aria-label="Scroll Gantt schedule horizontally">'
  +'<div id="ganttChart"></div></div>'
  +'<div class="gantt-note">Forecast only, not a stock reservation. The game prioritizes urgent work automatically; this chart assumes one order at a time per estimated machine lane, 420 minutes per shift, no scrap or stoppages. Weekends are excluded; holidays, finishing, inspection, shipping and staff conflicts across machine types are not yet modeled. Due dates remain the customer’s requested game days.</div>'
  +'<div class="gantt-material-title"><h3>Material availability & incoming orders</h3>'
  +'<button class="btn minor ghost" type="button" id="jumpMaterials">↓ Purchasing</button></div>'
  +'<div id="ganttMaterialSummary"></div></div>';
 scroll.appendChild(panel);
 document.getElementById('jumpMaterials').addEventListener('click',()=>{
    const el=document.getElementById('inventory');
    el?.scrollIntoView({behavior:'smooth',block:'center'});
 });
 const rangeControl=document.getElementById('ganttRange');
 let windowDays=28;
 rangeControl.addEventListener('change',()=>{
    windowDays=Number(rangeControl.value)||28;
    paint();
 });
 const today=()=>state.day;
 const workday=d=>((d-1)%7+7)%7<5;
 const nextWorkday=d=>{let x=d+1;while(!workday(x))x++;return x;};
 const atOrAfter=d=>workday(d)?d:nextWorkday(d);
 const workdays=(d,n)=>{let x=d;for(let k=0;k<n;k++)x=nextWorkday(x);return x;};
 const round=v=>Math.round((v+Number.EPSILON)*10)/10;
 const safe=s=>escapeHtml(s);
 const products=()=>state.jobs.filter(j=>P[j.product]&&j.qty>0).slice().sort((a,b)=>a.dueDay-b.dueDay||a.id-b.id);
 // Estimate coverage by earliest due date. This is advisory allocation, NOT an inventory hold.
 function coverJobs(jobs){
   const pool={};
   for(const mat of ['aluminum','steel']){
     const buckets=[{day:today(),qty:Math.max(0,Number(state[mat])||0),source:'stock'}];
     for(const po of (state.materialOrders||[]).filter(p=>p.type===mat&&p.arrivalDay>=today()).slice().sort((a,b)=>a.arrivalDay-b.arrivalDay)){
       buckets.push({day:po.arrivalDay,qty:Math.max(0,Number(po.qty)||0),source:'po'});
     }
     pool[mat]=buckets;
   }
   const allocated=new Map();
   for(const j of jobs){
     const p=P[j.product],required=round(Math.max(0,j.qty-j.done)*p.material);
     const buckets=pool[p.mat]||[];
     let need=required,latest=today(),fromPo=false;
     const stockBefore=buckets[0]?.qty||0;
     for(const b of buckets){
       if(need<=.000001)break;
       const used=Math.min(need,b.qty);
       b.qty=Math.max(0,round(b.qty-used));
       need=round(need-used);
       if(used>.000001){
         latest=Math.max(latest,b.day);
         if(b.source==='po')fromPo=true;
       }
     }
     const short=round(Math.max(0,need));
     const readyDay=short<=.000001?latest:null;
     const status=short>0?'short':fromPo?'incoming':'ready';
     allocated.set(j.id,{required,short,readyDay,status,stockBefore});
   }
   return allocated;
 }
 function predict(jobs,coverage){
   const out=new Map();
   const lanes=new Map();
   for(const type of ['CNC','LASER']){
     const count=Math.min(state.workers,state.machines.filter(m=>m.type===type&&m.condition>15).length);
     lanes.set(type,Array.from({length:Math.max(0,count)},()=>nextWorkday(today())));
   }
   for(const job of jobs){
     const p=P[job.product],c=coverage.get(job.id);
     const r=job.routing||{phase:'machining'},phase=r.phase||'machining';
     const plan={segments:[],finish:null,status:'',start:null};
     const segments=plan.segments;
     let machiningStart=null;
     if(phase==='awaiting_material'){
       if(c.readyDay===null){
         plan.status='Material shortage · no confirmed ETA';
         out.set(job.id,plan);continue;
       }
       if(c.readyDay>today()){
         for(let day=today();day<=c.readyDay;day++)segments.push({day,kind:'material'});
       }
       const begin=nextWorkday(Math.max(today(),c.readyDay));
       const end=workdays(begin,1); // two workdays: begin, following workday
       segments.push({day:begin,kind:'program'},{day:end,kind:'program'});
       machiningStart=nextWorkday(end);
     }else if(phase==='programming'){
       const remaining=Math.max(0,Number(r.programRemaining)||0);
       if(remaining>0){
         const begin=atOrAfter(Math.max(today()+1,r.programStartDay||today()+1));
         let end=begin;
         for(let n=0;n<remaining;n++){
           segments.push({day:end,kind:'program'});
           if(n+1<remaining)end=nextWorkday(end);
         }
         machiningStart=nextWorkday(end);
       }else machiningStart=r.machineReadyDay||nextWorkday(today());
     }else{
       machiningStart=Math.max(nextWorkday(today()),r.machineReadyDay||today());
     }
     if(c.readyDay===null && job.done<job.qty){
       plan.status='Material replenishment not covered';
       out.set(job.id,plan);continue;
     }
     if(c.readyDay!==null && c.readyDay>machiningStart)machiningStart=atOrAfter(c.readyDay);
     const machines=lanes.get(p.machine)||[];
     if(machines.length===0){
       plan.status='Compatible machine / operator unavailable';
       out.set(job.id,plan);continue;
     }
     const lane=machines.indexOf(Math.min(...machines));
     const from=atOrAfter(Math.max(machiningStart,machines[lane]));
     const days=Math.max(1,Math.ceil(Math.max(0,job.qty-job.done)*p.cycle/(420*Math.max(1,state.shifts))));
     let day=from;
     for(let n=0;n<days;n++){
       segments.push({day,kind:'machining'});
       if(n+1<days)day=nextWorkday(day);
     }
     machines[lane]=nextWorkday(day);
     plan.finish=day;plan.start=from;
     plan.status=day>job.dueDay?'Projected late':'Projected by D'+day;
     out.set(job.id,plan);
   }
   return out;
 }
 function fmtQty(v){return Number(v.toFixed(1)).toLocaleString('en-MY',{maximumFractionDigits:1});}
 function jobLabel(j,c,plan){
   const p=P[j.product],color=c.status==='short'?'short':c.status==='incoming'?'incoming':'ready';
   const tag=c.status==='short'?'Short '+fmtQty(c.short)+' kg'
     :c.status==='incoming'?'Covered by PO · D'+c.readyDay:'Available in stock';
   const detail=fmtQty(c.required)+' kg '+(p.mat==='aluminum'?'Al':'Steel')+' required · '+j.done+'/'+j.qty+' pcs';
   return '<div class="gantt-job"><strong>'+safe(p.short)+'</strong><small>'+safe(j.customer)+'</small>'
     +'<span class="gantt-material-pill '+color+'">'+tag+'</span><small>'+detail+'</small>'
     +'<small>Due Day '+j.dueDay+(plan.finish?' · ETA D'+plan.finish:' · ETA unknown')+'</small></div>';
 }
 function materialHeader(){
   const pending=(state.materialOrders||[]).slice().sort((a,b)=>a.arrivalDay-b.arrivalDay);
   const p=pending.length?pending.length+' pending material POs':'No incoming material POs';
   return '<div class="gantt-metrics"><span>On-hand: Al '+fmtQty(Number(state.aluminum)||0)+' kg · Steel '+fmtQty(Number(state.steel)||0)+' kg</span><span>'+p+'</span></div>';
 }
 function paint(){
   if(currentTab!=='gantt')return;
   const jobs=products(),coverage=coverJobs(jobs),plans=predict(jobs,coverage),start=today(),finish=start+windowDays-1;
   const timeline=Array.from({length:windowDays},(_,i)=>start+i);
   const rows=[];
   const head='<div class="gantt-row gantt-days"><div class="gantt-sticky">JOB / MATERIAL STATUS</div>'
     +timeline.map(day=>'<div class="gantt-day '+(!workday(day)?'weekend ':'')+(day===today()?'today':'')+'"><span>D'+day+'</span><small>'+['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][(day-1)%7]+'</small></div>').join('')+'</div>';
   for(const job of jobs){
     const c=coverage.get(job.id),plan=plans.get(job.id);
     const cellmap=new Map(plan.segments.filter(x=>x.day>=start&&x.day<=finish).map(x=>[x.day,x.kind]));
     rows.push('<div class="gantt-row gantt-job-row"><div class="gantt-sticky">'+jobLabel(job,c,plan)+'</div>'
       +timeline.map(day=>{
         const kind=cellmap.get(day),due=day===job.dueDay,weekend=!workday(day);
         const label=(kind==='material'?'Waiting for material':kind==='program'?'Programming':kind==='machining'?'Scheduled machining':'No scheduled process');
         return '<div class="gantt-cell '+(weekend?'weekend ':'')+(kind||'')+(due?' due':'')+(day===today()?' today':'')+'" title="'+safe('Day '+day+': '+label+(due?' · Customer due date':''))+'">'
           +(kind?'<span class="gantt-bar" aria-label="'+label+'"></span>':'')
           +(due?'<span class="gantt-due" aria-label="Due">◆</span>':'')+'</div>';
       }).join('')+'</div>');
   }
   const queue=(state.materialOrders||[]).slice().sort((a,b)=>a.arrivalDay-b.arrivalDay);
   for(const po of queue){
     rows.push('<div class="gantt-row gantt-po-row"><div class="gantt-sticky"><strong>PO #'+po.id+' · '+safe(po.type==='aluminum'?'Aluminum':'Steel')+'</strong>'
       +'<small>'+fmtQty(Number(po.qty)||0)+' kg · ordered D'+po.orderedDay+'</small>'
       +'<span class="gantt-material-pill incoming">Arrival D'+po.arrivalDay+'</span></div>'
       +timeline.map(day=>'<div class="gantt-cell '+(!workday(day)?'weekend ':'')+(day>=po.orderedDay&&day<po.arrivalDay?'po ':'')+(day===po.arrivalDay?'delivery ':'')+'">'
         +(day===po.arrivalDay?'<span class="gantt-drop" title="Supplier delivery: '+fmtQty(Number(po.qty)||0)+' kg">▼</span>':day>=po.orderedDay&&day<po.arrivalDay?'<span class="gantt-po-line"></span>':'')
         +'</div>').join('')+'</div>');
   }
   document.getElementById('ganttChart').style.setProperty('--gantt-days',String(windowDays));
   document.getElementById('ganttChart').innerHTML=head
     +(jobs.length?'':'<div class="gantt-no-jobs">No active jobs yet. Accept an RFQ to see its material, programming and machining stages.</div>')
     +rows.join('');
   const pending=jobs.filter(j=>coverage.get(j.id).status==='short').length;
   const risks=jobs.filter(j=>plans.get(j.id).finish!==null&&plans.get(j.id).finish>j.dueDay).length;
   document.getElementById('ganttSummary').innerHTML='<span>'+jobs.length+' active job'+(jobs.length===1?'':'s')+'</span>'
     +'<span class="'+(pending?'gantt-warning':'')+'">'+pending+' material short</span>'
     +'<span class="'+(risks?'gantt-warning':'')+'">'+risks+' projected late</span>';
   document.getElementById('ganttMaterialSummary').innerHTML=materialHeader()
     +(queue.length?'<div class="gantt-po-summary">'+queue.map(po=>'<div><strong>PO #'+po.id+'</strong> '
       +fmtQty(Number(po.qty)||0)+' kg '+safe(po.type==='aluminum'?'Aluminum':'Steel')
       +' <span>Due Day '+po.arrivalDay+'</span></div>').join('')+'</div>':'<div class="mini">No supplier deliveries scheduled. Use Purchasing below to place a PO.</div>');
 }
 const previousRender=render;
 render=function(){
   previousRender();
   paint();
 };
 render();
})();
