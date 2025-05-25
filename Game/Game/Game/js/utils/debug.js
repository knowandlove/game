// Debug Utilities - Now uses centralized constants
const Debug = {
    enabled: GAME_CONSTANTS.DEBUG_MODE,
    fps: 0,
    frameCount: 0,
    lastTime: performance.now(),
    
    log: function(message, ...args) {
        if (this.enabled) {
            console.log(`[GAME] ${message}`, ...args);
        }
    },
    
    warn: function(message, ...args) {
        if (this.enabled) {
            console.warn(`[GAME WARNING] ${message}`, ...args);
        }
    },
    
    error: function(message, ...args) {
        // Always show errors
        console.error(`[GAME ERROR] ${message}`, ...args);
    },
    
    updateFPS: function(currentTime) {
        if (!this.enabled) return;
        this.frameCount++;
        const elapsed = currentTime - this.lastTime;
        if (elapsed >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / elapsed);
            this.frameCount = 0;
            this.lastTime = currentTime;
            this.updateDisplay();
        }
    },
    
    updateDisplay: function() {
        if (!this.enabled) return;
        const debugElement = document.getElementById('debug-info');
        if (debugElement) {
            debugElement.innerHTML = `
                FPS: ${this.fps}<br>
                Target: ${GAME_CONSTANTS.TARGET_FPS}<br>
                Canvas: ${GAME_CONSTANTS.CANVAS_WIDTH}x${GAME_CONSTANTS.CANVAS_HEIGHT}
            `;
        }
    }
};

// Make Debug available globally
window.Debug = Debug;