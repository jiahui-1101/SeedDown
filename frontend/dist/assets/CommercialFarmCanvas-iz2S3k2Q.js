import{A as y}from"./index-Bza452zz.js";import*as s from"https://esm.sh/three@0.160.0";import{OrbitControls as F}from"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const H="user_farms",I="seeddown_ai_mascot_enabled",v={"2-tier":{id:"2-tier",label:"2-Tier Starter Rack",tiers:2,slotsPerTier:3,total:6},"3-tier":{id:"3-tier",label:"3-Tier Vertical Rack",tiers:3,slotsPerTier:3,total:9},"4-tier":{id:"4-tier",label:"4-Tier Grow Shelf",tiers:4,slotsPerTier:4,total:16},"5-tier":{id:"5-tier",label:"5-Tier Tower Rack",tiers:5,slotsPerTier:4,total:20},wall:{id:"wall",label:"Wall Panel Grid",tiers:4,slotsPerTier:5,total:20},"a-frame":{id:"a-frame",label:"A-Frame Pyramid",tiers:4,slotsPerTier:4,total:16},"nft-channel":{id:"nft-channel",label:"NFT Channel Rows",tiers:3,slotsPerTier:6,total:18},hanging:{id:"hanging",label:"Hanging Column Farm",tiers:5,slotsPerTier:3,total:15}},k={lettuce:{color:6927180,alt:9228129,leaf:.082,spread:.095},cabbage:{color:7448635,alt:10733911,leaf:.09,spread:.1},kale:{color:3108670,alt:5213518,leaf:.088,spread:.105},spinach:{color:3046706,alt:4431943,leaf:.072,spread:.088},basil:{color:2067020,alt:3323495,leaf:.064,spread:.078},mint:{color:3450963,alt:7327605,leaf:.062,spread:.078},tomato:{color:3116870,alt:15680580,leaf:.07,spread:.086,fruit:15680580},chili:{color:2522941,alt:14427686,leaf:.066,spread:.082,fruit:14427686},pepper:{color:2522941,alt:14427686,leaf:.066,spread:.082,fruit:14427686},cucumber:{color:2325052,alt:5284955,leaf:.078,spread:.105,vine:!0},strawberry:{color:4165449,alt:16478597,leaf:.066,spread:.082,fruit:16478597},eggplant:{color:3112783,alt:8141549,leaf:.072,spread:.088,fruit:8141549},plant:{color:6660877,alt:8843180,leaf:.072,spread:.09}},ht={canvas:null,parent:null,renderer:null,scene:null,camera:null,controls:null,farmGroup:null,particles:null,raycaster:null,pointer:null,interactiveRoots:[],hoverRoot:null,selectedRoot:null,detailPanel:null,tooltip:null,fullscreenButton:null,zoomControls:null,mascotGroup:null,mascotTarget:null,mascotHome:null,mascotBaseY:.58,mascotWalkPhase:0,mascotWalking:!1,mascotVisible:!0,mascotVisibilityHandler:null,mascotBubble:null,mascotSelectedContext:null,originalParent:null,originalNextSibling:null,resizeHandler:null,fullscreenHandler:null,rafId:null,clock:null,frame:0,farm:null,rack:v["3-tier"],slotPlants:[],sensorSnapshot:{},init(t,e=null){this.destroy(),this.installHandlers(),it(),this.canvas=document.getElementById(t),this.canvas&&(this.parent=this.canvas.parentElement,this.parent&&(this.farm=e||A(),this.rack=W(this.farm),this.slotPlants=_(this.farm,this.rack),this.sensorSnapshot=G(),this.mascotVisible=localStorage.getItem(I)!=="false",this.clock=new s.Clock,this.prepareHost(),this.initScene(),this.buildFacility(),this.createOverlays(),this.bindEvents(),this.resize(),this.animate()))},prepareHost(){this.parent.classList.add("commercial-farm-host"),this.canvas.classList.add("commercial-farm-canvas"),this.parent.querySelectorAll(".cf-overlay, .cf-tooltip, .cf-expand-btn, .cf-zoom-controls").forEach(t=>t.remove())},initScene(){this.scene=new s.Scene,this.scene.background=new s.Color(16317175),this.scene.fog=new s.Fog(16317175,22,58),this.camera=new s.PerspectiveCamera(58,1,.1,120),this.camera.position.set(5.5,4.6,8.5),this.camera.lookAt(0,1.8,0),this.renderer=new s.WebGLRenderer({canvas:this.canvas,antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=s.PCFSoftShadowMap,this.renderer.outputColorSpace=s.SRGBColorSpace,this.renderer.toneMapping=s.ACESFilmicToneMapping,this.renderer.toneMappingExposure=1.08,this.controls=new F(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.07,this.controls.enablePan=!0,this.controls.enableZoom=!1,this.controls.maxPolarAngle=Math.PI*.48,this.controls.target.set(0,1.55,0),this.setCameraFrame(!1),this.raycaster=new s.Raycaster,this.pointer=new s.Vector2,this.farmGroup=new s.Group,this.scene.add(this.farmGroup),this.addLighting()},addLighting(){this.scene.add(new s.AmbientLight(14479072,.55));const t=new s.DirectionalLight(16775399,2.2);t.position.set(10,18,9),t.castShadow=!0,t.shadow.mapSize.set(2048,2048),t.shadow.camera.left=-12,t.shadow.camera.right=12,t.shadow.camera.top=12,t.shadow.camera.bottom=-12,t.shadow.bias=-4e-4,this.scene.add(t);const e=new s.DirectionalLight(12244991,.35);e.position.set(-7,10,-6),this.scene.add(e);const o=new s.HemisphereLight(11657727,4928541,.28);this.scene.add(o);const a=new s.PointLight(8702998,1.25,12);a.position.set(0,3.1,0),this.scene.add(a)},buildFacility(){this.addFloor(),this.addGreenhouseFrame();const t=this.createTowerLayout();t.forEach((e,o)=>this.addTower(e,o)),this.addIrrigationPipes(t),this.addDigitalTwinDevices(t),this.addNutrientStation(),this.addControlPanel(),this.addAIMascot(),this.addVentilationFans(),this.addWaterDrips(t),this.addParticles()},addFloor(){const t=new s.Mesh(new s.PlaneGeometry(80,60),new s.MeshStandardMaterial({color:15265510,roughness:.86,metalness:.02}));t.rotation.x=-Math.PI/2,t.receiveShadow=!0,this.scene.add(t);const e=new s.Mesh(new s.PlaneGeometry(5.2,56),new s.MeshStandardMaterial({color:14542812,roughness:.78}));e.rotation.x=-Math.PI/2,e.position.y=.006,e.receiveShadow=!0,this.scene.add(e);const o=new s.LineBasicMaterial({color:11057322,transparent:!0,opacity:.48});for(let a=-38;a<=38;a+=2)this.scene.add(D([a,.014,-28],[a,.014,28],o));for(let a=-28;a<=28;a+=2)this.scene.add(D([-38,.016,a],[38,.016,a],o))},addGreenhouseFrame(){const t=new s.MeshStandardMaterial({color:10135456,metalness:.45,roughness:.32}),e=new s.MeshPhysicalMaterial({color:13625816,transparent:!0,opacity:.2,roughness:.04,side:s.DoubleSide}),o=17.6,a=13.6,r=4.3,n=6.2;for(let i=-a/2;i<=a/2+.001;i+=2.7){[-1,1].forEach(d=>{const c=new s.Mesh(new s.CylinderGeometry(.035,.035,r,10),t);c.position.set(d*o/2,r/2,i),c.castShadow=!0,this.scene.add(c)});const u=Math.sqrt((o/2)**2+(n-r)**2),h=Math.atan2(n-r,o/2);[-1,1].forEach(d=>{const c=new s.Mesh(new s.CylinderGeometry(.028,.028,u,8),t);c.position.set(d*o/4,r+(n-r)/2,i),c.rotation.z=d*(Math.PI/2-h),this.scene.add(c)})}const l=new s.Mesh(new s.CylinderGeometry(.032,.032,a,10),t);l.rotation.x=Math.PI/2,l.position.set(0,n,0),this.scene.add(l);const m=new s.Mesh(new s.PlaneGeometry(o,r),e);m.position.set(0,r/2,-a/2),this.scene.add(m),[-1,1].forEach(i=>{const u=new s.Mesh(new s.PlaneGeometry(a,r),e);u.rotation.y=Math.PI/2,u.position.set(i*o/2,r/2,0),this.scene.add(u)})},createTowerLayout(){const t=C(this.farm);if(t.length){const l=Math.ceil(Math.sqrt(t.length)),m=Math.ceil(t.length/l),i=2.65,u=3.1,h=-((l-1)*i)/2,d=-((m-1)*u)/2;return t.map((c,p)=>({x:h+p%l*i,z:d+Math.floor(p/l)*u,zoneIndex:p,row:Math.floor(p/l),col:p%l,zoneId:c.zone_id||c.id||`zone_${String.fromCharCode(65+p)}`,label:c.name||`Zone ${String.fromCharCode(65+p)}`,crop:c.crop||(Array.isArray(c.plants)?c.plants.join(", "):"")||"Mixed crops"}))}const e=Math.max(6,Math.min(10,Math.ceil(this.rack.total/2))),o=[],a=Math.ceil(e/2),r=-((a-1)*2.15)/2,n=[-2.35,2.35];for(let l=0;l<2;l++)for(let m=0;m<a&&!(o.length>=e);m++)o.push({x:r+m*2.15,z:n[l],zoneIndex:o.length,row:l,col:m});return o},addTower(t,e){const o=String.fromCharCode(65+e),a=new s.Group;a.position.set(t.x,0,t.z),a.userData={isTower:!0,id:t.zoneId||`zone-${o}`,label:t.label||`Zone ${o}`,crop:t.crop||"Mixed crops",zoneIndex:e,plants:[],status:"empty"},this.addZoneFootprint(a,t,e);const r=new s.MeshStandardMaterial({color:15330800,roughness:.34,metalness:.18}),n=new s.MeshStandardMaterial({color:2503725,roughness:.5,metalness:.4}),l=new s.Mesh(new s.CylinderGeometry(.095,.12,3.2,22),r);l.position.y=1.67,l.castShadow=!0,a.add(l);const m=new s.Mesh(new s.CylinderGeometry(.48,.6,.15,28),n);m.position.y=.075,m.castShadow=!0,a.add(m);const i=this.createTowerLayout().length,u=this.slotPlants.map((f,b)=>({plant:f,index:b})).filter(f=>f.plant&&et(f.plant,f.index,this.rack,e,i,t)),h=8,d=4;let c=0;for(let f=0;f<h;f++){const b=.38+f*.36,x=new s.Mesh(new s.TorusGeometry(.42,.012,8,48),new s.MeshStandardMaterial({color:5398874,roughness:.48,metalness:.35}));x.rotation.x=Math.PI/2,x.position.y=b,a.add(x);for(let z=0;z<d;z++){const N=z*Math.PI/2+(f%2?Math.PI/4:0),M=u[c]||null;this.addPod(a,N,b,(M==null?void 0:M.plant)||null,(M==null?void 0:M.index)??e*100+c,f,z),M!=null&&M.plant&&(a.userData.plants.push(M.plant),c+=1)}}a.userData.status=j(a.userData.plants),this.addZoneStatusStrip(a,a.userData.status);const p=this.createTextSprite(String(t.label||`ZONE ${o}`).toUpperCase(),{bg:"rgba(255,255,255,.92)",fg:"#14532d",border:"#315d3e",font:"900 30px Inter, system-ui, sans-serif"});p.position.set(0,3.63,0),p.scale.set(.68,.18,1),a.add(p),this.farmGroup.add(a),this.interactiveRoots.push(a)},addZoneFootprint(t,e,o){var c,p;const a=String.fromCharCode(65+o),r=new s.MeshStandardMaterial({color:15989492,roughness:.72,metalness:.02}),n=new s.MeshStandardMaterial({color:2062914,roughness:.48,metalness:.18}),l=new s.MeshStandardMaterial({color:12044475,roughness:.82,metalness:.02,transparent:!0,opacity:.55}),m=new s.Mesh(new s.BoxGeometry(1.92,.035,2.04),r);m.position.y=.022,m.receiveShadow=!0,t.add(m);const i=new s.Mesh(new s.BoxGeometry(2.08,.004,2.2),l);i.position.y=.002,i.receiveShadow=!0,t.add(i),[{x:0,z:1.04,sx:1.92,sz:.035},{x:0,z:-1.04,sx:1.92,sz:.035},{x:.96,z:0,sx:.035,sz:2.04},{x:-.96,z:0,sx:.035,sz:2.04}].forEach(f=>{const b=new s.Mesh(new s.BoxGeometry(f.sx,.035,f.sz),n);b.position.set(f.x,.06,f.z),b.castShadow=!0,t.add(b)});const h=this.createTextSprite(`ZONE ${a}`,{bg:"rgba(20,83,45,.92)",fg:"#f7fee7",font:"900 24px Inter, system-ui, sans-serif"});h.position.set(-.62,.14,.98),h.scale.set(.26,.09,1),t.add(h);const d=(p=String(e.crop||((c=t.userData)==null?void 0:c.crop)||"").split(",")[0])==null?void 0:p.trim();if(d){const f=this.createTextSprite(d.toUpperCase().slice(0,18),{bg:"rgba(255,255,255,.9)",fg:"#166534",font:"900 22px Inter, system-ui, sans-serif"});f.position.set(.38,.14,.98),f.scale.set(.34,.085,1),t.add(f)}},addZoneStatusStrip(t,e){const o=P(e||"healthy"),a=new s.MeshStandardMaterial({color:o,emissive:o,emissiveIntensity:e==="empty"?.08:.34,roughness:.34,metalness:.1}),r=new s.Mesh(new s.BoxGeometry(1.62,.028,.055),a);r.position.set(0,.105,-1.05),r.castShadow=!0,t.add(r)},addPod(t,e,o,a,r,n,l){const i=Math.cos(e)*.48,u=Math.sin(e)*.48,h=(a==null?void 0:a.status)||"empty",d=P(h),c={index:r,tier:t.userData.zoneIndex+1,slot:n*4+l+1,plant:a,tower:t},p=new s.MeshStandardMaterial({color:a?16317180:2437676,roughness:.52,metalness:a?.08:.18}),f=new s.Mesh(new s.CylinderGeometry(.155,.12,.11,20),p);f.position.set(i,o,u),f.rotation.z=Math.PI/2,f.rotation.y=-e,f.castShadow=!0,f.userData.slot=c,f.userData.root=t,t.add(f);const b=new s.Mesh(new s.SphereGeometry(.045,12,8),new s.MeshStandardMaterial({color:d,emissive:d,emissiveIntensity:a?.38:.06}));b.position.set(i*1.1,o+.085,u*1.1),b.userData.slot=c,b.userData.root=t,t.add(b),a&&this.addPlantCluster(t,i*1.1,o+.12,u*1.1,a)},addDigitalTwinDevices(t){[{key:"co2",label:"CO2 Sensor",value:`${Number(this.sensorSnapshot.co2Ppm||800)} ppm`,type:"sensor",kind:"co2",x:-7.25,y:2.35,z:-5.95,color:3718648},{key:"reservoir",label:"Water Reservoir",value:`${Number(this.sensorSnapshot.waterDistanceCm||0)} cm`,type:"sensor",kind:"reservoir",x:-6.8,y:.55,z:5.35,color:959977},{key:"gas",label:"MQ-2 Gas Sensor",value:`${Number(this.sensorSnapshot.gasRaw||0)} raw`,type:"sensor",kind:"gas",x:-5.25,y:.72,z:5.55,color:P(Number(this.sensorSnapshot.gasRaw||0)>2500?"danger":"healthy")},{key:"power",label:"Power Meter",value:`${Number(this.sensorSnapshot.energyKwh||5.1).toFixed(1)} kWh`,type:"sensor",kind:"power",x:.9,y:1.45,z:5.42,color:16096779},{key:"main_fan",label:"Main Ventilation Fan",value:Number(this.sensorSnapshot.temperature||25)>30?"active":"standby",type:"output",kind:"fan",x:7.55,y:2.85,z:-5.9,color:6583435},{key:"emergency_buzzer",label:"Emergency Buzzer",value:Number(this.sensorSnapshot.gasRaw||0)>2500?"alert":"ready",type:"output",kind:"buzzer",x:1.72,y:1.34,z:5.52,color:Number(this.sensorSnapshot.gasRaw||0)>2500?15680580:8702998}].forEach(a=>this.addDeviceMarker(a));const o=[{key:"dht11",label:"DHT11 Temp/Humid",type:"sensor",kind:"dht",color:2278750,dx:-.66,y:1.72,dz:-.32},{key:"soil",label:"Soil Moisture",type:"sensor",kind:"soil",color:9132587,dx:.36,y:.29,dz:.53},{key:"ldr",label:"LDR Light",type:"sensor",kind:"ldr",color:16436245,dx:.32,y:3.38,dz:-.42},{key:"ph",label:"pH Sensor",type:"sensor",kind:"probe",color:11032055,dx:-.42,y:.72,dz:.66},{key:"ec",label:"EC Sensor",type:"sensor",kind:"probe",color:1357990,dx:-.18,y:.68,dz:.74},{key:"flow",label:"YF-S201 Flow",type:"sensor",kind:"flow",color:3718648,dx:.58,y:.58,dz:.42},{key:"pump",label:"Water Pump",type:"output",kind:"pump",color:959977,dx:.82,y:.22,dz:.78},{key:"zone_fan",label:"Zone Fan",type:"output",kind:"fan",color:6583435,dx:-.9,y:2.18,dz:.12},{key:"active_buzzer",label:"Active Buzzer",type:"output",kind:"buzzer",color:16347926,dx:.78,y:1.78,dz:-.58},{key:"camera",label:"Camera",type:"sensor",kind:"camera",color:1120295,dx:-.72,y:3.08,dz:.68}];t.forEach((a,r)=>{var m,i;const n=a.zoneId||((m=a.userData)==null?void 0:m.id)||`zone_${String.fromCharCode(65+r)}`,l=a.label||((i=a.userData)==null?void 0:i.label)||`Zone ${String.fromCharCode(65+r)}`;o.forEach(u=>{this.addDeviceMarker({...u,scope:"zone",zoneId:n,zoneLabel:l,value:q(u.key,this.sensorSnapshot),x:a.x+u.dx,y:u.y,z:a.z+u.dz,compact:!0})})})},addDeviceMarker(t){const e=new s.Group;if(e.position.set(t.x,t.y,t.z),e.userData={isDevice:!0,label:t.label,key:t.key,type:t.type,scope:t.scope||"farm",zoneId:t.zoneId||null,zoneLabel:t.zoneLabel||null,value:t.value||"--",status:X(t)},this.addDeviceShape(e,t),e.traverse(a=>{(a.isMesh||a.isSprite)&&(a.userData.root=e)}),!t.compact||["camera","pump","zone_fan"].includes(t.key)){const a=t.compact?K(t.key):t.label.replace(/\s+/g,`
`),r=this.createTextSprite(a,{bg:"rgba(255,255,255,.92)",fg:"#0f172a",font:"900 24px Inter, system-ui, sans-serif"});r.position.set(0,t.compact?.17:.24,0),r.scale.set(t.compact?.2:.34,t.compact?.08:.13,1),e.add(r)}else{const a=new s.Mesh(new s.TorusGeometry(.11,.006,8,22),new s.MeshStandardMaterial({color:t.color,emissive:t.color,emissiveIntensity:.18,roughness:.3,metalness:.2}));a.rotation.x=Math.PI/2,a.position.y=.02,e.add(a)}this.scene.add(e),this.interactiveRoots.push(e)},addDeviceShape(t,e){const o=new s.MeshStandardMaterial({color:e.color,emissive:e.color,emissiveIntensity:e.type==="output"?.24:.1,roughness:.42,metalness:.16}),a=new s.MeshStandardMaterial({color:1120295,roughness:.48,metalness:.36}),r=new s.MeshStandardMaterial({color:16317180,roughness:.52,metalness:.04}),n=new s.MeshStandardMaterial({color:9741240,roughness:.28,metalness:.72}),l=new s.MeshStandardMaterial({color:132631,roughness:.62,metalness:.08}),m=new s.MeshStandardMaterial({color:6809849,emissive:561586,emissiveIntensity:.18,roughness:.22,metalness:.04,transparent:!0,opacity:.74}),i=h=>(h.castShadow=!0,t.add(h),h),u=(h,d,c,p=e.color)=>{const f=i(new s.Mesh(new s.SphereGeometry(e.compact?.012:.018,10,8),new s.MeshStandardMaterial({color:p,emissive:p,emissiveIntensity:.7,roughness:.24})));return f.position.set(h,d,c),f};if(e.kind==="fan"){const h=e.scope==="zone"?.13:.24;i(new s.Mesh(new s.TorusGeometry(h,.014,10,42),a)),i(new s.Mesh(new s.TorusGeometry(h*.62,.006,8,34),n));const d=i(new s.Mesh(new s.CylinderGeometry(h*.19,h*.19,.035,18),l));d.rotation.x=Math.PI/2;for(let c=0;c<4;c++){const p=i(new s.Mesh(new s.BoxGeometry(h*1.46,h*.17,.012),o));p.position.x=h*.22,p.rotation.z=c*Math.PI/4,p.userData.isFanBlade=!0}for(let c=0;c<4;c++){const p=i(new s.Mesh(new s.BoxGeometry(h*1.92,.006,.01),n));p.rotation.z=c*Math.PI/4}return}if(e.kind==="buzzer"){const h=i(new s.Mesh(new s.CylinderGeometry(.11,.12,.035,22),l));h.position.y=-.025;const d=i(new s.Mesh(new s.SphereGeometry(.095,22,10),o));d.scale.y=.58,d.position.y=.045;const c=i(new s.Mesh(new s.TorusGeometry(.092,.006,8,28),n));c.rotation.x=Math.PI/2,c.position.y=.028;return}if(e.kind==="camera"){const h=i(new s.Mesh(new s.BoxGeometry(.2,.12,.13),l));h.rotation.y=-.35;const d=i(new s.Mesh(new s.BoxGeometry(.14,.075,.012),a));d.position.set(.045,.002,.071),d.rotation.y=-.35;const c=i(new s.Mesh(new s.CylinderGeometry(.038,.038,.048,18),n));c.rotation.x=Math.PI/2,c.position.set(.045,0,.075);const p=i(new s.Mesh(new s.CylinderGeometry(.024,.024,.052,18),m));p.rotation.x=Math.PI/2,p.position.set(.045,0,.104);const f=i(new s.Mesh(new s.CylinderGeometry(.012,.012,.24,8),n));f.position.y=-.15,u(-.045,-.036,.081,2278750);return}if(e.kind==="soil"){const h=i(new s.Mesh(new s.BoxGeometry(.13,.06,.07),r));h.position.y=.025,i(new s.Mesh(new s.BoxGeometry(.052,.024,.012),l)).position.set(0,.035,.041),[-.035,.035].forEach(c=>{i(new s.Mesh(new s.CylinderGeometry(.005,.006,.24,8),n)).position.set(c,-.12,0)}),u(.048,.04,.042,2278750);return}if(e.kind==="probe"){const h=i(new s.Mesh(new s.CylinderGeometry(.034,.038,.18,14),o));h.rotation.z=.35,h.position.y=.035;const d=i(new s.Mesh(new s.CylinderGeometry(.04,.04,.025,14),l));d.rotation.z=.35,d.position.y=-.055;const c=i(new s.Mesh(new s.CylinderGeometry(.007,.01,.28,10),n));c.position.y=-.22,c.rotation.z=.35;const p=i(new s.Mesh(new s.TorusGeometry(.085,.004,6,24),l));p.rotation.set(Math.PI/2,.35,0),p.position.set(-.035,.15,0);return}if(e.kind==="flow"){const h=i(new s.Mesh(new s.CylinderGeometry(.024,.024,.42,14),n));h.rotation.z=Math.PI/2;const d=i(new s.Mesh(new s.CylinderGeometry(.082,.082,.05,24),r));d.rotation.x=Math.PI/2;const c=i(new s.Mesh(new s.BoxGeometry(.105,.01,.014),o));c.userData.isFanBlade=!0,u(.055,.055,.03,440020);return}if(e.kind==="pump"){const h=i(new s.Mesh(new s.CylinderGeometry(.075,.075,.18,20),o));h.rotation.z=Math.PI/2;const d=i(new s.Mesh(new s.CylinderGeometry(.062,.062,.06,18),n));d.rotation.z=Math.PI/2,d.position.x=.105;const c=i(new s.Mesh(new s.CylinderGeometry(.019,.019,.2,10),n));c.rotation.z=Math.PI/2,c.position.x=.19;const p=i(new s.Mesh(new s.CylinderGeometry(.018,.018,.15,10),l));p.rotation.x=Math.PI/2,p.position.set(-.03,-.078,0);const f=i(new s.Mesh(new s.BoxGeometry(.22,.024,.08),l));f.position.y=-.086;return}if(e.kind==="reservoir"){const h=i(new s.Mesh(new s.CylinderGeometry(.18,.18,.42,28),o));h.position.y=.12;const d=i(new s.Mesh(new s.CylinderGeometry(.19,.18,.045,28),l));d.position.y=.35,i(new s.Mesh(new s.BoxGeometry(.022,.28,.012),m)).position.set(.182,.12,.02);const p=i(new s.Mesh(new s.BoxGeometry(.18,.055,.12),a));p.position.y=.38,u(.064,.392,.064,2278750);return}if(e.kind==="power"){i(new s.Mesh(new s.BoxGeometry(.24,.18,.045),a));const h=i(new s.Mesh(new s.BoxGeometry(.16,.09,.012),o));h.position.z=.03,[-.058,0,.058].forEach((d,c)=>{u(d,-.064,.034,c===0?2278750:440020)});return}if(e.kind==="gas"||e.kind==="dht"||e.kind==="co2"){i(new s.Mesh(new s.BoxGeometry(.17,.135,.075),e.kind==="dht"?r:o));for(let h=0;h<3;h++)i(new s.Mesh(new s.BoxGeometry(.1,.007,.011),a)).position.set(-.008,-.038+h*.032,.045);if(e.kind==="co2"||e.kind==="gas"){const h=i(new s.Mesh(new s.CylinderGeometry(.036,.036,.015,18),l));h.rotation.x=Math.PI/2,h.position.set(.055,.038,.046)}u(-.062,.044,.047,e.kind==="gas"?16096779:2278750);return}if(e.kind==="ldr"){const h=i(new s.Mesh(new s.BoxGeometry(.13,.055,.08),r));h.position.y=-.01;const d=i(new s.Mesh(new s.CylinderGeometry(.052,.052,.02,24),o));d.rotation.x=Math.PI/2,d.position.z=.045;const c=i(new s.Mesh(new s.SphereGeometry(.038,14,8),m));c.scale.y=.42,c.position.set(0,0,.058);return}i(new s.Mesh(e.compact?new s.SphereGeometry(.07,12,8):new s.BoxGeometry(.22,.18,.14),o))},addPlantCluster(t,e,o,a,r){const n=Q(r),l=new s.MeshStandardMaterial({color:3100976,roughness:.7}),m=new s.MeshStandardMaterial({color:n.color,roughness:.72,side:s.DoubleSide}),i=new s.MeshStandardMaterial({color:n.alt,roughness:.72,side:s.DoubleSide}),u=new s.Mesh(new s.CylinderGeometry(.008,.01,.15,6),l);u.position.set(e,o+.055,a),t.add(u);for(let h=0;h<7;h++){const d=Math.PI*2/7*h,c=n.spread+Math.random()*.025,p=new s.Mesh(new s.SphereGeometry(n.leaf,8,5),h%2?m:i);p.scale.set(1.4,.36,.82),p.position.set(e+Math.cos(d)*c,o+.12+h%3*.012,a+Math.sin(d)*c),p.rotation.set(-.45+Math.random()*.18,d,.18),p.castShadow=!0,t.add(p)}if(n.fruit)for(let h=0;h<2;h++){const d=Math.PI*h+.55,c=new s.Mesh(new s.SphereGeometry(.032,10,8),new s.MeshStandardMaterial({color:n.fruit,roughness:.55}));c.position.set(e+Math.cos(d)*.07,o+.105,a+Math.sin(d)*.07),t.add(c)}if(n.vine){const h=new s.Mesh(new s.CylinderGeometry(.006,.004,.34,5),new s.MeshStandardMaterial({color:n.color,roughness:.72}));h.position.set(e+.06,o-.02,a+.05),h.rotation.z=.25,t.add(h)}},addIrrigationPipes(t){const e=new s.MeshStandardMaterial({color:5605546,roughness:.28,metalness:.6}),o=new s.MeshStandardMaterial({color:9358054,roughness:.25,metalness:.55});[...new Set(t.map(r=>r.z))].forEach(r=>{const n=t.filter(u=>u.z===r),l=Math.min(...n.map(u=>u.x))-.8,m=Math.max(...n.map(u=>u.x))+.8,i=new s.Mesh(new s.CylinderGeometry(.035,.035,m-l,10),e);i.rotation.z=Math.PI/2,i.position.set((l+m)/2,3.35,r+.25),this.scene.add(i)}),t.forEach(r=>{const n=new s.Mesh(new s.CylinderGeometry(.02,.02,2.75,8),e);n.position.set(r.x+.28,1.9,r.z+.25),this.scene.add(n);const l=new s.Mesh(new s.SphereGeometry(.055,10,8),o);l.position.set(r.x+.28,3.28,r.z+.25),this.scene.add(l)})},addNutrientStation(){const t=new s.MeshStandardMaterial({color:2780750,roughness:.35,metalness:.15}),e=new s.MeshStandardMaterial({color:2054718,roughness:.4,metalness:.2});["N","P","K","pH"].forEach((a,r)=>{const n=-3+r*2,l=new s.Group;l.userData={isTank:!0,label:a,status:r===3&&J(this.sensorSnapshot)?"warning":"healthy"};const m=new s.Mesh(new s.CylinderGeometry(.42,.42,1.05,18),t);m.position.set(n,.58,-5.75),m.castShadow=!0,l.add(m);const i=new s.Mesh(new s.CylinderGeometry(.45,.42,.07,18),e);i.position.set(n,1.14,-5.75),l.add(i);const u=this.createTextSprite(a,{bg:"rgba(255,255,255,.92)",fg:"#0f172a",font:"900 34px Inter, system-ui, sans-serif"});u.position.set(n,.58,-5.28),u.scale.set(.22,.1,1),l.add(u),this.scene.add(l),this.interactiveRoots.push(l)})},addControlPanel(){const t=new s.MeshStandardMaterial({color:5593943,roughness:.5,metalness:.3}),e=new s.Mesh(new s.BoxGeometry(1.7,.08,.65),t);e.position.set(0,.86,5.75),e.castShadow=!0,this.scene.add(e);const o=new s.MeshStandardMaterial({color:464909,emissive:2062914,emissiveIntensity:.75,roughness:.12,metalness:.42}),a=new s.Mesh(new s.BoxGeometry(.95,.56,.04),o);a.position.set(0,1.38,5.45),a.castShadow=!0,this.scene.add(a);const r=this.createTextSprite("CONTROL",{bg:"rgba(9,18,13,.86)",fg:"#a3e635",font:"900 26px Inter, system-ui, sans-serif"});r.position.set(0,1.82,5.4),r.scale.set(.42,.13,1),this.scene.add(r)},addAIMascot(){const t=new s.Group;this.mascotHome=new s.Vector3(4.35,.58,4.7),this.mascotTarget=this.mascotHome.clone(),this.mascotBaseY=this.mascotHome.y,this.mascotWalkPhase=0,this.mascotWalking=!1,t.position.copy(this.mascotHome),t.userData.isMascot=!0;const e=new s.Mesh(new s.CircleGeometry(.38,32),new s.MeshBasicMaterial({color:988970,transparent:!0,opacity:.16,depthWrite:!1}));e.rotation.x=-Math.PI/2,e.position.y=-.31,t.add(e);const o=new s.MeshStandardMaterial({color:16007006,roughness:.38,metalness:.02,emissive:8330525,emissiveIntensity:.08}),a=new s.Mesh(new s.SphereGeometry(.31,42,32),o);a.scale.set(1.08,.95,1.02),a.castShadow=!0,t.add(a);const r=new s.Mesh(new s.SphereGeometry(.2,28,18),new s.MeshStandardMaterial({color:16757642,roughness:.48,metalness:0}));r.scale.set(1.1,.55,.16),r.position.set(0,-.12,.27),t.add(r);const n=new s.MeshStandardMaterial({color:1483594,roughness:.44,metalness:.02}),l=new s.MeshStandardMaterial({color:8702998,roughness:.5});[-.18,0,.18].forEach((d,c)=>{const p=new s.Mesh(new s.CylinderGeometry(.018,.024,.23,10),l);p.position.set(d*.42,.29,0),p.rotation.z=(c-1)*.36,t.add(p);const f=new s.Mesh(new s.SphereGeometry(.105,20,14),n);f.scale.set(1.7,.42,.78),f.position.set(d,.45+Math.abs(c-1)*.02,c===1?.01:.035),f.rotation.z=(c-1)*.5,f.rotation.x=.22,f.castShadow=!0,t.add(f)});const m=new s.MeshStandardMaterial({color:2625555,roughness:.28});[-.1,.1].forEach(d=>{const c=new s.Mesh(new s.SphereGeometry(.034,16,12),m);c.position.set(d,.05,.295),t.add(c)});const i=new s.MeshStandardMaterial({color:16747173,roughness:.45,transparent:!0,opacity:.92});[-.17,.17].forEach(d=>{const c=new s.Mesh(new s.SphereGeometry(.038,16,10),i);c.scale.set(1.3,.72,.22),c.position.set(d,-.03,.302),t.add(c)});const u=[new s.Vector3(-.055,-.01,.318),new s.Vector3(-.018,-.035,.322),new s.Vector3(.018,-.035,.322),new s.Vector3(.055,-.01,.318)],h=new s.Line(new s.BufferGeometry().setFromPoints(u),new s.LineBasicMaterial({color:2822164,linewidth:2}));t.add(h),this.mascotGroup=t,this.scene.add(t)},addVentilationFans(){const t=new s.MeshStandardMaterial({color:2042167,roughness:.36,metalness:.55});[-7.3,7.3].forEach(e=>{const o=new s.Group;o.position.set(e,2.8,-5.9),o.userData.isFan=!0;const a=new s.Mesh(new s.TorusGeometry(.34,.025,8,32),t);o.add(a);for(let r=0;r<4;r++){const n=new s.Mesh(new s.BoxGeometry(.48,.045,.018),t);n.rotation.z=r*Math.PI/4,n.userData.isFanBlade=!0,o.add(n)}this.scene.add(o)})},addWaterDrips(t){const e=new s.MeshStandardMaterial({color:3718648,emissive:3718648,emissiveIntensity:.5,transparent:!0,opacity:.85});t.forEach((o,a)=>{if(a%2)return;const r=new s.Mesh(new s.SphereGeometry(.025,8,6),e.clone());r.position.set(o.x+.25,2.9,o.z+.28),r.userData.isDrip=!0,r.userData.baseY=r.position.y,this.scene.add(r)})},addParticles(){const e=new Float32Array(1080),o=new Float32Array(360*3);for(let n=0;n<360;n++)e[n*3]=(Math.random()-.5)*15,e[n*3+1]=Math.random()*4.4+.7,e[n*3+2]=(Math.random()-.5)*11,o[n*3]=(Math.random()-.5)*.002,o[n*3+1]=(Math.random()-.5)*.001,o[n*3+2]=(Math.random()-.5)*.002;const a=new s.BufferGeometry;a.setAttribute("position",new s.BufferAttribute(e,3));const r=new s.PointsMaterial({color:16777215,size:.028,transparent:!0,opacity:.28,depthWrite:!1,blending:s.AdditiveBlending});this.particles=new s.Points(a,r),this.particles.userData.velocities=o,this.scene.add(this.particles)},createOverlays(){var o;const t=this.slotPlants.filter(Boolean).length;this.detailPanel=document.createElement("div"),this.detailPanel.className="cf-overlay cf-info-panel",this.detailPanel.innerHTML=B({title:((o=this.farm)==null?void 0:o.name)||y.farmName||"Commercial Farm",subtitle:`${this.rack.label} · ${t}/${this.rack.total} planted`,status:T(this.slotPlants,this.sensorSnapshot),mode:"Facility overview"}),this.parent.appendChild(this.detailPanel),this.tooltip=document.createElement("div"),this.tooltip.className="cf-tooltip",this.tooltip.innerHTML='<span class="cf-tooltip-dot"></span><div><strong>Hover a tower</strong><small>Click to inspect rack details</small></div>',this.parent.appendChild(this.tooltip),this.mascotBubble=document.createElement("div"),this.mascotBubble.className="cf-overlay cf-mascot-bubble",this.mascotBubble.addEventListener("click",a=>{if(a.target.closest("[data-mascot-hide]")){a.preventDefault(),a.stopPropagation(),localStorage.setItem(I,"false"),this.setMascotVisible(!1),window.dispatchEvent(new CustomEvent("seeddown:mascotVisibility",{detail:{enabled:!1}}));return}a.target.closest("[data-mascot-ask]")&&(a.preventDefault(),a.stopPropagation(),window.dispatchEvent(new CustomEvent("seeddown:mascotAsk",{detail:this.getSelectedContext()})))}),this.parent.appendChild(this.mascotBubble),this.updateMascotBubble();const e=document.createElement("div");e.className="cf-overlay cf-legend",e.innerHTML=`
            <span><i class="ok"></i>Healthy</span>
            <span><i class="warn"></i>Warning</span>
            <span><i class="danger"></i>Critical</span>
            <span class="cf-legend-help">Drag rotate · Wheel / +/- zoom · Double click fullscreen</span>
        `,this.parent.appendChild(e),this.fullscreenButton=document.createElement("button"),this.fullscreenButton.type="button",this.fullscreenButton.className="cf-expand-btn",this.fullscreenButton.textContent="EXPAND",this.fullscreenButton.addEventListener("click",a=>{a.stopPropagation(),this.toggleFullscreen()}),this.parent.appendChild(this.fullscreenButton),this.zoomControls=document.createElement("div"),this.zoomControls.className="cf-zoom-controls",this.zoomControls.innerHTML=`
            <button type="button" data-zoom="in" aria-label="Zoom in">+</button>
            <button type="button" data-zoom="out" aria-label="Zoom out">-</button>
            <button type="button" data-zoom="reset" aria-label="Reset view">RESET</button>
        `,this.zoomControls.addEventListener("click",a=>{const r=a.target.closest("button[data-zoom]");r&&(a.preventDefault(),a.stopPropagation(),r.dataset.zoom==="in"&&this.zoomCamera(.82),r.dataset.zoom==="out"&&this.zoomCamera(1.22),r.dataset.zoom==="reset"&&this.resetCamera())}),this.parent.appendChild(this.zoomControls)},bindEvents(){this.resizeHandler=()=>this.resize(),window.addEventListener("resize",this.resizeHandler),this.fullscreenHandler=()=>{this.syncExpandButton(),setTimeout(()=>this.resize(),80)},document.addEventListener("fullscreenchange",this.fullscreenHandler),this.canvas.addEventListener("pointermove",this.onPointerMove),this.canvas.addEventListener("click",this.onClick),this.canvas.addEventListener("dblclick",this.onDoubleClick),this.canvas.addEventListener("wheel",this.onWheel,{passive:!1}),this.mascotVisibilityHandler=t=>{var e;return this.setMascotVisible(((e=t.detail)==null?void 0:e.enabled)!==!1)},window.addEventListener("seeddown:mascotVisibility",this.mascotVisibilityHandler),this.setMascotVisible(this.mascotVisible)},onPointerMove:null,onClick:null,onDoubleClick:null,onWheel:null,installHandlers(){this.onPointerMove=t=>this.handlePointerMove(t),this.onClick=t=>this.handleClick(t),this.onDoubleClick=()=>this.toggleFullscreen(),this.onWheel=t=>this.handleWheel(t)},handlePointerMove(t){const e=this.pickRoot(t);e!==this.hoverRoot&&(this.hoverRoot&&this.hoverRoot!==this.selectedRoot&&this.setHighlight(this.hoverRoot,!1),this.hoverRoot=e,this.hoverRoot&&this.hoverRoot!==this.selectedRoot&&this.setHighlight(this.hoverRoot,!0)),this.canvas.style.cursor=e?"pointer":"grab",this.updateTooltip(e)},handleClick(t){const e=this.pickRoot(t);if(!e){this.selectedRoot&&this.setHighlight(this.selectedRoot,!1),this.selectedRoot=null,this.showOverview(),this.moveMascotToRoot(null);return}this.selectedRoot&&this.selectedRoot!==e&&this.setHighlight(this.selectedRoot,!1),this.selectedRoot=e,this.setHighlight(e,!0,!0),this.showRootDetail(e),this.moveMascotToRoot(e)},handleWheel(t){!this.camera||!this.controls||(t.preventDefault(),t.stopPropagation(),this.zoomCamera(t.deltaY>0?1.12:.88))},zoomCamera(t){var m,i;if(!this.camera||!this.controls)return;const e=this.controls.target,o=this.camera.position.clone().sub(e),a=o.length()||1,r=(m=this.parent)!=null&&m.classList.contains("cf-expanded")?2.4:2.8,n=(i=this.parent)!=null&&i.classList.contains("cf-expanded")?24:18,l=s.MathUtils.clamp(a*t,r,n);o.setLength(l),this.camera.position.copy(e).add(o),this.controls.update()},resetCamera(){var t;this.setCameraFrame((t=this.parent)==null?void 0:t.classList.contains("cf-expanded"))},setCameraFrame(t=!1){!this.camera||!this.controls||(t?(this.camera.fov=38,this.camera.position.set(.35,18.5,.35),this.controls.target.set(0,0,0),this.controls.minPolarAngle=Math.PI*.015,this.controls.maxPolarAngle=Math.PI*.18):(this.camera.fov=58,this.camera.position.set(5.5,4.6,8.5),this.controls.target.set(0,1.55,0),this.controls.minPolarAngle=0,this.controls.maxPolarAngle=Math.PI*.48),this.camera.updateProjectionMatrix(),this.controls.update())},pickRoot(t){var n,l;const e=this.canvas.getBoundingClientRect();this.pointer.x=(t.clientX-e.left)/e.width*2-1,this.pointer.y=-((t.clientY-e.top)/e.height)*2+1,this.raycaster.setFromCamera(this.pointer,this.camera);const o=[];this.interactiveRoots.forEach(m=>m.traverse(i=>{i.isMesh&&o.push(i)}));const a=(n=this.raycaster.intersectObjects(o,!1)[0])==null?void 0:n.object;if(!a)return null;let r=a;for(;r;){if(this.interactiveRoots.includes(r))return r;if((l=r.userData)!=null&&l.root&&this.interactiveRoots.includes(r.userData.root))return r.userData.root;r=r.parent}return null},setHighlight(t,e,o=!1){const a=o?new s.Color(3718648):new s.Color(10741301),r=o?.65:.32;t.traverse(n=>{var l;!n.isMesh||!((l=n.material)!=null&&l.emissive)||(n.userData.originalEmissive||(n.userData.originalEmissive=n.material.emissive.clone(),n.userData.originalIntensity=n.material.emissiveIntensity||0),e?(n.material.emissive.copy(a),n.material.emissiveIntensity=r):(n.material.emissive.copy(n.userData.originalEmissive),n.material.emissiveIntensity=n.userData.originalIntensity))})},updateTooltip(t){if(!this.tooltip)return;if(!t){this.tooltip.innerHTML='<span class="cf-tooltip-dot"></span><div><strong>Hover a tower</strong><small>Click to inspect rack details</small></div>';return}const e=t.userData||{},o=Array.isArray(e.plants)?e.plants.length:0;this.tooltip.innerHTML=`
            <span class="cf-tooltip-dot ${e.status||"healthy"}"></span>
            <div><strong>${g(e.label||"Station")}</strong><small>${e.isDevice?`${e.scope||"farm"} ${e.type}`:o?`${o} active plants`:e.isTank?"Nutrient station":"Empty zone"}</small></div>
        `},showOverview(){var e;const t=this.slotPlants.filter(Boolean).length;this.detailPanel.innerHTML=B({title:((e=this.farm)==null?void 0:e.name)||y.farmName||"Commercial Farm",subtitle:`${this.rack.label} · ${t}/${this.rack.total} planted`,status:T(this.slotPlants,this.sensorSnapshot),mode:"Facility overview"}),this.mascotSelectedContext=null,this.updateMascotBubble()},showRootDetail(t){const e=t.userData||{};if(e.isTank){this.detailPanel.innerHTML=at(e,this.sensorSnapshot);return}if(e.isDevice){this.detailPanel.innerHTML=nt(e);return}const o=Array.isArray(e.plants)?e.plants:[];this.detailPanel.innerHTML=ot(e,o,this.sensorSnapshot)},moveMascotToRoot(t){if(!this.mascotGroup||!this.mascotTarget)return;if(!t){this.mascotTarget.copy(this.mascotHome||new s.Vector3(4.35,.58,4.7)),this.mascotBaseY=this.mascotTarget.y,this.mascotSelectedContext=null,this.updateMascotBubble();return}const e=new s.Box3().setFromObject(t),o=e.getCenter(new s.Vector3),a=e.getSize(new s.Vector3),r=o.x>=0?1:-1,n=o.z>=0?1:-1;this.mascotTarget.set(s.MathUtils.clamp(o.x+r*Math.max(.7,a.x*.36),-7.2,7.2),.58,s.MathUtils.clamp(o.z+n*Math.max(.5,a.z*.26),-5.9,5.9)),this.mascotBaseY=this.mascotTarget.y,this.mascotSelectedContext=this.contextFromRoot(t),this.updateMascotBubble()},contextFromRoot(t){const e=(t==null?void 0:t.userData)||{},o={...this.sensorSnapshot||{}};return e.isDevice?{objectType:e.type==="output"?"output":"sensor",label:e.label||"Device",key:e.key||"",scope:e.scope||"farm",zoneId:e.zoneId||"",zoneLabel:e.zoneLabel||"",status:e.status||"healthy",value:e.value||"",purpose:R(e.key),latestReading:o,prompt:`${e.label||"This device"} context`}:e.isTank?{objectType:"tank",label:`${e.label||"Nutrient"} tank`,status:e.status||"healthy",latestReading:o,prompt:`${e.label||"Nutrient"} tank context`}:e.isTower?{objectType:"zone",label:e.label||"Zone",zoneId:e.id||"",crop:e.crop||"",status:e.status||"empty",plantCount:Array.isArray(e.plants)?e.plants.length:0,latestReading:o,prompt:`${e.label||"Zone"} context`}:null},getSelectedContext(){var t;return this.mascotSelectedContext||this.contextFromRoot(this.selectedRoot)||{objectType:"facility",label:((t=this.farm)==null?void 0:t.name)||y.farmName||"Commercial Farm",status:T(this.slotPlants,this.sensorSnapshot),latestReading:{...this.sensorSnapshot||{}},prompt:"Commercial farm context"}},updateMascotBubble(){if(!this.mascotBubble)return;const t=this.mascotSelectedContext,e=String((t==null?void 0:t.status)||"").toLowerCase(),o=e.includes("warning")||e.includes("danger")||e.includes("critical"),a=t?"I am checking this now":"I am SeedDown AI";let r="Click a zone, sensor, tank, or output and I will explain what the live data means.";(t==null?void 0:t.objectType)==="zone"?r=`I am looking at ${t.label}. I can explain its temperature, pH, water, and risk status.`:(t==null?void 0:t.objectType)==="sensor"?r=`This ${t.label} is linked to ${t.zoneLabel||t.scope||"the farm"}. Ask me what this reading means.`:(t==null?void 0:t.objectType)==="output"?r=`This ${t.label} controls ${t.purpose||"farm automation"}. I can explain when it should run.`:(t==null?void 0:t.objectType)==="tank"?r=`I am checking the ${t.label}. I can explain how it affects nutrient balance.`:t&&(r=`I am looking at ${t.label}. Ask me what the current data means.`),t&&o&&(r="This area may need attention. I can help you understand the risk before you act."),this.mascotBubble.innerHTML=`
            <div class="cf-mascot-kicker">SeedDown AI</div>
            <button type="button" class="cf-mascot-hide" data-mascot-hide aria-label="Hide SeedDown AI">Hide</button>
            <strong>${g(a)}</strong>
            <span>${g(r)}</span>
            <button type="button" data-mascot-ask>Ask now</button>
        `},setMascotVisible(t){this.mascotVisible=!!t,this.mascotGroup&&(this.mascotGroup.visible=this.mascotVisible),this.mascotBubble&&(this.mascotBubble.style.display=this.mascotVisible?"block":"none")},async toggleFullscreen(){if(!this.parent)return;!this.parent.classList.contains("cf-expanded")?this.enterExpandedView():this.exitExpandedView()},enterExpandedView(){!this.parent||this.parent.classList.contains("cf-expanded")||(this.originalParent=this.parent.parentNode,this.originalNextSibling=this.parent.nextSibling,document.body.appendChild(this.parent),this.parent.classList.add("cf-expanded"),document.documentElement.classList.add("cf-expanded-lock"),document.body.classList.add("cf-expanded-lock"),this.syncExpandButton(),this.setCameraFrame(!0),requestAnimationFrame(()=>this.resize()),setTimeout(()=>this.resize(),120))},exitExpandedView(){this.parent&&(this.parent.classList.remove("cf-expanded"),document.documentElement.classList.remove("cf-expanded-lock"),document.body.classList.remove("cf-expanded-lock"),this.restoreHostPlacement(),this.syncExpandButton(),this.setCameraFrame(!1),requestAnimationFrame(()=>this.resize()),setTimeout(()=>this.resize(),120))},restoreHostPlacement(){!this.parent||!this.originalParent||(this.originalNextSibling&&this.originalNextSibling.parentNode===this.originalParent?this.originalParent.insertBefore(this.parent,this.originalNextSibling):this.originalParent.appendChild(this.parent),this.originalParent=null,this.originalNextSibling=null)},syncExpandButton(){!this.fullscreenButton||!this.parent||(this.fullscreenButton.textContent=this.parent.classList.contains("cf-expanded")?"CLOSE":"EXPAND")},resize(){var l,m;if(!this.canvas||!this.renderer||!this.camera)return;const t=(l=this.parent)==null?void 0:l.classList.contains("cf-expanded"),e=(m=this.parent)==null?void 0:m.classList.contains("commercial-command-screen"),o=t||e;e&&(E(this.parent,{position:"fixed",inset:"0",width:"100vw",height:"100vh",minHeight:"100vh",overflow:"hidden",borderRadius:"0"}),E(this.canvas,{position:"fixed",inset:"0",width:"100vw",height:"100vh",minHeight:"100vh",display:"block",borderRadius:"0"}));const a=this.canvas.getBoundingClientRect(),r=o?window.innerWidth||document.documentElement.clientWidth||a.width||1280:Math.max(320,a.width||this.parent.clientWidth||640),n=o?window.innerHeight||document.documentElement.clientHeight||a.height||720:Math.max(300,a.height||420);this.renderer.setSize(r,n,!1),this.camera.aspect=r/n,this.camera.updateProjectionMatrix()},animate(){var e,o;const t=Math.min(.04,((o=(e=this.clock)==null?void 0:e.getDelta)==null?void 0:o.call(e))||.016);this.frame+=1,this.controls&&this.controls.update(),this.updateParticles(),this.updateMascot(),this.positionMascotBubble(),this.scene.traverse(a=>{var r,n;(r=a.userData)!=null&&r.isFanBlade&&(a.rotation.z+=4.8*t),(n=a.userData)!=null&&n.isDrip&&(a.position.y-=.55*t,a.position.y<.7&&(a.position.y=a.userData.baseY))}),this.renderer&&this.scene&&this.camera&&this.renderer.render(this.scene,this.camera),this.rafId=requestAnimationFrame(()=>this.animate())},updateMascot(){if(!this.mascotGroup||!this.mascotTarget)return;const t=this.mascotGroup.position,e=new s.Vector3(this.mascotTarget.x-t.x,0,this.mascotTarget.z-t.z),o=e.length();if(this.mascotWalking=o>.045,this.mascotWalking){const r=Math.min(o,.045+o*.025);e.normalize(),t.x+=e.x*r,t.z+=e.z*r,this.mascotWalkPhase+=.32;const n=Math.abs(Math.sin(this.mascotWalkPhase))*.035;t.y+=((this.mascotBaseY||.58)+n-t.y)*.24,this.mascotGroup.rotation.y=Math.atan2(e.x,e.z),this.mascotGroup.rotation.z=Math.sin(this.mascotWalkPhase)*.11,this.mascotGroup.rotation.x=Math.cos(this.mascotWalkPhase*.8)*.035;return}const a=(this.mascotBaseY||.58)+Math.sin(this.frame*.045)*.025;t.x+=(this.mascotTarget.x-t.x)*.08,t.z+=(this.mascotTarget.z-t.z)*.08,t.y+=(a-t.y)*.12,this.mascotGroup.rotation.x+=(0-this.mascotGroup.rotation.x)*.08,this.mascotGroup.rotation.z+=(0-this.mascotGroup.rotation.z)*.08,this.mascotGroup.rotation.y+=(Math.sin(this.frame*.028)*.06-this.mascotGroup.rotation.y)*.08},positionMascotBubble(){if(!this.mascotVisible||!this.mascotBubble||!this.mascotGroup||!this.camera||!this.canvas||!this.parent)return;const t=new s.Vector3;this.mascotGroup.getWorldPosition(t),t.y+=.58;const e=t.project(this.camera);if(e.z<-1||e.z>1){this.mascotBubble.style.opacity="0";return}const o=this.canvas.getBoundingClientRect(),a=this.parent.getBoundingClientRect(),r=this.mascotBubble.offsetWidth||280,n=this.mascotBubble.offsetHeight||112,l=o.left-a.left+(e.x*.5+.5)*o.width,m=o.top-a.top+(-e.y*.5+.5)*o.height,i=l+r+38>a.width,u=i?l-r-24:l+24,h=m-n*.72,d=s.MathUtils.clamp(u,12,Math.max(12,a.width-r-12)),c=s.MathUtils.clamp(h,112,Math.max(112,a.height-n-18));this.mascotBubble.classList.toggle("from-left",i),this.mascotBubble.style.setProperty("left",`${d}px`,"important"),this.mascotBubble.style.setProperty("top",`${c}px`,"important"),this.mascotBubble.style.setProperty("right","auto","important"),this.mascotBubble.style.setProperty("bottom","auto","important"),this.mascotBubble.style.setProperty("opacity","1","important")},updateParticles(){if(!this.particles)return;const t=this.particles.geometry.attributes.position,e=this.particles.userData.velocities;for(let o=0;o<t.count;o++)t.array[o*3]+=e[o*3],t.array[o*3+1]+=e[o*3+1],t.array[o*3+2]+=e[o*3+2],t.array[o*3]>7.5&&(t.array[o*3]=-7.5),t.array[o*3]<-7.5&&(t.array[o*3]=7.5),t.array[o*3+1]>5.4&&(t.array[o*3+1]=.7),t.array[o*3+2]>5.5&&(t.array[o*3+2]=-5.5),t.array[o*3+2]<-5.5&&(t.array[o*3+2]=5.5);t.needsUpdate=!0},createTextSprite(t,e={}){const o=document.createElement("canvas");o.width=512,o.height=128;const a=o.getContext("2d");a.clearRect(0,0,o.width,o.height),st(a,18,22,o.width-36,84,28),a.fillStyle=e.bg||"rgba(12,20,14,.9)",a.fill(),e.border&&(a.strokeStyle=e.border,a.lineWidth=4,a.stroke()),a.fillStyle=e.fg||"#ffffff",a.font=e.font||"900 30px Inter, system-ui, sans-serif",a.textAlign="center",a.textBaseline="middle",a.fillText(t,o.width/2,66);const r=new s.CanvasTexture(o);r.colorSpace=s.SRGBColorSpace;const n=new s.SpriteMaterial({map:r,transparent:!0,depthWrite:!1}),l=new s.Sprite(n);return l.userData.texture=r,l},destroy(){var t;this.rafId&&cancelAnimationFrame(this.rafId),this.rafId=null,this.resizeHandler&&window.removeEventListener("resize",this.resizeHandler),this.fullscreenHandler&&document.removeEventListener("fullscreenchange",this.fullscreenHandler),this.mascotVisibilityHandler&&window.removeEventListener("seeddown:mascotVisibility",this.mascotVisibilityHandler),this.canvas&&this.onPointerMove&&this.canvas.removeEventListener("pointermove",this.onPointerMove),this.canvas&&this.onClick&&this.canvas.removeEventListener("click",this.onClick),this.canvas&&this.onDoubleClick&&this.canvas.removeEventListener("dblclick",this.onDoubleClick),this.canvas&&this.onWheel&&this.canvas.removeEventListener("wheel",this.onWheel),this.controls&&this.controls.dispose(),this.scene&&this.scene.traverse(e=>{var o;e.geometry&&e.geometry.dispose(),(o=e.userData)!=null&&o.texture&&e.userData.texture.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(a=>a.dispose()):e.material.dispose())}),this.renderer&&this.renderer.dispose(),(t=this.parent)!=null&&t.classList.contains("cf-expanded")&&this.exitExpandedView(),this.parent&&(this.parent.classList.remove("cf-expanded"),this.parent.querySelectorAll(".cf-overlay, .cf-tooltip, .cf-expand-btn, .cf-zoom-controls").forEach(e=>e.remove()),this.parent.classList.remove("commercial-farm-host")),document.documentElement.classList.remove("cf-expanded-lock"),document.body.classList.remove("cf-expanded-lock"),this.canvas=null,this.parent=null,this.renderer=null,this.scene=null,this.camera=null,this.controls=null,this.farmGroup=null,this.particles=null,this.raycaster=null,this.pointer=null,this.interactiveRoots=[],this.hoverRoot=null,this.selectedRoot=null,this.detailPanel=null,this.tooltip=null,this.fullscreenButton=null,this.zoomControls=null,this.mascotGroup=null,this.mascotTarget=null,this.mascotHome=null,this.mascotBaseY=.58,this.mascotWalkPhase=0,this.mascotWalking=!1,this.mascotVisible=!0,this.mascotVisibilityHandler=null,this.mascotBubble=null,this.mascotSelectedContext=null,this.originalParent=null,this.originalNextSibling=null,this.resizeHandler=null,this.fullscreenHandler=null,this.onPointerMove=null,this.onClick=null,this.onDoubleClick=null,this.onWheel=null}};function A(){const t=V();return y.currentFarm||t.find(e=>e.id===y.currentFarmId)||t[t.length-1]||null}function V(){try{return JSON.parse(localStorage.getItem(H))||[]}catch{return[]}}function W(t){if(C(t).length){const o=C(t).length;return{id:"commercial-zones",label:`${o}-Zone Commercial Farm`,tiers:o,slotsPerTier:12,total:Math.max(12,o*12)}}const e=String((t==null?void 0:t.rackTypeId)||(t==null?void 0:t.rackType)||(t==null?void 0:t.rackLabel)||"").toLowerCase();return e.includes("2")?v["2-tier"]:e.includes("4")?v["4-tier"]:e.includes("5")?v["5-tier"]:e.includes("wall")||e.includes("grid")?v.wall:e.includes("frame")?v["a-frame"]:e.includes("nft")||e.includes("channel")?v["nft-channel"]:e.includes("hanging")||e.includes("column")?v.hanging:v["3-tier"]}function _(t,e){const o=Array.isArray(t==null?void 0:t.plants)?t.plants:[],a=C(t),r=a.length?Math.max(e.total,a.length*12,o.length*3):e.total,n=Array(r).fill(null),l=new Set;if(o.forEach((i,u)=>{var d;if(a.length&&i.zoneId){const c=a.findIndex(b=>Z(b,i)),p=Math.max(0,c)*12,f=Math.max(1,Number.parseInt(i.slots||i.count||1,10)||1);for(let b=0;b<f;b++){const x=O(n,l,p,p+12)??L(n,l);if(x===-1||x===null||x===void 0)return;n[x]=S(i,x,e,t),n[x].zoneId=i.zoneId,n[x].zoneName=i.zoneName||((d=a[c])==null?void 0:d.name)||i.zoneId,l.add(x)}return}if(i.slotIndex!==void 0&&i.slotIndex!==null){const c=Number(i.slotIndex);Number.isInteger(c)&&c>=0&&c<n.length&&(n[c]=S(i,c,e,t),l.add(c));return}const h=Math.max(1,Number.parseInt(i.slots||i.count||1,10)||1);for(let c=0;c<h;c++){const p=L(n,l);if(p===-1)return;n[p]=S(i,p,e,t),l.add(p)}}),n.some(Boolean))return n;const m=Math.min(e.total,Number.parseInt((t==null?void 0:t.plantSlots)||(t==null?void 0:t.plants)||0,10)||0);for(let i=0;i<m;i++)n[i]=S({name:(t==null?void 0:t.targetPlant)||"Plant",status:"healthy"},i,e,t);return n}function C(t){var r;const e=Array.isArray(t==null?void 0:t.zones)?t.zones:Array.isArray((r=t==null?void 0:t.commercialStructure)==null?void 0:r.zones)?t.commercialStructure.zones:[];if(e.length)return e.map((n,l)=>({...n,zone_id:n.zone_id||n.id||`zone_${String.fromCharCode(65+l)}`,name:n.name||`Zone ${String.fromCharCode(65+l)}`})).filter(n=>n.zone_id||n.name);const o=Array.isArray(t==null?void 0:t.plants)?t.plants:[],a=new Map;return o.forEach((n,l)=>{const m=n.zoneId||n.zone_id||n.zone||n.area;if(!m)return;const i=String(m);a.has(i)||a.set(i,{zone_id:i,name:n.zoneName||`Zone ${String.fromCharCode(65+a.size)}`,crop:n.name||n.species||"Mixed crops",plants:[]});const u=a.get(i),h=n.name||n.species||`Plant ${l+1}`;u.plants.includes(h)||u.plants.push(h),u.crop=u.plants.join(", ")}),a.size?[...a.values()]:(t==null?void 0:t.accountMode)==="commercial"||(t==null?void 0:t.viewMode)==="commercial"?[{zone_id:"zone_A",name:t!=null&&t.name?`${t.name} Zone`:"Zone A",crop:(t==null?void 0:t.targetPlant)||"Commercial crops",plants:t!=null&&t.targetPlant?String(t.targetPlant).split(",").map(n=>n.trim()).filter(Boolean):["Commercial crops"]}]:[]}function Z(t,e){const o=String(e.zoneId||e.zone_id||e.zone||"").toLowerCase();return o&&(o===String(t.zone_id||"").toLowerCase()||o===String(t.id||"").toLowerCase()||o===String(t.name||"").toLowerCase())}function O(t,e,o,a){const r=Math.max(0,o),n=Math.min(t.length,a);for(let l=r;l<n;l++)if(!t[l]&&!e.has(l))return l;return null}function S(t,e,o,a){const r=t.name||(a==null?void 0:a.targetPlant)||"Plant";return{name:r,emoji:t.emoji||rt(r),species:t.species||$(r),status:t.status||Y(t.growth),growth:Number(t.growth??70),days:Number(t.days??0),slotIndex:e,tier:Math.floor(e/o.slotsPerTier)+1,position:e%o.slotsPerTier+1}}function L(t,e){for(let o=0;o<t.length;o++)if(!t[o]&&!e.has(o))return o;return-1}function Y(t){const e=Number(t??80);return e<35?"danger":e<60?"warning":"healthy"}function P(t){return t==="danger"?15680580:t==="warning"?16096779:t==="empty"?6583435:8702998}function j(t){return t.length?t.some(e=>e.status==="danger")?"danger":t.some(e=>e.status==="warning")?"warning":"healthy":"empty"}function T(t,e){return t.some(Boolean)&&t.some(o=>(o==null?void 0:o.status)==="danger")?"Critical plant risk":Number(e.gasRaw||0)>2500||Number(e.temperature||25)>35?"Automation alert":t.some(o=>(o==null?void 0:o.status)==="warning")?"Needs review":"Operational"}function G(){const t=y.sensors||{},e=y.latestReading||y.currentReading||{},o=(a,...r)=>{for(const n of r){const l=n&&typeof n=="object"&&"val"in n?n.val:n,m=Number(l);if(Number.isFinite(m))return m}return a};return{temperature:o(25,t.temp,t.temperature,e.temperature,e.temp),humidity:o(60,t.humid,t.humidity,e.humidity,e.humid),lightRaw:o(2e3,t.lightRaw,t.light,e.lightRaw,e.light),soilRaw:o(1800,t.soilRaw,t.soil,e.soilRaw,e.soilMoisture,e.moisture),ph:o(6.1,t.ph,e.ph),waterDistanceCm:o(10,t.water,t.waterDistanceCm,e.waterDistanceCm,e.waterLevel),gasRaw:o(1e3,t.nutrient,t.gasRaw,e.gasRaw,e.gasValue),ec:o(1.5,t.ec,e.ec),co2Ppm:o(850,t.co2,e.co2Ppm),energyKwh:o(5.1,t.energy,t.energyKwh,e.energyKwh),waterFlowLpm:o(.8,t.flow,t.waterFlowLpm,e.waterFlowLpm)}}function U(){const t=y.latestReadingMeta||{},e=y.latestReading||y.currentReading||{},o=t.fetchedAt||e._fetchedAt||e.createdAt||e.updatedAt||e.timestamp;let a=null;if(o instanceof Date?a=o:o&&typeof o=="object"?typeof o.toDate=="function"?a=o.toDate():o._seconds?a=new Date(o._seconds*1e3):o.seconds&&(a=new Date(o.seconds*1e3)):o&&(a=new Date(o)),!a||Number.isNaN(a.getTime()))return"--";const r=t.stale||e._stale?" cached":"";return`${a.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}${r}`}function q(t,e){return{dht11:`${Number(e.temperature||0).toFixed(1)}C / ${Number(e.humidity||0)}%`,soil:`${Number(e.soilRaw||1800)} raw`,ldr:`${Number(e.lightRaw||0)} raw`,ph:`${Number(e.ph||0).toFixed(1)} pH`,ec:`${Number(e.ec||1.5).toFixed(1)} EC`,flow:`${Number(e.waterFlowLpm||.8).toFixed(1)} L/min`,pump:Number(e.waterDistanceCm||0)>20?"ready":"standby",zone_fan:Number(e.temperature||25)>30?"active":"standby",active_buzzer:Number(e.gasRaw||0)>2500?"alert":"ready",camera:"scan ready"}[t]||"--"}function K(t){return{dht11:"DHT",soil:"SOIL",ldr:"LDR",ph:"pH",ec:"EC",flow:"FLOW",pump:"PUMP",zone_fan:"FAN",active_buzzer:"BUZZ",camera:"CAM"}[t]||String(t).slice(0,4).toUpperCase()}function X(t){const e=String(t.value||"").toLowerCase();return e.includes("alert")||e.includes("danger")?"danger":e.includes("active")?"warning":"healthy"}function J(t){const e=Number(t.ph??6.1);return e<5.5||e>6.5}function Q(t){const e=$((t==null?void 0:t.species)||(t==null?void 0:t.name)||"plant"),o=k[e];if(o)return o;const a=Object.keys(k).find(r=>e.includes(r));return k[a]||k.plant}function tt(t,e,o,a){return Number.isNaN(t)?!1:t%a===o||Math.floor(t/Math.max(1,e.slotsPerTier))===o}function et(t,e,o,a,r,n={}){return t!=null&&t.zoneId&&n.zoneId?String(t.zoneId).toLowerCase()===String(n.zoneId).toLowerCase():t!=null&&t.zoneName&&n.label?String(t.zoneName).toLowerCase()===String(n.label).toLowerCase():tt(e,o,a,r)}function D(t,e,o){const a=new s.BufferGeometry().setFromPoints([new s.Vector3(...t),new s.Vector3(...e)]);return new s.Line(a,o)}function st(t,e,o,a,r,n){t.beginPath(),t.moveTo(e+n,o),t.lineTo(e+a-n,o),t.quadraticCurveTo(e+a,o,e+a,o+n),t.lineTo(e+a,o+r-n),t.quadraticCurveTo(e+a,o+r,e+a-n,o+r),t.lineTo(e+n,o+r),t.quadraticCurveTo(e,o+r,e,o+r-n),t.lineTo(e,o+n),t.quadraticCurveTo(e,o,e+n,o),t.closePath()}function B({title:t,subtitle:e,status:o,mode:a}){return`
        <div class="cf-panel-kicker">${g(a)}</div>
        <div class="cf-panel-title">${g(t)}</div>
        <div class="cf-panel-sub">${g(e)}</div>
        <div class="cf-mini-grid">
            ${w("Status",o)}
            ${w("Light",`${Math.round(Number(G().lightRaw||0))}`)}
            ${w("pH",`${Number(G().ph||0).toFixed(1)}`)}
            ${w("Updated",U())}
        </div>
    `}function ot(t,e,o){const a=e.filter(l=>l.status==="healthy").length,r=e.filter(l=>l.status==="warning").length,n=e.filter(l=>l.status==="danger").length;return`
        <div class="cf-panel-kicker">Selected production zone</div>
        <div class="cf-panel-title">${g(t.label||"Zone")}</div>
        <div class="cf-panel-sub">${e.length||0} active plants · ${g(t.status||"empty")}</div>
        <div class="cf-mini-grid">
            ${w("Healthy",a)}
            ${w("Warning",r)}
            ${w("Critical",n)}
            ${w("Temp",`${Number(o.temperature||0).toFixed(1)}C`)}
        </div>
        <div class="cf-plant-list">
            ${e.slice(0,5).map(l=>`<span>${g(l.name)} <b>${g(l.status)}</b></span>`).join("")||"<span>No assigned crop yet</span>"}
        </div>
    `}function at(t,e){return`
        <div class="cf-panel-kicker">Nutrient station</div>
        <div class="cf-panel-title">${g(t.label||"Tank")} Tank</div>
        <div class="cf-panel-sub">Linked to commercial automation controls</div>
        <div class="cf-mini-grid">
            ${w("pH",`${Number(e.ph||0).toFixed(1)}`)}
            ${w("Water",`${Number(e.waterDistanceCm||0)}cm`)}
            ${w("Status",g(t.status||"healthy"))}
        </div>
    `}function nt(t){const e=t.scope==="zone"?t.zoneLabel||t.zoneId||"Zone":"Farm Level",o=t.type==="output"?"Actuator / Output":"Sensor";return`
        <div class="cf-panel-kicker">Digital twin device</div>
        <div class="cf-panel-title">${g(t.label||"Device")}</div>
        <div class="cf-panel-sub">${g(e)} · ${g(o)}</div>
        <div class="cf-mini-grid">
            ${w("Value",t.value||"--")}
            ${w("Status",t.status||"healthy")}
            ${w("Type",t.type||"sensor")}
        </div>
        <div class="cf-plant-list">
            <span>Layer <b>${g(t.scope==="zone"?"ZONE":"FARM")}</b></span>
            <span>Clickable <b>YES</b></span>
            <span>Purpose <b>${g(R(t.key))}</b></span>
        </div>
    `}function R(t){return{co2:"air enrichment",reservoir:"water level",gas:"safety alert",power:"energy tracking",main_fan:"facility airflow",emergency_buzzer:"emergency alarm",dht11:"temperature humidity",soil:"root moisture",ldr:"light detection",ph:"water acidity",ec:"nutrient strength",flow:"irrigation flow",pump:"irrigation output",zone_fan:"zone airflow",active_buzzer:"zone warning",camera:"plant vision"}[t]||"monitoring"}function w(t,e){return`<div class="cf-mini-metric"><span>${g(t)}</span><strong>${g(e)}</strong></div>`}function rt(t=""){const e=String(t).toLowerCase();return e.includes("lettuce")||e.includes("cabbage")||e.includes("kale")?"🥬":e.includes("tomato")?"🍅":e.includes("chili")||e.includes("pepper")?"🌶️":e.includes("strawberry")?"🍓":e.includes("cucumber")?"🥒":e.includes("carrot")?"🥕":e.includes("eggplant")?"🍆":e.includes("basil")||e.includes("mint")||e.includes("spinach")?"🌿":"🌱"}function $(t=""){return String(t||"plant").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function g(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function E(t,e){t&&Object.entries(e).forEach(([o,a])=>{const r=o.replace(/[A-Z]/g,n=>"-"+n.toLowerCase());t.style.setProperty(r,a,"important")})}function it(){if(document.getElementById("commercial-farm-canvas-style"))return;const t=document.createElement("style");t.id="commercial-farm-canvas-style",t.textContent=`
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
            transition: left .18s ease, top .18s ease, opacity .18s ease;
        }
        .cf-mascot-bubble:after {
            content: "";
            position: absolute;
            left: -9px;
            top: 58%;
            width: 18px;
            height: 18px;
            background: rgba(255, 255, 255, .92);
            border-left: 1px solid rgba(20, 184, 166, .34);
            border-bottom: 1px solid rgba(20, 184, 166, .34);
            transform: rotate(45deg);
            border-radius: 4px;
        }
        .cf-mascot-bubble.from-left:after {
            left: auto;
            right: -9px;
            border-left: none;
            border-bottom: none;
            border-right: 1px solid rgba(20, 184, 166, .34);
            border-top: 1px solid rgba(20, 184, 166, .34);
        }
        .cf-mascot-kicker {
            color: #0f766e;
            font-size: 9px;
            font-weight: 950;
            text-transform: uppercase;
            letter-spacing: .12em;
            margin-bottom: 4px;
            padding-right: 46px;
        }
        .cf-mascot-bubble .cf-mascot-hide {
            position: absolute;
            top: 8px;
            right: 10px;
            margin: 0;
            padding: 4px 7px;
            border-radius: 999px;
            background: #f8fafc;
            border-color: #dbe7dc;
            color: #64748b;
            font-size: 9px;
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
    `,document.head.appendChild(t)}export{ht as CommercialFarmCanvas};
