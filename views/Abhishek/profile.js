document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileForm = document.getElementById('editProfileForm');
    
    // Display Elements
    const companyNameDisplay = document.getElementById('companyNameDisplay');
    const locationDisplay = document.getElementById('locationDisplay');
    const websiteDisplay = document.getElementById('websiteDisplay');
    const emailDisplay = document.getElementById('emailDisplay');
    const phoneDisplay = document.getElementById('phoneDisplay');
    const aboutContentDisplay = document.getElementById('aboutContentDisplay');
    const socialLinksDisplay = document.getElementById('socialLinksDisplay');
    
    // Form Elements
    const companyNameInput = document.getElementById('companyName');
    const locationInput = document.getElementById('location');
    const websiteInput = document.getElementById('website');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const aboutContentInput = document.getElementById('aboutContent');
    const linkedinUrlInput = document.getElementById('linkedinUrl');
    const twitterUrlInput = document.getElementById('twitterUrl');
    const facebookUrlInput = document.getElementById('facebookUrl');
    const instagramUrlInput = document.getElementById('instagramUrl');
    
    // Social Media Links
    const socialLinks = document.querySelectorAll('.social-link');
    const socialUrls = document.querySelectorAll('.social-url');
    
    // Edit Mode State
    let isEditing = false;
    
    // Toggle Edit Mode
    editProfileBtn.addEventListener('click', function() {
        isEditing = !isEditing;
        
        if (isEditing) {
            // Switch to edit mode
            editProfileBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save Profile
            `;
            
            // Show edit form
            editProfileForm.classList.add('active');
            
            // Populate form with current values
            companyNameInput.value = companyNameDisplay.textContent;
            locationInput.value = locationDisplay.textContent;
            websiteInput.value = websiteDisplay.textContent;
            emailInput.value = emailDisplay.textContent;
            phoneInput.value = phoneDisplay.textContent;
            
            // Get about content
            const aboutParagraphs = [];
            aboutContentDisplay.querySelectorAll('p').forEach(p => {
                aboutParagraphs.push(p.textContent);
            });
            aboutContentInput.value = aboutParagraphs.join('\n\n');
            
            // Get social links
            socialLinks.forEach((link, index) => {
                const platform = link.getAttribute('data-platform');
                const url = link.getAttribute('href');
                
                if (platform === 'linkedin') linkedinUrlInput.value = url || '';
                if (platform === 'twitter') twitterUrlInput.value = url || '';
                if (platform === 'facebook') facebookUrlInput.value = url || '';
                if (platform === 'instagram') instagramUrlInput.value = url || '';
            });
        } else {
            // Switch to view mode
            editProfileBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit Profile
            `;
            
            // Hide edit form
            editProfileForm.classList.remove('active');
            
            // Update display with form values
            companyNameDisplay.textContent = companyNameInput.value;
            locationDisplay.textContent = locationInput.value;
            websiteDisplay.textContent = websiteInput.value;
            emailDisplay.textContent = emailInput.value;
            phoneDisplay.textContent = phoneInput.value;
            
            // Update about content
            const paragraphs = aboutContentInput.value.split('\n\n');
            aboutContentDisplay.innerHTML = '';
            paragraphs.forEach(paragraph => {
                if (paragraph.trim()) {
                    const p = document.createElement('p');
                    p.textContent = paragraph;
                    aboutContentDisplay.appendChild(p);
                    
                    // Add line break after paragraph
                    if (paragraphs.indexOf(paragraph) < paragraphs.length - 1) {
                        aboutContentDisplay.appendChild(document.createElement('br'));
                    }
                }
            });
            
            // Update social links
            socialLinks.forEach((link, index) => {
                const platform = link.getAttribute('data-platform');
                
                if (platform === 'linkedin') {
                    link.href = linkedinUrlInput.value;
                    socialUrls[0].textContent = 'LinkedIn';
                }
                if (platform === 'twitter') {
                    link.href = twitterUrlInput.value;
                    socialUrls[1].textContent = 'Twitter';
                }
                if (platform === 'facebook') {
                    link.href = facebookUrlInput.value;
                    socialUrls[2].textContent = 'Facebook';
                }
                if (platform === 'instagram') {
                    link.href = instagramUrlInput.value;
                    socialUrls[3].textContent = 'Instagram';
                }
            });
        }
    });
});