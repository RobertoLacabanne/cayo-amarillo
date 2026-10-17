// La jarra de la cocina: cerámica esmaltada crema con una guarda lila
// pintada a mano, pico a la izquierda y asa a la derecha. Atrás va la boca
// (el interior que se ve por arriba); adelante, el cuerpo. Al final se ata
// una cinta lila al cuello. Todo pintado como acuarela y horneado a sprites
// en coordenadas de escena.
import { makeRng } from '../paint/rng.js';
import { hsl, shift, hslStr } from '../paint/color.js';
import { makeCanvas, ctx2d } from '../paint/canvas.js';
import { glaze, edgeDarken, granulate, paperUnderlay, liftSoft, wetBleed, pencil, splatter } from '../paint/brush.js';
import { getPaper } from '../paint/paper.js';
import { paintPetal } from '../paint/petal.js';
import { ribbon, bezier } from '../paint/stem.js';

const K = {
  glaze: hsl('#F3ECE2'), glazeWarm: hsl('#EBDDCB'), shade: hsl('#B6A6BC'), shadeDeep: hsl('#7C6A86'),
  inside: hsl('#8A7890'), insideDeep: hsl('#4E3F58'), edge: hsl('#6A5874'),
  lila: hsl('#8E6CBC'), lilaDeep: hsl('#5E4290'), sage: hsl('#8FA27E'),
  ribbon: { main: hsl('#8A64B4'), deep: hsl('#5E3F86'), edge: hsl('#3E2A5E') },
  cream: hsl('#EADCC8'),
};

// Silueta: radio horizontal de la jarra a cada altura (boca, cuello, panza, base).
export const JAR = { cx: 200, rim: 392, ry: 13, neck: 441, base: 606 };
const PROFILE = [[392, 78], [412, 71], [441, 71], [470, 82], [520, 94], [566, 89], [596, 75], [606, 67]];

function rxAt(y) {
  if (y <= PROFILE[0][0]) return PROFILE[0][1];
  for (let i = 1; i < PROFILE.length; i++) {
    const [y1, r1] = PROFILE[i];
    const [y0, r0] = PROFILE[i - 1];
    if (y <= y1) {
      const t = (y - y0) / (y1 - y0);
      return r0 + (r1 - r0) * (0.5 - Math.cos(t * Math.PI) / 2);
    }
  }
  return PROFILE[PROFILE.length - 1][1];
}

// Lienzo en coordenadas de escena: devuelve { cv, c, map(p), sprite() }
function sceneCanvas(x0, y0, x1, y1, s) {
  const cv = makeCanvas((x1 - x0) * s, (y1 - y0) * s);
  const c = ctx2d(cv);
  const map = (p) => ({ x: (p.x - x0) * s, y: (p.y - y0) * s, v: p.v });
  return { cv, c, map, sprite: () => ({ canvas: cv, ax: -x0 * s, ay: -y0 * s, s }) };
}

// Arco de elipse (boca en perspectiva).
function arc(cx, cy, rx, ry, a0, a1, n, rng, j = 0.6) {
  const out = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    out.push({ x: cx + Math.cos(a) * rx + rng.gauss(0, j * 0.4), y: cy + Math.sin(a) * ry + rng.gauss(0, j) });
  }
  return out;
}

// Franja que rodea la jarra a la altura y (curvada como la boca, en perspectiva).
function girdle(y, h, rng, ry = 9) {
  const top = [], bot = [];
  const n = 24;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = Math.PI - t * Math.PI; // izquierda → derecha por adelante
    const r0 = rxAt(y), r1 = rxAt(y + h);
    top.push({ x: JAR.cx + Math.cos(a) * r0 * 1.01, y: y + Math.sin(a) * ry + rng.gauss(0, 0.25) });
    bot.push({ x: JAR.cx + Math.cos(a) * r1 * 1.01, y: y + h + Math.sin(a) * ry + rng.gauss(0, 0.25) });
  }
  return [...top, ...bot.reverse()];
}

// Pintura sobre el esmalte: se pinta aparte y se apoya solo donde hay jarra.
function onGlaze(target, paint) {
  const t = makeCanvas(target.cv.width, target.cv.height);
  paint(ctx2d(t), t);
  target.c.save();
  target.c.globalCompositeOperation = 'source-atop';
  target.c.drawImage(t, 0, 0);
  target.c.restore();
  t.width = t.height = 1;
}

export function bakeJar(s, seed = 'jarra') {
  const rng = makeRng(seed);
  const paper = getPaper();
  const { cx, rim, ry } = JAR;
  const rx = rxAt(rim);

  // --- atrás: la boca vista desde arriba (interior en sombra + labio trasero)
  const back = sceneCanvas(90, 360, 310, 420, s);
  const mouth = [...arc(cx, rim, rx, ry, Math.PI, Math.PI * 2, 20, rng, 0.25), ...arc(cx, rim, rx, ry, 0, Math.PI, 20, rng, 0.2)].map(back.map);
  glaze(back.c, [{ poly: mouth, color: K.inside, alpha: 0.07, count: 22, baseRounds: 2, rounds: 3, spread: 0.08, baseSpread: 0.12 }], rng);
  wetBleed(back.cv, mouth.map((p) => ({ x: p.x, y: p.y + 7 * s })), K.insideDeep, rng, { alpha: 0.55, blur: 8 });
  // labio trasero: el canto del esmalte, claro
  const lipB = [...arc(cx, rim - 0.5, rx, ry, Math.PI, Math.PI * 2, 20, rng, 0.2), ...arc(cx, rim + 3, rx * 0.965, ry * 0.85, Math.PI * 2, Math.PI, 20, rng, 0.2)].map(back.map);
  liftSoft(back.cv, lipB, rng, { alpha: 0.75, blur: 2, hard: 0.5 });
  edgeDarken(back.cv, K.edge, 0.8, 4);
  paperUnderlay(back.cv, paper.paper, 0, 0, 3, mouth, rng);

  // --- adelante: asa, cuerpo, guarda pintada y sombra sobre la mesa
  const front = sceneCanvas(70, 372, 360, 632, s);

  // sombra en la mesa (a la derecha: la luz entra por la izquierda)
  const shadowPoly = arc(cx + 30, JAR.base + 4, 108, 12, 0, Math.PI * 2, 18, rng, 0.6).map(front.map);
  wetBleed(front.cv, shadowPoly, K.shadeDeep, rng, { alpha: 0.32, blur: 12, comp: 'source-over' });

  // asa (va detrás del borde del cuerpo)
  const handlePts = bezier({ x: cx + 68, y: 430 }, { x: cx + 132, y: 416 }, { x: cx + 128, y: 522 }, { x: cx + 84, y: 554 }, 24);
  const handle = makeCanvas(front.cv.width, front.cv.height);
  const hc = ctx2d(handle);
  const hPoly = ribbon(handlePts.map(front.map), (t) => (14 - Math.sin(t * Math.PI) * 3) * s);
  glaze(hc, [{ poly: hPoly, color: K.glaze, alpha: 0.08, count: 18, baseRounds: 1, rounds: 2, spread: 0.06, baseSpread: 0.08 }], rng);
  wetBleed(handle, ribbon(handlePts.map((p) => front.map({ x: p.x + 3, y: p.y + 2 })), () => 7 * s), K.shade, rng, { alpha: 0.7, blur: 4 });
  liftSoft(handle, ribbon(handlePts.map((p) => front.map({ x: p.x - 3, y: p.y - 1 })), () => 2.4 * s), rng, { alpha: 0.6, blur: 2, hard: 0.4 });
  edgeDarken(handle, K.edge, 1.0, 4);
  paperUnderlay(handle, paper.paper, 0, 0, 3, hPoly, rng);
  front.c.drawImage(handle, 0, 0);
  handle.width = handle.height = 1;

  // cuerpo
  const body = makeCanvas(front.cv.width, front.cv.height);
  const B = { cv: body, c: ctx2d(body) };
  const left = [], right = [];
  for (let y = rim; y <= JAR.base; y += 6) {
    const r = rxAt(y);
    left.push({ x: cx - r + rng.gauss(0, 0.3), y });
    right.push({ x: cx + r + rng.gauss(0, 0.3), y });
  }
  const rimFront = arc(cx, rim, rx, ry, 0, Math.PI, 22, rng, 0.2); // derecha → izquierda por adelante
  const baseFront = arc(cx, JAR.base, rxAt(JAR.base), 9, Math.PI, 0, 18, rng, 0.3); // izquierda → derecha
  // pico: el borde se estira hacia la izquierda
  const spout = [{ x: cx - rx + 2, y: rim - 1 }, { x: cx - rx - 16, y: rim - 6 }, { x: cx - rx - 12, y: rim + 1 }, { x: cx - rx - 2, y: rim + 9 }];
  const bodyPoly = [...rimFront, ...spout, ...left.slice(1), ...baseFront, ...right.slice(1).reverse()].map(front.map);
  glaze(B.c, [
    { poly: bodyPoly, color: K.glaze, alpha: 0.075, count: 30, baseRounds: 1, rounds: 2, spread: 0.05, baseSpread: 0.06, drift: 3 },
  ], rng);
  // calidez abajo y sombra lila-gris del lado derecho (redondea la panza)
  wetBleed(body, arc(cx, 560, 100, 40, 0, Math.PI * 2, 14, rng, 1).map(front.map), K.glazeWarm, rng, { alpha: 0.5, blur: 14 });
  const shadeSide = [];
  for (let y = rim; y <= JAR.base + 10; y += 10) shadeSide.push({ x: cx + rxAt(y) * 0.3, y });
  for (let y = JAR.base + 10; y >= rim; y -= 10) shadeSide.push({ x: cx + rxAt(y) + 10, y });
  wetBleed(body, shadeSide.map(front.map), K.shade, rng, { alpha: 0.75, blur: 14 });
  const coreShade = [];
  for (let y = rim + 20; y <= JAR.base; y += 10) coreShade.push({ x: cx + rxAt(y) * 0.62, y });
  for (let y = JAR.base; y >= rim + 20; y -= 10) coreShade.push({ x: cx + rxAt(y) * 0.86, y });
  wetBleed(body, coreShade.map(front.map), K.shadeDeep, rng, { alpha: 0.35, blur: 10 });
  // bajo el labio, el cuello en sombra
  wetBleed(body, girdle(rim + 4, 12, rng).map(front.map), K.shade, rng, { alpha: 0.5, blur: 6 });

  // guarda lila en la panza, con filetes finos arriba y abajo
  const deco = { cv: body, c: B.c };
  onGlaze(deco, (c, cv) => {
    const band = girdle(500, 15, rng, 11).map(front.map);
    glaze(c, [{ poly: band, color: K.lila, alpha: 0.07, count: 22, baseRounds: 2, rounds: 2, spread: 0.08, baseSpread: 0.1 }], rng);
    for (const y of [490, 522]) {
      const line = [];
      for (let i = 0; i <= 24; i++) {
        const a = Math.PI - (i / 24) * Math.PI;
        line.push(front.map({ x: cx + Math.cos(a) * rxAt(y) * 1.01, y: y + Math.sin(a) * 11 }));
      }
      pencil(c, line, rng, K.lilaDeep, { width: 1.3 * s, alpha: 0.75 });
    }
    edgeDarken(cv, K.lilaDeep, 0.9, 3);
    // florcitas de cinco puntos en la franja y hojitas salvia entre ellas
    for (let i = 0; i < 7; i++) {
      const t = (i + 0.5) / 7;
      const a = Math.PI - t * Math.PI;
      const fx = cx + Math.cos(a) * rxAt(507) * 0.98;
      const fy = 507 + Math.sin(a) * 11;
      const k = Math.abs(Math.sin(a)) * 0.6 + 0.4; // se achican hacia los costados
      const m = front.map({ x: fx, y: fy });
      for (let p = 0; p < 5; p++) {
        const pa = (p / 5) * Math.PI * 2 + rng.gauss(0, 0.15);
        c.fillStyle = hslStr(shift(K.cream, 0, 0, rng.gauss(0, 3)), 0.9);
        c.beginPath();
        c.ellipse(m.x + Math.cos(pa) * 3.2 * s * k, m.y + Math.sin(pa) * 2.6 * s, 2.1 * s * k, 1.9 * s, pa, 0, Math.PI * 2);
        c.fill();
      }
      c.fillStyle = hslStr(hsl('#E2B84A'), 0.9);
      c.beginPath();
      c.arc(m.x, m.y, 1.3 * s * k, 0, Math.PI * 2);
      c.fill();
      if (i < 6) {
        const a2 = Math.PI - ((i + 1) / 7) * Math.PI;
        const lm = front.map({ x: cx + Math.cos(a2) * rxAt(507) * 0.98, y: 507 + Math.sin(a2) * 11 });
        for (const d of [-1, 1]) {
          c.fillStyle = hslStr(shift(K.sage, 0, 0, rng.gauss(0, 4)), 0.85);
          c.beginPath();
          c.ellipse(lm.x + d * 2.4 * s * k, lm.y, 2.6 * s * k, 1.2 * s, d * 0.5, 0, Math.PI * 2);
          c.fill();
        }
      }
    }
  });
  // la guarda también se sombrea del lado derecho
  wetBleed(body, coreShade.map((p) => front.map({ x: p.x + 8, y: p.y })), K.shadeDeep, rng, { alpha: 0.18, blur: 10 });

  // brillo del esmalte: una veta vertical a la izquierda y el canto de la boca
  const shine = [];
  for (let y = 456; y <= 580; y += 8) shine.push({ x: cx - rxAt(y) * 0.52, y });
  liftSoft(body, ribbon(shine.map(front.map), (t) => (3 + Math.sin(t * Math.PI) * 9) * s), rng, { alpha: 0.6, blur: 9, hard: 0.08 });
  const lip = [...arc(cx, rim + 0.5, rx, ry, 0, Math.PI, 22, rng, 0.2), ...arc(cx, rim + 4.5, rx * 0.99, ry, Math.PI, 0, 22, rng, 0.2)].map(front.map);
  liftSoft(body, lip, rng, { alpha: 0.7, blur: 2, hard: 0.45 });
  edgeDarken(body, K.edge, 1.1, 5);
  granulate(body, paper.grain, K.shadeDeep, 0.22);
  paperUnderlay(body, paper.paper, 0, 0, 3, bodyPoly, rng);
  front.c.drawImage(body, 0, 0);
  body.width = body.height = 1;

  // contorno a lápiz, apenas, y alguna salpicadura
  pencil(front.c, rimFront.map(front.map), rng, K.edge, { width: 0.9 * s, alpha: 0.4 });
  pencil(front.c, baseFront.map(front.map), rng, K.edge, { width: 0.9 * s, alpha: 0.35 });
  splatter(front.c, rng, K.lila, { n: 10, x: front.map({ x: cx, y: 0 }).x, y: front.map({ x: 0, y: 560 }).y, rx: 90 * s, ry: 50 * s, size: 0.9 * s, alpha: 0.28 });
  return { back: back.sprite(), front: front.sprite() };
}

// Moño: cinta lila que rodea el cuello, lazo con colas en V y una cinta
// crema más fina.
export function bakeBow(s, seed = 'monio') {
  const rng = makeRng(seed);
  const neckR = rxAt(JAR.neck) + 2;
  const knot = { x: 200, y: JAR.neck + 5 };
  const B = sceneCanvas(80, 370, 320, 570, s);
  const band = sceneCanvas(100, 420, 300, 470, s);
  const bandPts = [];
  for (let i = 0; i <= 18; i++) {
    const a = Math.PI - (i / 18) * Math.PI;
    bandPts.push({ x: 200 + Math.cos(a) * neckR, y: JAR.neck + Math.sin(a) * 9 + rng.gauss(0, 0.3) });
  }
  const bandPoly = ribbon(bandPts.map(band.map), () => 10 * s);
  glaze(band.c, [{ poly: bandPoly, color: K.ribbon.main, alpha: 0.07, count: 22, baseRounds: 2, rounds: 3, spread: 0.1, baseSpread: 0.2 }], rng);
  for (const off of [-4.5, 4.5]) liftSoft(band.cv, ribbon(bandPts.map((p) => band.map({ x: p.x, y: p.y + off })), () => 1.3 * s), rng, { alpha: 0.8, blur: 2, hard: 0.55 });
  edgeDarken(band.cv, K.ribbon.edge, 1.4, 4);
  paperUnderlay(band.cv, getPaper().paper, 0, 0, 3, bandPoly, rng);

  // cinta lila con dos rayitas claras
  const stripes = (pet, W, L) => {
    for (const off of [-0.24, 0.24]) {
      const pts = [];
      for (let k = 0; k <= 10; k++) pts.push({ x: pet.ax + off * W * s * (1 - k * 0.02), y: pet.ay - (L * s * k) / 10 * 0.96 });
      liftSoft(pet.canvas, ribbon(pts, () => 1.3 * s), rng, { alpha: 0.8, blur: 2, hard: 0.55 });
    }
    return pet;
  };
  const mk = (o) => stripes(paintPetal({ scale: s, colors: K.ribbon, layers: 26, alpha: 0.06, deep: [0.3, 0.55], liftAmt: 0.6, rim: 1.4, spread: 0.12, baseSpread: 0.3, pencilAmt: 0.3, ...o }), o.W, o.L);
  // colas (atrás), cinta crema, lazos y nudo
  const tails = [
    { rot: 162, L: 92, seed: 't1' }, { rot: -150, L: 80, seed: 't2' },
  ];
  const thin = [{ rot: 174, L: 74, seed: 's1' }, { rot: -166, L: 64, seed: 's2' }];
  const loops = [{ rot: -70, L: 50, W: 42, seed: 'l1' }, { rot: 68, L: 52, W: 44, seed: 'l2' }];
  const draw = (pet, rot, sy = 1) => {
    B.c.save();
    const m = B.map(knot);
    B.c.translate(m.x, m.y);
    B.c.rotate((rot * Math.PI) / 180);
    B.c.scale(1, sy);
    B.c.drawImage(pet.canvas, -pet.ax, -pet.ay);
    B.c.restore();
    pet.canvas.width = pet.canvas.height = 1;
  };
  for (const t of thin) draw(paintPetal({ scale: s, seed: seed + t.seed, L: t.L, W: 7, widest: 0.8, base: 0.8, tip: 'notch', tipDepth: 0.12, colors: { main: K.cream, deep: shift(K.cream, 10, 5, -14), edge: shift(K.cream, 15, 5, -34) }, layers: 18, alpha: 0.07, deep: [0.3], liftAmt: 0.7, rim: 1.2, spread: 0.1, baseSpread: 0.2 }), t.rot);
  for (const t of tails) draw(mk({ seed: seed + t.seed, L: t.L, W: 17, widest: 0.85, base: 0.7, tip: 'notch', tipDepth: 0.22, bend: rng.gauss(0, 0.1) }), t.rot);
  for (const l of loops) draw(mk({ seed: seed + l.seed, L: l.L, W: l.W, widest: 0.62, base: 0.25, tip: 'round', cup: 0.6 }), l.rot, 0.85);
  const kn = mk({ seed: seed + 'k', L: 18, W: 17, widest: 0.5, base: 0.5, tip: 'round', liftAmt: 0.8 });
  B.c.save();
  const m = B.map(knot);
  B.c.drawImage(kn.canvas, m.x - kn.ax, m.y - kn.ay + 6 * s);
  B.c.restore();
  kn.canvas.width = kn.canvas.height = 1;
  splatter(B.c, rng, K.ribbon.deep, { n: 7, x: m.x, y: m.y + 30 * s, rx: 50 * s, ry: 30 * s, size: 1.1 * s, alpha: 0.4 });
  return { band: band.sprite(), bow: B.sprite(), knot, x0: 200 - neckR - 6, w: neckR * 2 + 12 };
}

// Pétalos sueltos para la explosión y la lluvia (sprites chicos).
export function bakeLoosePetals(s, colors, seed = 'sueltos') {
  const out = [];
  colors.forEach((hex, i) => {
    for (let k = 0; k < 2; k++) {
      const col = hsl(hex);
      const p = paintPetal({
        seed: `${seed}${i}${k}`, scale: s, L: 9 + k * 2, W: 7 + k, widest: 0.6, base: 0.3, tip: k ? 'flat' : 'round', tipDepth: 0.08,
        colors: { main: col, deep: shift(col, -4, 4, -12), edge: shift(col, -6, 4, -26) }, layers: 14, alpha: 0.08, deep: [0.4], liftAmt: 0.6, rim: 1.2, spread: 0.12, baseSpread: 0.35,
      });
      out.push({ canvas: p.canvas, ax: p.canvas.width / 2, ay: p.canvas.height / 2, s });
    }
  });
  return out;
}

// Colores de la lluvia final: rosas, lilas y crema.
export const RAIN = ['#F29AB3', '#B89AD9', '#F9F3EA', '#D8668A', '#D8C8EE', '#F6E7A8'];
