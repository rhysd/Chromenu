import {List} from 'immutable';
import * as Storage from './storage';

export interface Page {
    url: string;
    icon_image: string;
    configured: boolean;
    title: string;
}

export interface PagesState {
    index: number;
    all: List<Page>;
}

const loaded = Storage.load();

export const DefaultPagesState: PagesState =
    loaded !== null ? loaded.pages : {
        index: null,
        all: List<Page>(),
    };

interface State {
    pages: PagesState;
}
export default State;
