function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "flex";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  }
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
}

function displayError(message, fieldId = null) {
  if (fieldId) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.style.color = "red";
    errorDiv.style.fontSize = "12px";
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
  } else {
    const modalBody = document.querySelector(".modal-body");
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.style.color = "red";
    errorDiv.style.fontSize = "12px";
    errorDiv.textContent = message;
    modalBody.insertBefore(errorDiv, modalBody.firstChild);
  }
}

function clearErrors() {
  const errors = document.querySelectorAll(".error-message");
  errors.forEach((error) => error.remove());
}

document.addEventListener("DOMContentLoaded", function () {
  const applyNowLoggedInBtn = document.getElementById("applyNowLoggedInBtn");
  if (applyNowLoggedInBtn) {
    applyNowLoggedInBtn.addEventListener("click", function () {
      openModal("applyModal");
    });
  }

  const applyNowLoginRequiredBtn = document.getElementById(
    "applyNowLoginRequiredBtn"
  );
  if (applyNowLoginRequiredBtn) {
    applyNowLoginRequiredBtn.addEventListener("click", function () {
      window.location.href = "/login";
    });
  }

  document
    .getElementById("closeApplyModal")
    ?.addEventListener("click", function () {
      closeModal("applyModal");
    });

  document
    .getElementById("cancelApply")
    ?.addEventListener("click", function () {
      closeModal("applyModal");
    });

  document
    .getElementById("submitApplication")
    ?.addEventListener("click", async function () {
      const name = document.getElementById("applicantName").value.trim();
      const email = document.getElementById("applicantEmail").value.trim();
      const phone = document.getElementById("applicantPhone").value.trim();
      const bid = document.getElementById("applicantBid").value.trim();
      const message = document.getElementById("applicantMessage").value.trim();

      const jobTitle = document.querySelector(".job-title").textContent;
      const companyName = document.querySelector(".company-name").textContent;
      const location = document
        .querySelector(".meta-item:nth-child(1)")
        .textContent.trim();
      const jobType = document
        .querySelector(".meta-item:nth-child(2)")
        .textContent.trim();
      const salaryRange = document
        .querySelector(".meta-item:nth-child(3)")
        .textContent.trim();
      const postedDate = document
        .querySelector(".meta-item:nth-child(4)")
        .textContent.replace("Posted on ", "")
        .trim();
      const deadline = document
        .querySelector(".deadline")
        .textContent.replace("Application Deadline: ", "")
        .trim();
      const image = document.querySelector(".job-img").src;

      const descriptionIntro = document.querySelector(
        ".description-text p"
      ).textContent;

      clearErrors();

      let isValid = true;

      if (!name || !email || !phone || !bid || !message) {
        displayError("All fields are required.");
        isValid = false;
      }

      if (email && !validateEmail(email)) {
        displayError("Please enter a valid email address.", "applicantEmail");
        isValid = false;
      }

      if (phone && !validatePhone(phone)) {
        displayError(
          "Please enter a valid 10-digit phone number.",
          "applicantPhone"
        );
        isValid = false;
      }

      if (isValid) {
        const applicationData = {
          job_title: jobTitle,
          company_name: companyName,
          location,
          job_type: jobType,
          salary_range: salaryRange,
          posted_date: postedDate,
          deadline,
          image,
          description_intro: descriptionIntro,
          bid_amount: bid,
          applicant_name: name,
          applicant_email: email,
          applicant_phone: phone,
          applicant_message: message,
        };

        try {
          const response = await fetch("/jobs/apply", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(applicationData),
          });

          if (response.ok) {
            alert("Application submitted successfully!");
            closeModal("applyModal");
            window.location.href = "/freelancerD/active_job";
          } else {
            displayError("Failed to submit application. Please try again.");
          }
        } catch (error) {
          console.error("Error submitting application:", error);
          displayError("An error occurred. Please try again.");
        }
      }
    });
});
