import React, { useEffect, useState } from 'react';

import VideoNavBar from '../components/VideoNavBar';
import WebRTCVideoChat from '../components/WebRTCVideoChat';

const VideoChatPage  = () => { 

  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setCurrentTime(time => time + 1);
    }, 1000)
  }, [])

  return (
    <>
      <VideoNavBar currentTime={currentTime}/>
      <WebRTCVideoChat />
    </>
  )
}

export default VideoChatPage