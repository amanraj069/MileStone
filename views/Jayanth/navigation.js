document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.dashboard-nav .nav-item');
    
    // Set active class based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navItems.forEach(item => {
        const link = item.querySelector('a').getAttribute('href');
        if (link === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
});