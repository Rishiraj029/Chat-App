import ChatItem from "@/components/ChatItems";
import EmptyUI from "@/components/EmptyUI";
import { useChats } from "@/hooks/useChats";
import { useCurrentUser } from "@/hooks/useAuth";
import { Chat } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useMemo } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View, TextInput, RefreshControl } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";

const ChatsTab = () => {
  const router = useRouter();
  const { data: chats, isLoading, error, refetch } = useChats();
  const { data: currentUser } = useCurrentUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredChats = useMemo(() => {
    if (!chats) return [];
    if (!searchQuery.trim()) return chats;
    return chats.filter(chat =>
      chat.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chats, searchQuery]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  if (isLoading && !isRefreshing) {
    return (
      <View className="flex-1 bg-surface-dark items-center justify-center">
        <ActivityIndicator size={"large"} color={"#F4A261"} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-surface-dark items-center justify-center p-6">
        <Ionicons name="alert-circle-outline" size={64} color="#E76F51" />
        <Text className="text-foreground text-xl font-bold mt-4 text-center">Failed to load chats</Text>
        <Text className="text-muted-foreground text-center mt-2 mb-6">Something went wrong while fetching your conversations.</Text>
        <Pressable onPress={() => refetch()} className="px-8 py-3 bg-primary rounded-full shadow-lg active:scale-95">
          <Text className="text-surface-dark font-bold text-base">Try Again</Text>
        </Pressable>
      </View>
    );
  }

  const handleChatPress = (chat: Chat) => {
    router.push({
      pathname: "/chat/[id]",
      params: {
        id: chat._id,
        participantId: chat.participant._id,
        name: chat.participant.name,
        avatar: chat.participant.avatar,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-dark" edges={["top"]}>
      {/* Search Header */}
      <View className="bg-surface-dark pb-3 px-4 pt-2">
        <View className="flex-row items-center justify-between mb-4 mt-2">
          <View className="flex-1 mr-4">
            <Text className="text-3xl font-extrabold text-foreground tracking-tight" numberOfLines={1}>Chats</Text>
            <View className="flex-row items-center mt-1">
              <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
              <Text className="text-subtle-foreground text-sm font-medium">Connected</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3 shrink-0">
            <Pressable className="size-10 bg-surface-card rounded-full items-center justify-center border border-surface-light active:scale-95">
              <Ionicons name="qr-code-outline" size={20} color="#F4A261" />
            </Pressable>
            <Pressable
              className="size-10 bg-primary rounded-full items-center justify-center shadow-lg active:scale-95"
              onPress={() => router.push("/new-chat")}
            >
              <Ionicons name="add" size={24} color="#0D0D0F" />
            </Pressable>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-surface-card px-4 h-11 rounded-2xl border border-surface-light">
          <Ionicons name="search-outline" size={20} color="#6B6B70" />
          <TextInput
            placeholder="Search conversations..."
            placeholderTextColor="#6B6B70"
            className="flex-1 text-foreground ml-3 text-base"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#6B6B70" />
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ChatItem chat={item} onPress={() => handleChatPress(item)} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#F4A261"
            colors={["#F4A261"]}
          />
        }
        ListEmptyComponent={
          searchQuery ? (
            <View className="mt-20 items-center justify-center px-10">
              <Ionicons name="search-outline" size={60} color="#2D2D30" />
              <Text className="text-foreground text-lg font-bold mt-4">No results found</Text>
              <Text className="text-subtle-foreground text-center mt-2">
                We couldn't find any chats matching "{searchQuery}"
              </Text>
            </View>
          ) : (
            <EmptyUI
              title="No chats yet"
              subtitle="Start your first conversation today!"
              iconName="chatbubbles-outline"
              iconColor="#2D2D30"
              iconSize={80}
              buttonLabel="Find Someone to Chat"
              onPressButton={() => router.push("/new-chat")}
            />
          )
        }
      />
    </SafeAreaView>
  );
};

export default ChatsTab;
