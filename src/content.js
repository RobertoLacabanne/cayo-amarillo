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
  destinataria: 'vos',
  firma: 'Rober',
  titulo: 'Oficio de madre',
  pista: 'tocá',
  mensajeFinal: `Feliz día,
a vos y a todas las que hacen
de lo de todos los días
un lugar donde quedarse.

Con cariño,`,
  pasos: [
    { flor: 'helecho', verso: 'Ser madre es un oficio sin horario' },
    { flor: 'eucalipto', verso: 'y sin recibo de sueldo,' },
    { flor: 'helecho', verso: 'que se aprende sobre la marcha' },
    { flor: 'azalea fucsia', verso: 'y no se jubila nunca.' },
    { flor: 'hortensia', verso: 'Es saberse de memoria una fiebre,' },
    { flor: 'hortensia rosa', verso: 'adivinar un silencio en la otra pieza,' },
    { flor: 'clavel rosa', verso: 'dejar la última milanesa sin que se note.' },
    { flor: 'azalea rosa', verso: 'Es tener miedo por dos, por tres, por todos,' },
    { flor: 'clavel blanco', verso: 'y sin embargo decir «no pasa nada».' },
    { flor: 'azalea fucsia', verso: 'Es salir un poco movida en todas las fotos' },
    { flor: 'clavel rosa', verso: 'porque siempre estaba alcanzando algo.' },
    { flor: 'azalea blanca', verso: 'Por eso hoy, aunque sea un ratito,' },
    { flor: 'paniculata', verso: 'que alguien te alcance las flores a vos.' },
  ],
};
