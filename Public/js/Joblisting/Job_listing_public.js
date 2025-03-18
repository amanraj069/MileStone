// Job_listing_public.js
document.addEventListener("DOMContentLoaded", () => {
  const sortSelect = document.getElementById("sortSelect");
  const searchInput = document.getElementById("searchInput");
  const jobList = document.getElementById("jobList");
  const allJobs = Array.from(document.querySelectorAll(".job-card"));

  // Handle checkbox groups
  const setupCheckboxFilters = (selector, singleSelect = false) => {
    const checkboxes = document.querySelectorAll(selector);
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        if (singleSelect && e.target.checked) {
          checkboxes.forEach((box) => {
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
  sortSelect.addEventListener("change", applyFiltersAndSort);
  
  let searchTimeout;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(applyFiltersAndSort, 300);
  });

  // Search functionality
  function performSearch(jobs, searchTerm) {
    searchTerm = searchTerm.toLowerCase().trim();
    if (!searchTerm) return jobs;

    return jobs.filter((job) => {
      const jobTitle = job.querySelector(".job-title").textContent.toLowerCase();
      const company = job.querySelector(".job-img").alt.toLowerCase();
      const skills = Array.from(job.querySelectorAll(".tech-tag"))
        .map(tag => tag.textContent.toLowerCase());
      
      return jobTitle.includes(searchTerm) || 
             company.includes(searchTerm) || 
             skills.some(skill => skill.includes(searchTerm));
    });
  }

  // Main filter and sort function
  function applyFiltersAndSort() {
    // Get selected filters
    const selectedExperience = document.querySelector(
      ".filter-section:nth-of-type(2) .checkbox-group input:checked"
    )?.value || "";
    
    const selectedJobTypes = Array.from(
      document.querySelectorAll(".filter-section:nth-of-type(4) .checkbox-group input:checked")
    ).map(input => input.value);
    
    const selectedSkills = Array.from(
      document.querySelectorAll(".skill-tag.selected")
    ).map(tag => tag.textContent.trim().toLowerCase());
    
    const sortBy = sortSelect.value;
    const searchTerm = searchInput.value;

    // Filter jobs
    let filteredJobs = [...allJobs];

    // Apply search
    filteredJobs = performSearch(filteredJobs, searchTerm);

    // Apply experience filter
    if (selectedExperience) {
      filteredJobs = filteredJobs.filter((job) => {
        const jobTitle = job.querySelector(".job-title").textContent.toLowerCase();
        return (
          (selectedExperience === "entry" && jobTitle.includes("entry")) ||
          (selectedExperience === "mid" && jobTitle.includes("mid")) ||
          (selectedExperience === "senior" && jobTitle.includes("senior"))
        );
      });
    }

    // Apply job type filter
    if (selectedJobTypes.length > 0) {
      filteredJobs = filteredJobs.filter((job) => {
        const jobType = job.querySelector(".work").textContent.toLowerCase();
        return selectedJobTypes.some(type => jobType.includes(type));
      });
    }

    // Apply skills filter
    if (selectedSkills.length > 0) {
      filteredJobs = filteredJobs.filter((job) => {
        const jobSkills = Array.from(job.querySelectorAll(".tech-tag"))
          .map(tag => tag.textContent.trim().toLowerCase());
        return selectedSkills.every(skill => jobSkills.includes(skill));
      });
    }

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
      jobList.innerHTML += `
        <div class="no-results" style="text-align: center; padding: 20px; color: #666;">
          <h3>No matching jobs found</h3>
          <p>Try different keywords or adjust filters</p>
        </div>
      `;
    } else {
      filteredJobs.forEach(job => jobList.appendChild(job));
    }
  }

  // Utility functions
  function extractSalary(job) {
    const salaryText = job.querySelector(".job-price").textContent;
    const salaryNumbers = salaryText.replace(/[^0-9-]/g, "").match(/\d+/g);
    
    if (salaryNumbers && salaryNumbers.length === 2) {
      return (parseInt(salaryNumbers[0]) + parseInt(salaryNumbers[1])) / 2;
    } else if (salaryNumbers && salaryNumbers.length === 1) {
      return parseInt(salaryNumbers[0]);
    }
    return 0;
  }

  function extractDate(job) {
    const dateText = job.querySelector(".clock").textContent.match(/\d{4}-\d{2}-\d{2}/) || 
                     job.querySelector(".clock").textContent.match(/\d+/);
    return dateText ? new Date(dateText[0]).getTime() : 0;
  }

  function countStars(job) {
    return job.querySelector(".star-rating").textContent.split("★").length - 1;
  }

  // Initialize filters
  setupCheckboxFilters(".filter-section:nth-of-type(2) .checkbox-group input", true); // Single select for experience
  setupCheckboxFilters(".filter-section:nth-of-type(4) .checkbox-group input", false); // Multiple select for job type
  
  // Initial application of filters
  applyFiltersAndSort();
});