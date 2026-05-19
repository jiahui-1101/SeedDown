const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/FarmListPage-CX2jw3D4.js","assets/index-Ds7gPiVF.js","assets/index-7FoRf0sk.css","assets/firebase-BieXTIEc.js"])))=>i.map(i=>d[i]);
import{A as T,a as v,_ as vt}from"./index-Ds7gPiVF.js";import{saveFarmsToFirestore as yt}from"./firebase-BieXTIEc.js";import{C as ee}from"./CommercialFarmCanvas-Dw6EVHNT.js";import{j as bt}from"./jsQR-D51eeal7.js";import*as k from"https://esm.sh/three@0.160.0";import{OrbitControls as xt}from"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const me="user_farms",G=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;let b=1,y=null,x="realistic",re=null,ie=!1,I={serial:"SD-BGN-STD-00456",wifiSsid:"",wifiPassword:"",accountType:"beginner_standard"},d=null,E=["beginner_safe"],u=null,c={name:"",location:"",description:"",targetPlant:"",analysisGoal:"yield",rackType:"3-tier",customRack:null},S=[],f=null,M=["maximum_yield"],w=null,A={},O=[],L=null,pe=null;const Ae=[{id:"maximum_yield",label:"Maximum Yield"},{id:"profit_optimisation",label:"Profit Optimisation"},{id:"crop_safety_first",label:"Crop Safety First"},{id:"research_testing",label:"Research & Testing"},{id:"automation_first",label:"Automation First"},{id:"compliance_audit",label:"Compliance & Audit"}],wt=[{zone_id:"zone_A",name:"Zone A",recommended_type:"zone_node",crop:"Tomato / Chili / Basil",plants:["tomato","chili","basil"],confidence:.88,notes:"High-value crop area detected"},{zone_id:"zone_B",name:"Zone B",recommended_type:"zone_node",crop:"Lettuce",plants:["lettuce"],confidence:.82,notes:"Leafy green rack area detected"},{zone_id:"zone_C",name:"Zone C",recommended_type:"zone_node",crop:"Spinach",plants:["spinach"],confidence:.79,notes:"Standard greens area detected"}],de=[{id:"small",label:"Small Farm",standard:"1 grow room or pilot rack area",zones:"2 zones",area:"up to 30 m2",use:"SME trial, school lab, restaurant greens"},{id:"medium",label:"Medium Farm",standard:"several rack rows in one site",zones:"3 zones",area:"30-120 m2",use:"urban farm operator or institution"},{id:"large",label:"Large Farm",standard:"multi-room or high-density production floor",zones:"4 zones",area:"120+ m2",use:"commercial production with separate crop zones"}],se=[{id:"2-tier",label:"2-Tier Starter Rack",icon:"II",tiers:2,slotsPerTier:3,total:6,shape:"rack",desc:"compact shelf for desk or balcony trials"},{id:"3-tier",label:"3-Tier Vertical Rack",icon:"III",tiers:3,slotsPerTier:3,total:9,shape:"rack",desc:"balanced demo rack with 9 plant slots"},{id:"4-tier",label:"4-Tier Grow Shelf",icon:"IV",tiers:4,slotsPerTier:4,total:16,shape:"rack",desc:"larger home rack for mixed greens"},{id:"5-tier",label:"5-Tier Tower Rack",icon:"V",tiers:5,slotsPerTier:4,total:20,shape:"tower",desc:"tall structure with dense stacking"},{id:"wall",label:"Wall Panel Grid",icon:"GRID",tiers:4,slotsPerTier:5,total:20,shape:"wall",desc:"flat wall-mounted grow panel"},{id:"a-frame",label:"A-Frame Pyramid",icon:"A",tiers:4,slotsPerTier:4,total:16,shape:"aframe",desc:"slanted frame for two-sided access"},{id:"nft-channel",label:"NFT Channel Rows",icon:"NFT",tiers:3,slotsPerTier:6,total:18,shape:"channel",desc:"hydroponic channel layout for leafy crops"},{id:"hanging",label:"Hanging Column Farm",icon:"COL",tiers:5,slotsPerTier:3,total:15,shape:"column",desc:"vertical column pots for herbs and vines"}],kt=[{id:"yield",label:"Yield"},{id:"health",label:"Health"},{id:"space",label:"Space fit"}],Oe=[{id:"healthy_growth",label:"Healthy Growth"},{id:"eco_save",label:"Eco Save"},{id:"low_maintenance",label:"Low Maintenance"},{id:"fast_harvest",label:"Fast Harvest"},{id:"cost_efficient",label:"Cost Efficient"},{id:"beginner_safe",label:"Beginner Safe"}],Re=[{id:"beginner_starter",label:"Beginner Starter",serial:"SD-BGN-STR-00101",accountType:"beginner_starter",packageLevel:"starter",deviceType:"beginner",desc:"basic home sensor kit"},{id:"beginner_standard",label:"Beginner Standard",serial:"SD-BGN-STD-00456",accountType:"beginner_standard",packageLevel:"standard",deviceType:"beginner",desc:"balanced home vertical farm kit"},{id:"beginner_pro",label:"Beginner Pro",serial:"SD-BGN-PRO-00901",accountType:"beginner_pro",packageLevel:"pro",deviceType:"beginner",desc:"advanced home kit with more automation"},{id:"commercial_farm_master_1",label:"Commercial Farm Master Node 1",serial:"SD-COM-FRM-03001",accountType:"commercial_farm_master",packageLevel:"farm_master",deviceType:"commercial",desc:"farm-level controller, one per commercial farm"},{id:"commercial_farm_master_2",label:"Commercial Farm Master Node 2",serial:"SD-COM-FRM-03002",accountType:"commercial_farm_master",packageLevel:"farm_master",deviceType:"commercial",desc:"spare farm-level controller for demo or second farm"},{id:"commercial_farm_master_3",label:"Commercial Farm Master Node 3",serial:"SD-COM-FRM-03003",accountType:"commercial_farm_master",packageLevel:"farm_master",deviceType:"commercial",desc:"spare farm-level controller for demo or second farm"},{id:"commercial_farm_zone_1",label:"Commercial Farm + Zone Combo 1",serial:"SD-COM-FZK-02001",accountType:"commercial_farm_zone",packageLevel:"farm_zone",deviceType:"commercial",desc:"combo commercial node for farm or zone assignment"},{id:"commercial_farm_zone_2",label:"Commercial Farm + Zone Combo 2",serial:"SD-COM-FZK-02002",accountType:"commercial_farm_zone",packageLevel:"farm_zone",deviceType:"commercial",desc:"combo commercial node for farm or zone assignment"},{id:"commercial_farm_zone_3",label:"Commercial Farm + Zone Combo 3",serial:"SD-COM-FZK-02003",accountType:"commercial_farm_zone",packageLevel:"farm_zone",deviceType:"commercial",desc:"combo commercial node for farm or zone assignment"},{id:"commercial_zone_1",label:"Commercial Zone Node 1",serial:"SD-COM-ZON-01001",accountType:"commercial_zone",packageLevel:"zone_node",deviceType:"commercial",desc:"zone-level sensor and actuator node"},{id:"commercial_zone_2",label:"Commercial Zone Node 2",serial:"SD-COM-ZON-01002",accountType:"commercial_zone",packageLevel:"zone_node",deviceType:"commercial",desc:"zone-level sensor and actuator node"},{id:"commercial_zone_3",label:"Commercial Zone Node 3",serial:"SD-COM-ZON-01003",accountType:"commercial_zone",packageLevel:"zone_node",deviceType:"commercial",desc:"zone-level sensor and actuator node"},{id:"commercial_zone_4",label:"Commercial Zone Node 4",serial:"SD-COM-ZON-01004",accountType:"commercial_zone",packageLevel:"zone_node",deviceType:"commercial",desc:"zone-level sensor and actuator node"},{id:"commercial_zone_5",label:"Commercial Zone Node 5",serial:"SD-COM-ZON-01005",accountType:"commercial_zone",packageLevel:"zone_node",deviceType:"commercial",desc:"zone-level sensor and actuator node"},{id:"commercial_zone_basic",label:"Legacy Commercial Zone Node",serial:"SD-COM-ZNB-01001",accountType:"commercial_zone_basic",packageLevel:"zone_basic",deviceType:"commercial",desc:"legacy zone-level node, still supported"},{id:"commercial_zone_pro",label:"Legacy Commercial Zone Node Pro",serial:"SD-COM-ZNP-02001",accountType:"commercial_zone_pro",packageLevel:"zone_pro",deviceType:"commercial",desc:"legacy expanded zone-level node, still supported"},{id:"commercial_master",label:"Legacy Commercial Farm Master",serial:"SD-COM-MST-03001",accountType:"commercial_master",packageLevel:"farm_master",deviceType:"commercial",desc:"legacy master node for multi-zone farms"}],Ie={starter:{label:"Starter",thresholdKeys:["tempMin","tempMax","humidityMin","humidityMax","soilDryThreshold","darkThreshold","wateringDurationSeconds","sensorIntervalSeconds"],lockedText:"Unlock with Standard / Pro"},standard:{label:"Standard",thresholdKeys:["tempMin","tempMax","humidityMin","humidityMax","soilDryThreshold","darkThreshold","phMin","phMax","gasDangerThreshold","wateringDurationSeconds","fanDurationSeconds","sensorIntervalSeconds"],lockedText:"Unlock with Pro"},pro:{label:"Pro",thresholdKeys:["tempMin","tempMax","humidityMin","humidityMax","soilDryThreshold","darkThreshold","phMin","phMax","ecMin","ecMax","co2MinPpm","gasDangerThreshold","waterLowCm","wateringDurationSeconds","fanDurationSeconds","sensorIntervalSeconds"],lockedText:""}},oe={lettuce:"🥬",spinach:"🌿",basil:"🌿",tomato:"🍅",carrot:"🥕",cabbage:"🥬",eggplant:"🍆",mint:"🌿",kale:"🥬",cucumber:"🥒",pepper:"🌶️",chili:"🌶️",strawberry:"🍓",bean:"🫘",pea:"🟢",chard:"🥬",arugula:"🌿",radish:"🌱",cilantro:"🌿",parsley:"🌿"};function La(){var a,n;b=1,y=null,x="realistic",ie=!1;const e=Q();I=e?{serial:"SD-COM-FRM-03001",wifiSsid:"",wifiPassword:"",accountType:"commercial_farm_master"}:{serial:"SD-BGN-STD-00456",wifiSsid:"",wifiPassword:"",accountType:"beginner_standard"},d=null,E=e?["maximum_yield"]:["beginner_safe"],u=null,c={name:"",location:"",description:"",targetPlant:"",analysisGoal:"yield",rackType:e?"medium":"3-tier",customRack:null},S=[],f=null,M=["maximum_yield"],w=null,A={},O=[],L=null,pe=e?`farm_com_${Date.now()}`:null,X(),(n=(a=ee).destroy)==null||n.call(a);const t=document.getElementById("screenContainer");t.innerHTML=`
        <div class="screen active" id="buildFarmScreen"
             style="display:flex;flex-direction:column;height:100vh;overflow:hidden;background:var(--bg);">
            <div class="topbar" style="flex-shrink:0;">
                <button id="bfBack" aria-label="Back"
                    style="background:none;border:none;font-size:22px;cursor:pointer;padding:4px 8px;color:var(--text);line-height:1;">←</button>
                <div>
                    <div style="font-weight:800;font-size:16px;">${Q()?"New Commercial Farm":"New Beginner Field"}</div>
                    <div style="font-size:11px;color:var(--muted);margin-top:1px;">${Q()?"AI zoning to device assignment and launch":"single-field QR setup, photo structure scan, and 3D preview"}</div>
                </div>
                <div style="width:40px;"></div>
            </div>

            <div id="bfSteps" style="flex-shrink:0;padding:12px 20px 0;"></div>
            <div id="bfContent" style="flex:1;overflow-y:auto;padding:16px;-webkit-overflow-scrolling:touch;"></div>
                        <div style="flex-shrink:0;padding:12px 16px 32px;background:var(--bg);border-top:1px solid var(--border);display:grid;grid-template-columns:0.82fr 1.18fr;gap:10px;">
                <button id="bfCancel"
                    style="padding:15px;border:1.5px solid var(--border);border-radius:12px;background:var(--surface2);color:var(--text);font-size:14px;font-weight:800;cursor:pointer;">
                    Cancel
                </button>
                <button id="bfNext"
                    style="padding:15px;border:none;border-radius:12px;background:var(--accent);color:#fff;font-size:15px;font-weight:800;cursor:pointer;">
                    Continue
                </button>
            </div>
        </div>
    `,document.getElementById("bfBack").addEventListener("click",ha),document.getElementById("bfCancel").addEventListener("click",dt),document.getElementById("bfNext").addEventListener("click",fa),C()}function C(){var n,o;if(Q()){St();return}Ge();const e=document.getElementById("bfContent"),t=document.getElementById("bfCancel"),a=document.getElementById("bfNext");e.innerHTML="",X(),(o=(n=ee).destroy)==null||o.call(n),b===1&&(Kt(e),t.textContent="Cancel",a.textContent=d?"Next: Field Info":"Scan QR"),b===2&&(ta(e),t.textContent="Back",a.textContent="Next: Add Photo"),b===3&&(at(e),t.textContent="Back",a.textContent="Next: AI Thresholds"),b===4&&(rt(e),t.textContent="Back",a.textContent=u?"Next: 3D Preview":"Generate Thresholds"),b===5&&(ot(e),t.textContent="Preview Only",a.textContent="Create Field")}function St(){Ge();const e=document.getElementById("bfContent"),t=document.getElementById("bfCancel"),a=document.getElementById("bfNext");e.innerHTML="",X(),b===1&&(zt(e),t.textContent="Cancel",a.textContent="Next: Analyze Farm"),b===2&&(Mt(e),t.textContent="Back",a.textContent=f?"Confirm Structure":"Analyze Zones"),b===3&&(je(e),t.textContent="Back",a.textContent="Next: Zone Thresholds"),b===4&&(Ze(e),t.textContent="Back",a.textContent=Ve()?"Next: Assign Devices":"Generate Zone Thresholds"),b===5&&($t(e),t.textContent="Back",a.textContent=Xe()?"Next: Farm Overview":"Scan Device QR"),b===6&&(Tt(e),t.textContent="Back",a.textContent="Launch Farm")}function Ge(){const e=Q()?["Farm","Zones","Goals","Thresholds","Devices","Launch"]:["Device","Field","Photo","Goals","3D"];document.getElementById("bfSteps").innerHTML=`
        <div style="display:grid;grid-template-columns:repeat(${e.length},1fr);gap:6px;padding-bottom:10px;">
            ${e.map((t,a)=>{const n=a+1<=b;return`
                    <div style="display:flex;align-items:center;gap:6px;min-width:0;">
                        <div style="width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;
                                    background:${n?"var(--accent)":"var(--border)"};
                                    color:${n?"#fff":"var(--muted)"};
                                    font-size:10px;font-weight:800;flex-shrink:0;">
                            ${a+1<b?"✓":a+1}
                        </div>
                        <div style="font-size:10px;font-weight:800;color:${a+1===b?"var(--accent)":"var(--muted)"};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                            ${t}
                        </div>
                    </div>
                `}).join("")}
        </div>
    `}function zt(e){const t=_t();e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">COMMERCIAL FARM INFO</div>
                ${te("fieldNameInput","Farm name","e.g. SeedDown Commercial Farm 1",c.name)}
                ${te("fieldLocationInput","Location","e.g. Johor Bahru Industrial Park",c.location)}
                <div style="margin-bottom:10px;">
                    <div style="font-size:11px;font-weight:800;color:var(--sub);margin-bottom:8px;">Farm size standard</div>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        ${de.map(a=>Ct(a)).join("")}
                    </div>
                    <div style="margin-top:9px;padding:10px;border-radius:12px;background:var(--surface2);border:1px solid var(--border);font-size:11px;color:var(--muted);line-height:1.45;">
                        Selected: <strong style="color:var(--text);">${m(t.label)}</strong> · ${m(t.standard)} · ${m(t.area)} · recommended ${m(t.zones)}.
                    </div>
                </div>
                <label style="display:block;margin-bottom:10px;">
                    <span style="display:block;font-size:11px;font-weight:800;color:var(--sub);margin-bottom:5px;">Description</span>
                    <textarea id="fieldDescriptionInput" placeholder="Optional notes about this commercial farm"
                        style="width:100%;min-height:92px;resize:vertical;padding:11px 12px;border:1.5px solid var(--border);border-radius:10px;background:var(--surface2);color:var(--text);font-size:14px;outline:none;line-height:1.4;">${m(c.description)}</textarea>
                </label>
                <div style="font-size:12px;color:var(--muted);line-height:1.45;">
                    Commercial setup analyzes the farm space first, then assigns QR devices to the right zones.
                </div>
            </section>
        </div>
    `,W("fieldNameInput",a=>{c.name=a}),W("fieldLocationInput",a=>{c.location=a}),W("fieldDescriptionInput",a=>{c.description=a}),document.querySelectorAll(".commercial-size-card").forEach(a=>{a.addEventListener("click",()=>{c.rackType=a.dataset.size||"medium",f=null,C()})})}function Ct(e){const t=(c.rackType||"medium")===e.id;return`
        <button type="button" class="commercial-size-card" data-size="${e.id}"
            style="text-align:left;padding:12px;border-radius:13px;border:1.5px solid ${t?"var(--accent)":"var(--border)"};background:${t?"var(--accent-l)":"var(--surface2)"};color:var(--text);cursor:pointer;">
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;">
                <strong style="font-size:13px;color:${t?"var(--accent)":"var(--text)"};">${m(e.label)}</strong>
                <span style="font-size:10px;font-weight:900;color:${t?"var(--accent)":"var(--muted)"};">${t?"SELECTED":m(e.zones)}</span>
            </div>
            <div style="font-size:11px;color:var(--muted);line-height:1.4;margin-top:5px;">${m(e.standard)} · ${m(e.area)}</div>
            <div style="font-size:10px;color:var(--sub);line-height:1.35;margin-top:4px;">Best for: ${m(e.use)}</div>
        </button>
    `}function _t(){return de.find(e=>e.id===(c.rackType||"medium"))||de[1]}function Mt(e){var a,n,o;const t=(f==null?void 0:f.zones)||[];e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:12px;">
                    <div>
                        <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;">FULL FARM PHOTO</div>
                        <div style="font-size:12px;color:var(--muted);margin-top:4px;">Capture all racks or visible production areas before QR assignment.</div>
                    </div>
                    <div style="font-size:11px;font-weight:800;color:var(--accent);white-space:nowrap;">${y?"READY":"NEEDED"}</div>
                </div>
                <div id="photoPreview"
                     style="width:100%;height:220px;border-radius:12px;border:2px dashed ${y?"var(--accent)":"var(--border)"};
                            background:${y?`url(${y.dataUrl}) center/cover`:"var(--surface2)"};
                            display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;position:relative;">
                    ${y?'<div style="position:absolute;bottom:10px;right:10px;background:rgba(0,0,0,.58);color:white;padding:6px 10px;border-radius:8px;font-size:11px;font-weight:800;">Farm photo loaded</div>':`
                        <div style="text-align:center;color:var(--muted);">
                            <div style="font-size:36px;margin-bottom:8px;">▣</div>
                            <div style="font-size:13px;font-weight:800;">Tap to add commercial farm photo</div>
                            <div style="font-size:11px;margin-top:4px;">wide photo works best</div>
                        </div>
                    `}
                </div>
                <input type="file" id="photoInput" accept="image/*" style="display:none;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;">
                    <button id="cameraBtn" style="padding:11px;border:1px solid var(--border);border-radius:10px;background:var(--surface2);font-weight:800;color:var(--text);cursor:pointer;">Camera</button>
                    <button id="galleryBtn" style="padding:11px;border:1px solid var(--border);border-radius:10px;background:var(--surface2);font-weight:800;color:var(--text);cursor:pointer;">Gallery</button>
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:12px;">
                    <div>
                        <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;">AI ZONE STRUCTURE</div>
                        <div style="font-size:12px;color:var(--muted);margin-top:4px;">AI recommends production zones and node assignment before QR scanning.</div>
                    </div>
                    <button id="analyzeCommercialZonesBtn" ${y?"":"disabled"}
                        style="padding:8px 10px;border-radius:999px;border:1px solid ${y?"var(--accent)":"var(--border)"};background:${y?"var(--accent-l)":"var(--surface2)"};color:${y?"var(--accent)":"var(--muted)"};font-size:11px;font-weight:900;cursor:${y?"pointer":"not-allowed"};">Analyze</button>
                </div>
                <div id="commercialZoneSummary">${Pt()}</div>
                ${t.length?`
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px;">
                        <button id="addCommercialZoneBtn" style="padding:11px;border:1px solid var(--border);border-radius:10px;background:var(--surface2);color:var(--text);font-weight:800;cursor:pointer;">Add Zone</button>
                        <button id="removeCommercialZoneBtn" style="padding:11px;border:1px solid rgba(220,38,38,.24);border-radius:10px;background:rgba(220,38,38,.08);color:var(--danger);font-weight:800;cursor:pointer;">Remove Last</button>
                    </div>
                `:""}
            </section>
        </div>
    `,nt(e),(a=document.getElementById("analyzeCommercialZonesBtn"))==null||a.addEventListener("click",Ue),(n=document.getElementById("addCommercialZoneBtn"))==null||n.addEventListener("click",()=>{F();const r=f.zones.length;f.zones.push({zone_id:`zone_${String.fromCharCode(65+r)}`,name:`Zone ${String.fromCharCode(65+r)}`,recommended_type:"zone_node",crop:"Mixed Crops",plants:["lettuce"],confidence:.7,notes:"Manually added zone"}),f.total_devices_needed=f.farm_master_count+f.zones.length,C()}),(o=document.getElementById("removeCommercialZoneBtn"))==null||o.addEventListener("click",()=>{var r;((r=f==null?void 0:f.zones)==null?void 0:r.length)>1&&(f.zones.pop(),f.total_devices_needed=f.farm_master_count+f.zones.length,C())})}function je(e){e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">COMMERCIAL FARM GOALS</div>
                <div style="font-size:12px;color:var(--muted);line-height:1.45;margin-bottom:12px;">Select up to three commercial priorities. These are applied per zone when generating thresholds.</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    ${Ae.map(t=>{const a=M.includes(t.id);return`<button class="commercial-goal-priority" data-id="${t.id}"
                            style="padding:12px 8px;border-radius:12px;border:1.5px solid ${a?"var(--accent)":"var(--border)"};background:${a?"var(--accent-l)":"var(--surface2)"};color:${a?"var(--accent)":"var(--text)"};font-weight:900;font-size:12px;cursor:pointer;">${t.label}</button>`}).join("")}
                </div>
            </section>
        </div>
    `,document.querySelectorAll(".commercial-goal-priority").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.id;M.includes(a)?M=M.filter(n=>n!==a):M.length<3?M=[...M,a]:v("warning","Choose up to 3 commercial goals"),w=null,A={},je(e)})})}function Ze(e){var t;F(),e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:12px;">
                    <div>
                        <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;">ZONE PLANTS + THRESHOLDS</div>
                        <div style="font-size:12px;color:var(--muted);margin-top:4px;">Farm Master gets safety thresholds. Each zone gets its own crop recipe.</div>
                    </div>
                    <button id="generateCommercialThresholdsBtn" style="padding:8px 10px;border-radius:999px;border:1px solid var(--accent);background:var(--accent-l);color:var(--accent);font-size:11px;font-weight:900;cursor:pointer;">Generate All</button>
                </div>
                <div style="display:flex;flex-direction:column;gap:10px;">
                    ${Nt()}
                    ${f.zones.map(Dt).join("")}
                </div>
            </section>
        </div>
    `,document.querySelectorAll(".zone-plant-input").forEach(a=>{a.addEventListener("change",n=>{const o=f.zones.find(r=>r.zone_id===n.target.dataset.zone);o&&(Wt(o,Qt(n.target.value)),w=null,delete A[o.zone_id],Ze(e))})}),document.querySelectorAll(".commercial-threshold-input").forEach(a=>{a.addEventListener("input",n=>{const o=n.target.dataset.zone,r=n.target.dataset.key,l=n.target.value===""?void 0:Number(n.target.value);if(!o||!r||!Number.isFinite(l))return;if(o==="farm_master"){w||(w={thresholds:{},notes:"Manual farm-level threshold adjustment",source:"manual"}),w.thresholds[r]=l;const g=Le(r,l),h=document.getElementById("commercialSafety_farm_master");h&&(h.textContent=g||"",h.style.display=g?"block":"none"),g&&v("warning",g);return}A[o]||(A[o]={thresholds:{},notes:"Manual commercial threshold adjustment",source:"manual"}),A[o].thresholds[r]=l;const s=Le(r,l),i=document.getElementById(`commercialSafety_${o}`);i&&(i.textContent=s||"",i.style.display=s?"block":"none"),s&&v("warning",s)})}),(t=document.getElementById("generateCommercialThresholdsBtn"))==null||t.addEventListener("click",Ke)}function $t(e){var a;F(),e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">ASSIGN QR DEVICES</div>
                <div style="font-size:12px;color:var(--muted);line-height:1.45;margin-bottom:12px;">
                    Scan one package QR at a time. The app will only enable compatible assignment targets.
                </div>
                <button id="commercialScanQrBtn" type="button" style="width:100%;padding:13px;border:none;border-radius:14px;background:var(--accent);color:white;font-size:14px;font-weight:900;cursor:pointer;">
                    Scan Commercial Device QR
                </button>
                <input id="commercialDeviceQrInput" type="file" accept="image/*" capture="environment" style="display:none;">
                <div id="commercialPendingDevice" style="margin-top:12px;">${Bt()}</div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">ASSIGNMENT PROGRESS</div>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    ${At()}
                </div>
            </section>
        </div>
    `;const t=document.getElementById("commercialDeviceQrInput");(a=document.getElementById("commercialScanQrBtn"))==null||a.addEventListener("click",()=>t==null?void 0:t.click()),t==null||t.addEventListener("change",n=>{var r;const o=(r=n.target.files)==null?void 0:r[0];o&&Ot(o),n.target.value=""}),document.querySelectorAll(".commercial-assign-target").forEach(n=>{n.addEventListener("click",()=>Gt(n.dataset.target))})}function Tt(e){F(),setTimeout(It,80),e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:var(--shadow-sm);">
                <div style="padding:12px 14px;border-bottom:1px solid var(--border);">
                    <div style="font-size:14px;font-weight:900;">Commercial Digital Twin Preview</div>
                    <div style="font-size:11px;color:var(--muted);margin-top:2px;">Farm Master + zone nodes mapped into the commercial 3D facility</div>
                </div>
                <div class="commercial-preview-host" style="height:min(58dvh,520px);min-height:360px;position:relative;background:#f8faf7;overflow:hidden;">
                    <canvas id="commercialPreviewCanvas" style="width:100%;height:100%;display:block;"></canvas>
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">LAUNCH SUMMARY</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                    ${R("Farm",c.name||"Commercial Farm")}
                    ${R("Zones",`${f.zones.length}`)}
                    ${R("Devices",`${O.length}/${f.total_devices_needed}`)}
                    ${R("Goals",M.map(et).join(", "))}
                </div>
            </section>
        </div>
    `}function It(){var a,n;if(!document.getElementById("commercialPreviewCanvas"))return;const t=Lt();T.currentFarm=t,T.currentFarmId=t.id,T.mode="commercial",ee.init("commercialPreviewCanvas",t),(n=(a=ee).setCameraFrame)==null||n.call(a,!1)}function Lt(){F();const e=f.zones||[],t=[];return e.forEach((a,n)=>{U(a).forEach((r,l)=>{t.push({name:r.name,species:String(r.name).toLowerCase().replace(/[^a-z0-9]+/g,"_"),slots:r.count,zoneId:a.zone_id,zoneName:a.name,slotIndex:n+l*Math.max(1,e.length),status:A[a.zone_id]?"healthy":"warning"})})}),{id:`commercial_preview_${Date.now()}`,name:c.name||"Commercial Farm Preview",accountMode:"commercial",rackTypeId:"5-tier",rackType:"Commercial Digital Twin",rackLabel:`${e.length||3}-Zone Commercial Facility`,targetPlant:e.map(a=>a.crop).filter(Boolean).join(", ")||"Commercial crops",plantSlots:Math.max(20,t.reduce((a,n)=>a+(n.slots||1),0)),plants:t,zones:e,commercialStructure:f,commercialDevices:O,createdAt:new Date().toISOString()}}function Pt(){return f?`
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
            ${R("Farm Master",f.farm_master_count)}
            ${R("ESP32 Needed",f.total_devices_needed)}
            ${R("Zones",f.zones.length)}
            ${R("Confidence",`${Math.round((f.confidence||.82)*100)}%`)}
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;">
            ${f.zones.map(e=>`
                <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px;">
                    <div style="min-width:0;">
                        <div style="font-size:13px;font-weight:900;">${m(e.name)} · ${m(e.crop||"Mixed Crops")}</div>
                        <div style="font-size:11px;color:var(--muted);margin-top:3px;">${m(e.notes||"")}</div>
                        <div style="font-size:10px;color:var(--sub);margin-top:5px;line-height:1.35;">${m(U(e).map(t=>`${t.name} x ${t.count}`).join(" · "))}</div>
                    </div>
                    <span style="padding:5px 8px;border-radius:999px;background:var(--accent-l);color:var(--accent);font-size:10px;font-weight:900;white-space:nowrap;">${Je(e)} plants</span>
                </div>
            `).join("")}
        </div>
    `:`
            <div style="padding:22px;border:1px dashed var(--border);border-radius:12px;background:var(--surface2);text-align:center;color:var(--muted);font-size:13px;line-height:1.45;">
                Add a farm photo, then run AI zone analysis. If AI is unavailable, SeedDown will use a safe commercial fallback.
            </div>
        `}function Nt(){const e=(w==null?void 0:w.thresholds)||{};return`
        <div style="background:linear-gradient(135deg,var(--accent-l),#fff);border:1.5px solid rgba(22,163,74,.22);border-radius:14px;padding:12px;">
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:10px;">
                <div>
                    <div style="font-size:13px;font-weight:900;color:var(--accent);">Farm Master Node</div>
                    <div style="font-size:10px;color:var(--muted);margin-top:3px;">Farm-level safety policy · shared emergency and monitoring thresholds</div>
                </div>
                <span style="font-size:10px;font-weight:900;color:${w?"var(--accent)":"var(--muted)"};">${w?"READY":"PENDING"}</span>
            </div>
            <div id="commercialSafety_farm_master" style="display:none;margin-bottom:10px;padding:8px 10px;border-radius:10px;background:rgba(245,158,11,.12);color:#b45309;font-size:11px;font-weight:800;line-height:1.35;"></div>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:12px;">
                ${He({zone_id:"farm_master"},e,"farm")}
            </div>
            <div style="padding:11px;border-radius:12px;background:rgba(255,255,255,.76);border:1px solid rgba(22,163,74,.14);">
                <div style="font-size:10px;font-weight:900;color:var(--sub);letter-spacing:.08em;margin-bottom:6px;">AI ANALYSIS</div>
                <div style="font-size:11px;color:var(--muted);line-height:1.55;">
                    ${Qe({name:"Farm Master Node",plants:We(),crop:"whole farm"},w,"farm")}
                </div>
            </div>
        </div>
    `}function Dt(e){const t=A[e.zone_id],a=Ht(U(e)),n=(t==null?void 0:t.thresholds)||{};return`
        <div style="background:var(--surface2);border:1px solid var(--border);border-radius:14px;padding:12px;">
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:10px;">
                <div>
                    <div style="font-size:13px;font-weight:900;">${m(e.name)}</div>
                    <div style="font-size:10px;color:var(--muted);margin-top:3px;">Zone-level recipe · editable sensor and output thresholds</div>
                </div>
                <span style="font-size:10px;font-weight:900;color:${t?"var(--accent)":"var(--muted)"};">${t?"READY":"PENDING"}</span>
            </div>
            <label style="display:block;margin-bottom:10px;">
                <span style="display:block;font-size:10px;font-weight:900;color:var(--sub);letter-spacing:.06em;text-transform:uppercase;margin-bottom:5px;">Detected plants in this zone</span>
                <textarea class="zone-plant-input" data-zone="${e.zone_id}" placeholder="tomato x 8&#10;lettuce x 12"
                    style="width:100%;min-height:82px;resize:vertical;padding:10px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:var(--text);font-size:13px;outline:none;line-height:1.45;">${m(a)}</textarea>
                <span style="display:block;font-size:10px;color:var(--muted);margin-top:4px;">Use one line per plant. Example: cucumber x 6. The 3D twin uses these counts directly.</span>
            </label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
                ${Pe("Detected count",`${Je(e)} plants`)}
                ${Pe("3D source","zone scan")}
            </div>
            <div id="commercialSafety_${e.zone_id}" style="display:none;margin-bottom:10px;padding:8px 10px;border-radius:10px;background:rgba(245,158,11,.12);color:#b45309;font-size:11px;font-weight:800;line-height:1.35;"></div>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:12px;">
                ${He(e,n,"zone")}
            </div>
            <div style="padding:11px;border-radius:12px;background:var(--surface);border:1px solid var(--border);">
                <div style="font-size:10px;font-weight:900;color:var(--sub);letter-spacing:.08em;margin-bottom:6px;">AI ANALYSIS</div>
                <div style="font-size:11px;color:var(--muted);line-height:1.5;">
                    ${Qe(e,t,"zone")}
                </div>
            </div>
        </div>
    `}function He(e,t={},a="zone"){return(a==="farm"?Et():Ft()).map(({key:o,label:r,unit:l,placeholder:s})=>`
        <label style="display:block;">
            <span style="display:block;font-size:10px;font-weight:900;color:var(--sub);margin-bottom:4px;text-transform:uppercase;">${m(r)}</span>
            <input class="commercial-threshold-input" data-zone="${e.zone_id}" data-key="${o}" type="number"
                value="${t[o]??""}" placeholder="${t[o]===void 0?s||"generate":""}"
                style="width:100%;padding:10px;border:1px solid var(--border);border-radius:10px;background:var(--surface);font-size:13px;font-weight:800;color:var(--text);outline:none;">
            ${l?`<span style="display:block;font-size:9px;color:var(--muted);margin-top:3px;">${m(l)}</span>`:""}
        </label>
    `).join("")}function Et(){return[{key:"co2MinPpm",label:"CO2 min",unit:"CO2 Sensor · ppm",placeholder:"800"},{key:"co2MaxPpm",label:"CO2 max",unit:"CO2 Sensor · ppm",placeholder:"1500"},{key:"waterLowCm",label:"Reservoir low",unit:"HC-SR04 · cm distance",placeholder:"20"},{key:"waterCriticalCm",label:"Reservoir critical",unit:"HC-SR04 · cm distance",placeholder:"35"},{key:"gasDangerThreshold",label:"Gas danger",unit:"MQ-2 raw limit",placeholder:"3000"},{key:"energyDailyLimitKwh",label:"Energy limit",unit:"Power Meter · kWh/day",placeholder:"8"},{key:"mainFanDurationSeconds",label:"Main fan sec",unit:"Main Ventilation Fan output",placeholder:"20"},{key:"emergencyBuzzerSeconds",label:"Emergency buzz sec",unit:"Emergency Buzzer output",placeholder:"10"},{key:"sensorIntervalSeconds",label:"Farm poll sec",unit:"Farm master telemetry interval",placeholder:"300"}]}function Ft(){return[{key:"tempMin",label:"Temp min",unit:"DHT11 · °C",placeholder:"18"},{key:"tempMax",label:"Temp max",unit:"DHT11 · °C",placeholder:"28"},{key:"humidityMin",label:"Humid min",unit:"DHT11 · %RH",placeholder:"50"},{key:"humidityMax",label:"Humid max",unit:"DHT11 · %RH",placeholder:"80"},{key:"soilDryThreshold",label:"Soil dry",unit:"Soil Moisture raw",placeholder:"2500"},{key:"darkThreshold",label:"Light dark",unit:"LDR raw",placeholder:"1500"},{key:"phMin",label:"pH min",unit:"pH Sensor",placeholder:"5.8"},{key:"phMax",label:"pH max",unit:"pH Sensor",placeholder:"6.8"},{key:"ecMin",label:"EC min",unit:"EC Sensor · mS/cm",placeholder:"1.2"},{key:"ecMax",label:"EC max",unit:"EC Sensor · mS/cm",placeholder:"2.0"},{key:"waterFlowMinLpm",label:"Flow min",unit:"YF-S201 · L/min",placeholder:"0.5"},{key:"wateringDurationSeconds",label:"Pump sec",unit:"Water Pump output",placeholder:"10"},{key:"growLightDurationSeconds",label:"Grow light sec",unit:"LED Grow Light output",placeholder:"30"},{key:"zoneFanDurationSeconds",label:"Zone fan sec",unit:"Zone Fan output",placeholder:"15"},{key:"activeBuzzerSeconds",label:"Alert buzz sec",unit:"Active Buzzer output",placeholder:"5"},{key:"cameraScanIntervalMinutes",label:"Camera scan min",unit:"Camera analysis interval",placeholder:"60"},{key:"diseaseConfidenceMin",label:"Disease confidence",unit:"Camera AI threshold · %",placeholder:"70"}]}function Qe(e,t,a="zone"){const n=M.map(et).join(", ")||"Commercial optimisation",o=U(e).map(h=>`${h.name} x ${h.count}`).join(", ")||e.crop||"mixed crops",r=a==="farm"?"the whole farm":e.name;if(!t)return`Generate thresholds to explain recommended sensor ranges, safety limits, and actuator timing for ${m(r)}. SeedDown will use the selected commercial goals, detected crops, and available device package to decide which thresholds should be active. Plants: ${m(o)}. Goals: ${m(n)}.`;const l=t.source==="ai"?"AI provider":t.source==="fallback"?"deterministic fallback":"manual edit",s=M.includes("profit_optimisation")?"Because profit optimisation is selected, the recipe avoids over-watering and long fan or light cycles unless readings show real risk.":M.includes("maximum_yield")?"Because maximum yield is selected, the recipe keeps the crop closer to its ideal growth band instead of only reacting at emergency levels.":M.includes("compliance_audit")?"Because compliance and audit is selected, the recipe keeps conservative sensor intervals and clearer safety boundaries for traceable operation.":"Because commercial operation is selected, the recipe balances crop health, automation cost, and operational safety.",i=a==="farm"?"Farm-level thresholds only cover shared infrastructure: CO2, reservoir depth from HC-SR04, MQ-2 gas, power meter consumption, main ventilation fan, and the emergency buzzer. These values protect the whole site even when each zone has a different crop recipe.":`Zone-level thresholds only cover independent growing zones: DHT11 temperature and humidity, soil moisture, LDR light, pH, EC, YF-S201 water flow, pump duration, grow light timing, zone fan timing, active buzzer warning, and camera scan confidence for ${m(o)}.`,g=t.notes||(a==="farm"?"Farm-level thresholds generated for master safety control.":"Thresholds generated for this zone.");return`${m(g)} Source: ${m(l)}. ${i} ${s} Plants considered: ${m(o)}. Goals considered: ${m(n)}. Safety guardrails are not relaxed for gas, abnormal temperature, pH, water level, or actuator duration, so manual edits outside a safe range will trigger warnings.`}function We(){F();const e=f.zones.flatMap(t=>U(t).map(a=>a.name));return[...new Set(e.map(t=>String(t).trim()).filter(Boolean))]}function Le(e,t){return{tempMin:t<5||t>30?"Temperature minimum is outside a safe commercial crop range.":"",tempMax:t<15||t>40?"Temperature maximum is outside a safe commercial crop range.":"",humidityMin:t<25||t>90?"Humidity minimum looks unsafe or unrealistic.":"",humidityMax:t<40||t>98?"Humidity maximum may create disease risk or sensor error.":"",phMin:t<4.5||t>7.5?"pH minimum is outside common hydroponic safety range.":"",phMax:t<5||t>8.5?"pH maximum is outside common hydroponic safety range.":"",gasDangerThreshold:t>4e3?"Gas danger threshold is too high and may delay emergency alerts.":"",waterLowCm:t<1||t>35?"Water-low distance may be unsafe for reservoir monitoring.":"",waterCriticalCm:t<5||t>60?"Reservoir critical distance is outside practical HC-SR04 monitoring range.":"",co2MaxPpm:t<800||t>2500?"CO2 maximum is outside safe commercial ventilation planning range.":"",energyDailyLimitKwh:t<.5||t>80?"Energy daily limit looks unrealistic for a commercial farm size.":"",mainFanDurationSeconds:t>600?"Main ventilation fan duration is very long; check energy impact.":"",emergencyBuzzerSeconds:t>120?"Emergency buzzer duration is too long for practical alerts.":"",wateringDurationSeconds:t>120?"Watering duration is very long and may flood the zone.":"",fanDurationSeconds:t>300?"Fan duration is very long; check energy and crop stress impact.":"",growLightDurationSeconds:t>14400?"Grow light duration is very long and may waste energy.":"",zoneFanDurationSeconds:t>600?"Zone fan duration is very long; check energy and crop stress impact.":"",activeBuzzerSeconds:t>120?"Active buzzer duration is too long for a zone warning.":"",waterFlowMinLpm:t<0||t>10?"Water flow threshold is outside practical YF-S201 range.":"",cameraScanIntervalMinutes:t<1||t>1440?"Camera scan interval should stay between 1 minute and 24 hours.":"",diseaseConfidenceMin:t<40||t>95?"Disease confidence threshold should stay practical to avoid false alarms or missed cases.":"",sensorIntervalSeconds:t<5||t>86400?"Sensor interval is outside practical monitoring range.":"",ecMin:t<.2||t>4?"EC minimum is outside practical nutrient monitoring range.":"",ecMax:t<.5||t>6?"EC maximum is outside practical nutrient monitoring range.":"",co2MinPpm:t<250||t>2e3?"CO2 minimum is outside normal commercial monitoring range.":""}[e]||""}function Pe(e,t){return`<div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:8px;">
        <div style="font-size:9px;font-weight:900;color:var(--sub);text-transform:uppercase;">${m(e)}</div>
        <div style="font-size:12px;font-weight:900;color:var(--text);margin-top:3px;">${m(t)}</div>
    </div>`}function Bt(){if(!L)return'<div style="font-size:12px;color:var(--muted);line-height:1.45;">No commercial QR scanned yet.</div>';const e=Rt(L);return`
        <div style="border:1px solid var(--border);border-radius:14px;background:var(--surface2);padding:12px;">
            <div style="font-size:12px;font-weight:900;color:var(--text);">${m(L.label||L.serial)}</div>
            <div style="font-size:10px;color:var(--muted);margin-top:3px;">${m(L.serial)} · choose assignment target</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;">
                ${e.map(t=>`
                    <button class="commercial-assign-target" data-target="${t.id}" ${t.disabled?"disabled":""}
                        style="padding:10px;border-radius:10px;border:1px solid ${t.disabled?"var(--border)":"var(--accent)"};background:${t.disabled?"var(--surface)":"var(--accent-l)"};color:${t.disabled?"var(--muted)":"var(--accent)"};font-weight:900;cursor:${t.disabled?"not-allowed":"pointer"};opacity:${t.disabled?".55":"1"};">
                        ${m(t.label)}
                    </button>
                `).join("")}
            </div>
        </div>
    `}function At(){return F(),[{id:"farm_master",label:"Farm Master Node",required:"farm_master"},...f.zones.map(t=>({id:t.zone_id,label:t.name,required:"zone_node"}))].map(t=>{const a=O.find(n=>n.targetId===t.id);return`
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px;">
                <div>
                    <div style="font-size:13px;font-weight:900;">${m(t.label)}</div>
                    <div style="font-size:10px;color:var(--muted);margin-top:3px;">Needs ${t.required==="farm_master"?"Farm Master Node":"Zone Node"}</div>
                </div>
                <span style="font-size:10px;font-weight:900;color:${a?"var(--accent)":"var(--muted)"};">${a?m(a.serial):"UNASSIGNED"}</span>
            </div>
        `}).join("")}async function Ue(){if(!y)return v("warning","Add a commercial farm photo first"),null;const e=document.getElementById("analyzeCommercialZonesBtn");e&&(e.disabled=!0,e.textContent="Analyzing...");try{await ce()}catch{}return f=qe(),v("success",`${f.zones.length} commercial zones recommended`),C(),f}function qe(){const e=c.rackType||"medium",t=e==="large"?4:e==="small"?2:3,a=S.length?S.map(o=>({name:o.name||o.species||"lettuce",count:Math.max(1,Number.parseInt(o.slots,10)||3)})):[{name:"tomato",count:8},{name:"lettuce",count:12},{name:"spinach",count:10},{name:"strawberry",count:6}],n=Array.from({length:t},(o,r)=>{const l=wt[r]||{zone_id:`zone_${String.fromCharCode(65+r)}`,name:`Zone ${String.fromCharCode(65+r)}`,recommended_type:"zone_node",crop:a[r%a.length].name,plants:[a[r%a.length].name],confidence:.78,notes:"AI fallback zone recommendation"},s=a.filter((p,z)=>z%t===r),i=a[r%a.length],g=s.length?s:[{...i,count:Math.max(1,Math.ceil(i.count/t))}],h=g.map(p=>`${p.name} x ${p.count}`).join(", ");return{...l,zone_id:`zone_${String.fromCharCode(65+r)}`,name:`Zone ${String.fromCharCode(65+r)}`,crop:h,plantItems:g.map(p=>({name:p.name,count:p.count})),plants:g.map(p=>String(p.name).toLowerCase()),plantCount:g.reduce((p,z)=>p+z.count,0)}});return{farm_master_count:1,zones:n,total_devices_needed:n.length+1,confidence:.84,rack_count:t*2,scale:e}}function F(){f||(f=qe())}async function Ke(){var t;F();const e=document.getElementById("generateCommercialThresholdsBtn")||document.getElementById("bfNext");e&&(e.disabled=!0,e.textContent="Generating...");try{const a=We().map((r,l)=>({tier:l+1,plant_type:r})),n=await fetch(`${G}/api/ai/generate-thresholds`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({plants:a,goal_priority:M,packageLevel:"farm_master"})}),o=await q(n);if(!n.ok||!o.ok)throw new Error(o.error||"Farm-level threshold generation failed");w={thresholds:jt(o.thresholds||{}),notes:o.notes,source:o.source};for(const r of f.zones){const l=((t=r.plants)!=null&&t.length?r.plants:["lettuce"]).map((g,h)=>({tier:h+1,plant_type:g})),s=await fetch(`${G}/api/ai/generate-thresholds`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({plants:l,goal_priority:M,packageLevel:r.recommended_type})}),i=await q(s);if(!s.ok||!i.ok)throw new Error(i.error||`Threshold generation failed for ${r.name}`);A[r.zone_id]={thresholds:Zt(i.thresholds||{},r),notes:i.notes,source:i.source}}return v("success","Farm and zone thresholds generated"),C(),A}catch(a){return v("error",a.message),null}finally{e&&(e.disabled=!1)}}function Ot(e){const t=new FileReader;t.onload=async a=>{try{const n=await tt(a.target.result),o=ue(n);if(o.deviceType!=="commercial")throw new Error("This QR is for Beginner. Commercial setup requires COM device QR.");L=o,v("info",`Scanned ${o.label||o.serial}`),C()}catch(n){v("error",n.message||"Could not read QR code")}},t.readAsDataURL(e)}function Rt(e){F();const t=new Set(O.map(n=>n.targetId));return[{id:"farm_master",label:"Farm Master Node",required:"farm_master"},...f.zones.map(n=>({id:n.zone_id,label:n.name,required:"zone_node"}))].map(n=>{const o=Ye(e,n.required),r=t.has(n.id);return{...n,disabled:!o||r}})}function Ye(e,t){const a=e.packageLevel||e.id||"",n=String(e.serial||"");return t==="farm_master"?a==="farm_master"||a==="farm_zone"||n.includes("FRM")||n.includes("FZK")||n.includes("MST"):t==="zone_node"?["zone_node","farm_zone","zone_basic","zone_pro"].includes(a)||n.includes("ZON")||n.includes("FZK")||n.includes("ZNB")||n.includes("ZNP"):!1}async function Gt(e){if(!L)return;F();const t=e==="farm_master"?{required:"farm_master"}:f.zones.find(r=>r.zone_id===e);if(!t)return;const a=t.required||t.recommended_type||"zone_node";if(!Ye(L,a)){v("error","Device type does not match this target");return}const n=pe||`farm_com_${Date.now()}`,o=L.accountType||(L.packageLevel==="farm_master"?"commercial_farm_master":L.packageLevel==="farm_zone"?"commercial_farm_zone":L.packageLevel==="zone_node"?"commercial_zone":L.packageLevel==="zone_pro"?"commercial_zone_pro":"commercial_zone_basic");try{const r=await fetch(`${G}/api/devices/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({serial:L.serial,wifi_ssid:I.wifiSsid.trim(),wifi_password:I.wifiPassword,accountType:o,farmId:n,zoneId:e==="farm_master"?null:e})}),l=await q(r);if(!r.ok||!l.ok)throw new Error(l.error||"Device assignment failed");Ne(l.device,e),v("success","Device assigned")}catch(r){const l=qt(L,e,n);Ne(l,e),v("warning",`Backend register failed, using demo device: ${r.message}`)}L=null,C()}function jt(e={}){return{co2MinPpm:Number(e.co2MinPpm??800),co2MaxPpm:Number(e.co2MaxPpm??1500),waterLowCm:Number(e.waterLowCm??20),waterCriticalCm:Number(e.waterCriticalCm??35),gasDangerThreshold:Number(e.gasDangerThreshold??3e3),energyDailyLimitKwh:Number(e.energyDailyLimitKwh??Ut()),mainFanDurationSeconds:Number(e.mainFanDurationSeconds??e.fanDurationSeconds??20),emergencyBuzzerSeconds:Number(e.emergencyBuzzerSeconds??10),sensorIntervalSeconds:Number(e.sensorIntervalSeconds??300)}}function Zt(e={},t={}){return{tempMin:Number(e.tempMin??18),tempMax:Number(e.tempMax??28),humidityMin:Number(e.humidityMin??50),humidityMax:Number(e.humidityMax??80),soilDryThreshold:Number(e.soilDryThreshold??2500),darkThreshold:Number(e.darkThreshold??1500),phMin:Number(e.phMin??5.8),phMax:Number(e.phMax??6.8),ecMin:Number(e.ecMin??1.2),ecMax:Number(e.ecMax??2),waterFlowMinLpm:Number(e.waterFlowMinLpm??.5),wateringDurationSeconds:Number(e.wateringDurationSeconds??10),growLightDurationSeconds:Number(e.growLightDurationSeconds??(String(t.crop||"").toLowerCase().includes("lettuce")?45:30)),zoneFanDurationSeconds:Number(e.zoneFanDurationSeconds??e.fanDurationSeconds??15),activeBuzzerSeconds:Number(e.activeBuzzerSeconds??5),cameraScanIntervalMinutes:Number(e.cameraScanIntervalMinutes??60),diseaseConfidenceMin:Number(e.diseaseConfidenceMin??70)}}function U(e={}){if(Array.isArray(e.plantItems)&&e.plantItems.length)return e.plantItems.map(n=>({name:String(n.name||n.plant||n.species||"Plant").trim()||"Plant",count:Math.max(1,Math.min(999,Number.parseInt(n.count??n.slots??n.quantity??1,10)||1))}));const t=Array.isArray(e.plants)&&e.plants.length?e.plants:ka(e.crop||"lettuce"),a=Math.max(1,Math.round(Number(e.plantCount||e.slots||12)/Math.max(1,t.length)));return t.map(n=>({name:String(n).trim()||"Plant",count:a}))}function Je(e={}){return U(e).reduce((t,a)=>t+a.count,0)}function Ht(e=[]){return e.map(t=>`${t.name} x ${t.count}`).join(`
`)}function Qt(e){return String(e||"").split(/[\n;]+/).flatMap(a=>a.split(/,(?=[^0-9]*[a-zA-Z])/)).map(a=>a.trim()).filter(Boolean).map(a=>{const n=a.match(/^(.+?)(?:\s*(?:x|\*)\s*|[:=]\s*|\s+)(\d+)$/i),o=(n?n[1]:a).trim(),r=n?Number.parseInt(n[2],10):1;return{name:o.charAt(0).toUpperCase()+o.slice(1),count:Math.max(1,Math.min(999,Number.isFinite(r)?r:1))}})}function Wt(e,t){const a=t.length?t:[{name:"Lettuce",count:1}];e.plantItems=a,e.plants=a.map(n=>n.name.toLowerCase()),e.plantCount=a.reduce((n,o)=>n+o.count,0),e.crop=a.map(n=>`${n.name} x ${n.count}`).join(", ")}function Ut(){const e=c.rackType||"medium";return e==="small"?4:e==="large"?20:10}function Ne(e,t){O=[...O.filter(a=>a.targetId!==t&&a.deviceId!==e.deviceId),{...e,targetId:t,zoneId:t==="farm_master"?null:t,role:t==="farm_master"?"farm_master":"zone_node"}]}function qt(e={},t,a){const n=String(e.serial||`SD-COM-DEMO-${Date.now()}`).toUpperCase(),o=n.split("-").pop()||String(Date.now()).slice(-5),r=e.packageLevel||(t==="farm_master"?"farm_master":"zone_node");return{deviceId:`dev_commercial_${r}_${o}`.toLowerCase().replace(/[^a-z0-9_]/g,"_"),deviceToken:`demo_token_${o}`,serial:n,deviceType:"commercial",packageLevel:r,farmId:a,zoneId:t==="farm_master"?null:t,nodeType:r,status:"demo-assigned",isDemoFallback:!0}}function Ve(){return F(),!!w&&f.zones.every(e=>!!A[e.zone_id])}function Xe(){return F(),["farm_master",...f.zones.map(t=>t.zone_id)].every(t=>O.some(a=>a.targetId===t))}function et(e){var t;return((t=Ae.find(a=>a.id===e))==null?void 0:t.label)||String(e).replace(/_/g," ")}function Kt(e){var a;e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:18px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">SCAN DEVICE QR</div>
                <div style="border:1.5px dashed var(--border);border-radius:18px;background:var(--surface2);padding:22px;text-align:center;">
                    <div style="width:92px;height:92px;border-radius:22px;margin:0 auto 14px;background:#fff;border:1px solid var(--border);display:grid;place-items:center;box-shadow:var(--shadow-sm);">
                        <span style="font-size:42px;line-height:1;">▦</span>
                    </div>
                    <div style="font-size:15px;font-weight:900;color:var(--text);">Scan SeedDown Device QR</div>
                    <div style="font-size:12px;color:var(--muted);line-height:1.45;margin:7px auto 16px;max-width:280px;">
                        Use the QR png from the device package. The QR contains the serial, package tier, and account type.
                    </div>
                    <button id="scanQrBtn" type="button" style="width:100%;max-width:260px;padding:13px;border:none;border-radius:14px;background:var(--accent);color:white;font-size:14px;font-weight:900;cursor:pointer;">
                        Scan QR
                    </button>
                    <input id="deviceQrInput" type="file" accept="image/*" capture="environment" style="display:none;">
                </div>
                <div id="deviceStatus" style="margin-top:12px;font-size:12px;color:${d?"var(--accent)":"var(--muted)"};line-height:1.45;">
                    ${d?`Linked ${m(d.deviceId)} · ${m(d.packageLevel)} · ${m(d.serial||I.serial)}`:"No QR scanned yet."}
                </div>
                ${d?Yt():""}
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">WIFI SETUP</div>
                ${te("wifiSsidInput","WiFi SSID","Your WiFi name",I.wifiSsid)}
                <label style="display:block;margin-bottom:10px;">
                    <span style="display:block;font-size:11px;font-weight:800;color:var(--sub);margin-bottom:5px;">WiFi password</span>
                    <input id="wifiPasswordInput" type="password" value="${m(I.wifiPassword)}" placeholder="stored only for setup simulation"
                        style="width:100%;padding:11px 12px;border:1.5px solid var(--border);border-radius:10px;background:var(--surface2);color:var(--text);font-size:14px;outline:none;">
                </label>
            </section>
        </div>
    `,W("wifiSsidInput",n=>{I.wifiSsid=n,d=null}),W("wifiPasswordInput",n=>{I.wifiPassword=n,d=null});const t=document.getElementById("deviceQrInput");(a=document.getElementById("scanQrBtn"))==null||a.addEventListener("click",()=>t==null?void 0:t.click()),t==null||t.addEventListener("change",n=>{var r;const o=(r=n.target.files)==null?void 0:r[0];o&&Jt(o),n.target.value=""})}function Yt(){const e=K(),t=J(e),a=fe().filter(n=>!t.thresholdKeys.includes(n.key)).map(n=>n.label).slice(0,4);return`
        <div style="margin-top:12px;padding:11px;border-radius:12px;background:var(--accent-l);border:1px solid rgba(22,163,74,.16);">
            <div style="font-size:11px;font-weight:900;color:var(--accent);margin-bottom:4px;">${m(t.label)} package detected</div>
            <div style="font-size:11px;color:var(--muted);line-height:1.45;">
                Threshold generation will only enable sensors included in this QR package.
                ${a.length?` Locked: ${a.join(", ")}${a.length>=4?"...":""}`:" All threshold controls are unlocked."}
            </div>
        </div>
    `}function Jt(e){const t=new FileReader;t.onload=async a=>{try{const n=await tt(a.target.result);await Xt(n)}catch(n){v("error",n.message||"Could not read QR code")}},t.readAsDataURL(e)}function tt(e){return new Promise((t,a)=>{const n=new Image;n.onload=()=>{const o=document.createElement("canvas");o.width=n.naturalWidth||n.width,o.height=n.naturalHeight||n.height;const r=o.getContext("2d",{willReadFrequently:!0});r.drawImage(n,0,0,o.width,o.height);const l=r.getImageData(0,0,o.width,o.height),s=bt(l.data,l.width,l.height);if(!(s!=null&&s.data)){a(new Error("QR not detected. Try the generated SeedDown QR png."));return}try{t(Vt(s.data))}catch(i){a(i)}},n.onerror=()=>a(new Error("Unable to load QR image")),n.src=e})}function Vt(e){const t=String(e||"").trim();let a;try{a=JSON.parse(t)}catch{a={serial:t}}if(a.type&&a.type!=="seeddown_device_qr")throw new Error("This is not a SeedDown device QR");if(!a.serial)throw new Error("QR does not contain a device serial");return ue(a)}async function Xt(e){const t=ue(e);I.serial=t.serial,I.accountType=t.accountType,d=null,v("info",`Scanned ${t.label||t.serial}`),await ua(t)}function ue(e={}){const t=String(e.serial||"").trim().toUpperCase(),a=Re.find(o=>o.serial===t);return a?{...a,...e,serial:t}:{...ea(t),...e,serial:t}}function ea(e){return e.startsWith("SD-BGN-STR")?{label:"Beginner Starter",accountType:"beginner_starter",packageLevel:"starter",deviceType:"beginner",desc:"basic home sensor kit"}:e.startsWith("SD-BGN-STD")?{label:"Beginner Standard",accountType:"beginner_standard",packageLevel:"standard",deviceType:"beginner",desc:"balanced home vertical farm kit"}:e.startsWith("SD-BGN-PRO")?{label:"Beginner Pro",accountType:"beginner_pro",packageLevel:"pro",deviceType:"beginner",desc:"advanced home kit with more automation"}:e.startsWith("SD-COM-FRM")||e.startsWith("SD-COM-MST")?{label:"Commercial Farm Master Node",accountType:"commercial_farm_master",packageLevel:"farm_master",deviceType:"commercial",desc:"farm-level controller"}:e.startsWith("SD-COM-FZK")?{label:"Commercial Farm + Zone Combo",accountType:"commercial_farm_zone",packageLevel:"farm_zone",deviceType:"commercial",desc:"farm or zone compatible node"}:e.startsWith("SD-COM-ZON")||e.startsWith("SD-COM-ZNB")||e.startsWith("SD-COM-ZNP")?{label:"Commercial Zone Node",accountType:"commercial_zone",packageLevel:"zone_node",deviceType:"commercial",desc:"zone-level sensor and actuator node"}:{label:e||"Unknown QR",accountType:"",packageLevel:"",deviceType:"",desc:"unknown device QR"}}function ta(e){e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">FIELD INFO</div>
                ${te("fieldNameInput","Field name","e.g. Balcony Trial A",c.name)}
                ${te("fieldLocationInput","Location / zone","e.g. Balcony, Lab Corner, Zone A",c.location)}
                <label style="display:block;margin-bottom:10px;">
                    <span style="display:block;font-size:11px;font-weight:800;color:var(--sub);margin-bottom:5px;">Description</span>
                    <textarea id="fieldDescriptionInput" placeholder="Optional notes about this field"
                        style="width:100%;min-height:92px;resize:vertical;padding:11px 12px;border:1.5px solid var(--border);border-radius:10px;background:var(--surface2);color:var(--text);font-size:14px;outline:none;line-height:1.4;">${m(c.description)}</textarea>
                </label>
                <div style="font-size:12px;color:var(--muted);line-height:1.45;">
                    Plant analysis, crop goals, and device thresholds are handled in the next steps after photo scanning.
                </div>
            </section>
        </div>
    `,W("fieldNameInput",t=>{c.name=t}),W("fieldLocationInput",t=>{c.location=t}),W("fieldDescriptionInput",t=>{c.description=t})}function te(e,t,a,n){return`
        <label style="display:block;margin-bottom:10px;">
            <span style="display:block;font-size:11px;font-weight:800;color:var(--sub);margin-bottom:5px;">${t}</span>
            <input id="${e}" type="text" value="${m(n)}" placeholder="${a}"
                style="width:100%;padding:11px 12px;border:1.5px solid var(--border);border-radius:10px;
                       background:var(--surface2);color:var(--text);font-size:14px;outline:none;">
        </label>
    `}function aa(e){const t=c.rackType===e.id;return`
        <button class="rack-opt" data-id="${e.id}"
            style="width:100%;display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;cursor:pointer;
                   text-align:left;border:1.5px solid ${t?"var(--accent)":"var(--border)"};
                   background:${t?"var(--accent-l)":"var(--surface2)"};color:var(--text);">
            <span style="width:42px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;
                         background:${t?"var(--accent)":"var(--surface)"};color:${t?"#fff":"var(--sub)"};
                         font-size:10px;font-weight:900;letter-spacing:.03em;flex-shrink:0;">${e.icon}</span>
            <span style="flex:1;">
                <span style="display:block;font-size:13px;font-weight:800;">${e.label}</span>
                <span style="display:block;font-size:11px;color:var(--muted);margin-top:2px;">${e.tiers} tiers · ${e.total} plant slots</span>
                <span style="display:block;font-size:10px;color:var(--sub);margin-top:3px;line-height:1.25;">${m(e.desc||"")}</span>
            </span>
            <span style="font-size:18px;color:${t?"var(--accent)":"var(--muted)"};">${t?"✓":"+"}</span>
        </button>
    `}function na(){document.querySelectorAll(".rack-opt").forEach(e=>{e.addEventListener("click",()=>{c.rackType=e.dataset.id||c.rackType,c.customRack=null,u=null,C()})})}function at(e){e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:12px;">
                    <div>
                        <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;">FIELD PHOTO</div>
                        <div style="font-size:12px;color:var(--muted);margin-top:4px;">Capture the vertical setup so the preview can match the real field.</div>
                    </div>
                    <div style="font-size:11px;font-weight:800;color:var(--accent);white-space:nowrap;">${y?"READY":"NEEDED"}</div>
                </div>

                <div id="photoPreview"
                     style="width:100%;height:220px;border-radius:12px;border:2px dashed ${y?"var(--accent)":"var(--border)"};
                            background:${y?`url(${y.dataUrl}) center/cover`:"var(--surface2)"};
                            display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;position:relative;">
                    ${y?`
                        <div style="position:absolute;bottom:10px;right:10px;background:rgba(0,0,0,.58);color:white;
                                    padding:6px 10px;border-radius:8px;font-size:11px;font-weight:800;">Photo loaded</div>
                    `:`
                        <div style="text-align:center;color:var(--muted);">
                            <div style="font-size:36px;margin-bottom:8px;">▣</div>
                            <div style="font-size:13px;font-weight:800;">Tap to add field photo</div>
                            <div style="font-size:11px;margin-top:4px;">front-facing rack photo works best</div>
                        </div>
                    `}
                </div>
                <input type="file" id="photoInput" accept="image/*" style="display:none;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;">
                    <button id="cameraBtn" style="padding:11px;border:1px solid var(--border);border-radius:10px;background:var(--surface2);font-weight:800;color:var(--text);cursor:pointer;">Camera</button>
                    <button id="galleryBtn" style="padding:11px;border:1px solid var(--border);border-radius:10px;background:var(--surface2);font-weight:800;color:var(--text);cursor:pointer;">Gallery</button>
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <div>
                        <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;">PLANTS FOR ANALYSIS</div>
                        <div id="scanStatus" style="font-size:11px;color:var(--muted);margin-top:3px;">${y?"Ready to scan or edit manually":"Add a photo, or continue with manual plants"}</div>
                    </div>
                    <button id="scanBtn" ${y?"":"disabled"}
                        style="padding:7px 10px;border-radius:20px;border:1px solid ${y?"var(--accent)":"var(--border)"};
                               background:${y?"var(--accent-l)":"var(--surface2)"};
                               color:${y?"var(--accent)":"var(--muted)"};
                               font-size:11px;font-weight:800;cursor:${y?"pointer":"not-allowed"};">
                        Scan Photo
                    </button>
                </div>
                <div id="plantList" style="display:flex;flex-direction:column;gap:8px;"></div>
                <div style="display:flex;gap:8px;margin-top:12px;">
                    <input id="manualPlantInput" type="text" placeholder="Add plant, e.g. kale"
                        style="flex:1;padding:10px 12px;border:1.5px solid var(--border);border-radius:10px;background:var(--surface2);color:var(--text);font-size:13px;outline:none;">
                    <button id="manualAddBtn" style="padding:10px 14px;border:none;border-radius:10px;background:var(--accent);color:white;font-weight:800;cursor:pointer;">Add</button>
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <div>
                        <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;">STRUCTURE RECOGNITION</div>
                        <div style="font-size:11px;color:var(--muted);margin-top:3px;">AI can detect rack/tower/wall/channel layout from the photo, then you can adjust it.</div>
                    </div>
                    <span id="structureStatus" style="font-size:10px;font-weight:900;color:var(--accent);">${V().label}</span>
                </div>
                <div style="display:flex;flex-direction:column;gap:8px;max-height:260px;overflow:auto;">
                    ${se.map(aa).join("")}
                </div>
            </section>
        </div>
    `,le(),nt(e),document.getElementById("scanBtn").addEventListener("click",ce),document.getElementById("manualAddBtn").addEventListener("click",Be),document.getElementById("manualPlantInput").addEventListener("keypress",t=>{t.key==="Enter"&&Be()}),na(),y&&!ie&&(ie=!0,ce())}function nt(e){const t=document.getElementById("photoInput");document.getElementById("photoPreview").addEventListener("click",()=>t.click()),document.getElementById("cameraBtn").addEventListener("click",()=>{t.setAttribute("capture","environment"),t.click()}),document.getElementById("galleryBtn").addEventListener("click",()=>{t.removeAttribute("capture"),t.click()}),t.addEventListener("change",a=>{const n=a.target.files[0];if(!n)return;const o=new FileReader;o.onload=r=>{var h;const l=r.target.result,[s,i]=l.split(","),g=((h=s.match(/:(.*?);/))==null?void 0:h[1])||"image/jpeg";y={base64:i,mediaType:g,dataUrl:l},ie=!1,Q()?C():at(e)},o.readAsDataURL(n)})}function le(){const e=document.getElementById("plantList");if(e){if(S.length===0){e.innerHTML=`
            <div style="padding:22px;border:1px dashed var(--border);border-radius:12px;background:var(--surface2);text-align:center;color:var(--muted);font-size:13px;">
                No plants yet. Add the target plant or scan a photo.
            </div>
        `;return}e.innerHTML=S.map((t,a)=>`
        <div style="display:flex;align-items:center;gap:10px;background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px;">
            <div style="font-size:26px;line-height:1;flex-shrink:0;">${t.emoji}</div>
            <div style="flex:1;min-width:0;">
                <div style="font-size:13px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${m(t.name)}</div>
                <div style="font-size:10px;color:var(--muted);margin-top:3px;">
                    ${t.confidence?`${Math.round(t.confidence*100)}% photo match · `:""}${t.species}
                </div>
            </div>
            <div style="display:flex;align-items:center;gap:5px;">
                <button data-action="dec" data-idx="${a}" style="width:26px;height:26px;border-radius:8px;border:1px solid var(--border);background:var(--surface);cursor:pointer;">−</button>
                <span style="font-size:13px;font-weight:900;min-width:22px;text-align:center;">${t.slots}</span>
                <button data-action="inc" data-idx="${a}" style="width:26px;height:26px;border-radius:8px;border:1px solid var(--border);background:var(--surface);cursor:pointer;">+</button>
            </div>
            <button data-action="remove" data-idx="${a}" aria-label="Remove plant"
                style="border:none;background:transparent;color:var(--muted);font-size:18px;cursor:pointer;padding:2px 4px;">×</button>
        </div>
    `).join(""),e.querySelectorAll("button[data-action]").forEach(t=>{t.addEventListener("click",()=>{const a=Number(t.dataset.idx),n=t.dataset.action;n==="inc"&&(S[a].slots=Math.min(40,S[a].slots+1)),n==="dec"&&(S[a].slots=Math.max(1,S[a].slots-1)),n==="remove"&&S.splice(a,1),le()})})}}async function ce(){if(!y){v("warning","Add a field photo first");return}const e=document.getElementById("scanBtn"),t=document.getElementById("scanStatus");e&&(e.textContent="Scanning...",e.disabled=!0),t&&(t.textContent="AI is checking the field photo...");try{const n=await(await fetch(`${G}/api/farms/scan-plants`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:y.base64,mediaType:y.mediaType,targetPlant:c.targetPlant})})).json(),o=Array.isArray(n.plants)?n.plants:[],r=n.structure||n.rack||n.layout;let l=da(r);o.length?(ct(o),l=it(r)||l,v("success",`${o.length} plant type${o.length>1?"s":""} detected${l?" + structure matched":""}`),t&&(t.textContent=`Review plants and ${l?"detected structure":"structure"} before generating 3D.`)):(t&&(t.textContent=l?"Structure detected. Add plants manually if needed.":n.warning||"No clear plant detected. Manual list is still usable."),v("info",l?"Structure detected from photo":"No plant detected from photo yet"))}catch{t&&(t.textContent="Photo scan unavailable. Manual plant list is ready."),v("warning","AI scan unavailable, continue manually")}finally{e&&(e.textContent="Scan Photo",e.disabled=!1),le(),!Q()&&b===3&&C()}}function ot(e){var o;it();const t=V(),a=ve(),n=((o=S[0])==null?void 0:o.name)||"Field";e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:var(--shadow-sm);">
                <div style="padding:12px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:10px;">
                    <div style="min-width:0;">
                        <div style="font-size:14px;font-weight:900;">${m(n)} Vertical 3D</div>
                        <div style="font-size:11px;color:var(--muted);margin-top:2px;">Drag to orbit · Toggle for gamified view</div>
                    </div>
                    <div style="display:flex;background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:3px;flex-shrink:0;">
                        <button class="view-toggle" data-mode="realistic"
                            style="${De(x==="realistic")}">Real</button>
                        <button class="view-toggle" data-mode="gamified"
                            style="${De(x==="gamified")}">Game</button>
                    </div>
                </div>
                <div style="position:relative;background:#10141d;">
                    <canvas id="farmCanvas3D" style="width:100%;height:clamp(300px,44dvh,560px);display:block;"></canvas>
                    <div id="canvas3DOverlay"
                         style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
                                background:rgba(16,20,29,.74);color:rgba(255,255,255,.78);font-size:13px;">
                        Building 3D field...
                    </div>
                    ${y?`
                        <img src="${y.dataUrl}" alt="Field source photo"
                             style="position:absolute;right:10px;bottom:10px;width:70px;height:70px;border-radius:10px;
                                    object-fit:cover;border:2px solid rgba(255,255,255,.45);box-shadow:0 8px 20px rgba(0,0,0,.22);">
                    `:""}
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">ANALYSIS SNAPSHOT</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                    ${R("Target plant",n)}
                    ${R("Goal",za(c.analysisGoal))}
                    ${R("Structure",t.label)}
                    ${R("Slots",`${a}/${t.total}`,a>t.total?"var(--danger)":"var(--ok)")}
                </div>
                <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px;">
                    ${S.map(r=>`
                        <span style="padding:5px 9px;border-radius:20px;background:var(--ok-bg);color:var(--ok);font-size:12px;font-weight:800;">
                            ${r.emoji} ${m(r.name)} ×${r.slots}
                        </span>
                    `).join("")}
                </div>
            </section>
        </div>
    `,document.querySelectorAll(".view-toggle").forEach(r=>{r.addEventListener("click",()=>{x=r.dataset.mode,ot(e)})}),setTimeout(()=>oa(t),100)}function De(e){return["border:none","border-radius:8px","padding:7px 10px","font-size:11px","font-weight:900","cursor:pointer",`background:${e?"var(--accent)":"transparent"}`,`color:${e?"#fff":"var(--muted)"}`].join(";")}function R(e,t,a="var(--text)"){return`
        <div style="border:1px solid var(--border);border-radius:12px;padding:10px;background:var(--surface2);min-height:62px;">
            <div style="font-size:10px;color:var(--muted);font-weight:800;margin-bottom:5px;">${e}</div>
            <div style="font-size:13px;color:${a};font-weight:900;line-height:1.25;">${m(String(t))}</div>
        </div>
    `}async function oa(e){const t=document.getElementById("farmCanvas3D"),a=document.getElementById("canvas3DOverlay");if(!t)return;a&&(a.style.display="none");const n=()=>({width:Math.max(240,t.clientWidth||t.offsetWidth||360),height:Math.max(260,t.clientHeight||t.offsetHeight||330)}),{width:o,height:r}=n();if(!sa()){Ee(t,e,o,r),v("warning","WebGL is disabled, showing 2D preview");return}const l=Math.min(window.devicePixelRatio||1,2);t.width=o*l,t.height=r*l;let s;try{s=new k.WebGLRenderer({canvas:t,antialias:!0,alpha:!1,preserveDrawingBuffer:!0})}catch(_){console.warn("[BuildFarm] WebGL unavailable, using 2D fallback:",_.message),Ee(t,e,o,r),v("warning","WebGL is disabled, showing 2D preview");return}s.setPixelRatio(l),s.setSize(o,r),s.shadowMap.enabled=!0,s.shadowMap.type=k.PCFShadowMap,s.outputColorSpace=k.SRGBColorSpace,s.toneMapping=k.ACESFilmicToneMapping;const i=new k.Scene;i.background=new k.Color(x==="gamified"?1581626:1053725),i.fog=new k.FogExp2(x==="gamified"?1581626:1053725,.028);const g=new k.PerspectiveCamera(46,o/r,.1,80);g.position.set(3.3,2.25,3.7),i.add(new k.AmbientLight(x==="gamified"?7902463:4346223,1.55));const h=new k.DirectionalLight(16777215,x==="gamified"?3.4:2.3);h.position.set(5,8,5),h.castShadow=!0,h.shadow.mapSize.set(1024,1024),i.add(h);const{tiers:p,slotsPerTier:z}=e,$=e.shape==="channel"?.34:e.shape==="wall"?.36:e.shape==="column"?.46:.42,P=z*$+.1,N=e.shape==="wall"?.34:e.shape==="column"?1:x==="gamified"?.72:.58,j=e.tiers>=5?.54:.66,Z=p*j,ae=new k.MeshStandardMaterial({color:x==="gamified"?1911634:1448740,roughness:.9,metalness:.02}),Y=new k.Mesh(new k.PlaneGeometry(9,9),ae);Y.rotation.x=-Math.PI/2,Y.receiveShadow=!0,i.add(Y);const ut=new k.MeshStandardMaterial({color:x==="gamified"?5995770:5859452,roughness:.3,metalness:.75}),ft=new k.MeshStandardMaterial({color:x==="gamified"?8246268:7372944,roughness:.42,metalness:.55}),gt=new k.MeshStandardMaterial({color:x==="gamified"?16436245:10980346,emissive:x==="gamified"?8736014:5972406,emissiveIntensity:x==="gamified"?.45:.2,roughness:.5}),ht=new k.BoxGeometry(.045,Z,.045);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([_,D])=>{const H=new k.Mesh(ht,ut);H.position.set(_*P/2,Z/2,D*N/2),H.castShadow=!0,i.add(H)});const ye=[];S.forEach(_=>{for(let D=0;D<_.slots;D++)ye.push(_)});for(let _=0;_<p;_++){const D=_*j,H=new k.Mesh(new k.BoxGeometry(P,.035,N),ft);H.position.set(0,D+.018,0),H.castShadow=!0,H.receiveShadow=!0,i.add(H);const ke=new k.Mesh(new k.BoxGeometry(P*.86,.018,.035),gt);ke.position.set(0,D+j-.07,-N/2+.06),i.add(ke);const Se=new k.PointLight(x==="gamified"?16436245:10980346,.75,1.4);Se.position.set(0,D+j*.7,0),i.add(Se);for(let ne=0;ne<z;ne++){const ze=_*z+ne,Ce=ye[ze],_e=(ne-(z-1)/2)*$,Me=0,$e=D+.05;if(!Ce){const Te=new k.Mesh(new k.CylinderGeometry(.07,.07,.018,x==="gamified"?6:16),new k.MeshStandardMaterial({color:2371652,transparent:!0,opacity:.58,roughness:.9}));Te.position.set(_e,$e,Me),i.add(Te);continue}ra(k,i,Ce,_e,$e,Me,ze)}}x==="gamified"&&ia(k,i,P,Z);const B=new xt(g,s.domElement);B.enableDamping=!0,B.dampingFactor=.07,B.target.set(0,Z*.42,0),B.minDistance=1.7,B.maxDistance=8,B.maxPolarAngle=Math.PI*.82,B.autoRotate=!0,B.autoRotateSpeed=x==="gamified"?1:.55,B.addEventListener("start",()=>{B.autoRotate=!1});const be=new ResizeObserver(()=>{const{width:_,height:D}=n();g.aspect=_/D,g.updateProjectionMatrix(),s.setSize(_,D,!1)});be.observe(t);let xe;const we=()=>{xe=requestAnimationFrame(we),B.update(),s.render(i,g)};we(),re=()=>{cancelAnimationFrame(xe),be.disconnect(),B.dispose(),i.traverse(_=>{_.geometry&&_.geometry.dispose(),_.material&&(Array.isArray(_.material)?_.material.forEach(D=>D.dispose()):_.material.dispose())}),s.dispose()}}function ra(e,t,a,n,o,r,l){const s=x==="gamified"?[4906624,2282478,16436245,16478597,10980346]:[2278750,1483594,6660877,1409085,8843180],i=s[l%s.length],g=new e.MeshStandardMaterial({color:x==="gamified"?16347926:8141549,roughness:.68}),h=new e.Mesh(new e.CylinderGeometry(.07,.058,.07,x==="gamified"?6:16),g);h.position.set(n,o+.035,r),h.castShadow=!0,t.add(h);const p=new e.Mesh(new e.CylinderGeometry(.008,.008,.095,8),new e.MeshStandardMaterial({color:3560212,roughness:.82}));p.position.set(n,o+.105,r),t.add(p);const z=new e.MeshStandardMaterial({color:i,roughness:x==="gamified"?.48:.86,emissive:x==="gamified"?i:0,emissiveIntensity:x==="gamified"?.12:0}),$=x==="gamified"?5:3;for(let P=0;P<$;P++){const N=new e.Mesh(new e.SphereGeometry(.085,12,8),z),j=Math.PI*2/$*P;N.scale.set(1.25,.42,.7),N.position.set(n+Math.cos(j)*.05,o+.15+P%2*.016,r+Math.sin(j)*.045),N.rotation.set(.25,j,-.25),N.castShadow=!0,t.add(N)}}function ia(e,t,a,n){const o=new e.MeshStandardMaterial({color:16436245,emissive:8736014,emissiveIntensity:.35,roughness:.35,metalness:.35});for(let r=0;r<5;r++){const l=new e.Mesh(new e.CylinderGeometry(.055,.055,.014,18),o);l.rotation.x=Math.PI/2,l.position.set((r-2)*a/5,n+.18+r%2*.08,-.42),t.add(l)}}function sa(){try{const e=document.createElement("canvas");return!!(window.WebGLRenderingContext&&(e.getContext("webgl2")||e.getContext("webgl")||e.getContext("experimental-webgl")))}catch{return!1}}function Ee(e,t,a,n){const o=e.getContext("2d");if(!o)return;const r=Math.min(window.devicePixelRatio||1,2);e.width=Math.floor(a*r),e.height=Math.floor(n*r),o.setTransform(r,0,0,r,0,0);const l=o.createLinearGradient(0,0,a,n);l.addColorStop(0,x==="gamified"?"#18223a":"#10141d"),l.addColorStop(1,x==="gamified"?"#25345d":"#1f2937"),o.fillStyle=l,o.fillRect(0,0,a,n);const s=[];S.forEach($=>{for(let P=0;P<$.slots;P++)s.push($)});const i=34,g=a-i*2,p=(n-68)/t.tiers,z=g/t.slotsPerTier;o.fillStyle="rgba(255,255,255,0.1)",o.beginPath(),o.ellipse(a*.5,n-24,g*.43,16,0,0,Math.PI*2),o.fill(),o.strokeStyle=x==="gamified"?"#7dd3fc":"#64748b",o.lineWidth=6,o.lineCap="round",o.beginPath(),o.moveTo(i+8,32),o.lineTo(i+8,n-45),o.moveTo(a-i-8,32),o.lineTo(a-i-8,n-45),o.stroke();for(let $=0;$<t.tiers;$++){const P=42+$*p;o.fillStyle=x==="gamified"?"#7dd3fc":"#708090",Fe(o,i,P+p*.56,g,9,5),o.fill(),o.fillStyle=x==="gamified"?"#facc15":"#a78bfa",Fe(o,i+g*.12,P+7,g*.76,5,3),o.fill();for(let N=0;N<t.slotsPerTier;N++){const j=$*t.slotsPerTier+N,Z=s[j],ae=i+z*(N+.5),Y=P+p*.53;o.fillStyle=Z?x==="gamified"?"#f97316":"#7c3aed":"rgba(148,163,184,0.35)",o.beginPath(),o.ellipse(ae,Y,13,7,0,0,Math.PI*2),o.fill(),Z&&la(o,ae,Y,Z,j)}}if(x==="gamified"){o.fillStyle="#facc15";for(let $=0;$<5;$++)o.beginPath(),o.arc(a*.26+$*34,28+$%2*9,7,0,Math.PI*2),o.fill()}o.fillStyle="rgba(255,255,255,0.86)",o.font="700 12px Inter, system-ui, sans-serif",o.fillText(`${t.tiers} tiers · ${Math.min(s.length,t.total)}/${t.total} plants`,16,n-16)}function la(e,t,a,n,o){const r=x==="gamified"?["#4ade80","#22d3ee","#facc15","#fb7185","#a78bfa"]:["#22c55e","#16a34a","#65a30d","#15803d","#86efac"],l=n.emoji==="🍅"?"#ef4444":n.emoji==="🌶️"?"#dc2626":r[o%r.length];e.strokeStyle="#365314",e.lineWidth=2,e.beginPath(),e.moveTo(t,a-5),e.lineTo(t,a-25),e.stroke(),e.fillStyle=l;for(let s=0;s<5;s++){const i=Math.PI*2/5*s;e.save(),e.translate(t+Math.cos(i)*8,a-24+Math.sin(i)*5),e.rotate(i),e.beginPath(),e.ellipse(0,0,9,4,0,0,Math.PI*2),e.fill(),e.restore()}}function Fe(e,t,a,n,o,r){e.beginPath(),e.moveTo(t+r,a),e.lineTo(t+n-r,a),e.quadraticCurveTo(t+n,a,t+n,a+r),e.lineTo(t+n,a+o-r),e.quadraticCurveTo(t+n,a+o,t+n-r,a+o),e.lineTo(t+r,a+o),e.quadraticCurveTo(t,a+o,t,a+o-r),e.lineTo(t,a+r),e.quadraticCurveTo(t,a,t+r,a),e.closePath()}function rt(e){const t=S.length?S:[];e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">GOAL PRIORITY</div>
                <div style="font-size:12px;color:var(--muted);line-height:1.45;margin-bottom:12px;">Choose up to two goals. SeedDown will generate thresholds for this device and crop mix.</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    ${Oe.map(a=>{const n=E.includes(a.id);return`<button class="goal-priority" data-id="${a.id}"
                            style="padding:11px 8px;border-radius:12px;border:1.5px solid ${n?"var(--accent)":"var(--border)"};background:${n?"var(--accent-l)":"var(--surface2)"};color:${n?"var(--accent)":"var(--text)"};font-weight:900;font-size:12px;cursor:pointer;">
                            ${a.label}
                        </button>`}).join("")}
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:12px;">
                    <div>
                        <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;">AI THRESHOLDS</div>
                        <div style="font-size:12px;color:var(--muted);margin-top:4px;line-height:1.45;">Plants: ${t.map(a=>m(a.name)).join(", ")||"mixed greens"} · Package: ${m(J(K()).label)}</div>
                    </div>
                    <button id="generateThresholdsBtn" style="padding:8px 10px;border-radius:999px;border:1px solid var(--accent);background:var(--accent-l);color:var(--accent);font-size:11px;font-weight:900;cursor:pointer;">Generate</button>
                </div>
                <div id="thresholdStatus" style="font-size:12px;color:var(--muted);margin-bottom:10px;line-height:1.45;">
                    ${u?m(u.notes||"Thresholds ready"):"No thresholds generated yet."}
                </div>
                <div id="thresholdGrid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    ${ca((u==null?void 0:u.thresholds)||{})}
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:10px;">AI ANALYSIS</div>
                ${ma(t)}
            </section>
        </div>
    `,document.querySelectorAll(".goal-priority").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.id;E.includes(n)?E=E.filter(o=>o!==n):E.length<2?E=[...E,n]:v("warning","Choose up to 2 goals"),u=null,rt(e)})}),document.getElementById("generateThresholdsBtn").addEventListener("click",lt),pa()}function da(e){if(!e)return!1;const t=String(e.rackType||e.type||e.id||e.structureType||"").toLowerCase(),a=Number(e.tiers||e.tierCount||0),n=Number(e.slotsPerTier||e.columns||0),o=`${t} ${e.label||""} ${e.description||""}`.toLowerCase();let r=null;return o.includes("wall")||o.includes("panel")||o.includes("grid")?r="wall":o.includes("a-frame")||o.includes("pyramid")||o.includes("slant")?r="a-frame":o.includes("nft")||o.includes("channel")||o.includes("row")?r="nft-channel":o.includes("hanging")||o.includes("column")||o.includes("tower")?r=o.includes("tower")&&a>=5?"5-tier":"hanging":a>=5?r="5-tier":a===4&&n>=5?r="wall":a===4?r="4-tier":a===2?r="2-tier":a===3?r="3-tier":t&&se.some(l=>l.id===t)&&(r=t),!r||c.rackType===r?!1:(c.rackType=r,c.customRack=null,u=null,!0)}function it(e=null){const t=ve();if(!t)return!1;const a=V(),n=Number((e==null?void 0:e.total)||(e==null?void 0:e.totalSlots)||(e==null?void 0:e.plantSlots)||0),o=Math.max(t,n);if(a.total>=o&&!c.customRack)return!1;const l=Number((e==null?void 0:e.tiers)||(e==null?void 0:e.tierCount)||0),s=Number((e==null?void 0:e.slotsPerTier)||(e==null?void 0:e.columns)||0),i=l>0?Math.max(1,Math.min(8,Math.round(l))):Math.max(3,Math.min(7,Math.ceil(Math.sqrt(o)))),g=s>0?Math.max(1,Math.min(12,Math.round(s))):Math.max(3,Math.ceil(o/i)),h=Math.max(o,i*g),p=o>24?"wall":i>=5?"tower":"rack";return c.customRack={id:"photo-detected",label:(e==null?void 0:e.label)||(e==null?void 0:e.name)||"Photo-detected Multi Rack",icon:"AI",tiers:i,slotsPerTier:g,total:h,shape:p,desc:"Auto-sized from photo analysis and visible plant slot count"},c.rackType="photo-detected",u=null,!0}function ca(e={}){const t=J(K());return fe().map(({key:a,label:n})=>{const o=t.thresholdKeys.includes(a),r=o?e[a]??"":t.lockedText;return`
        <label style="display:block;opacity:${o?"1":".58"};">
            <span style="display:block;font-size:10px;font-weight:900;color:var(--sub);margin-bottom:4px;text-transform:uppercase;">${n}</span>
            <input class="threshold-input" data-key="${a}" type="${o?"number":"text"}" value="${Ca(r)}" placeholder="${o?"generate first":t.lockedText}"
                disabled readonly
                title="Beginner thresholds are AI-managed to prevent unsafe sensor or actuator settings."
                style="width:100%;padding:10px;border:1px solid ${o?"var(--border)":"rgba(148,163,184,.35)"};border-radius:10px;background:${o?"#F8FAFC":"rgba(148,163,184,.1)"};font-size:13px;font-weight:800;color:${o?"var(--text)":"var(--muted)"};outline:none;cursor:not-allowed;">
            <span style="display:block;font-size:9px;color:${o?"var(--muted)":"var(--sub)"};margin-top:4px;line-height:1.3;">${o?"AI managed · locked for beginner safety":"Sensor not included in this package"}</span>
        </label>
    `}).join("")}function fe(){return[{key:"tempMin",label:"Temp min"},{key:"tempMax",label:"Temp max"},{key:"humidityMin",label:"Humid min"},{key:"humidityMax",label:"Humid max"},{key:"soilDryThreshold",label:"Soil dry"},{key:"darkThreshold",label:"Light dark"},{key:"phMin",label:"pH min"},{key:"phMax",label:"pH max"},{key:"ecMin",label:"EC min"},{key:"ecMax",label:"EC max"},{key:"co2MinPpm",label:"CO2 min"},{key:"gasDangerThreshold",label:"Gas limit"},{key:"waterLowCm",label:"Water low"},{key:"wateringDurationSeconds",label:"Water sec"},{key:"fanDurationSeconds",label:"Fan sec"},{key:"sensorIntervalSeconds",label:"Interval sec"}]}function ma(e=[]){const t=V(),a=K(),n=J(a),o=e.length?e.map(h=>h.name).join(", "):"mixed greens",r=E.map(h=>{var p;return((p=Oe.find(z=>z.id===h))==null?void 0:p.label)||h}).join(", ")||"Beginner Safe",l=fe().filter(h=>!n.thresholdKeys.includes(h.key)).map(h=>h.label),s=!!(u!=null&&u.thresholds),i=(u==null?void 0:u.source)==="ai"?"AI generated":(u==null?void 0:u.source)==="fallback"?"Rule-based fallback":s?"AI managed locked recipe":"Waiting for generation",g=[`Plant profile: ${o}.`,`Structure: ${t.label} with ${t.tiers} tiers and ${t.total} slots.`,`Goal priority: ${r}.`,`Package logic: ${n.label} only enables thresholds for available sensors. Beginner mode locks the values after generation so users cannot accidentally create unsafe pump, fan, buzzer, pH, or sensor settings.`];return l.length?g.push(`Locked sensors: ${l.slice(0,5).join(", ")}${l.length>5?"...":""}.`):g.push("All sensor thresholds are unlocked for this package."),`
        <div style="display:flex;flex-direction:column;gap:10px;">
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;">
                <strong style="font-size:13px;color:var(--text);">${m(i)}</strong>
                <span style="font-size:10px;font-weight:900;color:var(--accent);background:var(--accent-l);padding:5px 8px;border-radius:999px;">${m(n.label)}</span>
            </div>
            <div style="font-size:12px;color:var(--muted);line-height:1.55;">
                ${m((u==null?void 0:u.notes)||"Generate thresholds to see SeedDown’s full reasoning for this field.")}
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;">
                ${g.map(h=>`
                    <div style="display:flex;gap:7px;align-items:flex-start;font-size:11px;color:var(--sub);line-height:1.45;">
                        <span style="color:var(--accent);font-weight:900;">•</span>
                        <span>${m(h)}</span>
                    </div>
                `).join("")}
            </div>
        </div>
    `}function J(e){return Ie[e]||Ie.standard}function K(){var e;return(d==null?void 0:d.packageLevel)||((e=Re.find(t=>t.serial===I.serial))==null?void 0:e.packageLevel)||"standard"}function st(e={},t=K()){const a=new Set(J(t).thresholdKeys);return Object.fromEntries(Object.entries(e).filter(([n])=>a.has(n)))}function pa(){document.querySelectorAll(".threshold-input").forEach(e=>{e.addEventListener("click",()=>{v("info","Beginner thresholds are locked. Use Generate so AI can keep the device settings safe.")})})}async function ua(e=null){if(!I.serial.trim())return v("warning","Enter device serial"),null;const t=document.getElementById("registerDeviceBtn")||document.getElementById("bfNext");t&&(t.disabled=!0,t.textContent="Registering...");try{const a=await fetch(`${G}/api/devices/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({serial:I.serial.trim(),wifi_ssid:I.wifiSsid.trim(),wifi_password:I.wifiPassword,accountType:I.accountType,farmId:T.currentFarmId||"farm_001",fieldId:`field_${Date.now()}`})}),n=await a.json();if(!a.ok||!n.ok)throw new Error(n.error||"Device registration failed");return d=n.device,v("success","Device registered"),C(),d}catch(a){return v("error",a.message),null}finally{t&&(t.disabled=!1)}}async function q(e){try{return await e.json()}catch{return{}}}async function lt(){const e=document.getElementById("generateThresholdsBtn")||document.getElementById("bfNext");e&&(e.disabled=!0,e.textContent="Generating...");const t=(S.length?S:[]).map((a,n)=>({tier:Math.floor(n/(V().slotsPerTier||3))+1,plant_type:a.species||a.name}));try{const a=await fetch(`${G}/api/ai/generate-thresholds`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({plants:t,goal_priority:E,packageLevel:(d==null?void 0:d.packageLevel)||"standard"})}),n=await a.json();if(!a.ok||!n.ok)throw new Error(n.error||"Threshold generation failed");const o=(d==null?void 0:d.packageLevel)||K();return u={thresholds:st(n.thresholds||{},o),notes:n.notes||`${J(o).label} package thresholds generated. Locked sensors require a higher package.`,source:n.source},v("success",n.source==="ai"?"AI thresholds generated":"Fallback thresholds generated"),C(),u}catch(a){return v("error",a.message),null}finally{e&&(e.disabled=!1)}}async function fa(){var e;if(Q()){await ga();return}if(b===1){if(!d){(e=document.getElementById("deviceQrInput"))==null||e.click(),v("info","Scan the SeedDown package QR first");return}b=2,C();return}if(b===2){if(!c.name.trim()){v("warning","Enter a field name");return}b=3,C();return}if(b===3){if(!y){v("warning","Add a field photo before generating 3D");return}b=4,C();return}if(b===4){if(!u&&!await lt())return;b=5,C();return}b===5&&await ya()}async function ga(){var e;if(b===1){if(!c.name.trim()){v("warning","Enter a commercial farm name");return}b=2,C();return}if(b===2){if(!y){v("warning","Add a full farm photo first");return}if(!f&&!await Ue())return;b=3,C();return}if(b===3){if(!M.length){v("warning","Choose at least one commercial goal");return}b=4,C();return}if(b===4){if(!Ve()&&!await Ke())return;b=5,C();return}if(b===5){if(!Xe()){(e=document.getElementById("commercialDeviceQrInput"))==null||e.click(),v("info","Scan and assign all required commercial nodes");return}b=6,C();return}b===6&&await ba()}function ha(){if(b===1){dt();return}b-=1,C()}async function ge(e){var t,a;X(),(a=(t=ee).destroy)==null||a.call(t),e&&v("info",e);try{(await vt(()=>import("./FarmListPage-CX2jw3D4.js"),__vite__mapDeps([0,1,2,3]))).render()}catch(n){console.error("[BuildFarm] Direct FarmList fallback failed:",n),window.location.reload()}}function dt(){ge("New field creation cancelled")}async function va(e={}){if(!(d!=null&&d.deviceId))return{synced:!1,reason:"No registered device"};const t={"Content-Type":"application/json"};d.deviceToken&&!d.isDemoFallback&&(t["x-device-token"]=d.deviceToken);const a=await fetch(`${G}/api/sensors/preferences`,{method:"PUT",headers:t,body:JSON.stringify({deviceId:d.deviceId,fieldId:d.fieldId||null,farmId:d.farmId||T.currentFarmId||null,zoneId:d.zoneId||c.location.trim()||null,packageLevel:d.packageLevel,goalPriority:E,thresholdSource:(u==null?void 0:u.source)||"manual",thresholdNotes:(u==null?void 0:u.notes)||"",...e})}),n=await q(a);if(!a.ok||n.ok===!1)throw new Error(n.error||"Preference sync failed");return{synced:!0,preferences:n.preferences||n}}async function ya(){const e=document.getElementById("bfNext");e&&(e.disabled=!0,e.textContent="Creating...");const t=V(),a=(d==null?void 0:d.fieldId)||`field_${Date.now()}`,n=st((u==null?void 0:u.thresholds)||{},(d==null?void 0:d.packageLevel)||K()),o={name:c.name.trim(),location:c.location.trim(),description:c.description.trim(),rackType:c.rackType,rackConfig:c.customRack?{...c.customRack}:null,targetPlant:S.map(p=>p.name).join(", "),analysisGoal:E.join(","),viewMode:x,photoPreview:(y==null?void 0:y.dataUrl)||null,plants:S,deviceId:(d==null?void 0:d.deviceId)||"farm_001",serial:(d==null?void 0:d.serial)||I.serial,packageLevel:(d==null?void 0:d.packageLevel)||"standard",goalPriority:E,thresholds:n};let r=null;try{const p=await fetch(`${G}/api/farms/create`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...o,fieldId:a,zoneId:c.location.trim()||null,thresholdSource:(u==null?void 0:u.source)||"manual",thresholdNotes:(u==null?void 0:u.notes)||""})}),z=await q(p);p.ok&&(z!=null&&z.farmId)&&(r=z.farmId)}catch(p){console.warn("[BuildFarm] create field API unavailable:",p.message)}let l={synced:!1};if(d!=null&&d.deviceId)try{l=await va(n),v("success","Device thresholds synced")}catch(p){console.warn("[BuildFarm] preference sync skipped:",p.message),v("warning",`Field saved, but thresholds not synced: ${p.message}`)}const s=pt(),i={id:a,backendFarmId:r,name:o.name,location:o.location,description:o.description,zone:c.location.trim()||String.fromCharCode(65+s.length%26),rackTypeId:c.rackType,rackType:t.label,rackLabel:t.label,rackConfig:c.customRack?{...c.customRack}:null,targetPlant:o.targetPlant,analysisGoal:o.analysisGoal,deviceId:(d==null?void 0:d.deviceId)||"farm_001",deviceToken:(d==null?void 0:d.deviceToken)||null,serial:(d==null?void 0:d.serial)||I.serial,packageLevel:(d==null?void 0:d.packageLevel)||"standard",goalPriority:[...E],thresholds:{...n},thresholdSource:(u==null?void 0:u.source)||"manual",thresholdNotes:(u==null?void 0:u.notes)||"",preferenceSynced:!!l.synced,viewMode:x,photoPreview:o.photoPreview,plants:S.map(p=>({...p})),plantSlots:ve(),createdAt:new Date().toISOString()};if(s.push(i),localStorage.setItem(me,JSON.stringify(s)),T.uid)try{await yt(T.uid,s),console.log("[BuildFarm] ✅ Farm synced to Firebase")}catch(p){console.error("[BuildFarm] ❌ Failed to sync farm to Firebase",p)}T.newFarm=o,T.currentFarm=i,T.currentFarmId=i.id,T.farmName=i.name,v("success",`"${i.name}" field created`),X();const g={tomato:"🍅",mint:"🌿",basil:"🌿",chili:"🌶️",lettuce:"🥬",spinach:"🌿",carrot:"🥕",cucumber:"🥒",pepper:"🌶️",strawberry:"🍓",default:"🌱"},h=Array(9).fill(null);S.slice(0,9).forEach((p,z)=>{const $=(p.name||"").toLowerCase();h[z]=g[$]||g.default}),fetch(`${G}/api/community/visits/register-farm`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({farmLayout:h,displayName:i.name,avatar:"🧑‍🌾"})}).catch(()=>{}),setTimeout(()=>ge(),500)}async function ba(){F();const e=document.getElementById("bfNext");e&&(e.disabled=!0,e.textContent="Launching...");const t=pe||`farm_com_${Date.now()}`,a=f.zones.map(s=>{const i=O.find(p=>p.targetId===s.zone_id),g=A[s.zone_id]||{},h=U(s);return{...s,plantItems:h,plants:h.map(p=>p.name.toLowerCase()),plantCount:h.reduce((p,z)=>p+z.count,0),crop:h.map(p=>`${p.name} x ${p.count}`).join(", "),deviceId:(i==null?void 0:i.deviceId)||null,deviceToken:(i==null?void 0:i.deviceToken)||null,serial:(i==null?void 0:i.serial)||null,packageLevel:(i==null?void 0:i.packageLevel)||s.recommended_type,thresholds:g.thresholds||{},thresholdNotes:g.notes||"",thresholdSource:g.source||"manual"}}),n=O.find(s=>s.targetId==="farm_master")||null,o={name:c.name.trim(),location:c.location.trim(),description:c.description.trim(),farmSize:c.rackType||"medium",accountMode:"commercial",farmId:t,zones:a,commercialDevices:O,farmMaster:n,farmThresholds:(w==null?void 0:w.thresholds)||{},farmThresholdNotes:(w==null?void 0:w.notes)||"",farmThresholdSource:(w==null?void 0:w.source)||"manual",commercialStructure:f,goalPriority:M,targetPlant:a.map(s=>s.crop).join(", "),analysisGoal:M.join(","),photoPreview:(y==null?void 0:y.dataUrl)||null,plants:a.flatMap(s=>U(s).map((i,g)=>({name:i.name,species:String(i.name).toLowerCase().replace(/[^a-z0-9]+/g,"_"),emoji:he(i.name),zoneId:s.zone_id,zoneName:s.name,tier:g+1,slots:i.count}))),rackType:"commercial-multi-zone",viewMode:"commercial"};try{const s=await fetch(`${G}/api/farms/create`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}),i=await q(s);s.ok&&(i!=null&&i.farmId)&&(o.backendFarmId=i.farmId)}catch(s){console.warn("[BuildFarm] commercial farm API unavailable:",s.message)}await wa(t,n),await xa(t,a);const r=pt(),l={id:t,backendFarmId:o.backendFarmId||null,name:o.name,location:o.location,description:o.description,accountMode:"commercial",farmSize:o.farmSize,zones:a,commercialDevices:O.map(s=>({...s})),farmMaster:n,farmThresholds:o.farmThresholds,farmThresholdNotes:o.farmThresholdNotes,farmThresholdSource:o.farmThresholdSource,commercialStructure:f,goalPriority:[...M],analysisGoal:o.analysisGoal,targetPlant:o.targetPlant,rackTypeId:"commercial-multi-zone",rackType:"Commercial Multi-Zone Farm",rackLabel:`${a.length}-Zone Commercial Layout`,plantSlots:a.length*12,plants:o.plants,photoPreview:o.photoPreview,createdAt:new Date().toISOString()};r.push(l),localStorage.setItem(me,JSON.stringify(r)),T.currentFarm=l,T.currentFarmId=l.id,T.farmName=l.name,T.mode="commercial",v("success",`"${l.name}" commercial farm launched`),X(),setTimeout(()=>ge(),500)}async function xa(e,t){for(const a of t){if(!a.deviceId)continue;const n={"Content-Type":"application/json"};a.deviceToken&&(n["x-device-token"]=a.deviceToken);try{const o=await fetch(`${G}/api/sensors/preferences`,{method:"PUT",headers:n,body:JSON.stringify({deviceId:a.deviceId,farmId:e,zoneId:a.zone_id,packageLevel:a.packageLevel,goalPriority:M,thresholdSource:a.thresholdSource,thresholdNotes:a.thresholdNotes,...a.thresholds})}),r=await q(o);if(!o.ok||r.ok===!1)throw new Error(r.error||"Preference sync failed")}catch(o){console.warn(`[BuildFarm] commercial preference sync skipped for ${a.zone_id}:`,o.message)}}}async function wa(e,t){if(!(t!=null&&t.deviceId))return;const a={"Content-Type":"application/json"};t.deviceToken&&(a["x-device-token"]=t.deviceToken);try{const n=await fetch(`${G}/api/sensors/preferences`,{method:"PUT",headers:a,body:JSON.stringify({deviceId:t.deviceId,farmId:e,zoneId:"farm_master",packageLevel:t.packageLevel||"farm_master",goalPriority:M,thresholdSource:(w==null?void 0:w.source)||"manual",thresholdNotes:(w==null?void 0:w.notes)||"",...(w==null?void 0:w.thresholds)||{}})}),o=await q(n);if(!n.ok||o.ok===!1)throw new Error(o.error||"Farm master preference sync failed")}catch(n){console.warn("[BuildFarm] farm master preference sync skipped:",n.message)}}function Be(){const e=document.getElementById("manualPlantInput");if(!e)return;const t=e.value.trim();t&&(ct([Sa(t,3,0,"manual")]),e.value="",le(),v("success",`${t} added`))}function ka(e){const t=new Set;return String(e).split(/[,;\n]+/).map(a=>a.trim()).filter(Boolean).filter(a=>{const n=a.toLowerCase();return t.has(n)?!1:(t.add(n),!0)})}function ct(e){e.forEach(t=>{const a=mt(t),n=S.find(o=>o.species===a.species);n?(n.slots=Math.max(n.slots,a.slots),n.confidence=Math.max(n.confidence||0,a.confidence||0),n.source=a.source||n.source):S.push(a)})}function Sa(e,t=3,a=0,n="target"){const o=String(e||"").toLowerCase().trim();return mt({name:o.charAt(0).toUpperCase()+o.slice(1),emoji:he(o),species:o.replace(/\s+/g,"_"),confidence:a,slots:t,source:n})}function he(e=""){const t=String(e).toLowerCase().replace(/_/g," ");if(oe[t])return oe[t];const a=Object.keys(oe).find(n=>t.includes(n));return a?oe[a]:"🌱"}function mt(e){const t=e.name||"Plant",a=(e.species||t).toLowerCase().trim().replace(/\s+/g,"_");return{name:t,emoji:e.emoji||he(a),species:a,confidence:Math.max(0,Math.min(1,Number(e.confidence)||0)),slots:Math.max(1,Math.min(40,Number.parseInt(e.slots,10)||3)),source:e.source||"ai"}}function V(){return c.rackType==="photo-detected"&&c.customRack?c.customRack:se.find(e=>e.id===c.rackType)||se[0]}function ve(){return S.reduce((e,t)=>e+t.slots,0)}function za(e){var t;return((t=kt.find(a=>a.id===e))==null?void 0:t.label)||e}function Q(){try{const e=localStorage.getItem("seeddown_build_flow");if(e==="beginner")return T.mode="beginner",!1;if(e==="commercial"||localStorage.getItem("seeddown_mode")==="commercial")return T.mode="commercial",!0}catch{}return T.mode==="commercial"}function W(e,t){const a=document.getElementById(e);a&&(a.addEventListener("input",n=>t(n.target.value)),a.addEventListener("focus",()=>{a.style.borderColor="var(--accent)"}),a.addEventListener("blur",()=>{a.style.borderColor="var(--border)"}))}function pt(){try{return JSON.parse(localStorage.getItem(me))||[]}catch{return[]}}function X(){re&&(re(),re=null)}function m(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function Ca(e){return m(e)}export{La as render};
