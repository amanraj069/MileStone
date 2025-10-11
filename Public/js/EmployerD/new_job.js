let milestoneCount = 0;
let subtaskCounts = {};

// Update progress indicator
function updateProgress() {
  const form = document.getElementById("jobForm");
  const formData = new FormData(form);

  // Check basic info completion
  const basicFields = [
    "title",
    "category",
    "imageUrl",
    "description",
    "budget[amount]",
    "jobType",
    "experienceLevel",
    "applicationDeadline",
  ];
  const basicComplete = basicFields.every((field) =>
    formData.get(field)?.trim()
  );

  // Check requirements completion
  const reqFields = ["responsibilities", "skills"];
  const reqComplete = reqFields.every((field) =>
    formData.get(field)?.trim()
  );

  // Check milestones
  const milestonesComplete = milestoneCount > 0;

  // Update step indicators
  updateStepStatus("step-1", basicComplete);
  updateStepStatus("step-2", reqComplete);
  updateStepStatus("step-3", milestonesComplete);
  updateStepStatus(
    "step-4",
    basicComplete && reqComplete && milestonesComplete
  );
}

function updateStepStatus(stepId, completed) {
  const step = document.getElementById(stepId);
  step.classList.toggle("completed", completed);
  step.classList.toggle("active", !completed);
}

// Add milestone function
function addMilestone() {
  milestoneCount++;
  const container = document.getElementById("milestones");
  const emptyState = document.getElementById("empty-state");

  if (emptyState) {
    emptyState.style.display = "none";
  }

  const milestoneHtml = `
    <div class="milestone-item" id="milestone-${milestoneCount}">
      <div class="milestone-header">
        <div class="milestone-number">${milestoneCount}</div>
        <button type="button" class="remove-milestone-btn" onclick="removeMilestone(${milestoneCount})">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="form-grid">
        <div class="form-group">
          <label class="required">Milestone Description</label>
          <textarea 
            name="milestones[${milestoneCount}][description]" 
            placeholder="Describe what should be delivered to achieve this milestone"
            required
          ></textarea>
        </div>
      </div>
      
      <div class="form-grid two-col">
        <div class="form-group">
          <label class="required">Deadline</label>
          <input 
            type="date" 
            name="milestones[${milestoneCount}][deadline]" 
            required 
          />
        </div>
        <div class="form-group">
          <label class="required">Payment Amount (₹)</label>
          <input 
            type="number" 
            name="milestones[${milestoneCount}][payment]" 
            placeholder="Amount for this milestone"
            min="100" 
            step="0.01" 
            required 
          />
        </div>
      </div>

      <div class="subtasks-section">
        <div class="subtasks-header">
          <label>Sub-tasks</label>
          <button type="button" class="add-subtask-btn" onclick="addSubTask(${milestoneCount})">
            <i class="fas fa-plus"></i>
            Add Sub-task
          </button>
        </div>
        <div class="subtasks-container" id="subtasks-${milestoneCount}">
          <div class="subtask-empty-state">
            <i class="fas fa-tasks"></i>
            <p>Break this milestone into smaller tasks</p>
          </div>
        </div>
      </div>
    </div>
  `;

  container.insertAdjacentHTML("beforeend", milestoneHtml);
  updateProgress();

  // Animate the new milestone
  const newMilestone = document.getElementById(
    `milestone-${milestoneCount}`
  );
  newMilestone.style.opacity = "0";
  newMilestone.style.transform = "translateY(20px)";
  setTimeout(() => {
    newMilestone.style.transition = "all 0.5s ease";
    newMilestone.style.opacity = "1";
    newMilestone.style.transform = "translateY(0)";
  }, 100);

  // Initialize subtask count for this milestone
  subtaskCounts[milestoneCount] = 0;
}

// Add sub-task function
function addSubTask(milestoneId) {
  if (!subtaskCounts[milestoneId]) {
    subtaskCounts[milestoneId] = 0;
  }
  subtaskCounts[milestoneId]++;
  
  const container = document.getElementById(`subtasks-${milestoneId}`);
  const emptyState = container.querySelector('.subtask-empty-state');
  
  if (emptyState) {
    emptyState.style.display = 'none';
  }

  const subtaskHtml = `
    <div class="subtask-item" id="subtask-${milestoneId}-${subtaskCounts[milestoneId]}">
      <div class="subtask-input-group">
        <input 
          type="text" 
          name="milestones[${milestoneId}][subTasks][${subtaskCounts[milestoneId]}][description]" 
          placeholder="e.g., Create responsive design"
          required 
        />
        <button type="button" class="remove-subtask-btn" onclick="removeSubTask(${milestoneId}, ${subtaskCounts[milestoneId]})">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', subtaskHtml);
  
  // Animate the new subtask
  const newSubtask = document.getElementById(`subtask-${milestoneId}-${subtaskCounts[milestoneId]}`);
  newSubtask.style.opacity = '0';
  newSubtask.style.transform = 'translateX(-20px)';
  setTimeout(() => {
    newSubtask.style.transition = 'all 0.3s ease';
    newSubtask.style.opacity = '1';
    newSubtask.style.transform = 'translateX(0)';
  }, 100);
}

// Remove sub-task function
function removeSubTask(milestoneId, subtaskId) {
  const subtask = document.getElementById(`subtask-${milestoneId}-${subtaskId}`);
  subtask.style.transition = 'all 0.3s ease';
  subtask.style.opacity = '0';
  subtask.style.transform = 'translateX(-100%)';

  setTimeout(() => {
    subtask.remove();
    
    // Check if this was the last subtask
    const container = document.getElementById(`subtasks-${milestoneId}`);
    const remainingSubtasks = container.querySelectorAll('.subtask-item');
    
    if (remainingSubtasks.length === 0) {
      const emptyState = container.querySelector('.subtask-empty-state');
      if (emptyState) {
        emptyState.style.display = 'block';
      }
    }
  }, 300);
}

// Remove milestone function
function removeMilestone(id) {
  const milestone = document.getElementById(`milestone-${id}`);
  milestone.style.transition = "all 0.3s ease";
  milestone.style.opacity = "0";
  milestone.style.transform = "translateX(-100%)";

  setTimeout(() => {
    milestone.remove();
    milestoneCount--;

    if (milestoneCount === 0) {
      document.getElementById("empty-state").style.display = "block";
    }

    // Renumber remaining milestones
    const remainingMilestones =
      document.querySelectorAll(".milestone-item");
    remainingMilestones.forEach((milestone, index) => {
      const newNumber = index + 1;
      milestone.querySelector(".milestone-number").textContent =
        newNumber;
      milestone.id = `milestone-${newNumber}`;

      // Update form field names
      const inputs = milestone.querySelectorAll("input, textarea");
      inputs.forEach((input) => {
        const name = input.name;
        if (name) {
          input.name = name.replace(/\[\d+\]/, `[${newNumber}]`);
        }
      });
    });

    milestoneCount = remainingMilestones.length;
    updateProgress();
  }, 300);
}

// Form validation and submission
function validateForm() {
  const form = document.getElementById("jobForm");
  const errorMessage = document.getElementById("errorMessage");

  // Check if total milestone payments match budget
  const budget = parseFloat(document.getElementById("budget").value) || 0;
  const milestonePayments = Array.from(
    document.querySelectorAll('input[name$="[payment]"]')
  ).reduce((sum, input) => sum + (parseFloat(input.value) || 0), 0);

  if (milestoneCount === 0) {
    errorMessage.textContent =
      "Please add at least one milestone to your project.";
    errorMessage.style.display = "block";
    return false;
  }

  if (Math.abs(budget - milestonePayments) > 1) {
    errorMessage.textContent = `Total milestone payments (₹${milestonePayments.toLocaleString()}) should equal the project budget (₹${budget.toLocaleString()}).`;
    errorMessage.style.display = "block";
    return false;
  }

  errorMessage.style.display = "none";
  return true;
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Add milestone button
  document
    .getElementById("addMilestoneBtn")
    .addEventListener("click", addMilestone);

  // Form submission
  document.getElementById("jobForm").addEventListener("submit", (e) => {
    if (!validateForm()) {
      e.preventDefault();
      return false;
    }
  });

  // Progress tracking
  const form = document.getElementById("jobForm");
  form.addEventListener("input", updateProgress);
  form.addEventListener("change", updateProgress);

  // Floating help
  document
    .querySelector(".floating-help")
    .addEventListener("click", () => {
      alert(
        "Need help creating your job listing?\n\n• Be specific about your requirements\n• Break your project into clear milestones\n• Set realistic deadlines and budgets\n• Include all necessary technical details"
      );
    });

  // Set minimum date to today
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split("T")[0];
  dateInputs.forEach((input) => {
    input.min = today;
  });
});