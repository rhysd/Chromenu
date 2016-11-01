#! /usr/bin/env node

const child_process = require('child_process');
const electron = require('electron');
const path = require('path');
const args = [path.join(__dirname, '..')];

child_process.spawn(electron, args, {
    stdio: 'ignore',
    detached: true
}).unref();
