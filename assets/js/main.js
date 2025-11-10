/**
 * Embaixadores de Cristo E.B.C - Sistema Principal CORRIGIDO
 * Ministério Musical Gospel Angolano
 * @version 3.1.0
 * @author José Mbenga da Costa
 */

class EmbaixadoresMinisterio {
  constructor() {
    this.config = {
      theme: {
        current: localStorage.getItem("ministerio-theme") || "light",
        storageKey: "ministerio-theme",
      },
      verses: {
        storageKey: "ministerio-daily-verse",
        expiration: 24 * 60 * 60 * 1000, // 24 horas
      },
    };

    this.state = {
      isLoading: true,
      isOnline: navigator.onLine,
      currentSection: "home",
      lastScrollY: 0,
      statsAnimated: false,
    };

    this.verses = [
      {
        text: "De sorte que somos embaixadores da parte de Cristo, como se Deus por nós rogasse. Rogamos-vos, pois, da parte de Cristo, que vos reconcilieis com Deus.",
        reference: "2 Coríntios 5:20",
      },
      {
        text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
        reference: "João 3:16",
      },
      {
        text: "Posso todas as coisas naquele que me fortalece.",
        reference: "Filipenses 4:13",
      },
      {
        text: "O Senhor é o meu pastor, nada me faltará.",
        reference: "Salmos 23:1",
      },
      {
        text: "Vós sois a luz do mundo; não se pode esconder uma cidade edificada sobre um monte.",
        reference: "Mateus 5:14",
      },
      {
        text: "Lança o teu cuidado sobre o Senhor, e ele te susterá; não permitirá jamais que o justo seja abalado.",
        reference: "Salmos 55:22",
      },
      {
        text: "O meu Deus, segundo as suas riquezas, suprirá todas as vossas necessidades em glória, por Cristo Jesus.",
        reference: "Filipenses 4:19",
      },
      {
        text: "Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará.",
        reference: "Salmos 37:5",
      },
      {
        text: "Tudo posso naquele que me fortalece.",
        reference: "Filipenses 4:13",
      },
      {
        text: "Porque para Deus nada é impossível.",
        reference: "Lucas 1:37",
      },
    ];

    this.init();
  }

  /**
   * Inicialização principal
   */
  async init() {
    try {
      console.log("🎵 Iniciando Embaixadores de Cristo E.B.C");

      // Ordem de inicialização
      this.initializeEventListeners();
      this.applyTheme(this.config.theme.current);
      this.initializeNavigation();
      this.initializeThemeManager();
      this.initializeDailyVerse();
      this.initializeStatsCounter();
      this.initializeContactSystem();
      this.initializeScrollSystem();
      this.initializeConnectionManager();
      this.initializeMusicPlayer();

      this.state.isLoading = false;
      console.log("✅ Sistema inicializado com sucesso");
    } catch (error) {
      console.error("❌ Erro na inicialização:", error);
      this.handleError(error);
    }
  }

  

  /**
   * Event Listeners Básicos
   */
  initializeEventListeners() {
    // Loading screen
    window.addEventListener("load", () => {
      setTimeout(() => {
        const loadingScreen = document.getElementById("loading-screen");
        if (loadingScreen) {
          loadingScreen.style.opacity = "0";
          setTimeout(() => {
            loadingScreen.style.display = "none";
            document.body.classList.remove("loading");
          }, 500);
        }
      }, 1000);
    });

    // Error handling global
    window.addEventListener("error", (e) => {
      this.handleError(e.error);
    });

    // Prevenir comportamento padrão de forms
    document.addEventListener("submit", (e) => {
      if (e.target.id !== "contactForm") {
        e.preventDefault();
      }
    });
  }

  /**
   * Sistema de Navegação
   */
  initializeNavigation() {
    // Navegação suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      if (anchor.getAttribute("href") !== "#") {
        anchor.addEventListener("click", (e) => {
          e.preventDefault();
          const targetId = anchor.getAttribute("href");
          this.navigateToSection(targetId);
        });
      }
    });

    // Detecção de seção ativa
    window.addEventListener("scroll", () => {
      this.updateActiveNavigation();
      this.handleNavbarScroll();
    });

    // Mobile navigation
    this.initializeMobileNavigation();

    // Inicializar navegação ativa
    this.updateActiveNavigation();
  }

  navigateToSection(sectionId) {
    const target = document.querySelector(sectionId);
    if (!target) return;

    const navbar = document.querySelector(".navbar");
    const navbarHeight = navbar ? navbar.offsetHeight : 80;
    const targetPosition = target.offsetTop - navbarHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    this.updateActiveNavLink(sectionId);
  }

  updateActiveNavigation() {
    const sections = document.querySelectorAll("section[id]");
    const scrollPosition = window.scrollY + 100;

    let currentSection = "home";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        currentSection = section.id;
      }
    });

    if (this.state.currentSection !== currentSection) {
      this.state.currentSection = currentSection;
      this.updateActiveNavLink(`#${currentSection}`);
    }
  }

  updateActiveNavLink(activeLink) {
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === activeLink) {
        link.classList.add("active");
      }
    });
  }

  handleNavbarScroll() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    const scrolled = window.scrollY > 100;
    navbar.classList.toggle("scrolled", scrolled);

    // Hide navbar on scroll down
    if (
      scrolled &&
      this.state.lastScrollY < window.scrollY &&
      window.scrollY > 200
    ) {
      navbar.classList.add("navbar-hidden");
    } else {
      navbar.classList.remove("navbar-hidden");
    }

    this.state.lastScrollY = window.scrollY;
  }

  initializeMobileNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.querySelector(".navbar-collapse");

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (
          navbarCollapse &&
          navbarCollapse.classList.contains("show") &&
          navbarToggler
        ) {
          navbarToggler.click();
        }
      });
    });
  }

  /**
   * Sistema de Tema
   */
  initializeThemeManager() {
    const themeToggle = document.getElementById("themeToggle");
    if (!themeToggle) return;

    themeToggle.addEventListener("click", () => {
      this.toggleTheme();
    });

    // Atualizar ícone do tema inicial
    this.updateThemeIcon();

    // Detectar preferência do sistema
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", (e) => {
      if (!localStorage.getItem(this.config.theme.storageKey)) {
        this.applyTheme(e.matches ? "dark" : "light");
      }
    });
  }

  toggleTheme() {
    this.config.theme.current =
      this.config.theme.current === "light" ? "dark" : "light";
    this.applyTheme(this.config.theme.current);
    localStorage.setItem(
      this.config.theme.storageKey,
      this.config.theme.current
    );
    this.updateThemeIcon();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    const themeColor = theme === "dark" ? "#121212" : "#1e3c72";
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", themeColor);
    }
  }

  updateThemeIcon() {
    const icon = document.querySelector("#themeToggle i");
    if (icon) {
      icon.className =
        this.config.theme.current === "dark"
          ? "bi bi-sun-fill"
          : "bi bi-moon-fill";
    }
  }

  /**
   * Sistema de Versículo Diário - CORRIGIDO
   */
  initializeDailyVerse() {
    const newVerseBtn = document.getElementById("new-verse-btn");
    if (newVerseBtn) {
      newVerseBtn.addEventListener("click", () => this.fetchNewVerse());
    }

    // Carregar versículo inicial
    this.fetchNewVerse();
  }

  async fetchNewVerse() {
    try {
      const randomIndex = Math.floor(Math.random() * this.verses.length);
      const verse = this.verses[randomIndex];

      this.displayVerse(verse);

      // Animar o botão
      const button = document.getElementById("new-verse-btn");
      if (button) {
        button.classList.add("loading");
        setTimeout(() => {
          button.classList.remove("loading");
        }, 1000);
      }
    } catch (error) {
      console.error("Erro ao carregar versículo:", error);
      // Fallback para versículo padrão
      this.displayVerse({
        text: "De sorte que somos embaixadores da parte de Cristo, como se Deus por nós rogasse.",
        reference: "2 Coríntios 5:20",
      });
    }
  }

  displayVerse(verse) {
    const verseText = document.getElementById("daily-verse-text");
    const verseRef = document.getElementById("daily-verse-ref");

    if (verseText) {
      verseText.style.opacity = "0";
      setTimeout(() => {
        verseText.textContent = `"${verse.text}"`;
        verseText.style.opacity = "1";
      }, 300);
    }

    if (verseRef) {
      verseRef.style.opacity = "0";
      setTimeout(() => {
        verseRef.textContent = verse.reference;
        verseRef.style.opacity = "1";
      }, 500);
    }
  }

  /**
   * Sistema de Contador de Estatísticas - NOVO
   */
  initializeStatsCounter() {
    const statsSection = document.querySelector(".stats-section");
    if (!statsSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.state.statsAnimated) {
            this.animateStats();
            this.state.statsAnimated = true;
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(statsSection);
  }

  animateStats() {
    const statNumbers = document.querySelectorAll(".stat-number");

    statNumbers.forEach((stat) => {
      const target = parseInt(stat.getAttribute("data-count"));
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          stat.textContent = target.toLocaleString();
          clearInterval(timer);
        } else {
          stat.textContent = Math.floor(current).toLocaleString();
        }
      }, 16);
    });
  }

  /**
   * Sistema de Contato - CORRIGIDO
   */
  initializeContactSystem() {
    this.initializeContactForm();
  }

  initializeContactForm() {
    const contactForm = document.getElementById("contactForm");
    if (!contactForm) {
      console.log("ℹ️ Formulário de contato não encontrado");
      return;
    }

    console.log("✅ Formulário de contato encontrado, inicializando...");
    this.setupContactForm(contactForm);
  }

  setupContactForm(form) {
    // Configurar submit
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleFormSubmit(form);
    });

    // Configurar validação em tempo real
    const inputs = form.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => {
      // Limpar validação ao digitar
      input.addEventListener("input", () => {
        this.clearFieldValidation(input);
      });

      // Validação ao sair do campo
      input.addEventListener("blur", () => {
        this.validateField(input);
      });
    });

    console.log("✅ Formulário configurado com sucesso");
  }

  handleFormSubmit(form) {
    console.log("📝 Enviando formulário...");

    const isValid = this.validateForm(form);

    if (isValid) {
      this.showNotification(
        "Mensagem enviada com sucesso! Entraremos em contato em breve.",
        "success"
      );

      // Simular envio (em produção, substituir por fetch/API)
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="bi bi-check me-2"></i>Enviado!';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Reset visual
        form.querySelectorAll(".is-valid").forEach((el) => {
          el.classList.remove("is-valid");
        });
      }, 3000);
    } else {
      this.showNotification(
        "Por favor, preencha todos os campos obrigatórios corretamente.",
        "error"
      );
    }
  }

  validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll("[required]");

    requiredFields.forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    // Limpar estados anteriores
    this.clearFieldValidation(field);

    if (field.hasAttribute("required") && !value) {
      isValid = false;
      this.showFieldError(field, "Este campo é obrigatório.");
    } else if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        this.showFieldError(field, "Por favor, insira um email válido.");
      }
    } else if (
      field.tagName === "SELECT" &&
      field.hasAttribute("required") &&
      !value
    ) {
      isValid = false;
      this.showFieldError(field, "Por favor, selecione uma opção.");
    }

    // Aplicar estados visuais
    if (!isValid) {
      field.classList.add("is-invalid");
    } else if (value) {
      field.classList.add("is-valid");
    }

    return isValid;
  }

  clearFieldValidation(field) {
    field.classList.remove("is-invalid", "is-valid");

    const errorElement = field.parentNode.querySelector(".invalid-feedback");
    if (errorElement) {
      errorElement.remove();
    }
  }

  showFieldError(field, message) {
    const errorElement = document.createElement("div");
    errorElement.className = "invalid-feedback";
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
  }

  /**
   * Sistema de Scroll
   */
  initializeScrollSystem() {
    this.initializeReadingProgress();
    this.initializeBackToTop();
    this.initializeScrollAnimations();
  }

  initializeReadingProgress() {
    const progressBar = document.getElementById("reading-progress");
    if (!progressBar) return;

    window.addEventListener("scroll", () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

      progressBar.style.width = `${scrollPercent}%`;
    });
  }

  initializeBackToTop() {
    const backToTopBtn = document.getElementById("back-to-top");
    if (!backToTopBtn) return;

    window.addEventListener("scroll", () => {
      backToTopBtn.classList.toggle("show", window.pageYOffset > 300);
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  initializeScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
      ".card, .section-title, .member-profile, .news-card, .event-card"
    );
    animatedElements.forEach((el) => {
      el.classList.add("animate-ready");
      observer.observe(el);
    });
  }

  /**
   * Sistema de Music Player
   */
  initializeMusicPlayer() {
    const lyricsBtn = document.querySelector(".platform-btn.lyrics");
    if (lyricsBtn) {
      lyricsBtn.addEventListener("click", () => {
        this.showNotification("Letra da música disponível em breve!", "info");
      });
    }

    // Inicializar players de streaming
    this.initializeStreamingLinks();
  }

  initializeStreamingLinks() {
    const streamingLinks = document.querySelectorAll(
      ".platform-btn:not(.lyrics)"
    );
    streamingLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        if (link.getAttribute("href") === "#") {
          e.preventDefault();
          this.showNotification(
            "Disponível em breve nesta plataforma!",
            "info"
          );
        }
      });
    });
  }

  /**
   * Gerenciador de Conexão
   */
  initializeConnectionManager() {
    const statusElement = document.getElementById("connection-status");
    if (!statusElement) return;

    // Adicionar funcionalidade de dismiss
    statusElement.addEventListener("click", () => {
      statusElement.classList.remove("show");
    });

    const updateStatus = () => {
      this.state.isOnline = navigator.onLine;

      statusElement.classList.toggle("online", this.state.isOnline);
      statusElement.classList.toggle("offline", !this.state.isOnline);
      statusElement.classList.add("show");

      if (this.state.isOnline) {
        statusElement.innerHTML = `
                    <div class="container">
                        <i class="bi bi-wifi me-2" aria-hidden="true"></i>
                        <span>Conexão restaurada - Clique para fechar</span>
                    </div>
                `;
        // Auto-dismiss após 5 segundos
        setTimeout(() => {
          if (this.state.isOnline) {
            statusElement.classList.remove("show");
          }
        }, 5000);
      } else {
        statusElement.innerHTML = `
                    <div class="container">
                        <i class="bi bi-wifi-off me-2" aria-hidden="true"></i>
                        <span>Você está offline - Clique para fechar</span>
                    </div>
                `;
      }
    };

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    updateStatus();
  }

  /**
 * Sistema de Notificações 
 */
showNotification(message, type = 'info') {
    // Criar container se não existir
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }
    
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast align-items-center text-bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    // Ícones para cada tipo
    const icons = {
        success: 'check-circle',
        error: 'exclamation-triangle',
        danger: 'exclamation-triangle',
        warning: 'exclamation-circle',
        info: 'info-circle'
    };
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="bi bi-${icons[type] || 'info-circle'} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" 
                    data-bs-dismiss="toast" aria-label="Fechar"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Usar Bootstrap Toast se disponível
    if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
        const bsToast = new bootstrap.Toast(toast, { 
            autohide: true, 
            delay: 5000 
        });
        bsToast.show();
    } else {
        // Fallback simples
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 5000);
    }
    
    // Auto-remove após algum tempo
    setTimeout(() => {
        if (document.getElementById(toastId)) {
            document.getElementById(toastId).remove();
        }
    }, 8000);
    
    // Fechar ao clicar
    toast.addEventListener('click', (e) => {
        if (e.target.closest('.btn-close')) {
            if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
                const bsToast = bootstrap.Toast.getInstance(toast);
                if (bsToast) bsToast.hide();
            } else {
                toast.remove();
            }
        }
    });
}

  getNotificationIcon(type) {
    const icons = {
      success: "check-circle",
      error: "exclamation-triangle",
      warning: "exclamation-circle",
      info: "info-circle",
    };
    return icons[type] || "info-circle";
  }

  /**
   * Tratamento de Erros
   */
  handleError(error) {
    console.error("💥 Erro capturado:", error);
    this.showNotification(
      "Ocorreu um erro inesperado. Recarregue a página se o problema persistir.",
      "error"
    );
  }

  /**
   * Utilitários
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
}

// Inicialização quando DOM estiver pronto
document.addEventListener("DOMContentLoaded", function () {
  // Verificar se há console disponível
  if (typeof console === "undefined") {
    window.console = {
      log: function () {},
      error: function () {},
      warn: function () {},
      info: function () {},
    };
  }

  // Polyfill para browsers antigos
  if (!NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

  // Inicializar o ministério
  try {
    window.MinisterioEBC = new EmbaixadoresMinisterio();
    console.log("🚀 Embaixadores de Cristo E.B.C inicializado com sucesso!");
    console.log("🎵 Ministério Musical Pronto para Usar");
  } catch (error) {
    console.error("❌ Falha crítica na inicialização:", error);

    // Fallback básico
    const fallbackInit = () => {
      // Navegação suave básica
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute("href"));
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        });
      });
    };

    fallbackInit();
  }
});

// Suporte a módulos
if (typeof module !== "undefined" && module.exports) {
  module.exports = EmbaixadoresMinisterio;
}

// Interface global para debugging
window.debugMinisterio = function () {
  if (window.MinisterioEBC) {
    console.log("🔧 Debug - Estado do Ministério:", window.MinisterioEBC.state);
    console.log("🔧 Debug - Configurações:", window.MinisterioEBC.config);
    return window.MinisterioEBC;
  } else {
    console.log("❌ Ministério não inicializado");
    return null;
  }
};
