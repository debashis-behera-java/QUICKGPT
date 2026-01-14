import axios from "axios";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import imagekit from "../configs/imageKit.js";
import grok from "../configs/grok.js";

// =======================
// TEXT MESSAGE CONTROLLER
// =======================
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

    const response = await grok.post("/chat/completions", {
      model: "grok-beta",
      messages: [{ role: "user", content: prompt }],
    });

    const reply = {
      role: "assistant",
      content: response.data.choices[0].message.content,
      timestamp: Date.now(),
      isImage: false,
    };

    chat.messages.push(reply);
    await chat.save();

    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });

    res.json({ success: true, reply });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// =======================
// IMAGE MESSAGE CONTROLLER
// =======================
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

    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;

    const imgResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    const base64Image = `data:image/png;base64,${Buffer.from(
      imgResponse.data
    ).toString("base64")}`;

    const upload = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "quickgpt",
    });

    const reply = {
      role: "assistant",
      content: upload.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished,
    };

    chat.messages.push(reply);
    await chat.save();

    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

    res.json({ success: true, reply });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
