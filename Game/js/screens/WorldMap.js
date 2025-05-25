// World Map Screen - Individual world with level navigation
const WorldMapScreen = {
    currentWorld: 1,
    selectedLevel: 0,
    playerPosition: { x: 0, y: 0 },
    targetPosition: { x: 0, y: 0 },
    animationTime: 0,
    isMoving: false,
    movementSpeed: GAME_CONSTANTS.WORLD_MAP.PLAYER_MOVE_SPEED,
    canvasWidth: 0,
    canvasHeight: 0,
    
    // Initialize with canvas dimensions - called by GameCore
    initialize(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        Debug.log(`WorldMapScreen initialized with dimensions: ${canvasWidth}x${canvasHeight}`);
    },
    
    enter(worldNumber) {
        this.currentWorld = worldNumber || 1;
        this.selectedLevel = 0;
        this.animationTime = 0;
        this.isMoving = false;
        
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
        
        if (this.isMoving) {
            this.updatePlayerMovement(deltaTime);
        }
        
        KeyboardInput.update();
    },
    
    moveToLevel(newLevelIndex) {
        const worldData = WORLDS_DATA[this.currentWorld];
        if (!worldData) return;
        
        newLevelIndex = Math.max(0, Math.min(worldData.levels.length - 1, newLevelIndex));
        
        if (newLevelIndex === this.selectedLevel) return;
        
        const targetLevel = worldData.levels[newLevelIndex];
        if (!targetLevel.unlocked && Math.abs(newLevelIndex - this.selectedLevel) > 1) {
            AudioManager.playSound('test-beep');
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
            this.playerPosition.x = this.targetPosition.x;
            this.playerPosition.y = this.targetPosition.y;
            this.isMoving = false;
        } else {
            const moveDistance = this.movementSpeed * (deltaTime / 16);
            this.playerPosition.x += (dx / distance) * moveDistance;
            this.playerPosition.y += (dy / distance) * moveDistance;
        }
    },
    
    selectCurrentLevel() {
        const worldData = WORLDS_DATA[this.currentWorld];
        const selectedLevelData = worldData.levels[this.selectedLevel];
        
        if (!selectedLevelData.unlocked) {
            AudioManager.playSound('test-beep');
            Debug.log(`Level ${this.selectedLevel + 1} is locked!`);
            return;
        }
        
        Debug.log(`Entering level: ${selectedLevelData.name}`);
        AudioManager.playSound('test-beep');
        
        alert(`Entering ${selectedLevelData.name}! (Level gameplay coming in Phase 5)`);
    },
    
    exitToWorldSelect() {
        Debug.log('Returning to World Select');
        AudioManager.playSound('test-beep');
        window.game?.stateManager?.changeState(GAME_CONSTANTS.STATES.WORLD_SELECT);
    },
    
    render(ctx) {
        const worldData = WORLDS_DATA[this.currentWorld];
        if (!worldData) return;
        
        ctx.fillStyle = worldData.backgroundColor;
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        ctx.fillStyle = GAME_CONSTANTS.COLORS.UI_WHITE;
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(worldData.name, this.canvasWidth / 2, 50);
        
        this.renderPaths(ctx, worldData);
        this.renderLevels(ctx, worldData);
        this.renderPlayer(ctx);
        
        ctx.fillStyle = GAME_CONSTANTS.COLORS.UI_WHITE;
        ctx.font = '16px Arial';
        ctx.fillText('← → Navigate levels | Enter: Select | Esc: Back to World Select', this.canvasWidth / 2, this.canvasHeight - 30);
        
        ctx.font = '14px Arial';
        ctx.fillText(`✓ Phase 4.5 - Refactored Architecture! (World ${this.currentWorld})`, this.canvasWidth / 2, this.canvasHeight - 10);
    },
    
    renderPaths(ctx, worldData) {
        ctx.strokeStyle = worldData.color;
        ctx.lineWidth = GAME_CONSTANTS.WORLD_MAP.PATH_WIDTH;
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
            const dotSize = isSelected ? GAME_CONSTANTS.WORLD_MAP.LEVEL_DOT_SIZE_SELECTED : GAME_CONSTANTS.WORLD_MAP.LEVEL_DOT_SIZE;
            
            ctx.beginPath();
            ctx.arc(level.x, level.y, dotSize, 0, Math.PI * 2);
            
            if (isUnlocked) {
                ctx.fillStyle = isSelected ? worldData.color : GAME_CONSTANTS.COLORS.UI_WHITE;
            } else {
                ctx.fillStyle = GAME_CONSTANTS.COLORS.LOCKED_GRAY;
            }
            ctx.fill();
            
            ctx.strokeStyle = isSelected ? GAME_CONSTANTS.COLORS.UI_WHITE : worldData.color;
            ctx.lineWidth = isSelected ? 3 : 2;
            ctx.stroke();
            
            ctx.fillStyle = isUnlocked ? GAME_CONSTANTS.COLORS.UI_BLACK : GAME_CONSTANTS.COLORS.UI_WHITE;
            ctx.font = isSelected ? 'bold 16px Arial' : '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText((index + 1).toString(), level.x, level.y + 5);
            
            ctx.fillStyle = GAME_CONSTANTS.COLORS.UI_WHITE;
            ctx.font = isSelected ? 'bold 12px Arial' : '10px Arial';
            ctx.fillText(level.name, level.x, level.y + 45);
            
            if (!isUnlocked) {
                ctx.fillStyle = GAME_CONSTANTS.COLORS.ERROR_RED;
                ctx.font = '20px Arial';
                ctx.fillText('🔒', level.x + 15, level.y - 15);
            }
        });
    },
    
    renderPlayer(ctx) {
        const testPlayer = AssetLoader.getImage('test-player');
        const pulseScale = 1.0 + Math.sin(this.animationTime * GAME_CONSTANTS.WORLD_MAP.PULSE_SPEED) * GAME_CONSTANTS.WORLD_MAP.PULSE_AMOUNT;
        
        ctx.save();
        ctx.translate(this.playerPosition.x, this.playerPosition.y - GAME_CONSTANTS.WORLD_MAP.PLAYER_HOVER_HEIGHT);
        ctx.scale(pulseScale, pulseScale);
        
        if (testPlayer) {
            ctx.drawImage(testPlayer, -16, -16, 32, 32);
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, 16, 0, Math.PI * 2);
            ctx.fillStyle = GAME_CONSTANTS.COLORS.PLAYER_BLUE;
            ctx.fill();
        }
        
        ctx.restore();
    },
    
    exit() {
        Debug.log(`Exited World Map for World ${this.currentWorld}`);
    }
};

window.WorldMapScreen = WorldMapScreen;