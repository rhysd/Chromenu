import Action from '../actions/type';
import PagesState, {DefaultPagesState} from '../states/pages';

export default function pages(state: PagesState = DefaultPagesState, action: Action) {
    switch (action.type) {
        case 'CreatePage': {
            return Object.assign({}, state, {
                index: state.all.size,
                all: state.all.push({
                    url: '',
                    icon_image: '',
                    configured: false,
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
                }),
            });
        }
        default:
            return state;
    }
}
