document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const errorContainer = document.getElementById("error-container");
  const submitButton = form.querySelector("button[type='submit']");

  // Regular expressions for validation
  const emailRegex = /^[^\s@]+@[a-zA-Z][^\s@]*\.[a-zA-Z]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  // Clear any existing error messages initially
  errorContainer.innerHTML = "";

  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Get form field values
    const name = form.querySelector("input[name='name']").value.trim();
    const email = form.querySelector("input[name='email']").value.trim();
    const password = form.querySelector("input[name='password']").value.trim();
    const role = form.querySelector("select[name='role']").value;

    // Reset error messages and button state
    clearErrors();
    setLoadingState(true);

    // Validate form
    if (!validateForm(name, email, password, role)) {
      setLoadingState(false);
      return;
    }

    try {
      // Send AJAX request
      const response = await fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          role: role
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Success - redirect to appropriate dashboard
        const roleName = role.toLowerCase();
        setTimeout(() => {
          window.location.href = result.redirectUrl || getDashboardUrl(role);
        }, 2000);
      } else {
        // Handle server errors
        showError(result.error || 'Registration failed. Please try again.');
        setLoadingState(false);
      }
    } catch (error) {
      console.error('Signup error:', error);
      showError('Network error. Please check your connection and try again.');
      setLoadingState(false);
    }
  });

  // Validation function
  function validateForm(name, email, password, role) {
    let isValid = true;
    let errors = [];

    // Name validation
    if (!name) {
      errors.push("Name is required.");
      isValid = false;
    } else if (name.length < 2) {
      errors.push("Name must be at least 2 characters long.");
      isValid = false;
    }

    // Email validation
    if (!email) {
      errors.push("Email is required.");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      errors.push("Please enter a valid email address.");
      isValid = false;
    }

    // Password validation
    if (!password) {
      errors.push("Password is required.");
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      errors.push("Password must be at least 8 characters long and contain at least one uppercase letter, one digit, and one special character (e.g., !@#$%^&*).");
      isValid = false;
    }

    // Role validation
    if (!role) {
      errors.push("Please select a role.");
      isValid = false;
    }

    if (errors.length > 0) {
      showError(errors.join('<br>'));
    }

    return isValid;
  }

  // Real-time validation
  const nameInput = form.querySelector("input[name='name']");
  const emailInput = form.querySelector("input[name='email']");
  const passwordInput = form.querySelector("input[name='password']");

  nameInput.addEventListener("input", () => {
    validateNameField(nameInput);
  });

  emailInput.addEventListener("input", () => {
    validateEmailField(emailInput);
  });

  emailInput.addEventListener("blur", () => {
    validateEmailField(emailInput);
  });

  passwordInput.addEventListener("input", () => {
    validatePasswordField(passwordInput);
  });

  // Field validation functions
  function validateNameField(nameInput) {
    const name = nameInput.value.trim();
    if (name && name.length >= 2) {
      nameInput.style.borderColor = "#28a745";
    } else if (name && name.length < 2) {
      nameInput.style.borderColor = "#dc3545";
      } else {
      nameInput.style.borderColor = "#ced4da";
    }
  }

  function validateEmailField(emailInput) {
    const email = emailInput.value.trim();
    if (email && emailRegex.test(email)) {
      emailInput.style.borderColor = "#28a745";
      } else if (email && !emailRegex.test(email)) {
      emailInput.style.borderColor = "#dc3545";
      } else {
      emailInput.style.borderColor = "#ced4da";
    }
  }

  function validatePasswordField(passwordInput) {
    const password = passwordInput.value.trim();
    if (password && passwordRegex.test(password)) {
      passwordInput.style.borderColor = "#28a745";
    } else if (password && !passwordRegex.test(password)) {
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

  function showSuccess(message) {
    errorContainer.innerHTML = `
      <div class="success-message" style="color: #155724; margin: 10px 0; padding: 8px 12px; background: #d4edda; border: 1px solid #c3e6cb; border-radius: 4px;">
        <i class="fas fa-check-circle" style="margin-right: 8px;"></i>
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
      submitButton.innerHTML = 'Sign Up';
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
        return '/login';
    }
  }
});