document.addEventListener('DOMContentLoaded', function() {
    const resolveButtons = document.querySelectorAll('.btn-resolve');

    resolveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const actions = this.nextElementSibling; // .additional-actions div
            const isVisible = actions.style.display === 'block';

            if (isVisible) {
                actions.style.display = 'none';
                this.textContent = 'Resolve Dispute';
            } else {
                actions.style.display = 'block';
                this.textContent = 'Close Actions';
            }
        });
    });
});