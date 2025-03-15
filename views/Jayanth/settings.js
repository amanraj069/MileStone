// settings.js
document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.querySelector('.edit-profile-btn');
    const editForm = document.querySelector('.edit-profile-form');
    const cancelButton = document.querySelector('.btn-cancel');
    const settingsForm = document.querySelector('#settings-form');

    // Toggle edit form visibility
    editButton.addEventListener('click', () => {
        editForm.style.display = editForm.style.display === 'none' ? 'block' : 'none';
    });

    // Hide form when cancel is clicked
    cancelButton.addEventListener('click', () => {
        editForm.style.display = 'none';
    });

    // Handle form submission
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const username = document.querySelector('#username').value;
        const email = document.querySelector('#email').value;
        const language = document.querySelector('#language').value;
        const timezone = document.querySelector('#timezone').value;
        const newPassword = document.querySelector('#new-password').value;
        const confirmPassword = document.querySelector('#confirm-password').value;

        // Basic validation
        if (newPassword && newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // Update displayed settings (for demo purposes)
        document.querySelector('.settings-section:nth-child(1) p:nth-child(1)').textContent = `Username: ${username}`;
        document.querySelector('.settings-section:nth-child(1) p:nth-child(2)').textContent = `Email: ${email}`;
        document.querySelector('.settings-section:nth-child(2) p:nth-child(1)').textContent = `Language: ${language === 'en' ? 'English' : language === 'es' ? 'Spanish' : 'French'}`;
        document.querySelector('.settings-section:nth-child(2) p:nth-child(2)').textContent = `Timezone: ${timezone}`;
        if (newPassword) {
            document.querySelector('.settings-section:nth-child(3) p:nth-child(1)').textContent = 'Current Password: ********';
            alert('Password updated successfully!');
            document.querySelector('#new-password').value = '';
            document.querySelector('#confirm-password').value = '';
        }

        // Hide the form after saving
        editForm.style.display = 'none';
        alert('Settings updated successfully!');
    });

    // Optional: Handle manage buttons (placeholder functionality)
    const manageButtons = document.querySelectorAll('.manage-btn');
    manageButtons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.parentElement.querySelector('h3').textContent;
            alert(`Manage ${section} functionality not implemented yet.`);
        });
    });
});