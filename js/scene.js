/* Starafk · escena de fondo (bosque nevado y copos).
   Se reconstruye sola al cambiar el tamaño de la ventana o girar el móvil. */
(function (SF) {
  'use strict';

  var forest, snow, lastW = -1, timer = 0;

  function breakpoint(w) { return w < 600 ? 's' : w < 1000 ? 'm' : 'l'; }
  function zone(w) { return w < 600 ? Math.round(w * 0.22) : Math.max(130, w * 0.3); }

  /* Tipo de árbol: 1 = verde nevado, 2 = helado. Con "ice" casi todos son helados. */
  function treeType(k, ice) {
    var t = ice && k % 3 ? 2 : [2, 1, 0, 2, 1, 2, 1][k % 7];
    return t || 1;
  }

  /* Un lado del bosque: 22 árboles. Los más altos pegados al borde y cada vez más bajos
     hacia el centro, formando un triángulo rectángulo. */
  function side(edge, shift, ice, w, z) {
    var out = '', N = 22,
        jitter = [1, 0.7, 0.9, 0.6, 0.8, 1, 0.65, 0.85],
        max = w < 600 ? 6 : 9,
        span = z * 0.8;
    for (var i = 0; i < N; i++) {
      var f = i / (N - 1),
          x = Math.round(-30 + f * span),
          s = Math.max(3, Math.round(max * (1 - 0.82 * f) * (i < 3 ? 1 : jitter[(i + shift) % 8]))),
          fat = i % 4 === 1 ? 1.5 : i % 5 === 3 ? 1.25 : 1,
          bottom = i % 2 ? 40 + (i % 3) * 4 : 22 + (i % 3) * 5,
          design = i % 3 ? 'a' : 'b',
          dim = SF.art.dims[design],
          layer = i % 2 ? 'k' : 'f';
      out += '<svg class="tr" style="' + edge + ':' + x + 'px;bottom:' + bottom + 'px"' +
        ' width="' + Math.round(dim[0] * s * 0.7 * fat) + '" height="' + dim[1] * s * 2 + '"' +
        ' viewBox="0 0 ' + dim[0] + ' ' + dim[1] + '" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
        '<use href="#t-' + design + treeType(i + shift, ice) + layer + '"/></svg>';
    }
    return out;
  }

  /* HTML completo del bosque para un ancho dado (también lo usa la imagen de compartir). */
  function markup(w) {
    var z = zone(w);
    return SF.art.treeDefs() + '<div id="ground"></div>' +
      side('right', 0, false, w, z) + side('left', 3, true, w, z);
  }

  function buildForest(w) {
    if (forest) forest.innerHTML = markup(w);
  }

  function buildSnow(w) {
    if (!snow) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { snow.innerHTML = ''; return; }
    var n = w < 600 ? 22 : w < 1000 ? 32 : 45, h = '';
    for (var k = 0; k < n; k++) {
      var size = k % 3 === 0 ? 6 : 4;
      h += '<i class="f" style="left:' + (Math.random() * 100).toFixed(1) + '%;width:' + size + 'px;height:' + size +
        'px;animation-duration:' + (9 + Math.random() * 10).toFixed(1) + 's;animation-delay:-' +
        (Math.random() * 18).toFixed(1) + 's;opacity:' + (0.6 + Math.random() * 0.4).toFixed(2) + '"></i>';
    }
    snow.innerHTML = h;
  }

  function onResize() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      var w = window.innerWidth;
      if (w === lastW) return;                 /* solo cambió el alto (barra del navegador móvil) */
      var bpChanged = breakpoint(w) !== breakpoint(lastW);
      if (!bpChanged && Math.abs(w - lastW) < 24) return;
      buildForest(w);
      if (bpChanged) buildSnow(w);
      lastW = w;
    }, 150);
  }

  function init() {
    forest = document.getElementById('forest');
    snow = document.getElementById('snow');
    var w = window.innerWidth;
    buildForest(w);
    buildSnow(w);
    lastW = w;
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
  }

  SF.scene = { init: init, markup: markup };
})(window.SF = window.SF || {});
