import React, { createRef, useEffect, useState } from "react";
import PoseEstimation from "./PoseEstimation";
import profile from "../../assets/profile.svg";
import Microphone from "../../assets/microphone.svg";
import Video from "../../assets/video.svg";

import "./style.scss";
import { db } from "../../firebase";

const exerciseCount = {};
let interval = null;
const WebRTCVideoChat = (props) => {
  const [currentExercise, setCurrentExercise] = useState("Resting");
  const [remoteExercise, setRemoteExercise] = useState("Resting");
  const [calories, setCalories] = useState(0);
  const [time, setTime] = useState(0);
  const [chartData, setChartData] = useState([
    { uv: 50 },
    { uv: 50 },
    { uv: 50 },
    { uv: 50 },
    { uv: 50 },
  ]);
  const [currentScores, setScores] = useState([]);
  const [borderStyle, setBorderStyle] = useState(
    "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 0%)"
  );

  const setCurrentExerciseTwo = (exercise) => {
    if (exercise !== "Resting") {
      interval = setInterval(() => {
        setTime((time) => time + 0.1);
      }, 100);
      if (exercise in exerciseCount) {
        exerciseCount[exercise] += 1;
      } else {
        exerciseCount[exercise] = 1;
      }
      if (exercise === "Jumping Jack") {
        setCalories(calories + 0.5);
      } else if (exercise === "Squat") {
        setCalories(calories + 0.24);
      }
    } else if (interval) {
      clearInterval(interval);
    }
    setCurrentExercise(exercise);
  };

  const servers = {
    iceServers: [
      {
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  let localStream = null;
  let remoteStream = null;

  const webcamVideo = createRef();
  const remoteVideo = createRef();
  const [roomId, setRoomId] = useState("");

  useEffect(async () => {
    const pc = new RTCPeerConnection(servers);

    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    remoteStream = new MediaStream();
    // Push tracks from local stream to peer connection
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    // Pull tracks from remote stream, add to video stream
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    if (remoteVideo.current) {
      remoteVideo.current.srcObject = remoteStream;
    }

    // Check if we should create or join a call
    db.collection("calls")
      .get()
      .then(async (querySnapshot) => {
        // If there is no ongoing call, go ahead and create a new call.
        if (querySnapshot.empty) {
          const callDoc = db.collection("calls").doc();
          const offerCandidates = callDoc.collection("offerCandidates");
          const answerCandidates = callDoc.collection("answerCandidates");

          props.socket.emit("joinRoom", callDoc.id);
          setRoomId((id) => callDoc.id);

          pc.onicecandidate = (event) => {
            if (event.candidate) {
              offerCandidates.add(event.candidate.toJSON());
            }
          };

          const offerDescription = await pc.createOffer();
          await pc.setLocalDescription(offerDescription);

          const offer = {
            sdp: offerDescription.sdp,
            type: offerDescription.type,
          };

          await callDoc.set({ offer });

          callDoc.onSnapshot((snapshot) => {
            const data = snapshot.data();
            if (!pc.currentRemoteDescription && data && data.answer) {
              const answerDescription = new RTCSessionDescription(data.answer);
              pc.setRemoteDescription(answerDescription);
            }
          });

          answerCandidates.onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                const candidate = new RTCIceCandidate(change.doc.data());
                pc.addIceCandidate(candidate);
              }
            });
          });
        }
        // If there is an ongoing call, go ahead and create a new call.
        else {
          querySnapshot.forEach(async (doc) => {
            const callDoc = db.collection("calls").doc(doc.id);
            const answerCandidates = callDoc.collection("answerCandidates");
            const offerCandidates = callDoc.collection("offerCandidates");

            pc.onicecandidate = (event) => {
              if (event.candidate) {
                answerCandidates.add(event.candidate.toJSON());
              }
            };

            const callData = (await callDoc.get()).data();

            const offerDescription = callData.offer;
            await pc.setRemoteDescription(
              new RTCSessionDescription(offerDescription)
            );

            const answerDescription = await pc.createAnswer();
            await pc.setLocalDescription(answerDescription);

            const answer = {
              type: answerDescription.type,
              sdp: answerDescription.sdp,
            };

            await callDoc.update({ answer });

            offerCandidates.onSnapshot((snapshot) => {
              snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                  const data = change.doc.data();
                  pc.addIceCandidate(new RTCIceCandidate(data));
                }
              });
            });
            props.startTimer();
            callDoc.delete();

            props.socket.emit("joinRoom", doc.id);
            setRoomId((id) => doc.id);
          });
        }
      });
    props.socket.on("newExercise", (data) => {
      setRemoteExercise((exercise) => data);
    });
    props.socket.on("confidenceScore", (data) => {
      console.log("found new score");
      console.log(data);
      if (data > 74) {
        setBorderStyle(
          (style) => "linear-gradient(180deg, #23FF53 0%, #03BFFF 100%)"
        );
        setTimeout(() => {
          setBorderStyle(
            (style) => "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 0%)"
          );
        }, 3000);
      } else if (data > 49) {
        setBorderStyle(
          (style) => "linear-gradient(180deg, #7A4CFD 0%, #FF4752 100%)"
        );
        setTimeout(() => {
          setBorderStyle(
            (style) => "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 0%)"
          );
        }, 3000);
      } else {
        setBorderStyle(
          (style) => "linear-gradient(180deg, #FF2323 0%, #FFA959 100%)"
        );
        setTimeout(() => {
          setBorderStyle(
            (style) => "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 0%)"
          );
        }, 3000);
      }

      setChartData((chart) => {
        const newChartData = [...chart];
        newChartData.push({ uv: data });
        return newChartData;
      });

      setScores((scores) => {
        const newScores = [...scores];
        let newMessage = "";
        if (data < 30) {
          newMessage = "That's it?";
        } else if (data < 50) {
          newMessage = "Harder!";
        } else if (data < 75) {
          newMessage = "That's it!";
        } else {
          newMessage = "You're on fire!";
        }
        const newScore = {
          message: newMessage,
          value: Math.floor(data),
        };
        newScores.push(newScore);

        return newScores;
      });
    });
  }, []);

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
            <video
              ref={remoteVideo}
              autoPlay
              playsInline
              className="videoDisplay"
            />
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
              <PoseEstimation
                socket={props.socket}
                roomId={roomId}
                setCurrentExercise={setCurrentExerciseTwo}
              />
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
