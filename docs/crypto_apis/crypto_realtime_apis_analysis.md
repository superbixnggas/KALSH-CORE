# Analisis API Crypto Real-Time: Price, On-Chain, Market & Whale Tracking (2025)

## Ringkasan Eksekutif

Kebutuhan data kripto real-time telah bergeser dari “nice-to-have” menjadi infrastruktur inti untuk produk financiera, algoritma trading, analitik on-chain, dan deteksi whale. Laporan ini menyintesis temuan tentang penyedia API price data (CoinGecko, CoinMarketCap, Binance), API on-chain (Etherscan, Moralis, Alchemy, Infura), serta solusi whale/smart money (Whale Alert, CryptoQuant, Bitquery), beserta kemampuan streaming, struktur harga, rate limits, cakupan jaringan, dan aspek lisensi.

Secara umum, untuk price data yang luas dengan opsi real-time, CoinGecko dan CoinMarketCap (CMC) merupakan dua pilar utama. CoinGecko menawarkan rate limit tinggi dan WebSocket berbayar yang memadai untuk streaming harga dan OHLCV, sedangkan CMC unggul pada desain rate limit berbasis “credits” dan cakupan kategori data (DEX, indeks, fiat), namun tidak menyediakan WebSocket; integrasi yang membutuhkan streaming harus melengkapi dengan bursa atau penyedia lain.[^1][^4][^6][^8][^9] Pada sisi on-chain, Etherscan menyatukan akses multi-EVM chain (60+) di bawah satu kunci API, sementara Alchemy dan Infura menghadirkan RPC/enhanced APIs dengan kuota berbasis Compute Unit (Alchemy) dan kredit/harian (Infura), cocok untuk beban kerja intensif dan pipeline data skala produksi.[^10][^11][^12][^13][^18][^19] Untuk whale tracking, kombinasi Whale Alert (alert real-time), CryptoQuant (metrik siap pakai dan label entitas), dan Bitquery (GraphQL fleksibel untuk kueri whale secara real-time/historis) memberikan Coverage–Latency–Cost trade-off yang saling melengkapi.[^20][^21][^22][^23]

Untuk membantu pengambilan keputusan, matriks berikut memetakan use-case prioritas terhadap stack API yang disarankan.

Tabel 1. Matriks singkat “Use-case vs Stack API Rekomendasi”

| Use-case Prioritas | Price Data | On-chain Data | Whale/Smart Money | Catatan Utama |
|---|---|---|---|---|
| Trading/Price Streaming (produkbeli) | CoinGecko WebSocket (Analyst+) atau bursa (Binance WS) | Alchemy (Prices API, Webhooks) | Opsional: Whale Alert | WebSocket CG untuk simbol luas; Binance WS untuk order book/latensi sangat rendah.[^1][^6][^14] |
| Analitik Portofolio & Token | CoinGecko (REST) | Alchemy (Token/Transfers), Infura (credits/harian) | CryptoQuant (holder analytics) | Pertimbangkan Alchemy CU dan Infura kredit untuk throughput tinggi.[^6][^13][^18][^19] |
| Whale Alerts | CoinGecko (harga referensi) | Etherscan (balances/logs) | Whale Alert | Alert harian hingga 1000, filter kustom, 100 aset.[^10][^20] |
| DEX Analytics | CoinGecko (DEX on-chain), CMC DEX suite (bagian dari offerings) | Etherscan (logs/transfers), Bitquery (DEXTrades) | Bitquery (GraphQL) | CG menyediakan data DEX lintas 250+ jaringan; Bitquery ideal untuk kueri spesifik whale DEX.[^4][^22][^23] |
| Backtesting & Research | CoinGecko (historis 10+ tahun), CMC (historis & indeks) | Alchemy (Full Archive), Infura (Archive) | CryptoQuant (export API) | Kombinasi REST historis + cache; gunakan storage internal untuk efisiensi.[^6][^8][^18][^19] |

Implikasi biaya dan lisensi bervariasi. CoinGecko menetapkan overage billing ($/call) dan memerlukan atribusi untuk tier tertentu; CMC berbasis credits per call dan reset periodik; Alchemy menawarkan harga per 1M CU; Infura membatasi harian kredit dan throughput; Whale Alert memiliki paket berbayar dengan limitasi alerts; CryptoQuant dan Bitquery menawarkan akses API, namun rincian harga Bitquery tidak sepenuhnya terlihat dan CryptoQuant tidak menampilkan kuota/harga eksplisit di ringkasan publik yang tersedia (informasi rinci perlu rujukan langsung ke dokumentasi masing-masing).[^7][^9][^13][^18][^20][^21]

Rekomendasi akhir: 
- MVP dengan biaya terkontrol: CoinGecko Basic/Analyst untuk price; Alchemy Free/PAYG untuk on-chain; Whale Alert untuk alert.
- Production-grade throughput: CoinGecko Analyst/Lite + Alchemy PAYG/Enterprise atau Infura Developer/Team sesuai beban; tambah CryptoQuant untuk label entitas dan metrik siap pakai; Bitquery untuk kueri kustom whale/DEX real-time/historis.[^6][^13][^18][^19][^20][^21][^22][^23]

Kesenjangan informasi yang relevan: detail lengkap Moralis tidak tersedia; angka rate limit spesifik Binance (global) tidak tercakup dalam sumber ini; quota/harga CryptoQuant tidak lengkap; detail rencana WebSocket CoinGecko (kapasitas soket per tier) dapat bervariasi; fitur DEX CMC yang terbaru perlu verifikasi pada dokumentasi produk lengkap.[^13]

---

## Metodologi & Lingkup

Ruang lingkup riset meliputi: (1) price data (CoinGecko, CoinMarketCap, Binance), (2) on-chain (Etherscan, Moralis, Alchemy, Infura), (3) trading volume/market data, serta (4) whale/smart money. Sumber informasi utama adalah dokumentasi resmi, halaman harga, dan artikel kebijakan yang disediakan oleh masing-masing penyedia. Evaluasi kualitatif dilakukan terhadap dimensi: cakupan data, dukungan streaming, rate limits, struktur harga, uptime, lisensi/atribusi, dan kemudahan integrasi. Status uptime/rate limit CoinGecko dan CoinMarketCap dapat dimonitor melalui halaman status resmi mereka.[^3][^9]

---

## Landscape & Klasifikasi API Kripto Real-Time

Ekosistem API real-time dapat dipetakan ke empat kelas: 
- Price aggregators (CoinGecko, CoinMarketCap): luas coverage, REST + (untuk CG) opsi WebSocket pada tier berbayar, cocok untuk quote harga, OHLCV, dan indikator pasar agregat.[^1][^4][^8]
- Exchange API (Binance): feed latensi sangat rendah untuk order book, trades, klines, dan user data, dengan mekanisme rate limit berbasis weight dan order count, serta kebijakan 429/418 yang tegas.[^14][^15]
- On-chain data platforms (Etherscan, Alchemy, Infura): akses ke data blockchain (balances, logs, traces), termasuk enhanced APIs dan RPC multi-chain; Etherscan unggul pada multichain explorer-style endpoints, Alchemy dan Infura pada throughput, kuota berbasis CU/kredit, dan arsitektur produksi.[^10][^13][^18][^19]
- Whale/Smart Money analytics (Whale Alert, CryptoQuant, Bitquery): alert real-time, label entitas, cohort analytics, dan GraphQL untuk pelacakan whale lintas chain.[^20][^21][^22][^23]

Tabel 2. Matriks klasifikasi “Provider vs Kelas Data”

| Provider | Price Aggregator | Exchange | On-chain | Whale/Smart Money |
|---|---|---|---|---|
| CoinGecko | Ya (REST + WS pada tier berbayar) | Tidak | Parsial (DEX on-chain via GeckoTerminal) | Tidak langsung (tetapi harga referensi untuk alert) |
| CoinMarketCap | Ya (REST, credits) | Tidak | Parsial (sisi pasar/DEX suite) | Tidak |
| Binance | Tidak | Ya (REST/WS) | Tidak | Tidak |
| Etherscan | Tidak | Tidak | Ya (multichain EVM explorer-style) | Parsial (alamat/tag) |
| Alchemy | Tidak | Tidak | Ya (enhanced APIs, RPC) | Tidak langsung |
| Infura | Tidak | Tidak | Ya (RPC/credits) | Tidak |
| Whale Alert | Tidak | Tidak | Parsial (event on-chain besar) | Ya (alert real-time) |
| CryptoQuant | Tidak | Tidak | Parsial (on-chain/off-chain analytics) | Ya (holder & smart money analytics) |
| Bitquery | Tidak | Tidak | Parsial (data indexing GraphQL) | Ya (GraphQL whale tracking) |

---

## Analisis Price Data APIs

CoinGecko menyediakan cakupan pasar luas dan fitur WebSocket real-time (beta/berbayar) untuk streaming harga, trades, dan OHLCV. Dokumentasi menekankan dukungan terhadap 18.000+ koin, 1.000+ bursa, serta data DEX on-chain dari 250+ jaringan yang didukung GeckoTerminal. WebSocket tersedia pada paket Analyst dan di atasnya; rate limit paid plan tersedia dalam dua varian (500 atau 1.000 calls/menit) tergantung langganan.[^1][^2][^5][^6][^8]

CoinMarketCap menyediakan suite REST yang komprehensif, termasuk kategori data pasar, bursa, DEX, fiat, indeks (CMC20/CMC100), hingga Fear & Greed index. Desain rate limit berbasis “credits” dengan pemantauan penggunaan di Developer Portal; reset periodik per menit/hari/bulan dan paginasi/historis memengaruhi kredit. CMC tidak menyediakan WebSocket; integrasi streaming perlu dikombinasikan dengan bursa atau penyedia lain.[^4][^9]

Binance (melalui Binance.US sebagai contoh) menyediakan REST dan WebSocket untuk market data dan user data. Dokumentasi menunjukkan mekanisme rate limit berlapis: REQUEST_WEIGHT, ORDERS, RAW_REQUESTS, dengan header khusus (X-MBX-USED-WEIGHT-…, X-MBX-ORDER-COUNT-…), serta kebijakan 429 (Too Many Requests) dan 418 (IP banned) yang jelas. Fitur pasar mencakup trades, klines, order book depth, ticker, dan user data streams; koneksi WS dibatasi (mis. validitas user streamlisten key).[^14][^15]

Tabel 3. Perbandingan Price Data APIs

| Aspek | CoinGecko | CoinMarketCap | Binance |
|---|---|---|---|
| Kanal | REST + WebSocket (berbayar) | REST | REST + WebSocket |
| Streaming | Harga/trades/OHLCV (WS, tier Analyst+) | Tidak | Trades, order book, klines, ticker, user streams |
| Coverage | 18k+ koin; 1k+ bursa; DEX on-chain 250+ jaringan | Global market coverage; DEX suite; indeks | Fokus bursa (market pairs, depth) |
| Rate Limit | Paid: 500/1.000 rpm | Credits per call; reset periodik; throttling | REQUEST_WEIGHT; ORDER_COUNT; 429/418 |
| Historis | 10+ tahun (granularitas bervariasi) | Historis + paginasi; indeks | Trades, klines, depth historis |
| Lisensi/Atribusi | Atribusi untuk beberapa tier | Terms komersial; credits | API key; adherence rate limit |

Tabel 4. Detail Rate Limits & Credits

| Provider | Mekanisme | Detail |
|---|---|---|
| CoinGecko | RPM (calls/minute) | Demo: ±30 rpm; Paid: 500 atau 1.000 rpm (tergantung paket).[^5][^6] |
| CoinMarketCap | Credits per call | 1 kredit per call + tambahan per 100 titik data (paginasi); reset menit/hari/bulan; monitoring via Developer Portal.[^4][^9] |
| Binance | REQUEST_WEIGHT & ORDER_COUNT | 429 throttling; 418 banned; header X-MBX-USED-WEIGHT-… dan X-MBX-ORDER-COUNT-…; user stream listen key expires.[^14][^15] |

Tabel 5. Pricing Tiers (ringkas)

| Provider | Tier | Harga (indikatif) | Catatan |
|---|---|---|---|
| CoinGecko | Demo | Gratis | Atribusi diperlukan; 10k calls/bulan.[^6] |
|  | Basic | ~$29–$35/bulan | 100k calls/bulan; overage $0.0005/call.[^6] |
|  | Analyst | ~$103–$129/bulan | 500k calls/bulan; WebSocket included.[^6] |
|  | Lite | ~$399–$499/bulan | Hingga 2M calls/bulan (opsional 15M).[^6] |
|  | Enterprise | Custom | SLA 99,9% uptime; soket kustom.[^6] |
| CoinMarketCap | Basic–Enterprise | lihat halaman pricing | Credits per call; fitur per tier.[^7][^8] |
| Binance | — | — | Tidak ada fee API; trading fees berlaku.[^14] |

### CoinGecko API

CoinGecko mencakup price feeds, metadata, historis (10+ tahun), dan data DEX on-chain lintas 250+ jaringan. WebSocket tersedia pada tier berbayar (Analyst+), dengan rate limit paid plan 500/1.000 rpm. Model overage billing tersedia dan atribusi diwajibkan untuk beberapa tier.[^1][^2][^5][^6]

### CoinMarketCap API

CMC menyediakan suite endpoint luas (market, exchange, DEX, indeks, fiat) dengan rate limit berbasis credits, paginasi, dan reset periodik. Tidak ada WebSocket; untuk streaming, integrasi tambahan diperlukan. Desain ini memudahkan kontrol penggunaan melalui Developer Portal dan kalkulasi kredit percall.[^4][^8][^9]

### Binance API (Market Data)

Binance menyediakan WebSocket order book, trades, klines, ticker, dan user data stream. Mekanisme rate limit berlapis (REQUEST_WEIGHT/ORDERS) disertai kebijakan 429/418 memaksa klien untuk menerapkan backoff yang disiplin. Koneksi WS dibatasi (incoming messages/detik, max streams, validity), serta listen key user stream yang berkala expire.[^14][^15]

---

## Analisis On-Chain Data APIs

Etherscan API V2 menyatukan akses multi-EVM chain (60+) di bawah satu kunci API, dengan endpoint yang familiar (accounts, blocks, contracts, tokens, logs, statistics, gas tracker). Ada referensi PRO endpoints, menandakan diferensiasi fitur untuk tier berbayar. Dokumentasi supported chains dan rate limits tersedia terpisah.[^10][^11][^12]

Alchemy menyajikan enhanced APIs (Portfolio, Token, Transfers, Prices, NFT), Webhooks untuk push on-chain events, Simulation API, serta Smart Websockets. Model harga berbasis Compute Units (CU) dengan alokasi per bulan dan batas throughput (req/s & CU/s); paket Free, PAYG, dan Enterprise menyediakan kapasitas dan fitur berbeda. Dukungan multi-chain luas dan akses data arsip mendukung beban kerja produksi.[^13][^14]

Infura menawarkan RPC multi-chain dengan sistem “credits” harian dan guaranteed throughput per detik (500–40K+ kredit/detik tergantung tier). Fitur meliputi Gas API, Trace/Debug API, dan inisiatif desentralisasi DIN (Decentralized Infrastructure Network) untuk meminimalkan single point of failure. Paket Core/Developer/Team/Enterprise memiliki kuota harian dan add-on credits tambahan.[^18][^19]

Tabel 6. Perbandingan Etherscan vs Alchemy vs Infura

| Aspek | Etherscan | Alchemy | Infura |
|---|---|---|---|
| Model Akses | Explorer-style endpoints | Enhanced APIs & RPC | RPC via credits |
| Multichain | 60+ EVM chains | 30+ chains (EVM + lain) | 40+ networks |
| Streaming | — (REST) | Webhooks + Smart WS | Streaming access |
| Historis | Ada (bervariasi) | Full Archive Data | Archive data |
| Rate Limit | Lihat dokumentasi RL | Throughput CU/s | Credits/hari; kredit/detik |

Tabel 7. Ringkasan Pricing/Quota

| Provider | Plan | Harga | Kuota/Throughput |
|---|---|---|---|
| Alchemy | Free | $0 | 30M CU/bulan; 25 req/s; 500 CU/s.[^13] |
|  | PAYG | Mulai $5 | 11M CU; $0.40–$0.45/1M CU; 300 req/s; 10k CU/s.[^13] |
|  | Enterprise | Custom | Throughput kustom; SLA; diskon volume.[^13] |
| Infura | Core | Gratis | 3M kredit/hari; 500 kredit/detik.[^18] |
|  | Developer | $50/bulan | 15M kredit/hari; 4k kredit/detik.[^18] |
|  | Team | $225/bulan | 75M kredit/hari; 40k kredit/detik.[^18] |
|  | Enterprise | Custom | Skala elastis; burstable throughput.[^18] |

### Etherscan API (V2, Multichain)

Etherscan menyederhanakan akses multi-EVM (BSC, Base, Arbitrum, dll.) dengan satu kunci API. Endpoint familiar untuk balances, logs, dan token transfers memudahkan integrasi analitik dan deteksi aktivitas alamat. Rate limits dan PRO endpoints terdokumentasi terpisah.[^10][^11][^12]

### Alchemy Data APIs

Alchemy menawarkan Prices API (real-time & historis), Transfers API, Portfolio/Token/NFT API, Webhooks untuk event-driven push, dan Simulation API. Throughput berbasis CU memudahkan kontrol biaya; paket Free/PAYG/Enterprise menyediakan lintasan peningkatan kapasitas sesuai beban produksi.[^13][^14]

### Infura RPC & APIs

Infura mengandalkan model kredit harian dan throughput terjamin per detik, dengan Gas/Trace/Debug APIs, dan akses archive data. DIN menunjukkan fokus desentralisasi infrastruktur. Paket Core–Enterprise menyediakan peningkatan kuota dan dukungan sesuai skala aplikasi.[^18][^19]

Kesenjangan: Detail Moralis tidak tersedia (Vercel Security Checkpoint), sehingga perbandingan fitur on-chain tambahan tidak disertakan.[^13]

---

## Trading Volume & Market Data

Volume dan market data dapat diperoleh langsung dari bursa (Binance) untuk feeds latensi rendah, atau dari aggregators (CoinGecko, CoinMarketCap) untuk cakupan pasar yang lebih luas. CoinGecko menyediakan endpoint pasar, historis 10+ tahun, serta data DEX on-chain lintas 250+ jaringan. CMC menyediakan kategori data pasar (exchange, global metrics) dan indeks (CMC20/CMC100) dengan desain credits yang terukur. Binance menyediakan volume, quoteVolume, klines, order book depth, dan statistik perubahan harga 24 jam melalui REST/WS.[^1][^4][^6][^8][^14]

Tabel 8. Sumber Trading Volume & Market Data

| Sumber | Kekuatan | Trade-off |
|---|---|---|
| Binance (bursa) | Latensi rendah; order book & trades real-time | Fokus satu bursa; rate limit ketat |
| CoinGecko (aggregator) | Luas coverage; DEX on-chain; historis panjang | REST ± WS (berbayar); atribusi/overage |
| CoinMarketCap (aggregator) | Kategori data lengkap; indeks; credits terukur | Tidak ada WebSocket; desain credits perlu kalkulasi |

Tabel 9. Endpoints Utama untuk Volume/Market Data

| Provider | Kategori | Contoh Endpoints/Streams |
|---|---|---|
| Binance | Trades, order book, klines, ticker | @trade, @kline_<interval>, @depth, @ticker; REST market data.[^14] |
| CoinGecko | Market, OHLCV, historis, DEX | Market endpoints; OHLCV; DEX on-chain via GeckoTerminal.[^1][^2] |
| CoinMarketCap | Listings, quotes, historical; exchange; DEX; indeks | /cryptocurrency/*, /exchange/*, /global-metrics/*; CMC20/100.[^4][^8] |

---

## Whale Tracking & Smart Money Movement

Whale Alert fokus pada alerts transaksi besar secara real-time, lintas hampir 100 aset, dengan limitasi alerts hingga 1.000/hari dan 10 filter pada paket Alerts. Dashboard menyediakan analitik langsung, dan API tersedia terpisah untuk integrasi. Paket berbayar (Alerts; Alerts, Analytics & News) disertai uji coba gratis.[^20][^21]

CryptoQuant menyediakan metrik on-chain/off-chain siap pakai, label entitas dan cohort analytics, serta API untuk export semua metrik. Platform ini berguna untuk smart money tracking, exchange reserve, NUPL, funding rates, dan alert real-time. Rincian kuota/harga tidak terlihat lengkap pada ringkasan yang tersedia; detail disediakan via dokumentasi/pricing halaman resmi.[^21][^22]

Bitquery, dengan GraphQL, mengindeks 40+ blockchain dan 100+ DEX. Dataset seperti TokenHolders, BalanceUpdates, DEXTrades, dan Transactions memungkinkan pelacakan paus (whale) secara real-time/historis, termasuk pergerakan dana dan aktivitas DEX dompet besar. Artikel panduan memuat studi kasus dompet paus Ethereum (USDT), definisi operasional whale, dan contoh kueri spesifik.[^23]

Tabel 10. Perbandingan Whale/Smart Money APIs

| Aspek | Whale Alert | CryptoQuant | Bitquery |
|---|---|---|---|
| Fokus | Alert transaksi besar | Metrik siap pakai + label | Kueri fleksibel GraphQL |
| Cakupan | ~100 aset; lintas chain utama | On-chain/off-chain; exchange; holder | 40+ chain; 100+ DEX |
| Mode | Push alert (real-time) | Charts + API export | Pull via GraphQL |
| Kuota | Hingga 1000 alerts/hari (paket) | Kuota/harga详见 docs | Gratis daftar; harga详见 docs |
| Biaya | $14.95–$29.95/bulan (alerts) | lihat halaman pricing | lihat halaman pricing |

---

## Perbandingan Rate Limits, Uptime, dan Kebijakan Akses

Rate limits menentukan skala integrasi dan cara mitigasi. CoinGecko menetapkan RPM pada paid plan (500/1.000 rpm) dan demo ±30 rpm; CMC menggunakan credits per call dengan reset periodik dan throttling; Binance mempraktikkan REQUEST_WEIGHT dan ORDER_COUNT dengan 429/418 dan backoff wajib; Alchemy membatasi throughput berbasis CU/s; Infura pembatasan credits/hari dan kredit/detik.[^5][^6][^9][^13][^14][^15][^18][^19]

Uptime/reliability dapat dipantau di halaman status CoinGecko dan CoinMarketCap; dokumentasi Binance menekankan transparansi operasional dan kebijakan rate limit yang tegas (pelanggaran berulang berujung banned).[^3][^9][^14][^15]

Tabel 11. Matriks Rate Limits (ringkas)

| Provider | Mekanisme RL | Detail Operasional |
|---|---|---|
| CoinGecko | RPM | Paid 500/1.000 rpm; demo ±30 rpm; overage billing.[^5][^6] |
| CoinMarketCap | Credits | Credits percall + per 100 data; reset menit/hari/bulan; 429 & error codes.[^4][^9] |
| Binance | Weight/Orders | 429 throttling; 418 banned; headers RL; WS message limits.[^14][^15] |
| Alchemy | CU/s | 500 CU/s (Free); 10k CU/s (PAYG); RPS 25/300.[^13] |
| Infura | Credits/hari & kredit/detik | 3M–75M kredit/hari; 500–40k kredit/detik; add-on credits.[^18][^19] |

Tabel 12. Kebijakan Pelanggaran & Dampak

| Provider | Kebijakan | Dampak pada Integrasi |
|---|---|---|
| Binance | 429/418; retry_after header | Wajib exponential backoff; risiko banIP jika berulang.[^14][^15] |
| CoinMarketCap | Error codes (1008–1011) | Throttling per menit/hari/bulan; monitoring via portal.[^4] |
| CoinGecko | Rate limit per plan | Risiko overagebilling; perlu cache/batching.[^5][^6] |
| Alchemy | Throughput CU/s | Perlu throttling & batching; observability usage.[^13] |
| Infura | Credits/hari & kredit/detik | Risiko exhaustion harian; perlu auto-scaling.[^18][^19] |

---

## Perbandingan Struktur Harga & Lisensi

CoinGecko menawarkan Demo/Basic/Analyst/Lite/Enterprise, dengan call credits per bulan, rate limits, overage billing ($/call), historis panjang, dan WebSocket mulai Analyst. Lisensi komersial dan atribusi diperlukan pada beberapa tier. CMC menyediakan tingkatan Basic–Enterprise dengan struktur credits per call dan cakupan fitur yang meningkat; detail harga pada halaman pricing resmi.[^6][^7][^8]

Alchemy membebankan biaya berbasis CU (mis. $0.40–$0.45/1M CU), dengan Free/PAYG/Enterprise plan dan throughput CU/s yang semakin tinggi. Infura menerapkan kredit/hari dan throughput kredit/detik (Core–Enterprise), dengan add-on credits untuk kapasitas tambahan. Whale Alert menetapkan paket Alerts dan Alerts, Analytics & News (berlangganan bulanan) untuk alert whale.[^13][^18][^20][^21]

Tabel 13. Ringkasan Harga per Provider/Tier

| Provider | Tier | Harga | Kuota/Fitur Utama |
|---|---|---|---|
| CoinGecko | Demo | Gratis | 10k calls/bulan; atribusi; tanpa WS.[^6] |
|  | Basic | ~$29–$35/bulan | 100k calls; 250 rpm; overage $0.0005.[^6] |
|  | Analyst | ~$103–$129/bulan | 500k calls; 500 rpm; WebSocket.[^6] |
|  | Lite | ~$399–$499/bulan | 2M calls (opsional 15M); 500 rpm.[^6] |
| CoinMarketCap | Basic–Enterprise | lihat halaman pricing | Credits per call; reset periodik; kategori luas.[^7][^8] |
| Alchemy | Free/PAYG/Enterprise | $0 / usage-based / custom | CU per bulan; CU/s; enhanced APIs.[^13] |
| Infura | Core/Developer/Team/Enterprise | $0 / $50 / $225 / custom | 3M–75M kredit/hari; 500–40k kredit/detik.[^18] |
| Whale Alert | Alerts / A,A&N | $14.95 / $29.95 per bulan | 1000 alerts/hari; analitik; API terpisah.[^20][^21] |

---

## Arsitektur Integrasi & Best Practices

Kombinasi REST dan WebSocket perlu dirancang untuk menjaga konsistensi dan efisiensi biaya. Strategi umum:
- Gunakan REST untuk snapshot harga/market dan historis; dukung dengan cache internal (mis. TTL 30–60 detik) untuk mengurangi rate-limit pressure dan biaya overage.
- Manfaatkan WebSocket untuk feeds real-time (order book/trades/harga). Pada CoinGecko, aktifkan WebSocket pada tier Analyst+; pada Binance, patuhi batas WS (incoming messages/detik, stream limits) dan kelola listen key user stream yang berkala expire.[^2][^6][^14]
- Terapkan backoff eksponensial saat menghadapi 429/418 (Binance) atau throttling CMC; gunakan header Retry-After dan jitter. CoinGecko menyarankan praktik error handling dan rate-limit awareness yang terdokumentasi.[^4][^5][^14][^15]
- Kelola kunci API: rotasi periodik, pemisahan lingkungan (dev/prod), scoping domain/IP jika tersedia, serta monitoring kuota (CMC Developer Portal, Alchemy usage dashboard, Infura credit visibility).[^4][^13][^18]
- Optimasi kueri on-chain: batching beberapa alamat/token dalam satu permintaan (CMC), minimalkan scope fields, gunakan enhanced APIs (Alchemy) dan CU metering, serta arsitektur webhooks (Alchemy) untuk push events guna menurunkan polling.[^4][^13]

---

## Rekomendasi Stack API per Use-Case

Rekomendasi berikut memaksimalkan Coverage–Latency–Cost trade-off dengan tetap regard to rate limits dan lisensi.

Tabel 14. Use-case → Stack Rekomendasi + Estimasi Biaya (indikatif)

| Use-case | Stack | Estimasi Biaya | Alasan |
|---|---|---|---|
| MVP (price + on-chain ringan) | CoinGecko Basic + Etherscan + Whale Alert (Alerts) | ~$35–$50/bulan + add-on WA | Coverage luas, REST sederhana, alert whale real-time; biaya rendah.[^6][^10][^20] |
| Trading/Price Streaming | CoinGecko Analyst (WS) atau Binance WS + Alchemy Webhooks | ~$103–$129/bulan (CG) + Alchemy Free | Streaming harga simbol luas (CG) atau order book latensi rendah (Binance); webhook on-chain.[^6][^14] |
| Analitik Portofolio Skala Besar | CoinGecko Lite + Alchemy PAYG/Enterprise + CryptoQuant | Usage-based (CG Lite $499/bulan; Alchemy $0.40–$0.45/1M CU) + CQ | Throughput tinggi, metrik holder/entitas, data historis luas; SLA opsional.[^6][^13][^21] |
| DEX Analytics & Whale | CoinGecko (DEX on-chain) + Bitquery GraphQL + Etherscan | lihat harga Bitquery | CG untuk coverage DEX; Bitquery untuk kueri whale/DEX real-time/historis; Etherscan untuk verifikasi alamat/log.[^1][^10][^23] |
| Backtesting/Research | CoinGecko/CMC historis + Infura Team | ~$225/bulan (Infura) + CG/CMC | Historis panjang + archive data RPC; akses stabil untuk beban batch.[^6][^8][^18] |

Perkiraan biaya bersifat indikatif dan bergantung pada penggunaan aktual (mis. volume kueri, throughput CU, dan credits). Untuk beban produksi, siapkan buffer anggaran dan mekanisme auto-scaling.

---

## Lampiran Teknis

Tabel 15. Cuplikan Endpoint/Stream Penting

| Provider | Tipe | Endpoint/Stream | Payload Utama | Use-case |
|---|---|---|---|---|
| CoinGecko | REST | /simple/price, /coins/{id}/market_chart | Harga, OHLCV | Snapshot harga & historis.[^2] |
| CoinGecko | WS | harga/trades/OHLCV (tier Analyst+) | Trades, tick, ohlc | Streaming harga & trades.[^2] |
| CoinMarketCap | REST | /cryptocurrency/listings/latest, /quotes/latest, /historical | Listings, quotes, ohlc | Market data & historis.[^4] |
| Binance | REST | /api/v3/trades, /depth, /klines | Trades, order book, candles | Market data historis & snapshot.[^14] |
| Binance | WS | @trade, @kline_<interval>, @depth, @ticker | Trades, candles, depth, ticker | Streaming pasar dan order book.[^14] |
| Etherscan | REST | module=account&action=balancetoken, logs | Saldo token, logs event | Analitik alamat & token transfers.[^10] |
| Alchemy | REST/WS | Prices API, Webhooks, Transfers/Token/NFT API | Harga, events, transfers | Portofolio & event-driven.[^13] |
| Infura | REST | ETH RPC, Gas API, Trace/Debug | Response RPC, gas, trace | RPC produksi, analisis transaksi.[^18][^19] |
| Whale Alert | REST | Alerts API (dokumentasi terpisah) | Alert event (nilai, aset, from/to) | Whale alerts real-time.[^21] |
| Bitquery | GraphQL | TokenHolders, BalanceUpdates, DEXTrades, Transactions | Holder, updates, trades | Whale tracking & DEX analytics.[^23] |

Tabel 16. Header Rate Limit & Monitoring (ringkas)

| Provider | Header/Objek | Deskripsi |
|---|---|---|
| Binance | X-MBX-USED-WEIGHT-(interval) | Bobot permintaan per interval.[^14] |
| Binance | X-MBX-ORDER-COUNT-(interval) | Hitungan pesanan per interval.[^14] |
| CMC | JSON object status; /key/info | Status penggunaan dan kredit; error codes (1008–1011).[^4] |
| CoinGecko | — | Rate limit per plan; praktik error handling di docs.[^5][^6] |
| Alchemy | Dashboard usage | CU consumed, CU/s, req/s; observability.[^13] |
| Infura | Dashboard visibility | Daily credits consumed; credit/sec throughput.[^18][^19] |

---

## Information Gaps

- Moralis: halaman dokumentasi ditutup oleh Vercel Security Checkpoint; detail fitur, rate limits, dan harga tidak tersedia dalam konteks ini.
- Binance (global): angka rate limit spesifik per plan tidak tercakup; dokumentasi yang dianalisis berfokus pada Binance.US.
- CryptoQuant: kuotasi API, harga, dan batasan streaming tidak terlihat detail; halaman pricing lebih rinci diperlukan.
- Whale Alert API (developer.whale-alert.io): struktur harga/antrian request tidak diekstrak; perlu verifikasi langsung.
- CoinGecko WebSocket: jumlah soket per tier Enterprise tidak tercantum eksplisit; perlu konfirmasi terbaru.
- CMC DEX endpoints: daftar lengkap dan batasan historis memerlukan rujukan pada dokumentasi DEX suite yang paling mutakhir.

---

## Referensi

[^1]: CoinGecko API: Introduction. https://docs.coingecko.com/
[^2]: CoinGecko WebSocket API Documentation. https://docs.coingecko.com/websocket
[^3]: CoinGecko API Status Page. https://status.coingecko.com/
[^4]: CoinMarketCap API Documentation. https://coinmarketcap.com/api/documentation/v1/
[^5]: CoinGecko Common Errors & Rate Limit. https://docs.coingecko.com/docs/common-errors-rate-limit
[^6]: CoinGecko API Pricing Plans. https://www.coingecko.com/en/api/pricing
[^7]: CoinMarketCap API Pricing Plans. https://coinmarketcap.com/api/pricing/
[^8]: CoinMarketCap API: Overview. https://coinmarketcap.com/api/
[^9]: CoinMarketCap API Status Page. https://status.coinmarketcap.com/
[^10]: Etherscan API V2: Multichain. https://docs.etherscan.io/etherscan-v2
[^11]: Etherscan Supported Chains. https://docs.etherscan.io/supported-chains
[^12]: Etherscan APIs: Ethereum (ETH) API Provider. https://etherscan.io/apis
[^13]: Alchemy Pricing. https://www.alchemy.com/pricing
[^14]: Binance.US API Documentation. https://docs.binance.us/
[^15]: Binance Notice on API Update (2024-09-03). https://www.binance.com/en/support/announcement/detail/19d4e3cd0758426584dd9686eb56ec64
[^16]: Binance's H1 2024 API Uptime Report. https://www.binance.com/en/blog/tech/8233809493081423281
[^17]: Binance's H2 2024 API Uptime Report. https://www.binance.com/en/blog/tech/464653904357096108
[^18]: Infura Pricing. https://www.infura.io/pricing
[^19]: MetaMask Developer: Infura Pricing & Credit Costs. https://docs.metamask.io/services/get-started/pricing/
[^20]: Whale Alert: Home. https://whale-alert.io/
[^21]: Whale Alert API Documentation. https://developer.whale-alert.io/documentation/
[^22]: CryptoQuant: On-Chain & Market Data Analytics. https://cryptoquant.com/
[^23]: Bitquery: How to Find Ethereum Whales & Follow Money. https://bitquery.io/blog/how-to-find-ethereum-whales-follow-money