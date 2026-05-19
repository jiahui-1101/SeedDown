import{A as y}from"./index-BU24oGnM.js";import*as s from"https://esm.sh/three@0.160.0";import{OrbitControls as R}from"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const H="user_farms",w={"2-tier":{id:"2-tier",label:"2-Tier Starter Rack",tiers:2,slotsPerTier:3,total:6},"3-tier":{id:"3-tier",label:"3-Tier Vertical Rack",tiers:3,slotsPerTier:3,total:9},"4-tier":{id:"4-tier",label:"4-Tier Grow Shelf",tiers:4,slotsPerTier:4,total:16},"5-tier":{id:"5-tier",label:"5-Tier Tower Rack",tiers:5,slotsPerTier:4,total:20},wall:{id:"wall",label:"Wall Panel Grid",tiers:4,slotsPerTier:5,total:20},"a-frame":{id:"a-frame",label:"A-Frame Pyramid",tiers:4,slotsPerTier:4,total:16},"nft-channel":{id:"nft-channel",label:"NFT Channel Rows",tiers:3,slotsPerTier:6,total:18},hanging:{id:"hanging",label:"Hanging Column Farm",tiers:5,slotsPerTier:3,total:15}},k={lettuce:{color:6927180,alt:9228129,leaf:.082,spread:.095},cabbage:{color:7448635,alt:10733911,leaf:.09,spread:.1},kale:{color:3108670,alt:5213518,leaf:.088,spread:.105},spinach:{color:3046706,alt:4431943,leaf:.072,spread:.088},basil:{color:2067020,alt:3323495,leaf:.064,spread:.078},mint:{color:3450963,alt:7327605,leaf:.062,spread:.078},tomato:{color:3116870,alt:15680580,leaf:.07,spread:.086,fruit:15680580},chili:{color:2522941,alt:14427686,leaf:.066,spread:.082,fruit:14427686},pepper:{color:2522941,alt:14427686,leaf:.066,spread:.082,fruit:14427686},cucumber:{color:2325052,alt:5284955,leaf:.078,spread:.105,vine:!0},strawberry:{color:4165449,alt:16478597,leaf:.066,spread:.082,fruit:16478597},eggplant:{color:3112783,alt:8141549,leaf:.072,spread:.088,fruit:8141549},plant:{color:6660877,alt:8843180,leaf:.072,spread:.09}},J={canvas:null,parent:null,renderer:null,scene:null,camera:null,controls:null,farmGroup:null,particles:null,raycaster:null,pointer:null,interactiveRoots:[],hoverRoot:null,selectedRoot:null,detailPanel:null,tooltip:null,fullscreenButton:null,zoomControls:null,originalParent:null,originalNextSibling:null,resizeHandler:null,fullscreenHandler:null,rafId:null,clock:null,frame:0,farm:null,rack:w["3-tier"],slotPlants:[],sensorSnapshot:{},init(t){this.destroy(),this.installHandlers(),K(),this.canvas=document.getElementById(t),this.canvas&&(this.parent=this.canvas.parentElement,this.parent&&(this.farm=I(),this.rack=G(this.farm),this.slotPlants=N(this.farm,this.rack),this.sensorSnapshot=S(),this.clock=new s.Clock,this.prepareHost(),this.initScene(),this.buildFacility(),this.createOverlays(),this.bindEvents(),this.resize(),this.animate()))},prepareHost(){this.parent.classList.add("commercial-farm-host"),this.canvas.classList.add("commercial-farm-canvas"),this.parent.querySelectorAll(".cf-overlay, .cf-tooltip, .cf-expand-btn, .cf-zoom-controls").forEach(t=>t.remove())},initScene(){this.scene=new s.Scene,this.scene.background=new s.Color(16317175),this.scene.fog=new s.Fog(16317175,22,58),this.camera=new s.PerspectiveCamera(58,1,.1,120),this.camera.position.set(5.5,4.6,8.5),this.camera.lookAt(0,1.8,0),this.renderer=new s.WebGLRenderer({canvas:this.canvas,antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=s.PCFSoftShadowMap,this.renderer.outputColorSpace=s.SRGBColorSpace,this.renderer.toneMapping=s.ACESFilmicToneMapping,this.renderer.toneMappingExposure=1.08,this.controls=new R(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.07,this.controls.enablePan=!0,this.controls.enableZoom=!1,this.controls.maxPolarAngle=Math.PI*.48,this.controls.target.set(0,1.55,0),this.setCameraFrame(!1),this.raycaster=new s.Raycaster,this.pointer=new s.Vector2,this.farmGroup=new s.Group,this.scene.add(this.farmGroup),this.addLighting()},addLighting(){this.scene.add(new s.AmbientLight(14479072,.55));const t=new s.DirectionalLight(16775399,2.2);t.position.set(10,18,9),t.castShadow=!0,t.shadow.mapSize.set(2048,2048),t.shadow.camera.left=-12,t.shadow.camera.right=12,t.shadow.camera.top=12,t.shadow.camera.bottom=-12,t.shadow.bias=-4e-4,this.scene.add(t);const e=new s.DirectionalLight(12244991,.35);e.position.set(-7,10,-6),this.scene.add(e);const a=new s.HemisphereLight(11657727,4928541,.28);this.scene.add(a);const n=new s.PointLight(8702998,1.25,12);n.position.set(0,3.1,0),this.scene.add(n)},buildFacility(){this.addFloor(),this.addGreenhouseFrame(),this.addOverheadGrowLights();const t=this.createTowerLayout();t.forEach((e,a)=>this.addTower(e,a)),this.addIrrigationPipes(t),this.addNutrientStation(),this.addControlPanel(),this.addVentilationFans(),this.addWaterDrips(t),this.addParticles()},addFloor(){const t=new s.Mesh(new s.PlaneGeometry(80,60),new s.MeshStandardMaterial({color:15265510,roughness:.86,metalness:.02}));t.rotation.x=-Math.PI/2,t.receiveShadow=!0,this.scene.add(t);const e=new s.Mesh(new s.PlaneGeometry(5.2,56),new s.MeshStandardMaterial({color:14542812,roughness:.78}));e.rotation.x=-Math.PI/2,e.position.y=.006,e.receiveShadow=!0,this.scene.add(e);const a=new s.LineBasicMaterial({color:11057322,transparent:!0,opacity:.48});for(let n=-38;n<=38;n+=2)this.scene.add(z([n,.014,-28],[n,.014,28],a));for(let n=-28;n<=28;n+=2)this.scene.add(z([-38,.016,n],[38,.016,n],a))},addGreenhouseFrame(){const t=new s.MeshStandardMaterial({color:10135456,metalness:.45,roughness:.32}),e=new s.MeshPhysicalMaterial({color:13625816,transparent:!0,opacity:.2,roughness:.04,side:s.DoubleSide}),a=17.6,n=13.6,i=4.3,r=6.2;for(let l=-n/2;l<=n/2+.001;l+=2.7){[-1,1].forEach(u=>{const h=new s.Mesh(new s.CylinderGeometry(.035,.035,i,10),t);h.position.set(u*a/2,i/2,l),h.castShadow=!0,this.scene.add(h)});const c=Math.sqrt((a/2)**2+(r-i)**2),p=Math.atan2(r-i,a/2);[-1,1].forEach(u=>{const h=new s.Mesh(new s.CylinderGeometry(.028,.028,c,8),t);h.position.set(u*a/4,i+(r-i)/2,l),h.rotation.z=u*(Math.PI/2-p),this.scene.add(h)})}const o=new s.Mesh(new s.CylinderGeometry(.032,.032,n,10),t);o.rotation.x=Math.PI/2,o.position.set(0,r,0),this.scene.add(o);const d=new s.Mesh(new s.PlaneGeometry(a,i),e);d.position.set(0,i/2,-n/2),this.scene.add(d),[-1,1].forEach(l=>{const c=new s.Mesh(new s.PlaneGeometry(n,i),e);c.rotation.y=Math.PI/2,c.position.set(l*a/2,i/2,0),this.scene.add(c)})},addOverheadGrowLights(){const t=new s.MeshStandardMaterial({color:2042167,roughness:.5,metalness:.72}),e=new s.MeshStandardMaterial({color:14518527,emissive:14518527,emissiveIntensity:.85,roughness:.2});[-4.8,-2.4,2.4,4.8].forEach(a=>{for(let n=-4.8;n<=4.8;n+=2.4){const i=new s.Mesh(new s.BoxGeometry(1.4,.06,.16),t);i.position.set(a,4.15,n),this.scene.add(i);const r=new s.Mesh(new s.BoxGeometry(1.16,.025,.09),e);r.position.set(a,4.11,n),this.scene.add(r)}})},createTowerLayout(){const t=Math.max(6,Math.min(10,Math.ceil(this.rack.total/2))),e=[],a=Math.ceil(t/2),n=-((a-1)*2.15)/2,i=[-2.35,2.35];for(let r=0;r<2;r++)for(let o=0;o<a&&!(e.length>=t);o++)e.push({x:n+o*2.15,z:i[r],zoneIndex:e.length,row:r,col:o});return e},addTower(t,e){const a=String.fromCharCode(65+e),n=new s.Group;n.position.set(t.x,0,t.z),n.userData={isTower:!0,id:`zone-${a}`,label:`Zone ${a}`,zoneIndex:e,plants:[],status:"empty"};const i=new s.MeshStandardMaterial({color:15330800,roughness:.34,metalness:.18}),r=new s.MeshStandardMaterial({color:2503725,roughness:.5,metalness:.4}),o=new s.Mesh(new s.CylinderGeometry(.095,.12,3.2,22),i);o.position.y=1.67,o.castShadow=!0,n.add(o);const d=new s.Mesh(new s.CylinderGeometry(.48,.6,.15,28),r);d.position.y=.075,d.castShadow=!0,n.add(d);const l=this.slotPlants.map((m,f)=>({plant:m,index:f})).filter(m=>m.plant&&q(m.index,this.rack,e,this.createTowerLayout().length)),c=8,p=4;let u=0;for(let m=0;m<c;m++){const f=.38+m*.36,v=new s.Mesh(new s.TorusGeometry(.42,.012,8,48),new s.MeshStandardMaterial({color:5398874,roughness:.48,metalness:.35}));v.rotation.x=Math.PI/2,v.position.y=f,n.add(v);for(let M=0;M<p;M++){const D=M*Math.PI/2+(m%2?Math.PI/4:0),x=l[u]||null;this.addPod(n,D,f,(x==null?void 0:x.plant)||null,(x==null?void 0:x.index)??e*100+u,m,M),x!=null&&x.plant&&(n.userData.plants.push(x.plant),u+=1)}}n.userData.status=W(n.userData.plants);const h=this.createTextSprite(`ZONE ${a}`,{bg:"rgba(9,18,13,.88)",fg:"#a3e635",border:"#315d3e",font:"900 30px Inter, system-ui, sans-serif"});h.position.set(0,3.63,0),h.scale.set(.68,.18,1),n.add(h),this.farmGroup.add(n),this.interactiveRoots.push(n)},addPod(t,e,a,n,i,r,o){const l=Math.cos(e)*.48,c=Math.sin(e)*.48,p=(n==null?void 0:n.status)||"empty",u=B(p),h={index:i,tier:t.userData.zoneIndex+1,slot:r*4+o+1,plant:n,tower:t},m=new s.MeshStandardMaterial({color:n?16317180:2437676,roughness:.52,metalness:n?.08:.18}),f=new s.Mesh(new s.CylinderGeometry(.155,.12,.11,20),m);f.position.set(l,a,c),f.rotation.z=Math.PI/2,f.rotation.y=-e,f.castShadow=!0,f.userData.slot=h,f.userData.root=t,t.add(f);const v=new s.Mesh(new s.SphereGeometry(.045,12,8),new s.MeshStandardMaterial({color:u,emissive:u,emissiveIntensity:n?.38:.06}));v.position.set(l*1.1,a+.085,c*1.1),v.userData.slot=h,v.userData.root=t,t.add(v),n&&this.addPlantCluster(t,l*1.1,a+.12,c*1.1,n)},addPlantCluster(t,e,a,n,i){const r=V(i),o=new s.MeshStandardMaterial({color:3100976,roughness:.7}),d=new s.MeshStandardMaterial({color:r.color,roughness:.72,side:s.DoubleSide}),l=new s.MeshStandardMaterial({color:r.alt,roughness:.72,side:s.DoubleSide}),c=new s.Mesh(new s.CylinderGeometry(.008,.01,.15,6),o);c.position.set(e,a+.055,n),t.add(c);for(let p=0;p<7;p++){const u=Math.PI*2/7*p,h=r.spread+Math.random()*.025,m=new s.Mesh(new s.SphereGeometry(r.leaf,8,5),p%2?d:l);m.scale.set(1.4,.36,.82),m.position.set(e+Math.cos(u)*h,a+.12+p%3*.012,n+Math.sin(u)*h),m.rotation.set(-.45+Math.random()*.18,u,.18),m.castShadow=!0,t.add(m)}if(r.fruit)for(let p=0;p<2;p++){const u=Math.PI*p+.55,h=new s.Mesh(new s.SphereGeometry(.032,10,8),new s.MeshStandardMaterial({color:r.fruit,roughness:.55}));h.position.set(e+Math.cos(u)*.07,a+.105,n+Math.sin(u)*.07),t.add(h)}if(r.vine){const p=new s.Mesh(new s.CylinderGeometry(.006,.004,.34,5),new s.MeshStandardMaterial({color:r.color,roughness:.72}));p.position.set(e+.06,a-.02,n+.05),p.rotation.z=.25,t.add(p)}},addIrrigationPipes(t){const e=new s.MeshStandardMaterial({color:5605546,roughness:.28,metalness:.6}),a=new s.MeshStandardMaterial({color:9358054,roughness:.25,metalness:.55});[...new Set(t.map(i=>i.z))].forEach(i=>{const r=t.filter(c=>c.z===i),o=Math.min(...r.map(c=>c.x))-.8,d=Math.max(...r.map(c=>c.x))+.8,l=new s.Mesh(new s.CylinderGeometry(.035,.035,d-o,10),e);l.rotation.z=Math.PI/2,l.position.set((o+d)/2,3.35,i+.25),this.scene.add(l)}),t.forEach(i=>{const r=new s.Mesh(new s.CylinderGeometry(.02,.02,2.75,8),e);r.position.set(i.x+.28,1.9,i.z+.25),this.scene.add(r);const o=new s.Mesh(new s.SphereGeometry(.055,10,8),a);o.position.set(i.x+.28,3.28,i.z+.25),this.scene.add(o)})},addNutrientStation(){const t=new s.MeshStandardMaterial({color:2780750,roughness:.35,metalness:.15}),e=new s.MeshStandardMaterial({color:2054718,roughness:.4,metalness:.2});["N","P","K","pH"].forEach((n,i)=>{const r=-3+i*2,o=new s.Group;o.userData={isTank:!0,label:n,status:i===3&&O(this.sensorSnapshot)?"warning":"healthy"};const d=new s.Mesh(new s.CylinderGeometry(.42,.42,1.05,18),t);d.position.set(r,.58,-5.75),d.castShadow=!0,o.add(d);const l=new s.Mesh(new s.CylinderGeometry(.45,.42,.07,18),e);l.position.set(r,1.14,-5.75),o.add(l);const c=this.createTextSprite(n,{bg:"rgba(255,255,255,.92)",fg:"#0f172a",font:"900 34px Inter, system-ui, sans-serif"});c.position.set(r,.58,-5.28),c.scale.set(.22,.1,1),o.add(c),this.scene.add(o),this.interactiveRoots.push(o)})},addControlPanel(){const t=new s.MeshStandardMaterial({color:5593943,roughness:.5,metalness:.3}),e=new s.Mesh(new s.BoxGeometry(1.7,.08,.65),t);e.position.set(0,.86,5.75),e.castShadow=!0,this.scene.add(e);const a=new s.MeshStandardMaterial({color:464909,emissive:2062914,emissiveIntensity:.75,roughness:.12,metalness:.42}),n=new s.Mesh(new s.BoxGeometry(.95,.56,.04),a);n.position.set(0,1.38,5.45),n.castShadow=!0,this.scene.add(n);const i=this.createTextSprite("CONTROL",{bg:"rgba(9,18,13,.86)",fg:"#a3e635",font:"900 26px Inter, system-ui, sans-serif"});i.position.set(0,1.82,5.4),i.scale.set(.42,.13,1),this.scene.add(i)},addVentilationFans(){const t=new s.MeshStandardMaterial({color:2042167,roughness:.36,metalness:.55});[-7.3,7.3].forEach(e=>{const a=new s.Group;a.position.set(e,2.8,-5.9),a.userData.isFan=!0;const n=new s.Mesh(new s.TorusGeometry(.34,.025,8,32),t);a.add(n);for(let i=0;i<4;i++){const r=new s.Mesh(new s.BoxGeometry(.48,.045,.018),t);r.rotation.z=i*Math.PI/4,r.userData.isFanBlade=!0,a.add(r)}this.scene.add(a)})},addWaterDrips(t){const e=new s.MeshStandardMaterial({color:3718648,emissive:3718648,emissiveIntensity:.5,transparent:!0,opacity:.85});t.forEach((a,n)=>{if(n%2)return;const i=new s.Mesh(new s.SphereGeometry(.025,8,6),e.clone());i.position.set(a.x+.25,2.9,a.z+.28),i.userData.isDrip=!0,i.userData.baseY=i.position.y,this.scene.add(i)})},addParticles(){const e=new Float32Array(1080),a=new Float32Array(360*3);for(let r=0;r<360;r++)e[r*3]=(Math.random()-.5)*15,e[r*3+1]=Math.random()*4.4+.7,e[r*3+2]=(Math.random()-.5)*11,a[r*3]=(Math.random()-.5)*.002,a[r*3+1]=(Math.random()-.5)*.001,a[r*3+2]=(Math.random()-.5)*.002;const n=new s.BufferGeometry;n.setAttribute("position",new s.BufferAttribute(e,3));const i=new s.PointsMaterial({color:16777215,size:.028,transparent:!0,opacity:.28,depthWrite:!1,blending:s.AdditiveBlending});this.particles=new s.Points(n,i),this.particles.userData.velocities=a,this.scene.add(this.particles)},createOverlays(){var a;const t=this.slotPlants.filter(Boolean).length;this.detailPanel=document.createElement("div"),this.detailPanel.className="cf-overlay cf-info-panel",this.detailPanel.innerHTML=E({title:((a=this.farm)==null?void 0:a.name)||y.farmName||"Commercial Farm",subtitle:`${this.rack.label} · ${t}/${this.rack.total} planted`,status:C(this.slotPlants,this.sensorSnapshot),mode:"Facility overview"}),this.parent.appendChild(this.detailPanel),this.tooltip=document.createElement("div"),this.tooltip.className="cf-tooltip",this.tooltip.innerHTML='<span class="cf-tooltip-dot"></span><div><strong>Hover a tower</strong><small>Click to inspect rack details</small></div>',this.parent.appendChild(this.tooltip);const e=document.createElement("div");e.className="cf-overlay cf-legend",e.innerHTML=`
            <span><i class="ok"></i>Healthy</span>
            <span><i class="warn"></i>Warning</span>
            <span><i class="danger"></i>Critical</span>
            <span class="cf-legend-help">Drag rotate · Wheel / +/- zoom · Double click fullscreen</span>
        `,this.parent.appendChild(e),this.fullscreenButton=document.createElement("button"),this.fullscreenButton.type="button",this.fullscreenButton.className="cf-expand-btn",this.fullscreenButton.textContent="EXPAND",this.fullscreenButton.addEventListener("click",n=>{n.stopPropagation(),this.toggleFullscreen()}),this.parent.appendChild(this.fullscreenButton),this.zoomControls=document.createElement("div"),this.zoomControls.className="cf-zoom-controls",this.zoomControls.innerHTML=`
            <button type="button" data-zoom="in" aria-label="Zoom in">+</button>
            <button type="button" data-zoom="out" aria-label="Zoom out">-</button>
            <button type="button" data-zoom="reset" aria-label="Reset view">RESET</button>
        `,this.zoomControls.addEventListener("click",n=>{const i=n.target.closest("button[data-zoom]");i&&(n.preventDefault(),n.stopPropagation(),i.dataset.zoom==="in"&&this.zoomCamera(.82),i.dataset.zoom==="out"&&this.zoomCamera(1.22),i.dataset.zoom==="reset"&&this.resetCamera())}),this.parent.appendChild(this.zoomControls)},bindEvents(){this.resizeHandler=()=>this.resize(),window.addEventListener("resize",this.resizeHandler),this.fullscreenHandler=()=>{this.syncExpandButton(),setTimeout(()=>this.resize(),80)},document.addEventListener("fullscreenchange",this.fullscreenHandler),this.canvas.addEventListener("pointermove",this.onPointerMove),this.canvas.addEventListener("click",this.onClick),this.canvas.addEventListener("dblclick",this.onDoubleClick),this.canvas.addEventListener("wheel",this.onWheel,{passive:!1})},onPointerMove:null,onClick:null,onDoubleClick:null,onWheel:null,installHandlers(){this.onPointerMove=t=>this.handlePointerMove(t),this.onClick=t=>this.handleClick(t),this.onDoubleClick=()=>this.toggleFullscreen(),this.onWheel=t=>this.handleWheel(t)},handlePointerMove(t){const e=this.pickRoot(t);e!==this.hoverRoot&&(this.hoverRoot&&this.hoverRoot!==this.selectedRoot&&this.setHighlight(this.hoverRoot,!1),this.hoverRoot=e,this.hoverRoot&&this.hoverRoot!==this.selectedRoot&&this.setHighlight(this.hoverRoot,!0)),this.canvas.style.cursor=e?"pointer":"grab",this.updateTooltip(e)},handleClick(t){const e=this.pickRoot(t);if(!e){this.selectedRoot&&this.setHighlight(this.selectedRoot,!1),this.selectedRoot=null,this.showOverview();return}this.selectedRoot&&this.selectedRoot!==e&&this.setHighlight(this.selectedRoot,!1),this.selectedRoot=e,this.setHighlight(e,!0,!0),this.showRootDetail(e)},handleWheel(t){!this.camera||!this.controls||(t.preventDefault(),t.stopPropagation(),this.zoomCamera(t.deltaY>0?1.12:.88))},zoomCamera(t){var d,l;if(!this.camera||!this.controls)return;const e=this.controls.target,a=this.camera.position.clone().sub(e),n=a.length()||1,i=(d=this.parent)!=null&&d.classList.contains("cf-expanded")?2.4:2.8,r=(l=this.parent)!=null&&l.classList.contains("cf-expanded")?24:18,o=s.MathUtils.clamp(n*t,i,r);a.setLength(o),this.camera.position.copy(e).add(a),this.controls.update()},resetCamera(){var t;this.setCameraFrame((t=this.parent)==null?void 0:t.classList.contains("cf-expanded"))},setCameraFrame(t=!1){!this.camera||!this.controls||(t?(this.camera.fov=38,this.camera.position.set(.35,18.5,.35),this.controls.target.set(0,0,0),this.controls.minPolarAngle=Math.PI*.015,this.controls.maxPolarAngle=Math.PI*.18):(this.camera.fov=58,this.camera.position.set(5.5,4.6,8.5),this.controls.target.set(0,1.55,0),this.controls.minPolarAngle=0,this.controls.maxPolarAngle=Math.PI*.48),this.camera.updateProjectionMatrix(),this.controls.update())},pickRoot(t){var r,o;const e=this.canvas.getBoundingClientRect();this.pointer.x=(t.clientX-e.left)/e.width*2-1,this.pointer.y=-((t.clientY-e.top)/e.height)*2+1,this.raycaster.setFromCamera(this.pointer,this.camera);const a=[];this.interactiveRoots.forEach(d=>d.traverse(l=>{l.isMesh&&a.push(l)}));const n=(r=this.raycaster.intersectObjects(a,!1)[0])==null?void 0:r.object;if(!n)return null;let i=n;for(;i;){if(this.interactiveRoots.includes(i))return i;if((o=i.userData)!=null&&o.root&&this.interactiveRoots.includes(i.userData.root))return i.userData.root;i=i.parent}return null},setHighlight(t,e,a=!1){const n=a?new s.Color(3718648):new s.Color(10741301),i=a?.65:.32;t.traverse(r=>{var o;!r.isMesh||!((o=r.material)!=null&&o.emissive)||(r.userData.originalEmissive||(r.userData.originalEmissive=r.material.emissive.clone(),r.userData.originalIntensity=r.material.emissiveIntensity||0),e?(r.material.emissive.copy(n),r.material.emissiveIntensity=i):(r.material.emissive.copy(r.userData.originalEmissive),r.material.emissiveIntensity=r.userData.originalIntensity))})},updateTooltip(t){if(!this.tooltip)return;if(!t){this.tooltip.innerHTML='<span class="cf-tooltip-dot"></span><div><strong>Hover a tower</strong><small>Click to inspect rack details</small></div>';return}const e=t.userData||{},a=Array.isArray(e.plants)?e.plants.length:0;this.tooltip.innerHTML=`
            <span class="cf-tooltip-dot ${e.status||"healthy"}"></span>
            <div><strong>${g(e.label||e.label||"Station")}</strong><small>${a?`${a} active plants`:e.isTank?"Nutrient station":"Empty zone"}</small></div>
        `},showOverview(){var e;const t=this.slotPlants.filter(Boolean).length;this.detailPanel.innerHTML=E({title:((e=this.farm)==null?void 0:e.name)||y.farmName||"Commercial Farm",subtitle:`${this.rack.label} · ${t}/${this.rack.total} planted`,status:C(this.slotPlants,this.sensorSnapshot),mode:"Facility overview"})},showRootDetail(t){const e=t.userData||{};if(e.isTank){this.detailPanel.innerHTML=_(e,this.sensorSnapshot);return}const a=Array.isArray(e.plants)?e.plants:[];this.detailPanel.innerHTML=Z(e,a,this.sensorSnapshot)},async toggleFullscreen(){if(!this.parent)return;!this.parent.classList.contains("cf-expanded")?this.enterExpandedView():this.exitExpandedView()},enterExpandedView(){!this.parent||this.parent.classList.contains("cf-expanded")||(this.originalParent=this.parent.parentNode,this.originalNextSibling=this.parent.nextSibling,document.body.appendChild(this.parent),this.parent.classList.add("cf-expanded"),document.documentElement.classList.add("cf-expanded-lock"),document.body.classList.add("cf-expanded-lock"),this.syncExpandButton(),this.setCameraFrame(!0),requestAnimationFrame(()=>this.resize()),setTimeout(()=>this.resize(),120))},exitExpandedView(){this.parent&&(this.parent.classList.remove("cf-expanded"),document.documentElement.classList.remove("cf-expanded-lock"),document.body.classList.remove("cf-expanded-lock"),this.restoreHostPlacement(),this.syncExpandButton(),this.setCameraFrame(!1),requestAnimationFrame(()=>this.resize()),setTimeout(()=>this.resize(),120))},restoreHostPlacement(){!this.parent||!this.originalParent||(this.originalNextSibling&&this.originalNextSibling.parentNode===this.originalParent?this.originalParent.insertBefore(this.parent,this.originalNextSibling):this.originalParent.appendChild(this.parent),this.originalParent=null,this.originalNextSibling=null)},syncExpandButton(){!this.fullscreenButton||!this.parent||(this.fullscreenButton.textContent=this.parent.classList.contains("cf-expanded")?"CLOSE":"EXPAND")},resize(){var o,d;if(!this.canvas||!this.renderer||!this.camera)return;const t=(o=this.parent)==null?void 0:o.classList.contains("cf-expanded"),e=(d=this.parent)==null?void 0:d.classList.contains("commercial-command-screen"),a=t||e;e&&(L(this.parent,{position:"fixed",inset:"0",width:"100vw",height:"100vh",minHeight:"100vh",overflow:"hidden",borderRadius:"0"}),L(this.canvas,{position:"fixed",inset:"0",width:"100vw",height:"100vh",minHeight:"100vh",display:"block",borderRadius:"0"}));const n=this.canvas.getBoundingClientRect(),i=a?window.innerWidth||document.documentElement.clientWidth||n.width||1280:Math.max(320,n.width||this.parent.clientWidth||640),r=a?window.innerHeight||document.documentElement.clientHeight||n.height||720:Math.max(300,n.height||420);this.renderer.setSize(i,r,!1),this.camera.aspect=i/r,this.camera.updateProjectionMatrix()},animate(){var e,a;const t=Math.min(.04,((a=(e=this.clock)==null?void 0:e.getDelta)==null?void 0:a.call(e))||.016);this.frame+=1,this.controls&&this.controls.update(),this.updateParticles(),this.scene.traverse(n=>{var i,r;(i=n.userData)!=null&&i.isFanBlade&&(n.rotation.z+=4.8*t),(r=n.userData)!=null&&r.isDrip&&(n.position.y-=.55*t,n.position.y<.7&&(n.position.y=n.userData.baseY))}),this.renderer&&this.scene&&this.camera&&this.renderer.render(this.scene,this.camera),this.rafId=requestAnimationFrame(()=>this.animate())},updateParticles(){if(!this.particles)return;const t=this.particles.geometry.attributes.position,e=this.particles.userData.velocities;for(let a=0;a<t.count;a++)t.array[a*3]+=e[a*3],t.array[a*3+1]+=e[a*3+1],t.array[a*3+2]+=e[a*3+2],t.array[a*3]>7.5&&(t.array[a*3]=-7.5),t.array[a*3]<-7.5&&(t.array[a*3]=7.5),t.array[a*3+1]>5.4&&(t.array[a*3+1]=.7),t.array[a*3+2]>5.5&&(t.array[a*3+2]=-5.5),t.array[a*3+2]<-5.5&&(t.array[a*3+2]=5.5);t.needsUpdate=!0},createTextSprite(t,e={}){const a=document.createElement("canvas");a.width=512,a.height=128;const n=a.getContext("2d");n.clearRect(0,0,a.width,a.height),X(n,18,22,a.width-36,84,28),n.fillStyle=e.bg||"rgba(12,20,14,.9)",n.fill(),e.border&&(n.strokeStyle=e.border,n.lineWidth=4,n.stroke()),n.fillStyle=e.fg||"#ffffff",n.font=e.font||"900 30px Inter, system-ui, sans-serif",n.textAlign="center",n.textBaseline="middle",n.fillText(t,a.width/2,66);const i=new s.CanvasTexture(a);i.colorSpace=s.SRGBColorSpace;const r=new s.SpriteMaterial({map:i,transparent:!0,depthWrite:!1}),o=new s.Sprite(r);return o.userData.texture=i,o},destroy(){var t;this.rafId&&cancelAnimationFrame(this.rafId),this.rafId=null,this.resizeHandler&&window.removeEventListener("resize",this.resizeHandler),this.fullscreenHandler&&document.removeEventListener("fullscreenchange",this.fullscreenHandler),this.canvas&&this.onPointerMove&&this.canvas.removeEventListener("pointermove",this.onPointerMove),this.canvas&&this.onClick&&this.canvas.removeEventListener("click",this.onClick),this.canvas&&this.onDoubleClick&&this.canvas.removeEventListener("dblclick",this.onDoubleClick),this.canvas&&this.onWheel&&this.canvas.removeEventListener("wheel",this.onWheel),this.controls&&this.controls.dispose(),this.scene&&this.scene.traverse(e=>{var a;e.geometry&&e.geometry.dispose(),(a=e.userData)!=null&&a.texture&&e.userData.texture.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(n=>n.dispose()):e.material.dispose())}),this.renderer&&this.renderer.dispose(),(t=this.parent)!=null&&t.classList.contains("cf-expanded")&&this.exitExpandedView(),this.parent&&(this.parent.classList.remove("cf-expanded"),this.parent.querySelectorAll(".cf-overlay, .cf-tooltip, .cf-expand-btn, .cf-zoom-controls").forEach(e=>e.remove()),this.parent.classList.remove("commercial-farm-host")),document.documentElement.classList.remove("cf-expanded-lock"),document.body.classList.remove("cf-expanded-lock"),this.canvas=null,this.parent=null,this.renderer=null,this.scene=null,this.camera=null,this.controls=null,this.farmGroup=null,this.particles=null,this.raycaster=null,this.pointer=null,this.interactiveRoots=[],this.hoverRoot=null,this.selectedRoot=null,this.detailPanel=null,this.tooltip=null,this.fullscreenButton=null,this.zoomControls=null,this.originalParent=null,this.originalNextSibling=null,this.resizeHandler=null,this.fullscreenHandler=null,this.onPointerMove=null,this.onClick=null,this.onDoubleClick=null,this.onWheel=null}};function I(){const t=F();return y.currentFarm||t.find(e=>e.id===y.currentFarmId)||t[t.length-1]||null}function F(){try{return JSON.parse(localStorage.getItem(H))||[]}catch{return[]}}function G(t){const e=String((t==null?void 0:t.rackTypeId)||(t==null?void 0:t.rackType)||(t==null?void 0:t.rackLabel)||"").toLowerCase();return e.includes("2")?w["2-tier"]:e.includes("4")?w["4-tier"]:e.includes("5")?w["5-tier"]:e.includes("wall")||e.includes("grid")?w.wall:e.includes("frame")?w["a-frame"]:e.includes("nft")||e.includes("channel")?w["nft-channel"]:e.includes("hanging")||e.includes("column")?w.hanging:w["3-tier"]}function N(t,e){const a=Array.isArray(t==null?void 0:t.plants)?t.plants:[],n=Array(e.total).fill(null),i=new Set;if(a.forEach(o=>{if(o.slotIndex!==void 0&&o.slotIndex!==null){const l=Number(o.slotIndex);Number.isInteger(l)&&l>=0&&l<e.total&&(n[l]=P(o,l,e,t),i.add(l));return}const d=Math.max(1,Number.parseInt(o.slots||o.count||1,10)||1);for(let l=0;l<d;l++){const c=$(n,i);if(c===-1)return;n[c]=P(o,c,e,t),i.add(c)}}),n.some(Boolean))return n;const r=Math.min(e.total,Number.parseInt((t==null?void 0:t.plantSlots)||(t==null?void 0:t.plants)||0,10)||0);for(let o=0;o<r;o++)n[o]=P({name:(t==null?void 0:t.targetPlant)||"Plant",status:"healthy"},o,e,t);return n}function P(t,e,a,n){const i=t.name||(n==null?void 0:n.targetPlant)||"Plant";return{name:i,emoji:t.emoji||Y(i),species:t.species||T(i),status:t.status||A(t.growth),growth:Number(t.growth??70),days:Number(t.days??0),slotIndex:e,tier:Math.floor(e/a.slotsPerTier)+1,position:e%a.slotsPerTier+1}}function $(t,e){for(let a=0;a<t.length;a++)if(!t[a]&&!e.has(a))return a;return-1}function A(t){const e=Number(t??80);return e<35?"danger":e<60?"warning":"healthy"}function B(t){return t==="danger"?15680580:t==="warning"?16096779:t==="empty"?6583435:8702998}function W(t){return t.length?t.some(e=>e.status==="danger")?"danger":t.some(e=>e.status==="warning")?"warning":"healthy":"empty"}function C(t,e){return t.some(Boolean)&&t.some(a=>(a==null?void 0:a.status)==="danger")?"Critical plant risk":Number(e.gasRaw||0)>2500||Number(e.temperature||25)>35?"Automation alert":t.some(a=>(a==null?void 0:a.status)==="warning")?"Needs review":"Operational"}function S(){var e,a,n,i,r,o;const t=y.sensors||{};return{temperature:((e=t.temp)==null?void 0:e.val)??25,humidity:((a=t.humid)==null?void 0:a.val)??60,lightRaw:((n=t.light)==null?void 0:n.val)??2e3,ph:((i=t.ph)==null?void 0:i.val)??6.1,waterDistanceCm:((r=t.water)==null?void 0:r.val)??10,gasRaw:((o=t.nutrient)==null?void 0:o.val)??1e3}}function O(t){const e=Number(t.ph??6.1);return e<5.5||e>6.5}function V(t){const e=T((t==null?void 0:t.species)||(t==null?void 0:t.name)||"plant"),a=k[e];if(a)return a;const n=Object.keys(k).find(i=>e.includes(i));return k[n]||k.plant}function q(t,e,a,n){return Number.isNaN(t)?!1:t%n===a||Math.floor(t/Math.max(1,e.slotsPerTier))===a}function z(t,e,a){const n=new s.BufferGeometry().setFromPoints([new s.Vector3(...t),new s.Vector3(...e)]);return new s.Line(n,a)}function X(t,e,a,n,i,r){t.beginPath(),t.moveTo(e+r,a),t.lineTo(e+n-r,a),t.quadraticCurveTo(e+n,a,e+n,a+r),t.lineTo(e+n,a+i-r),t.quadraticCurveTo(e+n,a+i,e+n-r,a+i),t.lineTo(e+r,a+i),t.quadraticCurveTo(e,a+i,e,a+i-r),t.lineTo(e,a+r),t.quadraticCurveTo(e,a,e+r,a),t.closePath()}function E({title:t,subtitle:e,status:a,mode:n}){return`
        <div class="cf-panel-kicker">${g(n)}</div>
        <div class="cf-panel-title">${g(t)}</div>
        <div class="cf-panel-sub">${g(e)}</div>
        <div class="cf-mini-grid">
            ${b("Status",a)}
            ${b("Light",`${Math.round(Number(S().lightRaw||0))}`)}
            ${b("pH",`${Number(S().ph||0).toFixed(1)}`)}
        </div>
    `}function Z(t,e,a){const n=e.filter(o=>o.status==="healthy").length,i=e.filter(o=>o.status==="warning").length,r=e.filter(o=>o.status==="danger").length;return`
        <div class="cf-panel-kicker">Selected production zone</div>
        <div class="cf-panel-title">${g(t.label||"Zone")}</div>
        <div class="cf-panel-sub">${e.length||0} active plants · ${g(t.status||"empty")}</div>
        <div class="cf-mini-grid">
            ${b("Healthy",n)}
            ${b("Warning",i)}
            ${b("Critical",r)}
            ${b("Temp",`${Number(a.temperature||0).toFixed(1)}C`)}
        </div>
        <div class="cf-plant-list">
            ${e.slice(0,5).map(o=>`<span>${g(o.name)} <b>${g(o.status)}</b></span>`).join("")||"<span>No assigned crop yet</span>"}
        </div>
    `}function _(t,e){return`
        <div class="cf-panel-kicker">Nutrient station</div>
        <div class="cf-panel-title">${g(t.label||"Tank")} Tank</div>
        <div class="cf-panel-sub">Linked to commercial automation controls</div>
        <div class="cf-mini-grid">
            ${b("pH",`${Number(e.ph||0).toFixed(1)}`)}
            ${b("Water",`${Number(e.waterDistanceCm||0)}cm`)}
            ${b("Status",g(t.status||"healthy"))}
        </div>
    `}function b(t,e){return`<div class="cf-mini-metric"><span>${g(t)}</span><strong>${g(e)}</strong></div>`}function Y(t=""){const e=String(t).toLowerCase();return e.includes("lettuce")||e.includes("cabbage")||e.includes("kale")?"🥬":e.includes("tomato")?"🍅":e.includes("chili")||e.includes("pepper")?"🌶️":e.includes("strawberry")?"🍓":e.includes("cucumber")?"🥒":e.includes("carrot")?"🥕":e.includes("eggplant")?"🍆":e.includes("basil")||e.includes("mint")||e.includes("spinach")?"🌿":"🌱"}function T(t=""){return String(t||"plant").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function g(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function L(t,e){t&&Object.entries(e).forEach(([a,n])=>{const i=a.replace(/[A-Z]/g,r=>"-"+r.toLowerCase());t.style.setProperty(i,n,"important")})}function K(){if(document.getElementById("commercial-farm-canvas-style"))return;const t=document.createElement("style");t.id="commercial-farm-canvas-style",t.textContent=`
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
    `,document.head.appendChild(t)}export{J as CommercialFarmCanvas};
