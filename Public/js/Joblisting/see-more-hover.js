
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const container = document.body; 

    container.addEventListener('mouseover', (e) => {
      const btn = e.target.closest('.see-more-btn');
      if (!btn) return;

      if (!btn.dataset.originalText) btn.dataset.originalText = btn.textContent;

      const rootStyles = getComputedStyle(document.documentElement);
      let successColor = rootStyles.getPropertyValue('--success-color') || '';
      successColor = successColor.trim() || '#10b981';

      btn.style.backgroundColor = successColor;
      btn.style.color = '#ffffff';
      btn.textContent = 'click me';
    });

    container.addEventListener('mouseout', (e) => {
      const btn = e.target.closest('.see-more-btn');
      if (!btn) return;

      btn.style.backgroundColor = '';
      btn.style.color = '';
      if (btn.dataset.originalText) {
        btn.textContent = btn.dataset.originalText;
      }
    });
  });
})();
