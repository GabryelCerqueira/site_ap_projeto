(function () {
  'use strict';

  function atualizarCarteirinha(animal) {
    if (!animal) return;

    const migalhaAtual = document.querySelector('nav[aria-label="Migalhas de pão"] li[aria-current="page"]');
    if (migalhaAtual) {
      migalhaAtual.textContent = `${animal.nome} (${animal.id})`;
    }

    const imgPet = document.querySelector('section > div:nth-of-type(4) > div:first-child img, section img[alt="Pipoca"], section img');
    if (imgPet) {
      imgPet.src = animal.fotoVacina || animal.foto;
      imgPet.alt = `Fotografia de identificação de ${animal.nome}`;
    }

    const spanId = document.querySelector('section > div:nth-of-type(4) > div:first-child span:last-child');
    if (spanId) spanId.textContent = animal.id;

    const h2Nome = document.querySelector('section > div:nth-of-type(4) h2');
    if (h2Nome) h2Nome.textContent = animal.nome;

    const spanStatus = document.querySelector('section > div:nth-of-type(4) span:first-of-type');
    if (spanStatus) {
      spanStatus.textContent = `Status Clínico: ${animal.status.toUpperCase()}`;
    }

    const ps = document.querySelectorAll('section > div:nth-of-type(4) p');
    if (ps.length >= 2) {
      ps[0].textContent = `${animal.raca} • ${animal.sexo === 'macho' ? 'Macho' : 'Fêmea'} • Porte ${animal.porte.charAt(0).toUpperCase() + animal.porte.slice(1)}`;
      ps[1].textContent = animal.historicoSaude || `Animal resgatado pela rede Patas & Vidas. Encontra-se desparasitado e com protocolo vacinal ativo em Presidente Prudente.`;
    }

    const dds = document.querySelectorAll('section > div:nth-of-type(4) dl dd');
    if (dds.length >= 5) {
      dds[0].textContent = animal.idadeTexto || animal.idadeEstimada;
      dds[1].textContent = animal.microchip;
      dds[2].textContent = animal.pelagem;
    }

    const inputBusca = document.getElementById('busca-animal');
    if (inputBusca) {
      inputBusca.value = `${animal.nome} (${animal.id})`;
    }
  }

  function initBuscaAnimal() {
    const formBusca = document.querySelector('form');
    const inputBusca = document.getElementById('busca-animal');
    const selectCategoria = document.getElementById('busca-categoria');

    if (!formBusca) return;

    formBusca.addEventListener('submit', function (e) {
      e.preventDefault();
      const termo = inputBusca ? inputBusca.value.trim() : '';
      if (!termo) return;

      const animal = window.PatasDB ? window.PatasDB.getAnimalPorTermo(termo) : null;
      if (animal) {
        atualizarCarteirinha(animal);
        if (window.PatasUI) {
          window.PatasUI.showToast('Carteira Atualizada', `Exibindo histórico de vacinas de ${animal.nome} (${animal.id})`, 'sucesso', 3000);
        }
      } else {
        if (window.PatasUI) {
          window.PatasUI.showToast('Animal Não Localizado', `Nenhum registro encontrado para "${termo}". Tente: Pipoca, Thor, Luna, Mel, Barão ou Chica.`, 'alerta', 4000);
        }
      }
    });

    if (selectCategoria) {
      selectCategoria.addEventListener('change', function () {
        const cat = this.value;
        const animais = window.PatasDB ? window.PatasDB.getAnimais() : [];
        const filtrado = animais.find(a => a.categoria === cat);
        if (filtrado) {
          atualizarCarteirinha(filtrado);
        }
      });
    }
  }

  function initBotoesAcao() {
    const botoesTopo = document.querySelectorAll('section > div:nth-of-type(2) button, section button');

    let btnImprimir = null;
    let btnAtestado = null;

    botoesTopo.forEach(b => {
      const texto = b.textContent.toLowerCase();
      if (texto.includes('imprimir')) btnImprimir = b;
      if (texto.includes('atestado') || texto.includes('pdf')) btnAtestado = b;
    });

    if (btnImprimir) {
      btnImprimir.addEventListener('click', () => {
        if (window.PatasUI) {
          window.PatasUI.showToast('Impressão Iniciada', 'Preparando versão otimizada da carteira de vacinação...', 'info', 2000);
        }
        setTimeout(() => {
          window.print();
        }, 300);
      });
    }

    if (btnAtestado) {
      btnAtestado.addEventListener('click', () => {
        const nomeAtual = document.querySelector('section > div:nth-of-type(4) h2')?.textContent || 'Pipoca';
        const animal = window.PatasDB ? window.PatasDB.getAnimalPorTermo(nomeAtual) : null;
        const idAnimal = animal ? animal.id : '#A-2024-089';
        const microchip = animal ? animal.microchip : '982.000.364.819.124';
        const dataHoje = new Date().toLocaleDateString('pt-BR');
        const hashVerificacao = 'SHA256:' + Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('');

        const atestadoHtml = `
          <div style="border: 2px solid #005645; padding: 20px; border-radius: 12px; background: #ffffff;">
            <div style="text-align: center; border-bottom: 2px solid #d9e3f6; padding-bottom: 12px; margin-bottom: 16px;">
              <h4 style="color: #005645; font-size: 20px; margin: 0;">ATESTADO DE SANIDADE VETERINÁRIA</h4>
              <p style="font-size: 13px; color: #6f7975; margin-top: 4px;">ONG Patas & Vidas • Faculdade de Informática de Presidente Prudente (FIPP)</p>
            </div>

            <p style="text-align: justify; margin-bottom: 14px; font-size: 14px;">
              Atesto para os devidos fins de acolhimento e adoção responsável que o animal
              <strong style="color: #005645;">${nomeAtual}</strong> (Identificação <strong style="color: #005645;">${idAnimal}</strong>),
              portador do microchip eletrônico <strong>${microchip}</strong>, foi submetido a rigorosa avaliação clínica,
              encontrando-se livre de ectoparasitas, afebril, com exames sorológicos negativos e imunizado de acordo com o calendário sanitário.
            </p>

            <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 16px;">
              <thead>
                <tr style="background: #f8f9ff; text-align: left;">
                  <th style="padding: 6px; border: 1px solid #d9e3f6;">Imunobiológico</th>
                  <th style="padding: 6px; border: 1px solid #d9e3f6;">Laboratório</th>
                  <th style="padding: 6px; border: 1px solid #d9e3f6;">Data Aplicação</th>
                  <th style="padding: 6px; border: 1px solid #d9e3f6;">Validade</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 6px; border: 1px solid #d9e3f6;">Polivalente V10 / V4</td>
                  <td style="padding: 6px; border: 1px solid #d9e3f6;">Zoetis Brasil</td>
                  <td style="padding: 6px; border: 1px solid #d9e3f6;">12/04/2024</td>
                  <td style="padding: 6px; border: 1px solid #d9e3f6;">12/04/2025</td>
                </tr>
                <tr>
                  <td style="padding: 6px; border: 1px solid #d9e3f6;">Antirrábica Defensor</td>
                  <td style="padding: 6px; border: 1px solid #d9e3f6;">Zoetis Brasil</td>
                  <td style="padding: 6px; border: 1px solid #d9e3f6;">01/06/2024</td>
                  <td style="padding: 6px; border: 1px solid #d9e3f6;">01/06/2025</td>
                </tr>
              </tbody>
            </table>

            <div style="background: #eff4ff; padding: 12px; border-radius: 8px; font-size: 11px; margin-bottom: 16px;">
              <strong>Assinatura Digital & Fé Pública:</strong><br>
              Dra. Mariana Vasconcelos de Souza • CRMV/SP nº 48.912<br>
              Chave Criptográfica: <code>${hashVerificacao}</code><br>
              Emitido em: ${dataHoje} às 10:00 • Presidente Prudente - SP
            </div>
          </div>
        `;

        if (window.PatasUI) {
          window.PatasUI.openModal(
            'Atestado Sanitário Veterinário Digital',
            atestadoHtml,
            [
              {
                texto: 'Imprimir Atestado',
                classe: 'botao botao-laranja',
                onClick: () => {
                  window.print();
                }
              },
              {
                texto: 'Copiar Chave Pública',
                classe: 'botao botao-claro',
                onClick: () => {
                  navigator.clipboard.writeText(hashVerificacao);
                  window.PatasUI.showToast('Copiado', 'Chave criptográfica copiada para a área de transferência!', 'sucesso', 2500);
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
      });
    }
  }

  function checarParametroUrl() {
    const params = new URLSearchParams(window.location.search);
    const petNome = params.get('pet');
    if (petNome && window.PatasDB) {
      const animal = window.PatasDB.getAnimalPorTermo(petNome);
      if (animal) {
        atualizarCarteirinha(animal);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initBuscaAnimal();
    initBotoesAcao();
    checarParametroUrl();
  });
})();
