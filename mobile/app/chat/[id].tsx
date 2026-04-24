import EmptyUI from "@/components/EmptyUI";
import MessageBubble from "@/components/MessageBubble";
import { useCurrentUser } from "@/hooks/useAuth";
import { useMessages } from "@/hooks/useMessages";
import { useSocketStore } from "@/lib/socket";
import { MessageSender } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ChatParams = {
  id: string;
  participantId: string;
  name: string;
  avatar: string;
};

const ChatDetailScreen = () => {
  const router = useRouter();
  const { id: chatId, avatar, name, participantId } = useLocalSearchParams<ChatParams>();

  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const { data: currentUser } = useCurrentUser();
  const { data: messages, isLoading } = useMessages(chatId);

  const { joinChat, leaveChat, sendMessage, sendTyping, isConnected, onlineUsers, typingUsers } =
    useSocketStore();

  const isOnline = participantId ? onlineUsers.has(participantId) : false;
  const isTyping = typingUsers.get(chatId) === participantId;

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (chatId && isConnected) joinChat(chatId);
    return () => {
      if (chatId) leaveChat(chatId);
    };
  }, [chatId, isConnected, joinChat, leaveChat]);

  useEffect(() => {
    if (messages && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleTyping = useCallback(
    (text: string) => {
      setMessageText(text);
      if (!isConnected || !chatId) return;

      if (text.length > 0) {
        sendTyping(chatId, true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          sendTyping(chatId, false);
        }, 2000);
      } else {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        sendTyping(chatId, false);
      }
    },
    [chatId, isConnected, sendTyping]
  );

  const handleSend = () => {
    if (!messageText.trim() || isSending || !isConnected || !currentUser) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    sendTyping(chatId, false);

    setIsSending(true);
    sendMessage(chatId, messageText.trim(), {
      _id: currentUser._id,
      name: currentUser.name,
      email: currentUser.email,
      avatar: currentUser.avatar,
    });
    setMessageText("");
    setIsSending(false);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 200);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-dark" edges={["top", "bottom"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-2 bg-surface-dark border-b border-surface-light">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#F4A261" />
        </Pressable>
        <View className="flex-row items-center flex-1 ml-2">
          {avatar ? (
            <Image
              source={{ uri: avatar }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View className="size-10 rounded-full bg-surface-card items-center justify-center border border-surface-light">
              <Ionicons name="person" size={20} color="#6B6B70" />
            </View>
          )}
          <View className="ml-3">
            <Text className="text-foreground font-semibold text-base" numberOfLines={1}>
              {name}
            </Text>
            <Text className={`text-xs ${isTyping ? "text-primary" : "text-muted-foreground"}`}>
              {isTyping ? "typing..." : isOnline ? "Online" : "Offline"}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-3">
          <Pressable className="size-9 rounded-full items-center justify-center">
            <Ionicons name="call-outline" size={20} color="#6B6B70" />
          </Pressable>
          <Pressable className="size-9 rounded-full items-center justify-center">
            <Ionicons name="videocam-outline" size={20} color="#6B6B70" />
          </Pressable>
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <View className="flex-1 bg-surface-dark">
          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#F4A261" />
            </View>
          ) : !messages || messages.length === 0 ? (
            <EmptyUI
              title="No messages yet"
              subtitle="Start the conversation!"
              iconName="chatbubbles-outline"
              iconColor="#2D2D30"
              iconSize={64}
            />
          ) : (
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
              onContentSizeChange={() => {
                scrollViewRef.current?.scrollToEnd({ animated: false });
              }}
            >
              {messages.map((message) => {
                const senderId = typeof message.sender === 'string' ? message.sender : message.sender?._id;
                const isFromMe = currentUser ? senderId === currentUser._id : false;
                return <MessageBubble key={message._id} message={message} isFromMe={isFromMe} />;
              })}
            </ScrollView>
          )}

          {/* Input bar */}
          <View className="px-3 pb-6 pt-2 bg-surface-dark border-t border-surface-light">
            <View className="flex-row items-center bg-surface-card rounded-3xl px-2 py-2 gap-2">
              <Pressable
                className="w-10 h-10 rounded-full items-center justify-center active:bg-surface-light"
                onPress={() => console.log("Add clicked")}
              >
                <Ionicons name="add" size={26} color="#F4A261" />
              </Pressable>

              <View className="flex-1 justify-center min-h-[40px] max-h-[120px]">
                <TextInput
                  placeholder="Type a message..."
                  placeholderTextColor="#6B6B70"
                  className="text-foreground text-base py-1.5"
                  multiline
                  value={messageText}
                  onChangeText={handleTyping}
                  editable={!isSending}
                  textAlignVertical="center"
                />
              </View>

              <Pressable
                className={`w-10 h-10 rounded-full items-center justify-center ${!messageText.trim() || isSending || !isConnected ? "bg-primary/30" : "bg-primary"
                  }`}
                onPress={handleSend}
                disabled={!messageText.trim() || isSending || !isConnected}
              >
                {isSending ? (
                  <ActivityIndicator size="small" color="#0D0D0F" />
                ) : (
                  <Ionicons
                    name={isConnected ? "send" : "cloud-offline-outline"}
                    size={20}
                    color={isConnected ? "#0D0D0F" : "#6B6B70"}
                    style={{ marginLeft: isConnected ? 2 : 0 }}
                  />
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatDetailScreen;