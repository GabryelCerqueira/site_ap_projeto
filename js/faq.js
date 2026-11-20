(function () {
  'use strict';

  function initBuscaFaq() {
    const formBusca = document.querySelector('.hero-faq form');
    const inputBusca = document.getElementById('busca-faq');
    const secaoDuvidas = document.querySelector('.sanfona-duvidas article');
    const todosDetails = document.querySelectorAll('.sanfona-duvidas details');

    if (!inputBusca || !todosDetails.length) return;

    const containerDuvidas = document.querySelector('.sanfona-duvidas');
    let btnToggleTodos = null;
    if (containerDuvidas && secaoDuvidas) {
      const divControles = document.createElement('div');
      divControles.style.display = 'flex';
      divControles.style.justifyContent = 'space-between';
      divControles.style.alignItems = 'center';
      divControles.style.marginBottom = '16px';

      divControles.innerHTML = `
        <span id="faq-contador-resultados" style="font-size: 13px; color: #6f7975; font-weight: 600;">
          ${todosDetails.length} perguntas e respostas disponíveis
        </span>
        <button type="button" id="btn-toggle-todos-faq" class="botao botao-claro" style="padding: 6px 14px; font-size: 13px;">
          Expandir Todas
        </button>
      `;

      containerDuvidas.insertBefore(divControles, secaoDuvidas);
      btnToggleTodos = document.getElementById('btn-toggle-todos-faq');
    }

    let todosAbertos = false;
    if (btnToggleTodos) {
      btnToggleTodos.addEventListener('click', () => {
        todosAbertos = !todosAbertos;
        todosDetails.forEach(d => {
          if (!d.classList.contains('oculto')) {
            d.open = todosAbertos;
          }
        });
        btnToggleTodos.textContent = todosAbertos ? 'Recolher Todas' : 'Expandir Todas';
      });
    }

    const conteudosOriginais = [];
    todosDetails.forEach((d, idx) => {
      conteudosOriginais[idx] = {
        summary: d.querySelector('summary').innerHTML,
        conteudo: d.querySelector('p, div, ul') ? d.innerHTML : ''
      };
    });

    function filtrarFaq() {
      const termo = inputBusca.value.trim().toLowerCase();
      let correspondencias = 0;

      todosDetails.forEach((details, idx) => {
        const textoCompleto = details.textContent.toLowerCase();
        const summary = details.querySelector('summary');

        if (!termo) {

          details.classList.remove('oculto');
          summary.innerHTML = conteudosOriginais[idx].summary;
          if (idx !== 0) details.open = false;
          else details.open = true;
          correspondencias++;
          return;
        }

        if (textoCompleto.includes(termo)) {
          details.classList.remove('oculto');
          details.open = true;
          correspondencias++;

          const regex = new RegExp(`(${termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
          summary.innerHTML = conteudosOriginais[idx].summary.replace(regex, '<mark class="termo-destacado">$1</mark>');
        } else {
          details.classList.add('oculto');
          details.open = false;
        }
      });

      const contadorEl = document.getElementById('faq-contador-resultados');
      if (contadorEl) {
        if (!termo) {
          contadorEl.textContent = `${todosDetails.length} perguntas e respostas disponíveis`;
        } else {
          contadorEl.textContent = `${correspondencias} resultado${correspondencias === 1 ? '' : 's'} para "${termo}"`;
        }
      }
    }

    inputBusca.addEventListener('input', filtrarFaq);

    if (formBusca) {
      formBusca.addEventListener('submit', (e) => {
        e.preventDefault();
        filtrarFaq();
      });
    }
  }

  function initEmergencia() {
    const botaoEmergencia = document.querySelector('.secao-emergencia a, .secao-emergencia button');
    if (!botaoEmergencia) return;

    botaoEmergencia.addEventListener('click', function (e) {
      if (this.getAttribute('href') === '#' || !this.getAttribute('href')) {
        e.preventDefault();
        const telefone = '(18) 99482-1884';

        if (window.PatasUI) {
          window.PatasUI.openModal(
            'Plantão de Resgate Emergencial 24h',
            `
              <div style="text-align: center; padding: 12px 0;">
                <div style="font-size: 40px; color: #ba1a1a; margin-bottom: 8px;">🚨</div>
                <h4 style="font-size: 18px; color: #ba1a1a; margin-bottom: 8px;">Linha Direta de Triagem Rápida</h4>
                <p style="margin-bottom: 16px;">Para animais em risco iminente de atropelamento ou situação crítica:</p>

                <div style="background: #eff4ff; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
                  <strong style="font-size: 22px; color: #005645;">${telefone}</strong>
                  <p style="font-size: 12px; color: #6f7975; margin-top: 4px;">Atendimento via Ligação e WhatsApp</p>
                </div>

                <p style="font-size: 13px; color: #3f4945; text-align: left;">
                  • Envie foto do animal e localização exata via WhatsApp.<br>
                  • Nunca tente conter animais agressivos sem luvas ou toalha grossa.<br>
                  • Nossa van de primeiros socorros será acionada imediatamente.
                </p>
              </div>
            `,
            [
              {
                texto: 'Copiar Número',
                classe: 'botao botao-laranja',
                onClick: () => {
                  navigator.clipboard.writeText('18994821884');
                  window.PatasUI.showToast('Copiado', 'Telefone de emergência copiado!', 'sucesso', 2500);
                }
              },
              {
                texto: 'Fechar',
                classe: 'botao',
                onClick: () => {
                  window.PatasUI.closeModal();
                }
              }
            ]
          );
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initBuscaFaq();
    initEmergencia();
  });
})();
