document.addEventListener('DOMContentLoaded', function() {
    // Initialize form validation
    initializeFormValidation();
    
    // Handle image upload preview
    const imageInput = document.getElementById('companyImage');
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            handleImageUpload(e);
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
    // Company name validation (required)
    const companyNameInput = document.getElementById('companyName');
    if (companyNameInput) {
        companyNameInput.addEventListener('input', () => validateCompanyName(companyNameInput));
        companyNameInput.addEventListener('blur', () => validateCompanyName(companyNameInput));
    }
    
    // Location validation (required)
    const locationInput = document.getElementById('location');
    if (locationInput) {
        locationInput.placeholder = 'City, State';
        locationInput.addEventListener('input', () => validateLocation(locationInput));
        locationInput.addEventListener('blur', () => validateLocation(locationInput));
    }
    
    // Email validation (required)
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', () => validateEmail(emailInput));
        emailInput.addEventListener('blur', () => validateEmail(emailInput));
    }
    
    // Phone validation (required)
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', () => validatePhone(phoneInput));
        phoneInput.addEventListener('blur', () => validatePhone(phoneInput));
    }
    
    // Website validation (optional but must be valid if provided)
    const websiteInput = document.getElementById('websiteLink');
    if (websiteInput) {
        websiteInput.addEventListener('input', () => validateWebsiteUrl(websiteInput));
        websiteInput.addEventListener('blur', () => validateWebsiteUrl(websiteInput));
    }
    
    // Social media links validation (optional but must be valid if provided)
    const socialInputs = [
        { input: document.getElementById('linkedinUrl'), platform: 'linkedin' },
        { input: document.getElementById('twitterUrl'), platform: 'twitter' },
        { input: document.getElementById('facebookUrl'), platform: 'facebook' },
        { input: document.getElementById('instagramUrl'), platform: 'instagram' }
    ];
    
    socialInputs.forEach(({ input, platform }) => {
        if (input) {
            input.addEventListener('input', () => validateSocialMediaUrl(input, platform));
            input.addEventListener('blur', () => validateSocialMediaUrl(input, platform));
        }
    });
}

function validateCompanyName(input) {
    const value = input.value.trim();
    
    if (!value) {
        showFieldError(input, 'Company name is required');
        return false;
    }
    
    if (value.length <= 5) {
        showFieldError(input, 'Company name must be more than 5 characters');
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
    
    showFieldSuccess(input);
    return true;
}

function validateLocation(input) {
    const value = input.value.trim();
    
    if (!value) {
        showFieldError(input, 'Location is required');
        return false;
    }
    
    // Check for comma separation
    if (!value.includes(',')) {
        showFieldError(input, 'Location must be in format: City, State');
        return false;
    }
    
    const parts = value.split(',').map(part => part.trim());
    
    if (parts.length !== 2) {
        showFieldError(input, 'Location must be in format: City, State');
        return false;
    }
    
    const [city, state] = parts;
    
    if (city.length <= 3) {
        showFieldError(input, 'City name must be more than characters');
        return false;
    }
    
    if (state.length <= 2) {
        showFieldError(input, 'State name must be more than or equal to 3 characters');
        return false;
    }
    
    // Check for valid characters (letters, spaces, hyphens)
    const validPattern = /^[a-zA-Z\s\-]+$/;
    if (!validPattern.test(city) || !validPattern.test(state)) {
        showFieldError(input, 'Location can only contain letters, spaces, and hyphens');
        return false;
    }
    
    showFieldSuccess(input);
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
    
    showFieldSuccess(input);
    return true;
}

function validatePhone(input) {
    const value = input.value.trim();
    
    if (!value) {
        showFieldError(input, 'Phone number is required');
        return false;
    }
    
    // Remove all non-digit characters for validation
    const digitsOnly = value.replace(/\D/g, '');
    
    if (digitsOnly.length !== 10) {
        showFieldError(input, 'Phone number must be exactly 10 digits');
        return false;
    }
    
    // Check if it starts with a valid digit (not 0 or 1 for Indian numbers)
    if (digitsOnly[0] === '0' || digitsOnly[0] === '1') {
        showFieldError(input, 'Phone number cannot start with 0 or 1');
        return false;
    }
    
    showFieldSuccess(input);
    return true;
}

function validateWebsiteUrl(input) {
    const value = input.value.trim();
    
    if (!value) {
        clearFieldValidation(input);
        return true; // Website is optional
    }
    
    // Check if it starts with http:// or https://
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
        showFieldError(input, 'Website URL must start with http:// or https://');
        return false;
    }
    
    try {
        const url = new URL(value);
        
        if (url.hostname.length < 3) {
            showFieldError(input, 'Invalid website domain');
            return false;
        }
        
        showFieldSuccess(input);
        return true;
    } catch (error) {
        showFieldError(input, 'Please enter a valid website URL');
        return false;
    }
}

function validateSocialMediaUrl(input, platform) {
    const value = input.value.trim();
    
    if (!value) {
        clearFieldValidation(input);
        return true; // Social media is optional
    }
    
    try {
        const url = new URL(value);
        
        // Platform-specific validation
        const platformPatterns = {
            'linkedin': /^https?:\/\/(www\.)?linkedin\.com\/.+/i,
            'twitter': /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+/i,
            'facebook': /^https?:\/\/(www\.)?facebook\.com\/.+/i,
            'instagram': /^https?:\/\/(www\.)?instagram\.com\/.+/i
        };
        
        const platformNames = {
            'linkedin': 'LinkedIn',
            'twitter': 'Twitter/X',
            'facebook': 'Facebook',
            'instagram': 'Instagram'
        };
        
        if (platform && platformPatterns[platform]) {
            if (!platformPatterns[platform].test(value)) {
                showFieldError(input, `Please enter a valid ${platformNames[platform]} URL`);
                return false;
            }
        }
        
        showFieldSuccess(input);
        return true;
    } catch (error) {
        showFieldError(input, 'Please enter a valid URL');
        return false;
    }
}

function validateAllFields() {
    let isValid = true;
    
    // Clear all previous errors
    clearAllErrors();
    
    // Validate all required fields
    const companyName = document.getElementById('companyName');
    const location = document.getElementById('location');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    
    if (!validateCompanyName(companyName)) isValid = false;
    if (!validateLocation(location)) isValid = false;
    if (!validateEmail(email)) isValid = false;
    if (!validatePhone(phone)) isValid = false;
    
    // Validate optional fields if they have values
    const websiteLink = document.getElementById('websiteLink');
    if (websiteLink.value.trim() && !validateWebsiteUrl(websiteLink)) isValid = false;
    
    // Validate social media URLs if provided
    const socialInputs = [
        { input: document.getElementById('linkedinUrl'), platform: 'linkedin' },
        { input: document.getElementById('twitterUrl'), platform: 'twitter' },
        { input: document.getElementById('facebookUrl'), platform: 'facebook' },
        { input: document.getElementById('instagramUrl'), platform: 'instagram' }
    ];
    
    socialInputs.forEach(({ input, platform }) => {
        if (input && input.value.trim() && !validateSocialMediaUrl(input, platform)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please fix all validation errors before submitting', 'error');
    }
    
    return isValid;
}

function handleImageUpload(e) {
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
    
    // Show image preview
    showImagePreview(file);
    showNotification('Image selected successfully', 'success');
}

function showImagePreview(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        // Remove existing preview if any
        const existingPreview = document.querySelector('.image-preview-container');
        if (existingPreview) {
            existingPreview.remove();
        }
        
        // Create new preview container
        const previewContainer = document.createElement('div');
        previewContainer.className = 'image-preview-container';
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
            border: 3px solid #28a745;
            box-shadow: 0 4px 12px rgba(40, 167, 69, 0.2);
            object-fit: cover;
            display: block;
        `;
        
        // Create preview text
        const previewText = document.createElement('p');
        previewText.textContent = 'Image Preview';
        previewText.style.cssText = `
            color: #28a745;
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

function showFieldError(input, message) {
    input.style.borderColor = '#dc3545';
    input.style.borderWidth = '2px';
    input.classList.add('error');
    input.classList.remove('success');
    
    // Remove existing validation message
    const existingMessage = input.parentElement.querySelector('.validation-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create and add error message
    const errorElement = document.createElement('div');
    errorElement.className = 'validation-message error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #dc3545;
        font-size: 12px;
        margin-top: 5px;
        display: block;
        font-weight: 500;
    `;
    
    input.parentElement.appendChild(errorElement);
}

function showFieldSuccess(input) {
    input.style.borderColor = '#28a745';
    input.style.borderWidth = '2px';
    input.classList.add('success');
    input.classList.remove('error');
    
    // Remove existing validation message
    const existingMessage = input.parentElement.querySelector('.validation-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create and add success message
    const successElement = document.createElement('div');
    successElement.className = 'validation-message success-message';
    successElement.textContent = '✓ Valid';
    successElement.style.cssText = `
        color: #28a745;
        font-size: 12px;
        margin-top: 5px;
        display: block;
        font-weight: 500;
    `;
    
    input.parentElement.appendChild(successElement);
}

function clearFieldValidation(input) {
    input.style.borderColor = '';
    input.style.borderWidth = '';
    input.classList.remove('error', 'success');
    
    const validationMessage = input.parentElement.querySelector('.validation-message');
    if (validationMessage) {
        validationMessage.remove();
    }
}

function clearAllErrors() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => clearFieldValidation(input));
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
