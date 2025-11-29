(function () {
  const WORLD_WIDTH = 480;
  const WORLD_HEIGHT = 300;
  const ROOM_W = 140;
  const ROOM_H = 90;
  const ROOM_MARGIN = 20;

  // Calculate main room position once
  const mainX = (WORLD_WIDTH - ROOM_W) / 2;
  const mainY = (WORLD_HEIGHT - ROOM_H) / 2;

  const rooms = [
    {
      id: "main",
      title: "🏠 Festive Hub",
      x: mainX,
      y: mainY,
      w: ROOM_W,
      h: ROOM_H,
      floorColor: "#1a2a20",
      wallColor: "#a52a2a",
      type: "main",
    },
    {
      id: "gift",
      title: "🎓 University",
      x: mainX,
      y: mainY - ROOM_H - ROOM_MARGIN,
      w: ROOM_W,
      h: ROOM_H,
      floorColor: "#2a2a2a",
      wallColor: "#5a4a3a",
      type: "gift",
    },
    {
      id: "lights",
      title: "⚽ Stadium",
      x: mainX - ROOM_W - ROOM_MARGIN,
      y: mainY,
      w: ROOM_W,
      h: ROOM_H,
      floorColor: "#1a2a3a",
      wallColor: "#3a5a7a",
      type: "lights",
    },
    {
      id: "cookies",
      title: "☕ Christmas Market",
      x: mainX + ROOM_W + ROOM_MARGIN,
      y: mainY,
      w: ROOM_W,
      h: ROOM_H,
      floorColor: "#2a1a0a",
      wallColor: "#8a5a2a",
      type: "cookies",
    },
    {
      id: "snow",
      title: "❄️ Snow Garden",
      x: mainX,
      y: mainY + ROOM_H + ROOM_MARGIN,
      w: ROOM_W,
      h: ROOM_H,
      floorColor: "#e0f5ff",
      wallColor: "#4a8aaa",
      type: "snow",
    },
  ];

  // --- Decoration helpers -------------------------------------------------
  function drawGift(ctx, camera, x, y, boxColor, ribbonColor) {
    const sx = Math.round(x - camera.x);
    const sy = Math.round(y - camera.y);
    ctx.fillStyle = boxColor;
    ctx.fillRect(sx, sy, 5, 4);
    ctx.fillStyle = ribbonColor;
    ctx.fillRect(sx + 2, sy, 1, 4);
    ctx.fillRect(sx, sy + 1, 5, 1);
  }

  // For each room, we draw a wall frame, floor, and its decorations
  function drawRoomBase(ctx, camera, room) {
    const sx = Math.round(room.x - camera.x);
    const sy = Math.round(room.y - camera.y);

    // Wall background (frame)
    ctx.fillStyle = room.wallColor;
    ctx.fillRect(sx - 4, sy - 4, room.w + 8, room.h + 8);

    // Floor
    ctx.fillStyle = room.floorColor;
    ctx.fillRect(sx, sy, room.w, room.h);

    // Room border for clarity
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.strokeRect(sx, sy, room.w, room.h);

    // Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "5px monospace";
    ctx.textBaseline = "top";
    ctx.fillText(room.title, sx + 4, sy + 4);
  }

  function drawMainDecor(ctx, camera, room) {
    // Large Christmas tree in center
    const baseX = room.x + room.w / 2;
    const baseY = room.y + room.h - 12;

    // Tree trunk
    ctx.fillStyle = "#5b3a1f";
    ctx.fillRect(Math.round(baseX - 2 - camera.x), Math.round(baseY - 6 - camera.y), 4, 6);

    // Tree leaves - bigger
    ctx.fillStyle = "#0f5a2b";
    ctx.fillRect(Math.round(baseX - 12 - camera.x), Math.round(baseY - 12 - camera.y), 24, 6);
    ctx.fillRect(Math.round(baseX - 8 - camera.x), Math.round(baseY - 18 - camera.y), 16, 6);
    ctx.fillRect(Math.round(baseX - 4 - camera.x), Math.round(baseY - 24 - camera.y), 8, 6);

    // Star
    ctx.fillStyle = "#ffd93b";
    ctx.fillRect(Math.round(baseX - 1 - camera.x), Math.round(baseY - 26 - camera.y), 2, 2);

    // Ornaments
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(Math.round(baseX - 8 - camera.x), Math.round(baseY - 10 - camera.y), 2, 2);
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(Math.round(baseX + 6 - camera.x), Math.round(baseY - 8 - camera.y), 2, 2);
    ctx.fillStyle = "#ffff00";
    ctx.fillRect(Math.round(baseX - 2 - camera.x), Math.round(baseY - 6 - camera.y), 2, 2);

    // Fireplace on left
    const kx = room.x + 8;
    const ky = room.y + room.h - 16;
    ctx.fillStyle = "#602020";
    ctx.fillRect(Math.round(kx - camera.x), Math.round(ky - camera.y), 14, 12);
    ctx.fillStyle = "#2b0505";
    ctx.fillRect(Math.round(kx + 2 - camera.x), Math.round(ky + 3 - camera.y), 10, 6);
    ctx.fillStyle = "#ffb347";
    ctx.fillRect(Math.round(kx + 4 - camera.x), Math.round(ky + 6 - camera.y), 6, 2);

    // Stockings
    ctx.fillStyle = "#d02030";
    ctx.fillRect(Math.round(kx + 3 - camera.x), Math.round(ky + 1 - camera.y), 2, 3);
    ctx.fillRect(Math.round(kx + 9 - camera.x), Math.round(ky + 1 - camera.y), 2, 3);
  }

  function drawUniversity(ctx, camera, room) {
    // Desk with books
    ctx.fillStyle = "#5c4033";
    ctx.fillRect(Math.round(room.x + 20 - camera.x), Math.round(room.y + room.h - 14 - camera.y), 50, 8);

    // Books
    ctx.fillStyle = "#c71f37";
    ctx.fillRect(Math.round(room.x + 25 - camera.x), Math.round(room.y + room.h - 12 - camera.y), 4, 6);
    ctx.fillStyle = "#1971c2";
    ctx.fillRect(Math.round(room.x + 32 - camera.x), Math.round(room.y + room.h - 12 - camera.y), 4, 6);
    ctx.fillStyle = "#2b8a3e";
    ctx.fillRect(Math.round(room.x + 39 - camera.x), Math.round(room.y + room.h - 12 - camera.y), 4, 6);
    ctx.fillStyle = "#ffa500";
    ctx.fillRect(Math.round(room.x + 46 - camera.x), Math.round(room.y + room.h - 12 - camera.y), 4, 6);

    // Chalkboard
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(Math.round(room.x + 20 - camera.x), Math.round(room.y + 8 - camera.y), 40, 20);
    ctx.fillStyle = "#ffd93b";
    ctx.font = "5px monospace";
    ctx.fillText("QUIZ", Math.round(room.x + 38 - camera.x), Math.round(room.y + 15 - camera.y));

    // NPC marker - Professor
    ctx.fillStyle = "#ff69b4";
    ctx.fillRect(Math.round(room.x + 15 - camera.x), Math.round(room.y + 20 - camera.y), 6, 12);
    ctx.fillStyle = "#f1d9b5";
    ctx.fillRect(Math.round(room.x + 16 - camera.x), Math.round(room.y + 18 - camera.y), 4, 3);
  }

  function drawStadium(ctx, camera, room) {
    // Stands/seats pattern
    ctx.fillStyle = "#445555";
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(Math.round(room.x + 20 + i * 15 - camera.x), Math.round(room.y + 15 + i * 3 - camera.y), 12, 3);
    }

    // Football field
    ctx.fillStyle = "#2d5a2d";
    ctx.fillRect(Math.round(room.x + 20 - camera.x), Math.round(room.y + room.h - 20 - camera.y), 50, 12);

    // Field lines
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.round(room.x + 45 - camera.x), Math.round(room.y + room.h - 20 - camera.y));
    ctx.lineTo(Math.round(room.x + 45 - camera.x), Math.round(room.y + room.h - 8 - camera.y));
    ctx.stroke();

    // NPC marker - Coach
    ctx.fillStyle = "#ff6b6b";
    ctx.fillRect(Math.round(room.x + 15 - camera.x), Math.round(room.y + 20 - camera.y), 6, 12);
    ctx.fillStyle = "#f1d9b5";
    ctx.fillRect(Math.round(room.x + 16 - camera.x), Math.round(room.y + 18 - camera.y), 4, 3);
  }

  function drawMarket(ctx, camera, room) {
    // Market stalls
    ctx.fillStyle = "#8b5a2b";
    ctx.fillRect(Math.round(room.x + 15 - camera.x), Math.round(room.y + 15 - camera.y), 20, 14);
    ctx.fillRect(Math.round(room.x + 40 - camera.x), Math.round(room.y + 15 - camera.y), 20, 14);
    ctx.fillRect(Math.round(room.x + 65 - camera.x), Math.round(room.y + 15 - camera.y), 20, 14);

    // Stall signs/decorations
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(Math.round(room.x + 22 - camera.x), Math.round(room.y + 8 - camera.y), 6, 4);
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(Math.round(room.x + 47 - camera.x), Math.round(room.y + 8 - camera.y), 6, 4);
    ctx.fillStyle = "#ffff00";
    ctx.fillRect(Math.round(room.x + 72 - camera.x), Math.round(room.y + 8 - camera.y), 6, 4);

    // Hot drinks table
    ctx.fillStyle = "#5c4033";
    ctx.fillRect(Math.round(room.x + 25 - camera.x), Math.round(room.y + room.h - 14 - camera.y), 40, 6);

    // Cups
    ctx.fillStyle = "#8b0000";
    for (let i = 0; i < 6; i++) {
      ctx.fillRect(Math.round(room.x + 28 + i * 7 - camera.x), Math.round(room.y + room.h - 11 - camera.y), 3, 4);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(Math.round(room.x + 30 + i * 7 - camera.x), Math.round(room.y + room.h - 13 - camera.y), 1, 1);
      ctx.fillStyle = "#8b0000";
    }

    // NPC marker - Mara
    ctx.fillStyle = "#ff69b4";
    ctx.fillRect(Math.round(room.x + 15 - camera.x), Math.round(room.y + 35 - camera.y), 6, 12);
    ctx.fillStyle = "#f1d9b5";
    ctx.fillRect(Math.round(room.x + 16 - camera.x), Math.round(room.y + 33 - camera.y), 4, 3);
  }

  function drawSnowGarden(ctx, camera, room) {
    // Snow ground
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(Math.round(room.x + 2 - camera.x), Math.round(room.y + room.h - 12 - camera.y), room.w - 4, 10);

    // Snow hills
    ctx.fillRect(Math.round(room.x + 10 - camera.x), Math.round(room.y + room.h - 14 - camera.y), 20, 4);
    ctx.fillRect(Math.round(room.x + 50 - camera.x), Math.round(room.y + room.h - 15 - camera.y), 25, 5);

    // Snowman
    const sx = room.x + 30;
    const sy = room.y + 30;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(Math.round(sx - camera.x), Math.round(sy + 5 - camera.y), 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(Math.round(sx - camera.x), Math.round(sy - 3 - camera.y), 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(Math.round(sx - camera.x), Math.round(sy - 10 - camera.y), 2, 0, Math.PI * 2);
    ctx.fill();

    // Snowman face
    ctx.fillStyle = "#000000";
    ctx.fillRect(Math.round(sx - 1 - camera.x), Math.round(sy - 11 - camera.y), 1, 1);
    ctx.fillRect(Math.round(sx + 1 - camera.x), Math.round(sy - 11 - camera.y), 1, 1);

    // Carrot nose
    ctx.fillStyle = "#ff6a00";
    ctx.fillRect(Math.round(sx - camera.x), Math.round(sy - 10 - camera.y), 1, 1);

    // Ice skating rink
    ctx.fillStyle = "#c0e5ff";
    ctx.fillRect(Math.round(room.x + 65 - camera.x), Math.round(room.y + 20 - camera.y), 50, 30);
    ctx.strokeStyle = "#4a8aaa";
    ctx.lineWidth = 2;
    ctx.strokeRect(Math.round(room.x + 65 - camera.x), Math.round(room.y + 20 - camera.y), 50, 30);
  }

  // --- Draw entire world --------------------------------------------------
  function drawWorld(ctx, camera) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const room of rooms) {
      drawRoomBase(ctx, camera, room);
      switch (room.type) {
        case "main":
          drawMainDecor(ctx, camera, room);
          break;
        case "gift":
          drawUniversity(ctx, camera, room);
          break;
        case "lights":
          drawStadium(ctx, camera, room);
          break;
        case "cookies":
          drawMarket(ctx, camera, room);
          break;
        case "snow":
          drawSnowGarden(ctx, camera, room);
          break;
      }
    }
    drawPaths(ctx, camera);
  }

  function drawPaths(ctx, camera) {
    ctx.strokeStyle = "#ffd93b";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);

    const main = rooms[0];
    for (let i = 1; i < rooms.length; i++) {
      const room = rooms[i];
      ctx.beginPath();
      ctx.moveTo(Math.round(main.x + main.w/2 - camera.x), Math.round(main.y + main.h/2 - camera.y));
      ctx.lineTo(Math.round(room.x + room.w/2 - camera.x), Math.round(room.y + room.h/2 - camera.y));
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }

  function getRoomWalls(room) {
    const walls = [];
    const WALL_THICKNESS = 3;

    if (room.id === "main") return walls;

    const configs = {
      gift: { top: true, left: true, right: true },
      lights: { top: true, bottom: true, left: true },
      cookies: { top: true, bottom: true, right: true },
      snow: { bottom: true, left: true, right: true },
    };

    const cfg = configs[room.id];
    if (!cfg) return walls;

    if (cfg.top) walls.push({ x: room.x - 2, y: room.y - 2, w: room.w + 4, h: WALL_THICKNESS });
    if (cfg.bottom) walls.push({ x: room.x - 2, y: room.y + room.h - WALL_THICKNESS + 2, w: room.w + 4, h: WALL_THICKNESS });
    if (cfg.left) walls.push({ x: room.x - 2, y: room.y - 2, w: WALL_THICKNESS, h: room.h + 4 });
    if (cfg.right) walls.push({ x: room.x + room.w - WALL_THICKNESS + 2, y: room.y - 2, w: WALL_THICKNESS, h: room.h + 4 });

    return walls;
  }

  function getPlayerStart() {
    const main = rooms[0];
    return {
      x: main.x + main.w / 2 - 3,
      y: main.y + main.h / 2 - 4,
    };
  }

  window.World = {
    WORLD_WIDTH,
    WORLD_HEIGHT,
    rooms,
    drawWorld,
    getPlayerStart,
    getRoomWalls,
  };

  // Safe register
  if (typeof window.registerModule === "function") {
    window.registerModule('world');
  }
})();