document.addEventListener("DOMContentLoaded", () => {
  const sortSelect = document.getElementById("sortSelect");
  const searchInput = document.getElementById("searchInput");
  const jobList = document.getElementById("jobList");
  const jobTypeSelect = document.getElementById("jobTypeSelect");
  const remoteCheckbox = document.getElementById("remoteCheckbox");
  let allJobs = [];

  // Fetch jobs from API and render them
  async function loadJobs() {
    try {
      const res = await fetch('/jobs/api');
      const data = await res.json();
      if (!data.success) return;

      // Clear existing jobList and build cards
      jobList.innerHTML = '<h1>Available Positions</h1>';
      data.jobs.forEach((job) => {
        const card = buildJobCard(job);
        jobList.appendChild(card);
        allJobs.push(card);
      });

      // After creating nodes, initialize tag listeners
      initSkillTagListeners();
      applyFiltersAndSort();
    } catch (err) {
      console.error('Failed to load jobs', err);
      jobList.innerHTML = '<h1>Available Positions</h1><p style="color:#666">Failed to load jobs.</p>';
    }
  }

  // Build a job-card DOM node from job JSON
  function buildJobCard(job) {
    const wrapper = document.createElement('div');
    wrapper.className = 'job-card';
    wrapper.dataset.jobId = job.jobId;

    wrapper.innerHTML = `
      <div class="job-img-container">
        <img src="${job.imageUrl}" alt="${job.title}" class="job-img" />
      </div>
      <div class="job-info">
        <h2 class="job-title">${job.title} ( ${job.experienceLevel} )</h2>
        <div class="job-price">₹${Number(job.budget?.amount || 0).toLocaleString()} (${job.budget?.period || 'fixed'})</div>
        <div class="job-tech">
          ${ (job.description?.skills || []).slice(0,3).map(s => `<span class="tech-tag">${s}</span>`).join('') }
        </div>
        <div class="job-meta">
          <span class="location"><i class="fas fa-map-marker-alt"></i> ${job.location || 'Not specified'}</span>
          <span class="location"><i class="fas fa-user-tie"></i> ${job.experienceLevel || 'Not specified'}</span>
          <span><i class="fas fa-home"></i> ${job.remote ? 'Remote' : ''}</span>
          <span class="work"><i class="fas fa-briefcase"></i> ${job.jobType || ''}</span>
          <span class="clock"><i class="fas fa-clock"></i> Posted ${new Date(job.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>
      <div class="job-actions">
        <span class="applications-count">${job.applicationCount || 0} applicants</span>
        <a href="/jobs/${job.jobId}"><button class="see-more-btn">See More</button></a>
      </div>
    `;

    return wrapper;
  }

  // Handle checkbox groups with single selection for experience level
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
  function initSkillTagListeners() {
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach((tag) => {
      tag.removeEventListener('click', tag._skillHandler);
      const handler = () => {
        tag.classList.toggle('selected');
        applyFiltersAndSort();
      };
      tag.addEventListener('click', handler);
      tag._skillHandler = handler;
    });
  }

  // Event listeners
  sortSelect.addEventListener("change", applyFiltersAndSort);
  jobTypeSelect.addEventListener("change", applyFiltersAndSort);
  remoteCheckbox.addEventListener("change", applyFiltersAndSort);

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
      const jobTitle = job
        .querySelector(".job-title")
        .textContent.toLowerCase();
      const company = job.querySelector(".job-img").alt.toLowerCase();
      const skills = Array.from(job.querySelectorAll(".tech-tag")).map((tag) =>
        tag.textContent.toLowerCase()
      );

      return (
        jobTitle.includes(searchTerm) ||
        company.includes(searchTerm) ||
        skills.some((skill) => skill.includes(searchTerm))
      );
    });
  }

  // Main filter and sort function
  function applyFiltersAndSort() {
    // Get selected filters
    const selectedExperience = document.querySelector(
      ".filter-section:nth-of-type(2) .checkbox-group input:checked"
    )?.value || "";

    const selectedJobType = jobTypeSelect.value;
    const isRemote = remoteCheckbox.checked;

    const selectedSkills = Array.from(
      document.querySelectorAll(".skill-tag.selected")
    ).map((tag) => tag.textContent.trim().toLowerCase());

    const sortBy = sortSelect.value;
    const searchTerm = searchInput.value;

  // Filter jobs
  let filteredJobs = [...allJobs];

    // Apply search
    filteredJobs = performSearch(filteredJobs, searchTerm);

    // Apply experience filter
    if (selectedExperience) {
      filteredJobs = filteredJobs.filter((job) => {
        const jobTitle = job
          .querySelector(".job-title")
          .textContent.toLowerCase();
        return (
          (selectedExperience === "entry" && jobTitle.includes("entry")) ||
          (selectedExperience === "mid" && jobTitle.includes("mid")) ||
          (selectedExperience === "senior" && jobTitle.includes("senior"))
        );
      });
    }

    // Apply job type filter
    if (selectedJobType) {
      filteredJobs = filteredJobs.filter((job) => {
        const jobType = job.querySelector(".work").textContent.toLowerCase();
        return jobType.includes(selectedJobType);
      });
    }

    // Apply remote filter
    if (isRemote) {
      filteredJobs = filteredJobs.filter((job) => {
        const remoteText = job.querySelector(".job-meta").textContent.toLowerCase();
        return remoteText.includes("(remote)");
      });
    }

    // Apply skills filter
    if (selectedSkills.length > 0) {
      filteredJobs = filteredJobs.filter((job) => {
        const jobSkills = Array.from(job.querySelectorAll(".tech-tag")).map(
          (tag) => tag.textContent.trim().toLowerCase()
        );
        return selectedSkills.every((skill) => jobSkills.includes(skill));
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
      filteredJobs.forEach((job) => jobList.appendChild(job));
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
    const dateText = job.querySelector(".clock").textContent;
    const dateMatch = dateText.match(/(\w+\s\d{1,2},\s\d{4})/);
    return dateMatch ? new Date(dateMatch[0]).getTime() : 0;
  }

  function countStars(job) {
    const starRating = job.querySelector(".star-rating");
    return starRating ? starRating.textContent.split("★").length - 1 : 0;
  }

  // Initialize filters
  setupCheckboxFilters(
    ".filter-section:nth-of-type(2) .checkbox-group input",
    true
  );

    // Start by loading jobs from API
    loadJobs();
  });