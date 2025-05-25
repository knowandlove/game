// Level Data - Dynamic level configurations using groundOffset approach
const LEVELS_DATA = {
    // World 1 Levels
    'world1_level1': {
        name: "Sunny Beach",
        world: 1,
        levelNumber: 1,
        levelEndX: 2800, // How far player needs to go to complete
        
        // Player starting position (offset from ground)
        playerStart: {
            x: 100,
            groundOffset: 32 // Player height above ground
        },
        
        // Platforms (static level geometry)
        platforms: [
            { x: 300, groundOffset: 150, width: 200, height: 20, color: '#8B4513' },
            { x: 600, groundOffset: 100, width: 150, height: 20, color: '#8B4513' },
            { x: 900, groundOffset: 200, width: 180, height: 20, color: '#8B4513' },
            { x: 1300, groundOffset: 120, width: 220, height: 20, color: '#8B4513' },
            { x: 1700, groundOffset: 180, width: 160, height: 20, color: '#8B4513' },
            { x: 2100, groundOffset: 90, width: 200, height: 20, color: '#8B4513' },
            { x: 2500, groundOffset: 160, width: 180, height: 20, color: '#8B4513' }
        ],
        
        // Enemies (using groundOffset instead of absolute Y)
        enemies: [
            {
                x: 400,
                groundOffset: 24,
                width: 24,
                height: 24,
                speed: 1,
                patrolStart: 350,
                patrolEnd: 550,
                maxHealth: 30,
                dropAmount: GAME_CONSTANTS.CHIP_VALUE,
                color: '#FF4500'
            },
            {
                x: 800,
                groundOffset: 24,
                width: 24,
                height: 24,
                speed: 1,
                patrolStart: 750,
                patrolEnd: 950,
                maxHealth: 30,
                dropAmount: GAME_CONSTANTS.CHIP_VALUE,
                color: '#FF4500'
            },
            {
                x: 1500,
                groundOffset: 24,
                width: 24,
                height: 24,
                speed: 1.5,
                patrolStart: 1450,
                patrolEnd: 1650,
                maxHealth: 40,
                dropAmount: GAME_CONSTANTS.CHIP_VALUE * 2,
                color: '#DC143C'
            }
        ],
        
        // Collectibles (coins, power-ups, etc.)
        collectibles: [
            { x: 250, groundOffset: 40, width: 16, height: 16, value: 10, color: '#FFD700', type: 'coin' },
            { x: 380, groundOffset: 170, width: 16, height: 16, value: 10, color: '#FFD700', type: 'coin' },
            { x: 680, groundOffset: 120, width: 16, height: 16, value: 10, color: '#FFD700', type: 'coin' },
            { x: 1200, groundOffset: 60, width: 16, height: 16, value: 10, color: '#FFD700', type: 'coin' },
            { x: 1400, groundOffset: 140, width: 16, height: 16, value: 10, color: '#FFD700', type: 'coin' },
            { x: 1850, groundOffset: 200, width: 16, height: 16, value: 10, color: '#FFD700', type: 'coin' },
            { x: 2200, groundOffset: 110, width: 16, height: 16, value: 10, color: '#FFD700', type: 'coin' }
        ],
        
        // Level theme/background
        theme: {
            backgroundColor: '#87CEEB',
            groundColor: '#90EE90'
        }
    },
    
    'world1_level2': {
        name: "Palm Grove",
        world: 1,
        levelNumber: 2,
        levelEndX: 3200,
        
        playerStart: {
            x: 100,
            groundOffset: 32
        },
        
        platforms: [
            { x: 250, groundOffset: 80, width: 120, height: 20, color: '#8B4513' },
            { x: 450, groundOffset: 160, width: 100, height: 20, color: '#8B4513' },
            { x: 650, groundOffset: 120, width: 140, height: 20, color: '#8B4513' },
            { x: 900, groundOffset: 220, width: 160, height: 20, color: '#8B4513' },
            { x: 1200, groundOffset: 100, width: 180, height: 20, color: '#8B4513' },
            { x: 1500, groundOffset: 180, width: 200, height: 20, color: '#8B4513' },
            { x: 1800, groundOffset: 140, width: 160, height: 20, color: '#8B4513' },
            { x: 2200, groundOffset: 200, width: 220, height: 20, color: '#8B4513' },
            { x: 2600, groundOffset: 110, width: 180, height: 20, color: '#8B4513' }
        ],
        
        enemies: [
            {
                x: 300,
                groundOffset: 24,
                width: 24,
                height: 24,
                speed: 0.8,
                patrolStart: 250,
                patrolEnd: 400,
                maxHealth: 25,
                dropAmount: GAME_CONSTANTS.CHIP_VALUE,
                color: '#FF6347'
            },
            {
                x: 700,
                groundOffset: 24,
                width: 24,
                height: 24,
                speed: 1.2,
                patrolStart: 600,
                patrolEnd: 800,
                maxHealth: 35,
                dropAmount: GAME_CONSTANTS.CHIP_VALUE,
                color: '#FF4500'
            },
            {
                x: 1100,
                groundOffset: 24,
                width: 24,
                height: 24,
                speed: 1.5,
                patrolStart: 1050,
                patrolEnd: 1350,
                maxHealth: 40,
                dropAmount: GAME_CONSTANTS.CHIP_VALUE * 2,
                color: '#DC143C'
            },
            {
                x: 2000,
                groundOffset: 24,
                width: 24,
                height: 24,
                speed: 1.8,
                patrolStart: 1900,
                patrolEnd: 2100,
                maxHealth: 50,
                dropAmount: GAME_CONSTANTS.CHIP_VALUE * 2,
                color: '#8B0000'
            }
        ],
        
        collectibles: [
            { x: 200, groundOffset: 40, width: 16, height: 16, value: 10, color: '#FFD700', type: 'coin' },
            { x: 350, groundOffset: 100, width: 16, height: 16, value: 10, color: '#FFD700', type: 'coin' },
            { x: 520, groundOffset: 180, width: 16, height: 16, value: 10, color: '#FFD700', type: 'coin' },
            { x: 720, groundOffset: 140, width: 16, height: 16, value: 10, color: '#FFD700', type: 'coin' },
            { x: 980, groundOffset: 240, width: 16, height: 16, value: 10, color: '#FFD700', type: 'coin' },
            { x: 1280, groundOffset: 120, width: 16, height: 16, value: 10, color: '#FFD700', type: 'coin' },
            { x: 1580, groundOffset: 200, width: 16, height: 16, value: 10, color: '#FFD700', type: 'coin' },
            { x: 1880, groundOffset: 160, width: 16, height: 16, value: 10, color: '#FFD700', type: 'coin' },
            { x: 2280, groundOffset: 220, width: 16, height: 16, value: 10, color: '#FFD700', type: 'coin' },
            { x: 2680, groundOffset: 130, width: 16, height: 16, value: 10, color: '#FFD700', type: 'coin' }
        ],
        
        theme: {
            backgroundColor: '#87CEEB',
            groundColor: '#90EE90'
        }
    },
    
    // Template for additional levels
    'world2_level1': {
        name: "Misty Meadow",
        world: 2,
        levelNumber: 1,
        levelEndX: 2600,
        
        playerStart: {
            x: 100,
            groundOffset: 32
        },
        
        platforms: [
            { x: 300, groundOffset: 120, width: 180, height: 20, color: '#696969' },
            { x: 600, groundOffset: 180, width: 160, height: 20, color: '#696969' },
            { x: 900, groundOffset: 100, width: 200, height: 20, color: '#696969' },
            { x: 1300, groundOffset: 160, width: 180, height: 20, color: '#696969' },
            { x: 1700, groundOffset: 220, width: 160, height: 20, color: '#696969' }
        ],
        
        enemies: [
            {
                x: 450,
                groundOffset: 24,
                width: 24,
                height: 24,
                speed: 0.8,
                patrolStart: 400,
                patrolEnd: 650,
                maxHealth: 35,
                dropAmount: GAME_CONSTANTS.CHIP_VALUE,
                color: '#4682B4'
            },
            {
                x: 1000,
                groundOffset: 24,
                width: 24,
                height: 24,
                speed: 1.2,
                patrolStart: 950,
                patrolEnd: 1150,
                maxHealth: 40,
                dropAmount: GAME_CONSTANTS.CHIP_VALUE * 2,
                color: '#483D8B'
            }
        ],
        
        collectibles: [
            { x: 250, groundOffset: 40, width: 16, height: 16, value: 10, color: '#C0C0C0', type: 'coin' },
            { x: 380, groundOffset: 140, width: 16, height: 16, value: 10, color: '#C0C0C0', type: 'coin' },
            { x: 680, groundOffset: 200, width: 16, height: 16, value: 10, color: '#C0C0C0', type: 'coin' },
            { x: 980, groundOffset: 120, width: 16, height: 16, value: 10, color: '#C0C0C0', type: 'coin' },
            { x: 1380, groundOffset: 180, width: 16, height: 16, value: 10, color: '#C0C0C0', type: 'coin' }
        ],
        
        theme: {
            backgroundColor: '#708090',
            groundColor: '#2F4F4F'
        }
    }
};

// Make levels data globally available
window.LEVELS_DATA = LEVELS_DATA;