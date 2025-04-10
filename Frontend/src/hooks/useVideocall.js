import { useState, useEffect, useRef } from "react";
import { useSocketContext } from "../Context/SocketContext";
import { toast } from "react-toastify";

const useVideocall = (meetingId) => {
  const { socket } = useSocketContext();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [role, setRole] = useState(null);
  const peerConnectionRef = useRef(null);

  const startCall = async () => {
    if (!socket || !socket.connected) {
      toast.error("Cannot start call: Server not connected");
      return;
    }

    try {
      console.log("Requesting media devices...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      console.log("Media devices acquired:", stream);

      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          {
            urls: "turn:openrelay.metered.ca:80",
            username: "openrelayproject",
            credential: "openrelayproject",
          },
        ],
      });
      peerConnectionRef.current = pc;

      stream.getTracks().forEach((track) => {
        console.log("Adding track:", track);
        pc.addTrack(track, stream);
      });

      pc.onicecandidate = (event) => {
        if (event.candidate && socket.connected) {
          socket.emit("ice-candidate", { candidate: event.candidate, meetingId });
        }
      };

      pc.ontrack = (event) => {
        console.log("Received remote stream:", event.streams[0]);
        setRemoteStream(event.streams[0]);
      };

      if (role === "initiator") {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer", { offer, meetingId });
      }

      socket.emit("join-meeting", meetingId);
      setIsCallActive(true);
    } catch (error) {
      console.error("Error starting video call:", error.name, error.message);
      if (error.name === "NotReadableError") {
        toast.error("Camera or microphone is in use by another application.");
      } else {
        toast.error("Failed to start video call: " + error.message);
      }
      throw error;
    }
  };

  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (socket && socket.connected) {
      socket.emit("leave-meeting", meetingId);
    }
    setLocalStream(null);
    setRemoteStream(null);
    setIsCallActive(false);
    setRole(null);
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
        return audioTrack.enabled;
      }
    }
    return audioEnabled;
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
        return videoTrack.enabled;
      }
    }
    return videoEnabled;
  };

  useEffect(() => {
    if (!socket) return;

    const setupListeners = () => {
      socket.on("role-assigned", ({ role }) => {
        console.log(`Assigned role: ${role}`);
        setRole(role);
        if (role === "initiator") {
          startCall();
        }
      });

      socket.on("offer", async ({ offer, from }) => {
        const pc = peerConnectionRef.current;
        if (!pc || role !== "receiver") return;
        console.log(`Received offer from ${from}`);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer", { answer, meetingId });
      });

      socket.on("answer", ({ answer }) => {
        const pc = peerConnectionRef.current;
        if (pc) {
          console.log("Received answer");
          pc.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });

      socket.on("ice-candidate", ({ candidate }) => {
        const pc = peerConnectionRef.current;
        if (pc) {
          console.log("Received ICE candidate");
          pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      socket.on("user-left", () => {
        setRemoteStream(null);
        setIsCallActive(false);
        toast.info("The other participant has left the meeting");
      });
    };

    if (socket.connected) {
      setupListeners();
    } else {
      socket.on("connect", setupListeners);
    }

    return () => {
      socket.off("role-assigned");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-left");
      socket.off("connect");
      if (isCallActive) endCall();
    };
  }, [socket, meetingId, role]);

  return {
    localStream,
    remoteStream,
    isCallActive,
    startCall,
    endCall,
    toggleMute,
    toggleVideo,
    audioEnabled,
    videoEnabled,
  };
};

export default useVideocall;