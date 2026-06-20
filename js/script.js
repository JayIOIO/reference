// ========================================
// DOM Elements
// ========================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const menuOverlay = document.getElementById('menuOverlay');
const navLinks = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('backToTop');

// Motorcycle Carousel
const motorcycleTrack = document.getElementById('motorcycleTrack');
const motorcycleCards = document.querySelectorAll('.motorcycle-card');
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');
const carouselDots = document.getElementById('carouselDots');

// Testimonials Slider
const testimonialsTrack = document.getElementById('testimonialsTrack');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const sliderDots = document.getElementById('sliderDots');

// Stats
const statNumbers = document.querySelectorAll('.stat-number');

// ========================================
// State
// ========================================
let currentSlide = 0;
let testimonialIndex = 0;
let isMobile = window.innerWidth <= 768;
let autoPlayInterval;

// ========================================
// Navigation Functions
// ========================================
function handleScroll() {
    // Sticky navigation background
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    // Active navigation highlighting
    updateActiveNavLink();

    // Reveal animations on scroll
    revealOnScroll();
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 200;

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

function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ========================================
// Carousel Functions
// ========================================
function initCarousel() {
    if (!isMobile || motorcycleCards.length <= 4) {
        return;
    }

    // Create dots
    const totalSlides = Math.ceil(motorcycleCards.length / 1);
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        carouselDots.appendChild(dot);
    }

    updateCarousel();
    initTouchSwipe(motorcycleTrack, motorcycleCards, 'motorcycle');
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
    resetAutoPlay();
}

function nextSlide() {
    const maxSlide = Math.ceil(motorcycleCards.length / 1) - 1;
    currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
    updateCarousel();
}

function prevSlide() {
    const maxSlide = Math.ceil(motorcycleCards.length / 1) - 1;
    currentSlide = currentSlide <= 0 ? maxSlide : currentSlide - 1;
    updateCarousel();
}

function updateCarousel() {
    if (!isMobile) return;

    const cardWidth = motorcycleCards[0].offsetWidth + 32; // Including gap
    const offset = -currentSlide * cardWidth;
    motorcycleTrack.style.transform = `translateX(${offset}px)`;

    // Update dots
    const dots = carouselDots.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        if (isMobile) {
            nextSlide();
        }
    }, 5000);
}

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
}

// ========================================
// Touch Swipe Support
// ========================================
function initTouchSwipe(track, cards, type) {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        track.style.transition = 'none';
    });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
    });

    track.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        track.style.transition = 'transform 0.5s ease';

        const diff = startX - currentX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swiped left
                if (type === 'motorcycle') {
                    nextSlide();
                } else {
                    nextTestimonial();
                }
            } else {
                // Swiped right
                if (type === 'motorcycle') {
                    prevSlide();
                } else {
                    prevTestimonial();
                }
            }
        }
    });
}

// ========================================
// Testimonials Slider Functions
// ========================================
function initTestimonialsSlider() {
    if (!isMobile) return;

    // Create dots
    for (let i = 0; i < testimonialCards.length; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToTestimonial(i));
        sliderDots.appendChild(dot);
    }

    updateTestimonials();
    initTouchSwipe(testimonialsTrack, testimonialCards, 'testimonial');
}

function goToTestimonial(index) {
    testimonialIndex = index;
    updateTestimonials();
}

function nextTestimonial() {
    testimonialIndex = testimonialIndex >= testimonialCards.length - 1 ? 0 : testimonialIndex + 1;
    updateTestimonials();
}

function prevTestimonial() {
    testimonialIndex = testimonialIndex <= 0 ? testimonialCards.length - 1 : testimonialIndex - 1;
    updateTestimonials();
}

function updateTestimonials() {
    if (!isMobile) return;

    const cardWidth = testimonialCards[0].offsetWidth + 32;
    const offset = -testimonialIndex * cardWidth;
    testimonialsTrack.style.transform = `translateX(${offset}px)`;

    // Update dots
    const dots = sliderDots.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === testimonialIndex);
    });
}

// ========================================
// Reveal Animation on Scroll
// ========================================
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');

    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 150;

        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('active');
        }
    });
}

// ========================================
// Counter Animation
// ========================================
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
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

function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            e.preventDefault();
            closeMobileMenu();

            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// Back to Top Functionality
// ========================================
function initBackToTop() {
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// Image Lazy Loading Enhancement
// ========================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ========================================
// Handle Window Resize
// ========================================
function handleResize() {
    isMobile = window.innerWidth <= 768;

    // Reset transforms
    motorcycleTrack.style.transform = '';
    testimonialsTrack.style.transform = '';

    // Clear existing dots
    carouselDots.innerHTML = '';
    sliderDots.innerHTML = '';

    // Reinitialize based on screen size
    if (isMobile) {
        initCarousel();
        initTestimonialsSlider();
    }
}

// ========================================
// Initialize Everything
// ========================================
function init() {
    // Event Listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    hamburger.addEventListener('click', toggleMobileMenu);
    menuOverlay.addEventListener('click', closeMobileMenu);

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Carousel navigation
    carouselPrev.addEventListener('click', prevSlide);
    carouselNext.addEventListener('click', nextSlide);

    // Initialize features
    initSmoothScroll();
    initBackToTop();
    initCounters();
    initLazyLoading();

    // Initial check for mobile
    if (isMobile) {
        initCarousel();
        initTestimonialsSlider();
        startAutoPlay();
    }

    // Initial reveal check
    handleScroll();
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
