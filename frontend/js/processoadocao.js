(function () {
  'use strict';

  function initEtapasInterativas() {
    const etapas = document.querySelectorAll('.etapas-fluxo ol li article');

    etapas.forEach((etapa, idx) => {
      etapa.style.cursor = 'pointer';
      etapa.title = 'Clique para ver o checklist detalhado desta etapa';

      etapa.addEventListener('click', () => {
        const titulo = etapa.querySelector('h3')?.textContent || `Etapa ${idx + 1}`;
        const descricao = etapa.querySelector('p')?.textContent || '';
        const itens = Array.from(etapa.querySelectorAll('ul li')).map(li => `<li>${li.innerHTML}</li>`).join('');

        if (window.PatasUI) {
          window.PatasUI.openModal(
            `Guia Detalhado: ${titulo}`,
            `
              <div style="font-size: 14px; line-height: 1.6; color: #121c2a;">
                <p style="margin-bottom: 14px;">${descricao}</p>
                <h5 style="color: #005645; margin-bottom: 8px;">Checklist &amp; Recomendações desta Fase:</h5>
                <ul style="padding-left: 20px; margin-bottom: 16px;">
                  ${itens}
                </ul>
                <div style="background: #eff4ff; border-radius: 8px; padding: 12px; font-size: 13px; color: #005645;">
                  ✓ Toda esta etapa é acompanhada por nossos voluntários e assistentes veterinários sem cobrança de taxas.
                </div>
              </div>
            `,
            [
              {
                texto: 'Ir para Formulário de Adoção',
                classe: 'botao botao-laranja',
                onClick: () => {
                  window.location.href = '/pages/queradotar.html';
                }
              },
              {
                texto: 'Entendido',
                classe: 'botao',
                onClick: () => window.PatasUI.closeModal()
              }
            ]
          );
        }
      });
    });
  }

  function initSimuladorAptidao() {
    const secaoRequisitos = document.querySelector('.requisitos-comparativos');
    if (!secaoRequisitos) return;

    const divSimulador = document.createElement('div');
    divSimulador.style.backgroundColor = '#ffffff';
    divSimulador.style.border = '1px solid #d9e3f6';
    divSimulador.style.borderRadius = '12px';
    divSimulador.style.padding = '20px';
    divSimulador.style.marginTop = '24px';
    divSimulador.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';

    divSimulador.innerHTML = `
      <div style="text-align: center; margin-bottom: 16px;">
        <span style="font-size: 12px; font-weight: 700; color: #99452c; text-transform: uppercase;">Teste Rápido de Compatibilidade</span>
        <h3 style="color: #005645; margin-top: 4px;">Seu lar está preparado para receber um pet hoje?</h3>
        <p style="font-size: 14px; color: #6f7975;">Marque as opções que correspondem à realidade da sua família:</p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px; max-width: 550px; margin: 0 auto;">
        <label style="display:flex; align-items:center; gap: 10px; font-size: 14px; cursor:pointer;">
          <input type="checkbox" id="chk-seguranca" style="width: 18px; height: 18px;">
          Imóvel possui telas nas janelas (se gatos) ou muros altos e portão seguro (se cães).
        </label>
        <label style="display:flex; align-items:center; gap: 10px; font-size: 14px; cursor:pointer;">
          <input type="checkbox" id="chk-concordancia" style="width: 18px; height: 18px;">
          Todos os membros da residência estão de acordo e animados com a adoção.
        </label>
        <label style="display:flex; align-items:center; gap: 10px; font-size: 14px; cursor:pointer;">
          <input type="checkbox" id="chk-orcamento" style="width: 18px; height: 18px;">
          Tenho reserva mensal para ração premium, vacinas anuais e eventual urgência veterinária.
        </label>
        <label style="display:flex; align-items:center; gap: 10px; font-size: 14px; cursor:pointer;">
          <input type="checkbox" id="chk-tempo" style="width: 18px; height: 18px;">
          Disponho de tempo diário para passeios, afeto e adaptação com paciência.
        </label>

        <button type="button" id="btn-verificar-simulador" class="botao botao-laranja" style="margin-top: 14px;">
          Verificar Minha Prontidão para Adotar
        </button>

        <div id="resultado-simulador" style="display:none; padding:14px; border-radius:8px; margin-top:10px; font-size:14px; text-align:center;"></div>
      </div>
    `;

    secaoRequisitos.appendChild(divSimulador);

    const btnVerificar = document.getElementById('btn-verificar-simulador');
    const divResultado = document.getElementById('resultado-simulador');

    btnVerificar.addEventListener('click', () => {
      const c1 = document.getElementById('chk-seguranca').checked;
      const c2 = document.getElementById('chk-concordancia').checked;
      const c3 = document.getElementById('chk-orcamento').checked;
      const c4 = document.getElementById('chk-tempo').checked;

      const total = [c1, c2, c3, c4].filter(Boolean).length;
      divResultado.style.display = 'block';

      if (total === 4) {
        divResultado.style.backgroundColor = '#eff4ff';
        divResultado.style.border = '1px solid #005645';
        divResultado.style.color = '#005645';
        divResultado.innerHTML = `
          <strong>🎉 Parabéns! Seu perfil possui 100% de compatibilidade!</strong><br>
          Seu lar reúne todas as condições exigidas para acolhimento de cães ou gatos.<br>
          <a href="/pages/adocao.html" class="botao botao-laranja" style="display:inline-block; margin-top:10px;">Conhecer Animais Disponíveis Agora</a>
        `;
      } else if (total >= 2) {
        divResultado.style.backgroundColor = '#fff7ed';
        divResultado.style.border = '1px solid #ea580c';
        divResultado.style.color = '#9a3412';
        divResultado.innerHTML = `
          <strong>⚠️ Você está no caminho certo (${total}/4 critérios)!</strong><br>
          Converse com a família e adeque as proteções físicas (telas/muros) antes de dar o próximo passo.<br>
          Nossa equipe pode te orientar gratuitamente pelo WhatsApp de triagem!
        `;
      } else {
        divResultado.style.backgroundColor = '#fef2f2';
        divResultado.style.border = '1px solid #dc2626';
        divResultado.style.color = '#991b1b';
        divResultado.innerHTML = `
          <strong>Atenção: Adoção responsável exige preparação prévia.</strong><br>
          Considere ser um Lar Temporário (LT) voluntário ou apadrinhar um animal enquanto prepara sua rotina!
        `;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initEtapasInterativas();
    initSimuladorAptidao();
  });
})();
