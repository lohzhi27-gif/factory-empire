/*
 * Factory Empire v0.4.1 alpha: hourly playtest controls.
 * 60 actual production minutes per +1 Hour, 7h per shift.
 * Daily finance/routing/shipments run ONCE on day close, using existing
 * settled-day logic without repeating already simulated machining.
 */
(function hourlyV041(){
  'use strict';
  const START_HOUR=8;
  const HRS_PER_SHIFT=7;
  const DAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const previousDay=nextDay;
  function ensureClock(){
    if(!state || !state.machines || !state.jobs)return;
    if(!Number.isInteger(state.hourIndex)||state.hourIndex<0||state.hourIndex>=14)state.hourIndex=0;
    if(!Number.isInteger(state.hourSchemaVersion)||state.hourSchemaVersion<41){
      // Existing saves already settled any earlier whole-day advances.
      // Start a fresh 08:00 day at the saved state.day, never rewind jobs/cash.
      state.hourIndex=0;
      state.hourSchemaVersion=41;
      state.jobbingHourTotals=null;
      state.jobbingWorkerTasks={};
      state.jobbingHourShiftStarted={};
      save();
    }
  }
  function slots(){return state.shifts===2&&state.workers>=2?14:7;}
  function weekday(){return DAYS[((state.day-1)%7+7)%7];}
  function label(){
    const hr=START_HOUR+(state.hourIndex||0);
    const hour=String(hr).padStart(2,'0')+':00';
    const closed=((state.day-1)%7+7)%7>=5;
    return 'DAY '+state.day+' · '+weekday()+' · '+hour+(closed?' · WEEKEND CLOSED':'');
  }
  function settleCompletedDay(){
    const closingDay=state.day;
    const qty=typeof finalizeJobbingHours==='function'?finalizeJobbingHours():0;
    const previousRouting=advanceProductionRouting;
    const previousProduction=runJobbingProduction;
    // The original nextDay increments the calendar and runs daily AR/payroll.
    // Invoke it for the day we just completed, with hourly machining already
    // accounted for, and suppress its duplicate procurement/programming tick.
    state.day=closingDay-1;
    advanceProductionRouting=function(){};
    runJobbingProduction=function(){return qty;};
    try{
      previousDay();
    }finally{
      state.day=closingDay;
      advanceProductionRouting=previousRouting;
      runJobbingProduction=previousProduction;
    }
    state.day=closingDay+1;
    state.hourIndex=0;
    if(typeof advanceProductionRouting==='function')advanceProductionRouting();
    log('NEW DAY: Day '+state.day+' · '+weekday()+' · 08:00 shift start');
    update();
  }
  function oneHour(noRender){
    ensureClock();
    const now=state.hourIndex||0;
    const shift=now<HRS_PER_SHIFT?0:1;
    if(typeof runJobbingHour!=='function'){
      toast('Hourly production engine unavailable. Refresh the game.');return;
    }
    const produced=runJobbingHour(shift,60);
    state.hourIndex=now+1;
    state.lastOutput=state.jobbingHourTotals?.output||0;
    if(state.hourIndex>=slots())settleCompletedDay();
    else if(!noRender)update();
    return produced;
  }
  function oneDay(){
    ensureClock();
    // +1 Day finishes REMAINING hours on the current day instead of
    // producing a second day for a partially played shift.
    const remaining=slots()-state.hourIndex;
    for(let i=0;i<remaining;i++)oneHour(true);
  }
  nextDay=oneDay;
  const advanceHourBtn=document.createElement('button');
  advanceHourBtn.id='nextHourBtn';advanceHourBtn.type='button';
  advanceHourBtn.className='btn minor gold hourly-button';
  advanceHourBtn.textContent='+ 1 Hour';
  advanceHourBtn.setAttribute('aria-label','Advance one simulated hour of factory production');
  const nextButton=document.getElementById('nextDayBtn');
  if(nextButton?.parentNode)nextButton.parentNode.insertBefore(advanceHourBtn,nextButton);
  advanceHourBtn.onclick=function(){oneHour(false);};
  const floorClock=document.createElement('span');
  floorClock.id='floorClock';
  floorClock.className='floor-clock';
  floorClock.setAttribute('aria-live','polite');
  if(nextButton?.parentNode)nextButton.parentNode.insertBefore(floorClock,advanceHourBtn);
  const dayButton=document.getElementById('nextDayBtn');
  if(dayButton)dayButton.onclick=oneDay;
  const nav=document.querySelector('.main-nav');
  let clock=null;
  if(nav){
    clock=document.createElement('span');
    clock.id='simulationClock';clock.className='simulation-clock';
    clock.setAttribute('aria-live','polite');
    nav.insertBefore(clock,nav.querySelector('.nav-spacer')||nav.firstChild);
    const navDay=nav.querySelector('#navNext');
    if(navDay){
      const hour=document.createElement('button');
      hour.id='navHour';hour.type='button';hour.className='nav-next nav-hour';
      hour.textContent='+ 1 Hour';
      hour.setAttribute('aria-label','Advance one simulated hour');
      nav.insertBefore(hour,navDay);
      hour.onclick=function(){oneHour(false);};
    }
  }
  const shiftButton=document.getElementById('shiftBtn');
  if(shiftButton){
    const previousShiftClick=shiftButton.onclick;
    shiftButton.onclick=function(){
      ensureClock();
      if(state.hourIndex>0){
        toast('Finish this day before changing shifts to keep staff hours accurate.');
        return;
      }
      previousShiftClick?.();
    };
  }
  const oldRender=render;
  render=function(){
    ensureClock();
    oldRender();
    if(clock)clock.textContent=label();
    if(floorClock)floorClock.textContent=label()+' · '+state.hourIndex+'/'+slots()+' hours';
    const tagline=document.querySelector('.identity p');
    if(tagline)tagline.textContent='INDUSTRIAL TYCOON · HOURLY v0.4.1 ALPHA';
    const lbl=document.getElementById('dailyOutput');
    if(lbl)lbl.textContent=(state.jobbingHourTotals?.day===state.day?
      state.jobbingHourTotals.output:state.lastOutput||0)+' pcs'+
      (state.jobbingHourTotals?.day===state.day?' so far':' last day');
    const status=document.getElementById('floorStatus');
    if(status && state.jobs.length && state.hourIndex>0){
      status.title='Simulated hour '+state.hourIndex+' of '+slots()+' in today’s production shifts';
    }
  };
  ensureClock();
  render();
})();