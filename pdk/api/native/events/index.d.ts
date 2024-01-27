/**
 * Additional options for the listener
 */
export interface ListeningOptions {
    /**
     * Whether to execute the event once
     */
    once?: boolean;
    /**
     * Whether to make the listener execute first from other listeners
     */
    prepend?: boolean;
}
/**
 * Main class for handling events.
 */
export declare class Events<T extends {
    [event: string | symbol]: any[];
} = {}> {
    /**
     * @private
     */
    private _listeners;
    private _guid;
    /**
     * Adds a new event listener
     * @param event The event to listen for
     * @param listener The function to execute
     * @param options Additional options for the listener
     * @returns {number} ID of the listener
     */
    addEventListener<K extends keyof T>(event: K, listener: (...args: T[K]) => void, options?: ListeningOptions): number;
    addEventListener<S extends string | symbol>(event: Exclude<S, keyof T>, listener: (...args: any[]) => void, options?: ListeningOptions): number;
    /**
     * Removes an event listener
     * @param id The id returned by the {@link Events.addEventListener} method
     * @returns {boolean} Whether the listener was successfully removed
     */
    removeEventListener(id: number): boolean;
    /**
     * Dispatches an event with custom arguments
     * @param event The event name of the event you want to emit
     * @param args Additional arguments to fire for the event
     */
    dispatchEvent<K extends keyof T>(event: K, ...args: T[K]): void;
    dispatchEvent<S extends string | symbol>(event: Exclude<S, keyof T>, ...args: any[]): void;
    /**
     * Listen for events
     * @param event
     * @param listener
     * @returns {number}
     */
    on<K extends keyof T>(event: K, listener: (...args: T[K]) => void): number;
    on<S extends string | symbol>(event: Exclude<S, keyof T>, listener: (...args: any[]) => void): number;
    /**
     * Listen for events once
     * @param event
     * @param listener
     * @returns {number}
     */
    once<K extends keyof T>(event: K, listener: (...args: T[K]) => void): number;
    once<S extends string | symbol>(event: Exclude<S, keyof T>, listener: (...args: any[]) => void): number;
    /**
     * Listen for events and make it execute first from other first listeners
     * @param event
     * @param listener
     * @returns {number}
     */
    prependListener<K extends keyof T>(event: K, listener: (...args: T[K]) => void): number;
    prependListener<S extends string | symbol>(event: Exclude<S, keyof T>, listener: (...args: any[]) => void): number;
    /**
     * Listen for events once and make it execute first from other first listeners
     * @param event
     * @param listener
     * @returns {number}
     */
    prependOnceListener<K extends keyof T>(event: K, listener: (...args: T[K]) => void): number;
    prependOnceListener<S extends string | symbol>(event: Exclude<S, keyof T>, listener: (...args: any[]) => void): number;
    /**
     * Stop a listener from listening in an event. Alias of {@link Events.removeEventListener }
     * @returns {boolean}
     */
    off(id: number): boolean;
}
export declare const main: Events<import("./minecraft.js").MinecraftEventList>;
