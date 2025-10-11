// Payment page JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
  // Set progress bar widths based on data attributes
  const progressBars = document.querySelectorAll('.progress[data-progress]');
  
  progressBars.forEach(bar => {
    const progress = bar.dataset.progress;
    if (progress) {
      bar.style.width = progress + '%';
    }
  });
});