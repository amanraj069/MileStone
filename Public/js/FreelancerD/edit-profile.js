document.addEventListener('DOMContentLoaded', function() {
    // Load saved profile data
    loadSavedProfileData();

    // Add skill button
    document.getElementById('addSkillBtn').addEventListener('click', function() {
        const skillsContainer = document.getElementById('skillsContainer');
        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.className = 'skill-input';
        newInput.placeholder = 'Enter skill';
        skillsContainer.insertBefore(newInput, this);
    });

    // Add experience button
    document.getElementById('addExperienceBtn').addEventListener('click', function() {
        const experienceContainer = document.getElementById('experienceContainer');
        const newItem = document.createElement('div');
        newItem.className = 'experience-item';
        newItem.innerHTML = `
            <input type="text" class="experience-title" placeholder="Title">
            <input type="text" class="experience-date" placeholder="Date">
            <textarea class="experience-description" rows="3" placeholder="Description"></textarea>
        `;
        experienceContainer.insertBefore(newItem, this);
    });

    // Add education button
    document.getElementById('addEducationBtn').addEventListener('click', function() {
        const educationContainer = document.getElementById('educationContainer');
        const newItem = document.createElement('div');
        newItem.className = 'education-item';
        newItem.innerHTML = `
            <input type="text" class="education-title" placeholder="Degree">
            <input type="text" class="education-institution" placeholder="Institution">
            <input type="text" class="education-date" placeholder="Date">
        `;
        educationContainer.insertBefore(newItem, this);
    });

    // Add portfolio button
    document.getElementById('addPortfolioBtn').addEventListener('click', function() {
        const portfolioContainer = document.getElementById('portfolioContainer');
        const newItem = document.createElement('div');
        newItem.className = 'portfolio-item';
        newItem.innerHTML = `
            <input type="url" class="portfolio-image" placeholder="Image URL">
            <input type="text" class="portfolio-title" placeholder="Title">
            <textarea class="portfolio-description" rows="3" placeholder="Description"></textarea>
            <input type="url" class="portfolio-link" placeholder="Link">
        `;
        portfolioContainer.insertBefore(newItem, this);
    });

    // Handle form submission
    const profileEditForm = document.getElementById('profileEditForm');
    profileEditForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveProfileData();
        window.location.href = '/freelancerD/profile';
    });
});

function loadSavedProfileData() {
    const savedProfile = localStorage.getItem('freelancerProfile');
    if (savedProfile) {
        const profileData = JSON.parse(savedProfile);

        setInputValue('name', profileData.name);
        setInputValue('title', profileData.title);
        setInputValue('location', profileData.location);
        setInputValue('email', profileData.email);
        setInputValue('phone', profileData.phone);
        setInputValue('profileImageUrl', profileData.profileImageUrl);
        setTextareaValue('about', profileData.about);
        setInputValue('projects', profileData.projects);
        setInputValue('resumeLink', profileData.resumeLink);

        // Load skills
        const skillsContainer = document.getElementById('skillsContainer');
        skillsContainer.innerHTML = '';
        (profileData.skills || []).forEach(skill => {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'skill-input';
            input.value = skill;
            skillsContainer.appendChild(input);
        });
        skillsContainer.appendChild(document.getElementById('addSkillBtn'));

        // Load experience
        const experienceContainer = document.getElementById('experienceContainer');
        experienceContainer.innerHTML = '';
        (profileData.experience || []).forEach(item => {
            const div = document.createElement('div');
            div.className = 'experience-item';
            div.innerHTML = `
                <input type="text" class="experience-title" value="${item.title}" placeholder="Title">
                <input type="text" class="experience-date" value="${item.date}" placeholder="Date">
                <textarea class="experience-description" rows="3" placeholder="Description">${item.description}</textarea>
            `;
            experienceContainer.appendChild(div);
        });
        experienceContainer.appendChild(document.getElementById('addExperienceBtn'));

        // Load education
        const educationContainer = document.getElementById('educationContainer');
        educationContainer.innerHTML = '';
        (profileData.education || []).forEach(item => {
            const div = document.createElement('div');
            div.className = 'education-item';
            div.innerHTML = `
                <input type="text" class="education-title" value="${item.title}" placeholder="Degree">
                <input type="text" class="education-institution" value="${item.institution}" placeholder="Institution">
                <input type="text" class="education-date" value="${item.date}" placeholder="Date">
            `;
            educationContainer.appendChild(div);
        });
        educationContainer.appendChild(document.getElementById('addEducationBtn'));

        // Load portfolio
        const portfolioContainer = document.getElementById('portfolioContainer');
        portfolioContainer.innerHTML = '';
        (profileData.portfolio || []).forEach(item => {
            const div = document.createElement('div');
            div.className = 'portfolio-item';
            div.innerHTML = `
                <input type="url" class="portfolio-image" value="${item.image}" placeholder="Image URL">
                <input type="text" class="portfolio-title" value="${item.title}" placeholder="Title">
                <textarea class="portfolio-description" rows="3" placeholder="Description">${item.description}</textarea>
                <input type="url" class="portfolio-link" value="${item.link}" placeholder="Link">
            `;
            portfolioContainer.appendChild(div);
        });
        portfolioContainer.appendChild(document.getElementById('addPortfolioBtn'));
    } else {
        setInputValue('profileImageUrl');
    }
}

function saveProfileData() {
    const profileData = {
        name: getInputValue('name'),
        title: getInputValue('title'),
        location: getInputValue('location'),
        email: getInputValue('email'),
        phone: getInputValue('phone'),
        profileImageUrl: getInputValue('profileImageUrl'),
        about: getTextareaValue('about'),
        projects: getInputValue('projects'),
        resumeLink: getInputValue('resumeLink'),
        skills: Array.from(document.querySelectorAll('.skill-input'))
            .map(input => input.value.trim())
            .filter(val => val !== ''),
        experience: Array.from(document.querySelectorAll('.experience-item')).map(item => ({
            title: item.querySelector('.experience-title').value.trim(),
            date: item.querySelector('.experience-date').value.trim(),
            description: item.querySelector('.experience-description').value.trim()
        })),
        education: Array.from(document.querySelectorAll('.education-item')).map(item => ({
            title: item.querySelector('.education-title').value.trim(),
            institution: item.querySelector('.education-institution').value.trim(),
            date: item.querySelector('.education-date').value.trim()
        })),
        portfolio: Array.from(document.querySelectorAll('.portfolio-item'))
            .map(item => ({
                image: item.querySelector('.portfolio-image').value.trim(),
                title: item.querySelector('.portfolio-title').value.trim(),
                description: item.querySelector('.portfolio-description').value.trim(),
                link: item.querySelector('.portfolio-link').value.trim()
            }))
            .filter(item => item.image || item.title || item.description || item.link)
    };

    localStorage.setItem('freelancerProfile', JSON.stringify(profileData));
}

function getInputValue(id) {
    const input = document.getElementById(id);
    return input ? input.value : '';
}

function setInputValue(id, value) {
    const input = document.getElementById(id);
    if (input && value) {
        input.value = value;
    }
}

function getTextareaValue(id) {
    const textarea = document.getElementById(id);
    return textarea ? textarea.value : '';
}

function setTextareaValue(id, value) {
    const textarea = document.getElementById(id);
    if (textarea && value) {
        textarea.value = value;
    }
}