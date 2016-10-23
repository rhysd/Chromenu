import Action from '../actions';
import {WebViewState, DefaultWebViewState} from '../states';

export default function webview(state: WebViewState = DefaultWebViewState, action: Action) {
    switch (action.type) {
        case 'UpdateLoadingProgress': {
            return {
                progress: action.value,
                loading: action.value < 100,
                element: state.element,
            };
        }
        case 'LoadingComplete': {
            return {
                progress: 100,
                loading: false,
                element: action.webview,
            };
        }
        case 'WebViewUnmounted': {
            return Object.assign({}, state, {
                element: null,
            });
        }
        default:
            return state;
    }
}
