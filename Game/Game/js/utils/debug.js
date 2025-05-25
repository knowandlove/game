// Debug Utilities
const Debug = {
    enabled: GAME_CONFIG.DEBUG_MODE,
    fps: 0,
    frameCount: 0,
    lastTime: performance.now(),
    
    log: function(message, ...args) {
        if (this.enabled) {
            console.log(`[GAME] ${message}`, ...args);
        }
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
            debugElement.innerHTML = `FPS: ${this.fps}`;
        }
    }
};

// Make Debug available globally
window.Debug = Debug;