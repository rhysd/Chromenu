import {List} from 'immutable';

export interface Page {
    url: string;
    icon_image: string;
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
