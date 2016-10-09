import loadConfig from './config';
import log from './log';

process.on('unhandledRejection', (reason: string) => {
    log.error('FATAL: Unhandled rejection! Reason:', reason);
});

loadConfig().then(config => {
    // TODO
    console.log(config);
});
