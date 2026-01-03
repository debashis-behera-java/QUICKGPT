import Chat from "../models/Chat.js";
import User from "../models/User.js";
import openai from "../configs/openai.js";

// Text-based AI chat
export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 1) {
      return res.json({
        success: false,
        message: "You don't have enough credits",
      });
    }

    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      return res.json({ success: false, message: "Chat not found" });
    }

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    // ✅ NEW Responses API (Vercel safe)
    const response = await openai.responses.create({
      model: "gemini-2.0-flash",
      input: prompt,
    });

    const replyText =
      response.output_text || "No response from AI";

    const reply = {
      role: "assistant",
      content: replyText,
      timestamp: Date.now(),
      isImage: false,
    };

    chat.messages.push(reply);
    await chat.save();

    await User.updateOne(
      { _id: userId },
      { $inc: { credits: -1 } }
    );

    res.json({ success: true, reply });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
