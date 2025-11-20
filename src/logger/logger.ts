export class Logger {
    static debug(...args: any[]) {
        if (globalThis.debug) {
            console.debug(args);
        }
    }
}