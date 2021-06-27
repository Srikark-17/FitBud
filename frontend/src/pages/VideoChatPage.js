import React, { useEffect, useState } from "react";

import VideoNavBar from "../components/VideoNavBar";
import WebRTCVideoChat from "../components/WebRTCVideoChat";

const VideoChatPage = (props) => {
  const [currentTime, setCurrentTime] = useState(0);
  const startTimer = () => {
    /*setInterval(() => {
      setCurrentTime(time => time + 1);
    }, 1000);*/
  };

  useEffect(() => {
    setInterval(() => {
      setCurrentTime((time) => time + 1);
    }, 1000);
  }, []);
  return (
    <>
      <VideoNavBar currentTime={currentTime} />
      <WebRTCVideoChat socket={props.socket} startTimer={startTimer} />
    </>
  );
};

export default VideoChatPage;
