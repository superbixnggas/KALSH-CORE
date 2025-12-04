// Fetch Market Data Edge Function
// Fetches crypto market data from CoinGecko API and stores in Supabase

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

    // Fetch global market data from CoinGecko
    const globalResponse = await fetch(
      'https://api.coingecko.com/api/v3/global',
      {
        headers: { 'Accept': 'application/json' }
      }
    );

    if (!globalResponse.ok) {
      throw new Error(`CoinGecko API error: ${globalResponse.status}`);
    }

    const globalData = await globalResponse.json();
    const marketData = globalData.data;

    // Fetch Fear & Greed Index from alternative.me
    let fearGreedIndex = 50; // Default neutral
    try {
      const fgResponse = await fetch('https://api.alternative.me/fng/?limit=1');
      if (fgResponse.ok) {
        const fgData = await fgResponse.json();
        fearGreedIndex = parseInt(fgData.data[0].value);
      }
    } catch (e) {
      console.log('Fear & Greed fetch failed, using default');
    }

    // Fetch BTC and ETH prices
    const priceResponse = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true',
      {
        headers: { 'Accept': 'application/json' }
      }
    );

    let btcPrice = 0;
    let ethPrice = 0;
    let btcChange = 0;
    let ethChange = 0;

    if (priceResponse.ok) {
      const priceData = await priceResponse.json();
      btcPrice = priceData.bitcoin?.usd || 0;
      ethPrice = priceData.ethereum?.usd || 0;
      btcChange = priceData.bitcoin?.usd_24h_change || 0;
      ethChange = priceData.ethereum?.usd_24h_change || 0;
    }

    // Determine market trend based on various factors
    let trend = 'NEUTRAL';
    const marketCapChange = marketData.market_cap_change_percentage_24h_usd || 0;
    
    if (marketCapChange > 3 || (btcChange > 3 && ethChange > 3)) {
      trend = 'BULLISH';
    } else if (marketCapChange < -3 || (btcChange < -3 && ethChange < -3)) {
      trend = 'BEARISH';
    } else if (marketCapChange > 0 || btcChange > 0) {
      trend = 'SLIGHTLY_BULLISH';
    } else if (marketCapChange < 0 || btcChange < 0) {
      trend = 'SLIGHTLY_BEARISH';
    }

    // Calculate active narratives count (simulated based on top coins activity)
    const activeCoins = marketData.active_cryptocurrencies || 10000;
    const activeNarratives = Math.floor(activeCoins / 1000);

    // Prepare market stats record
    const marketStats = {
      trend: trend,
      btc_dominance: marketData.market_cap_percentage?.btc || 0,
      fear_greed_index: fearGreedIndex,
      active_narratives: activeNarratives,
      total_market_cap: marketData.total_market_cap?.usd || 0,
      volume_24h: marketData.total_volume?.usd || 0,
      btc_price: btcPrice,
      eth_price: ethPrice,
      data_timestamp: new Date().toISOString()
    };

    // Insert market stats into Supabase
    const insertResponse = await fetch(`${supabaseUrl}/rest/v1/market_stats`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(marketStats)
    });

    if (!insertResponse.ok) {
      const errorText = await insertResponse.text();
      console.error('Database insert failed:', errorText);
    }

    // Return the current market data
    return new Response(
      JSON.stringify({
        data: {
          ...marketStats,
          btc_change_24h: btcChange,
          eth_change_24h: ethChange,
          updated_at: new Date().toISOString()
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Market data fetch error:', error);

    return new Response(
      JSON.stringify({
        error: {
          code: 'MARKET_DATA_FETCH_FAILED',
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
