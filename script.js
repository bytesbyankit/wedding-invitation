/**
 * Royal Indian Wedding Invitation - Interactive Features
 * Aarav & Diya Wedding Celebration
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==============================================================
       0. ROYAL ENVELOPE UNBOXING ANIMATION (Animation 1)
       ============================================================== */
    const envelopeOverlay = document.getElementById('envelopeOverlay');
    const envelope = document.getElementById('envelope');
    const waxSeal = document.getElementById('waxSeal');
    const skipEnvelopeBtn = document.getElementById('skipEnvelopeBtn');
    let envelopeOpened = false;

    function openEnvelope() {
        if (envelopeOpened) return;
        envelopeOpened = true;

        // Add opened class to flip flap & slide out letter
        envelope.classList.add('opened');

        // Try playing background music automatically since user tapped!
        setTimeout(() => {
            if (!isPlaying) {
                toggleMusic();
            }
        }, 500);

        // Hide overlay smoothly after animations
        setTimeout(() => {
            envelopeOverlay.classList.add('hide-envelope');
        }, 1300);
    }

    if (waxSeal) {
        waxSeal.addEventListener('click', openEnvelope);
    }
    if (skipEnvelopeBtn) {
        skipEnvelopeBtn.addEventListener('click', () => {
            if (envelopeOverlay) {
                envelopeOverlay.classList.add('hide-envelope');
                if (!isPlaying) toggleMusic();
            }
        });
    }

    /* ==============================================================
       1. LIVE COUNTDOWN TIMER
       ============================================================== */
    // Change this to the actual wedding date & time
    const weddingDate = new Date('February 14, 2027 19:00:00').getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = weddingDate - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            daysEl.textContent = String(days).padStart(2, '0');
            hoursEl.textContent = String(hours).padStart(2, '0');
            minutesEl.textContent = String(minutes).padStart(2, '0');
            secondsEl.textContent = String(seconds).padStart(2, '0');
        } else {
            document.getElementById('timerGrid').innerHTML = `
                <div style="font-size: 1.5rem; color: #fdf5d3; font-weight: bold; padding: 10px;">
                    🎉 The Auspicious Celebrations Have Begun! 🎉
                </div>
            `;
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);


    /* ==============================================================
       2. BACKGROUND MUSIC CONTROLLER (With Web Audio Synthesizer Fallback)
       ============================================================== */
    const musicToggle = document.getElementById('musicToggle');
    const bgAudio = document.getElementById('bgMusic');
    let isPlaying = false;
    let audioCtx = null;
    let synthInterval = null;

    // Web Audio Fallback: Serene Indian tanpura / sitar harmonic drone
    function startIndianHarmonicSynth() {
        if (!window.AudioContext && !window.webkitAudioContext) return;
        if (!audioCtx || audioCtx.state === 'closed') {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const notes = [220, 277.18, 329.63, 440]; // A major meditative chords
        let step = 0;

        synthInterval = setInterval(() => {
            if (!isPlaying || !audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(notes[step % notes.length], audioCtx.currentTime);

            gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.8);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.5);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 2.6);
            step++;
        }, 1200);
    }

    function toggleMusic() {
        if (!isPlaying) {
            bgAudio.volume = 0.8;
            const playPromise = bgAudio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isPlaying = true;
                    updateMusicButtonState(true);
                }).catch((err) => {
                    console.log("Audio file play prevented, using Web Audio synthesizer:", err);
                    isPlaying = true;
                    startIndianHarmonicSynth();
                    updateMusicButtonState(true);
                });
            } else {
                isPlaying = true;
                updateMusicButtonState(true);
            }
        } else {
            bgAudio.pause();
            if (synthInterval) clearInterval(synthInterval);
            if (audioCtx) {
                audioCtx.close();
                audioCtx = null;
            }
            isPlaying = false;
            updateMusicButtonState(false);
        }
    }

    function updateMusicButtonState(playing) {
        if (playing) {
            musicToggle.classList.add('active');
            musicToggle.innerHTML = `<i class="fas fa-volume-up"></i><span class="btn-label">Playing</span>`;
        } else {
            musicToggle.classList.remove('active');
            musicToggle.innerHTML = `<i class="fas fa-music"></i><span class="btn-label">Music</span>`;
        }
    }

    musicToggle.addEventListener('click', toggleMusic);


    /* ==============================================================
       3. FLOATING MARIGOLD & ROSE PETALS PARTICLES
       ============================================================== */
    const canvas = document.getElementById('petalCanvas');
    const ctx = canvas.getContext('2d');
    let petalsEnabled = true;
    let petals = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Petal {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -20 - Math.random() * 50;
            this.size = Math.random() * 12 + 8;
            this.speedY = Math.random() * 1.5 + 0.8;
            this.speedX = (Math.random() - 0.5) * 1.2;
            this.angle = Math.random() * Math.PI * 2;
            this.angleSpeed = (Math.random() - 0.5) * 0.04;
            // Rose (crimson/pink) or Marigold (bright yellow/orange)
            this.type = Math.random() > 0.4 ? 'rose' : 'marigold';
            this.color = this.type === 'rose' 
                ? `rgba(${200 + Math.floor(Math.random() * 40)}, ${20 + Math.floor(Math.random() * 30)}, ${40 + Math.floor(Math.random() * 30)}, ${0.6 + Math.random() * 0.3})`
                : `rgba(${240 + Math.floor(Math.random() * 15)}, ${160 + Math.floor(Math.random() * 60)}, 10, ${0.7 + Math.random() * 0.3})`;
        }

        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.angle) * 1.2 + this.speedX;
            this.angle += this.angleSpeed;

            if (this.y > canvas.height + 30) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);

            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
            ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
            ctx.fill();

            ctx.restore();
        }
    }

    // Initialize 28 petals
    for (let i = 0; i < 28; i++) {
        petals.push(new Petal());
    }

    /* ==============================================================
       GOLDEN STARDUST SPARKLES (Animation 2 - Pointer/Touch Effect)
       ============================================================== */
    class Sparkle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 4 + 2;
            this.speedX = (Math.random() - 0.5) * 1.6;
            this.speedY = (Math.random() - 0.5) * 1.6 - 0.4;
            this.opacity = 1;
            this.fadeRate = Math.random() * 0.035 + 0.02;
            this.color = Math.random() > 0.3 ? '#ffe773' : '#ffffff';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= this.fadeRate;
        }

        draw() {
            if (this.opacity <= 0) return;
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#f3e5ab';

            // Draw a diamond 4-pointed sparkle star
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.size);
            ctx.lineTo(this.x + this.size * 0.3, this.y);
            ctx.lineTo(this.x, this.y + this.size);
            ctx.lineTo(this.x - this.size * 0.3, this.y);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }
    }

    let sparkles = [];

    // Pointer move listener for cursor / touch sparkles
    window.addEventListener('pointermove', (e) => {
        // Spawn 2 sparkles per move
        for (let i = 0; i < 2; i++) {
            sparkles.push(new Sparkle(e.clientX + (Math.random() - 0.5) * 8, e.clientY + (Math.random() - 0.5) * 8));
        }
        if (sparkles.length > 60) {
            sparkles.splice(0, sparkles.length - 60);
        }
    });

    /* ==============================================================
       ANIMATION 4: GRAND CELEBRATION FIREWORKS & CONFETTI ENGINE
       ============================================================== */
    const celebrationColors = ['#ffd700', '#ff2a5f', '#ff9933', '#00e676', '#ffec8b', '#e040fb', '#ffffff'];

    class FireworkSpark {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 1.5;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.gravity = 0.08;
            this.friction = 0.96;
            this.opacity = 1;
            this.fade = Math.random() * 0.02 + 0.015;
            this.size = Math.random() * 3 + 1.5;
        }

        update() {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.opacity -= this.fade;
        }

        draw() {
            if (this.opacity <= 0) return;
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 6;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    class FireworkRocket {
        constructor() {
            this.x = Math.random() * (canvas.width * 0.8) + canvas.width * 0.1;
            this.y = canvas.height;
            this.targetY = Math.random() * (canvas.height * 0.45) + canvas.height * 0.12;
            this.speed = Math.random() * 4 + 7;
            this.color = celebrationColors[Math.floor(Math.random() * celebrationColors.length)];
            this.exploded = false;
        }

        update() {
            this.y -= this.speed;
            if (this.y <= this.targetY) {
                this.explode();
            }
        }

        explode() {
            this.exploded = true;
            // Spawn 45 sparks
            for (let i = 0; i < 45; i++) {
                fireworkSparks.push(new FireworkSpark(this.x, this.y, this.color));
            }
        }

        draw() {
            if (this.exploded) return;
            ctx.save();
            ctx.fillStyle = '#fff';
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fillRect(this.x - 1.5, this.y, 3, 10);
            ctx.restore();
        }
    }

    class CelebrationConfetti {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = -10 - Math.random() * 20;
            this.sizeW = Math.random() * 8 + 6;
            this.sizeH = Math.random() * 5 + 4;
            this.color = celebrationColors[Math.floor(Math.random() * celebrationColors.length)];
            this.vx = (Math.random() - 0.5) * 3;
            this.vy = Math.random() * 2.5 + 2;
            this.rot = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 8;
            this.opacity = 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.rot += this.rotSpeed;
            if (this.y > canvas.height + 20) {
                this.opacity = 0;
            }
        }

        draw() {
            if (this.opacity <= 0) return;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rot * Math.PI) / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.sizeW / 2, -this.sizeH / 2, this.sizeW, this.sizeH);
            ctx.restore();
        }
    }

    let fireworkRockets = [];
    let fireworkSparks = [];
    let celebrationConfettis = [];

    // Trigger celebration fireworks & confetti burst
    function triggerCelebrationFireworks(rocketCount = 6) {
        // Launch rockets with staggered delays
        for (let i = 0; i < rocketCount; i++) {
            setTimeout(() => {
                fireworkRockets.push(new FireworkRocket());
            }, i * 280);
        }

        // Add 50 pieces of fluttering golden celebratory confetti
        for (let i = 0; i < 50; i++) {
            celebrationConfettis.push(new CelebrationConfetti());
        }

        // Play festive audio chime if Web Audio is available
        playCelebrationChime();
    }

    function playCelebrationChime() {
        try {
            const ctxAudio = new (window.AudioContext || window.webkitAudioContext)();
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major festive arpeggio
            notes.forEach((freq, idx) => {
                const osc = ctxAudio.createOscillator();
                const gain = ctxAudio.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, ctxAudio.currentTime + idx * 0.1);
                gain.gain.setValueAtTime(0.001, ctxAudio.currentTime + idx * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.08, ctxAudio.currentTime + idx * 0.1 + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.0001, ctxAudio.currentTime + idx * 0.1 + 0.6);
                osc.connect(gain);
                gain.connect(ctxAudio.destination);
                osc.start(ctxAudio.currentTime + idx * 0.1);
                osc.stop(ctxAudio.currentTime + idx * 0.1 + 0.65);
            });
        } catch (e) {
            // Audio context silently skipped if restricted
        }
    }

    const celebrateBtn = document.getElementById('celebrateBtn');
    if (celebrateBtn) {
        celebrateBtn.addEventListener('click', () => {
            triggerCelebrationFireworks(7);
        });
    }

    function animatePetals() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Draw falling petals if enabled
        if (petalsEnabled) {
            petals.forEach(petal => {
                petal.update();
                petal.draw();
            });
        }

        // 2. Draw golden stardust sparkles
        for (let i = sparkles.length - 1; i >= 0; i--) {
            const sp = sparkles[i];
            sp.update();
            sp.draw();
            if (sp.opacity <= 0) {
                sparkles.splice(i, 1);
            }
        }

        // 3. Draw and update firework rockets
        for (let i = fireworkRockets.length - 1; i >= 0; i--) {
            const rocket = fireworkRockets[i];
            rocket.update();
            rocket.draw();
            if (rocket.exploded) {
                fireworkRockets.splice(i, 1);
            }
        }

        // 4. Draw and update firework sparks
        for (let i = fireworkSparks.length - 1; i >= 0; i--) {
            const spark = fireworkSparks[i];
            spark.update();
            spark.draw();
            if (spark.opacity <= 0) {
                fireworkSparks.splice(i, 1);
            }
        }

        // 5. Draw and update celebration confetti
        for (let i = celebrationConfettis.length - 1; i >= 0; i--) {
            const conf = celebrationConfettis[i];
            conf.update();
            conf.draw();
            if (conf.opacity <= 0) {
                celebrationConfettis.splice(i, 1);
            }
        }

        requestAnimationFrame(animatePetals);
    }
    animatePetals();

    const petalToggle = document.getElementById('petalToggle');
    petalToggle.addEventListener('click', () => {
        petalsEnabled = !petalsEnabled;
        if (!petalsEnabled) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            petalToggle.classList.remove('active');
            petalToggle.innerHTML = `<i class="fas fa-eye-slash"></i><span class="btn-label">Petals Off</span>`;
        } else {
            petalToggle.classList.add('active');
            petalToggle.innerHTML = `<i class="fas fa-spa"></i><span class="btn-label">Petals On</span>`;
        }
    });


    /* ==============================================================
       4. PHOTO GALLERY LIGHTBOX MODAL
       ============================================================== */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('modalImg');
    const modalCaption = document.getElementById('modalCaption');
    const closeModal = document.querySelector('.close-modal');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const caption = item.getAttribute('data-caption') || img.alt;
            modal.style.display = 'block';
            modalImg.src = img.src;
            modalCaption.textContent = caption;
        });
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });


    /* ==============================================================
       5. RSVP FORM & WISHES WALL
       ============================================================== */
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpSuccessAlert = document.getElementById('rsvpSuccessAlert');
    const wishesGrid = document.getElementById('wishesGrid');

    // Load saved wishes from localStorage
    function loadSavedWishes() {
        const savedWishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
        savedWishes.forEach(wish => appendWishToGrid(wish.name, wish.message));
    }

    function appendWishToGrid(name, message) {
        if (!message || message.trim() === '') return;
        const card = document.createElement('div');
        card.className = 'wish-card';
        card.innerHTML = `
            <p class="wish-text">"${escapeHtml(message)}"</p>
            <span class="wish-author">— ${escapeHtml(name)}</span>
        `;
        wishesGrid.insertBefore(card, wishesGrid.firstChild);
    }

    function escapeHtml(string) {
        const div = document.createElement('div');
        div.textContent = string;
        return div.innerHTML;
    }

    loadSavedWishes();

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('guestName').value.trim();
        const phone = document.getElementById('guestPhone').value.trim();
        const status = document.getElementById('attendanceStatus').value;
        const count = document.getElementById('guestCount').value;
        const message = document.getElementById('guestMessage').value.trim();

        const checkedEvents = Array.from(document.querySelectorAll('input[name="events_attending"]:checked'))
            .map(cb => cb.value);

        const rsvpData = {
            name,
            phone,
            status,
            count,
            events: checkedEvents,
            message,
            timestamp: new Date().toISOString()
        };

        // Save RSVP entry
        const allRsvps = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
        allRsvps.push(rsvpData);
        localStorage.setItem('wedding_rsvps', JSON.stringify(allRsvps));

        // If message is provided, also add to wishes wall
        if (message) {
            const allWishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
            allWishes.push({ name, message });
            localStorage.setItem('wedding_wishes', JSON.stringify(allWishes));
            appendWishToGrid(name, message);
        }

        // Hide form and show success confirmation
        rsvpForm.style.display = 'none';
        rsvpSuccessAlert.style.display = 'block';

        // Trigger grand celebration fireworks & confetti shower!
        triggerCelebrationFireworks(8);

        // Scroll smoothly to success alert
        rsvpSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });


    /* ==============================================================
       6. COPY ADDRESS & ADD TO GOOGLE CALENDAR
       ============================================================== */
    const copyAddressBtn = document.getElementById('copyAddressBtn');
    copyAddressBtn.addEventListener('click', () => {
        const addressText = "The Grand Heritage Palace, Amer Road, Jal Mahal Precinct, Jaipur, Rajasthan - 302002";
        navigator.clipboard.writeText(addressText).then(() => {
            const originalText = copyAddressBtn.innerHTML;
            copyAddressBtn.innerHTML = `<i class="fas fa-check"></i> Address Copied!`;
            setTimeout(() => {
                copyAddressBtn.innerHTML = originalText;
            }, 2500);
        });
    });

    const addToCalBtn = document.getElementById('addToCalBtn');
    addToCalBtn.addEventListener('click', () => {
        const title = encodeURIComponent("Aarav & Diya's Royal Wedding");
        const details = encodeURIComponent("You are cordially invited to celebrate the grand wedding ceremony of Aarav & Diya at The Grand Heritage Palace, Jaipur!");
        const location = encodeURIComponent("The Grand Heritage Palace, Amer Road, Jal Mahal Precinct, Jaipur, Rajasthan");
        const dates = "20270214T133000Z/20270215T043000Z"; // UTC start and end

        const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
        window.open(gCalUrl, '_blank');
    });

    /* ==============================================================
       7. PARALLAX MANDALA ROTATION ON SCROLL (Animation 3)
       ============================================================== */
    const headerMandala = document.querySelector('.header-mandala');
    if (headerMandala) {
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY;
            headerMandala.style.transform = `translate(-50%, -50%) rotate(${scrollPos * 0.08}deg)`;
        }, { passive: true });
    }

    /* ==============================================================
       8. PERSONALIZED GUEST GREETING & WHATSAPP GENERATOR
       ============================================================== */
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get('to') || urlParams.get('guest') || urlParams.get('name');
    const guestDisplayTitle = document.getElementById('guestDisplayTitle');
    const envelopeGuestName = document.getElementById('envelopeGuestName');

    if (guestParam && guestParam.trim() !== '') {
        const cleanName = decodeURIComponent(guestParam.trim());
        if (guestDisplayTitle) {
            guestDisplayTitle.textContent = `आदरणीय ${cleanName} एवं सपरिवार`;
        }
        if (envelopeGuestName) {
            envelopeGuestName.textContent = `॥ सस्नेह निमंत्रण: ${cleanName} ॥`;
        }
    }

    // WhatsApp Share Modal
    const whatsappShareBtn = document.getElementById('whatsappShareBtn');
    const shareModal = document.getElementById('shareModal');
    const closeShareModal = document.getElementById('closeShareModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const inviteGuestInput = document.getElementById('inviteGuestInput');
    const previewMsgText = document.getElementById('previewMsgText');
    const directWhatsappSendBtn = document.getElementById('directWhatsappSendBtn');
    const copyShareLinkBtn = document.getElementById('copyShareLinkBtn');
    const shareCopyAlert = document.getElementById('shareCopyAlert');

    function updateWhatsAppPreview() {
        if (!previewMsgText || !directWhatsappSendBtn) return;
        const guestName = (inviteGuestInput && inviteGuestInput.value.trim()) ? inviteGuestInput.value.trim() : 'सपरिवार';
        const baseUrl = window.location.origin + window.location.pathname;
        const personalizedLink = `${baseUrl}?to=${encodeURIComponent(guestName)}`;

        const message = `॥ श्री गणेशाय नमः ॥\n\nआदरणीय ${guestName},\n\nआरव और दीया के शुभ विवाह समारोह में आप सपरिवार सादर आमंत्रित हैं।\n\n🗓️ दिनांक: 14 फरवरी 2027\n📍 स्थान: The Grand Heritage Palace, Jaipur\n\nकृपया अपना डिजिटल निमंत्रण पत्र यहां देखें:\n${personalizedLink}`;

        previewMsgText.textContent = message;
        directWhatsappSendBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    }

    if (whatsappShareBtn && shareModal) {
        whatsappShareBtn.addEventListener('click', () => {
            shareModal.style.display = 'flex';
            updateWhatsAppPreview();
        });
    }

    if (closeShareModal && shareModal) {
        closeShareModal.addEventListener('click', () => {
            shareModal.style.display = 'none';
        });
    }
    if (modalBackdrop && shareModal) {
        modalBackdrop.addEventListener('click', () => {
            shareModal.style.display = 'none';
        });
    }

    if (inviteGuestInput) {
        inviteGuestInput.addEventListener('input', updateWhatsAppPreview);
    }

    if (copyShareLinkBtn) {
        copyShareLinkBtn.addEventListener('click', () => {
            const guestName = (inviteGuestInput && inviteGuestInput.value.trim()) ? inviteGuestInput.value.trim() : 'सपरिवार';
            const baseUrl = window.location.origin + window.location.pathname;
            const personalizedLink = `${baseUrl}?to=${encodeURIComponent(guestName)}`;

            navigator.clipboard.writeText(personalizedLink).then(() => {
                if (shareCopyAlert) {
                    shareCopyAlert.style.display = 'block';
                    setTimeout(() => {
                        shareCopyAlert.style.display = 'none';
                    }, 2500);
                }
            });
        });
    }

    /* ==============================================================
       9. RSVP ADMIN PORTAL & EXCEL/CSV EXPORT
       ============================================================== */
    const adminPortalBtn = document.getElementById('adminPortalBtn');
    const adminModal = document.getElementById('adminModal');
    const closeAdminModal = document.getElementById('closeAdminModal');
    const adminModalBackdrop = document.getElementById('adminModalBackdrop');
    const rsvpTableBody = document.getElementById('rsvpTableBody');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const addSampleRsvpBtn = document.getElementById('addSampleRsvpBtn');
    const clearRsvpsBtn = document.getElementById('clearRsvpsBtn');

    function checkAdminAuthAndOpen() {
        const pin = prompt("Enter Host Admin Passcode (Default: 1234):");
        if (pin === "1234") {
            adminModal.style.display = "flex";
            renderAdminDashboard();
        } else if (pin !== null) {
            alert("Incorrect passcode! Please try again with '1234'.");
        }
    }

    function renderAdminDashboard() {
        const rsvps = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');

        let attendingParties = 0;
        let totalHeadcount = 0;
        let declinedCount = 0;

        rsvpTableBody.innerHTML = '';

        if (rsvps.length === 0) {
            rsvpTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:#888;">No RSVPs received yet. Click "Add Sample RSVPs" to test.</td></tr>`;
        } else {
            rsvps.forEach(item => {
                const isAttending = item.status !== 'regretfully_declined';
                const guestCount = parseInt(item.count || 1, 10);

                if (isAttending) {
                    attendingParties++;
                    totalHeadcount += guestCount;
                } else {
                    declinedCount++;
                }

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${escapeHtml(item.name)}</strong></td>
                    <td>${escapeHtml(item.phone || '-')}</td>
                    <td><span class="status-badge ${isAttending ? 'status-attending' : 'status-declined'}">${isAttending ? 'Attending' : 'Declined'}</span></td>
                    <td>${isAttending ? guestCount : 0}</td>
                    <td>${escapeHtml(Array.isArray(item.events) ? item.events.join(', ') : '-')}</td>
                    <td style="max-width:200px; font-style:italic;">"${escapeHtml(item.message || 'Best wishes')}"</td>
                `;
                rsvpTableBody.appendChild(tr);
            });
        }

        document.getElementById('statTotalRsvp').textContent = rsvps.length;
        document.getElementById('statAttendingCount').textContent = attendingParties;
        document.getElementById('statTotalHeadcount').textContent = totalHeadcount;
        document.getElementById('statDeclinedCount').textContent = declinedCount;
    }

    if (adminPortalBtn) {
        adminPortalBtn.addEventListener('click', checkAdminAuthAndOpen);
    }
    if (closeAdminModal) {
        closeAdminModal.addEventListener('click', () => { adminModal.style.display = 'none'; });
    }
    if (adminModalBackdrop) {
        adminModalBackdrop.addEventListener('click', () => { adminModal.style.display = 'none'; });
    }

    // Export to Excel / CSV with UTF-8 BOM
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', () => {
            const rsvps = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
            if (rsvps.length === 0) {
                alert("No RSVP data available to export!");
                return;
            }

            let csvContent = "\uFEFF"; // UTF-8 Byte Order Mark for Excel
            csvContent += "Guest Name,Phone Number,Status,Guest Count,Events Attending,Wishes/Message,Timestamp\n";

            rsvps.forEach(r => {
                const row = [
                    `"${(r.name || '').replace(/"/g, '""')}"`,
                    `"${(r.phone || '').replace(/"/g, '""')}"`,
                    `"${(r.status || '').replace(/"/g, '""')}"`,
                    r.count || 1,
                    `"${(Array.isArray(r.events) ? r.events.join('; ') : '').replace(/"/g, '""')}"`,
                    `"${(r.message || '').replace(/"/g, '""')}"`,
                    `"${(r.timestamp || '').replace(/"/g, '""')}"`
                ];
                csvContent += row.join(",") + "\n";
            });

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `wedding_guest_list_aarav_diya_${new Date().toISOString().slice(0,10)}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // Add Sample RSVPs for testing
    if (addSampleRsvpBtn) {
        addSampleRsvpBtn.addEventListener('click', () => {
            const samples = [
                { name: "Kailash Verma & Family", phone: "+91 98290 12345", status: "joyfully_attending", count: 4, events: ["Haldi", "Sangeet", "Wedding", "Reception"], message: "Congratulations! Looking forward to celebrating with all of you.", timestamp: new Date().toISOString() },
                { name: "Dr. Sunil Mehta", phone: "+91 94140 56789", status: "joyfully_attending", count: 2, events: ["Wedding", "Reception"], message: "Lots of blessings and joy to the young couple!", timestamp: new Date().toISOString() },
                { name: "Anita & Rakesh Singhal", phone: "+91 98291 99887", status: "attending_solo", count: 1, events: ["Sangeet", "Wedding"], message: "Very excited to dance at the Sangeet!", timestamp: new Date().toISOString() },
                { name: "Uncle Devendra (USA)", phone: "+1 408 555 0199", status: "regretfully_declined", count: 0, events: [], message: "Hearty congratulations from California! Sending our heartfelt blessings.", timestamp: new Date().toISOString() }
            ];

            const existing = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
            const updated = existing.concat(samples);
            localStorage.setItem('wedding_rsvps', JSON.stringify(updated));
            renderAdminDashboard();
        });
    }

    // Clear RSVPs
    if (clearRsvpsBtn) {
        clearRsvpsBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to clear the entire RSVP list?")) {
                localStorage.removeItem('wedding_rsvps');
                renderAdminDashboard();
            }
        });
    }

});

