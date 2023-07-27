import { util, version } from "../index.js";
import { Version, Expression } from "./versioning.js";
import { Exports, Libs, Loader, Package } from "./loader.js";

const registry: { [id: string]: Plugin[] } = {};

/**
 * Plugin manifest
 */
export interface Manifest {
    /**
     * The unique package identifier of the plugin
     */
    id: string,
    /**
     * Version name of the plugin
     */
    version: string,
    /**
     * The name of the plugin
     */
    name?: string,
    /**
     * Creators’ API engine version this plugin needs. Default to current runner
     */
    engine?: string,
    /**
     * Plugin entry point. Defaults to index.js
     */
    entry?: string,
    /**
     * List of dependencies this plugin needs
     */
    dependencies?: {
        /**
         * Package name of the dependency and its version
         */
        [id: string]: string,
    },
    /**
     * Plugin creator name
     */
    author?: string,
    /**
     * Plugin license
     */
    license?: string,
    /**
     * Plugin website or homepage
     */
    url?: string,
}

/**
 * A class for handling a plugin
 */
export class Plugin {
    /**
     * Creates a plugin instance
     * @param manifest Information about the plugin
     * @param scripts An object containing functions
     */
    constructor(manifest: Manifest, scripts: Package) {
        this.manifest = manifest;
        // copy manifest content
        this.id = manifest.id;
        this.name = manifest.name || this.id;
        this.version = new Version(manifest.version);
        this.engine = new Expression(manifest.engine || ">=*-0");
        this.entry = manifest.entry ? util.normalizePath(manifest.entry) : "index.js";
        this.dependencies = {};
        for (const dep in (manifest.dependencies || {})) {
            this.dependencies[dep] = new Expression(manifest.dependencies[dep]);
        }
        this.loader = new Loader(this, scripts);
    }
    /**
     * The manifest passed to the constructor
     */
    public manifest: Manifest;
    /**
     * The id of the plugin
     */
    public id: string;
    /**
     * Plugin version
     */
    public version: Version;
    /**
     * Optional name of the plugin
     */
    public name: string;
    /**
     * API Version this plugin can run
     */
    public engine: Expression;
    /**
     * Entry point of the plugin
     */
    public entry: string;
    /**
     * Plugin dependencies
     */
    public dependencies: { [id: string]: Expression };
    /**
     * Plugin loader instance
     */
    public loader: Loader;
    /**
     * Installs this plugin to the registry
     * @returns {this}
     * @throws This can throw errors
     */
    public register(): this {
        // perform initial checks
        // check engine version
        if (!this.engine.test(version)) {
            util.debug(`Plugin "${this.name}" (${this.id}) failed to install with errors`);
            util.debug(`Plugin "${this.id}" requires Creators’ API engine version '${this.engine}' but ${version} were installed`);
            throw `incompatible api version: ${version}`;
        }
        (registry[this.id] || (registry[this.id] = [])).push(this);
        return this;
    }
    /**
     * Launch this plugin
     * @param intent Optional arguments to pass to the plugin
     * @returns {Exports}
     * @throws This can throw errors
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public start(...intent: any[]): Exports {
        // resolve dependencies
        const libs: Libs = {};
        for (const dep in this.dependencies) {
            const expr = this.dependencies[dep];
            const collection = registry[dep];
            if (!collection)
                throw `Plugin '${this.id}' dependencies an unknown lib '${dep}'. Do you installed the lib?`;
            const versions: Version[] = [];
            collection.forEach((v) => versions.push(v.version));
            const latest = expr.latest(versions);
            if (!latest)
                throw `Plugin '${this.id}' dependencies an unknown version of lib '${dep}': ${expr}`;
            libs[dep] = collection.find(v => v.version.eq(latest));
        }
        // start the plugin
        return this.loader.start(libs, intent || []);
    }
    /**
     * Resets the plugin (we can't clear the cache)
     * @returns {this}
     * @throws This can throw errors
     */
    public stop(): this {
        this.loader.reset();
        return this;
    }
}

// export plugin package
export * from "./loader.js";
export * from "./versioning.js";
