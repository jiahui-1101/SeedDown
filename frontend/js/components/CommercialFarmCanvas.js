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
    zoomControls: null,
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
        this.addOverheadGrowLights();

        const towers = this.createTowerLayout();
        towers.forEach((tower, index) => this.addTower(tower, index));

        this.addIrrigationPipes(towers);
        this.addDigitalTwinDevices(towers);
        this.addNutrientStation();
        this.addControlPanel();
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
        const label = this.createTextSprite(String(config.label || `ZONE ${zoneLetter}`).toUpperCase(), {
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

    addDigitalTwinDevices(towers) {
        const farmDevices = [
            { key: 'co2', label: 'CO2 Sensor', value: `${Number(this.sensorSnapshot.co2Ppm || 800)} ppm`, type: 'sensor', kind: 'co2', x: -7.25, y: 2.35, z: -5.95, color: 0x38bdf8 },
            { key: 'reservoir', label: 'Water Reservoir', value: `${Number(this.sensorSnapshot.waterDistanceCm || 0)} cm`, type: 'sensor', kind: 'reservoir', x: -6.8, y: 0.55, z: 5.35, color: 0x0ea5e9 },
            { key: 'gas', label: 'MQ-2 Gas Sensor', value: `${Number(this.sensorSnapshot.gasRaw || 0)} raw`, type: 'sensor', kind: 'gas', x: -5.25, y: 0.72, z: 5.55, color: statusColor(Number(this.sensorSnapshot.gasRaw || 0) > 2500 ? 'danger' : 'healthy') },
            { key: 'power', label: 'Power Meter', value: `${Number(this.sensorSnapshot.energyKwh || 5.1).toFixed(1)} kWh`, type: 'sensor', kind: 'power', x: 0.9, y: 1.45, z: 5.42, color: 0xf59e0b },
            { key: 'main_fan', label: 'Main Ventilation Fan', value: Number(this.sensorSnapshot.temperature || 25) > 30 ? 'active' : 'standby', type: 'output', kind: 'fan', x: 7.55, y: 2.85, z: -5.9, color: 0x64748b },
            { key: 'emergency_buzzer', label: 'Emergency Buzzer', value: Number(this.sensorSnapshot.gasRaw || 0) > 2500 ? 'alert' : 'ready', type: 'output', kind: 'buzzer', x: 1.72, y: 1.34, z: 5.52, color: Number(this.sensorSnapshot.gasRaw || 0) > 2500 ? 0xef4444 : 0x84cc16 },
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
            { key: 'grow_light', label: 'LED Grow Light', type: 'output', kind: 'lightbar', color: 0xdd88ff, dx: 0, y: 3.92, dz: 0 },
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

        const labelText = device.compact ? shortDeviceLabel(device.key) : device.label.replace(/\s+/g, '\n');
        const tag = this.createTextSprite(labelText, {
            bg: 'rgba(255,255,255,.9)',
            fg: '#0f172a',
            font: '900 26px Inter, system-ui, sans-serif',
        });
        tag.position.set(0, device.compact ? 0.17 : 0.24, 0);
        tag.scale.set(device.compact ? 0.22 : 0.34, device.compact ? 0.09 : 0.13, 1);
        group.add(tag);

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

        const add = mesh => {
            mesh.castShadow = true;
            group.add(mesh);
            return mesh;
        };

        if (device.kind === 'fan') {
            add(new THREE.Mesh(new THREE.TorusGeometry(device.scope === 'zone' ? 0.13 : 0.24, 0.015, 8, 32), dark));
            for (let i = 0; i < 4; i++) {
                const blade = add(new THREE.Mesh(new THREE.BoxGeometry(device.scope === 'zone' ? 0.22 : 0.38, 0.035, 0.014), mat));
                blade.rotation.z = i * Math.PI / 4;
                blade.userData.isFanBlade = true;
            }
            return;
        }

        if (device.kind === 'buzzer') {
            const base = add(new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.035, 18), dark));
            base.position.y = -0.025;
            const dome = add(new THREE.Mesh(new THREE.SphereGeometry(0.095, 18, 10), mat));
            dome.scale.y = 0.58;
            dome.position.y = 0.045;
            return;
        }

        if (device.kind === 'camera') {
            const body = add(new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.11, 0.12), dark));
            body.rotation.y = -0.35;
            const lens = add(new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.045, 16), mat));
            lens.rotation.x = Math.PI / 2;
            lens.position.set(0.045, 0, 0.075);
            const mount = add(new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.24, 8), dark));
            mount.position.y = -0.15;
            return;
        }

        if (device.kind === 'lightbar') {
            const bar = add(new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.045, 0.08), dark));
            const led = add(new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.022, 0.042), mat));
            led.position.y = -0.035;
            return;
        }

        if (device.kind === 'soil') {
            add(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.055, 0.07), white));
            [-0.035, 0.035].forEach(x => {
                const prong = add(new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.22, 6), mat));
                prong.position.set(x, -0.12, 0);
            });
            return;
        }

        if (device.kind === 'probe') {
            const handle = add(new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.03, 0.2, 12), mat));
            handle.rotation.z = 0.35;
            const tip = add(new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.01, 0.24, 8), dark));
            tip.position.y = -0.2;
            tip.rotation.z = 0.35;
            return;
        }

        if (device.kind === 'flow') {
            const pipe = add(new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.36, 12), mat));
            pipe.rotation.z = Math.PI / 2;
            add(new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.012, 8, 20), white));
            return;
        }

        if (device.kind === 'pump') {
            const body = add(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.18, 18), mat));
            body.rotation.z = Math.PI / 2;
            const outlet = add(new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.2, 10), dark));
            outlet.rotation.z = Math.PI / 2;
            outlet.position.x = 0.15;
            return;
        }

        if (device.kind === 'reservoir') {
            const tank = add(new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.42, 22), mat));
            tank.position.y = 0.12;
            const sensor = add(new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.055, 0.12), dark));
            sensor.position.y = 0.38;
            return;
        }

        if (device.kind === 'power') {
            const panel = add(new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.045), dark));
            const screen = add(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.09, 0.012), mat));
            screen.position.z = 0.03;
            return;
        }

        if (device.kind === 'gas' || device.kind === 'dht' || device.kind === 'co2') {
            const box = add(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.13, 0.07), device.kind === 'dht' ? white : mat));
            for (let i = 0; i < 3; i++) {
                const slit = add(new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.008, 0.01), dark));
                slit.position.set(0, -0.035 + i * 0.035, 0.043);
            }
            return;
        }

        if (device.kind === 'ldr') {
            add(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.025, 22), mat));
            const cap = add(new THREE.Mesh(new THREE.SphereGeometry(0.055, 14, 8), mat));
            cap.position.y = 0.035;
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
            return;
        }
        if (this.selectedRoot && this.selectedRoot !== hit) this.setHighlight(this.selectedRoot, false);
        this.selectedRoot = hit;
        this.setHighlight(hit, true, true);
        this.showRootDetail(hit);
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
        soilRaw: s.soil?.val ?? s.soilRaw?.val ?? 1800,
        ph: s.ph?.val ?? 6.1,
        waterDistanceCm: s.water?.val ?? 10,
        gasRaw: s.nutrient?.val ?? 1000,
        ec: s.ec?.val ?? 1.5,
        co2Ppm: s.co2?.val ?? 850,
        energyKwh: s.energy?.val ?? 5.1,
        waterFlowLpm: s.flow?.val ?? 0.8,
    };
}

function zoneDeviceValue(key, sensors) {
    const map = {
        dht11: `${Number(sensors.temperature || 0).toFixed(1)}C / ${Number(sensors.humidity || 0)}%`,
        soil: `${Number(sensors.soilRaw || 1800)} raw`,
        ldr: `${Number(sensors.lightRaw || 0)} raw`,
        ph: `${Number(sensors.ph || 0).toFixed(1)} pH`,
        ec: `${Number(sensors.ec || 1.5).toFixed(1)} EC`,
        flow: `${Number(sensors.waterFlowLpm || 0.8).toFixed(1)} L/min`,
        pump: Number(sensors.waterDistanceCm || 0) > 20 ? 'ready' : 'standby',
        grow_light: Number(sensors.lightRaw || 0) < 1500 ? 'active' : 'standby',
        zone_fan: Number(sensors.temperature || 25) > 30 ? 'active' : 'standby',
        active_buzzer: Number(sensors.gasRaw || 0) > 2500 ? 'alert' : 'ready',
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
        grow_light: 'LED',
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
        grow_light: 'lighting output',
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
    `;
    document.head.appendChild(style);
}



