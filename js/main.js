const assets = {
  gridBackground: './img/grid_background.jpg',
  background01:   './img/background01.jpg',
  background02:   './img/background02.jpg',
  background03:   './img/background03.jpg',
  background04:   './img/background04.jpg',
  background05:   './img/background05.jpg',
  background06:   './img/background06.jpg',
  planetEarth:    './img/planetearth-80x80x2400.png',
  planetUranus:   './img/planeturanus-90x90x2700.png',
  planetSaturn:   './img/planetsaturn-192x110-5760.png',
  planetMercury:  './img/planetmercury-70x70x2100.png',
  planetMars:     './img/planetmars-100x100x3000.png'


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
  // Let x, y be the center of the circle
  constructor(game, animation, x, y, r) {
    this.game = game;
    this.animation = animation;
    this.x = x;
    this.y = y;
    this.r = r;
    this.a = 0;// angle (from 0 to Math.PI * 2)
  }

  update() {
    // Need to implement in superclasses
  }

  draw(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1);
  }
}

class PlanetEarth extends Planet {
  constructor(game, spritesheet, x, y, r) {
    //  spritesheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop)
    super(game, new Animation(spritesheet, 0, 0, 80, 80, 2400, .05, 30, true), x, y, r);
  }

  update() {
    this.a = (this.a + Math.PI / 180) % (Math.PI * 2);
    let px = this.x + this.r * Math.cos(this.a);
    let py = this.y + this.r * Math.sin(this.a);
    // console.log("x: " + this.x + " y: " + this.y + " r: " + this.r + " a: " + this.a);
    // console.log("px: " + px + " py: " + py);
    this.x = px;
    this.y = py;
  }
}

class PlanetUranus extends Planet {
  constructor(game, spritesheet, x, y, r) {
    //  spritesheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop)
    super(game, new Animation(spritesheet, 0, 0, 90, 90, 2700, .03, 30, true), x, y, r);
    this.a = 0.5; // Adjust the initial angle of the planet
  }

  update() {
    this.a = (this.a + Math.PI / 360) % (Math.PI * 2);
    let px = this.x + this.r * Math.cos(this.a);
    let py = this.y + this.r * Math.sin(this.a);
    this.x = px;
    this.y = py;
  }
}


class PlanetSaturn extends Planet {
  constructor(game, spritesheet, x, y, r) {
    //  spritesheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop)
    super(game, new Animation(spritesheet, 0, 0, 192, 110, 5760, .03, 30, true), x, y, r);
    this.a = 1; // Adjust the initial angle of the planet
  }

  update() {
    this.a = (this.a + Math.PI / 360) % (Math.PI * 2);
    let px = this.x + this.r * Math.cos(this.a);
    let py = this.y + this.r * Math.sin(this.a);
    this.x = px;
    this.y = py;
  }
}

class PlanetMars extends Planet {
  constructor(game, spritesheet, x, y, r) {
    //  spritesheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop)
    super(game, new Animation(spritesheet, 0, 0, 100, 100, 3000, .01, 30, true), x, y, r);
    this.a = -0.5; // Adjust the initial angle of the planet
  }

  update() {
    this.a = (this.a + Math.PI / 360) % (Math.PI * 2);
    let px = this.x + this.r * Math.cos(this.a);
    let py = this.y + this.r * Math.sin(this.a);
    this.x = px;
    this.y = py;
  }
}

class PlanetMercury extends Planet {
  constructor(game, spritesheet, x, y, r) {
    //  spritesheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop)
    super(game, new Animation(spritesheet, 0, 0, 70, 70, 2100, .07, 30, true), x, y, r);
    this.a = -0.5; // Adjust the initial angle of the planet
  }

  update() {
    this.a = (this.a + Math.PI / 360) % (Math.PI * 2);
    let px = this.x + this.r * Math.cos(this.a);
    let py = this.y + this.r * Math.sin(this.a);
    this.x = px;
    this.y = py;
  }
}


AM.downloadAll(function () {

  const canvas = document.getElementById('universe');
  const ctx = canvas.getContext('2d');

  const gameEngine = new GameEngine();
  gameEngine.init(ctx);
  gameEngine.start();

  let background = new FixedImage(gameEngine, AM.getAsset(assets.background04), 0, 0, 1920, 1080);

  let planetEarth = new PlanetEarth(gameEngine, AM.getAsset(assets.planetEarth),            1920/2, 1080/3, 1.6);
  let planetUranus = new PlanetUranus(gameEngine, AM.getAsset(assets.planetUranus),         1920/2, 1080/3, 2);
  let planetSaturn = new PlanetSaturn(gameEngine, AM.getAsset(assets.planetSaturn),         1920/2 + 100, 1080/3, 3);
  let planetMercury = new PlanetMercury(gameEngine, AM.getAsset(assets.planetMercury),      1920/2, 1080/3 - 250, 3.9);
  let planetMars = new PlanetMars(gameEngine, AM.getAsset(assets.planetMars),               1920/2, 1080/3 - 250, 2.5);

  // gameEngine.addEntity(background01);
  gameEngine.addEntity(background);

  // Add teh planets
  gameEngine.addEntity(planetEarth);
  gameEngine.addEntity(planetUranus);
  gameEngine.addEntity(planetSaturn);
  gameEngine.addEntity(planetMars);
  gameEngine.addEntity(planetMercury);

  console.log('Finished downloading assets');
});
