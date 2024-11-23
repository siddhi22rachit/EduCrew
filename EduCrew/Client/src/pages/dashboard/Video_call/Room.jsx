import React, { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const VideoPage = () => {
    const { id } = useParams();
    const roomID = id;
    const containerRef = useRef(null);

    useEffect(() => {
        const initializeCall = async () => {
            const appID = 357018633;
            const serverSecret = "1758ff14e517e613b5f6bf54168751eb";
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, Date.now().toString(), "EduCrew User");

            const zp = ZegoUIKitPrebuilt.create(kitToken);

            zp.joinRoom({
                container: containerRef.current,
                sharedLinks: [
                    {
                        name: 'Copy link',
                        url:
                            window.location.protocol + '//' +
                            window.location.host + window.location.pathname +
                            '?roomID=' +
                            roomID,
                    },
                ],
                scenario: {
                    mode: ZegoUIKitPrebuilt.GroupCall,
                },
                showScreenSharingButton: true,
                showTurnOffRemoteCameraButton: true,
                showTurnOffRemoteMicrophoneButton: true,
                showRemoveUserButton: true,
            });
        };

        initializeCall();
    }, [roomID]);

    return (
        <div className="h-screen w-screen bg-black">
            <div 
                ref={containerRef}
                className="w-full h-full"
            ></div>
        </div>
    )
}

export default VideoPage;