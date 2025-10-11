// Edit Profile JavaScript Functions

// Image Preview Function
function previewImage(input) {
  const preview = document.getElementById('imagePreview');
  const previewImg = document.getElementById('previewImg');
  const previewPlaceholder = document.getElementById('previewPlaceholder');
  
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      // Remove placeholder if it exists
      if (previewPlaceholder) {
        previewPlaceholder.remove();
      }
      
      // Create or update image element
      if (previewImg) {
        previewImg.src = e.target.result;
      } else {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = 'Profile Image Preview';
        img.id = 'previewImg';
        
        const label = document.createElement('p');
        label.className = 'preview-label';
        label.textContent = 'New Profile Image';
        
        preview.innerHTML = '';
        preview.appendChild(img);
        preview.appendChild(label);
      }
      
      // Update preview container styling
      preview.classList.add('has-image');
      
      // Update label for existing image
      const existingLabel = preview.querySelector('.preview-label');
      if (existingLabel) {
        existingLabel.textContent = 'New Profile Image';
      }
    };
    
    reader.readAsDataURL(input.files[0]);
  }
}

// Portfolio Image Preview Function
function previewPortfolioImage(input, index) {
  const preview = document.getElementById(`portfolioPreview${index}`);
  const previewImg = document.getElementById(`portfolioPreviewImg${index}`);
  const previewPlaceholder = document.getElementById(`portfolioPreviewPlaceholder${index}`);
  
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      // Remove placeholder if it exists
      if (previewPlaceholder) {
        previewPlaceholder.remove();
      }
      
      // Create or update image element
      if (previewImg) {
        previewImg.src = e.target.result;
      } else {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = 'Portfolio Image Preview';
        img.id = `portfolioPreviewImg${index}`;
        
        const label = document.createElement('p');
        label.className = 'preview-label';
        label.textContent = 'New Portfolio Image';
        
        preview.innerHTML = '';
        preview.appendChild(img);
        preview.appendChild(label);
      }
      
      // Update preview container styling
      preview.classList.add('has-image');
      
      // Update label for existing image
      const existingLabel = preview.querySelector('.preview-label');
      if (existingLabel) {
        existingLabel.textContent = 'New Portfolio Image';
      }
    };
    
    reader.readAsDataURL(input.files[0]);
  }
}

// Phone Number Validation
function validatePhoneNumber(phoneNumber) {
  // Remove all non-digit characters for validation
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  // Check if it's between 10-15 digits
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return false;
  }
  
  // Additional pattern check for common phone formats
  const phonePattern = /^[\+]?[1-9][\d]{0,4}?[\s\-\.]?[\(]?[\d]{1,4}[\)]?[\s\-\.]?[\d]{1,4}[\s\-\.]?[\d]{1,9}$/;
  return phonePattern.test(phoneNumber);
}

function displayPhoneError(message) {
  const errorDiv = document.getElementById('phoneError');
  const phoneInput = document.getElementById('phone');
  
  if (message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    phoneInput.classList.add('error');
    phoneInput.classList.remove('valid');
  } else {
    errorDiv.classList.add('hidden');
    phoneInput.classList.remove('error');
    phoneInput.classList.add('valid');
  }
}

// Remove Item
function removeItem(button, type) {
  button.parentElement.remove();
  // Re-index items
  const container = document.getElementById(`${type}Container`);
  const items = container.querySelectorAll(`.${type}-item`);
  items.forEach((item, index) => {
    item.setAttribute('data-index', index);
    item.querySelectorAll('input, textarea').forEach(input => {
      const name = input.name.replace(/\[\d+\]/, `[${index}]`);
      input.name = name;
    });
  });
}

  // Real-time phone validation
  document.getElementById('phone')?.addEventListener('input', function(e) {
    const phoneValue = e.target.value.trim();
    
    if (phoneValue === '') {
      displayPhoneError('');
      e.target.classList.remove('error', 'valid');
      return;
    }
    
    if (!validatePhoneNumber(phoneValue)) {
      displayPhoneError('Please enter a valid phone number (10-15 digits)');
    } else {
      displayPhoneError('');
    }
  });

  // Phone number formatting (optional - formats as user types)
  document.getElementById('phone')?.addEventListener('keyup', function(e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    let formattedValue = '';
    
    if (value.length > 0) {
      if (value.length <= 3) {
        formattedValue = value;
      } else if (value.length <= 6) {
        formattedValue = value.slice(0, 3) + '-' + value.slice(3);
      } else if (value.length <= 10) {
        formattedValue = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6);
      } else {
        // For international numbers, don't format automatically
        formattedValue = e.target.value;
      }
    }
    
    // Only apply formatting for numbers 10 digits or less
    if (value.length <= 10) {
      e.target.value = formattedValue;
    }
  });

  // Add Experience
  document.getElementById('addExperienceBtn')?.addEventListener('click', () => {
    const container = document.getElementById('experienceContainer');
    const index = container.querySelectorAll('.experience-item').length;
    const item = document.createElement('div');
    item.className = 'experience-item';
    item.setAttribute('data-index', index);
    item.innerHTML = `
      <input type="text" class="experience-title" name="experience[${index}][title]" placeholder="Title" />
      <input type="text" class="experience-date" name="experience[${index}][date]" placeholder="Date" />
      <textarea class="experience-description" name="experience[${index}][description]" rows="3" placeholder="Description"></textarea>
      <button type="button" class="remove-btn" onclick="removeItem(this, 'experience')">Remove</button>
    `;
    container.insertBefore(item, document.getElementById('addExperienceBtn'));
  });

  // Add Education
  document.getElementById('addEducationBtn')?.addEventListener('click', () => {
    const container = document.getElementById('educationContainer');
    const index = container.querySelectorAll('.education-item').length;
    const item = document.createElement('div');
    item.className = 'education-item';
    item.setAttribute('data-index', index);
    item.innerHTML = `
      <input type="text" class="education-title" name="education[${index}][degree]" placeholder="Degree" />
      <input type="text" class="education-institution" name="education[${index}][institution]" placeholder="Institution" />
      <input type="text" class="education-date" name="education[${index}][date]" placeholder="Date" />
      <button type="button" class="remove-btn" onclick="removeItem(this, 'education')">Remove</button>
    `;
    container.insertBefore(item, document.getElementById('addEducationBtn'));
  });

  // Add Portfolio
  document.getElementById('addPortfolioBtn')?.addEventListener('click', () => {
    const container = document.getElementById('portfolioContainer');
    const index = container.querySelectorAll('.portfolio-item').length;
    const item = document.createElement('div');
    item.className = 'portfolio-item';
    item.setAttribute('data-index', index);
    item.innerHTML = `
      <label for="portfolioImage${index}">Portfolio Image</label>
      <input type="file" id="portfolioImage${index}" class="portfolio-image-file" name="portfolioImages" accept="image/*" onchange="previewPortfolioImage(this, '${index}')" />
      <small class="field-note">Upload portfolio image (JPG, PNG, GIF, WebP - Max 5MB)</small>
      <div id="portfolioPreview${index}" class="portfolio-preview">
        <div class="preview-placeholder" id="portfolioPreviewPlaceholder${index}">
          <i class="fas fa-image"></i>
          <p>No image selected</p>
        </div>
      </div>
      <input type="text" class="portfolio-title" name="portfolio[${index}][title]" placeholder="Title" />
      <textarea class="portfolio-description" name="portfolio[${index}][description]" rows="3" placeholder="Description"></textarea>
      <input type="url" class="portfolio-link" name="portfolio[${index}][link]" placeholder="Project Link (Optional)" />
      <button type="button" class="remove-btn" onclick="removeItem(this, 'portfolio')">Remove</button>
    `;
    container.insertBefore(item, document.getElementById('addPortfolioBtn'));
  });

  // Form Submission
  document.getElementById('profileEditForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    
    // Validate phone number before submission
    const phoneInput = document.getElementById('phone');
    const phoneValue = phoneInput.value.trim();
    
    if (phoneValue && !validatePhoneNumber(phoneValue)) {
      displayPhoneError('Please enter a valid phone number before submitting');
      phoneInput.focus();
      return;
    }
    
    const formData = new FormData(form);
    
    // Collect experience, education, and portfolio
    const experience = [];
    const education = [];
    const portfolio = [];

    form.querySelectorAll('.experience-item').forEach(item => {
      const title = item.querySelector('.experience-title').value;
      const date = item.querySelector('.experience-date').value;
      const description = item.querySelector('.experience-description').value;
      if (title || date || description) {
        experience.push({ title, date, description });
      }
    });

    form.querySelectorAll('.education-item').forEach(item => {
      const degree = item.querySelector('.education-title').value;
      const institution = item.querySelector('.education-institution').value;
      const date = item.querySelector('.education-date').value;
      if (degree || institution || date) {
        education.push({ degree, institution, date });
      }
    });

    form.querySelectorAll('.portfolio-item').forEach((item, index) => {
      const title = item.querySelector('.portfolio-title').value;
      const description = item.querySelector('.portfolio-description').value;
      const link = item.querySelector('.portfolio-link').value;
      // Note: Portfolio images will be handled separately as files
      if (title || description || link) {
        portfolio.push({ title, description, link, index });
      }
    });

    // Add structured data to FormData
    formData.append('experienceData', JSON.stringify(experience));
    formData.append('educationData', JSON.stringify(education));
    formData.append('portfolioData', JSON.stringify(portfolio));

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData, // Send FormData directly for file upload support
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        window.location.href = '/freelancerD/profile';
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to update profile');
    }
  });


// Make functions available globally for inline event handlers
window.previewImage = previewImage;
window.previewPortfolioImage = previewPortfolioImage;
window.removeItem = removeItem;