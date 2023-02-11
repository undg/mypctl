#!/usr/bin/env node
import { execSync } from 'child_process'
import Mustache from 'mustache'
import yargs from 'yargs'

const cmd = {
    allSinks: 'pacmd list-sinks | grep index | cut -d : -f 2',
    volUp: 'pactl set-sink-volume {{sink}} +5%',
    volDown: 'pactl set-sink-volume {{sink}} -5%',
    unmute: 'pactl set-sink-mute {{sink}} 0',
    mute: 'pactl set-sink-mute {{sink}} ',
    normal: 'pactl set-sink-volume {{sink}} 75%',
    max: 'pactl set-sink-volume {{sink}} 150%',
    getVolume: "pactl get-sink-volume {{sink}} | awk '{print $7}'",
} as const

type Command = (typeof cmd)[keyof typeof cmd]

const sinksStdout = run(cmd.allSinks)
const sinks = sinksStdout
    ? sinksStdout.split(/\r?\n/).filter((line) => !!line)
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
    }
}

function runSinks(command: Command) {
    sinks.forEach((sink) => {
        const dB = run(Mustache.render(cmd.getVolume, { sink })) ?? '0'
        const volMax = JSON.parse(dB) > 11
        const dont = argv.up && volMax

        if (dont) return

        run(Mustache.render(command, { sink }))
    })
}
