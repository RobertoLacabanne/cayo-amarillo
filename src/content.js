// Todo lo editable del regalo vive acá. Cambiar el poema o el orden de las
// flores no requiere tocar ningún otro archivo.
//
// Flores disponibles para "flor":
//   'helecho', 'eucalipto', 'rosa rosada', 'rosa blanca', 'rosa roja',
//   'rosa amarilla', 'gerbera', 'crisantemo', 'fresia lila', 'fresia',
//   'alstroemeria rosa', 'alstroemeria', 'paniculata'
// Funciona con 6 a 16 pasos. Sugerencia de orden: verdes, flores grandes,
// medianas y al final paniculata.
//
// Lo que va entre corchetes se ve en otro color hasta que lo reemplaces.

export default {
  destinataria: 'mamá',
  firma: '[TU NOMBRE]',
  titulo: 'Lo que florece',
  pista: 'tocá',
  mensajeFinal: `Feliz día, mamá.
Gracias por la mesa puesta,
por la paciencia que no se ve
y por quererme también
cuando no era fácil.

Con todo mi amor,`,
  pasos: [
    { flor: 'helecho', verso: 'Mamá, hay cosas que no se aprenden en ningún lado:' },
    { flor: 'eucalipto', verso: 'soplar la sopa, esperar despierta,' },
    { flor: 'helecho', verso: 'decir «abrigate» como quien dice «te quiero».' },
    { flor: 'rosa rosada', verso: 'Vos me las enseñaste sin dar clase,' },
    { flor: 'gerbera', verso: 'con las manos ocupadas y el corazón a la vista.' },
    { flor: 'rosa blanca', verso: 'Si hoy sé cuidar a alguien, es porque te vi.' },
    { flor: 'fresia lila', verso: 'Si me equivoco y vuelvo a empezar,' },
    { flor: 'rosa rosada', verso: 'es porque nunca dejaste de empezar conmigo.' },
    { flor: 'alstroemeria rosa', verso: 'Por eso hoy te traigo estas flores, una por una,' },
    { flor: 'rosa blanca', verso: 'como vos juntabas mis días desarmados' },
    { flor: 'fresia lila', verso: 'y los ponías de nuevo en su lugar.' },
    { flor: 'crisantemo', verso: 'No alcanzan para devolverte nada,' },
    { flor: 'paniculata', verso: 'pero quería que algo floreciera solo para vos.' },
  ],
};
