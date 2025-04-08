export default async function handler(req, res) {
  const { message } = req.body;

  const model = "mistralai/Mistral-7B-Instruct:free";

  console.log("=== INCOMING REQUEST ===");
  console.log("Body:", req.body);
  console.log("Using model:", model);
  console.log("========================");

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are Farzin Ganteng, a calm, intelligent character who lives on a paradise island. You love sunsets, enjoy listening to people’s worries, and speak wisely but briefly. Always stay in character."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    res.setHeader("X-Debug-Model", model);
    res.status(200).json(data);
  } catch (error) {
    console.error("OpenRouter error:", error);
    res.status(500).json({ error: "Sorry, I couldn't generate a response." });
  }
}
