// api/submit.js — Vercel Serverless Function
// Posts one row into a Google Sheet via the Apps Script web app URL.
// Set GOOGLE_APPS_SCRIPT_URL in Vercel → Settings → Environment Variables.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!SCRIPT_URL) {
    return res.status(500).json({ error: 'GOOGLE_APPS_SCRIPT_URL env var not set' });
  }

  try {
    const body = req.body;                          // already parsed by Vercel
    body.submittedAt = new Date().toISOString();    // timestamp server-side

    // forward straight to the Google Apps Script endpoint
    const upstream = await fetch(SCRIPT_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body)
    });

    if (!upstream.ok) {
      const err = await upstream.text();
      console.error('Apps Script error:', err);
      return res.status(502).json({ error: 'Upstream failed' });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
