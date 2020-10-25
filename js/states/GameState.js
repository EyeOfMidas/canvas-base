import { canvas, fsm, StateKey } from '../Core.js';
import { keys, KeyCode } from '../KeyboardInput.js';
export class GameState {
    constructor() {
        this.init();
    }

    init() {
        this.camera = { x: 0, y: 0, center: { x: 0, y: 0 }, movementSpeed: 3 };
        this.isDragging = false;
        this.dragCompleted = false;
        this.startDrag = { x: 0, y: 0 };
        this.dragDelta = { x: 0, y: 0 };

        this.player = {
            x: 50,
            y: 50,
            width: 20,
            height: 20,
            center: { x: 10, y: 10 },
            angle: 90 * Math.PI / 180,
            rotationSpeed: 3 * Math.PI / 180,
            movementSpeed: 3,
            target: { x: 50, y: 50 },
        };
    }

    async start() {
        this.init();
    }

    async end() {
    }

    update(delta) {
        if (keys[KeyCode.Escape]) {
            fsm.transitionTo(StateKey.Loading);
            delete (keys[KeyCode.Escape]);
            return;
        }
        this.updateCamera(delta);
        this.updateBackground(delta);
        this.updatePlayer(delta);

    }

    draw(context) {
        context.save();
        context.translate(-this.camera.x + this.dragDelta.x, -this.camera.y + this.dragDelta.y);

        this.drawBackground(context);
        this.drawPlayer(context);

        context.restore();
    }

    onResize() {
        let canvasBounds = canvas.getBoundingClientRect();
        this.camera.center.x = canvasBounds.width / 2;
        this.camera.center.y = canvasBounds.height / 2;
    }
    onMouseMove(event) {
        if (this.isDragging) {
            this.dragDelta.x = event.clientX - this.startDrag.x;
            this.dragDelta.y = event.clientY - this.startDrag.y;
        }
    }

    onMouseDown(event) {
        if (this.isDragging) {
            return;
        }
        this.dragCompleted = false;
        if (event.button == 0) {
            this.isDragging = true;
        }

        this.startDrag.x = event.clientX;
        this.startDrag.y = event.clientY;
        this.dragDelta.x = 0;
        this.dragDelta.y = 0;
        this.startDrag.time = new Date().getUTCMilliseconds();
    }

    onMouseUp(event) {
        if (event.button == 2) { //startDrag.time + 100 >= new Date().getUTCMilliseconds()
            this.player.target.x = this.camera.x + this.startDrag.x;
            this.player.target.y = this.camera.y + this.startDrag.y;
            return;
        }

        if (this.isDragging) {
            this.isDragging = false;
            this.dragCompleted = true;
        }
    }

    onRightClick(event) {
        event.preventDefault();
    }

    onTouchStart(event) {
        if (event.touches.length == 2) {
            this.isDragging = true;
            this.startDrag.x = parseInt(event.targetTouches[0].clientX);
            this.startDrag.y = parseInt(event.targetTouches[0].clientY);
            this.dragDelta.x = 0;
            this.dragDelta.y = 0;
            this.startDrag.time = new Date().getUTCMilliseconds();
        }
    }

    onTouchMove(event) {
        if (event.touches.length == 2) {
            this.dragDelta.x = parseInt(event.targetTouches[0].clientX) - this.startDrag.x;
            this.dragDelta.y = parseInt(event.targetTouches[0].clientY) - this.startDrag.y;
        }

    }

    onTouchEnd(event) {
        if (this.isDragging) {
            this.isDragging = false;
            this.dragCompleted = true;
            return;
        }

        if (event.touches.length == 0) { //I've let go of all points
            if (!this.isDragging && !this.dragCompleted) {
                this.player.target.x = this.camera.x + parseInt(event.changedTouches[0].clientX);
                this.player.target.y = this.camera.y + parseInt(event.changedTouches[0].clientY);
            }
        }
    }

    updateCamera(delta) {
        if (keys[KeyCode.ArrowUp]) {
            this.camera.y += -this.camera.movementSpeed * delta;
        }

        if (keys[KeyCode.ArrowDown]) {
            this.camera.y += this.camera.movementSpeed * delta;
        }

        if (keys[KeyCode.ArrowLeft]) {
            this.camera.x += -this.camera.movementSpeed * delta;
        }

        if (keys[KeyCode.ArrowRight]) {
            this.camera.x += this.camera.movementSpeed * delta;
        }
    }

    updateBackground(delta) {
        let canvasBounds = canvas.getBoundingClientRect();
        let isOutOfBounds = false;
        if (this.camera.y < -1280) {
            this.camera.y = -1280;
        }

        if (this.camera.y + canvasBounds.height > 1280) {
            this.camera.y = 1280 - canvasBounds.height;
        }

        if (this.camera.x < -1280) {
            this.camera.x = -1280;
        }

        if (this.camera.x + canvasBounds.width > 1280) {
            this.camera.x = 1280 - canvasBounds.width;
        }

        if (this.camera.y - this.dragDelta.y < -1280) {
            isOutOfBounds = true;
        }

        if ((this.camera.y + canvasBounds.height) - this.dragDelta.y > 1280) {
            isOutOfBounds = true;
        }

        if (this.camera.x - this.dragDelta.x < -1280) {
            isOutOfBounds = true;
        }

        if ((this.camera.x + canvasBounds.width) - this.dragDelta.x > 1280) {
            isOutOfBounds = true;
        }

        if (this.dragCompleted) {
            if (isOutOfBounds) {
                this.camera.x -= this.dragDelta.x * 0.1;
                this.camera.y -= this.dragDelta.y * 0.1;
                this.dragDelta.x = this.dragDelta.x * 0.90;
                this.dragDelta.y = this.dragDelta.y * 0.90;
                if (Math.abs(this.dragDelta.x) <= 1 && Math.abs(this.dragDelta.y) <= 1) {
                    this.dragDelta.x = 0;
                    this.dragDelta.y = 0;
                    this.dragCompleted = false;
                }
            } else {
                this.camera.x -= this.dragDelta.x;
                this.camera.y -= this.dragDelta.y;
                this.dragDelta.x = 0;
                this.dragDelta.y = 0;
                this.dragCompleted = false;
            }
        }
    }

    drawBackground(context) {
        context.fillStyle = "#000000";
        context.strokeStyle = "limegreen";
        context.lineWidth = 3;
        for (let y = -10; y < 10; y++) {
            for (let x = -10; x < 10; x++) {
                context.beginPath();
                context.rect(x * 128, y * 128, 128, 128);
                context.fill();
                context.stroke();
            }
        }
    }

    updatePlayer(delta) {
        if (keys[KeyCode.KeyW]) {
            this.player.y += -this.player.movementSpeed * delta;
            this.player.target.y = this.player.y;
        }

        if (keys[KeyCode.KeyS]) {
            this.player.y += this.player.movementSpeed * delta;
            this.player.target.y = this.player.y;
        }

        if (keys[KeyCode.KeyA]) {
            this.player.x += -this.player.movementSpeed * delta;
            this.player.target.x = this.player.x;
        }

        if (keys[KeyCode.KeyD]) {
            this.player.x += this.player.movementSpeed * delta;
            this.player.target.x = this.player.x;
        }

        if (keys[KeyCode.KeyQ]) {
            this.player.angle -= this.player.rotationSpeed * delta;
        }

        if (keys[KeyCode.KeyE]) {
            this.player.angle += this.player.rotationSpeed * delta;
        }

        if (Math.abs(this.player.x - this.player.target.x) <= this.player.movementSpeed) {
            this.player.x = this.player.target.x;
        }

        if (Math.abs(this.player.y - this.player.target.y) <= this.player.movementSpeed) {
            this.player.y = this.player.target.y;
        }

        if (this.player.target.x != this.player.x || this.player.target.y != this.player.y) {
            let angle = (Math.atan2(this.player.target.y - this.player.y, this.player.target.x - this.player.x));
            this.player.x += this.player.movementSpeed * Math.cos(angle);
            this.player.y += this.player.movementSpeed * Math.sin(angle);


        }
    }
    drawPlayer(context) {
        context.save();
        context.fillStyle = "crimson";
        context.translate(this.player.x, this.player.y);
        context.rotate(this.player.angle);
        context.beginPath();
        context.rect(-this.player.center.x, -this.player.center.y, this.player.width, this.player.height);
        context.fill();
        context.restore();
    }

}
