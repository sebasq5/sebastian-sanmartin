// ========================
// SYSTEM FOR MULTI-LANGUAGE
// ========================

let currentLanguage = 'es'; // Idioma por defecto
let translations = {};

// Detectar geolocalización y establecer idioma automáticamente
function detectLanguageByGeolocation() {
    // Países de Latinoamérica que hablan español
    const latinAmericaCountries = [
        'AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'SV', 'GT', 'HN', 
        'MX', 'NI', 'PA', 'PY', 'PE', 'PR', 'UY', 'VE', 'BZ'
    ];

    // Usar API para detectar geolocalización
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            const countryCode = data.country_code;
            
            // Si está en Latinoamérica, usar español; sino, inglés
            if (latinAmericaCountries.includes(countryCode)) {
                setLanguage('es');
            } else {
                setLanguage('en');
            }
            
            console.log(`🌍 Idioma detectado según país (${countryCode}): ${currentLanguage === 'es' ? 'Español' : 'English'}`);
        })
        .catch(error => {
            console.log('⚠️ No se pudo detectar geolocalización. Usando español por defecto.');
            setLanguage('es');
        });
}

// Cargar traducciones desde JSON
function loadTranslations() {
    fetch('translations.json')
        .then(response => response.json())
        .then(data => {
            translations = data;
            console.log('✓ Traducciones cargadas correctamente');
            
            // Verificar si hay idioma guardado
            const savedLanguage = localStorage.getItem('language');
            if (savedLanguage && translations[savedLanguage]) {
                setLanguage(savedLanguage);
            } else {
                detectLanguageByGeolocation();
            }
        })
        .catch(error => {
            console.error('Error cargando traducciones:', error);
            setLanguage('es');
        });
}

// Establecer idioma y actualizar contenido
function setLanguage(lang) {
    if (!translations[lang]) {
        console.warn(`Idioma ${lang} no disponible`);
        return;
    }
    
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Actualizar botones activos
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    
    // Actualizar todo el contenido
    updatePageContent();
    
    console.log(`✓ Idioma cambiado a: ${lang === 'es' ? 'Español' : 'English'}`);
}

// Actualizar contenido de la página
function updatePageContent() {
    const t = translations[currentLanguage];
    if (!t) return;

    // Traducir elementos con data-es y data-en
    document.querySelectorAll('[data-es][data-en]').forEach(element => {
        const text = currentLanguage === 'es' ? element.getAttribute('data-es') : element.getAttribute('data-en');

        // Para enlaces de navegación, actualizamos directamente su texto
        if (element.classList.contains('nav-link')) {
            element.textContent = text;
            return;
        }

        // Si el elemento contiene un span con clase 'translate', actualizar ese span
        const translateSpan = element.querySelector('.translate');
        if (translateSpan) {
            translateSpan.textContent = text;
        } else {
            element.textContent = text;
        }
    });

    // Traducir elementos con clase 'translate'
    document.querySelectorAll('.translate').forEach(element => {
        const key = getTranslationKey(element);
        if (key && t[key]) {
            element.textContent = t[key];
        }
    });

    // Cambiar idioma del HTML
    document.documentElement.lang = currentLanguage;
}

// Obtener la clave de traducción basada en el atributo
function getTranslationKey(element) {
    const keys = Object.keys(translations[currentLanguage] || {});
    const text = element.textContent.trim();
    
    for (let key of keys) {
        if (translations[currentLanguage][key] === text) {
            return key;
        }
    }
    return null;
}

// ========================
// FUNCIONALIDADES JAVASCRIPT MEJORADAS
// ========================

document.addEventListener('DOMContentLoaded', function() {
    // Cargar traducciones e inicializar idioma
    loadTranslations();
    
    // Inicializar listeners de botones de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            setLanguage(this.getAttribute('data-lang'));
        });
    });

    initializeScrollAnimations();
    initializeSmoothScroll();
    initializeNavbarActive();
    initializeButtonEffects();
    initializeParallaxEffect();
    initializeCountUpAnimation();
    initializeStatistics();
    initializeCardAnimations();
    console.log('✓ Todas las funcionalidades se han inicializado correctamente');
});

// ========================
// ANIMACIONES AL SCROLL (Intersection Observer)
// ========================

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elements
    document.querySelectorAll('.card, .belief-card, section h2, .section-header').forEach(el => {
        observer.observe(el);
    });
}

// ========================
// SCROLL SUAVE MEJORADO
// ========================

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offset = 100;
                const targetPosition = target.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Cerrar navbar en móvil
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                        toggle: true
                    });
                }
            }
        });
    });
}

// ========================
// NAVBAR ACTIVO DINÁMICO
// ========================

function initializeNavbarActive() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Highlight al hacer hover
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.color = 'white';
        });
    });
}

// ========================
// EFECTOS DE BOTONES MEJORADOS
// ========================

function initializeButtonEffects() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        // Efecto ripple mejorado
        button.addEventListener('mousedown', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.position = 'absolute';
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'scale(0)';
            ripple.style.pointerEvents = 'none';
            ripple.style.animation = 'ripple 0.6s ease-out';

            // Agregar animación al head si no existe
            if (!document.querySelector('style[data-ripple]')) {
                const style = document.createElement('style');
                style.setAttribute('data-ripple', 'true');
                style.innerHTML = `
                    @keyframes ripple {
                        to {
                            transform: scale(4);
                            opacity: 0;
                        }
                    }
                    .btn { position: relative; overflow: hidden; }
                `;
                document.head.appendChild(style);
            }

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ========================
// EFECTO PARALLAX
// ========================

function initializeParallaxEffect() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;

    window.addEventListener('scroll', () => {
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-parallax') || 0.5;
            const yPos = window.scrollY * speed;
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ========================
// ANIMACIÓN COUNT UP (Números)
// ========================

function initializeCountUpAnimation() {
    // Detectar elementos con data-count
    const countElements = document.querySelectorAll('[data-count]');
    
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.getAttribute('data-count'));
                const duration = parseInt(element.getAttribute('data-duration')) || 2000;
                
                animateCount(element, 0, target, duration);
                countObserver.unobserve(element);
            }
        });
    }, { threshold: 0.5 });

    countElements.forEach(el => countObserver.observe(el));
}

function animateCount(element, start, end, duration) {
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        element.textContent = current.toLocaleString();
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
}

// ========================
// ANIMACIÓN DE ESTADÍSTICAS
// ========================

function initializeStatistics() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.textContent;
                const number = parseInt(text.match(/\d+/)[0]);
                
                animateStatistic(element, 0, number, 1500);
                statsObserver.unobserve(element);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));
}

function animateStatistic(element, start, end, duration) {
    const range = end - start;
    const increment = Math.ceil(range / (duration / 50));
    let current = start;
    const originalText = element.textContent;
    const prefix = originalText.match(/^[^\d]*/)[0]; // obtener prefijo (ej: +)

    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            element.textContent = prefix + current;
            clearInterval(timer);
        } else {
            element.textContent = prefix + current;
        }
    }, 50);
}

// ========================
// ANIMACIONES DE CARDS MEJORADAS
// ========================

function initializeCardAnimations() {
    const beliefCards = document.querySelectorAll('.belief-card');
    const contactCards = document.querySelectorAll('.contact-card');
    
    [...beliefCards, ...contactCards].forEach((card, index) => {
        card.style.animation = `slideInUp 0.6s ease ${index * 0.1}s backwards`;
    });

    // Agregar interactividad adicional
    contactCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.animation = 'none';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.animation = '';
        });
    });
}

// ========================
// EFECTOS DE MOUSE
// ========================

function initializeMouseEffects() {
    const cards = document.querySelectorAll('.card-hover');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calcular ángulo de perspectiva
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// ========================
// SCROLL REVEAL
// ========================

function initializeScrollReveal() {
    const revealElements = document.querySelectorAll('.card, .belief-card, .section-header');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            } else {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });
}

// ========================
// NAVBAR SCROLL EFFECT
// ========================

function initializeNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        }
    });
}

// ========================
// LAZY LOADING
// ========================

function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ========================
// CLIPBOARD COPY
// ========================

function copyToClipboard(text, showNotification = true) {
    navigator.clipboard.writeText(text).then(() => {
        if (showNotification) {
            showToast('¡Copiado al portapapeles!', 'success');
        }
    }).catch(() => {
        if (showNotification) {
            showToast('Error al copiar', 'error');
        }
    });
}

// ========================
// TOAST NOTIFICATIONS
// ========================

function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    toast.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    toast.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ========================
// EFECTOS DE TECLADO
// ========================

function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K para buscar (ejemplo)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            console.log('Búsqueda activada');
        }
    });
}

// ========================
// PERFORMANCE MONITORING
// ========================

function initializePerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
        try {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.log(`${entry.name}: ${entry.duration}ms`);
                }
            });

            observer.observe({ entryTypes: ['measure', 'navigation'] });
        } catch (e) {
            console.log('Performance monitoring no disponible');
        }
    }
}

// ========================
// INICIALIZACIÓN PRINCIPAL
// ========================

// Inicializar efectos adicionales
document.addEventListener('DOMContentLoaded', function() {
    initializeMouseEffects();
    initializeScrollReveal();
    initializeNavbarScrollEffect();
    initializeLazyLoading();
    initializeKeyboardShortcuts();
    
    // Analytics (comentado, descomentar si se usa)
    // initializePerformanceMonitoring();
});

// Agregar estilos necesarios para animaciones
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }

    .card-hover {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    img.loaded {
        animation: fadeIn 0.6s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(styleSheet);
