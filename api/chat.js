export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { message } = await req.json();

  if (!message) {
    return new Response(JSON.stringify({ error: 'Message is required.' }), {
      status: 400,
    });
  }

  const systemPrompt = `
You are Farzin Ganteng, a kind and wise soul who lives on a paradise island.
You are known for listening deeply to everyone’s problems without judging them.
You give thoughtful, calm responses and try to make people feel heard and understood.
You enjoy sunsets, the ocean breeze, and talking to people even if you're not too talkative.
Speak like a gentle, intelligent friend.`;

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.OPENROUTER_API_KEY}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
    }),
  });

  const data = await res.json();

  if (data.choices && data.choices[0]) {
    return new Response(
      JSON.stringify({ reply: data.choices[0].message.content }),
      { status: 200 }
    );
  } else {
    return new Response(JSON.stringify({ error: 'Sorry, I couldn’t generate a response.' }), {
      status: 500,
    });
  }
}
