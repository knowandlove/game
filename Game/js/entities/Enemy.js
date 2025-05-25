// Enemy Entity - For future level gameplay
function Enemy(x, y, width, height, color, patrolStart, patrolEnd, speed, maxHealth, dropAmount = GAME_CONSTANTS.CHIP_VALUE) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.patrolStart = patrolStart;
    this.patrolEnd = patrolEnd;
    this.speed = speed;
    this.direction = 1; // 1 for right, -1 for left
    this.health = maxHealth;
    this.maxHealth = maxHealth;
    this.dropAmount = dropAmount; // Now defaults to CHIP_VALUE consistently
    this.active = true;
    
    this.update = function() {
        if (!this.active) return;
        
        // Patrol movement
        this.x += this.speed * this.direction;
        
        // Change direction at patrol boundaries
        if (this.x <= this.patrolStart || this.x >= this.patrolEnd) {
            this.direction *= -1;
        }
        
        // Keep within patrol bounds
        if (this.x < this.patrolStart) this.x = this.patrolStart;
        if (this.x > this.patrolEnd) this.x = this.patrolEnd;
    };
    
    this.render = function(ctx, camera) {
        if (!this.active) return;
        
        // Calculate screen position - using explicit window reference
        const screenX = this.x - (camera ? camera.x : 0);
        
        // Only render if on screen
        if (screenX + this.width > 0 && screenX < window.canvas.width) {
            ctx.fillStyle = this.color;
            ctx.fillRect(screenX, this.y, this.width, this.height);
            
            // Health bar
            if (this.health < this.maxHealth) {
                const healthBarWidth = this.width;
                const healthBarHeight = 4;
                const healthPercent = this.health / this.maxHealth;
                
                // Background
                ctx.fillStyle = 'red';
                ctx.fillRect(screenX, this.y - 8, healthBarWidth, healthBarHeight);
                
                // Health
                ctx.fillStyle = 'green';
                ctx.fillRect(screenX, this.y - 8, healthBarWidth * healthPercent, healthBarHeight);
            }
        }
    };
    
    this.takeDamage = function(amount) {
        this.health -= amount;
        Debug.log(`Enemy took ${amount} damage, health: ${this.health}`);
        
        if (this.health <= 0) {
            this.destroy();
        }
    };
    
    this.destroy = function() {
        this.active = false;
        Debug.log(`Enemy destroyed, dropping ${this.dropAmount} currency`);
        
        // Drop collectible - assumes global collectibles array and Collectible constructor exist
        if (window.collectibles && window.Collectible) {
            const collectible = new window.Collectible(
                this.x + this.width / 2,
                this.y,
                16, 16,
                'gold',
                this.dropAmount // Uses consistent CHIP_VALUE or specified amount
            );
            window.collectibles.push(collectible);
        }
    };
    
    this.checkCollision = function(target) {
        return this.active &&
               this.x < target.x + target.width &&
               this.x + this.width > target.x &&
               this.y < target.y + target.height &&
               this.y + this.height > target.y;
    };
}

// Make Enemy constructor globally available
window.Enemy = Enemy;