function validateSearch() {
  const searchInput = document.getElementById("searchInput").value.trim();
  if (searchInput.length < 1) {
    alert("Please enter a search term");
    return false;
  }
  return true;
}

async function deleteFreelancer(userId) {
  if (confirm("Are you sure you want to delete this freelancer?")) {
    try {
      const response = await fetch(`/adminD/freelancers/${userId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        window.location.reload();
      } else {
        alert(result.message || "Failed to delete freelancer");
      }
    } catch (error) {
      console.error(error);
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