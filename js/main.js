/* =============================================
   À VOTRE STYLE V2 - JAVASCRIPT
   Interactivité moderne et responsive
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    // ===== MENU MOBILE =====
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const header = document.getElementById('header');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        });
        
        // Fermer le menu au clic sur un lien
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                // Ne pas fermer si c'est le lien "Services" avec dropdown
                if (!link.parentElement.classList.contains('nav-services')) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        });
        
        // Gestion du dropdown services sur mobile
        const navServices = document.querySelector('.nav-services');
        if (navServices) {
            const servicesLink = navServices.querySelector('.nav-link');
            servicesLink.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    navServices.classList.toggle('active');
                }
            });
        }
    }
    
    // ===== HEADER SCROLL OPTIMISÉ (debounced) =====
    let lastScroll = 0;
    let ticking = false;
    
    const updateHeader = () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
        ticking = false;
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });
    
    // ===== SMOOTH SCROLL POUR ANCRES =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ===== ANIMATIONS AU SCROLL =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observer les cartes et éléments
    document.querySelectorAll('.card, .feature, .testimonial, .stat').forEach(el => {
        observer.observe(el);
    });
    
    // ===== FORMULAIRE DE CONTACT =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Animation de chargement
            submitBtn.disabled = true;
            submitBtn.innerHTML = '⏳ Envoi en cours...';
            
            try {
                // Récupérer les données du formulaire
                const formData = new FormData(contactForm);
                
                // Envoyer au Google Sheet
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData
                });
                
                // Succès
                submitBtn.innerHTML = '✅ Message envoyé !';
                submitBtn.style.background = 'var(--success)';
                
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
                
            } catch (error) {
                // Erreur
                submitBtn.innerHTML = '❌ Erreur d\'envoi';
                submitBtn.style.background = '#ef4444';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
            }
        });
        
        // Validation en temps réel
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    input.style.borderColor = '#ef4444';
                } else {
                    input.style.borderColor = '';
                }
            });
            
            input.addEventListener('input', () => {
                if (input.style.borderColor === 'rgb(239, 68, 68)') {
                    input.style.borderColor = '';
                }
            });
        });
    }
    
    // ===== GALERIE / LIGHTBOX =====
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentFilter = 'all'; // Track le filtre actuel
    
    if (galleryItems.length > 0) {
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                openLightbox(index);
            });
        });
    }
    
    function openLightbox(index) {
        // Récupérer uniquement les items visibles selon le filtre actuel
        const visibleItems = Array.from(galleryItems).filter(item => {
            return currentFilter === 'all' || item.dataset.category === currentFilter;
        });
        
        // Trouver l'index dans les items visibles
        const currentItem = galleryItems[index];
        let visibleIndex = visibleItems.indexOf(currentItem);
        
        // Créer la lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Fermer">&times;</button>
                <button class="lightbox-prev" aria-label="Précédent">‹</button>
                <button class="lightbox-next" aria-label="Suivant">›</button>
                <img src="${currentItem.querySelector('img').src}" alt="">
            </div>
        `;
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // Styles de la lightbox
        const style = document.createElement('style');
        style.textContent = `
            .lightbox {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.95);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s;
            }
            .lightbox-content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
            }
            .lightbox img {
                max-width: 100%;
                max-height: 90vh;
                object-fit: contain;
            }
            .lightbox-close, .lightbox-prev, .lightbox-next {
                position: absolute;
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                padding: 1rem;
                border-radius: 50%;
                transition: all 0.3s;
            }
            .lightbox-close:hover, .lightbox-prev:hover, .lightbox-next:hover {
                background: rgba(255,255,255,0.3);
            }
            .lightbox-close {
                top: 20px;
                right: 20px;
            }
            .lightbox-prev {
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
            }
            .lightbox-prev:hover {
                transform: translateY(-50%) scale(1.1);
            }
            .lightbox-next {
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
            }
            .lightbox-next:hover {
                transform: translateY(-50%) scale(1.1);
            }
        `;
        document.head.appendChild(style);
        
        // Fermeture
        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        
        function closeLightbox() {
            lightbox.remove();
            style.remove();
            document.body.style.overflow = '';
        }
        
        // Navigation
        let currentVisibleIndex = visibleIndex;
        
        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
            currentVisibleIndex = (currentVisibleIndex - 1 + visibleItems.length) % visibleItems.length;
            lightbox.querySelector('img').src = visibleItems[currentVisibleIndex].querySelector('img').src;
        });
        
        lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
            currentVisibleIndex = (currentVisibleIndex + 1) % visibleItems.length;
            lightbox.querySelector('img').src = visibleItems[currentVisibleIndex].querySelector('img').src;
        });
        
        // Clavier
        document.addEventListener('keydown', function handleKey(e) {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', handleKey);
            } else if (e.key === 'ArrowLeft') {
                lightbox.querySelector('.lightbox-prev').click();
            } else if (e.key === 'ArrowRight') {
                lightbox.querySelector('.lightbox-next').click();
            }
        });
    }
    
    // ===== FILTRES GALERIE =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryGrid = document.querySelector('.gallery-grid');
    
    // Fonction pour mélanger un tableau (Fisher-Yates shuffle)
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    // Mélanger au chargement initial avec CSS order
    if (galleryItems.length > 0 && galleryGrid) {
        const shuffledIndexes = shuffleArray([...Array(galleryItems.length).keys()]);
        galleryItems.forEach((item, index) => {
            item.style.order = shuffledIndexes[index];
        });
    }
    
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                currentFilter = filter; // Mettre à jour le filtre actuel
                
                // Mise à jour des boutons actifs
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Masquer tous les éléments d'abord avec animation
                galleryItems.forEach(item => {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                });
                
                setTimeout(() => {
                    // Filtrer et mélanger
                    const visibleItems = [];
                    const hiddenItems = [];
                    
                    galleryItems.forEach(item => {
                        if (filter === 'all' || item.dataset.category === filter) {
                            visibleItems.push(item);
                        } else {
                            hiddenItems.push(item);
                        }
                    });
                    
                    // Mélanger les éléments visibles
                    const shuffledIndexes = shuffleArray([...Array(visibleItems.length).keys()]);
                    
                    // Cacher les éléments non filtrés
                    hiddenItems.forEach(item => {
                        item.style.display = 'none';
                        item.style.visibility = 'hidden';
                        item.style.order = '9999';
                    });
                    
                    // Afficher et réorganiser les éléments filtrés
                    visibleItems.forEach((item, index) => {
                        item.style.display = 'block';
                        item.style.visibility = 'visible';
                        item.style.order = shuffledIndexes[index];
                    });
                    
                    // Animer l'apparition des éléments visibles
                    setTimeout(() => {
                        visibleItems.forEach((item, index) => {
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            }, index * 30);
                        });
                    }, 50);
                }, 300);
            });
        });
    }
    
    // ===== LAZY LOADING IMAGES =====
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // ===== COMPTEUR ANIMÉ (Stats) =====
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = target.textContent;
                    const numericValue = parseInt(finalValue.replace(/\D/g, ''));
                    
                    if (!isNaN(numericValue)) {
                        animateCounter(target, 0, numericValue, 2000, finalValue);
                        statsObserver.unobserve(target);
                    }
                }
            });
        });
        
        stats.forEach(stat => statsObserver.observe(stat));
    }
    
    function animateCounter(element, start, end, duration, originalText) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                element.textContent = originalText;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (originalText.includes('+') ? '+' : '');
            }
        }, 16);
    }
    
    // ===== BOUTON RETOUR EN HAUT OPTIMISÉ =====
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.setAttribute('aria-label', 'Retour en haut');
    document.body.appendChild(scrollTopBtn);
    
    // Styles du bouton
    const scrollTopStyle = document.createElement('style');
    scrollTopStyle.textContent = `
        .scroll-top-btn {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s;
            z-index: 999;
            box-shadow: var(--shadow-lg);
            will-change: opacity, visibility, transform;
        }
        .scroll-top-btn.visible {
            opacity: 1;
            visibility: visible;
        }
        .scroll-top-btn:hover {
            background: var(--primary-dark);
            transform: translateY(-5px);
        }
    `;
    document.head.appendChild(scrollTopStyle);
    
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                if (window.pageYOffset > 500) {
                    scrollTopBtn.classList.add('visible');
                } else {
                    scrollTopBtn.classList.remove('visible');
                }
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ===== PERFORMANCE: Lazy load des iframes (si utilisées) =====
    const lazyIframes = document.querySelectorAll('iframe[data-src]');
    if (lazyIframes.length > 0) {
        const iframeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    iframe.src = iframe.dataset.src;
                    iframeObserver.unobserve(iframe);
                }
            });
        });
        
        lazyIframes.forEach(iframe => iframeObserver.observe(iframe));
    }
});

// ===== UTILITAIRES =====
// Debounce pour optimiser les événements répétés
function debounce(func, wait) {
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

// Détection du type d'appareil
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
if (isMobile) {
    document.body.classList.add('is-mobile');
}

console.log('✨ À Votre Style V2 - Site chargé avec succès !');
