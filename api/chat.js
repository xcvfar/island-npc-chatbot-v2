export default async function handler(req, res) {
  const { message } = req.body;
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: "GROQ API key is not configured." });
  }

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: "You are Farzin Ganteng, a calm NPC who lives on a beautiful island. Be wise, minimal, and empathetic.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API error:", data);
      return res.status(response.status).json({ error: data });
    }

    const botMessage = data.choices?.[0]?.message?.content || "Sorry, I don't know how to respond to that.";
    return res.status(200).json({ message: botMessage });

  } catch (error) {
    console.error("Fetch error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
