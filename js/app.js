/**
 * Main Application Logic
 * Media Pembelajaran Interaktif IPA Kelas VII - Pengukuran
 */

class AppState {
    constructor() {
        this.student = JSON.parse(localStorage.getItem("lab_student_data") || "null");
        this.currentScreen = "cover";
        this.currentSlide = 1;
        this.totalSlides = 16;
        this.slideAutoplayTimer = null;
        this.deferredPrompt = null;
    }

    init() {
        this.setupEventListeners();
        this.checkInitialScreen();
        this.setupPWA();
        this.updateSoundBtn();
        this.setupSlides();
    }

    getStudent() {
        return this.student || { name: "Peserta Didik", className: "VII", school: "SMP/MTs" };
    }

    saveStudent(name, className, absen, school) {
        this.student = {
            name: name.trim() || "Peserta Didik",
            className: className.trim() || "VII",
            absen: absen.trim() || "-",
            school: school.trim() || "SMP/MTs"
        };
        localStorage.setItem("lab_student_data", JSON.stringify(this.student));
        this.updateHeaderProfile();
    }

    updateHeaderProfile() {
        const chipName = document.getElementById("chip-student-name");
        const dashGreeting = document.getElementById("dash-greeting-name");
        const badge = document.getElementById("header-student-badge");
        const coverProfCard = document.getElementById("cover-profile-card");
        const coverFormCard = document.getElementById("cover-form-card");
        const coverDispName = document.getElementById("cover-disp-name");
        const coverDispMeta = document.getElementById("cover-disp-meta");
        const playPrimary = document.getElementById("play-text-primary");
        const playSub = document.getElementById("play-text-sub");

        if (this.student && this.student.name && this.student.name !== "Peserta Didik") {
            if (chipName) chipName.textContent = this.student.name;
            if (dashGreeting) dashGreeting.textContent = this.student.name;
            if (badge) badge.style.display = "flex";

            if (coverDispName) coverDispName.textContent = this.student.name.toUpperCase();
            if (coverDispMeta) coverDispMeta.textContent = `Kelas ${this.student.className} • ${this.student.school || "SMP/MTs"}`;
            if (playPrimary) playPrimary.textContent = `LANJUTKAN: ${this.student.name.toUpperCase()}!`;
            if (playSub) playSub.textContent = `Kelas ${this.student.className} • Klik untuk lanjut ke Misi Belajar`;

            if (coverProfCard) coverProfCard.style.display = "flex";
            if (coverFormCard) coverFormCard.style.display = "none";
        } else {
            if (chipName) chipName.textContent = "Siswa";
            if (dashGreeting) dashGreeting.textContent = "Siswa";
            if (badge) badge.style.display = "none";

            if (coverProfCard) coverProfCard.style.display = "none";
            if (coverFormCard) coverFormCard.style.display = "block";
            const cancelRow = document.getElementById("cover-cancel-row");
            if (cancelRow) cancelRow.style.display = "none";
        }
    }

    toggleCoverForm(showForm) {
        window.sound.playClick();
        const coverProfCard = document.getElementById("cover-profile-card");
        const coverFormCard = document.getElementById("cover-form-card");
        const cancelRow = document.getElementById("cover-cancel-row");
        const cancelName = document.getElementById("cover-cancel-name");

        if (showForm) {
            if (coverProfCard) coverProfCard.style.display = "none";
            if (coverFormCard) coverFormCard.style.display = "block";

            if (this.student && this.student.name && this.student.name !== "Peserta Didik") {
                if (cancelRow) cancelRow.style.display = "block";
                if (cancelName) cancelName.textContent = this.student.name;
                const inName = document.getElementById("cover-input-nama");
                const inKelas = document.getElementById("cover-input-kelas");
                const inAbsen = document.getElementById("cover-input-absen");
                const inSekolah = document.getElementById("cover-input-sekolah");
                if (inName) inName.value = this.student.name;
                if (inKelas) inKelas.value = this.student.className;
                if (inAbsen) inAbsen.value = (this.student.absen !== "-" ? this.student.absen : "");
                if (inSekolah) inSekolah.value = this.student.school || "SMP/MTs";
            } else {
                if (cancelRow) cancelRow.style.display = "none";
            }

            const inName = document.getElementById("cover-input-nama");
            if (inName) setTimeout(() => inName.focus(), 80);
        } else {
            if (coverFormCard) coverFormCard.style.display = "none";
            if (coverProfCard) coverProfCard.style.display = "flex";
        }
    }

    handleCoverFormSubmit() {
        const nameInput = document.getElementById("cover-input-nama");
        const kelasInput = document.getElementById("cover-input-kelas");
        const absenInput = document.getElementById("cover-input-absen");
        const sekolahInput = document.getElementById("cover-input-sekolah");

        const name = nameInput ? nameInput.value.trim() : "";
        const kelas = kelasInput ? kelasInput.value.trim() : "";
        const absen = absenInput ? absenInput.value.trim() : "-";
        const sekolah = sekolahInput ? sekolahInput.value.trim() : "SMP/MTs";

        if (!name) {
            if (nameInput) nameInput.focus();
            return;
        }

        this.saveStudent(name, kelas || "VII", absen, sekolah);
        window.sound.playSuccess();
        this.navigateTo("dashboard");
    }

    checkInitialScreen() {
        this.updateHeaderProfile();
        this.navigateTo("cover");
    }

    handlePlayClick() {
        window.sound.playClick();
        if (this.student && this.student.name && this.student.name !== "Peserta Didik") {
            this.navigateTo("dashboard");
        } else {
            this.toggleCoverForm(true);
        }
    }

    showScreen(screenId) {
        this.navigateTo(screenId);
    }

    openGuideModal() {
        window.sound.playClick();
        const m = document.getElementById("guide-info-modal");
        if (m) m.classList.add("active");
    }

    openInfoModal() {
        window.sound.playClick();
        const m = document.getElementById("info-app-modal");
        if (m) m.classList.add("active");
    }

    navigateTo(screenId) {
        window.sound.playClick();
        
        // Hide all screens
        document.querySelectorAll(".app-screen").forEach(sc => {
            sc.classList.remove("active");
            sc.style.display = "none";
        });

        const target = document.getElementById(`screen-${screenId}`);
        if (target) {
            target.style.display = "block";
            requestAnimationFrame(() => {
                target.classList.add("active");
            });
        }

        // Show/hide main nav (Hidden on cover)
        const mainNav = document.getElementById("app-navbar");
        if (mainNav) {
            const isEntryScreen = (screenId === "cover");
            mainNav.style.display = isEntryScreen ? "none" : "flex";
        }

        this.currentScreen = screenId;
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Trigger simulator canvas sizes if entering virtual lab
        if (screenId === "virtual-lab") {
            setTimeout(() => {
                window.vernierSim.draw();
                window.springSim.draw();
                window.pendulumSim.draw();
            }, 100);
        }
    }

    setupEventListeners() {
        // Custom In-App Exit Modal (NO BROWSER CONFIRM!)
        const exitBtn = document.getElementById("btn-exit-app");
        const exitModal = document.getElementById("exit-modal");
        const cancelExitBtn = document.getElementById("btn-cancel-exit");
        const confirmExitBtn = document.getElementById("btn-confirm-exit");

        if (exitBtn && exitModal) {
            exitBtn.addEventListener("click", () => {
                window.sound.playClick();
                exitModal.classList.add("active");
            });
        }

        if (cancelExitBtn && exitModal) {
            cancelExitBtn.addEventListener("click", () => {
                window.sound.playClick();
                exitModal.classList.remove("active");
            });
        }

        if (confirmExitBtn && exitModal) {
            confirmExitBtn.addEventListener("click", () => {
                window.sound.playClick();
                localStorage.removeItem("lab_student_data");
                this.student = null;
                exitModal.classList.remove("active");
                
                // Reset form inputs
                const inName = document.getElementById("cover-input-nama");
                const inKelas = document.getElementById("cover-input-kelas");
                const inAbsen = document.getElementById("cover-input-absen");
                if (inName) inName.value = "";
                if (inKelas) inKelas.value = "";
                if (inAbsen) inAbsen.value = "";
                
                this.updateHeaderProfile();
                this.toggleCoverForm(true);
                this.navigateTo("cover");
            });
        }

        if (exitModal) {
            exitModal.addEventListener("click", (e) => {
                if (e.target === exitModal) exitModal.classList.remove("active");
            });
        }

        if (exitModal) {
            exitModal.addEventListener("click", (e) => {
                if (e.target === exitModal) exitModal.classList.remove("active");
            });
        }

        // Sound Toggle Button
        const soundBtn = document.getElementById("btn-toggle-sound");
        if (soundBtn) {
            soundBtn.addEventListener("click", () => {
                const muted = window.sound.toggleMute();
                this.updateSoundBtn();
                if (!muted) window.sound.playPop();
            });
        }

        // Share / QR Modal Buttons
        const shareBtn = document.getElementById("btn-share-app");
        const closeQrBtn = document.getElementById("btn-close-qr");
        const qrModal = document.getElementById("qr-modal");

        if (shareBtn) {
            shareBtn.addEventListener("click", () => {
                this.openQrModal();
            });
        }
        if (closeQrBtn && qrModal) {
            closeQrBtn.addEventListener("click", () => {
                qrModal.classList.remove("active");
            });
        }

        if (qrModal) {
            qrModal.addEventListener("click", (e) => {
                if (e.target === qrModal) qrModal.classList.remove("active");
            });
        }

        // Certificate modal close
        const certModal = document.getElementById("certificate-modal");
        const closeCertBtn = document.getElementById("btn-close-cert");
        if (closeCertBtn && certModal) {
            closeCertBtn.addEventListener("click", () => {
                certModal.classList.remove("active");
            });
        }

        // Keyboard navigation for slide presentation
        window.addEventListener("keydown", (e) => {
            if (this.currentScreen === "bahan-ajar") {
                if (e.key === "ArrowRight" || e.key === " ") {
                    this.nextSlide();
                } else if (e.key === "ArrowLeft") {
                    this.prevSlide();
                }
            }
        });
    }

    updateSoundBtn() {
        const iconEl = document.getElementById("sound-icon-display");
        const textEl = document.querySelector("#btn-toggle-sound .btn-text-desktop");
        if (iconEl) {
            const muted = window.sound.isMuted();
            iconEl.textContent = muted ? "🔇" : "🔊";
            if (textEl) {
                textEl.textContent = muted ? "Suara: Off" : "Suara: On";
            }
        }
    }

    // --- SLIDESHOW (BAHAN AJAR) LOGIC ---
    setupSlides() {
        const thumbContainer = document.getElementById("slide-thumbnails");
        if (!thumbContainer) return;

        let thumbsHtml = "";
        for (let i = 1; i <= this.totalSlides; i++) {
            const numStr = i.toString().padStart(2, "0");
            thumbsHtml += `
                <div class="thumb-item ${i === 1 ? 'active' : ''}" onclick="appState.goToSlide(${i})" id="thumb-${i}">
                    <img src="assets/slides/slide_${numStr}.jpg" alt="Slide ${i}">
                    <span>Slide ${i}</span>
                </div>
            `;
        }
        thumbContainer.innerHTML = thumbsHtml;
    }

    updateSlideView() {
        const numStr = this.currentSlide.toString().padStart(2, "0");
        const imgEl = document.getElementById("current-slide-img");
        const counterEl = document.getElementById("slide-counter");

        if (imgEl) {
            imgEl.style.opacity = "0.4";
            setTimeout(() => {
                imgEl.src = `assets/slides/slide_${numStr}.jpg`;
                imgEl.style.opacity = "1";
            }, 120);
        }

        if (counterEl) {
            counterEl.textContent = `Slide ${this.currentSlide} / ${this.totalSlides}`;
        }

        // Update active thumb
        document.querySelectorAll(".thumb-item").forEach(t => t.classList.remove("active"));
        const curThumb = document.getElementById(`thumb-${this.currentSlide}`);
        if (curThumb) {
            curThumb.classList.add("active");
            curThumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.currentSlide++;
            window.sound.playClick();
            this.updateSlideView();
        }
    }

    prevSlide() {
        if (this.currentSlide > 1) {
            this.currentSlide--;
            window.sound.playClick();
            this.updateSlideView();
        }
    }

    goToSlide(num) {
        if (num >= 1 && num <= this.totalSlides) {
            this.currentSlide = num;
            window.sound.playClick();
            this.updateSlideView();
        }
    }

    toggleAutoplay() {
        const btn = document.getElementById("btn-autoplay-slide");
        if (this.slideAutoplayTimer) {
            clearInterval(this.slideAutoplayTimer);
            this.slideAutoplayTimer = null;
            if (btn) btn.innerHTML = "▶ Auto";
        } else {
            this.slideAutoplayTimer = setInterval(() => {
                if (this.currentSlide < this.totalSlides) {
                    this.nextSlide();
                } else {
                    this.goToSlide(1);
                }
            }, 4500);
            if (btn) btn.innerHTML = "⏸ Henti";
        }
    }

    toggleSlideFullscreen() {
        const frame = document.getElementById("slide-main-frame");
        if (!frame) return;
        if (!document.fullscreenElement) {
            frame.requestFullscreen?.().catch(() => {});
        } else {
            document.exitFullscreen?.().catch(() => {});
        }
    }

    // --- PANDUAN PRAKTIKUM TAB SWITCHING ---
    switchGuide(guideKey) {
        window.sound.playClick();
        document.querySelectorAll(".guide-tab-chips .lab-chip-btn").forEach(btn => btn.classList.remove("active"));
        document.querySelectorAll(".guide-content-panel").forEach(panel => panel.classList.remove("active"));

        const tabBtn = document.getElementById(`tab-guide-${guideKey}`);
        const tabContent = document.getElementById(`panel-guide-${guideKey}`);
        if (tabBtn) tabBtn.classList.add("active");
        if (tabContent) tabContent.classList.add("active");
    }

    // --- VIDEO PRAKTIKUM TAB SWITCHING (3 DOMAIN PENGUKURAN) ---
    switchVideoTab(videoKey) {
        window.sound.playClick();
        
        // Pause any active HTML5 video
        const localVideo = document.getElementById("lab-video-player");
        if (localVideo) localVideo.pause();

        document.querySelectorAll("#screen-video-praktikum .lab-chip-btn").forEach(btn => btn.classList.remove("active"));
        document.querySelectorAll("#screen-video-praktikum .video-panel").forEach(panel => {
            panel.classList.remove("active");
            panel.style.display = "none";
        });

        const tabBtn = document.getElementById(`tab-video-${videoKey}`);
        const panel = document.getElementById(`panel-video-${videoKey}`);
        if (tabBtn) tabBtn.classList.add("active");
        if (panel) {
            panel.style.display = "block";
            panel.classList.add("active");
        }
    }

    // --- VIRTUAL LAB TAB SWITCHING ---
    switchLab(labKey) {
        window.sound.playClick();
        document.querySelectorAll(".lab-tab-chips .lab-chip-btn").forEach(btn => btn.classList.remove("active"));
        document.querySelectorAll(".lab-panel").forEach(panel => panel.classList.remove("active"));

        const tabBtn = document.getElementById(`tab-lab-${labKey}`);
        const panel = document.getElementById(`panel-lab-${labKey}`);
        if (tabBtn) tabBtn.classList.add("active");
        if (panel) panel.classList.add("active");

        setTimeout(() => {
            if (labKey === "caliper") window.vernierSim.draw();
            if (labKey === "spring") window.springSim.draw();
            if (labKey === "pendulum") window.pendulumSim.draw();
        }, 50);
    }

    // --- SUB-SIMULATOR TOGGLES (CANVAS vs EMBEDDED PHET/OLABS) ---
    switchPendulumMode(mode) {
        window.sound.playClick();
        const btnPhet = document.getElementById("btn-pendulum-mode-phet");
        const btnCanvas = document.getElementById("btn-pendulum-mode-canvas");
        const viewPhet = document.getElementById("pendulum-phet-view");
        const viewCanvas = document.getElementById("pendulum-canvas-view");

        if (mode === "phet") {
            if (btnPhet) btnPhet.classList.add("active");
            if (btnCanvas) btnCanvas.classList.remove("active");
            if (viewPhet) { viewPhet.style.display = "block"; viewPhet.classList.add("active"); }
            if (viewCanvas) { viewCanvas.style.display = "none"; viewCanvas.classList.remove("active"); }
        } else {
            if (btnCanvas) btnCanvas.classList.add("active");
            if (btnPhet) btnPhet.classList.remove("active");
            if (viewCanvas) { viewCanvas.style.display = "block"; viewCanvas.classList.add("active"); }
            if (viewPhet) { viewPhet.style.display = "none"; viewPhet.classList.remove("active"); }
            setTimeout(() => window.pendulumSim.draw(), 50);
        }
    }

    reloadPhetFrame() {
        window.sound.playClick();
        const frame = document.getElementById("phet-inapp-frame");
        if (frame) {
            const currentSrc = frame.src;
            frame.src = "about:blank";
            setTimeout(() => { frame.src = currentSrc; }, 100);
        }
    }

    fullscreenPhetFrame() {
        window.sound.playClick();
        const holder = document.getElementById("phet-iframe-holder");
        if (!holder) return;

        if (!document.fullscreenElement) {
            if (holder.requestFullscreen) {
                holder.requestFullscreen();
            } else if (holder.webkitRequestFullscreen) {
                holder.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
        }
    }

    switchCaliperMode(mode) {
        window.sound.playClick();
        const btnCanvas = document.getElementById("btn-mode-caliper-canvas");
        const btnOlabs = document.getElementById("btn-mode-caliper-olabs");
        const viewCanvas = document.getElementById("view-caliper-canvas");
        const viewOlabs = document.getElementById("view-caliper-olabs");
        const frame = document.getElementById("olabs-caliper-frame");

        if (mode === "olabs") {
            if (btnOlabs) btnOlabs.classList.add("active");
            if (btnCanvas) btnCanvas.classList.remove("active");
            if (viewOlabs) { viewOlabs.style.display = "block"; viewOlabs.classList.add("active"); }
            if (viewCanvas) { viewCanvas.style.display = "none"; viewCanvas.classList.remove("active"); }
            if (frame && (!frame.src || frame.src === "about:blank")) {
                frame.src = frame.getAttribute("data-src") || "https://amrita.olabs.edu.in/?sub=1&brch=5&sim=16&cnt=4";
            }
        } else {
            if (btnCanvas) btnCanvas.classList.add("active");
            if (btnOlabs) btnOlabs.classList.remove("active");
            if (viewCanvas) { viewCanvas.style.display = "block"; viewCanvas.classList.add("active"); }
            if (viewOlabs) { viewOlabs.style.display = "none"; viewOlabs.classList.remove("active"); }
            setTimeout(() => window.vernierSim.draw(), 50);
        }
    }

    switchSpringMode(mode) {
        window.sound.playClick();
        const btnCanvas = document.getElementById("btn-mode-spring-canvas");
        const btnOlabs = document.getElementById("btn-mode-spring-olabs");
        const viewCanvas = document.getElementById("view-spring-canvas");
        const viewOlabs = document.getElementById("view-spring-olabs");
        const frame = document.getElementById("olabs-spring-frame");

        if (mode === "olabs") {
            if (btnOlabs) btnOlabs.classList.add("active");
            if (btnCanvas) btnCanvas.classList.remove("active");
            if (viewOlabs) { viewOlabs.style.display = "block"; viewOlabs.classList.add("active"); }
            if (viewCanvas) { viewCanvas.style.display = "none"; viewCanvas.classList.remove("active"); }
            if (frame && (!frame.src || frame.src === "about:blank")) {
                frame.src = frame.getAttribute("data-src") || "https://amrita.olabs.edu.in/?sub=1&brch=5&sim=22&cnt=4";
            }
        } else {
            if (btnCanvas) btnCanvas.classList.add("active");
            if (btnOlabs) btnOlabs.classList.remove("active");
            if (viewCanvas) { viewCanvas.style.display = "block"; viewCanvas.classList.add("active"); }
            if (viewOlabs) { viewOlabs.style.display = "none"; viewOlabs.classList.remove("active"); }
            setTimeout(() => window.springSim.draw(), 50);
        }
    }

    // --- EMBEDDED SIMULATION IFRAME PLAYER (HUB) ---
    loadSimFrame(simKey) {
        window.sound.playClick();
        const frame = document.getElementById("inapp-sim-frame");
        const titleEl = document.getElementById("sim-active-title");
        const descEl = document.getElementById("sim-active-desc");
        const extLink = document.getElementById("btn-sim-ext-link");

        document.querySelectorAll(".sim-switch-chips .chip-btn").forEach(b => b.classList.remove("active"));

        let src = "";
        let title = "";
        let desc = "";
        let btnId = "";

        if (simKey === "phet") {
            src = "https://phet.colorado.edu/sims/html/pendulum-lab/latest/pendulum-lab_all.html";
            title = "🎯 <strong>PhET Interactive Simulations:</strong> Pendulum Lab (University of Colorado)";
            desc = "Simulasi berjalan langsung di dalam aplikasi! Atur panjang tali, massa bandul, gesekan udara, dan ukur waktu periode ayunan secara interaktif.";
            btnId = "btn-sim-phet";
        } else if (simKey === "olabs-caliper") {
            src = "https://amrita.olabs.edu.in/?sub=1&brch=5&sim=16&cnt=4";
            title = "📏 <strong>Amrita OLabs:</strong> Virtual Vernier Caliper (Jangka Sorong)";
            desc = "Simulasi web resmi OLabs pengukuran panjang dengan rahang geser dan skala nonius ketelitian 0,01 cm.";
            btnId = "btn-sim-caliper";
        } else if (simKey === "olabs-spring") {
            src = "https://amrita.olabs.edu.in/?sub=1&brch=5&sim=22&cnt=4";
            title = "⚖️ <strong>Amrita OLabs:</strong> Virtual Spring Balance (Neraca Pegas)";
            desc = "Simulasi web resmi OLabs penentuan gaya berat dan massa beban berdasarkan Hukum Hooke.";
            btnId = "btn-sim-spring";
        }

        const activeBtn = document.getElementById(btnId);
        if (activeBtn) activeBtn.classList.add("active");

        if (frame && src) frame.src = src;
        if (titleEl) titleEl.innerHTML = title;
        if (descEl) descEl.textContent = desc;
        if (extLink) extLink.href = src;
    }

    reloadSimFrame() {
        window.sound.playClick();
        const frame = document.getElementById("inapp-sim-frame");
        if (frame) {
            const currentSrc = frame.src;
            frame.src = "about:blank";
            setTimeout(() => { frame.src = currentSrc; }, 100);
        }
    }

    fullscreenSimFrame() {
        window.sound.playClick();
        const holder = document.getElementById("sim-iframe-holder");
        if (!holder) return;

        if (!document.fullscreenElement) {
            if (holder.requestFullscreen) {
                holder.requestFullscreen();
            } else if (holder.webkitRequestFullscreen) {
                holder.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    openDownloadModal() {
        window.sound.playClick();
        const m = document.getElementById("download-app-modal");
        if (m) m.classList.add("active");
    }

    triggerPwaInstall() {
        window.sound.playClick();
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice.then(() => {
                this.deferredPrompt = null;
                const m = document.getElementById("download-app-modal");
                if (m) m.classList.remove("active");
            });
        } else {
            alert("Aplikasi web ini telah siap digunakan! Pada browser HP, ketuk menu browser (titik 3) lalu pilih 'Tambahkan ke Layar Utama' (Add to Home Screen).");
        }
    }

    openExitModal() {
        window.sound.playClick();
        const m = document.getElementById("exit-modal");
        if (m) m.classList.add("active");
    }

    // --- QR CODE GENERATION & SHARE ---
    openQrModal() {
        window.sound.playClick();
        const qrModal = document.getElementById("qr-modal");
        const container = document.getElementById("qrcode-target");
        if (!qrModal || !container) return;

        const currentUrl = window.location.href;
        const linkInput = document.getElementById("share-url-input");
        if (linkInput) linkInput.value = currentUrl;

        container.innerHTML = "";
        try {
            if (window.QRCodeGenerator) {
                const canvas = window.QRCodeGenerator.generateCanvas(currentUrl, 200);
                canvas.id = "generated-qr-canvas";
                container.appendChild(canvas);
            }
        } catch (e) {
            container.innerHTML = `<p>Gagal membuat QR: ${e.message}</p>`;
        }

        qrModal.classList.add("active");
    }

    copyShareLink() {
        window.sound.playPop();
        const input = document.getElementById("share-url-input");
        if (input) {
            navigator.clipboard.writeText(input.value).then(() => {
                const btn = document.getElementById("btn-copy-link");
                if (btn) {
                    btn.textContent = "✅ Disalin!";
                    setTimeout(() => btn.textContent = "Salin Link", 2000);
                }
            });
        }
    }

    downloadQrImage() {
        window.sound.playPop();
        const canvas = document.getElementById("generated-qr-canvas");
        if (!canvas) return;
        const a = document.createElement("a");
        a.download = "QR_Code_Media_Pembelajaran_Pengukuran.png";
        a.href = canvas.toDataURL("image/png");
        a.click();
    }

    // --- PWA SETUP ---
    setupPWA() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js').catch(err => {
                    console.log('SW registration failed:', err);
                });
            });
        }

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            const installBtn = document.getElementById("btn-install-app");
            if (installBtn) {
                installBtn.style.display = "flex";
                installBtn.addEventListener("click", () => {
                    if (this.deferredPrompt) {
                        this.deferredPrompt.prompt();
                        this.deferredPrompt.userChoice.then(() => {
                            this.deferredPrompt = null;
                            installBtn.style.display = "none";
                        });
                    }
                });
            }
        });
    }
}

window.appState = new AppState();

document.addEventListener("DOMContentLoaded", () => {
    window.appState.init();
    window.vernierSim.init();
    window.springSim.init();
    window.pendulumSim.init();
});
