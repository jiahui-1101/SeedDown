const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/FarmListPage-BCR7UIrt.js","assets/index-kXpGLROK.js","assets/index-C2Ow7ZKh.css"])))=>i.map(i=>d[i]);
import{A as T,a as w,_ as Et}from"./index-kXpGLROK.js";import*as i from"https://esm.sh/three@0.160.0";import{OrbitControls as Je}from"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";import Nt from"https://esm.sh/jsqr@1.4.0";const Bt="user_farms",V={"2-tier":{id:"2-tier",label:"2-Tier Starter Rack",tiers:2,slotsPerTier:3,total:6},"3-tier":{id:"3-tier",label:"3-Tier Vertical Rack",tiers:3,slotsPerTier:3,total:9},"4-tier":{id:"4-tier",label:"4-Tier Grow Shelf",tiers:4,slotsPerTier:4,total:16},"5-tier":{id:"5-tier",label:"5-Tier Tower Rack",tiers:5,slotsPerTier:4,total:20},wall:{id:"wall",label:"Wall Panel Grid",tiers:4,slotsPerTier:5,total:20},"a-frame":{id:"a-frame",label:"A-Frame Pyramid",tiers:4,slotsPerTier:4,total:16},"nft-channel":{id:"nft-channel",label:"NFT Channel Rows",tiers:3,slotsPerTier:6,total:18},hanging:{id:"hanging",label:"Hanging Column Farm",tiers:5,slotsPerTier:3,total:15}},le={lettuce:{color:6927180,alt:9228129,leaf:.082,spread:.095},cabbage:{color:7448635,alt:10733911,leaf:.09,spread:.1},kale:{color:3108670,alt:5213518,leaf:.088,spread:.105},spinach:{color:3046706,alt:4431943,leaf:.072,spread:.088},basil:{color:2067020,alt:3323495,leaf:.064,spread:.078},mint:{color:3450963,alt:7327605,leaf:.062,spread:.078},tomato:{color:3116870,alt:15680580,leaf:.07,spread:.086,fruit:15680580},chili:{color:2522941,alt:14427686,leaf:.066,spread:.082,fruit:14427686},pepper:{color:2522941,alt:14427686,leaf:.066,spread:.082,fruit:14427686},cucumber:{color:2325052,alt:5284955,leaf:.078,spread:.105,vine:!0},strawberry:{color:4165449,alt:16478597,leaf:.066,spread:.082,fruit:16478597},eggplant:{color:3112783,alt:8141549,leaf:.072,spread:.088,fruit:8141549},plant:{color:6660877,alt:8843180,leaf:.072,spread:.09}},O={canvas:null,parent:null,renderer:null,scene:null,camera:null,controls:null,farmGroup:null,particles:null,raycaster:null,pointer:null,interactiveRoots:[],hoverRoot:null,selectedRoot:null,detailPanel:null,tooltip:null,fullscreenButton:null,zoomControls:null,mascotGroup:null,mascotTarget:null,mascotHome:null,mascotBubble:null,mascotSelectedContext:null,originalParent:null,originalNextSibling:null,resizeHandler:null,fullscreenHandler:null,rafId:null,clock:null,frame:0,farm:null,rack:V["3-tier"],slotPlants:[],sensorSnapshot:{},init(e,t=null){this.destroy(),this.installHandlers(),oa(),this.canvas=document.getElementById(e),this.canvas&&(this.parent=this.canvas.parentElement,this.parent&&(this.farm=t||Ft(),this.rack=Rt(this.farm),this.slotPlants=Gt(this.farm,this.rack),this.sensorSnapshot=xe(),this.clock=new i.Clock,this.prepareHost(),this.initScene(),this.buildFacility(),this.createOverlays(),this.bindEvents(),this.resize(),this.animate()))},prepareHost(){this.parent.classList.add("commercial-farm-host"),this.canvas.classList.add("commercial-farm-canvas"),this.parent.querySelectorAll(".cf-overlay, .cf-tooltip, .cf-expand-btn, .cf-zoom-controls").forEach(e=>e.remove())},initScene(){this.scene=new i.Scene,this.scene.background=new i.Color(16317175),this.scene.fog=new i.Fog(16317175,22,58),this.camera=new i.PerspectiveCamera(58,1,.1,120),this.camera.position.set(5.5,4.6,8.5),this.camera.lookAt(0,1.8,0),this.renderer=new i.WebGLRenderer({canvas:this.canvas,antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=i.PCFSoftShadowMap,this.renderer.outputColorSpace=i.SRGBColorSpace,this.renderer.toneMapping=i.ACESFilmicToneMapping,this.renderer.toneMappingExposure=1.08,this.controls=new Je(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.07,this.controls.enablePan=!0,this.controls.enableZoom=!1,this.controls.maxPolarAngle=Math.PI*.48,this.controls.target.set(0,1.55,0),this.setCameraFrame(!1),this.raycaster=new i.Raycaster,this.pointer=new i.Vector2,this.farmGroup=new i.Group,this.scene.add(this.farmGroup),this.addLighting()},addLighting(){this.scene.add(new i.AmbientLight(14479072,.55));const e=new i.DirectionalLight(16775399,2.2);e.position.set(10,18,9),e.castShadow=!0,e.shadow.mapSize.set(2048,2048),e.shadow.camera.left=-12,e.shadow.camera.right=12,e.shadow.camera.top=12,e.shadow.camera.bottom=-12,e.shadow.bias=-4e-4,this.scene.add(e);const t=new i.DirectionalLight(12244991,.35);t.position.set(-7,10,-6),this.scene.add(t);const a=new i.HemisphereLight(11657727,4928541,.28);this.scene.add(a);const n=new i.PointLight(8702998,1.25,12);n.position.set(0,3.1,0),this.scene.add(n)},buildFacility(){this.addFloor(),this.addGreenhouseFrame();const e=this.createTowerLayout();e.forEach((t,a)=>this.addTower(t,a)),this.addIrrigationPipes(e),this.addDigitalTwinDevices(e),this.addNutrientStation(),this.addControlPanel(),this.addAIMascot(),this.addVentilationFans(),this.addWaterDrips(e),this.addParticles()},addFloor(){const e=new i.Mesh(new i.PlaneGeometry(80,60),new i.MeshStandardMaterial({color:15265510,roughness:.86,metalness:.02}));e.rotation.x=-Math.PI/2,e.receiveShadow=!0,this.scene.add(e);const t=new i.Mesh(new i.PlaneGeometry(5.2,56),new i.MeshStandardMaterial({color:14542812,roughness:.78}));t.rotation.x=-Math.PI/2,t.position.y=.006,t.receiveShadow=!0,this.scene.add(t);const a=new i.LineBasicMaterial({color:11057322,transparent:!0,opacity:.48});for(let n=-38;n<=38;n+=2)this.scene.add(Oe([n,.014,-28],[n,.014,28],a));for(let n=-28;n<=28;n+=2)this.scene.add(Oe([-38,.016,n],[38,.016,n],a))},addGreenhouseFrame(){const e=new i.MeshStandardMaterial({color:10135456,metalness:.45,roughness:.32}),t=new i.MeshPhysicalMaterial({color:13625816,transparent:!0,opacity:.2,roughness:.04,side:i.DoubleSide}),a=17.6,n=13.6,o=4.3,r=6.2;for(let s=-n/2;s<=n/2+.001;s+=2.7){[-1,1].forEach(p=>{const m=new i.Mesh(new i.CylinderGeometry(.035,.035,o,10),e);m.position.set(p*a/2,o/2,s),m.castShadow=!0,this.scene.add(m)});const u=Math.sqrt((a/2)**2+(r-o)**2),d=Math.atan2(r-o,a/2);[-1,1].forEach(p=>{const m=new i.Mesh(new i.CylinderGeometry(.028,.028,u,8),e);m.position.set(p*a/4,o+(r-o)/2,s),m.rotation.z=p*(Math.PI/2-d),this.scene.add(m)})}const l=new i.Mesh(new i.CylinderGeometry(.032,.032,n,10),e);l.rotation.x=Math.PI/2,l.position.set(0,r,0),this.scene.add(l);const c=new i.Mesh(new i.PlaneGeometry(a,o),t);c.position.set(0,o/2,-n/2),this.scene.add(c),[-1,1].forEach(s=>{const u=new i.Mesh(new i.PlaneGeometry(n,o),t);u.rotation.y=Math.PI/2,u.position.set(s*a/2,o/2,0),this.scene.add(u)})},createTowerLayout(){const e=pe(this.farm);if(e.length){const l=Math.ceil(Math.sqrt(e.length)),c=Math.ceil(e.length/l),s=2.65,u=3.1,d=-((l-1)*s)/2,p=-((c-1)*u)/2;return e.map((m,h)=>({x:d+h%l*s,z:p+Math.floor(h/l)*u,zoneIndex:h,row:Math.floor(h/l),col:h%l,zoneId:m.zone_id||m.id||`zone_${String.fromCharCode(65+h)}`,label:m.name||`Zone ${String.fromCharCode(65+h)}`,crop:m.crop||(Array.isArray(m.plants)?m.plants.join(", "):"")||"Mixed crops"}))}const t=Math.max(6,Math.min(10,Math.ceil(this.rack.total/2))),a=[],n=Math.ceil(t/2),o=-((n-1)*2.15)/2,r=[-2.35,2.35];for(let l=0;l<2;l++)for(let c=0;c<n&&!(a.length>=t);c++)a.push({x:o+c*2.15,z:r[l],zoneIndex:a.length,row:l,col:c});return a},addTower(e,t){const a=String.fromCharCode(65+t),n=new i.Group;n.position.set(e.x,0,e.z),n.userData={isTower:!0,id:e.zoneId||`zone-${a}`,label:e.label||`Zone ${a}`,crop:e.crop||"Mixed crops",zoneIndex:t,plants:[],status:"empty"},this.addZoneFootprint(n,e,t);const o=new i.MeshStandardMaterial({color:15330800,roughness:.34,metalness:.18}),r=new i.MeshStandardMaterial({color:2503725,roughness:.5,metalness:.4}),l=new i.Mesh(new i.CylinderGeometry(.095,.12,3.2,22),o);l.position.y=1.67,l.castShadow=!0,n.add(l);const c=new i.Mesh(new i.CylinderGeometry(.48,.6,.15,28),r);c.position.y=.075,c.castShadow=!0,n.add(c);const s=this.createTowerLayout().length,u=this.slotPlants.map((g,z)=>({plant:g,index:z})).filter(g=>g.plant&&Jt(g.plant,g.index,this.rack,t,s,e)),d=8,p=4;let m=0;for(let g=0;g<d;g++){const z=.38+g*.36,P=new i.Mesh(new i.TorusGeometry(.42,.012,8,48),new i.MeshStandardMaterial({color:5398874,roughness:.48,metalness:.35}));P.rotation.x=Math.PI/2,P.position.y=z,n.add(P);for(let G=0;G<p;G++){const ne=G*Math.PI/2+(g%2?Math.PI/4:0),N=u[m]||null;this.addPod(n,ne,z,(N==null?void 0:N.plant)||null,(N==null?void 0:N.index)??t*100+m,g,G),N!=null&&N.plant&&(n.userData.plants.push(N.plant),m+=1)}}n.userData.status=jt(n.userData.plants),this.addZoneStatusStrip(n,n.userData.status);const h=this.createTextSprite(String(e.label||`ZONE ${a}`).toUpperCase(),{bg:"rgba(255,255,255,.92)",fg:"#14532d",border:"#315d3e",font:"900 30px Inter, system-ui, sans-serif"});h.position.set(0,3.63,0),h.scale.set(.68,.18,1),n.add(h),this.farmGroup.add(n),this.interactiveRoots.push(n)},addZoneFootprint(e,t,a){var m,h;const n=String.fromCharCode(65+a),o=new i.MeshStandardMaterial({color:15989492,roughness:.72,metalness:.02}),r=new i.MeshStandardMaterial({color:2062914,roughness:.48,metalness:.18}),l=new i.MeshStandardMaterial({color:12044475,roughness:.82,metalness:.02,transparent:!0,opacity:.55}),c=new i.Mesh(new i.BoxGeometry(1.92,.035,2.04),o);c.position.y=.022,c.receiveShadow=!0,e.add(c);const s=new i.Mesh(new i.BoxGeometry(2.08,.004,2.2),l);s.position.y=.002,s.receiveShadow=!0,e.add(s),[{x:0,z:1.04,sx:1.92,sz:.035},{x:0,z:-1.04,sx:1.92,sz:.035},{x:.96,z:0,sx:.035,sz:2.04},{x:-.96,z:0,sx:.035,sz:2.04}].forEach(g=>{const z=new i.Mesh(new i.BoxGeometry(g.sx,.035,g.sz),r);z.position.set(g.x,.06,g.z),z.castShadow=!0,e.add(z)});const d=this.createTextSprite(`ZONE ${n}`,{bg:"rgba(20,83,45,.92)",fg:"#f7fee7",font:"900 24px Inter, system-ui, sans-serif"});d.position.set(-.62,.14,.98),d.scale.set(.26,.09,1),e.add(d);const p=(h=String(t.crop||((m=e.userData)==null?void 0:m.crop)||"").split(",")[0])==null?void 0:h.trim();if(p){const g=this.createTextSprite(p.toUpperCase().slice(0,18),{bg:"rgba(255,255,255,.9)",fg:"#166534",font:"900 22px Inter, system-ui, sans-serif"});g.position.set(.38,.14,.98),g.scale.set(.34,.085,1),e.add(g)}},addZoneStatusStrip(e,t){const a=be(t||"healthy"),n=new i.MeshStandardMaterial({color:a,emissive:a,emissiveIntensity:t==="empty"?.08:.34,roughness:.34,metalness:.1}),o=new i.Mesh(new i.BoxGeometry(1.62,.028,.055),n);o.position.set(0,.105,-1.05),o.castShadow=!0,e.add(o)},addPod(e,t,a,n,o,r,l){const s=Math.cos(t)*.48,u=Math.sin(t)*.48,d=(n==null?void 0:n.status)||"empty",p=be(d),m={index:o,tier:e.userData.zoneIndex+1,slot:r*4+l+1,plant:n,tower:e},h=new i.MeshStandardMaterial({color:n?16317180:2437676,roughness:.52,metalness:n?.08:.18}),g=new i.Mesh(new i.CylinderGeometry(.155,.12,.11,20),h);g.position.set(s,a,u),g.rotation.z=Math.PI/2,g.rotation.y=-t,g.castShadow=!0,g.userData.slot=m,g.userData.root=e,e.add(g);const z=new i.Mesh(new i.SphereGeometry(.045,12,8),new i.MeshStandardMaterial({color:p,emissive:p,emissiveIntensity:n?.38:.06}));z.position.set(s*1.1,a+.085,u*1.1),z.userData.slot=m,z.userData.root=e,e.add(z),n&&this.addPlantCluster(e,s*1.1,a+.12,u*1.1,n)},addDigitalTwinDevices(e){[{key:"co2",label:"CO2 Sensor",value:`${Number(this.sensorSnapshot.co2Ppm||800)} ppm`,type:"sensor",kind:"co2",x:-7.25,y:2.35,z:-5.95,color:3718648},{key:"reservoir",label:"Water Reservoir",value:`${Number(this.sensorSnapshot.waterDistanceCm||0)} cm`,type:"sensor",kind:"reservoir",x:-6.8,y:.55,z:5.35,color:959977},{key:"gas",label:"MQ-2 Gas Sensor",value:`${Number(this.sensorSnapshot.gasRaw||0)} raw`,type:"sensor",kind:"gas",x:-5.25,y:.72,z:5.55,color:be(Number(this.sensorSnapshot.gasRaw||0)>2500?"danger":"healthy")},{key:"power",label:"Power Meter",value:`${Number(this.sensorSnapshot.energyKwh||5.1).toFixed(1)} kWh`,type:"sensor",kind:"power",x:.9,y:1.45,z:5.42,color:16096779},{key:"main_fan",label:"Main Ventilation Fan",value:Number(this.sensorSnapshot.temperature||25)>30?"active":"standby",type:"output",kind:"fan",x:7.55,y:2.85,z:-5.9,color:6583435},{key:"emergency_buzzer",label:"Emergency Buzzer",value:Number(this.sensorSnapshot.gasRaw||0)>2500?"alert":"ready",type:"output",kind:"buzzer",x:1.72,y:1.34,z:5.52,color:Number(this.sensorSnapshot.gasRaw||0)>2500?15680580:8702998}].forEach(n=>this.addDeviceMarker(n));const a=[{key:"dht11",label:"DHT11 Temp/Humid",type:"sensor",kind:"dht",color:2278750,dx:-.66,y:1.72,dz:-.32},{key:"soil",label:"Soil Moisture",type:"sensor",kind:"soil",color:9132587,dx:.36,y:.29,dz:.53},{key:"ldr",label:"LDR Light",type:"sensor",kind:"ldr",color:16436245,dx:.32,y:3.38,dz:-.42},{key:"ph",label:"pH Sensor",type:"sensor",kind:"probe",color:11032055,dx:-.42,y:.72,dz:.66},{key:"ec",label:"EC Sensor",type:"sensor",kind:"probe",color:1357990,dx:-.18,y:.68,dz:.74},{key:"flow",label:"YF-S201 Flow",type:"sensor",kind:"flow",color:3718648,dx:.58,y:.58,dz:.42},{key:"pump",label:"Water Pump",type:"output",kind:"pump",color:959977,dx:.82,y:.22,dz:.78},{key:"zone_fan",label:"Zone Fan",type:"output",kind:"fan",color:6583435,dx:-.9,y:2.18,dz:.12},{key:"active_buzzer",label:"Active Buzzer",type:"output",kind:"buzzer",color:16347926,dx:.78,y:1.78,dz:-.58},{key:"camera",label:"Camera",type:"sensor",kind:"camera",color:1120295,dx:-.72,y:3.08,dz:.68}];e.forEach((n,o)=>{var c,s;const r=n.zoneId||((c=n.userData)==null?void 0:c.id)||`zone_${String.fromCharCode(65+o)}`,l=n.label||((s=n.userData)==null?void 0:s.label)||`Zone ${String.fromCharCode(65+o)}`;a.forEach(u=>{this.addDeviceMarker({...u,scope:"zone",zoneId:r,zoneLabel:l,value:Qt(u.key,this.sensorSnapshot),x:n.x+u.dx,y:u.y,z:n.z+u.dz,compact:!0})})})},addDeviceMarker(e){const t=new i.Group;if(t.position.set(e.x,e.y,e.z),t.userData={isDevice:!0,label:e.label,key:e.key,type:e.type,scope:e.scope||"farm",zoneId:e.zoneId||null,zoneLabel:e.zoneLabel||null,value:e.value||"--",status:qt(e)},this.addDeviceShape(t,e),t.traverse(n=>{(n.isMesh||n.isSprite)&&(n.userData.root=t)}),!e.compact||["camera","pump","zone_fan"].includes(e.key)){const n=e.compact?Ut(e.key):e.label.replace(/\s+/g,`
`),o=this.createTextSprite(n,{bg:"rgba(255,255,255,.92)",fg:"#0f172a",font:"900 24px Inter, system-ui, sans-serif"});o.position.set(0,e.compact?.17:.24,0),o.scale.set(e.compact?.2:.34,e.compact?.08:.13,1),t.add(o)}else{const n=new i.Mesh(new i.TorusGeometry(.11,.006,8,22),new i.MeshStandardMaterial({color:e.color,emissive:e.color,emissiveIntensity:.18,roughness:.3,metalness:.2}));n.rotation.x=Math.PI/2,n.position.y=.02,t.add(n)}this.scene.add(t),this.interactiveRoots.push(t)},addDeviceShape(e,t){const a=new i.MeshStandardMaterial({color:t.color,emissive:t.color,emissiveIntensity:t.type==="output"?.24:.1,roughness:.42,metalness:.16}),n=new i.MeshStandardMaterial({color:1120295,roughness:.48,metalness:.36}),o=new i.MeshStandardMaterial({color:16317180,roughness:.52,metalness:.04}),r=new i.MeshStandardMaterial({color:9741240,roughness:.28,metalness:.72}),l=new i.MeshStandardMaterial({color:132631,roughness:.62,metalness:.08}),c=new i.MeshStandardMaterial({color:6809849,emissive:561586,emissiveIntensity:.18,roughness:.22,metalness:.04,transparent:!0,opacity:.74}),s=d=>(d.castShadow=!0,e.add(d),d),u=(d,p,m,h=t.color)=>{const g=s(new i.Mesh(new i.SphereGeometry(t.compact?.012:.018,10,8),new i.MeshStandardMaterial({color:h,emissive:h,emissiveIntensity:.7,roughness:.24})));return g.position.set(d,p,m),g};if(t.kind==="fan"){const d=t.scope==="zone"?.13:.24;s(new i.Mesh(new i.TorusGeometry(d,.014,10,42),n)),s(new i.Mesh(new i.TorusGeometry(d*.62,.006,8,34),r));const p=s(new i.Mesh(new i.CylinderGeometry(d*.19,d*.19,.035,18),l));p.rotation.x=Math.PI/2;for(let m=0;m<4;m++){const h=s(new i.Mesh(new i.BoxGeometry(d*1.46,d*.17,.012),a));h.position.x=d*.22,h.rotation.z=m*Math.PI/4,h.userData.isFanBlade=!0}for(let m=0;m<4;m++){const h=s(new i.Mesh(new i.BoxGeometry(d*1.92,.006,.01),r));h.rotation.z=m*Math.PI/4}return}if(t.kind==="buzzer"){const d=s(new i.Mesh(new i.CylinderGeometry(.11,.12,.035,22),l));d.position.y=-.025;const p=s(new i.Mesh(new i.SphereGeometry(.095,22,10),a));p.scale.y=.58,p.position.y=.045;const m=s(new i.Mesh(new i.TorusGeometry(.092,.006,8,28),r));m.rotation.x=Math.PI/2,m.position.y=.028;return}if(t.kind==="camera"){const d=s(new i.Mesh(new i.BoxGeometry(.2,.12,.13),l));d.rotation.y=-.35;const p=s(new i.Mesh(new i.BoxGeometry(.14,.075,.012),n));p.position.set(.045,.002,.071),p.rotation.y=-.35;const m=s(new i.Mesh(new i.CylinderGeometry(.038,.038,.048,18),r));m.rotation.x=Math.PI/2,m.position.set(.045,0,.075);const h=s(new i.Mesh(new i.CylinderGeometry(.024,.024,.052,18),c));h.rotation.x=Math.PI/2,h.position.set(.045,0,.104);const g=s(new i.Mesh(new i.CylinderGeometry(.012,.012,.24,8),r));g.position.y=-.15,u(-.045,-.036,.081,2278750);return}if(t.kind==="soil"){const d=s(new i.Mesh(new i.BoxGeometry(.13,.06,.07),o));d.position.y=.025,s(new i.Mesh(new i.BoxGeometry(.052,.024,.012),l)).position.set(0,.035,.041),[-.035,.035].forEach(m=>{s(new i.Mesh(new i.CylinderGeometry(.005,.006,.24,8),r)).position.set(m,-.12,0)}),u(.048,.04,.042,2278750);return}if(t.kind==="probe"){const d=s(new i.Mesh(new i.CylinderGeometry(.034,.038,.18,14),a));d.rotation.z=.35,d.position.y=.035;const p=s(new i.Mesh(new i.CylinderGeometry(.04,.04,.025,14),l));p.rotation.z=.35,p.position.y=-.055;const m=s(new i.Mesh(new i.CylinderGeometry(.007,.01,.28,10),r));m.position.y=-.22,m.rotation.z=.35;const h=s(new i.Mesh(new i.TorusGeometry(.085,.004,6,24),l));h.rotation.set(Math.PI/2,.35,0),h.position.set(-.035,.15,0);return}if(t.kind==="flow"){const d=s(new i.Mesh(new i.CylinderGeometry(.024,.024,.42,14),r));d.rotation.z=Math.PI/2;const p=s(new i.Mesh(new i.CylinderGeometry(.082,.082,.05,24),o));p.rotation.x=Math.PI/2;const m=s(new i.Mesh(new i.BoxGeometry(.105,.01,.014),a));m.userData.isFanBlade=!0,u(.055,.055,.03,440020);return}if(t.kind==="pump"){const d=s(new i.Mesh(new i.CylinderGeometry(.075,.075,.18,20),a));d.rotation.z=Math.PI/2;const p=s(new i.Mesh(new i.CylinderGeometry(.062,.062,.06,18),r));p.rotation.z=Math.PI/2,p.position.x=.105;const m=s(new i.Mesh(new i.CylinderGeometry(.019,.019,.2,10),r));m.rotation.z=Math.PI/2,m.position.x=.19;const h=s(new i.Mesh(new i.CylinderGeometry(.018,.018,.15,10),l));h.rotation.x=Math.PI/2,h.position.set(-.03,-.078,0);const g=s(new i.Mesh(new i.BoxGeometry(.22,.024,.08),l));g.position.y=-.086;return}if(t.kind==="reservoir"){const d=s(new i.Mesh(new i.CylinderGeometry(.18,.18,.42,28),a));d.position.y=.12;const p=s(new i.Mesh(new i.CylinderGeometry(.19,.18,.045,28),l));p.position.y=.35,s(new i.Mesh(new i.BoxGeometry(.022,.28,.012),c)).position.set(.182,.12,.02);const h=s(new i.Mesh(new i.BoxGeometry(.18,.055,.12),n));h.position.y=.38,u(.064,.392,.064,2278750);return}if(t.kind==="power"){s(new i.Mesh(new i.BoxGeometry(.24,.18,.045),n));const d=s(new i.Mesh(new i.BoxGeometry(.16,.09,.012),a));d.position.z=.03,[-.058,0,.058].forEach((p,m)=>{u(p,-.064,.034,m===0?2278750:440020)});return}if(t.kind==="gas"||t.kind==="dht"||t.kind==="co2"){s(new i.Mesh(new i.BoxGeometry(.17,.135,.075),t.kind==="dht"?o:a));for(let d=0;d<3;d++)s(new i.Mesh(new i.BoxGeometry(.1,.007,.011),n)).position.set(-.008,-.038+d*.032,.045);if(t.kind==="co2"||t.kind==="gas"){const d=s(new i.Mesh(new i.CylinderGeometry(.036,.036,.015,18),l));d.rotation.x=Math.PI/2,d.position.set(.055,.038,.046)}u(-.062,.044,.047,t.kind==="gas"?16096779:2278750);return}if(t.kind==="ldr"){const d=s(new i.Mesh(new i.BoxGeometry(.13,.055,.08),o));d.position.y=-.01;const p=s(new i.Mesh(new i.CylinderGeometry(.052,.052,.02,24),a));p.rotation.x=Math.PI/2,p.position.z=.045;const m=s(new i.Mesh(new i.SphereGeometry(.038,14,8),c));m.scale.y=.42,m.position.set(0,0,.058);return}s(new i.Mesh(t.compact?new i.SphereGeometry(.07,12,8):new i.BoxGeometry(.22,.18,.14),a))},addPlantCluster(e,t,a,n,o){const r=Kt(o),l=new i.MeshStandardMaterial({color:3100976,roughness:.7}),c=new i.MeshStandardMaterial({color:r.color,roughness:.72,side:i.DoubleSide}),s=new i.MeshStandardMaterial({color:r.alt,roughness:.72,side:i.DoubleSide}),u=new i.Mesh(new i.CylinderGeometry(.008,.01,.15,6),l);u.position.set(t,a+.055,n),e.add(u);for(let d=0;d<7;d++){const p=Math.PI*2/7*d,m=r.spread+Math.random()*.025,h=new i.Mesh(new i.SphereGeometry(r.leaf,8,5),d%2?c:s);h.scale.set(1.4,.36,.82),h.position.set(t+Math.cos(p)*m,a+.12+d%3*.012,n+Math.sin(p)*m),h.rotation.set(-.45+Math.random()*.18,p,.18),h.castShadow=!0,e.add(h)}if(r.fruit)for(let d=0;d<2;d++){const p=Math.PI*d+.55,m=new i.Mesh(new i.SphereGeometry(.032,10,8),new i.MeshStandardMaterial({color:r.fruit,roughness:.55}));m.position.set(t+Math.cos(p)*.07,a+.105,n+Math.sin(p)*.07),e.add(m)}if(r.vine){const d=new i.Mesh(new i.CylinderGeometry(.006,.004,.34,5),new i.MeshStandardMaterial({color:r.color,roughness:.72}));d.position.set(t+.06,a-.02,n+.05),d.rotation.z=.25,e.add(d)}},addIrrigationPipes(e){const t=new i.MeshStandardMaterial({color:5605546,roughness:.28,metalness:.6}),a=new i.MeshStandardMaterial({color:9358054,roughness:.25,metalness:.55});[...new Set(e.map(o=>o.z))].forEach(o=>{const r=e.filter(u=>u.z===o),l=Math.min(...r.map(u=>u.x))-.8,c=Math.max(...r.map(u=>u.x))+.8,s=new i.Mesh(new i.CylinderGeometry(.035,.035,c-l,10),t);s.rotation.z=Math.PI/2,s.position.set((l+c)/2,3.35,o+.25),this.scene.add(s)}),e.forEach(o=>{const r=new i.Mesh(new i.CylinderGeometry(.02,.02,2.75,8),t);r.position.set(o.x+.28,1.9,o.z+.25),this.scene.add(r);const l=new i.Mesh(new i.SphereGeometry(.055,10,8),a);l.position.set(o.x+.28,3.28,o.z+.25),this.scene.add(l)})},addNutrientStation(){const e=new i.MeshStandardMaterial({color:2780750,roughness:.35,metalness:.15}),t=new i.MeshStandardMaterial({color:2054718,roughness:.4,metalness:.2});["N","P","K","pH"].forEach((n,o)=>{const r=-3+o*2,l=new i.Group;l.userData={isTank:!0,label:n,status:o===3&&Vt(this.sensorSnapshot)?"warning":"healthy"};const c=new i.Mesh(new i.CylinderGeometry(.42,.42,1.05,18),e);c.position.set(r,.58,-5.75),c.castShadow=!0,l.add(c);const s=new i.Mesh(new i.CylinderGeometry(.45,.42,.07,18),t);s.position.set(r,1.14,-5.75),l.add(s);const u=this.createTextSprite(n,{bg:"rgba(255,255,255,.92)",fg:"#0f172a",font:"900 34px Inter, system-ui, sans-serif"});u.position.set(r,.58,-5.28),u.scale.set(.22,.1,1),l.add(u),this.scene.add(l),this.interactiveRoots.push(l)})},addControlPanel(){const e=new i.MeshStandardMaterial({color:5593943,roughness:.5,metalness:.3}),t=new i.Mesh(new i.BoxGeometry(1.7,.08,.65),e);t.position.set(0,.86,5.75),t.castShadow=!0,this.scene.add(t);const a=new i.MeshStandardMaterial({color:464909,emissive:2062914,emissiveIntensity:.75,roughness:.12,metalness:.42}),n=new i.Mesh(new i.BoxGeometry(.95,.56,.04),a);n.position.set(0,1.38,5.45),n.castShadow=!0,this.scene.add(n);const o=this.createTextSprite("CONTROL",{bg:"rgba(9,18,13,.86)",fg:"#a3e635",font:"900 26px Inter, system-ui, sans-serif"});o.position.set(0,1.82,5.4),o.scale.set(.42,.13,1),this.scene.add(o)},addAIMascot(){const e=new i.Group;this.mascotHome=new i.Vector3(4.35,.58,4.7),this.mascotTarget=this.mascotHome.clone(),e.position.copy(this.mascotHome),e.userData.isMascot=!0;const t=new i.Mesh(new i.CircleGeometry(.38,32),new i.MeshBasicMaterial({color:988970,transparent:!0,opacity:.16,depthWrite:!1}));t.rotation.x=-Math.PI/2,t.position.y=-.31,e.add(t);const a=new i.MeshStandardMaterial({color:16007006,roughness:.38,metalness:.02,emissive:8330525,emissiveIntensity:.08}),n=new i.Mesh(new i.SphereGeometry(.31,42,32),a);n.scale.set(1.08,.95,1.02),n.castShadow=!0,e.add(n);const o=new i.Mesh(new i.SphereGeometry(.2,28,18),new i.MeshStandardMaterial({color:16757642,roughness:.48,metalness:0}));o.scale.set(1.1,.55,.16),o.position.set(0,-.12,.27),e.add(o);const r=new i.MeshStandardMaterial({color:1483594,roughness:.44,metalness:.02}),l=new i.MeshStandardMaterial({color:8702998,roughness:.5});[-.18,0,.18].forEach((p,m)=>{const h=new i.Mesh(new i.CylinderGeometry(.018,.024,.23,10),l);h.position.set(p*.42,.29,0),h.rotation.z=(m-1)*.36,e.add(h);const g=new i.Mesh(new i.SphereGeometry(.105,20,14),r);g.scale.set(1.7,.42,.78),g.position.set(p,.45+Math.abs(m-1)*.02,m===1?.01:.035),g.rotation.z=(m-1)*.5,g.rotation.x=.22,g.castShadow=!0,e.add(g)});const c=new i.MeshStandardMaterial({color:2625555,roughness:.28});[-.1,.1].forEach(p=>{const m=new i.Mesh(new i.SphereGeometry(.034,16,12),c);m.position.set(p,.05,.295),e.add(m)});const s=new i.MeshStandardMaterial({color:16747173,roughness:.45,transparent:!0,opacity:.92});[-.17,.17].forEach(p=>{const m=new i.Mesh(new i.SphereGeometry(.038,16,10),s);m.scale.set(1.3,.72,.22),m.position.set(p,-.03,.302),e.add(m)});const u=[new i.Vector3(-.055,-.01,.318),new i.Vector3(-.018,-.035,.322),new i.Vector3(.018,-.035,.322),new i.Vector3(.055,-.01,.318)],d=new i.Line(new i.BufferGeometry().setFromPoints(u),new i.LineBasicMaterial({color:2822164,linewidth:2}));e.add(d),this.mascotGroup=e,this.scene.add(e)},addVentilationFans(){const e=new i.MeshStandardMaterial({color:2042167,roughness:.36,metalness:.55});[-7.3,7.3].forEach(t=>{const a=new i.Group;a.position.set(t,2.8,-5.9),a.userData.isFan=!0;const n=new i.Mesh(new i.TorusGeometry(.34,.025,8,32),e);a.add(n);for(let o=0;o<4;o++){const r=new i.Mesh(new i.BoxGeometry(.48,.045,.018),e);r.rotation.z=o*Math.PI/4,r.userData.isFanBlade=!0,a.add(r)}this.scene.add(a)})},addWaterDrips(e){const t=new i.MeshStandardMaterial({color:3718648,emissive:3718648,emissiveIntensity:.5,transparent:!0,opacity:.85});e.forEach((a,n)=>{if(n%2)return;const o=new i.Mesh(new i.SphereGeometry(.025,8,6),t.clone());o.position.set(a.x+.25,2.9,a.z+.28),o.userData.isDrip=!0,o.userData.baseY=o.position.y,this.scene.add(o)})},addParticles(){const t=new Float32Array(1080),a=new Float32Array(360*3);for(let r=0;r<360;r++)t[r*3]=(Math.random()-.5)*15,t[r*3+1]=Math.random()*4.4+.7,t[r*3+2]=(Math.random()-.5)*11,a[r*3]=(Math.random()-.5)*.002,a[r*3+1]=(Math.random()-.5)*.001,a[r*3+2]=(Math.random()-.5)*.002;const n=new i.BufferGeometry;n.setAttribute("position",new i.BufferAttribute(t,3));const o=new i.PointsMaterial({color:16777215,size:.028,transparent:!0,opacity:.28,depthWrite:!1,blending:i.AdditiveBlending});this.particles=new i.Points(n,o),this.particles.userData.velocities=a,this.scene.add(this.particles)},createOverlays(){var a;const e=this.slotPlants.filter(Boolean).length;this.detailPanel=document.createElement("div"),this.detailPanel.className="cf-overlay cf-info-panel",this.detailPanel.innerHTML=He({title:((a=this.farm)==null?void 0:a.name)||T.farmName||"Commercial Farm",subtitle:`${this.rack.label} · ${e}/${this.rack.total} planted`,status:ye(this.slotPlants,this.sensorSnapshot),mode:"Facility overview"}),this.parent.appendChild(this.detailPanel),this.tooltip=document.createElement("div"),this.tooltip.className="cf-tooltip",this.tooltip.innerHTML='<span class="cf-tooltip-dot"></span><div><strong>Hover a tower</strong><small>Click to inspect rack details</small></div>',this.parent.appendChild(this.tooltip),this.mascotBubble=document.createElement("div"),this.mascotBubble.className="cf-overlay cf-mascot-bubble",this.mascotBubble.addEventListener("click",n=>{n.target.closest("[data-mascot-ask]")&&(n.preventDefault(),n.stopPropagation(),window.dispatchEvent(new CustomEvent("seeddown:mascotAsk",{detail:this.getSelectedContext()})))}),this.parent.appendChild(this.mascotBubble),this.updateMascotBubble();const t=document.createElement("div");t.className="cf-overlay cf-legend",t.innerHTML=`
            <span><i class="ok"></i>Healthy</span>
            <span><i class="warn"></i>Warning</span>
            <span><i class="danger"></i>Critical</span>
            <span class="cf-legend-help">Drag rotate · Wheel / +/- zoom · Double click fullscreen</span>
        `,this.parent.appendChild(t),this.fullscreenButton=document.createElement("button"),this.fullscreenButton.type="button",this.fullscreenButton.className="cf-expand-btn",this.fullscreenButton.textContent="EXPAND",this.fullscreenButton.addEventListener("click",n=>{n.stopPropagation(),this.toggleFullscreen()}),this.parent.appendChild(this.fullscreenButton),this.zoomControls=document.createElement("div"),this.zoomControls.className="cf-zoom-controls",this.zoomControls.innerHTML=`
            <button type="button" data-zoom="in" aria-label="Zoom in">+</button>
            <button type="button" data-zoom="out" aria-label="Zoom out">-</button>
            <button type="button" data-zoom="reset" aria-label="Reset view">RESET</button>
        `,this.zoomControls.addEventListener("click",n=>{const o=n.target.closest("button[data-zoom]");o&&(n.preventDefault(),n.stopPropagation(),o.dataset.zoom==="in"&&this.zoomCamera(.82),o.dataset.zoom==="out"&&this.zoomCamera(1.22),o.dataset.zoom==="reset"&&this.resetCamera())}),this.parent.appendChild(this.zoomControls)},bindEvents(){this.resizeHandler=()=>this.resize(),window.addEventListener("resize",this.resizeHandler),this.fullscreenHandler=()=>{this.syncExpandButton(),setTimeout(()=>this.resize(),80)},document.addEventListener("fullscreenchange",this.fullscreenHandler),this.canvas.addEventListener("pointermove",this.onPointerMove),this.canvas.addEventListener("click",this.onClick),this.canvas.addEventListener("dblclick",this.onDoubleClick),this.canvas.addEventListener("wheel",this.onWheel,{passive:!1})},onPointerMove:null,onClick:null,onDoubleClick:null,onWheel:null,installHandlers(){this.onPointerMove=e=>this.handlePointerMove(e),this.onClick=e=>this.handleClick(e),this.onDoubleClick=()=>this.toggleFullscreen(),this.onWheel=e=>this.handleWheel(e)},handlePointerMove(e){const t=this.pickRoot(e);t!==this.hoverRoot&&(this.hoverRoot&&this.hoverRoot!==this.selectedRoot&&this.setHighlight(this.hoverRoot,!1),this.hoverRoot=t,this.hoverRoot&&this.hoverRoot!==this.selectedRoot&&this.setHighlight(this.hoverRoot,!0)),this.canvas.style.cursor=t?"pointer":"grab",this.updateTooltip(t)},handleClick(e){const t=this.pickRoot(e);if(!t){this.selectedRoot&&this.setHighlight(this.selectedRoot,!1),this.selectedRoot=null,this.showOverview(),this.moveMascotToRoot(null);return}this.selectedRoot&&this.selectedRoot!==t&&this.setHighlight(this.selectedRoot,!1),this.selectedRoot=t,this.setHighlight(t,!0,!0),this.showRootDetail(t),this.moveMascotToRoot(t)},handleWheel(e){!this.camera||!this.controls||(e.preventDefault(),e.stopPropagation(),this.zoomCamera(e.deltaY>0?1.12:.88))},zoomCamera(e){var c,s;if(!this.camera||!this.controls)return;const t=this.controls.target,a=this.camera.position.clone().sub(t),n=a.length()||1,o=(c=this.parent)!=null&&c.classList.contains("cf-expanded")?2.4:2.8,r=(s=this.parent)!=null&&s.classList.contains("cf-expanded")?24:18,l=i.MathUtils.clamp(n*e,o,r);a.setLength(l),this.camera.position.copy(t).add(a),this.controls.update()},resetCamera(){var e;this.setCameraFrame((e=this.parent)==null?void 0:e.classList.contains("cf-expanded"))},setCameraFrame(e=!1){!this.camera||!this.controls||(e?(this.camera.fov=38,this.camera.position.set(.35,18.5,.35),this.controls.target.set(0,0,0),this.controls.minPolarAngle=Math.PI*.015,this.controls.maxPolarAngle=Math.PI*.18):(this.camera.fov=58,this.camera.position.set(5.5,4.6,8.5),this.controls.target.set(0,1.55,0),this.controls.minPolarAngle=0,this.controls.maxPolarAngle=Math.PI*.48),this.camera.updateProjectionMatrix(),this.controls.update())},pickRoot(e){var r,l;const t=this.canvas.getBoundingClientRect();this.pointer.x=(e.clientX-t.left)/t.width*2-1,this.pointer.y=-((e.clientY-t.top)/t.height)*2+1,this.raycaster.setFromCamera(this.pointer,this.camera);const a=[];this.interactiveRoots.forEach(c=>c.traverse(s=>{s.isMesh&&a.push(s)}));const n=(r=this.raycaster.intersectObjects(a,!1)[0])==null?void 0:r.object;if(!n)return null;let o=n;for(;o;){if(this.interactiveRoots.includes(o))return o;if((l=o.userData)!=null&&l.root&&this.interactiveRoots.includes(o.userData.root))return o.userData.root;o=o.parent}return null},setHighlight(e,t,a=!1){const n=a?new i.Color(3718648):new i.Color(10741301),o=a?.65:.32;e.traverse(r=>{var l;!r.isMesh||!((l=r.material)!=null&&l.emissive)||(r.userData.originalEmissive||(r.userData.originalEmissive=r.material.emissive.clone(),r.userData.originalIntensity=r.material.emissiveIntensity||0),t?(r.material.emissive.copy(n),r.material.emissiveIntensity=o):(r.material.emissive.copy(r.userData.originalEmissive),r.material.emissiveIntensity=r.userData.originalIntensity))})},updateTooltip(e){if(!this.tooltip)return;if(!e){this.tooltip.innerHTML='<span class="cf-tooltip-dot"></span><div><strong>Hover a tower</strong><small>Click to inspect rack details</small></div>';return}const t=e.userData||{},a=Array.isArray(t.plants)?t.plants.length:0;this.tooltip.innerHTML=`
            <span class="cf-tooltip-dot ${t.status||"healthy"}"></span>
            <div><strong>${D(t.label||"Station")}</strong><small>${t.isDevice?`${t.scope||"farm"} ${t.type}`:a?`${a} active plants`:t.isTank?"Nutrient station":"Empty zone"}</small></div>
        `},showOverview(){var t;const e=this.slotPlants.filter(Boolean).length;this.detailPanel.innerHTML=He({title:((t=this.farm)==null?void 0:t.name)||T.farmName||"Commercial Farm",subtitle:`${this.rack.label} · ${e}/${this.rack.total} planted`,status:ye(this.slotPlants,this.sensorSnapshot),mode:"Facility overview"}),this.mascotSelectedContext=null,this.updateMascotBubble()},showRootDetail(e){const t=e.userData||{};if(t.isTank){this.detailPanel.innerHTML=ta(t,this.sensorSnapshot);return}if(t.isDevice){this.detailPanel.innerHTML=aa(t);return}const a=Array.isArray(t.plants)?t.plants:[];this.detailPanel.innerHTML=ea(t,a,this.sensorSnapshot)},moveMascotToRoot(e){if(!this.mascotGroup||!this.mascotTarget)return;if(!e){this.mascotTarget.copy(this.mascotHome||new i.Vector3(4.35,.58,4.7)),this.mascotSelectedContext=null,this.updateMascotBubble();return}const t=new i.Box3().setFromObject(e),a=t.getCenter(new i.Vector3),n=t.getSize(new i.Vector3),o=a.x>=0?1:-1,r=a.z>=0?1:-1;this.mascotTarget.set(i.MathUtils.clamp(a.x+o*Math.max(.7,n.x*.36),-7.2,7.2),i.MathUtils.clamp(a.y+Math.max(.55,n.y*.18),.58,3.2),i.MathUtils.clamp(a.z+r*Math.max(.5,n.z*.26),-5.9,5.9)),this.mascotSelectedContext=this.contextFromRoot(e),this.updateMascotBubble()},contextFromRoot(e){const t=(e==null?void 0:e.userData)||{},a={...this.sensorSnapshot||{}};return t.isDevice?{objectType:t.type==="output"?"output":"sensor",label:t.label||"Device",key:t.key||"",scope:t.scope||"farm",zoneId:t.zoneId||"",zoneLabel:t.zoneLabel||"",status:t.status||"healthy",value:t.value||"",purpose:Xe(t.key),latestReading:a,prompt:`Ask about ${t.zoneLabel||t.scope||"farm"} ${t.label||"device"}`}:t.isTank?{objectType:"tank",label:`${t.label||"Nutrient"} tank`,status:t.status||"healthy",latestReading:a,prompt:`Ask about ${t.label||"nutrient"} tank`}:t.isTower?{objectType:"zone",label:t.label||"Zone",zoneId:t.id||"",crop:t.crop||"",status:t.status||"empty",plantCount:Array.isArray(t.plants)?t.plants.length:0,latestReading:a,prompt:`Ask about ${t.label||"this zone"}`}:null},getSelectedContext(){var e;return this.mascotSelectedContext||this.contextFromRoot(this.selectedRoot)||{objectType:"facility",label:((e=this.farm)==null?void 0:e.name)||T.farmName||"Commercial Farm",status:ye(this.slotPlants,this.sensorSnapshot),latestReading:{...this.sensorSnapshot||{}},prompt:"Ask about the full commercial farm"}},updateMascotBubble(){if(!this.mascotBubble)return;const e=this.mascotSelectedContext,t=String((e==null?void 0:e.status)||"").toLowerCase(),a=t.includes("warning")||t.includes("danger")||t.includes("critical"),n=(e==null?void 0:e.prompt)||"Ask SeedDown AI",o=e?a?`${e.label} needs attention. Ask me to explain the live reading.`:`I can explain ${e.label} using the current farm data.`:"Click a zone, sensor, tank, or output to ask about that exact object.";this.mascotBubble.innerHTML=`
            <div class="cf-mascot-kicker">Radish AI</div>
            <strong>${D(n)}</strong>
            <span>${D(o)}</span>
            <button type="button" data-mascot-ask>Ask now</button>
        `},async toggleFullscreen(){if(!this.parent)return;!this.parent.classList.contains("cf-expanded")?this.enterExpandedView():this.exitExpandedView()},enterExpandedView(){!this.parent||this.parent.classList.contains("cf-expanded")||(this.originalParent=this.parent.parentNode,this.originalNextSibling=this.parent.nextSibling,document.body.appendChild(this.parent),this.parent.classList.add("cf-expanded"),document.documentElement.classList.add("cf-expanded-lock"),document.body.classList.add("cf-expanded-lock"),this.syncExpandButton(),this.setCameraFrame(!0),requestAnimationFrame(()=>this.resize()),setTimeout(()=>this.resize(),120))},exitExpandedView(){this.parent&&(this.parent.classList.remove("cf-expanded"),document.documentElement.classList.remove("cf-expanded-lock"),document.body.classList.remove("cf-expanded-lock"),this.restoreHostPlacement(),this.syncExpandButton(),this.setCameraFrame(!1),requestAnimationFrame(()=>this.resize()),setTimeout(()=>this.resize(),120))},restoreHostPlacement(){!this.parent||!this.originalParent||(this.originalNextSibling&&this.originalNextSibling.parentNode===this.originalParent?this.originalParent.insertBefore(this.parent,this.originalNextSibling):this.originalParent.appendChild(this.parent),this.originalParent=null,this.originalNextSibling=null)},syncExpandButton(){!this.fullscreenButton||!this.parent||(this.fullscreenButton.textContent=this.parent.classList.contains("cf-expanded")?"CLOSE":"EXPAND")},resize(){var l,c;if(!this.canvas||!this.renderer||!this.camera)return;const e=(l=this.parent)==null?void 0:l.classList.contains("cf-expanded"),t=(c=this.parent)==null?void 0:c.classList.contains("commercial-command-screen"),a=e||t;t&&(Ze(this.parent,{position:"fixed",inset:"0",width:"100vw",height:"100vh",minHeight:"100vh",overflow:"hidden",borderRadius:"0"}),Ze(this.canvas,{position:"fixed",inset:"0",width:"100vw",height:"100vh",minHeight:"100vh",display:"block",borderRadius:"0"}));const n=this.canvas.getBoundingClientRect(),o=a?window.innerWidth||document.documentElement.clientWidth||n.width||1280:Math.max(320,n.width||this.parent.clientWidth||640),r=a?window.innerHeight||document.documentElement.clientHeight||n.height||720:Math.max(300,n.height||420);this.renderer.setSize(o,r,!1),this.camera.aspect=o/r,this.camera.updateProjectionMatrix()},animate(){var t,a;const e=Math.min(.04,((a=(t=this.clock)==null?void 0:t.getDelta)==null?void 0:a.call(t))||.016);this.frame+=1,this.controls&&this.controls.update(),this.updateParticles(),this.updateMascot(),this.scene.traverse(n=>{var o,r;(o=n.userData)!=null&&o.isFanBlade&&(n.rotation.z+=4.8*e),(r=n.userData)!=null&&r.isDrip&&(n.position.y-=.55*e,n.position.y<.7&&(n.position.y=n.userData.baseY))}),this.renderer&&this.scene&&this.camera&&this.renderer.render(this.scene,this.camera),this.rafId=requestAnimationFrame(()=>this.animate())},updateMascot(){if(!this.mascotGroup||!this.mascotTarget)return;const e=Math.sin(this.frame*.045)*.055,t=this.mascotTarget.clone();t.y+=e,this.mascotGroup.position.lerp(t,.055),this.mascotGroup.rotation.y=Math.sin(this.frame*.028)*.08},updateParticles(){if(!this.particles)return;const e=this.particles.geometry.attributes.position,t=this.particles.userData.velocities;for(let a=0;a<e.count;a++)e.array[a*3]+=t[a*3],e.array[a*3+1]+=t[a*3+1],e.array[a*3+2]+=t[a*3+2],e.array[a*3]>7.5&&(e.array[a*3]=-7.5),e.array[a*3]<-7.5&&(e.array[a*3]=7.5),e.array[a*3+1]>5.4&&(e.array[a*3+1]=.7),e.array[a*3+2]>5.5&&(e.array[a*3+2]=-5.5),e.array[a*3+2]<-5.5&&(e.array[a*3+2]=5.5);e.needsUpdate=!0},createTextSprite(e,t={}){const a=document.createElement("canvas");a.width=512,a.height=128;const n=a.getContext("2d");n.clearRect(0,0,a.width,a.height),Xt(n,18,22,a.width-36,84,28),n.fillStyle=t.bg||"rgba(12,20,14,.9)",n.fill(),t.border&&(n.strokeStyle=t.border,n.lineWidth=4,n.stroke()),n.fillStyle=t.fg||"#ffffff",n.font=t.font||"900 30px Inter, system-ui, sans-serif",n.textAlign="center",n.textBaseline="middle",n.fillText(e,a.width/2,66);const o=new i.CanvasTexture(a);o.colorSpace=i.SRGBColorSpace;const r=new i.SpriteMaterial({map:o,transparent:!0,depthWrite:!1}),l=new i.Sprite(r);return l.userData.texture=o,l},destroy(){var e;this.rafId&&cancelAnimationFrame(this.rafId),this.rafId=null,this.resizeHandler&&window.removeEventListener("resize",this.resizeHandler),this.fullscreenHandler&&document.removeEventListener("fullscreenchange",this.fullscreenHandler),this.canvas&&this.onPointerMove&&this.canvas.removeEventListener("pointermove",this.onPointerMove),this.canvas&&this.onClick&&this.canvas.removeEventListener("click",this.onClick),this.canvas&&this.onDoubleClick&&this.canvas.removeEventListener("dblclick",this.onDoubleClick),this.canvas&&this.onWheel&&this.canvas.removeEventListener("wheel",this.onWheel),this.controls&&this.controls.dispose(),this.scene&&this.scene.traverse(t=>{var a;t.geometry&&t.geometry.dispose(),(a=t.userData)!=null&&a.texture&&t.userData.texture.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(n=>n.dispose()):t.material.dispose())}),this.renderer&&this.renderer.dispose(),(e=this.parent)!=null&&e.classList.contains("cf-expanded")&&this.exitExpandedView(),this.parent&&(this.parent.classList.remove("cf-expanded"),this.parent.querySelectorAll(".cf-overlay, .cf-tooltip, .cf-expand-btn, .cf-zoom-controls").forEach(t=>t.remove()),this.parent.classList.remove("commercial-farm-host")),document.documentElement.classList.remove("cf-expanded-lock"),document.body.classList.remove("cf-expanded-lock"),this.canvas=null,this.parent=null,this.renderer=null,this.scene=null,this.camera=null,this.controls=null,this.farmGroup=null,this.particles=null,this.raycaster=null,this.pointer=null,this.interactiveRoots=[],this.hoverRoot=null,this.selectedRoot=null,this.detailPanel=null,this.tooltip=null,this.fullscreenButton=null,this.zoomControls=null,this.mascotGroup=null,this.mascotTarget=null,this.mascotHome=null,this.mascotBubble=null,this.mascotSelectedContext=null,this.originalParent=null,this.originalNextSibling=null,this.resizeHandler=null,this.fullscreenHandler=null,this.onPointerMove=null,this.onClick=null,this.onDoubleClick=null,this.onWheel=null}};function Ft(){const e=At();return T.currentFarm||e.find(t=>t.id===T.currentFarmId)||e[e.length-1]||null}function At(){try{return JSON.parse(localStorage.getItem(Bt))||[]}catch{return[]}}function Rt(e){if(pe(e).length){const a=pe(e).length;return{id:"commercial-zones",label:`${a}-Zone Commercial Farm`,tiers:a,slotsPerTier:12,total:Math.max(12,a*12)}}const t=String((e==null?void 0:e.rackTypeId)||(e==null?void 0:e.rackType)||(e==null?void 0:e.rackLabel)||"").toLowerCase();return t.includes("2")?V["2-tier"]:t.includes("4")?V["4-tier"]:t.includes("5")?V["5-tier"]:t.includes("wall")||t.includes("grid")?V.wall:t.includes("frame")?V["a-frame"]:t.includes("nft")||t.includes("channel")?V["nft-channel"]:t.includes("hanging")||t.includes("column")?V.hanging:V["3-tier"]}function Gt(e,t){const a=Array.isArray(e==null?void 0:e.plants)?e.plants:[],n=pe(e),o=n.length?Math.max(t.total,n.length*12,a.length*3):t.total,r=Array(o).fill(null),l=new Set;if(a.forEach((s,u)=>{var p;if(n.length&&s.zoneId){const m=n.findIndex(z=>Ot(z,s)),h=Math.max(0,m)*12,g=Math.max(1,Number.parseInt(s.slots||s.count||1,10)||1);for(let z=0;z<g;z++){const P=Ht(r,l,h,h+12)??Ge(r,l);if(P===-1||P===null||P===void 0)return;r[P]=ce(s,P,t,e),r[P].zoneId=s.zoneId,r[P].zoneName=s.zoneName||((p=n[m])==null?void 0:p.name)||s.zoneId,l.add(P)}return}if(s.slotIndex!==void 0&&s.slotIndex!==null){const m=Number(s.slotIndex);Number.isInteger(m)&&m>=0&&m<r.length&&(r[m]=ce(s,m,t,e),l.add(m));return}const d=Math.max(1,Number.parseInt(s.slots||s.count||1,10)||1);for(let m=0;m<d;m++){const h=Ge(r,l);if(h===-1)return;r[h]=ce(s,h,t,e),l.add(h)}}),r.some(Boolean))return r;const c=Math.min(t.total,Number.parseInt((e==null?void 0:e.plantSlots)||(e==null?void 0:e.plants)||0,10)||0);for(let s=0;s<c;s++)r[s]=ce({name:(e==null?void 0:e.targetPlant)||"Plant",status:"healthy"},s,t,e);return r}function pe(e){var o;const t=Array.isArray(e==null?void 0:e.zones)?e.zones:Array.isArray((o=e==null?void 0:e.commercialStructure)==null?void 0:o.zones)?e.commercialStructure.zones:[];if(t.length)return t.map((r,l)=>({...r,zone_id:r.zone_id||r.id||`zone_${String.fromCharCode(65+l)}`,name:r.name||`Zone ${String.fromCharCode(65+l)}`})).filter(r=>r.zone_id||r.name);const a=Array.isArray(e==null?void 0:e.plants)?e.plants:[],n=new Map;return a.forEach((r,l)=>{const c=r.zoneId||r.zone_id||r.zone||r.area;if(!c)return;const s=String(c);n.has(s)||n.set(s,{zone_id:s,name:r.zoneName||`Zone ${String.fromCharCode(65+n.size)}`,crop:r.name||r.species||"Mixed crops",plants:[]});const u=n.get(s),d=r.name||r.species||`Plant ${l+1}`;u.plants.includes(d)||u.plants.push(d),u.crop=u.plants.join(", ")}),n.size?[...n.values()]:(e==null?void 0:e.accountMode)==="commercial"||(e==null?void 0:e.viewMode)==="commercial"?[{zone_id:"zone_A",name:e!=null&&e.name?`${e.name} Zone`:"Zone A",crop:(e==null?void 0:e.targetPlant)||"Commercial crops",plants:e!=null&&e.targetPlant?String(e.targetPlant).split(",").map(r=>r.trim()).filter(Boolean):["Commercial crops"]}]:[]}function Ot(e,t){const a=String(t.zoneId||t.zone_id||t.zone||"").toLowerCase();return a&&(a===String(e.zone_id||"").toLowerCase()||a===String(e.id||"").toLowerCase()||a===String(e.name||"").toLowerCase())}function Ht(e,t,a,n){const o=Math.max(0,a),r=Math.min(e.length,n);for(let l=o;l<r;l++)if(!e[l]&&!t.has(l))return l;return null}function ce(e,t,a,n){const o=e.name||(n==null?void 0:n.targetPlant)||"Plant";return{name:o,emoji:e.emoji||na(o),species:e.species||et(o),status:e.status||Zt(e.growth),growth:Number(e.growth??70),days:Number(e.days??0),slotIndex:t,tier:Math.floor(t/a.slotsPerTier)+1,position:t%a.slotsPerTier+1}}function Ge(e,t){for(let a=0;a<e.length;a++)if(!e[a]&&!t.has(a))return a;return-1}function Zt(e){const t=Number(e??80);return t<35?"danger":t<60?"warning":"healthy"}function be(e){return e==="danger"?15680580:e==="warning"?16096779:e==="empty"?6583435:8702998}function jt(e){return e.length?e.some(t=>t.status==="danger")?"danger":e.some(t=>t.status==="warning")?"warning":"healthy":"empty"}function ye(e,t){return e.some(Boolean)&&e.some(a=>(a==null?void 0:a.status)==="danger")?"Critical plant risk":Number(t.gasRaw||0)>2500||Number(t.temperature||25)>35?"Automation alert":e.some(a=>(a==null?void 0:a.status)==="warning")?"Needs review":"Operational"}function xe(){const e=T.sensors||{},t=T.latestReading||T.currentReading||{},a=(n,...o)=>{for(const r of o){const l=r&&typeof r=="object"&&"val"in r?r.val:r,c=Number(l);if(Number.isFinite(c))return c}return n};return{temperature:a(25,e.temp,e.temperature,t.temperature,t.temp),humidity:a(60,e.humid,e.humidity,t.humidity,t.humid),lightRaw:a(2e3,e.lightRaw,e.light,t.lightRaw,t.light),soilRaw:a(1800,e.soilRaw,e.soil,t.soilRaw,t.soilMoisture,t.moisture),ph:a(6.1,e.ph,t.ph),waterDistanceCm:a(10,e.water,e.waterDistanceCm,t.waterDistanceCm,t.waterLevel),gasRaw:a(1e3,e.nutrient,e.gasRaw,t.gasRaw,t.gasValue),ec:a(1.5,e.ec,t.ec),co2Ppm:a(850,e.co2,t.co2Ppm),energyKwh:a(5.1,e.energy,e.energyKwh,t.energyKwh),waterFlowLpm:a(.8,e.flow,e.waterFlowLpm,t.waterFlowLpm)}}function Wt(){const e=T.latestReadingMeta||{},t=T.latestReading||T.currentReading||{},a=e.fetchedAt||t._fetchedAt||t.createdAt||t.updatedAt||t.timestamp;let n=null;if(a instanceof Date?n=a:a&&typeof a=="object"?typeof a.toDate=="function"?n=a.toDate():a._seconds?n=new Date(a._seconds*1e3):a.seconds&&(n=new Date(a.seconds*1e3)):a&&(n=new Date(a)),!n||Number.isNaN(n.getTime()))return"--";const o=e.stale||t._stale?" cached":"";return`${n.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}${o}`}function Qt(e,t){return{dht11:`${Number(t.temperature||0).toFixed(1)}C / ${Number(t.humidity||0)}%`,soil:`${Number(t.soilRaw||1800)} raw`,ldr:`${Number(t.lightRaw||0)} raw`,ph:`${Number(t.ph||0).toFixed(1)} pH`,ec:`${Number(t.ec||1.5).toFixed(1)} EC`,flow:`${Number(t.waterFlowLpm||.8).toFixed(1)} L/min`,pump:Number(t.waterDistanceCm||0)>20?"ready":"standby",zone_fan:Number(t.temperature||25)>30?"active":"standby",active_buzzer:Number(t.gasRaw||0)>2500?"alert":"ready",camera:"scan ready"}[e]||"--"}function Ut(e){return{dht11:"DHT",soil:"SOIL",ldr:"LDR",ph:"pH",ec:"EC",flow:"FLOW",pump:"PUMP",zone_fan:"FAN",active_buzzer:"BUZZ",camera:"CAM"}[e]||String(e).slice(0,4).toUpperCase()}function qt(e){const t=String(e.value||"").toLowerCase();return t.includes("alert")||t.includes("danger")?"danger":t.includes("active")?"warning":"healthy"}function Vt(e){const t=Number(e.ph??6.1);return t<5.5||t>6.5}function Kt(e){const t=et((e==null?void 0:e.species)||(e==null?void 0:e.name)||"plant"),a=le[t];if(a)return a;const n=Object.keys(le).find(o=>t.includes(o));return le[n]||le.plant}function Yt(e,t,a,n){return Number.isNaN(e)?!1:e%n===a||Math.floor(e/Math.max(1,t.slotsPerTier))===a}function Jt(e,t,a,n,o,r={}){return e!=null&&e.zoneId&&r.zoneId?String(e.zoneId).toLowerCase()===String(r.zoneId).toLowerCase():e!=null&&e.zoneName&&r.label?String(e.zoneName).toLowerCase()===String(r.label).toLowerCase():Yt(t,a,n,o)}function Oe(e,t,a){const n=new i.BufferGeometry().setFromPoints([new i.Vector3(...e),new i.Vector3(...t)]);return new i.Line(n,a)}function Xt(e,t,a,n,o,r){e.beginPath(),e.moveTo(t+r,a),e.lineTo(t+n-r,a),e.quadraticCurveTo(t+n,a,t+n,a+r),e.lineTo(t+n,a+o-r),e.quadraticCurveTo(t+n,a+o,t+n-r,a+o),e.lineTo(t+r,a+o),e.quadraticCurveTo(t,a+o,t,a+o-r),e.lineTo(t,a+r),e.quadraticCurveTo(t,a,t+r,a),e.closePath()}function He({title:e,subtitle:t,status:a,mode:n}){return`
        <div class="cf-panel-kicker">${D(n)}</div>
        <div class="cf-panel-title">${D(e)}</div>
        <div class="cf-panel-sub">${D(t)}</div>
        <div class="cf-mini-grid">
            ${R("Status",a)}
            ${R("Light",`${Math.round(Number(xe().lightRaw||0))}`)}
            ${R("pH",`${Number(xe().ph||0).toFixed(1)}`)}
            ${R("Updated",Wt())}
        </div>
    `}function ea(e,t,a){const n=t.filter(l=>l.status==="healthy").length,o=t.filter(l=>l.status==="warning").length,r=t.filter(l=>l.status==="danger").length;return`
        <div class="cf-panel-kicker">Selected production zone</div>
        <div class="cf-panel-title">${D(e.label||"Zone")}</div>
        <div class="cf-panel-sub">${t.length||0} active plants · ${D(e.status||"empty")}</div>
        <div class="cf-mini-grid">
            ${R("Healthy",n)}
            ${R("Warning",o)}
            ${R("Critical",r)}
            ${R("Temp",`${Number(a.temperature||0).toFixed(1)}C`)}
        </div>
        <div class="cf-plant-list">
            ${t.slice(0,5).map(l=>`<span>${D(l.name)} <b>${D(l.status)}</b></span>`).join("")||"<span>No assigned crop yet</span>"}
        </div>
    `}function ta(e,t){return`
        <div class="cf-panel-kicker">Nutrient station</div>
        <div class="cf-panel-title">${D(e.label||"Tank")} Tank</div>
        <div class="cf-panel-sub">Linked to commercial automation controls</div>
        <div class="cf-mini-grid">
            ${R("pH",`${Number(t.ph||0).toFixed(1)}`)}
            ${R("Water",`${Number(t.waterDistanceCm||0)}cm`)}
            ${R("Status",D(e.status||"healthy"))}
        </div>
    `}function aa(e){const t=e.scope==="zone"?e.zoneLabel||e.zoneId||"Zone":"Farm Level",a=e.type==="output"?"Actuator / Output":"Sensor";return`
        <div class="cf-panel-kicker">Digital twin device</div>
        <div class="cf-panel-title">${D(e.label||"Device")}</div>
        <div class="cf-panel-sub">${D(t)} · ${D(a)}</div>
        <div class="cf-mini-grid">
            ${R("Value",e.value||"--")}
            ${R("Status",e.status||"healthy")}
            ${R("Type",e.type||"sensor")}
        </div>
        <div class="cf-plant-list">
            <span>Layer <b>${D(e.scope==="zone"?"ZONE":"FARM")}</b></span>
            <span>Clickable <b>YES</b></span>
            <span>Purpose <b>${D(Xe(e.key))}</b></span>
        </div>
    `}function Xe(e){return{co2:"air enrichment",reservoir:"water level",gas:"safety alert",power:"energy tracking",main_fan:"facility airflow",emergency_buzzer:"emergency alarm",dht11:"temperature humidity",soil:"root moisture",ldr:"light detection",ph:"water acidity",ec:"nutrient strength",flow:"irrigation flow",pump:"irrigation output",zone_fan:"zone airflow",active_buzzer:"zone warning",camera:"plant vision"}[e]||"monitoring"}function R(e,t){return`<div class="cf-mini-metric"><span>${D(e)}</span><strong>${D(t)}</strong></div>`}function na(e=""){const t=String(e).toLowerCase();return t.includes("lettuce")||t.includes("cabbage")||t.includes("kale")?"🥬":t.includes("tomato")?"🍅":t.includes("chili")||t.includes("pepper")?"🌶️":t.includes("strawberry")?"🍓":t.includes("cucumber")?"🥒":t.includes("carrot")?"🥕":t.includes("eggplant")?"🍆":t.includes("basil")||t.includes("mint")||t.includes("spinach")?"🌿":"🌱"}function et(e=""){return String(e||"plant").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function D(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function Ze(e,t){e&&Object.entries(t).forEach(([a,n])=>{const o=a.replace(/[A-Z]/g,r=>"-"+r.toLowerCase());e.style.setProperty(o,n,"important")})}function oa(){if(document.getElementById("commercial-farm-canvas-style"))return;const e=document.createElement("style");e.id="commercial-farm-canvas-style",e.textContent=`
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
            grid-template-columns: repeat(auto-fit, minmax(82px, 1fr));
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
        .cf-mascot-bubble {
            right: 14px;
            bottom: 74px;
            width: min(260px, calc(100% - 28px));
            padding: 12px 13px;
            border-radius: 18px;
            background: rgba(255, 255, 255, .92);
            border: 1px solid rgba(20, 184, 166, .34);
            box-shadow: 0 16px 42px rgba(15, 23, 42, .14);
            backdrop-filter: blur(14px);
            color: #134e4a;
        }
        .cf-mascot-kicker {
            color: #0f766e;
            font-size: 9px;
            font-weight: 950;
            text-transform: uppercase;
            letter-spacing: .12em;
            margin-bottom: 4px;
        }
        .cf-mascot-bubble strong {
            display: block;
            color: #0f172a;
            font-size: 13px;
            line-height: 1.18;
        }
        .cf-mascot-bubble span {
            display: block;
            margin-top: 5px;
            color: #64748b;
            font-size: 11px;
            font-weight: 750;
            line-height: 1.35;
        }
        .cf-mascot-bubble button {
            margin-top: 9px;
            border: 1px solid rgba(20, 184, 166, .38);
            border-radius: 999px;
            background: #ccfbf1;
            color: #0f766e;
            padding: 7px 10px;
            font-size: 10px;
            font-weight: 950;
            cursor: pointer;
        }
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
            .cf-mascot-bubble { left:14px; right:14px; bottom:64px; width:auto; }
            .commercial-farm-canvas { height: 390px !important; }
        }
    `,document.head.appendChild(e)}const ke="user_farms",U=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;function q(e={}){return{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`,...e}}let M=1,k=null,S="realistic",me=null,ue=!1,E={serial:"SD-BGN-STD-00456",wifiSsid:"",wifiPassword:"",accountType:"beginner_standard"},f=null,A=["beginner_safe"],x=null,b={name:"",location:"",description:"",targetPlant:"",analysisGoal:"yield",rackType:"3-tier",customRack:null},I=[],v=null,L=["maximum_yield"],C=null,j={},W=[],B=null,Me=null;const tt=[{id:"maximum_yield",label:"Maximum Yield"},{id:"profit_optimisation",label:"Profit Optimisation"},{id:"crop_safety_first",label:"Crop Safety First"},{id:"research_testing",label:"Research & Testing"},{id:"automation_first",label:"Automation First"},{id:"compliance_audit",label:"Compliance & Audit"}],ra=[{zone_id:"zone_A",name:"Zone A",recommended_type:"zone_node",crop:"Tomato / Chili / Basil",plants:["tomato","chili","basil"],confidence:.88,notes:"High-value crop area detected"},{zone_id:"zone_B",name:"Zone B",recommended_type:"zone_node",crop:"Lettuce",plants:["lettuce"],confidence:.82,notes:"Leafy green rack area detected"},{zone_id:"zone_C",name:"Zone C",recommended_type:"zone_node",crop:"Spinach",plants:["spinach"],confidence:.79,notes:"Standard greens area detected"}],ve=[{id:"small",label:"Small Farm",standard:"1 grow room or pilot rack area",zones:"2 zones",area:"up to 30 m2",use:"SME trial, school lab, restaurant greens"},{id:"medium",label:"Medium Farm",standard:"several rack rows in one site",zones:"3 zones",area:"30-120 m2",use:"urban farm operator or institution"},{id:"large",label:"Large Farm",standard:"multi-room or high-density production floor",zones:"4 zones",area:"120+ m2",use:"commercial production with separate crop zones"}],he=[{id:"2-tier",label:"2-Tier Starter Rack",icon:"II",tiers:2,slotsPerTier:3,total:6,shape:"rack",desc:"compact shelf for desk or balcony trials"},{id:"3-tier",label:"3-Tier Vertical Rack",icon:"III",tiers:3,slotsPerTier:3,total:9,shape:"rack",desc:"balanced demo rack with 9 plant slots"},{id:"4-tier",label:"4-Tier Grow Shelf",icon:"IV",tiers:4,slotsPerTier:4,total:16,shape:"rack",desc:"larger home rack for mixed greens"},{id:"5-tier",label:"5-Tier Tower Rack",icon:"V",tiers:5,slotsPerTier:4,total:20,shape:"tower",desc:"tall structure with dense stacking"},{id:"wall",label:"Wall Panel Grid",icon:"GRID",tiers:4,slotsPerTier:5,total:20,shape:"wall",desc:"flat wall-mounted grow panel"},{id:"a-frame",label:"A-Frame Pyramid",icon:"A",tiers:4,slotsPerTier:4,total:16,shape:"aframe",desc:"slanted frame for two-sided access"},{id:"nft-channel",label:"NFT Channel Rows",icon:"NFT",tiers:3,slotsPerTier:6,total:18,shape:"channel",desc:"hydroponic channel layout for leafy crops"},{id:"hanging",label:"Hanging Column Farm",icon:"COL",tiers:5,slotsPerTier:3,total:15,shape:"column",desc:"vertical column pots for herbs and vines"}],ia=[{id:"yield",label:"Yield"},{id:"health",label:"Health"},{id:"space",label:"Space fit"}],at=[{id:"healthy_growth",label:"Healthy Growth"},{id:"eco_save",label:"Eco Save"},{id:"low_maintenance",label:"Low Maintenance"},{id:"fast_harvest",label:"Fast Harvest"},{id:"cost_efficient",label:"Cost Efficient"},{id:"beginner_safe",label:"Beginner Safe"}],nt=[{id:"beginner_starter",label:"Beginner Starter",serial:"SD-BGN-STR-00123",accountType:"beginner_starter",packageLevel:"starter",deviceType:"beginner",desc:"basic home sensor kit"},{id:"beginner_standard",label:"Beginner Standard",serial:"SD-BGN-STD-00456",accountType:"beginner_standard",packageLevel:"standard",deviceType:"beginner",desc:"balanced home vertical farm kit"},{id:"beginner_pro",label:"Beginner Pro",serial:"SD-BGN-PRO-00789",accountType:"beginner_pro",packageLevel:"pro",deviceType:"beginner",desc:"advanced home kit with more automation"},{id:"commercial_farm_master_1",label:"Commercial Farm Master Node 1",serial:"SD-COM-FRM-03001",accountType:"commercial_farm_master",packageLevel:"farm_master",deviceType:"commercial",desc:"farm-level controller, one per commercial farm"},{id:"commercial_farm_master_2",label:"Commercial Farm Master Node 2",serial:"SD-COM-FRM-03002",accountType:"commercial_farm_master",packageLevel:"farm_master",deviceType:"commercial",desc:"spare farm-level controller for demo or second farm"},{id:"commercial_farm_master_3",label:"Commercial Farm Master Node 3",serial:"SD-COM-FRM-03003",accountType:"commercial_farm_master",packageLevel:"farm_master",deviceType:"commercial",desc:"spare farm-level controller for demo or second farm"},{id:"commercial_farm_zone_1",label:"Commercial Farm + Zone Combo 1",serial:"SD-COM-FZK-02001",accountType:"commercial_farm_zone",packageLevel:"farm_zone",deviceType:"commercial",desc:"combo commercial node for farm or zone assignment"},{id:"commercial_farm_zone_2",label:"Commercial Farm + Zone Combo 2",serial:"SD-COM-FZK-02002",accountType:"commercial_farm_zone",packageLevel:"farm_zone",deviceType:"commercial",desc:"combo commercial node for farm or zone assignment"},{id:"commercial_farm_zone_3",label:"Commercial Farm + Zone Combo 3",serial:"SD-COM-FZK-02003",accountType:"commercial_farm_zone",packageLevel:"farm_zone",deviceType:"commercial",desc:"combo commercial node for farm or zone assignment"},{id:"commercial_zone_1",label:"Commercial Zone Node 1",serial:"SD-COM-ZON-01001",accountType:"commercial_zone",packageLevel:"zone_node",deviceType:"commercial",desc:"zone-level sensor and actuator node"},{id:"commercial_zone_2",label:"Commercial Zone Node 2",serial:"SD-COM-ZON-01002",accountType:"commercial_zone",packageLevel:"zone_node",deviceType:"commercial",desc:"zone-level sensor and actuator node"},{id:"commercial_zone_3",label:"Commercial Zone Node 3",serial:"SD-COM-ZON-01003",accountType:"commercial_zone",packageLevel:"zone_node",deviceType:"commercial",desc:"zone-level sensor and actuator node"},{id:"commercial_zone_4",label:"Commercial Zone Node 4",serial:"SD-COM-ZON-01004",accountType:"commercial_zone",packageLevel:"zone_node",deviceType:"commercial",desc:"zone-level sensor and actuator node"},{id:"commercial_zone_5",label:"Commercial Zone Node 5",serial:"SD-COM-ZON-01005",accountType:"commercial_zone",packageLevel:"zone_node",deviceType:"commercial",desc:"zone-level sensor and actuator node"},{id:"commercial_zone_basic",label:"Legacy Commercial Zone Node",serial:"SD-COM-ZNB-01001",accountType:"commercial_zone_basic",packageLevel:"zone_basic",deviceType:"commercial",desc:"legacy zone-level node, still supported"},{id:"commercial_zone_pro",label:"Legacy Commercial Zone Node Pro",serial:"SD-COM-ZNP-02001",accountType:"commercial_zone_pro",packageLevel:"zone_pro",deviceType:"commercial",desc:"legacy expanded zone-level node, still supported"},{id:"commercial_master",label:"Legacy Commercial Farm Master",serial:"SD-COM-MST-03001",accountType:"commercial_master",packageLevel:"farm_master",deviceType:"commercial",desc:"legacy master node for multi-zone farms"}],sa={"SD-COM-FRM-03001":{deviceId:"commercial-farm-master-1",deviceToken:"sd_demo_commercial_farm_master_1"},"SD-COM-MST-03001":{deviceId:"commercial-farm-master-1",deviceToken:"sd_demo_commercial_farm_master_1"},"SD-COM-ZON-01001":{deviceId:"commercial-zone-node-1",deviceToken:"sd_demo_commercial_zone_node_1"},"SD-COM-ZON-01002":{deviceId:"commercial-zone-node-2",deviceToken:"sd_demo_commercial_zone_node_2"},"SD-COM-ZON-01003":{deviceId:"commercial-zone-node-3",deviceToken:"sd_demo_commercial_zone_node_3"}},je={starter:{label:"Starter",thresholdKeys:["tempMin","tempMax","humidityMin","humidityMax","soilDryThreshold","darkThreshold","wateringDurationSeconds","sensorIntervalSeconds"],lockedText:"Unlock with Standard / Pro"},standard:{label:"Standard",thresholdKeys:["tempMin","tempMax","humidityMin","humidityMax","soilDryThreshold","darkThreshold","phMin","phMax","gasDangerThreshold","wateringDurationSeconds","fanDurationSeconds","sensorIntervalSeconds"],lockedText:"Unlock with Pro"},pro:{label:"Pro",thresholdKeys:["tempMin","tempMax","humidityMin","humidityMax","soilDryThreshold","darkThreshold","phMin","phMax","ecMin","ecMax","co2MinPpm","gasDangerThreshold","waterLowCm","wateringDurationSeconds","fanDurationSeconds","sensorIntervalSeconds"],lockedText:""}},de={lettuce:"🥬",spinach:"🌿",basil:"🌿",tomato:"🍅",carrot:"🥕",cabbage:"🥬",eggplant:"🍆",mint:"🌿",kale:"🥬",cucumber:"🥒",pepper:"🌶️",chili:"🌶️",strawberry:"🍓",bean:"🫘",pea:"🟢",chard:"🥬",arugula:"🌿",radish:"🌱",cilantro:"🌿",parsley:"🌿"};function gn(){var a;M=1,k=null,S="realistic",ue=!1;const e=Y();E=e?{serial:"SD-COM-FRM-03001",wifiSsid:"",wifiPassword:"",accountType:"commercial_farm_master"}:{serial:"SD-BGN-STD-00456",wifiSsid:"",wifiPassword:"",accountType:"beginner_standard"},f=null,A=e?["maximum_yield"]:["beginner_safe"],x=null,b={name:"",location:"",description:"",targetPlant:"",analysisGoal:"yield",rackType:e?"medium":"3-tier",customRack:null},I=[],v=null,L=["maximum_yield"],C=null,j={},W=[],B=null,Me=e?`farm_com_${Date.now()}`:null,re(),(a=O.destroy)==null||a.call(O);const t=document.getElementById("screenContainer");t.innerHTML=`
        <div class="screen active" id="buildFarmScreen"
             style="display:flex;flex-direction:column;height:100vh;overflow:hidden;background:var(--bg);">
            <div class="topbar" style="flex-shrink:0;">
                <button id="bfBack" aria-label="Back"
                    style="background:none;border:none;font-size:22px;cursor:pointer;padding:4px 8px;color:var(--text);line-height:1;">←</button>
                <div>
                    <div style="font-weight:800;font-size:16px;">${Y()?"New Commercial Farm":"New Beginner Field"}</div>
                    <div style="font-size:11px;color:var(--muted);margin-top:1px;">${Y()?"AI zoning to device assignment and launch":"single-field QR setup, photo structure scan, and 3D preview"}</div>
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
    `,document.getElementById("bfBack").addEventListener("click",an),document.getElementById("bfCancel").addEventListener("click",Ct),document.getElementById("bfNext").addEventListener("click",en),$()}function $(){var n;if(Y()){la();return}ot();const e=document.getElementById("bfContent"),t=document.getElementById("bfCancel"),a=document.getElementById("bfNext");e.innerHTML="",re(),(n=O.destroy)==null||n.call(O),M===1&&(Na(e),t.textContent="Cancel",a.textContent=f?"Next: Field Info":"Scan QR"),M===2&&(Oa(e),t.textContent="Back",a.textContent="Next: Add Photo"),M===3&&(xt(e),t.textContent="Back",a.textContent="Next: AI Thresholds"),M===4&&(kt(e),t.textContent="Back",a.textContent=x?"Next: 3D Preview":"Generate Thresholds"),M===5&&(wt(e),t.textContent="Preview Only",a.textContent="Create Field")}function la(){ot();const e=document.getElementById("bfContent"),t=document.getElementById("bfCancel"),a=document.getElementById("bfNext");e.innerHTML="",re(),M===1&&(ca(e),t.textContent="Cancel",a.textContent="Next: Analyze Farm"),M===2&&(pa(e),t.textContent="Back",a.textContent=v?"Confirm Structure":"Analyze Zones"),M===3&&(rt(e),t.textContent="Back",a.textContent="Next: Zone Thresholds"),M===4&&(it(e),t.textContent="Back",a.textContent=ft()?"Next: Assign Devices":"Generate Zone Thresholds"),M===5&&(ua(e),t.textContent="Back",a.textContent=gt()?"Next: Farm Overview":"Scan Device QR"),M===6&&(ha(e),t.textContent="Back",a.textContent="Launch Farm")}function ot(){const e=Y()?["Farm","Zones","Goals","Thresholds","Devices","Launch"]:["Device","Field","Photo","Goals","3D"];document.getElementById("bfSteps").innerHTML=`
        <div style="display:grid;grid-template-columns:repeat(${e.length},1fr);gap:6px;padding-bottom:10px;">
            ${e.map((t,a)=>{const n=a+1<=M;return`
                    <div style="display:flex;align-items:center;gap:6px;min-width:0;">
                        <div style="width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;
                                    background:${n?"var(--accent)":"var(--border)"};
                                    color:${n?"#fff":"var(--muted)"};
                                    font-size:10px;font-weight:800;flex-shrink:0;">
                            ${a+1<M?"✓":a+1}
                        </div>
                        <div style="font-size:10px;font-weight:800;color:${a+1===M?"var(--accent)":"var(--muted)"};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                            ${t}
                        </div>
                    </div>
                `}).join("")}
        </div>
    `}function ca(e){const t=ma();e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">COMMERCIAL FARM INFO</div>
                ${ie("fieldNameInput","Farm name","e.g. SeedDown Commercial Farm 1",b.name)}
                ${ie("fieldLocationInput","Location","e.g. Johor Bahru Industrial Park",b.location)}
                <div style="margin-bottom:10px;">
                    <div style="font-size:11px;font-weight:800;color:var(--sub);margin-bottom:8px;">Farm size standard</div>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        ${ve.map(a=>da(a)).join("")}
                    </div>
                    <div style="margin-top:9px;padding:10px;border-radius:12px;background:var(--surface2);border:1px solid var(--border);font-size:11px;color:var(--muted);line-height:1.45;">
                        Selected: <strong style="color:var(--text);">${y(t.label)}</strong> · ${y(t.standard)} · ${y(t.area)} · recommended ${y(t.zones)}.
                    </div>
                </div>
                <label style="display:block;margin-bottom:10px;">
                    <span style="display:block;font-size:11px;font-weight:800;color:var(--sub);margin-bottom:5px;">Description</span>
                    <textarea id="fieldDescriptionInput" placeholder="Optional notes about this commercial farm"
                        style="width:100%;min-height:92px;resize:vertical;padding:11px 12px;border:1.5px solid var(--border);border-radius:10px;background:var(--surface2);color:var(--text);font-size:14px;outline:none;line-height:1.4;">${y(b.description)}</textarea>
                </label>
                <div style="font-size:12px;color:var(--muted);line-height:1.45;">
                    Commercial setup analyzes the farm space first, then assigns QR devices to the right zones.
                </div>
            </section>
        </div>
    `,J("fieldNameInput",a=>{b.name=a}),J("fieldLocationInput",a=>{b.location=a}),J("fieldDescriptionInput",a=>{b.description=a}),document.querySelectorAll(".commercial-size-card").forEach(a=>{a.addEventListener("click",()=>{b.rackType=a.dataset.size||"medium",v=null,$()})})}function da(e){const t=(b.rackType||"medium")===e.id;return`
        <button type="button" class="commercial-size-card" data-size="${e.id}"
            style="text-align:left;padding:12px;border-radius:13px;border:1.5px solid ${t?"var(--accent)":"var(--border)"};background:${t?"var(--accent-l)":"var(--surface2)"};color:var(--text);cursor:pointer;">
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;">
                <strong style="font-size:13px;color:${t?"var(--accent)":"var(--text)"};">${y(e.label)}</strong>
                <span style="font-size:10px;font-weight:900;color:${t?"var(--accent)":"var(--muted)"};">${t?"SELECTED":y(e.zones)}</span>
            </div>
            <div style="font-size:11px;color:var(--muted);line-height:1.4;margin-top:5px;">${y(e.standard)} · ${y(e.area)}</div>
            <div style="font-size:10px;color:var(--sub);line-height:1.35;margin-top:4px;">Best for: ${y(e.use)}</div>
        </button>
    `}function ma(){return ve.find(e=>e.id===(b.rackType||"medium"))||ve[1]}function pa(e){var a,n,o;const t=(v==null?void 0:v.zones)||[];e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:12px;">
                    <div>
                        <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;">FULL FARM PHOTO</div>
                        <div style="font-size:12px;color:var(--muted);margin-top:4px;">Capture all racks or visible production areas before QR assignment.</div>
                    </div>
                    <div style="font-size:11px;font-weight:800;color:var(--accent);white-space:nowrap;">${k?"READY":"NEEDED"}</div>
                </div>
                <div id="photoPreview"
                     style="width:100%;height:220px;border-radius:12px;border:2px dashed ${k?"var(--accent)":"var(--border)"};
                            background:${k?`url(${k.dataUrl}) center/cover`:"var(--surface2)"};
                            display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;position:relative;">
                    ${k?'<div style="position:absolute;bottom:10px;right:10px;background:rgba(0,0,0,.58);color:white;padding:6px 10px;border-radius:8px;font-size:11px;font-weight:800;">Farm photo loaded</div>':`
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
                    <button id="analyzeCommercialZonesBtn" ${k?"":"disabled"}
                        style="padding:8px 10px;border-radius:999px;border:1px solid ${k?"var(--accent)":"var(--border)"};background:${k?"var(--accent-l)":"var(--surface2)"};color:${k?"var(--accent)":"var(--muted)"};font-size:11px;font-weight:900;cursor:${k?"pointer":"not-allowed"};">Analyze</button>
                </div>
                <div id="commercialZoneSummary">${ba()}</div>
                ${t.length?`
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px;">
                        <button id="addCommercialZoneBtn" style="padding:11px;border:1px solid var(--border);border-radius:10px;background:var(--surface2);color:var(--text);font-weight:800;cursor:pointer;">Add Zone</button>
                        <button id="removeCommercialZoneBtn" style="padding:11px;border:1px solid rgba(220,38,38,.24);border-radius:10px;background:rgba(220,38,38,.08);color:var(--danger);font-weight:800;cursor:pointer;">Remove Last</button>
                    </div>
                `:""}
            </section>
        </div>
    `,vt(e),(a=document.getElementById("analyzeCommercialZonesBtn"))==null||a.addEventListener("click",dt),(n=document.getElementById("addCommercialZoneBtn"))==null||n.addEventListener("click",()=>{H();const r=v.zones.length;v.zones.push({zone_id:`zone_${String.fromCharCode(65+r)}`,name:`Zone ${String.fromCharCode(65+r)}`,recommended_type:"zone_node",crop:"Mixed Crops",plants:["lettuce"],confidence:.7,notes:"Manually added zone"}),v.total_devices_needed=v.farm_master_count+v.zones.length,$()}),(o=document.getElementById("removeCommercialZoneBtn"))==null||o.addEventListener("click",()=>{var r;((r=v==null?void 0:v.zones)==null?void 0:r.length)>1&&(v.zones.pop(),v.total_devices_needed=v.farm_master_count+v.zones.length,$())})}function rt(e){e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">COMMERCIAL FARM GOALS</div>
                <div style="font-size:12px;color:var(--muted);line-height:1.45;margin-bottom:12px;">Select up to three commercial priorities. These are applied per zone when generating thresholds.</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    ${tt.map(t=>{const a=L.includes(t.id);return`<button class="commercial-goal-priority" data-id="${t.id}"
                            style="padding:12px 8px;border-radius:12px;border:1.5px solid ${a?"var(--accent)":"var(--border)"};background:${a?"var(--accent-l)":"var(--surface2)"};color:${a?"var(--accent)":"var(--text)"};font-weight:900;font-size:12px;cursor:pointer;">${t.label}</button>`}).join("")}
                </div>
            </section>
        </div>
    `,document.querySelectorAll(".commercial-goal-priority").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.id;L.includes(a)?L=L.filter(n=>n!==a):L.length<3?L=[...L,a]:w("warning","Choose up to 3 commercial goals"),C=null,j={},rt(e)})})}function it(e){var t;H(),e.innerHTML=`
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
                    ${ya()}
                    ${v.zones.map(xa).join("")}
                </div>
            </section>
        </div>
    `,document.querySelectorAll(".zone-plant-input").forEach(a=>{a.addEventListener("change",n=>{const o=v.zones.find(r=>r.zone_id===n.target.dataset.zone);o&&(_a(o,$a(n.target.value)),C=null,delete j[o.zone_id],it(e))})}),document.querySelectorAll(".commercial-threshold-input").forEach(a=>{a.addEventListener("input",n=>{const o=n.target.dataset.zone,r=n.target.dataset.key,l=n.target.value===""?void 0:Number(n.target.value);if(!o||!r||!Number.isFinite(l))return;if(o==="farm_master"){C||(C={thresholds:{},notes:"Manual farm-level threshold adjustment",source:"manual"}),C.thresholds[r]=l;const u=We(r,l),d=document.getElementById("commercialSafety_farm_master");d&&(d.textContent=u||"",d.style.display=u?"block":"none"),u&&w("warning",u);return}j[o]||(j[o]={thresholds:{},notes:"Manual commercial threshold adjustment",source:"manual"}),j[o].thresholds[r]=l;const c=We(r,l),s=document.getElementById(`commercialSafety_${o}`);s&&(s.textContent=c||"",s.style.display=c?"block":"none"),c&&w("warning",c)})}),(t=document.getElementById("generateCommercialThresholdsBtn"))==null||t.addEventListener("click",pt)}function ua(e){var a;H(),e.innerHTML=`
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
                <div id="commercialPendingDevice" style="margin-top:12px;">${ka()}</div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">ASSIGNMENT PROGRESS</div>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    ${Ma()}
                </div>
            </section>
        </div>
    `;const t=document.getElementById("commercialDeviceQrInput");(a=document.getElementById("commercialScanQrBtn"))==null||a.addEventListener("click",()=>t==null?void 0:t.click()),t==null||t.addEventListener("change",n=>{var r;const o=(r=n.target.files)==null?void 0:r[0];o&&Sa(o),n.target.value=""}),document.querySelectorAll(".commercial-assign-target").forEach(n=>{n.addEventListener("click",()=>Ca(n.dataset.target))})}function ha(e){H(),setTimeout(fa,80),e.innerHTML=`
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
                    ${Q("Farm",b.name||"Commercial Farm")}
                    ${Q("Zones",`${v.zones.length}`)}
                    ${Q("Devices",`${W.length}/${v.total_devices_needed}`)}
                    ${Q("Goals",L.map(bt).join(", "))}
                </div>
            </section>
        </div>
    `}function fa(){var a;if(!document.getElementById("commercialPreviewCanvas"))return;const t=ga();T.currentFarm=t,T.currentFarmId=t.id,T.mode="commercial",O.init("commercialPreviewCanvas",t),(a=O.setCameraFrame)==null||a.call(O,!1)}function ga(){H();const e=v.zones||[],t=[];return e.forEach((a,n)=>{X(a).forEach((r,l)=>{t.push({name:r.name,species:String(r.name).toLowerCase().replace(/[^a-z0-9]+/g,"_"),slots:r.count,zoneId:a.zone_id,zoneName:a.name,slotIndex:n+l*Math.max(1,e.length),status:j[a.zone_id]?"healthy":"warning"})})}),{id:`commercial_preview_${Date.now()}`,name:b.name||"Commercial Farm Preview",accountMode:"commercial",rackTypeId:"5-tier",rackType:"Commercial Digital Twin",rackLabel:`${e.length||3}-Zone Commercial Facility`,targetPlant:e.map(a=>a.crop).filter(Boolean).join(", ")||"Commercial crops",plantSlots:Math.max(20,t.reduce((a,n)=>a+(n.slots||1),0)),plants:t,zones:e,commercialStructure:v,commercialDevices:W,createdAt:new Date().toISOString()}}function ba(){return v?`
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
            ${Q("Farm Master",v.farm_master_count)}
            ${Q("ESP32 Needed",v.total_devices_needed)}
            ${Q("Zones",v.zones.length)}
            ${Q("Confidence",`${Math.round((v.confidence||.82)*100)}%`)}
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;">
            ${v.zones.map(e=>`
                <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px;">
                    <div style="min-width:0;">
                        <div style="font-size:13px;font-weight:900;">${y(e.name)} · ${y(e.crop||"Mixed Crops")}</div>
                        <div style="font-size:11px;color:var(--muted);margin-top:3px;">${y(e.notes||"")}</div>
                        <div style="font-size:10px;color:var(--sub);margin-top:5px;line-height:1.35;">${y(X(e).map(t=>`${t.name} x ${t.count}`).join(" · "))}</div>
                    </div>
                    <span style="padding:5px 8px;border-radius:999px;background:var(--accent-l);color:var(--accent);font-size:10px;font-weight:900;white-space:nowrap;">${ht(e)} plants</span>
                </div>
            `).join("")}
        </div>
    `:`
            <div style="padding:22px;border:1px dashed var(--border);border-radius:12px;background:var(--surface2);text-align:center;color:var(--muted);font-size:13px;line-height:1.45;">
                Add a farm photo, then run AI zone analysis. If AI is unavailable, SeedDown will use a safe commercial fallback.
            </div>
        `}function ya(){const e=(C==null?void 0:C.thresholds)||{};return`
        <div style="background:linear-gradient(135deg,var(--accent-l),#fff);border:1.5px solid rgba(22,163,74,.22);border-radius:14px;padding:12px;">
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:10px;">
                <div>
                    <div style="font-size:13px;font-weight:900;color:var(--accent);">Farm Master Node</div>
                    <div style="font-size:10px;color:var(--muted);margin-top:3px;">Farm-level safety policy · shared emergency and monitoring thresholds</div>
                </div>
                <span style="font-size:10px;font-weight:900;color:${C?"var(--accent)":"var(--muted)"};">${C?"READY":"PENDING"}</span>
            </div>
            <div id="commercialSafety_farm_master" style="display:none;margin-bottom:10px;padding:8px 10px;border-radius:10px;background:rgba(245,158,11,.12);color:#b45309;font-size:11px;font-weight:800;line-height:1.35;"></div>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:12px;">
                ${st({zone_id:"farm_master"},e,"farm")}
            </div>
            <div style="padding:11px;border-radius:12px;background:rgba(255,255,255,.76);border:1px solid rgba(22,163,74,.14);">
                <div style="font-size:10px;font-weight:900;color:var(--sub);letter-spacing:.08em;margin-bottom:6px;">AI ANALYSIS</div>
                <div style="font-size:11px;color:var(--muted);line-height:1.55;">
                    ${lt({name:"Farm Master Node",plants:ct(),crop:"whole farm"},C,"farm")}
                </div>
            </div>
        </div>
    `}function xa(e){const t=j[e.zone_id],a=Pa(X(e)),n=(t==null?void 0:t.thresholds)||{};return`
        <div style="background:var(--surface2);border:1px solid var(--border);border-radius:14px;padding:12px;">
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:10px;">
                <div>
                    <div style="font-size:13px;font-weight:900;">${y(e.name)}</div>
                    <div style="font-size:10px;color:var(--muted);margin-top:3px;">Zone-level recipe · editable sensor and output thresholds</div>
                </div>
                <span style="font-size:10px;font-weight:900;color:${t?"var(--accent)":"var(--muted)"};">${t?"READY":"PENDING"}</span>
            </div>
            <label style="display:block;margin-bottom:10px;">
                <span style="display:block;font-size:10px;font-weight:900;color:var(--sub);letter-spacing:.06em;text-transform:uppercase;margin-bottom:5px;">Detected plants in this zone</span>
                <textarea class="zone-plant-input" data-zone="${e.zone_id}" placeholder="tomato x 8&#10;lettuce x 12"
                    style="width:100%;min-height:82px;resize:vertical;padding:10px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:var(--text);font-size:13px;outline:none;line-height:1.45;">${y(a)}</textarea>
                <span style="display:block;font-size:10px;color:var(--muted);margin-top:4px;">Use one line per plant. Example: cucumber x 6. The 3D twin uses these counts directly.</span>
            </label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
                ${Qe("Detected count",`${ht(e)} plants`)}
                ${Qe("3D source","zone scan")}
            </div>
            <div id="commercialSafety_${e.zone_id}" style="display:none;margin-bottom:10px;padding:8px 10px;border-radius:10px;background:rgba(245,158,11,.12);color:#b45309;font-size:11px;font-weight:800;line-height:1.35;"></div>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:12px;">
                ${st(e,n,"zone")}
            </div>
            <div style="padding:11px;border-radius:12px;background:var(--surface);border:1px solid var(--border);">
                <div style="font-size:10px;font-weight:900;color:var(--sub);letter-spacing:.08em;margin-bottom:6px;">AI ANALYSIS</div>
                <div style="font-size:11px;color:var(--muted);line-height:1.5;">
                    ${lt(e,t,"zone")}
                </div>
            </div>
        </div>
    `}function st(e,t={},a="zone"){return(a==="farm"?va():wa()).map(({key:o,label:r,unit:l,placeholder:c})=>`
        <label style="display:block;">
            <span style="display:block;font-size:10px;font-weight:900;color:var(--sub);margin-bottom:4px;text-transform:uppercase;">${y(r)}</span>
            <input class="commercial-threshold-input" data-zone="${e.zone_id}" data-key="${o}" type="number"
                value="${t[o]??""}" placeholder="${t[o]===void 0?c||"generate":""}"
                style="width:100%;padding:10px;border:1px solid var(--border);border-radius:10px;background:var(--surface);font-size:13px;font-weight:800;color:var(--text);outline:none;">
            ${l?`<span style="display:block;font-size:9px;color:var(--muted);margin-top:3px;">${y(l)}</span>`:""}
        </label>
    `).join("")}function va(){return[{key:"co2MinPpm",label:"CO2 min",unit:"CO2 Sensor · ppm",placeholder:"800"},{key:"co2MaxPpm",label:"CO2 max",unit:"CO2 Sensor · ppm",placeholder:"1500"},{key:"waterLowCm",label:"Reservoir low",unit:"HC-SR04 · cm distance",placeholder:"20"},{key:"waterCriticalCm",label:"Reservoir critical",unit:"HC-SR04 · cm distance",placeholder:"35"},{key:"gasDangerThreshold",label:"Gas danger",unit:"MQ-2 raw limit",placeholder:"3000"},{key:"energyDailyLimitKwh",label:"Energy limit",unit:"Power Meter · kWh/day",placeholder:"8"},{key:"mainFanDurationSeconds",label:"Main fan sec",unit:"Main Ventilation Fan output",placeholder:"20"},{key:"emergencyBuzzerSeconds",label:"Emergency buzz sec",unit:"Emergency Buzzer output",placeholder:"10"},{key:"sensorIntervalSeconds",label:"Farm poll sec",unit:"Farm master telemetry interval",placeholder:"300"}]}function wa(){return[{key:"tempMin",label:"Temp min",unit:"DHT11 · °C",placeholder:"18"},{key:"tempMax",label:"Temp max",unit:"DHT11 · °C",placeholder:"28"},{key:"humidityMin",label:"Humid min",unit:"DHT11 · %RH",placeholder:"50"},{key:"humidityMax",label:"Humid max",unit:"DHT11 · %RH",placeholder:"80"},{key:"soilDryThreshold",label:"Soil dry",unit:"Soil Moisture raw",placeholder:"2500"},{key:"darkThreshold",label:"Light dark",unit:"LDR raw",placeholder:"1500"},{key:"phMin",label:"pH min",unit:"pH Sensor",placeholder:"5.8"},{key:"phMax",label:"pH max",unit:"pH Sensor",placeholder:"6.8"},{key:"ecMin",label:"EC min",unit:"EC Sensor · mS/cm",placeholder:"1.2"},{key:"ecMax",label:"EC max",unit:"EC Sensor · mS/cm",placeholder:"2.0"},{key:"waterFlowMinLpm",label:"Flow min",unit:"YF-S201 · L/min",placeholder:"0.5"},{key:"wateringDurationSeconds",label:"Pump sec",unit:"Water Pump output",placeholder:"10"},{key:"growLightDurationSeconds",label:"Grow light sec",unit:"LED Grow Light output",placeholder:"30"},{key:"zoneFanDurationSeconds",label:"Zone fan sec",unit:"Zone Fan output",placeholder:"15"},{key:"activeBuzzerSeconds",label:"Alert buzz sec",unit:"Active Buzzer output",placeholder:"5"},{key:"cameraScanIntervalMinutes",label:"Camera scan min",unit:"Camera analysis interval",placeholder:"60"},{key:"diseaseConfidenceMin",label:"Disease confidence",unit:"Camera AI threshold · %",placeholder:"70"}]}function lt(e,t,a="zone"){const n=L.map(bt).join(", ")||"Commercial optimisation",o=X(e).map(d=>`${d.name} x ${d.count}`).join(", ")||e.crop||"mixed crops",r=a==="farm"?"the whole farm":e.name;if(!t)return`Generate thresholds to explain recommended sensor ranges, safety limits, and actuator timing for ${y(r)}. SeedDown will use the selected commercial goals, detected crops, and available device package to decide which thresholds should be active. Plants: ${y(o)}. Goals: ${y(n)}.`;const l=t.source==="ai"?"AI provider":t.source==="fallback"?"deterministic fallback":"manual edit",c=L.includes("profit_optimisation")?"Because profit optimisation is selected, the recipe avoids over-watering and long fan or light cycles unless readings show real risk.":L.includes("maximum_yield")?"Because maximum yield is selected, the recipe keeps the crop closer to its ideal growth band instead of only reacting at emergency levels.":L.includes("compliance_audit")?"Because compliance and audit is selected, the recipe keeps conservative sensor intervals and clearer safety boundaries for traceable operation.":"Because commercial operation is selected, the recipe balances crop health, automation cost, and operational safety.",s=a==="farm"?"Farm-level thresholds only cover shared infrastructure: CO2, reservoir depth from HC-SR04, MQ-2 gas, power meter consumption, main ventilation fan, and the emergency buzzer. These values protect the whole site even when each zone has a different crop recipe.":`Zone-level thresholds only cover independent growing zones: DHT11 temperature and humidity, soil moisture, LDR light, pH, EC, YF-S201 water flow, pump duration, grow light timing, zone fan timing, active buzzer warning, and camera scan confidence for ${y(o)}.`,u=t.notes||(a==="farm"?"Farm-level thresholds generated for master safety control.":"Thresholds generated for this zone.");return`${y(u)} Source: ${y(l)}. ${s} ${c} Plants considered: ${y(o)}. Goals considered: ${y(n)}. Safety guardrails are not relaxed for gas, abnormal temperature, pH, water level, or actuator duration, so manual edits outside a safe range will trigger warnings.`}function ct(){H();const e=v.zones.flatMap(t=>X(t).map(a=>a.name));return[...new Set(e.map(t=>String(t).trim()).filter(Boolean))]}function We(e,t){return{tempMin:t<5||t>30?"Temperature minimum is outside a safe commercial crop range.":"",tempMax:t<15||t>40?"Temperature maximum is outside a safe commercial crop range.":"",humidityMin:t<25||t>90?"Humidity minimum looks unsafe or unrealistic.":"",humidityMax:t<40||t>98?"Humidity maximum may create disease risk or sensor error.":"",phMin:t<4.5||t>7.5?"pH minimum is outside common hydroponic safety range.":"",phMax:t<5||t>8.5?"pH maximum is outside common hydroponic safety range.":"",gasDangerThreshold:t>4e3?"Gas danger threshold is too high and may delay emergency alerts.":"",waterLowCm:t<1||t>35?"Water-low distance may be unsafe for reservoir monitoring.":"",waterCriticalCm:t<5||t>60?"Reservoir critical distance is outside practical HC-SR04 monitoring range.":"",co2MaxPpm:t<800||t>2500?"CO2 maximum is outside safe commercial ventilation planning range.":"",energyDailyLimitKwh:t<.5||t>80?"Energy daily limit looks unrealistic for a commercial farm size.":"",mainFanDurationSeconds:t>600?"Main ventilation fan duration is very long; check energy impact.":"",emergencyBuzzerSeconds:t>120?"Emergency buzzer duration is too long for practical alerts.":"",wateringDurationSeconds:t>120?"Watering duration is very long and may flood the zone.":"",fanDurationSeconds:t>300?"Fan duration is very long; check energy and crop stress impact.":"",growLightDurationSeconds:t>14400?"Grow light duration is very long and may waste energy.":"",zoneFanDurationSeconds:t>600?"Zone fan duration is very long; check energy and crop stress impact.":"",activeBuzzerSeconds:t>120?"Active buzzer duration is too long for a zone warning.":"",waterFlowMinLpm:t<0||t>10?"Water flow threshold is outside practical YF-S201 range.":"",cameraScanIntervalMinutes:t<1||t>1440?"Camera scan interval should stay between 1 minute and 24 hours.":"",diseaseConfidenceMin:t<40||t>95?"Disease confidence threshold should stay practical to avoid false alarms or missed cases.":"",sensorIntervalSeconds:t<5||t>86400?"Sensor interval is outside practical monitoring range.":"",ecMin:t<.2||t>4?"EC minimum is outside practical nutrient monitoring range.":"",ecMax:t<.5||t>6?"EC maximum is outside practical nutrient monitoring range.":"",co2MinPpm:t<250||t>2e3?"CO2 minimum is outside normal commercial monitoring range.":""}[e]||""}function Qe(e,t){return`<div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:8px;">
        <div style="font-size:9px;font-weight:900;color:var(--sub);text-transform:uppercase;">${y(e)}</div>
        <div style="font-size:12px;font-weight:900;color:var(--text);margin-top:3px;">${y(t)}</div>
    </div>`}function ka(){if(!B)return'<div style="font-size:12px;color:var(--muted);line-height:1.45;">No commercial QR scanned yet.</div>';const e=za(B);return`
        <div style="border:1px solid var(--border);border-radius:14px;background:var(--surface2);padding:12px;">
            <div style="font-size:12px;font-weight:900;color:var(--text);">${y(B.label||B.serial)}</div>
            <div style="font-size:10px;color:var(--muted);margin-top:3px;">${y(B.serial)} · choose assignment target</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;">
                ${e.map(t=>`
                    <button class="commercial-assign-target" data-target="${t.id}" ${t.disabled?"disabled":""}
                        style="padding:10px;border-radius:10px;border:1px solid ${t.disabled?"var(--border)":"var(--accent)"};background:${t.disabled?"var(--surface)":"var(--accent-l)"};color:${t.disabled?"var(--muted)":"var(--accent)"};font-weight:900;cursor:${t.disabled?"not-allowed":"pointer"};opacity:${t.disabled?".55":"1"};">
                        ${y(t.label)}
                    </button>
                `).join("")}
            </div>
        </div>
    `}function Ma(){return H(),[{id:"farm_master",label:"Farm Master Node",required:"farm_master"},...v.zones.map(t=>({id:t.zone_id,label:t.name,required:"zone_node"}))].map(t=>{const a=W.find(n=>n.targetId===t.id);return`
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px;">
                <div>
                    <div style="font-size:13px;font-weight:900;">${y(t.label)}</div>
                    <div style="font-size:10px;color:var(--muted);margin-top:3px;">Needs ${t.required==="farm_master"?"Farm Master Node":"Zone Node"}</div>
                </div>
                <span style="font-size:10px;font-weight:900;color:${a?"var(--accent)":"var(--muted)"};">${a?y(a.serial):"UNASSIGNED"}</span>
            </div>
        `}).join("")}async function dt(){if(!k)return w("warning","Add a commercial farm photo first"),null;const e=document.getElementById("analyzeCommercialZonesBtn");e&&(e.disabled=!0,e.textContent="Analyzing...");try{await we()}catch{}return v=mt(),w("success",`${v.zones.length} commercial zones recommended`),$(),v}function mt(){const e=b.rackType||"medium",t=e==="large"?4:e==="small"?2:3,a=I.length?I.map(o=>({name:o.name||o.species||"lettuce",count:Math.max(1,Number.parseInt(o.slots,10)||3)})):[{name:"tomato",count:8},{name:"lettuce",count:12},{name:"spinach",count:10},{name:"strawberry",count:6}],n=Array.from({length:t},(o,r)=>{const l=ra[r]||{zone_id:`zone_${String.fromCharCode(65+r)}`,name:`Zone ${String.fromCharCode(65+r)}`,recommended_type:"zone_node",crop:a[r%a.length].name,plants:[a[r%a.length].name],confidence:.78,notes:"AI fallback zone recommendation"},c=a.filter((p,m)=>m%t===r),s=a[r%a.length],u=c.length?c:[{...s,count:Math.max(1,Math.ceil(s.count/t))}],d=u.map(p=>`${p.name} x ${p.count}`).join(", ");return{...l,zone_id:`zone_${String.fromCharCode(65+r)}`,name:`Zone ${String.fromCharCode(65+r)}`,crop:d,plantItems:u.map(p=>({name:p.name,count:p.count})),plants:u.map(p=>String(p.name).toLowerCase()),plantCount:u.reduce((p,m)=>p+m.count,0)}});return{farm_master_count:1,zones:n,total_devices_needed:n.length+1,confidence:.84,rack_count:t*2,scale:e}}function H(){v||(v=mt())}async function pt(){var t;H();const e=document.getElementById("generateCommercialThresholdsBtn")||document.getElementById("bfNext");e&&(e.disabled=!0,e.textContent="Generating...");try{const a=ct().map((r,l)=>({tier:l+1,plant_type:r})),n=await fetch(`${U}/api/ai/generate-thresholds`,{method:"POST",headers:q(),body:JSON.stringify({plants:a,goal_priority:L,packageLevel:"farm_master"})}),o=await ee(n);if(!n.ok||!o.ok)throw new Error(o.error||"Farm-level threshold generation failed");C={thresholds:Ta(o.thresholds||{}),notes:o.notes,source:o.source};for(const r of v.zones){const l=((t=r.plants)!=null&&t.length?r.plants:["lettuce"]).map((u,d)=>({tier:d+1,plant_type:u})),c=await fetch(`${U}/api/ai/generate-thresholds`,{method:"POST",headers:q(),body:JSON.stringify({plants:l,goal_priority:L,packageLevel:r.recommended_type})}),s=await ee(c);if(!c.ok||!s.ok)throw new Error(s.error||`Threshold generation failed for ${r.name}`);j[r.zone_id]={thresholds:Ia(s.thresholds||{},r),notes:s.notes,source:s.source}}return w("success","Farm and zone thresholds generated"),$(),j}catch(a){return w("error",a.message),null}finally{e&&(e.disabled=!1)}}function Sa(e){const t=new FileReader;t.onload=async a=>{try{const n=await yt(a.target.result),o=Se(n);if(o.deviceType!=="commercial")throw new Error("This QR is for Beginner. Commercial setup requires COM device QR.");B=o,w("info",`Scanned ${o.label||o.serial}`),$()}catch(n){w("error",n.message||"Could not read QR code")}},t.readAsDataURL(e)}function za(e){H();const t=new Set(W.map(n=>n.targetId));return[{id:"farm_master",label:"Farm Master Node",required:"farm_master"},...v.zones.map(n=>({id:n.zone_id,label:n.name,required:"zone_node"}))].map(n=>{const o=ut(e,n.required),r=t.has(n.id);return{...n,disabled:!o||r}})}function ut(e,t){const a=e.packageLevel||e.id||"",n=String(e.serial||"");return t==="farm_master"?a==="farm_master"||a==="farm_zone"||n.includes("FRM")||n.includes("FZK")||n.includes("MST"):t==="zone_node"?["zone_node","farm_zone","zone_basic","zone_pro"].includes(a)||n.includes("ZON")||n.includes("FZK")||n.includes("ZNB")||n.includes("ZNP"):!1}async function Ca(e){if(!B)return;H();const t=e==="farm_master"?{required:"farm_master"}:v.zones.find(r=>r.zone_id===e);if(!t)return;const a=t.required||t.recommended_type||"zone_node";if(!ut(B,a)){w("error","Device type does not match this target");return}const n=Me||`farm_com_${Date.now()}`,o=B.accountType||(B.packageLevel==="farm_master"?"commercial_farm_master":B.packageLevel==="farm_zone"?"commercial_farm_zone":B.packageLevel==="zone_node"?"commercial_zone":B.packageLevel==="zone_pro"?"commercial_zone_pro":"commercial_zone_basic");try{const r=await fetch(`${U}/api/devices/register`,{method:"POST",headers:q(),body:JSON.stringify({serial:B.serial,wifi_ssid:E.wifiSsid.trim(),wifi_password:E.wifiPassword,accountType:o,farmId:n,zoneId:e==="farm_master"?null:e})}),l=await ee(r);if(!r.ok||!l.ok)throw new Error(l.error||"Device assignment failed");Ue(l.device,e),w("success","Device assigned")}catch(r){const l=Ea(B,e,n);Ue(l,e),w("warning",`Backend register failed, using demo device: ${r.message}`)}B=null,$()}function Ta(e={}){return{co2MinPpm:Number(e.co2MinPpm??800),co2MaxPpm:Number(e.co2MaxPpm??1500),waterLowCm:Number(e.waterLowCm??20),waterCriticalCm:Number(e.waterCriticalCm??35),gasDangerThreshold:Number(e.gasDangerThreshold??3e3),energyDailyLimitKwh:Number(e.energyDailyLimitKwh??La()),mainFanDurationSeconds:Number(e.mainFanDurationSeconds??e.fanDurationSeconds??20),emergencyBuzzerSeconds:Number(e.emergencyBuzzerSeconds??10),sensorIntervalSeconds:Number(e.sensorIntervalSeconds??300)}}function Ia(e={},t={}){return{tempMin:Number(e.tempMin??18),tempMax:Number(e.tempMax??28),humidityMin:Number(e.humidityMin??50),humidityMax:Number(e.humidityMax??80),soilDryThreshold:Number(e.soilDryThreshold??2500),darkThreshold:Number(e.darkThreshold??1500),phMin:Number(e.phMin??5.8),phMax:Number(e.phMax??6.8),ecMin:Number(e.ecMin??1.2),ecMax:Number(e.ecMax??2),waterFlowMinLpm:Number(e.waterFlowMinLpm??.5),wateringDurationSeconds:Number(e.wateringDurationSeconds??10),growLightDurationSeconds:Number(e.growLightDurationSeconds??(String(t.crop||"").toLowerCase().includes("lettuce")?45:30)),zoneFanDurationSeconds:Number(e.zoneFanDurationSeconds??e.fanDurationSeconds??15),activeBuzzerSeconds:Number(e.activeBuzzerSeconds??5),cameraScanIntervalMinutes:Number(e.cameraScanIntervalMinutes??60),diseaseConfidenceMin:Number(e.diseaseConfidenceMin??70)}}function X(e={}){if(Array.isArray(e.plantItems)&&e.plantItems.length)return e.plantItems.map(n=>({name:String(n.name||n.plant||n.species||"Plant").trim()||"Plant",count:Math.max(1,Math.min(999,Number.parseInt(n.count??n.slots??n.quantity??1,10)||1))}));const t=Array.isArray(e.plants)&&e.plants.length?e.plants:cn(e.crop||"lettuce"),a=Math.max(1,Math.round(Number(e.plantCount||e.slots||12)/Math.max(1,t.length)));return t.map(n=>({name:String(n).trim()||"Plant",count:a}))}function ht(e={}){return X(e).reduce((t,a)=>t+a.count,0)}function Pa(e=[]){return e.map(t=>`${t.name} x ${t.count}`).join(`
`)}function $a(e){return String(e||"").split(/[\n;]+/).flatMap(a=>a.split(/,(?=[^0-9]*[a-zA-Z])/)).map(a=>a.trim()).filter(Boolean).map(a=>{const n=a.match(/^(.+?)(?:\s*(?:x|\*)\s*|[:=]\s*|\s+)(\d+)$/i),o=(n?n[1]:a).trim(),r=n?Number.parseInt(n[2],10):1;return{name:o.charAt(0).toUpperCase()+o.slice(1),count:Math.max(1,Math.min(999,Number.isFinite(r)?r:1))}})}function _a(e,t){const a=t.length?t:[{name:"Lettuce",count:1}];e.plantItems=a,e.plants=a.map(n=>n.name.toLowerCase()),e.plantCount=a.reduce((n,o)=>n+o.count,0),e.crop=a.map(n=>`${n.name} x ${n.count}`).join(", ")}function La(){const e=b.rackType||"medium";return e==="small"?4:e==="large"?20:10}function Ue(e,t){const a=Da(e);W=[...W.filter(n=>n.targetId!==t&&n.deviceId!==a.deviceId),{...a,targetId:t,zoneId:t==="farm_master"?null:t,role:t==="farm_master"?"farm_master":"zone_node"}]}function Da(e={}){const t=String(e.serial||"").toUpperCase(),a=sa[t];return a?{...e,deviceId:a.deviceId,deviceToken:a.deviceToken,status:e.status||"demo-assigned"}:e}function Ea(e={},t,a){const n=String(e.serial||`SD-COM-DEMO-${Date.now()}`).toUpperCase(),o=n.split("-").pop()||String(Date.now()).slice(-5),r=e.packageLevel||(t==="farm_master"?"farm_master":"zone_node");return{deviceId:`dev_commercial_${r}_${o}`.toLowerCase().replace(/[^a-z0-9_]/g,"_"),deviceToken:`demo_token_${o}`,serial:n,deviceType:"commercial",packageLevel:r,farmId:a,zoneId:t==="farm_master"?null:t,nodeType:r,status:"demo-assigned",isDemoFallback:!0}}function ft(){return H(),!!C&&v.zones.every(e=>!!j[e.zone_id])}function gt(){return H(),["farm_master",...v.zones.map(t=>t.zone_id)].every(t=>W.some(a=>a.targetId===t))}function bt(e){var t;return((t=tt.find(a=>a.id===e))==null?void 0:t.label)||String(e).replace(/_/g," ")}function Na(e){var a;e.innerHTML=`
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
                <div id="deviceStatus" style="margin-top:12px;font-size:12px;color:${f?"var(--accent)":"var(--muted)"};line-height:1.45;">
                    ${f?`Linked ${y(f.deviceId)} · ${y(f.packageLevel)} · ${y(f.serial||E.serial)}`:"No QR scanned yet."}
                </div>
                ${f?Ba():""}
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">WIFI SETUP</div>
                ${ie("wifiSsidInput","WiFi SSID","Your WiFi name",E.wifiSsid)}
                <label style="display:block;margin-bottom:10px;">
                    <span style="display:block;font-size:11px;font-weight:800;color:var(--sub);margin-bottom:5px;">WiFi password</span>
                    <input id="wifiPasswordInput" type="password" value="${y(E.wifiPassword)}" placeholder="stored only for setup simulation"
                        style="width:100%;padding:11px 12px;border:1.5px solid var(--border);border-radius:10px;background:var(--surface2);color:var(--text);font-size:14px;outline:none;">
                </label>
            </section>
        </div>
    `,J("wifiSsidInput",n=>{E.wifiSsid=n,f=null}),J("wifiPasswordInput",n=>{E.wifiPassword=n,f=null});const t=document.getElementById("deviceQrInput");(a=document.getElementById("scanQrBtn"))==null||a.addEventListener("click",()=>t==null?void 0:t.click()),t==null||t.addEventListener("change",n=>{var r;const o=(r=n.target.files)==null?void 0:r[0];o&&Fa(o),n.target.value=""})}function Ba(){const e=ae(),t=oe(e),a=ze().filter(n=>!t.thresholdKeys.includes(n.key)).map(n=>n.label).slice(0,4);return`
        <div style="margin-top:12px;padding:11px;border-radius:12px;background:var(--accent-l);border:1px solid rgba(22,163,74,.16);">
            <div style="font-size:11px;font-weight:900;color:var(--accent);margin-bottom:4px;">${y(t.label)} package detected</div>
            <div style="font-size:11px;color:var(--muted);line-height:1.45;">
                Threshold generation will only enable sensors included in this QR package.
                ${a.length?` Locked: ${a.join(", ")}${a.length>=4?"...":""}`:" All threshold controls are unlocked."}
            </div>
        </div>
    `}function Fa(e){const t=new FileReader;t.onload=async a=>{try{const n=await yt(a.target.result);await Ra(n)}catch(n){w("error",n.message||"Could not read QR code")}},t.readAsDataURL(e)}function yt(e){return new Promise((t,a)=>{const n=new Image;n.onload=()=>{const o=document.createElement("canvas");o.width=n.naturalWidth||n.width,o.height=n.naturalHeight||n.height;const r=o.getContext("2d",{willReadFrequently:!0});r.drawImage(n,0,0,o.width,o.height);const l=r.getImageData(0,0,o.width,o.height),c=Nt(l.data,l.width,l.height);if(!(c!=null&&c.data)){a(new Error("QR not detected. Try the generated SeedDown QR png."));return}try{t(Aa(c.data))}catch(s){a(s)}},n.onerror=()=>a(new Error("Unable to load QR image")),n.src=e})}function Aa(e){const t=String(e||"").trim();let a;try{a=JSON.parse(t)}catch{a={serial:t}}if(a.type&&a.type!=="seeddown_device_qr")throw new Error("This is not a SeedDown device QR");if(!a.serial)throw new Error("QR does not contain a device serial");return Se(a)}async function Ra(e){const t=Se(e);E.serial=t.serial,E.accountType=t.accountType,f=null,w("info",`Scanned ${t.label||t.serial}`),await Xa(t)}function Se(e={}){const t=String(e.serial||"").trim().toUpperCase(),a=nt.find(o=>o.serial===t);return a?{...a,...e,serial:t}:{...Ga(t),...e,serial:t}}function Ga(e){return e.startsWith("SD-BGN-STR")?{label:"Beginner Starter",accountType:"beginner_starter",packageLevel:"starter",deviceType:"beginner",desc:"basic home sensor kit"}:e.startsWith("SD-BGN-STD")?{label:"Beginner Standard",accountType:"beginner_standard",packageLevel:"standard",deviceType:"beginner",desc:"balanced home vertical farm kit"}:e.startsWith("SD-BGN-PRO")?{label:"Beginner Pro",accountType:"beginner_pro",packageLevel:"pro",deviceType:"beginner",desc:"advanced home kit with more automation"}:e.startsWith("SD-COM-FRM")||e.startsWith("SD-COM-MST")?{label:"Commercial Farm Master Node",accountType:"commercial_farm_master",packageLevel:"farm_master",deviceType:"commercial",desc:"farm-level controller"}:e.startsWith("SD-COM-FZK")?{label:"Commercial Farm + Zone Combo",accountType:"commercial_farm_zone",packageLevel:"farm_zone",deviceType:"commercial",desc:"farm or zone compatible node"}:e.startsWith("SD-COM-ZON")||e.startsWith("SD-COM-ZNB")||e.startsWith("SD-COM-ZNP")?{label:"Commercial Zone Node",accountType:"commercial_zone",packageLevel:"zone_node",deviceType:"commercial",desc:"zone-level sensor and actuator node"}:{label:e||"Unknown QR",accountType:"",packageLevel:"",deviceType:"",desc:"unknown device QR"}}function Oa(e){e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">FIELD INFO</div>
                ${ie("fieldNameInput","Field name","e.g. Balcony Trial A",b.name)}
                ${ie("fieldLocationInput","Location / zone","e.g. Balcony, Lab Corner, Zone A",b.location)}
                <label style="display:block;margin-bottom:10px;">
                    <span style="display:block;font-size:11px;font-weight:800;color:var(--sub);margin-bottom:5px;">Description</span>
                    <textarea id="fieldDescriptionInput" placeholder="Optional notes about this field"
                        style="width:100%;min-height:92px;resize:vertical;padding:11px 12px;border:1.5px solid var(--border);border-radius:10px;background:var(--surface2);color:var(--text);font-size:14px;outline:none;line-height:1.4;">${y(b.description)}</textarea>
                </label>
                <div style="font-size:12px;color:var(--muted);line-height:1.45;">
                    Plant analysis, crop goals, and device thresholds are handled in the next steps after photo scanning.
                </div>
            </section>
        </div>
    `,J("fieldNameInput",t=>{b.name=t}),J("fieldLocationInput",t=>{b.location=t}),J("fieldDescriptionInput",t=>{b.description=t})}function ie(e,t,a,n){return`
        <label style="display:block;margin-bottom:10px;">
            <span style="display:block;font-size:11px;font-weight:800;color:var(--sub);margin-bottom:5px;">${t}</span>
            <input id="${e}" type="text" value="${y(n)}" placeholder="${a}"
                style="width:100%;padding:11px 12px;border:1.5px solid var(--border);border-radius:10px;
                       background:var(--surface2);color:var(--text);font-size:14px;outline:none;">
        </label>
    `}function Ha(e){const t=b.rackType===e.id;return`
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
                <span style="display:block;font-size:10px;color:var(--sub);margin-top:3px;line-height:1.25;">${y(e.desc||"")}</span>
            </span>
            <span style="font-size:18px;color:${t?"var(--accent)":"var(--muted)"};">${t?"✓":"+"}</span>
        </button>
    `}function Za(){document.querySelectorAll(".rack-opt").forEach(e=>{e.addEventListener("click",()=>{b.rackType=e.dataset.id||b.rackType,b.customRack=null,x=null,$()})})}function xt(e){e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:12px;">
                    <div>
                        <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;">FIELD PHOTO</div>
                        <div style="font-size:12px;color:var(--muted);margin-top:4px;">Capture the vertical setup so the preview can match the real field.</div>
                    </div>
                    <div style="font-size:11px;font-weight:800;color:var(--accent);white-space:nowrap;">${k?"READY":"NEEDED"}</div>
                </div>

                <div id="photoPreview"
                     style="width:100%;height:220px;border-radius:12px;border:2px dashed ${k?"var(--accent)":"var(--border)"};
                            background:${k?`url(${k.dataUrl}) center/cover`:"var(--surface2)"};
                            display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;position:relative;">
                    ${k?`
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
                        <div id="scanStatus" style="font-size:11px;color:var(--muted);margin-top:3px;">${k?"Ready to scan or edit manually":"Add a photo, or continue with manual plants"}</div>
                    </div>
                    <button id="scanBtn" ${k?"":"disabled"}
                        style="padding:7px 10px;border-radius:20px;border:1px solid ${k?"var(--accent)":"var(--border)"};
                               background:${k?"var(--accent-l)":"var(--surface2)"};
                               color:${k?"var(--accent)":"var(--muted)"};
                               font-size:11px;font-weight:800;cursor:${k?"pointer":"not-allowed"};">
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
                    <span id="structureStatus" style="font-size:10px;font-weight:900;color:var(--accent);">${te().label}</span>
                </div>
                <div style="display:flex;flex-direction:column;gap:8px;max-height:260px;overflow:auto;">
                    ${he.map(Ha).join("")}
                </div>
            </section>
        </div>
    `,ge(),vt(e),document.getElementById("scanBtn").addEventListener("click",we),document.getElementById("manualAddBtn").addEventListener("click",Ye),document.getElementById("manualPlantInput").addEventListener("keypress",t=>{t.key==="Enter"&&Ye()}),Za(),k&&!ue&&(ue=!0,we())}function vt(e){const t=document.getElementById("photoInput");document.getElementById("photoPreview").addEventListener("click",()=>t.click()),document.getElementById("cameraBtn").addEventListener("click",()=>{t.setAttribute("capture","environment"),t.click()}),document.getElementById("galleryBtn").addEventListener("click",()=>{t.removeAttribute("capture"),t.click()}),t.addEventListener("change",a=>{const n=a.target.files[0];if(!n)return;const o=new FileReader;o.onload=r=>{var d;const l=r.target.result,[c,s]=l.split(","),u=((d=c.match(/:(.*?);/))==null?void 0:d[1])||"image/jpeg";k={base64:s,mediaType:u,dataUrl:l},ue=!1,Y()?$():xt(e)},o.readAsDataURL(n)})}function ge(){const e=document.getElementById("plantList");if(e){if(I.length===0){e.innerHTML=`
            <div style="padding:22px;border:1px dashed var(--border);border-radius:12px;background:var(--surface2);text-align:center;color:var(--muted);font-size:13px;">
                No plants yet. Add the target plant or scan a photo.
            </div>
        `;return}e.innerHTML=I.map((t,a)=>`
        <div style="display:flex;align-items:center;gap:10px;background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px;">
            <div style="font-size:26px;line-height:1;flex-shrink:0;">${t.emoji}</div>
            <div style="flex:1;min-width:0;">
                <div style="font-size:13px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${y(t.name)}</div>
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
    `).join(""),e.querySelectorAll("button[data-action]").forEach(t=>{t.addEventListener("click",()=>{const a=Number(t.dataset.idx),n=t.dataset.action;n==="inc"&&(I[a].slots=Math.min(40,I[a].slots+1)),n==="dec"&&(I[a].slots=Math.max(1,I[a].slots-1)),n==="remove"&&I.splice(a,1),ge()})})}}async function we(){if(!k){w("warning","Add a field photo first");return}const e=document.getElementById("scanBtn"),t=document.getElementById("scanStatus");e&&(e.textContent="Scanning...",e.disabled=!0),t&&(t.textContent="AI is checking the field photo...");try{const n=await(await fetch(`${U}/api/farms/scan-plants`,{method:"POST",headers:q(),body:JSON.stringify({image:k.base64,mediaType:k.mediaType,targetPlant:b.targetPlant})})).json(),o=Array.isArray(n.plants)?n.plants:[],r=n.structure||n.rack||n.layout;let l=Va(r);o.length?(Tt(o),l=Mt(r)||l,w("success",`${o.length} plant type${o.length>1?"s":""} detected${l?" + structure matched":""}`),t&&(t.textContent=`Review plants and ${l?"detected structure":"structure"} before generating 3D.`)):(t&&(t.textContent=l?"Structure detected. Add plants manually if needed.":n.warning||"No clear plant detected. Manual list is still usable."),w("info",l?"Structure detected from photo":"No plant detected from photo yet"))}catch{t&&(t.textContent="Photo scan unavailable. Manual plant list is ready."),w("warning","AI scan unavailable, continue manually")}finally{e&&(e.textContent="Scan Photo",e.disabled=!1),ge(),!Y()&&M===3&&$()}}function wt(e){var o;Mt();const t=te(),a=fe(),n=((o=I[0])==null?void 0:o.name)||"Field";e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:var(--shadow-sm);">
                <div style="padding:12px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:10px;">
                    <div style="min-width:0;">
                        <div style="font-size:14px;font-weight:900;">${y(n)} Vertical 3D</div>
                        <div style="font-size:11px;color:var(--muted);margin-top:2px;">Drag to orbit · Toggle for gamified view</div>
                    </div>
                    <div style="display:flex;background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:3px;flex-shrink:0;">
                        <button class="view-toggle" data-mode="realistic"
                            style="${qe(S==="realistic")}">Real</button>
                        <button class="view-toggle" data-mode="gamified"
                            style="${qe(S==="gamified")}">Game</button>
                    </div>
                </div>
                <div style="position:relative;background:#10141d;">
                    <canvas id="farmCanvas3D" style="width:100%;height:clamp(300px,44dvh,560px);display:block;"></canvas>
                    <div id="canvas3DOverlay"
                         style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
                                background:rgba(16,20,29,.74);color:rgba(255,255,255,.78);font-size:13px;">
                        Building 3D field...
                    </div>
                    ${k?`
                        <img src="${k.dataUrl}" alt="Field source photo"
                             style="position:absolute;right:10px;bottom:10px;width:70px;height:70px;border-radius:10px;
                                    object-fit:cover;border:2px solid rgba(255,255,255,.45);box-shadow:0 8px 20px rgba(0,0,0,.22);">
                    `:""}
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">ANALYSIS SNAPSHOT</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                    ${Q("Target plant",n)}
                    ${Q("Goal",mn(b.analysisGoal))}
                    ${Q("Structure",t.label)}
                    ${Q("Slots",`${a}/${t.total}`,a>t.total?"var(--danger)":"var(--ok)")}
                </div>
                <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px;">
                    ${I.map(r=>`
                        <span style="padding:5px 9px;border-radius:20px;background:var(--ok-bg);color:var(--ok);font-size:12px;font-weight:800;">
                            ${r.emoji} ${y(r.name)} ×${r.slots}
                        </span>
                    `).join("")}
                </div>
            </section>
        </div>
    `,document.querySelectorAll(".view-toggle").forEach(r=>{r.addEventListener("click",()=>{S=r.dataset.mode,wt(e)})}),setTimeout(()=>ja(t),100)}function qe(e){return["border:none","border-radius:8px","padding:7px 10px","font-size:11px","font-weight:900","cursor:pointer",`background:${e?"var(--accent)":"transparent"}`,`color:${e?"#fff":"var(--muted)"}`].join(";")}function Q(e,t,a="var(--text)"){return`
        <div style="border:1px solid var(--border);border-radius:12px;padding:10px;background:var(--surface2);min-height:62px;">
            <div style="font-size:10px;color:var(--muted);font-weight:800;margin-bottom:5px;">${e}</div>
            <div style="font-size:13px;color:${a};font-weight:900;line-height:1.25;">${y(String(t))}</div>
        </div>
    `}async function ja(e){const t=document.getElementById("farmCanvas3D"),a=document.getElementById("canvas3DOverlay");if(!t)return;a&&(a.style.display="none");const n=()=>({width:Math.max(240,t.clientWidth||t.offsetWidth||360),height:Math.max(260,t.clientHeight||t.offsetHeight||330)}),{width:o,height:r}=n();if(!Ua()){Ve(t,e,o,r),w("warning","WebGL is disabled, showing 2D preview");return}const l=Math.min(window.devicePixelRatio||1,2);t.width=o*l,t.height=r*l;let c;try{c=new i.WebGLRenderer({canvas:t,antialias:!0,alpha:!1,preserveDrawingBuffer:!0})}catch(_){console.warn("[BuildFarm] WebGL unavailable, using 2D fallback:",_.message),Ve(t,e,o,r),w("warning","WebGL is disabled, showing 2D preview");return}c.setPixelRatio(l),c.setSize(o,r),c.shadowMap.enabled=!0,c.shadowMap.type=i.PCFShadowMap,c.outputColorSpace=i.SRGBColorSpace,c.toneMapping=i.ACESFilmicToneMapping;const s=new i.Scene;s.background=new i.Color(S==="gamified"?1581626:1053725),s.fog=new i.FogExp2(S==="gamified"?1581626:1053725,.028);const u=new i.PerspectiveCamera(46,o/r,.1,80);u.position.set(3.3,2.25,3.7),s.add(new i.AmbientLight(S==="gamified"?7902463:4346223,1.55));const d=new i.DirectionalLight(16777215,S==="gamified"?3.4:2.3);d.position.set(5,8,5),d.castShadow=!0,d.shadow.mapSize.set(1024,1024),s.add(d);const{tiers:p,slotsPerTier:m}=e,h=e.shape==="channel"?.34:e.shape==="wall"?.36:e.shape==="column"?.46:.42,g=m*h+.1,z=e.shape==="wall"?.34:e.shape==="column"?1:S==="gamified"?.72:.58,P=e.tiers>=5?.54:.66,G=p*P,ne=new i.MeshStandardMaterial({color:S==="gamified"?1911634:1448740,roughness:.9,metalness:.02}),N=new i.Mesh(new i.PlaneGeometry(9,9),ne);N.rotation.x=-Math.PI/2,N.receiveShadow=!0,s.add(N);const $t=new i.MeshStandardMaterial({color:S==="gamified"?5995770:5859452,roughness:.3,metalness:.75}),_t=new i.MeshStandardMaterial({color:S==="gamified"?8246268:7372944,roughness:.42,metalness:.55}),Lt=new i.MeshStandardMaterial({color:S==="gamified"?16436245:10980346,emissive:S==="gamified"?8736014:5972406,emissiveIntensity:S==="gamified"?.45:.2,roughness:.5}),Dt=new i.BoxGeometry(.045,G,.045);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([_,F])=>{const K=new i.Mesh(Dt,$t);K.position.set(_*g/2,G/2,F*z/2),K.castShadow=!0,s.add(K)});const Ie=[];I.forEach(_=>{for(let F=0;F<_.slots;F++)Ie.push(_)});for(let _=0;_<p;_++){const F=_*P,K=new i.Mesh(new i.BoxGeometry(g,.035,z),_t);K.position.set(0,F+.018,0),K.castShadow=!0,K.receiveShadow=!0,s.add(K);const Le=new i.Mesh(new i.BoxGeometry(g*.86,.018,.035),Lt);Le.position.set(0,F+P-.07,-z/2+.06),s.add(Le);const De=new i.PointLight(S==="gamified"?16436245:10980346,.75,1.4);De.position.set(0,F+P*.7,0),s.add(De);for(let se=0;se<m;se++){const Ee=_*m+se,Ne=Ie[Ee],Be=(se-(m-1)/2)*h,Fe=0,Ae=F+.05;if(!Ne){const Re=new i.Mesh(new i.CylinderGeometry(.07,.07,.018,S==="gamified"?6:16),new i.MeshStandardMaterial({color:2371652,transparent:!0,opacity:.58,roughness:.9}));Re.position.set(Be,Ae,Fe),s.add(Re);continue}Wa(i,s,Ne,Be,Ae,Fe,Ee)}}S==="gamified"&&Qa(i,s,g,G);const Z=new Je(u,c.domElement);Z.enableDamping=!0,Z.dampingFactor=.07,Z.target.set(0,G*.42,0),Z.minDistance=1.7,Z.maxDistance=8,Z.maxPolarAngle=Math.PI*.82,Z.autoRotate=!0,Z.autoRotateSpeed=S==="gamified"?1:.55,Z.addEventListener("start",()=>{Z.autoRotate=!1});const Pe=new ResizeObserver(()=>{const{width:_,height:F}=n();u.aspect=_/F,u.updateProjectionMatrix(),c.setSize(_,F,!1)});Pe.observe(t);let $e;const _e=()=>{$e=requestAnimationFrame(_e),Z.update(),c.render(s,u)};_e(),me=()=>{cancelAnimationFrame($e),Pe.disconnect(),Z.dispose(),s.traverse(_=>{_.geometry&&_.geometry.dispose(),_.material&&(Array.isArray(_.material)?_.material.forEach(F=>F.dispose()):_.material.dispose())}),c.dispose()}}function Wa(e,t,a,n,o,r,l){const c=S==="gamified"?[4906624,2282478,16436245,16478597,10980346]:[2278750,1483594,6660877,1409085,8843180],s=c[l%c.length],u=new e.MeshStandardMaterial({color:S==="gamified"?16347926:8141549,roughness:.68}),d=new e.Mesh(new e.CylinderGeometry(.07,.058,.07,S==="gamified"?6:16),u);d.position.set(n,o+.035,r),d.castShadow=!0,t.add(d);const p=new e.Mesh(new e.CylinderGeometry(.008,.008,.095,8),new e.MeshStandardMaterial({color:3560212,roughness:.82}));p.position.set(n,o+.105,r),t.add(p);const m=new e.MeshStandardMaterial({color:s,roughness:S==="gamified"?.48:.86,emissive:S==="gamified"?s:0,emissiveIntensity:S==="gamified"?.12:0}),h=S==="gamified"?5:3;for(let g=0;g<h;g++){const z=new e.Mesh(new e.SphereGeometry(.085,12,8),m),P=Math.PI*2/h*g;z.scale.set(1.25,.42,.7),z.position.set(n+Math.cos(P)*.05,o+.15+g%2*.016,r+Math.sin(P)*.045),z.rotation.set(.25,P,-.25),z.castShadow=!0,t.add(z)}}function Qa(e,t,a,n){const o=new e.MeshStandardMaterial({color:16436245,emissive:8736014,emissiveIntensity:.35,roughness:.35,metalness:.35});for(let r=0;r<5;r++){const l=new e.Mesh(new e.CylinderGeometry(.055,.055,.014,18),o);l.rotation.x=Math.PI/2,l.position.set((r-2)*a/5,n+.18+r%2*.08,-.42),t.add(l)}}function Ua(){try{const e=document.createElement("canvas");return!!(window.WebGLRenderingContext&&(e.getContext("webgl2")||e.getContext("webgl")||e.getContext("experimental-webgl")))}catch{return!1}}function Ve(e,t,a,n){const o=e.getContext("2d");if(!o)return;const r=Math.min(window.devicePixelRatio||1,2);e.width=Math.floor(a*r),e.height=Math.floor(n*r),o.setTransform(r,0,0,r,0,0);const l=o.createLinearGradient(0,0,a,n);l.addColorStop(0,S==="gamified"?"#18223a":"#10141d"),l.addColorStop(1,S==="gamified"?"#25345d":"#1f2937"),o.fillStyle=l,o.fillRect(0,0,a,n);const c=[];I.forEach(h=>{for(let g=0;g<h.slots;g++)c.push(h)});const s=34,u=a-s*2,p=(n-68)/t.tiers,m=u/t.slotsPerTier;o.fillStyle="rgba(255,255,255,0.1)",o.beginPath(),o.ellipse(a*.5,n-24,u*.43,16,0,0,Math.PI*2),o.fill(),o.strokeStyle=S==="gamified"?"#7dd3fc":"#64748b",o.lineWidth=6,o.lineCap="round",o.beginPath(),o.moveTo(s+8,32),o.lineTo(s+8,n-45),o.moveTo(a-s-8,32),o.lineTo(a-s-8,n-45),o.stroke();for(let h=0;h<t.tiers;h++){const g=42+h*p;o.fillStyle=S==="gamified"?"#7dd3fc":"#708090",Ke(o,s,g+p*.56,u,9,5),o.fill(),o.fillStyle=S==="gamified"?"#facc15":"#a78bfa",Ke(o,s+u*.12,g+7,u*.76,5,3),o.fill();for(let z=0;z<t.slotsPerTier;z++){const P=h*t.slotsPerTier+z,G=c[P],ne=s+m*(z+.5),N=g+p*.53;o.fillStyle=G?S==="gamified"?"#f97316":"#7c3aed":"rgba(148,163,184,0.35)",o.beginPath(),o.ellipse(ne,N,13,7,0,0,Math.PI*2),o.fill(),G&&qa(o,ne,N,G,P)}}if(S==="gamified"){o.fillStyle="#facc15";for(let h=0;h<5;h++)o.beginPath(),o.arc(a*.26+h*34,28+h%2*9,7,0,Math.PI*2),o.fill()}o.fillStyle="rgba(255,255,255,0.86)",o.font="700 12px Inter, system-ui, sans-serif",o.fillText(`${t.tiers} tiers · ${Math.min(c.length,t.total)}/${t.total} plants`,16,n-16)}function qa(e,t,a,n,o){const r=S==="gamified"?["#4ade80","#22d3ee","#facc15","#fb7185","#a78bfa"]:["#22c55e","#16a34a","#65a30d","#15803d","#86efac"],l=n.emoji==="🍅"?"#ef4444":n.emoji==="🌶️"?"#dc2626":r[o%r.length];e.strokeStyle="#365314",e.lineWidth=2,e.beginPath(),e.moveTo(t,a-5),e.lineTo(t,a-25),e.stroke(),e.fillStyle=l;for(let c=0;c<5;c++){const s=Math.PI*2/5*c;e.save(),e.translate(t+Math.cos(s)*8,a-24+Math.sin(s)*5),e.rotate(s),e.beginPath(),e.ellipse(0,0,9,4,0,0,Math.PI*2),e.fill(),e.restore()}}function Ke(e,t,a,n,o,r){e.beginPath(),e.moveTo(t+r,a),e.lineTo(t+n-r,a),e.quadraticCurveTo(t+n,a,t+n,a+r),e.lineTo(t+n,a+o-r),e.quadraticCurveTo(t+n,a+o,t+n-r,a+o),e.lineTo(t+r,a+o),e.quadraticCurveTo(t,a+o,t,a+o-r),e.lineTo(t,a+r),e.quadraticCurveTo(t,a,t+r,a),e.closePath()}function kt(e){const t=I.length?I:[];e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">GOAL PRIORITY</div>
                <div style="font-size:12px;color:var(--muted);line-height:1.45;margin-bottom:12px;">Choose up to two goals. SeedDown will generate thresholds for this device and crop mix.</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    ${at.map(a=>{const n=A.includes(a.id);return`<button class="goal-priority" data-id="${a.id}"
                            style="padding:11px 8px;border-radius:12px;border:1.5px solid ${n?"var(--accent)":"var(--border)"};background:${n?"var(--accent-l)":"var(--surface2)"};color:${n?"var(--accent)":"var(--text)"};font-weight:900;font-size:12px;cursor:pointer;">
                            ${a.label}
                        </button>`}).join("")}
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:12px;">
                    <div>
                        <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;">AI THRESHOLDS</div>
                        <div style="font-size:12px;color:var(--muted);margin-top:4px;line-height:1.45;">Plants: ${t.map(a=>y(a.name)).join(", ")||"mixed greens"} · Package: ${y(oe(ae()).label)}</div>
                    </div>
                    <button id="generateThresholdsBtn" style="padding:8px 10px;border-radius:999px;border:1px solid var(--accent);background:var(--accent-l);color:var(--accent);font-size:11px;font-weight:900;cursor:pointer;">Generate</button>
                </div>
                <div id="thresholdStatus" style="font-size:12px;color:var(--muted);margin-bottom:10px;line-height:1.45;">
                    ${x?y(x.notes||"Thresholds ready"):"No thresholds generated yet."}
                </div>
                <div id="thresholdGrid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    ${Ka((x==null?void 0:x.thresholds)||{})}
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:10px;">AI ANALYSIS</div>
                ${Ya(t)}
            </section>
        </div>
    `,document.querySelectorAll(".goal-priority").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.id;A.includes(n)?A=A.filter(o=>o!==n):A.length<2?A=[...A,n]:w("warning","Choose up to 2 goals"),x=null,kt(e)})}),document.getElementById("generateThresholdsBtn").addEventListener("click",zt),Ja()}function Va(e){if(!e)return!1;const t=String(e.rackType||e.type||e.id||e.structureType||"").toLowerCase(),a=Number(e.tiers||e.tierCount||0),n=Number(e.slotsPerTier||e.columns||0),o=`${t} ${e.label||""} ${e.description||""}`.toLowerCase();let r=null;return o.includes("wall")||o.includes("panel")||o.includes("grid")?r="wall":o.includes("a-frame")||o.includes("pyramid")||o.includes("slant")?r="a-frame":o.includes("nft")||o.includes("channel")||o.includes("row")?r="nft-channel":o.includes("hanging")||o.includes("column")||o.includes("tower")?r=o.includes("tower")&&a>=5?"5-tier":"hanging":a>=5?r="5-tier":a===4&&n>=5?r="wall":a===4?r="4-tier":a===2?r="2-tier":a===3?r="3-tier":t&&he.some(l=>l.id===t)&&(r=t),!r||b.rackType===r?!1:(b.rackType=r,b.customRack=null,x=null,!0)}function Mt(e=null){const t=fe();if(!t)return!1;const a=te(),n=Number((e==null?void 0:e.total)||(e==null?void 0:e.totalSlots)||(e==null?void 0:e.plantSlots)||0),o=Math.max(t,n);if(a.total>=o&&!b.customRack)return!1;const l=Number((e==null?void 0:e.tiers)||(e==null?void 0:e.tierCount)||0),c=Number((e==null?void 0:e.slotsPerTier)||(e==null?void 0:e.columns)||0),s=l>0?Math.max(1,Math.min(8,Math.round(l))):Math.max(3,Math.min(7,Math.ceil(Math.sqrt(o)))),u=c>0?Math.max(1,Math.min(12,Math.round(c))):Math.max(3,Math.ceil(o/s)),d=Math.max(o,s*u),p=o>24?"wall":s>=5?"tower":"rack";return b.customRack={id:"photo-detected",label:(e==null?void 0:e.label)||(e==null?void 0:e.name)||"Photo-detected Multi Rack",icon:"AI",tiers:s,slotsPerTier:u,total:d,shape:p,desc:"Auto-sized from photo analysis and visible plant slot count"},b.rackType="photo-detected",x=null,!0}function Ka(e={}){const t=oe(ae());return ze().map(({key:a,label:n})=>{const o=t.thresholdKeys.includes(a),r=o?e[a]??"":t.lockedText;return`
        <label style="display:block;opacity:${o?"1":".58"};">
            <span style="display:block;font-size:10px;font-weight:900;color:var(--sub);margin-bottom:4px;text-transform:uppercase;">${n}</span>
            <input class="threshold-input" data-key="${a}" type="${o?"number":"text"}" value="${pn(r)}" placeholder="${o?"generate first":t.lockedText}"
                disabled readonly
                title="Beginner thresholds are AI-managed to prevent unsafe sensor or actuator settings."
                style="width:100%;padding:10px;border:1px solid ${o?"var(--border)":"rgba(148,163,184,.35)"};border-radius:10px;background:${o?"#F8FAFC":"rgba(148,163,184,.1)"};font-size:13px;font-weight:800;color:${o?"var(--text)":"var(--muted)"};outline:none;cursor:not-allowed;">
            <span style="display:block;font-size:9px;color:${o?"var(--muted)":"var(--sub)"};margin-top:4px;line-height:1.3;">${o?"AI managed · locked for beginner safety":"Sensor not included in this package"}</span>
        </label>
    `}).join("")}function ze(){return[{key:"tempMin",label:"Temp min"},{key:"tempMax",label:"Temp max"},{key:"humidityMin",label:"Humid min"},{key:"humidityMax",label:"Humid max"},{key:"soilDryThreshold",label:"Soil dry"},{key:"darkThreshold",label:"Light dark"},{key:"phMin",label:"pH min"},{key:"phMax",label:"pH max"},{key:"ecMin",label:"EC min"},{key:"ecMax",label:"EC max"},{key:"co2MinPpm",label:"CO2 min"},{key:"gasDangerThreshold",label:"Gas limit"},{key:"waterLowCm",label:"Water low"},{key:"wateringDurationSeconds",label:"Water sec"},{key:"fanDurationSeconds",label:"Fan sec"},{key:"sensorIntervalSeconds",label:"Interval sec"}]}function Ya(e=[]){const t=te(),a=ae(),n=oe(a),o=e.length?e.map(d=>d.name).join(", "):"mixed greens",r=A.map(d=>{var p;return((p=at.find(m=>m.id===d))==null?void 0:p.label)||d}).join(", ")||"Beginner Safe",l=ze().filter(d=>!n.thresholdKeys.includes(d.key)).map(d=>d.label),c=!!(x!=null&&x.thresholds),s=(x==null?void 0:x.source)==="ai"?"AI generated":(x==null?void 0:x.source)==="fallback"?"Rule-based fallback":c?"AI managed locked recipe":"Waiting for generation",u=[`Plant profile: ${o}.`,`Structure: ${t.label} with ${t.tiers} tiers and ${t.total} slots.`,`Goal priority: ${r}.`,`Package logic: ${n.label} only enables thresholds for available sensors. Beginner mode locks the values after generation so users cannot accidentally create unsafe pump, fan, buzzer, pH, or sensor settings.`];return l.length?u.push(`Locked sensors: ${l.slice(0,5).join(", ")}${l.length>5?"...":""}.`):u.push("All sensor thresholds are unlocked for this package."),`
        <div style="display:flex;flex-direction:column;gap:10px;">
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;">
                <strong style="font-size:13px;color:var(--text);">${y(s)}</strong>
                <span style="font-size:10px;font-weight:900;color:var(--accent);background:var(--accent-l);padding:5px 8px;border-radius:999px;">${y(n.label)}</span>
            </div>
            <div style="font-size:12px;color:var(--muted);line-height:1.55;">
                ${y((x==null?void 0:x.notes)||"Generate thresholds to see SeedDown’s full reasoning for this field.")}
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;">
                ${u.map(d=>`
                    <div style="display:flex;gap:7px;align-items:flex-start;font-size:11px;color:var(--sub);line-height:1.45;">
                        <span style="color:var(--accent);font-weight:900;">•</span>
                        <span>${y(d)}</span>
                    </div>
                `).join("")}
            </div>
        </div>
    `}function oe(e){return je[e]||je.standard}function ae(){var e;return(f==null?void 0:f.packageLevel)||((e=nt.find(t=>t.serial===E.serial))==null?void 0:e.packageLevel)||"standard"}function St(e={},t=ae()){const a=new Set(oe(t).thresholdKeys);return Object.fromEntries(Object.entries(e).filter(([n])=>a.has(n)))}function Ja(){document.querySelectorAll(".threshold-input").forEach(e=>{e.addEventListener("click",()=>{w("info","Beginner thresholds are locked. Use Generate so AI can keep the device settings safe.")})})}async function Xa(e=null){if(!E.serial.trim())return w("warning","Enter device serial"),null;const t=document.getElementById("registerDeviceBtn")||document.getElementById("bfNext");t&&(t.disabled=!0,t.textContent="Registering...");try{const a=await fetch(`${U}/api/devices/register`,{method:"POST",headers:q(),body:JSON.stringify({serial:E.serial.trim(),wifi_ssid:E.wifiSsid.trim(),wifi_password:E.wifiPassword,accountType:E.accountType,farmId:T.currentFarmId||"farm_001",fieldId:`field_${Date.now()}`})}),n=await a.json();if(!a.ok||!n.ok)throw new Error(n.error||"Device registration failed");return f=n.device,w("success","Device registered"),$(),f}catch(a){return w("error",a.message),null}finally{t&&(t.disabled=!1)}}async function ee(e){try{return await e.json()}catch{return{}}}async function zt(){const e=document.getElementById("generateThresholdsBtn")||document.getElementById("bfNext");e&&(e.disabled=!0,e.textContent="Generating...");const t=(I.length?I:[]).map((a,n)=>({tier:Math.floor(n/(te().slotsPerTier||3))+1,plant_type:a.species||a.name}));try{const a=await fetch(`${U}/api/ai/generate-thresholds`,{method:"POST",headers:q(),body:JSON.stringify({plants:t,goal_priority:A,packageLevel:(f==null?void 0:f.packageLevel)||"standard"})}),n=await a.json();if(!a.ok||!n.ok)throw new Error(n.error||"Threshold generation failed");const o=(f==null?void 0:f.packageLevel)||ae();return x={thresholds:St(n.thresholds||{},o),notes:n.notes||`${oe(o).label} package thresholds generated. Locked sensors require a higher package.`,source:n.source},w("success",n.source==="ai"?"AI thresholds generated":"Fallback thresholds generated"),$(),x}catch(a){return w("error",a.message),null}finally{e&&(e.disabled=!1)}}async function en(){var e;if(Y()){await tn();return}if(M===1){if(!f){(e=document.getElementById("deviceQrInput"))==null||e.click(),w("info","Scan the SeedDown package QR first");return}M=2,$();return}if(M===2){if(!b.name.trim()){w("warning","Enter a field name");return}M=3,$();return}if(M===3){if(!k){w("warning","Add a field photo before generating 3D");return}M=4,$();return}if(M===4){if(!x&&!await zt())return;M=5,$();return}M===5&&await on()}async function tn(){var e;if(M===1){if(!b.name.trim()){w("warning","Enter a commercial farm name");return}M=2,$();return}if(M===2){if(!k){w("warning","Add a full farm photo first");return}if(!v&&!await dt())return;M=3,$();return}if(M===3){if(!L.length){w("warning","Choose at least one commercial goal");return}M=4,$();return}if(M===4){if(!ft()&&!await pt())return;M=5,$();return}if(M===5){if(!gt()){(e=document.getElementById("commercialDeviceQrInput"))==null||e.click(),w("info","Scan and assign all required commercial nodes");return}M=6,$();return}M===6&&await rn()}function an(){if(M===1){Ct();return}M-=1,$()}async function Ce(e){var t;re(),(t=O.destroy)==null||t.call(O),e&&w("info",e);try{(await Et(()=>import("./FarmListPage-BCR7UIrt.js"),__vite__mapDeps([0,1,2]))).render()}catch(a){console.error("[BuildFarm] Direct FarmList fallback failed:",a),window.location.reload()}}function Ct(){Ce("New field creation cancelled")}async function nn(e={}){if(!(f!=null&&f.deviceId))return{synced:!1,reason:"No registered device"};const t=q();f.deviceToken&&!f.isDemoFallback&&(t["x-device-token"]=f.deviceToken);const a=await fetch(`${U}/api/sensors/preferences`,{method:"PUT",headers:t,body:JSON.stringify({deviceId:f.deviceId,fieldId:f.fieldId||null,farmId:f.farmId||T.currentFarmId||null,zoneId:f.zoneId||b.location.trim()||null,packageLevel:f.packageLevel,goalPriority:A,thresholdSource:(x==null?void 0:x.source)||"manual",thresholdNotes:(x==null?void 0:x.notes)||"",...e})}),n=await ee(a);if(!a.ok||n.ok===!1)throw new Error(n.error||"Preference sync failed");return{synced:!0,preferences:n.preferences||n}}async function on(){const e=document.getElementById("bfNext");e&&(e.disabled=!0,e.textContent="Creating...");const t=te(),a=(f==null?void 0:f.fieldId)||`field_${Date.now()}`,n=St((x==null?void 0:x.thresholds)||{},(f==null?void 0:f.packageLevel)||ae()),o={name:b.name.trim(),location:b.location.trim(),description:b.description.trim(),rackType:b.rackType,rackTypeId:b.rackType,rackLabel:te().label,rackConfig:b.customRack?{...b.customRack}:null,targetPlant:I.map(p=>p.name).join(", "),analysisGoal:A.join(","),viewMode:S,photoPreview:(k==null?void 0:k.dataUrl)||null,plants:I,plantSlots:fe(),deviceId:(f==null?void 0:f.deviceId)||"farm_001",serial:(f==null?void 0:f.serial)||E.serial,packageLevel:(f==null?void 0:f.packageLevel)||"standard",goalPriority:A,thresholds:n};let r=null;try{const p=await fetch(`${U}/api/farms/create`,{method:"POST",headers:q(),body:JSON.stringify({...o,fieldId:a,zoneId:b.location.trim()||null,thresholdSource:(x==null?void 0:x.source)||"manual",thresholdNotes:(x==null?void 0:x.notes)||""})}),m=await ee(p);p.ok&&(m!=null&&m.farmId)&&(r=m.farmId)}catch(p){console.warn("[BuildFarm] create field API unavailable:",p.message)}let l={synced:!1};if(f!=null&&f.deviceId)try{l=await nn(n),w("success","Device thresholds synced")}catch(p){console.warn("[BuildFarm] preference sync skipped:",p.message),w("warning",`Field saved, but thresholds not synced: ${p.message}`)}const c=Pt(),s={id:a,backendFarmId:r,name:o.name,location:o.location,description:o.description,zone:b.location.trim()||String.fromCharCode(65+c.length%26),rackTypeId:b.rackType,rackType:t.label,rackLabel:t.label,rackConfig:b.customRack?{...b.customRack}:null,targetPlant:o.targetPlant,analysisGoal:o.analysisGoal,deviceId:(f==null?void 0:f.deviceId)||"farm_001",deviceToken:(f==null?void 0:f.deviceToken)||null,serial:(f==null?void 0:f.serial)||E.serial,packageLevel:(f==null?void 0:f.packageLevel)||"standard",goalPriority:[...A],thresholds:{...n},thresholdSource:(x==null?void 0:x.source)||"manual",thresholdNotes:(x==null?void 0:x.notes)||"",preferenceSynced:!!l.synced,viewMode:S,photoPreview:o.photoPreview,plants:I.map(p=>({...p})),plantSlots:fe(),createdAt:new Date().toISOString()};c.push(s),localStorage.setItem(ke,JSON.stringify(c)),T.newFarm=o,T.currentFarm=s,T.currentFarmId=s.id,T.farmName=s.name,w("success",`"${s.name}" field created`),re();const u={tomato:"🍅",mint:"🌿",basil:"🌿",chili:"🌶️",lettuce:"🥬",spinach:"🌿",carrot:"🥕",cucumber:"🥒",pepper:"🌶️",strawberry:"🍓",default:"🌱"},d=Array(9).fill(null);I.slice(0,9).forEach((p,m)=>{const h=(p.name||"").toLowerCase();d[m]=u[h]||u.default}),fetch(`${U}/api/community/visits/register-farm`,{method:"POST",headers:q(),body:JSON.stringify({farmLayout:d,displayName:s.name,avatar:"🧑‍🌾"})}).catch(()=>{}),setTimeout(()=>Ce(),500)}async function rn(){H();const e=document.getElementById("bfNext");e&&(e.disabled=!0,e.textContent="Launching...");const t=Me||`farm_com_${Date.now()}`,a=v.zones.map(c=>{const s=W.find(p=>p.targetId===c.zone_id),u=j[c.zone_id]||{},d=X(c);return{...c,plantItems:d,plants:d.map(p=>p.name.toLowerCase()),plantCount:d.reduce((p,m)=>p+m.count,0),crop:d.map(p=>`${p.name} x ${p.count}`).join(", "),deviceId:(s==null?void 0:s.deviceId)||null,deviceToken:(s==null?void 0:s.deviceToken)||null,serial:(s==null?void 0:s.serial)||null,packageLevel:(s==null?void 0:s.packageLevel)||c.recommended_type,thresholds:u.thresholds||{},thresholdNotes:u.notes||"",thresholdSource:u.source||"manual"}}),n=W.find(c=>c.targetId==="farm_master")||null,o={name:b.name.trim(),location:b.location.trim(),description:b.description.trim(),farmSize:b.rackType||"medium",accountMode:"commercial",farmId:t,zones:a,commercialDevices:W,farmMaster:n,farmThresholds:(C==null?void 0:C.thresholds)||{},farmThresholdNotes:(C==null?void 0:C.notes)||"",farmThresholdSource:(C==null?void 0:C.source)||"manual",commercialStructure:v,goalPriority:L,targetPlant:a.map(c=>c.crop).join(", "),analysisGoal:L.join(","),photoPreview:(k==null?void 0:k.dataUrl)||null,plants:a.flatMap(c=>X(c).map((s,u)=>({name:s.name,species:String(s.name).toLowerCase().replace(/[^a-z0-9]+/g,"_"),emoji:Te(s.name),zoneId:c.zone_id,zoneName:c.name,tier:u+1,slots:s.count}))),rackType:"commercial-multi-zone",viewMode:"commercial"};try{const c=await fetch(`${U}/api/farms/create`,{method:"POST",headers:q(),body:JSON.stringify(o)}),s=await ee(c);c.ok&&(s!=null&&s.farmId)&&(o.backendFarmId=s.farmId)}catch(c){console.warn("[BuildFarm] commercial farm API unavailable:",c.message)}await ln(t,n),await sn(t,a);const r=Pt(),l={id:t,backendFarmId:o.backendFarmId||null,name:o.name,location:o.location,description:o.description,accountMode:"commercial",farmSize:o.farmSize,zones:a,commercialDevices:W.map(c=>({...c})),farmMaster:n,farmThresholds:o.farmThresholds,farmThresholdNotes:o.farmThresholdNotes,farmThresholdSource:o.farmThresholdSource,commercialStructure:v,goalPriority:[...L],analysisGoal:o.analysisGoal,targetPlant:o.targetPlant,rackTypeId:"commercial-multi-zone",rackType:"Commercial Multi-Zone Farm",rackLabel:`${a.length}-Zone Commercial Layout`,plantSlots:a.length*12,plants:o.plants,photoPreview:o.photoPreview,createdAt:new Date().toISOString()};r.push(l),localStorage.setItem(ke,JSON.stringify(r)),T.currentFarm=l,T.currentFarmId=l.id,T.farmName=l.name,T.mode="commercial",w("success",`"${l.name}" commercial farm launched`),re(),setTimeout(()=>Ce(),500)}async function sn(e,t){for(const a of t){if(!a.deviceId)continue;const n=q();a.deviceToken&&(n["x-device-token"]=a.deviceToken);try{const o=await fetch(`${U}/api/sensors/preferences`,{method:"PUT",headers:n,body:JSON.stringify({deviceId:a.deviceId,farmId:e,zoneId:a.zone_id,packageLevel:a.packageLevel,goalPriority:L,thresholdSource:a.thresholdSource,thresholdNotes:a.thresholdNotes,...a.thresholds})}),r=await ee(o);if(!o.ok||r.ok===!1)throw new Error(r.error||"Preference sync failed")}catch(o){console.warn(`[BuildFarm] commercial preference sync skipped for ${a.zone_id}:`,o.message)}}}async function ln(e,t){if(!(t!=null&&t.deviceId))return;const a=q();t.deviceToken&&(a["x-device-token"]=t.deviceToken);try{const n=await fetch(`${U}/api/sensors/preferences`,{method:"PUT",headers:a,body:JSON.stringify({deviceId:t.deviceId,farmId:e,zoneId:"farm_master",packageLevel:t.packageLevel||"farm_master",goalPriority:L,thresholdSource:(C==null?void 0:C.source)||"manual",thresholdNotes:(C==null?void 0:C.notes)||"",...(C==null?void 0:C.thresholds)||{}})}),o=await ee(n);if(!n.ok||o.ok===!1)throw new Error(o.error||"Farm master preference sync failed")}catch(n){console.warn("[BuildFarm] farm master preference sync skipped:",n.message)}}function Ye(){const e=document.getElementById("manualPlantInput");if(!e)return;const t=e.value.trim();t&&(Tt([dn(t,3,0,"manual")]),e.value="",ge(),w("success",`${t} added`))}function cn(e){const t=new Set;return String(e).split(/[,;\n]+/).map(a=>a.trim()).filter(Boolean).filter(a=>{const n=a.toLowerCase();return t.has(n)?!1:(t.add(n),!0)})}function Tt(e){e.forEach(t=>{const a=It(t),n=I.find(o=>o.species===a.species);n?(n.slots=Math.max(n.slots,a.slots),n.confidence=Math.max(n.confidence||0,a.confidence||0),n.source=a.source||n.source):I.push(a)})}function dn(e,t=3,a=0,n="target"){const o=String(e||"").toLowerCase().trim();return It({name:o.charAt(0).toUpperCase()+o.slice(1),emoji:Te(o),species:o.replace(/\s+/g,"_"),confidence:a,slots:t,source:n})}function Te(e=""){const t=String(e).toLowerCase().replace(/_/g," ");if(de[t])return de[t];const a=Object.keys(de).find(n=>t.includes(n));return a?de[a]:"🌱"}function It(e){const t=e.name||"Plant",a=(e.species||t).toLowerCase().trim().replace(/\s+/g,"_");return{name:t,emoji:e.emoji||Te(a),species:a,confidence:Math.max(0,Math.min(1,Number(e.confidence)||0)),slots:Math.max(1,Math.min(40,Number.parseInt(e.slots,10)||3)),source:e.source||"ai"}}function te(){return b.rackType==="photo-detected"&&b.customRack?b.customRack:he.find(e=>e.id===b.rackType)||he[0]}function fe(){return I.reduce((e,t)=>e+t.slots,0)}function mn(e){var t;return((t=ia.find(a=>a.id===e))==null?void 0:t.label)||e}function Y(){try{const e=localStorage.getItem("seeddown_build_flow");if(e==="beginner")return T.mode="beginner",!1;if(e==="commercial"||localStorage.getItem("seeddown_mode")==="commercial")return T.mode="commercial",!0}catch{}return T.mode==="commercial"}function J(e,t){const a=document.getElementById(e);a&&(a.addEventListener("input",n=>t(n.target.value)),a.addEventListener("focus",()=>{a.style.borderColor="var(--accent)"}),a.addEventListener("blur",()=>{a.style.borderColor="var(--border)"}))}function Pt(){try{return JSON.parse(localStorage.getItem(ke))||[]}catch{return[]}}function re(){me&&(me(),me=null)}function y(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function pn(e){return y(e)}export{gn as render};
