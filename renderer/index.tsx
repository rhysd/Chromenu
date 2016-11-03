import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {ipcRenderer as ipc, shell} from 'electron';
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

function executeJS(source: string) {
    return () => {
        const elem = Store.getState().webview.element;
        if (!elem) {
            return;
        }
        elem.executeJavaScript(source);
    };
}

ipc.once('chromenu:config', (_: any, config: Config) => {
    log.debug('Config was sent from main:', config);
    const keymaps = new Keymaps(config.keymaps);
    for (let i = 0; i < 9; i++) {
        keymaps.on(`page${i + 1}`, () => Store.dispatch({type: 'OpenPage', index: i}));
    }
    keymaps.on('reload', () => {
        const elem = Store.getState().webview.element;
        if (elem) {
            elem.reload();
        }
    });
    keymaps.on('back', () => {
        const elem = Store.getState().webview.element;
        if (elem) {
            elem.goBack();
        }
    });
    keymaps.on('forward', () => {
        const elem = Store.getState().webview.element;
        if (elem) {
            elem.goForward();
        }
    });
    keymaps.on('home', () => {
        const state = Store.getState();
        const elem = state.webview.element;
        const current = state.pages.all.get(state.pages.index);
        if (!current || !current.url || !elem) {
            return;
        }
        elem.src = current.url;
    });
    keymaps.on('open-external-browser', () => {
        const elem = Store.getState().webview.element;
        if (!elem) {
            return;
        }
        shell.openExternal(elem.src);
    });
    keymaps.on('next-page', () => {
        const index = Store.getState().pages.index;
        if (index === null) {
            return;
        }
        Store.dispatch({type: 'OpenPage', index: index + 1});
    });
    keymaps.on('previous-page', () => {
        const index = Store.getState().pages.index;
        if (index === null) {
            return;
        }
        Store.dispatch({type: 'OpenPage', index: index - 1});
    });
    keymaps.on('scroll-down', executeJS('window.scrollBy(0, window.innerHeight / 5)'));
    keymaps.on('scroll-up', executeJS('window.scrollBy(0, -window.innerHeight / 5)'));
    keymaps.on('scroll-left', executeJS('window.scrollBy(-window.innerWidth / 3, 0)'));
    keymaps.on('scroll-right', executeJS('window.scrollBy(window.innerWidth / 3, 0)'));
    keymaps.on('scroll-down-half-page', executeJS('window.scrollBy(0, window.innerHeight / 2)'));
    keymaps.on('scroll-up-half-page', executeJS('window.scrollBy(0, -window.innerHeight / 2)'));
    keymaps.on('scroll-down-page', executeJS('window.scrollBy(0, window.innerHeight)'));
    keymaps.on('scroll-up-page', executeJS('window.scrollBy(0, -window.innerHeight)'));
    keymaps.on('scroll-bottom', executeJS('window.scrollTo(0, document.body.scrollHeight)'));
    keymaps.on('scroll-top', executeJS('window.scrollTo(0, 0)'));
});
