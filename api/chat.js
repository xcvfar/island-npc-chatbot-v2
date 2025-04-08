export default async function handler(req, res) {
  const { message } = req.body;

  const model = "mistralai/mistral-7b-instruct:free";

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
            content: "You are Farzin Ganteng, a wise and calm character who lives on a paradise island..."
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    // Kalau fallback terjadi (misal model bukan yang kita request)
    const actualModel = data?.model ?? "";
    if (!actualModel.includes("mistral")) {
      console.warn("Fallback detected, retrying with Mistral 7B...");

      // Ulangi request ke model yang kita mau
      const retry = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            {
              role: "system",
              content: "You are Farzin Ganteng, a wise and calm character who lives on a paradise island..."
            },
            { role: "user", content: message }
          ]
        })
      });

      const retryData = await retry.json();
      return res.status(200).json(retryData);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("OpenRouter error:", error);
    res.status(500).json({ error: "Sorry, I couldn't generate a response." });
  }
}
