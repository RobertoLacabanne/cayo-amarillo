// Hortensia: una bola de florcitas de cuatro pétalos que pasa del celeste al
// lila y al rosa, con volumen (sombra abajo a la derecha, papel arriba a la
// izquierda) y dos hojas grandes, anchas y dentadas, por detrás.
import { makeRng } from '../paint/rng.js';
import { hsl, shift, hslStr } from '../paint/color.js';
import { makeCanvas, ctx2d } from '../paint/canvas.js';
import { glaze, edgeDarken, liftSoft, wetBleed } from '../paint/brush.js';
import { part, drawSprite } from '../scene/head.js';
import { D, GOLDEN, sprite, ellipsePoly, softBlob } from './common.js';
import { paintPetal } from '../paint/petal.js';

const PALETTES = {
  // celeste → lila → rosa, como las de jardín según la tierra
  jardin: {
    tones: ['#9DB4E6', '#B3A2E0', '#C9A6DC', '#E3AECB', '#A9C0EA'],
    base: hsl('#A99AD6'), shade: hsl('#5E4E96'), shadeDeep: hsl('#3E3474'), center: hsl('#EEE6B0'),
  },
  rosa: {
    tones: ['#F0A8C4', '#E896B8', '#F4BFD2', '#DE8FB6', '#F6CADB'],
    base: hsl('#E7A2C0'), shade: hsl('#A44C7C'), shadeDeep: hsl('#6E2A56'), center: hsl('#F6EAB8'),
  },
};

const LEAF = { main: hsl('#5A7A42'), deep: hsl('#3C5A30'), edge: hsl('#284226'), tip: hsl('#82A058') };

// Una florcita: cuatro pétalos redondos en cruz y un puntito al centro.
function floret(seed, size, s, tone) {
  const rng = makeRng(seed);
  const col = hsl(tone);
  const colors = { main: col, deep: shift(col, rng.gauss(0, 4), 4, -12), edge: shift(col, 0, 6, -30), tip: shift(col, 0, -6, 8) };
  const R = size * s;
  const cv = makeCanvas(R * 2.6, R * 2.6);
  const c = ctx2d(cv);
  const cx = cv.width / 2, cy = cv.height / 2;
  const rot0 = rng.next() * Math.PI;
  for (let k = 0; k < 4; k++) {
    const pet = paintPetal({
      seed: `${seed}p${k}`, scale: s, L: size, W: size * rng.range(0.85, 1.0), widest: 0.62, base: 0.25, tip: 'round',
      asym: rng.gauss(0, 0.2), colors, layers: 12, alpha: 0.085, deep: [0.4], deepAlpha: 0.04, liftAmt: 0.45, rim: 1.0, mottle: 0.4,
      spread: 0.12, baseSpread: 0.3,
    });
    c.save();
    c.translate(cx, cy);
    c.rotate(rot0 + k * (Math.PI / 2) + rng.gauss(0, 0.1));
    c.drawImage(pet.canvas, -pet.ax, -pet.ay);
    c.restore();
    pet.canvas.width = pet.canvas.height = 1;
  }
  c.fillStyle = hslStr(shift(col, 0, 10, -28), 0.8);
  c.beginPath();
  c.arc(cx, cy, 0.7 * s, 0, Math.PI * 2);
  c.fill();
  return { canvas: cv, ax: cx, ay: cy, s };
}

export function bakeHydrangea({ seed = 'hortensia', scale = 2, r = 50, variant = 'jardin' } = {}) {
  const P = PALETTES[variant];
  const rng = makeRng(seed + variant);
  const parts = [];

  // hojas por detrás, abajo a los costados
  [[-128, 1], [132, -1], [180 + rng.gauss(0, 10), 1]].forEach(([deg, flip], i) => {
    const pet = paintPetal({
      seed: `${seed}h${i}`, scale, L: r * rng.range(0.85, 1.0), W: r * rng.range(0.5, 0.58), widest: 0.5, base: 0.12, tip: 'point',
      asym: 0.15 * flip, bend: 0.06 * flip, colors: LEAF, layers: 22, alpha: 0.06, deep: [0.3, 0.5], liftAmt: 0.55, rim: 1.2, veins: 4,
      spread: 0.12, baseSpread: 0.35, pencilAmt: 0.4,
    });
    parts.push(part(sprite(pet, scale), { x: 0, y: r * 0.35, rot: deg * D, sx: flip, sy: 1, rot0: deg * D * 0.5, sx0: 0.3 * flip, sy0: 0.2, delay: i * 0.05, dur: 0.5 }));
  });

  // florcitas horneadas una vez y estampadas en tres capas
  const fs = r * 0.155;
  const stamps = [];
  P.tones.forEach((tone, ti) => {
    for (let k = 0; k < 2; k++) stamps.push(floret(`${seed}f${ti}${k}`, fs * rng.range(0.9, 1.1), scale, tone));
  });
  const S = Math.ceil(r * scale * 2.6);
  const layers = [
    { r0: 0.55, r1: 1.0, n: 46, delay: 0.12 },
    { r0: 0.25, r1: 0.72, n: 30, delay: 0.3 },
    { r0: 0.0, r1: 0.42, n: 16, delay: 0.46 },
  ];
  layers.forEach((L, li) => {
    const cv = makeCanvas(S, S);
    const c = ctx2d(cv);
    const cx = S / 2, cy = S / 2;
    const R = r * scale * 0.82;
    // bola base: sin huecos de papel entre florcitas
    glaze(c, [{ poly: ellipsePoly(cx, cy, R * (L.r1 * 0.8 + 0.12), R * (L.r1 * 0.74 + 0.1), 12, rng, 0.08), color: shift(P.base, 0, 0, 2 - li * 3), alpha: 0.05, count: 16, baseRounds: 3, rounds: 3, spread: 0.35 }], rng);
    const items = [];
    for (let i = 0; i < L.n; i++) {
      const f = (i + 0.5) / L.n;
      const rr = (L.r0 + (L.r1 - L.r0) * Math.sqrt(f)) * R;
      items.push({ rr, a: i * GOLDEN + li * 1.3 });
    }
    items.sort((p, q) => q.rr - p.rr);
    for (const it of items) {
      const img = stamps[Math.floor(rng.next() * stamps.length)];
      const edge = it.rr / R; // hacia el borde las florcitas se ven de canto
      c.save();
      c.translate(cx + Math.cos(it.a) * it.rr, cy + Math.sin(it.a) * it.rr * 0.92);
      c.rotate(it.a + Math.PI / 2);
      c.scale(scale * rng.range(0.85, 1.1), scale * (1 - edge * 0.45) * rng.range(0.85, 1.05));
      drawSprite(c, img, 1);
      c.restore();
    }
    // volumen
    const Rv = R * (L.r1 * 0.8 + 0.3);
    // la sombra fuerte solo en la capa de afuera; las de adentro apenas
    // (si no, se suman y parece un hueco en el medio)
    wetBleed(cv, ellipsePoly(cx + Rv * 0.5, cy + Rv * 0.55, Rv * 0.7, Rv * 0.52, 10, rng), P.shade, rng, { alpha: [0.45, 0.16, 0.08][li], blur: 10 });
    if (li === 0) wetBleed(cv, ellipsePoly(cx + Rv * 0.55, cy + Rv * 0.68, Rv * 0.42, Rv * 0.26, 9, rng), P.shadeDeep, rng, { alpha: 0.25, blur: 8 });
    liftSoft(cv, ellipsePoly(cx - Rv * 0.34, cy - Rv * 0.38, Rv * 0.32, Rv * 0.22, 9, rng), rng, { alpha: 0.4, blur: 10, hard: 0.05 });
    edgeDarken(cv, P.shadeDeep, 0.3, 5);
    parts.push(part({ canvas: cv, ax: cx, ay: cy, s: scale }, {
      x: 0, y: -li * r * 0.04, sx: 1, sx0: 0.25, sy0: 0.25, delay: L.delay, dur: 0.6,
    }));
  });
  stamps.forEach((st) => { st.canvas.width = 1; st.canvas.height = 1; });
  parts.unshift(part(softBlob(`${seed}sh`, r * 0.8, r * 0.7, scale, P.shadeDeep, 0.14), { x: r * 0.08, y: r * 0.12, sx: 1, sx0: 0.3, delay: 0, dur: 0.5 }));
  return { parts, r, kind: 'hydrangea' };
}
