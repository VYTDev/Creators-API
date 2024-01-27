/**
 * Main versioning class
 */
export declare class Version {
    /**
     * Creates a new version instance.
     * @param ver The version string to compile
     * @throws This can throw errors
     */
    constructor(ver: string);
    /**
     * Major version
     */
    major: number;
    /**
     * Minor version
     */
    minor: number;
    /**
     * Patch version
     */
    patch: number;
    /**
     * Pre-release version
     */
    pre: (string | number)[];
    /**
     * Build metadata
     */
    build: string[];
    /**
     * Check if this version is technically greater than other
     * @param other Other version instance to compare
     * @returns {boolean}
     */
    gt(other: Version): boolean;
    /**
     * Check if this version is technically less than other
     * @param other Other version instance to compare
     * @returns {boolean}
     */
    lt(other: Version): boolean;
    /**
     * Check if this version and other are the same
     * @param other Other version instance to compare
     * @returns {boolean}
     */
    eq(other: Version): boolean;
    /**
     * Check if this version is technically greater than or equal to other
     * @param other Other version instance to compare
     * @returns {boolean}
     */
    gte(other: Version): boolean;
    /**
     * Check if this version is technically less than or equal to other
     * @param other Other version instance to compare
     * @returns {boolean}
     */
    lte(other: Version): boolean;
    /**
     * Returns a string representation of this version
     * @returns {string}
     */
    toString(): string;
}
/**
 * Version expression
 */
export declare class Expression {
    /**
     * Initialize a new version expression instance
     * @param expr The expression to compile
     * @throws This can throw errors
     */
    constructor(expr: string);
    /**
     * @private
     */
    private _compiled;
    private _expr;
    /**
     * Test if a version satisfies this expression
     * @param ver The version to test
     * @returns {boolean}
     */
    test(ver: Version): boolean;
    /**
     * Find the latest version that satisfies this expression
     * @param vers A list of Version object
     * @returns {Version}
     */
    latest(vers: Version[]): Version;
    /**
     * Find the oldest version that satisfies this expression
     * @param vers A list of Version object
     * @returns {Version}
     */
    oldest(vers: Version[]): Version;
    /**
     * Returns a string representation of this expression
     * @returns {string}
     */
    toString(): string;
}
