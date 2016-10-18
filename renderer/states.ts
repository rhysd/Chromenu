import {List} from 'immutable';

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

export const DefaultPagesState: PagesState = {
    index: null,
    all: List<Page>(),
};

interface State {
    pages: PagesState;
}
export default State;
