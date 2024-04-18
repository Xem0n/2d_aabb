const COLLISION_LAYER = 3;

class World {
  ctx;
  level;
  collisionObjects = [];

  #tilesetWidth = 40;
  #tileset;
  #isLoaded = false;

  constructor(ctx, level) {
    this.ctx = ctx;
    this.level = level;

    this.#load();
    this.#initCollisionsObjects();
  }

  #load() {
    this.#tileset = new Image();
    this.#tileset.src = "./assets/Overworld.png";
    this.#tileset.onload = () => {
      this.#isLoaded = true;
    };
  }

  #initCollisionsObjects() {
    const layer = this.level.layers[COLLISION_LAYER];

    if (!layer) {
      return;
    }

    for (let i = 0; i < layer.data.length; i++) {
      if (layer.data[i] === 0) {
        continue;
      }

      const x = (i % layer.width) * this.level.tilewidth;
      const y = Math.floor(i / layer.width) * this.level.tileheight;

      this.collisionObjects.push({
        x: x,
        y: y,
        width: this.level.tilewidth,
        height: this.level.tileheight,
      });
    }
  }

  draw(startLayer = 0, endLayer = this.level.layers.length) {
    if (!this.#isLoaded) {
      return;
    }

    for (let i = startLayer; i < endLayer; i++) {
      this.#drawLayer(this.level.layers[i]);
    }
  }

  #drawLayer(layer) {
    const width = layer.width;
    const tileWidth = this.level.tilewidth;
    const tileHeight = this.level.tileheight;

    let x = 0;
    let y = 0;

    const increasePos = () => {
      x += tileWidth;

      if (x >= width * tileWidth) {
        x = 0;
        y += tileHeight;
      }
    };

    const tiles = layer.data;

    for (const tile of tiles) {
      if (tile === 0) {
        increasePos();

        continue;
      }

      const tileX = (tile % this.#tilesetWidth) - 1;
      const tileY = Math.floor(tile / this.#tilesetWidth);

      this.ctx.drawImage(
        this.#tileset,
        tileX * tileWidth,
        tileY * tileHeight,
        tileWidth,
        tileHeight,
        x,
        y,
        tileWidth,
        tileHeight,
      );

      increasePos();
    }
  }
}

export default World;
