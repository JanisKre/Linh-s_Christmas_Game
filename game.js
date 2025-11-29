window.startGame = function() {
  console.log("🎮 GAME START\n");

  const canvas = document.getElementById("game");
  const quizOverlay = document.getElementById("quiz-overlay");
  const ctx = canvas.getContext("2d");

  if (!canvas || !ctx || !quizOverlay) {
    console.error("❌ DOM not ready");
    return;
  }

  const GAME = {
    VIRTUAL_WIDTH: 160,
    VIRTUAL_HEIGHT: 90,
    
    player: null,
    snowflakes: [],
    lastInteractionTime: 0,
    interactionCooldown: 500,

    init() {
      const mainRoom = window.World.rooms[0];
      const cx = mainRoom.x + mainRoom.w / 2;
      const cy = mainRoom.y + mainRoom.h / 2;

      this.player = {
        x: cx - 3,
        y: cy - 4,
        w: 6,
        h: 8,
        speed: 35,
        vx: 0,
        vy: 0,
      };

      window.Camera.setTarget(this.player.x, this.player.y, this.player.w, this.player.h);
      window.Camera.update();
      window.Camera.clampToWorld(window.World.WORLD_WIDTH, window.World.WORLD_HEIGHT);

      for (let i = 0; i < 20; i++) {
        this.snowflakes.push({
          x: Math.random() * this.VIRTUAL_WIDTH,
          y: Math.random() * this.VIRTUAL_HEIGHT,
          vx: (Math.random() - 0.5) * 6,
          vy: 6 + Math.random() * 15,
        });
      }
    },

    updateSnow(dt) {
      for (const s of this.snowflakes) {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        if (s.y > this.VIRTUAL_HEIGHT) {
          s.y = -2;
          s.x = Math.random() * this.VIRTUAL_WIDTH;
        }
        if (s.x < 0 || s.x > this.VIRTUAL_WIDTH) {
          s.x = (s.x + this.VIRTUAL_WIDTH) % this.VIRTUAL_WIDTH;
        }
      }
    },

    updatePlayer(dt) {
      const p = this.player;
      let dx = 0, dy = 0;

      if (window.Keys.up) dy -= 1;
      if (window.Keys.down) dy += 1;
      if (window.Keys.left) dx -= 1;
      if (window.Keys.right) dx += 1;

      if (dx !== 0 || dy !== 0) {
        const len = Math.hypot(dx, dy);
        p.vx = (dx / len) * p.speed;
        p.vy = (dy / len) * p.speed;
      } else {
        p.vx = 0;
        p.vy = 0;
      }

      const newX = p.x + p.vx * dt;
      const newY = p.y + p.vy * dt;

      if (this.canMoveTo(newX, newY)) {
        p.x = newX;
        p.y = newY;
      } else {
        if (this.canMoveTo(newX, p.y)) p.x = newX;
        else if (this.canMoveTo(p.x, newY)) p.y = newY;
      }

      window.Camera.setTarget(p.x, p.y, p.w, p.h);
      window.Camera.update();
      window.Camera.clampToWorld(window.World.WORLD_WIDTH, window.World.WORLD_HEIGHT);
    },

    canMoveTo(x, y) {
      const p = this.player;
      const r = x + p.w;
      const b = y + p.h;

      if (x < 0 || r > window.World.WORLD_WIDTH || y < 0 || b > window.World.WORLD_HEIGHT) return false;

      for (const room of window.World.rooms) {
        for (const wall of window.World.getRoomWalls(room)) {
          if (r > wall.x && x < wall.x + wall.w && b > wall.y && y < wall.y + wall.h) {
            return false;
          }
        }
      }
      return true;
    },

    checkNPCInteraction() {
      const now = Date.now();
      if (now - this.lastInteractionTime < this.interactionCooldown) return;

      for (const eventId of Object.keys(window.EventSystem.EVENTS)) {
        if (window.EventSystem.getCompletedEvents().includes(eventId)) continue;

        const event = window.EventSystem.EVENTS[eventId];
        const room = window.World.rooms.find(r => r.id === event.roomId);
        if (!room) continue;

        const dist = Math.hypot(this.player.x - (room.x + room.w / 2), this.player.y - (room.y + 30));

        if (dist < 18) {
          this.startQuiz(eventId);
          this.lastInteractionTime = now;
        }
      }
    },

    startQuiz(eventId) {
      const event = window.EventSystem.startEvent(eventId);
      if (!event) return;

      document.getElementById("quiz-title").textContent = event.npcName;
      document.getElementById("quiz-question").textContent = event.question;

      const optionsDiv = document.getElementById("quiz-options");
      optionsDiv.innerHTML = "";

      event.options.forEach((option, idx) => {
        const btn = document.createElement("button");
        btn.className = "quiz-option";
        btn.textContent = option.text;
        btn.onclick = () => this.answerQuestion(eventId, idx);
        optionsDiv.appendChild(btn);
      });

      document.getElementById("quiz-message").textContent = "";
      quizOverlay.style.display = "flex";
    },

    answerQuestion(eventId, optionIdx) {
      const result = window.EventSystem.answerQuestion(eventId, optionIdx);
      if (!result) return;

      document.getElementById("quiz-message").textContent = result.message;

      if (result.correct) {
        setTimeout(() => {
          quizOverlay.style.display = "none";
          if (window.EventSystem.isAllEventsCompleted()) {
            this.showVictory();
          }
        }, 1200);
      }
    },

    showVictory() {
      quizOverlay.style.display = "flex";
      quizOverlay.querySelector(".quiz-card").innerHTML = `
        <h2>🎄 Victory! 🎄</h2>
        <p>You've completed all three challenges!</p>
        <p style="color: #ffd93b; margin-top: 16px;">
          Your heart feels +10 warmer<br/>
          Your stress level is -50<br/>
          Your Christmas spirit is MAX!
        </p>
        <p style="color: #2ecc71; margin-top: 16px;">
          May your holidays be full of good people, warm drinks, and zero exam stress. 💫
        </p>
      `;
    },

    drawSnow() {
      ctx.fillStyle = "#ffffff";
      for (const s of this.snowflakes) {
        ctx.fillRect(Math.round(s.x), Math.round(s.y), 1, 1);
      }
    },

    drawPlayer() {
      const p = this.player;
      const x = Math.round(p.x - window.Camera.x);
      const y = Math.round(p.y - window.Camera.y);

      ctx.fillStyle = "#c92a2a";
      ctx.fillRect(x, y - 3, p.w, 2);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x + 2, y - 4, 2, 1);
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(x, y, p.w, 2);
      ctx.fillStyle = "#f1d9b5";
      ctx.fillRect(x + 1, y + 2, p.w - 2, 2);
      ctx.fillStyle = "#000000";
      ctx.fillRect(x + 2, y + 2, 1, 1);
      ctx.fillRect(x + 4, y + 2, 1, 1);
      ctx.fillStyle = "#c92a2a";
      ctx.fillRect(x + 1, y + 4, p.w - 2, 3);
      ctx.fillStyle = "#f1d9b5";
      ctx.fillRect(x + 2, y + 7, 1, 1);
      ctx.fillRect(x + 4, y + 7, 1, 1);
    },

    drawNPCMarkers() {
      for (const eventId of Object.keys(window.EventSystem.EVENTS)) {
        if (window.EventSystem.getCompletedEvents().includes(eventId)) continue;

        const event = window.EventSystem.EVENTS[eventId];
        const room = window.World.rooms.find(r => r.id === event.roomId);
        if (!room) continue;

        const npcX = room.x + room.w / 2;
        const npcY = room.y + 30;
        const dist = Math.hypot(this.player.x - npcX, this.player.y - npcY);
        const isNear = dist < 20;

        const sx = Math.round(npcX - window.Camera.x);
        const sy = Math.round(npcY - window.Camera.y);

        if (sx < -10 || sx >= this.VIRTUAL_WIDTH + 10 || sy < -10 || sy >= this.VIRTUAL_HEIGHT + 10) continue;

        if (isNear) {
          ctx.fillStyle = "#ffd93b";
          ctx.fillRect(sx - 8, sy - 12, 16, 6);
          ctx.fillStyle = "#000000";
          ctx.font = "2px monospace";
          ctx.fillText("SPACE", sx - 7, sy - 9);
        } else {
          ctx.fillStyle = "#ffd93b";
          ctx.fillRect(sx - 2, sy - 2, 4, 4);
          ctx.fillStyle = "#ffffff";
          ctx.font = "2px monospace";
          ctx.fillText("!", sx - 1, sy);
        }
      }
    },

    drawHUD() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, this.VIRTUAL_WIDTH, 12);
      ctx.fillStyle = "#ffd93b";
      ctx.font = "3px monospace";
      
      const completed = window.EventSystem.getCompletedEvents().length;
      ctx.fillText(`Explore & Find NPCs (${completed}/3 Completed)`, 2, 2);
      ctx.fillText("Use WASD/Arrows or swipe to move", 2, 7);
    },

    update(dt) {
      this.updatePlayer(dt);
      this.updateSnow(dt);
      this.checkNPCInteraction();
    },

    draw() {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, this.VIRTUAL_WIDTH, this.VIRTUAL_HEIGHT);

      window.Camera.apply(ctx);
      window.World.drawWorld(ctx, window.Camera);
      window.Camera.reset(ctx);

      this.drawPlayer();
      this.drawNPCMarkers();
      this.drawSnow();
      this.drawHUD();
    }
  };

  GAME.init();

  let lastTime = performance.now();
  const frameTime = 1000 / 60;
  let accumulator = 0;

  function loop(timestamp) {
    const deltaMs = timestamp - lastTime;
    lastTime = timestamp;
    accumulator += deltaMs;

    while (accumulator >= frameTime) {
      GAME.update(frameTime / 1000);
      accumulator -= frameTime;
    }

    GAME.draw();
    requestAnimationFrame(loop);
  }

  console.log("✅ Game loop started\n");
  requestAnimationFrame(loop);
};