import { util, version } from "../index.js";
import { Version, Expression } from "./versioning.js";
import { Loader } from "./loader.js";
const registry = {};
/**
 * A class for handling a plugin
 */
export class Plugin {
    /**
     * Creates a plugin instance
     * @param manifest Information about the plugin
     * @param scripts An object containing functions
     */
    constructor(manifest, scripts) {
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
     * Installs this plugin to the registry
     * @returns {this}
     * @throws This can throw errors
     */
    register() {
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
    start(...intent) {
        // resolve dependencies
        const libs = {};
        for (const dep in this.dependencies) {
            const expr = this.dependencies[dep];
            const collection = registry[dep];
            if (!collection)
                throw `Plugin '${this.id}' dependencies an unknown lib '${dep}'. Do you installed the lib?`;
            const versions = [];
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
    stop() {
        this.loader.reset();
        return this;
    }
}
