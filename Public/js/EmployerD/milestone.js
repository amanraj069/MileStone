document.addEventListener("DOMContentLoaded", () => {
  const paymentModal = document.getElementById("paymentModal");
  const closePaymentModal = document.getElementById("closePaymentModal");
  const cancelPaymentBtn = document.getElementById("cancelPaymentBtn");
  const confirmPaymentBtn = document.getElementById("confirmPaymentBtn");
  const paymentDescription = document.getElementById("paymentDescription");
  const paymentAmount = document.getElementById("paymentAmount");

  document
    .querySelectorAll(".payment-button:not(:disabled)")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const jobId = button.dataset.jobId;
        const milestoneId = button.dataset.milestoneId;
        const description = button.dataset.description;
        const amount = button.dataset.amount;

        paymentDescription.textContent = description;
        paymentAmount.textContent = Number(amount).toLocaleString();
        confirmPaymentBtn.dataset.jobId = jobId;
        confirmPaymentBtn.dataset.milestoneId = milestoneId;
        paymentModal.style.display = "flex";
      });
    });

  const closePaymentModalFn = () => {
    paymentModal.style.display = "none";
    delete confirmPaymentBtn.dataset.jobId;
    delete confirmPaymentBtn.dataset.milestoneId;
  };

  closePaymentModal.addEventListener("click", closePaymentModalFn);
  cancelPaymentBtn.addEventListener("click", closePaymentModalFn);

  confirmPaymentBtn.addEventListener("click", async () => {
    const jobId = confirmPaymentBtn.dataset.jobId;
    const milestoneId = confirmPaymentBtn.dataset.milestoneId;

    try {
      const response = await fetch(
        `/employerD/milestone/${jobId}/${milestoneId}/pay`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update milestone status");
      }

      const data = await response.json();
      if (data.success) {
        const milestoneCard = document
          .querySelector(`.payment-button[data-milestone-id="${milestoneId}"]`)
          .closest(".milestone-card");
        milestoneCard.classList.remove("not-paid");
        milestoneCard.classList.remove("requested");
        milestoneCard.classList.add("paid");
        const paymentButton = milestoneCard.querySelector(".payment-button");
        paymentButton.innerHTML = '<i class="fas fa-check"></i> Paid';
        paymentButton.disabled = true;
        paymentModal.style.display = "none";

        // Update payment progress
        const jobSection = milestoneCard.closest(".job-section");
        const progressAmountElement = jobSection.querySelector(".progress-section:last-child .progress-percentage");
        const currentText = progressAmountElement.textContent;
        const paidMatch = currentText.match(/₹([\d,]+)/);
        const totalMatch = currentText.match(/of ₹([\d,]+)/);
        
        if (paidMatch && totalMatch) {
          const currentPaidAmount = parseFloat(paidMatch[1].replace(/,/g, ""));
          const newPaidAmount = currentPaidAmount + parseFloat(paymentAmount.textContent.replace(/,/g, ""));
          const totalAmount = parseFloat(totalMatch[1].replace(/,/g, ""));
          const percentage = totalAmount > 0 ? Math.round((newPaidAmount / totalAmount) * 100) : 0;
          
          progressAmountElement.textContent = `₹${newPaidAmount.toLocaleString()} of ₹${totalAmount.toLocaleString()} (${percentage}%)`;
          const paymentProgressBar = jobSection.querySelector(".progress-section:last-child .progress-bar");
          paymentProgressBar.style.width = `${percentage}%`;
        }

        // Update completion progress
        const completedCount = jobSection.querySelectorAll(".milestone-card.paid").length;
        const totalCount = jobSection.querySelectorAll(".milestone-card").length;
        const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        
        const completionPercentageElement = jobSection.querySelector(".progress-section:first-child .progress-percentage");
        completionPercentageElement.textContent = `${completionPercentage}%`;
        const completionProgressBar = jobSection.querySelector(".progress-section:first-child .progress-bar");
        completionProgressBar.style.width = `${completionPercentage}%`;
      }
    } catch (error) {
      console.error("Error paying milestone:", error.message);
      alert("Failed to process payment. Please try again.");
    }
  });

  // Debug classes applied to milestone cards
  document.querySelectorAll(".milestone-card").forEach((card) => {
    console.log(`Milestone card classes: ${card.className}`);
  });
});