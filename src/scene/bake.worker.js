// Worker de horneado: pinta fuera del hilo principal y devuelve
// ImageBitmaps transferibles (sin copias).
import { bakeItem, serialize, withFlat } from './bakeItem.js';
import { bakeBow, bakeLoosePetals, RAIN } from './jarra.js';

const toBitmap = (c) => c.transferToImageBitmap();

self.onmessage = (e) => {
  const { id, type, lite, px } = e.data;
  try {
    if (type === 'item') {
      const { out, transfer } = serialize(withFlat(bakeItem(lite, px), lite, px), toBitmap);
      self.postMessage({ id, ok: true, data: out }, transfer);
    } else if (type === 'final') {
      const b = bakeBow(px);
      const bow = { ...b, band: { ...b.band, canvas: toBitmap(b.band.canvas) }, bow: { ...b.bow, canvas: toBitmap(b.bow.canvas) } };
      const rain = bakeLoosePetals(px, RAIN, 'lluvia').map((r) => ({ ...r, canvas: toBitmap(r.canvas) }));
      const transfer = [bow.band.canvas, bow.bow.canvas, ...rain.map((r) => r.canvas)];
      self.postMessage({ id, ok: true, data: { bow, rain } }, transfer);
    }
  } catch (err) {
    self.postMessage({ id, ok: false, error: String(err && err.stack || err) });
  }
};
