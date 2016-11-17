import * as React from 'react';
import {shell, ipcRenderer as ipc} from 'electron';
import {InPageSearch} from 'electron-in-page-search';
import log from '../log';

type ClickHandler = (e: React.MouseEvent<HTMLElement>) => void;

interface ItemProps {
    onClick: ClickHandler;
    text: string;
    icon: string;
}

const Item = (props: ItemProps) => (
    <a className="panel-block is-active" href="#" onClick={props.onClick}>
        <span className="panel-icon">
            <i className={'fa fa-' + props.icon}/>
        </span>
        {props.text}
    </a>
);

interface MoreControlProps extends React.Props<MoreControl> {
    opened: boolean;
    element: Electron.WebViewElement | null;
    search: InPageSearch | null;
    onClick: ClickHandler;
}

export default class MoreControl extends React.PureComponent<MoreControlProps, {}> {
    openInBrowser: ClickHandler = e => {
        e.stopPropagation();
        const element = this.props.element;
        if (element === null) {
            return;
        }
        const url = element.getURL();
        if (!shell.openExternal(url)) {
            log.error('Failed to open:', url);
            return;
        }
        this.props.onClick(e);
        ipc.send('chromenu:hide-window');
    }

    toggleSearch: ClickHandler = e => {
        e.stopPropagation();
        const s = this.props.search;
        if (s === null) {
            return;
        }
        if (s.opened) {
            s.closeSearchWindow();
        } else {
            s.openSearchWindow();
        }
        this.props.onClick(e);
    }

    render() {
        const style = {
            display: this.props.opened ? undefined : 'none',
        };
        return (
            <div className="more-control" style={style}>
                <nav className="panel">
                    <Item text="Open In Browser" icon="external-link" onClick={this.openInBrowser}/>
                    <Item text="Search" icon="search" onClick={this.toggleSearch}/>
                </nav>
            </div>
        );
    }
}
