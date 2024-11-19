// // PlayerDemo.tsx
// import React, { useEffect, useRef, FC } from 'react';
// import ReactDOM from 'react-dom';
// import { create, Player } from 'amazon-ivs-player';
// import { setupForm, getFormStream } from '../../utils/formControl';

// interface PlayerDemoProps {
//     stream: string;
// }

// const PlayerDemo: FC<PlayerDemoProps> = ({ stream }) => {
//     const videoRef = useRef<HTMLVideoElement | null>(null);
//     const playerRef = useRef<Player | null>(null);

//     useEffect(() => {
//         const IVSPackage = window.IVSPlayer;

//         if (!IVSPackage.isPlayerSupported()) {
//             console.error('IVS Player is not supported in this browser');
//             return;
//         }

//         const player = IVSPackage.create({
//             serviceWorker: {
//                 url: 'amazon-ivs-service-worker-loader.js',
//             },
//         });

//         player.attachHTMLVideoElement(videoRef.current!);
//         playerRef.current = player;

//         const versionString = document.querySelector('.version') as HTMLElement;
//         versionString.innerText = `Amazon IVS Player version ${player.getVersion()}`;

//         player.setAutoplay(true);
//         player.load(stream);

//         const { ErrorType, PlayerEventType, PlayerState } = IVSPackage;

//         for (const state of Object.values(PlayerState)) {
//             player.addEventListener(state, () =>;
//         }

//         player.addEventListener(PlayerEventType.INITIALIZED, () => 
//         player.addEventListener(PlayerEventType.ERROR, (error) => {
//             const statusTooManyRequests = 429;
//             if (error.type === ErrorType.NOT_AVAILABLE && error code === statusTooManyRequests) {
//             console.error('Concurrent-viewer limit reached', error);
//         } else {
//             console.error('ERROR', error);
//         }
//     });

//     player.addEventListener(PlayerEventType.QUALITY_CHANGED, (quality) => 
//     player.addEventListener(PlayerEventType.TEXT_CUE, (cue) => 
//     player.addEventListener(PlayerEventType.TEXT_METADATA_CUE, (cue) => 

//     return () => {
//         player.dispose();
//         playerRef.current = null;
//     };
// }, [stream]);

// return (
//     <div>
//         <video id="video-player" ref={videoRef} style={{ width: '100%', height: '100%' }} />
//         <div class="version"></div>
//     </div>
// );
// };

// export default PlayerDemo;

// window.addEventListener('DOMContentLoaded', () => {
//     const initialStream = getFormStream();
//     const demoElement = document.getElementById('demo');

//     if (demoElement && initialStream) {
//         ReactDOM.render(<PlayerDemo stream={initialStream} />, demoElement);
//     }

//     setupForm((stream: string) => {
//         ReactDOM.render(<PlayerDemo stream={stream} />, demoElement!);
//     });
// });
