document.addEventListener('DOMContentLoaded', function() {
    const resolveButtons = document.querySelectorAll('.btn-resolve');

    resolveButtons.forEach(button => {
        // Remove any existing event listeners to prevent duplicates
        button.removeEventListener('click', toggleActions);
        button.addEventListener('click', toggleActions);
    });

    function toggleActions() {
        const actions = this.nextElementSibling; // .additional-actions div
        const card = this.closest('.complaint-card');
        const isResolved = card.classList.contains('resolved');
        const defaultText = isResolved ? 'View Details' : 'Resolve Dispute';

        if (actions.style.display === 'block') {
            actions.style.display = 'none';
            this.textContent = defaultText;
        } else {
            actions.style.display = 'block';
            this.textContent = 'Close Actions';
        }
    }
});