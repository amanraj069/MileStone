document.addEventListener("DOMContentLoaded", function () {
  // Initialize filter functionality
  initializeFilters();

  // Search functionality with modern approach
  const searchInput = document.querySelector(".search-input");
  const searchForm = document.querySelector(".search-form");

  if (searchForm) {
    searchForm.addEventListener("submit", function (event) {
      // Allow form submission to go through for server-side search
    });
  }

  if (searchInput) {
    // Add real-time search with debouncing
    let searchTimeout;
    searchInput.addEventListener("input", function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const searchTerm = this.value.toLowerCase();
        const visibleCards = document.querySelectorAll(
          '.complaint-card:not([style*="display: none"])'
        );

        visibleCards.forEach((card) => {
          const text = card.textContent.toLowerCase();
          if (text.includes(searchTerm) || searchTerm === "") {
            card.style.display = "block";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          } else {
            card.style.opacity = "0";
            card.style.transform = "translateY(-10px)";
            setTimeout(() => {
              if (card.style.opacity === "0") {
                card.style.display = "none";
              }
            }, 300);
          }
        });
      }, 300);
    });
  }

  // Add smooth animations to complaint cards
  const complaintsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  });

  document.querySelectorAll(".complaint-card").forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "all 0.5s ease";
    complaintsObserver.observe(card);
  });
});

// Initialize filter functionality
function initializeFilters() {
  const currentTab = document.querySelector(
    '.filter-tab[data-filter="current"]'
  );
  const pastTab = document.querySelector('.filter-tab[data-filter="past"]');

  // Set initial state - show current complaints by default
  filterComplaints("current");
}

// Enhanced filter complaints function with animations
function filterComplaints(filterType) {
  const complaintsCards = document.querySelectorAll(".complaint-card");
  const currentTab = document.querySelector(
    '.filter-tab[data-filter="current"]'
  );
  const dismissedTab = document.querySelector(
    '.filter-tab[data-filter="dismissed"]'
  );
  const pastTab = document.querySelector('.filter-tab[data-filter="past"]');

  // Update tab active states with animation
  [currentTab, dismissedTab, pastTab].forEach((tab) => {
    tab.classList.remove("active");
    tab.style.transform = "scale(0.95)";
    setTimeout(() => {
      tab.style.transform = "scale(1)";
    }, 100);
  });

  const activeTab = document.querySelector(
    `.filter-tab[data-filter="${filterType}"]`
  );
  if (activeTab) {
    activeTab.classList.add("active");
  }

  // Filter cards with smooth animations
  complaintsCards.forEach((card, index) => {
    const status = card.getAttribute("data-status");
    let shouldShow = false;

    if (filterType === "current" && status === "pending") {
      shouldShow = true;
    } else if (filterType === "dismissed" && status === "dismissed") {
      shouldShow = true;
    } else if (filterType === "past" && status === "resolved") {
      shouldShow = true;
    }

    if (shouldShow) {
      setTimeout(() => {
        card.style.display = "block";
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 50);
      }, index * 100);
    } else {
      card.style.opacity = "0";
      card.style.transform = "translateY(-20px)";
      setTimeout(() => {
        card.style.display = "none";
      }, 300);
    }
  });
}

// Enhanced toggle actions with better UX
function toggleActions(button) {
  const actions = button.nextElementSibling; // .additional-actions div
  const icon = button.querySelector("i");

  if (actions.style.display === "block") {
    // Hide actions
    actions.style.opacity = "0";
    actions.style.transform = "translateY(-10px)";
    setTimeout(() => {
      actions.style.display = "none";
    }, 300);

    button.innerHTML = '<i class="fas fa-cog"></i> View Actions';
    button.style.background = "linear-gradient(45deg, #2563eb, #1e40af)";
  } else {
    // Show actions
    actions.style.display = "block";
    actions.style.opacity = "0";
    actions.style.transform = "translateY(-10px)";
    actions.style.transition = "all 0.3s ease";

    setTimeout(() => {
      actions.style.opacity = "1";
      actions.style.transform = "translateY(0)";
    }, 50);

    button.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Actions';
    button.style.background = "linear-gradient(45deg, #ef4444, #dc2626)";
  }
}

// Enhanced resolve complaint function with better UX
async function resolveComplaint(complaintId) {
  // Create a custom modal instead of prompt for better UX
  const modal = createResolutionModal();
  document.body.appendChild(modal);

  return new Promise((resolve) => {
    const submitBtn = modal.querySelector(".submit-resolution");
    const cancelBtn = modal.querySelector(".cancel-resolution");
    const textarea = modal.querySelector(".resolution-textarea");

    submitBtn.addEventListener("click", async () => {
      const resolution = textarea.value.trim();

      if (!resolution) {
        showNotification("Please enter a resolution note", "error");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Resolving...';

      try {
        const response = await fetch(
          `/adminD/complaints/${complaintId}/resolve`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ resolution }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          showNotification("Complaint resolved successfully!", "success");
          modal.remove();
          setTimeout(() => location.reload(), 1500);
        } else {
          showNotification(
            data.error || "Failed to resolve complaint",
            "error"
          );
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-check"></i> Resolve';
        }
      } catch (error) {
        console.error("Error resolving complaint:", error);
        showNotification(
          "An error occurred while resolving the complaint",
          "error"
        );
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Resolve';
      }
    });

    cancelBtn.addEventListener("click", () => {
      modal.remove();
    });

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  });
}

// Enhanced dismiss complaint function
async function dismissComplaint(complaintId) {
  const modal = createDismissModal();
  document.body.appendChild(modal);

  return new Promise((resolve) => {
    const submitBtn = modal.querySelector(".submit-dismiss");
    const cancelBtn = modal.querySelector(".cancel-dismiss");
    const textarea = modal.querySelector(".dismiss-textarea");

    submitBtn.addEventListener("click", async () => {
      const reason = textarea.value.trim() || "Complaint dismissed by admin";

      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Dismissing...';

      try {
        const response = await fetch(
          `/adminD/complaints/${complaintId}/dismiss`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ reason }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          showNotification("Complaint dismissed successfully!", "success");
          modal.remove();
          setTimeout(() => location.reload(), 1500);
        } else {
          showNotification(
            data.error || "Failed to dismiss complaint",
            "error"
          );
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-times"></i> Dismiss';
        }
      } catch (error) {
        console.error("Error dismissing complaint:", error);
        showNotification(
          "An error occurred while dismissing the complaint",
          "error"
        );
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-times"></i> Dismiss';
      }
    });

    cancelBtn.addEventListener("click", () => {
      modal.remove();
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  });
}

// Enhanced contact user function
function contactUser(userId, userName) {
  showNotification(`Opening chat with ${userName}...`, "info");
  const chatUrl = `/chat/${userId}`;
  window.location.href = chatUrl;
}

// Enhanced change rating function
function changeRating(userId, userName) {
  showNotification(
    `Rating management for ${userName} is being developed. This feature will be available soon.`,
    "info"
  );
}

// Helper function to create resolution modal
function createResolutionModal() {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-check-circle"></i> Resolve Complaint</h3>
            </div>
            <div class="modal-body">
                <label for="resolution">Resolution Notes:</label>
                <textarea class="resolution-textarea" placeholder="Describe how this complaint was resolved..." rows="4"></textarea>
            </div>
            <div class="modal-footer">
                <button class="cancel-resolution btn-secondary">Cancel</button>
                <button class="submit-resolution btn-primary"><i class="fas fa-check"></i> Resolve</button>
            </div>
        </div>
    `;

  // Add modal styles
  addModalStyles();
  return modal;
}

// Helper function to create dismiss modal
function createDismissModal() {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-times-circle"></i> Dismiss Complaint</h3>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to dismiss this complaint? This action cannot be undone.</p>
                <label for="dismiss-reason">Reason for dismissal (optional):</label>
                <textarea class="dismiss-textarea" placeholder="Enter reason for dismissing this complaint..." rows="3"></textarea>
            </div>
            <div class="modal-footer">
                <button class="cancel-dismiss btn-secondary">Cancel</button>
                <button class="submit-dismiss btn-danger"><i class="fas fa-times"></i> Dismiss</button>
            </div>
        </div>
    `;

  addModalStyles();
  return modal;
}

// Helper function to add modal styles
function addModalStyles() {
  if (document.getElementById("modal-styles")) return;

  const styles = document.createElement("style");
  styles.id = "modal-styles";
  styles.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            background: white;
            border-radius: 12px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
        }
        
        .modal-header {
            padding: 20px;
            border-bottom: 1px solid #e1e5e9;
        }
        
        .modal-header h3 {
            margin: 0;
            color: #333;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .modal-body label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #333;
        }
        
        .modal-body textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-family: inherit;
            font-size: 14px;
            resize: vertical;
            transition: border-color 0.3s ease;
        }
        
        .modal-body textarea:focus {
            outline: none;
            border-color: #2563eb;
        }
        
        .modal-body p {
            margin-bottom: 15px;
            color: #666;
        }
        
        .modal-footer {
            padding: 20px;
            border-top: 1px solid #e1e5e9;
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }
        
        .modal-footer button {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .btn-primary {
            background: linear-gradient(45deg, #2563eb, #1e40af);
            color: white;
        }
        
        .btn-secondary {
            background: #f1f5f9;
            color: #64748b;
        }
        
        .btn-danger {
            background: linear-gradient(45deg, #ef4444, #dc2626);
            color: white;
        }
        
        .btn-primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
        }
        
        .btn-secondary:hover {
            background: #e2e8f0;
            color: #475569;
        }
        
        .btn-danger:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
  document.head.appendChild(styles);
}

// Helper function to show notifications
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <i class="fas fa-${
          type === "success"
            ? "check-circle"
            : type === "error"
            ? "exclamation-circle"
            : "info-circle"
        }"></i>
        <span>${message}</span>
    `;

  // Add notification styles if not already added
  if (!document.getElementById("notification-styles")) {
    const styles = document.createElement("style");
    styles.id = "notification-styles";
    styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10001;
                display: flex;
                align-items: center;
                gap: 10px;
                animation: slideInRight 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            
            .notification-success {
                background: linear-gradient(45deg, #10b981, #059669);
            }
            
            .notification-error {
                background: linear-gradient(45deg, #ef4444, #dc2626);
            }
            
            .notification-info {
                background: linear-gradient(45deg, #2563eb, #1e40af);
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
    document.head.appendChild(styles);
  }

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    notification.style.opacity = "0";
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}
