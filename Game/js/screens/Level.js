// Level Screen - Side-scrolling level gameplay
const LevelScreen = {
    currentWorld: 1,
    currentLevel: 1,
    
    // Game entities
    player: null,
    enemies: [],
    collectibles: [],
    platforms: [],
    
    // Level properties
    groundY: 0,
    levelWidth: GAME_CONSTANTS.WORLD_WIDTH,
    levelHeight: GAME_CONSTANTS.CANVAS_HEIGHT,
    
    // Game state
    levelComplete: false,
    paused: false,
    
    initialize(canvasWidth, canvasHeight) {
        this.levelHeight = canvasHeight;
        this.groundY = canvasHeight - 100; // Ground level
        
        // Initialize camera
        Camera.initialize(canvasWidth, canvasHeight, this.levelWidth, this.levelHeight);
        
        Debug.log(`LevelScreen initialized: ${canvasWidth}x${canvasHeight}`);
    },
    
    enter(data) {
        // data should contain { world: number, level: number }
        this.currentWorld = data?.world || 1;
        this.currentLevel = data?.level || 1;
        
        Debug.log(`Entering Level ${this.currentLevel} of World ${this.currentWorld}`);
        
        // Initialize level
        this.setupLevel();
        this.resetGameState();
        
        // Start camera at player position
        Camera.snapTo(this.player.x - 200, 0);
    },
    
    setupLevel() {
        // Initialize player
        this.player = {
            x: 100,
            y: this.groundY - 32,
            width: 32,
            height: 32,
            velocityX: 0,
            velocityY: 0,
            onGround: false,
            speed: 5,
            jumpPower: GAME_CONSTANTS.JUMP_POWER,
            health: 100,
            facingRight: true
        };
        
        // Create some basic platforms
        this.platforms = [
            { x: 300, y: this.groundY - 150, width: 200, height: 20, color: '#8B4513' },
            { x: 600, y: this.groundY - 100, width: 150, height: 20, color: '#8B4513' },
            { x: 900, y: this.groundY - 200, width: 180, height: 20, color: '#8B4513' },
            { x: 1300, y: this.groundY - 120, width: 220, height: 20, color: '#8B4513' },
            { x: 1700, y: this.groundY - 180, width: 160, height: 20, color: '#8B4513' }
        ];
        
        // Create some enemies
        this.enemies = [
            { x: 400, y: this.groundY - 24, width: 24, height: 24, velocityX: -1, velocityY: 0, onGround: false, health: 30, patrolStart: 350, patrolEnd: 550, color: '#FF4500' },
            { x: 800, y: this.groundY - 24, width: 24, height: 24, velocityX: 1, velocityY: 0, onGround: false, health: 30, patrolStart: 750, patrolEnd: 950, color: '#FF4500' }
        ];
        
        // Create some collectibles
        this.collectibles = [
            { x: 250, y: this.groundY - 40, width: 16, height: 16, value: 10, color: '#FFD700', collected: false },
            { x: 380, y: this.groundY - 170, width: 16, height: 16, value: 10, color: '#FFD700', collected: false },
            { x: 680, y: this.groundY - 120, width: 16, height: 16, value: 10, color: '#FFD700', collected: false },
            { x: 1200, y: this.groundY - 60, width: 16, height: 16, value: 10, color: '#FFD700', collected: false }
        ];
    },
    
    resetGameState() {
        this.levelComplete = false;
        this.paused = false;
    },
    
    update(deltaTime) {
        if (this.paused) return;
        
        this.handleInput();
        this.updatePlayer(deltaTime);
        this.updateEnemies(deltaTime);
        this.updateCollectibles();
        this.updateCamera();
        this.checkLevelCompletion();
        
        KeyboardInput.update();
    },
    
    handleInput() {
        // Player movement
        if (KeyboardInput.isActionDown('LEFT')) {
            this.player.velocityX = -this.player.speed;
            this.player.facingRight = false;
        } else if (KeyboardInput.isActionDown('RIGHT')) {
            this.player.velocityX = this.player.speed;
            this.player.facingRight = true;
        } else {
            this.player.velocityX = 0;
        }
        
        // Jumping
        if (KeyboardInput.isActionPressed('UP') && this.player.onGround) {
            this.player.velocityY = this.player.jumpPower;
            this.player.onGround = false;
        }
        
        // Exit level
        if (KeyboardInput.isActionPressed('BACK')) {
            this.exitLevel();
        }
    },
    
    updatePlayer(deltaTime) {
        // Reset ground state
        this.player.onGround = false;
        
        // Apply physics
        PhysicsEngine.applyGravity(this.player, deltaTime);
        PhysicsEngine.updatePosition(this.player, deltaTime);
        
        // Check ground collision
        PhysicsEngine.checkGroundCollision(this.player, this.groundY);
        
        // Check platform collisions
        this.platforms.forEach(platform => {
            PhysicsEngine.resolvePlatformCollision(this.player, platform);
        });
        
        // Check world boundaries
        const boundaryResult = PhysicsEngine.checkWorldBoundaries(this.player, this.levelWidth, this.levelHeight);
        if (boundaryResult === 'death') {
            this.respawnPlayer();
        }
        
        // Apply friction
        PhysicsEngine.applyFriction(this.player);
    },
    
    updateEnemies(deltaTime) {
        this.enemies.forEach(enemy => {
            // Simple patrol AI
            enemy.x += enemy.velocityX;
            
            // Turn around at patrol boundaries
            if (enemy.x <= enemy.patrolStart || enemy.x >= enemy.patrolEnd) {
                enemy.velocityX *= -1;
            }
            
            // Apply gravity
            enemy.onGround = false;
            PhysicsEngine.applyGravity(enemy, deltaTime);
            PhysicsEngine.updatePosition(enemy, deltaTime);
            PhysicsEngine.checkGroundCollision(enemy, this.groundY);
            
            // Check collision with player
            if (PhysicsEngine.checkCollision(this.player, enemy)) {
                this.handlePlayerEnemyCollision(enemy);
            }
        });
    },
    
    updateCollectibles() {
        this.collectibles.forEach(collectible => {
            if (!collectible.collected && PhysicsEngine.checkCollision(this.player, collectible)) {
                collectible.collected = true;
                this.player.score = (this.player.score || 0) + collectible.value;
                Debug.log(`Collected item worth ${collectible.value} points!`);
            }
        });
    },
    
    updateCamera() {
        Camera.update(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);
    },
    
    handlePlayerEnemyCollision(enemy) {
        // Simple damage system
        this.player.health -= 10;
        Debug.log(`Player hit enemy! Health: ${this.player.health}`);
        
        // Knockback
        const knockbackDirection = this.player.x < enemy.x ? -1 : 1;
        this.player.velocityX = knockbackDirection * 8;
        this.player.velocityY = -5;
        
        if (this.player.health <= 0) {
            this.respawnPlayer();
        }
    },
    
    respawnPlayer() {
        this.player.x = 100;
        this.player.y = this.groundY - 32;
        this.player.velocityX = 0;
        this.player.velocityY = 0;
        this.player.health = 100;
        Camera.snapTo(this.player.x - 200, 0);
        Debug.log('Player respawned');
    },
    
    checkLevelCompletion() {
        // Simple completion check - reach the end of the level
        if (this.player.x >= this.levelWidth - 200) {
            this.completeLevel();
        }
    },
    
    completeLevel() {
        if (this.levelComplete) return;
        
        this.levelComplete = true;
        Debug.log('Level completed!');
        
        // TODO: Mark level as completed in world data
        // TODO: Unlock next level
        
        setTimeout(() => {
            this.exitLevel();
        }, 2000);
    },
    
    exitLevel() {
        Debug.log('Exiting level, returning to world map');
        window.game?.stateManager?.changeState(GAME_CONSTANTS.STATES.WORLD_MAP, this.currentWorld);
    },
    
    render(ctx) {
        // Clear with sky color
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Render ground
        this.renderGround(ctx);
        
        // Render platforms
        this.renderPlatforms(ctx);
        
        // Render collectibles
        this.renderCollectibles(ctx);
        
        // Render enemies
        this.renderEnemies(ctx);
        
        // Render player
        this.renderPlayer(ctx);
        
        // Render UI
        this.renderUI(ctx);
    },
    
    renderGround(ctx) {
        const screenPos = Camera.worldToScreen(0, this.groundY);
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(0, screenPos.y, ctx.canvas.width, ctx.canvas.height - screenPos.y);
    },
    
    renderPlatforms(ctx) {
        this.platforms.forEach(platform => {
            if (Camera.isVisible(platform.x, platform.y, platform.width, platform.height)) {
                const screenPos = Camera.worldToScreen(platform.x, platform.y);
                ctx.fillStyle = platform.color;
                ctx.fillRect(screenPos.x, screenPos.y, platform.width, platform.height);
            }
        });
    },
    
    renderCollectibles(ctx) {
        this.collectibles.forEach(collectible => {
            if (!collectible.collected && Camera.isVisible(collectible.x, collectible.y, collectible.width, collectible.height)) {
                const screenPos = Camera.worldToScreen(collectible.x, collectible.y);
                ctx.fillStyle = collectible.color;
                ctx.fillRect(screenPos.x, screenPos.y, collectible.width, collectible.height);
            }
        });
    },
    
    renderEnemies(ctx) {
        this.enemies.forEach(enemy => {
            if (Camera.isVisible(enemy.x, enemy.y, enemy.width, enemy.height)) {
                const screenPos = Camera.worldToScreen(enemy.x, enemy.y);
                ctx.fillStyle = enemy.color;
                ctx.fillRect(screenPos.x, screenPos.y, enemy.width, enemy.height);
            }
        });
    },
    
    renderPlayer(ctx) {
        const screenPos = Camera.worldToScreen(this.player.x, this.player.y);
        
        // Get player sprite
        const playerSprite = AssetLoader.getImage('test-player');
        
        if (playerSprite) {
            // Flip sprite based on facing direction
            if (!this.player.facingRight) {
                ctx.save();
                ctx.scale(-1, 1);
                ctx.drawImage(playerSprite, -screenPos.x - this.player.width, screenPos.y, this.player.width, this.player.height);
                ctx.restore();
            } else {
                ctx.drawImage(playerSprite, screenPos.x, screenPos.y, this.player.width, this.player.height);
            }
        } else {
            // Fallback rectangle
            ctx.fillStyle = GAME_CONSTANTS.COLORS.PLAYER_BLUE;
            ctx.fillRect(screenPos.x, screenPos.y, this.player.width, this.player.height);
        }
    },
    
    renderUI(ctx) {
        // Health bar
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(10, 10, 204, 24);
        ctx.fillStyle = 'red';
        ctx.fillRect(12, 12, 200, 20);
        ctx.fillStyle = 'green';
        ctx.fillRect(12, 12, (this.player.health / 100) * 200, 20);
        
        // Score
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText(`Score: ${this.player.score || 0}`, 10, 60);
        
        // Level info
        ctx.fillText(`World ${this.currentWorld} - Level ${this.currentLevel}`, 10, 80);
        
        // Instructions
        ctx.font = '14px Arial';
        ctx.fillText('Arrow Keys: Move | Up: Jump | Esc: Exit', 10, ctx.canvas.height - 20);
        
        // Level complete message
        if (this.levelComplete) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            
            ctx.fillStyle = 'white';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('LEVEL COMPLETE!', ctx.canvas.width / 2, ctx.canvas.height / 2);
            ctx.font = '24px Arial';
            ctx.fillText('Returning to world map...', ctx.canvas.width / 2, ctx.canvas.height / 2 + 50);
            ctx.textAlign = 'left';
        }
    },
    
    exit() {
        Debug.log(`Exited Level ${this.currentLevel} of World ${this.currentWorld}`);
    }
};

// Make LevelScreen globally available
window.LevelScreen = LevelScreen;