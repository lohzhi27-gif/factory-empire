/*
 * Factory Empire v0.4.8 alpha — two-CNC shared jobs, starter tapping and programmer desk.
 * All capital costs and tapping durations are provisional game-balance values.
 * Keeps factory_empire_proto_v1 save and does not add support gear to CNC-room capacity.
 */
(function workshopSupportV048(){
 'use strict';
 const VERSION=48,TAP_PRICE=4500,TAP_SETUP=30,TAP_PER_PIECE=2;
 const esc=x=>escapeHtml(String(x??''));
 function init(){
   if(!state||!state.jobs||!state.machines)return;
   if(!state.supportEquipment)state.supportEquipment={tappingStations:0};
   if(!Number.isInteger(state.supportEquipment.tappingStations))state.supportEquipment.tappingStations=0;
   if(!Number.isInteger(state.programmers)||state.programmers<1)state.programmers=1;
   if(!Number.isInteger(state.programmerDesks)||state.programmerDesks<1)state.programmerDesks=1;
   if(!Number.isInteger(state.tappingOperators))state.tappingOperators=0;
   if(state.workshopSupportVersion===VERSION)return;
   for(const j of state.jobs){
     if(P[j.product]?.requiresTapping&&!Number.isFinite(j.cncDone))j.cncDone=j.done||0;
     if(!j.machineOutput)j.machineOutput={};
   }
   state.workshopSupportVersion=VERSION;save();
 }
 const cncList=()=>state.machines.filter(m=>m.type==='CNC');
 function buyTapping(){
   init();
   if(state.supportEquipment.tappingStations>=1){toast('Tapping station already installed');return;}
   if(state.cash<TAP_PRICE){toast('Need '+F(TAP_PRICE)+' for the tapping station');return;}
   state.cash-=TAP_PRICE;state.totalCapex+=TAP_PRICE;
   state.supportEquipment.tappingStations=1;
   log('Installed compact tapping station · '+F(TAP_PRICE)+' (auxiliary, outside 2-CNC room limit)');
   toast('Tapping station installed! Threaded bracket RFQs are now eligible.');
   update();
 }
 function hireProgrammer(){
   init();
   if(cncList().length<4){toast('Additional programmer desks unlock with the Stage 2 shoplot (4 CNCs)');return;}
   if(state.programmers>=Math.max(1,Math.ceil(cncList().length/4))){toast('Programming capacity already matches this factory stage');return;}
   if(state.cash<2000){toast('Need RM2,000 to equip a programmer desk');return;}
   state.cash-=2000;state.totalCapex+=2000;state.programmerDesks++;state.programmers++;
   log('Added programmer desk & programmer '+state.programmers+' (RM2,000 setup; RM180/working day wage)');
   toast('Additional programmer online · concurrent programming capacity raised');
   update();
 }
 function hireTapping(){
   init();
   if(cncList().length<6){toast('Tapping can be shared work until the 6-CNC mid-term workshop');return;}
   if(!state.supportEquipment.tappingStations){toast('Buy a tapping station first');return;}
   if(state.tappingOperators){toast('Tapping specialist already assigned');return;}
   if(state.cash<800){toast('Need RM800 recruitment cost');return;}
   state.cash-=800;state.totalExpenses+=800;state.tappingOperators=1;
   log('Assigned dedicated tapping minion (mid-term 6+ CNC capacity)');
   toast('Dedicated tapping specialist recruited; RM160 per working day');
   update();
 }
 function eligibleTapping(){
   return state.supportEquipment.tappingStations>0 &&
     state.workers>0 &&
     (cncList().length<6||state.tappingOperators>=1);
 }
 function runTapping(minutes){
   init();
   if(!eligibleTapping()||((state.day-1)%7+7)%7>=5)return 0;
   if(state.tappingShiftDay!==state.day){
     state.tappingShiftDay=state.day;state.tappingTodayMinutes=0;
   }
   // Starter tapping is performed opportunistically, without hiring a
   // dedicated tapping minion. Restrict actual station run to half a shift.
   let budget=Math.min(Math.max(0,minutes),Math.max(0,210-(state.tappingTodayMinutes||0)));
   let used=0,finished=0;
   const queue=state.jobs.filter(j=>P[j.product]?.requiresTapping&&
     (Number(j.cncDone)||0)>j.done).sort((a,b)=>a.dueDay-b.dueDay);
   for(const j of queue){
     if(budget<=0)break;
     if(!j.tappingSetupDone){
       if(!Number.isFinite(j.tappingSetupRemaining))j.tappingSetupRemaining=TAP_SETUP;
       const spent=Math.min(budget,j.tappingSetupRemaining);
       j.tappingSetupRemaining-=spent;budget-=spent;used+=spent;
       if(j.tappingSetupRemaining>0)continue;
       j.tappingSetupDone=true;
     }
     while(budget>0 && (Number(j.cncDone)||0)>j.done){
       if(!Number.isFinite(j.tappingPieceRemaining)||j.tappingPieceRemaining<=0)
         j.tappingPieceRemaining=TAP_PER_PIECE;
       const t=Math.min(budget,j.tappingPieceRemaining);
       j.tappingPieceRemaining-=t;budget-=t;used+=t;
       if(j.tappingPieceRemaining>0)break;
       j.done++;finished++;j.tappingPieceRemaining=0;
     }
     if(j.done>=j.qty)log('TAPPING COMPLETE: #'+j.id+' '+P[j.product].short+' · inspection/shipment pending day close');
   }
   state.tappingTodayMinutes=(state.tappingTodayMinutes||0)+used;
   if(finished)state.tappingLastOutput={day:state.day,pcs:finished,minutes:used};
   return finished;
 }
 // Tap work occurs after CNC cutting for the hour, so a newly machined good
 // part cannot become shippable until it really passes through the station.
 const beforeHour=runJobbingHour;
 runJobbingHour=function(shift,mins){
   const made=beforeHour(shift,mins);
   runTapping(mins);
   return made;
 };
 const beforeProduction=runJobbingProduction;
 runJobbingProduction=function(isWorkDay){
   const made=beforeProduction(isWorkDay);
   if(isWorkDay!==false)runTapping(420*(state.shifts===2?2:1));
   return made;
 };
 const beforeAccept=accept;
 accept=function(id){
   init();
   const q=state.rfqs.find(q=>String(q.id)===String(id));
   if(q&&P[q.product]?.requiresTapping&&!state.supportEquipment.tappingStations){
     toast('MISSING TAPPING MACHINE: buy the Stage 1 tapping station in Equipment before accepting this RFQ.');
     return;
   }
   return beforeAccept(id);
 };
 const beforeRfq=renderRfq;
 renderRfq=function(){
   init();beforeRfq();
   const cards=[...document.querySelectorAll('#rfqList .rfq')];
   cards.forEach((card,i)=>{
     const q=state.rfqs[i];if(!q||!P[q.product]?.requiresTapping)return;
     const available=state.supportEquipment.tappingStations>0;
     const label=document.createElement('div');
     label.className='aux-rfq-requirement';
     label.textContent=available?
       '✓ Tapping station available · CNC machining + tapping secondary process':
       '⚠ Tapping station REQUIRED before PO award · purchase in Equipment';
     card.appendChild(label);
     if(!available){const b=card.querySelector('[data-accept]');if(b){b.disabled=true;b.title='Buy Stage 1 tapping station first';}}
   });
 };
 const beforeMachines=renderMachines;
 renderMachines=function(){
   init();beforeMachines();
   const root=document.getElementById('machineList');
   if(!root)return;
   [...root.querySelectorAll('.machine')].forEach((card,i)=>{
     const m=state.machines[i];if(!m)return;
     const j=state.jobs.find(j=>j.id===m.manualJobId)||
       state.jobs.find(j=>j.id===m.cutJobId)||
       state.jobs.find(j=>(j.machineOutput||{})[m.id]>0);
     if(!j)return;
     const target=card.querySelector('.jobbing-machine')||card;
     const info=document.createElement('div');
     info.className='machine-output-contribution';
     info.textContent='CNC #'+m.id+' contribution → PO #'+j.id+': '+((j.machineOutput||{})[m.id]||0)+
       ' good pcs (combined job progress: '+j.done+'/'+j.qty+')';
     target.appendChild(info);
   });
   let support=document.getElementById('workshopSupport');
   if(!support){
     support=document.createElement('div');support.id='workshopSupport';
     support.className='workshop-support';
     root.parentNode?.insertBefore(support,root.nextSibling);
   }
   const canStaff=cncList().length>=6;
   support.innerHTML=
     '<div class="support-heading"><strong>🧰 Support stations & programming</strong><small>Auxiliary equipment does NOT occupy your 2-CNC room limit</small></div>'+
     '<div class="support-stations"><section class="support-station">'+
     '<h4>⌨ Programmer desk</h4><strong>'+state.programmers+' / '+state.programmerDesks+' active desk'+(state.programmerDesks===1?'':'s')+'</strong>'+
     '<p>Starter desk included · each programmer works on one two-day program at a time.</p>'+
     (cncList().length>=4?
      '<button class="btn minor ghost" type="button" data-support-buy="programmer">Add programmer + desk · RM2,000</button>':
      '<small>🔒 Extra programmers unlock in Stage 2 (4 CNCs).</small>')+
     '</section><section class="support-station"><h4>🔩 Tapping station</h4><strong>'+
     (state.supportEquipment.tappingStations?'Installed · 1 station':'Not purchased')+'</strong>'+
     '<p>First stage: occasional tapping work without a dedicated operator. 30m first setup + 2m per piece (test values), up to half a shift/day.</p>'+
     (!state.supportEquipment.tappingStations?
       '<button class="btn minor gold" type="button" data-support-buy="tapping">Buy tapping station · '+F(TAP_PRICE)+'</button>':
       (canStaff?
         (state.tappingOperators?
           '<small>✓ Dedicated tapping minion on duty</small>':
           '<button class="btn minor gold" type="button" data-support-buy="tapping-staff">Hire tapping minion · RM800</button>'):
         '<small>Shared support process · dedicated minion not required under 6 CNCs.</small>'))+
     '</section></div>';
 };
 const beforeFinance=renderFinance;
 renderFinance=function(){
   init();beforeFinance();
   const payroll=document.getElementById('payroll');
   if(payroll)payroll.textContent=F((state.workers||0)*160+
     Math.max(0,(state.programmers||1)-1)*180+(state.tappingOperators||0)*160)+
     ' / staffed working day (CNC + office + tapping)';
 };
  const beforeJobs=renderJobs;
 renderJobs=function(){
   init();beforeJobs();
   const cards=[...document.querySelectorAll('#orderList .rfq[data-radar-job]')];
   cards.forEach(card=>{
     const j=state.jobs.find(x=>String(x.id)===card.dataset.radarJob);
     if(!j || P[j.product]?.machine!=='CNC')return;
     const assignment=document.createElement('div');
     assignment.className='multi-cnc-assignment';
     const machines=cncList();
     const contributions=j.machineOutput||{};
     const totalTracked=Object.values(contributions).reduce((a,x)=>a+Number(x||0),0);
     const legacy=Math.max(0,(P[j.product]?.requiresTapping?(j.cncDone||0):j.done)-totalTracked);
     const switches=machines.map(m=>{
       const selected=m.manualJobId===j.id,cutting=m.cutJobId===j.id && m.cutRemaining>0;
       const made=Number(contributions[m.id]||0);
       return '<button type="button" class="multi-cnc-switch'+(selected?' selected':'')+
         '" data-assign-job="'+esc(j.id)+'" data-assign-cnc="'+esc(m.id)+'" aria-pressed="'+selected+'">'+
         'CNC #'+esc(m.id)+(selected?' ✓ Assigned':' + Assign')+
         (cutting?' · Cutting':'')+' · '+made+' pcs</button>';
     }).join('');
     assignment.innerHTML='<div class="multi-cnc-heading"><strong>⚙ Assign multiple CNCs to this PO</strong>'+
       '<small>Both machines can work on the same order. One Ironman still attends each setup/reload.</small></div>'+
       '<div class="multi-cnc-row">'+switches+'</div>'+
       '<div class="multi-cnc-footer">Total good pieces '+(P[j.product]?.requiresTapping?(j.cncDone||0):j.done)+
       ' across the PO'+(legacy?' · '+legacy+' made before machine counters':'')+
       '. Each machine counts separately; the order progress is combined.</div>'+
       (P[j.product]?.requiresTapping?
         '<div class="aux-job-tapping">🔩 Tapping: '+(j.cncDone||0)+' machined / '+j.done+
         ' tapped & finished · '+(j.tappingSetupDone?'setup complete':
         'setup '+(Number.isFinite(j.tappingSetupRemaining)?j.tappingSetupRemaining:30)+' min remaining')+'</div>':'');
     card.appendChild(assignment);
   });
 };
 document.addEventListener('click',e=>{
   const b=e.target.closest('[data-support-buy],[data-assign-job]');
   if(!b)return;
   if(b.dataset.supportBuy==='tapping'){buyTapping();return;}
   if(b.dataset.supportBuy==='programmer'){hireProgrammer();return;}
   if(b.dataset.supportBuy==='tapping-staff'){hireTapping();return;}
   const job=state.jobs.find(x=>x.id===Number(b.dataset.assignJob));
   const m=state.machines.find(x=>x.id===Number(b.dataset.assignCnc));
   if(!job||!m||P[job.product]?.machine!==m.type)return;
   // Explicit toggles for simultaneous production; not an exclusive job-wide
   // dropdown. Each CNC keeps its independently saved job assignment.
   if(m.manualJobId===job.id){
     m.manualJobId=null;
     log('CNC #'+m.id+' released from PO #'+job.id+' · Auto dispatch restored');
   }else{
     m.manualJobId=job.id;
     log('CNC #'+m.id+' assigned to PO #'+job.id+' · '+P[job.product].short+
       ' (setup per CNC; one shared Ironman attends each cycle)');
   }
   toast('CNC assignments updated · all running spindle cycles finish safely');
   update();
 });
 const lastRender=render;
 render=function(){
   init();lastRender();
   const status=document.getElementById('floorStatus');
   if(status){
     status.title='One starter programmer desk; '+state.programmers+
       ' concurrent programming slot(s). Tapping '+(state.supportEquipment.tappingStations?'available':'not installed');
   }
   const tag=document.querySelector('.identity p');
   if(tag)tag.textContent='INDUSTRIAL TYCOON · SHOP SUPPORT v0.4.8 ALPHA';
 };
 init();render();
})();