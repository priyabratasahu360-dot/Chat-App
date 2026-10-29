
import { useAuthStore } from "../store/useAuthStore";
import { useCallStore } from "../store/useCallStore";

let peerConnection = null;
let localStream = null;
let pendingCandidates = [];

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

function getSocket() {
  return useAuthStore.getState().socket;
}

async function getMicrophone() {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Microphone access requires HTTPS or localhost.");
  }

  localStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });

  return localStream;
}

function createPeerConnection(targetUserId) {
  const peer = new RTCPeerConnection(ICE_SERVERS);

  peerConnection = peer;

  peer.onicecandidate = (event) => {
    if (event.candidate) {
      getSocket()?.emit("ice_candidate", {
        targetUserId,
        candidate: event.candidate,
      });
    }
  };

  peer.ontrack = (event) => {
    const remoteAudio = document.getElementById("remote-audio");

    if (remoteAudio && event.streams[0]) {
      remoteAudio.srcObject = event.streams[0];
      remoteAudio.play().catch((error) => {
        console.warn("Audio playback requires user interaction:", error);
      });
    }
  };

  peer.onconnectionstatechange = () => {
    const { setCallStatus, resetCall } = useCallStore.getState();

    if (peer.connectionState === "connected") {
      setCallStatus("connected");
    } else if (peer.connectionState === "disconnected") {
      setCallStatus("reconnecting");
    } else if (
      peer.connectionState === "failed" ||
      peer.connectionState === "closed"
    ) {
      closeVoiceCall();

      if (peer.connectionState === "failed") {
        resetCall();
      }
    }
  };

  return peer;
}

async function addLocalTracks(peer) {
  const stream = await getMicrophone();

  stream.getTracks().forEach((track) => {
    peer.addTrack(track, stream);
  });
}

async function addPendingCandidates(peer) {
  if (!peer.remoteDescription) return;

  for (const candidate of pendingCandidates) {
    await peer.addIceCandidate(candidate);
  }

  pendingCandidates = [];
}

export async function startVoiceCall(receiverId) {
  const socket = getSocket();

  if (!socket?.connected) {
    throw new Error("Socket is not connected.");
  }

  if (peerConnection) {
    throw new Error("A call is already in progress.");
  }

  try {
    const peer = createPeerConnection(receiverId);

    useCallStore.setState({
      callStatus: "calling",
      remoteUserId: receiverId,
    });

    await addLocalTracks(peer);

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socket.emit("call_user", {
      receiverId,
      offer: peer.localDescription,
    });
  } catch (error) {
    closeVoiceCall();
    useCallStore.getState().resetCall();
    throw error;
  }
}

export async function acceptVoiceCall() {
  const socket = getSocket();
  const { incomingCall } = useCallStore.getState();

  if (!socket?.connected || !incomingCall) {
    throw new Error("No incoming call is available.");
  }

  try {
    const { callerId, offer } = incomingCall;
    const peer = createPeerConnection(callerId);

    await addLocalTracks(peer);
    await peer.setRemoteDescription(offer);
    await addPendingCandidates(peer);

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.emit("accept_call", {
      callerId,
      answer: peer.localDescription,
    });

    useCallStore.setState({
      callStatus: "connecting",
      remoteUserId: callerId,
      incomingCall: null,
    });
  } catch (error) {
    closeVoiceCall();
    useCallStore.getState().resetCall();
    throw error;
  }
}

export async function handleCallAccepted({ answer }) {
  if (!peerConnection || !answer) return;

  await peerConnection.setRemoteDescription(answer);
  await addPendingCandidates(peerConnection);
}

export async function handleIceCandidate({ candidate }) {
  if (!candidate) return;

  if (!peerConnection?.remoteDescription) {
    pendingCandidates.push(candidate);
    return;
  }

  await peerConnection.addIceCandidate(candidate);
}

export function closeVoiceCall() {
  if (peerConnection) {
    peerConnection.ontrack = null;
    peerConnection.onicecandidate = null;
    peerConnection.onconnectionstatechange = null;
    peerConnection.close();
    peerConnection = null;
  }

  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
    localStream = null;
  }

  const remoteAudio = document.getElementById("remote-audio");

  if (remoteAudio) {
    remoteAudio.srcObject = null;
  }

  pendingCandidates = [];
}

export function endVoiceCall() {
  const socket = getSocket();
  const { remoteUserId, resetCall } = useCallStore.getState();

  if (socket?.connected && remoteUserId) {
    socket.emit("end_call", { targetUserId: remoteUserId });
  }

  closeVoiceCall();
  resetCall();
}
