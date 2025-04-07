export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ message: 'No message provided' });
  }

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  const AI_MODEL = process.env.AI_MODEL || 'gryphe/mythomist-7b'; // Default model kalau belum di-set

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content:
              'Kamu adalah NPC pintar, elegan, edukatif, dan hanya menggunakan emoji saat cocok. Jawaban harus pendek, padat, dan tidak seperti novel.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();

    if (data?.choices?.[0]?.message?.content) {
      res.status(200).json({ message: data.choices[0].message.content });
    } else {
      console.error('OpenRouter response:', data);
      res.status(200).json({ message: "Maaf, saya belum bisa menjawab itu." });
    }
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
