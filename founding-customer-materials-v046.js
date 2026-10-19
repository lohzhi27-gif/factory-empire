/*
 * Factory Empire v0.4.6 alpha — actual order material usage + founding customer.
 * All orders/customer data and prices in the game are illustrative, not actual
 * YPS Technologies POs or commercial agreements.
 * This extension does not change machine cutting, inventory consumption, or
 * the localStorage key. Existing saves are upgraded without a reset.
 */
(function materialsAndFoundingCustomerV046(){
  'use strict';
  const YPS='YPS Technologies';
  const VERSION=46;
  const fmt=x=>(Math.round(Math.max(0,Number(x)||0)*10)/10).toLocaleString('en-MY',{
    minimumFractionDigits:1,maximumFractionDigits:1});
  const safe=x=>escapeHtml(String(x??''));
  const productMaterial=mat=>mat==='aluminum'?'Aluminum':mat==='steel'?'Sheet Steel':mat;
  function alreadyHasYps(){
    return state.rfqs.some(q=>q.customer===YPS)||
      state.jobs.some(j=>j.customer===YPS)||
      (state.receivables||[]).some(i=>i.customer===YPS);
  }
  function init(){
    if(!state || !Array.isArray(state.rfqs)||!Array.isArray(state.jobs))return;
    if(state.foundingCustomerVersion===VERSION)return;
    // An older save must not lose a single quote or accepted order.
    // Offer this player one introductory fictional YPS job when an RFQ slot opens.
    state.ypsIntroductionPending=!alreadyHasYps();
    state.foundingCustomerVersion=VERSION;
    save();
  }
  function introduceIfPossible(){
    if(!state.ypsIntroductionPending)return false;
    if(state.rfqs.length>=5)return false;
    const q={
      id:state.nextId++,
      product:'bracket',
      qty:30,
      dueOffset:8,
      offer:175,
      customer:YPS,
      foundingCustomer:true
    };
    state.rfqs.unshift(q);
    state.ypsIntroductionPending=false;
    log('Founding customer tribute: '+YPS+' introduced with a sample CNC bracket RFQ.');
    save();
    return true;
  }
  const beforeRfq=renderRfq;
  renderRfq=function(){
    init();introduceIfPossible();
    beforeRfq();
    const cards=[...document.querySelectorAll('#rfqList .rfq')];
    cards.forEach((card,i)=>{
      const q=state.rfqs[i];
      if(!q || q.customer!==YPS)return;
      card.classList.add('founding-yps-rfq');
      const label=document.createElement('div');
      label.className='founding-customer-tag';
      label.textContent='★ '+YPS+' · '+(q.foundingCustomer?'FOUNDING CUSTOMER':'RETURNING CUSTOMER');
      const header=card.querySelector('.rfqhead');
      if(header)header.after(label);else card.prepend(label);
      if(q.foundingCustomer){
        const note=document.createElement('div');
        note.className='founding-customer-note';
        note.textContent='A tribute to the customer who stood by a small manufacturing business. This is a fictional game order.';
        label.after(note);
      }
    });
  };

  function inflightCount(job){
    return state.machines.reduce((n,m)=>n+(m.cutRemaining>0 && String(m.cutJobId)===String(job.id)?1:0),0);
  }
  function demandForMaterial(mat){
    return state.jobs.reduce((sum,j)=>{
      const p=P[j.product];
      if(!p || p.mat!==mat)return sum;
      const inflight=inflightCount(j);
      return sum+Math.max(0,(Number(j.qty)||0)-(Number(j.done)||0)-inflight)*p.material;
    },0);
  }
  function usage(job){
    const p=P[job.product];if(!p)return null;
    const per=Number(p.material)||0;
    const completed=Math.max(0,Number(job.done)||0),scrapped=Math.max(0,Number(job.scrap)||0);
    const inflight=inflightCount(job);
    // Material is deducted when a part STARTS cutting. Include the current
    // uncompleted cutting cycle, but not a merely queued/loading cycle.
    const consumed=(completed+scrapped+inflight)*per;
    const remaining=Math.max(0,(Number(job.qty)||0)-completed-inflight)*per;
    const original=(Number(job.qty)||0)*per;
    const stock=Math.max(0,Number(state[p.mat])||0);
    const totalUncut=demandForMaterial(p.mat);
    const shortage=Math.max(0,totalUncut-stock);
    return {per,original,consumed,remaining,stock,totalUncut,shortage,
      inflight,scrapped,mat:p.mat,progress:consumed+remaining>0?
        Math.round(consumed/(consumed+remaining)*100):0};
  }
  const beforeJobs=renderJobs;
  renderJobs=function(){
    beforeJobs();
    const cards=[...document.querySelectorAll('#orderList .rfq[data-radar-job]')];
    for(const card of cards){
      const j=state.jobs.find(job=>String(job.id)===card.dataset.radarJob);
      if(!j)continue;
      const d=usage(j);if(!d)continue;
      const box=document.createElement('section');
      box.className='order-material-usage';
      box.setAttribute('aria-label','Material usage for production order '+j.id);
      const scarce=d.shortage>0;
      box.innerHTML=
        '<div class="order-material-header"><strong>◈ Material · '+safe(productMaterial(d.mat))+'</strong>'+
        '<span>'+fmt(d.per)+' kg / piece</span></div>'+
        '<div class="order-material-metrics">'+
        '<div><small>Original plan</small><strong>'+fmt(d.original)+' kg</strong></div>'+
        '<div><small>Consumed incl. scrap</small><strong>'+fmt(d.consumed)+' kg</strong></div>'+
        '<div><small>Still required*</small><strong>'+fmt(d.remaining)+' kg</strong></div>'+
        '<div><small>Shared stock</small><strong>'+fmt(d.stock)+' kg</strong></div>'+
        '</div>'+
        '<div class="order-material-progress"><div class="order-material-progress-label">'+
        '<span>Input consumed toward this job</span><strong>'+d.progress+'%</strong></div>'+
        '<div class="order-material-progress-track" role="progressbar" aria-label="Input consumed toward production order '+safe(j.id)+
        '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+d.progress+'">'+
        '<span style="width:'+d.progress+'%"></span></div></div>'+
        '<div class="order-material-foot'+(scarce?' order-material-short':'')+'">'+
        (scarce?'⚠ '+fmt(d.shortage)+' kg short across active '+safe(productMaterial(d.mat))+' orders. ':
        '✓ Stock covers current open '+safe(productMaterial(d.mat))+' requirements. ')+
        'All open orders still need '+fmt(d.totalUncut)+' kg. Shared stock is not reserved per job.'+
        (d.scrapped?' · '+fmt(d.scrapped*d.per)+' kg lost to scrap.':'')+
        (d.inflight?' · '+d.inflight+' part currently cutting.':'')+
        '</div>'+
        '<div class="order-material-disclaimer">* Minimum additional stock needed to finish, excluding future scrap. Consumption includes completed parts, scrap and cutting in progress.</div>';
      card.appendChild(box);
      if(j.customer===YPS){
        card.classList.add('founding-yps-order');
        const info=document.createElement('div');
        info.className='founding-customer-tag';
        info.textContent='★ '+YPS+' · FOUNDING CUSTOMER';
        const heading=card.querySelector('.rfqhead');
        if(heading)heading.after(info);else card.prepend(info);
      }
    }
  };
  init();
  render();
})();