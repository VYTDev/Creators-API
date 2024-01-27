import { Version, Expression } from "./versioning.js";
import { Exports, Loader, Package } from "./loader.js";
/**
 * Plugin manifest
 */
export interface Manifest {
    /**
     * The unique package identifier of the plugin
     */
    id: string;
    /**
     * Version name of the plugin
     */
    version: string;
    /**
     * The name of the plugin
     */
    name?: string;
    /**
     * Creators’ API engine version this plugin needs. Default to current runner
     */
    engine?: string;
    /**
     * Plugin entry point. Defaults to index.js
     */
    entry?: string;
    /**
     * List of dependencies this plugin needs
     */
    dependencies?: {
        /**
         * Package name of the dependency and its version
         */
        [id: string]: string;
    };
    /**
     * Plugin creator name
     */
    author?: string;
    /**
     * Plugin license
     */
    license?: string;
    /**
     * Plugin website or homepage
     */
    url?: string;
}
/**
 * A class for handling a plugin
 */
export declare class Plugin {
    /**
     * Creates a plugin instance
     * @param manifest Information about the plugin
     * @param scripts An object containing functions
     */
    constructor(manifest: Manifest, scripts: Package);
    /**
     * The manifest passed to the constructor
     */
    manifest: Manifest;
    /**
     * The id of the plugin
     */
    id: string;
    /**
     * Plugin version
     */
    version: Version;
    /**
     * Optional name of the plugin
     */
    name: string;
    /**
     * API Version this plugin can run
     */
    engine: Expression;
    /**
     * Entry point of the plugin
     */
    entry: string;
    /**
     * Plugin dependencies
     */
    dependencies: {
        [id: string]: Expression;
    };
    /**
     * Plugin loader instance
     */
    loader: Loader;
    /**
     * Installs this plugin to the registry
     * @returns {this}
     * @throws This can throw errors
     */
    register(): this;
    /**
     * Launch this plugin
     * @param intent Optional arguments to pass to the plugin
     * @returns {Exports}
     * @throws This can throw errors
     */
    start(...intent: any[]): Exports;
    /**
     * Resets the plugin (we can't clear the cache)
     * @returns {this}
     * @throws This can throw errors
     */
    stop(): this;
}
export * from "./loader.js";
export * from "./versioning.js";
