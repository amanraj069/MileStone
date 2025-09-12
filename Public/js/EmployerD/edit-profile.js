document.addEventListener('DOMContentLoaded', function() {
    // Handle image upload preview
    const imageInput = document.getElementById('companyImage');
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    alert('Please select a valid image file.');
                    e.target.value = '';
                    return;
                }
                
                // Validate file size (5MB max)
                if (file.size > 5 * 1024 * 1024) {
                    alert('File size must be less than 5MB.');
                    e.target.value = '';
                    return;
                }
                
                // Show preview
                showImagePreview(file);
            }
        });
    }
    
    // Handle form submission validation
    const profileEditForm = document.getElementById('profileEditForm');
    if (profileEditForm) {
        profileEditForm.addEventListener('submit', function(e) {
            // Validate required fields
            const companyName = document.getElementById('companyName').value.trim();
            const email = document.getElementById('email').value.trim();
            
            if (!companyName) {
                alert('Company name is required.');
                e.preventDefault();
                return;
            }
            
            if (!email) {
                alert('Email is required.');
                e.preventDefault();
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                e.preventDefault();
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
        
        // Create new preview
        const previewContainer = document.createElement('div');
        previewContainer.className = 'new-image-preview';
        previewContainer.style.cssText = `
            margin-top: 10px;
            padding: 10px;
            background-color: #f0f9ff;
            border-radius: 8px;
            border: 1px solid #1e88e5;
            text-align: center;
        `;
        
        const previewImg = document.createElement('img');
        previewImg.src = e.target.result;
        previewImg.style.cssText = `
            max-width: 100px;
            max-height: 100px;
            border-radius: 8px;
            border: 2px solid #1e88e5;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        `;
        
        const previewText = document.createElement('p');
        previewText.textContent = 'New image preview';
        previewText.style.cssText = `
            color: #1e88e5;
            font-size: 12px;
            margin-top: 5px;
            font-weight: 600;
        `;
        
        previewContainer.appendChild(previewImg);
        previewContainer.appendChild(previewText);
        
        // Insert after the file input
        const fileInput = document.getElementById('companyImage');
        fileInput.parentNode.appendChild(previewContainer);
    };
    reader.readAsDataURL(file);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}