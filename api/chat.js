export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const userMessage = req.body.message;

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API key not found' });
  }

  try {
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userMessage }] }]
      })
    });

    const data = await geminiRes.json();
    const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, aku belum ngerti maksudnya.";

    res.status(200).json({ reply: botReply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: 'Waduh, error gan.' });
  }
}
