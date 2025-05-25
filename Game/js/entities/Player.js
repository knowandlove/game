// Player Entity - For future level gameplay
const Player = {
    // Position and dimensions
    x: 50,
    y: 0, // Will be set by game initialization based on canvas height
    initialX: 50,
    initialY: 0, // Will be set by game initialization
    width: 32,
    height: 32,
    
    // Physics
    velocityX: 0,
    velocityY: 0,
    onGround: false,
    
    // State
    health: 100,
    maxHealth: 100,
    currency: 0,
    invulnerable: false,
    invulnerabilityTimer: 0,
    
    // Abilities
    gunUpgraded: false,
    lastShotTime: 0,
    
    // Initialize with canvas-dependent values
    initialize(canvasHeight) {
        this.y = canvasHeight - 70;
        this.initialY = canvasHeight - 70;
        Debug.log(`Player initialized at position: ${this.x}, ${this.y}`);
    },
    
    reset() {
        this.x = this.initialX;
        this.y = this.initialY;
        this.velocityX = 0;
        this.velocityY = 0;
        this.health = this.maxHealth;
        this.invulnerable = false;
        this.invulnerabilityTimer = 0;
        Debug.log('Player reset to initial position');
    },
    
    update(platforms, groundY) {
        // Apply gravity
        this.velocityY += GAME_CONSTANTS.GRAVITY;
        
        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // World boundary checks - only use world coordinates, not screen coordinates
        if (this.x < 0) {
            this.x = 0;
        }
        
        // Right boundary uses WORLD_WIDTH - camera handles screen coordinate translation
        if (this.x + this.width > GAME_CONSTANTS.WORLD_WIDTH) {
            this.x = GAME_CONSTANTS.WORLD_WIDTH - this.width;
        }
        
        // Ground collision
        if (this.y + this.height > groundY) {
            this.y = groundY - this.height;
            this.velocityY = 0;
            this.onGround = true;
        } else {
            this.onGround = false;
        }
        
        // Platform collision (if platforms array provided)
        if (platforms) {
            this.checkPlatformCollisions(platforms);
        }
        
        // Update invulnerability
        if (this.invulnerable) {
            this.invulnerabilityTimer -= 16; // Assuming 60fps
            if (this.invulnerabilityTimer <= 0) {
                this.invulnerable = false;
            }
        }
    },
    
    checkPlatformCollisions(platforms) {
        // Basic platform collision - can be expanded
        platforms.forEach(platform => {
            if (this.x < platform.x + platform.width &&
                this.x + this.width > platform.x &&
                this.y < platform.y + platform.height &&
                this.y + this.height > platform.y) {
                
                // Land on top of platform
                if (this.velocityY > 0 && this.y < platform.y) {
                    this.y = platform.y - this.height;
                    this.velocityY = 0;
                    this.onGround = true;
                }
            }
        });
    },
    
    jump() {
        if (this.onGround) {
            this.velocityY = GAME_CONSTANTS.JUMP_POWER;
            this.onGround = false;
            Debug.log('Player jumped');
        }
    },
    
    shoot() {
        const currentTime = Date.now();
        if (currentTime - this.lastShotTime < GAME_CONSTANTS.PLAYER_SHOOT_COOLDOWN) {
            return; // Still in cooldown
        }
        
        this.lastShotTime = currentTime;
        
        const damage = this.gunUpgraded ? 
            GAME_CONSTANTS.PROJECTILE_DAMAGE_UPGRADED : 
            GAME_CONSTANTS.PROJECTILE_DAMAGE_BASE;
            
        // Create projectile (assumes global projectiles array and Projectile constructor exist)
        if (window.projectiles && window.Projectile) {
            const projectile = new window.Projectile(
                this.x + this.width,
                this.y + this.height / 2,
                10, 5, 'yellow',
                GAME_CONSTANTS.PROJECTILE_SPEED,
                damage
            );
            window.projectiles.push(projectile);
        }
        
        Debug.log(`Player shot projectile (damage: ${damage})`);
    },
    
    takeDamage(amount) {
        if (this.invulnerable) return;
        
        this.health -= amount;
        this.invulnerable = true;
        this.invulnerabilityTimer = GAME_CONSTANTS.INVINCIBILITY_DURATION;
        
        Debug.log(`Player took ${amount} damage, health: ${this.health}`);
        
        if (this.health <= 0) {
            this.health = 0;
            Debug.log('Player died');
            // Handle death logic
        }
    },
    
    addCurrency(amount) {
        this.currency += amount;
        Debug.log(`Player gained ${amount} currency, total: ${this.currency}`);
    },
    
    render(ctx, camera) {
        // Use explicit window.canvas reference for clarity
        const screenX = this.x - (camera ? camera.x : 0);
        
        // Only render if on screen
        if (screenX + this.width > 0 && screenX < window.canvas.width) {
            // Render player sprite or fallback rectangle
            const playerSprite = window.AssetLoader?.getImage('test-player');
            
            if (playerSprite) {
                ctx.drawImage(playerSprite, screenX, this.y, this.width, this.height);
            } else {
                // Fallback rectangle
                ctx.fillStyle = this.invulnerable && Math.floor(Date.now() / 100) % 2 ? 
                    'rgba(65, 105, 225, 0.5)' : GAME_CONSTANTS.COLORS.PLAYER_BLUE;
                ctx.fillRect(screenX, this.y, this.width, this.height);
            }
        }
    }
};

// Make Player globally available
window.Player = Player;