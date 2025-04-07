// File: api/ask.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'Missing message in request body' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.AI_MODEL || 'gryphe/mythomist-7b'; // default gratisan, no skripsi

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://island-npc-chatbot-v2.vercel.app/', // ubah ke domain kamu
        'X-Title': 'Island NPC Chatbot'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: "Kamu adalah NPC cerdas dan elegan di sebuah pulau tropis. Jawabanmu edukatif, tidak terlalu panjang, tidak terlalu humoris, dan gunakan emoji hanya saat cocok."
          },
          {
            role: 'user',
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    const reply = data.choices?.[0]?.message?.content || "Maaf, saya belum bisa jawab itu.";
    res.status(200).json({ message: reply });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Something went wrong with the chatbot.' });
  }
}
