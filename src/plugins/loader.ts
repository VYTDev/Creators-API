import { Plugin } from "./index.js";
import { util } from "../index.js";

/**
 * Package representation
 */
export type Package = { [path: Filename]: Script };
/**
 * Compiled package
 */
export type Compiled = { [path: Filename]: Module };
/**
 * Module callback
 */
export type Script = (this: Plugin, intent: any[], require: Require, module: Module, exports: Exports, global: Global) => void;
/**
 * Require representation
 */
export type Require = (path: string) => Exports;
/**
 * Exports representation
 */
export type Exports = any;
/**
 * Global representation
 */
export type Global =  { [key: string]: any };
/**
 * Name of a module
 */
export type Filename = `${string}.js`;
/**
 * Dependency libs
 */
export type Libs = { [id: string]: Plugin };

/**
 * Global values
 */
export const global: Global = globalThis;

/**
 * A module handler class
 */
export class Module {
    /**
     * Create a new module
     */
    constructor(path: string, loader: Loader, callback: Script) {
        this.loader = loader;
        this.action = callback;
        this.path = util.normalizePath(path);
        const parts = path.split("/");
        this.filename = parts[parts.length - 1];
        this.require = (path: string): Exports => {
            const baseloc = util.resolvePath(this.path, path, true);
            const paths = [
                baseloc,
                baseloc + ".js",
                baseloc + "/index.js"
            ];
            let target;
            // resolve generated paths
            for (const p of paths) {
                if (!(target = loader.modules[p as Filename])) {
                    target = loader.modules[p as Filename];
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
                    target = plugin?.loader.modules[moduleName as Filename];
                }
                else {
                    target = plugin?.loader.modules[plugin.entry as Filename];
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
     * The loader where this module belongs
     */
    public readonly loader: Loader;
    /**
     * The function that contains the module
     */
    public readonly action: Script;
    /**
     * Path of this module
     */
    public readonly path: string;
    /**
     * The filename of this module
     */
    public readonly filename: string;
    /**
     * Require function used by the module
     */
    public readonly require: Require;
    /**
     * Exported vals of the module
     */
    public exports: Exports = {};
    /**
     * Whether the module is fully-loaded
     */
    public get loaded(): boolean {
        return this._loaded;
    }
    private _loaded: boolean = false;
    /**
     * Whether the module is ran before (use cached exports instead)
     */
    public get ran(): boolean {
        return this._ran;
    }
    private _ran: boolean = false;
    /**
     * A list of all other modules requested by this module
     */
    public children: Module[] = [];
    /**
     * Starts the module
     * @returns {Exports}
     */
    public run(): Exports {
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
    public reset(): void {
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
    constructor(plugin: Plugin, modules: Package) {
        this.plugin = plugin;
        this.modules = {};
        for (const path in modules) {
            this.modules[path as Filename] = new Module(path, this, modules[path as Filename]);
        }
    }
    /**
     * The plugin instance where this loader belongs
     */
    public readonly plugin: Plugin;
    /**
     * Compiled package instance
     */
    public modules: Compiled;
    /**
     * Resolved library dependencies
     */
    public libs: Libs;
    /**
     * Additional parameters
     */
    public intent: any[];
    /**
     * @private
     */
    private _running: boolean;
    private _loaded: boolean;
    /**
     * Start the loader operation
     * @param libs The dependencies
     * @param intent Optional additional parameters to pass
     */
    public start(libs: Libs, intent: any[]): Exports {
        this.libs = libs;
        this.intent = intent;
        this._running = true;
        const val = this.modules[this.plugin.entry as Filename].run();
        this._loaded = true;
        return val;
    }
    /**
     * Reset the loader
     * @throws This can throw errors
     */
    public reset(): void {
        if (this._running) {
            if (!this._loaded)
                throw "Modules failed to terminate";
            this.libs = {};
            this.intent = [];
            for (const mod in this.modules)
                this.modules[mod as Filename].reset();
        }
    }
}
