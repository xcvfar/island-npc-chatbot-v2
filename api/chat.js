export default async function handler(req, res) {
  const { message } = req.body;

  const model = "google/gemini-2.5-pro-exp-0325"; // Confirmed model name with hyphens

  console.log("=== INCOMING REQUEST ===");
  console.log("Body:", req.body);
  console.log("Using model:", model);
  console.log("========================");

  if (!message) {
    console.log("Error: Message is required.");
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "You are Farzin Ganteng, a wise and calm character who lives on a paradise island. You listen to people's problems with empathy, love watching sunsets, and only speak when necessary. Keep responses short, kind, and insightful.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);
      throw new Error(`OpenRouter API responded with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("OpenRouter API response:", data);

    // Check if the response contains the expected structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error("Unexpected response format:", data);
      throw new Error("Unexpected response format from OpenRouter API");
    }

    const aiResponse = data.choices[0].message.content.trim();
    console.log("Parsed AI response:", aiResponse);

    // Return the response in the format expected by Roblox
    res.setHeader("X-Debug-Model", model);
    res.status(200).json({ message: aiResponse });
  } catch (error) {
    console.error("OpenRouter error:", error.message);
    res.status(500).json({ error: "Sorry, I couldn't generate a response." });
  }
}
