(function v02factory(){
  'use strict';
  const floor={w:8,h:6,ox:430,oy:92,sx:47,sy:22,z:13,footprint:2};
  const pricing={CNC:180000,LASER:150000};
  const footprint=type=>type==='LASER'?{w:3,h:2}:{w:2,h:2};
  let chosenId=null, moveMode=false, purchaseMode=null, selectedTile=null;
  let moveDraft=null, ignoreClickOnce=false, pointerDrag=null;
  const canvas=document.getElementById('factoryCanvas');
  if(!canvas || typeof state==='undefined')return;
  const factory=canvas.parentElement;
  const toolbar=document.createElement('div');
  toolbar.className='floor-tools';
  toolbar.innerHTML='<div class="floor-actions"><strong>🏭 WORKSHOP LAYOUT</strong><button class="btn minor ghost" id="previewLaser" type="button">⚡ Preview laser</button><button class="btn minor ghost" id="inspectVmc" type="button">🔎 Inspect machine</button><button class="btn minor" id="moveVmc" type="button">↔ Move selected</button><button class="btn minor ghost" id="cancelLayout" type="button">Cancel</button></div><div class="floor-hint" id="floorHint" aria-live="polite">Tap the CNC to select it, then tap Move selected.</div>';
  factory.after(toolbar);
  const info=toolbar.querySelector('#floorHint');
  const moveBtn=toolbar.querySelector('#moveVmc');
  const cancelBtn=toolbar.querySelector('#cancelLayout');
  const inspectBtn=toolbar.querySelector('#inspectVmc');
  const previewLaserBtn=toolbar.querySelector('#previewLaser');
  const movePanel=document.createElement('div');
  movePanel.className='move-editor';
  movePanel.hidden=true;
  movePanel.innerHTML='<div class="move-editor-title"><strong>POSITION MACHINE</strong><span>Drag the machine or use the arrows. Nothing moves permanently until you save.</span></div>'
   +'<div class="move-editor-actions"><div class="nudge-grid" role="group" aria-label="Move selected machine one tile">'
   +'<button type="button" data-shift="-1,0" aria-label="Up left: one floor tile">↖</button>'
   +'<button type="button" data-shift="0,-1" aria-label="Up right: one floor tile">↗</button>'
   +'<button type="button" data-shift="0,1" aria-label="Down left: one floor tile">↙</button>'
   +'<button type="button" data-shift="1,0" aria-label="Down right: one floor tile">↘</button></div>'
   +'<div class="move-editor-right"><span id="movePosition">Position</span><div class="move-editor-confirm">'
   +'<button type="button" class="btn primary" id="saveMove">✓ Save position</button>'
   +'<button type="button" class="btn ghost" id="undoMove">Cancel</button></div></div></div>';
  toolbar.appendChild(movePanel);
  const saveMoveBtn=movePanel.querySelector('#saveMove');
  const undoMoveBtn=movePanel.querySelector('#undoMove');
  const movePosition=movePanel.querySelector('#movePosition');
  const inspector=document.createElement('dialog');
  inspector.className='machine-inspector';
  inspector.innerHTML='<div class="machine-inspector-head"><strong>STARTER VMC-760 · UNBRANDED</strong><button class="btn minor ghost" id="closeVmcPreview" type="button">✕ Close</button></div><img src="assets/starter-vmc.svg?v=21" alt="Original illustration of a fully enclosed vertical CNC milling center with front sliding doors, control panel and tower light"><p>Generic 3-axis enclosed VMC · 1 machine included at start · in-game additional machine RM180,000.</p>';
  document.body.appendChild(inspector);
  function showMachinePreview(type,m){
    const laser=type==='LASER',remaining=m?Math.max(0,365-(m.laserOperatingDays||0)):365;
    inspector.querySelector('.machine-inspector-head strong').textContent=laser?'FIBER LASER 3015 · UNBRANDED':'STARTER VMC-760 · UNBRANDED';
    inspector.querySelector('img').src=laser?'assets/laser-cutter.svg?v=23':'assets/starter-vmc.svg?v=21';
    inspector.querySelector('img').alt=laser?'Original open-bed fiber laser with slatted table, overhead bridge, cutting head and console':'Original enclosed vertical CNC milling machine';
    inspector.querySelector('p').textContent=laser
      ?'Original open-bed fiber laser · RM150,000 in-game · footprint 3 × 2 tiles · '+remaining+' operating days until major service'+(m?'.':' (new machine).')
      :'Generic 3-axis VMC · first machine included free · additional VMC RM180,000 in-game.';
    if(typeof inspector.showModal==='function')inspector.showModal();else inspector.setAttribute('open','');
  }
  inspectBtn.addEventListener('click',()=>{
    const m=state.machines.find(x=>x.id===chosenId);if(!m)return;
    showMachinePreview(m.type,m);
  });
  previewLaserBtn.addEventListener('click',()=>showMachinePreview('LASER',null));
  inspector.querySelector('#closeVmcPreview').addEventListener('click',()=>{if(typeof inspector.close==='function')inspector.close();else inspector.removeAttribute('open');});
  const originalSeed=seed;
  seed=function(){const fresh=originalSeed();fresh.machines[0].tileX=2;fresh.machines[0].tileY=1;fresh.machines[0].model='Starter VMC-760';fresh.layoutVersion=2;chosenId=1;moveMode=false;moveDraft=null;purchaseMode=null;selectedTile=null;return fresh;};
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
      ctx.drawImage(vmcSprite,center[0]-122,center[1]-184,244,220);
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
      ctx.drawImage(laserSprite,base[0]-169,base[1]-141,338,178);
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

  function workshopBackdrop(ctx,w,h){
    const wall=ctx.createLinearGradient(0,0,0,280);
    wall.addColorStop(0,'#142739');wall.addColorStop(.72,'#2b4152');wall.addColorStop(1,'#192d3c');
    ctx.fillStyle=wall;ctx.fillRect(0,0,w,280);
    // Original warehouse backdrop - structural columns, roll-up loading door and workshop lights.
    for(let k=0;k<8;k++){
      const x=k*127-18;
      ctx.fillStyle='#132334';ctx.fillRect(x,0,18,234);
      ctx.fillStyle='#54718788';ctx.fillRect(x+18,0,5,195);
      ctx.fillStyle='#112334';ctx.fillRect(x-8,198,31,32);
      ctx.fillStyle='#d5a24d';ctx.fillRect(x-7,201,29,5);
      for(let n=0;n<4;n++){
        ctx.strokeStyle='#122634';ctx.lineWidth=3;
        ctx.beginPath();ctx.moveTo(x-4+n*6,228);ctx.lineTo(x+9+n*6,199);ctx.stroke();
      }
    }
    const shutter=ctx.createLinearGradient(654,0,834,0);
    shutter.addColorStop(0,'#253746');shutter.addColorStop(.52,'#3b5361');shutter.addColorStop(1,'#1d3343');
    ctx.fillStyle=shutter;ctx.fillRect(656,48,173,150);
    for(let y=54;y<198;y+=10){
      ctx.strokeStyle=y%20?'#6e8a9699':'#182e3b';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(656,y);ctx.lineTo(830,y);ctx.stroke();
    }
    ctx.fillStyle='#122c3f';ctx.fillRect(645,45,9,155);ctx.fillRect(828,45,9,155);
    // storage shelves
    ctx.fillStyle='#101d2b';ctx.fillRect(47,105,135,115);
    for(let y=114;y<215;y+=44){
      ctx.fillStyle='#304b5b';ctx.fillRect(43,y,139,6);
      for(let i=0;i<4;i++){
        const x=52+i*31;
        ctx.fillStyle=(i+y)%2?'#76818a':'#9b835c';
        ctx.fillRect(x,y-23,24,21);
        ctx.fillStyle='#a2b2b633';ctx.fillRect(x+2,y-21,19,2);
      }
    }
    ctx.fillStyle='#071727';ctx.fillRect(37,97,7,126);ctx.fillRect(176,97,7,126);
    // overhead luminaires add legibility without heavy per-frame shadows
    const lights=[115,304,511,751];
    for(const x of lights){
      const gl=ctx.createRadialGradient(x,66,3,x,94,95);
      gl.addColorStop(0,'#ffe0a933');gl.addColorStop(1,'#ffe0a900');
      ctx.fillStyle=gl;ctx.fillRect(x-100,42,200,200);
      ctx.fillStyle='#ffe5ae';ctx.fillRect(x-28,51,57,6);
      ctx.fillStyle='#f1b66133';ctx.fillRect(x-40,47,82,13);
    }
    const apron=ctx.createLinearGradient(0,176,0,h);
    apron.addColorStop(0,'#314a5b');apron.addColorStop(1,'#122638');
    ctx.fillStyle=apron;ctx.fillRect(0,202,w,h-202);
    ctx.fillStyle='#e5b66c30';ctx.fillRect(0,205,w,2);
  }
  function workshopProps(ctx){
    // Safety zone on the floor perimeter; visual only, does not block machine placement.
    poly(ctx,[coord(.24,.24,14),coord(7.76,.24,14),coord(7.76,5.76,14),coord(.24,5.76,14)],null,'#bc8d45',3);
    poly(ctx,[coord(.33,.33,14),coord(7.67,.33,14),coord(7.67,5.67,14),coord(.33,5.67,14)],null,'#bd893944',1.5);
    // Tool chest beyond near-left tile corner.
    ctx.fillStyle='#03111d55';ctx.fillRect(32,342,170,12);
    const cab=ctx.createLinearGradient(23,244,23,336);cab.addColorStop(0,'#366481');cab.addColorStop(1,'#153c5c');
    ctx.fillStyle=cab;ctx.fillRect(32,260,152,77);
    ctx.fillStyle='#7591a3';ctx.fillRect(28,257,159,7);
    for(let i=0;i<3;i++){
      const y=270+i*20;
      ctx.fillStyle='#102d45';ctx.fillRect(43,y,130,16);
      ctx.fillStyle='#abc0c9';ctx.fillRect(93,y+4,27,3);
    }
    ctx.fillStyle='#233846';
    for(const x of [47,171]){ctx.fillRect(x,336,6,8);ctx.beginPath();ctx.arc(x+3,347,5,0,Math.PI*2);ctx.fill();}
    // Metal workbench and sample pieces at front right, original generic props.
    ctx.fillStyle='#111d28a6';ctx.fillRect(743,328,107,14);
    ctx.fillStyle='#506c7f';ctx.fillRect(754,285,83,49);
    ctx.fillStyle='#90a3ac';ctx.fillRect(745,281,102,9);
    ctx.fillStyle='#263b4b';ctx.fillRect(754,328,7,24);ctx.fillRect(832,328,7,24);
    for(let i=0;i<4;i++){
      const x=752+i*20;
      ctx.fillStyle=i%2?'#738f9d':'#a7b6b7';ctx.fillRect(x,268,17,13);
      ctx.fillStyle='#30434e';ctx.fillRect(x+3,266,12,3);
    }
  }
  function draw(){
    const ctx=canvas.getContext('2d');if(!ctx)return;
    const w=canvas.width,h=canvas.height;
    ctx.clearRect(0,0,w,h);
    workshopBackdrop(ctx,w,h);
    poly(ctx,[coord(0,0,4),coord(8,0,4),coord(8,6,4),coord(0,6,4)],'#1b2b39');
    side(ctx,0,6,8,0,0,13,'#1d2d3d');
    side(ctx,8,0,0,6,0,13,'#111c29');
    for(let y=0;y<6;y++)for(let x=0;x<8;x++){
      poly(ctx,[coord(x,y,13),coord(x+1,y,13),coord(x+1,y+1,13),coord(x,y+1,13)],(x+y)%2?'#364c59':'#324653','#425867');
    }
    workshopProps(ctx);
    // tile selection / move target
    if(selectedTile){
      const [x,y]=selectedTile;
      const okay=valid(x,y,moveMode?chosenId:null,purchaseMode);
      const size=footprint(purchaseMode||state.machines.find(m=>m.id===chosenId)?.type||'CNC');
      const accent=okay?'#55d9bb':'#f08b83';
      poly(ctx,[coord(x,y,14),coord(x+size.w,y,14),coord(x+size.w,y+size.h,14),coord(x,y+size.h,14)],okay?'#58daba26':'#f08b8333',accent,2.8);
    }
    // Day display moves to responsive HTML overlay in v0.3.
    const machines=state.machines.filter(m=>Number.isInteger(m.tileX)).slice().sort((a,b)=>(a.tileX+a.tileY)-(b.tileX+b.tileY));
    for(const m of machines){
      const preview=moveMode && m.id===chosenId && moveDraft ? {...m,tileX:moveDraft.x,tileY:moveDraft.y}:m;
      const previewOK=!moveMode||m.id!==chosenId||!moveDraft||valid(moveDraft.x,moveDraft.y,chosenId);
      if(moveMode && m.id===chosenId && moveDraft)ctx.globalAlpha=previewOK?.91:.53;
      if(m.type==='CNC')drawVmc(ctx,preview);else drawLaser(ctx,preview);
      ctx.globalAlpha=1;
      if(m.id===chosenId){
        const x=preview.tileX,y=preview.tileY,s=footprint(m.type);
        const chosenColor=moveMode?(previewOK?'#55ffbc':'#ff756d'):'#67f3ce';
        poly(ctx,[coord(x,y,15),coord(x+s.w,y,15),coord(x+s.w,y+s.h,15),coord(x,y+s.h,15)],moveMode?(previewOK?'#2ce7ab2a':'#ff6c6c2a'):null,chosenColor,3.4);
      }
    }
    // simple worker silhouette near first operating CNC, keeps machines unobscured
    for(let i=0;i<Math.min(state.workers,machines.length);i++){
      const m=machines[i],p=coord(Math.min(7.85,m.tileX+2.2),Math.min(5.8,m.tileY+1.7),21);
      ctx.fillStyle='#e9c5a0';ctx.beginPath();ctx.arc(p[0],p[1]-24,6,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#d39d57';ctx.fillRect(p[0]-6,p[1]-18,12,18);
      ctx.fillStyle='#202d38';ctx.fillRect(p[0]-4,p[1],3,12);ctx.fillRect(p[0]+2,p[1],3,12);
    }
    ctx.textAlign='left';ctx.font='12px system-ui';ctx.fillStyle='#a8bbca';ctx.fillText('ORIGINAL INDUSTRIAL WORKSHOP • v0.3.1',18,h-20);
    ctx.textAlign='right';ctx.fillText('MACHINES '+state.machines.length+' • TAP TO SELECT',w-18,h-20);
  }
  function syncTools(){
    const m=state.machines.find(v=>v.id===chosenId);
    moveBtn.disabled=!m;
    inspectBtn.disabled=!m;
    moveBtn.classList.toggle('selected',moveMode);
    cancelBtn.disabled=!(purchaseMode||moveMode);
    movePanel.hidden=!moveMode;
    canvas.style.touchAction=moveMode?'none':'manipulation';
    if(moveMode&&moveDraft&&m){
      const ok=valid(moveDraft.x,moveDraft.y,chosenId);
      saveMoveBtn.disabled=!ok;
      movePosition.textContent='Tile '+(moveDraft.x+1)+','+(moveDraft.y+1)+(ok?' · Available':' · Blocked / outside floor');
      movePosition.classList.toggle('invalid',!ok);
    }
    if(purchaseMode)info.textContent='PURCHASE MODE: Tap a free '+(purchaseMode==='LASER'?'3 × 2':'2 × 2')+' tile area to place your '+(purchaseMode==='CNC'?'VMC':'laser cutter')+'. In-game cash is charged only on placement.';
    else if(moveMode)info.textContent='MOVE MODE: Drag the machine, tap a free tile, or use the arrows. Choose Save position when satisfied.';
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
    purchaseMode=type;moveMode=false;moveDraft=null;chosenId=null;selectedTile=null;currentTab='machines';render();
    toast('Tap an empty space on the factory floor to place your equipment');
    canvas.scrollIntoView({behavior:'smooth',block:'center'});
  };

  function pointerPoint(e){
    const rect=canvas.getBoundingClientRect();
    return {x:(e.clientX-rect.left)*canvas.width/rect.width,y:(e.clientY-rect.top)*canvas.height/rect.height};
  }
  function floorTile(point){
    const dx=(point.x-floor.ox)/floor.sx,dy=(point.y-floor.oy+floor.z)/floor.sy;
    return {x:Math.floor((dx+dy)/2),y:Math.floor((dy-dx)/2)};
  }
  function spriteHit(point){
    // Allow selecting the machine by tapping its actual drawing, not only the tile underneath.
    return state.machines.slice().reverse().find(m=>{
      if(!Number.isInteger(m.tileX))return false;
      const size=footprint(m.type);
      const tile=moveMode&&m.id===chosenId&&moveDraft?moveDraft:{x:m.tileX,y:m.tileY};
      const p=coord(tile.x+size.w/2,tile.y+size.h/2,floor.z);
      const w=m.type==='LASER'?338:244,h=m.type==='LASER'?178:220;
      const top=p[1]-(m.type==='LASER'?141:184);
      // Slightly shrink the bounding box to avoid capturing the entire surrounding floor.
      return point.x>=p[0]-w*.37&&point.x<=p[0]+w*.37
        &&point.y>=top+h*.12&&point.y<=top+h*.94;
    });
  }
  function beginMove(){
    const m=state.machines.find(v=>v.id===chosenId);
    if(!m){toast('Select a machine first');return;}
    purchaseMode=null;moveMode=true;moveDraft={x:m.tileX,y:m.tileY};selectedTile=null;
    render();
  }
  function finishMove(commit){
    const m=state.machines.find(v=>v.id===chosenId);
    if(commit&&m&&moveDraft){
      if(!valid(moveDraft.x,moveDraft.y,chosenId)){toast('Placement blocked. Pick another spot.');return;}
      const moved=moveDraft.x!==m.tileX||moveDraft.y!==m.tileY;
      if(moved){
        m.tileX=moveDraft.x;m.tileY=moveDraft.y;
        log('Repositioned '+(m.model||m.type)+' to tile '+(m.tileX+1)+','+(m.tileY+1));
      }
      moveMode=false;moveDraft=null;selectedTile=null;
      if(moved){update();toast('Machine position saved');}else{render();toast('Position unchanged');}
      return;
    }
    moveMode=false;moveDraft=null;pointerDrag=null;selectedTile=null;
    render();
    if(!commit)toast('Move cancelled — original position kept');
  }
  function setDraft(x,y){
    moveDraft={x,y};
    draw();
    syncTools();
  }
  function tap(e){
    if(ignoreClickOnce){ignoreClickOnce=false;return;}
    const point=pointerPoint(e);
    if(purchaseMode){
      const tile=floorTile(point),x=tile.x,y=tile.y;
      if(!valid(x,y,null,purchaseMode)){
        selectedTile=[x,y];draw();toast('Not enough clear floor space');return;
      }
      const type=purchaseMode,price=pricing[type];
      if(state.cash<price){purchaseMode=null;toast('Insufficient cash');render();return;}
      state.cash-=price;state.totalCapex+=price;
      const m={id:state.nextId++,type,condition:100,tileX:x,tileY:y,model:type==='CNC'?'Starter VMC-760':'Fiber Laser 3015'};
      if(type==='LASER'){m.laserOperatingDays=0;m.laserServiceWarningIssued=false;}
      state.machines.push(m);chosenId=m.id;purchaseMode=null;selectedTile=null;
      log('Purchased and installed '+m.model+' for '+F(price));
      toast('Machine installed — hire an operator to run it');update();return;
    }
    if(moveMode){
      const tile=floorTile(point);
      const hit=spriteHit(point);
      if(hit&&hit.id===chosenId){return;} // avoid jumping when tapping the actual machine
      setDraft(tile.x,tile.y);
      return;
    }
    const hit=spriteHit(point);
    const tile=floorTile(point);
    const floorHit=state.machines.slice().reverse().find(m=>{
      const z=footprint(m.type);
      return tile.x>=m.tileX&&tile.x<m.tileX+z.w&&tile.y>=m.tileY&&tile.y<m.tileY+z.h;
    });
    const picked=hit||floorHit;
    chosenId=picked?picked.id:null;
    selectedTile=null;
    render();
  }
  canvas.addEventListener('click',tap);
  canvas.addEventListener('pointerdown',e=>{
    if(!moveMode||!moveDraft||!('pointerId' in e))return;
    const m=spriteHit(pointerPoint(e));
    if(!m||m.id!==chosenId)return;
    pointerDrag={id:e.pointerId,start:pointerPoint(e),tile:{...moveDraft},moved:false};
    canvas.setPointerCapture?.(e.pointerId);
  });
  canvas.addEventListener('pointermove',e=>{
    if(!pointerDrag||e.pointerId!==pointerDrag.id)return;
    const pt=pointerPoint(e);
    const px=pt.x-pointerDrag.start.x,py=pt.y-pointerDrag.start.y;
    if(Math.hypot(px,py)<6&&!pointerDrag.moved)return;
    pointerDrag.moved=true;
    const fx=px/floor.sx,fy=py/floor.sy;
    const stepX=Math.round((fx+fy)/2),stepY=Math.round((fy-fx)/2);
    if(e.cancelable)e.preventDefault();
    setDraft(pointerDrag.tile.x+stepX,pointerDrag.tile.y+stepY);
  });
  function releaseDrag(e){
    if(!pointerDrag||e.pointerId!==pointerDrag.id)return;
    if(pointerDrag.moved){
      ignoreClickOnce=true;
      // Swallow the synthesized click on mobile after a completed drag.
    }
    pointerDrag=null;
    try{canvas.releasePointerCapture?.(e.pointerId);}catch(_){}
  }
  canvas.addEventListener('pointerup',releaseDrag);
  canvas.addEventListener('pointercancel',e=>{
    if(pointerDrag&&e.pointerId===pointerDrag.id){
      setDraft(pointerDrag.tile.x,pointerDrag.tile.y);
      releaseDrag(e);
    }
  });
  movePanel.querySelectorAll('[data-shift]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      if(!moveMode||!moveDraft)return;
      const [dx,dy]=btn.dataset.shift.split(',').map(Number);
      const x=moveDraft.x+dx,y=moveDraft.y+dy;
      if(!valid(x,y,chosenId)){toast('That tile is blocked or outside the workshop');return;}
      setDraft(x,y);
    });
  });
  moveBtn.addEventListener('click',beginMove);
  saveMoveBtn.addEventListener('click',()=>finishMove(true));
  undoMoveBtn.addEventListener('click',()=>finishMove(false));
  cancelBtn.addEventListener('click',()=>{
    if(moveMode)finishMove(false);
    else{purchaseMode=null;selectedTile=null;render();}
  });
  const help=document.getElementById('helpBtn');
  help.onclick=()=>alert('FACTORY EMPIRE v0.3.1\n\nTap a machine in the factory to inspect it.\nTap MOVE SELECTED, then drag the machine or use the arrow buttons. Tap Save position to commit, Cancel to undo.\nTo buy equipment, open Equipment and tap Place VMC / Place laser, then tap an empty area. In-game money is charged ONLY when placed.\n\nThe starter workshop includes ONE free VMC, and moving it is free.\nThe fiber laser costs RM150,000 in-game and receives major service after 365 operating days.\n\nAdvance days to run production; accept RFQs from New RFQs.\n\nThis is an early 2D browser game; no real money, advertising, or payments are implemented.');
  ensureLayout();
  render();
})();
