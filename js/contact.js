/* ========================================
   CONTACT PAGE - FIXED & OPTIMIZED
======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // MAIN CONTACT FORM
    // ========================================
    const mainContactForm = document.getElementById('mainContactForm');
    
    if (mainContactForm) {
        mainContactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateContactForm(this)) {
                return;
            }
            
            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
            
            // Simulate sending
            setTimeout(() => {
                showNotification(
                    'Thank you for contacting us! We\'ll get back to you within 24 hours.',
                    'success'
                );
                
                mainContactForm.reset();
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 1500);
        });
    }
    
    // ========================================
    // CAMPUS TOUR FORM
    // ========================================
    const tourForm = document.getElementById('tourForm');
    
    if (tourForm) {
        tourForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateTourForm(this)) {
                return;
            }
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                showNotification(
                    'Your campus tour has been scheduled! We\'ll send you a confirmation email shortly.',
                    'success'
                );
                
                tourForm.reset();
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 1500);
        });
    }
    
    // ========================================
    // SET MINIMUM DATE FOR TOUR
    // ========================================
    const tourDateInput = document.getElementById('tourDate');
    
    if (tourDateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tourDateInput.min = tomorrow.toISOString().split('T')[0];
        
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        tourDateInput.max = maxDate.toISOString().split('T')[0];
    }
});

// ========================================
// VALIDATION FUNCTIONS
// ========================================
function validateContactForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            highlightField(field, false);
        } else {
            highlightField(field, true);
        }
    });
    
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value && !validateEmail(emailField.value)) {
        isValid = false;
        highlightField(emailField, false);
        showNotification('Please enter a valid email address.', 'error');
    }
    
    const phoneField = form.querySelector('input[type="tel"]');
    if (phoneField && phoneField.value && !validatePhone(phoneField.value)) {
        isValid = false;
        highlightField(phoneField, false);
        showNotification('Please enter a valid phone number.', 'error');
    }
    
    if (!isValid && !emailField && !phoneField) {
        showNotification('Please fill in all required fields.', 'error');
    }
    
    return isValid;
}

function validateTourForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            highlightField(field, false);
        } else {
            highlightField(field, true);
        }
    });
    
    const dateField = form.querySelector('#tourDate');
    if (dateField && dateField.value) {
        const selectedDate = new Date(dateField.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            isValid = false;
            highlightField(dateField, false);
            showNotification('Please select a future date.', 'error');
        }
        
        const dayOfWeek = selectedDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            isValid = false;
            highlightField(dateField, false);
            showNotification('Tours are only available Monday through Friday.', 'error');
        }
    }
    
    if (!isValid) {
        showNotification('Please check the form and correct any errors.', 'error');
    }
    
    return isValid;
}

function highlightField(field, isValid) {
    if (isValid) {
        field.style.borderColor = '';
        field.style.boxShadow = '';
    } else {
        field.style.borderColor = '#e74c3c';
        field.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
        
        field.addEventListener('input', function() {
            this.style.borderColor = '';
            this.style.boxShadow = '';
        }, { once: true });
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^(\+?234|0)[0-9]{10}$/;
    return re.test(phone.replace(/\s/g, ''));
}

console.log('%c✓ Contact Page Loaded', 'color: #2E8B57; font-size: 14px; font-weight: bold;');