document.addEventListener('DOMContentLoaded', function() {
    // Get form and input elements
    const form = document.getElementById('profileEditForm');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const linkedinInput = document.getElementById('linkedinUrl');
    const twitterInput = document.getElementById('twitterUrl');
    const facebookInput = document.getElementById('facebookUrl');
    const instagramInput = document.getElementById('instagramUrl');
    const websiteInput = document.getElementById('websiteLink');
    const companyImageInput = document.getElementById('companyImage');

    // Validation state object
    const validationState = {
        email: false,
        phone: false,
        linkedin: true, // Optional field, starts as valid
        twitter: true,  // Optional field, starts as valid
        facebook: true, // Optional field, starts as valid
        instagram: true, // Optional field, starts as valid
        website: true,   // Optional field, starts as valid
        companyImage: true // Optional field, starts as valid
    };

    // Add real-time validation listeners
    if (emailInput) {
        emailInput.addEventListener('input', () => validateEmail(emailInput));
        emailInput.addEventListener('blur', () => validateEmail(emailInput));
    }

    if (phoneInput) {
        phoneInput.addEventListener('input', () => validatePhone(phoneInput));
        phoneInput.addEventListener('blur', () => validatePhone(phoneInput));
    }

    if (linkedinInput) {
        linkedinInput.addEventListener('input', () => validateSocialMedia(linkedinInput, 'linkedin'));
        linkedinInput.addEventListener('blur', () => validateSocialMedia(linkedinInput, 'linkedin'));
    }

    if (twitterInput) {
        twitterInput.addEventListener('input', () => validateSocialMedia(twitterInput, 'twitter'));
        twitterInput.addEventListener('blur', () => validateSocialMedia(twitterInput, 'twitter'));
    }

    if (facebookInput) {
        facebookInput.addEventListener('input', () => validateSocialMedia(facebookInput, 'facebook'));
        facebookInput.addEventListener('blur', () => validateSocialMedia(facebookInput, 'facebook'));
    }

    if (instagramInput) {
        instagramInput.addEventListener('input', () => validateSocialMedia(instagramInput, 'instagram'));
        instagramInput.addEventListener('blur', () => validateSocialMedia(instagramInput, 'instagram'));
    }

    if (websiteInput) {
        websiteInput.addEventListener('input', () => validateWebsite(websiteInput));
        websiteInput.addEventListener('blur', () => validateWebsite(websiteInput));
    }

    if (companyImageInput) {
        companyImageInput.addEventListener('change', () => validateImage(companyImageInput));
    }

    // Form submission validation
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields
            const emailValid = validateEmail(emailInput);
            const phoneValid = validatePhone(phoneInput);
            const linkedinValid = validateSocialMedia(linkedinInput, 'linkedin');
            const twitterValid = validateSocialMedia(twitterInput, 'twitter');
            const facebookValid = validateSocialMedia(facebookInput, 'facebook');
            const instagramValid = validateSocialMedia(instagramInput, 'instagram');
            const websiteValid = validateWebsite(websiteInput);
            const imageValid = validateImage(companyImageInput);

            // Check if all validations pass
            const allValid = emailValid && phoneValid && linkedinValid && 
                           twitterValid && facebookValid && instagramValid && 
                           websiteValid && imageValid;

            if (allValid) {
                showNotification('All fields are valid! Submitting form...', 'success');
                
                // Add loading state to submit button
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving Changes...';
                }
                
                // Submit the form
                form.submit();
            } else {
                showNotification('Please fix validation errors before submitting', 'error');
                
                // Focus on first invalid field
                const firstInvalidField = form.querySelector('.form-input.error, input.error');
                if (firstInvalidField) {
                    firstInvalidField.focus();
                    firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }

    // Email validation function
    function validateEmail(input) {
        if (!input) return true;
        
        const value = input.value.trim();
        removeFieldError(input);
        
        if (!value) {
            showFieldError(input, 'Email is required');
            validationState.email = false;
            return false;
        }

        // Email regex pattern
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (!emailPattern.test(value)) {
            showFieldError(input, 'Please enter a valid email address');
            validationState.email = false;
            return false;
        }

        // Additional email validation
        if (value.length > 254) {
            showFieldError(input, 'Email address is too long (max 254 characters)');
            validationState.email = false;
            return false;
        }

        // Check for common email providers (optional enhancement)
        const domain = value.split('@')[1];
        if (domain && domain.includes('..')) {
            showFieldError(input, 'Invalid email format');
            validationState.email = false;
            return false;
        }

        showFieldSuccess(input, 'Valid email address');
        validationState.email = true;
        return true;
    }

    // Phone validation function
    function validatePhone(input) {
        if (!input) return true;
        
        const value = input.value.trim();
        removeFieldError(input);
        
        if (!value) {
            showFieldError(input, 'Phone number is required');
            validationState.phone = false;
            return false;
        }

        // Remove all non-digit characters for validation
        const digitsOnly = value.replace(/\D/g, '');
        
        // Check minimum and maximum length
        if (digitsOnly.length < 10) {
            showFieldError(input, 'Phone number must have at least 10 digits');
            validationState.phone = false;
            return false;
        }

        if (digitsOnly.length > 15) {
            showFieldError(input, 'Phone number cannot exceed 15 digits');
            validationState.phone = false;
            return false;
        }

        // Indian phone number validation (starts with 6, 7, 8, 9)
        const indianMobilePattern = /^[6-9]\d{9}$/;
        const internationalPattern = /^(\+\d{1,3}[-.\s]?)?\d{6,14}$/;
        
        if (!indianMobilePattern.test(digitsOnly) && !internationalPattern.test(value)) {
            showFieldError(input, 'Please enter a valid phone number');
            validationState.phone = false;
            return false;
        }

        // Check for obviously fake numbers
        const repeatingPattern = /^(\d)\1{9,}$/;
        if (repeatingPattern.test(digitsOnly)) {
            showFieldError(input, 'Please enter a valid phone number');
            validationState.phone = false;
            return false;
        }

        showFieldSuccess(input, 'Valid phone number');
        validationState.phone = true;
        return true;
    }

    // Social media URL validation function
    function validateSocialMedia(input, platform) {
        if (!input) return true;
        
        const value = input.value.trim();
        removeFieldError(input);
        
        // If empty, it's valid (optional field)
        if (!value) {
            validationState[platform] = true;
            return true;
        }

        // URL pattern validation
        const urlPattern = /^https?:\/\/.+/i;
        if (!urlPattern.test(value)) {
            showFieldError(input, 'URL must start with http:// or https://');
            validationState[platform] = false;
            return false;
        }

        // Platform-specific validation
        const platformPatterns = {
            linkedin: /^https?:\/\/(www\.)?linkedin\.com\/.*$/i,
            twitter: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.*$/i,
            facebook: /^https?:\/\/(www\.)?facebook\.com\/.*$/i,
            instagram: /^https?:\/\/(www\.)?instagram\.com\/.*$/i
        };

        if (platformPatterns[platform] && !platformPatterns[platform].test(value)) {
            const platformNames = {
                linkedin: 'LinkedIn',
                twitter: 'Twitter/X',
                facebook: 'Facebook',
                instagram: 'Instagram'
            };
            showFieldError(input, `Please enter a valid ${platformNames[platform]} URL`);
            validationState[platform] = false;
            return false;
        }

        // URL length validation
        if (value.length > 2048) {
            showFieldError(input, 'URL is too long (max 2048 characters)');
            validationState[platform] = false;
            return false;
        }

        showFieldSuccess(input, `Valid ${platform} URL`);
        validationState[platform] = true;
        return true;
    }

    // Website URL validation function
    function validateWebsite(input) {
        if (!input) return true;
        
        const value = input.value.trim();
        removeFieldError(input);
        
        // If empty, it's valid (optional field)
        if (!value) {
            validationState.website = true;
            return true;
        }

        // URL pattern validation
        const urlPattern = /^https?:\/\/.+\..+/i;
        if (!urlPattern.test(value)) {
            showFieldError(input, 'Please enter a valid website URL (e.g., https://example.com)');
            validationState.website = false;
            return false;
        }

        // Additional URL validation
        try {
            const url = new URL(value);
            
            // Check for valid domain
            if (!url.hostname.includes('.')) {
                showFieldError(input, 'Please enter a valid domain name');
                validationState.website = false;
                return false;
            }

            // Check URL length
            if (value.length > 2048) {
                showFieldError(input, 'URL is too long (max 2048 characters)');
                validationState.website = false;
                return false;
            }

        } catch (e) {
            showFieldError(input, 'Please enter a valid website URL');
            validationState.website = false;
            return false;
        }

        showFieldSuccess(input, 'Valid website URL');
        validationState.website = true;
        return true;
    }

    // Image file validation function
    function validateImage(input) {
        if (!input) return true;
        
        const file = input.files[0];
        removeFieldError(input);
        
        // If no file selected, it's valid (optional field)
        if (!file) {
            validationState.companyImage = true;
            return true;
        }

        // File type validation
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            showFieldError(input, 'Please select a valid image file (JPG, PNG, GIF, WebP)');
            validationState.companyImage = false;
            return false;
        }

        // File size validation (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            showFieldError(input, 'Image file size must be less than 5MB');
            validationState.companyImage = false;
            return false;
        }

        // File name validation
        const fileName = file.name;
        if (fileName.length > 255) {
            showFieldError(input, 'File name is too long');
            validationState.companyImage = false;
            return false;
        }

        // Check for potentially dangerous file extensions in name
        const dangerousExtensions = /\.(php|js|html|exe|bat|cmd)$/i;
        if (dangerousExtensions.test(fileName)) {
            showFieldError(input, 'Invalid file type detected');
            validationState.companyImage = false;
            return false;
        }

        showFieldSuccess(input, `Valid image file (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
        validationState.companyImage = true;
        return true;
    }

    // Show field error function
    function showFieldError(input, message) {
        // Add error class to input
        input.classList.add('error');
        input.style.borderColor = '#dc3545';
        
        // Remove any existing error message
        removeFieldError(input);
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #dc3545;
            font-size: 12px;
            margin-top: 5px;
            display: flex;
            align-items: center;
            gap: 5px;
            animation: shake 0.3s ease-in-out;
        `;
        
        // Add error icon
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        // Insert error message after input
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            formGroup.appendChild(errorElement);
        }
        
        // Add shake animation
        input.style.animation = 'shake 0.3s ease-in-out';
        setTimeout(() => {
            input.style.animation = '';
        }, 300);
    }

    // Show field success function
    function showFieldSuccess(input, message) {
        // Add success class to input
        input.classList.remove('error');
        input.classList.add('success');
        input.style.borderColor = '#28a745';
        
        // Remove any existing messages
        removeFieldError(input);
        
        // Create success message element (optional - can be removed if too cluttered)
        const successElement = document.createElement('div');
        successElement.className = 'field-success-message';
        successElement.textContent = message;
        successElement.style.cssText = `
            color: #28a745;
            font-size: 12px;
            margin-top: 5px;
            display: flex;
            align-items: center;
            gap: 5px;
        `;
        
        // Add success icon
        successElement.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        
        // Insert success message after input (optional)
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            formGroup.appendChild(successElement);
        }
        
        // Auto-remove success message after 2 seconds
        setTimeout(() => {
            if (successElement.parentNode) {
                successElement.remove();
            }
            input.classList.remove('success');
            input.style.borderColor = '';
        }, 2000);
    }

    // Remove field error function
    function removeFieldError(input) {
        input.classList.remove('error', 'success');
        input.style.borderColor = '';
        
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            const errorMsg = formGroup.querySelector('.field-error-message');
            const successMsg = formGroup.querySelector('.field-success-message');
            
            if (errorMsg) errorMsg.remove();
            if (successMsg) successMsg.remove();
        }
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.validation-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `validation-notification ${type}`;
        
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle'
        };
        
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8'
        };
        
        notification.innerHTML = `
            <i class="fas fa-${icons[type]}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 10px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
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
        }, type === 'error' ? 5000 : 3000);
    }

    // Add CSS animations
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        .form-group input.error {
            border-color: #dc3545 !important;
            box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25);
        }
        
        .form-group input.success {
            border-color: #28a745 !important;
            box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.25);
        }
        
        .field-error-message, .field-success-message {
            margin-top: 5px !important;
        }
    `;
    document.head.appendChild(styleSheet);

    // Initialize validation on page load
    setTimeout(() => {
        if (emailInput && emailInput.value) validateEmail(emailInput);
        if (phoneInput && phoneInput.value) validatePhone(phoneInput);
        if (linkedinInput && linkedinInput.value) validateSocialMedia(linkedinInput, 'linkedin');
        if (twitterInput && twitterInput.value) validateSocialMedia(twitterInput, 'twitter');
        if (facebookInput && facebookInput.value) validateSocialMedia(facebookInput, 'facebook');
        if (instagramInput && instagramInput.value) validateSocialMedia(instagramInput, 'instagram');
        if (websiteInput && websiteInput.value) validateWebsite(websiteInput);
    }, 100);
});