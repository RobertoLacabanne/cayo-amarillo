// Picaflor en acuarela, mirando a la izquierda (el pico apunta a -x), con
// el origen en el centro del cuerpo. Se hornea el cuerpo entero en un sprite
// y el ala aparte, para animarla rápido (se dibuja como abanico borroso).
import { hsl, hslStr } from '../paint/color.js';
import { makeCanvas, ctx2d } from '../paint/canvas.js';
import { paintPetal } from '../paint/petal.js';
import { ribbon } from '../paint/stem.js';
import { tracePoly } from '../paint/brush.js';

const D = Math.PI / 180;
const C = {
  green: { main: hsl('#4E9A78'), deep: hsl('#2C6A50'), edge: hsl('#173F30'), tip: hsl('#8CC4A4') },
  head: { main: hsl('#3F8A68'), deep: hsl('#245C44'), edge: hsl('#143828'), tip: hsl('#7AB896') },
  tail: { main: hsl('#355E4A'), deep: hsl('#22402F'), edge: hsl('#13281C') },
  belly: { main: hsl('#ECE6DA'), deep: hsl('#C4B8AC'), edge: hsl('#8E8278') },
  throat: { main: hsl('#C8306E'), deep: hsl('#8A1A4A'), edge: hsl('#5A0E30'), tip: hsl('#EE76A4') },
  wing: { main: hsl('#B6C6BE'), deep: hsl('#8EA298'), edge: hsl('#5E7468') },
  beak: hsl('#2A2226'),
};

// Lienzo local del pájaro: x ∈ [-40, 34], y ∈ [-24, 22] en unidades de escena.
const BOX = { x0: -40, y0: -24, x1: 34, y1: 22 };

function place(c, s, pet, x, y, rot, sy = 1) {
  c.save();
  c.translate((x - BOX.x0) * s, (y - BOX.y0) * s);
  c.rotate(rot);
  c.scale(1, sy);
  c.drawImage(pet.canvas, -pet.ax, -pet.ay);
  c.restore();
  pet.canvas.width = pet.canvas.height = 1;
}

export function bakeBird(s, seed = 'picaflor') {
  const cv = makeCanvas((BOX.x1 - BOX.x0) * s, (BOX.y1 - BOX.y0) * s);
  const c = ctx2d(cv);
  const pet = (o) => paintPetal({ scale: s, layers: 20, alpha: 0.07, deep: [0.35], liftAmt: 0.55, rim: 1.2, spread: 0.1, baseSpread: 0.25, ...o, seed: seed + o.seed });

  // cola: dos plumas angostas hacia atrás y abajo
  place(c, s, pet({ seed: 't1', L: 16, W: 5, widest: 0.6, base: 0.5, tip: 'point', colors: C.tail }), 12, 3, 104 * D);
  place(c, s, pet({ seed: 't2', L: 14, W: 5, widest: 0.6, base: 0.5, tip: 'point', colors: C.tail }), 12, 4, 122 * D);
  // panza clara (asoma por debajo), cuerpo y cabeza
  place(c, s, pet({ seed: 'p', L: 19, W: 9, widest: 0.5, base: 0.45, tip: 'round', colors: C.belly, liftAmt: 0.4 }), 12, 3, -98 * D);
  place(c, s, pet({ seed: 'b', L: 26, W: 12, widest: 0.42, base: 0.4, tip: 'round', colors: C.green, liftAmt: 0.7 }), 15, 1, -80 * D);
  place(c, s, pet({ seed: 'h', L: 11, W: 10, widest: 0.55, base: 0.5, tip: 'round', colors: C.head }), -4, -1, -66 * D);
  // garganta fucsia: una mancha que brilla bajo el pico
  place(c, s, pet({ seed: 'g', L: 7, W: 6, widest: 0.5, base: 0.5, tip: 'round', colors: C.throat, liftAmt: 0.8, rim: 1 }), -3, 0, -122 * D, 0.8);

  // pico: largo, fino y apenas curvo
  const beak = [];
  for (let k = 0; k <= 10; k++) {
    const t = k / 10;
    beak.push({ x: (-15 - t * 19 - BOX.x0) * s, y: (-3.5 + t * 1.5 + t * t * 1.6 - BOX.y0) * s });
  }
  c.fillStyle = hslStr(C.beak, 0.92);
  tracePoly(c, ribbon(beak, (t) => (1.5 - t * 1.1) * s));
  c.fill();

  // ojo con brillo
  const ex = (-11.5 - BOX.x0) * s, ey = (-5 - BOX.y0) * s;
  c.fillStyle = hslStr(hsl('#1E1618'), 0.95);
  c.beginPath();
  c.arc(ex, ey, 1.35 * s, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = 'rgba(255,255,255,0.9)';
  c.beginPath();
  c.arc(ex - 0.4 * s, ey - 0.45 * s, 0.4 * s, 0, Math.PI * 2);
  c.fill();

  const wing = pet({ seed: 'w', L: 24, W: 8, widest: 0.38, base: 0.3, tip: 'round', colors: C.wing, alpha: 0.06, liftAmt: 0.6, rim: 0.9 });
  return {
    body: { canvas: cv, ax: -BOX.x0 * s, ay: -BOX.y0 * s, s },
    wing: { canvas: wing.canvas, ax: wing.ax, ay: wing.ay, s },
    shoulder: { x: 3, y: -4 },
  };
}
