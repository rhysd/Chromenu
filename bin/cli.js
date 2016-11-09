#! /usr/bin/env node

const child_process = require('child_process');
const electron = require('electron');
const path = require('path');
const launchctl = require('./launchctl');

const args = [path.join(__dirname, '..')];

if (process.argv.indexOf('--help') !== -1) {
    process.stdout.write(
`$ chromenu [--no-detach|--setup-launchctl|--unsetup-launchctl|--help]

    ${require('../package.json').description}

`
    );
    process.exit(0);
}

if (process.argv.indexOf('--setup-launchctl') !== -1) {
    process.exit(launchctl.setup());
}

if (process.argv.indexOf('--unsetup-launchctl') !== -1) {
    process.exit(launchctl.unsetup());
}

if (process.env.NODE_ENV === 'development' || process.argv.indexOf('--no-detach') !== -1) {
    child_process.spawn(electron, args, {
        stdio: 'inherit'
    });
} else {
    child_process.spawn(electron, args, {
        stdio: 'ignore',
        detached: true
    }).unref();
}
