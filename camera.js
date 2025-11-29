window.Camera = {
  x: 0,
  y: 0,
  targetX: 0,
  targetY: 0,
  width: 160,
  height: 90,
  easing: 0.15,

  setTarget(playerX, playerY, playerW, playerH) {
    this.targetX = playerX + playerW / 2 - this.width / 2;
    this.targetY = playerY + playerH / 2 - this.height / 2;
  },

  update() {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    this.x += dx * this.easing;
    this.y += dy * this.easing;
  },

  clampToWorld(worldW, worldH) {
    this.x = Math.max(0, Math.min(this.x, worldW - this.width));
    this.y = Math.max(0, Math.min(this.y, worldH - this.height));
  },

  apply(ctx) {
    ctx.setTransform(1, 0, 0, 1, -Math.round(this.x), -Math.round(this.y));
  },

  reset(ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
};

// Safe register (only if init system exists)
if (typeof window.registerModule === "function") {
  window.registerModule('camera');
}
