// Game Constants - Load this first to avoid ReferenceErrors
const GAME_CONSTANTS = {
    // Performance & Display
    TARGET_FPS: 60,
    CANVAS_WIDTH: 1024,
    CANVAS_HEIGHT: 768,
    
    // World & Level Settings
    WORLD_WIDTH: 3000,
    LEVEL_END_X: 3000 - 200, // Uses WORLD_WIDTH for consistency
    CHIP_VALUE: 5, // Default drop amount for enemies
    
    // Physics & Movement
    GRAVITY: 0.5,
    JUMP_POWER: -10,
    GAME_SPEED: 5,
    
    // Combat Settings
    ENEMY_DAMAGE: 10,
    INVINCIBILITY_DURATION: 1500,
    PROJECTILE_SPEED: 10,
    PROJECTILE_DAMAGE_BASE: 20,
    PROJECTILE_DAMAGE_UPGRADED: 40,
    PLAYER_SHOOT_COOLDOWN: 300,
    
    // Shop Settings
    GUN_UPGRADE_COST: 50,
    
    // Game States
    STATES: {
        LOADING: 'loading',
        WORLD_SELECT: 'world_select',
        WORLD_MAP: 'world_map',
        LEVEL: 'level',
        PAUSED: 'paused'
    },
    
    // World Map Settings
    WORLD_MAP: {
        PLAYER_MOVE_SPEED: 2,
        LEVEL_DOT_SIZE: 20,
        LEVEL_DOT_SIZE_SELECTED: 25,
        PATH_WIDTH: 4,
        PLAYER_HOVER_HEIGHT: 35,
        PULSE_SPEED: 0.005,
        PULSE_AMOUNT: 0.1
    },
    
    // World Selection Settings  
    WORLD_SELECTION: {
        BUTTON_WIDTH: 100,
        BUTTON_HEIGHT: 80,
        BUTTON_SPACING: 130,
        ROWS: 2,
        COLS: 4,
        HIGHLIGHT_COLOR: '#FFD700',
        SELECTED_SCALE: 1.1,
        ANIMATION_SPEED: 0.008
    },
    
    // Input Keys
    KEYS: {
        LEFT: ['ArrowLeft', 'KeyA'],
        RIGHT: ['ArrowRight', 'KeyD'],
        UP: ['ArrowUp', 'KeyW'],
        DOWN: ['ArrowDown', 'KeyS'],
        SELECT: ['Enter', 'Space'],
        BACK: ['Escape', 'Backspace'],
        DEBUG: ['KeyF']
    },
    
    // Colors
    COLORS: {
        SKY_BLUE: '#87CEEB',
        GRASS_GREEN: '#90EE90',
        UI_BLACK: '#000000',
        UI_WHITE: '#FFFFFF',
        PLAYER_BLUE: '#4169E1',
        LOCKED_GRAY: '#555555',
        ERROR_RED: '#FF0000'
    },
    
    // Asset Configuration
    ASSETS: {
        IMAGES: {
            'test-player': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTQiIGZpbGw9IiM0MTY5RTEiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjIiIGZpbGw9IiNmZmYiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxMiIgcj0iMiIgZmlsbD0iI2ZmZiIvPgo8cGF0aCBkPSJNMTAgMjBRMTYgMjQgMjIgMjAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjwvc3ZnPgo=',
            'world-icon': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIzMCIgZmlsbD0iIzQwRTBEMCIgc3Ryb2tlPSIjMDA2NjUwIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIyMCIgZmlsbD0iIzM0RDM5OSIvPgo8L3N2Zz4K'
        }
    },
    
    // Debug Settings
    DEBUG_MODE: true
};

// Make constants globally available
window.GAME_CONSTANTS = GAME_CONSTANTS;

// For backward compatibility, expose individual properties
window.GAME_CONFIG = GAME_CONSTANTS; // Our existing code uses GAME_CONFIG