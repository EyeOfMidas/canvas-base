import { FiniteStateMachine } from './FSM.js';
import { GameState } from './states/GameState.js';

export var canvas;
var context;
var lastTime;
var updateIntervalId;

export var fsm = new FiniteStateMachine();
export const StateKey = {
    Game: 1,
};
fsm.addState(StateKey.Game, new GameState());
fsm.setState(StateKey.Game);

function animate() {
    context.save();
    context.translate(0.5, 0.5);
    clearFrame(context);
    fsm.drawCurrentState(context);
    context.restore();
    requestAnimationFrame(animate);
}

function clearFrame(context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function init() {
    lastTime = new Date().getUTCMilliseconds();
    context = canvas.getContext('2d');

    onResize();
}

function tick(delta) {
    fsm.updateCurrentState(delta);
}

function onResize() {
    let dpi = window.devicePixelRatio;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    context.width = canvas.clientWidth / dpi;
    context.height = canvas.clientHeight / dpi;

    fsm.onResize();
}
function onMouseMove(event) {
    fsm.onMouseMove(event);
}

function onMouseDown(event) {
    fsm.onMouseDown(event);
}

function onMouseUp(event) {
    fsm.onMouseUp(event);
}

function onRightClick(event) {
    fsm.onRightClick(event);
}

function onTouchStart(event) {
    fsm.onTouchStart(event);
}

function onTouchMove(event) {
    fsm.onTouchMove(event);
}

function onTouchEnd(event) {
    fsm.onTouchEnd(event);
}

document.addEventListener("DOMContentLoaded", event => {
    canvas = document.createElement("canvas");
    document.getElementById("game").appendChild(canvas);
    init();
    animate();

    updateIntervalId = setInterval(() => {
        let currentTime = new Date().getUTCMilliseconds();
        tick(1 + ((currentTime - lastTime) / 1000));
        lastTime = currentTime;
    }, 16);
});

window.addEventListener("resize", onResize);
window.addEventListener("mousedown", onMouseDown);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("mouseup", onMouseUp);
window.addEventListener("contextmenu", onRightClick);

window.addEventListener("touchstart", onTouchStart);
window.addEventListener("touchmove", onTouchMove);
window.addEventListener("touchend", onTouchEnd);
