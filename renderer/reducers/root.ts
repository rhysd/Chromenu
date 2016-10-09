import {combineReducers} from 'redux';
import pages from './pages';
import State from '../states/root';

const root = combineReducers<State>({
    pages,
});
export default root;
