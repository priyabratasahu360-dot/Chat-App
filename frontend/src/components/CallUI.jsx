import { Phone, PhoneOff } from "lucide-react";
import { useCallStore } from "../store/useCallStore";
import {
  acceptVoiceCall,
  endVoiceCall,
} from "../services/voiceCallService";
import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";

const CallUI = () => {
  const { callStatus, incomingCall, remoteUserId } = useCallStore();
  const {users} = useChatStore();

  const caller = users.find((user) => user._id === incomingCall?.callerId)
  if (callStatus === "idle") return null;

  const handleAccept = async () => {
    try {
      await acceptVoiceCall();
    } catch (error) {
      console.error("Failed to accept call:", error);
      toast.error(error.message || "Failed to accept call");
    }
  };

  const handleEnd = () => {
    endVoiceCall();
  };

  const isIncoming = callStatus === "incoming";
  const isOutgoing = callStatus === "calling";
  const isConnected = callStatus === "connected";
  const isConnecting = callStatus === "connecting" || callStatus === "reconnecting";

  return (
    <div className="fixed bottom-5 right-5 z-50 w-80 border-2 border-black bg-[#c0c0c0] p-4 text-black shadow-xl">
      <h2 className="mb-3 font-bold">
        {isIncoming
          ? "Incoming voice call"
          : isOutgoing
          ? "Calling..."
          : isConnected
          ? "Voice call connected"
          : isConnecting
          ? "Connecting call..."
          : "Voice call"}
      </h2>

      {isIncoming && (
        <p className="mb-4 text-sm">{`${caller?.fullname || "Someone"} is calling you`}</p>
      )}

      {!isIncoming && remoteUserId && (
        <p className="mb-4 break-all text-xs">
          User ID: {remoteUserId}
        </p>
      )}

      <div className="flex gap-3">
        {isIncoming && (
          <button
            onClick={handleAccept}
            className="flex flex-1 items-center justify-center gap-2 border-2 border-white border-b-black border-r-black bg-green-600 p-2 text-white"
          >
            <Phone size={16} />
            Accept
          </button>
        )}

        <button
          onClick={handleEnd}
          className="flex flex-1 items-center justify-center gap-2 border-2 border-white border-b-black border-r-black bg-red-600 p-2 text-white"
        >
          <PhoneOff size={16} />
          {isIncoming ? "Decline" : "End call"}
        </button>
      </div>
    </div>
  );
};

export default CallUI;