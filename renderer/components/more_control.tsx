import * as React from 'react';
import shallowCompare = require('react-addons-shallow-compare');
import { shell, ipcRenderer as ipc, remote } from 'electron';
import { InPageSearch } from 'electron-in-page-search';
import log from '../log';

type ClickHandler = (e: React.MouseEvent<HTMLElement>) => void;

const HELP_PAGE_URL = 'https://github.com/rhysd/Chromenu#readme';

interface ItemProps {
    readonly onClick: ClickHandler;
    readonly text: string;
    readonly icon: string;
}

const Item = (props: ItemProps) => (
    <a className="panel-block is-active" href="#" onClick={props.onClick}>
        <span className="panel-icon">
            <i className={'fa fa-' + props.icon} />
        </span>
        {props.text}
    </a>
);

function openExternal(url: string) {
    if (!shell.openExternal(url)) {
        log.error('Failed to open:', url);
        return false;
    }
    ipc.send('chromenu:hide-window');
    return true;
}

// Note:
// We can't pass remote.app.quit to onClick prop directly because
// it calls remote.app.quit(event) and it causes illigal invocation
// error.
function handleClickQuit() {
    remote.app.quit();
}

interface MoreControlProps extends React.Props<MoreControl> {
    opened: boolean;
    element: Electron.WebviewTag | null;
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
        if (!openExternal(element.getURL())) {
            return;
        }
        this.props.onClick(e);
    };

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
    };

    showHelp: ClickHandler = e => {
        e.stopPropagation();
        if (!openExternal(HELP_PAGE_URL)) {
            return;
        }
        this.props.onClick(e);
    };

    openDevTools: ClickHandler = e => {
        e.stopPropagation();
        const elem = this.props.element;
        if (elem === null) {
            return;
        }
        elem.getWebContents().openDevTools({ mode: 'detach' });
        this.props.onClick(e);
    };

    shouldComponentUpdate(next_props: MoreControlProps, next_state: {}): boolean {
        if (!this.props.opened && !next_props.opened) {
            // Note:
            // When 'opened' is false, whole this component is not shown.
            // So we can skip re-rendering this component in the case.
            return false;
        }
        return shallowCompare(this, next_props, next_state);
    }

    render() {
        const style = {
            display: this.props.opened ? undefined : 'none',
        };
        return (
            <div className="more-control" style={style}>
                <nav className="panel">
                    <Item text="Quit App" icon="times" onClick={handleClickQuit} />
                    <Item text="Open DevTools" icon="wrench " onClick={this.openDevTools} />
                    <Item text="Help" icon="question" onClick={this.showHelp} />
                    <Item text="Open In Browser" icon="external-link" onClick={this.openInBrowser} />
                    <Item text="Search" icon="search" onClick={this.toggleSearch} />
                </nav>
            </div>
        );
    }
}
