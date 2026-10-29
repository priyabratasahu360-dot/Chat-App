
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import {
  handleCallAccepted,
  handleIceCandidate,
  closeVoiceCall,
} from "../services/voiceCallService";

export const useCallStore = create((set, get) => ({
  callStatus: "idle",
  incomingCall: null,
  remoteUserId: null,

  setCallStatus: (callStatus) => set({ callStatus }),

  resetCall: () => {
    set({
      callStatus: "idle",
      incomingCall: null,
      remoteUserId: null,
    });
  },

  initializeCallListeners: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("incoming_call");
    socket.off("call_accepted");
    socket.off("call_ended");
    socket.off("call_unavailable");
    socket.off("ice_candidate");

    socket.on("incoming_call", ({ callerId, offer }) => {
      set({
        callStatus: "incoming",
        incomingCall: { callerId, offer },
        remoteUserId: callerId,
      });
    });

    socket.on("call_accepted", async (data) => {
      try {
        await handleCallAccepted(data);
      } catch (error) {
        console.error("Failed to process call answer:", error);
        closeVoiceCall();
        get().resetCall();
      }
    });

    socket.on("ice_candidate", async (data) => {
      try {
        await handleIceCandidate(data);
      } catch (error) {
        console.error("Failed to process ICE candidate:", error);
      }
    });

    socket.on("call_ended", () => {
      closeVoiceCall();
      get().resetCall();
    });

    socket.on("call_unavailable", () => {
      closeVoiceCall();
      get().resetCall();
    });
  },

  startCall: (receiverId, offer) => {
    const socket = useAuthStore.getState().socket;
    if (!socket?.connected) return;

    set({
      callStatus: "calling",
      remoteUserId: receiverId,
    });

    socket.emit("call_user", { receiverId, offer });
  },

  acceptCall: (callerId, answer) => {
    const socket = useAuthStore.getState().socket;
    if (!socket?.connected) return;

    socket.emit("accept_call", { callerId, answer });
  },

  sendIceCandidate: (targetUserId, candidate) => {
    const socket = useAuthStore.getState().socket;
    if (!socket?.connected) return;

    socket.emit("ice_candidate", { targetUserId, candidate });
  },

  endCall: () => {
    const socket = useAuthStore.getState().socket;
    const targetUserId = get().remoteUserId;

    if (socket?.connected && targetUserId) {
      socket.emit("end_call", { targetUserId });
    }

    closeVoiceCall();
    get().resetCall();
  },
}));
