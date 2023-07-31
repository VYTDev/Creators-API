(async () => {

const fs = require("fs");
const JSZip = require("jszip");
const { build } = require("esbuild");

// check generated folder
if (!fs.existsSync("./dist/generated")) {
    console.log("it seems you haven't run tsc yet");
    process.exit(0);
}

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

const start = Date.now();

console.log("building distribution files...")

// build bundles
console.log("creating bundles");
await build({
    entryPoints: ["./dist/generated/index.js"],
    outfile: "./dist/framework.js",
    external: ["@minecraft/server", "@minecraft/server-ui"],
    format: "esm",
    bundle: true,
    minify: false,
});
await build({
    entryPoints: ["./dist/framework.js"],
    outfile: "./dist/framework.min.js",
    external: ["@minecraft/server", "@minecraft/server-ui"],
    format: "esm",
    bundle: true,
    minify: true,
});

// package typings
console.log("packing typings");
const types = new JSZip();
for (const [root, dirs, files] of walkTree("./pdk/api")) {
    const relroot = root.slice("./pdk/api".length + 1);
    for (const file of files) {
        const path = relroot + "/" + file;
        types.file(path, fs.readFileSync(root + "/" + file));
    }
}
types.generateNodeStream({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: {
        level: 9
    }
})
    .pipe(fs.createWriteStream("./dist/framework-types.zip"))
    .on("finish", () => {
        console.log("created types package");
    });

// package library
console.log("packing library");
const lib = new JSZip();
for (const [root, dirs, files] of walkTree("./dist/generated")) {
    const relroot = root.slice("./dist/generated".length + 1);
    for (const file of files) {
        const path = relroot + "/" + file;
        lib.file(path, fs.readFileSync(root + "/" + file));
    }
}
lib.generateNodeStream({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: {
        level: 9
    }
})
    .pipe(fs.createWriteStream("./dist/framework.zip"))
    .on("finish", () => {
        console.log("created lib package");
    });

// package pdk
console.log("packing kit");
const pdk = new JSZip();
for (const [root, dirs, files] of walkTree("./pdk")) {
    const relroot = root.slice("./pdk".length + 1);
    for (const file of files) {
        const path = relroot + "/" + file;
        pdk.file(path, fs.readFileSync(root + "/" + file));
    }
}
pdk.generateNodeStream({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: {
        level: 9
    }
})
    .pipe(fs.createWriteStream("./dist/framework-pdk.zip"))
    .on("finish", () => {
        console.log("created pdk package");
    });

})();
