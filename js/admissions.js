/* ========================================
   ADMISSIONS PAGE - FIXED & OPTIMIZED
======================================== */

document.addEventListener('DOMContentLoaded', function() {
    const admissionForm = document.getElementById('admissionForm');
    
    if (admissionForm) {
        setupFormValidation(admissionForm);
        
        admissionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateAdmissionFormComplete(this)) {
                return;
            }
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            const submitButton = this.querySelector('.submit-btn');
            const originalHTML = submitButton.innerHTML;
            
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                showSuccessModal(data);
                admissionForm.reset();
                submitButton.innerHTML = originalHTML;
                submitButton.disabled = false;
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                // Clear draft
                localStorage.removeItem('admissionDraft');
            }, 2000);
        });
    }
    
    // Scholarship checkbox
    const scholarshipCheckbox = document.getElementById('scholarship');
    if (scholarshipCheckbox) {
        scholarshipCheckbox.addEventListener('change', function() {
            if (this.checked) {
                showNotification(
                    'Your scholarship application will be reviewed with your admission.',
                    'info'
                );
            }
        });
    }
});

// ========================================
// FORM VALIDATION
// ========================================
function setupFormValidation(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    const dobField = form.querySelector('#dob');
    if (dobField) {
        dobField.addEventListener('change', function() {
            validateAge(this);
        });
    }
    
    const phoneField = form.querySelector('#phone');
    if (phoneField) {
        phoneField.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    }
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^(\+?234|0)[0-9]{10}$/;
        const cleanPhone = value.replace(/\s/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    if ((fieldName === 'studentName' || fieldName === 'parentName') && value) {
        const nameRegex = /^[a-zA-Z\s'-]+$/;
        if (!nameRegex.test(value)) {
            isValid = false;
            errorMessage = 'Name should only contain letters';
        }
    }
    
    if (isValid) {
        clearFieldError(field);
    } else {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function validateAge(dobField) {
    const dob = new Date(dobField.value);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate()) 
        ? age - 1 
        : age;
    
    if (actualAge < 5 || actualAge > 20) {
        showFieldError(dobField, 'Please enter a valid date of birth (age 5-20)');
        return false;
    }
    
    clearFieldError(dobField);
    return true;
}

function formatPhoneNumber(phoneField) {
    let value = phoneField.value.replace(/\D/g, '');
    
    if (value.startsWith('234')) {
        value = '+234 ' + value.slice(3, 6) + ' ' + value.slice(6, 9) + ' ' + value.slice(9, 13);
    } else if (value.startsWith('0')) {
        value = value.slice(0, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7, 11);
    }
    
    phoneField.value = value.trim();
}

function validateAdmissionFormComplete(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    let firstInvalidField = null;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
            if (!firstInvalidField) {
                firstInvalidField = input;
            }
        }
    });
    
    if (!isValid) {
        if (firstInvalidField) {
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstInvalidField.focus();
        }
        showNotification('Please correct the errors before submitting.', 'error');
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#e74c3c';
    field.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = 'color: #e74c3c; font-size: 0.85rem; margin-top: 0.3rem;';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    field.parentElement.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    field.style.boxShadow = '';
    
    const errorDiv = field.parentElement.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// ========================================
// SUCCESS MODAL
// ========================================
function showSuccessModal(data) {
    const existingModal = document.querySelector('.success-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Application Submitted Successfully!</h2>
            <p>Thank you, <strong>${data.studentName || 'Student'}</strong>!</p>
            <div class="modal-info">
                <p><i class="fas fa-envelope"></i> Confirmation email will be sent to <strong>${data.email}</strong></p>
                <p><i class="fas fa-phone"></i> We'll contact you at <strong>${data.phone}</strong> within 48 hours</p>
                ${data.scholarship === 'on' ? '<p><i class="fas fa-star"></i> Scholarship application noted</p>' : ''}
            </div>
            <div class="next-steps">
                <h3>Next Steps:</h3>
                <ol>
                    <li>Check your email for confirmation</li>
                    <li>Prepare required documents</li>
                    <li>Wait for our call to schedule entrance exam</li>
                </ol>
            </div>
            <button class="btn btn-primary close-modal">
                <i class="fas fa-times"></i> Close
            </button>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .success-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s;
        }
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
        }
        .modal-content {
            position: relative;
            background: white;
            padding: 3rem;
            border-radius: 15px;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: slideUp 0.4s;
            text-align: center;
        }
        .modal-icon {
            width: 100px;
            height: 100px;
            background: linear-gradient(135deg, #2E8B57, #3CB371);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            font-size: 3rem;
        }
        .modal-content h2 {
            color: #006400;
            margin-bottom: 1rem;
        }
        .modal-info {
            background: #f5f5f5;
            padding: 1.5rem;
            border-radius: 10px;
            margin: 1.5rem 0;
            text-align: left;
        }
        .modal-info p {
            margin-bottom: 1rem;
            display: flex;
            align-items: start;
            gap: 0.5rem;
        }
        .modal-info i {
            color: #2E8B57;
            margin-top: 0.2rem;
        }
        .next-steps {
            background: rgba(46, 139, 87, 0.05);
            padding: 1.5rem;
            border-radius: 10px;
            margin: 1.5rem 0;
            border-left: 4px solid #2E8B57;
            text-align: left;
        }
        .next-steps h3 {
            color: #006400;
            margin-bottom: 1rem;
        }
        .next-steps ol {
            margin-left: 1.5rem;
        }
        @keyframes slideUp {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        @media (max-width: 767px) {
            .modal-content {
                padding: 2rem 1.5rem;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(modal);
    
    const closeButton = modal.querySelector('.close-modal');
    const overlay = modal.querySelector('.modal-overlay');
    
    function closeModal() {
        modal.style.animation = 'fadeOut 0.3s';
        setTimeout(() => modal.remove(), 300);
    }
    
    closeButton.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.parentElement) {
            closeModal();
        }
    });
}

// ========================================
// AUTO-SAVE DRAFT
// ========================================
let autoSaveTimer;

function saveDraft(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    try {
        localStorage.setItem('admissionDraft', JSON.stringify(data));
    } catch (e) {
        console.error('Could not save draft:', e);
    }
}

function loadDraft(form) {
    try {
        const draft = localStorage.getItem('admissionDraft');
        if (draft) {
            const data = JSON.parse(draft);
            
            if (confirm('We found a saved draft. Would you like to restore it?')) {
                Object.keys(data).forEach(key => {
                    const field = form.querySelector(`[name="${key}"]`);
                    if (field) {
                        if (field.type === 'checkbox') {
                            field.checked = data[key] === 'on';
                        } else {
                            field.value = data[key];
                        }
                    }
                });
                showNotification('Draft restored successfully!', 'success');
            } else {
                localStorage.removeItem('admissionDraft');
            }
        }
    } catch (e) {
        console.error('Could not load draft:', e);
    }
}

// Setup auto-save
document.addEventListener('DOMContentLoaded', function() {
    const admissionForm = document.getElementById('admissionForm');
    if (admissionForm) {
        loadDraft(admissionForm);
        
        const inputs = admissionForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                clearTimeout(autoSaveTimer);
                autoSaveTimer = setTimeout(() => {
                    saveDraft(admissionForm);
                }, 2000);
            });
        });
    }
});

console.log('%c✓ Admissions Page Loaded', 'color: #2E8B57; font-size: 14px; font-weight: bold;');