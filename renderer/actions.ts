import {InPageSearch} from 'electron-in-page-search';

type ActionType = {
    readonly type: 'CreatePage';
} | {
    readonly type: 'ConfigurePage';
    readonly index: number;
    readonly url: string;
    readonly image_url: string;
    readonly title: string;
    readonly reload_on_show: boolean;
    readonly reload_min_interval: number | null;
} | {
    readonly type: 'SetConfigured';
    readonly index: number;
    readonly value: boolean;
} | {
    readonly type: 'DeletePage';
    readonly index: number;
} | {
    readonly type: 'UpdateLoadingProgress';
    readonly value: number;
} | {
    readonly type: 'OpenPage';
    readonly index: number;
} | {
    readonly type: 'LoadingComplete';
    readonly webview: Electron.WebviewTag;
    readonly search: InPageSearch;
};

export default ActionType;
