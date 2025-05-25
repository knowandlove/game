// Keyboard Input System
const KeyboardInput = {
    keys: new Map(),
    keysPressed: new Map(),
    keysReleased: new Map(),
    
    initialize() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        Debug.log('Keyboard input system initialized');
    },
    
    handleKeyDown(event) {
        const key = event.code;
        
        // Prevent default for game keys to avoid page scrolling
        if (this.isGameKey(key)) {
            event.preventDefault();
        }
        
        // Track if this is a new press (not held down)
        if (!this.keys.get(key)) {
            this.keysPressed.set(key, true);
        }
        
        this.keys.set(key, true);
        Debug.log(`Key pressed: ${key}`);
    },
    
    handleKeyUp(event) {
        const key = event.code;
        this.keys.set(key, false);
        this.keysReleased.set(key, true);
        Debug.log(`Key released: ${key}`);
    },
    
    // Check if a key is currently held down
    isKeyDown(key) {
        return this.keys.get(key) || false;
    },
    
    // Check if a key was just pressed this frame
    isKeyPressed(key) {
        return this.keysPressed.get(key) || false;
    },
    
    // Check if a key was just released this frame
    isKeyReleased(key) {
        return this.keysReleased.get(key) || false;
    },
    
    // Check if any of the keys for an action are pressed
    isActionPressed(actionName) {
        const keys = GAME_CONFIG.KEYS[actionName] || [];
        return keys.some(key => this.isKeyPressed(key));
    },
    
    // Check if any of the keys for an action are held down
    isActionDown(actionName) {
        const keys = GAME_CONFIG.KEYS[actionName] || [];
        return keys.some(key => this.isKeyDown(key));
    },
    
    // Clear the pressed/released states (call at end of frame)
    update() {
        this.keysPressed.clear();
        this.keysReleased.clear();
    },
    
    // Check if a key is used by the game (for preventing default browser behavior)
    isGameKey(key) {
        const gameKeys = Object.values(GAME_CONFIG.KEYS).flat();
        return gameKeys.includes(key);
    }
};

// Make KeyboardInput globally available
window.KeyboardInput = KeyboardInput;