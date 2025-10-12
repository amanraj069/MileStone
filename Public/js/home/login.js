document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const errorContainer = document.getElementById("error-container");
  const submitButton = form.querySelector("button[type='submit']");

  // Regular expressions for validation
  const emailRegex = /^[^\s@]+@[^\s@]*\.[^\s@]+$/;

  errorContainer.innerHTML = "";

  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Get form field values
    const email = form.querySelector("input[name='email']").value.trim();
    const password = form.querySelector("input[name='password']").value.trim();
    const role = form.querySelector("select[name='role']").value;

    // Reset error messages and button state
    clearErrors();
    setLoadingState(true);

    // Validate form
    if (!validateForm(email, password, role)) {
      setLoadingState(false);
      return;
    }

    try {
      // Send AJAX request
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          role: role
        })
      });

      const result = await response.json();

      if (response.ok) {
        setTimeout(() => {
          window.location.href = result.redirectUrl || getDashboardUrl(role);
        }, 1500);
      } else {
        // Handle server errors
        showError(result.error || 'Login failed. Please try again.');
        setLoadingState(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      showError('Network error. Please check your connection and try again.');
      setLoadingState(false);
    }
  });

  // Real-time validation
  const emailInput = form.querySelector("input[name='email']");
  const passwordInput = form.querySelector("input[name='password']");

  emailInput.addEventListener("input", () => {
    validateEmailField(emailInput);
  });

  emailInput.addEventListener("blur", () => {
    validateEmailField(emailInput);
  });

  passwordInput.addEventListener("input", () => {
    validatePasswordField(passwordInput);
  });

  // Validation functions
  function validateForm(email, password, role) {
    let isValid = true;

    // Email validation
    if (!email) {
      showError("Email is required.");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      showError("Please enter a valid email address.");
      isValid = false;
    }

    // Password validation
    if (!password) {
      showError("Password is required.");
      isValid = false;
    } else if (password.length < 6) {
      showError("Password must be at least 6 characters long.");
      isValid = false;
    }

    // Role validation
    if (!role) {
      showError("Please select a role.");
      isValid = false;
    }

    return isValid;
  }

  function validateEmailField(emailInput) {
    const email = emailInput.value.trim();
    if (email && !emailRegex.test(email)) {
      emailInput.style.borderColor = "#dc3545";
    } else {
      emailInput.style.borderColor = "#28a745";
    }
  }

  function validatePasswordField(passwordInput) {
    const password = passwordInput.value.trim();
    if (password && password.length >= 6) {
      passwordInput.style.borderColor = "#28a745";
    } else if (password && password.length < 6) {
      passwordInput.style.borderColor = "#dc3545";
    } else {
      passwordInput.style.borderColor = "#ced4da";
    }
  }

  // Utility functions
  function showError(message) {
    errorContainer.innerHTML = `
      <div class="error-message" style="color: #dc3545; margin: 10px 0; padding: 8px 12px; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px;">
        <i class="fas fa-exclamation-circle" style="margin-right: 8px;"></i>
        ${message}
      </div>
    `;
  }

  function clearErrors() {
    errorContainer.innerHTML = "";
  }

  function setLoadingState(isLoading) {
    if (isLoading) {
      submitButton.disabled = true;
    } else {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Log In';
    }
  }

  function getDashboardUrl(role) {
    switch (role) {
      case 'Admin':
        return '/adminD/profile';
      case 'Employer':
        return '/employerD/profile';
      case 'Freelancer':
        return '/freelancerD/profile';
      default:
        return '/';
    }
  }

  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get("error");
  if (error) {
    showError(decodeURIComponent(error));
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});