document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const errorContainer = document.getElementById("error-container");

  // Clear any existing error messages initially
  errorContainer.textContent = "";

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form submission until validation passes

    // Get form field values
    const name = form.querySelector("input[name='name']").value.trim();
    const email = form.querySelector("input[name='email']").value.trim();
    const password = form.querySelector("input[name='password']").value.trim();
    const role = form.querySelector("select[name='role']").value;

    // Reset error messages
    errorContainer.textContent = "";
    errorContainer.style.color = "red";

    // Validation flags
    let isValid = true;

    // Name validation (simple check for non-empty)
    if (name === "") {
      errorContainer.textContent += "Name is required.\n";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format check
    if (!emailRegex.test(email)) {
      errorContainer.textContent += "Please enter a valid email address.\n";
      isValid = false;
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      errorContainer.textContent +=
        "Password must be at least 8 characters long and contain at least one uppercase letter, one digit, and one special character (e.g., !@#$%^&*).\n";
      isValid = false;
    }

    // Role validation (ensure something is selected)
    if (!role) {
      errorContainer.textContent += "Please select a role.\n";
      isValid = false;
    }

    // If all validations pass, submit the form
    if (isValid) {
      errorContainer.style.color = "green";
      setTimeout(() => {
        form.submit(); // Submit the form programmatically
      }, 1000); // Optional delay to show success message
    }
  });

  // Real-time feedback (optional)
  const emailInput = form.querySelector("input[name='email']");
  const passwordInput = form.querySelector("input[name='password']");

  emailInput.addEventListener("input", () => {
    if (!emailRegex.test(emailInput.value.trim()) && emailInput.value !== "") {
      emailInput.style.borderColor = "red";
    } else {
      emailInput.style.borderColor = "#ccc";
    }
  });

  passwordInput.addEventListener("input", () => {
    if (
      !passwordRegex.test(passwordInput.value.trim()) &&
      passwordInput.value !== ""
    ) {
      passwordInput.style.borderColor = "red";
    } else {
      passwordInput.style.borderColor = "#ccc";
    }
  });
});

// Regular expressions defined within the script (no need to repeat outside)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;