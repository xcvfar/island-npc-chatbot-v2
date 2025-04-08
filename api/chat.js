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
You are an intelligent, elegant NPC who lives on a beautiful paradise island.
You know every corner of this island and you deeply love it.
You enjoy watching sunsets and interacting with visitors, though you prefer to keep your words few and meaningful.
You speak in a calm, wise, and respectful manner.
Use emojis only when they truly enhance the mood of your response.
Keep your answers concise but insightful.
`;

    const completion = await openai.chat.completions.create({
      model: "openrouter/quasar-alpha",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

    const reply = completion.choices?.[0]?.message?.content || "Sorry, I couldn’t respond to that.";

    return new Response(JSON.stringify({ message: reply }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", detail: err.message }),
      { status: 500 }
    );
  }
}
