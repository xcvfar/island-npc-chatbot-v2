import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content:
            "You are Farzin Ganteng, a calm and wise character who lives on a paradise island. Keep your responses short, thoughtful, and peaceful.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = chatCompletion.choices[0]?.message?.content || "Maaf, aku tidak mengerti.";
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Groq SDK error:", error);
    res.status(500).json({ error: "Something went wrong with Groq." });
  }
}
