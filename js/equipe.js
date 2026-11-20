(function () {
  'use strict';

  function initMatrizInterativa() {
    const cardsIntegrantes = document.querySelectorAll('.perfis-integrantes article');
    const linhasMatriz = document.querySelectorAll('.matriz-atribuicoes tbody tr');

    if (!cardsIntegrantes.length || !linhasMatriz.length) return;

    cardsIntegrantes.forEach(card => {
      const nomeCompleto = card.querySelector('h3')?.textContent.trim() || '';
      const primeiroNome = nomeCompleto.split(' ')[0].toLowerCase();

      card.style.cursor = 'pointer';
      card.title = `Clique para ver as entregas de ${nomeCompleto} na tabela de atribuições`;

      card.addEventListener('click', () => {
        let encontrou = false;

        linhasMatriz.forEach(linha => {
          const textoLinha = linha.textContent.toLowerCase();
          if (textoLinha.includes(primeiroNome)) {
            linha.style.backgroundColor = '#eff4ff';
            linha.style.fontWeight = 'bold';
            linha.style.transition = 'background-color 0.3s ease';
            if (!encontrou) {
              linha.scrollIntoView({ behavior: 'smooth', block: 'center' });
              encontrou = true;
            }
          } else {
            linha.style.backgroundColor = '';
            linha.style.fontWeight = 'normal';
          }
        });

        if (window.PatasUI) {
          window.PatasUI.showToast(
            'Matriz de Responsabilidades',
            `Destacando entregas acadêmicas de ${nomeCompleto}`,
            'info',
            2500
          );
        }
      });
    });

    linhasMatriz.forEach(linha => {
      linha.addEventListener('mouseenter', () => {
        const textoLinha = linha.textContent.toLowerCase();

        cardsIntegrantes.forEach(card => {
          const nome = card.querySelector('h3')?.textContent.toLowerCase() || '';
          const primeiroNome = nome.split(' ')[0];

          if (textoLinha.includes(primeiroNome)) {
            card.style.boxShadow = '0 12px 28px rgba(0, 86, 69, 0.25)';
            card.style.borderColor = '#005645';
          } else {
            card.style.boxShadow = '';
            card.style.borderColor = '';
          }
        });
      });

      linha.addEventListener('mouseleave', () => {
        cardsIntegrantes.forEach(card => {
          card.style.boxShadow = '';
          card.style.borderColor = '';
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMatrizInterativa();
  });
})();
