import { useSocketStore } from "../lib/socket";

import { VideoIcon, Trash2Icon } from "lucide-react";

export function ChatHeader({ participant, chatId, onDelete, onVideoCall }) {
  const { onlineUsers, typingUsers } = useSocketStore();
  const isOnline = onlineUsers.has(participant?._id);
  // const isTyping = !!typingUsers.get(chatId);
  const typingUserId = typingUsers.get(chatId);
  const isTyping = typingUserId && typingUserId === participant?._id;

  return (
    <div className="h-16 px-6 border-b border-base-300 flex items-center gap-4 bg-base-200/80">
      <div className="relative">
        <img src={participant?.avatar} className="w-10 h-10 rounded-full bg-base-300/40" alt="" />
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-base-200" />
        )}
      </div>
      <div className="flex-1">
        <h2 className="font-semibold">{participant?.name}</h2>
        <p className="text-xs text-base-content/70">
          {isTyping ? "typing..." : isOnline ? "Online" : "Offline"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {onVideoCall && (
          <button className="btn btn-sm btn-primary flex gap-1 items-center" onClick={onVideoCall} title="Start Video Call">
            <VideoIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Video Call</span>
          </button>
        )}
        {onDelete && (
          <button 
            className="btn btn-sm btn-outline btn-error flex gap-1 items-center" 
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this chat? This will remove all messages.")) {
                onDelete(chatId);
              }
            }}
            title="Delete Chat"
          >
            <Trash2Icon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}