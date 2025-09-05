// ===================================================================
// ================ SISTEMA DE CONTROLES DE ACESSIBILIDADE ===========
// ===================================================================

/**
 * Sistema de Acessibilidade - Meu Streaming
 *
 * Este módulo implementa os controles de acessibilidade que permitem:
 * - Alternância entre tema escuro e claro
 * - Ajuste do tamanho da fonte
 * - Persistência das configurações entre páginas
 * - Aplicação instantânea das mudanças
 */

class AccessibilityManager {
  constructor() {
    this.STORAGE_KEYS = {
      THEME: "meustreaming_tema_escolhido",
      FONT_SIZE: "meustreaming_tamanho_fonte",
    };

    this.THEME_VALUES = {
      LIGHT: "claro",
      DARK: "escuro",
    };

    this.FONT_VALUES = {
      NORMAL: "normal",
      LARGE: "grande",
    };

    // Inicializar o sistema
    this.init();
  }

  /**
   * Inicializa o sistema de acessibilidade
   */
  init() {
    // Aplicar configurações salvas antes mesmo da página carregar completamente
    this.applyStoredSettings();

    // Configurar event listeners quando a página carregar
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.setupEventListeners()
      );
    } else {
      this.setupEventListeners();
    }
  }

  /**
   * Aplica as configurações salvas no localStorage
   * Este método roda o mais cedo possível para evitar "flash" de tema incorreto
   */
  applyStoredSettings() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEYS.THEME);
    const savedFontSize = localStorage.getItem(this.STORAGE_KEYS.FONT_SIZE);

    // Aplicar tema salvo
    if (savedTheme === this.THEME_VALUES.LIGHT) {
      this.enableLightTheme(false); // false = não salvar novamente
    }

    // Aplicar tamanho de fonte salvo
    if (savedFontSize === this.FONT_VALUES.LARGE) {
      this.enableLargeFont(false); // false = não salvar novamente
    }
  }

  /**
   * Configura os event listeners para os controles de acessibilidade
   */
  setupEventListeners() {
    // Toggle de Alto Contraste (Modo Claro)
    const highContrastToggle = document.getElementById("highContrastToggle");
    if (highContrastToggle) {
      // Definir estado inicial do toggle baseado na configuração salva
      const currentTheme = localStorage.getItem(this.STORAGE_KEYS.THEME);
      highContrastToggle.checked = currentTheme === this.THEME_VALUES.LIGHT;

      // Event listener para mudanças
      highContrastToggle.addEventListener("change", (e) => {
        if (e.target.checked) {
          this.enableLightTheme();
        } else {
          this.enableDarkTheme();
        }
      });
    }

    // Toggle de Texto Grande
    const largeTextToggle = document.getElementById("largeTextToggle");
    if (largeTextToggle) {
      // Definir estado inicial do toggle baseado na configuração salva
      const currentFontSize = localStorage.getItem(this.STORAGE_KEYS.FONT_SIZE);
      largeTextToggle.checked = currentFontSize === this.FONT_VALUES.LARGE;

      // Event listener para mudanças
      largeTextToggle.addEventListener("change", (e) => {
        if (e.target.checked) {
          this.enableLargeFont();
        } else {
          this.enableNormalFont();
        }
      });
    }
  }

  /**
   * Ativa o tema claro
   * @param {boolean} saveToStorage - Se deve salvar a configuração no localStorage
   */
  enableLightTheme(saveToStorage = true) {
    document.body.classList.add("light-theme");

    if (saveToStorage) {
      localStorage.setItem(this.STORAGE_KEYS.THEME, this.THEME_VALUES.LIGHT);
      console.log("✅ Tema claro ativado e salvo");
    }

    // Disparar evento customizado para outros sistemas reagirem
    this.dispatchAccessibilityEvent("themeChanged", { theme: "light" });
  }

  /**
   * Ativa o tema escuro
   * @param {boolean} saveToStorage - Se deve salvar a configuração no localStorage
   */
  enableDarkTheme(saveToStorage = true) {
    document.body.classList.remove("light-theme");

    if (saveToStorage) {
      localStorage.setItem(this.STORAGE_KEYS.THEME, this.THEME_VALUES.DARK);
      console.log("✅ Tema escuro ativado e salvo");
    }

    // Disparar evento customizado para outros sistemas reagirem
    this.dispatchAccessibilityEvent("themeChanged", { theme: "dark" });
  }

  /**
   * Ativa fonte grande
   * @param {boolean} saveToStorage - Se deve salvar a configuração no localStorage
   */
  enableLargeFont(saveToStorage = true) {
    document.documentElement.classList.add("font-large");

    if (saveToStorage) {
      localStorage.setItem(this.STORAGE_KEYS.FONT_SIZE, this.FONT_VALUES.LARGE);
      console.log("✅ Fonte grande ativada e salva");
    }

    // Disparar evento customizado para outros sistemas reagirem
    this.dispatchAccessibilityEvent("fontSizeChanged", { fontSize: "large" });
  }

  /**
   * Ativa fonte normal
   * @param {boolean} saveToStorage - Se deve salvar a configuração no localStorage
   */
  enableNormalFont(saveToStorage = true) {
    document.documentElement.classList.remove("font-large");

    if (saveToStorage) {
      localStorage.setItem(
        this.STORAGE_KEYS.FONT_SIZE,
        this.FONT_VALUES.NORMAL
      );
      console.log("✅ Fonte normal ativada e salva");
    }

    // Disparar evento customizado para outros sistemas reagirem
    this.dispatchAccessibilityEvent("fontSizeChanged", { fontSize: "normal" });
  }

  /**
   * Dispara eventos customizados para que outros sistemas possam reagir às mudanças
   */
  dispatchAccessibilityEvent(eventName, data) {
    const event = new CustomEvent(`accessibility:${eventName}`, {
      detail: data,
      bubbles: true,
    });
    document.dispatchEvent(event);
  }

  /**
   * Retorna as configurações atuais de acessibilidade
   */
  getCurrentSettings() {
    return {
      theme:
        localStorage.getItem(this.STORAGE_KEYS.THEME) || this.THEME_VALUES.DARK,
      fontSize:
        localStorage.getItem(this.STORAGE_KEYS.FONT_SIZE) ||
        this.FONT_VALUES.NORMAL,
      isLightTheme: document.body.classList.contains("light-theme"),
      isLargeFont: document.documentElement.classList.contains("font-large"),
    };
  }

  /**
   * Reset para configurações padrão
   */
  resetToDefaults() {
    this.enableDarkTheme();
    this.enableNormalFont();
    console.log("✅ Configurações de acessibilidade resetadas para o padrão");
  }
}

// ===================================================================
// ================ CSS ADICIONAL PARA FONTE GRANDE ==================
// ===================================================================

/**
 * Adiciona as regras CSS para o sistema de fonte grande
 * Este CSS será injetado dinamicamente na página
 */
function injectAccessibilityCSS() {
  const cssRules = `
        /* Sistema de Fonte Grande */
        html.font-large {
            font-size: 18px !important; /* Base aumentada de 16px para 18px */
        }
        
        /* Ajustes específicos para elementos que precisam de refinamento */
        html.font-large .navbar-brand {
            font-size: 2rem; /* Proporcionalmente maior */
        }
        
        html.font-large .btn {
            padding: 0.5rem 1.2rem; /* Botões um pouco maiores */
        }
        
        html.font-large .form-control,
        html.font-large .form-select {
            padding: 0.6rem 1rem; /* Inputs mais confortáveis */
        }
        
        html.font-large .card-title {
            font-size: 1.35rem; /* Títulos de cards proporcionais */
        }
        
        html.font-large .navbar-nav .nav-link {
            padding: 0.6rem 1rem; /* Links da navbar mais acessíveis */
        }
        
        /* Garantir que ícones do Font Awesome escalonem proporcionalmente */
        html.font-large .fa,
        html.font-large .fas,
        html.font-large .far,
        html.font-large .fab {
            font-size: 1.1em; /* Ícones ligeiramente maiores */
        }
        
        /* Ajustar espaçamento de elementos pequenos */
        html.font-large small,
        html.font-large .small {
            font-size: 0.9rem; /* Textos pequenos ainda legíveis */
        }
        
        /* Melhorar legibilidade de badges */
        html.font-large .badge {
            font-size: 0.85rem;
            padding: 0.4rem 0.8rem;
        }
        
        /* Responsividade - em telas pequenas, ser mais conservador */
        @media (max-width: 768px) {
            html.font-large {
                font-size: 17px !important; /* Um pouco menos agressivo em mobile */
            }
        }
    `;

  // Verificar se o CSS já foi injetado
  if (!document.getElementById("accessibility-css")) {
    const style = document.createElement("style");
    style.id = "accessibility-css";
    style.textContent = cssRules;
    document.head.appendChild(style);
  }
}

// ===================================================================
// ================ INTEGRAÇÃO COM DASHBOARD/GRÁFICOS ================
// ===================================================================

/**
 * Sistema para sincronizar gráficos do Chart.js com as mudanças de tema
 */
class ChartThemeManager {
  constructor() {
    this.charts = new Map(); // Armazena referências dos gráficos
    this.setupThemeListener();
  }

  /**
   * Registra um gráfico para ser atualizado quando o tema mudar
   */
  registerChart(chartId, chartInstance) {
    this.charts.set(chartId, chartInstance);
    console.log(`📊 Gráfico ${chartId} registrado para atualizações de tema`);
  }

  /**
   * Remove um gráfico do registro
   */
  unregisterChart(chartId) {
    this.charts.delete(chartId);
  }

  /**
   * Configura o listener para mudanças de tema
   */
  setupThemeListener() {
    document.addEventListener("accessibility:themeChanged", (e) => {
      const isLightTheme = e.detail.theme === "light";
      this.updateAllCharts(isLightTheme);
    });
  }

  /**
   * Atualiza todos os gráficos registrados com o novo tema
   */
  updateAllCharts(isLightTheme) {
    const colors = this.getThemeColors(isLightTheme);

    this.charts.forEach((chart, chartId) => {
      try {
        this.updateChartTheme(chart, colors);
        console.log(`✅ Tema do gráfico ${chartId} atualizado`);
      } catch (error) {
        console.error(`❌ Erro ao atualizar gráfico ${chartId}:`, error);
      }
    });
  }

  /**
   * Retorna as cores apropriadas para o tema atual
   */
  getThemeColors(isLightTheme) {
    if (isLightTheme) {
      return {
        background: "#f8f9fa",
        text: "#212529",
        grid: "rgba(0, 0, 0, 0.1)",
        primary: "#dc3545",
        secondary: "#6c757d",
      };
    } else {
      return {
        background: "#0a0a0a",
        text: "#ffffff",
        grid: "rgba(255, 255, 255, 0.1)",
        primary: "#e53e3e",
        secondary: "#b9c6d8",
      };
    }
  }

  /**
   * Atualiza um gráfico específico com as novas cores
   */
  updateChartTheme(chart, colors) {
    // Atualizar cores do grid e textos
    if (chart.options.scales) {
      Object.keys(chart.options.scales).forEach((scaleKey) => {
        const scale = chart.options.scales[scaleKey];
        if (scale.ticks) scale.ticks.color = colors.text;
        if (scale.grid) scale.grid.color = colors.grid;
      });
    }

    // Atualizar cores dos datasets se necessário
    if (chart.data.datasets) {
      chart.data.datasets.forEach((dataset) => {
        // Manter cores primárias, mas ajustar bordas se necessário
        if (dataset.borderColor && typeof dataset.borderColor === "string") {
          dataset.borderColor = colors.primary;
        }
      });
    }

    // Aplicar as mudanças
    chart.update("none"); // 'none' = sem animação para mudança instantânea
  }
}

// ===================================================================
// ================ INICIALIZAÇÃO GLOBAL ==============================
// ===================================================================

// Instanciar o gerenciador de acessibilidade globalmente
let accessibilityManager;
let chartThemeManager;

// Função para inicializar tudo o mais cedo possível
function initializeAccessibility() {
  // Injetar CSS personalizado
  injectAccessibilityCSS();

  // Criar instância global do gerenciador de acessibilidade
  accessibilityManager = new AccessibilityManager();

  // Criar gerenciador de tema para gráficos
  chartThemeManager = new ChartThemeManager();

  // Expor funções globalmente para compatibilidade
  window.accessibilityManager = accessibilityManager;
  window.chartThemeManager = chartThemeManager;

  console.log("🎯 Sistema de Acessibilidade inicializado com sucesso!");
}

// Inicializar imediatamente se o DOM já carregou, senão aguardar
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAccessibility);
} else {
  initializeAccessibility();
}

// ===================================================================
// ================ FUNÇÕES UTILITÁRIAS PARA COMPATIBILIDADE =========
// ===================================================================

/**
 * Função de conveniência para alternar tema
 */
function toggleTheme() {
  const currentSettings = accessibilityManager.getCurrentSettings();
  if (currentSettings.isLightTheme) {
    accessibilityManager.enableDarkTheme();
  } else {
    accessibilityManager.enableLightTheme();
  }
}

/**
 * Função de conveniência para alternar tamanho da fonte
 */
function toggleFontSize() {
  const currentSettings = accessibilityManager.getCurrentSettings();
  if (currentSettings.isLargeFont) {
    accessibilityManager.enableNormalFont();
  } else {
    accessibilityManager.enableLargeFont();
  }
}

/**
 * Função para obter cores CSS atuais (útil para gráficos)
 */
function getCurrentCSSColors() {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);

  return {
    primary: computedStyle.getPropertyValue("--primary-accent").trim(),
    background: computedStyle.getPropertyValue("--background-primary").trim(),
    text: computedStyle.getPropertyValue("--text-primary").trim(),
    secondary: computedStyle.getPropertyValue("--text-secondary").trim(),
  };
}

// Exportar para uso global
window.toggleTheme = toggleTheme;
window.toggleFontSize = toggleFontSize;
window.getCurrentCSSColors = getCurrentCSSColors;
