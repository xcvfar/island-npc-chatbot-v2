import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});

export const config = {
  runtime: "edge"
};

export default async function handler(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required." }), {
        status: 400
      });
    }

    const systemPrompt = `
You are Farzin Ganteng, a wise and elegant character living on a tropical paradise island.
You deeply understand this island's history, nature, and hidden spots.
You love watching sunsets, value silence, and enjoy short yet meaningful conversations with visitors.
Speak calmly, intellectually, and don’t overtalk.
Use emojis only if they match the emotion.
Your tone is friendly but reserved.
`;

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

    const reply = completion.choices?.[0]?.message?.content || "Sorry, I couldn't respond to that.";

    return new Response(JSON.stringify({ message: reply }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({
      error: "Internal Server Error",
      detail: err.message
    }), {
      status: 500
    });
  }
}
