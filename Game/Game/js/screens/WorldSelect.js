// World Selection Screen
const WorldSelectScreen = {
    selectedWorld: 0, // 0-7 for the 8 worlds
    animationTime: 0,
    
    enter() {
        this.selectedWorld = 0; // Start with world 1 selected
        this.animationTime = 0;
        Debug.log('Entered World Select screen');
    },
    
    update(deltaTime) {
        this.animationTime += deltaTime;
        
        // Handle input
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
        
        // Update keyboard input system
        KeyboardInput.update();
    },
    
    moveSelection(deltaCol, deltaRow) {
        const cols = GAME_CONFIG.WORLD_SELECTION.COLS;
        const rows = GAME_CONFIG.WORLD_SELECTION.ROWS;
        
        // Convert current selection to row/col
        const currentRow = Math.floor(this.selectedWorld / cols);
        const currentCol = this.selectedWorld % cols;
        
        // Calculate new position
        let newRow = currentRow + deltaRow;
        let newCol = currentCol + deltaCol;
        
        // Wrap around horizontally
        if (newCol < 0) newCol = cols - 1;
        if (newCol >= cols) newCol = 0;
        
        // Wrap around vertically
        if (newRow < 0) newRow = rows - 1;
        if (newRow >= rows) newRow = 0;
        
        // Convert back to world index
        this.selectedWorld = newRow * cols + newCol;
        
        Debug.log(`Selected world: ${this.selectedWorld + 1}`);
    },
    
    selectCurrentWorld() {
        const worldNumber = this.selectedWorld + 1;
        Debug.log(`Selecting World ${worldNumber}!`);
        AudioManager.playSound('test-beep');
        
        // Transition to world map
        window.game?.stateManager?.changeState(GAME_CONFIG.STATES.WORLD_MAP, worldNumber);
    },
    
    render(ctx) {
        const config = GAME_CONFIG.WORLD_SELECTION;
        
        // Sky background
        ctx.fillStyle = GAME_CONFIG.COLORS.SKY_BLUE;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Title
        ctx.fillStyle = GAME_CONFIG.COLORS.UI_BLACK;
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Personality Islands Adventure', ctx.canvas.width / 2, 100);
        
        // Subtitle
        ctx.font = '20px Arial';
        ctx.fillText('Choose Your Island!', ctx.canvas.width / 2, 140);
        
        // Test loaded image
        const testPlayer = AssetLoader.getImage('test-player');
        if (testPlayer) {
            ctx.drawImage(testPlayer, 50, 160, 48, 48);
            ctx.font = '14px Arial';
            ctx.textAlign = 'left';
            ctx.fillText('✓ Sprites loaded', 105, 185);
        }
        
        // Instructions
        ctx.textAlign = 'center';
        ctx.font = '16px Arial';
        ctx.fillText('Use arrow keys to navigate, Enter to select', ctx.canvas.width / 2, ctx.canvas.height - 80);
        
        // World buttons
        this.renderWorldButtons(ctx, config);
        
        // Success message
        ctx.fillStyle = GAME_CONFIG.COLORS.UI_BLACK;
        ctx.font = '16px Arial';
        ctx.fillText('✓ Phase 3 - Keyboard Navigation Active!', ctx.canvas.width / 2, ctx.canvas.height - 50);
    },
    
    renderWorldButtons(ctx, config) {
        const startX = (ctx.canvas.width - (config.COLS * config.BUTTON_SPACING - 30)) / 2;
        const startY = 220;
        const worldIcon = AssetLoader.getImage('world-icon');
        
        for (let row = 0; row < config.ROWS; row++) {
            for (let col = 0; col < config.COLS; col++) {
                const worldIndex = row * config.COLS + col;
                const worldNum = worldIndex + 1;
                const x = startX + col * config.BUTTON_SPACING;
                const y = startY + row * 120;
                
                const isSelected = (worldIndex === this.selectedWorld);
                
                // Selection highlight
                if (isSelected) {
                    const pulseScale = 1.0 + Math.sin(this.animationTime * 0.008) * 0.05;
                    const highlightSize = 8;
                    
                    ctx.fillStyle = config.HIGHLIGHT_COLOR;
                    ctx.fillRect(
                        x - highlightSize, 
                        y - highlightSize, 
                        config.BUTTON_WIDTH + highlightSize * 2, 
                        config.BUTTON_HEIGHT + highlightSize * 2
                    );
                    
                    // Slight scale effect for selected button
                    ctx.save();
                    ctx.translate(x + config.BUTTON_WIDTH/2, y + config.BUTTON_HEIGHT/2);
                    ctx.scale(pulseScale, pulseScale);
                    ctx.translate(-config.BUTTON_WIDTH/2, -config.BUTTON_HEIGHT/2);
                }
                
                // World button background
                ctx.fillStyle = GAME_CONFIG.COLORS.GRASS_GREEN;
                ctx.fillRect(0, 0, config.BUTTON_WIDTH, config.BUTTON_HEIGHT);
                
                // Button border
                ctx.strokeStyle = isSelected ? config.HIGHLIGHT_COLOR : GAME_CONFIG.COLORS.UI_BLACK;
                ctx.lineWidth = isSelected ? 3 : 2;
                ctx.strokeRect(0, 0, config.BUTTON_WIDTH, config.BUTTON_HEIGHT);
                
                // Draw world icon
                if (worldIcon) {
                    const iconSize = isSelected ? 68 : 64;
                    const iconOffset = (64 - iconSize) / 2;
                    ctx.drawImage(worldIcon, 18 + iconOffset, 8 + iconOffset, iconSize, iconSize);
                }
                
                // World number
                ctx.fillStyle = GAME_CONFIG.COLORS.UI_WHITE;
                ctx.font = isSelected ? 'bold 18px Arial' : '16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`${worldNum}`, config.BUTTON_WIDTH/2, config.BUTTON_HEIGHT - 8);
                
                if (isSelected) {
                    ctx.restore();
                }
            }
        }
        
        // Reset text alignment
        ctx.textAlign = 'center';
    },
    
    exit() {
        Debug.log('Exited World Select screen');
    }
};

// Make WorldSelectScreen globally available
window.WorldSelectScreen = WorldSelectScreen;