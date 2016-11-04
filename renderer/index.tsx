import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {ipcRenderer as ipc} from 'electron';
import Store from './store';
import App from './components/app';
import * as Storage from './storage';
import Keymaps from './keymaps';
import log from './log';

if (process.env.NODE_ENV !== 'development') {
    process.env.NODE_ENV = 'production';
}

ReactDOM.render(
    <Provider store={Store}>
        <App/>
    </Provider>,
    document.getElementById('chromenu'),
);

window.onunload = () => {
    Storage.save();
};

ipc.once('chromenu:config', (_: any, config: Config) => {
    log.debug('Config was sent from main:', config);
    new Keymaps(config.keymaps);
});
