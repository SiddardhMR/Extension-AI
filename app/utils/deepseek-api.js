const API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || "your-deepseek-api-key"

export async function generateAIResponse(
  prompt,
  systemMessage = "You are a fun, creative AI assistant for a boredom-busting app. Be entertaining, witty, and engaging while keeping responses concise.",
) {
  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt },
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || "AI is taking a creative break!"
  } catch (error) {
    console.error("DeepSeek API Error:", error)
    throw error
  }
}
