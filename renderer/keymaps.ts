import {EventEmitter} from 'events';
import * as Mousetrap from 'mousetrap';
import {shell} from 'electron';
import Store from './store';
import log from './log';

function executeJS(source: string) {
    return () => {
        const elem = Store.getState().webview.element;
        if (!elem) {
            return;
        }
        elem.executeJavaScript(source);
    };
}

export default class Keymaps extends EventEmitter {
    constructor(public config: {[key: string]: KeymapAction}) {
        super();
        for (const key in config) {
            Mousetrap.bind(key, e => {
                e.preventDefault();
                log.debug('Key pressed:', key, e);
                log.debug('Will emit keymap action:', this.config[key]);
                this.emit(this.config[key]);
            });
        }
        this.registerAllKeymaps();
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
        this.on('scroll-down', executeJS('window.scrollBy(0, window.innerHeight / 5)'));
        this.on('scroll-up', executeJS('window.scrollBy(0, -window.innerHeight / 5)'));
        this.on('scroll-left', executeJS('window.scrollBy(-window.innerWidth / 3, 0)'));
        this.on('scroll-right', executeJS('window.scrollBy(window.innerWidth / 3, 0)'));
        this.on('scroll-down-half-page', executeJS('window.scrollBy(0, window.innerHeight / 2)'));
        this.on('scroll-up-half-page', executeJS('window.scrollBy(0, -window.innerHeight / 2)'));
        this.on('scroll-down-page', executeJS('window.scrollBy(0, window.innerHeight)'));
        this.on('scroll-up-page', executeJS('window.scrollBy(0, -window.innerHeight)'));
        this.on('scroll-bottom', executeJS('window.scrollTo(0, document.body.scrollHeight)'));
        this.on('scroll-top', executeJS('window.scrollTo(0, 0)'));
        this.on('open-devtools', () => {
            const elem = Store.getState().webview.element;
            if (elem) {
                elem.getWebContents().openDevTools({mode: 'detach'});
            }
        });
    }
}
