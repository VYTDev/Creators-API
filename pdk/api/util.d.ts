/**
* Debug messages to content logs (when enabled)
* @param msg The message to debug
*/
export declare function debug(...msg: string[]): void;
/**
* Normalizes a path, removing leading, trailing, or repeating "/" by resolving
* it.
* @param {string} path The path to normalize
* @returns {string} Output path
*/
export declare function normalizePath(path: string): string;
/**
* Returns absolute path of "target" from the path "start".
* @param {string} start Where to start resolving the path
* @param {string} target The relative location from the start to resolve
* @returns {string} The output resolved path
*/
export declare function resolvePath(start: string, target: string, isfile?: boolean): string;
