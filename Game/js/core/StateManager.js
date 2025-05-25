// State Manager - Handles transitions between game screens
class StateManager {
    constructor() {
        this.currentState = GAME_CONFIG.STATES.LOADING;
        this.states = new Map();
        Debug.log('StateManager initialized');
    }
    
    registerState(stateName, stateHandler) {
        this.states.set(stateName, stateHandler);
        Debug.log(`State registered: ${stateName}`);
    }
    
    changeState(newState) {
        Debug.log(`State change: ${this.currentState} -> ${newState}`);
        this.currentState = newState;
    }
    
    update(deltaTime) {
        const state = this.states.get(this.currentState);
        if (state && state.update) {
            state.update(deltaTime);
        }
    }
    
    render(ctx) {
        const state = this.states.get(this.currentState);
        if (state && state.render) {
            state.render(ctx);
        }
    }
}