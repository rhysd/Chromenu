import {List} from 'immutable';

// TODO: Add title of the page
export interface Page {
    url: string;
    icon_image: string;
    configured: boolean;
    title: string;
}

interface PagesState {
    index: number;
    all: List<Page>;
}
export default PagesState;

export const DefaultPagesState: PagesState = {
    index: null,
    all: List<Page>(),
};
