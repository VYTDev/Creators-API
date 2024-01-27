/**
* @class
* A class for handling configs
*/
export class Config {
    /**
    * Initialize a new instance of this class
    * @param data The config data
    */
    constructor(data) {
        this._data = data;
    }
    /**
    * Returns a config by key
    * @param key
    * @returns {any}
    * @throws This can throw errors
    */
    get(key) {
        return this._data[key];
    }
    /**
    * Sets a config key
    * @param key
    * @param val
    * @returns {any}
    */
    set(key, val) {
        return this._data[key] = val;
    }
    /**
    * Check if a config key exists
    * @param key The key name
    * @returns {boolean}
    */
    has(key) {
        return key in this._data;
    }
    /**
    * Unsets a stored config key
    * @param key
    * @returns {boolean}
    */
    delete(key) {
        return delete this._data[key];
    }
}
/**
* The config
*/
const config = new Config({
    debug: true,
});
/**
* Export this config so it will be accessible by other modules
*/
export default config;
