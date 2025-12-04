// Advanced Signals Edge Function
// Multi-source data correlation for enhanced crypto intelligence

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Supabase configuration missing');
    }

    let requestBody = { signalType: 'all' };
    try {
      requestBody = await req.json();
    } catch (e) {}

    const signalType = requestBody.signalType || 'all';
    const symbols = requestBody.symbols || ['bitcoin', 'ethereum', 'solana', 'cardano', 'polygon'];

    const signals = [];
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 hours

    // 1. Fetch detailed market data from CoinGecko
    const marketDataUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${symbols.join(',')}&order=market_cap_desc&sparkline=true&price_change_percentage=1h,24h,7d`;
    
    const marketResponse = await fetch(marketDataUrl, {
      headers: { 'Accept': 'application/json' }
    });

    let marketData: any[] = [];
    if (marketResponse.ok) {
      marketData = await marketResponse.json();
    }

    // 2. Fetch OHLC data for technical analysis
    const ohlcPromises = symbols.slice(0, 3).map(async (symbol) => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${symbol}/ohlc?vs_currency=usd&days=7`
        );
        if (response.ok) {
          return { symbol, data: await response.json() };
        }
      } catch (e) {}
      return { symbol, data: [] };
    });

    const ohlcData = await Promise.all(ohlcPromises);

    // 3. Process each coin for signals
    for (const coin of marketData) {
      const coinOhlc = ohlcData.find(o => o.symbol === coin.id)?.data || [];
      
      // Calculate volatility from sparkline
      const sparkline = coin.sparkline_in_7d?.price || [];
      const volatility = calculateVolatility(sparkline);
      
      // Calculate momentum indicators
      const priceChange1h = coin.price_change_percentage_1h_in_currency || 0;
      const priceChange24h = coin.price_change_percentage_24h || 0;
      const priceChange7d = coin.price_change_percentage_7d_in_currency || 0;
      
      // Volume analysis
      const volumeChange = coin.total_volume / (coin.market_cap / 100);
      const isHighVolume = volumeChange > 5;
      
      // Multi-factor signal scoring
      const signalScore = calculateSignalScore({
        priceChange1h,
        priceChange24h,
        priceChange7d,
        volatility,
        volumeChange,
        marketCapRank: coin.market_cap_rank
      });

      // Generate alerts based on conditions
      
      // Whale/Large Movement Detection
      if (Math.abs(priceChange1h) > 3 || (isHighVolume && Math.abs(priceChange24h) > 5)) {
        const isPositive = priceChange1h > 0 || priceChange24h > 0;
        const urgency = Math.abs(priceChange1h) > 5 || Math.abs(priceChange24h) > 8 ? 'HIGH' : 
                       Math.abs(priceChange1h) > 3 || Math.abs(priceChange24h) > 5 ? 'MEDIUM' : 'LOW';
        
        signals.push({
          type: 'WHALE_MOVEMENT',
          urgency,
          title: `${isPositive ? 'Akumulasi Besar' : 'Distribusi Besar'} - ${coin.symbol.toUpperCase()}`,
          trigger_info: {
            movement_type: isPositive ? 'ACCUMULATION' : 'DISTRIBUTION',
            price: `$${coin.current_price.toLocaleString()}`,
            change_1h: `${priceChange1h > 0 ? '+' : ''}${priceChange1h.toFixed(2)}%`,
            change_24h: `${priceChange24h > 0 ? '+' : ''}${priceChange24h.toFixed(2)}%`,
            volume: `$${formatNumber(coin.total_volume)}`,
            signal_score: signalScore
          },
          context: {
            analysis: generateMovementAnalysis(coin, priceChange1h, priceChange24h, volatility),
            signal_strength: signalScore > 70 ? 'Sangat Kuat' : signalScore > 50 ? 'Kuat' : 'Moderat',
            volume_status: isHighVolume ? 'Volume Tinggi' : 'Volume Normal',
            volatility_level: volatility > 5 ? 'Tinggi' : volatility > 2 ? 'Sedang' : 'Rendah'
          },
          symbol: coin.symbol.toUpperCase(),
          expires_at: expiresAt.toISOString(),
          is_active: true
        });
      }

      // Volume Spike Detection
      if (isHighVolume) {
        signals.push({
          type: 'VOLUME_SPIKE',
          urgency: volumeChange > 10 ? 'HIGH' : volumeChange > 7 ? 'MEDIUM' : 'LOW',
          title: `Volume Anomali - ${coin.symbol.toUpperCase()}`,
          trigger_info: {
            volume_24h: `$${formatNumber(coin.total_volume)}`,
            volume_ratio: `${volumeChange.toFixed(1)}%`,
            price: `$${coin.current_price.toLocaleString()}`,
            market_cap: `$${formatNumber(coin.market_cap)}`,
            signal_score: signalScore
          },
          context: {
            description: `Volume ${coin.name} ${volumeChange.toFixed(1)}% dari market cap - menunjukkan aktivitas trading yang sangat tinggi`,
            potential_cause: priceChange24h > 0 ? 'Kemungkinan akumulasi institusional' : 'Kemungkinan distribusi atau panic selling',
            recommendation: volumeChange > 8 ? 'Monitor ketat, siapkan entry/exit strategy' : 'Pantau perkembangan'
          },
          symbol: coin.symbol.toUpperCase(),
          expires_at: expiresAt.toISOString(),
          is_active: true
        });
      }

      // Momentum Shift Detection
      if ((priceChange1h > 0 && priceChange24h < -3) || (priceChange1h < 0 && priceChange24h > 3)) {
        const isReversal = priceChange1h > 0;
        signals.push({
          type: 'SENTIMENT_SHIFT',
          urgency: 'MEDIUM',
          title: `${isReversal ? 'Potensi Reversal Bullish' : 'Potensi Reversal Bearish'} - ${coin.symbol.toUpperCase()}`,
          trigger_info: {
            direction: isReversal ? 'BULLISH_REVERSAL' : 'BEARISH_REVERSAL',
            momentum_1h: `${priceChange1h > 0 ? '+' : ''}${priceChange1h.toFixed(2)}%`,
            trend_24h: `${priceChange24h > 0 ? '+' : ''}${priceChange24h.toFixed(2)}%`,
            volatility: `${volatility.toFixed(2)}%`,
            signal_score: signalScore
          },
          context: {
            analysis: `${coin.name} menunjukkan tanda-tanda ${isReversal ? 'pembalikan arah ke atas' : 'pembalikan arah ke bawah'} berdasarkan divergensi momentum jangka pendek vs menengah`,
            confidence: signalScore > 60 ? 'Tinggi' : 'Moderat',
            action_suggestion: isReversal ? 'Pertimbangkan entry bertahap' : 'Pertimbangkan pengurangan posisi'
          },
          symbol: coin.symbol.toUpperCase(),
          expires_at: expiresAt.toISOString(),
          is_active: true
        });
      }

      // Trend Strength Detection (7-day trend)
      if (Math.abs(priceChange7d) > 15) {
        const isBullishTrend = priceChange7d > 0;
        signals.push({
          type: 'NARRATIVE_MOMENTUM',
          urgency: Math.abs(priceChange7d) > 25 ? 'HIGH' : 'MEDIUM',
          title: `Tren ${isBullishTrend ? 'Bullish' : 'Bearish'} Kuat - ${coin.symbol.toUpperCase()}`,
          trigger_info: {
            trend_7d: `${priceChange7d > 0 ? '+' : ''}${priceChange7d.toFixed(2)}%`,
            current_price: `$${coin.current_price.toLocaleString()}`,
            ath_distance: `${((coin.current_price / coin.ath - 1) * 100).toFixed(1)}%`,
            market_cap_rank: `#${coin.market_cap_rank}`,
            signal_score: signalScore
          },
          context: {
            trend_analysis: `${coin.name} dalam tren ${isBullishTrend ? 'naik' : 'turun'} kuat selama 7 hari terakhir dengan perubahan ${Math.abs(priceChange7d).toFixed(1)}%`,
            risk_level: volatility > 5 ? 'Tinggi' : 'Moderat',
            recommendation: isBullishTrend 
              ? 'Momentum kuat, pertimbangkan trailing stop untuk posisi yang ada' 
              : 'Hati-hati dengan pembelian, tunggu konfirmasi pembalikan'
          },
          symbol: coin.symbol.toUpperCase(),
          expires_at: expiresAt.toISOString(),
          is_active: true
        });
      }
    }

    // Sort by urgency and limit
    const sortedSignals = signals
      .sort((a, b) => {
        const urgencyOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        return urgencyOrder[a.urgency as keyof typeof urgencyOrder] - urgencyOrder[b.urgency as keyof typeof urgencyOrder];
      })
      .slice(0, 15);

    // Store signals in database
    if (sortedSignals.length > 0) {
      // Deactivate old signals
      await fetch(
        `${supabaseUrl}/rest/v1/alerts?is_active=eq.true&created_at=lt.${new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString()}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ is_active: false })
        }
      );

      // Insert new signals
      await fetch(`${supabaseUrl}/rest/v1/alerts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sortedSignals)
      });
    }

    return new Response(
      JSON.stringify({
        data: {
          signals: sortedSignals,
          generated_at: now.toISOString(),
          total_count: sortedSignals.length,
          sources: ['CoinGecko Market Data', 'Technical Analysis', 'Volume Analysis']
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Advanced signals error:', error);
    return new Response(
      JSON.stringify({ error: { code: 'SIGNALS_ERROR', message: error.message } }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper functions
function calculateVolatility(prices: number[]): number {
  if (prices.length < 2) return 0;
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i-1]) / prices[i-1] * 100);
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
  return Math.sqrt(variance);
}

function calculateSignalScore(factors: {
  priceChange1h: number;
  priceChange24h: number;
  priceChange7d: number;
  volatility: number;
  volumeChange: number;
  marketCapRank: number;
}): number {
  let score = 50;
  
  // Price momentum factor (0-20)
  const momentumScore = Math.min(Math.abs(factors.priceChange1h) * 2 + Math.abs(factors.priceChange24h) * 0.5, 20);
  score += momentumScore;
  
  // Volume factor (0-15)
  const volumeScore = Math.min(factors.volumeChange * 1.5, 15);
  score += volumeScore;
  
  // Trend consistency factor (0-10)
  const trendConsistent = (factors.priceChange1h > 0 && factors.priceChange24h > 0) || 
                         (factors.priceChange1h < 0 && factors.priceChange24h < 0);
  score += trendConsistent ? 10 : 0;
  
  // Market cap quality factor (0-5)
  score += factors.marketCapRank <= 20 ? 5 : factors.marketCapRank <= 50 ? 3 : 0;
  
  return Math.min(Math.round(score), 100);
}

function generateMovementAnalysis(coin: any, change1h: number, change24h: number, volatility: number): string {
  const direction = change24h > 0 ? 'positif' : 'negatif';
  const momentum = Math.abs(change1h) > 2 ? 'kuat' : 'moderat';
  
  if (change24h > 5) {
    return `${coin.name} menunjukkan momentum ${momentum} dengan akumulasi signifikan. Volume tinggi mengindikasikan minat beli institusional.`;
  } else if (change24h < -5) {
    return `${coin.name} mengalami tekanan jual dengan volatilitas ${volatility.toFixed(1)}%. Perhatikan level support kunci.`;
  }
  return `${coin.name} bergerak ${direction} dengan volatilitas ${volatility.toFixed(1)}%. Monitor perkembangan volume untuk konfirmasi arah.`;
}

function formatNumber(num: number): string {
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
}
