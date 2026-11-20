(function () {
  'use strict';

  let toastContainer = null;
  function getToastContainer() {
    if (!toastContainer) {
      toastContainer = document.querySelector('.toast-container');
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        toastContainer.setAttribute('aria-live', 'polite');
        toastContainer.setAttribute('aria-atomic', 'true');
        document.body.appendChild(toastContainer);
      }
    }
    return toastContainer;
  }

  function showToast(titulo, mensagem, tipo = 'sucesso', duracao = 4500) {
    const container = getToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;

    const icones = {
      sucesso: '✓',
      erro: '✕',
      alerta: '⚠',
      info: 'ℹ'
    };

    toast.innerHTML = `
      <span class="toast-icone" aria-hidden="true">${icones[tipo] || '•'}</span>
      <div class="toast-conteudo">
        <div class="toast-titulo">${titulo}</div>
        <div class="toast-mensagem">${mensagem}</div>
      </div>
      <button type="button" class="toast-fechar" aria-label="Fechar notificação">×</button>
      <div class="toast-barra" style="animation-duration: ${duracao}ms"></div>
    `;

    const btnFechar = toast.querySelector('.toast-fechar');
    let timer = setTimeout(() => removerToast(toast), duracao);

    btnFechar.addEventListener('click', () => {
      clearTimeout(timer);
      removerToast(toast);
    });

    container.appendChild(toast);
  }

  function removerToast(toast) {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 300);
  }

  let modalOverlay = null;

  function initModal() {
    if (modalOverlay) return;
    modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.setAttribute('role', 'dialog');
    modalOverlay.setAttribute('aria-modal', 'true');
    modalOverlay.setAttribute('aria-hidden', 'true');

    modalOverlay.innerHTML = `
      <div class="modal-caixa">
        <div class="modal-cabecalho">
          <h3 id="modal-titulo">Título</h3>
          <button type="button" class="modal-btn-fechar" aria-label="Fechar modal">&times;</button>
        </div>
        <div class="modal-corpo" id="modal-corpo"></div>
        <div class="modal-rodape" id="modal-rodape"></div>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    const btnFechar = modalOverlay.querySelector('.modal-btn-fechar');
    btnFechar.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('ativo')) {
        closeModal();
      }
    });
  }

  function openModal(titulo, corpoHtml, botoes = []) {
    initModal();
    const tituloEl = document.getElementById('modal-titulo');
    const corpoEl = document.getElementById('modal-corpo');
    const rodapeEl = document.getElementById('modal-rodape');

    tituloEl.textContent = titulo;
    corpoEl.innerHTML = corpoHtml;
    rodapeEl.innerHTML = '';

    if (botoes.length === 0) {
      botoes.push({ texto: 'Fechar', classe: 'botao botao-claro', onClick: closeModal });
    }

    botoes.forEach(b => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = b.classe || 'botao';
      btn.textContent = b.texto;
      btn.addEventListener('click', () => {
        if (typeof b.onClick === 'function') b.onClick();
        else closeModal();
      });
      rodapeEl.appendChild(btn);
    });

    modalOverlay.classList.add('ativo');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('ativo');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function aplicarMascaras() {

    document.querySelectorAll('input[name*="cpf"], input#cpf, input[placeholder*="000.000"]').forEach(input => {
      input.addEventListener('input', function (e) {
        let v = e.target.value.replace(/\D/g, '').substring(0, 11);
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = v;
      });
    });

    document.querySelectorAll('input[type="tel"], input[name*="whatsapp"], input#whatsapp').forEach(input => {
      input.addEventListener('input', function (e) {
        let v = e.target.value.replace(/\D/g, '').substring(0, 11);
        if (v.length > 10) {
          v = v.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (v.length > 5) {
          v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (v.length > 2) {
          v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
        } else if (v.length > 0) {
          v = v.replace(/^(\d*)/, '($1');
        }
        e.target.value = v;
      });
    });

    document.querySelectorAll('input[name*="cep"], input#cep').forEach(input => {
      input.addEventListener('input', function (e) {
        let v = e.target.value.replace(/\D/g, '').substring(0, 8);
        v = v.replace(/^(\d{5})(\d)/, '$1-$2');
        e.target.value = v;
      });
    });
  }

  function consultarViaCep(cepLimpo, callbackSucesso, callbackErro) {
    const cepNumerico = cepLimpo.replace(/\D/g, '');
    if (cepNumerico.length !== 8) {
      if (callbackErro) callbackErro('CEP incompleto');
      return;
    }

    fetch(`https://viacep.com.br/ws/${cepNumerico}/json/`)
      .then(res => res.json())
      .then(dados => {
        if (dados.erro) {
          if (callbackErro) callbackErro('CEP não encontrado na base dos Correios');
        } else {
          if (callbackSucesso) callbackSucesso(dados);
        }
      })
      .catch(err => {
        if (callbackErro) callbackErro('Erro ao consultar CEP online');
      });
  }

  function criarBarraAcessibilidade() {
    if (document.querySelector('.barra-acessibilidade-fixa')) return;

    const barra = document.createElement('div');
    barra.className = 'barra-acessibilidade-fixa';
    barra.innerHTML = `
      <div class="painel-acessibilidade-opcoes" id="painel-acessibilidade">
        <button type="button" class="btn-opcao-acessibilidade" id="btn-toggle-contraste">
          <span>◐</span> Alto Contraste (WCAG)
        </button>
        <button type="button" class="btn-opcao-acessibilidade" id="btn-aumentar-fonte">
          <span>A+</span> Aumentar Texto
        </button>
        <button type="button" class="btn-opcao-acessibilidade" id="btn-diminuir-fonte">
          <span>A-</span> Diminuir Texto
        </button>
        <button type="button" class="btn-opcao-acessibilidade" id="btn-reset-fonte">
          <span>↺</span> Restaurar Tamanho
        </button>
      </div>
      <button type="button" class="btn-acessibilidade-item" id="btn-abrir-acessibilidade" data-tooltip="Opções de Acessibilidade" aria-label="Opções de Acessibilidade">
        ♿
      </button>
      <button type="button" class="btn-acessibilidade-item" id="btn-voltar-topo" data-tooltip="Voltar ao Topo" aria-label="Voltar ao topo da página">
        ▲
      </button>
    `;
    document.body.appendChild(barra);

    const btnAbrir = document.getElementById('btn-abrir-acessibilidade');
    const painel = document.getElementById('painel-acessibilidade');
    btnAbrir.addEventListener('click', () => {
      painel.classList.toggle('aberto');
    });

    document.addEventListener('click', (e) => {
      if (!barra.contains(e.target)) {
        painel.classList.remove('aberto');
      }
    });

    const btnContraste = document.getElementById('btn-toggle-contraste');
    const salvoContraste = localStorage.getItem('patasevidas_contraste') === 'true';
    if (salvoContraste) {
      document.body.classList.add('alto-contraste');
    }

    btnContraste.addEventListener('click', () => {
      const ativo = document.body.classList.toggle('alto-contraste');
      localStorage.setItem('patasevidas_contraste', ativo ? 'true' : 'false');
      showToast('Acessibilidade', ativo ? 'Modo Alto Contraste ativado.' : 'Modo Padrão restaurado.', 'info', 2500);
    });

    let tamanhoFonte = parseInt(localStorage.getItem('patasevidas_fonte') || '100', 10);
    if (tamanhoFonte !== 100) {
      document.documentElement.style.fontSize = `${tamanhoFonte}%`;
    }

    document.getElementById('btn-aumentar-fonte').addEventListener('click', () => {
      if (tamanhoFonte < 140) {
        tamanhoFonte += 10;
        document.documentElement.style.fontSize = `${tamanhoFonte}%`;
        localStorage.setItem('patasevidas_fonte', tamanhoFonte);
        showToast('Tamanho da Fonte', `Tamanho aumentado para ${tamanhoFonte}%`, 'info', 1800);
      }
    });

    document.getElementById('btn-diminuir-fonte').addEventListener('click', () => {
      if (tamanhoFonte > 80) {
        tamanhoFonte -= 10;
        document.documentElement.style.fontSize = `${tamanhoFonte}%`;
        localStorage.setItem('patasevidas_fonte', tamanhoFonte);
        showToast('Tamanho da Fonte', `Tamanho reduzido para ${tamanhoFonte}%`, 'info', 1800);
      }
    });

    document.getElementById('btn-reset-fonte').addEventListener('click', () => {
      tamanhoFonte = 100;
      document.documentElement.style.fontSize = '100%';
      localStorage.setItem('patasevidas_fonte', 100);
      showToast('Tamanho da Fonte', 'Tamanho original restaurado.', 'info', 1800);
    });

    const btnTopo = document.getElementById('btn-voltar-topo');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        btnTopo.classList.add('visivel');
      } else {
        btnTopo.classList.remove('visivel');
      }
    });

    btnTopo.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    criarBarraAcessibilidade();
    aplicarMascaras();
  });

  window.PatasUI = {
    showToast,
    openModal,
    closeModal,
    aplicarMascaras,
    consultarViaCep
  };
})();
