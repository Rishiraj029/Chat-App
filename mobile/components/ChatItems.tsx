import { Chat, MessageSender } from "@/types";
import { Image } from "expo-image";
import { View, Text, Pressable } from "react-native";
import { format, isToday, isYesterday } from "date-fns";
import { useSocketStore } from "@/lib/socket";
import { Ionicons } from "@expo/vector-icons";

const ChatItem = ({ chat, onPress }: { chat: Chat; onPress: () => void }) => {
  const participant = chat.participant;
  const { onlineUsers, typingUsers, unreadChats } = useSocketStore();

  // Debug: check if avatar URL is coming through
  console.log(`[ChatItem] ${participant.name} avatar:`, participant.avatar);

  const isOnline = onlineUsers.has(participant._id);
  const isTyping = typingUsers.get(chat._id) === participant._id;
  const hasUnread = unreadChats.has(chat._id);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return format(date, "HH:mm");
    if (isYesterday(date)) return "Yesterday";
    return format(date, "dd/MM/yy");
  };

  return (
    <Pressable
      className="flex-row items-center px-4 py-3.5 bg-surface-dark active:bg-surface-card/50 transition-colors"
      onPress={onPress}
    >
      {/* Avatar Section */}
      <View className="relative">
        {participant.avatar ? (
          <Image
            source={{ uri: participant.avatar }}
            style={{ width: 56, height: 56, borderRadius: 28 }}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={{ width: 56, height: 56, borderRadius: 28 }} className="bg-surface-card items-center justify-center border border-surface-light">
            <Ionicons name="person" size={24} color="#6B6B70" />
          </View>
        )}
        {isOnline && (
          <View className="absolute bottom-0 right-0 size-4 bg-green-500 rounded-full border-[3px] border-surface-dark" />
        )}
      </View>

      {/* Content Section */}
      <View className="flex-1 ml-4 border-b border-surface-light/30 pb-3">
        <View className="flex-row items-center justify-between mb-1">
          <Text
            className={`text-[17px] tracking-tight ${hasUnread ? "font-bold text-foreground" : "font-semibold text-foreground"}`}
            numberOfLines={1}
          >
            {participant.name}
          </Text>

          <Text className={`text-xs ${hasUnread ? "text-primary font-bold" : "text-subtle-foreground"}`}>
            {chat.lastMessageAt ? formatTime(chat.lastMessageAt) : ""}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center mr-2">
            {!isTyping && chat.lastMessage && (
              <Ionicons
                name="checkmark-done"
                size={16}
                color={hasUnread ? "#6B6B70" : "#F4A261"}
                style={{ marginRight: 4 }}
              />
            )}

            {isTyping ? (
              <View className="flex-row items-center">
                <Text className="text-sm text-primary font-medium italic">typing</Text>
                <View className="flex-row ml-1 gap-0.5 mt-1">
                  {[1, 2, 3].map(i => <View key={i} className="size-1 rounded-full bg-primary" />)}
                </View>
              </View>
            ) : (
              <Text
                className={`text-[15px] flex-1 ${hasUnread ? "text-foreground font-medium" : "text-subtle-foreground"}`}
                numberOfLines={1}
              >
                {chat.lastMessage?.text || "Started a conversation"}
              </Text>
            )}
          </View>

          {hasUnread && (
            <View className="bg-primary rounded-full px-2 py-0.5 min-w-[20px] items-center justify-center shadow-sm">
              <Text className="text-[10px] text-surface-dark font-black">NEW</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default ChatItem;
