import{A as y}from"./index-CIzUcNGo.js";import*as n from"https://esm.sh/three@0.160.0";import{OrbitControls as R}from"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const z="user_farms",b={"2-tier":{id:"2-tier",label:"2-Tier Starter Rack",tiers:2,slotsPerTier:3,total:6},"3-tier":{id:"3-tier",label:"3-Tier Vertical Rack",tiers:3,slotsPerTier:3,total:9},"4-tier":{id:"4-tier",label:"4-Tier Grow Shelf",tiers:4,slotsPerTier:4,total:16},"5-tier":{id:"5-tier",label:"5-Tier Tower Rack",tiers:5,slotsPerTier:4,total:20},wall:{id:"wall",label:"Wall Panel Grid",tiers:4,slotsPerTier:5,total:20},"a-frame":{id:"a-frame",label:"A-Frame Pyramid",tiers:4,slotsPerTier:4,total:16},"nft-channel":{id:"nft-channel",label:"NFT Channel Rows",tiers:3,slotsPerTier:6,total:18},hanging:{id:"hanging",label:"Hanging Column Farm",tiers:5,slotsPerTier:3,total:15}},k={lettuce:{color:6927180,alt:9228129,leaf:.082,spread:.095},cabbage:{color:7448635,alt:10733911,leaf:.09,spread:.1},kale:{color:3108670,alt:5213518,leaf:.088,spread:.105},spinach:{color:3046706,alt:4431943,leaf:.072,spread:.088},basil:{color:2067020,alt:3323495,leaf:.064,spread:.078},mint:{color:3450963,alt:7327605,leaf:.062,spread:.078},tomato:{color:3116870,alt:15680580,leaf:.07,spread:.086,fruit:15680580},chili:{color:2522941,alt:14427686,leaf:.066,spread:.082,fruit:14427686},pepper:{color:2522941,alt:14427686,leaf:.066,spread:.082,fruit:14427686},cucumber:{color:2325052,alt:5284955,leaf:.078,spread:.105,vine:!0},strawberry:{color:4165449,alt:16478597,leaf:.066,spread:.082,fruit:16478597},eggplant:{color:3112783,alt:8141549,leaf:.072,spread:.088,fruit:8141549},plant:{color:6660877,alt:8843180,leaf:.072,spread:.09}},U={canvas:null,parent:null,renderer:null,scene:null,camera:null,controls:null,farmGroup:null,particles:null,raycaster:null,pointer:null,interactiveRoots:[],hoverRoot:null,selectedRoot:null,detailPanel:null,tooltip:null,fullscreenButton:null,resizeHandler:null,fullscreenHandler:null,rafId:null,clock:null,frame:0,farm:null,rack:b["3-tier"],slotPlants:[],sensorSnapshot:{},init(e){this.destroy(),this.installHandlers(),Y(),this.canvas=document.getElementById(e),this.canvas&&(this.parent=this.canvas.parentElement,this.parent&&(this.farm=G(),this.rack=H(this.farm),this.slotPlants=F(this.farm,this.rack),this.sensorSnapshot=P(),this.clock=new n.Clock,this.prepareHost(),this.initScene(),this.buildFacility(),this.createOverlays(),this.bindEvents(),this.resize(),this.animate()))},prepareHost(){this.parent.classList.add("commercial-farm-host"),this.canvas.classList.add("commercial-farm-canvas"),this.parent.querySelectorAll(".cf-overlay, .cf-tooltip, .cf-expand-btn").forEach(e=>e.remove())},initScene(){this.scene=new n.Scene,this.scene.background=new n.Color(463116),this.scene.fog=new n.Fog(463116,14,42),this.camera=new n.PerspectiveCamera(58,1,.1,120),this.camera.position.set(5.5,4.6,8.5),this.camera.lookAt(0,1.8,0),this.renderer=new n.WebGLRenderer({canvas:this.canvas,antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=n.PCFSoftShadowMap,this.renderer.outputColorSpace=n.SRGBColorSpace,this.renderer.toneMapping=n.ACESFilmicToneMapping,this.renderer.toneMappingExposure=1.08,this.controls=new R(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.07,this.controls.enablePan=!0,this.controls.enableZoom=!0,this.controls.minDistance=3.2,this.controls.maxDistance=18,this.controls.maxPolarAngle=Math.PI*.48,this.controls.target.set(0,1.55,0),this.controls.update(),this.raycaster=new n.Raycaster,this.pointer=new n.Vector2,this.farmGroup=new n.Group,this.scene.add(this.farmGroup),this.addLighting()},addLighting(){this.scene.add(new n.AmbientLight(14479072,.55));const e=new n.DirectionalLight(16775399,2.2);e.position.set(10,18,9),e.castShadow=!0,e.shadow.mapSize.set(2048,2048),e.shadow.camera.left=-12,e.shadow.camera.right=12,e.shadow.camera.top=12,e.shadow.camera.bottom=-12,e.shadow.bias=-4e-4,this.scene.add(e);const t=new n.DirectionalLight(12244991,.35);t.position.set(-7,10,-6),this.scene.add(t);const s=new n.HemisphereLight(11657727,4928541,.28);this.scene.add(s);const a=new n.PointLight(8702998,1.25,12);a.position.set(0,3.1,0),this.scene.add(a)},buildFacility(){this.addFloor(),this.addGreenhouseFrame(),this.addOverheadGrowLights();const e=this.createTowerLayout();e.forEach((t,s)=>this.addTower(t,s)),this.addIrrigationPipes(e),this.addNutrientStation(),this.addControlPanel(),this.addVentilationFans(),this.addWaterDrips(e),this.addParticles()},addFloor(){const e=new n.Mesh(new n.PlaneGeometry(18,14),new n.MeshStandardMaterial({color:3422774,roughness:.86,metalness:.04}));e.rotation.x=-Math.PI/2,e.receiveShadow=!0,this.scene.add(e);const t=new n.Mesh(new n.PlaneGeometry(2.4,12.6),new n.MeshStandardMaterial({color:4541253,roughness:.78}));t.rotation.x=-Math.PI/2,t.position.y=.006,t.receiveShadow=!0,this.scene.add(t);const s=new n.LineBasicMaterial({color:6321254,transparent:!0,opacity:.32});for(let a=-8;a<=8;a+=1)this.scene.add(T([a,.014,-6.5],[a,.014,6.5],s));for(let a=-6;a<=6;a+=1)this.scene.add(T([-8.5,.016,a],[8.5,.016,a],s))},addGreenhouseFrame(){const e=new n.MeshStandardMaterial({color:5989472,metalness:.72,roughness:.26}),t=new n.MeshPhysicalMaterial({color:14024674,transparent:!0,opacity:.1,roughness:.04,side:n.DoubleSide}),s=17.6,a=13.6,r=4.3,i=6.2;for(let l=-a/2;l<=a/2+.001;l+=2.7){[-1,1].forEach(p=>{const h=new n.Mesh(new n.CylinderGeometry(.035,.035,r,10),e);h.position.set(p*s/2,r/2,l),h.castShadow=!0,this.scene.add(h)});const c=Math.sqrt((s/2)**2+(i-r)**2),u=Math.atan2(i-r,s/2);[-1,1].forEach(p=>{const h=new n.Mesh(new n.CylinderGeometry(.028,.028,c,8),e);h.position.set(p*s/4,r+(i-r)/2,l),h.rotation.z=p*(Math.PI/2-u),this.scene.add(h)})}const o=new n.Mesh(new n.CylinderGeometry(.032,.032,a,10),e);o.rotation.x=Math.PI/2,o.position.set(0,i,0),this.scene.add(o);const d=new n.Mesh(new n.PlaneGeometry(s,r),t);d.position.set(0,r/2,-a/2),this.scene.add(d),[-1,1].forEach(l=>{const c=new n.Mesh(new n.PlaneGeometry(a,r),t);c.rotation.y=Math.PI/2,c.position.set(l*s/2,r/2,0),this.scene.add(c)})},addOverheadGrowLights(){const e=new n.MeshStandardMaterial({color:2042167,roughness:.5,metalness:.72}),t=new n.MeshStandardMaterial({color:14518527,emissive:14518527,emissiveIntensity:.85,roughness:.2});[-4.8,-2.4,2.4,4.8].forEach(s=>{for(let a=-4.8;a<=4.8;a+=2.4){const r=new n.Mesh(new n.BoxGeometry(1.4,.06,.16),e);r.position.set(s,4.15,a),this.scene.add(r);const i=new n.Mesh(new n.BoxGeometry(1.16,.025,.09),t);i.position.set(s,4.11,a),this.scene.add(i)}})},createTowerLayout(){const e=Math.max(6,Math.min(10,Math.ceil(this.rack.total/2))),t=[],s=Math.ceil(e/2),a=-((s-1)*2.15)/2,r=[-2.35,2.35];for(let i=0;i<2;i++)for(let o=0;o<s&&!(t.length>=e);o++)t.push({x:a+o*2.15,z:r[i],zoneIndex:t.length,row:i,col:o});return t},addTower(e,t){const s=String.fromCharCode(65+t),a=new n.Group;a.position.set(e.x,0,e.z),a.userData={isTower:!0,id:`zone-${s}`,label:`Zone ${s}`,zoneIndex:t,plants:[],status:"empty"};const r=new n.MeshStandardMaterial({color:15330800,roughness:.34,metalness:.18}),i=new n.MeshStandardMaterial({color:2503725,roughness:.5,metalness:.4}),o=new n.Mesh(new n.CylinderGeometry(.095,.12,3.2,22),r);o.position.y=1.67,o.castShadow=!0,a.add(o);const d=new n.Mesh(new n.CylinderGeometry(.48,.6,.15,28),i);d.position.y=.075,d.castShadow=!0,a.add(d);const l=this.slotPlants.map((f,m)=>({plant:f,index:m})).filter(f=>f.plant&&q(f.index,this.rack,t,this.createTowerLayout().length)),c=8,u=4;let p=0;for(let f=0;f<c;f++){const m=.38+f*.36,v=new n.Mesh(new n.TorusGeometry(.42,.012,8,48),new n.MeshStandardMaterial({color:5398874,roughness:.48,metalness:.35}));v.rotation.x=Math.PI/2,v.position.y=m,a.add(v);for(let M=0;M<u;M++){const E=M*Math.PI/2+(f%2?Math.PI/4:0),w=l[p]||null;this.addPod(a,E,m,(w==null?void 0:w.plant)||null,(w==null?void 0:w.index)??t*100+p,f,M),w!=null&&w.plant&&(a.userData.plants.push(w.plant),p+=1)}}a.userData.status=A(a.userData.plants);const h=this.createTextSprite(`ZONE ${s}`,{bg:"rgba(9,18,13,.88)",fg:"#a3e635",border:"#315d3e",font:"900 30px Inter, system-ui, sans-serif"});h.position.set(0,3.63,0),h.scale.set(.68,.18,1),a.add(h),this.farmGroup.add(a),this.interactiveRoots.push(a)},addPod(e,t,s,a,r,i,o){const l=Math.cos(t)*.48,c=Math.sin(t)*.48,u=(a==null?void 0:a.status)||"empty",p=B(u),h={index:r,tier:e.userData.zoneIndex+1,slot:i*4+o+1,plant:a,tower:e},f=new n.MeshStandardMaterial({color:a?16317180:2437676,roughness:.52,metalness:a?.08:.18}),m=new n.Mesh(new n.CylinderGeometry(.155,.12,.11,20),f);m.position.set(l,s,c),m.rotation.z=Math.PI/2,m.rotation.y=-t,m.castShadow=!0,m.userData.slot=h,m.userData.root=e,e.add(m);const v=new n.Mesh(new n.SphereGeometry(.045,12,8),new n.MeshStandardMaterial({color:p,emissive:p,emissiveIntensity:a?.38:.06}));v.position.set(l*1.1,s+.085,c*1.1),v.userData.slot=h,v.userData.root=e,e.add(v),a&&this.addPlantCluster(e,l*1.1,s+.12,c*1.1,a)},addPlantCluster(e,t,s,a,r){const i=W(r),o=new n.MeshStandardMaterial({color:3100976,roughness:.7}),d=new n.MeshStandardMaterial({color:i.color,roughness:.72,side:n.DoubleSide}),l=new n.MeshStandardMaterial({color:i.alt,roughness:.72,side:n.DoubleSide}),c=new n.Mesh(new n.CylinderGeometry(.008,.01,.15,6),o);c.position.set(t,s+.055,a),e.add(c);for(let u=0;u<7;u++){const p=Math.PI*2/7*u,h=i.spread+Math.random()*.025,f=new n.Mesh(new n.SphereGeometry(i.leaf,8,5),u%2?d:l);f.scale.set(1.4,.36,.82),f.position.set(t+Math.cos(p)*h,s+.12+u%3*.012,a+Math.sin(p)*h),f.rotation.set(-.45+Math.random()*.18,p,.18),f.castShadow=!0,e.add(f)}if(i.fruit)for(let u=0;u<2;u++){const p=Math.PI*u+.55,h=new n.Mesh(new n.SphereGeometry(.032,10,8),new n.MeshStandardMaterial({color:i.fruit,roughness:.55}));h.position.set(t+Math.cos(p)*.07,s+.105,a+Math.sin(p)*.07),e.add(h)}if(i.vine){const u=new n.Mesh(new n.CylinderGeometry(.006,.004,.34,5),new n.MeshStandardMaterial({color:i.color,roughness:.72}));u.position.set(t+.06,s-.02,a+.05),u.rotation.z=.25,e.add(u)}},addIrrigationPipes(e){const t=new n.MeshStandardMaterial({color:5605546,roughness:.28,metalness:.6}),s=new n.MeshStandardMaterial({color:9358054,roughness:.25,metalness:.55});[...new Set(e.map(r=>r.z))].forEach(r=>{const i=e.filter(c=>c.z===r),o=Math.min(...i.map(c=>c.x))-.8,d=Math.max(...i.map(c=>c.x))+.8,l=new n.Mesh(new n.CylinderGeometry(.035,.035,d-o,10),t);l.rotation.z=Math.PI/2,l.position.set((o+d)/2,3.35,r+.25),this.scene.add(l)}),e.forEach(r=>{const i=new n.Mesh(new n.CylinderGeometry(.02,.02,2.75,8),t);i.position.set(r.x+.28,1.9,r.z+.25),this.scene.add(i);const o=new n.Mesh(new n.SphereGeometry(.055,10,8),s);o.position.set(r.x+.28,3.28,r.z+.25),this.scene.add(o)})},addNutrientStation(){const e=new n.MeshStandardMaterial({color:2780750,roughness:.35,metalness:.15}),t=new n.MeshStandardMaterial({color:2054718,roughness:.4,metalness:.2});["N","P","K","pH"].forEach((a,r)=>{const i=-3+r*2,o=new n.Group;o.userData={isTank:!0,label:a,status:r===3&&O(this.sensorSnapshot)?"warning":"healthy"};const d=new n.Mesh(new n.CylinderGeometry(.42,.42,1.05,18),e);d.position.set(i,.58,-5.75),d.castShadow=!0,o.add(d);const l=new n.Mesh(new n.CylinderGeometry(.45,.42,.07,18),t);l.position.set(i,1.14,-5.75),o.add(l);const c=this.createTextSprite(a,{bg:"rgba(255,255,255,.92)",fg:"#0f172a",font:"900 34px Inter, system-ui, sans-serif"});c.position.set(i,.58,-5.28),c.scale.set(.22,.1,1),o.add(c),this.scene.add(o),this.interactiveRoots.push(o)})},addControlPanel(){const e=new n.MeshStandardMaterial({color:5593943,roughness:.5,metalness:.3}),t=new n.Mesh(new n.BoxGeometry(1.7,.08,.65),e);t.position.set(0,.86,5.75),t.castShadow=!0,this.scene.add(t);const s=new n.MeshStandardMaterial({color:464909,emissive:2062914,emissiveIntensity:.75,roughness:.12,metalness:.42}),a=new n.Mesh(new n.BoxGeometry(.95,.56,.04),s);a.position.set(0,1.38,5.45),a.castShadow=!0,this.scene.add(a);const r=this.createTextSprite("CONTROL",{bg:"rgba(9,18,13,.86)",fg:"#a3e635",font:"900 26px Inter, system-ui, sans-serif"});r.position.set(0,1.82,5.4),r.scale.set(.42,.13,1),this.scene.add(r)},addVentilationFans(){const e=new n.MeshStandardMaterial({color:2042167,roughness:.36,metalness:.55});[-7.3,7.3].forEach(t=>{const s=new n.Group;s.position.set(t,2.8,-5.9),s.userData.isFan=!0;const a=new n.Mesh(new n.TorusGeometry(.34,.025,8,32),e);s.add(a);for(let r=0;r<4;r++){const i=new n.Mesh(new n.BoxGeometry(.48,.045,.018),e);i.rotation.z=r*Math.PI/4,i.userData.isFanBlade=!0,s.add(i)}this.scene.add(s)})},addWaterDrips(e){const t=new n.MeshStandardMaterial({color:3718648,emissive:3718648,emissiveIntensity:.5,transparent:!0,opacity:.85});e.forEach((s,a)=>{if(a%2)return;const r=new n.Mesh(new n.SphereGeometry(.025,8,6),t.clone());r.position.set(s.x+.25,2.9,s.z+.28),r.userData.isDrip=!0,r.userData.baseY=r.position.y,this.scene.add(r)})},addParticles(){const t=new Float32Array(1080),s=new Float32Array(360*3);for(let i=0;i<360;i++)t[i*3]=(Math.random()-.5)*15,t[i*3+1]=Math.random()*4.4+.7,t[i*3+2]=(Math.random()-.5)*11,s[i*3]=(Math.random()-.5)*.002,s[i*3+1]=(Math.random()-.5)*.001,s[i*3+2]=(Math.random()-.5)*.002;const a=new n.BufferGeometry;a.setAttribute("position",new n.BufferAttribute(t,3));const r=new n.PointsMaterial({color:16777215,size:.028,transparent:!0,opacity:.28,depthWrite:!1,blending:n.AdditiveBlending});this.particles=new n.Points(a,r),this.particles.userData.velocities=s,this.scene.add(this.particles)},createOverlays(){var s;const e=this.slotPlants.filter(Boolean).length;this.detailPanel=document.createElement("div"),this.detailPanel.className="cf-overlay cf-info-panel",this.detailPanel.innerHTML=D({title:((s=this.farm)==null?void 0:s.name)||y.farmName||"Commercial Farm",subtitle:`${this.rack.label} · ${e}/${this.rack.total} planted`,status:C(this.slotPlants,this.sensorSnapshot),mode:"Facility overview"}),this.parent.appendChild(this.detailPanel),this.tooltip=document.createElement("div"),this.tooltip.className="cf-tooltip",this.tooltip.innerHTML='<span class="cf-tooltip-dot"></span><div><strong>Hover a tower</strong><small>Click to inspect rack details</small></div>',this.parent.appendChild(this.tooltip);const t=document.createElement("div");t.className="cf-overlay cf-legend",t.innerHTML=`
            <span><i class="ok"></i>Healthy</span>
            <span><i class="warn"></i>Warning</span>
            <span><i class="danger"></i>Critical</span>
            <span class="cf-legend-help">Drag rotate · Wheel zoom · Double click fullscreen</span>
        `,this.parent.appendChild(t),this.fullscreenButton=document.createElement("button"),this.fullscreenButton.type="button",this.fullscreenButton.className="cf-expand-btn",this.fullscreenButton.textContent="EXPAND",this.fullscreenButton.addEventListener("click",a=>{a.stopPropagation(),this.toggleFullscreen()}),this.parent.appendChild(this.fullscreenButton)},bindEvents(){this.resizeHandler=()=>this.resize(),window.addEventListener("resize",this.resizeHandler),this.fullscreenHandler=()=>{this.fullscreenButton&&(this.fullscreenButton.textContent=document.fullscreenElement===this.parent?"CLOSE":"EXPAND"),setTimeout(()=>this.resize(),80)},document.addEventListener("fullscreenchange",this.fullscreenHandler),this.canvas.addEventListener("pointermove",this.onPointerMove),this.canvas.addEventListener("click",this.onClick),this.canvas.addEventListener("dblclick",this.onDoubleClick)},onPointerMove:null,onClick:null,onDoubleClick:null,installHandlers(){this.onPointerMove=e=>this.handlePointerMove(e),this.onClick=e=>this.handleClick(e),this.onDoubleClick=()=>this.toggleFullscreen()},handlePointerMove(e){const t=this.pickRoot(e);t!==this.hoverRoot&&(this.hoverRoot&&this.hoverRoot!==this.selectedRoot&&this.setHighlight(this.hoverRoot,!1),this.hoverRoot=t,this.hoverRoot&&this.hoverRoot!==this.selectedRoot&&this.setHighlight(this.hoverRoot,!0)),this.canvas.style.cursor=t?"pointer":"grab",this.updateTooltip(t)},handleClick(e){const t=this.pickRoot(e);if(!t){this.selectedRoot&&this.setHighlight(this.selectedRoot,!1),this.selectedRoot=null,this.showOverview();return}this.selectedRoot&&this.selectedRoot!==t&&this.setHighlight(this.selectedRoot,!1),this.selectedRoot=t,this.setHighlight(t,!0,!0),this.showRootDetail(t)},pickRoot(e){var i,o;const t=this.canvas.getBoundingClientRect();this.pointer.x=(e.clientX-t.left)/t.width*2-1,this.pointer.y=-((e.clientY-t.top)/t.height)*2+1,this.raycaster.setFromCamera(this.pointer,this.camera);const s=[];this.interactiveRoots.forEach(d=>d.traverse(l=>{l.isMesh&&s.push(l)}));const a=(i=this.raycaster.intersectObjects(s,!1)[0])==null?void 0:i.object;if(!a)return null;let r=a;for(;r;){if(this.interactiveRoots.includes(r))return r;if((o=r.userData)!=null&&o.root&&this.interactiveRoots.includes(r.userData.root))return r.userData.root;r=r.parent}return null},setHighlight(e,t,s=!1){const a=s?new n.Color(3718648):new n.Color(10741301),r=s?.65:.32;e.traverse(i=>{var o;!i.isMesh||!((o=i.material)!=null&&o.emissive)||(i.userData.originalEmissive||(i.userData.originalEmissive=i.material.emissive.clone(),i.userData.originalIntensity=i.material.emissiveIntensity||0),t?(i.material.emissive.copy(a),i.material.emissiveIntensity=r):(i.material.emissive.copy(i.userData.originalEmissive),i.material.emissiveIntensity=i.userData.originalIntensity))})},updateTooltip(e){if(!this.tooltip)return;if(!e){this.tooltip.innerHTML='<span class="cf-tooltip-dot"></span><div><strong>Hover a tower</strong><small>Click to inspect rack details</small></div>';return}const t=e.userData||{},s=Array.isArray(t.plants)?t.plants.length:0;this.tooltip.innerHTML=`
            <span class="cf-tooltip-dot ${t.status||"healthy"}"></span>
            <div><strong>${g(t.label||t.label||"Station")}</strong><small>${s?`${s} active plants`:t.isTank?"Nutrient station":"Empty zone"}</small></div>
        `},showOverview(){var t;const e=this.slotPlants.filter(Boolean).length;this.detailPanel.innerHTML=D({title:((t=this.farm)==null?void 0:t.name)||y.farmName||"Commercial Farm",subtitle:`${this.rack.label} · ${e}/${this.rack.total} planted`,status:C(this.slotPlants,this.sensorSnapshot),mode:"Facility overview"})},showRootDetail(e){const t=e.userData||{};if(t.isTank){this.detailPanel.innerHTML=V(t,this.sensorSnapshot);return}const s=Array.isArray(t.plants)?t.plants:[];this.detailPanel.innerHTML=_(t,s,this.sensorSnapshot)},async toggleFullscreen(){if(!this.parent)return;const e=!this.parent.classList.contains("cf-expanded");this.parent.classList.toggle("cf-expanded",e),this.fullscreenButton&&(this.fullscreenButton.textContent=e?"CLOSE":"EXPAND"),document.body.classList.toggle("cf-expanded-lock",e),setTimeout(()=>this.resize(),80)},resize(){if(!this.canvas||!this.renderer||!this.camera)return;const e=this.canvas.getBoundingClientRect(),t=Math.max(320,e.width||this.parent.clientWidth||640),s=Math.max(300,e.height||420);this.renderer.setSize(t,s,!1),this.camera.aspect=t/s,this.camera.updateProjectionMatrix()},animate(){var t,s;const e=Math.min(.04,((s=(t=this.clock)==null?void 0:t.getDelta)==null?void 0:s.call(t))||.016);this.frame+=1,this.controls&&this.controls.update(),this.updateParticles(),this.scene.traverse(a=>{var r,i;(r=a.userData)!=null&&r.isFanBlade&&(a.rotation.z+=4.8*e),(i=a.userData)!=null&&i.isDrip&&(a.position.y-=.55*e,a.position.y<.7&&(a.position.y=a.userData.baseY))}),this.renderer&&this.scene&&this.camera&&this.renderer.render(this.scene,this.camera),this.rafId=requestAnimationFrame(()=>this.animate())},updateParticles(){if(!this.particles)return;const e=this.particles.geometry.attributes.position,t=this.particles.userData.velocities;for(let s=0;s<e.count;s++)e.array[s*3]+=t[s*3],e.array[s*3+1]+=t[s*3+1],e.array[s*3+2]+=t[s*3+2],e.array[s*3]>7.5&&(e.array[s*3]=-7.5),e.array[s*3]<-7.5&&(e.array[s*3]=7.5),e.array[s*3+1]>5.4&&(e.array[s*3+1]=.7),e.array[s*3+2]>5.5&&(e.array[s*3+2]=-5.5),e.array[s*3+2]<-5.5&&(e.array[s*3+2]=5.5);e.needsUpdate=!0},createTextSprite(e,t={}){const s=document.createElement("canvas");s.width=512,s.height=128;const a=s.getContext("2d");a.clearRect(0,0,s.width,s.height),X(a,18,22,s.width-36,84,28),a.fillStyle=t.bg||"rgba(12,20,14,.9)",a.fill(),t.border&&(a.strokeStyle=t.border,a.lineWidth=4,a.stroke()),a.fillStyle=t.fg||"#ffffff",a.font=t.font||"900 30px Inter, system-ui, sans-serif",a.textAlign="center",a.textBaseline="middle",a.fillText(e,s.width/2,66);const r=new n.CanvasTexture(s);r.colorSpace=n.SRGBColorSpace;const i=new n.SpriteMaterial({map:r,transparent:!0,depthWrite:!1}),o=new n.Sprite(i);return o.userData.texture=r,o},destroy(){this.rafId&&cancelAnimationFrame(this.rafId),this.rafId=null,this.resizeHandler&&window.removeEventListener("resize",this.resizeHandler),this.fullscreenHandler&&document.removeEventListener("fullscreenchange",this.fullscreenHandler),this.canvas&&this.onPointerMove&&this.canvas.removeEventListener("pointermove",this.onPointerMove),this.canvas&&this.onClick&&this.canvas.removeEventListener("click",this.onClick),this.canvas&&this.onDoubleClick&&this.canvas.removeEventListener("dblclick",this.onDoubleClick),this.controls&&this.controls.dispose(),this.scene&&this.scene.traverse(e=>{var t;e.geometry&&e.geometry.dispose(),(t=e.userData)!=null&&t.texture&&e.userData.texture.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(s=>s.dispose()):e.material.dispose())}),this.renderer&&this.renderer.dispose(),this.parent&&(this.parent.classList.remove("cf-expanded"),this.parent.querySelectorAll(".cf-overlay, .cf-tooltip, .cf-expand-btn").forEach(e=>e.remove()),this.parent.classList.remove("commercial-farm-host")),document.body.classList.remove("cf-expanded-lock"),this.canvas=null,this.parent=null,this.renderer=null,this.scene=null,this.camera=null,this.controls=null,this.farmGroup=null,this.particles=null,this.raycaster=null,this.pointer=null,this.interactiveRoots=[],this.hoverRoot=null,this.selectedRoot=null,this.detailPanel=null,this.tooltip=null,this.fullscreenButton=null,this.resizeHandler=null,this.fullscreenHandler=null,this.onPointerMove=null,this.onClick=null,this.onDoubleClick=null}};function G(){const e=I();return y.currentFarm||e.find(t=>t.id===y.currentFarmId)||e[e.length-1]||null}function I(){try{return JSON.parse(localStorage.getItem(z))||[]}catch{return[]}}function H(e){const t=String((e==null?void 0:e.rackTypeId)||(e==null?void 0:e.rackType)||(e==null?void 0:e.rackLabel)||"").toLowerCase();return t.includes("2")?b["2-tier"]:t.includes("4")?b["4-tier"]:t.includes("5")?b["5-tier"]:t.includes("wall")||t.includes("grid")?b.wall:t.includes("frame")?b["a-frame"]:t.includes("nft")||t.includes("channel")?b["nft-channel"]:t.includes("hanging")||t.includes("column")?b.hanging:b["3-tier"]}function F(e,t){const s=Array.isArray(e==null?void 0:e.plants)?e.plants:[],a=Array(t.total).fill(null),r=new Set;if(s.forEach(o=>{if(o.slotIndex!==void 0&&o.slotIndex!==null){const l=Number(o.slotIndex);Number.isInteger(l)&&l>=0&&l<t.total&&(a[l]=S(o,l,t,e),r.add(l));return}const d=Math.max(1,Number.parseInt(o.slots||o.count||1,10)||1);for(let l=0;l<d;l++){const c=$(a,r);if(c===-1)return;a[c]=S(o,c,t,e),r.add(c)}}),a.some(Boolean))return a;const i=Math.min(t.total,Number.parseInt((e==null?void 0:e.plantSlots)||(e==null?void 0:e.plants)||0,10)||0);for(let o=0;o<i;o++)a[o]=S({name:(e==null?void 0:e.targetPlant)||"Plant",status:"healthy"},o,t,e);return a}function S(e,t,s,a){const r=e.name||(a==null?void 0:a.targetPlant)||"Plant";return{name:r,emoji:e.emoji||K(r),species:e.species||L(r),status:e.status||N(e.growth),growth:Number(e.growth??70),days:Number(e.days??0),slotIndex:t,tier:Math.floor(t/s.slotsPerTier)+1,position:t%s.slotsPerTier+1}}function $(e,t){for(let s=0;s<e.length;s++)if(!e[s]&&!t.has(s))return s;return-1}function N(e){const t=Number(e??80);return t<35?"danger":t<60?"warning":"healthy"}function B(e){return e==="danger"?15680580:e==="warning"?16096779:e==="empty"?6583435:8702998}function A(e){return e.length?e.some(t=>t.status==="danger")?"danger":e.some(t=>t.status==="warning")?"warning":"healthy":"empty"}function C(e,t){return e.some(Boolean)&&e.some(s=>(s==null?void 0:s.status)==="danger")?"Critical plant risk":Number(t.gasRaw||0)>2500||Number(t.temperature||25)>35?"Automation alert":e.some(s=>(s==null?void 0:s.status)==="warning")?"Needs review":"Operational"}function P(){var t,s,a,r,i,o;const e=y.sensors||{};return{temperature:((t=e.temp)==null?void 0:t.val)??25,humidity:((s=e.humid)==null?void 0:s.val)??60,lightRaw:((a=e.light)==null?void 0:a.val)??2e3,ph:((r=e.ph)==null?void 0:r.val)??6.1,waterDistanceCm:((i=e.water)==null?void 0:i.val)??10,gasRaw:((o=e.nutrient)==null?void 0:o.val)??1e3}}function O(e){const t=Number(e.ph??6.1);return t<5.5||t>6.5}function W(e){const t=L((e==null?void 0:e.species)||(e==null?void 0:e.name)||"plant"),s=k[t];if(s)return s;const a=Object.keys(k).find(r=>t.includes(r));return k[a]||k.plant}function q(e,t,s,a){return Number.isNaN(e)?!1:e%a===s||Math.floor(e/Math.max(1,t.slotsPerTier))===s}function T(e,t,s){const a=new n.BufferGeometry().setFromPoints([new n.Vector3(...e),new n.Vector3(...t)]);return new n.Line(a,s)}function X(e,t,s,a,r,i){e.beginPath(),e.moveTo(t+i,s),e.lineTo(t+a-i,s),e.quadraticCurveTo(t+a,s,t+a,s+i),e.lineTo(t+a,s+r-i),e.quadraticCurveTo(t+a,s+r,t+a-i,s+r),e.lineTo(t+i,s+r),e.quadraticCurveTo(t,s+r,t,s+r-i),e.lineTo(t,s+i),e.quadraticCurveTo(t,s,t+i,s),e.closePath()}function D({title:e,subtitle:t,status:s,mode:a}){return`
        <div class="cf-panel-kicker">${g(a)}</div>
        <div class="cf-panel-title">${g(e)}</div>
        <div class="cf-panel-sub">${g(t)}</div>
        <div class="cf-mini-grid">
            ${x("Status",s)}
            ${x("Light",`${Math.round(Number(P().lightRaw||0))}`)}
            ${x("pH",`${Number(P().ph||0).toFixed(1)}`)}
        </div>
    `}function _(e,t,s){const a=t.filter(o=>o.status==="healthy").length,r=t.filter(o=>o.status==="warning").length,i=t.filter(o=>o.status==="danger").length;return`
        <div class="cf-panel-kicker">Selected production zone</div>
        <div class="cf-panel-title">${g(e.label||"Zone")}</div>
        <div class="cf-panel-sub">${t.length||0} active plants · ${g(e.status||"empty")}</div>
        <div class="cf-mini-grid">
            ${x("Healthy",a)}
            ${x("Warning",r)}
            ${x("Critical",i)}
            ${x("Temp",`${Number(s.temperature||0).toFixed(1)}C`)}
        </div>
        <div class="cf-plant-list">
            ${t.slice(0,5).map(o=>`<span>${g(o.name)} <b>${g(o.status)}</b></span>`).join("")||"<span>No assigned crop yet</span>"}
        </div>
    `}function V(e,t){return`
        <div class="cf-panel-kicker">Nutrient station</div>
        <div class="cf-panel-title">${g(e.label||"Tank")} Tank</div>
        <div class="cf-panel-sub">Linked to commercial automation controls</div>
        <div class="cf-mini-grid">
            ${x("pH",`${Number(t.ph||0).toFixed(1)}`)}
            ${x("Water",`${Number(t.waterDistanceCm||0)}cm`)}
            ${x("Status",g(e.status||"healthy"))}
        </div>
    `}function x(e,t){return`<div class="cf-mini-metric"><span>${g(e)}</span><strong>${g(t)}</strong></div>`}function K(e=""){const t=String(e).toLowerCase();return t.includes("lettuce")||t.includes("cabbage")||t.includes("kale")?"🥬":t.includes("tomato")?"🍅":t.includes("chili")||t.includes("pepper")?"🌶️":t.includes("strawberry")?"🍓":t.includes("cucumber")?"🥒":t.includes("carrot")?"🥕":t.includes("eggplant")?"🍆":t.includes("basil")||t.includes("mint")||t.includes("spinach")?"🌿":"🌱"}function L(e=""){return String(e||"plant").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function g(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function Y(){if(document.getElementById("commercial-farm-canvas-style"))return;const e=document.createElement("style");e.id="commercial-farm-canvas-style",e.textContent=`
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
            background: #07110c !important;
            border-radius: 22px !important;
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
        body.cf-expanded-lock {
            overflow: hidden !important;
        }
        .commercial-farm-host.cf-expanded {
            position: fixed !important;
            inset: 0 !important;
            z-index: 9999 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            border-radius: 0 !important;
            background: #07110c !important;
            border: none !important;
        }
        .commercial-farm-host.cf-expanded .commercial-farm-canvas {
            width: 100vw !important;
            height: 100vh !important;
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
        @media (max-width: 520px) {
            .cf-legend-help { display:none !important; }
            .cf-legend { left:14px; right:14px; justify-content:center; }
            .cf-tooltip { display:none; }
            .commercial-farm-canvas { height: 390px !important; }
        }
    `,document.head.appendChild(e)}export{U as CommercialFarmCanvas};
