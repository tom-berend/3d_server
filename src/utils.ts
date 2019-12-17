import chalk from 'chalk'

// which message type should we show?
let messages = ['success', 'info', 'error', 'status']


// console helpers
export function success(msg: string, filename: string = '') {
    consoleMessage('success', filename, chalk.green.italic(`[SUCCESS] ${msg}`))
}
export function info(msg: string, filename: string = '') {
    consoleMessage('info', filename, chalk.blue.italic(`[INFO] ${msg}`))
}
export function error(msg: string, filename: string = '') {
    consoleMessage('error', filename, chalk.red.italic(`[ERROR] ${msg}`))
}
export function status(msg: string, filename: string = '') {
    consoleMessage('status', filename, chalk.yellow.italic(`[STATUS] ${msg}`))
}

// TODO filter by message type and filename
function consoleMessage(type: string, filename: string, msg: string) {
    console.log(msg)
}
