export const Logger = {};
Logger.showInfo = true;
Logger.showWarning = true;
Logger.showError = true;
Logger.info = function () {
    if (Logger.showInfo) {
        console.log(...arguments);
    }
}
Logger.warn = function () {
    if (Logger.showWarning) {
        console.warn(...arguments);
    }
}
Logger.error = function () {
    if (Logger.showError) {
        console.error(...arguments);
    }
}
