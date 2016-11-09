import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import {execSync} from 'child_process';

const PlistPath = path.join(os.homedir(), 'io.github.rhysd.chromenu.plist');
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
    <key>StandardOutPath</key>
    <string>${StdoutPath}</string>
    <key>StandardErrorPath</key>
    <string>${StderrPath}</string>
  </dict>
</plist>
`
    ;

    fs.writeFileSync(PlistPath, plist, 'utf8');
    console.log(`Generated: '${PlistPath}'. If you didn't install Chromenu via npm, please remove it manually when you uninstall Chromenu.`);
}

function launchctl(subcmd: 'load' | 'unload') {
    const cmd = ['launchctl', subcmd, '-w', `"${PlistPath}"`].join(' ');
    console.log(`> ${cmd}`);
    execSync(cmd);
}

