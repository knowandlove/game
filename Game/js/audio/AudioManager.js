// Audio Manager
const AudioManager = {
    audioContext: null,
    enabled: false,
    sounds: new Map(),
    
    async initialize() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            await this.createTestBeep();
            this.enabled = true;
            Debug.log('Audio system initialized');
            return true;
        } catch (error) {
            Debug.log('Audio initialization failed:', error);
            return false;
        }
    },
    
    async createTestBeep() {
        const duration = 0.2;
        const frequency = 440;
        const sampleRate = this.audioContext.sampleRate;
        const frameCount = sampleRate * duration;
        const audioBuffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        
        for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate;
            channelData[i] = Math.sin(2 * Math.PI * frequency * t) * 0.1;
        }
        
        this.sounds.set('test-beep', audioBuffer);
        Debug.log('Test beep sound created');
    },
    
    playSound(soundKey) {
        if (!this.enabled || !this.audioContext) {
            Debug.log('Audio not enabled, cannot play sound');
            return;
        }
        
        const audioBuffer = this.sounds.get(soundKey);
        if (!audioBuffer) {
            Debug.log(`Sound not found: ${soundKey}`);
            return;
        }
        
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.audioContext.destination);
        source.start();
        Debug.log(`Playing sound: ${soundKey}`);
    },
    
    async resumeContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
            Debug.log('Audio context resumed');
        }
    }
};

// Make AudioManager globally available
window.AudioManager = AudioManager;