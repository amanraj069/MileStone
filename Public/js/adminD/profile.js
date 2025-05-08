document.addEventListener('DOMContentLoaded', function() {
    // Load profile data from localStorage if available
    loadProfileData();
});

function loadProfileData() {;
    const savedProfile = localStorage.getItem('adminProfile');

    if (savedProfile) {
        const profileData = JSON.parse(savedProfile);

        // Update basic info
        updateElementText('nameDisplay', profileData.name);
        updateElementText('locationDisplay', profileData.location);
        updateElementText('emailDisplay', profileData.email);
        updateElementText('phoneDisplay', profileData.phone);
        updateElementText('subscriptionDisplay', profileData.subscription);
        updateElementText('roleDisplay', profileData.role);

        // Update profile image
        const profileImage = document.getElementById('profileImage');
        if (profileImage) {
            profileImage.src = profileData.picture;
            profileImage.onerror = () => {
                profileImage.src = defaultImageUrl;
            };
        }

        // Update about content
        const aboutDisplay = document.getElementById('aboutDisplay');
        if (aboutDisplay && profileData.aboutMe) {
            aboutDisplay.innerHTML = '';
            const paragraphs = profileData.aboutMe.split('\n\n');
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

        // Update social media links
        updateSocialLink('linkedinLink', profileData.socialMedia?.linkedin);
        updateSocialLink('twitterLink', profileData.socialMedia?.twitter);
        updateSocialLink('facebookLink', profileData.socialMedia?.facebook);
        updateSocialLink('instagramLink', profileData.socialMedia?.instagram);
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

function updateSocialLink(elementId, url) {
    const element = document.getElementById(elementId);
    if (element && url) {
        element.href = url;
    } else if (element) {
        element.style.display = 'none';
    }
}