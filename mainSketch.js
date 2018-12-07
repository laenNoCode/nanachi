import Vipi from './vipi.js';
import BasicEnemy from './basicEnemy.js';

var day = "ressources/day/";
var night = "ressources/night/";
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
const MIN_FRAME_GEN_WAIT = 50;
const MAX_FRAME_GEN_WAIT = 250;
var framesBeforeSpawn = 1;

var cactusSkin;
var vautourSkin;



window.setup = function() {

    var heroSkin = {
        "day": [loadImage(day + 'vipi1.png'), loadImage(day + 'vipi2.png')],
        "night": [loadImage(night + 'vipi1.png'), loadImage(night + 'vipi2.png')]
    };
    vautourSkin = {
        "day": [loadImage(day + 'vautour.png')],
        "night": [loadImage(night + 'vautour.png')]
    };
    scaleX = 1.0;
    scaleY = 1.0;
    createCanvas(baseWidth * scaleX, baseHeight * scaleY);
    frameRate(30);
    hero = new Vipi(30, 50, 0, 0.13, 0.9, 0.99, 1, 32, 32, heroSkin);
    enemies = [];
}

window.draw = function() {
    if (hero.alive) {
        window.update();
        background(255, 100, 200);
        hero.draw(frameCount, scaleX, scaleY);
        fill(255);
        text(floor(score), 1 * scaleX, (baseHeight) * scaleY - 1);
        for (var v of enemies) {
            v.draw(frameCount, scaleX, scaleY);
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
            text(" Score : " + floor(score), baseWidth / 4, baseHeight / 4);

        }
    }

}
window.update = function() {
    if (hero.alive) {
        var currentSpeed = 1 + pow(frameCount / 60.0, 0.75)
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
            enemies.push(new BasicEnemy(baseWidth, baseHeight - groundHeight - 64, -basicSpeed, 0, 32, 64));
            console.log("cactus spawned");
            break;
        case (ENEMY_TYPES.SNAKE):
            enemies.push(new BasicEnemy(baseWidth, baseHeight - groundHeight - 64, -basicSpeed, 0, 32, 64));

            break;
        case (ENEMY_TYPES.TORNADO):
            enemies.push(new BasicEnemy(baseWidth, skyHeight + random() * (baseHeight), -basicSpeed, 0, 48, 64));
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

window.keyPressed = function() {
    handlePressed();
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