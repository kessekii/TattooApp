import { useEffect, useRef } from "react";



export const PlaybackStream = (props: { broadcastLink: string }) => {
    const workerRef = useRef<Worker | null>(null);
    useEffect(() => {
        workerRef.current = new Worker('./workers/ivsWorker.ts');

        workerRef.current.addEventListener('message', (event) => {
            console.log('Worker response:', event.data);
        });
    }, []);



    return (

        <div className="demo">
            <div className="video-container">
                <form className="src-container-direct">
                    <input className="src-input" placeholder="Enter IVS .m3u8" />
                    <button className="src-submit" type="submit">Load</button>
                </form>
                <video id="video-player" playsInline controls></video>
                <div className='version'></div>
            </div>
        </div>

    );
}

