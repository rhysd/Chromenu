#! /usr/bin/env node

const child_process = require('child_process');
const electron = require('electron');
const path = require('path');
const args = [path.join(__dirname, '..')];

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
