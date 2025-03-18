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

  const complainButtons = document.querySelectorAll(".complain-btn");
  const chatButtons = document.querySelectorAll(".chat-btn");
  const seeMoreButtons = document.querySelectorAll(".see-more-btn");
  const markFinishedButtons = document.querySelectorAll(".mark-finished-btn");

  complainButtons.forEach((button) => {
    button.addEventListener("click", () => {
      alert(
        "Complaint submitted for this freelancer. Our team will review it shortly."
      );
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
