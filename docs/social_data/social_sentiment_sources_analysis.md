# Riset Sumber Data Social Sentiment & Narrative Tracking: Evaluasi Opsi Gratis vs Berbayar, Akurasi, dan Rekomendasi Implementasi

## Pendahuluan: Mengapa Social Sentiment & Narrative Tracking untuk Kripto

Di pasar kripto yang volatil, narasi bergerak lebih cepat daripada struktur fundamental tradisional. Sentimen di media sosial berfungsi sebagai indikator awal yang membantu menjelaskan mengapa某一 aset suddenly mendapat perhatian, mengapa sebuah tema naik ke puncak, dan bagaimana momentum tersebut berlalu dari komunitas边缘 ke arus utama. Social sentiment dan narrative tracking menangkap “suasana” kolektif yang sering mendahului pergerakan harga: dari obrolan harian di X (Twitter), Reddit, Telegram, Discord, hingga liputan media berita. Narasi kripto yang dominan pada 2024—seperti DePIN, AI, GameFi, DeFi, RWA, Modularity, Omni‑Chain/Interoperability, dan Data Availability—memberi konteks pada alokasi modal dan preferensi risiko investor; mengikuti evolusi narasi tersebut adalah syarat untuk mendeteksi peluang dan menghindari jebakan yang sekadar sedang tren tanpa fundamentos yang memadai[^1]. Pada saat yang sama, sinyal lintas platform menyediakan keunggulan analitis ketika digabungkan secara sistematis, terlebih saat metodologi deteksi memadukan engagement komunitas, analitik real‑time, dan indikator momentum[^2].

Laporan ini menelusuri lanskap sumber data social sentiment dan narrative tracking, menilai opsi gratis versus berbayar, membandingkan akurasi relatif lintas kanal, dan menawarkan rekomendasi arsitektur yang patuh kebijakan. Fokusnya adalah pada kebutuhan praktis tim data/analytics, продукт manager, peneliti kripto,quant, dan operasional trading yang membutuhkan pipeline data yang bisa diandalkan, terukur, dan Cost‑of‑Ownership yang realistis.

### Definisi & Konteks Pasar

- Sentimen merujuk pada polaritas emosional tertulis (positif, negatif, netral) serta细度 tambahan seperti stance (dukungan/penentangan), emosi (mis. euforia, kepanikan), dan topik/named‑entity (token, aktor, peristiwa).
- Narrative lifecycle menggambarkan tahapan从一个 ide muncul (inisiasi), mendapat momentum (eskalasi), mencapai puncak perhatian (peak), lalu menurun (decay). Di kripto, siklus ini sering kali dipercepat oleh tokoh kunci, berita, dan rotasi sektor.
- Tren sosial adalah manifestasi perhatian kolektif yang dapat diukur: volume percakapan, engagement velocity, share‑of‑voice, serta dominasi narasi di platform tertentu[^3]. Alat yang memetakan social dominance, trending creators, dan related topics memperkaya interpretasi pasar[^4].

Dengan kerangka di atas, sistem social sentiment dan narrative tracking membantu membaca “iklim pasar” dan menautkannya ke tindakan—misalnya, mengidentifikasi entri potensial ketika momentum sosial bersilangan dengan katalis fundamental.

## Metodologi & Kerangka Evaluasi

Pendekatan evaluasi dirancang pragmatis agar menghasilkan keputusan yang dapat dieksekusi:

- Discovery dan pemetaan vendor/sumber: inventarisasi platform inti (X, Reddit, Telegram, Discord), penyedia berita, dan alat momentum/narasi.
- Penilaian akses gratis vs berbayar: menyusun matriks fitur akses (endpoint, rate limits, historis, filtering), biaya, dan kebijakan.
- Uji akurasi lintas sumber: menetapkan ground truth, uji A/B antar vendor, validasi silang; mengurangi漂移 dataset melalui monitoring distribusi fitur.
- Kepatuhan & etika: tinjau ToS platform, privasi data, hak replikasi; dokumentasikan kontrol mitigasi.
- TCO (Total Cost of Ownership): lisensi, infrastruktur ingest/storage/processing, labeling, human review, pemeliharaan model.

Untuk mengoperasionalkan perbandingan, kita gunakan matriks kriteria dan bobot konseptual (Tabel 1). Ini menjadi dasar diskusi lintas fungsi.

### Tabel 1. Matriks Kriteria & Bobot Penilaian
| Kriteria                | Deskripsi                                                                 | Bobot (%) |
|-------------------------|---------------------------------------------------------------------------|-----------|
| Akurasi                 | Kesesuaian label sentimen, topic, dan entity dengan ground truth          | 30        |
| Cakupan                 | Tingkat kelengkapan thread/post/reaksi serta широта sumber               | 20        |
| Latensi                 | Waktu dari posting ke availability sinyal                                 | 15        |
| Granularitas/Label      | Ketepatan label (sentimen, stance, emosi, topik, entitas, waktu)         | 15        |
| Kepatuhan               | Kesesuaian dengan ToS, privasi, replikasi, kebijakan konten               | 10        |
| Biaya & TCO             | Lisensi + operasional + pemeliharaan                                      | 7         |
| Keandalan/SLA           | Stabilitas layanan, dukungan, recovery, dokumentasi                       | 3         |

Interpretasi: akurasi, cakupan, dan latensi adalah penentu kualitas sinyal produksi; granularitas dan kepatuhan menjamin keberlanjutan operasional.

### Define Metrics & KPIs

Metrik inti:
- Precision/Recall/F1 untuk klasifikasi sentimen dan topik.
- Engagement‑velocity: pertumbuhan interaksi per topik/waktu.
- Share‑of‑voice: porsi упоминаний sebuah topik relatif terhadap topik lain.
- Narrative lifecycle: durasi dari inisiasi ke puncak dan decay.
- Label agreement: konsistensi di antara anotator/model.

Target dan threshold disepakati lintas tim riset dan produk. Untuk mengurangi漂移, lakukan re‑benchmarking berkala terhadap ground truth.

### Sampling & Ground Truth

- Stratified sampling per platform, topik (DeFi, NFT, L1, Meme coins), dan waktu (menit, jam, hari).
- Oversampling pada peristiwa jarang namun berdampak besar (mis. pengumuman regulasi, exploit).
- Ground truth berbasis anotasi manusia multi‑anotator, event kunci berlabel manual, dan cross‑source validation untuk konsistensi sinyal.
- Dokumentasi: panduan coding label (sentimen, stance, emosi), protokol resolving disagreements, audit trail retraining.

## Pemetaan Sumber Data & Kapabilitas

Lanskap sumber data mencakup platform sosial (X, Reddit, Telegram, Discord), media berita, dan alat momentum/narasi. Struktur data, kebijakan akses, dan reliabilitas bervariasi; penting untuk mengompilasinya secara modular agar dapat dipilih sesuai kebutuhan.

### Twitter/X API untuk Sentimen

X adalah sumber obrolan publik yang deras. Data relevan mencakup posting, reply, reactions, metadata, dan attachments. Akses tersedia dalam bentuk API resmi (Free, Basic, Pro, Enterprise), sementara alternatif pihak ketiga menawarkan modelpay‑per‑use yang dapat menekan biaya untukvolume tinggi.

Untuk keputusan arsitektur, angka resmi dan alternatif penting diketahui.

#### Tabel 2. X API v2: Ringkasan Tier Resmi
| Tier       | Harga        | Reads/Month         | Writes/Month        | Fitur Utama                                 |
|------------|--------------|---------------------|---------------------|---------------------------------------------|
| Free       | $0           | 100 posts           | 500 posts           | 1 proyek; 1 app/proyek; endpoint v2 dasar   |
| Basic      | $200         | 15.000 posts        | 50.000 posts        | 1 proyek; hingga 2 app/proyek; endpoint v2 penuh |
| Pro        | $5.000       | 1.000.000 posts     | 300.000 posts       | 1 proyek; hingga 3 app/proyek; arsip penuh; filtered stream; dukungan prioritas |
| Enterprise | Kontak Penjualan | Akses luas        | Kustom              | Aliran penuh; backfill; integrasi kustom; SLA |

Sumber angka resmi dari dokumentasi X API v2[^5].

#### Tabel 3. Alternatif Resmi: Biaya per 1.000 Tweets (Referensi)
| Paket/Model                 | Harga per 1.000 Tweets | Keterangan                                 |
|----------------------------|-------------------------|--------------------------------------------|
| X Official API (Pro)       | $5.00                   | 1 juta reads/bulan ≈ $5.000                |
| Alternatif pay‑per‑use     | $0.15                   | Kredit tidak kedaluwarsa; diskon volume    |

Perbandingan biaya menunjukkan potensi penghematan signifikan dengan alternatif pay‑per‑use untuk kebutuhan baca volume tinggi[^6].

Interpretasi: untuk workloads baca besar, model pay‑per‑use dapat menurunkan biaya hingga dua digit persentase; untuk kebutuhan write, kontrol, dan SLA, tier resmi Pro/Enterprise tetap relevan.

Keterbatasan: perubahan kebijakan dan batasan akses; deteksi sarcasm/ironi; spam/astroturfing.

Use cases: deteksi awal tren dan anomali engagement; pemetaan spread antar akun kunci; alert narasi baru.

### Reddit Crypto Communities Data

Reddit menyimpan diskusi panjang dan terstruktur. Data relevan mencakup post, komentar, voting, metadata community, waktu. Akses via API resmi, scrapper, atau agregator pihak ketiga. Praktik yang lazim termasuk menggunakan PRAW (Python Reddit API Wrapper) untuk mengekstrak judul subreddit dan NLTK Vader untuk scoring sentimen[^7], dengan panduan implementasi di Alpaca[^8]. Dataset publik seperti PulseReddit menyediakan benchmark akademis untuk multi‑agent systems di konteks Reddit kripto[^9].

#### Tabel 4. Reddit: API Resmi vs Scraper vs Agregator (Konseptual)
| Opsi                      | Cakupan          | Historis           | Rate Limits             | Kebijakan & Privasi           |
|---------------------------|------------------|--------------------|-------------------------|-------------------------------|
| API Resmi                 | Community publik | Bergantung level   | Ditetapkan resmi        | Patuh ToS Reddit              |
| Scraper                   | Variatif         | Bergantung metode  | Risiko throttling       | Potensi pelanggaran ToS       |
| Agregator Pihak Ketiga    | Konsolidasi      | Bergantung vendor  | Ditetapkan vendor       | Patuh kebijakan pihak ketiga  |

Interpretasi: API resmi lebih aman secara kepatuhan; scrapper menambah risiko; agregator mempercepat integrasi namun menambah dependensi eksternal.

### Telegram Crypto Channels

Telegram menyediakan kanal/grup dengan posting, reply, reaksi, metadata. Akses via scraping atau bot/API terbatas. Banyak komunitas kripto bergeser ke kanal privat, sehingga coverage publik terbatas. Studi akademik menyediakan dataset komentar Telegram terkait kripto dengan sentimen, yang berguna untuk benchmarking dan validasi[^10][^11].

#### Tabel 5. Telegram: Scraping vs Bot/API vs Agregator (Konseptual)
| Opsi                   | Kelebihan                             | Keterbatasan                            | Kepatuhan             | Risiko Teknis          |
|------------------------|----------------------------------------|-----------------------------------------|-----------------------|------------------------|
| Scraping               | Fleksibel                              | Rentan perubahan UI, throttling         | Risiko ToS            | Tinggi                 |
| Bot/API                | Lebih stabil                           | Fitur terbatas, kebijakan ketat         | Lebih baik            | Menengah               |
| Agregator              | Integrasi cepat                        | Ketergantungan vendor                   | Bergantung vendor     | Menengah               |

Interpretasi: bila izin dan etika terpenuhi, bot/API lebih berkelanjutan; scraping cepat tetapi rapuh.

### Discord Crypto Communities

Discord menyediakan server, channel, thread, reactions; bot ingest memungkinkan akses chat dan metadata. Kebijakan penggunaan bot dan rate limit bervariasi antar server. API Discord memiliki interface Gateway (WebSocket, event streaming) dan REST (operasi CRUD), dengan keamanan yang menuntut pengelolaan token dan intent secara ketat[^12].

#### Tabel 6. Discord: Bot Resmi vs Integrasi Pihak Ketiga (Konseptual)
| Opsi                      | Fitur Data                      | Rate Limits           | Kebijakan & Privasi          |
|---------------------------|----------------------------------|-----------------------|------------------------------|
| Bot Resmi                 | Chat, reaksi, metadata channel  | Ditetapkan server     | Patuh kebijakan server       |
| Integrasi Pihak Ketiga    | Konsolidasi beberapa server     | Ditetapkan vendor     | Patuh kebijakan vendor       |

Interpretasi: implementasi bot resmi pada server relevan memberi kendali lebih baik; integrasi pihak ketiga menawarkan skala dengan evaluasi keamanan data yang ketat.

### News Sentiment APIs

Sumber berita menyediakan artikel, judul, konten, metadata, dan label potensial (sentimen, topik, entitas). Akses via API langsung, agregator berita, atau paywall. Perbandingan lintas penyedia membantu menentukan trade‑off coverage, historis, enrichment, biaya, SLA.

#### Tabel 7. Penyedia News Sentiment & Data: Ringkasan
| Penyedia          | Model Akses & Fokus                             | Historis/Label             | Biaya (Indikatif)          | Catatan SLA/Dokumentasi        |
|-------------------|--------------------------------------------------|----------------------------|----------------------------|--------------------------------|
| StockGeist        | REST/SSE; crypto & stock sentiment               | Sentimen per item; stream  | Free 10k credits; Paket $75–$1.000; SSE crypto/stock berbagai | Transparansi label; streaming[^13][^14] |
| Finnhub           | News Sentiment; real‑time trades (US, forex, crypto) | Indikator sentimen berita  | Tidak disebutkan di sini   | Dokumentasi jelas[^15]         |
| NewsAPI.org       | Feed berita umum; enrichment pihak ketiga untuk sentimen | Historis luas (bergantung paket) | Gratis harian; paket berbayar (variatif) | Perlu dedup; enrichment eksternal[^16][^17] |
| EODHD             | Financial news API dengan filter ticker/tanggal | Historis tersedia          | Paket vary                 | Integrasi praktis untuk trading[^18] |
| StockNewsAPI      | JSON API; sentiment per news item                | Historis tersedia          | 100 calls/month gratis; premium tersedia | Dokumentasi langsung[^19]      |
| NewsAPI.ai        | Perbandingan 8 penyedia News API (2025)          | Rangkuman fitur/harga      | Rujukan komparatif          | Panduan memilih News API[^16]  |

Interpretasi: untuk sinyal新闻 terstandardisasi, kombinasi News API + enrichment sentiment memberikan keseimbangan biaya/akurat; untuk kebutuhan streaming, SSE (StockGeist) memberi latensi rendah.

### Social Momentum Tracking Tools

Alat ini mengukur engagement, reach, velocity, frequency, breadth lintas platform, memberi alert perubahan momentum, dan memetakan spread narasi.

#### Tabel 8. Fitur Sosial Momentum: LunarCrush vs Santiment vs SentimenTracker
| Fitur/Aspek             | LunarCrush                         | Santiment                       | SentimenTracker                |
|-------------------------|------------------------------------|----------------------------------|--------------------------------|
| Cakupan Data            | Crypto, saham, prediksi, 35+ kategori | Platform media kripto            | Multi‑platform (Reddit, Facebook, Instagram, TikTok, YouTube, Discord, X, Telegram, StockTwits) |
| Social Metrics          | Mentions, engagements, social dominance, contributors, AltRank™, Galaxy Score™ | Trending words/stories/coins, historical trends | Momentum indicators, Social Sentiment Tracker (hourly/daily), Trending by Chain |
| API/Akses               | App + API; paket Individual/Builder/Scale/Enterprise | Web app; bot; integrasi komunitas | Web dashboard; komunitas       |
| Rate Limits             | 10 req/min (Individual); 100 req/min (Builder); 500 req/min (Scale) | Tidak dirinci | Tidak dirinci                 |
| Lisensi                 | $72/$240/$720/Enterprise           | Harga tidak dirinci (halaman fitur) | $24.95–$149/month; $199–$999/year |
| Nilai Tambah AI         | Agents, kredit AI, MCP server      | Narasi kripto terstruktur        | Algoritma momentum & sosial    |

Interpretasi: LunarCrush unggul pada struktur data dan API; Santiment unggul pada fitur trend kripto; SentimenTracker memberikan cakupan lintas platform dengan indikator momentum yang kuat[^4][^20][^21][^3][^22][^23].

### Narrative Detection & Trending Analysis

Deteksi narasi membutuhkan pipeline: ingestion → preprocessing → topik/NER → klasifikasi/klastering. Metode umum: aturan berbasis kata kunci, pendekatan graf (network mentions), embedding teks, dan pembelajaran tanpa pengawasan.

#### Tabel 9. Metode Deteksi Narasi (Konseptual)
| Metode                 | Akurasi Relatif       | Kompleksitas           | Transparansi          | Kebutuhan Data            |
|------------------------|-----------------------|-------------------------|-----------------------|---------------------------|
| Keyword/Rule‑based     | Sedang                | Rendah                  | Tinggi                | Rendah                    |
| Graph‑based            | Tinggi (untuk spread) | Menengah–Tinggi         | Menengah              | Jaringan interaksi        |
| Embedding/Clustering   | Tinggi (semantik)     | Menengah                | Menengah–Rendah       | Besar                     |
| Unsupervised ML        | Tinggi (variatif)     | Tinggi                  | Rendah                | Sangat besar              |

Interpretasi: kombinasi rule‑based prefiltering + embedding clustering memberi hasil stabil—auditability tinggi sambil menangkap细度 semantik. Narasi 2024 menjadi ground truth konseptual untuk kalibrasi awal[^1][^2][^24].

## Evaluasi Gratis vs Paid & Akurasi

Perbandingan ini menilai akses, dukungan, SLA, akurasi, dan fleksibilitas antara tier gratis dan berbayar, serta trade‑off biaya dan Cakupan.

### Trade‑off Gratis vs Paid

#### Tabel 10. Gratis vs Berbayar: Komparasi Konseptual
| Aspek              | Gratis (Free tier/OS/komunitas)                 | Berbayar (Commercial/Enterprise)                          |
|--------------------|--------------------------------------------------|-----------------------------------------------------------|
| Akses              | Terbatas; fitur dasar; dokumentasi umum         | Luas; historis; filtering; streaming; webhook/stream      |
| Dukungan/SLA       | Rendah                                            | Tinggi; dukungan prioritas; SLA                           |
| Akurasi            | Variatif; bergantung dataset/label               | Lebih tinggi bila enrichment & model ditopang vendor      |
| Fleksibilitas      | Terbatas                                          | Kustomisasi; endpoint lebih kaya; integrasi fleksibel     |
| Biaya              | Rendah upfront;OPEX rendah                       | TCO lebih tinggi; stabilitas & skalabilitas lebih baik    |

Interpretasi: untuk eksperimen awal dan workload kecil, free tier memadai. Untuk produksi berskala, berbayar memberikan stabilitas dan fitur penting.

### Estimasi Akurasi per Sumber (Konseptual)

#### Tabel 11. Estimasi Akurasi per Sumber
| Sumber           | Precision (Range) | Recall (Range) | Catatan Kontekstual                                              |
|------------------|-------------------|----------------|------------------------------------------------------------------|
| X (Twitter)      | 0.70–0.85         | 0.65–0.80      | Noisy; sarcasm; spam/astroturfing memengaruhi akurasi           |
| Reddit           | 0.75–0.88         | 0.70–0.85      | Threaded; upvote/downvote membantu                              |
| Telegram         | 0.65–0.80         | 0.60–0.75      | Komunitas privat; noise tinggi; kebijakan ketat                 |
| Discord          | 0.70–0.85         | 0.65–0.80      | Bergantung bot dan izin server                                  |
| News APIs        | 0.80–0.92         | 0.75–0.90      | Standarisasi lebih baik; enrichment; dedup penting              |

Interpretasi: berita cenderung lebih akurat dan konsisten; sosial memberi coverage cepat namun membutuhkan kontrol kualitas ketat[^25][^26][^27][^10][^11].

### Perbandingan Biaya (Konseptual)

#### Tabel 12. Matriks Biaya Relatif per Sumber
| Sumber                 | Biaya Lisensi (1–5) | Biaya Operasional (1–5) | Total Relatif (1–5) | Catatan                                         |
|------------------------|----------------------|---------------------------|----------------------|-------------------------------------------------|
| X API                  | 3–5                 | 3–4                       | 4–5                 | Tergantung level akses dan volume               |
| Reddit                 | 2–4                 | 2–3                       | 3–4                 | API resmi aman; scrapper menambah risiko        |
| Telegram               | 1–3                 | 3–4                       | 3–4                 | Bergantung metode akses dan privasi             |
| Discord                | 1–3                 | 2–3                       | 2–3                 | Biaya bot/integrasi; izin server                |
| News APIs              | 3–5                 | 2–3                       | 3–5                 | Dedup dan enrichment memengaruhi biaya          |
| Momentum tools         | 3–5                 | 2–3                       | 3–5                 | Berbasis paket vendor                           |
| Narrative tools        | 3–5                 | 3–4                       | 4–5                 | Mahal jika enterprise dengan SLA                |

Interpretasi: optimasi biaya dicapai dengan multi‑sourcing, caching, dan modularisasi pipeline. Untuk X, model pay‑per‑use dapat menurunkan biaya reads secara signifikan[^6].

## Arsitektur Data & Operasional (Blueprint)

Desain modular yang patuh kebijakan memastikan skalabilitas dan reliability.

1) Ingestion  
- Sumber primer (API resmi) dan sekunder (agregator) melalui konektor modular.  
- Streaming untuk X/Discord; batch untuk Reddit/News.  
- Logging akses, kepatuhan ToS, kebijakan replikasi konten.

2) Normalization  
- Standarisasi skema lintas sumber.  
- Deduplikasi lintas platform; konsolidasi thread.

3) Enrichment  
- NLP: sentiment, topik, NER, stance, emosi.  
- Graph features: network of mentions, influence score.  
- Label propagation antar kanal untuk konsistensi.

4) Storage  
- Data lake (raw/bronze); warehouse (silver/gold).  
- Partisi: waktu, sumber, topik.

5) Serving  
- API internal, dashboard, alert.  
- Explainability: tampilkan fitur kunci dan kontribusi metrik.

6) Governance  
- PII handling & masking.  
- RBAC.  
- Audit trail konsumsi/ekspor.

### Kepatuhan & Kebijakan

Checklist konseptual di bawah membantu memastikan praktik yang benar:

#### Tabel 13. Checklist Kepatuhan per Platform (Konseptual)
| Platform     | ToS Utama                          | Rate Limit           | Dilarang               | Data Sensitif                   |
|--------------|------------------------------------|----------------------|------------------------|----------------------------------|
| X            | Penggunaan API resmi               | Ditetapkan level     | Scraping tak resmi     | PII, DM                          |
| Reddit       | API dan kebijakan komunitas        | Ditetapkan           | Pencurian data         | PII dalam komentar               |
| Telegram     | Kebijakan kanal/grup               | Ditetapkan           | Scraping tak resmi     | Konten privat                    |
| Discord      | Kebijakan bot & server             | Ditetapkan server    | Akses tak berizin      | PII, channel privat              |
| News         | Lisensi & hak republishing         | Ditetapkan vendor    | Penyebaran tanpa hak   | PII editorial (jarang)           |

Interpretasi: dokumentasikan izin (mis. bot invite di Discord), hindari replikasi konten yang melanggar lisensi, sediakan mekanisme purge PII[^12][^5].

### Skalabilitas & Keandalan

- Queue & buffering; backpressure & retry.  
- Caching hasil enrichment.  
- Observability: logging, metrics, tracing; alert SLA.  
- Uji keandalan: penyulihan otomatis saat throttling; graceful degradation; disaster recovery.

## Risiko, Bias, dan Kontrol Kualitas

Risiko utama: spam/astroturfing, bias platform, bias bahasa/slang,漂移 dataset. Kontrol kualitas berlapis menurunkan dampak risiko.

### Deteksi Spam & Manipulation

- Fitur: rasio reply/mention, repetisi posting, anomali engagement.  
- Metode: graph‑based outlier detection; blacklist akun/kanal.  
- Respons: menurunkan bobot sinyal entitas manipulatif.

### Bias & Fairness

- Monitor distribusi sentimen/topik lintas bahasa/geografi.  
- Penyesuaian lexicon domain kripto dan slang lokal.  
- Evaluasi model: uji kelompok minoritas; retraining terjadwal.

### Quality Assurance

- Audit label dan sampling gold standard.  
- Retraining berkala dengan feedback anotator.  
- Dokumentasi keputusan model dan perubahan pipeline[^3].

## Strategi Build vs Buy & Roadmap Implementasi

Keputusan build vs buy mempertimbangkan kecepatan, biaya, akurasi, kendali, risiko jangka panjang. Pendekatan hybrid (buy data + build enrichment/insight) sering memberi keseimbangan terbaik.

### Kriteria Keputusan

- Kecepatan: vendor memberi akses cepat; build memberi kendali penuh.  
- Akurasi & fleksibilitas: vendor memiliki model terlatih; build memungkinkan tuning domain spesifik.  
- Biaya jangka panjang: buy menambah biaya lisensi; build menambah biaya SDM/pemeliharaan.  
- Kepatuhan & audit: build memudahkan audit internal; buy memerlukan kontrak jelas.  
- Skalabilitas: buy memudahkan scale awal; build dapat dioptimalkan untuk kebutuhan unik.

### Roadmap

#### Tabel 14. Roadmap Implementasi (Tahap, Tujuan, Deliverable, Metrik Sukses)
| Tahap       | Tujuan                                   | Deliverable                                  | Metrik Sukses                           |
|-------------|-------------------------------------------|----------------------------------------------|-----------------------------------------|
| 0–1 (PoC)   | Validasi sinyal awal                     | Ingest minimal; normalisasi; labeling uji    | F1 ≥ target; latensi ≤ target           |
| 2 (Pilot)   | Integrasi vendor berbayar                | X/Reddit/News ingest; momentum tracking; alert| Coverage ↑; SLA terpenuhi               |
| 3 (Produksi)| Operasional skala penuh                  | SLA monitoring; multi‑sourcing; retraining   | Drift terkendali; retensi pengguna internal ↑ |

## KPI, Eksperimen, dan Evaluasi Berkelanjutan

KPI teknis menjaga performa model; KPI bisnis memastikan nilai pasar.

### KPI Teknis

- Akurasi model (precision, recall, F1).  
- Drift skor (perubahan distribusi fitur).  
- Coverage (persentase thread/post teramati).  
- Latensi (posting → sinyal).

### KPI Bisnis

- Deteksi tren dini (lead time).  
- Korelasi dengan harga/volume (indikatif; hindari simplifikasi kausalitas).  
- Retensi pengguna internal.  
- Waktu respons insiden.

## Rekomendasi Akhir

- Mulai hybrid: beli akses data sumber kritis (X, Reddit, News) dan bangun enrichment serta deteksi narasi secara internal.  
- Terapkan pipeline modular dengan QA dan governance; patuhi ToS dan privasi.  
- Gunakan evaluation framework konsisten; lakukan uji A/B lintas vendor/sumber.  
- Siapkan rencana retraining dan pengukuran漂移; dokumentasikan perubahan.  
- Kombinasi sinyal sosial cepat (X, Discord), diskusi mendalam (Reddit), dan validasi berita (News APIs) untuk akurasi sistemik.

## Lampiran

### Template RFP Vendor

Untuk perbandingan setara, gunakan daftar pertanyaan berikut.

#### Tabel 15. Daftar Pertanyaan RFP per Vendor (Konseptual)
| Aspek                   | Pertanyaan Kunci                                                                 |
|-------------------------|-----------------------------------------------------------------------------------|
| Akses Data              | Endpoint apa? Rate limit? Historis? Filtering?                                   |
| Format & Schema         | Payload? Metadata? Thread/nested comments?                                       |
| Kepatuhan & ToS        | Kepatuhan ToS? Kebijakan replikasi konten?                                       |
| Enrichment              | Label sentimen/topik/NER? Custom model?                                          |
| SLA & Dukungan         | Uptime? Dukungan teknis? Dokumentasi?                                            |
| Keamanan               | PII handling? Enkripsi? Audit trail?                                             |
| Biaya & Lisensi        | Paket harga? Overages? Minimum commitment?                                       |
| Ekspor & Integrasi     | Webhook/stream? Bulk export? SDK? Format eksport?                                |

### Checklist Kepatuhan

#### Tabel 16. Checklist Kepatuhan per Platform (Konseptual)
| Platform     | Izin Diperlukan         | Data yang Dilarang        | Retensi Data                | Audit & Logging             |
|--------------|--------------------------|---------------------------|-----------------------------|-----------------------------|
| X            | API resmi                | Scraping tak berizin      | Sesuai kebijakan vendor     | Log akses dan query         |
| Reddit       | API resmi                | Pencurian data            | Sesuai Reddit               | Log akses dan rate          |
| Telegram     | Izin kanal/grup         | Scraping tak berizin      | Sesuai kebijakan            | Log akses dan purge         |
| Discord      | Izin server/bot          | Akses tanpa izin          | Sesuai kebijakan server     | Log ingest & permission     |
| News         | Lisensi republishing     | Penyebaran tanpa hak      | Sesuai kontrak              | Log konsumsi dan salinan    |

### Glosarium Singkat

- Sentimen: penilaian afektif tertulis (positif, negatif, netral).  
- Stance: posisi terhadap topik (support/oppose).  
- Narrative lifecycle: inisiasi → eskalasi → puncak → decay.  
- Velocity: laju perubahan engagement.  
- Share‑of‑voice: porsi perhatian relatif.  
- 漂移 dataset: perubahan distribusi data yang memengaruhi performa model.

## Catatan Informasi yang Masih Perlu Diisi

Sebelum eksekusi final, verifikasi langsung ke sumber resmi diperlukan untuk:
- Detail harga/paket/fitur terbaru X API (level gratis/premium/enterprise, rate limits, endpoint, historis).  
- Status kebijakan Reddit tentang akses data (API resmi, scraper, batasan).  
- Kebijakan Telegram terkait scraping dan batas‑batas legal/privasi.  
- Kebijakan Discord terkait penggunaan bot untuk ingest data dan variasi limit.  
- Daftar penyedia News Sentiment API relevan dan perbandingan label/coverage.  
- Bukti empiris akurasi lintas vendor (precision/recall/F1) dalam konteks crypto.  
- Rincian biaya tools momentum/narrative tracking (lisensi, SLA, export limits).  
- Kebijakan platform tentang replikasi konten, lisensi, dan distribusi data.  
- Metodologi benchmarking dan ground truth labeling (rubrik, anotator, audit).  
- Estimasi TCO dan capacity planning ingest/storage.

---

## References

[^1]: Token Metrics. Top Crypto Narratives in 2024 - Token Metrics Moon Awards. https://www.tokenmetrics.com/blog/top-crypto-narratives?74e29fd5_page=106  
[^2]: Token Metrics. Mastering Discord Integrations & API Essentials. https://www.tokenmetrics.com/blog/mastering-discord-integrations-api-essentials?74e29fd5_page=130  
[^3]: Santiment. Crypto Sentiment Analysis Tool - Social Trends. https://app.santiment.net/social-trends  
[^4]: LunarCrush. Social Media Analytics and Investment Research (API overview). https://lunarcrush.com/about/api  
[^5]: X (Twitter). X API v2 - Introduction. https://docs.x.com/x-api/introduction  
[^6]: TwitterAPI.io. X (Twitter) Official API Pricing Tiers 2025. https://twitterapi.io/blog/twitter-api-pricing-2025  
[^7]: Alpaca. Reddit Sentiment Analysis Strategy (Python/NLTK/PRAW). https://alpaca.markets/learn/reddit-sentiment-analysis-trading-strategy  
[^8]: LearnDataSci. Sentiment Analysis of Reddit Headlines with Python NLTK. https://www.learndatasci.com/tutorials/sentiment-analysis-reddit-headlines-pythons-nltk/  
[^9]: PulseReddit (2025). A Novel Reddit Dataset for Benchmarking MAS in High-Stakes Domains. https://arxiv.org/html/2506.03861v1  
[^10]: BMC Research Notes (2024). Database comments on Telegram channels related to cryptocurrencies with sentiments. https://pmc.ncbi.nlm.nih.gov/articles/PMC11092043/  
[^11]: Mendeley Data. Telegram comments on cryptocurrencies (Dec 2023 - Mar 2024). https://data.mendeley.com/datasets/3733zt5bs6/1  
[^12]: Token Metrics. Mastering Discord Integrations & API Essentials. https://www.tokenmetrics.com/blog/mastering-discord-integrations-api-essentials?74e29fd5_page=130  
[^13]: StockGeist.ai. API Pricing. https://www.stockgeist.ai/api-pricing/  
[^14]: StockGeist.ai. Crypto Sentiment Analysis API. https://www.stockgeist.ai/crypto-sentiment-api/  
[^15]: Finnhub. News Sentiment API Documentation. https://finnhub.io/docs/api/news-sentiment  
[^16]: NewsAPI.ai. Best News API 2025: 8 Providers Compared & Ranked. https://newsapi.ai/blog/best-news-api-comparison-2025  
[^17]: Neural Engineer (Medium). Financial News Sentiment Analysis for US Stocks Using NewsAPI.org. https://medium.com/neural-engineer/financial-news-sentiment-analysis-for-us-stocks-using-newsapi-org-31d0417895b1  
[^18]: EODHD. Financial News Feed & Stock News Sentiment API. https://eodhd.com/financial-apis/stock-market-financial-news-api  
[^19]: StockNewsAPI. Pricing. https://stocknewsapi.com/pricing  
[^20]: LunarCrush. Pricing. https://lunarcrush.com/pricing  
[^21]: LunarCrush. Real-Time Social & Market Intelligence. https://lunarcrush.com/  
[^22]: Token Metrics. Mastering Discord Integrations & API Essentials. https://www.tokenmetrics.com/blog/mastering-discord-integrations-api-essentials?74e29fd5_page=130  
[^23]: Token Metrics. Top Crypto Narratives in 2024 - Token Metrics Moon Awards. https://www.tokenmetrics.com/blog/top-crypto-narratives?74e29fd5_page=106  
[^24]: CoinGecko. Top 8 Narratives in Crypto for 2025. https://www.coingecko.com/learn/crypto-narratives  
[^25]: AssemblyAI. Best APIs for Sentiment Analysis in 2025. https://assemblyai.com/blog/best-apis-for-sentiment-analysis  
[^26]: ScienceDirect (2025). Deep learning and NLP in cryptocurrency forecasting. https://www.sciencedirect.com/science/article/pii/S0169207025000147  
[^27]: arXiv (2025). Enhancing Cryptocurrency Sentiment Analysis with Multimodal ... https://arxiv.org/html/2508.15825v1  
[^28]: CoinGecko. Crypto Sentiment Analysis Trading Strategy. https://www.coingecko.com/learn/crypto-sentiment-analysis-trading-strategy