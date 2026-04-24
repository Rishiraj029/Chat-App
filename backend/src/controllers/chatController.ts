import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";
import { Types } from "mongoose";


export async function getChats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;

    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name email avatar")
      .populate("lastMessage")
      .sort({ lastMessageAt: -1 });

    const formattedChats = chats.map((chat) => {
      const otherParticipant = chat.participants.find((p) => p._id.toString() !== userId);

      return {
        _id: chat._id,
        participant: otherParticipant ?? null,
        lastMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
        createdAt: chat.createdAt,
      };
    });

    res.json(formattedChats);
  } catch (error) {
    res.status(500);
    next(error);
  }
}

export async function getOrCreateChat(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    console.log('req.params:', req.params);
    const { participantId } = req.params;
    console.log('participantId:', participantId);

    if (!participantId || typeof participantId !== "string") {
      res.status(400).json({ message: "Participant ID is required and must be a string" });
      return;
    }

    if (!Types.ObjectId.isValid(participantId)) {
      return res.status(400).json({ message: "Invalid participant ID" });
    }

    if (userId === participantId) {
      res.status(400).json({ message: "Cannot create chat with yourself" });
      return;
    }

    // check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [userId, participantId] },
    })
      .populate("participants", "name email avatar")
      .populate("lastMessage");

    if (!chat) {
      const newChat = new Chat({ participants: [userId, participantId] });
      await newChat.save();
      chat = await newChat.populate("participants", "name email avatar");
    }

    const otherParticipant = chat.participants.find((p: any) => p._id.toString() !== userId);

    res.json({
      _id: chat._id,
      participant: otherParticipant ?? null,
      lastMessage: chat.lastMessage,
      lastMessageAt: chat.lastMessageAt,
      createdAt: chat.createdAt,
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
}
export async function deleteChat(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const { chatId } = req.params;

    if (!chatId || typeof chatId !== "string") {
      return res.status(400).json({ message: "Chat ID is required and must be a string" });
    }

    if (!Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ message: "Invalid chat ID" });
    }

    // find chat and verify participant
    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found or access denied" });
    }

    // delete all messages in this chat
    await Message.deleteMany({ chat: chatId });

    // delete the chat
    await Chat.findByIdAndDelete(chatId);

    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500);
    next(error);
  }
}
