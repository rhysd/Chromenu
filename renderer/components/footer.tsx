import * as React from 'react';
import {shell} from 'electron';
import {ArrowLeft, ArrowRight, Home, Reload, Close, External} from 'react-bytesize-icons';
import ControlButton from './control_button';
import {Dispatch} from '../store';
import log from '../log';

function cancel(e: React.DragEvent<any>) {
    e.preventDefault();
}

interface FooterProps extends React.Props<Footer> {
    dispatch: Dispatch;
    loading: boolean;
    pageUrl: string | null;
    element: Electron.WebViewElement | null;
}

export default class Footer extends React.PureComponent<FooterProps, {}> {
    constructor(props: FooterProps) {
        super(props);
        this.goBack = this.goBack.bind(this);
        this.goForward = this.goForward.bind(this);
        this.stopLoading = this.stopLoading.bind(this);
        this.reloadPage = this.reloadPage.bind(this);
        this.openInExternalBrowser = this.openInExternalBrowser.bind(this);
        this.resetPage = this.resetPage.bind(this);
    }

    goBack(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        if (this.props.element === null) {
            return;
        }
        this.props.element.goBack();
    }

    goForward(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        if (this.props.element === null) {
            return;
        }
        this.props.element.goForward();
    }

    resetPage(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        if (this.props.element === null || this.props.pageUrl === null) {
            return;
        }
        this.props.element.src = this.props.pageUrl;
    }

    stopLoading(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        const element = this.props.element;
        if (element) {
            element.stop();
        }
    }

    reloadPage(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        const element = this.props.element;
        if (element) {
            element.reload();
        }
    }

    openInExternalBrowser(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        const element = this.props.element;
        if (element) {
            const url = element.getURL();
            if (!shell.openExternal(url)) {
                log.error('Failed to open:', url);
            }
        }
    }

    render() {
        const {loading, pageUrl, element} = this.props;
        const reload_icon = loading ? Close : Reload;
        const reload_handler = loading ? this.stopLoading : this.reloadPage;
        const reload_tip = loading ? 'Stop' : 'Reload';
        const page_open = pageUrl !== null;
        return (
            <div className="controls-footer" onDrop={cancel} onDragEnter={cancel} onDragOver={cancel}>
                <ControlButton icon={ArrowLeft} onClick={this.goBack} enabled={element !== null && element.canGoBack()} tip="Back"/>
                <ControlButton icon={ArrowRight} onClick={this.goForward} enabled={element !== null && element.canGoForward()} tip="Forward"/>
                <ControlButton icon={Home} onClick={this.resetPage} enabled={page_open} tip="Home"/>
                <ControlButton icon={reload_icon} onClick={reload_handler} enabled={page_open} tip={reload_tip}/>
                <ControlButton icon={External} onClick={this.openInExternalBrowser} enabled={page_open} tip="External browser"/>
            </div>
        );
    }
}
