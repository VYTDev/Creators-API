// utility script to download file on the web
const { printLine, consoleLog, endLine } = require("./jobs.js");
const https = require("https");
const url = require("url");

// request can be a string or url object
// returns a promise that resolves a buffer
function downloadFile(req) {
    // accept object parameter
    if (typeof req == "object") req = { ...req, ...url.parse(req.url) };
    else req = url.parse(req);
    return new Promise((resolve, reject) => {
        printLine("connecting to " + req.host + " ...");
        let isAborted = false;
        const conn = https.get(req, (res) => {
            // handle errors
            if (res.statusCode >= 400) {
                consoleLog("failed to download a file with status code: " + res.statusCode);
                process.exit(1);
            }
            // handle redirects
            const loc = res.headers["location"];
            if (res.statusCode >= 300 && res.statusCode < 400 && loc) {
                printLine("redirect found: " + loc);
                isAborted = true;
                conn.destroy();
                downloadFile(url.resolve(req, loc)).then(resolve);
                return;
            }
            // process body
            const len = +res.headers["content-length"];
            const hasLen = !isNaN(len);
            const raw = [];
            let last = 0;
            // chunk recieved
            res.on("data", (chunk) => {
                raw.push(chunk);
                // for estimating download stat and performance
                const curr = Date.now();
                const elapsed = (curr - last) / 1000;
                last = curr;
                const bandwidth = chunk.length / elapsed;
                const left = len / bandwidth;
                const loaded = res.socket.bytesRead;
                const percent = loaded / len * 100;
                // download
                const stat = `${hasLen ? Math.round(percent) + "%" : "?"} [${loaded} B / ${hasLen ? len : "?"} B] `;
                // performance
                let perf = `${Math.round(bandwidth / 10) * 10} B/s`;
                if (hasLen) perf += `, ${Math.round(left)} secs left`;
                perf = perf.padStart(process.stdout.columns - stat.length, " ");
                // show on end line
                let text = "";
                text += stat;
                text += perf;
                // show in terminal
                printLine(text);
            });
            // download ended
            res.on("end", () => {
                if (!res.complete) {
                    consoleLog("connection lost");
                    return reject("lost");
                }
                // download finished
                printLine("storing download...");
                resolve(Buffer.concat(raw));
                endLine();
            });
        })
            // error
            .on("error", (err) => {
                endLine();
                consoleLog(`failed to download ${url.format(req)}`);
                return reject(err);
            });
    });
}

module.exports = downloadFile;
