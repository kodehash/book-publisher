// Firebase Rating and Review System for Book Publisher
class FirebaseRatingSystem {
    constructor() {
        this.db = window.firebaseDb;
        this.collection = window.firebaseCollection;
        this.addDoc = window.firebaseAddDoc;
        this.getDocs = window.firebaseGetDocs;
        this.query = window.firebaseQuery;
        this.where = window.firebaseWhere;
        this.orderBy = window.firebaseOrderBy;
        this.limit = window.firebaseLimit;
        
        this.ratings = {};
        this.reviews = {};
        this.init();
    }

    async init() {
        await this.loadAllRatings();
        await this.loadAllReviews();
        this.bindEvents();
        this.updateAllRatings();
        
        // Special initialization for reviews page
        if (window.location.pathname.includes('reviews.html')) {
            this.initializeReviewsPage();
        }
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
                // Clear all hover effects
                stars.querySelectorAll('.star').forEach(star => {
                    star.classList.remove('hover');
                });
                // Update to show actual rating
                this.updateStars(stars, this.getAverageRating(storyId));
            }
        });

        // Also handle mouse leave on the stars container
        document.addEventListener('mouseleave', (e) => {
            if (e.target.classList.contains('stars')) {
                const storyId = e.target.dataset.story;
                // Clear all hover effects
                e.target.querySelectorAll('.star').forEach(star => {
                    star.classList.remove('hover');
                });
                // Update to show actual rating
                this.updateStars(e.target, this.getAverageRating(storyId));
            }
        });

        // Review form submission
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('review-form')) {
                e.preventDefault();
                const storyId = e.target.dataset.story;
                const reviewText = e.target.querySelector('.review-text').value;
                const userName = e.target.querySelector('.reviewer-name').value;
                this.submitReview(storyId, reviewText, userName);
            }
        });
    }

    async rateStory(storyId, rating) {
        try {
            const userId = this.getUserId();
            const ratingData = {
                storyId: storyId,
                userId: userId,
                rating: rating,
                timestamp: new Date(),
                userAgent: navigator.userAgent
            };

            // Add rating to Firebase
            await this.addDoc(this.collection(this.db, 'ratings'), ratingData);
            
            // Update local cache
            if (!this.ratings[storyId]) {
                this.ratings[storyId] = [];
            }
            this.ratings[storyId].push(ratingData);
            
            this.updateRating(storyId);
            this.showThankYouMessage('Thank you for your rating!');
        } catch (error) {
            console.error('Error rating story:', error);
            this.showErrorMessage('Failed to submit rating. Please try again.');
        }
    }

    async submitReview(storyId, reviewText, userName) {
        if (!reviewText.trim() || !userName.trim()) {
            this.showErrorMessage('Please fill in both name and review.');
            return;
        }

        try {
            const reviewData = {
                storyId: storyId,
                userName: userName.trim(),
                reviewText: reviewText.trim(),
                timestamp: new Date(),
                userAgent: navigator.userAgent
            };

            // Add review to Firebase
            await this.addDoc(this.collection(this.db, 'reviews'), reviewData);
            
            // Update local cache
            if (!this.reviews[storyId]) {
                this.reviews[storyId] = [];
            }
            this.reviews[storyId].push(reviewData);
            
            // Clear form
            const form = document.querySelector(`.review-form[data-story="${storyId}"]`);
            if (form) {
                form.reset();
            }
            
            this.updateReviews(storyId);
            this.showThankYouMessage('Thank you for your review!');
        } catch (error) {
            console.error('Error submitting review:', error);
            this.showErrorMessage('Failed to submit review. Please try again.');
        }
    }

    async loadAllRatings() {
        try {
            const ratingsSnapshot = await this.getDocs(this.collection(this.db, 'ratings'));
            this.ratings = {};
            
            ratingsSnapshot.forEach((doc) => {
                const data = doc.data();
                if (!this.ratings[data.storyId]) {
                    this.ratings[data.storyId] = [];
                }
                this.ratings[data.storyId].push(data);
            });
        } catch (error) {
            console.error('Error loading ratings:', error);
        }
    }

    async loadAllReviews() {
        try {
            const reviewsSnapshot = await this.getDocs(this.collection(this.db, 'reviews'));
            this.reviews = {};
            
            reviewsSnapshot.forEach((doc) => {
                const data = doc.data();
                if (!this.reviews[data.storyId]) {
                    this.reviews[data.storyId] = [];
                }
                this.reviews[data.storyId].push(data);
            });
        } catch (error) {
            console.error('Error loading reviews:', error);
        }
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

    getReviews(storyId) {
        return this.reviews[storyId] || [];
    }

    updateStars(stars, rating) {
        if (!stars) return;
        
        const starElements = stars.querySelectorAll('.star');
        starElements.forEach((star, index) => {
            // Remove all classes first
            star.classList.remove('active', 'half', 'hover');
            
            // Add appropriate class based on rating
            if (index < Math.floor(rating)) {
                star.classList.add('active');
            } else if (index < rating) {
                star.classList.add('half');
            }
        });
    }

    highlightStars(stars, rating) {
        const starElements = stars.querySelectorAll('.star');
        starElements.forEach((star, index) => {
            // Remove all hover classes first
            star.classList.remove('hover');
            // Add hover class only to stars up to the rating
            if (index < rating) {
                star.classList.add('hover');
            }
        });
    }

    updateRating(storyId) {
        const averageRating = this.getAverageRating(storyId);
        const ratingCount = this.getRatingCount(storyId);
        const reviewCount = this.getReviews(storyId).length;
        
        // Update all rating displays for this story
        const ratingElements = document.querySelectorAll(`[data-story="${storyId}"]`);
        ratingElements.forEach(stars => {
            this.updateStars(stars, averageRating);
        });
        
        // Update rating text
        const ratingTexts = document.querySelectorAll(`[data-story="${storyId}"]`).forEach(stars => {
            const ratingText = stars.parentElement.querySelector('.rating-text');
            const ratingCountSpan = stars.parentElement.querySelector('.rating-count');
            const reviewsCountSpan = stars.parentElement.querySelector('.reviews-count');
            
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
            
            if (reviewsCountSpan) {
                reviewsCountSpan.textContent = `${reviewCount} review${reviewCount !== 1 ? 's' : ''}`;
            }
        });
        
        // Update reviews page elements
        this.updateReviewsPage(storyId);
    }

    updateReviews(storyId) {
        const reviews = this.getReviews(storyId);
        
        // Update reviews on chapter pages (if they exist)
        const chapterReviewsContainer = document.querySelector(`[data-story="${storyId}"]`)?.closest('.review-section')?.querySelector('.reviews-list');
        if (chapterReviewsContainer) {
            chapterReviewsContainer.innerHTML = '';
            reviews.slice(0, 5).forEach(review => {
                const reviewElement = document.createElement('div');
                reviewElement.className = 'review-item';
                reviewElement.innerHTML = `
                    <div class="review-header">
                        <strong>${review.userName}</strong>
                        <span class="review-date">${new Date(review.timestamp.seconds * 1000).toLocaleDateString()}</span>
                    </div>
                    <div class="review-content">${review.reviewText}</div>
                `;
                chapterReviewsContainer.appendChild(reviewElement);
            });
        }
        
        // Update reviews on reviews page
        this.updateReviewsPage(storyId);
    }

    updateReviewsPage(storyId) {
        const averageRating = this.getAverageRating(storyId);
        const ratingCount = this.getRatingCount(storyId);
        const reviews = this.getReviews(storyId);
        
        // Update rating summary (only on reviews page)
        const averageRatingElement = document.getElementById('average-rating');
        const ratingCountElement = document.getElementById('rating-count');
        const storyRatingStars = document.getElementById('story-rating-stars');
        
        if (averageRatingElement) {
            averageRatingElement.textContent = averageRating.toFixed(1);
        }
        
        if (ratingCountElement) {
            ratingCountElement.textContent = `(${ratingCount} rating${ratingCount !== 1 ? 's' : ''})`;
        }
        
        if (storyRatingStars) {
            console.log('Updating stars on reviews page:', averageRating);
            this.updateStars(storyRatingStars, averageRating);
            // Also make sure the stars are visible
            storyRatingStars.style.display = 'flex';
        } else {
            console.log('Story rating stars element not found on reviews page');
        }
        
        // Update reviews list (only on reviews page)
        const reviewsList = document.getElementById('reviews-list');
        if (reviewsList) {
            if (reviews.length === 0) {
                reviewsList.innerHTML = '<div class="loading-message"><p>No reviews yet. Be the first to write one!</p></div>';
            } else {
                reviewsList.innerHTML = '';
                reviews.forEach(review => {
                    const reviewElement = document.createElement('div');
                    reviewElement.className = 'review-item';
                    reviewElement.innerHTML = `
                        <div class="review-header">
                            <strong>${review.userName}</strong>
                            <span class="review-date">${new Date(review.timestamp.seconds * 1000).toLocaleDateString()}</span>
                        </div>
                        <div class="review-content">${review.reviewText}</div>
                    `;
                    reviewsList.appendChild(reviewElement);
                });
            }
        }
    }

    updateAllRatings() {
        const allStories = Object.keys(this.ratings);
        allStories.forEach(storyId => {
            this.updateRating(storyId);
        });
    }

    initializeReviewsPage() {
        console.log('Initializing reviews page...');
        
        // Get story ID from URL or default to saraswati
        const urlParams = new URLSearchParams(window.location.search);
        const storyId = urlParams.get('story') || 'saraswati';
        
        console.log('Story ID:', storyId);
        console.log('Ratings data:', this.ratings);
        console.log('Reviews data:', this.reviews);
        
        // Update the reviews page for this story
        this.updateReviewsPage(storyId);
        
        // Also update the rating display
        this.updateRating(storyId);
        
        // Force update stars after a short delay to ensure DOM is ready
        setTimeout(() => {
            const storyRatingStars = document.getElementById('story-rating-stars');
            if (storyRatingStars) {
                console.log('Forcing star update...');
                const averageRating = this.getAverageRating(storyId);
                this.updateStars(storyRatingStars, averageRating);
            }
        }, 100);
    }

    getUserId() {
        let userId = localStorage.getItem('rating_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('rating_user_id', userId);
        }
        return userId;
    }

    showThankYouMessage(message) {
        this.showMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `rating-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            font-size: 14px;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Initialize the Firebase rating system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, checking Firebase...');
    
    // Wait for Firebase to load
    if (window.firebaseDb) {
        console.log('Firebase loaded successfully!');
        window.firebaseRatingSystem = new FirebaseRatingSystem();
    } else {
        console.error('Firebase not loaded. Please check your Firebase configuration.');
        console.log('Make sure you have:');
        console.log('1. Created a Firebase project');
        console.log('2. Updated firebase-config.js with your actual config values');
        console.log('3. Enabled Firestore Database in your Firebase project');
        
        // Fallback to local storage system
        console.log('Falling back to local storage system...');
        if (typeof RatingSystem !== 'undefined') {
            window.ratingSystem = new RatingSystem();
        } else {
            // Load local storage system as fallback
            const script = document.createElement('script');
            script.src = 'rating-system.js';
            script.onload = () => {
                console.log('Local storage system loaded');
                window.ratingSystem = new RatingSystem();
            };
            script.onerror = () => {
                console.error('Failed to load local storage system');
            };
            document.head.appendChild(script);
        }
    }
});
