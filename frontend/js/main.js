(function () {
  'use strict';

  function initMenuMobile() {
    const nav = document.querySelector('body > header nav');
    if (!nav) return;

    const listaLinks = nav.querySelector('ul');
    if (!listaLinks) return;

    if (nav.querySelector('.btn-menu-mobile')) return;

    const btnMobile = document.createElement('button');
    btnMobile.type = 'button';
    btnMobile.className = 'btn-menu-mobile';
    btnMobile.setAttribute('aria-label', 'Abrir menu de navegação');
    btnMobile.setAttribute('aria-expanded', 'false');
    btnMobile.innerHTML = '<span></span><span></span><span></span>';

    nav.insertBefore(btnMobile, listaLinks);

    btnMobile.addEventListener('click', () => {
      const estaAberto = listaLinks.classList.toggle('menu-aberto');
      btnMobile.classList.toggle('aberto', estaAberto);
      btnMobile.setAttribute('aria-expanded', estaAberto ? 'true' : 'false');
    });

    listaLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        listaLinks.classList.remove('menu-aberto');
        btnMobile.classList.remove('aberto');
        btnMobile.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) {
        listaLinks.classList.remove('menu-aberto');
        btnMobile.classList.remove('aberto');
        btnMobile.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function destacarLinkAtivo() {
    const pathAtual = window.location.pathname.toLowerCase();
    const links = document.querySelectorAll('body > header ul li a');

    links.forEach(link => {
      link.classList.remove('nav-ativo');
      const href = link.getAttribute('href') ? link.getAttribute('href').toLowerCase() : '';

      const isHome = (pathAtual.endsWith('/') || pathAtual.endsWith('/index.html') || pathAtual.endsWith('/principal.html')) &&
                     (href.includes('index.html') || href.includes('principal.html') || href === '/');

      const isPagina = href && pathAtual.endsWith(href.replace('../', '').replace('/', ''));

      if (isHome || isPagina) {
        link.classList.add('nav-ativo');
      }
    });
  }

  function normalizarLinks() {

    const links = document.querySelectorAll('a[href^="/"]');
    const isLocalFile = window.location.protocol === 'file:';

    const isSubdir = window.location.pathname.includes('/pages/') || window.location.pathname.includes('/portifolios/');
    const prefixo = isSubdir ? '../' : './';

    links.forEach(link => {
      const hrefOriginal = link.getAttribute('href');

      if (hrefOriginal.startsWith('//') || hrefOriginal.startsWith('http')) return;

      if (isLocalFile || window.location.pathname.includes('/site_ap_projeto/')) {
        const caminhoSemBarra = hrefOriginal.replace(/^\//, '');
        link.setAttribute('href', prefixo + caminhoSemBarra);
      }
    });

    if (isLocalFile || window.location.pathname.includes('/site_ap_projeto/')) {
      document.querySelectorAll('img[src^="/"]').forEach(img => {
        const srcOriginal = img.getAttribute('src');
        img.setAttribute('src', prefixo + srcOriginal.replace(/^\//, ''));
      });
    }
  }

  function initScrollSuave() {
    document.querySelectorAll('a[href^="#"]').forEach(ancora => {
      ancora.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;

        const alvo = document.querySelector(href);
        if (alvo) {
          e.preventDefault();
          alvo.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMenuMobile();
    destacarLinkAtivo();
    normalizarLinks();
    initScrollSuave();
  });
})();
