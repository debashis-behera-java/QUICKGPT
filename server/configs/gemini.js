import axios from "axios";

export async function generateText(messages) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "nvidia/nemotron-3-super-120b-a12b:free",
        messages: messages
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "QuickGPT"
        }
      }
    );

    if (!response.data || !response.data.choices?.length) {
      return "⚠️ No response from AI";
    }

    return response.data.choices[0].message.content;

  } catch (error) {
    console.error("🔥 OpenRouter ERROR:", error.response?.data || error.message);
    throw error;
  }
}