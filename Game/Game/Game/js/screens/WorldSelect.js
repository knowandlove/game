// World Selection Screen
const WorldSelectScreen = {
    selectedWorld: 0,
    animationTime: 0,
    
    enter() {
        this.selectedWorld = 0;
        this.animationTime = 0;
        Debug.log('Entered World Select screen');
    },
    
    update(deltaTime) {
        this.animationTime += deltaTime;
        
        if (KeyboardInput.isActionPressed('LEFT')) {
            this.moveSelection(-1, 0);
            AudioManager.playSound('test-beep');
        }
        
        if (KeyboardInput.isActionPressed('RIGHT')) {
            this.moveSelection(1, 0);
            AudioManager.playSound('test-beep');
        }
        
        if (KeyboardInput.isActionPressed('UP')) {
            this.moveSelection(0, -1);
            AudioManager.playSound('test-beep');
        }
        
        if (KeyboardInput.isActionPressed('DOWN')) {
            this.moveSelection(0, 1);
            AudioManager.playSound('test-beep');
        }
        
        if (KeyboardInput.isActionPressed('SELECT')) {
            this.selectCurrentWorld();
        }
        
        KeyboardInput.update();
    },
    
    moveSelection(deltaCol, deltaRow) {
        const cols = GAME_CONSTANTS.WORLD_SELECTION.COLS;
        const rows = GAME_CONSTANTS.WORLD_SELECTION.ROWS;
        
        const currentRow = Math.floor(this.selectedWorld / cols);
        const currentCol = this.selectedWorld % cols;
        
        let newRow = currentRow + deltaRow;
        let newCol = currentCol + deltaCol;
        
        if (newCol < 0) newCol = cols - 1;
        if (newCol >= cols) newCol = 0;
        
        if (newRow < 0) newRow = rows - 1;
        if (newRow >= rows) newRow = 0;
        
        this.selectedWorld = newRow * cols + newCol;
        
        Debug.log(`Selected world: ${this.selectedWorld + 1}`);
    },
    
    selectCurrentWorld() {
        const worldNumber = this.selectedWorld + 1;
        Debug.log(`Selecting World ${worldNumber}!`);
        AudioManager.playSound('test-beep');
        
        window.game?.stateManager?.changeState(GAME_CONSTANTS.STATES.WORLD_MAP, worldNumber);
    },
    
    render(ctx) {
        const config = GAME_CONSTANTS.WORLD_SELECTION;
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;
        
        ctx.fillStyle = GAME_CONSTANTS.COLORS.SKY_BLUE;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        ctx.fillStyle = GAME_CONSTANTS.COLORS.UI_BLACK;
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Personality Islands Adventure', canvasWidth / 2, 100);
        
        ctx.font = '20px Arial';
        ctx.fillText('Choose Your Island!', canvasWidth / 2, 140);
        
        const testPlayer = AssetLoader.getImage('test-player');
        if (testPlayer) {
            ctx.drawImage(testPlayer, 50, 160, 48, 48);
            ctx.font = '14px Arial';
            ctx.textAlign = 'left';
            ctx.fillText('✓ Sprites loaded', 105, 185);
        }
        
        ctx.textAlign = 'center';
        ctx.font = '16px Arial';
        ctx.fillText('Use arrow keys to navigate, Enter to select', canvasWidth / 2, canvasHeight - 80);
        
        this.renderWorldButtons(ctx, config, canvasWidth, canvasHeight);
        
        ctx.fillStyle = GAME_CONSTANTS.COLORS.UI_BLACK;
        ctx.font = '16px Arial';
        ctx.fillText('✓ Phase 4.5 - Refactored Architecture Active!', canvasWidth / 2, canvasHeight - 50);
    },
    
    renderWorldButtons(ctx, config, canvasWidth, canvasHeight) {
        const startX = (canvasWidth - (config.COLS * config.BUTTON_SPACING - 30)) / 2;
        const startY = 220;
        const worldIcon = AssetLoader.getImage('world-icon');
        
        for (let row = 0; row < config.ROWS; row++) {
            for (let col = 0; col < config.COLS; col++) {
                const worldIndex = row * config.COLS + col;
                const worldNum = worldIndex + 1;
                const x = startX + col * config.BUTTON_SPACING;
                const y = startY + row * 120;
                
                const isSelected = (worldIndex === this.selectedWorld);
                
                // Always draw the world button background
                ctx.fillStyle = GAME_CONSTANTS.COLORS.GRASS_GREEN;
                ctx.fillRect(x, y, config.BUTTON_WIDTH, config.BUTTON_HEIGHT);
                
                // Always draw the button border
                ctx.strokeStyle = isSelected ? config.HIGHLIGHT_COLOR : GAME_CONSTANTS.COLORS.UI_BLACK;
                ctx.lineWidth = isSelected ? 3 : 2;
                ctx.strokeRect(x, y, config.BUTTON_WIDTH, config.BUTTON_HEIGHT);
                
                // Always draw the world icon
                if (worldIcon) {
                    const iconSize = isSelected ? 68 : 64;
                    const iconOffset = (64 - iconSize) / 2;
                    ctx.drawImage(worldIcon, x + 18 + iconOffset, y + 8 + iconOffset, iconSize, iconSize);
                }
                
                // Always draw the world number
                ctx.fillStyle = GAME_CONSTANTS.COLORS.UI_WHITE;
                ctx.font = isSelected ? 'bold 18px Arial' : '16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`${worldNum}`, x + config.BUTTON_WIDTH/2, y + config.BUTTON_HEIGHT - 8);
                
                // Selection highlight (drawn on top)
                if (isSelected) {
                    const pulseScale = 1.0 + Math.sin(this.animationTime * GAME_CONSTANTS.WORLD_SELECTION.ANIMATION_SPEED) * 0.05;
                    const highlightSize = 8;
                    
                    // Draw golden highlight border around selected button
                    ctx.strokeStyle = config.HIGHLIGHT_COLOR;
                    ctx.lineWidth = 4;
                    ctx.strokeRect(
                        x - highlightSize, 
                        y - highlightSize, 
                        config.BUTTON_WIDTH + highlightSize * 2, 
                        config.BUTTON_HEIGHT + highlightSize * 2
                    );
                    
                    // Optional: subtle glow effect
                    ctx.shadowColor = config.HIGHLIGHT_COLOR;
                    ctx.shadowBlur = 10;
                    ctx.strokeRect(x, y, config.BUTTON_WIDTH, config.BUTTON_HEIGHT);
                    ctx.shadowBlur = 0;
                }
            }
        }
        
        ctx.textAlign = 'center';
    },
    
    exit() {
        Debug.log('Exited World Select screen');
    }
};

window.WorldSelectScreen = WorldSelectScreen;