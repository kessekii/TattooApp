import React, { useEffect, useRef, FC } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface BasePlayerProps {
    initializePlayer: (reference: HTMLVideoElement) => void;
}

const BasePlayer: FC<BasePlayerProps> = ({ initializePlayer }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const videoElement = videoRef.current;

        if (videoElement) {
            initializePlayer(videoElement);
        }

        return () => {
            // Optional cleanup logic, if necessary, goes here.
        };
    }, [initializePlayer]);

    return (
        <video
            ref={videoRef}
            className="video-js vjs-big-play-centered"
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default BasePlayer;