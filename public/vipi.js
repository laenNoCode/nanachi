export default class {
    constructor(x, y, vy, gravity, fUp, fDown, accel, width, height, skin = null) {
        this.x = x;
        this.y = y;
        this.vy = vy;
        this.gravity = gravity;
        this.fUp = fUp;
        this.fDown = fDown;
        this.accel = accel;
        this.width = width;
        this.height = height;
        this.skin = skin;
        this.pressed = false;
        this.alive = true;
    }

    draw(frame, scaleX = 1.0, scaleY = 1.0, date = 'day') {
        if (this.skin === null) {
            fill(0, 0, 255);
            noStroke();
            rect(this.x * scaleX, this.y * scaleY, this.width * scaleX, this.height * scaleY);
        } else {

            var skin = this.skin[date];
            image(this.skin[date][floor(frame / 30) % this.skin[date].length], this.x * scaleX, this.y * scaleY, this.width * scaleX, this.height * scaleY);
        }
    }
    update(baseHeight, groundHeight, skyHeight, speed = 1.0, frame) {
        this.vy += this.gravity;
        this.vy *= (this.vy > 0) ? this.fDown : this.fUp;
        this.y += this.vy * speed;
        if (this.pressed) {
            this.vy -= this.accel;
        }
        if (this.y + this.height + groundHeight > baseHeight) {
            this.y = baseHeight - this.height - groundHeight;
            if (this.vy > 0) {
                this.vy = 0;
            }
        }
        if (this.y < skyHeight) {
            this.y = skyHeight;
            if (this.vy < 0) {
                this.vy = 0;
            }
        }
        this.frame = frame;
    }

    onUpPressed() {
        this.pressed = true;
    }
    onUpReleased() {
        this.pressed = false;
    }
    die() {
        this.alive = false;
        console.log("dead");
    }
}