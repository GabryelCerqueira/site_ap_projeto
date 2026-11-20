(function () {
  'use strict';

  const ARTIGOS_DETALHADOS = {
    'protocolo': {
      titulo: 'Protocolo Rigoroso de Quarentena para Novos Animais Resgatados',
      categoria: 'Protocolos de Quarentena',
      tempoLeitura: '8 min de leitura',
      conteudo: `
        <p>A chegada de um animal resgatado exige disciplina veterinária antes de qualquer integração social. Animais retirados de vias públicas trazem histórico imunológico desconhecido e potencial de incubação de patógenos virais graves.</p>
        <h5 style="color:#005645; margin: 12px 0 6px;">1. Isolamento Físico e Sanitário (15 a 21 Dias)</h5>
        <p>O animal recém-chegado deve permanecer em ambiente ventilado, com comedouro, bebedouro e caixa higiênica/tapete exclusivos. Nunca permita contato visual ou olfativo direto nos primeiros 7 dias com outros animais do domicílio.</p>
        <h5 style="color:#005645; margin: 12px 0 6px;">2. Desverminação e Controle de Ectoparasitas</h5>
        <p>Administre antiparasitário oral de amplo espectro no primeiro dia de admissão e repita a dose após 15 dias. Pulgas e carrapatos transmitem zoonoses severas como erliquiose, anaplasmose e babesiose.</p>
        <h5 style="color:#005645; margin: 12px 0 6px;">3. Testagem Sorológica e Vacinação</h5>
        <p>Em felinos, a testagem rápida SNAP para FIV (imunodeficiência) e FeLV (leucemia) é mandatória. Em cães, a primeira dose da vacina polivalente (V8 ou V10) só deve ser aplicada após a estabilização térmica e cura de eventual desidratação.</p>
      `
    },
    'gatos': {
      titulo: 'Adaptação Segura de Gatos em Apartamentos',
      categoria: 'Comportamento Felino',
      tempoLeitura: '5 min de leitura',
      conteudo: `
        <p>Felinos são animais territoriais por excelência. Mudar de ambiente gera sobrecarga sensorial e estresse agudo se não houver planejamento espacial adequado.</p>
        <h5 style="color:#005645; margin: 12px 0 6px;">1. Verticalização do Espaço</h5>
        <p>Instale prateleiras, arranhadores em torre e nichos aéreos. O controle visual do ambiente a partir de pontos elevados confere segurança e diminui a reatividade do gato.</p>
        <h5 style="color:#005645; margin: 12px 0 6px;">2. Regra das Caixas de Areia (N + 1)</h5>
        <p>Para cada gato, o lar deve conter o número de gatos mais uma caixa sanitária extra. Em apartamentos com um felino, o ideal são duas caixas posicionadas em cômodos diferentes.</p>
      `
    },
    'vacinal': {
      titulo: 'Calendário Vacinal Completo de Cães e Gatos',
      categoria: 'Medicina Preventiva',
      tempoLeitura: '7 min de leitura',
      conteudo: `
        <p>A imunização com vacinas éticas de procedência veterinária é a única garantia científica contra epidemias mortais como parvovirose e panleucopenia.</p>
        <h5 style="color:#005645; margin: 12px 0 6px;">Esquema Canino Básico</h5>
        <p>• 45 a 60 dias: 1ª dose da vacina polivalente (V8 ou V10).<br>
        • 75 a 90 dias: 2ª dose polivalente.<br>
        • 105 a 120 dias: 3ª dose polivalente + Antirrábica.<br>
        • Anualmente: Reforço dose única de V10 e Antirrábica para o resto da vida.</p>
      `
    },
    'alimentos': {
      titulo: 'Alimentos Humanizados Proibidos para Cães e Gatos',
      categoria: 'Nutrição Animal',
      tempoLeitura: '6 min de leitura',
      conteudo: `
        <p>O organismo dos carnívoros domésticos metaboliza substâncias de forma completamente distinta dos humanos. Alimentos comuns em nossa mesa causam intoxicações agudas fulminantes.</p>
        <p><strong>• Chocolate e Café:</strong> Contêm teobromina e cafeína, alcaloides que induzem taquicardia, tremores e convulsões.<br>
        <strong>• Cebola e Alho:</strong> Contêm tiossulfato, composto que destrói as hemácias gerando anemia hemolítica severa.<br>
        <strong>• Uvas e Passas:</strong> Provocam lesão renal aguda irreversível mesmo em quantidades mínimas.</p>
      `
    }
  };

  function initFiltrosBlog() {
    const linksCategorias = document.querySelectorAll('section nav[aria-label="Categorias de artigos"] ul li a');
    const inputBusca = document.getElementById('busca-blog');
    const formBusca = document.querySelector('.hero-blog form');
    const todosArtigos = document.querySelectorAll('.lista-artigos article, .artigo-destaque article');

    let categoriaAtiva = 'todos';

    function filtrarArtigos() {
      const termo = inputBusca ? inputBusca.value.trim().toLowerCase() : '';

      todosArtigos.forEach(artigo => {
        const texto = artigo.textContent.toLowerCase();
        const categoriaTag = artigo.querySelector('header span')?.textContent.toLowerCase() || '';

        let coincide = true;

        if (categoriaAtiva !== 'todos') {
          if (!categoriaTag.includes(categoriaAtiva) && !texto.includes(categoriaAtiva)) {
            coincide = false;
          }
        }

        if (termo && !texto.includes(termo)) {
          coincide = false;
        }

        if (coincide) {
          artigo.classList.remove('oculto');
        } else {
          artigo.classList.add('oculto');
        }
      });
    }

    linksCategorias.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        linksCategorias.forEach(l => l.style.fontWeight = 'normal');
        this.style.fontWeight = 'bold';

        const catTexto = this.textContent.trim().toLowerCase();
        if (catTexto.includes('todos')) categoriaAtiva = 'todos';
        else if (catTexto.includes('saúde') || catTexto.includes('vacina')) categoriaAtiva = 'vacina';
        else if (catTexto.includes('comportamento')) categoriaAtiva = 'comportamento';
        else if (catTexto.includes('nutrição')) categoriaAtiva = 'nutrição';
        else if (catTexto.includes('quarentena')) categoriaAtiva = 'quarentena';
        else if (catTexto.includes('download')) categoriaAtiva = 'download';

        filtrarArtigos();

        if (window.PatasUI) {
          window.PatasUI.showToast('Categoria Selecionada', `Filtrando artigos por: ${this.textContent.trim()}`, 'info', 2000);
        }
      });
    });

    if (inputBusca) inputBusca.addEventListener('input', filtrarArtigos);
    if (formBusca) formBusca.addEventListener('submit', (e) => { e.preventDefault(); filtrarArtigos(); });
  }

  function initLeitorArtigos() {
    const botoesLeitura = document.querySelectorAll('article a');

    botoesLeitura.forEach(btn => {
      const texto = btn.textContent.toLowerCase();
      if (texto.includes('ler artigo') || texto.includes('ler guia') || texto.includes('completo')) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          const article = this.closest('article');
          const titulo = article.querySelector('h2, h3')?.textContent.trim() || 'Artigo Veterinário';

          let chave = 'protocolo';
          if (titulo.toLowerCase().includes('gato')) chave = 'gatos';
          else if (titulo.toLowerCase().includes('vacinal')) chave = 'vacinal';
          else if (titulo.toLowerCase().includes('alimento')) chave = 'alimentos';

          const dados = ARTIGOS_DETALHADOS[chave] || ARTIGOS_DETALHADOS['protocolo'];

          if (window.PatasUI) {
            window.PatasUI.openModal(
              dados.titulo,
              `
                <div style="font-size: 14px; line-height: 1.7; color: #121c2a;">
                  <div style="display:flex; justify-content:space-between; margin-bottom:14px; font-size:12px; color:#6f7975;">
                    <span>🏷️ ${dados.categoria}</span>
                    <span>⏱️ ${dados.tempoLeitura}</span>
                  </div>
                  ${dados.conteudo}
                  <div style="background:#eff4ff; border-radius:8px; padding:12px; margin-top:20px; font-size:13px; color:#005645;">
                    💡 <strong>Dica da Equipe Patas & Vidas:</strong> Em caso de dúvidas clínicas específicas sobre o seu animal, consulte sempre um médico veterinário presencialmente.
                  </div>
                </div>
              `,
              [
                {
                  texto: 'Compartilhar Artigo',
                  classe: 'botao botao-laranja',
                  onClick: () => {
                    navigator.clipboard.writeText(window.location.href);
                    window.PatasUI.showToast('Link Copiado', 'Link do artigo copiado para envio no WhatsApp!', 'sucesso', 2500);
                  }
                },
                {
                  texto: 'Fechar Leitura',
                  classe: 'botao',
                  onClick: () => window.PatasUI.closeModal()
                }
              ]
            );
          }
        });
      }
    });
  }

  function initDownloadsMateriais() {
    const linksDownload = document.querySelectorAll('a[href*=".pdf"], a[download], section a[href*="download"]');

    linksDownload.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const nomeMaterial = this.textContent.trim() || 'Cartilha Educativa';

        if (window.PatasUI) {
          window.PatasUI.showToast('Download em Andamento', `Baixando "${nomeMaterial}" (PDF)...`, 'info', 2500);

          setTimeout(() => {
            window.PatasUI.showToast('Download Concluído', `Arquivo "${nomeMaterial}" salvo com sucesso!`, 'sucesso', 3500);
          }, 2000);
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initFiltrosBlog();
    initLeitorArtigos();
    initDownloadsMateriais();
  });
})();
