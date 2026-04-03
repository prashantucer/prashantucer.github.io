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

    /* --- Interactive Magnetic Dot Grid --- */
    const canvas = document.getElementById('cursor-trail');
    const ctx = canvas.getContext('2d');
    
    let width, height, dpr;
    let dots = [];
    const isMobile = window.innerWidth < 768;
    const spacing = isMobile ? 45 : 35; // Wider spacing on mobile for performance
    const mouseRadius = isMobile ? 120 : 150;
    let mouse = { x: -1000, y: -1000 };
    let hue = 0;

    function initGrid() {
        dpr = window.devicePixelRatio || 1;
        width = window.innerWidth;
        height = window.innerHeight;
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);

        dots = [];
        for (let x = spacing / 2; x < width; x += spacing) {
            for (let y = spacing / 2; y < height; y += spacing) {
                dots.push({
                    originX: x,
                    originY: y,
                    x: x,
                    y: y,
                    size: 1.5
                });
            }
        }
    }

    initGrid();
    
    // Throttle resize events for performance
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initGrid, 200);
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Handle touch movement for mobile users
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    }, { passive: true });

    const animateGrid = () => {
        ctx.clearRect(0, 0, width, height);
        
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        hue += 1.5;
        if (hue > 360) hue = 0;

        dots.forEach(dot => {
            const dx = mouse.x - dot.originX;
            const dy = mouse.y - dot.originY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < mouseRadius) {
                const force = (mouseRadius - dist) / mouseRadius;
                dot.x = dot.originX + dx * force * 0.4;
                dot.y = dot.originY + dy * force * 0.4;
                dot.size = 1.5 + force * 2.5;
                ctx.fillStyle = `hsla(${hue + dist/2}, ${isDark ? '90%' : '70%'}, ${isDark ? '60%' : '45%'}, ${0.1 + force * 0.9})`;
            } else {
                dot.x += (dot.originX - dot.x) * 0.15;
                dot.y += (dot.originY - dot.y) * 0.15;
                dot.size += (1.5 - dot.size) * 0.15;
                const baseOpacity = isDark ? 0.15 : 0.08;
                ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${baseOpacity})` : `rgba(0, 0, 0, ${baseOpacity})`;
            }

            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animateGrid);
    };

    if (canvas) animateGrid();

});
