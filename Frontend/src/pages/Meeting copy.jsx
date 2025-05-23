import React from "react";
import VideoMeet from "../Components/videoMeet";
import { useParams } from "react-router-dom";

const Meeting = () => {
  const { meetingId } = useParams();

  return (
    <div className="container mx-auto p-4">
      <VideoMeet meetingId={meetingId} />
    </div>
  );
};

export default Meeting;