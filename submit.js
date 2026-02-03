// api/submit.js — DEBUG VERSION
// This version logs exactly what's failing so we can troubleshoot

export default async function handler(req, res) {
  // Log everything for debugging
  console.log('=== SUBMIT REQUEST ===');
  console.log('Method:', req.method);
  console.log('Body:', req.body);
  
  if (req.method !== 'POST') {
    console.log('ERROR: Wrong method');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;
  console.log('Google Script URL:', SCRIPT_URL ? 'SET (length: ' + SCRIPT_URL.length + ')' : 'NOT SET');
  
  if (!SCRIPT_URL) {
    console.log('ERROR: Environment variable missing');
    return res.status(500).json({ error: 'GOOGLE_APPS_SCRIPT_URL not configured' });
  }

  try {
    const body = req.body;
    body.submittedAt = new Date().toISOString();
    
    console.log('Sending to Google:', SCRIPT_URL);
    console.log('Payload:', JSON.stringify(body, null, 2));
    
    const upstream = await fetch(SCRIPT_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body)
    });

    console.log('Google response status:', upstream.status);
    const responseText = await upstream.text();
    console.log('Google response body:', responseText);

    if (!upstream.ok) {
      console.log('ERROR: Google script returned error');
      return res.status(502).json({ 
        error: 'Google script failed',
        status: upstream.status,
        details: responseText
      });
    }

    console.log('SUCCESS');
    return res.status(200).json({ ok: true });
    
  } catch (e) {
    console.log('ERROR: Exception thrown');
    console.log('Error details:', e.message);
    console.log('Stack:', e.stack);
    return res.status(500).json({ 
      error: 'Internal error',
      message: e.message 
    });
  }
}
