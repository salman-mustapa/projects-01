/**
 * Virtual Lab Interaktif IPA Kelas VII - Materi Pengukuran
 * - Jangka Sorong (Vernier Caliper) Realtime Simulator
 * - Neraca Pegas (Spring Balance) Damped Physics Simulator
 * - Pengukuran Waktu & Bandul Harmonik (Pendulum Lab) Simulator
 * - LKPD Digital Calculator
 */

// ==========================================
// 1. JANGKA SORONG SIMULATOR
// ==========================================
class VernierCaliperSim {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.currentValue = 2.34; // in cm (SU=2.3, SN=4)
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartVal = 0;
        this.selectedObject = "free"; // free, coin, cylinder, beaker, bolt
        this.objects = {
            free: { name: "Mode Bebas (Eksplorasi)", val: 2.34, color: "#94a3b8" },
            coin: { name: "Koin Logam Rp1.000", val: 2.45, color: "#eab308" },
            cylinder: { name: "Silinder Logam", val: 3.12, color: "#93c5fd" },
            beaker: { name: "Gelas Kimia (Diameter Luar)", val: 4.56, color: "#67e8f9" },
            bolt: { name: "Baut Mesin Presisi", val: 1.73, color: "#f97316" }
        };
    }

    init() {
        this.canvas = document.getElementById("vernier-canvas");
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext("2d");

        this.setupEvents();
        this.draw();
        this.updateReadout();
    }

    setupEvents() {
        if (!this.canvas) return;

        const getPos = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            return clientX - rect.left;
        };

        const onStart = (e) => {
            if (this.selectedObject !== "free") return;
            this.isDragging = true;
            this.dragStartX = getPos(e);
            this.dragStartVal = this.currentValue;
        };

        const onMove = (e) => {
            if (!this.isDragging) return;
            const x = getPos(e);
            const dx = x - this.dragStartX;
            // Scale: 1 cm = 80 pixels
            let newVal = this.dragStartVal + (dx / 80);
            if (newVal < 0) newVal = 0;
            if (newVal > 8) newVal = 8;
            this.currentValue = Math.round(newVal * 100) / 100;
            this.draw();
            this.updateReadout();
        };

        const onEnd = () => {
            this.isDragging = false;
        };

        this.canvas.addEventListener("mousedown", onStart);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onEnd);

        this.canvas.addEventListener("touchstart", onStart, { passive: true });
        window.addEventListener("touchmove", onMove, { passive: true });
        window.addEventListener("touchend", onEnd);
    }

    setObject(key) {
        if (!this.objects[key]) return;
        this.selectedObject = key;
        window.sound.playClick();
        if (key !== "free") {
            this.currentValue = this.objects[key].val;
        }
        this.draw();
        this.updateReadout();
    }

    setValue(val) {
        this.currentValue = Math.max(0, Math.min(8, val));
        this.draw();
        this.updateReadout();
    }

    updateReadout() {
        const su = Math.floor(this.currentValue * 10) / 10;
        const sn = Math.round((this.currentValue - su) * 100);
        
        const suEl = document.getElementById("caliper-su-val");
        const snEl = document.getElementById("caliper-sn-val");
        const totalEl = document.getElementById("caliper-total-val");

        if (suEl) suEl.textContent = `${su.toFixed(1)} cm`;
        if (snEl) snEl.textContent = `${sn} (× 0,01 cm = ${(sn * 0.01).toFixed(2)} cm)`;
        if (totalEl) totalEl.textContent = `${this.currentValue.toFixed(2)} cm`;
    }

    checkAnswer() {
        const inputSU = parseFloat(document.getElementById("input-caliper-su")?.value || "0");
        const inputSN = parseFloat(document.getElementById("input-caliper-sn")?.value || "0");
        const feedbackEl = document.getElementById("caliper-feedback");
        if (!feedbackEl) return;

        const trueSU = Math.floor(this.currentValue * 10) / 10;
        const trueSN = Math.round((this.currentValue - trueSU) * 100);
        const trueTotal = this.currentValue;

        const studentTotal = Math.round((inputSU + (inputSN * 0.01)) * 100) / 100;

        if (Math.abs(studentTotal - trueTotal) < 0.02) {
            window.sound.playSuccess();
            feedbackEl.className = "sim-feedback success";
            feedbackEl.innerHTML = `🎉 <strong>Hebat Sekali! Pembacaan Benar!</strong><br>
                Skala Utama (SU) = ${trueSU.toFixed(1)} cm<br>
                Skala Nonius (SN) = ${trueSN} × 0,01 = ${(trueSN * 0.01).toFixed(2)} cm<br>
                <strong>Hasil Akhir = ${trueTotal.toFixed(2)} cm</strong>`;
        } else {
            window.sound.playError();
            feedbackEl.className = "sim-feedback error";
            feedbackEl.innerHTML = `❌ <strong>Kurang Tepat, Coba Lagi!</strong><br>
                Petunjuk: Skala Utama adalah angka sebelum garis 0 nonius. Skala Nonius adalah garis yang lurus sejajar.<br>
                Jawaban seharusnya: SU = ${trueSU.toFixed(1)} cm, SN = ${trueSN}, Total = ${trueTotal.toFixed(2)} cm`;
        }
    }

    draw() {
        if (!this.canvas || !this.ctx) return;
        const c = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        c.clearRect(0, 0, w, h);

        const originX = 140; // Jaw zero point
        const originY = 120;
        const pxPerCm = 80;
        const pxPerMm = pxPerCm / 10;

        // Draw Object if selected
        if (this.selectedObject !== "free") {
            const obj = this.objects[this.selectedObject];
            const objW = this.currentValue * pxPerCm;
            c.save();
            c.fillStyle = obj.color;
            c.strokeStyle = "#334155";
            c.lineWidth = 2;
            
            // Draw clamped object between jaws
            c.fillRect(originX, originY - 70, objW, 70);
            c.strokeRect(originX, originY - 70, objW, 70);

            // Object text
            c.fillStyle = "#1e293b";
            c.font = "bold 13px 'Fredoka', sans-serif";
            c.textAlign = "center";
            c.fillText(obj.name, originX + objW / 2, originY - 35);
            c.restore();
        }

        // --- 1. MAIN BODY (Fixed Part) ---
        c.save();
        c.fillStyle = "#cbd5e1";
        c.strokeStyle = "#64748b";
        c.lineWidth = 2;

        // Main bar (Rule bar)
        c.fillRect(originX, originY, w - originX - 20, 65);
        c.strokeRect(originX, originY, w - originX - 20, 65);

        // Fixed Left Lower Jaw (Rahang Tetap Bawah)
        c.beginPath();
        c.moveTo(originX, originY);
        c.lineTo(originX - 60, originY);
        c.lineTo(originX - 60, originY - 95);
        c.lineTo(originX, originY - 95);
        c.lineTo(originX, originY);
        c.fillStyle = "#cbd5e1";
        c.fill();
        c.stroke();

        // Main Scale markings (0 to 8 cm)
        c.fillStyle = "#0f172a";
        c.font = "11px 'Outfit', sans-serif";
        c.textAlign = "center";

        for (let mm = 0; mm <= 80; mm++) {
            const x = originX + mm * pxPerMm;
            if (x > w - 30) break;

            let tickH = 8;
            if (mm % 10 === 0) {
                tickH = 20;
                c.fillText((mm / 10).toString(), x, originY + tickH + 14);
            } else if (mm % 5 === 0) {
                tickH = 14;
            }

            c.beginPath();
            c.moveTo(x, originY);
            c.lineTo(x, originY + tickH);
            c.strokeStyle = "#334155";
            c.lineWidth = mm % 10 === 0 ? 1.8 : 1;
            c.stroke();
        }

        c.fillStyle = "#475569";
        c.font = "bold 12px 'Outfit', sans-serif";
        c.fillText("cm (Skala Utama)", originX + 70 * pxPerMm, originY + 52);
        c.restore();

        // --- 2. SLIDING VERNIER JAW (Rahang Geser) ---
        const slideX = originX + (this.currentValue * pxPerCm);

        c.save();
        // Sliding caliper carriage
        c.fillStyle = "#f8fafc";
        c.strokeStyle = "#3b82f6";
        c.lineWidth = 2.5;

        // Sliding lower jaw
        c.beginPath();
        c.moveTo(slideX, originY);
        c.lineTo(slideX + 110, originY);
        c.lineTo(slideX + 110, originY + 80);
        c.lineTo(slideX, originY + 80);
        c.closePath();
        c.fill();
        c.stroke();

        // Jaw extending up to clamp object
        c.beginPath();
        c.moveTo(slideX, originY);
        c.lineTo(slideX + 45, originY);
        c.lineTo(slideX + 45, originY - 95);
        c.lineTo(slideX, originY - 95);
        c.closePath();
        c.fillStyle = "#e2e8f0";
        c.fill();
        c.stroke();

        // Vernier scale markings (10 divisions = 9 mm on main scale)
        // 1 vernier division = 0.9 mm = 0.9 * pxPerMm
        const vernierStep = 0.9 * pxPerMm;
        c.fillStyle = "#1e3a8a";
        c.font = "10px 'Outfit', sans-serif";
        c.textAlign = "center";

        for (let v = 0; v <= 10; v++) {
            const vx = slideX + v * vernierStep;
            let vH = (v % 5 === 0) ? 14 : 9;

            c.beginPath();
            c.moveTo(vx, originY + 38);
            c.lineTo(vx, originY + 38 - vH);
            c.strokeStyle = "#1d4ed8";
            c.lineWidth = 1.2;
            c.stroke();

            if (v % 2 === 0) {
                c.fillText(v.toString(), vx, originY + 52);
            }
        }

        c.font = "bold 10px 'Outfit', sans-serif";
        c.fillText("Nonius (0.01 cm)", slideX + 5 * vernierStep, originY + 70);

        // Drag handle indicator
        c.fillStyle = "#3b82f6";
        c.beginPath();
        c.roundRect(slideX + 75, originY + 15, 26, 48, 6);
        c.fill();
        c.fillStyle = "#ffffff";
        c.font = "11px 'Outfit', sans-serif";
        c.fillText("↔", slideX + 88, originY + 44);

        c.restore();

        // Zero index alignment guide arrow
        c.save();
        c.fillStyle = "#ef4444";
        c.beginPath();
        c.moveTo(slideX, originY + 36);
        c.lineTo(slideX - 4, originY + 42);
        c.lineTo(slideX + 4, originY + 42);
        c.closePath();
        c.fill();
        c.restore();
    }
}

// ==========================================
// 2. NERACA PEGAS SIMULATOR
// ==========================================
class SpringBalanceSim {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gravity = 9.8; // m/s^2 (Earth default)
        this.selectedObject = "none";
        this.currentMass = 0; // in kg
        this.springY = 0; // animated extension
        this.targetSpringY = 0;
        this.velocity = 0;
        this.animId = null;

        this.objects = {
            none: { name: "Tanpa Beban", massKg: 0, color: "transparent" },
            cylinder: { name: "Silinder Logam (250g)", massKg: 0.25, color: "#93c5fd", w: 32, h: 48 },
            block: { name: "Balok Kayu (120g)", massKg: 0.12, color: "#d97706", w: 38, h: 38 },
            stone: { name: "Batu Kerikil (320g)", massKg: 0.32, color: "#64748b", w: 36, h: 44 },
            key: { name: "Kunci Gembok (60g)", massKg: 0.06, color: "#eab308", w: 26, h: 36 }
        };
    }

    init() {
        this.canvas = document.getElementById("spring-canvas");
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext("2d");
        this.startLoop();
        this.updateReadout();
    }

    setGravity(g) {
        this.gravity = parseFloat(g);
        window.sound.playClick();
        this.updateTarget();
    }

    setObject(key) {
        this.selectedObject = key;
        const obj = this.objects[key] || this.objects.none;
        this.currentMass = obj.massKg;
        window.sound.playPop();
        this.updateTarget();
    }

    setCustomMass(gVal) {
        this.selectedObject = "custom";
        this.currentMass = parseFloat(gVal) / 1000;
        this.updateTarget();
    }

    updateTarget() {
        // Force F = m * g (in Newton)
        const force = this.currentMass * this.gravity;
        // Max scale is 5 N = 160 px extension
        const maxForce = 5.0;
        const clampedForce = Math.min(force, maxForce);
        this.targetSpringY = (clampedForce / maxForce) * 160;
        this.updateReadout();
    }

    updateReadout() {
        const force = this.currentMass * this.gravity;
        const massG = this.currentMass * 1000;
        
        const fEl = document.getElementById("spring-force-val");
        const mEl = document.getElementById("spring-mass-val");
        const gEl = document.getElementById("spring-gravity-val");
        const calcEl = document.getElementById("spring-calc-val");

        if (fEl) fEl.textContent = `${force.toFixed(2)} N`;
        if (mEl) mEl.textContent = `${massG.toFixed(0)} g (${this.currentMass.toFixed(3)} kg)`;
        if (gEl) gEl.textContent = `${this.gravity.toFixed(1)} m/s²`;
        if (calcEl) {
            calcEl.textContent = `M = w / g = ${force.toFixed(2)} N ÷ ${this.gravity.toFixed(1)} m/s² = ${(force / this.gravity).toFixed(3)} kg`;
        }
    }

    startLoop() {
        const animate = () => {
            // Spring damped oscillation physics
            const springK = 0.12;
            const damping = 0.85;
            const forceDiff = this.targetSpringY - this.springY;
            this.velocity += forceDiff * springK;
            this.velocity *= damping;
            this.springY += this.velocity;

            this.draw();
            this.animId = requestAnimationFrame(animate);
        };
        animate();
    }

    draw() {
        if (!this.canvas || !this.ctx) return;
        const c = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        c.clearRect(0, 0, w, h);

        const centerX = w / 2;
        const topY = 40;

        // 1. Stand and clamp (Statif)
        c.save();
        c.fillStyle = "#334155";
        // Base
        c.fillRect(centerX - 100, h - 25, 200, 16);
        // Vertical rod
        c.fillRect(centerX - 90, topY - 20, 14, h - topY);
        // Horizontal arm
        c.fillRect(centerX - 90, topY - 20, 100, 14);
        c.restore();

        // 2. Spring Scale Outer Body (Casing Neraca Pegas)
        c.save();
        c.fillStyle = "rgba(224, 242, 254, 0.9)"; // translucent blue casing
        c.strokeStyle = "#0284c7";
        c.lineWidth = 2.5;

        // Top hook ring
        c.beginPath();
        c.arc(centerX, topY + 5, 8, 0, Math.PI * 2);
        c.stroke();

        // Tubular casing
        c.beginPath();
        c.roundRect(centerX - 24, topY + 15, 48, 220, 8);
        c.fill();
        c.stroke();

        // Scale Markings on casing (0 to 5 N)
        c.fillStyle = "#0369a1";
        c.font = "bold 9px 'Outfit', sans-serif";
        c.textAlign = "right";

        for (let n = 0; n <= 5; n++) {
            const ny = topY + 35 + (n / 5) * 160;
            // Newton ticks (Right side)
            c.beginPath();
            c.moveTo(centerX + 18, ny);
            c.lineTo(centerX + 6, ny);
            c.strokeStyle = "#0284c7";
            c.lineWidth = 1.5;
            c.stroke();
            c.fillText(`${n}N`, centerX + 20, ny + 3);

            // Gram ticks (Left side) (n * 100g approx)
            c.textAlign = "left";
            c.fillText(`${n * 100}g`, centerX - 22, ny + 3);
        }
        c.restore();

        // 3. Elastic Spring Coils (Pegas Spiral)
        c.save();
        c.strokeStyle = "#dc2626";
        c.lineWidth = 2.5;
        c.lineCap = "round";
        c.lineJoin = "round";

        const springStartY = topY + 30;
        const springCurrentH = 40 + this.springY * 0.7; // elongates
        const coils = 12;
        const coilStep = springCurrentH / coils;

        c.beginPath();
        c.moveTo(centerX, springStartY);
        for (let i = 0; i <= coils; i++) {
            const cy = springStartY + i * coilStep;
            const cx = centerX + (i % 2 === 0 ? -10 : 10);
            c.lineTo(cx, cy);
        }
        c.lineTo(centerX, springStartY + springCurrentH);
        c.stroke();
        c.restore();

        // 4. Pointer / Indicator Plate (Jarum Penunjuk)
        const pointerY = topY + 35 + this.springY;
        c.save();
        c.fillStyle = "#ef4444";
        c.beginPath();
        c.moveTo(centerX - 16, pointerY);
        c.lineTo(centerX + 16, pointerY);
        c.lineTo(centerX + 16, pointerY + 4);
        c.lineTo(centerX - 16, pointerY + 4);
        c.closePath();
        c.fill();

        // Pointer center line
        c.strokeStyle = "#ffffff";
        c.lineWidth = 1.5;
        c.beginPath();
        c.moveTo(centerX - 16, pointerY + 2);
        c.lineTo(centerX + 16, pointerY + 2);
        c.stroke();
        c.restore();

        // 5. Bottom Extension Rod and Hook
        const bottomRodY = topY + 230 + (this.springY * 0.3);
        c.save();
        c.strokeStyle = "#475569";
        c.lineWidth = 3;
        c.beginPath();
        c.moveTo(centerX, topY + 225);
        c.lineTo(centerX, bottomRodY);
        c.stroke();

        // Hook (Kait)
        c.beginPath();
        c.arc(centerX + 6, bottomRodY + 8, 8, Math.PI, 0, true);
        c.stroke();
        c.restore();

        // 6. Suspended Object
        if (this.selectedObject !== "none") {
            const obj = this.objects[this.selectedObject] || {
                name: `Beban (${(this.currentMass * 1000).toFixed(0)}g)`,
                color: "#10b981",
                w: 36,
                h: 46
            };

            const objY = bottomRodY + 16;
            c.save();
            c.fillStyle = obj.color;
            c.strokeStyle = "#1e293b";
            c.lineWidth = 2;

            c.beginPath();
            c.roundRect(centerX - obj.w / 2, objY, obj.w, obj.h, 6);
            c.fill();
            c.stroke();

            // Object label
            c.fillStyle = "#ffffff";
            c.font = "bold 10px 'Fredoka', sans-serif";
            c.textAlign = "center";
            c.fillText(`${(this.currentMass * 1000).toFixed(0)}g`, centerX, objY + obj.h / 2 + 3);
            c.restore();
        }
    }
}

// ==========================================
// 3. PENGUKURAN WAKTU & BANDUL SIMULATOR
// ==========================================
class PendulumLabSim {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.length = 0.50; // m (0.3, 0.5, 0.7, 1.0)
        this.mass = 1.0; // kg
        this.gravity = 9.8;
        this.angle = 0.25; // radians (~14 degrees initial release)
        this.angularVel = 0;
        this.angularAcc = 0;
        this.isPlaying = false;
        this.lastTime = null;

        // Stopwatch state
        this.swRunning = false;
        this.swStartTime = 0;
        this.swElapsed = 0;
        this.swTimer = null;
        this.swingCount = 0;
        this.prevAngle = 0;
    }

    init() {
        this.canvas = document.getElementById("pendulum-canvas");
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext("2d");
        this.startLoop();
        this.updateStats();
    }

    setLength(l) {
        this.length = parseFloat(l);
        window.sound.playClick();
        this.updateStats();
    }

    setMass(m) {
        this.mass = parseFloat(m);
        window.sound.playClick();
        this.updateStats();
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;
        window.sound.playClick();
        const btn = document.getElementById("pendulum-play-btn");
        if (btn) {
            btn.innerHTML = this.isPlaying ? "⏸️ Jeda Bandul" : "▶️ Lepaskan Bandul";
        }
    }

    reset() {
        this.isPlaying = false;
        this.angle = 0.25;
        this.angularVel = 0;
        this.swingCount = 0;
        const btn = document.getElementById("pendulum-play-btn");
        if (btn) btn.innerHTML = "▶️ Lepaskan Bandul";
        this.resetStopwatch();
        this.updateStats();
    }

    // Stopwatch methods
    toggleStopwatch() {
        window.sound.playClick();
        const btn = document.getElementById("sw-toggle-btn");
        if (!this.swRunning) {
            this.swRunning = true;
            this.swStartTime = performance.now() - this.swElapsed;
            this.swTimer = setInterval(() => {
                this.swElapsed = performance.now() - this.swStartTime;
                this.updateStopwatchDisplay();
            }, 50);
            if (btn) btn.innerHTML = "⏹️ Hentikan Stopwatch";
        } else {
            this.swRunning = false;
            clearInterval(this.swTimer);
            if (btn) btn.innerHTML = "▶️ Lanjutkan";
            this.calculateResults();
        }
    }

    resetStopwatch() {
        this.swRunning = false;
        clearInterval(this.swTimer);
        this.swElapsed = 0;
        this.swingCount = 0;
        this.updateStopwatchDisplay();
        const btn = document.getElementById("sw-toggle-btn");
        if (btn) btn.innerHTML = "⏱️ Mulai Stopwatch";
        const resEl = document.getElementById("pendulum-results");
        if (resEl) resEl.innerHTML = "";
    }

    updateStopwatchDisplay() {
        const el = document.getElementById("sw-display");
        if (!el) return;
        const totalSec = this.swElapsed / 1000;
        const m = Math.floor(totalSec / 60).toString().padStart(2, "0");
        const s = Math.floor(totalSec % 60).toString().padStart(2, "0");
        const ms = Math.floor((this.swElapsed % 1000) / 10).toString().padStart(2, "0");
        el.textContent = `${m}:${s}.${ms}`;
    }

    calculateResults() {
        const totalSec = this.swElapsed / 1000;
        const theoreticalPeriod = 2 * Math.PI * Math.sqrt(this.length / this.gravity);
        const resEl = document.getElementById("pendulum-results");
        if (!resEl) return;

        let periodExp = this.swingCount > 0 ? (totalSec / this.swingCount).toFixed(2) : (totalSec / 10).toFixed(2);
        
        resEl.innerHTML = `
            <div class="result-box">
                <div class="res-row"><span>⏱️ Waktu Terukur (t):</span> <strong>${totalSec.toFixed(2)} detik</strong></div>
                <div class="res-row"><span>🔄 Jumlah Ayunan (n):</span> <strong>${this.swingCount || 10} kali</strong></div>
                <div class="res-row highlight"><span>📊 Periode Percobaan (T = t/n):</span> <strong>${periodExp} detik</strong></div>
                <div class="res-row"><span>📐 Periode Teoretis (2π√(L/g)):</span> <strong>${theoreticalPeriod.toFixed(2)} detik</strong></div>
            </div>
        `;
    }

    updateStats() {
        const theoreticalPeriod = 2 * Math.PI * Math.sqrt(this.length / this.gravity);
        const lenEl = document.getElementById("pendulum-len-text");
        const massEl = document.getElementById("pendulum-mass-text");
        const theoryEl = document.getElementById("pendulum-theory-text");

        if (lenEl) lenEl.textContent = `${this.length.toFixed(2)} m`;
        if (massEl) massEl.textContent = `${this.mass.toFixed(2)} kg`;
        if (theoryEl) theoryEl.textContent = `${theoreticalPeriod.toFixed(2)} sekon`;
    }

    startLoop() {
        const loop = (timestamp) => {
            if (!this.lastTime) this.lastTime = timestamp;
            const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
            this.lastTime = timestamp;

            if (this.isPlaying) {
                // Pendulum differential equation: θ'' = -(g/L)*sin(θ) - damping*θ'
                this.angularAcc = -(this.gravity / this.length) * Math.sin(this.angle) - 0.04 * this.angularVel;
                this.angularVel += this.angularAcc * dt;
                
                const oldAngle = this.angle;
                this.angle += this.angularVel * dt;

                // Detect oscillation zero-cross to count swings
                if (oldAngle < 0 && this.angle >= 0 && this.angularVel > 0) {
                    this.swingCount++;
                    window.sound.playTick();
                    const cntEl = document.getElementById("pendulum-swing-counter");
                    if (cntEl) cntEl.textContent = this.swingCount;
                }
            }

            this.draw();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    draw() {
        if (!this.canvas || !this.ctx) return;
        const c = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        c.clearRect(0, 0, w, h);

        const pivotX = w / 2;
        const pivotY = 50;

        // Scale length: 1 meter = 220 pixels
        const pixelLen = this.length * 220;
        const bobX = pivotX + pixelLen * Math.sin(this.angle);
        const bobY = pivotY + pixelLen * Math.cos(this.angle);

        // 1. Ceiling mount
        c.save();
        c.fillStyle = "#334155";
        c.fillRect(pivotX - 60, pivotY - 12, 120, 12);

        // Center pivot pin
        c.fillStyle = "#f59e0b";
        c.beginPath();
        c.arc(pivotX, pivotY, 6, 0, Math.PI * 2);
        c.fill();

        // Protractor angle guide (Busur Derajat)
        c.strokeStyle = "rgba(148, 163, 184, 0.4)";
        c.lineWidth = 1;
        c.beginPath();
        c.arc(pivotX, pivotY, 70, Math.PI * 0.25, Math.PI * 0.75);
        c.stroke();

        // Vertical reference dashed line
        c.setLineDash([4, 4]);
        c.strokeStyle = "#94a3b8";
        c.beginPath();
        c.moveTo(pivotX, pivotY);
        c.lineTo(pivotX, pivotY + pixelLen + 30);
        c.stroke();
        c.setLineDash([]);
        c.restore();

        // 2. Pendulum String (Tali Bandul)
        c.save();
        c.strokeStyle = "#475569";
        c.lineWidth = 2.5;
        c.beginPath();
        c.moveTo(pivotX, pivotY);
        c.lineTo(bobX, bobY);
        c.stroke();
        c.restore();

        // 3. Pendulum Bob (Beban Bandul)
        const bobRadius = 14 + (this.mass * 6);
        c.save();
        c.fillStyle = "#3b82f6";
        c.strokeStyle = "#1d4ed8";
        c.lineWidth = 3;
        c.beginPath();
        c.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
        c.fill();
        c.stroke();

        // Bob highlight
        c.fillStyle = "rgba(255, 255, 255, 0.4)";
        c.beginPath();
        c.arc(bobX - bobRadius * 0.3, bobY - bobRadius * 0.3, bobRadius * 0.35, 0, Math.PI * 2);
        c.fill();

        // Bob mass text
        c.fillStyle = "#ffffff";
        c.font = "bold 11px 'Fredoka', sans-serif";
        c.textAlign = "center";
        c.fillText(`${this.mass} kg`, bobX, bobY + 4);
        c.restore();
    }
}

// Global instances
window.vernierSim = new VernierCaliperSim();
window.springSim = new SpringBalanceSim();
window.pendulumSim = new PendulumLabSim();
