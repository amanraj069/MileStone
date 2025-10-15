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
          ></textarea>
        </div>
      </div>
      
      <div class="form-grid two-col">
        <div class="form-group">
          <label class="required">Deadline</label>
          <input 
            type="date" 
            name="milestones[${milestoneCount}][deadline]" 
          />
        </div>
        <div class="form-group">
          <label class="required">Payment Amount (₹)</label>
          <input 
            type="number" 
            name="milestones[${milestoneCount}][payment]" 
            placeholder="Amount for this milestone"
            step="0.01" 
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

  // Add real-time validation to the new milestone fields
  addMilestoneValidation(milestoneCount);
  
  // Check subtask requirement for this milestone
  checkSubtaskRequirement(milestoneCount);
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

  // Add real-time validation to the new subtask field
  addSubtaskValidation(milestoneId, subtaskCounts[milestoneId]);
  
  // Check subtask requirement for this milestone
  checkSubtaskRequirement(milestoneId);
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
      
      // Check subtask requirement after removal
      checkSubtaskRequirement(milestoneId);
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

// DOM-based Form Validation
function validateForm() {
  let isValid = true;
  
  // Clear all previous errors
  clearAllFieldErrors();

  // Validate required fields with DOM
  const title = document.getElementById("title");
  const category = document.getElementById("category");
  const imageUrl = document.getElementById("imageUrl");
  const description = document.getElementById("description");
  const budget = document.getElementById("budget");
  const jobType = document.getElementById("jobType");
  const experienceLevel = document.getElementById("experienceLevel");
  const applicationDeadline = document.getElementById("deadline");
  const responsibilities = document.getElementById("responsibilities");
  const skills = document.getElementById("skills");

  // Validate each field and show error below it
  if (!title.value.trim()) {
    showFieldError(title, "Job title is required");
    isValid = false;
  }

  if (!category.value) {
    showFieldError(category, "Please select a category");
    isValid = false;
  }

  if (!imageUrl.value.trim()) {
    showFieldError(imageUrl, "Company logo URL is required");
  }

  if (!description.value.trim()) {
    showFieldError(description, "Job description is required");
    isValid = false;
  }

  const budgetValue = parseFloat(budget.value) || 0;
  if (budgetValue < 500) {
    showFieldError(budget, "Budget must be at least ₹500");
    isValid = false;
  }

  if (!jobType.value) {
    showFieldError(jobType, "Please select job type");
    isValid = false;
  }

  if (!experienceLevel.value) {
    showFieldError(experienceLevel, "Please select experience level");
    isValid = false;
  }

  if (!applicationDeadline.value) {
    showFieldError(applicationDeadline, "Application deadline is required");
    isValid = false;
  }

  if (!responsibilities.value.trim()) {
    showFieldError(responsibilities, "Job responsibilities are required");
    isValid = false;
  }

  if (!skills.value.trim()) {
    showFieldError(skills, "Required skills are required");
    isValid = false;
  }

  // Check milestones
  if (milestoneCount === 0) {
    const milestonesSection = document.getElementById("milestones");
    showFieldError(milestonesSection, "Please add at least one milestone");
    isValid = false;
  }

  // Check subtask requirements for each milestone
  const milestones = document.querySelectorAll('.milestone-item');
  milestones.forEach((milestone, index) => {
    if (milestone.id) {
      const milestoneId = milestone.id.split('-')[1];
      if (milestoneId) {
        const subtasks = milestone.querySelectorAll('.subtask-item');
        if (subtasks.length === 0) {
          const subtasksSection = milestone.querySelector('.subtasks-section');
          if (subtasksSection) {
            showFieldError(subtasksSection, "At least one subtask is required for this milestone");
            isValid = false;
          }
        }
      }
    }
  });

  // Check milestone vs budget
  const milestonePayments = Array.from(
    document.querySelectorAll('input[name$="[payment]"]')
  ).reduce((sum, input) => sum + (parseFloat(input.value) || 0), 0);

  if (milestoneCount > 0 && Math.abs(budgetValue - milestonePayments) > 1) {
    const milestonesSection = document.getElementById("milestones");
    showFieldError(milestonesSection, `Milestone payments (₹${milestonePayments.toLocaleString()}) should match budget (₹${budgetValue.toLocaleString()})`);
    isValid = false;
  }

  return isValid;
}

// Clear all field errors
function clearAllFieldErrors() {
  const allErrorMessages = document.querySelectorAll('.field-validation-message');
  allErrorMessages.forEach(msg => msg.remove());
  
  // Reset border colors
  const allInputs = document.querySelectorAll('input, select, textarea');
  allInputs.forEach(input => {
    input.style.borderColor = '';
  });
}

// Loading state management
function setLoadingState(button, isLoading) {
  if (isLoading) {
    button.disabled = true;
  } else {
    button.disabled = false;
    button.innerHTML = 'Create Job';
    button.classList.remove('loading');
  }
}

// Success message (without scrolling)
function showSuccess(message) {
  // Create success message at top of form without scrolling
  const form = document.getElementById('jobForm');
  const existingSuccess = form.querySelector('.success-message-container');
  
  if (existingSuccess) {
    existingSuccess.remove();
  }
  
  const successContainer = document.createElement('div');
  successContainer.className = 'success-message-container';
  successContainer.innerHTML = `
    <div class="alert alert-success">
      <i class="fas fa-check-circle"></i>
      ${message}
    </div>
  `;
  
  form.insertBefore(successContainer, form.firstChild);
}

// Server error message (without scrolling)
function showServerError(message) {
  const form = document.getElementById('jobForm');
  const existingError = form.querySelector('.server-error-container');
  
  if (existingError) {
    existingError.remove();
  }
  
  const errorContainer = document.createElement('div');
  errorContainer.className = 'server-error-container';
  errorContainer.innerHTML = `
    <div class="alert alert-error">
      <i class="fas fa-exclamation-triangle"></i>
      ${message}
    </div>
  `;
  
  form.insertBefore(errorContainer, form.firstChild);
}

// Clear existing success/error messages
function clearExistingMessages() {
  const form = document.getElementById('jobForm');
  const existingSuccess = form.querySelector('.success-message-container');
  const existingError = form.querySelector('.server-error-container');
  
  if (existingSuccess) {
    existingSuccess.remove();
  }
  if (existingError) {
    existingError.remove();
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Add milestone button
  document
    .getElementById("addMilestoneBtn")
    .addEventListener("click", addMilestone);

  // Form submission with AJAX
  document.getElementById("jobForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return false;
    }

    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    // Convert FormData to URLSearchParams for proper form encoding
    const urlEncodedData = new URLSearchParams();
    for (let [key, value] of formData.entries()) {
      urlEncodedData.append(key, value);
    }

    // Debug: Log form data to see what's being sent
    console.log('Form data being sent:');
    for (let [key, value] of urlEncodedData.entries()) {
      console.log(key, value);
    }

    try {
      // Show loading state
      setLoadingState(submitButton, true);
      
      // Clear any existing error messages
      clearExistingMessages();

      // Send AJAX request with URL-encoded data
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: urlEncodedData
      });

      const result = await response.json();

      if (response.ok) {
        // Success
        showSuccess("Job created successfully! Redirecting...");
        setTimeout(() => {
          window.location.href = result.redirectUrl || '/employerD/job_listings';
        }, 1500);
      } else {
        // Server error - show as general message
        showServerError(result.error || 'Failed to create job. Please try again.');
        setLoadingState(submitButton, false);
      }
    } catch (error) {
      console.error('Job creation error:', error);
      showServerError('Network error. Please check your connection and try again.');
      setLoadingState(submitButton, false);
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

  // Add basic real-time validation
  addRealTimeValidation();
  
  // Check subtask requirements for existing milestones
  const existingMilestones = document.querySelectorAll('.milestone-item');
  existingMilestones.forEach((milestone) => {
    if (milestone.id) {
      const milestoneId = milestone.id.split('-')[1];
      if (milestoneId) {
        checkSubtaskRequirement(milestoneId);
      }
    }
  });
});

// Real-time validation for better UX
function addRealTimeValidation() {
  // Title validation
  const titleInput = document.getElementById('title');
  if (titleInput) {
    titleInput.addEventListener('input', () => {
      const value = titleInput.value.trim();
      if (value.length > 0 && value.length < 3) {
        showFieldError(titleInput, 'Title must be at least 3 characters long');
      } else {
        clearFieldValidation(titleInput);
      }
    });
  }

  // Category validation
  const categoryInput = document.getElementById('category');
  if (categoryInput) {
    categoryInput.addEventListener('change', () => {
      clearFieldValidation(categoryInput);
    });
  }

  // Image URL validation
  const imageUrlInput = document.getElementById('imageUrl');
  if (imageUrlInput) {
    imageUrlInput.addEventListener('input', () => {
      const value = imageUrlInput.value.trim();
      if (value) {
        try {
          new URL(value);
          clearFieldValidation(imageUrlInput);
        } catch (e) {
          showFieldError(imageUrlInput, 'Please enter a valid URL (e.g., https://example.com/logo.png)');
        }
      } else {
        clearFieldValidation(imageUrlInput);
      }
    });
  }

  // Description validation
  const descriptionInput = document.getElementById('description');
  if (descriptionInput) {
    descriptionInput.addEventListener('input', () => {
      const value = descriptionInput.value.trim();
      if (value.length > 0 && value.length < 10) {
        showFieldError(descriptionInput, 'Description must be at least 10 characters long');
      } else {
        clearFieldValidation(descriptionInput);
      }
    });
  }

  // Budget validation
  const budgetInput = document.getElementById('budget');
  if (budgetInput) {
    budgetInput.addEventListener('input', () => {
      const value = parseFloat(budgetInput.value);
      if (budgetInput.value.trim() && (isNaN(value) || value < 500)) {
        showFieldError(budgetInput, 'Budget must be at least ₹500');
      } else {
        clearFieldValidation(budgetInput);
      }
    });
  }

  // Location validation
  const locationInput = document.getElementById('location');
  if (locationInput) {
    locationInput.addEventListener('input', () => {
      const value = locationInput.value.trim();
      if (value.length > 0 && value.length < 2) {
        showFieldError(locationInput, 'Location must be at least 2 characters long');
      } else {
        clearFieldValidation(locationInput);
      }
    });
  }

  // Job Type validation
  const jobTypeInput = document.getElementById('jobType');
  if (jobTypeInput) {
    jobTypeInput.addEventListener('change', () => {
      clearFieldValidation(jobTypeInput);
    });
  }

  // Experience Level validation
  const experienceLevelInput = document.getElementById('experienceLevel');
  if (experienceLevelInput) {
    experienceLevelInput.addEventListener('change', () => {
      clearFieldValidation(experienceLevelInput);
    });
  }

  // Application Deadline validation
  const deadlineInput = document.getElementById('deadline');
  if (deadlineInput) {
    deadlineInput.addEventListener('change', () => {
      const value = deadlineInput.value;
      if (value) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          showFieldError(deadlineInput, 'Deadline cannot be in the past');
        } else {
          clearFieldValidation(deadlineInput);
        }
      } else {
        clearFieldValidation(deadlineInput);
      }
    });
  }

  // Responsibilities validation
  const responsibilitiesInput = document.getElementById('responsibilities');
  if (responsibilitiesInput) {
    responsibilitiesInput.addEventListener('input', () => {
      const value = responsibilitiesInput.value.trim();
      if (value.length > 0 && value.length < 10) {
        showFieldError(responsibilitiesInput, 'Responsibilities must be at least 10 characters long');
      } else {
        clearFieldValidation(responsibilitiesInput);
      }
    });
  }

  // Skills validation
  const skillsInput = document.getElementById('skills');
  if (skillsInput) {
    skillsInput.addEventListener('input', () => {
      const value = skillsInput.value.trim();
      if (value.length > 0 && value.length < 10) {
        showFieldError(skillsInput, 'Skills must be at least 10 characters long');
      } else {
        clearFieldValidation(skillsInput);
      }
    });
  }
}

// Add real-time validation to milestone fields
function addMilestoneValidation(milestoneId) {
  const milestone = document.getElementById(`milestone-${milestoneId}`);
  if (!milestone) return; // Safety check
  
  // Description validation
  const descriptionField = milestone.querySelector('textarea[name$="[description]"]');
  if (descriptionField) {
    descriptionField.addEventListener('input', () => {
      const value = descriptionField.value.trim();
      if (value.length > 0 && value.length < 10) {
        showFieldError(descriptionField, 'Description must be at least 10 characters long');
      } else {
        clearFieldValidation(descriptionField);
      }
    });
  }

  // Deadline validation
  const deadlineField = milestone.querySelector('input[name$="[deadline]"]');
  if (deadlineField) {
    deadlineField.addEventListener('change', () => {
      const value = deadlineField.value;
      if (value) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          showFieldError(deadlineField, 'Deadline cannot be in the past');
        } else {
          clearFieldValidation(deadlineField);
        }
      } else {
        clearFieldValidation(deadlineField);
      }
    });
  }

  // Payment validation
  const paymentField = milestone.querySelector('input[name$="[payment]"]');
  if (paymentField) {
    paymentField.addEventListener('input', () => {
      const value = parseFloat(paymentField.value);
      if (paymentField.value.trim() && (isNaN(value) || value <= 0)) {
        showFieldError(paymentField, 'Payment must be a positive number');
      } else {
        clearFieldValidation(paymentField);
      }
    });
  }
}

// Add real-time validation to subtask fields
function addSubtaskValidation(milestoneId, subtaskId) {
  const subtask = document.getElementById(`subtask-${milestoneId}-${subtaskId}`);
  if (!subtask) return; // Safety check
  
  // Description validation
  const descriptionField = subtask.querySelector('input[name$="[description]"]');
  if (descriptionField) {
    descriptionField.addEventListener('input', () => {
      const value = descriptionField.value.trim();
      if (value.length > 0 && value.length < 3) {
        showFieldError(descriptionField, 'Subtask description must be at least 3 characters long');
      } else {
        clearFieldValidation(descriptionField);
      }
    });
  }
}

// Check if milestone has at least one subtask
function checkSubtaskRequirement(milestoneId) {
  const container = document.getElementById(`subtasks-${milestoneId}`);
  if (!container) return; // Safety check
  
  const subtasks = container.querySelectorAll('.subtask-item');
  
  // Remove existing requirement message
  const existingRequirement = container.querySelector('.subtask-requirement-message');
  if (existingRequirement) {
    existingRequirement.remove();
  }
  
  if (subtasks.length === 0) {
    // Show requirement message
    const requirementMessage = document.createElement('div');
    requirementMessage.className = 'subtask-requirement-message';
    requirementMessage.style.cssText = 'color: #f59e0b; font-size: 12px; margin-top: 8px; font-weight: 500; display: flex; align-items: center; background: #fef3c7; padding: 8px 12px; border-radius: 4px; border: 1px solid #fbbf24;';
    requirementMessage.innerHTML = `<i class="fas fa-exclamation-triangle" style="margin-right: 6px;"></i> At least one subtask is required for this milestone`;
    
    // Insert at the beginning of the container
    container.insertBefore(requirementMessage, container.firstChild);
  }
}

// Field-level validation helpers
function showFieldError(field, message) {
  field.style.borderColor = '#dc2626';
  field.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
  
  // Remove existing validation message for this field
  const existingMessage = field.parentNode.querySelector('.field-validation-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Add error message directly below the field
  const errorMessage = document.createElement('div');
  errorMessage.className = 'field-validation-message error-message';
  errorMessage.style.cssText = 'color: #dc2626; font-size: 12px; margin-top: 4px; font-weight: 500; display: flex; align-items: center;';
  errorMessage.innerHTML = `<i class="fas fa-exclamation-circle" style="margin-right: 6px;"></i> ${message}`;
  
  // Insert after the field
  field.parentNode.appendChild(errorMessage);
}

function showFieldSuccess(field, message) {
  field.style.borderColor = '#10b981';
  field.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
  
  // Remove existing validation message for this field
  const existingMessage = field.parentNode.querySelector('.field-validation-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Add success message directly below the field
  const successMessage = document.createElement('div');
  successMessage.className = 'field-validation-message success-message';
  successMessage.style.cssText = 'color: #10b981; font-size: 12px; margin-top: 4px; font-weight: 500; display: flex; align-items: center;';
  successMessage.innerHTML = `<i class="fas fa-check-circle" style="margin-right: 6px;"></i> ${message}`;
  
  // Insert after the field
  field.parentNode.appendChild(successMessage);
}

function clearFieldValidation(field) {
  field.style.borderColor = '';
  field.style.boxShadow = '';
  
  // Remove existing validation message
  const existingMessage = field.parentNode.querySelector('.field-validation-message');
  if (existingMessage) {
    existingMessage.remove();
  }
}