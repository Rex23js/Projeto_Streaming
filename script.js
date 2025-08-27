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
