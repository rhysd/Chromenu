import * as request from 'request';
import * as cheerio from 'cheerio';
import * as pageIcon from 'page-icon';
import log from './log';

export function findTitle(url: string): Promise<string> {
    const options = {
        url,
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36',
        },
    };

    log.debug('Trying to fetch title of page:', options);

    return new Promise<string>((resolve, reject) => {
        request(options, (err, res, body) => {
            if (err || !res || res.statusCode !== 200) {
                log.debug('Failed to fetch title of page:', err, res);
                return reject(err);
            }

            const $ = cheerio.load(body);
            const title = $('title')
                .first()
                .text()
                .replace(/\//g, '');
            log.debug('Fetching title of page: Success:', title);
            resolve(title);
        });
    });
}

export function findIconUrl(url: string): Promise<string | null> {
    return pageIcon(url)
        .then(icon => {
            if (!icon) {
                log.debug('Icon was not found for:', url);
                return null;
            }
            log.debug('Icon was found:', icon);
            return icon.source;
        })
        .catch(e => {
            log.debug('Error on fetching icon!:', e);
            return null;
        });
}
