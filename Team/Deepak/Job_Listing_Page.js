
const jobs = [
    {
        id: 1,
        title: "Senior Frontend Developer",
        company: "TechCorp",
        salary: 120000,
        date: "2024-02-19",
        stars: 4,
        skills: ["JavaScript", "React", "Node.js"],
        type: "full-time",
        experience: "senior",
        location: "Remote"
    },
    {
        id: 2,
        title: "Python Backend Engineer",
        company: "DataSys",
        salary: 110000,
        date: "2024-02-18",
        stars: 3,
        skills: ["Python", "SQL", "AWS"],
        type: "full-time",
        experience: "mid",
        location: "New York, NY"
    },
    
];


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
            if (selectedSkills.has(skill)) {
                selectedSkills.delete(skill);
            } else {
                selectedSkills.add(skill);
            }
            renderJobs(filterAndSortJobs());
        });
    });


    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const value = checkbox.value;
            const group = checkbox.closest('.filter-section').querySelector('h3').textContent.toLowerCase();
            
            if (group.includes('job type')) {
                if (checkbox.checked) {
                    selectedTypes.add(value);
                } else {
                    selectedTypes.delete(value);
                }
            } else if (group.includes('experience')) {
                if (checkbox.checked) {
                    selectedExperience.add(value);
                } else {
                    selectedExperience.delete(value);
                }
            }
            
            renderJobs(filterAndSortJobs());
        });
    });
}

function filterAndSortJobs() {
    let filteredJobs = jobs.filter(job => {

        if (selectedSkills.size > 0) {
            if (!job.skills.some(skill => selectedSkills.has(skill))) {
                return false;
            }
        }

        if (selectedTypes.size > 0) {
            if (!selectedTypes.has(job.type)) {
                return false;
            }
        }

        if (selectedExperience.size > 0) {
            if (!selectedExperience.has(job.experience)) {
                return false;
            }
        }

        return true;
    });

    return filteredJobs.sort((a, b) => {
        switch (currentSort) {
            case 'salary-desc':
                return b.salary - a.salary;
            case 'salary-asc':
                return a.salary - b.salary;
            case 'stars':
                return b.stars - a.stars;
            case 'date':
                return new Date(b.date) - new Date(a.date);
            default:
                return 0;
        }
    });
}

function renderJobs(jobsToRender) {
    const jobList = document.getElementById('jobList');
    jobList.innerHTML = '';

    jobsToRender.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        
        jobCard.innerHTML = `
            <div class="job-header">
                <div>
                    <h3 class="job-title">${job.title}</h3>
                    <p class="company-name">${job.company}</p>
                </div>
                <button class="star-button" data-stars="${job.stars}">
                    ${'★'.repeat(job.stars)}${'☆'.repeat(5-job.stars)}
                </button>
            </div>
            <p class="job-salary">$${job.salary.toLocaleString()} per year</p>
            <div class="job-tags">
                ${job.skills.map(skill => `<span class="job-tag">${skill}</span>`).join('')}
                <span class="job-tag">${job.type}</span>
                <span class="job-tag">${job.location}</span>
            </div>
        `;
        
        jobList.appendChild(jobCard);
    });
}