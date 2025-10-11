document.addEventListener("DOMContentLoaded", function () {
  // Placeholder for future interactivity (e.g., chat or delete actions)
  const chatButtons = document.querySelectorAll(".btn-primary");
  const deleteButtons = document.querySelectorAll(".btn-danger");

  chatButtons.forEach((button) => {
    button.addEventListener("click", function () {
      console.log("Chat button clicked"); // Replace with actual chat logic
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      alert("Delete button clicked"); // Replace with actual delete logic
    });
  });

  // Search functionality
  document.addEventListener("DOMContentLoaded", function () {
    // Initialize search functionality
    initializeSearch();

    // Add loading animations
    addLoadingAnimations();

    // Initialize real-time filtering
    initializeRealTimeSearch();
  });

  // Initialize search functionality with validation
  function initializeSearch() {
    const searchForm = document.querySelector(".search-form");
    const searchInput = document.getElementById("searchInput");

    if (searchForm) {
      searchForm.addEventListener("submit", function (event) {
        if (!validateSearch()) {
          event.preventDefault();
        }
      });
    }

    // Add search input focus effects
    if (searchInput) {
      searchInput.addEventListener("focus", function () {
        this.parentElement.style.boxShadow =
          "0 4px 15px rgba(37, 99, 235, 0.2)";
      });

      searchInput.addEventListener("blur", function () {
        this.parentElement.style.boxShadow = "none";
      });
    }
  }

  // Enhanced search validation
  function validateSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchTerm = searchInput.value.trim();

    if (searchTerm.length < 1) {
      showNotification("Please enter a search term", "error");
      searchInput.focus();
      return false;
    }

    if (searchTerm.length > 100) {
      showNotification("Search term is too long", "error");
      return false;
    }

    return true;
  }

  // Initialize real-time search filtering
  function initializeRealTimeSearch() {
    const searchInput = document.getElementById("searchInput");
    const userCards = document.querySelectorAll(".user-card");

    if (searchInput && userCards.length > 0) {
      let searchTimeout;

      searchInput.addEventListener("input", function () {
        clearTimeout(searchTimeout);
        const searchTerm = this.value.toLowerCase().trim();

        searchTimeout = setTimeout(() => {
          filterCards(searchTerm, userCards);
        }, 300);
      });
    }
  }

  // Filter user cards based on search term
  function filterCards(searchTerm, cards) {
    let visibleCount = 0;

    cards.forEach((card, index) => {
      const cardText = card.textContent.toLowerCase();
      const shouldShow = searchTerm === "" || cardText.includes(searchTerm);

      if (shouldShow) {
        visibleCount++;
        setTimeout(() => {
          card.style.display = "block";
          card.style.opacity = "0";
          card.style.transform = "translateY(20px)";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 50);
        }, index * 50);
      } else {
        card.style.opacity = "0";
        card.style.transform = "translateY(-20px)";
        setTimeout(() => {
          card.style.display = "none";
        }, 300);
      }
    });

    // Update results message
    updateResultsMessage(visibleCount, searchTerm);
  }

  // Update results message
  function updateResultsMessage(count, searchTerm) {
    let messageElement = document.querySelector(".search-results-message");

    if (!messageElement) {
      messageElement = document.createElement("div");
      messageElement.className = "search-results-message";
      messageElement.style.cssText = `
            margin: 20px 0;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 8px;
            color: #666;
            font-size: 14px;
            text-align: center;
        `;
      document
        .querySelector(".content-card")
        .insertBefore(messageElement, document.querySelector(".user-list"));
    }

    if (searchTerm) {
      messageElement.textContent = `Found ${count} employer${
        count !== 1 ? "s" : ""
      } matching "${searchTerm}"`;
      messageElement.style.display = "block";
    } else {
      messageElement.style.display = "none";
    }
  }

  // Add loading animations to cards
  function addLoadingAnimations() {
    const userCards = document.querySelectorAll(".user-card");

    userCards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      card.style.transition = "all 0.6s ease";

      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 100);
    });

    // Add intersection observer for lazy loading
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    });

    userCards.forEach((card) => observer.observe(card));
  }

  // Enhanced chat initialization
  function initChat(userId) {
    console.log("Initiating chat with userId:", userId);

    if (!userId || userId === "default") {
      showNotification("Unable to start chat: Invalid user ID", "error");
      return;
    }

    showNotification("Opening chat...", "info");

    // Add loading state to chat button
    const chatButtons = document.querySelectorAll(`[onclick*="${userId}"]`);
    chatButtons.forEach((button) => {
      if (button.textContent.includes("Chat")) {
        const originalContent = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening...';
        button.disabled = true;

        setTimeout(() => {
          window.location.href = `/chat/${userId}`;
        }, 500);
      }
    });
  }

  // Enhanced delete employer function with better UX
  async function deleteEmployer(userId) {
    const modal = createDeleteModal(userId);
    document.body.appendChild(modal);

    return new Promise((resolve) => {
      const confirmBtn = modal.querySelector(".confirm-delete");
      const cancelBtn = modal.querySelector(".cancel-delete");

      confirmBtn.addEventListener("click", async () => {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Deleting...';

        try {
          const response = await fetch(`/adminD/employers/${userId}`, {
            method: "DELETE",
          });
          const result = await response.json();

          if (response.ok) {
            showNotification(
              result.message || "Employer deleted successfully!",
              "success"
            );
            modal.remove();

            // Remove the card with animation
            const userCard = document
              .querySelector(`[onclick*="${userId}"]`)
              .closest(".user-card");
            if (userCard) {
              userCard.style.transform = "scale(0.9)";
              userCard.style.opacity = "0";
              setTimeout(() => {
                userCard.remove();
                updateStatsAfterDelete();
              }, 300);
            }

            setTimeout(() => location.reload(), 1500);
          } else {
            showNotification(
              result.message || "Failed to delete employer",
              "error"
            );
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
          }
        } catch (error) {
          console.error("Error deleting employer:", error);
          showNotification("Server error occurred", "error");
          confirmBtn.disabled = false;
          confirmBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
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

  // Enhanced edit rating function
  function editRating(userId, currentRating, userType) {
    const modal = createRatingModal(userId, currentRating, userType);
    document.body.appendChild(modal);

    const ratingStars = modal.querySelectorAll(".rating-star");
    const ratingValue = modal.querySelector(".rating-value");
    const submitBtn = modal.querySelector(".submit-rating");
    const cancelBtn = modal.querySelector(".cancel-rating");
    let selectedRating = parseFloat(currentRating);

    // Initialize star display
    updateStarDisplay(ratingStars, selectedRating);
    ratingValue.textContent = selectedRating.toFixed(1);

    // Add star click handlers
    ratingStars.forEach((star, index) => {
      const rating = index + 1;

      star.addEventListener("click", () => {
        selectedRating = rating;
        updateStarDisplay(ratingStars, selectedRating);
        ratingValue.textContent = selectedRating.toFixed(1);
      });

      star.addEventListener("mouseenter", () => {
        updateStarDisplay(ratingStars, rating, true);
      });

      star.addEventListener("mouseleave", () => {
        updateStarDisplay(ratingStars, selectedRating);
      });
    });

    submitBtn.addEventListener("click", () => {
      updateRating(userId, selectedRating, userType, modal);
    });

    cancelBtn.addEventListener("click", () => {
      modal.remove();
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  // Update star display
  function updateStarDisplay(stars, rating, isHover = false) {
    stars.forEach((star, index) => {
      const starNumber = index + 1;
      const icon = star.querySelector("i");

      if (starNumber <= rating) {
        icon.className = "fas fa-star";
        star.style.color = isHover ? "#f59e0b" : "#fbbf24";
      } else {
        icon.className = "far fa-star";
        star.style.color = "#d1d5db";
      }
    });
  }

  // Enhanced update rating function
  async function updateRating(userId, rating, userType, modal) {
    const submitBtn = modal.querySelector(".submit-rating");

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';

    try {
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

      if (response.ok) {
        showNotification(
          result.message || "Rating updated successfully!",
          "success"
        );
        modal.remove();

        // Update the rating display in the card
        updateCardRating(userId, rating);

        setTimeout(() => location.reload(), 1500);
      } else {
        showNotification(
          result.message || `Failed to update ${userType} rating`,
          "error"
        );
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-star"></i> Update Rating';
      }
    } catch (error) {
      console.error(`Error updating ${userType} rating:`, error);
      showNotification("Server error occurred", "error");
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-star"></i> Update Rating';
    }
  }

  // Update card rating display
  function updateCardRating(userId, newRating) {
    const userCard = document
      .querySelector(`[onclick*="${userId}"]`)
      .closest(".user-card");
    if (userCard) {
      const ratingElement = userCard.querySelector(".rating-value");
      const ratingStars = userCard.querySelectorAll(".rating-stars i");

      if (ratingElement) {
        ratingElement.textContent = newRating.toFixed(1);
      }

      // Update star display
      ratingStars.forEach((star, index) => {
        const starNumber = index + 1;
        if (starNumber <= Math.floor(newRating)) {
          star.className = "fas fa-star";
        } else if (starNumber === Math.ceil(newRating) && newRating % 1 !== 0) {
          star.className = "fas fa-star-half-alt";
        } else {
          star.className = "far fa-star";
        }
      });
    }
  }

  // Update stats after deletion
  function updateStatsAfterDelete() {
    const totalStat = document.querySelector(".stat-number");
    if (totalStat) {
      const currentTotal = parseInt(totalStat.textContent);
      totalStat.textContent = Math.max(0, currentTotal - 1);
    }
  }

  // Helper function to create delete modal
  function createDeleteModal(userId) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-exclamation-triangle"></i> Confirm Deletion</h3>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to delete this employer account?</p>
                <p><strong>This action cannot be undone.</strong></p>
                <div class="warning-box">
                    <i class="fas fa-info-circle"></i>
                    <span>All associated job postings and data will also be removed.</span>
                </div>
            </div>
            <div class="modal-footer">
                <button class="cancel-delete btn-secondary">Cancel</button>
                <button class="confirm-delete btn-danger"><i class="fas fa-trash"></i> Delete Account</button>
            </div>
        </div>
    `;

    addModalStyles();
    return modal;
  }

  // Helper function to create rating modal
  function createRatingModal(userId, currentRating, userType) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-star"></i> Edit ${userType} Rating</h3>
            </div>
            <div class="modal-body">
                <p>Click on the stars to set a new rating:</p>
                <div class="rating-selector">
                    <div class="rating-stars-interactive">
                        ${[1, 2, 3, 4, 5]
                          .map(
                            (i) => `
                            <span class="rating-star" data-rating="${i}">
                                <i class="far fa-star"></i>
                            </span>
                        `
                          )
                          .join("")}
                    </div>
                    <div class="rating-display">
                        Rating: <span class="rating-value">${currentRating}</span>/5
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="cancel-rating btn-secondary">Cancel</button>
                <button class="submit-rating btn-primary"><i class="fas fa-star"></i> Update Rating</button>
            </div>
        </div>
    `;

    addModalStyles();
    addRatingModalStyles();
    return modal;
  }

  // Add rating modal specific styles
  function addRatingModalStyles() {
    if (document.getElementById("rating-modal-styles")) return;

    const styles = document.createElement("style");
    styles.id = "rating-modal-styles";
    styles.textContent = `
        .rating-selector {
            text-align: center;
            margin: 20px 0;
        }
        
        .rating-stars-interactive {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-bottom: 15px;
        }
        
        .rating-star {
            font-size: 24px;
            cursor: pointer;
            transition: all 0.3s ease;
            color: #d1d5db;
        }
        
        .rating-star:hover {
            transform: scale(1.2);
        }
        
        .rating-display {
            font-size: 18px;
            font-weight: 600;
            color: #333;
        }
        
        .rating-value {
            color: #2563eb;
        }
        
        .warning-box {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 12px;
            margin-top: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: #92400e;
        }
    `;
    document.head.appendChild(styles);
  }

  // Add modal styles (reuse from complaints.js)
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

  // Show notification function (reuse from complaints.js)
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
  const userCards = document.querySelectorAll(".user-card");
  const searchForm = document.querySelector(".search-bar form");

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    userCards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  });
});
