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
});


function see_more_Page() {
    window.location.href = "current_job_see_more.html"; // Redirects to see_more_detail.html
}