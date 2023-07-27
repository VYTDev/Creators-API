// a script for changing api types declaration

const help = () => console.log(`
Plugin Framework Migrate

  This can help you to easily change the type declarations of the API, by version.
  
  This script does not take any arguments except for 'help' and '?' alias
`);

const args = process.argv.slice(2);
if (args[0] == "help" || args[0] == "?") {
    help();
    process.exit(0);
}

const { consoleLog, extendLine } = require("./jobs.js");
const downloadFile = require("./downloader.js");
const fs = require("fs");
const JSZip = require("jszip");

// simply query the user
function ask(question) {
    return new Promise((resolve) => {
        process.stdout.write(question);
        process.stdin.once("data", (text) => {
            // remove new line after the input
            resolve(text.toString().slice(0, -1));
        });
    });
}

(async () => {
    consoleLog("getting release information...")
    // get a list of releases using the github rest api
    let releases;
    try {
        releases = JSON.parse(await downloadFile({
            url: "https://api.github.com/repos/vytdev/creators-api/releases",
            headers: {
                "user-agent": "request"
            }
        }));
    } catch {
        consoleLog("failed to fetch data");
        process.exit(1);
    }
    extendLine(" done");
    // show versions
    consoleLog("available versions:")
    releases.forEach(v => consoleLog("  " + v.name));
    let version, choosen;
    // ask the user
    while (true) {
        choosen = "v" + (await ask("please choose a version: ")).trim();
        version = choosen.length == 0 ? releases[0] : releases.find(v => v.tag_name == choosen);
        if (!version) {
            consoleLog("version not found, please select on the top");
            continue;
        }
        consoleLog("selected " + choosen);
        break;
    }
    // type declarations of the framework
    const types = version.assets.find(v => v.name == "framework-types.zip");
    // download type declarations
    consoleLog(`downloading type declarations of Creators’ API Framework ${choosen} ...`);
    let buf;
    try {
        buf = await downloadFile(types.browser_download_url);
    } catch {
        consoleLog("failed to download types declaration package");
        process.exit(1);
    }
    // extract package
    consoleLog("unpacking framework...");
    let zip;
    try {
        zip = await JSZip.loadAsync(buf);
        extendLine(" done");
    } catch {
        consoleLog("archive failed to extract");
        consoleLog("from: " + types.browser_download_url);
        process.exit(1);
    }
    // remove current installed types
    if (fs.existsSync("./api")) {
        consoleLog("removing last types...");
        await fs.promises.rm("./api", { recursive: true, force: true });
        extendLine(" done");
    }
    // replace 
    consoleLog("installing types...");
    await fs.promises.mkdir("./api", { recursive: true });
    for (const loc in zip.files) {
        const item = zip.files[loc];
        const path = "./api/" + item.name;
        // add a folder
        if (item.dir) {
            if (!fs.existsSync(path))
                await fs.promises.mkdir(path, { recursive: true });
        }
        else {
            // make sure the parent directory exists
            const dirname = path.split("/").slice(0, -1).join("/");
            if (!fs.existsSync(dirname))
                await fs.promises.mkdir(dirname, { recursive: true });
            // save the file
            await fs.promises.writeFile(path, Buffer.from(await item.async("arraybuffer")));
        }
    }
    extendLine(" done");
    consoleLog("successfully changed framework types");
    // destroy stdin
    process.stdin.destroy();
})();
