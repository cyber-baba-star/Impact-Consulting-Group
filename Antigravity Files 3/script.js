/* ========================================
   IMPACT CONSULTING — INTERACTIVE SCRIPTS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ============ NAVBAR SCROLL ============
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    const handleScroll = () => {
        const scrollY = window.scrollY;

        // Sticky nav background
        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ============ MOBILE NAV TOGGLE ============
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('open');
        document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    navLinksContainer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinksContainer.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ============ HERO PARTICLES ============
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            particle.classList.add('hero-particle');
            particle.style.left = `${Math.random() * 100}%`;
            const size = Math.random() * 3 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
            particle.style.animationDelay = `${Math.random() * 10}s`;
            particle.style.opacity = Math.random() * 0.4 + 0.1;
            const colors = [
                'rgba(255, 255, 255, 0.5)',
                'rgba(147, 197, 253, 0.5)',
                'rgba(96, 165, 250, 0.4)',
                'rgba(191, 219, 254, 0.4)',
            ];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particlesContainer.appendChild(particle);
        }
    }

    // ============ COUNTER ANIMATION ============
    const counters = document.querySelectorAll('[data-count]');
    let countersStarted = false;

    const animateCounters = () => {
        if (countersStarted) return;

        const statsSection = document.querySelector('.hero-stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) return;

        countersStarted = true;

        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count, 10);
            const duration = 2000;
            const startTime = performance.now();

            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease-out cubic
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(easeOut * target);

                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            };

            requestAnimationFrame(update);
        });
    };

    window.addEventListener('scroll', animateCounters, { passive: true });
    animateCounters(); // Check on initial load

    // ============ SCROLL ANIMATIONS (Intersection Observer) ============
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay || '0', 10);
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // ============ SERVICE CARD MOUSE GLOW ============
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });

    // ============ SMOOTH SCROLL FOR ANCHOR LINKS ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        });
    });

    // ============ CONTACT FORM ============
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const message = document.getElementById('contactMessage').value;

            // Build mailto link with form data
            const subject = encodeURIComponent(`New Inquiry from ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            window.location.href = `mailto:impact@rotman.utoronto.ca?subject=${subject}&body=${body}`;

            // Visual feedback
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = `
                <span>Opening Email Client...</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6.667 10l2.5 2.5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            `;
            submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = originalHTML;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                contactForm.reset();
            }, 3000);
        });
    }

    // ============ PARALLAX ON HERO (SUBTLE) ============
    const hero = document.querySelector('.hero');
    if (hero && window.matchMedia('(min-width: 768px)').matches) {
        window.addEventListener('mousemove', (e) => {
            const xOffset = (e.clientX / window.innerWidth - 0.5) * 10;
            const yOffset = (e.clientY / window.innerHeight - 0.5) * 10;

            const gridLines = hero.querySelector('.hero-grid-lines');
            if (gridLines) {
                gridLines.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            }
        }, { passive: true });
    }

    // ============ RFP MODAL ============
    const rfpOverlay = document.getElementById('rfpOverlay');
    const openRfpBtn = document.getElementById('openRfpBtn');
    const rfpClose = document.getElementById('rfpClose');
    const rfpForm = document.getElementById('rfpForm');

    if (openRfpBtn && rfpOverlay) {
        openRfpBtn.addEventListener('click', () => {
            rfpOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        rfpClose.addEventListener('click', () => {
            rfpOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        rfpOverlay.addEventListener('click', (e) => {
            if (e.target === rfpOverlay) {
                rfpOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && rfpOverlay.classList.contains('active')) {
                rfpOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    if (rfpForm) {
        rfpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const org = document.getElementById('rfpOrg').value;
            const name = document.getElementById('rfpName').value;
            const email = document.getElementById('rfpEmail').value;
            const phone = document.getElementById('rfpPhone').value || 'Not provided';
            const type = document.getElementById('rfpType').value;
            const timeline = document.getElementById('rfpTimeline').value;
            const desc = document.getElementById('rfpDesc').value;
            const budget = document.getElementById('rfpBudget').value || 'Not specified';

            const subject = encodeURIComponent(`RFP from ${org} — ${type}`);
            const body = encodeURIComponent(
                `REQUEST FOR PROPOSAL\n` +
                `${'='.repeat(40)}\n\n` +
                `Organization: ${org}\n` +
                `Contact: ${name}\n` +
                `Email: ${email}\n` +
                `Phone: ${phone}\n\n` +
                `Project Type: ${type}\n` +
                `Timeline: ${timeline}\n` +
                `Budget: ${budget}\n\n` +
                `PROJECT DESCRIPTION\n` +
                `${'-'.repeat(40)}\n` +
                `${desc}`
            );

            window.location.href = `mailto:impact@rotman.utoronto.ca?subject=${subject}&body=${body}`;

            // Visual feedback
            const submitBtn = rfpForm.querySelector('.rfp-submit');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span>Opening Email Client...</span>`;
            submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = originalHTML;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                rfpForm.reset();
                rfpOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }, 3000);
        });
    }

});
