import Vipi from './vipi.js';

var hero;

var baseWidth = 500;
var baseHeight = 250;
var scaleX;
var scaleY;
var skyHeight = 5;
var groundHeight = 10;
var score = 0;

window.setup = function() {
    scaleX = 1.0;
    scaleY = 1.0;

    createCanvas(baseWidth * scaleX, baseHeight * scaleY);
    frameRate(30);
    hero = new Vipi(30, 50, 0, 0.13, 0.9, 0.99, 1, 22, 22);
}

window.draw = function() {
    window.update();
    background(255, 100, 200);
    hero.draw(scaleX, scaleY);
    fill(255);
    text(floor(score), 1 * scaleX, (baseHeight) * scaleY - 1);

}
window.update = function() {
    var currentSpeed = 1 + pow(frameCount / 60.0, 0.75);
    score += currentSpeed / 30.0;
    hero.update(baseHeight, groundHeight, skyHeight, currentSpeed);
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