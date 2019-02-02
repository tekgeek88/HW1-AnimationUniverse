const assets = {
  background01:   './img/background01.jpg',
  background02:   './img/background02.jpg',
  background03:   './img/background03.jpg',
  background04:   './img/background04.jpg',
  background05:   './img/background05.jpg',
  background06:   './img/background06.jpg',
  planetEarth:    './img/Planet-1-412_80x80.png'
};

const AM = new AssetManager();

for (const key of Object.keys(assets)) {
  AM.queueDownload(assets[key]);
}


class Animation {
  constructor(spritesheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration,
              frames, loop) {
    this.spriteSheet = spritesheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frameDuration = frameDuration;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
  }

  drawFrame(tick, ctx, x, y, scaleBy) {
    let scale = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.isDone()) {
      if (this.loop) {
        this.elapsedTime -= this.totalTime;
      }
    }
    let frame = this.currentFrame();

    let index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    let vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
      index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
      vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
      index -= Math.floor(this.spriteSheet.width / this.frameWidth);
      vindex++;
    }
    let locX = x;
    let locY = y;
    let offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
        index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
        this.frameWidth, this.frameHeight,
        locX, locY,
        this.frameWidth * scale,
        this.frameHeight * scale);
  }

  currentFrame() {
    return Math.floor(this.elapsedTime / this.frameDuration);
  }

  isDone() {
    return (this.elapsedTime >= this.totalTime);
  }
}

// no inheritance
class FixedImage { //(game, spritesheet) {
  constructor(game, spritesheet,x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.spritesheet = spritesheet;
    this.game = game;
  }

  update() {

  };

  draw(ctx) {
    ctx.drawImage(this.spritesheet, this.x, this.y, this.w, this.h);
  }

}



class Planet {
  constructor(game, animation, x, y) {
    this.game = game;
    this.animation = animation;
    this.x = x;
    this.y = y;
  }

  update() {
    // Need to implement in superclasses
  }

  draw(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1);
  }
}

class PlanetEarth extends Planet {
  constructor(game, spritesheet, x, y) {
    super(game, new Animation(spritesheet, 0, 0, 32, 32, 192, 0.167, 6, true), x, y);
  }

  update() {

  }
}

AM.queueDownload('./img/background01.jpg');

AM.downloadAll(function () {

  const canvas = document.getElementById('universe');
  const ctx = canvas.getContext('2d');

  const gameEngine = new GameEngine();
  gameEngine.init(ctx);
  gameEngine.start();

  let background01 = new FixedImage(gameEngine, AM.getAsset(assets.background01), 0, 0, 1920, 1080);

  gameEngine.addEntity(background01);

  console.log('Finished downloading assets');
});
