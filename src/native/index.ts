// this file exports all built-in libs
export * as events from "./events/index.js";

// allows you to require minecraft modules
import { Plugin } from "../plugins/index.js";
import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";

// register minecraft modules
new Plugin({
    id: "@minecraft",
    version: "1.0.0",
    name: "Minecraft Scripts",
    engine: "*",
    author: "Minecraft",
}, {
    "index.js": (intent, require, module, exports) => {
        exports["server"] = require("./server");
        exports["server-ui"] = require("./server-ui");
    },
    "server/index.js": (intent, require, module) => {
        module.exports = mc;
    },
    "server-ui/index.js": (intent, require, module) => {
        module.exports = ui;
    },
}).register();
