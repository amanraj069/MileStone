document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const applicationCards = document.querySelectorAll(".application-card");

  const filterApplications = () => {
    const searchTerm = searchInput.value.toLowerCase().trim();

    applicationCards.forEach((card) => {
      const freelancerName = card.getAttribute("data-freelancer");
      const jobTitle = card.getAttribute("data-job");

      if (
        searchTerm === "" ||
        freelancerName.includes(searchTerm) ||
        jobTitle.includes(searchTerm)
      ) {
        card.classList.add("visible");
      } else {
        card.classList.remove("visible");
      }
    });
  };

  searchBtn.addEventListener("click", filterApplications);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      filterApplications();
    }
  });
  searchInput.addEventListener("input", filterApplications);
});