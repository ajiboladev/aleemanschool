/* ========================================
   ALEEMAN SCHOOL - FIXED & OPTIMIZED JAVASCRIPT
======================================== */

// ========================================
// GLOBAL VARIABLES
// ========================================
let scrolling = false;
let lastScrollTop = 0;

// ========================================
// MOBILE MENU TOGGLE - FIXED
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            
            // Update icon
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        // Close menu when clicking a link
        const menuLinks = navMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        });
    }
});

// ========================================
// NAVBAR SCROLL EFFECT - OPTIMIZED
// ========================================
let ticking = false;

function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
    }
});

// ========================================
// SCROLL TO TOP BUTTON - FIXED
// ========================================
const scrollTopBtn = document.getElementById('scrollTop');

if (scrollTopBtn) {
    let scrollTicking = false;
    
    window.addEventListener('scroll', function() {
        if (!scrollTicking) {
            window.requestAnimationFrame(function() {
                if (window.scrollY > 300) {
                    scrollTopBtn.classList.add('show');
                } else {
                    scrollTopBtn.classList.remove('show');
                }
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// ANIMATED COUNTERS - OPTIMIZED
// ========================================
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.ceil(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

// Intersection Observer for counters
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            animateCounter(entry.target);
            entry.target.classList.add('counted');
        }
    });
}, {
    threshold: 0.5,
    rootMargin: '0px'
});

// Observe all stat values
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.stat-value').forEach(counter => {
        counterObserver.observe(counter);
    });
});

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS - FIXED
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just '#' or empty
            if (!href || href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// ========================================
// TAB FUNCTIONALITY - FIXED
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            if (!targetTab) return;
            
            // Remove active class from all
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and target pane
            this.classList.add('active');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
});

// ========================================
// CONTACT FORM HANDLING - FIXED
// ========================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm(this)) {
            return;
        }
        
        const formData = new FormData(this);
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        // Simulate sending (replace with actual API)
        setTimeout(() => {
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            contactForm.reset();
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }, 1500);
    });
}

// ========================================
// FORM VALIDATION
// ========================================
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#e74c3c';
            
            field.addEventListener('input', function() {
                this.style.borderColor = '';
            }, { once: true });
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields.', 'error');
    }
    
    return isValid;
}

// ========================================
// NOTIFICATION SYSTEM - FIXED
// ========================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${icons[type] || 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" aria-label="Close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add notification styles
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        min-width: 300px;
        max-width: 500px;
        animation: slideInRight 0.3s ease-out;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification.fade-out {
        animation: slideOutRight 0.3s ease-out;
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notification-success {
        border-left: 4px solid #2E8B57;
    }
    
    .notification-error {
        border-left: 4px solid #e74c3c;
    }
    
    .notification-info {
        border-left: 4px solid #3498db;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        flex: 1;
    }
    
    .notification-content i {
        font-size: 1.5rem;
    }
    
    .notification-success i {
        color: #2E8B57;
    }
    
    .notification-error i {
        color: #e74c3c;
    }
    
    .notification-info i {
        color: #3498db;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.2rem;
        color: #999;
        cursor: pointer;
        padding: 0.5rem;
        transition: color 0.2s;
    }
    
    .notification-close:hover {
        color: #333;
    }
    
    @media (max-width: 767px) {
        .notification {
            right: 10px;
            left: 10px;
            min-width: auto;
            max-width: none;
        }
    }
`;
document.head.appendChild(notificationStyle);

// ========================================
// NEWSLETTER FORM - FIXED
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                showNotification('Thank you for subscribing!', 'success');
                this.reset();
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    });
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ========================================
// CURRENT YEAR FOR COPYRIGHT
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// ========================================
// LAZY LOADING IMAGES - OPTIMIZED
// ========================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    });
}

// ========================================
// FAQ ACCORDION - FIXED
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
});

// ========================================
// SCROLL REVEAL ANIMATION - OPTIMIZED
// ========================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.reveal').forEach(element => {
        revealObserver.observe(element);
    });
});

// ========================================
// FORM FIELD ENHANCEMENTS
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const formFields = document.querySelectorAll('input, select, textarea');
    
    formFields.forEach(field => {
        // Add focus class
        field.addEventListener('focus', function() {
            const parent = this.parentElement;
            if (parent) parent.classList.add('focused');
        });
        
        // Remove focus class if empty
        field.addEventListener('blur', function() {
            const parent = this.parentElement;
            if (!this.value && parent) {
                parent.classList.remove('focused');
            }
        });
        
        // Check if already has value
        if (field.value) {
            const parent = field.parentElement;
            if (parent) parent.classList.add('focused');
        }
    });
});

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================
// Debounce function for scroll events
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

// ========================================
// ACCESSIBILITY IMPROVEMENTS
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard navigation for custom dropdowns
    document.querySelectorAll('button, a').forEach(element => {
        if (!element.hasAttribute('tabindex') && element.offsetParent !== null) {
            element.setAttribute('tabindex', '0');
        }
    });
    
    // Trap focus in mobile menu when open
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && this.classList.contains('active')) {
                this.classList.remove('active');
                const menuToggle = document.getElementById('menuToggle');
                if (menuToggle) menuToggle.focus();
            }
        });
    }
});

// ========================================
// ERROR HANDLING
// ========================================
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.message);
    // Don't show errors to users in production
});

// ========================================
// PREVENT FLASH OF UNSTYLED CONTENT
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    document.body.style.visibility = 'visible';
});

console.log('%c✓ Aleeman School Website Loaded Successfully', 
    'color: #2E8B57; font-size: 16px; font-weight: bold;');