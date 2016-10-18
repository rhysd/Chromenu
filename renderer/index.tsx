import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import Store from './store';
import App from './components/app';
import * as Storage from './storage';

// TODO:
// Read configurations from local storage

ReactDOM.render(
    <Provider store={Store}>
        <App/>
    </Provider>,
    document.getElementById('browbar'),
);

window.onunload = () => {
    Storage.save();
};
