// ========================================================================
//   Projeto: Meu Streaming
//   Autores: Ismael Bayard Soares Gomes, Eduardo Monteiro
//   Arquivo: [script.js].html
//   Descrição: Página do projeto educacional de plataforma de streaming
//   Data: 2025
//   Observações: Este arquivo faz parte de um protótipo front-end desenvolvido
//   para fins acadêmicos e demonstração visual. Não contém backend real.
// ========================================================================

// =================================================================
// ====================== SISTEMA DE PLANOS =======================
// =================================================================

// Configuração dos planos disponíveis
const PLANOS_CONFIG = {
  basico: {
    nome: "Básico",
    preco: "19.90",
    descricao: "Qualidade HD (720p) • 1 tela • Sem 4K",
  },
  padrao: {
    nome: "Padrão",
    preco: "29.90",
    descricao: "Full HD (1080p) • 2 telas • Download offline",
  },
  premium: {
    nome: "Premium",
    preco: "49.90",
    descricao: "4K + HDR • 4 telas • Download offline",
  },
};

// =================================================================
// ==================== SISTEMA DE QR CODE =======================
// =================================================================

class QRCodeGenerator {
  constructor() {
    this.baseURL = "https://api.qrserver.com/v1/create-qr-code/";
    this.defaultSize = "200x200";
  }

  /**
   * Gera o texto do PIX fictício baseado no plano selecionado
   * @param {string} plano - Nome do plano (basico, padrao, premium)
   * @param {string} valor - Valor da mensalidade
   * @returns {string} Texto formatado para o PIX
   */
  gerarTextoPix(plano, valor) {
    const config = PLANOS_CONFIG[plano];
    const timestamp = new Date().toLocaleString("pt-BR");

    return `PIX - Meu Streaming
Plano: ${config.nome}
Valor: R$ ${valor}
Data: ${timestamp}

**PAGAMENTO FICTÍCIO**
Este é um QR Code de demonstração.
Nenhum pagamento real será processado.

ID: ${this.gerarID()}`;
  }

  /**
   * Gera um ID único para o pagamento (simulado)
   * @returns {string} ID único
   */
  gerarID() {
    return (
      "MS" + Date.now().toString(36) + Math.random().toString(36).substr(2)
    );
  }

  /**
   * Constrói a URL da API do QR Code
   * @param {string} texto - Texto para codificar no QR
   * @param {string} size - Tamanho da imagem (opcional)
   * @returns {string} URL completa da API
   */
  construirURL(texto, size = this.defaultSize) {
    const textoEncoded = encodeURIComponent(texto);
    return `${this.baseURL}?size=${size}&data=${textoEncoded}&charset-source=UTF-8&charset-target=UTF-8`;
  }

  /**
   * Gera e exibe o QR Code na página
   * @param {string} plano - Plano selecionado
   * @param {string} containerId - ID do container onde inserir o QR
   */
  async gerarQRCode(plano, containerId = "qrcode") {
    try {
      const config = PLANOS_CONFIG[plano];
      if (!config) {
        throw new Error(`Plano "${plano}" não encontrado`);
      }

      const container = document.getElementById(containerId);
      if (!container) {
        throw new Error(`Container "${containerId}" não encontrado`);
      }

      // Mostra loading
      container.innerHTML = `
        <div class="d-flex justify-content-center align-items-center" style="height: 200px;">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Gerando QR Code...</span>
          </div>
        </div>
      `;

      // Gera o texto e a URL
      const textoPix = this.gerarTextoPix(plano, config.preco);
      const qrURL = this.construirURL(textoPix);

      // Simula delay de carregamento (opcional, para UX)
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Cria e configura a imagem
      const img = document.createElement("img");
      img.src = qrURL;
      img.alt = `QR Code para pagamento do plano ${config.nome}`;
      img.className = "img-fluid border rounded";
      img.style.maxWidth = "200px";
      img.style.height = "auto";

      // Adiciona tratamento de erro na imagem
      img.onerror = () => {
        container.innerHTML = `
          <div class="alert alert-warning text-center">
            <i class="fas fa-exclamation-triangle"></i>
            <p class="mb-0">Erro ao carregar QR Code</p>
            <button class="btn btn-sm btn-outline-primary mt-2" onclick="window.qrGenerator.gerarQRCode('${plano}', '${containerId}')">
              Tentar novamente
            </button>
          </div>
        `;
      };

      // Substitui o loading pela imagem
      container.innerHTML = "";
      container.appendChild(img);

      // Atualiza informações adicionais na página
      this.atualizarInformacoesPagamento(config);
    } catch (error) {
      console.error("Erro ao gerar QR Code:", error);
      this.exibirErro(containerId, error.message);
    }
  }

  /**
   * Atualiza as informações de pagamento na página
   * @param {Object} config - Configuração do plano
   */
  atualizarInformacoesPagamento(config) {
    // Atualiza valor no QR
    const qrAmount = document.getElementById("qr-amount");
    if (qrAmount) {
      qrAmount.textContent = config.preco;
    }

    // Atualiza título da página
    document.title = `Pagamento - Plano ${config.nome} - Meu Streaming`;
  }

  /**
   * Exibe mensagem de erro
   * @param {string} containerId - ID do container
   * @param {string} mensagem - Mensagem de erro
   */
  exibirErro(containerId, mensagem) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="alert alert-danger text-center">
          <i class="fas fa-exclamation-circle"></i>
          <p class="mb-2"><strong>Erro:</strong> ${mensagem}</p>
          <button class="btn btn-sm btn-primary" onclick="location.reload()">
            Recarregar página
          </button>
        </div>
      `;
    }
  }
}

// =================================================================
// =================== GERENCIAMENTO DE PÁGINAS ==================
// =================================================================

class PaginaManager {
  constructor() {
    this.qrGenerator = new QRCodeGenerator();
    this.initEventListeners();
  }

  /**
   * Inicializa os event listeners baseado na página atual
   */
  initEventListeners() {
    // Detecta qual página está carregada
    const currentPage = this.detectarPaginaAtual();

    switch (currentPage) {
      case "bem-vindo":
        this.initBemVindo();
        break;
      case "pagamento":
        this.initPagamento();
        break;
      case "catalogo":
        this.initCatalogo();
        break;
      case "ajuda":
        this.initAjuda();
        break;
    }
  }

  /**
   * Detecta qual página está sendo carregada
   * @returns {string} Nome da página
   */
  detectarPaginaAtual() {
    const path = window.location.pathname.toLowerCase();
    const filename = path.substring(path.lastIndexOf("/") + 1);

    if (filename.includes("bem_vindo") || filename === "" || filename === "/") {
      return "bem-vindo";
    } else if (filename.includes("pagamento")) {
      return "pagamento";
    } else if (filename.includes("catalogo")) {
      return "catalogo";
    } else if (filename.includes("ajuda")) {
      return "ajuda";
    }

    return "desconhecida";
  }

  /**
   * Inicialização específica da página Bem-vindo
   */
  initBemVindo() {
    console.log("Inicializando página Bem-vindo...");

    // Configura botões de planos
    this.configurarBotoesPlanos();

    // Configura newsletter
    this.configurarNewsletter();

    // Configura FAQ
    this.configurarFAQ();
  }

  /**
   * Configura os botões de seleção de planos
   */
  configurarBotoesPlanos() {
    const botoesPlanos = document.querySelectorAll('a[href*="Pagamento.html"]');

    botoesPlanos.forEach((botao) => {
      botao.addEventListener("click", (e) => {
        // Pega os dados do plano do próprio elemento ou data attributes
        const planoElement = botao.closest(".card-plan");
        let plano = "basico"; // fallback

        // Tenta extrair o plano da URL
        const href = botao.getAttribute("href");
        const urlParams = new URLSearchParams(href.split("?")[1] || "");
        const planoFromURL = urlParams.get("plano");

        if (planoFromURL) {
          plano = planoFromURL;
        } else if (planoElement) {
          // Tenta extrair do texto do card
          const titulo = planoElement.querySelector("h4");
          if (titulo) {
            const textoTitulo = titulo.textContent.toLowerCase();
            if (textoTitulo.includes("básico")) plano = "basico";
            else if (textoTitulo.includes("padrão")) plano = "padrao";
            else if (textoTitulo.includes("premium")) plano = "premium";
          }
        }

        console.log(`Plano selecionado: ${plano}`);

        // Armazena a seleção para a página de pagamento
        sessionStorage.setItem("planoSelecionado", plano);
      });
    });
  }

  /**
   * Inicialização específica da página de Pagamento
   */
  initPagamento() {
    console.log("Inicializando página de Pagamento...");

    // Obtém o plano da URL ou sessionStorage
    const plano = this.obterPlanoSelecionado();

    if (plano) {
      this.carregarDadosPlano(plano);
      this.atualizarEtapasPagamento();

      // Gera o QR Code após um pequeno delay para garantir que a página carregou
      setTimeout(() => {
        this.qrGenerator.gerarQRCode(plano);
      }, 500);
    } else {
      this.redirecionarParaHome("Nenhum plano foi selecionado.");
    }
  }

  /**
   * Obtém o plano selecionado da URL ou sessionStorage
   * @returns {string|null} Plano selecionado
   */
  obterPlanoSelecionado() {
    // Primeiro tenta obter da URL
    const urlParams = new URLSearchParams(window.location.search);
    let plano = urlParams.get("plano");

    // Se não encontrou na URL, tenta no sessionStorage
    if (!plano) {
      plano = sessionStorage.getItem("planoSelecionado");
    }

    // Valida se o plano existe
    if (plano && PLANOS_CONFIG[plano]) {
      return plano;
    }

    return null;
  }

  /**
   * Carrega e exibe os dados do plano selecionado
   * @param {string} plano - Plano selecionado
   */
  carregarDadosPlano(plano) {
    const config = PLANOS_CONFIG[plano];

    // Atualiza nome do plano
    const planoNome = document.getElementById("plano-selecionado");
    if (planoNome) {
      planoNome.textContent = `Plano ${config.nome}`;
    }

    // Atualiza valor
    const valorPlano = document.getElementById("valor-plano");
    if (valorPlano) {
      valorPlano.textContent = config.preco;
    }

    // Atualiza valor no QR
    const qrAmount = document.getElementById("qr-amount");
    if (qrAmount) {
      qrAmount.textContent = config.preco;
    }

    console.log(`Dados do plano ${config.nome} carregados com sucesso`);
  }

  /**
   * Atualiza as etapas visuais do pagamento
   */
  atualizarEtapasPagamento() {
    const etapas = ["etapa-plano", "etapa-pagamento", "etapa-confirmacao"];

    // Marca as duas primeiras etapas como concluídas/ativas
    const etapaPlano = document.getElementById("etapa-plano");
    const etapaPagamento = document.getElementById("etapa-pagamento");

    if (etapaPlano) {
      etapaPlano.classList.add("completed");
    }

    if (etapaPagamento) {
      etapaPagamento.classList.add("active");
    }
  }

  /**
   * Redireciona para a home com mensagem de erro
   * @param {string} mensagem - Mensagem de erro
   */
  redirecionarParaHome(mensagem) {
    console.error(mensagem);
    alert(mensagem);
    window.location.href = "Bem_Vindo.html";
  }

  /**
   * Configuração do formulário de newsletter
   */
  configurarNewsletter() {
    const formNewsletter = document.querySelector('form[action*="newsletter"]');

    if (formNewsletter) {
      formNewsletter.addEventListener("submit", (e) => {
        e.preventDefault();

        const emailInput = formNewsletter.querySelector('input[type="email"]');
        const email = emailInput.value.trim();

        if (this.validarEmail(email)) {
          this.processarInscricaoNewsletter(email, emailInput);
        } else {
          this.exibirMensagemNewsletter(
            "Por favor, insira um e-mail válido.",
            "danger"
          );
        }
      });
    }
  }

  /**
   * Valida formato de e-mail
   * @param {string} email - E-mail para validar
   * @returns {boolean} True se válido
   */
  validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Processa a inscrição na newsletter
   * @param {string} email - E-mail do usuário
   * @param {HTMLElement} inputElement - Elemento do input
   */
  processarInscricaoNewsletter(email, inputElement) {
    // Simula processamento
    this.exibirMensagemNewsletter("Processando...", "info");

    setTimeout(() => {
      this.exibirMensagemNewsletter(
        "Obrigado por se inscrever! Você receberá nossas novidades em breve.",
        "success"
      );
      inputElement.value = "";
    }, 1000);
  }

  /**
   * Exibe mensagem da newsletter
   * @param {string} mensagem - Mensagem para exibir
   * @param {string} tipo - Tipo da mensagem (success, danger, info)
   */
  exibirMensagemNewsletter(mensagem, tipo) {
    // Remove mensagens anteriores
    const mensagensExistentes = document.querySelectorAll(
      ".newsletter-message"
    );
    mensagensExistentes.forEach((msg) => msg.remove());

    // Cria nova mensagem
    const div = document.createElement("div");
    div.className = `alert alert-${tipo} newsletter-message mt-2`;
    div.textContent = mensagem;

    // Adiciona após o formulário
    const form = document.querySelector('form[action*="newsletter"]');
    if (form) {
      form.parentNode.insertBefore(div, form.nextSibling);

      // Remove automaticamente após 5 segundos se for mensagem de sucesso
      if (tipo === "success") {
        setTimeout(() => {
          if (div.parentNode) {
            div.remove();
          }
        }, 5000);
      }
    }
  }

  /**
   * Configuração do FAQ (Accordion)
   */
  configurarFAQ() {
    // O Bootstrap já gerencia o accordion, mas podemos adicionar funcionalidades extras
    const accordionButtons = document.querySelectorAll(".accordion-button");

    accordionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        console.log("FAQ item clicado:", button.textContent.trim());
      });
    });
  }

  /**
   * Inicialização da página de catálogo
   */
  initCatalogo() {
    console.log("Inicializando página de Catálogo...");
    // Aqui serão implementadas as funcionalidades do catálogo na próxima etapa
  }

  /**
   * Inicialização da página de ajuda
   */
  initAjuda() {
    console.log("Inicializando página de Ajuda...");
    // Aqui serão implementadas as funcionalidades de acessibilidade
  }
}

// =================================================================
// ==================== INICIALIZAÇÃO ===========================
// =================================================================

// Instância global do gerador de QR Code (para uso em callbacks)
window.qrGenerator = new QRCodeGenerator();

// Aguarda o DOM carregar completamente
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM carregado, inicializando aplicação...");

  // Cria instância do gerenciador de páginas
  window.paginaManager = new PaginaManager();

  console.log("Aplicação inicializada com sucesso!");
});

// =================================================================
// ==================== FUNÇÕES UTILITÁRIAS ====================
// =================================================================

/**
 * Função global para recarregar QR Code (pode ser chamada de onclick)
 * @param {string} plano - Plano para gerar QR
 */
window.recarregarQRCode = function (plano) {
  if (window.qrGenerator) {
    window.qrGenerator.gerarQRCode(plano);
  }
};

/**
 * Função para debug - exibe informações do sistema
 */
window.debugInfo = function () {
  console.log("=== DEBUG INFO ===");
  console.log("Página atual:", window.paginaManager?.detectarPaginaAtual());
  console.log(
    "Plano selecionado (URL):",
    new URLSearchParams(window.location.search).get("plano")
  );
  console.log(
    "Plano selecionado (Session):",
    sessionStorage.getItem("planoSelecionado")
  );
  console.log("Planos disponíveis:", Object.keys(PLANOS_CONFIG));
  console.log("==================");
};

// Script adicional para atualizar benefícios baseado no plano
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const plano =
    urlParams.get("plano") ||
    sessionStorage.getItem("planoSelecionado") ||
    "basico";

  // Configuração dos benefícios por plano
  const beneficiosPorPlano = {
    basico: [
      '<i class="fas fa-hd-video me-2 text-primary"></i>Qualidade HD (720p)',
      '<i class="fas fa-tv me-2 text-primary"></i>1 tela simultânea',
      '<i class="fas fa-mobile-alt me-2 text-muted"></i>Acesso mobile e web',
    ],
    padrao: [
      '<i class="fas fa-hd-video me-2 text-primary"></i>Full HD (1080p)',
      '<i class="fas fa-tv me-2 text-primary"></i>2 telas simultâneas',
      '<i class="fas fa-download me-2 text-primary"></i>Download offline',
      '<i class="fas fa-mobile-alt me-2 text-primary"></i>Todos os dispositivos',
    ],
    premium: [
      '<i class="fas fa-gem me-2 text-warning"></i>4K + HDR',
      '<i class="fas fa-tv me-2 text-primary"></i>4 telas simultâneas',
      '<i class="fas fa-download me-2 text-primary"></i>Download offline',
      '<i class="fas fa-volume-up me-2 text-primary"></i>Audio Dolby Atmos',
      '<i class="fas fa-crown me-2 text-warning"></i>Conteúdo exclusivo',
    ],
  };

  // Atualiza benefícios na página
  const beneficiosContainer = document.getElementById("beneficios-plano");
  if (beneficiosContainer && beneficiosPorPlano[plano]) {
    beneficiosContainer.innerHTML = beneficiosPorPlano[plano]
      .map((beneficio) => `<li class="mb-2">${beneficio}</li>`)
      .join("");
  }

  // Atualiza data de vencimento para hoje
  const paymentDue = document.getElementById("payment-due");
  if (paymentDue) {
    const hoje = new Date();
    const opcoes = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    paymentDue.textContent = `Hoje, 23:59`;
  }
});

// =================================================================
// =================== INTEGRAÇÃO API TMDB =======================
// =================================================================

// CONFIGURAÇÃO DA API
const TMDB_CONFIG = {
  apiKey: "76f602a068980cf0c3f918176a5f3214",
  baseURL: "https://api.themoviedb.org/3",

  imageBaseURL: "https://image.tmdb.org/t/w500", // Para pôsteres
  language: "pt-BR",
};

class TMDbAPI {
  constructor() {
    this.cache = new Map(); // Cache simples para otimização
  }

  /**
   * Constrói URL da API com parâmetros
   * @param {string} endpoint - Endpoint da API
   * @param {Object} params - Parâmetros adicionais
   * @returns {string} URL completa
   */
  construirURL(endpoint, params = {}) {
    const url = new URL(`${TMDB_CONFIG.baseURL}${endpoint}`);
    url.searchParams.append("api_key", TMDB_CONFIG.apiKey);
    url.searchParams.append("language", TMDB_CONFIG.language);

    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });

    return url.toString();
  }

  /**
   * Faz requisição para a API com tratamento de erro
   * @param {string} url - URL da requisição
   * @returns {Object} Dados da API
   */
  async fazerRequisicao(url) {
    const cacheKey = url;

    // Verifica cache primeiro
    if (this.cache.has(cacheKey)) {
      console.log("Dados recuperados do cache:", cacheKey);
      return this.cache.get(cacheKey);
    }

    try {
      console.log("Fazendo requisição para:", url);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Erro HTTP: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();

      // Armazena no cache por 5 minutos
      this.cache.set(cacheKey, data);
      setTimeout(() => this.cache.delete(cacheKey), 300000);

      return data;
    } catch (error) {
      console.error("Erro na requisição TMDb:", error);
      throw new Error(`Falha ao conectar com TMDb: ${error.message}`);
    }
  }

  /**
   * Busca filmes populares
   * @param {number} page - Página dos resultados
   * @returns {Object} Dados dos filmes populares
   */
  async buscarFilmesPopulares(page = 1) {
    const url = this.construirURL("/movie/popular", { page });
    return await this.fazerRequisicao(url);
  }

  /**
   * Busca filmes por query de pesquisa
   * @param {string} query - Termo de busca
   * @param {number} page - Página dos resultados
   * @returns {Object} Resultados da busca
   */
  async buscarFilmesPorQuery(query, page = 1) {
    if (!query.trim()) {
      throw new Error("Query de busca não pode estar vazia");
    }

    const url = this.construirURL("/search/movie", {
      query: encodeURIComponent(query.trim()),
      page,
    });
    return await this.fazerRequisicao(url);
  }

  /**
   * Busca filmes por gênero
   * @param {number} genreId - ID do gênero
   * @param {number} page - Página dos resultados
   * @returns {Object} Filmes do gênero
   */
  async buscarFilmesPorGenero(genreId, page = 1) {
    const url = this.construirURL("/discover/movie", {
      with_genres: genreId,
      sort_by: "popularity.desc",
      page,
    });
    return await this.fazerRequisicao(url);
  }

  /**
   * Busca lista de gêneros disponíveis
   * @returns {Object} Lista de gêneros
   */
  async buscarGeneros() {
    const url = this.construirURL("/genre/movie/list");
    return await this.fazerRequisicao(url);
  }

  /**
   * Constrói URL completa da imagem
   * @param {string} posterPath - Caminho do pôster
   * @returns {string} URL completa da imagem
   */
  // Função corrigida e tolerante
  construirURLImagem(posterPath) {
    // fallback local (melhor do que depender de via.placeholder.com)
    const placeholderLocal = "assets/img/fallback.jpg"; // garanta que exista esse arquivo no projeto

    if (!posterPath) return placeholderLocal;

    // limpa barras indevidas
    const cleanPath = posterPath.startsWith("/")
      ? posterPath
      : "/" + posterPath;

    // base correta do TMDb: /t/p/<size>/<path>
    // use apenas '/t/p' como base e adicione o tamanho desejado
    const base = "https://image.tmdb.org/t/p";
    const size = "/w500"; // você pode mudar para '/original', '/w780', etc.
    return `${base}${size}${cleanPath}`;
  }

  /**
   * Formata dados do filme para uso na aplicação
   * @param {Object} movie - Dados brutos do filme da API
   * @returns {Object} Dados formatados
   */
  formatarDadosFilme(movie) {
    // Dentro de TMDbAPI.formatarDadosFilme(movie) — adicione no topo
    console.log(
      "TMDb movie:",
      movie.id,
      movie.title,
      "poster_path:",
      movie.poster_path
    );
    const posterURL = this.construirURLImagem(movie.poster_path);
    console.log("URL do poster construído:", posterURL);

    return {
      id: movie.id,
      titulo: movie.title || "Título não disponível",
      sinopse: movie.overview || "Sinopse não disponível.",
      poster: this.construirURLImagem(movie.poster_path),
      dataLancamento: movie.release_date || "",
      nota: movie.vote_average || 0,
      generos: movie.genre_ids || [],
      popularidade: movie.popularity || 0,
    };
  }
}

// =================================================================
// ============== EXTENSÃO DA CLASSE PAGINAMANAGER ===============
// =================================================================

// Adiciona métodos de catálogo à classe existente
PaginaManager.prototype.initCatalogo = function () {
  console.log("Inicializando página de Catálogo com API TMDb...");

  // Inicializa a API TMDb
  this.tmdbAPI = new TMDbAPI();
  this.filmesCache = [];
  this.paginaAtual = 1;
  this.ultimaBusca = null;
  this.generoAtual = null;

  // Configura elementos da interface
  this.configurarElementosCatalogo();

  // Carrega conteúdo inicial
  this.carregarConteudoInicial();
};

PaginaManager.prototype.configurarElementosCatalogo = function () {
  // Elementos da interface
  this.searchInput = document.getElementById("search-input");
  this.searchButton = document.getElementById("search-button");
  this.genreFilter = document.getElementById("genre-filter");
  this.resultsGrid = document.getElementById("results-grid");

  // Event listeners
  if (this.searchButton) {
    this.searchButton.addEventListener("click", () => this.executarBusca());
  }

  if (this.searchInput) {
    this.searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.executarBusca();
      }
    });
  }

  if (this.genreFilter) {
    this.genreFilter.addEventListener("change", (e) => {
      this.filtrarPorGenero(e.target.value);
    });
  }

  console.log("Event listeners do catálogo configurados");
};

PaginaManager.prototype.carregarConteudoInicial = async function () {
  try {
    // Mostra loading
    this.mostrarLoading();

    // Carrega gêneros primeiro
    await this.carregarGeneros();

    // Carrega filmes populares
    await this.carregarFilmesPopulares();
  } catch (error) {
    console.error("Erro ao carregar conteúdo inicial:", error);
    this.mostrarErro("Erro ao carregar catálogo. Verifique sua conexão.");
  }
};

PaginaManager.prototype.carregarGeneros = async function () {
  try {
    const data = await this.tmdbAPI.buscarGeneros();
    this.popularSelectGeneros(data.genres);
    console.log(`${data.genres.length} gêneros carregados`);
  } catch (error) {
    console.error("Erro ao carregar gêneros:", error);
    // Mantém gêneros estáticos se API falhar
  }
};

PaginaManager.prototype.popularSelectGeneros = function (generos) {
  if (!this.genreFilter) return;

  // Limpa opções existentes (exceto "Todos")
  const opcaoTodos = this.genreFilter.querySelector('option[value=""]');
  this.genreFilter.innerHTML = "";

  // Readiciona "Todos"
  const optionTodos = document.createElement("option");
  optionTodos.value = "";
  optionTodos.textContent = "Todos";
  optionTodos.selected = true;
  this.genreFilter.appendChild(optionTodos);

  // Adiciona gêneros da API
  generos.forEach((genero) => {
    const option = document.createElement("option");
    option.value = genero.id;
    option.textContent = genero.name;
    this.genreFilter.appendChild(option);
  });
};

PaginaManager.prototype.carregarFilmesPopulares = async function () {
  try {
    const data = await this.tmdbAPI.buscarFilmesPopulares();
    const filmesFormatados = data.results.map((movie) =>
      this.tmdbAPI.formatarDadosFilme(movie)
    );

    this.filmesCache = filmesFormatados;
    this.exibirFilmes(filmesFormatados);

    console.log(`${filmesFormatados.length} filmes populares carregados`);
  } catch (error) {
    console.error("Erro ao carregar filmes populares:", error);
    this.mostrarErro("Não foi possível carregar os filmes populares.");
  }
};

PaginaManager.prototype.executarBusca = async function () {
  const query = this.searchInput?.value?.trim();

  if (!query) {
    // Se busca vazia, volta para populares
    await this.carregarFilmesPopulares();
    this.ultimaBusca = null;
    return;
  }

  try {
    this.mostrarLoading();

    const data = await this.tmdbAPI.buscarFilmesPorQuery(query);
    const filmesFormatados = data.results.map((movie) =>
      this.tmdbAPI.formatarDadosFilme(movie)
    );

    this.filmesCache = filmesFormatados;
    this.ultimaBusca = query;
    this.exibirFilmes(filmesFormatados);

    console.log(`Busca por "${query}": ${filmesFormatados.length} resultados`);

    if (filmesFormatados.length === 0) {
      this.mostrarSemResultados(`Nenhum filme encontrado para "${query}"`);
    }
  } catch (error) {
    console.error("Erro na busca:", error);
    this.mostrarErro(`Erro ao buscar "${query}". Tente novamente.`);
  }
};

PaginaManager.prototype.filtrarPorGenero = async function (genreId) {
  if (!genreId || genreId === "") {
    // "Todos" selecionado
    await this.carregarFilmesPopulares();
    this.generoAtual = null;
    return;
  }

  try {
    this.mostrarLoading();

    const data = await this.tmdbAPI.buscarFilmesPorGenero(genreId);
    const filmesFormatados = data.results.map((movie) =>
      this.tmdbAPI.formatarDadosFilme(movie)
    );

    this.filmesCache = filmesFormatados;
    this.generoAtual = genreId;
    this.exibirFilmes(filmesFormatados);

    const genreOption = this.genreFilter.querySelector(
      `option[value="${genreId}"]`
    );
    const genreName = genreOption
      ? genreOption.textContent
      : "gênero selecionado";

    console.log(`Filtro ${genreName}: ${filmesFormatados.length} filmes`);
  } catch (error) {
    console.error("Erro ao filtrar por gênero:", error);
    this.mostrarErro("Erro ao filtrar filmes. Tente novamente.");
  }
};

PaginaManager.prototype.exibirFilmes = function (filmes) {
  if (!this.resultsGrid) {
    console.error("Grid de resultados não encontrado");
    return;
  }

  this.resultsGrid.innerHTML = "";

  if (filmes.length === 0) {
    this.mostrarSemResultados();
    return;
  }

  filmes.forEach((filme) => {
    const cardHTML = this.criarCardFilme(filme);
    this.resultsGrid.insertAdjacentHTML("beforeend", cardHTML);
  });

  // Força o reflow para animações CSS
  this.resultsGrid.offsetHeight;
};

// SUBSTITUA esta função no seu script.js original
// Encontre a função PaginaManager.prototype.criarCardFilme (linha ~457)
// e substitua por esta versão:

PaginaManager.prototype.criarCardFilme = function (filme) {
  const sinopseResumida =
    filme.sinopse.length > 100
      ? filme.sinopse.substring(0, 100) + "..."
      : filme.sinopse;

  const anoLancamento = filme.dataLancamento
    ? new Date(filme.dataLancamento).getFullYear()
    : "";

  const notaFormatada = filme.nota.toFixed(1);

  return `
    <div class="col-md-3 mb-4">
      <a href="detalhes.html?movie_id=${filme.id}" class="text-decoration-none">
        <div class="card h-100" data-movie-id="${filme.id}">
          <img
            src="${filme.poster}"
            class="card-img-top"
            alt="Pôster de ${filme.titulo}"
            loading="lazy"
            style="height: 375px; object-fit: cover;"
            onload="console.log('IMG OK ←', this.src)"
            onerror="console.error('IMG ERROR ←', this.src); this.onerror=null; this.src='https://via.placeholder.com/500x750/333/fff?text=Sem+Imagem';"
          >

          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${filme.titulo}</h5>
            ${
              anoLancamento
                ? `<p class="text-muted mb-1">${anoLancamento}</p>`
                : ""
            }
            ${
              filme.nota > 0
                ? `<p class="text-warning mb-2">⭐ ${notaFormatada}</p>`
                : ""
            }
            <p class="card-text flex-grow-1">${sinopseResumida}</p>
          </div>
        </div>
      </a>
    </div>
  `;
};

// TAMBÉM ADICIONE esta modificação no detectarPaginaAtual
// Encontre PaginaManager.prototype.detectarPaginaAtual (linha ~217)
// e adicione este caso ANTES do return "desconhecida":

PaginaManager.prototype.detectarPaginaAtual = function () {
  const path = window.location.pathname.toLowerCase();
  const filename = path.substring(path.lastIndexOf("/") + 1);

  if (filename.includes("bem_vindo") || filename === "" || filename === "/") {
    return "bem-vindo";
  } else if (filename.includes("pagamento")) {
    return "pagamento";
  } else if (filename.includes("catalogo")) {
    return "catalogo";
  } else if (filename.includes("detalhes")) {
    return "detalhes";
  } else if (filename.includes("ajuda")) {
    return "ajuda";
  }

  return "desconhecida";
};

// E MODIFIQUE o initEventListeners para incluir detalhes
// Encontre PaginaManager.prototype.initEventListeners (linha ~201)
// e adicione o caso "detalhes":

PaginaManager.prototype.initEventListeners = function () {
  const currentPage = this.detectarPaginaAtual();

  switch (currentPage) {
    case "bem-vindo":
      this.initBemVindo();
      break;
    case "pagamento":
      this.initPagamento();
      break;
    case "catalogo":
      this.initCatalogo();
      break;
    case "detalhes":
      this.initDetalhes();
      break;
    case "ajuda":
      this.initAjuda();
      break;
  }
};

PaginaManager.prototype.mostrarLoading = function () {
  if (!this.resultsGrid) return;

  this.resultsGrid.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Carregando...</span>
      </div>
      <p class="mt-3 text-muted">Carregando filmes...</p>
    </div>
  `;
};

PaginaManager.prototype.mostrarErro = function (mensagem) {
  if (!this.resultsGrid) return;

  this.resultsGrid.innerHTML = `
    <div class="col-12">
      <div class="alert alert-danger text-center" role="alert">
        <i class="fas fa-exclamation-triangle mb-2"></i>
        <h4>Oops! Algo deu errado</h4>
        <p>${mensagem}</p>
        <button class="btn btn-primary" onclick="window.location.reload()">
          Tentar novamente
        </button>
      </div>
    </div>
  `;
};

PaginaManager.prototype.mostrarSemResultados = function (
  mensagem = "Nenhum filme encontrado"
) {
  if (!this.resultsGrid) return;

  this.resultsGrid.innerHTML = `
    <div class="col-12 text-center py-5">
      <i class="fas fa-film mb-3" style="font-size: 4rem; color: var(--text-muted);"></i>
      <h3 class="text-muted">${mensagem}</h3>
      <p class="text-muted">Tente ajustar os filtros ou fazer uma nova busca.</p>
      <button class="btn btn-primary" onclick="window.paginaManager.carregarFilmesPopulares()">
        Ver Filmes Populares
      </button>
    </div>
  `;
};

// =================================================================
// ================ EXTENSÕES PARA PÁGINA DE DETALHES =============
// =================================================================

// Adicione este código ao final do seu script.js existente

// =================================================================
// ============= EXTENSÕES DA CLASSE TMDbAPI ======================
// =================================================================

/**
 * Busca detalhes completos de um filme específico
 * @param {number} movieId - ID do filme
 * @returns {Object} Dados detalhados do filme
 */
TMDbAPI.prototype.buscarDetalhesFilme = async function (movieId) {
  if (!movieId) {
    throw new Error("ID do filme é obrigatório");
  }

  const url = this.construirURL(`/movie/${movieId}`);
  return await this.fazerRequisicao(url);
};

/**
 * Busca vídeos (trailers) de um filme
 * @param {number} movieId - ID do filme
 * @returns {Object} Lista de vídeos do filme
 */
TMDbAPI.prototype.buscarVideosFilme = async function (movieId) {
  if (!movieId) {
    throw new Error("ID do filme é obrigatório");
  }

  const url = this.construirURL(`/movie/${movieId}/videos`);
  return await this.fazerRequisicao(url);
};

/**
 * Busca créditos (elenco) de um filme
 * @param {number} movieId - ID do filme
 * @returns {Object} Elenco e equipe do filme
 */
TMDbAPI.prototype.buscarCreditosFilme = async function (movieId) {
  if (!movieId) {
    throw new Error("ID do filme é obrigatório");
  }

  const url = this.construirURL(`/movie/${movieId}/credits`);
  return await this.fazerRequisicao(url);
};

/**
 * Busca filmes recomendados baseados em um filme
 * @param {number} movieId - ID do filme
 * @param {number} page - Página dos resultados
 * @returns {Object} Filmes recomendados
 */
TMDbAPI.prototype.buscarRecomendacoes = async function (movieId, page = 1) {
  if (!movieId) {
    throw new Error("ID do filme é obrigatório");
  }

  const url = this.construirURL(`/movie/${movieId}/recommendations`, { page });
  return await this.fazerRequisicao(url);
};

/**
 * Constrói URL da imagem de perfil do TMDb
 * @param {string} profilePath - Caminho da imagem de perfil
 * @param {string} size - Tamanho da imagem (w185, h632, original)
 * @returns {string} URL completa da imagem
 */
TMDbAPI.prototype.construirURLImagemPerfil = function (
  profilePath,
  size = "w185"
) {
  if (!profilePath)
    return "https://via.placeholder.com/185x278/333/fff?text=Sem+Foto";

  const cleanPath = profilePath.startsWith("/")
    ? profilePath
    : "/" + profilePath;
  return `https://image.tmdb.org/t/p/${size}${cleanPath}`;
};

/**
 * Constrói URL da imagem de backdrop
 * @param {string} backdropPath - Caminho do backdrop
 * @param {string} size - Tamanho da imagem
 * @returns {string} URL completa da imagem
 */
TMDbAPI.prototype.construirURLBackdrop = function (
  backdropPath,
  size = "w1280"
) {
  if (!backdropPath) return null;

  const cleanPath = backdropPath.startsWith("/")
    ? backdropPath
    : "/" + backdropPath;
  return `https://image.tmdb.org/t/p/${size}${cleanPath}`;
};

/**
 * Formata dados detalhados do filme para uso na aplicação
 * @param {Object} movie - Dados brutos do filme da API
 * @returns {Object} Dados formatados e enriched
 */
TMDbAPI.prototype.formatarDetalhesFilme = function (movie) {
  return {
    id: movie.id,
    titulo: movie.title || "Título não disponível",
    tituloOriginal: movie.original_title || "",
    sinopse: movie.overview || "Sinopse não disponível.",
    poster: this.construirURLImagem(movie.poster_path),
    backdrop: this.construirURLBackdrop(movie.backdrop_path),
    dataLancamento: movie.release_date || "",
    nota: movie.vote_average || 0,
    votos: movie.vote_count || 0,
    generos: movie.genres || [],
    duracao: movie.runtime || 0,
    orcamento: movie.budget || 0,
    receita: movie.revenue || 0,
    status: movie.status || "",
    tagline: movie.tagline || "",
    popularidade: movie.popularity || 0,
    adult: movie.adult || false,
    homepage: movie.homepage || "",
    imdbId: movie.imdb_id || "",
  };
};

/**
 * Processa dados de vídeos e encontra trailer principal
 * @param {Object} videosData - Dados da API de vídeos
 * @returns {Object|null} Dados do trailer principal ou null
 */
TMDbAPI.prototype.processarVideosFilme = function (videosData) {
  if (!videosData.results || videosData.results.length === 0) {
    return null;
  }

  // Procura por trailer oficial do YouTube
  const trailer = videosData.results.find(
    (video) =>
      video.site === "YouTube" &&
      video.type === "Trailer" &&
      video.official === true
  );

  // Se não encontrou trailer oficial, pega qualquer trailer do YouTube
  if (!trailer) {
    const anyTrailer = videosData.results.find(
      (video) => video.site === "YouTube" && video.type === "Trailer"
    );
    return anyTrailer || null;
  }

  return trailer;
};

/**
 * Formata dados do elenco para exibição
 * @param {Object} creditsData - Dados da API de créditos
 * @param {number} limit - Limite de atores a retornar
 * @returns {Array} Array com dados do elenco formatados
 */
TMDbAPI.prototype.formatarElenco = function (creditsData, limit = 8) {
  if (!creditsData.cast || creditsData.cast.length === 0) {
    return [];
  }

  return creditsData.cast.slice(0, limit).map((actor) => ({
    id: actor.id,
    nome: actor.name || "Nome não disponível",
    personagem: actor.character || "Personagem não informado",
    foto: this.construirURLImagemPerfil(actor.profile_path),
    ordem: actor.order || 999,
  }));
};

// =================================================================
// ======== EXTENSÕES DA CLASSE PAGINAMANAGER - DETALHES =========
// =================================================================

/**
 * Atualiza detecção de página para incluir detalhes
 */
const originalDetectarPaginaAtual = PaginaManager.prototype.detectarPaginaAtual;
PaginaManager.prototype.detectarPaginaAtual = function () {
  const path = window.location.pathname.toLowerCase();
  const filename = path.substring(path.lastIndexOf("/") + 1);

  if (filename.includes("detalhes")) {
    return "detalhes";
  }

  // Chama o método original para outras páginas
  return originalDetectarPaginaAtual.call(this);
};

/**
 * Atualiza inicialização para incluir detalhes
 */
const originalInitEventListeners = PaginaManager.prototype.initEventListeners;
PaginaManager.prototype.initEventListeners = function () {
  const currentPage = this.detectarPaginaAtual();

  if (currentPage === "detalhes") {
    this.initDetalhes();
    return;
  }

  // Chama o método original para outras páginas
  originalInitEventListeners.call(this);
};

/**
 * Inicialização específica da página de detalhes
 */
PaginaManager.prototype.initDetalhes = function () {
  console.log("Inicializando página de Detalhes...");

  // Inicializa API TMDb se não existir
  if (!this.tmdbAPI) {
    this.tmdbAPI = new TMDbAPI();
  }

  // Obtém ID do filme da URL
  const movieId = this.obterMovieIdDaURL();

  if (!movieId) {
    this.exibirErroDetalhes("ID do filme não fornecido na URL");
    return;
  }

  // Carrega dados do filme
  this.carregarDetalhesCompletos(movieId);
};

/**
 * Obtém o movie_id da query string
 * @returns {string|null} ID do filme ou null se não encontrado
 */
PaginaManager.prototype.obterMovieIdDaURL = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("movie_id");

  if (movieId && /^\d+$/.test(movieId)) {
    return parseInt(movieId);
  }

  return null;
};

/**
 * Carrega todos os dados necessários para a página de detalhes
 * @param {number} movieId - ID do filme
 */
PaginaManager.prototype.carregarDetalhesCompletos = async function (movieId) {
  try {
    // Mostra loading
    this.mostrarLoadingDetalhes();

    // Faz requisições paralelas para otimizar performance
    const [detalhes, videos, creditos, recomendacoes] =
      await Promise.allSettled([
        this.tmdbAPI.buscarDetalhesFilme(movieId),
        this.tmdbAPI.buscarVideosFilme(movieId),
        this.tmdbAPI.buscarCreditosFilme(movieId),
        this.tmdbAPI.buscarRecomendacoes(movieId),
      ]);

    // Verifica se pelo menos os detalhes carregaram
    if (detalhes.status === "rejected") {
      throw new Error("Não foi possível carregar os detalhes do filme");
    }

    const movieData = this.tmdbAPI.formatarDetalhesFilme(detalhes.value);

    // Atualiza meta tags e título da página
    this.atualizarMetaTags(movieData);

    // Popula a página com os dados
    this.popularDetalhesFilme(movieData);

    // Processa trailer se disponível
    if (videos.status === "fulfilled") {
      const trailer = this.tmdbAPI.processarVideosFilme(videos.value);
      this.popularTrailer(trailer);
    } else {
      this.ocultarSecaoTrailer();
    }

    // Processa elenco se disponível
    if (creditos.status === "fulfilled") {
      const elenco = this.tmdbAPI.formatarElenco(creditos.value);
      this.popularElenco(elenco);
    } else {
      this.ocultarSecaoElenco();
    }

    // Processa recomendações se disponíveis
    if (
      recomendacoes.status === "fulfilled" &&
      recomendacoes.value.results.length > 0
    ) {
      const recomendacoesFormatadas = recomendacoes.value.results
        .slice(0, 8)
        .map((movie) => this.tmdbAPI.formatarDadosFilme(movie));
      this.popularRecomendacoes(recomendacoesFormatadas);
    } else {
      this.ocultarSecaoRecomendacoes();
    }

    // Configura botões de ação
    this.configurarBotoesAcao(movieData);

    // Mostra conteúdo e esconde loading
    this.mostrarConteudoDetalhes();

    console.log(
      `Detalhes do filme "${movieData.titulo}" carregados com sucesso`
    );
  } catch (error) {
    console.error("Erro ao carregar detalhes do filme:", error);
    this.exibirErroDetalhes(error.message);
  }
};

/**
 * Atualiza meta tags da página para compartilhamento social
 * @param {Object} movieData - Dados formatados do filme
 */
PaginaManager.prototype.atualizarMetaTags = function (movieData) {
  // Atualiza título da página
  document.title = `${movieData.titulo} - Meu Streaming`;

  // Atualiza meta tags Open Graph
  const ogTitle = document.getElementById("og-title");
  const ogDescription = document.getElementById("og-description");
  const ogImage = document.getElementById("og-image");

  if (ogTitle) ogTitle.content = `${movieData.titulo} - Meu Streaming`;
  if (ogDescription)
    ogDescription.content = movieData.sinopse.substring(0, 160) + "...";
  if (ogImage) ogImage.content = movieData.poster;
};

/**
 * Popula os elementos da página com dados do filme
 * @param {Object} movieData - Dados formatados do filme
 */
PaginaManager.prototype.popularDetalhesFilme = function (movieData) {
  // Título principal
  const title = document.getElementById("movie-title");
  const titleDetail = document.getElementById("movie-title-detail");
  if (title) title.textContent = movieData.titulo;
  if (titleDetail) titleDetail.textContent = movieData.titulo;

  // Subtítulo com ano e gêneros principais
  const subtitle = document.getElementById("movie-subtitle");
  if (subtitle) {
    const ano = movieData.dataLancamento
      ? new Date(movieData.dataLancamento).getFullYear()
      : "";
    const generosPrincipais = movieData.generos
      .slice(0, 3)
      .map((g) => g.name)
      .join(", ");
    subtitle.textContent = `${ano} • ${generosPrincipais}`;
  }

  // Informações rápidas no hero
  const quickInfo = document.getElementById("movie-quick-info");
  if (quickInfo) {
    const rating = movieData.nota > 0 ? `⭐ ${movieData.nota.toFixed(1)}` : "";
    const duration = movieData.duracao > 0 ? `⏱️ ${movieData.duracao}min` : "";
    const status =
      movieData.status === "Released" ? "✅ Lançado" : movieData.status;

    quickInfo.innerHTML = [rating, duration, status]
      .filter((info) => info)
      .map((info) => `<span class="badge bg-primary me-2">${info}</span>`)
      .join("");
  }

  // Pôster
  const poster = document.getElementById("movie-poster");
  if (poster) {
    poster.src = movieData.poster;
    poster.alt = `Pôster de ${movieData.titulo}`;
  }

  // Backdrop
  if (movieData.backdrop) {
    this.configurarBackdrop(movieData.backdrop);
  }

  // Informações detalhadas
  const releaseDate = document.getElementById("movie-release-date");
  const rating = document.getElementById("movie-rating");
  const runtime = document.getElementById("movie-runtime");
  const overview = document.getElementById("movie-overview");
  const genres = document.getElementById("movie-genres");

  if (releaseDate) {
    const dataFormatada = movieData.dataLancamento
      ? new Date(movieData.dataLancamento).toLocaleDateString("pt-BR")
      : "Não informado";
    releaseDate.textContent = dataFormatada;
  }

  if (rating) {
    const notaTexto =
      movieData.nota > 0
        ? `⭐ ${movieData.nota.toFixed(1)}/10 (${movieData.votos.toLocaleString(
            "pt-BR"
          )} votos)`
        : "Não avaliado";
    rating.textContent = notaTexto;
  }

  if (runtime) {
    const duracaoTexto =
      movieData.duracao > 0
        ? `${movieData.duracao} minutos (${Math.floor(
            movieData.duracao / 60
          )}h ${movieData.duracao % 60}min)`
        : "Não informado";
    runtime.textContent = duracaoTexto;
  }

  if (overview) {
    overview.textContent = movieData.sinopse;
  }

  if (genres && movieData.generos.length > 0) {
    genres.innerHTML = movieData.generos
      .map(
        (genre) =>
          `<span class="badge bg-secondary me-1 mb-1">${genre.name}</span>`
      )
      .join("");
  }
};

/**
 * Configura imagem de backdrop no hero
 * @param {string} backdropUrl - URL do backdrop
 */
PaginaManager.prototype.configurarBackdrop = function (backdropUrl) {
  const backdropContainer = document.getElementById("movie-backdrop-container");
  if (!backdropContainer || !backdropUrl) return;

  const img = document.createElement("img");
  img.src = backdropUrl;
  img.alt = "Imagem de fundo do filme";
  img.className = "w-100 h-100";
  img.style.objectFit = "cover";
  img.style.opacity = "0.3";
  img.loading = "lazy";

  img.onerror = () => {
    // Remove backdrop se falhar no carregamento
    backdropContainer.innerHTML = "";
  };

  backdropContainer.innerHTML = "";
  backdropContainer.appendChild(img);
};

/**
 * Popula seção de trailer
 * @param {Object|null} trailer - Dados do trailer
 */
PaginaManager.prototype.popularTrailer = function (trailer) {
  const container = document.getElementById("movie-trailer-container");
  if (!container) return;

  if (!trailer) {
    this.ocultarSecaoTrailer();
    return;
  }

  // Cria iframe do YouTube
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube.com/embed/${trailer.key}?rel=0`;
  iframe.title = `Trailer: ${trailer.name}`;
  iframe.frameBorder = "0";
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  iframe.allowFullscreen = true;
  iframe.className = "w-100 h-100";

  container.innerHTML = "";
  container.appendChild(iframe);
};

/**
 * Popula seção de elenco
 * @param {Array} elenco - Array com dados do elenco
 */
PaginaManager.prototype.popularElenco = function (elenco) {
  const container = document.getElementById("movie-cast");
  if (!container) return;

  if (!elenco || elenco.length === 0) {
    this.ocultarSecaoElenco();
    return;
  }

  container.innerHTML = elenco
    .map(
      (actor) => `
    <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div class="card h-100">
        <img
          src="${actor.foto}"
          class="card-img-top"
          alt="Foto de ${actor.nome}"
          style="height: 300px; object-fit: cover;"
          loading="lazy"
          onerror="this.src='https://via.placeholder.com/300x300/333/fff?text=Sem+Foto'"
        />
        <div class="card-body text-center">
          <h6 class="card-title mb-1">${actor.nome}</h6>
          <small class="text-muted">${actor.personagem}</small>
        </div>
      </div>
    </div>
  `
    )
    .join("");
};

/**
 * Popula seção de recomendações
 * @param {Array} recomendacoes - Array com filmes recomendados
 */
PaginaManager.prototype.popularRecomendacoes = function (recomendacoes) {
  const container = document.getElementById("movie-recommendations");
  if (!container) return;

  if (!recomendacoes || recomendacoes.length === 0) {
    this.ocultarSecaoRecomendacoes();
    return;
  }

  container.innerHTML = recomendacoes
    .map(
      (filme) => `
    <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
      <a href="detalhes.html?movie_id=${filme.id}" class="text-decoration-none">
        <div class="card h-100">
          <img
            src="${filme.poster}"
            class="card-img-top"
            alt="Pôster de ${filme.titulo}"
            style="height: 350px; object-fit: cover;"
            loading="lazy"
            onerror="this.src='https://via.placeholder.com/500x750/333/fff?text=Sem+Imagem'"
          />
          <div class="card-body">
            <h6 class="card-title">${filme.titulo}</h6>
            ${
              filme.nota > 0
                ? `<small class="text-warning">⭐ ${filme.nota.toFixed(
                    1
                  )}</small>`
                : ""
            }
          </div>
        </div>
      </a>
    </div>
  `
    )
    .join("");
};

/**
 * Configura botões de ação da página
 * @param {Object} movieData - Dados do filme
 */
PaginaManager.prototype.configurarBotoesAcao = function (movieData) {
  const btnAssistir = document.getElementById("btn-assistir");
  const btnMinhaLista = document.getElementById("btn-minha-lista");
  const btnCompartilhar = document.getElementById("btn-compartilhar");

  if (btnAssistir) {
    btnAssistir.addEventListener("click", () => {
      // Simula ação de assistir (pode ser expandida futuramente)
      alert(`Redirecionando para assistir "${movieData.titulo}"...`);
    });
  }

  if (btnMinhaLista) {
    btnMinhaLista.addEventListener("click", () => {
      // Simula adição à lista (pode ser expandida com localStorage)
      const isAdded = this.toggleMinhaLista(movieData);
      btnMinhaLista.innerHTML = isAdded
        ? '<i class="fas fa-check me-2"></i>Adicionado'
        : '<i class="fas fa-plus me-2"></i>Adicionar à Minha Lista';

      // Feedback visual
      btnMinhaLista.classList.toggle("btn-success", isAdded);
      btnMinhaLista.classList.toggle("btn-outline-primary", !isAdded);
    });
  }

  if (btnCompartilhar) {
    btnCompartilhar.addEventListener("click", () => {
      this.compartilharFilme(movieData);
    });
  }
};

/**
 * Simula toggle de adicionar/remover da lista
 * @param {Object} movieData - Dados do filme
 * @returns {boolean} True se adicionado, false se removido
 */
PaginaManager.prototype.toggleMinhaLista = function (movieData) {
  const lista = JSON.parse(localStorage.getItem("minhaLista") || "[]");
  const index = lista.findIndex((item) => item.id === movieData.id);

  if (index === -1) {
    // Adiciona à lista
    lista.push({
      id: movieData.id,
      titulo: movieData.titulo,
      poster: movieData.poster,
      dataAdicionado: new Date().toISOString(),
    });
    localStorage.setItem("minhaLista", JSON.stringify(lista));
    return true;
  } else {
    // Remove da lista
    lista.splice(index, 1);
    localStorage.setItem("minhaLista", JSON.stringify(lista));
    return false;
  }
};

/**
 * Compartilha filme usando Web Share API ou fallback
 * @param {Object} movieData - Dados do filme
 */
PaginaManager.prototype.compartilharFilme = function (movieData) {
  const shareData = {
    title: `${movieData.titulo} - Meu Streaming`,
    text: `Confira este filme: ${movieData.titulo}`,
    url: window.location.href,
  };

  if (navigator.share) {
    navigator
      .share(shareData)
      .then(() => console.log("Filme compartilhado com sucesso"))
      .catch(() => this.compartilharFallback(shareData));
  } else {
    this.compartilharFallback(shareData);
  }
};

/**
 * Fallback para compartilhamento (copia URL)
 * @param {Object} shareData - Dados para compartilhar
 */
PaginaManager.prototype.compartilharFallback = function (shareData) {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(shareData.url)
      .then(() => {
        alert("Link copiado para a área de transferência!");
      })
      .catch(() => {
        prompt("Copie o link abaixo:", shareData.url);
      });
  } else {
    prompt("Copie o link abaixo:", shareData.url);
  }
};

/**
 * Mostra loading inicial
 */
PaginaManager.prototype.mostrarLoadingDetalhes = function () {
  const loading = document.getElementById("loading-container");
  const content = document.getElementById("main-content");
  const error = document.getElementById("error-container");

  if (loading) loading.classList.remove("d-none");
  if (content) content.classList.add("d-none");
  if (error) error.classList.add("d-none");
};

/**
 * Mostra conteúdo principal
 */
PaginaManager.prototype.mostrarConteudoDetalhes = function () {
  const loading = document.getElementById("loading-container");
  const content = document.getElementById("main-content");
  const error = document.getElementById("error-container");

  if (loading) loading.classList.add("d-none");
  if (content) content.classList.remove("d-none");
  if (error) error.classList.add("d-none");
};

/**
 * Exibe erro na página
 * @param {string} mensagem - Mensagem de erro
 */
PaginaManager.prototype.exibirErroDetalhes = function (mensagem) {
  const loading = document.getElementById("loading-container");
  const content = document.getElementById("main-content");
  const error = document.getElementById("error-container");

  if (loading) loading.classList.add("d-none");
  if (content) content.classList.add("d-none");
  if (error) {
    error.classList.remove("d-none");

    // Atualiza mensagem de erro se necessário
    const errorMsg = error.querySelector("p");
    if (errorMsg && mensagem) {
      errorMsg.textContent = mensagem;
    }
  }

  console.error("Erro na página de detalhes:", mensagem);
};

/**
 * Oculta seção do trailer
 */
PaginaManager.prototype.ocultarSecaoTrailer = function () {
  const section = document.getElementById("trailer-section");
  if (section) section.classList.add("d-none");
};

/**
 * Oculta seção do elenco
 */
PaginaManager.prototype.ocultarSecaoElenco = function () {
  const section = document.getElementById("cast-section");
  if (section) section.classList.add("d-none");
};

/**
 * Oculta seção de recomendações
 */
PaginaManager.prototype.ocultarSecaoRecomendacoes = function () {
  const section = document.getElementById("recommendations-section");
  if (section) section.classList.add("d-none");
};

// =================================================================
// ========= MODIFICAÇÃO DO CATÁLOGO PARA LINKS CLICÁVEIS =========
// =================================================================

/**
 * Sobrescreve criarCardFilme para incluir links para detalhes
 */
const originalCriarCardFilme = PaginaManager.prototype.criarCardFilme;
PaginaManager.prototype.criarCardFilme = function (filme) {
  const sinopseResumida =
    filme.sinopse.length > 100
      ? filme.sinopse.substring(0, 100) + "..."
      : filme.sinopse;

  const anoLancamento = filme.dataLancamento
    ? new Date(filme.dataLancamento).getFullYear()
    : "";

  const notaFormatada = filme.nota.toFixed(1);

  return `
    <div class="col-md-3 mb-4">
      <a href="detalhes.html?movie_id=${filme.id}" class="text-decoration-none">
        <div class="card h-100" data-movie-id="${filme.id}">
          <img
            src="${filme.poster}"
            class="card-img-top"
            alt="Pôster de ${filme.titulo}"
            loading="lazy"
            style="height: 375px; object-fit: cover;"
            onload="console.log('IMG OK ←', this.src)"
            onerror="console.error('IMG ERROR ←', this.src); this.onerror=null; this.src='https://via.placeholder.com/500x750/333/fff?text=Sem+Imagem';"
          >

          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${filme.titulo}</h5>
            ${
              anoLancamento
                ? `<p class="text-muted mb-1">${anoLancamento}</p>`
                : ""
            }
            ${
              filme.nota > 0
                ? `<p class="text-warning mb-2">⭐ ${notaFormatada}</p>`
                : ""
            }
            <p class="card-text flex-grow-1">${sinopseResumida}</p>
          </div>
        </div>
      </a>
    </div>
  `;
};

// =================================================================
// ================ FUNÇÃO DE DEBUG ESTENDIDA =====================
// =================================================================

/**
 * Função de debug estendida
 */
window.debugInfoDetalhes = function () {
  console.log("=== DEBUG INFO DETALHES ===");
  console.log("Página atual:", window.paginaManager?.detectarPaginaAtual());

  const urlParams = new URLSearchParams(window.location.search);
  console.log("Movie ID (URL):", urlParams.get("movie_id"));

  if (window.paginaManager?.tmdbAPI) {
    console.log("Cache TMDb size:", window.paginaManager.tmdbAPI.cache.size);
  }

  const minhaLista = JSON.parse(localStorage.getItem("minhaLista") || "[]");
  console.log("Minha Lista:", minhaLista.length, "filmes");

  console.log("=============================");
};

/* =================================================================
  ================ CURSOR DO MOUSE PERSONALIZADO ================
  ================================================================= */

// script.js - Cursor custom simples (sem lanterna)
document.addEventListener("DOMContentLoaded", function () {
  if (typeof window === "undefined") return;
  if (window.matchMedia && !window.matchMedia("(pointer: fine)").matches)
    return; // ignora touch

  // cria cursor se não existir
  if (!document.querySelector(".site-cursor")) {
    const cursor = document.createElement("div");
    cursor.className = "site-cursor";
    cursor.setAttribute("aria-hidden", "true");
    document.body.appendChild(cursor);
  }
  const cursorEl = document.querySelector(".site-cursor");

  // Opção: ler o smoothness do CSS (se quiser usar a var)
  // Você pode manter a var no CSS ou sobrescrever aqui com JS.
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  // ler var CSS --cursor-smoothness
  const root = getComputedStyle(document.documentElement);
  let smoothness = parseFloat(root.getPropertyValue("--cursor-smoothness"));
  if (Number.isNaN(smoothness)) smoothness = 0.16;
  if (prefersReduced) smoothness = 1; // sem suavização se for reduzido

  // posições
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let posX = mouseX,
    posY = mouseY;

  // atualiza alvo com mousemove
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorEl.style.display = "";
  });

  // animação suave (requestAnimationFrame)
  function loop() {
    posX += (mouseX - posX) * smoothness;
    posY += (mouseY - posY) * smoothness;
    cursorEl.style.transform = `translate3d(${posX}px, ${posY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // hover e click states
  const hoverSelector = "a, button, .btn, .card, [data-cursor='hover']";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hoverSelector))
      cursorEl.classList.add("cursor--hover");
  });
  document.addEventListener("mouseout", (e) => {
    if (
      !e.relatedTarget ||
      !e.relatedTarget.closest ||
      !e.relatedTarget.closest(hoverSelector)
    ) {
      cursorEl.classList.remove("cursor--hover");
    }
  });
  document.addEventListener("mousedown", () =>
    cursorEl.classList.add("cursor--click")
  );
  document.addEventListener("mouseup", () =>
    cursorEl.classList.remove("cursor--click")
  );
});
