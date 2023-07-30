/* eslint-disable @typescript-eslint/no-explicit-any */
/* ================================================================
events — Interact with the API events

This plugin adds an event handler and emitter based on the NodeJS and
DOM implementation. This is useful when communicating between your
scripts.
================================================================ */

interface Listener {
    event: string | symbol,
    listener: (...args: any) => void,
    once: boolean,
    id: number,
}

/**
 * Additional options for the listener
 */
export interface ListeningOptions {
    /**
     * Whether to execute the event once
     */
    once?: boolean,
    /**
     * Whether to make the listener execute first from other listeners
     */
    prepend?: boolean,
}

/**
 * Main class for handling events.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export class Events<T extends { [event: string | symbol]: any[] } = {}> {
    /**
     * @private
     */
    private _listeners: Listener[] = [];
    private _guid = 0;
    /**
     * Adds a new event listener
     * @param event The event to listen for
     * @param listener The function to execute
     * @param options Additional options for the listener
     * @returns {number} ID of the listener
     */
    public addEventListener<K extends keyof T>(event: K, listener: (...args: T[K]) => void, options?: ListeningOptions): number;
    public addEventListener<S extends string | symbol>(event: Exclude<S, keyof T>, listener: (...args: any[]) => void, options?: ListeningOptions): number;
    public addEventListener(event: string | symbol, listener: (...args: any) => void, options?: ListeningOptions): number {
        const data: Listener = {
            event, listener,
            once: options?.once,
            id: ++this._guid,
        };
        // add the listener
        if (options?.prepend) this._listeners.unshift(data);
        else this._listeners.push(data);
        // return listener id
        return data.id;
    }
    /**
     * Removes an event listener
     * @param id The id returned by the {@link Events.addEventListener} method
     * @returns {boolean} Whether the listener was successfully removed
     */
    public removeEventListener(id: number): boolean {
        const idx = this._listeners.findIndex(v => v.id == id);
        if (idx == -1) return false;
        this._listeners.splice(idx, 1);
        return true;
    }
    /**
     * Dispatches an event with custom arguments
     * @param event The event name of the event you want to emit
     * @param args Additional arguments to fire for the event
     */
    public dispatchEvent<K extends keyof T>(event: K, ...args: T[K]): void;
    public dispatchEvent<S extends string | symbol>(event: Exclude<S, keyof T>, ...args: any[]): void;
    public dispatchEvent(event: string | symbol, ...args: any[]): void {
        for (const listener of this._listeners) {
            if (listener.event != event) continue;
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
    /**
     * Listen for events
     * @param event
     * @param listener
     * @returns {number}
     */
    public on<K extends keyof T>(event: K, listener: (...args: T[K]) => void): number;
    public on<S extends string | symbol>(event: Exclude<S, keyof T>, listener: (...args: any[]) => void): number;
    public on(event: string | symbol, listener: (...args: any) => void): number {
        return this.addEventListener(event, listener);
    }
    /**
     * Listen for events once
     * @param event
     * @param listener
     * @returns {number}
     */
    public once<K extends keyof T>(event: K, listener: (...args: T[K]) => void): number;
    public once<S extends string | symbol>(event: Exclude<S, keyof T>, listener: (...args: any[]) => void): number;
    public once(event: string | symbol, listener: (...args: any) => void): number {
        return this.addEventListener(event, listener, { once: true });
    }
    /**
     * Listen for events and make it execute first from other first listeners
     * @param event
     * @param listener
     * @returns {number}
     */
    public prependListener<K extends keyof T>(event: K, listener: (...args: T[K]) => void): number;
    public prependListener<S extends string | symbol>(event: Exclude<S, keyof T>, listener: (...args: any[]) => void): number;
    public prependListener(event: string | symbol, listener: (...args: any) => void): number {
        return this.addEventListener(event, listener, { prepend: true });
    }
    /**
     * Listen for events once and make it execute first from other first listeners
     * @param event
     * @param listener
     * @returns {number}
     */
    public prependOnceListener<K extends keyof T>(event: K, listener: (...args: T[K]) => void): number;
    public prependOnceListener<S extends string | symbol>(event: Exclude<S, keyof T>, listener: (...args: any[]) => void): number;
    public prependOnceListener(event: string | symbol, listener: (...args: any) => void): number {
        return this.addEventListener(event, listener, { once: true, prepend: true });
    }
    /**
     * Stop a listener from listening in an event. Alias of {@link Events.removeEventListener }
     * @returns {boolean}
     */
    public off(id: number): boolean {
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
