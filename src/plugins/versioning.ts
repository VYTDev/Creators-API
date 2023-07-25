// Simple versioning system for plugins
// Based on npm package 'semver' <https://github.com/npm/node-semver>

// semantic versioning: (see semver.org)
const semver = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

/**
 * @internal
 * Compare pre-release tag of a version
 * @param a first Version.pre
 * @param b second Version.pre
 * @returns {number} -1 if a is higher, 0 if same, 1 if b is higher
 */
function comparePre(a: (string | number)[], b: (string | number)[]): -1 | 0 | 1 {
    // both are empty
    if (!a.length && !b.length) return 0;
    // one of them are empty
    if (!a.length) return -1;
    if (!b.length) return 1;
    
    // iterate over a and b
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) {
        const first = a[i];
        const second = b[i];
        
        // no one left
        if (typeof first == "undefined") return 1;
        if (typeof second == "undefined") return -1;
        
        // check if these are number
        const firstNum = typeof first == "number";
        const secondNum = typeof second == "number";
        
        // check if one of these are number
        if (firstNum && !secondNum) return 1;
        if (!firstNum && secondNum) return -1;
        
        // numerically or lexicallly check
        if (a < b) return 1;
        if (a > b) return -1;
    }
    // a and b are the same
    return 0;
}

/**
 * Main versioning class
 */
export class Version {
    /**
     * Creates a new version instance.
     * @param ver The version string to compile
     * @throws This can throw errors
     */
    constructor(ver: string) {
        // match the version string
        const match = ver.match(semver);
        
        // failed to match
        if (!match)
            throw `unexpected version string: ${ver}`;
        
        // process numbers
        this.major = +match[1];
        this.minor = +match[2];
        this.patch = +match[3];
        
        if (isNaN(this.major) || isNaN(this.minor) || isNaN(this.patch))
            throw `major.minor.patch must be a number`;
        
        // process pre release
        this.pre = match[4]?.split(".").map(v => {
            const n = +v;
            if (typeof n == "number" && n >= 0)
                return n;
            return v;
        }) || [];
        
        // build metadata
        this.build = match[5]?.split(".") || [];
    }
    /**
     * Major version
     */
    public major: number;
    /**
     * Minor version
     */
    public minor: number;
    /**
     * Patch version
     */
    public patch: number;
    /**
     * Pre-release version
     */
    public pre: (string | number)[];
    /**
     * Build metadata
     */
    public build: string[];
    /**
     * Check if this version is technically greater than other
     * @param other Other version instance to compare
     * @returns {boolean}
     */
    public gt(other: Version): boolean {
        if (
            (this.major > other.major) ||
            (this.major == other.major && this.minor > other.minor) ||
            (this.major == other.major && this.minor == other.minor && this.patch > other.patch) ||
            (this.major == other.major && this.minor == other.minor && this.patch == other.patch && comparePre(this.pre, other.pre) == -1)
        ) return true;
        return false;
    }
    /**
     * Check if this version is technically less than other
     * @param other Other version instance to compare
     * @returns {boolean}
     */
    public lt(other: Version): boolean {
        if (
            (this.major < other.major) ||
            (this.major == other.major && this.minor < other.minor) ||
            (this.major == other.major && this.minor == other.minor && this.patch < other.patch) ||
            (this.major == other.major && this.minor == other.minor && this.patch == other.patch && comparePre(this.pre, other.pre) == 1)
        ) return true;
        return false;
    }
    /**
     * Check if this version and other are the same
     * @param other Other version instance to compare
     * @returns {boolean}
     */
    public eq(other: Version): boolean {
        if (
            (this.major == other.major) &&
            (this.minor == other.minor) &&
            (this.patch == other.patch) &&
            (comparePre(this.pre, other.pre) == 0)
        ) return true;
        return false;
    }
    /**
     * Check if this version is technically greater than or equal to other
     * @param other Other version instance to compare
     * @returns {boolean}
     */
    public gte(other: Version): boolean {
        return this.gt(other) || this.eq(other);
    }
    /**
     * Check if this version is technically less than or equal to other
     * @param other Other version instance to compare
     * @returns {boolean}
     */
    public lte(other: Version): boolean {
        return this.lt(other) || this.eq(other);
    }
    /**
     * Returns a string representation of this version
     * @returns {string}
     */
    toString(): string {
        let str = `${this.major}.${this.minor}.${this.patch}`;
        if (this.pre.length) str += "-" + this.pre.join(".");
        if (this.build.length) str += "+" + this.build.join(".");
        return str;
    }
}

const expression = /^([*0xX]|[1-9]\d*)(?:\.([*0xX]|[1-9]\d*)(?:\.([*0xX]|[1-9]\d*))?)?(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

/**
 * Version expression
 */
export class Expression {
    /**
     * Initialize a new version expression instance
     * @param expr The expression to compile
     * @throws This can throw errors
     */
    constructor(expr: string) {
        const comparators = [];
        for (const group of expr.split("||")) {
            const versions = group.trim().split(/\s+/);
            const list = [];
            for (let i = 0; i < versions.length; i++) {
                let ver = versions[i];
                let eq, compare = 0, caret, tilde;
                if ((caret = ver[0] == "^") || (tilde = ver[0] == "~")) {
                    ver = ver.slice(1);
                }
                else {
                    // determine the behaviour of version
                    if (ver[0] == ">") {
                        compare = -1;
                        ver = ver.slice(1);
                    }
                    else if (ver[0] == "<") {
                        compare = 1;
                        ver = ver.slice(1);
                    }
                    // check for possible =
                    if (ver[0] == "=") {
                        eq = true;
                        ver = ver.slice(1);
                    }
                }
                // attempt to match subject version:
                // no version found, maybe its separated with spaces
                if (!ver.length) {
                    if (i == (versions.length - 1))
                        throw `subject version not provided`;
                    i++;
                    ver = versions[i];
                }
                // match expression
                const match = ver.match(expression);
                if (!match)
                    throw `invalid version expression: ${ver}`;
                // process version number
                let major = +match[1], xmajor;
                if (isNaN(major)) xmajor = !(major = null);
                let minor = +match[2], xminor;
                if (isNaN(minor)) xminor = !(minor = null);
                let patch = +match[3], xpatch;
                if (isNaN(patch)) xpatch = !(patch = null);
                const pre = match[4]?.split(".").map(v => {
                    const n = +v;
                    if (typeof n == "number" && n >= 0)
                        return n;
                    return v;
                }) || [];
                // process caret/tilde
                if (tilde) {
                    if (xmajor) return;
                    let omajor, ominor, opatch;
                    if (xminor) {
                        omajor = major + 1;
                        ominor = minor = 0;
                        opatch = patch = 0;
                    }
                    else if (xpatch) {
                        omajor = major;
                        ominor = minor + 1;
                        opatch = patch = 0;
                    }
                    else {
                        omajor = major;
                        ominor = minor + 1;
                        opatch = 0;
                    }
                    list.push({
                        maxrange: true,
                        equal: false,
                        compare: 1,
                        major: omajor,
                        minor: ominor,
                        patch: opatch,
                        pre: [0],
                    })
                }
                // process caret
                else if (caret) {
                    if (xmajor) return;
                    let omajor, ominor, opatch;
                    if (xminor) {
                        omajor = major + 1;
                        ominor = minor = 0;
                        opatch = patch = 0;
                    } else if (xpatch) {
                        omajor = major == 0 ? major : major + 1;
                        ominor = major != 0 ? 0 : minor + 1;
                        opatch = patch = 0;
                    } else {
                        omajor = major == 0 ? 0 : major + 1;
                        ominor = major == 0 ? minor == 0 ? minor : minor + 1 : 0;
                        opatch = (major == 0 && minor == 0) ? patch + 1 : 0;
                    }
                    list.push({
                        maxrange: true,
                        equal: false,
                        compare: 1,
                        major: omajor,
                        minor: ominor,
                        patch: opatch,
                        pre: [0],
                    });
                }
                // smart checking on *, x, or X
                if (!eq && compare == 0 && (xmajor || xminor || xpatch))
                    compare = -1;
                // new comparator subject
                list.push({
                    equal: eq || compare == 0 || caret || tilde,
                    compare: (caret || tilde) ? -1 : compare,
                    major: major,
                    minor: minor,
                    patch: patch,
                    pre: pre,
                });
            };
            comparators.push(list);
        }
        this._compiled = comparators;
        this._expr = expr.split(/\s+/).join(" ");
    }
    /**
     * @private
     */
    private _compiled: {
        maxrange?: boolean,
        equal: boolean,
        compare: number,
        major: number | null,
        minor: number | null,
        patch: number | null,
        pre: (string | number)[],
    }[][];
    private _expr: string;
    /**
     * Test if a version satisfies this expression
     * @param ver The version to test
     * @returns {boolean}
     */
    public test(ver: Version): boolean {
        for (const comparator of this._compiled) {
            let succed = true;
            for (const subj of comparator) {
                let tmp = false;
                // match major, minor, or patch
                const matchedMajor = typeof subj.major != "number" || (ver.major == subj.major);
                const matchedMinor = typeof subj.minor != "number" || (ver.minor == subj.minor);
                const matchedPatch = typeof subj.patch != "number" || (ver.patch == subj.patch);
                // major, minor, and patch matched
                const eqNormal = matchedMajor && matchedMinor && matchedPatch;
                // check equal
                if (subj.equal) {
                    tmp = eqNormal && comparePre(subj.pre, ver.pre) == 0;
                }
                // check gt or lt
                // Logic:
                //   If subject version has pre-release tag, the major, minor, and patch
                //   fields of testing version must be equal to the major, minor, and
                //   patch fields of the subject version, or the testing version must
                //   have no pre-release tag. But if the subject version don't have a
                //   pre-release tag, testing version must also don't have a pre-release
                //   tag.
                // Example:
                //   '1.0.1-beta' will satisfy '>1.0.1-alpha' but not '>1.0.0-alpha'
                //   '1.0.1' will satisfy both '>1.0.1-alpha' and '>1.0.0-alpha'
                //   '1.0.1-beta' will not satisfy '>1.0.0'
                // This behaviour are implemented based on the npm package 'semver'
                // Note:  An asterisk or a 'x' can alter this behaviour
                if (!tmp && (subj.maxrange || !ver.pre.length || (subj.pre.length && eqNormal))) {
                    // test less than
                    if (subj.compare == -1) {
                        tmp = (ver.major > subj.major)
                            || (matchedMajor && ver.minor > subj.minor)
                            || (matchedMajor && matchedMinor && ver.patch > subj.patch)
                            || (matchedMajor && matchedMinor && matchedPatch && comparePre(ver.pre, subj.pre) == -1);
                    }
                    // test greater than
                    else if (subj.compare == 1) {
                        tmp = (ver.major < subj.major)
                            || (matchedMajor && ver.minor < subj.minor)
                            || (matchedMajor && matchedMinor && ver.patch < subj.patch)
                            || (matchedMajor && matchedMinor && matchedPatch && comparePre(ver.pre, subj.pre) == 1);
                    }
                }
                // subject test failed
                if (!tmp) {
                    succed = false;
                    break;
                }
            }
            // comparator succeded
            if (succed)
                return succed;
        }
        return false;
    }
    /**
     * Find the latest version that satisfies this expression
     * @param vers A list of Version object
     * @returns {Version}
     */
    public latest(vers: Version[]): Version {
        // filter version lists first
        vers = vers.filter(v => this.test(v));
        // find max
        let max = vers[0];
        for (const version of vers.slice(1))
            if (version.gt(max))
                max = version;
        return max;
    }
    /**
     * Find the oldest version that satisfies this expression
     * @param vers A list of Version object
     * @returns {Version}
     */
    public oldest(vers: Version[]): Version {
        // filter version list first
        vers = vers.filter(v => this.test(v));
        // find min
        let min = vers[0];
        for (const version of vers.slice(1))
            if (version.lt(min))
                min = version;
        return min;
    }
    /**
     * Returns a string representation of this expression
     * @returns {string}
     */
    toString(): string {
        return this._expr;
    }
}
