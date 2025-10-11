function confirmDelete(skillId, skillName) {
  if (
    confirm(
      `Are you sure you want to delete the skill "${skillName}" and its quiz?`
    )
  ) {
    fetch(`/adminD/quizzes/${skillId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while deleting the skill.");
      });
  }
}