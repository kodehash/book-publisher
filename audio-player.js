class AudioBookPlayer {
    constructor(audioElement, controlsContainer) {
        this.audio = audioElement;
        this.container = controlsContainer;
        this.isPlaying = false;
        this.currentSpeed = 1;
        this.isMuted = false;
        this.previousVolume = 1;
        this.isSeeking = false;
        
        this.initializeControls();
        this.bindEvents();
        this.updateDisplay();
    }
    
    initializeControls() {
        // Create control elements
        this.playPauseBtn = this.container.querySelector('.play-pause-btn');
        this.progressBar = this.container.querySelector('.progress-bar-container');
        this.progressFill = this.container.querySelector('.progress-bar-fill');
        this.currentTime = this.container.querySelector('.current-time');
        this.totalTime = this.container.querySelector('.total-time');
        this.speedSelect = this.container.querySelector('.speed-select');
        this.volumeSlider = this.container.querySelector('.volume-slider');
        this.muteBtn = this.container.querySelector('.mute-btn');
        this.prevBtn = this.container.querySelector('.audio-prev-btn');
        this.nextBtn = this.container.querySelector('.audio-next-btn');
        
        // Set initial values
        this.volumeSlider.value = 100;
        this.speedSelect.value = '1';
    }
    
    bindEvents() {
        // Play/Pause button
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.navigateToChapter('prev'));
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.navigateToChapter('next'));
        }
        
        // Progress bar
        this.progressBar.addEventListener('click', (e) => this.seek(e));
        this.progressBar.addEventListener('mousedown', (e) => this.startSeek(e));
        this.progressBar.addEventListener('mousemove', (e) => this.updateSeek(e));
        this.progressBar.addEventListener('mouseup', (e) => this.endSeek(e));
        this.progressBar.addEventListener('mouseleave', (e) => this.endSeek(e));
        
        // Touch events for mobile
        this.progressBar.addEventListener('touchstart', (e) => this.startSeek(e));
        this.progressBar.addEventListener('touchmove', (e) => this.updateSeek(e));
        this.progressBar.addEventListener('touchend', (e) => this.endSeek(e));
        
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
    
    
    seek(e) {
        if (!this.audio.duration) return;
        
        const rect = this.progressBar.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const clickX = clientX - rect.left;
        const progressWidth = rect.width;
        const seekTime = (clickX / progressWidth) * this.audio.duration;
        
        // Ensure seek time is within bounds
        const clampedTime = Math.max(0, Math.min(seekTime, this.audio.duration));
        this.audio.currentTime = clampedTime;
    }
    
    startSeek(e) {
        e.preventDefault();
        this.isSeeking = true;
        this.seek(e);
    }
    
    updateSeek(e) {
        if (!this.isSeeking) return;
        e.preventDefault();
        this.seek(e);
    }
    
    endSeek(e) {
        this.isSeeking = false;
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
    
    navigateToChapter(direction) {
        const button = direction === 'prev' ? this.prevBtn : this.nextBtn;
        const url = button.getAttribute('data-url');
        
        if (url && !button.disabled) {
            // Navigate to the new chapter
            window.location.href = url;
        }
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

