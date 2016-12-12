import {List} from 'immutable';
import * as Storage from './storage';
import {InPageSearch} from 'electron-in-page-search';

export interface Page {
    readonly url: string;
    readonly icon_image: string;
    readonly configured: boolean;
    readonly title: string;
    readonly reload_on_show: boolean;
    readonly reload_min_interval: number | null;
}

export interface PagesState {
    readonly index: number | null;
    readonly all: List<Page>;
}

const loaded = Storage.load();

export const DefaultPagesState: PagesState =
    loaded !== null ? loaded.pages : {
        index: null,
        all: List<Page>(),
    };

export interface WebViewState {
    readonly progress: number;
    readonly loading: boolean;
    readonly element: Electron.WebViewElement | null;
    readonly search: InPageSearch | null;
    readonly timestamp: number | null;
}

export const DefaultWebViewState: WebViewState = {
    progress: 0,
    loading: false,
    element: null,
    search: null,
    timestamp: null,
};

interface State {
    readonly pages: PagesState;
    readonly webview: WebViewState;
}
export default State;
