document.addEventListener('DOMContentLoaded', function() {
    // Clear any old localStorage data that might interfere with the profile display
    localStorage.removeItem('employerProfile');
    
    // Update company name in about section
    const companyName = document.getElementById('companyNameDisplay').textContent;
    document.getElementById('aboutCompanyName').textContent = companyName;
    
    // Make website link clickable
    const websiteDisplay = document.getElementById('websiteDisplay');
    if (websiteDisplay) {
      const websiteUrl = websiteDisplay.textContent;
      if (websiteUrl && !websiteUrl.startsWith('http') && websiteUrl !== 'Not specified') {
        websiteDisplay.href = 'https://' + websiteUrl;
      } else if (websiteUrl && websiteUrl.startsWith('http')) {
        websiteDisplay.href = websiteUrl;
      }
    }
  });