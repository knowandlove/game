// Game Configuration Settings
const GAME_CONFIG = {
    CANVAS_WIDTH: 1024,
    CANVAS_HEIGHT: 768,
    STATES: {
        LOADING: 'loading',
        WORLD_SELECT: 'world_select',
        WORLD_MAP: 'world_map',
        LEVEL: 'level'
    },
    TARGET_FPS: 60,
    DEBUG_MODE: true,
    TOTAL_WORLDS: 8,
    COLORS: {
        SKY_BLUE: '#87CEEB',
        GRASS_GREEN: '#90EE90',
        UI_BLACK: '#000000',
        UI_WHITE: '#FFFFFF'
    },
    ASSETS: {
        // Test assets for Phase 2 - Simplified working SVGs
        IMAGES: {
            'test-player': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTQiIGZpbGw9IiM0MTY5RTEiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjIiIGZpbGw9IiNmZmYiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxMiIgcj0iMiIgZmlsbD0iI2ZmZiIvPgo8cGF0aCBkPSJNMTAgMjBRMTYgMjQgMjIgMjAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjwvc3ZnPgo=',
            'world-icon': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIzMCIgZmlsbD0iIzQwRTBEMCIgc3Ryb2tlPSIjMDA2NjUwIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIyMCIgZmlsbD0iIzM0RDM5OSIvPgo8L3N2Zz4K'
        }
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
    
    // World Selection Settings
    WORLD_SELECTION: {
        BUTTON_WIDTH: 100,
        BUTTON_HEIGHT: 80,
        BUTTON_SPACING: 130,
        ROWS: 2,
        COLS: 4,
        HIGHLIGHT_COLOR: '#FFD700', // Gold highlight
        SELECTED_SCALE: 1.1 // Scale up selected button slightly
    }
};

// Make config globally available
window.GAME_CONFIG = GAME_CONFIG;