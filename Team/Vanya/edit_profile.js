document.addEventListener('DOMContentLoaded', () => {
    const editBtn = document.querySelector('.edit-profile-btn');
    const profileContent = document.querySelector('.profile-content');
    let isEditing = false;
    let profileData = {};

    // Initialize profile data from the DOM
    function initializeProfileData() {
        const editableElements = document.querySelectorAll('[data-editable]');
        editableElements.forEach(element => {
            const key = element.getAttribute('data-editable');
            if (key === 'skills') {
                profileData[key] = Array.from(element.querySelectorAll('.skill-tag')).map(tag => tag.textContent);
            } else if (key === 'experience' || key === 'education') {
                profileData[key] = Array.from(element.querySelectorAll('.experience-item, .education-item')).map(item => ({
                    title: item.querySelector('h5').textContent,
                    date: item.querySelector('.experience-date, .education-date').textContent,
                    description: item.querySelector('p') ? item.querySelector('p').textContent : ''
                }));
            } else if (key === 'portfolio') {
                profileData[key] = Array.from(element.querySelectorAll('.portfolio-item')).map(item => ({
                    image: item.querySelector('img').src,
                    title: item.querySelector('h5').textContent,
                    description: item.querySelector('p').textContent,
                    link: item.querySelector('.portfolio-link').href
                }));
            } else {
                profileData[key] = element.textContent.trim();
            }
        });
    }

    // Enable edit mode
    function enableEditMode() {
        const editableElements = document.querySelectorAll('[data-editable]');
        editableElements.forEach(element => {
            const key = element.getAttribute('data-editable');
            if (key === 'name' || key === 'title' || key === 'location' || key === 'rating' || key === 'projects' || key === 'email' || key === 'phone') {
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'editable-field';
                input.value = profileData[key];
                element.innerHTML = '';
                element.appendChild(input);
            } else if (key === 'about') {
                const textarea = document.createElement('textarea');
                textarea.className = 'editable-field';
                textarea.rows = 4;
                textarea.value = profileData[key];
                element.innerHTML = '';
                element.appendChild(textarea);
            } else if (key === 'skills') {
                const skillsContainer = document.createElement('div');
                skillsContainer.className = 'skills-edit';
                profileData[key].forEach(skill => {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'skill-input';
                    input.value = skill;
                    skillsContainer.appendChild(input);
                });
                const addSkillBtn = document.createElement('button');
                addSkillBtn.textContent = 'Add Skill';
                addSkillBtn.addEventListener('click', () => {
                    const newInput = document.createElement('input');
                    newInput.type = 'text';
                    newInput.className = 'skill-input';
                    skillsContainer.appendChild(newInput);
                });
                skillsContainer.appendChild(addSkillBtn);
                element.innerHTML = '';
                element.appendChild(skillsContainer);
            } else if (key === 'experience') {
                const experienceContainer = document.createElement('div');
                experienceContainer.className = 'experience-edit';
                profileData[key].forEach((exp, index) => {
                    const div = document.createElement('div');
                    div.innerHTML = `
                        <input type="text" class="editable-field" value="${exp.title}" placeholder="Title">
                        <input type="text" class="editable-field" value="${exp.date}" placeholder="Date">
                        <textarea class="editable-field" rows="2" placeholder="Description">${exp.description}</textarea>
                    `;
                    experienceContainer.appendChild(div);
                });
                const addExpBtn = document.createElement('button');
                addExpBtn.textContent = 'Add Experience';
                addExpBtn.addEventListener('click', () => {
                    const div = document.createElement('div');
                    div.innerHTML = `
                        <input type="text" class="editable-field" placeholder="Title">
                        <input type="text" class="editable-field" placeholder="Date">
                        <textarea class="editable-field" rows="2" placeholder="Description"></textarea>
                    `;
                    experienceContainer.appendChild(div);
                });
                experienceContainer.appendChild(addExpBtn);
                element.innerHTML = '';
                element.appendChild(experienceContainer);
            } else if (key === 'education') {
                const educationContainer = document.createElement('div');
                educationContainer.className = 'education-edit';
                profileData[key].forEach(edu => {
                    const div = document.createElement('div');
                    div.innerHTML = `
                        <input type="text" class="editable-field" value="${edu.title}" placeholder="Title">
                        <input type="text" class="editable-field" value="${edu.date}" placeholder="Date">
                    `;
                    educationContainer.appendChild(div);
                });
                const addEduBtn = document.createElement('button');
                addEduBtn.textContent = 'Add Education';
                addEduBtn.addEventListener('click', () => {
                    const div = document.createElement('div');
                    div.innerHTML = `
                        <input type="text" class="editable-field" placeholder="Title">
                        <input type="text" class="editable-field" placeholder="Date">
                    `;
                    educationContainer.appendChild(div);
                });
                educationContainer.appendChild(addEduBtn);
                element.innerHTML = '';
                element.appendChild(educationContainer);
            } else if (key === 'portfolio') {
                const portfolioContainer = document.createElement('div');
                portfolioContainer.className = 'portfolio-edit';
                profileData[key].forEach(port => {
                    const div = document.createElement('div');
                    div.className = 'portfolio-edit-item';
                    div.innerHTML = `
                        <input type="text" class="editable-field" value="${port.image}" placeholder="Image URL">
                        <input type="text" class="editable-field" value="${port.title}" placeholder="Title">
                        <textarea class="editable-field" rows="2" placeholder="Description">${port.description}</textarea>
                        <input type="text" class="editable-field" value="${port.link}" placeholder="Link">
                    `;
                    portfolioContainer.appendChild(div);
                });
                const addPortBtn = document.createElement('button');
                addPortBtn.textContent = 'Add Portfolio Item';
                addPortBtn.addEventListener('click', () => {
                    const div = document.createElement('div');
                    div.className = 'portfolio-edit-item';
                    div.innerHTML = `
                        <input type="text" class="editable-field" placeholder="Image URL">
                        <input type="text" class="editable-field" placeholder="Title">
                        <textarea class="editable-field" rows="2" placeholder="Description"></textarea>
                        <input type="text" class="editable-field" placeholder="Link">
                    `;
                    portfolioContainer.appendChild(div);
                });
                portfolioContainer.appendChild(addPortBtn);
                element.innerHTML = '';
                element.appendChild(portfolioContainer);
            }
        });

        editBtn.textContent = 'Save Profile';
    }

    // Disable edit mode
    function disableEditMode() {
        const editableElements = document.querySelectorAll('[data-editable]');
        editableElements.forEach(element => {
            const key = element.getAttribute('data-editable');
            if (key === 'skills') {
                const inputs = element.querySelectorAll('.skill-input');
                profileData[key] = Array.from(inputs).map(input => input.value).filter(val => val.trim() !== '');
                element.innerHTML = profileData[key].map(skill => `<span class="skill-tag">${skill}</span>`).join('');
            } else if (key === 'experience' || key === 'education') {
                const items = element.querySelectorAll('div');
                profileData[key] = Array.from(items).map(item => ({
                    title: item.querySelector('input').value,
                    date: item.querySelectorAll('input')[1].value,
                    description: item.querySelector('textarea') ? item.querySelector('textarea').value : ''
                }));
                element.innerHTML = profileData[key].map(item => `
                    <div class="${key === 'experience' ? 'experience-item' : 'education-item'}">
                        <h5>${item.title}</h5>
                        <p class="${key === 'experience' ? 'experience-date' : 'education-date'}">${item.date}</p>
                        ${item.description ? `<p>${item.description}</p>` : ''}
                    </div>
                `).join('');
            } else if (key === 'portfolio') {
                const items = element.querySelectorAll('.portfolio-edit-item');
                profileData[key] = Array.from(items).map(item => ({
                    image: item.querySelector('input').value,
                    title: item.querySelectorAll('input')[1].value,
                    description: item.querySelector('textarea').value,
                    link: item.querySelectorAll('input')[3].value
                }));
                element.innerHTML = profileData[key].map(port => `
                    <div class="portfolio-item">
                        <img src="${port.image}" alt="${port.title}">
                        <h5>${port.title}</h5>
                        <p>${port.description}</p>
                        <a href="${port.link}" class="portfolio-link">View Project</a>
                    </div>
                `).join('');
            } else {
                const input = element.querySelector('input') || element.querySelector('textarea');
                profileData[key] = input.value;
                element.innerHTML = profileData[key];
            }
        });

        editBtn.textContent = 'Edit Profile';
    }

    // Toggle edit mode
    editBtn.addEventListener('click', () => {
        isEditing = !isEditing;
        if (isEditing) {
            enableEditMode();
        } else {
            disableEditMode();
        }
    });

    // Initialize data on page load
    initializeProfileData();
});