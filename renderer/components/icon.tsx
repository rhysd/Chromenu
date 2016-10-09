import * as React from 'react';
import {Page} from '../states/pages';

interface IconProps extends React.Props<Icon> {
    page: Page;
}

export default class Icon extends React.Component<IconProps, {}> {
    constructor(props: IconProps) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        console.log('TODO: Open URL with <webview>');
    }

    render() {
        return (
            <div className="page-icon" onClick={this.onClick}>
                <img src={this.props.page.icon_image} alt={this.props.page.url}/>
            </div>
        );
    }
}
