import {EventEmitter} from 'events';
import * as Mousetrap from 'mousetrap';
import log from './log';

export default class Keymaps extends EventEmitter {
    constructor(public config: {[key: string]: KeymapAction}) {
        super();
        for (const key in config) {
            Mousetrap.bind(key, e => {
                e.preventDefault();
                log.debug('Key pressed:', key, e);
                this.emit(this.config[key]);
            });
        }
    }
}
