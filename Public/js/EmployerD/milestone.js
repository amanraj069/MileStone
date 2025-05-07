document.addEventListener('DOMContentLoaded', () => {
    const paymentModal = document.getElementById('paymentModal');
    const closePaymentModal = document.getElementById('closePaymentModal');
    const cancelPaymentBtn = document.getElementById('cancelPaymentBtn');
    const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
    const paymentDescription = document.getElementById('paymentDescription');
    const paymentAmount = document.getElementById('paymentAmount');

    // Open payment modal
    document.querySelectorAll('.pay-btn:not(:disabled)').forEach(button => {
        button.addEventListener('click', () => {
            const jobId = button.dataset.jobId;
            const milestoneId = button.dataset.milestoneId;
            const description = button.dataset.description;
            const amount = button.dataset.amount;

            paymentDescription.textContent = description;
            paymentAmount.textContent = amount;
            confirmPaymentBtn.dataset.jobId = jobId;
            confirmPaymentBtn.dataset.milestoneId = milestoneId;
            paymentModal.style.display = 'flex';
        });
    });

    // Close payment modal
    const closePaymentModalFn = () => {
        paymentModal.style.display = 'none';
        delete confirmPaymentBtn.dataset.jobId;
        delete confirmPaymentBtn.dataset.milestoneId;
    };

    closePaymentModal.addEventListener('click', closePaymentModalFn);
    cancelPaymentBtn.addEventListener('click', closePaymentModalFn);

    // Confirm payment
    confirmPaymentBtn.addEventListener('click', async () => {
        const jobId = confirmPaymentBtn.dataset.jobId;
        const milestoneId = confirmPaymentBtn.dataset.milestoneId;

       skills// Fetch API to update milestone status
        try {
            const response = await fetch(`/employerD/milestone/${jobId}/${milestoneId}/pay`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to update milestone status');
            }

            const data = await response.json();
            if (data.success) {
                // Update UI
                const milestoneRow = document.querySelector(`.pay-btn[data-milestone-id="${milestoneId}"]`).closest('tr');
                milestoneRow.classList.remove('not-paid');
                milestoneRow.classList.add('paid');
                milestoneRow.querySelector('.pay-btn').textContent = 'Paid';
                milestoneRow.querySelector('.pay-btn').disabled = true;
                paymentModal.style.display = 'none';

                // Update payment progress
                const paidAmount = parseFloat(document.querySelector('.progress-amount').textContent.match(/₹([\d,]+)/)[1].replace(/,/g, '')) + parseFloat(paymentAmount.textContent);
                const totalAmount = parseFloat(document.querySelector('.progress-amount').textContent.match(/of ₹([\d,]+)/)[1].replace(/,/g, ''));
                const percentage = Math.round((paidAmount / totalAmount) * 100);
                document.querySelector('.progress-amount').textContent = `₹${paidAmount.toLocaleString()} of ₹${totalAmount.toLocaleString()} (${percentage}%)`;
                document.querySelector('.progress-bar:last-child').style.width = `${percentage}%`;

                // Update project completion
                const completedCount = document.querySelectorAll('.milestone-row.paid').length;
                const totalCount = document.querySelectorAll('.milestone-row').length;
                const completionPercentage = Math.round((completedCount / totalCount) * 100);
                document.querySelector('.progress-percentage').textContent = `${completionPercentage}%`;
                document.querySelector('.progress-bar:first-child').style.width = `${completionPercentage}%`;
            }
        } catch (error) {
            console.error('Error paying milestone:', error.message);
            alert('Failed to process payment. Please try again.');
        }
    });
});