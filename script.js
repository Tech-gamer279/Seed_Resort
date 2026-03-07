// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const bookingForm = document.getElementById('bookingForm');
const header = document.querySelector('.header');

// Mobile Menu Toggle
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');

    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    if (hamburger.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

hamburger.addEventListener('click', toggleMobileMenu);

// Smooth Scrolling Navigation
function smoothScroll(target) {
    const element = document.querySelector(target);
    const headerOffset = header.offsetHeight;
    const elementPosition = element.offsetTop;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Navigation Links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href');
        smoothScroll(target);

        // Close mobile menu
        if (navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }

        // Update active link
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        link.classList.add('active');
    });
});

// Active Navigation on Scroll
function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + header.offsetHeight + 50;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Header Background on Scroll
function updateHeaderBackground() {
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
}

window.addEventListener('scroll', updateHeaderBackground);

// Form Validation and Submission
function validateForm(formData) {
    const errors = [];

    // Name validation
    if (!formData.name.trim()) {
        errors.push('Name is required');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
        errors.push('Email is required');
    } else if (!emailRegex.test(formData.email)) {
        errors.push('Please enter a valid email address');
    }

    // Date validation
    const checkinDate = new Date(formData.checkin);
    const checkoutDate = new Date(formData.checkout);
    const today = new Date();

    if (!formData.checkin) {
        errors.push('Check-in date is required');
    } else if (checkinDate < today.setHours(0, 0, 0, 0)) {
        errors.push('Check-in date cannot be in the past');
    }

    if (!formData.checkout) {
        errors.push('Check-out date is required');
    } else if (checkoutDate <= checkinDate) {
        errors.push('Check-out date must be after check-in date');
    }

    // Room type validation
    if (!formData.roomType) {
        errors.push('Please select a room type');
    }

    return errors;
}

function showFormMessage(message, type = 'success') {
    // Remove existing message
    const existingMessage = bookingForm.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;

    // Insert before submit button
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    bookingForm.insertBefore(messageDiv, submitBtn);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        checkin: document.getElementById('checkin').value,
        checkout: document.getElementById('checkout').value,
        roomType: document.getElementById('roomType').value
    };

    // Validate form
    const errors = validateForm(formData);
    if (errors.length > 0) {
        showFormMessage(errors.join('. '), 'error');
        return;
    }

    // Show loading state
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    try {
        // Simulate API call (replace with actual booking API)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Success message
        showFormMessage('Thank you! Your booking request has been submitted. We\'ll contact you within 24 hours to confirm your reservation.', 'success');

        // Reset form
        bookingForm.reset();

    } catch (error) {
        showFormMessage('Sorry, there was an error processing your request. Please try again or contact us directly.', 'error');
    } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .gallery-item, .about-text, .contact-info, .contact-form').forEach(el => {
    observer.observe(el);
});

// Gallery Modal (Simple implementation)
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-overlay h4').textContent;

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'gallery-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <img src="${img.src}" alt="${img.alt}">
                <h3>${title}</h3>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-close')) {
                modal.remove();
            }
        });
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set minimum date for check-in
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    const today = new Date().toISOString().split('T')[0];

    checkinInput.min = today;
    checkoutInput.min = today;

    // Update checkout min date when checkin changes
    checkinInput.addEventListener('change', () => {
        checkoutInput.min = checkinInput.value;
        if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
            checkoutInput.value = '';
        }
    });

    // Initial active nav check
    updateActiveNav();
    updateHeaderBackground();
});

// Add CSS for form messages and modal
const style = document.createElement('style');
style.textContent = `
    .form-message {
        padding: 12px;
        border-radius: 5px;
        margin-bottom: 1rem;
        font-weight: 500;
    }

    .form-message.success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }

    .form-message.error {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }

    .gallery-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        cursor: pointer;
    }

    .modal-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
        text-align: center;
    }

    .modal-content img {
        max-width: 100%;
        max-height: 80vh;
        object-fit: contain;
    }

    .modal-content h3 {
        color: white;
        margin-top: 1rem;
        font-size: 1.5rem;
    }

    .modal-close {
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        background: none;
        border: none;
    }

    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: white;
        padding: 1rem 0;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    @media (min-width: 769px) {
        .nav-menu.active {
            display: flex;
            flex-direction: row;
            position: static;
            width: auto;
            background: transparent;
            padding: 0;
            box-shadow: none;
        }
    }
`;
document.head.appendChild(style);

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

window.addEventListener('scroll', debounce(() => {
    updateActiveNav();
    updateHeaderBackground();
}, 10));