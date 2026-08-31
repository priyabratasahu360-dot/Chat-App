import { useChatStore } from "../store/useChatStore";
import { NoChatSelected } from "../components/NoChatSelected";
import { Sidebar } from "../components/Sidebar";
import { ChatContainer } from "../components/ChatContainer";
import { useGroupChat } from "../store/useGroupChat";
import { GroupChatContainer } from "../components/GroupChatsContainer";

export const HomePage = () => {
  const { selectedUser } = useChatStore();
  const { selectedGroup } = useGroupChat();

  const hasSelectedChat = selectedUser || selectedGroup;

  return (
    <div className="fixed top-16 bottom-0 left-0 right-0 overflow-hidden bg-[#c0c0c0]">

      <div className="h-full w-full flex-1 lg:flex">

        {/* =========================
            SIDEBAR
        ========================= */}
        <div
          className={`
            h-full shrink-0
            ${hasSelectedChat ? "hidden lg:block" : "block"}
          `}
        >
          <Sidebar className="w-full"/>
        </div>

        {/* =========================
            CHAT AREA
        ========================= */}
        <div
          className={`
            h-full min-w-0 flex-1
            ${hasSelectedChat ? "block" : "hidden lg:block"}
          `}
        >

          {/* Normal Chat */}
          {selectedUser && !selectedGroup && (
            <ChatContainer />
          )}

          {/* Group Chat */}
          {selectedGroup && !selectedUser && (
            <GroupChatContainer />
          )}

          {/* Nothing Selected */}
          {!selectedUser && !selectedGroup && (
            <NoChatSelected/>
          )}

        </div>

      </div>
    </div>
  );
};
