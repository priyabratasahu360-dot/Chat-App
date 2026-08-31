import { useEffect, useRef } from "react";

import { useGroupChat } from "../store/useGroupChat";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSkeleton } from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";

import { GroupHeader } from "./GroupHeader";

export const GroupChatContainer = () => {
  const {
    messages,
    getGroupMessages,
    isMessageLoading,
    selectedGroup,
    setSelectedGroup,
  } = useGroupChat();
  console.log(messages);
  const { authUser } = useAuthStore();

  const messageEndRef = useRef(null);

  // ==============================
  // LOAD GROUP MESSAGES
  // ==============================

  useEffect(() => {
    if (!selectedGroup) return;

    getGroupMessages();
  }, [selectedGroup, getGroupMessages]);

  // ==============================
  // SCROLL TO BOTTOM
  // ==============================

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  // ==============================
  // NO GROUP SELECTED
  // ==============================

  if (!selectedGroup) {
    return null;
  }

  // ==============================
  // LOADING
  // ==============================

  if (isMessageLoading) {
    return (
      <div className="h-full w-full flex flex-col bg-[#c0c0c0]">
        {/* Header */}

        <GroupHeader
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
        />

        {/* Messages */}

        <div className="flex-1 min-h-0 overflow-y-auto">
          <MessageSkeleton />
        </div>

        {/* Input */}

        <div className="shrink-0 bg-[#c0c0c0] border-t-2 border-black">
          <MessageInput />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full min-w-0 flex flex-col bg-[#c0c0c0]">
      {/* =================================
                HEADER
            ================================= */}

      <div className="shrink-0">
        <GroupHeader
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
        />
      </div>

      {/* =================================
                MESSAGES
            ================================= */}

      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 bg-[#008080]">
        {messages?.chats?.map((message) => {
          const isOwnMessage = message.senderId === authUser._id;

          return (
            <div
              key={message._id}
              ref={messageEndRef}
              className={`flex items-end gap-2 min-w-0 ${
                isOwnMessage ? "justify-end" : "justify-start"
              }`}
            >
              {/* OTHER USER AVATAR */}

              {!isOwnMessage && (
                <div className="w-8 h-8 shrink-0 bg-[#c0c0c0] border-2 border-white border-r-black border-b-black">
                  <img
                    src={message.sender?.profilePicture || "/avatar.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* MESSAGE */}

              <div
                className={`min-w-0 max-w-[70%] flex flex-col ${
                  isOwnMessage ? "items-end" : "items-start"
                }`}
              >
                {/* Sender name */}

                {!isOwnMessage && (
                  <span className="text-[11px] font-bold text-white mb-1">
                    {message.sender?.fullname || message.senderName || "User"}
                  </span>
                )}

                {/* Time */}

                <time className="text-[10px] text-white mb-1">
                  {formatMessageTime(message.createdAt)}
                </time>

                {/* Bubble */}

                <div
                  className={`min-w-0 max-w-full px-3 py-2 text-sm text-black border-2 break-words ${
                    isOwnMessage
                      ? "bg-[#dcdcdc] border-white border-r-black border-b-black"
                      : "bg-white border-gray-600 border-t-black border-l-black"
                  }`}
                  style={{
                    overflowWrap: "anywhere",
                  }}
                >
                  {/* Image */}

                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="max-w-full max-h-[300px] mb-2 border border-gray-500 object-contain"
                    />
                  )}

                  {/* Text */}

                  {message.text && (
                    <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                      {message.text}
                    </p>
                  )}
                </div>
              </div>

              {/* OWN AVATAR */}

              {isOwnMessage && (
                <div className="w-8 h-8 shrink-0 bg-[#c0c0c0] border-2 border-white border-r-black border-b-black">
                  <img
                    src={authUser.profilePicture || "/avatar.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* =================================
                INPUT to add...
            ================================= */}

      
    </div>
  );
};



