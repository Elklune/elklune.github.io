/* Starafk · arte pixelado.
   Cada dibujo se convierte en SVG con muy pocos elementos (un <path> por color).
   Los árboles se definen una sola vez (treeDefs) y se reutilizan con <use>. */
(function (SF) {
  'use strict';

  /* ---------- utilidades ---------- */

  function num(n) { return +n.toFixed(2); }

  /* rects: [x, y, ancho, alto, color]. Agrupa por color respetando el orden de aparición.
     "grow" ensancha un poco cada rectángulo para que no queden rendijas entre píxeles al suavizar. */
  function paths(rects, grow) {
    var e = grow || 0, order = [], map = {};
    rects.forEach(function (r) {
      var c = r[4];
      if (!map[c]) { map[c] = []; order.push(c); }
      map[c].push('M' + num(r[0] - e) + ' ' + num(r[1] - e) + 'h' + num(r[2] + 2 * e) + 'v' + num(r[3] + 2 * e) + 'h-' + num(r[2] + 2 * e) + 'z');
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

  /* ---------- escudo "Kl" (15 x 19) ---------- */

  var K_GLYPH = ['X..X', 'X..X', 'X.X.', 'XX..', 'X.X.', 'X..X', 'X..X'];
  var L_GLYPH = ['XX.', '.X.', '.X.', '.X.', '.X.', '.X.', 'XXX'];
  var SHIELD_PAL = { B: '#14213d', D: '#c98a1b', Y: '#ffd166', H: '#fff3bf', E: '#e8b43c', L: '#1f4fb0' };

  function buildShield() {
    var W = 15, H = 19,
        widths = [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 13, 11, 9, 7, 5, 3, 1],
        inside = [], x, y;
    for (y = 0; y < H; y++) {
      inside[y] = [];
      for (x = 0; x < W; x++) {
        var half = (widths[y] - 1) / 2;
        inside[y][x] = Math.abs(x - 7) <= half && !(y === 0 && (x === 4 || x === 10));  /* corona con 3 puntas */
      }
    }
    function isIn(xx, yy) { return yy >= 0 && yy < H && xx >= 0 && xx < W && inside[yy][xx]; }
    function isOutline(xx, yy) {
      return isIn(xx, yy) && !(isIn(xx - 1, yy) && isIn(xx + 1, yy) && isIn(xx, yy - 1) && isIn(xx, yy + 1));
    }
    var g = [];
    for (y = 0; y < H; y++) {
      g[y] = [];
      for (x = 0; x < W; x++) {
        var c = '.';
        if (isIn(x, y)) {
          if (isOutline(x, y)) c = 'B';
          else if (isOutline(x - 1, y) || isOutline(x + 1, y) || isOutline(x, y - 1) || isOutline(x, y + 1)) c = 'D';
          else c = 'Y';
        }
        g[y][x] = c;
      }
    }
    /* luz arriba a la izquierda y sombra abajo a la derecha */
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
      if (g[y][x] !== 'Y') continue;
      if (y >= 2 && y <= 3 && x >= 2 && x <= 4 && x + y <= 6) g[y][x] = 'H';
      else if (x >= 11 || y >= 14) g[y][x] = 'E';
    }
    /* letras K y l en relieve (con sombra dorada) */
    function stamp(glyph, gx, gy) {
      glyph.forEach(function (row, j) {
        for (var i = 0; i < row.length; i++) if (row.charAt(i) === 'X') g[gy + j][gx + i] = 'L';
      });
    }
    function emboss(glyph, gx, gy) {
      glyph.forEach(function (row, j) {
        for (var i = 0; i < row.length; i++) {
          if (row.charAt(i) !== 'X') continue;
          var sx = gx + i + 1, sy = gy + j + 1;
          if (sy < H && sx < W && g[sy][sx] !== 'L' && 'YHE'.indexOf(g[sy][sx]) > -1) g[sy][sx] = 'D';
        }
      });
    }
    emboss(K_GLYPH, 3, 4); emboss(L_GLYPH, 9, 4);
    stamp(K_GLYPH, 3, 4); stamp(L_GLYPH, 9, 4);
    return g.map(function (r) { return r.join(''); });
  }

  /* ---------- muñeco de nieve ---------- */

  var SNOWMAN = ['....KKKK....', '....KKKK....', '..KKKKKKKK..', '....SSSS....', '...SKSSKS...', '...SSOOSS...', '..RRRRRRRR..', '.B.SSSSSS.B.', 'BB.SSKSSS.BB', '..SSSSSSSS..', '..SSSKSSSS..', '.SSSSSSSSSS.', '.SSGSSSSSSS.', '.SSSSSSSSSS.', '..SSSSSSSS..'];
  var SNOWMAN_PAL = { K: '#14213d', S: '#f4fbff', G: '#cfe3f7', O: '#ff9f1c', R: '#d94f5c', B: '#6b4226' };

  /* ---------- árboles: cuadrícula fina (píxeles pequeños = aspecto más suave) ---------- */

  /* a = pino ancho y esponjoso, b = pino alto y esbelto. Tamaños en píxeles de la cuadrícula. */
  var DESIGNS = {
    a: { vw: 39, vh: 96, tiers: 5, hw: 19, trunkW: 9, trunkH: 15 },
    b: { vw: 31, vh: 104, tiers: 6, hw: 15, trunkW: 7, trunkH: 15 }
  };
  /* sl/s = nieve iluminada, sh/sh2 = nieve en sombra, ed = contorno suave,
     g/gl/gd = ramas verdes (normal, luz, sombra). Tipo 1 = abeto nevado, 2 = abeto helado. */
  var PALETTES = {
    1: { sl: '#fbfdff', s: '#eef6fd', sh: '#c9def2', sh2: '#9fc0e0', ed: '#b6cde4', g: '#2f6b52', gl: '#3f8c66', gd: '#22503e' },
    2: { sl: '#f3faff', s: '#e0f1fc', sh: '#b7d9f1', sh2: '#8bbbe0', ed: '#a3c9e8', g: '#4d8db5', gl: '#6cb0d4', gd: '#376f95' }
  };
  var WOOD = { l: '#8a5a34', m: '#6b4226', d: '#4a2c16', x: '#3a2210' };

  function buildGrid(d, t) {
    var P = PALETTES[t], vw = d.vw, vh = d.vh, cx = (vw - 1) / 2, C = vh - d.trunkH, T = d.tiers, g = [], x, y, k, r, dx;
    for (y = 0; y < vh; y++) { g[y] = []; for (x = 0; x < vw; x++) g[y][x] = null; }

    /* copa: pisos que se solapan; cada uno con una gruesa capa de nieve arriba y ramas verdes asomando debajo */
    var step = C / (T + 0.9), th = Math.round(step * 1.9);
    for (k = 0; k < T; k++) {
      var s = Math.round(k * step),
          e = k === T - 1 ? C - 1 : Math.min(C - 1, s + th - 1),
          bw = d.hw * (0.62 + 0.38 * (k / (T - 1))),
          h = e - s + 1;
      for (r = s; r <= e; r++) {
        var u = (r - s + 1) / h, hw = Math.round(bw * Math.pow(u, 0.72));
        if (k === 0 && r === s) hw = 0;                 /* punta de un solo píxel */
        if (r >= e - 1) hw += 1;                         /* ramas caídas */
        hw = Math.min(hw, cx);
        for (dx = -hw; dx <= hw; dx++) {
          var col = cx + dx, edge = Math.abs(dx) === hw && hw > 1, c, q = hw ? dx / hw : 0,
              snowy = u <= 0.72 || ((col * 5 + k * 3) % 7 < 3 && u <= 0.9);    /* nieve + "flecos" colgando */
          if (!snowy) {
            c = (r === e || edge) ? P.gd : q < -0.1 ? P.gl : q > 0.45 ? P.gd : P.g;
          } else {
            c = edge ? P.ed : q < -0.2 ? P.sl : q < 0.35 ? P.s : q < 0.75 ? P.sh : P.sh2;
          }
          g[r][col] = c;
        }
      }
    }

    /* tronco ancho con luz, sombra y corteza */
    var tw = d.trunkW, x0 = cx - (tw - 1) / 2;
    for (y = C; y < vh; y++) {
      for (x = 0; x < tw; x++) {
        var w = x === 0 ? WOOD.l : x >= tw - 2 ? WOOD.d : WOOD.m;
        if (y === C) w = WOOD.x;
        else if ((y * 3 + x * 5) % 11 === 0) w = WOOD.x;
        g[y][x0 + x] = w;
      }
    }

    /* montoncito de nieve alrededor del pie */
    for (var i = 0; i < 4; i++) {
      var yy = vh - 4 + i, half = Math.round(tw / 2) + 1 + 2 * i;
      for (dx = -half; dx <= half; dx++) {
        var xx = cx + dx;
        if (xx >= 0 && xx < vw) g[yy][xx] = i === 0 ? P.sl : dx > half * 0.4 ? P.sh : P.s;
      }
    }
    return g;
  }

  /* Une celdas iguales en rectángulos (horizontal y verticalmente) para usar muy pocos elementos. */
  function gridRects(g) {
    var out = [], open = {};
    g.forEach(function (row, y) {
      var next = {}, x = 0;
      while (x < row.length) {
        var c = row[x];
        if (c === null) { x++; continue; }
        var s = x;
        while (x < row.length && row[x] === c) x++;
        var key = s + ':' + (x - s) + ':' + c, r = open[key];
        if (r) r[3]++; else { r = [s, y, x - s, 1, c]; out.push(r); }
        next[key] = r;
      }
      open = next;
    });
    return out;
  }

  var defsCache = '';
  /* Ids: t-{diseño}{tipo}{capa}  ->  capa f = delante, k = fondo (más oscura). */
  function treeDefs() {
    if (defsCache) return defsCache;
    var s = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>';
    ['a', 'b'].forEach(function (dk) {
      [1, 2].forEach(function (t) {
        var rects = gridRects(buildGrid(DESIGNS[dk], t));
        ['f', 'k'].forEach(function (layer) {
          var rr = layer === 'k' ? rects.map(function (r) { return [r[0], r[1], r[2], r[3], shade(r[4], 0.8)]; }) : rects;
          s += '<g id="t-' + dk + t + layer + '">' + paths(rr, 0.03) + '</g>';
        });
      });
    });
    defsCache = s + '</defs></svg>';
    return defsCache;
  }

  SF.art = {
    shield: svgFromMap(buildShield(), SHIELD_PAL, 3),
    snowman: svgFromMap(SNOWMAN, SNOWMAN_PAL, 8),
    treeDefs: treeDefs,
    /* vw/vh = cuadrícula del dibujo; wu/hu = píxeles que ocupa cada unidad de tamaño "s" */
    dims: { a: { vw: 39, vh: 96, wu: 17, hu: 48 }, b: { vw: 31, vh: 104, wu: 13.5, hu: 52 } }
  };
})(window.SF = window.SF || {});
