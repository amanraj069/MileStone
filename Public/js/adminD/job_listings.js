document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute("data-filter");
            document.querySelectorAll(".job-card").forEach((card) => {
              if (
                filter === "all" ||
                card.getAttribute("data-status") === filter
              ) {
                card.classList.remove("hidden");
              } else {
                card.classList.add("hidden");
              }
            });
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-bar input[name="q"]');
    const jobCards = document.querySelectorAll('.job-card');
    const searchForm = document.querySelector('.search-bar form');

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
    });

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        jobCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});