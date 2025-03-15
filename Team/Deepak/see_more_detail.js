// Modal control functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Navigation function
function goBack() {
    alert('Navigating back to job listings...');
    window.location.href = "job_listing.html";
}

// Apply Now functionality
document.addEventListener("DOMContentLoaded", function () {
    // Apply Now button event listener
    const applyNowBtn = document.getElementById('applyNowBtn');
    if (applyNowBtn) {
        applyNowBtn.addEventListener('click', function () {
            openModal('applyModal');
        });
    }

    // Apply modal close buttons
    const closeApplyModal = document.getElementById('closeApplyModal');
    if (closeApplyModal) {
        closeApplyModal.addEventListener('click', function () {
            closeModal('applyModal');
        });
    }

    const cancelApply = document.getElementById('cancelApply');
    if (cancelApply) {
        cancelApply.addEventListener('click', function () {
            closeModal('applyModal');
        });
    }

    // Apply form submission
    const submitApplication = document.getElementById('submitApplication');
    if (submitApplication) {
        submitApplication.addEventListener('click', function () {
            const name = document.getElementById('applicantName').value.trim();
            const email = document.getElementById('applicantEmail').value.trim();
            const phone = document.getElementById('applicantPhone').value.trim();
            const bid = document.getElementById('applicantBid').value.trim();
            const message = document.getElementById('applicantMessage').value.trim();

            if (!name || !email || !phone || !bid || !message) {
                alert('Please fill out all required fields');
                return;
            }

            // Simulate application submission (replace with actual server call if needed)
            alert('Application submitted successfully!');
            closeModal('applyModal');
        });
    }
});