document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    body.classList.add(savedTheme);

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        body.classList.toggle('dark-mode');
        const newTheme = body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
        localStorage.setItem('theme', newTheme);
    });

    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const isActive = mobileMenu.classList.contains('active');
        mobileMenuToggle.setAttribute('aria-expanded', isActive);
        mobileMenuToggle.querySelector('i').classList.toggle('fa-bars');
        mobileMenuToggle.querySelector('i').classList.toggle('fa-times');
    });

    // Close mobile menu when clicking a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenuToggle.querySelector('i').classList.add('fa-bars');
            mobileMenuToggle.querySelector('i').classList.remove('fa-times');
        });
    });

    // Scroll Navigation Visibility
    const scrollNav = document.getElementById('scroll-nav');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 380) {
            scrollNav.classList.add('active');
        } else {
            scrollNav.classList.remove('active');
        }

        // Hide mobile menu on scroll
        if (scrollTop > lastScrollTop && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenuToggle.querySelector('i').classList.add('fa-bars');
            mobileMenuToggle.querySelector('i').classList.remove('fa-times');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // Hero Fade-In Animation
    const heroElements = document.querySelectorAll('.hero .fade-in');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('visible');
        }, index * 200);
    });

    // Counter Animation for Stats
    const counters = document.querySelectorAll('.counter');
    const statsSection = document.querySelector('.stats');
    let hasAnimated = false;

    const animateCounters = () => {
        if (hasAnimated) return;
        hasAnimated = true;

        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            let count = 0;
            const increment = target / 50;

            const updateCounter = () => {
                count += increment;
                if (count < target) {
                    counter.textContent = count.toFixed(1);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    };

    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateCounters();
        }
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);

    // Freelancers Carousel
    const freelancersCarousel = document.getElementById('freelancers-carousel');
    const prevFreelancerBtn = document.getElementById('prev-freelancer');
    const nextFreelancerBtn = document.getElementById('next-freelancer');

    prevFreelancerBtn.addEventListener('click', () => {
        freelancersCarousel.scrollBy({ left: -300, behavior: 'smooth' });
    });

    nextFreelancerBtn.addEventListener('click', () => {
        freelancersCarousel.scrollBy({ left: 300, behavior: 'smooth' });
    });

    // Testimonials Carousel
    const testimonialsCarousel = document.getElementById('testimonials-carousel');
    const prevTestimonialBtn = document.getElementById('prev-testimonial');
    const nextTestimonialBtn = document.getElementById('next-testimonial');

    prevTestimonialBtn.addEventListener('click', () => {
        testimonialsCarousel.scrollBy({ left: -350, behavior: 'smooth' });
    });

    nextTestimonialBtn.addEventListener('click', () => {
        testimonialsCarousel.scrollBy({ left: 350, behavior: 'smooth' });
    });

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isActive = answer.classList.contains('active');

            // Close all other answers
            document.querySelectorAll('.faq-answer').forEach(item => {
                if (item !== answer) {
                    item.classList.remove('active');
                    item.previousElementSibling.classList.remove('active');
                }
            });

            // Toggle the clicked answer
            answer.classList.toggle('active');
            question.classList.toggle('active');
            question.setAttribute('aria-expanded', !isActive);
        });
    });

    // Contact Modal
    const contactButtons = document.querySelectorAll('.contact-btn, .footer-contact-btn');
    const contactModal = document.getElementById('contact-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalSubmit = document.querySelector('.modal-submit');

    contactButtons.forEach(button => {
        button.addEventListener('click', () => {
            contactModal.classList.add('active');
        });
    });

    modalClose.addEventListener('click', () => {
        contactModal.classList.remove('active');
    });

    modalSubmit.addEventListener('click', () => {
        const name = document.getElementById('contact-name').value;
        const phone = document.getElementById('contact-phone').value;
        const email = document.getElementById('contact-email').value;
        const message = document.getElementById('contact-message').value;

        if (name && phone && email && message) {            
            contactModal.classList.remove('active');
            document.getElementById('contact-name').value = '';
            document.getElementById('contact-phone').value = '';
            document.getElementById('contact-email').value = '';
            document.getElementById('contact-message').value = '';
            // alert('Thank you for your message! We will get back to you soon.');
        } else {
            alert('Please fill in all fields.');
        }
    });

    // Scroll to Top Button
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

});

function openContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.classList.add('active');
    }
}

// Optional: Close modal functionality
document.querySelector('.modal-close').addEventListener('click', () => {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.classList.remove('active');
    }
});

function openUnauthorizeModal() {
    const modal = document.getElementById('unauthorize-modal');
    if (modal) {
        modal.style.display = 'flex'; // Ensure the modal is displayed
    }
}

function closeUnauthorizeModal() {
    const modal = document.getElementById('unauthorize-modal');
    if (modal) {
        modal.style.display = 'none'; // Hide the modal
    }
}

function openLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'flex'; // Ensure the modal is displayed
    }
}

function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'none'; // Hide the modal
    }
}

function showLoginUnauthorizedMessage() {
        openLoginModal();
        setTimeout(() => {
            closeLoginModal();
        }, 1100); // Hide message after 2 seconds
}
function showUnauthorizedMessage() {
        openUnauthorizeModal();
        setTimeout(() => {
            closeUnauthorizeModal();
        }, 1100); // Hide message after 2 seconds
}