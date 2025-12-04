// Fetch Whale Alerts Edge Function
// Generates simulated whale activity alerts based on market data

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

    // Fetch latest market data for context
    const priceResponse = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,avalanche-2,matic-network&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true'
    );

    let priceData: any = {};
    if (priceResponse.ok) {
      priceData = await priceResponse.json();
    }

    const alerts = [];
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours

    // Generate alerts based on price movements and volume
    const coins = [
      { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
      { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
      { id: 'solana', symbol: 'SOL', name: 'Solana' },
      { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche' },
      { id: 'matic-network', symbol: 'MATIC', name: 'Polygon' }
    ];

    for (const coin of coins) {
      const data = priceData[coin.id];
      if (!data) continue;

      const change24h = data.usd_24h_change || 0;
      const volume24h = data.usd_24h_vol || 0;

      // Generate volume spike alert for high volume
      if (volume24h > 1e9) {
        const urgency = change24h > 5 ? 'HIGH' : change24h > 2 ? 'MEDIUM' : 'LOW';
        
        alerts.push({
          type: 'VOLUME_SPIKE',
          urgency: urgency,
          title: `Volume Spike Terdeteksi - ${coin.symbol}`,
          trigger_info: {
            volume_24h: formatVolume(volume24h),
            price: `$${data.usd?.toLocaleString()}`,
            change_24h: `${change24h > 0 ? '+' : ''}${change24h.toFixed(2)}%`
          },
          context: {
            description: `Volume trading ${coin.name} meningkat signifikan dalam 24 jam terakhir`,
            potential_cause: change24h > 0 ? 'Akumulasi aktif' : 'Distribusi atau panic selling'
          },
          symbol: coin.symbol,
          expires_at: expiresAt.toISOString(),
          is_active: true
        });
      }

      // Generate whale entry alert for significant price movements
      if (Math.abs(change24h) > 3) {
        const isPositive = change24h > 0;
        const urgency = Math.abs(change24h) > 8 ? 'HIGH' : Math.abs(change24h) > 5 ? 'MEDIUM' : 'LOW';

        alerts.push({
          type: 'WHALE_MOVEMENT',
          urgency: urgency,
          title: `${isPositive ? 'Whale Entry' : 'Whale Exit'} - ${coin.symbol}`,
          trigger_info: {
            movement_type: isPositive ? 'ACCUMULATION' : 'DISTRIBUTION',
            price_impact: `${change24h > 0 ? '+' : ''}${change24h.toFixed(2)}%`,
            current_price: `$${data.usd?.toLocaleString()}`
          },
          context: {
            analysis: isPositive 
              ? `Large wallets terdeteksi melakukan akumulasi ${coin.name}`
              : `Smart money terlihat mengurangi posisi ${coin.name}`,
            signal_strength: Math.abs(change24h) > 5 ? 'Kuat' : 'Moderat'
          },
          symbol: coin.symbol,
          expires_at: expiresAt.toISOString(),
          is_active: true
        });
      }
    }

    // Generate sentiment shift alert based on overall market
    const btcChange = priceData.bitcoin?.usd_24h_change || 0;
    if (Math.abs(btcChange) > 4) {
      alerts.push({
        type: 'SENTIMENT_SHIFT',
        urgency: Math.abs(btcChange) > 7 ? 'HIGH' : 'MEDIUM',
        title: `Perubahan Sentimen Pasar ${btcChange > 0 ? 'Positif' : 'Negatif'}`,
        trigger_info: {
          btc_change: `${btcChange > 0 ? '+' : ''}${btcChange.toFixed(2)}%`,
          direction: btcChange > 0 ? 'BULLISH' : 'BEARISH',
          market_impact: 'Signifikan'
        },
        context: {
          description: `Sentimen pasar crypto bergeser ${btcChange > 0 ? 'positif' : 'negatif'} dengan BTC sebagai indikator utama`,
          recommendation: btcChange > 0 
            ? 'Pertimbangkan eksposur pada altcoin dengan korelasi tinggi'
            : 'Waspadai koreksi lanjutan, perketat risk management'
        },
        symbol: 'MARKET',
        expires_at: expiresAt.toISOString(),
        is_active: true
      });
    }

    // Limit to most recent/important alerts
    const topAlerts = alerts
      .sort((a, b) => {
        const urgencyOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        return urgencyOrder[a.urgency as keyof typeof urgencyOrder] - urgencyOrder[b.urgency as keyof typeof urgencyOrder];
      })
      .slice(0, 10);

    // Insert alerts into database
    if (topAlerts.length > 0) {
      // Deactivate old alerts first
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

      // Insert new alerts
      const insertResponse = await fetch(`${supabaseUrl}/rest/v1/alerts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(topAlerts)
      });

      if (!insertResponse.ok) {
        const errorText = await insertResponse.text();
        console.error('Failed to insert alerts:', errorText);
      }
    }

    return new Response(
      JSON.stringify({
        data: {
          alerts: topAlerts,
          generated_at: now.toISOString(),
          total_count: topAlerts.length
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Whale alerts error:', error);

    return new Response(
      JSON.stringify({
        error: {
          code: 'WHALE_ALERTS_FAILED',
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

function formatVolume(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toFixed(2)}`;
}
