// Quiz functionality
function initializeQuiz(skillId, totalQuestions) {
  console.log('Skill ID:', skillId);

  function updateProgress() {
    const answeredQuestions = document.querySelectorAll('input[type="radio"]:checked').length;
    const progress = (answeredQuestions / totalQuestions) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
  }

  // Add event listeners to radio buttons for progress tracking
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', updateProgress);
  });

  // Handle quiz form submission
  document.getElementById('quiz-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const answers = {};
    for (let [key, value] of formData.entries()) {
      answers[key] = value;
    }

    console.log('Answers:', answers);

    try {
      const response = await fetch(`/freelancerD/skills_badges/quiz/${skillId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        const popup = document.getElementById('result-popup');
        const title = document.getElementById('result-title');
        const message = document.getElementById('result-message');
        const score = document.getElementById('result-score');

        title.textContent = result.passed ? 'Congratulations!' : 'Try Again!';
        message.textContent = result.message;
        score.textContent = `Your Score: ${result.score}%`;

        popup.style.display = 'flex';

        document.getElementById('result-close-btn').addEventListener('click', () => {
          window.location.href = '/freelancerD/skills_badges';
        });
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    }
  });
}

// Export for use in EJS templates
window.initializeQuiz = initializeQuiz;