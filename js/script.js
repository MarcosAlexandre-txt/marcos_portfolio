// ========================================
// MENU MOBILE TOGGLE
// ========================================

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('active');
    });
});

// ========================================
// ANIMAÇÃO AO SCROLL
// ========================================

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { 
    threshold: 0.1 
});

// Aplicar animação a todas as seções
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.8s ease';
    observer.observe(section);
});

// ========================================
// HIGHLIGHT MENU ATIVO NO SCROLL
// ========================================

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.color = 'var(--text)';
        
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = 'var(--primary)';
        }
    });
});

// ========================================
// SMOOTH SCROLL PARA NAVEGAÇÃO
// ========================================

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

// ========================================
// ANIMAÇÃO DE ENTRADA DOS CARDS
// ========================================

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { 
    threshold: 0.1 
});

// Animar cards de currículo
document.querySelectorAll('.curriculo-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease';
    cardObserver.observe(card);
});

// Animar cards de certificados
document.querySelectorAll('.certificado-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.9)';
    card.style.transition = 'all 0.6s ease';
    cardObserver.observe(card);
});

// Animar cards de contato
document.querySelectorAll('.contato-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateX(-20px)';
    card.style.transition = 'all 0.6s ease';
    cardObserver.observe(card);
});

// ========================================
// EFEITO DE PARALLAX NO BACKGROUND
// ========================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Efeito sutil de parallax no scroll
    document.querySelector('.bg-animation').style.transform = 
        `translateY(${scrolled * 0.3}px)`;
});

// ========================================
// CARREGAR ANIMAÇÕES INICIAIS
// ========================================

window.addEventListener('load', () => {
    // Adicionar classe loaded ao body para animações iniciais
    document.body.classList.add('loaded');
    
    // Animar elementos do hero
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.8s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 150);
    });
});

// ========================================
// CURSOR CUSTOM (OPCIONAL)
// ========================================

// Criar efeito de cursor personalizado em elementos interativos
document.querySelectorAll('a, button, .curriculo-card, .certificado-card, .contato-card').forEach(element => {
    element.addEventListener('mouseenter', () => {
        element.style.cursor = 'pointer';
    });
});

// ========================================
// CONTADOR DE SCROLL PARA HEADER
// ========================================

let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.style.boxShadow = 'none';
    } else {
        header.style.boxShadow = '0 2px 20px rgba(0, 255, 136, 0.1)';
    }
    
    // Esconder header ao scrollar para baixo, mostrar ao scrollar para cima
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Adicionar transição ao header
header.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';

// ========================================
// COPIAR E-MAIL PARA ÁREA DE TRANSFERÊNCIA
// ========================================

// Aguardar carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {
    const emailButton = document.getElementById('copy-email');
    const emailFeedback = document.getElementById('copy-feedback');
    const emailAddress = 'marcos.alexandre.scrt@gmail.com';

    if (emailButton) {
        emailButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Impede propagação do evento
            
            // Usar clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(emailAddress)
                    .then(() => {
                        emailFeedback.style.display = 'block';
                        emailButton.textContent = 'Copiado!';
                        setTimeout(() => {
                            emailFeedback.style.display = 'none';
                            emailButton.textContent = 'Copiar Endereço';
                        }, 2000);
                    })
                    .catch((err) => {
                        console.error('Erro ao copiar:', err);
                        // Fallback: criar input temporário
                        copyFallback(emailAddress);
                    });
            } else {
                // Fallback para navegadores mais antigos
                copyFallback(emailAddress);
            }
        });
    }

    // Função fallback para copiar
    function copyFallback(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            emailFeedback.style.display = 'block';
            emailButton.textContent = 'Copiado!';
            setTimeout(() => {
                emailFeedback.style.display = 'none';
                emailButton.textContent = 'Copiar Endereço';
            }, 2000);
        } catch (err) {
            alert('Não foi possível copiar. E-mail: ' + emailAddress);
        }
        
        document.body.removeChild(textarea);
    }
});