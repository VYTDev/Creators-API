/**
* @class
* A class for handling configs
*/
export class Config <T extends object> {
    /**
    * Initialize a new instance of this class
    * @param data The config data
    */
    constructor(data?: T) {
        this._data = data;
    }
    /**
    * @private
    */
    private _data: T;
    /**
    * Returns a config by key
    * @param key
    * @returns {any}
    * @throws This can throw errors
    */
    public get<K extends keyof T>(key: K): T[K] {
        return this._data[key];
    }
    /**
    * Sets a config key
    * @param key
    * @param val
    * @returns {any}
    */
    public set<K extends keyof T>(key: K, val: T[K]): T[K] {
        return this._data[key] = val;
    }
    /**
    * Check if a config key exists
    * @param key The key name
    * @returns {boolean}
    */
    public has(key: keyof T): boolean {
        return key in this._data;
    }
    /**
    * Unsets a stored config key
    * @param key
    * @returns {boolean}
    */
    public delete(key: keyof T): boolean {
        return delete this._data[key];
    }
}

/**
* The config
*/
const config: Config <{
    /**
    * Whether to enable debugging
    */
    debug: boolean,
}> = new Config({
    debug: true,
});

/**
* Export this config so it will be accessible by other modules
*/
export default config;