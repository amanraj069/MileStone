document.addEventListener('DOMContentLoaded', function () {
    // Initial milestone
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

    // DOM Elements
    const milestonesContainer = document.getElementById('milestonesContainer');
    const completionProgressBar = document.getElementById('completionProgressBar');
    const completionPercentage = document.getElementById('completionPercentage');
    const paymentProgressBar = document.getElementById('paymentProgressBar');
    const paymentProgress = document.getElementById('paymentProgress');

    // Modal Elements
    const milestoneModal = document.getElementById('milestoneModal');
    const modalTitle = document.getElementById('modalTitle');
    const milestoneForm = document.getElementById('milestoneForm');
    const milestoneId = document.getElementById('milestoneId');
    const deliverableInput = document.getElementById('deliverable');
    const deadlineInput = document.getElementById('deadline');
    const paymentInput = document.getElementById('payment');
    const percentageInput = document.getElementById('percentage');
    const saveBtn = document.getElementById('saveBtn');

    // Delete Modal Elements
    const deleteModal = document.getElementById('deleteModal');
    const deleteId = document.getElementById('deleteId');

    // Buttons
    const addMilestoneBtn = document.getElementById('addMilestoneBtn');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const closeDeleteModal = document.getElementById('closeDeleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    // Render all milestones
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
            statusIcon = '<i class="fas fa-check-circle"></i>';
        } else if (milestone.status === 'in-progress') {
            statusIcon = '<i class="fas fa-clock"></i>';
        } else {
            statusIcon = '<i class="fas fa-circle-exclamation"></i>';
        }

        // Status badge text
        let statusBadgeText;
        if (milestone.status === 'completed') {
            statusBadgeText = 'Completed';
        } else if (milestone.status === 'in-progress') {
            statusBadgeText = 'In Progress';
        } else {
            statusBadgeText = 'Not Started';
        }

        // Payment or paid badge
        let paymentElement;
        if (milestone.paid) {
            paymentElement = `<span class="payment-badge">Paid</span>`;
        } else {
            paymentElement = `
                <button class="pay-button" ${milestone.status !== 'completed' ? 'disabled' : ''} data-id="${milestone.id}">
                    <i class="fas fa-credit-card"></i> Pay Now
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
                        <i class="fas fa-calendar"></i>
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
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-button delete-button" data-id="${milestone.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;

        // Add event listeners to the card buttons
        setTimeout(() => {
            // Status select change
            const statusSelect = card.querySelector('.status-select');
            statusSelect.addEventListener('change', function () {
                updateMilestoneStatus(this.dataset.id, this.value);
            });

            // Pay button
            const payButton = card.querySelector('.pay-button');
            if (payButton) {
                payButton.addEventListener('click', function () {
                    payMilestone(this.dataset.id);
                });
            }

            // Edit button
            const editButton = card.querySelector('.edit-button');
            editButton.addEventListener('click', function () {
                openEditModal(this.dataset.id);
            });

            // Delete button
            const deleteButton = card.querySelector('.delete-button');
            deleteButton.addEventListener('click', function () {
                openDeleteModal(this.dataset.id);
            });
        }, 0);

        return card;
    }

    // Update progress bars
    function updateProgressBars() {
        // Calculate completion percentage
        const totalPercentage = milestones.reduce((sum, m) => sum + m.percentage, 0);
        const completedPercentage = milestones
            .filter(m => m.status === 'completed')
            .reduce((sum, m) => sum + m.percentage, 0);

        const completionPercent = totalPercentage > 0 ? (completedPercentage / totalPercentage) * 100 : 0;

        // Calculate payment progress
        const totalPayment = milestones.reduce((sum, m) => sum + m.payment, 0);
        const paidAmount = milestones
            .filter(m => m.paid)
            .reduce((sum, m) => sum + m.payment, 0);

        const paymentPercent = totalPayment > 0 ? (paidAmount / totalPayment) * 100 : 0;

        // Update DOM elements
        completionProgressBar.style.width = `${completionPercent}%`;
        completionPercentage.textContent = `${Math.round(completionPercent)}%`;

        paymentProgressBar.style.width = `${paymentPercent}%`;
        paymentProgress.textContent = `₹${paidAmount.toLocaleString('en-IN')} of ₹${totalPayment.toLocaleString('en-IN')} (${Math.round(paymentPercent)}%)`;
    }

    // Update milestone status
    function updateMilestoneStatus(id, status) {
        const milestone = milestones.find(m => m.id === id);
        if (milestone) {
            milestone.status = status;
            renderMilestones();
        }
    }

    // Pay milestone
    function payMilestone(id) {
        const milestone = milestones.find(m => m.id === id);
        if (milestone && milestone.status === 'completed') {
            milestone.paid = true;
            renderMilestones();
        }
    }

    // Open add milestone modal
    function openAddModal() {
        modalTitle.textContent = 'Add New Milestone';
        saveBtn.textContent = 'Add Milestone';
        milestoneId.value = '';
        milestoneForm.reset();
        milestoneModal.style.display = 'flex';
    }

    // Open edit milestone modal
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

    // Open delete confirmation modal
    function openDeleteModal(id) {
        deleteId.value = id;
        deleteModal.style.display = 'flex';
    }

    // Close milestone modal
    function closeMilestoneModal() {
        milestoneModal.style.display = 'none';
    }

    // Close delete modal
    function closeDeleteConfirmModal() {
        deleteModal.style.display = 'none';
    }

    // Save milestone (add or edit)
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
            // Edit existing milestone
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
            // Add new milestone
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

    // Delete milestone
    function deleteMilestone() {
        const id = deleteId.value;
        milestones = milestones.filter(m => m.id !== id);
        renderMilestones();
        closeDeleteConfirmModal();
    }

    // Event Listeners
    addMilestoneBtn.addEventListener('click', openAddModal);
    closeModal.addEventListener('click', closeMilestoneModal);
    cancelBtn.addEventListener('click', closeMilestoneModal);
    milestoneForm.addEventListener('submit', saveMilestone);

    closeDeleteModal.addEventListener('click', closeDeleteConfirmModal);
    cancelDeleteBtn.addEventListener('click', closeDeleteConfirmModal);
    confirmDeleteBtn.addEventListener('click', deleteMilestone);

    // Initial render
    renderMilestones();
});