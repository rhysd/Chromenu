import * as React from 'react';
import {Dispatch} from '../store';

const DEFAULT_USERAGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A452 Safari/601.1';

interface WebViewProps extends React.Props<any> {
    src: string;
    useragent?: string;
    dispatch: Dispatch;
}

export default class WebView extends React.PureComponent<WebViewProps, {}> {
    refs: {
        body: Electron.WebViewElement;
    };

    dispatchProgress(value: number) {
        this.props.dispatch({
            type: 'UpdateLoadingProgress',
            value,
        });
    }

    componentDidMount() {
        this.refs.body.addEventListener('did-start-loading', () => this.dispatchProgress(10));
        this.refs.body.addEventListener('did-navigate', () => this.dispatchProgress(20));
        this.refs.body.addEventListener('dom-ready', () => this.dispatchProgress(70));
        this.refs.body.addEventListener('did-navigate-in-page', () => this.dispatchProgress(95));
        // After 'did-navigate-in-page', actually below two events happen but they almost at
        // the same timing as 'did-stop-loading' event.  So I'll skip them.
        //
        //     'did-frame-finish-load'
        //     'did-finish-load'
        //
        this.refs.body.addEventListener('did-stop-loading', () => this.dispatchProgress(100));
    }

    render() {
        return (
            <div className="webview-container">
                <webview
                    src={this.props.src}
                    useragent={this.props.useragent || DEFAULT_USERAGENT}
                    partition="persistent:browbar"
                    autosize="on"
                    className="webview-container__webview"
                    ref="body"
                ></webview>
            </div>
        );
    }
}

