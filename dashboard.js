// =================================================================
// ==================== DASHBOARD ANALYTICS =======================
// =================================================================

class DashboardAnalytics {
  constructor() {
    // Configuração da API (reutilizando do script.js)
    this.tmdbAPI = new TMDbAPI();
    this.charts = {}; // Armazenará instâncias dos gráficos
    this.dados = {
      filmes: [],
      generos: {},
      processados: false,
    };

    // Configuração de cores baseada no CSS
    this.coresTema = {
      primary: "#e53e3e",
      primaryHover: "#ff2d55",
      primaryDark: "#c53030",
      primaryLight: "#ff6b6b",
      textPrimary: "#ffffff",
      textSecondary: "#e2e8f0",
      textMuted: "#b9c6d8",
      backgroundSecondary: "#1a1a1a",
    };
  }

  /**
   * Inicializa o dashboard
   */
  async init() {
    console.log("Inicializando Dashboard Analytics...");

    try {
      // Mostra loading
      this.mostrarLoading(true);

      // Carrega dados necessários
      await this.carregarDadosCompletos();

      // Processa os dados
      this.processarDados();

      // Cria os gráficos
      this.criarTodosGraficos();

      // Atualiza estatísticas gerais
      this.atualizarEstatisticas();

      // Gera insights automáticos
      this.gerarInsights();

      // Mostra o conteúdo
      this.mostrarLoading(false);

      console.log("Dashboard carregado com sucesso!");
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
      this.mostrarErro(
        "Erro ao carregar dados do dashboard. Verifique sua conexão."
      );
    }
  }

  /**
   * Carrega dados completos da API TMDb
   */
  async carregarDadosCompletos() {
    const promises = [];
    const totalPaginas = 5; // Carregar 5 páginas = ~100 filmes

    // Carrega múltiplas páginas de filmes populares
    for (let pagina = 1; pagina <= totalPaginas; pagina++) {
      promises.push(this.tmdbAPI.buscarFilmesPopulares(pagina));
    }

    // Carrega lista de gêneros
    promises.push(this.tmdbAPI.buscarGeneros());

    const resultados = await Promise.all(promises);

    // Consolida filmes de todas as páginas
    this.dados.filmes = [];
    for (let i = 0; i < totalPaginas; i++) {
      this.dados.filmes.push(...resultados[i].results);
    }

    // Armazena gêneros
    const generosResult = resultados[totalPaginas];
    generosResult.genres.forEach((genero) => {
      this.dados.generos[genero.id] = genero.name;
    });

    console.log(`Dashboard: ${this.dados.filmes.length} filmes carregados`);
  }

  /**
   * Processa os dados para análise
   */
  processarDados() {
    this.dados.processados = {
      // Contagem por gênero
      generos: this.contarPorGenero(),

      // Distribuição de avaliações
      avaliacoes: this.distribuirAvaliacoes(),

      // Filmes por década
      decadas: this.contarPorDecada(),

      // Top filmes por popularidade
      topPopulares: this.obterTopPopulares(10),

      // Estatísticas gerais
      estatisticas: this.calcularEstatisticas(),
    };
    console.log("Mapa de gêneros (id->nome):", this.dados.generos);
    console.log(
      "Exemplo filmes (primeiros 5):",
      this.dados.filmes
        .slice(0, 5)
        .map((f) => ({ id: f.id, genre_ids: f.genre_ids, genres: f.genres }))
    );
    console.log("Resultado contarPorGenero():", this.contarPorGenero());

    console.log("Dados processados:", this.dados.processados);
  }

  /**
   * Conta filmes por gênero
   */
  contarPorGenero() {
    const contador = {};

    this.dados.filmes.forEach((filme) => {
      if (filme.genre_ids && filme.genre_ids.length > 0) {
        filme.genre_ids.forEach((generoId) => {
          const nomeGenero = this.dados.generos[generoId] || "Desconhecido";
          contador[nomeGenero] = (contador[nomeGenero] || 0) + 1;
        });
      }
    });

    // Converte para array ordenado
    return Object.entries(contador)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8); // Top 8 gêneros
  }

  /**
   * Distribui filmes por faixas de avaliação
   */
  distribuirAvaliacoes() {
    const faixas = {
      "Excelente (8-10)": 0,
      "Bom (6-8)": 0,
      "Regular (4-6)": 0,
      "Ruim (0-4)": 0,
    };

    this.dados.filmes.forEach((filme) => {
      const nota = filme.vote_average || 0;

      if (nota >= 8) faixas["Excelente (8-10)"]++;
      else if (nota >= 6) faixas["Bom (6-8)"]++;
      else if (nota >= 4) faixas["Regular (4-6)"]++;
      else faixas["Ruim (0-4)"]++;
    });

    return Object.entries(faixas);
  }

  /**
   * Conta filmes por década
   */
  contarPorDecada() {
    const contador = {};

    this.dados.filmes.forEach((filme) => {
      if (filme.release_date) {
        const ano = new Date(filme.release_date).getFullYear();
        const decada = Math.floor(ano / 10) * 10;
        const labelDecada = `${decada}s`;

        contador[labelDecada] = (contador[labelDecada] || 0) + 1;
      }
    });

    return Object.entries(contador)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 6); // Últimas 6 décadas
  }

  /**
   * Obtém filmes mais populares
   */
  obterTopPopulares(limite) {
    return this.dados.filmes
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limite)
      .map((filme) => [
        filme.title.length > 20
          ? filme.title.substring(0, 20) + "..."
          : filme.title,
        Math.round(filme.popularity),
      ]);
  }

  /**
   * Calcula estatísticas gerais
   */
  calcularEstatisticas() {
    const filmes = this.dados.filmes;

    // Média de avaliações
    const avaliacoes = filmes
      .map((f) => f.vote_average || 0)
      .filter((a) => a > 0);
    const mediaAvaliacoes =
      avaliacoes.length > 0
        ? (
            avaliacoes.reduce((sum, a) => sum + a, 0) / avaliacoes.length
          ).toFixed(1)
        : "0.0";

    // Gênero mais popular
    const generoPopular =
      this.dados.processados?.generos?.[0]?.[0] || "Carregando...";

    // Ano mais comum
    const anos = filmes
      .map((f) =>
        f.release_date ? new Date(f.release_date).getFullYear() : null
      )
      .filter((a) => a && a > 1900);
    const anoPopular = anos.length > 0 ? this.moda(anos).toString() : "N/A";

    return {
      totalFilmes: filmes.length,
      mediaAvaliacoes,
      generoPopular,
      anoPopular,
    };
  }

  /**
   * Calcula a moda (valor mais frequente) de um array
   */
  moda(array) {
    const frequencia = {};
    array.forEach((item) => {
      frequencia[item] = (frequencia[item] || 0) + 1;
    });

    return Object.entries(frequencia).sort(([, a], [, b]) => b - a)[0][0];
  }

  /**
   * Cria todos os gráficos
   */
  criarTodosGraficos() {
    this.criarGraficoGeneros();
    this.criarGraficoAvaliacoes();
    this.criarGraficoDecadas();
    this.criarGraficoPopularidade();
  }

  /**
   * Cria gráfico de distribuição por gênero
   */
  criarGraficoGeneros() {
    const ctx = document.getElementById("genresChart");
    if (!ctx) return;

    const dados = this.dados.processados.generos;
    const labels = dados.map(([nome]) => nome);
    const valores = dados.map(([, quantidade]) => quantidade);

    this.charts.generos = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: valores,
            backgroundColor: this.gerarCoresPaleta(labels.length),
            borderColor: this.coresTema.backgroundSecondary,
            borderWidth: 2,
            hoverBorderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              color: this.coresTema.textSecondary,
              font: { size: 11 },
              padding: 15,
            },
          },
          tooltip: {
            backgroundColor: this.coresTema.backgroundSecondary,
            titleColor: this.coresTema.textPrimary,
            bodyColor: this.coresTema.textSecondary,
            borderColor: this.coresTema.primary,
            borderWidth: 1,
          },
        },
      },
    });
  }

  /**
   * Cria gráfico de distribuição de avaliações
   */
  criarGraficoAvaliacoes() {
    const ctx = document.getElementById("ratingsChart");
    if (!ctx) return;

    const dados = this.dados.processados.avaliacoes;
    const labels = dados.map(([faixa]) => faixa);
    const valores = dados.map(([, quantidade]) => quantidade);

    this.charts.avaliacoes = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Número de Filmes",
            data: valores,
            backgroundColor: this.coresTema.primary + "80",
            borderColor: this.coresTema.primary,
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: this.coresTema.textSecondary },
            grid: { color: this.coresTema.textMuted + "30" },
          },
          x: {
            ticks: { color: this.coresTema.textSecondary },
            grid: { display: false },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: this.coresTema.backgroundSecondary,
            titleColor: this.coresTema.textPrimary,
            bodyColor: this.coresTema.textSecondary,
            borderColor: this.coresTema.primary,
            borderWidth: 1,
          },
        },
      },
    });
  }

  /**
   * Cria gráfico de filmes por década
   */
  criarGraficoDecadas() {
    const ctx = document.getElementById("yearsChart");
    if (!ctx) return;

    const dados = this.dados.processados.decadas;
    const labels = dados.map(([decada]) => decada);
    const valores = dados.map(([, quantidade]) => quantidade);

    this.charts.decadas = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Filmes por Década",
            data: valores,
            borderColor: this.coresTema.primaryLight,
            backgroundColor: this.coresTema.primary + "20",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: this.coresTema.primary,
            pointBorderColor: this.coresTema.textPrimary,
            pointBorderWidth: 2,
            pointRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: this.coresTema.textSecondary },
            grid: { color: this.coresTema.textMuted + "30" },
          },
          x: {
            ticks: { color: this.coresTema.textSecondary },
            grid: { display: false },
          },
        },
        plugins: {
          legend: {
            labels: { color: this.coresTema.textSecondary },
          },
          tooltip: {
            backgroundColor: this.coresTema.backgroundSecondary,
            titleColor: this.coresTema.textPrimary,
            bodyColor: this.coresTema.textSecondary,
            borderColor: this.coresTema.primary,
            borderWidth: 1,
          },
        },
      },
    });
  }

  /**
   * Cria gráfico dos filmes mais populares
   */
  criarGraficoPopularidade() {
    const ctx = document.getElementById("popularityChart");
    if (!ctx) return;

    const dados = this.dados.processados.topPopulares;
    const labels = dados.map(([nome]) => nome);
    const valores = dados.map(([, popularidade]) => popularidade);

    this.charts.popularidade = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Popularidade",
            data: valores,
            backgroundColor: this.gerarGradiente(
              ctx,
              this.coresTema.primary,
              this.coresTema.primaryLight
            ),
            borderColor: this.coresTema.primaryDark,
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y", // Gráfico horizontal
        scales: {
          x: {
            beginAtZero: true,
            ticks: { color: this.coresTema.textSecondary },
            grid: { color: this.coresTema.textMuted + "30" },
          },
          y: {
            ticks: {
              color: this.coresTema.textSecondary,
              font: { size: 10 },
            },
            grid: { display: false },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: this.coresTema.backgroundSecondary,
            titleColor: this.coresTema.textPrimary,
            bodyColor: this.coresTema.textSecondary,
            borderColor: this.coresTema.primary,
            borderWidth: 1,
          },
        },
      },
    });
  }

  /**
   * Atualiza as estatísticas gerais na interface
   */
  atualizarEstatisticas() {
    const stats = this.dados.processados.estatisticas;

    document.getElementById("total-filmes").textContent = stats.totalFilmes;
    document.getElementById("media-rating").textContent =
      "⭐ " + stats.mediaAvaliacoes;
    document.getElementById("genero-popular").textContent = stats.generoPopular;
    document.getElementById("ano-popular").textContent = stats.anoPopular;
  }

  /**
   * Gera insights automáticos baseados nos dados
   */
  gerarInsights() {
    const stats = this.dados.processados.estatisticas;
    const generos = this.dados.processados.generos;
    const avaliacoes = this.dados.processados.avaliacoes;

    let insights = [];

    // Insight sobre gênero dominante
    if (generos.length > 0) {
      const [generoTop, quantidadeTop] = generos[0];
      const percentual = ((quantidadeTop / stats.totalFilmes) * 100).toFixed(1);
      insights.push(
        `🎭 <strong>${generoTop}</strong> é o gênero dominante, representando ${percentual}% do catálogo.`
      );
    }

    // Insight sobre qualidade média
    const media = parseFloat(stats.mediaAvaliacoes);
    if (media >= 7) {
      insights.push(
        `⭐ Nosso catálogo tem alta qualidade com avaliação média de ${media}/10.`
      );
    } else if (media >= 6) {
      insights.push(
        `📊 Catálogo com qualidade sólida, avaliação média de ${media}/10.`
      );
    }

    // Insight sobre distribuição de avaliações
    const excelentes =
      avaliacoes.find(([faixa]) => faixa.includes("Excelente"))?.[1] || 0;
    const percentualExcelentes = (
      (excelentes / stats.totalFilmes) *
      100
    ).toFixed(1);
    if (parseFloat(percentualExcelentes) > 25) {
      insights.push(
        `🏆 ${percentualExcelentes}% dos filmes têm avaliação excelente (8-10), indicando um catálogo premium.`
      );
    }

    // Insight sobre diversidade temporal
    const decadas = this.dados.processados.decadas;
    if (decadas.length >= 4) {
      insights.push(
        `📅 Catálogo diversificado temporalmente, abrangendo ${decadas.length} décadas diferentes.`
      );
    }

    // Exibe os insights na interface
    const container = document.getElementById("insights-content");
    if (container && insights.length > 0) {
      container.innerHTML = insights
        .map(
          (insight) =>
            `<div class="alert alert-info mb-2 dashboard-insights" style="border-left: 4px solid var(--primary-accent);">${insight}</div>`
        )
        .join("");
    }
  }

  /**
   * Gera paleta de cores para gráficos
   */
  gerarCoresPaleta(quantidade) {
    const coresBase = [
      this.coresTema.primary,
      this.coresTema.primaryLight,
      this.coresTema.primaryHover,
      "#ff9500", // Laranja
      "#00d4aa", // Verde água
      "#007bff", // Azul
      "#6f42c1", // Roxo
      "#fd7e14", // Laranja escuro
      "#20c997", // Verde
      "#dc3545", // Vermelho escuro
    ];

    const cores = [];
    for (let i = 0; i < quantidade; i++) {
      cores.push(coresBase[i % coresBase.length]);
    }

    return cores;
  }

  /**
   * Cria gradiente para gráficos (funcionalidade avançada)
   */
  gerarGradiente(ctxOrCanvas, cor1, cor2) {
    // aceita tanto um HTMLCanvasElement quanto um CanvasRenderingContext2D
    let context = null;

    if (!ctxOrCanvas) return cor1; // fallback

    if (ctxOrCanvas instanceof HTMLCanvasElement) {
      context = ctxOrCanvas.getContext("2d");
    } else {
      // presumimos que já seja um contexto 2D
      context = ctxOrCanvas;
    }

    if (!context || !context.createLinearGradient) {
      // não foi possível criar gradiente — retorna cor sólida como fallback
      return cor1;
    }

    const canvas = context.canvas;
    const width = (canvas && canvas.width) || 400; // fallback caso width seja 0/undefined
    const gradient = context.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, cor1);
    gradient.addColorStop(1, cor2);
    return gradient;
  }

  /**
   * Controla exibição do loading
   */
  mostrarLoading(mostrar) {
    const loading = document.getElementById("dashboard-loading");
    const content = document.getElementById("dashboard-content");

    if (loading) loading.style.display = mostrar ? "block" : "none";
    if (content) content.style.display = mostrar ? "none" : "block";
  }

  /**
   * Exibe mensagem de erro
   */
  mostrarErro(mensagem) {
    const loading = document.getElementById("dashboard-loading");
    if (loading) {
      loading.innerHTML = `
                <div class="alert alert-danger text-center" role="alert">
                    <i class="fas fa-exclamation-triangle mb-2"></i>
                    <h4>Erro no Dashboard</h4>
                    <p>${mensagem}</p>
                    <button class="btn btn-primary" onclick="window.location.reload()">
                        Tentar Novamente
                    </button>
                </div>
            `;
    }
  }

  /**
   * Destrói gráficos existentes (útil para atualizações)
   */
  destruirGraficos() {
    Object.values(this.charts).forEach((chart) => {
      if (chart && typeof chart.destroy === "function") {
        chart.destroy();
      }
    });
    this.charts = {};
  }

  /**
   * Atualiza dados e gráficos (método público para futuras funcionalidades)
   */
  async atualizar() {
    console.log("Atualizando dashboard...");
    this.destruirGraficos();
    await this.init();
  }
}

// =================================================================
// =============== INTEGRAÇÃO COM SCRIPT.JS PRINCIPAL =============
// =================================================================

// Extensão da classe PaginaManager para incluir dashboard
if (typeof PaginaManager !== "undefined") {
  PaginaManager.prototype.initDashboard = function () {
    console.log("Inicializando página de Dashboard...");

    // Cria instância do analytics
    this.dashboardAnalytics = new DashboardAnalytics();

    // Inicializa o dashboard
    this.dashboardAnalytics.init();

    // Configura eventos específicos do dashboard se necessário
    this.configurarEventsDashboard();
  };
}

PaginaManager.prototype.configurarEventsDashboard = function () {
  // Botão de atualização manual (se existir)
  const btnAtualizar = document.getElementById("btn-atualizar-dashboard");
  if (btnAtualizar) {
    btnAtualizar.addEventListener("click", () => {
      this.dashboardAnalytics.atualizar();
    });
  }

  // Outros eventos específicos do dashboard podem ser adicionados aqui
  console.log("Eventos do dashboard configurados");
};

// =================================================================
// ==================== INICIALIZAÇÃO ============================
// =================================================================

// Aguarda DOM carregar e verifica se estamos na página do dashboard
document.addEventListener("DOMContentLoaded", () => {
  // Deteta se estamos na página do dashboard
  const issDashboardPage =
    window.location.pathname.includes("dashboard") ||
    document.getElementById("dashboard-content");

  if (issDashboardPage) {
    console.log("Página do dashboard detectada, inicializando...");

    // Se TMDbAPI não estiver disponível, define uma versão básica
    if (typeof TMDbAPI === "undefined") {
      // Importa a classe do script.js principal se não estiver disponível
      console.warn("TMDbAPI não encontrada, definindo versão local...");

      // Configuração local da API (fallback)
      const TMDB_CONFIG = {
        apiKey: "76f602a068980cf0c3f918176a5f3214",
        baseURL: "https://api.themoviedb.org/3",
        imageBaseURL: "https://image.tmdb.org/t/w500",
        language: "pt-BR",
      };

      window.TMDbAPI = class TMDbAPI {
        constructor() {
          this.cache = new Map();
        }

        construirURL(endpoint, params = {}) {
          const url = new URL(`${TMDB_CONFIG.baseURL}${endpoint}`);
          url.searchParams.append("api_key", TMDB_CONFIG.apiKey);
          url.searchParams.append("language", TMDB_CONFIG.language);

          Object.entries(params).forEach(([key, value]) => {
            if (value) url.searchParams.append(key, value);
          });

          return url.toString();
        }

        async fazerRequisicao(url) {
          if (this.cache.has(url)) {
            return this.cache.get(url);
          }

          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
          }

          const data = await response.json();
          this.cache.set(url, data);
          return data;
        }

        async buscarFilmesPopulares(page = 1) {
          const url = this.construirURL("/movie/popular", { page });
          return await this.fazerRequisicao(url);
        }

        async buscarGeneros() {
          const url = this.construirURL("/genre/movie/list");
          return await this.fazerRequisicao(url);
        }
      };
    }

    // Inicializa o dashboard
    const dashboard = new DashboardAnalytics();
    dashboard.init();

    // Torna disponível globalmente para debug
    window.dashboardAnalytics = dashboard;
  }
});

// Função global para debug
window.debugDashboard = function () {
  console.log("=== DEBUG DASHBOARD ===");
  if (window.dashboardAnalytics) {
    console.log(
      "Dados processados:",
      window.dashboardAnalytics.dados.processados
    );
    console.log(
      "Gráficos ativos:",
      Object.keys(window.dashboardAnalytics.charts)
    );
    console.log("Configuração de cores:", window.dashboardAnalytics.coresTema);
  } else {
    console.log("Dashboard não inicializado");
  }
  console.log("=====================");
};
