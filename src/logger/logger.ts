export class Logger {
    static debug(...args: any[]) {
        if (globalThis.debug) {
            console.debug(args);
        }
    }

    static info(...args: any[]) {
        console.info(args);
    }
}