(function () {
  'use strict';

  const API_BASE = 'http://127.0.0.1:8000';

  let tabelaCorpo = null;
  let formResgate = null;
  let inputIdEdicao = null;
  let btnSubmit = null;
  let btnCancelarEdicao = null;
  let listaRegistrosCache = [];

  async function verificarStatusServidor() {
    const elStatus = document.getElementById('status-servidor-info');
    if (!elStatus) return;

    try {
      const resp = await fetch(`${API_BASE}/`, { method: 'GET' });
      if (resp.ok) {
        elStatus.innerHTML = `
          <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#28a745; margin-right:6px;"></span>
          <strong style="color:#005645;">Flask Online</strong> (SQLite conectado em <code>${API_BASE}</code>)
        `;
        elStatus.style.background = '#e8f5e9';
        elStatus.style.borderColor = '#c8e6c9';
      } else {
        throw new Error('Servidor retornou status ' + resp.status);
      }
    } catch (err) {
      elStatus.innerHTML = `
        <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#dc3545; margin-right:6px;"></span>
        <strong style="color:#c62828;">Servidor Flask Offline</strong> — Inicie o back-end executando: <code>python backend/server.py</code>
      `;
      elStatus.style.background = '#ffebee';
      elStatus.style.borderColor = '#ffcdd2';
    }
  }

  async function carregarAnimais() {
    tabelaCorpo = document.getElementById('tabela-animais-corpo') || document.querySelector('.tabela-controle-animais tbody');
    if (!tabelaCorpo) return;

    try {
      const response = await fetch(`${API_BASE}/resgates`, { credentials: 'omit' });
      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }

      const dados = await response.json();
      listaRegistrosCache = Array.isArray(dados) ? dados : [];
      renderizarTabela(listaRegistrosCache);
      atualizarContadoresHero(listaRegistrosCache);
    } catch (erro) {
      console.warn('Aviso de conexao:', erro);
      tabelaCorpo.innerHTML = `
        <tr class="linha-vazia">
          <td colspan="8" style="text-align: center; padding: 30px 15px; color: #c62828; background: #fff8f8;">
            <p style="font-weight: 700; font-size: 15px; margin-bottom: 6px;">
              Não foi possível conectar ao servidor Flask.
            </p>
            <p style="color: #555; font-size: 13px; margin-bottom: 12px;">
              Certifique-se de executar o comando no terminal:
            </p>
            <code style="background: #eee; padding: 6px 12px; border-radius: 4px; font-weight: 600;">python backend/server.py</code>
            <div style="margin-top: 15px;">
              <button type="button" onclick="window.PatasRegistro.carregar()" style="padding: 6px 14px; background:#005645; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:600;">
                Recarregar
              </button>
            </div>
          </td>
        </tr>
      `;
    }
  }

  function renderizarTabela(registros) {
    if (!tabelaCorpo) return;

    if (!registros || registros.length === 0) {
      tabelaCorpo.innerHTML = `
        <tr class="linha-vazia">
          <td colspan="8" style="text-align: center; padding: 30px; color: #6f7975;">
            Nenhum animal ou prontuário cadastrado no banco de dados.
          </td>
        </tr>
      `;
      return;
    }

    let linhasHtml = '';

    registros.forEach((item) => {
      const idFormatado = `#RES-${String(item.id).padStart(3, '0')}`;
      const nome = item.nome_provisorio || 'Sem nome';
      const especieFormatada = item.especie === 'felino' ? 'Felino' : (item.especie === 'canino' ? 'Canino' : 'Outra');
      const porte = item.porte_peso || 'Não informado';
      const local = item.endereco_resgate || 'Local não informado';
      const dataEntrada = item.data_registro || (item.data_hora_resgate ? item.data_hora_resgate.split('T')[0] : 'Hoje');
      const statusSanitario = item.status_sanitario || 'Em Quarentena';
      const destinacao = item.destinacao_imediata || 'Baia Quarentena A';

      const tagFoto = item.imagem_url
        ? `<span title="Possui foto" style="cursor:help; margin-left:4px;">📷</span>`
        : '';

      let corBadge = '#99452c';
      let fundoBadge = '#ffeae4';
      if (statusSanitario.toLowerCase().includes('apto')) {
        corBadge = '#005645';
        fundoBadge = '#e0f2ed';
      } else if (statusSanitario.toLowerCase().includes('tratamento')) {
        corBadge = '#b26a00';
        fundoBadge = '#fff4e5';
      }

      linhasHtml += `
        <tr data-id="${item.id}">
          <th scope="row" style="white-space: nowrap; font-family: monospace; font-size: 13px; color: #005645;">
            ${idFormatado}
          </th>
          <td>
            <strong>${nome}</strong> ${tagFoto}
          </td>
          <td>${especieFormatada} • ${porte}</td>
          <td>${local}</td>
          <td>${dataEntrada}</td>
          <td>
            <span style="display:inline-block; font-size: 11px; font-weight: 700; color: ${corBadge}; background: ${fundoBadge}; padding: 4px 8px; border-radius: 6px;">
              ${statusSanitario}
            </span>
          </td>
          <td>${destinacao}</td>
          <td>
            <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
              <button type="button"
                      class="btn-acao-editar"
                      onclick="window.PatasRegistro.editar(${item.id})"
                      title="Editar"
                      style="background:#0288d1; color:#fff; border:none; padding:4px 9px; border-radius:5px; font-size:12px; font-weight:600; cursor:pointer;">
                Editar
              </button>
              <button type="button"
                      class="btn-acao-excluir"
                      onclick="window.PatasRegistro.excluir(${item.id}, '${nome.replace(/'/g, "\\'")}')"
                      title="Excluir"
                      style="background:#d32f2f; color:#fff; border:none; padding:4px 9px; border-radius:5px; font-size:12px; font-weight:600; cursor:pointer;">
                Excluir
              </button>
              <a href="carteiravacina.html?pet=${encodeURIComponent(nome)}"
                 title="Ver Carteira de Vacinas"
                 style="font-size:12px; padding:4px 8px; background:#eff4ff; color:#005645; border-radius:5px; text-decoration:none; font-weight:600;">
                Carteira
              </a>
            </div>
          </td>
        </tr>
      `;
    });

    tabelaCorpo.innerHTML = linhasHtml;
  }

  function atualizarContadoresHero(registros) {
    const totalEl = document.querySelector('.hero-registro > div > div:last-child strong');
    const quarentenaEl = document.querySelector('.hero-registro > div > div:first-child strong');
    const tratamentoEl = document.querySelector('.hero-registro > div > div:nth-child(2) strong');
    const aptosEl = document.querySelector('.hero-registro > div > div:nth-child(3) strong');

    if (totalEl) totalEl.textContent = registros.length;

    let quarentena = 0;
    let tratamento = 0;
    let aptos = 0;

    registros.forEach(r => {
      const st = (r.status_sanitario || '').toLowerCase();
      if (st.includes('quarentena')) quarentena++;
      else if (st.includes('tratamento')) tratamento++;
      else if (st.includes('apto')) aptos++;
    });

    if (quarentenaEl) quarentenaEl.textContent = quarentena;
    if (tratamentoEl) tratamentoEl.textContent = tratamento;
    if (aptosEl) aptosEl.textContent = aptos;
  }

  async function salvarFormulario(e) {
    e.preventDefault();

    const idEdicao = inputIdEdicao ? inputIdEdicao.value.trim() : '';

    const nomeProvisorio = document.getElementById('resgate-nome-provisorio')?.value.trim();
    const especie = document.getElementById('resgate-especie')?.value;
    const sexo = document.getElementById('resgate-sexo')?.value;
    const idadeEstimada = document.getElementById('resgate-idade-estimada')?.value;
    const portePeso = document.getElementById('resgate-porte')?.value.trim();
    const pelagem = document.getElementById('resgate-pelagem')?.value.trim();
    const microchip = document.getElementById('resgate-microchip')?.value.trim();
    const dataHoraResgate = document.getElementById('resgate-data-hora')?.value;
    const enderecoResgate = document.getElementById('resgate-endereco')?.value.trim();
    const motivo = document.getElementById('resgate-motivo')?.value;
    const responsavel = document.getElementById('resgate-responsavel')?.value.trim();
    const escore = document.getElementById('clinica-escore-corporal')?.value;
    const temperatura = document.getElementById('clinica-temperatura')?.value;
    const parasitas = document.getElementById('clinica-parasitas')?.value;
    const ferimentos = document.getElementById('clinica-ferimentos')?.value.trim();
    const destinacao = document.getElementById('clinica-destinacao')?.value;
    const imagemUrl = document.getElementById('resgate-imagem-url')?.value.trim();

    if (!nomeProvisorio || !especie || !portePeso || !enderecoResgate || !responsavel || !temperatura) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const payload = {
      nome_provisorio: nomeProvisorio,
      especie: especie,
      sexo: sexo,
      idade_estimada: idadeEstimada,
      porte_peso: portePeso,
      pelagem: pelagem,
      microchip: microchip,
      data_hora_resgate: dataHoraResgate,
      endereco_resgate: enderecoResgate,
      motivo_recolhimento: motivo,
      responsavel_transporte: responsavel,
      escore_corporal: parseInt(escore, 10) || 3,
      temperatura_retal: parseFloat(temperatura) || 38.5,
      presenca_parasitas: parasitas,
      ferimentos_descricao: ferimentos,
      destinacao_imediata: destinacao,
      status_sanitario: 'Em Quarentena',
      imagem_url: imagemUrl
    };

    try {
      let url = `${API_BASE}/resgates`;
      let metodo = 'POST';

      if (idEdicao) {
        url = `${API_BASE}/resgates/${idEdicao}`;
        metodo = 'PUT';
      }

      const response = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const erroJson = await response.json();
        throw new Error(erroJson.erro || 'Falha ao salvar');
      }

      const resultado = await response.json();

      if (idEdicao) {
        mostrarNotificacao(`Prontuário #${idEdicao} atualizado com sucesso!`, 'sucesso');
        cancelarEdicao();
      } else {
        mostrarNotificacao(`Animal ${nomeProvisorio} cadastrado com sucesso!`, 'sucesso');
        formResgate.reset();
        definirDataHoraPadrao();
      }

      await carregarAnimais();

    } catch (err) {
      console.error(err);
      mostrarNotificacao(`Erro ao salvar: ${err.message}`, 'erro');
    }
  }

  async function excluirAnimal(id, nome) {
    const confirmar = confirm(`Deseja excluir o prontuário de "${nome}" (#${id})?`);
    if (!confirmar) return;

    try {
      const response = await fetch(`${API_BASE}/resgates/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const erroJson = await response.json();
        throw new Error(erroJson.erro || 'Erro ao excluir');
      }

      mostrarNotificacao(`Prontuário de ${nome} (#${id}) removido!`, 'sucesso');
      await carregarAnimais();
    } catch (err) {
      console.error(err);
      mostrarNotificacao(`Erro ao excluir: ${err.message}`, 'erro');
    }
  }

  async function editarAnimal(id) {
    try {
      const response = await fetch(`${API_BASE}/resgates/${id}`);
      if (!response.ok) throw new Error('Não foi possível carregar os dados.');

      const item = await response.json();

      if (inputIdEdicao) inputIdEdicao.value = item.id;
      document.getElementById('resgate-nome-provisorio').value = item.nome_provisorio || '';
      document.getElementById('resgate-especie').value = item.especie || 'canino';
      document.getElementById('resgate-sexo').value = item.sexo || 'macho';
      document.getElementById('resgate-idade-estimada').value = item.idade_estimada || 'adulto';
      document.getElementById('resgate-porte').value = item.porte_peso || '';
      document.getElementById('resgate-pelagem').value = item.pelagem || '';
      document.getElementById('resgate-microchip').value = item.microchip || '';
      if (item.data_hora_resgate) {
        document.getElementById('resgate-data-hora').value = item.data_hora_resgate;
      }
      document.getElementById('resgate-endereco').value = item.endereco_resgate || '';
      document.getElementById('resgate-motivo').value = item.motivo_recolhimento || 'abandono-rua';
      document.getElementById('resgate-responsavel').value = item.responsavel_transporte || '';
      document.getElementById('clinica-escore-corporal').value = item.escore_corporal || 3;
      document.getElementById('clinica-temperatura').value = item.temperatura_retal || 38.5;
      document.getElementById('clinica-parasitas').value = item.presenca_parasitas || 'nenhum';
      document.getElementById('clinica-ferimentos').value = item.ferimentos_descricao || '';
      document.getElementById('clinica-destinacao').value = item.destinacao_imediata || 'baia-quarentena-a';

      const elImg = document.getElementById('resgate-imagem-url');
      if (elImg) elImg.value = item.imagem_url || '';

      if (btnSubmit) {
        btnSubmit.textContent = `Salvar Alterações (#${item.id})`;
        btnSubmit.style.background = '#0288d1';
      }
      if (btnCancelarEdicao) {
        btnCancelarEdicao.style.display = 'inline-block';
      }

      const tituloForm = document.getElementById('titulo-formulario');
      if (tituloForm) {
        tituloForm.textContent = `Editando Registro #${item.id} (${item.nome_provisorio})`;
      }

      formResgate.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.getElementById('resgate-nome-provisorio').focus();

    } catch (err) {
      mostrarNotificacao(`Erro: ${err.message}`, 'erro');
    }
  }

  function cancelarEdicao() {
    if (inputIdEdicao) inputIdEdicao.value = '';
    if (formResgate) formResgate.reset();
    definirDataHoraPadrao();

    if (btnSubmit) {
      btnSubmit.textContent = 'Cadastrar Resgate & Abrir Prontuário';
      btnSubmit.style.background = '';
    }
    if (btnCancelarEdicao) {
      btnCancelarEdicao.style.display = 'none';
    }
    const tituloForm = document.getElementById('titulo-formulario');
    if (tituloForm) {
      tituloForm.textContent = 'Formulário de Entrada: Admissão & Triagem Clínica Inicial';
    }
  }

  function definirDataHoraPadrao() {
    const inputDataHora = document.getElementById('resgate-data-hora');
    if (inputDataHora) {
      const agora = new Date();
      agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
      inputDataHora.value = agora.toISOString().slice(0, 16);
    }
  }

  function initFiltrosTabela() {
    const formFiltro = document.querySelector('.tabela-controle-animais form');
    const selectStatus = document.getElementById('filtro-status-clinico');
    const selectLocal = document.getElementById('filtro-local-abrigo');
    const selectEspecie = document.getElementById('filtro-especie-registro');

    const fieldset = formFiltro ? formFiltro.querySelector('fieldset') : null;
    if (fieldset && !document.getElementById('busca-rapida-tabela')) {
      const divBusca = document.createElement('div');
      divBusca.innerHTML = `
        <label for="busca-rapida-tabela">Buscar por Nome / ID / Local:</label>
        <input type="search" id="busca-rapida-tabela" placeholder="Digite para filtrar instantaneamente...">
      `;
      fieldset.insertBefore(divBusca, fieldset.firstChild);
    }

    const inputBusca = document.getElementById('busca-rapida-tabela');

    function aplicarFiltros() {
      const statusVal = selectStatus ? selectStatus.value.toLowerCase() : '';
      const localVal = selectLocal ? selectLocal.value.toLowerCase() : '';
      const especieVal = selectEspecie ? selectEspecie.value.toLowerCase() : '';
      const termoBusca = inputBusca ? inputBusca.value.trim().toLowerCase() : '';

      const filtrados = listaRegistrosCache.filter(item => {
        const textoCompleto = JSON.stringify(item).toLowerCase();

        if (termoBusca && !textoCompleto.includes(termoBusca)) return false;

        if (especieVal && item.especie !== especieVal) return false;

        if (statusVal) {
          const st = (item.status_sanitario || '').toLowerCase();
          if (statusVal === 'quarentena' && !st.includes('quarentena')) return false;
          if (statusVal === 'tratamento' && !st.includes('tratamento')) return false;
          if (statusVal === 'pos-operatorio' && !st.includes('operatório') && !st.includes('castrado')) return false;
          if (statusVal === 'apto' && !st.includes('apto')) return false;
        }

        if (localVal) {
          const loc = (item.destinacao_imediata || '').toLowerCase();
          if (localVal === 'sede-central' && !loc.includes('central') && !loc.includes('quarentena')) return false;
          if (localVal === 'lar-temp-a' && !loc.includes('planalto') && !loc.includes('temporario')) return false;
          if (localVal === 'recanto-felino' && !loc.includes('felino') && !loc.includes('gatis')) return false;
          if (localVal === 'hospital-parceiro' && !loc.includes('hospital') && !loc.includes('cirurgico')) return false;
        }

        return true;
      });

      renderizarTabela(filtrados);
    }

    if (formFiltro) {
      formFiltro.addEventListener('submit', (e) => {
        e.preventDefault();
        aplicarFiltros();
      });
      [selectStatus, selectLocal, selectEspecie].forEach(sel => {
        if (sel) sel.addEventListener('change', aplicarFiltros);
      });
      if (inputBusca) inputBusca.addEventListener('input', aplicarFiltros);
    }
  }

  function mostrarNotificacao(mensagem, tipo = 'sucesso') {
    let toast = document.getElementById('patas-toast-flutuante');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'patas-toast-flutuante';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 99999;
        padding: 14px 20px;
        border-radius: 8px;
        font-family: inherit;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        transition: opacity 0.3s ease, transform 0.3s ease;
      `;
      document.body.appendChild(toast);
    }

    if (tipo === 'sucesso') {
      toast.style.background = '#005645';
      toast.style.color = '#ffffff';
    } else {
      toast.style.background = '#d32f2f';
      toast.style.color = '#ffffff';
    }

    toast.textContent = mensagem;
    toast.style.display = 'block';
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => { toast.style.display = 'none'; }, 300);
    }, 4000);
  }

  window.PatasRegistro = {
    carregar: carregarAnimais,
    excluir: excluirAnimal,
    editar: editarAnimal,
    cancelarEdicao: cancelarEdicao
  };

  document.addEventListener('DOMContentLoaded', () => {
    tabelaCorpo = document.getElementById('tabela-animais-corpo') || document.querySelector('.tabela-controle-animais tbody');
    formResgate = document.getElementById('form-resgate') || document.querySelector('.formulario-admissao-resgate form');
    inputIdEdicao = document.getElementById('resgate-id-edicao');
    btnSubmit = document.getElementById('btn-submit-resgate') || (formResgate ? formResgate.querySelector('button[type="submit"]') : null);
    btnCancelarEdicao = document.getElementById('btn-cancelar-edicao');

    if (btnCancelarEdicao) {
      btnCancelarEdicao.addEventListener('click', cancelarEdicao);
    }

    if (formResgate) {
      formResgate.addEventListener('submit', salvarFormulario);
    }

    definirDataHoraPadrao();
    verificarStatusServidor();
    carregarAnimais();
    initFiltrosTabela();
  });
})();
