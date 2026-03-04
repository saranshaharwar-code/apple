/**
 * Apple Style Luxury Website - Main Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // 0. Particles & Loader
    initParticles();
    handleLoader();

    // 1. Initialize Hero Sequence
    initHeroSequence();

    // 2. Navigation & UI Logic
    handleNavigation();
    handleFAQ();
    handleScrollAnimations();
    handleModal();
});

/* --- 🌟 Background Particles & Sparkles 🌟 --- */
const sparkleColors = ['#F5D26A', '#D4AF37', '#A67C00'];

function createSparkle(x, y) {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    for (let i = 0; i < 5; i++) {
        const p = {
            x: x + (Math.random() - 0.5) * 50,
            y: y + (Math.random() - 0.5) * 50,
            radius: Math.random() * 2,
            color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
            life: 1,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
        };

        const drawSparkle = () => {
            if (p.life <= 0) return;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.fill();
            ctx.globalAlpha = 1;

            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;
            requestAnimationFrame(drawSparkle);
        };
        drawSparkle();
    }
}

function handleModal() {
    const modal = document.getElementById('login-modal');
    const trigger = document.getElementById('signin-trigger');
    const close = modal.querySelector('.modal-close');

    if (trigger) {
        trigger.addEventListener('click', () => modal.classList.add('active'));
    }

    if (close) {
        close.addEventListener('click', () => modal.classList.remove('active'));
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    // Mock session encryption message
    const form = document.getElementById('email-login-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = "Encrypting Session...";
            setTimeout(() => {
                btn.innerText = "Access Granted.";
                createSparkle(window.innerWidth / 2, window.innerHeight / 2);
                setTimeout(() => {
                    modal.classList.remove('active');
                    btn.innerText = originalText;
                }, 1000);
            }, 1500);
        });
    }
}

function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.5;
            this.opacity = Math.random() * 0.4;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Simple parallax effect based on scroll
            const scrollY = window.pageYOffset;
            this.y_offset = scrollY * 0.1;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, (this.y + this.y_offset) % height, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

/* --- 🔄 Loader --- */
function handleLoader() {
    const loader = document.getElementById('loading-screen');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            document.body.classList.remove('loading');
            setTimeout(() => {
                loader.style.display = 'none';
                startInitialAnimations();
            }, 1000);
        }, 1500); // Luxury wait
    });
}

function startInitialAnimations() {
    gsap.to('.reveal', {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 1.5,
        ease: "power4.out"
    });
}

/* --- 🍎 Hero Sequence 🍎 --- */
function initHeroSequence() {
    const canvas = document.getElementById('hero-sequence');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const FRAME_COUNT = 240;
    const images = [];
    const sequenceObj = { frame: 0 };

    const currentFrame = index => (
        `apple_assets_2/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
    );

    // Preload
    for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const activeImg = images[sequenceObj.frame];
        if (activeImg && activeImg.complete) {
            const scale = Math.max(canvas.width / activeImg.width, canvas.height / activeImg.height);
            const w = activeImg.width * scale;
            const h = activeImg.height * scale;
            const x = (canvas.width / 2) - (w / 2);
            const y = (canvas.height / 2) - (h / 2);
            ctx.drawImage(activeImg, x, y, w, h);
        }
    }

    images[0].onload = render;

    function updateCanvasSize() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        render();
    }
    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();

    // Interaction
    window.addEventListener('mousemove', (e) => {
        const progress = e.clientX / window.innerWidth;
        const frameIndex = Math.min(FRAME_COUNT - 1, Math.max(0, Math.floor(progress * FRAME_COUNT)));
        gsap.to(sequenceObj, {
            frame: frameIndex,
            snap: "frame",
            duration: 0.6,
            ease: "none",
            onUpdate: render
        });
    });
}

/* --- 🧭 Navigation --- */
function handleNavigation() {
    const nav = document.getElementById('main-nav');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

/* --- ❓ FAQ --- */
function handleFAQ() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            items.forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });
}

/* --- 🎡 Scroll Animations --- */
function handleScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Section Titles
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 85%",
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Product Cards
    gsap.utils.toArray('.product-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
            },
            opacity: 0,
            y: 60,
            duration: 1,
            delay: i * 0.1,
            ease: "power3.out"
        });
    });

    // Features
    gsap.from('.feature-item', {
        scrollTrigger: {
            trigger: '.features-strip',
            start: "top 80%",
        },
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out"
    });
}
