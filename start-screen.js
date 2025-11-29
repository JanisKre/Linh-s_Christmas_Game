(function () {
  const startScreen = document.getElementById('startScreen');
  const startBtn = document.getElementById('startButton');
  const canvas = document.getElementById('game');

  if (!startScreen || !startBtn) return;

  function hideStartScreen() {
    startScreen.classList.add('hidden');
    startScreen.setAttribute('aria-hidden', 'true');
    // focus canvas so keyboard input works
    if (canvas && typeof canvas.focus === 'function') {
      canvas.focus({preventScroll: true});
    }
  }

  startBtn.addEventListener('click', () => {
    hideStartScreen();

    // If the game exposes a start function, call it
    if (typeof window.startGame === 'function') {
      try { window.startGame(); } catch (e) { /* ignore */ }
    }

    // Dispatch a generic event so game code can listen if needed
    window.dispatchEvent(new CustomEvent('game-start', { detail: { source: 'start-screen' } }));
  });

  // allow Enter key to start when overlay focused
  startScreen.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      startBtn.click();
    }
  });

  // expose helpers
  window.showStartScreen = () => {
    startScreen.classList.remove('hidden');
    startScreen.setAttribute('aria-hidden', 'false');
  };
  window.hideStartScreen = hideStartScreen;
})();
