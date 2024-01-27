/**
* @class
* A class for handling configs
*/
export declare class Config<T extends object> {
    /**
    * Initialize a new instance of this class
    * @param data The config data
    */
    constructor(data?: T);
    /**
    * @private
    */
    private _data;
    /**
    * Returns a config by key
    * @param key
    * @returns {any}
    * @throws This can throw errors
    */
    get<K extends keyof T>(key: K): T[K];
    /**
    * Sets a config key
    * @param key
    * @param val
    * @returns {any}
    */
    set<K extends keyof T>(key: K, val: T[K]): T[K];
    /**
    * Check if a config key exists
    * @param key The key name
    * @returns {boolean}
    */
    has(key: keyof T): boolean;
    /**
    * Unsets a stored config key
    * @param key
    * @returns {boolean}
    */
    delete(key: keyof T): boolean;
}
/**
* The config
*/
declare const config: Config<{
    /**
    * Whether to enable debugging
    */
    debug: boolean;
}>;
/**
* Export this config so it will be accessible by other modules
*/
export default config;
