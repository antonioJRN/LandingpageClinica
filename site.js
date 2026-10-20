/* Clínica Sorrir Mais · comportamento da página.
   Tudo que a clínica precisa editar está em CONFIG. */
var CONFIG = {
  // WhatsApp com país e DDD, só dígitos (é o número da fachada: (77) 99999-4451).
  whatsapp: "5577999994451",
  instagram: "https://www.instagram.com/clinicasorrirmais__/",
  rota: "https://maps.app.goo.gl/ZcBjyYoFXbnJE72ZA",
  // Opcional. Ex.: "Rua Exemplo, 123, Centro · Macaúbas, BA"
  endereco: "",
  horarios: [["Segunda a sexta", "07h30 às 18h00"], ["Sábado", "07h00 às 12h00"]],
  // Exigido pelo CFO em anúncios. Ex.: "Responsável técnico: Dr. Nome · CRO-BA 00000"
  responsavel: "",
  mensagemPadrao: "Olá! Vim pelo site e quero marcar uma avaliação."
};

(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function waLink(texto) {
    var num = String(CONFIG.whatsapp || '').replace(/\D/g, '');
    return 'https://wa.me/' + num + '?text=' + encodeURIComponent(texto);
  }

  /* ---------------------------------------------------------- config -- */
  function q(sel) { return document.querySelector(sel); }

  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = waLink(CONFIG.mensagemPadrao);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  if (CONFIG.endereco) q('[data-config="endereco"]').textContent = CONFIG.endereco;

  var dl = q('[data-config="horarios"]');
  CONFIG.horarios.forEach(function (h) {
    var dt = document.createElement('dt'); dt.textContent = h[0];
    var dd = document.createElement('dd'); dd.textContent = h[1];
    dl.append(dt, dd);
  });

  q('[data-config="rota"]').href = CONFIG.rota;
  q('[data-config="instagram"]').href = CONFIG.instagram;

  var resp = q('[data-config="responsavel"]');
  if (CONFIG.responsavel) { resp.textContent = CONFIG.responsavel; resp.hidden = false; }

  /* --------------------------------------------- antes e depois -- */
  var CASOS = [
    { antes: 'assets/fotos/caso1-antes.webp', depois: 'assets/fotos/caso1-depois.webp', w: 610, h: 290,
      altAntes: 'Antes: dentes da frente desgastados, com bordas irregulares.',
      altDepois: 'Depois: sorriso com dentes da frente reconstruídos, proporção e brilho uniformes.',
      legenda: 'Desgastes associados ao bruxismo, com proporção e contorno do sorriso devolvidos. Caso do Dr. Matheus Leão.' },
    { antes: 'assets/fotos/caso2-antes.webp', depois: 'assets/fotos/caso2-depois.webp', w: 555, h: 260,
      altAntes: 'Antes: dentes da frente escurecidos e manchados.',
      altDepois: 'Depois: dentes brancos, alinhados e uniformes.',
      legenda: 'Dentes escurecidos e manchados, transformados em um sorriso claro e uniforme. Caso da Dra. Élida Ferreira.' }
  ];
  var quadro = q('.compara__quadro');
  var range = q('.compara__range');
  var imgAntes = q('.compara__antes'), imgDepois = q('.compara__depois'), legenda = q('.compara__legenda');
  function posiciona(v) { quadro.style.setProperty('--pos', v + '%'); }
  range.addEventListener('input', function () { posiciona(range.value); });
  document.querySelectorAll('[data-caso]').forEach(function (b) {
    b.addEventListener('click', function () {
      var c = CASOS[+b.getAttribute('data-caso')];
      document.querySelectorAll('[data-caso]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      imgAntes.src = c.antes; imgAntes.alt = c.altAntes;
      imgDepois.src = c.depois; imgDepois.alt = c.altDepois;
      quadro.style.aspectRatio = c.w + ' / ' + c.h;
      legenda.textContent = c.legenda;
      range.value = 50; posiciona(50);
    });
  });
  // na primeira vez que aparece, a linha varre o sorriso uma vez
  if (!reduce && 'IntersectionObserver' in window) {
    var varreu = false;
    new IntersectionObserver(function (es, obs) {
      if (varreu || !es[0].isIntersecting) return;
      varreu = true; obs.disconnect();
      var t0 = performance.now();
      (function anda(t) {
        var k = Math.min(1, (t - t0) / 1600);
        var e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        var v = 50 + Math.sin(e * Math.PI * 2) * 34;
        range.value = Math.round(v); posiciona(v.toFixed(1));
        if (k < 1) requestAnimationFrame(anda);
      })(t0);
    }, { threshold: 0.6 }).observe(quadro);
  }

  /* -------------------------------------------- o sorriso final (SVG) -- */
  var NS = 'http://www.w3.org/2000/svg';
  var svgSorriso = q('.sorriso svg');
  (function montaSorriso() {
    var cx = 320, cy = -250, R = 380, n = 12, a0 = -40, a1 = 40;
    function pt(deg, r) { var t = deg * Math.PI / 180; return [cx + r * Math.sin(t), cy + r * Math.cos(t)]; }
    var g1 = pt(a0 - 5, R - 6), g2 = pt(a1 + 5, R - 6);
    var gengiva = document.createElementNS(NS, 'path');
    gengiva.setAttribute('d', 'M' + g1[0] + ' ' + g1[1] + ' A' + (R - 6) + ' ' + (R - 6) + ' 0 0 0 ' + g2[0] + ' ' + g2[1]);
    gengiva.setAttribute('fill', 'none');
    gengiva.setAttribute('stroke', '#C9757E');
    gengiva.setAttribute('stroke-opacity', '0.55');
    gengiva.setAttribute('stroke-width', '26');
    gengiva.setAttribute('stroke-linecap', 'round');
    svgSorriso.appendChild(gengiva);

    for (var i = 0; i < n; i++) {
      var deg = a0 + (a1 - a0) * (i / (n - 1));
      var p = pt(deg, R);
      var s = 2.5 - Math.abs(deg) / 40 * 0.9;
      var ordem = Math.abs(i - (n - 1) / 2) - 0.5;   // acende do centro para as pontas
      var g = document.createElementNS(NS, 'g');
      g.setAttribute('transform', 'translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ') rotate(' + (-deg).toFixed(1) + ') scale(' + s.toFixed(2) + ')');
      var off = document.createElementNS(NS, 'use');
      off.setAttribute('href', '#incisivo'); off.setAttribute('fill', '#5B5A4B');
      var on = document.createElementNS(NS, 'use');
      on.setAttribute('href', '#incisivo'); on.setAttribute('fill', '#F2F0E9');
      on.setAttribute('class', 'd-on'); on.style.setProperty('--o', (ordem * 2).toFixed(1));
      g.append(off, on);
      svgSorriso.appendChild(g);
    }
    var brilho = document.createElementNS(NS, 'g');
    brilho.setAttribute('class', 's-final');
    brilho.setAttribute('fill', '#F2F0E9');
    [[372, 150, 2.6], [404, 118, 1.3], [250, 132, 1.6]].forEach(function (b) {
      var u = document.createElementNS(NS, 'use');
      u.setAttribute('href', '#brilho');
      u.setAttribute('transform', 'translate(' + b[0] + ' ' + b[1] + ') scale(' + b[2] + ')');
      brilho.appendChild(u);
    });
    svgSorriso.appendChild(brilho);
  })();

  /* -------------------------------------------- mensagem do WhatsApp -- */
  var form = q('.msg');
  var nome = form.querySelector('[name="nome"]');
  var balao = form.querySelector('.balao__txt');
  var chipsTrat = form.querySelector('[data-chips="trat"]');
  var chipsPer = form.querySelector('[data-chips="periodo"]');

  function lista(itens) {
    if (itens.length < 2) return itens.join('');
    return itens.slice(0, -1).join(', ') + ' e ' + itens[itens.length - 1];
  }
  function valores(box) {
    return Array.prototype.filter.call(box.querySelectorAll('.chip'), function (c) {
      return c.getAttribute('aria-pressed') === 'true';
    }).map(function (c) { return c.getAttribute('data-v'); });
  }
  function mensagem() {
    var n = nome.value.trim();
    var t = valores(chipsTrat).filter(Boolean);
    var per = valores(chipsPer)[0];
    var m = 'Olá!' + (n ? ' Me chamo ' + n + '.' : '') + ' Vim pelo site e quero marcar ';
    m += t.length ? 'uma consulta para: ' + lista(t) + '.' : 'uma avaliação.';
    if (per) m += '\n' + per;
    return m;
  }
  function atualiza() { balao.textContent = mensagem(); }

  function sincronizaCards() {
    var sel = valores(chipsTrat);
    document.querySelectorAll('.trat').forEach(function (card) {
      card.querySelector('.chip-btn').setAttribute('aria-pressed', String(sel.indexOf(card.getAttribute('data-trat')) > -1));
    });
  }

  form.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (!chip) return;
    var box = chip.parentElement;
    var on = chip.getAttribute('aria-pressed') !== 'true';
    if (box.hasAttribute('data-single')) {
      box.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      on = true;
    }
    chip.setAttribute('aria-pressed', String(on));
    sincronizaCards();
    atualiza();
  });

  document.querySelectorAll('.trat .chip-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var v = btn.closest('.trat').getAttribute('data-trat');
      var chip = chipsTrat.querySelector('[data-v="' + v + '"]');
      var on = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', String(on));
      if (chip) chip.setAttribute('aria-pressed', String(on));
      atualiza();
    });
  });

  nome.addEventListener('input', atualiza);
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    window.open(waLink(mensagem()), '_blank', 'noopener');
  });
  atualiza();

  /* ----------------------------------- arcada, camadas, sorriso: scroll -- */
  var secs = Array.prototype.slice.call(document.querySelectorAll('[data-arcada-sec]'));
  var dentes = {};
  document.querySelectorAll('[data-arcada]').forEach(function (a) { dentes[a.getAttribute('data-arcada')] = a; });
  var heroSec = q('#inicio');
  var camadasSec = q('#camadas'), camadasStage = camadasSec.querySelector('.camadas');
  var marcarSec = q('#marcar');
  var atual = -1, camadaAtual = null, tick = false;

  function brilha(a) {
    a.classList.add('is-brilho');
    setTimeout(function () { a.classList.remove('is-brilho'); }, 900);
  }

  function frame() {
    tick = false;
    var vh = window.innerHeight;
    var fim = window.scrollY + vh >= document.documentElement.scrollHeight - 4;

    var idx = 0;
    for (var i = 0; i < secs.length; i++) {
      if (secs[i].getBoundingClientRect().top <= vh * 0.45) idx = i;
    }
    if (fim) idx = secs.length - 1;
    if (idx !== atual) {
      secs.forEach(function (s, j) {
        var a = dentes[s.id];
        var eraLimpo = a.classList.contains('is-limpo');
        a.classList.toggle('is-limpo', j < idx);
        a.classList.toggle('is-aqui', j === idx);
        if (j === idx) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
        if (j < idx && !eraLimpo) brilha(a);
      });
      atual = idx;
    }

    // a abertura não é um ato do engine: o progresso dela vem da própria rolagem
    if (!reduce) heroSec.style.setProperty('--sc-p', Math.min(1, Math.max(0, window.scrollY / heroSec.offsetHeight)).toFixed(3));

    var p = parseFloat(camadasSec.style.getPropertyValue('--sc-p')) || 0;
    var c = p < 0.2 ? '' : p < 0.4 ? 'esmalte' : p < 0.58 ? 'dentina' : p < 0.78 ? 'polpa' : 'raiz';
    if (c !== camadaAtual) { camadasStage.setAttribute('data-camada', c); camadaAtual = c; }

    if (!reduce) {
      var r = marcarSec.getBoundingClientRect();
      var cp = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.8)));
      marcarSec.style.setProperty('--close-p', cp.toFixed(3));
    }
  }
  function agenda() { if (!tick) { tick = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', agenda, { passive: true });
  window.addEventListener('resize', agenda);

  /* ------------------------------------------ profundidade no ponteiro -- */
  var hero = q('.hero');
  if (!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var mx = 0, my = 0, tx = 0, ty = 0, rodando = false;
    function passo() {
      mx += (tx - mx) * 0.08; my += (ty - my) * 0.08;
      hero.style.setProperty('--mx', mx.toFixed(3));
      hero.style.setProperty('--my', my.toFixed(3));
      if (Math.abs(tx - mx) > 0.002 || Math.abs(ty - my) > 0.002) requestAnimationFrame(passo); else rodando = false;
    }
    hero.addEventListener('pointermove', function (e) {
      tx = e.clientX / window.innerWidth * 2 - 1;
      ty = e.clientY / window.innerHeight * 2 - 1;
      if (!rodando) { rodando = true; requestAnimationFrame(passo); }
    });
  }

  ScrollCraft.mount(document.body);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(agenda);
  agenda();
})();
