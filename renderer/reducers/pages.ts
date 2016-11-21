import Action from '../actions';
import {PagesState, DefaultPagesState} from '../states';

function setConfigured(state: PagesState, index: number, value: boolean) {
    return Object.assign({}, state, {
        index,
        all: state.all.update(
            index,
            p => Object.assign({}, p, {
                configured: value,
            }),
        ),
    });
}

export default function pages(state: PagesState = DefaultPagesState, action: Action) {
    switch (action.type) {
        case 'OpenPage': {
            const index =
                action.index < 0 ? 0 :
                state.all.size <= action.index ? state.all.size - 1 :
                action.index;
            return Object.assign({}, state, { index });
        }
        case 'CreatePage': {
            return Object.assign({}, state, {
                index: state.all.size,
                all: state.all.push({
                    url: '',
                    icon_image: '',
                    configured: false,
                    title: '',
                    reload_on_show: false,
                    reload_min_interval: null,
                }),
            });
        }
        case 'ConfigurePage': {
            return Object.assign({}, state, {
                index: action.index,
                all: state.all.set(action.index, {
                    url: action.url,
                    icon_image: action.image_url,
                    configured: true,
                    title: action.title,
                    reload_on_show: action.reload_on_show,
                    reload_min_interval: action.reload_min_interval,
                }),
            });
        }
        case 'SetConfigured': {
            return setConfigured(state, action.index, action.value);
        }
        case 'SetCurrentPageConfigured': {
            if (state.index === null) {
                return state;
            }
            return setConfigured(state, state.index, action.value);
        }
        case 'DeletePage': {
            let index = state.index;
            if (action.index === index) {
                index -= 1;
                if (index < 0) {
                    index = null;
                }
            }
            return Object.assign({}, state, {
                index,
                all: state.all.delete(action.index),
            });
        }
        default:
            return state;
    }
}
