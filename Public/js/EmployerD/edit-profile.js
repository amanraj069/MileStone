document.addEventListener('DOMContentLoaded', function() {
    // Load saved profile data if available
    loadSavedProfileData();
    
    // Handle form submission
    const profileEditForm = document.getElementById('profileEditForm');
    if (profileEditForm) {
      profileEditForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveProfileData();
        window.location.href = '/EmployerD/profile'; // Redirect to profile page after saving
      });
    }
  });
  
  function loadSavedProfileData() {
    // Check if we have saved profile data
    const savedProfile = localStorage.getItem('employerProfile');
    
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      
      // Populate form fields with saved data
      setInputValue('companyName', profileData.companyName);
      setInputValue('location', profileData.location);
      setInputValue('websiteLink', profileData.websiteLink);
      setInputValue('email', profileData.email);
      setInputValue('phone', profileData.phone);
      setInputValue('companyImageUrl', profileData.companyImageUrl);
      
      // Set social media URLs
      setInputValue('linkedinUrl', profileData.linkedinUrl);
      setInputValue('twitterUrl', profileData.twitterUrl);
      setInputValue('facebookUrl', profileData.facebookUrl);
      setInputValue('instagramUrl', profileData.instagramUrl);
      
      // Set about content
      setTextareaValue('aboutContent', profileData.aboutContent);
    }
  }
  
  function saveProfileData() {
    // Collect form data
    const profileData = {
      companyName: getInputValue('companyName'),
      location: getInputValue('location'),
      websiteLink: getInputValue('websiteLink'),
      email: getInputValue('email'),
      phone: getInputValue('phone'),
      companyImageUrl: getInputValue('companyImageUrl'),
      linkedinUrl: getInputValue('linkedinUrl'),
      twitterUrl: getInputValue('twitterUrl'),
      facebookUrl: getInputValue('facebookUrl'),
      instagramUrl: getInputValue('instagramUrl'),
      aboutContent: getTextareaValue('aboutContent'),
      subscription: getInputValue('subscription') || 'Premium' // Preserve subscription
    };
    
    // Save to localStorage (in a real app, this would be sent to a server)
    localStorage.setItem('employerProfile', JSON.stringify(profileData));
  }
  
  function getInputValue(id) {
    const input = document.getElementById(id);
    return input ? input.value : '';
  }
  
  function setInputValue(id, value) {
    const input = document.getElementById(id);
    if (input && value) {
      input.value = value;
    }
  }
  
  function getTextareaValue(id) {
    const textarea = document.getElementById(id);
    return textarea ? textarea.value : '';
  }
  
  function setTextareaValue(id, value) {
    const textarea = document.getElementById(id);
    if (textarea && value) {
      textarea.value = value;
    }
  }