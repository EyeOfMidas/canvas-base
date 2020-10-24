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
        this.currentState = this.states[key];
    }

    async transitionTo(key) {
        let lastState = this.currentState;
        this.currentState = this.states[key];
        if (lastState) {
            await lastState.end(this.currentState);
        }
        await this.currentState.start(lastState);
    }

    updateCurrentState(delta) {
        this.currentState.update(delta);
    }

    drawCurrentState(context) {
        this.currentState.draw(context);
    }

    onResize() {
        if (!this.currentState.hasOwnProperty('onResize')) return;
        this.currentState.onResize();
    }
    onMouseMove(event) {
        if (!this.currentState.hasOwnProperty('onMouseMove')) return;
        this.currentState.onMouseMove(event);
    }
    onMouseDown(event) {
        if (!this.currentState.hasOwnProperty('onMouseDown')) return;
        this.currentState.onMouseDown(event);
    }
    onMouseUp(event) {
        if (!this.currentState.hasOwnProperty('onMouseUp')) return;
        this.currentState.onMouseUp(event);
    }
    onRightClick(event) {
        if (!this.currentState.hasOwnProperty('onRightClick')) return;
        this.currentState.onRightClick(event);
    }
    onTouchStart(event) {
        if (!this.currentState.hasOwnProperty('onTouchStart')) return;
        this.currentState.onTouchStart(event);
    }
    onTouchMove(event) {
        if (!this.currentState.hasOwnProperty('onTouchMove')) return;
        this.currentState.onTouchMove(event);
    }
    onTouchEnd(event) {
        if (!this.currentState.hasOwnProperty('onTouchEnd')) return;
        this.currentState.onTouchEnd(event);
    }
}
