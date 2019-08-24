import * as React from 'react';
import { InPageSearch } from 'electron-in-page-search';
import ControlButton from './control_button';
import MoreControl from './more_control';
import { Dispatch } from '../store';

function cancel(e: React.DragEvent<any>) {
    e.preventDefault();
}

interface FooterProps extends React.Props<Footer> {
    readonly dispatch: Dispatch;
    readonly loading: boolean;
    readonly pageUrl: string | null;
    readonly element: Electron.WebviewTag | null;
    readonly search: InPageSearch | null;
}

interface FooterState {
    more: boolean;
}

export default class Footer extends React.PureComponent<FooterProps, FooterState> {
    constructor(props: FooterProps) {
        super(props);
        this.goBack = this.goBack.bind(this);
        this.goForward = this.goForward.bind(this);
        this.stopLoading = this.stopLoading.bind(this);
        this.reloadPage = this.reloadPage.bind(this);
        this.toggleMoreItems = this.toggleMoreItems.bind(this);
        this.resetPage = this.resetPage.bind(this);
        this.state = {
            more: false,
        };
    }

    render() {
        const { loading, pageUrl, search } = this.props;
        const webview = this.getMountedWebview();
        const reload_icon = loading ? 'close' : 'reload';
        const reload_handler = loading ? this.stopLoading : this.reloadPage;
        const reload_tip = loading ? 'Stop' : 'Reload';
        const page_open = pageUrl !== null;
        const more_open = this.state.more && webview !== null && search !== null;
        return (
            <div className="controls-footer" onDrop={cancel} onDragEnter={cancel} onDragOver={cancel}>
                <ControlButton
                    icon="arrow-left"
                    onClick={this.goBack}
                    enabled={webview !== null && webview.canGoBack()}
                    tip="Back"
                />
                <ControlButton
                    icon="arrow-right"
                    onClick={this.goForward}
                    enabled={webview !== null && webview.canGoForward()}
                    tip="Forward"
                />
                <ControlButton icon="home" onClick={this.resetPage} enabled={page_open} tip="Home" />
                <ControlButton icon={reload_icon} onClick={reload_handler} enabled={page_open} tip={reload_tip} />
                <ControlButton
                    icon="ellipsis-vertical"
                    onClick={this.toggleMoreItems}
                    enabled={page_open}
                    tip="More..."
                />
                <MoreControl opened={more_open} element={webview} search={search} onClick={this.toggleMoreItems} />
            </div>
        );
    }

    private getMountedWebview() {
        // webview tag must be mounted into the Dom, even if the webview component is not null!
        // check if at least one webview is mounted:
        if (document.getElementsByTagName("webview").length >= 1) {
            // returns the mounted webview component or null:
            return this.props.element;
        } else {
            // if the webview is not mounted, then return null
            return null;
        }
    }

    private goBack(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        if (this.props.element === null) {
            return;
        }
        this.props.element.goBack();
        this.hideMoreItems();
    }

    private goForward(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        if (this.props.element === null) {
            return;
        }
        this.props.element.goForward();
        this.hideMoreItems();
    }

    private resetPage(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        if (this.props.element === null || this.props.pageUrl === null) {
            return;
        }
        this.props.element.src = this.props.pageUrl;
        this.hideMoreItems();
    }

    private stopLoading(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        const element = this.props.element;
        if (element) {
            element.stop();
        }
        this.hideMoreItems();
    }

    private reloadPage(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        const element = this.props.element;
        if (element) {
            element.reload();
        }
        this.hideMoreItems();
    }

    private toggleMoreItems(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        this.setState({
            more: !this.state.more,
        });
    }

    private hideMoreItems() {
        if (!this.state.more) {
            return;
        }
        this.setState({ more: false });
    }
}
