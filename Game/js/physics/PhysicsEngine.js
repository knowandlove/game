// Physics Engine - Handles gravity, collision detection, and physics interactions
const PhysicsEngine = {
    gravity: GAME_CONSTANTS.GRAVITY,
    
    // Apply gravity to an entity
    applyGravity(entity, deltaTime = 16) {
        if (!entity.onGround) {
            entity.velocityY += this.gravity * (deltaTime / 16);
        }
    },
    
    // Update entity position based on velocity
    updatePosition(entity, deltaTime = 16) {
        const timeScale = deltaTime / 16; // Normalize to 60fps
        entity.x += entity.velocityX * timeScale;
        entity.y += entity.velocityY * timeScale;
    },
    
    // Check collision between two rectangular entities
    checkCollision(entityA, entityB) {
        return entityA.x < entityB.x + entityB.width &&
               entityA.x + entityA.width > entityB.x &&
               entityA.y < entityB.y + entityB.height &&
               entityA.y + entityA.height > entityB.y;
    },
    
    // Resolve collision between entity and platform
    resolvePlatformCollision(entity, platform) {
        if (!this.checkCollision(entity, platform)) return false;
        
        // Calculate overlap amounts
        const overlapX = Math.min(
            entity.x + entity.width - platform.x,
            platform.x + platform.width - entity.x
        );
        const overlapY = Math.min(
            entity.y + entity.height - platform.y,
            platform.y + platform.height - entity.y
        );
        
        // Resolve collision based on smallest overlap
        if (overlapX < overlapY) {
            // Horizontal collision
            if (entity.x < platform.x) {
                // Hit from left
                entity.x = platform.x - entity.width;
                entity.velocityX = 0;
            } else {
                // Hit from right
                entity.x = platform.x + platform.width;
                entity.velocityX = 0;
            }
        } else {
            // Vertical collision
            if (entity.y < platform.y) {
                // Landing on top
                entity.y = platform.y - entity.height;
                entity.velocityY = 0;
                entity.onGround = true;
                return 'top';
            } else {
                // Hit from bottom
                entity.y = platform.y + platform.height;
                entity.velocityY = 0;
                return 'bottom';
            }
        }
        
        return 'side';
    },
    
    // Check ground collision
    checkGroundCollision(entity, groundY) {
        if (entity.y + entity.height >= groundY) {
            entity.y = groundY - entity.height;
            entity.velocityY = 0;
            entity.onGround = true;
            return true;
        }
        return false;
    },
    
    // Check world boundaries
    checkWorldBoundaries(entity, worldWidth, worldHeight) {
        let collided = false;
        
        // Left boundary
        if (entity.x < 0) {
            entity.x = 0;
            entity.velocityX = 0;
            collided = true;
        }
        
        // Right boundary
        if (entity.x + entity.width > worldWidth) {
            entity.x = worldWidth - entity.width;
            entity.velocityX = 0;
            collided = true;
        }
        
        // Top boundary (if applicable)
        if (entity.y < 0) {
            entity.y = 0;
            entity.velocityY = 0;
            collided = true;
        }
        
        // Bottom boundary (death plane)
        if (entity.y > worldHeight + 100) {
            // Entity fell off the world
            return 'death';
        }
        
        return collided ? 'boundary' : false;
    },
    
    // Apply friction/air resistance
    applyFriction(entity, groundFriction = 0.8, airFriction = 0.98) {
        if (entity.onGround) {
            entity.velocityX *= groundFriction;
        } else {
            entity.velocityX *= airFriction;
        }
        
        // Stop very small movements to prevent jitter
        if (Math.abs(entity.velocityX) < 0.1) {
            entity.velocityX = 0;
        }
    },
    
    // Calculate distance between two points
    distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },
    
    // Calculate angle between two points
    angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },
    
    // Move entity towards a target
    moveTowards(entity, targetX, targetY, speed) {
        const distance = this.distance(entity.x, entity.y, targetX, targetY);
        if (distance > speed) {
            const angle = this.angle(entity.x, entity.y, targetX, targetY);
            entity.velocityX = Math.cos(angle) * speed;
            entity.velocityY = Math.sin(angle) * speed;
        } else {
            // Close enough, snap to target
            entity.x = targetX;
            entity.y = targetY;
            entity.velocityX = 0;
            entity.velocityY = 0;
        }
    }
};

// Make PhysicsEngine globally available
window.PhysicsEngine = PhysicsEngine;