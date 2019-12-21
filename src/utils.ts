import chalk from 'chalk'

// which message type should we show?
let messages = ['success', 'info', 'error', 'status']
let filenames: string[] = []

// messages = ['info']

export function logThisFile(filename: string) {
    filenames.push(filename)
}

// console helpers
export function success(msg: string, filename?: string) {
    if (messages.includes('success') && (filenames.includes(filename) || filename === null)) {
        consoleMessage('success', filename, chalk.green.italic(`[SUCCESS] ${msg}`))
    }
}
export function info(msg: string, filename: string = '') {
    if (messages.includes('info') && filenames.includes(filename)) {
        consoleMessage('info', filename, chalk.blue.italic(`[INFO] ${msg}`))
    }
}
export function error(msg: string, filename: string = '') {
    if (messages.includes('error') && filenames.includes(filename)) {
        consoleMessage('error', filename, chalk.red.italic(`[ERROR] ${msg}`))
    }
}
export function status(msg: string, filename: string = '') {
    if (messages.includes('status') && filenames.includes(filename)) {
        consoleMessage('status', filename, chalk.yellow.italic(`[STATUS] ${msg}`))
    }
}
// TODO filter by message type and filename
function consoleMessage(type: string, filename: string, msg: string) {
    console.log(msg)
}

