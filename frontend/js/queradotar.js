(function () {
  'use strict';

  const STORAGE_KEY_RASCUNHO = 'patasevidas_rascunho_triagem';

  function atualizarPetSelecionado(animal) {
    if (!animal) return;

    const figcaption = document.querySelector('.ficha-animal-destaque figcaption');
    if (figcaption) {
      figcaption.textContent = `${animal.nome} • Registro Oficial ${animal.id}`;
    }

    const imgPet = document.querySelector('.ficha-animal-destaque figure img');
    if (imgPet) {
      imgPet.src = animal.fotoDetalhe || animal.foto;
      imgPet.alt = `Foto de ${animal.nome}, candidato a adoção`;
    }

    const h3Nome = document.querySelector('.ficha-animal-destaque header h3');
    if (h3Nome) {
      h3Nome.textContent = `${animal.nome} (${animal.id})`;
    }

    const pLocal = document.querySelector('.ficha-animal-destaque header p');
    if (pLocal) {
      pLocal.textContent = `Resgatado em ${animal.localResgate} • Sob tutela da Patas & Vidas`;
    }

    const dds = document.querySelectorAll('.ficha-animal-destaque dl dd');
    if (dds.length >= 7) {
      dds[0].textContent = `${animal.especie === 'gato' ? 'Felino' : 'Canino'} • ${animal.sexo === 'macho' ? 'Macho' : 'Fêmea'}`;
      dds[1].textContent = `${animal.porte.charAt(0).toUpperCase() + animal.porte.slice(1)} • ${animal.idadeTexto || animal.idadeEstimada}`;
      dds[2].textContent = animal.pelagem;
      dds[3].textContent = `${animal.castrado ? 'Castrado, ' : ''}Vacinas em dia, Microchip ${animal.microchip}`;
      if (animal.comportamento) {
        dds[4].textContent = `Energia ${animal.comportamento.energia}`;
        dds[5].textContent = `Sociabilidade: ${animal.comportamento.outrosCaes}. Crianças: ${animal.comportamento.criancas}.`;
      }
      dds[6].textContent = animal.historicoSaude;
    }

    const linkVacina = document.querySelector('.ficha-animal-destaque a[href*="carteiravacina"]');
    if (linkVacina) {
      linkVacina.href = `/pages/carteiravacina.html?pet=${encodeURIComponent(animal.nome)}`;
      linkVacina.textContent = `Ver Carteira Digital de Vacinação do ${animal.nome}`;
    }
  }

  function initAutoCep() {
    const inputCep = document.getElementById('moradia-cep');
    const inputEndereco = document.getElementById('moradia-endereco');
    const inputBairro = document.getElementById('moradia-bairro');
    const inputCidade = document.getElementById('moradia-cidade');
    const selectEstado = document.getElementById('moradia-estado');
    const inputNumero = document.getElementById('moradia-numero');

    if (!inputCep) return;

    inputCep.addEventListener('blur', function () {
      const cepLimpo = this.value.replace(/\D/g, '');
      if (cepLimpo.length === 8 && window.PatasUI) {
        if (window.PatasUI.showToast) {
          window.PatasUI.showToast('Buscando CEP', 'Consultando endereço na base dos Correios...', 'info', 1800);
        }

        window.PatasUI.consultarViaCep(
          cepLimpo,
          (dados) => {
            if (inputEndereco && dados.logradouro) inputEndereco.value = dados.logradouro;
            if (inputBairro && dados.bairro) inputBairro.value = dados.bairro;
            if (inputCidade && dados.localidade) inputCidade.value = dados.localidade;
            if (selectEstado && dados.uf) selectEstado.value = dados.uf;

            if (inputNumero) inputNumero.focus();

            window.PatasUI.showToast('CEP Localizado', `${dados.logradouro || dados.localidade} preenchido com sucesso!`, 'sucesso', 2500);
          },
          (erro) => {
            window.PatasUI.showToast('Aviso de CEP', erro || 'Não foi possível buscar o endereço automaticamente.', 'alerta', 3000);
          }
        );
      }
    });
  }

  function initRascunho() {
    const form = document.querySelector('.formulario-triagem form');
    if (!form) return;

    try {
      const salvo = localStorage.getItem(STORAGE_KEY_RASCUNHO);
      if (salvo) {
        const dados = JSON.parse(salvo);
        Object.keys(dados).forEach(campo => {
          const el = form.elements[campo];
          if (el && el.type !== 'file' && el.type !== 'password') {
            el.value = dados[campo];
          }
        });
      }
    } catch (e) {}

    form.addEventListener('input', () => {
      const dados = {};
      const formData = new FormData(form);
      for (let [k, v] of formData.entries()) {
        dados[k] = v;
      }
      localStorage.setItem(STORAGE_KEY_RASCUNHO, JSON.stringify(dados));
    });
  }

  function initSubmitFormulario() {
    const form = document.querySelector('.formulario-triagem form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nome = document.getElementById('adotante-nome')?.value.trim();
      const cpf = document.getElementById('adotante-cpf')?.value.trim();
      const email = document.getElementById('adotante-email')?.value.trim();
      const telefone = document.getElementById('adotante-telefone')?.value.trim();
      const endereco = document.getElementById('moradia-endereco')?.value.trim();
      const numero = document.getElementById('moradia-numero')?.value.trim();
      const cidade = document.getElementById('moradia-cidade')?.value.trim();
      const petNome = document.querySelector('.ficha-animal-destaque h3')?.textContent || 'Pipoca';

      if (!nome || !cpf || !email || !telefone || !endereco || !numero) {
        if (window.PatasUI) {
          window.PatasUI.showToast('Campos Incompletos', 'Preencha os campos obrigatórios da triagem.', 'alerta');
        }
        return;
      }

      if (cpf.replace(/\D/g, '').length !== 11) {
        if (window.PatasUI) {
          window.PatasUI.showToast('CPF Inválido', 'Verifique a numeração do seu CPF.', 'erro');
        }
        return;
      }

      let protocolo = 'PV-' + Math.floor(10000 + Math.random() * 90000);
      if (window.PatasDB) {
        const registro = window.PatasDB.salvarIntencaoAdocao({
          adotante: nome,
          cpf: cpf,
          email: email,
          whatsapp: telefone,
          endereco: `${endereco}, ${numero} - ${cidade}`,
          animalEscolhido: petNome,
          tipoMoradia: document.getElementById('moradia-tipo')?.value
        });
        if (registro) protocolo = registro.protocolo;
      }

      localStorage.removeItem(STORAGE_KEY_RASCUNHO);

      if (window.PatasUI) {
        window.PatasUI.openModal(
          'Triagem Socioambiental Enviada',
          `
            <div style="text-align: center; padding: 10px 0;">
              <div style="font-size: 44px; color: #005645; margin-bottom: 8px;">📋</div>
              <h4 style="color: #005645; font-size: 20px; margin-bottom: 6px;">Candidatura Registrada!</h4>
              <p>O processo de tutela para <strong>${petNome}</strong> foi iniciado.</p>

              <div style="background: #f8f9ff; border: 1px solid #d9e3f6; border-radius: 10px; padding: 14px; margin: 16px 0; text-align: left;">
                <p><strong>Número de Protocolo:</strong> <span style="color: #99452c; font-size: 18px; font-weight: 700;">#${protocolo}</span></p>
                <p><strong>Tutor Solicitante:</strong> ${nome}</p>
                <p><strong>Contato Informado:</strong> ${telefone}</p>
                <p><strong>Ponto de Acolhimento:</strong> Abrigo Esperança Viva (Planalto)</p>
              </div>

              <p style="font-size: 13px; color: #6f7975;">
                Após a avaliação socioambiental prévia, você receberá mensagem no WhatsApp para agendamento da visita presencial de conexão!
              </p>
            </div>
          `,
          [
            {
              texto: 'Imprimir Protocolo',
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
          'Sucesso',
          `Sua intenção de adotar #${protocolo} foi registrada com sucesso!`,
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
        atualizarPetSelecionado(animal);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initAutoCep();
    initRascunho();
    initSubmitFormulario();
    checarParametroUrl();
  });
})();
