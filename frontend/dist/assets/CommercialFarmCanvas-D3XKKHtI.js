import{A as M}from"./index-G-Ja4GjB.js";import*as r from"https://esm.sh/three@0.160.0";import{OrbitControls as F}from"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const H="user_farms",y={"2-tier":{id:"2-tier",label:"2-Tier Starter Rack",tiers:2,slotsPerTier:3,total:6},"3-tier":{id:"3-tier",label:"3-Tier Vertical Rack",tiers:3,slotsPerTier:3,total:9},"4-tier":{id:"4-tier",label:"4-Tier Grow Shelf",tiers:4,slotsPerTier:4,total:16},"5-tier":{id:"5-tier",label:"5-Tier Tower Rack",tiers:5,slotsPerTier:4,total:20},wall:{id:"wall",label:"Wall Panel Grid",tiers:4,slotsPerTier:5,total:20},"a-frame":{id:"a-frame",label:"A-Frame Pyramid",tiers:4,slotsPerTier:4,total:16},"nft-channel":{id:"nft-channel",label:"NFT Channel Rows",tiers:3,slotsPerTier:6,total:18},hanging:{id:"hanging",label:"Hanging Column Farm",tiers:5,slotsPerTier:3,total:15}},S={lettuce:{color:6927180,alt:9228129,leaf:.082,spread:.095},cabbage:{color:7448635,alt:10733911,leaf:.09,spread:.1},kale:{color:3108670,alt:5213518,leaf:.088,spread:.105},spinach:{color:3046706,alt:4431943,leaf:.072,spread:.088},basil:{color:2067020,alt:3323495,leaf:.064,spread:.078},mint:{color:3450963,alt:7327605,leaf:.062,spread:.078},tomato:{color:3116870,alt:15680580,leaf:.07,spread:.086,fruit:15680580},chili:{color:2522941,alt:14427686,leaf:.066,spread:.082,fruit:14427686},pepper:{color:2522941,alt:14427686,leaf:.066,spread:.082,fruit:14427686},cucumber:{color:2325052,alt:5284955,leaf:.078,spread:.105,vine:!0},strawberry:{color:4165449,alt:16478597,leaf:.066,spread:.082,fruit:16478597},eggplant:{color:3112783,alt:8141549,leaf:.072,spread:.088,fruit:8141549},plant:{color:6660877,alt:8843180,leaf:.072,spread:.09}},le={canvas:null,parent:null,renderer:null,scene:null,camera:null,controls:null,farmGroup:null,particles:null,raycaster:null,pointer:null,interactiveRoots:[],hoverRoot:null,selectedRoot:null,detailPanel:null,tooltip:null,fullscreenButton:null,zoomControls:null,originalParent:null,originalNextSibling:null,resizeHandler:null,fullscreenHandler:null,rafId:null,clock:null,frame:0,farm:null,rack:y["3-tier"],slotPlants:[],sensorSnapshot:{},init(e){this.destroy(),this.installHandlers(),se(),this.canvas=document.getElementById(e),this.canvas&&(this.parent=this.canvas.parentElement,this.parent&&(this.farm=G(),this.rack=B(this.farm),this.slotPlants=_(this.farm,this.rack),this.sensorSnapshot=P(),this.clock=new r.Clock,this.prepareHost(),this.initScene(),this.buildFacility(),this.createOverlays(),this.bindEvents(),this.resize(),this.animate()))},prepareHost(){this.parent.classList.add("commercial-farm-host"),this.canvas.classList.add("commercial-farm-canvas"),this.parent.querySelectorAll(".cf-overlay, .cf-tooltip, .cf-expand-btn, .cf-zoom-controls").forEach(e=>e.remove())},initScene(){this.scene=new r.Scene,this.scene.background=new r.Color(16317175),this.scene.fog=new r.Fog(16317175,22,58),this.camera=new r.PerspectiveCamera(58,1,.1,120),this.camera.position.set(5.5,4.6,8.5),this.camera.lookAt(0,1.8,0),this.renderer=new r.WebGLRenderer({canvas:this.canvas,antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=r.PCFSoftShadowMap,this.renderer.outputColorSpace=r.SRGBColorSpace,this.renderer.toneMapping=r.ACESFilmicToneMapping,this.renderer.toneMappingExposure=1.08,this.controls=new F(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.07,this.controls.enablePan=!0,this.controls.enableZoom=!1,this.controls.maxPolarAngle=Math.PI*.48,this.controls.target.set(0,1.55,0),this.setCameraFrame(!1),this.raycaster=new r.Raycaster,this.pointer=new r.Vector2,this.farmGroup=new r.Group,this.scene.add(this.farmGroup),this.addLighting()},addLighting(){this.scene.add(new r.AmbientLight(14479072,.55));const e=new r.DirectionalLight(16775399,2.2);e.position.set(10,18,9),e.castShadow=!0,e.shadow.mapSize.set(2048,2048),e.shadow.camera.left=-12,e.shadow.camera.right=12,e.shadow.camera.top=12,e.shadow.camera.bottom=-12,e.shadow.bias=-4e-4,this.scene.add(e);const t=new r.DirectionalLight(12244991,.35);t.position.set(-7,10,-6),this.scene.add(t);const a=new r.HemisphereLight(11657727,4928541,.28);this.scene.add(a);const n=new r.PointLight(8702998,1.25,12);n.position.set(0,3.1,0),this.scene.add(n)},buildFacility(){this.addFloor(),this.addGreenhouseFrame(),this.addOverheadGrowLights();const e=this.createTowerLayout();e.forEach((t,a)=>this.addTower(t,a)),this.addIrrigationPipes(e),this.addDigitalTwinDevices(e),this.addNutrientStation(),this.addControlPanel(),this.addVentilationFans(),this.addWaterDrips(e),this.addParticles()},addFloor(){const e=new r.Mesh(new r.PlaneGeometry(80,60),new r.MeshStandardMaterial({color:15265510,roughness:.86,metalness:.02}));e.rotation.x=-Math.PI/2,e.receiveShadow=!0,this.scene.add(e);const t=new r.Mesh(new r.PlaneGeometry(5.2,56),new r.MeshStandardMaterial({color:14542812,roughness:.78}));t.rotation.x=-Math.PI/2,t.position.y=.006,t.receiveShadow=!0,this.scene.add(t);const a=new r.LineBasicMaterial({color:11057322,transparent:!0,opacity:.48});for(let n=-38;n<=38;n+=2)this.scene.add(E([n,.014,-28],[n,.014,28],a));for(let n=-28;n<=28;n+=2)this.scene.add(E([-38,.016,n],[38,.016,n],a))},addGreenhouseFrame(){const e=new r.MeshStandardMaterial({color:10135456,metalness:.45,roughness:.32}),t=new r.MeshPhysicalMaterial({color:13625816,transparent:!0,opacity:.2,roughness:.04,side:r.DoubleSide}),a=17.6,n=13.6,s=4.3,o=6.2;for(let l=-n/2;l<=n/2+.001;l+=2.7){[-1,1].forEach(u=>{const c=new r.Mesh(new r.CylinderGeometry(.035,.035,s,10),e);c.position.set(u*a/2,s/2,l),c.castShadow=!0,this.scene.add(c)});const d=Math.sqrt((a/2)**2+(o-s)**2),p=Math.atan2(o-s,a/2);[-1,1].forEach(u=>{const c=new r.Mesh(new r.CylinderGeometry(.028,.028,d,8),e);c.position.set(u*a/4,s+(o-s)/2,l),c.rotation.z=u*(Math.PI/2-p),this.scene.add(c)})}const i=new r.Mesh(new r.CylinderGeometry(.032,.032,n,10),e);i.rotation.x=Math.PI/2,i.position.set(0,o,0),this.scene.add(i);const h=new r.Mesh(new r.PlaneGeometry(a,s),t);h.position.set(0,s/2,-n/2),this.scene.add(h),[-1,1].forEach(l=>{const d=new r.Mesh(new r.PlaneGeometry(n,s),t);d.rotation.y=Math.PI/2,d.position.set(l*a/2,s/2,0),this.scene.add(d)})},addOverheadGrowLights(){const e=new r.MeshStandardMaterial({color:2042167,roughness:.5,metalness:.72}),t=new r.MeshStandardMaterial({color:14518527,emissive:14518527,emissiveIntensity:.85,roughness:.2});[-4.8,-2.4,2.4,4.8].forEach(a=>{for(let n=-4.8;n<=4.8;n+=2.4){const s=new r.Mesh(new r.BoxGeometry(1.4,.06,.16),e);s.position.set(a,4.15,n),this.scene.add(s);const o=new r.Mesh(new r.BoxGeometry(1.16,.025,.09),t);o.position.set(a,4.11,n),this.scene.add(o)}})},createTowerLayout(){const e=C(this.farm);if(e.length){const i=Math.ceil(Math.sqrt(e.length)),h=Math.ceil(e.length/i),l=2.65,d=3.1,p=-((i-1)*l)/2,u=-((h-1)*d)/2;return e.map((c,m)=>({x:p+m%i*l,z:u+Math.floor(m/i)*d,zoneIndex:m,row:Math.floor(m/i),col:m%i,zoneId:c.zone_id||c.id||`zone_${String.fromCharCode(65+m)}`,label:c.name||`Zone ${String.fromCharCode(65+m)}`,crop:c.crop||(Array.isArray(c.plants)?c.plants.join(", "):"")||"Mixed crops"}))}const t=Math.max(6,Math.min(10,Math.ceil(this.rack.total/2))),a=[],n=Math.ceil(t/2),s=-((n-1)*2.15)/2,o=[-2.35,2.35];for(let i=0;i<2;i++)for(let h=0;h<n&&!(a.length>=t);h++)a.push({x:s+h*2.15,z:o[i],zoneIndex:a.length,row:i,col:h});return a},addTower(e,t){const a=String.fromCharCode(65+t),n=new r.Group;n.position.set(e.x,0,e.z),n.userData={isTower:!0,id:e.zoneId||`zone-${a}`,label:e.label||`Zone ${a}`,crop:e.crop||"Mixed crops",zoneIndex:t,plants:[],status:"empty"};const s=new r.MeshStandardMaterial({color:15330800,roughness:.34,metalness:.18}),o=new r.MeshStandardMaterial({color:2503725,roughness:.5,metalness:.4}),i=new r.Mesh(new r.CylinderGeometry(.095,.12,3.2,22),s);i.position.y=1.67,i.castShadow=!0,n.add(i);const h=new r.Mesh(new r.CylinderGeometry(.48,.6,.15,28),o);h.position.y=.075,h.castShadow=!0,n.add(h);const l=this.createTowerLayout().length,d=this.slotPlants.map((f,b)=>({plant:f,index:b})).filter(f=>f.plant&&J(f.plant,f.index,this.rack,t,l,e)),p=8,u=4;let c=0;for(let f=0;f<p;f++){const b=.38+f*.36,w=new r.Mesh(new r.TorusGeometry(.42,.012,8,48),new r.MeshStandardMaterial({color:5398874,roughness:.48,metalness:.35}));w.rotation.x=Math.PI/2,w.position.y=b,n.add(w);for(let z=0;z<u;z++){const $=z*Math.PI/2+(f%2?Math.PI/4:0),v=d[c]||null;this.addPod(n,$,b,(v==null?void 0:v.plant)||null,(v==null?void 0:v.index)??t*100+c,f,z),v!=null&&v.plant&&(n.userData.plants.push(v.plant),c+=1)}}n.userData.status=V(n.userData.plants);const m=this.createTextSprite(String(e.label||`ZONE ${a}`).toUpperCase(),{bg:"rgba(9,18,13,.88)",fg:"#a3e635",border:"#315d3e",font:"900 30px Inter, system-ui, sans-serif"});m.position.set(0,3.63,0),m.scale.set(.68,.18,1),n.add(m),this.farmGroup.add(n),this.interactiveRoots.push(n)},addPod(e,t,a,n,s,o,i){const l=Math.cos(t)*.48,d=Math.sin(t)*.48,p=(n==null?void 0:n.status)||"empty",u=D(p),c={index:s,tier:e.userData.zoneIndex+1,slot:o*4+i+1,plant:n,tower:e},m=new r.MeshStandardMaterial({color:n?16317180:2437676,roughness:.52,metalness:n?.08:.18}),f=new r.Mesh(new r.CylinderGeometry(.155,.12,.11,20),m);f.position.set(l,a,d),f.rotation.z=Math.PI/2,f.rotation.y=-t,f.castShadow=!0,f.userData.slot=c,f.userData.root=e,e.add(f);const b=new r.Mesh(new r.SphereGeometry(.045,12,8),new r.MeshStandardMaterial({color:u,emissive:u,emissiveIntensity:n?.38:.06}));b.position.set(l*1.1,a+.085,d*1.1),b.userData.slot=c,b.userData.root=e,e.add(b),n&&this.addPlantCluster(e,l*1.1,a+.12,d*1.1,n)},addDigitalTwinDevices(e){[{key:"co2",label:"CO2 Sensor",value:`${Number(this.sensorSnapshot.co2Ppm||800)} ppm`,type:"sensor",x:-6.9,y:1.1,z:5.25,color:3718648},{key:"reservoir",label:"Water Reservoir",value:`${Number(this.sensorSnapshot.waterDistanceCm||0)} cm`,type:"sensor",x:-5.65,y:.9,z:5.25,color:959977},{key:"gas",label:"MQ-2 Gas Sensor",value:`${Number(this.sensorSnapshot.gasRaw||0)} raw`,type:"sensor",x:-4.4,y:.9,z:5.25,color:D(Number(this.sensorSnapshot.gasRaw||0)>2500?"danger":"healthy")},{key:"power",label:"Power Meter",value:`${Number(this.sensorSnapshot.energyKwh||5.1).toFixed(1)} kWh`,type:"sensor",x:4.4,y:.9,z:5.25,color:16096779},{key:"main_fan",label:"Main Ventilation Fan",value:Number(this.sensorSnapshot.temperature||25)>30?"active":"standby",type:"output",x:5.65,y:.9,z:5.25,color:6583435},{key:"emergency_buzzer",label:"Emergency Buzzer",value:Number(this.sensorSnapshot.gasRaw||0)>2500?"alert":"ready",type:"output",x:6.9,y:.9,z:5.25,color:Number(this.sensorSnapshot.gasRaw||0)>2500?15680580:8702998}].forEach(n=>this.addDeviceMarker(n));const a=[{key:"dht11",label:"DHT11 Temp/Humid",type:"sensor",color:2278750},{key:"soil",label:"Soil Moisture",type:"sensor",color:9132587},{key:"ldr",label:"LDR Light",type:"sensor",color:16436245},{key:"ph",label:"pH Sensor",type:"sensor",color:11032055},{key:"ec",label:"EC Sensor",type:"sensor",color:1357990},{key:"flow",label:"YF-S201 Flow",type:"sensor",color:3718648},{key:"pump",label:"Water Pump",type:"output",color:959977},{key:"grow_light",label:"LED Grow Light",type:"output",color:14518527},{key:"zone_fan",label:"Zone Fan",type:"output",color:6583435},{key:"active_buzzer",label:"Active Buzzer",type:"output",color:16347926},{key:"camera",label:"Camera",type:"sensor",color:1120295}];e.forEach((n,s)=>{var h,l;const o=n.zoneId||((h=n.userData)==null?void 0:h.id)||`zone_${String.fromCharCode(65+s)}`,i=n.label||((l=n.userData)==null?void 0:l.label)||`Zone ${String.fromCharCode(65+s)}`;a.forEach((d,p)=>{const u=Math.PI*2*p/a.length,c=.92+p%2*.18;this.addDeviceMarker({...d,scope:"zone",zoneId:o,zoneLabel:i,value:q(d.key,this.sensorSnapshot),x:n.x+Math.cos(u)*c,y:.22+p%3*.08,z:n.z+Math.sin(u)*c,compact:!0})})})},addDeviceMarker(e){const t=new r.Group;t.position.set(e.x,e.y,e.z),t.userData={isDevice:!0,label:e.label,key:e.key,type:e.type,scope:e.scope||"farm",zoneId:e.zoneId||null,zoneLabel:e.zoneLabel||null,value:e.value||"--",status:Y(e)};const a=new r.Mesh(e.compact?new r.SphereGeometry(.07,12,8):new r.BoxGeometry(.22,.18,.14),new r.MeshStandardMaterial({color:e.color,emissive:e.color,emissiveIntensity:e.type==="output"?.28:.16,roughness:.44,metalness:.16}));a.castShadow=!0,a.userData.root=t,t.add(a);const n=e.compact?X(e.key):e.label.replace(/\s+/g,`
`),s=this.createTextSprite(n,{bg:"rgba(255,255,255,.9)",fg:"#0f172a",font:"900 26px Inter, system-ui, sans-serif"});s.position.set(0,e.compact?.17:.24,0),s.scale.set(e.compact?.22:.34,e.compact?.09:.13,1),t.add(s),this.scene.add(t),this.interactiveRoots.push(t)},addPlantCluster(e,t,a,n,s){const o=U(s),i=new r.MeshStandardMaterial({color:3100976,roughness:.7}),h=new r.MeshStandardMaterial({color:o.color,roughness:.72,side:r.DoubleSide}),l=new r.MeshStandardMaterial({color:o.alt,roughness:.72,side:r.DoubleSide}),d=new r.Mesh(new r.CylinderGeometry(.008,.01,.15,6),i);d.position.set(t,a+.055,n),e.add(d);for(let p=0;p<7;p++){const u=Math.PI*2/7*p,c=o.spread+Math.random()*.025,m=new r.Mesh(new r.SphereGeometry(o.leaf,8,5),p%2?h:l);m.scale.set(1.4,.36,.82),m.position.set(t+Math.cos(u)*c,a+.12+p%3*.012,n+Math.sin(u)*c),m.rotation.set(-.45+Math.random()*.18,u,.18),m.castShadow=!0,e.add(m)}if(o.fruit)for(let p=0;p<2;p++){const u=Math.PI*p+.55,c=new r.Mesh(new r.SphereGeometry(.032,10,8),new r.MeshStandardMaterial({color:o.fruit,roughness:.55}));c.position.set(t+Math.cos(u)*.07,a+.105,n+Math.sin(u)*.07),e.add(c)}if(o.vine){const p=new r.Mesh(new r.CylinderGeometry(.006,.004,.34,5),new r.MeshStandardMaterial({color:o.color,roughness:.72}));p.position.set(t+.06,a-.02,n+.05),p.rotation.z=.25,e.add(p)}},addIrrigationPipes(e){const t=new r.MeshStandardMaterial({color:5605546,roughness:.28,metalness:.6}),a=new r.MeshStandardMaterial({color:9358054,roughness:.25,metalness:.55});[...new Set(e.map(s=>s.z))].forEach(s=>{const o=e.filter(d=>d.z===s),i=Math.min(...o.map(d=>d.x))-.8,h=Math.max(...o.map(d=>d.x))+.8,l=new r.Mesh(new r.CylinderGeometry(.035,.035,h-i,10),t);l.rotation.z=Math.PI/2,l.position.set((i+h)/2,3.35,s+.25),this.scene.add(l)}),e.forEach(s=>{const o=new r.Mesh(new r.CylinderGeometry(.02,.02,2.75,8),t);o.position.set(s.x+.28,1.9,s.z+.25),this.scene.add(o);const i=new r.Mesh(new r.SphereGeometry(.055,10,8),a);i.position.set(s.x+.28,3.28,s.z+.25),this.scene.add(i)})},addNutrientStation(){const e=new r.MeshStandardMaterial({color:2780750,roughness:.35,metalness:.15}),t=new r.MeshStandardMaterial({color:2054718,roughness:.4,metalness:.2});["N","P","K","pH"].forEach((n,s)=>{const o=-3+s*2,i=new r.Group;i.userData={isTank:!0,label:n,status:s===3&&K(this.sensorSnapshot)?"warning":"healthy"};const h=new r.Mesh(new r.CylinderGeometry(.42,.42,1.05,18),e);h.position.set(o,.58,-5.75),h.castShadow=!0,i.add(h);const l=new r.Mesh(new r.CylinderGeometry(.45,.42,.07,18),t);l.position.set(o,1.14,-5.75),i.add(l);const d=this.createTextSprite(n,{bg:"rgba(255,255,255,.92)",fg:"#0f172a",font:"900 34px Inter, system-ui, sans-serif"});d.position.set(o,.58,-5.28),d.scale.set(.22,.1,1),i.add(d),this.scene.add(i),this.interactiveRoots.push(i)})},addControlPanel(){const e=new r.MeshStandardMaterial({color:5593943,roughness:.5,metalness:.3}),t=new r.Mesh(new r.BoxGeometry(1.7,.08,.65),e);t.position.set(0,.86,5.75),t.castShadow=!0,this.scene.add(t);const a=new r.MeshStandardMaterial({color:464909,emissive:2062914,emissiveIntensity:.75,roughness:.12,metalness:.42}),n=new r.Mesh(new r.BoxGeometry(.95,.56,.04),a);n.position.set(0,1.38,5.45),n.castShadow=!0,this.scene.add(n);const s=this.createTextSprite("CONTROL",{bg:"rgba(9,18,13,.86)",fg:"#a3e635",font:"900 26px Inter, system-ui, sans-serif"});s.position.set(0,1.82,5.4),s.scale.set(.42,.13,1),this.scene.add(s)},addVentilationFans(){const e=new r.MeshStandardMaterial({color:2042167,roughness:.36,metalness:.55});[-7.3,7.3].forEach(t=>{const a=new r.Group;a.position.set(t,2.8,-5.9),a.userData.isFan=!0;const n=new r.Mesh(new r.TorusGeometry(.34,.025,8,32),e);a.add(n);for(let s=0;s<4;s++){const o=new r.Mesh(new r.BoxGeometry(.48,.045,.018),e);o.rotation.z=s*Math.PI/4,o.userData.isFanBlade=!0,a.add(o)}this.scene.add(a)})},addWaterDrips(e){const t=new r.MeshStandardMaterial({color:3718648,emissive:3718648,emissiveIntensity:.5,transparent:!0,opacity:.85});e.forEach((a,n)=>{if(n%2)return;const s=new r.Mesh(new r.SphereGeometry(.025,8,6),t.clone());s.position.set(a.x+.25,2.9,a.z+.28),s.userData.isDrip=!0,s.userData.baseY=s.position.y,this.scene.add(s)})},addParticles(){const t=new Float32Array(1080),a=new Float32Array(360*3);for(let o=0;o<360;o++)t[o*3]=(Math.random()-.5)*15,t[o*3+1]=Math.random()*4.4+.7,t[o*3+2]=(Math.random()-.5)*11,a[o*3]=(Math.random()-.5)*.002,a[o*3+1]=(Math.random()-.5)*.001,a[o*3+2]=(Math.random()-.5)*.002;const n=new r.BufferGeometry;n.setAttribute("position",new r.BufferAttribute(t,3));const s=new r.PointsMaterial({color:16777215,size:.028,transparent:!0,opacity:.28,depthWrite:!1,blending:r.AdditiveBlending});this.particles=new r.Points(n,s),this.particles.userData.velocities=a,this.scene.add(this.particles)},createOverlays(){var a;const e=this.slotPlants.filter(Boolean).length;this.detailPanel=document.createElement("div"),this.detailPanel.className="cf-overlay cf-info-panel",this.detailPanel.innerHTML=R({title:((a=this.farm)==null?void 0:a.name)||M.farmName||"Commercial Farm",subtitle:`${this.rack.label} · ${e}/${this.rack.total} planted`,status:T(this.slotPlants,this.sensorSnapshot),mode:"Facility overview"}),this.parent.appendChild(this.detailPanel),this.tooltip=document.createElement("div"),this.tooltip.className="cf-tooltip",this.tooltip.innerHTML='<span class="cf-tooltip-dot"></span><div><strong>Hover a tower</strong><small>Click to inspect rack details</small></div>',this.parent.appendChild(this.tooltip);const t=document.createElement("div");t.className="cf-overlay cf-legend",t.innerHTML=`
            <span><i class="ok"></i>Healthy</span>
            <span><i class="warn"></i>Warning</span>
            <span><i class="danger"></i>Critical</span>
            <span class="cf-legend-help">Drag rotate · Wheel / +/- zoom · Double click fullscreen</span>
        `,this.parent.appendChild(t),this.fullscreenButton=document.createElement("button"),this.fullscreenButton.type="button",this.fullscreenButton.className="cf-expand-btn",this.fullscreenButton.textContent="EXPAND",this.fullscreenButton.addEventListener("click",n=>{n.stopPropagation(),this.toggleFullscreen()}),this.parent.appendChild(this.fullscreenButton),this.zoomControls=document.createElement("div"),this.zoomControls.className="cf-zoom-controls",this.zoomControls.innerHTML=`
            <button type="button" data-zoom="in" aria-label="Zoom in">+</button>
            <button type="button" data-zoom="out" aria-label="Zoom out">-</button>
            <button type="button" data-zoom="reset" aria-label="Reset view">RESET</button>
        `,this.zoomControls.addEventListener("click",n=>{const s=n.target.closest("button[data-zoom]");s&&(n.preventDefault(),n.stopPropagation(),s.dataset.zoom==="in"&&this.zoomCamera(.82),s.dataset.zoom==="out"&&this.zoomCamera(1.22),s.dataset.zoom==="reset"&&this.resetCamera())}),this.parent.appendChild(this.zoomControls)},bindEvents(){this.resizeHandler=()=>this.resize(),window.addEventListener("resize",this.resizeHandler),this.fullscreenHandler=()=>{this.syncExpandButton(),setTimeout(()=>this.resize(),80)},document.addEventListener("fullscreenchange",this.fullscreenHandler),this.canvas.addEventListener("pointermove",this.onPointerMove),this.canvas.addEventListener("click",this.onClick),this.canvas.addEventListener("dblclick",this.onDoubleClick),this.canvas.addEventListener("wheel",this.onWheel,{passive:!1})},onPointerMove:null,onClick:null,onDoubleClick:null,onWheel:null,installHandlers(){this.onPointerMove=e=>this.handlePointerMove(e),this.onClick=e=>this.handleClick(e),this.onDoubleClick=()=>this.toggleFullscreen(),this.onWheel=e=>this.handleWheel(e)},handlePointerMove(e){const t=this.pickRoot(e);t!==this.hoverRoot&&(this.hoverRoot&&this.hoverRoot!==this.selectedRoot&&this.setHighlight(this.hoverRoot,!1),this.hoverRoot=t,this.hoverRoot&&this.hoverRoot!==this.selectedRoot&&this.setHighlight(this.hoverRoot,!0)),this.canvas.style.cursor=t?"pointer":"grab",this.updateTooltip(t)},handleClick(e){const t=this.pickRoot(e);if(!t){this.selectedRoot&&this.setHighlight(this.selectedRoot,!1),this.selectedRoot=null,this.showOverview();return}this.selectedRoot&&this.selectedRoot!==t&&this.setHighlight(this.selectedRoot,!1),this.selectedRoot=t,this.setHighlight(t,!0,!0),this.showRootDetail(t)},handleWheel(e){!this.camera||!this.controls||(e.preventDefault(),e.stopPropagation(),this.zoomCamera(e.deltaY>0?1.12:.88))},zoomCamera(e){var h,l;if(!this.camera||!this.controls)return;const t=this.controls.target,a=this.camera.position.clone().sub(t),n=a.length()||1,s=(h=this.parent)!=null&&h.classList.contains("cf-expanded")?2.4:2.8,o=(l=this.parent)!=null&&l.classList.contains("cf-expanded")?24:18,i=r.MathUtils.clamp(n*e,s,o);a.setLength(i),this.camera.position.copy(t).add(a),this.controls.update()},resetCamera(){var e;this.setCameraFrame((e=this.parent)==null?void 0:e.classList.contains("cf-expanded"))},setCameraFrame(e=!1){!this.camera||!this.controls||(e?(this.camera.fov=38,this.camera.position.set(.35,18.5,.35),this.controls.target.set(0,0,0),this.controls.minPolarAngle=Math.PI*.015,this.controls.maxPolarAngle=Math.PI*.18):(this.camera.fov=58,this.camera.position.set(5.5,4.6,8.5),this.controls.target.set(0,1.55,0),this.controls.minPolarAngle=0,this.controls.maxPolarAngle=Math.PI*.48),this.camera.updateProjectionMatrix(),this.controls.update())},pickRoot(e){var o,i;const t=this.canvas.getBoundingClientRect();this.pointer.x=(e.clientX-t.left)/t.width*2-1,this.pointer.y=-((e.clientY-t.top)/t.height)*2+1,this.raycaster.setFromCamera(this.pointer,this.camera);const a=[];this.interactiveRoots.forEach(h=>h.traverse(l=>{l.isMesh&&a.push(l)}));const n=(o=this.raycaster.intersectObjects(a,!1)[0])==null?void 0:o.object;if(!n)return null;let s=n;for(;s;){if(this.interactiveRoots.includes(s))return s;if((i=s.userData)!=null&&i.root&&this.interactiveRoots.includes(s.userData.root))return s.userData.root;s=s.parent}return null},setHighlight(e,t,a=!1){const n=a?new r.Color(3718648):new r.Color(10741301),s=a?.65:.32;e.traverse(o=>{var i;!o.isMesh||!((i=o.material)!=null&&i.emissive)||(o.userData.originalEmissive||(o.userData.originalEmissive=o.material.emissive.clone(),o.userData.originalIntensity=o.material.emissiveIntensity||0),t?(o.material.emissive.copy(n),o.material.emissiveIntensity=s):(o.material.emissive.copy(o.userData.originalEmissive),o.material.emissiveIntensity=o.userData.originalIntensity))})},updateTooltip(e){if(!this.tooltip)return;if(!e){this.tooltip.innerHTML='<span class="cf-tooltip-dot"></span><div><strong>Hover a tower</strong><small>Click to inspect rack details</small></div>';return}const t=e.userData||{},a=Array.isArray(t.plants)?t.plants.length:0;this.tooltip.innerHTML=`
            <span class="cf-tooltip-dot ${t.status||"healthy"}"></span>
            <div><strong>${g(t.label||"Station")}</strong><small>${t.isDevice?`${t.scope||"farm"} ${t.type}`:a?`${a} active plants`:t.isTank?"Nutrient station":"Empty zone"}</small></div>
        `},showOverview(){var t;const e=this.slotPlants.filter(Boolean).length;this.detailPanel.innerHTML=R({title:((t=this.farm)==null?void 0:t.name)||M.farmName||"Commercial Farm",subtitle:`${this.rack.label} · ${e}/${this.rack.total} planted`,status:T(this.slotPlants,this.sensorSnapshot),mode:"Facility overview"})},showRootDetail(e){const t=e.userData||{};if(t.isTank){this.detailPanel.innerHTML=te(t,this.sensorSnapshot);return}if(t.isDevice){this.detailPanel.innerHTML=ae(t);return}const a=Array.isArray(t.plants)?t.plants:[];this.detailPanel.innerHTML=ee(t,a,this.sensorSnapshot)},async toggleFullscreen(){if(!this.parent)return;!this.parent.classList.contains("cf-expanded")?this.enterExpandedView():this.exitExpandedView()},enterExpandedView(){!this.parent||this.parent.classList.contains("cf-expanded")||(this.originalParent=this.parent.parentNode,this.originalNextSibling=this.parent.nextSibling,document.body.appendChild(this.parent),this.parent.classList.add("cf-expanded"),document.documentElement.classList.add("cf-expanded-lock"),document.body.classList.add("cf-expanded-lock"),this.syncExpandButton(),this.setCameraFrame(!0),requestAnimationFrame(()=>this.resize()),setTimeout(()=>this.resize(),120))},exitExpandedView(){this.parent&&(this.parent.classList.remove("cf-expanded"),document.documentElement.classList.remove("cf-expanded-lock"),document.body.classList.remove("cf-expanded-lock"),this.restoreHostPlacement(),this.syncExpandButton(),this.setCameraFrame(!1),requestAnimationFrame(()=>this.resize()),setTimeout(()=>this.resize(),120))},restoreHostPlacement(){!this.parent||!this.originalParent||(this.originalNextSibling&&this.originalNextSibling.parentNode===this.originalParent?this.originalParent.insertBefore(this.parent,this.originalNextSibling):this.originalParent.appendChild(this.parent),this.originalParent=null,this.originalNextSibling=null)},syncExpandButton(){!this.fullscreenButton||!this.parent||(this.fullscreenButton.textContent=this.parent.classList.contains("cf-expanded")?"CLOSE":"EXPAND")},resize(){var i,h;if(!this.canvas||!this.renderer||!this.camera)return;const e=(i=this.parent)==null?void 0:i.classList.contains("cf-expanded"),t=(h=this.parent)==null?void 0:h.classList.contains("commercial-command-screen"),a=e||t;t&&(I(this.parent,{position:"fixed",inset:"0",width:"100vw",height:"100vh",minHeight:"100vh",overflow:"hidden",borderRadius:"0"}),I(this.canvas,{position:"fixed",inset:"0",width:"100vw",height:"100vh",minHeight:"100vh",display:"block",borderRadius:"0"}));const n=this.canvas.getBoundingClientRect(),s=a?window.innerWidth||document.documentElement.clientWidth||n.width||1280:Math.max(320,n.width||this.parent.clientWidth||640),o=a?window.innerHeight||document.documentElement.clientHeight||n.height||720:Math.max(300,n.height||420);this.renderer.setSize(s,o,!1),this.camera.aspect=s/o,this.camera.updateProjectionMatrix()},animate(){var t,a;const e=Math.min(.04,((a=(t=this.clock)==null?void 0:t.getDelta)==null?void 0:a.call(t))||.016);this.frame+=1,this.controls&&this.controls.update(),this.updateParticles(),this.scene.traverse(n=>{var s,o;(s=n.userData)!=null&&s.isFanBlade&&(n.rotation.z+=4.8*e),(o=n.userData)!=null&&o.isDrip&&(n.position.y-=.55*e,n.position.y<.7&&(n.position.y=n.userData.baseY))}),this.renderer&&this.scene&&this.camera&&this.renderer.render(this.scene,this.camera),this.rafId=requestAnimationFrame(()=>this.animate())},updateParticles(){if(!this.particles)return;const e=this.particles.geometry.attributes.position,t=this.particles.userData.velocities;for(let a=0;a<e.count;a++)e.array[a*3]+=t[a*3],e.array[a*3+1]+=t[a*3+1],e.array[a*3+2]+=t[a*3+2],e.array[a*3]>7.5&&(e.array[a*3]=-7.5),e.array[a*3]<-7.5&&(e.array[a*3]=7.5),e.array[a*3+1]>5.4&&(e.array[a*3+1]=.7),e.array[a*3+2]>5.5&&(e.array[a*3+2]=-5.5),e.array[a*3+2]<-5.5&&(e.array[a*3+2]=5.5);e.needsUpdate=!0},createTextSprite(e,t={}){const a=document.createElement("canvas");a.width=512,a.height=128;const n=a.getContext("2d");n.clearRect(0,0,a.width,a.height),Q(n,18,22,a.width-36,84,28),n.fillStyle=t.bg||"rgba(12,20,14,.9)",n.fill(),t.border&&(n.strokeStyle=t.border,n.lineWidth=4,n.stroke()),n.fillStyle=t.fg||"#ffffff",n.font=t.font||"900 30px Inter, system-ui, sans-serif",n.textAlign="center",n.textBaseline="middle",n.fillText(e,a.width/2,66);const s=new r.CanvasTexture(a);s.colorSpace=r.SRGBColorSpace;const o=new r.SpriteMaterial({map:s,transparent:!0,depthWrite:!1}),i=new r.Sprite(o);return i.userData.texture=s,i},destroy(){var e;this.rafId&&cancelAnimationFrame(this.rafId),this.rafId=null,this.resizeHandler&&window.removeEventListener("resize",this.resizeHandler),this.fullscreenHandler&&document.removeEventListener("fullscreenchange",this.fullscreenHandler),this.canvas&&this.onPointerMove&&this.canvas.removeEventListener("pointermove",this.onPointerMove),this.canvas&&this.onClick&&this.canvas.removeEventListener("click",this.onClick),this.canvas&&this.onDoubleClick&&this.canvas.removeEventListener("dblclick",this.onDoubleClick),this.canvas&&this.onWheel&&this.canvas.removeEventListener("wheel",this.onWheel),this.controls&&this.controls.dispose(),this.scene&&this.scene.traverse(t=>{var a;t.geometry&&t.geometry.dispose(),(a=t.userData)!=null&&a.texture&&t.userData.texture.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(n=>n.dispose()):t.material.dispose())}),this.renderer&&this.renderer.dispose(),(e=this.parent)!=null&&e.classList.contains("cf-expanded")&&this.exitExpandedView(),this.parent&&(this.parent.classList.remove("cf-expanded"),this.parent.querySelectorAll(".cf-overlay, .cf-tooltip, .cf-expand-btn, .cf-zoom-controls").forEach(t=>t.remove()),this.parent.classList.remove("commercial-farm-host")),document.documentElement.classList.remove("cf-expanded-lock"),document.body.classList.remove("cf-expanded-lock"),this.canvas=null,this.parent=null,this.renderer=null,this.scene=null,this.camera=null,this.controls=null,this.farmGroup=null,this.particles=null,this.raycaster=null,this.pointer=null,this.interactiveRoots=[],this.hoverRoot=null,this.selectedRoot=null,this.detailPanel=null,this.tooltip=null,this.fullscreenButton=null,this.zoomControls=null,this.originalParent=null,this.originalNextSibling=null,this.resizeHandler=null,this.fullscreenHandler=null,this.onPointerMove=null,this.onClick=null,this.onDoubleClick=null,this.onWheel=null}};function G(){const e=A();return M.currentFarm||e.find(t=>t.id===M.currentFarmId)||e[e.length-1]||null}function A(){try{return JSON.parse(localStorage.getItem(H))||[]}catch{return[]}}function B(e){if(C(e).length){const a=C(e).length;return{id:"commercial-zones",label:`${a}-Zone Commercial Farm`,tiers:a,slotsPerTier:12,total:Math.max(12,a*12)}}const t=String((e==null?void 0:e.rackTypeId)||(e==null?void 0:e.rackType)||(e==null?void 0:e.rackLabel)||"").toLowerCase();return t.includes("2")?y["2-tier"]:t.includes("4")?y["4-tier"]:t.includes("5")?y["5-tier"]:t.includes("wall")||t.includes("grid")?y.wall:t.includes("frame")?y["a-frame"]:t.includes("nft")||t.includes("channel")?y["nft-channel"]:t.includes("hanging")||t.includes("column")?y.hanging:y["3-tier"]}function _(e,t){const a=Array.isArray(e==null?void 0:e.plants)?e.plants:[],n=C(e),s=n.length?Math.max(t.total,n.length*12,a.length*3):t.total,o=Array(s).fill(null),i=new Set;if(a.forEach((l,d)=>{var u;if(n.length&&l.zoneId){const c=n.findIndex(b=>W(b,l)),m=Math.max(0,c)*12,f=Math.max(1,Number.parseInt(l.slots||l.count||1,10)||1);for(let b=0;b<f;b++){const w=O(o,i,m,m+12)??L(o,i);if(w===-1||w===null||w===void 0)return;o[w]=k(l,w,t,e),o[w].zoneId=l.zoneId,o[w].zoneName=l.zoneName||((u=n[c])==null?void 0:u.name)||l.zoneId,i.add(w)}return}if(l.slotIndex!==void 0&&l.slotIndex!==null){const c=Number(l.slotIndex);Number.isInteger(c)&&c>=0&&c<o.length&&(o[c]=k(l,c,t,e),i.add(c));return}const p=Math.max(1,Number.parseInt(l.slots||l.count||1,10)||1);for(let c=0;c<p;c++){const m=L(o,i);if(m===-1)return;o[m]=k(l,m,t,e),i.add(m)}}),o.some(Boolean))return o;const h=Math.min(t.total,Number.parseInt((e==null?void 0:e.plantSlots)||(e==null?void 0:e.plants)||0,10)||0);for(let l=0;l<h;l++)o[l]=k({name:(e==null?void 0:e.targetPlant)||"Plant",status:"healthy"},l,t,e);return o}function C(e){var a;return(Array.isArray(e==null?void 0:e.zones)?e.zones:Array.isArray((a=e==null?void 0:e.commercialStructure)==null?void 0:a.zones)?e.commercialStructure.zones:[]).map((n,s)=>({...n,zone_id:n.zone_id||n.id||`zone_${String.fromCharCode(65+s)}`,name:n.name||`Zone ${String.fromCharCode(65+s)}`})).filter(n=>n.zone_id||n.name)}function W(e,t){const a=String(t.zoneId||t.zone_id||t.zone||"").toLowerCase();return a&&(a===String(e.zone_id||"").toLowerCase()||a===String(e.id||"").toLowerCase()||a===String(e.name||"").toLowerCase())}function O(e,t,a,n){const s=Math.max(0,a),o=Math.min(e.length,n);for(let i=s;i<o;i++)if(!e[i]&&!t.has(i))return i;return null}function k(e,t,a,n){const s=e.name||(n==null?void 0:n.targetPlant)||"Plant";return{name:s,emoji:e.emoji||re(s),species:e.species||N(s),status:e.status||Z(e.growth),growth:Number(e.growth??70),days:Number(e.days??0),slotIndex:t,tier:Math.floor(t/a.slotsPerTier)+1,position:t%a.slotsPerTier+1}}function L(e,t){for(let a=0;a<e.length;a++)if(!e[a]&&!t.has(a))return a;return-1}function Z(e){const t=Number(e??80);return t<35?"danger":t<60?"warning":"healthy"}function D(e){return e==="danger"?15680580:e==="warning"?16096779:e==="empty"?6583435:8702998}function V(e){return e.length?e.some(t=>t.status==="danger")?"danger":e.some(t=>t.status==="warning")?"warning":"healthy":"empty"}function T(e,t){return e.some(Boolean)&&e.some(a=>(a==null?void 0:a.status)==="danger")?"Critical plant risk":Number(t.gasRaw||0)>2500||Number(t.temperature||25)>35?"Automation alert":e.some(a=>(a==null?void 0:a.status)==="warning")?"Needs review":"Operational"}function P(){var t,a,n,s,o,i,h,l,d,p,u,c;const e=M.sensors||{};return{temperature:((t=e.temp)==null?void 0:t.val)??25,humidity:((a=e.humid)==null?void 0:a.val)??60,lightRaw:((n=e.light)==null?void 0:n.val)??2e3,soilRaw:((s=e.soil)==null?void 0:s.val)??((o=e.soilRaw)==null?void 0:o.val)??1800,ph:((i=e.ph)==null?void 0:i.val)??6.1,waterDistanceCm:((h=e.water)==null?void 0:h.val)??10,gasRaw:((l=e.nutrient)==null?void 0:l.val)??1e3,ec:((d=e.ec)==null?void 0:d.val)??1.5,co2Ppm:((p=e.co2)==null?void 0:p.val)??850,energyKwh:((u=e.energy)==null?void 0:u.val)??5.1,waterFlowLpm:((c=e.flow)==null?void 0:c.val)??.8}}function q(e,t){return{dht11:`${Number(t.temperature||0).toFixed(1)}C / ${Number(t.humidity||0)}%`,soil:`${Number(t.soilRaw||1800)} raw`,ldr:`${Number(t.lightRaw||0)} raw`,ph:`${Number(t.ph||0).toFixed(1)} pH`,ec:`${Number(t.ec||1.5).toFixed(1)} EC`,flow:`${Number(t.waterFlowLpm||.8).toFixed(1)} L/min`,pump:Number(t.waterDistanceCm||0)>20?"ready":"standby",grow_light:Number(t.lightRaw||0)<1500?"active":"standby",zone_fan:Number(t.temperature||25)>30?"active":"standby",active_buzzer:Number(t.gasRaw||0)>2500?"alert":"ready",camera:"scan ready"}[e]||"--"}function X(e){return{dht11:"DHT",soil:"SOIL",ldr:"LDR",ph:"pH",ec:"EC",flow:"FLOW",pump:"PUMP",grow_light:"LED",zone_fan:"FAN",active_buzzer:"BUZZ",camera:"CAM"}[e]||String(e).slice(0,4).toUpperCase()}function Y(e){const t=String(e.value||"").toLowerCase();return t.includes("alert")||t.includes("danger")?"danger":t.includes("active")?"warning":"healthy"}function K(e){const t=Number(e.ph??6.1);return t<5.5||t>6.5}function U(e){const t=N((e==null?void 0:e.species)||(e==null?void 0:e.name)||"plant"),a=S[t];if(a)return a;const n=Object.keys(S).find(s=>t.includes(s));return S[n]||S.plant}function j(e,t,a,n){return Number.isNaN(e)?!1:e%n===a||Math.floor(e/Math.max(1,t.slotsPerTier))===a}function J(e,t,a,n,s,o={}){return e!=null&&e.zoneId&&o.zoneId?String(e.zoneId).toLowerCase()===String(o.zoneId).toLowerCase():e!=null&&e.zoneName&&o.label?String(e.zoneName).toLowerCase()===String(o.label).toLowerCase():j(t,a,n,s)}function E(e,t,a){const n=new r.BufferGeometry().setFromPoints([new r.Vector3(...e),new r.Vector3(...t)]);return new r.Line(n,a)}function Q(e,t,a,n,s,o){e.beginPath(),e.moveTo(t+o,a),e.lineTo(t+n-o,a),e.quadraticCurveTo(t+n,a,t+n,a+o),e.lineTo(t+n,a+s-o),e.quadraticCurveTo(t+n,a+s,t+n-o,a+s),e.lineTo(t+o,a+s),e.quadraticCurveTo(t,a+s,t,a+s-o),e.lineTo(t,a+o),e.quadraticCurveTo(t,a,t+o,a),e.closePath()}function R({title:e,subtitle:t,status:a,mode:n}){return`
        <div class="cf-panel-kicker">${g(n)}</div>
        <div class="cf-panel-title">${g(e)}</div>
        <div class="cf-panel-sub">${g(t)}</div>
        <div class="cf-mini-grid">
            ${x("Status",a)}
            ${x("Light",`${Math.round(Number(P().lightRaw||0))}`)}
            ${x("pH",`${Number(P().ph||0).toFixed(1)}`)}
        </div>
    `}function ee(e,t,a){const n=t.filter(i=>i.status==="healthy").length,s=t.filter(i=>i.status==="warning").length,o=t.filter(i=>i.status==="danger").length;return`
        <div class="cf-panel-kicker">Selected production zone</div>
        <div class="cf-panel-title">${g(e.label||"Zone")}</div>
        <div class="cf-panel-sub">${t.length||0} active plants · ${g(e.status||"empty")}</div>
        <div class="cf-mini-grid">
            ${x("Healthy",n)}
            ${x("Warning",s)}
            ${x("Critical",o)}
            ${x("Temp",`${Number(a.temperature||0).toFixed(1)}C`)}
        </div>
        <div class="cf-plant-list">
            ${t.slice(0,5).map(i=>`<span>${g(i.name)} <b>${g(i.status)}</b></span>`).join("")||"<span>No assigned crop yet</span>"}
        </div>
    `}function te(e,t){return`
        <div class="cf-panel-kicker">Nutrient station</div>
        <div class="cf-panel-title">${g(e.label||"Tank")} Tank</div>
        <div class="cf-panel-sub">Linked to commercial automation controls</div>
        <div class="cf-mini-grid">
            ${x("pH",`${Number(t.ph||0).toFixed(1)}`)}
            ${x("Water",`${Number(t.waterDistanceCm||0)}cm`)}
            ${x("Status",g(e.status||"healthy"))}
        </div>
    `}function ae(e){const t=e.scope==="zone"?e.zoneLabel||e.zoneId||"Zone":"Farm Level",a=e.type==="output"?"Actuator / Output":"Sensor";return`
        <div class="cf-panel-kicker">Digital twin device</div>
        <div class="cf-panel-title">${g(e.label||"Device")}</div>
        <div class="cf-panel-sub">${g(t)} · ${g(a)}</div>
        <div class="cf-mini-grid">
            ${x("Value",e.value||"--")}
            ${x("Status",e.status||"healthy")}
            ${x("Type",e.type||"sensor")}
        </div>
        <div class="cf-plant-list">
            <span>Layer <b>${g(e.scope==="zone"?"ZONE":"FARM")}</b></span>
            <span>Clickable <b>YES</b></span>
            <span>Purpose <b>${g(ne(e.key))}</b></span>
        </div>
    `}function ne(e){return{co2:"air enrichment",reservoir:"water level",gas:"safety alert",power:"energy tracking",main_fan:"facility airflow",emergency_buzzer:"emergency alarm",dht11:"temperature humidity",soil:"root moisture",ldr:"light detection",ph:"water acidity",ec:"nutrient strength",flow:"irrigation flow",pump:"irrigation output",grow_light:"lighting output",zone_fan:"zone airflow",active_buzzer:"zone warning",camera:"plant vision"}[e]||"monitoring"}function x(e,t){return`<div class="cf-mini-metric"><span>${g(e)}</span><strong>${g(t)}</strong></div>`}function re(e=""){const t=String(e).toLowerCase();return t.includes("lettuce")||t.includes("cabbage")||t.includes("kale")?"🥬":t.includes("tomato")?"🍅":t.includes("chili")||t.includes("pepper")?"🌶️":t.includes("strawberry")?"🍓":t.includes("cucumber")?"🥒":t.includes("carrot")?"🥕":t.includes("eggplant")?"🍆":t.includes("basil")||t.includes("mint")||t.includes("spinach")?"🌿":"🌱"}function N(e=""){return String(e||"plant").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function g(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function I(e,t){e&&Object.entries(t).forEach(([a,n])=>{const s=a.replace(/[A-Z]/g,o=>"-"+o.toLowerCase());e.style.setProperty(s,n,"important")})}function se(){if(document.getElementById("commercial-farm-canvas-style"))return;const e=document.createElement("style");e.id="commercial-farm-canvas-style",e.textContent=`
        .commercial-farm-host {
            position: relative;
            overflow: hidden;
            border-radius: 22px;
            background: #07110c;
            border: 1px solid rgba(163, 230, 53, 0.12);
            box-shadow: 0 24px 60px rgba(2, 6, 23, 0.28);
        }
        .commercial-farm-canvas {
            width: 100% !important;
            height: clamp(360px, 48dvh, 620px) !important;
            display: block;
            background: #f8faf7 !important;
            border-radius: 22px !important;
        }
        .commercial-preview-host.commercial-farm-host {
            height: min(58dvh, 520px) !important;
            min-height: 360px !important;
            background: #f8faf7 !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
        }
        .commercial-preview-host .commercial-farm-canvas {
            height: 100% !important;
            border-radius: 0 !important;
        }
        .commercial-command-screen.commercial-farm-host {
            position: fixed !important;
            inset: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            height: 100dvh !important;
            overflow: hidden !important;
            border-radius: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: #f8faf7 !important;
        }
        .commercial-command-screen .commercial-farm-canvas {
            position: fixed !important;
            inset: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            height: 100dvh !important;
            display: block !important;
            border-radius: 0 !important;
            background: #f8faf7 !important;
        }
        .cf-overlay {
            position: absolute;
            z-index: 8;
            color: #fff;
            pointer-events: auto;
            font-family: Inter, system-ui, sans-serif;
        }
        .cf-info-panel {
            top: 14px;
            left: 14px;
            width: min(320px, calc(100% - 86px));
            padding: 14px 16px;
            border-radius: 18px;
            background: rgba(8, 15, 11, 0.76);
            border: 1px solid rgba(163, 230, 53, 0.18);
            backdrop-filter: blur(18px);
            box-shadow: 0 18px 50px rgba(0, 0, 0, 0.25);
        }
        .cf-panel-kicker {
            color: #a3e635;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .16em;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .cf-panel-title {
            font-size: 16px;
            font-weight: 900;
            line-height: 1.1;
        }
        .cf-panel-sub {
            color: rgba(255,255,255,.48);
            font-size: 11px;
            font-weight: 700;
            margin-top: 4px;
        }
        .cf-mini-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin-top: 12px;
        }
        .cf-mini-metric {
            padding: 8px;
            border-radius: 12px;
            background: rgba(255,255,255,.045);
            border: 1px solid rgba(255,255,255,.06);
        }
        .cf-mini-metric span {
            display: block;
            font-size: 8px;
            font-weight: 900;
            letter-spacing: .08em;
            text-transform: uppercase;
            color: rgba(255,255,255,.36);
        }
        .cf-mini-metric strong {
            display: block;
            margin-top: 3px;
            color: #fff;
            font-size: 13px;
            line-height: 1.05;
            word-break: break-word;
        }
        .cf-plant-list {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-top: 12px;
            max-height: 120px;
            overflow: auto;
        }
        .cf-plant-list span {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            padding: 7px 9px;
            border-radius: 10px;
            background: rgba(255,255,255,.04);
            color: rgba(255,255,255,.74);
            font-size: 11px;
            font-weight: 800;
        }
        .cf-plant-list b {
            color: #a3e635;
            text-transform: uppercase;
            font-size: 9px;
        }
        .cf-tooltip {
            position: absolute;
            left: 50%;
            bottom: 18px;
            transform: translateX(-50%);
            z-index: 8;
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 220px;
            padding: 10px 14px;
            border-radius: 14px;
            color: #fff;
            background: rgba(8, 15, 11, .72);
            border: 1px solid rgba(163, 230, 53, .18);
            backdrop-filter: blur(16px);
            pointer-events: none;
        }
        .cf-tooltip strong {
            display: block;
            font-size: 12px;
            color: #a3e635;
        }
        .cf-tooltip small {
            display: block;
            margin-top: 2px;
            color: rgba(255,255,255,.45);
            font-size: 10px;
            font-weight: 700;
        }
        .cf-tooltip-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #a3e635;
            box-shadow: 0 0 16px rgba(163,230,53,.55);
        }
        .cf-tooltip-dot.warning { background:#f59e0b; box-shadow:0 0 16px rgba(245,158,11,.55); }
        .cf-tooltip-dot.danger { background:#ef4444; box-shadow:0 0 16px rgba(239,68,68,.55); }
        .cf-tooltip-dot.empty { background:#64748b; box-shadow:none; }
        .cf-legend {
            right: 14px;
            bottom: 14px;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 9px 12px;
            border-radius: 13px;
            background: rgba(8, 15, 11, .62);
            border: 1px solid rgba(255,255,255,.08);
            backdrop-filter: blur(12px);
            font-size: 9px;
            font-weight: 900;
            color: rgba(255,255,255,.56);
            text-transform: uppercase;
        }
        .cf-legend span {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            white-space: nowrap;
        }
        .cf-legend i {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            display: inline-block;
        }
        .cf-legend .ok { background:#a3e635; }
        .cf-legend .warn { background:#f59e0b; }
        .cf-legend .danger { background:#ef4444; }
        .cf-legend-help {
            color: rgba(255,255,255,.28);
            text-transform: none;
        }
        .cf-expand-btn {
            position: absolute;
            top: 14px;
            right: 14px;
            z-index: 9;
            height: 36px;
            padding: 0 14px;
            border-radius: 999px;
            border: 1px solid rgba(163, 230, 53, .24);
            background: rgba(8, 15, 11, .72);
            color: #a3e635;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: .08em;
            cursor: pointer;
            backdrop-filter: blur(12px);
        }
        .cf-expand-btn:hover {
            background: rgba(163, 230, 53, .12);
        }
        .cf-zoom-controls {
            position: absolute;
            top: 58px;
            right: 14px;
            z-index: 9;
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 7px;
            border-radius: 18px;
            background: rgba(8, 15, 11, .68);
            border: 1px solid rgba(163, 230, 53, .18);
            backdrop-filter: blur(12px);
        }
        .cf-zoom-controls button {
            width: 38px;
            min-height: 34px;
            border: 1px solid rgba(255,255,255,.1);
            border-radius: 12px;
            background: rgba(255,255,255,.06);
            color: #ecfccb;
            font-size: 15px;
            font-weight: 900;
            line-height: 1;
            cursor: pointer;
        }
        .cf-zoom-controls button[data-zoom="reset"] {
            width: 48px;
            min-height: 30px;
            font-size: 8px;
            letter-spacing: .08em;
        }
        .cf-zoom-controls button:hover {
            background: rgba(163, 230, 53, .14);
            border-color: rgba(163, 230, 53, .28);
        }
        .cf-zoom-controls button:active {
            transform: translateY(1px);
        }
        .commercial-farm-host:fullscreen {
            width: 100vw !important;
            height: 100vh !important;
            border-radius: 0 !important;
            background: #07110c !important;
        }
        .commercial-farm-host:fullscreen .commercial-farm-canvas {
            width: 100vw !important;
            height: 100vh !important;
            border-radius: 0 !important;
        }
        .commercial-farm-host:fullscreen .cf-info-panel {
            top: 20px;
            left: 20px;
            width: 360px;
        }
        html.cf-expanded-lock,
        body.cf-expanded-lock {
            overflow: hidden !important;
            width: 100vw !important;
            height: 100vh !important;
        }
        .commercial-farm-host.cf-expanded {
            position: fixed !important;
            inset: 0 !important;
            z-index: 99999 !important;
            width: 100vw !important;
            height: 100vh !important;
            height: 100dvh !important;
            margin: 0 !important;
            padding: 0 !important;
            border-radius: 0 !important;
            background: #07110c !important;
            border: none !important;
            box-shadow: none !important;
            transform: none !important;
            max-width: none !important;
        }
        .commercial-farm-host.cf-expanded .commercial-farm-canvas {
            width: 100vw !important;
            height: 100vh !important;
            height: 100dvh !important;
            border-radius: 0 !important;
        }
        .commercial-farm-host.cf-expanded .cf-info-panel {
            top: 20px;
            left: 20px;
            width: min(390px, calc(100vw - 92px));
        }
        .commercial-farm-host.cf-expanded .cf-expand-btn {
            top: 20px;
            right: 20px;
        }
        .commercial-farm-host.cf-expanded .cf-zoom-controls {
            top: 68px;
            right: 20px;
        }
        @media (max-width: 520px) {
            .cf-legend-help { display:none !important; }
            .cf-legend { left:14px; right:14px; justify-content:center; }
            .cf-tooltip { display:none; }
            .commercial-farm-canvas { height: 390px !important; }
        }
    `,document.head.appendChild(e)}export{le as CommercialFarmCanvas};
