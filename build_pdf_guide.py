import asyncio
import os
from playwright.async_api import async_playwright
import shutil

HTML_CONTENT = """<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Buku Panduan & Alur Sistem Media Pembelajaran IPA</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Outfit:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Mermaid CDN -->
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>

    <style>
        @page {
            size: A4 portrait;
            margin: 12mm 12mm 14mm 12mm;
            @bottom-right {
                content: "Halaman " counter(page);
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 8pt;
                font-weight: 600;
                color: #64748b;
            }
            @bottom-left {
                content: "Media Pembelajaran Interaktif IPA SMP Kelas VII • Kurikulum Merdeka";
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 8pt;
                color: #64748b;
            }
        }

        *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            color: #1e293b;
            background-color: #ffffff;
            line-height: 1.45;
            font-size: 9pt;
        }

        h1, h2, h3, h4, .font-display {
            font-family: 'Outfit', sans-serif;
            color: #064e3b;
        }

        .page-break {
            page-break-before: always;
        }

        .avoid-break {
            page-break-inside: avoid;
        }

        /* Cover Page */
        .cover-container {
            min-height: 258mm;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 12mm 8mm;
            border: 3.5px solid #059669;
            border-radius: 16px;
            background: linear-gradient(180deg, #ecfdf5 0%, #ffffff 42%, #f0fdf4 100%);
            box-shadow: inset 0 0 0 2px #a7f3d0;
            text-align: center;
        }

        .cover-badge {
            display: inline-block;
            background: #d97706;
            color: #ffffff;
            font-size: 8.5pt;
            font-weight: 800;
            letter-spacing: 1.2px;
            text-transform: uppercase;
            padding: 5px 18px;
            border-radius: 20px;
            margin-bottom: 12px;
            box-shadow: 0 2px 4px rgba(217, 119, 6, 0.3);
        }

        .cover-title {
            font-size: 22pt;
            font-weight: 800;
            color: #064e3b;
            line-height: 1.22;
            margin-bottom: 8px;
        }

        .cover-subtitle {
            font-size: 12.5pt;
            font-weight: 700;
            color: #047857;
            margin-bottom: 14px;
        }

        .cover-desc {
            font-size: 9.5pt;
            color: #475569;
            max-width: 520px;
            margin: 0 auto;
            line-height: 1.55;
            text-align: center;
        }

        .cover-hero-box {
            background: #ffffff;
            border: 2px solid #a7f3d0;
            border-radius: 14px;
            padding: 16px 20px;
            margin: 16px auto;
            max-width: 540px;
            box-shadow: 0 6px 16px rgba(6, 78, 59, 0.08);
        }

        .cover-pills-row {
            display: flex;
            justify-content: center;
            gap: 8px;
            flex-wrap: wrap;
            margin-top: 10px;
        }

        .hero-pill {
            background: #f0fdf4;
            border: 1px solid #86efac;
            color: #166534;
            font-size: 8.5pt;
            font-weight: 700;
            padding: 5px 12px;
            border-radius: 12px;
        }

        .cover-meta {
            border-top: 1px dashed #cbd5e1;
            padding-top: 12px;
        }

        .meta-tag {
            font-size: 8.5pt;
            color: #64748b;
            margin-bottom: 3px;
        }

        .meta-val {
            font-size: 9.5pt;
            font-weight: 700;
            color: #0f172a;
        }

        /* Section Styling */
        .section-header {
            display: flex;
            align-items: center;
            gap: 8px;
            border-bottom: 2px solid #059669;
            padding-bottom: 5px;
            margin-top: 12px;
            margin-bottom: 10px;
        }

        .section-num {
            background: #059669;
            color: #ffffff;
            font-size: 10.5pt;
            font-weight: 800;
            width: 26px;
            height: 26px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .section-title {
            font-size: 12.5pt;
            font-weight: 700;
            color: #064e3b;
        }

        p {
            margin-bottom: 7px;
            text-align: justify;
        }

        /* Callout Box */
        .callout-box {
            background: #f0fdf4;
            border-left: 4px solid #10b981;
            border-radius: 0 8px 8px 0;
            padding: 8px 12px;
            margin: 8px 0 10px;
            font-size: 8.5pt;
            line-height: 1.45;
        }

        .callout-box strong {
            color: #065f46;
        }

        .callout-amber {
            background: #fffbeb;
            border-left-color: #f59e0b;
        }
        .callout-amber strong {
            color: #92400e;
        }

        .callout-blue {
            background: #eff6ff;
            border-left-color: #3b82f6;
        }
        .callout-blue strong {
            color: #1e40af;
        }

        /* Diagram Box */
        .diagram-card {
            background: #ffffff;
            border: 1.5px solid #cbd5e1;
            border-radius: 12px;
            padding: 12px;
            margin: 10px 0 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
            text-align: center;
        }

        .diagram-caption {
            font-size: 8pt;
            font-weight: 700;
            color: #047857;
            margin-top: 6px;
            text-align: center;
        }

        .mermaid {
            display: flex;
            justify-content: center;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            width: 100%;
        }

        .mermaid svg {
            max-width: 100% !important;
            height: auto !important;
        }

        /* Tables */
        table.styled-table {
            width: 100%;
            border-collapse: collapse;
            margin: 8px 0 10px;
            font-size: 8.2pt;
        }

        table.styled-table th {
            background: #047857;
            color: #ffffff;
            font-weight: 700;
            padding: 7px 9px;
            text-align: left;
            border: 1px solid #065f46;
        }

        table.styled-table td {
            padding: 6px 9px;
            border: 1px solid #cbd5e1;
            vertical-align: top;
            line-height: 1.4;
        }

        table.styled-table tr:nth-child(even) {
            background-color: #f8fafc;
        }

        /* Feature Cards Grid */
        .features-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            margin: 8px 0 10px;
        }

        .feat-item {
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 8px 10px;
            background: #ffffff;
        }

        .feat-item.accent-green { border-left: 3px solid #10b981; }
        .feat-item.accent-amber { border-left: 3px solid #f59e0b; }
        .feat-item.accent-blue { border-left: 3px solid #3b82f6; }
        .feat-item.accent-purple { border-left: 3px solid #8b5cf6; }

        .feat-head {
            font-size: 9pt;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 3px;
        }

        .feat-desc {
            font-size: 8pt;
            color: #475569;
            line-height: 1.35;
            margin-bottom: 0;
            text-align: left;
        }

        /* Lists */
        .step-list {
            margin: 6px 0 8px 18px;
            font-size: 8.5pt;
        }

        .step-list li {
            margin-bottom: 4px;
        }

        .step-list li strong {
            color: #064e3b;
        }

        .formula-badge {
            display: inline-block;
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            border-radius: 4px;
            padding: 2px 6px;
            font-family: monospace;
            font-size: 8.2pt;
            font-weight: 700;
            color: #0f172a;
        }
    </style>
</head>
<body>

    <!-- ==================== HALAMAN 1: COVER DOKUMEN RESMI ==================== -->
    <div class="cover-container">
        <div class="cover-header">
            <span class="cover-badge">Dokumen Panduan Sistem & Bahan Ujian Skripsi</span>
            <h1 class="cover-title">LABORATORIUM VIRTUAL IPA:<br>PETUALANGAN PENGUKURAN</h1>
            <h2 class="cover-subtitle">Media Pembelajaran Interaktif SMP Kelas VII Berbasis Kurikulum Merdeka</h2>
            <p class="cover-desc">
                Buku panduan lengkap alur sistem, pohon struktur menu navigasi, sintaks pembelajaran <em>Discovery Learning</em>, tahapan proses perancangan media, dan kisi-kisi tanya-jawab dosen penguji untuk persiapan ujian seminar hasil dan sidang skripsi.
            </p>
        </div>

        <div class="cover-hero-box">
            <h4 style="color:#064e3b; font-size:9.5pt; text-align:center; margin-bottom:6px; font-weight:700;">
                Cakupan Laboratorium Virtual (3 Domain Pengukuran Sains):
            </h4>
            <div class="cover-pills-row">
                <span class="hero-pill">📏 Panjang: Jangka Sorong (OLabs)</span>
                <span class="hero-pill">⚖️ Massa: Neraca Pegas (OLabs)</span>
                <span class="hero-pill">⏱️ Waktu: Bandul & Stopwatch</span>
                <span class="hero-pill">🎬 3 Video Panduan Praktikum Mandiri</span>
                <span class="hero-pill">🎯 Kuis HOTS Acak & Sertifikat Resmi</span>
                <span class="hero-pill">📱 Progressive Web App (PWA Offline)</span>
            </div>
        </div>

        <div class="cover-meta">
            <div class="meta-tag">Standar Acuan Kurikulum & Platform:</div>
            <div class="meta-val">Online Labs (OLabs) • Kurikulum Merdeka Fase D • Model Discovery Learning</div>
            <div style="font-size:8pt; color:#64748b; margin-top:6px;">
                Tahun Akademik 2026/2027 • Akses Web Resmi: <strong>projects-01.samrifa.com</strong>
            </div>
        </div>
    </div>

    <!-- ==================== HALAMAN 2: ARSITEKTUR CARA KERJA SISTEM ==================== -->
    <div class="page-break"></div>

    <div class="section-header">
        <span class="section-num">1</span>
        <h2 class="section-title">Latar Belakang & Cara Kerja Sistem (Arsitektur Akses)</h2>
    </div>

    <div class="callout-box">
        <strong>Urgensi Inovasi:</strong> Media ini dikembangkan untuk mengatasi 3 kendala utama di sekolah:
        (1) Keterbatasan jumlah alat ukur riil per kelas, (2) Risiko kerusakan/keausan alat ukur presisi tinggi, dan 
        (3) Kesulitan siswa memvisualisasikan pembacaan skala nonius <em>(vernier scale)</em> dan koreksi titik nol <em>(zero error)</em>.
    </div>

    <h3 style="font-size:10.5pt; margin-top:8px; margin-bottom:4px; color:#064e3b;">A. Bagaimana Media Ini Diakses & Berjalan di HP Siswa?</h3>
    <p>
        Sistem menggunakan arsitektur <strong>Client-Side Lightweight Progressive Web App (PWA)</strong>. Aplikasi di-hosting pada server cPanel berbasis web hosting statis, dan dapat diinstal ke layar utama HP siswa tanpa harus melalui Google Play Store.
    </p>

    <!-- Diagram Mermaid 1: Arsitektur Sistem Vertikal Portrait -->
    <div class="diagram-card avoid-break">
        <div class="mermaid">
flowchart TD
    subgraph S1["1. Cloud & Server Hosting"]
        Git["Repository GitHub (Branch: main)"] -->|Deploy Otomatis / Git Pull| Host["Web Hosting cPanel (projects-01.samrifa.com)"]
    end
    subgraph S2["2. Akses & Penyimpanan di HP Siswa"]
        Host -->|Akses Sekali Lewat Browser Chrome/Safari| Net["Smartphone / Tablet Siswa"]
        Net -->|Tambahkan ke Beranda| PWA["Instal PWA ke Layar Utama (manifest.json)"]
        Net -->|Unduh Aset Lokal| SW["Offline Cache Engine (sw.js v5)"]
    end
    subgraph S3["3. Eksekusi Mandiri di Perangkat Siswa"]
        SW --> Engine["Client-Side Engine (HTML5 + CSS3 + Vanilla ES6)"]
        Engine --> Canvas["Canvas 2D Simulator (Render 60 FPS Tanpa Kuota)"]
        Engine --> LocalDB["LocalStorage (Simpan Identitas & Riwayat Kuis)"]
        Engine --> PrintCSS["Print CSS Engine (Isolasi Cetak Sertifikat)"]
    end
    S1 --> S2 --> S3
        </div>
        <div class="diagram-caption">Gambar 1: Alur Arsitektur Sistem dari Server Hosting hingga Eksekusi Mandiri di HP Siswa (Mode Portrait)</div>
    </div>

    <h3 style="font-size:10.5pt; margin-top:10px; margin-bottom:4px; color:#064e3b;">B. Penjelasan Arsitektur untuk Dosen Penguji:</h3>
    <ul class="step-list">
        <li><strong>Kecepatan Akses Tinggi (&lt; 1 Detik):</strong> Karena dibangun dengan Vanilla HTML5/CSS3/JavaScript murni tanpa framework berat, seluruh berkas aplikasi hanya berukuran ~2 MB sehingga sangat instan dibuka.</li>
        <li><strong>Dukungan Offline-First:</strong> Menggunakan <em>Service Worker (`sw.js`)</em> versi `lab-pengukuran-v5`. Sekali dibuka oleh siswa, aset tersimpan di memori cache HP dan tetap bisa dijalankan meski koneksi internet terputus.</li>
        <li><strong>Simulasi Canvas 2D Responsif:</strong> Jangka sorong, neraca pegas, dan bandul diproses secara langsung oleh GPU browser HP siswa (*client-side*), menghasilkan pergerakan rahang dan ayunan yang halus (60 FPS) tanpa menyedot kuota internet.</li>
    </ul>

    <!-- ==================== HALAMAN 3: STRUKTUR MENU LENGKAP & DIAGRAM NAVIGASI ==================== -->
    <div class="page-break"></div>

    <div class="section-header">
        <span class="section-num">2</span>
        <h2 class="section-title">Pohon Hierarki Menu & Diagram Navigasi Lengkap</h2>
    </div>

    <p>
        Aplikasi menggunakan navigasi <em>Single Page Application (SPA)</em> yang gamified. Siswa masuk dari cover pembuka bebas scroll, mengisi formulir data diri, lalu masuk ke Dashboard Utama yang memuat 6 menu misi belajar terstruktur.
    </p>

    <!-- Diagram Mermaid 2: Struktur Menu Vertikal Lengkap dengan 3 Anak Video -->
    <div class="diagram-card avoid-break">
        <div class="mermaid">
flowchart TD
    Cover["🌟 Halaman Cover Pembuka (Zero-Scroll 100dvh)"] --> ModalID["📝 Modal Identitas Siswa (Nama, Kelas, No. Absen, Sekolah)"]
    ModalID --> Dash["🏠 Dashboard Petualangan (Menu Utama)"]

    subgraph Kelompok_Praktikum["🔬 KELOMPOK PRAKTIKUM & VIDEO EKSPERIMEN"]
        M2["🔬 Menu 2: Lab Virtual Utama"]
        M2 --> M2_A["📏 Tab 1: Jangka Sorong OLabs (Slider SU/SN & Uji Cek)"]
        M2 --> M2_B["⚖️ Tab 2: Neraca Pegas OLabs (Hukum Hooke & 4 Gravitasi)"]
        M2 --> M2_C["⏱️ Tab 3: Bandul OLabs (Variasi Tali & Timer 10 Ayunan)"]
        M2 --> M2_D["📋 Tab 4: LKPD Digital (Rekam Otomatis & Cetak PDF)"]

        M4["🎬 Menu 4: Video Praktikum (3 Domain)"]
        M4 --> M4_A["🎥 Video 1: Pengukuran Panjang (Jangka Sorong OLabs)"]
        M4 --> M4_B["🎥 Video 2: Pengukuran Massa (Neraca Pegas OLabs)"]
        M4 --> M4_C["🎥 Video 3: Pengukuran Waktu (Bandul & Stopwatch OLabs)"]
    end

    subgraph Kelompok_Materi["📚 KELOMPOK MATERI, EVALUASI & MODUL"]
        M1["📚 Menu 1: Bahan Ajar Interaktif (16 Slide Pokok & Satuan)"]
        
        M3["🎯 Menu 3: Kuis HOTS & Evaluasi"]
        M3 --> M3_A["🎲 Pengacakan Urutan Soal & Opsi Jawaban (A-B-C-D)"]
        M3 --> M3_B["💡 Ulasan Pembahasan Kunci Jawaban Ilmiah"]
        M3 --> M3_C["📜 Cetak Sertifikat Kelulusan Resmi Siswa"]

        M5["📖 Menu 5: Panduan Alat (Viewer Jangka Sorong, Neraca, Bandul)"]
        M6["📄 Menu 6: Modul Ajar (Viewer 11 Halaman Kurikulum Merdeka)"]
    end

    Dash --> Kelompok_Praktikum
    Dash --> Kelompok_Materi
        </div>
        <div class="diagram-caption">Gambar 2: Diagram Pohon Struktur Menu Lengkap dengan Rincian Sub-Menu Video Praktikum & Fitur Terkait</div>
    </div>

    <h3 style="font-size:10.5pt; margin-top:8px; margin-bottom:4px; color:#064e3b;">Rincian 6 Menu Utama Aplikasi:</h3>
    <div class="features-grid">
        <div class="feat-item accent-green">
            <div class="feat-head">📚 1. Bahan Ajar Interaktif</div>
            <p class="feat-desc">16 slide materi besaran pokok, satuan internasional (SI), dimensi, dan pengenalan alat ukur dengan navigasi thumbnail & kontrol keyboard.</p>
        </div>
        <div class="feat-item accent-green">
            <div class="feat-head">🔬 2. Lab Virtual (4 Tab Utama)</div>
            <p class="feat-desc">Simulasi geser jangka sorong, timbang pegas, ayunan bandul matematis, dan tabel LKPD digital otomatis yang dapat langsung dicetak ke PDF.</p>
        </div>
        <div class="feat-item accent-amber">
            <div class="feat-head">🎯 3. Kuis HOTS (Acak Dinamis)</div>
            <p class="feat-desc">10 soal penalaran yang diacak nomor dan opsi jawabannya (A/B/C/D), timer, ulasan pembahasan ilmiah, dan penerbitan sertifikat kelulusan.</p>
        </div>
        <div class="feat-item accent-amber">
            <div class="feat-head">🎬 4. Video Praktikum (3 Tab Chip)</div>
            <p class="feat-desc">Video panduan pemutar lokal HD MP4 bebas iklan per domain (Panjang, Massa, Waktu) dilengkapi ringkasan rumus pembacaan skala.</p>
        </div>
        <div class="feat-item accent-blue">
            <div class="feat-head">📖 5. Panduan Alat (User Guide)</div>
            <p class="feat-desc">Buku petunjuk operasional bergambar standar OLabs dilengkapi kontrol perbesaran <em>(Zoom In/Out/Reset)</em> dan unduh naskah PDF asli.</p>
        </div>
        <div class="feat-item accent-purple">
            <div class="feat-head">📄 6. Modul Ajar Kurikulum</div>
            <p class="feat-desc">Dokumen resmi modul ajar 11 halaman Fase D Kurikulum Merdeka memuat Capaian Pembelajaran (CP), TP, dan rubrik penilaian.</p>
        </div>
    </div>

    <!-- ==================== HALAMAN 4: MODEL DISCOVERY LEARNING & MEKANISME LAB ==================== -->
    <div class="page-break"></div>

    <div class="section-header">
        <span class="section-num">3</span>
        <h2 class="section-title">Model Discovery Learning & Mekanisme 3 Lab Virtual</h2>
    </div>

    <p>
        Media pembelajaran ini mengadopsi 6 tahapan sintaks <strong>Discovery Learning</strong> (Kurikulum Merdeka) agar siswa aktif membangun pengetahuannya sendiri secara terstruktur:
    </p>

    <!-- Diagram Mermaid 3: Sintaks Discovery Learning -->
    <div class="diagram-card avoid-break">
        <div class="mermaid">
flowchart TD
    F1["Fase 1: Stimulation (Stimulasi)"] --> O1["Siswa mengamati Video Praktikum & Slide Bahan Ajar (Pengenalan Fenomena Nyata)"]
    F2["Fase 2: Problem Statement (Identifikasi)"] --> O2["Siswa merumuskan cara menentukan SU, SN, gaya berat, dan periode melalui User Guide"]
    F3["Fase 3: Data Collection (Pengumpulan Data)"] --> O3["Siswa melakukan eksperimen mandiri di Lab Virtual: geser rahang, gantung beban, ayun bandul"]
    F4["Fase 4: Data Processing (Pengolahan Data)"] --> O4["Sistem merekam data ke tabel LKPD Digital: pembacaan SU+(SN×0,01), w=m.g, dan T=t/n"]
    F5["Fase 5: Verification (Pembuktian)"] --> O5["Siswa menguji hitungan mandiri di Lab dan menyelesaikan 10 Soal Kuis HOTS Acak"]
    F6["Fase 6: Generalization (Menarik Kesimpulan)"] --> O6["Siswa menelaah ulasan pembahasan kunci jawaban dan memperoleh Sertifikat Kelulusan"]
        </div>
        <div class="diagram-caption">Gambar 3: Integrasi 6 Sintaks Model Pembelajaran Discovery Learning ke dalam Fitur Media</div>
    </div>

    <h3 style="font-size:10.5pt; margin-top:8px; margin-bottom:4px; color:#064e3b;">Rincian Fisika & Rumus Mekanisme 3 Laboratorium Virtual (Canvas 2D):</h3>
    
    <table class="styled-table avoid-break">
        <thead>
            <tr>
                <th style="width:23%;">Domain Alat Ukur</th>
                <th style="width:37%;">Mekanisme Kerja & Fitur Fisika</th>
                <th style="width:40%;">Rumus & Integrasi LKPD Digital</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>1. Jangka Sorong (OLabs Panjang)</strong></td>
                <td>
                    - Slider rahang geser interaktif horizontal.<br>
                    - Skala utama (SU) per milimeter & skala nonius (SN) 10 garis berimpit.<br>
                    - Objek ukur bervariasi: Silinder luar, balok kayu, dan bola kelereng.
                </td>
                <td>
                    <span class="formula-badge">Hasil = Skala Utama + (Skala Nonius × 0,01 cm)</span><br>
                    <em>Contoh:</em> 2,3 cm + (4 × 0,01 cm) = <strong>2,34 cm</strong>.<br>
                    Siswa dapat menguji tebakan di kotak verifikasi, lalu klik tombol <em>Kirim ke LKPD</em>.
                </td>
            </tr>
            <tr>
                <td><strong>2. Neraca Pegas (OLabs Massa)</strong></td>
                <td>
                    - Simulasi pertambahan panjang pegas (Hukum Hooke: F = k × Δx).<br>
                    - Pilihan 4 percepatan gravitasi planet: Bumi (9,8 N/kg), Bulan (1,6 N/kg), Mars (3,7 N/kg), Jupiter (24,8 N/kg).<br>
                    - Jarum penunjuk gaya berat (w) dalam Newton.
                </td>
                <td>
                    <span class="formula-badge">Gaya Berat: w = m × g</span> &nbsp;|&nbsp; 
                    <span class="formula-badge">Massa: m = w / g</span><br>
                    <em>Konsep Kunci:</em> Gaya berat berubah sesuai gravitasi tempat, sedangkan massa benda selalu konstan. Tersimpan otomatis ke Tabel LKPD 2.
                </td>
            </tr>
            <tr>
                <td><strong>3. Bandul Matematis (OLabs Waktu)</strong></td>
                <td>
                    - Gerak harmonik sederhana 1 ayunan penuh (A-B-C-B-A).<br>
                    - Pengaturan panjang tali (0,3 m - 1,0 m) dan variasi massa bandul.<br>
                    - Stopwatch digital pendeteksi 10 ayunan otomatis.
                </td>
                <td>
                    <span class="formula-badge">Periode Eksperimen: T = t / n</span><br>
                    <span class="formula-badge">Periode Teoretis: T = 2 × π × √(L / g)</span><br>
                    <em>Pembuktian Ilmiah:</em> Periode ayunan <strong>hanya bergantung pada panjang tali</strong>, dan <strong>tidak dipengaruhi massa beban</strong>!
                </td>
            </tr>
        </tbody>
    </table>

    <!-- ==================== HALAMAN 5: PROSES PEMBUATAN & KISI-KISI TANYA JAWAB DOSEN ==================== -->
    <div class="page-break"></div>

    <div class="section-header">
        <span class="section-num">4</span>
        <h2 class="section-title">Proses Pembuatan Media & Panduan Menjawab Ujian Dosen</h2>
    </div>

    <h3 style="font-size:10.5pt; margin-bottom:4px; color:#064e3b;">A. Tahapan Proses Pembuatan Media (Model Pengembangan ADDIE):</h3>
    <ul class="step-list">
        <li><strong>1. Analisis (Analysis):</strong> Menelaah Kurikulum Merdeka Fase D (IPA Kelas VII), mengidentifikasi kendala minimnya alat praktikum jangka sorong & neraca di sekolah, serta menganalisis kebutuhan media interaktif yang ramah smartphone.</li>
        <li><strong>2. Perancangan (Design):</strong> Menyusun storyboard visual eksplorasi petualangan bertema alam/hutan, menyusun struktur 6 menu utama, dan merancang formula fisika serta rubrik evaluasi kuis HOTS 10 soal.</li>
        <li><strong>3. Pengembangan (Development):</strong> Mengembangkan kode program HTML5, CSS3, dan JavaScript murni. Membangun simulator Canvas 2D untuk 3 alat ukur, menerapkan algoritma pengacakan soal Fisher-Yates, dan menyusun Service Worker PWA (`sw.js`).</li>
        <li><strong>4. Penerapan (Implementation):</strong> Menerapkan repositori GitHub (`main`) dan mengintegrasikannya ke server web hosting cPanel pada domain <em>projects-01.samrifa.com</em>.</li>
        <li><strong>5. Evaluasi & Validasi (Evaluation):</strong> Menguji responsivitas antarmuka pada berbagai ukuran layar ponsel (zero-scroll cover), memvalidasi kesesuaian materi dengan standar OLabs, dan mengisolasi cetak sertifikat kelulusan.</li>
    </ul>

    <h3 style="font-size:10.5pt; margin-top:10px; margin-bottom:4px; color:#064e3b;">B. Tabel Kisi-Kisi Tanya Jawab Ujian Dosen (Cheat Sheet):</h3>
    <p style="font-size:8pt; color:#64748b; margin-bottom:6px;">
        <em>Hafalkan poin-poin jawaban di bawah ini agar lancar dan percaya diri saat menghadapi dosen pembimbing maupun penguji:</em>
    </p>

    <table class="styled-table avoid-break">
        <thead>
            <tr>
                <th style="width:28%;">Pertanyaan Dosen</th>
                <th style="width:72%;">Rekomendasi Jawaban Mahasiswa yang Tepat & Ilmiah</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>1. Kenapa memilih topik Pengukuran di Kelas VII?</strong></td>
                <td>"Materi Pengukuran adalah fondasi awal literasi sains dalam Kurikulum Merdeka Fase D. Keterampilan membaca alat ukur dan data numerik sangat menentukan keberhasilan siswa dalam bab-bab IPA selanjutnya."</td>
            </tr>
            <tr>
                <td><strong>2. Bagaimana sistem mengacak kuis agar siswa tidak menyontek?</strong></td>
                <td>"Sistem menerapkan algoritma <em>Fisher-Yates Shuffle</em> yang mengacak urutan nomor soal sekaligus posisi opsi jawaban (A, B, C, D). Misalnya pada percobaan pertama soal jangka sorong ada di nomor 1 dengan kunci C, saat diulang soal tersebut bisa pindah ke nomor 4 dengan kunci yang berubah menjadi A, namun sistem tetap mencocokkan teks jawaban yang benar secara presisi."</td>
            </tr>
            <tr>
                <td><strong>3. Apa kelebihan media ini dibanding video YouTube biasa?</strong></td>
                <td>"Video YouTube bersifat pasif/satu arah. Media ini memberikan pengalaman <em>hands-on virtual</em> interaktif: siswa sendiri yang menggeser rahang jangka sorong, menggantung beban di berbagai gravitasi, mengayunkan bandul dengan stopwatch, serta data tercatat otomatis ke LKPD digital."</td>
            </tr>
            <tr>
                <td><strong>4. Kenapa menggunakan simulator internal Canvas bukan cuma iframe link luar?</strong></td>
                <td>"Iframe web luar rentan terkendala blokir keamanan (*X-Frame-Options*), kuota habis, atau server luar lemot. Simulator internal Canvas 2D berjalan 100% lancar, responsif di HP tanpa kuota, dan datanya terhubung langsung ke tabel LKPD digital."</td>
            </tr>
            <tr>
                <td><strong>5. Bagaimana cara aplikasi ini bisa diakses offline tanpa download Play Store?</strong></td>
                <td>"Menggunakan teknologi <em>Progressive Web App (PWA)</em> dengan Service Worker (`sw.js`). Siswa cukup membuka tautan sekali di browser HP, lalu klik 'Tambahkan ke Layar Utama'. Semua aset tersimpan di memori cache lokal smartphone."</td>
            </tr>
            <tr>
                <td><strong>6. Kenapa soal kuisnya disebut berlevel HOTS?</strong></td>
                <td>"Soal kuis tidak sekadar hafalan teori (C1–C2), melainkan menyajikan stimulus visual: menganalisis rahang jangka sorong, grafik gaya pegas terhadap variasi gravitasi planet, dan menganalisis mengapa massa tidak mengubah periode bandul (level C4 Analisis s.d. C6 Kreasi)."</td>
            </tr>
        </tbody>
    </table>

    <div class="callout-box callout-amber" style="margin-top:10px;">
        <strong>Pernyataan Penutup Mahasiswa:</strong> 
        "Media pembelajaran ini telah divalidasi responsivitasnya pada mode mobile maupun desktop, memenuhi kelayakan pedagogis Kurikulum Merdeka melalui 6 sintaks Discovery Learning, dan siap digunakan oleh guru dan peserta didik."
    </div>

    <script>
        // Inisialisasi Mermaid dengan layout responsif
        mermaid.initialize({
            startOnLoad: true,
            theme: 'forest',
            themeVariables: {
                primaryColor: '#ecfdf5',
                primaryBorderColor: '#059669',
                primaryTextColor: '#064e3b',
                lineColor: '#047857',
                fontSize: '11px',
                fontFamily: 'Plus Jakarta Sans, sans-serif'
            },
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true,
                curve: 'basis'
            }
        });
    </script>
</body>
</html>
"""

async def generate_pdf():
    html_path = os.path.abspath("panduan_dokumen_lengkap.html")
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(HTML_CONTENT)
    print("HTML written to:", html_path)

    pdf_output_path = os.path.abspath("Buku_Panduan_Lengkap_Media_Pembelajaran_IPA.pdf")
    pdf_alt_path = os.path.abspath("Panduan_Lengkap_Media_Pembelajaran_IPA.pdf")

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        file_url = "file:///" + html_path.replace("\\", "/")
        await page.goto(file_url, wait_until="networkidle")

        print("Waiting for Mermaid SVGs to render...")
        await page.wait_for_selector(".mermaid svg", timeout=20000)
        await page.wait_for_timeout(2000)

        print("Generating PDF...")
        await page.pdf(
            path=pdf_output_path,
            format="A4",
            print_background=True,
            margin={
                "top": "10mm",
                "bottom": "12mm",
                "left": "10mm",
                "right": "10mm"
            }
        )
        print("PDF successfully generated at:", pdf_output_path)

        shutil.copyfile(pdf_output_path, pdf_alt_path)
        print("Alternative copy saved at:", pdf_alt_path)

        size_bytes = os.path.getsize(pdf_output_path)
        print(f"Generated PDF file size: {size_bytes / 1024:.2f} KB")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(generate_pdf())
