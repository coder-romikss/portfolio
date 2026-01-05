// ============================================
// LANGUAGE SWITCHER
// ============================================
let currentLanguage = 'en';

function switchLanguage(lang) {
    currentLanguage = lang;
    
    // Update active button
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
    document.getElementById('lang-ua').classList.toggle('active', lang === 'ua');
    
    // Update all elements with data attributes
    document.querySelectorAll('[data-en][data-ua]').forEach(element => {
        const text = lang === 'en' ? element.getAttribute('data-en') : element.getAttribute('data-ua');
        
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            if (element.type === 'submit' || element.type === 'button') {
                element.value = text;
            } else {
                element.placeholder = text;
            }
        } else {
            element.textContent = text;
        }
    });
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
}

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// ACTIVE NAV LINK
// ============================================
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ============================================
// SKILL BARS ANIMATION
// ============================================
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const skillCategories = document.querySelectorAll('.skill-category');
skillCategories.forEach(category => skillObserver.observe(category));

// ============================================
// SCROLL ANIMATIONS
// ============================================
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Elements to animate
const animateElements = document.querySelectorAll(
    '.about-content, .skill-category, .project-card, .contact-item, .contact-form-wrapper'
);

animateElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    scrollObserver.observe(el);
});

// ============================================
// FORM HANDLING
// ============================================
const contactForm = document.getElementById('contactForm');

// Initialize EmailJS (замініть 'YOUR_PUBLIC_KEY' на ваш ключ після реєстрації на emailjs.com)
// emailjs.init('YOUR_PUBLIC_KEY');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        const name = contactForm.querySelector('#name').value.trim();
        const email = contactForm.querySelector('#email').value.trim();
        const subject = contactForm.querySelector('#subject').value.trim();
        const message = contactForm.querySelector('#message').value.trim();
        
        if (!name || !email || !subject || !message) {
            showNotification(
                currentLanguage === 'en' 
                    ? 'Please fill in all required fields.' 
                    : 'Будь ласка, заповніть усі обов\'язкові поля.',
                'error'
            );
            return;
        }
        
        // Disable button and show loading
        submitButton.disabled = true;
        submitButton.textContent = currentLanguage === 'en' ? 'Sending...' : 'Відправка...';
        
        try {
            // Send email using EmailJS
            // Замініть 'YOUR_SERVICE_ID' та 'YOUR_TEMPLATE_ID' на ваші ID після налаштування EmailJS
            const response = await emailjs.send(
                'YOUR_SERVICE_ID',
                'YOUR_TEMPLATE_ID',
                {
                    from_name: name,
                    from_email: email,
                    subject: subject,
                    message: message,
                    to_email: 'rgorb101@gmail.com'
                }
            );
            
            if (response.status === 200) {
                showNotification(
                    currentLanguage === 'en' 
                        ? 'Thank you! I will get back to you soon.' 
                        : 'Дякуємо! Я зв\'яжуся з вами найближчим часом.',
                    'success'
                );
                contactForm.reset();
            }
        } catch (error) {
            console.error('EmailJS error:', error);
            // Fallback: відкрити mailto якщо EmailJS не налаштовано
            const mailtoLink = `mailto:rgorb101@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
            window.location.href = mailtoLink;
            showNotification(
                currentLanguage === 'en' 
                    ? 'Opening your email client...' 
                    : 'Відкриття поштового клієнта...',
                'info'
            );
            contactForm.reset();
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// Notification function
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.form-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `form-notification form-notification-${type}`;
    notification.textContent = message;
    
    const formWrapper = document.querySelector('.contact-form-wrapper');
    if (formWrapper) {
        formWrapper.insertBefore(notification, formWrapper.firstChild);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// ============================================
// TYPING EFFECT (Optional enhancement)
// ============================================
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio website loaded!');
    
    // Initialize EmailJS (only if EmailJS is loaded)
    // Для налаштування EmailJS див. EMAILJS_SETUP.md
    // Розкоментуйте та замініть 'YOUR_PUBLIC_KEY' на ваш публічний ключ з emailjs.com
    /*
    if (typeof emailjs !== 'undefined') {
        emailjs.init('YOUR_PUBLIC_KEY');
        emailjs.service_id = 'YOUR_SERVICE_ID';
        emailjs.template_id = 'YOUR_TEMPLATE_ID';
    }
    */
    
    // Initialize language
    const savedLanguage = localStorage.getItem('language') || 'en';
    if (savedLanguage !== currentLanguage) {
        switchLanguage(savedLanguage);
    }
    
    // Save language preference
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.id.replace('lang-', '');
            localStorage.setItem('language', lang);
        });
    });
    
    // Initialize active nav link
    updateActiveNavLink();
});

