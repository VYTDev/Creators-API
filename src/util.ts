import { config } from "./index.js";
/**
* Debug messages to content logs (when enabled)
* @param msg The message to debug
*/
export function debug(...msg: string[]): void {
    if (config.default.get("debug"))
        console.warn("[creators-api]", ...msg);
}

/**
* Normalizes a path, removing leading, trailing, or repeating "/" by resolving
* it.
* @param {string} path The path to normalize
* @returns {string} Output path
*/
export function normalizePath(path: string): string {
    const output = [];
    for (const part of path.split("/")) {
        if (!part.length || part == ".") {
            continue;
        }
        if (part == "..") {
            output.pop();
            continue;
        }
        output.push(part);
    }
    return output.filter(v => v.length).join("/");
}

/**
* Returns absolute path of "target" from the path "start".
* @param {string} start Where to start resolving the path
* @param {string} target The relative location from the start to resolve
* @returns {string} The output resolved path
*/
export function resolvePath(start: string, target: string, isfile?: boolean): string {
    if (target[0] == "/") return normalizePath(target);
    const result = normalizePath(start).split("/");
    if (isfile) result.pop();
    for (const part of target.split("/")) {
        if (!part.length || part == ".") {
            continue;
        }
        if (part == "..") {
            result.pop();
            continue;
        }
        result.push(part);
    }
    return result.filter(v => v.length).join("/");
}