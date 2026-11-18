/* Starafk · arte pixelado.
   Cada dibujo se convierte en SVG con muy pocos elementos (un <path> por color).
   Los árboles se definen una sola vez (treeDefs) y se reutilizan con <use>. */
(function (SF) {
  'use strict';

  /* ---------- utilidades ---------- */

  /* rects: [x, y, ancho, alto, color]. Agrupa por color respetando el orden de aparición. */
  function paths(rects) {
    var order = [], map = {};
    rects.forEach(function (r) {
      var c = r[4];
      if (!map[c]) { map[c] = []; order.push(c); }
      map[c].push('M' + r[0] + ' ' + r[1] + 'h' + r[2] + 'v' + r[3] + 'h-' + r[2] + 'z');
    });
    return order.map(function (c) {
      return '<path fill="' + c + '" d="' + map[c].join('') + '"/>';
    }).join('');
  }

  /* Convierte un mapa de caracteres en rectángulos, fusionando píxeles contiguos de la misma fila. */
  function runs(map, pal) {
    var out = [];
    map.forEach(function (row, y) {
      var x = 0;
      while (x < row.length) {
        var ch = row.charAt(x);
        if (ch === '.') { x++; continue; }
        var s = x;
        while (x < row.length && row.charAt(x) === ch) x++;
        out.push([s, y, x - s, 1, pal[ch]]);
      }
    });
    return out;
  }

  function svgFromMap(map, pal, scale) {
    return '<svg width="' + map[0].length * scale + '" height="' + map.length * scale +
      '" viewBox="0 0 ' + map[0].length + ' ' + map.length +
      '" aria-hidden="true" focusable="false">' + paths(runs(map, pal)) + '</svg>';
  }

  function shade(hex, k) {
    var n = parseInt(hex.slice(1), 16),
        r = Math.round((n >> 16 & 255) * k),
        g = Math.round((n >> 8 & 255) * k),
        b = Math.round((n & 255) * k);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  /* ---------- escudo "Kl" y muñeco de nieve ---------- */

  var SHIELD = ['BBB.BBBBB.BBB', 'BDDBDDDDDBDDB', 'BDYYYYYYYYYDB', 'BDYHYYYYYYYDB', 'BDYYYYYYYYYDB', 'BDYLYLYLLYYDB', 'BDYLLYYYLYYDB', 'BDYLYYYYLYYDB', 'BDYLLYYYLYYDB', 'BDYLYLYLLLYDB', 'BDYYYYYYYYYDB', '.BDYYYYYYYDB.', '.BDYYYYYYYDB.', '..BDYYYYYDB..', '...BDYYYDB...', '....BDDDB....', '.....BBB.....'];
  var SHIELD_PAL = { B: '#14213d', D: '#c98a1b', H: '#fff3bf', Y: '#ffd166', L: '#1f4fb0' };

  var SNOWMAN = ['....KKKK....', '....KKKK....', '..KKKKKKKK..', '....SSSS....', '...SKSSKS...', '...SSOOSS...', '..RRRRRRRR..', '.B.SSSSSS.B.', 'BB.SSKSSS.BB', '..SSSSSSSS..', '..SSSKSSSS..', '.SSSSSSSSSS.', '.SSGSSSSSSS.', '.SSSSSSSSSS.', '..SSSSSSSS..'];
  var SNOWMAN_PAL = { K: '#14213d', S: '#f4fbff', G: '#cfe3f7', O: '#ff9f1c', R: '#d94f5c', B: '#6b4226' };

  /* ---------- árboles ---------- */

  /* a = pino ancho, b = pino esbelto. Cada fila es [columna inicial, columna final]. */
  var ROWS_A = [[6, 6], [5, 7], [4, 8], [5, 7], [4, 8], [3, 9], [2, 10], [4, 8], [3, 9], [2, 10], [1, 11], [3, 9], [2, 10], [1, 11], [0, 12]];
  var ROWS_B = [[5, 5], [5, 5], [4, 6], [4, 6], [3, 7], [4, 6], [3, 7], [3, 7], [2, 8], [3, 7], [2, 8], [2, 8], [1, 9], [2, 8], [1, 9], [0, 10], [0, 10]];
  var DESIGNS = { a: { rows: ROWS_A, w: 13, trunk: 9 }, b: { rows: ROWS_B, w: 11, trunk: 9 } };

  /* 1 = verde nevado, 2 = helado */
  var TYPES = { 1: ['#1f5a3a', '#2f7d4f'], 2: ['#7fb3d6', '#bfe0f5'] };
  var SNOW = '#f4fbff', BARK = '#6b4226', BARK_L = '#835632', BARK_D = '#4a2c16';

  function treeRects(d, t) {
    var R = d.rows, W = d.w, TR = d.trunk, c = TYPES[t], m = (W - 1) / 2, y0 = R.length, o = [];
    function rc(x, y, w, h, f) { if (w > 0) o.push([x, y, w, h, f]); }

    R.forEach(function (r, i) {
      var n = r[1] - r[0] + 1, h = Math.ceil(n / 2);
      rc(r[0], i, h, 1, c[0]);
      rc(r[0] + h, i, n - h, 1, c[1]);
      if (i > 0 && (r[0] < R[i - 1][0] || (t === 1 && i % 2))) rc(r[0] + 1, i, n - 2, 1, SNOW);
      if (t === 2 && i > 0 && r[0] < R[i - 1][0]) { rc(r[0], i, 1, 1, SNOW); rc(r[1], i, 1, 1, SNOW); }
    });

    /* tronco (5 de ancho) con luz, sombra, corteza y raíces */
    rc(m - 2, y0, 5, TR - 1, BARK);
    rc(m - 2, y0, 1, TR - 1, BARK_L);
    rc(m + 2, y0, 1, TR - 1, BARK_D);
    rc(m - 3, y0 + TR - 1, 7, 1, BARK);
    rc(m - 3, y0 + TR - 1, 1, 1, BARK_L);
    rc(m + 3, y0 + TR - 1, 1, 1, BARK_D);
    for (var k = 1; k < TR - 2; k += 3) {
      rc(m, y0 + k, 1, 1, BARK_D);
      rc(m - 1, y0 + k + 1, 1, 1, BARK_D);
      rc(m + 1, y0 + k + 2, 1, 1, BARK_D);
    }
    return o;
  }

  var defsCache = '';
  /* Ids: t-{diseño}{tipo}{capa}  ->  capa f = delante, k = fondo (más oscura). */
  function treeDefs() {
    if (defsCache) return defsCache;
    var s = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>';
    ['a', 'b'].forEach(function (dk) {
      [1, 2].forEach(function (t) {
        ['f', 'k'].forEach(function (layer) {
          var rects = treeRects(DESIGNS[dk], t);
          if (layer === 'k') rects = rects.map(function (r) { return [r[0], r[1], r[2], r[3], shade(r[4], 0.8)]; });
          s += '<g id="t-' + dk + t + layer + '">' + paths(rects) + '</g>';
        });
      });
    });
    defsCache = s + '</defs></svg>';
    return defsCache;
  }

  SF.art = {
    shield: svgFromMap(SHIELD, SHIELD_PAL, 3),
    snowman: svgFromMap(SNOWMAN, SNOWMAN_PAL, 8),
    treeDefs: treeDefs,
    dims: { a: [13, 24], b: [11, 26] }   /* ancho y alto (en píxeles lógicos) de cada diseño */
  };
})(window.SF = window.SF || {});
