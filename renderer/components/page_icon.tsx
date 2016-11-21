import * as React from 'react';
import {Page} from '../states';
import log from '../log';
import {Dispatch} from '../store';

interface IconProps extends React.Props<PageIcon> {
    page: Page;
    isCurrent: boolean;
    index: number;
    dispatch: Dispatch;
}

function renderIconContents(p: Page) {
    if (!p.icon_image) {
        return <div className="page-icon__char">{p.title.charAt(0)}</div>;
    }
    return <img src={p.icon_image} alt={p.url}/>;
}

function renderIndicator(enabled: boolean) {
    if (!enabled) {
        return undefined;
    }
    return <div className="page-icon__indicator"/>;
}

export default class PageIcon extends React.PureComponent<IconProps, {}> {
    constructor(props: IconProps) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        const {isCurrent, dispatch, page, index} = this.props;
        if (isCurrent) {
            log.debug('Reset page:', page);
            dispatch({
                type: 'OpenUrl',
                url: page.url,
            });
        } else {
            log.debug('Open page:', page);
            dispatch({
                type: 'OpenPage',
                index,
            });
        }
    }

    render() {
        const {page, isCurrent} = this.props;
        return (
            <div className="page-icon" title={page.title || page.url} onClick={this.onClick}>
                {renderIconContents(page)}
                {renderIndicator(isCurrent)}
            </div>
        );
    }
}
