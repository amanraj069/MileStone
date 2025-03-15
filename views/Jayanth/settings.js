document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded'); // Debug: Confirm DOM loaded

    // Select DOM elements
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const editProfileForm = document.querySelector('.edit-profile-form');
    const profileMain = document.querySelector('.profile-main');
    const profileForm = document.getElementById('profile-form');
    const cancelBtn = document.querySelector('.btn-cancel');

    // Check if elements are found
    if (!editProfileBtn) console.error('Edit Profile Button not found');
    if (!editProfileForm) console.error('Edit Profile Form not found');
    if (!profileMain) console.error('Profile Main section not found');
    if (!profileForm) console.error('Profile Form not found');
    if (!cancelBtn) console.error('Cancel Button not found');

    // Toggle Edit Profile Form visibility
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            console.log('Edit Profile button clicked'); // Debug: Confirm click
            editProfileForm.style.display = editProfileForm.style.display === 'none' ? 'block' : 'none';
            profileMain.style.display = editProfileForm.style.display === 'block' ? 'none' : 'block';
        });
    }

    // Handle form submission
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Form submitted'); // Debug: Confirm submission

            try {
                // Get form values
                const username = document.getElementById('username').value;
                const email = document.getElementById('email').value;
                const profilePic = document.getElementById('profile-pic').value;
                const language = document.getElementById('language').value;
                const timezone = document.getElementById('timezone').value;
                const notifications = document.getElementById('notifications').value;
                const password = document.getElementById('password').value;
                const recovery = document.getElementById('recovery').value;

                console.log('Form values:', { username, email, profilePic, language, timezone, notifications, password, recovery }); // Debug: Log values

                // Update Personal Information
                const personalInfo = document.getElementById('personal-info');
                if (personalInfo) {
                    personalInfo.innerHTML = `
                        <h3>Personal Information</h3>
                        <p>Username: ${username}</p>
                        <p>Email: ${email}</p>
                        <p>Profile Picture: <img src="${profilePic}" alt="Profile Pic"></p>
                    `;
                    console.log('Personal Info updated'); // Debug: Confirm update
                } else {
                    console.error('Personal Info section not found');
                }

                // Update Preferences
                const preferences = document.getElementById('preferences');
                if (preferences) {
                    preferences.innerHTML = `
                        <h3>Preferences</h3>
                        <p>Language: ${language === 'en' ? 'English' : 'Spanish'}</p>
                        <p>Timezone: ${timezone}</p>
                        <p>Notifications: ${notifications}</p>
                    `;
                    console.log('Preferences updated'); // Debug: Confirm update
                } else {
                    console.error('Preferences section not found');
                }

                // Update Password Management
                const passwordMgmt = document.getElementById('password-management');
                if (passwordMgmt) {
                    passwordMgmt.innerHTML = `
                        <h3>Password Management</h3>
                        <p>Current Password: ${password ? '********' : '********'}</p>
                        <p>Password Recovery: ${recovery}</p>
                    `;
                    console.log('Password Management updated'); // Debug: Confirm update
                } else {
                    console.error('Password Management section not found');
                }

                // Hide the form and show the main content
                editProfileForm.style.display = 'none';
                profileMain.style.display = 'block';

                alert('Profile updated successfully!');
            } catch (error) {
                console.error('Error during form submission:', error);
            }
        });
    }

    // Handle cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            console.log('Cancel button clicked'); // Debug: Confirm click
            editProfileForm.style.display = 'none';
            profileMain.style.display = 'block';
        });
    }
});