type ActionType = {
    type: 'CreatePage';
} | {
    type: 'ConfigurePage';
    index: number;
    url: string;
    image_url: string;
    title: string;
} | {
    type: 'SetConfigured';
    index: number;
    value: boolean;
} | {
    type: 'DeletePage';
    index: number;
} | {
    type: 'UpdateLoadingProgress';
    value: number;
} | {
    type: 'OpenPage';
    index: number;
} | {
    type: 'LoadingComplete';
    webview: Electron.WebViewElement;
} | {
    type: 'WebViewUnmounted';
};

export default ActionType;
