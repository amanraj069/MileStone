// Modal control functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^\d{10}$/; // Assumes a 10-digit phone number
    return phoneRegex.test(phone);
}

// Event listeners for modal controls and form submission
document.addEventListener('DOMContentLoaded', function () {
    // Apply modal event listeners
    document.getElementById('applyNowBtn')?.addEventListener('click', function () {
        openModal('applyModal');
    });

    document.getElementById('closeApplyModal')?.addEventListener('click', function () {
        closeModal('applyModal');
    });

    document.getElementById('cancelApply')?.addEventListener('click', function () {
        closeModal('applyModal');
    });

    // Form submission handling
    document.getElementById('submitApplication')?.addEventListener('click', function () {
        // Get form input values
        const name = document.getElementById('applicantName').value.trim();
        const email = document.getElementById('applicantEmail').value.trim();
        const phone = document.getElementById('applicantPhone').value.trim();
        const bid = document.getElementById('applicantBid').value.trim();
        const message = document.getElementById('applicantMessage').value.trim();

        // Clear previous error messages
        clearErrors();

        // Validation flag
        let isValid = true;

        // Check if all fields are filled
        if (!name || !email || !phone || !bid || !message) {
            displayError('All fields are required.');
            isValid = false;
        }

        // Validate email
        if (email && !validateEmail(email)) {
            displayError('Please enter a valid email address.', 'applicantEmail');
            isValid = false;
        }

        // Validate phone number
        if (phone && !validatePhone(phone)) {
            displayError('Please enter a valid 10-digit phone number.', 'applicantPhone');
            isValid = false;
        }

        // If all validations pass, proceed with submission
        if (isValid) {
            alert('Application submitted successfully!');
            closeModal('applyModal');
            // Reset the form
            document.getElementById('applicantName').value = '';
            document.getElementById('applicantEmail').value = '';
            document.getElementById('applicantPhone').value = '';
            document.getElementById('applicantBid').value = '';
            document.getElementById('applicantMessage').value = '';
        }
    });

    // Milestone modal event listeners (optional, if applicable)
    document.getElementById('addMilestoneBtn')?.addEventListener('click', function () {
        openModal('addMilestoneModal');
    });

    document.getElementById('closeAddMilestoneModal')?.addEventListener('click', function () {
        closeModal('addMilestoneModal');
    });

    document.getElementById('cancelAddMilestone')?.addEventListener('click', function () {
        closeModal('addMilestoneModal');
    });

    document.getElementById('saveAddMilestone')?.addEventListener('click', function () {
        const deliverable = document.getElementById('deliverableInput')?.value;
        const deadline = document.getElementById('milestoneDeadlineInput')?.value;
        const payment = document.getElementById('paymentInput')?.value;

        if (!deliverable || !deadline || !payment) {
            alert('Please fill out all fields');
            return;
        }

        const tbody = document.getElementById('milestones-tbody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${deliverable}</td>
            <td>${deadline}</td>
            <td class="payment-column">${payment}</td>
        `;
        tbody.appendChild(newRow);

        document.getElementById('deliverableInput').value = '';
        document.getElementById('milestoneDeadlineInput').value = '';
        document.getElementById('paymentInput').value = '';
        closeModal('addMilestoneModal');
    });
});

// Function to display error messages
function displayError(message, fieldId = null) {
    if (fieldId) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'red';
        errorDiv.style.fontSize = '12px';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    } else {
        const modalBody = document.querySelector('.modal-body');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'red';
        errorDiv.style.fontSize = '12px';
        errorDiv.textContent = message;
        modalBody.insertBefore(errorDiv, modalBody.firstChild);
    }
}

// Function to clear previous error messages
function clearErrors() {
    const errors = document.querySelectorAll('.error-message');
    errors.forEach(error => error.remove());
}