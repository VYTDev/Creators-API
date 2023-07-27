// script to compile the plugin

const help = () => console.log(`
Plugin Builder

  This script is a tool you can use to build your plugin. Read 'guide.txt' for more
  information. This will bundle your plugin.
  
  This script does not take any arguments except for 'help' and '?' alias.
`);

const args = process.argv.slice(2);
if (args[0] == "help" || args[0] == "?") {
    help();
    process.exit(0);
}

// bundle plugin
const fs = require("fs");
const stripJson = require("strip-json-comments");

// load tsconfig
const tsconfig = JSON.parse(stripJson(fs.readFileSync("./tsconfig.json", { encoding: "utf-8" })));

// check javascript output folder
if (!fs.existsSync(tsconfig.compilerOptions.outDir)) {
    console.log(`'${tsconfig.compilerOptions.outDir}' folder not found, run tsc first`);
    process.exit(1);
}

// load manifest
const manifest = fs.readFileSync("./plugin.json", { encoding: "utf-8" });
let plugin;

// validate plugin.json
try {
    plugin = JSON.parse(stripJson(manifest));
} catch (e) {
    console.error("error:  plugin manifest failed to load:\n    ", e.toString());
    process.exit(1);
}

// try to create dist folder
try {
    fs.mkdirSync("./dist", { recursive: true });
} catch (e) { };

// implementation of python function os.walk
function* walkTree(path, followsymlinks) {
    const files = [];
    const dirs = [];
    fs.readdirSync(path, { withFileTypes: true, recursive: true }).forEach(v => {
        if (!followsymlinks && v.isSymbolicLink()) return;
        if (v.isFile()) {
            files.push(v.name);
        }
        else if (v.isDirectory()) {
            dirs.push(v.name);
        }
    });
    yield [path, dirs, files];
    for (const folder of dirs) {
        yield* walkTree(path + "/" + folder, followsymlinks);
    }
}

// for time checking
const start = Date.now();

// create a stream to write the bundled file
const bundledFile = `./dist/${plugin.id}-${plugin.version}.js`;
let outfile = "";
outfile += `new creator.plugins.Plugin(${manifest}, {`;

// make script absolute
const rel = tsconfig.compilerOptions.outDir.length + 1;
let count = 0;

console.log("creating bundle ...");

// walk through the scripts in build folder
for (const [root, dirs, files] of walkTree(tsconfig.compilerOptions.outDir)) {
    for (const file of files) {
        const path = root + "/" + file;
        if (!path.endsWith(".js")) continue;
        console.log("script: " + path);
        const content = fs.readFileSync(path);
        outfile += `${JSON.stringify(path.slice(rel))}:function(intent,require,module,exports,global){\n${content}\n},`;
        count++;
    }
}

outfile += `}).register();\n`;

// save the bundle
fs.writeFileSync(bundledFile, outfile);

// message stat
const delta = (Date.now() - start) / 1000;
console.log(`bundled ${count} file(s) in ${delta} seconds`);

// package plugin
console.log("packing plugin...");
const JSZip = require("jszip");
const zip = new JSZip();

// important files
zip.file("index.js", fs.readFileSync(bundledFile));
zip.file("plugin.json", fs.readFileSync("plugin.json"));
zip.file("package.json", fs.readFileSync("package.json"));
zip.file("tsconfig.json", fs.readFileSync("tsconfig.json"));
// some informations
zip.file("README.md", fs.readFileSync("README.md"));
zip.file("LICENSE", fs.readFileSync("LICENSE"));

// plugin typings
try {
    for (const [root, dirs, files] of walkTree(tsconfig.compilerOptions.declarationDir)) {
        zip.folder(root.slice(1));
        for (const file of files) {
            const path = root + "/" + file;
            zip.file(path.slice(1), fs.readFileSync(path));
        }
    }
} catch { };

// generate plugin distribution file
zip.generateNodeStream({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: {
        level: 9
    }
})
    .pipe(fs.createWriteStream("./dist/package.plg"))
    .on("finish", () => {
        console.log("plugin package was saved on dist folder");
    });
