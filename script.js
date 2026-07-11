document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. OPENING ANIMATION
       ========================================== */
    const opening = document.getElementById('opening');
    const openingJa = document.getElementById('opening-ja');
    const openingEn = document.getElementById('opening-en');

    // Phase 1: Show Japanese text
    setTimeout(() => {
        openingJa.classList.add('is-active');
    }, 300);

    // Phase 2: Show English text
    setTimeout(() => {
        openingEn.classList.add('is-active');
    }, 300);

    // Phase 3: Fade out the entire opening overlay
    setTimeout(() => {
        opening.classList.add('is-done');
        document.body.classList.remove('is-loading');
    }, 3000);

    /* ==========================================
       2. HEADER SCROLL EFFECT
       ========================================== */
    const header = document.getElementById('header');
    const onScroll = () => {
        if (window.scrollY > 60) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ==========================================
       3. HAMBURGER MENU
       ========================================== */
    const hamburger = document.getElementById('hamburger');
    const headerNav = document.getElementById('header-nav');

    if (hamburger && headerNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('is-open');
            headerNav.classList.toggle('is-open');
        });

        // Close menu when a link is clicked
        headerNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('is-open');
                headerNav.classList.remove('is-open');
            });
        });
    }

    /* ==========================================
       4. COUNTDOWN (日単位, 10月25日基準)
       ========================================== */
    const cdElement = document.getElementById('cd-days');
    if (cdElement) {
        const now = new Date();
        const eventDate = new Date(now.getFullYear(), 9, 25); // October 25

        // If past the event date this year, use next year
        if (now > eventDate) {
            eventDate.setFullYear(eventDate.getFullYear() + 1);
        }

        const diffMs = eventDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            cdElement.textContent = '本日!';
            cdElement.style.fontSize = '2.5rem';
            const unit = document.querySelector('.hero__cd-unit');
            if (unit) unit.style.display = 'none';
        } else {
            // Animate the count up
            let current = 0;
            const step = Math.max(Math.floor(1500 / diffDays), 15);
            const counter = setInterval(() => {
                current++;
                cdElement.textContent = current;
                if (current >= diffDays) {
                    clearInterval(counter);
                    cdElement.textContent = diffDays;
                }
            }, step);
        }
    }

    /* ==========================================
       5. SCROLL REVEAL (Intersection Observer)
       ========================================== */
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================
       6. SMOOTH SCROLL for anchor links
       ========================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

    /* ==========================================
       7. MOUSE GLOW EFFECT
       ========================================== */
    const mouseGlow = document.getElementById('mouse-glow');
    if (mouseGlow) {
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateGlow() {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            mouseGlow.style.left = glowX + 'px';
            mouseGlow.style.top = glowY + 'px';
            requestAnimationFrame(animateGlow);
        }
        animateGlow();

        // Hide glow on mobile
        if ('ontouchstart' in window) {
            mouseGlow.style.display = 'none';
        }
    }

    /* ==========================================
       8. HALLOWEEN PARTICLES (Canvas)
       ========================================== */
    const canvas = document.getElementById('halloween-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animFrame;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Halloween symbols to float
        const symbols = ['🎃', '🦇', '👻', '🕸️', '⭐', '✨', '🌙'];

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 16 + 10;
                this.speedY = -(Math.random() * 0.3 + 0.1);
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.15 + 0.03;
                this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
                this.rotation = Math.random() * 360;
                this.rotationSpeed = (Math.random() - 0.5) * 0.5;
                this.wobblePhase = Math.random() * Math.PI * 2;
                this.wobbleSpeed = Math.random() * 0.02 + 0.005;
                this.wobbleAmount = Math.random() * 20 + 10;
            }
            update() {
                this.y += this.speedY;
                this.wobblePhase += this.wobbleSpeed;
                this.x += this.speedX + Math.sin(this.wobblePhase) * 0.3;
                this.rotation += this.rotationSpeed;

                if (this.y < -this.size) {
                    this.y = canvas.height + this.size;
                    this.x = Math.random() * canvas.width;
                }
                if (this.x < -this.size) this.x = canvas.width + this.size;
                if (this.x > canvas.width + this.size) this.x = -this.size;
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation * Math.PI / 180);
                ctx.globalAlpha = this.opacity;
                ctx.font = this.size + 'px serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.symbol, 0, 0);
                ctx.restore();
            }
        }

        // Create particles
        const particleCount = Math.min(Math.floor(window.innerWidth / 50), 25);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animFrame = requestAnimationFrame(animateParticles);
        }
        animateParticles();

        // Cleanup on page hide
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animFrame);
            } else {
                animateParticles();
            }
        });
    }

    /* ==========================================
       9. PARALLAX-LIKE EFFECT for hero
       ========================================== */
    const heroIllustration = document.querySelector('.hero__illustration');
    if (heroIllustration && !('ontouchstart' in window)) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const offset = scrollY * 0.15;
            heroIllustration.style.transform = `translate(-50%, -50%) translateY(${-offset}px)`;
        }, { passive: true });
    }

    /* ==========================================
       10. CARD TILT EFFECT on hover
       ========================================== */
    const tiltCards = document.querySelectorAll('.info__card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

});
