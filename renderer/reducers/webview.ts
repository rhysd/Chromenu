import Action from '../actions';
import {WebViewState, DefaultWebViewState} from '../states';
import searchInPage from 'electron-in-page-search';

export default function webview(state: WebViewState = DefaultWebViewState, action: Action) {
    switch (action.type) {
        case 'UpdateLoadingProgress': {
            return {
                progress: action.value,
                loading: action.value < 100,
                element: state.element,
                search: state.search,
            };
        }
        case 'LoadingComplete': {
            return {
                progress: 100,
                loading: false,
                element: action.webview,
                search: searchInPage(action.webview),
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
        default:
            return state;
    }
}
