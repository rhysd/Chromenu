import * as React from 'react';
import searchInPage, {InPageSearch} from 'electron-in-page-search';
import {Dispatch} from '../store';
import log from '../log';

const DEFAULT_USERAGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A452 Safari/601.1';

interface WebViewProps extends React.Props<WebView> {
    readonly src: string;
    readonly useragent?: string;
    readonly search: InPageSearch | null;
    readonly element: Electron.WebViewElement | null;
    readonly dispatch: Dispatch;
}

export default class WebView extends React.PureComponent<WebViewProps, {}> {
    container: HTMLDivElement;
    webview: Electron.WebViewElement;
    search: InPageSearch;

    onContainerRef = (ref: HTMLDivElement) => {
        this.container = ref;
    }

    dispatchProgress(value: number) {
        this.props.dispatch({
            type: 'UpdateLoadingProgress',
            value,
        });
    }

    componentDidMount() {
        const {src, useragent, search, element, dispatch} = this.props;
        if (element !== null && search !== null) {
            this.container.appendChild(element);
            this.webview = element;
            this.search = search;

            if (element.src !== src) {
                // Note:
                // 'src' means the home URL of the page. It may be different from
                // a current page shown in <webview>.
                element.src = src;
            }

            return;
        }

        const wv = document.createElement('webview');
        wv.src = src;
        wv.className = 'webview-container__webview';
        wv.setAttribute('useragent', useragent || DEFAULT_USERAGENT);
        wv.setAttribute('partition', 'persist:chromenu');
        wv.setAttribute('autosize', 'on');

        wv.addEventListener('did-start-loading', () => this.dispatchProgress(10));
        wv.addEventListener('did-navigate', () => this.dispatchProgress(20));
        wv.addEventListener('dom-ready', () => this.dispatchProgress(80));
        wv.addEventListener('did-finish-load', () => this.dispatchProgress(90));
        wv.addEventListener('did-navigate-in-page', () => this.dispatchProgress(95));
        // After 'did-navigate-in-page', actually below two events happen but they almost at
        // the same timing as 'did-stop-loading' event.  So I'll skip them.
        //
        //     'did-frame-finish-load'
        //     'did-finish-load'
        //
        wv.addEventListener('did-stop-loading', () => dispatch({type: 'LoadingComplete', webview: wv, search: this.search}));
        // When target="_blank" specified, open the page in the same webview.
        wv.addEventListener('new-window', e => {
            e.preventDefault();
            wv.src = e.url;
        });
        wv.addEventListener('crashed', () => {
            log.error('Webview crashed! Reload <webview> to recover.');
        });

        this.webview = wv;
        this.container.appendChild(wv);
        this.search = searchInPage(wv);
    }

    componentWillUnmount() {
        this.container.removeChild(this.webview);
        this.search.closeSearchWindow();
    }

    componentDidUpdate(prev: WebViewProps) {
        if (this.props.src !== prev.src) {
            this.webview.src = this.props.src;
            this.webview.clearHistory();
        }
        // TODO?: Check props.useragent also?
    }

    render() {
        return <div className="webview-container" ref={this.onContainerRef}/>;
    }
}

