// Global variables
let currentSlide = 0;
const totalSlides = 10; // Now we have 10 slides including img9
let musicPlaying = false;
let isTransitioning = false;
let autoAdvanceEnabled = false;
let autoAdvanceInterval;
let swipeCount = 0; // Track swipe interactions

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting initialization...');
    
    // Show loading screen initially
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }
    
    // Initialize app after a short delay to show loading
    setTimeout(() => {
        initializeApp();
        setupEventListeners();
        createFloatingHearts();
        
        // Hide loading screen after initialization
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 1000);
            }
        }, 2000);
        
        // Try to play music after loading
        setTimeout(() => {
            playMusic();
        }, 2500);
    }, 1000);
});

// Main initialization function
function initializeApp() {
    updateSlideCounter();
    updateProgressBar();
    updateNavigationButtons();
    setupVolumeControl();
    setupKeyboardNavigation();
    enhanceSlideTransition();
    addHoverEffects();
    optimizePerformance();
    improveAccessibility();
    
    // Make functions globally accessible for debugging
    window.changeSlide = changeSlide;
    window.toggleMusic = toggleMusic;
    window.toggleAutoAdvance = toggleAutoAdvance;
    
    console.log('All functions loaded and ready!');
    
    // Add debug info for mobile
    if (window.innerWidth <= 768) {
        console.log('Mobile device detected');
        console.log('Touch events should be working');
        console.log('Try swiping left/right on the screen');
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Enhanced touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartTime = 0;

    // Prevent default touch behaviors that might interfere
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        touchStartTime = Date.now();
        console.log('Touch start:', touchStartX, touchStartY);
    }, { passive: false });

    document.addEventListener('touchmove', function(e) {
        // Prevent scrolling during swipe detection
        const diffX = Math.abs(e.changedTouches[0].screenX - touchStartX);
        const diffY = Math.abs(e.changedTouches[0].screenY - touchStartY);
        
        if (diffX > diffY && diffX > 10) {
            e.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - touchStartTime;
        
        console.log('Touch end:', touchEndX, touchEndY, 'Duration:', touchDuration);
        handleSwipe(touchDuration);
    }, { passive: false });
    
    // Fallback for mouse events on mobile (some browsers handle this differently)
    let mouseStartX = 0;
    let mouseStartY = 0;
    let mouseStartTime = 0;
    
    document.addEventListener('mousedown', function(e) {
        mouseStartX = e.clientX;
        mouseStartY = e.clientY;
        mouseStartTime = Date.now();
        console.log('Mouse down:', mouseStartX, mouseStartY);
    });
    
    document.addEventListener('mouseup', function(e) {
        const mouseEndX = e.clientX;
        const mouseEndY = e.clientY;
        const mouseEndTime = Date.now();
        const mouseDuration = mouseEndTime - mouseStartTime;
        
        // Only handle if it's a quick mouse movement (like a swipe)
        if (mouseDuration < 300) {
            console.log('Mouse up:', mouseEndX, mouseEndY, 'Duration:', mouseDuration);
            handleMouseSwipe(mouseStartX, mouseEndX, mouseStartY, mouseEndY, mouseDuration);
        }
    });
    
    // Double-click to fullscreen
    document.addEventListener('dblclick', function(e) {
        if (e.target.closest('.left-panel')) {
            toggleFullscreen();
        }
    });
    
    // Add click particle effects
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('nav-btn') || e.target.classList.contains('music-control')) {
            addParticleEffect(e.clientX, e.clientY);
        }
    });
}

// Slide navigation functions
function changeSlide(direction) {
    console.log('changeSlide called with direction:', direction);
    
    if (isTransitioning) {
        console.log('Transition in progress, ignoring click');
        return;
    }
    
    isTransitioning = true;
    const slides = document.querySelectorAll('.left-panel .slide');
    const poems = document.querySelectorAll('.poem-content');
    const transition = document.getElementById('slideTransition');
    
    console.log('Current slide:', currentSlide, 'Total slides:', totalSlides);
    
    // Show transition overlay
    if (transition) {
        transition.classList.add('active');
    }
    
    // Add fade-out classes
    if (slides[currentSlide]) {
        slides[currentSlide].classList.add('fade-out');
    }
    if (poems[currentSlide]) {
        poems[currentSlide].classList.add('fade-out');
    }
    
    setTimeout(() => {
        // Hide current slide and poem
        if (slides[currentSlide]) {
            slides[currentSlide].classList.remove('active', 'fade-out');
        }
        if (poems[currentSlide]) {
            poems[currentSlide].classList.remove('active', 'fade-out');
        }
        
        // Calculate new slide index
        currentSlide += direction;
        
        // Wrap around if needed
        if (currentSlide >= totalSlides) {
            currentSlide = 0;
        } else if (currentSlide < 0) {
            currentSlide = totalSlides - 1;
        }
        
        console.log('New slide:', currentSlide);
        
        // Show new slide and poem
        if (slides[currentSlide]) {
            slides[currentSlide].classList.add('active');
        }
        if (poems[currentSlide]) {
            poems[currentSlide].classList.add('active');
        }
        
        updateSlideCounter();
        updateProgressBar();
        updateNavigationButtons();
        
        // Hide transition overlay
        setTimeout(() => {
            if (transition) {
                transition.classList.remove('active');
            }
            isTransitioning = false;
        }, 300);
    }, 600);
}

function updateSlideCounter() {
    const counter = document.getElementById('slideCounter');
    if (!counter) return;
    
    counter.style.transform = 'translateX(100px)';
    counter.style.opacity = '0';
    
    setTimeout(() => {
        counter.textContent = `${currentSlide + 1} / ${totalSlides}`;
        counter.style.transform = 'translateX(0)';
        counter.style.opacity = '1';
    }, 200);
}

function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;
    
    const progress = ((currentSlide + 1) / totalSlides) * 100;
    progressBar.style.width = progress + '%';
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!prevBtn || !nextBtn) return;
    
    // Always enable both buttons for infinite loop
    prevBtn.disabled = false;
    nextBtn.disabled = false;
    
    // Add ripple effect (only add once)
    if (!prevBtn.hasAttribute('data-ripple-added')) {
        [prevBtn, nextBtn].forEach(btn => {
            btn.setAttribute('data-ripple-added', 'true');
            btn.addEventListener('click', function(e) {
                if (isTransitioning) return;
                
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.6);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
}

// Music control functions
function toggleMusic() {
    console.log('toggleMusic called');
    const music = document.getElementById('backgroundMusic');
    const musicBtn = document.getElementById('musicBtn');
    
    if (!music) {
        console.log('Music element not found');
        return;
    }
    
    if (musicPlaying) {
        music.pause();
        if (musicBtn) {
            musicBtn.textContent = '♪';
            musicBtn.style.opacity = '0.6';
        }
        musicPlaying = false;
        console.log('Music paused');
    } else {
        music.play().catch(e => {
            console.log('Music play failed:', e);
        });
        if (musicBtn) {
            musicBtn.textContent = '♫';
            musicBtn.style.opacity = '1';
        }
        musicPlaying = true;
        console.log('Music playing');
    }
}

function playMusic() {
    const music = document.getElementById('backgroundMusic');
    const musicBtn = document.getElementById('musicBtn');
    
    if (!music) {
        console.log('Music element not found');
        return;
    }
    
    // Set volume to a reasonable level
    music.volume = 0.3;
    
    // Try to play music with user interaction
    const playPromise = music.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log('Music started playing successfully');
            if (musicBtn) {
                musicBtn.textContent = '♫';
                musicBtn.style.opacity = '1';
            }
            musicPlaying = true;
        }).catch(e => {
            console.log('Autoplay failed:', e);
            if (musicBtn) {
                musicBtn.textContent = '♪';
                musicBtn.style.opacity = '0.6';
            }
            musicPlaying = false;
            
            // Add click to play functionality
            document.addEventListener('click', function startMusic() {
                music.play().then(() => {
                    console.log('Music started on user interaction');
                    if (musicBtn) {
                        musicBtn.textContent = '♫';
                        musicBtn.style.opacity = '1';
                    }
                    musicPlaying = true;
                }).catch(e => {
                    console.log('Music play failed on user interaction:', e);
                });
                document.removeEventListener('click', startMusic);
            }, { once: true });
        });
    }
}

function setupVolumeControl() {
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeInfo = document.getElementById('volumeInfo');
    const music = document.getElementById('backgroundMusic');
    
    if (!volumeSlider || !music) return;
    
    // Set initial volume
    music.volume = 0.5;
    
    volumeSlider.addEventListener('input', function() {
        const volume = this.value / 100;
        music.volume = volume;
        if (volumeInfo) {
            volumeInfo.textContent = this.value + '%';
        }
        
        // Add visual feedback
        this.style.background = `linear-gradient(to right, #8b4513 0%, #8b4513 ${this.value}%, rgba(255,255,255,0.3) ${this.value}%, rgba(255,255,255,0.3) 100%)`;
    });
    
    // Initialize slider appearance
    volumeSlider.dispatchEvent(new Event('input'));
}

// Auto advance functionality
function toggleAutoAdvance() {
    console.log('toggleAutoAdvance called');
    const autoBtn = document.getElementById('autoAdvance');
    
    if (!autoBtn) {
        console.log('Auto advance button not found');
        return;
    }
    
    if (autoAdvanceEnabled) {
        clearInterval(autoAdvanceInterval);
        autoAdvanceEnabled = false;
        autoBtn.textContent = 'Auto: OFF';
        autoBtn.classList.remove('active');
        console.log('Auto advance disabled');
    } else {
        autoAdvanceEnabled = true;
        autoBtn.textContent = 'Auto: ON';
        autoBtn.classList.add('active');
        
        autoAdvanceInterval = setInterval(() => {
            if (!isTransitioning) {
                changeSlide(1);
            }
        }, 5000); // 5 seconds per slide
        console.log('Auto advance enabled');
    }
}

// Visual effects
function createFloatingHearts() {
    const heartsContainer = document.getElementById('floatingHearts');
    if (!heartsContainer) return;
    
    const heartSymbols = ['♥', '♡', '💕', '💖', '💝'];
    
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 2 + 's';
        heart.style.animationDuration = (Math.random() * 8 + 8) + 's';
        heart.style.fontSize = (Math.random() * 10 + 12) + 'px';
        
        heartsContainer.appendChild(heart);
        
        // Remove heart after animation
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 16000);
    }
    
    // Create hearts periodically
    setInterval(createHeart, 3000);
    
    // Create initial hearts
    for (let i = 0; i < 5; i++) {
        setTimeout(createHeart, i * 1000);
    }
}

function addParticleEffect(x, y) {
    const colors = ['#8b4513', '#d4c4a8', '#f8f4ed', '#e8ddc7'];
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 9999;
            animation: particle-burst 0.8s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
        `;
        
        const angle = (Math.PI * 2 * i) / 8;
        const distance = Math.random() * 50 + 30;
        
        particle.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
        particle.style.setProperty('--dy', Math.sin(angle) * distance + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 800);
    }
}

// Enhanced slide transition effects
function enhanceSlideTransition() {
    const slides = document.querySelectorAll('.left-panel .slide');
    const poems = document.querySelectorAll('.poem-content');
    
    slides.forEach((slide, index) => {
        slide.addEventListener('transitionend', function() {
            if (this.classList.contains('active')) {
                // Add entrance animation
                this.style.transform = 'scale(1) rotate(0deg)';
                this.style.filter = 'brightness(1.1) saturate(1.2)';
                
                setTimeout(() => {
                    this.style.filter = 'sepia(5%) saturate(1.1) brightness(1.05)';
                }, 500);
            }
        });
    });
    
    poems.forEach((poem, index) => {
        poem.addEventListener('transitionend', function() {
            if (this.classList.contains('active')) {
                // Add text animation
                const elements = this.querySelectorAll('.dedication, .bengali-text, .bengali-verse, .ending-content');
                elements.forEach((el, i) => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)';
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, i * 200);
                });
            }
        });
    });
}

// Hover effects
function addHoverEffects() {
    const slides = document.querySelectorAll('.left-panel .slide');
    
    slides.forEach(slide => {
        slide.addEventListener('mouseenter', function() {
            if (this.classList.contains('active')) {
                this.style.transform = 'scale(1.02)';
                this.style.transition = 'transform 0.3s ease';
            }
        });
        
        slide.addEventListener('mouseleave', function() {
            if (this.classList.contains('active')) {
                this.style.transform = 'scale(1)';
            }
        });
    });
}

// Enhanced touch/swipe handling
function handleSwipe(touchDuration = 0) {
    if (isTransitioning) {
        console.log('Swipe ignored - transition in progress');
        return;
    }
    
    const swipeThreshold = 30; // Even more responsive
    const maxTouchDuration = 500; // Maximum touch duration for swipe
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    console.log('Swipe analysis:', {
        diffX: diffX,
        diffY: diffY,
        threshold: swipeThreshold,
        duration: touchDuration,
        isHorizontal: Math.abs(diffX) > Math.abs(diffY)
    });
    
    // Only handle horizontal swipes with reasonable duration
    if (Math.abs(diffX) > swipeThreshold && 
        Math.abs(diffX) > Math.abs(diffY) && 
        touchDuration < maxTouchDuration) {
        
        console.log('Valid swipe detected!');
        
        // Add visual feedback
        const container = document.querySelector('.container');
        if (container) {
            container.style.transform = 'scale(0.98)';
            container.style.transition = 'transform 0.2s ease';
            setTimeout(() => {
                container.style.transform = 'scale(1)';
            }, 200);
        }
        
        if (diffX > 0) {
            console.log('Swiping left - going to next slide');
            changeSlide(1); // Swipe left, go to next
        } else {
            console.log('Swiping right - going to previous slide');
            changeSlide(-1); // Swipe right, go to previous
        }
        
        // Hide swipe hint after 3 swipes
        swipeCount++;
        if (swipeCount >= 3) {
            const swipeHint = document.querySelector('.swipe-hint');
            if (swipeHint) {
                swipeHint.style.opacity = '0';
                swipeHint.style.transition = 'opacity 1s ease';
                setTimeout(() => {
                    swipeHint.style.display = 'none';
                }, 1000);
            }
        }
    } else {
        console.log('Swipe ignored - conditions not met');
    }
}

// Mouse swipe fallback for mobile
function handleMouseSwipe(startX, endX, startY, endY, duration) {
    if (isTransitioning) {
        console.log('Mouse swipe ignored - transition in progress');
        return;
    }
    
    const swipeThreshold = 50; // Higher threshold for mouse
    const maxDuration = 300;
    const diffX = startX - endX;
    const diffY = startY - endY;
    
    console.log('Mouse swipe analysis:', {
        diffX: diffX,
        diffY: diffY,
        threshold: swipeThreshold,
        duration: duration,
        isHorizontal: Math.abs(diffX) > Math.abs(diffY)
    });
    
    if (Math.abs(diffX) > swipeThreshold && 
        Math.abs(diffX) > Math.abs(diffY) && 
        duration < maxDuration) {
        
        console.log('Valid mouse swipe detected!');
        
        if (diffX > 0) {
            console.log('Mouse swiping left - going to next slide');
            changeSlide(1);
        } else {
            console.log('Mouse swiping right - going to previous slide');
            changeSlide(-1);
        }
        
        // Hide swipe hint after 3 swipes
        swipeCount++;
        if (swipeCount >= 3) {
            const swipeHint = document.querySelector('.swipe-hint');
            if (swipeHint) {
                swipeHint.style.opacity = '0';
                swipeHint.style.transition = 'opacity 1s ease';
                setTimeout(() => {
                    swipeHint.style.display = 'none';
                }, 1000);
            }
        }
    }
}

// Fullscreen functionality
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Fullscreen failed:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// Keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (isTransitioning) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                changeSlide(-1);
                e.preventDefault();
                break;
            case 'ArrowRight':
                changeSlide(1);
                e.preventDefault();
                break;
            case ' ':
                toggleMusic();
                e.preventDefault();
                break;
            case 'Enter':
                if (e.target.classList.contains('nav-btn')) {
                    e.target.click();
                }
                break;
        }
    });
}

// Performance optimization
function optimizePerformance() {
    // Throttle resize events
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Handle resize
            updateProgressBar();
        }, 100);
    });
    
    // Optimize animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
    }
    
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Preload images for better performance
    const imageFiles = ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg', 'img7.jpg', 'img8.jpg'];
    imageFiles.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Accessibility improvements
function improveAccessibility() {
    // Add ARIA labels
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.setAttribute('aria-label', btn.textContent);
    });
    
    // Add keyboard focus indicators
    const focusableElements = document.querySelectorAll('button, input[type="range"]');
    focusableElements.forEach(el => {
        el.addEventListener('focus', function() {
            this.style.outline = '2px solid #d4c4a8';
            this.style.outlineOffset = '2px';
        });
        
        el.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
} 