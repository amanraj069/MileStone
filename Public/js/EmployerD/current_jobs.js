document.addEventListener("DOMContentLoaded", function () {
  const jobCards = document.querySelectorAll(".job-card");
  const searchInput = document.querySelector(".search-input");
  const filterButtons = document.querySelectorAll(".filter-btn");

  const jobData = [];
  jobCards.forEach((card) => {
    const jobTitle = card.querySelector(".job-title")?.textContent || "";
    const jobType = card.querySelector(".job-type")?.textContent.trim() || "";
    const jobLocation =
      card.querySelector(".job-location")?.textContent.trim() || "";
    const skills = card.querySelector(".skill-tag")
      ? Array.from(card.querySelectorAll(".skill-tag")).map((tag) =>
          tag.textContent.toLowerCase()
        )
      : [];

    jobData.push({
      element: card,
      title: jobTitle.toLowerCase(),
      type: jobType.toLowerCase(),
      location: jobLocation.toLowerCase(),
      skills: skills,
      isRemote: jobLocation.toLowerCase().includes("remote"),
    });
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      const filterType = this.textContent.trim().toLowerCase();
      applyFilters(filterType, searchInput.value.trim());
    });
  });

  function applyFilters(filterType, searchTerm) {
    searchTerm = searchTerm.toLowerCase();

    jobData.forEach((job) => {
      const element = job.element;
      let filterMatch = false;
      let searchMatch = false;

      if (filterType === "all jobs") {
        filterMatch = true;
      } else if (filterType === "remote" && job.isRemote) {
        filterMatch = true;
      } else if (filterType === "full-time" && job.type.includes("full-time")) {
        filterMatch = true;
      } else if (filterType === "part-time" && job.type.includes("part-time")) {
        filterMatch = true;
      } else if (filterType === "recent") {
        filterMatch = true;
      }

      if (searchTerm === "") {
        searchMatch = true;
      } else {
        searchMatch =
          job.title.includes(searchTerm) ||
          job.skills.some((skill) => skill.includes(searchTerm)) ||
          job.location.includes(searchTerm);
      }

      element.style.display = filterMatch && searchMatch ? "flex" : "none";
    });
  }

  searchInput.addEventListener("input", function () {
    const activeFilter =
      document
        .querySelector(".filter-btn.active")
        ?.textContent.trim()
        .toLowerCase() || "all jobs";
    applyFilters(activeFilter, this.value.trim());
  });

  searchInput.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      const visibleCount = document.querySelectorAll(
        '.job-card[style="display: flex;"]'
      ).length;
      alert(`Found ${visibleCount} jobs matching "${this.value}"`);
    }
  });

  const complainButtons = document.querySelectorAll(".raise-complaint-btn");
  const chatButtons = document.querySelectorAll(".chat-btn");
  const seeMoreButtons = document.querySelectorAll(".see-more-btn");
  const markFinishedButtons = document.querySelectorAll(".mark-finished-btn");

  complainButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const jobId = button.getAttribute('data-job-id');
      const freelancerId = button.getAttribute('data-freelancer-id');
      
      const complaintType = prompt("Please enter the type of complaint (e.g., 'Quality Issue', 'Communication Problem', 'Deadline Issue'):");
      if (!complaintType) return;
      
      const issue = prompt("Please describe the issue in detail:");
      if (!issue) return;
      
      try {
        const response = await fetch(`/employerD/current_jobs/complain/${jobId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            complaintType: complaintType,
            againstUser: freelancerId,
            issue: issue
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          alert("Complaint submitted successfully! Our team will review it shortly.");
        } else {
          alert(data.error || "Failed to submit complaint. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting complaint:", error);
        alert("An error occurred while submitting the complaint.");
      }
    });
  });

  chatButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const jobTitle = button
        .closest(".job-card")
        .querySelector(".job-title").textContent;
      alert(`Opening chat for "${jobTitle}".`);
    });
  });

  seeMoreButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const jobTitle = button
        .closest(".job-card")
        .querySelector(".job-title").textContent;
      window.location.href = "current_job_see_more.html";
    });
  });

  markFinishedButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (confirm("Are you sure you want to mark this job as finished?")) {
        button.closest(".job-card").style.display = "none";
        alert("Job marked as finished!");
      }
    });
  });
});
