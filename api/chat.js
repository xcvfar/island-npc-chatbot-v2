export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const userMessage = req.body.message;

  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: userMessage
                }
              ]
            }
          ]
        })
      }
    );

    const result = await geminiResponse.json();
    const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, aku gak ngerti maksudmu.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error('Gemini API error:', err);
    res.status(500).json({ reply: 'Error dari server Gemini.' });
  }
}
