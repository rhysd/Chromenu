import {createStore} from 'redux';
import root from './reducers/root';
import State from './states/root';

export type Dispatch = Redux.Dispatch<State>;

export default createStore(root);
