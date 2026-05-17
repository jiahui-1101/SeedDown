import{A as y}from"./index-D5jvxCsW.js";import*as n from"https://esm.sh/three@0.160.0";import{OrbitControls as D}from"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const R="user_farms",w={"2-tier":{id:"2-tier",label:"2-Tier Starter Rack",tiers:2,slotsPerTier:3,total:6},"3-tier":{id:"3-tier",label:"3-Tier Vertical Rack",tiers:3,slotsPerTier:3,total:9},"4-tier":{id:"4-tier",label:"4-Tier Grow Shelf",tiers:4,slotsPerTier:4,total:16},"5-tier":{id:"5-tier",label:"5-Tier Tower Rack",tiers:5,slotsPerTier:4,total:20},wall:{id:"wall",label:"Wall Panel Grid",tiers:4,slotsPerTier:5,total:20},"a-frame":{id:"a-frame",label:"A-Frame Pyramid",tiers:4,slotsPerTier:4,total:16},"nft-channel":{id:"nft-channel",label:"NFT Channel Rows",tiers:3,slotsPerTier:6,total:18},hanging:{id:"hanging",label:"Hanging Column Farm",tiers:5,slotsPerTier:3,total:15}},P={lettuce:{color:6927180,alt:9228129,leaf:.082,spread:.095},cabbage:{color:7448635,alt:10733911,leaf:.09,spread:.1},kale:{color:3108670,alt:5213518,leaf:.088,spread:.105},spinach:{color:3046706,alt:4431943,leaf:.072,spread:.088},basil:{color:2067020,alt:3323495,leaf:.064,spread:.078},mint:{color:3450963,alt:7327605,leaf:.062,spread:.078},tomato:{color:3116870,alt:15680580,leaf:.07,spread:.086,fruit:15680580},chili:{color:2522941,alt:14427686,leaf:.066,spread:.082,fruit:14427686},pepper:{color:2522941,alt:14427686,leaf:.066,spread:.082,fruit:14427686},cucumber:{color:2325052,alt:5284955,leaf:.078,spread:.105,vine:!0},strawberry:{color:4165449,alt:16478597,leaf:.066,spread:.082,fruit:16478597},eggplant:{color:3112783,alt:8141549,leaf:.072,spread:.088,fruit:8141549},plant:{color:6660877,alt:8843180,leaf:.072,spread:.09}},J={canvas:null,parent:null,renderer:null,scene:null,camera:null,controls:null,farmGroup:null,particles:null,raycaster:null,pointer:null,interactiveRoots:[],hoverRoot:null,selectedRoot:null,detailPanel:null,tooltip:null,fullscreenButton:null,zoomControls:null,originalParent:null,originalNextSibling:null,resizeHandler:null,fullscreenHandler:null,rafId:null,clock:null,frame:0,farm:null,rack:w["3-tier"],slotPlants:[],sensorSnapshot:{},init(e){this.destroy(),this.installHandlers(),Z(),this.canvas=document.getElementById(e),this.canvas&&(this.parent=this.canvas.parentElement,this.parent&&(this.farm=F(),this.rack=I(this.farm),this.slotPlants=H(this.farm,this.rack),this.sensorSnapshot=S(),this.clock=new n.Clock,this.prepareHost(),this.initScene(),this.buildFacility(),this.createOverlays(),this.bindEvents(),this.resize(),this.animate()))},prepareHost(){this.parent.classList.add("commercial-farm-host"),this.canvas.classList.add("commercial-farm-canvas"),this.parent.querySelectorAll(".cf-overlay, .cf-tooltip, .cf-expand-btn, .cf-zoom-controls").forEach(e=>e.remove())},initScene(){this.scene=new n.Scene,this.scene.background=new n.Color(463116),this.scene.fog=new n.Fog(463116,14,42),this.camera=new n.PerspectiveCamera(58,1,.1,120),this.camera.position.set(5.5,4.6,8.5),this.camera.lookAt(0,1.8,0),this.renderer=new n.WebGLRenderer({canvas:this.canvas,antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=n.PCFSoftShadowMap,this.renderer.outputColorSpace=n.SRGBColorSpace,this.renderer.toneMapping=n.ACESFilmicToneMapping,this.renderer.toneMappingExposure=1.08,this.controls=new D(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.07,this.controls.enablePan=!0,this.controls.enableZoom=!1,this.controls.maxPolarAngle=Math.PI*.48,this.controls.target.set(0,1.55,0),this.setCameraFrame(!1),this.raycaster=new n.Raycaster,this.pointer=new n.Vector2,this.farmGroup=new n.Group,this.scene.add(this.farmGroup),this.addLighting()},addLighting(){this.scene.add(new n.AmbientLight(14479072,.55));const e=new n.DirectionalLight(16775399,2.2);e.position.set(10,18,9),e.castShadow=!0,e.shadow.mapSize.set(2048,2048),e.shadow.camera.left=-12,e.shadow.camera.right=12,e.shadow.camera.top=12,e.shadow.camera.bottom=-12,e.shadow.bias=-4e-4,this.scene.add(e);const t=new n.DirectionalLight(12244991,.35);t.position.set(-7,10,-6),this.scene.add(t);const s=new n.HemisphereLight(11657727,4928541,.28);this.scene.add(s);const a=new n.PointLight(8702998,1.25,12);a.position.set(0,3.1,0),this.scene.add(a)},buildFacility(){this.addFloor(),this.addGreenhouseFrame(),this.addOverheadGrowLights();const e=this.createTowerLayout();e.forEach((t,s)=>this.addTower(t,s)),this.addIrrigationPipes(e),this.addNutrientStation(),this.addControlPanel(),this.addVentilationFans(),this.addWaterDrips(e),this.addParticles()},addFloor(){const e=new n.Mesh(new n.PlaneGeometry(80,60),new n.MeshStandardMaterial({color:3422774,roughness:.86,metalness:.04}));e.rotation.x=-Math.PI/2,e.receiveShadow=!0,this.scene.add(e);const t=new n.Mesh(new n.PlaneGeometry(5.2,56),new n.MeshStandardMaterial({color:4541253,roughness:.78}));t.rotation.x=-Math.PI/2,t.position.y=.006,t.receiveShadow=!0,this.scene.add(t);const s=new n.LineBasicMaterial({color:6321254,transparent:!0,opacity:.32});for(let a=-38;a<=38;a+=2)this.scene.add(z([a,.014,-28],[a,.014,28],s));for(let a=-28;a<=28;a+=2)this.scene.add(z([-38,.016,a],[38,.016,a],s))},addGreenhouseFrame(){const e=new n.MeshStandardMaterial({color:5989472,metalness:.72,roughness:.26}),t=new n.MeshPhysicalMaterial({color:14024674,transparent:!0,opacity:.1,roughness:.04,side:n.DoubleSide}),s=17.6,a=13.6,i=4.3,r=6.2;for(let l=-a/2;l<=a/2+.001;l+=2.7){[-1,1].forEach(u=>{const h=new n.Mesh(new n.CylinderGeometry(.035,.035,i,10),e);h.position.set(u*s/2,i/2,l),h.castShadow=!0,this.scene.add(h)});const c=Math.sqrt((s/2)**2+(r-i)**2),p=Math.atan2(r-i,s/2);[-1,1].forEach(u=>{const h=new n.Mesh(new n.CylinderGeometry(.028,.028,c,8),e);h.position.set(u*s/4,i+(r-i)/2,l),h.rotation.z=u*(Math.PI/2-p),this.scene.add(h)})}const o=new n.Mesh(new n.CylinderGeometry(.032,.032,a,10),e);o.rotation.x=Math.PI/2,o.position.set(0,r,0),this.scene.add(o);const d=new n.Mesh(new n.PlaneGeometry(s,i),t);d.position.set(0,i/2,-a/2),this.scene.add(d),[-1,1].forEach(l=>{const c=new n.Mesh(new n.PlaneGeometry(a,i),t);c.rotation.y=Math.PI/2,c.position.set(l*s/2,i/2,0),this.scene.add(c)})},addOverheadGrowLights(){const e=new n.MeshStandardMaterial({color:2042167,roughness:.5,metalness:.72}),t=new n.MeshStandardMaterial({color:14518527,emissive:14518527,emissiveIntensity:.85,roughness:.2});[-4.8,-2.4,2.4,4.8].forEach(s=>{for(let a=-4.8;a<=4.8;a+=2.4){const i=new n.Mesh(new n.BoxGeometry(1.4,.06,.16),e);i.position.set(s,4.15,a),this.scene.add(i);const r=new n.Mesh(new n.BoxGeometry(1.16,.025,.09),t);r.position.set(s,4.11,a),this.scene.add(r)}})},createTowerLayout(){const e=Math.max(6,Math.min(10,Math.ceil(this.rack.total/2))),t=[],s=Math.ceil(e/2),a=-((s-1)*2.15)/2,i=[-2.35,2.35];for(let r=0;r<2;r++)for(let o=0;o<s&&!(t.length>=e);o++)t.push({x:a+o*2.15,z:i[r],zoneIndex:t.length,row:r,col:o});return t},addTower(e,t){const s=String.fromCharCode(65+t),a=new n.Group;a.position.set(e.x,0,e.z),a.userData={isTower:!0,id:`zone-${s}`,label:`Zone ${s}`,zoneIndex:t,plants:[],status:"empty"};const i=new n.MeshStandardMaterial({color:15330800,roughness:.34,metalness:.18}),r=new n.MeshStandardMaterial({color:2503725,roughness:.5,metalness:.4}),o=new n.Mesh(new n.CylinderGeometry(.095,.12,3.2,22),i);o.position.y=1.67,o.castShadow=!0,a.add(o);const d=new n.Mesh(new n.CylinderGeometry(.48,.6,.15,28),r);d.position.y=.075,d.castShadow=!0,a.add(d);const l=this.slotPlants.map((m,f)=>({plant:m,index:f})).filter(m=>m.plant&&q(m.index,this.rack,t,this.createTowerLayout().length)),c=8,p=4;let u=0;for(let m=0;m<c;m++){const f=.38+m*.36,v=new n.Mesh(new n.TorusGeometry(.42,.012,8,48),new n.MeshStandardMaterial({color:5398874,roughness:.48,metalness:.35}));v.rotation.x=Math.PI/2,v.position.y=f,a.add(v);for(let M=0;M<p;M++){const E=M*Math.PI/2+(m%2?Math.PI/4:0),x=l[u]||null;this.addPod(a,E,f,(x==null?void 0:x.plant)||null,(x==null?void 0:x.index)??t*100+u,m,M),x!=null&&x.plant&&(a.userData.plants.push(x.plant),u+=1)}}a.userData.status=B(a.userData.plants);const h=this.createTextSprite(`ZONE ${s}`,{bg:"rgba(9,18,13,.88)",fg:"#a3e635",border:"#315d3e",font:"900 30px Inter, system-ui, sans-serif"});h.position.set(0,3.63,0),h.scale.set(.68,.18,1),a.add(h),this.farmGroup.add(a),this.interactiveRoots.push(a)},addPod(e,t,s,a,i,r,o){const l=Math.cos(t)*.48,c=Math.sin(t)*.48,p=(a==null?void 0:a.status)||"empty",u=A(p),h={index:i,tier:e.userData.zoneIndex+1,slot:r*4+o+1,plant:a,tower:e},m=new n.MeshStandardMaterial({color:a?16317180:2437676,roughness:.52,metalness:a?.08:.18}),f=new n.Mesh(new n.CylinderGeometry(.155,.12,.11,20),m);f.position.set(l,s,c),f.rotation.z=Math.PI/2,f.rotation.y=-t,f.castShadow=!0,f.userData.slot=h,f.userData.root=e,e.add(f);const v=new n.Mesh(new n.SphereGeometry(.045,12,8),new n.MeshStandardMaterial({color:u,emissive:u,emissiveIntensity:a?.38:.06}));v.position.set(l*1.1,s+.085,c*1.1),v.userData.slot=h,v.userData.root=e,e.add(v),a&&this.addPlantCluster(e,l*1.1,s+.12,c*1.1,a)},addPlantCluster(e,t,s,a,i){const r=O(i),o=new n.MeshStandardMaterial({color:3100976,roughness:.7}),d=new n.MeshStandardMaterial({color:r.color,roughness:.72,side:n.DoubleSide}),l=new n.MeshStandardMaterial({color:r.alt,roughness:.72,side:n.DoubleSide}),c=new n.Mesh(new n.CylinderGeometry(.008,.01,.15,6),o);c.position.set(t,s+.055,a),e.add(c);for(let p=0;p<7;p++){const u=Math.PI*2/7*p,h=r.spread+Math.random()*.025,m=new n.Mesh(new n.SphereGeometry(r.leaf,8,5),p%2?d:l);m.scale.set(1.4,.36,.82),m.position.set(t+Math.cos(u)*h,s+.12+p%3*.012,a+Math.sin(u)*h),m.rotation.set(-.45+Math.random()*.18,u,.18),m.castShadow=!0,e.add(m)}if(r.fruit)for(let p=0;p<2;p++){const u=Math.PI*p+.55,h=new n.Mesh(new n.SphereGeometry(.032,10,8),new n.MeshStandardMaterial({color:r.fruit,roughness:.55}));h.position.set(t+Math.cos(u)*.07,s+.105,a+Math.sin(u)*.07),e.add(h)}if(r.vine){const p=new n.Mesh(new n.CylinderGeometry(.006,.004,.34,5),new n.MeshStandardMaterial({color:r.color,roughness:.72}));p.position.set(t+.06,s-.02,a+.05),p.rotation.z=.25,e.add(p)}},addIrrigationPipes(e){const t=new n.MeshStandardMaterial({color:5605546,roughness:.28,metalness:.6}),s=new n.MeshStandardMaterial({color:9358054,roughness:.25,metalness:.55});[...new Set(e.map(i=>i.z))].forEach(i=>{const r=e.filter(c=>c.z===i),o=Math.min(...r.map(c=>c.x))-.8,d=Math.max(...r.map(c=>c.x))+.8,l=new n.Mesh(new n.CylinderGeometry(.035,.035,d-o,10),t);l.rotation.z=Math.PI/2,l.position.set((o+d)/2,3.35,i+.25),this.scene.add(l)}),e.forEach(i=>{const r=new n.Mesh(new n.CylinderGeometry(.02,.02,2.75,8),t);r.position.set(i.x+.28,1.9,i.z+.25),this.scene.add(r);const o=new n.Mesh(new n.SphereGeometry(.055,10,8),s);o.position.set(i.x+.28,3.28,i.z+.25),this.scene.add(o)})},addNutrientStation(){const e=new n.MeshStandardMaterial({color:2780750,roughness:.35,metalness:.15}),t=new n.MeshStandardMaterial({color:2054718,roughness:.4,metalness:.2});["N","P","K","pH"].forEach((a,i)=>{const r=-3+i*2,o=new n.Group;o.userData={isTank:!0,label:a,status:i===3&&W(this.sensorSnapshot)?"warning":"healthy"};const d=new n.Mesh(new n.CylinderGeometry(.42,.42,1.05,18),e);d.position.set(r,.58,-5.75),d.castShadow=!0,o.add(d);const l=new n.Mesh(new n.CylinderGeometry(.45,.42,.07,18),t);l.position.set(r,1.14,-5.75),o.add(l);const c=this.createTextSprite(a,{bg:"rgba(255,255,255,.92)",fg:"#0f172a",font:"900 34px Inter, system-ui, sans-serif"});c.position.set(r,.58,-5.28),c.scale.set(.22,.1,1),o.add(c),this.scene.add(o),this.interactiveRoots.push(o)})},addControlPanel(){const e=new n.MeshStandardMaterial({color:5593943,roughness:.5,metalness:.3}),t=new n.Mesh(new n.BoxGeometry(1.7,.08,.65),e);t.position.set(0,.86,5.75),t.castShadow=!0,this.scene.add(t);const s=new n.MeshStandardMaterial({color:464909,emissive:2062914,emissiveIntensity:.75,roughness:.12,metalness:.42}),a=new n.Mesh(new n.BoxGeometry(.95,.56,.04),s);a.position.set(0,1.38,5.45),a.castShadow=!0,this.scene.add(a);const i=this.createTextSprite("CONTROL",{bg:"rgba(9,18,13,.86)",fg:"#a3e635",font:"900 26px Inter, system-ui, sans-serif"});i.position.set(0,1.82,5.4),i.scale.set(.42,.13,1),this.scene.add(i)},addVentilationFans(){const e=new n.MeshStandardMaterial({color:2042167,roughness:.36,metalness:.55});[-7.3,7.3].forEach(t=>{const s=new n.Group;s.position.set(t,2.8,-5.9),s.userData.isFan=!0;const a=new n.Mesh(new n.TorusGeometry(.34,.025,8,32),e);s.add(a);for(let i=0;i<4;i++){const r=new n.Mesh(new n.BoxGeometry(.48,.045,.018),e);r.rotation.z=i*Math.PI/4,r.userData.isFanBlade=!0,s.add(r)}this.scene.add(s)})},addWaterDrips(e){const t=new n.MeshStandardMaterial({color:3718648,emissive:3718648,emissiveIntensity:.5,transparent:!0,opacity:.85});e.forEach((s,a)=>{if(a%2)return;const i=new n.Mesh(new n.SphereGeometry(.025,8,6),t.clone());i.position.set(s.x+.25,2.9,s.z+.28),i.userData.isDrip=!0,i.userData.baseY=i.position.y,this.scene.add(i)})},addParticles(){const t=new Float32Array(1080),s=new Float32Array(360*3);for(let r=0;r<360;r++)t[r*3]=(Math.random()-.5)*15,t[r*3+1]=Math.random()*4.4+.7,t[r*3+2]=(Math.random()-.5)*11,s[r*3]=(Math.random()-.5)*.002,s[r*3+1]=(Math.random()-.5)*.001,s[r*3+2]=(Math.random()-.5)*.002;const a=new n.BufferGeometry;a.setAttribute("position",new n.BufferAttribute(t,3));const i=new n.PointsMaterial({color:16777215,size:.028,transparent:!0,opacity:.28,depthWrite:!1,blending:n.AdditiveBlending});this.particles=new n.Points(a,i),this.particles.userData.velocities=s,this.scene.add(this.particles)},createOverlays(){var s;const e=this.slotPlants.filter(Boolean).length;this.detailPanel=document.createElement("div"),this.detailPanel.className="cf-overlay cf-info-panel",this.detailPanel.innerHTML=T({title:((s=this.farm)==null?void 0:s.name)||y.farmName||"Commercial Farm",subtitle:`${this.rack.label} · ${e}/${this.rack.total} planted`,status:C(this.slotPlants,this.sensorSnapshot),mode:"Facility overview"}),this.parent.appendChild(this.detailPanel),this.tooltip=document.createElement("div"),this.tooltip.className="cf-tooltip",this.tooltip.innerHTML='<span class="cf-tooltip-dot"></span><div><strong>Hover a tower</strong><small>Click to inspect rack details</small></div>',this.parent.appendChild(this.tooltip);const t=document.createElement("div");t.className="cf-overlay cf-legend",t.innerHTML=`
            <span><i class="ok"></i>Healthy</span>
            <span><i class="warn"></i>Warning</span>
            <span><i class="danger"></i>Critical</span>
            <span class="cf-legend-help">Drag rotate · Wheel / +/- zoom · Double click fullscreen</span>
        `,this.parent.appendChild(t),this.fullscreenButton=document.createElement("button"),this.fullscreenButton.type="button",this.fullscreenButton.className="cf-expand-btn",this.fullscreenButton.textContent="EXPAND",this.fullscreenButton.addEventListener("click",a=>{a.stopPropagation(),this.toggleFullscreen()}),this.parent.appendChild(this.fullscreenButton),this.zoomControls=document.createElement("div"),this.zoomControls.className="cf-zoom-controls",this.zoomControls.innerHTML=`
            <button type="button" data-zoom="in" aria-label="Zoom in">+</button>
            <button type="button" data-zoom="out" aria-label="Zoom out">-</button>
            <button type="button" data-zoom="reset" aria-label="Reset view">RESET</button>
        `,this.zoomControls.addEventListener("click",a=>{const i=a.target.closest("button[data-zoom]");i&&(a.preventDefault(),a.stopPropagation(),i.dataset.zoom==="in"&&this.zoomCamera(.82),i.dataset.zoom==="out"&&this.zoomCamera(1.22),i.dataset.zoom==="reset"&&this.resetCamera())}),this.parent.appendChild(this.zoomControls)},bindEvents(){this.resizeHandler=()=>this.resize(),window.addEventListener("resize",this.resizeHandler),this.fullscreenHandler=()=>{this.syncExpandButton(),setTimeout(()=>this.resize(),80)},document.addEventListener("fullscreenchange",this.fullscreenHandler),this.canvas.addEventListener("pointermove",this.onPointerMove),this.canvas.addEventListener("click",this.onClick),this.canvas.addEventListener("dblclick",this.onDoubleClick),this.canvas.addEventListener("wheel",this.onWheel,{passive:!1})},onPointerMove:null,onClick:null,onDoubleClick:null,onWheel:null,installHandlers(){this.onPointerMove=e=>this.handlePointerMove(e),this.onClick=e=>this.handleClick(e),this.onDoubleClick=()=>this.toggleFullscreen(),this.onWheel=e=>this.handleWheel(e)},handlePointerMove(e){const t=this.pickRoot(e);t!==this.hoverRoot&&(this.hoverRoot&&this.hoverRoot!==this.selectedRoot&&this.setHighlight(this.hoverRoot,!1),this.hoverRoot=t,this.hoverRoot&&this.hoverRoot!==this.selectedRoot&&this.setHighlight(this.hoverRoot,!0)),this.canvas.style.cursor=t?"pointer":"grab",this.updateTooltip(t)},handleClick(e){const t=this.pickRoot(e);if(!t){this.selectedRoot&&this.setHighlight(this.selectedRoot,!1),this.selectedRoot=null,this.showOverview();return}this.selectedRoot&&this.selectedRoot!==t&&this.setHighlight(this.selectedRoot,!1),this.selectedRoot=t,this.setHighlight(t,!0,!0),this.showRootDetail(t)},handleWheel(e){!this.camera||!this.controls||(e.preventDefault(),e.stopPropagation(),this.zoomCamera(e.deltaY>0?1.12:.88))},zoomCamera(e){var d,l;if(!this.camera||!this.controls)return;const t=this.controls.target,s=this.camera.position.clone().sub(t),a=s.length()||1,i=(d=this.parent)!=null&&d.classList.contains("cf-expanded")?2.4:2.8,r=(l=this.parent)!=null&&l.classList.contains("cf-expanded")?24:18,o=n.MathUtils.clamp(a*e,i,r);s.setLength(o),this.camera.position.copy(t).add(s),this.controls.update()},resetCamera(){var e;this.setCameraFrame((e=this.parent)==null?void 0:e.classList.contains("cf-expanded"))},setCameraFrame(e=!1){!this.camera||!this.controls||(e?(this.camera.fov=38,this.camera.position.set(.35,18.5,.35),this.controls.target.set(0,0,0),this.controls.minPolarAngle=Math.PI*.015,this.controls.maxPolarAngle=Math.PI*.18):(this.camera.fov=58,this.camera.position.set(5.5,4.6,8.5),this.controls.target.set(0,1.55,0),this.controls.minPolarAngle=0,this.controls.maxPolarAngle=Math.PI*.48),this.camera.updateProjectionMatrix(),this.controls.update())},pickRoot(e){var r,o;const t=this.canvas.getBoundingClientRect();this.pointer.x=(e.clientX-t.left)/t.width*2-1,this.pointer.y=-((e.clientY-t.top)/t.height)*2+1,this.raycaster.setFromCamera(this.pointer,this.camera);const s=[];this.interactiveRoots.forEach(d=>d.traverse(l=>{l.isMesh&&s.push(l)}));const a=(r=this.raycaster.intersectObjects(s,!1)[0])==null?void 0:r.object;if(!a)return null;let i=a;for(;i;){if(this.interactiveRoots.includes(i))return i;if((o=i.userData)!=null&&o.root&&this.interactiveRoots.includes(i.userData.root))return i.userData.root;i=i.parent}return null},setHighlight(e,t,s=!1){const a=s?new n.Color(3718648):new n.Color(10741301),i=s?.65:.32;e.traverse(r=>{var o;!r.isMesh||!((o=r.material)!=null&&o.emissive)||(r.userData.originalEmissive||(r.userData.originalEmissive=r.material.emissive.clone(),r.userData.originalIntensity=r.material.emissiveIntensity||0),t?(r.material.emissive.copy(a),r.material.emissiveIntensity=i):(r.material.emissive.copy(r.userData.originalEmissive),r.material.emissiveIntensity=r.userData.originalIntensity))})},updateTooltip(e){if(!this.tooltip)return;if(!e){this.tooltip.innerHTML='<span class="cf-tooltip-dot"></span><div><strong>Hover a tower</strong><small>Click to inspect rack details</small></div>';return}const t=e.userData||{},s=Array.isArray(t.plants)?t.plants.length:0;this.tooltip.innerHTML=`
            <span class="cf-tooltip-dot ${t.status||"healthy"}"></span>
            <div><strong>${g(t.label||t.label||"Station")}</strong><small>${s?`${s} active plants`:t.isTank?"Nutrient station":"Empty zone"}</small></div>
        `},showOverview(){var t;const e=this.slotPlants.filter(Boolean).length;this.detailPanel.innerHTML=T({title:((t=this.farm)==null?void 0:t.name)||y.farmName||"Commercial Farm",subtitle:`${this.rack.label} · ${e}/${this.rack.total} planted`,status:C(this.slotPlants,this.sensorSnapshot),mode:"Facility overview"})},showRootDetail(e){const t=e.userData||{};if(t.isTank){this.detailPanel.innerHTML=_(t,this.sensorSnapshot);return}const s=Array.isArray(t.plants)?t.plants:[];this.detailPanel.innerHTML=X(t,s,this.sensorSnapshot)},async toggleFullscreen(){if(!this.parent)return;!this.parent.classList.contains("cf-expanded")?this.enterExpandedView():this.exitExpandedView()},enterExpandedView(){!this.parent||this.parent.classList.contains("cf-expanded")||(this.originalParent=this.parent.parentNode,this.originalNextSibling=this.parent.nextSibling,document.body.appendChild(this.parent),this.parent.classList.add("cf-expanded"),document.documentElement.classList.add("cf-expanded-lock"),document.body.classList.add("cf-expanded-lock"),this.syncExpandButton(),this.setCameraFrame(!0),requestAnimationFrame(()=>this.resize()),setTimeout(()=>this.resize(),120))},exitExpandedView(){this.parent&&(this.parent.classList.remove("cf-expanded"),document.documentElement.classList.remove("cf-expanded-lock"),document.body.classList.remove("cf-expanded-lock"),this.restoreHostPlacement(),this.syncExpandButton(),this.setCameraFrame(!1),requestAnimationFrame(()=>this.resize()),setTimeout(()=>this.resize(),120))},restoreHostPlacement(){!this.parent||!this.originalParent||(this.originalNextSibling&&this.originalNextSibling.parentNode===this.originalParent?this.originalParent.insertBefore(this.parent,this.originalNextSibling):this.originalParent.appendChild(this.parent),this.originalParent=null,this.originalNextSibling=null)},syncExpandButton(){!this.fullscreenButton||!this.parent||(this.fullscreenButton.textContent=this.parent.classList.contains("cf-expanded")?"CLOSE":"EXPAND")},resize(){var i;if(!this.canvas||!this.renderer||!this.camera)return;const e=(i=this.parent)==null?void 0:i.classList.contains("cf-expanded"),t=this.canvas.getBoundingClientRect(),s=e?window.innerWidth:Math.max(320,t.width||this.parent.clientWidth||640),a=e?window.innerHeight:Math.max(300,t.height||420);this.renderer.setSize(s,a,!1),this.camera.aspect=s/a,this.camera.updateProjectionMatrix()},animate(){var t,s;const e=Math.min(.04,((s=(t=this.clock)==null?void 0:t.getDelta)==null?void 0:s.call(t))||.016);this.frame+=1,this.controls&&this.controls.update(),this.updateParticles(),this.scene.traverse(a=>{var i,r;(i=a.userData)!=null&&i.isFanBlade&&(a.rotation.z+=4.8*e),(r=a.userData)!=null&&r.isDrip&&(a.position.y-=.55*e,a.position.y<.7&&(a.position.y=a.userData.baseY))}),this.renderer&&this.scene&&this.camera&&this.renderer.render(this.scene,this.camera),this.rafId=requestAnimationFrame(()=>this.animate())},updateParticles(){if(!this.particles)return;const e=this.particles.geometry.attributes.position,t=this.particles.userData.velocities;for(let s=0;s<e.count;s++)e.array[s*3]+=t[s*3],e.array[s*3+1]+=t[s*3+1],e.array[s*3+2]+=t[s*3+2],e.array[s*3]>7.5&&(e.array[s*3]=-7.5),e.array[s*3]<-7.5&&(e.array[s*3]=7.5),e.array[s*3+1]>5.4&&(e.array[s*3+1]=.7),e.array[s*3+2]>5.5&&(e.array[s*3+2]=-5.5),e.array[s*3+2]<-5.5&&(e.array[s*3+2]=5.5);e.needsUpdate=!0},createTextSprite(e,t={}){const s=document.createElement("canvas");s.width=512,s.height=128;const a=s.getContext("2d");a.clearRect(0,0,s.width,s.height),V(a,18,22,s.width-36,84,28),a.fillStyle=t.bg||"rgba(12,20,14,.9)",a.fill(),t.border&&(a.strokeStyle=t.border,a.lineWidth=4,a.stroke()),a.fillStyle=t.fg||"#ffffff",a.font=t.font||"900 30px Inter, system-ui, sans-serif",a.textAlign="center",a.textBaseline="middle",a.fillText(e,s.width/2,66);const i=new n.CanvasTexture(s);i.colorSpace=n.SRGBColorSpace;const r=new n.SpriteMaterial({map:i,transparent:!0,depthWrite:!1}),o=new n.Sprite(r);return o.userData.texture=i,o},destroy(){var e;this.rafId&&cancelAnimationFrame(this.rafId),this.rafId=null,this.resizeHandler&&window.removeEventListener("resize",this.resizeHandler),this.fullscreenHandler&&document.removeEventListener("fullscreenchange",this.fullscreenHandler),this.canvas&&this.onPointerMove&&this.canvas.removeEventListener("pointermove",this.onPointerMove),this.canvas&&this.onClick&&this.canvas.removeEventListener("click",this.onClick),this.canvas&&this.onDoubleClick&&this.canvas.removeEventListener("dblclick",this.onDoubleClick),this.canvas&&this.onWheel&&this.canvas.removeEventListener("wheel",this.onWheel),this.controls&&this.controls.dispose(),this.scene&&this.scene.traverse(t=>{var s;t.geometry&&t.geometry.dispose(),(s=t.userData)!=null&&s.texture&&t.userData.texture.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(a=>a.dispose()):t.material.dispose())}),this.renderer&&this.renderer.dispose(),(e=this.parent)!=null&&e.classList.contains("cf-expanded")&&this.exitExpandedView(),this.parent&&(this.parent.classList.remove("cf-expanded"),this.parent.querySelectorAll(".cf-overlay, .cf-tooltip, .cf-expand-btn, .cf-zoom-controls").forEach(t=>t.remove()),this.parent.classList.remove("commercial-farm-host")),document.documentElement.classList.remove("cf-expanded-lock"),document.body.classList.remove("cf-expanded-lock"),this.canvas=null,this.parent=null,this.renderer=null,this.scene=null,this.camera=null,this.controls=null,this.farmGroup=null,this.particles=null,this.raycaster=null,this.pointer=null,this.interactiveRoots=[],this.hoverRoot=null,this.selectedRoot=null,this.detailPanel=null,this.tooltip=null,this.fullscreenButton=null,this.zoomControls=null,this.originalParent=null,this.originalNextSibling=null,this.resizeHandler=null,this.fullscreenHandler=null,this.onPointerMove=null,this.onClick=null,this.onDoubleClick=null,this.onWheel=null}};function F(){const e=G();return y.currentFarm||e.find(t=>t.id===y.currentFarmId)||e[e.length-1]||null}function G(){try{return JSON.parse(localStorage.getItem(R))||[]}catch{return[]}}function I(e){const t=String((e==null?void 0:e.rackTypeId)||(e==null?void 0:e.rackType)||(e==null?void 0:e.rackLabel)||"").toLowerCase();return t.includes("2")?w["2-tier"]:t.includes("4")?w["4-tier"]:t.includes("5")?w["5-tier"]:t.includes("wall")||t.includes("grid")?w.wall:t.includes("frame")?w["a-frame"]:t.includes("nft")||t.includes("channel")?w["nft-channel"]:t.includes("hanging")||t.includes("column")?w.hanging:w["3-tier"]}function H(e,t){const s=Array.isArray(e==null?void 0:e.plants)?e.plants:[],a=Array(t.total).fill(null),i=new Set;if(s.forEach(o=>{if(o.slotIndex!==void 0&&o.slotIndex!==null){const l=Number(o.slotIndex);Number.isInteger(l)&&l>=0&&l<t.total&&(a[l]=k(o,l,t,e),i.add(l));return}const d=Math.max(1,Number.parseInt(o.slots||o.count||1,10)||1);for(let l=0;l<d;l++){const c=N(a,i);if(c===-1)return;a[c]=k(o,c,t,e),i.add(c)}}),a.some(Boolean))return a;const r=Math.min(t.total,Number.parseInt((e==null?void 0:e.plantSlots)||(e==null?void 0:e.plants)||0,10)||0);for(let o=0;o<r;o++)a[o]=k({name:(e==null?void 0:e.targetPlant)||"Plant",status:"healthy"},o,t,e);return a}function k(e,t,s,a){const i=e.name||(a==null?void 0:a.targetPlant)||"Plant";return{name:i,emoji:e.emoji||Y(i),species:e.species||L(i),status:e.status||$(e.growth),growth:Number(e.growth??70),days:Number(e.days??0),slotIndex:t,tier:Math.floor(t/s.slotsPerTier)+1,position:t%s.slotsPerTier+1}}function N(e,t){for(let s=0;s<e.length;s++)if(!e[s]&&!t.has(s))return s;return-1}function $(e){const t=Number(e??80);return t<35?"danger":t<60?"warning":"healthy"}function A(e){return e==="danger"?15680580:e==="warning"?16096779:e==="empty"?6583435:8702998}function B(e){return e.length?e.some(t=>t.status==="danger")?"danger":e.some(t=>t.status==="warning")?"warning":"healthy":"empty"}function C(e,t){return e.some(Boolean)&&e.some(s=>(s==null?void 0:s.status)==="danger")?"Critical plant risk":Number(t.gasRaw||0)>2500||Number(t.temperature||25)>35?"Automation alert":e.some(s=>(s==null?void 0:s.status)==="warning")?"Needs review":"Operational"}function S(){var t,s,a,i,r,o;const e=y.sensors||{};return{temperature:((t=e.temp)==null?void 0:t.val)??25,humidity:((s=e.humid)==null?void 0:s.val)??60,lightRaw:((a=e.light)==null?void 0:a.val)??2e3,ph:((i=e.ph)==null?void 0:i.val)??6.1,waterDistanceCm:((r=e.water)==null?void 0:r.val)??10,gasRaw:((o=e.nutrient)==null?void 0:o.val)??1e3}}function W(e){const t=Number(e.ph??6.1);return t<5.5||t>6.5}function O(e){const t=L((e==null?void 0:e.species)||(e==null?void 0:e.name)||"plant"),s=P[t];if(s)return s;const a=Object.keys(P).find(i=>t.includes(i));return P[a]||P.plant}function q(e,t,s,a){return Number.isNaN(e)?!1:e%a===s||Math.floor(e/Math.max(1,t.slotsPerTier))===s}function z(e,t,s){const a=new n.BufferGeometry().setFromPoints([new n.Vector3(...e),new n.Vector3(...t)]);return new n.Line(a,s)}function V(e,t,s,a,i,r){e.beginPath(),e.moveTo(t+r,s),e.lineTo(t+a-r,s),e.quadraticCurveTo(t+a,s,t+a,s+r),e.lineTo(t+a,s+i-r),e.quadraticCurveTo(t+a,s+i,t+a-r,s+i),e.lineTo(t+r,s+i),e.quadraticCurveTo(t,s+i,t,s+i-r),e.lineTo(t,s+r),e.quadraticCurveTo(t,s,t+r,s),e.closePath()}function T({title:e,subtitle:t,status:s,mode:a}){return`
        <div class="cf-panel-kicker">${g(a)}</div>
        <div class="cf-panel-title">${g(e)}</div>
        <div class="cf-panel-sub">${g(t)}</div>
        <div class="cf-mini-grid">
            ${b("Status",s)}
            ${b("Light",`${Math.round(Number(S().lightRaw||0))}`)}
            ${b("pH",`${Number(S().ph||0).toFixed(1)}`)}
        </div>
    `}function X(e,t,s){const a=t.filter(o=>o.status==="healthy").length,i=t.filter(o=>o.status==="warning").length,r=t.filter(o=>o.status==="danger").length;return`
        <div class="cf-panel-kicker">Selected production zone</div>
        <div class="cf-panel-title">${g(e.label||"Zone")}</div>
        <div class="cf-panel-sub">${t.length||0} active plants · ${g(e.status||"empty")}</div>
        <div class="cf-mini-grid">
            ${b("Healthy",a)}
            ${b("Warning",i)}
            ${b("Critical",r)}
            ${b("Temp",`${Number(s.temperature||0).toFixed(1)}C`)}
        </div>
        <div class="cf-plant-list">
            ${t.slice(0,5).map(o=>`<span>${g(o.name)} <b>${g(o.status)}</b></span>`).join("")||"<span>No assigned crop yet</span>"}
        </div>
    `}function _(e,t){return`
        <div class="cf-panel-kicker">Nutrient station</div>
        <div class="cf-panel-title">${g(e.label||"Tank")} Tank</div>
        <div class="cf-panel-sub">Linked to commercial automation controls</div>
        <div class="cf-mini-grid">
            ${b("pH",`${Number(t.ph||0).toFixed(1)}`)}
            ${b("Water",`${Number(t.waterDistanceCm||0)}cm`)}
            ${b("Status",g(e.status||"healthy"))}
        </div>
    `}function b(e,t){return`<div class="cf-mini-metric"><span>${g(e)}</span><strong>${g(t)}</strong></div>`}function Y(e=""){const t=String(e).toLowerCase();return t.includes("lettuce")||t.includes("cabbage")||t.includes("kale")?"🥬":t.includes("tomato")?"🍅":t.includes("chili")||t.includes("pepper")?"🌶️":t.includes("strawberry")?"🍓":t.includes("cucumber")?"🥒":t.includes("carrot")?"🥕":t.includes("eggplant")?"🍆":t.includes("basil")||t.includes("mint")||t.includes("spinach")?"🌿":"🌱"}function L(e=""){return String(e||"plant").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function g(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function Z(){if(document.getElementById("commercial-farm-canvas-style"))return;const e=document.createElement("style");e.id="commercial-farm-canvas-style",e.textContent=`
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
    `,document.head.appendChild(e)}export{J as CommercialFarmCanvas};
