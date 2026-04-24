import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { QueryClient } from "@tanstack/react-query";
import { Chat, Message, MessageSender, User } from "@/types";
import * as Sentry from "@sentry/react-native";

const SOCKET_URL = "https://chat-app-dnxs.onrender.com";

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
  typingUsers: Map<string, string>; // chatId -> userId
  unreadChats: Set<string>;
  currentChatId: string | null;
  queryClient: QueryClient | null;

  connect: (token: string, queryClient: QueryClient) => void;
  disconnect: () => void;
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  sendMessage: (chatId: string, text: string, currentUser: MessageSender) => void;
  sendTyping: (chatId: string, isTyping: boolean) => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
  typingUsers: new Map(),
  unreadChats: new Set(),
  currentChatId: null,
  queryClient: null,

  connect: (token, queryClient) => {
    const existingSocket = get().socket;
    if (existingSocket?.connected) return;

    if (existingSocket) existingSocket.disconnect();

    const socket = io(SOCKET_URL, { auth: { token } });

    socket.on("connect", () => {
      console.log("Socket connected, id:", socket.id);
      Sentry.logger.info("Socket connected", { socketId: socket.id });
      set({ isConnected: true });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnect", socket.id);
      Sentry.logger.info("Socket disconnect", { socketId: socket.id });
      set({ isConnected: false });
    });

    socket.on("online-users", ({ userIds }: { userIds: string[] }) => {
      console.log("Received online-users:", userIds);
      set({ onlineUsers: new Set(userIds) });
    });

    socket.on("user-online", ({ userId }: { userId: string }) => {
      set((state) => ({
        onlineUsers: new Set([...state.onlineUsers, userId]),
      }));
    });

    socket.on("user-offline", ({ userId }: { userId: string }) => {
      set((state) => {
        const onlineUsers = new Set(state.onlineUsers);
        onlineUsers.delete(userId);
        return { onlineUsers: onlineUsers };
      });
    });

    socket.on("socket-error", (error: { message: string }) => {
      console.error("Socket error:", error.message);
      Sentry.logger.error("Socket error occurred", {
        message: error.message,
      });
    });

    socket.on("new-message", (message: Message) => {
      const senderId = (message.sender as MessageSender)._id;
      const { currentChatId, queryClient } = get();

      if (!queryClient) return;

      // add message to the chat's message list, replacing optimistic messages
      queryClient.setQueryData<Message[]>(["messages", message.chat], (old) => {
        if (!old) return [message];

        // If it's our own message, we look for a temp message with the same content to replace
        // This is a heuristic since we don't have correlation IDs from the server yet
        const isFromMe = senderId === (queryClient.getQueryData<User>(["currentUser"])?._id);

        if (isFromMe) {
          const tempIndex = old.findIndex(m => m._id.startsWith("temp-") && m.text === message.text);
          if (tempIndex !== -1) {
            const newList = [...old];
            newList[tempIndex] = message; // replace temp with real message
            return newList;
          }
        }

        // If not ours or no match found, just add it and filter duplicates
        if (old.some((m) => m._id === message._id)) return old;
        return [...old, message];
      });

      // mark as unread if not currently viewing this chat and message is from other user
      if (currentChatId !== message.chat) {
        const chats = queryClient.getQueryData<Chat[]>(["chats"]);
        const chat = chats?.find((c) => c._id === message.chat);
        if (chat?.participant && senderId === chat.participant._id) {
          set((state) => ({
            unreadChats: new Set([...state.unreadChats, message.chat]),
          }));
        }
      }

      // clear typing indicator when message received
      set((state) => {
        const typingUsers = new Map(state.typingUsers);
        typingUsers.delete(message.chat);
        return { typingUsers: typingUsers };
      });
    });

    socket.on(
      "typing",
      ({ userId, chatId, isTyping }: { userId: string; chatId: string; isTyping: boolean }) => {
        set((state) => {
          const typingUsers = new Map(state.typingUsers);
          if (isTyping) typingUsers.set(chatId, userId);
          else typingUsers.delete(chatId);

          return { typingUsers: typingUsers };
        });
      }
    );

    set({ socket, queryClient });
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({
        socket: null,
        isConnected: false,
        onlineUsers: new Set(),
        typingUsers: new Map(),
        unreadChats: new Set(),
        currentChatId: null,
        queryClient: null,
      });
    }
  },
  joinChat: (chatId) => {
    const socket = get().socket;
    set((state) => {
      const unreadChats = new Set(state.unreadChats);
      unreadChats.delete(chatId);
      return { currentChatId: chatId, unreadChats: unreadChats };
    });

    if (socket?.connected) {
      socket.emit("join-chat", chatId);
    }
  },
  leaveChat: (chatId) => {
    const { socket } = get();
    set({ currentChatId: null });
    if (socket?.connected) {
      socket.emit("leave-chat", chatId);
    }
  },
  sendMessage: (chatId, text, currentUser) => {
    const { socket, queryClient } = get();
    if (!socket?.connected || !queryClient) return;

    // optimistic updates
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      _id: tempId,
      chat: chatId,
      sender: currentUser,
      text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // add optimistic message immediately
    queryClient.setQueryData<Message[]>(["messages", chatId], (old) => {
      if (!old) return [optimisticMessage];
      return [...old, optimisticMessage];
    });

    socket.emit("send-message", { chatId, text }, (ack: any) => {
      console.log("Message ack received from server:", ack);
      // If server returns the real message, we could replace specifically here
    });

    console.log("✅ Message emitted safely to socket:", { chatId, textLength: text.length });
    Sentry.logger.info("Message sent successfully", { chatId, messageLength: text.length });

    const errorHandler = (error: { message: string }) => {
      Sentry.logger.error("Failed to send message", {
        chatId,
        error: error.message,
      });
      queryClient.setQueryData<Message[]>(["messages", chatId], (old) => {
        if (!old) return [];
        return old.filter((m) => m._id !== tempId);
      });
      socket.off("socket-error", errorHandler);
    };

    socket.once("socket-error", errorHandler);
  },

  sendTyping: (chatId, isTyping) => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit("typing", { chatId, isTyping });
    }
  },
}));