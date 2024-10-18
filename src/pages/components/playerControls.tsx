import React, { FC } from 'react';
import { CONTROLS } from './config';
import { AspectRatio } from '@mui/icons-material';
import { Close } from '@mui/icons-material';
import { VolumeOff } from '@mui/icons-material';
import { VolumeUp } from '@mui/icons-material';

interface PlayerControlsProps {
    controls: string[];
    muted: boolean;
    onClose: () => void;
    onMute: () => void;
    onResize: () => void;
}

const PlayerControls: FC<PlayerControlsProps> = ({ controls, muted, onClose, onMute, onResize }) => {
    const renderControl = (control: string, key: number) => {
        let Icon: React.FC;
        let callback: () => void;

        switch (control) {
            case CONTROLS.close:
                Icon = Close;
                callback = onClose;
                break;
            case CONTROLS.mute:
                Icon = muted ? VolumeOff : VolumeUp;
                callback = onMute;
                break;
            case CONTROLS.resize:
                Icon = AspectRatio;
                callback = onResize;
                break;
            default:
                return null;
        }

        return (
            <button key={key} className="PlayerControls-button" onClick={callback}>
                <Icon />
            </button>
        );
    };

    return (
        <div className="PlayerControls">
            {controls.map((control, i) => renderControl(control, i))}
        </div>
    );
};

export default PlayerControls;