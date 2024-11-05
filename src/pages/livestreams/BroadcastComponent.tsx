// Importing the necessary dependencies for managing state and side effects in a React component
import { useState, useEffect, useRef } from "react";

import {
  getDevices,
  handleMediaToggle,
  MIC,
  CAMERA,
} from "../../utils/mediaDevices";
import {
  leaveStage,
  joinStage,
  createLocalStageStream,
} from "../../utils/stage";

import Input from "./../components/Input";
import LocalParticipantVideo from "../../pages/livestreams/LocalParticipantVideo";
import RemoteParticipantVideos from "../../pages/livestreams/RemotePartitipantVideos";
import { Select } from "./../components/Select";
import { PlaybackStream } from "./PlaybackStream";
import { GamingChat } from "../../components/Chat";
import { VideoStream } from "../../components/VideoStream";

import { LayoutControlProvider } from "../../contexts/LayoutController";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { Grid } from "@mui/material";

export const LivestreamPage = () => {
  const { login } = useTypedSelector((state) => state);
  // Initializing a state variable and its update function
  const [isInitializeComplete, setIsInitializeComplete] = useState(false);

  const [chatId, setChatId] = useState("");
  // Using the useState hook to create and manage state for video and audio devices and their selections
  const [videoDevices, setVideoDevices] = useState([]); // Stores the available video devices
  const [audioDevices, setAudioDevices] = useState([]); // Stores the available audio devices
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState(null); // Tracks the selected video device
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState(null); // Tracks the selected audio device

  // Initialize state for the participant token as an empty string
  const [participantToken, setParticipantToken] = useState("");

  // Initialize state variables for managing the current stage, connection status, participant list, and local participant information
  const [isConnected, setIsConnected] = useState(false); // Tracks the connection status
  const [participants, setParticipants] = useState([]); // Manages the list of participants
  const [localParticipant, setLocalParticipant] = useState({}); // Manages the local participant information

  // Create a ref for the stage to hold a reference to the IVS stage instance.
  const stageRef = useRef(undefined);

  // Create a ref for the strategy to hold a reference to the strategy configuration used in the IVS stage.
  const strategyRef = useRef();

  // Initialize a state variable to manage the muted status of the microphone
  const [isMicMuted, setIsMicMuted] = useState(true);

  // Initialize a state variable to manage the visibility status of the camera
  const [isCameraHidden, setIsCameraHidden] = useState(false);

  /**
   * Function gets the video and audio devices connected to the laptop and stores them in the state
   */
  const handleDeviceUpdate = async () => {
    try {
      const { videoDevices, audioDevices } = await getDevices();

      setVideoDevices(videoDevices);
      setSelectedVideoDeviceId(videoDevices[0]?.deviceId);

      setAudioDevices(audioDevices);
      setSelectedAudioDeviceId(audioDevices[0]?.deviceId);
    } catch (error) {
      // Handle any errors that may occur during the device update process
      console.error("An error occurred during device update:", error);
      // You can add additional error-handling logic here as needed
    }
  };

  useEffect(() => {
    // Call the initialize function to update the video and audio devices
    initialize();
  }, []);

  /**
   * Initialize after the client is loaded
   */
  const initialize = async () => {
    // Call the handleDeviceUpdate function to update the video and audio devices
    handleDeviceUpdate();
    // Set the value of isInitializeComplete to true
    const payload = await fetch(
      "http://46.117.80.103:4000/chats/addUserToChat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          userEmail: login.user.email,
          chatId: JSON.parse(chatId),
        }),
      }
    );

    setChatId(JSON.parse(chatId));
    setIsInitializeComplete(true);
  };

  const updateLocalParticipantMedia = async () => {
    const { participant }: any = localParticipant;

    // Create new local streams
    const newVideoStream = await createLocalStageStream(
      selectedVideoDeviceId,
      CAMERA
    );
    const newAudioStream = await createLocalStageStream(
      selectedAudioDeviceId,
      MIC
    );

    // Update the streams array with the new streams
    const updatedStreams = [newVideoStream, newAudioStream];

    // Update the participant object with the new streams
    const updatedParticipant = {
      participant,
      streams: updatedStreams,
    };

    setLocalParticipant(updatedParticipant);

    (strategyRef.current as any).updateTracks(newAudioStream, newVideoStream);
    stageRef.current.refreshStrategy();
  };

  const checkTracks = () => {
    if (strategyRef && strategyRef.current) {
      return (
        (strategyRef.current as any).audioTrack &&
        (strategyRef.current as any).videoTrack
      );
    }
    return false;
  };

  useEffect(() => {
    //Check to ensure that the stage and the strategy have completed initialization
    const isInitializingStreams = checkTracks();
    if (!isInitializeComplete || isInitializingStreams) {
      return;
    } // If initialization is not complete, return

    if ((localParticipant as any).streams) {
      updateLocalParticipantMedia();
    }
  }, [selectedVideoDeviceId, selectedAudioDeviceId]);

  return (
    <div style={{ background: "black" }}>
      <LayoutControlProvider>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <VideoStream />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <GamingChat chatId={chatId} />
          </Grid>
        </Grid>
      </LayoutControlProvider>
    </div>
  );
};
