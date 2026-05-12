import { AppState } from '../store.js';
import * as THREE from 'https://esm.sh/three@0.160.0';
import { OrbitControls } from 'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const FARMS_STORAGE_KEY = 'user_farms';

const RACK_OPTIONS = {
    '2-tier': { id: '2-tier', label: '2-Tier Starter Rack', tiers: 2, slotsPerTier: 3, total: 6 },
    '3-tier': { id: '3-tier', label: '3-Tier Vertical Rack', tiers: 3, slotsPerTier: 3, total: 9 },
    '4-tier': { id: '4-tier', label: '4-Tier Grow Shelf', tiers: 4, slotsPerTier: 4, total: 16 },
    '5-tier': { id: '5-tier', label: '5-Tier Tower Rack', tiers: 5, slotsPerTier: 4, total: 20 },
    wall: { id: 'wall', label: 'Wall Panel Grid', tiers: 4, slotsPerTier: 5, total: 20 },
    'a-frame': { id: 'a-frame', label: 'A-Frame Pyramid', tiers: 4, slotsPerTier: 4, total: 16 },
    'nft-channel': { id: 'nft-channel', label: 'NFT Channel Rows', tiers: 3, slotsPerTier: 6, total: 18 },
    hanging: { id: 'hanging', label: 'Hanging Column Farm', tiers: 5, slotsPerTier: 3, total: 15 },
};

const SPECIES = {
    lettuce: { color: 0x69b34c, alt: 0x8ccf61, leaf: 0.082, spread: 0.095 },
    cabbage: { color: 0x71a83b, alt: 0xa3c957, leaf: 0.09, spread: 0.1 },
    kale: { color: 0x2f6f3e, alt: 0x4f8d4e, leaf: 0.088, spread: 0.105 },
    spinach: { color: 0x2e7d32, alt: 0x43a047, leaf: 0.072, spread: 0.088 },
    basil: { color: 0x1f8a4c, alt: 0x32b667, leaf: 0.064, spread: 0.078 },
    mint: { color: 0x34a853, alt: 0x6fcf75, leaf: 0.062, spread: 0.078 },
    tomato: { color: 0x2f8f46, alt: 0xef4444, leaf: 0.07, spread: 0.086, fruit: 0xef4444 },
    chili: { color: 0x267f3d, alt: 0xdc2626, leaf: 0.066, spread: 0.082, fruit: 0xdc2626 },
    pepper: { color: 0x267f3d, alt: 0xdc2626, leaf: 0.066, spread: 0.082, fruit: 0xdc2626 },
    cucumber: { color: 0x237a3c, alt: 0x50a45b, leaf: 0.078, spread: 0.105, vine: true },
    strawberry: { color: 0x3f8f49, alt: 0xfb7185, leaf: 0.066, spread: 0.082, fruit: 0xfb7185 },
    eggplant: { color: 0x2f7f4f, alt: 0x7c3aed, leaf: 0.072, spread: 0.088, fruit: 0x7c3aed },
    plant: { color: 0x65a30d, alt: 0x86efac, leaf: 0.072, spread: 0.09 },
};

export const CommercialFarmCanvas = {
    canvas: null,
    parent: null,
    renderer: null,
    scene: null,
    camera: null,
    controls: null,
    farmGroup: null,
    particles: null,
    raycaster: null,
    pointer: null,
    interactiveRoots: [],
    hoverRoot: null,
    selectedRoot: null,
    detailPanel: null,
    tooltip: null,
    fullscreenButton: null,
    resizeHandler: null,
    fullscreenHandler: null,
    rafId: null,
    clock: null,
    frame: 0,
    farm: null,
    rack: RACK_OPTIONS['3-tier'],
    slotPlants: [],
    sensorSnapshot: {},

    init(selector) {
        this.destroy();
        this.installHandlers();
        ensureCommercialStyles();

        this.canvas = document.getElementById(selector);
        if (!this.canvas) return;
        this.parent = this.canvas.parentElement;
        if (!this.parent) return;

        this.farm = getCurrentFarm();
        this.rack = resolveRack(this.farm);
        this.slotPlants = resolveSlotPlants(this.farm, this.rack);
        this.sensorSnapshot = getSensorSnapshot();
        this.clock = new THREE.Clock();

        this.prepareHost();
        this.initScene();
        this.buildFacility();
        this.createOverlays();
        this.bindEvents();
        this.resize();
        this.animate();
    },

    prepareHost() {
        this.parent.classList.add('commercial-farm-host');
        this.canvas.classList.add('commercial-farm-canvas');
        this.parent.querySelectorAll('.cf-overlay, .cf-tooltip, .cf-expand-btn').forEach(node => node.remove());
    },

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x07110c);
        this.scene.fog = new THREE.Fog(0x07110c, 14, 42);

        this.camera = new THREE.PerspectiveCamera(58, 1, 0.1, 120);
        this.camera.position.set(5.5, 4.6, 8.5);
        this.camera.lookAt(0, 1.8, 0);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            powerPreference: 'high-performance',
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.08;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.07;
        this.controls.enablePan = true;
        this.controls.enableZoom = true;
        this.controls.minDistance = 3.2;
        this.controls.maxDistance = 18;
        this.controls.maxPolarAngle = Math.PI * 0.48;
        this.controls.target.set(0, 1.55, 0);
        this.controls.update();

        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.farmGroup = new THREE.Group();
        this.scene.add(this.farmGroup);

        this.addLighting();
    },

    addLighting() {
        this.scene.add(new THREE.AmbientLight(0xdceee0, 0.55));

        const sun = new THREE.DirectionalLight(0xfff8e7, 2.2);
        sun.position.set(10, 18, 9);
        sun.castShadow = true;
        sun.shadow.mapSize.set(2048, 2048);
        sun.shadow.camera.left = -12;
        sun.shadow.camera.right = 12;
        sun.shadow.camera.top = 12;
        sun.shadow.camera.bottom = -12;
        sun.shadow.bias = -0.0004;
        this.scene.add(sun);

        const fill = new THREE.DirectionalLight(0xbad7ff, 0.35);
        fill.position.set(-7, 10, -6);
        this.scene.add(fill);

        const hemi = new THREE.HemisphereLight(0xb1e1ff, 0x4b341d, 0.28);
        this.scene.add(hemi);

        const greenGlow = new THREE.PointLight(0x84cc16, 1.25, 12);
        greenGlow.position.set(0, 3.1, 0);
        this.scene.add(greenGlow);
    },

    buildFacility() {
        this.addFloor();
        this.addGreenhouseFrame();
        this.addOverheadGrowLights();

        const towers = this.createTowerLayout();
        towers.forEach((tower, index) => this.addTower(tower, index));

        this.addIrrigationPipes(towers);
        this.addNutrientStation();
        this.addControlPanel();
        this.addVentilationFans();
        this.addWaterDrips(towers);
        this.addParticles();
    },

    addFloor() {
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(18, 14),
            new THREE.MeshStandardMaterial({ color: 0x343a36, roughness: 0.86, metalness: 0.04 })
        );
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        const aisle = new THREE.Mesh(
            new THREE.PlaneGeometry(2.4, 12.6),
            new THREE.MeshStandardMaterial({ color: 0x454b45, roughness: 0.78 })
        );
        aisle.rotation.x = -Math.PI / 2;
        aisle.position.y = 0.006;
        aisle.receiveShadow = true;
        this.scene.add(aisle);

        const lineMat = new THREE.LineBasicMaterial({ color: 0x607466, transparent: true, opacity: 0.32 });
        for (let x = -8; x <= 8; x += 1) {
            this.scene.add(makeLine([x, 0.014, -6.5], [x, 0.014, 6.5], lineMat));
        }
        for (let z = -6; z <= 6; z += 1) {
            this.scene.add(makeLine([-8.5, 0.016, z], [8.5, 0.016, z], lineMat));
        }
    },

    addGreenhouseFrame() {
        const frameMat = new THREE.MeshStandardMaterial({ color: 0x5b6460, metalness: 0.72, roughness: 0.26 });
        const glassMat = new THREE.MeshPhysicalMaterial({
            color: 0xd5ffe2,
            transparent: true,
            opacity: 0.1,
            roughness: 0.04,
            side: THREE.DoubleSide,
        });
        const width = 17.6;
        const depth = 13.6;
        const wallH = 4.3;
        const roofH = 6.2;

        for (let z = -depth / 2; z <= depth / 2 + 0.001; z += 2.7) {
            [-1, 1].forEach(side => {
                const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, wallH, 10), frameMat);
                post.position.set(side * width / 2, wallH / 2, z);
                post.castShadow = true;
                this.scene.add(post);
            });

            const rafterL = Math.sqrt((width / 2) ** 2 + (roofH - wallH) ** 2);
            const angle = Math.atan2(roofH - wallH, width / 2);
            [-1, 1].forEach(side => {
                const rafter = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, rafterL, 8), frameMat);
                rafter.position.set(side * width / 4, wallH + (roofH - wallH) / 2, z);
                rafter.rotation.z = side * (Math.PI / 2 - angle);
                this.scene.add(rafter);
            });
        }

        const ridge = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, depth, 10), frameMat);
        ridge.rotation.x = Math.PI / 2;
        ridge.position.set(0, roofH, 0);
        this.scene.add(ridge);

        const back = new THREE.Mesh(new THREE.PlaneGeometry(width, wallH), glassMat);
        back.position.set(0, wallH / 2, -depth / 2);
        this.scene.add(back);

        [-1, 1].forEach(side => {
            const sidePanel = new THREE.Mesh(new THREE.PlaneGeometry(depth, wallH), glassMat);
            sidePanel.rotation.y = Math.PI / 2;
            sidePanel.position.set(side * width / 2, wallH / 2, 0);
            this.scene.add(sidePanel);
        });
    },

    addOverheadGrowLights() {
        const housingMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.5, metalness: 0.72 });
        const ledMat = new THREE.MeshStandardMaterial({
            color: 0xdd88ff,
            emissive: 0xdd88ff,
            emissiveIntensity: 0.85,
            roughness: 0.2,
        });
        [-4.8, -2.4, 2.4, 4.8].forEach(x => {
            for (let z = -4.8; z <= 4.8; z += 2.4) {
                const bar = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.16), housingMat);
                bar.position.set(x, 4.15, z);
                this.scene.add(bar);
                const led = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.025, 0.09), ledMat);
                led.position.set(x, 4.11, z);
                this.scene.add(led);
            }
        });
    },

    createTowerLayout() {
        const desired = Math.max(6, Math.min(10, Math.ceil(this.rack.total / 2)));
        const positions = [];
        const cols = Math.ceil(desired / 2);
        const startX = -((cols - 1) * 2.15) / 2;
        const rows = [-2.35, 2.35];

        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < cols; col++) {
                if (positions.length >= desired) break;
                positions.push({
                    x: startX + col * 2.15,
                    z: rows[row],
                    zoneIndex: positions.length,
                    row,
                    col,
                });
            }
        }
        return positions;
    },

    addTower(config, towerIndex) {
        const zoneLetter = String.fromCharCode(65 + towerIndex);
        const tower = new THREE.Group();
        tower.position.set(config.x, 0, config.z);
        tower.userData = {
            isTower: true,
            id: `zone-${zoneLetter}`,
            label: `Zone ${zoneLetter}`,
            zoneIndex: towerIndex,
            plants: [],
            status: 'empty',
        };

        const columnMat = new THREE.MeshStandardMaterial({ color: 0xe9edf0, roughness: 0.34, metalness: 0.18 });
        const supportMat = new THREE.MeshStandardMaterial({ color: 0x26342d, roughness: 0.5, metalness: 0.4 });
        const column = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.12, 3.2, 22), columnMat);
        column.position.y = 1.67;
        column.castShadow = true;
        tower.add(column);

        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.6, 0.15, 28), supportMat);
        base.position.y = 0.075;
        base.castShadow = true;
        tower.add(base);

        const slotsForTower = this.slotPlants
            .map((plant, index) => ({ plant, index }))
            .filter(item => item.plant && indexToTower(item.index, this.rack, towerIndex, this.createTowerLayout().length));

        const levels = 8;
        const bowlsPerLevel = 4;
        let podCounter = 0;
        for (let level = 0; level < levels; level++) {
            const y = 0.38 + level * 0.36;
            const ring = new THREE.Mesh(
                new THREE.TorusGeometry(0.42, 0.012, 8, 48),
                new THREE.MeshStandardMaterial({ color: 0x52615a, roughness: 0.48, metalness: 0.35 })
            );
            ring.rotation.x = Math.PI / 2;
            ring.position.y = y;
            tower.add(ring);

            for (let side = 0; side < bowlsPerLevel; side++) {
                const angle = side * Math.PI / 2 + (level % 2 ? Math.PI / 4 : 0);
                const source = slotsForTower[podCounter] || null;
                this.addPod(tower, angle, y, source?.plant || null, source?.index ?? (towerIndex * 100 + podCounter), level, side);
                if (source?.plant) {
                    tower.userData.plants.push(source.plant);
                    podCounter += 1;
                }
            }
        }

        tower.userData.status = towerStatus(tower.userData.plants);
        const label = this.createTextSprite(`ZONE ${zoneLetter}`, {
            bg: 'rgba(9,18,13,.88)',
            fg: '#a3e635',
            border: '#315d3e',
            font: '900 30px Inter, system-ui, sans-serif',
        });
        label.position.set(0, 3.63, 0);
        label.scale.set(0.68, 0.18, 1);
        tower.add(label);

        this.farmGroup.add(tower);
        this.interactiveRoots.push(tower);
    },

    addPod(tower, angle, y, plant, slotIndex, level, side) {
        const radius = 0.48;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const status = plant?.status || 'empty';
        const color = statusColor(status);
        const slotData = {
            index: slotIndex,
            tier: tower.userData.zoneIndex + 1,
            slot: level * 4 + side + 1,
            plant,
            tower,
        };

        const podMat = new THREE.MeshStandardMaterial({
            color: plant ? 0xf8fafc : 0x25322c,
            roughness: 0.52,
            metalness: plant ? 0.08 : 0.18,
        });
        const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.12, 0.11, 20), podMat);
        pod.position.set(x, y, z);
        pod.rotation.z = Math.PI / 2;
        pod.rotation.y = -angle;
        pod.castShadow = true;
        pod.userData.slot = slotData;
        pod.userData.root = tower;
        tower.add(pod);

        const dot = new THREE.Mesh(
            new THREE.SphereGeometry(0.045, 12, 8),
            new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: plant ? 0.38 : 0.06 })
        );
        dot.position.set(x * 1.1, y + 0.085, z * 1.1);
        dot.userData.slot = slotData;
        dot.userData.root = tower;
        tower.add(dot);

        if (plant) this.addPlantCluster(tower, x * 1.1, y + 0.12, z * 1.1, plant);
    },

    addPlantCluster(parent, x, y, z, plant) {
        const spec = speciesConfig(plant);
        const stemMat = new THREE.MeshStandardMaterial({ color: 0x2f5130, roughness: 0.7 });
        const leafMatA = new THREE.MeshStandardMaterial({ color: spec.color, roughness: 0.72, side: THREE.DoubleSide });
        const leafMatB = new THREE.MeshStandardMaterial({ color: spec.alt, roughness: 0.72, side: THREE.DoubleSide });

        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.01, 0.15, 6), stemMat);
        stem.position.set(x, y + 0.055, z);
        parent.add(stem);

        for (let i = 0; i < 7; i++) {
            const angle = (Math.PI * 2 / 7) * i;
            const radius = spec.spread + Math.random() * 0.025;
            const leaf = new THREE.Mesh(new THREE.SphereGeometry(spec.leaf, 8, 5), i % 2 ? leafMatA : leafMatB);
            leaf.scale.set(1.4, 0.36, 0.82);
            leaf.position.set(x + Math.cos(angle) * radius, y + 0.12 + (i % 3) * 0.012, z + Math.sin(angle) * radius);
            leaf.rotation.set(-0.45 + Math.random() * 0.18, angle, 0.18);
            leaf.castShadow = true;
            parent.add(leaf);
        }

        if (spec.fruit) {
            for (let i = 0; i < 2; i++) {
                const angle = Math.PI * i + 0.55;
                const fruit = new THREE.Mesh(
                    new THREE.SphereGeometry(0.032, 10, 8),
                    new THREE.MeshStandardMaterial({ color: spec.fruit, roughness: 0.55 })
                );
                fruit.position.set(x + Math.cos(angle) * 0.07, y + 0.105, z + Math.sin(angle) * 0.07);
                parent.add(fruit);
            }
        }

        if (spec.vine) {
            const vine = new THREE.Mesh(
                new THREE.CylinderGeometry(0.006, 0.004, 0.34, 5),
                new THREE.MeshStandardMaterial({ color: spec.color, roughness: 0.72 })
            );
            vine.position.set(x + 0.06, y - 0.02, z + 0.05);
            vine.rotation.z = 0.25;
            parent.add(vine);
        }
    },

    addIrrigationPipes(towers) {
        const pipeMat = new THREE.MeshStandardMaterial({ color: 0x5588aa, roughness: 0.28, metalness: 0.6 });
        const jointMat = new THREE.MeshStandardMaterial({ color: 0x8ecae6, roughness: 0.25, metalness: 0.55 });
        const rows = [...new Set(towers.map(t => t.z))];
        rows.forEach(z => {
            const rowTowers = towers.filter(t => t.z === z);
            const minX = Math.min(...rowTowers.map(t => t.x)) - 0.8;
            const maxX = Math.max(...rowTowers.map(t => t.x)) + 0.8;
            const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, maxX - minX, 10), pipeMat);
            pipe.rotation.z = Math.PI / 2;
            pipe.position.set((minX + maxX) / 2, 3.35, z + 0.25);
            this.scene.add(pipe);
        });

        towers.forEach(t => {
            const drop = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.75, 8), pipeMat);
            drop.position.set(t.x + 0.28, 1.9, t.z + 0.25);
            this.scene.add(drop);
            const joint = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), jointMat);
            joint.position.set(t.x + 0.28, 3.28, t.z + 0.25);
            this.scene.add(joint);
        });
    },

    addNutrientStation() {
        const tankMat = new THREE.MeshStandardMaterial({ color: 0x2a6e4e, roughness: 0.35, metalness: 0.15 });
        const lidMat = new THREE.MeshStandardMaterial({ color: 0x1f5a3e, roughness: 0.4, metalness: 0.2 });
        const labels = ['N', 'P', 'K', 'pH'];
        labels.forEach((label, index) => {
            const x = -3 + index * 2;
            const tank = new THREE.Group();
            tank.userData = { isTank: true, label, status: index === 3 && isPhWarning(this.sensorSnapshot) ? 'warning' : 'healthy' };

            const body = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.05, 18), tankMat);
            body.position.set(x, 0.58, -5.75);
            body.castShadow = true;
            tank.add(body);

            const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.42, 0.07, 18), lidMat);
            lid.position.set(x, 1.14, -5.75);
            tank.add(lid);

            const tag = this.createTextSprite(label, {
                bg: 'rgba(255,255,255,.92)',
                fg: '#0f172a',
                font: '900 34px Inter, system-ui, sans-serif',
            });
            tag.position.set(x, 0.58, -5.28);
            tag.scale.set(0.22, 0.1, 1);
            tank.add(tag);

            this.scene.add(tank);
            this.interactiveRoots.push(tank);
        });
    },

    addControlPanel() {
        const deskMat = new THREE.MeshStandardMaterial({ color: 0x555b57, roughness: 0.5, metalness: 0.3 });
        const desk = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.08, 0.65), deskMat);
        desk.position.set(0, 0.86, 5.75);
        desk.castShadow = true;
        this.scene.add(desk);

        const screenMat = new THREE.MeshStandardMaterial({
            color: 0x07180d,
            emissive: 0x1f7a42,
            emissiveIntensity: 0.75,
            roughness: 0.12,
            metalness: 0.42,
        });
        const screen = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.56, 0.04), screenMat);
        screen.position.set(0, 1.38, 5.45);
        screen.castShadow = true;
        this.scene.add(screen);

        const label = this.createTextSprite('CONTROL', {
            bg: 'rgba(9,18,13,.86)',
            fg: '#a3e635',
            font: '900 26px Inter, system-ui, sans-serif',
        });
        label.position.set(0, 1.82, 5.4);
        label.scale.set(0.42, 0.13, 1);
        this.scene.add(label);
    },

    addVentilationFans() {
        const fanMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.36, metalness: 0.55 });
        [-7.3, 7.3].forEach(x => {
            const fan = new THREE.Group();
            fan.position.set(x, 2.8, -5.9);
            fan.userData.isFan = true;
            const frame = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.025, 8, 32), fanMat);
            fan.add(frame);
            for (let i = 0; i < 4; i++) {
                const blade = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.045, 0.018), fanMat);
                blade.rotation.z = i * Math.PI / 4;
                blade.userData.isFanBlade = true;
                fan.add(blade);
            }
            this.scene.add(fan);
        });
    },

    addWaterDrips(towers) {
        const dripMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            emissive: 0x38bdf8,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.85,
        });
        towers.forEach((t, index) => {
            if (index % 2) return;
            const drip = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), dripMat.clone());
            drip.position.set(t.x + 0.25, 2.9, t.z + 0.28);
            drip.userData.isDrip = true;
            drip.userData.baseY = drip.position.y;
            this.scene.add(drip);
        });
    },

    addParticles() {
        const count = 360;
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 15;
            positions[i * 3 + 1] = Math.random() * 4.4 + 0.7;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 11;
            velocities[i * 3] = (Math.random() - 0.5) * 0.002;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.001;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.028,
            transparent: true,
            opacity: 0.28,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        this.particles = new THREE.Points(geo, mat);
        this.particles.userData.velocities = velocities;
        this.scene.add(this.particles);
    },

    createOverlays() {
        const filled = this.slotPlants.filter(Boolean).length;
        this.detailPanel = document.createElement('div');
        this.detailPanel.className = 'cf-overlay cf-info-panel';
        this.detailPanel.innerHTML = infoPanelHTML({
            title: this.farm?.name || AppState.farmName || 'Commercial Farm',
            subtitle: `${this.rack.label} · ${filled}/${this.rack.total} planted`,
            status: facilityStatus(this.slotPlants, this.sensorSnapshot),
            mode: 'Facility overview',
        });
        this.parent.appendChild(this.detailPanel);

        this.tooltip = document.createElement('div');
        this.tooltip.className = 'cf-tooltip';
        this.tooltip.innerHTML = '<span class="cf-tooltip-dot"></span><div><strong>Hover a tower</strong><small>Click to inspect rack details</small></div>';
        this.parent.appendChild(this.tooltip);

        const legend = document.createElement('div');
        legend.className = 'cf-overlay cf-legend';
        legend.innerHTML = `
            <span><i class="ok"></i>Healthy</span>
            <span><i class="warn"></i>Warning</span>
            <span><i class="danger"></i>Critical</span>
            <span class="cf-legend-help">Drag rotate · Wheel zoom · Double click fullscreen</span>
        `;
        this.parent.appendChild(legend);

        this.fullscreenButton = document.createElement('button');
        this.fullscreenButton.type = 'button';
        this.fullscreenButton.className = 'cf-expand-btn';
        this.fullscreenButton.textContent = 'EXPAND';
        this.fullscreenButton.addEventListener('click', event => {
            event.stopPropagation();
            this.toggleFullscreen();
        });
        this.parent.appendChild(this.fullscreenButton);
    },

    bindEvents() {
        this.resizeHandler = () => this.resize();
        window.addEventListener('resize', this.resizeHandler);

        this.fullscreenHandler = () => {
            if (this.fullscreenButton) this.fullscreenButton.textContent = document.fullscreenElement === this.parent ? 'CLOSE' : 'EXPAND';
            setTimeout(() => this.resize(), 80);
        };
        document.addEventListener('fullscreenchange', this.fullscreenHandler);

        this.canvas.addEventListener('pointermove', this.onPointerMove);
        this.canvas.addEventListener('click', this.onClick);
        this.canvas.addEventListener('dblclick', this.onDoubleClick);
    },

    onPointerMove: null,
    onClick: null,
    onDoubleClick: null,

    installHandlers() {
        this.onPointerMove = event => this.handlePointerMove(event);
        this.onClick = event => this.handleClick(event);
        this.onDoubleClick = () => this.toggleFullscreen();
    },

    handlePointerMove(event) {
        const hit = this.pickRoot(event);
        if (hit !== this.hoverRoot) {
            if (this.hoverRoot && this.hoverRoot !== this.selectedRoot) this.setHighlight(this.hoverRoot, false);
            this.hoverRoot = hit;
            if (this.hoverRoot && this.hoverRoot !== this.selectedRoot) this.setHighlight(this.hoverRoot, true);
        }
        this.canvas.style.cursor = hit ? 'pointer' : 'grab';
        this.updateTooltip(hit);
    },

    handleClick(event) {
        const hit = this.pickRoot(event);
        if (!hit) {
            if (this.selectedRoot) this.setHighlight(this.selectedRoot, false);
            this.selectedRoot = null;
            this.showOverview();
            return;
        }
        if (this.selectedRoot && this.selectedRoot !== hit) this.setHighlight(this.selectedRoot, false);
        this.selectedRoot = hit;
        this.setHighlight(hit, true, true);
        this.showRootDetail(hit);
    },

    pickRoot(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.pointer, this.camera);

        const meshes = [];
        this.interactiveRoots.forEach(root => root.traverse(child => {
            if (child.isMesh) meshes.push(child);
        }));
        const hit = this.raycaster.intersectObjects(meshes, false)[0]?.object;
        if (!hit) return null;

        let current = hit;
        while (current) {
            if (this.interactiveRoots.includes(current)) return current;
            if (current.userData?.root && this.interactiveRoots.includes(current.userData.root)) return current.userData.root;
            current = current.parent;
        }
        return null;
    },

    setHighlight(root, active, selected = false) {
        const color = selected ? new THREE.Color(0x38bdf8) : new THREE.Color(0xa3e635);
        const intensity = selected ? 0.65 : 0.32;
        root.traverse(child => {
            if (!child.isMesh || !child.material?.emissive) return;
            if (!child.userData.originalEmissive) {
                child.userData.originalEmissive = child.material.emissive.clone();
                child.userData.originalIntensity = child.material.emissiveIntensity || 0;
            }
            if (active) {
                child.material.emissive.copy(color);
                child.material.emissiveIntensity = intensity;
            } else {
                child.material.emissive.copy(child.userData.originalEmissive);
                child.material.emissiveIntensity = child.userData.originalIntensity;
            }
        });
    },

    updateTooltip(root) {
        if (!this.tooltip) return;
        if (!root) {
            this.tooltip.innerHTML = '<span class="cf-tooltip-dot"></span><div><strong>Hover a tower</strong><small>Click to inspect rack details</small></div>';
            return;
        }
        const data = root.userData || {};
        const plantCount = Array.isArray(data.plants) ? data.plants.length : 0;
        this.tooltip.innerHTML = `
            <span class="cf-tooltip-dot ${data.status || 'healthy'}"></span>
            <div><strong>${escapeHTML(data.label || data.label || 'Station')}</strong><small>${plantCount ? `${plantCount} active plants` : data.isTank ? 'Nutrient station' : 'Empty zone'}</small></div>
        `;
    },

    showOverview() {
        const filled = this.slotPlants.filter(Boolean).length;
        this.detailPanel.innerHTML = infoPanelHTML({
            title: this.farm?.name || AppState.farmName || 'Commercial Farm',
            subtitle: `${this.rack.label} · ${filled}/${this.rack.total} planted`,
            status: facilityStatus(this.slotPlants, this.sensorSnapshot),
            mode: 'Facility overview',
        });
    },

    showRootDetail(root) {
        const data = root.userData || {};
        if (data.isTank) {
            this.detailPanel.innerHTML = stationPanelHTML(data, this.sensorSnapshot);
            return;
        }
        const plants = Array.isArray(data.plants) ? data.plants : [];
        this.detailPanel.innerHTML = rackPanelHTML(data, plants, this.sensorSnapshot);
    },

    async toggleFullscreen() {
        if (!this.parent) return;
        const expanded = !this.parent.classList.contains('cf-expanded');
        this.parent.classList.toggle('cf-expanded', expanded);
        if (this.fullscreenButton) this.fullscreenButton.textContent = expanded ? 'CLOSE' : 'EXPAND';
        document.body.classList.toggle('cf-expanded-lock', expanded);
        setTimeout(() => this.resize(), 80);
    },

    resize() {
        if (!this.canvas || !this.renderer || !this.camera) return;
        const rect = this.canvas.getBoundingClientRect();
        const width = Math.max(320, rect.width || this.parent.clientWidth || 640);
        const height = Math.max(300, rect.height || 420);
        this.renderer.setSize(width, height, false);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    },

    animate() {
        const delta = Math.min(0.04, this.clock?.getDelta?.() || 0.016);
        this.frame += 1;

        if (this.controls) this.controls.update();
        this.updateParticles();
        this.scene.traverse(obj => {
            if (obj.userData?.isFanBlade) obj.rotation.z += 4.8 * delta;
            if (obj.userData?.isDrip) {
                obj.position.y -= 0.55 * delta;
                if (obj.position.y < 0.7) obj.position.y = obj.userData.baseY;
            }
        });

        if (this.renderer && this.scene && this.camera) this.renderer.render(this.scene, this.camera);
        this.rafId = requestAnimationFrame(() => this.animate());
    },

    updateParticles() {
        if (!this.particles) return;
        const pos = this.particles.geometry.attributes.position;
        const vel = this.particles.userData.velocities;
        for (let i = 0; i < pos.count; i++) {
            pos.array[i * 3] += vel[i * 3];
            pos.array[i * 3 + 1] += vel[i * 3 + 1];
            pos.array[i * 3 + 2] += vel[i * 3 + 2];
            if (pos.array[i * 3] > 7.5) pos.array[i * 3] = -7.5;
            if (pos.array[i * 3] < -7.5) pos.array[i * 3] = 7.5;
            if (pos.array[i * 3 + 1] > 5.4) pos.array[i * 3 + 1] = 0.7;
            if (pos.array[i * 3 + 2] > 5.5) pos.array[i * 3 + 2] = -5.5;
            if (pos.array[i * 3 + 2] < -5.5) pos.array[i * 3 + 2] = 5.5;
        }
        pos.needsUpdate = true;
    },

    createTextSprite(text, options = {}) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        roundedPath(ctx, 18, 22, canvas.width - 36, 84, 28);
        ctx.fillStyle = options.bg || 'rgba(12,20,14,.9)';
        ctx.fill();
        if (options.border) {
            ctx.strokeStyle = options.border;
            ctx.lineWidth = 4;
            ctx.stroke();
        }
        ctx.fillStyle = options.fg || '#ffffff';
        ctx.font = options.font || '900 30px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, 66);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
        const sprite = new THREE.Sprite(material);
        sprite.userData.texture = texture;
        return sprite;
    },

    destroy() {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.rafId = null;
        if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
        if (this.fullscreenHandler) document.removeEventListener('fullscreenchange', this.fullscreenHandler);
        if (this.canvas && this.onPointerMove) this.canvas.removeEventListener('pointermove', this.onPointerMove);
        if (this.canvas && this.onClick) this.canvas.removeEventListener('click', this.onClick);
        if (this.canvas && this.onDoubleClick) this.canvas.removeEventListener('dblclick', this.onDoubleClick);
        if (this.controls) this.controls.dispose();
        if (this.scene) {
            this.scene.traverse(obj => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.userData?.texture) obj.userData.texture.dispose();
                if (obj.material) {
                    if (Array.isArray(obj.material)) obj.material.forEach(mat => mat.dispose());
                    else obj.material.dispose();
                }
            });
        }
        if (this.renderer) this.renderer.dispose();
        if (this.parent) {
            this.parent.classList.remove('cf-expanded');
            this.parent.querySelectorAll('.cf-overlay, .cf-tooltip, .cf-expand-btn').forEach(node => node.remove());
            this.parent.classList.remove('commercial-farm-host');
        }
        document.body.classList.remove('cf-expanded-lock');
        this.canvas = null;
        this.parent = null;
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.controls = null;
        this.farmGroup = null;
        this.particles = null;
        this.raycaster = null;
        this.pointer = null;
        this.interactiveRoots = [];
        this.hoverRoot = null;
        this.selectedRoot = null;
        this.detailPanel = null;
        this.tooltip = null;
        this.fullscreenButton = null;
        this.resizeHandler = null;
        this.fullscreenHandler = null;
        this.onPointerMove = null;
        this.onClick = null;
        this.onDoubleClick = null;
    },
};

function getCurrentFarm() {
    const saved = loadSavedFarms();
    return AppState.currentFarm
        || saved.find(farm => farm.id === AppState.currentFarmId)
        || saved[saved.length - 1]
        || null;
}

function loadSavedFarms() {
    try {
        return JSON.parse(localStorage.getItem(FARMS_STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function resolveRack(field) {
    const rawRack = String(field?.rackTypeId || field?.rackType || field?.rackLabel || '').toLowerCase();
    if (rawRack.includes('2')) return RACK_OPTIONS['2-tier'];
    if (rawRack.includes('4')) return RACK_OPTIONS['4-tier'];
    if (rawRack.includes('5')) return RACK_OPTIONS['5-tier'];
    if (rawRack.includes('wall') || rawRack.includes('grid')) return RACK_OPTIONS.wall;
    if (rawRack.includes('frame')) return RACK_OPTIONS['a-frame'];
    if (rawRack.includes('nft') || rawRack.includes('channel')) return RACK_OPTIONS['nft-channel'];
    if (rawRack.includes('hanging') || rawRack.includes('column')) return RACK_OPTIONS.hanging;
    return RACK_OPTIONS['3-tier'];
}

function resolveSlotPlants(field, rack) {
    const sourcePlants = Array.isArray(field?.plants) ? field.plants : [];
    const slots = Array(rack.total).fill(null);
    const used = new Set();

    sourcePlants.forEach(plant => {
        if (plant.slotIndex !== undefined && plant.slotIndex !== null) {
            const index = Number(plant.slotIndex);
            if (Number.isInteger(index) && index >= 0 && index < rack.total) {
                slots[index] = normalizePlant(plant, index, rack, field);
                used.add(index);
            }
            return;
        }

        const count = Math.max(1, Number.parseInt(plant.slots || plant.count || 1, 10) || 1);
        for (let i = 0; i < count; i++) {
            const index = firstFreeSlot(slots, used);
            if (index === -1) return;
            slots[index] = normalizePlant(plant, index, rack, field);
            used.add(index);
        }
    });

    if (slots.some(Boolean)) return slots;

    const fallbackCount = Math.min(rack.total, Number.parseInt(field?.plantSlots || field?.plants || 0, 10) || 0);
    for (let i = 0; i < fallbackCount; i++) {
        slots[i] = normalizePlant({ name: field?.targetPlant || 'Plant', status: 'healthy' }, i, rack, field);
    }
    return slots;
}

function normalizePlant(plant, index, rack, field) {
    const name = plant.name || field?.targetPlant || 'Plant';
    return {
        name,
        emoji: plant.emoji || emojiForPlant(name),
        species: plant.species || speciesKey(name),
        status: plant.status || statusFromGrowth(plant.growth),
        growth: Number(plant.growth ?? 70),
        days: Number(plant.days ?? 0),
        slotIndex: index,
        tier: Math.floor(index / rack.slotsPerTier) + 1,
        position: (index % rack.slotsPerTier) + 1,
    };
}

function firstFreeSlot(slots, used) {
    for (let i = 0; i < slots.length; i++) {
        if (!slots[i] && !used.has(i)) return i;
    }
    return -1;
}

function statusFromGrowth(growth) {
    const value = Number(growth ?? 80);
    if (value < 35) return 'danger';
    if (value < 60) return 'warning';
    return 'healthy';
}

function statusColor(status) {
    if (status === 'danger') return 0xef4444;
    if (status === 'warning') return 0xf59e0b;
    if (status === 'empty') return 0x64748b;
    return 0x84cc16;
}

function towerStatus(plants) {
    if (!plants.length) return 'empty';
    if (plants.some(p => p.status === 'danger')) return 'danger';
    if (plants.some(p => p.status === 'warning')) return 'warning';
    return 'healthy';
}

function facilityStatus(plants, sensors) {
    if (plants.some(Boolean) && plants.some(p => p?.status === 'danger')) return 'Critical plant risk';
    if (Number(sensors.gasRaw || 0) > 2500 || Number(sensors.temperature || 25) > 35) return 'Automation alert';
    if (plants.some(p => p?.status === 'warning')) return 'Needs review';
    return 'Operational';
}

function getSensorSnapshot() {
    const s = AppState.sensors || {};
    return {
        temperature: s.temp?.val ?? 25,
        humidity: s.humid?.val ?? 60,
        lightRaw: s.light?.val ?? 2000,
        ph: s.ph?.val ?? 6.1,
        waterDistanceCm: s.water?.val ?? 10,
        gasRaw: s.nutrient?.val ?? 1000,
    };
}

function isPhWarning(sensors) {
    const ph = Number(sensors.ph ?? 6.1);
    return ph < 5.5 || ph > 6.5;
}

function speciesConfig(plant) {
    const key = speciesKey(plant?.species || plant?.name || 'plant');
    const direct = SPECIES[key];
    if (direct) return direct;
    const match = Object.keys(SPECIES).find(name => key.includes(name));
    return SPECIES[match] || SPECIES.plant;
}

function indexToTower(index, rack, towerIndex, towerCount) {
    if (Number.isNaN(index)) return false;
    return index % towerCount === towerIndex || Math.floor(index / Math.max(1, rack.slotsPerTier)) === towerIndex;
}

function makeLine(a, b, material) {
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...a), new THREE.Vector3(...b)]);
    return new THREE.Line(geo, material);
}

function roundedPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function infoPanelHTML({ title, subtitle, status, mode }) {
    return `
        <div class="cf-panel-kicker">${escapeHTML(mode)}</div>
        <div class="cf-panel-title">${escapeHTML(title)}</div>
        <div class="cf-panel-sub">${escapeHTML(subtitle)}</div>
        <div class="cf-mini-grid">
            ${miniMetric('Status', status)}
            ${miniMetric('Light', `${Math.round(Number(getSensorSnapshot().lightRaw || 0))}`)}
            ${miniMetric('pH', `${Number(getSensorSnapshot().ph || 0).toFixed(1)}`)}
        </div>
    `;
}

function rackPanelHTML(data, plants, sensors) {
    const healthy = plants.filter(p => p.status === 'healthy').length;
    const warning = plants.filter(p => p.status === 'warning').length;
    const danger = plants.filter(p => p.status === 'danger').length;
    return `
        <div class="cf-panel-kicker">Selected production zone</div>
        <div class="cf-panel-title">${escapeHTML(data.label || 'Zone')}</div>
        <div class="cf-panel-sub">${plants.length || 0} active plants · ${escapeHTML(data.status || 'empty')}</div>
        <div class="cf-mini-grid">
            ${miniMetric('Healthy', healthy)}
            ${miniMetric('Warning', warning)}
            ${miniMetric('Critical', danger)}
            ${miniMetric('Temp', `${Number(sensors.temperature || 0).toFixed(1)}C`)}
        </div>
        <div class="cf-plant-list">
            ${plants.slice(0, 5).map(plant => `<span>${escapeHTML(plant.name)} <b>${escapeHTML(plant.status)}</b></span>`).join('') || '<span>No assigned crop yet</span>'}
        </div>
    `;
}

function stationPanelHTML(data, sensors) {
    return `
        <div class="cf-panel-kicker">Nutrient station</div>
        <div class="cf-panel-title">${escapeHTML(data.label || 'Tank')} Tank</div>
        <div class="cf-panel-sub">Linked to commercial automation controls</div>
        <div class="cf-mini-grid">
            ${miniMetric('pH', `${Number(sensors.ph || 0).toFixed(1)}`)}
            ${miniMetric('Water', `${Number(sensors.waterDistanceCm || 0)}cm`)}
            ${miniMetric('Status', escapeHTML(data.status || 'healthy'))}
        </div>
    `;
}

function miniMetric(label, value) {
    return `<div class="cf-mini-metric"><span>${escapeHTML(label)}</span><strong>${escapeHTML(value)}</strong></div>`;
}

function emojiForPlant(name = '') {
    const key = String(name).toLowerCase();
    if (key.includes('lettuce') || key.includes('cabbage') || key.includes('kale')) return '🥬';
    if (key.includes('tomato')) return '🍅';
    if (key.includes('chili') || key.includes('pepper')) return '🌶️';
    if (key.includes('strawberry')) return '🍓';
    if (key.includes('cucumber')) return '🥒';
    if (key.includes('carrot')) return '🥕';
    if (key.includes('eggplant')) return '🍆';
    if (key.includes('basil') || key.includes('mint') || key.includes('spinach')) return '🌿';
    return '🌱';
}

function speciesKey(name = '') {
    return String(name || 'plant').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function escapeHTML(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function ensureCommercialStyles() {
    if (document.getElementById('commercial-farm-canvas-style')) return;
    const style = document.createElement('style');
    style.id = 'commercial-farm-canvas-style';
    style.textContent = `
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
    `;
    document.head.appendChild(style);
}
