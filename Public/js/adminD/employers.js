document.addEventListener('DOMContentLoaded', function() {
    // Placeholder for future interactivity (e.g., chat or delete actions)
    const chatButtons = document.querySelectorAll('.btn-primary');
    const deleteButtons = document.querySelectorAll('.btn-danger');

    chatButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Chat button clicked'); 
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('Delete button clicked'); 
        });
    });
});