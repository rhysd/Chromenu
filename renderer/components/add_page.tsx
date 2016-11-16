import * as React from 'react';
import {Dispatch} from '../store';
import {Plus} from 'react-bytesize-icons';

interface AddPageProps {
    dispatch: Dispatch;
}

export default class AddPage extends React.PureComponent<AddPageProps, {}> {
    constructor(props: AddPageProps) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        this.props.dispatch({type: 'CreatePage'});
    }

    render() {
        return (
            <div className="add-icon__container" title="New page">
                <div className="add-icon" onClick={this.onClick}>
                    <Plus width={16} height={16}/>
                </div>
            </div>
        );
    }
}
