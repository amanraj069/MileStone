// Try to select by ID first
const complaintBtnById = document.getElementById('complain-btn');

// If the ID exists, add the event listener to it
if (complaintBtnById) {
    complaintBtnById.addEventListener('click', function() {
        alert('Complaint submitted successfully!');
    });
} else {
    // If no element with the ID is found, select all elements with the class
    const complaintButtonsByClass = document.querySelectorAll('.complain-btn');
    complaintButtonsByClass.forEach(button => {
        button.addEventListener('click', function() {
            alert('Complaint submitted successfully!');
        });
    });
}