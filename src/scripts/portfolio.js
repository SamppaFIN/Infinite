/* Infinite – sivun skripti. Ei kirjastoja: raaka WebGL ja canvas 2D. Data tulee #pf-data-elementistä. */
(() => {
  'use strict';
  const D = JSON.parse(document.getElementById('pf-data').textContent);
  const T = D.ui, L = D.lang;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => mqReduce.matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* esim. yksityinen tila */ } },
  };
  const el = (tag, attrs, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === false || v == null) continue;
      if (k === 'class') n.className = v; else if (k === 'text') n.textContent = v;
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), v); else n.setAttribute(k, v === true ? '' : String(v));
    }
    for (const c of kids.flat(Infinity)) if (c != null && c !== false) n.append(c.nodeType ? c : document.createTextNode(String(c)));
    return n;
  };
  const fmt2 = (n) => (L === 'fi' ? n.toFixed(2).replace('.', ',') : n.toFixed(2));
  const nf = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, L === 'fi' ? ' ' : ',');
  const fdate = (d) => (L === 'fi' ? `${+d.slice(8, 10)}.${+d.slice(5, 7)}.${d.slice(0, 4)}`
    : new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }));
  const mIdx = (d) => (+d.slice(0, 4) - 2025) * 12 + (+d.slice(5, 7)) - 3; // 03/2025 = 0 … 11/2026 = 20
  const mulberry = (a) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

  // Värit canvasille: CSS-tokenit (oklch) muunnetaan RGB:ksi piirtämällä 1 px.
  const probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  const rgb = (c) => { probe.clearRect(0, 0, 1, 1); probe.fillStyle = '#000'; probe.fillStyle = c; probe.fillRect(0, 0, 1, 1); const d = probe.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2]]; };
  let palette = null;
  const pal = () => palette || (palette = Object.fromEntries(['bg', 'surface', 'panel', 'line', 'line-soft', 'text', 'muted', 'accent', 'loiste', 'hionta', 'kirkkaus', 'map-bg', 'thread']
    .map((n) => [n, rgb(getComputedStyle(document.documentElement).getPropertyValue('--' + n).trim())])));
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

  /* ---------- Teema ---------- */
  // Teema valitaan yläpalkin valikosta. Talvi on oletus. Jokaisella teemalla on oma neuvonantajajoukkonsa omilla nimillään.
  const THEMES = ['dark', 'light', 'winter', 'christmas', 'kekri'];
  const CAST = { dark: 'worms', light: 'worms', winter: 'birds', christmas: 'elves', kekri: 'ghosts' };
  const SUF = { worms: '', birds: 'B', elves: 'E', ghosts: 'G' }; // joukon omat repliikit ja tekstit: welcomeB, heroE, hideG …
  const theme = {
    current() { const t = document.documentElement.getAttribute('data-theme'); return THEMES.includes(t) ? t : 'winter'; },
    cast() { return CAST[this.current()]; },
    set(t) { document.documentElement.setAttribute('data-theme', t); store.set('infinite-theme', t); this.sync(); },
    sync() {
      const t = this.current(), name = { dark: T.themeDark, light: T.themeLight, winter: T.themeWinter, christmas: T.themeChristmas, kekri: T.themeKekri }[t];
      $('#theme-label').textContent = name;
      $('#theme-btn').setAttribute('aria-label', `${T.theme}: ${name}`);
      for (const r of $$('#theme-menu input')) r.checked = r.value === t;
      $('#hero-canvas').setAttribute('aria-label', { christmas: T.heroCanvasXmas, kekri: T.heroCanvasKekri }[t] || T.heroCanvas);
      palette = null;
      $('meta[name="theme-color"]').content = `rgb(${rgb(getComputedStyle(document.documentElement).getPropertyValue('--bg').trim())})`;
      document.dispatchEvent(new CustomEvent('pf:theme', { detail: t }));
    },
  };
  // Valikko: hiirellä valinta sulkee valikon, näppäimistöllä nuolet vaihtavat teemaa ja Enter tai Esc sulkee
  const themeBtn = $('#theme-btn'), themeMenu = $('#theme-menu');
  let menuByPointer = false;
  const themeMenuOpen = (open, refocus) => {
    themeMenu.hidden = !open; themeBtn.setAttribute('aria-expanded', String(open));
    if (open) ($(`input[value="${theme.current()}"]`, themeMenu) || $('input', themeMenu)).focus(); else if (refocus) themeBtn.focus();
  };
  themeBtn.addEventListener('click', () => themeMenuOpen(themeMenu.hidden));
  themeMenu.addEventListener('pointerdown', () => { menuByPointer = true; });
  themeMenu.addEventListener('keydown', (e) => { menuByPointer = false; if (e.key === 'Escape' || e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); themeMenuOpen(false, true); } });
  themeMenu.addEventListener('change', (e) => theme.set(e.target.value));
  themeMenu.addEventListener('click', (e) => { if (menuByPointer && e.target.matches('input')) { theme.set(e.target.value); themeMenuOpen(false, true); } });
  document.addEventListener('pointerdown', (e) => { if (!themeMenu.hidden && !e.target.closest('.theme-pick')) themeMenuOpen(false); });
  const NAMEKEY = { worms: 'name', birds: 'bird', elves: 'elf', ghosts: 'ghost' };
  const pname = (k) => D.personas[k][NAMEKEY[theme.cast()]]; // jokaisella joukolla omat nimet

  /* ---------- Kiinteiden palkkien tila ---------- */
  const topbar = $('#topbar');
  const setBars = () => { document.documentElement.style.setProperty('--header-h', topbar.offsetHeight + 'px'); };
  new ResizeObserver(setBars).observe(topbar); setBars();

  /* ---------- Dialogit: Esc sulkee aina, fokus palaa avaajaan ---------- */
  const openDialog = (dlg, opener) => { if (dlg.open) return; dlg._opener = opener || document.activeElement; dlg.showModal(); };
  for (const d of $$('dialog')) {
    d.addEventListener('close', () => { const o = d._opener; d._opener = null; if (o && document.contains(o)) o.focus({ preventScroll: true }); });
    d.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); d.close(); } });
    d.addEventListener('click', (e) => { const r = d.getBoundingClientRect(); if (e.target === d && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) d.close(); });
    for (const b of $$('[data-close]', d)) b.addEventListener('click', () => d.close());
  }

  /* ---------- Vanhat ankkurit (301-taulukko) ---------- */
  const OLD = Object.fromEntries(D.redirects.filter((r) => r.from.includes('#')).map((r) => [r.from.split('#')[1], r.to.split('#')[1]]));
  const redirectHash = () => { const h = location.hash.slice(1); if (OLD[h]) { history.replaceState(null, '', '#' + OLD[h]); const t = document.getElementById(OLD[h]); if (t) t.scrollIntoView(); } };
  redirectHash(); addEventListener('hashchange', redirectHash);

  /* ---------- Hero: talvimaisema ja siniset revontulet ---------- */
  const hero = (() => {
    const sec = $('#etusivu'), cv = $('#hero-canvas');
    const STILL = 23; // reduced motion -tilan pysäytyskuvan aika
    const st = { mode: 'css', running: false, frames: 0, x: 0, y: 0, tx: 0, ty: 0, a: 0, ta: 0, visible: true };
    let gl = null, U = {}, raf = 0, last = 0, w = 1, h = 1, dpr = 1;
    try { gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' }); } catch (e) { gl = null; }
    const FS = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec3 uPtr; uniform float uDark; uniform float uHz; uniform float uWin; uniform float uXmas; uniform float uKekri;
float h11(float p){ p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float n11(float x){ float i = floor(x), f = fract(x); f = f*f*(3.0 - 2.0*f); return mix(h11(i), h11(i + 1.0), f); }
float n21(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }
float fell(float x, float sharp){
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++){ float n = n11(x); s += a * mix(n, 1.0 - abs(2.0*n - 1.0), sharp); x = x * 2.07 + 3.1; a *= 0.47; }
  return s;
}
float near(vec2 p, float s){ vec2 d = p - uPtr.xy; return uPtr.z * exp(-dot(d, d) / s); }
vec3 skyCol(float y){
  float g = clamp((y - uHz) / (1.0 - uHz), 0.0, 1.0);
  vec3 c = mix(mix(vec3(0.90, 0.95, 1.00), vec3(0.56, 0.71, 0.93), pow(g, 0.8)),
               mix(vec3(0.035, 0.075, 0.16), vec3(0.008, 0.014, 0.045), pow(g, 0.6)), uDark);
  // Kekri: violetinmusta taivas, horisontissa luumunpunainen hehku
  return mix(c, mix(vec3(0.16, 0.06, 0.16), vec3(0.025, 0.012, 0.05), pow(g, 0.55)), uKekri);
}
// Revontulet: kolme verhoa. Alareuna aaltoilee, säteet tulevat 1D-kohinasta, ja verho taipuu osoitinta kohti.
vec3 aurora(vec2 p, float t){
  float S = 1.0 - uHz, pull = near(vec2(p.x, uPtr.y), 0.08);
  vec3 acc = vec3(0.0);
  for (int i = 0; i < 3; i++){
    float fi = float(i), x = p.x * (0.85 + 0.2*fi) + fi * 3.7;
    float y0 = uHz + S * (0.40 + 0.15*fi + 0.07*sin(1.1*x + 0.12*t + 1.7*fi) + 0.04*sin(2.7*x - 0.17*t + fi) + 0.03*(n11(3.0*x + 0.15*t) - 0.5));
    y0 += (uPtr.y - y0) * 0.3 * pull;
    float dy = p.y - y0, hgt = S * (0.20 + 0.10*fi);
    float rays = n11(34.0*x + 0.25*t + 9.0*fi); rays = (0.35 + 0.65*rays*rays) * (0.6 + 0.4*n11(7.0*x - 0.12*t + 4.0*fi));
    float gap = smoothstep(0.15, 0.6, n11(0.6*x + 5.0*fi + 0.03*t));
    float pulse = 0.7 + 0.3*sin(5.0*x - 1.1*t + 2.0*fi);
    float edge = smoothstep(-0.006, 0.006, dy);
    float I = (edge * exp(-max(dy, 0.0) / hgt) * pulse + (1.0 - edge) * exp(dy / 0.02) * 0.25) * rays * gap * (1.0 - 0.28*fi) * (1.0 + 1.2*pull);
    float k = clamp(dy / hgt, 0.0, 1.0);
    // Talvessa (uWin) verhot ovat vihreät ja yläreuna violetinpunainen kuten oikeissa revontulissa
    vec3 c = mix(mix(vec3(0.62, 0.95, 1.00), vec3(0.70, 1.00, 0.80), uWin), mix(vec3(0.12, 0.46, 1.00), vec3(0.10, 0.90, 0.45), uWin), smoothstep(0.0, 0.25, k));
    c = mix(c, mix(vec3(0.34, 0.20, 0.92), vec3(0.70, 0.22, 0.60), uWin), smoothstep(0.35, 1.0, k));
    acc += c * I + mix(vec3(0.75, 0.95, 1.0), vec3(0.80, 1.0, 0.85), uWin) * exp(-abs(dy) / 0.004) * rays * gap * 0.6 * (1.0 - 0.28*fi);
  }
  return acc;
}
float stars(vec2 p, float t){
  vec2 g = p * 90.0, id = floor(g), f = fract(g) - 0.5;
  float h = h21(id); if (h < 0.965) return 0.0;
  vec2 o = vec2(h21(id + 3.1), h21(id + 7.7)) - 0.5;
  return smoothstep(0.14, 0.0, length(f - o*0.6)) * (0.6 + 0.4*sin(t*(1.0 + 2.0*h21(id + 1.3)) + h*50.0)) * (h - 0.965) / 0.035;
}
float sdSeg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; return length(pa - ba*clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0)); }
// Joulutähti: hehkuva ydin, neljä pitkää ja neljä lyhyttä sädettä. Osoitin kirkastaa sitä.
vec3 xmasStar(vec2 p, float t, float asp){
  vec2 c = vec2(asp*0.8, uHz + (1.0 - uHz)*0.78), d = p - c;
  float r = length(d), boost = 1.0 + 1.5*near(c, 0.02);
  float core = exp(-r*r/0.00006) + 0.3*exp(-r/0.025);
  float sp = exp(-abs(d.x)/0.0022)*exp(-abs(d.y)/0.12) + exp(-abs(d.y)/0.0022)*exp(-abs(d.x)/0.09);
  vec2 e = vec2(d.x + d.y, d.y - d.x)*0.7071;
  sp += 0.45*(exp(-abs(e.x)/0.0016)*exp(-abs(e.y)/0.045) + exp(-abs(e.y)/0.0016)*exp(-abs(e.x)/0.045));
  return vec3(1.0, 0.86, 0.55)*(core + sp)*(0.85 + 0.15*sin(1.3*t))*boost;
}
// Lepakko omassa koordinaatistossaan: siivenkärjet ±1, siivet heiluvat flapin mukaan
float bat(vec2 q, float flap, float aa){
  q.x = abs(q.x);
  float top = 0.10 + 0.45*q.x*flap - 0.20*q.x*q.x, bot = top - 0.22 + 0.10*abs(sin(q.x*9.0));
  float wing = smoothstep(1.0 + aa, 1.0 - aa, q.x) * smoothstep(bot - aa, bot + aa, q.y) * smoothstep(top + aa, top - aa, q.y);
  return max(wing, smoothstep(0.26 + aa, 0.26 - aa, length(q*vec2(2.6, 1.3))));
}
// Punainen mökki rannalla: valaistut ikkunat ja lumikatto. Järvi peilaa sen.
vec3 cottage(vec2 p, vec3 col, float asp, float S){
  float w = 0.05*S, h = 0.028*S, rw = w*1.18; vec2 q = p - vec2(asp*0.62, uHz);
  float top = h + (rw - abs(q.x))*0.62;
  if (abs(q.x) < rw && q.y >= h && q.y < top) col = mix(vec3(0.10, 0.11, 0.15), vec3(0.90, 0.94, 1.0), smoothstep(h + 0.4*(top - h), h + 0.6*(top - h), q.y));
  if (abs(q.x) < w && q.y >= 0.0 && q.y < h){
    col = vec3(0.48, 0.10, 0.08);
    vec2 wq = vec2(abs(abs(q.x) - w*0.5), q.y - h*0.52);
    if (wq.x < w*0.17 && abs(wq.y) < h*0.21) col = vec3(1.0, 0.80, 0.45);
  }
  vec2 g1 = q - vec2(-w*0.5, h*0.52), g2 = q - vec2(w*0.5, h*0.52);
  return col + vec3(1.0, 0.65, 0.30)*0.30*(exp(-dot(g1, g1)/(0.25*w*w)) + exp(-dot(g2, g2)/(0.25*w*w)));
}
float farTop(float x){ return uHz + (1.0 - uHz) * (0.07 + 0.40*fell(1.05*x + 4.0, 0.85)); }
float midTop(float x){ return uHz + (1.0 - uHz) * (0.02 + 0.17*fell(1.7*x + 11.0, 0.25)); }
vec3 snowFace(float lit, float depth, vec2 p, float dh){
  lit = mix(lit, 0.4 + 0.35*n21(vec2(6.0*p.x + 4.0*depth, 14.0*depth)), smoothstep(0.0, 0.18, depth));
  vec3 d = mix(vec3(0.05, 0.08, 0.17), vec3(0.30, 0.44, 0.70), lit) + vec3(0.06, 0.16, 0.32)*lit;
  vec3 l = mix(vec3(0.66, 0.76, 0.91), vec3(0.98, 0.99, 1.00), lit);
  vec3 m = mix(l, d, uDark);
  float rock = smoothstep(0.62, 0.85, n21(vec2(24.0*p.x + 10.0*p.y, 30.0*p.y))) * smoothstep(0.4, 1.6, abs(dh));
  return mix(m, m * vec3(0.45, 0.50, 0.60), rock*0.45) * (1.0 - 0.22*smoothstep(0.0, 0.5, depth));
}
// Taivas, revontulet, tunturit ja rantakuuset. Järvi kutsuu tätä peilattuna.
vec3 scene(vec2 p, float t, float px){
  float S = 1.0 - uHz, asp = uRes.x / uRes.y;
  // Joulussa revontulien tilalla on joulutähti, Kekrissä kuu
  vec3 col = skyCol(p.y), au = vec3(0.0);
  if (uXmas + uKekri < 0.5) au = aurora(p, t);
  float a = clamp(dot(au, vec3(0.3, 0.5, 0.2)), 0.0, 1.0);
  col = mix(col, vec3(0.10, 0.40, 1.00), a * 0.62 * (1.0 - uDark)) + (au + stars(p, t)*vec3(0.8, 0.9, 1.0)) * uDark;
  if (uXmas > 0.5) col += xmasStar(p, t, asp);
  if (uKekri > 0.5){
    // Kekrikuu: oranssi kiekko, kraatterit, hehku ja sen yli ajelehtivat pilvet; edessä lepattaa lepakoita
    vec2 mc = vec2(asp*0.78, uHz + S*0.72), d = p - mc; float R = 0.16*S, r = length(d);
    col += vec3(1.0, 0.50, 0.18)*0.30*exp(-max(r - R, 0.0)/(0.35*R));
    vec3 mcol = mix(vec3(0.85, 0.36, 0.10), vec3(1.0, 0.80, 0.48), smoothstep(R, 0.0, r)) * (0.82 + 0.18*n21(d/R*4.0 + 3.0));
    col = mix(col, mcol, smoothstep(R + px, R - px, r));
    float cl = smoothstep(0.55, 0.8, n21(vec2(p.x*3.5 - t*0.03, p.y*16.0))) * smoothstep(0.45*S, 0.0, abs(p.y - mc.y + 0.02));
    col = mix(col, vec3(0.07, 0.03, 0.09), cl*0.85);
    for (int k = 0; k < 3; k++){
      float fk = float(k), sz = (0.018 + 0.010*h11(fk + 5.0))*S/0.7;
      vec2 bp = vec2(mod(t*(0.05 + 0.02*fk) + fk*0.7, asp + 0.6) - 0.3, uHz + S*(0.55 + 0.25*h11(fk*3.1)) + 0.03*sin(t*1.7 + fk*2.0));
      col = mix(col, vec3(0.02, 0.01, 0.03), bat((p - bp)/sz, sin(t*14.0 + fk*1.3), px/sz*1.5));
    }
  }
  if (p.y < uHz + S*0.37){
    float e = 0.004, hz = skyCol(uHz + 0.02).x;
    float tf = farTop(p.x);
    if (p.y < tf + px){
      float dh = (farTop(p.x + e) - farTop(p.x - e)) / (2.0*e*S);
      vec3 m = mix(snowFace(smoothstep(-1.2, 1.2, dh), (tf - p.y)/S, p, dh), skyCol(uHz + 0.02), 0.30);
      m = mix(m, m*vec3(0.55, 0.40, 0.70), uKekri); // Kekrissä tunturit ovat violetin tummia
      m += mix(mix(vec3(0.2), vec3(0.35, 0.65, 1.0)*0.6, uDark), vec3(0.9, 0.45, 0.2)*0.5, uKekri) * exp(-(tf - p.y)*400.0);
      col = mix(col, m, smoothstep(0.0, px, tf - p.y));
    }
    float tm = midTop(p.x);
    if (p.y < tm + px){
      float dh = (midTop(p.x + e) - midTop(p.x - e)) / (2.0*e*S);
      vec3 m = mix(snowFace(smoothstep(-0.8, 0.8, dh), (tm - p.y)/S, p, dh*0.5), skyCol(uHz + 0.02), 0.16);
      m = mix(m, m*vec3(0.55, 0.40, 0.70), uKekri);
      col = mix(col, m, smoothstep(0.0, px, tm - p.y));
    }
    if (uXmas > 0.5) col = cottage(p, col, asp, S);
    float cw = 0.03, cx = floor(p.x / cw);
    for (int j = -1; j <= 1; j++){
      float id = cx + float(j);
      if (h11(id*1.37 + 5.0) < 0.55) continue;
      float H = S * (0.025 + 0.055*h11(id*2.71 + 1.0)), yy = (p.y - uHz) / H;
      if (yy < 0.0 || yy > 1.0) continue;
      float bx = (id + 0.5 + 0.6*(h11(id*3.3) - 0.5)) * cw;
      if (uKekri > 0.5){
        // Kekrissä rantapuut ovat paljaita: kapeneva runko ja kolme oksaa
        float dt = abs(p.x - bx - 0.06*H*sin(yy*5.0 + id)) - H*0.03*(1.0 - 0.6*yy);
        for (int b = 0; b < 3; b++){
          float fb = float(b), sg = h11(id*5.0 + fb) < 0.5 ? -1.0 : 1.0;
          vec2 a0 = vec2(bx, uHz + H*(0.35 + 0.2*fb)), a1 = a0 + vec2(sg*H*(0.34 - 0.06*fb), H*(0.20 + 0.05*fb));
          dt = min(dt, sdSeg(p, a0, a1) - H*0.012*(1.0 - 0.4*fb));
        }
        col = mix(col, vec3(0.025, 0.012, 0.035), smoothstep(px, 0.0, dt));
        continue;
      }
      float wd = H * 0.24 * pow(1.0 - yy, 0.85) * (0.82 + 0.18*sin(26.0*yy + 7.0*id)) + 0.001;
      float snow = smoothstep(0.35, 0.7, n21(vec2(120.0*p.x, 80.0*p.y)));
      vec3 tc = mix(mix(vec3(0.42, 0.52, 0.64), vec3(0.93, 0.95, 0.99), 0.35 + 0.65*snow), mix(vec3(0.02, 0.035, 0.07), vec3(0.20, 0.30, 0.50), 0.8*snow), uDark);
      col = mix(col, tc, smoothstep(wd + px, wd, abs(p.x - bx)));
      if (uXmas > 0.5){
        // Jouluvalot kuusissa: neljä väriä, ja jokainen tuikkii omaan tahtiinsa
        for (int k = 0; k < 5; k++){
          float fk = float(k), ly = 0.16 + 0.15*fk, hh = h11(id*7.3 + fk), q4 = h11(id*3.7 + fk*1.9);
          float dd = length(p - vec2(bx + (hh - 0.5)*1.6*H*0.24*pow(1.0 - ly, 0.85), uHz + H*ly));
          vec3 lc = q4 < 0.25 ? vec3(1.0, 0.30, 0.25) : q4 < 0.5 ? vec3(1.0, 0.80, 0.35) : q4 < 0.75 ? vec3(0.40, 0.95, 0.55) : vec3(0.50, 0.75, 1.0);
          col += lc*(0.55 + 0.45*sin(t*(1.5 + 2.5*hh) + fk*2.3))*(smoothstep(0.0028, 0.0010, dd) + 0.35*exp(-dd/0.003));
        }
      }
    }
  }
  return col;
}
float crack(vec2 g){
  vec2 i = floor(g), f = fract(g); float d1 = 8.0, d2 = 8.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++){
    vec2 o = vec2(float(x), float(y)), r = o + vec2(h21(i + o), h21(i + o + 19.7)) - f;
    float dd = dot(r, r); if (dd < d1){ d2 = d1; d1 = dd; } else if (dd < d2) d2 = dd;
  }
  return sqrt(d2) - sqrt(d1);
}
// Kuusihaarainen kide: kulma taitetaan 60°:n sektoriin, ja yksi haara kahdella sivuhaaralla riittää.
float star6(vec2 q, float r, float px){
  float d = length(q); if (d > r + px) return 0.0;
  float an = mod(atan(q.y, q.x), 1.0471976) - 0.5235988;
  vec2 s = d * vec2(cos(an), abs(sin(an))), dir = vec2(0.5, 0.8660254);
  float arm = s.x < r ? s.y : length(s - vec2(r, 0.0));
  vec2 b1 = s - vec2(0.48*r, 0.0), b2 = s - vec2(0.74*r, 0.0);
  float br = min(length(b1 - dir*clamp(dot(b1, dir), 0.0, 0.30*r)), length(b2 - dir*clamp(dot(b2, dir), 0.0, 0.18*r)));
  float th = max(0.055*r, 0.6*px);
  return max(smoothstep(th + px, th, min(arm, br)), smoothstep(0.16*r + px, 0.16*r, d) * 0.6);
}
void main(){
  vec2 p = gl_FragCoord.xy / uRes.y;
  float px = 1.0 / uRes.y, t = uTime, asp = uRes.x / uRes.y;
  vec3 col;
  if (p.y >= uHz) col = scene(p, t, px);
  else {
    float d = uHz - p.y;
    vec3 r = scene(vec2(p.x, uHz + d), t, px);
    float F = mix(0.78, 0.30, smoothstep(0.0, 0.22, d));
    col = mix(mix(mix(vec3(0.70, 0.82, 0.94), vec3(0.015, 0.04, 0.09), uDark), vec3(0.035, 0.015, 0.05), uKekri), r * mix(vec3(0.80, 0.90, 1.00), vec3(0.75, 0.88, 1.00), uDark), F);
    float cr = (1.0 - smoothstep(0.0, 0.035, crack(vec2((p.x - 0.5*asp) * 0.6 / d, 0.6 / d)))) * smoothstep(0.02, 0.08, d);
    col = mix(mix(col, vec3(0.45, 0.62, 0.85), cr*0.6), col + vec3(0.25, 0.60, 1.00)*cr*0.45, uDark);
    float bk = uHz * (0.30 + 0.45*fell(0.8*p.x + 21.0, 0.0) + 0.2*smoothstep(0.5*asp, asp, p.x));
    if (p.y < bk + px){
      float e = 0.004, dh = (fell(0.8*(p.x + e) + 21.0, 0.0) - fell(0.8*(p.x - e) + 21.0, 0.0)) / (2.0*e) * 0.36;
      float lit = smoothstep(-0.6, 0.6, dh) * (0.75 + 0.25*smoothstep(0.0, uHz*0.5, p.y));
      vec3 sn = mix(mix(vec3(0.74, 0.82, 0.95), vec3(1.0), lit), mix(vec3(0.03, 0.05, 0.12), vec3(0.16, 0.24, 0.42), lit), uDark);
      sn = mix(sn, vec3(0.05, 0.025, 0.07) + vec3(0.10, 0.05, 0.12)*lit, uKekri); // Kekrissä lumen tilalla on tumma maa
      sn += exp(-(bk - p.y)*160.0) * mix(mix(vec3(0.6), vec3(0.3, 0.55, 0.9), uDark), vec3(0.8, 0.4, 0.15), uKekri) * 0.5;
      col = mix(col, sn, smoothstep(0.0, px, bk - p.y));
    }
    if (uXmas + uKekri > 0.5){
      // Rantapenkalla Joulussa lumilyhdyt ja Kekrissä kurpitsalyhdyt; liekki lepattaa
      for (int k = 0; k < 3; k++){
        float fk = float(k), lx = asp*(0.66 + 0.13*fk), s = 0.014*(1.0 - uHz)/0.7;
        if (abs(p.x - lx) > 4.0*s) continue; // penkan korkeus lasketaan vain lyhdyn kohdalla
        float ly = uHz*(0.30 + 0.45*fell(0.8*lx + 21.0, 0.0) + 0.2*smoothstep(0.5*asp, asp, lx)) + 0.8*s;
        vec2 q = (p - vec2(lx, ly)) / s;
        float fl = 0.8 + 0.2*sin(t*11.0 + fk*3.0) + 0.1*sin(t*23.0 + fk);
        if (uXmas > 0.5){
          float cone = smoothstep(1.0, 0.9, abs(q.x)/(1.0 - 0.45*max(q.y, 0.0))) * step(-1.0, q.y) * step(q.y, 1.6);
          col = mix(col, vec3(0.88, 0.92, 0.98)*(0.75 + 0.25*n21(q*3.0)), cone);
          vec2 cq = q - vec2(0.0, -0.2);
          col += vec3(1.0, 0.72, 0.35)*fl*(0.9*exp(-dot(cq, cq)*3.0) + 0.25*exp(-length(q)*0.6));
        } else {
          float pr = length(q*vec2(0.85, 1.0));
          col = mix(col, vec3(0.90, 0.45, 0.10)*(0.75 + 0.25*cos(q.x*5.0)), smoothstep(1.1, 0.9, pr));
          float face = max(smoothstep(0.22, 0.12, length(q - vec2(-0.35, 0.2))), smoothstep(0.22, 0.12, length(q - vec2(0.35, 0.2))));
          face = max(face, smoothstep(0.12, 0.04, abs(q.y + 0.3 + 0.08*sin(q.x*12.0))) * step(abs(q.x), 0.55));
          col = mix(col, vec3(1.0, 0.85, 0.40)*fl, face*step(pr, 1.0));
          col += vec3(1.0, 0.55, 0.15)*fl*0.25*exp(-pr*0.7);
        }
      }
    }
    // Timanttikimallus jäällä ja hangella: harva hash-ruudukko, spektriväri, voimistuu osoittimen lähellä.
    vec2 gc = floor(gl_FragCoord.xy / 3.0);
    float gh = h21(gc), th = 0.988 - 0.03*near(p, 0.03);
    if (gh > th){
      float g2 = h21(gc + 7.3);
      vec3 fire = 0.65 + 0.35*cos(6.2832*(g2 + vec3(0.0, 0.33, 0.67)));
      col += fire * pow(0.5 + 0.5*sin(t*(1.5 + 3.0*g2) + 60.0*g2), 6.0) * (gh - th) / (1.0 - th) * mix(0.9, 1.4, uDark);
    }
  }
  if (uKekri > 0.5){
    // Usva horisontin tuntumassa. Osoitin on lyhty: usva hälvenee sen ympäriltä ja muu maisema tummuu.
    float fn = 0.6*n21(vec2(p.x*2.5 - t*0.05, p.y*9.0 + t*0.02)) + 0.4*n21(vec2(p.x*6.0 + t*0.08, p.y*21.0));
    float fog = exp(-abs(p.y - uHz)/0.07) * smoothstep(0.35, 0.8, fn) * 0.5 * (1.0 - 0.85*near(p, 0.04));
    col = mix(col, vec3(0.55, 0.45, 0.66), fog);
    vec2 dp = p - uPtr.xy;
    col *= mix(1.0, 0.55 + 0.45*exp(-dot(dp, dp)/0.05), uPtr.z);
    col += vec3(1.0, 0.62, 0.28)*0.10*near(p, 0.03);
  }
  // Lumisade neljässä kerroksessa: kaksi lähintä ovat kiteitä, kolmas pisteitä, kaukaisin kimaltavaa timanttipölyä.
  // Kekrissä kolme lähintä kerrosta ovat syksyn lehtiä, jotka putoavat hitaammin ja pyörivät.
  vec3 flk = mix(vec3(0.38, 0.55, 0.86), vec3(0.86, 0.94, 1.00), uDark), zap = mix(vec3(0.15, 0.45, 1.00), vec3(0.45, 0.82, 1.00), uDark);
  float np = near(p, 0.02);
  for (int i = 0; i < 4; i++){
    if (uKekri > 0.5 && i == 3) continue;
    float fi = float(i), sc = 4.5 * pow(1.85, fi), sp = 0.11 / (1.0 + 0.55*fi) * (1.0 - 0.45*uKekri);
    vec2 g = p * sc + vec2(0.6*sin(0.21*t + 1.3*fi) + 0.02*t*sc, t * sp * sc);
    vec2 id = floor(g), f = fract(g) - 0.5;
    if (h21(id + 31.7*fi) > 0.12 + 0.08*fi) continue;
    float h2 = h21(id*1.7 + 3.3 + fi), h3 = h21(id*2.3 + 9.1 + fi);
    float r = i < 2 ? mix(0.11, 0.20, h3) : 0.10, pc = px * sc;
    vec2 q = f - (vec2(h2, h3) - 0.5) * (1.0 - 2.0*r - 0.12) - vec2((0.04 + 0.03*uKekri)*sin(t*(0.6 + h2) + 6.28*h3), 0.0);
    float v;
    vec3 c = mix(flk, zap, np);
    if (uKekri > 0.5){
      float an = t*(h2 - 0.5)*1.8 + 6.28*h3; q = mat2(cos(an), -sin(an), sin(an), cos(an)) * q;
      float u = q.x / r, hw = 0.42*r*pow(max(1.0 - u*u, 0.0), 0.9);
      v = smoothstep(pc, 0.0, abs(q.y) - hw) * step(abs(u), 1.0) * (i == 0 ? 0.95 : 0.8);
      c = h2 < 0.33 ? vec3(0.90, 0.48, 0.16) : h2 < 0.66 ? vec3(0.74, 0.28, 0.10) : vec3(0.96, 0.68, 0.26);
    }
    else if (i < 2){ float an = t*(h2 - 0.5)*0.9 + 6.28*h3; q = mat2(cos(an), -sin(an), sin(an), cos(an)) * q; v = star6(q, r, pc) * (i == 0 ? 0.75 : 0.5); }
    else if (i == 2) v = smoothstep(0.05 + pc, 0.0, length(q)) * 0.5;
    else {
      v = (max(smoothstep(pc*1.2, 0.0, abs(q.x)) * smoothstep(0.35, 0.0, abs(q.y)), smoothstep(pc*1.2, 0.0, abs(q.y)) * smoothstep(0.35, 0.0, abs(q.x))) * 0.8
        + smoothstep(0.08, 0.0, length(q))) * pow(0.5 + 0.5*sin(t*(1.0 + 2.0*h2) + 40.0*h3), 8.0);
      c = mix(c, 0.7 + 0.3*cos(6.2832*(h2 + vec3(0.0, 0.33, 0.67))), 0.35);
    }
    col = mix(col, c * (1.0 + 0.4*np*uDark), clamp(v * (1.0 + np), 0.0, 1.0));
  }
  float vig = smoothstep(1.35, 0.35, length(gl_FragCoord.xy / uRes - 0.5) * 1.6);
  col *= mix(1.0, vig, 0.45*uDark + 0.12);
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;
    const setup = () => {
      const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader'); return s; };
      const pr = gl.createProgram();
      gl.attachShader(pr, sh(gl.VERTEX_SHADER, 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}'));
      gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
      gl.linkProgram(pr); if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error('link');
      gl.useProgram(pr);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const a = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
      for (const n of ['uRes', 'uTime', 'uPtr', 'uDark', 'uHz', 'uWin', 'uXmas', 'uKekri']) U[n] = gl.getUniformLocation(pr, n);
    };
    const resize = () => {
      w = sec.clientWidth; h = sec.clientHeight; dpr = Math.min(devicePixelRatio || 1, 1.5);
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      if (gl) gl.viewport(0, 0, cv.width, cv.height);
      if (st.mode === 'static') draw(STILL);
    };
    // Shaderin koordinaatit ovat hero-korkeuden yksiköissä, origo vasemmassa alakulmassa.
    const draw = (t) => {
      gl.uniform2f(U.uRes, cv.width, cv.height); gl.uniform1f(U.uTime, t);
      gl.uniform3f(U.uPtr, st.x / h, 1 - st.y / h, st.a);
      const th = theme.current(); gl.uniform1f(U.uDark, th === 'light' ? 0 : 1); gl.uniform1f(U.uWin, th === 'winter' ? 1 : 0);
      gl.uniform1f(U.uXmas, th === 'christmas' ? 1 : 0); gl.uniform1f(U.uKekri, th === 'kekri' ? 1 : 0);
      gl.uniform1f(U.uHz, w < 700 ? 0.6 : 0.3);
      gl.drawArrays(gl.TRIANGLES, 0, 3); st.frames++;
    };
    const frame = (now) => {
      if (!st.running) return;
      const dt = Math.min(0.1, (now - (last || now)) / 1000); last = now;
      const k = 1 - Math.exp(-dt / 0.12), ka = 1 - Math.exp(-dt / 0.4);
      st.x += (st.tx - st.x) * k; st.y += (st.ty - st.y) * k; st.a += (st.ta - st.a) * ka;
      draw(now / 1000); raf = requestAnimationFrame(frame);
    };
    const update = () => {
      if (!gl) return;
      st.mode = reduced() ? 'static' : 'webgl';
      const run = st.mode === 'webgl' && st.visible && !document.hidden;
      if (run && !st.running) { st.running = true; last = 0; raf = requestAnimationFrame(frame); }
      if (!run && st.running) { st.running = false; cancelAnimationFrame(raf); }
      if (st.mode === 'static') { st.a = st.ta = 0; draw(STILL); }
    };
    if (gl) {
      try { setup(); st.mode = 'webgl'; } catch (e) { gl = null; }
    }
    if (!gl) { sec.classList.add('no-webgl'); return { state: st, get mode() { return 'css'; }, get running() { return false; }, get frames() { return 0; } }; }
    cv.addEventListener('webglcontextlost', (e) => { e.preventDefault(); st.running = false; cancelAnimationFrame(raf); sec.classList.add('no-webgl'); st.mode = 'css'; });
    sec.addEventListener('pointermove', (e) => {
      const r = sec.getBoundingClientRect(); st.tx = e.clientX - r.left; st.ty = e.clientY - r.top;
      if (st.a < 0.02) { st.x = st.tx; st.y = st.ty; } // revontulet eivät pyyhkäise vanhasta kohdasta
      if (st.mode === 'webgl') st.ta = 1;
    }, { passive: true });
    sec.addEventListener('pointerleave', () => { st.ta = 0; });
    new ResizeObserver(resize).observe(sec);
    new IntersectionObserver((es) => { st.visible = es[0].isIntersecting; update(); }).observe(sec);
    document.addEventListener('visibilitychange', update);
    mqReduce.addEventListener('change', update);
    document.addEventListener('pf:theme', () => { if (st.mode === 'static') draw(STILL); });
    resize(); update();
    return { state: st, get mode() { return st.mode; }, get running() { return st.running; }, get frames() { return st.frames; }, get pointer() { return [st.x, st.y, st.a]; } };
  })();

  /* ---------- Lasi: metallireunan kulma ja kallistus osoittimen mukaan ---------- */
  (() => {
    let active = null, ev = null, raf = 0;
    const reset = (g) => { g.style.setProperty('--tilt-x', '0deg'); g.style.setProperty('--tilt-y', '0deg'); };
    const apply = () => {
      raf = 0; const g = ev.target && ev.target.closest ? ev.target.closest('.glass') : null;
      if (active && active !== g) reset(active); active = g; if (!g) return;
      const r = g.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      g.style.setProperty('--rim', (Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180 / Math.PI + 90).toFixed(1) + 'deg');
      if (reduced()) return;
      const nx = Math.max(-1, Math.min(1, (ev.clientX - cx) / (r.width / 2))), ny = Math.max(-1, Math.min(1, (ev.clientY - cy) / (r.height / 2)));
      g.style.setProperty('--tilt-x', (-ny * 2).toFixed(2) + 'deg'); g.style.setProperty('--tilt-y', (nx * 2).toFixed(2) + 'deg');
    };
    document.addEventListener('pointermove', (e) => { ev = e; if (!raf) raf = requestAnimationFrame(apply); }, { passive: true });
  })();

  /* ---------- Projektikortti: haku, dialogi ja aikajana käyttävät samaa ---------- */
  const PBY = Object.fromEntries(D.projects.map((p) => [p.id, p]));
  const TAGI = Object.fromEntries(D.tags.map((t) => [t.id, t]));
  const verdict = (s) => (s >= 85 ? T.v1 : s >= 70 ? T.v2 : s >= 55 ? T.v3 : s >= 40 ? T.v4 : T.v5);
  const projectCard = (p, o = {}) => {
    const lv = o.level || 4, H = 'h' + lv, sel = o.sel || [];
    const parts = [['R', T.pR], ['L', T.pL], ['D', T.pD], ['Doc', T.pDoc], ['T', T.pT], ['K', T.pK]];
    const dims = [['purpose', T.dimPurpose], ['tech', T.dimTech], ['ai', T.dimAi]];
    const matched = p.tags.filter((t) => sel.includes(t)), rest = p.tags.filter((t) => !sel.includes(t));
    const ev = (t) => el('li', { class: sel.includes(t) ? 'hit' : null }, el('strong', { text: TAGI[t].label }), ` · ${D.sources[p.evidence[t].src]}: “${p.evidence[t].q}”`);
    return el('article', { class: 'pcard', 'data-card': p.id },
      el('div', { class: 'pc-top aurora-bg' + (p.image ? '' : ' noimg'), style: `--ax:${(p.score * 7) % 70 + 15}%` },
        p.image ? el('img', { src: p.image, alt: '', width: p.imageW, height: p.imageH, loading: 'lazy', decoding: 'async' }) : null,
        el('div', { class: 'pc-title' },
          el('div', { class: 'pc-badges' },
            el('span', { class: 'status', text: p.top ? `Top 5 · ${p.top}` : T.statusPort }),
            el('span', { class: 'status verdict', text: `${verdict(p.score)} · ${p.score} ${T.pts}` }),
            o.s != null ? el('span', { class: 'mono score', text: 's = ' + fmt2(o.s) }) : null),
          o.heading === false ? null : el('h' + (lv - 1), { text: p.name }),
          el('p', { class: 'pc-one', text: p.one }),
          el('p', { class: 'mono small muted', text: `${T.start} ${fdate(p.start)} · ${T.lastCommit} ${fdate(p.last)} · ${nf(p.commits)} ${T.commits}` }),
          el('div', { class: 'row' }, p.demo ? el('a', { class: 'btn sm primary', href: p.demo, text: T.demo }) : null, el('a', { class: 'btn sm', href: p.code, text: T.code })))),
      el('section', { class: 'pc-an' },
        el(H, {}, T.analysis, ' ', el('span', { class: 'note', text: '· ' + T.analysisNote })),
        el('div', { class: 'pc-an-grid' }, [['hionta', T.aTech, p.an.tech], ['kirkkaus', T.aPhilo, p.an.philo], ['loiste', T.aFun, p.an.fun]].map(([w, lab, txt]) =>
          el('div', { class: 'an by-' + w }, el('p', { class: 'an-h' }, el('strong', { class: 'who-' + w, text: lab }), el('span', { class: 'muted', text: ' · ' + pname(w) })), el('p', { text: txt }))))),
      el('div', { class: 'pc-grid' },
        el('section', { class: 'pc-review' },
          el(H, {}, T.review, ' ', el('span', { class: 'note', text: '· ' + T.reviewNote })),
          el('p', { text: p.review }),
          p.result ? el('p', { class: 'small' }, el('strong', { text: T.result + ': ' }), p.result) : null),
        el('section', { class: 'pc-recs' },
          el(H, {}, T.recs, ' ', el('span', { class: 'note', text: '· ' + T.recNote })),
          el('ul', {}, p.recs.map((r) => el('li', { text: r }))))),
      el('details', { class: 'pc-more' }, el('summary', { text: `${T.scoreTitle} · ${matched.length ? T.matched : T.allTags}` }), el('div', { class: 'pc-grid' },
        el('section', { class: 'pc-score' },
          el(H, {}, T.scoreTitle, ' ', el('span', { class: 'note', text: '· ' + T.verdictNote })),
          parts.map(([k, lab]) => el('div', { class: 'pc-bar' }, el('span', { text: lab }),
            el('span', { class: 'bar', 'aria-hidden': 'true' }, el('span', { style: `width:${Math.round(p.parts[k] * 100)}%` })),
            el('span', { class: 'mono v', text: Math.round(p.parts[k] * 100) + ' %' })))),
        el('section', { class: 'pc-tags' },
          el(H, { text: matched.length ? T.matched : T.allTags }),
          dims.map(([d, name]) => { const ts = p.tags.filter((t) => TAGI[t].dim === d); return ts.length ? el('p', { class: 'small' }, el('span', { class: 'muted', text: name + ': ' }), ts.map((t, i) => [i ? ', ' : '', sel.includes(t) ? el('mark', { text: TAGI[t].label }) : TAGI[t].label])) : null; }),
          el('ul', { class: 'why' }, (matched.length ? matched : p.tags).map(ev)),
          matched.length && rest.length ? el('details', {}, el('summary', { text: T.allTags }), el('ul', { class: 'why' }, rest.map(ev))) : null,
          p.pair ? el('p', { class: 'small' }, el('strong', { text: T.pair + ': ' }), p.pair + (p.agent ? ` · ${T.agentFile} ${p.agent}, ${p.agentEdits} ${T.edits}` : '')) : null))));
  };
  const projectDialog = (() => {
    const dlg = $('#project-dialog');
    const open = (id, opener) => {
      const p = PBY[id]; if (!p) return;
      $('#pd-title').textContent = p.name; $('#pd-body').replaceChildren(projectCard(p, { level: 3, heading: false }));
      if (dlg.open) dlg.scrollTop = 0; else openDialog(dlg, opener);
    };
    document.addEventListener('click', (e) => { const b = e.target.closest && e.target.closest('[data-project]'); if (b) open(b.dataset.project, b); });
    return { open, close() { dlg.close(); }, get isOpen() { return dlg.open; }, get current() { return dlg.open ? $('#pd-title').textContent : null; } };
  })();

  /* ---------- Projektit: luku ja aiheet rajaavat samaa korttilistaa, luvut ovat suljettavia otsikoita ---------- */
  const finder = (() => {
    const root = $('#finder'), chips = $$('.chip[data-tag]', root), chs = $$('.chip[data-ch]', root), tl = $('#finder-tl'), count = $('#finder-count'), clear = $('#finder-clear'), selN = $('#topics-sel'), NM = 21;
    const cards = Object.fromEntries($$('.acard[data-card]', root).map((c) => [c.dataset.card, c])), groups = $$('.pch', root), C = D.story.chapters;
    const PS = D.projects.slice().sort((a, b) => a.start.localeCompare(b.start));
    const CH = Object.fromEntries(PS.map((p) => [p.id, C.findIndex((c) => mIdx(p.start) >= c.from && mIdx(p.start) <= c.to)]));
    const st = { ch: null, sel: [], hits: PS };
    // Projekti näkyy, kun se kuuluu valittuun lukuun ja osuu jokaiseen valittuun aiheeseen
    const fits = (p, ch, sel) => (ch === null || CH[p.id] === ch) && sel.every((t) => p.tags.includes(t));
    const n = (ch, sel) => PS.filter((p) => fits(p, ch, sel)).length;
    const label = (m) => { const mo = (m + 2) % 12 + 1, y = 2025 + Math.floor((m + 2) / 12); return `${String(mo).padStart(2, '0')}/${String(y).slice(2)}`; };
    // Aikajana: luvut nauhoina, commitit palkkeina ja kuukausimerkit. Valittu luku korostuu.
    const maxM = Math.max(...D.story.months);
    const bands = C.map((c) => el('span', { class: 'ftl-band', style: `left:${c.from / NM * 100}%;width:${(c.to + 1 - c.from) / NM * 100}%`, 'aria-hidden': 'true' }, el('b', { text: c.title })));
    const bars = D.story.months.map((v, m) => (v ? el('span', { class: 'ftl-bar', 'data-m': m, style: `left:${(m + 0.2) / NM * 100}%;width:${0.6 / NM * 100}%;height:${Math.max(3, Math.round(v / maxM * 72))}px`, 'aria-hidden': 'true' }) : null)).filter(Boolean);
    const axis = Array.from({ length: NM }, (_, m) => (m % 3 === 0 ? el('span', { class: 'ftl-tick', style: `left:${(m + 0.5) / NM * 100}%`, 'aria-hidden': 'true', text: label(m) }) : null)).filter(Boolean);
    tl.replaceChildren(...bands, ...bars, ...axis);
    const renderTl = () => {
      bands.forEach((b, i) => { b.classList.toggle('on', st.ch === i); b.classList.toggle('dim', st.ch !== null && st.ch !== i); });
      for (const b of bars) b.classList.toggle('on', st.ch !== null && +b.dataset.m >= C[st.ch].from && +b.dataset.m <= C[st.ch].to);
    };
    // Rajaus avaa luvut, joissa on osumia, ja kaiken näyttäminen sulkee luvut takaisin otsikoiksi. Muuten luvut ovat käyttäjän avattavissa.
    const update = (filter) => {
      st.hits = PS.filter((p) => fits(p, st.ch, st.sel));
      const hit = new Set(st.hits.map((p) => p.id)), on = st.ch !== null || st.sel.length > 0;
      for (const [id, c] of Object.entries(cards)) { c.hidden = !hit.has(id); for (const s of $$('[data-t]', c)) s.classList.toggle('hit', st.sel.includes(s.dataset.t)); }
      groups.forEach((g, i) => { const has = st.hits.some((p) => CH[p.id] === i); g.hidden = !has; if (filter) g.open = has && on; if (filter && st.ch === i) $('details', g).open = true; });
      // Painikkeen luku kertoo, montako projektia jää, jos sen valitsee; nollan painike ei ole käytössä
      for (const c of chips) { const t = c.dataset.tag, sel = st.sel.includes(t), k = sel ? st.hits.length : n(st.ch, [...st.sel, t]);
        c.setAttribute('aria-pressed', String(sel)); c.disabled = !sel && !k; $('.count', c).textContent = String(k); }
      for (const c of chs) { const i = c.dataset.ch === '' ? null : +c.dataset.ch, sel = i === st.ch, k = n(i, st.sel);
        c.setAttribute('aria-pressed', String(sel)); c.disabled = !sel && !k; $('.count', c).textContent = String(k); }
      const parts = [st.ch === null ? '' : C[st.ch].title, ...st.sel.map((t) => TAGI[t].label)].filter(Boolean);
      count.textContent = `${st.hits.length} ${T.projects} · ${parts.length ? parts.join(' + ') : T.finderNone}`;
      selN.textContent = st.sel.length ? ` · ${st.sel.length} ${T.topicsSel}` : '';
      clear.disabled = !on;
      renderTl();
    };
    for (const c of chips) c.addEventListener('click', () => { const t = c.dataset.tag; st.sel = st.sel.includes(t) ? st.sel.filter((x) => x !== t) : [...st.sel, t]; update(true); });
    for (const c of chs) c.addEventListener('click', () => { const i = c.dataset.ch === '' ? null : +c.dataset.ch; st.ch = i === st.ch ? null : i; update(true); });
    clear.addEventListener('click', () => { st.ch = null; st.sel = []; update(true); chs[0].focus(); });
    update(false);
    return {
      select(tags, ch = null) { st.sel = tags.slice(); st.ch = ch; update(true); return { count: st.hits.length, ids: st.hits.map((p) => p.id) }; },
      get hits() { return st.hits.map((p) => p.id); }, get selected() { return st.sel.slice(); }, get chapter() { return st.ch; },
    };
  })();

  /* ---------- Neuvonantajat: avaruusmadot, huomiokenttä ja ajatukset ---------- */
  const personas = (() => {
    const cv = $('#bugs'), ctx = cv.getContext('2d'), bubble = $('#bubble'), lineEl = $('#crew-line'), toggle = $('#crew-toggle'), hero = $('[data-attn="hero"]');
    // notice: uuden kohteen huomaaminen (ms), dwell: kuinka kauan uuden kohteen pitää olla paras ennen siirtymää (ms)
    const TH = { engage: 0.35, speak: 0.55, hold: 600, release: 0.25, hyst: 0.12, tauUp: 0.35, tauDown: 1.2, arrive: 28, notice: 600, dwell: 450 };
    const WHO = ['loiste', 'hionta', 'kirkkaus'];
    const SLOT = [[-44, 16], [42, 12], [0, -32]]; // levossa päät kolmiossa oikeassa alakulmassa
    // Kohteessa madot kiertävät pyöristettyä kehää jonossa (px ja px/s, puhuessa hitaammin) ja väistävät osoitinta
    const RING = { pad: 16, round: 26, gap: 58, v: 16, vTalk: 6, dodge: 110 };
    // Jokaisella madolla oma muoto ja liike: Loiste pomppii, Hionta kulkee suoraan, Kirkkaus aaltoilee hitaasti.
    // Loiste johtaa jonoa, joten sen sp on matkanopeus; muut seuraavat sen jälkeä.
    const FORM = {
      loiste: { n: 9, gap: 5.6, r: (k) => 6.4 - k * 0.38, sp: 150, wig: 0.5, freq: 7 },
      hionta: { n: 8, gap: 6.6, r: (k) => 6.2 - k * 0.3, sp: 170, wig: 0.14, freq: 4.5 },
      kirkkaus: { n: 13, gap: 4.6, r: (k) => 5.2 - k * 0.3, sp: 140, wig: 0.75, freq: 2.6 },
    };
    const AV = new WeakMap(); // elementti → huomioarvo A
    const st = { focus: null, focusEl: null, speaking: false, spoken: false, line: null, lines: [], fact: 0, log: [], hidden: store.get('infinite-crew') === 'off', aboveSince: 0, mode: 'focus', arrived: false, welcome: true, ring: null, u: 0, orbit: false, notice: -1e9, cand: null, candSince: 0 };
    let pointer = null, last = 0, lineTimer = 0, W = 0, H = 0, dpr = 1, S = 1, blank = false;
    const box = { x: 0, y: 0, w: 0, h: 0 };
    const worms = WHO.map((who, i) => ({ who, i, f: FORM[who], x: 0, y: 0, vx: 0, vy: 0, phase: i * 2, hop: 0, lift: 0, moving: false, dir: [0, -1], face: 1, segs: [] }));
    const trail = []; // johtajan jälki uusimmasta vanhimpaan; seuraajat kulkevat sitä pitkin
    // Hiiri: madot seuraavat osoitinta. Kosketus ja Tab: ne seuraavat fokusta tai näkymän keskellä olevaa kohtaa.
    addEventListener('pointermove', (e) => { if (e.pointerType !== 'touch') { pointer = [e.clientX, e.clientY]; st.mode = 'pointer'; } }, { passive: true });
    addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch') { pointer = null; st.mode = 'focus'; } }, { passive: true });
    document.addEventListener('mouseout', (e) => { if (!e.relatedTarget) { pointer = null; st.mode = 'focus'; } });
    document.addEventListener('keydown', (e) => { if (e.key === 'Tab') { pointer = null; st.mode = 'focus'; } });
    // Madot ja kehä pysyvät samoissa rajoissa, joten rajaus ei taita rataa
    const lim = () => { const m = W < 600 ? 22 : 40; return { x0: m, x1: W - m, y0: topbar.offsetHeight + 28, y1: H - 28 }; };
    const clampX = (x) => { const b = lim(); return Math.max(b.x0, Math.min(b.x1, x)); }, clampY = (y) => { const b = lim(); return Math.max(b.y0, Math.min(b.y1, y)); };
    const intensity = (e, vh) => {
      // Suljetun luvun kortti ei näy, vaikka selain antaa sille paikan otsikon kohdalta
      if (e.checkVisibility ? !e.checkVisibility() : e.closest('details:not([open])')) return 0;
      const r = e.getBoundingClientRect(); if (r.bottom <= 0 || r.top >= vh || !r.width) return 0;
      const top = topbar.offsetHeight, vc = (top + vh) / 2, half = Math.max(1, (vh - top) / 2);
      const d = vc >= r.top && vc <= r.bottom ? 0 : Math.min(Math.abs(r.top - vc), Math.abs(r.bottom - vc));
      let I = Math.max(0, 1 - d / half);
      // Osoitin ja näppäimistöfokus ratkaisevat, kun useampi kohta on yhtä keskellä (esim. rinnakkaiset kortit)
      if (pointer) { const dx = Math.max(r.left - pointer[0], 0, pointer[0] - r.right), dy = Math.max(r.top - pointer[1], 0, pointer[1] - r.bottom); I = Math.max(I * 0.8, 1 - Math.hypot(dx, dy) / 220); }
      if (e.contains(document.activeElement) && document.activeElement !== document.body) I = 1;
      return I;
    };
    // Laatikko, jonka ympäri madot kiertävät: huomion saanut kohta pienellä marginaalilla, rajattuna näkymään.
    // free = kehää ei ole rajattu pystysuunnassa, joten se liikkuu vierittäessä täsmälleen sivun mukana.
    const ringOf = (e) => {
      const r = e.getBoundingClientRect(), m = RING.pad * S, b = lim();
      const x0 = Math.max(b.x0, r.left - m), y0 = Math.max(b.y0, r.top - m), w = Math.max(40, Math.min(b.x1, r.right + m) - x0), h = Math.max(30, Math.min(b.y1, r.bottom + m) - y0);
      const c = Math.min(RING.round * S, w / 2, h / 2);
      return { el: e, x0, y0, x1: x0 + w, y1: y0 + h, w, h, c, L: 2 * (w + h) - 8 * c + 2 * Math.PI * c, free: r.top - m >= b.y0 && r.bottom + m <= b.y1 };
    };
    // Kehän piste osuudesta u ∈ [0, 1) myötäpäivään yläreunan alusta. Osuus pysyy, vaikka kehän koko muuttuu.
    const at = (R, u) => {
      const { x0, y0, x1, y1, c } = R, a = R.w - 2 * c, b = R.h - 2 * c, q = Math.PI * c / 2;
      let s = (((u % 1) + 1) % 1) * R.L;
      const arc = (cx, cy, t0) => { const t = t0 + (c ? s / c : 0); return [cx + Math.cos(t) * c, cy + Math.sin(t) * c]; };
      if (s < a) return [x0 + c + s, y0]; s -= a;
      if (s < q) return arc(x1 - c, y0 + c, -Math.PI / 2); s -= q;
      if (s < b) return [x1, y0 + c + s]; s -= b;
      if (s < q) return arc(x1 - c, y1 - c, 0); s -= q;
      if (s < a) return [x1 - c - s, y1]; s -= a;
      if (s < q) return arc(x0 + c, y1 - c, Math.PI / 2); s -= q;
      if (s < b) return [x0, y1 - c - s]; s -= b;
      return arc(x0 + c, y0 + c, Math.PI);
    };
    const nearestU = (R, x, y) => { let u = 0, best = Infinity; for (let k = 0; k < 120; k++) { const [px, py] = at(R, k / 120), d = (px - x) ** 2 + (py - y) ** 2; if (d < best) { best = d; u = k / 120; } } return u; };
    // Piste johtajan jäljellä matkan dist päässä sen päästä
    const trailAt = (dist) => {
      let p = [worms[0].x, worms[0].y];
      for (const q of trail) { const L = Math.hypot(q[0] - p[0], q[1] - p[1]); if (L >= dist) { const k = dist / L; return [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k]; } dist -= L; p = q; }
      return p;
    };
    const shift = (dy) => { for (const w of worms) { w.y += dy; for (const s of w.segs) s[1] += dy; } for (const p of trail) p[1] += dy; };
    // Tervetulossa madot ovat rinnakkain yläpalkin ja hero-kortin välissä päät oikealle. Rivi vierii sivun mukana.
    const stage = () => {
      const c = hero.getBoundingClientRect(), y = $('#etusivu').getBoundingClientRect().top + (W < 600 ? 58 : 46), cx = (c.left + c.right) / 2 + 30 * S;
      return worms.map((w) => [clampX(cx + (w.i - 1) * 100 * S), clampY(y)]);
    };
    // Esittelyn jälkeen jono muodostuu: johtajan jälki kulkee seuraajien päiden kautta, joten ne asettuvat sen perään
    const endWelcome = () => {
      st.welcome = false; trail.length = 0; let p = [worms[0].x, worms[0].y];
      for (const w of worms.slice(1)) { const n = Math.max(1, Math.round(Math.hypot(w.x - p[0], w.y - p[1]) / 4)); for (let k = 1; k <= n; k++) trail.push([p[0] + (w.x - p[0]) * k / n, p[1] + (w.y - p[1]) * k / n]); p = [w.x, w.y]; }
    };
    const goals = (now) => {
      const e = st.focusEl;
      if (st.welcome) { st.ring = null; return stage(); }
      if (!e) { st.ring = null; const ax = W - 120, ay = H - 150; return worms.map((w) => [ax + SLOT[w.i][0] * S, ay + SLOT[w.i][1] * S]); }
      const R = ringOf(e), P = st.ring;
      // Saman kohteen kehä siirtyi vierityksen takia: madot kulkevat sivun mukana eivätkä jää jälkeen
      if (P && P.el === e && P.free && R.free && R.y0 !== P.y0 && Math.abs(R.y0 - P.y0) < 400) shift(R.y0 - P.y0);
      st.ring = R;
      // Uuden kohteen huomattuaan madot pysähtyvät hetkeksi ja kääntyvät sitä kohti
      if (now - st.notice < TH.notice) return worms.map((w) => [w.x, w.y]);
      const gu = Math.min(RING.gap * S / R.L, 1 / 3);
      return worms.map((w) => {
        // Matkalla muut seuraavat Loisteen jälkeä jonossa. Kun Loiste on kehällä, muut asettuvat kehälle sen taakse.
        let [x, y] = !w.i || st.orbit || reduced() ? at(R, st.u - w.i * gu) : trailAt(w.i * RING.gap * S);
        // Osoitin väistetään: kohde siirtyy siitä suoraan poispäin, kunnes väli on RING.dodge
        if (pointer) { const dx = x - pointer[0], dy = y - pointer[1], d = Math.hypot(dx, dy), k = RING.dodge - d; if (k > 0 && d > 0.5) { x += dx / d * k; y += dy / d * k; } }
        return [clampX(x), clampY(y)];
      });
    };
    const renderLine = () => {
      if (st.line) {
        lineEl.textContent = `${pname(st.line.who)}: ${st.line.text}`;
        $('strong', bubble).className = 'who-' + st.line.who; $('strong', bubble).textContent = `${pname(st.line.who)} · ${D.points[st.line.point].label}`;
        $('span', bubble).textContent = st.line.text; bubble.dataset.who = st.line.who;
        return;
      }
      bubble.hidden = true; lineEl.textContent = '';
    };
    const clearLine = () => { clearTimeout(lineTimer); st.speaking = false; st.line = null; renderLine(); };
    const engage = (e, now) => { clearLine(); st.focusEl = e; st.focus = e.dataset.attn; st.spoken = false; st.aboveSince = 0; st.cand = null; st.u = nearestU(ringOf(e), worms[0].x, worms[0].y); st.notice = reduced() ? -1e9 : now; st.orbit = false; };
    const release = () => { clearLine(); st.focusEl = null; st.focus = null; st.spoken = false; st.aboveSince = 0; st.orbit = false; };
    const say = (i) => {
      // Projektin keskustelun päättää vaihtuva huomio Infinitestä
      // Joukolla voi olla kohtaan omat repliikkinsa (welcomeB, heroE …): linnut esittelevät itsensä linnuiksi, tontut tontuiksi
      if (!i) { st.lines = (D.points[st.focus + SUF[theme.cast()]] || D.points[st.focus] || { lines: [] }).lines.map((x) => ({ ...x, point: st.focus }));
        if (st.focus.startsWith('p-')) { const F = D.points.infinite.lines; st.lines.push({ ...F[st.fact++ % F.length], point: 'infinite' }); } }
      const lines = st.lines;
      if (i >= lines.length) { st.speaking = false; st.line = null; renderLine(); if (st.focus === 'welcome') { endWelcome(); st.focus = st.focusEl.dataset.attn; } return; }
      const ln = lines[i]; st.line = { who: ln.who, text: ln.text, point: ln.point, index: i, total: lines.length };
      st.log.push({ time: new Date(), point: ln.point, who: ln.who, text: ln.text });
      $('#log-count').textContent = String(st.log.length); renderLine();
      lineTimer = setTimeout(() => say(i + 1), 2200 + ln.text.length * 45);
    };
    const place = (w, x, y) => { w.x = x; w.y = y; w.segs = Array.from({ length: w.f.n }, (_, k) => [x + k * w.f.gap * S, y + k * 1.5]); };
    const move = (dt, now, G) => {
      const still = reduced(), R = st.ring; let arrived = true;
      // Kohteessa madot katsovat laatikon keskelle, levossa toisiaan kohti. Esittelyssä puhuja katsoo lukijaa ja muut puhujaa.
      const fx = R ? (R.x0 + R.x1) / 2 : (G[0][0] + G[1][0] + G[2][0]) / 3, fy = R ? (R.y0 + R.y1) / 2 : (G[0][1] + G[1][1] + G[2][1]) / 3;
      const sp = st.welcome && st.line && worms.find((o) => o.who === st.line.who);
      const look = (w, x, y) => (!st.welcome ? [fx - x, fy - y] : sp && sp !== w ? [sp.x - x, sp.y - y] : [0.35, 1]);
      for (const w of worms) {
        const [gx, gy] = G[w.i], F = w.f, tn = now - st.notice - w.i * 110;
        // Puhuja nostaa päänsä noin 0,2 sekunnissa ja laskee sen, kun vuoro vaihtuu (liikettä vähennettäessä heti)
        const talk = st.line && st.line.who === w.who ? 1 : 0; w.lift = still ? talk : w.lift + (talk - w.lift) * (1 - Math.exp(-dt / 0.18)); w.hop = 0;
        if (tn > 0 && tn < 300) w.hop = Math.sin(tn / 300 * Math.PI) * 7; // huomatessaan mato hypähtää
        if (still) { if (w.x !== gx || w.y !== gy) place(w, gx, gy); w.moving = false; w.dir = look(w, gx, gy); continue; }
        // Seuraajat kirivät jäljessä, jotta jono pysyy koossa johtajan matkanopeudella
        const dx = gx - w.x, dy = gy - w.y, d = Math.hypot(dx, dy), spd = w.i ? Math.min(F.sp * 1.6, d * 3) : Math.min(F.sp, d * 2.2), k = 1 - Math.exp(-dt / 0.3);
        let tx = d > 0.5 ? dx / d * spd : 0, ty = d > 0.5 ? dy / d * spd : 0;
        for (const o of worms) if (o !== w) { const ex = w.x - o.x, ey = w.y - o.y, e2 = ex * ex + ey * ey; if (e2 < 900 && e2 > 0.01) { const e = Math.sqrt(e2); tx += ex / e * (30 - e) * 6; ty += ey / e * (30 - e) * 6; } }
        w.vx += (tx - w.vx) * k; w.vy += (ty - w.vy) * k;
        const v = Math.hypot(w.vx, w.vy), a = Math.sin(w.phase) * F.wig * Math.min(1, v / 150) * Math.min(1, d / 80); // mutkittelu, joka vaimenee perillä
        w.x += (w.vx * Math.cos(a) - w.vy * Math.sin(a)) * dt; w.y += (w.vx * Math.sin(a) + w.vy * Math.cos(a)) * dt;
        w.phase += dt * F.freq * Math.min(1, 0.25 + v / 200); w.moving = v > 14;
        w.dir = w.moving ? [w.vx, w.vy] : look(w, w.x, w.y);
        // Jäsenet seuraavat edellistä vakioetäisyydellä
        w.segs[0] = [w.x, w.y];
        for (let j = 1; j < w.segs.length; j++) {
          const p = w.segs[j - 1], q = w.segs[j], ex = q[0] - p[0], ey = q[1] - p[1], L = Math.hypot(ex, ey) || 1, g = F.gap * S;
          w.segs[j] = [p[0] + ex / L * g, p[1] + ey / L * g];
        }
        if (d > TH.arrive) arrived = false;
      }
      st.arrived = arrived;
    };
    const mix = (c, t, k) => c.map((v, i) => Math.round(v + (t[i] - v) * k));
    const dot = (x, y, r, fill) => { ctx.beginPath(); ctx.arc(x, y, Math.max(0.3, r), 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); };
    const drawWorm = (w, t, c, lite) => {
      const F = w.f, segs = w.segs, n = segs.length, dl = Math.hypot(w.dir[0], w.dir[1]) || 1, ux = w.dir[0] / dl, uy = w.dir[1] / dl, px = -uy, py = ux;
      const breath = reduced() ? 0 : 0.05, white = [255, 255, 255], black = [10, 12, 24];
      ctx.save(); ctx.translate(0, -w.hop);
      // Puhujan etujäsenet nousevat ja suurenevat, mutta varjo jää maahan, joten pää erottuu ylös nostettuna
      const lift = (k) => w.lift * Math.max(0, 1 - k / 5) * (14 + (reduced() ? 0 : 2 * Math.sin(t * 4))) * S, grow = (k) => 1 + 0.3 * w.lift * Math.max(0, 1 - k / 3);
      for (let k = n - 1; k >= 0; k -= 2) dot(segs[k][0] + 2, segs[k][1] + 4 + w.hop, F.r(k) * S, lite ? 'rgba(20,30,60,0.10)' : 'rgba(0,0,0,0.28)');
      for (let k = n - 1; k >= 0; k--) {
        const x = segs[k][0], y = segs[k][1] - lift(k), r = F.r(k) * S * grow(k) * (1 + breath * Math.sin(t * 2.2 + k * 0.7));
        if (w.who === 'loiste') { // hehkumato: valoa jokaisessa jäsenessä
          if (!lite) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2.8); g.addColorStop(0, rgba(c, 0.32)); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.fillRect(x - r * 3, y - r * 3, r * 6, r * 6); ctx.restore(); }
          const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r); g.addColorStop(0, rgba(mix(c, white, 0.6), 1)); g.addColorStop(0.6, rgba(c, 1)); g.addColorStop(1, rgba(mix(c, black, 0.45), 1));
          dot(x, y, r, g);
        } else if (w.who === 'hionta') { // panssarimato: metallilevyt ja niittisaumat
          const g = ctx.createLinearGradient(x + px * r, y + py * r, x - px * r, y - py * r); g.addColorStop(0, rgba(mix(c, black, 0.5), 1)); g.addColorStop(0.45, rgba(mix(c, white, 0.45), 1)); g.addColorStop(1, rgba(mix(c, black, 0.35), 1));
          dot(x, y, r, g); ctx.strokeStyle = rgba(mix(c, black, 0.6), 0.9); ctx.lineWidth = 1; ctx.stroke();
          if (k % 2 === 0 && k > 0) dot(x, y, r * 0.22, rgba(mix(c, white, 0.8), 0.9));
        } else { // sielumato: läpikuultava, evät aaltoilevat
          dot(x, y, r, rgba(c, lite ? 0.28 : 0.22)); ctx.strokeStyle = rgba(mix(c, white, lite ? 0.1 : 0.5), 0.75); ctx.lineWidth = 1; ctx.stroke();
          dot(x, y, r * 0.35, rgba(mix(c, white, 0.6), 0.8));
          if (k % 3 === 1) for (const s of [-1, 1]) {
            const fl = r * 2.4, wv = Math.sin(t * 3 - k + s) * r;
            ctx.beginPath(); ctx.moveTo(x + px * r * s, y + py * r * s);
            ctx.quadraticCurveTo(x + px * fl * s - ux * wv, y + py * fl * s - uy * wv, x + px * fl * 1.3 * s - ux * r * 2, y + py * fl * 1.3 * s - uy * r * 2);
            ctx.strokeStyle = rgba(c, 0.55); ctx.stroke();
          }
        }
      }
      const hx = segs[0][0], hy = segs[0][1] - lift(0), hr = F.r(0) * S * grow(0), talk = st.line && st.line.who === w.who ? 1 : 0, wig = reduced() ? 0 : Math.sin(t * 3 + w.i * 2);
      ctx.lineCap = 'round';
      if (w.who === 'loiste') {
        const bx = hx + ux * hr * 2.6 + px * hr * (0.8 + 0.3 * wig), by = hy + uy * hr * 2.6 + py * hr * (0.8 + 0.3 * wig) - talk * 3;
        ctx.beginPath(); ctx.moveTo(hx + ux * hr * 0.6, hy + uy * hr * 0.6); ctx.quadraticCurveTo(hx + ux * hr * 2, hy + uy * hr * 2 - hr, bx, by);
        ctx.strokeStyle = rgba(mix(c, black, 0.4), 1); ctx.lineWidth = 1.2; ctx.stroke();
        dot(bx, by, 2.4 * S * (1 + 0.25 * Math.sin(t * 5)), rgba(mix(c, white, 0.7), 1));
        const [tx, ty] = segs[n - 1]; dot(tx, ty, 2 * S, rgba(mix(c, white, 0.8), 0.9 * (0.6 + 0.4 * Math.sin(t * 4))));
        for (const s of [-1, 1]) { const ex = hx + ux * hr * 0.35 + px * hr * 0.45 * s, ey = hy + uy * hr * 0.35 + py * hr * 0.45 * s; dot(ex, ey, hr * 0.38, '#fff'); dot(ex + ux * hr * 0.12, ey + uy * hr * 0.12, hr * 0.2, '#111'); }
      } else if (w.who === 'hionta') {
        ctx.strokeStyle = rgba(mix(c, black, 0.5), 1); ctx.lineWidth = 1.2;
        for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(hx + ux * hr * 0.6 + px * hr * 0.4 * s, hy + uy * hr * 0.6 + py * hr * 0.4 * s); ctx.lineTo(hx + ux * hr * 1.7 + px * hr * (0.9 + talk * 0.3) * s, hy + uy * hr * 1.7 + py * hr * (0.9 + talk * 0.3) * s); ctx.stroke(); }
        ctx.beginPath(); ctx.moveTo(hx + ux * hr * 0.45 + px * hr * 0.75, hy + uy * hr * 0.45 + py * hr * 0.75); ctx.lineTo(hx + ux * hr * 0.45 - px * hr * 0.75, hy + uy * hr * 0.45 - py * hr * 0.75);
        ctx.strokeStyle = 'rgba(8,14,30,0.95)'; ctx.lineWidth = hr * 0.55; ctx.stroke();
        const sc = Math.sin(t * 2.5) * 0.55; dot(hx + ux * hr * 0.45 + px * hr * sc, hy + uy * hr * 0.45 + py * hr * sc, hr * 0.2, 'rgb(120,230,255)');
      } else {
        ctx.strokeStyle = rgba(mix(c, white, lite ? 0 : 0.3), 0.85); ctx.lineWidth = 1;
        for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(hx + ux * hr * 0.6 + px * hr * 0.3 * s, hy + uy * hr * 0.6 + py * hr * 0.3 * s); ctx.quadraticCurveTo(hx + ux * hr * 2.2 + px * hr * (1 + wig * 0.4) * s, hy + uy * hr * 2.2 + py * hr * (1 + wig * 0.4) * s, hx + ux * hr * 3.2 + px * hr * (1.6 + talk) * s, hy + uy * hr * 3.2 + py * hr * (1.6 + talk) * s); ctx.stroke(); }
        for (const [a, b] of [[0.55, 0.4], [0.55, -0.4], [0.05, 0]]) { const ex = hx + ux * hr * a + px * hr * b, ey = hy + uy * hr * a + py * hr * b; dot(ex, ey, hr * 0.26, '#fff'); dot(ex + ux * hr * 0.08, ey + uy * hr * 0.08, hr * 0.13, rgba(mix(c, black, 0.5), 1)); }
      }
      ctx.restore();
    };
    // Talvi-teeman linnut sivusta: harakka (Loiste), merikotka (Hionta) ja tunturipöllö (Kirkkaus). Liike ja huomio ovat samat kuin madoilla.
    // flap kertoo siiveniskujen tiheyden madon vaiheeseen nähden, amp heilahduksen levossa ja täydessä vauhdissa, up siiven perusasennon.
    const BIRD = {
      loiste: { size: 1, flap: 2.2, amp: [0.5, 1], up: 0 }, // harakka: tiheät iskut, pyrstö keikkuu
      hionta: { size: 1.15, flap: 0.8, amp: [0.12, 0.45], up: 0.35 }, // merikotka: liitää siivet koholla ja iskee harvoin
      kirkkaus: { size: 1.05, flap: 2, amp: [0.35, 0.8], up: 0 }, // tunturipöllö: pehmeät, hitaat iskut
    };
    const drawBird = (w, t, c) => {
      const B = BIRD[w.who], dl = Math.hypot(w.dir[0], w.dir[1]) || 1, still = reduced(), talk = st.line && st.line.who === w.who ? 1 : 0;
      if (Math.abs(w.dir[0]) > 0.25 * dl) w.face = Math.sign(w.dir[0]); // pystysuunnassa lintu pitää entisen suuntansa
      const v = Math.hypot(w.vx, w.vy), tilt = w.moving ? Math.max(-0.5, Math.min(0.5, Math.atan2(w.dir[1], Math.abs(w.dir[0])))) * 0.5 : 0;
      const u = 7 * S * B.size * (1 + 0.25 * w.lift), a = B.up + (still ? 0.3 : Math.sin(w.phase * B.flap) * (B.amp[0] + (B.amp[1] - B.amp[0]) * Math.min(1, v / 120)));
      const ell = (x, y, rx, ry, fill, edge) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); if (edge) { ctx.strokeStyle = edge; ctx.lineWidth = 1 / u; ctx.stroke(); } };
      const poly = (pts, fill) => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) ctx.lineTo(p[0], p[1]); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };
      // Siipi: tyvi selässä, kärki nousee (a > 0) tai laskee (a < 0) siiveniskun mukana
      const wing = (len, fill, edge) => {
        const tx = -0.45 * len, ty = -0.35 - a * len;
        ctx.beginPath(); ctx.moveTo(0.6, -0.3); ctx.quadraticCurveTo(0.15, ty * 0.85 - 0.15, tx, ty);
        ctx.quadraticCurveTo(-0.35 * len, -0.35 - a * len * 0.35 + 0.3, -0.75, -0.1); ctx.closePath();
        ctx.fillStyle = fill; ctx.fill(); if (edge) { ctx.strokeStyle = edge; ctx.lineWidth = 1 / u; ctx.stroke(); }
      };
      const beak = (top, bottom, fill) => { poly(top, fill); if (talk && !still && Math.sin(t * 9) > 0) poly(bottom, fill); };
      // Varjo jää maahan, kun puhuja nousee
      ctx.beginPath(); ctx.ellipse(w.x, w.y + 16 * S, 1.6 * u, 0.4 * u, 0, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fill();
      ctx.save(); ctx.translate(w.x, w.y - w.hop - 6 * S * w.lift); ctx.scale(w.face * u, u); ctx.rotate(tilt); ctx.lineJoin = 'round';
      if (w.who === 'loiste') {
        const bob = still ? 0 : Math.sin(t * 5) * 0.12 + talk * Math.sin(t * 9) * 0.15, rim = 'rgba(220,235,255,0.4)';
        ctx.save(); ctx.translate(0.2, -0.05); wing(2, '#0b0d12'); ctx.restore();
        const g = ctx.createLinearGradient(-1.1, 0, -3.4, 0); g.addColorStop(0, '#101218'); g.addColorStop(1, rgba(c, 1));
        poly([[-1.1, -0.15], [-3.3, -0.55 + bob], [-3.45, -0.25 + bob], [-1.1, 0.25]], g);
        ell(0, 0, 1.45, 0.8, '#101218', rim); ell(0.15, 0.3, 0.95, 0.42, '#f2f4f7');
        ell(1.35, -0.45, 0.6, 0.55, '#101218', rim);
        beak([[1.85, -0.58], [2.45, -0.44], [1.85, -0.36]], [[1.85, -0.36], [2.3, -0.3], [1.85, -0.26]], '#2c3038');
        ell(1.52, -0.56, 0.12, 0.12, '#fff'); ell(1.56, -0.56, 0.065, 0.065, '#000');
        wing(2, '#14161d', rim); ctx.save(); ctx.translate(0.15, -0.12); ctx.scale(0.55, 0.55); wing(2, '#e9edf2'); ctx.restore();
      } else if (w.who === 'hionta') {
        ctx.save(); ctx.translate(0.2, -0.05); wing(2.6, '#3a2718'); ctx.restore();
        poly([[-1.5, -0.25], [-2.5, -0.45], [-2.55, 0.2], [-1.5, 0.3]], '#f3efe6');
        const g = ctx.createLinearGradient(0, -0.9, 0, 0.9); g.addColorStop(0, '#7a5534'); g.addColorStop(1, '#4a3220');
        ell(0, 0, 1.75, 0.9, g); ell(1.55, -0.5, 0.62, 0.55, '#dcc8a0');
        beak([[1.95, -0.7], [2.55, -0.66], [2.72, -0.36], [2.5, -0.4], [1.95, -0.32]], [[1.95, -0.32], [2.4, -0.3], [1.95, -0.2]], '#f0c03a');
        ell(1.7, -0.62, 0.1, 0.1, '#e8a317'); ell(1.73, -0.62, 0.05, 0.05, '#000');
        ctx.beginPath(); ctx.moveTo(1.5, -0.78); ctx.lineTo(1.9, -0.72); ctx.strokeStyle = '#6b5233'; ctx.lineWidth = 1.4 / u; ctx.stroke(); // tarkka, tiukka katse
        wing(2.6, '#5a3d25', '#2c1d12');
      } else {
        ctx.save(); ctx.translate(0.2, -0.05); wing(1.8, '#cfd6de'); ctx.restore();
        poly([[-1.05, -0.1], [-1.75, 0], [-1.7, 0.4], [-1, 0.35]], '#e6eaef');
        ell(0, 0.05, 1.25, 1, '#f6f8fb', 'rgba(150,165,185,0.7)');
        for (const [sx, sy] of [[-0.6, 0.1], [-0.2, 0.45], [0.3, 0.2], [-0.4, -0.3], [0.1, 0.65]]) ell(sx, sy, 0.09, 0.06, '#6b7480');
        ell(0.85, -0.75, 0.85, 0.8, '#f9fbfd', 'rgba(150,165,185,0.7)');
        const blink = !still && (t * 0.7 + w.i) % 4 < 0.12;
        for (const [ex, ey, r] of [[0.72, -0.86, 0.25], [1.3, -0.83, 0.22]]) { ell(ex, ey, r, blink ? r * 0.2 : r, '#f5c518'); if (!blink) ell(ex + 0.06, ey, r * 0.5, r * 0.5, '#111'); }
        beak([[1.0, -0.62], [1.22, -0.62], [1.1, -0.4]], [[1.02, -0.45], [1.18, -0.45], [1.1, -0.3]], '#3a3f48');
        wing(1.8, '#eef1f5', '#a7b0bb');
      }
      ctx.restore();
    };
    // Joulun tontut ja Kekrin haamut: design-taulun SVG-muodot Path2D-polkuina (yksiköt 240 × 200, keskipiste 124, 118).
    // Liike ja huomio ovat samat kuin madoilla; jalat, lakit, helmat ja jäljet liikkuvat piirrossa.
    const P2 = {};
    const pth = (d) => P2[d] || (P2[d] = new Path2D(d));
    const fp = (d, c) => { ctx.fillStyle = c; ctx.fill(pth(d)); };
    const sk = (d, c, lw) => { ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.stroke(pth(d)); };
    const ov = (x, y, rx, ry, c, rot = 0) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); ctx.fillStyle = c; ctx.fill(); };
    const around = (x, y, a, fn) => { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.translate(-x, -y); fn(); ctx.restore(); };
    const spark = (x, y, r) => { const k = r * 0.18; ctx.beginPath(); ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x + k, y - k, x + r, y); ctx.quadraticCurveTo(x + k, y + k, x, y + r); ctx.quadraticCurveTo(x - k, y + k, x - r, y); ctx.quadraticCurveTo(x - k, y - k, x, y - r); ctx.fill(); };
    // Suunta, koko ja varjo kuten linnuilla: puhuja kasvaa 25 %, ja varjo jää maahan
    const pose = (w, shadowRx) => {
      const dl = Math.hypot(w.dir[0], w.dir[1]) || 1; if (Math.abs(w.dir[0]) > 0.25 * dl) w.face = Math.sign(w.dir[0]);
      const sc = 0.27 * S * (1 + 0.25 * w.lift);
      ctx.beginPath(); ctx.ellipse(w.x, w.y + 68 * sc, shadowRx * sc, 6 * sc, 0, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.fill();
      return sc;
    };
    const ELF = { loiste: 'kurkki', hionta: 'hoyla', kirkkaus: 'loyly' }, GHOST = { loiste: 'poo', hionta: 'lyhty', kirkkaus: 'usva' };
    const drawElf = (w, t) => {
      const kind = ELF[w.who], still = reduced(), talk = st.line && st.line.who === w.who ? 1 : 0, v = Math.hypot(w.vx, w.vy), mv = w.moving && !still ? 1 : 0;
      const sc = pose(w, 40), stepA = Math.sin(w.phase * 2) * 0.45 * mv, bob = kind === 'kurkki' ? Math.abs(Math.sin(w.phase * 2)) * 8 * mv : Math.abs(stepA) * 4;
      const tr = 0.35 + 0.65 * Math.min(1, v / 80), body = { kurkki: '#c8312b', hoyla: '#2f7d4f', loyly: '#d9d2c3' }[kind], dark = { kurkki: '#9c241f', hoyla: '#235f3c', loyly: '#b3aa96' }[kind];
      ctx.save(); ctx.translate(w.x, w.y - w.hop - 6 * S * w.lift - bob * sc); ctx.scale(w.face * sc, sc); ctx.translate(-124, -118);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      // Jälki vahvistuu vauhdissa: Kurkilla kultaisia kipinöitä, Höylällä lastuja, Löylyllä nousevaa höyryä
      if (kind === 'kurkki') { ctx.fillStyle = '#f3cf63'; [[52, 112, 7, 0.95], [30, 138, 5, 0.8], [64, 152, 4, 0.7], [18, 98, 4, 0.6], [40, 80, 3, 0.5]].forEach(([x, y, r, o], i) => { ctx.globalAlpha = o * tr * (still ? 1 : 0.6 + 0.4 * Math.sin(t * 6 + i)); spark(x, y, r); }); }
      else if (kind === 'hoyla') { ctx.globalAlpha = tr; [[56, 118, 1], [32, 144, 0.8], [22, 102, 0.7]].forEach(([x, y, k], i) => around(x + 5, y - 4, still ? 0 : t * 0.8 + i, () => sk(`M${x} ${y} c-7 -9 7 -16 12 -7 c4 7 -5 12 -9 7 c-3 -4 2 -7 4 -4`, '#d9a066', 3 * k))); }
      else { [[60, 106, 9, 0.22], [42, 88, 12, 0.18], [22, 68, 15, 0.14]].forEach(([x, y, r, o], i) => { const up = still ? 0 : (t * 8 + i * 9) % 18; ctx.globalAlpha = tr * (1 - up / 18); ctx.beginPath(); ctx.arc(x, y - up, r, 0, Math.PI * 2); ctx.fillStyle = `rgba(240,244,250,${o})`; ctx.fill(); ctx.strokeStyle = `rgba(240,244,250,${o + 0.12})`; ctx.lineWidth = 1.5; ctx.stroke(); }); }
      ctx.globalAlpha = 1;
      for (const [hx, x1, y1, bx, by, a] of [[112, 106, 173, 110, 176, stepA], [132, 138, 171, 143, 174, -stepA]]) around(hx, 150, a, () => { ctx.strokeStyle = '#3a2a22'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(hx, 150); ctx.lineTo(x1, y1); ctx.stroke(); ov(bx, by, 11, 6, '#2b1d16'); });
      fp('M92 152 C92 122 102 104 122 102 C142 104 152 122 152 152 C140 161 104 161 92 152 Z', body);
      ctx.globalAlpha = 0.6; fp('M92 152 C92 124 100 108 114 103 C104 116 102 134 104 157 C98 156 94 154 92 152 Z', dark); ctx.globalAlpha = 1;
      if (kind === 'hoyla') { fp('M122 110 C138 112 148 126 150 150 C140 156 128 157 120 156 Z', '#8a5a36'); sk('M128 128 L144 128', '#6a4227', 2); }
      else { sk('M95 136 C110 141 134 141 149 136', '#2b1d16', 6); ctx.fillStyle = '#f0c44c'; ctx.fillRect(126, 134, 9, 8); }
      if (kind === 'loyly') sk('M110 106 L148 142', '#f4f1ea', 7);
      sk('M138 114 C150 118 156 126 160 134', dark, 9);
      // Puhuessa Höylä nostaa vasaraa ja Löylyn vihta heilahtaa
      const pa = kind === 'hoyla' ? (talk && !still ? -0.7 * Math.abs(Math.sin(t * 7)) : 0) : kind === 'loyly' ? (still ? 0 : talk ? 0.45 * Math.sin(t * 5) : 0.08 * Math.sin(t * 1.5)) : 0;
      around(162, 136, pa, () => {
        if (kind === 'kurkki') { ctx.fillStyle = '#2f8a4e'; ctx.fillRect(150, 136, 25, 21); ctx.fillStyle = '#f3cf63'; ctx.fillRect(160.5, 136, 4, 21); ctx.fillRect(150, 144.5, 25, 4); ov(157, 133, 5.5, 3.5, '#f3cf63', -0.35); ov(168, 133, 5.5, 3.5, '#f3cf63', 0.35); }
        else if (kind === 'hoyla') { sk('M160 142 L175 110', '#a06b3e', 4.5); fp('M165 106 L184 114 L181 121 L162 113 Z', '#9aa6b2'); sk('M165 106 L184 114 L181 121 L162 113 Z', '#6c7682', 1); }
        else { sk('M160 142 L168 118', '#8a6a43', 4); for (const [x, y, rx, ry, r, c] of [[170, 106, 9, 5, -30, '#5aa65a'], [179, 113, 8, 4.5, 10, '#3f8a45'], [166, 97, 8, 4.5, -60, '#74c072'], [181, 101, 7, 4, -20, '#5aa65a']]) ov(x, y, rx, ry, c, r * Math.PI / 180); }
      });
      ov(162, 136, 5.5, 5.5, '#f1c6a2');
      if (kind === 'hoyla') { sk('M108 80 L120 66', '#f2c94c', 4); sk('M120 66 L123 63', '#3a2a22', 3); }
      ov(114, 88, 5, 7, '#e2ac86'); ov(128, 86, 21, 21, '#f1c6a2');
      ctx.globalAlpha = 0.55; ov(139, 95, 5, 5, '#f29a8f'); ctx.globalAlpha = 1;
      if (kind === 'hoyla') { fp('M118 94 C120 110 132 116 145 111 C151 107 151 101 149 97 C141 101 128 101 118 94 Z', '#7a4a2a'); fp('M138 97 Q145 92 153 97 Q146 101 138 97 Z', '#6b3f23'); }
      else if (kind === 'loyly') {
        around(134, 100, talk && !still ? 0.06 * Math.sin(t * 9) : 0, () => { fp('M114 92 C114 118 124 142 140 148 C147 134 152 116 153 99 C144 104 128 104 114 92 Z', '#f3f1ec'); sk('M128 112 C130 124 134 134 138 140 M138 108 C141 120 142 128 143 136', '#d8d3c8', 1.4); });
        fp('M136 98 Q146 92 156 99 Q146 103 136 98 Z', '#e7e3da');
      } else {
        ctx.fillStyle = '#b06a4a'; for (const [x, y] of [[133, 92], [136.5, 96], [130.5, 96.5]]) { ctx.beginPath(); ctx.arc(x, y, 0.9, 0, Math.PI * 2); ctx.fill(); }
        sk(talk && !still && Math.sin(t * 9) > 0 ? 'M137 100 Q144 109 151 99' : 'M137 101 Q144 106 151 100', '#5a2a1a', 2);
      }
      ov(148, 90, 6.5, 6.5, '#e8928a'); ctx.globalAlpha = 0.6; ov(146, 88, 1.6, 1.6, '#ffffff'); ctx.globalAlpha = 1;
      if (kind === 'loyly') { sk('M134 82 Q138 79 142 82', '#2a1d14', 2); sk('M132 75 Q138 71 145 75', '#f3f1ec', 3.5); }
      else { ov(139, 82, 2.6, 3.2, '#1b1410'); ov(140, 81, 0.9, 0.9, '#ffffff'); sk('M134 75 Q139 72 144 75', '#6b4a33', 2); }
      if (kind === 'hoyla') {
        ctx.fillStyle = talk && !still && Math.sin(t * 4) > 0.6 ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.08)'; ctx.beginPath(); ctx.arc(139, 82, 6, 0, Math.PI * 2); ctx.fill(); // silmälasit välähtävät
        sk('M145 82 A6 6 0 1 0 133 82 A6 6 0 1 0 145 82', '#c9b37a', 1.6); sk('M133 82 L116 84', '#c9b37a', 1.4);
      }
      // Lakki heiluu; puhuessaan Kurkki nostaa lakkiaan ja tiuku kilahtaa
      const capA = still ? 0 : 0.05 * Math.sin(t * 3 + w.i), up = kind === 'kurkki' ? talk * (still ? 1 : 0.5 + 0.5 * Math.sin(t * 6)) : 0;
      ctx.save(); ctx.translate(0, -8 * up); around(128, 74, capA - 0.22 * up, () => {
        if (kind === 'kurkki') {
          fp('M104 76 C102 56 84 36 60 28 C92 34 128 48 152 72 Z', '#d63a32'); ctx.globalAlpha = 0.5; fp('M104 76 C103 60 90 44 70 33 C88 42 98 58 112 74 Z', '#a8281f'); ctx.globalAlpha = 1;
          sk('M102 78 Q128 64 154 74', '#f4efe6', 10);
          around(60, 26, still ? 0 : 0.3 * Math.sin(t * 9), () => { ctx.strokeStyle = '#f0c44c'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(60, 22.5, 2.2, 0, Math.PI * 2); ctx.stroke(); ov(58, 30, 7, 7, '#f0c44c'); sk('M54 32 L62 32', '#8a6a1f', 1.6); ctx.globalAlpha = 0.8; ov(55.5, 27, 1.8, 1.8, '#ffffff'); ctx.globalAlpha = 1; });
        } else if (kind === 'hoyla') { fp('M104 76 C100 54 116 40 134 40 C153 40 167 50 168 63 C160 57 151 59 152 72 Z', '#d63a32'); sk('M102 78 Q128 64 154 74', '#f4efe6', 10); ov(169, 65, 7, 7, '#f4efe6'); }
        else { fp('M104 78 C104 56 117 46 130 46 C144 46 155 57 155 76 Z', '#8f8a82'); sk('M112 60 C120 54 140 54 148 60', '#a39e95', 1.4); ov(130, 78, 31, 6, '#7b766e'); fp('M116 68 Q120 62 124 68 Q120 72 116 68 Z', '#6bb36b'); }
      }); ctx.restore();
      ctx.restore();
    };
    const drawGhost = (w, t, c) => {
      const kind = GHOST[w.who], still = reduced(), talk = st.line && st.line.who === w.who ? 1 : 0, v = Math.hypot(w.vx, w.vy), mv = w.moving && !still ? 1 : 0;
      const sc = pose(w, kind === 'usva' ? 26 : 30), fl = still ? 0 : Math.sin(t * 2 + w.i * 1.7) * 5, tr = 0.35 + 0.65 * Math.min(1, v / 80);
      ctx.save(); ctx.translate(w.x, w.y - w.hop - 6 * S * w.lift + fl * sc); ctx.scale(w.face * sc, sc);
      if (kind === 'poo' && mv) ctx.rotate(0.18 * Math.sin(w.phase)); // Pöö keikkuu lentäessään
      ctx.translate(-124, -118); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      // Helma aaltoilee: kaarevat lovet oikealta vasemmalle
      const hem = (b, x0, x1, y, n, amp) => { const dx = (x1 - x0) / n; for (let k = 0; k < n; k++) { const xa = x0 + dx * k; b.quadraticCurveTo(xa + dx / 2, y + 10 + (still ? 0 : Math.sin(t * 5 + k * 1.4 + w.i) * amp), xa + dx, y); } };
      if (kind === 'poo') {
        ctx.fillStyle = c; [[62, 126, 4, 0.75], [46, 142, 3, 0.55], [30, 118, 2.5, 0.45], [52, 104, 2, 0.4]].forEach(([x, y, r, o], i) => { ctx.globalAlpha = o * tr * (still ? 1 : 0.6 + 0.4 * Math.sin(t * 5 + i)); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }); ctx.globalAlpha = 1;
        const b = new Path2D(); b.moveTo(84, 132); b.bezierCurveTo(84, 84, 100, 62, 124, 62); b.bezierCurveTo(148, 62, 164, 84, 164, 132); b.lineTo(164, 150); hem(b, 164, 84, 150, 4, 3); b.closePath();
        ctx.fillStyle = '#f6f4fb'; ctx.fill(b); ctx.strokeStyle = 'rgba(140,120,180,0.45)'; ctx.lineWidth = 1.5; ctx.stroke(b);
        fp('M84 132 C84 100 92 78 106 68 C96 86 94 110 96 152 C92 158 86 152 84 140 Z', '#e3ddf0');
        around(162, 114, talk && !still ? 0.4 * Math.sin(t * 8) : 0, () => { fp('M162 112 C174 104 183 110 177 118 C173 122 167 122 162 119 Z', '#f6f4fb'); sk('M162 112 C174 104 183 110 177 118 C173 122 167 122 162 119 Z', 'rgba(140,120,180,0.45)', 1.5); });
        ov(134, 100, 6, 9, '#1a1024'); ov(154, 100, 5, 8, '#1a1024'); ov(136, 96, 1.8, 1.8, '#ffffff'); ov(156, 96, 1.5, 1.5, '#ffffff');
        const m = talk && !still ? 0.55 + 0.45 * Math.abs(Math.sin(t * 7)) : 1; // "pöö"
        ov(146, 123, 6 * (0.8 + 0.2 * m), 8 * m, '#1a1024'); ov(146, 127 - 4 * (1 - m), 3.5, 3 * m, '#e0607a');
        ctx.globalAlpha = 0.5; ov(124, 114, 4.5, 4.5, '#f3a6c0'); ctx.globalAlpha = 1;
        // Kurpitsahattu hyppää puhuessa
        ctx.save(); ctx.translate(0, talk && !still ? -6 * Math.abs(Math.sin(t * 8)) : 0); around(124, 62, -0.24, () => {
          ov(124, 56, 19, 13, '#f08a24'); ctx.strokeStyle = '#c96a12'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(124, 56, 9, 13, 0, 0, Math.PI * 2); ctx.stroke(); sk('M124 43 L124 69', '#c96a12', 1.2);
          sk('M123 44 Q124 36 130 34', '#4f7a2a', 4); fp('M128 38 Q136 32 140 40 Q132 42 128 38 Z', '#6a9a3a');
        }); ctx.restore();
      } else if (kind === 'lyhty') {
        // Lyhty lepattaa ja kirkastuu puhuessa
        const fk = still ? 0 : 0.08 * (Math.sin(t * 13) + Math.sin(t * 7.3)), gr = 64 + 20 * talk;
        const g = ctx.createRadialGradient(188, 144, 0, 188, 144, gr); g.addColorStop(0, `rgba(255,200,90,${Math.min(1, 0.75 * (1 + fk) * (0.8 + 0.4 * talk))})`); g.addColorStop(1, 'rgba(255,140,40,0)');
        ctx.fillStyle = g; ctx.fillRect(188 - gr, 144 - gr, gr * 2, gr * 2);
        ctx.fillStyle = '#ffb347'; [[64, 150, 3, 0.8], [48, 132, 2.2, 0.6], [36, 152, 1.8, 0.5], [58, 116, 1.6, 0.4]].forEach(([x, y, r, o], i) => { const up = still ? 0 : (t * 14 + i * 7) % 20; ctx.globalAlpha = o * tr * (1 - up / 20); ctx.beginPath(); ctx.arc(x, y - up, r, 0, Math.PI * 2); ctx.fill(); }); ctx.globalAlpha = 1;
        const b = new Path2D(); b.moveTo(92, 162); b.bezierCurveTo(88, 122, 92, 84, 110, 64); b.bezierCurveTo(120, 52, 136, 50, 146, 60); b.bezierCurveTo(162, 76, 166, 114, 164, 162); hem(b, 164, 92, 164, 4, 3); b.closePath();
        ctx.fillStyle = '#d8d2ea'; ctx.fill(b); ctx.strokeStyle = 'rgba(150,130,190,0.5)'; ctx.lineWidth = 1.5; ctx.stroke(b);
        fp('M92 162 C88 124 94 88 110 66 C102 90 100 124 104 170 C98 174 94 168 92 162 Z', '#c3bbdc');
        fp('M118 72 C126 60 146 62 152 78 C156 92 150 108 138 112 C124 114 114 100 118 72 Z', '#241634');
        for (const [x, rx] of [[134, 4.5], [148, 4]]) { ctx.globalAlpha = 0.22 * (1 + fk); ov(x, 88, 9, 9, '#ffd75e'); ctx.globalAlpha = 1; ov(x, 88, rx, 3, '#ffd75e'); }
        fp('M146 110 C162 114 172 122 178 132 C172 137 164 133 156 127 Z', '#cfc8e2');
        ov(188, 148, 21, 17, '#f08a24'); ctx.strokeStyle = '#c96a12'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(188, 148, 10, 17, 0, 0, Math.PI * 2); ctx.stroke();
        sk('M187 131 Q188 125 193 123', '#4f7a2a', 3.5);
        const face = `rgba(255,226,122,${Math.min(1, 0.85 + fk + 0.15 * talk)})`;
        fp('M177 144 L183 137 L187 145 Z M190 145 L194 137 L200 144 Z', face); fp('M176 153 L180 150 L184 154 L188 150 L192 154 L196 150 L200 153 L195 160 L181 160 Z', face);
      } else {
        // Usva: häntä kiemurtelee kuin usva, ja puhuessa se hehkuu sisältä ja häntä kiertyy enemmän
        [[64, 170, 30, 6, 0.13], [32, 152, 22, 5, 0.1], [100, 178, 24, 5, 0.1]].forEach(([x, y, rx, ry, o], i) => { ctx.globalAlpha = tr; ov(x + (still ? 0 : Math.sin(t * 0.8 + i) * 6), y, rx, ry, `rgba(230,225,250,${o})`); }); ctx.globalAlpha = 1;
        const A = (still ? 0 : 1) * (1 + 0.5 * talk), wv = (k) => Math.sin(t * 2 + k * 0.8) * A;
        const b = new Path2D(); b.moveTo(120, 74); b.bezierCurveTo(124, 52, 156, 48, 168, 66); b.bezierCurveTo(180, 86, 172, 114, 152, 128);
        b.bezierCurveTo(130, 142, 106, 138 + 2 * wv(0), 86, 148 + 2 * wv(0)); b.bezierCurveTo(68, 157 + 4 * wv(1), 52, 152 + 6 * wv(2), 38, 140 + 8 * wv(3));
        b.bezierCurveTo(58, 144 + 6 * wv(2), 74, 136 + 4 * wv(1), 88, 122); b.bezierCurveTo(102, 108, 112, 94, 120, 74); b.closePath();
        const g = ctx.createLinearGradient(170, 70, 40, 140); g.addColorStop(0, 'rgba(242,238,250,0.95)'); g.addColorStop(0.55, 'rgba(222,212,246,0.72)'); g.addColorStop(1, 'rgba(200,190,240,0)');
        ctx.fillStyle = g; ctx.fill(b);
        ov(156, 82, 24, 24, `rgba(255,255,255,${0.12 + (still ? 0 : 0.16 * talk * (0.5 + 0.5 * Math.sin(t * 4)))})`);
        sk('M150 114 C162 118 172 114 178 106', 'rgba(242,238,250,0.75)', 4);
        sk('M146 78 Q150 74 154 78 M160 78 Q164 74 168 78', '#2a1b3a', 2.4);
        sk(talk && !still && Math.sin(t * 7) > 0 ? 'M153 91 Q157 96 161 91' : 'M153 92 Q157 94 161 92', '#2a1b3a', 2);
      }
      ctx.restore();
    };
    // Kangas rajataan matojen ympärille; koko vaihtuu vain, kun madot eivät enää mahdu tai tilaa on reilusti liikaa.
    const fit = () => {
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const w of worms) for (const [x, y] of w.segs) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      x0 -= 60; y0 -= 70; x1 += 60; y1 += 60;
      const nw = x1 - x0, nh = y1 - y0;
      if (nw > box.w || nh > box.h || nw < box.w - 320 || nh < box.h - 320) {
        box.w = Math.ceil(Math.max(nw, 360) + 80); box.h = Math.ceil(Math.max(nh, 300) + 80);
        cv.width = Math.round(box.w * dpr); cv.height = Math.round(box.h * dpr); cv.style.width = box.w + 'px'; cv.style.height = box.h + 'px';
      }
      box.x = Math.round((x0 + x1 - box.w) / 2); box.y = Math.round((y0 + y1 - box.h) / 2);
      cv.style.transform = `translate(${box.x}px, ${box.y}px)`;
    };
    const draw = (now) => {
      const P = pal(), lite = theme.current() === 'light', t = reduced() ? 0 : now / 1000;
      fit(); ctx.setTransform(dpr, 0, 0, dpr, -box.x * dpr, -box.y * dpr); ctx.clearRect(box.x, box.y, box.w, box.h);
      const cast = theme.cast();
      for (const w of worms) if (cast === 'birds') drawBird(w, t, P[w.who]); else if (cast === 'elves') drawElf(w, t, P[w.who]); else if (cast === 'ghosts') drawGhost(w, t, P[w.who]); else drawWorm(w, t, P[w.who], lite);
      // Uuden kohteen huomaaminen: jokaisen madon pään yllä ponnahtaa vuorollaan "!"
      for (const w of worms) {
        const tn = now - st.notice - w.i * 110; if (tn < 0 || tn > 900) continue;
        const k = Math.min(1, tn / 180) - 1, s = 1 + 2.7 * k ** 3 + 1.7 * k ** 2, [hx, hy] = w.segs[0], y = hy - (cast === 'elves' ? 36 : cast === 'ghosts' ? 30 : 24) * S - w.hop - 14 * S * w.lift;
        ctx.globalAlpha = tn > 700 ? 1 - (tn - 700) / 200 : 1;
        dot(hx, y, 8 * S * s, rgba(P[w.who], 0.95));
        ctx.fillStyle = lite ? '#fff' : '#0b1020'; ctx.font = `700 ${Math.max(1, Math.round(12 * S * s))}px system-ui, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('!', hx, y + 0.5); ctx.globalAlpha = 1;
      }
    };
    // Ajatuskupla: pilvi ja kaksi pientä ajatuspalloa, jotka osoittavat puhujan päähän
    const placeBubble = () => {
      if (!st.line) return;
      const w = worms[WHO.indexOf(st.line.who)], R = st.ring, top = topbar.offsetHeight + 8; if (bubble.hidden) bubble.hidden = false;
      const bw = bubble.offsetWidth, bh = bubble.offsetHeight, x = Math.max(8, Math.min(W - bw - 8, w.x - bw / 2));
      // Kupla laatikon ulkopuolelle: yläpuoliskon madolle yläpuolelle, alapuoliskon alapuolelle. Puoli pysyy saman repliikin ajan.
      if (st.line.below == null) st.line.below = !!R && w.y > (R.y0 + R.y1) / 2;
      const off = st.welcome ? 26 : 40, head = w.y - 14 * S * w.lift; let below = st.line.below, y = below ? w.y + off : head - bh - off;
      if (!below && y < top) { below = true; y = w.y + off; } else if (below && y + bh > H - 8) { below = false; y = head - bh - off; }
      bubble.style.transform = `translate(${Math.round(x)}px, ${Math.round(Math.max(top, y))}px)`;
      bubble.style.setProperty('--ax', Math.round(Math.max(18, Math.min(bw - 18, w.x - x))) + 'px'); bubble.classList.toggle('below', below);
    };
    const resize = () => {
      W = document.documentElement.clientWidth; H = document.documentElement.clientHeight; dpr = Math.min(devicePixelRatio || 1, 2); S = W < 600 ? 1 : 1.25; box.w = box.h = 0;
      // Madot aloittavat valmiiksi rivissä hero-kortin yläpuolella vartalot vasemmalle, joten esittely alkaa heti
      if (!worms[0].segs.length) for (const [i, [x, y]] of stage().entries()) { const w = worms[i]; w.x = x; w.y = y; w.segs = Array.from({ length: w.f.n }, (_, k) => [x - k * w.f.gap * S, y + Math.sin(k * 0.9) * 2]); }
    };
    const tick = (now) => {
      requestAnimationFrame(tick);
      const dt = Math.min(0.1, (now - (last || now)) / 1000); last = now; // hitaalla laitteella madot etenevät isommin askelin
      if (st.hidden) { if (!blank) { cv.hidden = true; bubble.hidden = true; blank = true; } return; }
      if (blank) { cv.hidden = false; blank = false; }
      const vh = innerHeight; let best = null, bestA = 0;
      // Huomion voi saada vain kohta, joka näkyy tai on osoittimen lähellä (I > 0); näkymättömän A vain vaimenee.
      for (const e of $$('[data-attn]')) {
        const I = intensity(e, vh), A0 = AV.get(e) || 0, A = A0 + (I - A0) * (1 - Math.exp(-dt / (I > A0 ? TH.tauUp : TH.tauDown)));
        AV.set(e, A); e._I = I; if (I > 0 && (!best || A > bestA)) { best = e; bestA = A; }
      }
      const f = st.focusEl;
      if (st.welcome) {
        // Esittely ja tervetulotoivotus rivissä hero-kortin yläpuolella, kunnes repliikit loppuvat tai kortti vierii pois näkyvistä
        const r = hero.getBoundingClientRect();
        if (r.bottom < topbar.offsetHeight + 60 || r.top > vh - 60) { endWelcome(); release(); }
        else if (f !== hero) { engage(hero, now); st.focus = 'welcome'; }
      }
      if (!st.welcome) {
        // Kohta katosi tai poistui näkyvistä: huomio on siirtynyt, joten ajatus poistuu heti.
        if (f && (!document.contains(f) || (AV.get(f) || 0) < TH.release || f._I === 0)) release();
        // Uusi kohde otetaan vasta, kun se on pysynyt parhaana hetken, joten madot eivät lähde jokaisen ohi vieritetyn kortin perään
        const cur = st.focusEl, want = best && best !== cur && bestA >= TH.engage && (!cur || bestA > (AV.get(cur) || 0) + TH.hyst) ? best : null;
        if (want !== st.cand) { st.cand = want; st.candSince = now; }
        if (want && now - st.candSince >= TH.dwell * (st.mode === 'pointer' ? 1 : 1.6)) engage(want, now);
      }
      move(dt, now, goals(now));
      if (now - st.notice < TH.notice) st.arrived = false;
      if (st.ring && !st.orbit && now - st.notice >= TH.notice) { const [x, y] = at(st.ring, st.u); st.orbit = Math.hypot(worms[0].x - x, worms[0].y - y) < TH.arrive; }
      const h = worms[0];
      if (!trail.length || Math.hypot(h.x - trail[0][0], h.y - trail[0][1]) > 3) { trail.unshift([h.x, h.y]); if (trail.length > 160) trail.pop(); }
      if (st.arrived && st.orbit && st.ring && !reduced()) st.u += dt * (st.line ? RING.vTalk : RING.v) * S / st.ring.L;
      const g = st.focusEl;
      if (g) {
        if (st.welcome || (AV.get(g) || 0) >= TH.speak) { if (!st.aboveSince) st.aboveSince = now; } else st.aboveSince = 0;
        // Keskustelu alkaa vasta, kun madot ovat perillä.
        if (!st.speaking && !st.spoken && st.arrived && (st.orbit || st.welcome) && st.aboveSince && now - st.aboveSince >= TH.hold) { st.speaking = true; st.spoken = true; say(0); }
      }
      draw(now); placeBubble();
    };
    const label = () => { const b = SUF[theme.cast()]; $('.lbl', toggle).textContent = st.hidden ? T['show' + b] : T['hide' + b]; };
    const setHidden = (h) => {
      st.hidden = h; toggle.setAttribute('aria-pressed', String(h)); label();
      store.set('infinite-crew', h ? 'off' : 'on'); if (h) { endWelcome(); release(); }
    };
    toggle.addEventListener('click', () => setHidden(!st.hidden));
    document.addEventListener('pf:theme', label);
    $('#log-btn').addEventListener('click', (e) => {
      const list = $('#log-list'); list.replaceChildren();
      if (!st.log.length) list.append(el('li', { class: 'muted', text: T.logEmpty }));
      for (const x of st.log) list.append(el('li', {}, el('time', { datetime: x.time.toISOString(), text: x.time.toLocaleTimeString(L === 'fi' ? 'fi-FI' : 'en-GB') }), ' · ',
        el('span', { class: 'muted', text: D.points[x.point].label }), ' · ', el('strong', { class: 'who-' + x.who, text: pname(x.who) }), ' · ' + x.text));
      openDialog($('#log-dialog'), e.currentTarget);
    });
    addEventListener('resize', resize);
    resize(); renderLine(); setHidden(st.hidden); requestAnimationFrame(tick);
    return { thresholds: TH, setHidden, get hidden() { return st.hidden; }, get focus() { return st.focus; }, get speaking() { return st.speaking; },
      get line() { return st.line && { ...st.line }; }, get log() { return st.log.map((x) => ({ ...x, time: x.time.toISOString() })); },
      get arrived() { return st.arrived; }, get mode() { return st.mode; }, get welcome() { return st.welcome; }, get kind() { return theme.cast(); },
      get ring() { if (!st.ring) return null; const { el: _, ...r } = st.ring; return r; }, get noticed() { return st.notice; }, get u() { return st.u; },
      get bugs() { return worms.map((w) => ({ who: w.who, x: Math.round(w.x), y: Math.round(w.y), segs: w.segs.length, lift: +w.lift.toFixed(2) })); },
      get points() { return $$('[data-attn]').map((e) => ({ id: e.dataset.attn, A: +(AV.get(e) || 0).toFixed(3) })); } };
  })();

  /* ---------- Kysy: vastaukset kootaan sivun datasta selaimessa ---------- */
  const ask = (() => {
    const dlg = $('#ask-dialog'), logEl = $('#ask-log'), form = $('#ask-form'), input = $('#ask-q');
    const fill = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k]);
    const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const names = (ps) => ps.map((p) => p.name).join(', ');
    const byScore = (ps) => ps.slice().sort((a, b) => b.score - a.score);
    const P = D.projects, pct = (v) => (L === 'fi' ? String(v).replace('.', ',') : String(v));
    // Tagien hakusanat (vartalot ilman ääkkösiä, koska kysymys normalisoidaan)
    const SYN = { 'p-peli': ['peli', 'pele', 'game', 'simul', 'roguel'], 't-3d': ['3d', 'three'], 't-mob': ['mobiil', 'mobile', 'puhelin', 'kannyk'],
      't-test': ['testi', 'testa', 'test', 'playwright', 'vitest'], 't-py': ['python'], 't-react': ['react'], 't-svelte': ['svelte'], 't-ts': ['typescript'],
      't-back': ['backend', 'palvelin', 'server', 'tausta'], 'a-claude': ['claude', 'anthropic'], 'a-ds': ['deepseek'],
      'p-hyv': ['terve', 'hyvinvoi', 'health', 'wellbeing', 'terapia', 'therap'], 'p-data': ['data', 'analyy', 'analys', 'tilast'], 'p-yht': ['yhteiso', 'communit'],
      'p-opp': ['opetus', 'opett', 'koulu', 'learn', 'teach', 'educat', 'school'], 'p-yhk': ['yhteiskun', 'society', 'politi', 'hallitu'],
      'p-taide': ['taide', 'taitee', 'music', 'musiik', 'aani', 'sound'], 'p-tyo': ['tyokalu', 'tool', 'kirjasto', 'library'], 'a-prod': ['chat', 'tekoalyomin', 'ai feature'] };
    const tagLines = (tag) => {
      const ps = byScore(P.filter((p) => p.tags.includes(tag))), lab = D.tags.find((t) => t.id === tag).label;
      return [{ who: 'loiste', text: fill(T.askTag, { tag: lab, n: ps.length }), ps: ps.map((p) => p.id) },
        { who: 'hionta', text: fill(T.askTagMore, { list: names(ps.slice(0, 5)) }) }];
    };
    const projectLines = (p) => [{ who: 'loiste', text: `${p.name}: ${p.one}`, ps: [p.id] }, { who: 'hionta', text: p.an.tech }, { who: 'kirkkaus', text: p.an.philo }, { who: 'loiste', text: p.an.fun }];
    const answer = (q) => {
      const s = norm(q), toks = s.split(/[^a-z0-9]+/).filter(Boolean), has = (re) => re.test(s), pre = (stems) => toks.some((w) => stems.some((x) => w.startsWith(x)));
      const named = P.filter((p) => s.includes(norm(p.name)) || s.includes(p.id)).sort((a, b) => b.name.length - a.name.length)[0];
      if (named) return projectLines(named);
      if (has(/\bkuka\b|\bwho\b|taiteilija|artist|kuka on|about/)) return [
        { who: 'loiste', text: fill(T.askWho, { n: P.length }) }, { who: 'hionta', text: fill(T.askWho2, { a: P.filter((p) => p.agent).length }) }, { who: 'kirkkaus', text: T.askWho3 }];
      if (has(/yhtey|contact|reach|email|gmail|whatsapp|sahkopost|puhelinnum|phone number|soita|\bcall\b|palkkaa|hire|tilaa|yhteisty/)) return D.contact.m || D.contact.w
        ? [{ who: 'loiste', text: T.askContactForm }, { who: 'kirkkaus', text: T.askContact }] : [{ who: 'loiste', text: T.askContact }, { who: 'kirkkaus', text: T.askContact2 }];
      if (has(/paras|parha|\btop|suosik|\bbest|favou/)) { const tp = P.filter((p) => p.top).sort((a, b) => a.top - b.top);
        return [{ who: 'loiste', text: fill(T.askTop, { list: names(tp) }), ps: tp.map((p) => p.id) }, { who: 'kirkkaus', text: fill(T.askTopCrit, { best: byScore(P)[0].name }) }]; }
      if (has(/uusin|uusimm|viimeisin|tuorein|latest|newest|recent/)) { const nl = P.slice().sort((a, b) => b.last.localeCompare(a.last))[0], ns = P.slice().sort((a, b) => b.start.localeCompare(a.start)).slice(0, 3);
        return [{ who: 'loiste', text: fill(T.askNewest, { name: nl.name, date: fdate(nl.last) }), ps: [nl.id] }, { who: 'hionta', text: fill(T.askNewest2, { list: names(ns) }), ps: ns.map((p) => p.id) }]; }
      if (has(/vanhin|ensimmai|oldest|earliest|first project/)) { const o = P.slice().sort((a, b) => a.start.localeCompare(b.start))[0];
        return [{ who: 'loiste', text: fill(T.askOldest, { name: o.name, date: fdate(o.start) }), ps: [o.id] }]; }
      if (has(/mall[ei]|model|\bllm/) && !pre(['claude', 'deepseek'])) { const ms = D.story.lanes.filter((x) => x.group === 'model');
        return [{ who: 'hionta', text: fill(T.askModels, { n: ms.length, list: ms.map((x) => x.label).join(', ') }) }, { who: 'kirkkaus', text: T.askModelsCrit }]; }
      if (has(/montako|kuinka monta|how many|lukumaar|\bmaara/)) return [{ who: 'hionta', text: fill(T.askCount, { n: P.length, c: nf(P.reduce((a, p) => a + p.commits, 0)) }) }];
      if (has(/kiel[ie]|language|stack|teknolog/)) { const [t0, ...rest] = D.langs;
        return [{ who: 'hionta', text: fill(T.askLangs, { top: t0.name, pct: pct(t0.pct), list: rest.map((x) => `${x.name} ${pct(x.pct)} %`).join(', ') }) }]; }
      const tags = Object.keys(SYN).filter((k) => pre(SYN[k]));
      if (tags.length) return tags.slice(0, 2).flatMap(tagLines);
      // Viimeinen keino: sanahaku projektien teksteistä
      const words = toks.filter((w) => w.length >= 4), hits = words.length ? P.map((p) => {
        const txt = norm([p.name, p.one, p.review, p.an.tech, p.an.philo, p.an.fun].join(' ')); return { p, n: words.filter((w) => txt.includes(w)).length };
      }).filter((x) => x.n > 0).sort((a, b) => b.n - a.n || b.p.score - a.p.score).slice(0, 3) : [];
      if (hits.length) return [{ who: 'hionta', text: fill(T.askMatches, { list: names(hits.map((x) => x.p)) }), ps: hits.map((x) => x.p.id) }];
      return [{ who: 'kirkkaus', text: T.askNone, sugg: true }];
    };
    const msg = (who, text, ps) => {
      const li = el('li', { class: 'ask-msg ' + (who === 'you' ? 'you' : 'by-' + who) },
        el('strong', { class: who === 'you' ? null : 'who-' + who, text: who === 'you' ? T.askYou : pname(who) }), el('p', { text }),
        ps && ps.length ? el('div', { class: 'chip-row' }, ps.slice(0, 8).map((id) => el('button', { type: 'button', class: 'chip sm', 'data-project': id, 'aria-haspopup': 'dialog' }, PBY[id].name))) : null);
      logEl.append(li); li.scrollIntoView({ block: 'nearest' });
    };
    const submit = (q) => {
      msg('you', q);
      for (const a of answer(q)) msg(a.who, a.text, a.ps);
      if (logEl.lastChild.classList.contains('by-kirkkaus') && logEl.lastChild.textContent.includes(T.askNone)) $('#ask-sugg').scrollIntoView({ block: 'nearest' });
    };
    form.addEventListener('submit', (e) => { e.preventDefault(); const q = input.value.trim(); if (q) { submit(q); input.value = ''; } });
    for (const b of $$('#ask-sugg [data-q]')) b.addEventListener('click', () => submit(b.dataset.q));
    $('#ask-btn').addEventListener('click', (e) => { openDialog(dlg, e.currentTarget); input.focus(); });
    return { answer: (q) => answer(q).map(({ who, text, ps }) => ({ who, text, ps: ps || [] })), submit, open() { $('#ask-btn').click(); }, get isOpen() { return dlg.open; } };
  })();

  /* ---------- Osioiden siirtymä: osio nousee esiin kerran, kun se tulee näkyviin (tyylit .rv ja .in) ---------- */
  const reveal = (() => {
    const secs = $$('.sections > section');
    if (!reduced()) {
      document.documentElement.classList.add('rv');
      const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }, { rootMargin: '0px 0px -15% 0px' });
      for (const s of secs) io.observe(s);
    }
    return { get shown() { return secs.filter((s) => !document.documentElement.classList.contains('rv') || s.classList.contains('in')).map((s) => s.id); } };
  })();

  /* ---------- Osioiden maisemat: canvas-meteorit ja virtauskenttä (CSS- ja SVG-maisemat ovat tyylitiedostossa) ---------- */
  const scapes = (() => {
    const runs = new Map();
    const io = new IntersectionObserver((es) => { for (const e of es) { e.target.classList.toggle('on', e.isIntersecting); const s = runs.get(e.target); if (s) { s.visible = e.isIntersecting; s.kick(); } } });
    for (const s of $$('.scape')) io.observe(s);
    const canvasScape = (cv, init, step) => {
      const ctx = cv.getContext('2d'), s = { visible: false, running: false, frames: 0, w: 0, h: 0, data: null };
      let raf = 0, last = 0;
      const size = () => {
        const dpr = Math.min(devicePixelRatio || 1, 1.5); s.w = cv.clientWidth; s.h = cv.clientHeight; if (!s.w || !s.h) return;
        cv.width = Math.round(s.w * dpr); cv.height = Math.round(s.h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        s.data = init(s); step(ctx, s, 0, 0, true);
      };
      const frame = (now) => { if (!s.running) return; const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now; step(ctx, s, dt, now / 1000, false); s.frames++; raf = requestAnimationFrame(frame); };
      s.kick = () => { const run = s.visible && !reduced() && !document.hidden && !!s.data; if (run && !s.running) { s.running = true; last = 0; raf = requestAnimationFrame(frame); } if (!run && s.running) { s.running = false; cancelAnimationFrame(raf); } };
      new ResizeObserver(size).observe(cv); document.addEventListener('pf:theme', size); runs.set(cv, s);
      return s;
    };
    const rnd = mulberry(7);
    // Joulun reki ja Kekrin lepakot ja lehdet: muodot ovat design-taulun SVG-polkuja
    const SLEIGH = { body: new Path2D('M0 0 L34 0 Q40 0 40 -6 L40 -16 L30 -16 L26 -8 L6 -8 Z'), runner: new Path2D('M-4 4 L40 4 Q48 4 48 -2'), antler: new Path2D('M0 -3 l-3 -7 m3 7 l3 -7 m-5 3 l-3 -2') };
    const BAT = new Path2D('M0 -2 C-4 -9 -14 -12 -26 -7 C-22 -3 -21 1 -22 5 C-17 2 -13 3 -10 7 C-8 3 -5 2 -2 4 Z M0 -2 C4 -9 14 -12 26 -7 C22 -3 21 1 22 5 C17 2 13 3 10 7 C8 3 5 2 2 4 Z M-3.4 0 A3.4 5 0 1 0 3.4 0 A3.4 5 0 1 0 -3.4 0 Z');
    const LEAF = new Path2D('M0 -9 C6 -5 7 3 0 9 C-7 3 -6 -5 0 -9 Z');
    const LEAFC = ['#e0782a', '#c2501f', '#f2a541', '#8a3b1a'];
    const drawSleigh = (ctx, x, y, t) => {
      ctx.save(); ctx.translate(x, y); ctx.lineCap = 'round';
      for (let k = 1; k <= 10; k++) { ctx.fillStyle = rgba([243, 207, 99], 0.75 - k * 0.07); ctx.beginPath(); ctx.arc(-k * 10, 2 + Math.sin(t * 3 + k) * 3, 1.6 + (k % 3) * 0.6, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = '#c8312b'; ctx.fill(SLEIGH.body); ctx.strokeStyle = '#f0c44c'; ctx.lineWidth = 2; ctx.stroke(SLEIGH.runner);
      ctx.fillStyle = '#8a5a36'; ctx.beginPath(); ctx.ellipse(12, -14, 9, 7, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#f0c44c'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(40, -12); ctx.lineTo(70, -10); ctx.stroke();
      for (const dx of [70, 96]) {
        const lg = Math.sin(t * 10 + dx) * 3;
        ctx.fillStyle = '#8a5a36'; ctx.beginPath(); ctx.ellipse(dx + 8, -10, 11, 5, 0, 0, Math.PI * 2); ctx.arc(dx + 19, -14, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#8a5a36'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(dx + 2, -8); ctx.lineTo(dx - lg, 0); ctx.moveTo(dx + 14, -8); ctx.lineTo(dx + 17 + lg, 0); ctx.stroke();
        ctx.save(); ctx.translate(dx + 18, -14); ctx.strokeStyle = '#d8c3a0'; ctx.lineWidth = 1.3; ctx.stroke(SLEIGH.antler); ctx.restore();
      }
      ctx.restore();
    };
    const drawPumpkin = (ctx, x, y, r, t) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3); g.addColorStop(0, 'rgba(255,190,80,0.55)'); g.addColorStop(1, 'rgba(255,140,40,0)');
      ctx.fillStyle = g; ctx.fillRect(x - r * 3, y - r * 3, r * 6, r * 6);
      ctx.fillStyle = '#ef8a26'; ctx.beginPath(); ctx.ellipse(x, y, r * 1.25, r, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = rgba([255, 224, 122], 0.8 + 0.2 * Math.sin(t * 11 + x));
      ctx.beginPath(); ctx.moveTo(x - r * 0.7, y - r * 0.2); ctx.lineTo(x - r * 0.4, y - r * 0.6); ctx.lineTo(x - r * 0.15, y - r * 0.15); ctx.moveTo(x + r * 0.15, y - r * 0.15); ctx.lineTo(x + r * 0.4, y - r * 0.6); ctx.lineTo(x + r * 0.7, y - r * 0.2); ctx.fill();
      ctx.fillRect(x - r * 0.6, y + r * 0.15, r * 1.2, r * 0.3);
    };
    // Tarina: meteoriparvi jääplaneetan kaaren yllä. Joulussa taivaalla liitää reki, Kekrissä lepakot ja lehdet.
    const meteor = canvasScape($('.scape-meteor'), (s) => ({ stars: Array.from({ length: 140 }, () => [rnd() * s.w, rnd() * s.h * 0.75, rnd() * 1.2 + 0.3, rnd() * 6]), m: [], sl: null,
      bats: Array.from({ length: 4 }, (_, i) => ({ x: rnd() * s.w, y: s.h * (0.12 + rnd() * 0.4), vx: (40 + rnd() * 40) * (i % 2 ? -1 : 1), ph: rnd() * 6, sc: 0.6 + rnd() * 0.5 })),
      leaves: Array.from({ length: 16 }, () => ({ x: rnd() * s.w, y: rnd() * s.h * 0.8, vy: 18 + rnd() * 22, ph: rnd() * 6, rot: rnd() * 6, vr: (rnd() - 0.5) * 2, c: LEAFC[Math.floor(rnd() * 4)], sc: 0.6 + rnd() * 0.6 })) }),
      (ctx, s, dt, t) => {
        const P = pal(), th = theme.current(), lite = th === 'light', xmas = th === 'christmas', kekri = th === 'kekri', d = s.data, R = s.w * 0.95, cx = s.w * 0.5, cy = s.h * 0.8 + R;
        ctx.clearRect(0, 0, s.w, s.h);
        for (const [x, y, r, ph] of d.stars) { ctx.fillStyle = rgba(lite ? P.hionta : P.text, (lite ? 0.35 : 0.55) * (0.6 + 0.4 * Math.sin(t * 1.3 + ph))); ctx.fillRect(x, y, r, r); }
        if (xmas) {
          if (!d.sl && dt && rnd() < dt / 9) d.sl = { x: -160, y: s.h * (0.16 + rnd() * 0.22), vx: 70 + rnd() * 30 };
          if (d.sl) { d.sl.x += d.sl.vx * dt; drawSleigh(ctx, d.sl.x, d.sl.y + Math.sin(t * 1.5) * 4, t); if (d.sl.x > s.w + 40) d.sl = null; }
        }
        if (kekri) {
          for (const L of d.leaves) {
            L.y += L.vy * dt; L.rot += L.vr * dt; if (L.y > s.h * 0.85) { L.y = -12; L.x = rnd() * s.w; }
            ctx.save(); ctx.translate(L.x + Math.sin(t * 1.2 + L.ph) * 14, L.y); ctx.rotate(L.rot); ctx.scale(L.sc, L.sc); ctx.fillStyle = L.c; ctx.fill(LEAF); ctx.restore();
          }
          for (const B of d.bats) {
            B.x += B.vx * dt; if (B.x < -40) B.x = s.w + 40; if (B.x > s.w + 40) B.x = -40;
            ctx.save(); ctx.translate(B.x, B.y + Math.sin(t * 2 + B.ph) * 8); ctx.scale(B.sc * Math.sign(B.vx), B.sc * (0.55 + 0.45 * Math.sin(t * 12 + B.ph)));
            ctx.fillStyle = '#12081a'; ctx.fill(BAT); ctx.strokeStyle = 'rgba(255,149,66,0.6)'; ctx.lineWidth = 1.2 / B.sc; ctx.stroke(BAT); ctx.restore();
          }
        }
        if (!xmas && !kekri && dt && rnd() < dt * 1.8) d.m.push({ x: s.w * (0.3 + rnd() * 0.8), y: -10, vx: -(380 + rnd() * 160), vy: 150 + rnd() * 110, life: 0 });
        for (const m of d.m) {
          m.x += m.vx * dt; m.y += m.vy * dt; m.life += dt;
          const g = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 0.12, m.y - m.vy * 0.12), c = m.life < 1.2 ? 1 : Math.max(0, 1 - (m.life - 1.2) * 3);
          g.addColorStop(0, rgba(lite ? P.hionta : [235, 245, 255], 0.9 * c)); g.addColorStop(1, rgba(P.hionta, 0));
          ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - m.vx * 0.12, m.y - m.vy * 0.12); ctx.stroke();
        }
        d.m = d.m.filter((m) => m.life < 1.6 && m.y < s.h);
        const g = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.04);
        // Talvessa ja Joulussa kaari on luminen kumpu, Kekrissä tumma kumpu, jonka reunaa kuu valaisee
        const snowy = th === 'winter' || xmas, rim = kekri ? [255, 149, 66] : P.hionta;
        g.addColorStop(0, rgba(lite ? [205, 222, 245] : snowy ? [92, 112, 138] : kekri ? [16, 8, 24] : [14, 24, 52], 1)); g.addColorStop(0.92, rgba(lite ? [225, 236, 252] : snowy ? [196, 212, 232] : kekri ? [34, 18, 46] : [30, 52, 104], 1)); g.addColorStop(1, rgba(rim, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 1.04, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = rgba(rim, lite ? 0.5 : kekri ? 0.6 : 0.8); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, R, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
        // Joulun mökkien ikkunat ja Kekrin kurpitsalyhdyt kummun laella
        for (const f of [-0.2, 0.06, 0.24]) {
          const x = cx + f * s.w, y = cy - Math.sqrt(Math.max(0, R * R - (x - cx) ** 2));
          if (xmas) { const w = ctx.createRadialGradient(x, y - 6, 0, x, y - 6, 16); w.addColorStop(0, 'rgba(255,198,100,0.8)'); w.addColorStop(1, 'rgba(255,170,70,0)'); ctx.fillStyle = w; ctx.fillRect(x - 16, y - 22, 32, 32); ctx.fillStyle = '#ffd27a'; ctx.fillRect(x - 3, y - 9, 6, 5); }
          if (kekri) drawPumpkin(ctx, x, y - 6, 5, t);
        }
      });
    // Teknologiat: virtauskenttä, jonka viivat jäävät haaleiksi jäljiksi
    const flow = canvasScape($('.scape-flow'), (s) => ({ p: Array.from({ length: 240 }, (_, i) => ({ x: rnd() * s.w, y: rnd() * s.h, life: rnd() * 6, c: i % 3 })), seeded: false }),
      (ctx, s, dt, t, first) => {
        // Joulussa jäljet ovat punaisia, vihreitä ja kultaisia nauhoja. Kekrissä ne nousevat höyrynä, osa padasta.
        const P = pal(), th = theme.current(), lite = th === 'light', kekri = th === 'kekri', d = s.data;
        const cols = th === 'christmas' ? [P.loiste, P.hionta, P.accent] : kekri ? [P.loiste, P.accent, P.kirkkaus] : [P.hionta, P.kirkkaus, P.accent];
        const pot = { x: s.w * 0.84, y: s.h * 0.32, r: Math.min(46, s.w * 0.08) };
        const field = (x, y, tt) => 1.6 * Math.sin(0.006 * x + 0.15 * tt) + 1.6 * Math.cos(0.009 * y - 0.11 * tt) + 1.2 * Math.sin(0.003 * (x + y));
        const advance = (h, tt) => {
          ctx.save(); ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.fillRect(0, 0, s.w, s.h); ctx.restore();
          ctx.save(); if (!lite) ctx.globalCompositeOperation = 'lighter'; ctx.lineWidth = 1.1;
          for (const q of d.p) {
            let a = field(q.x, q.y, tt); if (kekri) a = -Math.PI / 2 + 0.85 * Math.sin(a);
            const nx = q.x + Math.cos(a) * 42 * h, ny = q.y + Math.sin(a) * 42 * h;
            ctx.strokeStyle = rgba(cols[q.c], lite ? 0.35 : 0.45); ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(nx, ny); ctx.stroke();
            q.x = nx; q.y = ny; q.life -= h;
            if (q.life < 0 || q.x < -5 || q.x > s.w + 5 || q.y < -5 || q.y > s.h + 5) {
              if (kekri && rnd() < 0.35) { q.x = pot.x + (rnd() - 0.5) * pot.r * 1.4; q.y = pot.y - pot.r * 0.1; } else { q.x = rnd() * s.w; q.y = rnd() * s.h; }
              q.life = 3 + rnd() * 5;
            }
          }
          ctx.restore();
        };
        const drawPot = () => {
          const { x, y, r } = pot;
          ctx.fillStyle = '#07040b'; ctx.beginPath(); ctx.moveTo(x - r, y); ctx.lineTo(x + r, y); ctx.bezierCurveTo(x + r * 1.1, y + r * 0.6, x + r * 0.55, y + r * 0.78, x, y + r * 0.78); ctx.bezierCurveTo(x - r * 0.55, y + r * 0.78, x - r * 1.1, y + r * 0.6, x - r, y); ctx.fill();
          ctx.fillStyle = '#1a1024'; ctx.fillRect(x - r * 1.15, y - r * 0.1, r * 2.3, r * 0.2);
          for (let k = 0; k < 3; k++) { const ph = (t * 0.6 + k / 3) % 1; ctx.fillStyle = rgba(P.loiste, 0.75 * (1 - ph)); ctx.beginPath(); ctx.arc(x + (k - 1) * r * 0.5, y - r * 0.2 - ph * r * 0.5, r * (0.08 + 0.05 * k), 0, Math.PI * 2); ctx.fill(); }
        };
        // Ensimmäinen kuva (ja reduced motion): ajetaan valmiiksi, jotta jäljet näkyvät heti
        if (first || !d.seeded) { ctx.clearRect(0, 0, s.w, s.h); for (let i = 0; i < 90; i++) advance(1 / 30, 20 + i / 30); d.seeded = true; }
        else advance(dt, t);
        if (kekri) drawPot();
      });
    mqReduce.addEventListener('change', () => { for (const s of runs.values()) s.kick(); });
    document.addEventListener('visibilitychange', () => { for (const s of runs.values()) s.kick(); });
    return { get meteor() { return { running: meteor.running, frames: meteor.frames }; }, get flow() { return { running: flow.running, frames: flow.frames }; },
      get on() { return $$('.scape.on').map((e) => e.classList[1]); } };
  })();

  /* ---------- Yhteydenotto: sähköposti tai WhatsApp valmiiksi täytetyllä viestillä ---------- */
  const contact = (() => {
    const form = $('#contact-form'), status = $('#cf-status'), msg = $('#cf-msg');
    const mail = D.contact.m ? atob(D.contact.m) : '', wa = D.contact.w ? atob(D.contact.w).replace(/\D/g, '') : '';
    const compose = () => {
      const fd = new FormData(form), reason = D.reasons.find((r) => r.id === fd.get('reason')) || D.reasons[0], project = String(fd.get('project') || ''), name = String(fd.get('name') || '').trim();
      const subject = `Infinite · ${reason.label}${project ? ' · ' + project : ''}`, body = [msg.value.trim(), name ? `\n– ${name}` : ''].join('').trim();
      return { subject, body, mailto: mail ? `mailto:${mail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` : '', wa: wa ? `https://wa.me/${wa}?text=${encodeURIComponent(subject + '\n\n' + body)}` : '' };
    };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!msg.value.trim()) { status.textContent = T.cNeedMsg; msg.focus(); return; }
      const c = compose(), via = e.submitter && e.submitter.dataset.via;
      if (via === 'mail' && c.mailto) location.href = c.mailto; else if (via === 'wa' && c.wa) window.open(c.wa, '_blank', 'noopener'); else return;
      status.textContent = T.cOpened;
    });
    for (const b of $$('[data-open-ask]')) b.addEventListener('click', () => $('#ask-btn').click());
    return { compose, get ready() { return { mail: !!mail, wa: !!wa }; } };
  })();

  /* ---------- Hiukkaskartta ---------- */
  const map = (() => {
    const dlg = $('#map-dialog'), cv = $('#map-canvas'), ctx = cv.getContext('2d'), btn = $('#map-btn'), secs = D.sections, K = secs.length, NP = 900;
    const st = { open: false, selected: 0, running: false, frames: 0, angle: 0.6, target: 0.6, goTo: null };
    const rnd = mulberry(7), R = 1.15, TILT = 0.5;
    const centers = secs.map((s, i) => (i === 0 ? [0, 0, 0] : [Math.cos((i - 1) / (K - 1) * Math.PI * 2) * R, 0, Math.sin((i - 1) / (K - 1) * Math.PI * 2) * R]));
    const langs = [47.9, 22.2, 21.7, 3.5, 2.9];
    const SHAPES = {
      etusivu: (u, v, w) => { const s = [u < 0.5 ? -1 : 1, v < 0.5 ? -1 : 1, w < 0.5 ? -1 : 1], a = rnd(), b = rnd() * (1 - a); return [s[0] * a, s[1] * (1 - a - b) * 1.3, s[2] * b]; },
      top5: (u) => { const t = u * 10, i = Math.floor(t), f = t - i, p = (k) => { const ang = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? 0.42 : 1; return [Math.cos(ang) * rr, Math.sin(ang) * rr]; }; const A = p(i), B = p(i + 1); return [A[0] + (B[0] - A[0]) * f, A[1] + (B[1] - A[1]) * f, (rnd() - 0.5) * 0.1]; },
      projektit: (u) => [-1 + 2 * u, Math.sin(u * Math.PI * 4) * 0.35, Math.cos(u * Math.PI * 4) * 0.35],
      teknologiat: (u, v) => { const b = Math.floor(u * 5), hgt = langs[b] / 47.9 * 1.8; return [-0.8 + b * 0.4 + (rnd() - 0.5) * 0.22, 0.9 - v * hgt, (rnd() - 0.5) * 0.1]; },
      yhteys: (u, v) => { const a = u * Math.PI * 2, b = v * Math.PI * 2; return [Math.cos(a) * (0.8 + 0.12 * Math.cos(b)), Math.sin(a) * (0.8 + 0.12 * Math.cos(b)), 0.12 * Math.sin(b)]; },
    };
    const parts = [];
    for (let i = 0; i < NP; i++) {
      const c = Math.min(K - 1, Math.floor(i / (NP / K))), ce = centers[c], rad = c === 0 ? 0.22 : 0.17;
      const u = rnd(), v = rnd(), w = rnd(), th = u * Math.PI * 2, ph = Math.acos(2 * v - 1), rr = rad * Math.cbrt(w);
      const home = [ce[0] + rr * Math.sin(ph) * Math.cos(th), ce[1] + rr * Math.cos(ph), ce[2] + rr * Math.sin(ph) * Math.sin(th)];
      // Muoto esikierretään rypään kohdekulmalla, jotta se on kameraan päin, kun rengas on kääntynyt
      const loc = SHAPES[secs[c].id](rnd(), rnd(), rnd()), sc = c === 0 ? 0.34 : 0.36, th0 = c === 0 ? 0 : (c - 1) / (K - 1) * Math.PI * 2 + Math.PI / 2;
      const lx = loc[0] * sc, ly = loc[1] * sc, lz = loc[2] * sc, co = Math.cos(th0), si = Math.sin(th0);
      const shape = [ce[0] + lx * co - lz * si, ce[1] + ly, ce[2] + lx * si + lz * co];
      parts.push({ c, home, shape, p: home.slice() });
    }
    const list = $$('#map-list [data-sec]');
    const info = () => {
      const s = secs[st.selected];
      $('#map-name').textContent = s.name; $('#map-text').textContent = s.summary; $('#map-status').textContent = s.status;
      list.forEach((b, i) => b.setAttribute('aria-pressed', String(i === st.selected)));
      cv.setAttribute('aria-label', `${T.mapCanvas}. ${s.name}: ${s.summary}`);
    };
    const select = (i, fromScroll) => {
      st.selected = ((i % K) + K) % K;
      if (st.selected > 0) { const a = (st.selected - 1) / (K - 1) * Math.PI * 2; st.target = a + Math.PI / 2; }
      info(); if (st.open && !st.running) frame(performance.now());
      return fromScroll;
    };
    const project = (q, S) => {
      const ca = Math.cos(st.angle), sa = Math.sin(st.angle), x = q[0] * ca + q[2] * sa, z1 = -q[0] * sa + q[2] * ca;
      const y = q[1] * Math.cos(TILT) - z1 * Math.sin(TILT), z = q[1] * Math.sin(TILT) + z1 * Math.cos(TILT), f = S.h * 0.62 / (z + 3.2);
      return [S.w / 2 + x * f * 1.65, S.h * 0.38 + y * f * 1.65, z, f];
    };
    let last = 0, raf = 0;
    const frame = (now) => {
      const dt = Math.min(0.1, (now - (last || now)) / 1000); last = now;
      const instant = reduced(), k = instant ? 1 : 1 - Math.exp(-dt / 0.25);
      if (st.selected === 0 && !instant) st.target += dt * 0.12;
      let da = ((st.target - st.angle + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI; st.angle += instant ? da : da * k;
      let moving = Math.abs(da) > 1e-3;
      for (const q of parts) { const t = q.c === st.selected ? q.shape : q.home; for (let j = 0; j < 3; j++) { const d = t[j] - q.p[j]; if (Math.abs(d) > 1e-4) moving = true; q.p[j] += d * k; } }
      const P = pal(), W = cv.width, Hh = cv.height, S = { w: W, h: Hh }, dpr = Math.min(devicePixelRatio || 1, 2);
      ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = rgba(P['map-bg'], 1); ctx.fillRect(0, 0, W, Hh);
      ctx.globalCompositeOperation = 'lighter';
      for (const q of parts) {
        const [x, y, z, f] = project(q.p, S), sel = q.c === st.selected, col = sel ? P.accent : q.c === 0 ? [236, 238, 244] : [150, 160, 200];
        const a = (sel ? 0.75 : 0.35) * Math.max(0.25, Math.min(1, 1.6 - z * 0.5)), s = Math.max(1, (sel ? 2.4 : 1.7) * dpr * f / 80);
        ctx.fillStyle = rgba(col, a.toFixed(3)); ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
      ctx.globalCompositeOperation = 'source-over'; ctx.textAlign = 'center';
      centers.forEach((c, i) => {
        const [x, y] = project([c[0], c[1] - (i === 0 ? 0.42 : 0.34), c[2]], S); const sel = i === st.selected;
        ctx.font = `${sel ? 600 : 400} ${(sel ? 14 : 12) * dpr}px "IBM Plex Sans", system-ui, sans-serif`;
        ctx.fillStyle = sel ? 'rgb(255,255,255)' : 'rgba(220,224,236,0.85)'; ctx.fillText(secs[i].name, x, y);
      });
      st.frames++;
      st.running = st.open && !document.hidden && (moving || (st.selected === 0 && !instant));
      if (st.running) raf = requestAnimationFrame(frame);
    };
    const resize = () => { const dpr = Math.min(devicePixelRatio || 1, 2); cv.width = Math.round(cv.clientWidth * dpr) || 600; cv.height = Math.round(cv.clientHeight * dpr) || 450; if (st.open) frame(performance.now()); };
    const go = () => { st.goTo = secs[st.selected].id; dlg.close(); };
    cv.addEventListener('keydown', (e) => {
      const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (d) { e.preventDefault(); select(st.selected + d); } else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
    cv.addEventListener('click', (e) => {
      const r = cv.getBoundingClientRect(), sx = (e.clientX - r.left) / r.width * cv.width, sy = (e.clientY - r.top) / r.height * cv.height, S = { w: cv.width, h: cv.height };
      let bi = -1, bd = Infinity; centers.forEach((c, i) => { const [x, y] = project(c, S), d = Math.hypot(x - sx, y - sy); if (d < bd) { bd = d; bi = i; } });
      if (bi >= 0 && bd < cv.width * 0.14) select(bi);
    });
    list.forEach((b, i) => b.addEventListener('click', () => select(i)));
    $('#map-go').addEventListener('click', go);
    btn.addEventListener('click', () => { st.goTo = null; openDialog(dlg, btn); st.open = true; resize(); last = 0; frame(performance.now()); cv.focus({ preventScroll: true }); });
    dlg.addEventListener('close', () => {
      st.open = false; st.running = false; cancelAnimationFrame(raf);
      if (st.goTo) {
        const sec = document.getElementById(st.goTo), hd = sec && sec.querySelector('h1, h2');
        if (sec) { sec.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' }); if (hd) hd.focus({ preventScroll: true }); }
      }
    });
    new ResizeObserver(resize).observe(cv);
    info();
    return { select, sync(id) { const i = secs.findIndex((s) => s.id === id); if (i >= 0 && i !== st.selected) select(i, true); },
      open() { btn.click(); }, close() { dlg.close(); }, get isOpen() { return dlg.open; }, get selected() { return st.selected; }, get sectionId() { return secs[st.selected].id; },
      get running() { return st.running; }, get frames() { return st.frames; }, particles: NP };
  })();

  /* ---------- Navigaatio: nykyinen osio päivittää palkin ja kartan ---------- */
  (() => {
    const links = Object.fromEntries($$('.nav a').map((a) => [a.getAttribute('href').slice(1), a]));
    let current = null;
    const set = (id) => { if (id === current) return; current = id; for (const [k, a] of Object.entries(links)) a.setAttribute('aria-current', String(k === id)); map.sync(id); };
    const obs = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) set(e.target.id); }, { rootMargin: '-45% 0px -50% 0px' });
    for (const s of D.sections) { const n = document.getElementById(s.id); if (n) obs.observe(n); }
  })();

  /* ---------- SEO-paneeli ---------- */
  const seo = (() => {
    const dlg = $('#seo-dialog'), tabs = $$('[role="tab"]', dlg), panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));
    const headings = () => {
      const hs = $$('h1, h2, h3, h4, h5, h6'); let prev = 0, jumps = 0; const list = [];
      for (const h of hs) { const lv = +h.tagName[1]; const jump = prev && lv > prev + 1; if (jump) jumps++; list.push({ level: lv, text: h.textContent.trim().replace(/\s+/g, ' '), jump }); prev = lv; }
      return { h1: hs.filter((h) => h.tagName === 'H1').length, jumps, list };
    };
    const renderHeadings = () => {
      const r = headings(), box = $('#heading-check'); box.replaceChildren(
        el('p', {}, `${T.h1Count}: `, el('strong', { class: 'ok', text: String(r.h1) }), ` · ${T.jumps}: `, el('strong', { class: 'ok', text: String(r.jumps) })),
        el('ol', { class: 'log-list' }, r.list.map((x) => el('li', { style: `margin-left:${(x.level - 1) * 14}px` }, el('span', { class: 'mono small muted', text: 'h' + x.level + ' ' }), x.text))));
    };
    const select = (i, focus) => {
      tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(i === j)); t.tabIndex = i === j ? 0 : -1; panels[j].hidden = i !== j; });
      if (focus) tabs[i].focus(); if (panels[i].id === 'seo-p-headings') renderHeadings();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', (e) => { const n = tabs.length, to = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key]; if (to !== undefined) { e.preventDefault(); select(to, true); } });
    });
    const real = D.redirects.filter((r) => r.from !== r.to), froms = new Set(real.map((r) => r.from));
    const chains = real.filter((r) => froms.has(r.to)).length;
    $('#seo-btn').addEventListener('click', (e) => { openDialog(dlg, e.currentTarget); });
    return { open() { $('#seo-btn').click(); }, close() { dlg.close(); }, get isOpen() { return dlg.open; }, select, chains, redirects: D.redirects, headings,
      get jsonld() { return JSON.parse($('script[type="application/ld+json"]').textContent); } };
  })();

  /* ---------- Tech-dialogit ---------- */
  const tech = (() => {
    const dlg = $('#tech-dialog');
    const open = (id, opener) => {
      const n = D.tech[id]; if (!n) return;
      $('#tech-title').textContent = n.title; $('#tech-technique').textContent = n.technique; $('#tech-formula').textContent = n.formula; $('#tech-why').textContent = n.why;
      openDialog(dlg, opener);
    };
    document.addEventListener('click', (e) => { const b = e.target.closest && e.target.closest('[data-tech]'); if (b) open(b.dataset.tech, b); });
    return { open, close() { dlg.close(); }, get isOpen() { return dlg.open; } };
  })();

  theme.sync();
  window.portfolioPOC = { hero, finder, personas, ask, contact, reveal, scapes, map, seo, tech, theme, projectDialog, data: D };
})();
