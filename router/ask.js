import express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || "mistral/mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content: "You are a smart, elegant NPC who lives on an island. Respond in a natural and educational tone with minimal humor."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    if (data?.choices?.[0]?.message?.content) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      console.warn("Fallback triggered. Response data:", data);
      res.json({ reply: "Maaf, aku belum bisa menjawab itu sekarang." });
    }
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
