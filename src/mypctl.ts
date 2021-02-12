#!/usr/bin/env node
import { execSync } from 'child_process'
import Mustache from 'mustache'
import yargs from 'yargs'

const unix = {
    echo: 'echo hello and hi',
    sinks: 'pacmd list-sinks | grep index | cut -d : -f 2',
    volUp: 'pactl set-sink-volume {{sink}} +5%',
    volDown: 'pactl set-sink-volume {{sink}} -5%',
    unmute: 'pactl set-sink-mute {{sink}} 0',
    mute: 'pactl set-sink-mute {{sink}} ',
    normal: 'pactl set-sink-volume {{sink}} 75%',
    max: 'pactl set-sink-volume {{sink}} 150%',
}

const sinksStdout = run(unix.sinks)
const sinks = sinksStdout ? sinksStdout.split(/\r?\n/).filter((line) => !!line) : []

function run(cmd: string) {
    try {
        const stdout = execSync(cmd)
        return stdout.toString()
    } catch (err) {
        console.error(err)
    }
}

function runSinks(unixCmd: string): void {
    sinks.forEach((sink) => run(Mustache.render(unixCmd, { sink })))
}

const argv = yargs
    .command('copy.js', 'Copy files.')
    .option('up', {
        alias: 'u',
        description: '',
        type: 'boolean',
    })
    .option('down', {
        alias: 'd',
        description: '',
        type: 'boolean',
    })
    .option('mute', {
        description: '',
        type: 'boolean',
    })
    .option('unmute', {
        description: '',
        type: 'boolean',
    })
    .option('normal', {
        alias: 'n',
        description: '75%',
        type: 'boolean',
    })
    .option('max', {
        alias: 'm',
        description: '150%',
        type: 'boolean',
    })
    .help()
    .alias('help', 'h').argv

if (argv.up) {
    runSinks(unix.unmute)
    runSinks(unix.volUp)
    console.log('up')
}
if (argv.down) {
    runSinks(unix.volDown)
    console.log('down')
}
if (argv.mute) {
    runSinks(unix.mute)
    console.log('mute')
}
if (argv.unmute) {
    runSinks(unix.unmute)
    console.log('unmute')
}
if (argv.normal) {
    runSinks(unix.normal)
    console.log('normal')
}
if (argv.max) {
    runSinks(unix.max)
    console.log('max')
}
