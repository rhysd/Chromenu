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
        const icon = path.join(__dirname, '..', 'resources', `chrome-tray-icon-${config.icon_color}.png`);
        log.debug('Will launch application:', html, icon);
        const mb = menubar({
            index: html,
            icon,
            width: 414,  // iPhone 6s
            height: 100 + 736, // Icon area height + iPhone 6s
        });
        mb.once('ready', () => mb.showWindow());
        mb.once('after-create-window', () => {
            log.debug('Menubar application was launched');
            if (config.hot_key) {
                globalShortcut.register(config.hot_key, () => {
                    if (mb.window.isFocused()) {
                        log.debug('Toggle window: shown -> hidden');
                        mb.hideWindow();
                    } else {
                        log.debug('Toggle window: hidden -> shown');
                        mb.showWindow();
                    }
                });
                log.debug('Hot key was set to:', config.hot_key);
            }
            resolve(mb);
        });
    });
}

loadConfig().then(setupMenuBar).then(() => {
    log.debug('Application launched!');
});
