/**
 * Virtual Lab Interaktif IPA Kelas VII - Materi Pengukuran (Kurikulum Merdeka)
 * 1. Jangka Sorong (Vernier Caliper) - Realistic OLabs Emulator with Zoom Magnifier & Dimensions
 * 2. Neraca Pegas (Spring Balance) - Realistic OLabs Damped Oscillation Simulator
 * 3. Pengukuran Waktu & Bandul (Pendulum Lab) - Stopwatch & 10-Swing Auto Detection
 * 4. LKPD Digital Manager - Realtime Data Logging, Calculation & Print Export
 */

// =============================================================================
// 1. JANGKA SORONG SIMULATOR (OLabs Standard)
// =============================================================================
class VernierCaliperSim {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.currentValue = 2.34; // in cm (SU=2.3, SN=4)
        this.dimension = "outer"; // "outer" (diameter luar), "inner" (diameter dalam), "depth" (kedalaman)
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartVal = 0;
        this.selectedObject = "coin"; // free, coin, cylinder, beaker, bolt, sphere
        
        this.objects = {
            free: { name: "Mode Bebas (Eksplorasi)", val: 2.34, color: "#94a3b8", dim: "outer" },
            coin: { name: "Koin Logam Rp1.000", val: 2.45, color: "#eab308", dim: "outer" },
            cylinder: { name: "Silinder Logam", val: 3.12, color: "#93c5fd", dim: "outer" },
            bolt: { name: "Baut Mesin Presisi", val: 1.73, color: "#f97316", dim: "outer" },
            beaker: { name: "Gelas Kimia (Diameter Luar)", val: 4.56, color: "#67e8f9", dim: "outer" },
            beaker_in: { name: "Gelas Kimia (Diameter Dalam)", val: 4.15, color: "#38bdf8", dim: "inner" },
            beaker_depth: { name: "Gelas Kimia (Kedalaman)", val: 5.28, color: "#0284c7", dim: "depth" },
            sphere: { name: "Bola Logam / Kelereng", val: 1.82, color: "#a855f7", dim: "outer" }
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
            return (clientX - rect.left) * (this.canvas.width / rect.width);
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

    setDimension(dim) {
        this.dimension = dim;
        window.sound?.playClick();
        
        // Update dimension buttons UI
        document.querySelectorAll(".dim-btn-chip").forEach(btn => {
            btn.classList.toggle("active", btn.getAttribute("data-dim") === dim);
        });

        // If in beaker object, switch to matched dimension
        if (this.selectedObject.startsWith("beaker")) {
            if (dim === "outer") this.selectedObject = "beaker";
            else if (dim === "inner") this.selectedObject = "beaker_in";
            else if (dim === "depth") this.selectedObject = "beaker_depth";
            this.currentValue = this.objects[this.selectedObject].val;
        }

        this.draw();
        this.updateReadout();
    }

    setObject(key) {
        if (!this.objects[key]) return;
        this.selectedObject = key;
        const obj = this.objects[key];
        this.dimension = obj.dim || "outer";
        
        window.sound?.playClick();
        if (key !== "free") {
            this.currentValue = obj.val;
        }

        // Update dimension buttons UI
        document.querySelectorAll(".dim-btn-chip").forEach(btn => {
            btn.classList.toggle("active", btn.getAttribute("data-dim") === this.dimension);
        });

        // Update object buttons UI
        document.querySelectorAll("#caliper-obj-chips .chip-btn").forEach(btn => {
            btn.classList.toggle("active", btn.getAttribute("data-obj") === key);
        });

        this.draw();
        this.updateReadout();
    }

    stepValue(delta) {
        window.sound?.playTick();
        let newVal = Math.round((this.currentValue + delta) * 100) / 100;
        this.currentValue = Math.max(0, Math.min(8, newVal));
        this.selectedObject = "free";
        
        document.querySelectorAll("#caliper-obj-chips .chip-btn").forEach(btn => {
            btn.classList.toggle("active", btn.getAttribute("data-obj") === "free");
        });

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
            window.sound?.playSuccess();
            feedbackEl.className = "sim-feedback success";
            feedbackEl.innerHTML = `🎉 <strong>Hebat Sekali! Pembacaan Skala Benar!</strong><br>
                Skala Utama (SU) = <strong>${trueSU.toFixed(1)} cm</strong><br>
                Skala Nonius (SN) = <strong>${trueSN}</strong> (× 0,01 cm = ${(trueSN * 0.01).toFixed(2)} cm)<br>
                <strong>Hasil Akhir Pengukuran = ${trueTotal.toFixed(2)} cm</strong>`;
        } else {
            window.sound?.playError();
            feedbackEl.className = "sim-feedback error";
            feedbackEl.innerHTML = `❌ <strong>Kurang Tepat, Coba Perhatikan Garis Nonius!</strong><br>
                Petunjuk: Skala Utama adalah angka skala tetap tepat sebelum garis 0 nonius. Skala Nonius adalah garis nonius yang paling lurus sejajar.<br>
                Jawaban benar: SU = <strong>${trueSU.toFixed(1)} cm</strong>, SN = <strong>${trueSN}</strong>, Total = <strong>${trueTotal.toFixed(2)} cm</strong>`;
        }
    }

    logToLkpd() {
        const objName = this.objects[this.selectedObject]?.name || "Benda Bebas";
        const dimLabel = this.dimension === "outer" ? "Diameter Luar" : (this.dimension === "inner" ? "Diameter Dalam" : "Kedalaman");
        const su = (Math.floor(this.currentValue * 10) / 10).toFixed(1) + " cm";
        const sn = Math.round((this.currentValue - Math.floor(this.currentValue * 10) / 10) * 100);
        const total = this.currentValue.toFixed(2) + " cm";

        window.lkpdManager?.addCaliperRow({
            object: objName,
            dimension: dimLabel,
            su: su,
            sn: sn,
            total: total
        });
    }

    draw() {
        if (!this.canvas || !this.ctx) return;
        const c = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        c.clearRect(0, 0, w, h);

        const originX = 140; // Jaw zero reference point
        const originY = 115;
        const pxPerCm = 80;
        const pxPerMm = pxPerCm / 10;
        const slideX = originX + (this.currentValue * pxPerCm);

        // --- 0. BACKGROUND GRID / LAB BENCH EFFECT ---
        c.save();
        c.fillStyle = "#f8fafc";
        c.fillRect(0, 0, w, h);
        c.strokeStyle = "#e2e8f0";
        c.lineWidth = 1;
        for (let x = 0; x < w; x += 40) {
            c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke();
        }
        for (let y = 0; y < h; y += 40) {
            c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke();
        }
        c.restore();

        // --- 1. CLAMPED OBJECT RENDERING ---
        if (this.selectedObject !== "free") {
            const obj = this.objects[this.selectedObject];
            const objW = this.currentValue * pxPerCm;
            c.save();
            c.fillStyle = obj.color;
            c.strokeStyle = "#334155";
            c.lineWidth = 2;

            if (this.dimension === "outer") {
                // Outer measurement: clamped between lower jaws
                if (this.selectedObject === "coin") {
                    c.beginPath();
                    c.ellipse(originX + objW / 2, originY - 45, objW / 2, 40, 0, 0, Math.PI * 2);
                    c.fill(); c.stroke();
                } else if (this.selectedObject === "sphere") {
                    c.beginPath();
                    c.arc(originX + objW / 2, originY - 45, objW / 2, 0, Math.PI * 2);
                    c.fill(); c.stroke();
                } else {
                    c.beginPath();
                    c.roundRect(originX, originY - 75, objW, 75, 4);
                    c.fill(); c.stroke();
                }
            } else if (this.dimension === "inner") {
                // Inner measurement: held between upper jaws
                c.beginPath();
                c.roundRect(originX - 15, originY + 65, objW + 30, 45, 4);
                c.fillStyle = "rgba(148, 163, 184, 0.4)";
                c.fill(); c.stroke();
                // Inner hollow area
                c.fillStyle = obj.color;
                c.fillRect(originX, originY + 68, objW, 39);
            } else if (this.dimension === "depth") {
                // Depth measurement: beaker container
                c.beginPath();
                c.roundRect(w - 180, originY, 60, objW + 10, 4);
                c.fillStyle = obj.color;
                c.fill(); c.stroke();
            }

            // Object text badge
            c.fillStyle = "#0f172a";
            c.font = "bold 11px 'Outfit', sans-serif";
            c.textAlign = "center";
            c.fillText(obj.name, originX + objW / 2, originY - 20);
            c.restore();
        }

        // --- 2. DEPTH ROD (Tangkai Kedalaman) ---
        c.save();
        c.fillStyle = "#94a3b8";
        c.strokeStyle = "#64748b";
        c.lineWidth = 1.5;
        // The rod extends out to the right as caliper opens
        const rodStartX = originX + 700;
        const rodW = this.currentValue * pxPerCm;
        c.fillRect(rodStartX, originY + 20, rodW, 6);
        c.strokeRect(rodStartX, originY + 20, rodW, 6);
        c.restore();

        // --- 3. MAIN BODY & FIXED SCALE (Skala Utama / Batang Baja) ---
        c.save();
        // Metallic gradient for beam
        const beamGrad = c.createLinearGradient(originX, originY, originX, originY + 65);
        beamGrad.addColorStop(0, "#e2e8f0");
        beamGrad.addColorStop(0.5, "#cbd5e1");
        beamGrad.addColorStop(1, "#94a3b8");
        c.fillStyle = beamGrad;
        c.strokeStyle = "#475569";
        c.lineWidth = 2;

        // Main graduated beam
        c.fillRect(originX, originY, w - originX - 30, 65);
        c.strokeRect(originX, originY, w - originX - 30, 65);

        // Lower Fixed Jaw (Rahang Tetap Bawah - Diameter Luar)
        c.beginPath();
        c.moveTo(originX, originY);
        c.lineTo(originX - 65, originY);
        c.lineTo(originX - 65, originY - 95);
        c.lineTo(originX - 25, originY - 95);
        c.lineTo(originX, originY - 40);
        c.closePath();
        c.fill();
        c.stroke();

        // Upper Fixed Jaw (Rahang Tetap Atas - Diameter Dalam)
        c.beginPath();
        c.moveTo(originX, originY + 65);
        c.lineTo(originX - 50, originY + 65);
        c.lineTo(originX - 50, originY + 115);
        c.lineTo(originX - 20, originY + 115);
        c.lineTo(originX, originY + 65);
        c.closePath();
        c.fill();
        c.stroke();

        // Main Scale tick marks (0 to 8 cm)
        c.fillStyle = "#0f172a";
        c.font = "11px 'Outfit', sans-serif";
        c.textAlign = "center";

        for (let mm = 0; mm <= 80; mm++) {
            const x = originX + mm * pxPerMm;
            if (x > w - 40) break;

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
            c.strokeStyle = "#1e293b";
            c.lineWidth = mm % 10 === 0 ? 1.8 : 1;
            c.stroke();
        }

        c.fillStyle = "#334155";
        c.font = "bold 11px 'Outfit', sans-serif";
        c.fillText("cm (Skala Utama)", originX + 70 * pxPerMm, originY + 52);
        c.restore();

        // --- 4. SLIDING VERNIER JAW (Rahang Geser & Skala Nonius) ---
        c.save();
        const vernierGrad = c.createLinearGradient(slideX, originY, slideX + 120, originY + 80);
        vernierGrad.addColorStop(0, "#f8fafc");
        vernierGrad.addColorStop(0.5, "#e2e8f0");
        vernierGrad.addColorStop(1, "#cbd5e1");
        c.fillStyle = vernierGrad;
        c.strokeStyle = "#2563eb";
        c.lineWidth = 2.5;

        // Sliding lower jaw (outer diameter)
        c.beginPath();
        c.moveTo(slideX, originY);
        c.lineTo(slideX + 115, originY);
        c.lineTo(slideX + 115, originY + 85);
        c.lineTo(slideX, originY + 85);
        c.closePath();
        c.fill();
        c.stroke();

        // Jaw arm going upwards (Lower jaw)
        c.beginPath();
        c.moveTo(slideX, originY);
        c.lineTo(slideX + 45, originY);
        c.lineTo(slideX + 45, originY - 95);
        c.lineTo(slideX + 15, originY - 95);
        c.lineTo(slideX, originY - 40);
        c.closePath();
        c.fill();
        c.stroke();

        // Sliding upper jaw (inner diameter)
        c.beginPath();
        c.moveTo(slideX, originY + 65);
        c.lineTo(slideX + 40, originY + 65);
        c.lineTo(slideX + 40, originY + 115);
        c.lineTo(slideX + 15, originY + 115);
        c.lineTo(slideX, originY + 65);
        c.closePath();
        c.fill();
        c.stroke();

        // Vernier Lock Screw & Thumb grip
        c.fillStyle = "#64748b";
        c.beginPath();
        c.roundRect(slideX + 50, originY - 24, 28, 18, 4);
        c.fill();
        c.stroke();

        // Thumb push grip
        c.fillStyle = "#3b82f6";
        c.beginPath();
        c.roundRect(slideX + 80, originY + 18, 24, 46, 6);
        c.fill();
        c.fillStyle = "#ffffff";
        c.font = "bold 11px sans-serif";
        c.textAlign = "center";
        c.fillText("↔", slideX + 92, originY + 45);

        // Vernier scale markings (10 divisions = 9 mm on main scale)
        // 1 vernier division = 0.9 mm = 0.9 * pxPerMm
        const vernierStep = 0.9 * pxPerMm;
        c.fillStyle = "#1e3a8a";
        c.font = "10px 'Outfit', sans-serif";
        c.textAlign = "center";

        const trueSU = Math.floor(this.currentValue * 10) / 10;
        const coincidentIndex = Math.round((this.currentValue - trueSU) * 100);

        for (let v = 0; v <= 10; v++) {
            const vx = slideX + v * vernierStep;
            let vH = (v % 5 === 0) ? 15 : 9;

            c.beginPath();
            c.moveTo(vx, originY + 38);
            c.lineTo(vx, originY + 38 - vH);
            
            // Highlight coincident nonius line
            if (v === coincidentIndex) {
                c.strokeStyle = "#dc2626";
                c.lineWidth = 2.2;
            } else {
                c.strokeStyle = "#1d4ed8";
                c.lineWidth = 1.2;
            }
            c.stroke();

            if (v % 2 === 0) {
                c.fillStyle = (v === coincidentIndex) ? "#dc2626" : "#1e3a8a";
                c.fillText(v.toString(), vx, originY + 52);
            }
        }

        c.fillStyle = "#1e40af";
        c.font = "bold 10px 'Outfit', sans-serif";
        c.fillText("Nonius (0,01 cm)", slideX + 5 * vernierStep, originY + 70);

        // Zero index alignment red indicator
        c.fillStyle = "#ef4444";
        c.beginPath();
        c.moveTo(slideX, originY + 36);
        c.lineTo(slideX - 4, originY + 42);
        c.lineTo(slideX + 4, originY + 42);
        c.closePath();
        c.fill();
        c.restore();

        // --- 5. INSET ZOOM MAGNIFIER WINDOW (KACA PEMBESAR OLabs) ---
        // Exactly matches the enlarged magnifier view shown in OLabs!
        const magW = 210;
        const magH = 88;
        const magX = w - magW - 16;
        const magY = h - magH - 12;

        c.save();
        // Magnifier background box
        c.fillStyle = "#ffffff";
        c.strokeStyle = "#0284c7";
        c.lineWidth = 2.5;
        c.beginPath();
        c.roundRect(magX, magY, magW, magH, 10);
        c.fill();
        c.stroke();

        // Lens header tag
        c.fillStyle = "#0284c7";
        c.fillRect(magX, magY, magW, 22);
        c.fillStyle = "#ffffff";
        c.font = "bold 10px 'Outfit', sans-serif";
        c.textAlign = "center";
        c.fillText(`🔍 KACA PEMBESAR: NONIUS BERIMPIT (SN = ${coincidentIndex})`, magX + magW / 2, magY + 15);

        // Magnified ticks
        const zoomCenterMainX = slideX + (coincidentIndex * vernierStep);
        const zoomBoxCenterX = magX + magW / 2;
        const zoomBoxTickY = magY + 48;
        const zoomScale = 3.2;

        // Draw magnified main scale lines around coincident tick
        c.strokeStyle = "#334155";
        c.lineWidth = 2;
        for (let mm = -3; mm <= 3; mm++) {
            const mx = zoomBoxCenterX + (mm * pxPerMm * zoomScale);
            c.beginPath();
            c.moveTo(mx, zoomBoxTickY - 18);
            c.lineTo(mx, zoomBoxTickY);
            c.stroke();
        }

        // Draw magnified vernier scale line
        c.strokeStyle = "#dc2626";
        c.lineWidth = 3;
        c.beginPath();
        c.moveTo(zoomBoxCenterX, zoomBoxTickY);
        c.lineTo(zoomBoxCenterX, zoomBoxTickY + 20);
        c.stroke();

        // Coincident indicator arrows
        c.fillStyle = "#dc2626";
        c.font = "bold 10px 'Fredoka', sans-serif";
        c.textAlign = "center";
        c.fillText("▲ Berimpit Tepat", zoomBoxCenterX, zoomBoxTickY + 32);

        c.restore();
    }
}

// =============================================================================
// 2. NERACA PEGAS SIMULATOR (OLabs Damped Oscillation Standard)
// =============================================================================
class SpringBalanceSim {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gravity = 9.8; // m/s^2 (Earth default)
        this.selectedObject = "cylinder";
        this.currentMass = 0.25; // in kg (250g)
        this.springY = 0; // animated extension
        this.targetSpringY = 0;
        this.velocity = 0;
        this.animId = null;

        this.objects = {
            none: { name: "Tanpa Beban", massKg: 0, color: "transparent" },
            cylinder: { name: "Silinder Logam (250g)", massKg: 0.25, color: "#93c5fd", w: 32, h: 48 },
            block: { name: "Balok Kayu (120g)", massKg: 0.12, color: "#d97706", w: 38, h: 38 },
            stone: { name: "Batu Kerikil (320g)", massKg: 0.32, color: "#64748b", w: 36, h: 44 },
            key: { name: "Kunci Logam (60g)", massKg: 0.06, color: "#eab308", w: 26, h: 36 }
        };
    }

    init() {
        this.canvas = document.getElementById("spring-canvas");
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext("2d");
        this.updateTarget();
        this.startLoop();
        this.updateReadout();
    }

    setGravity(g) {
        this.gravity = parseFloat(g);
        window.sound?.playClick();
        
        // Update gravity chips UI
        document.querySelectorAll(".grav-btn-chip").forEach(btn => {
            btn.classList.toggle("active", Math.abs(parseFloat(btn.getAttribute("data-g")) - this.gravity) < 0.1);
        });

        this.updateTarget();
    }

    setObject(key) {
        this.selectedObject = key;
        const obj = this.objects[key] || this.objects.none;
        this.currentMass = obj.massKg;
        window.sound?.playPop();

        // Update object buttons UI
        document.querySelectorAll("#spring-obj-chips .chip-btn").forEach(btn => {
            btn.classList.toggle("active", btn.getAttribute("data-obj") === key);
        });

        this.updateTarget();
    }

    setCustomMass(gVal) {
        this.selectedObject = "custom";
        this.currentMass = parseFloat(gVal) / 1000;
        this.updateTarget();
    }

    updateTarget() {
        // Force w = m * g (in Newton)
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
        if (gEl) gEl.textContent = `${this.gravity.toFixed(1)} N/kg`;
        if (calcEl) {
            calcEl.textContent = `M = w / g = ${force.toFixed(2)} N ÷ ${this.gravity.toFixed(1)} N/kg = ${(force / this.gravity).toFixed(3)} kg (${massG.toFixed(0)} g)`;
        }
    }

    checkAnswer() {
        const inputW = parseFloat(document.getElementById("input-spring-w")?.value || "0");
        const inputM = parseFloat(document.getElementById("input-spring-m")?.value || "0");
        const feedbackEl = document.getElementById("spring-feedback");
        if (!feedbackEl) return;

        const trueW = this.currentMass * this.gravity;
        const trueM = this.currentMass * 1000;

        const wCorrect = Math.abs(inputW - trueW) < 0.15;
        const mCorrect = Math.abs(inputM - trueM) < 15;

        if (wCorrect && mCorrect) {
            window.sound?.playSuccess();
            feedbackEl.className = "sim-feedback success";
            feedbackEl.innerHTML = `🎉 <strong>Luar Biasa! Perhitungan Massa Tepat!</strong><br>
                Gaya Berat (w) = <strong>${trueW.toFixed(2)} N</strong><br>
                Massa Terhitung (M = w/g) = <strong>${trueM.toFixed(0)} gram</strong> (${this.currentMass.toFixed(3)} kg)`;
        } else {
            window.sound?.playError();
            feedbackEl.className = "sim-feedback error";
            feedbackEl.innerHTML = `❌ <strong>Coba Periksa Kembali Pembacaan Skala!</strong><br>
                Gaya Berat seharusnya: <strong>${trueW.toFixed(2)} N</strong><br>
                Massa seharusnya: <strong>${trueM.toFixed(0)} gram</strong> (dari rumus M = w ÷ g)`;
        }
    }

    logToLkpd() {
        const objName = this.objects[this.selectedObject]?.name || `Beban Custom (${(this.currentMass * 1000).toFixed(0)}g)`;
        const force = (this.currentMass * this.gravity).toFixed(2) + " N";
        const grav = this.gravity.toFixed(1) + " N/kg";
        const massStr = (this.currentMass * 1000).toFixed(0) + " g";

        window.lkpdManager?.addSpringRow({
            object: objName,
            force: force,
            gravity: grav,
            formula: "M = w / g",
            mass: massStr
        });
    }

    startLoop() {
        const animate = () => {
            // Damped spring oscillation physics
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
        const topY = 35;

        // 1. Lab Stand (Statif)
        c.save();
        c.fillStyle = "#334155";
        // Base
        c.fillRect(centerX - 110, h - 25, 220, 16);
        // Vertical rod
        c.fillRect(centerX - 95, topY - 20, 14, h - topY);
        // Horizontal arm
        c.fillRect(centerX - 95, topY - 20, 105, 14);
        c.restore();

        // 2. Tubular Casing
        c.save();
        c.fillStyle = "rgba(224, 242, 254, 0.92)";
        c.strokeStyle = "#0284c7";
        c.lineWidth = 2.5;

        // Top hook ring
        c.beginPath();
        c.arc(centerX, topY + 5, 8, 0, Math.PI * 2);
        c.stroke();

        // Outer transparent tube
        c.beginPath();
        c.roundRect(centerX - 26, topY + 15, 52, 225, 8);
        c.fill();
        c.stroke();

        // Scale Markings (0 to 5 N)
        c.fillStyle = "#0369a1";
        c.font = "bold 9px 'Outfit', sans-serif";

        for (let n = 0; n <= 5; n++) {
            const ny = topY + 35 + (n / 5) * 160;
            // Newton ticks (Right side)
            c.beginPath();
            c.moveTo(centerX + 20, ny);
            c.lineTo(centerX + 8, ny);
            c.strokeStyle = "#0284c7";
            c.lineWidth = 1.5;
            c.stroke();
            c.textAlign = "left";
            c.fillText(`${n}N`, centerX + 22, ny + 3);

            // Gram ticks (Left side) (approx n * 100g)
            c.beginPath();
            c.moveTo(centerX - 20, ny);
            c.lineTo(centerX - 8, ny);
            c.stroke();
            c.textAlign = "right";
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
        const springCurrentH = 40 + this.springY * 0.7; // Elongation
        const coils = 12;
        const coilStep = springCurrentH / coils;

        c.beginPath();
        c.moveTo(centerX, springStartY);
        for (let i = 0; i <= coils; i++) {
            const cy = springStartY + i * coilStep;
            const cx = centerX + (i % 2 === 0 ? -11 : 11);
            c.lineTo(cx, cy);
        }
        c.lineTo(centerX, springStartY + springCurrentH);
        c.stroke();
        c.restore();

        // 4. Pointer Plate (Jarum Penunjuk Merah)
        const pointerY = topY + 35 + this.springY;
        c.save();
        c.fillStyle = "#ef4444";
        c.beginPath();
        c.moveTo(centerX - 18, pointerY);
        c.lineTo(centerX + 18, pointerY);
        c.lineTo(centerX + 18, pointerY + 4);
        c.lineTo(centerX - 18, pointerY + 4);
        c.closePath();
        c.fill();

        // Center line
        c.strokeStyle = "#ffffff";
        c.lineWidth = 1.5;
        c.beginPath();
        c.moveTo(centerX - 18, pointerY + 2);
        c.lineTo(centerX + 18, pointerY + 2);
        c.stroke();
        c.restore();

        // 5. Bottom Extension Rod and Hook
        const bottomRodY = topY + 235 + (this.springY * 0.3);
        c.save();
        c.strokeStyle = "#475569";
        c.lineWidth = 3;
        c.beginPath();
        c.moveTo(centerX, topY + 230);
        c.lineTo(centerX, bottomRodY);
        c.stroke();

        // Hook
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

            // Label
            c.fillStyle = "#ffffff";
            c.font = "bold 10px 'Fredoka', sans-serif";
            c.textAlign = "center";
            c.fillText(`${(this.currentMass * 1000).toFixed(0)}g`, centerX, objY + obj.h / 2 + 3);
            c.restore();
        }
    }
}

// =============================================================================
// 3. PENGUKURAN WAKTU & BANDUL SIMULATOR (OLabs & Stopwatch)
// =============================================================================
class PendulumLabSim {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.length = 0.50; // m (0.3 to 1.0 m)
        this.mass = 1.0; // kg
        this.gravity = 9.8;
        this.angle = 0.25; // radians
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
        window.sound?.playClick();
        this.updateStats();
    }

    setMass(m) {
        this.mass = parseFloat(m);
        window.sound?.playClick();
        this.updateStats();
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;
        window.sound?.playClick();
        const btn = document.getElementById("pendulum-play-btn");
        if (btn) {
            btn.innerHTML = this.isPlaying ? "⏸️ Jeda Ayunan" : "▶️ Lepas Bandul";
        }
    }

    reset() {
        this.isPlaying = false;
        this.angle = 0.25;
        this.angularVel = 0;
        this.swingCount = 0;
        const btn = document.getElementById("pendulum-play-btn");
        if (btn) btn.innerHTML = "▶️ Lepas Bandul";
        this.resetStopwatch();
        this.updateStats();
    }

    toggleStopwatch() {
        window.sound?.playClick();
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
                <div class="res-row highlight"><span>📊 Periode Terukur (T = t/n):</span> <strong>${periodExp} detik</strong></div>
                <div class="res-row"><span>📐 Periode Teoretis (2π√(L/g)):</span> <strong>${theoreticalPeriod.toFixed(2)} detik</strong></div>
                <button class="btn-tool-pill mt-2" onclick="pendulumSim.logToLkpd()">📥 Catat Hasil ke LKPD</button>
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

    logToLkpd() {
        const totalSec = (this.swElapsed > 0 ? this.swElapsed / 1000 : 14.2).toFixed(2);
        const swings = this.swingCount > 0 ? this.swingCount : 10;
        const periodExp = (totalSec / swings).toFixed(2) + " s";
        const theory = (2 * Math.PI * Math.sqrt(this.length / this.gravity)).toFixed(2) + " s";

        window.lkpdManager?.addPendulumRow({
            expName: `Uji Tali L = ${this.length.toFixed(2)} m`,
            length: `${this.length.toFixed(2)} m`,
            mass: `${this.mass.toFixed(2)} kg`,
            time: `${totalSec} s`,
            period: periodExp,
            theory: theory
        });
    }

    startLoop() {
        const loop = (timestamp) => {
            if (!this.lastTime) this.lastTime = timestamp;
            const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
            this.lastTime = timestamp;

            if (this.isPlaying) {
                // Differential equation: θ'' = -(g/L)*sin(θ) - damping*θ'
                this.angularAcc = -(this.gravity / this.length) * Math.sin(this.angle) - 0.04 * this.angularVel;
                this.angularVel += this.angularAcc * dt;
                
                const oldAngle = this.angle;
                this.angle += this.angularVel * dt;

                // Detect zero-cross to count swings
                if (oldAngle < 0 && this.angle >= 0 && this.angularVel > 0) {
                    this.swingCount++;
                    window.sound?.playTick();
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

        // Scale: 1 meter = 220 pixels
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

        // Protractor angle guide
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

        // 2. Pendulum String
        c.save();
        c.strokeStyle = "#475569";
        c.lineWidth = 2.5;
        c.beginPath();
        c.moveTo(pivotX, pivotY);
        c.lineTo(bobX, bobY);
        c.stroke();
        c.restore();

        // 3. Pendulum Bob
        const bobRadius = 14 + (this.mass * 6);
        c.save();
        c.fillStyle = "#3b82f6";
        c.strokeStyle = "#1d4ed8";
        c.lineWidth = 3;
        c.beginPath();
        c.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
        c.fill();
        c.stroke();

        // Highlight
        c.fillStyle = "rgba(255, 255, 255, 0.4)";
        c.beginPath();
        c.arc(bobX - bobRadius * 0.3, bobY - bobRadius * 0.3, bobRadius * 0.35, 0, Math.PI * 2);
        c.fill();

        // Bob label
        c.fillStyle = "#ffffff";
        c.font = "bold 11px 'Fredoka', sans-serif";
        c.textAlign = "center";
        c.fillText(`${this.mass} kg`, bobX, bobY + 4);
        c.restore();
    }
}

// =============================================================================
// 4. LKPD DIGITAL MANAGER (Lembar Kerja Praktikum Siswa)
// =============================================================================
class LkpdManager {
    constructor() {
        this.caliperData = JSON.parse(localStorage.getItem("lab_lkpd_caliper") || "null") || [
            { id: 1, object: "Koin Logam Rp1.000", dimension: "Diameter Luar", su: "2,4 cm", sn: 5, total: "2,45 cm" },
            { id: 2, object: "Silinder Logam", dimension: "Tinggi", su: "3,1 cm", sn: 2, total: "3,12 cm" }
        ];

        this.springData = JSON.parse(localStorage.getItem("lab_lkpd_spring") || "null") || [
            { id: 1, object: "Silinder Logam", force: "2,45 N", gravity: "9,8 N/kg", formula: "M = w / g", mass: "250 g" },
            { id: 2, object: "Balok Kayu", force: "1,18 N", gravity: "9,8 N/kg", formula: "M = w / g", mass: "120 g" }
        ];

        this.pendulumData = JSON.parse(localStorage.getItem("lab_lkpd_pendulum") || "null") || [
            { id: 1, expName: "Uji Panjang 0,5 m", length: "0,50 m", mass: "1,00 kg", time: "14,20 s", period: "1,42 s", theory: "1,42 s" },
            { id: 2, expName: "Uji Panjang 1,0 m", length: "1,00 m", mass: "1,00 kg", time: "20,10 s", period: "2,01 s", theory: "2,01 s" }
        ];
    }

    init() {
        this.renderAll();
    }

    save() {
        localStorage.setItem("lab_lkpd_caliper", JSON.stringify(this.caliperData));
        localStorage.setItem("lab_lkpd_spring", JSON.stringify(this.springData));
        localStorage.setItem("lab_lkpd_pendulum", JSON.stringify(this.pendulumData));
    }

    renderAll() {
        this.renderCaliperTable();
        this.renderSpringTable();
        this.renderPendulumTable();
    }

    addCaliperRow(data) {
        const row = {
            id: Date.now(),
            object: data.object,
            dimension: data.dimension,
            su: data.su,
            sn: data.sn,
            total: data.total
        };
        this.caliperData.push(row);
        this.save();
        this.renderCaliperTable();
        window.sound?.playSuccess();
        window.appState?.showToast(`✅ Data Jangka Sorong (${data.object}) dicatat ke LKPD!`);
    }

    deleteCaliperRow(id) {
        this.caliperData = this.caliperData.filter(r => r.id !== id);
        this.save();
        this.renderCaliperTable();
        window.sound?.playPop();
    }

    renderCaliperTable() {
        const tbody = document.getElementById("lkpd-caliper-tbody");
        if (!tbody) return;
        tbody.innerHTML = "";

        if (this.caliperData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">Belum ada data praktikum jangka sorong. Lakukan pengukuran lalu klik tombol "Catat ke LKPD".</td></tr>`;
            return;
        }

        this.caliperData.forEach((row, idx) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${idx + 1}</strong></td>
                <td><input type="text" class="lkpd-in" value="${row.object}" onchange="lkpdManager.updateCaliperField(${row.id}, 'object', this.value)"></td>
                <td><input type="text" class="lkpd-in" value="${row.dimension}" onchange="lkpdManager.updateCaliperField(${row.id}, 'dimension', this.value)"></td>
                <td><input type="text" class="lkpd-in" value="${row.su}" onchange="lkpdManager.updateCaliperField(${row.id}, 'su', this.value)"></td>
                <td><input type="text" class="lkpd-in" value="${row.sn}" onchange="lkpdManager.updateCaliperField(${row.id}, 'sn', this.value)"></td>
                <td><strong>${row.total}</strong></td>
                <td><button class="btn-del-row" onclick="lkpdManager.deleteCaliperRow(${row.id})" title="Hapus baris">✕</button></td>
            `;
            tbody.appendChild(tr);
        });
    }

    updateCaliperField(id, field, val) {
        const row = this.caliperData.find(r => r.id === id);
        if (row) {
            row[field] = val;
            this.save();
        }
    }

    addSpringRow(data) {
        const objName = data.object || data.objName || "Silinder Logam";
        const forceStr = data.force || "2.45 N";
        const gravStr = data.gravity || data.grav || "9.8 N/kg";
        const formulaStr = data.formula || "M = w / g";
        const massStr = data.mass || "250 g";

        // Anti-duplicate protection: ignore identical row if submitted within 1200ms
        const now = Date.now();
        if (this._lastSpringLog && 
            (now - this._lastSpringLog.time < 1200) &&
            this._lastSpringLog.object === objName &&
            this._lastSpringLog.force === forceStr) {
            return;
        }
        this._lastSpringLog = { time: now, object: objName, force: forceStr };

        const row = {
            id: Date.now(),
            object: (objName === "undefined" || !objName) ? "Silinder Logam" : objName,
            force: (forceStr === "undefined" || !forceStr) ? "2.45 N" : forceStr,
            gravity: (gravStr === "undefined" || !gravStr) ? "9.8 N/kg" : gravStr,
            formula: (formulaStr === "undefined" || !formulaStr) ? "M = w / g" : formulaStr,
            mass: (massStr === "undefined" || !massStr) ? "250 g" : massStr
        };
        this.springData.push(row);
        this.save();
        this.renderSpringTable();
        window.sound?.playSuccess();
        window.appState?.showToast(`✅ Data Neraca Pegas (${row.object}) dicatat ke LKPD!`, "success");
    }

    deleteSpringRow(id) {
        this.springData = this.springData.filter(r => r.id !== id);
        this.save();
        this.renderSpringTable();
        window.sound?.playPop();
    }

    renderSpringTable() {
        const tbody = document.getElementById("lkpd-spring-tbody");
        if (!tbody) return;
        tbody.innerHTML = "";

        if (this.springData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-3">Belum ada data praktikum neraca pegas. Gantung beban pada simulasi lalu klik "Catat ke LKPD".</td></tr>`;
            return;
        }

        this.springData.forEach((row, idx) => {
            // Cleanse any corrupted existing values
            const cleanObj = (row.object === "undefined" || !row.object) ? "Silinder Logam" : row.object;
            const cleanForce = (row.force === "undefined" || !row.force) ? "2.45 N" : row.force;
            const cleanGrav = (row.gravity === "undefined" || !row.gravity) ? "9.8 N/kg" : row.gravity;
            const cleanFormula = (row.formula === "undefined" || !row.formula) ? "M = w / g" : row.formula;
            const cleanMass = (row.mass === "undefined" || !row.mass) ? "250 g" : row.mass;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${idx + 1}</strong></td>
                <td><input type="text" class="lkpd-in" value="${cleanObj}" onchange="lkpdManager.updateSpringField(${row.id}, 'object', this.value)"></td>
                <td><input type="text" class="lkpd-in" value="${cleanForce}" onchange="lkpdManager.updateSpringField(${row.id}, 'force', this.value)"></td>
                <td><input type="text" class="lkpd-in" value="${cleanGrav}" onchange="lkpdManager.updateSpringField(${row.id}, 'gravity', this.value)"></td>
                <td><span class="formula-chip">${cleanFormula}</span></td>
                <td><strong class="highlight-green">${cleanMass}</strong></td>
                <td><button class="btn-del-row" onclick="lkpdManager.deleteSpringRow(${row.id})" title="Hapus baris">✕</button></td>
            `;
            tbody.appendChild(tr);
        });
    }

    updateSpringField(id, field, val) {
        const row = this.springData.find(r => r.id === id);
        if (row) {
            row[field] = val;
            this.save();
        }
    }

    addPendulumRow(data) {
        const row = {
            id: Date.now(),
            expName: data.expName,
            length: data.length,
            mass: data.mass,
            time: data.time,
            period: data.period,
            theory: data.theory
        };
        this.pendulumData.push(row);
        this.save();
        this.renderPendulumTable();
        window.sound?.playSuccess();
        window.appState?.showToast(`✅ Data Bandul Waktu (${data.expName}) dicatat ke LKPD!`);
    }

    deletePendulumRow(id) {
        this.pendulumData = this.pendulumData.filter(r => r.id !== id);
        this.save();
        this.renderPendulumTable();
        window.sound?.playPop();
    }

    renderPendulumTable() {
        const tbody = document.getElementById("lkpd-pendulum-tbody");
        if (!tbody) return;
        tbody.innerHTML = "";

        if (this.pendulumData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-3">Belum ada data pengukuran waktu bandul. Lakukan 10 ayunan lalu klik "Catat ke LKPD".</td></tr>`;
            return;
        }

        this.pendulumData.forEach((row, idx) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${idx + 1}</strong></td>
                <td><input type="text" class="lkpd-in" value="${row.expName}" onchange="lkpdManager.updatePendulumField(${row.id}, 'expName', this.value)"></td>
                <td><input type="text" class="lkpd-in" value="${row.length}" onchange="lkpdManager.updatePendulumField(${row.id}, 'length', this.value)"></td>
                <td><input type="text" class="lkpd-in" value="${row.mass}" onchange="lkpdManager.updatePendulumField(${row.id}, 'mass', this.value)"></td>
                <td><input type="text" class="lkpd-in" value="${row.time}" onchange="lkpdManager.updatePendulumField(${row.id}, 'time', this.value)"></td>
                <td><strong class="highlight-green">${row.period}</strong></td>
                <td><span>${row.theory}</span></td>
                <td><button class="btn-del-row" onclick="lkpdManager.deletePendulumRow(${row.id})" title="Hapus baris">✕</button></td>
            `;
            tbody.appendChild(tr);
        });
    }

    updatePendulumField(id, field, val) {
        const row = this.pendulumData.find(r => r.id === id);
        if (row) {
            row[field] = val;
            this.save();
        }
    }

    resetAll() {
        if (!confirm("Apakah kamu yakin ingin mereset seluruh data LKPD ke format awal?")) return;
        this.caliperData = [];
        this.springData = [];
        this.pendulumData = [];
        this.save();
        this.renderAll();
        window.sound?.playPop();
        window.appState?.showToast("🔄 Data LKPD berhasil direset.");
    }
}

// Global instances
window.vernierSim = new VernierCaliperSim();
window.springSim = new SpringBalanceSim();
window.pendulumSim = new PendulumLabSim();
window.lkpdManager = new LkpdManager();
