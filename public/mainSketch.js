import Vipi from './vipi.js';
import BasicEnemy from './basicEnemy.js';

var day = "/ressources/day/";
var night = "/ressources/night/";
var hero;
var enemies;
var baseWidth = 480;
var baseHeight = 270;
var scaleX;
var scaleY;
var skyHeight = 5;
var groundHeight = 10;
var score = 0;
var basicSpeed = 1;
const ENEMY_TYPES = {
    TORNADO: 0,
    CACTUS: 1,
    SNAKE: 2,
    VULTURE: 3,
}

var backgroundWidth = 5000;
var xBackground = 0;


const MIN_FRAME_GEN_WAIT = 50;
const MAX_FRAME_GEN_WAIT = 250; //250
var framesBeforeSpawn = 1;

var dates = ["day", "night"];
var cactusSkin;
var vautourSkin;
var snakeSkin;
var tornadoSkin;
var backgroundSkin;

var name = "__________"

window.setup = function() {
    var heroSkin = {
        "day": [loadImage(day + 'vipi1.png'), loadImage(day + 'vipi2.png')],
        "night": [loadImage(night + 'vipi1.png'), loadImage(night + 'vipi2.png')]
    };
    vautourSkin = {
        "day": [loadImage(day + 'vautour.png')],
        "night": [loadImage(night + 'vautour.png')]
    };

    cactusSkin = {
        "day": [loadImage(day + 'cactus.png')],
        "night": [loadImage(night + 'cactus.png')]
    };
    snakeSkin = {
        "day": [loadImage(day + 'snake3.png')],
        "night": [loadImage(night + 'snake3.png')]
    };
    tornadoSkin = {
        "day": [loadImage(day + 'tornade.png')],
        "night": [loadImage(night + 'tornade.png')]
    };
    backgroundSkin = {
        "day": [loadImage("/ressources/day/Background.png")],
        "night": [loadImage("/ressources/night/Background.png")]
    }

    scaleX = 0.95 * min(windowWidth / baseWidth, windowHeight / baseHeight);
    scaleY = scaleX;
    createCanvas(baseWidth * scaleX, baseHeight * scaleY);
    background(0);
    frameRate(30);
    hero = new Vipi(30, 50, 0, 0.13, 0.9, 0.99, 1, 32, 32, heroSkin);
    enemies = [];
}

window.draw = function() {
    if (hero.alive) {
        window.update();
        background(255, 100, 200);
        image(backgroundSkin[dates[floor(frameCount / 750) % 2]][0], 0, 0, baseWidth * scaleX, baseHeight * scaleY, xBackground, 0, baseWidth, baseHeight);
        image(backgroundSkin[dates[floor(frameCount / 750) % 2]][0], 0, 0, baseWidth * scaleX, baseHeight * scaleY, xBackground - 5000, 0, baseWidth, baseHeight);
        hero.draw(frameCount, scaleX, scaleY, dates[floor(frameCount / 750) % 2]);
        fill(255);
        text(floor(score), 1 * scaleX, (baseHeight) * scaleY - 1);
        for (var v of enemies) {
            v.draw(frameCount, scaleX, scaleY, dates[floor(frameCount / 750) % 2]);
        }
    } else {
        if (frameCount - hero.frame < 20) {
            background(0, 0, 0, 40);
        } else {
            if (frameCount - hero.frame == 20) {
                background(0);
            }
            //255,235,150
            fill(255, 235, 150, 20);
            textSize(32);
            text(" Score : " + floor(score), baseWidth * scaleX * 3 / 8, baseHeight * scaleY / 4);
            text(name, baseWidth * scaleX * 3 / 8, baseHeight * scaleY / 4 + 50);

        }
    }

}

window.windowResized = function() {
    scaleX = 0.95 * min(windowWidth / baseWidth, windowHeight / baseHeight);
    scaleY = scaleX;
    resizeCanvas(baseWidth * scaleX, baseHeight * scaleY);
    background(0);
}

window.update = function() {
    if (hero.alive) {
        var currentSpeed = 1 + pow(frameCount / 60.0, 0.75);
        xBackground += currentSpeed * 0.5;
        if (xBackground > 6000) {
            xBackground -= backgroundWidth;
        }
        score += currentSpeed / 30.0;
        hero.update(baseHeight, groundHeight, skyHeight, currentSpeed, frameCount);
        for (var v = enemies.length - 1; v >= 0; v--) {
            enemies[v].update(currentSpeed, hero);

        }
        var newEnemies = [];
        for (var v of enemies) {
            if (v.out(baseHeight))
                newEnemies.push(v);
        }
        framesBeforeSpawn -= currentSpeed;

        if (framesBeforeSpawn <= 0) {
            generateEnemy();
        }

    }
}




window.generateEnemy = function() {
    var enemyType = floor(Math.random() * 4);
    switch (enemyType) {
        case (ENEMY_TYPES.CACTUS):
            enemies.push(new BasicEnemy(baseWidth, baseHeight - groundHeight - 64, -basicSpeed, 0, 32, 64, cactusSkin));
            console.log("cactus spawned");
            break;
        case (ENEMY_TYPES.SNAKE):
            enemies.push(new BasicEnemy(baseWidth, baseHeight - groundHeight - 64, -basicSpeed, 0, 32, 64, snakeSkin));

            break;
        case (ENEMY_TYPES.TORNADO):
            enemies.push(new BasicEnemy(baseWidth, skyHeight + random() * (baseHeight), -basicSpeed, 0, 48, 64, tornadoSkin));
            break;
        case (ENEMY_TYPES.VULTURE):
            var endHeight = random() * baseHeight;
            var distance = sqrt((endHeight - skyHeight) * (endHeight - skyHeight) + (baseWidth) * (baseWidth));

            enemies.push(new BasicEnemy(baseWidth, skyHeight, -basicSpeed * 2 * baseWidth / distance, (endHeight - skyHeight) / distance, 37, 24, vautourSkin));
            break;
    }
    framesBeforeSpawn = floor(random() * (MAX_FRAME_GEN_WAIT - MIN_FRAME_GEN_WAIT)) + MIN_FRAME_GEN_WAIT;
}

window.handlePressed = function() {
    hero.onUpPressed();
}
window.handleReleased = function() {
    hero.onUpReleased();

}

function sendScore(score, name) {
    console.log("enter rt");
}


window.keyPressed = function() {
    handlePressed();
    if (!hero.alive) {
        if (key == "Enter") {
            sendScore(score, name);
        } else {
            console.log(key.length);
            if (key.length == 1 && name.indexOf("_") != -1) {
                console.log(key);
                name = name.replace("_", key);
            }
        }
    }
}
window.keyReleased = function() {
    handleReleased();
}
window.touchStarted = function() {
    handlePressed();
}
window.touchEnded = function() {
    handleReleased();
}