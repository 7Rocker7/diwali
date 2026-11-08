/**
 * Diwali Vibrant Fireworks & Sparkler Particle Engine
 * Highly optimized HTML5 Canvas particle system with physics,
 * luminous blend modes, flower petal showers, and cursor sparkler trails.
 */

class FireworksEngine {
  constructor() {
    this.canvas = document.getElementById('fireworks-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.fireworks = [];
    this.particles = [];
    this.sparklers = [];
    this.petals = [];
    this.goldenDust = [];

    this.autoLaunchTimer = 0;
    this.autoLaunchInterval = 110; // frames between ambient fireworks
    this.isRunning = true;
    this.sparklerModeActive = false;
    this.pointer = { x: this.width / 2, y: this.height / 2, isDown: false };

    // Vibrant Festival Color Palettes
    this.colorPalettes = [
      ['#FFD700', '#FFA500', '#FFE600', '#FF8C00', '#FFF3B0'], // Royal Golden Glow
      ['#FF007F', '#D81B60', '#FF1744', '#E040FB', '#FF80AB'], // Festive Rani Pink & Magenta
      ['#00E676', '#00B4D8', '#00F5D4', '#70E000', '#38B000'], // Peacock Emerald & Jewel Cyan
      ['#FF9933', '#FF5722', '#FF3D00', '#FFAB00', '#FF6D00'], // Saffron & Flame Orange
      ['#9D4EDD', '#7B2CBF', '#C77DFF', '#E0AAFF', '#5A189A'], // Royal Midnight Violet
      ['#00F5D4', '#FFD166', '#EF476F', '#06D6A0', '#118AB2'], // Multi-Color Rangoli Carnival
    ];

    this.init();
  }

  init() {
    if (!this.canvas) return;
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Init ambient golden dust
    for (let i = 0; i < 45; i++) {
      this.goldenDust.push(new GoldenDust(this.width, this.height));
    }

    // Init ambient flower petals (Marigold & Rose)
    for (let i = 0; i < 24; i++) {
      this.petals.push(new FlowerPetal(this.width, this.height, Math.random() * this.height));
    }

    this.setupInteractions();
    this.loop();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    this.ctx.scale(this.dpr, this.dpr);
  }

  setupInteractions() {
    const handleMove = (x, y) => {
      this.pointer.x = x;
      this.pointer.y = y;
      // Emit sparkler particles on pointer movement
      this.addSparklerTrail(x, y, this.sparklerModeActive ? 5 : 2);
    };

    window.addEventListener('mousemove', (e) => {
      handleMove(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('mousedown', (e) => {
      // Don't trigger if clicking interactive buttons or inputs
      if (e.target.closest('button, input, select, textarea, a, .interactive-card, .diya-item, .modal')) return;
      this.pointer.isDown = true;
      this.createDirectBurst(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', () => {
      this.pointer.isDown = false;
    });

    window.addEventListener('touchstart', (e) => {
      if (e.target.closest('button, input, select, textarea, a, .interactive-card, .diya-item, .modal')) return;
      if (e.touches.length > 0) {
        this.pointer.isDown = true;
        this.createDirectBurst(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.pointer.isDown = false;
    });
  }

  getRandomPalette() {
    return this.colorPalettes[Math.floor(Math.random() * this.colorPalettes.length)];
  }

  launchRocket(targetX = null, targetY = null) {
    const startX = targetX ? targetX + (Math.random() * 80 - 40) : Math.random() * (this.width * 0.8) + this.width * 0.1;
    const endX = targetX !== null ? targetX : Math.random() * (this.width * 0.7) + this.width * 0.15;
    const endY = targetY !== null ? targetY : Math.random() * (this.height * 0.45) + 60;
    const palette = this.getRandomPalette();

    this.fireworks.push(new Rocket(startX, this.height + 10, endX, endY, palette));

    if (window.festiveAudio) {
      window.festiveAudio.playRocket();
    }
  }

  createDirectBurst(x, y, palette = null, particleCount = 65) {
    const selectedPalette = palette || this.getRandomPalette();
    const burstType = Math.random() > 0.3 ? 'peony' : (Math.random() > 0.5 ? 'ring' : 'chrysanthemum');

    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new FireworkParticle(x, y, selectedPalette, burstType));
    }

    // Add extra glowing flash
    this.particles.push(new FlashHalo(x, y, selectedPalette[0]));

    if (window.festiveAudio) {
      window.festiveAudio.playFirework();
    }
  }

  createAnaarBurst(x, y) {
    // Flowerpot (Anaar) vertical fountain
    const palette = ['#FFD700', '#FFA500', '#FFF3B0', '#FF3D00', '#00E676'];
    for (let i = 0; i < 90; i++) {
      const p = new FireworkParticle(x, y, palette, 'fountain');
      this.particles.push(p);
    }
    if (window.festiveAudio) {
      window.festiveAudio.playFirework();
    }
  }

  addSparklerTrail(x, y, count = 2) {
    const palette = this.sparklerModeActive 
      ? ['#FFD700', '#FF9933', '#FF007F', '#00F5D4', '#FFFFFF']
      : ['#FFE082', '#FFD54F', '#FFA000', '#FFF8E1'];

    for (let i = 0; i < count; i++) {
      this.sparklers.push(new SparklerParticle(x, y, palette));
    }

    if (this.sparklerModeActive && Math.random() > 0.7 && window.festiveAudio) {
      window.festiveAudio.playSparklerCrackles(1);
    }
  }

  grandFinale(durationMs = 4000) {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed > durationMs) {
        clearInterval(interval);
        return;
      }
      const rx = Math.random() * (this.width * 0.8) + this.width * 0.1;
      const ry = Math.random() * (this.height * 0.5) + 60;
      this.createDirectBurst(rx, ry, this.getRandomPalette(), 80);
      
      // Shower extra petals
      for (let p = 0; p < 3; p++) {
        this.petals.push(new FlowerPetal(this.width, this.height, 0));
      }
    }, 180);
  }

  loop() {
    if (!this.isRunning) return;

    // Rich translucent fade creates luminous light trails
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Switch to additive lighting for glowing festive sparks
    this.ctx.globalCompositeOperation = 'lighter';

    // 1. Update & Draw Golden Bokeh Dust
    for (let i = 0; i < this.goldenDust.length; i++) {
      this.goldenDust[i].update(this.width, this.height);
      this.goldenDust[i].draw(this.ctx);
    }

    // 2. Auto Launch Ambient Fireworks
    this.autoLaunchTimer++;
    if (this.autoLaunchTimer >= this.autoLaunchInterval) {
      this.autoLaunchTimer = 0;
      this.autoLaunchInterval = Math.floor(Math.random() * 80) + 70;
      this.launchRocket();
    }

    // 3. Update & Draw Rockets
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const r = this.fireworks[i];
      r.update();
      r.draw(this.ctx);
      if (r.exploded) {
        this.createDirectBurst(r.x, r.y, r.palette, 75);
        this.fireworks.splice(i, 1);
      }
    }

    // 4. Update & Draw Firework Burst Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update();
      p.draw(this.ctx);
      if (p.dead) {
        this.particles.splice(i, 1);
      }
    }

    // 5. Update & Draw Sparkler Trail Particles
    for (let i = this.sparklers.length - 1; i >= 0; i--) {
      const s = this.sparklers[i];
      s.update();
      s.draw(this.ctx);
      if (s.dead) {
        this.sparklers.splice(i, 1);
      }
    }

    // 6. Normal composite operation for gentle Flower Petals
    this.ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < this.petals.length; i++) {
      this.petals[i].update(this.width, this.height);
      this.petals[i].draw(this.ctx);
    }

    // Continuous sparkler emission if mouse is held down
    if (this.pointer.isDown && this.sparklerModeActive) {
      this.addSparklerTrail(this.pointer.x, this.pointer.y, 4);
    }

    requestAnimationFrame(() => this.loop());
  }
}

/**
 * Ascending Rocket Projectile
 */
class Rocket {
  constructor(x, y, targetX, targetY, palette) {
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.palette = palette;
    this.color = palette[0];

    const dx = targetX - x;
    const dy = targetY - y;
    const dist = Math.hypot(dx, dy);
    const speed = 12 + Math.random() * 3;

    this.vx = (dx / dist) * speed;
    this.vy = (dy / dist) * speed;
    this.exploded = false;
    this.trail = [];
  }

  update() {
    this.trail.push({ x: this.x, y: this.y, alpha: 1 });
    if (this.trail.length > 7) this.trail.shift();

    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.08; // subtle deceleration

    if (this.y <= this.targetY || this.vy >= -1) {
      this.exploded = true;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i < this.trail.length; i++) {
      const pt = this.trail[i];
      ctx.globalAlpha = (i / this.trail.length) * 0.9;
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();

    // Rocket glowing tip
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Exploding Particle with Physics & Glitter
 */
class FireworkParticle {
  constructor(x, y, palette, type = 'peony') {
    this.x = x;
    this.y = y;
    this.palette = palette;
    this.color = palette[Math.floor(Math.random() * palette.length)];
    this.type = type;

    let angle, speed;
    if (type === 'ring') {
      angle = Math.random() * Math.PI * 2;
      speed = 4.5 + Math.random() * 1.5;
    } else if (type === 'fountain') {
      angle = -Math.PI / 2 + (Math.random() * 0.8 - 0.4);
      speed = 7 + Math.random() * 6;
    } else {
      angle = Math.random() * Math.PI * 2;
      speed = Math.random() * 6.5 + 1.2;
    }

    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.friction = type === 'fountain' ? 0.97 : 0.95;
    this.gravity = type === 'fountain' ? 0.22 : 0.09;
    this.alpha = 1;
    this.decay = Math.random() * 0.016 + 0.012;
    this.radius = Math.random() * 2.8 + 1.5;
    this.sparkle = Math.random() > 0.5;
    this.dead = false;
  }

  update() {
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;

    if (this.alpha <= 0) {
      this.dead = true;
    }
  }

  draw(ctx) {
    if (this.dead) return;
    ctx.save();
    const currentAlpha = Math.max(0, this.alpha);
    ctx.globalAlpha = this.sparkle && Math.random() > 0.5 ? currentAlpha * 0.5 : currentAlpha;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Flash Halo on explosion center
 */
class FlashHalo {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 4;
    this.alpha = 0.85;
    this.dead = false;
  }

  update() {
    this.radius += 3.5;
    this.alpha -= 0.06;
    if (this.alpha <= 0) this.dead = true;
  }

  draw(ctx) {
    if (this.dead) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

/**
 * Sparkler (Phuljhadi) Particle
 */
class SparklerParticle {
  constructor(x, y, palette) {
    this.x = x + (Math.random() * 12 - 6);
    this.y = y + (Math.random() * 12 - 6);
    this.color = palette[Math.floor(Math.random() * palette.length)];
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.decay = Math.random() * 0.045 + 0.035;
    this.length = Math.random() * 7 + 3;
    this.dead = false;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.12; // gravity
    this.alpha -= this.decay;
    if (this.alpha <= 0) this.dead = true;
  }

  draw(ctx) {
    if (this.dead) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1.8;
    ctx.shadowBlur = 6;
    ctx.shadowColor = this.color;

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.vx * 1.5, this.y - this.vy * 1.5);
    ctx.stroke();
    ctx.restore();
  }
}

/**
 * Golden Bokeh / Fairy Dust
 */
class GoldenDust {
  constructor(w, h) {
    this.reset(w, h);
    this.y = Math.random() * h; // initial spread
  }

  reset(w, h) {
    this.x = Math.random() * w;
    this.y = h + Math.random() * 40;
    this.radius = Math.random() * 2.2 + 0.6;
    this.speedY = -(Math.random() * 0.45 + 0.2);
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.6 + 0.2;
    this.baseAlpha = this.alpha;
    this.pulseSpeed = Math.random() * 0.03 + 0.01;
    this.pulse = Math.random() * Math.PI;
  }

  update(w, h) {
    this.y += this.speedY;
    this.x += this.speedX;
    this.pulse += this.pulseSpeed;
    this.alpha = this.baseAlpha + Math.sin(this.pulse) * 0.2;

    if (this.y < -20 || this.x < -20 || this.x > w + 20) {
      this.reset(w, h);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
    ctx.fillStyle = '#FFE082';
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#FFD700';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Festive Falling Flower Petals (Marigold & Rose)
 */
class FlowerPetal {
  constructor(w, h, startY = null) {
    this.reset(w, h, startY);
  }

  reset(w, h, startY = null) {
    this.x = Math.random() * w;
    this.y = startY !== null ? startY : -30;
    this.size = Math.random() * 9 + 8;
    this.speedY = Math.random() * 1.2 + 0.7;
    this.speedX = Math.random() * 0.8 - 0.4;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.04;
    this.swing = Math.random() * Math.PI * 2;
    this.swingSpeed = Math.random() * 0.03 + 0.015;

    // Type: 60% Marigold (Orange/Gold), 40% Rose (Pink/Crimson)
    this.isMarigold = Math.random() > 0.4;
    this.color = this.isMarigold ? '#FF9E1B' : '#E63946';
    this.accentColor = this.isMarigold ? '#FFD000' : '#FF758F';
  }

  update(w, h) {
    this.y += this.speedY;
    this.swing += this.swingSpeed;
    this.x += Math.sin(this.swing) * 0.9 + this.speedX;
    this.rotation += this.rotSpeed;

    if (this.y > h + 40) {
      this.reset(w, h);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(Math.cos(this.swing), 1); // 3D flutter effect

    ctx.fillStyle = this.color;
    ctx.beginPath();
    // Petal teardrop / oval shape
    ctx.moveTo(0, -this.size);
    ctx.bezierCurveTo(this.size * 0.7, -this.size * 0.5, this.size * 0.7, this.size * 0.7, 0, this.size);
    ctx.bezierCurveTo(-this.size * 0.7, this.size * 0.7, -this.size * 0.7, -this.size * 0.5, 0, -this.size);
    ctx.fill();

    // Subtle petal highlight
    ctx.fillStyle = this.accentColor;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, this.size * 0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.fireworksEngine = new FireworksEngine();
});
