// script to add job lines on terminal

let hasJobLine = false;
// change terminal line
function printLine(text) {
    process.stdout.moveCursor(0, 0);
    process.stdout.clearScreenDown();
    if (text.length > process.stdout.columns) text = text.slice(0, process.stdout.columns - 3);
    process.stdout.write("\r\x1b[K\x1b[33m" + text + "\x1b[0m");
    hasJobLine = true;
}
let lastText = "";
// log a message to console while theres a job line
function consoleLog(text) {
    lastText = text;
    if (!hasJobLine) return console.log(text);
    process.stdout.moveCursor(0, 0);
    process.stdout.clearScreenDown();
    process.stdout.write("\r\x1b[K" + text + "\n");
}
// extend last line
function extendLine(text) {
    lastText += text;
    process.stdout.moveCursor(0, -1);
    process.stdout.clearScreenDown();
    process.stdout.write("\r\x1b[K" + lastText + "\n");
}
// end job line
function endLine() {
    if (!hasJobLine) return;
    process.stdout.moveCursor(0, 0);
    process.stdout.clearScreenDown();
    process.stdout.write("\r\x1b[K");
    hasJobLine = false;
}

module.exports = {
    printLine,
    consoleLog,
    extendLine,
    endLine
};
