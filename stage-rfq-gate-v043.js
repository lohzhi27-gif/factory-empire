/*
 * Factory Empire v0.4.3 alpha — Stage 1 / 2 quotation gate.
 *
 * Laser and sheet-metal RFQs must never be offered before Stage 3.
 * Save prior unaccepted legacy offers in an inert archive, leaving already
 * accepted orders, inventory, machines, cash, and player history untouched.
 *
 * Do NOT restore old archived offers automatically; they may be stale by
 * Stage 3. New Stage 3 RFQ generation will be designed when it unlocks.
 */
(function stageThreeQuotationGate(){
  'use strict';
  function isSheetMetalOffer(q){
    return P[q?.product]?.machine==='LASER';
  }
  function archivePrematureOffers(){
    if(!state || !Array.isArray(state.rfqs))return false;
    const locked=state.rfqs.filter(isSheetMetalOffer);
    if(!locked.length)return false;
    if(!Array.isArray(state.deferredSheetMetalRfqs))state.deferredSheetMetalRfqs=[];
    const seen=new Set(state.deferredSheetMetalRfqs.map(q=>String(q.id)));
    for(const q of locked){
      if(seen.has(String(q.id)))continue;
      state.deferredSheetMetalRfqs.push({...q,hiddenForStage:3});
      seen.add(String(q.id));
    }
    // Only unaccepted quotations are deferred. Never mutate state.jobs.
    state.rfqs=state.rfqs.filter(q=>!isSheetMetalOffer(q));
    save();
    return true;
  }
  const oldRfqRender=renderRfq;
  renderRfq=function(){
    archivePrematureOffers();
    return oldRfqRender();
  };
  // Ensure legacy saves are corrected before the player next taps +1 Hour.
  archivePrematureOffers();
  const previousRender=render;
  render=function(){
    previousRender();
    const tagline=document.querySelector('.identity p');
    if(tagline)tagline.textContent='INDUSTRIAL TYCOON · CNC RFQs v0.4.3 ALPHA';
  };
  render();
})();