import { AppState } from '../store.js';
import { formatMetric, normalizeSensorReading, toFiniteNumber } from '../utils/sensorReading.js';
import * as THREE from 'https://esm.sh/three@0.160.0';
import { OrbitControls } from 'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const FARMS_STORAGE_KEY = 'user_farms';
const MASCOT_VISIBILITY_KEY = 'seeddown_ai_mascot_enabled';

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
    zoomControls: null,
    mascotGroup: null,
    mascotTarget: null,
    mascotHome: null,
    mascotBaseY: 0.58,
    mascotWalkPhase: 0,
    mascotWalking: false,
    mascotVisible: true,
    mascotVisibilityHandler: null,
    mascotBubble: null,
    mascotSelectedContext: null,
    originalParent: null,
    originalNextSibling: null,
    resizeHandler: null,
    fullscreenHandler: null,
    rafId: null,
    clock: null,
    frame: 0,
    farm: null,
    rack: RACK_OPTIONS['3-tier'],
    slotPlants: [],
    sensorSnapshot: {},

    init(selector, farmOverride = null) {
        this.destroy();
        this.installHandlers();
        ensureCommercialStyles();

        this.canvas = document.getElementById(selector);
        if (!this.canvas) return;
        this.parent = this.canvas.parentElement;
        if (!this.parent) return;

        this.farm = farmOverride || getCurrentFarm();
        this.rack = resolveRack(this.farm);
        this.slotPlants = resolveSlotPlants(this.farm, this.rack);
        this.sensorSnapshot = getSensorSnapshot();
        this.mascotVisible = localStorage.getItem(MASCOT_VISIBILITY_KEY) !== 'false';
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
        this.parent.querySelectorAll('.cf-overlay, .cf-tooltip, .cf-expand-btn, .cf-zoom-controls').forEach(node => node.remove());
    },

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf8faf7);
        this.scene.fog = new THREE.Fog(0xf8faf7, 22, 58);

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
        this.controls.enableZoom = false;
        this.controls.maxPolarAngle = Math.PI * 0.48;
        this.controls.target.set(0, 1.55, 0);
        this.setCameraFrame(false);

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

        const towers = this.createTowerLayout();
        towers.forEach((tower, index) => this.addTower(tower, index));

        this.addIrrigationPipes(towers);
        this.addDigitalTwinDevices(towers);
        this.addNutrientStation();
        this.addControlPanel();
        this.addAIMascot();
        this.addVentilationFans();
        this.addWaterDrips(towers);
        this.addParticles();
    },

    addFloor() {
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(80, 60),
            new THREE.MeshStandardMaterial({ color: 0xe8eee6, roughness: 0.86, metalness: 0.02 })
        );
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        const aisle = new THREE.Mesh(
            new THREE.PlaneGeometry(5.2, 56),
            new THREE.MeshStandardMaterial({ color: 0xdde7dc, roughness: 0.78 })
        );
        aisle.rotation.x = -Math.PI / 2;
        aisle.position.y = 0.006;
        aisle.receiveShadow = true;
        this.scene.add(aisle);

        const lineMat = new THREE.LineBasicMaterial({ color: 0xa8b8aa, transparent: true, opacity: 0.48 });
        for (let x = -38; x <= 38; x += 2) {
            this.scene.add(makeLine([x, 0.014, -28], [x, 0.014, 28], lineMat));
        }
        for (let z = -28; z <= 28; z += 2) {
            this.scene.add(makeLine([-38, 0.016, z], [38, 0.016, z], lineMat));
        }
    },

    addGreenhouseFrame() {
        const frameMat = new THREE.MeshStandardMaterial({ color: 0x9aa7a0, metalness: 0.45, roughness: 0.32 });
        const glassMat = new THREE.MeshPhysicalMaterial({
            color: 0xcfe9d8,
            transparent: true,
            opacity: 0.2,
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

    createTowerLayout() {
        const zones = commercialZones(this.farm);
        if (zones.length) {
            const cols = Math.ceil(Math.sqrt(zones.length));
            const rowCount = Math.ceil(zones.length / cols);
            const spacingX = 2.65;
            const spacingZ = 3.1;
            const startX = -((cols - 1) * spacingX) / 2;
            const startZ = -((rowCount - 1) * spacingZ) / 2;
            return zones.map((zone, index) => ({
                x: startX + (index % cols) * spacingX,
                z: startZ + Math.floor(index / cols) * spacingZ,
                zoneIndex: index,
                row: Math.floor(index / cols),
                col: index % cols,
                zoneId: zone.zone_id || zone.id || `zone_${String.fromCharCode(65 + index)}`,
                label: zone.name || `Zone ${String.fromCharCode(65 + index)}`,
                crop: zone.crop || (Array.isArray(zone.plants) ? zone.plants.join(', ') : '') || 'Mixed crops',
            }));
        }

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
            id: config.zoneId || `zone-${zoneLetter}`,
            label: config.label || `Zone ${zoneLetter}`,
            crop: config.crop || 'Mixed crops',
            zoneIndex: towerIndex,
            plants: [],
            status: 'empty',
        };

        this.addZoneFootprint(tower, config, towerIndex);

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

        const layoutCount = this.createTowerLayout().length;
        const slotsForTower = this.slotPlants
            .map((plant, index) => ({ plant, index }))
            .filter(item => item.plant && plantBelongsToTower(item.plant, item.index, this.rack, towerIndex, layoutCount, config));

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
        this.addZoneStatusStrip(tower, tower.userData.status);

        const label = this.createTextSprite(String(config.label || `ZONE ${zoneLetter}`).toUpperCase(), {
            bg: 'rgba(255,255,255,.92)',
            fg: '#14532d',
            border: '#315d3e',
            font: '900 30px Inter, system-ui, sans-serif',
        });
        label.position.set(0, 3.63, 0);
        label.scale.set(0.68, 0.18, 1);
        tower.add(label);

        this.farmGroup.add(tower);
        this.interactiveRoots.push(tower);
    },

    addZoneFootprint(tower, config, towerIndex) {
        const zoneLetter = String.fromCharCode(65 + towerIndex);
        const padMat = new THREE.MeshStandardMaterial({
            color: 0xf3faf4,
            roughness: 0.72,
            metalness: 0.02,
        });
        const borderMat = new THREE.MeshStandardMaterial({
            color: 0x1f7a42,
            roughness: 0.48,
            metalness: 0.18,
        });
        const shadowMat = new THREE.MeshStandardMaterial({
            color: 0xb7c8bb,
            roughness: 0.82,
            metalness: 0.02,
            transparent: true,
            opacity: 0.55,
        });

        const pad = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.035, 2.04), padMat);
        pad.position.y = 0.022;
        pad.receiveShadow = true;
        tower.add(pad);

        const shadow = new THREE.Mesh(new THREE.BoxGeometry(2.08, 0.004, 2.2), shadowMat);
        shadow.position.y = 0.002;
        shadow.receiveShadow = true;
        tower.add(shadow);

        const bars = [
            { x: 0, z: 1.04, sx: 1.92, sz: 0.035 },
            { x: 0, z: -1.04, sx: 1.92, sz: 0.035 },
            { x: 0.96, z: 0, sx: 0.035, sz: 2.04 },
            { x: -0.96, z: 0, sx: 0.035, sz: 2.04 },
        ];
        bars.forEach(bar => {
            const rail = new THREE.Mesh(new THREE.BoxGeometry(bar.sx, 0.035, bar.sz), borderMat);
            rail.position.set(bar.x, 0.06, bar.z);
            rail.castShadow = true;
            tower.add(rail);
        });

        const idPlate = this.createTextSprite(`ZONE ${zoneLetter}`, {
            bg: 'rgba(20,83,45,.92)',
            fg: '#f7fee7',
            font: '900 24px Inter, system-ui, sans-serif',
        });
        idPlate.position.set(-0.62, 0.14, 0.98);
        idPlate.scale.set(0.26, 0.09, 1);
        tower.add(idPlate);

        const crop = String(config.crop || tower.userData?.crop || '').split(',')[0]?.trim();
        if (crop) {
            const cropPlate = this.createTextSprite(crop.toUpperCase().slice(0, 18), {
                bg: 'rgba(255,255,255,.9)',
                fg: '#166534',
                font: '900 22px Inter, system-ui, sans-serif',
            });
            cropPlate.position.set(0.38, 0.14, 0.98);
            cropPlate.scale.set(0.34, 0.085, 1);
            tower.add(cropPlate);
        }
    },

    addZoneStatusStrip(tower, status) {
        const color = statusColor(status || 'healthy');
        const mat = new THREE.MeshStandardMaterial({
            color,
            emissive: color,
            emissiveIntensity: status === 'empty' ? 0.08 : 0.34,
            roughness: 0.34,
            metalness: 0.1,
        });
        const strip = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.028, 0.055), mat);
        strip.position.set(0, 0.105, -1.05);
        strip.castShadow = true;
        tower.add(strip);
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

    addDigitalTwinDevices(towers) {
        const snapshot = normalizeSensorReading(this.sensorSnapshot || {});
        const gasDanger = snapshot.gasRaw !== null && snapshot.gasRaw > 2500;
        const tempHigh = snapshot.temperature !== null && snapshot.temperature > 30;
        const farmDevices = [
            { key: 'co2', label: 'CO2 Sensor', value: formatMetric(snapshot.co2Ppm, ' ppm', 0), type: 'sensor', kind: 'co2', x: -7.25, y: 2.35, z: -5.95, color: 0x38bdf8 },
            { key: 'reservoir', label: 'Water Reservoir', value: formatMetric(snapshot.waterDistanceCm, ' cm', 0), type: 'sensor', kind: 'reservoir', x: -6.8, y: 0.55, z: 5.35, color: 0x0ea5e9 },
            { key: 'gas', label: 'MQ-2 Gas Sensor', value: formatMetric(snapshot.gasRaw, ' raw', 0), type: 'sensor', kind: 'gas', x: -5.25, y: 0.72, z: 5.55, color: statusColor(gasDanger ? 'danger' : 'healthy') },
            { key: 'power', label: 'Power Meter', value: formatMetric(snapshot.energyKwh, ' kWh', 1), type: 'sensor', kind: 'power', x: 0.9, y: 1.45, z: 5.42, color: 0xf59e0b },
            { key: 'main_fan', label: 'Main Ventilation Fan', value: tempHigh ? 'active' : 'standby', type: 'output', kind: 'fan', x: 7.55, y: 2.85, z: -5.9, color: 0x64748b },
            { key: 'emergency_buzzer', label: 'Emergency Buzzer', value: gasDanger ? 'alert' : 'ready', type: 'output', kind: 'buzzer', x: 1.72, y: 1.34, z: 5.52, color: gasDanger ? 0xef4444 : 0x84cc16 },
        ];
        farmDevices.forEach(device => this.addDeviceMarker(device));

        const zoneDevices = [
            { key: 'dht11', label: 'DHT11 Temp/Humid', type: 'sensor', kind: 'dht', color: 0x22c55e, dx: -0.66, y: 1.72, dz: -0.32 },
            { key: 'soil', label: 'Soil Moisture', type: 'sensor', kind: 'soil', color: 0x8b5a2b, dx: 0.36, y: 0.29, dz: 0.53 },
            { key: 'ldr', label: 'LDR Light', type: 'sensor', kind: 'ldr', color: 0xfacc15, dx: 0.32, y: 3.38, dz: -0.42 },
            { key: 'ph', label: 'pH Sensor', type: 'sensor', kind: 'probe', color: 0xa855f7, dx: -0.42, y: 0.72, dz: 0.66 },
            { key: 'ec', label: 'EC Sensor', type: 'sensor', kind: 'probe', color: 0x14b8a6, dx: -0.18, y: 0.68, dz: 0.74 },
            { key: 'flow', label: 'YF-S201 Flow', type: 'sensor', kind: 'flow', color: 0x38bdf8, dx: 0.58, y: 0.58, dz: 0.42 },
            { key: 'pump', label: 'Water Pump', type: 'output', kind: 'pump', color: 0x0ea5e9, dx: 0.82, y: 0.22, dz: 0.78 },
            { key: 'zone_fan', label: 'Zone Fan', type: 'output', kind: 'fan', color: 0x64748b, dx: -0.9, y: 2.18, dz: 0.12 },
            { key: 'active_buzzer', label: 'Active Buzzer', type: 'output', kind: 'buzzer', color: 0xf97316, dx: 0.78, y: 1.78, dz: -0.58 },
            { key: 'camera', label: 'Camera', type: 'sensor', kind: 'camera', color: 0x111827, dx: -0.72, y: 3.08, dz: 0.68 },
        ];

        towers.forEach((tower, towerIndex) => {
            const zoneId = tower.zoneId || tower.userData?.id || `zone_${String.fromCharCode(65 + towerIndex)}`;
            const zoneLabel = tower.label || tower.userData?.label || `Zone ${String.fromCharCode(65 + towerIndex)}`;
            zoneDevices.forEach(device => {
                this.addDeviceMarker({
                    ...device,
                    scope: 'zone',
                    zoneId,
                    zoneLabel,
                    value: zoneDeviceValue(device.key, this.sensorSnapshot),
                    x: tower.x + device.dx,
                    y: device.y,
                    z: tower.z + device.dz,
                    compact: true,
                });
            });
        });
    },

    addDeviceMarker(device) {
        const group = new THREE.Group();
        group.position.set(device.x, device.y, device.z);
        group.userData = {
            isDevice: true,
            label: device.label,
            key: device.key,
            type: device.type,
            scope: device.scope || 'farm',
            zoneId: device.zoneId || null,
            zoneLabel: device.zoneLabel || null,
            value: device.value || '--',
            status: deviceStatus(device),
        };

        this.addDeviceShape(group, device);
        group.traverse(child => {
            if (child.isMesh || child.isSprite) child.userData.root = group;
        });

        const showTag = !device.compact || ['camera', 'pump', 'zone_fan'].includes(device.key);
        if (showTag) {
            const labelText = device.compact ? shortDeviceLabel(device.key) : device.label.replace(/\s+/g, '\n');
            const tag = this.createTextSprite(labelText, {
                bg: 'rgba(255,255,255,.92)',
                fg: '#0f172a',
                font: '900 24px Inter, system-ui, sans-serif',
            });
            tag.position.set(0, device.compact ? 0.17 : 0.24, 0);
            tag.scale.set(device.compact ? 0.2 : 0.34, device.compact ? 0.08 : 0.13, 1);
            group.add(tag);
        } else {
            const ring = new THREE.Mesh(
                new THREE.TorusGeometry(0.11, 0.006, 8, 22),
                new THREE.MeshStandardMaterial({
                    color: device.color,
                    emissive: device.color,
                    emissiveIntensity: 0.18,
                    roughness: 0.3,
                    metalness: 0.2,
                })
            );
            ring.rotation.x = Math.PI / 2;
            ring.position.y = 0.02;
            group.add(ring);
        }

        this.scene.add(group);
        this.interactiveRoots.push(group);
    },

    addDeviceShape(group, device) {
        const mat = new THREE.MeshStandardMaterial({
            color: device.color,
            emissive: device.color,
            emissiveIntensity: device.type === 'output' ? 0.24 : 0.1,
            roughness: 0.42,
            metalness: 0.16,
        });
        const dark = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.48, metalness: 0.36 });
        const white = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.52, metalness: 0.04 });
        const metal = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.28, metalness: 0.72 });
        const rubber = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.62, metalness: 0.08 });
        const glass = new THREE.MeshStandardMaterial({
            color: 0x67e8f9,
            emissive: 0x0891b2,
            emissiveIntensity: 0.18,
            roughness: 0.22,
            metalness: 0.04,
            transparent: true,
            opacity: 0.74,
        });

        const add = mesh => {
            mesh.castShadow = true;
            group.add(mesh);
            return mesh;
        };
        const led = (x, y, z, color = device.color) => {
            const dot = add(new THREE.Mesh(
                new THREE.SphereGeometry(device.compact ? 0.012 : 0.018, 10, 8),
                new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.7, roughness: 0.24 })
            ));
            dot.position.set(x, y, z);
            return dot;
        };

        if (device.kind === 'fan') {
            const radius = device.scope === 'zone' ? 0.13 : 0.24;
            add(new THREE.Mesh(new THREE.TorusGeometry(radius, 0.014, 10, 42), dark));
            add(new THREE.Mesh(new THREE.TorusGeometry(radius * 0.62, 0.006, 8, 34), metal));
            const hub = add(new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.19, radius * 0.19, 0.035, 18), rubber));
            hub.rotation.x = Math.PI / 2;
            for (let i = 0; i < 4; i++) {
                const blade = add(new THREE.Mesh(new THREE.BoxGeometry(radius * 1.46, radius * 0.17, 0.012), mat));
                blade.position.x = radius * 0.22;
                blade.rotation.z = i * Math.PI / 4;
                blade.userData.isFanBlade = true;
            }
            for (let i = 0; i < 4; i++) {
                const guard = add(new THREE.Mesh(new THREE.BoxGeometry(radius * 1.92, 0.006, 0.01), metal));
                guard.rotation.z = i * Math.PI / 4;
            }
            return;
        }

        if (device.kind === 'buzzer') {
            const base = add(new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.035, 22), rubber));
            base.position.y = -0.025;
            const dome = add(new THREE.Mesh(new THREE.SphereGeometry(0.095, 22, 10), mat));
            dome.scale.y = 0.58;
            dome.position.y = 0.045;
            const ring = add(new THREE.Mesh(new THREE.TorusGeometry(0.092, 0.006, 8, 28), metal));
            ring.rotation.x = Math.PI / 2;
            ring.position.y = 0.028;
            return;
        }

        if (device.kind === 'camera') {
            const body = add(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.13), rubber));
            body.rotation.y = -0.35;
            const face = add(new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.075, 0.012), dark));
            face.position.set(0.045, 0.002, 0.071);
            face.rotation.y = -0.35;
            const lens = add(new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.048, 18), metal));
            lens.rotation.x = Math.PI / 2;
            lens.position.set(0.045, 0, 0.075);
            const glassCap = add(new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.052, 18), glass));
            glassCap.rotation.x = Math.PI / 2;
            glassCap.position.set(0.045, 0, 0.104);
            const mount = add(new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.24, 8), metal));
            mount.position.y = -0.15;
            led(-0.045, -0.036, 0.081, 0x22c55e);
            return;
        }

        if (device.kind === 'soil') {
            const board = add(new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.06, 0.07), white));
            board.position.y = 0.025;
            const chip = add(new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.024, 0.012), rubber));
            chip.position.set(0, 0.035, 0.041);
            [-0.035, 0.035].forEach(x => {
                const prong = add(new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.006, 0.24, 8), metal));
                prong.position.set(x, -0.12, 0);
            });
            led(0.048, 0.04, 0.042, 0x22c55e);
            return;
        }

        if (device.kind === 'probe') {
            const handle = add(new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.038, 0.18, 14), mat));
            handle.rotation.z = 0.35;
            handle.position.y = 0.035;
            const collar = add(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.025, 14), rubber));
            collar.rotation.z = 0.35;
            collar.position.y = -0.055;
            const tip = add(new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.01, 0.28, 10), metal));
            tip.position.y = -0.22;
            tip.rotation.z = 0.35;
            const cable = add(new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.004, 6, 24), rubber));
            cable.rotation.set(Math.PI / 2, 0.35, 0);
            cable.position.set(-0.035, 0.15, 0);
            return;
        }

        if (device.kind === 'flow') {
            const pipe = add(new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.42, 14), metal));
            pipe.rotation.z = Math.PI / 2;
            const housing = add(new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.082, 0.05, 24), white));
            housing.rotation.x = Math.PI / 2;
            const rotor = add(new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.01, 0.014), mat));
            rotor.userData.isFanBlade = true;
            led(0.055, 0.055, 0.03, 0x06b6d4);
            return;
        }

        if (device.kind === 'pump') {
            const body = add(new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.18, 20), mat));
            body.rotation.z = Math.PI / 2;
            const head = add(new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.06, 18), metal));
            head.rotation.z = Math.PI / 2;
            head.position.x = 0.105;
            const outlet = add(new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.019, 0.2, 10), metal));
            outlet.rotation.z = Math.PI / 2;
            outlet.position.x = 0.19;
            const inlet = add(new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.15, 10), rubber));
            inlet.rotation.x = Math.PI / 2;
            inlet.position.set(-0.03, -0.078, 0);
            const feet = add(new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.024, 0.08), rubber));
            feet.position.y = -0.086;
            return;
        }

        if (device.kind === 'reservoir') {
            const tank = add(new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.42, 28), mat));
            tank.position.y = 0.12;
            const lid = add(new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.18, 0.045, 28), rubber));
            lid.position.y = 0.35;
            const gauge = add(new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.28, 0.012), glass));
            gauge.position.set(0.182, 0.12, 0.02);
            const sensor = add(new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.055, 0.12), dark));
            sensor.position.y = 0.38;
            led(0.064, 0.392, 0.064, 0x22c55e);
            return;
        }

        if (device.kind === 'power') {
            const panel = add(new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.045), dark));
            const screen = add(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.09, 0.012), mat));
            screen.position.z = 0.03;
            [-0.058, 0, 0.058].forEach((x, index) => {
                led(x, -0.064, 0.034, index === 0 ? 0x22c55e : 0x06b6d4);
            });
            return;
        }

        if (device.kind === 'gas' || device.kind === 'dht' || device.kind === 'co2') {
            const box = add(new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.135, 0.075), device.kind === 'dht' ? white : mat));
            for (let i = 0; i < 3; i++) {
                const slit = add(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.007, 0.011), dark));
                slit.position.set(-0.008, -0.038 + i * 0.032, 0.045);
            }
            if (device.kind === 'co2' || device.kind === 'gas') {
                const cap = add(new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.015, 18), rubber));
                cap.rotation.x = Math.PI / 2;
                cap.position.set(0.055, 0.038, 0.046);
            }
            led(-0.062, 0.044, 0.047, device.kind === 'gas' ? 0xf59e0b : 0x22c55e);
            return;
        }

        if (device.kind === 'ldr') {
            const board = add(new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.055, 0.08), white));
            board.position.y = -0.01;
            const cell = add(new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.02, 24), mat));
            cell.rotation.x = Math.PI / 2;
            cell.position.z = 0.045;
            const cap = add(new THREE.Mesh(new THREE.SphereGeometry(0.038, 14, 8), glass));
            cap.scale.y = 0.42;
            cap.position.set(0, 0, 0.058);
            return;
        }

        add(new THREE.Mesh(
            device.compact ? new THREE.SphereGeometry(0.07, 12, 8) : new THREE.BoxGeometry(0.22, 0.18, 0.14),
            mat
        ));
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

    addAIMascot() {
        const group = new THREE.Group();
        this.mascotHome = new THREE.Vector3(4.35, 0.58, 4.7);
        this.mascotTarget = this.mascotHome.clone();
        this.mascotBaseY = this.mascotHome.y;
        this.mascotWalkPhase = 0;
        this.mascotWalking = false;
        group.position.copy(this.mascotHome);
        group.userData.isMascot = true;

        const shadow = new THREE.Mesh(
            new THREE.CircleGeometry(0.38, 32),
            new THREE.MeshBasicMaterial({ color: 0x0f172a, transparent: true, opacity: 0.16, depthWrite: false })
        );
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = -0.31;
        group.add(shadow);

        const bodyMat = new THREE.MeshStandardMaterial({
            color: 0xf43f5e,
            roughness: 0.38,
            metalness: 0.02,
            emissive: 0x7f1d1d,
            emissiveIntensity: 0.08,
        });
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.31, 42, 32), bodyMat);
        body.scale.set(1.08, 0.95, 1.02);
        body.castShadow = true;
        group.add(body);

        const belly = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 28, 18),
            new THREE.MeshStandardMaterial({ color: 0xffb38a, roughness: 0.48, metalness: 0 })
        );
        belly.scale.set(1.1, 0.55, 0.16);
        belly.position.set(0, -0.12, 0.27);
        group.add(belly);

        const leafMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.44, metalness: 0.02 });
        const stemMat = new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.5 });
        [-0.18, 0, 0.18].forEach((x, index) => {
            const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.024, 0.23, 10), stemMat);
            stem.position.set(x * 0.42, 0.29, 0);
            stem.rotation.z = (index - 1) * 0.36;
            group.add(stem);

            const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.105, 20, 14), leafMat);
            leaf.scale.set(1.7, 0.42, 0.78);
            leaf.position.set(x, 0.45 + Math.abs(index - 1) * 0.02, index === 1 ? 0.01 : 0.035);
            leaf.rotation.z = (index - 1) * 0.5;
            leaf.rotation.x = 0.22;
            leaf.castShadow = true;
            group.add(leaf);
        });

        const eyeMat = new THREE.MeshStandardMaterial({ color: 0x281013, roughness: 0.28 });
        [-0.1, 0.1].forEach(x => {
            const eye = new THREE.Mesh(new THREE.SphereGeometry(0.034, 16, 12), eyeMat);
            eye.position.set(x, 0.05, 0.295);
            group.add(eye);
        });

        const cheekMat = new THREE.MeshStandardMaterial({ color: 0xff8aa5, roughness: 0.45, transparent: true, opacity: 0.92 });
        [-0.17, 0.17].forEach(x => {
            const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.038, 16, 10), cheekMat);
            cheek.scale.set(1.3, 0.72, 0.22);
            cheek.position.set(x, -0.03, 0.302);
            group.add(cheek);
        });

        const smilePoints = [
            new THREE.Vector3(-0.055, -0.01, 0.318),
            new THREE.Vector3(-0.018, -0.035, 0.322),
            new THREE.Vector3(0.018, -0.035, 0.322),
            new THREE.Vector3(0.055, -0.01, 0.318),
        ];
        const smile = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(smilePoints),
            new THREE.LineBasicMaterial({ color: 0x2b1014, linewidth: 2 })
        );
        group.add(smile);

        this.mascotGroup = group;
        this.scene.add(group);
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

        this.mascotBubble = document.createElement('div');
        this.mascotBubble.className = 'cf-overlay cf-mascot-bubble';
        this.mascotBubble.addEventListener('click', event => {
            const hide = event.target.closest('[data-mascot-hide]');
            if (hide) {
                event.preventDefault();
                event.stopPropagation();
                localStorage.setItem(MASCOT_VISIBILITY_KEY, 'false');
                this.setMascotVisible(false);
                window.dispatchEvent(new CustomEvent('seeddown:mascotVisibility', { detail: { enabled: false } }));
                return;
            }
            const button = event.target.closest('[data-mascot-ask]');
            if (!button) return;
            event.preventDefault();
            event.stopPropagation();
            window.dispatchEvent(new CustomEvent('seeddown:mascotAsk', {
                detail: this.getSelectedContext(),
            }));
        });
        this.parent.appendChild(this.mascotBubble);
        this.updateMascotBubble();

        const legend = document.createElement('div');
        legend.className = 'cf-overlay cf-legend';
        legend.innerHTML = `
            <span><i class="ok"></i>Healthy</span>
            <span><i class="warn"></i>Warning</span>
            <span><i class="danger"></i>Critical</span>
            <span class="cf-legend-help">Drag rotate · Wheel / +/- zoom · Double click fullscreen</span>
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

        this.zoomControls = document.createElement('div');
        this.zoomControls.className = 'cf-zoom-controls';
        this.zoomControls.innerHTML = `
            <button type="button" data-zoom="in" aria-label="Zoom in">+</button>
            <button type="button" data-zoom="out" aria-label="Zoom out">-</button>
            <button type="button" data-zoom="reset" aria-label="Reset view">RESET</button>
        `;
        this.zoomControls.addEventListener('click', event => {
            const button = event.target.closest('button[data-zoom]');
            if (!button) return;
            event.preventDefault();
            event.stopPropagation();
            if (button.dataset.zoom === 'in') this.zoomCamera(0.82);
            if (button.dataset.zoom === 'out') this.zoomCamera(1.22);
            if (button.dataset.zoom === 'reset') this.resetCamera();
        });
        this.parent.appendChild(this.zoomControls);
    },
    bindEvents() {
        this.resizeHandler = () => this.resize();
        window.addEventListener('resize', this.resizeHandler);

        this.fullscreenHandler = () => {
            this.syncExpandButton();
            setTimeout(() => this.resize(), 80);
        };
        document.addEventListener('fullscreenchange', this.fullscreenHandler);

        this.canvas.addEventListener('pointermove', this.onPointerMove);
        this.canvas.addEventListener('click', this.onClick);
        this.canvas.addEventListener('dblclick', this.onDoubleClick);
        this.canvas.addEventListener('wheel', this.onWheel, { passive: false });
        this.mascotVisibilityHandler = event => this.setMascotVisible(event.detail?.enabled !== false);
        window.addEventListener('seeddown:mascotVisibility', this.mascotVisibilityHandler);
        this.setMascotVisible(this.mascotVisible);
    },

    onPointerMove: null,
    onClick: null,
    onDoubleClick: null,
    onWheel: null,

    installHandlers() {
        this.onPointerMove = event => this.handlePointerMove(event);
        this.onClick = event => this.handleClick(event);
        this.onDoubleClick = () => this.toggleFullscreen();
        this.onWheel = event => this.handleWheel(event);
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
            this.moveMascotToRoot(null);
            return;
        }
        if (this.selectedRoot && this.selectedRoot !== hit) this.setHighlight(this.selectedRoot, false);
        this.selectedRoot = hit;
        this.setHighlight(hit, true, true);
        this.showRootDetail(hit);
        this.moveMascotToRoot(hit);
    },

    handleWheel(event) {
        if (!this.camera || !this.controls) return;
        event.preventDefault();
        event.stopPropagation();
        this.zoomCamera(event.deltaY > 0 ? 1.12 : 0.88);
    },

    zoomCamera(scale) {
        if (!this.camera || !this.controls) return;
        const target = this.controls.target;
        const offset = this.camera.position.clone().sub(target);
        const currentDistance = offset.length() || 1;
        const minDistance = this.parent?.classList.contains('cf-expanded') ? 2.4 : 2.8;
        const maxDistance = this.parent?.classList.contains('cf-expanded') ? 24 : 18;
        const nextDistance = THREE.MathUtils.clamp(currentDistance * scale, minDistance, maxDistance);
        offset.setLength(nextDistance);
        this.camera.position.copy(target).add(offset);
        this.controls.update();
    },

    resetCamera() {
        this.setCameraFrame(this.parent?.classList.contains('cf-expanded'));
    },

    setCameraFrame(expanded = false) {
        if (!this.camera || !this.controls) return;
        if (expanded) {
            this.camera.fov = 38;
            this.camera.position.set(0.35, 18.5, 0.35);
            this.controls.target.set(0, 0, 0);
            this.controls.minPolarAngle = Math.PI * 0.015;
            this.controls.maxPolarAngle = Math.PI * 0.18;
        } else {
            this.camera.fov = 58;
            this.camera.position.set(5.5, 4.6, 8.5);
            this.controls.target.set(0, 1.55, 0);
            this.controls.minPolarAngle = 0;
            this.controls.maxPolarAngle = Math.PI * 0.48;
        }
        this.camera.updateProjectionMatrix();
        this.controls.update();
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
            <div><strong>${escapeHTML(data.label || 'Station')}</strong><small>${data.isDevice ? `${data.scope || 'farm'} ${data.type}` : plantCount ? `${plantCount} active plants` : data.isTank ? 'Nutrient station' : 'Empty zone'}</small></div>
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
        this.mascotSelectedContext = null;
        this.updateMascotBubble();
    },

    showRootDetail(root) {
        const data = root.userData || {};
        if (data.isTank) {
            this.detailPanel.innerHTML = stationPanelHTML(data, this.sensorSnapshot);
            return;
        }
        if (data.isDevice) {
            this.detailPanel.innerHTML = devicePanelHTML(data);
            return;
        }
        const plants = Array.isArray(data.plants) ? data.plants : [];
        this.detailPanel.innerHTML = rackPanelHTML(data, plants, this.sensorSnapshot);
    },

    moveMascotToRoot(root) {
        if (!this.mascotGroup || !this.mascotTarget) return;
        if (!root) {
            this.mascotTarget.copy(this.mascotHome || new THREE.Vector3(4.35, 0.58, 4.7));
            this.mascotBaseY = this.mascotTarget.y;
            this.mascotSelectedContext = null;
            this.updateMascotBubble();
            return;
        }

        const box = new THREE.Box3().setFromObject(root);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const xSide = center.x >= 0 ? 1 : -1;
        const zSide = center.z >= 0 ? 1 : -1;
        this.mascotTarget.set(
            THREE.MathUtils.clamp(center.x + xSide * Math.max(0.7, size.x * 0.36), -7.2, 7.2),
            0.58,
            THREE.MathUtils.clamp(center.z + zSide * Math.max(0.5, size.z * 0.26), -5.9, 5.9)
        );
        this.mascotBaseY = this.mascotTarget.y;
        this.mascotSelectedContext = this.contextFromRoot(root);
        this.updateMascotBubble();
    },

    contextFromRoot(root) {
        const data = root?.userData || {};
        const sensors = { ...(this.sensorSnapshot || {}) };
        if (data.isDevice) {
            return {
                objectType: data.type === 'output' ? 'output' : 'sensor',
                label: data.label || 'Device',
                key: data.key || '',
                scope: data.scope || 'farm',
                zoneId: data.zoneId || '',
                zoneLabel: data.zoneLabel || '',
                status: data.status || 'healthy',
                value: data.value || '',
                purpose: devicePurpose(data.key),
                latestReading: sensors,
                prompt: `${data.label || 'This device'} context`,
            };
        }
        if (data.isTank) {
            return {
                objectType: 'tank',
                label: `${data.label || 'Nutrient'} tank`,
                status: data.status || 'healthy',
                latestReading: sensors,
                prompt: `${data.label || 'Nutrient'} tank context`,
            };
        }
        if (data.isTower) {
            return {
                objectType: 'zone',
                label: data.label || 'Zone',
                zoneId: data.id || '',
                crop: data.crop || '',
                status: data.status || 'empty',
                plantCount: Array.isArray(data.plants) ? data.plants.length : 0,
                latestReading: sensors,
                prompt: `${data.label || 'Zone'} context`,
            };
        }
        return null;
    },

    getSelectedContext() {
        return this.mascotSelectedContext || this.contextFromRoot(this.selectedRoot) || {
            objectType: 'facility',
            label: this.farm?.name || AppState.farmName || 'Commercial Farm',
            status: facilityStatus(this.slotPlants, this.sensorSnapshot),
            latestReading: { ...(this.sensorSnapshot || {}) },
            prompt: 'Commercial farm context',
        };
    },

    updateMascotBubble() {
        if (!this.mascotBubble) return;
        const context = this.mascotSelectedContext;
        const status = String(context?.status || '').toLowerCase();
        const isRisk = status.includes('warning') || status.includes('danger') || status.includes('critical');
        const title = context ? 'I am checking this now' : 'I am SeedDown AI';
        let message = 'Click a zone, sensor, tank, or output and I will explain what the live data means.';
        if (context?.objectType === 'zone') {
            message = `I am looking at ${context.label}. I can explain its temperature, pH, water, and risk status.`;
        } else if (context?.objectType === 'sensor') {
            message = `This ${context.label} is linked to ${context.zoneLabel || context.scope || 'the farm'}. Ask me what this reading means.`;
        } else if (context?.objectType === 'output') {
            message = `This ${context.label} controls ${context.purpose || 'farm automation'}. I can explain when it should run.`;
        } else if (context?.objectType === 'tank') {
            message = `I am checking the ${context.label}. I can explain how it affects nutrient balance.`;
        } else if (context) {
            message = `I am looking at ${context.label}. Ask me what the current data means.`;
        }
        if (context && isRisk) {
            message = 'This area may need attention. I can help you understand the risk before you act.';
        }
        this.mascotBubble.innerHTML = `
            <div class="cf-mascot-kicker">SeedDown AI</div>
            <button type="button" class="cf-mascot-hide" data-mascot-hide aria-label="Hide SeedDown AI">Hide</button>
            <strong>${escapeHTML(title)}</strong>
            <span>${escapeHTML(message)}</span>
            <button type="button" data-mascot-ask>Ask now</button>
        `;
    },

    setMascotVisible(visible) {
        this.mascotVisible = Boolean(visible);
        if (this.mascotGroup) this.mascotGroup.visible = this.mascotVisible;
        if (this.mascotBubble) this.mascotBubble.style.display = this.mascotVisible ? 'block' : 'none';
    },

    async toggleFullscreen() {
        if (!this.parent) return;
        const shouldExpand = !this.parent.classList.contains('cf-expanded');
        if (shouldExpand) this.enterExpandedView();
        else this.exitExpandedView();
    },

    enterExpandedView() {
        if (!this.parent || this.parent.classList.contains('cf-expanded')) return;
        this.originalParent = this.parent.parentNode;
        this.originalNextSibling = this.parent.nextSibling;
        document.body.appendChild(this.parent);
        this.parent.classList.add('cf-expanded');
        document.documentElement.classList.add('cf-expanded-lock');
        document.body.classList.add('cf-expanded-lock');
        this.syncExpandButton();
        this.setCameraFrame(true);
        requestAnimationFrame(() => this.resize());
        setTimeout(() => this.resize(), 120);
    },

    exitExpandedView() {
        if (!this.parent) return;
        this.parent.classList.remove('cf-expanded');
        document.documentElement.classList.remove('cf-expanded-lock');
        document.body.classList.remove('cf-expanded-lock');
        this.restoreHostPlacement();
        this.syncExpandButton();
        this.setCameraFrame(false);
        requestAnimationFrame(() => this.resize());
        setTimeout(() => this.resize(), 120);
    },

    restoreHostPlacement() {
        if (!this.parent || !this.originalParent) return;
        if (this.originalNextSibling && this.originalNextSibling.parentNode === this.originalParent) {
            this.originalParent.insertBefore(this.parent, this.originalNextSibling);
        } else {
            this.originalParent.appendChild(this.parent);
        }
        this.originalParent = null;
        this.originalNextSibling = null;
    },

    syncExpandButton() {
        if (!this.fullscreenButton || !this.parent) return;
        this.fullscreenButton.textContent = this.parent.classList.contains('cf-expanded') ? 'CLOSE' : 'EXPAND';
    },

    resize() {
        if (!this.canvas || !this.renderer || !this.camera) return;
        const expanded = this.parent?.classList.contains('cf-expanded');
        const commandMode = this.parent?.classList.contains('commercial-command-screen');
        const fullViewport = expanded || commandMode;

        if (commandMode) {
            setImportant(this.parent, {
                position: 'fixed',
                inset: '0',
                width: '100vw',
                height: '100vh',
                minHeight: '100vh',
                overflow: 'hidden',
                borderRadius: '0',
            });
            setImportant(this.canvas, {
                position: 'fixed',
                inset: '0',
                width: '100vw',
                height: '100vh',
                minHeight: '100vh',
                display: 'block',
                borderRadius: '0',
            });
        }

        const rect = this.canvas.getBoundingClientRect();
        const width = fullViewport ? (window.innerWidth || document.documentElement.clientWidth || rect.width || 1280) : Math.max(320, rect.width || this.parent.clientWidth || 640);
        const height = fullViewport ? (window.innerHeight || document.documentElement.clientHeight || rect.height || 720) : Math.max(300, rect.height || 420);
        this.renderer.setSize(width, height, false);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    },

    animate() {
        const delta = Math.min(0.04, this.clock?.getDelta?.() || 0.016);
        this.frame += 1;

        if (this.controls) this.controls.update();
        this.updateParticles();
        this.updateMascot();
        this.positionMascotBubble();
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

    updateMascot() {
        if (!this.mascotGroup || !this.mascotTarget) return;
        const current = this.mascotGroup.position;
        const flatDelta = new THREE.Vector3(
            this.mascotTarget.x - current.x,
            0,
            this.mascotTarget.z - current.z
        );
        const distance = flatDelta.length();
        this.mascotWalking = distance > 0.045;

        if (this.mascotWalking) {
            const step = Math.min(distance, 0.045 + distance * 0.025);
            flatDelta.normalize();
            current.x += flatDelta.x * step;
            current.z += flatDelta.z * step;
            this.mascotWalkPhase += 0.32;
            const footLift = Math.abs(Math.sin(this.mascotWalkPhase)) * 0.035;
            current.y += ((this.mascotBaseY || 0.58) + footLift - current.y) * 0.24;
            this.mascotGroup.rotation.y = Math.atan2(flatDelta.x, flatDelta.z);
            this.mascotGroup.rotation.z = Math.sin(this.mascotWalkPhase) * 0.11;
            this.mascotGroup.rotation.x = Math.cos(this.mascotWalkPhase * 0.8) * 0.035;
            return;
        }

        const idleY = (this.mascotBaseY || 0.58) + Math.sin(this.frame * 0.045) * 0.025;
        current.x += (this.mascotTarget.x - current.x) * 0.08;
        current.z += (this.mascotTarget.z - current.z) * 0.08;
        current.y += (idleY - current.y) * 0.12;
        this.mascotGroup.rotation.x += (0 - this.mascotGroup.rotation.x) * 0.08;
        this.mascotGroup.rotation.z += (0 - this.mascotGroup.rotation.z) * 0.08;
        this.mascotGroup.rotation.y += (Math.sin(this.frame * 0.028) * 0.06 - this.mascotGroup.rotation.y) * 0.08;
    },

    positionMascotBubble() {
        if (!this.mascotVisible || !this.mascotBubble || !this.mascotGroup || !this.camera || !this.canvas || !this.parent) return;
        const world = new THREE.Vector3();
        this.mascotGroup.getWorldPosition(world);
        world.y += 0.58;
        const projected = world.project(this.camera);
        if (projected.z < -1 || projected.z > 1) {
            this.mascotBubble.style.opacity = '0';
            return;
        }

        const canvasRect = this.canvas.getBoundingClientRect();
        const parentRect = this.parent.getBoundingClientRect();
        const bubbleWidth = this.mascotBubble.offsetWidth || 280;
        const bubbleHeight = this.mascotBubble.offsetHeight || 112;
        const mascotX = canvasRect.left - parentRect.left + (projected.x * 0.5 + 0.5) * canvasRect.width;
        const mascotY = canvasRect.top - parentRect.top + (-projected.y * 0.5 + 0.5) * canvasRect.height;
        const placeLeft = mascotX + bubbleWidth + 38 > parentRect.width;
        const rawLeft = placeLeft ? mascotX - bubbleWidth - 24 : mascotX + 24;
        const rawTop = mascotY - bubbleHeight * 0.72;
        const left = THREE.MathUtils.clamp(rawLeft, 12, Math.max(12, parentRect.width - bubbleWidth - 12));
        const top = THREE.MathUtils.clamp(rawTop, 112, Math.max(112, parentRect.height - bubbleHeight - 18));

        this.mascotBubble.classList.toggle('from-left', placeLeft);
        this.mascotBubble.style.setProperty('left', `${left}px`, 'important');
        this.mascotBubble.style.setProperty('top', `${top}px`, 'important');
        this.mascotBubble.style.setProperty('right', 'auto', 'important');
        this.mascotBubble.style.setProperty('bottom', 'auto', 'important');
        this.mascotBubble.style.setProperty('opacity', '1', 'important');
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
        if (this.mascotVisibilityHandler) window.removeEventListener('seeddown:mascotVisibility', this.mascotVisibilityHandler);
        if (this.canvas && this.onPointerMove) this.canvas.removeEventListener('pointermove', this.onPointerMove);
        if (this.canvas && this.onClick) this.canvas.removeEventListener('click', this.onClick);
        if (this.canvas && this.onDoubleClick) this.canvas.removeEventListener('dblclick', this.onDoubleClick);
        if (this.canvas && this.onWheel) this.canvas.removeEventListener('wheel', this.onWheel);
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
        if (this.parent?.classList.contains('cf-expanded')) this.exitExpandedView();
        if (this.parent) {
            this.parent.classList.remove('cf-expanded');
            this.parent.querySelectorAll('.cf-overlay, .cf-tooltip, .cf-expand-btn, .cf-zoom-controls').forEach(node => node.remove());
            this.parent.classList.remove('commercial-farm-host');
        }
        document.documentElement.classList.remove('cf-expanded-lock');
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
        this.zoomControls = null;
        this.mascotGroup = null;
        this.mascotTarget = null;
        this.mascotHome = null;
        this.mascotBaseY = 0.58;
        this.mascotWalkPhase = 0;
        this.mascotWalking = false;
        this.mascotVisible = true;
        this.mascotVisibilityHandler = null;
        this.mascotBubble = null;
        this.mascotSelectedContext = null;
        this.originalParent = null;
        this.originalNextSibling = null;
        this.resizeHandler = null;
        this.fullscreenHandler = null;
        this.onPointerMove = null;
        this.onClick = null;
        this.onDoubleClick = null;
        this.onWheel = null;
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
    if (commercialZones(field).length) {
        const zoneCount = commercialZones(field).length;
        return {
            id: 'commercial-zones',
            label: `${zoneCount}-Zone Commercial Farm`,
            tiers: zoneCount,
            slotsPerTier: 12,
            total: Math.max(12, zoneCount * 12),
        };
    }
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
    const zones = commercialZones(field);
    const commercialTotal = zones.length ? Math.max(rack.total, zones.length * 12, sourcePlants.length * 3) : rack.total;
    const slots = Array(commercialTotal).fill(null);
    const used = new Set();

    sourcePlants.forEach((plant, plantOrder) => {
        if (zones.length && plant.zoneId) {
            const zoneIndex = zones.findIndex(zone => zoneMatchesPlant(zone, plant));
            const zoneStart = Math.max(0, zoneIndex) * 12;
            const count = Math.max(1, Number.parseInt(plant.slots || plant.count || 1, 10) || 1);
            for (let i = 0; i < count; i++) {
                const index = firstFreeSlotInRange(slots, used, zoneStart, zoneStart + 12) ?? firstFreeSlot(slots, used);
                if (index === -1 || index === null || index === undefined) return;
                slots[index] = normalizePlant(plant, index, rack, field);
                slots[index].zoneId = plant.zoneId;
                slots[index].zoneName = plant.zoneName || zones[zoneIndex]?.name || plant.zoneId;
                used.add(index);
            }
            return;
        }

        if (plant.slotIndex !== undefined && plant.slotIndex !== null) {
            const index = Number(plant.slotIndex);
            if (Number.isInteger(index) && index >= 0 && index < slots.length) {
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

function commercialZones(field) {
    const sourceZones = Array.isArray(field?.zones) ? field.zones : Array.isArray(field?.commercialStructure?.zones) ? field.commercialStructure.zones : [];
    if (sourceZones.length) {
        return sourceZones
            .map((zone, index) => ({
                ...zone,
                zone_id: zone.zone_id || zone.id || `zone_${String.fromCharCode(65 + index)}`,
                name: zone.name || `Zone ${String.fromCharCode(65 + index)}`,
            }))
            .filter(zone => zone.zone_id || zone.name);
    }

    const plants = Array.isArray(field?.plants) ? field.plants : [];
    const zoneMap = new Map();
    plants.forEach((plant, index) => {
        const rawId = plant.zoneId || plant.zone_id || plant.zone || plant.area;
        if (!rawId) return;
        const zoneId = String(rawId);
        if (!zoneMap.has(zoneId)) {
            zoneMap.set(zoneId, {
                zone_id: zoneId,
                name: plant.zoneName || `Zone ${String.fromCharCode(65 + zoneMap.size)}`,
                crop: plant.name || plant.species || 'Mixed crops',
                plants: [],
            });
        }
        const zone = zoneMap.get(zoneId);
        const plantName = plant.name || plant.species || `Plant ${index + 1}`;
        if (!zone.plants.includes(plantName)) zone.plants.push(plantName);
        zone.crop = zone.plants.join(', ');
    });
    if (zoneMap.size) return [...zoneMap.values()];

    if (field?.accountMode === 'commercial' || field?.viewMode === 'commercial') {
        return [{
            zone_id: 'zone_A',
            name: field?.name ? `${field.name} Zone` : 'Zone A',
            crop: field?.targetPlant || 'Commercial crops',
            plants: field?.targetPlant ? String(field.targetPlant).split(',').map(item => item.trim()).filter(Boolean) : ['Commercial crops'],
        }];
    }
    return [];
}

function zoneMatchesPlant(zone, plant) {
    const plantZone = String(plant.zoneId || plant.zone_id || plant.zone || '').toLowerCase();
    return plantZone && (
        plantZone === String(zone.zone_id || '').toLowerCase()
        || plantZone === String(zone.id || '').toLowerCase()
        || plantZone === String(zone.name || '').toLowerCase()
    );
}

function firstFreeSlotInRange(slots, used, start, end) {
    const safeStart = Math.max(0, start);
    const safeEnd = Math.min(slots.length, end);
    for (let i = safeStart; i < safeEnd; i++) {
        if (!slots[i] && !used.has(i)) return i;
    }
    return null;
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
    const normalized = normalizeSensorReading(sensors || {});
    if ((normalized.gasRaw !== null && normalized.gasRaw > 2500) || (normalized.temperature !== null && normalized.temperature > 35)) return 'Automation alert';
    if (plants.some(p => p?.status === 'warning')) return 'Needs review';
    return 'Operational';
}

function getSensorSnapshot() {
    const s = AppState.sensors || {};
    const reading = AppState.latestReading || AppState.currentReading || {};
    const sensorNumber = (...values) => {
        for (const value of values) {
            const raw = value && typeof value === 'object' && 'val' in value ? value.val : value;
            const num = toFiniteNumber(raw);
            if (num !== null) return num;
        }
        return null;
    };
    return {
        temperature: sensorNumber(s.temp, s.temperature, reading.temperature, reading.temp),
        humidity: sensorNumber(s.humid, s.humidity, reading.humidity, reading.humid, reading.hum),
        lightRaw: sensorNumber(s.lightRaw, s.light, reading.lightRaw, reading.light),
        soilRaw: sensorNumber(s.soilRaw, s.soil, reading.soilRaw, reading.soilMoisture, reading.moisture),
        ph: sensorNumber(s.ph, reading.ph),
        waterDistanceCm: sensorNumber(s.water, s.waterDistanceCm, reading.waterDistanceCm, reading.waterLevel, reading.water),
        gasRaw: sensorNumber(s.nutrient, s.gasRaw, reading.gasRaw, reading.gasValue, reading.gas),
        ec: sensorNumber(s.ec, reading.ec),
        co2Ppm: sensorNumber(s.co2, reading.co2Ppm, reading.co2),
        energyKwh: sensorNumber(s.energy, s.energyKwh, reading.energyKwh, reading.powerKwh),
        waterFlowLpm: sensorNumber(s.flow, s.waterFlowLpm, reading.waterFlowLpm),
    };
}

function formatSensorUpdatedAt() {
    const meta = AppState.latestReadingMeta || {};
    const reading = AppState.latestReading || AppState.currentReading || {};
    const raw = meta.fetchedAt || reading._fetchedAt || reading.createdAt || reading.updatedAt || reading.timestamp;
    let date = null;
    if (raw instanceof Date) date = raw;
    else if (raw && typeof raw === 'object') {
        if (typeof raw.toDate === 'function') date = raw.toDate();
        else if (raw._seconds) date = new Date(raw._seconds * 1000);
        else if (raw.seconds) date = new Date(raw.seconds * 1000);
    } else if (raw) {
        date = new Date(raw);
    }
    if (!date || Number.isNaN(date.getTime())) return '--';
    const suffix = meta.stale || reading._stale ? ' cached' : '';
    return `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${suffix}`;
}

function zoneDeviceValue(key, sensors) {
    const s = normalizeSensorReading(sensors || {});
    const map = {
        dht11: `${formatMetric(s.temperature, 'C', 1)} / ${formatMetric(s.humidity, '%', 0)}`,
        soil: formatMetric(s.soilRaw, ' raw', 0),
        ldr: formatMetric(s.lightRaw, ' raw', 0),
        ph: `${formatMetric(s.ph, '', 1)} pH`,
        ec: `${formatMetric(s.ec, '', 1)} EC`,
        flow: formatMetric(s.waterFlowLpm, ' L/min', 1),
        pump: s.waterDistanceCm !== null && s.waterDistanceCm > 20 ? 'ready' : 'standby',
        zone_fan: s.temperature !== null && s.temperature > 30 ? 'active' : 'standby',
        active_buzzer: s.gasRaw !== null && s.gasRaw > 2500 ? 'alert' : 'ready',
        camera: 'scan ready',
    };
    return map[key] || '--';
}

function shortDeviceLabel(key) {
    const map = {
        dht11: 'DHT',
        soil: 'SOIL',
        ldr: 'LDR',
        ph: 'pH',
        ec: 'EC',
        flow: 'FLOW',
        pump: 'PUMP',
        zone_fan: 'FAN',
        active_buzzer: 'BUZZ',
        camera: 'CAM',
    };
    return map[key] || String(key).slice(0, 4).toUpperCase();
}

function deviceStatus(device) {
    const value = String(device.value || '').toLowerCase();
    if (value.includes('alert') || value.includes('danger')) return 'danger';
    if (value.includes('active')) return 'warning';
    return 'healthy';
}

function isPhWarning(sensors) {
    const ph = toFiniteNumber(sensors.ph);
    return ph !== null && (ph < 5.5 || ph > 6.5);
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

function plantBelongsToTower(plant, index, rack, towerIndex, towerCount, config = {}) {
    if (plant?.zoneId && config.zoneId) {
        return String(plant.zoneId).toLowerCase() === String(config.zoneId).toLowerCase();
    }
    if (plant?.zoneName && config.label) {
        return String(plant.zoneName).toLowerCase() === String(config.label).toLowerCase();
    }
    return indexToTower(index, rack, towerIndex, towerCount);
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
    const snapshot = getSensorSnapshot();
    return `
        <div class="cf-panel-kicker">${escapeHTML(mode)}</div>
        <div class="cf-panel-title">${escapeHTML(title)}</div>
        <div class="cf-panel-sub">${escapeHTML(subtitle)}</div>
        <div class="cf-mini-grid">
            ${miniMetric('Status', status)}
            ${miniMetric('Light', formatMetric(snapshot.lightRaw, '', 0))}
            ${miniMetric('pH', formatMetric(snapshot.ph, '', 1))}
            ${miniMetric('Updated', formatSensorUpdatedAt())}
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
            ${miniMetric('Temp', formatMetric(sensors.temperature, 'C', 1))}
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
            ${miniMetric('pH', formatMetric(sensors.ph, '', 1))}
            ${miniMetric('Water', formatMetric(sensors.waterDistanceCm, 'cm', 0))}
            ${miniMetric('Status', escapeHTML(data.status || 'healthy'))}
        </div>
    `;
}

function devicePanelHTML(data) {
    const scopeLabel = data.scope === 'zone' ? data.zoneLabel || data.zoneId || 'Zone' : 'Farm Level';
    const role = data.type === 'output' ? 'Actuator / Output' : 'Sensor';
    return `
        <div class="cf-panel-kicker">Digital twin device</div>
        <div class="cf-panel-title">${escapeHTML(data.label || 'Device')}</div>
        <div class="cf-panel-sub">${escapeHTML(scopeLabel)} · ${escapeHTML(role)}</div>
        <div class="cf-mini-grid">
            ${miniMetric('Value', data.value || '--')}
            ${miniMetric('Status', data.status || 'healthy')}
            ${miniMetric('Type', data.type || 'sensor')}
        </div>
        <div class="cf-plant-list">
            <span>Layer <b>${escapeHTML(data.scope === 'zone' ? 'ZONE' : 'FARM')}</b></span>
            <span>Clickable <b>YES</b></span>
            <span>Purpose <b>${escapeHTML(devicePurpose(data.key))}</b></span>
        </div>
    `;
}

function devicePurpose(key) {
    const map = {
        co2: 'air enrichment',
        reservoir: 'water level',
        gas: 'safety alert',
        power: 'energy tracking',
        main_fan: 'facility airflow',
        emergency_buzzer: 'emergency alarm',
        dht11: 'temperature humidity',
        soil: 'root moisture',
        ldr: 'light detection',
        ph: 'water acidity',
        ec: 'nutrient strength',
        flow: 'irrigation flow',
        pump: 'irrigation output',
        zone_fan: 'zone airflow',
        active_buzzer: 'zone warning',
        camera: 'plant vision',
    };
    return map[key] || 'monitoring';
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

function setImportant(node, styles) {
    if (!node) return;
    Object.entries(styles).forEach(([key, value]) => {
        const cssKey = key.replace(/[A-Z]/g, letter => '-' + letter.toLowerCase());
        node.style.setProperty(cssKey, value, 'important');
    });
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
    `;
    document.head.appendChild(style);
}



