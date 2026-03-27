document.addEventListener('DOMContentLoaded', () => {

    /* --- Theme Toggle --- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    // Toggle Theme
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        // Trigger Sun/Moon Icon Animation
        themeIcon.classList.add('animate-mode-spin');
        
        // Wait for it to spin out, then swap and spin back in
        setTimeout(() => {
            if (currentTheme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeIcon.classList.replace('fa-sun', 'fa-moon');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeIcon.classList.replace('fa-moon', 'fa-sun');
            }
            themeIcon.classList.remove('animate-mode-spin');
        }, 150);

        // Trigger Main Branding Logo Animation
        const mainLogo = document.getElementById('main-logo');
        if (mainLogo) {
            mainLogo.classList.remove('animate-logo-flip');
            void mainLogo.offsetWidth; // Force a DOM reflow so the animation restarts
            mainLogo.classList.add('animate-logo-flip');
        }
    });

    /* --- Navbar Scroll Effect & Scroll Progress --- */
    const navbar = document.getElementById('navbar');
    const progressBar = document.getElementById('myBar');

    window.addEventListener('scroll', () => {
        // Sticky Navbar styling
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll Progress Bar calculation
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    });

    /* --- Scroll Spy & Smooth Scroll --- */
    const sections = document.querySelectorAll('.section');
    
    // Highlight Active Navbar Link
    const navItems = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${current}`) {
                a.classList.add('active');
            }
        });
    });

    // Smooth Scrolling for Internal Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                const offset = 70; // Adjust for sticky navbar
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    /* --- Scroll Reveal Animations --- */
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

    /* --- Typing Animation --- */
    const typingTextElement = document.querySelector('.typing-text');
    const words = ["Full Stack Developer", "AI/ML Enthusiast", "Problem Solver"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 150;

    const type = () => {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 100; // Speed up erasing
        } else {
            typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 150;
        }

        // If completed typing a word
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeDelay = 1500; // Pause before erasing
        } 
        // If completed erasing a word
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length; // Move to next word
            typeDelay = 500; // Pause before typing new word
        }

        setTimeout(type, typeDelay);
    }

    /* --- Accordion Logic for Resume --- */
    const resumeHeaders = document.querySelectorAll('.collapsible-header');
    resumeHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const parentItem = header.closest('.resume-item');
            parentItem.classList.toggle('active');
        });
    });

    // Start typing animation slightly after load
    setTimeout(type, 1000);
});
