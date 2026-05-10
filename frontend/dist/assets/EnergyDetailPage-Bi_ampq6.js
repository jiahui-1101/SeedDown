import{s as c}from"./index-CyZBRtAv.js";import"https://esm.sh/three@0.160.0";function h(){const i=document.getElementById("screenContainer");i.innerHTML=`
        <style>
            /* 柱状图基础样式 */
            .chart-bar {
                width: 10%;
                background: rgba(56, 189, 248, 0.2); 
                border-radius: 6px 6px 0 0;
                transition: height 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.3s;
                position: relative;
                cursor: pointer;
            }
            .chart-bar:hover {
                background: #38BDF8;
                box-shadow: 0 0 15px rgba(56, 189, 248, 0.5);
            }
            /* 柱状图顶部的数值提示 */
            .chart-bar::after {
                content: attr(data-value);
                position: absolute;
                top: -25px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 0.6rem;
                color: #38BDF8;
                font-weight: bold;
                opacity: 0;
                transition: opacity 0.3s;
            }
            .chart-bar:hover::after { opacity: 1; }
        </style>

        <div class="screen active" style="background:#050810; min-height:100vh; padding:20px; font-family:sans-serif; color:#E8F0FF; overflow-y:auto;">
            
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                <div style="display:flex; align-items:center; cursor:pointer;" id="profitBackBtn">
                    <span style="font-size:1.2rem; margin-right:12px; color:#60A5FA;">←</span>
                    <h2 style="margin:0; font-size:1.3rem; color:#E8F0FF;">Profit Analysis</h2>
                </div>
            </div>

            <div style="background:rgba(56,189,248,0.1); border:1px solid #38BDF8; border-radius:24px; padding:20px; margin-bottom:20px; box-shadow: 0 0 20px rgba(56,189,248,0.05);">
                <div style="display:flex; align-items:center; margin-bottom:10px;">
                    <span style="font-size:1.2rem; margin-right:8px;">✨</span>
                    <div style="color:#38BDF8; font-weight:800; font-size:0.75rem; letter-spacing:1px;">AI PROFIT INSIGHT</div>
                </div>
                <div id="ai-profit-text" style="font-size:0.85rem; line-height:1.6; color:#E8F0FF; opacity:0.9;">
                    AI is calculating your revenue potential...
                </div>
            </div>

            <div style="background:#161B2D; border-radius:24px; padding:24px; margin-bottom:20px; border:1px solid #1E293B;">
                <div style="color:#4A6A9A; font-weight:800; font-size:0.75rem; letter-spacing:1px; margin-bottom:8px;">TOTAL PROFIT (MAY 2026)</div>
                <div style="display:flex; align-items:baseline;">
                    <span id="detail-total-profit" style="font-size:3rem; font-weight:900; color:#38BDF8; line-height:1;">--</span>
                    <span style="font-size:1.2rem; color:#60A5FA; margin-left:8px; font-weight:bold;">RM</span>
                </div>
                <div id="profit-trend-label" style="font-size:0.8rem; color:#FFFFFF; font-weight:bold; margin-top:12px;">Syncing with Firebase...</div>
            </div>

            <div style="background:#161B2D; border-radius:24px; padding:24px; margin-bottom:20px; border:1px solid #1E293B;">
                <div style="color:#4A6A9A; font-weight:800; font-size:0.75rem; letter-spacing:1px; margin-bottom:25px;">WEEKLY PROFIT TREND</div>
                
                <div id="profit-bars-container" style="height:140px; display:flex; align-items:flex-end; justify-content:space-between; padding-bottom:10px; border-bottom:1px dashed #1E293B; margin-bottom:10px;">
                    </div>
                
                <div style="display:flex; justify-content:space-between; color:#4A6A9A; font-size:0.65rem; font-weight:bold;">
                    <span>Past Readings (Latest 7)</span>
                </div>
            </div>

            <div style="background:#161B2D; border-radius:24px; padding:24px; border:1px solid #1E293B;">
                <div style="color:#4A6A9A; font-weight:800; font-size:0.75rem; letter-spacing:1px; margin-bottom:20px;">HISTORICAL LOG</div>
                <div id="profit-list-container" style="display:flex; flex-direction:column; gap:16px;">
                    </div>
            </div>

        </div>
    `,p(),g()}function p(){document.getElementById("profitBackBtn").onclick=()=>c("dash-c")}async function g(){try{const t=(await(await fetch("http://localhost:3000/api/sensors/history?limit=7")).json()).history||[];if(t.length>0){const s=(t.reduce((e,o)=>e+(o.lightRaw||0),0)*.05).toFixed(2);document.getElementById("detail-total-profit").innerText=Number(s).toLocaleString(),document.getElementById("profit-trend-label").innerText="↑ +12.5% from last period";const d=document.getElementById("profit-bars-container");d.innerHTML=t.map(e=>{const o=(e.lightRaw*.05).toFixed(0);return`<div class="chart-bar" style="height: ${Math.min(e.lightRaw/4e3*100,100)}%" data-value="RM ${o}"></div>`}).join("");const l=document.getElementById("profit-list-container");l.innerHTML=t.map(e=>{const o=new Date(e.createdAt).toLocaleDateString("en-US",{month:"short",day:"2-digit"}),a=(e.lightRaw*.05).toFixed(2);return`
                    <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:12px; border-bottom:1px solid #1E293B;">
                        <div>
                            <div style="color:#E8F0FF; font-weight:bold; font-size:0.85rem;">${o}</div>
                            <div style="color:#4A6A9A; font-size:0.65rem;">Sensor Sync</div>
                        </div>
                        <div style="text-align:right;">
                            <div style="color:#38BDF8; font-weight:900;">+ RM ${a}</div>
                        </div>
                    </div>
                `}).join(""),await f(t)}}catch(i){console.error("Profit data sync failed:",i),document.getElementById("ai-profit-text").innerText="System offline. Check backend connection."}}async function f(i){const r=`
        You are a farm business analyst. 
        Based on these latest 7 sensor readings (lightRaw focus): ${JSON.stringify(i)}.
        Predict the profit trend and give one specific advice to increase yield.
        Answer in Chinese in 2 short sentences.
    `;try{const n=await(await fetch("http://localhost:3000/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:r})})).json();document.getElementById("ai-profit-text").innerText=n.reply||n.response||"AI Analysis complete."}catch{document.getElementById("ai-profit-text").innerText="AI Insight is currently unavailable."}}export{h as render};
