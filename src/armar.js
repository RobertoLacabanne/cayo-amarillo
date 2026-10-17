// Armador de links: un link por mamá con ?para=Nombre, listo para copiar o
// mandar por WhatsApp.
import '@fontsource/cormorant-garamond/latin-500-italic.css';
import '@fontsource/caveat/latin-500.css';
import './armar.css';

const $ = (s) => document.querySelector(s);
const input = $('#nombre');
const linkEl = $('#link');
const wa = $('#wa');
const ver = $('#ver');
const estado = $('#estado');
const base = location.origin + '/';

function linkPara(nombre) {
  const n = nombre.replace(/\s+/g, ' ').trim();
  return n ? `${base}?para=${encodeURIComponent(n)}` : base;
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
render();
