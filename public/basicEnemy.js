export default class {
    constructor(x, y, vx, vy, width, height, skin = null) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.width = width;
        this.height = height;
        this.skin = skin;
    }

    update(speed, vipi) {
        this.x += this.vx * speed;
        this.y += this.vy * speed;
        this.checkHitBox(vipi);
    }

    draw(frame, scaleX = 1.0, scaleY = 1.0, date = 'day') {
        if (this.skin === null) {
            fill(255, 0, 0);
            rect(this.x * scaleX, this.y * scaleY, this.width * scaleX, this.height * scaleY);
        } else {

            var skin = this.skin[date];
            image(this.skin[date][floor(frame / 30) % this.skin[date].length], this.x * scaleX, this.y * scaleY, this.width * scaleX, this.height * scaleY);
        }
    }

    checkHitBox(vipi) {
        if (((this.x <= vipi.x + vipi.width) && (this.x >= vipi.x)) || ((this.x + this.width <= vipi.x + vipi.width) && (this.x + this.width >= vipi.x))) {
            if (((this.y <= vipi.y + vipi.height) && (this.y >= vipi.y)) || ((this.y + this.height <= vipi.y + vipi.height) && (this.y + this.height >= vipi.y))) {
                vipi.die();
            }
        }

    }

    out(height) {
        if (this.x < 0)
            return true;
        if (this.y < 0)
            return true;
        if (this.y > height)
            return true;
        return false;
    }
}