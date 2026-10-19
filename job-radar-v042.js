/*
 * Factory Empire v0.4.2 alpha: machine-operation progress and job radar.
 * Presentation only. Reads machine and job states but never changes production,
 * assignment, machine progress, finance, saved progress, or factory calendar.
 */
(function jobRadarV042(){
 'use strict';
 const LOAD_MIN=2;
 const SETUP_MIN={bracket:21,block:180,plate:90,housing:180};
 const RANK={cutting:5,loading:4,setup:3,waiting:2,ready:1,assigned:0};
 let view='all',searchText='';
 const byId=id=>state.jobs.find(j=>String(j.id)===String(id));
 const validProduct=(m,p)=>P[p]&&P[p].machine===m.type;
 const num=n=>Math.max(0,Number(n)||0);
 const clamp=n=>Math.max(0,Math.min(100,Math.round(n)));
 const safe=s=>escapeHtml(String(s??''));
 function candidates(m,product){
   return state.jobs.filter(j=>j.done<j.qty && j.product===product && validProduct(m,j.product))
     .sort((a,b)=>a.dueDay-b.dueDay||a.id-b.id);
 }
 function activeSetupTask(m){
   const groups=state.jobbingWorkerTasks||{};
   for(const tasks of Object.values(groups)){
     if(!Array.isArray(tasks))continue;
     const task=tasks.find(t=>t && Number(t.machineId)===m.id && t.kind==='setup');
     if(task && byId(task.jobId))return task;
   }
   return null;
 }
 function setupTarget(m){
   const running=activeSetupTask(m);
   if(running)return byId(running.jobId);
   const assigned=byId(m.manualJobId);
   if(assigned && m.manualJobId!==null && assigned.product===m.setupFor && assigned.done<assigned.qty)return assigned;
   return candidates(m,m.setupFor)[0]||null;
 }
 function describe(m){
   let job=null,kind='idle',ratio=0,minutes=0,total=0,detail='';
   if(m.cutRemaining>0 && (job=byId(m.cutJobId))){
     kind='cutting';
     total=Math.max(1,num(P[job.product]?.cycle)||1);
     minutes=Math.max(0,total-num(m.cutRemaining)); 
     ratio=clamp(minutes/total*100);
     detail=num(m.cutRemaining)+' min of current piece remaining';
   }else if(m.loadRemaining>0 && (job=byId(m.loadJobId))){
     kind='loading';
     total=LOAD_MIN;
     minutes=Math.max(0,total-num(m.loadRemaining));
     ratio=clamp(minutes/total*100);
     detail=num(m.loadRemaining)+' min to load next piece';
   }else if(m.setupRemaining>0 && m.setupFor){
     job=setupTarget(m);
     kind=activeSetupTask(m)?'setup':'waiting';
     total=SETUP_MIN[m.setupFor]||90;
     minutes=Math.max(0,total-num(m.setupRemaining));
     ratio=clamp(minutes/total*100);
     detail=num(m.setupRemaining)+' min setup remaining'+(kind==='waiting'?' · Waiting for minion':'');
   }else{
     const assigned=m.manualJobId!==null?byId(m.manualJobId):null;
     if(assigned && assigned.done<assigned.qty && validProduct(m,assigned.product)){
       job=assigned;
       kind=m.setupPart===job.product?'ready':'assigned';
       ratio=kind==='ready'?100:0;
       detail=kind==='ready'?'Part setup complete · waiting for next cycle':'Waiting for material/programming or machine availability';
     }else if(m.setupPart){
       job=candidates(m,m.setupPart)[0]||null;
       if(job){
         kind='ready';ratio=100;detail='Part setup ready · waiting for operator or next cycle';
       }
     }
   }
   const labels={cutting:'CUTTING',loading:'LOADING',setup:'SETTING UP',waiting:'SETUP WAITING',ready:'SETUP READY',assigned:'ASSIGNED',idle:'NO ACTIVE JOB'};
   return {machine:m,job,kind,percent:ratio,labels:labels[kind],minutes,total,detail};
 }
 function activity(){
   const result=new Map();
   for(const m of state.machines){
     const a=describe(m);
     if(!a.job)continue;
     let arr=result.get(a.job.id);
     if(!arr){arr=[];result.set(a.job.id,arr);}
     arr.push(a);
   }
   return result;
 }
 const root=document.getElementById('orderList');
 let toolbar=null;
 function ensureToolbar(){
   if(toolbar || !root || !root.parentNode)return;
   toolbar=document.createElement('div');
   toolbar.className='job-radar-tools';
   toolbar.innerHTML=
     '<div class="job-radar-heading"><strong>◈ Job Radar</strong><span id="jobRadarCount" aria-live="polite">Tracking production</span></div>'+
     '<div class="job-radar-controls"><div class="job-radar-toggle" role="group" aria-label="Filter production orders">'+
     '<button class="job-radar-btn selected" type="button" data-radar-view="all" aria-pressed="true">All orders</button>'+
     '<button class="job-radar-btn" type="button" data-radar-view="machines" aria-pressed="false">On machines</button></div>'+
     '<input id="jobRadarSearch" type="search" placeholder="Find job, part, customer…" aria-label="Search production jobs" autocomplete="off"></div>';
   root.parentNode.insertBefore(toolbar,root);
   toolbar.addEventListener('click',e=>{
     const button=e.target.closest('[data-radar-view]');
     if(!button)return;
     view=button.dataset.radarView;
     applyFilters();
   });
   toolbar.querySelector('#jobRadarSearch').addEventListener('input',e=>{
     searchText=e.target.value.trim().toLowerCase();
     applyFilters();
   });
 }
 function applyFilters(){
   if(!root)return;
   const cards=[...root.querySelectorAll(':scope > .rfq[data-radar-job]')];
   let shown=0;
   cards.forEach(card=>{
     const matches=(view==='all'||card.dataset.radarAssigned==='true') &&
       (!searchText||card.dataset.radarSearch.includes(searchText));
     card.hidden=!matches;
     if(matches)shown++;
   });
   const count=toolbar?.querySelector('#jobRadarCount');
   if(count)count.textContent=shown+' / '+cards.length+' shown · '+cards.filter(c=>c.dataset.radarActive==='true').length+' actively working';
   toolbar?.querySelectorAll('[data-radar-view]').forEach(b=>{
     const on=b.dataset.radarView===view;
     b.classList.toggle('selected',on);
     b.setAttribute('aria-pressed',String(on));
   });
   let empty=root.querySelector('.job-radar-no-results');
   if(!shown && cards.length){
     if(!empty){empty=document.createElement('div');empty.className='job-radar-no-results';root.appendChild(empty);}
     empty.textContent='No jobs match these filters. Try All orders or another search.';
   }else if(empty)empty.remove();
 }
 function renderJobCards(){
   ensureToolbar();
   if(!root)return;
   const sorted=state.jobs.slice().sort((a,b)=>a.dueDay-b.dueDay);
   const cards=[...root.querySelectorAll(':scope > .rfq')];
   const mapped=activity();
   cards.forEach((card,i)=>{
     const job=sorted[i];if(!job)return;
     const machines=(mapped.get(job.id)||[]).sort((a,b)=>RANK[b.kind]-RANK[a.kind]);
     const best=machines[0];
     const trulyActive=machines.some(a=>['cutting','loading','setup'].includes(a.kind));
     card.dataset.radarJob=String(job.id);
     card.dataset.radarAssigned=String(machines.length>0);
     card.dataset.radarActive=String(trulyActive);
     card.dataset.radarSearch=('job '+job.id+' #'+job.id+' '+P[job.product]?.name+' '+P[job.product]?.short+' '+job.customer+' '+job.product).toLowerCase();
     if(!best)return;
     card.classList.add('job-radar-match','job-radar-'+best.kind);
     const ribbon=document.createElement('div');ribbon.className='job-radar-ribbon';
     ribbon.innerHTML='<strong>◈ JOB #'+safe(job.id)+'</strong>'+
       machines.map(a=>'<span class="job-radar-tag radar-'+a.kind+'">CNC #'+safe(a.machine.id)+' · '+safe(a.labels)+
       (['setup','waiting','loading','cutting'].includes(a.kind)?' '+a.percent+'%':'')+'</span>').join('');
     const head=card.querySelector('.rfqhead');
     if(head)head.after(ribbon);else card.prepend(ribbon);
     if(!trulyActive){
       const hint=document.createElement('div');
       hint.className='job-radar-note';
       hint.textContent='Assigned/prepared — not currently cutting. Machine status determines when work begins.';
       ribbon.after(hint);
     }
   });
   applyFilters();
 }
 function renderMachineCards(){
   const cards=[...document.querySelectorAll('#machineList .machine')];
   cards.forEach((card,i)=>{
     const m=state.machines[i];if(!m)return;
     const a=describe(m);
     const panel=card.querySelector('.jobbing-machine');
     if(!panel)return;
     const selector=panel.querySelector('select[data-machine-job]');
     if(selector){
       // When forty customers order the same part, use order ID + customer,
       // never just a repeated product label.
       selector.innerHTML='<option value="auto">Auto · nearest due</option>'+
         state.jobs.filter(j=>validProduct(m,j.product)&&j.done<j.qty)
           .sort((x,y)=>x.dueDay-y.dueDay)
           .map(j=>'<option value="'+safe(j.id)+'">#'+safe(j.id)+' · '+safe(P[j.product]?.short)+
             ' · '+safe(j.customer)+' · D'+safe(j.dueDay)+'</option>').join('');
       selector.value=m.manualJobId===null?'auto':String(m.manualJobId);
       if(selector.selectedIndex<0)selector.value='auto';
     }
     const panelLive=document.createElement('div');
     panelLive.className='machine-job-progress machine-progress-'+a.kind;
     const part=a.job?P[a.job.product]?.short:(m.setupFor?P[m.setupFor]?.short:m.setupPart?P[m.setupPart]?.short:null);
     const title=part?part:'No assigned order';
     const label=a.kind==='cutting'?'Current piece':
       a.kind==='setup'||a.kind==='waiting'?'Part setup':
       a.kind==='loading'?'Piece loading':
       a.kind==='ready'?'Setup prepared':a.kind==='assigned'?'Pending assignment':'Machine idle';
     const target=a.job?'#'+safe(a.job.id)+' · '+safe(a.job.customer):'';
     panelLive.innerHTML=
       '<div class="machine-progress-heading"><span>'+safe(label)+' · '+safe(a.labels)+'</span><strong>'+a.percent+'%</strong></div>'+
       '<div class="machine-progress-track" role="progressbar" aria-label="'+safe(label)+' progress for machine '+safe(m.id)+'" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+a.percent+'">'+
       '<span style="width:'+a.percent+'%"></span></div>'+
       '<div class="machine-progress-detail"><span>'+safe(title)+(target?' · '+target:'')+'</span>'+
       '<small>'+safe(a.detail||'No current operation')+'</small></div>'+
       (a.job?'<button type="button" class="btn minor ghost machine-find-job" data-radar-find="'+safe(a.job.id)+'">↗ Show highlighted job #'+safe(a.job.id)+'</button>':'');
     const labelElement=panel.querySelector('label');
     if(labelElement)panel.insertBefore(panelLive,labelElement);
     else panel.appendChild(panelLive);
   });
 }
 const priorJobs=renderJobs;
 renderJobs=function(){priorJobs();renderJobCards();};
 const priorMachines=renderMachines;
 renderMachines=function(){priorMachines();renderMachineCards();};
 document.addEventListener('click',e=>{
   const b=e.target.closest('[data-radar-find]');
   if(!b)return;
   const jobId=Number(b.dataset.radarFind);
   if(!byId(jobId))return;
   view='all';searchText='';
   const input=toolbar?.querySelector('#jobRadarSearch');
   if(input)input.value='';
   const production=document.getElementById('productionViewBtn');
   if(production && document.body.classList.contains('main-gantt-view'))production.click();
   tabTo('orders');
   const card=[...document.querySelectorAll('#orderList .rfq[data-radar-job]')]
     .find(el=>Number(el.dataset.radarJob)===jobId);
   if(card){
     card.classList.add('job-radar-jump');
     card.scrollIntoView({behavior:'smooth',block:'center'});
   }
 });
 render();
})();