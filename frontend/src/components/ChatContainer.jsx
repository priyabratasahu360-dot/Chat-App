import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { MessageSkeleton } from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { User } from "lucide-react";

export const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="h-full w-full flex flex-col bg-[#c0c0c0]">
        <ChatHeader />

        {/* Loading messages */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <MessageSkeleton />
        </div>

        {/* Fixed bottom input */}
        <div className="shrink-0 bg-[#c0c0c0] border-t-2 border-white">
          <MessageInput />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full min-w-0 flex flex-col bg-[#c0c0c0]">
      {/* Chat Header */}
      <div className="shrink-0">
        <ChatHeader />
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 bg-[#008080]">
        {messages.map((message) => (
          <div
            key={message._id}
            ref={messageEndRef}
            className={`flex items-end gap-2 min-w-0 ${
              message.senderId === authUser._id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {/* Other user's avatar */}
            {message.senderId !== authUser._id && (
              <div className="w-8 h-8 bg-[#c0c0c0] border-2 border-white border-r-black border-b-black shrink-0">
                <img
                  src={selectedUser.profilePicture || <User></User>}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Message wrapper */}
            <div
              className={`min-w-0 max-w-[70%] flex flex-col ${
                message.senderId === authUser._id ? "items-end" : "items-start"
              }`}
            >
              {/* Time */}
              <time className="text-[10px] text-white mb-1">
                {formatMessageTime(message.createdAt)}
              </time>

              {/* Message bubble */}
              <div
                className={`min-w-0 max-w-full px-3 py-2 text-sm text-black border-2 break-words overflow-wrap-anywhere ${
                  message.senderId === authUser._id
                    ? "bg-[#dcdcdc] border-white border-r-black border-b-black"
                    : "bg-white border-gray-600 border-t-black border-l-black"
                }`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="max-w-full max-h-[300px] mb-2 border border-gray-500 object-contain"
                  />
                )}

                {message.text && (
                  <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                    {message.text}
                  </p>
                )}
              </div>
            </div>

            {/* Own avatar */}
            {message.senderId === authUser._id && (
              <div className="w-8 h-8 bg-[#c0c0c0] border-2 border-white border-r-black border-b-black shrink-0">
                <img
                  src={authUser.profilePicture || "/avatar.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Message Input - ALWAYS AT BOTTOM */}
      <div className="shrink-0 bg-[#c0c0c0] border-t-2 border-black">
        <MessageInput />
      </div>
    </div>
  );
};
