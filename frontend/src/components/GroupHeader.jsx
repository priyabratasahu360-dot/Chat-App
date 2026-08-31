import { Users, X } from "lucide-react";
export const GroupHeader = ({ group, onClose }) => {
  return (
    <div className="h-16 bg-[#c0c0c0] border-b-2 border-black px-3 flex items-center justify-between">
      {/* GROUP INFO */}

      <div className="flex items-center gap-3 min-w-0">
        <div className="w-11 h-11 shrink-0 bg-[#000080] flex items-center justify-center border-2 border-white border-r-black border-b-black">
          <Users className="size-6 text-white" />
        </div>

        <div className="min-w-0">
          <h2 className="font-bold text-sm text-black truncate">
            {group.name}
          </h2>

          <p className="text-xs text-gray-700">Group Chat</p>
        </div>
      </div>

      {/* CLOSE */}

      <button
        onClick={onClose}
        className="w-7 h-7 shrink-0 bg-[#c0c0c0] flex items-center justify-center text-black border-2 border-white border-r-black border-b-black active:border-black active:border-r-white active:border-b-white"
      >
        <X className="size-4" />
      </button>
    </div>
  );
};