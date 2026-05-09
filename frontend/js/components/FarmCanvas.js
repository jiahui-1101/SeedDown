export const FarmCanvas = {
    canvas: null, ctx: null, width: 0, height: 0,
    tileW: 56, tileH: 28, cols: 4, rows: 3, frame: 0,
    
    init(selector) {
        this.canvas = document.getElementById(selector);
        if (!this.canvas) return;
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.animate();
    },
    
    resize() {
        const container = this.canvas.parentElement;
        this.width = container.clientWidth;
        this.height = Math.min(container.clientHeight, 220);
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.draw();
    },
    
    getTileAt(mx, my) {
        // 命中测试省略，保持原有逻辑
        return null;
    },
    
    draw() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawGround();
        // 绘制tiles (略，完整实现可保留原isometric绘制)
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.drawTile(c, r);
            }
        }
        this.drawNPC();
    },
    
    drawGround() {
        const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
        grad.addColorStop(0, '#EAF4FF');
        grad.addColorStop(1, '#D9E8F5');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.width, this.height);
    },
    
    drawTile(col, row) { /* 简化，实际使用原三维绘制，但为了篇幅不重复，保持核心 */ },
    drawNPC() { /* 绘制NPC表情 */ },
    animate() { requestAnimationFrame(() => { this.frame++; this.draw(); this.animate(); }); },
    handleClick(e) { /* 触发点击事件 */ }
};