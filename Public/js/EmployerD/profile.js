document.addEventListener('DOMContentLoaded', function() {
    // Load profile data from localStorage if available
    loadProfileData();
    
    // Update company name in about section
    const companyName = document.getElementById('companyNameDisplay').textContent;
    document.getElementById('aboutCompanyName').textContent = companyName;
    
    // Make website link clickable
    const websiteDisplay = document.getElementById('websiteDisplay');
    if (websiteDisplay) {
      const websiteUrl = websiteDisplay.textContent;
      if (!websiteUrl.startsWith('http')) {
        websiteDisplay.href = 'https://' + websiteUrl;
      } else {
        websiteDisplay.href = websiteUrl;
      }
    }
  });
  
  function loadProfileData() {
    // Check if we have saved profile data
    const savedProfile = localStorage.getItem('employerProfile');
    
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      
      // Update basic info
      updateElementText('companyNameDisplay', profileData.companyName);
      updateElementText('locationDisplay', profileData.location);
      updateElementText('websiteDisplay', profileData.websiteLink);
      updateElementText('emailDisplay', profileData.email);
      updateElementText('phoneDisplay', profileData.phone);
      updateElementText('aboutCompanyName', profileData.companyName);
      updateElementText('subscriptionDisplay', profileData.subscription || 'Premium');
      
      // Update company logo
      const companyLogo = document.getElementById('companyLogo');
      if (companyLogo && profileData.companyImageUrl) {
        companyLogo.src = profileData.companyImageUrl;
      }
      
      // Update about content
      if (profileData.aboutContent) {
        const aboutContentDisplay = document.getElementById('aboutContentDisplay');
        aboutContentDisplay.innerHTML = '';
        
        const paragraphs = profileData.aboutContent.split('\n\n');
        paragraphs.forEach((paragraph, index) => {
          if (paragraph.trim()) {
            const p = document.createElement('p');
            p.textContent = paragraph;
            aboutContentDisplay.appendChild(p);
            
            // Add line break after paragraph except for the last one
            if (index < paragraphs.length - 1) {
              aboutContentDisplay.appendChild(document.createElement('br'));
            }
          }
        });
      }
      
      // Update social links
      if (profileData.linkedinUrl) {
        updateSocialLink('linkedinLink', profileData.linkedinUrl);
      }
      
      if (profileData.twitterUrl) {
        updateSocialLink('twitterLink', profileData.twitterUrl);
      }
      
      if (profileData.facebookUrl) {
        updateSocialLink('facebookLink', profileData.facebookUrl);
      }
      
      if (profileData.instagramUrl) {
        updateSocialLink('instagramLink', profileData.instagramUrl);
      }
    }
  }
  
  function updateElementText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element && text) {
      element.textContent = text;
    }
  }
  
  function updateSocialLink(elementId, url) {
    const element = document.getElementById(elementId);
    if (element && url) {
      element.href = url;
    }
  }