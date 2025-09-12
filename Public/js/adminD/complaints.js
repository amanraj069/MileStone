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

// Function to show notification banner
function showNotificationBanner(message, type = 'success', duration = 4000) {
    const banner = document.getElementById('notification-banner');
    const bannerMessage = document.getElementById('banner-message');
    const bannerIcon = document.getElementById('banner-icon');
    
    // Set message and type
    bannerMessage.textContent = message;
    banner.className = `notification-banner ${type} show`;
    
    // Set appropriate icon based on type
    if (type === 'success') {
        bannerIcon.innerHTML = '✓';
    } else if (type === 'error') {
        bannerIcon.innerHTML = '✕';
    } else if (type === 'warning') {
        bannerIcon.innerHTML = '⚠';
    }
    
    // Auto-hide after duration
    setTimeout(() => {
        banner.classList.remove('show');
    }, duration);
}

// Function to show inline confirmation
function showInlineConfirmation(complaintId, action) {
    const complaintCard = document.querySelector(`[data-complaint-id="${complaintId}"]`);
    if (!complaintCard) return;
    
    // Create confirmation overlay
    const confirmationOverlay = document.createElement('div');
    confirmationOverlay.className = 'inline-confirmation';
    confirmationOverlay.innerHTML = `
        <div class="confirmation-content">
            <div class="confirmation-header">
                <span class="confirmation-icon">?</span>
                <h4>Confirm ${action}</h4>
            </div>
            <p>Are you sure you want to ${action.toLowerCase()} this complaint?</p>
            <div class="confirmation-actions">
                <button class="btn-confirm" onclick="executeAction('${complaintId}', '${action}')">Yes, ${action}</button>
                <button class="btn-cancel" onclick="hideInlineConfirmation('${complaintId}')">Cancel</button>
            </div>
        </div>
    `;
    
    // Add overlay to complaint card
    complaintCard.style.position = 'relative';
    complaintCard.appendChild(confirmationOverlay);
    
    // Trigger animation
    setTimeout(() => {
        confirmationOverlay.classList.add('show');
    }, 10);
}

// Function to hide inline confirmation
function hideInlineConfirmation(complaintId) {
    const complaintCard = document.querySelector(`[data-complaint-id="${complaintId}"]`);
    if (!complaintCard) return;
    
    const confirmationOverlay = complaintCard.querySelector('.inline-confirmation');
    if (confirmationOverlay) {
        confirmationOverlay.classList.remove('show');
        setTimeout(() => {
            confirmationOverlay.remove();
        }, 300);
    }
}

// Function to execute the confirmed action
async function executeAction(complaintId, action) {
    hideInlineConfirmation(complaintId);
    
    if (action === 'Resolve') {
        await performResolveComplaint(complaintId);
    } else if (action === 'Dismiss') {
        await performDismissComplaint(complaintId);
    }
}

// Updated resolve complaint function without pop-ups
async function resolveComplaint(complaintId) {
    showInlineConfirmation(complaintId, 'Resolve');
}

// Actual resolve function that performs the API call
async function performResolveComplaint(complaintId) {
    try {
        const response = await fetch(`/adminD/complaints/${complaintId}/resolve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                resolution: 'Complaint resolved by admin'
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotificationBanner('Complaint resolved successfully!', 'success');
            setTimeout(() => location.reload(), 1500); // Refresh after showing success
        } else {
            showNotificationBanner(data.error || 'Failed to resolve complaint', 'error');
        }
    } catch (error) {
        console.error('Error resolving complaint:', error);
        showNotificationBanner('An error occurred while resolving the complaint', 'error');
    }
}

// Function to dismiss complaint with inline confirmation
async function dismissComplaint(complaintId) {
    showInlineConfirmation(complaintId, 'Dismiss');
}

// Actual dismiss function that performs the API call
async function performDismissComplaint(complaintId) {
    try {
        const response = await fetch(`/adminD/complaints/${complaintId}/dismiss`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                reason: 'Complaint dismissed by admin'
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotificationBanner('Complaint dismissed successfully!', 'success');
            setTimeout(() => location.reload(), 1500); // Refresh after showing success
        } else {
            showNotificationBanner(data.error || 'Failed to dismiss complaint', 'error');
        }
    } catch (error) {
        console.error('Error dismissing complaint:', error);
        showNotificationBanner('An error occurred while dismissing the complaint', 'error');
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