import axios from "axios";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import imagekit from "../configs/imageKit.js";
import grok from "../configs/grok.js";

// Text-based AI chat (GROK ONLY)
export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check credits
    if (req.user.credits < 1) {
      return res.json({
        success: false,
        message: "You don't have enough credits to use this feature",
      });
    }

    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      return res.json({ success: false, message: "Chat not found" });
    }

    // Save user message
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    // GROK API call
    const response = await grok.post("/chat/completions", {
      model: "grok-beta",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = {
      role: "assistant",
      content: response.data.choices[0].message.content,
      timestamp: Date.now(),
      isImage: false,
    };

    // Save AI reply
    chat.messages.push(reply);
    await chat.save();

    // Deduct 1 credit
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
