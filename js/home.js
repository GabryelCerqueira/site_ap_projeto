(function () {
  'use strict';

  function initFiltrosHome() {
    const botoesFiltro = document.querySelectorAll('.botoes-filtro button');
    const cardsAnimais = document.querySelectorAll('.grade-animais .card-animal');

    if (!botoesFiltro.length || !cardsAnimais.length) return;

    cardsAnimais.forEach(card => {
      const nomePetEl = card.querySelector('h3');
      const nomePet = nomePetEl ? nomePetEl.textContent.trim() : '';
      const animalDb = window.PatasDB ? window.PatasDB.getAnimalPorTermo(nomePet) : null;
      const petId = animalDb ? animalDb.id : nomePet;

      const btnFav = document.createElement('button');
      btnFav.type = 'button';
      btnFav.className = 'btn-favorito-pet';
      btnFav.setAttribute('aria-label', `Salvar ${nomePet} nos favoritos`);

      const jaFavorito = window.PatasDB && window.PatasDB.isFavorito(petId);
      if (jaFavorito) btnFav.classList.add('favoritado');
      btnFav.innerHTML = jaFavorito ? '♥' : '♡';

      btnFav.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.PatasDB) {
          const adicionou = window.PatasDB.toggleFavorito(petId);
          btnFav.classList.toggle('favoritado', adicionou);
          btnFav.innerHTML = adicionou ? '♥' : '♡';
          if (window.PatasUI) {
            window.PatasUI.showToast(
              'Favoritos',
              adicionou ? `${nomePet} adicionado aos seus favoritos!` : `${nomePet} removido dos favoritos.`,
              'info',
              2000
            );
          }
        }
      });

      card.style.position = 'relative';
      card.appendChild(btnFav);

      const linkVerFicha = card.querySelector('a.botao');
      if (linkVerFicha) {
        linkVerFicha.href = `/pages/adocao.html?pet=${encodeURIComponent(nomePet)}`;
      }
    });

    botoesFiltro.forEach(botao => {
      botao.addEventListener('click', function () {
        botoesFiltro.forEach(b => b.classList.remove('filtro-ativo'));
        this.classList.add('filtro-ativo');

        const filtroTexto = this.textContent.trim().toLowerCase();

        cardsAnimais.forEach(card => {
          const subinfo = card.querySelector('.subinfo')?.textContent.toLowerCase() || '';
          const tagInfo = card.querySelector('.tag-info')?.textContent.toLowerCase() || '';
          const nome = card.querySelector('h3')?.textContent.toLowerCase() || '';

          let visivel = false;

          if (filtroTexto === 'todos') {
            visivel = true;
          } else if (filtroTexto === 'cães' || filtroTexto === 'caes') {
            visivel = subinfo.includes('srd') || subinfo.includes('beagle') || subinfo.includes('labrador') || subinfo.includes('macho') || !subinfo.includes('siamês');
          } else if (filtroTexto === 'gatos') {
            visivel = subinfo.includes('siamês') || subinfo.includes('gata') || subinfo.includes('felin') || nome === 'luna' || nome === 'chica';
          } else if (filtroTexto === 'filhotes') {
            visivel = tagInfo.includes('filhote') || tagInfo.includes('meses') || nome === 'pipoca';
          } else if (filtroTexto === 'especiais') {
            visivel = tagInfo.includes('superação') || nome === 'mel';
          }

          if (visivel) {
            card.classList.remove('oculto');
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.classList.add('oculto');
          }
        });
      });
    });
  }

  function initContadorImpacto() {
    const cardsImpacto = document.querySelectorAll('.grade-impacto .card-impacto h2');
    if (!cardsImpacto.length) return;

    let animado = false;

    const observador = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animado) {
          animado = true;
          cardsImpacto.forEach(el => animarNumero(el));
        }
      });
    }, { threshold: 0.3 });

    const secaoImpacto = document.querySelector('.impacto');
    if (secaoImpacto) observador.observe(secaoImpacto);

    function animarNumero(elemento) {
      const textoOriginal = elemento.textContent;
      const valorFinal = parseInt(textoOriginal.replace(/\D/g, ''), 10);
      if (isNaN(valorFinal)) return;

      const duracao = 1800;
      const inicio = performance.now();

      function atualizar(tempoAtual) {
        const decorrido = tempoAtual - inicio;
        const progresso = Math.min(decorrido / duracao, 1);

        const fator = 1 - Math.pow(1 - progresso, 3);
        const valorAtual = Math.floor(fator * valorFinal);

        elemento.textContent = valorAtual.toLocaleString('pt-BR') + '+';

        if (progresso < 1) {
          requestAnimationFrame(atualizar);
        } else {
          elemento.textContent = valorFinal.toLocaleString('pt-BR') + '+';
        }
      }

      requestAnimationFrame(atualizar);
    }
  }

  function initPlantaoAoVivo() {
    const tagAoVivo = document.querySelector('.card-flutuante .tag-verde');
    if (tagAoVivo) {
      tagAoVivo.classList.add('tag-verde-pulsante');
    }

    const cardFlutuanteP = document.querySelector('.card-flutuante p');
    if (cardFlutuanteP && window.PatasDB) {
      const animais = window.PatasDB.getAnimais();
      const emQuarentena = animais.filter(a => a.status.toLowerCase().includes('quarentena')).length;
      if (emQuarentena > 0) {
        cardFlutuanteP.textContent = `${emQuarentena} animais em triagem clínica hoje`;
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initFiltrosHome();
    initContadorImpacto();
    initPlantaoAoVivo();
  });
})();
