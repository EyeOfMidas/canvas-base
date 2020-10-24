import { KeyCode } from './KeyCode.js';
var canvas;
var context;
var lastTime;
var updateIntervalId;

var camera = { x: 0, y: 0, center: { x: 0, y: 0 }, movementSpeed: 3 };
var isDragging = false;
var dragCompleted = false;
var startDrag = { x: 0, y: 0 };
var dragDelta = { x: 0, y: 0 };
var keys = [];

var player = {
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

function animate() {
    context.save();
    context.translate(0.5, 0.5);
    clearFrame(context);
    draw(context);
    context.restore();
    requestAnimationFrame(animate);
}

function clearFrame(context) {
    context.fillStyle = "#000000";
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.fill();
}

function init() {
    lastTime = new Date().getUTCMilliseconds();
    context = canvas.getContext('2d');

    keys = [];
    for (let i = 0; i < 256; i++) {
        keys[i] = false;
    }

    onResize();
}

function update(delta) {
    updateCamera(delta);
    updateBackground(delta);
    updatePlayer(delta);

}

function draw(context) {
    context.save();
    context.translate(-camera.x + dragDelta.x, -camera.y + dragDelta.y);

    drawBackground(context);
    drawPlayer(context);

    context.restore();
}

function onResize() {
    let dpi = window.devicePixelRatio;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    context.width = canvas.clientWidth / dpi;
    context.height = canvas.clientHeight / dpi;

    camera.center.x = canvas.width / 2;
    camera.center.y = canvas.height / 2;
}

function onKeyDown(event) {
    keys[event.keyCode] = true;
}

function onKeyUp(event) {
    keys[event.keyCode] = false;
}

function onMouseMove(event) {
    if (isDragging) {
        dragDelta.x = event.clientX - startDrag.x;
        dragDelta.y = event.clientY - startDrag.y;
    }
}

function onMouseDown(event) {
    if (isDragging) {
        return;
    }
    dragCompleted = false;
    if (event.button == 0) {
        isDragging = true;
    }

    startDrag.x = event.clientX;
    startDrag.y = event.clientY;
    dragDelta.x = 0;
    dragDelta.y = 0;
    startDrag.time = new Date().getUTCMilliseconds();
}

function onMouseUp(event) {
    if (event.button == 2) { //startDrag.time + 100 >= new Date().getUTCMilliseconds()
        player.target.x = camera.x + startDrag.x;
        player.target.y = camera.y + startDrag.y;
        return;
    }

    if (isDragging) {
        isDragging = false;
        dragCompleted = true;
    }
}

function onRightClick(event) {
    event.preventDefault();
}

function onTouchStart(event) {
    if (event.touches.length == 2) {
        isDragging = true;
        startDrag.x = parseInt(event.targetTouches[0].clientX);
        startDrag.y = parseInt(event.targetTouches[0].clientY);
        dragDelta.x = 0;
        dragDelta.y = 0;
        startDrag.time = new Date().getUTCMilliseconds();
    }
}

function onTouchMove(event) {
    if (event.touches.length == 2) {
        dragDelta.x = parseInt(event.targetTouches[0].clientX) - startDrag.x;
        dragDelta.y = parseInt(event.targetTouches[0].clientY) - startDrag.y;
    }

}

function onTouchEnd(event) {
    if (isDragging) {
        isDragging = false;
        dragCompleted = true;
        return;
    }

    if (event.touches.length == 0) { //I've let go of all points
        if (!isDragging && !dragCompleted) {
            player.target.x = camera.x + parseInt(event.changedTouches[0].clientX);
            player.target.y = camera.y + parseInt(event.changedTouches[0].clientY);
        }
    }
}

document.addEventListener("DOMContentLoaded", event => {
    canvas = document.createElement("canvas");
    document.getElementById("game").appendChild(canvas);
    init();
    animate();

    updateIntervalId = setInterval(() => {
        let currentTime = new Date().getUTCMilliseconds();
        update(1 + ((currentTime - lastTime) / 1000));
        lastTime = currentTime;
    }, 16);
});

window.addEventListener("resize", onResize);
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.addEventListener("mousedown", onMouseDown);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("mouseup", onMouseUp);
window.addEventListener("contextmenu", onRightClick);

window.addEventListener("touchstart", onTouchStart);
window.addEventListener("touchmove", onTouchMove);
window.addEventListener("touchend", onTouchEnd);

function updateCamera(delta) {
    if (keys[KeyCode.Up]) {
        camera.y += -camera.movementSpeed * delta;
    }

    if (keys[KeyCode.Down]) {
        camera.y += camera.movementSpeed * delta;
    }

    if (keys[KeyCode.Left]) {
        camera.x += -camera.movementSpeed * delta;
    }

    if (keys[KeyCode.Right]) {
        camera.x += camera.movementSpeed * delta;
    }
}

function updateBackground(delta) {
    let isOutOfBounds = false;
    if (camera.y < -1280) {
        camera.y = -1280;
    }

    if (camera.y + canvas.height > 1280) {
        camera.y = 1280 - canvas.height;
    }

    if (camera.x < -1280) {
        camera.x = -1280;
    }

    if (camera.x + canvas.width > 1280) {
        camera.x = 1280 - canvas.width;
    }

    if (camera.y - dragDelta.y < -1280) {
        isOutOfBounds = true;
    }

    if ((camera.y + canvas.height) - dragDelta.y > 1280) {
        isOutOfBounds = true;
    }

    if (camera.x - dragDelta.x < -1280) {
        isOutOfBounds = true;
    }

    if ((camera.x + canvas.width) - dragDelta.x > 1280) {
        isOutOfBounds = true;
    }

    if (dragCompleted) {
        if (isOutOfBounds) {
            camera.x -= dragDelta.x * 0.1;
            camera.y -= dragDelta.y * 0.1;
            dragDelta.x = dragDelta.x * 0.90;
            dragDelta.y = dragDelta.y * 0.90;
            if (Math.abs(dragDelta.x) <= 1 && Math.abs(dragDelta.y) <= 1) {
                dragDelta.x = 0;
                dragDelta.y = 0;
                dragCompleted = false;
            }
        } else {
            camera.x -= dragDelta.x;
            camera.y -= dragDelta.y;
            dragDelta.x = 0;
            dragDelta.y = 0;
            dragCompleted = false;
        }
    }
}

function drawBackground(context) {
    context.strokeStyle = "limegreen";
    context.lineWidth = 3;
    for (let y = -10; y < 10; y++) {
        for (let x = -10; x < 10; x++) {
            context.beginPath();
            context.rect(x * 128, y * 128, 128, 128);
            context.stroke();
        }
    }
}

function updatePlayer(delta) {
    if (keys[KeyCode.W]) {
        player.y += -player.movementSpeed * delta;
        player.target.y = player.y;
    }

    if (keys[KeyCode.S]) {
        player.y += player.movementSpeed * delta;
        player.target.y = player.y;
    }

    if (keys[KeyCode.A]) {
        player.x += -player.movementSpeed * delta;
        player.target.x = player.x;
    }

    if (keys[KeyCode.D]) {
        player.x += player.movementSpeed * delta;
        player.target.x = player.x;
    }

    if (keys[KeyCode.Q]) {
        player.angle -= player.rotationSpeed * delta;
    }

    if (keys[KeyCode.E]) {
        player.angle += player.rotationSpeed * delta;
    }

    if (Math.abs(player.x - player.target.x) <= player.movementSpeed) {
        player.x = player.target.x;
    }

    if (Math.abs(player.y - player.target.y) <= player.movementSpeed) {
        player.y = player.target.y;
    }

    if (player.target.x != player.x || player.target.y != player.y) {
        let angle = (Math.atan2(player.target.y - player.y, player.target.x - player.x));
        player.x += player.movementSpeed * Math.cos(angle);
        player.y += player.movementSpeed * Math.sin(angle);


    }
}
function drawPlayer(context) {
    context.save();
    context.fillStyle = "crimson";
    context.translate(player.x, player.y);
    context.rotate(player.angle);
    context.beginPath();
    context.rect(-player.center.x, -player.center.y, player.width, player.height);
    context.fill();
    context.restore();
}
