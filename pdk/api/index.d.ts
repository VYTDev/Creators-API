export * as config from "./config.js";
export * as util from "./util.js";
export * as plugins from "./plugins/index.js";
import { Version } from "./plugins/versioning.js";
export declare const version: Version;
export * from "./native/index.js";
import * as pkg from "./index.js";
export default pkg;
declare global {
    /**
     * A framework that will help you to create amaizing Minecraft features.
     */
    const creator: typeof pkg;
}
