#!/usr/bin/env node
import { execSync } from 'child_process'
import Mustache from 'mustache'
import yargs from 'yargs'
import { Sinks } from './type-pactl-list-sinks'

const cmd = {
    sinksJson: 'pactl -f json list sinks',
    volUp: 'pactl set-sink-volume {{sink}} +5%',
    volDown: 'pactl set-sink-volume {{sink}} -5%',
    unmute: 'pactl set-sink-mute {{sink}} 0',
    mute: 'pactl set-sink-mute {{sink}} ',
    normal: 'pactl set-sink-volume {{sink}} 75%',
    max: 'pactl set-sink-volume {{sink}} 150%', // technically there is no max.
} as const

type Cmd = (typeof cmd)[keyof typeof cmd]

const sinksStdout: Sinks = JSON.parse(run(cmd.sinksJson))
const sinks = sinksStdout
    ? sinksStdout.filter((sink) => sink.active_port !== null)
    : []

const argv = yargs
    .command('mypctl', 'Pulse audio cli interface.')
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
    runSinks(cmd.unmute)
    runSinks(cmd.volUp)
    console.log('up')
}
if (argv.down) {
    runSinks(cmd.volDown)
    console.log('down')
}
if (argv.mute) {
    runSinks(cmd.mute)
    console.log('mute')
}
if (argv.unmute) {
    runSinks(cmd.unmute)
    console.log('unmute')
}
if (argv.normal) {
    runSinks(cmd.normal)
    console.log('normal')
}
if (argv.max) {
    runSinks(cmd.max)
    console.log('max')
}

function run(cmd: string) {
    try {
        const stdout = execSync(cmd)

        return stdout.toString()
    } catch (err) {
        console.error(err)
        return ''
    }
}

function runSinks(command: Cmd) {
    for (const sink of sinks) {
        for (const volType in sink.volume) {
            const full = 2 ** 16 // 100%
            const limit = full * 2 - (full*0.05) // with 5% correction for async it's 200%
            const value = sink.volume[volType].value
            // Limit max volume up to this value.
            if (argv.up && value >= limit) return
        }

        run(Mustache.render(command, { sink: sink.index }))
    }
}
