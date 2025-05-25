// Level Screen - Generic level system using centralized data
const LevelScreen = {
    // Current level info
    currentWorld: 1,
    currentLevel: 1,
    currentLevelId: null,
    currentLevelData: null,
    
    // Game entities (now dynamic)
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
        
        // Construct level ID
        this.currentLevelId = `world${this.currentWorld}_level${this.currentLevel}`;
        
        Debug.log(`Entering ${this.currentLevelId}`);
        
        // Load the level data
        this.loadLevel(this.currentLevelId);
    },
    
    loadLevel(levelId) {
        // Get level data
        this.currentLevelData = LEVELS_DATA[levelId];
        
        if (!this.currentLevelData) {
            Debug.error(`Level data not found for: ${levelId}`);
            // Fallback to world map
            this.exitLevel();
            return;
        }
        
        Debug.log(`Loading level: ${this.currentLevelData.name}`);
        
        // Update level width based on data
        this.levelWidth = this.currentLevelData.levelEndX + 500; // Add buffer past end
        Camera.initialize(Camera.screenWidth, Camera.screenHeight, this.levelWidth, this.levelHeight);
        
        // Initialize all game elements from level data
        this.initializePlayer();
        this.initializePlatforms();
        this.initializeEnemies();
        this.initializeCollectibles();
        
        // Reset game state
        this.resetGameState();
        
        // Position camera at player
        Camera.snapTo(this.player.x - 200, 0);
    },
    
    initializePlayer() {
        const startData = this.currentLevelData.playerStart;
        
        this.player = {
            x: startData.x,
            y: this.groundY - startData.groundOffset,
            initialX: startData.x,
            initialY: this.groundY - startData.groundOffset,
            width: 32,
            height: 32,
            velocityX: 0,
            velocityY: 0,
            onGround: false,
            speed: 5,
            jumpPower: GAME_CONSTANTS.JUMP_POWER,
            health: 100,
            maxHealth: 100,
            score: 0,
            facingRight: true
        };
    },
    
    initializePlatforms() {
        this.platforms = [];
        
        this.currentLevelData.platforms.forEach(platformData => {
            this.platforms.push({
                x: platformData.x,
                y: this.groundY - platformData.groundOffset,
                width: platformData.width,
                height: platformData.height,
                color: platformData.color
            });
        });
        
        Debug.log(`Initialized ${this.platforms.length} platforms`);
    },
    
    initializeEnemies() {
        this.enemies = [];
        
        this.currentLevelData.enemies.forEach(enemyData => {
            this.enemies.push({
                x: enemyData.x,
                y: this.groundY - enemyData.groundOffset,
                width: enemyData.width,
                height: enemyData.height,
                velocityX: enemyData.speed * (Math.random() < 0.5 ? -1 : 1), // Random initial direction
                velocityY: 0,
                onGround: false,
                health: enemyData.maxHealth,
                maxHealth: enemyData.maxHealth,
                patrolStart: enemyData.patrolStart,
                patrolEnd: enemyData.patrolEnd,
                speed: enemyData.speed,
                dropAmount: enemyData.dropAmount,
                color: enemyData.color,
                active: true
            });
        });
        
        Debug.log(`Initialized ${this.enemies.length} enemies`);
    },
    
    initializeCollectibles() {
        this.collectibles = [];
        
        this.currentLevelData.collectibles.forEach(collectibleData => {
            this.collectibles.push({
                x: collectibleData.x,
                y: this.groundY - collectibleData.groundOffset,
                width: collectibleData.width,
                height: collectibleData.height,
                value: collectibleData.value,
                color: collectibleData.color,
                type: collectibleData.type,
                collected: false
            });
        });
        
        Debug.log(`Initialized ${this.collectibles.length} collectibles`);
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
            if (!enemy.active) return;
            
            // Simple patrol AI
            enemy.x += enemy.velocityX;
            
            // Turn around at patrol boundaries
            if (enemy.x <= enemy.patrolStart || enemy.x >= enemy.patrolEnd) {
                enemy.velocityX *= -1;
            }
            
            // Apply gravity and physics
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
                this.player.score += collectible.value;
                Debug.log(`Collected ${collectible.type} worth ${collectible.value} points!`);
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
        this.player.x = this.player.initialX;
        this.player.y = this.player.initialY;
        this.player.velocityX = 0;
        this.player.velocityY = 0;
        this.player.health = this.player.maxHealth;
        Camera.snapTo(this.player.x - 200, 0);
        Debug.log('Player respawned');
    },
    
    checkLevelCompletion() {
        // Use level data for completion check
        if (this.player.x >= this.currentLevelData.levelEndX) {
            this.completeLevel();
        }
    },
    
    completeLevel() {
        if (this.levelComplete) return;
        
        this.levelComplete = true;
        Debug.log(`Level completed: ${this.currentLevelData.name}!`);
        
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
        // Use level theme for background
        const theme = this.currentLevelData?.theme || { backgroundColor: '#87CEEB', groundColor: '#90EE90' };
        
        // Clear with themed sky color
        ctx.fillStyle = theme.backgroundColor;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Render ground with themed color
        this.renderGround(ctx, theme.groundColor);
        
        // Render game elements
        this.renderPlatforms(ctx);
        this.renderCollectibles(ctx);
        this.renderEnemies(ctx);
        this.renderPlayer(ctx);
        
        // Render UI
        this.renderUI(ctx);
    },
    
    renderGround(ctx, groundColor) {
        const screenPos = Camera.worldToScreen(0, this.groundY);
        ctx.fillStyle = groundColor;
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
                
                // Add a simple shine effect for coins
                if (collectible.type === 'coin') {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                    ctx.fillRect(screenPos.x + 2, screenPos.y + 2, collectible.width - 4, collectible.height - 4);
                }
            }
        });
    },
    
    renderEnemies(ctx) {
        this.enemies.forEach(enemy => {
            if (!enemy.active) return;
            
            if (Camera.isVisible(enemy.x, enemy.y, enemy.width, enemy.height)) {
                const screenPos = Camera.worldToScreen(enemy.x, enemy.y);
                ctx.fillStyle = enemy.color;
                ctx.fillRect(screenPos.x, screenPos.y, enemy.width, enemy.height);
                
                // Health bar for damaged enemies
                if (enemy.health < enemy.maxHealth) {
                    const healthBarWidth = enemy.width;
                    const healthBarHeight = 4;
                    const healthPercent = enemy.health / enemy.maxHealth;
                    
                    // Background
                    ctx.fillStyle = 'red';
                    ctx.fillRect(screenPos.x, screenPos.y - 8, healthBarWidth, healthBarHeight);
                    
                    // Health
                    ctx.fillStyle = 'green';
                    ctx.fillRect(screenPos.x, screenPos.y - 8, healthBarWidth * healthPercent, healthBarHeight);
                }
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
        ctx.fillRect(12, 12, (this.player.health / this.player.maxHealth) * 200, 20);
        
        // Score
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText(`Score: ${this.player.score}`, 10, 60);
        
        // Level info - use actual level data
        ctx.fillText(`${this.currentLevelData?.name || 'Unknown Level'}`, 10, 80);
        ctx.font = '12px Arial';
        ctx.fillText(`World ${this.currentWorld} - Level ${this.currentLevel}`, 10, 95);
        
        // Progress indicator
        const progress = Math.min(this.player.x / this.currentLevelData.levelEndX, 1);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(10, 110, 204, 14);
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(12, 112, 200 * progress, 10);
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.fillText(`Progress: ${Math.floor(progress * 100)}%`, 15, 120);
        
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
            ctx.fillText('LEVEL COMPLETE!', ctx.canvas.width / 2, ctx.canvas.height / 2 - 30);
            ctx.font = '24px Arial';
            ctx.fillText(`${this.currentLevelData.name}`, ctx.canvas.width / 2, ctx.canvas.height / 2 + 10);
            ctx.font = '18px Arial';
            ctx.fillText('Returning to world map...', ctx.canvas.width / 2, ctx.canvas.height / 2 + 40);
            ctx.textAlign = 'left';
        }
    },
    
    exit() {
        Debug.log(`Exited ${this.currentLevelData?.name || 'Unknown Level'}`);
    }
};

// Make LevelScreen globally available
window.LevelScreen = LevelScreen;