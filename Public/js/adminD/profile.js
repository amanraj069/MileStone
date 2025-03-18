document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');

    // Select DOM elements
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const statusToggleBtn = document.querySelector('.status-toggle-btn');
    const editProfileForm = document.querySelector('.edit-profile-form');
    const profileContainer = document.querySelector('.profile-container');
    const profileForm = document.getElementById('profile-form');
    const cancelBtn = document.querySelector('.btn-cancel');
    const quickActionButtons = document.querySelectorAll('.action-btn');

    // Element existence checks
    if (!editProfileBtn) console.error('Edit Profile Button not found');
    if (!statusToggleBtn) console.error('Status Toggle Button not found');
    if (!editProfileForm) console.error('Edit Profile Form not found');
    if (!profileContainer) console.error('Profile Container not found');
    if (!profileForm) console.error('Profile Form not found');
    if (!cancelBtn) console.error('Cancel Button not found');

    // Toggle Edit Profile Form
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            console.log('Edit Profile button clicked');
            editProfileForm.style.display = editProfileForm.style.display === 'none' ? 'block' : 'none';
            profileContainer.style.display = editProfileForm.style.display === 'block' ? 'none' : 'block';
        });
    }

    // Handle Status Toggle
    if (statusToggleBtn) {
        statusToggleBtn.addEventListener('click', async () => {
            console.log('Status Toggle button clicked');
            const currentStatus = statusToggleBtn.getAttribute('data-status');
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

            try {
                const response = await fetch('/adminD/profile/status', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: newStatus }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Status update failed: ${response.status} - ${errorText}`);
                }

                const data = await response.json();
                statusToggleBtn.setAttribute('data-status', newStatus);
                statusToggleBtn.textContent = newStatus === 'active' ? 'Deactivate' : 'Activate';
                
                const statusIndicator = document.querySelector('.status-indicator');
                if (statusIndicator) {
                    statusIndicator.className = `status-indicator ${newStatus}`;
                }

                alert(`Profile status updated to ${newStatus}`);
            } catch (error) {
                console.error('Error updating status:', error);
                alert('Failed to update status. Please check the console for details.');
            }
        });
    }

    // Handle Form Submission
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Form submission initiated');

            try {
                // Get form values
                const formData = {
                    username: document.getElementById('username').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    profilePic: document.getElementById('profile-pic').value.trim(),
                    phone: document.getElementById('phone').value.trim(),
                    location: document.getElementById('location').value.trim(),
                    website: document.getElementById('website').value.trim(),
                    password: document.getElementById('password').value.trim() || undefined,
                    recovery: document.getElementById('recovery').value,
                };

                console.log('Form data to be sent:', formData);

                // Send data to server
                const response = await fetch('/adminD/profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    credentials: 'include', // Include cookies if authentication is required
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Profile update failed: ${response.status} - ${errorText}`);
                }

                const updatedProfile = await response.json();
                console.log('Server response:', updatedProfile);

                // Update profile display
                const profileDetails = profileContainer.querySelector('.profile-details');
                const personalInfo = profileContainer.querySelector('#personal-info');

                if (profileDetails && personalInfo) {
                    // Update overview section
                    profileDetails.querySelector('h2').firstChild.textContent = updatedProfile.username;
                    profileDetails.querySelector('.location').lastChild.textContent = updatedProfile.location;
                    profileDetails.querySelector('.website a').textContent = updatedProfile.website;
                    profileDetails.querySelector('.website a').href = updatedProfile.website;
                    profileDetails.querySelector('.email a').textContent = updatedProfile.email;
                    profileDetails.querySelector('.email a').href = `mailto:${updatedProfile.email}`;
                    profileDetails.querySelector('.phone').lastChild.textContent = updatedProfile.phone;
                    profileContainer.querySelector('.profile-logo img').src = updatedProfile.profilePic;

                    // Update personal info section
                    personalInfo.innerHTML = `
                        <h3>Personal Information</h3>
                        <p>Username: ${updatedProfile.username}</p>
                        <p>Email: ${updatedProfile.email}</p>
                        <p>Profile Picture: <img src="${updatedProfile.profilePic}" alt="Profile Pic" class="profile-pic-preview" /></p>
                        <p>Address: ${updatedProfile.address}</p>
                    `;

                    console.log('Profile UI updated successfully');
                } else {
                    console.error('Profile details or personal info section not found');
                }

                // Hide form and show profile
                editProfileForm.style.display = 'none';
                profileContainer.style.display = 'block';

                alert('Profile updated successfully!');
            } catch (error) {
                console.error('Error during profile save:', error);

                // Fallback: Update UI locally if server fails (for testing)
                const profileDetails = profileContainer.querySelector('.profile-details');
                const personalInfo = profileContainer.querySelector('#personal-info');
                if (profileDetails && personalInfo) {
                    profileDetails.querySelector('h2').firstChild.textContent = formData.username;
                    profileDetails.querySelector('.location').lastChild.textContent = formData.location;
                    profileDetails.querySelector('.website a').textContent = formData.website;
                    profileDetails.querySelector('.website a').href = formData.website;
                    profileDetails.querySelector('.email a').textContent = formData.email;
                    profileDetails.querySelector('.email a').href = `mailto:${formData.email}`;
                    profileDetails.querySelector('.phone').lastChild.textContent = formData.phone;
                    profileContainer.querySelector('.profile-logo img').src = formData.profilePic;

                    personalInfo.innerHTML = `
                        <h3>Personal Information</h3>
                        <p>Username: ${formData.username}</p>
                        <p>Email: ${formData.email}</p>
                        <p>Profile Picture: <img src="${formData.profilePic}" alt="Profile Pic" class="profile-pic-preview" /></p>
                        <p>Address: ${formData.address || 'Not updated'}</p>
                    `;
                }

                editProfileForm.style.display = 'none';
                profileContainer.style.display = 'block';

                alert(`Failed to save changes to server: ${error.message}. UI updated locally for testing. Check console for details.`);
            }
        });
    }

    // Handle Cancel Button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            console.log('Cancel button clicked');
            editProfileForm.style.display = 'none';
            profileContainer.style.display = 'block';
        });
    }

    // Handle Quick Action Buttons
    if (quickActionButtons) {
        quickActionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.classList[1];
                switch (action) {
                    case 'view-logs':
                        console.log('View Activity Logs clicked');
                        window.location.href = '/adminD/activity-logs';
                        break;
                    case 'reset-password':
                        console.log('Reset Password clicked');
                        alert('Reset Password functionality to be implemented');
                        break;
                    case 'manage-permissions':
                        console.log('Manage Permissions clicked');
                        window.location.href = '/adminD/permissions';
                        break;
                    default:
                        console.log('Unknown action');
                }
            });
        });
    }
});