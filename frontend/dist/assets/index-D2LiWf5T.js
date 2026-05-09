const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/CommercialPage-BwXWtRni.js","assets/SosTab-DYiWTU-0.js","assets/CommunityPage-C4v5X6Rx.js"])))=>i.map(i=>d[i]);
(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();const E="modulepreload",_=function(e){return"/"+e},v={},c=function(t,n,i){let r=Promise.resolve();if(n&&n.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),d=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));r=Promise.allSettled(n.map(o=>{if(o=_(o),o in v)return;v[o]=!0;const p=o.endsWith(".css"),u=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${o}"]${u}`))return;const h=document.createElement("link");if(h.rel=p?"stylesheet":E,p||(h.as="script"),h.crossOrigin="",h.href=o,d&&h.setAttribute("nonce",d),document.head.appendChild(h),p)return new Promise((x,w)=>{h.addEventListener("load",x),h.addEventListener("error",()=>w(new Error(`Unable to preload CSS for ${o}`)))})}))}function s(a){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=a,window.dispatchEvent(d),!d.defaultPrevented)throw a}return r.then(a=>{for(const d of a||[])d.status==="rejected"&&s(d.reason);return t().catch(s)})},l={mode:"beginner",currentScreen:"splash",farmName:"My Farm",currentFarmId:null,tiles:[],sensors:{temp:{val:34.2,unit:"°C",status:"danger"},humid:{val:68,unit:"%",status:"ok"},light:{val:82,unit:"%",status:"ok"},ph:{val:6.2,unit:"pH",status:"ok"},water:{val:22,unit:"%",status:"warning"},nutrient:{val:78,unit:"%",status:"ok"}},addPlant:{selectedCropIndex:null,selectedTileId:null},visitTarget:null,chatMessages:[],listeners:new Set,subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)},notify(){this.listeners.forEach(e=>e(this))},updateSensors(e,t,n){this.sensors[e]&&(this.sensors[e]={...this.sensors[e],val:t,status:n},this.notify())}};function k(){return Array(12).fill().map((e,t)=>({id:t,plant:t<6?["🥬","🌿","🌱","🍅","🌿","🌶️"][t]:null,name:t<6?["Lettuce","Spinach","Basil","Tomato","Mint","Chili"][t]:null,status:t===1?"warning":t===3?"danger":t<6?"healthy":"empty",growth:[78,55,100,40,62,33,0,0,0,0,0,0][t],days:[7,12,0,20,9,18,0,0,0,0,0,0][t]}))}const I={canvas:null,ctx:null,width:0,height:0,tileW:56,tileH:28,cols:4,rows:3,frame:0,init(e){this.canvas=document.getElementById(e),this.canvas&&(this.resize(),window.addEventListener("resize",()=>this.resize()),this.canvas.addEventListener("click",t=>this.handleClick(t)),this.animate())},resize(){const e=this.canvas.parentElement;this.width=e.clientWidth,this.height=Math.min(e.clientHeight,220),this.canvas.width=this.width,this.canvas.height=this.height,this.draw()},getTileAt(e,t){return null},draw(){if(this.ctx){this.ctx.clearRect(0,0,this.width,this.height),this.drawGround();for(let e=0;e<this.rows;e++)for(let t=0;t<this.cols;t++)this.drawTile(t,e);this.drawNPC()}},drawGround(){const e=this.ctx.createLinearGradient(0,0,0,this.height);e.addColorStop(0,"#EAF4FF"),e.addColorStop(1,"#D9E8F5"),this.ctx.fillStyle=e,this.ctx.fillRect(0,0,this.width,this.height)},drawTile(e,t){},drawNPC(){},animate(){requestAnimationFrame(()=>{this.frame++,this.draw(),this.animate()})},handleClick(e){}};let b={},f=null;function S(e){b=e}async function A(e,t={}){var i,r;if(console.log(`[Navigation] Showing screen: ${e}, current: ${f}`),f===e&&Object.keys(t).length===0){console.log(`[Navigation] Screen ${e} already active, skipping`);return}f=e;const n=b[e];if(!n){console.error(`[Navigation] Screen "${e}" not found in pageModules`),(i=window.showToast)==null||i.call(window,"error",`Screen "${e}" not found`);return}try{await n(t)}catch(s){console.error(`[Navigation] Error rendering screen "${e}":`,s),(r=window.showToast)==null||r.call(window,"error",`Failed to load ${e}: ${s.message}`)}}const L={container:null,refreshInterval:null,async init(){this.container=document.getElementById("dashStrip"),this.container&&(this.container.className="",this.container.style.display="block",this.container.style.width="100%",l.subscribe(()=>this.render()),await this.fetchLatestData(),this.refreshInterval&&clearInterval(this.refreshInterval),this.refreshInterval=setInterval(()=>this.fetchLatestData(),1e4))},async fetchLatestData(){try{const t=await(await fetch("http://localhost:3000/api/sensors/latest?deviceId=farm_001")).json();if(t&&t.reading){const n=t.reading;l.sensors={temp:{val:n.temperature||0,status:n.temperature>30?"danger":"normal"},humid:{val:n.humidity||0,status:"normal"},light:{val:n.lightRaw||0,status:"normal"},ph:{val:n.ph||0,status:n.ph<5.5?"warning":"normal"},water:{val:n.waterDistanceCm||0,status:"normal"},nutrient:{val:n.gasRaw||0,status:"normal"}},l.notify()}}catch(e){console.error("Dashboard 拿不到真数据:",e)}},render(){if(!this.container)return;const e=l.sensors,t=[{icon:"🌡️",key:"temp",label:"Temp",unit:"°C"},{icon:"💧",key:"humid",label:"Humid",unit:"%rh"},{icon:"☀️",key:"light",label:"Light",unit:"%"},{icon:"🧪",key:"ph",label:"pH",unit:"pH"},{icon:"💦",key:"water",label:"Water",unit:"cm"},{icon:"🧬",key:"nutrient",label:"Gas",unit:""}];this.container.innerHTML=`
            <div style="background: #FFFFFF; border-radius: 24px; padding: 20px 16px; margin: 0 16px 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
                <div style="display: flex; align-items: center; margin-bottom: 16px;">
                    <div style="width: 4px; height: 16px; background: #059669; border-radius: 4px; margin-right: 8px;"></div>
                    <div style="font-size: 1.05rem; font-weight: 700; color: #1A1A1A;">Live Data</div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 1fr; gap: 10px;">
                    ${t.map(n=>this.createGridCard(n,e[n.key]||{val:0,status:"normal"})).join("")}
                </div>
            </div>
        `,this.container.querySelectorAll(".sensor-click-card").forEach(n=>{n.addEventListener("click",()=>{const i=n.getAttribute("data-key"),r=n.getAttribute("data-label");A("sensor-detail",{key:i,name:r})})})},createGridCard(e,t){let n=t.status==="danger"?"#DC2626":t.status==="warning"?"#D97706":"#059669",i=t.status==="danger"?"#FEE2E2":t.status==="warning"?"#FFFBEB":"#ECFDF5";return`
            <div class="sensor-click-card" data-key="${e.key}" data-label="${e.label}" style="cursor:pointer; background: ${i}; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; min-height: 90px; position: relative; overflow: hidden; transition: all 0.2s ease;">
                <div style="position: absolute; top: -5px; right: -5px; font-size: 36px; opacity: 0.1;">${e.icon}</div>
                <div style="font-size: 14px; opacity: 0.7; margin-bottom: auto;">${e.icon}</div>
                <div style="margin-top: 12px;">
                    <div style="display: flex; align-items: baseline; gap: 2px;">
                        <span style="font-size: 1.15rem; font-weight: 700; color: ${n};">${t.val}</span>
                        <span style="font-size: 0.6rem; color: #64748B;">${e.unit}</span>
                    </div>
                    <div style="font-size: 0.6rem; font-weight: 600; color: #9AA5B8; margin-top: 2px;">${e.label}</div>
                </div>
            </div>
        `}},y={idle:["Your farm looks healthy! Keep it up.","Monitor temperature closely today."],warning:["Spinach B2 needs water!","Humidity is dropping."],danger:["Critical temperature! Activate cooling now."],ready:["Basil is ready to harvest!"]},T={currentMsg:"",init(){this.updateMessage(),l.subscribe(()=>this.updateMessage())},updateMessage(){const e=Object.values(l.sensors).some(i=>i.status==="danger"),t=Object.values(l.sensors).some(i=>i.status==="warning");let n="idle";e?n="danger":t?n="warning":l.tiles.some(i=>i.status==="ready")&&(n="ready"),this.currentMsg=y[n][Math.floor(Math.random()*y[n].length)],this.render()},render(){}};function C(e,t){const n=document.getElementById("toastContainer"),i=document.createElement("div");i.className=`toast ${e}`,i.innerHTML=`<span>${e==="success"?"✅":e==="error"?"❌":"ℹ️"}</span><span>${t}</span>`,n.appendChild(i),setTimeout(()=>i.remove(),3e3)}const F={interval:null,start(e=5e3){this.interval&&clearInterval(this.interval),this.interval=setInterval(()=>{const t=l.sensors.temp.val,n=Math.min(40,Math.max(18,t+(Math.random()-.5)*.4)),i=n>32?"danger":n>28?"warning":"ok";l.updateSensors("temp",parseFloat(n.toFixed(1)),i);const r=Math.min(85,Math.max(45,l.sensors.humid.val+(Math.random()-.5)*.8)),s=r<50?"warning":r>80?"danger":"ok";l.updateSensors("humid",Math.floor(r),s),window.dispatchEvent(new CustomEvent("sensor-update"))},e)},stop(){this.interval&&clearInterval(this.interval)}};let g=!1,m=[];function O(){const e=document.getElementById("globalAiChat");if(!e)return;e.innerHTML=`
        <style>
            #aiFab {
                width: 60px; height: 60px; background: var(--accent); 
                border-radius: 50%; display: flex; align-items: center; 
                justify-content: center; font-size: 30px; cursor: pointer; 
                box-shadow: 0 8px 24px rgba(0,0,0,0.2); transition: all 0.3s ease;
                z-index: 1000; position: fixed; bottom: 20px; right: 20px;
            }
            #aiFab:hover { transform: scale(1.1) rotate(5deg); }

            #aiWindow {
                display: none; position: fixed; bottom: 90px; right: 20px; 
                width: 350px; height: 500px; background: var(--surface); 
                border-radius: 24px; flex-direction: column; 
                box-shadow: 0 12px 40px rgba(0,0,0,0.15); 
                border: 1px solid var(--border); overflow: hidden;
                z-index: 1000; animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }

            @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }

            .msg-bubble {
                max-width: 85%; padding: 12px 16px; border-radius: 18px; 
                font-size: 0.95rem; line-height: 1.4; position: relative;
                margin-bottom: 4px;
            }
            
            .bot-msg { 
                align-self: flex-start; background: var(--surface); 
                border: 1px solid var(--border); border-bottom-left-radius: 4px; 
                color: var(--text-main);
            }

            .user-msg { 
                align-self: flex-end; background: var(--accent); 
                color: white; border-bottom-right-radius: 4px;
                box-shadow: 0 4px 10px rgba(var(--accent-rgb), 0.3);
            }

            .typing-indicator {
                font-style: italic; font-size: 0.8rem; color: var(--text-muted);
                margin-left: 12px; margin-bottom: 8px; display: none;
            }
        </style>

        <div id="aiFab">🌿</div>

        <div id="aiWindow">
            <!-- Header -->
            <div style="background: var(--accent); padding: 20px; color: white;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: 800; font-size: 1.1rem; letter-spacing: -0.5px;">SeedDown AI</div>
                        <div style="font-size: 0.75rem; opacity: 0.9; display: flex; align-items: center; gap: 4px;">
                            <span style="width: 8px; height: 8px; background: #4ade80; border-radius: 50%;"></span>
                            System Sync: Optimal
                        </div>
                    </div>
                    <button id="closeAi" style="background:rgba(255,255,255,0.2); border:none; color:white; cursor:pointer; width:30px; height:30px; border-radius:50%; font-size: 0.8rem;">✕</button>
                </div>
            </div>

            <!-- Messages Area -->
            <div id="aiMessages" style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px; background: var(--bg-alt);">
                <div class="msg-bubble bot-msg">
                    Hello! I'm your SeedDown assistant. I'm connected to your farm's sensors. Ask me anything about your plants!
                </div>
            </div>

            <div id="typingIndicator" class="typing-indicator">SeedDown is analyzing...</div>

            <!-- Input Area -->
            <div style="padding: 16px; background: var(--surface); border-top: 1px solid var(--border);">
                <div style="display: flex; gap: 8px; background: var(--bg); padding: 4px; border-radius: 25px; border: 1px solid var(--border);">
                    <input id="aiInput" type="text" placeholder="Ask about your farm..." 
                        style="flex: 1; background: transparent; border: none; padding: 10px 15px; outline: none; color: var(--text-main);">
                    <button id="aiSend" style="background: var(--accent); color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; transition: transform 0.2s;">
                        ➤
                    </button>
                </div>
            </div>
        </div>
    `;const t=document.getElementById("aiFab"),n=document.getElementById("aiWindow"),i=document.getElementById("aiInput"),r=document.getElementById("aiMessages"),s=document.getElementById("typingIndicator");t.addEventListener("click",()=>{g=!g,n.style.display=g?"flex":"none",g&&i.focus()}),document.getElementById("closeAi").addEventListener("click",()=>{g=!1,n.style.display="none"});function a(o,p){const u=document.createElement("div");u.className=`msg-bubble ${p?"user-msg":"bot-msg"}`,u.innerText=o,r.appendChild(u),r.scrollTop=r.scrollHeight}async function d(){const o=i.value.trim();if(o){a(o,!0),i.value="",s.style.display="block",r.scrollTop=r.scrollHeight;try{const u=await(await fetch("http://localhost:3000/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:o,history:m})})).json();s.style.display="none",u.reply?(a(u.reply,!1),m.push({role:"user",content:o}),m.push({role:"assistant",content:u.reply}),m.length>10&&(m=m.slice(-10))):a("Sorry, I had trouble connecting. Try again!",!1)}catch{s.style.display="none",a("Connection error — is the backend running?",!1)}}}document.getElementById("aiSend").addEventListener("click",d),i.addEventListener("keypress",o=>{o.key==="Enter"&&d()})}l.tiles=k();const M={splash:()=>c(()=>import("./SplashPage-CqYm8Aog.js"),[]).then(e=>e.render()),login:()=>c(()=>import("./LoginPage-Ck8vrPcg.js"),[]).then(e=>e.render()),farmlist:()=>c(()=>import("./FarmListPage-DxGkz25d.js"),[]).then(e=>e.render()),buildfarm:()=>c(()=>import("./BuildFarmPage-B0IppAwt.js"),[]).then(e=>e.render()),home:()=>c(()=>import("./HomePage-NUvZKgQl.js"),[]).then(e=>e.render()),"dash-c":()=>c(()=>import("./CommercialPage-BwXWtRni.js"),__vite__mapDeps([0,1])).then(e=>e.render()),community:()=>c(()=>import("./CommunityPage-C4v5X6Rx.js"),__vite__mapDeps([2,1])).then(e=>e.render()),feature:e=>c(()=>import("./FeaturePage-Cc1Asm3z.js"),[]).then(t=>t.render(e)),"sensor-detail":e=>c(()=>import("./SensorDetailPage-9_Gjl-2K.js"),[]).then(t=>t.render(e)),profile:()=>c(()=>import("./ProfilePage-D34vD0_n.js"),[]).then(e=>e.render()),"alert-detail":e=>c(()=>import("./AlertDetailPage-Bo1vnpPU.js"),[]).then(t=>t.render(e))};document.addEventListener("DOMContentLoaded",()=>{I.init("farmCanvas"),L.init(),T.init(),F.start(5e3),O(),S(M),c(()=>import("./SplashPage-CqYm8Aog.js"),[]).then(e=>e.render()),window.showToast=C});export{l as A,I as F,T as N,L as S,C as a,A as s};
