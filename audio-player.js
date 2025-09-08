class AudioBookPlayer {
    constructor(audioElement, controlsContainer) {
        this.audio = audioElement;
        this.container = controlsContainer;
        this.isPlaying = false;
        this.currentSpeed = 1;
        this.isMuted = false;
        this.previousVolume = 1;
        
        this.initializeControls();
        this.bindEvents();
        this.updateDisplay();
    }
    
    initializeControls() {
        // Create control elements
        this.playPauseBtn = this.container.querySelector('.play-pause-btn');
        this.stopBtn = this.container.querySelector('.stop-btn');
        this.progressBar = this.container.querySelector('.progress-bar-container');
        this.progressFill = this.container.querySelector('.progress-bar-fill');
        this.currentTime = this.container.querySelector('.current-time');
        this.totalTime = this.container.querySelector('.total-time');
        this.speedSelect = this.container.querySelector('.speed-select');
        this.volumeSlider = this.container.querySelector('.volume-slider');
        this.muteBtn = this.container.querySelector('.mute-btn');
        
        // Set initial values
        this.volumeSlider.value = 100;
        this.speedSelect.value = '1';
    }
    
    bindEvents() {
        // Play/Pause button
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        
        // Stop button
        this.stopBtn.addEventListener('click', () => this.stop());
        
        // Progress bar
        this.progressBar.addEventListener('click', (e) => this.seek(e));
        
        // Speed control
        this.speedSelect.addEventListener('change', (e) => this.changeSpeed(e.target.value));
        
        // Volume control
        this.volumeSlider.addEventListener('input', (e) => this.changeVolume(e.target.value / 100));
        
        // Mute button
        this.muteBtn.addEventListener('click', () => this.toggleMute());
        
        // Audio events
        this.audio.addEventListener('loadedmetadata', () => this.updateDisplay());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.onEnded());
        this.audio.addEventListener('play', () => this.onPlay());
        this.audio.addEventListener('pause', () => this.onPause());
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.audio.play();
        this.isPlaying = true;
        this.updatePlayPauseButton();
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayPauseButton();
    }
    
    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
        this.updatePlayPauseButton();
        this.updateProgress();
    }
    
    seek(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const progressWidth = rect.width;
        const seekTime = (clickX / progressWidth) * this.audio.duration;
        
        this.audio.currentTime = seekTime;
    }
    
    changeSpeed(speed) {
        this.currentSpeed = parseFloat(speed);
        this.audio.playbackRate = this.currentSpeed;
    }
    
    changeVolume(volume) {
        this.audio.volume = volume;
        this.previousVolume = volume;
        
        if (volume === 0) {
            this.isMuted = true;
            this.updateMuteButton();
        } else {
            this.isMuted = false;
            this.updateMuteButton();
        }
    }
    
    toggleMute() {
        if (this.isMuted) {
            this.audio.volume = this.previousVolume;
            this.volumeSlider.value = this.previousVolume * 100;
            this.isMuted = false;
        } else {
            this.previousVolume = this.audio.volume;
            this.audio.volume = 0;
            this.volumeSlider.value = 0;
            this.isMuted = true;
        }
        this.updateMuteButton();
    }
    
    updateProgress() {
        if (this.audio.duration) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressFill.style.width = progress + '%';
            
            // Update time display
            this.currentTime.textContent = this.formatTime(this.audio.currentTime);
        }
    }
    
    updateDisplay() {
        if (this.audio.duration) {
            this.totalTime.textContent = this.formatTime(this.audio.duration);
        }
    }
    
    updatePlayPauseButton() {
        if (this.isPlaying) {
            this.playPauseBtn.innerHTML = '⏸️';
            this.playPauseBtn.setAttribute('aria-label', 'Pause audio');
        } else {
            this.playPauseBtn.innerHTML = '▶️';
            this.playPauseBtn.setAttribute('aria-label', 'Play audio');
        }
    }
    
    updateMuteButton() {
        if (this.isMuted) {
            this.muteBtn.innerHTML = '🔇';
            this.muteBtn.setAttribute('aria-label', 'Unmute audio');
        } else {
            this.muteBtn.innerHTML = '🔊';
            this.muteBtn.setAttribute('aria-label', 'Mute audio');
        }
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    onPlay() {
        this.isPlaying = true;
        this.updatePlayPauseButton();
    }
    
    onPause() {
        this.isPlaying = false;
        this.updatePlayPauseButton();
    }
    
    onEnded() {
        this.isPlaying = false;
        this.updatePlayPauseButton();
        this.updateProgress();
    }
}

// Initialize audio players when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const audioPlayers = document.querySelectorAll('.audio-player-container');
    
    audioPlayers.forEach(container => {
        const audio = container.querySelector('audio');
        if (audio) {
            new AudioBookPlayer(audio, container);
        }
    });
});

