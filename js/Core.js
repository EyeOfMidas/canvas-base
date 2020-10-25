import { FiniteStateMachine } from './FSM.js';
import { LoadingState } from './states/LoadingState.js';
import { GameState } from './states/GameState.js';
export var canvas;
var context;
var lastTime;
var updateIntervalId;


export const StateKey = {
    Loading: 1,
    Game: 2,
};

export var fsm = new FiniteStateMachine();
fsm.addState(StateKey.Loading, new LoadingState());
fsm.addState(StateKey.Game, new GameState());
fsm.transitionTo(StateKey.Loading);

function animate() {
    clearFrame(context);
    fsm.drawCurrentState(context);
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

function getPixelRatio(context) {
    let dpr = window.devicePixelRatio || 1;
    let bsr = context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1;

    return dpr / bsr;
}

function onResize() {
    let ratio = getPixelRatio(context);
    let canvasBounds = canvas.getBoundingClientRect();
    canvas.width = canvasBounds.width * ratio;
    canvas.height = canvasBounds.height * ratio;
    context.scale(ratio, ratio);

    fsm.onResize();
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
window.addEventListener("mousedown", fsm.onMouseDown);
window.addEventListener("mousemove", fsm.onMouseMove);
window.addEventListener("mouseup", fsm.onMouseUp);
window.addEventListener("contextmenu", fsm.onRightClick);

window.addEventListener("touchstart", fsm.onTouchStart);
window.addEventListener("touchmove", fsm.onTouchMove);
window.addEventListener("touchend", fsm.onTouchEnd);
