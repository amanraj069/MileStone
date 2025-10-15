document.addEventListener('DOMContentLoaded', function() {
    // Initialize form validation
    initializeFormValidation();
    
    // Handle image upload preview
    const imageInput = document.getElementById('companyImage');
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            validateImageUpload(e);
        });
    }
    
    // Initialize real-time validation for all form fields
    setupRealTimeValidation();
});

function initializeFormValidation() {
    const profileEditForm = document.getElementById('profileEditForm');
    if (!profileEditForm) return;
    
    profileEditForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Always prevent default to handle validation
        
        if (validateAllFields()) {
            // If all validation passes, submit via AJAX
            submitFormAjax(this);
        }
    });
}

function setupRealTimeValidation() {
    // Email validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', () => validateEmail(emailInput));
        emailInput.addEventListener('input', () => clearFieldError(emailInput));
    }
    
    // Phone validation
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('blur', () => validatePhone(phoneInput));
        phoneInput.addEventListener('input', () => clearFieldError(phoneInput));
    }
    
    // Social media links validation
    const socialInputs = [
        document.getElementById('linkedinUrl'),
        document.getElementById('twitterUrl'),
        document.getElementById('facebookUrl'),
        document.getElementById('instagramUrl')
    ];
    
    socialInputs.forEach(input => {
        if (input) {
            input.addEventListener('blur', () => validateSocialMediaUrl(input));
            input.addEventListener('input', () => clearFieldError(input));
        }
    });
    
    // Website validation
    const websiteInput = document.getElementById('websiteLink');
    if (websiteInput) {
        websiteInput.addEventListener('blur', () => validateWebsiteUrl(websiteInput));
        websiteInput.addEventListener('input', () => clearFieldError(websiteInput));
    }
    
    // Company name validation
    const companyNameInput = document.getElementById('companyName');
    if (companyNameInput) {
        companyNameInput.addEventListener('blur', () => validateCompanyName(companyNameInput));
        companyNameInput.addEventListener('input', () => clearFieldError(companyNameInput));
    }
}

function validateAllFields() {
    let isValid = true;
    
    // Clear all previous errors
    clearAllErrors();
    
    // Validate required fields
    const companyName = document.getElementById('companyName');
    const email = document.getElementById('email');
    
    if (!validateCompanyName(companyName)) isValid = false;
    if (!validateEmail(email)) isValid = false;
    
    // Validate optional fields if they have values
    const phone = document.getElementById('phone');
    const websiteLink = document.getElementById('websiteLink');
    
    if (phone.value.trim() && !validatePhone(phone)) isValid = false;
    if (websiteLink.value.trim() && !validateWebsiteUrl(websiteLink)) isValid = false;
    
    // Validate social media URLs if provided
    const socialInputs = [
        { input: document.getElementById('linkedinUrl'), platform: 'LinkedIn' },
        { input: document.getElementById('twitterUrl'), platform: 'Twitter' },
        { input: document.getElementById('facebookUrl'), platform: 'Facebook' },
        { input: document.getElementById('instagramUrl'), platform: 'Instagram' }
    ];
    
    socialInputs.forEach(({ input, platform }) => {
        if (input && input.value.trim() && !validateSocialMediaUrl(input, platform)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateCompanyName(input) {
    const value = input.value.trim();
    
    if (!value) {
        showFieldError(input, 'Company name is required');
        return false;
    }
    
    if (value.length < 2) {
        showFieldError(input, 'Company name must be at least 2 characters long');
        return false;
    }
    
    if (value.length > 100) {
        showFieldError(input, 'Company name cannot exceed 100 characters');
        return false;
    }
    
    // Check for valid characters (letters, numbers, spaces, and common business symbols)
    const validPattern = /^[a-zA-Z0-9\s\-&.,()]+$/;
    if (!validPattern.test(value)) {
        showFieldError(input, 'Company name contains invalid characters');
        return false;
    }
    
    return true;
}

function validateEmail(input) {
    const value = input.value.trim();
    
    if (!value) {
        showFieldError(input, 'Email is required');
        return false;
    }
    
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(value)) {
        showFieldError(input, 'Please enter a valid email address');
        return false;
    }
    
    if (value.length > 254) {
        showFieldError(input, 'Email address is too long');
        return false;
    }
    
    return true;
}

function validatePhone(input) {
    const value = input.value.trim();
    
    if (!value) return true; // Phone is optional
    
    // Remove all non-digit characters for validation
    const digitsOnly = value.replace(/\D/g, '');
    
    if (digitsOnly.length < 10) {
        showFieldError(input, 'Phone number must have at least 10 digits');
        return false;
    }
    
    if (digitsOnly.length > 15) {
        showFieldError(input, 'Phone number cannot exceed 15 digits');
        return false;
    }
    
    // Check for valid phone number pattern
    const phonePattern = /^[\+]?[1-9][\d\s\-\(\)]{8,}$/;
    if (!phonePattern.test(value)) {
        showFieldError(input, 'Please enter a valid phone number');
        return false;
    }
    
    return true;
}

function validateWebsiteUrl(input) {
    const value = input.value.trim();
    
    if (!value) return true; // Website is optional
    
    try {
        const url = new URL(value);
        if (!['http:', 'https:'].includes(url.protocol)) {
            showFieldError(input, 'Website URL must use HTTP or HTTPS protocol');
            return false;
        }
        
        if (url.hostname.length < 3) {
            showFieldError(input, 'Invalid website domain');
            return false;
        }
        
        return true;
    } catch (error) {
        showFieldError(input, 'Please enter a valid website URL (e.g., https://example.com)');
        return false;
    }
}

function validateSocialMediaUrl(input, platform) {
    const value = input.value.trim();
    
    if (!value) return true; // Social media is optional
    
    try {
        const url = new URL(value);
        
        // Platform-specific validation
        const platformPatterns = {
            'LinkedIn': /^https?:\/\/(www\.)?linkedin\.com\/.+/i,
            'Twitter': /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+/i,
            'Facebook': /^https?:\/\/(www\.)?facebook\.com\/.+/i,
            'Instagram': /^https?:\/\/(www\.)?instagram\.com\/.+/i
        };
        
        if (platform && platformPatterns[platform]) {
            if (!platformPatterns[platform].test(value)) {
                showFieldError(input, `Please enter a valid ${platform} URL`);
                return false;
            }
        }
        
        return true;
    } catch (error) {
        showFieldError(input, 'Please enter a valid URL');
        return false;
    }
}

function validateImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        showNotification('Please select a valid image file (JPG, PNG, GIF, WebP)', 'error');
        e.target.value = '';
        return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('File size must be less than 5MB', 'error');
        e.target.value = '';
        return;
    }
    
    showNotification('Image selected successfully', 'success');
}

function showFieldError(input, message) {
    input.style.borderColor = '#dc3545';
    input.classList.add('error');
    
    // Remove existing error message
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create and add error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #dc3545;
        font-size: 12px;
        margin-top: 5px;
        display: block;
    `;
    
    input.parentElement.appendChild(errorElement);
    
    // Focus on the first error field
    if (!document.querySelector('.error')) {
        input.focus();
    }
}

function clearFieldError(input) {
    input.style.borderColor = '';
    input.classList.remove('error');
    
    const errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

function clearAllErrors() {
    const errorInputs = document.querySelectorAll('input.error, textarea.error');
    errorInputs.forEach(input => clearFieldError(input));
    
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());
}

async function submitFormAjax(form) {
    try {
        showNotification('Updating profile...', 'info');
        
        // Disable form during submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        
        const formData = new FormData(form);
        
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        if (response.ok) {
            showNotification('Profile updated successfully!', 'success');
            
            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = '/employerD/profile';
            }, 1500);
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update profile');
        }
        
    } catch (error) {
        console.error('Profile update error:', error);
        showNotification('Failed to update profile: ' + error.message, 'error');
        
        // Re-enable form
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        backgroundColor: getNotificationColor(type),
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: '9999',
        fontSize: '14px',
        fontWeight: '500',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'info': return 'fa-info-circle';
        default: return 'fa-info-circle';
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'success': return '#28a745';
        case 'error': return '#dc3545';
        case 'info': return '#17a2b8';
        default: return '#17a2b8';
    }
}
                return;
            }
            
            // Show loading state
            const submitButton = profileEditForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.textContent = 'Saving...';
                submitButton.disabled = true;
            }
        });
    }
});

function showImagePreview(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        // Remove existing preview if any
        const existingPreview = document.querySelector('.new-image-preview');
        if (existingPreview) {
            existingPreview.remove();
        }
        
        // Create new preview container
        const previewContainer = document.createElement('div');
        previewContainer.className = 'new-image-preview';
        previewContainer.style.cssText = `
            margin-top: 15px;
            text-align: left;
        `;
        
        // Create preview image
        const previewImg = document.createElement('img');
        previewImg.src = e.target.result;
        previewImg.style.cssText = `
            width: 150px;
            height: 150px;
            border-radius: 12px;
            border: 3px solid #1e88e5;
            box-shadow: 0 4px 12px rgba(30, 136, 229, 0.2);
            object-fit: cover;
            display: block;
        `;
        
        // Create preview text
        const previewText = document.createElement('p');
        previewText.textContent = 'New image preview';
        previewText.style.cssText = `
            color: #1e88e5;
            font-size: 14px;
            margin-top: 8px;
            font-weight: 600;
            margin-bottom: 0;
        `;
        
        previewContainer.appendChild(previewImg);
        previewContainer.appendChild(previewText);
        
        // Insert after the field note
        const fileInput = document.getElementById('companyImage');
        const fieldNote = fileInput.parentNode.querySelector('.field-note');
        fieldNote.parentNode.insertBefore(previewContainer, fieldNote.nextSibling);
    };
    reader.readAsDataURL(file);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}