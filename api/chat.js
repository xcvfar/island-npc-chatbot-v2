export default async function handler(req, res) {
  console.log("[DEBUG] Incoming request to /api/chat");

  if (req.method !== "POST") {
    console.warn("[WARN] Method not allowed:", req.method);
    return res.status(405).json({ error: "Only POST requests allowed." });
  }

  try {
    const body = req.body;
    console.log("[DEBUG] Request body:", body);

    const userMessage = body?.message;
    if (!userMessage) {
      console.error("[ERROR] No message found in request body.");
      return res.status(400).json({ error: "Message is required." });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro-exp-03-25:free",
        messages: [
          { role: "system", content: "You are an elegant, educational assistant NPC. Respond clearly, professionally, and concisely." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const result = await response.json();
    console.log("[DEBUG] OpenRouter API raw response:", result);

    if (!response.ok) {
      console.error("[ERROR] OpenRouter API failed:", result);
      return res.status(response.status).json({ error: result.error || "AI request failed." });
    }

    const reply = result.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
    console.log("[DEBUG] Final AI reply:", reply);

    res.status(200).json({ reply });

  } catch (err) {
    console.error("[FATAL] Unexpected server error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
}
