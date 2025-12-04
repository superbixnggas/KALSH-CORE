// Manage Watchlist Edge Function
// Handles watchlist CRUD operations with user authentication

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
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

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Authorization required');
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify token and get user
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': serviceRoleKey
      }
    });

    if (!userResponse.ok) {
      throw new Error('Invalid token');
    }

    const userData = await userResponse.json();
    const userId = userData.id;

    const { action, symbol, name, category, notes, watchlistId } = await req.json();

    let result;

    switch (action) {
      case 'list':
        // Get user's watchlist
        const listResponse = await fetch(
          `${supabaseUrl}/rest/v1/watchlists?user_id=eq.${userId}&order=added_at.desc`,
          {
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey
            }
          }
        );
        result = await listResponse.json();
        break;

      case 'add':
        // Check if already in watchlist
        const checkResponse = await fetch(
          `${supabaseUrl}/rest/v1/watchlists?user_id=eq.${userId}&symbol=eq.${symbol}`,
          {
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey
            }
          }
        );
        const existing = await checkResponse.json();
        
        if (existing && existing.length > 0) {
          result = { message: 'Already in watchlist', item: existing[0] };
        } else {
          // Add to watchlist
          const addResponse = await fetch(`${supabaseUrl}/rest/v1/watchlists`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({
              user_id: userId,
              symbol: symbol.toUpperCase(),
              name: name || symbol,
              category: category || 'general',
              notes: notes || null
            })
          });
          const addResult = await addResponse.json();
          result = { message: 'Added to watchlist', item: addResult[0] };
        }
        break;

      case 'remove':
        // Remove from watchlist
        await fetch(
          `${supabaseUrl}/rest/v1/watchlists?id=eq.${watchlistId}&user_id=eq.${userId}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey
            }
          }
        );
        result = { message: 'Removed from watchlist' };
        break;

      case 'update':
        // Update watchlist item
        const updateResponse = await fetch(
          `${supabaseUrl}/rest/v1/watchlists?id=eq.${watchlistId}&user_id=eq.${userId}`,
          {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({
              notes: notes,
              category: category
            })
          }
        );
        result = await updateResponse.json();
        break;

      default:
        throw new Error('Invalid action');
    }

    return new Response(
      JSON.stringify({ data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Watchlist error:', error);
    return new Response(
      JSON.stringify({ error: { code: 'WATCHLIST_ERROR', message: error.message } }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
