// Qué es cada flor para la composición: cómo se hornea, cuánto "pesa"
// visualmente, en qué capa de profundidad va y dónde puede ubicarse.
import { bakeRose } from '../flowers/rose.js';
import { bakeGerbera } from '../flowers/gerbera.js';
import { bakeChrysanthemum } from '../flowers/chrysanthemum.js';
import { bakeAlstroemeria } from '../flowers/alstroemeria.js';
import { bakeFreesia } from '../flowers/freesia.js';
import { bakeEucalyptus, bakeFern, bakeBabysBreath } from '../flowers/greens.js';
import { bakeAzalea } from '../flowers/azalea.js';
import { bakeCarnation } from '../flowers/carnation.js';
import { bakeHydrangea } from '../flowers/hydrangea.js';
import { hsl } from '../paint/color.js';

// Tamaño general de las flores respecto de la jarra.
export const K = 1.45;

// kind: 'head' = cabeza con tallo desde el punto de atado.
//       'spray' = rama con su propio eje que nace cerca de la boca de la jarra.
export const FLOWERS = {
  'azalea fucsia': {
    kind: 'head', vr: 38 * K, mass: 3.1, depth: 5, focal: 1, dist: [220, 266], stem: hsl('#4E6A38'),
    bake: (o) => bakeAzalea({ ...o, variant: 'fucsia', r: 36 * K }), burst: ['#E5559F', '#F190C2', '#CF3F8C'],
  },
  'azalea rosa': {
    kind: 'head', vr: 38 * K, mass: 3.0, depth: 5, focal: 0.9, dist: [218, 266], stem: hsl('#4E6A38'),
    bake: (o) => bakeAzalea({ ...o, variant: 'rosa', r: 36 * K }), burst: ['#F5A9C6', '#FAD0E0'],
  },
  'azalea blanca': {
    kind: 'head', vr: 38 * K, mass: 2.8, depth: 5, focal: 0.8, dist: [218, 266], stem: hsl('#56703C'),
    bake: (o) => bakeAzalea({ ...o, variant: 'blanca', r: 36 * K }), burst: ['#FBF4F2', '#E2D2DA'],
  },
  hortensia: {
    kind: 'head', vr: 36 * K, mass: 3.4, depth: 4.8, focal: 0.7, dist: [214, 262], stem: hsl('#56703C'),
    bake: (o) => bakeHydrangea({ ...o, variant: 'jardin', r: 38 * K }), burst: ['#9DB4E6', '#B3A2E0', '#E3AECB'],
  },
  'hortensia rosa': {
    kind: 'head', vr: 36 * K, mass: 3.4, depth: 4.8, focal: 0.7, dist: [214, 262], stem: hsl('#56703C'),
    bake: (o) => bakeHydrangea({ ...o, variant: 'rosa', r: 38 * K }), burst: ['#F0A8C4', '#F6CADB'],
  },
  'clavel rosa': {
    kind: 'head', vr: 22 * K, mass: 2.0, depth: 5.2, focal: 0.75, lean: 0.8, dist: [198, 240], center: { x: 0, y: -26 * K }, stem: hsl('#6A8A6A'),
    bake: (o) => bakeCarnation({ ...o, variant: 'rosa', r: 30 * K }), burst: ['#F28CAA', '#F8B8CB'],
  },
  'clavel rojo': {
    kind: 'head', vr: 22 * K, mass: 2.1, depth: 5.2, focal: 0.8, lean: 0.8, dist: [198, 240], center: { x: 0, y: -26 * K }, stem: hsl('#6A8A6A'),
    bake: (o) => bakeCarnation({ ...o, variant: 'rojo', r: 30 * K }), burst: ['#D4243E', '#E5545E'],
  },
  'clavel blanco': {
    kind: 'head', vr: 22 * K, mass: 1.9, depth: 5.2, focal: 0.75, lean: 0.8, dist: [198, 240], center: { x: 0, y: -26 * K }, stem: hsl('#6A8A6A'),
    bake: (o) => bakeCarnation({ ...o, variant: 'blanco', r: 30 * K }), burst: ['#FBF4EF', '#F2B8C8'],
  },
  'rosa roja': {
    kind: 'head', vr: 36 * K, mass: 3.2, depth: 5, focal: 1, dist: [222, 268], stem: hsl('#4E6A38'),
    bake: (o) => bakeRose({ ...o, variant: 'red', r: 34 * K }), burst: ['#A3122B', '#C4303F', '#7C0D2A'],
  },
  'rosa amarilla': {
    kind: 'head', vr: 36 * K, mass: 3.0, depth: 5, focal: 0.9, dist: [218, 268], stem: hsl('#56703C'),
    bake: (o) => bakeRose({ ...o, variant: 'yellow', r: 34 * K }), burst: ['#F6D86B', '#F2B705', '#F08A24'],
  },
  'rosa rosada': {
    kind: 'head', vr: 36 * K, mass: 3.1, depth: 5, focal: 1, dist: [222, 268], stem: hsl('#4E6A38'),
    bake: (o) => bakeRose({ ...o, variant: 'pink', r: 34 * K }), burst: ['#F29AB3', '#D8668A', '#F8C6D3'],
  },
  'rosa blanca': {
    kind: 'head', vr: 36 * K, mass: 2.9, depth: 5, focal: 0.9, dist: [218, 268], stem: hsl('#56703C'),
    bake: (o) => bakeRose({ ...o, variant: 'white', r: 34 * K }), burst: ['#F9F3EA', '#E6D8CC', '#D8C8EE'],
  },
  gerbera: {
    kind: 'head', vr: 40 * K, mass: 3.2, depth: 5, focal: 1, dist: [228, 272], stem: hsl('#6E8A45'),
    bake: (o) => bakeGerbera({ ...o, r: 40 * K }), burst: ['#F4D48E', '#EBB468'],
  },
  crisantemo: {
    kind: 'head', vr: 33 * K, mass: 2.2, depth: 4.6, focal: 0.4, dist: [196, 276], stem: hsl('#5E7A40'),
    bake: (o) => bakeChrysanthemum({ ...o, r: 32 * K }), burst: ['#F6E04E', '#F9EB8C'],
  },
  alstroemeria: {
    kind: 'head', vr: 36 * K, mass: 1.9, depth: 4.4, focal: 0.3, dist: [160, 200], center: { x: 0, y: -32 * K }, stem: hsl('#6F8A45'),
    bake: (o) => bakeAlstroemeria({ ...o, r: 21 * K }), burst: ['#F5CD3C', '#F8DC6A'],
  },
  'alstroemeria rosa': {
    kind: 'head', vr: 36 * K, mass: 1.9, depth: 4.4, focal: 0.3, dist: [160, 200], center: { x: 0, y: -32 * K }, stem: hsl('#6F8A45'),
    bake: (o) => bakeAlstroemeria({ ...o, r: 21 * K, variant: 'rosa' }), burst: ['#F2A9C0', '#F8CDD9'],
  },
  fresia: {
    kind: 'spray', L: 74 * K, mass: 1.3, depth: 5.6, focal: 0, d0: 180, reach: 0.95, stem: hsl('#6E8A40'),
    bake: bakeFreesia, burst: ['#F6A21E', '#F9C24A'],
  },
  'fresia lila': {
    kind: 'spray', L: 74 * K, mass: 1.3, depth: 5.6, focal: 0, d0: 180, reach: 0.95, stem: hsl('#6E8A40'),
    bake: (o) => bakeFreesia({ ...o, variant: 'lila' }), burst: ['#B89AD9', '#D8C8EE'],
  },
  paniculata: {
    kind: 'spray', L: 118 * K, mass: 1.0, depth: 2.6, focal: 0, d0: 128, reach: 1.0, stem: hsl('#8C9A70'),
    bake: bakeBabysBreath, burst: ['#FFFBF1', '#F4EEDD'],
  },
  eucalipto: {
    kind: 'spray', L: 310, mass: 1.6, depth: 1, focal: 0, d0: 52, reach: 1.0, stem: hsl('#8A4A3A'),
    bake: bakeEucalyptus, burst: ['#93AAA2', '#A3B2A8'],
  },
  helecho: {
    kind: 'spray', L: 160 * K, mass: 1.4, depth: 0, focal: 0, d0: 50, reach: 1.0, stem: hsl('#4E6A36'),
    bake: bakeFern, burst: ['#4F6E3E', '#7A944E'],
  },
};

export function flowerDef(name) {
  const key = String(name || '').trim().toLowerCase();
  const def = FLOWERS[key];
  if (!def) {
    console.warn(`Flor desconocida "${name}", uso crisantemo.`);
    return { name: 'crisantemo', ...FLOWERS.crisantemo };
  }
  return { name: key, ...def };
}
