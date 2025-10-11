document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.request-btn:not(:disabled)').forEach(button => {
    button.addEventListener('click', async () => {
      const jobId = button.dataset.jobId;
      const milestoneId = button.dataset.milestoneId;

      try {
        const response = await fetch(`/freelancerD/milestone/${jobId}/${milestoneId}/request`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to request milestone');
        }

        const data = await response.json();
        if (data.success) {
          const milestoneCard = button.closest('.milestone-card');
          milestoneCard.classList.remove('not-paid');
          milestoneCard.classList.add('requested');
          button.innerHTML = '<i class="fas fa-clock"></i> Payment Requested';
          button.disabled = true;
          button.classList.add('requested');
        }
      } catch (error) {
        console.error('Error requesting milestone:', error.message);
        alert('Failed to request milestone. Please try again.');
      }
    });
  });
});

// Sub-task management functions
async function updateSubTaskStatus(jobId, milestoneId, subTaskId, status, notes = '') {
  try {
    const response = await fetch(`/freelancerD/subtask/${jobId}/${milestoneId}/${subTaskId}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, notes })
    });

    if (!response.ok) {
      throw new Error('Failed to update sub-task');
    }

    const data = await response.json();
    if (data.success) {
      location.reload(); // Refresh to show updated progress
    }
  } catch (error) {
    console.error('Error updating sub-task:', error.message);
    alert('Failed to update sub-task. Please try again.');
  }
}

function toggleSubTask(jobId, milestoneId, subTaskId, currentStatus) {
  if (currentStatus === 'pending') {
    markInProgress(jobId, milestoneId, subTaskId);
  } else if (currentStatus === 'in-progress') {
    markCompleted(jobId, milestoneId, subTaskId);
  }
}

function markInProgress(jobId, milestoneId, subTaskId) {
  updateSubTaskStatus(jobId, milestoneId, subTaskId, 'in-progress');
}

function markCompleted(jobId, milestoneId, subTaskId) {
  const notes = prompt('Add any notes about this completed task (optional):');
  updateSubTaskStatus(jobId, milestoneId, subTaskId, 'completed', notes || '');
}