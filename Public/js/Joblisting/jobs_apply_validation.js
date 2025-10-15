document.addEventListener("DOMContentLoaded", function () {
  // Get form elements
  const form = document.getElementById("applicationForm");
  const coverMessageTextarea = document.getElementById("coverMessage");
  const resumeLinkInput = document.getElementById("resumeLink");
  const submitButton = document.getElementById("submitButton");

  // Get error message containers
  const coverMessageError = document.getElementById("coverMessageError");
  const resumeLinkError = document.getElementById("resumeLinkError");
  const coverMessageCount = document.getElementById("coverMessageCount");

  // Validation state
  let validationState = {
    coverMessage: false,
    resumeLink: false,
  };

  // Minimum character requirement for cover message
  const MIN_COVER_MESSAGE_LENGTH = 50;

  // Google Drive URL pattern
  const GOOGLE_DRIVE_PATTERN =
    /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+\/view\?usp=sharing$/;

  // Update character count and validate cover message
  function validateCoverMessage() {
    const text = coverMessageTextarea.value.trim();
    const length = text.length;

    // Update character count
    coverMessageCount.textContent = `${length}/${MIN_COVER_MESSAGE_LENGTH} minimum characters`;

    if (length === 0) {
      // Empty state
      coverMessageTextarea.classList.remove("error", "valid");
      coverMessageError.textContent = "";
      coverMessageError.classList.remove("show");
      coverMessageCount.classList.remove("error", "valid");
      validationState.coverMessage = false;
    } else if (length < MIN_COVER_MESSAGE_LENGTH) {
      // Too short
      coverMessageTextarea.classList.add("error");
      coverMessageTextarea.classList.remove("valid");
      coverMessageError.textContent = `Min ${MIN_COVER_MESSAGE_LENGTH} characters required`;
      coverMessageError.classList.add("show");
      coverMessageCount.classList.add("error");
      coverMessageCount.classList.remove("valid");
      validationState.coverMessage = false;
    } else {
      // Valid
      coverMessageTextarea.classList.remove("error");
      coverMessageTextarea.classList.add("valid");
      coverMessageError.textContent = "";
      coverMessageError.classList.remove("show");
      coverMessageCount.classList.remove("error");
      coverMessageCount.classList.add("valid");
      validationState.coverMessage = true;
    }

    updateSubmitButton();
  }

  // Validate resume link
  function validateResumeLink() {
    const url = resumeLinkInput.value.trim();

    if (url === "") {
      // Empty state
      resumeLinkInput.classList.remove("error", "valid");
      resumeLinkError.textContent = "";
      resumeLinkError.classList.remove("show");
      validationState.resumeLink = false;
    } else if (!isValidUrl(url)) {
      // Invalid URL format
      resumeLinkInput.classList.add("error");
      resumeLinkInput.classList.remove("valid");
      resumeLinkError.textContent = "Please enter a valid Google Drive URL";
      resumeLinkError.classList.add("show");
      validationState.resumeLink = false;
    } else if (!GOOGLE_DRIVE_PATTERN.test(url)) {
      // Not a Google Drive share link
      resumeLinkInput.classList.add("error");
      resumeLinkInput.classList.remove("valid");
      resumeLinkError.textContent = "Enter a valid Google Drive share link";
      resumeLinkError.classList.add("show");
      validationState.resumeLink = false;
    } else {
      // Valid Google Drive link
      resumeLinkInput.classList.remove("error");
      resumeLinkInput.classList.add("valid");
      resumeLinkError.textContent = "";
      resumeLinkError.classList.remove("show");
      validationState.resumeLink = true;
    }

    updateSubmitButton();
  }

  // Helper function to validate URL format
  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Update submit button state
  function updateSubmitButton() {
    const allValid = validationState.coverMessage && validationState.resumeLink;

    if (allValid) {
      submitButton.disabled = false;
      submitButton.style.opacity = "1";
      submitButton.style.cursor = "pointer";
    } else {
      submitButton.disabled = true;
      submitButton.style.opacity = "0.6";
      submitButton.style.cursor = "not-allowed";
    }
  }

  // Real-time validation events
  coverMessageTextarea.addEventListener("input", validateCoverMessage);
  coverMessageTextarea.addEventListener("blur", validateCoverMessage);

  resumeLinkInput.addEventListener("input", validateResumeLink);
  resumeLinkInput.addEventListener("blur", validateResumeLink);

  // Form submission validation
  form.addEventListener("submit", function (e) {
    // Validate all fields
    validateCoverMessage();
    validateResumeLink();

    // Check if all validations pass
    if (!validationState.coverMessage || !validationState.resumeLink) {
      e.preventDefault();

      // Add shake animation to invalid fields
      if (!validationState.coverMessage) {
        coverMessageTextarea.classList.add("error");
      }
      if (!validationState.resumeLink) {
        resumeLinkInput.classList.add("error");
      }

      // Show a general error message
      const firstErrorField = !validationState.coverMessage
        ? coverMessageTextarea
        : resumeLinkInput;
      firstErrorField.focus();
      firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });

      // Show notification
      showNotification(
        "Please fix the validation errors before submitting.",
        "error"
      );

      return false;
    }

    // If validation passes, show loading state
    submitButton.textContent = "Submitting...";
    submitButton.classList.add("loading");
    submitButton.disabled = true;
    submitButton.style.opacity = "0.6";

    // Show success notification
    showNotification("Submitting your application...", "info");
  });

  // Notification system
  function showNotification(message, type = "info") {
    // Remove any existing notifications
    const existingNotification = document.querySelector(
      ".validation-notification"
    );
    if (existingNotification) {
      existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `validation-notification ${type}`;
    notification.innerHTML = `
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;

    // Add notification to form
    form.insertBefore(notification, form.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  // Get notification icon based on type
  function getNotificationIcon(type) {
    switch (type) {
      case "error":
        return "❌";
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      default:
        return "ℹ️";
    }
  }

  // Initialize validation state
  validateCoverMessage();
  validateResumeLink();

  // Add visual feedback for typing
  coverMessageTextarea.addEventListener("keyup", function () {
    // Debounce validation for better performance
    clearTimeout(this.validationTimeout);
    this.validationTimeout = setTimeout(validateCoverMessage, 300);
  });

  resumeLinkInput.addEventListener("keyup", function () {
    // Debounce validation for better performance
    clearTimeout(this.validationTimeout);
    this.validationTimeout = setTimeout(validateResumeLink, 500);
  });

  // Handle paste events
  coverMessageTextarea.addEventListener("paste", function () {
    setTimeout(validateCoverMessage, 100);
  });

  resumeLinkInput.addEventListener("paste", function () {
    setTimeout(validateResumeLink, 100);
  });

  // Add helpful features

  // Auto-resize textarea based on content
  coverMessageTextarea.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = Math.max(140, this.scrollHeight) + "px";
  });

  // Show example when resume link is focused
  resumeLinkInput.addEventListener("focus", function () {
    if (!this.value) {
      this.placeholder =
        "https://drive.google.com/file/d/1TTRxx-LF_o9psS9M4Xm-dhcEUvOzjNyg/view?usp=sharing";
    }
  });

  resumeLinkInput.addEventListener("blur", function () {
    if (!this.value) {
      this.placeholder =
        "https://drive.google.com/file/d/your-file-id/view?usp=sharing";
    }
  });
});
