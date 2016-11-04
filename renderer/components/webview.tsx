import * as React from 'react';
import {Dispatch} from '../store';

const DEFAULT_USERAGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A452 Safari/601.1';

interface WebViewProps extends React.Props<WebView> {
    src: string;
    useragent?: string;
    dispatch: Dispatch;
}

export default class WebView extends React.PureComponent<WebViewProps, {}> {
    container: HTMLDivElement;
    webview: Electron.WebViewElement;

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
        const wv = document.createElement('webview');
        wv.src = this.props.src;
        wv.className = 'webview-container__webview';
        wv.setAttribute('useragent', this.props.useragent || DEFAULT_USERAGENT);
        wv.setAttribute('partition', 'persistent:chromenu');
        wv.setAttribute('autosize', 'on');

        wv.addEventListener('did-start-loading', () => this.dispatchProgress(10));
        wv.addEventListener('did-navigate', () => this.dispatchProgress(20));
        wv.addEventListener('dom-ready', () => this.dispatchProgress(70));
        wv.addEventListener('did-navigate-in-page', () => this.dispatchProgress(95));
        // After 'did-navigate-in-page', actually below two events happen but they almost at
        // the same timing as 'did-stop-loading' event.  So I'll skip them.
        //
        //     'did-frame-finish-load'
        //     'did-finish-load'
        //
        wv.addEventListener('did-stop-loading', () => this.props.dispatch({type: 'LoadingComplete', webview: wv}));

        this.webview = wv;
        this.container.appendChild(wv);
    }

    componentWillUnmount() {
        this.props.dispatch({type: 'WebViewUnmounted'});
    }

    componentDidUpdate(prev: WebViewProps) {
        if (this.props.src !== prev.src) {
            this.webview.src = this.props.src;
        }
        // TODO?: Check props.useragent also?
    }

    render() {
        return <div className="webview-container" ref={this.onContainerRef}/>;
    }
}

