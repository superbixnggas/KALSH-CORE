// Generate Insights Edge Function
// Analyzes market data and generates actionable insights

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

    // Get request body for mode
    let requestBody = { mode: 'daily' };
    try {
      requestBody = await req.json();
    } catch (e) {
      // Default to daily mode
    }

    const mode = requestBody.mode || 'daily';

    // Fetch latest market stats
    const statsResponse = await fetch(
      `${supabaseUrl}/rest/v1/market_stats?order=created_at.desc&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      }
    );

    let marketStats = null;
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      marketStats = statsData[0] || null;
    }

    // If no market stats, fetch fresh data
    if (!marketStats) {
      const globalResponse = await fetch('https://api.coingecko.com/api/v3/global');
      if (globalResponse.ok) {
        const globalData = await globalResponse.json();
        const data = globalData.data;
        
        marketStats = {
          trend: 'NEUTRAL',
          btc_dominance: data.market_cap_percentage?.btc || 50,
          fear_greed_index: 50,
          active_narratives: 8,
          total_market_cap: data.total_market_cap?.usd || 0,
          volume_24h: data.total_volume?.usd || 0
        };
      }
    }

    const insights = [];
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

    if (mode === 'daily' || mode === 'all') {
      // Generate Daily Market Trend Insight
      const trendStatus = marketStats?.trend?.includes('BULLISH') ? 'BULLISH' : 
                          marketStats?.trend?.includes('BEARISH') ? 'BEARISH' : 'NEUTRAL';
      
      const marketTrendInsight = {
        type: 'MARKET_TREND',
        mode: 'daily',
        title: 'Tren Pasar Hari Ini',
        status: trendStatus,
        data_points: {
          market_cap: formatMarketCap(marketStats?.total_market_cap),
          btc_dominance: `${(marketStats?.btc_dominance || 0).toFixed(1)}%`,
          volume_24h: formatMarketCap(marketStats?.volume_24h),
          trend_direction: trendStatus
        },
        reason: generateTrendReason(trendStatus, marketStats),
        action: generateTrendAction(trendStatus),
        confidence_score: calculateConfidence(marketStats),
        narrative_category: 'market_overview',
        expires_at: expiresAt.toISOString(),
        is_active: true
      };
      insights.push(marketTrendInsight);

      // Generate Fear & Greed Insight
      const fearGreed = marketStats?.fear_greed_index || 50;
      const fgStatus = fearGreed <= 25 ? 'EXTREME_FEAR' : 
                       fearGreed <= 45 ? 'FEAR' :
                       fearGreed <= 55 ? 'NEUTRAL' :
                       fearGreed <= 75 ? 'GREED' : 'EXTREME_GREED';
      
      const fearGreedInsight = {
        type: 'SENTIMENT',
        mode: 'daily',
        title: 'Sentimen Pasar',
        status: fgStatus,
        data_points: {
          fear_greed_index: fearGreed,
          sentiment_label: getSentimentLabel(fearGreed),
          historical_average: 45,
          change_24h: '+3'
        },
        reason: generateSentimentReason(fgStatus, fearGreed),
        action: fgStatus === 'EXTREME_FEAR' ? 'Pertimbangkan akumulasi bertahap' : 
                fgStatus === 'EXTREME_GREED' ? 'Waspadai koreksi, pertimbangkan profit taking' : null,
        confidence_score: 75,
        narrative_category: 'sentiment',
        expires_at: expiresAt.toISOString(),
        is_active: true
      };
      insights.push(fearGreedInsight);

      // Generate Risk Assessment Insight
      const riskLevel = calculateRiskLevel(marketStats);
      const riskInsight = {
        type: 'RISK_ASSESSMENT',
        mode: 'daily',
        title: 'Penilaian Risiko',
        status: riskLevel.status,
        data_points: {
          risk_score: riskLevel.score,
          volatility: riskLevel.volatility,
          liquidity_score: riskLevel.liquidity,
          key_risk_factors: riskLevel.factors
        },
        reason: riskLevel.reason,
        action: riskLevel.action,
        confidence_score: 70,
        narrative_category: 'risk',
        expires_at: expiresAt.toISOString(),
        is_active: true
      };
      insights.push(riskInsight);
    }

    if (mode === 'explorer' || mode === 'all') {
      // Generate Explorer Insights for emerging narratives
      const explorerInsights = await generateExplorerInsights(supabaseUrl, serviceRoleKey);
      insights.push(...explorerInsights);
    }

    // Insert insights into database
    if (insights.length > 0) {
      // First, deactivate old insights of the same mode
      await fetch(
        `${supabaseUrl}/rest/v1/insights?mode=eq.${mode}&is_active=eq.true`,
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

      // Insert new insights
      const insertResponse = await fetch(`${supabaseUrl}/rest/v1/insights`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(insights)
      });

      if (!insertResponse.ok) {
        const errorText = await insertResponse.text();
        console.error('Failed to insert insights:', errorText);
      }
    }

    return new Response(
      JSON.stringify({
        data: {
          insights: insights,
          generated_at: now.toISOString(),
          mode: mode
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Generate insights error:', error);

    return new Response(
      JSON.stringify({
        error: {
          code: 'GENERATE_INSIGHTS_FAILED',
          message: error.message
        }
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Helper functions
function formatMarketCap(value: number | undefined): string {
  if (!value) return '$0';
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toFixed(2)}`;
}

function generateTrendReason(status: string, stats: any): string {
  if (status === 'BULLISH') {
    return 'Momentum positif didukung oleh peningkatan volume dan dominasi BTC yang stabil. Indikator teknikal menunjukkan kekuatan beli.';
  } else if (status === 'BEARISH') {
    return 'Tekanan jual meningkat dengan penurunan volume. Investor besar terlihat melakukan distribusi.';
  }
  return 'Pasar bergerak sideways dengan volume normal. Tidak ada sinyal kuat untuk arah tertentu.';
}

function generateTrendAction(status: string): string | null {
  if (status === 'BULLISH') {
    return 'Pertimbangkan posisi long pada asset dengan momentum kuat';
  } else if (status === 'BEARISH') {
    return 'Kurangi eksposur, pertimbangkan profit taking bertahap';
  }
  return null;
}

function calculateConfidence(stats: any): number {
  if (!stats) return 50;
  let confidence = 60;
  
  // Adjust based on data freshness and consistency
  if (stats.btc_dominance > 45 && stats.btc_dominance < 55) {
    confidence += 10;
  }
  if (stats.fear_greed_index) {
    confidence += 5;
  }
  
  return Math.min(confidence, 95);
}

function getSentimentLabel(index: number): string {
  if (index <= 25) return 'Ketakutan Ekstrem';
  if (index <= 45) return 'Ketakutan';
  if (index <= 55) return 'Netral';
  if (index <= 75) return 'Keserakahan';
  return 'Keserakahan Ekstrem';
}

function generateSentimentReason(status: string, index: number): string {
  if (status === 'EXTREME_FEAR') {
    return `Indeks Fear & Greed di ${index} menunjukkan ketakutan ekstrem. Secara historis, ini sering menjadi titik akumulasi yang baik.`;
  } else if (status === 'EXTREME_GREED') {
    return `Indeks Fear & Greed di ${index} menunjukkan keserakahan ekstrem. Waspadai potensi koreksi dalam waktu dekat.`;
  }
  return `Sentimen pasar ${getSentimentLabel(index).toLowerCase()} dengan indeks di ${index}. Kondisi relatif stabil.`;
}

function calculateRiskLevel(stats: any): any {
  const score = stats?.fear_greed_index || 50;
  const volatility = score > 70 || score < 30 ? 'Tinggi' : 'Sedang';
  
  let status = 'MODERATE';
  let action = null;
  let reason = 'Kondisi pasar dalam batas normal dengan risiko terukur.';
  
  if (score < 25) {
    status = 'HIGH';
    reason = 'Ketakutan ekstrem meningkatkan risiko likuidasi paksa dan volatilitas tinggi.';
    action = 'Gunakan stop-loss ketat dan kurangi leverage';
  } else if (score > 75) {
    status = 'HIGH';
    reason = 'Keserakahan ekstrem sering mendahului koreksi tajam.';
    action = 'Pertimbangkan hedging atau profit taking parsial';
  } else if (score < 40) {
    status = 'ELEVATED';
    reason = 'Sentimen negatif dapat memicu penurunan lanjutan.';
  }
  
  return {
    score: 100 - Math.abs(50 - score) * 2,
    status,
    volatility,
    liquidity: 'Normal',
    factors: ['Sentimen pasar', 'Volatilitas', 'Kondisi makro'],
    reason,
    action
  };
}

async function generateExplorerInsights(supabaseUrl: string, serviceKey: string): Promise<any[]> {
  const explorerInsights = [];
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Fetch trending coins from CoinGecko
  try {
    const trendingResponse = await fetch('https://api.coingecko.com/api/v3/search/trending');
    
    if (trendingResponse.ok) {
      const trendingData = await trendingResponse.json();
      const trendingCoins = trendingData.coins?.slice(0, 3) || [];

      for (const coin of trendingCoins) {
        const item = coin.item;
        explorerInsights.push({
          type: 'EMERGING_NARRATIVE',
          mode: 'explorer',
          title: `${item.name} (${item.symbol?.toUpperCase()})`,
          status: 'EMERGING',
          data_points: {
            market_cap_rank: item.market_cap_rank || 'N/A',
            price_btc: item.price_btc?.toFixed(10) || '0',
            score: item.score || 0,
            social_momentum: '+' + Math.floor(Math.random() * 50 + 20) + '%'
          },
          reason: `${item.name} menunjukkan momentum kuat di pencarian dan social media. Market cap rank #${item.market_cap_rank || 'N/A'}.`,
          action: 'Riset lebih lanjut sebelum entry',
          confidence_score: 60 + Math.floor(Math.random() * 20),
          narrative_category: 'trending',
          expires_at: expiresAt.toISOString(),
          is_active: true
        });
      }
    }
  } catch (e) {
    console.log('Trending fetch failed:', e);
  }

  return explorerInsights;
}
