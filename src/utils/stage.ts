import IVSBroadcastClient, {
  LocalStageStream,
  Stage,
  StageEvents,
  SubscribeType,
} from "amazon-ivs-web-broadcast";
import { getMediaForDevices, CAMERA, MIC } from "./mediaDevices";

// Function creates a local stage stream based on the specified device ID and type (CAMERA or MIC).
export const createLocalStageStream = async (deviceId, deviceType) => {
  // Warn and return if the device ID is null
  if (!deviceId) {
    console.warn("Attempted to set local media with a null device ID");
    return;
  }

  // Get media stream for the specified device
  const newDevice = await getMediaForDevices(deviceId, deviceType);

  // Create a LocalStageStream based on the device type
  const stageStream =
    deviceType === CAMERA
      ? new LocalStageStream(newDevice.getVideoTracks()[0])
      : new LocalStageStream(newDevice.getAudioTracks()[0]);

  return stageStream;
};

/**
 * Sets up the Strategy for 3 major actions a user performs: which streams to publish, should streams be published, subcribing to streams
 * @param {*} cameraStageStream The current user's camera MediaStream
 * @param {*} micStageStream The current user's microphone MediaStream
 * @returns strategy object
 */

// Function creates a strategy object for IVS stage, considering initialization status
const setupStrategy = (
  isInitializeComplete // Parameter representing the initialization completion status
) => {
  // Check if the initialization is complete; if not, return nothing
  if (!isInitializeComplete) {
    return;
  }

  // Reference the SubscribeType property from the IVSBroadcastClient object
  // More information can be found here: https://aws.github.io/amazon-ivs-web-broadcast/docs/v1.3.1/sdk-reference/enums/SubscribeType?_highlight=subscribetype

  const strategy = {
    audioTrack: undefined,
    videoTrack: undefined,

    // Method to update audio and video tracks
    updateTracks(newAudioTrack, newVideoTrack) {
      this.audioTrack = newAudioTrack;
      this.videoTrack = newVideoTrack;
    },

    // Method to define streams to publish
    stageStreamsToPublish() {
      return [this.audioTrack, this.videoTrack];
    },

    // Method to determine participant publishing
    shouldPublishParticipant(participant) {
      return true;
    },

    // Method to determine type of subscription for participants
    shouldSubscribeToParticipant(participant) {
      return SubscribeType.AUDIO_VIDEO;
    },
  };

  return strategy; // Return the strategy object
};

/**
 * Click handler for Join Stage Button
 */

export const joinStage = async (
  isInitializeComplete, // Indicates if the initialization is complete
  participantToken, // Token of the participant
  selectedAudioDeviceId, // Represents the selected audio device
  selectedVideoDeviceId, // Represents the selected video device
  setIsConnected, // Setter for the connection status
  setIsMicMuted, // Setter for the microphone mute state
  setParticipants, // Setter for the list of participants
  stageRef, // Setter for the stage
  strategyRef
) => {
  const {
    ConnectionState, // Reference to the ConnectionState object
  } = IVSBroadcastClient; // IVS Broadcast Client object

  if (!isInitializeComplete) return; // If the initialization is not complete, stop execution and return

  const cameraStageStream = await createLocalStageStream(
    selectedVideoDeviceId,
    CAMERA
  );
  const micStageStream = await createLocalStageStream(
    selectedAudioDeviceId,
    MIC
  );

  // Set up the strategy for the stage
  const strategy = setupStrategy(isInitializeComplete);
  strategy.updateTracks(micStageStream, cameraStageStream);

  strategyRef.current = strategy;

  // Create a new stage instance
  let stage = new Stage(participantToken, strategyRef.current);

  // Event listener for stage connection state changes
  stage.on(StageEvents.STAGE_CONNECTION_STATE_CHANGED, (state) => {
    // Update the connection status
    setIsConnected(state === (ConnectionState.CONNECTED as string));

    // Mute the microphone stage stream and update the state for the mic button
    micStageStream.setMuted(true);
    setIsMicMuted(true);
  });

  // Event listener for when participant streams are added
  stage.on(
    StageEvents.STAGE_PARTICIPANT_STREAMS_ADDED,
    (participant, streams) => {
      setParticipants((prevParticipants) => {
        const participantExists = prevParticipants.some(
          (participantObj) => participantObj.participant.id === participant.id
        );

        if (!participantExists) {
          return [...prevParticipants, { participant, streams }];
        } else {
          return prevParticipants;
        }
      });
    }
  );

  // Event listener for when a participant leaves
  stage.on(StageEvents.STAGE_PARTICIPANT_LEFT, (participant) => {
    // Update the list of participants by removing the participant who left
    setParticipants((prevParticipants) => {
      const filteredParticipants = prevParticipants.filter(
        ({ participant: currentParticipant }) => {
          return currentParticipant.id !== participant.id;
        }
      );
      return [...filteredParticipants];
    });
  });

  try {
    await stage.join(); // Attempt to join the stage
  } catch (err) {
    stage = null;
  }

  stageRef.current = stage;
};

/**
 * Click handler for the Leave Stage button
 */
export const leaveStage = async (stage, setIsConnected) => {
  await stage.leave();
  setIsConnected(false);
};
