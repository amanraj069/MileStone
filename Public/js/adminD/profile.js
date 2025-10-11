// Enhanced Admin Profile JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Initialize profile functionality
  initializeProfile();
  addProfileAnimations();
  setupStatsCounter();
});

function initializeProfile() {
  // Load profile data from localStorage if available
  loadProfileData();

  // Add hover effects to social links
  enhanceSocialLinks();

  // Add profile image error handling
  setupProfileImageHandling();

  // Initialize activity feed
  setupActivityFeed();
}

function loadProfileData() {
  const savedProfile = localStorage.getItem("adminProfile");

  if (savedProfile) {
    const profileData = JSON.parse(savedProfile);

    // Update basic info with animation
    updateElementText("nameDisplay", profileData.name);
    updateElementText("locationDisplay", profileData.location);
    updateElementText("emailDisplay", profileData.email);
    updateElementText("phoneDisplay", profileData.phone);
    updateElementText("subscriptionDisplay", profileData.subscription);
    updateElementText("roleDisplay", profileData.role);

    // Update profile image
    const profileImage = document.getElementById("profileImage");
    if (profileImage) {
      profileImage.src = profileData.picture;
      profileImage.onerror = () => {
        profileImage.src =
          "https://img.freepik.com/free-vector/business-user-shield_78370-7029.jpg?semt=ais_hybrid&w=740";
      };
    }

    // Update about content with formatting
    const aboutDisplay = document.getElementById("aboutDisplay");
    if (aboutDisplay && profileData.aboutMe) {
      aboutDisplay.innerHTML = "";
      const paragraphs = profileData.aboutMe.split("\n\n");
      paragraphs.forEach((paragraph, index) => {
        if (paragraph.trim()) {
          const p = document.createElement("p");
          p.textContent = paragraph;
          p.style.marginBottom = "1rem";
          aboutDisplay.appendChild(p);
        }
      });
    }

    // Update social media links with validation
    updateSocialLink("linkedinLink", profileData.socialMedia?.linkedin);
    updateSocialLink("twitterLink", profileData.socialMedia?.twitter);
    updateSocialLink("facebookLink", profileData.socialMedia?.facebook);
    updateSocialLink("instagramLink", profileData.socialMedia?.instagram);
  } else {
    // Set default image if no profile data
    const profileImage = document.getElementById("profileImage");
    if (profileImage) {
      profileImage.src =
        "https://img.freepik.com/free-vector/business-user-shield_78370-7029.jpg?semt=ais_hybrid&w=740";
    }
  }
}

function updateElementText(elementId, text) {
  const element = document.getElementById(elementId);
  if (element && text) {
    // Add typing animation effect
    const originalText = element.textContent;
    if (originalText !== text) {
      element.style.opacity = "0.5";
      setTimeout(() => {
        element.textContent = text;
        element.style.opacity = "1";
        element.style.transition = "opacity 0.3s ease";
      }, 150);
    }
  }
}

function updateSocialLink(elementId, url) {
  const element = document.getElementById(elementId);
  if (element && url && url !== "#") {
    element.href = url;
    element.style.opacity = "1";
    element.style.pointerEvents = "auto";
  } else if (element) {
    element.href = "#";
    element.style.opacity = "0.5";
    element.style.pointerEvents = "none";
    element.onclick = (e) => {
      e.preventDefault();
      showNotification("This social media link is not configured yet.", "info");
    };
  }
}

function enhanceSocialLinks() {
  const socialLinks = document.querySelectorAll(".social-link");

  socialLinks.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px) scale(1.02)";
    });

    link.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });

    link.addEventListener("click", function (e) {
      if (this.href === "#" || !this.href.includes("http")) {
        e.preventDefault();
        showNotification(
          "This social media profile is not configured.",
          "warning"
        );
      }
    });
  });
}

function setupProfileImageHandling() {
  const profileImage = document.getElementById("profileImage");

  if (profileImage) {
    profileImage.addEventListener("error", function () {
      this.src =
        "https://img.freepik.com/free-vector/business-user-shield_78370-7029.jpg?semt=ais_hybrid&w=740";
    });

    profileImage.addEventListener("load", function () {
      this.style.opacity = "1";
      this.style.transition = "opacity 0.3s ease";
    });
  }
}

function setupStatsCounter() {
  const statNumbers = document.querySelectorAll(".stat-number");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((stat) => {
    observer.observe(stat);
  });
}

function animateCounter(element) {
  const target = element.textContent;
  const isPercentage = target.includes("%");
  const numericValue = parseInt(target.replace(/\D/g, ""));

  if (isNaN(numericValue)) return;

  let current = 0;
  const increment = numericValue / 30; // Animation duration
  const timer = setInterval(() => {
    current += increment;
    if (current >= numericValue) {
      current = numericValue;
      clearInterval(timer);
    }

    const displayValue = Math.floor(current);
    element.textContent = isPercentage ? displayValue + "%" : displayValue;
  }, 50);
}

function setupActivityFeed() {
  const activityItems = document.querySelectorAll(".activity-item");

  activityItems.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateX(-20px)";

    setTimeout(() => {
      item.style.transition = "all 0.3s ease";
      item.style.opacity = "1";
      item.style.transform = "translateX(0)";
    }, index * 100);

    // Add hover effect
    item.addEventListener("mouseenter", function () {
      this.style.backgroundColor = "#f8fafc";
      this.style.borderRadius = "8px";
    });

    item.addEventListener("mouseleave", function () {
      this.style.backgroundColor = "transparent";
    });
  });
}

function addProfileAnimations() {
  // Animate cards on load
  const cards = document.querySelectorAll(
    ".stat-card, .profile-card, .info-card"
  );

  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";

    setTimeout(() => {
      card.style.transition = "all 0.5s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 150);
  });

  // Add online indicator animation
  const onlineIndicator = document.querySelector(".online-indicator");
  if (onlineIndicator) {
    setInterval(() => {
      onlineIndicator.style.transform = "scale(1.1)";
      setTimeout(() => {
        onlineIndicator.style.transform = "scale(1)";
      }, 200);
    }, 3000);
  }
}

// Enhanced edit profile functionality
function editProfile() {
  // Create edit modal
  const modal = createEditModal();
  document.body.appendChild(modal);

  // Show modal with animation
  requestAnimationFrame(() => {
    modal.classList.add("show");
  });
}

function createEditModal() {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
        <div class="modal-content edit-modal">
            <div class="modal-header">
                <h3><i class="fas fa-edit"></i> Edit Profile</h3>
                <button class="close-btn" onclick="closeModal(this)">&times;</button>
            </div>
            <div class="modal-body">
                <form id="editProfileForm">
                    <div class="form-group">
                        <label for="editName">Full Name</label>
                        <input type="text" id="editName" value="${
                          document.getElementById("nameDisplay").textContent
                        }">
                    </div>
                    <div class="form-group">
                        <label for="editEmail">Email</label>
                        <input type="email" id="editEmail" value="${
                          document.getElementById("emailDisplay").textContent
                        }">
                    </div>
                    <div class="form-group">
                        <label for="editPhone">Phone</label>
                        <input type="tel" id="editPhone" value="${
                          document.getElementById("phoneDisplay").textContent
                        }">
                    </div>
                    <div class="form-group">
                        <label for="editLocation">Location</label>
                        <input type="text" id="editLocation" value="${
                          document.getElementById("locationDisplay").textContent
                        }">
                    </div>
                    <div class="form-group">
                        <label for="editAbout">About Me</label>
                        <textarea id="editAbout" rows="4">${
                          document.getElementById("aboutDisplay").textContent
                        }</textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeModal(this)">Cancel</button>
                <button class="btn-primary" onclick="saveProfile()">Save Changes</button>
            </div>
        </div>
    `;

  return modal;
}

function saveProfile() {
  const formData = {
    name: document.getElementById("editName").value,
    email: document.getElementById("editEmail").value,
    phone: document.getElementById("editPhone").value,
    location: document.getElementById("editLocation").value,
    aboutMe: document.getElementById("editAbout").value,
  };

  // Save to localStorage
  localStorage.setItem("adminProfile", JSON.stringify(formData));

  // Update display
  loadProfileData();

  // Close modal
  closeModal(document.querySelector(".modal-overlay"));

  // Show success notification
  showNotification("Profile updated successfully!", "success");
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

// Add dynamic CSS for enhanced styling
const style = document.createElement("style");
style.textContent = `
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
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
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
        margin-bottom: 2rem;
        border-bottom: 2px solid #f3f4f6;
        padding-bottom: 1rem;
    }
    
    .modal-header h3 {
        color: #1f2937;
        font-size: 1.25rem;
        font-weight: 600;
    }
    
    .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #6b7280;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: all 0.3s ease;
    }
    
    .close-btn:hover {
        background: #f3f4f6;
        color: #ef4444;
    }
    
    .form-group {
        margin-bottom: 1.5rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #374151;
    }
    
    .form-group input,
    .form-group textarea {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
    }
    
    .form-group input:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
    
    .modal-footer {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
        border-top: 2px solid #f3f4f6;
        padding-top: 1rem;
    }
    
    .btn-primary,
    .btn-secondary {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        border: none;
        transition: all 0.3s ease;
    }
    
    .btn-primary {
        background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
        color: white;
    }
    
    .btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }
    
    .btn-secondary {
        background: #6b7280;
        color: white;
    }
    
    .btn-secondary:hover {
        background: #4b5563;
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
`;
document.head.appendChild(style);
