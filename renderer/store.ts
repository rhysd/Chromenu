import {createStore} from 'redux';
import root from './reducers/root';
import Action from './actions';

export type Dispatch = (action: Action) => void;

export default createStore(root);
