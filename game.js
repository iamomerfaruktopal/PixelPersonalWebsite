document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingStatus = document.querySelector('.loading-status');
    const gameContainer = document.querySelector('.game-container');
    
    // Make sure game container is initially hidden but exists
    if (gameContainer) {
        gameContainer.style.opacity = '0';
    }

    const loadingMessages = [
        'INITIALIZING SYSTEM...',
        'LOADING ASSETS...',
        'CONFIGURING INTERFACE...',
        'ESTABLISHING CONNECTION...',
        'SYSTEM READY!'
    ];

    let messageIndex = 0;
    
    // Update loading messages
    const messageInterval = setInterval(() => {
        if (messageIndex < loadingMessages.length) {
            loadingStatus.textContent = loadingMessages[messageIndex];
            messageIndex++;
        }
    }, 800);

    // Simulate loading sequence
    setTimeout(() => {
        clearInterval(messageInterval);
        
        // Fade out loading screen
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
        }
        
        // Show game container
        if (gameContainer) {
            gameContainer.style.opacity = '1';
            gameContainer.classList.add('loaded');
        }
        
        // Remove loading screen from DOM
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
            initializeGame();
        }, 500);
    }, 4000);

    // Add sound effects
    const sounds = {
        nav: new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ'),
        select: new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ'),
    };

    // Create retro sound function
    function createRetroSound(type) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        switch(type) {
            case 'nav':
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
                break;
            case 'select':
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(660, audioContext.currentTime); // E5 note
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.15);
                break;
        }
    }

    // Initialize menu items
    const menuItems = document.querySelectorAll('.menu-item');
    let currentMenuItem = 0;

    // Add keyboard navigation with sound
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp':
            case 'PageUp':
                if (currentMenuItem > 0) {
                    currentMenuItem--;
                    createRetroSound('nav');
                    updateMenuSelection();
                }
                break;
            case 'ArrowDown':
            case 'PageDown':
                if (currentMenuItem < menuItems.length - 1) {
                    currentMenuItem++;
                    createRetroSound('nav');
                    updateMenuSelection();
                }
                break;
            case 'Enter':
                createRetroSound('select');
                menuItems[currentMenuItem].classList.add('selected');
                setTimeout(() => {
                    menuItems[currentMenuItem].classList.remove('selected');
                }, 200);
                break;
        }
    });

    // Update menu selection with visual feedback
    function updateMenuSelection() {
        menuItems.forEach((item, index) => {
            if (index === currentMenuItem) {
                item.classList.add('active');
                item.querySelector('.selector').style.opacity = '1';
                // Add subtle glow effect
                item.style.boxShadow = '0 0 10px var(--accent-2)';
            } else {
                item.classList.remove('active');
                item.querySelector('.selector').style.opacity = '0';
                item.style.boxShadow = 'none';
            }
        });
    }

    // Initialize first menu item as active
    updateMenuSelection();

    // Add local time display
    const timeDisplay = document.getElementById('localTime');
    if (timeDisplay) {
        setInterval(() => {
            const now = new Date();
            timeDisplay.textContent = now.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });
        }, 1000);
    }

    // Initialize animations and effects
    function startAnimations() {
        const character = document.querySelector('.character-sprite');
        if (character) {
            character.classList.add('animated');
        }

        const energyBar = document.querySelector('.energy-fill');
        if (energyBar) {
            energyBar.classList.add('animated');
        }

        // Add glitch effect to logo
        const logo = document.querySelector('.pixel-logo');
        if (logo) {
            setInterval(() => {
                if (Math.random() < 0.1) {
                    logo.classList.add('glitch');
                    setTimeout(() => {
                        logo.classList.remove('glitch');
                    }, 200);
                }
            }, 3000);
        }
    }

    // Error handling
    window.onerror = function(msg, url, lineNo, columnNo, error) {
        console.log('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo);
        return false;
    };

    // Start the game after loading
    function initializeGame() {
        startAnimations();
        updateMenuSelection();
    }

    // Update the email sending functionality in game.js
    class ContactForm {
        constructor() {
            this.form = document.querySelector('.contact-form');
            this.submitButton = this.form?.querySelector('.pixel-button');
            this.formFields = {
                name: this.form?.querySelector('input[type="text"]'),
                email: this.form?.querySelector('input[type="email"]'),
                message: this.form?.querySelector('textarea')
            };
            
            if (this.form) {
                this.initializeForm();
            }
        }

        initializeForm() {
            this.submitButton.addEventListener('click', (e) => this.handleSubmit(e));
            // Add input validation events
            Object.values(this.formFields).forEach(field => {
                field.addEventListener('input', () => this.validateField(field));
            });
        }

        validateField(field) {
            const value = field.value.trim();
            let isValid = true;
            let errorMessage = '';

            switch(field.type) {
                case 'text':
                    isValid = value.length >= 2;
                    errorMessage = 'Name must be at least 2 characters';
                    break;
                case 'email':
                    isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                    errorMessage = 'Please enter a valid email';
                    break;
                case 'textarea':
                    isValid = value.length >= 10;
                    errorMessage = 'Message must be at least 10 characters';
                    break;
            }

            this.toggleFieldValidation(field, isValid, errorMessage);
            return isValid;
        }

        toggleFieldValidation(field, isValid, errorMessage) {
            field.style.borderColor = isValid ? 'var(--accent-2)' : 'var(--accent-1)';
            
            // Remove existing error message if any
            const existingError = field.parentElement.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }

            // Add new error message if invalid
            if (!isValid) {
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.textContent = errorMessage;
                errorElement.style.color = 'var(--accent-1)';
                errorElement.style.fontSize = '10px';
                errorElement.style.marginTop = '5px';
                field.parentElement.appendChild(errorElement);
            }
        }

        async handleSubmit(e) {
            e.preventDefault();
            console.log('Submit clicked'); // Debug log

            // Validate all fields
            const isValid = Object.values(this.formFields)
                .every(field => this.validateField(field));

            if (!isValid) {
                createRetroSound('nav');
                this.showNotification('PLEASE CHECK YOUR INPUTS!', 'error');
                return;
            }

            try {
                this.setLoadingState(true);
                
                // Send using Formspree
                const response = await fetch('https://formspree.io/f/mjkkoqkr', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: this.formFields.name.value,
                        email: this.formFields.email.value,
                        message: this.formFields.message.value
                    })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                // Success handling
                createRetroSound('select');
                this.showNotification('MESSAGE SENT SUCCESSFULLY!', 'success');
                this.resetForm();

            } catch (error) {
                console.error('Submission error:', error);
                createRetroSound('nav');
                this.showNotification('ERROR SENDING MESSAGE: ' + error.message, 'error');
            } finally {
                this.setLoadingState(false);
            }
        }

        setLoadingState(isLoading) {
            this.submitButton.disabled = isLoading;
            this.submitButton.textContent = isLoading ? 'SENDING...' : 'SEND MESSAGE';
            this.submitButton.style.opacity = isLoading ? '0.7' : '1';
            
            // Disable/enable form fields
            Object.values(this.formFields).forEach(field => {
                field.disabled = isLoading;
            });
        }

        resetForm() {
            // Instead of using form.reset(), manually clear each field
            if (this.formFields) {
                Object.values(this.formFields).forEach(field => {
                    if (field) {
                        field.value = '';
                        field.style.borderColor = 'var(--accent-2)';
                    }
                });
            }

            // Remove any error messages
            const errorMessages = document.querySelectorAll('.error-message');
            errorMessages.forEach(err => err.remove());
        }

        showNotification(message, type) {
            const notification = document.createElement('div');
            notification.className = `pixel-notification ${type}`;
            notification.textContent = message;
            
            Object.assign(notification.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                padding: '15px',
                background: type === 'success' ? 'var(--accent-2)' : 'var(--accent-1)',
                color: 'var(--bg-dark)',
                border: '2px solid var(--text-primary)',
                zIndex: '1000',
                animation: 'slideIn 0.3s ease-out',
                fontFamily: "'Press Start 2P', cursive",
                fontSize: '12px'
            });
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    }

    // Initialize contact form immediately
    const contactForm = new ContactForm();

    // Add this debug log
    console.log('Form initialized:', {
        form: contactForm.form,
        button: contactForm.submitButton,
        fields: contactForm.formFields
    });

    // Update the initializeForm method
    ContactForm.prototype.initializeForm = function() {
        if (this.submitButton) {
            console.log('Adding click listener to button'); // Debug log
            this.submitButton.addEventListener('click', (e) => {
                console.log('Button clicked'); // Debug log
                this.handleSubmit(e);
            });
        }

        // Add input validation events
        Object.values(this.formFields).forEach(field => {
            if (field) {
                field.addEventListener('input', () => this.validateField(field));
            }
        });
    };

    // Add these styles to your CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); }
            to { transform: translateX(100%); }
        }
        
        .pixel-notification {
            font-family: 'Press Start 2P', cursive;
            font-size: 12px;
        }
    `;
    document.head.appendChild(style);
}); 