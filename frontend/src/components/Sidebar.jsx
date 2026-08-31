import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { SidebarSkeleton } from "./skeletons/SidebarSkeleton";
import {
  User,
  Users,
  Plus,
  Search,
  X,
  MessageSquare,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useGroupChat } from "../store/useGroupChat";

export const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  const { onlineUser } = useAuthStore();
  const {groups, getGroups, createGroup, setSelectedGroup} = useGroupChat();

  const [activeTab, setActiveTab] = useState("chats");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  

console.log(groups)
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // =========================
  // FILTER USERS
  // =========================

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullname
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesOnline = !showOnlineOnly || onlineUser.includes(user._id);

    return matchesSearch && matchesOnline;
  });


  // =========================
  // FILTER GROUPS
  // =========================

  const filteredGroups = groups?.group?.filter((g) =>
    g.groupId.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  console.log("filtered groups: ", filteredGroups);

  // =========================
  // GROUP MEMBERS
  // =========================

  const toggleMember = (userId) => {
    setSelectedMembers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      }

      return [...prev, userId];
    });
  };

  // =========================
  // CREATE GROUP
  // =========================

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;
    
    const newGroup = {
      name: groupName.trim(),
      description: groupDescription.trim(),
      userIds: selectedMembers,
    };

    createGroup(newGroup);

    setGroupName("");
    setSelectedMembers([]);
    setShowCreateGroup(false);
  };

  const closeGroupModal = () => {
    setShowCreateGroup(false);
    setGroupName("");
    setSelectedMembers([]);
  };

  if (isUsersLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <>
      <aside className="h-full w-full lg:w-72 bg-[#c0c0c0] border-r-2 border-black flex flex-col">
        {/* =================================
                    TOP BAR
                ================================= */}

        <div className="bg-[#000080] text-white h-9 px-2 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm">
            <MessageSquare className="size-4 " />

            <span className="animate-pulse animate-[animation-delay:5ms]">
              ...
            </span>
          </div>

          {/* New Group */}

          <button
            onClick={() => setShowCreateGroup(true)}
            title="Create Group"
            className="w-6 h-6 bg-[#c0c0c0] text-black flex items-center justify-center border-2 border-white border-r-black border-b-black active:border-black active:border-r-white active:border-b-white"
          >
            <Plus className="size-4" />
          </button>
        </div>

        {/* =================================
                    TABS
                ================================= */}

        <div className="flex bg-[#c0c0c0] border-b-2 border-gray-600">
          {/* CHATS */}

          <button
            onClick={() => {
              setActiveTab("chats");
              setSearchQuery("");
            }}
            className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1 border-r border-gray-500 ${
              activeTab === "chats"
                ? "bg-white text-[#000080] border-t-2 border-t-white"
                : "text-black hover:bg-[#d8d8d8]"
            }`}
          >
            <MessageSquare className="size-3" />
            Chats
          </button>

          {/* GROUPS */}

          <button
            onClick={async() => {
              setActiveTab("groups");
              getGroups();
              setSearchQuery("");
            }}
            className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1 border-r border-gray-500 ${
              activeTab === "groups"
                ? "bg-white text-[#000080] border-t-2 border-t-white"
                : "text-black hover:bg-[#d8d8d8]"
            }`}
          >
            <Users className="size-3" />
            Groups
          </button>

        </div>

        {/* =================================
                    SEARCH
                ================================= */}

        {activeTab !== "calls" && (
          <div className="p-2 border-b-2 border-gray-600">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-gray-600" />

              <input
                type="text"
                placeholder={
                  activeTab === "chats"
                    ? "Search people..."
                    : "Search groups..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-black text-sm pl-8 pr-8 py-2 border-2 border-gray-600 border-t-black border-l-black outline-none"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Online filter */}

            {activeTab === "chats" && (
              <label className="mt-2 flex items-center gap-2 text-black cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlineOnly}
                  onChange={(e) => setShowOnlineOnly(e.target.checked)}
                  className="w-4 h-4 accent-[#000080]"
                />

                <span className="text-xs font-bold">Online only</span>

                <span className="text-xs text-gray-600">
                  ({Math.max(onlineUser.length - 1, 0)})
                </span>
              </label>
            )}
          </div>
        )}

        {/* =================================
                    CONTENT
                ================================= */}

        <div className="flex-1 overflow-y-auto">
          {/* =================================
                        CHATS TAB
                    ================================= */}

          {activeTab === "chats" && (
            <>
              {filteredUsers?.map((user) => (
                <button
                  key={user._id}
                  onClick={() => {
                    setSelectedGroup(null);
                    setSelectedUser(user);
                  }}
                  className={`w-full p-2 flex items-center gap-3 text-left border-b border-gray-400 ${
                    selectedUser?._id === user._id
                      ? "bg-[#000080] text-white"
                      : "bg-[#c0c0c0] text-black hover:bg-[#d8d8d8]"
                  }`}
                >
                  {/* Avatar */}

                  <div className="relative shrink-0">
                    <div className="w-11 h-11 bg-white border-2 border-gray-600 border-t-black border-l-black">
                      <img
                        src={user.profilePicture || "/avatar.png"}
                        alt={user.fullname}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Online indicator */}

                    {onlineUser.includes(user._id) && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-600 border border-black" />
                    )}
                  </div>

                  {/* User info */}

                  <div className="min-w-0">
                    <div className="font-bold text-sm truncate">
                      {user.fullname}
                    </div>

                    <div
                      className={`text-xs ${
                        selectedUser?._id === user._id
                          ? "text-white"
                          : "text-gray-700"
                      }`}
                    >
                      {onlineUser.includes(user._id) ? "Online" : "Offline"}
                    </div>
                  </div>
                </button>
              ))}

              {filteredUsers?.length === 0 && (
                <EmptyState text="No users found" />
              )}
            </>
          )}

          {/* =================================
                        GROUPS TAB
                    ================================= */}

          {activeTab === "groups" && (
            <>
              {filteredGroups?.map((group) => (
                <button
                  key={group.groupId._id}
                  onClick={() => {
                    setSelectedUser(null);
                    setSelectedGroup(group.groupId)} 
                  }
                  //group.groupId is not a id like "9348hda3493ndak"
                  //it is a object containing field like _id, name, desc...
                  className="w-full p-2 flex items-center gap-3 text-left bg-[#c0c0c0] hover:bg-[#d8d8d8] border-b border-gray-400"
                >
                  <div className="w-11 h-11 shrink-0 bg-[#000080] flex items-center justify-center border-2 border-white border-r-black border-b-black">
                    <Users className="size-6 text-white" />
                  </div>

                  <div className="min-w-0">
                    <div className="font-bold text-sm truncate text-black">
                      {group.groupId.name}
                    </div>

                    <div className="text-xs text-gray-700">
                      role: {group.role}
                    </div>
                  </div>
                </button>
              ))}

              {filteredGroups?.length === 0 && (
                <EmptyState text="No groups found" />
              )}
            </>
          )}
          
        </div>
      </aside>

      {/* =================================
                CREATE GROUP WINDOW
            ================================= */}

      {showCreateGroup && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#c0c0c0] border-2 border-white border-r-black border-b-black shadow-[5px_5px_0px_#000]">
            {/* Window title */}

            <div className="bg-[#000080] text-white px-2 py-1 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Users className="size-4" />
                Create Group
              </div>

              <button
                onClick={closeGroupModal}
                className="w-5 h-5 bg-[#c0c0c0] text-black font-bold text-xs flex items-center justify-center border-2 border-white border-r-black border-b-black"
              >
                X
              </button>
            </div>

            {/* Content */}

            <div className="p-4">
              {/* Group name */}

              <label className="block text-sm font-bold text-black mb-2">
                Group Name 
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name..."
                className="w-full px-3 py-2 bg-white text-black border-2 border-gray-600 border-t-black border-l-black outline-none"
              />
              <label className="inline text-sm font-bold text-black mb-2">
                Group Description {""}
              <span className="text-gray-500">(optional)</span>
              </label>

              <input
                type="text"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                placeholder="Enter group description..."
                className="w-full px-3 py-2 bg-white text-black border-2 border-gray-600 border-t-black border-l-black outline-none"
              />

              {/* Members */}

              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-bold text-black">
                    Select Members {""}
                    <span className="text-gray-500">(optional)</span>
                  </span>

                  <span className="text-xs text-gray-700">
                    {selectedMembers.length} selected
                  </span>
                </div>

                <div className="max-h-48 text-black overflow-y-auto bg-[#d8d8d8] border-2 border-gray-600 border-t-black border-l-black">
                  {users.map((user) => (
                    <label
                      key={user._id}
                      className="flex items-center gap-3 p-2 cursor-pointer hover:bg-[#000080] hover:text-white"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(user._id)}
                        onChange={() => toggleMember(user._id)}
                        className="w-4 h-4 accent-[#000080]"
                      />

                      <div className="w-8 h-8 bg-white border border-black shrink-0">
                        <img
                          src={user.profilePicture || "/avatar.png"}
                          alt={user.fullname}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <span className="text-sm font-bold truncate">
                        {user.fullname}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={closeGroupModal}
                  className="px-5 py-2 bg-[#c0c0c0] text-black text-sm font-bold border-2 border-white border-r-black border-b-black active:border-black active:border-r-white active:border-b-white"
                >
                  Cancel
                </button>

                <button
                  onClick={handleCreateGroup}
                  disabled={!groupName.trim()}
                  className="px-5 py-2 bg-[#c0c0c0] text-black text-sm font-bold border-2 border-white border-r-black border-b-black disabled:text-gray-500 disabled:cursor-not-allowed active:border-black active:border-r-white active:border-b-white"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* =================================
   EMPTY STATE
================================= */

const EmptyState = ({ text }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <Search className="size-8 text-gray-600 mb-2" />

      <p className="text-sm font-bold text-gray-700">{text}</p>
    </div>
  );
};
