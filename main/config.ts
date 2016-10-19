import {app} from 'electron';
import * as fs from 'fs';
import {join as joinPath} from 'path';
import log from './log';

const DEFAULT_CONFIG = {
    hot_key: 'CmdOrCtrl+Shift+S',
    icon_color: process.platform === 'darwin' ? 'black' : 'white',
    always_on_top: false,
} as Config;

export default function loadConfig(): Promise<Config> {
    return new Promise<Config>(resolve => {
        const dir = app.getPath('userData');
        const file = joinPath(dir, 'config.json');
        fs.readFile(file, 'utf8', (err, json) => {
            if (err) {
                log.info('Configuration file was not found, will create:', file);
                // XXX:
                // If calling writeFile() directly here, it tries to create config file before Electron
                // runtime creates data directory. As the result, writeFile() would fail to create a file.
                // The 2000 ms delay ensures to create a file after data directory is created and avoids
                // this problem.
                setTimeout(() => fs.writeFile(file, JSON.stringify(DEFAULT_CONFIG, null, 2)), 2000);
                return resolve(DEFAULT_CONFIG);
            }
            try {
                const config = JSON.parse(json);
                log.debug('Configuration was loaded successfully', config);
                resolve(config);
            } catch (e) {
                log.error('Error on loading JSON file, will load default configuration:', e.message);
                resolve(DEFAULT_CONFIG);
            }
        });
    });
}
