import * as fs from 'fs';
import * as path from 'path';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {ipcRenderer as ipc, remote} from 'electron';
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
    const keymaps = new Keymaps(config.keymaps);
    keymaps.registerAllKeymaps();
});

const UserCss = path.join(remote.app.getPath('userData'), 'user.css');

fs.stat(UserCss, (err, stats) => {
    if (err) {
        // No user.css found. Skipping.
        log.debug('No user.css found. Skipping.');
        return;
    }

    if (!stats.isFile()) {
        log.error('Invalid user.css. It is not a file!');
        return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = UserCss;
    document.head.appendChild(link);
});
