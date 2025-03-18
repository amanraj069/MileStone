document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const jobList = document.getElementById('jobList');
    const allJobs = Array.from(document.querySelectorAll('.job-card'));

    // Add search functionality
    function performSearch(searchTerm) {
        searchTerm = searchTerm.toLowerCase().trim();
        
        if (!searchTerm) {
            return allJobs;
        }

        return allJobs.filter(job => {
            const jobTitle = job.querySelector('.job-title').textContent.toLowerCase();
            return jobTitle.includes(searchTerm);
        });
    }

    // Modify the existing applyFiltersAndSort function
    function applyFiltersAndSort() {
        const searchTerm = searchInput.value;
        let filteredJobs = performSearch(searchTerm);

        // Update display
        const title = document.querySelector('#jobList h1');
        jobList.innerHTML = '';
        jobList.appendChild(title);

        if (filteredJobs.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.style.textAlign = 'center';
            noResults.style.padding = '20px';
            noResults.style.color = '#666';
            noResults.innerHTML = `
                <h3>No matching jobs found</h3>
                <p>Try different keywords or remove search filters</p>
            `;
            jobList.appendChild(noResults);
        } else {
            filteredJobs.forEach(job => jobList.appendChild(job));
        }
    }

    // Add search input event listeners with debouncing
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            applyFiltersAndSort();
        }, 300);
    });

    // Initial load
    applyFiltersAndSort();
});
