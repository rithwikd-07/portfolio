document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. DECRYPTING TEXT LOADING SCREEN
       ========================================== */
    const decryptTextEl = document.getElementById('decrypt-text');
    const loaderEl = document.getElementById('loader');
    
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

            if (iterations >= finalText.length) {
                clearInterval(interval);
                // Complete loading and fade out loader
                setTimeout(() => {
                    loaderEl.style.opacity = '0';
                    loaderEl.style.visibility = 'hidden';
                    document.body.style.overflowY = 'auto';
                }, 600);
            }
            iterations += 1/3; // Speed of character decryption
        }, 30);
    }

    // Freeze scroll during loading
    document.body.style.overflowY = 'hidden';
    // Start decryption animation
    setTimeout(startDecryptAnimation, 200);


    /* ==========================================
       2. CURSOR RADIAL GLOW TRACKING
       ========================================== */
    const radialGlow = document.querySelector('.radial-glow');

    document.addEventListener('mousemove', (e) => {
        radialGlow.style.opacity = '1';
        radialGlow.style.left = `${e.clientX}px`;
        radialGlow.style.top = `${e.clientY}px`;
    });

    document.addEventListener('mouseleave', () => {
        radialGlow.style.opacity = '0';
    });


    /* ==========================================
       3. RESPONSIVE MOBILE MENU TOGGLE
       ========================================== */
    const menuBtn = document.getElementById('menu-btn');
    const navLinksMenu = document.getElementById('nav-links-menu');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navLinksMenu.classList.toggle('active');
    });

    // Close menu when clicking on nav link
    const navLinks = navLinksMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navLinksMenu.classList.remove('active');
        });
    });


    /* ==========================================
       4. INTERACTIVE CARD SPOTLIGHTS
       ========================================== */
    const spotlightCards = document.querySelectorAll('.project-grid-card, .skill-card, .stat-card');

    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within element
            const y = e.clientY - rect.top;  // y position within element
            
            // Set variables to define spotlight center
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });


    /* ==========================================
       5. SCROLL REVEAL & SKILLS PROGRESS OBSERVER
       ========================================== */
    const revealElements = document.querySelectorAll(
        '.section-title, .section-subtitle, .stat-card, .skill-card, .timeline-item, .project-grid-card, .accolades-list li, .certs-list li, .about-left, .about-right'
    );

    // Initial styling to setup animation values
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
                
                // Trigger skills animation if the intersected node is a skill-card
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
       6. DYNAMIC TELEMETRY CANVAS NET & RIPPLES
       ========================================== */
    const canvas = document.getElementById('telemetry-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let dataPackets = [];
        let pings = [];
        let mouse = { x: null, y: null, radius: 120 };

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

        // Trigger radar ring on click
        window.addEventListener('click', (e) => {
            pings.push({
                x: e.clientX,
                y: e.clientY,
                radius: 5,
                maxRadius: 160,
                alpha: 0.35
            });
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 1.5 + 0.5;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(99, 102, 241, 0.35)';
                ctx.fill();
            }

            update() {
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x += (dx / dist) * force * 1.5;
                        this.y += (dy / dist) * force * 1.5;
                    }
                }

                this.x += this.vx;
                this.y += this.vy;
            }
        }

        const hexChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
        class DataPacket {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + 20;
                this.vy = -(Math.random() * 0.25 + 0.15); // drift upward
                this.alpha = Math.random() * 0.18 + 0.04;
                this.val = '0x' + Array.from({length: 2}, () => hexChars[Math.floor(Math.random() * hexChars.length)]).join('');
                this.fontSize = Math.floor(Math.random() * 4) + 8;
            }

            draw() {
                ctx.font = `${this.fontSize}px monospace`;
                ctx.fillStyle = `rgba(14, 165, 233, ${this.alpha})`;
                ctx.fillText(this.val, this.x, this.y);
            }

            update() {
                this.y += this.vy;
                if (this.y < -20) {
                    this.reset();
                }
            }
        }

        // Initialize elements
        const particleCount = Math.min(Math.floor(window.innerWidth / 15), 90);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const packetCount = Math.min(Math.floor(window.innerWidth / 40), 20);
        for (let i = 0; i < packetCount; i++) {
            dataPackets.push(new DataPacket());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw hex data packets drifting upwards
            dataPackets.forEach(p => {
                p.update();
                p.draw();
            });

            // Draw connecting mesh nodes
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Connect nearby nodes
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < 110) {
                        const alpha = ((110 - dist) / 110) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            // Draw expanding click rings (radar pings)
            pings.forEach((p, idx) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(14, 165, 233, ${p.alpha})`;
                ctx.lineWidth = 0.75;
                ctx.stroke();

                p.radius += 1.8;
                p.alpha -= 0.005;

                if (p.alpha <= 0 || p.radius >= p.maxRadius) {
                    pings.splice(idx, 1);
                }
            });

            requestAnimationFrame(animate);
        }
        animate();
    }


    /* ==========================================
       7. HERO TERMINAL INTERACTIVE STATS
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
        }, 3500);
    }




});
