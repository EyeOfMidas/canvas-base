// import { KeyCode } from './KeyCode.js';
export var keys = {};

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
function onKeyDown(event) {
    keys[event.code] = true;
}

function onKeyUp(event) {
    delete keys[event.code];
}
