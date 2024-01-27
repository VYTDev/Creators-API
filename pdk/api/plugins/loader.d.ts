import { Plugin } from "./index.js";
/**
 * Package representation
 */
export type Package = {
    [path: Filename]: Script;
};
/**
 * Compiled package
 */
export type Compiled = {
    [path: Filename]: Module;
};
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
export type Global = {
    [key: string]: any;
};
/**
 * Name of a module
 */
export type Filename = `${string}.js`;
/**
 * Dependency libs
 */
export type Libs = {
    [id: string]: Plugin;
};
/**
 * Global values
 */
export declare const global: Global;
/**
 * A module handler class
 */
export declare class Module {
    /**
     * Create a new module
     */
    constructor(path: string, loader: Loader, callback: Script);
    /**
     * The loader where this module belongs
     */
    readonly loader: Loader;
    /**
     * The function that contains the module
     */
    readonly action: Script;
    /**
     * Path of this module
     */
    readonly path: string;
    /**
     * The filename of this module
     */
    readonly filename: string;
    /**
     * Require function used by the module
     */
    readonly require: Require;
    /**
     * Exported vals of the module
     */
    exports: Exports;
    /**
     * Whether the module is fully-loaded
     */
    get loaded(): boolean;
    private _loaded;
    /**
     * Whether the module is ran before (use cached exports instead)
     */
    get ran(): boolean;
    private _ran;
    /**
     * A list of all other modules requested by this module
     */
    children: Module[];
    /**
     * Starts the module
     * @returns {Exports}
     */
    run(): Exports;
    /**
     * Reset the module
     */
    reset(): void;
}
/**
 * A class that handles modules and packages
 */
export declare class Loader {
    /**
     * Initialize a new loader instance. Must only be called by the plugin constructor.
     * @param plugin Plugin instance where this loader works for
     * @param modules Package containing scripts (or technically functions)
     */
    constructor(plugin: Plugin, modules: Package);
    /**
     * The plugin instance where this loader belongs
     */
    readonly plugin: Plugin;
    /**
     * Compiled package instance
     */
    modules: Compiled;
    /**
     * Resolved library dependencies
     */
    libs: Libs;
    /**
     * Additional parameters
     */
    intent: any[];
    /**
     * @private
     */
    private _running;
    private _loaded;
    /**
     * Start the loader operation
     * @param libs The dependencies
     * @param intent Optional additional parameters to pass
     */
    start(libs: Libs, intent: any[]): Exports;
    /**
     * Reset the loader
     * @throws This can throw errors
     */
    reset(): void;
}
