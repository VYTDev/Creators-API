// export main modules
export * as config from "./config.js";
export * as util from "./util.js";
export * as plugin from "./plugins/index.js";
// export version of the framework
import { Version } from "./plugins/versioning.js";
export const version = new Version("0.1.0");
// make shortcut for import star as
import * as pkg from "./index.js";
export default pkg;
// expose this framework to global scope (jQuery on Minecraft hahaha)
globalThis.$ = globalThis.creator = pkg;
