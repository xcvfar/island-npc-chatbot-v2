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
        content: "You are Farzin Ganteng, a wise and calm character..."
      },
      {
        role: "user",
        content: message
      }
    ]
  })
});

const data = await response.json();

// Cek model dipakai beneran ga
if (!data.model.includes("mistral")) {
  console.warn("Fallback terdeteksi, ulangi dengan model paksa");

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
          content: "You are Farzin Ganteng, a wise and calm character..."
        },
        {
          role: "user",
          content: message
        }
      ]
    })
  });

  const retryData = await retry.json();
  return res.status(200).json(retryData);
}

return res.status(200).json(data);
