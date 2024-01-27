const args = process.argv.slice(2);

const semver = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

const help = () => console.log(`
Creators’ API Plugin Registry Index

  This script will help you handle the Creators’ API plugin registry index. This
  index is used for installing plugin dependencies.
  
  Registry:
    register <id> <user> <repo>     Registers a new plugin or update remote repo
    show <id>                       Prints info about a specific plugin
    list                            List all plugins
    delete <id>                     Deletes a plugin to the index
    
  Versioning:
    remove <id> <ver>               Removes a version of a plugin on the registry
    update                          Update the index with \`plugin.json\`
  
  (excess arguments are ignored)
  
  See:  https://github.com/vytdev/creators-api
`);

const fs = require("fs");
const index = require("./index.json");

// switch sub-commands
switch (args[0]) {
    case "register": {
        const id = args[1];
        const user = encodeURIComponent(args[2]);
        const repo = encodeURIComponent(args[3]);
        let isNew;
        // new plugin
        if (!index[id]) {
            isNew = true;
            index[id] = { versions: {} };
        }
        // change remote
        index[id].user = user;
        index[id].repo = repo;
        // show message
        if (isNew) console.log(`new plugin '${id}' was added to the index`);
        else console.log(`updated remote repo of plugin '${id}' to https://github.com/${user}/${repo}.git`);
        break;
    }
    case "show": {
        const id = args[1];
        if (!index[id]) {
            console.log(`error: plugin '${id}' not found on index`);
            process.exit();
        }
        const idx = index[id];
        console.log(`plugin: ${id}`);
        console.log(`remote: https://github.com/${idx.user}/${idx.repo}.git`);
        console.log(`available versions:\n`);
        for (const ver in idx.versions) {
            console.log(`    v${ver}`);
        }
        break;
    }
    case "list": {
        console.log(Object.keys(index).join("\n"));
        break;
    }
    case "delete": {
        const id = args[1];
        if (index[id] && (delete index[id])) console.log(`deleted plugin '${id}' from the index`);
        else {
            console.log(`error: plugin '${id}' not found on index`);
            process.exit();
        }
        break;
    }
    case "remove": {
        const id = args[1];
        const ver = args[2];
        if (index[id]) {
            if (!semver.test(ver)) {
                console.log(`error: invalid version: ${ver}`);
                process.exit();
            }
            const succed = delete index[id].versions[ver];
            if (succed) console.log(`removed version '${ver}' from plugin '${id}'`);
            else {
                console.log(`error: failed to remove version '${ver}' from plugin '${id}'`);
                process.exit();
            }
        }
        else {
            console.log(`error: plugin '${id}' not found on index`);
            process.exit();
        }
        break;
    }
    case "update": {
        const stripJson = require("strip-json-comments");
        let plg;
        try {
            plg = JSON.parse(stripJson(fs.readFileSync("./plugin.json", { encoding: "utf-8" })));
        } catch (e) {
            console.log(`error: failed to open file: plugin.json`);
            process.exit();
        }
        console.log(`processing '${plg.id}' ...`);
        if (!index[plg.id]) {
            console.log(`error: plugin '${plg.id}' not found on index`);
            process.exit();
        }
        // validate version
        if (!semver.test(plg.version)) {
            console.log(`error: invalid semver version: ${plg.version}`);
            process.exit();
        }
        // prevent conflicts
        if (index[plg.id].versions[plg.version]) {
            console.log(`error: version '${plg.version}' of plugin '${plg.id}' already exists on index`);
            process.exit();
        }
        // add new version
        index[plg.id].versions[plg.version] = plg.dependencies || {};
        console.log(`updated index`);
        break;
    }
    default: {
        if (args[0]?.length)
            console.log(`unknown sub-command: ${args[0]}`);
        help();
    }
}

// save index
fs.writeFileSync("./index.json", JSON.stringify(index));
