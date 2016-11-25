import {InPageSearch} from 'electron-in-page-search';

type ActionType = {
    type: 'CreatePage';
} | {
    type: 'ConfigurePage';
    index: number;
    url: string;
    image_url: string;
    title: string;
    reload_on_show: boolean;
    reload_min_interval: number | null;
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
    search: InPageSearch;
};

export default ActionType;
