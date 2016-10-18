import {combineReducers} from 'redux';
import pages from './pages';
import State from '../states';

const root = combineReducers<State>({
    pages,
});
export default root;
