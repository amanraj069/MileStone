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

    // Search functionality
    const searchInput = document.querySelector('.search-bar input[name="q"]');
    const complaintCards = document.querySelectorAll('.complaint-card');
    const searchForm = document.querySelector('.search-bar form');

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
    });

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        complaintCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});