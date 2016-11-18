#! /usr/bin/env node

const child_process = require('child_process');
const path = require('path');
const launchctl = require('./launchctl');

const args = [path.join(__dirname, '..')];

if (process.argv.indexOf('--help') !== -1) {
    const pkg = require('../package.json');
    process.stdout.write(
`$ chromenu [--no-detach|--setup-launchctl|--unsetup-launchctl|--help]

    ${pkg.description} (version ${pkg.version})

Options:
    --no-detach
        Do not detach application process. By default, the application
        process will be detached. Note that when $NODE_ENV is 'development',
        the process won't also be detached.

    --setup-launchctl
        Setup to start this application at system booting. This option is
        only for macOS. If you use other platform, please setup manually.

    --unsetup-launchctl
        If you used --setup-launchctl and this option stops launching this
        application on system booting.

    --help
        Show this help.
`
    );
    process.exit(0);
}

if (process.argv.indexOf('--version') !== -1) {
    process.stdout.write(`${require('../package.json').version}\n`);
    process.exit(0);
}

if (process.argv.indexOf('--setup-launchctl') !== -1) {
    process.exit(launchctl.setup());
}

if (process.argv.indexOf('--unsetup-launchctl') !== -1) {
    process.exit(launchctl.unsetup());
}

// Note:
// Load electron module here to avoid "no module 'electron'" error on preuninstall
// hook when `npm uninstall -g chromenu`.
const electron = require('electron');

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
