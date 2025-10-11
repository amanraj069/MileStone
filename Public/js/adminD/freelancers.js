// Enhanced Freelancers Management JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Initialize tooltips
  initializeTooltips();

  // Add real-time search functionality
  setupRealTimeSearch();

  // Add smooth animations
  addScrollAnimations();
});

function validateSearch() {
  const searchInput = document.getElementById("searchInput").value.trim();
  if (searchInput.length < 1) {
    showNotification("Please enter a search term", "warning");
    return false;
  }
  return true;
}

async function deleteFreelancer(userId) {
  // Create confirmation modal
  const isConfirmed = await showConfirmationModal(
    "Delete Freelancer",
    "Are you sure you want to delete this freelancer? This action cannot be undone.",
    "Delete",
    "Cancel"
  );

  if (!isConfirmed) return;

  try {
    showLoadingSpinner("Deleting freelancer...");

    const response = await fetch(`/adminD/freelancers/${userId}`, {
      method: "DELETE",
    });

    const result = await response.json();

    hideLoadingSpinner();

    if (response.ok) {
      showNotification(
        result.message || "Freelancer deleted successfully",
        "success"
      );
      // Fade out the user card with animation
      const userCard = document.querySelector(`[data-user-id="${userId}"]`);
      if (userCard) {
        userCard.style.transform = "scale(0.95)";
        userCard.style.opacity = "0";
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } else {
        setTimeout(() => window.location.reload(), 1000);
      }
    } else {
      showNotification(
        result.message || "Failed to delete freelancer",
        "error"
      );
    }
  } catch (error) {
    hideLoadingSpinner();
    console.error("Error deleting freelancer:", error);
    showNotification("Server error occurred", "error");
  }
}

function editRating(userId, currentRating, userType) {
  // Create rating modal
  createRatingModal(userId, currentRating, userType);
}

function createRatingModal(userId, currentRating, userType) {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-content rating-modal">
      <div class="modal-header">
        <h3>Edit ${
          userType.charAt(0).toUpperCase() + userType.slice(1)
        } Rating</h3>
        <button class="close-btn" onclick="closeModal(this)">&times;</button>
      </div>
      <div class="modal-body">
        <div class="rating-input-container">
          <label for="rating-input">Rating (1-5):</label>
          <div class="rating-stars-input">
            ${[1, 2, 3, 4, 5]
              .map(
                (star) => `
              <span class="rating-star ${
                star <= Math.floor(currentRating) ? "active" : ""
              }" 
                    data-rating="${star}" onclick="selectRating(${star})">
                <i class="fas fa-star"></i>
              </span>
            `
              )
              .join("")}
          </div>
          <input type="number" id="rating-input" min="1" max="5" step="0.1" 
                 value="${currentRating}" class="rating-number-input">
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" onclick="closeModal(this)">Cancel</button>
        <button class="btn-primary" onclick="updateRating('${userId}', '${userType}')">
          Update Rating
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Add event listeners for star rating
  const stars = modal.querySelectorAll(".rating-star");
  const numberInput = modal.querySelector("#rating-input");

  stars.forEach((star) => {
    star.addEventListener("mouseover", function () {
      const rating = parseInt(this.dataset.rating);
      highlightStars(rating, stars);
    });
  });

  modal.addEventListener("mouseleave", function () {
    const currentRating = parseFloat(numberInput.value);
    highlightStars(currentRating, stars);
  });

  numberInput.addEventListener("input", function () {
    const rating = parseFloat(this.value);
    if (rating >= 1 && rating <= 5) {
      highlightStars(rating, stars);
    }
  });

  // Show modal with animation
  requestAnimationFrame(() => {
    modal.classList.add("show");
  });
}

function selectRating(rating) {
  const numberInput = document.getElementById("rating-input");
  numberInput.value = rating;

  const stars = document.querySelectorAll(".rating-star");
  highlightStars(rating, stars);
}

function highlightStars(rating, stars) {
  stars.forEach((star, index) => {
    const starRating = index + 1;
    if (starRating <= rating) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
  });
}

async function updateRating(userId, userType) {
  const ratingInput = document.getElementById("rating-input");
  const rating = parseFloat(ratingInput.value);

  if (isNaN(rating) || rating < 1 || rating > 5) {
    showNotification("Please enter a valid rating between 1 and 5", "warning");
    return;
  }

  try {
    showLoadingSpinner("Updating rating...");

    const endpoint =
      userType === "freelancer"
        ? `/adminD/freelancers/${userId}/rating`
        : `/adminD/employers/${userId}/rating`;

    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating }),
    });

    const result = await response.json();

    hideLoadingSpinner();

    if (response.ok) {
      showNotification(
        result.message || "Rating updated successfully",
        "success"
      );
      closeModal(document.querySelector(".modal-overlay"));
      setTimeout(() => window.location.reload(), 1000);
    } else {
      showNotification(
        result.message || `Failed to update ${userType} rating`,
        "error"
      );
    }
  } catch (error) {
    hideLoadingSpinner();
    console.error(`Error updating ${userType} rating:`, error);
    showNotification("Server error occurred", "error");
  }
}

function closeModal(element) {
  const modal = element.closest(".modal-overlay");
  if (modal) {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.remove();
    }, 300);
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

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 300);
  }, 5000);
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

// Real-time search functionality
function setupRealTimeSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  let searchTimeout;

  searchInput.addEventListener("input", function () {
    clearTimeout(searchTimeout);
    const query = this.value.trim();

    if (query.length === 0) {
      // Show all cards
      document.querySelectorAll(".user-card").forEach((card) => {
        card.style.display = "block";
      });
      return;
    }

    searchTimeout = setTimeout(() => {
      filterFreelancers(query);
    }, 300);
  });
}

function filterFreelancers(query) {
  const userCards = document.querySelectorAll(".user-card");
  const lowerQuery = query.toLowerCase();

  userCards.forEach((card) => {
    const name =
      card.querySelector(".user-name")?.textContent.toLowerCase() || "";
    const title =
      card.querySelector(".user-title")?.textContent.toLowerCase() || "";
    const location =
      card.querySelector(".user-location")?.textContent.toLowerCase() || "";
    const skills = Array.from(card.querySelectorAll(".skill-tag"))
      .map((tag) => tag.textContent.toLowerCase())
      .join(" ");

    const searchableText = `${name} ${title} ${location} ${skills}`;

    if (searchableText.includes(lowerQuery)) {
      card.style.display = "block";
      card.style.animation = "fadeIn 0.3s ease-in";
    } else {
      card.style.display = "none";
    }
  });
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

  // Observe user cards
  document.querySelectorAll(".user-card").forEach((card) => {
    observer.observe(card);
  });
}

// Add CSS animations styles
const style = document.createElement("style");
style.textContent = `
  .user-card {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
  }
  
  .user-card.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
