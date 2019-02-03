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
  planetMars:     './img/planetmars-100x100x3000.png',
  meteor:         './img/meteor-236x398x2596.png',
  spaceship:      './img/spaceship-64x64x512.png'
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

class AnimatedSprite {
  // Let x, y be the center of the circle
  constructor(game, animation, x, y, scaleFactor) {
    this.game = game;
    this.animation = animation;
    this.x = x;
    this.y = y;
    this.scaleFactor = scaleFactor;
  }

  update() {
    // Need to implement in superclasses
  }

  draw(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scaleFactor);
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

// Random meteors falling from the top down
class Meteor extends AnimatedSprite {
  constructor(game, spritesheet, x, y, scaleFactor) {
    //  spritesheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop)
    super(game, new Animation(spritesheet, 0, 0, 236, 398, 2596, .07, 11, true, 45), x, y, scaleFactor);
    this.count = 1;
    this.isFalling = false;
    this.waitTime = 400;
    this.isNegative = false;
    this.xDecrement = 0;
    this.yDecrement = 0;
    this.isDone = true;
    this.isFalling = false;
    this.waitTime = Math.floor(Math.random() * 300) + 1;
  }

  update() {
    // If the meteor is not falling check to see if it can fall.

    if (this.count % this.waitTime == 0 && this.isDone) {
      this.isFalling = true;
      this.isDone = false;

      if (Math.floor(Math.random() * 2) + 0 > 0) {
        this.isNegative = true;
      } else {
        this.isNegative = false;
      }

      // Choose a size at which the meteor should be
      this.scaleFactor = Math.floor(Math.random() * 1.1) + 0.5;

      // Choose the speed at which the meteor should fall
      this.xDecrement = Math.floor(Math.random() * 30) + 1;
      this.yDecrement = Math.floor(Math.random() * 30) + 1;
    }

    if (this.isFalling) {
      if (this.isNegative) {
        this.x = this.x + this.xDecrement;
      } else {
        this.x = this.x - this.xDecrement;
      }
      this.y = this.y + this.yDecrement;

      // If we are done falling we should reset things
      if (this.x > 1920 + 500 || this.y > 1080 + 500) {
        this.isFalling = false;

        // Choose the new starting coordinates randomly
        this.y = -1000;
        this.x = Math.floor(Math.random() * 1920 + 300) + -500;

        // Generate the next amount of time to wait for another meteor.
        this.waitTime = Math.floor(Math.random() * 500) + 1;
        this.isDone = true;
      }
    }
    this.count++;
  }
}


// Random meteors coming from the vanishing point
class MeteorFromCenter extends AnimatedSprite {
  constructor(game, spritesheet, x, y, scaleFactor) {
    //  spritesheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop)
    super(game, new Animation(spritesheet, 0, 0, 236, 398, 2596, .07, 11, true, 45), x, y, scaleFactor);
    this.count = 1;
    this.isFalling = false;
    this.waitTime = 400;
    this.isNegativeX = false;
    this.xDecrement = 0;
    this.yDecrement = 0;
    this.isDone = true;
    this.isFalling = false;
    this.waitTime = Math.floor(Math.random() * 12) + 1;
    this.scaleFactor = 0.01;
    this.scaleFactorScaler = 0.01;
  }

  update() {
    // If the meteor is not falling check to see if it can fall.
    if (this.count % this.waitTime == 0 && this.isDone) {
      this.isFalling = true;
      this.isDone = false;

      // Choose the starting location and the starting size
      this.x = 1920/2;
      this.y = 1080/2;
      this.scaleFactor = 0.01;
      this.scaleFactorScaler = Math.floor(Math.random() * 1.2) + 0.01;


      let randomA = Math.floor(Math.random() * 2) + 0;
      let randomB = Math.floor(Math.random() * 2) + 0;

      if (randomA > 0) {
        this.isNegativeX = true;
      } else {
        this.isNegativeX = false;
      }
      if (randomB > 0) {
        this.isNegativeY = true;
      } else {
        this.isNegativeY = false;
      }

      // Choose the speed at which the meteor should fall
      this.xDecrement = Math.floor(Math.random() * 0.01) + 0;
      this.yDecrement = Math.floor(Math.random() * 0.01) + 0;
    }
    //
    if (this.isFalling) {
      if (this.isNegativeX) {
        this.x -= (++this.xDecrement);
      } else {
        this.x += (++this.xDecrement);
      }

      if (this.isNegativeY) {
        this.y -= (++this.yDecrement);
      } else {
        this.y += (++this.yDecrement);
      }

      // This helps the meteors increase speed as they get closer
      this.scaleFactor += this.scaleFactorScaler;

      // If we are done falling we should reset things
      // Two cases:
      // Meteor is traveling in the positive x direction or in the negative x direction
      if (this.isNegativeX && this.x < -1920 - 500) {
        this.isFalling = false;
        this.isDone = true;
        // Generate the next amount of time to wait for another meteor.
        this.waitTime = Math.floor(Math.random() * 20) + 1;
      } else if ((!this.isNegativeX) && this.x > 1920 + 500){
        this.isFalling = false;
        this.isDone = true;
        // Generate the next amount of time to wait for another meteor.
        this.waitTime = Math.floor(Math.random() * 500) + 1;
      }
    }
    this.count++;
  }
}




// Random meteors coming from the vanishing point
class SpaceShipFromEdge extends AnimatedSprite {
  constructor(game, spritesheet, x, y, scaleFactor) {
    //  spritesheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop)
    super(game, new Animation(spritesheet, 0, 6*64, 64, 64, 512, .07, 3, true), x, y, scaleFactor);
    this.count = 1;
    this.x = x;
    this.intialX = x;
    this.y = y;
    this.intialY = y;
    this.isFalling = false;
    this.waitTime = 400;
    this.isNegativeX = false;
    this.xDecrement = 0;
    this.yDecrement = 0;
    this.isDone = true;
    this.isFalling = false;
    this.waitTime = Math.floor(Math.random() * 12) + 1;
    this.initialScale = scaleFactor;
    this.scaleFactor = scaleFactor;
    this.scaleFactorScaler = 0.006;
  }

  update() {
    // If the meteor is not falling check to see if it can fall.
    if (this.count % this.waitTime == 0 && this.isDone) {
      this.isFalling = true;
      this.isDone = false;

      // Choose the starting location and the starting size
      this.x = this.intialX;
      this.y = this.intialY;
      this.scaleFactor = this.initialScale;

      // Choose the speed at which the meteor should fall
      this.xDecrement = 2;
      this.yDecrement = 2;
    }
    //
    if (this.isFalling) {
      this.x -= (this.xDecrement + 0.01);
      this.y += (this.yDecrement + 0.01);

      this.scaleFactor -= this.scaleFactorScaler;

      console.log('x: ' + this.x + ' y: ' + this.y + ' scaleFactor: ' + this.scaleFactor + ' scaleFactorScaler: ' + this.scaleFactorScaler);
      console.log('isNegtive ' + this.isNegativeX);
      // If we are done falling we should reset things
      // Two cases:
      // Meteor is traveling in the positive x direction or in the negative x direction
      if (this.x < (1920 / 2) - 300) {
        this.isFalling = false;
        this.isDone = true;
        // Generate the next amount of time to wait for another meteor.
        this.waitTime = Math.floor(Math.random() * 500) + 1;
      }
    }
    this.count++;
  }
}





AM.downloadAll(function () {

  const canvas = document.getElementById('universe');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;    // prevent anti-aliasing of drawn image

  const gameEngine = new GameEngine();
  gameEngine.init(ctx);
  gameEngine.start();

  let background = new FixedImage(gameEngine, AM.getAsset(assets.background04), 0, 0, 1920, 1080);
  let spaceship = new FixedImage(gameEngine, AM.getAsset(assets.spaceship), 0, 0, 150, 150);

  let planetEarth = new PlanetEarth(gameEngine, AM.getAsset(assets.planetEarth),            1920/2, 1080/3, 1.6);
  let planetUranus = new PlanetUranus(gameEngine, AM.getAsset(assets.planetUranus),         1920/2, 1080/3, 2);
  let planetSaturn = new PlanetSaturn(gameEngine, AM.getAsset(assets.planetSaturn),         1920/2 + 100, 1080/3, 3);
  let planetMercury = new PlanetMercury(gameEngine, AM.getAsset(assets.planetMercury),      1920/2, 1080/3 - 250, 3.9);
  let planetMars = new PlanetMars(gameEngine, AM.getAsset(assets.planetMars),               1920/2, 1080/3 - 250, 2.5);
  let meteor1 = new Meteor(gameEngine, AM.getAsset(assets.meteor), -300, -500, 1);
  let meteor2 = new Meteor(gameEngine, AM.getAsset(assets.meteor), 0, -500, 1);
  let meteor3 = new Meteor(gameEngine, AM.getAsset(assets.meteor), 0, -500, 1);
  let meteorVanishingPoint1 = new MeteorFromCenter(gameEngine, AM.getAsset(assets.meteor), 1920/2, 1080/2, 0.01);
  let meteorVanishingPoint2 = new MeteorFromCenter(gameEngine, AM.getAsset(assets.meteor), 1920/2, 1080/2, 0.01);
  let meteorVanishingPoint3 = new MeteorFromCenter(gameEngine, AM.getAsset(assets.meteor), 1920/2, 1080/2, 0.01);
  let spaceShipTopRightEdge = new SpaceShipFromEdge(gameEngine, AM.getAsset(assets.spaceship), 1550, -100, 3);

  // gameEngine.addEntity(background01);
  gameEngine.addEntity(background);

  // Add teh planets
  gameEngine.addEntity(planetEarth);
  gameEngine.addEntity(planetUranus);
  gameEngine.addEntity(planetSaturn);
  gameEngine.addEntity(planetMars);
  gameEngine.addEntity(planetMercury);
  gameEngine.addEntity(meteor1);
  gameEngine.addEntity(meteor2);
  gameEngine.addEntity(meteor3);
  gameEngine.addEntity(meteorVanishingPoint1);
  gameEngine.addEntity(meteorVanishingPoint2);
  gameEngine.addEntity(meteorVanishingPoint3);
  gameEngine.addEntity(spaceShipTopRightEdge);


  console.log('Finished downloading assets');
});
