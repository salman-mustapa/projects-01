import asyncio
import os
from playwright.async_api import async_playwright

HTML_CONTENT = """<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Buku Panduan & Alur Sistem Media Pembelajaran IPA</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Mermaid CDN -->
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>

    <style>
        @page {
            size: A4 portrait;
            margin: 14mm 14mm 16mm 14mm;
            @bottom-right {
                content: "Halaman " counter(page);
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 8pt;
                color: #64748b;
            }
            @bottom-left {
                content: "Media Pembelajaran Interaktif IPA | Kurikulum Merdeka";
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
            line-height: 1.5;
            font-size: 9.5pt;
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
            min-height: 250mm;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 10mm 5mm;
            border: 3px solid #059669;
            border-radius: 16px;
            background: linear-gradient(180deg, #ecfdf5 0%, #ffffff 40%, #f0fdf4 100%);
            box-shadow: inset 0 0 0 2px #a7f3d0;
        }

        .cover-header {
            text-align: center;
        }

        .cover-badge {
            display: inline-block;
            background: #d97706;
            color: #ffffff;
            font-size: 8.5pt;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            padding: 4px 16px;
            border-radius: 20px;
            margin-bottom: 12px;
        }

        .cover-title {
            font-size: 23pt;
            font-weight: 800;
            color: #064e3b;
            line-height: 1.2;
            margin-bottom: 8px;
        }

        .cover-subtitle {
            font-size: 13pt;
            font-weight: 600;
            color: #047857;
            margin-bottom: 16px;
        }

        .cover-desc {
            font-size: 10pt;
            color: #475569;
            max-width: 500px;
            margin: 0 auto;
            line-height: 1.5;
        }

        .cover-hero-box {
            background: #ffffff;
            border: 2px solid #bbf7d0;
            border-radius: 12px;
            padding: 16px 20px;
            margin: 20px auto;
            max-width: 520px;
            box-shadow: 0 4px 12px rgba(6, 78, 59, 0.08);
        }

        .cover-pills-row {
            display: flex;
            justify-content: center;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 10px;
        }

        .hero-pill {
            background: #f0fdf4;
            border: 1px solid #86efac;
            color: #166534;
            font-size: 8.5pt;
            font-weight: 700;
            padding: 4px 12px;
            border-radius: 12px;
        }

        .cover-meta {
            text-align: center;
            border-top: 1px dashed #cbd5e1;
            padding-top: 14px;
        }

        .meta-tag {
            font-size: 8.5pt;
            color: #64748b;
            margin-bottom: 4px;
        }

        .meta-val {
            font-size: 10pt;
            font-weight: 700;
            color: #0f172a;
        }

        /* Content Styling */
        .section-header {
            display: flex;
            align-items: center;
            gap: 10px;
            border-bottom: 2px solid #059669;
            padding-bottom: 6px;
            margin-top: 18px;
            margin-bottom: 12px;
        }

        .section-num {
            background: #059669;
            color: #ffffff;
            font-size: 11pt;
            font-weight: 800;
            width: 28px;
            height: 28px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .section-title {
            font-size: 13.5pt;
            font-weight: 700;
            color: #064e3b;
        }

        p {
            margin-bottom: 8px;
            text-align: justify;
        }

        /* Callout Box */
        .callout-box {
            background: #f0fdf4;
            border-left: 4px solid #10b981;
            border-radius: 0 8px 8px 0;
            padding: 10px 14px;
            margin: 10px 0 14px;
            font-size: 9pt;
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
            padding: 14px;
            margin: 12px 0 16px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
            text-align: center;
        }

        .diagram-caption {
            font-size: 8.5pt;
            font-weight: 700;
            color: #047857;
            margin-top: 8px;
            text-align: center;
        }

        /* Mermaid Overrides for Crisp Printing */
        .mermaid {
            display: flex;
            justify-content: center;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
        }

        .mermaid svg {
            max-width: 100% !important;
            height: auto !important;
        }

        /* Tables */
        table.styled-table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0 14px;
            font-size: 8.5pt;
        }

        table.styled-table th {
            background: #047857;
            color: #ffffff;
            font-weight: 700;
            padding: 8px 10px;
            text-align: left;
            border: 1px solid #065f46;
        }

        table.styled-table td {
            padding: 7px 10px;
            border: 1px solid #e2e8f0;
            vertical-align: top;
        }

        table.styled-table tr:nth-child(even) {
            background-color: #f8fafc;
        }

        /* Feature Cards Grid */
        .features-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin: 10px 0 14px;
        }

        .feat-item {
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 10px 12px;
            background: #ffffff;
        }

        .feat-item.accent-green {
            border-left: 3px solid #10b981;
        }

        .feat-item.accent-amber {
            border-left: 3px solid #f59e0b;
        }

        .feat-item.accent-blue {
            border-left: 3px solid #3b82f6;
        }

        .feat-item.accent-purple {
            border-left: 3px solid #8b5cf6;
        }

        .feat-head {
            font-size: 9.5pt;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .feat-desc {
            font-size: 8.5pt;
            color: #475569;
            line-height: 1.4;
            margin-bottom: 0;
        }

        /* Step List */
        .step-list {
            margin: 8px 0 12px 18px;
            font-size: 9pt;
        }

        .step-list li {
            margin-bottom: 6px;
        }

        .step-list li strong {
            color: #065f46;
        }
    </style>
</head>
<body>

    <!-- ==================== HALAMAN 1: COVER ==================== -->
    <div class="cover-container">
        <div class="cover-header">
            <span class="cover-badge">Dokumen Akademik & Buku Panduan Sistem</span>
            <h1 class="cover-title">LABORATORIUM VIRTUAL IPA:<br>PETUALANGAN PENGUKURAN</h1>
            <h2 class="cover-subtitle">Media Pembelajaran Interaktif SMP Kelas VII Berbasis Kurikulum Merdeka</h2>
            <p class="cover-desc">
                Panduan komprehensif struktur navigasi, arsitektur sistem, sintaks pembelajaran <em>Discovery Learning</em>, dan mekanisme operasional media pembelajaran virtual lab untuk persiapan ujian skripsi, seminar hasil, dan presentasi dosen penguji.
            </p>
        </div>

        <div class="cover-hero-box">
            <h4 style="color:#064e3b; font-size:10pt; text-align:center; margin-bottom:6px;">Fokus Materi Pengukuran (3 Domain Eksperimen Fisika):</h4>
            <div class="cover-pills-row">
                <span class="hero-pill">📏 Panjang: Jangka Sorong (OLabs)</span>
                <span class="hero-pill">⚖️ Massa: Neraca Pegas (OLabs)</span>
                <span class="hero-pill">⏱️ Waktu: Bandul Matematis</span>
                <span class="hero-pill">🎯 Evaluasi Kuis HOTS & Sertifikat</span>
                <span class="hero-pill">📱 Progressive Web App (PWA)</span>
            </div>
        </div>

        <div class="cover-meta">
            <div class="meta-tag">Fasilitas & Standar Acuan:</div>
            <div class="meta-val">Online Labs (OLabs) • Kurikulum Merdeka Fase D • Model Discovery Learning</div>
            <div style="font-size:8.5pt; color:#64748b; margin-top:8px;">Tahun Akademik 2026/2027 • Akses Daring: <em>projects-01.samrifa.com</em></div>
        </div>
    </div>

    <!-- ==================== HALAMAN 2: LATAR BELAKANG & ARSITEKTUR ==================== -->
    <div class="page-break"></div>

    <div class="section-header">
        <span class="section-num">1</span>
        <h2 class="section-title">Latar Belakang, Tujuan, & Arsitektur Sistem</h2>
    </div>

    <div class="callout-box">
        <strong>Intisari Inovasi:</strong> Media pembelajaran ini dikembangkan untuk mengatasi kendala keterbatasan kuantitas alat ukur di sekolah, risiko keausan alat presisi, serta kesulitan siswa dalam memahami pembacaan skala nonius dan Hukum Hooke secara langsung.
    </div>

    <h3 style="font-size:11pt; margin-bottom:6px; color:#064e3b;">A. Latar Belakang Masalah & Urgensi Media</h3>
    <ul class="step-list">
        <li><strong>Keterbatasan Alat di Sekolah:</strong> Jumlah jangka sorong dan neraca pegas di sekolah sering kali tidak sebanding dengan rasio jumlah siswa, menyebabkan praktikum kurang mandiri.</li>
        <li><strong>Kesulitan Konsep Abstrak:</strong> Pembacaan skala nonius <em>(vernier)</em> dengan ketelitian 0,01 cm serta penyesuaian titik nol <em>(zero error)</em> sulit divisualisasikan hanya menggunakan gambar buku cetak biasa.</li>
        <li><strong>Kebutuhan Akses Fleksibel:</strong> Siswa membutuhkan laboratorium virtual yang bisa diakses dari HP masing-masing kapan saja tanpa kendala kuota besar atau instalasi rumit.</li>
    </ul>

    <h3 style="font-size:11pt; margin-top:14px; margin-bottom:6px; color:#064e3b;">B. Arsitektur Sistem: Bagaimana Media Ini Berjalan?</h3>
    <p>
        Sistem dibangun menggunakan paradigma <strong>Client-Side Lightweight Architecture</strong> berbasis Progressive Web App (PWA). Diagram berikut mengilustrasikan perjalanan data mulai dari server hosting hingga diproses secara instan di smartphone siswa:
    </p>

    <!-- Diagram Mermaid 1: Arsitektur Sistem -->
    <div class="diagram-card avoid-break">
        <div class="mermaid">
flowchart LR
    subgraph S1["1. Cloud & Server Hosting"]
        Git["Repository GitHub (main)"] --> Host["Web Hosting cPanel (projects-01.samrifa.com)"]
    end
    subgraph S2["2. Pengiriman & Cache"]
        Host --> Net["Browser HP / Laptop Siswa"]
        Net --> PWA["Install PWA ke Home Screen (manifest.json)"]
        Net --> SW["Offline Cache Engine (sw.js v5)"]
    end
    subgraph S3["3. Pemrosesan di HP Siswa"]
        SW --> Engine["Client-Side Engine (HTML5 + CSS3 + ES6)"]
        Engine --> Canvas["Canvas 2D Simulator (Render Fisika 60 FPS)"]
        Engine --> LocalDB["LocalStorage (Identitas & Skor Kuis)"]
        Engine --> PrintCSS["Print CSS (Isolasi Cetak Sertifikat)"]
    end
        </div>
        <div class="diagram-caption">Gambar 1: Diagram Alur Arsitektur Sistem dari Web Hosting hingga Pemrosesan di HP Siswa</div>
    </div>

    <div class="callout-box callout-blue">
        <strong>Poin Penting untuk Dosen:</strong> Kenapa tidak menggunakan framework berat seperti React atau Angular? 
        <em>Karena Vanilla HTML5/CSS3/JavaScript murni memiliki ukuran file sangat kecil (&lt; 2 MB untuk seluruh app), kecepatan memuat di bawah 1 detik, dan tidak membutuhkan runtime Node.js di server, sehingga performa di HP siswa berspesifikasi rendah tetap halus tanpa patah-patah (60 FPS).</em>
    </div>

    <!-- ==================== HALAMAN 3: STRUKTUR MENU & PETA NAVIGASI ==================== -->
    <div class="page-break"></div>

    <div class="section-header">
        <span class="section-num">2</span>
        <h2 class="section-title">Struktur Menu Lengkap & Diagram Alur Navigasi</h2>
    </div>

    <p>
        Aplikasi dirancang dengan pendekatan <em>Single Page Application (SPA)</em> yang gamified. Siswa memulai dari cover papan gantung bertema eksplorasi hutan, mengisi identitas diri, lalu masuk ke Dashboard Utama yang memuat 6 menu misi belajar.
    </p>

    <!-- Diagram Mermaid 2: Struktur Hierarki Menu Lengkap -->
    <div class="diagram-card avoid-break">
        <div class="mermaid">
flowchart TD
    Cover["🌟 0. Cover Pembuka (Zero-Scroll 100dvh)"] --> ModalID["📝 Modal Identitas Siswa (Nama, Kelas, No. Absen, Sekolah)"]
    ModalID --> Dash["🏠 1. Dashboard Petualangan (Menu Utama)"]
    
    Dash --> M1["📚 Bahan Ajar"]
    Dash --> M2["🔬 Lab Virtual (Utama)"]
    Dash --> M3["🎯 Kuis HOTS"]
    Dash --> M4["🎬 Video Praktikum"]
    Dash --> M5["📖 Panduan Alat"]
    Dash --> M6["📄 Modul Ajar"]

    M1 --> M1_Sub["16 Slide Besaran Pokok & Satuan • Navigasi Panah, Thumbnail & Suara"]
    
    M2 --> M2_A["📏 Tab 1: Jangka Sorong (Slider SU/SN, Objek Silinder/Balok, Cek Jawaban)"]
    M2 --> M2_B["⚖️ Tab 2: Neraca Pegas (Hukum Hooke, Pilihan Gravitasi Bumi/Bulan/Mars/Jupiter)"]
    M2 --> M2_C["⏱️ Tab 3: Bandul & Waktu (Slider Tali/Massa, Stopwatch Digital 10 Ayunan)"]
    M2 --> M2_D["📋 Tab 4: LKPD Digital (Perekaman Otomatis Data Praktikum & Tombol Cetak PDF)"]

    M3 --> M3_Sub["10 Soal Penalaran Interaktif • Timer • Pembahasan Kunci • 📜 Cetak Sertifikat Kelulusan"]
    
    M4 --> M4_Sub["3-Chip Video Deck: Video HD Offline Jangka Sorong, Neraca Pegas, & Bandul OLabs"]
    
    M5 --> M5_Sub["Viewer User Guide Resmi OLabs (5 Hal Jangka Sorong, 5 Hal Neraca, 9 Hal Bandul + Zoom)"]
    
    M6 --> M6_Sub["Viewer 11 Halaman Modul PDF Kurikulum Merdeka (Capaian Pembelajaran & Zoom In/Out)"]
        </div>
        <div class="diagram-caption">Gambar 2: Diagram Pohon Hierarki Menu dan Sub-Fitur Lengkap Aplikasi</div>
    </div>

    <h3 style="font-size:11pt; margin-top:14px; margin-bottom:8px; color:#064e3b;">Rincian 6 Menu Utama dan Fungsinya:</h3>
    <div class="features-grid">
        <div class="feat-item accent-green">
            <div class="feat-head">📚 1. Bahan Ajar Interaktif</div>
            <p class="feat-desc">Presentasi digital 16 slide interaktif mencakup konsep besaran pokok, besaran turunan, dimensi, satuan SI, dan pentingnya ketelitian alat ukur.</p>
        </div>
        <div class="feat-item accent-green">
            <div class="feat-head">🔬 2. Lab Virtual (Eksperimen)</div>
            <p class="feat-desc">Laboratorium interaktif 3 alat ukur presisi dengan engine Canvas 2D + Lembar Kerja Peserta Didik (LKPD) digital yang otomatis mencatat hasil.</p>
        </div>
        <div class="feat-item accent-amber">
            <div class="feat-head">🎯 3. Kuis HOTS & Sertifikat</div>
            <p class="feat-desc">10 butir soal penalaran (C4–C6) dilengkapi batas waktu, ulasan pembahasan kunci jawaban, nilai akhir, predikat kelulusan, dan cetak sertifikat resmi.</p>
        </div>
        <div class="feat-item accent-amber">
            <div class="feat-head">🎬 4. Video Praktikum (3 Domain)</div>
            <p class="feat-desc">Video panduan demonstrasi riil per domain (Panjang, Massa, Waktu) dengan pemutar video HD MP4 lokal bebas iklan dan poin-poin rumus pembacaan.</p>
        </div>
        <div class="feat-item accent-blue">
            <div class="feat-head">📖 5. Panduan Alat (User Guide)</div>
            <p class="feat-desc">Buku petunjuk operasional bergambar standar OLabs yang dilengkapi tombol pembesar (*Zoom In/Out*), pergeseran halaman, dan unduh PDF.</p>
        </div>
        <div class="feat-item accent-purple">
            <div class="feat-head">📄 6. Modul Ajar Kurikulum</div>
            <p class="feat-desc">Dokumen modul ajar 11 halaman untuk guru dan siswa memuat Profil Pelajar Pancasila, Capaian Pembelajaran (CP), dan Tujuan Pembelajaran (TP).</p>
        </div>
    </div>

    <!-- ==================== HALAMAN 4: MODEL PEMBELAJARAN & MEKANISME LAB ==================== -->
    <div class="page-break"></div>

    <div class="section-header">
        <span class="section-num">3</span>
        <h2 class="section-title">Model Pembelajaran & Sintaks Discovery Learning</h2>
    </div>

    <p>
        Dalam Kurikulum Merdeka, pembelajaran sains berpusat pada peserta didik (*student-centered*). Media pembelajaran ini mengintegrasikan seluruh tahapan model <strong>Discovery Learning</strong> secara berurutan:
    </p>

    <!-- Diagram Mermaid 3: Sintaks Pembelajaran -->
    <div class="diagram-card avoid-break">
        <div class="mermaid">
flowchart TD
    F1["Fase 1: Stimulation (Stimulasi)"] --> O1["Siswa mengamati Video Praktikum nyata & slide Bahan Ajar (pengenalan alat)"]
    F2["Fase 2: Problem Statement (Identifikasi Masalah)"] --> O2["Siswa merumuskan cara menentukan nilai SU, SN, gaya berat, dan periode melalui User Guide"]
    F3["Fase 3: Data Collection (Pengumpulan Data)"] --> O3["Siswa melakukan eksperimen mandiri di Lab Virtual: geser vernier, timbang massa, ayun bandul"]
    F4["Fase 4: Data Processing (Pengolahan Data)"] --> O4["Sistem merekam data ke LKPD Digital: perhitungan SU+(SN×0,01), w=m.g, dan T=t/n"]
    F5["Fase 5: Verification (Pembuktian)"] --> O5["Siswa menguji kebenaran hitungan lewat fitur Uji Coba Lab dan menyelesaikan 10 Soal Kuis HOTS"]
    F6["Fase 6: Generalization (Menarik Kesimpulan)"] --> O6["Siswa menelaah ulasan pembahasan kuis dan menerima Sertifikat Kelulusan resmi"]
        </div>
        <div class="diagram-caption">Gambar 3: Integrasi 6 Tahapan Sintaks Discovery Learning ke dalam Fitur Media Pembelajaran</div>
    </div>

    <h3 style="font-size:11pt; margin-top:16px; margin-bottom:8px; color:#064e3b;">Rincian Mekanisme 3 Simulasi Laboratorium Virtual (Canvas 2D)</h3>
    
    <table class="styled-table avoid-break">
        <thead>
            <tr>
                <th style="width:25%;">Domain Alat Ukur</th>
                <th style="width:35%;">Mekanisme Kerja & Fitur Fisika</th>
                <th style="width:40%;">Rumus & Integrasi LKPD</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>1. Jangka Sorong (OLabs Panjang)</strong></td>
                <td>
                    - Slider rahang geser interaktif interaktif.<br>
                    - Skala utama (SU) per milimeter & skala nonius (SN) 10 garis.<br>
                    - Objek uji bervariasi: Silinder luar/dalam, Balok, Bola kelereng.
                </td>
                <td>
                    $$\text{Hasil} = \text{SU} + (\text{SN} \times 0{,}01\text{ cm})$$<br>
                    Tersedia kotak uji verifikasi hitungan mandiri dan tombol <em>Kirim ke LKPD</em> otomatis.
                </td>
            </tr>
            <tr>
                <td><strong>2. Neraca Pegas (OLabs Massa)</strong></td>
                <td>
                    - Simulasi pertambahan panjang pegas (Hukum Hooke).<br>
                    - Pilihan 4 lingkungan gravitasi: Bumi ($9{,}8\text{ N/kg}$), Bulan ($1{,}6$), Mars ($3{,}7$), Jupiter ($24{,}8$).<br>
                    - Pembacaan gaya berat tarik ($w$) dalam Newton.
                </td>
                <td>
                    $$M = \frac{w}{g}$$ (dengan $M$ dalam kilogram/gram).<br>
                    Membuktikan bahwa gaya berat berubah tergantung gravitasi, sedangkan massa tetap konstan.
                </td>
            </tr>
            <tr>
                <td><strong>3. Bandul Matematis (OLabs Waktu)</strong></td>
                <td>
                    - Simulasi ayunan harmonis sederhana ($A \to B \to C \to B \to A$).<br>
                    - Pengaturan panjang tali ($0{,}3\text{ m} - 1{,}0\text{ m}$) dan massa bandul.<br>
                    - Stopwatch digital terintegrasi pendeteksi 10 ayunan penuh.
                </td>
                <td>
                    $$T = \frac{t}{n} \quad \text{dan} \quad T = 2\pi\sqrt{\frac{L}{g}}$$<br>
                    Membuktikan secara empiris bahwa periode <strong>hanya dipengaruhi panjang tali</strong> dan <strong>bukan</strong> massa beban!
                </td>
            </tr>
        </tbody>
    </table>

    <!-- ==================== HALAMAN 5: EVALUASI & KISI-KISI UJIAN DOSEN ==================== -->
    <div class="page-break"></div>

    <div class="section-header">
        <span class="section-num">4</span>
        <h2 class="section-title">Evaluasi Kuis HOTS & Kisi-Kisi Tanya Jawab Ujian Dosen</h2>
    </div>

    <h3 style="font-size:11pt; margin-bottom:6px; color:#064e3b;">A. Sistem Evaluasi & Sertifikat Digital</h3>
    <p>
        Kuis evaluasi terdiri dari <strong>10 butir soal HOTS (*Higher Order Thinking Skills*)</strong> level C4 (Analisis), C5 (Evaluasi), dan C6 (Kreasi). 
        Sistem dilengkapi:
    </p>
    <ul class="step-list">
        <li><strong>Rubrik Penilaian Otomatis:</strong> Nilai 0–100 dengan batas kelulusan KKM 75. Predikat: <em>Sangat Baik (⭐⭐⭐⭐⭐)</em>, <em>Baik (⭐⭐⭐⭐)</em>, atau <em>Perlu Remedial</em>.</li>
        <li><strong>Ulasan Pembahasan:</strong> Menampilkan analisis butir soal yang benar/salah secara mendalam untuk penguatan konsep.</li>
        <li><strong>Isolasi Cetak Sertifikat:</strong> Menggunakan teknik `@media print` terisolasi sehingga ketika dicetak, hanya lembar sertifikat kelulusan emas berbingkai rapi dalam orientasi landscape yang muncul (bebas tombol dan bebas halaman kuis).</li>
    </ul>

    <h3 style="font-size:11pt; margin-top:14px; margin-bottom:8px; color:#064e3b;">B. Tabel Kisi-Kisi Tanya Jawab (Cheat Sheet Ujian Dosen)</h3>
    <p style="font-size:8.5pt; color:#64748b; margin-bottom:8px;">
        <em>Pelajari tabel di bawah ini. Jawaban telah disederhanakan agar mudah dihafal dan diucapkan dengan percaya diri saat dosen bertanya:</em>
    </p>

    <table class="styled-table avoid-break">
        <thead>
            <tr>
                <th style="width:30%;">Pertanyaan Dosen</th>
                <th style="width:70%;">Rekomendasi Jawaban Mahasiswa yang Tepat</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>1. Kenapa memilih topik Pengukuran di Kelas VII?</strong></td>
                <td>"Materi Pengukuran adalah fondasi awal literasi sains dalam Kurikulum Merdeka Fase D. Keterampilan membaca alat ukur dan data numerik sangat menentukan keberhasilan siswa dalam bab-bab IPA selanjutnya."</td>
            </tr>
            <tr>
                <td><strong>2. Apa kelebihan media ini dibanding video YouTube biasa?</strong></td>
                <td>"Video YouTube bersifat satu arah (pasif). Media ini memberikan pengalaman <em>hands-on virtual</em> interaktif di mana siswa sendiri yang menggeser rahang alat, membaca skala nonius, menguji gravitasi, mencatat otomatis ke LKPD, dan diuji melalui kuis penalaran HOTS."</td>
            </tr>
            <tr>
                <td><strong>3. Kenapa menggunakan simulasi internal Canvas bukan cuma iframe link luar?</strong></td>
                <td>"Iframe web luar sering terkendala blokir keamanan (*X-Frame-Options*), kuota habis, atau server luar lemot. Dengan simulasi internal Canvas 2D, aplikasi berjalan 100% lancar, responsif di HP, dan data praktikumnya terhubung langsung ke tabel LKPD digital."</td>
            </tr>
            <tr>
                <td><strong>4. Bagaimana cara aplikasi ini bisa diakses offline tanpa download Play Store?</strong></td>
                <td>"Menggunakan teknologi <em>Progressive Web App (PWA)</em> dengan Service Worker (`sw.js`). Siswa cukup membuka tautan sekali di browser, lalu klik 'Tambahkan ke Layar Utama'. Semua aset tersimpan di cache lokal smartphone."</td>
            </tr>
            <tr>
                <td><strong>5. Kenapa soal kuisnya disebut HOTS?</strong></td>
                <td>"Soal kuis tidak sekadar hafalan teori (C1–C2), melainkan menyajikan stimulus kasus: membaca visual rahang jangka sorong, menganalisis grafik gaya pegas terhadap gravitasi planet, dan menganalisis mengapa massa tidak mengubah periode bandul (C4–C6)."</td>
            </tr>
            <tr>
                <td><strong>6. Bagaimana alur kerja dari coding hingga bisa dibuka di domain web?</strong></td>
                <td>"Kode program dikelola melalui GitHub repository (`main`). Ketika ada pembaruan, server webhosting (cPanel) mengeksekusi perintah `git pull origin main`. File statis langsung dilayani oleh web server Apache/Nginx ke domain `projects-01.samrifa.com` secara instan."</td>
            </tr>
        </tbody>
    </table>

    <div class="callout-box callout-amber" style="margin-top:14px;">
        <strong>Pesan Kunci untuk Penutupan Sidang:</strong> 
        "Media pembelajaran ini telah divalidasi dan diuji responsivitasnya pada perangkat mobile dan desktop, serta memenuhi kelayakan pedagogis Kurikulum Merdeka melalui integrasi 6 sintaks Discovery Learning."
    </div>

    <script>
        // Inisialisasi Mermaid dengan tema Forest profesional
        mermaid.initialize({
            startOnLoad: true,
            theme: 'forest',
            themeVariables: {
                primaryColor: '#ecfdf5',
                primaryBorderColor: '#059669',
                primaryTextColor: '#064e3b',
                lineColor: '#047857',
                fontSize: '12px',
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
    # Write the HTML to file
    html_path = os.path.abspath("panduan_dokumen_lengkap.html")
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(HTML_CONTENT)
    print("HTML written to:", html_path)

    pdf_output_path = os.path.abspath("Buku_Panduan_Lengkap_Media_Pembelajaran_IPA.pdf")
    pdf_alt_path = os.path.abspath("Panduan_Lengkap_Media_Pembelajaran_IPA.pdf")

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Load the HTML
        file_url = "file:///" + html_path.replace("\\", "/")
        await page.goto(file_url, wait_until="networkidle")

        # Wait for all Mermaid SVGs to finish rendering
        print("Waiting for Mermaid SVGs to render...")
        await page.wait_for_selector(".mermaid svg", timeout=20000)
        await page.wait_for_timeout(2000) # extra buffer for font rendering

        # Generate PDF with A4 settings and print background
        print("Generating PDF...")
        await page.pdf(
            path=pdf_output_path,
            format="A4",
            print_background=True,
            margin={
                "top": "12mm",
                "bottom": "14mm",
                "left": "12mm",
                "right": "12mm"
            }
        )
        print("PDF successfully generated at:", pdf_output_path)

        # Also save copy as alternative name
        import shutil
        shutil.copyfile(pdf_output_path, pdf_alt_path)
        print("Alternative copy saved at:", pdf_alt_path)

        # Check PDF size
        size_bytes = os.path.getsize(pdf_output_path)
        print(f"Generated PDF file size: {size_bytes / 1024:.2f} KB")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(generate_pdf())
