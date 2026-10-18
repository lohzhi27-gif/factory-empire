(function v02factory(){
  'use strict';
  const floor={w:8,h:6,ox:430,oy:92,sx:47,sy:22,z:13,footprint:2};
  const pricing={CNC:180000,LASER:150000};
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
  inspectBtn.addEventListener('click',()=>{if(typeof inspector.showModal==='function')inspector.showModal();else inspector.setAttribute('open','');});
  inspector.querySelector('#closeVmcPreview').addEventListener('click',()=>{if(typeof inspector.close==='function')inspector.close();else inspector.removeAttribute('open');});
  const originalSeed=seed;
  seed=function(){const fresh=originalSeed();fresh.machines[0].tileX=2;fresh.machines[0].tileY=1;fresh.machines[0].model='Starter VMC-760';fresh.layoutVersion=2;chosenId=1;moveMode=false;purchaseMode=null;selectedTile=null;return fresh;};
  function occupied(x,y,ignore){
    return state.machines.some(m=>m.id!==ignore && Number.isInteger(m.tileX) && Number.isInteger(m.tileY) && x<m.tileX+2 && x+2>m.tileX && y<m.tileY+2 && y+2>m.tileY);
  }
  function valid(x,y,ignore){return Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&y>=0&&x+2<=floor.w&&y+2<=floor.h&&!occupied(x,y,ignore);}
  function ensureLayout(){
    let changed=false;
    const legacy=[[2,1],[4,1],[2,3],[5,3],[6,4],[0,3]];
    const allocated=[];
    for(let i=0;i<state.machines.length;i++){
      const m=state.machines[i];
      const collide=(x,y)=>allocated.some(p=>x<p[0]+2&&x+2>p[0]&&y<p[1]+2&&y+2>p[1]);
      const okay=(x,y)=>Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&y>=0&&x+2<=floor.w&&y+2<=floor.h&&!collide(x,y);
      let xy=[m.tileX,m.tileY];
      if(!okay(...xy)){
        xy=legacy[i]||[-1,-1];
        if(!okay(...xy)){
          outer:for(let y=0;y<floor.h-1;y++)for(let x=0;x<floor.w-1;x++){if(okay(x,y)){xy=[x,y];break outer;}}
        }
        if(okay(...xy)){m.tileX=xy[0];m.tileY=xy[1];changed=true;}
      }
      if(okay(m.tileX,m.tileY))allocated.push([m.tileX,m.tileY]);
      if(m.type==='CNC'&&!m.model){m.model='Starter VMC-760';changed=true;}
    }
    if(state.layoutVersion!==2){state.layoutVersion=2;changed=true;}
    if(changed)save();
    if(chosenId===null && state.machines.length)chosenId=state.machines[0].id;
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
  function drawLaser(ctx,m){
    const x=m.tileX+.11,y=m.tileY+.1;
    body(ctx,x,y,1.95,1.82,13,28,'#313f4b','#1e3340','#4b626e');
    body(ctx,x+.03,y+.06,1.89,1.73,28,70,'#d3bd92','#88816d','#eee2be');
    poly(ctx,[coord(x+.18,y+1.81,35),coord(x+1.43,y+1.81,35),coord(x+1.43,y+1.81,61),coord(x+.18,y+1.81,61)],'#263c46','#9db0a4');
    const lbl=coord(x+1,y+1,99);ctx.fillStyle='#f0dfb8';ctx.textAlign='center';ctx.font='bold 12px system-ui';ctx.fillText('LASER #'+m.id,lbl[0],lbl[1]);
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
      const okay=valid(x,y,moveMode?chosenId:null);
      const accent=okay?'#55d9bb':'#f08b83';
      poly(ctx,[coord(x,y,14),coord(x+2,y,14),coord(x+2,y+2,14),coord(x,y+2,14)],okay?'#58daba26':'#f08b8333',accent,2.8);
    }
    ctx.fillStyle='#1b2531';ctx.fillRect(25,24,180,52);
    ctx.textAlign='left';ctx.fillStyle='#b6d7e5';ctx.font='bold 11px system-ui';ctx.fillText('YOUR FIRST WORKSHOP',37,43);
    ctx.font='bold 19px system-ui';ctx.fillStyle='#fff';ctx.fillText('DAY '+state.day,37,67);
    const machines=state.machines.filter(m=>Number.isInteger(m.tileX)).slice().sort((a,b)=>(a.tileX+a.tileY)-(b.tileX+b.tileY));
    for(const m of machines){
      if(m.type==='CNC')drawVmc(ctx,m);else drawLaser(ctx,m);
      if(m.id===chosenId){
        const x=m.tileX,y=m.tileY;
        poly(ctx,[coord(x,y,15),coord(x+2,y,15),coord(x+2,y+2,15),coord(x,y+2,15)],null,'#67f3ce',3);
      }
    }
    // simple worker silhouette near first operating CNC, keeps machines unobscured
    for(let i=0;i<Math.min(state.workers,machines.length);i++){
      const m=machines[i],p=coord(Math.min(7.85,m.tileX+2.2),Math.min(5.8,m.tileY+1.7),21);
      ctx.fillStyle='#e9c5a0';ctx.beginPath();ctx.arc(p[0],p[1]-24,6,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#d39d57';ctx.fillRect(p[0]-6,p[1]-18,12,18);
      ctx.fillStyle='#202d38';ctx.fillRect(p[0]-4,p[1],3,12);ctx.fillRect(p[0]+2,p[1],3,12);
    }
    ctx.textAlign='left';ctx.font='12px system-ui';ctx.fillStyle='#a8bbca';ctx.fillText('ORIGINAL INDUSTRIAL WORKSHOP • v0.2',18,h-20);
    ctx.textAlign='right';ctx.fillText('MACHINES '+state.machines.length+' • TAP TO SELECT',w-18,h-20);
  }
  function syncTools(){
    const m=state.machines.find(v=>v.id===chosenId);
    moveBtn.disabled=!m;
    inspectBtn.disabled=!m || m.type!=='CNC';
    moveBtn.classList.toggle('selected',moveMode);
    cancelBtn.disabled=!(purchaseMode||moveMode);
    if(purchaseMode)info.textContent='PURCHASE MODE: Tap a free 2 × 2 floor area to place your '+(purchaseMode==='CNC'?'VMC':'laser cutter')+'. No cash is deducted until placed.';
    else if(moveMode)info.textContent='MOVE MODE: Tap a free 2 × 2 floor area to relocate '+(m?.model||'machine #'+chosenId)+'. Tap Cancel to stop.';
    else if(m)info.textContent='Selected: '+(m.model||m.type+' #'+m.id)+' · Condition '+Math.round(m.condition)+'%. Tap Move selected, then tap a free area.';
    else info.textContent='Tap a machine to inspect it. Choose Equipment to buy another machine.';
  }
  const oldRender=render;
  render=function(){ensureLayout();oldRender();syncTools();};
  drawFactory=draw;
  renderMachines=function(){
    document.getElementById('machineList').innerHTML=state.machines.map(m=>'<div class="machine"><div class="left"><div class="iconbox">'+(m.type==='CNC'?'🏭':'✂')+'</div><div><strong>'+(m.model||'Laser Cutter')+' #'+m.id+'</strong><div class="sub">Floor '+(m.tileX+1)+','+(m.tileY+1)+' · Condition '+Math.round(m.condition)+'%</div></div></div><div class="right"><button class="btn minor ghost" data-maintain="'+m.id+'" '+(m.condition>=99?'disabled':'')+'>Repair RM850</button></div></div>').join('');
    document.querySelectorAll('[data-buy]').forEach(b=>{
      const type=b.dataset.buy;
      const card=b.closest('.buycard'),price=pricing[type];
      const costEl=card.querySelector('.cost');
      if(costEl)costEl.textContent=F(price);
      const descEl=card.querySelector('.desc');
      if(descEl)descEl.textContent=type==='CNC'?'Original unbranded Starter VMC-760 · select a floor location after purchase.':'Laser cutter (prototype) · select a floor location after purchase.';
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
      if(!valid(x,y,moveMode?chosenId:null)){selectedTile=[x,y];draw();toast('That area is blocked or too close to the workshop edge');return;}
      if(moveMode){
        const m=state.machines.find(v=>v.id===chosenId);if(!m){moveMode=false;render();return;}
        m.tileX=x;m.tileY=y;moveMode=false;selectedTile=null;log('Relocated '+(m.model||'machine')+' to floor '+(x+1)+','+(y+1));toast('Machine moved — layout saved');update();return;
      }
      const type=purchaseMode,price=pricing[type];if(state.cash<price){purchaseMode=null;toast('Insufficient cash');render();return;}
      state.cash-=price;state.totalCapex+=price;
      const m={id:state.nextId++,type,condition:100,tileX:x,tileY:y,model:type==='CNC'?'Starter VMC-760':'Prototype Laser Cutter'};
      state.machines.push(m);chosenId=m.id;purchaseMode=null;selectedTile=null;
      log('Purchased and installed '+m.model+' for '+F(price));toast('Machine installed! Hire an operator to increase capacity');update();return;
    }
    const hit=state.machines.slice().reverse().find(m=>x>=m.tileX&&x<m.tileX+2&&y>=m.tileY&&y<m.tileY+2);
    chosenId=hit?hit.id:null;selectedTile=hit?null:[Math.min(x,6),Math.min(y,4)];
    render();
  }
  canvas.addEventListener('click',tap);
  moveBtn.addEventListener('click',()=>{if(!state.machines.some(m=>m.id===chosenId))return;moveMode=true;purchaseMode=null;selectedTile=null;render();toast('Tap a free area for your selected machine');});
  cancelBtn.addEventListener('click',()=>{moveMode=false;purchaseMode=null;selectedTile=null;render();});
  const help=document.getElementById('helpBtn');
  help.onclick=()=>alert('FACTORY EMPIRE v0.2\n\nTap a machine in the factory to inspect it.\nTap MOVE SELECTED, then tap a free 2 × 2 section to reposition it.\nTo buy equipment, open Equipment and tap Place VMC / Place laser, then tap an empty area. In-game money is charged ONLY when placed.\n\nThe starter workshop includes ONE free VMC, and moving it is free.\n\nAdvance days to run production; accept RFQs from New RFQs.\n\nThis is an early 2D browser game; no real money, advertising, or payments are implemented.');
  ensureLayout();
  render();
})();
