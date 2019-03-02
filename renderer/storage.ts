import { List } from 'immutable';
import Store from './store';
import State, { Page } from './states';

export function save() {
    const state = Store.getState();
    const json = {
        pages: {
            index: state.pages.index,
            all: state.pages.all.toArray(),
        },
    };
    window.localStorage.setItem('browber', JSON.stringify(json));
}

export function load(): State | null {
    const s = window.localStorage.getItem('browber');
    if (s === null) {
        return null;
    }

    const json = JSON.parse(s);
    return {
        pages: {
            index: json.pages.index,
            all: List<Page>(json.pages.all),
        },
    } as State;
}
