#! /usr/bin/env node

const child_process = require('child_process');
const electron = require('electron');
const path = require('path');
const setupLaunchctl = require('./setup-launchctl').default;

const args = [path.join(__dirname, '..')];

if (process.argv.indexOf('--help') !== -1) {
    process.stdout.write(
`$ chromenu [--help|--setup-launchctl]

    ${require('../package.json').description}

`
    );
    process.exit(0);
}

if (process.argv.indexOf('--setup-launchctl') !== -1) {
    process.exit(setupLaunchctl());
}

if (process.env.NODE_ENV === 'development') {
    child_process.spawn(electron, args, {
        stdio: 'inherit'
    });
} else {
    child_process.spawn(electron, args, {
        stdio: 'ignore',
        detached: true
    }).unref();
}
