import React, { useState } from "react";
import profile from "../../assets/profile.svg";
import Microphone from "../../assets/microphone.svg";
import Video from "../../assets/video.svg";

import "./style.scss";

const exerciseCount = {};

const WebRTCVideoChat = () => {
  const [currentExercise, setCurrentExercise] = useState("Resting");
  const [remoteExercise, setRemoteExercise] = useState("Resting");
  const [calories, setCalories] = useState(0);
  const [time, setTime] = useState(0);
  const [currentScores, setScores] = useState([]);

  return (
    <>
      <div className="userVideos">
        <div style={{ display: "flex" }}>
          <div className="localFeed">
            <div className="nameTag">
              <img src={profile} alt="Profile Avatar" className="avatar" />
              <div>
                <p className="userTitle">User</p>
                <p className="username">Om Joshi</p>
              </div>
            </div>
            <div className="microphoneButton">
              <img
                src={Microphone}
                alt="Microphone"
                className="microphoneSVG"
              />
            </div>
            <div className="videoButton">
              <img src={Video} alt="Video" className="cameraSVG" />
            </div>
            
            <div
              className={`localExercise ${
                remoteExercise === "Resting" ? " userResting" : " userActive"
              }`}
            >
              <p>Current Exercise</p>
              <p className="currentExercise">{remoteExercise}</p>
            </div>
            <div className="yourNameTag">
              <img src={profile} alt="Profile Avatar" className="avatar" />
              <div>
                <p className="userTitle">User</p>
                <p className="username">Srikar Kusumanchi</p>
              </div>
            </div>
          </div>
          <div className="remoteFeed">
            <div className="scores">
              {currentScores.map((score) => (
                <div className="score">
                  <div className="col">
                    <p className="value">{score.value}</p>
                    <p className="word">Score</p>
                  </div>
                  <p className="message">{score.message}</p>
                </div>
              ))}
            </div>
            <div className="microphoneButton">
              <img
                src={Microphone}
                alt="Microphone"
                className="microphoneSVG"
              />
            </div>
            <div className="videoButton">
              <img src={Video} alt="Video" className="cameraSVG" />
            </div>

            <div
              className={`localExercise ${
                currentExercise === "Resting" ? " userResting" : " userActive"
              }`}
            >
              <p>Current Exercise</p>
              <p className="currentExercise">{currentExercise}</p>
            </div>
            <div className="userVideo">
              
            </div>
          </div>
        </div>
        <div>
          <div className="liveStatTitle">Live Statistics</div>
          <div className="liveStatContainer">
            <div className="workoutCounterContainer">
              <p className="workoutCounterTitle">Workout Count</p>
              <div className="workoutCounterAlignment">
                <p className="workoutType">Type</p>
                <p className="repCount">Reps</p>
              </div>
              {Object.keys(exerciseCount).map(function (key) {
                return (
                  <>
                    <div className="workoutCounterAlignment">
                      <p className="workoutName">{key}</p>
                      <p className="overallRepCount">{exerciseCount[key]}x</p>
                    </div>
                    <div className="diffWorkoutDivider" />
                  </>
                );
              })}
            </div>
            <div className="calTime">
              <div className="activeTimeContainer">
                <p className="activeTimeTitle">Active Time</p>
                <p className="activeTimeDescription">This Session</p>
                <p className="activeTimeValue">{Math.floor(time)}s</p>
              </div>
              <div className="caloriesBurned">
                <p className="caloriesBurnedTitle">Calories Burned</p>
                <p className="caloriesBurnedDescription">This Session</p>
                <p className="caloriesBurnedValue">
                  {Math.floor(calories)} cal
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WebRTCVideoChat;
