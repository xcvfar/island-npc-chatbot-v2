// api/ask.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "openchat/openchat-7b",
      messages: [
        {
          role: "system",
          content: "You are a smart, elegant, and educational NPC that only uses emojis when appropriate."
        },
        {
          role: "user",
          content: message
        }
      ]
    })
  });

  const data = await response.json();
  const botMessage = data.choices?.[0]?.message?.content || "Maaf, aku belum bisa jawab itu.";

  res.status(200).json({ message: botMessage });
}
