import * as path from 'path';
import * as menubar from 'menubar';
import {globalShortcut} from 'electron';
import loadConfig from './config';
import log from './log';

process.on('unhandledRejection', (reason: string) => {
    log.error('FATAL: Unhandled rejection! Reason:', reason);
});

function setupMenuBar(config: Config) {
    return new Promise<Menubar.MenubarApp>(resolve => {
        const html = `file://${path.join(__dirname, '..', 'renderer', 'index.html')}`;
        const mb = menubar({
            index: html,
        });
        mb.once('ready', () => {
            log.debug('Menubar application was launched:', mb);
            if (config.hot_key) {
                globalShortcut.register(config.hot_key, () => {
                    if (mb.window.isFocused()) {
                        mb.hideWindow();
                    } else {
                        mb.showWindow();
                    }
                });
            }
            resolve(mb);
        });
    });
}

loadConfig().then(setupMenuBar).then(() => {
    log.debug('Application launched!');
});
