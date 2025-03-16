// Filter functionality
const filterButtons = document.querySelectorAll('.filter-button');
const transactionCards = document.querySelectorAll('.transaction-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        // Show/hide transaction cards based on filter
        transactionCards.forEach(card => {
            const status = card.getAttribute('data-status');
            if (filterValue === 'all') {
                card.classList.remove('hidden');
            } else if (filterValue === status) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});