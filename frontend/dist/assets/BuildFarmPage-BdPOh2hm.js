const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/FarmListPage-fjel2wQT.js","assets/index-G-Ja4GjB.js","assets/index-7FoRf0sk.css","assets/firebase-BieXTIEc.js"])))=>i.map(i=>d[i]);
import{A as P,a as g,_ as ft}from"./index-G-Ja4GjB.js";import{saveFarmsToFirestore as gt}from"./firebase-BieXTIEc.js";import{CommercialFarmCanvas as X}from"./CommercialFarmCanvas-D3XKKHtI.js";import{j as ht}from"./jsQR-D51eeal7.js";import*as k from"https://esm.sh/three@0.160.0";import{OrbitControls as vt}from"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const ce="user_farms",G=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;let v=1,h=null,b="realistic",ne=null,re=!1,T={serial:"SD-BGN-STD-00456",wifiSsid:"",wifiPassword:"",accountType:"beginner_standard"},d=null,D=["beginner_safe"],m=null,c={name:"",location:"",description:"",targetPlant:"",analysisGoal:"yield",rackType:"3-tier",customRack:null},S=[],u=null,_=["maximum_yield"],x=null,A={},O=[],I=null,me=null;const Be=[{id:"maximum_yield",label:"Maximum Yield"},{id:"profit_optimisation",label:"Profit Optimisation"},{id:"crop_safety_first",label:"Crop Safety First"},{id:"research_testing",label:"Research & Testing"},{id:"automation_first",label:"Automation First"},{id:"compliance_audit",label:"Compliance & Audit"}],yt=[{zone_id:"zone_A",name:"Zone A",recommended_type:"zone_node",crop:"Tomato / Chili / Basil",plants:["tomato","chili","basil"],confidence:.88,notes:"High-value crop area detected"},{zone_id:"zone_B",name:"Zone B",recommended_type:"zone_node",crop:"Lettuce",plants:["lettuce"],confidence:.82,notes:"Leafy green rack area detected"},{zone_id:"zone_C",name:"Zone C",recommended_type:"zone_node",crop:"Spinach",plants:["spinach"],confidence:.79,notes:"Standard greens area detected"}],le=[{id:"small",label:"Small Farm",standard:"1 grow room or pilot rack area",zones:"2 zones",area:"up to 30 m2",use:"SME trial, school lab, restaurant greens"},{id:"medium",label:"Medium Farm",standard:"several rack rows in one site",zones:"3 zones",area:"30-120 m2",use:"urban farm operator or institution"},{id:"large",label:"Large Farm",standard:"multi-room or high-density production floor",zones:"4 zones",area:"120+ m2",use:"commercial production with separate crop zones"}],ie=[{id:"2-tier",label:"2-Tier Starter Rack",icon:"II",tiers:2,slotsPerTier:3,total:6,shape:"rack",desc:"compact shelf for desk or balcony trials"},{id:"3-tier",label:"3-Tier Vertical Rack",icon:"III",tiers:3,slotsPerTier:3,total:9,shape:"rack",desc:"balanced demo rack with 9 plant slots"},{id:"4-tier",label:"4-Tier Grow Shelf",icon:"IV",tiers:4,slotsPerTier:4,total:16,shape:"rack",desc:"larger home rack for mixed greens"},{id:"5-tier",label:"5-Tier Tower Rack",icon:"V",tiers:5,slotsPerTier:4,total:20,shape:"tower",desc:"tall structure with dense stacking"},{id:"wall",label:"Wall Panel Grid",icon:"GRID",tiers:4,slotsPerTier:5,total:20,shape:"wall",desc:"flat wall-mounted grow panel"},{id:"a-frame",label:"A-Frame Pyramid",icon:"A",tiers:4,slotsPerTier:4,total:16,shape:"aframe",desc:"slanted frame for two-sided access"},{id:"nft-channel",label:"NFT Channel Rows",icon:"NFT",tiers:3,slotsPerTier:6,total:18,shape:"channel",desc:"hydroponic channel layout for leafy crops"},{id:"hanging",label:"Hanging Column Farm",icon:"COL",tiers:5,slotsPerTier:3,total:15,shape:"column",desc:"vertical column pots for herbs and vines"}],bt=[{id:"yield",label:"Yield"},{id:"health",label:"Health"},{id:"space",label:"Space fit"}],Ae=[{id:"healthy_growth",label:"Healthy Growth"},{id:"eco_save",label:"Eco Save"},{id:"low_maintenance",label:"Low Maintenance"},{id:"fast_harvest",label:"Fast Harvest"},{id:"cost_efficient",label:"Cost Efficient"},{id:"beginner_safe",label:"Beginner Safe"}],Oe=[{id:"beginner_starter",label:"Beginner Starter",serial:"SD-BGN-STR-00101",accountType:"beginner_starter",packageLevel:"starter",deviceType:"beginner",desc:"basic home sensor kit"},{id:"beginner_standard",label:"Beginner Standard",serial:"SD-BGN-STD-00456",accountType:"beginner_standard",packageLevel:"standard",deviceType:"beginner",desc:"balanced home vertical farm kit"},{id:"beginner_pro",label:"Beginner Pro",serial:"SD-BGN-PRO-00901",accountType:"beginner_pro",packageLevel:"pro",deviceType:"beginner",desc:"advanced home kit with more automation"},{id:"commercial_farm_master_1",label:"Commercial Farm Master Node 1",serial:"SD-COM-FRM-03001",accountType:"commercial_farm_master",packageLevel:"farm_master",deviceType:"commercial",desc:"farm-level controller, one per commercial farm"},{id:"commercial_farm_master_2",label:"Commercial Farm Master Node 2",serial:"SD-COM-FRM-03002",accountType:"commercial_farm_master",packageLevel:"farm_master",deviceType:"commercial",desc:"spare farm-level controller for demo or second farm"},{id:"commercial_farm_master_3",label:"Commercial Farm Master Node 3",serial:"SD-COM-FRM-03003",accountType:"commercial_farm_master",packageLevel:"farm_master",deviceType:"commercial",desc:"spare farm-level controller for demo or second farm"},{id:"commercial_farm_zone_1",label:"Commercial Farm + Zone Combo 1",serial:"SD-COM-FZK-02001",accountType:"commercial_farm_zone",packageLevel:"farm_zone",deviceType:"commercial",desc:"combo commercial node for farm or zone assignment"},{id:"commercial_farm_zone_2",label:"Commercial Farm + Zone Combo 2",serial:"SD-COM-FZK-02002",accountType:"commercial_farm_zone",packageLevel:"farm_zone",deviceType:"commercial",desc:"combo commercial node for farm or zone assignment"},{id:"commercial_farm_zone_3",label:"Commercial Farm + Zone Combo 3",serial:"SD-COM-FZK-02003",accountType:"commercial_farm_zone",packageLevel:"farm_zone",deviceType:"commercial",desc:"combo commercial node for farm or zone assignment"},{id:"commercial_zone_1",label:"Commercial Zone Node 1",serial:"SD-COM-ZON-01001",accountType:"commercial_zone",packageLevel:"zone_node",deviceType:"commercial",desc:"zone-level sensor and actuator node"},{id:"commercial_zone_2",label:"Commercial Zone Node 2",serial:"SD-COM-ZON-01002",accountType:"commercial_zone",packageLevel:"zone_node",deviceType:"commercial",desc:"zone-level sensor and actuator node"},{id:"commercial_zone_3",label:"Commercial Zone Node 3",serial:"SD-COM-ZON-01003",accountType:"commercial_zone",packageLevel:"zone_node",deviceType:"commercial",desc:"zone-level sensor and actuator node"},{id:"commercial_zone_4",label:"Commercial Zone Node 4",serial:"SD-COM-ZON-01004",accountType:"commercial_zone",packageLevel:"zone_node",deviceType:"commercial",desc:"zone-level sensor and actuator node"},{id:"commercial_zone_5",label:"Commercial Zone Node 5",serial:"SD-COM-ZON-01005",accountType:"commercial_zone",packageLevel:"zone_node",deviceType:"commercial",desc:"zone-level sensor and actuator node"},{id:"commercial_zone_basic",label:"Legacy Commercial Zone Node",serial:"SD-COM-ZNB-01001",accountType:"commercial_zone_basic",packageLevel:"zone_basic",deviceType:"commercial",desc:"legacy zone-level node, still supported"},{id:"commercial_zone_pro",label:"Legacy Commercial Zone Node Pro",serial:"SD-COM-ZNP-02001",accountType:"commercial_zone_pro",packageLevel:"zone_pro",deviceType:"commercial",desc:"legacy expanded zone-level node, still supported"},{id:"commercial_master",label:"Legacy Commercial Farm Master",serial:"SD-COM-MST-03001",accountType:"commercial_master",packageLevel:"farm_master",deviceType:"commercial",desc:"legacy master node for multi-zone farms"}],$e={starter:{label:"Starter",thresholdKeys:["tempMin","tempMax","humidityMin","humidityMax","soilDryThreshold","darkThreshold","wateringDurationSeconds","sensorIntervalSeconds"],lockedText:"Unlock with Standard / Pro"},standard:{label:"Standard",thresholdKeys:["tempMin","tempMax","humidityMin","humidityMax","soilDryThreshold","darkThreshold","phMin","phMax","gasDangerThreshold","wateringDurationSeconds","fanDurationSeconds","sensorIntervalSeconds"],lockedText:"Unlock with Pro"},pro:{label:"Pro",thresholdKeys:["tempMin","tempMax","humidityMin","humidityMax","soilDryThreshold","darkThreshold","phMin","phMax","ecMin","ecMax","co2MinPpm","gasDangerThreshold","waterLowCm","wateringDurationSeconds","fanDurationSeconds","sensorIntervalSeconds"],lockedText:""}},oe={lettuce:"🥬",spinach:"🌿",basil:"🌿",tomato:"🍅",carrot:"🥕",cabbage:"🥬",eggplant:"🍆",mint:"🌿",kale:"🥬",cucumber:"🥒",pepper:"🌶️",chili:"🌶️",strawberry:"🍓",bean:"🫘",pea:"🟢",chard:"🥬",arugula:"🌿",radish:"🌱",cilantro:"🌿",parsley:"🌿"};function za(){var a,o;v=1,h=null,b="realistic",re=!1;const e=Q();T=e?{serial:"SD-COM-FRM-03001",wifiSsid:"",wifiPassword:"",accountType:"commercial_farm_master"}:{serial:"SD-BGN-STD-00456",wifiSsid:"",wifiPassword:"",accountType:"beginner_standard"},d=null,D=e?["maximum_yield"]:["beginner_safe"],m=null,c={name:"",location:"",description:"",targetPlant:"",analysisGoal:"yield",rackType:e?"medium":"3-tier",customRack:null},S=[],u=null,_=["maximum_yield"],x=null,A={},O=[],I=null,me=e?`farm_com_${Date.now()}`:null,V(),(o=(a=X).destroy)==null||o.call(a);const t=document.getElementById("screenContainer");t.innerHTML=`
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
    `,document.getElementById("bfBack").addEventListener("click",ma),document.getElementById("bfCancel").addEventListener("click",it),document.getElementById("bfNext").addEventListener("click",da),z()}function z(){var o,n;if(Q()){xt();return}Re();const e=document.getElementById("bfContent"),t=document.getElementById("bfCancel"),a=document.getElementById("bfNext");e.innerHTML="",V(),(n=(o=X).destroy)==null||n.call(o),v===1&&(Ht(e),t.textContent="Cancel",a.textContent=d?"Next: Field Info":"Scan QR"),v===2&&(Yt(e),t.textContent="Back",a.textContent="Next: Add Photo"),v===3&&(Xe(e),t.textContent="Back",a.textContent="Next: AI Thresholds"),v===4&&(at(e),t.textContent="Back",a.textContent=m?"Next: 3D Preview":"Generate Thresholds"),v===5&&(tt(e),t.textContent="Preview Only",a.textContent="Create Field")}function xt(){Re();const e=document.getElementById("bfContent"),t=document.getElementById("bfCancel"),a=document.getElementById("bfNext");e.innerHTML="",V(),v===1&&(wt(e),t.textContent="Cancel",a.textContent="Next: Analyze Farm"),v===2&&(zt(e),t.textContent="Back",a.textContent=u?"Confirm Structure":"Analyze Zones"),v===3&&(Ge(e),t.textContent="Back",a.textContent="Next: Zone Thresholds"),v===4&&(Ct(e),t.textContent="Back",a.textContent=Ke()?"Next: Assign Devices":"Generate Zone Thresholds"),v===5&&(_t(e),t.textContent="Back",a.textContent=Ye()?"Next: Farm Overview":"Scan Device QR"),v===6&&(Mt(e),t.textContent="Back",a.textContent="Launch Farm")}function Re(){const e=Q()?["Farm","Zones","Goals","Thresholds","Devices","Launch"]:["Device","Field","Photo","Goals","3D"];document.getElementById("bfSteps").innerHTML=`
        <div style="display:grid;grid-template-columns:repeat(${e.length},1fr);gap:6px;padding-bottom:10px;">
            ${e.map((t,a)=>{const o=a+1<=v;return`
                    <div style="display:flex;align-items:center;gap:6px;min-width:0;">
                        <div style="width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;
                                    background:${o?"var(--accent)":"var(--border)"};
                                    color:${o?"#fff":"var(--muted)"};
                                    font-size:10px;font-weight:800;flex-shrink:0;">
                            ${a+1<v?"✓":a+1}
                        </div>
                        <div style="font-size:10px;font-weight:800;color:${a+1===v?"var(--accent)":"var(--muted)"};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                            ${t}
                        </div>
                    </div>
                `}).join("")}
        </div>
    `}function wt(e){const t=St();e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">COMMERCIAL FARM INFO</div>
                ${ee("fieldNameInput","Farm name","e.g. SeedDown Commercial Farm 1",c.name)}
                ${ee("fieldLocationInput","Location","e.g. Johor Bahru Industrial Park",c.location)}
                <div style="margin-bottom:10px;">
                    <div style="font-size:11px;font-weight:800;color:var(--sub);margin-bottom:8px;">Farm size standard</div>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        ${le.map(a=>kt(a)).join("")}
                    </div>
                    <div style="margin-top:9px;padding:10px;border-radius:12px;background:var(--surface2);border:1px solid var(--border);font-size:11px;color:var(--muted);line-height:1.45;">
                        Selected: <strong style="color:var(--text);">${p(t.label)}</strong> · ${p(t.standard)} · ${p(t.area)} · recommended ${p(t.zones)}.
                    </div>
                </div>
                <label style="display:block;margin-bottom:10px;">
                    <span style="display:block;font-size:11px;font-weight:800;color:var(--sub);margin-bottom:5px;">Description</span>
                    <textarea id="fieldDescriptionInput" placeholder="Optional notes about this commercial farm"
                        style="width:100%;min-height:92px;resize:vertical;padding:11px 12px;border:1.5px solid var(--border);border-radius:10px;background:var(--surface2);color:var(--text);font-size:14px;outline:none;line-height:1.4;">${p(c.description)}</textarea>
                </label>
                <div style="font-size:12px;color:var(--muted);line-height:1.45;">
                    Commercial setup analyzes the farm space first, then assigns QR devices to the right zones.
                </div>
            </section>
        </div>
    `,W("fieldNameInput",a=>{c.name=a}),W("fieldLocationInput",a=>{c.location=a}),W("fieldDescriptionInput",a=>{c.description=a}),document.querySelectorAll(".commercial-size-card").forEach(a=>{a.addEventListener("click",()=>{c.rackType=a.dataset.size||"medium",u=null,z()})})}function kt(e){const t=(c.rackType||"medium")===e.id;return`
        <button type="button" class="commercial-size-card" data-size="${e.id}"
            style="text-align:left;padding:12px;border-radius:13px;border:1.5px solid ${t?"var(--accent)":"var(--border)"};background:${t?"var(--accent-l)":"var(--surface2)"};color:var(--text);cursor:pointer;">
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;">
                <strong style="font-size:13px;color:${t?"var(--accent)":"var(--text)"};">${p(e.label)}</strong>
                <span style="font-size:10px;font-weight:900;color:${t?"var(--accent)":"var(--muted)"};">${t?"SELECTED":p(e.zones)}</span>
            </div>
            <div style="font-size:11px;color:var(--muted);line-height:1.4;margin-top:5px;">${p(e.standard)} · ${p(e.area)}</div>
            <div style="font-size:10px;color:var(--sub);line-height:1.35;margin-top:4px;">Best for: ${p(e.use)}</div>
        </button>
    `}function St(){return le.find(e=>e.id===(c.rackType||"medium"))||le[1]}function zt(e){var a,o,n;const t=(u==null?void 0:u.zones)||[];e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:12px;">
                    <div>
                        <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;">FULL FARM PHOTO</div>
                        <div style="font-size:12px;color:var(--muted);margin-top:4px;">Capture all racks or visible production areas before QR assignment.</div>
                    </div>
                    <div style="font-size:11px;font-weight:800;color:var(--accent);white-space:nowrap;">${h?"READY":"NEEDED"}</div>
                </div>
                <div id="photoPreview"
                     style="width:100%;height:220px;border-radius:12px;border:2px dashed ${h?"var(--accent)":"var(--border)"};
                            background:${h?`url(${h.dataUrl}) center/cover`:"var(--surface2)"};
                            display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;position:relative;">
                    ${h?'<div style="position:absolute;bottom:10px;right:10px;background:rgba(0,0,0,.58);color:white;padding:6px 10px;border-radius:8px;font-size:11px;font-weight:800;">Farm photo loaded</div>':`
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
                    <button id="analyzeCommercialZonesBtn" ${h?"":"disabled"}
                        style="padding:8px 10px;border-radius:999px;border:1px solid ${h?"var(--accent)":"var(--border)"};background:${h?"var(--accent-l)":"var(--surface2)"};color:${h?"var(--accent)":"var(--muted)"};font-size:11px;font-weight:900;cursor:${h?"pointer":"not-allowed"};">Analyze</button>
                </div>
                <div id="commercialZoneSummary">${It()}</div>
                ${t.length?`
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px;">
                        <button id="addCommercialZoneBtn" style="padding:11px;border:1px solid var(--border);border-radius:10px;background:var(--surface2);color:var(--text);font-weight:800;cursor:pointer;">Add Zone</button>
                        <button id="removeCommercialZoneBtn" style="padding:11px;border:1px solid rgba(220,38,38,.24);border-radius:10px;background:rgba(220,38,38,.08);color:var(--danger);font-weight:800;cursor:pointer;">Remove Last</button>
                    </div>
                `:""}
            </section>
        </div>
    `,et(e),(a=document.getElementById("analyzeCommercialZonesBtn"))==null||a.addEventListener("click",Qe),(o=document.getElementById("addCommercialZoneBtn"))==null||o.addEventListener("click",()=>{F();const r=u.zones.length;u.zones.push({zone_id:`zone_${String.fromCharCode(65+r)}`,name:`Zone ${String.fromCharCode(65+r)}`,recommended_type:"zone_node",crop:"Mixed Crops",plants:["lettuce"],confidence:.7,notes:"Manually added zone"}),u.total_devices_needed=u.farm_master_count+u.zones.length,z()}),(n=document.getElementById("removeCommercialZoneBtn"))==null||n.addEventListener("click",()=>{var r;((r=u==null?void 0:u.zones)==null?void 0:r.length)>1&&(u.zones.pop(),u.total_devices_needed=u.farm_master_count+u.zones.length,z())})}function Ge(e){e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">COMMERCIAL FARM GOALS</div>
                <div style="font-size:12px;color:var(--muted);line-height:1.45;margin-bottom:12px;">Select up to three commercial priorities. These are applied per zone when generating thresholds.</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    ${Be.map(t=>{const a=_.includes(t.id);return`<button class="commercial-goal-priority" data-id="${t.id}"
                            style="padding:12px 8px;border-radius:12px;border:1.5px solid ${a?"var(--accent)":"var(--border)"};background:${a?"var(--accent-l)":"var(--surface2)"};color:${a?"var(--accent)":"var(--text)"};font-weight:900;font-size:12px;cursor:pointer;">${t.label}</button>`}).join("")}
                </div>
            </section>
        </div>
    `,document.querySelectorAll(".commercial-goal-priority").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.id;_.includes(a)?_=_.filter(o=>o!==a):_.length<3?_=[..._,a]:g("warning","Choose up to 3 commercial goals"),x=null,A={},Ge(e)})})}function Ct(e){var t;F(),e.innerHTML=`
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
                    ${Lt()}
                    ${u.zones.map(Pt).join("")}
                </div>
            </section>
        </div>
    `,document.querySelectorAll(".zone-plant-input").forEach(a=>{a.addEventListener("change",o=>{const n=u.zones.find(r=>r.zone_id===o.target.dataset.zone);n&&(n.plants=Fe(o.target.value).map(r=>r.toLowerCase()),n.crop=Fe(o.target.value).join(", ")||n.crop,x=null,delete A[n.zone_id])})}),document.querySelectorAll(".commercial-threshold-input").forEach(a=>{a.addEventListener("input",o=>{const n=o.target.dataset.zone,r=o.target.dataset.key,l=o.target.value===""?void 0:Number(o.target.value);if(!n||!r||!Number.isFinite(l))return;if(n==="farm_master"){x||(x={thresholds:{},notes:"Manual farm-level threshold adjustment",source:"manual"}),x.thresholds[r]=l;const f=Ie(r,l),y=document.getElementById("commercialSafety_farm_master");y&&(y.textContent=f||"",y.style.display=f?"block":"none"),f&&g("warning",f);return}A[n]||(A[n]={thresholds:{},notes:"Manual commercial threshold adjustment",source:"manual"}),A[n].thresholds[r]=l;const s=Ie(r,l),i=document.getElementById(`commercialSafety_${n}`);i&&(i.textContent=s||"",i.style.display=s?"block":"none"),s&&g("warning",s)})}),(t=document.getElementById("generateCommercialThresholdsBtn"))==null||t.addEventListener("click",qe)}function _t(e){var a;F(),e.innerHTML=`
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
                <div id="commercialPendingDevice" style="margin-top:12px;">${Dt()}</div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">ASSIGNMENT PROGRESS</div>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    ${Ft()}
                </div>
            </section>
        </div>
    `;const t=document.getElementById("commercialDeviceQrInput");(a=document.getElementById("commercialScanQrBtn"))==null||a.addEventListener("click",()=>t==null?void 0:t.click()),t==null||t.addEventListener("change",o=>{var r;const n=(r=o.target.files)==null?void 0:r[0];n&&Bt(n),o.target.value=""}),document.querySelectorAll(".commercial-assign-target").forEach(o=>{o.addEventListener("click",()=>Ot(o.dataset.target))})}function Mt(e){F(),setTimeout(Tt,80),e.innerHTML=`
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
                    ${R("Zones",`${u.zones.length}`)}
                    ${R("Devices",`${O.length}/${u.total_devices_needed}`)}
                    ${R("Goals",_.map(Je).join(", "))}
                </div>
            </section>
        </div>
    `}function Tt(){var t,a;document.getElementById("commercialPreviewCanvas")&&(P.currentFarm=$t(),X.init("commercialPreviewCanvas"),(a=(t=X).setCameraFrame)==null||a.call(t,!1))}function $t(){F();const e=u.zones||[],t=[];return e.forEach((a,o)=>{var r;const n=(r=a.plants)!=null&&r.length?a.plants:["lettuce"];n.forEach((l,s)=>{t.push({name:l,species:l,slots:Math.max(3,Math.ceil(12/Math.max(1,n.length))),zoneId:a.zone_id,zoneName:a.name,slotIndex:o+s*Math.max(1,e.length),status:A[a.zone_id]?"healthy":"warning"})})}),{id:`commercial_preview_${Date.now()}`,name:c.name||"Commercial Farm Preview",accountMode:"commercial",rackTypeId:"5-tier",rackType:"Commercial Digital Twin",rackLabel:`${e.length||3}-Zone Commercial Facility`,targetPlant:e.map(a=>a.crop).filter(Boolean).join(", ")||"Commercial crops",plantSlots:Math.max(20,t.reduce((a,o)=>a+(o.slots||1),0)),plants:t,zones:e,commercialStructure:u,commercialDevices:O,createdAt:new Date().toISOString()}}function It(){return u?`
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
            ${R("Farm Master",u.farm_master_count)}
            ${R("ESP32 Needed",u.total_devices_needed)}
            ${R("Zones",u.zones.length)}
            ${R("Confidence",`${Math.round((u.confidence||.82)*100)}%`)}
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;">
            ${u.zones.map(e=>`
                <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px;">
                    <div style="min-width:0;">
                        <div style="font-size:13px;font-weight:900;">${p(e.name)} · ${p(e.crop||"Mixed Crops")}</div>
                        <div style="font-size:11px;color:var(--muted);margin-top:3px;">${p(e.notes||"")}</div>
                    </div>
                    <span style="padding:5px 8px;border-radius:999px;background:var(--accent-l);color:var(--accent);font-size:10px;font-weight:900;white-space:nowrap;">Zone Node</span>
                </div>
            `).join("")}
        </div>
    `:`
            <div style="padding:22px;border:1px dashed var(--border);border-radius:12px;background:var(--surface2);text-align:center;color:var(--muted);font-size:13px;line-height:1.45;">
                Add a farm photo, then run AI zone analysis. If AI is unavailable, SeedDown will use a safe commercial fallback.
            </div>
        `}function Lt(){const e=(x==null?void 0:x.thresholds)||{};return`
        <div style="background:linear-gradient(135deg,var(--accent-l),#fff);border:1.5px solid rgba(22,163,74,.22);border-radius:14px;padding:12px;">
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:10px;">
                <div>
                    <div style="font-size:13px;font-weight:900;color:var(--accent);">Farm Master Node</div>
                    <div style="font-size:10px;color:var(--muted);margin-top:3px;">Farm-level safety policy · shared emergency and monitoring thresholds</div>
                </div>
                <span style="font-size:10px;font-weight:900;color:${x?"var(--accent)":"var(--muted)"};">${x?"READY":"PENDING"}</span>
            </div>
            <div id="commercialSafety_farm_master" style="display:none;margin-bottom:10px;padding:8px 10px;border-radius:10px;background:rgba(245,158,11,.12);color:#b45309;font-size:11px;font-weight:800;line-height:1.35;"></div>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:12px;">
                ${je({zone_id:"farm_master"},e,"farm")}
            </div>
            <div style="padding:11px;border-radius:12px;background:rgba(255,255,255,.76);border:1px solid rgba(22,163,74,.14);">
                <div style="font-size:10px;font-weight:900;color:var(--sub);letter-spacing:.08em;margin-bottom:6px;">AI ANALYSIS</div>
                <div style="font-size:11px;color:var(--muted);line-height:1.55;">
                    ${Ze({name:"Farm Master Node",plants:He(),crop:"whole farm"},x,"farm")}
                </div>
            </div>
        </div>
    `}function Pt(e){const t=A[e.zone_id],a=(e.plants||[]).join(", "),o=(t==null?void 0:t.thresholds)||{};return`
        <div style="background:var(--surface2);border:1px solid var(--border);border-radius:14px;padding:12px;">
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:10px;">
                <div>
                    <div style="font-size:13px;font-weight:900;">${p(e.name)}</div>
                    <div style="font-size:10px;color:var(--muted);margin-top:3px;">Zone-level recipe · editable sensor and output thresholds</div>
                </div>
                <span style="font-size:10px;font-weight:900;color:${t?"var(--accent)":"var(--muted)"};">${t?"READY":"PENDING"}</span>
            </div>
            <input class="zone-plant-input" data-zone="${e.zone_id}" value="${p(a)}" placeholder="plants in this zone"
                style="width:100%;padding:10px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:var(--text);font-size:13px;outline:none;margin-bottom:10px;">
            <div id="commercialSafety_${e.zone_id}" style="display:none;margin-bottom:10px;padding:8px 10px;border-radius:10px;background:rgba(245,158,11,.12);color:#b45309;font-size:11px;font-weight:800;line-height:1.35;"></div>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:12px;">
                ${je(e,o,"zone")}
            </div>
            <div style="padding:11px;border-radius:12px;background:var(--surface);border:1px solid var(--border);">
                <div style="font-size:10px;font-weight:900;color:var(--sub);letter-spacing:.08em;margin-bottom:6px;">AI ANALYSIS</div>
                <div style="font-size:11px;color:var(--muted);line-height:1.5;">
                    ${Ze(e,t,"zone")}
                </div>
            </div>
        </div>
    `}function je(e,t={},a="zone"){return(a==="farm"?Nt():Et()).map(({key:n,label:r,unit:l,placeholder:s})=>`
        <label style="display:block;">
            <span style="display:block;font-size:10px;font-weight:900;color:var(--sub);margin-bottom:4px;text-transform:uppercase;">${p(r)}</span>
            <input class="commercial-threshold-input" data-zone="${e.zone_id}" data-key="${n}" type="number"
                value="${t[n]??""}" placeholder="${t[n]===void 0?s||"generate":""}"
                style="width:100%;padding:10px;border:1px solid var(--border);border-radius:10px;background:var(--surface);font-size:13px;font-weight:800;color:var(--text);outline:none;">
            ${l?`<span style="display:block;font-size:9px;color:var(--muted);margin-top:3px;">${p(l)}</span>`:""}
        </label>
    `).join("")}function Nt(){return[{key:"co2MinPpm",label:"CO2 min",unit:"CO2 Sensor · ppm",placeholder:"800"},{key:"co2MaxPpm",label:"CO2 max",unit:"CO2 Sensor · ppm",placeholder:"1500"},{key:"waterLowCm",label:"Reservoir low",unit:"HC-SR04 · cm distance",placeholder:"20"},{key:"waterCriticalCm",label:"Reservoir critical",unit:"HC-SR04 · cm distance",placeholder:"35"},{key:"gasDangerThreshold",label:"Gas danger",unit:"MQ-2 raw limit",placeholder:"3000"},{key:"energyDailyLimitKwh",label:"Energy limit",unit:"Power Meter · kWh/day",placeholder:"8"},{key:"mainFanDurationSeconds",label:"Main fan sec",unit:"Main Ventilation Fan output",placeholder:"20"},{key:"emergencyBuzzerSeconds",label:"Emergency buzz sec",unit:"Emergency Buzzer output",placeholder:"10"},{key:"sensorIntervalSeconds",label:"Farm poll sec",unit:"Farm master telemetry interval",placeholder:"300"}]}function Et(){return[{key:"tempMin",label:"Temp min",unit:"DHT11 · °C",placeholder:"18"},{key:"tempMax",label:"Temp max",unit:"DHT11 · °C",placeholder:"28"},{key:"humidityMin",label:"Humid min",unit:"DHT11 · %RH",placeholder:"50"},{key:"humidityMax",label:"Humid max",unit:"DHT11 · %RH",placeholder:"80"},{key:"soilDryThreshold",label:"Soil dry",unit:"Soil Moisture raw",placeholder:"2500"},{key:"darkThreshold",label:"Light dark",unit:"LDR raw",placeholder:"1500"},{key:"phMin",label:"pH min",unit:"pH Sensor",placeholder:"5.8"},{key:"phMax",label:"pH max",unit:"pH Sensor",placeholder:"6.8"},{key:"ecMin",label:"EC min",unit:"EC Sensor · mS/cm",placeholder:"1.2"},{key:"ecMax",label:"EC max",unit:"EC Sensor · mS/cm",placeholder:"2.0"},{key:"waterFlowMinLpm",label:"Flow min",unit:"YF-S201 · L/min",placeholder:"0.5"},{key:"wateringDurationSeconds",label:"Pump sec",unit:"Water Pump output",placeholder:"10"},{key:"growLightDurationSeconds",label:"Grow light sec",unit:"LED Grow Light output",placeholder:"30"},{key:"zoneFanDurationSeconds",label:"Zone fan sec",unit:"Zone Fan output",placeholder:"15"},{key:"activeBuzzerSeconds",label:"Alert buzz sec",unit:"Active Buzzer output",placeholder:"5"},{key:"cameraScanIntervalMinutes",label:"Camera scan min",unit:"Camera analysis interval",placeholder:"60"},{key:"diseaseConfidenceMin",label:"Disease confidence",unit:"Camera AI threshold · %",placeholder:"70"}]}function Ze(e,t,a="zone"){const o=_.map(Je).join(", ")||"Commercial optimisation",n=(e.plants||[]).join(", ")||e.crop||"mixed crops",r=a==="farm"?"the whole farm":e.name;if(!t)return`Generate thresholds to explain recommended sensor ranges, safety limits, and actuator timing for ${p(r)}. SeedDown will use the selected commercial goals, detected crops, and available device package to decide which thresholds should be active. Plants: ${p(n)}. Goals: ${p(o)}.`;const l=t.source==="ai"?"AI provider":t.source==="fallback"?"deterministic fallback":"manual edit",s=_.includes("profit_optimisation")?"Because profit optimisation is selected, the recipe avoids over-watering and long fan or light cycles unless readings show real risk.":_.includes("maximum_yield")?"Because maximum yield is selected, the recipe keeps the crop closer to its ideal growth band instead of only reacting at emergency levels.":_.includes("compliance_audit")?"Because compliance and audit is selected, the recipe keeps conservative sensor intervals and clearer safety boundaries for traceable operation.":"Because commercial operation is selected, the recipe balances crop health, automation cost, and operational safety.",i=a==="farm"?"Farm-level thresholds only cover shared infrastructure: CO2, reservoir depth from HC-SR04, MQ-2 gas, power meter consumption, main ventilation fan, and the emergency buzzer. These values protect the whole site even when each zone has a different crop recipe.":`Zone-level thresholds only cover independent growing zones: DHT11 temperature and humidity, soil moisture, LDR light, pH, EC, YF-S201 water flow, pump duration, grow light timing, zone fan timing, active buzzer warning, and camera scan confidence for ${p(n)}.`,f=t.notes||(a==="farm"?"Farm-level thresholds generated for master safety control.":"Thresholds generated for this zone.");return`${p(f)} Source: ${p(l)}. ${i} ${s} Plants considered: ${p(n)}. Goals considered: ${p(o)}. Safety guardrails are not relaxed for gas, abnormal temperature, pH, water level, or actuator duration, so manual edits outside a safe range will trigger warnings.`}function He(){F();const e=u.zones.flatMap(t=>{var a;return(a=t.plants)!=null&&a.length?t.plants:[t.crop||"lettuce"]});return[...new Set(e.map(t=>String(t).trim()).filter(Boolean))]}function Ie(e,t){return{tempMin:t<5||t>30?"Temperature minimum is outside a safe commercial crop range.":"",tempMax:t<15||t>40?"Temperature maximum is outside a safe commercial crop range.":"",humidityMin:t<25||t>90?"Humidity minimum looks unsafe or unrealistic.":"",humidityMax:t<40||t>98?"Humidity maximum may create disease risk or sensor error.":"",phMin:t<4.5||t>7.5?"pH minimum is outside common hydroponic safety range.":"",phMax:t<5||t>8.5?"pH maximum is outside common hydroponic safety range.":"",gasDangerThreshold:t>4e3?"Gas danger threshold is too high and may delay emergency alerts.":"",waterLowCm:t<1||t>35?"Water-low distance may be unsafe for reservoir monitoring.":"",waterCriticalCm:t<5||t>60?"Reservoir critical distance is outside practical HC-SR04 monitoring range.":"",co2MaxPpm:t<800||t>2500?"CO2 maximum is outside safe commercial ventilation planning range.":"",energyDailyLimitKwh:t<.5||t>80?"Energy daily limit looks unrealistic for a commercial farm size.":"",mainFanDurationSeconds:t>600?"Main ventilation fan duration is very long; check energy impact.":"",emergencyBuzzerSeconds:t>120?"Emergency buzzer duration is too long for practical alerts.":"",wateringDurationSeconds:t>120?"Watering duration is very long and may flood the zone.":"",fanDurationSeconds:t>300?"Fan duration is very long; check energy and crop stress impact.":"",growLightDurationSeconds:t>14400?"Grow light duration is very long and may waste energy.":"",zoneFanDurationSeconds:t>600?"Zone fan duration is very long; check energy and crop stress impact.":"",activeBuzzerSeconds:t>120?"Active buzzer duration is too long for a zone warning.":"",waterFlowMinLpm:t<0||t>10?"Water flow threshold is outside practical YF-S201 range.":"",cameraScanIntervalMinutes:t<1||t>1440?"Camera scan interval should stay between 1 minute and 24 hours.":"",diseaseConfidenceMin:t<40||t>95?"Disease confidence threshold should stay practical to avoid false alarms or missed cases.":"",sensorIntervalSeconds:t<5||t>86400?"Sensor interval is outside practical monitoring range.":"",ecMin:t<.2||t>4?"EC minimum is outside practical nutrient monitoring range.":"",ecMax:t<.5||t>6?"EC maximum is outside practical nutrient monitoring range.":"",co2MinPpm:t<250||t>2e3?"CO2 minimum is outside normal commercial monitoring range.":""}[e]||""}function Dt(){if(!I)return'<div style="font-size:12px;color:var(--muted);line-height:1.45;">No commercial QR scanned yet.</div>';const e=At(I);return`
        <div style="border:1px solid var(--border);border-radius:14px;background:var(--surface2);padding:12px;">
            <div style="font-size:12px;font-weight:900;color:var(--text);">${p(I.label||I.serial)}</div>
            <div style="font-size:10px;color:var(--muted);margin-top:3px;">${p(I.serial)} · choose assignment target</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;">
                ${e.map(t=>`
                    <button class="commercial-assign-target" data-target="${t.id}" ${t.disabled?"disabled":""}
                        style="padding:10px;border-radius:10px;border:1px solid ${t.disabled?"var(--border)":"var(--accent)"};background:${t.disabled?"var(--surface)":"var(--accent-l)"};color:${t.disabled?"var(--muted)":"var(--accent)"};font-weight:900;cursor:${t.disabled?"not-allowed":"pointer"};opacity:${t.disabled?".55":"1"};">
                        ${p(t.label)}
                    </button>
                `).join("")}
            </div>
        </div>
    `}function Ft(){return F(),[{id:"farm_master",label:"Farm Master Node",required:"farm_master"},...u.zones.map(t=>({id:t.zone_id,label:t.name,required:"zone_node"}))].map(t=>{const a=O.find(o=>o.targetId===t.id);return`
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px;">
                <div>
                    <div style="font-size:13px;font-weight:900;">${p(t.label)}</div>
                    <div style="font-size:10px;color:var(--muted);margin-top:3px;">Needs ${t.required==="farm_master"?"Farm Master Node":"Zone Node"}</div>
                </div>
                <span style="font-size:10px;font-weight:900;color:${a?"var(--accent)":"var(--muted)"};">${a?p(a.serial):"UNASSIGNED"}</span>
            </div>
        `}).join("")}async function Qe(){if(!h)return g("warning","Add a commercial farm photo first"),null;const e=document.getElementById("analyzeCommercialZonesBtn");e&&(e.disabled=!0,e.textContent="Analyzing...");try{await de()}catch{}return u=We(),g("success",`${u.zones.length} commercial zones recommended`),z(),u}function We(){const e=c.rackType||"medium",t=e==="large"?4:e==="small"?2:3,a=S.length?S.map(n=>n.name||n.species||"lettuce"):["tomato","lettuce","spinach","strawberry"],o=Array.from({length:t},(n,r)=>{const l=yt[r]||{zone_id:`zone_${String.fromCharCode(65+r)}`,name:`Zone ${String.fromCharCode(65+r)}`,recommended_type:"zone_node",crop:a[r%a.length],plants:[a[r%a.length]],confidence:.78,notes:"AI fallback zone recommendation"},s=a[r%a.length];return{...l,zone_id:`zone_${String.fromCharCode(65+r)}`,name:`Zone ${String.fromCharCode(65+r)}`,crop:s,plants:[s.toLowerCase()]}});return{farm_master_count:1,zones:o,total_devices_needed:o.length+1,confidence:.84,rack_count:t*2,scale:e}}function F(){u||(u=We())}async function qe(){var t;F();const e=document.getElementById("generateCommercialThresholdsBtn")||document.getElementById("bfNext");e&&(e.disabled=!0,e.textContent="Generating...");try{const a=He().map((r,l)=>({tier:l+1,plant_type:r})),o=await fetch(`${G}/api/ai/generate-thresholds`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({plants:a,goal_priority:_,packageLevel:"farm_master"})}),n=await q(o);if(!o.ok||!n.ok)throw new Error(n.error||"Farm-level threshold generation failed");x={thresholds:Rt(n.thresholds||{}),notes:n.notes,source:n.source};for(const r of u.zones){const l=((t=r.plants)!=null&&t.length?r.plants:["lettuce"]).map((f,y)=>({tier:y+1,plant_type:f})),s=await fetch(`${G}/api/ai/generate-thresholds`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({plants:l,goal_priority:_,packageLevel:r.recommended_type})}),i=await q(s);if(!s.ok||!i.ok)throw new Error(i.error||`Threshold generation failed for ${r.name}`);A[r.zone_id]={thresholds:Gt(i.thresholds||{},r),notes:i.notes,source:i.source}}return g("success","Farm and zone thresholds generated"),z(),A}catch(a){return g("error",a.message),null}finally{e&&(e.disabled=!1)}}function Bt(e){const t=new FileReader;t.onload=async a=>{try{const o=await Ve(a.target.result),n=pe(o);if(n.deviceType!=="commercial")throw new Error("This QR is for Beginner. Commercial setup requires COM device QR.");I=n,g("info",`Scanned ${n.label||n.serial}`),z()}catch(o){g("error",o.message||"Could not read QR code")}},t.readAsDataURL(e)}function At(e){F();const t=new Set(O.map(o=>o.targetId));return[{id:"farm_master",label:"Farm Master Node",required:"farm_master"},...u.zones.map(o=>({id:o.zone_id,label:o.name,required:"zone_node"}))].map(o=>{const n=Ue(e,o.required),r=t.has(o.id);return{...o,disabled:!n||r}})}function Ue(e,t){const a=e.packageLevel||e.id||"",o=String(e.serial||"");return t==="farm_master"?a==="farm_master"||a==="farm_zone"||o.includes("FRM")||o.includes("FZK")||o.includes("MST"):t==="zone_node"?["zone_node","farm_zone","zone_basic","zone_pro"].includes(a)||o.includes("ZON")||o.includes("FZK")||o.includes("ZNB")||o.includes("ZNP"):!1}async function Ot(e){if(!I)return;F();const t=e==="farm_master"?{required:"farm_master"}:u.zones.find(r=>r.zone_id===e);if(!t)return;const a=t.required||t.recommended_type||"zone_node";if(!Ue(I,a)){g("error","Device type does not match this target");return}const o=me||`farm_com_${Date.now()}`,n=I.accountType||(I.packageLevel==="farm_master"?"commercial_farm_master":I.packageLevel==="farm_zone"?"commercial_farm_zone":I.packageLevel==="zone_node"?"commercial_zone":I.packageLevel==="zone_pro"?"commercial_zone_pro":"commercial_zone_basic");try{const r=await fetch(`${G}/api/devices/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({serial:I.serial,wifi_ssid:T.wifiSsid.trim(),wifi_password:T.wifiPassword,accountType:n,farmId:o,zoneId:e==="farm_master"?null:e})}),l=await q(r);if(!r.ok||!l.ok)throw new Error(l.error||"Device assignment failed");Le(l.device,e),g("success","Device assigned")}catch(r){const l=Zt(I,e,o);Le(l,e),g("warning",`Backend register failed, using demo device: ${r.message}`)}I=null,z()}function Rt(e={}){return{co2MinPpm:Number(e.co2MinPpm??800),co2MaxPpm:Number(e.co2MaxPpm??1500),waterLowCm:Number(e.waterLowCm??20),waterCriticalCm:Number(e.waterCriticalCm??35),gasDangerThreshold:Number(e.gasDangerThreshold??3e3),energyDailyLimitKwh:Number(e.energyDailyLimitKwh??jt()),mainFanDurationSeconds:Number(e.mainFanDurationSeconds??e.fanDurationSeconds??20),emergencyBuzzerSeconds:Number(e.emergencyBuzzerSeconds??10),sensorIntervalSeconds:Number(e.sensorIntervalSeconds??300)}}function Gt(e={},t={}){return{tempMin:Number(e.tempMin??18),tempMax:Number(e.tempMax??28),humidityMin:Number(e.humidityMin??50),humidityMax:Number(e.humidityMax??80),soilDryThreshold:Number(e.soilDryThreshold??2500),darkThreshold:Number(e.darkThreshold??1500),phMin:Number(e.phMin??5.8),phMax:Number(e.phMax??6.8),ecMin:Number(e.ecMin??1.2),ecMax:Number(e.ecMax??2),waterFlowMinLpm:Number(e.waterFlowMinLpm??.5),wateringDurationSeconds:Number(e.wateringDurationSeconds??10),growLightDurationSeconds:Number(e.growLightDurationSeconds??(String(t.crop||"").toLowerCase().includes("lettuce")?45:30)),zoneFanDurationSeconds:Number(e.zoneFanDurationSeconds??e.fanDurationSeconds??15),activeBuzzerSeconds:Number(e.activeBuzzerSeconds??5),cameraScanIntervalMinutes:Number(e.cameraScanIntervalMinutes??60),diseaseConfidenceMin:Number(e.diseaseConfidenceMin??70)}}function jt(){const e=c.rackType||"medium";return e==="small"?4:e==="large"?20:10}function Le(e,t){O=[...O.filter(a=>a.targetId!==t&&a.deviceId!==e.deviceId),{...e,targetId:t,zoneId:t==="farm_master"?null:t,role:t==="farm_master"?"farm_master":"zone_node"}]}function Zt(e={},t,a){const o=String(e.serial||`SD-COM-DEMO-${Date.now()}`).toUpperCase(),n=o.split("-").pop()||String(Date.now()).slice(-5),r=e.packageLevel||(t==="farm_master"?"farm_master":"zone_node");return{deviceId:`dev_commercial_${r}_${n}`.toLowerCase().replace(/[^a-z0-9_]/g,"_"),deviceToken:`demo_token_${n}`,serial:o,deviceType:"commercial",packageLevel:r,farmId:a,zoneId:t==="farm_master"?null:t,nodeType:r,status:"demo-assigned",isDemoFallback:!0}}function Ke(){return F(),!!x&&u.zones.every(e=>!!A[e.zone_id])}function Ye(){return F(),["farm_master",...u.zones.map(t=>t.zone_id)].every(t=>O.some(a=>a.targetId===t))}function Je(e){var t;return((t=Be.find(a=>a.id===e))==null?void 0:t.label)||String(e).replace(/_/g," ")}function Ht(e){var a;e.innerHTML=`
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
                    ${d?`Linked ${p(d.deviceId)} · ${p(d.packageLevel)} · ${p(d.serial||T.serial)}`:"No QR scanned yet."}
                </div>
                ${d?Qt():""}
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">WIFI SETUP</div>
                ${ee("wifiSsidInput","WiFi SSID","Your WiFi name",T.wifiSsid)}
                <label style="display:block;margin-bottom:10px;">
                    <span style="display:block;font-size:11px;font-weight:800;color:var(--sub);margin-bottom:5px;">WiFi password</span>
                    <input id="wifiPasswordInput" type="password" value="${p(T.wifiPassword)}" placeholder="stored only for setup simulation"
                        style="width:100%;padding:11px 12px;border:1.5px solid var(--border);border-radius:10px;background:var(--surface2);color:var(--text);font-size:14px;outline:none;">
                </label>
            </section>
        </div>
    `,W("wifiSsidInput",o=>{T.wifiSsid=o,d=null}),W("wifiPasswordInput",o=>{T.wifiPassword=o,d=null});const t=document.getElementById("deviceQrInput");(a=document.getElementById("scanQrBtn"))==null||a.addEventListener("click",()=>t==null?void 0:t.click()),t==null||t.addEventListener("change",o=>{var r;const n=(r=o.target.files)==null?void 0:r[0];n&&Wt(n),o.target.value=""})}function Qt(){const e=U(),t=Y(e),a=ue().filter(o=>!t.thresholdKeys.includes(o.key)).map(o=>o.label).slice(0,4);return`
        <div style="margin-top:12px;padding:11px;border-radius:12px;background:var(--accent-l);border:1px solid rgba(22,163,74,.16);">
            <div style="font-size:11px;font-weight:900;color:var(--accent);margin-bottom:4px;">${p(t.label)} package detected</div>
            <div style="font-size:11px;color:var(--muted);line-height:1.45;">
                Threshold generation will only enable sensors included in this QR package.
                ${a.length?` Locked: ${a.join(", ")}${a.length>=4?"...":""}`:" All threshold controls are unlocked."}
            </div>
        </div>
    `}function Wt(e){const t=new FileReader;t.onload=async a=>{try{const o=await Ve(a.target.result);await Ut(o)}catch(o){g("error",o.message||"Could not read QR code")}},t.readAsDataURL(e)}function Ve(e){return new Promise((t,a)=>{const o=new Image;o.onload=()=>{const n=document.createElement("canvas");n.width=o.naturalWidth||o.width,n.height=o.naturalHeight||o.height;const r=n.getContext("2d",{willReadFrequently:!0});r.drawImage(o,0,0,n.width,n.height);const l=r.getImageData(0,0,n.width,n.height),s=ht(l.data,l.width,l.height);if(!(s!=null&&s.data)){a(new Error("QR not detected. Try the generated SeedDown QR png."));return}try{t(qt(s.data))}catch(i){a(i)}},o.onerror=()=>a(new Error("Unable to load QR image")),o.src=e})}function qt(e){const t=String(e||"").trim();let a;try{a=JSON.parse(t)}catch{a={serial:t}}if(a.type&&a.type!=="seeddown_device_qr")throw new Error("This is not a SeedDown device QR");if(!a.serial)throw new Error("QR does not contain a device serial");return pe(a)}async function Ut(e){const t=pe(e);T.serial=t.serial,T.accountType=t.accountType,d=null,g("info",`Scanned ${t.label||t.serial}`),await la(t)}function pe(e={}){const t=String(e.serial||"").trim().toUpperCase(),a=Oe.find(n=>n.serial===t);return a?{...a,...e,serial:t}:{...Kt(t),...e,serial:t}}function Kt(e){return e.startsWith("SD-BGN-STR")?{label:"Beginner Starter",accountType:"beginner_starter",packageLevel:"starter",deviceType:"beginner",desc:"basic home sensor kit"}:e.startsWith("SD-BGN-STD")?{label:"Beginner Standard",accountType:"beginner_standard",packageLevel:"standard",deviceType:"beginner",desc:"balanced home vertical farm kit"}:e.startsWith("SD-BGN-PRO")?{label:"Beginner Pro",accountType:"beginner_pro",packageLevel:"pro",deviceType:"beginner",desc:"advanced home kit with more automation"}:e.startsWith("SD-COM-FRM")||e.startsWith("SD-COM-MST")?{label:"Commercial Farm Master Node",accountType:"commercial_farm_master",packageLevel:"farm_master",deviceType:"commercial",desc:"farm-level controller"}:e.startsWith("SD-COM-FZK")?{label:"Commercial Farm + Zone Combo",accountType:"commercial_farm_zone",packageLevel:"farm_zone",deviceType:"commercial",desc:"farm or zone compatible node"}:e.startsWith("SD-COM-ZON")||e.startsWith("SD-COM-ZNB")||e.startsWith("SD-COM-ZNP")?{label:"Commercial Zone Node",accountType:"commercial_zone",packageLevel:"zone_node",deviceType:"commercial",desc:"zone-level sensor and actuator node"}:{label:e||"Unknown QR",accountType:"",packageLevel:"",deviceType:"",desc:"unknown device QR"}}function Yt(e){e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">FIELD INFO</div>
                ${ee("fieldNameInput","Field name","e.g. Balcony Trial A",c.name)}
                ${ee("fieldLocationInput","Location / zone","e.g. Balcony, Lab Corner, Zone A",c.location)}
                <label style="display:block;margin-bottom:10px;">
                    <span style="display:block;font-size:11px;font-weight:800;color:var(--sub);margin-bottom:5px;">Description</span>
                    <textarea id="fieldDescriptionInput" placeholder="Optional notes about this field"
                        style="width:100%;min-height:92px;resize:vertical;padding:11px 12px;border:1.5px solid var(--border);border-radius:10px;background:var(--surface2);color:var(--text);font-size:14px;outline:none;line-height:1.4;">${p(c.description)}</textarea>
                </label>
                <div style="font-size:12px;color:var(--muted);line-height:1.45;">
                    Plant analysis, crop goals, and device thresholds are handled in the next steps after photo scanning.
                </div>
            </section>
        </div>
    `,W("fieldNameInput",t=>{c.name=t}),W("fieldLocationInput",t=>{c.location=t}),W("fieldDescriptionInput",t=>{c.description=t})}function ee(e,t,a,o){return`
        <label style="display:block;margin-bottom:10px;">
            <span style="display:block;font-size:11px;font-weight:800;color:var(--sub);margin-bottom:5px;">${t}</span>
            <input id="${e}" type="text" value="${p(o)}" placeholder="${a}"
                style="width:100%;padding:11px 12px;border:1.5px solid var(--border);border-radius:10px;
                       background:var(--surface2);color:var(--text);font-size:14px;outline:none;">
        </label>
    `}function Jt(e){const t=c.rackType===e.id;return`
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
                <span style="display:block;font-size:10px;color:var(--sub);margin-top:3px;line-height:1.25;">${p(e.desc||"")}</span>
            </span>
            <span style="font-size:18px;color:${t?"var(--accent)":"var(--muted)"};">${t?"✓":"+"}</span>
        </button>
    `}function Vt(){document.querySelectorAll(".rack-opt").forEach(e=>{e.addEventListener("click",()=>{c.rackType=e.dataset.id||c.rackType,c.customRack=null,m=null,z()})})}function Xe(e){e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:12px;">
                    <div>
                        <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;">FIELD PHOTO</div>
                        <div style="font-size:12px;color:var(--muted);margin-top:4px;">Capture the vertical setup so the preview can match the real field.</div>
                    </div>
                    <div style="font-size:11px;font-weight:800;color:var(--accent);white-space:nowrap;">${h?"READY":"NEEDED"}</div>
                </div>

                <div id="photoPreview"
                     style="width:100%;height:220px;border-radius:12px;border:2px dashed ${h?"var(--accent)":"var(--border)"};
                            background:${h?`url(${h.dataUrl}) center/cover`:"var(--surface2)"};
                            display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;position:relative;">
                    ${h?`
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
                        <div id="scanStatus" style="font-size:11px;color:var(--muted);margin-top:3px;">${h?"Ready to scan or edit manually":"Add a photo, or continue with manual plants"}</div>
                    </div>
                    <button id="scanBtn" ${h?"":"disabled"}
                        style="padding:7px 10px;border-radius:20px;border:1px solid ${h?"var(--accent)":"var(--border)"};
                               background:${h?"var(--accent-l)":"var(--surface2)"};
                               color:${h?"var(--accent)":"var(--muted)"};
                               font-size:11px;font-weight:800;cursor:${h?"pointer":"not-allowed"};">
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
                    <span id="structureStatus" style="font-size:10px;font-weight:900;color:var(--accent);">${J().label}</span>
                </div>
                <div style="display:flex;flex-direction:column;gap:8px;max-height:260px;overflow:auto;">
                    ${ie.map(Jt).join("")}
                </div>
            </section>
        </div>
    `,se(),et(e),document.getElementById("scanBtn").addEventListener("click",de),document.getElementById("manualAddBtn").addEventListener("click",De),document.getElementById("manualPlantInput").addEventListener("keypress",t=>{t.key==="Enter"&&De()}),Vt(),h&&!re&&(re=!0,de())}function et(e){const t=document.getElementById("photoInput");document.getElementById("photoPreview").addEventListener("click",()=>t.click()),document.getElementById("cameraBtn").addEventListener("click",()=>{t.setAttribute("capture","environment"),t.click()}),document.getElementById("galleryBtn").addEventListener("click",()=>{t.removeAttribute("capture"),t.click()}),t.addEventListener("change",a=>{const o=a.target.files[0];if(!o)return;const n=new FileReader;n.onload=r=>{var y;const l=r.target.result,[s,i]=l.split(","),f=((y=s.match(/:(.*?);/))==null?void 0:y[1])||"image/jpeg";h={base64:i,mediaType:f,dataUrl:l},re=!1,Q()?z():Xe(e)},n.readAsDataURL(o)})}function se(){const e=document.getElementById("plantList");if(e){if(S.length===0){e.innerHTML=`
            <div style="padding:22px;border:1px dashed var(--border);border-radius:12px;background:var(--surface2);text-align:center;color:var(--muted);font-size:13px;">
                No plants yet. Add the target plant or scan a photo.
            </div>
        `;return}e.innerHTML=S.map((t,a)=>`
        <div style="display:flex;align-items:center;gap:10px;background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px;">
            <div style="font-size:26px;line-height:1;flex-shrink:0;">${t.emoji}</div>
            <div style="flex:1;min-width:0;">
                <div style="font-size:13px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p(t.name)}</div>
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
    `).join(""),e.querySelectorAll("button[data-action]").forEach(t=>{t.addEventListener("click",()=>{const a=Number(t.dataset.idx),o=t.dataset.action;o==="inc"&&(S[a].slots=Math.min(40,S[a].slots+1)),o==="dec"&&(S[a].slots=Math.max(1,S[a].slots-1)),o==="remove"&&S.splice(a,1),se()})})}}async function de(){if(!h){g("warning","Add a field photo first");return}const e=document.getElementById("scanBtn"),t=document.getElementById("scanStatus");e&&(e.textContent="Scanning...",e.disabled=!0),t&&(t.textContent="AI is checking the field photo...");try{const o=await(await fetch(`${G}/api/farms/scan-plants`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:h.base64,mediaType:h.mediaType,targetPlant:c.targetPlant})})).json(),n=Array.isArray(o.plants)?o.plants:[],r=o.structure||o.rack||o.layout;let l=na(r);n.length?(st(n),l=ot(r)||l,g("success",`${n.length} plant type${n.length>1?"s":""} detected${l?" + structure matched":""}`),t&&(t.textContent=`Review plants and ${l?"detected structure":"structure"} before generating 3D.`)):(t&&(t.textContent=l?"Structure detected. Add plants manually if needed.":o.warning||"No clear plant detected. Manual list is still usable."),g("info",l?"Structure detected from photo":"No plant detected from photo yet"))}catch{t&&(t.textContent="Photo scan unavailable. Manual plant list is ready."),g("warning","AI scan unavailable, continue manually")}finally{e&&(e.textContent="Scan Photo",e.disabled=!1),se(),!Q()&&v===3&&z()}}function tt(e){var n;ot();const t=J(),a=he(),o=((n=S[0])==null?void 0:n.name)||"Field";e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:var(--shadow-sm);">
                <div style="padding:12px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:10px;">
                    <div style="min-width:0;">
                        <div style="font-size:14px;font-weight:900;">${p(o)} Vertical 3D</div>
                        <div style="font-size:11px;color:var(--muted);margin-top:2px;">Drag to orbit · Toggle for gamified view</div>
                    </div>
                    <div style="display:flex;background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:3px;flex-shrink:0;">
                        <button class="view-toggle" data-mode="realistic"
                            style="${Pe(b==="realistic")}">Real</button>
                        <button class="view-toggle" data-mode="gamified"
                            style="${Pe(b==="gamified")}">Game</button>
                    </div>
                </div>
                <div style="position:relative;background:#10141d;">
                    <canvas id="farmCanvas3D" style="width:100%;height:clamp(300px,44dvh,560px);display:block;"></canvas>
                    <div id="canvas3DOverlay"
                         style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
                                background:rgba(16,20,29,.74);color:rgba(255,255,255,.78);font-size:13px;">
                        Building 3D field...
                    </div>
                    ${h?`
                        <img src="${h.dataUrl}" alt="Field source photo"
                             style="position:absolute;right:10px;bottom:10px;width:70px;height:70px;border-radius:10px;
                                    object-fit:cover;border:2px solid rgba(255,255,255,.45);box-shadow:0 8px 20px rgba(0,0,0,.22);">
                    `:""}
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">ANALYSIS SNAPSHOT</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                    ${R("Target plant",o)}
                    ${R("Goal",ya(c.analysisGoal))}
                    ${R("Structure",t.label)}
                    ${R("Slots",`${a}/${t.total}`,a>t.total?"var(--danger)":"var(--ok)")}
                </div>
                <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px;">
                    ${S.map(r=>`
                        <span style="padding:5px 9px;border-radius:20px;background:var(--ok-bg);color:var(--ok);font-size:12px;font-weight:800;">
                            ${r.emoji} ${p(r.name)} ×${r.slots}
                        </span>
                    `).join("")}
                </div>
            </section>
        </div>
    `,document.querySelectorAll(".view-toggle").forEach(r=>{r.addEventListener("click",()=>{b=r.dataset.mode,tt(e)})}),setTimeout(()=>Xt(t),100)}function Pe(e){return["border:none","border-radius:8px","padding:7px 10px","font-size:11px","font-weight:900","cursor:pointer",`background:${e?"var(--accent)":"transparent"}`,`color:${e?"#fff":"var(--muted)"}`].join(";")}function R(e,t,a="var(--text)"){return`
        <div style="border:1px solid var(--border);border-radius:12px;padding:10px;background:var(--surface2);min-height:62px;">
            <div style="font-size:10px;color:var(--muted);font-weight:800;margin-bottom:5px;">${e}</div>
            <div style="font-size:13px;color:${a};font-weight:900;line-height:1.25;">${p(String(t))}</div>
        </div>
    `}async function Xt(e){const t=document.getElementById("farmCanvas3D"),a=document.getElementById("canvas3DOverlay");if(!t)return;a&&(a.style.display="none");const o=()=>({width:Math.max(240,t.clientWidth||t.offsetWidth||360),height:Math.max(260,t.clientHeight||t.offsetHeight||330)}),{width:n,height:r}=o();if(!aa()){Ne(t,e,n,r),g("warning","WebGL is disabled, showing 2D preview");return}const l=Math.min(window.devicePixelRatio||1,2);t.width=n*l,t.height=r*l;let s;try{s=new k.WebGLRenderer({canvas:t,antialias:!0,alpha:!1,preserveDrawingBuffer:!0})}catch(C){console.warn("[BuildFarm] WebGL unavailable, using 2D fallback:",C.message),Ne(t,e,n,r),g("warning","WebGL is disabled, showing 2D preview");return}s.setPixelRatio(l),s.setSize(n,r),s.shadowMap.enabled=!0,s.shadowMap.type=k.PCFShadowMap,s.outputColorSpace=k.SRGBColorSpace,s.toneMapping=k.ACESFilmicToneMapping;const i=new k.Scene;i.background=new k.Color(b==="gamified"?1581626:1053725),i.fog=new k.FogExp2(b==="gamified"?1581626:1053725,.028);const f=new k.PerspectiveCamera(46,n/r,.1,80);f.position.set(3.3,2.25,3.7),i.add(new k.AmbientLight(b==="gamified"?7902463:4346223,1.55));const y=new k.DirectionalLight(16777215,b==="gamified"?3.4:2.3);y.position.set(5,8,5),y.castShadow=!0,y.shadow.mapSize.set(1024,1024),i.add(y);const{tiers:w,slotsPerTier:$}=e,M=e.shape==="channel"?.34:e.shape==="wall"?.36:e.shape==="column"?.46:.42,L=$*M+.1,N=e.shape==="wall"?.34:e.shape==="column"?1:b==="gamified"?.72:.58,j=e.tiers>=5?.54:.66,Z=w*j,te=new k.MeshStandardMaterial({color:b==="gamified"?1911634:1448740,roughness:.9,metalness:.02}),K=new k.Mesh(new k.PlaneGeometry(9,9),te);K.rotation.x=-Math.PI/2,K.receiveShadow=!0,i.add(K);const ct=new k.MeshStandardMaterial({color:b==="gamified"?5995770:5859452,roughness:.3,metalness:.75}),mt=new k.MeshStandardMaterial({color:b==="gamified"?8246268:7372944,roughness:.42,metalness:.55}),pt=new k.MeshStandardMaterial({color:b==="gamified"?16436245:10980346,emissive:b==="gamified"?8736014:5972406,emissiveIntensity:b==="gamified"?.45:.2,roughness:.5}),ut=new k.BoxGeometry(.045,Z,.045);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([C,E])=>{const H=new k.Mesh(ut,ct);H.position.set(C*L/2,Z/2,E*N/2),H.castShadow=!0,i.add(H)});const ve=[];S.forEach(C=>{for(let E=0;E<C.slots;E++)ve.push(C)});for(let C=0;C<w;C++){const E=C*j,H=new k.Mesh(new k.BoxGeometry(L,.035,N),mt);H.position.set(0,E+.018,0),H.castShadow=!0,H.receiveShadow=!0,i.add(H);const we=new k.Mesh(new k.BoxGeometry(L*.86,.018,.035),pt);we.position.set(0,E+j-.07,-N/2+.06),i.add(we);const ke=new k.PointLight(b==="gamified"?16436245:10980346,.75,1.4);ke.position.set(0,E+j*.7,0),i.add(ke);for(let ae=0;ae<$;ae++){const Se=C*$+ae,ze=ve[Se],Ce=(ae-($-1)/2)*M,_e=0,Me=E+.05;if(!ze){const Te=new k.Mesh(new k.CylinderGeometry(.07,.07,.018,b==="gamified"?6:16),new k.MeshStandardMaterial({color:2371652,transparent:!0,opacity:.58,roughness:.9}));Te.position.set(Ce,Me,_e),i.add(Te);continue}ea(k,i,ze,Ce,Me,_e,Se)}}b==="gamified"&&ta(k,i,L,Z);const B=new vt(f,s.domElement);B.enableDamping=!0,B.dampingFactor=.07,B.target.set(0,Z*.42,0),B.minDistance=1.7,B.maxDistance=8,B.maxPolarAngle=Math.PI*.82,B.autoRotate=!0,B.autoRotateSpeed=b==="gamified"?1:.55,B.addEventListener("start",()=>{B.autoRotate=!1});const ye=new ResizeObserver(()=>{const{width:C,height:E}=o();f.aspect=C/E,f.updateProjectionMatrix(),s.setSize(C,E,!1)});ye.observe(t);let be;const xe=()=>{be=requestAnimationFrame(xe),B.update(),s.render(i,f)};xe(),ne=()=>{cancelAnimationFrame(be),ye.disconnect(),B.dispose(),i.traverse(C=>{C.geometry&&C.geometry.dispose(),C.material&&(Array.isArray(C.material)?C.material.forEach(E=>E.dispose()):C.material.dispose())}),s.dispose()}}function ea(e,t,a,o,n,r,l){const s=b==="gamified"?[4906624,2282478,16436245,16478597,10980346]:[2278750,1483594,6660877,1409085,8843180],i=s[l%s.length],f=new e.MeshStandardMaterial({color:b==="gamified"?16347926:8141549,roughness:.68}),y=new e.Mesh(new e.CylinderGeometry(.07,.058,.07,b==="gamified"?6:16),f);y.position.set(o,n+.035,r),y.castShadow=!0,t.add(y);const w=new e.Mesh(new e.CylinderGeometry(.008,.008,.095,8),new e.MeshStandardMaterial({color:3560212,roughness:.82}));w.position.set(o,n+.105,r),t.add(w);const $=new e.MeshStandardMaterial({color:i,roughness:b==="gamified"?.48:.86,emissive:b==="gamified"?i:0,emissiveIntensity:b==="gamified"?.12:0}),M=b==="gamified"?5:3;for(let L=0;L<M;L++){const N=new e.Mesh(new e.SphereGeometry(.085,12,8),$),j=Math.PI*2/M*L;N.scale.set(1.25,.42,.7),N.position.set(o+Math.cos(j)*.05,n+.15+L%2*.016,r+Math.sin(j)*.045),N.rotation.set(.25,j,-.25),N.castShadow=!0,t.add(N)}}function ta(e,t,a,o){const n=new e.MeshStandardMaterial({color:16436245,emissive:8736014,emissiveIntensity:.35,roughness:.35,metalness:.35});for(let r=0;r<5;r++){const l=new e.Mesh(new e.CylinderGeometry(.055,.055,.014,18),n);l.rotation.x=Math.PI/2,l.position.set((r-2)*a/5,o+.18+r%2*.08,-.42),t.add(l)}}function aa(){try{const e=document.createElement("canvas");return!!(window.WebGLRenderingContext&&(e.getContext("webgl2")||e.getContext("webgl")||e.getContext("experimental-webgl")))}catch{return!1}}function Ne(e,t,a,o){const n=e.getContext("2d");if(!n)return;const r=Math.min(window.devicePixelRatio||1,2);e.width=Math.floor(a*r),e.height=Math.floor(o*r),n.setTransform(r,0,0,r,0,0);const l=n.createLinearGradient(0,0,a,o);l.addColorStop(0,b==="gamified"?"#18223a":"#10141d"),l.addColorStop(1,b==="gamified"?"#25345d":"#1f2937"),n.fillStyle=l,n.fillRect(0,0,a,o);const s=[];S.forEach(M=>{for(let L=0;L<M.slots;L++)s.push(M)});const i=34,f=a-i*2,w=(o-68)/t.tiers,$=f/t.slotsPerTier;n.fillStyle="rgba(255,255,255,0.1)",n.beginPath(),n.ellipse(a*.5,o-24,f*.43,16,0,0,Math.PI*2),n.fill(),n.strokeStyle=b==="gamified"?"#7dd3fc":"#64748b",n.lineWidth=6,n.lineCap="round",n.beginPath(),n.moveTo(i+8,32),n.lineTo(i+8,o-45),n.moveTo(a-i-8,32),n.lineTo(a-i-8,o-45),n.stroke();for(let M=0;M<t.tiers;M++){const L=42+M*w;n.fillStyle=b==="gamified"?"#7dd3fc":"#708090",Ee(n,i,L+w*.56,f,9,5),n.fill(),n.fillStyle=b==="gamified"?"#facc15":"#a78bfa",Ee(n,i+f*.12,L+7,f*.76,5,3),n.fill();for(let N=0;N<t.slotsPerTier;N++){const j=M*t.slotsPerTier+N,Z=s[j],te=i+$*(N+.5),K=L+w*.53;n.fillStyle=Z?b==="gamified"?"#f97316":"#7c3aed":"rgba(148,163,184,0.35)",n.beginPath(),n.ellipse(te,K,13,7,0,0,Math.PI*2),n.fill(),Z&&oa(n,te,K,Z,j)}}if(b==="gamified"){n.fillStyle="#facc15";for(let M=0;M<5;M++)n.beginPath(),n.arc(a*.26+M*34,28+M%2*9,7,0,Math.PI*2),n.fill()}n.fillStyle="rgba(255,255,255,0.86)",n.font="700 12px Inter, system-ui, sans-serif",n.fillText(`${t.tiers} tiers · ${Math.min(s.length,t.total)}/${t.total} plants`,16,o-16)}function oa(e,t,a,o,n){const r=b==="gamified"?["#4ade80","#22d3ee","#facc15","#fb7185","#a78bfa"]:["#22c55e","#16a34a","#65a30d","#15803d","#86efac"],l=o.emoji==="🍅"?"#ef4444":o.emoji==="🌶️"?"#dc2626":r[n%r.length];e.strokeStyle="#365314",e.lineWidth=2,e.beginPath(),e.moveTo(t,a-5),e.lineTo(t,a-25),e.stroke(),e.fillStyle=l;for(let s=0;s<5;s++){const i=Math.PI*2/5*s;e.save(),e.translate(t+Math.cos(i)*8,a-24+Math.sin(i)*5),e.rotate(i),e.beginPath(),e.ellipse(0,0,9,4,0,0,Math.PI*2),e.fill(),e.restore()}}function Ee(e,t,a,o,n,r){e.beginPath(),e.moveTo(t+r,a),e.lineTo(t+o-r,a),e.quadraticCurveTo(t+o,a,t+o,a+r),e.lineTo(t+o,a+n-r),e.quadraticCurveTo(t+o,a+n,t+o-r,a+n),e.lineTo(t+r,a+n),e.quadraticCurveTo(t,a+n,t,a+n-r),e.lineTo(t,a+r),e.quadraticCurveTo(t,a,t+r,a),e.closePath()}function at(e){const t=S.length?S:[];e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">GOAL PRIORITY</div>
                <div style="font-size:12px;color:var(--muted);line-height:1.45;margin-bottom:12px;">Choose up to two goals. SeedDown will generate thresholds for this device and crop mix.</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    ${Ae.map(a=>{const o=D.includes(a.id);return`<button class="goal-priority" data-id="${a.id}"
                            style="padding:11px 8px;border-radius:12px;border:1.5px solid ${o?"var(--accent)":"var(--border)"};background:${o?"var(--accent-l)":"var(--surface2)"};color:${o?"var(--accent)":"var(--text)"};font-weight:900;font-size:12px;cursor:pointer;">
                            ${a.label}
                        </button>`}).join("")}
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:12px;">
                    <div>
                        <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;">AI THRESHOLDS</div>
                        <div style="font-size:12px;color:var(--muted);margin-top:4px;line-height:1.45;">Plants: ${t.map(a=>p(a.name)).join(", ")||"mixed greens"} · Package: ${p(Y(U()).label)}</div>
                    </div>
                    <button id="generateThresholdsBtn" style="padding:8px 10px;border-radius:999px;border:1px solid var(--accent);background:var(--accent-l);color:var(--accent);font-size:11px;font-weight:900;cursor:pointer;">Generate</button>
                </div>
                <div id="thresholdStatus" style="font-size:12px;color:var(--muted);margin-bottom:10px;line-height:1.45;">
                    ${m?p(m.notes||"Thresholds ready"):"No thresholds generated yet."}
                </div>
                <div id="thresholdGrid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    ${ra((m==null?void 0:m.thresholds)||{})}
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:10px;">AI ANALYSIS</div>
                ${ia(t)}
            </section>
        </div>
    `,document.querySelectorAll(".goal-priority").forEach(a=>{a.addEventListener("click",()=>{const o=a.dataset.id;D.includes(o)?D=D.filter(n=>n!==o):D.length<2?D=[...D,o]:g("warning","Choose up to 2 goals"),m=null,at(e)})}),document.getElementById("generateThresholdsBtn").addEventListener("click",rt),sa()}function na(e){if(!e)return!1;const t=String(e.rackType||e.type||e.id||e.structureType||"").toLowerCase(),a=Number(e.tiers||e.tierCount||0),o=Number(e.slotsPerTier||e.columns||0),n=`${t} ${e.label||""} ${e.description||""}`.toLowerCase();let r=null;return n.includes("wall")||n.includes("panel")||n.includes("grid")?r="wall":n.includes("a-frame")||n.includes("pyramid")||n.includes("slant")?r="a-frame":n.includes("nft")||n.includes("channel")||n.includes("row")?r="nft-channel":n.includes("hanging")||n.includes("column")||n.includes("tower")?r=n.includes("tower")&&a>=5?"5-tier":"hanging":a>=5?r="5-tier":a===4&&o>=5?r="wall":a===4?r="4-tier":a===2?r="2-tier":a===3?r="3-tier":t&&ie.some(l=>l.id===t)&&(r=t),!r||c.rackType===r?!1:(c.rackType=r,c.customRack=null,m=null,!0)}function ot(e=null){const t=he();if(!t)return!1;const a=J(),o=Number((e==null?void 0:e.total)||(e==null?void 0:e.totalSlots)||(e==null?void 0:e.plantSlots)||0),n=Math.max(t,o);if(a.total>=n&&!c.customRack)return!1;const l=Number((e==null?void 0:e.tiers)||(e==null?void 0:e.tierCount)||0),s=Number((e==null?void 0:e.slotsPerTier)||(e==null?void 0:e.columns)||0),i=l>0?Math.max(1,Math.min(8,Math.round(l))):Math.max(3,Math.min(7,Math.ceil(Math.sqrt(n)))),f=s>0?Math.max(1,Math.min(12,Math.round(s))):Math.max(3,Math.ceil(n/i)),y=Math.max(n,i*f),w=n>24?"wall":i>=5?"tower":"rack";return c.customRack={id:"photo-detected",label:(e==null?void 0:e.label)||(e==null?void 0:e.name)||"Photo-detected Multi Rack",icon:"AI",tiers:i,slotsPerTier:f,total:y,shape:w,desc:"Auto-sized from photo analysis and visible plant slot count"},c.rackType="photo-detected",m=null,!0}function ra(e={}){const t=Y(U());return ue().map(({key:a,label:o})=>{const n=t.thresholdKeys.includes(a);return`
        <label style="display:block;opacity:${n?"1":".58"};">
            <span style="display:block;font-size:10px;font-weight:900;color:var(--sub);margin-bottom:4px;text-transform:uppercase;">${o}</span>
            <input class="threshold-input" data-key="${a}" type="${n?"number":"text"}" value="${n?e[a]??"":t.lockedText}" placeholder="${n?"auto":t.lockedText}"
                ${n?"":"disabled"}
                style="width:100%;padding:10px;border:1px solid ${n?"var(--border)":"rgba(148,163,184,.35)"};border-radius:10px;background:${n?"var(--surface2)":"rgba(148,163,184,.1)"};font-size:13px;font-weight:800;color:${n?"var(--text)":"var(--muted)"};outline:none;">
        </label>
    `}).join("")}function ue(){return[{key:"tempMin",label:"Temp min"},{key:"tempMax",label:"Temp max"},{key:"humidityMin",label:"Humid min"},{key:"humidityMax",label:"Humid max"},{key:"soilDryThreshold",label:"Soil dry"},{key:"darkThreshold",label:"Light dark"},{key:"phMin",label:"pH min"},{key:"phMax",label:"pH max"},{key:"ecMin",label:"EC min"},{key:"ecMax",label:"EC max"},{key:"co2MinPpm",label:"CO2 min"},{key:"gasDangerThreshold",label:"Gas limit"},{key:"waterLowCm",label:"Water low"},{key:"wateringDurationSeconds",label:"Water sec"},{key:"fanDurationSeconds",label:"Fan sec"},{key:"sensorIntervalSeconds",label:"Interval sec"}]}function ia(e=[]){const t=J(),a=U(),o=Y(a),n=e.length?e.map(y=>y.name).join(", "):"mixed greens",r=D.map(y=>{var w;return((w=Ae.find($=>$.id===y))==null?void 0:w.label)||y}).join(", ")||"Beginner Safe",l=ue().filter(y=>!o.thresholdKeys.includes(y.key)).map(y=>y.label),s=!!(m!=null&&m.thresholds),i=(m==null?void 0:m.source)==="ai"?"AI generated":(m==null?void 0:m.source)==="fallback"?"Rule-based fallback":s?"Manual / edited":"Waiting for generation",f=[`Plant profile: ${n}.`,`Structure: ${t.label} with ${t.tiers} tiers and ${t.total} slots.`,`Goal priority: ${r}.`,`Package logic: ${o.label} only enables thresholds for available sensors.`];return l.length?f.push(`Locked sensors: ${l.slice(0,5).join(", ")}${l.length>5?"...":""}.`):f.push("All sensor thresholds are unlocked for this package."),`
        <div style="display:flex;flex-direction:column;gap:10px;">
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;">
                <strong style="font-size:13px;color:var(--text);">${p(i)}</strong>
                <span style="font-size:10px;font-weight:900;color:var(--accent);background:var(--accent-l);padding:5px 8px;border-radius:999px;">${p(o.label)}</span>
            </div>
            <div style="font-size:12px;color:var(--muted);line-height:1.55;">
                ${p((m==null?void 0:m.notes)||"Generate thresholds to see SeedDown’s full reasoning for this field.")}
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;">
                ${f.map(y=>`
                    <div style="display:flex;gap:7px;align-items:flex-start;font-size:11px;color:var(--sub);line-height:1.45;">
                        <span style="color:var(--accent);font-weight:900;">•</span>
                        <span>${p(y)}</span>
                    </div>
                `).join("")}
            </div>
        </div>
    `}function Y(e){return $e[e]||$e.standard}function U(){var e;return(d==null?void 0:d.packageLevel)||((e=Oe.find(t=>t.serial===T.serial))==null?void 0:e.packageLevel)||"standard"}function nt(e={},t=U()){const a=new Set(Y(t).thresholdKeys);return Object.fromEntries(Object.entries(e).filter(([o])=>a.has(o)))}function sa(){document.querySelectorAll(".threshold-input").forEach(e=>{e.addEventListener("input",t=>{m||(m={thresholds:{},notes:"Manual thresholds",source:"manual"});const a=t.target.value===""?void 0:Number(t.target.value);Number.isFinite(a)&&(m.thresholds[t.target.dataset.key]=a)})})}async function la(e=null){if(!T.serial.trim())return g("warning","Enter device serial"),null;const t=document.getElementById("registerDeviceBtn")||document.getElementById("bfNext");t&&(t.disabled=!0,t.textContent="Registering...");try{const a=await fetch(`${G}/api/devices/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({serial:T.serial.trim(),wifi_ssid:T.wifiSsid.trim(),wifi_password:T.wifiPassword,accountType:T.accountType,farmId:P.currentFarmId||"farm_001",fieldId:`field_${Date.now()}`})}),o=await a.json();if(!a.ok||!o.ok)throw new Error(o.error||"Device registration failed");return d=o.device,g("success","Device registered"),z(),d}catch(a){return g("error",a.message),null}finally{t&&(t.disabled=!1)}}async function q(e){try{return await e.json()}catch{return{}}}async function rt(){const e=document.getElementById("generateThresholdsBtn")||document.getElementById("bfNext");e&&(e.disabled=!0,e.textContent="Generating...");const t=(S.length?S:[]).map((a,o)=>({tier:Math.floor(o/(J().slotsPerTier||3))+1,plant_type:a.species||a.name}));try{const a=await fetch(`${G}/api/ai/generate-thresholds`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({plants:t,goal_priority:D,packageLevel:(d==null?void 0:d.packageLevel)||"standard"})}),o=await a.json();if(!a.ok||!o.ok)throw new Error(o.error||"Threshold generation failed");const n=(d==null?void 0:d.packageLevel)||U();return m={thresholds:nt(o.thresholds||{},n),notes:o.notes||`${Y(n).label} package thresholds generated. Locked sensors require a higher package.`,source:o.source},g("success",o.source==="ai"?"AI thresholds generated":"Fallback thresholds generated"),z(),m}catch(a){return g("error",a.message),null}finally{e&&(e.disabled=!1)}}async function da(){var e;if(Q()){await ca();return}if(v===1){if(!d){(e=document.getElementById("deviceQrInput"))==null||e.click(),g("info","Scan the SeedDown package QR first");return}v=2,z();return}if(v===2){if(!c.name.trim()){g("warning","Enter a field name");return}v=3,z();return}if(v===3){if(!h){g("warning","Add a field photo before generating 3D");return}v=4,z();return}if(v===4){if(!m&&!await rt())return;v=5,z();return}v===5&&await ua()}async function ca(){var e;if(v===1){if(!c.name.trim()){g("warning","Enter a commercial farm name");return}v=2,z();return}if(v===2){if(!h){g("warning","Add a full farm photo first");return}if(!u&&!await Qe())return;v=3,z();return}if(v===3){if(!_.length){g("warning","Choose at least one commercial goal");return}v=4,z();return}if(v===4){if(!Ke()&&!await qe())return;v=5,z();return}if(v===5){if(!Ye()){(e=document.getElementById("commercialDeviceQrInput"))==null||e.click(),g("info","Scan and assign all required commercial nodes");return}v=6,z();return}v===6&&await fa()}function ma(){if(v===1){it();return}v-=1,z()}async function fe(e){var t,a;V(),(a=(t=X).destroy)==null||a.call(t),e&&g("info",e);try{(await ft(()=>import("./FarmListPage-fjel2wQT.js"),__vite__mapDeps([0,1,2,3]))).render()}catch(o){console.error("[BuildFarm] Direct FarmList fallback failed:",o),window.location.reload()}}function it(){fe("New field creation cancelled")}async function pa(e={}){if(!(d!=null&&d.deviceId))return{synced:!1,reason:"No registered device"};const t={"Content-Type":"application/json"};d.deviceToken&&!d.isDemoFallback&&(t["x-device-token"]=d.deviceToken);const a=await fetch(`${G}/api/sensors/preferences`,{method:"PUT",headers:t,body:JSON.stringify({deviceId:d.deviceId,fieldId:d.fieldId||null,farmId:d.farmId||P.currentFarmId||null,zoneId:d.zoneId||c.location.trim()||null,packageLevel:d.packageLevel,goalPriority:D,thresholdSource:(m==null?void 0:m.source)||"manual",thresholdNotes:(m==null?void 0:m.notes)||"",...e})}),o=await q(a);if(!a.ok||o.ok===!1)throw new Error(o.error||"Preference sync failed");return{synced:!0,preferences:o.preferences||o}}async function ua(){const e=document.getElementById("bfNext");e&&(e.disabled=!0,e.textContent="Creating...");const t=J(),a=(d==null?void 0:d.fieldId)||`field_${Date.now()}`,o=nt((m==null?void 0:m.thresholds)||{},(d==null?void 0:d.packageLevel)||U()),n={name:c.name.trim(),location:c.location.trim(),description:c.description.trim(),rackType:c.rackType,rackConfig:c.customRack?{...c.customRack}:null,targetPlant:S.map(w=>w.name).join(", "),analysisGoal:D.join(","),viewMode:b,photoPreview:(h==null?void 0:h.dataUrl)||null,plants:S,deviceId:(d==null?void 0:d.deviceId)||"farm_001",serial:(d==null?void 0:d.serial)||T.serial,packageLevel:(d==null?void 0:d.packageLevel)||"standard",goalPriority:D,thresholds:o};let r=null;try{const w=await fetch(`${G}/api/farms/create`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...n,fieldId:a,zoneId:c.location.trim()||null,thresholdSource:(m==null?void 0:m.source)||"manual",thresholdNotes:(m==null?void 0:m.notes)||""})}),$=await q(w);w.ok&&($!=null&&$.farmId)&&(r=$.farmId)}catch(w){console.warn("[BuildFarm] create field API unavailable:",w.message)}let l={synced:!1};if(d!=null&&d.deviceId)try{l=await pa(o),g("success","Device thresholds synced")}catch(w){console.warn("[BuildFarm] preference sync skipped:",w.message),g("warning",`Field saved, but thresholds not synced: ${w.message}`)}const s=dt(),i={id:a,backendFarmId:r,name:n.name,location:n.location,description:n.description,zone:c.location.trim()||String.fromCharCode(65+s.length%26),rackTypeId:c.rackType,rackType:t.label,rackLabel:t.label,rackConfig:c.customRack?{...c.customRack}:null,targetPlant:n.targetPlant,analysisGoal:n.analysisGoal,deviceId:(d==null?void 0:d.deviceId)||"farm_001",deviceToken:(d==null?void 0:d.deviceToken)||null,serial:(d==null?void 0:d.serial)||T.serial,packageLevel:(d==null?void 0:d.packageLevel)||"standard",goalPriority:[...D],thresholds:{...o},thresholdSource:(m==null?void 0:m.source)||"manual",thresholdNotes:(m==null?void 0:m.notes)||"",preferenceSynced:!!l.synced,viewMode:b,photoPreview:n.photoPreview,plants:S.map(w=>({...w})),plantSlots:he(),createdAt:new Date().toISOString()};if(s.push(i),localStorage.setItem(ce,JSON.stringify(s)),P.uid)try{await gt(P.uid,s),console.log("[BuildFarm] ✅ Farm synced to Firebase")}catch(w){console.error("[BuildFarm] ❌ Failed to sync farm to Firebase",w)}P.newFarm=n,P.currentFarm=i,P.currentFarmId=i.id,P.farmName=i.name,g("success",`"${i.name}" field created`),V();const f={tomato:"🍅",mint:"🌿",basil:"🌿",chili:"🌶️",lettuce:"🥬",spinach:"🌿",carrot:"🥕",cucumber:"🥒",pepper:"🌶️",strawberry:"🍓",default:"🌱"},y=Array(9).fill(null);S.slice(0,9).forEach((w,$)=>{const M=(w.name||"").toLowerCase();y[$]=f[M]||f.default}),fetch(`${G}/api/community/visits/register-farm`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({farmLayout:y,displayName:i.name,avatar:"🧑‍🌾"})}).catch(()=>{}),setTimeout(()=>fe(),500)}async function fa(){F();const e=document.getElementById("bfNext");e&&(e.disabled=!0,e.textContent="Launching...");const t=me||`farm_com_${Date.now()}`,a=u.zones.map(s=>{const i=O.find(y=>y.targetId===s.zone_id),f=A[s.zone_id]||{};return{...s,deviceId:(i==null?void 0:i.deviceId)||null,deviceToken:(i==null?void 0:i.deviceToken)||null,serial:(i==null?void 0:i.serial)||null,packageLevel:(i==null?void 0:i.packageLevel)||s.recommended_type,thresholds:f.thresholds||{},thresholdNotes:f.notes||"",thresholdSource:f.source||"manual"}}),o=O.find(s=>s.targetId==="farm_master")||null,n={name:c.name.trim(),location:c.location.trim(),description:c.description.trim(),farmSize:c.rackType||"medium",accountMode:"commercial",farmId:t,zones:a,commercialDevices:O,farmMaster:o,farmThresholds:(x==null?void 0:x.thresholds)||{},farmThresholdNotes:(x==null?void 0:x.notes)||"",farmThresholdSource:(x==null?void 0:x.source)||"manual",commercialStructure:u,goalPriority:_,targetPlant:a.map(s=>s.crop).join(", "),analysisGoal:_.join(","),photoPreview:(h==null?void 0:h.dataUrl)||null,plants:a.flatMap(s=>(s.plants||[]).map((i,f)=>({name:i,species:String(i).toLowerCase().replace(/[^a-z0-9]+/g,"_"),emoji:ge(i),zoneId:s.zone_id,zoneName:s.name,tier:f+1,slots:Math.max(3,Math.ceil(12/Math.max(1,(s.plants||[]).length||1)))}))),rackType:"commercial-multi-zone",viewMode:"commercial"};try{const s=await fetch(`${G}/api/farms/create`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}),i=await q(s);s.ok&&(i!=null&&i.farmId)&&(n.backendFarmId=i.farmId)}catch(s){console.warn("[BuildFarm] commercial farm API unavailable:",s.message)}await ha(t,o),await ga(t,a);const r=dt(),l={id:t,backendFarmId:n.backendFarmId||null,name:n.name,location:n.location,description:n.description,accountMode:"commercial",farmSize:n.farmSize,zones:a,commercialDevices:O.map(s=>({...s})),farmMaster:o,farmThresholds:n.farmThresholds,farmThresholdNotes:n.farmThresholdNotes,farmThresholdSource:n.farmThresholdSource,commercialStructure:u,goalPriority:[..._],analysisGoal:n.analysisGoal,targetPlant:n.targetPlant,rackTypeId:"commercial-multi-zone",rackType:"Commercial Multi-Zone Farm",rackLabel:`${a.length}-Zone Commercial Layout`,plantSlots:a.length*12,plants:n.plants,photoPreview:n.photoPreview,createdAt:new Date().toISOString()};r.push(l),localStorage.setItem(ce,JSON.stringify(r)),P.currentFarm=l,P.currentFarmId=l.id,P.farmName=l.name,P.mode="commercial",g("success",`"${l.name}" commercial farm launched`),V(),setTimeout(()=>fe(),500)}async function ga(e,t){for(const a of t){if(!a.deviceId)continue;const o={"Content-Type":"application/json"};a.deviceToken&&(o["x-device-token"]=a.deviceToken);try{const n=await fetch(`${G}/api/sensors/preferences`,{method:"PUT",headers:o,body:JSON.stringify({deviceId:a.deviceId,farmId:e,zoneId:a.zone_id,packageLevel:a.packageLevel,goalPriority:_,thresholdSource:a.thresholdSource,thresholdNotes:a.thresholdNotes,...a.thresholds})}),r=await q(n);if(!n.ok||r.ok===!1)throw new Error(r.error||"Preference sync failed")}catch(n){console.warn(`[BuildFarm] commercial preference sync skipped for ${a.zone_id}:`,n.message)}}}async function ha(e,t){if(!(t!=null&&t.deviceId))return;const a={"Content-Type":"application/json"};t.deviceToken&&(a["x-device-token"]=t.deviceToken);try{const o=await fetch(`${G}/api/sensors/preferences`,{method:"PUT",headers:a,body:JSON.stringify({deviceId:t.deviceId,farmId:e,zoneId:"farm_master",packageLevel:t.packageLevel||"farm_master",goalPriority:_,thresholdSource:(x==null?void 0:x.source)||"manual",thresholdNotes:(x==null?void 0:x.notes)||"",...(x==null?void 0:x.thresholds)||{}})}),n=await q(o);if(!o.ok||n.ok===!1)throw new Error(n.error||"Farm master preference sync failed")}catch(o){console.warn("[BuildFarm] farm master preference sync skipped:",o.message)}}function De(){const e=document.getElementById("manualPlantInput");if(!e)return;const t=e.value.trim();t&&(st([va(t,3,0,"manual")]),e.value="",se(),g("success",`${t} added`))}function Fe(e){const t=new Set;return String(e||"").split(/[,;\n]+/).map(a=>a.trim()).filter(Boolean).filter(a=>{const o=a.toLowerCase();return t.has(o)?!1:(t.add(o),!0)})}function st(e){e.forEach(t=>{const a=lt(t),o=S.find(n=>n.species===a.species);o?(o.slots=Math.max(o.slots,a.slots),o.confidence=Math.max(o.confidence||0,a.confidence||0),o.source=a.source||o.source):S.push(a)})}function va(e,t=3,a=0,o="target"){const n=String(e||"").toLowerCase().trim();return lt({name:n.charAt(0).toUpperCase()+n.slice(1),emoji:ge(n),species:n.replace(/\s+/g,"_"),confidence:a,slots:t,source:o})}function ge(e=""){const t=String(e).toLowerCase().replace(/_/g," ");if(oe[t])return oe[t];const a=Object.keys(oe).find(o=>t.includes(o));return a?oe[a]:"🌱"}function lt(e){const t=e.name||"Plant",a=(e.species||t).toLowerCase().trim().replace(/\s+/g,"_");return{name:t,emoji:e.emoji||ge(a),species:a,confidence:Math.max(0,Math.min(1,Number(e.confidence)||0)),slots:Math.max(1,Math.min(40,Number.parseInt(e.slots,10)||3)),source:e.source||"ai"}}function J(){return c.rackType==="photo-detected"&&c.customRack?c.customRack:ie.find(e=>e.id===c.rackType)||ie[0]}function he(){return S.reduce((e,t)=>e+t.slots,0)}function ya(e){var t;return((t=bt.find(a=>a.id===e))==null?void 0:t.label)||e}function Q(){try{const e=localStorage.getItem("seeddown_build_flow");if(e==="beginner")return P.mode="beginner",!1;if(e==="commercial"||localStorage.getItem("seeddown_mode")==="commercial")return P.mode="commercial",!0}catch{}return P.mode==="commercial"}function W(e,t){const a=document.getElementById(e);a&&(a.addEventListener("input",o=>t(o.target.value)),a.addEventListener("focus",()=>{a.style.borderColor="var(--accent)"}),a.addEventListener("blur",()=>{a.style.borderColor="var(--border)"}))}function dt(){try{return JSON.parse(localStorage.getItem(ce))||[]}catch{return[]}}function V(){ne&&(ne(),ne=null)}function p(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}export{za as render};
