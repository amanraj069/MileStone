document.addEventListener('DOMContentLoaded', function() {
  // Load profile data from localStorage if available
  loadProfileData();
});

function loadProfileData() {
  const savedProfile = localStorage.getItem('freelancerProfile');

  if (savedProfile) {
      const profileData = JSON.parse(savedProfile);

      // Update basic info
      updateElementText('nameDisplay', profileData.name);
      updateElementText('titleDisplay', profileData.title);
      updateElementText('locationDisplay', profileData.location);
      updateElementText('emailDisplay', profileData.email);
      updateElementText('phoneDisplay', profileData.phone);
      updateElementText('projectsDisplay', profileData.projects);

      // Update profile image
      const profileImage = document.getElementById('profileImage');
      if (profileImage) {
          profileImage.src = profileData.profileImageUrl;
          profileImage.onerror = () => {
              profileImage.src = defaultImageUrl;
          };
      }

      // Update about content
      const aboutDisplay = document.getElementById('aboutDisplay');
      if (aboutDisplay && profileData.about) {
          aboutDisplay.innerHTML = '';
          const paragraphs = profileData.about.split('\n\n');
          paragraphs.forEach((paragraph, index) => {
              if (paragraph.trim()) {
                  const p = document.createElement('p');
                  p.textContent = paragraph;
                  aboutDisplay.appendChild(p);
                  if (index < paragraphs.length - 1) {
                      aboutDisplay.appendChild(document.createElement('br'));
                  }
              }
          });
      }

      // Update skills
      const skillsDisplay = document.getElementById('skillsDisplay');
      if (skillsDisplay && profileData.skills) {
          skillsDisplay.innerHTML = profileData.skills
              .map(skill => `<span class="skill-tag">${skill}</span>`)
              .join('');
      }

      // Update experience
      const experienceDisplay = document.getElementById('experienceDisplay');
      if (experienceDisplay && profileData.experience) {
          experienceDisplay.innerHTML = profileData.experience
              .map(item => `
                  <div class="experience-item">
                      <h5>${item.title}</h5>
                      <p class="experience-date">${item.date}</p>
                      ${item.description ? `<p>${item.description}</p>` : ''}
                  </div>
              `)
              .join('');
      }

      // Update education
      const educationDisplay = document.getElementById('educationDisplay');
      if (educationDisplay && profileData.education) {
          educationDisplay.innerHTML = profileData.education
              .map(item => `
                  <div class="education-item">
                      <h5>${item.title}</h5>
                      <p class="education-date">${item.institution}</p>
                      <p class="education-date">${item.date}</p>
                  </div>
              `)
              .join('');
      }

      // Update portfolio
      const portfolioDisplay = document.getElementById('portfolioDisplay');
      if (portfolioDisplay && profileData.portfolio) {
          portfolioDisplay.innerHTML = profileData.portfolio
              .map(item => `
                  <div class="portfolio-item">
                      ${item.image ? `<img src="${item.image}" alt="${item.title || 'Portfolio Item'}">` : ''}
                      ${item.title ? `<h5>${item.title}</h5>` : ''}
                      ${item.description ? `<p>${item.description}</p>` : ''}
                      ${item.link ? `<a href="${item.link}" class="portfolio-link">View Project</a>` : ''}
                  </div>
              `)
              .join('');
      }

      // Update resume
      const resumeDisplay = document.getElementById('resumeDisplay');
      if (resumeDisplay && profileData.resumeLink) {
          const resumeLink = resumeDisplay.querySelector('.resume-link');
          resumeLink.href = profileData.resumeLink;
          resumeLink.textContent = 'View Resume';
      } else {
          resumeDisplay.innerHTML = '<p>No resume link provided.</p>';
      }
  } else {
      // Set default image if no profile data
      const profileImage = document.getElementById('profileImage');
      if (profileImage) {
          profileImage.src = defaultImageUrl;
      }
  }
}

function updateElementText(elementId, text) {
  const element = document.getElementById(elementId);
  if (element && text) {
      element.textContent = text;
  }
}