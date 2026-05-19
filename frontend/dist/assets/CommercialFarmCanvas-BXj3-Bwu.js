import{A as M}from"./index-DZrsI_8o.js";import*as s from"https://esm.sh/three@0.160.0";import{OrbitControls as H}from"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const N="user_farms",y={"2-tier":{id:"2-tier",label:"2-Tier Starter Rack",tiers:2,slotsPerTier:3,total:6},"3-tier":{id:"3-tier",label:"3-Tier Vertical Rack",tiers:3,slotsPerTier:3,total:9},"4-tier":{id:"4-tier",label:"4-Tier Grow Shelf",tiers:4,slotsPerTier:4,total:16},"5-tier":{id:"5-tier",label:"5-Tier Tower Rack",tiers:5,slotsPerTier:4,total:20},wall:{id:"wall",label:"Wall Panel Grid",tiers:4,slotsPerTier:5,total:20},"a-frame":{id:"a-frame",label:"A-Frame Pyramid",tiers:4,slotsPerTier:4,total:16},"nft-channel":{id:"nft-channel",label:"NFT Channel Rows",tiers:3,slotsPerTier:6,total:18},hanging:{id:"hanging",label:"Hanging Column Farm",tiers:5,slotsPerTier:3,total:15}},C={lettuce:{color:6927180,alt:9228129,leaf:.082,spread:.095},cabbage:{color:7448635,alt:10733911,leaf:.09,spread:.1},kale:{color:3108670,alt:5213518,leaf:.088,spread:.105},spinach:{color:3046706,alt:4431943,leaf:.072,spread:.088},basil:{color:2067020,alt:3323495,leaf:.064,spread:.078},mint:{color:3450963,alt:7327605,leaf:.062,spread:.078},tomato:{color:3116870,alt:15680580,leaf:.07,spread:.086,fruit:15680580},chili:{color:2522941,alt:14427686,leaf:.066,spread:.082,fruit:14427686},pepper:{color:2522941,alt:14427686,leaf:.066,spread:.082,fruit:14427686},cucumber:{color:2325052,alt:5284955,leaf:.078,spread:.105,vine:!0},strawberry:{color:4165449,alt:16478597,leaf:.066,spread:.082,fruit:16478597},eggplant:{color:3112783,alt:8141549,leaf:.072,spread:.088,fruit:8141549},plant:{color:6660877,alt:8843180,leaf:.072,spread:.09}},at={canvas:null,parent:null,renderer:null,scene:null,camera:null,controls:null,farmGroup:null,particles:null,raycaster:null,pointer:null,interactiveRoots:[],hoverRoot:null,selectedRoot:null,detailPanel:null,tooltip:null,fullscreenButton:null,zoomControls:null,originalParent:null,originalNextSibling:null,resizeHandler:null,fullscreenHandler:null,rafId:null,clock:null,frame:0,farm:null,rack:y["3-tier"],slotPlants:[],sensorSnapshot:{},init(t){this.destroy(),this.installHandlers(),tt(),this.canvas=document.getElementById(t),this.canvas&&(this.parent=this.canvas.parentElement,this.parent&&(this.farm=G(),this.rack=$(this.farm),this.slotPlants=B(this.farm,this.rack),this.sensorSnapshot=z(),this.clock=new s.Clock,this.prepareHost(),this.initScene(),this.buildFacility(),this.createOverlays(),this.bindEvents(),this.resize(),this.animate()))},prepareHost(){this.parent.classList.add("commercial-farm-host"),this.canvas.classList.add("commercial-farm-canvas"),this.parent.querySelectorAll(".cf-overlay, .cf-tooltip, .cf-expand-btn, .cf-zoom-controls").forEach(t=>t.remove())},initScene(){this.scene=new s.Scene,this.scene.background=new s.Color(16317175),this.scene.fog=new s.Fog(16317175,22,58),this.camera=new s.PerspectiveCamera(58,1,.1,120),this.camera.position.set(5.5,4.6,8.5),this.camera.lookAt(0,1.8,0),this.renderer=new s.WebGLRenderer({canvas:this.canvas,antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=s.PCFSoftShadowMap,this.renderer.outputColorSpace=s.SRGBColorSpace,this.renderer.toneMapping=s.ACESFilmicToneMapping,this.renderer.toneMappingExposure=1.08,this.controls=new H(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.07,this.controls.enablePan=!0,this.controls.enableZoom=!1,this.controls.maxPolarAngle=Math.PI*.48,this.controls.target.set(0,1.55,0),this.setCameraFrame(!1),this.raycaster=new s.Raycaster,this.pointer=new s.Vector2,this.farmGroup=new s.Group,this.scene.add(this.farmGroup),this.addLighting()},addLighting(){this.scene.add(new s.AmbientLight(14479072,.55));const t=new s.DirectionalLight(16775399,2.2);t.position.set(10,18,9),t.castShadow=!0,t.shadow.mapSize.set(2048,2048),t.shadow.camera.left=-12,t.shadow.camera.right=12,t.shadow.camera.top=12,t.shadow.camera.bottom=-12,t.shadow.bias=-4e-4,this.scene.add(t);const e=new s.DirectionalLight(12244991,.35);e.position.set(-7,10,-6),this.scene.add(e);const n=new s.HemisphereLight(11657727,4928541,.28);this.scene.add(n);const a=new s.PointLight(8702998,1.25,12);a.position.set(0,3.1,0),this.scene.add(a)},buildFacility(){this.addFloor(),this.addGreenhouseFrame(),this.addOverheadGrowLights();const t=this.createTowerLayout();t.forEach((e,n)=>this.addTower(e,n)),this.addIrrigationPipes(t),this.addNutrientStation(),this.addControlPanel(),this.addVentilationFans(),this.addWaterDrips(t),this.addParticles()},addFloor(){const t=new s.Mesh(new s.PlaneGeometry(80,60),new s.MeshStandardMaterial({color:15265510,roughness:.86,metalness:.02}));t.rotation.x=-Math.PI/2,t.receiveShadow=!0,this.scene.add(t);const e=new s.Mesh(new s.PlaneGeometry(5.2,56),new s.MeshStandardMaterial({color:14542812,roughness:.78}));e.rotation.x=-Math.PI/2,e.position.y=.006,e.receiveShadow=!0,this.scene.add(e);const n=new s.LineBasicMaterial({color:11057322,transparent:!0,opacity:.48});for(let a=-38;a<=38;a+=2)this.scene.add(E([a,.014,-28],[a,.014,28],n));for(let a=-28;a<=28;a+=2)this.scene.add(E([-38,.016,a],[38,.016,a],n))},addGreenhouseFrame(){const t=new s.MeshStandardMaterial({color:10135456,metalness:.45,roughness:.32}),e=new s.MeshPhysicalMaterial({color:13625816,transparent:!0,opacity:.2,roughness:.04,side:s.DoubleSide}),n=17.6,a=13.6,i=4.3,r=6.2;for(let l=-a/2;l<=a/2+.001;l+=2.7){[-1,1].forEach(u=>{const c=new s.Mesh(new s.CylinderGeometry(.035,.035,i,10),t);c.position.set(u*n/2,i/2,l),c.castShadow=!0,this.scene.add(c)});const h=Math.sqrt((n/2)**2+(r-i)**2),m=Math.atan2(r-i,n/2);[-1,1].forEach(u=>{const c=new s.Mesh(new s.CylinderGeometry(.028,.028,h,8),t);c.position.set(u*n/4,i+(r-i)/2,l),c.rotation.z=u*(Math.PI/2-m),this.scene.add(c)})}const o=new s.Mesh(new s.CylinderGeometry(.032,.032,a,10),t);o.rotation.x=Math.PI/2,o.position.set(0,r,0),this.scene.add(o);const d=new s.Mesh(new s.PlaneGeometry(n,i),e);d.position.set(0,i/2,-a/2),this.scene.add(d),[-1,1].forEach(l=>{const h=new s.Mesh(new s.PlaneGeometry(a,i),e);h.rotation.y=Math.PI/2,h.position.set(l*n/2,i/2,0),this.scene.add(h)})},addOverheadGrowLights(){const t=new s.MeshStandardMaterial({color:2042167,roughness:.5,metalness:.72}),e=new s.MeshStandardMaterial({color:14518527,emissive:14518527,emissiveIntensity:.85,roughness:.2});[-4.8,-2.4,2.4,4.8].forEach(n=>{for(let a=-4.8;a<=4.8;a+=2.4){const i=new s.Mesh(new s.BoxGeometry(1.4,.06,.16),t);i.position.set(n,4.15,a),this.scene.add(i);const r=new s.Mesh(new s.BoxGeometry(1.16,.025,.09),e);r.position.set(n,4.11,a),this.scene.add(r)}})},createTowerLayout(){const t=k(this.farm);if(t.length){const o=Math.ceil(Math.sqrt(t.length)),d=Math.ceil(t.length/o),l=2.65,h=3.1,m=-((o-1)*l)/2,u=-((d-1)*h)/2;return t.map((c,p)=>({x:m+p%o*l,z:u+Math.floor(p/o)*h,zoneIndex:p,row:Math.floor(p/o),col:p%o,zoneId:c.zone_id||c.id||`zone_${String.fromCharCode(65+p)}`,label:c.name||`Zone ${String.fromCharCode(65+p)}`,crop:c.crop||(Array.isArray(c.plants)?c.plants.join(", "):"")||"Mixed crops"}))}const e=Math.max(6,Math.min(10,Math.ceil(this.rack.total/2))),n=[],a=Math.ceil(e/2),i=-((a-1)*2.15)/2,r=[-2.35,2.35];for(let o=0;o<2;o++)for(let d=0;d<a&&!(n.length>=e);d++)n.push({x:i+d*2.15,z:r[o],zoneIndex:n.length,row:o,col:d});return n},addTower(t,e){const n=String.fromCharCode(65+e),a=new s.Group;a.position.set(t.x,0,t.z),a.userData={isTower:!0,id:t.zoneId||`zone-${n}`,label:t.label||`Zone ${n}`,crop:t.crop||"Mixed crops",zoneIndex:e,plants:[],status:"empty"};const i=new s.MeshStandardMaterial({color:15330800,roughness:.34,metalness:.18}),r=new s.MeshStandardMaterial({color:2503725,roughness:.5,metalness:.4}),o=new s.Mesh(new s.CylinderGeometry(.095,.12,3.2,22),i);o.position.y=1.67,o.castShadow=!0,a.add(o);const d=new s.Mesh(new s.CylinderGeometry(.48,.6,.15,28),r);d.position.y=.075,d.castShadow=!0,a.add(d);const l=this.createTowerLayout().length,h=this.slotPlants.map((f,g)=>({plant:f,index:g})).filter(f=>f.plant&&K(f.plant,f.index,this.rack,e,l,t)),m=8,u=4;let c=0;for(let f=0;f<m;f++){const g=.38+f*.36,x=new s.Mesh(new s.TorusGeometry(.42,.012,8,48),new s.MeshStandardMaterial({color:5398874,roughness:.48,metalness:.35}));x.rotation.x=Math.PI/2,x.position.y=g,a.add(x);for(let S=0;S<u;S++){const F=S*Math.PI/2+(f%2?Math.PI/4:0),w=h[c]||null;this.addPod(a,F,g,(w==null?void 0:w.plant)||null,(w==null?void 0:w.index)??e*100+c,f,S),w!=null&&w.plant&&(a.userData.plants.push(w.plant),c+=1)}}a.userData.status=q(a.userData.plants);const p=this.createTextSprite(String(t.label||`ZONE ${n}`).toUpperCase(),{bg:"rgba(9,18,13,.88)",fg:"#a3e635",border:"#315d3e",font:"900 30px Inter, system-ui, sans-serif"});p.position.set(0,3.63,0),p.scale.set(.68,.18,1),a.add(p),this.farmGroup.add(a),this.interactiveRoots.push(a)},addPod(t,e,n,a,i,r,o){const l=Math.cos(e)*.48,h=Math.sin(e)*.48,m=(a==null?void 0:a.status)||"empty",u=Z(m),c={index:i,tier:t.userData.zoneIndex+1,slot:r*4+o+1,plant:a,tower:t},p=new s.MeshStandardMaterial({color:a?16317180:2437676,roughness:.52,metalness:a?.08:.18}),f=new s.Mesh(new s.CylinderGeometry(.155,.12,.11,20),p);f.position.set(l,n,h),f.rotation.z=Math.PI/2,f.rotation.y=-e,f.castShadow=!0,f.userData.slot=c,f.userData.root=t,t.add(f);const g=new s.Mesh(new s.SphereGeometry(.045,12,8),new s.MeshStandardMaterial({color:u,emissive:u,emissiveIntensity:a?.38:.06}));g.position.set(l*1.1,n+.085,h*1.1),g.userData.slot=c,g.userData.root=t,t.add(g),a&&this.addPlantCluster(t,l*1.1,n+.12,h*1.1,a)},addPlantCluster(t,e,n,a,i){const r=X(i),o=new s.MeshStandardMaterial({color:3100976,roughness:.7}),d=new s.MeshStandardMaterial({color:r.color,roughness:.72,side:s.DoubleSide}),l=new s.MeshStandardMaterial({color:r.alt,roughness:.72,side:s.DoubleSide}),h=new s.Mesh(new s.CylinderGeometry(.008,.01,.15,6),o);h.position.set(e,n+.055,a),t.add(h);for(let m=0;m<7;m++){const u=Math.PI*2/7*m,c=r.spread+Math.random()*.025,p=new s.Mesh(new s.SphereGeometry(r.leaf,8,5),m%2?d:l);p.scale.set(1.4,.36,.82),p.position.set(e+Math.cos(u)*c,n+.12+m%3*.012,a+Math.sin(u)*c),p.rotation.set(-.45+Math.random()*.18,u,.18),p.castShadow=!0,t.add(p)}if(r.fruit)for(let m=0;m<2;m++){const u=Math.PI*m+.55,c=new s.Mesh(new s.SphereGeometry(.032,10,8),new s.MeshStandardMaterial({color:r.fruit,roughness:.55}));c.position.set(e+Math.cos(u)*.07,n+.105,a+Math.sin(u)*.07),t.add(c)}if(r.vine){const m=new s.Mesh(new s.CylinderGeometry(.006,.004,.34,5),new s.MeshStandardMaterial({color:r.color,roughness:.72}));m.position.set(e+.06,n-.02,a+.05),m.rotation.z=.25,t.add(m)}},addIrrigationPipes(t){const e=new s.MeshStandardMaterial({color:5605546,roughness:.28,metalness:.6}),n=new s.MeshStandardMaterial({color:9358054,roughness:.25,metalness:.55});[...new Set(t.map(i=>i.z))].forEach(i=>{const r=t.filter(h=>h.z===i),o=Math.min(...r.map(h=>h.x))-.8,d=Math.max(...r.map(h=>h.x))+.8,l=new s.Mesh(new s.CylinderGeometry(.035,.035,d-o,10),e);l.rotation.z=Math.PI/2,l.position.set((o+d)/2,3.35,i+.25),this.scene.add(l)}),t.forEach(i=>{const r=new s.Mesh(new s.CylinderGeometry(.02,.02,2.75,8),e);r.position.set(i.x+.28,1.9,i.z+.25),this.scene.add(r);const o=new s.Mesh(new s.SphereGeometry(.055,10,8),n);o.position.set(i.x+.28,3.28,i.z+.25),this.scene.add(o)})},addNutrientStation(){const t=new s.MeshStandardMaterial({color:2780750,roughness:.35,metalness:.15}),e=new s.MeshStandardMaterial({color:2054718,roughness:.4,metalness:.2});["N","P","K","pH"].forEach((a,i)=>{const r=-3+i*2,o=new s.Group;o.userData={isTank:!0,label:a,status:i===3&&V(this.sensorSnapshot)?"warning":"healthy"};const d=new s.Mesh(new s.CylinderGeometry(.42,.42,1.05,18),t);d.position.set(r,.58,-5.75),d.castShadow=!0,o.add(d);const l=new s.Mesh(new s.CylinderGeometry(.45,.42,.07,18),e);l.position.set(r,1.14,-5.75),o.add(l);const h=this.createTextSprite(a,{bg:"rgba(255,255,255,.92)",fg:"#0f172a",font:"900 34px Inter, system-ui, sans-serif"});h.position.set(r,.58,-5.28),h.scale.set(.22,.1,1),o.add(h),this.scene.add(o),this.interactiveRoots.push(o)})},addControlPanel(){const t=new s.MeshStandardMaterial({color:5593943,roughness:.5,metalness:.3}),e=new s.Mesh(new s.BoxGeometry(1.7,.08,.65),t);e.position.set(0,.86,5.75),e.castShadow=!0,this.scene.add(e);const n=new s.MeshStandardMaterial({color:464909,emissive:2062914,emissiveIntensity:.75,roughness:.12,metalness:.42}),a=new s.Mesh(new s.BoxGeometry(.95,.56,.04),n);a.position.set(0,1.38,5.45),a.castShadow=!0,this.scene.add(a);const i=this.createTextSprite("CONTROL",{bg:"rgba(9,18,13,.86)",fg:"#a3e635",font:"900 26px Inter, system-ui, sans-serif"});i.position.set(0,1.82,5.4),i.scale.set(.42,.13,1),this.scene.add(i)},addVentilationFans(){const t=new s.MeshStandardMaterial({color:2042167,roughness:.36,metalness:.55});[-7.3,7.3].forEach(e=>{const n=new s.Group;n.position.set(e,2.8,-5.9),n.userData.isFan=!0;const a=new s.Mesh(new s.TorusGeometry(.34,.025,8,32),t);n.add(a);for(let i=0;i<4;i++){const r=new s.Mesh(new s.BoxGeometry(.48,.045,.018),t);r.rotation.z=i*Math.PI/4,r.userData.isFanBlade=!0,n.add(r)}this.scene.add(n)})},addWaterDrips(t){const e=new s.MeshStandardMaterial({color:3718648,emissive:3718648,emissiveIntensity:.5,transparent:!0,opacity:.85});t.forEach((n,a)=>{if(a%2)return;const i=new s.Mesh(new s.SphereGeometry(.025,8,6),e.clone());i.position.set(n.x+.25,2.9,n.z+.28),i.userData.isDrip=!0,i.userData.baseY=i.position.y,this.scene.add(i)})},addParticles(){const e=new Float32Array(1080),n=new Float32Array(360*3);for(let r=0;r<360;r++)e[r*3]=(Math.random()-.5)*15,e[r*3+1]=Math.random()*4.4+.7,e[r*3+2]=(Math.random()-.5)*11,n[r*3]=(Math.random()-.5)*.002,n[r*3+1]=(Math.random()-.5)*.001,n[r*3+2]=(Math.random()-.5)*.002;const a=new s.BufferGeometry;a.setAttribute("position",new s.BufferAttribute(e,3));const i=new s.PointsMaterial({color:16777215,size:.028,transparent:!0,opacity:.28,depthWrite:!1,blending:s.AdditiveBlending});this.particles=new s.Points(a,i),this.particles.userData.velocities=n,this.scene.add(this.particles)},createOverlays(){var n;const t=this.slotPlants.filter(Boolean).length;this.detailPanel=document.createElement("div"),this.detailPanel.className="cf-overlay cf-info-panel",this.detailPanel.innerHTML=I({title:((n=this.farm)==null?void 0:n.name)||M.farmName||"Commercial Farm",subtitle:`${this.rack.label} · ${t}/${this.rack.total} planted`,status:T(this.slotPlants,this.sensorSnapshot),mode:"Facility overview"}),this.parent.appendChild(this.detailPanel),this.tooltip=document.createElement("div"),this.tooltip.className="cf-tooltip",this.tooltip.innerHTML='<span class="cf-tooltip-dot"></span><div><strong>Hover a tower</strong><small>Click to inspect rack details</small></div>',this.parent.appendChild(this.tooltip);const e=document.createElement("div");e.className="cf-overlay cf-legend",e.innerHTML=`
            <span><i class="ok"></i>Healthy</span>
            <span><i class="warn"></i>Warning</span>
            <span><i class="danger"></i>Critical</span>
            <span class="cf-legend-help">Drag rotate · Wheel / +/- zoom · Double click fullscreen</span>
        `,this.parent.appendChild(e),this.fullscreenButton=document.createElement("button"),this.fullscreenButton.type="button",this.fullscreenButton.className="cf-expand-btn",this.fullscreenButton.textContent="EXPAND",this.fullscreenButton.addEventListener("click",a=>{a.stopPropagation(),this.toggleFullscreen()}),this.parent.appendChild(this.fullscreenButton),this.zoomControls=document.createElement("div"),this.zoomControls.className="cf-zoom-controls",this.zoomControls.innerHTML=`
            <button type="button" data-zoom="in" aria-label="Zoom in">+</button>
            <button type="button" data-zoom="out" aria-label="Zoom out">-</button>
            <button type="button" data-zoom="reset" aria-label="Reset view">RESET</button>
        `,this.zoomControls.addEventListener("click",a=>{const i=a.target.closest("button[data-zoom]");i&&(a.preventDefault(),a.stopPropagation(),i.dataset.zoom==="in"&&this.zoomCamera(.82),i.dataset.zoom==="out"&&this.zoomCamera(1.22),i.dataset.zoom==="reset"&&this.resetCamera())}),this.parent.appendChild(this.zoomControls)},bindEvents(){this.resizeHandler=()=>this.resize(),window.addEventListener("resize",this.resizeHandler),this.fullscreenHandler=()=>{this.syncExpandButton(),setTimeout(()=>this.resize(),80)},document.addEventListener("fullscreenchange",this.fullscreenHandler),this.canvas.addEventListener("pointermove",this.onPointerMove),this.canvas.addEventListener("click",this.onClick),this.canvas.addEventListener("dblclick",this.onDoubleClick),this.canvas.addEventListener("wheel",this.onWheel,{passive:!1})},onPointerMove:null,onClick:null,onDoubleClick:null,onWheel:null,installHandlers(){this.onPointerMove=t=>this.handlePointerMove(t),this.onClick=t=>this.handleClick(t),this.onDoubleClick=()=>this.toggleFullscreen(),this.onWheel=t=>this.handleWheel(t)},handlePointerMove(t){const e=this.pickRoot(t);e!==this.hoverRoot&&(this.hoverRoot&&this.hoverRoot!==this.selectedRoot&&this.setHighlight(this.hoverRoot,!1),this.hoverRoot=e,this.hoverRoot&&this.hoverRoot!==this.selectedRoot&&this.setHighlight(this.hoverRoot,!0)),this.canvas.style.cursor=e?"pointer":"grab",this.updateTooltip(e)},handleClick(t){const e=this.pickRoot(t);if(!e){this.selectedRoot&&this.setHighlight(this.selectedRoot,!1),this.selectedRoot=null,this.showOverview();return}this.selectedRoot&&this.selectedRoot!==e&&this.setHighlight(this.selectedRoot,!1),this.selectedRoot=e,this.setHighlight(e,!0,!0),this.showRootDetail(e)},handleWheel(t){!this.camera||!this.controls||(t.preventDefault(),t.stopPropagation(),this.zoomCamera(t.deltaY>0?1.12:.88))},zoomCamera(t){var d,l;if(!this.camera||!this.controls)return;const e=this.controls.target,n=this.camera.position.clone().sub(e),a=n.length()||1,i=(d=this.parent)!=null&&d.classList.contains("cf-expanded")?2.4:2.8,r=(l=this.parent)!=null&&l.classList.contains("cf-expanded")?24:18,o=s.MathUtils.clamp(a*t,i,r);n.setLength(o),this.camera.position.copy(e).add(n),this.controls.update()},resetCamera(){var t;this.setCameraFrame((t=this.parent)==null?void 0:t.classList.contains("cf-expanded"))},setCameraFrame(t=!1){!this.camera||!this.controls||(t?(this.camera.fov=38,this.camera.position.set(.35,18.5,.35),this.controls.target.set(0,0,0),this.controls.minPolarAngle=Math.PI*.015,this.controls.maxPolarAngle=Math.PI*.18):(this.camera.fov=58,this.camera.position.set(5.5,4.6,8.5),this.controls.target.set(0,1.55,0),this.controls.minPolarAngle=0,this.controls.maxPolarAngle=Math.PI*.48),this.camera.updateProjectionMatrix(),this.controls.update())},pickRoot(t){var r,o;const e=this.canvas.getBoundingClientRect();this.pointer.x=(t.clientX-e.left)/e.width*2-1,this.pointer.y=-((t.clientY-e.top)/e.height)*2+1,this.raycaster.setFromCamera(this.pointer,this.camera);const n=[];this.interactiveRoots.forEach(d=>d.traverse(l=>{l.isMesh&&n.push(l)}));const a=(r=this.raycaster.intersectObjects(n,!1)[0])==null?void 0:r.object;if(!a)return null;let i=a;for(;i;){if(this.interactiveRoots.includes(i))return i;if((o=i.userData)!=null&&o.root&&this.interactiveRoots.includes(i.userData.root))return i.userData.root;i=i.parent}return null},setHighlight(t,e,n=!1){const a=n?new s.Color(3718648):new s.Color(10741301),i=n?.65:.32;t.traverse(r=>{var o;!r.isMesh||!((o=r.material)!=null&&o.emissive)||(r.userData.originalEmissive||(r.userData.originalEmissive=r.material.emissive.clone(),r.userData.originalIntensity=r.material.emissiveIntensity||0),e?(r.material.emissive.copy(a),r.material.emissiveIntensity=i):(r.material.emissive.copy(r.userData.originalEmissive),r.material.emissiveIntensity=r.userData.originalIntensity))})},updateTooltip(t){if(!this.tooltip)return;if(!t){this.tooltip.innerHTML='<span class="cf-tooltip-dot"></span><div><strong>Hover a tower</strong><small>Click to inspect rack details</small></div>';return}const e=t.userData||{},n=Array.isArray(e.plants)?e.plants.length:0;this.tooltip.innerHTML=`
            <span class="cf-tooltip-dot ${e.status||"healthy"}"></span>
            <div><strong>${b(e.label||e.label||"Station")}</strong><small>${n?`${n} active plants`:e.isTank?"Nutrient station":"Empty zone"}</small></div>
        `},showOverview(){var e;const t=this.slotPlants.filter(Boolean).length;this.detailPanel.innerHTML=I({title:((e=this.farm)==null?void 0:e.name)||M.farmName||"Commercial Farm",subtitle:`${this.rack.label} · ${t}/${this.rack.total} planted`,status:T(this.slotPlants,this.sensorSnapshot),mode:"Facility overview"})},showRootDetail(t){const e=t.userData||{};if(e.isTank){this.detailPanel.innerHTML=J(e,this.sensorSnapshot);return}const n=Array.isArray(e.plants)?e.plants:[];this.detailPanel.innerHTML=j(e,n,this.sensorSnapshot)},async toggleFullscreen(){if(!this.parent)return;!this.parent.classList.contains("cf-expanded")?this.enterExpandedView():this.exitExpandedView()},enterExpandedView(){!this.parent||this.parent.classList.contains("cf-expanded")||(this.originalParent=this.parent.parentNode,this.originalNextSibling=this.parent.nextSibling,document.body.appendChild(this.parent),this.parent.classList.add("cf-expanded"),document.documentElement.classList.add("cf-expanded-lock"),document.body.classList.add("cf-expanded-lock"),this.syncExpandButton(),this.setCameraFrame(!0),requestAnimationFrame(()=>this.resize()),setTimeout(()=>this.resize(),120))},exitExpandedView(){this.parent&&(this.parent.classList.remove("cf-expanded"),document.documentElement.classList.remove("cf-expanded-lock"),document.body.classList.remove("cf-expanded-lock"),this.restoreHostPlacement(),this.syncExpandButton(),this.setCameraFrame(!1),requestAnimationFrame(()=>this.resize()),setTimeout(()=>this.resize(),120))},restoreHostPlacement(){!this.parent||!this.originalParent||(this.originalNextSibling&&this.originalNextSibling.parentNode===this.originalParent?this.originalParent.insertBefore(this.parent,this.originalNextSibling):this.originalParent.appendChild(this.parent),this.originalParent=null,this.originalNextSibling=null)},syncExpandButton(){!this.fullscreenButton||!this.parent||(this.fullscreenButton.textContent=this.parent.classList.contains("cf-expanded")?"CLOSE":"EXPAND")},resize(){var o,d;if(!this.canvas||!this.renderer||!this.camera)return;const t=(o=this.parent)==null?void 0:o.classList.contains("cf-expanded"),e=(d=this.parent)==null?void 0:d.classList.contains("commercial-command-screen"),n=t||e;e&&(D(this.parent,{position:"fixed",inset:"0",width:"100vw",height:"100vh",minHeight:"100vh",overflow:"hidden",borderRadius:"0"}),D(this.canvas,{position:"fixed",inset:"0",width:"100vw",height:"100vh",minHeight:"100vh",display:"block",borderRadius:"0"}));const a=this.canvas.getBoundingClientRect(),i=n?window.innerWidth||document.documentElement.clientWidth||a.width||1280:Math.max(320,a.width||this.parent.clientWidth||640),r=n?window.innerHeight||document.documentElement.clientHeight||a.height||720:Math.max(300,a.height||420);this.renderer.setSize(i,r,!1),this.camera.aspect=i/r,this.camera.updateProjectionMatrix()},animate(){var e,n;const t=Math.min(.04,((n=(e=this.clock)==null?void 0:e.getDelta)==null?void 0:n.call(e))||.016);this.frame+=1,this.controls&&this.controls.update(),this.updateParticles(),this.scene.traverse(a=>{var i,r;(i=a.userData)!=null&&i.isFanBlade&&(a.rotation.z+=4.8*t),(r=a.userData)!=null&&r.isDrip&&(a.position.y-=.55*t,a.position.y<.7&&(a.position.y=a.userData.baseY))}),this.renderer&&this.scene&&this.camera&&this.renderer.render(this.scene,this.camera),this.rafId=requestAnimationFrame(()=>this.animate())},updateParticles(){if(!this.particles)return;const t=this.particles.geometry.attributes.position,e=this.particles.userData.velocities;for(let n=0;n<t.count;n++)t.array[n*3]+=e[n*3],t.array[n*3+1]+=e[n*3+1],t.array[n*3+2]+=e[n*3+2],t.array[n*3]>7.5&&(t.array[n*3]=-7.5),t.array[n*3]<-7.5&&(t.array[n*3]=7.5),t.array[n*3+1]>5.4&&(t.array[n*3+1]=.7),t.array[n*3+2]>5.5&&(t.array[n*3+2]=-5.5),t.array[n*3+2]<-5.5&&(t.array[n*3+2]=5.5);t.needsUpdate=!0},createTextSprite(t,e={}){const n=document.createElement("canvas");n.width=512,n.height=128;const a=n.getContext("2d");a.clearRect(0,0,n.width,n.height),U(a,18,22,n.width-36,84,28),a.fillStyle=e.bg||"rgba(12,20,14,.9)",a.fill(),e.border&&(a.strokeStyle=e.border,a.lineWidth=4,a.stroke()),a.fillStyle=e.fg||"#ffffff",a.font=e.font||"900 30px Inter, system-ui, sans-serif",a.textAlign="center",a.textBaseline="middle",a.fillText(t,n.width/2,66);const i=new s.CanvasTexture(n);i.colorSpace=s.SRGBColorSpace;const r=new s.SpriteMaterial({map:i,transparent:!0,depthWrite:!1}),o=new s.Sprite(r);return o.userData.texture=i,o},destroy(){var t;this.rafId&&cancelAnimationFrame(this.rafId),this.rafId=null,this.resizeHandler&&window.removeEventListener("resize",this.resizeHandler),this.fullscreenHandler&&document.removeEventListener("fullscreenchange",this.fullscreenHandler),this.canvas&&this.onPointerMove&&this.canvas.removeEventListener("pointermove",this.onPointerMove),this.canvas&&this.onClick&&this.canvas.removeEventListener("click",this.onClick),this.canvas&&this.onDoubleClick&&this.canvas.removeEventListener("dblclick",this.onDoubleClick),this.canvas&&this.onWheel&&this.canvas.removeEventListener("wheel",this.onWheel),this.controls&&this.controls.dispose(),this.scene&&this.scene.traverse(e=>{var n;e.geometry&&e.geometry.dispose(),(n=e.userData)!=null&&n.texture&&e.userData.texture.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(a=>a.dispose()):e.material.dispose())}),this.renderer&&this.renderer.dispose(),(t=this.parent)!=null&&t.classList.contains("cf-expanded")&&this.exitExpandedView(),this.parent&&(this.parent.classList.remove("cf-expanded"),this.parent.querySelectorAll(".cf-overlay, .cf-tooltip, .cf-expand-btn, .cf-zoom-controls").forEach(e=>e.remove()),this.parent.classList.remove("commercial-farm-host")),document.documentElement.classList.remove("cf-expanded-lock"),document.body.classList.remove("cf-expanded-lock"),this.canvas=null,this.parent=null,this.renderer=null,this.scene=null,this.camera=null,this.controls=null,this.farmGroup=null,this.particles=null,this.raycaster=null,this.pointer=null,this.interactiveRoots=[],this.hoverRoot=null,this.selectedRoot=null,this.detailPanel=null,this.tooltip=null,this.fullscreenButton=null,this.zoomControls=null,this.originalParent=null,this.originalNextSibling=null,this.resizeHandler=null,this.fullscreenHandler=null,this.onPointerMove=null,this.onClick=null,this.onDoubleClick=null,this.onWheel=null}};function G(){const t=A();return M.currentFarm||t.find(e=>e.id===M.currentFarmId)||t[t.length-1]||null}function A(){try{return JSON.parse(localStorage.getItem(N))||[]}catch{return[]}}function $(t){if(k(t).length){const n=k(t).length;return{id:"commercial-zones",label:`${n}-Zone Commercial Farm`,tiers:n,slotsPerTier:12,total:Math.max(12,n*12)}}const e=String((t==null?void 0:t.rackTypeId)||(t==null?void 0:t.rackType)||(t==null?void 0:t.rackLabel)||"").toLowerCase();return e.includes("2")?y["2-tier"]:e.includes("4")?y["4-tier"]:e.includes("5")?y["5-tier"]:e.includes("wall")||e.includes("grid")?y.wall:e.includes("frame")?y["a-frame"]:e.includes("nft")||e.includes("channel")?y["nft-channel"]:e.includes("hanging")||e.includes("column")?y.hanging:y["3-tier"]}function B(t,e){const n=Array.isArray(t==null?void 0:t.plants)?t.plants:[],a=k(t),i=a.length?Math.max(e.total,a.length*12,n.length*3):e.total,r=Array(i).fill(null),o=new Set;if(n.forEach((l,h)=>{var u;if(a.length&&l.zoneId){const c=a.findIndex(g=>W(g,l)),p=Math.max(0,c)*12,f=Math.max(1,Number.parseInt(l.slots||l.count||1,10)||1);for(let g=0;g<f;g++){const x=O(r,o,p,p+12)??L(r,o);if(x===-1||x===null||x===void 0)return;r[x]=P(l,x,e,t),r[x].zoneId=l.zoneId,r[x].zoneName=l.zoneName||((u=a[c])==null?void 0:u.name)||l.zoneId,o.add(x)}return}if(l.slotIndex!==void 0&&l.slotIndex!==null){const c=Number(l.slotIndex);Number.isInteger(c)&&c>=0&&c<r.length&&(r[c]=P(l,c,e,t),o.add(c));return}const m=Math.max(1,Number.parseInt(l.slots||l.count||1,10)||1);for(let c=0;c<m;c++){const p=L(r,o);if(p===-1)return;r[p]=P(l,p,e,t),o.add(p)}}),r.some(Boolean))return r;const d=Math.min(e.total,Number.parseInt((t==null?void 0:t.plantSlots)||(t==null?void 0:t.plants)||0,10)||0);for(let l=0;l<d;l++)r[l]=P({name:(t==null?void 0:t.targetPlant)||"Plant",status:"healthy"},l,e,t);return r}function k(t){var n;return(Array.isArray(t==null?void 0:t.zones)?t.zones:Array.isArray((n=t==null?void 0:t.commercialStructure)==null?void 0:n.zones)?t.commercialStructure.zones:[]).map((a,i)=>({...a,zone_id:a.zone_id||a.id||`zone_${String.fromCharCode(65+i)}`,name:a.name||`Zone ${String.fromCharCode(65+i)}`})).filter(a=>a.zone_id||a.name)}function W(t,e){const n=String(e.zoneId||e.zone_id||e.zone||"").toLowerCase();return n&&(n===String(t.zone_id||"").toLowerCase()||n===String(t.id||"").toLowerCase()||n===String(t.name||"").toLowerCase())}function O(t,e,n,a){const i=Math.max(0,n),r=Math.min(t.length,a);for(let o=i;o<r;o++)if(!t[o]&&!e.has(o))return o;return null}function P(t,e,n,a){const i=t.name||(a==null?void 0:a.targetPlant)||"Plant";return{name:i,emoji:t.emoji||Q(i),species:t.species||R(i),status:t.status||_(t.growth),growth:Number(t.growth??70),days:Number(t.days??0),slotIndex:e,tier:Math.floor(e/n.slotsPerTier)+1,position:e%n.slotsPerTier+1}}function L(t,e){for(let n=0;n<t.length;n++)if(!t[n]&&!e.has(n))return n;return-1}function _(t){const e=Number(t??80);return e<35?"danger":e<60?"warning":"healthy"}function Z(t){return t==="danger"?15680580:t==="warning"?16096779:t==="empty"?6583435:8702998}function q(t){return t.length?t.some(e=>e.status==="danger")?"danger":t.some(e=>e.status==="warning")?"warning":"healthy":"empty"}function T(t,e){return t.some(Boolean)&&t.some(n=>(n==null?void 0:n.status)==="danger")?"Critical plant risk":Number(e.gasRaw||0)>2500||Number(e.temperature||25)>35?"Automation alert":t.some(n=>(n==null?void 0:n.status)==="warning")?"Needs review":"Operational"}function z(){var e,n,a,i,r,o;const t=M.sensors||{};return{temperature:((e=t.temp)==null?void 0:e.val)??25,humidity:((n=t.humid)==null?void 0:n.val)??60,lightRaw:((a=t.light)==null?void 0:a.val)??2e3,ph:((i=t.ph)==null?void 0:i.val)??6.1,waterDistanceCm:((r=t.water)==null?void 0:r.val)??10,gasRaw:((o=t.nutrient)==null?void 0:o.val)??1e3}}function V(t){const e=Number(t.ph??6.1);return e<5.5||e>6.5}function X(t){const e=R((t==null?void 0:t.species)||(t==null?void 0:t.name)||"plant"),n=C[e];if(n)return n;const a=Object.keys(C).find(i=>e.includes(i));return C[a]||C.plant}function Y(t,e,n,a){return Number.isNaN(t)?!1:t%a===n||Math.floor(t/Math.max(1,e.slotsPerTier))===n}function K(t,e,n,a,i,r={}){return t!=null&&t.zoneId&&r.zoneId?String(t.zoneId).toLowerCase()===String(r.zoneId).toLowerCase():t!=null&&t.zoneName&&r.label?String(t.zoneName).toLowerCase()===String(r.label).toLowerCase():Y(e,n,a,i)}function E(t,e,n){const a=new s.BufferGeometry().setFromPoints([new s.Vector3(...t),new s.Vector3(...e)]);return new s.Line(a,n)}function U(t,e,n,a,i,r){t.beginPath(),t.moveTo(e+r,n),t.lineTo(e+a-r,n),t.quadraticCurveTo(e+a,n,e+a,n+r),t.lineTo(e+a,n+i-r),t.quadraticCurveTo(e+a,n+i,e+a-r,n+i),t.lineTo(e+r,n+i),t.quadraticCurveTo(e,n+i,e,n+i-r),t.lineTo(e,n+r),t.quadraticCurveTo(e,n,e+r,n),t.closePath()}function I({title:t,subtitle:e,status:n,mode:a}){return`
        <div class="cf-panel-kicker">${b(a)}</div>
        <div class="cf-panel-title">${b(t)}</div>
        <div class="cf-panel-sub">${b(e)}</div>
        <div class="cf-mini-grid">
            ${v("Status",n)}
            ${v("Light",`${Math.round(Number(z().lightRaw||0))}`)}
            ${v("pH",`${Number(z().ph||0).toFixed(1)}`)}
        </div>
    `}function j(t,e,n){const a=e.filter(o=>o.status==="healthy").length,i=e.filter(o=>o.status==="warning").length,r=e.filter(o=>o.status==="danger").length;return`
        <div class="cf-panel-kicker">Selected production zone</div>
        <div class="cf-panel-title">${b(t.label||"Zone")}</div>
        <div class="cf-panel-sub">${e.length||0} active plants · ${b(t.status||"empty")}</div>
        <div class="cf-mini-grid">
            ${v("Healthy",a)}
            ${v("Warning",i)}
            ${v("Critical",r)}
            ${v("Temp",`${Number(n.temperature||0).toFixed(1)}C`)}
        </div>
        <div class="cf-plant-list">
            ${e.slice(0,5).map(o=>`<span>${b(o.name)} <b>${b(o.status)}</b></span>`).join("")||"<span>No assigned crop yet</span>"}
        </div>
    `}function J(t,e){return`
        <div class="cf-panel-kicker">Nutrient station</div>
        <div class="cf-panel-title">${b(t.label||"Tank")} Tank</div>
        <div class="cf-panel-sub">Linked to commercial automation controls</div>
        <div class="cf-mini-grid">
            ${v("pH",`${Number(e.ph||0).toFixed(1)}`)}
            ${v("Water",`${Number(e.waterDistanceCm||0)}cm`)}
            ${v("Status",b(t.status||"healthy"))}
        </div>
    `}function v(t,e){return`<div class="cf-mini-metric"><span>${b(t)}</span><strong>${b(e)}</strong></div>`}function Q(t=""){const e=String(t).toLowerCase();return e.includes("lettuce")||e.includes("cabbage")||e.includes("kale")?"🥬":e.includes("tomato")?"🍅":e.includes("chili")||e.includes("pepper")?"🌶️":e.includes("strawberry")?"🍓":e.includes("cucumber")?"🥒":e.includes("carrot")?"🥕":e.includes("eggplant")?"🍆":e.includes("basil")||e.includes("mint")||e.includes("spinach")?"🌿":"🌱"}function R(t=""){return String(t||"plant").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function b(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function D(t,e){t&&Object.entries(e).forEach(([n,a])=>{const i=n.replace(/[A-Z]/g,r=>"-"+r.toLowerCase());t.style.setProperty(i,a,"important")})}function tt(){if(document.getElementById("commercial-farm-canvas-style"))return;const t=document.createElement("style");t.id="commercial-farm-canvas-style",t.textContent=`
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
    `,document.head.appendChild(t)}export{at as CommercialFarmCanvas};
