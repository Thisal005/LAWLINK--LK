import React, { useEffect, useRef, useState } from "react";
import useVideocall from "../hooks/useVideocall";
import { toast } from "react-toastify";
import axios from "axios";
import { Camera, CameraOff, Mic, MicOff, PhoneOff } from "lucide-react";

const VideoMeet = ({ meetingId, userName }) => {
  const {
    localStream,
    remoteStream,
    startCall,
    endCall,
    toggleMute,
    toggleVideo,
  } = useVideocall(meetingId);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [callStarted, setCallStarted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true); // Track audio state
  const [videoEnabled, setVideoEnabled] = useState(true); // Track video state
  const [loading, setLoading] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState(null);

  useEffect(() => {
    if (meetingId) {
      fetchMeetingInfo();
    }
  }, [meetingId]);

  useEffect(() => {
    if (callStarted && localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
    if (callStarted && remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream, callStarted]);

  const fetchMeetingInfo = async () => {
    try {
      const response = await axios.get(`/api/meetings/${meetingId}`, {
        withCredentials: true,
      });
      setMeetingInfo(response.data);
    } catch (err) {
      toast.error("Failed to fetch meeting information");
    }
  };

  const handleStartCall = async () => {
    try {
      setLoading(true);
      await startCall();
      setCallStarted(true);
      await axios.post(
        `/api/meetings/join/${meetingId}`,
        { userName: userName || "Anonymous" },
        { withCredentials: true }
      );
      toast.success("Joined meeting");
    } catch (err) {
      toast.error("Failed to start call");
    } finally {
      setLoading(false);
    }
  };

  const handleEndCall = async () => {
    try {
      await endCall();
      setCallStarted(false);
      toast.success("Meeting ended");
    } catch (err) {
      toast.error("Failed to end meeting");
    }
  };

  const handleToggleAudio = () => {
    toggleMute();
    setAudioEnabled(!audioEnabled);
    toast.info(audioEnabled ? "Mic muted" : "Mic unmuted");
  };

  const handleToggleVideo = () => {
    toggleVideo();
    setVideoEnabled(!videoEnabled);
    toast.info(videoEnabled ? "Camera off" : "Camera on");
  };

  
  if (!callStarted) {
    return (
      <div className="p-6 bg-white rounded-lg h-full border border-gray-200 flex flex-col justify-center items-center">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            {meetingInfo?.title || "Video Meeting"}
          </h1>
          <p className="text-sm text-gray-600">Room ID: {meetingId}</p>
        </div>

        <div className="w-full max-w-sm">
          <div className="relative rounded-lg overflow-hidden bg-gray-100 h-48 mb-6">
            {videoEnabled ? (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-2xl font-semibold text-gray-600">
                  {userName?.charAt(0) || "U"}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleStartCall}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <span>Join Meeting</span>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Main meeting UI
  return (
    <div className="p-6 bg-white rounded-lg h-full border border-gray-200 flex flex-col">
      {/* Video Area */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative rounded-lg overflow-hidden bg-gray-100">
          {videoEnabled ? (
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-2xl font-semibold text-gray-600">
                {userName?.charAt(0) || "U"}
              </span>
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-gray-800 bg-opacity-70 text-white text-sm px-2 py-1 rounded">
            You {audioEnabled ? "" : "(Muted)"}
          </div>
        </div>

        <div className="relative rounded-lg overflow-hidden bg-gray-100">
          <video
            ref={remoteVideoRef}
            autoPlay
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-gray-800 bg-opacity-70 text-white text-sm px-2 py-1 rounded">
            Remote
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleToggleAudio}
          className={`p-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors ${
            audioEnabled ? "text-gray-600" : "text-red-500"
          }`}
        >
          {audioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
        </button>

        <button
          onClick={handleToggleVideo}
          className={`p-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors ${
            videoEnabled ? "text-gray-600" : "text-red-500"
          }`}
        >
          {videoEnabled ? <Camera size={20} /> : <CameraOff size={20} />}
        </button>

        <button
          onClick={handleEndCall}
          className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
          <PhoneOff size={20} />
        </button>
      </div>
    </div>
  );
};

export default VideoMeet;