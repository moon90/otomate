document.addEventListener('DOMContentLoaded', () => {

    // Sticky Navbar Logic
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.add('scrolled');
            navbar.classList.remove('scrolled');
        }
    });

    // Fix the initial state
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }

    // Scroll Reveal functionality using IntersectionObserver
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: unobserve if you only want it to animate once
                // observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Subtly animate the mockup window dynamically
    const mockup = document.querySelector('.mockup-window');
    if (mockup) {
        window.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth - 0.5;
            const y = e.clientY / window.innerHeight - 0.5;
            
            // Adjust the rotation multiplier for stronger/weaker effect
            const rotateX = y * 10;
            const rotateY = -x * 10;
            
            mockup.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(0.98)`;
        });
        
        // Reset when mouse leaves
        mockup.addEventListener('mouseleave', () => {
             mockup.style.transform = 'rotateY(-5deg) rotateX(5deg) scale(0.95)';
        });
    }
});
