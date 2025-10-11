async function leaveJob(jobId) {
  if (confirm("Are you sure you want to leave this job?")) {
    try {
      const response = await fetch(`/freelancerD/active_job/leave/${jobId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        document.querySelector(`.job-card[data-job-id="${jobId}"]`).remove();
      } else {
        alert(data.error || "Failed to leave the job. Please try again.");
      }
    } catch (error) {
      console.error("Error leaving job:", error);
      alert("An error occurred. Please try again.");
    }
  }
}

function raiseComplaint(jobId) {
  // Redirect to the dedicated complaint submission page
  window.location.href = `/freelancerD/submit-complaint/${jobId}`;
}