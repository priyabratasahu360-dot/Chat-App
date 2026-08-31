import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

export const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUser } = useAuthStore();

    return (
        <div className="bg-[#c0c0c0] border-b-2 border-black p-2">

            <div className="flex items-center justify-between">

                {/* User Info */}
                <div className="flex items-center gap-3">

                    {/* Avatar */}
                    <div className="w-10 h-10 bg-white border-2 border-gray-600 border-t-black border-l-black">
                        <img
                            src={
                                selectedUser.profilePicture ||
                                "/avatar.png"
                            }
                            alt={selectedUser.fullname}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Name + Status */}
                    <div>
                        <h3 className="font-bold text-sm text-black">
                            {selectedUser.fullname}
                        </h3>

                        <p className="text-xs text-black">
                            <span
                                className={`inline-block w-2 h-2 mr-1 ${
                                    onlineUser.includes(selectedUser._id)
                                        ? "bg-green-600"
                                        : "bg-gray-600"
                                }`}
                            ></span>

                            {onlineUser.includes(selectedUser._id)
                                ? "Online"
                                : "Offline"}
                        </p>
                    </div>

                </div>

                {/* Close Button */}
                <button
                    onClick={() => setSelectedUser(null)}
                    className="w-7 h-7 flex items-center justify-center bg-[#c0c0c0] text-black border-2 border-white border-r-black border-b-black active:border-black active:border-r-white active:border-b-white"
                >
                    <X className="size-4" />
                </button>

            </div>

        </div>
    );
};

