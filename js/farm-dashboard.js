/* ============================================================
   MODULE: NPC
   ============================================================ */
const NPC_CHARS = {
  mayor: {emoji:'🧑‍🌾', name:'MAYOR BEN', color:'#FFD966'},
  witch:  {emoji:'🧙‍♀️', name:'ELDER WITCH', color:'#AA44FF'},
  trader: {emoji:'🧓',  name:'OLD TRADER', color:'#F5C518'},
  scientist:{emoji:'👩‍🔬',name:'DR. LEAF',   color:'#5B9BD5'},
};

const NPC_MESSAGES = {
  idle:[
    {char:'mayor',  text:"Howdy! Your farm's lookin' mighty fine today. Keep up the good work, partner!"},
    {char:'scientist',text:"Monitoring complete. All systems nominal. Your Lettuce yield estimate is on track."},
    {char:'trader', text:"Heard you got some Basil ready for harvest? I'll pay top coin for it!"},
  ],
  danger:[
    {char:'witch',  text:"⚠️ Danger! Tomato D1 is burning up at {val}! If we don't act NOW, it's toast!"},
    {char:'mayor',  text:"Hold on — Tomato D1 needs cooling FAST. Activate the fan before it's too late!"},
  ],
  warning:[
    {char:'scientist',text:"💧 Spinach B2 soil moisture at critical low — {val}. Initiating water pump recommended."},
    {char:'trader', text:"Your Spinach looks a bit thirsty, friend. Give it some water and she'll perk right up!"},
  ],
  ready:[
    {char:'mayor',  text:"✨ Basil C3 is ready for harvest! Pick it now for maximum flavor and profit!"},
    {char:'trader', text:"That Basil is prime quality! Harvest today and I'll give you 20% bonus at market!"},
  ],
};

const NPC = {
  queue: [],
  currentIdx: 0,
  init(){ this._loadContext(); },

  _loadContext(){
    const dangerTiles = STATE.tiles.filter(t=>t.status==='danger');
    const warnTiles   = STATE.tiles.filter(t=>t.status==='warning');
    const readyTiles  = STATE.tiles.filter(t=>t.status==='ready');
    let pool = [];
    if(dangerTiles.length) pool = NPC_MESSAGES.danger;
    else if(readyTiles.length) pool = NPC_MESSAGES.ready;
    else if(warnTiles.length) pool = NPC_MESSAGES.warning;
    else pool = NPC_MESSAGES.idle;

    this.queue = pool;
    this.currentIdx = 0;
    this._render();
  },

  _render(){
    const msg = this.queue[this.currentIdx];
    if(!msg) return;
    const char = NPC_CHARS[msg.char];
    document.getElementById('npcPortrait').textContent = char.emoji;
    document.getElementById('npcPortrait').style.background = char.color+'33';
    document.getElementById('npcName').textContent = char.name;
    document.getElementById('npcName').style.color = char.color;

    let text = msg.text;
    if(text.includes('{val}')){
      const dangerSensor = STATE.sensors.temp;
      text = text.replace('{val}', dangerSensor.val + dangerSensor.unit);
    }
    this._typeText(text);
  },

  _typeText(text){
    const el = document.getElementById('npcText');
    el.innerHTML = '';
    let i = 0;
    const cursor = '<span class="npc-dialog-cursor"></span>';
    const interval = setInterval(()=>{
      if(i >= text.length){ el.innerHTML = text + cursor; clearInterval(interval); return; }
      el.innerHTML = text.slice(0,i+1) + cursor;
      i++;
    }, 25);
  },

  next(){
    this.currentIdx = (this.currentIdx + 1) % this.queue.length;
    this._render();
  },

  dismiss(){
    const wrap = document.getElementById('npcDialog');
    wrap.style.opacity = '0.4';
    setTimeout(()=>{ wrap.style.opacity='1'; this._loadContext(); }, 3000);
  },

  triggerPlantAction(tileName, action){
    const actionMsgs = {
      water:   {char:'scientist', text:`💧 Water pump activated for ${tileName}! Moisture levels rising. Cost: RM 0.20`},
      harvest: {char:'trader',    text:`✨ ${tileName} harvested! 340g • Market value: RM 28.50. Nice work!`},
      cool:    {char:'witch',     text:`🌀 Cooling fan ON! Temperature dropping from 34.2°C to 28°C. Crisis averted!`},
    };
    const msg = actionMsgs[action] || {char:'mayor', text:`Action performed on ${tileName}.`};
    this.queue = [msg];
    this.currentIdx = 0;
    this._render();
  },
};

/* ============================================================
   MODULE: FARM CANVAS
   PLACEHOLDER: Dashboard (3D & gamified) (JIAHUI)
   ============================================================ */
const FarmCanvas = {
  canvas: null, ctx: null,
  W: 0, H: 0, tileW: 64, tileH: 32,
  cols: 4, rows: 3, animFrame: 0,

  init(){
    this.canvas = document.getElementById('farmCanvas');
    this.resize();
    window.addEventListener('resize', ()=>this.resize());
    this.canvas.addEventListener('click', (e)=>this.handleClick(e));
    this.animate();
  },

  resize(){
    const wrap = this.canvas.parentElement;
    this.W = wrap.clientWidth;
    this.H = wrap.clientHeight || 280;
    this.canvas.width = this.W;
    this.canvas.height = this.H;
    this.draw();
  },

  toIso(col, row){
    const offX = this.W / 2;
    const offY = this.H * 0.55;
    const x = (col - row) * this.tileW + offX;
    const y = (col + row) * this.tileH * 0.5 + offY - (this.rows * this.tileH * 0.5);
    return {x, y};
  },

  drawTile(col, row, tile){
    const ctx = this.ctx;
    const {x, y} = this.toIso(col, row);
    const w = this.tileW, h = this.tileH;
    const colors = {
      empty:   {top:'#6B4226', left:'#4A2C10', right:'#5C3A1E', stroke:'#3D2010'},
      healthy: {top:'#5C7A3E', left:'#3A5228', right:'#4A6030', stroke:'#2A4020'},
      warning: {top:'#7A6B3E', left:'#5C4A28', right:'#6B5C30', stroke:'#4A3A18'},
      danger:  {top:'#7A3E3E', left:'#5C2828', right:'#6B3030', stroke:'#4A1818'},
      ready:   {top:'#4A7A3E', left:'#2C5228', right:'#3A6030', stroke:'#1A3A18'},
    };
    const c = colors[tile.status] || colors.empty;

    // Top
    ctx.beginPath();
    ctx.moveTo(x, y - h/2); ctx.lineTo(x+w/2, y); ctx.lineTo(x, y + h/2); ctx.lineTo(x-w/2, y);
    ctx.closePath();
    ctx.fillStyle = c.top; ctx.fill(); ctx.strokeStyle = c.stroke; ctx.lineWidth=1; ctx.stroke();

    // Left
    const depth = 8;
    ctx.beginPath();
    ctx.moveTo(x-w/2, y); ctx.lineTo(x, y+h/2); ctx.lineTo(x, y+h/2+depth); ctx.lineTo(x-w/2, y+depth);
    ctx.closePath(); ctx.fillStyle = c.left; ctx.fill(); ctx.stroke();

    // Right
    ctx.beginPath();
    ctx.moveTo(x+w/2, y); ctx.lineTo(x, y+h/2); ctx.lineTo(x, y+h/2+depth); ctx.lineTo(x+w/2, y+depth);
    ctx.closePath(); ctx.fillStyle = c.right; ctx.fill(); ctx.stroke();

    // Glow
    if(tile.status === 'ready'){
      const pulse = Math.sin(this.animFrame * 0.05) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.moveTo(x, y-h/2); ctx.lineTo(x+w/2,y); ctx.lineTo(x,y+h/2); ctx.lineTo(x-w/2,y);
      ctx.closePath();
      ctx.strokeStyle = `rgba(255,217,102,${pulse})`; ctx.lineWidth=2; ctx.stroke();
    }

    // Emoji
    if(tile.plant){
      const bob = Math.sin(this.animFrame * 0.04 + col * 0.8 + row * 1.2) * 2;
      ctx.font = '28px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.globalAlpha = 0.4; ctx.fillStyle = '#000'; ctx.fillText(tile.plant, x+2, y - h/2 - 6 + bob + 6);
      ctx.globalAlpha = 1; ctx.fillText(tile.plant, x, y - h/2 - 6 + bob);
    }

    // Danger particle
    if(tile.status === 'danger'){
      const p = Math.sin(this.animFrame * 0.1) * 0.5 + 0.5;
      ctx.font = '16px serif';
      ctx.globalAlpha = p;
      ctx.fillText('🌡️', x + 16, y - h/2 - 16 + (-p*8));
      ctx.globalAlpha = 1;
    }
  },

  drawNPC(){
    const ctx = this.ctx;
    const npcTile = this.toIso(1, 1);
    const bob = Math.sin(this.animFrame * 0.06) * 2;
    ctx.font = '32px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.globalAlpha = 0.3; ctx.fillStyle = '#000'; ctx.fillText('🧑‍🌾', npcTile.x+3, npcTile.y - this.tileH/2 - 12 + bob + 6);
    ctx.globalAlpha = 1; ctx.fillText('🧑‍🌾', npcTile.x, npcTile.y - this.tileH/2 - 16 + bob);
  },

  drawScene(){
    const ctx = this.ctx;
    const grad = ctx.createLinearGradient(0,0,0,this.H*0.55);
    grad.addColorStop(0,'#0d1f35'); grad.addColorStop(0.5,'#1a3a5c'); grad.addColorStop(1,'#3a6a9a');
    ctx.fillStyle = grad; ctx.fillRect(0,0,this.W,this.H);

    const sunX = this.W * 0.8, sunY = this.H * 0.15;
    const sunPulse = Math.sin(this.animFrame * 0.02) * 2;
    ctx.shadowColor = '#FFD966'; ctx.shadowBlur = 24 + sunPulse;
    ctx.fillStyle = '#FFD966';
    ctx.beginPath(); ctx.arc(sunX, sunY, 18 + sunPulse, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(255,217,102,0.3)';
    for(let r=0;r<6;r++){
      const angle = (r/6)*Math.PI*2 + this.animFrame*0.005;
      const rx = sunX + Math.cos(angle)*(26+sunPulse);
      const ry = sunY + Math.sin(angle)*(26+sunPulse);
      ctx.fillRect(rx-3, ry-3, 10, 6);
    }

    const groundY = this.H * 0.55;
    ctx.fillStyle = '#3D8C3D'; ctx.fillRect(0, groundY, this.W, this.H);
    ctx.fillStyle = '#2A5C2A'; ctx.fillRect(0, groundY, this.W, 10);
    ctx.fillStyle = '#6B4226'; ctx.fillRect(0, this.H*0.75, this.W, this.H);
    ctx.fillStyle = '#4A2C10'; ctx.fillRect(0, this.H*0.75, this.W, 8);
  },

  draw(){
    if(!this.ctx) return;
    this.ctx.clearRect(0,0,this.W,this.H);
    this.drawScene();
    for(let row=0; row < this.rows; row++){
      for(let col=0; col < this.cols; col++){
        const tileIdx = row * this.cols + col;
        const tile = STATE.tiles[tileIdx] || {status:'empty', plant:null};
        this.drawTile(col, row, tile);
      }
    }
    this.drawNPC();
  },

  animate(){
    this.ctx = this.canvas.getContext('2d');
    const loop = ()=>{ this.animFrame++; this.draw(); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  },

  handleClick(e){
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    for(let row=0; row<this.rows; row++){
      for(let col=0; col<this.cols; col++){
        const {x,y} = this.toIso(col,row);
        const w = this.tileW/2, h = this.tileH/2;
        if((Math.abs(mx-x)/w + Math.abs(my-y)/h) < 1.1){
          const tile = STATE.tiles[row*this.cols+col];
          if(tile) Farm.onTileClick(tile);
          return;
        }
      }
    }
  },
};

/* ============================================================
   MODULE: DASHBOARD SENSORS
   ============================================================ */
const Dashboard = {
  init(){ this.render(); },
  render(){
    const strip = document.getElementById('dashStrip');
    if(!strip) return;
    const sensors = [
      {icon:'🌡️', key:'temp',     label:'TEMP'},
      {icon:'💧', key:'humid',    label:'HUMID'},
      {icon:'☀️', key:'light',    label:'LIGHT'},
      {icon:'🧪', key:'ph',       label:'pH'},
      {icon:'🪣', key:'water',    label:'WATER'},
      {icon:'🧬', key:'nutrient', label:'NUTRI'},
    ];
    strip.innerHTML = sensors.map(s=>{
      const sensor = STATE.sensors[s.key];
      const cls = sensor.status === 'ok' ? 'ok' : sensor.status === 'warning' ? 'warn' : 'bad';
      return `<div class="dash-metric"><span class="dash-metric-icon">${s.icon}</span>
              <span class="dash-metric-val ${cls}">${sensor.val}${sensor.unit}</span>
              <span class="dash-metric-lbl">${s.label}</span></div>`;
    }).join('');

    const pills = document.getElementById('topbar-pills');
    if(pills){
        const hasDanger  = Object.values(STATE.sensors).some(s=>s.status==='danger');
        const hasWarning = Object.values(STATE.sensors).some(s=>s.status==='warning');
        if(hasDanger)      pills.innerHTML = '<div class="pill pill-bad">⚠ CRITICAL</div>';
        else if(hasWarning) pills.innerHTML = '<div class="pill pill-warn">! WARNING</div>';
        else                pills.innerHTML = '<div class="pill pill-ok">ALL OK</div>';
    }
  },
  update(key, val, status){
    STATE.sensors[key].val = val; STATE.sensors[key].status = status; this.render();
  },
};

/* ============================================================
   MODULE: FARM (Add Plant)
   ============================================================ */
const CROP_OPTIONS = [
  {emoji:'🥬', name:'Lettuce',  days:7,  price:'RM 1.20', seedCost:'RM 0.50'},
  {emoji:'🌿', name:'Spinach',  days:12, price:'RM 0.90', seedCost:'RM 0.30'},
  {emoji:'🌱', name:'Basil',    days:10, price:'RM 2.50', seedCost:'RM 0.80'},
  {emoji:'🍅', name:'Tomato',   days:20, price:'RM 3.00', seedCost:'RM 1.00'},
  {emoji:'🌿', name:'Mint',     days:9,  price:'RM 1.50', seedCost:'RM 0.40'},
  {emoji:'🌶️', name:'Chili',    days:18, price:'RM 2.00', seedCost:'RM 0.70'},
  {emoji:'🥦', name:'Broccoli', days:25, price:'RM 2.80', seedCost:'RM 1.20'},
  {emoji:'🧅', name:'Onion',    days:15, price:'RM 1.00', seedCost:'RM 0.35'},
  {emoji:'🫑', name:'Pepper',   days:22, price:'RM 2.20', seedCost:'RM 0.90'},
];
const Farm = {
  init(){ this._renderPlantSelect(); },
  _renderPlantSelect(){
    const grid = document.getElementById('plantSelectGrid');
    if(!grid) return;
    grid.innerHTML = CROP_OPTIONS.map((c,i)=>`
      <div class="plant-option" id="cropOpt${i}" onclick="Farm.selectCrop(${i})">
        <span class="plant-option-emoji">${c.emoji}</span>
        <div class="plant-option-name">${c.name}</div>
        <div class="plant-option-days">${c.days}d grow</div>
        <div class="plant-option-price">${c.seedCost}</div>
      </div>
    `).join('');
    this._renderTilePicker();
  },
  _renderTilePicker(){
    const grid = document.getElementById('tilePickerGrid');
    if(!grid) return;
    grid.innerHTML = STATE.tiles.map(t=>{
      if(t.status !== 'empty') return `<div class="tile-pick occupied">${t.plant||'✗'}</div>`;
      return `<div class="tile-pick" id="tileOpt${t.id}" onclick="Farm.selectTile(${t.id})">◻</div>`;
    }).join('');
  },
  selectCrop(i){
    STATE.addPlant.selectedCropIndex = i;
    document.querySelectorAll('.plant-option').forEach(el=>el.classList.remove('selected'));
    document.getElementById('cropOpt'+i)?.classList.add('selected');
  },
  selectTile(id){
    STATE.addPlant.selectedTileId = id;
    document.querySelectorAll('.tile-pick').forEach(el=>el.classList.remove('pick-selected'));
    document.getElementById('tileOpt'+id)?.classList.add('pick-selected');
  },
  confirmAddPlant(){
    const {selectedCropIndex: ci, selectedTileId: ti} = STATE.addPlant;
    if(ci === null){ UI.showToast('warning','⚠ Select a crop first!'); return; }
    if(ti === null){ UI.showToast('warning','⚠ Select an empty tile!'); return; }
    const crop = CROP_OPTIONS[ci], tile = STATE.tiles[ti];
    tile.plant = crop.emoji; tile.name = crop.name; tile.status = 'healthy';
    STATE.addPlant = {selectedCropIndex:null, selectedTileId:null};
    UI.closeAddPlant(); Dashboard.render(); NPC.triggerPlantAction(crop.name, 'planted'); Farm._renderTilePicker();
    UI.showToast('success', `🌱 ${crop.emoji} ${crop.name} planted!`);
  },
  onTileClick(tile){
    if(tile.status === 'empty'){ UI.openAddPlant(); return; }
    const msg = { healthy: `healthy`, warning: `warning`, danger: `danger`, ready: `ready` }[tile.status] || 'idle';
    NPC.queue = NPC_MESSAGES[msg] || NPC_MESSAGES.idle; NPC.currentIdx = 0; NPC._render(); NPC._loadContext();
  },
};