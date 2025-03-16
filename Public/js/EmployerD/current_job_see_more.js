// Ensure DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', function () {
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

    // Add Milestone functionality
    const addMilestoneBtn = document.getElementById('addMilestoneBtn');
    if (addMilestoneBtn) {
        addMilestoneBtn.addEventListener('click', function () {
            openModal('addMilestoneModal');
        });
    }

    const closeAddMilestoneModal = document.getElementById('closeAddMilestoneModal');
    if (closeAddMilestoneModal) {
        closeAddMilestoneModal.addEventListener('click', function () {
            closeModal('addMilestoneModal');
        });
    }

    const cancelAddMilestone = document.getElementById('cancelAddMilestone');
    if (cancelAddMilestone) {
        cancelAddMilestone.addEventListener('click', function () {
            closeModal('addMilestoneModal');
        });
    }

    const saveAddMilestone = document.getElementById('saveAddMilestone');
    if (saveAddMilestone) {
        saveAddMilestone.addEventListener('click', function () {
            // Get milestone data
            const deliverable = document.getElementById('deliverableInput').value.trim();
            const deadline = document.getElementById('milestoneDeadlineInput').value.trim();
            const payment = document.getElementById('paymentInput').value.trim();

            if (!deliverable || !deadline || !payment) {
                alert('Please fill out all fields');
                return;
            }

            // Add new row to table
            const tbody = document.getElementById('milestones-tbody');
            const newRow = document.createElement('tr');

            newRow.innerHTML = `
                <td>${deliverable}</td>
                <td>${deadline}</td>
                <td class="payment-column">${payment}</td>
                <td>
                    <div class="milestone-actions">
                        <button class="milestone-button edit-milestone">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="milestone-button delete-milestone">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;

            // Add event listeners to the new buttons
            const editButton = newRow.querySelector('.edit-milestone');
            const deleteButton = newRow.querySelector('.delete-milestone');

            editButton.addEventListener('click', handleEditMilestone);
            deleteButton.addEventListener('click', handleDeleteMilestone);

            tbody.appendChild(newRow);

            // Reset form and close modal
            document.getElementById('deliverableInput').value = '';
            document.getElementById('milestoneDeadlineInput').value = '';
            document.getElementById('paymentInput').value = '';
            closeModal('addMilestoneModal');
        });
    }

    const complaintBtn = document.getElementById('complain-btn');
    complaintBtn.addEventListener('click', function() {
            alert(`Complaint submitted successfully!`);
        });

    // Edit milestone modal control
    const closeEditMilestoneModal = document.getElementById('closeEditMilestoneModal');
    if (closeEditMilestoneModal) {
        closeEditMilestoneModal.addEventListener('click', function () {
            closeModal('editMilestoneModal');
        });
    }

    const cancelEditMilestone = document.getElementById('cancelEditMilestone');
    if (cancelEditMilestone) {
        cancelEditMilestone.addEventListener('click', function () {
            closeModal('editMilestoneModal');
        });
    }

    const saveEditMilestone = document.getElementById('saveEditMilestone');
    if (saveEditMilestone) {
        saveEditMilestone.addEventListener('click', function () {
            const index = document.getElementById('editMilestoneIndex').value;
            const deliverable = document.getElementById('editDeliverableInput').value.trim();
            const deadline = document.getElementById('editMilestoneDeadlineInput').value.trim();
            const payment = document.getElementById('editPaymentInput').value.trim();

            const rows = document.getElementById('milestones-tbody').querySelectorAll('tr');
            if (index >= 0 && index < rows.length) {
                const row = rows[index];
                row.cells[0].textContent = deliverable;
                row.cells[1].textContent = deadline;
                row.cells[2].textContent = payment;
            }

            closeModal('editMilestoneModal');
        });
    }

    // Handle edit milestone
    function handleEditMilestone(event) {
        const row = event.currentTarget.closest('tr');
        const rows = Array.from(document.getElementById('milestones-tbody').querySelectorAll('tr'));
        const index = rows.indexOf(row);

        // Populate the edit form
        document.getElementById('editDeliverableInput').value = row.cells[0].textContent.trim();
        document.getElementById('editMilestoneDeadlineInput').value = row.cells[1].textContent.trim();
        document.getElementById('editPaymentInput').value = row.cells[2].textContent.trim();
        document.getElementById('editMilestoneIndex').value = index;

        openModal('editMilestoneModal');
    }

    // Handle delete milestone
    function handleDeleteMilestone(event) {
        if (confirm('Are you sure you want to delete this milestone?')) {
            const row = event.currentTarget.closest('tr');
            row.remove();
        }
    }
});