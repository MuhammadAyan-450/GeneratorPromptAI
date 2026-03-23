export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: "Server misconfigured: API key missing" });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err.error?.message || "Groq API error" });
    }

    const data = await response.json();
    res.status(200).json(data.choices[0].message);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error connecting to Groq API" });
  }
}
