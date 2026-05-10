import{A as i,s as d}from"./index-DEjNUr0y.js";import"https://esm.sh/three@0.160.0";function b(){const r=document.getElementById("screenContainer");r.innerHTML=`
        <div class="screen active" id="commercialScreen" style="background:#050810; display:flex; flex-direction:column; height:100vh; color:#E8F0FF; position:relative;">
            
            <div class="topbar" style="background:#0D1221; color:#E8F0FF; padding:16px; border-bottom:1px solid #1E293B; display:flex; align-items:center;">
                <button id="comBackBtn" style="background:transparent; border:none; color:#60A5FA; cursor:pointer;">← Back</button>
                <div class="topbar-brand" style="margin-left:12px; flex:1;">
                    <span style="background:#1E3A5F; padding:4px 8px; border-radius:8px;">⚙</span>
                    <span style="margin-left:8px; font-weight:bold;">NexusGrow PRO</span>
                </div>
                <div class="live-pill" style="background:rgba(239,68,68,0.2); color:#EF4444; padding:4px 10px; border-radius:12px; font-size:0.7rem;">🔴 Live</div>
            </div>

            <div style="flex:1; overflow-y:auto; padding:16px;">
                
                <div id="pro-3d-rack" style="background: linear-gradient(180deg, #161B2D 0%, #0D1221 100%); border-radius:16px; height:200px; margin-bottom:16px; border:1px solid #1E293B; display:flex; justify-content:center; align-items:center; position:relative; overflow:hidden;">
                    <div style="color:#4A6A9A; font-size:0.8rem;">[ 3D Rack Visualizer (Three.js) ]</div>
                    <button style="position:absolute; bottom:12px; right:12px; background:#4F46E5; color:white; border:none; width:36px; height:36px; border-radius:50%; font-size:1.2rem; cursor:pointer; box-shadow:0 4px 10px rgba(79,70,229,0.4);">+</button>
                </div>

                <div style="background:rgba(56,189,248,0.05); border:1px solid rgba(56,189,248,0.2); border-radius:16px; padding:12px; margin-bottom:16px; display:flex; align-items:center; gap:12px;">
                    <div style="font-size:1.5rem;">✨</div>
                    <div style="flex:1;">
                        <div style="color:#38BDF8; font-size:0.6rem; font-weight:bold; letter-spacing:1px;">AI FARM ADVISOR</div>
                        <div id="ai-overview-text" style="font-size:0.75rem; color:#E8F0FF; opacity:0.8;">Syncing with farm Brain...</div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
                    <div id="profit-card" style="background:#161B2D; border-radius:16px; padding:16px; border:1px solid #60A5FA; cursor:pointer; box-shadow: 0 0 15px rgba(96,165,250,0.1);">
                        <div style="color:#60A5FA; font-size:0.7rem; font-weight:bold; display:flex; justify-content:space-between;">
                            EST. PROFIT <span>🔍 Trend</span>
                        </div>
                        <div id="pro-profit" style="font-size:1.8rem; color:#00FF88; font-weight:bold; margin-top:4px;">RM --</div>
                    </div>
                    <div id="energy-card" style="background:#161B2D; border-radius:16px; padding:16px; border:1px solid #1E293B; cursor:pointer;">
                        <div style="color:#4A6A9A; font-size:0.7rem; font-weight:bold; display:flex; justify-content:space-between;">
                            ENERGY COST <span>🔍 Detail</span>
                        </div>
                        <div id="pro-energy" style="font-size:1.8rem; color:#FFD966; font-weight:bold; margin-top:4px;">-- kWh</div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:16px;">
                    <div style="background:#161B2D; border-radius:12px; padding:12px; text-align:center; border:1px solid #1E293B;"><div style="font-size:0.6rem; color:#4A6A9A;">TEMP</div><div id="pro-temp" style="color:#EF4444; font-weight:bold; font-size:1.2rem; margin-top:4px;">--</div></div>
                    <div style="background:#161B2D; border-radius:12px; padding:12px; text-align:center; border:1px solid #1E293B;"><div style="font-size:0.6rem; color:#4A6A9A;">HUMID</div><div id="pro-humid" style="color:#60A5FA; font-weight:bold; font-size:1.2rem; margin-top:4px;">--</div></div>
                    <div style="background:#161B2D; border-radius:12px; padding:12px; text-align:center; border:1px solid #1E293B;"><div style="font-size:0.6rem; color:#4A6A9A;">LIGHT</div><div id="pro-light" style="color:#FBBF24; font-weight:bold; font-size:1.2rem; margin-top:4px;">--</div></div>
                    <div style="background:#161B2D; border-radius:12px; padding:12px; text-align:center; border:1px solid #1E293B;"><div style="font-size:0.6rem; color:#4A6A9A;">PH</div><div id="pro-ph" style="color:#34D399; font-weight:bold; font-size:1.2rem; margin-top:4px;">--</div></div>
                    <div style="background:#161B2D; border-radius:12px; padding:12px; text-align:center; border:1px solid #1E293B;"><div style="font-size:0.6rem; color:#4A6A9A;">WATER</div><div id="pro-water" style="color:#818CF8; font-weight:bold; font-size:1.2rem; margin-top:4px;">--</div></div>
                    <div style="background:#161B2D; border-radius:12px; padding:12px; text-align:center; border:1px solid #1E293B;"><div style="font-size:0.6rem; color:#4A6A9A;">GAS</div><div id="pro-gas" style="color:#A78BFA; font-weight:bold; font-size:1.2rem; margin-top:4px;">--</div></div>
                </div>

                <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:10px;">
                    <div class="com-feat" data-feature="whatif" style="background:#1E293B; border-radius:12px; padding:12px; text-align:center; cursor:pointer;">🔮<div style="font-size:0.6rem; color:#94A3B8; margin-top:4px;">What-If</div></div>
                    <div class="com-feat" data-feature="consumption" style="background:#1E293B; border-radius:12px; padding:12px; text-align:center; cursor:pointer;">⚡<div style="font-size:0.6rem; color:#94A3B8; margin-top:4px;">ESG</div></div>
                    <div class="com-feat" data-feature="alerts" style="background:#1E293B; border-radius:12px; padding:12px; text-align:center; cursor:pointer;">🚨<div style="font-size:0.6rem; color:#94A3B8; margin-top:4px;">Alerts</div></div>
                    <div class="com-feat" data-feature="control" style="background:#1E293B; border-radius:12px; padding:12px; text-align:center; cursor:pointer;">🎛️<div style="font-size:0.6rem; color:#94A3B8; margin-top:4px;">Control</div></div>
                </div>
            </div>

            <div class="bottom-nav" style="background:#0D1221; padding:12px; border-top:1px solid #1E293B; display:flex; justify-content:space-around;">
                <div class="nav-item active" data-screen="home" style="text-align:center; color:#60A5FA; cursor:pointer;"><div style="font-size:1.2rem;">🏠</div><div style="font-size:0.6rem; font-weight:bold; margin-top:2px;">HOME</div></div>
                <div class="nav-item" data-screen="profile" style="text-align:center; color:#4A6A9A; cursor:pointer;"><div style="font-size:1.2rem;">👤</div><div style="font-size:0.6rem; font-weight:bold; margin-top:2px;">PROFILE</div></div>
            </div>

        </div>
    `,m(),f()}function m(){const r=document.getElementById("profit-card");r&&r.addEventListener("click",()=>{clearInterval(i.proInterval),d("profit-detail")});const o=document.getElementById("energy-card");o&&o.addEventListener("click",()=>{clearInterval(i.proInterval),d("energy-detail")}),document.getElementById("comBackBtn").addEventListener("click",()=>{clearInterval(i.proInterval),d("farmlist")}),document.querySelectorAll(".com-feat").forEach(t=>{t.addEventListener("click",()=>{const e=t.getAttribute("data-feature");e==="whatif"?d("whatif-pro"):e==="control"?alert("Control panel coming soon!"):d("feature",{feature:e,from:"dash-c"})})}),document.querySelectorAll(".bottom-nav .nav-item").forEach(t=>{t.addEventListener("click",()=>{const e=t.getAttribute("data-screen");e==="profile"?(i.profileFrom="dash-c",d("profile")):e==="home"&&d("dash-c")})})}function f(){i.aiConsulted=!1;const r=async()=>{try{const t=await(await fetch("http://localhost:3000/api/sensors/latest?deviceId=farm_001")).json();if(!t||!t.reading)return;const e=t.reading,n=e.temperature||0,s=e.humidity||0,a=e.lightRaw||0,l=e.ph||0,p=e.waterDistanceCm||0,c=e.gasRaw||0,g=(a*.05).toFixed(2),v=(n*.9).toFixed(1);document.getElementById("pro-profit").innerText=`RM ${g}`,document.getElementById("pro-energy").innerText=`${v} kWh`,document.getElementById("pro-temp").innerText=`${n}°C`,document.getElementById("pro-humid").innerText=`${s}%`,document.getElementById("pro-light").innerText=`${a}`,document.getElementById("pro-ph").innerText=l,document.getElementById("pro-water").innerText=`${p}cm`,document.getElementById("pro-gas").innerText=c,i.aiConsulted||(x(e),i.aiConsulted=!0)}catch(o){console.error("Dashboard Sync Failed:",o)}};r(),i.proInterval=setInterval(r,3e3)}async function x(r){const o=`You are a farm owner's AI assistant. Current data: ${JSON.stringify(r)}. 
                    Briefly evaluate the current Profit and Energy efficiency in 1 very easy and short sentence (English).`;try{const e=await(await fetch("http://localhost:3000/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:o})})).json();document.getElementById("ai-overview-text").innerText=e.reply||e.response}catch{document.getElementById("ai-overview-text").innerText="AI Advisor offline."}}export{b as render};
