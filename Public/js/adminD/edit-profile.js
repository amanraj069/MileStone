document.addEventListener("DOMContentLoaded", function () {
  // Load saved profile data
  loadSavedProfileData();

  // Handle form submission
  const profileEditForm = document.getElementById("profileEditForm");
  profileEditForm.addEventListener("submit", function (e) {
    e.preventDefault();
    saveProfileData();
    window.location.href = "/adminD/profile";
  });
});

function loadSavedProfileData() {
  const savedProfile = localStorage.getItem("adminProfile");
  if (savedProfile) {
    const profileData = JSON.parse(savedProfile);

    setInputValue("userId", profileData.userId);
    setInputValue("name", profileData.name);
    setInputValue("location", profileData.location);
    setInputValue("email", profileData.email);
    setInputValue("phone", profileData.phone);
    setInputValue("picture", profileData.picture);
    setTextareaValue("aboutMe", profileData.aboutMe);
    setInputValue("subscription", profileData.subscription);
    setSelectValue("role", profileData.role);

    // Load social media
    setInputValue("linkedin", profileData.socialMedia?.linkedin);
    setInputValue("twitter", profileData.socialMedia?.twitter);
    setInputValue("facebook", profileData.socialMedia?.facebook);
    setInputValue("instagram", profileData.socialMedia?.instagram);
  }
}

function saveProfileData() {
  const profileData = {
    userId: getInputValue("userId"),
    name: getInputValue("name"),
    location: getInputValue("location"),
    email: getInputValue("email"),
    phone: getInputValue("phone"),
    picture: getInputValue("picture"),
    aboutMe: getTextareaValue("aboutMe"),
    subscription: getInputValue("subscription"),
    role: getSelectValue("role"),
    socialMedia: {
      linkedin: getInputValue("linkedin"),
      twitter: getInputValue("twitter"),
      facebook: getInputValue("facebook"),
      instagram: getInputValue("instagram"),
    },
  };

  localStorage.setItem("adminProfile", JSON.stringify(profileData));
}

function getInputValue(id) {
  const input = document.getElementById(id);
  return input ? input.value : "";
}

function setInputValue(id, value) {
  const input = document.getElementById(id);
  if (input && value) {
    input.value = value;
  }
}

function getTextareaValue(id) {
  const textarea = document.getElementById(id);
  return textarea ? textarea.value : "";
}

function setTextareaValue(id, value) {
  const textarea = document.getElementById(id);
  if (textarea && value) {
    textarea.value = value;
  }
}

function getSelectValue(id) {
  const select = document.getElementById(id);
  return select ? select.value : "";
}

function setSelectValue(id, value) {
  const select = document.getElementById(id);
  if (select && value) {
    select.value = value;
  }
}
