function validateSearch() {
  const searchInput = document.getElementById("searchInput").value.trim();
  if (searchInput.length < 1) {
    alert("Please enter a search term");
    return false;
  }
  return true;
}

function initChat(userId) {
  console.log("Initiating chat with userId:", userId); // Debugging
  if (!userId || userId === "default") {
    alert("Unable to start chat: Invalid user ID");
    return;
  }
  window.location.href = `/chat/${userId}`;
}

async function deleteEmployer(userId) {
  if (confirm("Are you sure you want to delete this employer?")) {
    try {
      const response = await fetch(`/adminD/employers/${userId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        window.location.reload();
      } else {
        alert(result.message || "Failed to delete employer");
      }
    } catch (error) {
      console.error("Error deleting employer:", error);
      alert("Server error");
    }
  }
}

function editRating(userId, currentRating, userType) {
  const newRating = prompt(
    `Enter new rating for this ${userType} (1-5):`,
    currentRating
  );

  if (newRating === null) return; // User cancelled

  const rating = parseFloat(newRating);

  if (isNaN(rating) || rating < 1 || rating > 5) {
    alert("Please enter a valid rating between 1 and 5");
    return;
  }

  updateRating(userId, rating, userType);
}

async function updateRating(userId, rating, userType) {
  try {
    const endpoint =
      userType === "freelancer"
        ? `/adminD/freelancers/${userId}/rating`
        : `/adminD/employers/${userId}/rating`;

    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating }),
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);
      window.location.reload();
    } else {
      alert(result.message || `Failed to update ${userType} rating`);
    }
  } catch (error) {
    console.error(`Error updating ${userType} rating:`, error);
    alert("Server error");
  }
}