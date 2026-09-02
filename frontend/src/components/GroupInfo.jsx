import { useState } from "react";
import { Users, X, MoreVertical } from "lucide-react";
import { useGroupChat } from "../store/useGroupChat";
import { formatDate } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";

export const GroupInfo = ({ group, onClose }) => {
  const { groupUsers } = useGroupChat();
  const { authUser } = useAuthStore();
  
  // Track which member's dropdown menu is open by their member._id
  const [activeMenu, setActiveMenu] = useState(null);

  // Check if the currently logged-in user is an admin of this group
  const currentIsAdmin = groupUsers?.find(
    (user) => user.userId?._id === authUser?._id
  )?.role === "admin";

  const toggleMenu = (memberId) => {
    setActiveMenu(activeMenu === memberId ? null : memberId);
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#c0c0c0]">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-3 py-2 bg-[#000080] text-white border-2 border-white border-r-black border-b-black">
        <span className="font-bold text-sm">Group Information</span>

        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center bg-[#c0c0c0] text-black border-2 border-white border-r-black border-b-black active:border-black active:border-r-white active:border-b-white"
        >
          <X size={16} />
        </button>
      </div>

      {/* Group Profile */}
      <div className="flex flex-col items-center py-6 border-b-2 border-gray-600 mx-60">
        {/* Default Group Photo */}
        <div className="w-24 h-24 bg-[#008080] border-4 border-white border-r-black border-b-black flex items-center justify-center">
          <Users size={42} className="text-white" />
        </div>

        {/* Group Name */}
        <h2 className="mt-3 text-lg font-bold text-black">{group?.name}</h2>

        {/* Description */}
        {group?.description ? (
          <p className="mt-1 text-xs text-gray-700 text-center max-w-[300px]">
            {group.description}
          </p>
        ) : (
          <p className="text-black text-xs mt-1">Hello, Welcome to {group?.name}</p>
        )}

        {/* Group created */}
        <div className="mt-1 text-xs text-gray-700">
          <p>Created: {formatDate(group?.createdAt)}</p>
        </div>

        {/* admin only control button */}
        {currentIsAdmin && (
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1 bg-[#c0c0c0] text-black font-bold text-xs border-2 border-white border-r-black border-b-black active:border-black active:border-r-white active:border-b-white">
              Edit
            </button>
            <button className="px-3 py-1 bg-[#c0c0c0] text-black font-bold text-xs border-2 border-white border-r-black border-b-black active:border-black active:border-r-white active:border-b-white">
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Members List */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="px-3 py-2 border-b-2 border-gray-600">
          <span className="text-xs font-bold text-black">
            MEMBERS ({groupUsers?.length || 0})
          </span>
        </div>

        {groupUsers?.map((member) => {
          const isSelf = member.userId?._id === authUser?._id;

          return (
            <div
              key={member._id}
              className="flex items-center gap-3 px-3 py-2 border-b border-gray-500 relative"
            >
              {/* Avatar */}
              <div className="w-9 h-9 shrink-0 bg-white border-2 border-gray-600 border-t-black border-l-black">
                <img
                  src={member.userId?.profilePicture || "/avatar.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* User Identity */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-black truncate">
                  {member.userId?.fullname || "Unknown User"} {isSelf && "(You)"}
                </p>
                <p className="text-[10px] text-gray-700 truncate">
                  {member.userId?.email}
                </p>
              </div>

              {/* Role Tag */}
              <span className="text-[10px] font-bold text-black mr-1">
                {member.role === "admin" ? "ADMIN" : "MEMBER"}
              </span>

              {/* 3-Dot Management Actions (Visible to admins inspecting OTHER users) */}
              {currentIsAdmin && !isSelf && (
                <div className="relative">
                  <button
                    onClick={() => toggleMenu(member._id)}
                    className="w-6 h-6 flex items-center justify-center bg-[#c0c0c0] border border-white border-r-black border-b-black active:border-black active:border-r-white active:border-b-white text-black"
                  >
                    <MoreVertical size={14} />
                  </button>

                  {/* Windows 95 Context Style Menu */}
                  {activeMenu === member._id && (
                    <>
                      {/* Invisible backdrop overlay to dismiss dropdown upon clicking anywhere */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setActiveMenu(null)}
                      />

                      <div className="absolute right-0 mt-1 w-24 bg-[#c0c0c0] border-2 border-white border-r-black border-b-black shadow-md z-50 p-0.5">

                        <div/>

                        <button
                          onClick={() => {
                            // TODO: Connect kick endpoint
                            setActiveMenu(null);
                          }}
                          className="w-full text-left px-2 py-1 text-red-700 font-bold text-[11px] hover:bg-[#000080] hover:text-white"
                        >
                          Remove
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
