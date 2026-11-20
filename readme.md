# Documentação do Projeto e Site ONG

**Nome da Plataforma:** Patas & Vidas (Rede Integrada de Acolhimento e Adoção)
**Tecnologias:** HTML5 semântico, CSS3 puro e responsivo (sem frameworks como Bootstrap/Tailwind), acessibilidade WCAG 2.1 AA.
**Integrantes e Dev**: *Gabryel Gomes Cerqueira - Murilo Lemos Marques de Souza - Alexander Kenji Kurata Leirião - Pedro Henrique Andrade Santos*

---

### 1. Visão Geral e Missão
O sistema **Patas & Vidas** é uma solução web voltada para conectar ONGs e protetores independentes com adotantes conscientes, centralizando:
- Divulgação pública de animais resgatados aptos à adoção;
- Gestão e controle de resgates (local, data, equipe, condição inicial);
- Prontuário de saúde animal (controle de vacinação, vermifugação e castração);
- Fluxo de solicitação e registro de adoção com triagem;
- Área de conscientização comunitária (Blog & FAQ informativo);
- Portfólio acadêmico da equipe de desenvolvimento.

---

### 2. Identidade Visual e Guia de Estilo (Design System)
#### 2.1 Paleta de Cores
- **Primária (Verde Esperança / Acolhimento):** `#1E6F5C` (Acolhimento, natureza, saúde animal)
- **Primária Clara:** `#289672` (Botões de ação primária e badges de destaque)
- **Secundária (Laranja Calor / Vida):** `#E27D60` e `#E8A87C` (Atenção acolhedora, chamadas para ação como "Adotar Agora")
- **Neutro Claro (Fundo & Superfícies):** `#F8F9FA`, `#FFFFFF` e `#F0F4F2`
- **Neutro Escuro (Tipografia & Contrastes):** `#212529` (Alto contraste para acessibilidade WCAG AAA em leitura de corpo)
- **Bordas & Divisores:** `#DEE2E6` / `#CBD5E1`

#### 2.2 Tipografia
- **Títulos e Destaques:** Inter / Poppins / Sans-Serif moderna (pesos 600 e 700)
- **Texto Corrido:** Open Sans / System-ui (tamanho base 16px, line-height 1.6, legibilidade e clareza visual)

#### 2.3 Componentes e Padrões de Interface
1. **Header Fixo / Navegação Global:**
   - Logotipo institucional vetorizado com ícone afetivo (pata + coração).
   - Menu com links diretos: Início, Adote um Amigo, Registro de Resgates, Carteira de Vacinas, Processo de Adoção, Blog, Dúvidas (FAQ), Portfólio dos Integrantes.
   - Botão em destaque: "Quero Adotar / Ajudar".
2. **Banner Hero com Call-to-Action:** Mensagem de impacto, indicadores de impacto social (resgatados, adotados, vacinados) e busca rápida.
3. **Cards de Adoção:** Galeria com foto, tags de espécie/porte/idade, badge de vacinação/castração e ação para ver ficha completa.
4. **Tabelas Semânticas com Bordas Estilizadas:** Utilização dos conteúdos acadêmicos do 1º bimestre (tabelas semânticas `thead`, `tbody`, `tr`, `th`, `td`, listagens ordenadas e de definição).
5. **Formulários Acessíveis:** `fieldset`, `legend`, `label` associados por `for/id`, máscaras visuais e validações CSS.
6. **Rodapé Completo:** Dados institucionais, missão, links para redes sociais, Termos de Uso, Política de Privacidade e créditos da equipe acadêmica.

---

### 3. Mapa de Telas e Estrutura de Páginas
1. **Página Inicial (Home):** Hero banner, métricas de resgate, galeria de animais em destaque, como funciona o processo, depoimentos de adoção feliz.
2. **Vitrine & Ficha do Animal (Adoção):** Filtros por espécie (cão/gato), porte, idade; ficha detalhada com histórico, vacinas e formulário de interesse.
3. **Painel de Controle de Resgates & Vacinação:** Tabela de acompanhamento de resgates, datas, responsáveis, status e carteira de vacinação organizada.
4. **Educação, FAQ & Portfólio:** Seção de dúvidas frequentes sanando questões jurídicas/médicas, artigos educativos e apresentação dos integrantes do projeto.

---

### 4. Etapa 2 - Módulos Dinâmicos (Back-end Flask + SQLite3 + Front-end Fetch API)

#### 4.1 Estrutura do Projeto em 2 Pastas
```text
├── backend/
│   ├── BancodeDadosGrupo6AlexsanderPedroHenriqueMuriloLemosGabryelCerqueira.db  # Banco de Dados SQLite3
│   ├── modulos.py   # Módulo com funções SQLite (conectar, criar, inserir, apagar, consultar, alterar)
│   ├── server.py    # Servidor Flask com CORS e API REST
│   └── main.py      # Interface Console para testes rápidos dos módulos
│
└── frontend/
    ├── pages/
    │   └── registro.html  # Interface com tabela dinâmica e formulário conectado via Fetch API
    ├── js/
    │   └── registro.js    # Fetch API: GET, POST, DELETE, PUT
    ├── styles/            # Folhas de estilo CSS
    ├── assets/            # Imagens e ícones
    ├── global.css
    ├── index.html
    └── principal.html
```

#### 4.2 Como Executar o Back-end
1. **Instalar dependências (caso necessário):**
   ```bash
   pip install Flask flask_cors
   ```
2. **Iniciar o servidor da API Flask:**
   ```bash
   python backend/server.py
   ```
   *O servidor iniciará em `http://127.0.0.1:8000` com suporte total a CORS.*

3. **(Opcional) Executar a interface console:**
   ```bash
   python backend/main.py
   ```

#### 4.3 Como Utilizar o Front-end
1. Com o servidor Flask rodando, abra o arquivo `frontend/pages/registro.html` no navegador (ou via extensão Live Server do VS Code).
2. O sistema exibe o status de conexão no topo da tabela (`Flask Online`).
3. **Inclusão:** Preencha o formulário e clique em *"Cadastrar Resgate & Abrir Prontuário"*; o registro será enviado via `POST` e gravado no banco SQLite.
4. **Exibição:** A tabela carrega dinamicamente todos os registros do SQLite via `GET /resgates`.
5. **Exclusão:** Clique no botão vermelho *"Excluir"* em qualquer linha para remover o registro do banco SQLite via `DELETE /resgates/<id>`.
6. **Alteração (Opcional):** Clique em *"Editar"* em qualquer linha para carregar os dados no formulário e atualizar via `PUT /resgates/<id>`.

---
