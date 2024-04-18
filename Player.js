const UP = "KeyW";
const DOWN = "KeyS";
const LEFT = "KeyA";
const RIGHT = "KeyD";

const VELOCITY = 0.07;

const animations = {
  up: { x: 0, y: 2 },
  down: { x: 0, y: 0 },
  left: { x: 0, y: 3 },
  right: { x: 0, y: 1 },
};

class Player {
  ctx;
  x = 50;
  y = 260;
  width = 24;
  height = 48;
  velocity = { x: 0, y: 0 };

  #image;
  #isLoaded = false;
  #keysPressed = new Set();
  #lastSprite = animations.down;

  constructor(ctx) {
    this.ctx = ctx;

    this.#load();

    window.addEventListener("keydown", (event) => {
      this.#keysPressed.add(event.code);
    });

    window.addEventListener("keyup", (event) => {
      this.#keysPressed.delete(event.code);
    });
  }

  #load() {
    this.#image = new Image();
    this.#image.src = "./assets/character.png";
    this.#image.onload = () => {
      this.#isLoaded = true;
    };
  }

  update(delta, collisionObjects) {
    if (!this.#isLoaded) {
      return;
    }

    this.velocity.x = 0;
    this.velocity.y = 0;

    if (this.#keysPressed.has(UP)) {
      this.velocity.y -= VELOCITY;
    } else if (this.#keysPressed.has(DOWN)) {
      this.velocity.y += VELOCITY;
    }

    if (this.#keysPressed.has(LEFT)) {
      this.velocity.x -= VELOCITY;
    } else if (this.#keysPressed.has(RIGHT)) {
      this.velocity.x += VELOCITY;
    }

    const x = this.x + this.velocity.x * delta;
    const y = this.y + this.velocity.y * delta;

    if (!this.#checkCollisions({ x: x, y: y }, collisionObjects)) {
      this.x = x;
      this.y = y;
    }
  }

  draw() {
    if (!this.#isLoaded) {
      return;
    }

    const sprite = this.#getSprite();

    this.ctx.drawImage(
      this.#image,
      sprite.x * 16,
      sprite.y * 32,
      16,
      32,
      this.x,
      this.y,
      this.width,
      this.height,
    );
  }

  #getSprite() {
    if (this.velocity.x !== 0) {
      const sprite = this.velocity.x > 0 ? animations.right : animations.left;
      this.#lastSprite = sprite;

      return sprite;
    }

    if (this.velocity.y !== 0) {
      const sprite = this.velocity.y > 0 ? animations.down : animations.up;
      this.#lastSprite = sprite;

      return sprite;
    }

    return this.#lastSprite;
  }

  #checkCollisions(pos, collisionObjects) {
    const height = this.height / 2;
    const y = pos.y + height;

    for (const object of collisionObjects) {
      if (
        pos.x < object.x + object.width &&
        pos.x + this.width > object.x &&
        y < object.y + object.height &&
        y + height > object.y
      ) {
        return true;
      }
    }

    return false;
  }
}

export default Player;
