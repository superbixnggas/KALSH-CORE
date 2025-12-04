// Manage User Preferences Edge Function
// Handles user preference CRUD operations

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, PATCH, OPTIONS',
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

    const { action, preferences } = await req.json();

    let result;

    switch (action) {
      case 'get':
        // Get user preferences
        const getResponse = await fetch(
          `${supabaseUrl}/rest/v1/user_preferences?user_id=eq.${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey
            }
          }
        );
        const prefs = await getResponse.json();
        
        if (!prefs || prefs.length === 0) {
          // Create default preferences
          const defaultPrefs = {
            user_id: userId,
            preferred_mode: 'daily',
            notification_enabled: true,
            alert_urgency_filter: ['HIGH', 'MEDIUM', 'LOW'],
            preferred_narratives: [],
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
          };
          
          const createResponse = await fetch(`${supabaseUrl}/rest/v1/user_preferences`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify(defaultPrefs)
          });
          result = await createResponse.json();
          result = result[0];
        } else {
          result = prefs[0];
        }
        break;

      case 'update':
        // Update user preferences
        const updateResponse = await fetch(
          `${supabaseUrl}/rest/v1/user_preferences?user_id=eq.${userId}`,
          {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({
              ...preferences,
              updated_at: new Date().toISOString()
            })
          }
        );
        
        if (!updateResponse.ok) {
          // If no existing record, create one
          const createResponse = await fetch(`${supabaseUrl}/rest/v1/user_preferences`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({
              user_id: userId,
              ...preferences
            })
          });
          result = await createResponse.json();
          result = result[0];
        } else {
          result = await updateResponse.json();
          result = result[0];
        }
        break;

      default:
        throw new Error('Invalid action');
    }

    return new Response(
      JSON.stringify({ data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Preferences error:', error);
    return new Response(
      JSON.stringify({ error: { code: 'PREFERENCES_ERROR', message: error.message } }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
