import * as React from 'react';
import {Dispatch} from '../store';
import Icon from 'react-component-bytesize-icons';

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
                    <Icon name="plus" size="small"/>
                </div>
            </div>
        );
    }
}
