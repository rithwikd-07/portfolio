document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. DECRYPTING TEXT LOADING SCREEN
       ========================================== */
    const decryptTextEl = document.getElementById('decrypt-text');
    const loaderEl = document.getElementById('loader');
    const loaderProgressFill = document.getElementById('loader-progress-fill');
    const loaderPercentEl = document.getElementById('loader-percent');

    if (decryptTextEl && loaderEl) {
        const finalText = "WELCOME";
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*()_-+=";
        let iterations = 0;
        let interval = null;

        function startDecryptAnimation() {
            clearInterval(interval);
            interval = setInterval(() => {
                decryptTextEl.innerText = finalText
                    .split("")
                    .map((char, index) => {
                        if (index < iterations) {
                            return finalText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("");

                const progressPct = Math.min(100, Math.round((iterations / finalText.length) * 100));
                if (loaderProgressFill) loaderProgressFill.style.width = `${progressPct}%`;
                if (loaderPercentEl) loaderPercentEl.innerText = `${String(progressPct).padStart(2, '0')}%`;

                if (iterations >= finalText.length) {
                    clearInterval(interval);
                    if (loaderProgressFill) loaderProgressFill.style.width = '100%';
                    if (loaderPercentEl) loaderPercentEl.innerText = '100%';
                    setTimeout(() => {
                        loaderEl.style.opacity = '0';
                        loaderEl.style.visibility = 'hidden';
                        document.body.style.overflowY = 'auto';
                    }, 500);
                }
                iterations += 1 / 3;
            }, 30);
        }

        document.body.style.overflowY = 'hidden';
        setTimeout(startDecryptAnimation, 200);
    }


    /* ==========================================
       2. CURSOR RADIAL GLOW & POSITION
       ========================================== */
    const radialGlow = document.querySelector('.radial-glow');

    if (radialGlow) {
        document.addEventListener('mousemove', (e) => {
            radialGlow.style.opacity = '1';
            radialGlow.style.left = `${e.clientX}px`;
            radialGlow.style.top = `${e.clientY}px`;
        });

        document.addEventListener('mouseleave', () => {
            radialGlow.style.opacity = '0';
        });
    }


    /* ==========================================
       3. RESPONSIVE MOBILE MENU TOGGLE
       ========================================== */
    const menuBtn = document.getElementById('menu-btn');
    const navLinksMenu = document.getElementById('nav-links-menu');

    if (menuBtn && navLinksMenu) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            navLinksMenu.classList.toggle('active');
        });

        const navLinks = navLinksMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                navLinksMenu.classList.remove('active');
            });
        });
    }


    /* ==========================================
       4. INTERACTIVE CARD SPOTLIGHTS
       ========================================== */
    const spotlightCards = document.querySelectorAll('.project-grid-card, .skill-card, .stat-card, .cert-carousel-card, .cert-grid-card, .victory-card, .edu-card, .connect-card-container, .connect-btn-pill');

    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });


    /* ==========================================
       5. SCROLL REVEAL & SKILLS PROGRESS OBSERVER
       ========================================== */
    const revealElements = document.querySelectorAll(
        '.section-title, .section-subtitle, .stat-card, .skill-card, .timeline-item, .project-grid-card, .cert-carousel-card, .cert-grid-card, .victory-card, .about-left, .about-right, .edu-card, .scroll-reveal'
    );

    // Initial styles setup
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                // Animate skill card bars
                if (entry.target.classList.contains('skill-card')) {
                    const progressBars = entry.target.querySelectorAll('.skill-progress-fill');
                    progressBars.forEach(bar => {
                        bar.style.width = bar.getAttribute('data-level');
                    });
                }

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });


    /* ==========================================
       6. DYNAMIC TELEMETRY CANVAS SYSTEM
       ========================================== */
    const canvas = document.getElementById('telemetry-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.radius = Math.random() * 1.2 + 0.6;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
                ctx.fill();
            }

            update() {
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

                // Mouse interaction repulsion
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x += (dx / dist) * force * 1.2;
                        this.y += (dy / dist) * force * 1.2;
                    }
                }

                this.x += this.vx;
                this.y += this.vy;
            }
        }

        const particleCount = Math.min(Math.floor(window.innerWidth / 20), 70);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Connect lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < 130) {
                        const alpha = ((130 - dist) / 130) * 0.025;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }
        animate();
    }


    /* ==========================================
       7. HERO TERMINAL STATS LOOP
       ========================================== */
    const uptimeVal = document.getElementById('uptime-val');
    const pingVal = document.getElementById('ping-val');

    if (uptimeVal) {
        let uptime = Math.floor(Math.random() * 5000) + 1000;
        setInterval(() => {
            uptime++;
            uptimeVal.innerText = uptime;
        }, 1000);
    }

    if (pingVal) {
        setInterval(() => {
            const randomPing = Math.floor(Math.random() * 15) + 4;
            pingVal.innerText = `${randomPing}ms`;
        }, 3000);
    }


    /* ==========================================
       8. DYNAMIC MODAL LIGHTBOX FOR CREDENTIALS
       ========================================== */
    // Programmatically construct the Lightbox elements to avoid modifying HTML structure
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-modal';
    lightbox.id = 'lightbox-modal';

    const lightboxContent = document.createElement('div');
    lightboxContent.className = 'lightbox-content-wrapper';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close-btn';
    closeBtn.id = 'lightbox-close';
    closeBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        Close
    `;

    const lightboxImg = document.createElement('img');
    lightboxImg.className = 'lightbox-img';
    lightboxImg.id = 'lightbox-img';
    lightboxImg.alt = 'Credential Zoom';

    const lightboxCaption = document.createElement('p');
    lightboxCaption.className = 'lightbox-caption';
    lightboxCaption.id = 'lightbox-caption';

    lightboxContent.appendChild(closeBtn);
    lightboxContent.appendChild(lightboxImg);
    lightboxContent.appendChild(lightboxCaption);
    lightbox.appendChild(lightboxContent);
    document.body.appendChild(lightbox);

    // Click handler for modal triggers
    const triggerCards = document.querySelectorAll('.victory-card, .cert-carousel-card, .cert-grid-card');

    triggerCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            if (img) {
                const src = img.getAttribute('src');
                const alt = img.getAttribute('alt');

                // Get caption from titles inside
                let captionText = alt;
                const captionEl = card.querySelector('.victory-photo-title, .cert-card-title, .cert-title-new');
                if (captionEl) {
                    captionText = captionEl.innerText;
                }

                lightboxImg.setAttribute('src', src);
                lightboxCaption.innerText = captionText;

                lightbox.classList.add('active');
                document.body.style.overflowY = 'hidden';
            }
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflowY = 'auto';
        setTimeout(() => {
            lightboxImg.setAttribute('src', '');
            lightboxCaption.innerText = '';
        }, 400);
    }

    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });


    /* ==========================================
       9. ACTIVE NAVIGATION SCROLLSPY
       ========================================== */
    const navItems = document.querySelectorAll('.nav-links a');
    const pageSections = document.querySelectorAll('section');

    function updateActiveNav() {
        let currentSectionId = '';

        pageSections.forEach(sec => {
            const secTop = sec.offsetTop;
            if (window.scrollY >= secTop - 350) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();



    /* ==========================================
       11. AMBIENT CURSOR GLOW COORDINATES
       ========================================== */
    document.addEventListener('mousemove', (e) => {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    });


    /* ==========================================
       12. CUSTOM CURSOR (DOT + LAGGING RING)
       ========================================== */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        function animateRing() {
            // Lerp toward the mouse position for a smooth trailing effect
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
            requestAnimationFrame(animateRing);
        }
        animateRing();

        const hoverTargets = 'a, button, .resume-btn, .connect-btn-pill, .project-grid-card, .skill-card, .skill-list li, .cert-carousel-card, .cert-grid-card, .victory-card, .mini-stat, .stat-card, .edu-card';

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverTargets)) {
                cursorRing.classList.add('cursor-hover');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverTargets)) {
                cursorRing.classList.remove('cursor-hover');
            }
        });

        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorRing.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            cursorDot.style.opacity = '1';
            cursorRing.style.opacity = '1';
        });
    } else if (cursorDot && cursorRing) {
        // Touch devices: hide the custom cursor entirely
        cursorDot.style.display = 'none';
        cursorRing.style.display = 'none';
    }


    /* ==========================================
       13. VISITOR COUNTER
       ========================================== */
    const visitorCountEl = document.getElementById('visitor-count');

    if (visitorCountEl) {
        // Uses CounterAPI (free, no signup) to persist a visit count across all visitors.
        // "up" increments by 1 and returns the new total every time this page loads.
        fetch('https://api.counterapi.dev/v1/rithwik-portfolio/hero-visits/up')
            .then(res => res.json())
            .then(data => {
                if (data && typeof data.count !== 'undefined') {
                    visitorCountEl.innerText = data.count;
                }
            })
            .catch(() => {
                // Fail silently if the counter service is unreachable —
                // leave the placeholder dash rather than breaking the page.
                visitorCountEl.innerText = '—';
            });
    }


    /* ==========================================
       14. MAGNETIC BUTTON EFFECT
       ========================================== */
    if (window.matchMedia('(pointer: fine)').matches) {
        const magneticEls = document.querySelectorAll('.resume-btn, .connect-btn-pill');

        magneticEls.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const relX = e.clientX - (rect.left + rect.width / 2);
                const relY = e.clientY - (rect.top + rect.height / 2);
                el.style.transform = `translate(${relX * 0.3}px, ${relY * 0.3}px) scale(1.04)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0) scale(1)';
            });
        });
    }

});