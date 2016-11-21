import * as fs from 'fs';
import * as path from 'path';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {ipcRenderer as ipc, remote} from 'electron';
import Store from './store';
import App from './components/app';
import * as Storage from './storage';
import registerAllKeymaps from './keymaps';
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
    registerAllKeymaps(config.keymaps);
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

remote.getCurrentWindow().on('focus', () => {
    log.debug('Window focused');
    const state = Store.getState();
    if (state.pages.index === null) {
        return;
    }
    const current = state.pages.all.get(state.pages.index);
    const elem = state.webview.element;
    if (!current || !current.url || !current.reload_on_show || !elem) {
        return;
    }
    if (typeof current.reload_min_interval !== 'number' ||
        typeof state.webview.timestamp !== 'number') {
        log.debug('Reload page due to window focus without interval check', current);
        elem.reload();
    }
    const spent_ms = Date.now() - state.webview.timestamp;
    if (current.reload_min_interval < spent_ms / 1000) {
        log.debug('Reload page due to window focus with interval check', current, 'spent time (ms): ', spent_ms);
        elem.reload();
    } else {
        log.debug('Reload page was not reloaded on window focus because interval is shorter than threthold', spent_ms, current.reload_min_interval);
    }
});
