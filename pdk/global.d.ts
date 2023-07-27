// type definitions for the api, dont modify
import creator from "./api/index";

// declare global vars
declare global {
    /**
     * Additional parameters passed to the plugin on load
     */
    var intent: any[];
    /**
     * Requests a module or plugin
     */
    var require: creator.plugins.Require;
    /**
     * The module instance of this file
     */
    var module: creator.plugins.Module;
    /**
     * Exported values of this file
     */
    var exports: creator.plugins.Exports;
    /**
     * Plugin environment global scope
     */
    var global: creator.plugins.Global;
}
