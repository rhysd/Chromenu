import * as React from 'react';
import {Dispatch} from '../store';
import {createPage} from '../actions/pages';

interface AddPageProps {
    dispatch: Dispatch;
}

export default class AddPage extends React.Component<AddPageProps, {}> {
    constructor(props: AddPageProps) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        this.props.dispatch(createPage());
    }

    render() {
        return (
            <div className="add-icon" onClick={this.onClick}>
                <i className="fa fa-plus fa-5x" aria-hidden="true"></i>
            </div>
        );
    }
}
