/* eslint-disable @typescript-eslint/no-explicit-any */
/* ================================================================
events — Interact with the API events

This plugin adds an event handler and emitter based on the NodeJS and
DOM implementation. This is useful when communicating between your
scripts.
================================================================ */
/**
 * Main class for handling events.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export class Events {
    constructor() {
        /**
         * @private
         */
        this._listeners = [];
        this._guid = 0;
    }
    addEventListener(event, listener, options) {
        const data = {
            event, listener,
            once: options?.once,
            id: ++this._guid,
        };
        // add the listener
        if (options?.prepend)
            this._listeners.unshift(data);
        else
            this._listeners.push(data);
        // return listener id
        return data.id;
    }
    /**
     * Removes an event listener
     * @param id The id returned by the {@link Events.addEventListener} method
     * @returns {boolean} Whether the listener was successfully removed
     */
    removeEventListener(id) {
        const idx = this._listeners.findIndex(v => v.id == id);
        if (idx == -1)
            return false;
        this._listeners.splice(idx, 1);
        return true;
    }
    dispatchEvent(event, ...args) {
        for (const listener of this._listeners) {
            if (listener.event != event)
                continue;
            try {
                listener.listener.call(this, ...args);
            }
            // eslint-disable-next-line no-empty
            catch { }
            // check for once attribute
            if (listener.once)
                this.removeEventListener(listener.id);
        }
    }
    on(event, listener) {
        return this.addEventListener(event, listener);
    }
    once(event, listener) {
        return this.addEventListener(event, listener, { once: true });
    }
    prependListener(event, listener) {
        return this.addEventListener(event, listener, { prepend: true });
    }
    prependOnceListener(event, listener) {
        return this.addEventListener(event, listener, { once: true, prepend: true });
    }
    /**
     * Stop a listener from listening in an event. Alias of {@link Events.removeEventListener }
     * @returns {boolean}
     */
    off(id) {
        return this.removeEventListener(id);
    }
}
import { handler } from "./minecraft.js";
export const main = handler;
// register this plugin
import { Plugin } from "../../plugins/index.js";
new Plugin({
    id: "events",
    version: "1.0.0"
}, {
    "index.js": (intent, require, module, exports) => {
        exports.Events = Events;
        exports.main = handler;
    },
    "minecraft.js": (intent, require, module, exports) => {
        exports.handler = handler;
    },
}).register();
