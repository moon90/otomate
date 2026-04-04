/* ============================================
   AUTOMATION AGENCY - MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initCounterAnimation();
    initContactForm();
    initNewsletterForm();
    initActiveNavLink();
});

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class for glassmorphism effect
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const navLinksItems = navLinks.querySelectorAll('.nav-link');
    
    // Toggle menu
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   ACTIVE NAV LINK
   ============================================ */
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Initial call
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-target]');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element, target) {
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

/* ============================================
   CONTACT FORM
   ============================================ */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const submitBtn = form.querySelector('.btn-submit');
    const successMessage = document.getElementById('form-success');
    
    // Form fields
    const fields = {
        name: {
            element: document.getElementById('name'),
            errorElement: document.getElementById('name-error'),
            validate: (value) => {
                if (!value.trim()) return 'Name is required';
                if (value.trim().length < 2) return 'Name must be at least 2 characters';
                return '';
            }
        },
        email: {
            element: document.getElementById('email'),
            errorElement: document.getElementById('email-error'),
            validate: (value) => {
                if (!value.trim()) return 'Email is required';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'Please enter a valid email address';
                return '';
            }
        },
        subject: {
            element: document.getElementById('subject'),
            errorElement: document.getElementById('subject-error'),
            validate: (value) => {
                if (!value.trim()) return 'Subject is required';
                if (value.trim().length < 3) return 'Subject must be at least 3 characters';
                return '';
            }
        },
        message: {
            element: document.getElementById('message'),
            errorElement: document.getElementById('message-error'),
            validate: (value) => {
                if (!value.trim()) return 'Message is required';
                if (value.trim().length < 10) return 'Message must be at least 10 characters';
                return '';
            }
        }
    };
    
    // Real-time validation
    Object.keys(fields).forEach(key => {
        const field = fields[key];
        
        field.element.addEventListener('blur', () => {
            validateField(field);
        });
        
        field.element.addEventListener('input', () => {
            if (field.element.classList.contains('error')) {
                validateField(field);
            }
        });
    });
    
    function validateField(field) {
        const error = field.validate(field.element.value);
        
        if (error) {
            field.element.classList.add('error');
            field.errorElement.textContent = error;
            return false;
        } else {
            field.element.classList.remove('error');
            field.errorElement.textContent = '';
            return true;
        }
    }
    
    function validateForm() {
        let isValid = true;
        
        Object.keys(fields).forEach(key => {
            if (!validateField(fields[key])) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            // Scroll to first error
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        try {
            await simulateFormSubmission();
            
            // Show success message
            form.style.display = 'none';
            successMessage.classList.add('show');
            
            // Reset form after delay
            setTimeout(() => {
                form.reset();
                form.style.display = 'block';
                successMessage.classList.remove('show');
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }, 5000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            // Show error message (you can add an error message element)
            alert('There was an error submitting the form. Please try again.');
        }
    });
    
    function simulateFormSubmission() {
        return new Promise((resolve) => {
            setTimeout(resolve, 1500);
        });
    }
}

/* ============================================
   NEWSLETTER FORM
   ============================================ */
function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;
    
    const input = form.querySelector('input');
    const button = form.querySelector('button');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email || !emailRegex.test(email)) {
            input.style.borderColor = 'var(--accent-pink)';
            input.focus();
            return;
        }
        
        input.style.borderColor = 'var(--accent-purple)';
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        button.disabled = true;
        
        // Simulate subscription
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Show success
        button.innerHTML = '<i class="fas fa-check"></i>';
        input.value = '';
        
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-arrow-right"></i>';
            button.disabled = false;
            input.style.borderColor = '';
        }, 2000);
    });
    
    input.addEventListener('input', () => {
        input.style.borderColor = '';
    });
}

/* ============================================
   TESTIMONIALS SLIDER (Optional Enhancement)
   ============================================ */
function initTestimonialsSlider() {
    const slider = document.querySelector('.testimonials-slider');
    const dots = document.querySelectorAll('.slider-dots .dot');
    
    if (!slider || !dots.length) return;
    
    let currentSlide = 0;
    const cards = slider.querySelectorAll('.testimonial-card');
    
    // For mobile, implement a simple slide system
    function updateSlider() {
        if (window.innerWidth <= 991) {
            cards.forEach((card, index) => {
                card.style.display = index === currentSlide ? 'block' : 'none';
            });
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        } else {
            cards.forEach(card => {
                card.style.display = '';
            });
        }
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });
    
    // Auto-advance on mobile
    setInterval(() => {
        if (window.innerWidth <= 991) {
            currentSlide = (currentSlide + 1) % cards.length;
            updateSlider();
        }
    }, 5000);
    
    window.addEventListener('resize', updateSlider);
    updateSlider();
}

/* ============================================
   PARALLAX EFFECT (Optional Enhancement)
   ============================================ */
function initParallax() {
    const orbs = document.querySelectorAll('.gradient-orb');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        orbs.forEach((orb, index) => {
            const speed = 0.1 + (index * 0.05);
            orb.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

/* ============================================
   TYPING EFFECT (Optional Enhancement)
   ============================================ */
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const text = heroTitle.innerHTML;
    heroTitle.innerHTML = '';
    
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            heroTitle.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Start typing when hero is visible
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            typeWriter();
            observer.disconnect();
        }
    });
    
    observer.observe(heroTitle);
}

/* ============================================
   SCROLL TO TOP (Optional Enhancement)
   ============================================ */
function initScrollToTop() {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.className = 'scroll-to-top';
    button.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(button);
    
    // Add styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--gradient-primary);
            border: none;
            border-radius: 50%;
            color: white;
            font-size: 1.25rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
        }
        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        .scroll-to-top:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 30px rgba(102, 126, 234, 0.6);
        }
    `;
    document.head.appendChild(style);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize optional enhancements
document.addEventListener('DOMContentLoaded', function() {
    initTestimonialsSlider();
    initScrollToTop();
});
