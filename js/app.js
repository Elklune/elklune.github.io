/* Starafk · navegación y vistas. */
(function (SF) {
  'use strict';

  var app, statusEl, skipEl;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* Búsqueda segura: solo devuelve elementos de nuestras listas, nunca propiedades internas
     de JavaScript (así #constructor o #toString no rompen nada). */
  function find(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id || list[i].alias === id) return list[i];
    return null;
  }

  function currentId() {
    var h = (location.hash || '').slice(1);
    try { return decodeURIComponent(h); } catch (e) { return ''; }
  }

  function bar(active) {
    var shield = '<span class="sh" aria-hidden="true">' + SF.art.shield + '</span>';
    var links = SF.nav.map(function (l) {
      var on = l[0] === active;
      return '<a class="px' + (on ? ' on' : '') + '" href="#' + l[0] + '"' + (on ? ' aria-current="page"' : '') + '>' + esc(l[1]) + '</a>';
    }).join('');
    return '<nav class="bar" aria-label="Principal">' + shield + '<div class="lk">' + links + '</div>' + shield + '</nav>';
  }

  function card(p) {
    return '<article class="card"><div class="meta">' + esc(p.d) + '</div>' +
      '<h2><a href="#' + p.id + '">' + esc(p.t) + '</a></h2>' +
      '<p>' + esc(p.x) + '</p>' +
      '<a class="btn" href="#' + p.id + '" aria-label="Leer: ' + esc(p.t) + '">LEER <span aria-hidden="true">▶</span></a></article>';
  }

  function viewHome() {
    return {
      title: SF.siteTitle,
      html: bar('inicio') +
        '<h1 class="sr">Starafk, el blog de los Klunefans</h1>' +
        '<div class="cols">' +
        '<div class="pic" role="img" aria-label="Ilustración pixelada de un muñeco de nieve con bufanda roja">' + SF.art.snowman + '</div>' +
        '<section class="list" aria-label="Entradas del blog">' + SF.posts.map(card).join('') + '</section>' +
        '</div>'
    };
  }

  function viewPost(p) {
    return {
      title: p.t + ' · Starafk',
      html: bar('inicio') +
        '<a class="btn g" href="#inicio"><span aria-hidden="true">◀</span> Volver</a>' +
        '<article class="card"><div class="meta">' + esc(p.d) + ' · Comunidad</div><h1>' + esc(p.t) + '</h1>' +
        p.b.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</article>'
    };
  }

  function viewSection(s) {
    return {
      title: s.title + ' · Starafk',
      html: bar(s.id) +
        '<article class="card"><h1>' + esc(s.title) + '</h1>' + (s.intro ? '<p>' + esc(s.intro) + '</p>' : '') +
        (s.html || '<p><span aria-hidden="true">🚧</span> Sección en construcción.</p>') + '</article>'
    };
  }

  function route() {
    var id = currentId(), p = find(SF.posts, id), s = p ? null : find(SF.sections, id);
    return p ? viewPost(p) : s ? viewSection(s) : viewHome();
  }

  function render(navigated) {
    var v = route();
    app.innerHTML = v.html;
    document.title = v.title;

    /* centra la opción activa si la barra se desplaza en pantallas pequeñas */
    var lk = app.querySelector('.lk'), on = app.querySelector('.lk a[aria-current]');
    if (lk && on && lk.scrollWidth > lk.clientWidth) {
      lk.scrollLeft = Math.max(0, on.offsetLeft - (lk.clientWidth - on.offsetWidth) / 2);
    }

    if (navigated) {
      window.scrollTo(0, 0);
      if (statusEl) statusEl.textContent = v.title;   /* avisa a lectores de pantalla */
      app.focus({ preventScroll: true });
    }
  }

  function init() {
    app = document.getElementById('app');
    statusEl = document.getElementById('status');
    skipEl = document.getElementById('skip');
    if (!app) return;

    SF.scene.init();
    render(false);                                    /* una sola carga inicial */
    window.addEventListener('hashchange', function () { render(true); });

    if (skipEl) {
      skipEl.addEventListener('click', function (e) {
        e.preventDefault();
        app.focus();
      });
    }
  }

  SF.app = { init: init };
  init();
})(window.SF = window.SF || {});
