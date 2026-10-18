// Azalea: racimo de tres flores en embudo, cada una con cinco pétalos anchos
// y ondulados (el de arriba con pecas más oscuras), estambres largos que se
// arquean hacia afuera y una roseta de hojitas brillantes detrás.
import { makeRng } from '../paint/rng.js';
import { hsl, shift, hslStr } from '../paint/color.js';
import { makeCanvas, ctx2d } from '../paint/canvas.js';
import { part } from '../scene/head.js';
import { D, sprite, softBlob } from './common.js';
import { paintPetal } from '../paint/petal.js';

const PALETTES = {
  fucsia: {
    petal: { main: hsl('#E5559F'), deep: hsl('#B92A78'), edge: hsl('#7E1656'), tip: hsl('#F190C2') },
    back: { main: hsl('#CF3F8C'), deep: hsl('#A0225F'), edge: hsl('#6E1248') },
    freckle: hsl('#6A0C3E'), throat: hsl('#9E1E62'), filament: hsl('#D46AA6'), anther: hsl('#5A1E3C'),
  },
  rosa: {
    petal: { main: hsl('#F5A9C6'), deep: hsl('#E0729E'), edge: hsl('#B04A78'), tip: hsl('#FAD0E0') },
    back: { main: hsl('#EE95B6'), deep: hsl('#D46690'), edge: hsl('#A2406C') },
    freckle: hsl('#A82A62'), throat: hsl('#D8648E'), filament: hsl('#E79ABB'), anther: hsl('#7A3A52'),
  },
  // blanca: papel con sombras lila y pecas verde amarillento
  blanca: {
    petal: { main: hsl('#FBF4F2'), deep: hsl('#E2D2DA'), edge: hsl('#A592A8'), tip: hsl('#FFFDFB') },
    back: { main: hsl('#EEE2E6'), deep: hsl('#D2C0CC'), edge: hsl('#9A86A0') },
    freckle: hsl('#8A9A36'), throat: hsl('#C8D08A'), filament: hsl('#E6DCE2'), anther: hsl('#8A7A4A'),
  },
};

const LEAF = { main: hsl('#5E7C44'), deep: hsl('#3F5B32'), edge: hsl('#2A4228'), tip: hsl('#86A05A') };

// Pecas: puntitos y rayitas en la mitad baja del pétalo de arriba.
function freckles(pet, rng, color, s) {
  const c = ctx2d(pet.canvas);
  c.save();
  c.globalCompositeOperation = 'source-atop';
  const n = 30;
  for (let i = 0; i < n; i++) {
    const y = pet.ay - pet.L * rng.range(0.12, 0.55);
    const spreadW = pet.W * 0.28 * (1 - (pet.ay - y) / pet.L * 0.6);
    const x = pet.ax + rng.gauss(0, spreadW);
    const r = rng.range(0.6, 1.3) * s;
    c.fillStyle = hslStr(shift(color, rng.gauss(0, 6), 0, rng.gauss(0, 6)), rng.range(0.7, 0.95));
    c.beginPath();
    c.ellipse(x, y, r, r * rng.range(1, 1.8), rng.gauss(0, 0.3), 0, Math.PI * 2);
    c.fill();
  }
  c.restore();
}

// Estambres: filamentos largos que salen de la garganta y se curvan hacia
// arriba, con anteras oscuras; uno más largo (el pistilo).
function stamens(seed, r, s, P) {
  const rng = makeRng(seed);
  const size = r * 2.6 * s;
  const cv = makeCanvas(size, size);
  const c = ctx2d(cv);
  const cx = size / 2, cy = size / 2;
  c.lineCap = 'round';
  const n = 7;
  for (let i = 0; i < n; i++) {
    const pistil = i === n - 1;
    const a = (-90 + (i - (n - 1) / 2) * 15 + rng.gauss(0, 5)) * D + (pistil ? 0.1 : 0);
    const L = r * (pistil ? 1.2 : rng.range(0.85, 1.05)) * s;
    const ex = cx + Math.cos(a) * L, ey = cy + Math.sin(a) * L;
    const mx = cx + Math.cos(a) * L * 0.55 + L * 0.1, my = cy + Math.sin(a) * L * 0.55 + L * 0.1;
    c.strokeStyle = hslStr(shift(pistil ? hsl('#B9C27A') : P.filament, 0, 0, rng.gauss(0, 4)), 0.8);
    c.lineWidth = (pistil ? 0.75 : 0.55) * s;
    c.beginPath();
    c.moveTo(cx, cy);
    c.quadraticCurveTo(mx, my, ex, ey);
    c.stroke();
    c.fillStyle = hslStr(shift(pistil ? hsl('#8A9A42') : P.anther, rng.gauss(0, 6), 0, rng.gauss(0, 5)), 0.9);
    c.beginPath();
    c.ellipse(ex, ey, (pistil ? 1.0 : 1.3) * s, 0.8 * s, a, 0, Math.PI * 2);
    c.fill();
  }
  return { canvas: cv, ax: cx, ay: cy, s };
}

export function bakeAzalea({ seed = 'azalea', scale = 2, r = 52, variant = 'fucsia' } = {}) {
  const P = PALETTES[variant];
  const rng = makeRng(seed + variant);
  const parts = [];

  // roseta de hojas detrás del racimo (asoman abajo y a los costados)
  const leafAngles = [118, 150, 182, 212, 244, 98 + rng.gauss(0, 6), 262 + rng.gauss(0, 6)];
  leafAngles.forEach((deg, i) => {
    const a = (deg + rng.gauss(0, 7)) * D;
    const pet = paintPetal({
      seed: `${seed}h${i}`, scale, L: r * rng.range(0.62, 0.78), W: r * rng.range(0.24, 0.3), widest: 0.55, base: 0.15, tip: 'point',
      asym: rng.gauss(0, 0.2), bend: rng.gauss(0, 0.08), colors: LEAF, layers: 20, alpha: 0.06, deep: [0.35], liftAmt: 0.6, rim: 1.1, veins: 1,
      spread: 0.1, baseSpread: 0.25,
    });
    parts.push(part(sprite(pet, scale), { x: 0, y: r * 0.18, rot: a, sx: 1, sy: 1, rot0: a * 0.6, sx0: 0.3, sy0: 0.2, delay: i * 0.03, dur: 0.5 }));
  });

  // tres flores: una atrás arriba, dos adelante, cada una mirando a su lado
  const fr = r * 0.56;
  const flowers = [
    { x: rng.gauss(0, 3), y: -r * 0.42, tilt: rng.gauss(0, 0.12), fore: 0.82, sc: 0.92, back: true },
    { x: -r * 0.44, y: r * 0.06, tilt: -0.32 + rng.gauss(0, 0.08), fore: 0.88, sc: 1 },
    { x: r * 0.46, y: r * 0.1, tilt: 0.3 + rng.gauss(0, 0.08), fore: 0.86, sc: 0.97 },
  ];
  flowers.forEach((f, fi) => {
    const base = 0.18 + fi * 0.16;
    const L = fr * f.sc;
    // sombra de la garganta (une los pétalos)
    parts.push(part(softBlob(`${seed}g${fi}`, L * 0.55, L * 0.5, scale, P.back.deep, 0.5), { x: f.x, y: f.y, sx: 1, sx0: 0.2, delay: base, dur: 0.4 }));
    const pets = [];
    for (let k = 0; k < 5; k++) {
      const local = (k * 72 + rng.gauss(0, 5)) * D; // 0 = el pétalo de arriba
      const top = k === 0;
      const colors = f.back ? P.back : P.petal;
      const pet = paintPetal({
        seed: `${seed}${fi}p${k}`, scale, L: L * rng.range(0.94, 1.06), W: L * rng.range(0.82, 0.95), widest: 0.66, base: 0.16, tip: 'flat', tipDepth: 0.07,
        asym: rng.gauss(0, 0.2), bend: rng.gauss(0, 0.05), colors, layers: 26, alpha: 0.05, deep: [0.22, 0.4], liftAmt: 0.5, rim: 1.2,
        reflex: rng.chance(0.4) ? 0.6 : 0, cup: 0.35, spread: 0.18, baseSpread: 0.55, pencilAmt: 0.25, veins: top ? 0 : 2,
      });
      if (top) freckles(pet, rng, P.freckle, scale);
      pets.push({ img: sprite(pet, scale), local, k });
    }
    // de atrás hacia adelante: primero los que apuntan hacia arriba
    pets.sort((p, q) => Math.cos(q.local) - Math.cos(p.local));
    pets.forEach((p, i) => {
      const rot = p.local + f.tilt;
      const fore = f.fore + (1 - f.fore) * Math.abs(Math.sin(p.local));
      parts.push(part(p.img, {
        x: f.x, y: f.y, rot, sx: 1, sy: fore, rot0: f.tilt + p.local * 0.3, sx0: 0.3, sy0: 0.25,
        delay: base + 0.05 + i * 0.035, dur: 0.55,
      }));
    });
    // garganta: un poco más intensa en el centro
    parts.push(part(softBlob(`${seed}t${fi}`, L * 0.16, L * 0.14, scale, P.throat, 0.9), { x: f.x, y: f.y, sx: 1, sx0: 0.2, delay: base + 0.25, dur: 0.3 }));
    parts.push(part(stamens(`${seed}s${fi}`, L, scale, P), { x: f.x, y: f.y, rot: f.tilt, sx: 1, sx0: 0.2, delay: base + 0.32, dur: 0.45 }));
  });
  return { parts, r, kind: 'azalea' };
}
