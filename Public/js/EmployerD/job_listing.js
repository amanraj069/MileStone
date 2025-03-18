document.addEventListener("DOMContentLoaded", function () {
  const jobCards = document.querySelectorAll(".job-card");
  const searchInput = document.querySelector(".search-input");
  const filterButtons = document.querySelectorAll(".filter-btn");

  // Initialize job data for filtering
  const jobData = [];
  jobCards.forEach((card) => {
    const jobTitle = card.querySelector(".job-title").textContent;
    const jobType = card.querySelector(".job-type").textContent.trim();
    const jobLocation = card.querySelector(".job-location").textContent.trim();
    const jobDate = card.querySelector(".job-date").textContent.trim();
    const isRemote = jobLocation.includes("Remote");

    jobData.push({
      element: card,
      title: jobTitle.toLowerCase(),
      type: jobType.toLowerCase(),
      isRemote: isRemote,
      date: jobDate,
    });
  });

  // Filter functionality
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Update active button styling
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      const filterType = this.textContent.trim();

      // Filter jobs based on selected filter
      jobData.forEach((job) => {
        const element = job.element;

        if (filterType === "All Jobs") {
          element.style.display = "flex";
        } else if (filterType === "Remote" && job.isRemote) {
          element.style.display = "flex";
        } else if (
          filterType === "Full-time" &&
          job.type.includes("full-time")
        ) {
          element.style.display = "flex";
        } else if (
          filterType === "Part-time" &&
          job.type.includes("part-time")
        ) {
          element.style.display = "flex";
        } else if (filterType === "Recent" && job.date.includes("days ago")) {
          // Assuming "Recent" means posted within the last week
          const daysMatch = job.date.match(/(\d+) days ago/);
          if (daysMatch && parseInt(daysMatch[1]) <= 7) {
            element.style.display = "flex";
          } else {
            element.style.display = "none";
          }
        } else {
          element.style.display = "none";
        }
      });

      // Apply search filter as well if there's text in the search input
      if (searchInput.value.trim()) {
        applySearchFilter();
      }
    });
  });

  // Search functionality
  function applySearchFilter() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    jobData.forEach((job) => {
      // Only filter visible elements (respecting the currently active filter button)
      if (job.element.style.display !== "none") {
        if (searchTerm === "" || job.title.includes(searchTerm)) {
          job.element.style.display = "flex";
        } else {
          job.element.style.display = "none";
        }
      }
    });
  }

  searchInput.addEventListener("keyup", function (e) {
    applySearchFilter();

    // If Enter is pressed, show a message
    if (e.key === "Enter") {
      const visibleCount = document.querySelectorAll(
        '.job-card[style="display: flex;"]'
      ).length;
      alert(`Found ${visibleCount} jobs matching "${this.value}"`);
    }
  });

  // See More buttons
  const seeMoreButtons = document.querySelectorAll(".see-more-btn");
  seeMoreButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const jobTitle =
        this.closest(".job-card").querySelector(".job-title").textContent;
    });
  });
});
