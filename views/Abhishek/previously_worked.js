// Filter functionality
const filterButtons = document.querySelectorAll('.filter-btn');
        
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterType = button.getAttribute('data-filter');
        const cards = document.querySelectorAll('.freelancer-card');
        
        // Apply the filter
        cards.forEach(card => {
            const daysCompleted = parseInt(card.getAttribute('data-completed'));
            const rating = parseFloat(card.getAttribute('data-rating'));
            
            if (filterType === 'all') {
                // Show all cards
                card.style.display = 'block';
            } else if (filterType === 'recent') {
                // Show only cards completed within the last week (7 days)
                card.style.display = daysCompleted <= 7 ? 'block' : 'none';
            } else if (filterType === 'top-rated') {
                // Show only cards with rating 4.8 or higher
                card.style.display = rating >= 4.8 ? 'block' : 'none';
            }
        });
        
        console.log(`Filter applied: ${button.textContent}`);
    });
});

// Rehire button functionality
const rehireButtons = document.querySelectorAll('.rehire-btn');

rehireButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.freelancer-card');
        const name = card.querySelector('.freelancer-name').textContent;
        
        alert(`You are about to rehire ${name}. Redirecting to project creation...`);
        // Here you would redirect to a new project form or open a modal
    });
});

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