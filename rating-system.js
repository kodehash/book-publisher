// Rating System for Book Publisher
class RatingSystem {
    constructor() {
        this.ratings = this.loadRatings();
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateAllRatings();
    }

    bindEvents() {
        // Star click events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('star')) {
                const storyId = e.target.closest('.stars').dataset.story;
                const rating = parseInt(e.target.dataset.rating);
                this.rateStory(storyId, rating);
            }
        });

        // Star hover events
        document.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('star')) {
                const stars = e.target.closest('.stars');
                const rating = parseInt(e.target.dataset.rating);
                this.highlightStars(stars, rating);
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('star')) {
                const stars = e.target.closest('.stars');
                const storyId = stars.dataset.story;
                this.updateStars(stars, this.getAverageRating(storyId));
            }
        });
    }

    rateStory(storyId, rating) {
        if (!this.ratings[storyId]) {
            this.ratings[storyId] = [];
        }
        
        // Check if user already rated (using a simple identifier)
        const userId = this.getUserId();
        const existingRatingIndex = this.ratings[storyId].findIndex(r => r.userId === userId);
        
        if (existingRatingIndex >= 0) {
            this.ratings[storyId][existingRatingIndex].rating = rating;
        } else {
            this.ratings[storyId].push({ userId, rating, timestamp: Date.now() });
        }
        
        this.saveRatings();
        this.updateRating(storyId);
        this.showThankYouMessage();
    }

    getUserId() {
        let userId = localStorage.getItem('rating_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('rating_user_id', userId);
        }
        return userId;
    }

    getAverageRating(storyId) {
        if (!this.ratings[storyId] || this.ratings[storyId].length === 0) {
            return 0;
        }
        
        const sum = this.ratings[storyId].reduce((acc, rating) => acc + rating.rating, 0);
        return sum / this.ratings[storyId].length;
    }

    getRatingCount(storyId) {
        return this.ratings[storyId] ? this.ratings[storyId].length : 0;
    }

    updateStars(stars, rating) {
        const starElements = stars.querySelectorAll('.star');
        starElements.forEach((star, index) => {
            if (index < Math.floor(rating)) {
                star.classList.add('active');
            } else if (index < rating) {
                star.classList.add('half');
            } else {
                star.classList.remove('active', 'half');
            }
        });
    }

    highlightStars(stars, rating) {
        const starElements = stars.querySelectorAll('.star');
        starElements.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('hover');
            } else {
                star.classList.remove('hover');
            }
        });
    }

    updateRating(storyId) {
        const averageRating = this.getAverageRating(storyId);
        const ratingCount = this.getRatingCount(storyId);
        
        // Update all rating displays for this story
        const ratingElements = document.querySelectorAll(`[data-story="${storyId}"]`);
        ratingElements.forEach(stars => {
            this.updateStars(stars, averageRating);
        });
        
        // Update rating text
        const ratingTexts = document.querySelectorAll(`[data-story="${storyId}"]`).forEach(stars => {
            const ratingText = stars.parentElement.querySelector('.rating-text');
            const ratingCountSpan = stars.parentElement.querySelector('.rating-count');
            
            if (ratingText) {
                if (ratingCount > 0) {
                    ratingText.textContent = `${averageRating.toFixed(1)}/5`;
                } else {
                    ratingText.textContent = 'Rate this story';
                }
            }
            
            if (ratingCountSpan) {
                ratingCountSpan.textContent = `(${ratingCount} rating${ratingCount !== 1 ? 's' : ''})`;
            }
        });
    }

    updateAllRatings() {
        const allStories = Object.keys(this.ratings);
        allStories.forEach(storyId => {
            this.updateRating(storyId);
        });
    }

    showThankYouMessage() {
        // Create a simple thank you message
        const message = document.createElement('div');
        message.className = 'rating-thank-you';
        message.textContent = 'Thank you for your rating!';
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            font-size: 14px;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    loadRatings() {
        try {
            const saved = localStorage.getItem('story_ratings');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    }

    saveRatings() {
        try {
            localStorage.setItem('story_ratings', JSON.stringify(this.ratings));
        } catch (e) {
            console.error('Failed to save ratings:', e);
        }
    }

    // Method to get ratings for external use
    getRatings() {
        return this.ratings;
    }

    // Method to export ratings (for admin use)
    exportRatings() {
        return JSON.stringify(this.ratings, null, 2);
    }
}

// Initialize the rating system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ratingSystem = new RatingSystem();
});
