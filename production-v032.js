/*
 * Factory Empire v0.3.2 — initial production routing.
 * Extends the existing simulation without replacing the game state or saved workshop layout.
 * Business assumptions: day 1 = Monday, Mon–Fri are working days; no public holiday calendar yet.
 * Material purchase: 2–5 working days. Program: 2 working days after material readiness.
 * Finishing and secondary processes are planned for v0.5 (not charged or simulated here).
 */
var advanceProductionRouting;
(function productionCoreV032(){
  'use strict';
  const materialSpecs={
    aluminum:{name:'Aluminum',rate:25},
    steel:{name:'Sheet Steel',rate:12}
  };
  const isWorkDay=day=>((day-1)%7+7)%7<5;
  const nextWorkDay=day=>{let d=day+1;while(!isWorkDay(d))d++;return d;};
  const addWorkDays=(day,count)=>{let d=day;for(let i=0;i<count;i++)d=nextWorkDay(d);return d;};
  const storageVersion=32;
  function ensureState(){
    if(!Array.isArray(state.materialOrders))state.materialOrders=[];
    if(!Number.isInteger(state.productionSchemaVersion)||state.productionSchemaVersion<storageVersion){
      // Preserve old jobs already accepted before v0.3.2. Do not backdate production.
      state.jobs.forEach(j=>{
        if(!j.routing)j.routing={phase:'machining',machineReadyDay:state.day,legacy:true};
      });
      state.productionSchemaVersion=storageVersion;
      save();
    }
  }
  const materialName=t=>materialSpecs[t]?.name||t;
  const routingPhase=j=>{
    if(!j.routing)return 'machining';
    if(j.routing.phase==='machining' && (j.routing.machineReadyDay||0)>state.day)return 'programming';
    return j.routing.phase;
  };
  function routeText(j){
    if(!j.routing)return 'Machining — legacy order';
    const r=j.routing;
    if(r.phase==='awaiting_material'){
      const mat=P[j.product]?.mat;
      const remaining=Math.max(0,Math.ceil((j.qty*P[j.product].material-state[mat])*10)/10);
      const next=state.materialOrders.filter(x=>x.type===mat).sort((a,b)=>a.arrivalDay-b.arrivalDay)[0];
      return 'Material procurement · '+remaining.toFixed(1)+' kg required'+(next?' · delivery D'+next.arrivalDay:' · place a material order');
    }
    if(r.phase==='programming'){
      if(r.programRemaining>0)return 'CNC programming · '+r.programRemaining+' working day'+(r.programRemaining===1?'':'s')+' remaining';
      return 'Program complete · machining starts Day '+r.machineReadyDay;
    }
    return 'CNC / laser production · machine queue';
  }
  // Called by the patched legacy nextDay immediately after advancing the calendar,
  // and before evaluating available machines.
  advanceProductionRouting=function(){
    ensureState();
    const arrived=state.materialOrders.filter(p=>p.arrivalDay<=state.day);
    for(const po of arrived){
      state[po.type]=+(state[po.type]+po.qty).toFixed(3);
      log('RECEIVED material PO #'+po.id+': '+po.qty+' kg '+materialName(po.type)+' · inventory updated');
    }
    state.materialOrders=state.materialOrders.filter(p=>p.arrivalDay>state.day);
    for(const j of state.jobs){
      if(!j.routing)j.routing={phase:'machining',machineReadyDay:state.day,legacy:true};
      const r=j.routing,p=P[j.product];
      if(!p||r.phase==='machining')continue;
      if(r.phase==='awaiting_material'){
        // Require enough stock for the initial order. Scrap/replacements draw from remaining stock.
        if(state[p.mat]+1e-7>=j.qty*p.material){
          r.phase='programming';
          r.programRemaining=2;
          r.programStartDay=nextWorkDay(state.day);
          log('Material available for '+p.short+' · CNC programming queued for Day '+r.programStartDay);
        }
      }else if(r.phase==='programming' && isWorkDay(state.day) && state.day>=r.programStartDay && r.programRemaining>0){
        r.programRemaining--;
        if(r.programRemaining===0){
          r.phase='machining';
          r.machineReadyDay=nextWorkDay(state.day);
          log('PROGRAM COMPLETE: '+p.short+' · machine can start Day '+r.machineReadyDay);
        }
      }
    }
  };
  const previousAccept=accept;
  accept=function(id){
    ensureState();
    const q=state.rfqs.find(x=>x.id===id);
    if(!q)return;
    const before=state.jobs.length;
    previousAccept(id);
    if(state.jobs.length===before)return;
    const job=state.jobs.find(j=>j.id===q.id);
    if(!job)return;
    const p=P[job.product],enough=state[p.mat]+1e-7>=job.qty*p.material;
    job.routing=enough
      ?{phase:'programming',programRemaining:2,programStartDay:nextWorkDay(state.day)}
      :{phase:'awaiting_material',programRemaining:2};
    log('ROUTING: '+p.short+' → '+(enough?'programming starts Day '+job.routing.programStartDay:'waiting for '+materialName(p.mat)+' procurement'));
    update();
  };
  buyMaterial=function(type){
    ensureState();
    if(!materialSpecs[type])return;
    const el=document.getElementById('buyQty-'+type);
    const raw=Number(el?.value||10),qty=Math.round(raw*10)/10,price=qty*materialSpecs[type].rate;
    if(!Number.isFinite(qty)||qty<1||qty>1000){toast('Choose 1–1,000 kg of material');return;}
    if(state.cash+1e-7<price){toast('Insufficient cash for this material PO');return;}
    const delay=2+Math.floor(Math.random()*4),arrivalDay=addWorkDays(state.day,delay);
    state.cash=Math.round((state.cash-price)*100)/100;
    state.totalMaterials=Math.round((state.totalMaterials+price)*100)/100;
    const po={id:state.nextId++,type,qty,price,orderedDay:state.day,delayWorkingDays:delay,arrivalDay};
    state.materialOrders.push(po);
    log('PLACED material PO #'+po.id+': '+qty+' kg '+materialName(type)+' · '+F(price)+' · due Day '+arrivalDay+' ('+delay+' workdays)');
    toast('Material ordered · scheduled for Day '+arrivalDay);
    update();
  };
  renderInventory=function(){
    ensureState();
    const root=document.getElementById('inventory');
    const materials=Object.entries(materialSpecs).map(([type,data])=>{
      const active=state.materialOrders.filter(p=>p.type===type).reduce((a,p)=>a+p.qty,0);
      return '<div class="procure-row"><div class="procure-name"><strong>'+data.name+'</strong>'
        +'<span>'+state[type].toFixed(1)+' kg available · '+F(data.rate)+'/kg'
        +(active?' · '+active.toFixed(1)+' kg incoming':'')+'</span></div>'
        +'<div class="procure-controls"><label for="buyQty-'+type+'">kg</label>'
        +'<input id="buyQty-'+type+'" type="number" inputmode="decimal" min="1" max="1000" step="0.5" value="10" aria-label="'+data.name+' order quantity in kg">'
        +'<button class="btn minor primary" data-material="'+type+'">Order material</button></div></div>';
    }).join('');
    const orders=state.materialOrders.slice().sort((a,b)=>a.arrivalDay-b.arrivalDay);
    const queue=orders.length?orders.map(po=>'<div class="procure-po"><span>PO #'+po.id+' · '+materialName(po.type)+' · '+po.qty+' kg</span>'
       +'<strong>Arrives D'+po.arrivalDay+'</strong></div>').join('')
      :'<p class="mini">No pending deliveries.</p>';
    root.innerHTML=materials+'<div class="procure-queue"><div class="procure-title">Incoming material deliveries</div>'
      +'<p class="mini">Lead time 2–5 working days · purchasing is paid immediately · no instant stock</p>'
      +queue+'</div>';
  };
  renderJobs=function(){
    ensureState();
    document.getElementById('jobCount').textContent=state.jobs.length;
    const byDue=state.jobs.slice().sort((a,b)=>a.dueDay-b.dueDay);
    document.getElementById('orderList').innerHTML=byDue.length?byDue.map(j=>{
      const p=P[j.product],r=j.routing||{phase:'machining'},pct=Math.round(100*j.done/j.qty),late=state.day>j.dueDay;
      const progressLabel=r.phase==='machining'?'Machining':r.phase==='programming'?'Programming':'Material';
      const issue=!state.machines.some(m=>m.type===p.machine)?'⚠ No compatible machine available'
        :r.phase==='machining'&&state[p.mat]<p.material?'⚠ Material depleted; order replenishment'
        :routeText(j);
      return '<div class="rfq"><div class="rfqhead"><h4>'+p.short+'</h4>'
        +badge(late?'late':j.dueDay-state.day<=2?'':'good',late?'LATE '+(state.day-j.dueDay)+'d':'DUE D'+j.dueDay)+'</div>'
        +'<div class="company">'+escapeHtml(j.customer)+'</div>'
        +'<div class="routing-status">'+progressLabel+' · '+escapeHtml(routeText(j))+'</div>'
        +'<div class="detailrow"><span>Completed</span><strong>'+j.done+' / '+j.qty+' pcs</strong></div>'
        +'<div class="progress"><i style="width:'+pct+'%"></i></div>'
        +'<div class="detailrow"><span>Process · cycle</span><strong>'+p.machine+' · '+p.cycle+' min/pc</strong></div>'
        +'<div class="detailrow"><span>Scrapped</span><strong>'+j.scrap+' pcs</strong></div>'
        +'<div class="detailrow"><span>Order sales</span><strong>'+F(j.qty*j.price)+'</strong></div>'
        +'<div class="twoline">'+escapeHtml(issue)+'</div></div>';
    }).join(''):'<div class="empty">No active production orders.<br/>Accept an RFQ to begin.</div>';
    document.getElementById('receivableList').innerHTML=state.receivables.length
      ?state.receivables.map(i=>'<div class="resource"><div><strong>'+escapeHtml(i.customer)+'</strong>'
        +'<div class="sub">Payment due Day '+i.payDay+'</div></div><strong>'+F(i.total)+'</strong></div>').join('')
      :'<div class="mini">No unpaid invoices</div>';
  };
  const previousRenderRfq=renderRfq;
  renderRfq=function(){
    previousRenderRfq();
    // Lead-time warning computed from user's chosen quantity and cycle; finishing not yet included.
    document.querySelectorAll('#rfqList .rfq').forEach((card,index)=>{
      const q=state.rfqs[index],p=P[q?.product];if(!q||!p)return;
      const materialOK=state[p.mat]>=q.qty*p.material;
      const machineDays=Math.ceil(q.qty*p.cycle/(420*Math.max(1,state.shifts)));
      const minimum=2+machineDays+(materialOK?0:2);
      const warning=document.createElement('div');
      warning.className='rfq-lead-check '+(minimum>=q.dueOffset?'at-risk':'');
      warning.textContent=minimum>=q.dueOffset
        ?'⚠ Tight schedule: programming + machining'+(materialOK?'':' + material delivery')+' may exceed the deadline'
        :'Planning estimate: '+minimum+' working days before finishing and shipping';
      const foot=card.querySelector('.rfqfoot');
      if(foot)card.insertBefore(warning,foot);
    });
  };
  const previousRender=render;
  render=function(){
    ensureState();
    previousRender();
    const stageLabel=document.getElementById('floorStatus');
    if(stageLabel&&state.jobs.length){
      const waiting=state.jobs.filter(j=>j.routing?.phase==='awaiting_material').length;
      const programming=state.jobs.filter(j=>j.routing?.phase==='programming').length;
      stageLabel.textContent=waiting?'Material pending: '+waiting+' order(s)':programming?'Programming: '+programming+' order(s)':'Production underway';
    }
  };
  ensureState();
  render();
})();
