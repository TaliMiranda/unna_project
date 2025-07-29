document.addEventListener('DOMContentLoaded', () => {
  // ===== INICIALIZAÇÃO EMAILJS =====
  emailjs.init('OwPlkWLBC-bQYwOSt');
  console.log('📧 EmailJS inicializado');

  // ===== MENU HAMBÚRGUER =====
  const menuToggle = document.querySelector('.menu-toggle');
  const navOverlay = document.querySelector('.nav-overlay');
  
  if (menuToggle && navOverlay) {
    // Abrir/fechar menu
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navOverlay.classList.toggle('open');
      document.body.style.overflow = navOverlay.classList.contains('open') ? 'hidden' : '';
    });

    // Fechar menu ao clicar nos links
    navOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
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

    // Função auxiliar para fechar menu
    function closeMenu() {
      menuToggle.classList.remove('active');
      navOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // ===== ANIMAÇÃO DE ENTRADA NOS CARTÕES =====
  const cards = document.querySelectorAll('.card');
  const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(card => cardObserver.observe(card));

  // ===== LIGHTBOX DA GALERIA =====
  const gridItems = document.querySelectorAll('.gallery-card .grid-item');
  if (gridItems.length) {
    // Criar lightbox
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');
    const lbImg = document.createElement('img');
    lightbox.appendChild(lbImg);
    document.body.appendChild(lightbox);

    // Função para extrair URL do background-image
    const extractUrl = str => {
      const match = str.match(/url\(\"?(.*?)\"?\)/);
      return match ? match[1] : '';
    };

    // Adicionar evento de clique a cada item da galeria
    gridItems.forEach(item => {
      item.addEventListener('click', () => {
        const bg = getComputedStyle(item).backgroundImage;
        lbImg.src = extractUrl(bg);
        lbImg.alt = item.querySelector('.grid-item-title')?.textContent || 'Artwork';
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden';
      });
    });

    // Fechar lightbox ao clicar
    lightbox.addEventListener('click', () => {
      closeLightbox();
    });

    // Fechar lightbox com tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('show')) {
        closeLightbox();
      }
    });

    // Função auxiliar para fechar lightbox
    function closeLightbox() {
      lightbox.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  // ===== RELÓGIO NO FOOTER =====
  const clockEl = document.getElementById('clock');
  if (clockEl) {
    const updateClock = () => {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString('pt-PT', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

  // ===== CITAÇÕES ROTATIVAS NO FOOTER =====
  const footerQuoteEl = document.getElementById('footer-quote');
  if (footerQuoteEl) {
    const quotes = [
      'Semeia os teus sonhos, eles florescerão.',
      'Cada traço carrega uma história.',
      'A criatividade é o vento que nos move.',
      'O teu olhar transforma o mundo em arte.',
      'Entre pixels e pincéis, a alma encontra sua voz.',
      'Design é a ponte entre o invisível e o tangível.'
    ];
    
    let idx = Math.floor(Math.random() * quotes.length);
    
    const updateQuote = () => {
      footerQuoteEl.textContent = quotes[idx];
      idx = (idx + 1) % quotes.length;
    };
    
    updateQuote();
    setInterval(updateQuote, 15000);
  }

  // ===== MODAL "SOBRE MIM" =====
  const readMoreBtn = document.querySelector('.read-more-about');
  const aboutModal = document.getElementById('about-modal');
  
  if (readMoreBtn && aboutModal) {
    // Abrir modal
    readMoreBtn.addEventListener('click', () => {
      aboutModal.classList.add('show');
      document.body.style.overflow = 'hidden';
    });

    // Fechar modal
    const closeBtn = aboutModal.querySelector('.modal-close');
    
    // Fechar ao clicar no X ou fora do modal
    aboutModal.addEventListener('click', (e) => {
      if (e.target === aboutModal || e.target === closeBtn) {
        closeAboutModal();
      }
    });

    // Fechar modal com tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && aboutModal.classList.contains('show')) {
        closeAboutModal();
      }
    });

    // Função auxiliar para fechar modal
    function closeAboutModal() {
      aboutModal.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  // ===== SMOOTH SCROLL PARA LINKS INTERNOS =====
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

  // ===== FORMULÁRIO DE CONTACTO =====
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('📝 Formulário submetido');
      
      // Validação básica
      const name = this.name.value.trim();
      const email = this.email.value.trim();
      const message = this.message.value.trim();
      const title = this.title?.value?.trim() || 'Sem assunto';
      
      console.log('📋 Dados do formulário:', { name, email, title, message: message.substring(0, 50) + '...' });
      
      if (!name || !email || !message) {
        showFormMessage('Por favor, preenche todos os campos obrigatórios.', 'error');
        return;
      }
      
      if (!isValidEmail(email)) {
        showFormMessage('Por favor, insere um email válido.', 'error');
        return;
      }
      
      // Preparar dados do formulário - NOMES PADRÃO DO EMAILJS
      const formData = {
        name: name,           
        email: email,          
        subject: title,       
        message: message      
      };
      
      console.log('📤 Enviando dados:', formData);
      
      const button = this.querySelector('button[type="submit"]');
      const originalText = button.innerHTML;
      
      // Estado de carregamento
      button.innerHTML = '<span>Enviando...</span>';
      button.disabled = true;
      
      // Enviar email via EmailJS
      emailjs.send("service_vmxzcn4", "template_7vvoj54", formData)
        .then((response) => {
          console.log('✅ Email enviado com sucesso:', response);
          
          // Sucesso
          button.innerHTML = '<span>Mensagem enviada! ✨</span>';
          button.style.background = 'var(--moss, #4a5d3a)';
          this.reset();
          
          showFormMessage('Mensagem enviada com sucesso! Entrarei em contacto em breve.', 'success');
          
          // Restaurar botão após 3 segundos
          setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
            button.disabled = false;
          }, 3000);
        })
        .catch(error => {
          console.error('❌ Erro detalhado:', error);
          console.error('❌ Status:', error.status);
          console.error('❌ Text:', error.text);
          
          // Erro
          button.innerHTML = originalText;
          button.disabled = false;
          
          // Mensagem de erro mais específica
          let errorMessage = 'Erro ao enviar mensagem. ';
          
          if (error.status === 400) {
            errorMessage += 'Dados do formulário inválidos.';
          } else if (error.status === 401) {
            errorMessage += 'Problema de autenticação.';
          } else if (error.status === 404) {
            errorMessage += 'Template ou Service não encontrado.';
          } else if (error.text) {
            errorMessage += error.text;
          } else {
            errorMessage += 'Por favor, tenta novamente.';
          }
          
          showFormMessage(errorMessage, 'error');
        });
    });
  }

  // ===== ANIMAÇÕES DE ENTRADA ADICIONAIS =====
  const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  // Animar elementos específicos
  document.querySelectorAll('.project-slide, .blog-post, .grid-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    animateOnScroll.observe(el);
  });

  // Log de inicialização
  console.log('🌱 Unna Portfolio carregado com sucesso!');
});

// ===== FUNÇÕES AUXILIARES =====

// Validação de email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Mostrar mensagens do formulário
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
  
  // Adicionar após o formulário
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.insertAdjacentElement('afterend', messageEl);
    
    // Remover mensagem após 8 segundos (mais tempo para ler o erro)
    setTimeout(() => {
      if (messageEl && messageEl.parentNode) {
        messageEl.remove();
      }
    }, 8000);
  }
}