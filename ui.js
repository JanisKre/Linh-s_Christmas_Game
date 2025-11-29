/* ui.js
   Adjust canvas for devicePixelRatio and CSS --scale variable.
   Keeps logical drawing coordinates at base resolution (160x90)
   while increasing the drawing buffer to match DPR for crisp pixels on retina.
*/
(function () {
  const BASE_W = 160;
  const BASE_H = 90;

  function getScale() {
    const val = getComputedStyle(document.documentElement).getPropertyValue('--scale');
    const parsed = parseFloat(val);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 5;
  }

  function fitCanvas() {
    const canvas = document.getElementById('game');
    if (!canvas) {
      console.warn('Canvas not ready yet');
      return;
    }
    
    const scale = getScale();

    // Nur CSS-Größe setzen (Display)
    canvas.style.width = (BASE_W * scale) + 'px';
    canvas.style.height = (BASE_H * scale) + 'px';

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.msImageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;
    }

    console.log('✓ Canvas UI fitted');
  }

  // Nur nach DOM-Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fitCanvas);
  } else {
    fitCanvas();
  }

  window.addEventListener('resize', fitCanvas);
  window.addEventListener('orientationchange', () => {
    setTimeout(fitCanvas, 120);
  });

  console.log('✓ ui.js loaded');
})();
