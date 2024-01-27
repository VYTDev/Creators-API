// export main modules
export * as config from "./config.js";
export * as util from "./util.js";
export * as plugins from "./plugins/index.js";
// export version of the framework
import { Version } from "./plugins/versioning.js";
export const version = new Version("0.2.0");
// export native libs
export * from "./native/index.js";
// make shortcut for import star as
import * as pkg from "./index.js";
export default pkg;
// expose this framework to global scope
globalThis.creator = pkg;
