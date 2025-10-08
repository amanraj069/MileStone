// Freelancer Submit Complaint JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('complaintForm');
    const textarea = document.getElementById('issue');
    const charCount = document.getElementById('charCount');
    const submitBtn = document.querySelector('.btn-submit');
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');

    // Character counter
    textarea.addEventListener('input', function() {
        const currentLength = this.value.length;
        charCount.textContent = currentLength;
        
        if (currentLength > 1000) {
            charCount.style.color = '#ef4444';
            this.value = this.value.substring(0, 1000);
            charCount.textContent = '1000';
        } else if (currentLength > 800) {
            charCount.style.color = '#f59e0b';
        } else {
            charCount.style.color = '#6b7280';
        }
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const complaintData = {
            complaintType: formData.get('complaintType'),
            issue: formData.get('issue'),
            priority: formData.get('priority')
        };

        // Validate required fields
        if (!complaintData.complaintType || !complaintData.issue) {
            showNotificationBanner('Please fill in all required fields.', 'error');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';

        try {
            // Get job ID from URL
            const pathParts = window.location.pathname.split('/');
            const jobId = pathParts[pathParts.length - 1];

            const response = await fetch(`/freelancerD/active_job/complain/${jobId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(complaintData)
            });

            const data = await response.json();

            if (response.ok) {
                showNotificationBanner('Complaint submitted successfully! You will be redirected shortly.', 'success');
                
                // Redirect after 2 seconds
                setTimeout(() => {
                    window.location.href = '/freelancerD/active_job';
                }, 2000);
            } else {
                throw new Error(data.error || 'Failed to submit complaint');
            }
        } catch (error) {
            console.error('Error submitting complaint:', error);
            showNotificationBanner(error.message || 'An error occurred while submitting the complaint.', 'error');
            
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
        }
    });

    // Auto-resize textarea
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 200) + 'px';
    });
});

// Show notification banner
function showNotificationBanner(message, type = 'success', duration = 4000) {
    const banner = document.getElementById('notification-banner');
    const bannerMessage = document.getElementById('banner-message');
    const bannerIcon = document.getElementById('banner-icon');
    
    // Set message and type
    bannerMessage.textContent = message;
    banner.className = `notification-banner ${type} show`;
    
    // Set appropriate icon based on type
    if (type === 'success') {
        bannerIcon.innerHTML = '✓';
    } else if (type === 'error') {
        bannerIcon.innerHTML = '✕';
    }
    
    // Auto-hide after duration (except for success messages during redirect)
    if (type !== 'success' || !message.includes('redirected')) {
        setTimeout(() => {
            banner.classList.remove('show');
        }, duration);
    }
}