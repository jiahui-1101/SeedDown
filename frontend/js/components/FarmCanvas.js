import { AppState } from '../store.js';
import * as THREE from 'https://esm.sh/three@0.160.0';

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

    init(selector) {
        this.destroy();

        this.canvas = document.getElementById(selector);
        if (!this.canvas) return;

        this.field = getCurrentField();
        this.rack = resolveRack(this.field);
        this.slotPlants = resolveSlotPlants(this.field, this.rack);

        try {
            this.initThree();
        } catch (error) {
            console.warn('[FarmCanvas] WebGL unavailable, using preview fallback:', error.message);
            this.renderFallback();
        }
    },

    initThree() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xeaf4ff);
        this.scene.fog = new THREE.Fog(0xeaf4ff, 4, 10);

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
        this.group.add(base);

        const emojiSprite = this.createEmojiSprite(plant.emoji || emojiForPlant(plant.name || plant.species));
        emojiSprite.position.set(x, y + 0.335, z + 0.03);
        emojiSprite.scale.set(0.36, 0.36, 1);
        this.group.add(emojiSprite);
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

    renderFallback() {
        this.fallbackMode = true;
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) return;

        this.resizeHandler = () => this.drawFallback();
        window.addEventListener('resize', this.resizeHandler);
        this.canvas.onclick = () => window.showToast?.('info', 'WebGL is disabled here, showing preview mode');
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
            backgroundTop: '#eaf4ff',
            backgroundBottom: '#dbeafe',
            text: '#1f2937',
            shelf: '#94a3b8',
            pole: '#64748b',
            led: '#8b5cf6',
        });
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
                if (obj.userData?.texture) obj.userData.texture.dispose();
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
        this.ctx = null;
        this.field = null;
        this.slotPlants = [];
        this.fallbackMode = false;
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
    ctx.fillText(`${rack.tiers} tiers · ${slotPlants.length}/${rack.total} plants`, 16, height - 13);
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


