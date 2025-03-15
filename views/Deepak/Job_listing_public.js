const sortSelect = document.getElementById('sortSelect');
const jobList = document.getElementById('jobList');

sortSelect.addEventListener('change', () => {
    const jobs = Array.from(document.querySelectorAll('.job-card'));
    const sortBy = sortSelect.value;

    jobs.sort((a, b) => {
        const salaryA = extractSalary(a);
        const salaryB = extractSalary(b);
        const dateA = extractDate(a);
        const dateB = extractDate(b);
        const starsA = countStars(a);
        const starsB = countStars(b);

        switch (sortBy) {
            case 'salary-desc': return salaryB - salaryA;
            case 'salary-asc': return salaryA - salaryB;
            case 'date': return dateB - dateA;
            case 'stars': return starsB - starsA;
        }
    });

    jobList.innerHTML = '<h1>Available Positions</h1>';
    jobs.forEach(job => jobList.appendChild(job));
});


function extractSalary(job) {
    const salaryText = job.querySelector('.job-price').textContent;
    const salaryNumbers = salaryText
        .replace(/₹|,/g, '') 
        .match(/\d+/g); 

    if (salaryNumbers && salaryNumbers.length === 2) {
        return (parseInt(salaryNumbers[0]) + parseInt(salaryNumbers[1])) / 2; // Average of range
    } else if (salaryNumbers && salaryNumbers.length === 1) {
        return parseInt(salaryNumbers[0]);
    }
    return 0;
}

function extractDate(job) {
    const dateText = job.querySelector('.clock').textContent.match(/\d+/);
    return dateText ? parseInt(dateText[0]) : 0;
}

function countStars(job) {
    return job.querySelector('.star-rating').textContent.split('★').length - 1;
}


const handleSingleSelect = (selector) => {
    document.querySelectorAll(selector).forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.querySelectorAll(selector).forEach(box => {
                    if (box !== e.target) box.checked = false;
                });
            }
        });
    });
};

handleSingleSelect('.filter-section:nth-of-type(2) .checkbox-group input');
handleSingleSelect('.filter-section:nth-of-type(4) .checkbox-group input');

const skillTags = document.querySelectorAll('.skill-tag');
skillTags.forEach(tag => {
    tag.addEventListener('click', () => {
        tag.classList.toggle('selected');
    });
});
