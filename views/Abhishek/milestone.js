document.addEventListener('DOMContentLoaded', function () {
    // Initial milestone (unchanged)
    let milestones = [
        {
            id: '1',
            deliverable: 'Initial setup and component architecture',
            deadline: 'Week 1',
            payment: 2500,
            percentage: 20,
            status: 'completed',
            paid: false
        },
        {
            id: '2',
            deliverable: 'Core functionality implementation',
            deadline: 'Week 3',
            payment: 3750,
            percentage: 30,
            status: 'in-progress',
            paid: false
        },
        {
            id: '3',
            deliverable: 'Integration with backend APIs',
            deadline: 'Week 5',
            payment: 2980,
            percentage: 20,
            status: 'not-started',
            paid: false
        },
        {
            id: '4',
            deliverable: 'Testing, bug fixing, and optimization',
            deadline: 'Week 7',
            payment: 4400,
            percentage: 20,
            status: 'not-started',
            paid: false
        },
        {
            id: '5',
            deliverable: 'Final delivery and documentation',
            deadline: 'Week 8',
            payment: 11250,
            percentage: 10,
            status: 'not-started',
            paid: false
        }
    ];

    // DOM Elements (unchanged)
    const milestonesContainer = document.getElementById('milestonesContainer');
    const completionProgressBar = document.getElementById('completionProgressBar');
    const completionPercentage = document.getElementById('completionPercentage');
    const paymentProgressBar = document.getElementById('paymentProgressBar');
    const paymentProgress = document.getElementById('paymentProgress');

    // Modal Elements (unchanged)
    const milestoneModal = document.getElementById('milestoneModal');
    const modalTitle = document.getElementById('modalTitle');
    const milestoneForm = document.getElementById('milestoneForm');
    const milestoneId = document.getElementById('milestoneId');
    const deliverableInput = document.getElementById('deliverable');
    const deadlineInput = document.getElementById('deadline');
    const paymentInput = document.getElementById('payment');
    const percentageInput = document.getElementById('percentage');
    const saveBtn = document.getElementById('saveBtn');

    // Delete Modal Elements (unchanged)
    const deleteModal = document.getElementById('deleteModal');
    const deleteId = document.getElementById('deleteId');

    // Buttons (unchanged)
    const addMilestoneBtn = document.getElementById('addMilestoneBtn');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const closeDeleteModal = document.getElementById('closeDeleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    // Render all milestones (unchanged)
    function renderMilestones() {
        milestonesContainer.innerHTML = '';

        milestones.forEach(milestone => {
            const milestoneCard = createMilestoneCard(milestone);
            milestonesContainer.appendChild(milestoneCard);
        });

        updateProgressBars();
    }

    // Create a milestone card element
    function createMilestoneCard(milestone) {
        const card = document.createElement('div');
        card.className = `milestone-card ${milestone.status}`;

        // Status icon based on milestone status
        let statusIcon;
        if (milestone.status === 'completed') {
            statusIcon = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
            `;
        } else if (milestone.status === 'in-progress') {
            statusIcon = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                </svg>
            `;
        } else {
            statusIcon = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 8v4l3 3"></path>
                </svg>
            `;
        }

        // Status badge text (unchanged)
        let statusBadgeText;
        if (milestone.status === 'completed') {
            statusBadgeText = 'Completed';
        } else if (milestone.status === 'in-progress') {
            statusBadgeText = 'In Progress';
        } else {
            statusBadgeText = 'Not Started';
        }

        // Payment or paid badge (unchanged)
        let paymentElement;
        if (milestone.paid) {
            paymentElement = `<span class="payment-badge">Paid</span>`;
        } else {
            paymentElement = `
                <button class="pay-button" ${milestone.status !== 'completed' ? 'disabled' : ''} data-id="${milestone.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                        <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg> Pay Now
                </button>
            `;
        }

        card.innerHTML = `
            <div class="milestone-content">
                <div class="milestone-info">
                    <h3 class="milestone-title">
                        ${statusIcon}
                        ${milestone.deliverable}
                    </h3>
                    <div class="milestone-deadline">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>${milestone.deadline}</span>
                    </div>
                </div>

                <div class="milestone-status">
                    <div class="status-label">
                        <span>Status:</span>
                        <span class="status-badge ${milestone.status}">${statusBadgeText}</span>
                    </div>
                    <select class="status-select" data-id="${milestone.id}">
                        <option value="not-started" ${milestone.status === 'not-started' ? 'selected' : ''}>Not Started</option>
                        <option value="in-progress" ${milestone.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                        <option value="completed" ${milestone.status === 'completed' ? 'selected' : ''}>Completed</option>
                    </select>
                </div>

                <div class="milestone-payment">
                    <div class="payment-amount">
                        ₹${milestone.payment.toLocaleString('en-IN')}
                        <span class="payment-percentage">(${milestone.percentage}%)</span>
                    </div>
                    ${paymentElement}
                </div>
            </div>

            <div class="milestone-footer">
                <button class="action-button edit-button" data-id="${milestone.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg> Edit
                </button>
                <button class="action-button delete-button" data-id="${milestone.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg> Delete
                </button>
            </div>
        `;

        // Add event listeners to the card buttons (unchanged)
        setTimeout(() => {
            const statusSelect = card.querySelector('.status-select');
            statusSelect.addEventListener('change', function () {
                updateMilestoneStatus(this.dataset.id, this.value);
            });

            const payButton = card.querySelector('.pay-button');
            if (payButton) {
                payButton.addEventListener('click', function () {
                    payMilestone(this.dataset.id);
                });
            }

            const editButton = card.querySelector('.edit-button');
            editButton.addEventListener('click', function () {
                openEditModal(this.dataset.id);
            });

            const deleteButton = card.querySelector('.delete-button');
            deleteButton.addEventListener('click', function () {
                openDeleteModal(this.dataset.id);
            });
        }, 0);

        return card;
    }

    // Rest of the code remains unchanged
    function updateProgressBars() {
        const totalPercentage = milestones.reduce((sum, m) => sum + m.percentage, 0);
        const completedPercentage = milestones
            .filter(m => m.status === 'completed')
            .reduce((sum, m) => sum + m.percentage, 0);

        const completionPercent = totalPercentage > 0 ? (completedPercentage / totalPercentage) * 100 : 0;

        const totalPayment = milestones.reduce((sum, m) => sum + m.payment, 0);
        const paidAmount = milestones
            .filter(m => m.paid)
            .reduce((sum, m) => sum + m.payment, 0);

        const paymentPercent = totalPayment > 0 ? (paidAmount / totalPayment) * 100 : 0;

        completionProgressBar.style.width = `${completionPercent}%`;
        completionPercentage.textContent = `${Math.round(completionPercent)}%`;

        paymentProgressBar.style.width = `${paymentPercent}%`;
        paymentProgress.textContent = `₹${paidAmount.toLocaleString('en-IN')} of ₹${totalPayment.toLocaleString('en-IN')} (${Math.round(paymentPercent)}%)`;
    }

    function updateMilestoneStatus(id, status) {
        const milestone = milestones.find(m => m.id === id);
        if (milestone) {
            milestone.status = status;
            renderMilestones();
        }
    }

    function payMilestone(id) {
        const milestone = milestones.find(m => m.id === id);
        if (milestone && milestone.status === 'completed') {
            milestone.paid = true;
            renderMilestones();
        }
    }

    function openAddModal() {
        modalTitle.textContent = 'Add New Milestone';
        saveBtn.textContent = 'Add Milestone';
        milestoneId.value = '';
        milestoneForm.reset();
        milestoneModal.style.display = 'flex';
    }

    function openEditModal(id) {
        const milestone = milestones.find(m => m.id === id);
        if (milestone) {
            modalTitle.textContent = 'Edit Milestone';
            saveBtn.textContent = 'Save Changes';
            milestoneId.value = milestone.id;
            deliverableInput.value = milestone.deliverable;
            deadlineInput.value = milestone.deadline;
            paymentInput.value = milestone.payment;
            percentageInput.value = milestone.percentage;
            milestoneModal.style.display = 'flex';
        }
    }

    function openDeleteModal(id) {
        deleteId.value = id;
        deleteModal.style.display = 'flex';
    }

    function closeMilestoneModal() {
        milestoneModal.style.display = 'none';
    }

    function closeDeleteConfirmModal() {
        deleteModal.style.display = 'none';
    }

    function saveMilestone(e) {
        e.preventDefault();

        const id = milestoneId.value;
        const deliverable = deliverableInput.value.trim();
        const deadline = deadlineInput.value.trim();
        const payment = parseFloat(paymentInput.value) || 0;
        const percentage = parseFloat(percentageInput.value) || 0;

        if (!deliverable || !deadline || payment <= 0 || percentage <= 0) {
            alert('Please fill out all fields correctly');
            return;
        }

        if (id) {
            const index = milestones.findIndex(m => m.id === id);
            if (index !== -1) {
                milestones[index] = {
                    ...milestones[index],
                    deliverable,
                    deadline,
                    payment,
                    percentage
                };
            }
        } else {
            const newMilestone = {
                id: Date.now().toString(),
                deliverable,
                deadline,
                payment,
                percentage,
                status: 'not-started',
                paid: false
            };
            milestones.push(newMilestone);
        }

        renderMilestones();
        closeMilestoneModal();
    }

    function deleteMilestone() {
        const id = deleteId.value;
        milestones = milestones.filter(m => m.id !== id);
        renderMilestones();
        closeDeleteConfirmModal();
    }

    addMilestoneBtn.addEventListener('click', openAddModal);
    closeModal.addEventListener('click', closeMilestoneModal);
    cancelBtn.addEventListener('click', closeMilestoneModal);
    milestoneForm.addEventListener('submit', saveMilestone);

    closeDeleteModal.addEventListener('click', closeDeleteConfirmModal);
    cancelDeleteBtn.addEventListener('click', closeDeleteConfirmModal);
    confirmDeleteBtn.addEventListener('click', deleteMilestone);

    renderMilestones();
});