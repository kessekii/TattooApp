import React, { useState, useEffect, useRef } from "react";

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { firestore } from "../../App";

import ChatComponent from "../components/chat";

import { useTypedSelector } from "../../hooks/useTypedSelector";
import { Button, Typography } from "@mui/material";
import { ThemeProvider } from "styled-components";
import { PageWrapper } from "../components/reusableComponents";
import theme from "../../utils/theme";
// Define the Firebase configuration

// Initialize Firebase

// WebRTC configuration
const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

const NewStreamPage = (): JSX.Element => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callId, setCallId] = useState("");
  const [chatId, setChatId] = useState("");
  const pc = useRef<RTCPeerConnection>(new RTCPeerConnection(servers));

  const { login } = useTypedSelector((state) => state);

  // Access to video elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // useEffect(() => {
  //     const cleanUp = () => {
  //         localStream?.getTracks().forEach(track => track.stop());
  //         remoteStream?.getTracks().forEach(track => track.stop());
  //         pc.current.close();
  //     };

  //     return cleanUp;
  // }, [localStream, remoteStream]);

  const startWebcam = async () => {
    // Reinitialize the RTCPeerConnection
    pc.current = new RTCPeerConnection(servers);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      localVideoRef.current!.srcObject = stream;

      stream.getTracks().forEach((track) => {
        pc.current.addTrack(track, stream);
      });

      pc.current.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          if (remoteStream) {
            remoteStream.addTrack(track);
            setRemoteStream(remoteStream);
          } else {
            const newStream = new MediaStream([track]);
            setRemoteStream(newStream);
            remoteVideoRef.current!.srcObject = newStream;
          }
        });
      };
    } catch (error) {
      console.error("Failed to start webcam", error);
    }
  };

  const handleAddOffer = async (
    id: string,
    offer: RTCSessionDescriptionInit
  ) => {
    try {
      await setDoc(doc(collection(firestore, "rtc-connections"), id), {
        offer: JSON.stringify(offer),
      });
    } catch (error) {
      console.error("Failed to add to firestore", error);
    }
  };

  const handleAddAnswer = async (
    id: any,
    docData: any,
    answer: RTCSessionDescriptionInit
  ) => {
    try {
      await updateDoc(doc(firestore, "rtc-connections/" + id), {
        answer: JSON.stringify(answer),
      });
    } catch (error) {
      console.error("Failed to add to firestore", error);
    }
  };

  const createOffer = async () => {
    try {
      const callDocRef = doc(collection(firestore, "rtc-connections"));
      const offerCandidatesDocRef = collection(callDocRef, "offerCandidates");
      const answerCandidatesDocRef = collection(callDocRef, "answerCandidates");
      pc.current.onicecandidate = (event) => {
        event.candidate &&
          addDoc(offerCandidatesDocRef, event.candidate.toJSON());
      };
      const offerDescription = await pc.current.createOffer();
      pc.current.setLocalDescription(offerDescription);
      handleAddOffer(callDocRef.id, offerDescription);

      const getStreamId = async () => {
        try {
          if (!login) {
            return;
          }
          const payload = await fetch(
            "http://46.117.80.103:4000/streams/createStream",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization:
                  "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
                "Access-Control-Allow-Origin": "*",
              },
              body: JSON.stringify({
                userEmail: login.user.email,
              }),
            }
          );

          const result = await payload.json();

          return {
            streamId: result.payload.streamId,
            chatId: result.payload.chatId,
          };
        } catch (error) {
          console.error("Failed to get stream id", error);
        }
      };
      const idObject = await getStreamId();

      setCallId(callDocRef.id);
      setChatId(idObject?.chatId);
      await updateDoc(doc(firestore, "rtc-connections/" + callDocRef.id), {
        chatId: JSON.stringify(idObject?.chatId),
      });

      onSnapshot(callDocRef, (snapshot) => {
        const data = snapshot.data();
        if (!pc.current.currentRemoteDescription && data && data.answer) {
          const answerDescription = new RTCSessionDescription(
            JSON.parse(data.answer)
          );
          pc.current.setRemoteDescription(answerDescription);
        }
      });

      onSnapshot(
        collection(
          firestore,
          "rtc-connections",
          callDocRef.id,
          "answerCandidates"
        ),
        { includeMetadataChanges: true },
        async (snapshot) => {
          snapshot.docChanges().forEach((change: any) => {
            if (
              (change.type === "added" || change.type === "modified") &&
              pc.current.remoteDescription
            ) {
              const data = change.doc.data();

              pc.current.addIceCandidate(new RTCIceCandidate(data));
            }
          });
        }
      );
    } catch (error) {
      console.error("Failed to create offer", error);
    }
  };

  const answerCall = async () => {
    try {
      const callDocRef = doc(collection(firestore, "rtc-connections"), callId);
      const offerCandidatesDocRef = collection(callDocRef, "offerCandidates");
      const answerCandidatesDocRef = collection(callDocRef, "answerCandidates");

      pc.current.onicecandidate = (event) => {
        event.candidate &&
          addDoc(answerCandidatesDocRef, event.candidate.toJSON());
      };

      const callData = await getDoc(callDocRef);

      if (!callData) {
        console.error("Call document does not exist");
        return;
      }

      const { chatId } = callData.data() as any;

      // setChatId(idObject)
      const data = JSON.parse(callData.data()!.offer);
      //
      const offerDescription = new RTCSessionDescription(
        data.offer as RTCSessionDescriptionInit
      );

      await pc.current.setRemoteDescription(data);

      const answerDescription = await pc.current.createAnswer();
      await handleAddAnswer(callId, data.offer, answerDescription);

      await pc.current.setLocalDescription(answerDescription);

      const payload = await fetch(
        "http://46.117.80.103:4000/chats/addUserToChat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            userEmail: login.user.email,
            chatId: JSON.parse(chatId),
          }),
        }
      );

      setChatId(JSON.parse(chatId));

      onSnapshot(
        collection(firestore, "rtc-connections", callId, "offerCandidates"),
        { includeMetadataChanges: true },
        async (snapshot: any) => {
          for (const change of snapshot.docChanges()) {
            if (change.type === "added" || change.type === "modified") {
              const data = change.doc.data();

              pc.current.addIceCandidate(new RTCIceCandidate(data));
            }
          }
        }
      );
    } catch (error) {
      console.error("Failed to answer call", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <PageWrapper style={{ marginTop: "20px", background: "grey" }}>
        <Typography style={{ color: "black" }}>1. Start your Webcam</Typography>
        <div className="videos">
          <div>
            <Typography style={{ color: "black" }}>Local Stream</Typography>
            <video ref={localVideoRef} autoPlay playsInline></video>
          </div>
          <div>
            <Typography style={{ color: "black" }}>Remote Stream</Typography>
            <video ref={remoteVideoRef} autoPlay playsInline></video>
          </div>
        </div>
        <Button onClick={startWebcam}>Start webcam</Button>

        <Typography style={{ color: "black" }}>2. Create a new Call</Typography>
        <Button onClick={createOffer} disabled={!localStream}>
          Create Call (offer)
        </Button>

        {chatId && <ChatComponent chatId={chatId} />}
        <Typography style={{ color: "black" }}>3. Join a Call</Typography>
        <input value={callId} onChange={(e) => setCallId(e.target.value)} />
        <Button onClick={answerCall} disabled={!callId}>
          Answer
        </Button>

        <Typography>4. Hangup</Typography>
        <Button onClick={() => pc.current.close()}>Hangup</Button>
      </PageWrapper>
    </ThemeProvider>
  );
};

export default NewStreamPage;
