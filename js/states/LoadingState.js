import { canvas, fsm, StateKey } from '../Core.js';
export class LoadingState {
    constructor() { }
    async start() {
        await new Promise(resolve => setTimeout(resolve, 5000));
        fsm.transitionTo(StateKey.Game);
    }
    async end() { }
    update(delta) { }
    draw(context) {
        context.fillStyle = "black";
        context.beginPath();
        context.rect(0, 0, canvas.width, canvas.height);
        context.fill();

        context.fillStyle = "white";
        context.font = "48px Ariel";
        context.textAlign = "center";
        context.fillText("Loading...", canvas.width / 2, canvas.height / 2);
    }
}
