// Game Core - Proper initialization and dependency management
class GameCore {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.stateManager = null;
        this.isRunning = false;
        this.lastTime = 0;
        this.assetsLoaded = false;
        this.audioInitialized = false;
        
        Debug.log('GameCore instance created');
    }
    
    async initialize() {
        try {
            Debug.log('Initializing GameCore...');
            
            // Step 1: Setup canvas and context
            this.setupCanvas();
            
            // Step 2: Initialize input system
            this.setupInput();
            
            // Step 3: Initialize dependent systems that need canvas dimensions
            this.initializeDependentSystems();
            
            // Step 4: Setup state management
            this.setupStates();
            
            // Step 5: Setup user interaction
            this.setupUserInteraction();
            
            // Step 6: Load assets
            await this.loadAssets();
            
            Debug.log('GameCore initialized successfully');
            return true;
            
        } catch (error) {
            Debug.error('GameCore initialization failed:', error);
            return false;
        }
    }
    
    setupCanvas() {
        this.canvas = document.getElementById('game-canvas');
        if (!this.canvas) {
            throw new Error('Canvas element not found');
        }
        
        this.canvas.width = GAME_CONSTANTS.CANVAS_WIDTH;
        this.canvas.height = GAME_CONSTANTS.CANVAS_HEIGHT;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        
        // Make canvas and context globally available for other systems
        window.canvas = this.canvas;
        window.ctx = this.ctx;
        
        Debug.log(`Canvas setup: ${this.canvas.width}x${this.canvas.height}`);
    }
    
    setupInput() {
        KeyboardInput.initialize();
        Debug.log('Input system initialized');
    }
    
    initializeDependentSystems() {
        // Initialize systems that depend on canvas being ready
        
        // Initialize world map with proper canvas dimensions
        if (window.WorldMapScreen && typeof window.WorldMapScreen.initialize === 'function') {
            window.WorldMapScreen.initialize(this.canvas.width, this.canvas.height);
        }
        
        // Initialize level screen
        if (window.LevelScreen && typeof window.LevelScreen.initialize === 'function') {
            window.LevelScreen.initialize(this.canvas.width, this.canvas.height);
        }
        
        Debug.log('Dependent systems initialized');
    }
    
    setupStates() {
        this.stateManager = new StateManager();
        
        // Register all game states
        this.stateManager.registerState(GAME_CONSTANTS.STATES.LOADING, {
            render: (ctx) => {},
            update: (deltaTime) => {}
        });
        
        this.stateManager.registerState(GAME_CONSTANTS.STATES.WORLD_SELECT, {
            enter: () => WorldSelectScreen.enter(),
            update: (deltaTime) => WorldSelectScreen.update(deltaTime),
            render: (ctx) => WorldSelectScreen.render(ctx),
            exit: () => WorldSelectScreen.exit()
        });
        
        this.stateManager.registerState(GAME_CONSTANTS.STATES.WORLD_MAP, {
            enter: (worldNumber) => WorldMapScreen.enter(worldNumber),
            update: (deltaTime) => WorldMapScreen.update(deltaTime),
            render: (ctx) => WorldMapScreen.render(ctx),
            exit: () => WorldMapScreen.exit()
        });
        
        this.stateManager.registerState(GAME_CONSTANTS.STATES.LEVEL, {
            enter: (data) => LevelScreen.enter(data),
            update: (deltaTime) => LevelScreen.update(deltaTime),
            render: (ctx) => LevelScreen.render(ctx),
            exit: () => LevelScreen.exit()
        });
        
        Debug.log('Game states registered');
    }
    
    setupUserInteraction() {
        const handleFirstClick = async () => {
            Debug.log('User interaction detected');
            
            if (!this.audioInitialized) {
                await AudioManager.initialize();
                this.audioInitialized = true;
                AudioManager.playSound('test-beep');
            } else {
                await AudioManager.resumeContext();
            }
            
            this.hideLoadingScreen();
            this.stateManager.changeState(GAME_CONSTANTS.STATES.WORLD_SELECT);
            
            document.removeEventListener('click', handleFirstClick);
        };
        
        document.addEventListener('click', handleFirstClick);
    }
    
    async loadAssets() {
        try {
            await AssetLoader.loadAllAssets();
            this.assetsLoaded = true;
            
            setTimeout(() => {
                this.showClickToContinue();
            }, 500);
            
        } catch (error) {
            Debug.error('Asset loading failed:', error);
            throw error;
        }
    }
    
    showClickToContinue() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <h2>Click anywhere to start!</h2>
                <p style="font-size: 16px; margin-top: 20px;">
                    (This enables audio and starts the game)
                </p>
            `;
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }
    
    async start() {
        const initialized = await this.initialize();
        if (!initialized) {
            Debug.error('Failed to initialize game');
            return;
        }
        
        this.isRunning = true;
        this.gameLoop();
        Debug.log('Game started successfully');
    }
    
    gameLoop(currentTime = 0) {
        if (!this.isRunning) return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Update debug info
        Debug.updateFPS(currentTime);
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and render current state
        this.stateManager.update(deltaTime);
        this.stateManager.render(this.ctx);
        
        // Continue game loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    stop() {
        this.isRunning = false;
        Debug.log('Game stopped');
    }
}

// Make GameCore available globally
window.GameCore = GameCore;