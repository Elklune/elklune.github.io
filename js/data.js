/* Starafk · contenido del blog.
   Para añadir una entrada o una sección, edita solo este archivo. */
(function (SF) {
  'use strict';

  SF.siteTitle = 'Starafk · El blog de los Klunefans';

  SF.posts = [
    {
      id: 'bienvenidos',
      t: 'Bienvenidos a Starafk',
      d: '16 nov 2026',
      x: 'Starafk nace como un lugar para quienes viven el mundo virtual de verdad: explorar, crear, conocer gente y descansar un rato sin prisa.',
      b: [
        'Starafk es una comunidad abierta a todo el mundo, sin importar cuánto tiempo lleves jugando ni a qué horas te conectes.',
        'Aquí encontrarás noticias de la comunidad, eventos, guías para nuevos miembros y las historias de quienes forman parte de ella.',
        'Este blog es el punto de encuentro: pasa, lee y cuéntanos qué te gustaría ver publicado.'
      ]
    },
    {
      id: 'guia-nuevos',
      t: 'Guía rápida para nuevos miembros',
      d: '15 nov 2026',
      x: 'Este blog es el hogar de la comunidad Starafk, creada por Klune para sus Klunefans.',
      b: [
        'Este blog es para la comunidad de Starafk, creada por Klune para sus Klunefans.',
        'Aquí podrás estar AFK de forma cómoda, compartir todos tus momentos y estar atento a cualquier novedad.',
        '¿Qué puedes hacer? Ver los eventos, descubrir qué usuarios tienen más puntos, leer los comentarios, ver fotos y hasta enterarte de los premios que pueden llegar a ofrecerse.'
      ]
    },
    {
      id: 'tercer-evento',
      t: 'Nuestro tercer evento: Invierno en Starafk',
      d: '14 nov 2026',
      x: 'La estética del invierno llega a Starafk: nieve, luces cálidas y mucho calorcito.',
      b: [
        'Llega el invierno a Starafk y con él una estética que enamora: nieve suave, cielos azulados, bosques de pinos nevados y luces cálidas que invitan a quedarse.',
        'El invierno tiene algo especial: es la época más acogedora del año. Una manta, algo caliente y buena compañía convierten cualquier rato en un plan perfecto, y en Starafk puedes vivirlo estando AFK con total comodidad.',
        'Del 15 de noviembre al 9 de diciembre te esperamos para disfrutarlo juntos, compartir tus mejores momentos y estar atento a las novedades. ¡Ve pensando tu mejor atuendo de invierno, Klunefan!'
      ]
    }
  ];

  /* Lista de secciones permitidas (id = lo que va detrás del # en la URL).
     Cualquier otro valor lleva a la portada. "html" es contenido propio y de confianza. */
  SF.sections = [
    {
      id: 'eventos',
      title: 'Eventos',
      intro: 'Todo lo que pasa en Starafk, de un vistazo.',
      html: '<div class="ev now"><div class="meta">EVENTO ACTUAL</div><h2>❄ Invierno</h2><p>Del 15 de noviembre al 9 de diciembre</p></div><div class="ev"><div class="meta">PRÓXIMO EVENTO</div><h2>✦ Navidad</h2><p>Del 10 de diciembre al 30 de enero</p></div>'
    },
    { id: 'usuarios', title: 'Usuarios', intro: 'Conoce a los miembros de Starafk. Pronto tendremos aquí la lista de la comunidad.' },
    { id: 'comentarios', title: 'Comentarios', intro: 'El rincón para opinar y charlar con el resto de la comunidad. ¡Próximamente!' },
    {
      id: 'normas',
      title: 'Normas',
      intro: 'Las reglas de Starafk:',
      html: '<div class="ev"><h2>1. Respeto</h2></div><div class="ev"><h2>2. Libertad</h2></div><div class="ev"><h2>3. Ausentarse con bondad</h2></div>'
    },
    { id: 'galeria', title: 'Galería', intro: 'Las mejores capturas y momentos de los Klunefans. ¡Pronto verás aquí la galería!' },
    { id: 'avatares', title: 'Avatares', intro: 'Muestra tu avatar y descubre los de otros Klunefans. ¡Próximamente!' },
    { id: 'premios', title: 'Premios', intro: 'Los premios y reconocimientos para los Klunefans más especiales. ¡Muy pronto!' },
    { id: 'contacto', title: 'Contacto', intro: '¿Quieres escribirnos o colaborar con la comunidad? Aquí pondremos cómo hacerlo.' }
  ];

  /* Opciones visibles en la barra (avatares y contacto existen pero no se muestran, como antes). */
  SF.nav = [
    ['inicio', 'Inicio'],
    ['eventos', 'Eventos'],
    ['usuarios', 'Usuarios'],
    ['comentarios', 'Comentarios'],
    ['galeria', 'Galería'],
    ['premios', 'Premios'],
    ['normas', 'Normas']
  ];
})(window.SF = window.SF || {});
