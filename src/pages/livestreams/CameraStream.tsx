import React, { useRef, useEffect } from 'react';

interface CameraStreamProps {
    onStreamReady: (stream: MediaStream) => void;
}

const CameraStream: React.FC<CameraStreamProps> = ({ onStreamReady }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Request access to the webcam
        async function enableStream() {
            try {

                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    onStreamReady(stream);
                }
            } catch (err) {
                console.error('Error accessing the webcam: ', err);
            }
        }

        enableStream();

        // Cleanup function to stop the video stream on component unmount
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, [onStreamReady]);

    return (
        <div>
            <video ref={videoRef} autoPlay playsInline muted>
                Your browser does not support embedded videos.
            </video>
        </div>
    );
};

export default CameraStream;