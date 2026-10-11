/**
 * KUIS HOTS IPA KELAS VII - MATERI PENGUKURAN
 * Data soal asli berdasarkan dokumen KUIS MATERI PENGUKURAN KELAS VII.pdf
 */
const QUIZ_DATA = [
    {
        id: 1,
        question: "Kelompok Rani akan mengukur panjang buku yang diperkirakan sekitar 24 cm. Mereka memiliki penggaris A dengan skala terkecil 1 cm dan penggaris B dengan skala terkecil 1 mm. Agar hasil pengukuran lebih teliti, keputusan terbaik adalah ....",
        options: [
            { key: "A", text: "Menggunakan penggaris A karena skalanya lebih besar" },
            { key: "B", text: "Menggunakan penggaris B karena skala terkecilnya lebih kecil" },
            { key: "C", text: "Menggunakan kedua penggaris lalu memilih hasil yang paling panjang" },
            { key: "D", text: "Mengukur tanpa penggaris agar buku tidak bergeser" }
        ],
        answer: "B",
        explanation: "Skala terkecil 1 mm (0,1 cm) memungkinkan pembacaan lebih teliti dan presisi daripada skala terkecil 1 cm. Ketelitian alat ukur ditentukan oleh nilai skala terkecil (NST)."
    },
    {
        id: 2,
        question: "Pada simulasi OLabs jangka sorong, skala utama menunjukkan 2,3 cm dan garis nonius ke-4 berimpit dengan garis pada skala utama. Jika ketelitian jangka sorong 0,01 cm, hasil pengukuran panjang benda adalah ....",
        options: [
            { key: "A", text: "2,04 cm" },
            { key: "B", text: "2,30 cm" },
            { key: "C", text: "2,34 cm" },
            { key: "D", text: "2,70 cm" }
        ],
        answer: "C",
        explanation: "Hasil pengukuran = Skala Utama + (Skala Nonius × Ketelitian) = 2,3 cm + (4 × 0,01 cm) = 2,3 cm + 0,04 cm = 2,34 cm."
    },
    {
        id: 3,
        question: "Dua siswa mengukur panjang meja yang sama. Dito memperoleh 120 cm, sedangkan Siska memperoleh 117 cm. Mereka ingin mengetahui penyebab perbedaan hasil. Langkah penyelidikan paling tepat adalah ....",
        options: [
            { key: "A", text: "Langsung memakai hasil Dito karena nilainya lebih besar" },
            { key: "B", text: "Mengganti meja dengan meja lain lalu mengukur sekali" },
            { key: "C", text: "Mengulangi pengukuran pada meja yang sama, memastikan titik nol dan posisi alat benar, lalu membandingkan hasil" },
            { key: "D", text: "Menghitung rata-rata kedua hasil tanpa memeriksa cara mengukur" }
        ],
        answer: "C",
        explanation: "Dalam metode ilmiah, pengulangan pengukuran dan pemeriksaan titik nol (zero error) serta posisi sudut pandang mata (paralaks) sangat krusial untuk menemukan penyebab ketidaksesuaian data."
    },
    {
        id: 4,
        question: "Seorang siswa mengukur panjang benda melalui simulasi jangka sorong pada simulasi di OLabs. Ia hanya membaca skala utama dan mengabaikan garis nonius yang berimpit. Dampak yang paling mungkin adalah ....",
        options: [
            { key: "A", text: "Hasil menjadi lebih teliti karena pembacaan lebih sederhana" },
            { key: "B", text: "Hasil pengukuran dapat kurang tepat karena kontribusi skala nonius tidak dihitung" },
            { key: "C", text: "Hasil otomatis berubah menjadi satuan kilogram" },
            { key: "D", text: "Jangka sorong berubah fungsi menjadi neraca pegas" }
        ],
        answer: "B",
        explanation: "Skala nonius berfungsi menambahkan fraksi ketelitian (desimal kedua). Mengabaikan skala nonius membuat hasil pengukuran kehilangan tingkat presisinya."
    },
    {
        id: 5,
        question: "Pada simulasi OLabs, sebuah benda digantung pada neraca pegas dan penunjuk berhenti pada angka 3 N. Besaran yang ditunjukkan oleh pembacaan tersebut adalah ....",
        options: [
            { key: "A", text: "Panjang benda" },
            { key: "B", text: "Gaya berat benda" },
            { key: "C", text: "Massa benda secara langsung dalam kilogram" },
            { key: "D", text: "Volume benda" }
        ],
        answer: "B",
        explanation: "Neraca pegas mengukur tarikan gaya dalam satuan Newton (N). Pada benda yang digantung bebas, gaya tarik yang diukur adalah gaya berat (w) benda."
    },
    {
        id: 6,
        question: "Dalam simulasi OLabs, pembacaan neraca pegas menunjukkan 2,4 N. Jika percepatan gravitasi dianggap 10 N/kg (m/s²), perkiraan massa benda tersebut adalah ....",
        options: [
            { key: "A", text: "0,24 kg" },
            { key: "B", text: "2,4 kg" },
            { key: "C", text: "12,4 kg" },
            { key: "D", text: "24 kg" }
        ],
        answer: "A",
        explanation: "Rumus berat w = m × g, sehingga massa m = w / g. m = 2,4 N / 10 N/kg = 0,24 kg (atau 240 gram)."
    },
    {
        id: 7,
        question: "Kelompok siswa ingin mengukur waktu yang diperlukan bandul untuk melakukan 10 ayunan. Cara yang tepat adalah ....",
        options: [
            { key: "A", text: "Menggunakan jangka sorong untuk membaca lama ayunan" },
            { key: "B", text: "Menggunakan neraca pegas untuk mengukur waktu" },
            { key: "C", text: "Menggunakan stopwatch atau fitur pengukuran waktu pada simulasi PhET Pendulum Lab" },
            { key: "D", text: "Memperkirakan waktu tanpa alat atau simulasi" }
        ],
        answer: "C",
        explanation: "Alat ukur besaran pokok waktu adalah stopwatch atau fitur timer terintegrasi pada simulasi PhET Pendulum Lab."
    },
    {
        id: 8,
        question: "Dalam PhET Pendulum Lab, waktu untuk 10 ayunan penuh tercatat 14,2 sekon. Periode (T) satu ayunan bandul tersebut adalah ....",
        options: [
            { key: "A", text: "0,71 sekon" },
            { key: "B", text: "1,42 sekon" },
            { key: "C", text: "14,2 sekon" },
            { key: "D", text: "142 sekon" }
        ],
        answer: "B",
        explanation: "Periode (T) adalah waktu untuk melakukan 1 kali ayunan penuh: T = waktu total (t) / jumlah ayunan (n) = 14,2 s / 10 = 1,42 sekon."
    },
    {
        id: 9,
        question: "Volume air di dalam gelas ukur mula-mula 40 mL. Setelah sebuah batu dimasukkan seluruhnya, volume air terbaca menjadi 57 mL. Jika tidak ada air yang tumpah, volume batu adalah ....",
        options: [
            { key: "A", text: "17 mL" },
            { key: "B", text: "40 mL" },
            { key: "C", text: "57 mL" },
            { key: "D", text: "97 mL" }
        ],
        answer: "A",
        explanation: "Volume batu tak beraturan dihitung dengan metode selisih volume air: V_batu = V_akhir - V_awal = 57 mL - 40 mL = 17 mL (atau 17 cm³)."
    },
    {
        id: 10,
        question: "Pernyataan Benar atau Salah: Saat hasil pengukuran dari jangka sorong OLabs, neraca pegas OLabs, atau stopwatch/PhET tidak sesuai dengan perkiraan, siswa boleh mengubah angka pada tabel agar hasilnya sesuai dengan perkiraan.",
        options: [
            { key: "A", text: "Benar" },
            { key: "B", text: "Salah" }
        ],
        answer: "B",
        explanation: "SALAH. Sikap ilmiah yang benar adalah menjunjung tinggi kejujuran data. Hasil pengukuran harus dicatat apa adanya sesuai pembacaan alat, bukan dimanipulasi agar sesuai perkiraan awal."
    }
];

class QuizManager {
    constructor() {
        this.questions = [];
        this.currentIndex = 0;
        this.answers = {};
        this.timer = 0;
        this.timerInterval = null;
        this.isFinished = false;
    }

    randomizeQuestions() {
        // Deep copy from master data and randomize options & questions
        const shuffled = QUIZ_DATA.map(q => {
            // Find text of original correct answer
            const origCorrectOpt = q.options.find(o => o.key === q.answer);
            const correctText = origCorrectOpt ? origCorrectOpt.text : "";

            // Shuffle options
            const optionsCopy = q.options.map(o => ({ text: o.text }));
            for (let i = optionsCopy.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [optionsCopy[i], optionsCopy[j]] = [optionsCopy[j], optionsCopy[i]];
            }

            // Assign keys A, B, C, D and locate new correct key
            const keys = ["A", "B", "C", "D"];
            let newCorrectKey = "A";
            const newOptions = optionsCopy.map((opt, idx) => {
                const key = keys[idx] || String.fromCharCode(65 + idx);
                if (opt.text === correctText) {
                    newCorrectKey = key;
                }
                return { key: key, text: opt.text };
            });

            return {
                id: q.id,
                question: q.question,
                options: newOptions,
                answer: newCorrectKey,
                explanation: q.explanation
            };
        });

        // Fisher-Yates shuffle for questions order
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        this.questions = shuffled;
    }

    start() {
        this.randomizeQuestions();
        this.currentIndex = 0;
        this.answers = {};
        this.isFinished = false;
        this.timer = 0;
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimerDisplay();
        }, 1000);
        this.renderQuestion();
        this.renderPagination();
    }

    updateTimerDisplay() {
        const el = document.getElementById("quiz-timer-text");
        if (el) {
            const m = Math.floor(this.timer / 60).toString().padStart(2, "0");
            const s = (this.timer % 60).toString().padStart(2, "0");
            el.textContent = `${m}:${s}`;
        }
    }

    renderQuestion() {
        const container = document.getElementById("quiz-question-box");
        if (!container || !this.questions.length) return;

        const q = this.questions[this.currentIndex];
        const selected = this.answers[this.currentIndex];
        const isAnswered = selected !== undefined;
        const isCorrect = isAnswered && (selected === q.answer);

        let html = `
            <div class="quiz-q-header">
                <span class="q-badge">Soal ${this.currentIndex + 1} dari ${this.questions.length}</span>
                <span class="q-type-badge">HOTS • IPA Kelas VII (Acak)</span>
            </div>
            <div class="quiz-q-text">${q.question}</div>
            <div class="quiz-options-list">
        `;

        q.options.forEach(opt => {
            const isThisSelected = (selected === opt.key);
            const isThisCorrectKey = (opt.key === q.answer);

            let cardClass = "quiz-option-card";
            let statusTag = "";
            let keyIcon = opt.key;

            if (isAnswered) {
                cardClass += " answered-locked";
                if (isThisSelected) {
                    if (isCorrect) {
                        cardClass += " is-opt-correct";
                        keyIcon = "✓";
                        statusTag = `<span class="opt-feedback-tag tag-correct">✅ Benar (+10)</span>`;
                    } else {
                        cardClass += " is-opt-wrong";
                        keyIcon = "✕";
                        statusTag = `<span class="opt-feedback-tag tag-wrong">❌ Jawabanmu</span>`;
                    }
                } else if (isThisCorrectKey && !isCorrect) {
                    cardClass += " is-opt-key-reveal";
                    keyIcon = "✓";
                    statusTag = `<span class="opt-feedback-tag tag-key">✨ Kunci Benar</span>`;
                } else {
                    cardClass += " is-opt-dimmed";
                }
            }

            const clickAttr = isAnswered ? "" : `onclick="quizManager.selectAnswer('${opt.key}')"`;

            html += `
                <div class="${cardClass}" ${clickAttr}>
                    <div class="opt-key-circle">${keyIcon}</div>
                    <div class="opt-label">${opt.text}</div>
                    ${statusTag}
                </div>
            `;
        });

        html += `</div>`;

        // Direct Instant Feedback Card below options
        if (isAnswered) {
            if (isCorrect) {
                html += `
                    <div class="instant-feedback-card feedback-correct animate-pop">
                        <div class="feedback-badge-icon">🎉</div>
                        <div class="feedback-content">
                            <div class="feedback-title">LUAR BIASA! JAWABAN KAMU BENAR (+10 SKOR)</div>
                            <div class="feedback-desc">Pilihan <strong>[${selected}]</strong> adalah jawaban yang tepat! Klik tombol <strong>Berikutnya ➔</strong> di bawah untuk lanjut ke soal berikutnya.</div>
                        </div>
                    </div>
                `;
            } else {
                html += `
                    <div class="instant-feedback-card feedback-wrong animate-shake">
                        <div class="feedback-badge-icon">❌</div>
                        <div class="feedback-content">
                            <div class="feedback-title">YAH, JAWABAN KAMU KURANG TEPAT! (0 SKOR)</div>
                            <div class="feedback-desc">Kamu memilih <strong>[${selected}]</strong>. Kunci jawaban yang tepat adalah <strong>[${q.answer}]</strong>. Pembahasan lengkap dapat dipelajari di akhir kuis.</div>
                        </div>
                    </div>
                `;
            }
        } else {
            html += `
                <div class="instant-feedback-card feedback-waiting" id="quiz-unanswered-alert">
                    <div class="feedback-badge-icon">💡</div>
                    <div class="feedback-content">
                        <div class="feedback-desc">Pilih salah satu opsi (A, B, C, atau D) di atas untuk langsung melihat apakah jawabanmu benar atau salah.</div>
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;

        // Nav buttons
        const prevBtn = document.getElementById("quiz-prev-btn");
        const nextBtn = document.getElementById("quiz-next-btn");
        const finishBtn = document.getElementById("quiz-finish-btn");

        if (prevBtn) {
            prevBtn.disabled = this.currentIndex === 0;
            if (this.currentIndex === 0) {
                prevBtn.classList.add("disabled");
            } else {
                prevBtn.classList.remove("disabled");
            }
        }

        if (nextBtn) {
            if (this.currentIndex === this.questions.length - 1) {
                nextBtn.style.display = "none";
                if (finishBtn) {
                    finishBtn.style.display = "inline-flex";
                    if (isAnswered) {
                        finishBtn.classList.add("pulse-scale");
                    } else {
                        finishBtn.classList.remove("pulse-scale");
                    }
                }
            } else {
                nextBtn.style.display = "inline-flex";
                if (finishBtn) finishBtn.style.display = "none";
                if (isAnswered) {
                    nextBtn.classList.add("pulse-scale", "btn-ready");
                } else {
                    nextBtn.classList.remove("pulse-scale", "btn-ready");
                }
            }
        }

        this.renderPagination();
    }

    selectAnswer(key) {
        if (this.isFinished) return;
        if (this.answers[this.currentIndex] !== undefined) return; // Locked once answered!

        const q = this.questions[this.currentIndex];
        this.answers[this.currentIndex] = key;

        if (key === q.answer) {
            window.sound.playSuccess();
        } else {
            window.sound.playError();
        }

        this.renderQuestion();
    }

    next() {
        if (this.answers[this.currentIndex] === undefined) {
            window.sound.playError();
            const alertBox = document.getElementById("quiz-unanswered-alert");
            if (alertBox) {
                alertBox.classList.remove("animate-shake");
                void alertBox.offsetWidth; // trigger reflow
                alertBox.classList.add("animate-shake");
                alertBox.innerHTML = `
                    <div class="feedback-badge-icon">⚠️</div>
                    <div class="feedback-content">
                        <div class="feedback-title" style="color: #b91c1c; font-weight: 800;">PILIH JAWABAN TERLEBIH DAHULU!</div>
                        <div class="feedback-desc" style="color: #991b1b; font-weight: 700;">Silakan klik salah satu opsi (A, B, C, atau D) untuk mengetahui hasilnya sebelum lanjut.</div>
                    </div>
                `;
            }
            return;
        }

        if (this.currentIndex < this.questions.length - 1) {
            window.sound.playClick();
            this.currentIndex++;
            this.renderQuestion();
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            window.sound.playClick();
            this.currentIndex--;
            this.renderQuestion();
        }
    }

    goTo(index) {
        if (index >= 0 && index < this.questions.length) {
            window.sound.playClick();
            this.currentIndex = index;
            this.renderQuestion();
        }
    }

    renderPagination() {
        const pag = document.getElementById("quiz-pagination");
        if (!pag) return;
        let html = "";
        this.questions.forEach((q, idx) => {
            const userAns = this.answers[idx];
            const isAnswered = userAns !== undefined;
            const isCurrent = idx === this.currentIndex;

            let cls = "pag-btn";
            if (isCurrent) cls += " active";
            if (isAnswered) {
                if (userAns === q.answer) {
                    cls += " pag-correct";
                } else {
                    cls += " pag-wrong";
                }
            }

            let icon = `${idx + 1}`;
            if (isAnswered) {
                icon = userAns === q.answer ? `✓ ${idx + 1}` : `✕ ${idx + 1}`;
            }

            html += `
                <button class="${cls}" onclick="quizManager.goTo(${idx})" title="Soal ${idx + 1}">
                    ${icon}
                </button>
            `;
        });
        pag.innerHTML = html;
    }

    restart() {
        window.sound.playClick();
        const screenActive = document.getElementById("quiz-playing-state");
        const screenResult = document.getElementById("quiz-result-state");
        if (screenActive) screenActive.style.display = "block";
        if (screenResult) screenResult.style.display = "none";
        this.start();
    }

    finish() {
        if (this.answers[this.currentIndex] === undefined) {
            this.next();
            return;
        }

        const answeredCount = Object.keys(this.answers).length;
        if (answeredCount < this.questions.length) {
            const conf = confirm(`Kamu baru menjawab ${answeredCount} dari ${this.questions.length} soal. Yakin ingin mengakhiri kuis sekarang?`);
            if (!conf) return;
        }

        clearInterval(this.timerInterval);
        this.isFinished = true;

        let correctCount = 0;
        this.questions.forEach((q, idx) => {
            if (this.answers[idx] === q.answer) {
                correctCount++;
            }
        });

        const score = Math.round((correctCount / this.questions.length) * 100);
        window.sound.playFanfare();

        this.showResults(score, correctCount);
    }

    showResults(score, correctCount) {
        const screenActive = document.getElementById("quiz-playing-state");
        const screenResult = document.getElementById("quiz-result-state");
        if (screenActive) screenActive.style.display = "none";
        if (screenResult) screenResult.style.display = "block";

        const scoreEl = document.getElementById("quiz-score-num");
        const badgeEl = document.getElementById("quiz-grade-badge");
        const starsEl = document.getElementById("quiz-stars");
        const correctEl = document.getElementById("quiz-correct-count");
        const wrongEl = document.getElementById("quiz-wrong-count");
        const timeEl = document.getElementById("quiz-time-spent");

        if (scoreEl) scoreEl.textContent = score;
        if (correctEl) correctEl.textContent = `${correctCount} Soal`;
        if (wrongEl) wrongEl.textContent = `${this.questions.length - correctCount} Soal`;

        const m = Math.floor(this.timer / 60);
        const s = this.timer % 60;
        if (timeEl) timeEl.textContent = `${m}m ${s}s`;

        let grade = "Cukup";
        let stars = "⭐";
        if (score >= 90) {
            grade = "Sangat Baik (Istimewa!) 🎉";
            stars = "⭐⭐⭐⭐⭐";
        } else if (score >= 80) {
            grade = "Baik Sekali (Hebat!) 🌟";
            stars = "⭐⭐⭐⭐";
        } else if (score >= 70) {
            grade = "Tuntas KKM 👍";
            stars = "⭐⭐⭐";
        } else {
            grade = "Perlu Belajar Lagi 💪";
            stars = "⭐⭐";
        }

        if (badgeEl) badgeEl.textContent = grade;
        if (starsEl) starsEl.textContent = stars;

        // Save to user storage
        const student = window.appState ? window.appState.getStudent() : {};
        const historyItem = {
            date: new Date().toLocaleDateString("id-ID"),
            score: score,
            correct: correctCount,
            total: this.questions.length,
            time: `${m}:${s.toString().padStart(2, "0")}`
        };
        const prevScores = JSON.parse(localStorage.getItem("lab_quiz_history") || "[]");
        prevScores.push(historyItem);
        localStorage.setItem("lab_quiz_history", JSON.stringify(prevScores));

        // Render Discussion Review
        this.renderReview();

        // Trigger confetti
        if (typeof launchConfetti === "function") {
            launchConfetti();
        }
    }

    renderReview() {
        const container = document.getElementById("quiz-review-list");
        if (!container) return;

        let html = "";
        this.questions.forEach((q, idx) => {
            const userAns = this.answers[idx];
            const isCorrect = userAns === q.answer;
            const userChoiceText = q.options.find(o => o.key === userAns)?.text || "(Tidak Dijawab)";
            const correctChoiceText = q.options.find(o => o.key === q.answer)?.text || "";

            html += `
                <div class="review-card ${isCorrect ? 'is-correct' : 'is-wrong'}">
                    <div class="review-head">
                        <span class="rev-no">Soal No. ${idx + 1}</span>
                        <span class="rev-status ${isCorrect ? 'status-correct' : 'status-wrong'}">
                            ${isCorrect ? '✅ Jawaban Benar (+10 Skor)' : '❌ Jawaban Salah (0 Skor)'}
                        </span>
                    </div>
                    <div class="rev-q">${q.question}</div>
                    <div class="rev-ans-row">
                        <div class="ans-badge-item ${isCorrect ? 'ans-user-correct' : 'ans-user-wrong'}">
                            <span class="ans-label">Jawaban Kamu:</span>
                            <span class="ans-val"><strong>${userAns ? userAns : '-'}</strong> — ${userChoiceText}</span>
                        </div>
                        <div class="ans-badge-item ans-key-item">
                            <span class="ans-label">Kunci Jawaban:</span>
                            <span class="ans-val"><strong>${q.answer}</strong> — ${correctChoiceText}</span>
                        </div>
                    </div>
                    <div class="rev-expl">
                        <div class="expl-title">💡 Pembahasan Ilmiah:</div>
                        <div class="expl-body">${q.explanation}</div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    generateCertificate() {
        window.sound.playClick();
        const student = window.appState ? window.appState.getStudent() : { name: "Peserta Didik", className: "VII" };
        const score = parseInt(document.getElementById("quiz-score-num")?.textContent || "100", 10);
        
        // Show certificate modal
        const certModal = document.getElementById("certificate-modal");
        if (!certModal) return;

        const certName = document.getElementById("cert-student-name");
        const certClass = document.getElementById("cert-student-class");
        const certSchool = document.getElementById("cert-student-school");
        const certScore = document.getElementById("cert-student-score");
        const certDate = document.getElementById("cert-date");
        const certPred = document.querySelector(".cert-score-lbl");

        if (certName) certName.textContent = student.name || "Nama Siswa";
        if (certClass) certClass.textContent = student.className ? `Kelas: ${student.className}` : "Kelas: VII SMP";
        if (certSchool) certSchool.textContent = student.school || "SMP / MTs";
        if (certScore) certScore.textContent = `${score} / 100`;

        let predikatText = "PREDIKAT: SANGAT BAIK (LULUS)";
        if (score >= 90) predikatText = "PREDIKAT: SANGAT BAIK (ISTIMEWA)";
        else if (score >= 80) predikatText = "PREDIKAT: BAIK SEKALI (LULUS)";
        else if (score >= 70) predikatText = "PREDIKAT: TUNTAS (LULUS KKM)";
        else predikatText = "PREDIKAT: PERLU PENGAYAAN / REMIDIAL";

        if (certPred) certPred.textContent = predikatText;

        if (certDate) {
            const today = new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });
            certDate.textContent = today;
        }

        certModal.classList.add("active");
    }
}

window.quizManager = new QuizManager();

// Confetti particle effect
function launchConfetti() {
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6", "#ef4444"];

    for (let i = 0; i < 120; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 4 + 2,
            speedX: (Math.random() - 0.5) * 3,
            rot: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 5
        });
    }

    let frames = 0;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.rot += p.rotSpeed;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rot * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        });

        frames++;
        if (frames < 200) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    animate();
}
