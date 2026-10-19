/*
 * Factory Empire v0.4.5 alpha — optional four-CALENDAR-day HOT JOBS.
 * Only CNC RFQs in stages 1–2. Normal supplier/programming/worker setup rules apply.
 * Balancing decisions here are provisional: first offer at D8 or next eligible day,
 * cooldown 8–12 days, Mon/Tue offers, 1-day offer window, 50–80% unit premium,
 * small batches, award date starts the four-day customer deadline.
 * The user confirmed four CALENDAR days, not these balancing values.
 */
(function hotJobsV045(){
  'use strict';
  const HOT_VERSION=45;
  const CNC_PRODUCTS=['bracket','block'];
  const HOT_LEAD=4;
  const workday=d=>((d-1)%7+7)%7<5;
  const nextWorkday=day=>{let d=day+1;while(!workday(d))d++;return d;};
  const programReadyDay=award=>{
    const day1=nextWorkday(award),day2=nextWorkday(day1);
    return nextWorkday(day2);
  };
  const num=n=>Number.isFinite(Number(n))?Number(n):0;
  const unitMaterial=p=>p.material*(p.mat==='aluminum'?25:12);
  const esc=s=>escapeHtml(String(s??''));
  const activeHot=()=>state.hotOffer||null;
  const displayMoney=x=>F(x);
  function ensure(){
    if(state.hotJobsVersion===HOT_VERSION)return;
    if(!Number.isInteger(state.nextHotOfferDay)||state.nextHotOfferDay<1){
      state.nextHotOfferDay=Math.max(8,state.day+1);
    }
    if(!Array.isArray(state.hotHistory))state.hotHistory=[];
    state.hotJobsVersion=HOT_VERSION;
    save();
  }
  function expire(){
    if(!state.hotOffer || state.day<=state.hotOffer.expiresAfterDay)return false;
    const h=state.hotOffer;
    state.hotOffer=null;
    state.hotHistory.push({id:h.id,product:h.product,result:'expired',day:state.day});
    log('HOT JOB EXPIRED: '+P[h.product].short+' · no order awarded, no penalty');
    save();
    return true;
  }
  function canOffer(){
    if(state.day<state.nextHotOfferDay||state.hotOffer||!workday(state.day))return false;
    // Before repeat-program and weekend overtime systems arrive, start with
    // Mon/Tue offers so a 2-workday program and CNC setup can be feasible.
    const dow=(state.day-1)%7;
    if(dow>1)return false;
    return state.machines.some(m=>m.type==='CNC'&&m.condition>15);
  }
  function pickPart(){
    const busy=state.machines.filter(m=>m.type==='CNC').map(m=>m.setupFor||m.setupPart).filter(Boolean);
    const candidates=CNC_PRODUCTS.filter(p=>!busy.includes(p));
    const pool=candidates.length?candidates:CNC_PRODUCTS;
    return pool[rnd(0,pool.length-1)];
  }
  function generate(){
    if(!canOffer())return false;
    const product=pickPart(),p=P[product];
    const qty=product==='bracket'?rnd(8,13):rnd(4,6);
    const premium=1.5+Math.random()*.3;
    const offer=Math.round(p.unit*premium);
    const id=state.nextId++;
    state.hotOffer={
      id,product,qty,offer,premium:Math.round((premium-1)*100),
      dueOffset:HOT_LEAD,offeredDay:state.day,expiresAfterDay:state.day+1,
      source:'urgent_customer'
    };
    state.nextHotOfferDay=state.day+8+rnd(0,4);
    log('🔥 HOT JOB RFQ #'+id+': '+p.short+' × '+qty+
      ' · '+displayMoney(qty*offer)+' potential sales · 4 CALENDAR days after PO award');
    save();
    return true;
  }
  function tick(){
    ensure();
    expire();
    generate();
  }
  function capacityRisk(h){
    const p=P[h.product],need=+(h.qty*p.material).toFixed(1),
      available=+(num(state[p.mat])).toFixed(1);
    const earliest=programReadyDay(state.day);
    const dueDay=state.day+HOT_LEAD;
    const materialOk=available+1e-7>=need;
    const machineOk=state.machines.some(m=>m.type==='CNC'&&m.condition>15);
    const manpowerOk=state.workers>=1;
    const jobSlotsOk=state.jobs.length<5;
    const timingOk=earliest<=dueDay && state.day<=h.expiresAfterDay;
    const setupTime=h.product==='bracket'?21:180;
    const duration=setupTime+h.qty*p.cycle; // rough single-machine mins, no scrap/attention.
    const staffedShiftMins=420*(state.shifts===2&&state.workers>=2?2:1);
    const machineDays=Math.ceil(duration/staffedShiftMins);
    const reason=!materialOk?'Stock shortage (urgent parts require on-hand material)':
      !machineOk?'Working CNC required':
      !manpowerOk?'No minion available':
      !jobSlotsOk?'Maximum five active production orders':
      !timingOk?'Two working days of programming push machining beyond the four-day deadline':
      null;
    const current=state.machines.filter(m=>m.type==='CNC');
    const different=current.filter(m=>m.setupPart && m.setupPart!==h.product);
    return {p,need,available,earliest,dueDay,materialOk,machineOk,manpowerOk,jobSlotsOk,timingOk,
      setupTime,machineDays,canAccept:!reason,reason,
      displaced: different.map(m=>'#'+m.id+' '+(P[m.setupPart]?.short||m.setupPart))};
  }
  function decline(){
    const h=activeHot();if(!h)return;
    state.hotOffer=null;
    state.hotHistory.push({id:h.id,product:h.product,result:'declined',day:state.day});
    log('DECLINED HOT JOB #'+h.id+' · protected current commitments; no penalty');
    toast('Urgent offer declined · no penalty');
    update();
  }
  function acceptHot(){
    ensure();expire();
    const h=activeHot();if(!h){toast('That urgent offer has expired');return;}
    const risk=capacityRisk(h);
    if(!risk.canAccept){toast('HOT JOB blocked: '+risk.reason);return;}
    // Use the EXISTING capability/routing/award chain. The temporary quote never
    // replaces normal quoted orders and is removed after acceptance.
    const transient={id:h.id,product:h.product,qty:h.qty,offer:h.offer,dueOffset:HOT_LEAD};
    state.rfqs.push(transient);
    const before=state.jobs.length;
    try{
      accept(h.id);
    }finally{
      state.rfqs=state.rfqs.filter(q=>q.id!==h.id);
    }
    const job=state.jobs.find(j=>j.id===h.id);
    if(state.jobs.length===before||!job){
      toast('Hot order not awarded. Check production capacity.');
      update();return;
    }
    job.hot=true;
    job.hotAwardDay=state.day;
    job.hotOfferDay=h.offeredDay;
    job.hotPremiumPercent=h.premium;
    job.dueDay=state.day+HOT_LEAD;
    state.hotOffer=null;
    state.hotHistory.push({id:h.id,product:h.product,result:'awarded',day:state.day});
    log('🔥 HOT PO AWARDED #'+h.id+' · '+risk.p.short+' × '+h.qty+
      ' · DUE DAY '+job.dueDay+' (4 CALENDAR days from award, weekends included)');
    toast('HOT JOB accepted! Open Production → prioritize on CNC to schedule.');
    currentTab='orders';
    update();
  }
  const origRouting=advanceProductionRouting;
  advanceProductionRouting=function(){
    if(typeof origRouting==='function')origRouting();
    tick();
  };
  const prevRfqRender=renderRfq;
  const panel=document.createElement('div');
  panel.id='hotJobPanel';panel.className='hot-job-panel';
  const rfqRoot=document.getElementById('rfqList');
  if(rfqRoot?.parentNode)rfqRoot.parentNode.insertBefore(panel,rfqRoot);
  function renderHot(){
    if(!panel)return;
    const h=activeHot();
    if(!h){
      const next=Number(state.nextHotOfferDay)||8;
      panel.innerHTML='<div class="hot-job-pending"><strong>🔥 Urgent customer desk</strong>'+
        '<span>No HOT JOB offer right now. Occasional premium orders arrive as your factory develops.'+
        (state.day<next?' Next possible offer from Day '+next+'.':' Watch for incoming requests.')+
        '</span></div>';
      return;
    }
    const risk=capacityRisk(h),p=risk.p;
    const stock=risk.materialOk?
      '<span class="hot-check pass">✓ Material: '+risk.available+' kg available / '+risk.need+' kg required</span>':
      '<span class="hot-check fail">⚠ Material short: '+risk.available+' / '+risk.need+' kg '+esc(p.mat)+'</span>';
    const due=risk.dueDay;
    const busy=risk.displaced.length?
      'Prepared CNCs that would require a new setup: '+risk.displaced.map(esc).join(', ')+'.':
      'No existing completed setup needs changing on currently prepared CNCs.';
    const active=state.jobs.length;
    const daysLeft=Math.max(0,h.expiresAfterDay-state.day+1);
    panel.innerHTML=
      '<div class="hot-job-card">'+
      '<div class="hot-job-top"><div><span class="hot-eyebrow">🔥 LIMITED URGENT RFQ #'+esc(h.id)+'</span>'+
      '<h4>'+esc(p.name)+'</h4><small>'+esc(p.company)+' · '+esc(h.qty)+' pcs</small></div>'+
      '<span class="hot-priority">+'+esc(h.premium)+'% UNIT PREMIUM</span></div>'+
      '<div class="hot-job-facts"><div><small>HOT sales value</small><strong>'+displayMoney(h.offer*h.qty)+'</strong></div>'+
      '<div><small>Customer lead time</small><strong>4 calendar days</strong></div>'+
      '<div><small>If awarded now</small><strong>Due Day '+due+'</strong></div>'+
      '<div><small>Offer availability</small><strong>'+daysLeft+' day'+(daysLeft===1?'':'s')+' left</strong></div></div>'+
      '<div class="hot-job-checks">'+stock+
      '<span class="hot-check '+(risk.timingOk?'pass':'fail')+'">'+(risk.timingOk?'✓':'⚠')+
      ' Two WORKING days programming · earliest machining Day '+risk.earliest+'</span>'+
      '<span class="hot-check">⚙ '+risk.setupTime+' min new-part setup · ~'+risk.machineDays+
      ' shift-day'+(risk.machineDays===1?'':'s')+' theoretical cutting/setup (before competing orders)</span>'+
      '<span class="hot-check">📋 '+active+'/5 active jobs · '+esc(busy)+'</span>'+
      '<span class="hot-check warning">⚠ This job shares the Ironman with existing POs. Other customers could become late; machine setup A → B → A must be repeated.</span></div>'+
      (risk.reason?'<div class="hot-job-blocked">Cannot award yet: '+esc(risk.reason)+'</div>':'')+
      '<div class="hot-job-actions"><button class="btn minor ghost" type="button" data-hot-decline>Decline · no penalty</button>'+
      '<button class="btn minor gold" type="button" data-hot-accept '+(!risk.canAccept?'disabled title="'+esc(risk.reason)+'"':'')+
      '>🔥 Accept urgent PO</button></div></div>';
  }
  renderRfq=function(){
    prevRfqRender();
    renderHot();
  };
  const prevJobRender=renderJobs;
  renderJobs=function(){
    prevJobRender();
    const jobCards=[...document.querySelectorAll('#orderList .rfq[data-radar-job]')];
    jobCards.forEach(card=>{
      const j=state.jobs.find(j=>String(j.id)===card.dataset.radarJob);
      if(!j?.hot)return;
      card.classList.add('hot-production-order');
      const banner=document.createElement('div');
      banner.className='hot-job-order-banner';
      banner.innerHTML='🔥 <strong>HOT JOB #'+esc(j.id)+'</strong> · 4 CALENDAR DAYS'+
        ' · <strong>DUE DAY '+j.dueDay+'</strong> · '+(j.dueDay-state.day>=0?
        (j.dueDay-state.day)+' day(s) until deadline':'OVERDUE '+(state.day-j.dueDay)+' day(s)');
      const header=card.querySelector('.rfqhead');
      if(header)header.after(banner);else card.prepend(banner);
      // Only the chosen CNC gets interrupted; no silent machine-switching on award.
      const action=document.createElement('div');action.className='hot-job-dispatch';
      const available=state.machines.filter(m=>m.type==='CNC'&&m.condition>15);
      if(available.length){
        action.innerHTML='<label>Dispatch urgent job to CNC <select data-hot-cnc="'+esc(j.id)+'" aria-label="Choose CNC for hot job">'+
          available.map(m=>'<option value="'+m.id+'"'+(m.manualJobId===j.id?' selected':'')+'>CNC #'+m.id+
          ' · '+esc(m.setupFor||m.setupPart?P[m.setupFor||m.setupPart]?.short||'Setup present':'No setup')+
          '</option>').join('')+'</select></label>'+
          '<button class="btn minor gold" data-hot-dispatch="'+j.id+'" type="button">⚙ Prioritize HOT JOB</button>';
        card.appendChild(action);
      }
    });
  };
  document.addEventListener('click',function(e){
    const button=e.target.closest('button');
    if(!button)return;
    if(button.matches('[data-hot-accept]')){acceptHot();return;}
    if(button.matches('[data-hot-decline]')){decline();return;}
    if(button.matches('[data-hot-dispatch]')){
      const jobId=Number(button.dataset.hotDispatch),job=state.jobs.find(j=>j.id===jobId&&j.hot);
      if(!job)return;
      const select=button.parentNode?.querySelector('select[data-hot-cnc]');
      const id=Number(select?.value);
      const m=state.machines.find(m=>m.id===id&&m.type==='CNC');
      if(!m)return;
      m.manualJobId=job.id;
      log('🔥 HOT JOB #'+job.id+' given production priority on CNC #'+m.id+
        ' (current cutting cycle may finish first; full part changeover required)');
      toast('CNC #'+m.id+' prioritized HOT JOB. Other orders may slip.');
      update();
    }
  });
  ensure();
  // Catch up if a tester loaded a save already past first event.
  expire();
  generate();
  render();
})();