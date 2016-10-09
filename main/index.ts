import * as path from 'path';
import * as menubar from 'menubar';
import loadConfig from './config';
import log from './log';

process.on('unhandledRejection', (reason: string) => {
    log.error('FATAL: Unhandled rejection! Reason:', reason);
});

function setupMenuBar(_: Config) {
    return new Promise<Menubar.MenubarApp>(resolve => {
        const html = `file://${path.join(__dirname, '..', 'renderer', 'index.html')}`;
        const mb = menubar({
            index: html,
        });
        mb.once('ready', () => {
            log.debug('Menubar application was launched:', mb);
            resolve(mb);
        });
    });
}

loadConfig().then(setupMenuBar).then(() => {
    log.debug('Application launched!');
});
