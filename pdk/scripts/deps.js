// a script to install dependencies

const help = () => console.log(`
Plugin Dependency Installer

  Installs or updates all your plugin's dependency found on the plugin registry
  index. Only for installing types.
  
  Note:  Only run after running any npm commands (like ci, install, audit)
  
  This script does not take any arguments except for 'help' and '?' alias
`);

const args = process.argv.slice(2);
if (args[0] == "help" || args[0] == "?") {
    help();
    process.exit(0);
}

const { printLine, consoleLog, extendLine, endLine } = require("./jobs.js");
const ver = require("./versioning.js");
const downloadFile = require("./downloader.js");
const fs = require("fs");
const stripJson = require("strip-json-comments");

// get the distribution url of a package
const fileloc = (user, repo, version) => `https://github.com/${user}/${repo}/releases/download/v${version}/package.plg`;

(async () => {
    // try to load manifest
    let manifest = await fs.promises.readFile("./plugin.json", { encoding: "utf-8" });
    try {
        manifest = JSON.parse(stripJson(manifest));
    } catch (e) {
        consoleLog("error:  plugin manifest failed to load:\n    " + e.toString());
        process.exit(1);
    }
    // download the index
    let index;
    try {
        consoleLog("downloading index");
        index = await downloadFile("https://raw.github.com/vytdev/plugins-dex/master/index.json");
        // cache the index
        await fs.promises.writeFile("./.index.json", index);
    } catch {
        if (fs.existsSync("./.index.json")) {
            consoleLog("failed to download, using cached index file");
            index = await fs.promises.readFile("./.index.json", { encoding: "utf-8" });
        }
        else {
            consoleLog("failed to download, index not loaded");
            process.exit(1);
        }
    }
    
    consoleLog("reading package list...");
    try {
        index = JSON.parse(index);
    } catch {
        consoleLog("failed to parse index, maybe the index is corrupted");
        process.exit(1);
    }
    extendLine(" done");
    
    // dependencies lock file
    const lock = {};
    
    let hasDependencies = false;
    consoleLog("building dependency tree...");
    function buildDeps(tree, stack, id, version, user, repo, deps) {
        const dat = lock[tree.join("/node_modules/")] = {
            name: id,
            version: version,
            resolved: tree.length == 1 ? "" : fileloc(user, repo, version),
            dependencies: deps,
            installed: {}
        };
        stack.push(dat);
        // process dependencies
        for (const pkg in deps) {
            hasDependencies = true;
            const dep = index[pkg];
            const expr = new ver.Expression(deps[pkg]);
            // check for top level folders
            const copy = [...stack];
            copy.pop();
            let gen = true;
            while (copy.length) {
                const top = copy.pop().installed[pkg];
                if (top && expr.test(top)) {
                    dat.installed[pkg] = top;
                    gen = false;
                    break;
                }
            }
            if (!gen) continue;
            // add dependency
            if (!dep) {
                // check if plugin exists
                consoleLog(`error:  plugin '${id}' v${version} requests an unknown plugin '${pkg}'`);
                process.exit(1);
            }
            const plg = expr.latest(Object.keys(index[pkg].versions).map(v => new ver.Version(v)));
            if (!plg) {
                // check version
                consoleLog(`error:  plugin '${id}' v${version} requests an unknown version of plugin '${pkg}': ${expr}`);
                process.exit(1);
            }
            dat.installed[pkg] = plg;
            tree.push(pkg);
            buildDeps(tree, stack, pkg, plg, dep.user, dep.repo, dep.versions[plg.toString()]);
        }
        stack.pop();
        tree.pop();
    }
    printLine("processing...")
    // build the lock file
    buildDeps(["."], [], manifest.id, new ver.Version(manifest.version), "", "", manifest.dependencies || {});
    // create lock file
    await fs.promises.writeFile("./plugin-lock.json", JSON.stringify(lock, function(key, val) {
        // version should be a string
        if (val instanceof ver.Version)
            return val.toString();
        return val;
    }, "  "));
    extendLine(" done");
    endLine();
    // check if there were dependencies found
    if (!hasDependencies) {
        consoleLog("it seems this plugin doesn't have any dependencies");
        process.exit(0);
    }
    
    // download packages
    const packs = {};
    const start = Date.now();
    let count = 0;
    if (!fs.existsSync("./.cache/"))
        fs.promises.mkdir("./.cache/");
    consoleLog("resolving packages...");
    for (const root in lock) {
        if (root == ".") continue;
        count++;
        if (!fs.existsSync(root))
            await fs.promises.mkdir(root, { recursive: true });
        const dat = lock[root];
        const packname = `./.cache/${dat.name}@${dat.version}.plg`;
        if (fs.existsSync(packname)) {
            consoleLog(`skipping package '${dat.name}' v${dat.version}`);
            continue;
        }
        consoleLog(`downloading package '${dat.name}' v${dat.version} ...`);
        // attempt to download the package
        let buf;
        try {
            buf = await downloadFile(dat.resolved);
            consoleLog(`downloaded package: ${dat.name}`);
        } catch {
            consoleLog(`package '${dat.name}' v${dat.version} failed to download, using remote url: ${dat.resolved}`)
            process.exit(1);
        }
        await fs.promises.writeFile((packs[root] = packname), buf);
    }
    consoleLog("packages downloaded and cached");
    
    // install packages
    consoleLog("installing packages...")
    const JSZip = require("jszip");
    for (const root in packs) {
        const dat = lock[root];
        consoleLog(`selecting previously unselected package: ${dat.name}`);
        // extract package
        consoleLog(`preparing to unpack ..${packs[root]}`);
        const buf = await fs.promises.readFile(packs[root]);
        consoleLog(`unpacking ${dat.name} (${dat.version}) ...`);
        let zip;
        try {
            zip = await JSZip.loadAsync(buf);
        } catch {
            consoleLog(`package ${root} failed to extract, maybe the package was corrupted`);
            process.exit(1);
        }
        consoleLog(`installing ${dat.name} (${dat.version}) ...`);
        for (const loc in zip.files) {
            const item = zip.files[loc];
            const path = root + "/" + item.name;
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
        consoleLog(`successfully installed '${dat.name}' v${dat.version}`);
    }
    consoleLog("setup done");
    
    const time = (Date.now() - start) / 1000;
    consoleLog(`installed ${count} packages in ${time} seconds`);
})();
