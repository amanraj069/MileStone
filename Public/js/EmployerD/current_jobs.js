<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', function() {
    const jobCards = document.querySelectorAll('.job-card');
    const searchInput = document.querySelector('.search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Initialize job data for filtering
    const jobData = [];
    jobCards.forEach(card => {
        const jobTitle = card.querySelector('.job-title').textContent;
        const jobType = card.querySelector('.job-type') ? card.querySelector('.job-type').textContent.trim() : '';
        const jobLocation = card.querySelector('.job-location') ? card.querySelector('.job-location').textContent.trim() : '';
        const isRemote = jobLocation.includes('Remote');

        jobData.push({
            element: card,
            title: jobTitle.toLowerCase(),
            type: jobType.toLowerCase(),
            isRemote: isRemote
        });
    });

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filterType = this.textContent.trim();

            jobData.forEach(job => {
                const element = job.element;

                if (filterType === 'All Jobs') {
                    element.style.display = 'flex';
                } else if (filterType === 'Remote' && job.isRemote) {
                    element.style.display = 'flex';
                } else if (filterType === 'Full-time' && job.type.includes('full-time')) {
                    element.style.display = 'flex';
                } else if (filterType === 'Part-time' && job.type.includes('part-time')) {
                    element.style.display = 'flex';
                } else if (filterType === 'Recent') {
                    element.style.display = 'flex'; // Placeholder, adjust logic as needed
                } else {
                    element.style.display = 'none';
                }
            });

            if (searchInput.value.trim()) {
                applySearchFilter();
            }
        });
    });

    // Search functionality
    function applySearchFilter() {
        const searchTerm = searchInput.value.toLowerCase().trim();

        jobData.forEach(job => {
            if (job.element.style.display !== 'none') {
                if (searchTerm === '' || job.title.includes(searchTerm)) {
                    job.element.style.display = 'flex';
                } else {
                    job.element.style.display = 'none';
                }
            }
        });
    }

    searchInput.addEventListener('keyup', function(e) {
        applySearchFilter();

        if (e.key === 'Enter') {
            const visibleCount = document.querySelectorAll('.job-card[style="display: flex;"]').length;
            alert(`Found ${visibleCount} jobs matching "${this.value}"`);
        }
    });

    // Button functionality
    const complainButtons = document.querySelectorAll('.complain-btn');
    const chatButtons = document.querySelectorAll('.chat-btn');
    const seeMoreButtons = document.querySelectorAll('.see-more-btn');
    const markFinishedButtons = document.querySelectorAll('.mark-finished-btn');

    complainButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('Complaint submitted for this freelancer. Our team will review it shortly.');
        });
    });

    chatButtons.forEach(button => {
        button.addEventListener('click', function() {
            const jobTitle = this.closest('.job-card').querySelector('.job-title').textContent;
            alert(`Opening chat for "${jobTitle}".`);
        });
    });

    seeMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const jobTitle = this.closest('.job-card').querySelector('.job-title').textContent;
            alert(`Job details for "${jobTitle}" would be displayed here.`);
        });
    });

    markFinishedButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Are you sure you want to mark this job as finished?')) {
                this.closest('.job-card').style.display = 'none';
                alert('Job marked as finished!');
            }
        });
    });
});
=======
// Search functionality
const searchInput = document.querySelector('.search-input');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.freelancer-card');
    
    cards.forEach(card => {
        const name = card.querySelector('.freelancer-name').textContent.toLowerCase();
        const skills = Array.from(card.querySelectorAll('.skill-tag')).map(tag => tag.textContent.toLowerCase());
        const project = card.querySelector('.project-name').textContent.toLowerCase();
        
        // Check if the search term is found in the name, skills, or project
        const isMatch = name.includes(searchTerm) || 
                       skills.some(skill => skill.includes(searchTerm)) || 
                       project.includes(searchTerm);
        
        // Show or hide the card based on the search
        card.style.display = isMatch ? 'block' : 'none';
    });
<<<<<<< HEAD:Team/Abhishek/current_jobs.js
});


function see_more_Page() {
    window.location.href = "current_job_see_more.html"; // Redirects to see_more_detail.html
}
>>>>>>> b85785e7f47b62d626e1e611d60d667eb7d919f1
=======
});
>>>>>>> f1e868a85a7d7f0d2a234f8eb3a2fabad7476da8:Public/js/EmployerD/current_jobs.js
