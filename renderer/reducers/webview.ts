import Action from '../actions';
import {WebViewState, DefaultWebViewState} from '../states';
import searchInPage from 'electron-in-page-search';

export default function webview(state: WebViewState = DefaultWebViewState, action: Action) {
    switch (action.type) {
        case 'UpdateLoadingProgress': {
            return Object.assign({}, state, {
                progress: action.value,
                loading: action.value < 100,
            });
        }
        case 'LoadingComplete': {
            return {
                progress: 100,
                loading: false,
                element: action.webview,
                search: searchInPage(action.webview),
                timestamp: Date.now(),
            };
        }
        case 'WebViewUnmounted': {
            if (state.search !== null && state.search.opened) {
                state.search.closeSearchWindow();
            }
            return Object.assign({}, state, {
                element: null,
                search: null,
            });
        }
        case 'OpenUrl': {
            if (state.element !== null) {
                state.element.src = action.url;
            }
            return state;
        }
        default:
            return state;
    }
}
