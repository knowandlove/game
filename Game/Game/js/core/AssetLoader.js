// Asset Loading System
const AssetLoader = {
    images: new Map(),
    sounds: new Map(),
    loadingProgress: 0,
    totalAssets: 0,
    loadedAssets: 0,
    
    async loadAllAssets() {
        Debug.log('Starting asset loading...');
        this.totalAssets = Object.keys(GAME_CONFIG.ASSETS.IMAGES).length;
        this.loadedAssets = 0;
        this.loadingProgress = 0;
        
        const imagePromises = Object.entries(GAME_CONFIG.ASSETS.IMAGES).map(([key, src]) => 
            this.loadImage(key, src)
        );
        
        await Promise.all(imagePromises);
        Debug.log('All assets loaded successfully');
        return true;
    },
    
    async loadImage(key, src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.images.set(key, img);
                this.loadedAssets++;
                this.loadingProgress = (this.loadedAssets / this.totalAssets) * 100;
                this.updateLoadingBar();
                Debug.log(`Loaded image: ${key}`);
                resolve(img);
            };
            img.onerror = () => {
                Debug.log(`Failed to load image: ${key}`);
                reject(new Error(`Failed to load image: ${key}`));
            };
            img.src = src;
        });
    },
    
    updateLoadingBar() {
        const progressBar = document.getElementById('loading-progress');
        if (progressBar) {
            progressBar.style.width = `${this.loadingProgress}%`;
        }
    },
    
    getImage(key) {
        return this.images.get(key);
    }
};

// Make AssetLoader globally available
window.AssetLoader = AssetLoader;