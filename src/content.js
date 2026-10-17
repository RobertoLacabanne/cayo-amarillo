// Todo lo editable del regalo vive acá. Cambiar el poema o el orden de las
// flores no requiere tocar ningún otro archivo.
//
// Flores disponibles para "flor":
//   de mamá:  'azalea fucsia', 'azalea rosa', 'azalea blanca',
//             'clavel rosa', 'clavel rojo', 'clavel blanco',
//             'hortensia', 'hortensia rosa'
//   verdes:   'helecho', 'eucalipto', 'paniculata'
//   otras:    'rosa rosada', 'rosa blanca', 'rosa roja', 'rosa amarilla',
//             'gerbera', 'crisantemo', 'fresia lila', 'fresia',
//             'alstroemeria rosa', 'alstroemeria'
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
    { flor: 'azalea fucsia', verso: 'Vos me las enseñaste sin dar clase,' },
    { flor: 'hortensia', verso: 'con las manos ocupadas y el corazón a la vista.' },
    { flor: 'hortensia rosa', verso: 'Si hoy sé cuidar a alguien, es porque te vi.' },
    { flor: 'clavel rosa', verso: 'Si me equivoco y vuelvo a empezar,' },
    { flor: 'azalea rosa', verso: 'es porque nunca dejaste de empezar conmigo.' },
    { flor: 'clavel blanco', verso: 'Por eso hoy te traigo estas flores, una por una,' },
    { flor: 'azalea fucsia', verso: 'como vos juntabas mis días desarmados' },
    { flor: 'clavel rosa', verso: 'y los ponías de nuevo en su lugar.' },
    { flor: 'azalea blanca', verso: 'No alcanzan para devolverte nada,' },
    { flor: 'paniculata', verso: 'pero quería que algo floreciera solo para vos.' },
  ],
};
