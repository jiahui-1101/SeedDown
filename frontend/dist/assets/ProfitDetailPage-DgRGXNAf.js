import{A as d,s as y}from"./index-DEjNUr0y.js";import"https://esm.sh/three@0.160.0";function A(){const t=document.getElementById("screenContainer");d.profitFormula||(d.profitFormula="temp * 2.5"),t.innerHTML=`
        <style>
            /* 1. 折线图动画 */
            .trend-path {
                fill: none; stroke: #38BDF8; stroke-width: 3;
                stroke-dasharray: 1000; stroke-dashoffset: 1000;
                animation: drawLine 2s ease forwards;
            }
            @keyframes drawLine { to { stroke-dashoffset: 0; } }

            .chart-point {
                fill: #38BDF8; stroke: #050810; stroke-width: 2; cursor: pointer; transition: all 0.2s;
            }
            .chart-point:hover { r: 8; fill: #FFFFFF; filter: drop-shadow(0 0 10px #38BDF8); }

            /* 2. Hover Tooltip (显示钱的小框) */
            #chart-tooltip {
                position: absolute; background: #1E293B; color: #38BDF8;
                padding: 6px 12px; border-radius: 8px; font-size: 0.75rem;
                font-weight: bold; border: 1px solid #38BDF8;
                pointer-events: none; opacity: 0; transition: opacity 0.2s;
                z-index: 1000; box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            }

            /* 3. Toast 成功提示弹窗 */
            #toast-msg {
                position: fixed; bottom: -60px; left: 50%; transform: translateX(-50%);
                background: #38BDF8; color: #050810; padding: 12px 24px;
                border-radius: 50px; font-weight: 800; font-size: 0.8rem;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index: 2000;
            }

            .formula-input {
                background: #161B2D; border: 1px solid #1E293B; color: #38BDF8;
                padding: 12px; border-radius: 12px; font-family: monospace; width: 100%; outline: none;
            }

            .record-card {
                background: rgba(22, 27, 45, 0.6); border: 1px solid #1E293B;
                padding: 16px; border-radius: 16px; margin-bottom: 12px;
                display: flex; justify-content: space-between; align-items: center;
            }
        </style>

        <div class="screen active" style="background:#050810; min-height:100vh; padding:20px; font-family:sans-serif; color:#E8F0FF; overflow-y:auto; position:relative;">
            
            <div style="text-align:center; margin-top:40px; margin-bottom:30px;">
                <div style="color:#4A6A9A; font-weight:800; font-size:0.75rem; letter-spacing:2px; margin-bottom:8px;">TOTAL PROFIT</div>
                <div style="display:flex; align-items:baseline; justify-content:center;">
                    <span id="detail-total-val" style="font-size:3.8rem; font-weight:900; color:#38BDF8; line-height:1;">--</span>
                    <span style="font-size:1.5rem; color:#60A5FA; margin-left:12px; font-weight:bold;">RM</span>
                </div>
            </div>

            <div style="background:rgba(56,189,248,0.05); border:1px solid rgba(56,189,248,0.2); border-radius:20px; padding:16px; margin-bottom:24px;">
                <div id="ai-short-advice" style="font-size:0.8rem; color:#E8F0FF; text-align:center; opacity:0.9;">
                    ✨ Advisor: Fetching telemetry data...
                </div>
            </div>

            <div style="background:#161B2D; border-radius:28px; padding:24px; border:1px solid #1E293B; margin-bottom:24px; position:relative;">
                <div style="color:#4A6A9A; font-weight:800; font-size:0.75rem; letter-spacing:1px; margin-bottom:20px;">HISTORICAL TREND</div>
                <div style="position:relative; height:160px; width:100%;">
                    <svg viewBox="0 0 400 150" style="width:100%; height:150px; overflow:visible;">
                        <path id="trend-line" class="trend-path" d="" />
                        <g id="trend-points"></g>
                    </svg>
                    <div id="chart-tooltip">RM 0.00</div>
                </div>
            </div>

            <div style="margin-bottom:30px;">
                <div style="color:#4A6A9A; font-weight:800; font-size:0.75rem; letter-spacing:1px; margin-bottom:16px;">RECENT REVENUE RECORDS</div>
                <div id="revenue-list"></div>
            </div>

            <div style="background:#161B2D; border-radius:24px; padding:20px; border:1px dashed #232D45; margin-bottom:50px;">
                <div style="color:#60A5FA; font-weight:bold; font-size:0.7rem; margin-bottom:10px;">⚙️ CALCULATION FORMULA</div>
                <input type="text" id="formulaInput" class="formula-input" value="${d.profitFormula}">
                <button id="saveFormulaBtn" style="width:100%; margin-top:16px; background:#38BDF8; color:#050810; border:none; padding:12px; border-radius:12px; font-weight:900; cursor:pointer;">UPDATE FORMULA</button>
            </div>

            <div id="profitBackBtn" style="position:absolute; top:20px; left:20px; width:38px; height:38px; background:#161B2D; border-radius:10px; display:flex; align-items:center; justify-content:center; border:1px solid #1E293B; cursor:pointer; z-index:100;">
                <span style="color:#60A5FA; font-weight:bold;">←</span>
            </div>

            <div id="toast-msg">Update Successful! 🚀</div>
        </div>
    `,x(),f()}function v(t){const e=document.getElementById("toast-msg");e.innerText=t,e.style.opacity="1",e.style.bottom="40px",setTimeout(()=>{e.style.opacity="0",e.style.bottom="-60px"},2e3)}function x(){document.getElementById("profitBackBtn").onclick=()=>y("dash-c"),document.getElementById("saveFormulaBtn").onclick=()=>{d.profitFormula=document.getElementById("formulaInput").value,v("Update Successful! 🚀"),f()}}function g(t,e){try{const o=t.temperature||t.temp||0,i=t.light||t.lightRaw||0,r=t.humidity||t.humid||0,s=t.ph||0,c=t.waterLevel||t.waterDistanceCm||0,p=t.gasValue||t.gasRaw||0,m=new Function("temp","light","humid","ph","water","gas",`return ${e}`)(o,i,r,s,c,p);return parseFloat(m).toFixed(2)}catch{return"0.00"}}async function f(){try{const t=["http://localhost:3000/api/sensors?limit=7&deviceId=farm_001","http://localhost:3000/api/sensors/history?limit=7&deviceId=farm_001"];let e=[];for(let o of t)try{const r=await(await fetch(o)).json();if(e=r.readings||r.history||(Array.isArray(r)?r:[]),e.length>0)break}catch{}if(e.length>0){const o=e[0];document.getElementById("detail-total-val").innerText=g(o,d.profitFormula);const i=document.getElementById("trend-line"),r=document.getElementById("trend-points"),s=document.getElementById("chart-tooltip"),c=[...e].reverse();let p="",m="";c.forEach((a,n)=>{const l=g(a,d.profitFormula),u=n*(400/(c.length-1)),h=150-Math.min(parseFloat(l),200)/200*120;p+=(n===0?"M ":" L ")+`${u} ${h}`,m+=`<circle cx="${u}" cy="${h}" r="4" class="chart-point" data-val="RM ${l}" />`}),i.setAttribute("d",p),r.innerHTML=m,document.querySelectorAll(".chart-point").forEach(a=>{a.addEventListener("mouseenter",n=>{s.innerText=n.target.getAttribute("data-val"),s.style.opacity="1";const l=parseFloat(n.target.getAttribute("cx")),u=parseFloat(n.target.getAttribute("cy"));s.style.left=l-30+"px",s.style.top=u-45+"px"}),a.addEventListener("mouseleave",()=>{s.style.opacity="0"})}),document.getElementById("revenue-list").innerHTML=e.map(a=>{const n=new Date(a.createdAt||Date.now()).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),l=g(a,d.profitFormula);return`
                    <div class="record-card">
                        <div><div style="font-weight:bold; font-size:0.9rem;">Revenue Record</div><div style="color:#4A6A9A; font-size:0.65rem;">Today, ${n}</div></div>
                        <div style="color:#38BDF8; font-weight:900; font-size:1.1rem;">+ RM ${l}</div>
                    </div>`}).join(""),b(e)}}catch(t){console.error("Fetch Error",t)}}async function b(t){const e=`Evaluate these 7 farm readings: ${JSON.stringify(t)}. 1 short English sentence about yield status.`;try{const i=await(await fetch("http://localhost:3000/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:e})})).json();document.getElementById("ai-short-advice").innerText="✨ Advisor: "+(i.reply||i.response)}catch{document.getElementById("ai-short-advice").innerText="✨ Advisor: System status optimal."}}export{A as render};
