import{A as g,s as I,b as _e,c as Ne}from"./index-Bza452zz.js";import*as a from"https://esm.sh/three@0.160.0";import{OrbitControls as Fe}from"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";import{o as Ge}from"./AddPlantModal-B5fz8hvn.js";import He from"https://esm.sh/jsqr@1.4.0";const Ze="user_farms",K="seeddown_ai_mascot_enabled",E={"2-tier":{id:"2-tier",label:"2-Tier Starter Rack",tiers:2,slotsPerTier:3,total:6},"3-tier":{id:"3-tier",label:"3-Tier Vertical Rack",tiers:3,slotsPerTier:3,total:9},"4-tier":{id:"4-tier",label:"4-Tier Grow Shelf",tiers:4,slotsPerTier:4,total:16},"5-tier":{id:"5-tier",label:"5-Tier Tower Rack",tiers:5,slotsPerTier:4,total:20},wall:{id:"wall",label:"Wall Panel Grid",tiers:4,slotsPerTier:5,total:20},"a-frame":{id:"a-frame",label:"A-Frame Pyramid",tiers:4,slotsPerTier:4,total:16},"nft-channel":{id:"nft-channel",label:"NFT Channel Rows",tiers:3,slotsPerTier:6,total:18},hanging:{id:"hanging",label:"Hanging Column Farm",tiers:5,slotsPerTier:3,total:15}},R={lettuce:{color:6927180,alt:9228129,leaf:.082,spread:.095},cabbage:{color:7448635,alt:10733911,leaf:.09,spread:.1},kale:{color:3108670,alt:5213518,leaf:.088,spread:.105},spinach:{color:3046706,alt:4431943,leaf:.072,spread:.088},basil:{color:2067020,alt:3323495,leaf:.064,spread:.078},mint:{color:3450963,alt:7327605,leaf:.062,spread:.078},tomato:{color:3116870,alt:15680580,leaf:.07,spread:.086,fruit:15680580},chili:{color:2522941,alt:14427686,leaf:.066,spread:.082,fruit:14427686},pepper:{color:2522941,alt:14427686,leaf:.066,spread:.082,fruit:14427686},cucumber:{color:2325052,alt:5284955,leaf:.078,spread:.105,vine:!0},strawberry:{color:4165449,alt:16478597,leaf:.066,spread:.082,fruit:16478597},eggplant:{color:3112783,alt:8141549,leaf:.072,spread:.088,fruit:8141549},plant:{color:6660877,alt:8843180,leaf:.072,spread:.09}},y={canvas:null,parent:null,renderer:null,scene:null,camera:null,controls:null,farmGroup:null,particles:null,raycaster:null,pointer:null,interactiveRoots:[],hoverRoot:null,selectedRoot:null,detailPanel:null,tooltip:null,fullscreenButton:null,zoomControls:null,mascotGroup:null,mascotTarget:null,mascotHome:null,mascotBaseY:.58,mascotWalkPhase:0,mascotWalking:!1,mascotVisible:!0,mascotVisibilityHandler:null,mascotBubble:null,mascotSelectedContext:null,originalParent:null,originalNextSibling:null,resizeHandler:null,fullscreenHandler:null,rafId:null,clock:null,frame:0,farm:null,rack:E["3-tier"],slotPlants:[],sensorSnapshot:{},init(e,t=null){this.destroy(),this.installHandlers(),dt(),this.canvas=document.getElementById(e),this.canvas&&(this.parent=this.canvas.parentElement,this.parent&&(this.farm=t||Oe(),this.rack=We(this.farm),this.slotPlants=je(this.farm,this.rack),this.sensorSnapshot=j(),this.mascotVisible=localStorage.getItem(K)!=="false",this.clock=new a.Clock,this.prepareHost(),this.initScene(),this.buildFacility(),this.createOverlays(),this.bindEvents(),this.resize(),this.animate()))},prepareHost(){this.parent.classList.add("commercial-farm-host"),this.canvas.classList.add("commercial-farm-canvas"),this.parent.querySelectorAll(".cf-overlay, .cf-tooltip, .cf-expand-btn, .cf-zoom-controls").forEach(e=>e.remove())},initScene(){this.scene=new a.Scene,this.scene.background=new a.Color(16317175),this.scene.fog=new a.Fog(16317175,22,58),this.camera=new a.PerspectiveCamera(58,1,.1,120),this.camera.position.set(5.5,4.6,8.5),this.camera.lookAt(0,1.8,0),this.renderer=new a.WebGLRenderer({canvas:this.canvas,antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=a.PCFSoftShadowMap,this.renderer.outputColorSpace=a.SRGBColorSpace,this.renderer.toneMapping=a.ACESFilmicToneMapping,this.renderer.toneMappingExposure=1.08,this.controls=new Fe(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.07,this.controls.enablePan=!0,this.controls.enableZoom=!1,this.controls.maxPolarAngle=Math.PI*.48,this.controls.target.set(0,1.55,0),this.setCameraFrame(!1),this.raycaster=new a.Raycaster,this.pointer=new a.Vector2,this.farmGroup=new a.Group,this.scene.add(this.farmGroup),this.addLighting()},addLighting(){this.scene.add(new a.AmbientLight(14479072,.55));const e=new a.DirectionalLight(16775399,2.2);e.position.set(10,18,9),e.castShadow=!0,e.shadow.mapSize.set(2048,2048),e.shadow.camera.left=-12,e.shadow.camera.right=12,e.shadow.camera.top=12,e.shadow.camera.bottom=-12,e.shadow.bias=-4e-4,this.scene.add(e);const t=new a.DirectionalLight(12244991,.35);t.position.set(-7,10,-6),this.scene.add(t);const o=new a.HemisphereLight(11657727,4928541,.28);this.scene.add(o);const n=new a.PointLight(8702998,1.25,12);n.position.set(0,3.1,0),this.scene.add(n)},buildFacility(){this.addFloor(),this.addGreenhouseFrame();const e=this.createTowerLayout();e.forEach((t,o)=>this.addTower(t,o)),this.addIrrigationPipes(e),this.addDigitalTwinDevices(e),this.addNutrientStation(),this.addControlPanel(),this.addAIMascot(),this.addVentilationFans(),this.addWaterDrips(e),this.addParticles()},addFloor(){const e=new a.Mesh(new a.PlaneGeometry(80,60),new a.MeshStandardMaterial({color:15265510,roughness:.86,metalness:.02}));e.rotation.x=-Math.PI/2,e.receiveShadow=!0,this.scene.add(e);const t=new a.Mesh(new a.PlaneGeometry(5.2,56),new a.MeshStandardMaterial({color:14542812,roughness:.78}));t.rotation.x=-Math.PI/2,t.position.y=.006,t.receiveShadow=!0,this.scene.add(t);const o=new a.LineBasicMaterial({color:11057322,transparent:!0,opacity:.48});for(let n=-38;n<=38;n+=2)this.scene.add(X([n,.014,-28],[n,.014,28],o));for(let n=-28;n<=28;n+=2)this.scene.add(X([-38,.016,n],[38,.016,n],o))},addGreenhouseFrame(){const e=new a.MeshStandardMaterial({color:10135456,metalness:.45,roughness:.32}),t=new a.MeshPhysicalMaterial({color:13625816,transparent:!0,opacity:.2,roughness:.04,side:a.DoubleSide}),o=17.6,n=13.6,r=4.3,s=6.2;for(let i=-n/2;i<=n/2+.001;i+=2.7){[-1,1].forEach(p=>{const d=new a.Mesh(new a.CylinderGeometry(.035,.035,r,10),e);d.position.set(p*o/2,r/2,i),d.castShadow=!0,this.scene.add(d)});const u=Math.sqrt((o/2)**2+(s-r)**2),m=Math.atan2(s-r,o/2);[-1,1].forEach(p=>{const d=new a.Mesh(new a.CylinderGeometry(.028,.028,u,8),e);d.position.set(p*o/4,r+(s-r)/2,i),d.rotation.z=p*(Math.PI/2-m),this.scene.add(d)})}const c=new a.Mesh(new a.CylinderGeometry(.032,.032,n,10),e);c.rotation.x=Math.PI/2,c.position.set(0,s,0),this.scene.add(c);const l=new a.Mesh(new a.PlaneGeometry(o,r),t);l.position.set(0,r/2,-n/2),this.scene.add(l),[-1,1].forEach(i=>{const u=new a.Mesh(new a.PlaneGeometry(n,r),t);u.rotation.y=Math.PI/2,u.position.set(i*o/2,r/2,0),this.scene.add(u)})},createTowerLayout(){const e=G(this.farm);if(e.length){const c=Math.ceil(Math.sqrt(e.length)),l=Math.ceil(e.length/c),i=2.65,u=3.1,m=-((c-1)*i)/2,p=-((l-1)*u)/2;return e.map((d,h)=>({x:m+h%c*i,z:p+Math.floor(h/c)*u,zoneIndex:h,row:Math.floor(h/c),col:h%c,zoneId:d.zone_id||d.id||`zone_${String.fromCharCode(65+h)}`,label:d.name||`Zone ${String.fromCharCode(65+h)}`,crop:d.crop||(Array.isArray(d.plants)?d.plants.join(", "):"")||"Mixed crops"}))}const t=Math.max(6,Math.min(10,Math.ceil(this.rack.total/2))),o=[],n=Math.ceil(t/2),r=-((n-1)*2.15)/2,s=[-2.35,2.35];for(let c=0;c<2;c++)for(let l=0;l<n&&!(o.length>=t);l++)o.push({x:r+l*2.15,z:s[c],zoneIndex:o.length,row:c,col:l});return o},addTower(e,t){const o=String.fromCharCode(65+t),n=new a.Group;n.position.set(e.x,0,e.z),n.userData={isTower:!0,id:e.zoneId||`zone-${o}`,label:e.label||`Zone ${o}`,crop:e.crop||"Mixed crops",zoneIndex:t,plants:[],status:"empty"},this.addZoneFootprint(n,e,t);const r=new a.MeshStandardMaterial({color:15330800,roughness:.34,metalness:.18}),s=new a.MeshStandardMaterial({color:2503725,roughness:.5,metalness:.4}),c=new a.Mesh(new a.CylinderGeometry(.095,.12,3.2,22),r);c.position.y=1.67,c.castShadow=!0,n.add(c);const l=new a.Mesh(new a.CylinderGeometry(.48,.6,.15,28),s);l.position.y=.075,l.castShadow=!0,n.add(l);const i=this.createTowerLayout().length,u=this.slotPlants.map((f,b)=>({plant:f,index:b})).filter(f=>f.plant&&at(f.plant,f.index,this.rack,t,i,e)),m=8,p=4;let d=0;for(let f=0;f<m;f++){const b=.38+f*.36,S=new a.Mesh(new a.TorusGeometry(.42,.012,8,48),new a.MeshStandardMaterial({color:5398874,roughness:.48,metalness:.35}));S.rotation.x=Math.PI/2,S.position.y=b,n.add(S);for(let D=0;D<p;D++){const Re=D*Math.PI/2+(f%2?Math.PI/4:0),C=u[d]||null;this.addPod(n,Re,b,(C==null?void 0:C.plant)||null,(C==null?void 0:C.index)??t*100+d,f,D),C!=null&&C.plant&&(n.userData.plants.push(C.plant),d+=1)}}n.userData.status=Ye(n.userData.plants),this.addZoneStatusStrip(n,n.userData.status);const h=this.createTextSprite(String(e.label||`ZONE ${o}`).toUpperCase(),{bg:"rgba(255,255,255,.92)",fg:"#14532d",border:"#315d3e",font:"900 30px Inter, system-ui, sans-serif"});h.position.set(0,3.63,0),h.scale.set(.68,.18,1),n.add(h),this.farmGroup.add(n),this.interactiveRoots.push(n)},addZoneFootprint(e,t,o){var d,h;const n=String.fromCharCode(65+o),r=new a.MeshStandardMaterial({color:15989492,roughness:.72,metalness:.02}),s=new a.MeshStandardMaterial({color:2062914,roughness:.48,metalness:.18}),c=new a.MeshStandardMaterial({color:12044475,roughness:.82,metalness:.02,transparent:!0,opacity:.55}),l=new a.Mesh(new a.BoxGeometry(1.92,.035,2.04),r);l.position.y=.022,l.receiveShadow=!0,e.add(l);const i=new a.Mesh(new a.BoxGeometry(2.08,.004,2.2),c);i.position.y=.002,i.receiveShadow=!0,e.add(i),[{x:0,z:1.04,sx:1.92,sz:.035},{x:0,z:-1.04,sx:1.92,sz:.035},{x:.96,z:0,sx:.035,sz:2.04},{x:-.96,z:0,sx:.035,sz:2.04}].forEach(f=>{const b=new a.Mesh(new a.BoxGeometry(f.sx,.035,f.sz),s);b.position.set(f.x,.06,f.z),b.castShadow=!0,e.add(b)});const m=this.createTextSprite(`ZONE ${n}`,{bg:"rgba(20,83,45,.92)",fg:"#f7fee7",font:"900 24px Inter, system-ui, sans-serif"});m.position.set(-.62,.14,.98),m.scale.set(.26,.09,1),e.add(m);const p=(h=String(t.crop||((d=e.userData)==null?void 0:d.crop)||"").split(",")[0])==null?void 0:h.trim();if(p){const f=this.createTextSprite(p.toUpperCase().slice(0,18),{bg:"rgba(255,255,255,.9)",fg:"#166534",font:"900 22px Inter, system-ui, sans-serif"});f.position.set(.38,.14,.98),f.scale.set(.34,.085,1),e.add(f)}},addZoneStatusStrip(e,t){const o=V(t||"healthy"),n=new a.MeshStandardMaterial({color:o,emissive:o,emissiveIntensity:t==="empty"?.08:.34,roughness:.34,metalness:.1}),r=new a.Mesh(new a.BoxGeometry(1.62,.028,.055),n);r.position.set(0,.105,-1.05),r.castShadow=!0,e.add(r)},addPod(e,t,o,n,r,s,c){const i=Math.cos(t)*.48,u=Math.sin(t)*.48,m=(n==null?void 0:n.status)||"empty",p=V(m),d={index:r,tier:e.userData.zoneIndex+1,slot:s*4+c+1,plant:n,tower:e},h=new a.MeshStandardMaterial({color:n?16317180:2437676,roughness:.52,metalness:n?.08:.18}),f=new a.Mesh(new a.CylinderGeometry(.155,.12,.11,20),h);f.position.set(i,o,u),f.rotation.z=Math.PI/2,f.rotation.y=-t,f.castShadow=!0,f.userData.slot=d,f.userData.root=e,e.add(f);const b=new a.Mesh(new a.SphereGeometry(.045,12,8),new a.MeshStandardMaterial({color:p,emissive:p,emissiveIntensity:n?.38:.06}));b.position.set(i*1.1,o+.085,u*1.1),b.userData.slot=d,b.userData.root=e,e.add(b),n&&this.addPlantCluster(e,i*1.1,o+.12,u*1.1,n)},addDigitalTwinDevices(e){[{key:"co2",label:"CO2 Sensor",value:`${Number(this.sensorSnapshot.co2Ppm||800)} ppm`,type:"sensor",kind:"co2",x:-7.25,y:2.35,z:-5.95,color:3718648},{key:"reservoir",label:"Water Reservoir",value:`${Number(this.sensorSnapshot.waterDistanceCm||0)} cm`,type:"sensor",kind:"reservoir",x:-6.8,y:.55,z:5.35,color:959977},{key:"gas",label:"MQ-2 Gas Sensor",value:`${Number(this.sensorSnapshot.gasRaw||0)} raw`,type:"sensor",kind:"gas",x:-5.25,y:.72,z:5.55,color:V(Number(this.sensorSnapshot.gasRaw||0)>2500?"danger":"healthy")},{key:"power",label:"Power Meter",value:`${Number(this.sensorSnapshot.energyKwh||5.1).toFixed(1)} kWh`,type:"sensor",kind:"power",x:.9,y:1.45,z:5.42,color:16096779},{key:"main_fan",label:"Main Ventilation Fan",value:Number(this.sensorSnapshot.temperature||25)>30?"active":"standby",type:"output",kind:"fan",x:7.55,y:2.85,z:-5.9,color:6583435},{key:"emergency_buzzer",label:"Emergency Buzzer",value:Number(this.sensorSnapshot.gasRaw||0)>2500?"alert":"ready",type:"output",kind:"buzzer",x:1.72,y:1.34,z:5.52,color:Number(this.sensorSnapshot.gasRaw||0)>2500?15680580:8702998}].forEach(n=>this.addDeviceMarker(n));const o=[{key:"dht11",label:"DHT11 Temp/Humid",type:"sensor",kind:"dht",color:2278750,dx:-.66,y:1.72,dz:-.32},{key:"soil",label:"Soil Moisture",type:"sensor",kind:"soil",color:9132587,dx:.36,y:.29,dz:.53},{key:"ldr",label:"LDR Light",type:"sensor",kind:"ldr",color:16436245,dx:.32,y:3.38,dz:-.42},{key:"ph",label:"pH Sensor",type:"sensor",kind:"probe",color:11032055,dx:-.42,y:.72,dz:.66},{key:"ec",label:"EC Sensor",type:"sensor",kind:"probe",color:1357990,dx:-.18,y:.68,dz:.74},{key:"flow",label:"YF-S201 Flow",type:"sensor",kind:"flow",color:3718648,dx:.58,y:.58,dz:.42},{key:"pump",label:"Water Pump",type:"output",kind:"pump",color:959977,dx:.82,y:.22,dz:.78},{key:"zone_fan",label:"Zone Fan",type:"output",kind:"fan",color:6583435,dx:-.9,y:2.18,dz:.12},{key:"active_buzzer",label:"Active Buzzer",type:"output",kind:"buzzer",color:16347926,dx:.78,y:1.78,dz:-.58},{key:"camera",label:"Camera",type:"sensor",kind:"camera",color:1120295,dx:-.72,y:3.08,dz:.68}];e.forEach((n,r)=>{var l,i;const s=n.zoneId||((l=n.userData)==null?void 0:l.id)||`zone_${String.fromCharCode(65+r)}`,c=n.label||((i=n.userData)==null?void 0:i.label)||`Zone ${String.fromCharCode(65+r)}`;o.forEach(u=>{this.addDeviceMarker({...u,scope:"zone",zoneId:s,zoneLabel:c,value:Je(u.key,this.sensorSnapshot),x:n.x+u.dx,y:u.y,z:n.z+u.dz,compact:!0})})})},addDeviceMarker(e){const t=new a.Group;if(t.position.set(e.x,e.y,e.z),t.userData={isDevice:!0,label:e.label,key:e.key,type:e.type,scope:e.scope||"farm",zoneId:e.zoneId||null,zoneLabel:e.zoneLabel||null,value:e.value||"--",status:et(e)},this.addDeviceShape(t,e),t.traverse(n=>{(n.isMesh||n.isSprite)&&(n.userData.root=t)}),!e.compact||["camera","pump","zone_fan"].includes(e.key)){const n=e.compact?Xe(e.key):e.label.replace(/\s+/g,`
`),r=this.createTextSprite(n,{bg:"rgba(255,255,255,.92)",fg:"#0f172a",font:"900 24px Inter, system-ui, sans-serif"});r.position.set(0,e.compact?.17:.24,0),r.scale.set(e.compact?.2:.34,e.compact?.08:.13,1),t.add(r)}else{const n=new a.Mesh(new a.TorusGeometry(.11,.006,8,22),new a.MeshStandardMaterial({color:e.color,emissive:e.color,emissiveIntensity:.18,roughness:.3,metalness:.2}));n.rotation.x=Math.PI/2,n.position.y=.02,t.add(n)}this.scene.add(t),this.interactiveRoots.push(t)},addDeviceShape(e,t){const o=new a.MeshStandardMaterial({color:t.color,emissive:t.color,emissiveIntensity:t.type==="output"?.24:.1,roughness:.42,metalness:.16}),n=new a.MeshStandardMaterial({color:1120295,roughness:.48,metalness:.36}),r=new a.MeshStandardMaterial({color:16317180,roughness:.52,metalness:.04}),s=new a.MeshStandardMaterial({color:9741240,roughness:.28,metalness:.72}),c=new a.MeshStandardMaterial({color:132631,roughness:.62,metalness:.08}),l=new a.MeshStandardMaterial({color:6809849,emissive:561586,emissiveIntensity:.18,roughness:.22,metalness:.04,transparent:!0,opacity:.74}),i=m=>(m.castShadow=!0,e.add(m),m),u=(m,p,d,h=t.color)=>{const f=i(new a.Mesh(new a.SphereGeometry(t.compact?.012:.018,10,8),new a.MeshStandardMaterial({color:h,emissive:h,emissiveIntensity:.7,roughness:.24})));return f.position.set(m,p,d),f};if(t.kind==="fan"){const m=t.scope==="zone"?.13:.24;i(new a.Mesh(new a.TorusGeometry(m,.014,10,42),n)),i(new a.Mesh(new a.TorusGeometry(m*.62,.006,8,34),s));const p=i(new a.Mesh(new a.CylinderGeometry(m*.19,m*.19,.035,18),c));p.rotation.x=Math.PI/2;for(let d=0;d<4;d++){const h=i(new a.Mesh(new a.BoxGeometry(m*1.46,m*.17,.012),o));h.position.x=m*.22,h.rotation.z=d*Math.PI/4,h.userData.isFanBlade=!0}for(let d=0;d<4;d++){const h=i(new a.Mesh(new a.BoxGeometry(m*1.92,.006,.01),s));h.rotation.z=d*Math.PI/4}return}if(t.kind==="buzzer"){const m=i(new a.Mesh(new a.CylinderGeometry(.11,.12,.035,22),c));m.position.y=-.025;const p=i(new a.Mesh(new a.SphereGeometry(.095,22,10),o));p.scale.y=.58,p.position.y=.045;const d=i(new a.Mesh(new a.TorusGeometry(.092,.006,8,28),s));d.rotation.x=Math.PI/2,d.position.y=.028;return}if(t.kind==="camera"){const m=i(new a.Mesh(new a.BoxGeometry(.2,.12,.13),c));m.rotation.y=-.35;const p=i(new a.Mesh(new a.BoxGeometry(.14,.075,.012),n));p.position.set(.045,.002,.071),p.rotation.y=-.35;const d=i(new a.Mesh(new a.CylinderGeometry(.038,.038,.048,18),s));d.rotation.x=Math.PI/2,d.position.set(.045,0,.075);const h=i(new a.Mesh(new a.CylinderGeometry(.024,.024,.052,18),l));h.rotation.x=Math.PI/2,h.position.set(.045,0,.104);const f=i(new a.Mesh(new a.CylinderGeometry(.012,.012,.24,8),s));f.position.y=-.15,u(-.045,-.036,.081,2278750);return}if(t.kind==="soil"){const m=i(new a.Mesh(new a.BoxGeometry(.13,.06,.07),r));m.position.y=.025,i(new a.Mesh(new a.BoxGeometry(.052,.024,.012),c)).position.set(0,.035,.041),[-.035,.035].forEach(d=>{i(new a.Mesh(new a.CylinderGeometry(.005,.006,.24,8),s)).position.set(d,-.12,0)}),u(.048,.04,.042,2278750);return}if(t.kind==="probe"){const m=i(new a.Mesh(new a.CylinderGeometry(.034,.038,.18,14),o));m.rotation.z=.35,m.position.y=.035;const p=i(new a.Mesh(new a.CylinderGeometry(.04,.04,.025,14),c));p.rotation.z=.35,p.position.y=-.055;const d=i(new a.Mesh(new a.CylinderGeometry(.007,.01,.28,10),s));d.position.y=-.22,d.rotation.z=.35;const h=i(new a.Mesh(new a.TorusGeometry(.085,.004,6,24),c));h.rotation.set(Math.PI/2,.35,0),h.position.set(-.035,.15,0);return}if(t.kind==="flow"){const m=i(new a.Mesh(new a.CylinderGeometry(.024,.024,.42,14),s));m.rotation.z=Math.PI/2;const p=i(new a.Mesh(new a.CylinderGeometry(.082,.082,.05,24),r));p.rotation.x=Math.PI/2;const d=i(new a.Mesh(new a.BoxGeometry(.105,.01,.014),o));d.userData.isFanBlade=!0,u(.055,.055,.03,440020);return}if(t.kind==="pump"){const m=i(new a.Mesh(new a.CylinderGeometry(.075,.075,.18,20),o));m.rotation.z=Math.PI/2;const p=i(new a.Mesh(new a.CylinderGeometry(.062,.062,.06,18),s));p.rotation.z=Math.PI/2,p.position.x=.105;const d=i(new a.Mesh(new a.CylinderGeometry(.019,.019,.2,10),s));d.rotation.z=Math.PI/2,d.position.x=.19;const h=i(new a.Mesh(new a.CylinderGeometry(.018,.018,.15,10),c));h.rotation.x=Math.PI/2,h.position.set(-.03,-.078,0);const f=i(new a.Mesh(new a.BoxGeometry(.22,.024,.08),c));f.position.y=-.086;return}if(t.kind==="reservoir"){const m=i(new a.Mesh(new a.CylinderGeometry(.18,.18,.42,28),o));m.position.y=.12;const p=i(new a.Mesh(new a.CylinderGeometry(.19,.18,.045,28),c));p.position.y=.35,i(new a.Mesh(new a.BoxGeometry(.022,.28,.012),l)).position.set(.182,.12,.02);const h=i(new a.Mesh(new a.BoxGeometry(.18,.055,.12),n));h.position.y=.38,u(.064,.392,.064,2278750);return}if(t.kind==="power"){i(new a.Mesh(new a.BoxGeometry(.24,.18,.045),n));const m=i(new a.Mesh(new a.BoxGeometry(.16,.09,.012),o));m.position.z=.03,[-.058,0,.058].forEach((p,d)=>{u(p,-.064,.034,d===0?2278750:440020)});return}if(t.kind==="gas"||t.kind==="dht"||t.kind==="co2"){i(new a.Mesh(new a.BoxGeometry(.17,.135,.075),t.kind==="dht"?r:o));for(let m=0;m<3;m++)i(new a.Mesh(new a.BoxGeometry(.1,.007,.011),n)).position.set(-.008,-.038+m*.032,.045);if(t.kind==="co2"||t.kind==="gas"){const m=i(new a.Mesh(new a.CylinderGeometry(.036,.036,.015,18),c));m.rotation.x=Math.PI/2,m.position.set(.055,.038,.046)}u(-.062,.044,.047,t.kind==="gas"?16096779:2278750);return}if(t.kind==="ldr"){const m=i(new a.Mesh(new a.BoxGeometry(.13,.055,.08),r));m.position.y=-.01;const p=i(new a.Mesh(new a.CylinderGeometry(.052,.052,.02,24),o));p.rotation.x=Math.PI/2,p.position.z=.045;const d=i(new a.Mesh(new a.SphereGeometry(.038,14,8),l));d.scale.y=.42,d.position.set(0,0,.058);return}i(new a.Mesh(t.compact?new a.SphereGeometry(.07,12,8):new a.BoxGeometry(.22,.18,.14),o))},addPlantCluster(e,t,o,n,r){const s=ot(r),c=new a.MeshStandardMaterial({color:3100976,roughness:.7}),l=new a.MeshStandardMaterial({color:s.color,roughness:.72,side:a.DoubleSide}),i=new a.MeshStandardMaterial({color:s.alt,roughness:.72,side:a.DoubleSide}),u=new a.Mesh(new a.CylinderGeometry(.008,.01,.15,6),c);u.position.set(t,o+.055,n),e.add(u);for(let m=0;m<7;m++){const p=Math.PI*2/7*m,d=s.spread+Math.random()*.025,h=new a.Mesh(new a.SphereGeometry(s.leaf,8,5),m%2?l:i);h.scale.set(1.4,.36,.82),h.position.set(t+Math.cos(p)*d,o+.12+m%3*.012,n+Math.sin(p)*d),h.rotation.set(-.45+Math.random()*.18,p,.18),h.castShadow=!0,e.add(h)}if(s.fruit)for(let m=0;m<2;m++){const p=Math.PI*m+.55,d=new a.Mesh(new a.SphereGeometry(.032,10,8),new a.MeshStandardMaterial({color:s.fruit,roughness:.55}));d.position.set(t+Math.cos(p)*.07,o+.105,n+Math.sin(p)*.07),e.add(d)}if(s.vine){const m=new a.Mesh(new a.CylinderGeometry(.006,.004,.34,5),new a.MeshStandardMaterial({color:s.color,roughness:.72}));m.position.set(t+.06,o-.02,n+.05),m.rotation.z=.25,e.add(m)}},addIrrigationPipes(e){const t=new a.MeshStandardMaterial({color:5605546,roughness:.28,metalness:.6}),o=new a.MeshStandardMaterial({color:9358054,roughness:.25,metalness:.55});[...new Set(e.map(r=>r.z))].forEach(r=>{const s=e.filter(u=>u.z===r),c=Math.min(...s.map(u=>u.x))-.8,l=Math.max(...s.map(u=>u.x))+.8,i=new a.Mesh(new a.CylinderGeometry(.035,.035,l-c,10),t);i.rotation.z=Math.PI/2,i.position.set((c+l)/2,3.35,r+.25),this.scene.add(i)}),e.forEach(r=>{const s=new a.Mesh(new a.CylinderGeometry(.02,.02,2.75,8),t);s.position.set(r.x+.28,1.9,r.z+.25),this.scene.add(s);const c=new a.Mesh(new a.SphereGeometry(.055,10,8),o);c.position.set(r.x+.28,3.28,r.z+.25),this.scene.add(c)})},addNutrientStation(){const e=new a.MeshStandardMaterial({color:2780750,roughness:.35,metalness:.15}),t=new a.MeshStandardMaterial({color:2054718,roughness:.4,metalness:.2});["N","P","K","pH"].forEach((n,r)=>{const s=-3+r*2,c=new a.Group;c.userData={isTank:!0,label:n,status:r===3&&tt(this.sensorSnapshot)?"warning":"healthy"};const l=new a.Mesh(new a.CylinderGeometry(.42,.42,1.05,18),e);l.position.set(s,.58,-5.75),l.castShadow=!0,c.add(l);const i=new a.Mesh(new a.CylinderGeometry(.45,.42,.07,18),t);i.position.set(s,1.14,-5.75),c.add(i);const u=this.createTextSprite(n,{bg:"rgba(255,255,255,.92)",fg:"#0f172a",font:"900 34px Inter, system-ui, sans-serif"});u.position.set(s,.58,-5.28),u.scale.set(.22,.1,1),c.add(u),this.scene.add(c),this.interactiveRoots.push(c)})},addControlPanel(){const e=new a.MeshStandardMaterial({color:5593943,roughness:.5,metalness:.3}),t=new a.Mesh(new a.BoxGeometry(1.7,.08,.65),e);t.position.set(0,.86,5.75),t.castShadow=!0,this.scene.add(t);const o=new a.MeshStandardMaterial({color:464909,emissive:2062914,emissiveIntensity:.75,roughness:.12,metalness:.42}),n=new a.Mesh(new a.BoxGeometry(.95,.56,.04),o);n.position.set(0,1.38,5.45),n.castShadow=!0,this.scene.add(n);const r=this.createTextSprite("CONTROL",{bg:"rgba(9,18,13,.86)",fg:"#a3e635",font:"900 26px Inter, system-ui, sans-serif"});r.position.set(0,1.82,5.4),r.scale.set(.42,.13,1),this.scene.add(r)},addAIMascot(){const e=new a.Group;this.mascotHome=new a.Vector3(4.35,.58,4.7),this.mascotTarget=this.mascotHome.clone(),this.mascotBaseY=this.mascotHome.y,this.mascotWalkPhase=0,this.mascotWalking=!1,e.position.copy(this.mascotHome),e.userData.isMascot=!0;const t=new a.Mesh(new a.CircleGeometry(.38,32),new a.MeshBasicMaterial({color:988970,transparent:!0,opacity:.16,depthWrite:!1}));t.rotation.x=-Math.PI/2,t.position.y=-.31,e.add(t);const o=new a.MeshStandardMaterial({color:16007006,roughness:.38,metalness:.02,emissive:8330525,emissiveIntensity:.08}),n=new a.Mesh(new a.SphereGeometry(.31,42,32),o);n.scale.set(1.08,.95,1.02),n.castShadow=!0,e.add(n);const r=new a.Mesh(new a.SphereGeometry(.2,28,18),new a.MeshStandardMaterial({color:16757642,roughness:.48,metalness:0}));r.scale.set(1.1,.55,.16),r.position.set(0,-.12,.27),e.add(r);const s=new a.MeshStandardMaterial({color:1483594,roughness:.44,metalness:.02}),c=new a.MeshStandardMaterial({color:8702998,roughness:.5});[-.18,0,.18].forEach((p,d)=>{const h=new a.Mesh(new a.CylinderGeometry(.018,.024,.23,10),c);h.position.set(p*.42,.29,0),h.rotation.z=(d-1)*.36,e.add(h);const f=new a.Mesh(new a.SphereGeometry(.105,20,14),s);f.scale.set(1.7,.42,.78),f.position.set(p,.45+Math.abs(d-1)*.02,d===1?.01:.035),f.rotation.z=(d-1)*.5,f.rotation.x=.22,f.castShadow=!0,e.add(f)});const l=new a.MeshStandardMaterial({color:2625555,roughness:.28});[-.1,.1].forEach(p=>{const d=new a.Mesh(new a.SphereGeometry(.034,16,12),l);d.position.set(p,.05,.295),e.add(d)});const i=new a.MeshStandardMaterial({color:16747173,roughness:.45,transparent:!0,opacity:.92});[-.17,.17].forEach(p=>{const d=new a.Mesh(new a.SphereGeometry(.038,16,10),i);d.scale.set(1.3,.72,.22),d.position.set(p,-.03,.302),e.add(d)});const u=[new a.Vector3(-.055,-.01,.318),new a.Vector3(-.018,-.035,.322),new a.Vector3(.018,-.035,.322),new a.Vector3(.055,-.01,.318)],m=new a.Line(new a.BufferGeometry().setFromPoints(u),new a.LineBasicMaterial({color:2822164,linewidth:2}));e.add(m),this.mascotGroup=e,this.scene.add(e)},addVentilationFans(){const e=new a.MeshStandardMaterial({color:2042167,roughness:.36,metalness:.55});[-7.3,7.3].forEach(t=>{const o=new a.Group;o.position.set(t,2.8,-5.9),o.userData.isFan=!0;const n=new a.Mesh(new a.TorusGeometry(.34,.025,8,32),e);o.add(n);for(let r=0;r<4;r++){const s=new a.Mesh(new a.BoxGeometry(.48,.045,.018),e);s.rotation.z=r*Math.PI/4,s.userData.isFanBlade=!0,o.add(s)}this.scene.add(o)})},addWaterDrips(e){const t=new a.MeshStandardMaterial({color:3718648,emissive:3718648,emissiveIntensity:.5,transparent:!0,opacity:.85});e.forEach((o,n)=>{if(n%2)return;const r=new a.Mesh(new a.SphereGeometry(.025,8,6),t.clone());r.position.set(o.x+.25,2.9,o.z+.28),r.userData.isDrip=!0,r.userData.baseY=r.position.y,this.scene.add(r)})},addParticles(){const t=new Float32Array(1080),o=new Float32Array(360*3);for(let s=0;s<360;s++)t[s*3]=(Math.random()-.5)*15,t[s*3+1]=Math.random()*4.4+.7,t[s*3+2]=(Math.random()-.5)*11,o[s*3]=(Math.random()-.5)*.002,o[s*3+1]=(Math.random()-.5)*.001,o[s*3+2]=(Math.random()-.5)*.002;const n=new a.BufferGeometry;n.setAttribute("position",new a.BufferAttribute(t,3));const r=new a.PointsMaterial({color:16777215,size:.028,transparent:!0,opacity:.28,depthWrite:!1,blending:a.AdditiveBlending});this.particles=new a.Points(n,r),this.particles.userData.velocities=o,this.scene.add(this.particles)},createOverlays(){var o;const e=this.slotPlants.filter(Boolean).length;this.detailPanel=document.createElement("div"),this.detailPanel.className="cf-overlay cf-info-panel",this.detailPanel.innerHTML=ee({title:((o=this.farm)==null?void 0:o.name)||g.farmName||"Commercial Farm",subtitle:`${this.rack.label} · ${e}/${this.rack.total} planted`,status:W(this.slotPlants,this.sensorSnapshot),mode:"Facility overview"}),this.parent.appendChild(this.detailPanel),this.tooltip=document.createElement("div"),this.tooltip.className="cf-tooltip",this.tooltip.innerHTML='<span class="cf-tooltip-dot"></span><div><strong>Hover a tower</strong><small>Click to inspect rack details</small></div>',this.parent.appendChild(this.tooltip),this.mascotBubble=document.createElement("div"),this.mascotBubble.className="cf-overlay cf-mascot-bubble",this.mascotBubble.addEventListener("click",n=>{if(n.target.closest("[data-mascot-hide]")){n.preventDefault(),n.stopPropagation(),localStorage.setItem(K,"false"),this.setMascotVisible(!1),window.dispatchEvent(new CustomEvent("seeddown:mascotVisibility",{detail:{enabled:!1}}));return}n.target.closest("[data-mascot-ask]")&&(n.preventDefault(),n.stopPropagation(),window.dispatchEvent(new CustomEvent("seeddown:mascotAsk",{detail:this.getSelectedContext()})))}),this.parent.appendChild(this.mascotBubble),this.updateMascotBubble();const t=document.createElement("div");t.className="cf-overlay cf-legend",t.innerHTML=`
            <span><i class="ok"></i>Healthy</span>
            <span><i class="warn"></i>Warning</span>
            <span><i class="danger"></i>Critical</span>
            <span class="cf-legend-help">Drag rotate · Wheel / +/- zoom · Double click fullscreen</span>
        `,this.parent.appendChild(t),this.fullscreenButton=document.createElement("button"),this.fullscreenButton.type="button",this.fullscreenButton.className="cf-expand-btn",this.fullscreenButton.textContent="EXPAND",this.fullscreenButton.addEventListener("click",n=>{n.stopPropagation(),this.toggleFullscreen()}),this.parent.appendChild(this.fullscreenButton),this.zoomControls=document.createElement("div"),this.zoomControls.className="cf-zoom-controls",this.zoomControls.innerHTML=`
            <button type="button" data-zoom="in" aria-label="Zoom in">+</button>
            <button type="button" data-zoom="out" aria-label="Zoom out">-</button>
            <button type="button" data-zoom="reset" aria-label="Reset view">RESET</button>
        `,this.zoomControls.addEventListener("click",n=>{const r=n.target.closest("button[data-zoom]");r&&(n.preventDefault(),n.stopPropagation(),r.dataset.zoom==="in"&&this.zoomCamera(.82),r.dataset.zoom==="out"&&this.zoomCamera(1.22),r.dataset.zoom==="reset"&&this.resetCamera())}),this.parent.appendChild(this.zoomControls)},bindEvents(){this.resizeHandler=()=>this.resize(),window.addEventListener("resize",this.resizeHandler),this.fullscreenHandler=()=>{this.syncExpandButton(),setTimeout(()=>this.resize(),80)},document.addEventListener("fullscreenchange",this.fullscreenHandler),this.canvas.addEventListener("pointermove",this.onPointerMove),this.canvas.addEventListener("click",this.onClick),this.canvas.addEventListener("dblclick",this.onDoubleClick),this.canvas.addEventListener("wheel",this.onWheel,{passive:!1}),this.mascotVisibilityHandler=e=>{var t;return this.setMascotVisible(((t=e.detail)==null?void 0:t.enabled)!==!1)},window.addEventListener("seeddown:mascotVisibility",this.mascotVisibilityHandler),this.setMascotVisible(this.mascotVisible)},onPointerMove:null,onClick:null,onDoubleClick:null,onWheel:null,installHandlers(){this.onPointerMove=e=>this.handlePointerMove(e),this.onClick=e=>this.handleClick(e),this.onDoubleClick=()=>this.toggleFullscreen(),this.onWheel=e=>this.handleWheel(e)},handlePointerMove(e){const t=this.pickRoot(e);t!==this.hoverRoot&&(this.hoverRoot&&this.hoverRoot!==this.selectedRoot&&this.setHighlight(this.hoverRoot,!1),this.hoverRoot=t,this.hoverRoot&&this.hoverRoot!==this.selectedRoot&&this.setHighlight(this.hoverRoot,!0)),this.canvas.style.cursor=t?"pointer":"grab",this.updateTooltip(t)},handleClick(e){const t=this.pickRoot(e);if(!t){this.selectedRoot&&this.setHighlight(this.selectedRoot,!1),this.selectedRoot=null,this.showOverview(),this.moveMascotToRoot(null);return}this.selectedRoot&&this.selectedRoot!==t&&this.setHighlight(this.selectedRoot,!1),this.selectedRoot=t,this.setHighlight(t,!0,!0),this.showRootDetail(t),this.moveMascotToRoot(t)},handleWheel(e){!this.camera||!this.controls||(e.preventDefault(),e.stopPropagation(),this.zoomCamera(e.deltaY>0?1.12:.88))},zoomCamera(e){var l,i;if(!this.camera||!this.controls)return;const t=this.controls.target,o=this.camera.position.clone().sub(t),n=o.length()||1,r=(l=this.parent)!=null&&l.classList.contains("cf-expanded")?2.4:2.8,s=(i=this.parent)!=null&&i.classList.contains("cf-expanded")?24:18,c=a.MathUtils.clamp(n*e,r,s);o.setLength(c),this.camera.position.copy(t).add(o),this.controls.update()},resetCamera(){var e;this.setCameraFrame((e=this.parent)==null?void 0:e.classList.contains("cf-expanded"))},setCameraFrame(e=!1){!this.camera||!this.controls||(e?(this.camera.fov=38,this.camera.position.set(.35,18.5,.35),this.controls.target.set(0,0,0),this.controls.minPolarAngle=Math.PI*.015,this.controls.maxPolarAngle=Math.PI*.18):(this.camera.fov=58,this.camera.position.set(5.5,4.6,8.5),this.controls.target.set(0,1.55,0),this.controls.minPolarAngle=0,this.controls.maxPolarAngle=Math.PI*.48),this.camera.updateProjectionMatrix(),this.controls.update())},pickRoot(e){var s,c;const t=this.canvas.getBoundingClientRect();this.pointer.x=(e.clientX-t.left)/t.width*2-1,this.pointer.y=-((e.clientY-t.top)/t.height)*2+1,this.raycaster.setFromCamera(this.pointer,this.camera);const o=[];this.interactiveRoots.forEach(l=>l.traverse(i=>{i.isMesh&&o.push(i)}));const n=(s=this.raycaster.intersectObjects(o,!1)[0])==null?void 0:s.object;if(!n)return null;let r=n;for(;r;){if(this.interactiveRoots.includes(r))return r;if((c=r.userData)!=null&&c.root&&this.interactiveRoots.includes(r.userData.root))return r.userData.root;r=r.parent}return null},setHighlight(e,t,o=!1){const n=o?new a.Color(3718648):new a.Color(10741301),r=o?.65:.32;e.traverse(s=>{var c;!s.isMesh||!((c=s.material)!=null&&c.emissive)||(s.userData.originalEmissive||(s.userData.originalEmissive=s.material.emissive.clone(),s.userData.originalIntensity=s.material.emissiveIntensity||0),t?(s.material.emissive.copy(n),s.material.emissiveIntensity=r):(s.material.emissive.copy(s.userData.originalEmissive),s.material.emissiveIntensity=s.userData.originalIntensity))})},updateTooltip(e){if(!this.tooltip)return;if(!e){this.tooltip.innerHTML='<span class="cf-tooltip-dot"></span><div><strong>Hover a tower</strong><small>Click to inspect rack details</small></div>';return}const t=e.userData||{},o=Array.isArray(t.plants)?t.plants.length:0;this.tooltip.innerHTML=`
            <span class="cf-tooltip-dot ${t.status||"healthy"}"></span>
            <div><strong>${x(t.label||"Station")}</strong><small>${t.isDevice?`${t.scope||"farm"} ${t.type}`:o?`${o} active plants`:t.isTank?"Nutrient station":"Empty zone"}</small></div>
        `},showOverview(){var t;const e=this.slotPlants.filter(Boolean).length;this.detailPanel.innerHTML=ee({title:((t=this.farm)==null?void 0:t.name)||g.farmName||"Commercial Farm",subtitle:`${this.rack.label} · ${e}/${this.rack.total} planted`,status:W(this.slotPlants,this.sensorSnapshot),mode:"Facility overview"}),this.mascotSelectedContext=null,this.updateMascotBubble()},showRootDetail(e){const t=e.userData||{};if(t.isTank){this.detailPanel.innerHTML=it(t,this.sensorSnapshot);return}if(t.isDevice){this.detailPanel.innerHTML=ct(t);return}const o=Array.isArray(t.plants)?t.plants:[];this.detailPanel.innerHTML=st(t,o,this.sensorSnapshot)},moveMascotToRoot(e){if(!this.mascotGroup||!this.mascotTarget)return;if(!e){this.mascotTarget.copy(this.mascotHome||new a.Vector3(4.35,.58,4.7)),this.mascotBaseY=this.mascotTarget.y,this.mascotSelectedContext=null,this.updateMascotBubble();return}const t=new a.Box3().setFromObject(e),o=t.getCenter(new a.Vector3),n=t.getSize(new a.Vector3),r=o.x>=0?1:-1,s=o.z>=0?1:-1;this.mascotTarget.set(a.MathUtils.clamp(o.x+r*Math.max(.7,n.x*.36),-7.2,7.2),.58,a.MathUtils.clamp(o.z+s*Math.max(.5,n.z*.26),-5.9,5.9)),this.mascotBaseY=this.mascotTarget.y,this.mascotSelectedContext=this.contextFromRoot(e),this.updateMascotBubble()},contextFromRoot(e){const t=(e==null?void 0:e.userData)||{},o={...this.sensorSnapshot||{}};return t.isDevice?{objectType:t.type==="output"?"output":"sensor",label:t.label||"Device",key:t.key||"",scope:t.scope||"farm",zoneId:t.zoneId||"",zoneLabel:t.zoneLabel||"",status:t.status||"healthy",value:t.value||"",purpose:le(t.key),latestReading:o,prompt:`${t.label||"This device"} context`}:t.isTank?{objectType:"tank",label:`${t.label||"Nutrient"} tank`,status:t.status||"healthy",latestReading:o,prompt:`${t.label||"Nutrient"} tank context`}:t.isTower?{objectType:"zone",label:t.label||"Zone",zoneId:t.id||"",crop:t.crop||"",status:t.status||"empty",plantCount:Array.isArray(t.plants)?t.plants.length:0,latestReading:o,prompt:`${t.label||"Zone"} context`}:null},getSelectedContext(){var e;return this.mascotSelectedContext||this.contextFromRoot(this.selectedRoot)||{objectType:"facility",label:((e=this.farm)==null?void 0:e.name)||g.farmName||"Commercial Farm",status:W(this.slotPlants,this.sensorSnapshot),latestReading:{...this.sensorSnapshot||{}},prompt:"Commercial farm context"}},updateMascotBubble(){if(!this.mascotBubble)return;const e=this.mascotSelectedContext,t=String((e==null?void 0:e.status)||"").toLowerCase(),o=t.includes("warning")||t.includes("danger")||t.includes("critical"),n=e?"I am checking this now":"I am SeedDown AI";let r="Click a zone, sensor, tank, or output and I will explain what the live data means.";(e==null?void 0:e.objectType)==="zone"?r=`I am looking at ${e.label}. I can explain its temperature, pH, water, and risk status.`:(e==null?void 0:e.objectType)==="sensor"?r=`This ${e.label} is linked to ${e.zoneLabel||e.scope||"the farm"}. Ask me what this reading means.`:(e==null?void 0:e.objectType)==="output"?r=`This ${e.label} controls ${e.purpose||"farm automation"}. I can explain when it should run.`:(e==null?void 0:e.objectType)==="tank"?r=`I am checking the ${e.label}. I can explain how it affects nutrient balance.`:e&&(r=`I am looking at ${e.label}. Ask me what the current data means.`),e&&o&&(r="This area may need attention. I can help you understand the risk before you act."),this.mascotBubble.innerHTML=`
            <div class="cf-mascot-kicker">SeedDown AI</div>
            <button type="button" class="cf-mascot-hide" data-mascot-hide aria-label="Hide SeedDown AI">Hide</button>
            <strong>${x(n)}</strong>
            <span>${x(r)}</span>
            <button type="button" data-mascot-ask>Ask now</button>
        `},setMascotVisible(e){this.mascotVisible=!!e,this.mascotGroup&&(this.mascotGroup.visible=this.mascotVisible),this.mascotBubble&&(this.mascotBubble.style.display=this.mascotVisible?"block":"none")},async toggleFullscreen(){if(!this.parent)return;!this.parent.classList.contains("cf-expanded")?this.enterExpandedView():this.exitExpandedView()},enterExpandedView(){!this.parent||this.parent.classList.contains("cf-expanded")||(this.originalParent=this.parent.parentNode,this.originalNextSibling=this.parent.nextSibling,document.body.appendChild(this.parent),this.parent.classList.add("cf-expanded"),document.documentElement.classList.add("cf-expanded-lock"),document.body.classList.add("cf-expanded-lock"),this.syncExpandButton(),this.setCameraFrame(!0),requestAnimationFrame(()=>this.resize()),setTimeout(()=>this.resize(),120))},exitExpandedView(){this.parent&&(this.parent.classList.remove("cf-expanded"),document.documentElement.classList.remove("cf-expanded-lock"),document.body.classList.remove("cf-expanded-lock"),this.restoreHostPlacement(),this.syncExpandButton(),this.setCameraFrame(!1),requestAnimationFrame(()=>this.resize()),setTimeout(()=>this.resize(),120))},restoreHostPlacement(){!this.parent||!this.originalParent||(this.originalNextSibling&&this.originalNextSibling.parentNode===this.originalParent?this.originalParent.insertBefore(this.parent,this.originalNextSibling):this.originalParent.appendChild(this.parent),this.originalParent=null,this.originalNextSibling=null)},syncExpandButton(){!this.fullscreenButton||!this.parent||(this.fullscreenButton.textContent=this.parent.classList.contains("cf-expanded")?"CLOSE":"EXPAND")},resize(){var c,l;if(!this.canvas||!this.renderer||!this.camera)return;const e=(c=this.parent)==null?void 0:c.classList.contains("cf-expanded"),t=(l=this.parent)==null?void 0:l.classList.contains("commercial-command-screen"),o=e||t;t&&(te(this.parent,{position:"fixed",inset:"0",width:"100vw",height:"100vh",minHeight:"100vh",overflow:"hidden",borderRadius:"0"}),te(this.canvas,{position:"fixed",inset:"0",width:"100vw",height:"100vh",minHeight:"100vh",display:"block",borderRadius:"0"}));const n=this.canvas.getBoundingClientRect(),r=o?window.innerWidth||document.documentElement.clientWidth||n.width||1280:Math.max(320,n.width||this.parent.clientWidth||640),s=o?window.innerHeight||document.documentElement.clientHeight||n.height||720:Math.max(300,n.height||420);this.renderer.setSize(r,s,!1),this.camera.aspect=r/s,this.camera.updateProjectionMatrix()},animate(){var t,o;const e=Math.min(.04,((o=(t=this.clock)==null?void 0:t.getDelta)==null?void 0:o.call(t))||.016);this.frame+=1,this.controls&&this.controls.update(),this.updateParticles(),this.updateMascot(),this.positionMascotBubble(),this.scene.traverse(n=>{var r,s;(r=n.userData)!=null&&r.isFanBlade&&(n.rotation.z+=4.8*e),(s=n.userData)!=null&&s.isDrip&&(n.position.y-=.55*e,n.position.y<.7&&(n.position.y=n.userData.baseY))}),this.renderer&&this.scene&&this.camera&&this.renderer.render(this.scene,this.camera),this.rafId=requestAnimationFrame(()=>this.animate())},updateMascot(){if(!this.mascotGroup||!this.mascotTarget)return;const e=this.mascotGroup.position,t=new a.Vector3(this.mascotTarget.x-e.x,0,this.mascotTarget.z-e.z),o=t.length();if(this.mascotWalking=o>.045,this.mascotWalking){const r=Math.min(o,.045+o*.025);t.normalize(),e.x+=t.x*r,e.z+=t.z*r,this.mascotWalkPhase+=.32;const s=Math.abs(Math.sin(this.mascotWalkPhase))*.035;e.y+=((this.mascotBaseY||.58)+s-e.y)*.24,this.mascotGroup.rotation.y=Math.atan2(t.x,t.z),this.mascotGroup.rotation.z=Math.sin(this.mascotWalkPhase)*.11,this.mascotGroup.rotation.x=Math.cos(this.mascotWalkPhase*.8)*.035;return}const n=(this.mascotBaseY||.58)+Math.sin(this.frame*.045)*.025;e.x+=(this.mascotTarget.x-e.x)*.08,e.z+=(this.mascotTarget.z-e.z)*.08,e.y+=(n-e.y)*.12,this.mascotGroup.rotation.x+=(0-this.mascotGroup.rotation.x)*.08,this.mascotGroup.rotation.z+=(0-this.mascotGroup.rotation.z)*.08,this.mascotGroup.rotation.y+=(Math.sin(this.frame*.028)*.06-this.mascotGroup.rotation.y)*.08},positionMascotBubble(){if(!this.mascotVisible||!this.mascotBubble||!this.mascotGroup||!this.camera||!this.canvas||!this.parent)return;const e=new a.Vector3;this.mascotGroup.getWorldPosition(e),e.y+=.58;const t=e.project(this.camera);if(t.z<-1||t.z>1){this.mascotBubble.style.opacity="0";return}const o=this.canvas.getBoundingClientRect(),n=this.parent.getBoundingClientRect(),r=this.mascotBubble.offsetWidth||280,s=this.mascotBubble.offsetHeight||112,c=o.left-n.left+(t.x*.5+.5)*o.width,l=o.top-n.top+(-t.y*.5+.5)*o.height,i=c+r+38>n.width,u=i?c-r-24:c+24,m=l-s*.72,p=a.MathUtils.clamp(u,12,Math.max(12,n.width-r-12)),d=a.MathUtils.clamp(m,112,Math.max(112,n.height-s-18));this.mascotBubble.classList.toggle("from-left",i),this.mascotBubble.style.setProperty("left",`${p}px`,"important"),this.mascotBubble.style.setProperty("top",`${d}px`,"important"),this.mascotBubble.style.setProperty("right","auto","important"),this.mascotBubble.style.setProperty("bottom","auto","important"),this.mascotBubble.style.setProperty("opacity","1","important")},updateParticles(){if(!this.particles)return;const e=this.particles.geometry.attributes.position,t=this.particles.userData.velocities;for(let o=0;o<e.count;o++)e.array[o*3]+=t[o*3],e.array[o*3+1]+=t[o*3+1],e.array[o*3+2]+=t[o*3+2],e.array[o*3]>7.5&&(e.array[o*3]=-7.5),e.array[o*3]<-7.5&&(e.array[o*3]=7.5),e.array[o*3+1]>5.4&&(e.array[o*3+1]=.7),e.array[o*3+2]>5.5&&(e.array[o*3+2]=-5.5),e.array[o*3+2]<-5.5&&(e.array[o*3+2]=5.5);e.needsUpdate=!0},createTextSprite(e,t={}){const o=document.createElement("canvas");o.width=512,o.height=128;const n=o.getContext("2d");n.clearRect(0,0,o.width,o.height),rt(n,18,22,o.width-36,84,28),n.fillStyle=t.bg||"rgba(12,20,14,.9)",n.fill(),t.border&&(n.strokeStyle=t.border,n.lineWidth=4,n.stroke()),n.fillStyle=t.fg||"#ffffff",n.font=t.font||"900 30px Inter, system-ui, sans-serif",n.textAlign="center",n.textBaseline="middle",n.fillText(e,o.width/2,66);const r=new a.CanvasTexture(o);r.colorSpace=a.SRGBColorSpace;const s=new a.SpriteMaterial({map:r,transparent:!0,depthWrite:!1}),c=new a.Sprite(s);return c.userData.texture=r,c},destroy(){var e;this.rafId&&cancelAnimationFrame(this.rafId),this.rafId=null,this.resizeHandler&&window.removeEventListener("resize",this.resizeHandler),this.fullscreenHandler&&document.removeEventListener("fullscreenchange",this.fullscreenHandler),this.mascotVisibilityHandler&&window.removeEventListener("seeddown:mascotVisibility",this.mascotVisibilityHandler),this.canvas&&this.onPointerMove&&this.canvas.removeEventListener("pointermove",this.onPointerMove),this.canvas&&this.onClick&&this.canvas.removeEventListener("click",this.onClick),this.canvas&&this.onDoubleClick&&this.canvas.removeEventListener("dblclick",this.onDoubleClick),this.canvas&&this.onWheel&&this.canvas.removeEventListener("wheel",this.onWheel),this.controls&&this.controls.dispose(),this.scene&&this.scene.traverse(t=>{var o;t.geometry&&t.geometry.dispose(),(o=t.userData)!=null&&o.texture&&t.userData.texture.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(n=>n.dispose()):t.material.dispose())}),this.renderer&&this.renderer.dispose(),(e=this.parent)!=null&&e.classList.contains("cf-expanded")&&this.exitExpandedView(),this.parent&&(this.parent.classList.remove("cf-expanded"),this.parent.querySelectorAll(".cf-overlay, .cf-tooltip, .cf-expand-btn, .cf-zoom-controls").forEach(t=>t.remove()),this.parent.classList.remove("commercial-farm-host")),document.documentElement.classList.remove("cf-expanded-lock"),document.body.classList.remove("cf-expanded-lock"),this.canvas=null,this.parent=null,this.renderer=null,this.scene=null,this.camera=null,this.controls=null,this.farmGroup=null,this.particles=null,this.raycaster=null,this.pointer=null,this.interactiveRoots=[],this.hoverRoot=null,this.selectedRoot=null,this.detailPanel=null,this.tooltip=null,this.fullscreenButton=null,this.zoomControls=null,this.mascotGroup=null,this.mascotTarget=null,this.mascotHome=null,this.mascotBaseY=.58,this.mascotWalkPhase=0,this.mascotWalking=!1,this.mascotVisible=!0,this.mascotVisibilityHandler=null,this.mascotBubble=null,this.mascotSelectedContext=null,this.originalParent=null,this.originalNextSibling=null,this.resizeHandler=null,this.fullscreenHandler=null,this.onPointerMove=null,this.onClick=null,this.onDoubleClick=null,this.onWheel=null}};function Oe(){const e=Ve();return g.currentFarm||e.find(t=>t.id===g.currentFarmId)||e[e.length-1]||null}function Ve(){try{return JSON.parse(localStorage.getItem(Ze))||[]}catch{return[]}}function We(e){if(G(e).length){const o=G(e).length;return{id:"commercial-zones",label:`${o}-Zone Commercial Farm`,tiers:o,slotsPerTier:12,total:Math.max(12,o*12)}}const t=String((e==null?void 0:e.rackTypeId)||(e==null?void 0:e.rackType)||(e==null?void 0:e.rackLabel)||"").toLowerCase();return t.includes("2")?E["2-tier"]:t.includes("4")?E["4-tier"]:t.includes("5")?E["5-tier"]:t.includes("wall")||t.includes("grid")?E.wall:t.includes("frame")?E["a-frame"]:t.includes("nft")||t.includes("channel")?E["nft-channel"]:t.includes("hanging")||t.includes("column")?E.hanging:E["3-tier"]}function je(e,t){const o=Array.isArray(e==null?void 0:e.plants)?e.plants:[],n=G(e),r=n.length?Math.max(t.total,n.length*12,o.length*3):t.total,s=Array(r).fill(null),c=new Set;if(o.forEach((i,u)=>{var p;if(n.length&&i.zoneId){const d=n.findIndex(b=>Ue(b,i)),h=Math.max(0,d)*12,f=Math.max(1,Number.parseInt(i.slots||i.count||1,10)||1);for(let b=0;b<f;b++){const S=Qe(s,c,h,h+12)??J(s,c);if(S===-1||S===null||S===void 0)return;s[S]=_(i,S,t,e),s[S].zoneId=i.zoneId,s[S].zoneName=i.zoneName||((p=n[d])==null?void 0:p.name)||i.zoneId,c.add(S)}return}if(i.slotIndex!==void 0&&i.slotIndex!==null){const d=Number(i.slotIndex);Number.isInteger(d)&&d>=0&&d<s.length&&(s[d]=_(i,d,t,e),c.add(d));return}const m=Math.max(1,Number.parseInt(i.slots||i.count||1,10)||1);for(let d=0;d<m;d++){const h=J(s,c);if(h===-1)return;s[h]=_(i,h,t,e),c.add(h)}}),s.some(Boolean))return s;const l=Math.min(t.total,Number.parseInt((e==null?void 0:e.plantSlots)||(e==null?void 0:e.plants)||0,10)||0);for(let i=0;i<l;i++)s[i]=_({name:(e==null?void 0:e.targetPlant)||"Plant",status:"healthy"},i,t,e);return s}function G(e){var r;const t=Array.isArray(e==null?void 0:e.zones)?e.zones:Array.isArray((r=e==null?void 0:e.commercialStructure)==null?void 0:r.zones)?e.commercialStructure.zones:[];if(t.length)return t.map((s,c)=>({...s,zone_id:s.zone_id||s.id||`zone_${String.fromCharCode(65+c)}`,name:s.name||`Zone ${String.fromCharCode(65+c)}`})).filter(s=>s.zone_id||s.name);const o=Array.isArray(e==null?void 0:e.plants)?e.plants:[],n=new Map;return o.forEach((s,c)=>{const l=s.zoneId||s.zone_id||s.zone||s.area;if(!l)return;const i=String(l);n.has(i)||n.set(i,{zone_id:i,name:s.zoneName||`Zone ${String.fromCharCode(65+n.size)}`,crop:s.name||s.species||"Mixed crops",plants:[]});const u=n.get(i),m=s.name||s.species||`Plant ${c+1}`;u.plants.includes(m)||u.plants.push(m),u.crop=u.plants.join(", ")}),n.size?[...n.values()]:(e==null?void 0:e.accountMode)==="commercial"||(e==null?void 0:e.viewMode)==="commercial"?[{zone_id:"zone_A",name:e!=null&&e.name?`${e.name} Zone`:"Zone A",crop:(e==null?void 0:e.targetPlant)||"Commercial crops",plants:e!=null&&e.targetPlant?String(e.targetPlant).split(",").map(s=>s.trim()).filter(Boolean):["Commercial crops"]}]:[]}function Ue(e,t){const o=String(t.zoneId||t.zone_id||t.zone||"").toLowerCase();return o&&(o===String(e.zone_id||"").toLowerCase()||o===String(e.id||"").toLowerCase()||o===String(e.name||"").toLowerCase())}function Qe(e,t,o,n){const r=Math.max(0,o),s=Math.min(e.length,n);for(let c=r;c<s;c++)if(!e[c]&&!t.has(c))return c;return null}function _(e,t,o,n){const r=e.name||(n==null?void 0:n.targetPlant)||"Plant";return{name:r,emoji:e.emoji||lt(r),species:e.species||de(r),status:e.status||qe(e.growth),growth:Number(e.growth??70),days:Number(e.days??0),slotIndex:t,tier:Math.floor(t/o.slotsPerTier)+1,position:t%o.slotsPerTier+1}}function J(e,t){for(let o=0;o<e.length;o++)if(!e[o]&&!t.has(o))return o;return-1}function qe(e){const t=Number(e??80);return t<35?"danger":t<60?"warning":"healthy"}function V(e){return e==="danger"?15680580:e==="warning"?16096779:e==="empty"?6583435:8702998}function Ye(e){return e.length?e.some(t=>t.status==="danger")?"danger":e.some(t=>t.status==="warning")?"warning":"healthy":"empty"}function W(e,t){return e.some(Boolean)&&e.some(o=>(o==null?void 0:o.status)==="danger")?"Critical plant risk":Number(t.gasRaw||0)>2500||Number(t.temperature||25)>35?"Automation alert":e.some(o=>(o==null?void 0:o.status)==="warning")?"Needs review":"Operational"}function j(){const e=g.sensors||{},t=g.latestReading||g.currentReading||{},o=(n,...r)=>{for(const s of r){const c=s&&typeof s=="object"&&"val"in s?s.val:s,l=Number(c);if(Number.isFinite(l))return l}return n};return{temperature:o(25,e.temp,e.temperature,t.temperature,t.temp),humidity:o(60,e.humid,e.humidity,t.humidity,t.humid),lightRaw:o(2e3,e.lightRaw,e.light,t.lightRaw,t.light),soilRaw:o(1800,e.soilRaw,e.soil,t.soilRaw,t.soilMoisture,t.moisture),ph:o(6.1,e.ph,t.ph),waterDistanceCm:o(10,e.water,e.waterDistanceCm,t.waterDistanceCm,t.waterLevel),gasRaw:o(1e3,e.nutrient,e.gasRaw,t.gasRaw,t.gasValue),ec:o(1.5,e.ec,t.ec),co2Ppm:o(850,e.co2,t.co2Ppm),energyKwh:o(5.1,e.energy,e.energyKwh,t.energyKwh),waterFlowLpm:o(.8,e.flow,e.waterFlowLpm,t.waterFlowLpm)}}function Ke(){const e=g.latestReadingMeta||{},t=g.latestReading||g.currentReading||{},o=e.fetchedAt||t._fetchedAt||t.createdAt||t.updatedAt||t.timestamp;let n=null;if(o instanceof Date?n=o:o&&typeof o=="object"?typeof o.toDate=="function"?n=o.toDate():o._seconds?n=new Date(o._seconds*1e3):o.seconds&&(n=new Date(o.seconds*1e3)):o&&(n=new Date(o)),!n||Number.isNaN(n.getTime()))return"--";const r=e.stale||t._stale?" cached":"";return`${n.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}${r}`}function Je(e,t){return{dht11:`${Number(t.temperature||0).toFixed(1)}C / ${Number(t.humidity||0)}%`,soil:`${Number(t.soilRaw||1800)} raw`,ldr:`${Number(t.lightRaw||0)} raw`,ph:`${Number(t.ph||0).toFixed(1)} pH`,ec:`${Number(t.ec||1.5).toFixed(1)} EC`,flow:`${Number(t.waterFlowLpm||.8).toFixed(1)} L/min`,pump:Number(t.waterDistanceCm||0)>20?"ready":"standby",zone_fan:Number(t.temperature||25)>30?"active":"standby",active_buzzer:Number(t.gasRaw||0)>2500?"alert":"ready",camera:"scan ready"}[e]||"--"}function Xe(e){return{dht11:"DHT",soil:"SOIL",ldr:"LDR",ph:"pH",ec:"EC",flow:"FLOW",pump:"PUMP",zone_fan:"FAN",active_buzzer:"BUZZ",camera:"CAM"}[e]||String(e).slice(0,4).toUpperCase()}function et(e){const t=String(e.value||"").toLowerCase();return t.includes("alert")||t.includes("danger")?"danger":t.includes("active")?"warning":"healthy"}function tt(e){const t=Number(e.ph??6.1);return t<5.5||t>6.5}function ot(e){const t=de((e==null?void 0:e.species)||(e==null?void 0:e.name)||"plant"),o=R[t];if(o)return o;const n=Object.keys(R).find(r=>t.includes(r));return R[n]||R.plant}function nt(e,t,o,n){return Number.isNaN(e)?!1:e%n===o||Math.floor(e/Math.max(1,t.slotsPerTier))===o}function at(e,t,o,n,r,s={}){return e!=null&&e.zoneId&&s.zoneId?String(e.zoneId).toLowerCase()===String(s.zoneId).toLowerCase():e!=null&&e.zoneName&&s.label?String(e.zoneName).toLowerCase()===String(s.label).toLowerCase():nt(t,o,n,r)}function X(e,t,o){const n=new a.BufferGeometry().setFromPoints([new a.Vector3(...e),new a.Vector3(...t)]);return new a.Line(n,o)}function rt(e,t,o,n,r,s){e.beginPath(),e.moveTo(t+s,o),e.lineTo(t+n-s,o),e.quadraticCurveTo(t+n,o,t+n,o+s),e.lineTo(t+n,o+r-s),e.quadraticCurveTo(t+n,o+r,t+n-s,o+r),e.lineTo(t+s,o+r),e.quadraticCurveTo(t,o+r,t,o+r-s),e.lineTo(t,o+s),e.quadraticCurveTo(t,o,t+s,o),e.closePath()}function ee({title:e,subtitle:t,status:o,mode:n}){return`
        <div class="cf-panel-kicker">${x(n)}</div>
        <div class="cf-panel-title">${x(e)}</div>
        <div class="cf-panel-sub">${x(t)}</div>
        <div class="cf-mini-grid">
            ${M("Status",o)}
            ${M("Light",`${Math.round(Number(j().lightRaw||0))}`)}
            ${M("pH",`${Number(j().ph||0).toFixed(1)}`)}
            ${M("Updated",Ke())}
        </div>
    `}function st(e,t,o){const n=t.filter(c=>c.status==="healthy").length,r=t.filter(c=>c.status==="warning").length,s=t.filter(c=>c.status==="danger").length;return`
        <div class="cf-panel-kicker">Selected production zone</div>
        <div class="cf-panel-title">${x(e.label||"Zone")}</div>
        <div class="cf-panel-sub">${t.length||0} active plants · ${x(e.status||"empty")}</div>
        <div class="cf-mini-grid">
            ${M("Healthy",n)}
            ${M("Warning",r)}
            ${M("Critical",s)}
            ${M("Temp",`${Number(o.temperature||0).toFixed(1)}C`)}
        </div>
        <div class="cf-plant-list">
            ${t.slice(0,5).map(c=>`<span>${x(c.name)} <b>${x(c.status)}</b></span>`).join("")||"<span>No assigned crop yet</span>"}
        </div>
    `}function it(e,t){return`
        <div class="cf-panel-kicker">Nutrient station</div>
        <div class="cf-panel-title">${x(e.label||"Tank")} Tank</div>
        <div class="cf-panel-sub">Linked to commercial automation controls</div>
        <div class="cf-mini-grid">
            ${M("pH",`${Number(t.ph||0).toFixed(1)}`)}
            ${M("Water",`${Number(t.waterDistanceCm||0)}cm`)}
            ${M("Status",x(e.status||"healthy"))}
        </div>
    `}function ct(e){const t=e.scope==="zone"?e.zoneLabel||e.zoneId||"Zone":"Farm Level",o=e.type==="output"?"Actuator / Output":"Sensor";return`
        <div class="cf-panel-kicker">Digital twin device</div>
        <div class="cf-panel-title">${x(e.label||"Device")}</div>
        <div class="cf-panel-sub">${x(t)} · ${x(o)}</div>
        <div class="cf-mini-grid">
            ${M("Value",e.value||"--")}
            ${M("Status",e.status||"healthy")}
            ${M("Type",e.type||"sensor")}
        </div>
        <div class="cf-plant-list">
            <span>Layer <b>${x(e.scope==="zone"?"ZONE":"FARM")}</b></span>
            <span>Clickable <b>YES</b></span>
            <span>Purpose <b>${x(le(e.key))}</b></span>
        </div>
    `}function le(e){return{co2:"air enrichment",reservoir:"water level",gas:"safety alert",power:"energy tracking",main_fan:"facility airflow",emergency_buzzer:"emergency alarm",dht11:"temperature humidity",soil:"root moisture",ldr:"light detection",ph:"water acidity",ec:"nutrient strength",flow:"irrigation flow",pump:"irrigation output",zone_fan:"zone airflow",active_buzzer:"zone warning",camera:"plant vision"}[e]||"monitoring"}function M(e,t){return`<div class="cf-mini-metric"><span>${x(e)}</span><strong>${x(t)}</strong></div>`}function lt(e=""){const t=String(e).toLowerCase();return t.includes("lettuce")||t.includes("cabbage")||t.includes("kale")?"🥬":t.includes("tomato")?"🍅":t.includes("chili")||t.includes("pepper")?"🌶️":t.includes("strawberry")?"🍓":t.includes("cucumber")?"🥒":t.includes("carrot")?"🥕":t.includes("eggplant")?"🍆":t.includes("basil")||t.includes("mint")||t.includes("spinach")?"🌿":"🌱"}function de(e=""){return String(e||"plant").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function x(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function te(e,t){e&&Object.entries(t).forEach(([o,n])=>{const r=o.replace(/[A-Z]/g,s=>"-"+s.toLowerCase());e.style.setProperty(r,n,"important")})}function dt(){if(document.getElementById("commercial-farm-canvas-style"))return;const e=document.createElement("style");e.id="commercial-farm-canvas-style",e.textContent=`
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
    `,document.head.appendChild(e)}const $=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,T={"2-tier":{label:"2-Tier Starter Rack",tiers:2,slotsPerTier:3,total:6},"3-tier":{label:"3-Tier Vertical Rack",tiers:3,slotsPerTier:3,total:9},"4-tier":{label:"4-Tier Grow Shelf",tiers:4,slotsPerTier:4,total:16},"5-tier":{label:"5-Tier Tower Rack",tiers:5,slotsPerTier:4,total:20},wall:{label:"Wall Panel Grid",tiers:4,slotsPerTier:5,total:20},"a-frame":{label:"A-Frame Pyramid",tiers:4,slotsPerTier:4,total:16},"nft-channel":{label:"NFT Channel Rows",tiers:3,slotsPerTier:6,total:18},hanging:{label:"Hanging Column Farm",tiers:5,slotsPerTier:3,total:15}};let B=[],z=null,H={},A=null;const me="seeddown_commercial_live_cache",pe="seeddown_last_camera_snapshot",mt=[{id:"zone_A",label:"Zone A",crop:"Leafy Greens"},{id:"zone_B",label:"Zone B",crop:"Fruit Crops"},{id:"zone_C",label:"Zone C",crop:"Herbs"},{id:"zone_D",label:"Zone D",crop:"Mixed Crops"},{id:"zone_E",label:"Zone E",crop:"Mixed Crops"},{id:"zone_F",label:"Zone F",crop:"Mixed Crops"}],pt={zone_A:"commercial-zone-node-1",zone_B:"commercial-zone-node-2",zone_C:"commercial-zone-node-3",zone_D:"commercial-zone-node-4",zone_E:"commercial-zone-node-5",zone_F:"commercial-zone-node-6"},U="commercial-farm-master-1",ut={sd_demo_commercial_zone_node_1:"SD-COM-ZON-01001",sd_demo_commercial_zone_node_2:"SD-COM-ZON-01002",sd_demo_commercial_zone_node_3:"SD-COM-ZON-01003",sd_demo_commercial_farm_master_1:"SD-COM-FRM-03001"};function Wt(){const e=document.getElementById("screenContainer"),t=v();g.currentFarm=t;const o=O(t),n=Te(t,o),r=n.total?Math.min(100,Math.round(n.planted/n.total*100)):0;z||(z=Be(t)),e.innerHTML=`
        <div class="screen active commercial-command-screen" id="commercialScreen">
            <canvas id="commercialFarmCanvas" class="commercial-command-canvas"></canvas>

            <div class="commercial-top-shell">
                <button id="comBackBtn" class="commercial-icon-btn" aria-label="Back to farms">←</button>
                <div class="commercial-title-card">
                    <div class="commercial-kicker">Commercial Digital Twin</div>
                    <div class="commercial-title-row">
                        <strong>${w((t==null?void 0:t.name)||g.farmName||"Commercial Farm")}</strong>
                        <span>${r}% occupied</span>
                    </div>
                    <small>${w(n.label)} · ${n.planted}/${n.total} planted</small>
                </div>
            </div>

            <button id="panelToggleBtn" class="commercial-panel-toggle" aria-label="Hide operations panel">Hide Panel</button>

            <aside id="commercialOpsPanel" class="commercial-ops-panel">
                <div class="ops-panel-header">
                    <div>
                        <div class="commercial-kicker">Operations</div>
                        <strong>Farm Command Center</strong>
                    </div>
                    <button id="panelCloseBtn" class="commercial-icon-btn small" aria-label="Hide panel">×</button>
                </div>

                 <div class="ops-scroll">

    <!-- FARM MASTER OVERVIEW -->
    <section class="ops-section" id="farmMasterSection" style="border-left:4px solid #22c55e;">
        <div class="ops-section-title" style="color:#15803d;">🏭 Farm Master · Overall</div>
       <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
    <button class="fm-tile fm-drill" data-key="water" type="button">
        <span>Water Level</span>
        <strong id="fm-water">--</strong>
    </button>
    <button class="fm-tile fm-drill" data-key="gas" type="button">
        <span>Gas</span>
        <strong id="fm-gas">--</strong>
    </button>
    <button class="fm-tile fm-drill" data-key="co2" type="button">
        <span>CO₂</span>
        <strong id="fm-co2">--</strong>
    </button>
    <button class="fm-tile fm-drill" data-key="energy" type="button">
        <span>Energy</span>
        <strong id="fm-energy">--</strong>
    </button>
</div>
<div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;">
    <div style="font-size:11px;color:#047857;font-weight:750;line-height:1.45;" id="fm-status-text">Syncing farm master...</div>
    <button id="farmMasterDetailBtn" type="button" style="font-size:10px;font-weight:950;color:#166534;background:#dcfce7;border:1px solid #bbf7d0;border-radius:999px;padding:5px 10px;cursor:pointer;">View All →</button>
</div>
    </section>
   

                    <section class="ops-section advisor-section">
                        <div class="ops-section-title">AI Farm Advisor</div>
                        <div id="ai-overview-text" class="advisor-text">Syncing commercial farm data...</div>
                    </section>

                    

                    <section class="ops-section">
<div class="ops-section-title">Zone Health · Tap to drill in</div>
                        <div class="zone-overview-grid">
                            ${Ce(t,o)}
                        </div>
                    </section>

                

                    <section class="ops-section">
                        <div class="ops-section-title">Tools</div>
                        <div class="ops-tool-grid">
                            ${L("whatif","🔮","What-If")}
                            ${L("control","🎛️","Control")}
                            ${L("disease","🧫","Disease")}
                            ${L("camera","📷","Camera")}
                            ${L("consumption","⚡","ESG")}
                            ${L("alerts","🚨","Alerts")}
                            <button id="assignDeviceBtn" class="ops-tool-btn" type="button"><span>📡</span><strong>Assign Device</strong></button>
                            <button id="fabPlant" class="ops-tool-btn" type="button"><span>🌱</span><strong>Add Plant</strong></button>
                        </div>
                    </section>

                    <section class="ops-section chat-section">
                        <div class="ops-section-title">AI Chat</div>
                        <div id="commercialChatLog" class="commercial-chat-log">
                            <div class="chat-bubble ai">Ask about yield, disease risk, energy, crop planning, or sensor readings.</div>
                        </div>
                        <div class="commercial-chat-input-row">
                            <input id="commercialChatInput" placeholder="Ask SeedDown AI..." autocomplete="off">
                            <button id="commercialChatSend" type="button">Send</button>
                        </div>
                    </section>
                </div>
            </aside>
        </div>
    `,Gt(),ht(),ft(),ue()}function ht(){var e,t,o,n,r,s,c,l;(e=document.getElementById("comBackBtn"))==null||e.addEventListener("click",()=>{clearInterval(g.proInterval),I("farmlist")}),(t=document.getElementById("fabPlant"))==null||t.addEventListener("click",Ge),(o=document.getElementById("assignDeviceBtn"))==null||o.addEventListener("click",Mt),(n=document.getElementById("panelToggleBtn"))==null||n.addEventListener("click",oe),(r=document.getElementById("panelCloseBtn"))==null||r.addEventListener("click",oe),(s=document.getElementById("commercialChatSend"))==null||s.addEventListener("click",Q),(c=document.getElementById("commercialChatInput"))==null||c.addEventListener("keydown",i=>{i.key==="Enter"&&Q()}),window.removeEventListener("seeddown:mascotAsk",ae),window.addEventListener("seeddown:mascotAsk",ae),document.querySelectorAll(".fm-drill").forEach(i=>{i.addEventListener("click",()=>{clearInterval(g.proInterval),I("farm-master-detail",{key:i.getAttribute("data-key"),from:"dash-c"})})}),(l=document.getElementById("farmMasterDetailBtn"))==null||l.addEventListener("click",()=>{clearInterval(g.proInterval),I("farm-master-detail",{from:"dash-c"})}),document.querySelectorAll(".com-feat").forEach(i=>{i.addEventListener("click",()=>{const u=i.getAttribute("data-feature");clearInterval(g.proInterval),u==="whatif"?I("whatif-pro"):u==="control"?I("control"):u==="disease"?I("disease"):u==="camera"?(ue(),ze()):u==="alerts"?I("alert-commercial"):I("feature",{feature:u,from:"dash-c"})})})}function oe(){const e=document.getElementById("commercialScreen"),t=document.getElementById("panelToggleBtn"),o=e==null?void 0:e.classList.toggle("panel-hidden");t&&(t.textContent=o?"Show Panel":"Hide Panel"),setTimeout(P,120)}function ft(){setTimeout(()=>{var e;y.init("commercialFarmCanvas",v()),gt(),P(),(e=y.setCameraFrame)==null||e.call(y,!1),P(),requestAnimationFrame(P),setTimeout(P,120),setTimeout(P,350),window.addEventListener("resize",P)},80)}function ne(e,t){e&&Object.entries(t).forEach(([o,n])=>{const r=o.replace(/[A-Z]/g,s=>"-"+s.toLowerCase());e.style.setProperty(r,n,"important")})}function P(){const e=document.getElementById("commercialScreen"),t=document.getElementById("commercialFarmCanvas");if(e&&ne(e,{position:"fixed",inset:"0",width:"100vw",height:"100vh",minHeight:"100vh",overflow:"hidden"}),t&&ne(t,{position:"fixed",inset:"0",width:"100vw",height:"100vh",minHeight:"100vh",borderRadius:"0",display:"block"}),y.renderer&&y.camera){const o=window.innerWidth||document.documentElement.clientWidth||1280,n=window.innerHeight||document.documentElement.clientHeight||720;y.renderer.setSize(o,n,!1),y.camera.aspect=o/n,y.camera.updateProjectionMatrix()}}function gt(){const e=document.getElementById("commercial-command-style");e&&document.head.appendChild(e)}function ue(){clearInterval(g.proInterval),g.aiConsulted=!1;const e=async()=>{var t;try{const o=await fe(`${$}/api/sensors/latest?deviceId=${U}`,{},4500).catch(()=>null);let n=((t=ye("farm_master"))==null?void 0:t.reading)||null;if(o){const r=await o.json().catch(()=>null),s=r==null?void 0:r.reading;s&&(n=xe("farm_master",s,"deviceId="+U).reading)}if(n){const r=(u,m,p)=>{const d=document.getElementById(u);d&&(d.innerText=m,d.style.color=p?"#14532d":"#dc2626")},s=n.waterDistanceCm!=null?Number(n.waterDistanceCm):null,c=n.gasRaw!=null?Number(n.gasRaw):null,l=n.co2Ppm!=null?Number(n.co2Ppm):null,i=n.energyKwh!=null?Number(n.energyKwh):null;r("fm-water",s!=null?`${s.toFixed(1)} cm`:"--",s==null||s>=3&&s<=30),r("fm-gas",c!=null?String(Math.round(c)):"--",c==null||c<3e3),r("fm-co2",l!=null?`${l} ppm`:"--",l==null||l<1500),r("fm-energy",i!=null?`${i.toFixed(2)} kWh`:"--",i==null||i>=0),De("fm-status-text",`Farm master ${we(n)}${n._stale?" · cached":""}`)}if(await wt(),!g.aiConsulted){const r=Y(v(),O(v()))[0],s=await he((r==null?void 0:r.id)||"zone_A");s!=null&&s.reading&&(vt(s.reading),g.aiConsulted=!0)}}catch(o){console.error("Dashboard Sync Failed:",o),q("Live backend offline. Showing saved farm layout.")}};e(),g.proInterval=setInterval(e,8e3)}function bt(e=z){var c;const t=v(),o=k(e),n=[],r=l=>{const i=new URLSearchParams;if(l.forEach(([m,p])=>{p&&i.set(m,p)}),!i.toString())return;const u=i.toString();n.some(m=>m.toString()===u)||n.push(i)},s=Pe(t,o);return o==="farm_master"?(r([["deviceId",((c=t==null?void 0:t.farmMaster)==null?void 0:c.deviceId)||(t==null?void 0:t.deviceId)||U]]),n):s!=null&&s.deviceId?(r([["deviceId",s.deviceId],["zoneId",o]]),r([["zoneId",o]]),n):(r([["zoneId",o]]),r([["deviceId",pt[o]],["zoneId",o]]),n)}async function he(e=z){const t=bt(e);for(const o of t)try{const r=await(await fe(`${$}/api/sensors/latest?${o.toString()}`,{},4500)).json();if(r!=null&&r.reading){const s=xe(e,r.reading,o.toString());return{...r,reading:s.reading,sourceQuery:o.toString()}}}catch(n){console.warn("[CommercialPage] sensor query failed:",o.toString(),n.message)}return ye(e)||{reading:null}}async function fe(e,t={},o=4500){const n=new AbortController,r=setTimeout(()=>n.abort(),o);try{return await fetch(e,{...t,signal:n.signal})}finally{clearTimeout(r)}}function ge(e){const t=v();return`${(t==null?void 0:t.id)||(t==null?void 0:t.backendFarmId)||g.currentFarmId||"commercial_demo"}:${k(e)||e||"farm_master"}`}function be(){try{return JSON.parse(localStorage.getItem(me))||{}}catch{return{}}}function xt(e){try{localStorage.setItem(me,JSON.stringify(e))}catch(t){console.warn("[CommercialPage] could not save live reading cache:",t.message)}}function xe(e,t,o=""){const n={...t,_sourceQuery:o,_fetchedAt:new Date().toISOString(),_stale:!1},r=be();return r[ge(e)]=n,xt(r),{reading:n}}function ye(e){const t=be()[ge(e)];return t?{reading:{...t,_stale:!0}}:null}function yt(e){if(!e)return null;if(e instanceof Date)return e;if(typeof e=="object"){if(typeof e.toDate=="function")return e.toDate();if(e._seconds)return new Date(e._seconds*1e3);if(e.seconds)return new Date(e.seconds*1e3)}const t=new Date(e);return Number.isNaN(t.getTime())?null:t}function we(e){const t=yt((e==null?void 0:e._fetchedAt)||(e==null?void 0:e.createdAt)||(e==null?void 0:e.updatedAt)||(e==null?void 0:e.timestamp));return t?`Last updated ${t.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}`:"Last updated --"}async function wt(){const e=v(),t=Y(e,O(e)),o=await Promise.all(t.map(async n=>{try{const r=await he(n.id);return[n.id,r.reading||null]}catch{return[n.id,null]}}));H=Object.fromEntries(o),Ie()}async function vt(e){const t=`Current sensor data: ${JSON.stringify(e)}. Give one concise operations insight about risk, yield, energy, or automation.`;try{const o=ve(),r=await(await fetch(`${$}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t,mode:"commercial",gardenState:{...o,latestReading:e||o.latestReading}})})).json();q(r.reply||r.response||"Farm is operating normally.")}catch{q("AI Advisor offline. Sensor dashboard still available.")}}async function Q(e=""){const t=document.getElementById("commercialChatInput"),o=String(e||(t==null?void 0:t.value)||"").trim();if(o){t&&(t.value=""),re("user",o),re("ai","Thinking...");try{const n=ve(),s=await(await fetch(`${$}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:o,history:B.filter(c=>c.role!=="ai"||c.text!=="Thinking...").map(c=>({role:c.role==="ai"?"assistant":"user",content:c.text})).slice(-10),mode:"commercial",gardenState:n})})).json();se(s.reply||s.response||"I could not generate a recommendation yet.")}catch{se("AI chat is offline, but sensor monitoring and tools still work.")}}}function ae(e){var c,l;const t=document.getElementById("commercialChatInput"),o=e.detail||((c=y.getSelectedContext)==null?void 0:c.call(y)),r=`SeedDown AI, explain ${(o==null?void 0:o.label)||"this commercial farm"} using the current live data.`,s=document.getElementById("commercialScreen");if(s!=null&&s.classList.contains("panel-hidden")){s.classList.remove("panel-hidden");const i=document.getElementById("panelToggleBtn");i&&(i.textContent="Hide Panel"),setTimeout(P,120)}t&&(t.value=r),(l=document.querySelector(".chat-section"))==null||l.scrollIntoView({block:"nearest",behavior:"smooth"}),Q(r)}function ve(){var c,l;const e=v(),t=((c=y.getSelectedContext)==null?void 0:c.call(y))||null,n=k((t==null?void 0:t.zoneId)||(t==null?void 0:t.zone)||"")||z||Be(e),r=H[n]||g.latestReading||g.currentReading||null,s=Pe(e,n);return{farm:e,mode:"commercial",selectedZoneId:n,selectedZoneLabel:Le(n),selected3DObject:t,latestReading:r,latestReadingMeta:g.latestReadingMeta||null,thresholds:(e==null?void 0:e.thresholds)||(e==null?void 0:e.commercialThresholds)||((l=e==null?void 0:e.preferences)==null?void 0:l.thresholds)||null,sensors:g.sensors||{},deviceAssignment:s?{serial:s.serial||s.deviceSerial||"",deviceId:s.deviceId||"",targetId:s.targetId||s.zoneId||s.zone||"",status:s.status||"active",active:s.active!==!1}:null,commercialDevices:Array.isArray(e==null?void 0:e.commercialDevices)?e.commercialDevices:[],recentChatHistory:B.filter(i=>i.role!=="ai"||i.text!=="Thinking...").slice(-8),responseInstruction:"Answer based on the selected 3D object, selected zone, latestReading, thresholds, and device assignment. If live data is missing, say you are waiting for live data instead of guessing."}}function re(e,t){B.push({role:e,text:t}),Me()}function se(e){const t=B[B.length-1];(t==null?void 0:t.role)==="ai"?t.text=e:B.push({role:"ai",text:e}),Me()}function Me(){const e=document.getElementById("commercialChatLog");e&&(e.innerHTML=B.length?B.map(t=>`<div class="chat-bubble ${t.role}">${t.role==="ai"?Ne(t.text):w(t.text)}</div>`).join(""):'<div class="chat-bubble ai">Ask about yield, disease risk, energy, crop planning, or sensor readings.</div>',e.scrollTop=e.scrollHeight)}function q(e){const t=document.getElementById("ai-overview-text");t&&(t.innerHTML=_e(e))}function Mt(){var n,r,s,c;const e=document.getElementById("assignDeviceOverlay");e&&e.remove();const t=document.createElement("div");t.id="assignDeviceOverlay",t.style.cssText="position:fixed;inset:0;z-index:80;background:rgba(15,23,42,.38);display:flex;align-items:center;justify-content:center;padding:18px;",t.innerHTML=`
        <div style="width:min(430px,100%);background:#fff;border-radius:22px;padding:18px;box-shadow:0 26px 80px rgba(15,23,42,.25);">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:14px;">
                <div>
                    <div style="font-size:10px;font-weight:950;color:#15803d;text-transform:uppercase;letter-spacing:.1em;">Commercial Device</div>
                    <strong style="font-size:18px;">Assign Zone Device</strong>
                </div>
                <button id="assignClose" style="width:34px;height:34px;border:none;border-radius:12px;background:#f1f5f9;font-size:18px;font-weight:900;cursor:pointer;">×</button>
            </div>
            <div style="display:grid;grid-template-columns:1fr auto;gap:8px;align-items:end;margin-bottom:12px;">
                <label style="display:block;">
                    <span style="display:block;margin-bottom:10px;font-size:11px;font-weight:900;color:#64748b;">Serial</span>
                    <input id="assignSerial" value="SD-COM-ZON-01001" style="width:100%;padding:12px;border:1px solid #d7eef0;border-radius:14px;outline:none;background:#f7feff;">
                </label>
                <div style="display:flex;flex-direction:column;gap:6px;">
                    <button id="assignScanQr" type="button" style="height:42px;padding:0 13px;border:1px solid #99f6e4;border-radius:14px;background:#ecfeff;color:#0f766e;font-weight:950;cursor:pointer;">Take QR Photo</button>
                    <button id="assignUploadQr" type="button" style="height:38px;padding:0 13px;border:1px solid #d7eef0;border-radius:14px;background:#fff;color:#0f766e;font-weight:900;cursor:pointer;">Upload QR Image</button>
                </div>
                <input id="assignQrInput" type="file" accept="image/*" style="display:none;">
                <input id="assignQrCameraInput" type="file" accept="image/*" capture="environment" style="display:none;">
            </div>
            <label style="display:block;margin-bottom:10px;font-size:11px;font-weight:900;color:#64748b;">Zone</label>
            <select id="assignZone" style="width:100%;padding:12px;border:1px solid #e5e7eb;border-radius:14px;margin-bottom:12px;outline:none;">
                <option value="farm_master">Farm Master</option>
                <option value="zone_A">Zone A</option>
                <option value="zone_B">Zone B</option>
                <option value="zone_C">Zone C</option>
            </select>
            <label style="display:block;margin-bottom:10px;font-size:11px;font-weight:900;color:#64748b;">WiFi SSID</label>
            <input id="assignWifi" placeholder="Farm WiFi" style="width:100%;padding:12px;border:1px solid #e5e7eb;border-radius:14px;margin-bottom:12px;outline:none;">
            <button id="assignSubmit" style="width:100%;padding:13px;border:none;border-radius:14px;background:#0f766e;color:white;font-weight:950;cursor:pointer;">Reassign Active Device</button>
            <div id="assignStatus" style="font-size:12px;color:#64748b;line-height:1.45;margin-top:10px;">Scan a replacement QR or enter a serial. The selected target keeps one active device; the old device is preserved as replaced.</div>
        </div>
    `,document.body.appendChild(t),document.getElementById("assignClose").addEventListener("click",()=>t.remove()),t.addEventListener("click",l=>{l.target===t&&t.remove()}),document.getElementById("assignSubmit").addEventListener("click",zt),(n=document.getElementById("assignScanQr"))==null||n.addEventListener("click",()=>{var l;return(l=document.getElementById("assignQrCameraInput"))==null?void 0:l.click()}),(r=document.getElementById("assignUploadQr"))==null||r.addEventListener("click",()=>{var l;return(l=document.getElementById("assignQrInput"))==null?void 0:l.click()});const o=async l=>{var u;const i=(u=l.target.files)==null?void 0:u[0];if(i)try{const m=await Lt(i),p=Se(m);document.getElementById("assignSerial").value=p,document.getElementById("assignZone").value=Bt(p),document.getElementById("assignStatus").style.color="#0f766e",document.getElementById("assignStatus").textContent=`QR scanned: ${p}`}catch(m){document.getElementById("assignStatus").style.color="#dc2626",document.getElementById("assignStatus").textContent=m.message||"Could not read QR code"}finally{l.target.value=""}};(s=document.getElementById("assignQrInput"))==null||s.addEventListener("change",o),(c=document.getElementById("assignQrCameraInput"))==null||c.addEventListener("change",o)}async function zt(){var s,c,l,i;const e=(s=document.getElementById("assignSerial"))==null?void 0:s.value.trim(),t=(c=document.getElementById("assignZone"))==null?void 0:c.value,o=(l=document.getElementById("assignWifi"))==null?void 0:l.value.trim(),n=document.getElementById("assignStatus"),r=document.getElementById("assignSubmit");if(e){r.disabled=!0,r.textContent="Assigning...";try{const u=t==="farm_master"?"farm_master":"zone_node",m=await fetch(`${$}/api/devices/reassign`,{method:"POST",headers:Tt(),body:JSON.stringify({serial:e,wifi_ssid:o,accountType:Pt(e,u),farmId:g.currentFarmId||"farm_commercial_001",targetId:t,role:u,zoneId:t})}),p=await m.json();if(!m.ok||!p.ok)throw new Error(p.error||"Device assignment failed");const d=v()||{};d.commercialDevices=At(d.commercialDevices||[],p.device,p.replacedDevices||[],t),t==="farm_master"?d.farmMaster=p.device:d.zoneId=t,g.currentFarm=d,ke(d),z=t,g.currentZoneId=z,requestAnimationFrame(()=>{Ie(),Ee()}),n.style.color="#047857",n.textContent=`Active device: ${p.device.deviceId}. Replaced ${((i=p.replacedDevices)==null?void 0:i.length)||0} old device(s).`}catch(u){n.style.color="#dc2626",n.textContent=u.message}finally{r.disabled=!1,r.textContent="Reassign Active Device"}}}function ze(){var i,u,m,p,d;const e=document.getElementById("zoneCameraOverlay");e&&e.remove();const t=v(),o=Z(t),n=o.find(h=>h.id===z)||o[0],r=Ct(t,n==null?void 0:n.id)||(t==null?void 0:t.photoPreview)||(t==null?void 0:t.image)||(t==null?void 0:t.thumbnail)||"",s=H[n==null?void 0:n.id]||null,c=document.createElement("div");c.id="zoneCameraOverlay",c.style.cssText="position:fixed;inset:0;z-index:95;background:rgba(15,23,42,.48);display:flex;align-items:center;justify-content:center;padding:18px;",c.innerHTML=`
        <div style="width:min(780px,100%);max-height:92vh;overflow:hidden;background:#fff;border-radius:24px;box-shadow:0 28px 90px rgba(15,23,42,.32);display:flex;flex-direction:column;">
            <div style="display:flex;justify-content:space-between;gap:14px;align-items:flex-start;padding:16px 18px;border-bottom:1px solid #e5e7eb;">
                <div>
                    <div style="font-size:10px;font-weight:950;color:#15803d;text-transform:uppercase;letter-spacing:.1em;">Zone camera live view</div>
                    <strong id="cameraZoneTitle" style="font-size:19px;color:#17231b;">${w((n==null?void 0:n.label)||"Zone Camera")}</strong>
                    <div id="cameraTimestamp" style="font-size:12px;color:#64748b;margin-top:4px;">Live snapshot · ${new Date().toLocaleTimeString()}</div>
                </div>
                <button id="cameraClose" style="width:36px;height:36px;border:none;border-radius:12px;background:#f1f5f9;font-size:18px;font-weight:900;cursor:pointer;">×</button>
            </div>

            <div style="padding:16px;overflow:auto;">
                <div style="display:grid;grid-template-columns:minmax(0,1.35fr) minmax(220px,.65fr);gap:14px;">
                    <div id="cameraFeed" style="position:relative;min-height:360px;border-radius:20px;overflow:hidden;background:${r?`url(${r}) center/cover`:"linear-gradient(135deg,#dcfce7,#f8fafc)"};border:1px solid #dbe7dc;">
                        <video id="zoneCameraVideo" autoplay playsinline muted style="display:none;position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#0f172a;"></video>
                        <canvas id="zoneCameraCanvas" style="display:none;"></canvas>
                        ${r?"":Nt(n)}
                        <div style="position:absolute;left:12px;top:12px;display:flex;gap:7px;align-items:center;background:rgba(15,23,42,.66);color:#fff;border-radius:999px;padding:7px 10px;font-size:11px;font-weight:900;">
                            <span style="width:7px;height:7px;background:#22c55e;border-radius:50%;box-shadow:0 0 12px #22c55e;"></span>
                            LIVE CAMERA
                        </div>
                        <div style="position:absolute;right:12px;bottom:12px;background:rgba(255,255,255,.86);border:1px solid rgba(255,255,255,.7);border-radius:14px;padding:9px 10px;color:#17231b;font-size:12px;font-weight:900;">
                            ${w((n==null?void 0:n.crop)||"Mixed crops")}
                        </div>
                    </div>

                    <div style="display:flex;flex-direction:column;gap:10px;">
                        <label style="display:block;">
                            <span style="font-size:10px;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.08em;">Select zone</span>
                            <select id="cameraZoneSelect" style="width:100%;margin-top:6px;padding:12px;border:1px solid #e5e7eb;border-radius:14px;background:#f8fafc;outline:none;font-weight:900;color:#17231b;">
                                ${o.map(h=>`<option value="${Ft(h.id)}" ${h.id===(n==null?void 0:n.id)?"selected":""}>${w(h.label)} · ${w(h.crop)}</option>`).join("")}
                            </select>
                        </label>
                        ${N("Temp",(s==null?void 0:s.temperature)!==void 0?`${Number(s.temperature).toFixed(1)}C`:"--")}
                        ${N("Humidity",(s==null?void 0:s.humidity)!==void 0?`${s.humidity}%`:"--")}
                        ${N("Light",(s==null?void 0:s.lightRaw)??"--")}
                        ${N("Plant count",`${(n==null?void 0:n.planted)??Ae(t)} plants`)}
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px;">
                            <button id="cameraStartBtn" style="padding:13px;border:1px solid #99f6e4;border-radius:14px;background:#ecfeff;color:#0f766e;font-weight:950;cursor:pointer;">Start camera</button>
                            <button id="cameraCaptureBtn" style="padding:13px;border:none;border-radius:14px;background:#166534;color:#fff;font-weight:950;cursor:pointer;">Capture frame</button>
                        </div>
                        <button id="cameraStopBtn" style="padding:12px;border:1px solid #dbe7dc;border-radius:14px;background:#fff;color:#64748b;font-weight:900;cursor:pointer;">Stop camera</button>
                        <div id="cameraStatus" style="font-size:12px;color:#64748b;line-height:1.45;">Use browser camera for the demo, or keep the latest farm photo/captured snapshot as fallback. Captured frames are saved to the selected zone for disease analysis context.</div>
                    </div>
                </div>
            </div>
        </div>
    `,document.body.appendChild(c);const l=()=>{F(),c.remove()};(i=document.getElementById("cameraClose"))==null||i.addEventListener("click",l),c.addEventListener("click",h=>{h.target===c&&l()}),(u=document.getElementById("cameraStartBtn"))==null||u.addEventListener("click",()=>St()),(m=document.getElementById("cameraCaptureBtn"))==null||m.addEventListener("click",kt),(p=document.getElementById("cameraStopBtn"))==null||p.addEventListener("click",()=>{F(),document.getElementById("cameraStatus").textContent="Browser camera stopped. The latest saved snapshot is still available for this zone."}),(d=document.getElementById("cameraZoneSelect"))==null||d.addEventListener("change",h=>{z=h.target.value,g.currentZoneId=z,F(),c.remove(),Ee(),ze()})}async function St(){var o,n;const e=document.getElementById("cameraStatus"),t=document.getElementById("zoneCameraVideo");if(!((o=navigator.mediaDevices)!=null&&o.getUserMedia)){e&&(e.textContent="This browser does not support direct camera preview. Using saved snapshot/photo fallback.");return}F();try{A=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"},width:{ideal:1280},height:{ideal:720}},audio:!1}),t&&(t.srcObject=A,t.style.display="block",await t.play().catch(()=>{})),(n=document.querySelector("[data-camera-placeholder]"))==null||n.setAttribute("style","display:none;"),e&&(e.textContent="Browser camera is live. Capture a frame to save it as this zone camera snapshot.")}catch(r){e&&(e.textContent=`Camera unavailable: ${r.message}. Saved snapshot/photo fallback is still available.`)}}function F(){A&&(A.getTracks().forEach(t=>t.stop()),A=null);const e=document.getElementById("zoneCameraVideo");e&&(e.pause(),e.srcObject=null,e.style.display="none")}function kt(){var c;const e=document.getElementById("cameraStatus"),t=document.getElementById("zoneCameraVideo"),o=document.getElementById("zoneCameraCanvas"),n=((c=document.getElementById("cameraZoneSelect"))==null?void 0:c.value)||z;if(!t||!o||!A||!t.videoWidth){document.getElementById("cameraTimestamp").textContent=`Live snapshot · ${new Date().toLocaleTimeString()}`,e&&(e.textContent="No browser camera frame is active yet. Start camera first, or continue using the saved snapshot/photo fallback.");return}o.width=t.videoWidth,o.height=t.videoHeight,o.getContext("2d").drawImage(t,0,0,o.width,o.height);const s=o.toDataURL("image/jpeg",.88);It(n,s),Et(s),document.getElementById("cameraTimestamp").textContent=`Captured · ${new Date().toLocaleTimeString()}`,e&&(e.textContent="Frame saved to this zone. Disease Analysis can use the latest captured snapshot as context.")}function Ct(e,t){var n;if(!t)return"";const o=(e==null?void 0:e.id)||g.currentFarmId||"commercial_demo";if((n=e==null?void 0:e.zoneCameraSnapshots)!=null&&n[t])return e.zoneCameraSnapshots[t];try{const r=JSON.parse(localStorage.getItem(pe)||"{}");return(r==null?void 0:r.farmKey)===o&&(r==null?void 0:r.zoneId)===t?r.dataUrl:""}catch{return""}}function It(e,t){const o=v()||{},n={...o,zoneCameraSnapshots:{...o.zoneCameraSnapshots||{},[e]:t},lastCameraZoneId:e,lastCameraSnapshotAt:new Date().toISOString()};g.currentFarm=n,ke(n);try{localStorage.setItem(pe,JSON.stringify({farmKey:n.id||g.currentFarmId||"commercial_demo",zoneId:e,dataUrl:t,capturedAt:n.lastCameraSnapshotAt}))}catch(r){console.warn("[CommercialPage] could not save camera snapshot:",r.message)}}function Et(e){var n;const t=document.getElementById("cameraFeed"),o=document.getElementById("zoneCameraVideo");t&&(t.style.background=`url(${e}) center/cover`),o&&(o.style.display="none"),(n=document.querySelector("[data-camera-placeholder]"))==null||n.setAttribute("style","display:none;")}function Tt(){const e=localStorage.getItem("token");return{"Content-Type":"application/json",...e?{Authorization:`Bearer ${e}`}:{}}}function Pt(e="",t="zone_node"){const o=String(e).toUpperCase();return t==="farm_master"||o.includes("FRM")||o.includes("MST")?"commercial_farm_master":o.includes("FZK")?"commercial_farm_zone":o.includes("ZNP")?"commercial_zone_pro":o.includes("ZNB")?"commercial_zone_basic":"commercial_zone"}function Bt(e=""){const t=String(e).toUpperCase();return t.includes("FRM")||t.includes("MST")?"farm_master":"zone_A"}function ie(e){const t=String(e||"").trim(),o=ut[t.toLowerCase()];return String(o||t).trim().toUpperCase()}function Se(e){if(typeof e=="string")try{const o=JSON.parse(e);return Se(o)}catch{return ie(e)}const t=(e==null?void 0:e.serial)||(e==null?void 0:e.deviceSerial)||(e==null?void 0:e.qrSerial)||(e==null?void 0:e.token)||(e==null?void 0:e.deviceToken)||(e==null?void 0:e.id);if(!t)throw new Error("QR does not contain a SeedDown serial");return ie(t)}function Lt(e){return new Promise((t,o)=>{const n=new FileReader;n.onerror=()=>o(new Error("Could not read QR image")),n.onload=()=>{const r=new Image;r.onerror=()=>o(new Error("Could not load QR image")),r.onload=()=>{const s=document.createElement("canvas");s.width=r.naturalWidth||r.width,s.height=r.naturalHeight||r.height;const c=s.getContext("2d",{willReadFrequently:!0});c.drawImage(r,0,0,s.width,s.height);const l=c.getImageData(0,0,s.width,s.height),i=He(l.data,l.width,l.height);i!=null&&i.data?t(i.data):o(new Error("No QR code found in image"))},r.src=n.result},n.readAsDataURL(e)})}function At(e,t,o=[],n=(t==null?void 0:t.targetId)||(t==null?void 0:t.zoneId)){const r=k(n),s=new Set(o.map(l=>l.deviceId)),c={...t,targetId:n,role:n==="farm_master"?"farm_master":t.role||"zone_node",active:!0,status:"assigned",assignedAt:new Date().toISOString()};return[...e.map(l=>{const i=k(l.targetId||l.zoneId||l.zone)===r;return l.deviceId===t.deviceId?null:s.has(l.deviceId)||i?{...l,active:!1,status:"replaced",replacedBy:t.deviceId,replacedAt:new Date().toISOString()}:l}).filter(Boolean),c]}function ke(e){const t=$e(),o=t.findIndex(n=>n.id===e.id);o>=0?t[o]={...t[o],...e}:t.push(e),localStorage.setItem("user_farms",JSON.stringify(t))}function Ce(e,t){return Y(e,t).map(o=>$t(o)).join("")}function $t(e){var s;const t=H[e.id],o=_t(t,((s=v())==null?void 0:s.thresholds)||{}),n=e.deviceId?e.deviceId.replace(/^dev_/,""):"unassigned",r=t?`${ce(t.temperature,"°C")} · ${ce(t.humidity,"%")} · pH ${t.ph!=null?Number(t.ph).toFixed(1):"--"} · ${we(t)}${t._stale?" · cached":""}`:"waiting for first reading";return`
        <button class="commercial-zone-card ${o.level}" data-zone="${e.id}" type="button">
            <div class="zone-card-head">
                <span>${w(e.label)}</span>
                <b>${o.label}</b>
            </div>
            <strong>${w(e.crop)}</strong>
            <div class="zone-card-meta">${e.planted}/${e.capacity} slots · ${w(n)}</div>
            <div class="zone-meter"><i style="width:${e.occupied}%"></i></div>
            <small>${w(r)}</small>
            <div style="margin-top:8px;font-size:10px;font-weight:900;color:#047857;">→ Tap to drill into zone</div>
        </button>
    `}function Ie(){const e=document.querySelector(".zone-overview-grid");e&&(e.innerHTML=Ce(v(),O(v())),Dt())}function Dt(){document.querySelectorAll(".commercial-zone-card").forEach(e=>{e.addEventListener("click",()=>{clearInterval(g.proInterval),I("zone-detail",{zoneId:e.getAttribute("data-zone"),from:"dash-c"})})})}function Ee(){document.querySelectorAll(".commercial-zone-card").forEach(e=>{e.classList.toggle("selected",e.getAttribute("data-zone")===z)}),De("liveSensorTitle",`Live Sensors · ${Le(z)}`)}function Y(e,t){const o=Array.isArray(e==null?void 0:e.plants)?e.plants:[],n=Z(e),r=Te(e,t),s=Math.max(1,Math.ceil((r.total||(t==null?void 0:t.total)||9)/n.length)),c=Array.isArray(e==null?void 0:e.commercialDevices)?e.commercialDevices:[];return n.map((l,i)=>{const u=o.filter((h,f)=>{const b=k(h.zoneId||h.zone||h.area);return b?b===l.id:f%n.length===i}),m=c.find(h=>h.status!=="replaced"&&h.active!==!1&&k(h.targetId||h.zoneId||h.zone)===l.id),p=Rt(u)||l.crop,d=u.reduce((h,f)=>h+(Number.parseInt(f.slots||f.count||1,10)||1),0);return{...l,crop:p,planted:d,capacity:s,occupied:Math.min(100,Math.round(d/s*100)),deviceId:(m==null?void 0:m.deviceId)||((e==null?void 0:e.zoneId)===l.id?e.deviceId:null)}})}function Te(e,t){var i;const o=Array.isArray((i=e==null?void 0:e.commercialStructure)==null?void 0:i.zones)?e.commercialStructure.zones:Array.isArray(e==null?void 0:e.zones)?e.zones:[],n=Ae(e);if(!o.length){const u=Number.parseInt(e==null?void 0:e.plantSlots,10)||(t==null?void 0:t.total)||n||0;return{label:(t==null?void 0:t.label)||"Commercial Farm",planted:n,total:Math.max(u,n)}}const r=o.length,s=o.reduce((u,m)=>{const p=Number.parseInt(m.capacity??m.slots??m.plantSlots??m.count??0,10);return u+(Number.isFinite(p)&&p>0?p:0)},0),c=Number.parseInt(e==null?void 0:e.plantSlots,10)||Number.parseInt(e==null?void 0:e.capacity,10)||0,l=Math.max(s,c,n,r*12);return{label:`${r}-Zone Commercial Farm`,planted:n,total:l}}function Z(e){var o;const t=Array.isArray((o=e==null?void 0:e.commercialStructure)==null?void 0:o.zones)?e.commercialStructure.zones:Array.isArray(e==null?void 0:e.zones)?e.zones:[];return t.length?t.map((n,r)=>({id:k(n.zone_id||n.id||`zone_${String.fromCharCode(65+r)}`),label:n.name||`Zone ${String.fromCharCode(65+r)}`,crop:n.crop||(Array.isArray(n.plants)?n.plants.join(", "):"")||"Mixed Crops"})):mt}function Rt(e){var o;if(!e.length)return"";const t=e.reduce((n,r)=>{const s=r.name||r.species||"Mixed Crops";return n[s]=(n[s]||0)+1,n},{});return((o=Object.entries(t).sort((n,r)=>r[1]-n[1])[0])==null?void 0:o[0])||""}function Pe(e,t){return t?(Array.isArray(e==null?void 0:e.commercialDevices)?e.commercialDevices:[]).find(n=>n.status!=="replaced"&&n.active!==!1&&k(n.targetId||n.zoneId||n.zone)===t)||(k(e==null?void 0:e.zoneId)===t?e:null):null}function k(e){const t=String(e||"").trim().toLowerCase();if(!t)return"";const o=t.match(/^([a-z])$/),n=t.match(/^zone[_ ]([a-z])$/),r=(o==null?void 0:o[1])||(n==null?void 0:n[1]);return r?`zone_${r.toUpperCase()}`:t.startsWith("zone_")?`zone_${t.slice(5).toUpperCase()}`:t}function Be(e){var o;const t=((o=Z(e)[0])==null?void 0:o.id)||"zone_A";return k(g.currentZoneId||(e==null?void 0:e.zoneId))||t}function Le(e){var t;return((t=Z(v()).find(o=>o.id===e))==null?void 0:t.label)||"Farm"}function _t(e,t={}){if(!e)return{level:"idle",label:"No Data"};const o=Number(t.gasDangerThreshold??3e3),n=Number(t.tempMin??18),r=Number(t.tempMax??35),s=Number(t.phMin??5.5),c=Number(t.phMax??6.8),l=Number(t.darkThreshold??1500),i=Number(t.waterLowCm??20);return Number(e.gasRaw)>o||Number(e.temperature)>r+3?{level:"critical",label:"Critical"}:Number(e.temperature)<n||Number(e.temperature)>r||Number(e.ph)<s||Number(e.ph)>c||Number(e.lightRaw)<l||Number(e.waterDistanceCm)>i?{level:"warning",label:"Warning"}:{level:"healthy",label:"Healthy"}}function ce(e,t=""){const o=Number(e);return Number.isFinite(o)?`${o.toFixed(o%1?1:0)}${t}`:`--${t}`}function L(e,t,o){return'<button class="com-feat ops-tool-btn" data-feature="'+e+'" type="button"><span>'+t+"</span><strong>"+o+"</strong></button>"}function N(e,t){return`
        <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:14px;padding:11px 12px;">
            <div style="font-size:10px;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.08em;">${w(e)}</div>
            <strong style="display:block;margin-top:4px;color:#047857;font-size:16px;">${w(t)}</strong>
        </div>
    `}function Nt(e){const t=(e==null?void 0:e.crop)||"Mixed crops";return`
        <div data-camera-placeholder style="position:absolute;inset:0;display:grid;place-items:center;padding:28px;">
            <div style="width:min(420px,92%);aspect-ratio:4/3;border-radius:22px;background:linear-gradient(180deg,#ecfdf5,#dbeafe);border:1px solid rgba(22,101,52,.16);box-shadow:inset 0 0 0 8px rgba(255,255,255,.38);display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:24px;">
                ${Array.from({length:12},(o,n)=>`
                    <div style="border-radius:999px;background:${n%3===0?"#22c55e":n%3===1?"#16a34a":"#84cc16"};box-shadow:0 12px 24px rgba(22,101,52,.18);"></div>
                `).join("")}
            </div>
            <div style="position:absolute;bottom:22px;left:22px;right:22px;text-align:center;color:#166534;font-size:13px;font-weight:900;">Simulated live field frame · ${w(t)}</div>
        </div>
    `}function v(){const e=$e();return g.currentFarm||e.find(t=>t.id===g.currentFarmId)||e[e.length-1]||null}function O(e){const t=String((e==null?void 0:e.rackTypeId)||(e==null?void 0:e.rackType)||(e==null?void 0:e.rackLabel)||"").toLowerCase();return t.includes("2")?T["2-tier"]:t.includes("4")?T["4-tier"]:t.includes("5")?T["5-tier"]:t.includes("wall")||t.includes("grid")?T.wall:t.includes("frame")?T["a-frame"]:t.includes("nft")||t.includes("channel")?T["nft-channel"]:t.includes("hanging")||t.includes("column")?T.hanging:T["3-tier"]}function Ae(e){return Array.isArray(e==null?void 0:e.plants)?e.plants.reduce((t,o)=>t+(Number.parseInt(o.slots||o.count||1,10)||1),0):Number.parseInt(e==null?void 0:e.plants,10)||Number.parseInt(e==null?void 0:e.plantSlots,10)||0}function $e(){try{return JSON.parse(localStorage.getItem("user_farms"))||[]}catch{return[]}}function De(e,t){const o=document.getElementById(e);o&&(o.innerText=t)}function w(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function Ft(e){return w(e)}function Gt(){if(document.getElementById("commercial-command-style"))return;const e=document.createElement("style");e.id="commercial-command-style",e.textContent=`
        .commercial-command-screen,
        .commercial-command-screen.commercial-farm-host {
            position: relative !important;
            width: 100vw;
            height: 100vh;
            height: 100dvh;
            overflow: hidden !important;
            border-radius: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: #f8faf7 !important;
            color: #17231b;
        }
        .commercial-command-canvas,
        .commercial-command-screen .commercial-farm-canvas {
            position: absolute !important;
            inset: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            height: 100dvh !important;
            display: block !important;
            border-radius: 0 !important;
            background: #f8faf7 !important;
        }
        .commercial-top-shell {
            position: absolute;
            top: 16px;
            left: 16px;
            z-index: 15;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }
        .commercial-title-card,
        .commercial-ops-panel,
        .commercial-panel-toggle,
        .commercial-icon-btn {
            background: rgba(255, 255, 255, .9);
            border: 1px solid rgba(22, 101, 52, .12);
            box-shadow: 0 18px 48px rgba(15, 23, 42, .12);
            backdrop-filter: blur(18px);
        }
        .commercial-title-card {
            min-width: min(360px, calc(100vw - 112px));
            border-radius: 22px;
            padding: 14px 16px;
        }
        .commercial-kicker {
            font-size: 10px;
            color: #15803d;
            font-weight: 950;
            text-transform: uppercase;
            letter-spacing: .1em;
        }
        .commercial-title-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            margin-top: 4px;
        }
        .commercial-title-row strong { font-size: 18px; }
        .commercial-title-row span {
            padding: 5px 9px;
            border-radius: 999px;
            background: #ecfdf5;
            color: #047857;
            font-size: 11px;
            font-weight: 900;
            white-space: nowrap;
        }
        .commercial-title-card small {
            display: block;
            color: #64748b;
            font-size: 12px;
            font-weight: 750;
            margin-top: 3px;
        }
        .commercial-icon-btn {
            width: 42px;
            height: 42px;
            border-radius: 14px;
            color: #17231b;
            font-size: 20px;
            font-weight: 900;
            cursor: pointer;
        }
        .commercial-icon-btn.small {
            width: 34px;
            height: 34px;
            font-size: 18px;
            box-shadow: none;
        }
        .commercial-panel-toggle {
            position: absolute;
            top: 16px;
            right: 16px;
            z-index: 18;
            border-radius: 999px;
            padding: 10px 14px;
            color: #166534;
            font-size: 11px;
            font-weight: 950;
            text-transform: uppercase;
            letter-spacing: .08em;
            cursor: pointer;
        }
        .commercial-ops-panel {
            position: absolute;
            top: 62px;
            right: 16px;
            bottom: 16px;
            z-index: 16;
            width: min(410px, calc(100vw - 32px));
            border-radius: 26px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: transform .28s ease, opacity .28s ease;
        }
        .commercial-command-screen.panel-hidden .commercial-ops-panel {
            transform: translateX(calc(100% + 26px));
            opacity: 0;
            pointer-events: none;
        }
        .ops-panel-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding: 16px 16px 12px;
            border-bottom: 1px solid rgba(15, 23, 42, .08);
        }
        .ops-panel-header strong { display:block; font-size: 17px; margin-top: 3px; }
        .ops-scroll {
            flex: 1;
            overflow-y: auto;
            padding: 14px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .ops-section {
            background: #ffffff;
            border: 1px solid rgba(15, 23, 42, .08);
            border-radius: 20px;
            padding: 14px;
            box-shadow: 0 8px 26px rgba(15, 23, 42, .06);
        }
        .ops-section-title {
            color: #64748b;
            font-size: 10px;
            font-weight: 950;
            text-transform: uppercase;
            letter-spacing: .1em;
            margin-bottom: 10px;
        }
        .advisor-section { border-left: 4px solid #22c55e; }
.fm-tile {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 14px;
    padding: 10px 12px;
    text-align: left;
    cursor: pointer;
    transition: background .15s, border-color .15s, transform .15s;
}
.fm-tile:hover {
    background: #dcfce7;
    border-color: #86efac;
    transform: translateY(-1px);
}
.fm-tile span {
    display: block;
    font-size: 9px;
    font-weight: 950;
    color: #15803d;
    text-transform: uppercase;
    letter-spacing: .08em;
    margin-bottom: 6px;
}
.fm-tile strong {
    display: block;
    font-size: 16px;
    font-weight: 950;
    color: #14532d;
}

        .advisor-text { color: #334155; font-size: 13px; line-height: 1.45; }
        .ai-frame-mini {
            border: 1px solid #ccfbf1;
            background: #f8fffd;
            border-radius: 14px;
            padding: 10px 11px;
        }
        .ai-frame-mini-title {
            color: #0f766e;
            font-size: 10px;
            font-weight: 950;
            text-transform: uppercase;
            letter-spacing: .08em;
        }
        .ai-frame-mini-body {
            margin-top: 4px;
            color: #334155;
            font-size: 12px;
            font-weight: 750;
            line-height: 1.35;
        }
        .zone-overview-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 8px;
        }
        .commercial-zone-card {
            width: 100%;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            background: #f8fafc;
            color: #17231b;
            padding: 11px;
            text-align: left;
            cursor: pointer;
            transition: border-color .18s ease, box-shadow .18s ease, transform .18s ease;
        }
        .commercial-zone-card:hover,
        .commercial-zone-card.selected {
            border-color: #22c55e;
            box-shadow: 0 10px 24px rgba(34, 197, 94, .12);
            transform: translateY(-1px);
        }
        .zone-card-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            margin-bottom: 7px;
        }
        .zone-card-head span {
            color: #64748b;
            font-size: 10px;
            font-weight: 950;
            text-transform: uppercase;
            letter-spacing: .08em;
        }
        .zone-card-head b {
            border-radius: 999px;
            padding: 4px 8px;
            background: #eef2f7;
            color: #64748b;
            font-size: 9px;
            font-weight: 950;
            text-transform: uppercase;
            white-space: nowrap;
        }
        .commercial-zone-card.healthy .zone-card-head b { background: #dcfce7; color: #047857; }
        .commercial-zone-card.warning .zone-card-head b { background: #fef3c7; color: #b45309; }
        .commercial-zone-card.critical .zone-card-head b { background: #fee2e2; color: #b91c1c; }
        .commercial-zone-card strong {
            display: block;
            font-size: 14px;
            font-weight: 950;
        }
        .zone-card-meta {
            margin-top: 4px;
            color: #64748b;
            font-size: 11px;
            font-weight: 750;
        }
        .zone-meter {
            height: 7px;
            border-radius: 999px;
            overflow: hidden;
            background: #e5e7eb;
            margin: 9px 0 7px;
        }
        .zone-meter i {
            display: block;
            height: 100%;
            min-width: 8px;
            border-radius: inherit;
            background: linear-gradient(90deg, #22c55e, #84cc16);
        }
        .commercial-zone-card.warning .zone-meter i { background: linear-gradient(90deg, #f59e0b, #facc15); }
        .commercial-zone-card.critical .zone-meter i { background: linear-gradient(90deg, #ef4444, #fb7185); }
        .commercial-zone-card small {
            display: block;
            color: #64748b;
            font-size: 11px;
            line-height: 1.35;
        }
        .ops-sensor-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .pro-sensor-card {
            min-height: 74px;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            background: #f8fafc;
            color: #17231b;
            padding: 10px;
            text-align: left;
            cursor: pointer;
        }
        .pro-sensor-card span {
            display:block;
            color:#64748b;
            font-size:10px;
            font-weight:900;
            text-transform:uppercase;
            letter-spacing:.06em;
        }
        .pro-sensor-card strong {
            display:block;
            color:#059669;
            font-size:16px;
            font-weight:950;
            margin-top:12px;
            word-break:break-word;
        }
        .ops-metrics { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .metric-tile {
            min-height:78px;
            border:1px solid #e5e7eb;
            border-radius:16px;
            background:#f8fafc;
            text-align:left;
            padding:12px;
            cursor:pointer;
        }
        .metric-tile span { display:block; color:#64748b; font-size:10px; font-weight:950; text-transform:uppercase; }
        .metric-tile strong { display:block; margin-top:10px; color:#047857; font-size:18px; font-weight:950; }
        .ops-tool-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:8px; }
        .ops-tool-btn {
            border:1px solid #dbe7dc;
            border-radius:16px;
            background:#f0fdf4;
            color:#166534;
            min-height:74px;
            font-size:12px;
            font-weight:950;
            cursor:pointer;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            gap:7px;
        }
        .ops-tool-btn span { font-size:23px; line-height:1; }
        .ops-tool-btn strong { font-size:11px; font-weight:950; }
        .commercial-chat-log {
            height: 180px;
            overflow-y: auto;
            display:flex;
            flex-direction:column;
            gap:8px;
            padding:10px;
            border-radius:16px;
            background:#f8fafc;
            border:1px solid #e5e7eb;
        }
        .chat-bubble {
            max-width: 88%;
            padding: 9px 11px;
            border-radius: 14px;
            font-size: 12px;
            line-height: 1.35;
        }
        .chat-bubble.ai { background:#ecfdf5; color:#14532d; align-self:flex-start; }
        .chat-bubble.user { background:#166534; color:white; align-self:flex-end; }
        .chat-bubble.ai .ai-frame {
            min-width: min(270px, 100%);
        }
        .ai-frame-head {
            display:flex;
            align-items:flex-start;
            justify-content:space-between;
            gap:8px;
            margin-bottom:8px;
        }
        .ai-frame-head strong {
            color:#0f172a;
            font-size:12px;
            line-height:1.2;
        }
        .ai-frame-head span {
            flex-shrink:0;
            border-radius:999px;
            background:#ccfbf1;
            color:#0f766e;
            padding:3px 7px;
            font-size:9px;
            font-weight:950;
            text-transform:uppercase;
        }
        .ai-frame-metrics {
            display:grid;
            grid-template-columns:repeat(2,minmax(0,1fr));
            gap:6px;
            margin-bottom:8px;
        }
        .ai-frame-metrics div {
            border:1px solid #d7f7ef;
            border-radius:10px;
            background:#fff;
            padding:6px 7px;
        }
        .ai-frame-metrics b {
            display:block;
            color:#64748b;
            font-size:8px;
            font-weight:950;
            text-transform:uppercase;
        }
        .ai-frame-metrics span {
            display:block;
            margin-top:2px;
            color:#0f766e;
            font-size:11px;
            font-weight:900;
            word-break:break-word;
        }
        .ai-frame ul {
            margin:0;
            padding-left:16px;
            display:flex;
            flex-direction:column;
            gap:4px;
        }
        .ai-frame li {
            color:#334155;
            font-size:11px;
            line-height:1.32;
        }
        .commercial-chat-input-row { display:flex; gap:8px; margin-top:10px; }
        .commercial-chat-input-row input {
            flex:1;
            min-width:0;
            border:1px solid #e5e7eb;
            border-radius:14px;
            padding:11px 12px;
            background:#fff;
            outline:none;
        }
        .commercial-chat-input-row button {
            border:none;
            border-radius:14px;
            background:#166534;
            color:white;
            padding:0 14px;
            font-weight:950;
            cursor:pointer;
        }
        .commercial-command-screen .cf-legend,
        .commercial-command-screen .cf-expand-btn,
        .commercial-command-screen .cf-zoom-controls {
            display: none !important;
        }
        .commercial-command-screen .cf-info-panel {
            display: block !important;
            top: 148px !important;
            left: 18px !important;
            width: min(360px, calc(100vw - 470px)) !important;
            min-width: 280px !important;
            color: #17231b !important;
            background: rgba(255,255,255,.92) !important;
            border: 1px solid rgba(22,101,52,.12) !important;
            box-shadow: 0 18px 48px rgba(15,23,42,.12) !important;
            backdrop-filter: blur(18px) !important;
        }
        .commercial-command-screen .cf-panel-title,
        .commercial-command-screen .cf-mini-metric strong {
            color: #17231b !important;
        }
        .commercial-command-screen .cf-panel-kicker,
        .commercial-command-screen .cf-plant-list b,
        .commercial-command-screen .cf-tooltip strong {
            color: #047857 !important;
        }
        .commercial-command-screen .cf-panel-sub,
        .commercial-command-screen .cf-mini-metric span,
        .commercial-command-screen .cf-plant-list span,
        .commercial-command-screen .cf-tooltip small {
            color: #64748b !important;
        }
        .commercial-command-screen .cf-mini-metric,
        .commercial-command-screen .cf-plant-list span {
            background: #f8fafc !important;
            border: 1px solid #e5e7eb !important;
        }
        .commercial-command-screen .cf-tooltip {
            display: flex !important;
            bottom: 18px !important;
            left: 50% !important;
            color: #17231b !important;
            background: rgba(255,255,255,.9) !important;
            border: 1px solid rgba(22,101,52,.12) !important;
            box-shadow: 0 12px 34px rgba(15,23,42,.1) !important;
        }
        .commercial-command-screen .cf-mascot-bubble {
            z-index: 14 !important;
            left: 18px !important;
            right: auto !important;
            bottom: 82px !important;
            width: min(330px, calc(100vw - 470px)) !important;
            min-width: 260px !important;
        }
        @media (max-width: 760px) {
            .commercial-top-shell { left: 12px; top: 12px; }
            .commercial-title-card { min-width: 0; width: calc(100vw - 120px); }
            .commercial-title-row { align-items:flex-start; flex-direction:column; }
            .commercial-command-screen .cf-info-panel {
                top: 164px !important;
                left: 12px !important;
                width: calc(100vw - 24px) !important;
                min-width: 0 !important;
                max-width: 360px !important;
            }
            .commercial-command-screen .cf-mascot-bubble {
                left: 12px !important;
                right: 12px !important;
                bottom: 76px !important;
                width: auto !important;
                min-width: 0 !important;
            }
            .commercial-panel-toggle { top: auto; bottom: 16px; right: 16px; }
            .commercial-ops-panel { top: 94px; left: 12px; right: 12px; bottom: 70px; width: auto; }
            .commercial-command-screen.panel-hidden .commercial-ops-panel { transform: translateY(calc(100% + 90px)); }
            .ops-sensor-grid { grid-template-columns: repeat(2, 1fr); }
            .ops-tool-grid { grid-template-columns: repeat(2, 1fr); }
        }
    `,document.head.appendChild(e)}export{Wt as render};
