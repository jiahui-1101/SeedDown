import { AppState } from '../store.js';

export const FarmCanvas = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    tileW: 72,
    tileH: 36,
    cols: 4,
    rows: 3,
    frame: 0,
    rafId: null,
    resizeHandler: null,

    init(selector) {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }

        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
            this.resizeHandler = null;
        }

        this.canvas = document.getElementById(selector);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) return;

        this.resizeHandler = () => this.resize();
        window.addEventListener('resize', this.resizeHandler);

        this.canvas.onclick = () => this.handleClick();
        this.resize();
        this.animate();
    },

    resize() {
        if (!this.canvas || !this.ctx) return;

        const rect = this.canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        this.width = Math.max(320, Math.floor(rect.width || 360));
        this.height = Math.max(220, Math.floor(rect.height || 220));

        this.canvas.width = Math.floor(this.width * dpr);
        this.canvas.height = Math.floor(this.height * dpr);
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        this.draw();
    },

    draw() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawBackground();
        this.drawRack();
        this.drawTiles();
        this.drawNPC();
    },

    drawBackground() {
        const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
        grad.addColorStop(0, '#eaf4ff');
        grad.addColorStop(1, '#dcecf8');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.width, this.height);
    },

    drawRack() {
        const cx = this.width / 2;
        const top = 44;
        const shelfW = Math.min(this.width - 82, 300);
        const gap = 48;

        this.ctx.lineWidth = 7;
        this.ctx.lineCap = 'round';
        this.ctx.strokeStyle = '#7b8aa0';
        this.ctx.beginPath();
        this.ctx.moveTo(cx - shelfW / 2, top - 8);
        this.ctx.lineTo(cx - shelfW / 2, top + gap * 2 + 26);
        this.ctx.moveTo(cx + shelfW / 2, top - 8);
        this.ctx.lineTo(cx + shelfW / 2, top + gap * 2 + 26);
        this.ctx.stroke();

        for (let i = 0; i < 3; i++) {
            const y = top + i * gap;
            this.ctx.fillStyle = '#9fb0c4';
            this.roundRect(cx - shelfW / 2, y, shelfW, 18, 8);
            this.ctx.fill();

            this.ctx.fillStyle = 'rgba(99,102,241,0.22)';
            this.roundRect(cx - shelfW / 2 + 28, y + 24, shelfW - 56, 7, 5);
            this.ctx.fill();
        }
    },

    drawTiles() {
        const tiles = AppState.tiles || [];
        const startX = this.width / 2 - 108;
        const startY = 64;

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const index = row * this.cols + col;
                const tile = tiles[index] || { status: 'empty' };
                this.drawTile(startX + col * 72, startY + row * 48, tile, index);
            }
        }
    },

    drawTile(x, y, tile, index) {
        const colors = {
            healthy: '#dcfce7',
            warning: '#fef3c7',
            danger: '#fee2e2',
            empty: '#eef6ff',
        };

        this.ctx.save();
        this.ctx.translate(x, y);

        this.ctx.fillStyle = 'rgba(15,23,42,0.12)';
        this.ctx.beginPath();
        this.ctx.ellipse(0, 20, 27, 10, 0, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = colors[tile.status] || colors.empty;
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -16);
        this.ctx.lineTo(30, 0);
        this.ctx.lineTo(0, 16);
        this.ctx.lineTo(-30, 0);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        if (tile.plant) {
            const bob = Math.sin((this.frame + index * 11) / 18) * 2;
            this.ctx.font = '24px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(tile.plant, 0, -15 + bob);

            const growth = Math.max(0, Math.min(100, tile.growth || 0));
            this.ctx.fillStyle = 'rgba(15,23,42,0.12)';
            this.roundRect(-24, 21, 48, 5, 4);
            this.ctx.fill();
            this.ctx.fillStyle = tile.status === 'danger' ? '#dc2626' : tile.status === 'warning' ? '#d97706' : '#059669';
            this.roundRect(-24, 21, 48 * growth / 100, 5, 4);
            this.ctx.fill();
        } else {
            this.ctx.strokeStyle = '#94a3b8';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(-8, 0);
            this.ctx.lineTo(8, 0);
            this.ctx.moveTo(0, -8);
            this.ctx.lineTo(0, 8);
            this.ctx.stroke();
        }

        this.ctx.restore();
    },

    drawNPC() {
        const x = this.width - 46;
        const y = 38 + Math.sin(this.frame / 25) * 3;
        this.ctx.font = '28px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('🧑‍🌾', x, y);
    },

    animate() {
        this.frame += 1;
        this.draw();
        this.rafId = requestAnimationFrame(() => this.animate());
    },

    handleClick() {
        window.showToast?.('info', 'Tap + Plant to add crops to this field');
    },

    roundRect(x, y, w, h, r) {
        const radius = Math.min(r, w / 2, h / 2);
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.arcTo(x + w, y, x + w, y + h, radius);
        this.ctx.arcTo(x + w, y + h, x, y + h, radius);
        this.ctx.arcTo(x, y + h, x, y, radius);
        this.ctx.arcTo(x, y, x + w, y, radius);
        this.ctx.closePath();
    },
};
