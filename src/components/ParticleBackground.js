/**
 * Lightweight canvas particle background.
 * Draws a field of connected particles with gentle motion.
 * Inspired by the sacred geometry system from the original CV site.
 */
/**
 * @param {HTMLCanvasElement} canvas
 * @returns {() => void} cleanup function
 */
export function initParticleBackground(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  let width = 0;
  let height = 0;
  /** @type {Array<{x: number, y: number, vx: number, vy: number, radius: number, baseX: number, baseY: number}>} */
  let particles = [];
  let animationId = 0;
  let mouseX = -1000;
  let mouseY = -1000;

  const PARTICLE_COUNT = 60;
  const CONNECTION_DIST = 140;
  const MOUSE_RADIUS = 180;
  const MOUSE_FORCE = 0.03;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Re-seed particles
    initParticles();
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
      });
    }
  }

  function isDark() {
    return document.documentElement.getAttribute('data-theme') !== 'light';
  }

  function draw() {
    if (!ctx) return;

    const dark = isDark();
    const particleColor = dark ? 'rgba(99, 102, 241, 0.6)' : 'rgba(79, 70, 229, 0.4)';
    const lineColor = dark ? 'rgba(99, 102, 241, 0.08)' : 'rgba(79, 70, 229, 0.06)';
    const glowColor = dark ? 'rgba(129, 140, 248, 0.25)' : 'rgba(99, 102, 241, 0.15)';

    ctx.clearRect(0, 0, width, height);

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Mouse repulsion
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS && dist > 0) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
        p.vx += (dx / dist) * force * MOUSE_FORCE;
        p.vy += (dy / dist) * force * MOUSE_FORCE;
      }

      // Return to base position
      p.vx += (p.baseX - p.x) * 0.002;
      p.vy += (p.baseY - p.y) * 0.002;

      // Damping
      p.vx *= 0.98;
      p.vy *= 0.98;

      p.x += p.vx;
      p.y += p.vy;

      // Bounds
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = particleColor;
      ctx.fill();

      // Draw glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
      ctx.fillStyle = glowColor;
      ctx.fill();
    }

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.5;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = lineColor.replace('0.08', String(alpha)).replace('0.06', String(alpha));
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(draw);
  }

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function onMouseLeave() {
    mouseX = -1000;
    mouseY = -1000;
  }

  // Init
  resize();
  draw();

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseleave', onMouseLeave);

  // Cleanup
  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', resize);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseleave', onMouseLeave);
  };
}
