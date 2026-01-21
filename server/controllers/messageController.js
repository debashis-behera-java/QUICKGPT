import axios from "axios";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import imagekit from "../configs/imageKit.js";
import { geminiModel } from "../configs/gemini.js";



/* =========================
   TEXT MESSAGE CONTROLLER
========================= */
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

    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.json({ success: false, message: "Chat not found" });
    }

    // save user message
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    // 🔥 GEMINI CALL
    const result = await geminiModel.generateContent(prompt);
    const replyText = result.response.text();


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
  console.error("FULL GEMINI ERROR:", error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}

};


/* =========================
   IMAGE MESSAGE CONTROLLER
========================= */
export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message: "You don't have enough credits",
      });
    }

    const { prompt, chatId, isPublished } = req.body;

    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.json({
        success: false,
        message: "Chat not found",
      });
    }

    // Save user message
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    // Encode prompt
    const encodedPrompt = encodeURIComponent(prompt);

    // Generate ImageKit URL
    const imageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;

    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    const base64Image = `data:image/png;base64,${Buffer.from(
      imageResponse.data,
      "binary"
    ).toString("base64")}`;

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "quickgpt",
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished,
    };

    chat.messages.push(reply);
    await chat.save();

    await User.updateOne(
      { _id: userId },
      { $inc: { credits: -2 } }
    );

    res.json({ success: true, reply });
  } catch (error) {
    console.error("Image error:", error.message);

    res.json({
      success: false,
      message: error.message,
    });
  }
};
