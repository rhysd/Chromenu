declare namespace JSX {
    interface WebViewProps {
        src?: string;
        autosize?: string;
        nodeintegration?: boolean;
        plugins?: string;
        preload?: string;
        httpreferrer?: string;
        useragent?: string;
        disablewebsecurity?: boolean;
        partition?: string;
        allowpopups?: boolean;
        blinkfeatures?: string;
        disableBlinkfeatures?: string;
        guestinstance?: string;
    }
    interface IntrinsicElements {
        webview: React.HTMLProps<WebViewProps> & WebViewProps;
    }
}
