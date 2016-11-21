import * as fs from 'fs';
import * as path from 'path';
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

function executeJavaScriptCallbackCaringAboutInput(source: string) {
    return () => {
        const elem = Store.getState().webview.element;
        if (!elem) {
            return false;
        }
        const code = `
        (function(){
            const active = document.activeElement;
            if (active && active.tagName === 'INPUT') {
                return true;
            }
            ${source};
            return false;
        })();
        `;
        return new Promise<boolean>(resolve => {
            elem.executeJavaScript(code, false, (ret: boolean) => {
                resolve(ret);
            });
        });
    };
}

function evalFileInRemote(file: string) {
    if (!path.isAbsolute(file)) {
        file = path.join(UserDataPath, file);
    }
    return new Promise<boolean>((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, source) => {
            if (err) {
                log.error('Error while loading JavaScript source from file ' + file, err);
                reject(err);
                return;
            }
            const elem = Store.getState().webview.element;
            if (!elem) {
                reject(new Error('<webview> element not mounted'));
                return;
            }
            elem.executeJavaScript(source, false, result => {
                resolve(!!result);
            });
        });
    });
}

const ActionMap = {
    reload: () => {
        const elem = Store.getState().webview.element;
        if (elem) {
            elem.reload();
        }
    },

    back: () => {
        const elem = Store.getState().webview.element;
        if (elem) {
            elem.goBack();
        }
    },

    forward: () => {
        const elem = Store.getState().webview.element;
        if (elem) {
            elem.goForward();
        }
    },

    home: () => {
        const state = Store.getState();
        if (state.pages.index === null) {
            return;
        }
        const elem = state.webview.element;
        const current = state.pages.all.get(state.pages.index);
        if (current && current.url && elem) {
            elem.src = current.url;
        }
    },

    'open-external-browser': () => {
        const elem = Store.getState().webview.element;
        if (elem) {
            shell.openExternal(elem.src);
        }
    },

    'next-page': () => {
        const index = Store.getState().pages.index;
        if (index !== null) {
            Store.dispatch({type: 'OpenPage', index: index + 1});
        }
    },

    'previous-page': () => {
        const index = Store.getState().pages.index;
        if (index !== null) {
            Store.dispatch({type: 'OpenPage', index: index - 1});
        }
    },

    'toggle-search': () => {
        const s = Store.getState().webview.search;
        if (s === null) {
            return;
        }
        if (s.opened) {
            s.closeSearchWindow();
        } else {
            s.openSearchWindow();
        }
    },

    'scroll-down':           executeJavaScriptCallback('window.scrollBy(0] =  window.innerHeight / 5)'),
    'scroll-up':             executeJavaScriptCallback('window.scrollBy(0] =  -window.innerHeight / 5)'),
    'scroll-left':           executeJavaScriptCallback('window.scrollBy(-window.innerWidth / 3] =  0)'),
    'scroll-right':          executeJavaScriptCallback('window.scrollBy(window.innerWidth / 3] =  0)'),
    'scroll-down-half-page': executeJavaScriptCallback('window.scrollBy(0] =  window.innerHeight / 2)'),
    'scroll-up-half-page':   executeJavaScriptCallback('window.scrollBy(0] =  -window.innerHeight / 2)'),
    'scroll-down-page':      executeJavaScriptCallback('window.scrollBy(0] =  window.innerHeight)'),
    'scroll-up-page':        executeJavaScriptCallback('window.scrollBy(0] =  -window.innerHeight)'),
    'scroll-bottom':         executeJavaScriptCallback('window.scrollTo(0] =  document.body.scrollHeight)'),
    'scroll-top':            executeJavaScriptCallback('window.scrollTo(0] =  0)'),

    'open-devtools': () => {
        const elem = Store.getState().webview.element;
        if (elem) {
            elem.getWebContents().openDevTools({mode: 'detach'});
        }
    },

    'reset-app': () => {
        remote.getCurrentWindow().reload();
    },

    'scroll-down-input-safe': executeJavaScriptCallbackCaringAboutInput('window.scrollBy(0, window.innerHeight / 5)'),
    'scroll-up-input-safe': executeJavaScriptCallbackCaringAboutInput('window.scrollBy(0, -window.innerHeight / 5)'),

} as {[action_name: string]: () => boolean | void | Promise<boolean>};

for (let i = 0; i < 9; i++) {
    ActionMap[`page${i + 1}`] = () => {
        Store.dispatch({type: 'OpenPage', index: i});
    };
}

export default function registerAllKeymaps(config: {[key: string]: string | null}) {
    for (const key in config) {
        Mousetrap.bind(key, e => {
            const name = config[key];
            log.debug('Key pressed: ' + key, name);
            if (name === null) {
                return;
            }

            if (name.endsWith('.js')) {
                evalFileInRemote(name).then(ret => {
                    if (ret) {
                        e.preventDefault();
                    }
                }).catch(err => {
                    log.error(err.message);
                });
            } else if (ActionMap[name]) {
                const ret = ActionMap[name]();
                if (typeof ret === 'boolean') {
                    if (ret) {
                        e.preventDefault();
                    }
                    // Do nothing
                } else if (ret instanceof Promise) {
                    ret.then(b => {
                        if (b) {
                            e.preventDefault();
                        }
                    }).catch(err => {
                        log.error('Error on keyshortcut action ' + name, err);
                    });
                } else if (typeof ret !== 'undefined') {
                    log.error('Invalid return value from keyshortcut action callback:', ret);
                }
            } else {
                log.error('Ignored invalid action: ' + name);
            }
        });
    }
}
