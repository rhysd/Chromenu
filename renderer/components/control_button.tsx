import * as React from 'react';
import {BytesizeIconComponent} from 'react-bytesize-icons';

const IconSize = 32;

interface ControlButtonProps extends React.Props<ControlButton> {
    icon: typeof BytesizeIconComponent;
    enabled: boolean;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default class ControlButton extends React.PureComponent<ControlButtonProps, {}> {
    render() {
        const {enabled, onClick} = this.props;
        const onclick = enabled ? onClick : undefined;
        return (
            <div className={enabled ? 'control-button' : 'control-button control-button-disabled'} onClick={onclick}>
                <this.props.icon width={IconSize} height={IconSize}/>
            </div>
        );
    }
}
