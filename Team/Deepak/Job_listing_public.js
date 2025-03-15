let selectedSkills = new Set();
let selectedTypes = new Set();
let selectedExperience = new Set();
let currentSort = 'date';

// Define jobs array in JS for filtering purposes
const jobs = [
    { id: 1, title: "Senior Frontend Developer", salary: "800-1700", date: "2025-03-08", stars: 5, skills: ["React", "TypeScript", "NextJS"], type: "full-time", experience: "senior", location: "Bangalore", applicants: 47 },
    { id: 2, title: "UX/UI Designer", salary: "80-500", date: "2025-03-07", stars: 5, skills: ["Figma", "Adobe XD", "Sketch"], type: "contract", experience: "mid", location: "Mumbai", applicants: 42 },
    { id: 3, title: "Backend Developer", salary: "600-1200", date: "2025-03-03", stars: 5, skills: ["Node.js", "Express", "MongoDB"], type: "full-time", experience: "mid", location: "Remote", applicants: 32 },
    { id: 4, title: "DevOps Engineer", salary: "300-1000", date: "2025-03-05", stars: 5, skills: ["Kubernetes", "Docker", "AWS"], type: "full-time", experience: "senior", location: "Hyderabad", applicants: 66 },
    { id: 5, title: "Full Stack Developer", salary: "700-1500", date: "2025-03-07", stars: 4, skills: ["JavaScript", "Python", "React"], type: "full-time", experience: "mid", location: "Pune", applicants: 55 },
    { id: 6, title: "Data Scientist", salary: "1000-2100", date: "2025-03-07", stars: 5, skills: ["Python", "TensorFlow", "SQL"], type: "full-time", experience: "senior", location: "Bangalore", applicants: 38 },
    { id: 7, title: "Content Writer", salary: "250-500", date: "2025-03-06", stars: 3, skills: ["SEO", "WordPress", "Copywriting"], type: "part-time", experience: "entry", location: "Remote", applicants: 25 },
    { id: 8, title: "Mobile App Developer", salary: "900-2000", date: "2025-03-04", stars: 5, skills: ["React Native", "Flutter", "Firebase"], type: "full-time", experience: "senior", location: "Delhi", applicants: 60 },
    { id: 9, title: "Cloud Architect", salary: "1200-2500", date: "2025-03-08", stars: 5, skills: ["AWS", "Azure", "GCP"], type: "full-time", experience: "senior", location: "Remote", applicants: 72 }
];

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    renderJobs(jobs); // Initial render with filter logic
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
                    <span class="location">${job.location}</span>
                    <span class="work">${job.type}</span>
                    <span class="clock">Posted ${Math.ceil((new Date() - new Date(job.date)) / (1000 * 60 * 60 * 24))} days ago</span>
                </div>
                <div class="star-rating">${'★'.repeat(job.stars)}${'☆'.repeat(5 - job.stars)}</div>
            </div>
            <div class="job-actions">
                <span class="applications-count">${job.applicants} applicants</span>
                <button class="see-more-btn">See More</button>
            </div>
        `;
        jobList.appendChild(jobCard);
    });
}