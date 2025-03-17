// Add smooth scrolling to all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize contact form functionality
document.querySelector('.btn-primary').addEventListener('click', function() {
    // You can add contact form logic here
    console.log('Contact button clicked');
});

// Initialize CV download functionality
document.querySelector('.btn-secondary').addEventListener('click', function() {
    // You can add CV download logic here
    console.log('Download CV button clicked');
});

// Add scroll-based animations
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('.about-section, .skills-section, .education-section, .portfolio-section, .reviews-section');
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isVisible = (rect.top <= window.innerHeight * 0.75);
        
        if (isVisible) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
});