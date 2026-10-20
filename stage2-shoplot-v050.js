/*
 * Factory Empire Stage 2 alpha v0.5.0 — playable shoplot relocation.
 * Owner-confirmed: 14 lost days, RM8,000 per physically moved machine,
 * RM40,000 fixed additional cost, renovation extra, max 4–5 CNC,
 * one Packing Minion RM120/working day, first Planner Hero Card,
 * owner personally provides process engineering.
 *
 * PROVISIONAL, not owner-approved: 14 days interpreted as calendar days;
 * RM30k renovation allowance; planning hero Common / RM220 workday;
 * packing 30 min/order setup + 3 min per piece, 420m/working day.
 * Lease/deposit and bank financing remain unimplemented (shown as TBD).
 * All saves remain under factory_empire_proto_v1 except explicit
 * ?stage2=demo, which uses factory_empire_stage2_demo_v1.
 */
var stage2CanShip;
(function shoplotStageTwoV050(){
 'use strict';
 const RENOVATION=30000,MOVE_PER_MACHINE=8000,FIXED=40000;
 const PACK_SETUP=30,PACK_PER_PIECE=3,PACK_DAILY=420;
 const WORKDAY=d=>((d-1)%7+7)%7<5;
 const esc=x=>escapeHtml(String(x??''));
 const active=()=>state.stage2Phase==='active';
 const relocating=()=>state.stage2Phase==='moving' && state.day<state.stage2Move.finishDay;
 const staffCost=()=>120+(state.plannerHero?.salary||220);
 const price=()=>state.machines.length*MOVE_PER_MACHINE+FIXED+RENOVATION;
 const movingMachines=()=>state.machines.length;
 function init(){
   if(!state.stage2Phase)state.stage2Phase='starter';
   if(state.stage2Phase==='moving'&&!state.stage2Move){
     // Never initiate a move implicitly on corrupted/mismatched saves.
     state.stage2Phase='starter';
   }
   if(state.stage2Phase==='active'){
     if(!Number.isInteger(state.packingMinions)||state.packingMinions<1)state.packingMinions=1;
     if(!state.plannerHero)state.plannerHero=plannerCard();
   }
 }
 function plannerCard(){
   return {id:'stage2-planner-01',name:'The Deadline Hawk',rarity:'Common',
     salary:220,role:'Production Planner',
     buff:'Flags jobs at risk up to 3 calendar days before the due date',
     debuff:'RM220 wages every working day; conservative early-risk warnings',
     balance:'provisional'};
 }
 function canMove(){
   const cost=price();
   return {cost,can:state.stage2Phase==='starter'&&state.cash>=cost,
     shortage:Math.max(0,cost-state.cash)};
 }
 function hireStageTwo(){
   if(state.stage2Phase!=='starter'){toast('Shoplot move is already underway or complete');return;}
   const status=canMove();
   if(!status.can){toast('Relocation needs '+F(status.cost)+' cash. Short '+F(status.shortage)+'. Use Stage 2 test drive to trial safely.');return;}
   if((state.hourIndex||0)!==0){
     toast('Finish the current shift before relocating. A mid-cut spindle cannot move.');return;
   }
   // No implicit loan or deficit: the actual cash moves at confirmation.
   state.cash-=status.cost;
   state.totalExpenses=(state.totalExpenses||0)+FIXED+RENOVATION+movingMachines()*MOVE_PER_MACHINE;
   state.packingMinions=1;
   state.plannerHero=plannerCard();
   state.stage2Move={startDay:state.day,finishDay:state.day+14,days:14,
     equipment:movingMachines(),movingCost:movingMachines()*MOVE_PER_MACHINE,
     fixedCost:FIXED,renovationCost:RENOVATION,calendarConvention:'calendar',
     total:status.cost};
   state.stage2Phase='moving';
   // All equipment, job WIP, labor, cash, stock and setup states persist.
   // Physical machine setups will be requalified after installation.
   for(const m of state.machines){
     m.setupPart=null;m.setupFor=null;m.setupRemaining=0;
     m.loadRemaining=0;m.loadJobId=null;
     m.manualJobId=m.manualJobId??null;
   }
   for(const j of state.jobs){
     if(!Number.isInteger(j.packedQty))j.packedQty=0;
   }
   log('STAGE 2 MOVE: '+state.stage2Move.days+' calendar days lost, '+F(status.cost)+' paid; 1 packing minion and first planning hero hired.');
   toast('Relocation underway — no CNC or packing production for 14 calendar days!');
   update();
 }
 function finishMove(){
   if(state.stage2Phase!=='moving'||state.day<state.stage2Move.finishDay)return;
   state.stage2Phase='active';
   state.stage2ArrivedDay=state.day;
   log('SHOPLOT OPENED DAY '+state.day+'! Capacity: 5 CNCs. Packing, planning hero and owner-led engineering online.');
   toast('Stage 2 unlocked! Shoplot can fit up to five CNCs.');
   save();
 }
 function workingPackingBudget(day){
   if(state.packingWorkDay!==day){
     state.packingWorkDay=day;state.packingMinutesToday=0;
   }
   return Math.max(0,PACK_DAILY-(state.packingMinutesToday||0));
 }
 function packHour(minutes){
   if(!active()||!WORKDAY(state.day)||(state.packingMinions||0)<1)return 0;
   let available=Math.min(minutes,workingPackingBudget(state.day)),worked=0,packed=0;
   if(available<=0)return 0;
   const jobs=state.jobs.slice().filter(j=>j.done>(j.packedQty||0))
     .sort((a,b)=>a.dueDay-b.dueDay||a.id-b.id);
   for(const j of jobs){
     if(available<=0)break;
     if(!j.packingSetupComplete){
       if(!Number.isFinite(j.packingSetupRemaining))j.packingSetupRemaining=PACK_SETUP;
       const min=Math.min(available,j.packingSetupRemaining);
       j.packingSetupRemaining-=min;available-=min;worked+=min;
       if(j.packingSetupRemaining>0)continue;
       j.packingSetupComplete=true;
     }
     while(available>0&&(j.packedQty||0)<j.done){
       if(!Number.isFinite(j.packingUnitRemaining)||j.packingUnitRemaining<=0)
         j.packingUnitRemaining=PACK_PER_PIECE;
       const min=Math.min(available,j.packingUnitRemaining);
       j.packingUnitRemaining-=min;available-=min;worked+=min;
       if(j.packingUnitRemaining>0)break;
       j.packedQty=(j.packedQty||0)+1;packed++;j.packingUnitRemaining=0;
     }
     if(j.packedQty===j.qty)log('PACKING COMPLETE: PO #'+j.id+' · '+j.packedQty+' pcs ready for customer dispatch.');
   }
   state.packingMinutesToday=(state.packingMinutesToday||0)+worked;
   return packed;
 }
 stage2CanShip=function(job){
   if(state.stage2Phase==='moving')return false;
   if(!active())return true;
   return (job.packedQty||0)>=job.qty;
 };
 // Wrap AFTER the tapping engine. During relocation neither CNC cutting,
 // tapping nor packing moves forward; count a zero-output hour safely.
 const beforeHour=runJobbingHour;
 runJobbingHour=function(shift,mins){
   init();
   if(relocating()){
     if(!state.jobbingHourTotals||state.jobbingHourTotals.day!==state.day)
       state.jobbingHourTotals={day:state.day,output:0,runs:{},setupMinutes:0,
         attendMinutes:0,operatorWait:0,waitByMachine:{}};
     state.jobbingDaily=state.jobbingHourTotals;
     return 0;
   }
   const pieces=beforeHour(shift,mins);
   // Packer works the first shift; do not silently double pack on night shift.
   if(shift===0)packHour(mins);
   return pieces;
 };
 const beforeDayProduction=runJobbingProduction;
 runJobbingProduction=function(workday){
   if(relocating())return 0;
   const out=beforeDayProduction(workday);
   if(workday)packHour(PACK_DAILY);
   return out;
 };
 const beforeRouting=advanceProductionRouting;
 advanceProductionRouting=function(){
   if(typeof beforeRouting==='function')beforeRouting();
   finishMove();
 };
 // Existing jobbing cap and UI still need to reflect the larger shoplot.
 const beforeBuy=buyMachine;
 buyMachine=function(type){
   if(type==='LASER'){toast('Sheet metal is still locked until Stage 3');return;}
   if(relocating()){toast('Machine buying/installation is locked until shoplot commissioning');return;}
   const ceiling=active()?5:2;
   if(state.machines.length>=ceiling){toast(active()?'Shoplot floor full — 5 machine limit':'Starter room fits only 2 CNCs. Unlock Stage 2 shoplot.');return;}
   return beforeBuy(type);
 };
 const oldRenderMachines=renderMachines;
 renderMachines=function(){
   oldRenderMachines();
   const ceiling=active()?5:2;
   document.querySelectorAll('[data-buy="CNC"]').forEach(button=>{
     if(relocating()){
       button.disabled=true;button.textContent='Relocating · 14 days';button.title='Installation resumes at shoplot commissioning';
     }else if(state.machines.length<ceiling){
       button.disabled=state.cash<180000;button.textContent='Place new CNC · '+state.machines.length+'/'+ceiling;
       button.title='Machine costs RM180,000; placement requires a free 2 × 2 floor tile';
     }else{
       button.disabled=true;button.textContent='🔒 '+(active()?'Shoplot full · 5 CNC':'Starter room full · Stage 2');
     }
   });
   const root=document.getElementById('machineList');
   if(root && state.stage2Phase!=='starter'){
     const el=document.createElement('div');el.className='stage2-packing-station';
     el.innerHTML='<strong>📦 Packing & Dispatch · Stage 2</strong>'+
       '<div>Dedicated Packing Minion: '+(state.packingMinions||0)+' · '+F(120)+'/working day</div>'+
       '<div>Hours: 420 min per normal working day · current day packed '+(state.packingMinutesToday||0)+' min</div>'+
       '<small>Final packed quantity, not just machined quantity, gates shipment and invoicing.</small>';
     root.appendChild(el);
   }
 };
 const oldJobs=renderJobs;
 renderJobs=function(){
   oldJobs();
   if(state.stage2Phase==='starter')return;
   for(const card of document.querySelectorAll('#orderList .rfq[data-radar-job]')){
     const j=state.jobs.find(x=>String(x.id)===card.dataset.radarJob);
     if(!j)continue;
     const el=document.createElement('div');el.className='stage2-job-packing';
     el.innerHTML='<strong>📦 Packing '+(j.packedQty||0)+' / '+j.qty+' pcs</strong>'+
       '<span>'+Math.max(0,j.done-(j.packedQty||0))+' completed pieces waiting for packing · '+(j.packingSetupComplete?'packing setup complete':'30-minute initial packing setup')+'</span>';
     card.appendChild(el);
     if(active()&&j.dueDay-state.day<=3 && j.packedQty<j.qty){
       const warn=document.createElement('div');warn.className='stage2-planner-warning';
       warn.textContent='⚠ Planner Hero: '+(j.dueDay<state.day?'Already overdue':(j.dueDay-state.day)+' calendar days until due')+' · '+Math.max(0,j.qty-(j.packedQty||0))+' pieces not packed.';
       card.appendChild(warn);
     }
   }
 };
 const oldFinance=renderFinance;
 renderFinance=function(){
   oldFinance();
   if(state.stage2Phase==='starter')return;
   const pay=document.getElementById('payroll');
   if(pay)pay.textContent=F((state.workers||0)*120+
     Math.max(1,Number(state.programmers)||1)*180+
     (state.tappingOperators||0)*120+staffCost())+' / working day';
   const fin=document.getElementById('financeReport');
   if(fin){
     const area=document.createElement('div');area.className='stage2-finance';
     area.innerHTML='<strong>🏭 Stage 2 shoplot costs</strong><div>Move paid: '+
       F(state.stage2Move?.total||0)+' ('+F(state.stage2Move?.movingCost||0)+' transport + '+
       F(FIXED)+' project expenses + '+F(state.stage2Move?.renovationCost||RENOVATION)+
       ' provisional renovation)</div><div>Packing minion: RM120/day · Planner Hero: RM'+
       (state.plannerHero?.salary||220)+'/day</div><small>Lease and deposit TBD; existing daily overhead remains active. No additional shoplot rent has been invented.</small>';
     fin.appendChild(area);
   }
 };
 const modal=document.createElement('dialog');modal.id='stage2Dialog';modal.className='stage2-dialog';
 document.body.appendChild(modal);
 const button=document.createElement('button');
 button.type='button';button.id='stage2Open';button.className='nav-next stage2-open';
 button.textContent='🏭 Stage 2 Shoplot';
 const nav=document.querySelector('.main-nav');
 if(nav)nav.insertBefore(button,nav.querySelector('.nav-spacer')||nav.firstChild);
 else document.querySelector('.floor-actions')?.appendChild(button);
 const open=()=>{
   redrawModal();
   if(typeof modal.showModal==='function')modal.showModal();else modal.setAttribute('open','');
 };
 function close(){
   if(typeof modal.close==='function')modal.close();else modal.removeAttribute('open');
 }
 button.addEventListener('click',open);
 function redrawModal(){
   const inTrial=!!state.stage2Demo,coming=relocating(),expanded=active();
   const total=state.stage2Move?.total||price(),bal=state.cash;
   const remaining=state.stage2Move?Math.max(0,state.stage2Move.finishDay-state.day):0;
   const moved=state.stage2Move?.equipment??movingMachines();
   const costLabel=F(total);
   const rows='<div class="stage2-quote-line"><span>Transport ('+moved+' machines × RM8,000)</span><b>'+F(moved*MOVE_PER_MACHINE)+'</b></div>'+
     '<div class="stage2-quote-line"><span>Additional project / moving costs</span><b>'+F(FIXED)+'</b></div>'+
     '<div class="stage2-quote-line"><span>Renovation (provisional balance value)</span><b>'+F(RENOVATION)+'</b></div>'+
     '<div class="stage2-quote-line stage2-quote-total"><span>Total relocation estimate</span><b>'+costLabel+'</b></div>';
   const warnings=state.jobs.length?
     '<div class="stage2-warning">⚠ '+state.jobs.length+' accepted customer orders remain open. CNC/packing will stop for 14 days; customer deadlines keep running.</div>':
     '<div class="stage2-ok">No active accepted production orders. Relocation risk is lower.</div>';
   const hero='<div class="stage2-card"><div class="stage2-card-heading"><span>★ FIRST HERO CARD</span><b>COMMON · PROTOTYPE</b></div>'+
     '<h3>Production Planner · The Deadline Hawk</h3><p>Buff: flags jobs at risk 3 days before customer due dates.</p>'+
     '<p>Debuff: conservative warnings and RM220/day salary. Character and balance will be redesigned with your own hero concepts later.</p></div>';
   let action='';
   if(expanded){
     action='<div class="stage2-ok">✓ SHOPLOT OPEN · Capacity 5 CNCs · owner is Process Engineer · 1 Packing Minion on payroll.</div>';
   }else if(coming){
     action='<div class="stage2-warning">🔧 Relocation underway: '+remaining+' calendar days remaining. No CNC or packing output. Payroll and customer deadlines continue.</div>'+
       '<button class="btn primary stage2-primary" type="button" data-stage2-action="finish">Fast-forward remaining '+remaining+' days (normal expenses apply)</button>';
   }else{
     action=warnings+
       '<div class="stage2-quote-line"><span>Cash available</span><b>'+F(bal)+'</b></div>'+
       (bal<total?'<div class="stage2-warning">Short '+F(total-bal)+'. Commercial bank-loan eligibility is not implemented yet; no free loan is granted.</div>':'')+
       '<button class="btn primary stage2-primary" data-stage2-action="relocate" type="button" '+
       (bal<total||(state.hourIndex||0)!==0?'disabled':'')+
       '>Approve relocation · '+costLabel+' · 14 days offline</button>'+
       ((state.hourIndex||0)!==0?'<small>Finish the current shift before moving.</small>':'');
   }
   modal.innerHTML='<div class="stage2-header"><div><span class="stage2-kicker">FACTORY EMPIRE · STAGE 2</span><h2>Early Growth — CNC Shoplot</h2></div>'+
     '<button class="stage2-close" type="button" data-stage2-action="close" aria-label="Close Stage 2 dialog">✕</button></div>'+
     '<p class="stage2-lead">'+(inTrial?'🧪 ISOLATED PLAYTEST COPY · RM750,000 test float on first use. Your original career money, orders and save are untouched.':'Official career mode · moving funds are deducted from your current workshop.')+
     '</p><div class="stage2-hero-grid"><div class="stage2-card"><h3>📦 Dedicated Packing Minion</h3><p>Required from the shoplot. RM120 per working day. Shipment cannot happen until the real packing queue is completed.</p>'+
     '<p><small>Test values: 30 min setup per PO, 3 min per piece. Owner to rebalance later.</small></p></div>'+hero+'</div>'+
     '<h3>Relocation costs and downtime</h3>'+rows+'<div class="stage2-disclaimer">14 days = calendar days for this alpha (owner has not chosen calendar vs workdays). Shoplot rent/deposit are TBD and not charged. Owner personally does process engineering; no hired engineer or manager roster. Stage 3 still locks sheet metal/QA.</div>'+
     action+'<div class="stage2-modal-footer">'+
     (inTrial?'<button class="btn minor ghost" data-stage2-action="return" type="button">↩ Return to original factory save</button>':
       '<button class="btn minor ghost" data-stage2-action="trial" type="button">🧪 Stage 2 test drive · separate save</button>')+
     '<button class="btn minor ghost" data-stage2-action="close" type="button">Close</button></div>';
 }
 document.addEventListener('click',function(e){
   const control=e.target.closest('[data-stage2-action]');
   if(!control)return;
   const a=control.dataset.stage2Action;
   if(a==='close'){close();return;}
   if(a==='trial'){location.href=location.pathname+'?stage2=demo';return;}
   if(a==='return'){location.href=location.pathname;return;}
   if(a==='relocate'){hireStageTwo();redrawModal();return;}
   if(a==='finish'){
     // Execute the real finance, customer deadline and hourly day-close path,
     // not a fabricated date jump that evades rent/payroll and AR.
     close();
     let runs=0;
     while(relocating() && runs<14){nextDay();runs++;}
     open();
   }
 });
 const oldRender=render;
 render=function(){
   init();finishMove();oldRender();
   const head=document.querySelector('.panel .heading h2');
   if(head && state.stage2Phase!=='starter')head.textContent=active()?'PERAI PRECISION WORKS — STAGE 2 SHOPLOT':'PERAI PRECISION WORKS — FACTORY RELOCATION';
   if(button){
     button.textContent=active()?'✓ Stage 2 Shoplot':relocating()?'🔧 Moving · '+Math.max(0,state.stage2Move.finishDay-state.day)+'d':'🏭 Stage 2 Shoplot';
   }
   const badge=document.querySelector('.identity p');
   if(badge)badge.textContent=state.stage2Demo?'STAGE 2 PLAYTEST · v0.5.0 ALPHA':
     active()?'STAGE 2 SHOPLOT · v0.5.0 ALPHA':
     relocating()?'FACTORY RELOCATION · v0.5.0 ALPHA':
     'FACTORY EMPIRE · v0.5.0 ALPHA';
 };
 init();finishMove();render();
})();
