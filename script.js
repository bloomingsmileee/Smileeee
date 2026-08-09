/* =========================================================
SMILEEEE — interactions

1. Twinkling starfield (canvas)


2. Scroll progress bar


3. Constellation dot-nav scrollspy


4. Reveal-on-scroll (IntersectionObserver)


5. Typing animation for the word-animation section


6. Smooth nav-link scrolling
========================================================= */



document.addEventListener("DOMContentLoaded", () => {

const prefersReducedMotion = window.matchMedia(  
    "(prefers-reduced-motion: reduce)"  
).matches;  

/* ---------------------------------------------------  
   1. STARFIELD  
--------------------------------------------------- */  

const canvas = document.getElementById("stars-canvas");  

if (canvas) {  
    const ctx = canvas.getContext("2d");  
    let stars = [];  
    let width, height;  

    function resizeCanvas() {  
        width = canvas.width = window.innerWidth;  
        height = canvas.height = document.body.scrollHeight;  
    }  

    function createStars() {  
        const count = Math.floor((width * height) / 9000);  
        stars = Array.from({ length: count }, () => ({  
            x: Math.random() * width,  
            y: Math.random() * height,  
            r: Math.random() * 1.2 + 0.3,  
            baseAlpha: Math.random() * 0.5 + 0.2,  
            twinkleSpeed: Math.random() * 0.02 + 0.005,  
            phase: Math.random() * Math.PI * 2,  
            hue: Math.random() > 0.85 ? "gold" : "white"  
        }));  
    }  

    function drawStars(time) {  
        ctx.clearRect(0, 0, width, height);  

        stars.forEach((star) => {  
            const twinkle = Math.sin(time * star.twinkleSpeed + star.phase);  
            const alpha = star.baseAlpha + twinkle * 0.25;  
            ctx.beginPath();  
            ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);  
            ctx.fillStyle =  
                star.hue === "gold"  
                    ? `rgba(244, 199, 123, ${Math.max(alpha, 0)})`  
                    : `rgba(247, 242, 236, ${Math.max(alpha, 0)})`;  
            ctx.fill();  
        });  
    }  

    function animate(time) {  
        drawStars(time || 0);  
        if (!prefersReducedMotion) {  
            requestAnimationFrame(animate);  
        }  
    }  

    resizeCanvas();  
    createStars();  
    animate(0);  

    if (prefersReducedMotion) {  
        drawStars(0);  
    }  

    let resizeTimeout;  
    window.addEventListener("resize", () => {  
        clearTimeout(resizeTimeout);  
        resizeTimeout = setTimeout(() => {  
            resizeCanvas();  
            createStars();  
            drawStars(0);  
        }, 200);  
    });  
}  

/* ---------------------------------------------------  
   2. SCROLL PROGRESS BAR  
--------------------------------------------------- */  

const progressBar = document.getElementById("scrollProgressBar");  

function updateProgress() {  
    const scrollTop = window.scrollY;  
    const docHeight = document.body.scrollHeight - window.innerHeight;  
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;  
    if (progressBar) {  
        progressBar.style.width = `${progress}%`;  
    }  
}  

/* ---------------------------------------------------  
   3. DOT-NAV SCROLLSPY  
--------------------------------------------------- */  

const dotItems = document.querySelectorAll(".dot-nav__item");  
const spySections = ["home", "about", "thoughts", "skills"]  
    .map((id) => document.getElementById(id))  
    .filter(Boolean);  

function updateActiveDot() {  
    let currentId = spySections[0] ? spySections[0].id : null;  

    spySections.forEach((section) => {  
        const rect = section.getBoundingClientRect();  
        if (rect.top <= window.innerHeight * 0.4) {  
            currentId = section.id;  
        }  
    });  

    dotItems.forEach((item) => {  
        item.classList.toggle(  
            "active",  
            item.getAttribute("data-section") === currentId  
        );  
    });  
}  

/* ---------------------------------------------------  
   Combined scroll listener (progress + scrollspy)  
--------------------------------------------------- */  

let ticking = false;  
window.addEventListener("scroll", () => {  
    if (!ticking) {  
        requestAnimationFrame(() => {  
            updateProgress();  
            updateActiveDot();  
            ticking = false;  
        });  
        ticking = true;  
    }  
});  

updateProgress();  
updateActiveDot();  

/* ---------------------------------------------------  
   4. REVEAL ON SCROLL  
--------------------------------------------------- */  

const revealEls = document.querySelectorAll(".reveal");  

if ("IntersectionObserver" in window && revealEls.length) {  
    const revealObserver = new IntersectionObserver(  
        (entries) => {  
            entries.forEach((entry) => {  
                if (entry.isIntersecting) {  
                    entry.target.classList.add("is-visible");  
                    revealObserver.unobserve(entry.target);  
                }  
            });  
        },  
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }  
    );  

    revealEls.forEach((el, i) => {  
        el.style.transitionDelay = `${(i % 4) * 0.08}s`;  
        revealObserver.observe(el);  
    });  
} else {  
    revealEls.forEach((el) => el.classList.add("is-visible"));  
}  

/* skill bars fill once visible */  
const skillBars = document.querySelectorAll(".skill-bar");  
if ("IntersectionObserver" in window && skillBars.length) {  
    const barObserver = new IntersectionObserver(  
        (entries) => {  
            entries.forEach((entry) => {  
                if (entry.isIntersecting) {  
                    entry.target.classList.add("is-visible");  
                    barObserver.unobserve(entry.target);  
                }  
            });  
        },  
        { threshold: 0.4 }  
    );  
    skillBars.forEach((bar) => barObserver.observe(bar));  
} else {  
    skillBars.forEach((bar) => bar.classList.add("is-visible"));  
}  

/* ---------------------------------------------------  
   5. TYPING ANIMATION  
--------------------------------------------------- */  

const typingEl = document.getElementById("typing-word");  
const words = ["Dream.", "Learn.", "Create.", "Become."];  

if (typingEl) {  
    if (prefersReducedMotion) {  
        typingEl.textContent = words[words.length - 1];  
    } else {  
        let wordIndex = 0;  
        let charIndex = 0;  
        let isDeleting = false;  

        function typeLoop() {  
            const currentWord = words[wordIndex];  

            if (!isDeleting) {  
                charIndex++;  
                typingEl.textContent = currentWord.slice(0, charIndex);  

                if (charIndex === currentWord.length) {  
                    isDeleting = true;  
                    setTimeout(typeLoop, 1400);  
                    return;  
                }  
            } else {  
                charIndex--;  
                typingEl.textContent = currentWord.slice(0, charIndex);  

                if (charIndex === 0) {  
                    isDeleting = false;  
                    wordIndex = (wordIndex + 1) % words.length;  
                }  
            }  

            setTimeout(typeLoop, isDeleting ? 45 : 90);  
        }  

        typeLoop();  
    }  
}  

/* ---------------------------------------------------  
   6. MAGNETIC CURSOR TEXT  
   Splits marked headings into per-letter spans and  
   nudges/glows each letter based on distance to the  
   cursor — a lightweight "text reacts to your cursor"  
   effect, skipped entirely for reduced-motion / touch.  
--------------------------------------------------- */  

const magneticEls = document.querySelectorAll(".magnetic-text");  
const isTouch = window.matchMedia("(hover: none)").matches;  

if (magneticEls.length && !prefersReducedMotion && !isTouch) {  
    magneticEls.forEach((el) => {  
        const text = el.textContent;  
        el.textContent = "";  
        [...text].forEach((char) => {  
            const span = document.createElement("span");  
            span.className = "letter";  
            span.textContent = char === " " ? "\u00A0" : char;  
            el.appendChild(span);  
        });  
    });  

    const letters = document.querySelectorAll(".magnetic-text .letter");  
    const radius = 90;  

    window.addEventListener("mousemove", (e) => {  
        letters.forEach((letter) => {  
            const rect = letter.getBoundingClientRect();  
            const letterX = rect.left + rect.width / 2;  
            const letterY = rect.top + rect.height / 2;  
            const dx = e.clientX - letterX;  
            const dy = e.clientY - letterY;  
            const dist = Math.sqrt(dx * dx + dy * dy);  

            if (dist < radius) {  
                const strength = (radius - dist) / radius;  
                const lift = strength * 10;  
                const scale = 1 + strength * 0.25;  
                letter.style.transform = `translateY(-${lift}px) scale(${scale})`;  
                letter.style.color = "var(--accent-violet-bright)";  
                letter.style.textShadow = `0 0 ${18 * strength}px rgba(224, 170, 255, ${0.8 * strength})`;  
            } else {  
                letter.style.transform = "";  
                letter.style.color = "";  
                letter.style.textShadow = "";  
            }  
        });  
    });  
}  

/* ---------------------------------------------------  
   7. FLIP CARDS — tap-to-flip on touch devices  
   (desktop flips on hover purely via CSS)  
--------------------------------------------------- */  

if (isTouch) {  
    document.querySelectorAll(".thought-card").forEach((card) => {  
        card.addEventListener("click", () => {  
            card.classList.toggle("is-flipped");  
        });  
    });  
}  

/* ---------------------------------------------------  
   8. SMOOTH NAV-LINK SCROLLING  
--------------------------------------------------- */  

document.querySelectorAll('a[href^="#"]').forEach((link) => {  
    link.addEventListener("click", (e) => {  
        const targetId = link.getAttribute("href");  
        const target = document.querySelector(targetId);  
        if (target) {  
            e.preventDefault();  
            target.scrollIntoView({  
                behavior: prefersReducedMotion ? "auto" : "smooth",  
                block: "start"  
            });  
        }  
    });  
});

});
