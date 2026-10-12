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
        this.modulPage = 1;
        this.totalModulPages = 11;
        this.guidePages = { caliper: 1, spring: 1, pendulum: 1 };
        this.guideTotals = { caliper: 5, spring: 5, pendulum: 9 };
    }

    init() {
        this.detectDeviceType();
        this.setupOrientationHandler();
        this.setupEventListeners();
        this.checkInitialScreen();
        this.setupPWA();
        this.updateSoundBtn();
        this.setupSlides();
        this.setupModulViewer();
        this.setupGuideViewer();

        // Check if running in Docker with Nginx reverse proxy
        if (window.location.port === "8080" || window.location.pathname.startsWith("/olabs-proxy/")) {
            const caliperFrame = document.getElementById("caliper-inapp-frame");
            if (caliperFrame) {
                caliperFrame.src = "/olabs-proxy/?sub=1&brch=5&sim=16&cnt=4";
            }
            const springFrame = document.getElementById("spring-inapp-frame");
            if (springFrame) {
                springFrame.src = "/olabs-proxy/?sub=1&brch=1&sim=2&cnt=4";
            }
        }
    }

    detectDeviceType() {
        const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isSmallScreen = window.innerWidth <= 820;

        const isMobile = (isTouch && isSmallScreen) || isMobileUA;

        if (isMobile) {
            document.body.classList.add("is-mobile-device");
            document.body.classList.remove("is-desktop-device");
        } else {
            document.body.classList.add("is-desktop-device");
            document.body.classList.remove("is-mobile-device");
        }
        return isMobile;
    }

    setupOrientationHandler() {
        const handlePhysicalOrientation = () => {
            const isMobile = this.detectDeviceType();
            if (!isMobile) return;

            let isLandscape = false;
            if (window.screen && window.screen.orientation) {
                isLandscape = window.screen.orientation.type.includes("landscape");
            } else if (typeof window.orientation !== "undefined") {
                isLandscape = Math.abs(window.orientation) === 90;
            } else {
                isLandscape = window.innerWidth > window.innerHeight;
            }

            const wrapper = document.querySelector(".app-viewport-wrapper");
            if (wrapper) {
                if (isLandscape) {
                    wrapper.classList.add("device-landscape-mode");
                } else {
                    wrapper.classList.remove("device-landscape-mode");
                }
                this.updateOrientButtonLabels(isLandscape);
            }

            setTimeout(() => {
                window.vernierSim?.draw();
                window.springSim?.draw();
                window.pendulumSim?.draw();
            }, 180);
        };

        window.addEventListener("resize", () => {
            this.detectDeviceType();
        });

        if (window.screen && window.screen.orientation) {
            window.screen.orientation.addEventListener("change", handlePhysicalOrientation);
        }
        window.addEventListener("orientationchange", handlePhysicalOrientation);
    }

    updateOrientButtonLabels(isLandscape) {
        const orientBtns = document.querySelectorAll(".btn-orient-toggle");
        orientBtns.forEach(btn => {
            const text = btn.querySelector(".orient-text");
            const icon = btn.querySelector(".orient-icon");
            if (text) text.textContent = isLandscape ? "Mode Portrait" : "Putar Layar";
            if (icon) icon.textContent = isLandscape ? "📱" : "🔄";
        });
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
        const playPrimary = document.getElementById("play-text-primary");
        const playSub = document.getElementById("play-text-sub");

        if (this.student && this.student.name && this.student.name !== "Peserta Didik") {
            if (chipName) chipName.textContent = this.student.name;
            if (dashGreeting) dashGreeting.textContent = this.student.name;
            if (badge) badge.style.display = "flex";

            if (playPrimary) playPrimary.textContent = `LANJUTKAN: ${this.student.name.toUpperCase()}!`;
            if (playSub) playSub.textContent = `Kelas ${this.student.className} • Klik untuk Mulai Misi Belajar`;
        } else {
            if (chipName) chipName.textContent = "Siswa";
            if (dashGreeting) dashGreeting.textContent = "Siswa";
            if (badge) badge.style.display = "none";

            if (playPrimary) playPrimary.textContent = "MULAI PETUALANGAN";
            if (playSub) playSub.textContent = "Klik di sini untuk Membuka Laboratorium Sains";
        }
    }

    openStudentModal(forceEdit = false) {
        window.sound.playClick();
        const modal = document.getElementById("student-modal");
        const regBox = document.getElementById("student-modal-registered");
        const formBox = document.getElementById("student-input-form");

        if (this.student && this.student.name && this.student.name !== "Peserta Didik" && !forceEdit) {
            if (regBox) regBox.style.display = "block";
            if (formBox) formBox.style.display = "none";

            const regName = document.getElementById("modal-reg-name");
            const regMeta = document.getElementById("modal-reg-meta");
            const regBtnName = document.getElementById("modal-reg-btn-name");

            if (regName) regName.textContent = this.student.name.toUpperCase();
            if (regMeta) regMeta.textContent = `Kelas ${this.student.className} • ${this.student.school || "SMP/MTs"}`;
            if (regBtnName) regBtnName.textContent = this.student.name;
        } else {
            this.showStudentFormFields(forceEdit);
        }

        if (modal) modal.classList.add("active");
    }

    closeStudentModal() {
        window.sound.playClick();
        const modal = document.getElementById("student-modal");
        if (modal) modal.classList.remove("active");
    }

    showStudentFormFields(prefill = true) {
        const regBox = document.getElementById("student-modal-registered");
        const formBox = document.getElementById("student-input-form");

        if (regBox) regBox.style.display = "none";
        if (formBox) formBox.style.display = "block";

        const inName = document.getElementById("input-nama");
        const inKelas = document.getElementById("input-kelas");
        const inAbsen = document.getElementById("input-absen");
        const inSekolah = document.getElementById("input-sekolah");

        if (prefill && this.student && this.student.name && this.student.name !== "Peserta Didik") {
            if (inName) inName.value = this.student.name;
            if (inKelas) inKelas.value = this.student.className;
            if (inAbsen) inAbsen.value = (this.student.absen !== "-" ? this.student.absen : "");
            if (inSekolah) inSekolah.value = this.student.school || "SMP/MTs";
        } else {
            if (inName) inName.value = "";
            if (inKelas) inKelas.value = "";
            if (inAbsen) inAbsen.value = "";
            if (inSekolah) inSekolah.value = "SMP Negeri 1";
        }

        if (inName) setTimeout(() => inName.focus(), 150);
    }

    continueAsRegistered() {
        this.closeStudentModal();
        window.sound.playSuccess();
        this.navigateTo("dashboard");
    }

    handleStudentFormSubmit() {
        const nameInput = document.getElementById("input-nama");
        const kelasInput = document.getElementById("input-kelas");
        const absenInput = document.getElementById("input-absen");
        const sekolahInput = document.getElementById("input-sekolah");

        const name = nameInput ? nameInput.value.trim() : "";
        const kelas = kelasInput ? kelasInput.value.trim() : "";
        const absen = absenInput ? absenInput.value.trim() : "-";
        const sekolah = sekolahInput ? sekolahInput.value.trim() : "SMP/MTs";

        if (!name) {
            if (nameInput) nameInput.focus();
            return;
        }

        this.saveStudent(name, kelas || "VII A", absen, sekolah);
        this.closeStudentModal();
        window.sound.playSuccess();
        if (window.confetti && window.confetti.start) {
            window.confetti.start(1200);
        }
        this.navigateTo("dashboard");
    }

    handlePlayClick() {
        this.openStudentModal(false);
    }

    checkInitialScreen() {
        this.updateHeaderProfile();
        this.navigateTo("cover");
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
            target.style.display = (screenId === "cover") ? "flex" : "block";
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
        if (screenId === "cover") {
            document.body.classList.add("on-cover");
        } else {
            document.body.classList.remove("on-cover");
        }
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Pause all running media when navigating between screens
        this.pauseAllMedia();

        // Trigger sub-initializers per screen
        if (screenId === "virtual-lab") {
            setTimeout(() => {
                window.vernierSim?.draw();
                window.springSim?.draw();
                window.pendulumSim?.draw();
            }, 100);
        } else if (screenId === "kuis") {
            if (window.quizManager && (!window.quizManager.questions || !window.quizManager.questions.length || !document.getElementById("quiz-question-box").children.length)) {
                window.quizManager.start();
            }
        } else if (screenId === "panduan-praktikum") {
            this.switchGuide("caliper");
        } else if (screenId === "video-praktikum") {
            this.switchVideoTab("caliper");
        } else if (screenId === "modul-ajar") {
            this.updateModulViewer();
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
                const inName = document.getElementById("input-nama");
                const inKelas = document.getElementById("input-kelas");
                const inAbsen = document.getElementById("input-absen");
                const inSekolah = document.getElementById("input-sekolah");
                if (inName) inName.value = "";
                if (inKelas) inKelas.value = "";
                if (inAbsen) inAbsen.value = "";
                if (inSekolah) inSekolah.value = "SMP Negeri 1";
                
                this.updateHeaderProfile();
                this.navigateTo("cover");
                this.showToast("Berhasil keluar dari sesi belajar", "info");
            });
        }

        if (exitModal) {
            exitModal.addEventListener("click", (e) => {
                if (e.target === exitModal) exitModal.classList.remove("active");
            });
        }

        // Listen to postMessage from embedded simulators (e.g. OLabs HTML5 Vernier Caliper)
        window.addEventListener("message", (e) => {
            if (e.data && e.data.type === "LOG_CALIPER_TO_LKPD") {
                if (window.lkpdManager) {
                    window.lkpdManager.addMeasurement("length", {
                        obj: e.data.obj || "Jangka Sorong",
                        su: e.data.su,
                        sn: e.data.sn,
                        total: e.data.total
                    });
                    this.showToast(`✅ Data ${e.data.obj} (${e.data.total} cm) berhasil dicatat ke LKPD!`, "success");
                }
            }
        });

        // Fullscreen change synchronization for Bahan Ajar
        document.addEventListener("fullscreenchange", () => {
            const frame = document.getElementById("slide-main-frame");
            const btnFs = document.getElementById("btn-toggle-fullscreen");
            const btnClose = document.getElementById("btn-slide-fs-exit");
            if (!document.fullscreenElement) {
                if (frame) frame.classList.remove("is-fullscreen");
                if (btnFs) btnFs.innerHTML = "⛶ Full";
                if (btnClose) btnClose.style.display = "none";
            } else {
                if (btnFs) btnFs.innerHTML = "🗗 Keluar Full";
                if (btnClose) btnClose.style.display = "inline-flex";
            }
        });

        // Listen to physical orientation change on mobile devices
        window.addEventListener("orientationchange", () => {
            const wrapper = document.querySelector(".app-viewport-wrapper");
            if (wrapper) wrapper.classList.remove("device-landscape-mode");
            setTimeout(() => {
                window.vernierSim?.draw();
                window.springSim?.draw();
                window.pendulumSim?.draw();
            }, 200);
        });

        if (window.screen && window.screen.orientation) {
            window.screen.orientation.addEventListener("change", () => {
                const wrapper = document.querySelector(".app-viewport-wrapper");
                if (wrapper) wrapper.classList.remove("device-landscape-mode");
                setTimeout(() => {
                    window.vernierSim?.draw();
                    window.springSim?.draw();
                    window.pendulumSim?.draw();
                }, 200);
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
        if (!document.fullscreenElement && !frame.classList.contains("is-fullscreen")) {
            this.enterSlideFullscreen();
        } else {
            this.exitSlideFullscreen();
        }
    }

    enterSlideFullscreen() {
        const frame = document.getElementById("slide-main-frame");
        const btnFs = document.getElementById("btn-toggle-fullscreen");
        const btnClose = document.getElementById("btn-slide-fs-exit");
        if (!frame) return;

        if (frame.requestFullscreen) {
            frame.requestFullscreen().catch(() => {
                frame.classList.add("is-fullscreen");
            });
        } else {
            frame.classList.add("is-fullscreen");
        }
        if (btnFs) btnFs.innerHTML = "🗗 Keluar Full";
        if (btnClose) btnClose.style.display = "inline-flex";
    }

    exitSlideFullscreen() {
        const frame = document.getElementById("slide-main-frame");
        const btnFs = document.getElementById("btn-toggle-fullscreen");
        const btnClose = document.getElementById("btn-slide-fs-exit");

        if (document.fullscreenElement) {
            document.exitFullscreen?.().catch(() => {});
        }
        if (frame) frame.classList.remove("is-fullscreen");
        if (btnFs) btnFs.innerHTML = "⛶ Full";
        if (btnClose) btnClose.style.display = "none";
    }

    // --- VIDEO PRAKTIKUM TAB SWITCHING (3 DOMAIN PENGUKURAN) ---
    switchVideoTab(videoKey) {
        window.sound?.playClick();
        
        // Pause any active HTML5 video or YouTube iframe
        this.pauseAllMedia();

        document.querySelectorAll("#screen-video-praktikum .video-choice-card").forEach(btn => btn.classList.remove("active"));
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

    pauseAllMedia() {
        // Pause local HTML5 video if playing
        const localVideo = document.getElementById("lab-video-player");
        if (localVideo && !localVideo.paused) {
            localVideo.pause();
        }

        // PostMessage pause to all YouTube embeds
        const iframes = [
            document.getElementById("yt-player-caliper"),
            document.getElementById("yt-player-spring")
        ];
        iframes.forEach(iframe => {
            if (iframe && iframe.contentWindow) {
                try {
                    iframe.contentWindow.postMessage(JSON.stringify({
                        event: "command",
                        func: "pauseVideo",
                        args: ""
                    }), "*");
                } catch (e) {}
            }
        });
    }

    // --- VIRTUAL LAB TAB SWITCHING ---
    switchLab(labKey) {
        window.sound?.playClick();
        document.querySelectorAll(".lab-tab-chips .lab-chip-btn").forEach(btn => btn.classList.remove("active"));
        document.querySelectorAll(".lab-panel").forEach(panel => {
            panel.classList.remove("active");
            panel.style.display = "none";
        });

        const tabBtn = document.getElementById(`tab-lab-${labKey}`);
        const panel = document.getElementById(`panel-lab-${labKey}`);
        if (tabBtn) tabBtn.classList.add("active");
        if (panel) {
            panel.style.display = "block";
            panel.classList.add("active");
        }

        setTimeout(() => {
            if (labKey === "caliper") window.vernierSim?.draw();
            if (labKey === "spring") window.springSim?.draw();
            if (labKey === "pendulum") window.pendulumSim?.draw();
            if (labKey === "lkpd") window.lkpdManager?.renderAll();
        }, 50);
    }

    // --- SUB-SIMULATOR TOGGLES (CANVAS vs EMBEDDED OLABS / PHET) ---
    switchCaliperMode(mode) {
        window.sound?.playClick();
        const btnOlabs = document.getElementById("btn-caliper-mode-olabs");
        const btnCanvas = document.getElementById("btn-caliper-mode-canvas");
        const viewOlabs = document.getElementById("caliper-olabs-view");
        const viewCanvas = document.getElementById("caliper-canvas-view");

        if (mode === "olabs") {
            if (btnOlabs) btnOlabs.classList.add("active");
            if (btnCanvas) btnCanvas.classList.remove("active");
            if (viewOlabs) { viewOlabs.style.display = "block"; viewOlabs.classList.add("active"); }
            if (viewCanvas) { viewCanvas.style.display = "none"; viewCanvas.classList.remove("active"); }
        } else {
            if (btnCanvas) btnCanvas.classList.add("active");
            if (btnOlabs) btnOlabs.classList.remove("active");
            if (viewCanvas) { viewCanvas.style.display = "block"; viewCanvas.classList.add("active"); }
            if (viewOlabs) { viewOlabs.style.display = "none"; viewOlabs.classList.remove("active"); }
            setTimeout(() => window.vernierSim?.draw(), 50);
        }
    }

    switchCaliperEngine(engine) {
        window.sound?.playClick();
        const btnCompadre = document.getElementById("btn-engine-compadre");
        const btnOlabs = document.getElementById("btn-engine-olabs");
        const frame = document.getElementById("caliper-inapp-frame");
        const olabsCard = document.getElementById("caliper-olabs-helper");

        if (engine === "compadre" || engine === "inapp") {
            if (btnCompadre) btnCompadre.classList.add("active");
            if (btnOlabs) btnOlabs.classList.remove("active");
            if (frame && !frame.src.includes("assets/simulators/vernier/index.html")) {
                frame.src = "assets/simulators/vernier/index.html";
            }
            if (olabsCard) olabsCard.style.display = "none";
        } else {
            // Open official portal directly in new tab (avoids ERR_BLOCKED_BY_RESPONSE / sad face)
            this.openOLabsWindow("caliper");
            if (btnCompadre) btnCompadre.classList.add("active");
            if (btnOlabs) btnOlabs.classList.remove("active");
        }
    }

    reloadCaliperFrame() {
        window.sound?.playClick();
        const frame = document.getElementById("caliper-inapp-frame");
        if (frame) {
            const currentSrc = frame.src;
            frame.src = "about:blank";
            setTimeout(() => { frame.src = currentSrc; }, 100);
        }
    }

    fullscreenCaliperFrame() {
        window.sound?.playClick();
        const holder = document.getElementById("caliper-iframe-holder");
        if (!holder) return;
        if (!document.fullscreenElement) {
            if (holder.requestFullscreen) holder.requestFullscreen();
            else if (holder.webkitRequestFullscreen) holder.webkitRequestFullscreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
        }
    }

    toggleDeviceOrientation() {
        window.sound?.playClick();
        const wrapper = document.querySelector(".app-viewport-wrapper");
        if (!wrapper) return;

        const isLandscape = wrapper.classList.toggle("device-landscape-mode");

        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock(isLandscape ? "landscape" : "portrait").catch(() => {});
        }

        const orientBtns = document.querySelectorAll(".btn-orient-toggle");
        orientBtns.forEach(btn => {
            const text = btn.querySelector(".orient-text");
            const icon = btn.querySelector(".orient-icon");
            if (text) text.textContent = isLandscape ? "Mode Portrait" : "Putar Layar";
            if (icon) icon.textContent = isLandscape ? "📱" : "🔄";
        });

        if (isLandscape) {
            this.showToast("🔄 Tampilan dialihkan ke Mode Landscape (Mendatar)", "info");
        } else {
            this.showToast("📱 Tampilan dialihkan ke Mode Portrait (Tegak)", "info");
        }

        setTimeout(() => {
            window.vernierSim?.draw();
            window.springSim?.draw();
            window.pendulumSim?.draw();
        }, 150);
    }

    switchSpringMode(mode) {
        window.sound?.playClick();
        const btnOnline = document.getElementById("btn-spring-mode-online");
        const btnCanvas = document.getElementById("btn-spring-mode-canvas");
        const viewOnline = document.getElementById("spring-online-view");
        const viewCanvas = document.getElementById("spring-canvas-view");

        if (mode === "online") {
            if (btnOnline) btnOnline.classList.add("active");
            if (btnCanvas) btnCanvas.classList.remove("active");
            if (viewOnline) { viewOnline.style.display = "block"; viewOnline.classList.add("active"); }
            if (viewCanvas) { viewCanvas.style.display = "none"; viewCanvas.classList.remove("active"); }
        } else {
            if (btnCanvas) btnCanvas.classList.add("active");
            if (btnOnline) btnOnline.classList.remove("active");
            if (viewCanvas) { viewCanvas.style.display = "block"; viewCanvas.classList.add("active"); }
            if (viewOnline) { viewOnline.style.display = "none"; viewOnline.classList.remove("active"); }
            setTimeout(() => window.springSim?.draw(), 50);
        }
    }

    reloadSpringFrame() {
        window.sound?.playClick();
        const frame = document.getElementById("spring-inapp-frame");
        if (frame) {
            const currentSrc = frame.src;
            frame.src = "about:blank";
            setTimeout(() => { frame.src = currentSrc; }, 100);
        }
    }

    fullscreenSpringFrame() {
        window.sound?.playClick();
        const holder = document.getElementById("spring-iframe-holder");
        if (!holder) return;
        if (!document.fullscreenElement) {
            if (holder.requestFullscreen) holder.requestFullscreen();
            else if (holder.webkitRequestFullscreen) holder.webkitRequestFullscreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
        }
    }

    openOLabsWindow(type) {
        window.sound?.playClick();
        let url = "https://www.olabs.edu.in/?sub=1&brch=5&sim=16&cnt=4";
        if (type === "spring") {
            url = "https://www.olabs.edu.in/?sub=1&brch=1&sim=2&cnt=4";
        } else if (type === "pendulum") {
            url = "http://amrita.olabs.edu.in/?sub=1&brch=5&sim=159&cnt=4";
        }
        window.open(url, "OLabsSimulationWindow", "width=1100,height=750,scrollbars=yes,resizable=yes");
    }

    // --- SUB-SIMULATOR TOGGLES (CANVAS vs EMBEDDED PHET) ---
    switchPendulumMode(mode) {
        window.sound?.playClick();
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
            setTimeout(() => window.pendulumSim?.draw(), 50);
        }
    }

    reloadPhetFrame() {
        window.sound?.playClick();
        const frame = document.getElementById("phet-inapp-frame");
        if (frame) {
            const currentSrc = frame.src;
            frame.src = "about:blank";
            setTimeout(() => { frame.src = currentSrc; }, 100);
        }
    }

    fullscreenPhetFrame() {
        window.sound?.playClick();
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

    // --- MODUL AJAR 11-PAGE VIEWER ---
    setupModulViewer() {
        const strip = document.getElementById("modul-thumb-strip");
        if (!strip) return;
        strip.innerHTML = "";

        for (let i = 1; i <= this.totalModulPages; i++) {
            const pad = i.toString().padStart(2, "0");
            const thumb = document.createElement("div");
            thumb.className = `modul-thumb-item ${i === this.modulPage ? "active" : ""}`;
            thumb.id = `modul-thumb-${i}`;
            thumb.innerHTML = `
                <img src="assets/modul/page_${pad}.jpg" alt="Thumb ${i}" loading="lazy">
                <span>Hal ${i}</span>
            `;
            thumb.onclick = () => this.jumpModulPage(i);
            strip.appendChild(thumb);
        }
        this.updateModulViewer();
    }

    updateModulViewer() {
        const pad = this.modulPage.toString().padStart(2, "0");
        const img = document.getElementById("img-modul-current");
        const badge = document.getElementById("modul-page-badge");

        if (img) img.src = `assets/modul/page_${pad}.jpg`;
        if (badge) badge.textContent = `Halaman ${this.modulPage} dari ${this.totalModulPages}`;

        document.querySelectorAll(".modul-thumb-item").forEach(item => item.classList.remove("active"));
        const activeThumb = document.getElementById(`modul-thumb-${this.modulPage}`);
        if (activeThumb) {
            activeThumb.classList.add("active");
            activeThumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
    }

    prevModulPage() {
        if (this.modulPage > 1) {
            this.modulPage--;
            window.sound?.playClick();
            this.updateModulViewer();
        }
    }

    nextModulPage() {
        if (this.modulPage < this.totalModulPages) {
            this.modulPage++;
            window.sound?.playClick();
            this.updateModulViewer();
        }
    }

    jumpModulPage(page) {
        if (page >= 1 && page <= this.totalModulPages) {
            this.modulPage = page;
            window.sound?.playClick();
            this.updateModulViewer();
        }
    }

    // --- PANDUAN PRAKTIKUM MULTI-PAGE VIEWER ---
    setupGuideViewer() {
        ["caliper", "spring", "pendulum"].forEach(guideKey => {
            const strip = document.getElementById(`thumbs-guide-${guideKey}`);
            if (!strip) return;
            strip.innerHTML = "";

            const total = this.guideTotals[guideKey];
            const folder = guideKey === "caliper" ? "User_Guide_Praktikum_Virtual_Jangka_Sorong" :
                          (guideKey === "spring" ? "User_Guide_Praktikum_Virtual_Neraca_Pegas" : "User_Guide_Pengukuran_Waktu");

            for (let i = 1; i <= total; i++) {
                const pad = i.toString().padStart(2, "0");
                const thumb = document.createElement("div");
                thumb.className = `guide-thumb-item ${i === this.guidePages[guideKey] ? "active" : ""}`;
                thumb.id = `guide-thumb-${guideKey}-${i}`;
                thumb.innerHTML = `
                    <img src="assets/guides/${folder}/page_${pad}.jpg" alt="Hal ${i}" loading="lazy">
                    <span>Hal ${i}</span>
                `;
                thumb.onclick = () => this.jumpGuidePage(guideKey, i);
                strip.appendChild(thumb);
            }
        });
    }

    switchGuide(guideKey) {
        window.sound?.playClick();
        document.querySelectorAll("#screen-panduan-praktikum .lab-chip-btn").forEach(btn => btn.classList.remove("active"));
        document.querySelectorAll("#screen-panduan-praktikum .guide-content-panel").forEach(p => {
            p.classList.remove("active");
            p.style.display = "none";
        });

        const activeBtn = document.getElementById(`tab-guide-${guideKey}`);
        const activePanel = document.getElementById(`panel-guide-${guideKey}`);
        if (activeBtn) activeBtn.classList.add("active");
        if (activePanel) {
            activePanel.style.display = "block";
            activePanel.classList.add("active");
        }
        this.updateGuideViewer(guideKey);
    }

    updateGuideViewer(guideKey) {
        const cur = this.guidePages[guideKey];
        const total = this.guideTotals[guideKey];
        const pad = cur.toString().padStart(2, "0");
        const folder = guideKey === "caliper" ? "User_Guide_Praktikum_Virtual_Jangka_Sorong" :
                      (guideKey === "spring" ? "User_Guide_Praktikum_Virtual_Neraca_Pegas" : "User_Guide_Pengukuran_Waktu");

        const img = document.getElementById(`img-guide-${guideKey}`);
        const badge = document.getElementById(`badge-guide-${guideKey}`);

        if (img) img.src = `assets/guides/${folder}/page_${pad}.jpg`;
        if (badge) badge.textContent = `Halaman ${cur} dari ${total}`;

        document.querySelectorAll(`#thumbs-guide-${guideKey} .guide-thumb-item`).forEach(it => it.classList.remove("active"));
        const activeThumb = document.getElementById(`guide-thumb-${guideKey}-${cur}`);
        if (activeThumb) {
            activeThumb.classList.add("active");
            activeThumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
    }

    prevGuidePage(guideKey) {
        if (this.guidePages[guideKey] > 1) {
            this.guidePages[guideKey]--;
            window.sound?.playClick();
            this.updateGuideViewer(guideKey);
        }
    }

    nextGuidePage(guideKey) {
        if (this.guidePages[guideKey] < this.guideTotals[guideKey]) {
            this.guidePages[guideKey]++;
            window.sound?.playClick();
            this.updateGuideViewer(guideKey);
        }
    }

    jumpGuidePage(guideKey, page) {
        if (page >= 1 && page <= this.guideTotals[guideKey]) {
            this.guidePages[guideKey] = page;
            window.sound?.playClick();
            this.updateGuideViewer(guideKey);
        }
    }

    // --- TOAST NOTIFICATION HELPER ---
    showToast(message, type = "success") {
        const toast = document.getElementById("app-toast");
        if (!toast) return;

        toast.textContent = message;
        toast.className = `app-toast active ${type}`;
        
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
            toast.classList.remove("active");
        }, 2800);
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
    getShareUrl() {
        let currentUrl = window.location.href;
        // If run locally (file:/// or localhost), use canonical live GitHub Pages URL
        if (currentUrl.startsWith("file:///") || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            return "https://salman-mustapa.github.io/projects-01/";
        }
        // If running on webhosting / subdomain, use the clean origin + path
        return window.location.origin + window.location.pathname;
    }

    openQrModal() {
        window.sound?.playClick();
        const qrModal = document.getElementById("qr-modal");
        const container = document.getElementById("qrcode-target");
        if (!qrModal || !container) return;

        const currentUrl = this.getShareUrl();
        const linkInput = document.getElementById("share-url-input");
        if (linkInput) linkInput.value = currentUrl;

        container.innerHTML = "";
        try {
            if (window.QRCodeGenerator) {
                // Generate clean, high-contrast QR canvas with standard quiet zone margin
                const canvas = window.QRCodeGenerator.generateCanvas(currentUrl, 260);
                canvas.id = "generated-qr-canvas";
                canvas.style.maxWidth = "100%";
                canvas.style.height = "auto";
                canvas.style.borderRadius = "8px";
                canvas.style.boxShadow = "0 2px 10px rgba(0,0,0,0.12)";
                container.appendChild(canvas);
            }
        } catch (e) {
            container.innerHTML = `<p style="color:#b91c1c;">Gagal membuat QR: ${e.message}</p>`;
        }

        qrModal.classList.add("active");
    }

    copyShareLink() {
        window.sound?.playPop();
        const input = document.getElementById("share-url-input");
        if (input) {
            navigator.clipboard.writeText(input.value).then(() => {
                const btn = document.getElementById("btn-copy-link");
                if (btn) {
                    btn.textContent = "✅ Disalin!";
                    setTimeout(() => btn.textContent = "Salin Link", 2000);
                }
                this.showToast("Link berhasil disalin ke papan klip!", "success");
            }).catch(() => {
                input.select();
                document.execCommand("copy");
                this.showToast("Link disalin!", "success");
            });
        }
    }

    downloadQrImage() {
        window.sound?.playPop();
        const qrCanvas = document.getElementById("generated-qr-canvas");
        if (!qrCanvas) return;

        const url = this.getShareUrl();

        // Render Branded Export Card (500 x 580)
        const exportCanvas = document.createElement("canvas");
        exportCanvas.width = 500;
        exportCanvas.height = 580;
        const ctx = exportCanvas.getContext("2d");

        // Pure white background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 500, 580);

        // Header Background
        ctx.fillStyle = "#047857";
        ctx.fillRect(0, 0, 500, 85);

        // Header Texts
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 20px Outfit, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("LAB VIRTUAL: PETUALANGAN PENGUKURAN", 250, 38);

        ctx.fillStyle = "#d1fae5";
        ctx.font = "14px Outfit, sans-serif";
        ctx.fillText("Media Pembelajaran Interaktif IPA Kelas VII SMP", 250, 64);

        // QR Code Container Box - Pure white with crisp outline
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(85, 115, 330, 330, 12);
        ctx.fill();
        ctx.stroke();

        // Draw the QR Code image (300 x 300) with proper quiet zone margin
        ctx.drawImage(qrCanvas, 100, 130, 300, 300);

        // Instruction Text Below QR
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 15px Outfit, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Scan QR Code dengan Kamera HP Anda", 250, 480);

        ctx.fillStyle = "#047857";
        ctx.font = "bold 13px Outfit, monospace";
        const displayUrl = url.length > 50 ? url.slice(0, 47) + "..." : url;
        ctx.fillText(displayUrl, 250, 510);

        ctx.fillStyle = "#64748b";
        ctx.font = "12px Outfit, sans-serif";
        ctx.fillText("Kurikulum Merdeka • Mandiri & Interaktif", 250, 545);

        // Trigger Download
        const a = document.createElement("a");
        a.download = "QR_Media_Pembelajaran_Petualangan_Pengukuran.png";
        a.href = exportCanvas.toDataURL("image/png");
        a.click();
        this.showToast("📥 Gambar Barcode QR berhasil diunduh!", "success");
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
    window.vernierSim?.init();
    window.springSim?.init();
    window.pendulumSim?.init();
    window.lkpdManager?.init();
});
