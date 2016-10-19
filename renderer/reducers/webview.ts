import Action from '../actions';
import {WebViewState, DefaultWebViewState} from '../states';

export default function webview(state: WebViewState = DefaultWebViewState, action: Action) {
    switch (action.type) {
        case 'UpdateLoadingProgress': {
            return {
                progress: action.value,
                loading: action.value < 100,
            };
        }
        default:
            return state;
    }
}
