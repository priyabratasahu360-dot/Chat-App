import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore"

export const ChatHeader = () => {
    const {selectedUser, setSelectedUser} = useChatStore();
    const {onlineUser} = useAuthStore();
    return(
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* avatar */}
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <img src={selectedUser.profilePicture || "/avatar.png"} alt={selectedUser.fullname} />
                        </div>
                    </div>
                    {/* user info */}
                    <div>
                        <h3 className="font-medium">{selectedUser.fullname}</h3>
                        <p className="text-sm text-base-content/70">
                        {onlineUser.includes(selectedUser._id) ? "Online" : "Offline"}
                        </p>
                    </div>   
                </div>
                {/* close button */}
                <button onClick={() => setSelectedUser(null)}>
                    <X />
                </button>

            </div>

        </div>
    )
}