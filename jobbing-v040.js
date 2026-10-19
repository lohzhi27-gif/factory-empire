/*
 * Factory Empire v0.4.0 alpha — real CNC setup/changeovers + shared minion attention.
 * Scoped slice: no new loans/hero cards/quality department/IAP; save key remains unchanged.
 * Owner-confirmed setup times: easy 21, medium 90, difficult 180 operator minutes.
 * Provisional tuning: 2 minutes of operator load/unload attention per machining cycle.
 */
var runJobbingProduction;
(function jobbingV040(){
  'use strict';
  const SETUPS={easy:21,medium:90,difficult:180};
  const DIFFICULTY={bracket:'easy',block:'difficult',plate:'medium',housing:'difficult'};
  const LOAD_MIN=2;
  const workday=d=>((d-1)%7+7)%7<5;
  function difficulty(p){return DIFFICULTY[p]||'medium';}
  function setupMinutes(p){return SETUPS[difficulty(p)];}
  function qualified(j,m){
    const p=P[j.product],r=j.routing;
    return !!(p && p.machine===m.type && j.done<j.qty &&
      (!r || r.phase==='machining' && (!r.machineReadyDay||r.machineReadyDay<=state.day)));
  }
  function init(){
    if(!state || !Array.isArray(state.machines))return;
    if(Number(state.jobbingVersion)>=400)return;
    state.machines.forEach(m=>{
      // Respect already-produced legacy orders: don't charge a surprise changeover on
      // a machine that was plausibly configured for that job before this upgrade.
      const prior=state.jobs.find(j=>P[j.product]?.machine===m.type && j.done>0 && j.done<j.qty &&
        (!j.routing||j.routing.phase==='machining'));
      if(!Object.prototype.hasOwnProperty.call(m,'setupPart'))m.setupPart=prior?prior.product:null;
      m.setupFor=null;m.setupRemaining=0;m.cutRemaining=0;m.cutJobId=null;
      m.loadRemaining=0;m.loadJobId=null;
      if(!Number.isInteger(m.manualJobId))m.manualJobId=null;
    });
    state.jobbingVersion=400;
    if(state.shifts===2 && state.workers<2){
      state.shifts=1;
      log('STAFFING: Double shift reset to one shift. A second distinct minion is required.');
    }
    save();
  }
  function getJob(m){
    if(m.manualJobId!==null){
      const chosen=state.jobs.find(j=>j.id===m.manualJobId&&P[j.product]?.machine===m.type&&j.done<j.qty);
      if(!chosen){m.manualJobId=null;}else{return qualified(chosen,m)?chosen:null;}
    }
    // Maintain the current configured part unless an earlier-due order requires changeover.
    return state.jobs.filter(j=>qualified(j,m)&&hasQty(j)).sort((a,b)=>a.dueDay-b.dueDay||
      (a.product===m.setupPart?-1:b.product===m.setupPart?1:0))[0]||null;
  }
  function inflight(jobId){
    return state.machines.filter(m=>m.cutJobId===jobId&&m.cutRemaining>0 ||
      m.loadJobId===jobId&&m.loadRemaining>0).length;
  }
  function hasQty(j){return j.done+inflight(j.id)<j.qty;}
  function jobForMachine(m){
    // A part already in the spindle must complete its cycle before another is set up.
    if(m.cutRemaining>0||m.loadRemaining>0){
      return state.jobs.find(j=>j.id===(m.cutRemaining>0?m.cutJobId:m.loadJobId))||null;
    }
    return getJob(m);
  }
  function need(m,j){
    if(!j||m.condition<=15||m.cutRemaining>0)return null;
    if(m.loadRemaining>0)return {kind:'load',job:j};
    if(!hasQty(j))return null;
    if(m.setupFor && m.setupFor!==j.product){
      // A change in the selected job resets any incomplete setup.
      m.setupFor=null;m.setupRemaining=0;
    }
    if(m.setupPart!==j.product){
      if(m.setupFor!==j.product){m.setupFor=j.product;m.setupRemaining=setupMinutes(j.product);
        log('SETUP started: '+P[j.product].short+' on '+m.type+' #'+m.id+
          ' · '+m.setupRemaining+' operator min ('+difficulty(j.product)+')');}
      return {kind:'setup',job:j};
    }
    if(!hasQty(j)||state[P[j.product].mat]+1e-7<P[j.product].material)return null;
    return {kind:'load',job:j};
  }
  function finishCut(m,counts){
    const j=state.jobs.find(j=>j.id===m.cutJobId),p=j&&P[j.product];
    if(j&&p){
      const fail=Math.random()<(.015+(100-m.condition)*.0009);
      if(fail){j.scrap++;state.totalScrap++}
      else{j.done++;state.totalProduced++;counts.output++}
      counts.runs[m.id]=(counts.runs[m.id]||0)+1;
    }
    m.cutRemaining=0;m.cutJobId=null;
  }
  function startCut(m,job){
    const p=P[job.product];
    if(!p || !hasQty(job) || state[p.mat]+1e-7<p.material)return false;
    state[p.mat]=Math.max(0,Math.round((state[p.mat]-p.material)*1000)/1000);
    m.cutJobId=job.id;
    m.cutRemaining=Math.max(1,p.cycle-LOAD_MIN);
    return true;
  }
  function machineReady(m){return m.condition>15;}
  function runShift(workers,counts){
    if(!workers)return;
    const eligible=state.machines.filter(machineReady);
    const groups=Array.from({length:workers},()=>[]);
    // Balance machines across available workers. The second minion must actually
    // ease load/reload waiting, even when the shop has only two CNCs.
    eligible.slice(0,workers*3).forEach((m,i)=>groups[i%workers].push(m));
    const active=groups.flat();
    if(!active.length)return;
    for(const m of active){
      if(m.type==='CNC' && Math.random()<.006+(100-m.condition)*.0003){
        m.condition=Math.max(0,m.condition-24);
        log('Unplanned machine stoppage on #'+m.id);
      }
    }
    const tasks=groups.map(()=>null);
    for(let minute=0;minute<420;minute++){
      // Automatic spindle cycles progress even when the operator is busy elsewhere.
      for(const m of active){
        if(!machineReady(m)||m.cutRemaining<=0)continue;
        m.cutRemaining--;
        if(m.cutRemaining===0)finishCut(m,counts);
      }
      for(let w=0;w<groups.length;w++){
        const group=groups[w];
        if(!group.length)continue;
        let task=tasks[w];
        if(!task){
          const options=[];
          for(const m of group){
            const j=jobForMachine(m);
            const request=need(m,j);
            if(!request)continue;
            const priority=(m.manualJobId!==null?-100000:0)+j.dueDay*10+
              (request.kind==='setup'?0:1);
            options.push({m,j,kind:request.kind,priority});
          }
          options.sort((a,b)=>a.priority-b.priority||a.m.id-b.m.id);
          if(options.length){
            const o=options[0];
            if(o.kind==='load'&&o.m.loadRemaining<=0){
              o.m.loadRemaining=LOAD_MIN;o.m.loadJobId=o.j.id;
            }
            task={machine:o.m,kind:o.kind,jobId:o.j.id};
            tasks[w]=task;
          }
        }
        if(task){
          const m=task.machine;
          if(!machineReady(m)){tasks[w]=null;continue;}
          if(task.kind==='setup'){
            m.setupRemaining=Math.max(0,m.setupRemaining-1);
            counts.setupMinutes++;
            if(m.setupRemaining===0){m.setupPart=m.setupFor;m.setupFor=null;tasks[w]=null;}
          }else{
            m.loadRemaining=Math.max(0,m.loadRemaining-1);
            counts.attendMinutes++;
            if(m.loadRemaining===0){
              const job=state.jobs.find(j=>j.id===m.loadJobId);
              m.loadJobId=null;
              if(job)startCut(m,job);
              tasks[w]=null;
            }
          }
        }
        // Other machines in the worker's cell can be waiting for their next load
        // while this worker is committed to a difficult setup or load.
        if(task){
          for(const m of group){
            if(m===task.machine||!machineReady(m)||m.cutRemaining>0)continue;
            const j=jobForMachine(m);
            if(j && m.setupPart===j.product && hasQty(j) &&
              state[P[j.product].mat]+1e-7>=P[j.product].material)counts.operatorWait++;
          }
        }
      }
    }
  }
  runJobbingProduction=function(isWorkday){
    init();
    const counts={output:0,runs:{},setupMinutes:0,attendMinutes:0,operatorWait:0};
    if(isWorkday!==false && workday(state.day)){
      const workers=Math.max(0,Math.floor(Number(state.workers)||0));
      const two=state.shifts===2&&workers>=2;
      const first=two?Math.ceil(workers/2):workers;
      runShift(first,counts);
      if(two)runShift(workers-first,counts);
    }
    for(const m of state.machines){
      const runs=counts.runs[m.id]||0;
      if(!runs)continue;
      if(m.type==='LASER'){
        m.laserOperatingDays=(m.laserOperatingDays||0)+1;
        m.condition=Math.max(15,+(100-85*m.laserOperatingDays/365).toFixed(1));
        if(m.laserOperatingDays>=365&&!m.laserServiceWarningIssued){
          m.laserServiceWarningIssued=true;
          log('Major service due: Fiber Laser #'+m.id+' reached 365 operating days.');
        }
      }else m.condition=Math.max(0,+(m.condition-(1+runs*.055)).toFixed(1));
    }
    if(counts.setupMinutes)log('SETUP TIME: '+counts.setupMinutes+' min · shared minions kept other machines waiting '+counts.operatorWait+' min');
    state.jobbingDaily={day:state.day,...counts};
    return counts.output;
  };
  function jobOptions(m){
    const options=state.jobs.filter(j=>P[j.product]?.machine===m.type&&j.done<j.qty)
      .sort((a,b)=>a.dueDay-b.dueDay);
    return '<option value="auto"'+(m.manualJobId===null?' selected':'')+'>Auto · earliest due</option>'+
      options.map(j=>'<option value="'+j.id+'"'+(m.manualJobId===j.id?' selected':'')+'>'+
      escapeHtml(P[j.product].short)+' · D'+j.dueDay+'</option>').join('');
  }
  // Stage 1 milestone: new players begin in a tiny 2-CNC room. Preserve all
  // earlier saves and already-owned lasers rather than confiscating equipment.
  const previousBuy=buyMachine;
  buyMachine=function(type){
    if(type==='LASER'){toast('Sheet metal and new laser purchases unlock at Stage 3 · Semi-D factory');return;}
    if(state.machines.length>=2){toast('Starter room limit: 2 machines. Shoplot expansion comes at Stage 2');return;}
    return previousBuy(type);
  };
  const previousAccept=accept;
  accept=function(id){
    const q=state.rfqs.find(x=>x.id===id);
    if(q && P[q.product]?.machine==='LASER'){
      toast('Sheet-metal orders unlock at Stage 3 · Semi-D factory');
      return;
    }
    return previousAccept(id);
  };
  // Future prospecting in the starter room offers CNC-only jobs; previous
  // saved RFQs remain untouched and are labeled if still locked.
  addRfq=function(paid){
    if(paid && state.cash<300){toast('Insufficient cash for prospecting');return;}
    if(state.rfqs.length>=5){toast('Complete or accept existing quotations first');return;}
    if(paid){state.cash-=300;state.totalExpenses+=300;}
    const product=Math.random()<.5?'bracket':'block',p=P[product];
    const qty=rnd(25,85),dueOffset=rnd(5,13),offer=Math.round(p.unit*(.85+Math.random()*.27));
    state.rfqs.push({id:state.nextId++,product,qty,dueOffset,offer});
    if(paid)log('Sales generated a new CNC customer RFQ (RM300)');
    update();
  };
  const oldMachineRender=renderMachines;
  renderMachines=function(){
    init();
    oldMachineRender();
    const cards=[...document.querySelectorAll('#machineList .machine')];
    cards.forEach((card,i)=>{
      const m=state.machines[i];
      if(!m)return;
      const extra=document.createElement('div');
      extra.className='jobbing-machine';
      const current=m.setupFor||m.setupPart;
      const text=m.cutRemaining>0?'Cutting · '+m.cutRemaining+' min remain':
        m.setupRemaining>0?'Setting '+(P[current]?.short||current)+' · '+m.setupRemaining+' min remain':
        m.loadRemaining>0?'Operator loading · '+m.loadRemaining+' min':
        m.setupPart?'Setup ready · '+(P[m.setupPart]?.short||m.setupPart):'No part set up yet';
      extra.innerHTML='<div class="jobbing-machine-state">⚙ '+escapeHtml(text)+'</div>'+
        '<label>Machine job priority <select data-machine-job="'+m.id+'" aria-label="Production assignment for machine '+m.id+'">'+
        jobOptions(m)+'</select></label>';
      card.appendChild(extra);
    });
    document.querySelectorAll('[data-buy]').forEach(b=>{
      if(b.dataset.buy==='LASER'){
        b.disabled=true;b.title='Sheet metal unlocks at Stage 3 (semi-D)';
        b.textContent='🔒 Stage 3 · Sheet Metal';
      }else if(state.machines.length>=2){
        b.disabled=true;b.title='Starter room fits a maximum of two machines';
        b.textContent='🔒 Room full · Stage 2';
      }
    });
  };
  const oldJobRender=renderJobs;
  renderJobs=function(){
    oldJobRender();
    const e=document.getElementById('orderList');
    if(!e)return;
    const stats=state.jobbingDaily;
    const summary=document.createElement('div');
    summary.className='jobbing-summary';
    summary.innerHTML='<strong>⚙ v0.4 · Shared minion scheduling</strong>'+
      '<span>Each new part requires setup: Easy 21m · Medium 90m · Difficult 180m.</span>'+
      '<span>One minion tends up to 3 CNCs, but other machines wait when he is setting up or loading.</span>'+
      (stats?'<span>Day '+stats.day+': '+stats.setupMinutes+'m spent on setups · '+stats.operatorWait+' machine-min waiting for attention.</span>':'');
    e.prepend(summary);
  };
  const oldRfq=renderRfq;
  renderRfq=function(){
    oldRfq();
    const cards=document.querySelectorAll('#rfqList .rfq');
    cards.forEach((card,i)=>{
      const q=state.rfqs[i];if(!q)return;
      if(P[q.product]?.machine==='LASER'){
        const btn=card.querySelector('[data-accept]');
        if(btn){btn.disabled=true;btn.textContent='🔒 Unlock sheet metal · Stage 3';}
        const warning=document.createElement('div');
        warning.className='jobbing-rfq-setup';
        warning.textContent='Semi-D industrial lot required. Sheet-metal production remains locked until Stage 3.';
        const footer=card.querySelector('.rfqfoot');
        if(footer)card.insertBefore(warning,footer);
        return;
      }
      const info=document.createElement('div');
      info.className='jobbing-rfq-setup';
      info.textContent='New part setup · '+difficulty(q.product)+' · '+setupMinutes(q.product)+' min of operator time / changeover';
      const foot=card.querySelector('.rfqfoot');
      if(foot)card.insertBefore(info,foot);
    });
  };
  const oldFinance=renderFinance;
  renderFinance=function(){
    oldFinance();
    const p=document.getElementById('payroll');
    if(p)p.textContent=F((state.workers||0)*160)+' / staffed working day';
    const hire=document.getElementById('hireBtn');
    if(hire){
      const capacity=2*Math.max(1,Math.ceil(state.machines.length/3));
      hire.disabled=state.workers>=capacity||state.cash<800;
      hire.title='Each minion may tend up to 3 running CNCs in one shift. Hire another for the second shift or to reduce setup bottlenecks.';
    }
  };
  hire=function(){
    init();
    const capacity=2*Math.max(1,Math.ceil(state.machines.length/3));
    if(state.workers>=capacity){toast('Staffing cap for current CNC cell reached');return;}
    if(state.cash<800){toast('Need RM800 to recruit and train a minion');return;}
    state.cash-=800;state.totalExpenses+=800;state.workers++;
    log('Hired operator #'+state.workers+' · can attend another shift or CNC cell (RM800)');
    update();
  };
  const hireButton=document.getElementById('hireBtn');
  if(hireButton)hireButton.onclick=hire;
  const shiftButton=document.getElementById('shiftBtn');
  if(shiftButton)shiftButton.onclick=function(){
    init();
    if(state.shifts===1&&state.workers<2){
      toast('Two shifts require two different minions. Hire another first.');return;
    }
    state.shifts=state.shifts===1?2:1;
    log('Set '+state.shifts+' staffed shift'+(state.shifts===2?'s':''));
    update();
  };
  document.addEventListener('change',function(e){
    const target=e.target;
    if(!target || !target.matches || !target.matches('[data-machine-job]'))return;
    init();
    const id=Number(target.dataset.machineJob),m=state.machines.find(m=>m.id===id);
    if(!m)return;
    const value=target.value;
    if(value==='auto')m.manualJobId=null;
    else{
      const job=state.jobs.find(j=>j.id===Number(value)&&P[j.product]?.machine===m.type);
      if(!job)return;
      m.manualJobId=job.id;
    }
    log('Machine #'+m.id+' dispatch set to '+(m.manualJobId===null?'automatic':P[state.jobs.find(j=>j.id===m.manualJobId)?.product]?.short||'job #'+m.manualJobId));
    toast('Dispatch preference saved · setup begins when the job is ready');
    update();
  });
  const oldRender=render;
  render=function(){
    init();
    oldRender();
    const info=document.getElementById('ganttMaterialSummary');
    if(info&&!info.querySelector('.jobbing-gantt-caution')){
      const note=document.createElement('div');
      note.className='jobbing-gantt-caution';
      note.textContent='v0.4 alpha: This Gantt is a rough forecast. It does not yet model setup minutes or the shared-minion waiting time. Actual daily production now does.';
      info.appendChild(note);
    }
    const tagline=document.querySelector('.identity p');
    if(tagline)tagline.textContent='INDUSTRIAL TYCOON · JOBBING v0.4 ALPHA';
  };
  init();
  render();
})();