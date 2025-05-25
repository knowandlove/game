// World Map Screen - Individual world with level navigation
const WorldMapScreen = {
    currentWorld: 1,
    selectedLevel: 0, // Currently selected level (0-3)
    playerPosition: { x: 0, y: 0 },
    animationTime: 0,
    isMoving: false,
    movementSpeed: 2,
    
    enter(worldNumber) {
        this.currentWorld = worldNumber || 1;
        this.selectedLevel = 0; // Start at first level
        this.animationTime = 0;
        this.isMoving = false;
        
        // Set player position to first level
        const worldData = WORLDS_DATA[this.currentWorld];
        if (worldData && worldData.levels[0]) {
            this.playerPosition.x = worldData.levels[0].x;
            this.playerPosition.y = worldData.levels[0].y;
        }
        
        Debug.log(`Entered World Map for World ${this.currentWorld}: ${worldData?.name}`);
    },
    
    update(deltaTime) {
        this.animationTime += deltaTime;
        
        const worldData = WORLDS_DATA[this.currentWorld];
        if (!worldData) return;
        
        // Handle input only if not moving
        if (!this.isMoving) {
            if (KeyboardInput.isActionPressed('LEFT')) {
                this.moveToLevel(this.selectedLevel - 1);
            }
            
            if (KeyboardInput.isActionPressed('RIGHT')) {
                this.moveToLevel(this.selectedLevel + 1);
            }
            
            if (KeyboardInput.isActionPressed('SELECT')) {
                this.selectCurrentLevel();
            }
            
            if (KeyboardInput.isActionPressed('BACK')) {
                this.exitToWorldSelect();
            }
        }
        
        // Update player movement
        if (this.isMoving) {
            this.updatePlayerMovement(deltaTime);
        }
        
        KeyboardInput.update();
    },
    
    moveToLevel(newLevelIndex) {
        const worldData = WORLDS_DATA[this.currentWorld];
        if (!worldData) return;
        
        // Clamp to valid range
        newLevelIndex = Math.max(0, Math.min(worldData.levels.length - 1, newLevelIndex));
        
        if (newLevelIndex === this.selectedLevel) return;
        
        // Check if the target level is unlocked or adjacent to current
        const targetLevel = worldData.levels[newLevelIndex];
        if (!targetLevel.unlocked && Math.abs(newLevelIndex - this.selectedLevel) > 1) {
            AudioManager.playSound('test-beep'); // Error sound
            return;
        }
        
        this.selectedLevel = newLevelIndex;
        this.startMovementToLevel();
        AudioManager.playSound('test-beep');
        Debug.log(`Moving to level ${newLevelIndex + 1}: ${targetLevel.name}`);
    },
    
    startMovementToLevel() {
        const worldData = WORLDS_DATA[this.currentWorld];
        const targetLevel = worldData.levels[this.selectedLevel];
        
        this.targetPosition = { x: targetLevel.x, y: targetLevel.y };
        this.isMoving = true;
    },
    
    updatePlayerMovement(deltaTime) {
        const dx = this.targetPosition.x - this.playerPosition.x;
        const dy = this.targetPosition.y - this.playerPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 3) {
            // Arrived at destination
            this.playerPosition.x = this.targetPosition.x;
            this.playerPosition.y = this.targetPosition.y;
            this.isMoving = false;
        } else {
            // Move towards target
            const moveDistance = this.movementSpeed * (deltaTime / 16); // Normalize for 60fps
            this.playerPosition.x += (dx / distance) * moveDistance;
            this.playerPosition.y += (dy / distance) * moveDistance;
        }
    },
    
    selectCurrentLevel() {
        const worldData = WORLDS_DATA[this.currentWorld];
        const selectedLevelData = worldData.levels[this.selectedLevel];
        
        if (!selectedLevelData.unlocked) {
            AudioManager.playSound('test-beep'); // Error sound
            Debug.log(`Level ${this.selectedLevel + 1} is locked!`);
            return;
        }
        
        Debug.log(`Entering level: ${selectedLevelData.name}`);
        AudioManager.playSound('test-beep');
        
        // TODO: Transition to actual level gameplay
        alert(`Entering ${selectedLevelData.name}! (Level gameplay coming in Phase 5)`);
    },
    
    exitToWorldSelect() {
        Debug.log('Returning to World Select');
        AudioManager.playSound('test-beep');
        // TODO: Transition back to world select
        // For now, we'll need to implement this in the state manager
        window.game?.stateManager?.changeState(GAME_CONFIG.STATES.WORLD_SELECT);
    },
    
    render(ctx) {
        const worldData = WORLDS_DATA[this.currentWorld];
        if (!worldData) return;
        
        // Background
        ctx.fillStyle = worldData.backgroundColor;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Title
        ctx.fillStyle = GAME_CONFIG.COLORS.UI_WHITE;
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(worldData.name, ctx.canvas.width / 2, 50);
        
        // Render paths
        this.renderPaths(ctx, worldData);
        
        // Render levels
        this.renderLevels(ctx, worldData);
        
        // Render player
        this.renderPlayer(ctx);
        
        // Instructions
        ctx.fillStyle = GAME_CONFIG.COLORS.UI_WHITE;
        ctx.font = '16px Arial';
        ctx.fillText('← → Navigate levels | Enter: Select | Esc: Back to World Select', ctx.canvas.width / 2, ctx.canvas.height - 30);
        
        // Debug info
        ctx.font = '14px Arial';
        ctx.fillText(`✓ Phase 4 - World Map Active! (World ${this.currentWorld})`, ctx.canvas.width / 2, ctx.canvas.height - 10);
    },
    
    renderPaths(ctx, worldData) {
        ctx.strokeStyle = worldData.color;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        
        worldData.paths.forEach(path => {
            if (path.points && path.points.length > 1) {
                ctx.beginPath();
                ctx.moveTo(path.points[0].x, path.points[0].y);
                
                for (let i = 1; i < path.points.length; i++) {
                    ctx.lineTo(path.points[i].x, path.points[i].y);
                }
                
                ctx.stroke();
            }
        });
    },
    
    renderLevels(ctx, worldData) {
        worldData.levels.forEach((level, index) => {
            const isSelected = (index === this.selectedLevel);
            const isUnlocked = level.unlocked;
            
            // Level dot background
            ctx.beginPath();
            ctx.arc(level.x, level.y, isSelected ? 25 : 20, 0, Math.PI * 2);
            
            if (isUnlocked) {
                ctx.fillStyle = isSelected ? worldData.color : GAME_CONFIG.COLORS.UI_WHITE;
            } else {
                ctx.fillStyle = '#555555'; // Locked color
            }
            ctx.fill();
            
            // Level dot border
            ctx.strokeStyle = isSelected ? GAME_CONFIG.COLORS.UI_WHITE : worldData.color;
            ctx.lineWidth = isSelected ? 3 : 2;
            ctx.stroke();
            
            // Level number
            ctx.fillStyle = isUnlocked ? GAME_CONFIG.COLORS.UI_BLACK : GAME_CONFIG.COLORS.UI_WHITE;
            ctx.font = isSelected ? 'bold 16px Arial' : '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText((index + 1).toString(), level.x, level.y + 5);
            
            // Level name (below the dot)
            ctx.fillStyle = GAME_CONFIG.COLORS.UI_WHITE;
            ctx.font = isSelected ? 'bold 12px Arial' : '10px Arial';
            ctx.fillText(level.name, level.x, level.y + 45);
            
            // Lock indicator for locked levels
            if (!isUnlocked) {
                ctx.fillStyle = '#FF0000';
                ctx.font = '20px Arial';
                ctx.fillText('🔒', level.x + 15, level.y - 15);
            }
        });
    },
    
    renderPlayer(ctx) {
        const testPlayer = AssetLoader.getImage('test-player');
        const pulseScale = 1.0 + Math.sin(this.animationTime * 0.005) * 0.1;
        
        ctx.save();
        ctx.translate(this.playerPosition.x, this.playerPosition.y - 35);
        ctx.scale(pulseScale, pulseScale);
        
        if (testPlayer) {
            ctx.drawImage(testPlayer, -16, -16, 32, 32);
        } else {
            // Fallback circle player
            ctx.beginPath();
            ctx.arc(0, 0, 16, 0, Math.PI * 2);
            ctx.fillStyle = GAME_CONFIG.COLORS.PLAYER_BLUE || '#4169E1';
            ctx.fill();
        }
        
        ctx.restore();
    },
    
    exit() {
        Debug.log(`Exited World Map for World ${this.currentWorld}`);
    }
};

// Make WorldMapScreen globally available
window.WorldMapScreen = WorldMapScreen;