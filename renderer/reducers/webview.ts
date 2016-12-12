import Action from '../actions';
import {WebViewState, DefaultWebViewState} from '../states';

export default function webview(state: WebViewState = DefaultWebViewState, action: Action) {
    switch (action.type) {
        case 'UpdateLoadingProgress': {
            return {
                ...state,
                progress: action.value,
                loading: action.value < 100,
            };
        }
        case 'LoadingComplete': {
            return {
                progress: 100,
                loading: false,
                element: action.webview,
                search: action.search,
                timestamp: Date.now(),
            };
        }
        default:
            return state;
    }
}
