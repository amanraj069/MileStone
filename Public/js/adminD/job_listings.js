// Enhanced Job Listings Management JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Initialize components
  initializeFilters();
  setupRealTimeSearch();
  initializeTooltips();
  addScrollAnimations();
});

function initializeFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Get filter value
      const filter = this.getAttribute("data-filter");

      // Filter job cards
      filterJobCards(filter);

      // Add animation
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "scale(1)";
      }, 100);
    });
  });
}

function filterJobCards(filter) {
  const jobCards = document.querySelectorAll(".job-card");

  jobCards.forEach((card, index) => {
    const status = card.getAttribute("data-status") || "open";

    // Add slight delay to each card for staggered animation
    setTimeout(() => {
      if (filter === "all" || status === filter) {
        card.classList.remove("hidden");
        card.style.animation = "fadeIn 0.3s ease-in";
      } else {
        card.style.animation = "fadeOut 0.3s ease-out";
        setTimeout(() => {
          card.classList.add("hidden");
        }, 250);
      }
    }, index * 50);
  });

  // Update stats after filtering
  updateFilterStats(filter);
}

function updateFilterStats(filter) {
  const jobCards = document.querySelectorAll(".job-card");
  const visibleCards = Array.from(jobCards).filter((card) => {
    const status = card.getAttribute("data-status") || "open";
    return filter === "all" || status === filter;
  });

  // Show notification with count
  showNotification(
    `Showing ${visibleCards.length} job${visibleCards.length === 1 ? "" : "s"}`,
    "info"
  );
}

function setupRealTimeSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  let searchTimeout;

  searchInput.addEventListener("input", function () {
    clearTimeout(searchTimeout);
    const query = this.value.trim();

    if (query.length === 0) {
      // Show all cards
      document.querySelectorAll(".job-card").forEach((card) => {
        card.style.display = "grid";
        card.classList.remove("hidden");
      });
      return;
    }

    searchTimeout = setTimeout(() => {
      filterJobs(query);
    }, 300);
  });
}

function filterJobs(query) {
  const jobCards = document.querySelectorAll(".job-card");
  const lowerQuery = query.toLowerCase();
  let visibleCount = 0;

  jobCards.forEach((card) => {
    const title =
      card.querySelector(".job-title")?.textContent.toLowerCase() || "";
    const company =
      card.querySelector(".job-company")?.textContent.toLowerCase() || "";
    const location =
      card.querySelector(".job-detail-item")?.textContent.toLowerCase() || "";
    const skills = Array.from(card.querySelectorAll(".job-tag"))
      .map((tag) => tag.textContent.toLowerCase())
      .join(" ");

    const searchableText = `${title} ${company} ${location} ${skills}`;

    if (searchableText.includes(lowerQuery)) {
      card.style.display = "grid";
      card.classList.remove("hidden");
      card.style.animation = "fadeIn 0.3s ease-in";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  // Show search results notification
  showNotification(
    `Found ${visibleCount} job${
      visibleCount === 1 ? "" : "s"
    } matching "${query}"`,
    visibleCount > 0 ? "success" : "warning"
  );
}

async function deleteJob(jobId) {
  const isConfirmed = await showConfirmationModal(
    "Delete Job Listing",
    "Are you sure you want to delete this job listing? This action cannot be undone and will remove all associated applications.",
    "Delete Job",
    "Cancel"
  );

  if (!isConfirmed) return;

  try {
    showLoadingSpinner("Deleting job listing...");

    const response = await fetch(`/adminD/job_listings/${jobId}`, {
      method: "DELETE",
    });

    const result = await response.json();

    hideLoadingSpinner();

    if (response.ok) {
      showNotification(
        result.message || "Job listing deleted successfully",
        "success"
      );

      // Find and animate out the job card
      const jobCard = document
        .querySelector(`[onclick*="${jobId}"]`)
        ?.closest(".job-card");
      if (jobCard) {
        jobCard.style.transform = "scale(0.95)";
        jobCard.style.opacity = "0";
        setTimeout(() => {
          jobCard.remove();
          updateJobStats();
        }, 300);
      } else {
        setTimeout(() => window.location.reload(), 1000);
      }
    } else {
      showNotification(
        result.message || "Failed to delete job listing",
        "error"
      );
    }
  } catch (error) {
    hideLoadingSpinner();
    console.error("Error deleting job:", error);
    showNotification("Server error occurred", "error");
  }
}

function updateJobStats() {
  const remainingJobs = document.querySelectorAll(
    ".job-card:not(.hidden)"
  ).length;
  const totalStat = document.querySelector(".stat-number");
  if (totalStat) {
    totalStat.textContent = remainingJobs;
  }
}

// Notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${getNotificationIcon(type)}"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;

  document.body.appendChild(notification);

  // Show notification with animation
  requestAnimationFrame(() => {
    notification.classList.add("show");
  });

  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 300);
  }, 4000);
}

function getNotificationIcon(type) {
  const icons = {
    success: "check-circle",
    error: "exclamation-circle",
    warning: "exclamation-triangle",
    info: "info-circle",
  };
  return icons[type] || "info-circle";
}

// Confirmation modal
function showConfirmationModal(title, message, confirmText, cancelText) {
  return new Promise((resolve) => {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-content confirmation-modal">
        <div class="modal-header">
          <h3>${title}</h3>
          <i class="fas fa-exclamation-triangle" style="color: #f59e0b; font-size: 1.5rem;"></i>
        </div>
        <div class="modal-body">
          <p>${message}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" onclick="resolveConfirmation(false)">${cancelText}</button>
          <button class="btn-danger" onclick="resolveConfirmation(true)">${confirmText}</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Show modal with animation
    requestAnimationFrame(() => {
      modal.classList.add("show");
    });

    // Store resolve function globally for button access
    window.resolveConfirmation = (result) => {
      modal.classList.remove("show");
      setTimeout(() => {
        modal.remove();
        delete window.resolveConfirmation;
      }, 300);
      resolve(result);
    };
  });
}

// Loading spinner
function showLoadingSpinner(message = "Loading...") {
  const spinner = document.createElement("div");
  spinner.id = "loading-spinner";
  spinner.className = "loading-overlay";
  spinner.innerHTML = `
    <div class="loading-content">
      <div class="spinner"></div>
      <p>${message}</p>
    </div>
  `;

  document.body.appendChild(spinner);
  requestAnimationFrame(() => {
    spinner.classList.add("show");
  });
}

function hideLoadingSpinner() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) {
    spinner.classList.remove("show");
    setTimeout(() => {
      spinner.remove();
    }, 300);
  }
}

// Tooltip initialization
function initializeTooltips() {
  const elements = document.querySelectorAll("[data-tooltip]");
  elements.forEach((element) => {
    element.addEventListener("mouseenter", showTooltip);
    element.addEventListener("mouseleave", hideTooltip);
  });
}

function showTooltip(event) {
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.textContent = event.target.dataset.tooltip;
  document.body.appendChild(tooltip);

  const rect = event.target.getBoundingClientRect();
  tooltip.style.left = rect.left + rect.width / 2 + "px";
  tooltip.style.top = rect.top - 10 + "px";

  requestAnimationFrame(() => {
    tooltip.classList.add("show");
  });
}

function hideTooltip() {
  const tooltips = document.querySelectorAll(".tooltip");
  tooltips.forEach((tooltip) => {
    tooltip.classList.remove("show");
    setTimeout(() => tooltip.remove(), 200);
  });
}

// Scroll animations
function addScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observe job cards
  document.querySelectorAll(".job-card").forEach((card) => {
    observer.observe(card);
  });
}

// Add dynamic CSS for animations
const style = document.createElement("style");
style.textContent = `
  .job-card {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
  }
  
  .job-card.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-10px); }
  }
  
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-left: 4px solid #2563eb;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    z-index: 10000;
    max-width: 400px;
  }
  
  .notification.show {
    opacity: 1;
    transform: translateX(0);
  }
  
  .notification.success { border-left-color: #10b981; }
  .notification.error { border-left-color: #ef4444; }
  .notification.warning { border-left-color: #f59e0b; }
  .notification.info { border-left-color: #2563eb; }
  
  .notification-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .notification-close {
    position: absolute;
    top: 5px;
    right: 5px;
    background: none;
    border: none;
    cursor: pointer;
    color: #6b7280;
    font-size: 0.8rem;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10001;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .modal-overlay.show {
    opacity: 1;
  }
  
  .modal-content {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    transform: scale(0.9);
    transition: transform 0.3s ease;
  }
  
  .modal-overlay.show .modal-content {
    transform: scale(1);
  }
  
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  
  .modal-footer {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
  }
  
  .btn-secondary {
    background: #6b7280;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .btn-secondary:hover {
    background: #4b5563;
  }
  
  .btn-danger {
    background: #ef4444;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .btn-danger:hover {
    background: #dc2626;
  }
  
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10002;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .loading-overlay.show {
    opacity: 1;
  }
  
  .loading-content {
    text-align: center;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e5e7eb;
    border-top: 3px solid #2563eb;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .tooltip {
    position: absolute;
    background: #1f2937;
    color: white;
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    white-space: nowrap;
    transform: translateX(-50%) translateY(-100%);
    opacity: 0;
    transition: opacity 0.2s ease;
    z-index: 10003;
    pointer-events: none;
  }
  
  .tooltip.show {
    opacity: 1;
  }
  
  .tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: #1f2937;
  }
`;
document.head.appendChild(style);
