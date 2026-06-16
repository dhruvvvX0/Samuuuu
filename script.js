// 1. REGISTER GSAP SCROLL TRIGGER
gsap.registerPlugin(ScrollTrigger);

// Global Mouse Position Tracking for Fluid Background Interaction
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// 2. BACKGROUND INTERACTIVE FLUID PARTICLE NETWORK
const canvas = document.getElementById('fluidCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Mouse interaction / Fluid field repulsion
        let dx = mouseX - this.x;
        let dy = mouseY - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
            let force = (120 - dist) / 120;
            this.x -= (dx / dist) * force * 1.5;
            this.y -= (dy / dist) * force * 1.5;
        }

        // Boundary collision handling
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(236, 72, 153, 0.25)';
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(Math.floor(window.innerWidth / 15), 90);
    for(let i=0; i<count; i++) particles.push(new Particle());
}
initParticles();

function renderParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for(let i=0; i<particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        for(let j=i+1; j<particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            
            if(dist < 100) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(139, 92, 246, ${0.07 * (1 - dist/100)})`;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(renderParticles);
}
renderParticles();

// 3. METICULOUS GSAP ENTRANCE & SCROLL ANIMATIONS
window.addEventListener('DOMContentLoaded', () => {
    // Fade-in Title
    gsap.fromTo('#heroTitle', 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 1.8, ease: "power4.out", delay: 0.3 }
    );

    // Portrait Parallax Tilt Entrance
    gsap.fromTo('#heroImageContainer', 
        { opacity: 0, scale: 0.95, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 2, ease: "power3.out", delay: 0.7 }
    );
    
    // Interactive 3D Image Mouse Hover Tilt Effect
    const heroContainer = document.getElementById('heroImageContainer');
    heroContainer.addEventListener('mousemove', (e) => {
        const rect = heroContainer.getBoundingClientRect();
        const x = e.clientX - rect.left - (rect.width/2);
        const y = e.clientY - rect.top - (rect.height/2);
        gsap.to(heroContainer.querySelector('img'), {
            transformOrigin: "center center",
            rotationY: x * 0.08,
            rotationX: -y * 0.08,
            scale: 1.1,
            duration: 0.5,
            ease: "power2.out"
        });
    });
    heroContainer.addEventListener('mouseleave', () => {
        gsap.to(heroContainer.querySelector('img'), {
            rotationY: 0,
            rotationX: 0,
            scale: 1.05,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // Gallery Cards Staggered Scroll Triggers
    gsap.from(".gallery-card", {
        scrollTrigger: {
            trigger: "#galleryGrid",
            start: "top 80%",
        },
        opacity: 0,
        y: 100,
        stagger: 0.2,
        duration: 1.2,
        ease: "power3.out"
    });

    // Bento Grid Animation Triggers
    gsap.from(".bento-box", {
        scrollTrigger: {
            trigger: "#bentoGrid",
            start: "top 85%",
        },
        opacity: 0,
        scale: 0.9,
        y: 40,
        stagger: 0.15,
        duration: 1,
        ease: "power2.out"
    });

    // Drifting Frequency Node Reveal
    gsap.from(".bubble-node", {
        scrollTrigger: {
            trigger: "#bubbleContainer",
            start: "top 90%",
        },
        opacity: 0,
        scale: 0.5,
        stagger: 0.1,
        duration: 0.8,
        ease: "back.out(1.7)"
    });

    // Continuous Fluid Floating Drifts for Letters
    document.querySelectorAll('.bubble-node').forEach((node, index) => {
        gsap.to(node, {
            y: "random(-15, 15)",
            x: "random(-10, 10)",
            duration: "random(3, 5)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.2
        });
    });
});

// 4. BIRTHDAY COUNTDOWN ENGINE
// Set to June 25, 2026 (Month index 5 = June)
const targetBirthday = new Date(2026, 5, 25, 0, 0, 0).getTime(); 

const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const difference = targetBirthday - now;

    if (difference <= 0) {
        clearInterval(countdownInterval);
        document.getElementById('countdown').innerHTML = "✨ HAPPY BIRTHDAY, BEAUTIFUL ✨";
        document.getElementById('countdown').classList.add('text-pink-400', 'animate-pulse');
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    const dStr = days < 10 ? '0' + days : days;
    const hStr = hours < 10 ? '0' + hours : hours;
    const mStr = minutes < 10 ? '0' + minutes : minutes;
    const sStr = seconds < 10 ? '0' + seconds : seconds;

    document.getElementById('countdown').innerHTML = `${dStr}d : ${hStr}h : ${mStr}m : ${sStr}s`;
}, 1000);

// 5. AUDIO HANDLER
const audio = document.getElementById('bgMusic');
const audioStateText = document.getElementById('audioState');
const visualizer = document.getElementById('visualizer');

visualizer.style.display = 'none';

function toggleAudio() {
    if (audio.paused) {
        audio.play().catch(e => console.log("Audio play blocked. Wait for interaction."));
        audioStateText.innerText = "Mute Echo";
        visualizer.style.display = 'flex';
    } else {
        audio.pause();
        audioStateText.innerText = "Play Track";
        visualizer.style.display = 'none';
    }
}

// 6. MESSAGE LETTER WALL MODAL ENGINE
const overlay = document.getElementById('modalOverlay');

function openModal(msgId) {
    document.querySelectorAll('.modal-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(msgId).classList.remove('hidden');
    
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.querySelector('.glass-card').classList.remove('scale-95');
    overlay.querySelector('.glass-card').classList.add('scale-100');
}

function closeModal() {
    overlay.classList.add('opacity-0', 'pointer-events-none');
    overlay.querySelector('.glass-card').classList.remove('scale-100');
    overlay.querySelector('.glass-card').classList.add('scale-95');
                }
