console.log("🎄 === INITIALIZATION START === 🎄\n");

// Global namespace
window.GAME_STATE = {
  initialized: false,
  modules: {
    camera: false,
    input: false,
    world: false,
    events: false,
  }
};

// Wait for all modules
function checkInitialization() {
  const all = Object.values(window.GAME_STATE.modules).every(v => v === true);
  if (all && !window.GAME_STATE.initialized) {
    window.GAME_STATE.initialized = true;
    console.log("✅ All modules ready - starting game\n");
    if (typeof window.startGame === 'function') {
      window.startGame();
    }
  }
}

window.registerModule = function(name) {
  if (window.GAME_STATE.modules.hasOwnProperty(name)) {
    window.GAME_STATE.modules[name] = true;
    console.log(`✓ ${name} module registered`);
    checkInitialization();
  }
};

console.log("✓ init.js loaded");
