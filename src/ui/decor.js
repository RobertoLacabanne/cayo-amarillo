// Detalles pintados para la interfaz (tarjetita, trazo de la pista):
// se hornean una vez a imagen y se usan como fondo CSS.
import { makeRng } from '../paint/rng.js';
import { makeCanvas, ctx2d } from '../paint/canvas.js';
import { glaze, edgeDarken, granulate, paperUnderlay, pencil, liftSoft } from '../paint/brush.js';
import { getPaper } from '../paint/paper.js';
import { hsl, hslStr } from '../paint/color.js';

export function paintCard(w = 118, h = 68, s = 2) {
  const rng = makeRng('tarjeta');
  const cv = makeCanvas(w * s, h * s);
  const c = ctx2d(cv);
  const m = 5 * s;
  const poly = [
    { x: m, y: m + 2 }, { x: w * s * 0.5, y: m - 1 }, { x: w * s - m, y: m + 1 },
    { x: w * s - m + 1, y: h * s * 0.5 }, { x: w * s - m, y: h * s - m }, { x: w * s * 0.5, y: h * s - m + 1 },
    { x: m + 1, y: h * s - m }, { x: m - 1, y: h * s * 0.5 },
  ];
  glaze(c, [
    { poly, color: hsl('#F7EEE6'), alpha: 0.07, count: 22, baseRounds: 3, rounds: 3, spread: 0.1, baseSpread: 0.15 },
    { poly: poly.map((p) => ({ x: p.x * 0.55 + w * s * 0.42, y: p.y * 0.6 + h * s * 0.35 })), color: hsl('#D8C8EE'), alpha: 0.03, count: 16, baseRounds: 3, rounds: 3, spread: 0.4 },
  ], rng);
  liftSoft(cv, poly.map((p) => ({ x: p.x * 0.4 + w * s * 0.1, y: p.y * 0.35 + h * s * 0.1 })), rng, { alpha: 0.4, blur: 6 });
  edgeDarken(cv, hsl('#9A86A8'), 1.1, 6);
  granulate(cv, getPaper().grain, hsl('#8A7690'), 0.25);
  paperUnderlay(cv, getPaper().paper, 0, 0, 3, poly, rng);
  // agujerito con hilo
  c.fillStyle = hslStr(hsl('#7E6A88'), 0.55);
  c.beginPath();
  c.arc(14 * s, 14 * s, 2.4 * s, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = hslStr(hsl('#FAF0EC'), 1);
  c.beginPath();
  c.arc(14 * s, 14 * s, 1.5 * s, 0, Math.PI * 2);
  c.fill();
  return cv.toDataURL();
}

export function paintStroke(w = 46, h = 7, s = 3, color = '#7B52A8') {
  const rng = makeRng('trazo');
  const cv = makeCanvas(w * s, h * s);
  const c = ctx2d(cv);
  const pts = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    pts.push({ x: (3 + t * (w - 6)) * s, y: (h * 0.55 + Math.sin(t * Math.PI * 1.1) * -1.6 + rng.gauss(0, 0.15)) * s });
  }
  for (let k = 0; k < 3; k++) pencil(c, pts, rng, hsl(color), { width: 1.1 * s, alpha: 0.55 });
  return cv.toDataURL();
}
