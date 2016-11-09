import * as path from 'path';
import * as fs from 'fs';
import {execSync} from 'child_process';

const PlistPath = path.join(__dirname, 'chromenu-launchctl.plist');
const CliPath = path.join(__dirname, 'cli.js');
const StdoutPath = path.join(__dirname, 'stdout.log');
const StderrPath = path.join(__dirname, 'stderr.log');

export function setup() {
    if (process.platform !== 'darwin') {
        console.error('launchctl is only available for macOS. Please manually setup auto-launch on Windows or Linux');
        return 201;
    }

    preparePlistFile();

    launchctl('load');
    return 0;
}

export function unsetup() {
    if (process.platform !== 'darwin' || !fs.existsSync(PlistPath)) {
        return 0;
    }

    launchctl('unload');
    return 0;
}

function preparePlistFile() {
    if (fs.existsSync(PlistPath)) {
        return;
    }

    const username = execSync('id -un').toString().trim();
    if (username === '') {
        throw new Error('`id -un` failed: Result was empty');
    }

    const plist =
`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>io.github.rhysd.chromenu</string>
    <key>Disabled</key>
    <false/>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <false/>
    <key>LaunchOnlyOnce</key>
    <true/>
    <key>ProgramArguments</key>
    <array>
      <string>${process.argv[0]}</string>
      <string>${CliPath}</string>
    </array>
    <key>UserName</key>
    <string>${username}</string>
    <key>StandardOutPath</key>
    <string>${StdoutPath}</string>
    <key>StandardErrorPath</key>
    <string>${StderrPath}</string>
  </dict>
</plist>
`
    ;
    fs.writeFileSync(PlistPath, plist, 'utf8');
    console.log(`Generated: ${PlistPath}`);
}

function launchctl(subcmd: 'load' | 'unload') {
    const cmd = ['launchctl', subcmd, '-w', `"${PlistPath}"`].join(' ');
    console.log(`> ${cmd}`);
    execSync(cmd);
}

