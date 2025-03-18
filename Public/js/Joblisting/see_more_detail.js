// Modal control functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    console.log("Opening modal:", modalId);
    modal.style.display = "flex";
  } else {
    console.error("Modal not found:", modalId);
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    console.log("Closing modal:", modalId);
    modal.style.display = "none";
  }
}

// Ensure DOM is fully loaded before attaching event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Apply modal event listeners for logged-in users
  const applyNowLoggedInBtn = document.getElementById("applyNowLoggedInBtn");
  if (applyNowLoggedInBtn) {
    applyNowLoggedInBtn.addEventListener("click", function () {
      console.log("Apply Now (Logged In) clicked");
      openModal("applyModal");
    });
  }

  // Apply button event listener for non-logged-in users
  const applyNowLoginRequiredBtn = document.getElementById(
    "applyNowLoginRequiredBtn"
  );
  if (applyNowLoginRequiredBtn) {
    applyNowLoginRequiredBtn.addEventListener("click", function () {
      console.log("Apply Now (Login Required) clicked");
      window.location.href = "/login";
    });
  }

  // Close apply modal
  document
    .getElementById("closeApplyModal")
    ?.addEventListener("click", function () {
      closeModal("applyModal");
    });

  // Cancel apply modal
  document
    .getElementById("cancelApply")
    ?.addEventListener("click", function () {
      closeModal("applyModal");
    });

  // Submit application
  document
    .getElementById("submitApplication")
    ?.addEventListener("click", function () {
      const name = document.getElementById("applicantName").value.trim();
      const email = document.getElementById("applicantEmail").value.trim();
      const phone = document.getElementById("applicantPhone").value.trim();
      const bid = document.getElementById("applicantBid").value.trim();
      const message = document.getElementById("applicantMessage").value.trim();

      if (!name || !email || !phone || !bid || !message) {
        alert("Please fill out all required fields");
        return;
      }

      console.log("Form submitted:", { name, email, phone, bid, message });
      alert("Application submitted successfully!");
      closeModal("applyModal");
    });

  console.log("DOM loaded, checking user status");
});
