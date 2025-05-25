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
    
    changeState(newState, data = null) {
        if (!this.states.has(newState)) {
            Debug.log(`Attempted to change to unregistered state: ${newState}`);
            return false;
        }

        // Exit current state
        if (this.states.has(this.currentState)) {
            const currentStateHandler = this.states.get(this.currentState);
            if (currentStateHandler.exit) {
                currentStateHandler.exit();
            }
        }

        Debug.log(`State change: ${this.currentState} -> ${newState}`);
        const previousState = this.currentState;
        this.currentState = newState;

        // Enter new state with optional data
        const newStateHandler = this.states.get(newState);
        if (newStateHandler.enter) {
            newStateHandler.enter(data);
        }

        return true;
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