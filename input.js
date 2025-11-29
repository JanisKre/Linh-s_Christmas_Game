window.Keys = {
  up: false,
  down: false,
  left: false,
  right: false,
};

let touchStartX = 0;
let touchStartY = 0;
let touchActive = false;

function handleKeyChange(e, isDown) {
  const k = e.key.toLowerCase();
  if (["arrowup", "w"].includes(k)) {
    window.Keys.up = isDown;
    e.preventDefault();
  } else if (["arrowdown", "s"].includes(k)) {
    window.Keys.down = isDown;
    e.preventDefault();
  } else if (["arrowleft", "a"].includes(k)) {
    window.Keys.left = isDown;
    e.preventDefault();
  } else if (["arrowright", "d"].includes(k)) {
    window.Keys.right = isDown;
    e.preventDefault();
  }
}

function handleTouchStart(e) {
  if (e.target.id === "game") {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchActive = true;
  }
}

function handleTouchMove(e) {
  if (!touchActive || e.target.id !== "game") return;
  const touchX = e.touches[0].clientX;
  const touchY = e.touches[0].clientY;
  const deltaX = touchX - touchStartX;
  const deltaY = touchY - touchStartY;
  const threshold = 20;

  window.Keys.up = deltaY < -threshold;
  window.Keys.down = deltaY > threshold;
  window.Keys.left = deltaX < -threshold;
  window.Keys.right = deltaX > threshold;
}

function handleTouchEnd() {
  touchActive = false;
  window.Keys.up = false;
  window.Keys.down = false;
  window.Keys.left = false;
  window.Keys.right = false;
}

window.addEventListener("keydown", (e) => handleKeyChange(e, true));
window.addEventListener("keyup", (e) => handleKeyChange(e, false));
window.addEventListener("touchstart", handleTouchStart, false);
window.addEventListener("touchmove", handleTouchMove, false);
window.addEventListener("touchend", handleTouchEnd, false);

// Safe register
if (typeof window.registerModule === "function") {
  window.registerModule('input');
}