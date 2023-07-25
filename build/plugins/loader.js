import { util } from "../index.js";
/**
 * Global values
 */
export const global = globalThis;
/**
 * A module handler class
 */
export class Module {
    /**
     * Create a new module
     */
    constructor(path, loader, callback) {
        /**
         * Exported vals of the module
         */
        this.exports = {};
        this._loaded = false;
        this._ran = false;
        /**
         * A list of all other modules requested by this module
         */
        this.children = [];
        this.loader = loader;
        this.action = callback;
        this.path = util.normalizePath(path);
        const parts = path.split("/");
        this.filename = parts[parts.length - 1];
        this.require = (path) => {
            const baseloc = util.resolvePath(this.path, path, true);
            const paths = [
                baseloc,
                baseloc + ".js",
                baseloc + "/index.js"
            ];
            let target;
            // resolve generated paths
            for (const p of paths) {
                if (!(target = loader.modules[p])) {
                    target = loader.modules[p];
                    continue;
                }
                break;
            }
            // target still not found, attempt to find a module
            if (!target && !/^.{0,2}\//.test(path)) {
                path = util.normalizePath(path);
                const pluginName = path.split("/", 1)[0];
                const moduleName = path.slice(pluginName.length + 1);
                const plugin = loader.libs[pluginName];
                if (moduleName.length) {
                    target = plugin?.loader.modules[moduleName];
                }
                else {
                    target = plugin?.loader.modules[plugin.entry];
                }
            }
            // throw an error if path failed to resolve
            if (!target)
                throw `Couldn't resolve module specifier: ${path}`;
            // append to child modules
            if (!this.children.includes(target))
                this.children.push(target);
            // return exports
            return target.run();
        };
    }
    /**
     * Whether the module is fully-loaded
     */
    get loaded() {
        return this._loaded;
    }
    /**
     * Whether the module is ran before (use cached exports instead)
     */
    get ran() {
        return this._ran;
    }
    /**
     * Starts the module
     * @returns {Exports}
     */
    run() {
        if (!this._ran) {
            this._ran = true;
            this.action.call(this.loader.plugin, this.loader.intent, this.require, this, this.exports, global);
            this._loaded = true;
        }
        return this.exports;
    }
    /**
     * Reset the module
     */
    reset() {
        if (this._ran) {
            if (!this._loaded)
                throw "Illegal invocation";
            this.exports = {};
            this._ran = false;
            this._loaded = false;
            this.children = [];
        }
    }
}
/**
 * A class that handles modules and packages
 */
export class Loader {
    /**
     * Initialize a new loader instance. Must only be called by the plugin constructor.
     * @param plugin Plugin instance where this loader works for
     * @param modules Package containing scripts (or technically functions)
     */
    constructor(plugin, modules) {
        this.plugin = plugin;
        this.modules = {};
        for (const path in modules) {
            this.modules[path] = new Module(path, this, modules[path]);
        }
    }
    /**
     * Start the loader operation
     * @param libs The dependencies
     * @param intent Optional additional parameters to pass
     */
    start(libs, intent) {
        this.libs = libs;
        this.intent = intent;
        this._running = true;
        const val = this.modules[this.plugin.entry].run();
        this._loaded = true;
        return val;
    }
    /**
     * Reset the loader
     * @throws This can throw errors
     */
    reset() {
        if (this._running) {
            if (!this._loaded)
                throw "Modules failed to terminate";
            this.libs = {};
            this.intent = [];
            for (const mod in this.modules)
                this.modules[mod].reset();
        }
    }
}
