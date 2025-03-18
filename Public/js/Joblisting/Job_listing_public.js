document.addEventListener("DOMContentLoaded", () => {
  const sortSelect = document.getElementById("sortSelect");
  const searchInput = document.getElementById("searchInput");
  const jobList = document.getElementById("jobList");
  const allJobs = Array.from(document.querySelectorAll(".job-card"));

  // Handle single-select checkboxes
  const handleSingleSelect = (selector) => {
    document.querySelectorAll(selector).forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        if (e.target.checked) {
          document.querySelectorAll(selector).forEach((box) => {
            if (box !== e.target) box.checked = false;
          });
        }
        applyFiltersAndSort();
      });
    });
  };

  // Skill tags toggle
  const skillTags = document.querySelectorAll(".skill-tag");
  skillTags.forEach((tag) => {
    tag.addEventListener("click", () => {
      tag.classList.toggle("selected");
      applyFiltersAndSort();
    });
  });

  // Event listeners
  sortSelect.addEventListener("change", () => applyFiltersAndSort());

  let searchTimeout;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      applyFiltersAndSort();
    }, 300);
  });

  // Search functionality
  function performSearch(searchTerm) {
    searchTerm = searchTerm.toLowerCase().trim();
    if (!searchTerm) return allJobs;

    return allJobs.filter((job) => {
      const jobTitle = job
        .querySelector(".job-title")
        .textContent.toLowerCase();
      return jobTitle.includes(searchTerm);
    });
  }

  // Main filter and sort function
  function applyFiltersAndSort() {
    const selectedExperience =
      document.querySelector(
        ".filter-section:nth-of-type(2) .checkbox-group input:checked"
      )?.value || "";
    const selectedJobType =
      document.querySelector(
        ".filter-section:nth-of-type(4) .checkbox-group input:checked"
      )?.value || "";
    const selectedSkills = Array.from(
      document.querySelectorAll(".skill-tag.selected")
    ).map((tag) => tag.textContent.trim().toLowerCase());
    const sortBy = sortSelect.value;
    const searchTerm = searchInput.value;

    // Apply search first
    let filteredJobs = performSearch(searchTerm);

    // Apply additional filters
    filteredJobs = filteredJobs.filter((job) => {
      const jobTitle = job
        .querySelector(".job-title")
        .textContent.toLowerCase();
      const matchesExperience =
        !selectedExperience ||
        (selectedExperience === "entry" && jobTitle.includes("entry")) ||
        (selectedExperience === "mid" && jobTitle.includes("mid")) ||
        (selectedExperience === "senior" && jobTitle.includes("senior"));

      const jobType = job.querySelector(".work").textContent.toLowerCase();
      const matchesJobType =
        !selectedJobType || jobType.includes(selectedJobType);

      const jobSkills = Array.from(job.querySelectorAll(".tech-tag")).map(
        (tag) => tag.textContent.trim().toLowerCase()
      );
      const matchesSkills =
        selectedSkills.length === 0 ||
        selectedSkills.every((skill) => jobSkills.includes(skill));

      return matchesExperience && matchesJobType && matchesSkills;
    });

    // Sort filtered results
    filteredJobs.sort((a, b) => {
      const salaryA = extractSalary(a);
      const salaryB = extractSalary(b);
      const dateA = extractDate(a);
      const dateB = extractDate(b);
      const starsA = countStars(a);
      const starsB = countStars(b);

      switch (sortBy) {
        case "salary-desc":
          return salaryB - salaryA;
        case "salary-asc":
          return salaryA - salaryB;
        case "date":
          return dateB - dateA;
        case "stars":
          return starsB - starsA;
        default:
          return 0;
      }
    });

    // Update display
    jobList.innerHTML = "<h1>Available Positions</h1>";
    if (filteredJobs.length === 0) {
      const noResults = document.createElement("div");
      noResults.className = "no-results";
      noResults.style.textAlign = "center";
      noResults.style.padding = "20px";
      noResults.style.color = "#666";
      noResults.innerHTML = `
                <h3>No matching jobs found</h3>
                <p>Try different keywords or remove search filters</p>
            `;
      jobList.appendChild(noResults);
    } else {
      filteredJobs.forEach((job) => jobList.appendChild(job));
    }
  }

  // Utility functions
  function extractSalary(job) {
    const salaryText = job.querySelector(".job-price").textContent;
    const salaryNumbers = salaryText.replace(/₹|,/g, "").match(/\d+/g);

    if (salaryNumbers && salaryNumbers.length === 2) {
      return (parseInt(salaryNumbers[0]) + parseInt(salaryNumbers[1])) / 2;
    } else if (salaryNumbers && salaryNumbers.length === 1) {
      return parseInt(salaryNumbers[0]);
    }
    return 0;
  }

  function extractDate(job) {
    const dateText = job.querySelector(".clock").textContent.match(/\d+/);
    return dateText ? parseInt(dateText[0]) : 0;
  }

  function countStars(job) {
    return job.querySelector(".star-rating").textContent.split("★").length - 1;
  }
  handleSingleSelect(".filter-section:nth-of-type(2) .checkbox-group input");
  handleSingleSelect(".filter-section:nth-of-type(4) .checkbox-group input");

  applyFiltersAndSort();
});
