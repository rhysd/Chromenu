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
                }),
            });
        }
        default:
            break;
    }
    return state;
}
