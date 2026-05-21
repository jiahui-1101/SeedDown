import{A as v}from"./index-BtjAULjs.js";import*as n from"https://esm.sh/three@0.160.0";import{OrbitControls as F}from"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const $="user_farms",M={"2-tier":{id:"2-tier",label:"2-Tier Starter Rack",tiers:2,slotsPerTier:3,total:6},"3-tier":{id:"3-tier",label:"3-Tier Vertical Rack",tiers:3,slotsPerTier:3,total:9},"4-tier":{id:"4-tier",label:"4-Tier Grow Shelf",tiers:4,slotsPerTier:4,total:16},"5-tier":{id:"5-tier",label:"5-Tier Tower Rack",tiers:5,slotsPerTier:4,total:20},wall:{id:"wall",label:"Wall Panel Grid",tiers:4,slotsPerTier:5,total:20},"a-frame":{id:"a-frame",label:"A-Frame Pyramid",tiers:4,slotsPerTier:4,total:16},"nft-channel":{id:"nft-channel",label:"NFT Channel Rows",tiers:3,slotsPerTier:6,total:18},hanging:{id:"hanging",label:"Hanging Column Farm",tiers:5,slotsPerTier:3,total:15}},S={lettuce:{color:6927180,alt:9228129,leaf:.082,spread:.095},cabbage:{color:7448635,alt:10733911,leaf:.09,spread:.1},kale:{color:3108670,alt:5213518,leaf:.088,spread:.105},spinach:{color:3046706,alt:4431943,leaf:.072,spread:.088},basil:{color:2067020,alt:3323495,leaf:.064,spread:.078},mint:{color:3450963,alt:7327605,leaf:.062,spread:.078},tomato:{color:3116870,alt:15680580,leaf:.07,spread:.086,fruit:15680580},chili:{color:2522941,alt:14427686,leaf:.066,spread:.082,fruit:14427686},pepper:{color:2522941,alt:14427686,leaf:.066,spread:.082,fruit:14427686},cucumber:{color:2325052,alt:5284955,leaf:.078,spread:.105,vine:!0},strawberry:{color:4165449,alt:16478597,leaf:.066,spread:.082,fruit:16478597},eggplant:{color:3112783,alt:8141549,leaf:.072,spread:.088,fruit:8141549},plant:{color:6660877,alt:8843180,leaf:.072,spread:.09}},le={canvas:null,parent:null,renderer:null,scene:null,camera:null,controls:null,farmGroup:null,particles:null,raycaster:null,pointer:null,interactiveRoots:[],hoverRoot:null,selectedRoot:null,detailPanel:null,tooltip:null,fullscreenButton:null,zoomControls:null,originalParent:null,originalNextSibling:null,resizeHandler:null,fullscreenHandler:null,rafId:null,clock:null,frame:0,farm:null,rack:M["3-tier"],slotPlants:[],sensorSnapshot:{},init(e,t=null){this.destroy(),this.installHandlers(),ae(),this.canvas=document.getElementById(e),this.canvas&&(this.parent=this.canvas.parentElement,this.parent&&(this.farm=t||B(),this.rack=A(this.farm),this.slotPlants=_(this.farm,this.rack),this.sensorSnapshot=L(),this.clock=new n.Clock,this.prepareHost(),this.initScene(),this.buildFacility(),this.createOverlays(),this.bindEvents(),this.resize(),this.animate()))},prepareHost(){this.parent.classList.add("commercial-farm-host"),this.canvas.classList.add("commercial-farm-canvas"),this.parent.querySelectorAll(".cf-overlay, .cf-tooltip, .cf-expand-btn, .cf-zoom-controls").forEach(e=>e.remove())},initScene(){this.scene=new n.Scene,this.scene.background=new n.Color(16317175),this.scene.fog=new n.Fog(16317175,22,58),this.camera=new n.PerspectiveCamera(58,1,.1,120),this.camera.position.set(5.5,4.6,8.5),this.camera.lookAt(0,1.8,0),this.renderer=new n.WebGLRenderer({canvas:this.canvas,antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=n.PCFSoftShadowMap,this.renderer.outputColorSpace=n.SRGBColorSpace,this.renderer.toneMapping=n.ACESFilmicToneMapping,this.renderer.toneMappingExposure=1.08,this.controls=new F(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.07,this.controls.enablePan=!0,this.controls.enableZoom=!1,this.controls.maxPolarAngle=Math.PI*.48,this.controls.target.set(0,1.55,0),this.setCameraFrame(!1),this.raycaster=new n.Raycaster,this.pointer=new n.Vector2,this.farmGroup=new n.Group,this.scene.add(this.farmGroup),this.addLighting()},addLighting(){this.scene.add(new n.AmbientLight(14479072,.55));const e=new n.DirectionalLight(16775399,2.2);e.position.set(10,18,9),e.castShadow=!0,e.shadow.mapSize.set(2048,2048),e.shadow.camera.left=-12,e.shadow.camera.right=12,e.shadow.camera.top=12,e.shadow.camera.bottom=-12,e.shadow.bias=-4e-4,this.scene.add(e);const t=new n.DirectionalLight(12244991,.35);t.position.set(-7,10,-6),this.scene.add(t);const o=new n.HemisphereLight(11657727,4928541,.28);this.scene.add(o);const s=new n.PointLight(8702998,1.25,12);s.position.set(0,3.1,0),this.scene.add(s)},buildFacility(){this.addFloor(),this.addGreenhouseFrame();const e=this.createTowerLayout();e.forEach((t,o)=>this.addTower(t,o)),this.addIrrigationPipes(e),this.addDigitalTwinDevices(e),this.addNutrientStation(),this.addControlPanel(),this.addVentilationFans(),this.addWaterDrips(e),this.addParticles()},addFloor(){const e=new n.Mesh(new n.PlaneGeometry(80,60),new n.MeshStandardMaterial({color:15265510,roughness:.86,metalness:.02}));e.rotation.x=-Math.PI/2,e.receiveShadow=!0,this.scene.add(e);const t=new n.Mesh(new n.PlaneGeometry(5.2,56),new n.MeshStandardMaterial({color:14542812,roughness:.78}));t.rotation.x=-Math.PI/2,t.position.y=.006,t.receiveShadow=!0,this.scene.add(t);const o=new n.LineBasicMaterial({color:11057322,transparent:!0,opacity:.48});for(let s=-38;s<=38;s+=2)this.scene.add(I([s,.014,-28],[s,.014,28],o));for(let s=-28;s<=28;s+=2)this.scene.add(I([-38,.016,s],[38,.016,s],o))},addGreenhouseFrame(){const e=new n.MeshStandardMaterial({color:10135456,metalness:.45,roughness:.32}),t=new n.MeshPhysicalMaterial({color:13625816,transparent:!0,opacity:.2,roughness:.04,side:n.DoubleSide}),o=17.6,s=13.6,r=4.3,a=6.2;for(let i=-s/2;i<=s/2+.001;i+=2.7){[-1,1].forEach(d=>{const c=new n.Mesh(new n.CylinderGeometry(.035,.035,r,10),e);c.position.set(d*o/2,r/2,i),c.castShadow=!0,this.scene.add(c)});const u=Math.sqrt((o/2)**2+(a-r)**2),h=Math.atan2(a-r,o/2);[-1,1].forEach(d=>{const c=new n.Mesh(new n.CylinderGeometry(.028,.028,u,8),e);c.position.set(d*o/4,r+(a-r)/2,i),c.rotation.z=d*(Math.PI/2-h),this.scene.add(c)})}const l=new n.Mesh(new n.CylinderGeometry(.032,.032,s,10),e);l.rotation.x=Math.PI/2,l.position.set(0,a,0),this.scene.add(l);const m=new n.Mesh(new n.PlaneGeometry(o,r),t);m.position.set(0,r/2,-s/2),this.scene.add(m),[-1,1].forEach(i=>{const u=new n.Mesh(new n.PlaneGeometry(s,r),t);u.rotation.y=Math.PI/2,u.position.set(i*o/2,r/2,0),this.scene.add(u)})},createTowerLayout(){const e=C(this.farm);if(e.length){const l=Math.ceil(Math.sqrt(e.length)),m=Math.ceil(e.length/l),i=2.65,u=3.1,h=-((l-1)*i)/2,d=-((m-1)*u)/2;return e.map((c,p)=>({x:h+p%l*i,z:d+Math.floor(p/l)*u,zoneIndex:p,row:Math.floor(p/l),col:p%l,zoneId:c.zone_id||c.id||`zone_${String.fromCharCode(65+p)}`,label:c.name||`Zone ${String.fromCharCode(65+p)}`,crop:c.crop||(Array.isArray(c.plants)?c.plants.join(", "):"")||"Mixed crops"}))}const t=Math.max(6,Math.min(10,Math.ceil(this.rack.total/2))),o=[],s=Math.ceil(t/2),r=-((s-1)*2.15)/2,a=[-2.35,2.35];for(let l=0;l<2;l++)for(let m=0;m<s&&!(o.length>=t);m++)o.push({x:r+m*2.15,z:a[l],zoneIndex:o.length,row:l,col:m});return o},addTower(e,t){const o=String.fromCharCode(65+t),s=new n.Group;s.position.set(e.x,0,e.z),s.userData={isTower:!0,id:e.zoneId||`zone-${o}`,label:e.label||`Zone ${o}`,crop:e.crop||"Mixed crops",zoneIndex:t,plants:[],status:"empty"},this.addZoneFootprint(s,e,t);const r=new n.MeshStandardMaterial({color:15330800,roughness:.34,metalness:.18}),a=new n.MeshStandardMaterial({color:2503725,roughness:.5,metalness:.4}),l=new n.Mesh(new n.CylinderGeometry(.095,.12,3.2,22),r);l.position.y=1.67,l.castShadow=!0,s.add(l);const m=new n.Mesh(new n.CylinderGeometry(.48,.6,.15,28),a);m.position.y=.075,m.castShadow=!0,s.add(m);const i=this.createTowerLayout().length,u=this.slotPlants.map((f,g)=>({plant:f,index:g})).filter(f=>f.plant&&J(f.plant,f.index,this.rack,t,i,e)),h=8,d=4;let c=0;for(let f=0;f<h;f++){const g=.38+f*.36,b=new n.Mesh(new n.TorusGeometry(.42,.012,8,48),new n.MeshStandardMaterial({color:5398874,roughness:.48,metalness:.35}));b.rotation.x=Math.PI/2,b.position.y=g,s.add(b);for(let z=0;z<d;z++){const N=z*Math.PI/2+(f%2?Math.PI/4:0),y=u[c]||null;this.addPod(s,N,g,(y==null?void 0:y.plant)||null,(y==null?void 0:y.index)??t*100+c,f,z),y!=null&&y.plant&&(s.userData.plants.push(y.plant),c+=1)}}s.userData.status=V(s.userData.plants),this.addZoneStatusStrip(s,s.userData.status);const p=this.createTextSprite(String(e.label||`ZONE ${o}`).toUpperCase(),{bg:"rgba(255,255,255,.92)",fg:"#14532d",border:"#315d3e",font:"900 30px Inter, system-ui, sans-serif"});p.position.set(0,3.63,0),p.scale.set(.68,.18,1),s.add(p),this.farmGroup.add(s),this.interactiveRoots.push(s)},addZoneFootprint(e,t,o){var c,p;const s=String.fromCharCode(65+o),r=new n.MeshStandardMaterial({color:15989492,roughness:.72,metalness:.02}),a=new n.MeshStandardMaterial({color:2062914,roughness:.48,metalness:.18}),l=new n.MeshStandardMaterial({color:12044475,roughness:.82,metalness:.02,transparent:!0,opacity:.55}),m=new n.Mesh(new n.BoxGeometry(1.92,.035,2.04),r);m.position.y=.022,m.receiveShadow=!0,e.add(m);const i=new n.Mesh(new n.BoxGeometry(2.08,.004,2.2),l);i.position.y=.002,i.receiveShadow=!0,e.add(i),[{x:0,z:1.04,sx:1.92,sz:.035},{x:0,z:-1.04,sx:1.92,sz:.035},{x:.96,z:0,sx:.035,sz:2.04},{x:-.96,z:0,sx:.035,sz:2.04}].forEach(f=>{const g=new n.Mesh(new n.BoxGeometry(f.sx,.035,f.sz),a);g.position.set(f.x,.06,f.z),g.castShadow=!0,e.add(g)});const h=this.createTextSprite(`ZONE ${s}`,{bg:"rgba(20,83,45,.92)",fg:"#f7fee7",font:"900 24px Inter, system-ui, sans-serif"});h.position.set(-.62,.14,.98),h.scale.set(.26,.09,1),e.add(h);const d=(p=String(t.crop||((c=e.userData)==null?void 0:c.crop)||"").split(",")[0])==null?void 0:p.trim();if(d){const f=this.createTextSprite(d.toUpperCase().slice(0,18),{bg:"rgba(255,255,255,.9)",fg:"#166534",font:"900 22px Inter, system-ui, sans-serif"});f.position.set(.38,.14,.98),f.scale.set(.34,.085,1),e.add(f)}},addZoneStatusStrip(e,t){const o=P(t||"healthy"),s=new n.MeshStandardMaterial({color:o,emissive:o,emissiveIntensity:t==="empty"?.08:.34,roughness:.34,metalness:.1}),r=new n.Mesh(new n.BoxGeometry(1.62,.028,.055),s);r.position.set(0,.105,-1.05),r.castShadow=!0,e.add(r)},addPod(e,t,o,s,r,a,l){const i=Math.cos(t)*.48,u=Math.sin(t)*.48,h=(s==null?void 0:s.status)||"empty",d=P(h),c={index:r,tier:e.userData.zoneIndex+1,slot:a*4+l+1,plant:s,tower:e},p=new n.MeshStandardMaterial({color:s?16317180:2437676,roughness:.52,metalness:s?.08:.18}),f=new n.Mesh(new n.CylinderGeometry(.155,.12,.11,20),p);f.position.set(i,o,u),f.rotation.z=Math.PI/2,f.rotation.y=-t,f.castShadow=!0,f.userData.slot=c,f.userData.root=e,e.add(f);const g=new n.Mesh(new n.SphereGeometry(.045,12,8),new n.MeshStandardMaterial({color:d,emissive:d,emissiveIntensity:s?.38:.06}));g.position.set(i*1.1,o+.085,u*1.1),g.userData.slot=c,g.userData.root=e,e.add(g),s&&this.addPlantCluster(e,i*1.1,o+.12,u*1.1,s)},addDigitalTwinDevices(e){[{key:"co2",label:"CO2 Sensor",value:`${Number(this.sensorSnapshot.co2Ppm||800)} ppm`,type:"sensor",kind:"co2",x:-7.25,y:2.35,z:-5.95,color:3718648},{key:"reservoir",label:"Water Reservoir",value:`${Number(this.sensorSnapshot.waterDistanceCm||0)} cm`,type:"sensor",kind:"reservoir",x:-6.8,y:.55,z:5.35,color:959977},{key:"gas",label:"MQ-2 Gas Sensor",value:`${Number(this.sensorSnapshot.gasRaw||0)} raw`,type:"sensor",kind:"gas",x:-5.25,y:.72,z:5.55,color:P(Number(this.sensorSnapshot.gasRaw||0)>2500?"danger":"healthy")},{key:"power",label:"Power Meter",value:`${Number(this.sensorSnapshot.energyKwh||5.1).toFixed(1)} kWh`,type:"sensor",kind:"power",x:.9,y:1.45,z:5.42,color:16096779},{key:"main_fan",label:"Main Ventilation Fan",value:Number(this.sensorSnapshot.temperature||25)>30?"active":"standby",type:"output",kind:"fan",x:7.55,y:2.85,z:-5.9,color:6583435},{key:"emergency_buzzer",label:"Emergency Buzzer",value:Number(this.sensorSnapshot.gasRaw||0)>2500?"alert":"ready",type:"output",kind:"buzzer",x:1.72,y:1.34,z:5.52,color:Number(this.sensorSnapshot.gasRaw||0)>2500?15680580:8702998}].forEach(s=>this.addDeviceMarker(s));const o=[{key:"dht11",label:"DHT11 Temp/Humid",type:"sensor",kind:"dht",color:2278750,dx:-.66,y:1.72,dz:-.32},{key:"soil",label:"Soil Moisture",type:"sensor",kind:"soil",color:9132587,dx:.36,y:.29,dz:.53},{key:"ldr",label:"LDR Light",type:"sensor",kind:"ldr",color:16436245,dx:.32,y:3.38,dz:-.42},{key:"ph",label:"pH Sensor",type:"sensor",kind:"probe",color:11032055,dx:-.42,y:.72,dz:.66},{key:"ec",label:"EC Sensor",type:"sensor",kind:"probe",color:1357990,dx:-.18,y:.68,dz:.74},{key:"flow",label:"YF-S201 Flow",type:"sensor",kind:"flow",color:3718648,dx:.58,y:.58,dz:.42},{key:"pump",label:"Water Pump",type:"output",kind:"pump",color:959977,dx:.82,y:.22,dz:.78},{key:"zone_fan",label:"Zone Fan",type:"output",kind:"fan",color:6583435,dx:-.9,y:2.18,dz:.12},{key:"active_buzzer",label:"Active Buzzer",type:"output",kind:"buzzer",color:16347926,dx:.78,y:1.78,dz:-.58},{key:"camera",label:"Camera",type:"sensor",kind:"camera",color:1120295,dx:-.72,y:3.08,dz:.68}];e.forEach((s,r)=>{var m,i;const a=s.zoneId||((m=s.userData)==null?void 0:m.id)||`zone_${String.fromCharCode(65+r)}`,l=s.label||((i=s.userData)==null?void 0:i.label)||`Zone ${String.fromCharCode(65+r)}`;o.forEach(u=>{this.addDeviceMarker({...u,scope:"zone",zoneId:a,zoneLabel:l,value:q(u.key,this.sensorSnapshot),x:s.x+u.dx,y:u.y,z:s.z+u.dz,compact:!0})})})},addDeviceMarker(e){const t=new n.Group;if(t.position.set(e.x,e.y,e.z),t.userData={isDevice:!0,label:e.label,key:e.key,type:e.type,scope:e.scope||"farm",zoneId:e.zoneId||null,zoneLabel:e.zoneLabel||null,value:e.value||"--",status:X(e)},this.addDeviceShape(t,e),t.traverse(s=>{(s.isMesh||s.isSprite)&&(s.userData.root=t)}),!e.compact||["camera","pump","zone_fan"].includes(e.key)){const s=e.compact?K(e.key):e.label.replace(/\s+/g,`
`),r=this.createTextSprite(s,{bg:"rgba(255,255,255,.92)",fg:"#0f172a",font:"900 24px Inter, system-ui, sans-serif"});r.position.set(0,e.compact?.17:.24,0),r.scale.set(e.compact?.2:.34,e.compact?.08:.13,1),t.add(r)}else{const s=new n.Mesh(new n.TorusGeometry(.11,.006,8,22),new n.MeshStandardMaterial({color:e.color,emissive:e.color,emissiveIntensity:.18,roughness:.3,metalness:.2}));s.rotation.x=Math.PI/2,s.position.y=.02,t.add(s)}this.scene.add(t),this.interactiveRoots.push(t)},addDeviceShape(e,t){const o=new n.MeshStandardMaterial({color:t.color,emissive:t.color,emissiveIntensity:t.type==="output"?.24:.1,roughness:.42,metalness:.16}),s=new n.MeshStandardMaterial({color:1120295,roughness:.48,metalness:.36}),r=new n.MeshStandardMaterial({color:16317180,roughness:.52,metalness:.04}),a=new n.MeshStandardMaterial({color:9741240,roughness:.28,metalness:.72}),l=new n.MeshStandardMaterial({color:132631,roughness:.62,metalness:.08}),m=new n.MeshStandardMaterial({color:6809849,emissive:561586,emissiveIntensity:.18,roughness:.22,metalness:.04,transparent:!0,opacity:.74}),i=h=>(h.castShadow=!0,e.add(h),h),u=(h,d,c,p=t.color)=>{const f=i(new n.Mesh(new n.SphereGeometry(t.compact?.012:.018,10,8),new n.MeshStandardMaterial({color:p,emissive:p,emissiveIntensity:.7,roughness:.24})));return f.position.set(h,d,c),f};if(t.kind==="fan"){const h=t.scope==="zone"?.13:.24;i(new n.Mesh(new n.TorusGeometry(h,.014,10,42),s)),i(new n.Mesh(new n.TorusGeometry(h*.62,.006,8,34),a));const d=i(new n.Mesh(new n.CylinderGeometry(h*.19,h*.19,.035,18),l));d.rotation.x=Math.PI/2;for(let c=0;c<4;c++){const p=i(new n.Mesh(new n.BoxGeometry(h*1.46,h*.17,.012),o));p.position.x=h*.22,p.rotation.z=c*Math.PI/4,p.userData.isFanBlade=!0}for(let c=0;c<4;c++){const p=i(new n.Mesh(new n.BoxGeometry(h*1.92,.006,.01),a));p.rotation.z=c*Math.PI/4}return}if(t.kind==="buzzer"){const h=i(new n.Mesh(new n.CylinderGeometry(.11,.12,.035,22),l));h.position.y=-.025;const d=i(new n.Mesh(new n.SphereGeometry(.095,22,10),o));d.scale.y=.58,d.position.y=.045;const c=i(new n.Mesh(new n.TorusGeometry(.092,.006,8,28),a));c.rotation.x=Math.PI/2,c.position.y=.028;return}if(t.kind==="camera"){const h=i(new n.Mesh(new n.BoxGeometry(.2,.12,.13),l));h.rotation.y=-.35;const d=i(new n.Mesh(new n.BoxGeometry(.14,.075,.012),s));d.position.set(.045,.002,.071),d.rotation.y=-.35;const c=i(new n.Mesh(new n.CylinderGeometry(.038,.038,.048,18),a));c.rotation.x=Math.PI/2,c.position.set(.045,0,.075);const p=i(new n.Mesh(new n.CylinderGeometry(.024,.024,.052,18),m));p.rotation.x=Math.PI/2,p.position.set(.045,0,.104);const f=i(new n.Mesh(new n.CylinderGeometry(.012,.012,.24,8),a));f.position.y=-.15,u(-.045,-.036,.081,2278750);return}if(t.kind==="soil"){const h=i(new n.Mesh(new n.BoxGeometry(.13,.06,.07),r));h.position.y=.025,i(new n.Mesh(new n.BoxGeometry(.052,.024,.012),l)).position.set(0,.035,.041),[-.035,.035].forEach(c=>{i(new n.Mesh(new n.CylinderGeometry(.005,.006,.24,8),a)).position.set(c,-.12,0)}),u(.048,.04,.042,2278750);return}if(t.kind==="probe"){const h=i(new n.Mesh(new n.CylinderGeometry(.034,.038,.18,14),o));h.rotation.z=.35,h.position.y=.035;const d=i(new n.Mesh(new n.CylinderGeometry(.04,.04,.025,14),l));d.rotation.z=.35,d.position.y=-.055;const c=i(new n.Mesh(new n.CylinderGeometry(.007,.01,.28,10),a));c.position.y=-.22,c.rotation.z=.35;const p=i(new n.Mesh(new n.TorusGeometry(.085,.004,6,24),l));p.rotation.set(Math.PI/2,.35,0),p.position.set(-.035,.15,0);return}if(t.kind==="flow"){const h=i(new n.Mesh(new n.CylinderGeometry(.024,.024,.42,14),a));h.rotation.z=Math.PI/2;const d=i(new n.Mesh(new n.CylinderGeometry(.082,.082,.05,24),r));d.rotation.x=Math.PI/2;const c=i(new n.Mesh(new n.BoxGeometry(.105,.01,.014),o));c.userData.isFanBlade=!0,u(.055,.055,.03,440020);return}if(t.kind==="pump"){const h=i(new n.Mesh(new n.CylinderGeometry(.075,.075,.18,20),o));h.rotation.z=Math.PI/2;const d=i(new n.Mesh(new n.CylinderGeometry(.062,.062,.06,18),a));d.rotation.z=Math.PI/2,d.position.x=.105;const c=i(new n.Mesh(new n.CylinderGeometry(.019,.019,.2,10),a));c.rotation.z=Math.PI/2,c.position.x=.19;const p=i(new n.Mesh(new n.CylinderGeometry(.018,.018,.15,10),l));p.rotation.x=Math.PI/2,p.position.set(-.03,-.078,0);const f=i(new n.Mesh(new n.BoxGeometry(.22,.024,.08),l));f.position.y=-.086;return}if(t.kind==="reservoir"){const h=i(new n.Mesh(new n.CylinderGeometry(.18,.18,.42,28),o));h.position.y=.12;const d=i(new n.Mesh(new n.CylinderGeometry(.19,.18,.045,28),l));d.position.y=.35,i(new n.Mesh(new n.BoxGeometry(.022,.28,.012),m)).position.set(.182,.12,.02);const p=i(new n.Mesh(new n.BoxGeometry(.18,.055,.12),s));p.position.y=.38,u(.064,.392,.064,2278750);return}if(t.kind==="power"){i(new n.Mesh(new n.BoxGeometry(.24,.18,.045),s));const h=i(new n.Mesh(new n.BoxGeometry(.16,.09,.012),o));h.position.z=.03,[-.058,0,.058].forEach((d,c)=>{u(d,-.064,.034,c===0?2278750:440020)});return}if(t.kind==="gas"||t.kind==="dht"||t.kind==="co2"){i(new n.Mesh(new n.BoxGeometry(.17,.135,.075),t.kind==="dht"?r:o));for(let h=0;h<3;h++)i(new n.Mesh(new n.BoxGeometry(.1,.007,.011),s)).position.set(-.008,-.038+h*.032,.045);if(t.kind==="co2"||t.kind==="gas"){const h=i(new n.Mesh(new n.CylinderGeometry(.036,.036,.015,18),l));h.rotation.x=Math.PI/2,h.position.set(.055,.038,.046)}u(-.062,.044,.047,t.kind==="gas"?16096779:2278750);return}if(t.kind==="ldr"){const h=i(new n.Mesh(new n.BoxGeometry(.13,.055,.08),r));h.position.y=-.01;const d=i(new n.Mesh(new n.CylinderGeometry(.052,.052,.02,24),o));d.rotation.x=Math.PI/2,d.position.z=.045;const c=i(new n.Mesh(new n.SphereGeometry(.038,14,8),m));c.scale.y=.42,c.position.set(0,0,.058);return}i(new n.Mesh(t.compact?new n.SphereGeometry(.07,12,8):new n.BoxGeometry(.22,.18,.14),o))},addPlantCluster(e,t,o,s,r){const a=U(r),l=new n.MeshStandardMaterial({color:3100976,roughness:.7}),m=new n.MeshStandardMaterial({color:a.color,roughness:.72,side:n.DoubleSide}),i=new n.MeshStandardMaterial({color:a.alt,roughness:.72,side:n.DoubleSide}),u=new n.Mesh(new n.CylinderGeometry(.008,.01,.15,6),l);u.position.set(t,o+.055,s),e.add(u);for(let h=0;h<7;h++){const d=Math.PI*2/7*h,c=a.spread+Math.random()*.025,p=new n.Mesh(new n.SphereGeometry(a.leaf,8,5),h%2?m:i);p.scale.set(1.4,.36,.82),p.position.set(t+Math.cos(d)*c,o+.12+h%3*.012,s+Math.sin(d)*c),p.rotation.set(-.45+Math.random()*.18,d,.18),p.castShadow=!0,e.add(p)}if(a.fruit)for(let h=0;h<2;h++){const d=Math.PI*h+.55,c=new n.Mesh(new n.SphereGeometry(.032,10,8),new n.MeshStandardMaterial({color:a.fruit,roughness:.55}));c.position.set(t+Math.cos(d)*.07,o+.105,s+Math.sin(d)*.07),e.add(c)}if(a.vine){const h=new n.Mesh(new n.CylinderGeometry(.006,.004,.34,5),new n.MeshStandardMaterial({color:a.color,roughness:.72}));h.position.set(t+.06,o-.02,s+.05),h.rotation.z=.25,e.add(h)}},addIrrigationPipes(e){const t=new n.MeshStandardMaterial({color:5605546,roughness:.28,metalness:.6}),o=new n.MeshStandardMaterial({color:9358054,roughness:.25,metalness:.55});[...new Set(e.map(r=>r.z))].forEach(r=>{const a=e.filter(u=>u.z===r),l=Math.min(...a.map(u=>u.x))-.8,m=Math.max(...a.map(u=>u.x))+.8,i=new n.Mesh(new n.CylinderGeometry(.035,.035,m-l,10),t);i.rotation.z=Math.PI/2,i.position.set((l+m)/2,3.35,r+.25),this.scene.add(i)}),e.forEach(r=>{const a=new n.Mesh(new n.CylinderGeometry(.02,.02,2.75,8),t);a.position.set(r.x+.28,1.9,r.z+.25),this.scene.add(a);const l=new n.Mesh(new n.SphereGeometry(.055,10,8),o);l.position.set(r.x+.28,3.28,r.z+.25),this.scene.add(l)})},addNutrientStation(){const e=new n.MeshStandardMaterial({color:2780750,roughness:.35,metalness:.15}),t=new n.MeshStandardMaterial({color:2054718,roughness:.4,metalness:.2});["N","P","K","pH"].forEach((s,r)=>{const a=-3+r*2,l=new n.Group;l.userData={isTank:!0,label:s,status:r===3&&Y(this.sensorSnapshot)?"warning":"healthy"};const m=new n.Mesh(new n.CylinderGeometry(.42,.42,1.05,18),e);m.position.set(a,.58,-5.75),m.castShadow=!0,l.add(m);const i=new n.Mesh(new n.CylinderGeometry(.45,.42,.07,18),t);i.position.set(a,1.14,-5.75),l.add(i);const u=this.createTextSprite(s,{bg:"rgba(255,255,255,.92)",fg:"#0f172a",font:"900 34px Inter, system-ui, sans-serif"});u.position.set(a,.58,-5.28),u.scale.set(.22,.1,1),l.add(u),this.scene.add(l),this.interactiveRoots.push(l)})},addControlPanel(){const e=new n.MeshStandardMaterial({color:5593943,roughness:.5,metalness:.3}),t=new n.Mesh(new n.BoxGeometry(1.7,.08,.65),e);t.position.set(0,.86,5.75),t.castShadow=!0,this.scene.add(t);const o=new n.MeshStandardMaterial({color:464909,emissive:2062914,emissiveIntensity:.75,roughness:.12,metalness:.42}),s=new n.Mesh(new n.BoxGeometry(.95,.56,.04),o);s.position.set(0,1.38,5.45),s.castShadow=!0,this.scene.add(s);const r=this.createTextSprite("CONTROL",{bg:"rgba(9,18,13,.86)",fg:"#a3e635",font:"900 26px Inter, system-ui, sans-serif"});r.position.set(0,1.82,5.4),r.scale.set(.42,.13,1),this.scene.add(r)},addVentilationFans(){const e=new n.MeshStandardMaterial({color:2042167,roughness:.36,metalness:.55});[-7.3,7.3].forEach(t=>{const o=new n.Group;o.position.set(t,2.8,-5.9),o.userData.isFan=!0;const s=new n.Mesh(new n.TorusGeometry(.34,.025,8,32),e);o.add(s);for(let r=0;r<4;r++){const a=new n.Mesh(new n.BoxGeometry(.48,.045,.018),e);a.rotation.z=r*Math.PI/4,a.userData.isFanBlade=!0,o.add(a)}this.scene.add(o)})},addWaterDrips(e){const t=new n.MeshStandardMaterial({color:3718648,emissive:3718648,emissiveIntensity:.5,transparent:!0,opacity:.85});e.forEach((o,s)=>{if(s%2)return;const r=new n.Mesh(new n.SphereGeometry(.025,8,6),t.clone());r.position.set(o.x+.25,2.9,o.z+.28),r.userData.isDrip=!0,r.userData.baseY=r.position.y,this.scene.add(r)})},addParticles(){const t=new Float32Array(1080),o=new Float32Array(360*3);for(let a=0;a<360;a++)t[a*3]=(Math.random()-.5)*15,t[a*3+1]=Math.random()*4.4+.7,t[a*3+2]=(Math.random()-.5)*11,o[a*3]=(Math.random()-.5)*.002,o[a*3+1]=(Math.random()-.5)*.001,o[a*3+2]=(Math.random()-.5)*.002;const s=new n.BufferGeometry;s.setAttribute("position",new n.BufferAttribute(t,3));const r=new n.PointsMaterial({color:16777215,size:.028,transparent:!0,opacity:.28,depthWrite:!1,blending:n.AdditiveBlending});this.particles=new n.Points(s,r),this.particles.userData.velocities=o,this.scene.add(this.particles)},createOverlays(){var o;const e=this.slotPlants.filter(Boolean).length;this.detailPanel=document.createElement("div"),this.detailPanel.className="cf-overlay cf-info-panel",this.detailPanel.innerHTML=G({title:((o=this.farm)==null?void 0:o.name)||v.farmName||"Commercial Farm",subtitle:`${this.rack.label} · ${e}/${this.rack.total} planted`,status:T(this.slotPlants,this.sensorSnapshot),mode:"Facility overview"}),this.parent.appendChild(this.detailPanel),this.tooltip=document.createElement("div"),this.tooltip.className="cf-tooltip",this.tooltip.innerHTML='<span class="cf-tooltip-dot"></span><div><strong>Hover a tower</strong><small>Click to inspect rack details</small></div>',this.parent.appendChild(this.tooltip);const t=document.createElement("div");t.className="cf-overlay cf-legend",t.innerHTML=`
            <span><i class="ok"></i>Healthy</span>
            <span><i class="warn"></i>Warning</span>
            <span><i class="danger"></i>Critical</span>
            <span class="cf-legend-help">Drag rotate · Wheel / +/- zoom · Double click fullscreen</span>
        `,this.parent.appendChild(t),this.fullscreenButton=document.createElement("button"),this.fullscreenButton.type="button",this.fullscreenButton.className="cf-expand-btn",this.fullscreenButton.textContent="EXPAND",this.fullscreenButton.addEventListener("click",s=>{s.stopPropagation(),this.toggleFullscreen()}),this.parent.appendChild(this.fullscreenButton),this.zoomControls=document.createElement("div"),this.zoomControls.className="cf-zoom-controls",this.zoomControls.innerHTML=`
            <button type="button" data-zoom="in" aria-label="Zoom in">+</button>
            <button type="button" data-zoom="out" aria-label="Zoom out">-</button>
            <button type="button" data-zoom="reset" aria-label="Reset view">RESET</button>
        `,this.zoomControls.addEventListener("click",s=>{const r=s.target.closest("button[data-zoom]");r&&(s.preventDefault(),s.stopPropagation(),r.dataset.zoom==="in"&&this.zoomCamera(.82),r.dataset.zoom==="out"&&this.zoomCamera(1.22),r.dataset.zoom==="reset"&&this.resetCamera())}),this.parent.appendChild(this.zoomControls)},bindEvents(){this.resizeHandler=()=>this.resize(),window.addEventListener("resize",this.resizeHandler),this.fullscreenHandler=()=>{this.syncExpandButton(),setTimeout(()=>this.resize(),80)},document.addEventListener("fullscreenchange",this.fullscreenHandler),this.canvas.addEventListener("pointermove",this.onPointerMove),this.canvas.addEventListener("click",this.onClick),this.canvas.addEventListener("dblclick",this.onDoubleClick),this.canvas.addEventListener("wheel",this.onWheel,{passive:!1})},onPointerMove:null,onClick:null,onDoubleClick:null,onWheel:null,installHandlers(){this.onPointerMove=e=>this.handlePointerMove(e),this.onClick=e=>this.handleClick(e),this.onDoubleClick=()=>this.toggleFullscreen(),this.onWheel=e=>this.handleWheel(e)},handlePointerMove(e){const t=this.pickRoot(e);t!==this.hoverRoot&&(this.hoverRoot&&this.hoverRoot!==this.selectedRoot&&this.setHighlight(this.hoverRoot,!1),this.hoverRoot=t,this.hoverRoot&&this.hoverRoot!==this.selectedRoot&&this.setHighlight(this.hoverRoot,!0)),this.canvas.style.cursor=t?"pointer":"grab",this.updateTooltip(t)},handleClick(e){const t=this.pickRoot(e);if(!t){this.selectedRoot&&this.setHighlight(this.selectedRoot,!1),this.selectedRoot=null,this.showOverview();return}this.selectedRoot&&this.selectedRoot!==t&&this.setHighlight(this.selectedRoot,!1),this.selectedRoot=t,this.setHighlight(t,!0,!0),this.showRootDetail(t)},handleWheel(e){!this.camera||!this.controls||(e.preventDefault(),e.stopPropagation(),this.zoomCamera(e.deltaY>0?1.12:.88))},zoomCamera(e){var m,i;if(!this.camera||!this.controls)return;const t=this.controls.target,o=this.camera.position.clone().sub(t),s=o.length()||1,r=(m=this.parent)!=null&&m.classList.contains("cf-expanded")?2.4:2.8,a=(i=this.parent)!=null&&i.classList.contains("cf-expanded")?24:18,l=n.MathUtils.clamp(s*e,r,a);o.setLength(l),this.camera.position.copy(t).add(o),this.controls.update()},resetCamera(){var e;this.setCameraFrame((e=this.parent)==null?void 0:e.classList.contains("cf-expanded"))},setCameraFrame(e=!1){!this.camera||!this.controls||(e?(this.camera.fov=38,this.camera.position.set(.35,18.5,.35),this.controls.target.set(0,0,0),this.controls.minPolarAngle=Math.PI*.015,this.controls.maxPolarAngle=Math.PI*.18):(this.camera.fov=58,this.camera.position.set(5.5,4.6,8.5),this.controls.target.set(0,1.55,0),this.controls.minPolarAngle=0,this.controls.maxPolarAngle=Math.PI*.48),this.camera.updateProjectionMatrix(),this.controls.update())},pickRoot(e){var a,l;const t=this.canvas.getBoundingClientRect();this.pointer.x=(e.clientX-t.left)/t.width*2-1,this.pointer.y=-((e.clientY-t.top)/t.height)*2+1,this.raycaster.setFromCamera(this.pointer,this.camera);const o=[];this.interactiveRoots.forEach(m=>m.traverse(i=>{i.isMesh&&o.push(i)}));const s=(a=this.raycaster.intersectObjects(o,!1)[0])==null?void 0:a.object;if(!s)return null;let r=s;for(;r;){if(this.interactiveRoots.includes(r))return r;if((l=r.userData)!=null&&l.root&&this.interactiveRoots.includes(r.userData.root))return r.userData.root;r=r.parent}return null},setHighlight(e,t,o=!1){const s=o?new n.Color(3718648):new n.Color(10741301),r=o?.65:.32;e.traverse(a=>{var l;!a.isMesh||!((l=a.material)!=null&&l.emissive)||(a.userData.originalEmissive||(a.userData.originalEmissive=a.material.emissive.clone(),a.userData.originalIntensity=a.material.emissiveIntensity||0),t?(a.material.emissive.copy(s),a.material.emissiveIntensity=r):(a.material.emissive.copy(a.userData.originalEmissive),a.material.emissiveIntensity=a.userData.originalIntensity))})},updateTooltip(e){if(!this.tooltip)return;if(!e){this.tooltip.innerHTML='<span class="cf-tooltip-dot"></span><div><strong>Hover a tower</strong><small>Click to inspect rack details</small></div>';return}const t=e.userData||{},o=Array.isArray(t.plants)?t.plants.length:0;this.tooltip.innerHTML=`
            <span class="cf-tooltip-dot ${t.status||"healthy"}"></span>
            <div><strong>${w(t.label||"Station")}</strong><small>${t.isDevice?`${t.scope||"farm"} ${t.type}`:o?`${o} active plants`:t.isTank?"Nutrient station":"Empty zone"}</small></div>
        `},showOverview(){var t;const e=this.slotPlants.filter(Boolean).length;this.detailPanel.innerHTML=G({title:((t=this.farm)==null?void 0:t.name)||v.farmName||"Commercial Farm",subtitle:`${this.rack.label} · ${e}/${this.rack.total} planted`,status:T(this.slotPlants,this.sensorSnapshot),mode:"Facility overview"})},showRootDetail(e){const t=e.userData||{};if(t.isTank){this.detailPanel.innerHTML=te(t,this.sensorSnapshot);return}if(t.isDevice){this.detailPanel.innerHTML=ne(t);return}const o=Array.isArray(t.plants)?t.plants:[];this.detailPanel.innerHTML=ee(t,o,this.sensorSnapshot)},async toggleFullscreen(){if(!this.parent)return;!this.parent.classList.contains("cf-expanded")?this.enterExpandedView():this.exitExpandedView()},enterExpandedView(){!this.parent||this.parent.classList.contains("cf-expanded")||(this.originalParent=this.parent.parentNode,this.originalNextSibling=this.parent.nextSibling,document.body.appendChild(this.parent),this.parent.classList.add("cf-expanded"),document.documentElement.classList.add("cf-expanded-lock"),document.body.classList.add("cf-expanded-lock"),this.syncExpandButton(),this.setCameraFrame(!0),requestAnimationFrame(()=>this.resize()),setTimeout(()=>this.resize(),120))},exitExpandedView(){this.parent&&(this.parent.classList.remove("cf-expanded"),document.documentElement.classList.remove("cf-expanded-lock"),document.body.classList.remove("cf-expanded-lock"),this.restoreHostPlacement(),this.syncExpandButton(),this.setCameraFrame(!1),requestAnimationFrame(()=>this.resize()),setTimeout(()=>this.resize(),120))},restoreHostPlacement(){!this.parent||!this.originalParent||(this.originalNextSibling&&this.originalNextSibling.parentNode===this.originalParent?this.originalParent.insertBefore(this.parent,this.originalNextSibling):this.originalParent.appendChild(this.parent),this.originalParent=null,this.originalNextSibling=null)},syncExpandButton(){!this.fullscreenButton||!this.parent||(this.fullscreenButton.textContent=this.parent.classList.contains("cf-expanded")?"CLOSE":"EXPAND")},resize(){var l,m;if(!this.canvas||!this.renderer||!this.camera)return;const e=(l=this.parent)==null?void 0:l.classList.contains("cf-expanded"),t=(m=this.parent)==null?void 0:m.classList.contains("commercial-command-screen"),o=e||t;t&&(E(this.parent,{position:"fixed",inset:"0",width:"100vw",height:"100vh",minHeight:"100vh",overflow:"hidden",borderRadius:"0"}),E(this.canvas,{position:"fixed",inset:"0",width:"100vw",height:"100vh",minHeight:"100vh",display:"block",borderRadius:"0"}));const s=this.canvas.getBoundingClientRect(),r=o?window.innerWidth||document.documentElement.clientWidth||s.width||1280:Math.max(320,s.width||this.parent.clientWidth||640),a=o?window.innerHeight||document.documentElement.clientHeight||s.height||720:Math.max(300,s.height||420);this.renderer.setSize(r,a,!1),this.camera.aspect=r/a,this.camera.updateProjectionMatrix()},animate(){var t,o;const e=Math.min(.04,((o=(t=this.clock)==null?void 0:t.getDelta)==null?void 0:o.call(t))||.016);this.frame+=1,this.controls&&this.controls.update(),this.updateParticles(),this.scene.traverse(s=>{var r,a;(r=s.userData)!=null&&r.isFanBlade&&(s.rotation.z+=4.8*e),(a=s.userData)!=null&&a.isDrip&&(s.position.y-=.55*e,s.position.y<.7&&(s.position.y=s.userData.baseY))}),this.renderer&&this.scene&&this.camera&&this.renderer.render(this.scene,this.camera),this.rafId=requestAnimationFrame(()=>this.animate())},updateParticles(){if(!this.particles)return;const e=this.particles.geometry.attributes.position,t=this.particles.userData.velocities;for(let o=0;o<e.count;o++)e.array[o*3]+=t[o*3],e.array[o*3+1]+=t[o*3+1],e.array[o*3+2]+=t[o*3+2],e.array[o*3]>7.5&&(e.array[o*3]=-7.5),e.array[o*3]<-7.5&&(e.array[o*3]=7.5),e.array[o*3+1]>5.4&&(e.array[o*3+1]=.7),e.array[o*3+2]>5.5&&(e.array[o*3+2]=-5.5),e.array[o*3+2]<-5.5&&(e.array[o*3+2]=5.5);e.needsUpdate=!0},createTextSprite(e,t={}){const o=document.createElement("canvas");o.width=512,o.height=128;const s=o.getContext("2d");s.clearRect(0,0,o.width,o.height),Q(s,18,22,o.width-36,84,28),s.fillStyle=t.bg||"rgba(12,20,14,.9)",s.fill(),t.border&&(s.strokeStyle=t.border,s.lineWidth=4,s.stroke()),s.fillStyle=t.fg||"#ffffff",s.font=t.font||"900 30px Inter, system-ui, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillText(e,o.width/2,66);const r=new n.CanvasTexture(o);r.colorSpace=n.SRGBColorSpace;const a=new n.SpriteMaterial({map:r,transparent:!0,depthWrite:!1}),l=new n.Sprite(a);return l.userData.texture=r,l},destroy(){var e;this.rafId&&cancelAnimationFrame(this.rafId),this.rafId=null,this.resizeHandler&&window.removeEventListener("resize",this.resizeHandler),this.fullscreenHandler&&document.removeEventListener("fullscreenchange",this.fullscreenHandler),this.canvas&&this.onPointerMove&&this.canvas.removeEventListener("pointermove",this.onPointerMove),this.canvas&&this.onClick&&this.canvas.removeEventListener("click",this.onClick),this.canvas&&this.onDoubleClick&&this.canvas.removeEventListener("dblclick",this.onDoubleClick),this.canvas&&this.onWheel&&this.canvas.removeEventListener("wheel",this.onWheel),this.controls&&this.controls.dispose(),this.scene&&this.scene.traverse(t=>{var o;t.geometry&&t.geometry.dispose(),(o=t.userData)!=null&&o.texture&&t.userData.texture.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(s=>s.dispose()):t.material.dispose())}),this.renderer&&this.renderer.dispose(),(e=this.parent)!=null&&e.classList.contains("cf-expanded")&&this.exitExpandedView(),this.parent&&(this.parent.classList.remove("cf-expanded"),this.parent.querySelectorAll(".cf-overlay, .cf-tooltip, .cf-expand-btn, .cf-zoom-controls").forEach(t=>t.remove()),this.parent.classList.remove("commercial-farm-host")),document.documentElement.classList.remove("cf-expanded-lock"),document.body.classList.remove("cf-expanded-lock"),this.canvas=null,this.parent=null,this.renderer=null,this.scene=null,this.camera=null,this.controls=null,this.farmGroup=null,this.particles=null,this.raycaster=null,this.pointer=null,this.interactiveRoots=[],this.hoverRoot=null,this.selectedRoot=null,this.detailPanel=null,this.tooltip=null,this.fullscreenButton=null,this.zoomControls=null,this.originalParent=null,this.originalNextSibling=null,this.resizeHandler=null,this.fullscreenHandler=null,this.onPointerMove=null,this.onClick=null,this.onDoubleClick=null,this.onWheel=null}};function B(){const e=H();return v.currentFarm||e.find(t=>t.id===v.currentFarmId)||e[e.length-1]||null}function H(){try{return JSON.parse(localStorage.getItem($))||[]}catch{return[]}}function A(e){if(C(e).length){const o=C(e).length;return{id:"commercial-zones",label:`${o}-Zone Commercial Farm`,tiers:o,slotsPerTier:12,total:Math.max(12,o*12)}}const t=String((e==null?void 0:e.rackTypeId)||(e==null?void 0:e.rackType)||(e==null?void 0:e.rackLabel)||"").toLowerCase();return t.includes("2")?M["2-tier"]:t.includes("4")?M["4-tier"]:t.includes("5")?M["5-tier"]:t.includes("wall")||t.includes("grid")?M.wall:t.includes("frame")?M["a-frame"]:t.includes("nft")||t.includes("channel")?M["nft-channel"]:t.includes("hanging")||t.includes("column")?M.hanging:M["3-tier"]}function _(e,t){const o=Array.isArray(e==null?void 0:e.plants)?e.plants:[],s=C(e),r=s.length?Math.max(t.total,s.length*12,o.length*3):t.total,a=Array(r).fill(null),l=new Set;if(o.forEach((i,u)=>{var d;if(s.length&&i.zoneId){const c=s.findIndex(g=>Z(g,i)),p=Math.max(0,c)*12,f=Math.max(1,Number.parseInt(i.slots||i.count||1,10)||1);for(let g=0;g<f;g++){const b=W(a,l,p,p+12)??D(a,l);if(b===-1||b===null||b===void 0)return;a[b]=k(i,b,t,e),a[b].zoneId=i.zoneId,a[b].zoneName=i.zoneName||((d=s[c])==null?void 0:d.name)||i.zoneId,l.add(b)}return}if(i.slotIndex!==void 0&&i.slotIndex!==null){const c=Number(i.slotIndex);Number.isInteger(c)&&c>=0&&c<a.length&&(a[c]=k(i,c,t,e),l.add(c));return}const h=Math.max(1,Number.parseInt(i.slots||i.count||1,10)||1);for(let c=0;c<h;c++){const p=D(a,l);if(p===-1)return;a[p]=k(i,p,t,e),l.add(p)}}),a.some(Boolean))return a;const m=Math.min(t.total,Number.parseInt((e==null?void 0:e.plantSlots)||(e==null?void 0:e.plants)||0,10)||0);for(let i=0;i<m;i++)a[i]=k({name:(e==null?void 0:e.targetPlant)||"Plant",status:"healthy"},i,t,e);return a}function C(e){var r;const t=Array.isArray(e==null?void 0:e.zones)?e.zones:Array.isArray((r=e==null?void 0:e.commercialStructure)==null?void 0:r.zones)?e.commercialStructure.zones:[];if(t.length)return t.map((a,l)=>({...a,zone_id:a.zone_id||a.id||`zone_${String.fromCharCode(65+l)}`,name:a.name||`Zone ${String.fromCharCode(65+l)}`})).filter(a=>a.zone_id||a.name);const o=Array.isArray(e==null?void 0:e.plants)?e.plants:[],s=new Map;return o.forEach((a,l)=>{const m=a.zoneId||a.zone_id||a.zone||a.area;if(!m)return;const i=String(m);s.has(i)||s.set(i,{zone_id:i,name:a.zoneName||`Zone ${String.fromCharCode(65+s.size)}`,crop:a.name||a.species||"Mixed crops",plants:[]});const u=s.get(i),h=a.name||a.species||`Plant ${l+1}`;u.plants.includes(h)||u.plants.push(h),u.crop=u.plants.join(", ")}),s.size?[...s.values()]:(e==null?void 0:e.accountMode)==="commercial"||(e==null?void 0:e.viewMode)==="commercial"?[{zone_id:"zone_A",name:e!=null&&e.name?`${e.name} Zone`:"Zone A",crop:(e==null?void 0:e.targetPlant)||"Commercial crops",plants:e!=null&&e.targetPlant?String(e.targetPlant).split(",").map(a=>a.trim()).filter(Boolean):["Commercial crops"]}]:[]}function Z(e,t){const o=String(t.zoneId||t.zone_id||t.zone||"").toLowerCase();return o&&(o===String(e.zone_id||"").toLowerCase()||o===String(e.id||"").toLowerCase()||o===String(e.name||"").toLowerCase())}function W(e,t,o,s){const r=Math.max(0,o),a=Math.min(e.length,s);for(let l=r;l<a;l++)if(!e[l]&&!t.has(l))return l;return null}function k(e,t,o,s){const r=e.name||(s==null?void 0:s.targetPlant)||"Plant";return{name:r,emoji:e.emoji||se(r),species:e.species||R(r),status:e.status||O(e.growth),growth:Number(e.growth??70),days:Number(e.days??0),slotIndex:t,tier:Math.floor(t/o.slotsPerTier)+1,position:t%o.slotsPerTier+1}}function D(e,t){for(let o=0;o<e.length;o++)if(!e[o]&&!t.has(o))return o;return-1}function O(e){const t=Number(e??80);return t<35?"danger":t<60?"warning":"healthy"}function P(e){return e==="danger"?15680580:e==="warning"?16096779:e==="empty"?6583435:8702998}function V(e){return e.length?e.some(t=>t.status==="danger")?"danger":e.some(t=>t.status==="warning")?"warning":"healthy":"empty"}function T(e,t){return e.some(Boolean)&&e.some(o=>(o==null?void 0:o.status)==="danger")?"Critical plant risk":Number(t.gasRaw||0)>2500||Number(t.temperature||25)>35?"Automation alert":e.some(o=>(o==null?void 0:o.status)==="warning")?"Needs review":"Operational"}function L(){const e=v.sensors||{},t=v.latestReading||v.currentReading||{},o=(s,...r)=>{for(const a of r){const l=a&&typeof a=="object"&&"val"in a?a.val:a,m=Number(l);if(Number.isFinite(m))return m}return s};return{temperature:o(25,e.temp,e.temperature,t.temperature,t.temp),humidity:o(60,e.humid,e.humidity,t.humidity,t.humid),lightRaw:o(2e3,e.lightRaw,e.light,t.lightRaw,t.light),soilRaw:o(1800,e.soilRaw,e.soil,t.soilRaw,t.soilMoisture,t.moisture),ph:o(6.1,e.ph,t.ph),waterDistanceCm:o(10,e.water,e.waterDistanceCm,t.waterDistanceCm,t.waterLevel),gasRaw:o(1e3,e.nutrient,e.gasRaw,t.gasRaw,t.gasValue),ec:o(1.5,e.ec,t.ec),co2Ppm:o(850,e.co2,t.co2Ppm),energyKwh:o(5.1,e.energy,e.energyKwh,t.energyKwh),waterFlowLpm:o(.8,e.flow,e.waterFlowLpm,t.waterFlowLpm)}}function q(e,t){return{dht11:`${Number(t.temperature||0).toFixed(1)}C / ${Number(t.humidity||0)}%`,soil:`${Number(t.soilRaw||1800)} raw`,ldr:`${Number(t.lightRaw||0)} raw`,ph:`${Number(t.ph||0).toFixed(1)} pH`,ec:`${Number(t.ec||1.5).toFixed(1)} EC`,flow:`${Number(t.waterFlowLpm||.8).toFixed(1)} L/min`,pump:Number(t.waterDistanceCm||0)>20?"ready":"standby",zone_fan:Number(t.temperature||25)>30?"active":"standby",active_buzzer:Number(t.gasRaw||0)>2500?"alert":"ready",camera:"scan ready"}[e]||"--"}function K(e){return{dht11:"DHT",soil:"SOIL",ldr:"LDR",ph:"pH",ec:"EC",flow:"FLOW",pump:"PUMP",zone_fan:"FAN",active_buzzer:"BUZZ",camera:"CAM"}[e]||String(e).slice(0,4).toUpperCase()}function X(e){const t=String(e.value||"").toLowerCase();return t.includes("alert")||t.includes("danger")?"danger":t.includes("active")?"warning":"healthy"}function Y(e){const t=Number(e.ph??6.1);return t<5.5||t>6.5}function U(e){const t=R((e==null?void 0:e.species)||(e==null?void 0:e.name)||"plant"),o=S[t];if(o)return o;const s=Object.keys(S).find(r=>t.includes(r));return S[s]||S.plant}function j(e,t,o,s){return Number.isNaN(e)?!1:e%s===o||Math.floor(e/Math.max(1,t.slotsPerTier))===o}function J(e,t,o,s,r,a={}){return e!=null&&e.zoneId&&a.zoneId?String(e.zoneId).toLowerCase()===String(a.zoneId).toLowerCase():e!=null&&e.zoneName&&a.label?String(e.zoneName).toLowerCase()===String(a.label).toLowerCase():j(t,o,s,r)}function I(e,t,o){const s=new n.BufferGeometry().setFromPoints([new n.Vector3(...e),new n.Vector3(...t)]);return new n.Line(s,o)}function Q(e,t,o,s,r,a){e.beginPath(),e.moveTo(t+a,o),e.lineTo(t+s-a,o),e.quadraticCurveTo(t+s,o,t+s,o+a),e.lineTo(t+s,o+r-a),e.quadraticCurveTo(t+s,o+r,t+s-a,o+r),e.lineTo(t+a,o+r),e.quadraticCurveTo(t,o+r,t,o+r-a),e.lineTo(t,o+a),e.quadraticCurveTo(t,o,t+a,o),e.closePath()}function G({title:e,subtitle:t,status:o,mode:s}){return`
        <div class="cf-panel-kicker">${w(s)}</div>
        <div class="cf-panel-title">${w(e)}</div>
        <div class="cf-panel-sub">${w(t)}</div>
        <div class="cf-mini-grid">
            ${x("Status",o)}
            ${x("Light",`${Math.round(Number(L().lightRaw||0))}`)}
            ${x("pH",`${Number(L().ph||0).toFixed(1)}`)}
        </div>
    `}function ee(e,t,o){const s=t.filter(l=>l.status==="healthy").length,r=t.filter(l=>l.status==="warning").length,a=t.filter(l=>l.status==="danger").length;return`
        <div class="cf-panel-kicker">Selected production zone</div>
        <div class="cf-panel-title">${w(e.label||"Zone")}</div>
        <div class="cf-panel-sub">${t.length||0} active plants · ${w(e.status||"empty")}</div>
        <div class="cf-mini-grid">
            ${x("Healthy",s)}
            ${x("Warning",r)}
            ${x("Critical",a)}
            ${x("Temp",`${Number(o.temperature||0).toFixed(1)}C`)}
        </div>
        <div class="cf-plant-list">
            ${t.slice(0,5).map(l=>`<span>${w(l.name)} <b>${w(l.status)}</b></span>`).join("")||"<span>No assigned crop yet</span>"}
        </div>
    `}function te(e,t){return`
        <div class="cf-panel-kicker">Nutrient station</div>
        <div class="cf-panel-title">${w(e.label||"Tank")} Tank</div>
        <div class="cf-panel-sub">Linked to commercial automation controls</div>
        <div class="cf-mini-grid">
            ${x("pH",`${Number(t.ph||0).toFixed(1)}`)}
            ${x("Water",`${Number(t.waterDistanceCm||0)}cm`)}
            ${x("Status",w(e.status||"healthy"))}
        </div>
    `}function ne(e){const t=e.scope==="zone"?e.zoneLabel||e.zoneId||"Zone":"Farm Level",o=e.type==="output"?"Actuator / Output":"Sensor";return`
        <div class="cf-panel-kicker">Digital twin device</div>
        <div class="cf-panel-title">${w(e.label||"Device")}</div>
        <div class="cf-panel-sub">${w(t)} · ${w(o)}</div>
        <div class="cf-mini-grid">
            ${x("Value",e.value||"--")}
            ${x("Status",e.status||"healthy")}
            ${x("Type",e.type||"sensor")}
        </div>
        <div class="cf-plant-list">
            <span>Layer <b>${w(e.scope==="zone"?"ZONE":"FARM")}</b></span>
            <span>Clickable <b>YES</b></span>
            <span>Purpose <b>${w(oe(e.key))}</b></span>
        </div>
    `}function oe(e){return{co2:"air enrichment",reservoir:"water level",gas:"safety alert",power:"energy tracking",main_fan:"facility airflow",emergency_buzzer:"emergency alarm",dht11:"temperature humidity",soil:"root moisture",ldr:"light detection",ph:"water acidity",ec:"nutrient strength",flow:"irrigation flow",pump:"irrigation output",zone_fan:"zone airflow",active_buzzer:"zone warning",camera:"plant vision"}[e]||"monitoring"}function x(e,t){return`<div class="cf-mini-metric"><span>${w(e)}</span><strong>${w(t)}</strong></div>`}function se(e=""){const t=String(e).toLowerCase();return t.includes("lettuce")||t.includes("cabbage")||t.includes("kale")?"🥬":t.includes("tomato")?"🍅":t.includes("chili")||t.includes("pepper")?"🌶️":t.includes("strawberry")?"🍓":t.includes("cucumber")?"🥒":t.includes("carrot")?"🥕":t.includes("eggplant")?"🍆":t.includes("basil")||t.includes("mint")||t.includes("spinach")?"🌿":"🌱"}function R(e=""){return String(e||"plant").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function w(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function E(e,t){e&&Object.entries(t).forEach(([o,s])=>{const r=o.replace(/[A-Z]/g,a=>"-"+a.toLowerCase());e.style.setProperty(r,s,"important")})}function ae(){if(document.getElementById("commercial-farm-canvas-style"))return;const e=document.createElement("style");e.id="commercial-farm-canvas-style",e.textContent=`
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
