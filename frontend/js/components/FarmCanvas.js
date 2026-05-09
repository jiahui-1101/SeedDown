import { AppState } from '../store.js';
import * as THREE from 'https://esm.sh/three@0.160.0';

const FARMS_STORAGE_KEY = 'user_farms';

const RACK_OPTIONS = {
    '3-tier': { id: '3-tier', label: '3-Tier Vertical', tiers: 3, slotsPerTier: 3, total: 9 },
    '5-tier': { id: '5-tier', label: '5-Tier Tower', tiers: 5, slotsPerTier: 4, total: 20 },
    wall: { id: 'wall', label: 'Wall Panel', tiers: 4, slotsPerTier: 5, total: 20 },
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
    rafId: null,
    resizeHandler: null,
    frame: 0,
    field: null,
    rack: RACK_OPTIONS['3-tier'],
    slotPlants: [],

    init(selector) {
        this.destroy();

        this.canvas = document.getElementById(selector);
        if (!this.canvas) return;

        this.field = getCurrentField();
        this.rack = resolveRack(this.field);
        this.slotPlants = resolveSlotPlants(this.field, this.rack);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xeaf4ff);
        this.scene.fog = new THREE.Fog(0xeaf4ff, 4, 10);

        this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
        this.camera.position.set(3.2, 2.4, 4.4);
        this.camera.lookAt(0, 1.0, 0);

        try {
            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                antialias: true,
                alpha: false,
                preserveDrawingBuffer: true,
            });
        } catch (error) {
            console.warn('[FarmCanvas] WebGL unavailable, using 2D fallback:', error.message);
            this.renderFallback();
            return;
        }
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;

        this.group = new THREE.Group();
        this.scene.add(this.group);

        this.addLights();
        this.buildFarm();

        this.resizeHandler = () => this.resize();
        window.addEventListener('resize', this.resizeHandler);
        this.canvas.onclick = () => window.showToast?.('info', `${this.rack.tiers} tiers · ${this.slotPlants.length}/${this.rack.total} plants`);

        this.resize();
        this.animate();
    },

    addLights() {
        this.scene.add(new THREE.AmbientLight(0x8fb5ff, 1.7));

        const sun = new THREE.DirectionalLight(0xffffff, 2.5);
        sun.position.set(4, 6, 5);
        sun.castShadow = true;
        sun.shadow.mapSize.set(1024, 1024);
        this.scene.add(sun);

        const grow = new THREE.PointLight(0x7c3aed, 1.4, 5);
        grow.position.set(0, 2.3, 0.8);
        this.scene.add(grow);
    },

    buildFarm() {
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(7, 7),
            new THREE.MeshStandardMaterial({ color: 0xdbeafe, roughness: 0.85 })
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
        const ledMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, emissive: 0x7c3aed, emissiveIntensity: 1.2 });

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

            for (let slot = 0; slot < slotsPerTier; slot++) {
                const index = tier * slotsPerTier + slot;
                const plant = this.slotPlants[index];
                const x = (slot - (slotsPerTier - 1) / 2) * slotW;
                const z = 0;
                const baseY = y + 0.05;

                if (plant) this.addPlant(x, baseY, z, plant, index);
                else this.addEmptySlot(x, baseY, z);
            }
        }

        this.addGamifiedBadges(rackW, totalH);
        this.group.position.y = tiers >= 5 ? -0.12 : 0.05;
    },

    addPlant(x, y, z, plant, index) {
        const palette = [0x22c55e, 0x4ade80, 0x16a34a, 0x65a30d, 0x86efac, 0x10b981];
        const emojiColor = plant.emoji ? EMOJI_COLORS[plant.emoji] : null;
        const statusColor = plant.status === 'danger'
            ? 0xef4444
            : plant.status === 'warning'
                ? 0xf59e0b
                : emojiColor || palette[index % palette.length];

        const pot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.105, 0.085, 0.105, 14),
            new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.65 })
        );
        pot.position.set(x, y + 0.05, z);
        pot.castShadow = true;
        this.group.add(pot);

        const stem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.012, 0.012, 0.15, 8),
            new THREE.MeshStandardMaterial({ color: 0x365314, roughness: 0.75 })
        );
        stem.position.set(x, y + 0.16, z);
        this.group.add(stem);

        const leafMat = new THREE.MeshStandardMaterial({
            color: statusColor,
            roughness: 0.5,
            emissive: statusColor,
            emissiveIntensity: plant.status === 'healthy' || !plant.status ? 0.08 : 0.16,
        });

        const leafCount = plant.emoji === '🍅' || plant.emoji === '🍓' ? 4 : 5;
        for (let i = 0; i < leafCount; i++) {
            const angle = (Math.PI * 2 / leafCount) * i;
            const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.105, 14, 8), leafMat);
            leaf.scale.set(1.3, 0.38, 0.72);
            leaf.position.set(x + Math.cos(angle) * 0.058, y + 0.23 + (i % 2) * 0.018, z + Math.sin(angle) * 0.052);
            leaf.rotation.set(0.22, angle, -0.25);
            leaf.castShadow = true;
            this.group.add(leaf);
        }
    },

    addEmptySlot(x, y, z) {
        const slot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.09, 0.09, 0.022, 16),
            new THREE.MeshStandardMaterial({ color: 0xbfd7ef, transparent: true, opacity: 0.58, roughness: 0.8 })
        );
        slot.position.set(x, y + 0.015, z);
        this.group.add(slot);
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

    resize() {
        if (!this.canvas || !this.renderer || !this.camera) return;
        const rect = this.canvas.getBoundingClientRect();
        const width = Math.max(320, rect.width || this.canvas.parentElement?.clientWidth || 360);
        const height = Math.max(220, rect.height || 220);
        this.renderer.setSize(width, height, false);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    },

    animate() {
        this.frame += 1;
        if (this.group) {
            this.group.rotation.y = Math.sin(this.frame / 95) * 0.28;
            this.group.position.y += Math.sin(this.frame / 50) * 0.00025;
        }
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

        if (this.scene) {
            this.scene.traverse(obj => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) {
                    if (Array.isArray(obj.material)) obj.material.forEach(mat => mat.dispose());
                    else obj.material.dispose();
                }
            });
        }

        if (this.renderer) this.renderer.dispose();

        this.canvas = null;
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.group = null;
        this.field = null;
        this.slotPlants = [];
    },
};

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
    const rawRack = String(field?.rackTypeId || field?.rackType || field?.rackLabel || '').toLowerCase();
    if (rawRack.includes('5')) return RACK_OPTIONS['5-tier'];
    if (rawRack.includes('wall') || rawRack.includes('grid')) return RACK_OPTIONS.wall;
    return RACK_OPTIONS['3-tier'];
}

function resolveSlotPlants(field, rack) {
    const sourcePlants = Array.isArray(field?.plants) ? field.plants : [];
    const slots = [];

    sourcePlants.forEach(plant => {
        const count = Math.max(1, Number.parseInt(plant.slots || plant.count || 1, 10) || 1);
        for (let i = 0; i < count; i++) {
            slots.push({
                name: plant.name || field?.targetPlant || 'Plant',
                emoji: plant.emoji || emojiForPlant(plant.name || field?.targetPlant),
                status: plant.status || 'healthy',
            });
        }
    });

    if (slots.length > 0) return slots.slice(0, rack.total);

    const fallbackCount = Math.min(rack.total, Number.parseInt(field?.plantSlots || field?.plants || 0, 10) || countTiles());
    const fallbackName = field?.targetPlant || 'Plant';
    for (let i = 0; i < fallbackCount; i++) {
        slots.push({
            name: fallbackName,
            emoji: emojiForPlant(fallbackName),
            status: 'healthy',
        });
    }

    return slots;
}

function countTiles() {
    return (AppState.tiles || []).filter(tile => tile?.plant).length;
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

