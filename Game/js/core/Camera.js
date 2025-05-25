// Camera System - Smooth scrolling that follows the player
const Camera = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    
    // Camera settings
    followSpeed: 0.1,
    scrollBoundaryX: 300, // Start scrolling when player is this far from screen edge
    
    // Screen and world dimensions (set by initialization)
    screenWidth: 0,
    screenHeight: 0,
    worldWidth: 0,
    worldHeight: 0,
    
    initialize(screenWidth, screenHeight, worldWidth, worldHeight) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        
        Debug.log(`Camera initialized: Screen(${screenWidth}x${screenHeight}) World(${worldWidth}x${worldHeight})`);
    },
    
    update(playerX, playerY) {
        // Calculate target camera position based on player
        this.calculateTarget(playerX, playerY);
        
        // Smooth camera movement
        this.x += (this.targetX - this.x) * this.followSpeed;
        this.y += (this.targetY - this.y) * this.followSpeed;
        
        // Clamp camera to world boundaries
        this.clampToWorld();
    },
    
    calculateTarget(playerX, playerY) {
        // Horizontal targeting with scroll boundaries
        const playerScreenX = playerX - this.x;
        
        if (playerScreenX > this.screenWidth - this.scrollBoundaryX) {
            // Player too far right, camera should move right
            this.targetX = playerX - (this.screenWidth - this.scrollBoundaryX);
        } else if (playerScreenX < this.scrollBoundaryX) {
            // Player too far left, camera should move left
            this.targetX = playerX - this.scrollBoundaryX;
        }
        
        // Vertical targeting (optional - keep player centered vertically)
        this.targetY = playerY - this.screenHeight / 2;
    },
    
    clampToWorld() {
        // Don't scroll past world boundaries
        if (this.x < 0) {
            this.x = 0;
            this.targetX = 0;
        }
        
        if (this.x > this.worldWidth - this.screenWidth) {
            this.x = this.worldWidth - this.screenWidth;
            this.targetX = this.x;
        }
        
        if (this.y < 0) {
            this.y = 0;
            this.targetY = 0;
        }
        
        if (this.y > this.worldHeight - this.screenHeight) {
            this.y = this.worldHeight - this.screenHeight;
            this.targetY = this.y;
        }
    },
    
    // Convert world coordinates to screen coordinates
    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    },
    
    // Convert screen coordinates to world coordinates
    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.x,
            y: screenY + this.y
        };
    },
    
    // Check if a world position is visible on screen
    isVisible(worldX, worldY, width = 0, height = 0) {
        const screenPos = this.worldToScreen(worldX, worldY);
        return screenPos.x + width >= 0 && 
               screenPos.x <= this.screenWidth && 
               screenPos.y + height >= 0 && 
               screenPos.y <= this.screenHeight;
    },
    
    // Instantly snap camera to target (for teleports, level start, etc)
    snapTo(targetX, targetY) {
        this.x = targetX;
        this.y = targetY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.clampToWorld();
    },
    
    // Smooth transition to a specific point
    moveTo(targetX, targetY, speed = null) {
        this.targetX = targetX;
        this.targetY = targetY;
        if (speed) {
            this.followSpeed = speed;
        }
    }
};

// Make Camera globally available
window.Camera = Camera;