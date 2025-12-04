# Blueprint Riset: Metode & Tools untuk Narrative Momentum Detection di Crypto

## Ringkasan Eksekutif & Mandat Kalsh Core Insight

Kalsh Core Insight旨在 menjadi “otak intuisi pasar” yang langsung menghasilkan kartu insight—ringkas, relevan, dan siap eksekusi—tanpa obrolan. Sistem ini memadukan pembacaan narrative (apa yang sedang dibicarakan pasar), momentum (seberapa cepat narasi berkembang), serta perilaku smart money untuk menghasilkan sinyal yang mempercepat keputusan trading dan investasi.

Mandat riset ini adalah merangkum dan mengevaluasi metode serta tools yang paling tepat untuk mendeteksi “narrative momentum”—yakni percepatan perhatian, sentimen, dan partisipasi di sekitar topik/kategori kripto—dengan menggunakan:
- Sumber data sosial, pencarian (Google Trends), berita, dan aktivitas on-chain
- Metrik pengukuran momentum lintas platform
- Model AI/ML untuk ekstraksi pola dan prediksi
- Skor konfluensi untuk memberi confidence yang terukur

Kriteria evaluasi meliputi coverage (lebar sumber), real-time/latency (kecepatan update), historis (untuk backtest), reliabilitas sentimen, ketersediaan API, dan total cost of ownership (TCO). Hasil akhir diarahkan untuk Cardinalitas produk: Daily Insight (ringkasan narasi utama), Live Alerts (penanda perubahan signifikan), dan Explorer Insight (deteksi narasi baru tahap awal).

Untuk mencapai propósito strategis, kami mengandalkan kerangka data dan analitik sosial yang telah matang di pasar kripto, termasuk platform intelijen sosial yang mengagregasi X/Twitter, YouTube, Reddit, TikTok, serta metrik propietari untuk mengukur perhatian dan mindshare aset kripto.[^1] Di sisi on-chain dan pengembangan, kami memanfaatkan indikator perilaku whale, distribusi profit/loss, dan aktivitas developer yang diketahui memengaruhi dinamika harga dan volatilitas dalam jangka pendek maupun panjang.[^2]



## Kerangka Konseptual Narrative Momentum

Kami mendefinisikan narrative momentum sebagai laju perubahan (velocity) dan intensitas (acceleration) attention/sentiment/share-of-voice terhadap topik/kategori kripto, yang terdeteksi melalui:
- mention velocity (kenaikan jumlah penyebutan)
- influencer activity (lonjakan atau konsistensi keterlibatan KOL/VC)
- search interest (naik/turunnya minat pencarian)
- share-of-voice kategori (pangsa pembicaraan pada suatu narasi vs narasi lain)
- news sentiment shifts (perubahan polaritas berita)

Siklus narasi pasar bergerak dari Emergence (latar sinyal lemah), Acceleration (momentum naik), Peak (saturasi), Rotation (peralihan perhatian ke narasi baru), hingga Decay (penurunan). Pada masing-masing tahap, kombinasi metrik yang digunakan harus berlapis untuk menghindari bias tunggal.

Validasi empiris menunjukkan bahwa sentimen memiliki hubungan signifikan dengan volatilitas kripto, termasuk peran whale dalam transmisi guncangan. Literatura terbaru menekankan bahwa sentimen media sosial mempengaruhi volatilitas jangka pendek dan panjang; dengan metode kausalitas time-variant dan kerangka connectedness, Hubungan ini terbukti dinamis dan konteks-dependent.[^11] Di sisi lain, literatur media menunjukkan bahwa berita mainstream—melalui kategorisasi wacana—berpengaruh terhadap dinamika harga Bitcoin; efek ini terukur dan dapat dimodelkan secara data-driven.[^12] Pada tingkat narasi, bukti kausal antara narrative yang disebarkan media dan harga kripto mempertegas bahwa “narasi” bukan sekadar cerita, melainkan variabel penjelas yang dapat dioperasiakan dalam sistem peringatan dan prediksi.[^13]

Untuk mengoperasionalkan momentum narasi, kami mapekan indikator inti, sumber data, horizon waktu, dan level kepercayaan:

Tabel 1. Peta indikator momentum narasi dan horizon waktu
| Indikator | Deskripsi | Sumber Data | Horizon Aktif | Kekuatan (Mengapa Penting) | Keterbatasan |
|---|---|---|---|---|---|
| Mention Velocity | Laju penyebutan kata kunci/kategori | Sosial (X, Reddit, YouTube, TikTok) | Menit–hari | Deteksi awal acceleration | Sensitif spam/bot |
| Share-of-Voice (SoV) | Pangsa pembicaraan per narasi | Sosial/berita teragregasi | Jam–minggu | Mengukur pergeseran perhatian relatif | Terpengaruh oleh event eksternal |
| Sentiment Score | Polaritas dan intensitas | Sosial/berita | Menit–hari | Mengkonfirmasi konfluensi | Bisa bias konteks dan Sarcasm |
| AltRank/Galaxy Score | Perhatian + kinerja | Sosial proprietari | Menit–hari | Proyeksi aset yang menarik perhatian | Metodologi propietari |
| Influencer Activity | Aktivitas KOL/VC | X/Twitter | Jam–hari | Dampak pada persepsi dan aliran modal | Risiko manipulación |
| Search Interest | Minat pencarian | Google Trends API | Hari–minggu | Validasi top-down momentum | Skala indeks, bukan volume absolut |
| News Sentiment | Polaritas berita | API berita kripto | Menit–hari | Penguatan narasi via berita | Bias editorial/Agenda |
| Whale Flow | Arus dompet besar | On-chain | Jam–hari | Dampak order flow jangka pendek | Labeling address tak selalu lengkap |
| Dev Activity | Commit/release | Repositori dev | Hari–minggu | Konfirmasi fundamental | Aktivitas ≠ dampak harga langsung |

Validasi bukti-bukti di atas—pengaruh sentimen terhadap volatilitas, peran whale, serta dampak berita—membuktikan mengapa konfluensi lintas sumber menjadi kunci menghindari false positive.[^11][^12][^13] Di tahap emergensi, sinyal sosial dan search interest menjadi leading indicator; di tahap akselerasi, share-of-voice dan sentimen mengonfirmasi; di puncaknya, whale flow dan volume membantu mengidentifikasi distribusi; saat rotasi, pergeseran SoV dan search interest menjadi indikator utama peralihan narasi.



## Metodologi & Kategorisasi Sumber

Kami mengelompokkan sumber data ke empat kategori: Sosial (mention, sentimen, influence), Pencarian (Google Trends API), Berita (agregasi berita dengan sentimen), dan On-chain/Whale/Dev (aliran dompet besar, aktivitas developer). Semua sinyal dikumpulkan pada granularity menit/jam/hari disesuaikan horizon, di-normalisasi (z-score, min-max, winsorization), ditambal (interpolasi linear/seasonal), lalu difilter untuk noise dan anomali.

Untuk memastikan out-of-sample robustness, data point-in-time sangat krusial. Data sosial dengan history panjang dan granularitas fleksibel memungkinkan backtest strategi momentum tanpa look-ahead bias.[^4] Pada sumber berita, endpoint pencarian dan pembaruan real-time menjadi pondasi pipeline ingestion, namun coverage dan cakupan historis sentimen perlu diverifikasi per vendor.[^3] Untuk Google Trends, skala data yang konsisten lintas permintaan memfasilitasi perbandingan dan penggabungan yang sah.[^5]

Tabel 2. Kategori → Sumber → Coverage → Frekuensi → API/Endpoint → Lisensi
| Kategori | Sumber | Coverage | Frekuensi | API/Endpoint | Lisensi |
|---|---|---|---|---|---|
| Sosial | LunarCrush | X, YouTube, Reddit, TikTok, berita | Real-time | Public coins list; Overview API | Komersial[^1] |
| Sosial | The Tie | Sosial kripto (utamanya X) | Real-time, historis sejak 2017 | Sentiment API | Komersial[^4] |
| Sosial | Santiment | Sosial, on-chain, dev | Real-time | SanAPI | Komersial[^2] |
| Sosial | Augmento | Sosial multi-dimensi | Batch/stream | API/unduhan | Komersial[^8] |
| Sosial | TweetScout | X (akun, proyek, VC/KOL) | Hampir real-time | Custom API | Komersial[^7] |
| Pencarian | Google Trends API | Minat pencarian | Harian–tahunan | Trends API (alpha) | Alpha, akses terbatas[^5] |
| Berita | CoinDesk Data API | Berita kripto + sentimen | Real-time | Latest, Search, Article, Sources | Komersial[^3] |
| Berita | NewsData.io | Global news (beragam bahasa) | Real-time | News API | Komersial[^16] |
| Berita | NewsAPI.ai | Global real-time news | Real-time | News API | Komersial[^17] |
| On-chain/Dev | Santiment | Whale, holder, dev | Real-time | SanAPI | Komersial[^2] |
| Scraping | Apify Crypto News | Multi-sumber | Quasi real-time | Actor/scraper | Komersial[^18] |
| Social APIs | ZENPULSAR | Dataset time-series sos. | Batch/stream | API | Komersial[^10] |

Tabel 3. Masalah kualitas data dan mitigasi
| Masalah | Dampak | Mitigasi |
|---|---|---|
| Bot/Troll/Spam | False sentiment & mention | Skor kualitas akun, deteksi bot (mis. TweetScout), spam filter |
| Sarcasm/Irony | Mis-klasifikasi sentimen | Model domain-specific (CryptoBERT), fine-tuning kontekstual[^9] |
| Coverage bias | Representasi tidak seimbang | Multi-platform aggregation, normalisasi by platform |
| Duplikasi konten | Over-counting | Deduplication berbasis hash simillarity |
| Outlier | Distorsi skor momentum | Winsorization, robust scaling (z-score) |
| Seasonalitas | Interpretasi musiman | seasonal decomposition, rolling window |

Kualitas data sosial kripto sangat rentan terhadap manipulasi; oleh karena itu, kombinasi deteksi bot, pembobotan kualitas akun, serta skor propietari dari platform intelijen sosial menjadi elemen kunci pipeline.[^1][^7] Pada berita, perhatian pada metodologi klasifikasi sentimen dan sumber editorial diperlukan untuk mencegah bias.[^3] Untuk trends, sifat indeks relatif (bukan volume absolut) menuntut cuidado dalam normalisasi dan interpretasi.[^5]



## Trend Analysis Tools (Real-Time Narrative Trends)

Tools pelacak narasi menawarkan “command center” untuk memantau sektor tematik, lonjakan atenção, dan rotasi modal antar-kategori. Di sini, pelacak narasi berbasis kinerja sektor dan metrik sosial real-time menjadi kompas operasional.

Tabel 4. Ringkasan tools: metrics, coverage, timeframes, model analitik, API
| Platform | Metrics Inti | Coverage | Timeframes | Model/Analitik | API |
|---|---|---|---|---|---|
| Sharpe.ai Narratives | Harga, volume, mcap, metrik sosial | 17+ narasi | 24h–1y | Real-time analytics, AI insights | N/A (gratis untuk tracker)[^6] |
| DefiLlama Narrative Tracker | Performance kategori tertimbang mcap | Beragam kategori | 7D–365D | Weighted by mcap; charts/heatmap | N/A (web app)[^7] |
| LunarCrush | AltRank, Galaxy Score, social metrics | Multi-platform | Real-time | AI-driven insights, alerts | Public API tersedia[^1] |

Tabel 5. Contoh performa kategori (snapshot DefiLlama)
| Timeframe | Top Category | Δ% | Market Cap | Volume 24h | #Coins |
|---|---|---|---|---|---|
| 7D | Prediction Markets | +119% | $2.488b | $57.91m | 67 |
Sumber: DefiLlama Narrative Tracker (snapshot publik).[^7]

Tabel 6. Horizon dan use-case per alat
| Horizon | Sharpe.ai | DefiLlama | LunarCrush |
|---|---|---|---|
| Intraday | Good (indikatif) | Kurang ideal | Excellent (social real-time) |
| Swing | Excellent | Excellent | Excellent |
| Posisi | Excellent | Good | Good |

Sharpening insight, narasi yang sedang bergulir—misalnya AI Agents, DeFi, RWA, GameFi—dapat dipantau lintas kinerja harga dan metrik sosial, membantu trader menangkap rotasi sektor sebelum mainstream.[^6] Di sisi lain, metode pembobotan kapitalisasi pasar pada DefiLlama menyajikan evaluasi “sekilas” performa kategori; namun untuk trigger aksi, tetap memerlukan konfirmasi sosial dan on-chain. LunarCrush berfungsi sebagai radar sosial real-time untuk mendeteksi lonjakan mention dan aktivitas kreator baru yang sering mendahului pergerakan harga signifikan.[^1]



### Sharpe.ai Narratives
Menyediakan analitik kinerja sektor real-time dan metrik sosial pada 17+ narasi; cocok untuk mengidentifikasi rotasi sektor, melakukan screening narasi, dan membangun watchlist tematik yang selaras dengan momentum.[^6]

### DefiLlama Narrative Tracker
Menampilkan performa kategori tertimbang kapitalisasi pasar (MCap-Weighted) dalam berbagai denominasi; efektif untuk “heads-up” perubahan preferensi modal di level sektor. Namun, sebagai indikator sentral untuk entry, sinyal Sosial dan News tetap diperlukan untuk konfirmasi.[^7]

### LunarCrush
Platform intelijen sosial real-time yang mengagregasi multi-sumber, memfilter miliaran titik data, serta memberi alerta untuk aktivitas tidak biasa. Metrik AltRank dan Galaxy Score membantu menyorot aset whose social attention outpaces performance—or vice versa.[^1]



## Keyword Tracking untuk Crypto Narratives

Rancangan kamus kata kunci merupakan tulang punggung deteksi awal. Ia harus ekspresif menangkap variasi ejaan, singkatan, kosakata komunitas, serta entitas. Di sisi operasional, pipeline ingestion mengutamakan real-time mention tracking dengan deduplication dan spam filtering. Untuk sentiment-based keyword scoring, kanal berita dengan sentimen terstruktur dan sosial berbasis model domain-specific saling memperkaya.

Tabel 7. Kamus kata kunci contoh per narasi (contoh/non-ekshaustif)
| Narrative | Aliases/Acronyms | Related Entities | Example Tokens |
|---|---|---|---|
| AI Agents / DeFAI | “AI Agent”, “Agentic AI”, “DeFAI” | Fetch (FET), SingularityNET (AGIX), Ocean (OCEAN) | FET, AGIX, OCEAN |
| DePIN | “Decentralized Physical Infra” | Helium, Filecoin, Render | HNT, FIL, RNDR |
| GameFi | “Gaming”, “Play-to-Earn” | Immutable, Sky Mavis, Epic Games | IMX, AXS |
| RWA | “Real-World Assets”, “On-chain RWAs” | Centrifuge, Maker RWA | CFG |
| L2 | “Layer-2”, “Rollups” | Arbitrum, Optimism | ARB, OP |
| Meme | “Meme coin”, “Community token” | Dogecoin, Shiba | DOGE, SHIB |
| Oracles | “Price Oracle” | Chainlink, Band Protocol | LINK, BAND |
| Privacy | “Privacy coin”, “ZK” | Monero, Zcash, Polygon Nightfall | XMR, ZEC |
| DeFi | “DEX”, “Lending”, “Liquidity” | Uniswap, Aave, Compound | UNI, AAVE, COMP |
| L1 | “Layer-1” | Ethereum, Solana, Avalanche | ETH, SOL, AVAX |

Tabel 8. Desain skema tag narasi
| Field | Deskripsi |
|---|---|
| Narrative | Nama narasi utama (mis. AI Agents) |
| Synonyms/Acronyms | Variant ejaan/singkat (mis. DeFAI) |
| Related Entities | Proyek/KOL/Term relevan |
| Example Tokens | Token terkait inti |
| Confidence Keywords | Kata kunci dengan bobot lebih tinggi |
| Negative/Noise Terms | Kata yang diskualifikasi (避免 noise) |

Pipeline ingestion dapat dibangun dengan aliran data kustom berbasis istilah/ticker dari platform intelijen sosial,[^1] serta disandingkan dengan API berita kripto untuk mendapat sinyal sentimen berbasis berita lintas sumber.[^3] Normalisasi lintas platform, deduplikasi, dan spam filtering wajib untuk menjaga integritas skor sentiment dan mention velocity. Model domain seperti CryptoBERT—yang dilatih pada data sosial kripto besar—dapat meningkatkan akurasi klasifikasi sentimen dibanding model umum.[^9]



### Sosial & Platform Sosial
Pencarian tren sosial, alerta kustom, serta penyaringan noise memungkinkan deteksi momentum awal pada kosakata komunitas dan slang yang spesifik domain. Metrik AltRank/Galaxy Score mengindikasikan aset yang mendapat perhatian tidak proporsional—baik maupun buruk—terhadap harga pasar, útil untuk konfirmasi kata kunci yang “menghangat”.[^1]

### API Berita dengan Sentimen
Analisis sentimen berita menyediakan lapisan validasi top-down. Endpoint artikel terbaru, pencarian, dan kategori pada API berita kripto memudahkan agregasi konten yang relevan kata kunci, sementara skor sentimen membantu menandai拐点 (pergantian arah) narasi di media. Perlu dicermati cakupan historis dan metodologi sentimen pada masing-masing API vendor.[^3]



## Social Mention Tracking & Sentiment

Dukungan platform dan metrik menjadi penentu efektivitas deteksi momentum narasi. Kami membandingkan cakupan, API, metrik, real-time, historis, dan lisensi dari platform sosial kripto utama.

Tabel 9. Perbandingan platform sosial kripto
| Platform | Platform Tercakup | API | Metrik | Real-time | Historis | Lisensi |
|---|---|---|---|---|---|---|
| LunarCrush | X, YouTube, Reddit, TikTok, berita | Ya (public endpoints) | AltRank, Galaxy, social metrics | Ya | Ya | Komersial[^1] |
| The Tie | Sosial kripto (utama X) | Ya | Raw volume + sentimen (raw/normalized) | Ya | Sejak 2017 | Komersial[^4] |
| Santiment | Sosial, on-chain, dev | Ya (SanAPI) | 1100+ metrik across sosial/on-chain/dev | Ya | Panjang (collect sejak 2009) | Komersial[^2] |
| Augmento | Sosial | API/stream | Sentimen multi-dimensi (institusional) | Variatif | Variatif | Komersial[^8] |
| TweetScout | X | Custom API | Skor akun, deteksi bot, VC/KOL radar | Hampir real-time | Rolling | Komersial[^7] |
| ZENPULSAR | Twitter | API | Time-series sentiment | Batch/stream | Variatif | Komersial[^10] |

Tabel 10. Contoh endpoint dan field metrik (ilustratif)
| Platform | Endpoint/Metode | Field Metrik Utama | Frekuensi |
|---|---|---|---|
| LunarCrush | Public coins list; Overview API | Mention count, AltRank, Galaxy Score | Real-time[^1] |
| The Tie | Sentiment API | Volume, unique accounts, sentiment raw/normalized, berbagai lookback | Real-time & historis[^4] |
| Santiment | SanAPI | Sociales, dev, on-chain (stakeholder metrics) | Real-time[^2] |
| CoinDesk News | Latest/Search/Article | Judul, sumber, kategori; sentimen artikel (NEUTRAL/POSITIVE/NEGATIVE) | Real-time[^3] |

Interpretasi: Kombinasi The Tie (data historis panjang untuk backtest), LunarCrush (real-time dengan alerta dan metrik propietari), Santiment (lapisan on-chain & dev), dan TweetScout (kualitas akun, bot, VC/KOL radar) memberi cakupan menyeluruh. Augmento dan ZENPULSAR berguna sebagai pelengkap untuk mendapatkan dimensi sentimen tambahan atau deret waktu khusus.



### LunarCrush
Alat filtrasi sosial, metrik propietari, dan alerte real-time; cocok untuk mendeteksi momentum awal dan perubahan share-of-voice antar narasi dengan dukungan multi-platform.[^1]

### The Tie
Data sosial historis sejak 2017, cocok untuk backtest model momentum; menyediakan metrik volume dan sentimen (mentah dan ternormalisasi) yang fleksibel untuk strategi frekuensi tinggi maupun jangka panjang.[^4]

### Santiment
Menyatukan sosial, on-chain, dan dev analytics; whale monitoring dan analisis perilaku memperkuat konfirmasi narasi yang sedang accelerate atau rotate.[^2]

### Augmento
Sentimen multi-dimensi yang menangkap spektrum psikologi crowd; berguna untuk menambah kedalaman faktor sentimen beyond binary polarity.[^8]

### TweetScout
Skor akun, deteksi bot, serta VC/KOL radar; membantu membedakan noise dari perhatian otentik dan mengidentifikasi sinyal dini dari ekosistem VC.[^7]

### ZENPULSAR
API dataset time-series sentimen dari platform sosial; cocok untuk studi jangka panjang dan agregasi khusus aset/kategori.[^10]



## Google Trends Integration

Google Trends API (alpha) menyediakan akses terprogram terhadap minat pencarian yang diskalakan secara konsisten dalam periode ~1800 hari (sekitar lima tahun) hingga dua hari lalu, dengan agregasi harian, mingguan, bulanan, dan tahunan; mendukung pembatasan geografis (ISO 3166-2). Ia memungkinkan perbandingan banyak istilah (lebih fleksibel dari antarmuka web), dan skala yang konsisten antar permintaan—membuat penggabungan sinyalsearch menjadi lebih legitimate dalam pipeline narasi.[^5]

Tabel 11. Parameter kunci Trends API dan opsi integrasi pipeline
| Parameter | Deskripsi | Nilai/Contoh |
|---|---|---|
| Timeframe | Rentang data | Hingga ~1800 hari, hingga “2 hari lalu” |
| Geo | Wilayah/sub-wilayah | ISO 3166-2 |
| Agregasi | Skala waktu | Harian, mingguan, bulanan, tahunan |
| Skala | Sifat indeks | Konsisten antar permintaan (indeks relatif) |
| Istilah | Banyak istilah | Puluhan istilah per permintaan |
| Sampling | Pengambilan | Variatif (disesuaikan API) |

Interpretasi: Karena bersifat indeks relatif, Trends perlu dinormalisasi dan diinterpretasikan sebagai proxy perhatian publik, bukan volume pencarian absolut. Gunakan rolling window yang sesuai horizon dan padukan dengan sinyal sosial/berita/on-chain untuk konfirmasi. Akses saat ini terbatas (alpha); rencana kontinjensi perlu disiapkan (misalnya, scraping yang compliant via vendor terverifikasi).



## News Aggregation APIs

Ber扮演 peran penting dalam “pembingkaian” narasi.API berita kripto memungkinkan ingestion real-time, pencarian, dan—penting—skor sentimen artikel.

Tabel 12. Perbandingan News APIs
| API | Cakupan | Sentimen | Real-time | Historis | Rate Limit/Notes |
|---|---|---|---|---|---|
| CoinDesk Data API | Berita kripto terkurasi | NEUTRAL/POSITIVE/NEGATIVE (via model) | Ya | Tidak eksplisit (skala besar) | Endpoint latest, search, article, sources[^3] |
| NewsData.io | Global multi-sumber & multi-bahasa | Ya | Ya | ~7+ tahun | Free to start[^16] |
| NewsAPI.ai | Global real-time | Ya | Ya | Historis (vendor-specified) | Advanced filtering[^17] |
| Apify Crypto News | Scraping multi-sumber | Opsional (via pipeline) | Quasi | Tergantung sumber | Actor/scraper[^18] |
| Finnhub (news-sentiment) | Fokus perusahaan AS (berita) | bullish/bearish %, buzz | Ya | 1 th berita (umum) | Rate limit 30 rps; premium[^14] |

Interpretasi: Untuk kebutuhan kripto spesifik, CoinDesk dan Apify unggul pada relevansi domain. NewsData.io dan NewsAPI.ai memberikan широта coverage dan fitur filtering yang berguna untuk konfirmasi mainstream. Finnhub berguna untuk konteks keuangan umum (AS), namun cakupan kripto terbatas (berita perusahaan), dan endpoint news-sentiment memerlukan akses premium.[^14]



## Influencer Activity Tracking (KOL/VC)

Kredibilitas akun dan aktivitas KOL/VC memengaruhi kecepatan dan arah perhatian. Skor pengaruh—yang mempertimbangkan siapa yang mengikuti akun (tokoh kripto, proyek, karyawan dana)—membantu menilai dampak potensial sebuah narasi.

Tabel 13. Metrik influencer & cara pengukuran
| Metrik | Sumber | Frekuensi | Penafsiran |
|---|---|---|---|
| Skor influence (TweetScout Score) | X/Twitter via TweetScout | Harian–real-time | Kredibilitas & koneksi ke KOL/VC[^7] |
| Aktivitas VC radar | X/Twitter | Harian | Minat dana sebelum pengumuman pendanaan[^7] |
| Kualitas komunitas | X/Twitter | Harian | Distinguishing bot vs engagement otentik[^7] |
| Deteksi bot | X/Twitter | Harian | Mengurangi false signal[^7] |
| Peningkatan mention/engagement | Sosial agregat | Real-time | Leading indicator perhatian[^1] |

Interpretasi: Kombinasi skor akun, deteksi bot, dan “VC radar” memberi peta influence yang lebih tajam. Alert perubahan mendadak (lonjakan mention/engagement dari akun berkualitas tinggi) menjadi konfirmasi momentum narasi tahap akselerasi.[^1][^7]



## Market Narrative Cycle Detection Methods

Deteksi siklus narasi membutuhkan pengukuran momentum lintas sumber, analisis kausalitas dan spillover, serta pembobotan berdasarkan kapitalisasi/likuiditas. Bukti akademis menunjukkan hubungan dinamis sentimen–volatilitas, pengaruh whale, dan peran berita mainstream. Kerangka multimodal menunjukkan sentimen video cenderung memengaruhi jangka pendek aset spekulatif, sementara teks lebih selaras jangka panjang.

Tabel 14. Ringkasan literatur kunci
| Studi | Temuan Utama | Period | Implikasi untuk Momentum |
|---|---|---|---|
| Social media sentiment, volatility, and whales | Sentimen memengaruhi volatilitan jangka pendek–panjang; whale berperan dalam transmisi guncangan | 2025 | Sertakan whale flow & sentimen sosial untuk konfirmasi[^11] |
| Impact of news media on Bitcoin prices | Berita memengaruhi harga melalui kategorisasi wacana | 2022/2023 | Perkuat narasi dengan news sentiment untuk konfirmasi[^12] |
| Causal inference narratives & prices | Narrative → harga (kausal) | 2019 | Validasi kausal lintas sumber untuk avoid spurious[^13] |
| Multimodal (TikTok vs Twitter) | Video (TikTok) lebih jangka pendek; teks (Twitter) lebih jangka panjang; integrasi menaikkan akurasi | 2025 | Gabungkan sinyal multimodal untuk performa prediksi[^15] |

Tabel 15. Indikator momentum dan horizon deteksi
| Indikator | Timeframe Optimal | Catatan |
|---|---|---|
| Mention velocity (sosial) | Menit–jam | Leading, gunakan filter kualitas |
| Share-of-voice narasi | Jam–hari | Konfirmasi pergeseran perhatian |
| News sentiment shift | Jam–hari | Validasi top-down |
| Search interest (Trends) | Hari–minggu | Sinyal luas Publik |
| Whale flow (on-chain) | Jam–hari | Dampak order flow |
| Dev activity (release/commit) | Hari–minggu | Konfirmasi fundamental (lag lebih panjang) |

Interpretasi: Konfluensi sinyal sosial–Trends–berita–on-chain memberikan robustness tertinggi. Metode spillover dan rolling window correlation berguna untuk mengenali fase rotasi dan peak. Di aset yang sangat spekulatif, sinyal video singkat (TikTok) mempercepat deteksi拐点, namun perlu kontrol noise tinggi.[^15]



## AI/ML Tools untuk Pattern Recognition dalam Crypto Narratives

Model domain-specific dan multimodal unggul dalam menambang sinyal narasi yang sarat konteks dan slang. CryptoBERT—dibangun di atas BERTweet dan dilatih pada >3,2 juta posting unik— mengklasifikasikan sentimen Bullish/Neutral/Bearish dengan akurasi tinggi dan efisiensi komputasi; ia mampu memproses beberapa sumber sosial (StockTwits, Telegram, Reddit, Twitter).[^9] Di sisi multimodal, studi terbaru menunjukkan bahwa menggabungkan sentimen TikTok (video) dan Twitter (teks) meningkatkan akurasi prakiraan hingga 20%; efek spillover dan ketergantungan dinamis terukur.[^15] Pada data finansial dan berita perusahaan, metodologi leksikon seperti Loughran–McDonald (LM) word lists menyediakan baseline teruji untuk sentimen tekstual yang dapat diadaptasi ke konteks crypto/berita.[^14]

Tabel 16. Perbandingan model/alat AI
| Model/Alat | Domain | Data Latih | Label | Kecepatan | Akurasi (indikatif) | Keterbatasan |
|---|---|---|---|---|---|---|
| CryptoBERT | Sosial kripto | >3,2 juta posting | Bullish/Neutral/Bearish | Sangat cepat | Tinggi (domain-specific) | Max token ~128–514; bias domain[^9] |
| Multimodal LLM (TikTok+Twitter) | Video+teks | Data multi-platform | Skor multi-label | Sedang–berat | +20% vs single modality (global) | Kompleksitas pipeline; data video lebih pendek horizon[^15] |
| LM Sentiment (berita/10-K) | Teks finansial/berita | Leksikon | Positif/negatif/uncertainty, dll. | Cepat | Stabil (benchmark akademis) | Tidak menangkap nuansa slang kripto[^14] |

Tabel 17. Desain pipeline NLP untuk narasi kripto
| Tahap | Input | Model/Metode | Output |
|---|---|---|---|
| Ingestion | Post/berita/komentar | Streaming API | Raw corpus |
| Preprocessing | Teks | Clean, dedupe, normalization | Teks bersih |
| Detection | Kamus narasi | Dictionary + fuzzy match | Narrative tags |
| Sentiment | Teks (sosial/berita) | CryptoBERT / LM | Sentiment score |
| Topic | Teks | LDA / embedding | Topic distribution |
| Fusion | Multi-sinyal | Weighted scoring, rules | Narrative momentum index |
| Forecast | Time series | MOMENT / transformer | Prediksi arah/amplitude |
| Explainability | SHAP/attribution | — | Driver analysis |

Interpretasi: pipeline ini menggabungkan kecepatan dan akurasi CryptoBERT untuk sosial, kedalaman leksikon LM untuk berita, serta model multimodal untuk menangkap spillover antar platform. fusion layer menautkan sinyal sosial–Trends–berita–on-chain menjadi indeks momentum narasi yang explainable.[^9][^14][^15]



## Arsitektur Integrasi & Pipeline Data untuk Kalsh

Arsitektur referensi meliputi ingestion (API/webhooks/streaming), storage (time-series + document), processing (ETL, enrichments, sentiment, topic modeling), modeling (momentum scoring + konfluensi), alerting (live triggers), dan delivery (card UI). Prioritas vendor disusun untuk mencapai coverage tinggi dengan latency rendah, sekaligus menjaga TCO.

Tabel 18. Pemetaan vendor → endpoint → metrik → frekuensi → lisensi → cost-notes
| Vendor | Endpoint/Metode | Metrik Kunci | Frekuensi | Lisensi | Cost Notes |
|---|---|---|---|---|---|
| LunarCrush | Public API; coins list | AltRank, Galaxy, mention, social alerts | Real-time | Komersial | Volume-based pricing (vendor)[^1] |
| The Tie | Sentiment API | Volume, unique accounts, sentiment (raw/normalized) | Real-time + historis | Komersial | Historis sejak 2017 (premium)[^4] |
| Santiment | SanAPI | Sosial, on-chain, dev, alerts | Real-time | Komersial | Paket (tier) |
| CoinDesk News | Latest/Search/Article | Artikel + sentimen | Real-time | Komersial | —[^3] |
| NewsData.io | News API | Judul, deskripsi, sentimen | Real-time | Komersial | Free to start[^16] |
| NewsAPI.ai | News API | Filter lanjutan + sentimen | Real-time | Komersial | —[^17] |
| Apify | Crypto News Scraper | Multi-sumber | Quasi real-time | Komersial | Scrape-based[^18] |
| Google Trends | Trends API (alpha) | Indeks minat | Harian–tahunan | Alpha | Akses terbatas[^5] |
| TweetScout | Custom API | Skor akun, deteksi bot, VC radar | Hampir real-time | Komersial | —[^7] |

Tabel 19. Checklist integrasi dan kualitas data
| Area | Item | Status/Praktik |
|---|---|---|
| Auth | API key, secrets | Rotasi berkala |
| Quota | Rate limit, burst | Backoff, queue |
| Normalization | z-score, min-max | per-sinyal & per-platform |
| Noise | Dedupe, spam filter | Model kualitas akun |
| Enrichment | Sentiment, topic | CryptoBERT/LM |
| Latency | Streaming vs batch | SLA real-time untuk social |
| Monitoring | Health, missing data | Alerting engineer |
| Compliance | ToS, privacy | Audit vendor |

Interpretasi: kombinasi LunarCrush (radar sosial real-time), The Tie (backtest historis sosial), Santiment (on-chain & dev), Google Trends (proxy permintaan publik), serta News APIs (top-down validation) menciptakan sistem yang tahan terhadap noise dan bias tunggal. Vendor selection memprioritaskan data point-in-time dan coverage luas, sembari menjaga biaya melalui batching dan caching.



## Strategi Scoring & Confidence: Konfluensi Multi-Sinyal

Skema confidence scoring menggabungkan bobot dinamis per sinyal (mention velocity, sentiment, search interest, SoV kategori, whale flow, news sentiment). Aturan transisi status: Emerging → Accelerating → Peaking → Rotating → Decay, setiapstatus memiliki konfirmasi minimal dua sinyal independen dan penalti jika sinyal kontradiktif (mis. sentiment negatif pada news namun sosial positif; atau search interest menurun saat SoV meningkat).

Tabel 20. Skor konfluensi (contoh struktur)
| Komponen | Weight (awal) | Justifikasi | Catatan |
|---|---|---|---|
| Mention velocity | 20% | Leading indicator | Penalti jika spike dari akun bermutu rendah |
| Sentiment (sosial) | 20% | Konfirmasi momentum | Gunakan CryptoBERT untuk stabilitas[^9] |
| Share-of-voice | 15% | Pergeseran perhatian | Agregasi lintas platform |
| News sentiment | 15% | Validasi top-down | API berita domain-spesifik[^3] |
| Search interest | 10% | Minat publik | Normalisasi indeks (Trends)[^5] |
| Whale flow | 15% | Dampak order flow | Label kualitas alamat (Santiment)[^2] |
| Dev activity | 5% | Konfirmasi fundamental | Horizon lebih panjang |

Aturan transisi: 
- Emerging → Accelerating bila mention velocity dan SoV naik, konfirmasi sentiment, dan search interest mulai ikuti.
- Accelerating → Peaking bila whale flow memperkuat serta news sentiment konsisten.
- Peaking → Rotating bila SoV bergeser dan search interest turun relatif terhadap narasi lain.
- Rotating → Decay bila seluruh komponen melemah.

Interpretasi: skema ini menyeimbangkan lead (sosial, search) dan konfirmasi (whale, news). Bobot awal dapat di-tune via backtest point-in-time (The Tie) dan di.Cross-validate dengan bukti kausal narasi–harga.[^4][^13]



## Rencana Evaluasi & Backtesting

Desain backtest point-in-time menggunakan data historis sosial (2017–sekarang) dan berita real-time, dengan walk-forward validation untuk menguji robustness parameter. Horizon evaluasi intraday, swing, dan posisi disesuaikan dengan karakter sinyal.

Tabel 21. Desain eksperimen
| Horizon | Sinyal | Parameter | Metrik Evaluasi | Dataset |
|---|---|---|---|---|
| Intraday (menit–jam) | Social velocity, news sentiment | Window 15–60 menit | Precision/recall alert, ROC | Sosial (The Tie), News (CoinDesk) |
| Swing (hari–minggu) | SoV, Trends, sentiment | Window 7–30 hari | Hit rate, PnL, drawdown | Sosial (LunarCrush/Santiment), Trends |
| Posisi (minggu–bulan) | Whale flow, dev activity | Window 30–90 hari | Sharpe, turnover | On-chain (Santiment), Dev |

Interpretasi: backtest harus mencegah look-ahead bias dan leakage, memanfaatkan data point-in-time The Tie untuk validasi out-of-sample.[^4] Hasil harus dianalisis per aset/narasi untuk menghindari confounding. Literature multimodal memberi arahan untuk menggabungkan sinyal lintas platform secara efektif.[^15]



## Risk, Compliance, & Kualitas Data

Risiko utama meliputi bias platform, manipulasi (bot, pump-and-dump), privasi/pemrosesan data, dan ketergantungan vendor. Kualitas bergantung pada konsistensi istilah (untuk Trends), deduplikasi konten, dan normalisasi.

Tabel 22. Matriks risk & mitigasi
| Risk | Dampak | Mitigasi |
|---|---|---|
| Bot/Troll | False positive momentum | Skor kualitas akun, deteksi bot (TweetScout), filter spam[^7] |
| Bias platform | Skew narasi | Agregasi multi-platform & pembobotan |
| Noise/duplikasi | Over-counting | Deduplication, canonical URL |
| ToS/API | Akses terputus | Multi-vendor, caching, kontrak SLA |
| Rate limit | Data hilang | Backoff, queue, budget quota |
| Skala Trends | Interpretasi salah | Edukasi pengguna & normalisasi[^5] |
| Labeling on-chain | Whale misslabel | Ensemble labeling, heuristik |
| Data ownership | Lisensi | Review ToS, audit vendor |

Interpretasi: mitigasi berpusat pada diversifikasi sumber, pembobotan kualitas akun, dan disiplin operasional (monitoring, SLA, backoff). Literasi tentang sifat indeks Trends penting agar tim lintas fungsi tidak overinterpretasi.[^5]



## Roadmap Implementasi & Rekomendasi Vendor

Fase implementasi bertahap memastikan“快 (cepatnya)”, sekaligus menjaga kualitas data dan model.

Tabel 23. Roadmap fase → deliverables → target KPI → dependensi → risk
| Fase | Deliverables | KPI Target | Dependensi | Risk |
|---|---|---|---|---|
| MVP (8–12 minggu) | Ingest sosial (LunarCrush), News (CoinDesk), Score basic | Precision alert >60%; latency <5 menit | Akses API, infra streaming | Rate limit, coverage |
| V1 (12–16 minggu) | Trends API (alpha), Santiment on-chain, The Tie backtest | Hit rate +10–15%; drawdown turun | Akses alpha, historis | Akses terbatas alpha |
| V2 (16–24 minggu) | Influencer/KOL (TweetScout), AI/ML (CryptoBERT + multimodal) | Akurasi +10–20%; konfluensi stabil | Data pipeline multimodal | Kompleksitas model |
| V3 (24+ minggu) | Personalization, confidence, automasi trigger | Konsistensi insights, user retention | UX/UI & infra | Alert fatigue |

Interpretasi: MVP memfokuskan pada kecepatan dan relevansi menggunakan radar sosial dan berita. V1 menghadirkan konfirmasi search dan on-chain untuk meningkatkan akurasi. V2 menambah dimensi influence dan model domain/multimodal. V3 menambatkan ke nilai bisnis melalui personalisasi, confidence yang解释able, dan otomasi alert.[^1][^3][^5]



## Lampiran: Contoh Kamus Kata Kunci & Endpoint

Tabel 24. Contoh keyword list per narasi (ringkas)
| Narrative | Keywords (contoh) |
|---|---|
| AI Agents/DeFAI | “AI agent”, “agentic”, “DeFAI”, “autonomous agent” |
| DePIN | “DePIN”, “decentralized physical infrastructure”, “physical layer” |
| GameFi | “GameFi”, “play-to-earn”, “gaming token” |
| RWA | “RWA”, “real-world assets on-chain”, “tokenized RWAs” |
| L2 | “L2”, “layer 2”, “rollups”, “optimistic”, “zk rollup” |
| Meme | “meme”, “memecoin”, “community coin” |
| Oracles | “oracle”, “price feed”, “data availability” |
| Privacy | “privacy coin”, “ZK”, “zero-knowledge” |
| DeFi | “DeFi”, “DEX”, “liquidity”, “lending”, “yield” |
| L1 | “L1”, “layer 1”, “base chain” |

Tabel 25. Cheatsheet endpoint per vendor (ringkas)
| Vendor | Endpoint/Metode | Deskripsi | Notes |
|---|---|---|---|
| LunarCrush | Public coins list; Overview | Aset paling disebutkan; metrik sosial | Real-time[^1] |
| The Tie | Sentiment API | Volume & sentiment historis | Backtest sejak 2017[^4] |
| Santiment | SanAPI | Sosial, on-chain, dev | Alerts & dashboards[^2] |
| CoinDesk News | Latest/Search/Article | Artikel berita kripto + sentimen | Real-time[^3] |
| Google Trends | Trends API (alpha) | Indeks pencarian | Skala konsisten[^5] |

Kamus istilah:
- Mention velocity: tingkat perubahan penyebutan per unit waktu.
- Share-of-voice: pangsa pembicaraan yang diterima oleh satu narasi relatif terhadap narasi lain.
- AltRank/Galaxy Score: metrik propietari yang menggabungkan perhatian sosial dan kinerja pasar untuk mengurutkan aset menurut daya tarik relative.
- Konfluensi: kondisi di mana beberapa sinyal independen (sosial, Trends, berita, on-chain) selaras memperkuat kesimpulan.



## Catatan Keterbatasan Informasi (Information Gaps)

- Akses Google Trends API saat ini berada pada tahap alpha dengan cakupan terbatas; jadwal ketersediaan publik dan kuota belum jelas.[^5]
- Detail pricing dan tiers untuk beberapa platform (mis. LunarCrush, The Tie, Augmento, TweetScout) tidak tersedia pada sumber yang diekstrak.
- Cakupan historis granular untuk sentiment berita (CoinDesk dan lainnya) tidak disebutkan secara eksplisit.
- Metodologi lengkap untuk sentiment Finnhub (news-sentiment) tidak dirinci secara teknis dalam sumber.
- Deteksi influencer lintas platform di luar X/Twitter (YouTube, Telegram, Discord) memerlukan verifikasi cakupan spesifik vendor.
- Datasets on-chain untuk whale labeling dan overlap dengan sosial memiliki gap dokumentasi di luar contoh Santiment.
- Estimasi biaya total (TCO) untuk kombinasi multi-vendor serta dampak rate limits terhadap biaya operasional belum tersedia.



## Referensi

[^1]: LunarCrush – Real-Time Social & Market Intelligence Powered by AI. https://lunarcrush.com/
[^2]: Santiment – Crypto Research, Data, Tools (Behavioral Analytics). https://santiment.net/
[^3]: News | CoinDesk Cryptocurrency Data API. https://developers.coindesk.com/documentation/data-api/news
[^4]: Sentiment API – The Tie. https://www.thetie.io/solutions/sentiment-api/
[^5]: Introducing the Google Trends API (alpha). https://developers.google.com/search/blog/2025/07/trends-api
[^6]: Crypto Narratives Tracker – Sharpe.ai. https://sharpe.ai/narratives
[^7]: Narrative Tracker – DefiLlama. https://defillama.com/narrative-tracker
[^8]: Augmento: Predictive Sentiment Data for Bitcoin and Crypto. https://www.augmento.ai/
[^9]: CryptoBERT – Dataloop AI Model. https://dataloop.ai/library/model/elkulako_cryptobert/
[^10]: ZENPULSAR Social Media Sentiment API Datasets. https://zenpulsar.com/news/zenpulsar-social-media-sentiment-api-datasets-crypto-stocks
[^11]: Social media sentiment, volatility, and whales in cryptocurrency markets. https://www.sciencedirect.com/science/article/pii/S0890838925001325
[^12]: The impact of news media on Bitcoin prices: modelling data driven perspectives. https://royalsocietypublishing.org/doi/10.1098/rsos.220276
[^13]: Causal inference between cryptocurrency narratives and prices. https://www.bde.es/f/webpi/SES/staff/azquetaandres/1-s2.0-S0378437119314736-main.pdf
[^14]: News Sentiment – Finnhub API. https://finnhub.io/docs/api/news-sentiment
[^15]: Enhancing Cryptocurrency Sentiment Analysis with Multimodal Features (arXiv:2508.15825v1). https://arxiv.org/html/2508.15825v1
[^16]: NewsData.io: Best News API for Real-Time & Historical News. https://newsdata.io/
[^17]: NewsAPI.ai | Real-Time News API. https://newsapi.ai/
[^18]: Crypto News Api – Apify. https://apify.com/apipi/crypto-news-scraper