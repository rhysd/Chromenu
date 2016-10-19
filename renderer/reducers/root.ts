import {combineReducers} from 'redux';
import pages from './pages';
import webview from './webview';
import State from '../states';

const root = combineReducers<State>({
    pages,
    webview,
});
export default root;
