import * as React from 'react';
import Icon, {BytesizeIconName} from 'react-component-bytesize-icons';

interface ControlButtonProps extends React.Props<ControlButton> {
    icon: BytesizeIconName;
    enabled: boolean;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    tip?: string;
}

export default class ControlButton extends React.PureComponent<ControlButtonProps, {}> {
    render() {
        const {icon, enabled, tip, onClick} = this.props;
        const handleClick = enabled ? onClick : undefined;
        return (
            <div
                className={enabled ? 'control-button' : 'control-button control-button-disabled'}
                title={tip}
                onClick={handleClick}
            >
                <Icon name={icon} size="small"/>
            </div>
        );
    }
}
