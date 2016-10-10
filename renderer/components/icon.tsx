import * as React from 'react';
import {Page} from '../states/pages';

interface IconProps extends React.Props<Icon> {
    page: Page;
    isCurrent: boolean;
}

export default class Icon extends React.Component<IconProps, {}> {
    constructor(props: IconProps) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        if (this.props.isCurrent) {
            console.log('TODO: Open Configuration for this icon');
        } else {
            console.log('TODO: Open URL with <webview>');
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
