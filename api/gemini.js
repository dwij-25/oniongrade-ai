export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY in server environment.' });
  }

  let requestBody = req.body;
  if (typeof requestBody === 'string') {
    try {
      requestBody = JSON.parse(requestBody);
    } catch (e) {
      // keep raw string
    }
  }

  // Active verified Gemini models with fallback priority
  const models = [
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-3.6-flash",
    "gemini-3.8-flash",
    "gemini-flash-latest"
  ];

  let lastError = null;
  let lastStatus = 500;

  for (const model of models) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        return res.status(200).json(data);
      }

      const errorText = await response.text();
      console.warn(`[Proxy] Model ${model} returned ${response.status}:`, errorText.slice(0, 160));
      lastStatus = response.status;
      lastError = errorText;

      // If client payload is fundamentally invalid, return right away
      if (response.status === 400 && errorText.includes('INVALID_ARGUMENT') && !errorText.includes('model')) {
        return res.status(400).json({ error: 'Invalid argument', details: errorText });
      }
    } catch (err) {
      console.warn(`[Proxy] Error calling ${model}:`, err.message);
      lastError = err.message;
    }
  }

  return res.status(lastStatus || 500).json({
    error: 'All Gemini models in proxy failed',
    details: lastError
  });
}
