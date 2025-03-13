let selectedSkills = new Set();
let selectedTypes = new Set();
let selectedExperience = new Set();
let currentSort = 'date';

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    renderJobs(jobs);
});

function setupEventListeners() {
    document.getElementById('sortSelect').addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderJobs(filterAndSortJobs());
    });

    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('selected');
            const skill = tag.textContent;
            selectedSkills.has(skill) ? selectedSkills.delete(skill) : selectedSkills.add(skill);
            renderJobs(filterAndSortJobs());
        });
    });

    document.querySelectorAll('.filter-section').forEach(section => {
        const checkboxes = section.querySelectorAll('input[type="checkbox"]');
        const groupTitle = section.querySelector('h3').textContent.toLowerCase();
        const isExperience = groupTitle.includes('experience');
        const isJobType = groupTitle.includes('job type');
        
        if (isExperience || isJobType) {
            const targetSet = isExperience ? selectedExperience : selectedTypes;

            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) {
                        checkboxes.forEach(otherCheckbox => {
                            if (otherCheckbox !== checkbox) {
                                otherCheckbox.checked = false;
                            }
                        });
                        targetSet.clear();
                        targetSet.add(checkbox.value);
                    } else {
                        targetSet.delete(checkbox.value);
                    }
                    renderJobs(filterAndSortJobs());
                });
            });
        }
    });
}

function filterAndSortJobs() {
    let filteredJobs = jobs.filter(job => {
        if (selectedSkills.size > 0 && !job.skills.some(skill => selectedSkills.has(skill))) return false;
        if (selectedTypes.size > 0 && !selectedTypes.has(job.type)) return false;
        if (selectedExperience.size > 0 && !selectedExperience.has(job.experience)) return false;
        return true;
    });

    return filteredJobs.sort((a, b) => {
        switch (currentSort) {
            case 'salary-desc': return parseInt(b.salary.split('-')[1]) - parseInt(a.salary.split('-')[1]);
            case 'salary-asc': return parseInt(a.salary.split('-')[0]) - parseInt(b.salary.split('-')[0]);
            case 'stars': return b.stars - a.stars;
            case 'date': return new Date(b.date) - new Date(a.date);
            default: return 0;
        }
    });
}

function renderJobs(jobsToRender) {
    const jobList = document.getElementById('jobList');
    jobList.innerHTML = '<h1>Available Positions</h1>';
    
    jobsToRender.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.innerHTML = `
            <div class="job-img-container">
                <img src="company_logo.jpg" alt="Company" class="job-img">
            </div>
            <div class="job-info">
                <h2 class="job-title">${job.title}</h2>
                <div class="job-price">$${job.salary}</div>
                <div class="job-tech">${job.skills.map(skill => `<span class="tech-tag">${skill}</span>`).join('')}</div>
                <div class="job-meta">
                    <span class="job-location"><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                    <span class="job-type"><i class="fas fa-briefcase"></i> ${job.type}</span>
                    <span class="job-date"><i class="fas fa-clock"></i> Posted ${Math.ceil((new Date() - new Date(job.date)) / (1000 * 60 * 60 * 24))} days ago</span>
                </div>
                <div class="star-rating">${'★'.repeat(job.stars)}${'☆'.repeat(5 - job.stars)}</div>
            </div>
            <div class="job-actions">
                <span class="applications-count">${Math.floor(Math.random() * 70) + 10} applicants</span>
                <button class="see-more-btn">See More</button>
            </div>
        `;
        jobList.appendChild(jobCard);
    });
}