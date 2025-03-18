document.addEventListener("DOMContentLoaded", () => {
  const editBtn = document.getElementById("editProfileBtn");
  const profileContent = document.querySelector(".profile-content");
  let isEditing = false;
  let profileData = {};

  // Initialize profile data from the DOM with error handling
  function initializeProfileData() {
    const editableElements = document.querySelectorAll("[data-editable]");
    if (!editableElements.length) {
      console.error("No editable elements found.");
      return;
    }

    editableElements.forEach((element) => {
      const key = element.getAttribute("data-editable");
      try {
        if (key === "skills") {
          const skillTags = element.querySelectorAll(".skill-tag");
          profileData[key] = skillTags.length
            ? Array.from(skillTags).map((tag) => tag.textContent.trim())
            : [];
        } else if (key === "experience" || key === "education") {
          const items = element.querySelectorAll(
            `.${key === "experience" ? "experience-item" : "education-item"}`
          );
          profileData[key] = items.length
            ? Array.from(items).map((item) => {
                const title = item.querySelector("h5")?.textContent.trim() || "";
                const date = item.querySelector(".experience-date, .education-date")?.textContent.trim() || "";
                const description = item.querySelector("p:not(.experience-date, .education-date)")?.textContent.trim() || "";
                return { title, date, description };
              })
            : [];
        } else if (key === "portfolio") {
          const items = element.querySelectorAll(".portfolio-item");
          profileData[key] = items.length
            ? Array.from(items).map((item) => {
                const image = item.querySelector("img")?.src || "";
                const title = item.querySelector("h5")?.textContent.trim() || "";
                const description = item.querySelector("p")?.textContent.trim() || "";
                const link = item.querySelector(".portfolio-link")?.href || "";
                return { image, title, description, link };
              })
            : [];
        } else if (key === "about") {
          const paragraphs = element.querySelectorAll("p");
          profileData[key] = paragraphs.length
            ? Array.from(paragraphs).map((p) => p.textContent.trim()).join("\n\n")
            : "";
        } else {
          profileData[key] = element.textContent.trim() || "";
        }
      } catch (error) {
        console.error(`Error initializing data for ${key}:`, error);
      }
    });
    console.log("Initialized profile data:", profileData);
  }

  // Enable edit mode
  function enableEditMode() {
    const editableElements = document.querySelectorAll("[data-editable]");
    if (!editableElements.length) return;

    editableElements.forEach((element) => {
      const key = element.getAttribute("data-editable");
      element.classList.add("editing");
      try {
        if (
          key === "name" ||
          key === "title" ||
          key === "location" ||
          key === "rating" ||
          key === "projects" ||
          key === "email" ||
          key === "phone"
        ) {
          const input = document.createElement("input");
          input.type = "text";
          input.className = "editable-field";
          input.value = profileData[key] || "";
          element.innerHTML = "";
          element.appendChild(input);
        } else if (key === "about") {
          const textarea = document.createElement("textarea");
          textarea.className = "editable-field";
          textarea.rows = 4;
          textarea.value = profileData[key] || "";
          element.innerHTML = "";
          element.appendChild(textarea);
        } else if (key === "skills") {
          const skillsContainer = document.createElement("div");
          skillsContainer.className = "skills-edit";
          element.innerHTML = "";
          (profileData[key] || []).forEach((skill) => {
            const input = document.createElement("input");
            input.type = "text";
            input.className = "skill-input";
            input.value = skill || "";
            skillsContainer.appendChild(input);
          });
          const existingSkillBtn = skillsContainer.querySelector(".add-btn");
          if (existingSkillBtn) {
            existingSkillBtn.remove();
          }
          const addSkillBtn = document.createElement("button");
          addSkillBtn.textContent = "Add Skill";
          addSkillBtn.className = "add-btn";
          addSkillBtn.addEventListener("click", () => {
            const newInput = document.createElement("input");
            newInput.type = "text";
            newInput.className = "skill-input";
            skillsContainer.insertBefore(newInput, addSkillBtn);
          });
          skillsContainer.appendChild(addSkillBtn);
          element.appendChild(skillsContainer);
        } else if (key === "experience") {
          const experienceContainer = document.createElement("div");
          experienceContainer.className = "experience-edit";
          element.innerHTML = "";
          (profileData[key] || []).forEach((exp) => {
            const div = document.createElement("div");
            div.className = "experience-edit-item";
            div.innerHTML = `
              <input type="text" class="editable-field" value="${exp.title || ""}" placeholder="Title">
              <input type="text" class="editable-field" value="${exp.date || ""}" placeholder="Date">
              <textarea class="editable-field" rows="2" placeholder="Description">${exp.description || ""}</textarea>
            `;
            experienceContainer.appendChild(div);
          });
          const existingExpBtn = experienceContainer.querySelector(".add-btn");
          if (existingExpBtn) {
            existingExpBtn.remove();
          }
          const addExpBtn = document.createElement("button");
          addExpBtn.textContent = "Add Experience";
          addExpBtn.className = "add-btn";
          addExpBtn.addEventListener("click", () => {
            const div = document.createElement("div");
            div.className = "experience-edit-item";
            div.innerHTML = `
              <input type="text" class="editable-field" placeholder="Title">
              <input type="text" class="editable-field" placeholder="Date">
              <textarea class="editable-field" rows="2" placeholder="Description"></textarea>
            `;
            experienceContainer.insertBefore(div, addExpBtn);
          });
          experienceContainer.appendChild(addExpBtn);
          element.appendChild(experienceContainer);
        } else if (key === "education") {
          const educationContainer = document.createElement("div");
          educationContainer.className = "education-edit";
          element.innerHTML = "";
          (profileData[key] || []).forEach((edu) => {
            const div = document.createElement("div");
            div.className = "education-edit-item";
            div.innerHTML = `
              <input type="text" class="editable-field" value="${edu.title || ""}" placeholder="Degree">
              <input type="text" class="editable-field" value="${edu.date || ""}" placeholder="Date">
            `;
            educationContainer.appendChild(div);
          });
          const existingEduBtn = educationContainer.querySelector(".add-btn");
          if (existingEduBtn) {
            existingEduBtn.remove();
          }
          const addEduBtn = document.createElement("button");
          addEduBtn.textContent = "Add Education";
          addEduBtn.className = "add-btn";
          addEduBtn.addEventListener("click", () => {
            const div = document.createElement("div");
            div.className = "education-edit-item";
            div.innerHTML = `
              <input type="text" class="editable-field" placeholder="Degree">
              <input type="text" class="editable-field" placeholder="Date">
            `;
            educationContainer.insertBefore(div, addEduBtn);
          });
          educationContainer.appendChild(addEduBtn);
          element.appendChild(educationContainer);
        } else if (key === "portfolio") {
          const portfolioContainer = document.createElement("div");
          portfolioContainer.className = "portfolio-edit";
          element.innerHTML = "";
          (profileData[key] || []).forEach((port) => {
            const div = document.createElement("div");
            div.className = "portfolio-edit-item";
            div.innerHTML = `
              <input type="text" class="editable-field" value="${port.image || ""}" placeholder="Image URL">
              <input type="text" class="editable-field" value="${port.title || ""}" placeholder="Title">
              <textarea class="editable-field" rows="2" placeholder="Description">${port.description || ""}</textarea>
              <input type="text" class="editable-field" value="${port.link || ""}" placeholder="Link">
            `;
            portfolioContainer.appendChild(div);
          });
          const existingPortBtn = portfolioContainer.querySelector(".add-btn");
          if (existingPortBtn) {
            existingPortBtn.remove();
          }
          const addPortBtn = document.createElement("button");
          addPortBtn.textContent = "Add Portfolio Item";
          addPortBtn.className = "add-btn";
          addPortBtn.addEventListener("click", () => {
            const div = document.createElement("div");
            div.className = "portfolio-edit-item";
            div.innerHTML = `
              <input type="text" class="editable-field" placeholder="Image URL">
              <input type="text" class="editable-field" placeholder="Title">
              <textarea class="editable-field" rows="2" placeholder="Description"></textarea>
              <input type="text" class="editable-field" placeholder="Link">
            `;
            portfolioContainer.insertBefore(div, addPortBtn);
          });
          portfolioContainer.appendChild(addPortBtn);
          element.appendChild(portfolioContainer);
        }
      } catch (error) {
        console.error(`Error enabling edit mode for ${key}:`, error);
      }
    });
    editBtn.textContent = "Save Profile";
  }

  // Disable edit mode and save data
  function disableEditMode() {
    const editableElements = document.querySelectorAll("[data-editable]");
    if (!editableElements.length) return;

    editableElements.forEach((element) => {
      const key = element.getAttribute("data-editable");
      element.classList.remove("editing");
      let success = true;
      try {
        if (key === "skills") {
          const inputs = element.querySelectorAll(".skill-input");
          profileData[key] = Array.from(inputs)
            .map((input) => input.value.trim())
            .filter((val) => val !== "");
          element.innerHTML = profileData[key]
            .map((skill) => `<span class="skill-tag">${skill}</span>`)
            .join("");
        } else if (key === "experience") {
          const items = element.querySelectorAll(".experience-edit-item");
          profileData[key] = Array.from(items).map((item) => {
            const inputs = item.querySelectorAll("input");
            const textarea = item.querySelector("textarea");
            return {
              title: inputs[0]?.value.trim() || "",
              date: inputs[1]?.value.trim() || "",
              description: textarea?.value.trim() || "",
            };
          });
          element.innerHTML = profileData[key]
            .map(
              (item) => `
                <div class="experience-item">
                  <h5>${item.title}</h5>
                  <p class="experience-date">${item.date}</p>
                  ${item.description ? `<p>${item.description}</p>` : ""}
                </div>
              `
            )
            .join("");
        } else if (key === "education") {
          const items = element.querySelectorAll(".education-edit-item");
          profileData[key] = Array.from(items).map((item) => {
            const inputs = item.querySelectorAll("input");
            return {
              title: inputs[0]?.value.trim() || "",
              date: inputs[1]?.value.trim() || "",
              description: "",
            };
          });
          element.innerHTML = profileData[key]
            .map(
              (item) => `
                <div class="education-item">
                  <h5>${item.title}</h5>
                  <p class="education-date">${item.date}</p>
                </div>
              `
            )
            .join("");
        } else if (key === "portfolio") {
          const items = element.querySelectorAll(".portfolio-edit-item");
          profileData[key] = Array.from(items)
            .map((item, index) => {
              const inputs = item.querySelectorAll("input");
              const textarea = item.querySelector("textarea");

              // Debug the structure
              console.log(`Portfolio item ${index} - Inputs: ${inputs.length}, Textarea: ${textarea ? 'present' : 'absent'}`, item.outerHTML);

              // Expect 3 inputs (image, title, link) and 1 textarea (description)
              if (inputs.length < 3 || !textarea) {
                console.warn(`Portfolio item ${index} has incomplete structure. Inputs: ${inputs.length}, Textarea: ${textarea ? 'yes' : 'no'}.`);
                return null;
              }

              const image = inputs[0]?.value.trim() || "";
              const title = inputs[1]?.value.trim() || "";
              const description = textarea?.value.trim() || "";
              const link = inputs[2]?.value.trim() || ""; // Corrected to index 2 for link

              // Only skip if completely empty
              if (!image && !title && !description && !link) {
                console.warn(`Portfolio item ${index} is completely empty. Skipping.`);
                return null;
              }

              return { image, title, description, link };
            })
            .filter((port) => port !== null);

          // Log the processed portfolio data
          console.log("Processed portfolio data:", profileData[key]);

          // Render the updated portfolio items
          element.innerHTML = "";
          if (profileData[key].length) {
            profileData[key].forEach((port) => {
              const portfolioItem = document.createElement("div");
              portfolioItem.className = "portfolio-item";
              portfolioItem.innerHTML = `
                ${port.image ? `<img src="${port.image}" alt="${port.title || "Portfolio Item"}">` : ""}
                ${port.title ? `<h5>${port.title}</h5>` : ""}
                ${port.description ? `<p>${port.description}</p>` : ""}
                ${port.link ? `<a href="${port.link}" class="portfolio-link">View Project</a>` : ""}
              `;
              element.appendChild(portfolioItem);
            });
          } else {
            element.innerHTML = "<p>No portfolio items added yet.</p>";
          }
        } else if (key === "about") {
          const textarea = element.querySelector("textarea");
          profileData[key] = textarea?.value.trim() || "";
          element.innerHTML = "";
          const paragraphs = profileData[key].split("\n\n");
          paragraphs.forEach((paragraph, index) => {
            if (paragraph.trim()) {
              const p = document.createElement("p");
              p.textContent = paragraph;
              element.appendChild(p);
              if (index < paragraphs.length - 1) {
                element.appendChild(document.createElement("br"));
              }
            }
          });
        } else {
          const input = element.querySelector("input") || element.querySelector("textarea");
          profileData[key] = input?.value.trim() || "";
          element.textContent = profileData[key];
        }
      } catch (error) {
        console.error(`Error disabling edit mode for ${key}:`, error);
        success = false;
      }

      if (!success && key === "portfolio") {
        element.innerHTML = "";
        if (profileData[key].length) {
          profileData[key].forEach((port) => {
            const portfolioItem = document.createElement("div");
            portfolioItem.className = "portfolio-item";
            portfolioItem.innerHTML = `
              ${port.image ? `<img src="${port.image}" alt="${port.title || "Portfolio Item"}">` : ""}
              ${port.title ? `<h5>${port.title}</h5>` : ""}
              ${port.description ? `<p>${port.description}</p>` : ""}
              ${port.link ? `<a href="${port.link}" class="portfolio-link">View Project</a>` : ""}
            `;
            element.appendChild(portfolioItem);
          });
        } else {
          element.innerHTML = "<p>No portfolio items added yet.</p>";
        }
      }
    });

    console.log("Updated profile data:", profileData);
    editBtn.textContent = "Edit Profile";
  }

  // Toggle edit mode
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      isEditing = !isEditing;
      if (isEditing) {
        enableEditMode();
      } else {
        disableEditMode();
      }
    });
  } else {
    console.error("Edit profile button not found.");
  }

  // Initialize data on page load
  initializeProfileData();
});