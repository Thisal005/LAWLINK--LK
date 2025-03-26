import multer from "multer";
import path from "path";
import fs from "fs";
import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";
import Lawyer from "../models/lawyer.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message, nonce } = req.body; // Only encrypted message and nonce
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if ((!message || message.trim() === "") && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ error: "Message or documents are required" });
    }

    if (!receiverId || !senderId) {
      return res.status(400).json({ error: "Sender and receiver IDs are required" });
    }

    const sender = await User.findById(senderId) || await Lawyer.findById(senderId);
    const receiver = await User.findById(receiverId) || await Lawyer.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ error: "User not found" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const documentData = req.files
      ? req.files.map((file) => ({
          filename: file.filename,
          originalname: file.originalname,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size,
          encrypted: true,
        }))
      : [];

    const newMessage = new Message({
      senderId,
      receiverId,
      message: message || "", // Encrypted message
      nonce: nonce || "",
      documents: documentData,
      status: "sent",
    });

    conversation.messages.push(newMessage._id);
    await Promise.all([newMessage.save(), conversation.save()]);

    // Notify recipient via WebSocket
    const recipientWs = global.clients?.get(receiverId.toString());
    if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
      recipientWs.send(
        JSON.stringify({
          type: "message",
          message: {
            _id: newMessage._id,
            senderId,
            receiverId,
            message: newMessage.message,
            nonce: newMessage.nonce,
            documents: documentData,
            createdAt: newMessage.createdAt,
          },
        })
      );
    }

    res.status(200).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({
      error: "Failed to send message",
      message: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const sender = await User.findById(senderId) || await Lawyer.findById(senderId);
    const receiver = await User.findById(receiverId) || await Lawyer.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ error: "User not found" });
    }

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate({
      path: "messages",
      options: { sort: { createdAt: 1 } },
    });

    if (!conversation) {
      return res.status(200).json({ success: true, data: [] });
    }

    await Message.updateMany(
      {
        _id: { $in: conversation.messages.map((m) => m._id) },
        receiverId: senderId,
        status: "sent",
      },
      { $set: { status: "delivered" } }
    );

    res.status(200).json({
      success: true,
      data: conversation.messages,
    });
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({
      error: "Failed to fetch messages",
      message: error.message,
    });
  }
};

export const downloadDocument = async (req, res) => {
  try {
    const { messageId, documentIndex } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (
      message.senderId.toString() !== userId.toString() &&
      message.receiverId.toString() !== userId.toString()
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (!message.documents?.[documentIndex]) {
      return res.status(404).json({ error: "Document not found" });
    }

    const document = message.documents[documentIndex];
    const filePath = document.path;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found on server" });
    }

    res.setHeader("Content-Disposition", `attachment; filename="${document.originalname}"`);
    res.setHeader("Content-Type", document.mimetype);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Error in downloadDocument:", error);
    res.status(500).json({
      error: "Failed to download document",
      message: error.message,
    });
  }
};