// Armador de links: un link por mamá con ?para=Nombre y ?de=Firma, listo
// para copiar o mandar por WhatsApp.
import '@fontsource/cormorant-garamond/latin-500-italic.css';
import '@fontsource/caveat/latin-500.css';
import './armar.css';

const $ = (s) => document.querySelector(s);
const input = $('#nombre');
const deEl = $('#de');
const linkEl = $('#link');
const wa = $('#wa');
const ver = $('#ver');
const estado = $('#estado');
const base = location.origin + '/';

const limpio = (v) => v.replace(/\s+/g, ' ').trim();

// ?para= con su nombre y ?de= con la firma (vacíos, no van).
function linkPara(nombre, de = deEl.value) {
  const q = new URLSearchParams();
  if (limpio(nombre)) q.set('para', limpio(nombre));
  if (limpio(de)) q.set('de', limpio(de));
  const qs = q.toString().replace(/\+/g, '%20');
  return qs ? `${base}?${qs}` : base;
}

function mensaje(nombre, url) {
  const n = nombre.trim();
  const saludo = n ? `¡Feliz día, ${n}!` : '¡Feliz día!';
  return `${saludo} Te armé un regalito: abrilo y tocá la pantalla varias veces, flor por flor 🌷\n${url}`;
}

function render() {
  const url = linkPara(input.value);
  linkEl.textContent = decodeURIComponent(url).replace(/^https?:\/\//, '');
  wa.href = `https://wa.me/?text=${encodeURIComponent(mensaje(input.value, url))}`;
  ver.href = url;
  estado.textContent = '';
}

$('#copiar').addEventListener('click', async () => {
  const url = linkPara(input.value);
  try {
    await navigator.clipboard.writeText(url);
    estado.textContent = 'Link copiado. Pegalo donde quieras.';
  } catch (e) {
    estado.textContent = 'No pude copiarlo solo: mantené apretado el link de arriba para copiarlo.';
  }
});
$('#form').addEventListener('submit', (e) => {
  e.preventDefault();
  input.blur();
});
input.addEventListener('input', render);
deEl.addEventListener('input', render);
render();
