/**
 * BLOG UNIFICADO - JAVASCRIPT LIMPO E RESPONSIVO */

document.addEventListener('DOMContentLoaded', () => {
  console.log('🌱 Blog Unna inicializado com sucesso!');
  
  // ===== INICIALIZAÇÃO EMAILJS =====
  if (typeof emailjs !== 'undefined') {
    emailjs.init('OwPlkWLBC-bQYwOSt');
    console.log('📧 EmailJS inicializado');
  }

  // ===== INICIALIZAR TODOS OS MÓDULOS =====
  initNavigation();
  initScrollAnimations();
  initClock();
  initFooterQuotes();
  initContactForm();
  initShareButtons();
  initAccessibility();
  
  console.log('✅ Todos os módulos do blog carregados');
});

// ===== NAVEGAÇÃO HAMBÚRGUER =====
function initNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navOverlay = document.querySelector('.nav-overlay');
  
  if (!menuToggle || !navOverlay) return;

  // Abrir/fechar menu
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.classList.contains('active');
    
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Fechar menu ao clicar nos links
  navOverlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Fechar menu ao clicar fora (no overlay)
  navOverlay.addEventListener('click', (e) => {
    if (e.target === navOverlay) {
      closeMenu();
    }
  });

  // Fechar menu com tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navOverlay.classList.contains('open')) {
      closeMenu();
    }
  });

  // Funções auxiliares
  function openMenu() {
    menuToggle.classList.add('active');
    navOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Acessibilidade
    navOverlay.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    menuToggle.classList.remove('active');
    navOverlay.classList.remove('open');
    document.body.style.overflow = '';
    
    // Acessibilidade
    navOverlay.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
}

// ===== ANIMAÇÕES DE SCROLL =====
function initScrollAnimations() {
  // Animação de entrada nos cartões
  const cards = document.querySelectorAll('.card, .blog-article-card');
  
  if (cards.length > 0) {
    const cardObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Para performance, parar de observar após animação
          cardObserver.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.2,
      rootMargin: '50px 0px -50px 0px'
    });

    cards.forEach(card => {
      // Preparar para animação
      if (!card.classList.contains('active')) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      }
      cardObserver.observe(card);
    });
  }

  // Smooth scroll para links internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ===== RELÓGIO NO FOOTER =====
function initClock() {
  const clockEl = document.getElementById('clock');
  
  if (!clockEl) return;

  const updateClock = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-PT', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      timeZone: 'Europe/Lisbon'
    });
    
    clockEl.textContent = timeString;
  };
  
  // Atualizar imediatamente e depois a cada segundo
  updateClock();
  const clockInterval = setInterval(updateClock, 1000);
  
  // Limpar intervalo quando a página é fechada
  window.addEventListener('beforeunload', () => {
    clearInterval(clockInterval);
  });
}

// ===== CITAÇÕES ROTATIVAS NO FOOTER =====
function initFooterQuotes() {
  const footerQuoteEl = document.getElementById('footer-quote');
  
  if (!footerQuoteEl) return;

  const quotes = [
    'Semeia os teus sonhos, eles florescerão.',
    'Cada traço carrega uma história.',
    'A criatividade é o vento que nos move.',
    'O teu olhar transforma o mundo em arte.',
    'Entre pixels e pincéis, a alma encontra sua voz.',
    'Design é a ponte entre o invisível e o tangível.',
    'Quando criamos com alma, tocamos outras almas.',
    'A beleza nasce onde a técnica encontra o sagrado.'
  ];
  
  let currentIndex = Math.floor(Math.random() * quotes.length);
  
  const updateQuote = () => {
    // Fade out
    footerQuoteEl.style.opacity = '0';
    
    setTimeout(() => {
      footerQuoteEl.textContent = quotes[currentIndex];
      currentIndex = (currentIndex + 1) % quotes.length;
      
      // Fade in
      footerQuoteEl.style.opacity = '1';
    }, 300);
  };
  
  // Inicializar
  footerQuoteEl.style.transition = 'opacity 0.3s ease';
  updateQuote();
  
  // Atualizar a cada 12 segundos
  const quoteInterval = setInterval(updateQuote, 12000);
  
  // Limpar intervalo quando a página é fechada
  window.addEventListener('beforeunload', () => {
    clearInterval(quoteInterval);
  });
}

// ===== FORMULÁRIO DE CONTACTO =====
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  
  if (!contactForm) return;

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    console.log('📝 Formulário submetido');
    
    // Validação básica
    const formData = getFormData(this);
    
    if (!validateForm(formData)) {
      return;
    }
    
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    try {
      // Estado de carregamento
      setButtonState(submitButton, 'loading');
      
      // Enviar email via EmailJS
      const response = await emailjs.send(
        "service_vmxzcn4", 
        "template_7vvoj54", 
        formData
      );
      
      console.log('✅ Email enviado com sucesso:', response);
      
      // Sucesso
      setButtonState(submitButton, 'success');
      this.reset();
      showFormMessage('Mensagem enviada com sucesso! Entrarei em contacto em breve.', 'success');
      
      // Restaurar botão após 3 segundos
      setTimeout(() => {
        setButtonState(submitButton, 'default', originalText);
      }, 3000);
      
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      
      // Erro
      setButtonState(submitButton, 'default', originalText);
      
      const errorMessage = getErrorMessage(error);
      showFormMessage(errorMessage, 'error');
    }
  });
}

// ===== FUNÇÕES AUXILIARES DO FORMULÁRIO =====
function getFormData(form) {
  return {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    subject: form.title?.value?.trim() || 'Contacto via Blog',
    message: form.message.value.trim()
  };
}

function validateForm(data) {
  if (!data.name || !data.email || !data.message) {
    showFormMessage('Por favor, preenche todos os campos obrigatórios.', 'error');
    return false;
  }
  
  if (!isValidEmail(data.email)) {
    showFormMessage('Por favor, insere um email válido.', 'error');
    return false;
  }
  
  return true;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function setButtonState(button, state, customText = null) {
  const states = {
    default: customText || '<span>Enviar mensagem</span><span class="arrow">➔</span>',
    loading: '<span>Enviando...</span>',
    success: '<span>Mensagem enviada! ✨</span>'
  };
  
  button.innerHTML = states[state];
  button.disabled = state === 'loading';
  
  if (state === 'success') {
    button.style.background = 'var(--moss, #4a5d3a)';
  } else if (state === 'default') {
    button.style.background = '';
  }
}

function getErrorMessage(error) {
  let errorMessage = 'Erro ao enviar mensagem. ';
  
  if (error.status === 400) {
    errorMessage += 'Dados do formulário inválidos.';
  } else if (error.status === 401) {
    errorMessage += 'Problema de autenticação.';
  } else if (error.status === 404) {
    errorMessage += 'Serviço não encontrado.';
  } else if (error.text) {
    errorMessage += error.text;
  } else {
    errorMessage += 'Por favor, tenta novamente ou contacta-nos diretamente.';
  }
  
  return errorMessage;
}

function showFormMessage(message, type = 'info') {
  // Remove mensagem anterior se existir
  const existingMessage = document.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Criar nova mensagem
  const messageEl = document.createElement('div');
  messageEl.className = `form-message form-message--${type}`;
  messageEl.textContent = message;
  
  // Estilos inline para garantir visibilidade
  Object.assign(messageEl.style, {
    margin: '1rem 0',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    lineHeight: '1.4',
    animation: 'slideIn 0.3s ease-out'
  });
  
  // Cores baseadas no tipo
  const colors = {
    success: { bg: 'rgba(74, 93, 58, 0.1)', border: '#4f7a65', color: '#4f7a65' },
    error: { bg: 'rgba(220, 53, 69, 0.1)', border: '#dc3545', color: '#dc3545' },
    info: { bg: 'rgba(13, 110, 253, 0.1)', border: '#0d6efd', color: '#0d6efd' }
  };
  
  const colorScheme = colors[type] || colors.info;
  Object.assign(messageEl.style, {
    backgroundColor: colorScheme.bg,
    border: `1px solid ${colorScheme.border}`,
    color: colorScheme.color
  });
  
  // Adicionar após o formulário
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.insertAdjacentElement('afterend', messageEl);
    
    // Remover mensagem após tempo apropriado
    const timeout = type === 'error' ? 8000 : 5000;
    setTimeout(() => {
      if (messageEl && messageEl.parentNode) {
        messageEl.style.opacity = '0';
        setTimeout(() => messageEl.remove(), 300);
      }
    }, timeout);
  }
}

// ===== BOTÕES DE PARTILHA =====
function initShareButtons() {
  window.shareArticle = function(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const description = getPageDescription();
    
    const shareUrls = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${description}`,
      whatsapp: `https://wa.me/?text=${description}%20${url}`,
      email: `mailto:?subject=${title}&body=${description}%0D%0A%0D%0A${decodeURIComponent(url)}`
    };
    
    const shareUrl = shareUrls[platform];
    
    if (shareUrl) {
      if (platform === 'email') {
        window.location.href = shareUrl;
      } else {
        window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
      }
      
      console.log(`📤 Partilhado via ${platform}`);
    }
  };
}

function getPageDescription() {
  const metaDescription = document.querySelector('meta[name="description"]');
  const excerpt = document.querySelector('.article-excerpt');
  
  if (metaDescription) {
    return encodeURIComponent(metaDescription.content);
  } else if (excerpt) {
    return encodeURIComponent(excerpt.textContent.substring(0, 100) + '...');
  } else {
    return encodeURIComponent('Reflexões sobre design com alma no blog da Unna.');
  }
}

// ===== ACESSIBILIDADE =====
function initAccessibility() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });

  const pageTitle = document.title;
  if (pageTitle) {
    announceToScreenReader(`Página carregada: ${pageTitle}`);
  }
}

function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  
  document.body.appendChild(announcement);
  announcement.textContent = message;
  
  // Remove after announcement
  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement);
    }
  }, 1000);
}

// ===== UTILITÁRIOS GLOBAIS =====

// Função para copiar texto (útil para partilhas)
function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback para navegadores mais antigos
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    return new Promise((resolve, reject) => {
      if (document.execCommand('copy')) {
        textArea.remove();
        resolve();
      } else {
        textArea.remove();
        reject();
      }
    });
  }
}

// Função para detectar preferências do utilizador
function getUserPreferences() {
  return {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    highContrast: window.matchMedia('(prefers-contrast: high)').matches
  };
}

// Função para logging responsável
function logDebug(message, data = null) {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log(`🐛 ${message}`, data || '');
  }
}

// ===== PERFORMANCE E CLEANUP =====

// Cleanup quando a página é fechada
window.addEventListener('beforeunload', () => {
  // Limpar eventuais intervalos ou timeouts que possam estar ativos
  console.log('🧹 Limpeza da página executada');
});

// Detectar problemas de performance
if ('PerformanceObserver' in window) {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        logDebug('LCP detectado:', entry.startTime);
      }
    }
  });
  
  observer.observe({ entryTypes: ['largest-contentful-paint'] });
}

console.log('✨ Blog Unna totalmente carregado e otimizado!');