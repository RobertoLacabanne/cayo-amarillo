// Clavel en vista 3/4: cáliz verde azulado alargado con sépalos en punta y,
// encima, una copa de pétalos con el borde dentado (picado), en capas de
// atrás hacia adelante, más chicos y más claros los de adelante.
import { makeRng } from '../paint/rng.js';
import { hsl, shift } from '../paint/color.js';
import { part } from '../scene/head.js';
import { D, sprite, softBlob } from './common.js';
import { paintPetal } from '../paint/petal.js';

const PALETTES = {
  rosa: {
    petal: { main: hsl('#F28CAA'), deep: hsl('#D25A80'), edge: hsl('#9C335A'), tip: hsl('#F8B8CB') },
    back: { main: hsl('#E06F92'), deep: hsl('#B8436C'), edge: hsl('#82264E') },
    shadow: hsl('#8A2A52'),
  },
  rojo: {
    petal: { main: hsl('#D4243E'), deep: hsl('#9A1230'), edge: hsl('#5E0A26'), tip: hsl('#E5545E') },
    back: { main: hsl('#B3182F'), deep: hsl('#7E0C26'), edge: hsl('#4A0820') },
    shadow: hsl('#4A0A24'),
  },
  // blanco con el borde teñido de frambuesa (clavel "picotee")
  blanco: {
    petal: { main: hsl('#FBF4EF'), deep: hsl('#E6D4D4'), edge: hsl('#C0386A'), tip: hsl('#FFFDFA') },
    back: { main: hsl('#F0E4E2'), deep: hsl('#D8C2C6'), edge: hsl('#B23A66') },
    shadow: hsl('#9A7C92'),
  },
};

const CALYX = { main: hsl('#86A07A'), deep: hsl('#5E7A5E'), edge: hsl('#3E5644'), tip: hsl('#A8BC92') };

// Borde picado: se recortan dientitos en V a lo largo del contorno superior.
function fringe(pet, rng, s) {
  const cv = pet.canvas;
  const c = cv.getContext('2d');
  const w = cv.width, h = cv.height;
  const data = c.getImageData(0, 0, w, h).data;
  const step = Math.max(2, Math.round(2.6 * s));
  const tops = [];
  for (let x = 0; x < w; x += step) {
    let y = 0;
    while (y < h && data[(y * w + x) * 4 + 3] < 40) y++;
    // solo la mitad de arriba del pétalo (el borde libre)
    if (y < pet.ay - pet.L * 0.55) tops.push({ x, y });
  }
  c.save();
  c.globalCompositeOperation = 'destination-out';
  c.fillStyle = '#000';
  for (let i = 0; i < tops.length; i++) {
    const p = tops[i];
    const d = rng.range(1.6, 3.2) * s;
    c.beginPath();
    c.moveTo(p.x - step * 0.5, p.y - 1);
    c.lineTo(p.x + rng.gauss(0, step * 0.12), p.y + d);
    c.lineTo(p.x + step * 0.5, p.y - 1);
    c.closePath();
    c.fill();
  }
  c.restore();
}

export function bakeCarnation({ seed = 'clavel', scale = 2, r = 44, variant = 'rosa' } = {}) {
  const P = PALETTES[variant];
  const rng = makeRng(seed + variant);
  const parts = [];
  const top = -r * 0.52; // donde termina el cáliz y nace la copa

  // copa: pétalos en abanico, de atrás (arriba) hacia adelante (abajo)
  const rows = [
    { n: 7, span: 150, dist: 0.18, L: 0.62, W: 0.6, colors: P.back, fore: 0.9, lift: -0.08, delay: 0.25 },
    { n: 6, span: 130, dist: 0.1, L: 0.58, W: 0.62, colors: P.petal, fore: 0.85, lift: 0.0, delay: 0.38 },
    { n: 5, span: 110, dist: 0.04, L: 0.5, W: 0.6, colors: P.petal, fore: 0.75, lift: 0.08, delay: 0.5 },
    { n: 3, span: 70, dist: 0.0, L: 0.4, W: 0.62, colors: P.petal, fore: 0.62, lift: 0.16, delay: 0.62 },
  ];
  parts.push(part(softBlob(`${seed}cp`, r * 0.38, r * 0.22, scale, P.shadow, 0.3), { x: 0, y: top - r * 0.3, sx: 1, sx0: 0.2, delay: 0.2, dur: 0.5 }));
  rows.forEach((row, ri) => {
    for (let i = 0; i < row.n; i++) {
      const u = row.n === 1 ? 0.5 : i / (row.n - 1);
      const a = (-row.span / 2 + u * row.span + rng.gauss(0, 6)) * D;
      const pet = paintPetal({
        seed: `${seed}${ri}p${i}`, scale, L: r * row.L * rng.range(0.9, 1.08), W: r * row.W * rng.range(0.85, 1.05), widest: 0.82, base: 0.12, tip: 'flat', tipDepth: 0.05,
        asym: rng.gauss(0, 0.25), bend: rng.gauss(0, 0.05), colors: row.colors, layers: 22, alpha: 0.055, deep: [0.25, 0.45], liftAmt: 0.45, rim: variant === 'blanco' ? 1.6 : 1.2,
        cup: 0.4, spread: 0.2, baseSpread: 0.6, pencilAmt: 0.3, veins: 2,
      });
      fringe(pet, rng, scale);
      const y = top - r * 0.08 + r * row.lift;
      parts.push(part(sprite(pet, scale), {
        x: Math.sin(a) * r * row.dist, y, rot: a * 0.85, sx: rng.chance(0.5) ? 1 : -1, sy: row.fore,
        rot0: a * 0.2, sx0: 0.25, sy0: 0.15, delay: row.delay + i * 0.025, dur: 0.5,
      }));
    }
  });

  // cáliz: tubo con sépalos en punta que abrazan la base de la copa
  const calyx = paintPetal({
    seed: `${seed}k`, scale, L: r * 0.62, W: r * 0.28, widest: 0.82, base: 0.55, tip: 'flat', tipDepth: 0.03,
    colors: CALYX, layers: 22, alpha: 0.06, deep: [0.3], liftAmt: 0.7, rim: 1.1, spread: 0.08, baseSpread: 0.2, veins: 3,
  });
  parts.push(part(sprite(calyx, scale), { x: 0, y: r * 0.06, sx: 1, sx0: 1, sy0: 0.4, delay: 0.05, dur: 0.4 }));
  [-1, 0, 1].forEach((k, i) => {
    const sep = paintPetal({
      seed: `${seed}sp${i}`, scale, L: r * 0.24, W: r * 0.1, widest: 0.3, base: 0.9, tip: 'point',
      colors: CALYX, layers: 16, alpha: 0.07, deep: [0.4], liftAmt: 0.5, rim: 1.1, spread: 0.08, baseSpread: 0.2,
    });
    parts.push(part(sprite(sep, scale), { x: k * r * 0.1, y: top + r * 0.16, rot: k * 22 * D, sx: 1, sx0: 0.6, sy0: 0.3, delay: 0.15 + i * 0.03, dur: 0.4 }));
  });
  return { parts, r, kind: 'carnation' };
}
