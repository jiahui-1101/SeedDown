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

const EMOJI_COLORS = {
    '🥬': 0x65a30d,
    '🌿': 0x16a34a,
    '🌱': 0x22c55e,
    '🍅': 0xef4444,
    '🌶️': 0xdc2626,
    '🍓': 0xfb7185,
    '🥒': 0x15803d,
    '🥕': 0xf97316,
};

export const FarmCanvas = {
    canvas: null,
    renderer: null,
    scene: null,
    camera: null,
    group: null,
    ctx: null,
    rafId: null,
    resizeHandler: null,
    frame: 0,
    field: null,
    rack: RACK_OPTIONS['3-tier'],
    slotPlants: [],
    fallbackMode: false,
    raycaster: null,
    pointer: null,
    interactiveObjects: [],
    detailPanel: null,
    fullscreenButton: null,
    fullscreenHandler: null,
    controls: null,
    mode: 'beginner',
    pointerDown: null,
    userInteracted: false,

    init(selector) {
        this.destroy();

        this.canvas = document.getElementById(selector);
        if (!this.canvas) return;

        this.field = getCurrentField();
        this.rack = resolveRack(this.field);
        this.slotPlants = resolveSlotPlants(this.field, this.rack);
        this.mode = selector === 'commercialFarmCanvas' || AppState.mode === 'commercial' ? 'commercial' : 'beginner';
        this.pointerDown = null;
        this.userInteracted = false;
        this.createDetailPanel();

        try {
            this.initThree();
        } catch (error) {
            console.warn('[FarmCanvas] WebGL unavailable, using preview fallback:', error.message);
            this.renderFallback();
        }
    },

    initThree() {
        this.scene = new THREE.Scene();
        const background = this.mode === 'commercial' ? 0xe8f7ef : 0xeaf4ff;
        this.scene.background = new THREE.Color(background);
        this.scene.fog = new THREE.Fog(background, 4, 10);

        this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
        this.camera.position.set(3.2, 2.4, 4.4);
        this.camera.lookAt(0, 1.0, 0);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false,
            preserveDrawingBuffer: true,
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;

        this.group = new THREE.Group();
        this.scene.add(this.group);
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.interactiveObjects = [];

        this.addLights();
        this.buildFarm();

        this.resizeHandler = () => this.resize();
        window.addEventListener('resize', this.resizeHandler);
        this.canvas.style.touchAction = 'none';
        this.canvas.onpointerdown = (event) => {
            this.pointerDown = { x: event.clientX, y: event.clientY };
        };
        this.canvas.onclick = (event) => this.handleCanvasClick(event);
        this.canvas.onmousemove = (event) => this.handleCanvasHover(event);
        this.canvas.ondblclick = () => this.toggleFullscreen();
        this.enableCanvasControls();

        this.resize();
        this.animate();
    },

    enableCanvasControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.enablePan = true;
        this.controls.enableZoom = true;
        this.controls.minDistance = this.mode === 'commercial' ? 2.2 : 1.6;
        this.controls.maxDistance = this.mode === 'commercial' ? 8.5 : 7.2;
        this.controls.maxPolarAngle = Math.PI * 0.82;
        this.controls.target.set(0, Math.min(1.3, this.rack.tiers * 0.32), 0);
        this.controls.addEventListener('start', () => {
            this.userInteracted = true;
        });
        this.controls.update();
    },

    addLights() {
        this.scene.add(new THREE.AmbientLight(0x8fb5ff, 1.7));

        const sun = new THREE.DirectionalLight(0xffffff, 2.5);
        sun.position.set(4, 6, 5);
        sun.castShadow = true;
        sun.shadow.mapSize.set(1024, 1024);
        this.scene.add(sun);

        const grow = new THREE.PointLight(this.mode === 'commercial' ? 0x10b981 : 0x7c3aed, 1.4, 5);
        grow.position.set(0, 2.3, 0.8);
        this.scene.add(grow);
    },

    buildFarm() {
        if (this.mode === 'commercial') {
            this.buildCommercialFacility();
            return;
        }

        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(7, 7),
            new THREE.MeshStandardMaterial({ color: this.mode === 'commercial' ? 0xdff4e8 : 0xdbeafe, roughness: 0.85 })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.03;
        ground.receiveShadow = true;
        this.scene.add(ground);

        const { tiers, slotsPerTier } = this.rack;
        const slotW = slotsPerTier >= 5 ? 0.43 : slotsPerTier === 4 ? 0.5 : 0.62;
        const rackW = Math.max(1.9, slotsPerTier * slotW + 0.15);
        const rackD = this.rack.id === 'wall' ? 0.52 : 0.75;
        const tierH = tiers >= 5 ? 0.52 : 0.68;
        const totalH = tierH * tiers;

        const poleMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.65, roughness: 0.32 });
        const shelfMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.35, roughness: 0.45 });
        const ledMat = new THREE.MeshStandardMaterial({
            color: this.mode === 'commercial' ? 0x14b8a6 : 0x8b5cf6,
            emissive: this.mode === 'commercial' ? 0x0f766e : 0x7c3aed,
            emissiveIntensity: 1.2
        });

        const poleGeo = new THREE.BoxGeometry(0.055, totalH, 0.055);
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
            const pole = new THREE.Mesh(poleGeo, poleMat);
            pole.position.set(sx * rackW / 2, totalH / 2, sz * rackD / 2);
            pole.castShadow = true;
            this.group.add(pole);
        });

        for (let tier = 0; tier < tiers; tier++) {
            const y = tier * tierH;

            const shelf = new THREE.Mesh(new THREE.BoxGeometry(rackW, 0.04, rackD), shelfMat);
            shelf.position.set(0, y, 0);
            shelf.castShadow = true;
            shelf.receiveShadow = true;
            this.group.add(shelf);

            const led = new THREE.Mesh(new THREE.BoxGeometry(rackW * 0.78, 0.018, 0.035), ledMat);
            led.position.set(0, y + tierH - 0.08, -rackD / 2 + 0.08);
            this.group.add(led);

            if (this.mode === 'commercial') {
                const zoneLabel = this.createTextSprite(`Zone ${String.fromCharCode(65 + tier)} · Tier ${tier + 1}`, {
                    bg: 'rgba(6,95,70,.94)',
                    fg: '#ffffff',
                    font: '800 28px Inter, system-ui, sans-serif'
                });
                zoneLabel.position.set(-rackW / 2 - 0.2, y + 0.15, rackD / 2 + 0.08);
                zoneLabel.scale.set(0.62, 0.18, 1);
                this.group.add(zoneLabel);
            }

            for (let slot = 0; slot < slotsPerTier; slot++) {
                const index = tier * slotsPerTier + slot;
                const plant = this.slotPlants[index];
                const x = (slot - (slotsPerTier - 1) / 2) * slotW;
                const z = 0;
                const baseY = y + 0.05;

                if (plant) this.addPlant(x, baseY, z, plant, index);
                else this.addEmptySlot(x, baseY, z, index);
            }
        }

        if (this.mode === 'commercial') this.addCommercialDevices(rackW, rackD, totalH);
        else this.addGamifiedBadges(rackW, totalH);
        this.group.position.y = tiers >= 5 ? -0.12 : 0.05;
    },

    buildCommercialFacility() {
        this.scene.background = new THREE.Color(0x07110c);
        this.scene.fog = new THREE.Fog(0x07110c, 5, 13);
        this.camera.position.set(4.7, 3.4, 5.4);
        this.camera.lookAt(0, 1.2, 0);

        const floorMat = new THREE.MeshStandardMaterial({ color: 0x1d241f, roughness: 0.88, metalness: 0.05 });
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(8.8, 7.2), floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        this.addCommercialGridFloor();
        this.addCommercialGreenhouse();

        const filledPlants = this.slotPlants.filter(Boolean);
        const towerCount = Math.max(3, Math.min(5, this.rack.tiers || 3));
        const spacing = 1.55;
        const startX = -((towerCount - 1) * spacing) / 2;

        for (let towerIndex = 0; towerIndex < towerCount; towerIndex++) {
            const zonePlants = this.slotPlants
                .map((plant, index) => ({ plant, index }))
                .filter(item => item.plant && Math.floor(item.index / this.rack.slotsPerTier) === towerIndex);
            const fallbackPlants = !zonePlants.length && filledPlants[towerIndex]
                ? [{ plant: filledPlants[towerIndex], index: towerIndex * this.rack.slotsPerTier }]
                : zonePlants;
            this.addCommercialTower({
                x: startX + towerIndex * spacing,
                z: towerIndex % 2 ? -0.35 : 0.35,
                zoneIndex: towerIndex,
                plants: fallbackPlants
            });
        }

        this.addCommercialDevices(3.2, 1.2, 2.7);
        this.addCommercialHud(towerCount, filledPlants.length);
        this.group.position.y = 0;
    },

    addCommercialGridFloor() {
        const lineMat = new THREE.LineBasicMaterial({ color: 0x234032, transparent: true, opacity: 0.55 });
        const makeLine = (points) => {
            const geo = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(...p)));
            const line = new THREE.Line(geo, lineMat);
            this.scene.add(line);
        };
        for (let x = -4; x <= 4; x += 0.8) makeLine([[x, 0.012, -3.3], [x, 0.012, 3.3]]);
        for (let z = -3.2; z <= 3.2; z += 0.8) makeLine([[-4.2, 0.014, z], [4.2, 0.014, z]]);

        const aisle = new THREE.Mesh(
            new THREE.PlaneGeometry(1.05, 6.7),
            new THREE.MeshStandardMaterial({ color: 0x2f3b34, roughness: 0.76 })
        );
        aisle.rotation.x = -Math.PI / 2;
        aisle.position.set(0, 0.018, 0);
        aisle.receiveShadow = true;
        this.scene.add(aisle);
    },

    addCommercialGreenhouse() {
        const frameMat = new THREE.MeshStandardMaterial({ color: 0x4b5563, metalness: 0.65, roughness: 0.28 });
        const glassMat = new THREE.MeshPhysicalMaterial({
            color: 0xa7f3d0,
            transparent: true,
            opacity: 0.08,
            roughness: 0.08,
            metalness: 0,
            side: THREE.DoubleSide
        });
        const width = 8.6;
        const depth = 7;
        const h = 2.7;
        const postGeo = new THREE.CylinderGeometry(0.025, 0.025, h, 8);
        [-1, 1].forEach(sx => {
            [-1, 1].forEach(sz => {
                const post = new THREE.Mesh(postGeo, frameMat);
                post.position.set(sx * width / 2, h / 2, sz * depth / 2);
                post.castShadow = true;
                this.scene.add(post);
            });
        });

        const beamGeoX = new THREE.BoxGeometry(width, 0.045, 0.045);
        const beamGeoZ = new THREE.BoxGeometry(0.045, 0.045, depth);
        [-1, 1].forEach(sz => {
            const beam = new THREE.Mesh(beamGeoX, frameMat);
            beam.position.set(0, h, sz * depth / 2);
            this.scene.add(beam);
        });
        [-1, 1].forEach(sx => {
            const beam = new THREE.Mesh(beamGeoZ, frameMat);
            beam.position.set(sx * width / 2, h, 0);
            this.scene.add(beam);
        });

        const backGlass = new THREE.Mesh(new THREE.PlaneGeometry(width, h), glassMat);
        backGlass.position.set(0, h / 2, -depth / 2);
        this.scene.add(backGlass);

        const sideGlass = new THREE.Mesh(new THREE.PlaneGeometry(depth, h), glassMat);
        sideGlass.rotation.y = Math.PI / 2;
        sideGlass.position.set(-width / 2, h / 2, 0);
        this.scene.add(sideGlass);
    },

    addCommercialTower({ x, z, zoneIndex, plants }) {
        const zoneLetter = String.fromCharCode(65 + zoneIndex);
        const tower = new THREE.Group();
        tower.position.set(x, 0, z);

        const columnMat = new THREE.MeshStandardMaterial({ color: 0xe5e7eb, roughness: 0.38, metalness: 0.18 });
        const column = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.105, 2.25, 18), columnMat);
        column.position.y = 1.15;
        column.castShadow = true;
        tower.add(column);

        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(0.42, 0.5, 0.12, 24),
            new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.2, roughness: 0.55 })
        );
        base.position.y = 0.06;
        base.castShadow = true;
        tower.add(base);

        const levels = Math.max(4, this.rack.slotsPerTier + 1);
        for (let level = 0; level < levels; level++) {
            const y = 0.36 + level * 0.42;
            const slotItem = plants[level % Math.max(1, plants.length)] || null;
            for (let side = 0; side < 4; side++) {
                const index = slotItem ? Number(slotItem.index) : zoneIndex * this.rack.slotsPerTier + level;
                const plant = side === 0 ? slotItem?.plant : null;
                const angle = side * Math.PI / 2 + (level % 2) * 0.24;
                this.addCommercialPod(tower, angle, y, plant, index, zoneIndex, level);
            }
        }

        const label = this.createTextSprite(`ZONE ${zoneLetter}`, {
            bg: 'rgba(6,95,70,.94)',
            fg: '#d9f99d',
            font: '900 30px Inter, system-ui, sans-serif'
        });
        label.position.set(0, 2.55, 0);
        label.scale.set(0.52, 0.15, 1);
        tower.add(label);

        this.group.add(tower);
    },

    addCommercialPod(parent, angle, y, plant, index, zoneIndex, level) {
        const radius = 0.36;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const status = plant?.status || 'empty';
        const statusColor = status === 'danger' ? 0xef4444 : status === 'warning' ? 0xf59e0b : plant ? 0x84cc16 : 0x475569;
        const slotData = {
            index,
            tier: zoneIndex + 1,
            slot: level + 1,
            plant: plant || null
        };

        const cup = new THREE.Mesh(
            new THREE.CylinderGeometry(0.13, 0.105, 0.095, 18),
            new THREE.MeshStandardMaterial({ color: plant ? 0xf8fafc : 0x334155, roughness: 0.54, metalness: 0.08 })
        );
        cup.position.set(x, y, z);
        cup.rotation.z = -Math.PI / 2;
        cup.rotation.y = -angle;
        cup.castShadow = true;
        cup.userData.slot = slotData;
        parent.add(cup);
        this.interactiveObjects.push(cup);

        const dot = new THREE.Mesh(
            new THREE.SphereGeometry(0.045, 12, 8),
            new THREE.MeshStandardMaterial({ color: statusColor, emissive: statusColor, emissiveIntensity: plant ? 0.25 : 0.04 })
        );
        dot.position.set(x * 1.08, y + 0.075, z * 1.08);
        dot.userData.slot = slotData;
        parent.add(dot);
        this.interactiveObjects.push(dot);

        if (plant) this.addCommercialPlant(parent, x * 1.08, y + 0.11, z * 1.08, plant, statusColor);
    },

    addCommercialPlant(parent, x, y, z, plant, color) {
        const speciesColor = EMOJI_COLORS[plant.emoji] || color;
        const stemMat = new THREE.MeshStandardMaterial({ color: 0x365314, roughness: 0.75 });
        const leafMat = new THREE.MeshStandardMaterial({
            color: speciesColor,
            roughness: 0.68,
            side: THREE.DoubleSide
        });
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.01, 0.13, 6), stemMat);
        stem.position.set(x, y + 0.05, z);
        parent.add(stem);

        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i;
            const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 5), leafMat);
            leaf.scale.set(1.45, 0.38, 0.8);
            leaf.position.set(x + Math.cos(angle) * 0.06, y + 0.12 + (i % 2) * 0.012, z + Math.sin(angle) * 0.06);
            leaf.rotation.set(-0.4, angle, 0.2);
            leaf.castShadow = true;
            parent.add(leaf);
        }
    },

    addCommercialHud(towerCount, filledCount) {
        const hud = this.createTextSprite(`${towerCount} ZONES · ${filledCount}/${this.rack.total} ACTIVE SLOTS`, {
            bg: 'rgba(2,6,23,.86)',
            fg: '#a3e635',
            font: '900 24px Inter, system-ui, sans-serif'
        });
        hud.position.set(0, 3.05, -1.6);
        hud.scale.set(1.2, 0.23, 1);
        this.scene.add(hud);
    },

    addPlant(x, y, z, plant, index) {
        const palette = [0x22c55e, 0x4ade80, 0x16a34a, 0x65a30d, 0x86efac, 0x10b981];
        const emojiColor = plant.emoji ? EMOJI_COLORS[plant.emoji] : null;
        const statusColor = plant.status === 'danger'
            ? 0xef4444
            : plant.status === 'warning'
                ? 0xf59e0b
                : emojiColor || palette[index % palette.length];
        const tier = Math.floor(index / this.rack.slotsPerTier) + 1;
        const slotNo = (index % this.rack.slotsPerTier) + 1;
        const slotData = { index, tier, slot: slotNo, plant };

        const pot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.105, 0.085, 0.105, 14),
            new THREE.MeshStandardMaterial({ color: this.mode === 'commercial' ? 0x0f766e : 0x7c3aed, roughness: 0.65 })
        );
        pot.position.set(x, y + 0.05, z);
        pot.castShadow = true;
        pot.userData.slot = slotData;
        this.group.add(pot);
        this.interactiveObjects.push(pot);

        const base = new THREE.Mesh(
            new THREE.SphereGeometry(0.095, 14, 8),
            new THREE.MeshStandardMaterial({
                color: statusColor,
                roughness: 0.62,
                emissive: statusColor,
                emissiveIntensity: 0.08,
            })
        );
        base.scale.set(1.15, 0.58, 1.05);
        base.position.set(x, y + 0.135, z);
        base.castShadow = true;
        base.userData.slot = slotData;
        this.group.add(base);
        this.interactiveObjects.push(base);

        if (this.mode === 'commercial') {
            const ring = new THREE.Mesh(
                new THREE.TorusGeometry(0.14, 0.011, 8, 28),
                new THREE.MeshStandardMaterial({
                    color: statusColor,
                    emissive: statusColor,
                    emissiveIntensity: plant.status === 'danger' ? 0.45 : plant.status === 'warning' ? 0.25 : 0.08,
                    roughness: 0.45
                })
            );
            ring.rotation.x = Math.PI / 2;
            ring.position.set(x, y + 0.03, z);
            ring.userData.slot = slotData;
            this.group.add(ring);
            this.interactiveObjects.push(ring);

            const cropLabel = this.createTextSprite(shortPlantLabel(plant.name || plant.species), {
                bg: 'rgba(15,23,42,.84)',
                fg: '#ffffff',
                font: '800 24px Inter, system-ui, sans-serif'
            });
            cropLabel.position.set(x, y + 0.34, z + 0.03);
            cropLabel.scale.set(0.32, 0.1, 1);
            cropLabel.userData.slot = slotData;
            this.group.add(cropLabel);
            this.interactiveObjects.push(cropLabel);
        } else {
            const emojiSprite = this.createEmojiSprite(plant.emoji || emojiForPlant(plant.name || plant.species));
            emojiSprite.position.set(x, y + 0.335, z + 0.03);
            emojiSprite.scale.set(0.36, 0.36, 1);
            emojiSprite.userData.slot = slotData;
            this.group.add(emojiSprite);
            this.interactiveObjects.push(emojiSprite);
        }

        if (plant.status === 'warning' || plant.status === 'danger') {
            const badge = this.createTextSprite(plant.status === 'danger' ? 'CRITICAL' : 'WARN', {
                bg: plant.status === 'danger' ? 'rgba(220,38,38,.95)' : 'rgba(245,158,11,.95)',
                fg: '#ffffff',
                font: '800 24px Inter, system-ui, sans-serif'
            });
            badge.position.set(x, y + 0.49, z + 0.04);
            badge.scale.set(0.34, 0.12, 1);
            badge.userData.slot = slotData;
            this.group.add(badge);
            this.interactiveObjects.push(badge);
        }
    },

    createEmojiSprite(emoji) {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 128, 128);
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        ctx.beginPath();
        ctx.arc(64, 64, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(15,23,42,0.12)';
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.font = '72px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji || '🌱', 64, 67);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
        const sprite = new THREE.Sprite(material);
        sprite.userData.texture = texture;
        return sprite;
    },

    createTextSprite(text, options = {}) {
        const canvas = document.createElement('canvas');
        canvas.width = 384;
        canvas.height = 96;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = options.bg || 'rgba(255,255,255,.92)';
        roundRectPath(ctx, 8, 16, canvas.width - 16, 64, 22);
        ctx.fill();
        ctx.fillStyle = options.fg || '#0f172a';
        ctx.font = options.font || '800 30px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, 49);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
        const sprite = new THREE.Sprite(material);
        sprite.userData.texture = texture;
        return sprite;
    },

    addEmptySlot(x, y, z, index) {
        const slot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.09, 0.09, 0.022, 16),
            new THREE.MeshStandardMaterial({ color: 0xbfd7ef, transparent: true, opacity: 0.58, roughness: 0.8 })
        );
        slot.position.set(x, y + 0.015, z);
        slot.userData.slot = {
            index,
            tier: Math.floor(index / this.rack.slotsPerTier) + 1,
            slot: (index % this.rack.slotsPerTier) + 1,
            plant: null
        };
        this.group.add(slot);
        this.interactiveObjects.push(slot);
    },

    addGamifiedBadges(rackW, totalH) {
        const coinMat = new THREE.MeshStandardMaterial({
            color: 0xfacc15,
            emissive: 0xf59e0b,
            emissiveIntensity: 0.3,
            metalness: 0.25,
            roughness: 0.35,
        });

        for (let i = 0; i < 4; i++) {
            const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.014, 20), coinMat);
            coin.rotation.x = Math.PI / 2;
            coin.position.set((i - 1.5) * rackW / 4, totalH + 0.08 + (i % 2) * 0.06, -0.46);
            this.group.add(coin);
        }
    },

    addCommercialDevices(rackW, rackD, totalH) {
        const fanMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.35, roughness: 0.4 });
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.035, 20), fanMat);
        hub.rotation.x = Math.PI / 2;
        hub.position.set(rackW / 2 + 0.28, totalH * 0.56, 0.02);
        hub.userData.isFanHub = true;
        this.group.add(hub);

        for (let i = 0; i < 3; i++) {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.035, 0.012), fanMat);
            blade.position.copy(hub.position);
            blade.rotation.z = (Math.PI * 2 / 3) * i;
            blade.userData.isFanBlade = true;
            this.group.add(blade);
        }

        const pumpMat = new THREE.MeshStandardMaterial({
            color: 0x2563eb,
            emissive: 0x38bdf8,
            emissiveIntensity: 0.4,
            roughness: 0.45
        });
        const pump = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.18, 0.18), pumpMat);
        pump.position.set(-rackW / 2 - 0.22, 0.12, rackD / 2 + 0.12);
        this.group.add(pump);

        const pumpLabel = this.createTextSprite('PUMP', {
            bg: 'rgba(37,99,235,.92)',
            fg: '#ffffff',
            font: '800 26px Inter, system-ui, sans-serif'
        });
        pumpLabel.position.set(pump.position.x, pump.position.y + 0.2, pump.position.z);
        pumpLabel.scale.set(0.34, 0.12, 1);
        this.group.add(pumpLabel);
    },

    renderFallback() {
        this.fallbackMode = true;
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) return;

        this.resizeHandler = () => this.drawFallback();
        window.addEventListener('resize', this.resizeHandler);
        this.canvas.onclick = (event) => this.handleFallbackClick(event);
        this.drawFallback();
    },

    drawFallback() {
        if (!this.canvas || !this.ctx) return;

        const rect = this.canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.max(240, rect.width || this.canvas.parentElement?.clientWidth || 360);
        const height = Math.max(220, rect.height || 220);
        this.canvas.width = Math.floor(width * dpr);
        this.canvas.height = Math.floor(height * dpr);
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        drawRackPreview(this.ctx, width, height, this.rack, this.slotPlants, {
            backgroundTop: this.mode === 'commercial' ? '#e8f7ef' : '#eaf4ff',
            backgroundBottom: this.mode === 'commercial' ? '#dff4e8' : '#dbeafe',
            text: '#1f2937',
            shelf: '#94a3b8',
            pole: '#64748b',
            led: this.mode === 'commercial' ? '#0f766e' : '#8b5cf6',
        });
    },

    handleCanvasHover(event) {
        if (!this.canvas || !this.raycaster || !this.camera) return;
        this.canvas.style.cursor = this.pickSlot(event) ? 'pointer' : 'grab';
    },

    handleCanvasClick(event) {
        if (this.pointerDown) {
            const moved = Math.hypot(event.clientX - this.pointerDown.x, event.clientY - this.pointerDown.y);
            this.pointerDown = null;
            if (moved > 6) return;
        }
        const hit = this.pickSlot(event);
        if (!hit?.userData?.slot) {
            this.showFarmSummary();
            return;
        }
        this.showSlotDetail(hit.userData.slot);
    },

    handleFallbackClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const col = Math.max(0, Math.min(this.rack.slotsPerTier - 1, Math.floor(((event.clientX - rect.left) / rect.width) * this.rack.slotsPerTier)));
        const row = Math.max(0, Math.min(this.rack.tiers - 1, Math.floor(((event.clientY - rect.top) / rect.height) * this.rack.tiers)));
        const index = row * this.rack.slotsPerTier + col;
        this.showSlotDetail({
            index,
            tier: row + 1,
            slot: col + 1,
            plant: this.slotPlants[index]
        });
    },

    pickSlot(event) {
        if (!this.interactiveObjects.length) return null;
        const rect = this.canvas.getBoundingClientRect();
        this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.pointer, this.camera);
        return this.raycaster.intersectObjects(this.interactiveObjects, false)[0]?.object || null;
    },

    createDetailPanel() {
        const parent = this.canvas?.parentElement;
        if (!parent) return;
        ensureFullscreenStyles();
        parent.classList.add('farm-canvas-host');
        this.fullscreenHandler = () => {
            if (this.fullscreenButton) {
                this.fullscreenButton.textContent = document.fullscreenElement === parent ? '×' : '⛶';
                this.fullscreenButton.title = document.fullscreenElement === parent ? 'Exit 3D farm view' : 'Expand 3D farm';
            }
            setTimeout(() => this.resize(), 80);
        };
        document.addEventListener('fullscreenchange', this.fullscreenHandler);
        parent.querySelector('.farm-slot-detail')?.remove();
        const panel = document.createElement('div');
        panel.className = 'farm-slot-detail';
        panel.style.cssText = `
            position:absolute;top:12px;left:12px;right:12px;z-index:6;
            background:rgba(255,255,255,.92);border:1px solid rgba(148,163,184,.35);
            border-radius:16px;padding:10px 12px;box-shadow:0 12px 30px rgba(15,23,42,.12);
            backdrop-filter:blur(8px);display:none;pointer-events:auto;color:var(--text,#111);
        `;
        parent.appendChild(panel);
        this.detailPanel = panel;

        parent.querySelector('.farm-fullscreen-btn')?.remove();
        if (this.mode === 'commercial') {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'farm-fullscreen-btn';
            button.textContent = '⛶';
            button.title = 'Expand 3D farm';
            button.setAttribute('aria-label', 'Expand 3D farm');
            button.style.cssText = `
                position:absolute;top:12px;right:12px;z-index:7;width:38px;height:38px;
                border:1px solid rgba(148,163,184,.45);border-radius:12px;background:rgba(255,255,255,.92);
                color:#0f172a;font-size:18px;font-weight:900;box-shadow:0 10px 24px rgba(15,23,42,.12);
                cursor:pointer;backdrop-filter:blur(8px);
            `;
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                this.toggleFullscreen();
            });
            parent.appendChild(button);
            this.fullscreenButton = button;
        }
    },

    async toggleFullscreen() {
        if (this.mode !== 'commercial') return;
        const host = this.canvas?.parentElement;
        if (!host) return;
        try {
            if (document.fullscreenElement === host) {
                await document.exitFullscreen();
            } else {
                await host.requestFullscreen();
            }
        } catch (error) {
            console.warn('[FarmCanvas] Fullscreen unavailable:', error.message);
            window.showToast?.('info', 'Fullscreen is unavailable in this browser context');
        }
    },

    showFarmSummary() {
        const filled = this.slotPlants.filter(Boolean).length;
        this.showDetailHTML(`
            <div style="display:flex;align-items:center;gap:10px;">
                <div style="font-size:12px;font-weight:900;width:38px;text-align:center;color:${this.mode === 'commercial' ? '#0f766e' : '#16a34a'};">${this.mode === 'commercial' ? '3D' : '🌿'}</div>
                <div style="flex:1;min-width:0;">
                    <div style="font-size:12px;font-weight:900;color:var(--text,#111);">${escapeHTML(this.rack.label)}</div>
                    <div style="font-size:11px;color:var(--muted,#667085);">${filled}/${this.rack.total} slots filled · click a plant or empty tray</div>
                </div>
            </div>
        `);
    },

    showSlotDetail(slotInfo) {
        const plant = slotInfo.plant;
        const status = plant?.status || 'empty';
        const statusColor = status === 'danger' ? '#dc2626' : status === 'warning' ? '#d97706' : plant ? '#059669' : '#64748b';
        const modeLine = this.mode === 'commercial'
            ? `Zone ${String.fromCharCode(64 + slotInfo.tier)} · Rack ${this.rack.id}`
            : 'Beginner grow tray';
        const icon = this.mode === 'commercial' ? `T${slotInfo.tier}:S${slotInfo.slot}` : (plant?.emoji || '□');
        this.showDetailHTML(`
            <div style="display:flex;align-items:center;gap:10px;">
                <div style="font-size:${this.mode === 'commercial' ? '11px' : '30px'};font-weight:900;width:38px;text-align:center;color:${statusColor};">${icon}</div>
                <div style="flex:1;min-width:0;">
                    <div style="display:flex;align-items:center;gap:6px;min-width:0;">
                        <div style="font-size:13px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHTML(plant?.name || 'Empty tray')}</div>
                        <span style="font-size:9px;font-weight:900;color:white;background:${statusColor};border-radius:999px;padding:3px 7px;text-transform:uppercase;">${escapeHTML(status)}</span>
                    </div>
                    <div style="font-size:11px;color:var(--muted,#667085);margin-top:2px;">Tier ${slotInfo.tier} · Slot ${slotInfo.slot} · ${modeLine}</div>
                    <div style="font-size:11px;color:var(--sub,#64748b);margin-top:5px;">${escapeHTML(detailMessage(plant, this.mode))}</div>
                </div>
            </div>
        `);
    },

    showDetailHTML(html) {
        if (!this.detailPanel) this.createDetailPanel();
        if (!this.detailPanel) return;
        this.detailPanel.innerHTML = html;
        this.detailPanel.style.display = 'block';
        clearTimeout(this.detailPanel._hideTimer);
        this.detailPanel._hideTimer = setTimeout(() => {
            if (this.detailPanel) this.detailPanel.style.display = 'none';
        }, 5200);
    },

    resize() {
        if (this.fallbackMode) {
            this.drawFallback();
            return;
        }
        if (!this.canvas || !this.renderer || !this.camera) return;
        const rect = this.canvas.getBoundingClientRect();
        const width = Math.max(240, rect.width || this.canvas.parentElement?.clientWidth || 360);
        const height = Math.max(220, rect.height || 220);
        this.renderer.setSize(width, height, false);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    },

    animate() {
        this.frame += 1;
        if (this.group) {
            if (this.mode === 'beginner' && !this.userInteracted) {
                this.group.rotation.y = Math.sin(this.frame / 95) * 0.28;
                this.group.position.y += Math.sin(this.frame / 50) * 0.00025;
            }
            this.group.children.forEach(child => {
                if (child.userData?.isFanBlade) child.rotation.z += 0.18;
            });
        }
        if (this.controls) this.controls.update();
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
        this.rafId = requestAnimationFrame(() => this.animate());
    },

    destroy() {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.rafId = null;

        if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
        this.resizeHandler = null;
        if (this.fullscreenHandler) document.removeEventListener('fullscreenchange', this.fullscreenHandler);
        this.fullscreenHandler = null;

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

        if (this.controls) this.controls.dispose();
        if (this.renderer) this.renderer.dispose();
        if (this.canvas) {
            this.canvas.onclick = null;
            this.canvas.onmousemove = null;
            this.canvas.onpointerdown = null;
            this.canvas.ondblclick = null;
            this.canvas.style.cursor = '';
            this.canvas.style.touchAction = '';
        }
        if (this.detailPanel) this.detailPanel.remove();
        if (this.fullscreenButton) this.fullscreenButton.remove();

        this.canvas = null;
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.group = null;
        this.ctx = null;
        this.field = null;
        this.slotPlants = [];
        this.fallbackMode = false;
        this.raycaster = null;
        this.pointer = null;
        this.interactiveObjects = [];
        this.detailPanel = null;
        this.fullscreenButton = null;
        this.controls = null;
        this.pointerDown = null;
        this.userInteracted = false;
        this.mode = 'beginner';
    },
};

function drawRackPreview(ctx, width, height, rack, slotPlants, theme) {
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, theme.backgroundTop);
    bg.addColorStop(1, theme.backgroundBottom);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(width * 0.5, height * 0.53);
    ctx.transform(1, -0.12, -0.35, 0.92, 0, 0);

    const { tiers, slotsPerTier } = rack;
    const rackWidth = Math.min(width * 0.72, 250);
    const rackDepth = 54;
    const tierGap = Math.min(54, (height - 62) / Math.max(tiers, 1));
    const totalHeight = tierGap * (tiers - 1) + 18;
    const startY = -totalHeight / 2;
    const slotGap = rackWidth / Math.max(slotsPerTier, 1);

    ctx.strokeStyle = theme.pole;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    [-1, 1].forEach(side => {
        ctx.beginPath();
        ctx.moveTo(side * rackWidth / 2, startY - 18);
        ctx.lineTo(side * rackWidth / 2, startY + totalHeight + 28);
        ctx.stroke();
    });

    for (let tier = 0; tier < tiers; tier++) {
        const y = startY + tier * tierGap;
        drawIsoShelf(ctx, -rackWidth / 2, y, rackWidth, rackDepth, theme.shelf);

        ctx.fillStyle = theme.led;
        roundedRect(ctx, -rackWidth * 0.36, y - 24, rackWidth * 0.72, 5, 3);
        ctx.fill();

        for (let slot = 0; slot < slotsPerTier; slot++) {
            const index = tier * slotsPerTier + slot;
            const plant = slotPlants[index];
            const x = -rackWidth / 2 + slotGap * (slot + 0.5);
            const baseY = y - 4;

            ctx.fillStyle = plant ? '#7c3aed' : 'rgba(148, 163, 184, 0.42)';
            ctx.beginPath();
            ctx.ellipse(x, baseY, 12, 7, 0, 0, Math.PI * 2);
            ctx.fill();

            if (plant) drawFallbackPlant(ctx, x, baseY, plant, index);
        }
    }

    ctx.restore();

    ctx.fillStyle = 'rgba(37, 99, 235, 0.08)';
    ctx.beginPath();
    ctx.ellipse(width * 0.5, height - 18, width * 0.32, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = theme.text;
    ctx.font = '700 11px Inter, system-ui, sans-serif';
    ctx.fillText(`${rack.tiers} tiers · ${slotPlants.filter(Boolean).length}/${rack.total} plants`, 16, height - 13);
}

function drawIsoShelf(ctx, x, y, w, d, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w - d * 0.3, y + d * 0.28);
    ctx.lineTo(x - d * 0.3, y + d * 0.28);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(15, 23, 42, 0.14)';
    ctx.beginPath();
    ctx.moveTo(x - d * 0.3, y + d * 0.28);
    ctx.lineTo(x + w - d * 0.3, y + d * 0.28);
    ctx.lineTo(x + w - d * 0.3, y + d * 0.28 + 8);
    ctx.lineTo(x - d * 0.3, y + d * 0.28 + 8);
    ctx.closePath();
    ctx.fill();
}

function drawFallbackPlant(ctx, x, y, plant, index) {
    const colors = ['#22c55e', '#4ade80', '#16a34a', '#65a30d', '#10b981'];
    const color = plant.emoji === '🍅' ? '#ef4444' : plant.emoji === '🌶️' ? '#dc2626' : colors[index % colors.length];

    ctx.strokeStyle = '#365314';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - 5);
    ctx.lineTo(x, y - 24);
    ctx.stroke();

    ctx.fillStyle = color;
    for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 / 5) * i;
        ctx.save();
        ctx.translate(x + Math.cos(angle) * 8, y - 23 + Math.sin(angle) * 5);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, 9, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function roundedRect(ctx, x, y, w, h, r) {
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

function roundRectPath(ctx, x, y, w, h, r) {
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

function detailMessage(plant, mode) {
    if (!plant) {
        return mode === 'commercial'
            ? 'Available production slot. Use Manage Plants to assign crop and zone data.'
            : 'Empty spot. Add a plant when you are ready.';
    }
    if (plant.status === 'danger') return 'Critical status. Check sensor alerts and act before the next cycle.';
    if (plant.status === 'warning') return 'Needs attention. Review water, pH, or light conditions.';
    return mode === 'commercial'
        ? 'Healthy slot. This tray is part of your live commercial layout.'
        : 'Healthy and growing. Keep monitoring the live sensor cards.';
}

function shortPlantLabel(name = '') {
    const cleaned = String(name || 'Plant').trim().replace(/[^a-zA-Z0-9 ]/g, '');
    if (!cleaned) return 'PLANT';
    const parts = cleaned.split(/\s+/).filter(Boolean);
    const label = parts.length > 1
        ? parts.map(part => part[0]).join('')
        : cleaned.slice(0, 4);
    return label.toUpperCase();
}

function ensureFullscreenStyles() {
    if (document.getElementById('farm-canvas-fullscreen-style')) return;
    const style = document.createElement('style');
    style.id = 'farm-canvas-fullscreen-style';
    style.textContent = `
        .farm-canvas-host:fullscreen {
            width:100vw !important;
            height:100vh !important;
            margin:0 !important;
            padding:0 !important;
            background:#06130d !important;
            display:block !important;
        }
        .farm-canvas-host:fullscreen canvas {
            width:100vw !important;
            height:100vh !important;
            border-radius:0 !important;
        }
        .farm-canvas-host:fullscreen .farm-slot-detail {
            top:16px !important;
            left:16px !important;
            right:auto !important;
            width:min(430px, calc(100vw - 96px)) !important;
        }
        .farm-canvas-host:fullscreen .farm-fullscreen-btn {
            top:16px !important;
            right:16px !important;
        }
    `;
    document.head.appendChild(style);
}

function escapeHTML(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getCurrentField() {
    const saved = loadSavedFarms();
    return AppState.currentFarm
        || saved.find(farm => farm.id === AppState.currentFarmId)
        || AppState.newFarm
        || saved[saved.length - 1]
        || null;
}

function loadSavedFarms() {
    try {
        return JSON.parse(localStorage.getItem(FARMS_STORAGE_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function resolveRack(field) {
    if (field?.rackConfig && Number(field.rackConfig.tiers) && Number(field.rackConfig.slotsPerTier)) {
        const tiers = Math.max(1, Number.parseInt(field.rackConfig.tiers, 10) || 3);
        const slotsPerTier = Math.max(1, Number.parseInt(field.rackConfig.slotsPerTier, 10) || 3);
        return {
            id: field.rackConfig.id || 'photo-detected',
            label: field.rackConfig.label || 'Photo-detected Rack',
            tiers,
            slotsPerTier,
            total: Math.max(
                Number.parseInt(field.rackConfig.total, 10) || 0,
                tiers * slotsPerTier,
                Number.parseInt(field?.plantSlots, 10) || 0
            ),
            shape: field.rackConfig.shape || 'rack',
        };
    }
    const inferred = inferRackFromSavedField(field);
    if (inferred) return inferred;
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

function inferRackFromSavedField(field) {
    const rawRack = String(field?.rackTypeId || field?.rackType || field?.rackLabel || '').toLowerCase();
    const wantsPhotoDetected = rawRack.includes('photo') || rawRack.includes('detected') || rawRack.includes('custom');
    const plantSlots = Number.parseInt(field?.plantSlots, 10) || sumPlantSlots(field?.plants) || 0;
    if (!wantsPhotoDetected && plantSlots <= 9) return null;
    if (!plantSlots || plantSlots <= 9) return null;

    const slotsPerTier = plantSlots >= 18 ? 6 : plantSlots >= 16 ? 4 : 3;
    const tiers = Math.max(2, Math.ceil(plantSlots / slotsPerTier));
    return {
        id: 'photo-detected',
        label: 'Photo-detected Rack',
        tiers,
        slotsPerTier,
        total: Math.max(plantSlots, tiers * slotsPerTier),
        shape: rawRack.includes('tower') ? 'tower' : rawRack.includes('wall') ? 'wall' : 'rack',
    };
}

function sumPlantSlots(plants) {
    if (!Array.isArray(plants)) return 0;
    return plants.reduce((sum, plant) => sum + (Number.parseInt(plant.slots || plant.count || 1, 10) || 1), 0);
}

function resolveSlotPlants(field, rack) {
    const sourcePlants = Array.isArray(field?.plants) ? field.plants : [];
    const slots = Array(rack.total).fill(null);
    const used = new Set();

    sourcePlants.forEach(plant => {
        if (plant.slotIndex !== undefined && plant.slotIndex !== null) {
            const index = Number(plant.slotIndex);
            if (Number.isInteger(index) && index >= 0 && index < rack.total) {
                slots[index] = normalizePlantForSlot(plant, field);
                used.add(index);
            }
            return;
        }

        const count = Math.max(1, Number.parseInt(plant.slots || plant.count || 1, 10) || 1);
        for (let i = 0; i < count; i++) {
            const index = firstFreeSlot(slots, used);
            if (index === -1) return;
            slots[index] = normalizePlantForSlot(plant, field);
            used.add(index);
        }
    });

    if (slots.some(Boolean)) return slots;

    const fallbackCount = Math.min(rack.total, Number.parseInt(field?.plantSlots || field?.plants || 0, 10) || countTiles());
    const fallbackName = field?.targetPlant || 'Plant';
    for (let i = 0; i < fallbackCount; i++) {
        slots[i] = {
            name: fallbackName,
            emoji: emojiForPlant(fallbackName),
            species: speciesKey(fallbackName),
            status: 'healthy',
        };
    }

    return slots;
}

function normalizePlantForSlot(plant, field) {
    const name = plant.name || field?.targetPlant || 'Plant';
    return {
        name,
        emoji: plant.emoji || emojiForPlant(name),
        species: plant.species || speciesKey(name),
        status: plant.status || 'healthy',
    };
}

function firstFreeSlot(slots, used) {
    for (let i = 0; i < slots.length; i++) {
        if (!slots[i] && !used.has(i)) return i;
    }
    return -1;
}
function countTiles() {
    return (AppState.tiles || []).filter(tile => tile?.plant).length;
}

function speciesKey(name = '') {
    return String(name || 'plant').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function emojiForPlant(name = '') {
    const key = String(name).toLowerCase();
    if (key.includes('lettuce') || key.includes('cabbage') || key.includes('kale')) return '🥬';
    if (key.includes('tomato')) return '🍅';
    if (key.includes('chili') || key.includes('pepper')) return '🌶️';
    if (key.includes('strawberry')) return '🍓';
    if (key.includes('cucumber')) return '🥒';
    if (key.includes('carrot')) return '🥕';
    if (key.includes('basil') || key.includes('mint') || key.includes('spinach')) return '🌿';
    return '🌱';
}


