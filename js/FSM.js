import { Logger } from "./Logger.js";
/*
Each State should adhere to this interface:

export class ExampleState {
    constructor() { }
    async start() { }
    async end() { }
    update(delta) { }
    draw(context) { }
}

*/
export class FiniteStateMachine {
    constructor() {
        this.states = {};
        this.currentState = null;
    }

    addState(key, state) {
        this.states[key] = state;
    }

    setState(key) {
        this.currentState = key;
    }

    async transitionTo(key) {
        let lastState = this.getCurrentState();
        this.currentState = key;
        if (lastState) {
            await lastState.end(this.getCurrentState());
        }
        await this.getCurrentState().start(lastState);
    }

    updateCurrentState(delta) {
        this.getCurrentState().update(delta);
    }

    drawCurrentState(context) {
        this.getCurrentState().draw(context);
    }

    getCurrentState() {
        return this.states[this.currentState];
    }

    currentStateHas(functionName) {
        return typeof this.getCurrentState()[functionName] == 'function';
    }

    onResize = () => {
        if (!this.currentStateHas('onResize')) {
            Logger.warn("no handler for onResize", this.currentState);
            return;
        }
        this.getCurrentState().onResize();
    }
    onMouseMove = (event) => {
        if (!this.currentStateHas('onMouseMove')) {
            Logger.warn("no handler for onMouseMove", this.currentState);
            return;
        }
        this.getCurrentState().onMouseMove(event);
    }
    onMouseDown = (event) => {
        if (!this.currentStateHas('onMouseDown')) {
            Logger.warn("no handler for onMouseDown", this.currentState);
            return;
        }
        this.getCurrentState().onMouseDown(event);
    }
    onMouseUp = (event) => {
        if (!this.currentStateHas('onMouseUp')) {
            Logger.warn("no handler for onMouseUp", this.currentState);
            return;
        }
        this.getCurrentState().onMouseUp(event);
    }
    onRightClick = (event) => {
        if (!this.currentStateHas('onRightClick')) {
            Logger.warn("no handler for onRightClick", this.currentState);
            return;
        }
        this.getCurrentState().onRightClick(event);
    }
    onTouchStart = (event) => {
        if (!this.currentStateHas('onTouchStart')) {
            Logger.warn("no handler for onTouchStart", this.currentState);
            return;
        }
        this.getCurrentState().onTouchStart(event);
    }
    onTouchMove = (event) => {
        if (!this.currentStateHas('onTouchMove')) {
            Logger.warn("no handler for onTouchMove", this.currentState);
            return;
        }
        this.getCurrentState().onTouchMove(event);
    }
    onTouchEnd = (event) => {
        if (!this.currentStateHas('onTouchEnd')) {
            Logger.warn("no handler for onTouchEnd", this.currentState);
            return;
        }
        this.getCurrentState().onTouchEnd(event);
    }
}
