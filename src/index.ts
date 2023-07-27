// export main modules
export * as config from "./config.js";
export * as util from "./util.js";
export * as plugins from "./plugins/index.js";

// export version of the framework
import { Version } from "./plugins/versioning.js";
export const version = new Version("0.1.0");

// export native libs
export * from "./native/index.js";

// make shortcut for import star as
import * as pkg from "./index.js";
export default pkg;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const globalThis: any;
// expose this framework to global scope (jQuery on Minecraft hahaha)
globalThis.$ = globalThis.creator = pkg;

// make it type safe
declare global {
  /**
   * A framework that will help you to create amaizing Minecraft features.
   */
  const creator: typeof pkg;
}
