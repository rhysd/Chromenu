import * as React from 'react';

const DEFAULT_USERAGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A452 Safari/601.1';

interface WebViewProps extends React.Props<any> {
    src: string;
    useragent?: string;
}

const WebView = (props: WebViewProps) => (
    <div className="webview-container">
        <webview
            src={props.src}
            useragent={props.useragent || DEFAULT_USERAGENT}
            partition="persistent:browbar"
            autosize="on"
            className="webview-container__webview"
        ></webview>
    </div>
);
export default WebView;
