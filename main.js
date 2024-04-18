"use strict";

import World from "./World.js";
import Player from "./Player.js";

(async () => {
  const canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");

  const levelResponse = await fetch("./levels/map1.json");
  const level = await levelResponse.json();
  const world = new World(ctx, level);
  const player = new Player(ctx);

  let lastTimestamp = 0;

  function loop(timestamp) {
    const delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    player.update(delta, world.collisionObjects);

    world.draw(0, 2);
    player.draw();
    world.draw(2, 3);

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
