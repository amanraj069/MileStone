// Modal control functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Job edit functionality
document.getElementById('editJobBtn').addEventListener('click', function () {
    openModal('editJobModal');
});

document.getElementById('closeEditJobModal').addEventListener('click', function () {
    closeModal('editJobModal');
});

document.getElementById('cancelEditJob').addEventListener('click', function () {
    closeModal('editJobModal');
});

document.getElementById('saveEditJob').addEventListener('click', function () {
    // Get updated values
    const title = document.getElementById('jobTitleInput').value;
    const company = document.getElementById('companyNameInput').value;
    const location = document.getElementById('locationInput').value;
    const jobType = document.getElementById('jobTypeInput').value;
    const salary = document.getElementById('salaryInput').value;
    const deadline = new Date(document.getElementById('deadlineInput').value);

    // Format deadline
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDeadline = deadline.toLocaleDateString('en-US', options);

    // Update DOM elements
    document.querySelector('.job-title').textContent = title;
    document.querySelector('.company-name').textContent = company;
    document.querySelector('.meta-item:nth-child(1) span').textContent = location;
    document.querySelector('.meta-item:nth-child(2) span').textContent = jobType;
    document.querySelector('.meta-item:nth-child(3) span').textContent = salary;
    document.querySelector('.deadline').textContent = `Application Deadline: ${formattedDeadline}`;

    closeModal('editJobModal');
});

// Delete job functionality
document.querySelector('.delete-button').addEventListener('click', function () {
    if (confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
        // alert('Job posting deleted successfully!');
        window.location.href = 'job_listing.html';
    }
});

// Description edit functionality
document.getElementById('editDescriptionBtn').addEventListener('click', function () {
    openModal('editDescriptionModal');
});

document.getElementById('closeEditDescriptionModal').addEventListener('click', function () {
    closeModal('editDescriptionModal');
});

document.getElementById('cancelEditDescription').addEventListener('click', function () {
    closeModal('editDescriptionModal');
});

document.getElementById('saveEditDescription').addEventListener('click', function () {
    // Get updated description and skills
    const description = document.getElementById('descriptionTextarea').value;
    const skills = document.getElementById('skillsInput').value.split(',').map(skill => skill.trim());

    // Format description for HTML display
    const formattedDescription = description.replace(/\n\n/g, '<br><br>')
        .replace(/Responsibilities:/g, '<strong>Responsibilities:</strong>')
        .replace(/Requirements:/g, '<strong>Requirements:</strong>');

    // Update description text
    const descriptionTextDiv = document.querySelector('.description-text');
    // Clear existing content except for skills section
    descriptionTextDiv.innerHTML = '';

    // Add formatted description
    const descriptionParagraph = document.createElement('div');
    descriptionParagraph.innerHTML = formattedDescription.replace(/- /g, '• ');
    descriptionTextDiv.appendChild(descriptionParagraph);

    // Recreate skills tags
    const skillsTags = document.createElement('div');
    skillsTags.className = 'skills-tags';
    skills.forEach(skill => {
        const span = document.createElement('span');
        span.className = 'skill-tag';
        span.textContent = skill;
        skillsTags.appendChild(span);
    });

    // Recreate skills section
    const newSkillsSection = document.createElement('div');
    newSkillsSection.className = 'skills-required';
    const skillsTitle = document.createElement('div');
    skillsTitle.className = 'skills-title';
    skillsTitle.textContent = 'Technical Skills:';
    newSkillsSection.appendChild(skillsTitle);
    newSkillsSection.appendChild(skillsTags);

    // Add skills section back to description
    descriptionTextDiv.appendChild(newSkillsSection);

    closeModal('editDescriptionModal');
});

// Milestone functionality
document.getElementById('addMilestoneBtn').addEventListener('click', function () {
    openModal('addMilestoneModal');
});

document.getElementById('closeAddMilestoneModal').addEventListener('click', function () {
    closeModal('addMilestoneModal');
});

document.getElementById('cancelAddMilestone').addEventListener('click', function () {
    closeModal('addMilestoneModal');
});

document.getElementById('saveAddMilestone').addEventListener('click', function () {
    // Get milestone data
    const deliverable = document.getElementById('deliverableInput').value;
    const deadline = document.getElementById('milestoneDeadlineInput').value;
    const payment = document.getElementById('paymentInput').value;

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

// Edit milestone modal control
document.getElementById('closeEditMilestoneModal').addEventListener('click', function () {
    closeModal('editMilestoneModal');
});

document.getElementById('cancelEditMilestone').addEventListener('click', function () {
    closeModal('editMilestoneModal');
});

document.getElementById('saveEditMilestone').addEventListener('click', function () {
    const index = document.getElementById('editMilestoneIndex').value;
    const deliverable = document.getElementById('editDeliverableInput').value;
    const deadline = document.getElementById('editMilestoneDeadlineInput').value;
    const payment = document.getElementById('editPaymentInput').value;

    const rows = document.getElementById('milestones-tbody').querySelectorAll('tr');
    if (index >= 0 && index < rows.length) {
        const row = rows[index];
        row.cells[0].textContent = deliverable;
        row.cells[1].textContent = deadline;
        row.cells[2].textContent = payment;
    }

    closeModal('editMilestoneModal');
});

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