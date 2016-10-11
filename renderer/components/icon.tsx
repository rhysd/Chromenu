import * as React from 'react';
import {Page} from '../states/pages';
import log from '../log';
import {Dispatch} from '../store';

interface IconProps extends React.Props<Icon> {
    page: Page;
    isCurrent: boolean;
    index: number;
    dispatch: Dispatch;
}

export default class Icon extends React.Component<IconProps, {}> {
    constructor(props: IconProps) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        if (this.props.isCurrent) {
            log.debug('TODO: Open Configuration for this icon');
            this.props.dispatch({
                type: 'SetConfigured',
                index: this.props.index,
                value: false,
            });
        } else {
            log.debug('TODO: Open URL with <webview>');
        }
    }

    render() {
        const {page} = this.props;
        return (
            <div className="page-icon" title={page.url} onClick={this.onClick}>
                <img src={page.icon_image} alt={this.props.page.url}/>
            </div>
        );
    }
}
