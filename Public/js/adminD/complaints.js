document.addEventListener('DOMContentLoaded', function() {
    // Initialize filter functionality
    initializeFilters();
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input[name="q"]');
    const searchForm = document.querySelector('.search-bar form');

    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            // Allow form submission to go through for server-side search
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const visibleCards = document.querySelectorAll('.complaint-card:not([style*="display: none"])');
            
            visibleCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});

// Initialize filter functionality
function initializeFilters() {
    const currentTab = document.querySelector('.filter-tab[data-filter="current"]');
    const pastTab = document.querySelector('.filter-tab[data-filter="past"]');
    
    // Set initial state - show current complaints by default
    filterComplaints('current');
}

// Filter complaints based on status
function filterComplaints(filterType) {
    const complaintsCards = document.querySelectorAll('.complaint-card');
    const currentTab = document.querySelector('.filter-tab[data-filter="current"]');
    const dismissedTab = document.querySelector('.filter-tab[data-filter="dismissed"]');
    const pastTab = document.querySelector('.filter-tab[data-filter="past"]');
    
    // Update tab active states
    currentTab.classList.remove('active');
    dismissedTab.classList.remove('active');
    pastTab.classList.remove('active');
    
    if (filterType === 'current') {
        currentTab.classList.add('active');
        // Show only pending complaints
        complaintsCards.forEach(card => {
            const status = card.getAttribute('data-status');
            if (status === 'pending') {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    } else if (filterType === 'dismissed') {
        dismissedTab.classList.add('active');
        // Show only dismissed complaints
        complaintsCards.forEach(card => {
            const status = card.getAttribute('data-status');
            if (status === 'dismissed') {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    } else if (filterType === 'past') {
        pastTab.classList.add('active');
        // Show resolved complaints
        complaintsCards.forEach(card => {
            const status = card.getAttribute('data-status');
            if (status === 'resolved') {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Toggle actions display
function toggleActions(button) {
    const actions = button.nextElementSibling; // .additional-actions div
    
    if (actions.style.display === 'block') {
        actions.style.display = 'none';
        button.textContent = 'View Actions';
    } else {
        actions.style.display = 'block';
        button.textContent = 'Hide Actions';
    }
}

// Function to resolve complaint
async function resolveComplaint(complaintId) {
    const resolution = prompt("Please enter a resolution note (optional):");
    
    if (resolution === null) {
        return; // User cancelled
    }
    
    try {
        const response = await fetch(`/adminD/complaints/${complaintId}/resolve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                resolution: resolution || 'Complaint resolved by admin'
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Complaint resolved successfully!');
            location.reload(); // Refresh page to show updated status
        } else {
            alert(data.error || 'Failed to resolve complaint');
        }
    } catch (error) {
        console.error('Error resolving complaint:', error);
        alert('An error occurred while resolving the complaint');
    }
}

// Function to dismiss complaint
async function dismissComplaint(complaintId) {
    const reason = prompt("Please enter a reason for dismissing this complaint (optional):");
    
    if (reason === null) {
        return; // User cancelled
    }
    
    if (confirm("Are you sure you want to dismiss this complaint? This action cannot be undone.")) {
        try {
            const response = await fetch(`/adminD/complaints/${complaintId}/dismiss`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reason: reason || 'Complaint dismissed by admin'
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert('Complaint dismissed successfully!');
                location.reload(); // Refresh page to show updated status
            } else {
                alert(data.error || 'Failed to dismiss complaint');
            }
        } catch (error) {
            console.error('Error dismissing complaint:', error);
            alert('An error occurred while dismissing the complaint');
        }
    }
}

// Function to contact user (redirect to chat)
function contactUser(userId, userName) {
    // Redirect to chat with the user
    const chatUrl = `/chat/${userId}`;
    window.location.href = chatUrl;
}

// Function to change rating (placeholder)
function changeRating(userId, userName) {
    // Placeholder functionality
    alert(`Change rating feature for ${userName} is not yet implemented. This is a placeholder UI element.`);
}