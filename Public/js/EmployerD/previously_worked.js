document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const freelancerCards = document.querySelectorAll('.freelancer-card');

    // Ensure elements are found
    if (!searchInput || freelancerCards.length === 0) {
        console.error('Search input or freelancer cards not found');
        return;
    }

    // Debounce function to limit how often the search runs
    let debounceTimeout;
    const debounceSearch = (callback, delay) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(callback, delay);
    };

    searchInput.addEventListener('input', () => {
        debounceSearch(() => {
            const searchTerm = searchInput.value.trim().toLowerCase();
            console.log('Search term:', searchTerm); // Debug log

            freelancerCards.forEach(card => {
                const name = card.dataset.name || '';
                const project = card.dataset.project || '';
                const rating = card.dataset.rating || '';

                // Log the values for debugging
                console.log(`Card - Name: ${name}, Project: ${project}, Rating: ${rating}`);

                // Check if search term is empty or matches name, project, or rating
                const isMatch = searchTerm === '' ||
                               name.includes(searchTerm) ||
                               project.includes(searchTerm) ||
                               rating.includes(searchTerm);

                // Show or hide card based on match
                card.style.display = isMatch ? '' : 'none';
            });
        }, 300); // 300ms debounce delay
    });
});