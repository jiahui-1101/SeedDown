import{s as K}from"./index-CIzUcNGo.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";function T(){var e;try{const o=JSON.parse(localStorage.getItem("user_farms")||"[]"),t=((e=window.AppState)==null?void 0:e.currentFarm)||o[o.length-1];return(t==null?void 0:t.plants)||null}catch{return null}}const A=[{id:"lettuce",name:"Lettuce",icon:"🥬",growDays:35,yieldKgPerRow:4.2,pricePerKg:4.8,waterLpR:18,energyKWhpR:2.1,fertMLpR:120},{id:"tomato",name:"Tomato",icon:"🍅",growDays:65,yieldKgPerRow:8.5,pricePerKg:7.2,waterLpR:34,energyKWhpR:3.8,fertMLpR:220},{id:"carrot",name:"Carrot",icon:"🥕",growDays:70,yieldKgPerRow:6,pricePerKg:3.5,waterLpR:22,energyKWhpR:2.4,fertMLpR:140},{id:"cabbage",name:"Cabbage",icon:"🥦",growDays:80,yieldKgPerRow:9,pricePerKg:3.2,waterLpR:28,energyKWhpR:2.9,fertMLpR:160},{id:"basil",name:"Basil",icon:"🌿",growDays:28,yieldKgPerRow:1.8,pricePerKg:12,waterLpR:10,energyKWhpR:1.4,fertMLpR:80},{id:"eggplant",name:"Eggplant",icon:"🍆",growDays:75,yieldKgPerRow:7.2,pricePerKg:5.5,waterLpR:30,energyKWhpR:3.2,fertMLpR:190},{id:"green_onion",name:"Green Onion",icon:"🧅",growDays:50,yieldKgPerRow:3.5,pricePerKg:4,waterLpR:14,energyKWhpR:1.8,fertMLpR:90},{id:"spinach",name:"Spinach",icon:"🍃",growDays:40,yieldKgPerRow:3.8,pricePerKg:5,waterLpR:16,energyKWhpR:1.9,fertMLpR:100}],c={water:.28,energy:.22,fert:.18},x={waterRM:.42,energyRM:1.1,fertRM:.085},b=[{id:"spinach",name:"Spinach",icon:"🍃",temp:"+0.5",hum:"+3",ph:"0",light:"-0.5",fert:"+8",readyDays:5,zone:"Zone B",area:"12m²",dir:["up","up","ok","down","up"]},{id:"mint",name:"Mint",icon:"🌿",temp:"0",hum:"+5",ph:"-0.2",light:"0",fert:"+5",readyDays:3,zone:"Zone A",area:"6m²",dir:["ok","up","down","ok","up"]},{id:"chili",name:"Chili",icon:"🌶️",temp:"+1.5",hum:"-4",ph:"+0.3",light:"+2",fert:"+15",readyDays:12,zone:"Zone C",area:"21m²",dir:["warn","down","up","up","warn"]},{id:"cucumber",name:"Cucumber",icon:"🥒",temp:"+1",hum:"+6",ph:"0",light:"+1",fert:"+12",readyDays:8,zone:"Zone D",area:"18m²",dir:["up","up","ok","up","up"]},{id:"strawberry",name:"Strawberry",icon:"🍓",temp:"-1",hum:"+2",ph:"-0.4",light:"+1.5",fert:"+10",readyDays:14,zone:"Zone E",area:"9m²",dir:["down","ok","down","up","up"]},{id:"kale",name:"Kale",icon:"🥬",temp:"-0.5",hum:"+2",ph:"-0.1",light:"0",fert:"+6",readyDays:6,zone:"Zone B",area:"10m²",dir:["down","ok","ok","ok","up"]},{id:"broccoli",name:"Broccoli",icon:"🥦",temp:"-1",hum:"+3",ph:"-0.2",light:"+0.5",fert:"+9",readyDays:9,zone:"Zone C",area:"14m²",dir:["down","up","down","up","up"]},{id:"celery",name:"Celery",icon:"🌾",temp:"+0.5",hum:"+8",ph:"+0.1",light:"+1",fert:"+11",readyDays:7,zone:"Zone A",area:"8m²",dir:["up","warn","up","up","up"]}],F=[{id:"A",crop:"Chives",rows:12,fill:90,harvIn:4},{id:"B",crop:"Lettuce",rows:20,fill:75,harvIn:7},{id:"C",crop:"Eggplant",rows:8,fill:95,harvIn:14},{id:"D",crop:"Tomato",rows:15,fill:60,harvIn:21},{id:"E",crop:"Herbs",rows:10,fill:82,harvIn:10}],_={spinach:"Spinach co-exists well with leafy crops. No special zone separation needed.",mint:"Mint spreads aggressively. Use root barriers to protect neighbouring zones.",chili:"Chili requires dedicated lighting adjustment in Zone C before introduction.",cucumber:"Scale water pump duty cycle proportionally with new row count.",strawberry:"Position away from heat lamp clusters — Zone E end-row preferred.",kale:"Kale is cold-tolerant. Ideal companion for Zone B lettuce rows.",broccoli:"Space 30 cm apart for airflow. Monitor for aphids in high-humidity zones.",celery:"High water demand — prioritise pump schedule before adding rows."};let w=null,u=10,k=b[0],E=[...b];function W(){if(document.getElementById("pro-wif-styles"))return;const e=document.createElement("style");e.id="pro-wif-styles",e.textContent=`
    .pro-wif{font-family:'DM Mono','Courier New',monospace;background:#080E1A;color:#C9D8F5;padding:0 0 100px;min-height:100%;}
    .pro-tabs{display:flex;border-bottom:1px solid #1C2D4A;background:#080E1A;position:sticky;top:0;z-index:10;}
    .pro-tab{flex:1;padding:14px 6px 12px;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#3D5A80;border:none;background:transparent;cursor:pointer;border-bottom:2px solid transparent;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:3px;}
    .pro-tab .pro-tab-ico{font-size:18px;}
    .pro-tab.active{color:#60C0FF;border-bottom-color:#60C0FF;}
    .pro-tab:hover:not(.active){color:#7AB0D8;}
    .pro-sec{display:none;padding:16px;}
    .pro-sec.active{display:block;}
    .pro-card{background:#0D1627;border:1px solid #1C2D4A;border-radius:10px;padding:16px;margin-bottom:12px;}
    .pro-card-hd{font-size:9px;font-weight:700;letter-spacing:.18em;color:#3D5A80;text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:6px;}
    .pro-card-hd::before{content:'';display:inline-block;width:3px;height:12px;background:#60C0FF;border-radius:2px;}
    .pro-sel{width:100%;padding:9px 12px;border:1px solid #1C2D4A;border-radius:8px;background:#060C18;color:#C9D8F5;font-family:inherit;font-size:12px;margin-bottom:10px;}
    .pro-slider-row{display:flex;align-items:center;gap:10px;margin-bottom:8px;}
    .pro-slider-row label{font-size:10px;color:#3D5A80;min-width:80px;letter-spacing:.05em;}
    .pro-slider-row input[type=range]{flex:1;accent-color:#60C0FF;}
    .pro-slider-val{font-size:12px;font-weight:700;color:#60C0FF;min-width:60px;text-align:right;}
    .pro-input{background:#060C18;border:1px solid #1C2D4A;border-radius:8px;color:#C9D8F5;font-family:inherit;font-size:12px;padding:9px 12px;width:100%;}
    .pro-input:focus{outline:none;border-color:#60C0FF;}
    .pro-kpi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;}
    .pro-kpi{background:#060C18;border:1px solid #1C2D4A;border-radius:8px;padding:12px;text-align:center;}
    .pro-kpi-val{font-size:20px;font-weight:700;color:#60C0FF;}
    .pro-kpi-lbl{font-size:9px;letter-spacing:.1em;color:#3D5A80;margin-top:3px;text-transform:uppercase;}
    .pro-table{width:100%;border-collapse:collapse;font-size:11px;}
    .pro-table th{color:#3D5A80;font-size:9px;letter-spacing:.1em;text-transform:uppercase;padding:6px 8px;border-bottom:1px solid #1C2D4A;text-align:left;font-weight:700;}
    .pro-table td{padding:9px 8px;border-bottom:1px solid #0D1627;color:#C9D8F5;}
    .pro-table tr:last-child td{border-bottom:none;}
    .pro-table tr:hover td{background:#0D1E36;}
    .pro-badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:.06em;}
    .pro-badge-green{background:#0A2E1A;color:#2C9A5C;border:1px solid #1A5C35;}
    .pro-badge-amber{background:#2A1E06;color:#D4A017;border:1px solid #5C3D0A;}
    .pro-badge-red{background:#2A0A0A;color:#E24B4A;border:1px solid #5C1A1A;}
    .pro-badge-blue{background:#0A1E3A;color:#60C0FF;border:1px solid #1A4070;}
    .pro-bar-track{height:4px;background:#0D1627;border-radius:2px;overflow:hidden;}
    .pro-bar-fill{height:100%;border-radius:2px;transition:width .5s;}
    .pro-breakdown{display:flex;flex-direction:column;gap:6px;}
    .pro-brow{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:8px;font-size:12px;}
    .pro-brow-income{background:#071C10;border:1px solid #1A5C35;}
    .pro-brow-expense{background:#1A0A0A;border:1px solid #3D1515;}
    .pro-brow-ai{background:#071530;border:1px solid #1A3A6A;}
    .pro-brow-net{background:#061528;border:1px solid #60C0FF;}
    .pro-brow-lbl{font-size:10px;color:#3D5A80;}
    .pro-savings-hl{text-align:center;padding:18px 0 10px;}
    .pro-savings-num{font-size:44px;font-weight:700;color:#00FF88;letter-spacing:-.02em;line-height:1;}
    .pro-savings-lbl{font-size:10px;letter-spacing:.15em;color:#3D5A80;margin-top:6px;text-transform:uppercase;}
    .pro-savings-sub{font-size:11px;color:#2C9A5C;margin-top:8px;}
    .pro-impact-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:8px;}
    .pro-impact-card{border-radius:8px;padding:12px;text-align:center;}
    .pro-impact-card.up{background:#1E1400;border:1px solid #4A3200;}
    .pro-impact-card.down{background:#00101E;border:1px solid #003055;}
    .pro-impact-card.ok{background:#001A0E;border:1px solid #003520;}
    .pro-impact-card.warn{background:#1E0000;border:1px solid #5A0000;}
    .pro-impact-icon{font-size:20px;margin-bottom:4px;}
    .pro-impact-name{font-size:9px;letter-spacing:.1em;color:#3D5A80;text-transform:uppercase;margin-bottom:4px;}
    .pro-impact-val{font-size:15px;font-weight:700;}
    .pro-impact-val.up{color:#D4A017;}.pro-impact-val.down{color:#60C0FF;}.pro-impact-val.ok{color:#2C9A5C;}.pro-impact-val.warn{color:#E24B4A;}
    .pro-qty-row{display:flex;align-items:center;gap:10px;margin-bottom:12px;}
    .pro-qty-row label{font-size:10px;color:#3D5A80;min-width:80px;letter-spacing:.05em;}
    .pro-qty-ctrl{display:flex;align-items:center;gap:8px;}
    .pro-qty-btn{width:28px;height:28px;border:1px solid #1C2D4A;border-radius:6px;background:#060C18;color:#C9D8F5;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;}
    .pro-qty-btn:hover{border-color:#60C0FF;color:#60C0FF;}
    .pro-qty-num{width:40px;text-align:center;font-size:14px;font-weight:700;color:#60C0FF;}
    .pro-search-wrap{position:relative;margin-bottom:10px;}
    .pro-search-ico{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#3D5A80;font-size:14px;}
    .pro-suggest-list{background:#0D1627;border:1px solid #1C2D4A;border-radius:8px;overflow:hidden;margin-bottom:10px;}
    .pro-suggest-item{display:flex;align-items:center;gap:8px;padding:9px 12px;cursor:pointer;font-size:12px;transition:background .1s;}
    .pro-suggest-item:hover,.pro-suggest-item.selected{background:#0D1E36;color:#60C0FF;}
    .pro-suggest-item .sp-ico{font-size:18px;}
    .pro-zone-row{display:flex;align-items:center;gap:12px;padding:10px 14px;background:#060C18;border-radius:8px;margin-bottom:6px;border:1px solid #1C2D4A;}
    .pro-zone-id{width:28px;height:28px;border-radius:6px;background:#1C2D4A;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#60C0FF;flex-shrink:0;}
    .pro-zone-info{flex:1;}
    .pro-zone-name{font-size:12px;font-weight:700;}
    .pro-zone-meta{font-size:10px;color:#3D5A80;margin-top:2px;}
    .pro-zone-meter{margin-top:5px;}
    .pro-ai-note{background:#06101E;border-left:3px solid #60C0FF;border-radius:0 8px 8px 0;padding:10px 14px;font-size:11px;color:#7AB0D8;margin-top:12px;display:flex;gap:8px;align-items:flex-start;}
    .pro-ai-note .ai-ico{flex-shrink:0;font-size:16px;}
    .pro-hr{border:none;border-top:1px solid #1C2D4A;margin:12px 0;}
    .pro-week-row{display:flex;align-items:center;gap:8px;margin-bottom:6px;}
    .pro-week-lbl{font-size:9px;letter-spacing:.08em;color:#3D5A80;min-width:48px;text-transform:uppercase;}
    .pro-week-dots{display:flex;gap:3px;flex:1;}
    .pro-week-dot{width:10px;height:10px;border-radius:2px;background:#1C2D4A;}
    .pro-week-dot.done{background:#2C9A5C;}
    .pro-week-dot.active{background:#60C0FF;}
    .pro-week-dot.harvest{background:#D4A017;}
  `,document.head.appendChild(e)}function N(){return W(),`
    <div class="pro-wif">

      <div class="pro-tabs">
        <button class="pro-tab active" data-pro-tab="forecast">
          <span class="pro-tab-ico">📊</span>HARVEST<br>FORECAST
        </button>
        <button class="pro-tab" data-pro-tab="cost">
          <span class="pro-tab-ico">💰</span>COST &amp;<br>SAVINGS
        </button>
        <button class="pro-tab" data-pro-tab="newplant">
          <span class="pro-tab-ico">➕</span>NEW PLANT<br>IMPACT
        </button>
      </div>

      <!-- TAB 1: HARVEST FORECAST -->
      <div id="pro-forecast" class="pro-sec active">
        <div class="pro-card">
          <div class="pro-card-hd">Forecast period</div>
          <div class="pro-slider-row">
            <label>Days ahead</label>
            <input type="range" min="7" max="120" value="30" step="1" id="pro-sl-days">
            <span class="pro-slider-val" id="pro-v-days">30 days</span>
          </div>
        </div>
        <div class="pro-card">
          <div class="pro-card-hd">Summary KPIs</div>
          <div class="pro-kpi-grid">
            <div class="pro-kpi"><div class="pro-kpi-val" id="pro-kpi-rows">—</div><div class="pro-kpi-lbl">Rows ready</div></div>
            <div class="pro-kpi"><div class="pro-kpi-val" id="pro-kpi-kg">—</div><div class="pro-kpi-lbl">Total yield</div></div>
            <div class="pro-kpi"><div class="pro-kpi-val" id="pro-kpi-rev">—</div><div class="pro-kpi-lbl">Est. Revenue</div></div>
          </div>
        </div>
        <div class="pro-card">
          <div class="pro-card-hd">Crop-by-crop forecast</div>
          <table class="pro-table">
            <thead><tr><th>Crop</th><th>Rows</th><th>Yield (kg)</th><th>Revenue</th><th>Status</th></tr></thead>
            <tbody id="pro-forecast-rows"></tbody>
          </table>
        </div>
        <div class="pro-card">
          <div class="pro-card-hd">Harvest readiness timeline</div>
          <div id="pro-tl-bars"></div>
        </div>
      </div>

      <!-- TAB 2: COST & SAVINGS -->
      <div id="pro-cost" class="pro-sec">
        <div class="pro-card">
          <div class="pro-card-hd">Configure crop</div>
          <select class="pro-sel" id="pro-cost-plant">
            ${A.map(e=>`<option value="${e.id}">${e.icon} ${e.name}</option>`).join("")}
          </select>
          <div class="pro-slider-row">
            <label>Rows planted</label>
            <input type="range" min="5" max="200" value="50" step="5" id="pro-cost-rows">
            <span class="pro-slider-val" id="pro-v-rows">50</span>
          </div>
          <div class="pro-slider-row">
            <label>Cycle (weeks)</label>
            <input type="range" min="1" max="16" value="4" step="1" id="pro-cost-weeks">
            <span class="pro-slider-val" id="pro-v-weeks">4 wk</span>
          </div>
        </div>
        <div class="pro-card">
          <div class="pro-card-hd">Grow cycle timeline</div>
          <div id="pro-cycle-timeline"></div>
        </div>
        <div class="pro-card">
          <div class="pro-savings-hl">
            <div class="pro-savings-num" id="pro-net-saving">RM 0</div>
            <div class="pro-savings-lbl">Net profit this cycle</div>
            <div class="pro-savings-sub" id="pro-ai-saved-lbl">AI guidance saved: calculating…</div>
          </div>
          <hr class="pro-hr">
          <div class="pro-breakdown" id="pro-cost-breakdown"></div>
        </div>
        <div class="pro-card">
          <div class="pro-card-hd">AI-guided resource savings vs manual</div>
          <div id="pro-ai-savings-grid"></div>
        </div>
        <div class="pro-card">
          <div class="pro-card-hd">Weekly profit trend</div>
          <div style="position:relative;height:160px;">
            <canvas id="pro-savings-chart"></canvas>
          </div>
        </div>
      </div>

      <!-- TAB 3: NEW PLANT IMPACT -->
      <div id="pro-newplant" class="pro-sec">
        <div class="pro-card">
          <div class="pro-card-hd">Species search</div>
          <div class="pro-search-wrap">
            <span class="pro-search-ico">🔍</span>
            <input class="pro-input" id="pro-np-search" placeholder="Type to search species…" style="padding-left:32px;">
          </div>
          <div class="pro-suggest-list" id="pro-np-suggestions"></div>
          <div class="pro-qty-row">
            <label>Plant rows</label>
            <div class="pro-qty-ctrl">
              <button class="pro-qty-btn" id="pro-qty-dec">−</button>
              <span class="pro-qty-num" id="pro-qty-disp">10</span>
              <button class="pro-qty-btn" id="pro-qty-inc">+</button>
            </div>
          </div>
        </div>
        <div class="pro-card">
          <div class="pro-card-hd">Planting readiness</div>
          <div id="pro-readiness-block"></div>
          <div class="pro-card-hd" style="margin-top:14px;">Zone utilisation</div>
          <div id="pro-zone-list"></div>
        </div>
        <div class="pro-card">
          <div class="pro-card-hd">Predicted resource delta</div>
          <div class="pro-impact-grid" id="pro-impact-grid"></div>
          <div class="pro-ai-note"><span class="ai-ico">🤖</span><span id="pro-np-ai"></span></div>
        </div>
      </div>

    </div>
  `}function q(){var n,l;w=null,u=10,k=b[0],E=[...b];const e=T();if(e!=null&&e.length){const s=document.getElementById("pro-crop-sel"),i=document.getElementById("pro-cost-crop"),a=e.map(r=>`<option value="${r.species}">${r.emoji||"🌱"} ${r.name}</option>`).join("");s&&(s.innerHTML=a),i&&(i.innerHTML=a)}const o=JSON.parse(localStorage.getItem("user_farms")||"[]"),t=((n=window.AppState)==null?void 0:n.currentFarm)||o[o.length-1];if((l=t==null?void 0:t.plants)!=null&&l.length){F.length=0;const s=t.rackTypeId||"3-tier",i=parseInt(s)||3;t.plants.slice(0,i).forEach((a,r)=>{F.push({id:String.fromCharCode(65+r),crop:a.name,rows:a.slots||3,fill:70+Math.random()*20|0,harvIn:7+r*3})})}H(),j(),O(),V(),B(),h(),R(),C()}function H(){document.querySelectorAll(".pro-tab[data-pro-tab]").forEach(e=>{e.addEventListener("click",()=>{var t;const o=e.getAttribute("data-pro-tab");document.querySelectorAll(".pro-sec").forEach(n=>n.classList.remove("active")),document.querySelectorAll(".pro-tab").forEach(n=>n.classList.remove("active")),(t=document.getElementById("pro-"+o))==null||t.classList.add("active"),e.classList.add("active"),o==="cost"&&h()})})}function j(){var e;(e=document.getElementById("pro-sl-days"))==null||e.addEventListener("input",B)}function B(){var s;const e=parseInt(((s=document.getElementById("pro-sl-days"))==null?void 0:s.value)||30);document.getElementById("pro-v-days").textContent=e+" days";let o=0,t=0,n=0;const l=A.map(i=>{const a=Math.floor(e/i.growDays),r=(e%i.growDays/i.growDays*100).toFixed(0),p=e>=i.growDays,d=p?Math.max(1,a*8):0,g=d*i.yieldKgPerRow,v=g*i.pricePerKg;return p&&(o+=d,t+=g,n+=v),{c:i,rowCount:d,kg:g,rev:v,isReady:p,cyclesDone:a,partialPct:r}});document.getElementById("pro-kpi-rows").textContent=o,document.getElementById("pro-kpi-kg").textContent=t.toFixed(0)+" kg",document.getElementById("pro-kpi-rev").textContent="RM "+n.toFixed(0),document.getElementById("pro-forecast-rows").innerHTML=l.map(i=>`
    <tr>
      <td>${i.c.icon} ${i.c.name}</td>
      <td style="color:#60C0FF;font-weight:700;">${i.isReady?i.rowCount:"—"}</td>
      <td>${i.isReady?i.kg.toFixed(1)+" kg":"—"}</td>
      <td>${i.isReady?'<span style="color:#00FF88;">RM '+i.rev.toFixed(0)+"</span>":"—"}</td>
      <td>${i.isReady?`<span class="pro-badge pro-badge-green">READY ×${i.cyclesDone}</span>`:`<span class="pro-badge pro-badge-amber">${i.partialPct}%</span>`}
      </td>
    </tr>`).join(""),document.getElementById("pro-tl-bars").innerHTML=l.map(i=>{const a=Math.min(100,e/i.c.growDays*100),r=i.isReady?"#00FF88":"#D4A017";return`
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <span style="font-size:11px;min-width:90px;color:#3D5A80;">${i.c.name}</span>
        <div class="pro-bar-track" style="flex:1;">
          <div class="pro-bar-fill" style="width:${a.toFixed(0)}%;background:${r};"></div>
        </div>
        <span style="font-size:10px;min-width:54px;text-align:right;">
          ${i.isReady?`<span class="pro-badge pro-badge-green">Day ${i.c.growDays}</span>`:`Day ${i.c.growDays}`}
        </span>
      </div>`}).join("")}function O(){var e,o,t;(e=document.getElementById("pro-cost-plant"))==null||e.addEventListener("change",h),(o=document.getElementById("pro-cost-rows"))==null||o.addEventListener("input",h),(t=document.getElementById("pro-cost-weeks"))==null||t.addEventListener("input",h)}function h(){var $,I,M;const e=(($=document.getElementById("pro-cost-plant"))==null?void 0:$.value)||"lettuce",o=parseInt(((I=document.getElementById("pro-cost-rows"))==null?void 0:I.value)||50),t=parseInt(((M=document.getElementById("pro-cost-weeks"))==null?void 0:M.value)||4);document.getElementById("pro-v-rows").textContent=o,document.getElementById("pro-v-weeks").textContent=t+" wk";const n=A.find(m=>m.id===e)||A[0],l=Math.ceil(n.growDays/7);document.getElementById("pro-cycle-timeline").innerHTML=["Seedling","Vegetative","Harvest"].map((m,z)=>{const S=Math.round(z*l/3),L=Math.round((z+1)*l/3),P=Array.from({length:Math.min(t,16)},(G,f)=>`<div class="pro-week-dot ${f<S?"done":f<L&&f<t?f===Math.min(t,l)-1?"harvest":"active":""}" title="Week ${f+1}"></div>`).join("");return`
      <div class="pro-week-row">
        <span class="pro-week-lbl">${m.substring(0,8)}</span>
        <div class="pro-week-dots">${P}</div>
        <span style="font-size:9px;color:#3D5A80;min-width:24px;">W${L}</span>
      </div>`}).join("");const s=o*n.yieldKgPerRow*(t/(n.growDays/7)),i=s*n.pricePerKg,a=o*n.waterLpR*t*x.waterRM/1e3,r=o*n.energyKWhpR*t*x.energyRM,p=o*n.fertMLpR*t*x.fertRM,d=a*(1-c.water),g=r*(1-c.energy),v=p*(1-c.fert),y=a-d+(r-g)+(p-v),D=i-(d+g+v);document.getElementById("pro-net-saving").textContent="RM "+D.toFixed(0),document.getElementById("pro-ai-saved-lbl").textContent=`AI guidance saved: RM ${y.toFixed(2)} vs manual farming`,document.getElementById("pro-cost-breakdown").innerHTML=`
    <div class="pro-brow pro-brow-income">
      <span class="pro-brow-lbl">📦 Harvest revenue (${s.toFixed(0)} kg × RM ${n.pricePerKg}/kg)</span>
      <span style="color:#00FF88;font-weight:700;">+RM ${i.toFixed(2)}</span>
    </div>
    <div class="pro-brow pro-brow-expense">
      <span class="pro-brow-lbl">💧 Water — AI-optimised (${(o*n.waterLpR*t/1e3*(1-c.water)).toFixed(1)} m³)</span>
      <span style="color:#E24B4A;font-weight:700;">−RM ${d.toFixed(2)}</span>
    </div>
    <div class="pro-brow pro-brow-expense">
      <span class="pro-brow-lbl">⚡ Energy — AI-optimised (${(o*n.energyKWhpR*t*(1-c.energy)).toFixed(1)} kWh)</span>
      <span style="color:#E24B4A;font-weight:700;">−RM ${g.toFixed(2)}</span>
    </div>
    <div class="pro-brow pro-brow-expense">
      <span class="pro-brow-lbl">🧪 Fertilizer — AI-optimised</span>
      <span style="color:#E24B4A;font-weight:700;">−RM ${v.toFixed(2)}</span>
    </div>
    <div class="pro-brow pro-brow-ai">
      <span class="pro-brow-lbl">🤖 AI guidance total savings vs manual</span>
      <span style="color:#60C0FF;font-weight:700;">+RM ${y.toFixed(2)}</span>
    </div>
    <div class="pro-brow pro-brow-net">
      <span style="font-weight:700;">⭐ NET PROFIT</span>
      <span style="color:#00FF88;font-weight:700;font-size:15px;">RM ${D.toFixed(2)}</span>
    </div>`,document.getElementById("pro-ai-savings-grid").innerHTML=[{icon:"💧",label:"Water saved",unit:"m³",manual:(o*n.waterLpR*t/1e3).toFixed(2),ai:(o*n.waterLpR*t/1e3*(1-c.water)).toFixed(2),saved:a-d,pct:(c.water*100).toFixed(0),how:`Smart irrigation pulses vs constant flow — ${(c.water*100).toFixed(0)}% reduction`},{icon:"⚡",label:"Energy saved",unit:"kWh",manual:(o*n.energyKWhpR*t).toFixed(1),ai:(o*n.energyKWhpR*t*(1-c.energy)).toFixed(1),saved:r-g,pct:(c.energy*100).toFixed(0),how:`Adaptive LED spectrum scheduling — ${(c.energy*100).toFixed(0)}% reduction`},{icon:"🧪",label:"Fertilizer saved",unit:"mL",manual:(o*n.fertMLpR*t).toFixed(0),ai:(o*n.fertMLpR*t*(1-c.fert)).toFixed(0),saved:p-v,pct:(c.fert*100).toFixed(0),how:`EC/pH closed-loop dosing — ${(c.fert*100).toFixed(0)}% reduction`}].map(m=>`
    <div style="background:#060C18;border:1px solid #1C2D4A;border-radius:8px;padding:12px;margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span style="font-size:12px;font-weight:700;">${m.icon} ${m.label}</span>
        <span class="pro-badge pro-badge-green">−${m.pct}%</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:8px;">
        <div style="text-align:center;"><div style="font-size:9px;color:#3D5A80;text-transform:uppercase;letter-spacing:.08em;">Manual</div><div style="font-size:13px;font-weight:700;color:#E24B4A;">${m.manual} ${m.unit}</div></div>
        <div style="text-align:center;"><div style="font-size:9px;color:#3D5A80;text-transform:uppercase;letter-spacing:.08em;">AI-guided</div><div style="font-size:13px;font-weight:700;color:#00FF88;">${m.ai} ${m.unit}</div></div>
        <div style="text-align:center;"><div style="font-size:9px;color:#3D5A80;text-transform:uppercase;letter-spacing:.08em;">Saved</div><div style="font-size:13px;font-weight:700;color:#60C0FF;">RM ${m.saved.toFixed(2)}</div></div>
      </div>
      <div style="font-size:9px;color:#3D5A80;letter-spacing:.04em;">${m.how}</div>
    </div>`).join(""),Z(n,o,t)}function Z(e,o,t){const n=document.getElementById("pro-savings-chart");if(!n)return;const l=()=>{w&&(w.destroy(),w=null);const s=Array.from({length:t},(a,r)=>"W"+(r+1)),i=s.map((a,r)=>{const p=r+1,d=o*e.yieldKgPerRow*(p/(e.growDays/7))*e.pricePerKg,g=o*e.waterLpR*p/1e3*x.waterRM*(1-c.water)+o*e.energyKWhpR*p*x.energyRM*(1-c.energy)+o*e.fertMLpR*p*x.fertRM*(1-c.fert);return parseFloat((d-g).toFixed(2))});w=new Chart(n,{type:"bar",data:{labels:s,datasets:[{label:"Net profit (RM)",data:i,backgroundColor:i.map(a=>a>=0?"#00FF8844":"#E24B4A44"),borderColor:i.map(a=>a>=0?"#00FF88":"#E24B4A"),borderWidth:1,borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,ticks:{callback:a=>"RM "+a,color:"#3D5A80",font:{family:"DM Mono,monospace",size:10}},grid:{color:"#1C2D4A"}},x:{ticks:{color:"#3D5A80",font:{family:"DM Mono,monospace",size:10}},grid:{display:!1}}}}})};if(typeof Chart>"u"){const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js",s.onload=l,document.head.appendChild(s)}else l()}function V(){var e,o,t;(e=document.getElementById("pro-np-search"))==null||e.addEventListener("input",()=>{const n=(document.getElementById("pro-np-search").value||"").toLowerCase().trim();E=n?b.filter(l=>l.name.toLowerCase().includes(n)||l.id.includes(n)):[...b],R()}),(o=document.getElementById("pro-qty-dec"))==null||o.addEventListener("click",()=>{u=Math.max(1,u-5),document.getElementById("pro-qty-disp").textContent=u,C()}),(t=document.getElementById("pro-qty-inc"))==null||t.addEventListener("click",()=>{u=Math.min(500,u+5),document.getElementById("pro-qty-disp").textContent=u,C()})}function R(){const e=document.getElementById("pro-np-suggestions");e&&(e.innerHTML=E.slice(0,6).map(o=>`
    <div class="pro-suggest-item ${o.id===k.id?"selected":""}" data-np-id="${o.id}">
      <span class="sp-ico">${o.icon}</span>
      <span>${o.name}</span>
      <span style="margin-left:auto;font-size:9px;color:#3D5A80;">Ready in ${o.readyDays}d</span>
    </div>`).join(""),e.querySelectorAll(".pro-suggest-item").forEach(o=>{o.addEventListener("click",()=>{k=b.find(t=>t.id===o.getAttribute("data-np-id"))||b[0],R(),C()})}))}function C(){const e=k,o=document.getElementById("pro-readiness-block");o&&(o.innerHTML=`
    <div style="display:flex;align-items:center;gap:12px;padding:12px;background:#06101E;border:1px solid #1A3A6A;border-radius:8px;margin-bottom:12px;">
      <span style="font-size:28px;">${e.icon}</span>
      <div>
        <div style="font-size:13px;font-weight:700;color:#60C0FF;">Plant ${u} rows of ${e.name} in ${e.readyDays} days</div>
        <div style="font-size:10px;color:#3D5A80;margin-top:3px;">${e.zone} becomes available — ${e.area} freed after current cycle ends</div>
      </div>
    </div>`);const t=document.getElementById("pro-zone-list");t&&(t.innerHTML=F.map(r=>{const p=r.fill>=90?"pro-badge-red":r.fill>=75?"pro-badge-amber":"pro-badge-green",d=r.fill>=90?"FULL":r.fill>=75?"NEAR FULL":"AVAILABLE",g=r.fill>=90?"#E24B4A":r.fill>=75?"#D4A017":"#2C9A5C";return`
      <div class="pro-zone-row">
        <div class="pro-zone-id">${r.id}</div>
        <div class="pro-zone-info">
          <div class="pro-zone-name">${r.crop} <span style="font-size:10px;color:#3D5A80;">· ${r.rows} rows</span></div>
          <div class="pro-zone-meta">Harvest in ${r.harvIn} days</div>
          <div class="pro-zone-meter">
            <div class="pro-bar-track"><div class="pro-bar-fill" style="width:${r.fill}%;background:${g};"></div></div>
          </div>
        </div>
        <span class="pro-badge ${p}" style="margin-left:8px;">${d}</span>
      </div>`}).join(""));const n=u/10,l=[{name:"Temperature",icon:"🌡️",unit:"°C",raw:e.temp},{name:"Humidity",icon:"💧",unit:"%",raw:e.hum},{name:"pH Level",icon:"⚗️",unit:"",raw:e.ph},{name:"Light",icon:"☀️",unit:"h/d",raw:e.light},{name:"Fertilizer",icon:"🧪",unit:"%",raw:e.fert}],s={up:"▲",down:"▼",ok:"●",warn:"⚠"},i=document.getElementById("pro-impact-grid");i&&(i.innerHTML=l.map((r,p)=>{const d=e.dir[p],g=parseFloat(r.raw);let v=r.raw==="0"?"No Δ":r.raw+r.unit;if(!isNaN(g)&&r.raw!=="0"){const y=g*n;v=(y>0?"+":"")+y.toFixed(1).replace(".0","")+r.unit}return`
      <div class="pro-impact-card ${d}">
        <div class="pro-impact-icon">${r.icon}</div>
        <div class="pro-impact-name">${r.name}</div>
        <div class="pro-impact-val ${d}">${s[d]} ${v}</div>
      </div>`}).join(""));const a=document.getElementById("pro-np-ai");if(a){const r=e.dir.filter(d=>d==="warn").length,p=_[e.id]||"Monitor environment for 48h after introduction.";a.textContent=r>0?`⚠ Adding ${u} rows of ${e.name} triggers ${r} resource warning(s). Review flagged parameters before planting. ${p}`:`✅ ${u} rows of ${e.name} — resource impact within acceptable range. ${p}`}}function X(){const e=document.getElementById("screenContainer");e.innerHTML=`
      <div class="screen active" id="whatifProScreen">
          <div style="display:flex; align-items:center; padding:12px 16px; background:#080E1A; gap:12px; border-bottom:1px solid #1C2D4A;">
              <button id="whatifProBackBtn" class="back-btn" aria-label="Back" style="color:#60A5FA;">←</button>
              <div style="font-weight:700; color:#C9D8F5;">🔮 What-If Pro</div>
          </div>
          <div style="flex:1; overflow-y:auto;">${N()}</div>
      </div>
  `,document.getElementById("whatifProBackBtn").addEventListener("click",()=>K("dash-c")),q()}export{q as init,N as render,X as renderScreen};
