// Projectile Entity - For future level gameplay
function Projectile(x, y, width, height, color, speedX, damage) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speedX = speedX;
    this.damage = damage;
    this.active = true;
    
    this.update = function() {
        // Move projectile
        this.x += this.speedX;
        
        // Remove if off-screen - using explicit window.canvas reference
        if (this.x > window.canvas.width + 100 || this.x < -100) {
            this.active = false;
        }
    };
    
    this.render = function(ctx, camera) {
        if (!this.active) return;
        
        // Calculate screen position - using explicit window.canvas reference for clarity
        const screenX = this.x - (camera ? camera.x : 0);
        
        // Only render if on screen
        if (screenX + this.width > 0 && screenX < window.canvas.width) {
            ctx.fillStyle = this.color;
            ctx.fillRect(screenX, this.y, this.width, this.height);
        }
    };
    
    this.checkCollision = function(target) {
        return this.active &&
               this.x < target.x + target.width &&
               this.x + this.width > target.x &&
               this.y < target.y + target.height &&
               this.y + this.height > target.y;
    };
    
    this.destroy = function() {
        this.active = false;
    };
}

// Make Projectile constructor globally available
window.Projectile = Projectile;