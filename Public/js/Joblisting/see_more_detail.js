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

// Milestone modal event listeners (keeping original functionality)
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
    const deliverable = document.getElementById('deliverableInput').value;
    const deadline = document.getElementById('milestoneDeadlineInput').value;
    const payment = document.getElementById('paymentInput').value;

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

document.getElementById('submitApplication')?.addEventListener('click', function () {
    const name = document.getElementById('applicantName').value.trim();
    const email = document.getElementById('applicantEmail').value.trim();
    const phone = document.getElementById('applicantPhone').value.trim();
    const bid = document.getElementById('applicantBid').value.trim();
    const message = document.getElementById('applicantMessage').value.trim();

    if (!name || !email || !phone || !bid || !message) {
        alert('Please fill out all required fields');
        return;
    }

    alert('Application submitted successfully!');
    closeModal('applyModal');
});