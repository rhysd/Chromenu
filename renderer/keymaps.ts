import * as fs from 'fs';
import * as path from 'path';
import {EventEmitter} from 'events';
import * as Mousetrap from 'mousetrap';
import {shell, remote} from 'electron';
import Store from './store';
import log from './log';

const UserDataPath = remote.app.getPath('userData');

function executeJavaScriptCallback(source: string) {
    return () => {
        const elem = Store.getState().webview.element;
        if (!elem) {
            return;
        }
        elem.executeJavaScript(source);
    };
}

function evalFileInRemote(file: string) {
    if (!path.isAbsolute(file)) {
        file = path.join(UserDataPath, file);
    }
    fs.readFile(file, 'utf8', (err, source) => {
        if (err) {
            log.error('Error while loading JavaScript source from file ' + file, err);
            return;
        }
        const elem = Store.getState().webview.element;
        if (!elem) {
            return;
        }
        elem.executeJavaScript(source);
    });
}

export default class Keymaps extends EventEmitter {
    constructor(public config: {[key: string]: string}) {
        super();
        for (const key in config) {
            Mousetrap.bind(key, e => {
                e.preventDefault();
                log.debug('Key pressed:', key, e);
                log.debug('Will emit keymap action:', this.config[key]);
                const name = this.config[key];
                if (name.endsWith('.js')) {
                    evalFileInRemote(name);
                } else {
                    this.emit(name);
                }
            });
        }
    }

    registerAllKeymaps() {
        for (let i = 0; i < 9; i++) {
            this.on(`page${i + 1}`, () => Store.dispatch({type: 'OpenPage', index: i}));
        }
        this.on('reload', () => {
            const elem = Store.getState().webview.element;
            if (elem) {
                elem.reload();
            }
        });
        this.on('back', () => {
            const elem = Store.getState().webview.element;
            if (elem) {
                elem.goBack();
            }
        });
        this.on('forward', () => {
            const elem = Store.getState().webview.element;
            if (elem) {
                elem.goForward();
            }
        });
        this.on('home', () => {
            const state = Store.getState();
            const elem = state.webview.element;
            const current = state.pages.all.get(state.pages.index);
            if (current && current.url && elem) {
                elem.src = current.url;
            }
        });
        this.on('open-external-browser', () => {
            const elem = Store.getState().webview.element;
            if (elem) {
                shell.openExternal(elem.src);
            }
        });
        this.on('next-page', () => {
            const index = Store.getState().pages.index;
            if (index !== null) {
                Store.dispatch({type: 'OpenPage', index: index + 1});
            }
        });
        this.on('previous-page', () => {
            const index = Store.getState().pages.index;
            if (index !== null) {
                Store.dispatch({type: 'OpenPage', index: index - 1});
            }
        });
        this.on('scroll-down',           executeJavaScriptCallback('window.scrollBy(0, window.innerHeight / 5)'));
        this.on('scroll-up',             executeJavaScriptCallback('window.scrollBy(0, -window.innerHeight / 5)'));
        this.on('scroll-left',           executeJavaScriptCallback('window.scrollBy(-window.innerWidth / 3, 0)'));
        this.on('scroll-right',          executeJavaScriptCallback('window.scrollBy(window.innerWidth / 3, 0)'));
        this.on('scroll-down-half-page', executeJavaScriptCallback('window.scrollBy(0, window.innerHeight / 2)'));
        this.on('scroll-up-half-page',   executeJavaScriptCallback('window.scrollBy(0, -window.innerHeight / 2)'));
        this.on('scroll-down-page',      executeJavaScriptCallback('window.scrollBy(0, window.innerHeight)'));
        this.on('scroll-up-page',        executeJavaScriptCallback('window.scrollBy(0, -window.innerHeight)'));
        this.on('scroll-bottom',         executeJavaScriptCallback('window.scrollTo(0, document.body.scrollHeight)'));
        this.on('scroll-top',            executeJavaScriptCallback('window.scrollTo(0, 0)'));
        this.on('open-devtools', () => {
            const elem = Store.getState().webview.element;
            if (elem) {
                elem.getWebContents().openDevTools({mode: 'detach'});
            }
        });
    }
}
