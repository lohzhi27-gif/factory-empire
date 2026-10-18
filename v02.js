(function v02factory(){
  'use strict';
  const floor={w:8,h:6,ox:430,oy:92,sx:47,sy:22,z:13,footprint:2};
  const pricing={CNC:180000,LASER:150000};
  const footprint=type=>type==='LASER'?{w:3,h:2}:{w:2,h:2};
  let chosenId=null, moveMode=false, purchaseMode=null, selectedTile=null;
  const canvas=document.getElementById('factoryCanvas');
  if(!canvas || typeof state==='undefined')return;
  const factory=canvas.parentElement;
  const toolbar=document.createElement('div');
  toolbar.className='floor-tools';
  toolbar.innerHTML='<div class="floor-actions"><strong>🏭 WORKSHOP LAYOUT</strong><button class="btn minor ghost" id="inspectVmc" type="button">🔎 Inspect machine</button><button class="btn minor" id="moveVmc" type="button">↔ Move selected</button><button class="btn minor ghost" id="cancelLayout" type="button">Cancel</button></div><div class="floor-hint" id="floorHint" aria-live="polite">Tap the CNC to select it, then tap Move selected.</div>';
  factory.after(toolbar);
  const info=toolbar.querySelector('#floorHint');
  const moveBtn=toolbar.querySelector('#moveVmc');
  const cancelBtn=toolbar.querySelector('#cancelLayout');
  const inspectBtn=toolbar.querySelector('#inspectVmc');
  const inspector=document.createElement('dialog');
  inspector.className='machine-inspector';
  inspector.innerHTML='<div class="machine-inspector-head"><strong>STARTER VMC-760 · UNBRANDED</strong><button class="btn minor ghost" id="closeVmcPreview" type="button">✕ Close</button></div><img src="assets/starter-vmc.svg?v=21" alt="Original illustration of a fully enclosed vertical CNC milling center with front sliding doors, control panel and tower light"><p>Generic 3-axis enclosed VMC · 1 machine included at start · in-game additional machine RM180,000.</p>';
  document.body.appendChild(inspector);
  inspectBtn.addEventListener('click',()=>{
    const m=state.machines.find(x=>x.id===chosenId);if(!m)return;
    const laser=m.type==='LASER';
    inspector.querySelector('.machine-inspector-head strong').textContent=laser?'FIBER LASER 3015 · UNBRANDED':'STARTER VMC-760 · UNBRANDED';
    inspector.querySelector('img').src=laser?'assets/laser-cutter.svg?v=23':'assets/starter-vmc.svg?v=21';
    inspector.querySelector('img').alt=laser?'Original open-bed fiber laser with long slat table, overhead bridge, cutting head and console':'Original enclosed vertical CNC milling machine';
    inspector.querySelector('p').textContent=laser
      ?'Open-bed fiber laser cutter · RM150,000 game cash · '+Math.max(0,365-(m.laserOperatingDays||0))+' operating days until major service.'
      :'Generic 3-axis enclosed VMC · first machine included free · additional machine RM180,000 game cash.';
    if(typeof inspector.showModal==='function')inspector.showModal();else inspector.setAttribute('open','');
  });
  inspector.querySelector('#closeVmcPreview').addEventListener('click',()=>{if(typeof inspector.close==='function')inspector.close();else inspector.removeAttribute('open');});
  const originalSeed=seed;
  seed=function(){const fresh=originalSeed();fresh.machines[0].tileX=2;fresh.machines[0].tileY=1;fresh.machines[0].model='Starter VMC-760';fresh.layoutVersion=2;chosenId=1;moveMode=false;purchaseMode=null;selectedTile=null;return fresh;};
  function occupied(x,y,ignore,type){
    const target=footprint(type||state.machines.find(m=>m.id===ignore)?.type||'CNC');
    return state.machines.some(m=>{
      if(m.id===ignore||!Number.isInteger(m.tileX)||!Number.isInteger(m.tileY))return false;
      const size=footprint(m.type);
      return x<m.tileX+size.w&&x+target.w>m.tileX&&y<m.tileY+size.h&&y+target.h>m.tileY;
    });
  }
  function valid(x,y,ignore,type){
    const size=footprint(type||purchaseMode||state.machines.find(m=>m.id===ignore)?.type||'CNC');
    return Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&y>=0&&x+size.w<=floor.w&&y+size.h<=floor.h&&!occupied(x,y,ignore,type);
  }
  function ensureLayout(){
    let changed=false;
    const allocated=[];
    for(let i=0;i<state.machines.length;i++){
      const m=state.machines[i],size=footprint(m.type);
      const collide=(x,y)=>allocated.some(p=>x<p.x+p.w&&x+size.w>p.x&&y<p.y+p.h&&y+size.h>p.y);
      const okay=(x,y)=>Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&y>=0&&x+size.w<=floor.w&&y+size.h<=floor.h&&!collide(x,y);
      if(i===0&&m.type==='CNC'&&!Number.isInteger(m.tileX)&&okay(2,1)){
        m.tileX=2;m.tileY=1;changed=true;
      }
      if(!okay(m.tileX,m.tileY)){
        let found=null;
        outer:for(let y=0;y<=floor.h-size.h;y++)for(let x=0;x<=floor.w-size.w;x++){if(okay(x,y)){found=[x,y];break outer;}}
        if(found){m.tileX=found[0];m.tileY=found[1];changed=true;}
      }
      if(okay(m.tileX,m.tileY))allocated.push({x:m.tileX,y:m.tileY,...size});
      if(m.type==='CNC'&&!m.model){m.model='Starter VMC-760';changed=true;}
      if(m.type==='LASER'){
        if(!m.model||m.model==='Prototype Laser Cutter'){m.model='Fiber Laser 3015';changed=true;}
        if(!Number.isFinite(m.laserOperatingDays)){
          // New durability rules for legacy lasers: start with a fresh 365-operating-day service cycle.
          m.laserOperatingDays=0;m.condition=100;m.laserServiceWarningIssued=false;changed=true;
        }
      }
    }
    if(state.layoutVersion!==3){state.layoutVersion=3;changed=true;}
    if(changed)save();
    if(chosenId===null&&state.machines.length)chosenId=state.machines[0].id;
  }
  const coord=(x,y,z=0)=>[floor.ox+(x-y)*floor.sx,floor.oy+(x+y)*floor.sy-z];
  function poly(ctx,points,fill,stroke,strokeWidth=1){
    ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.lineWidth=strokeWidth;ctx.strokeStyle=stroke;ctx.stroke();}
  }
  function side(ctx,x,y,dx,dy,bottom,top,color){
    poly(ctx,[coord(x,y,bottom),coord(x+dx,y+dy,bottom),coord(x+dx,y+dy,top),coord(x,y,top)],color,'#162635',1);
  }
  function body(ctx,x,y,w,h,bottom,top,front,right,roof){
    side(ctx,x,y+h,w,0,bottom,top,front);
    side(ctx,x+w,y,0,h,bottom,top,right);
    poly(ctx,[coord(x,y,top),coord(x+w,y,top),coord(x+w,y+h,top),coord(x,y+h,top)],roof,'#738592',.8);
  }
  function frontPanel(ctx,x,y,x1,x2,z1,z2,color,stroke){
    const yf=y+2.012;
    poly(ctx,[coord(x+x1,yf,z1),coord(x+x2,yf,z1),coord(x+x2,yf,z2),coord(x+x1,yf,z2)],color,stroke||'#6c7b84');
  }
  
  // Hand-illustrated fictional VMC asset; no original manufacturer branding.
  // Keep the fallback body while the sprite is loading or when images are blocked.
  const vmcSprite=new Image();
  let vmcSpriteReady=false;
  vmcSprite.onload=()=>{vmcSpriteReady=true;drawFactory();};
  vmcSprite.onerror=()=>{vmcSpriteReady=false;};
  vmcSprite.src='assets/starter-vmc.svg?v=21';
  function drawVmc(ctx,m){
    const x=m.tileX,y=m.tileY,center=coord(x+1,y+1,floor.z);
    if(vmcSpriteReady){
      // Floor-anchored at the centre of this machine's 2x2 footprint.
      ctx.drawImage(vmcSprite,center[0]-100,center[1]-149,200,180);
    }else{
      body(ctx,x+.14,y+.18,1.8,1.7,14,27,'#3a4550','#293743','#53616a');
      body(ctx,x+.14,y+.18,1.8,1.7,27,83,'#c0ccd0','#758995','#e4e9e9');
      const q=coord(x+.85,y+1.92,60);
      ctx.fillStyle='#1a2d37';ctx.fillRect(q[0]-21,q[1]-32,45,48);
    }
    const active=state.jobs.some(j=>P[j.product]&&P[j.product].machine==='CNC'&&j.done<j.qty);
    if(active){
      const light=coord(x+1.9,y+1.8,97);
      ctx.fillStyle='#72f5aa';ctx.beginPath();ctx.arc(light[0],light[1],4,0,Math.PI*2);ctx.fill();
    }
    const label=coord(x+1,y+1.10,150);
    ctx.textAlign='center';ctx.fillStyle='#e8f3f5';ctx.font='bold 12px system-ui';
    ctx.fillText('STARTER VMC-760 #'+m.id,label[0],label[1]);
    if(m.condition<35){ctx.fillStyle='#ff827e';ctx.fillText('⚠ REPAIR',label[0],label[1]-15);}
  }
  // Original open-bed, gantry-type laser asset. Draw on the canvas without copying manufacturer logos.
  const laserSprite=new Image();
  let laserSpriteReady=false;
  laserSprite.onload=()=>{laserSpriteReady=true;drawFactory();};
  laserSprite.onerror=()=>{laserSpriteReady=false;};
  laserSprite.src='assets/laser-cutter.svg?v=23';
  function drawLaser(ctx,m){
    const x=m.tileX,y=m.tileY,base=coord(x+1.5,y+1,floor.z);
    if(laserSpriteReady){
      ctx.drawImage(laserSprite,base[0]-153,base[1]-127,306,161);
    }else{
      body(ctx,x+.04,y+.12,2.85,1.8,13,29,'#535d62','#3b4852','#121b25');
      body(ctx,x+.24,y+.34,2.4,1.23,29,39,'#1b2932','#18232d','#13202c');
      body(ctx,x+1.2,y+.25,.26,1.58,39,73,'#d47042','#ae502c','#f28d52');
      const pt=coord(x+1.35,y+1,89);ctx.fillStyle='#eaf1ed';ctx.fillRect(pt[0]-13,pt[1],26,42);
    }
    const label=coord(x+1.5,y+1,116);
    ctx.textAlign='center';ctx.fillStyle='#ecf7fa';ctx.font='bold 12px system-ui';
    ctx.fillText('FIBER LASER 3015 #'+m.id,label[0],label[1]);
    if(m.laserOperatingDays>=365){ctx.fillStyle='#ffa47b';ctx.fillText('SERVICE DUE',label[0],label[1]-17);}
  }
  function draw(){
    const ctx=canvas.getContext('2d');if(!ctx)return;
    const w=canvas.width,h=canvas.height;
    ctx.clearRect(0,0,w,h);
    const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#2c4555');bg.addColorStop(.75,'#101c2a');bg.addColorStop(1,'#0a1521');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
    // workshop walls, overhead lights
    for(let i=0;i<8;i++){
      ctx.fillStyle='#47677725';ctx.fillRect(30+i*112,15,55,58);
      ctx.fillStyle='#75a6aa33';ctx.fillRect(28+i*112,15,70,6);
    }
    poly(ctx,[coord(0,0,4),coord(8,0,4),coord(8,6,4),coord(0,6,4)],'#1b2b39');
    side(ctx,0,6,8,0,0,13,'#1d2d3d');
    side(ctx,8,0,0,6,0,13,'#111c29');
    for(let y=0;y<6;y++)for(let x=0;x<8;x++){
      poly(ctx,[coord(x,y,13),coord(x+1,y,13),coord(x+1,y+1,13),coord(x,y+1,13)],(x+y)%2?'#364c59':'#324653','#425867');
    }
    // tile selection / move target
    if(selectedTile){
      const [x,y]=selectedTile;
      const okay=valid(x,y,moveMode?chosenId:null,purchaseMode);
      const size=footprint(purchaseMode||state.machines.find(m=>m.id===chosenId)?.type||'CNC');
      const accent=okay?'#55d9bb':'#f08b83';
      poly(ctx,[coord(x,y,14),coord(x+size.w,y,14),coord(x+size.w,y+size.h,14),coord(x,y+size.h,14)],okay?'#58daba26':'#f08b8333',accent,2.8);
    }
    ctx.fillStyle='#1b2531';ctx.fillRect(25,24,180,52);
    ctx.textAlign='left';ctx.fillStyle='#b6d7e5';ctx.font='bold 11px system-ui';ctx.fillText('YOUR FIRST WORKSHOP',37,43);
    ctx.font='bold 19px system-ui';ctx.fillStyle='#fff';ctx.fillText('DAY '+state.day,37,67);
    const machines=state.machines.filter(m=>Number.isInteger(m.tileX)).slice().sort((a,b)=>(a.tileX+a.tileY)-(b.tileX+b.tileY));
    for(const m of machines){
      if(m.type==='CNC')drawVmc(ctx,m);else drawLaser(ctx,m);
      if(m.id===chosenId){
        const x=m.tileX,y=m.tileY,s=footprint(m.type);
        poly(ctx,[coord(x,y,15),coord(x+s.w,y,15),coord(x+s.w,y+s.h,15),coord(x,y+s.h,15)],null,'#67f3ce',3);
      }
    }
    // simple worker silhouette near first operating CNC, keeps machines unobscured
    for(let i=0;i<Math.min(state.workers,machines.length);i++){
      const m=machines[i],p=coord(Math.min(7.85,m.tileX+2.2),Math.min(5.8,m.tileY+1.7),21);
      ctx.fillStyle='#e9c5a0';ctx.beginPath();ctx.arc(p[0],p[1]-24,6,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#d39d57';ctx.fillRect(p[0]-6,p[1]-18,12,18);
      ctx.fillStyle='#202d38';ctx.fillRect(p[0]-4,p[1],3,12);ctx.fillRect(p[0]+2,p[1],3,12);
    }
    ctx.textAlign='left';ctx.font='12px system-ui';ctx.fillStyle='#a8bbca';ctx.fillText('ORIGINAL INDUSTRIAL WORKSHOP • v0.2.3',18,h-20);
    ctx.textAlign='right';ctx.fillText('MACHINES '+state.machines.length+' • TAP TO SELECT',w-18,h-20);
  }
  function syncTools(){
    const m=state.machines.find(v=>v.id===chosenId);
    moveBtn.disabled=!m;
    inspectBtn.disabled=!m;
    moveBtn.classList.toggle('selected',moveMode);
    cancelBtn.disabled=!(purchaseMode||moveMode);
    if(purchaseMode)info.textContent='PURCHASE MODE: Tap a free '+(purchaseMode==='LASER'?'3 × 2':'2 × 2')+' tile area to place your '+(purchaseMode==='CNC'?'VMC':'laser cutter')+'. In-game cash is charged only on placement.';
    else if(moveMode)info.textContent='MOVE MODE: Tap a free '+(m?.type==='LASER'?'3 × 2':'2 × 2')+' tile area to relocate '+(m?.model||'machine #'+chosenId)+'. Tap Cancel to stop.';
    else if(m)info.textContent='Selected: '+(m.model||m.type+' #'+m.id)+' · Condition '+Math.round(m.condition)+'%'+(m.type==='LASER'?' · Service in '+Math.max(0,365-(m.laserOperatingDays||0))+' operating days':'')+'. Tap Move selected to rearrange.';
    else info.textContent='Tap a machine to inspect it. Choose Equipment to buy another machine.';
  }
  const oldRender=render;
  render=function(){ensureLayout();oldRender();syncTools();};
  drawFactory=draw;
  renderMachines=function(){
    document.getElementById('machineList').innerHTML=state.machines.map(m=>{
      const laser=m.type==='LASER',days=laser?Math.max(0,365-(m.laserOperatingDays||0)):null;
      return '<div class="machine"><div class="left"><div class="iconbox">'+(laser?'⚡':'🏭')+'</div><div><strong>'+(m.model||(laser?'Fiber Laser 3015':'Starter VMC-760'))+' #'+m.id+'</strong><div class="sub">Floor '+(m.tileX+1)+','+(m.tileY+1)+' · Condition '+Math.round(m.condition)+'%'+(laser?' · Service in '+days+' operating days':'')+'</div></div></div><div class="right"><button class="btn minor ghost" data-maintain="'+m.id+'" '+(m.condition>=99?'disabled':'')+'>Service RM850</button></div></div>';
    }).join('');
    document.querySelectorAll('[data-buy]').forEach(b=>{
      const type=b.dataset.buy,card=b.closest('.buycard'),price=pricing[type],costEl=card.querySelector('.cost');
      if(costEl)costEl.textContent=F(price);
      const descEl=card.querySelector('.desc');
      if(descEl)descEl.textContent=type==='CNC'?'Original unbranded Starter VMC-760; 2 × 2 tiles.':'Open-bed 3015 fiber laser; 3 × 2 tiles; 365 operating-day major service interval.';
      b.textContent='Place '+(type==='CNC'?'VMC':'laser');
      b.disabled=state.cash<price||state.machines.length>=10;
    });
  };
  buyMachine=function(type){
    if(purchaseMode===type){purchaseMode=null;selectedTile=null;render();return;}
    if(state.cash<pricing[type]){toast('Need '+F(pricing[type])+' available cash to buy '+(type==='CNC'?'VMC':'laser'));return;}
    if(state.machines.length>=10){toast('The workshop is full');return;}
    purchaseMode=type;moveMode=false;chosenId=null;selectedTile=null;currentTab='machines';render();
    toast('Tap an empty space on the factory floor to place your equipment');
    canvas.scrollIntoView({behavior:'smooth',block:'center'});
  };
  function tap(e){
    const rect=canvas.getBoundingClientRect();
    const px=(e.clientX-rect.left)*canvas.width/rect.width;
    const py=(e.clientY-rect.top)*canvas.height/rect.height;
    const dx=(px-floor.ox)/floor.sx,dy=(py-floor.oy+floor.z)/floor.sy;
    const x=Math.floor((dx+dy)/2),y=Math.floor((dy-dx)/2);
    if(x<0||x>=8||y<0||y>=6){toast('Tap inside the factory floor');return;}
    if(purchaseMode||moveMode){
      if(!valid(x,y,moveMode?chosenId:null,purchaseMode)){selectedTile=[x,y];draw();toast('That area is blocked or too close to the workshop edge');return;}
      if(moveMode){
        const m=state.machines.find(v=>v.id===chosenId);if(!m){moveMode=false;render();return;}
        m.tileX=x;m.tileY=y;moveMode=false;selectedTile=null;log('Relocated '+(m.model||'machine')+' to floor '+(x+1)+','+(y+1));toast('Machine moved — layout saved');update();return;
      }
      const type=purchaseMode,price=pricing[type];if(state.cash<price){purchaseMode=null;toast('Insufficient cash');render();return;}
      state.cash-=price;state.totalCapex+=price;
      const m={id:state.nextId++,type,condition:100,tileX:x,tileY:y,model:type==='CNC'?'Starter VMC-760':'Fiber Laser 3015'};
      if(type==='LASER'){m.laserOperatingDays=0;m.laserServiceWarningIssued=false;}
      state.machines.push(m);chosenId=m.id;purchaseMode=null;selectedTile=null;
      log('Purchased and installed '+m.model+' for '+F(price));toast('Machine installed! Hire an operator to increase capacity');update();return;
    }
    const hit=state.machines.slice().reverse().find(m=>{const s=footprint(m.type);return x>=m.tileX&&x<m.tileX+s.w&&y>=m.tileY&&y<m.tileY+s.h;});
    chosenId=hit?hit.id:null;selectedTile=hit?null:[Math.min(x,6),Math.min(y,4)];
    render();
  }
  canvas.addEventListener('click',tap);
  moveBtn.addEventListener('click',()=>{if(!state.machines.some(m=>m.id===chosenId))return;moveMode=true;purchaseMode=null;selectedTile=null;render();toast('Tap a free area for your selected machine');});
  cancelBtn.addEventListener('click',()=>{moveMode=false;purchaseMode=null;selectedTile=null;render();});
  const help=document.getElementById('helpBtn');
  help.onclick=()=>alert('FACTORY EMPIRE v0.2.3\n\nTap a machine in the factory to inspect it.\nTap MOVE SELECTED, then tap an empty area (VMC 2 × 2; Laser 3 × 2).\nTo buy equipment, open Equipment and tap Place VMC / Place laser, then tap an empty area. In-game money is charged ONLY when placed.\n\nThe starter workshop includes ONE free VMC, and moving it is free.\nThe fiber laser costs RM150,000 in-game and receives major service after 365 operating days.\n\nAdvance days to run production; accept RFQs from New RFQs.\n\nThis is an early 2D browser game; no real money, advertising, or payments are implemented.');
  ensureLayout();
  render();
})();
