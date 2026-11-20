(function () {
  'use strict';

  function atualizarFichaTecnica(animal) {
    if (!animal) return;

    const secaoFicha = document.getElementById('ficha-tecnica');
    if (!secaoFicha) return;

    const spanCodigo = secaoFicha.querySelector('span:first-of-type');
    if (spanCodigo) spanCodigo.textContent = `Prontuário de Acolhimento Aberto • Código do Animal: ${animal.id}`;

    const h2Titulo = secaoFicha.querySelector('h2');
    if (h2Titulo) h2Titulo.textContent = `Ficha Técnica Detalhada: ${animal.nome}`;

    const linkQueroAdotar = secaoFicha.querySelector('a[href="#manifestacao-interesse"]');
    if (linkQueroAdotar) linkQueroAdotar.textContent = `Quero Adotar o ${animal.nome}`;

    const imgPet = secaoFicha.querySelector('img[alt="Pipoca"], img[alt*="Foto"], div > img:first-of-type');
    if (imgPet) {
      imgPet.src = animal.fotoDetalhe || animal.foto;
      imgPet.alt = `Foto de detalhe de ${animal.nome}`;
    }

    const dds = secaoFicha.querySelectorAll('dl dd');
    if (dds.length >= 3) {
      dds[0].textContent = animal.microchip;
      dds[1].innerHTML = `<time datetime="${animal.dataResgate}">${animal.dataResgate}</time>`;
      dds[2].textContent = `Sede Patas & Vidas - ${animal.localAcolhimento}`;
    }

    const pHistorico = secaoFicha.querySelectorAll('div:nth-of-type(2) > p');
    if (pHistorico && pHistorico.length > 0) {
      pHistorico[0].textContent = animal.historicoSaude || `${animal.nome} foi acolhido por nossa equipe de prontidão. Encontra-se saudável, sociável e com todos os exames em dia.`;
    }

    const lisComportamento = secaoFicha.querySelectorAll('ul li');
    if (lisComportamento.length >= 4 && animal.comportamento) {
      lisComportamento[0].innerHTML = `<strong>Convivência com Animais:</strong> ${animal.comportamento.outrosCaes}.`;
      lisComportamento[1].innerHTML = `<strong>Sociabilidade com Crianças:</strong> ${animal.comportamento.criancas}.`;
      lisComportamento[2].innerHTML = `<strong>Passeios e Guia:</strong> Anda bem na guia, sociável e dócil.`;
      lisComportamento[3].innerHTML = `<strong>Nível de Energia:</strong> ${animal.comportamento.energia}.`;
    }

    const fieldsetAnimal = document.querySelector('#manifestacao-interesse fieldset:first-of-type');
    if (fieldsetAnimal) {
      const pNome = fieldsetAnimal.querySelector('p');
      const spanReg = fieldsetAnimal.querySelector('span');
      if (pNome) pNome.textContent = `${animal.nome} • ${animal.sexo === 'macho' ? 'Macho' : 'Fêmea'} • Porte ${animal.porte.charAt(0).toUpperCase() + animal.porte.slice(1)}`;
      if (spanReg) spanReg.textContent = `Registro ${animal.id}`;
    }
  }

  function initFiltrosAdocao() {
    const formFiltro = document.querySelector('section form');
    const selectEspecie = document.getElementById('filtro-especie');
    const selectPorte = document.getElementById('filtro-porte');
    const selectFaixa = document.getElementById('filtro-faixa-etaria');
    const selectSexo = document.getElementById('filtro-sexo');
    const selectCondicao = document.getElementById('filtro-condicao');
    const botoesRapidos = document.querySelectorAll('section form div:last-of-type button');
    const cardsContainer = document.querySelector('section:nth-of-type(2) > div:last-of-type');
    const cards = document.querySelectorAll('section:nth-of-type(2) article');

    let filtroRapidoAtivo = null;

    const tituloSecao = document.querySelector('section:nth-of-type(2) h2');
    let badgeContador = null;
    if (tituloSecao) {
      badgeContador = document.createElement('span');
      badgeContador.className = 'filtro-contador-badge';
      badgeContador.textContent = `${cards.length} pets disponíveis`;
      tituloSecao.appendChild(badgeContador);
    }

    function aplicarFiltros() {
      const especieVal = selectEspecie ? selectEspecie.value.toLowerCase() : '';
      const porteVal = selectPorte ? selectPorte.value.toLowerCase() : '';
      const faixaVal = selectFaixa ? selectFaixa.value.toLowerCase() : '';
      const sexoVal = selectSexo ? selectSexo.value.toLowerCase() : '';
      const condicaoVal = selectCondicao ? selectCondicao.value.toLowerCase() : '';

      let visiveis = 0;

      cards.forEach(card => {
        const nome = card.querySelector('h3')?.textContent.trim() || '';
        const dadosAnimal = window.PatasDB ? window.PatasDB.getAnimalPorTermo(nome) : null;

        let coincide = true;

        if (dadosAnimal) {
          if (especieVal && dadosAnimal.especie !== especieVal) coincide = false;
          if (porteVal && dadosAnimal.porte !== porteVal) coincide = false;
          if (faixaVal && dadosAnimal.faixaEtaria !== faixaVal) coincide = false;
          if (sexoVal && dadosAnimal.sexo !== sexoVal) coincide = false;
          if (condicaoVal && !dadosAnimal.condicaoEspecial) coincide = false;

          if (filtroRapidoAtivo) {
            const f = filtroRapidoAtivo.toLowerCase();
            if (f.includes('apartamento') && dadosAnimal.porte === 'grande') coincide = false;
            if (f.includes('cães') && dadosAnimal.especie === 'gato') coincide = false;
            if (f.includes('crianças') && !dadosAnimal.comportamento.criancas.toLowerCase().includes('dócil') && !dadosAnimal.comportamento.criancas.toLowerCase().includes('excelente')) coincide = false;
            if (f.includes('idosos') && dadosAnimal.faixaEtaria === 'filhote') coincide = false;
            if (f.includes('especiais') && !dadosAnimal.condicaoEspecial && dadosAnimal.nome !== 'Mel') coincide = false;
          }
        }

        if (coincide) {
          card.classList.remove('oculto');
          visiveis++;
        } else {
          card.classList.add('oculto');
        }
      });

      if (badgeContador) {
        badgeContador.textContent = `${visiveis} pet${visiveis === 1 ? '' : 's'} encontrado${visiveis === 1 ? '' : 's'}`;
      }
    }

    [selectEspecie, selectPorte, selectFaixa, selectSexo, selectCondicao].forEach(sel => {
      if (sel) {
        sel.addEventListener('change', () => {
          filtroRapidoAtivo = null;
          botoesRapidos.forEach(b => b.classList.remove('botao-laranja'));
          aplicarFiltros();
        });
      }
    });

    botoesRapidos.forEach(btn => {
      btn.addEventListener('click', function () {
        if (filtroRapidoAtivo === this.textContent.trim()) {
          filtroRapidoAtivo = null;
          this.classList.remove('botao-laranja');
        } else {
          botoesRapidos.forEach(b => b.classList.remove('botao-laranja'));
          this.classList.add('botao-laranja');
          filtroRapidoAtivo = this.textContent.trim();
        }
        aplicarFiltros();
      });
    });

    if (formFiltro) {
      formFiltro.addEventListener('submit', (e) => {
        e.preventDefault();
        aplicarFiltros();
      });
    }

    cards.forEach(card => {
      const nomePet = card.querySelector('h3')?.textContent.trim() || '';
      const btnVerFicha = card.querySelector('a');

      if (btnVerFicha) {
        btnVerFicha.addEventListener('click', (e) => {
          e.preventDefault();
          const animal = window.PatasDB ? window.PatasDB.getAnimalPorTermo(nomePet) : null;
          if (animal) {
            atualizarFichaTecnica(animal);
            const alvo = document.getElementById('ficha-tecnica');
            if (alvo) {
              alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            if (window.PatasUI) {
              window.PatasUI.showToast('Ficha Aberta', `Visualizando prontuário completo de ${animal.nome}`, 'info', 2500);
            }
          }
        });
      }
    });
  }

  function initFormularioAdocao() {
    const form = document.querySelector('#manifestacao-interesse form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nomeCompleto = document.getElementById('nome-completo')?.value.trim();
      const cpf = document.getElementById('cpf')?.value.trim();
      const whatsapp = document.getElementById('whatsapp')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const endereco = document.getElementById('endereco')?.value.trim();
      const motivo = document.getElementById('motivo-adocao')?.value.trim();
      const animalEscolhidoTexto = document.querySelector('#manifestacao-interesse fieldset:first-of-type p')?.textContent.trim() || 'Pipoca';

      if (!nomeCompleto || !cpf || !whatsapp || !email || !endereco) {
        if (window.PatasUI) {
          window.PatasUI.showToast('Campos Obrigatórios', 'Por favor, preencha todos os dados de identificação.', 'alerta', 3500);
        }
        return;
      }

      if (cpf.replace(/\D/g, '').length !== 11) {
        if (window.PatasUI) {
          window.PatasUI.showToast('CPF Inválido', 'O CPF deve conter exatamente 11 dígitos numéricos.', 'erro', 3500);
        }
        return;
      }

      let protocolo = 'PV-' + Math.floor(10000 + Math.random() * 90000);
      if (window.PatasDB) {
        const registro = window.PatasDB.salvarIntencaoAdocao({
          adotante: nomeCompleto,
          cpf: cpf,
          whatsapp: whatsapp,
          email: email,
          endereco: endereco,
          animalEscolhido: animalEscolhidoTexto,
          motivo: motivo
        });
        if (registro) protocolo = registro.protocolo;
      }

      const modalHtml = `
        <div style="text-align: center; padding: 10px 0;">
          <div style="font-size: 48px; color: #005645; margin-bottom: 12px;">✓</div>
          <h4 style="font-size: 20px; color: #005645; margin-bottom: 8px;">Manifestação Registrada com Sucesso!</h4>
          <p style="margin-bottom: 16px;">Seu formulário de triagem prévia foi acolhido pela nossa equipe técnica.</p>

          <div style="background-color: #f8f9ff; border: 1px dashed #005645; border-radius: 10px; padding: 16px; margin-bottom: 20px; text-align: left;">
            <p><strong>Protocolo Oficial:</strong> <span style="font-size: 18px; color: #99452c; font-weight: 700;">#${protocolo}</span></p>
            <p><strong>Candidato a Tutor:</strong> ${nomeCompleto}</p>
            <p><strong>Animal Escolhido:</strong> ${animalEscolhidoTexto}</p>
            <p><strong>Prazo Médio de Retorno:</strong> 3 a 5 dias úteis via WhatsApp</p>
          </div>

          <p style="font-size: 13px; color: #6f7975;">
            Nossa equipe entrará em contato para agendar uma conversa acolhedora e tirar dúvidas sobre a adaptação do pet ao seu lar.
          </p>
        </div>
      `;

      if (window.PatasUI) {
        window.PatasUI.openModal(
          'Comprovante de Intenção de Adoção',
          modalHtml,
          [
            {
              texto: 'Imprimir Comprovante',
              classe: 'botao botao-laranja',
              onClick: () => {
                window.print();
              }
            },
            {
              texto: 'Concluir',
              classe: 'botao',
              onClick: () => {
                window.PatasUI.closeModal();
                form.reset();
              }
            }
          ]
        );

        window.PatasUI.showToast(
          'Adoção Responsável',
          `Triagem #${protocolo} protocolada com sucesso!`,
          'sucesso',
          5000
        );
      }
    });
  }

  function checarParametroUrl() {
    const params = new URLSearchParams(window.location.search);
    const petNome = params.get('pet');
    if (petNome && window.PatasDB) {
      const animal = window.PatasDB.getAnimalPorTermo(petNome);
      if (animal) {
        atualizarFichaTecnica(animal);
        setTimeout(() => {
          const alvo = document.getElementById('ficha-tecnica');
          if (alvo) alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initFiltrosAdocao();
    initFormularioAdocao();
    checarParametroUrl();
  });
})();
