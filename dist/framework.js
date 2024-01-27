var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// dist/generated/index.js
var generated_exports = {};
__export(generated_exports, {
  config: () => config_exports,
  default: () => generated_default,
  events: () => events_exports,
  plugins: () => plugins_exports,
  util: () => util_exports,
  version: () => version
});

// dist/generated/config.js
var config_exports = {};
__export(config_exports, {
  Config: () => Config,
  default: () => config_default
});
var Config = class {
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
};
var config = new Config({
  debug: true
});
var config_default = config;

// dist/generated/util.js
var util_exports = {};
__export(util_exports, {
  debug: () => debug,
  normalizePath: () => normalizePath,
  resolvePath: () => resolvePath
});
function debug(...msg) {
  if (config_exports.default.get("debug"))
    console.warn("[creators-api]", ...msg);
}
function normalizePath(path) {
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
  return output.filter((v) => v.length).join("/");
}
function resolvePath(start, target, isfile) {
  if (target[0] == "/")
    return normalizePath(target);
  const result = normalizePath(start).split("/");
  if (isfile)
    result.pop();
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
  return result.filter((v) => v.length).join("/");
}

// dist/generated/plugins/index.js
var plugins_exports = {};
__export(plugins_exports, {
  Expression: () => Expression,
  Loader: () => Loader,
  Module: () => Module,
  Plugin: () => Plugin,
  Version: () => Version,
  global: () => global
});

// dist/generated/plugins/versioning.js
var semver = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
function comparePre(a, b) {
  if (!a.length && !b.length)
    return 0;
  if (!a.length)
    return -1;
  if (!b.length)
    return 1;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const first = a[i];
    const second = b[i];
    if (typeof first == "undefined")
      return 1;
    if (typeof second == "undefined")
      return -1;
    const firstNum = typeof first == "number";
    const secondNum = typeof second == "number";
    if (firstNum && !secondNum)
      return 1;
    if (!firstNum && secondNum)
      return -1;
    if (a < b)
      return 1;
    if (a > b)
      return -1;
  }
  return 0;
}
var Version = class {
  /**
   * Creates a new version instance.
   * @param ver The version string to compile
   * @throws This can throw errors
   */
  constructor(ver) {
    ver = ver.trim();
    const match = ver.match(semver);
    if (!match)
      throw `unexpected version string: ${ver}`;
    this.major = +match[1];
    this.minor = +match[2];
    this.patch = +match[3];
    if (isNaN(this.major) || isNaN(this.minor) || isNaN(this.patch))
      throw `major.minor.patch must be a number`;
    this.pre = match[4]?.split(".").map((v) => {
      const n = +v;
      if (typeof n == "number" && n >= 0)
        return n;
      return v;
    }) || [];
    this.build = match[5]?.split(".") || [];
  }
  /**
   * Check if this version is technically greater than other
   * @param other Other version instance to compare
   * @returns {boolean}
   */
  gt(other) {
    if (this.major > other.major || this.major == other.major && this.minor > other.minor || this.major == other.major && this.minor == other.minor && this.patch > other.patch || this.major == other.major && this.minor == other.minor && this.patch == other.patch && comparePre(this.pre, other.pre) == -1)
      return true;
    return false;
  }
  /**
   * Check if this version is technically less than other
   * @param other Other version instance to compare
   * @returns {boolean}
   */
  lt(other) {
    if (this.major < other.major || this.major == other.major && this.minor < other.minor || this.major == other.major && this.minor == other.minor && this.patch < other.patch || this.major == other.major && this.minor == other.minor && this.patch == other.patch && comparePre(this.pre, other.pre) == 1)
      return true;
    return false;
  }
  /**
   * Check if this version and other are the same
   * @param other Other version instance to compare
   * @returns {boolean}
   */
  eq(other) {
    if (this.major == other.major && this.minor == other.minor && this.patch == other.patch && comparePre(this.pre, other.pre) == 0)
      return true;
    return false;
  }
  /**
   * Check if this version is technically greater than or equal to other
   * @param other Other version instance to compare
   * @returns {boolean}
   */
  gte(other) {
    return this.gt(other) || this.eq(other);
  }
  /**
   * Check if this version is technically less than or equal to other
   * @param other Other version instance to compare
   * @returns {boolean}
   */
  lte(other) {
    return this.lt(other) || this.eq(other);
  }
  /**
   * Returns a string representation of this version
   * @returns {string}
   */
  toString() {
    let str = `${this.major}.${this.minor}.${this.patch}`;
    if (this.pre.length)
      str += "-" + this.pre.join(".");
    if (this.build.length)
      str += "+" + this.build.join(".");
    return str;
  }
};
var expression = /^([*0xX]|[1-9]\d*)(?:\.([*0xX]|[1-9]\d*)(?:\.([*0xX]|[1-9]\d*))?)?(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
var Expression = class {
  /**
   * Initialize a new version expression instance
   * @param expr The expression to compile
   * @throws This can throw errors
   */
  constructor(expr) {
    const comparators = [];
    for (const group of expr.split("||")) {
      const versions = group.trim().split(/\s+/);
      const list = [];
      for (let i = 0; i < versions.length; i++) {
        let ver = versions[i];
        let eq, compare = 0, caret, tilde;
        if ((caret = ver[0] == "^") || (tilde = ver[0] == "~")) {
          ver = ver.slice(1);
        } else {
          if (ver[0] == ">") {
            compare = -1;
            ver = ver.slice(1);
          } else if (ver[0] == "<") {
            compare = 1;
            ver = ver.slice(1);
          }
          if (ver[0] == "=") {
            eq = true;
            ver = ver.slice(1);
          }
        }
        if (!ver.length) {
          if (i == versions.length - 1)
            throw `subject version not provided`;
          i++;
          ver = versions[i];
        }
        const match = ver.match(expression);
        if (!match)
          throw `invalid version expression: ${ver}`;
        let major = +match[1], xmajor;
        if (isNaN(major))
          xmajor = !(major = null);
        let minor = +match[2], xminor;
        if (isNaN(minor))
          xminor = !(minor = null);
        let patch = +match[3], xpatch;
        if (isNaN(patch))
          xpatch = !(patch = null);
        const pre = match[4]?.split(".").map((v) => {
          const n = +v;
          if (typeof n == "number" && n >= 0)
            return n;
          return v;
        }) || [];
        if (tilde) {
          if (xmajor)
            continue;
          let omajor, ominor, opatch;
          if (xminor) {
            omajor = major + 1;
            ominor = minor = 0;
            opatch = patch = 0;
          } else if (xpatch) {
            omajor = major;
            ominor = minor + 1;
            opatch = patch = 0;
          } else {
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
            pre: [0]
          });
        } else if (caret) {
          if (xmajor)
            continue;
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
            opatch = major == 0 && minor == 0 ? patch + 1 : 0;
          }
          list.push({
            maxrange: true,
            equal: false,
            compare: 1,
            major: omajor,
            minor: ominor,
            patch: opatch,
            pre: [0]
          });
        }
        if (!eq && compare == 0 && (xmajor || xminor || xpatch))
          compare = -1;
        list.push({
          equal: eq || compare == 0 || caret || tilde,
          compare: caret || tilde ? -1 : compare,
          major,
          minor,
          patch,
          pre
        });
      }
      comparators.push(list);
    }
    this._compiled = comparators;
    this._expr = expr.split(/\s+/).join(" ");
  }
  /**
   * Test if a version satisfies this expression
   * @param ver The version to test
   * @returns {boolean}
   */
  test(ver) {
    for (const comparator of this._compiled) {
      let succed = true;
      for (const subj of comparator) {
        let tmp = false;
        const matchedMajor = typeof subj.major != "number" || ver.major == subj.major;
        const matchedMinor = typeof subj.minor != "number" || ver.minor == subj.minor;
        const matchedPatch = typeof subj.patch != "number" || ver.patch == subj.patch;
        const eqNormal = matchedMajor && matchedMinor && matchedPatch;
        if (subj.equal) {
          tmp = eqNormal && comparePre(subj.pre, ver.pre) == 0;
        }
        if (!tmp && (subj.maxrange || !ver.pre.length || subj.pre.length && eqNormal)) {
          if (subj.compare == -1) {
            tmp = ver.major > subj.major || matchedMajor && ver.minor > subj.minor || matchedMajor && matchedMinor && ver.patch > subj.patch || matchedMajor && matchedMinor && matchedPatch && comparePre(ver.pre, subj.pre) == -1;
          } else if (subj.compare == 1) {
            tmp = ver.major < subj.major || matchedMajor && ver.minor < subj.minor || matchedMajor && matchedMinor && ver.patch < subj.patch || matchedMajor && matchedMinor && matchedPatch && comparePre(ver.pre, subj.pre) == 1;
          }
        }
        if (!tmp) {
          succed = false;
          break;
        }
      }
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
  latest(vers) {
    vers = vers.filter((v) => this.test(v));
    let max = vers[0];
    for (const version2 of vers.slice(1))
      if (version2.gt(max))
        max = version2;
    return max;
  }
  /**
   * Find the oldest version that satisfies this expression
   * @param vers A list of Version object
   * @returns {Version}
   */
  oldest(vers) {
    vers = vers.filter((v) => this.test(v));
    let min = vers[0];
    for (const version2 of vers.slice(1))
      if (version2.lt(min))
        min = version2;
    return min;
  }
  /**
   * Returns a string representation of this expression
   * @returns {string}
   */
  toString() {
    return this._expr;
  }
};

// dist/generated/plugins/loader.js
var global = globalThis;
var Module = class {
  /**
   * Create a new module
   */
  constructor(path, loader, callback) {
    this.exports = {};
    this._loaded = false;
    this._ran = false;
    this.children = [];
    this.loader = loader;
    this.action = callback;
    this.path = util_exports.normalizePath(path);
    const parts = path.split("/");
    this.filename = parts[parts.length - 1];
    this.require = (path2) => {
      const baseloc = util_exports.resolvePath(this.path, path2, true);
      const paths = [
        baseloc,
        baseloc + ".js",
        baseloc + "/index.js"
      ];
      let target;
      for (const p of paths) {
        if (!(target = loader.modules[p])) {
          target = loader.modules[p];
          continue;
        }
        break;
      }
      if (!target && !/^.{0,2}\//.test(path2)) {
        path2 = util_exports.normalizePath(path2);
        const pluginName = path2.split("/", 1)[0];
        const moduleName = path2.slice(pluginName.length + 1);
        const plugin = loader.libs[pluginName];
        if (moduleName.length) {
          target = plugin?.loader.modules[moduleName];
        } else {
          target = plugin?.loader.modules[plugin.entry];
        }
      }
      if (!target)
        throw `Couldn't resolve module specifier: ${path2}`;
      if (!this.children.includes(target))
        this.children.push(target);
      return target.run();
    };
  }
  /**
   * Whether the module is fully-loaded
   */
  get loaded() {
    return this._loaded;
  }
  /**
   * Whether the module is ran before (use cached exports instead)
   */
  get ran() {
    return this._ran;
  }
  /**
   * Starts the module
   * @returns {Exports}
   */
  run() {
    if (!this._ran) {
      this._ran = true;
      this.action.call(this.loader.plugin, this.loader.intent, this.require, this, this.exports, global);
      this._loaded = true;
    }
    return this.exports;
  }
  /**
   * Reset the module
   */
  reset() {
    if (this._ran) {
      if (!this._loaded)
        throw "Illegal invocation";
      this.exports = {};
      this._ran = false;
      this._loaded = false;
      this.children = [];
    }
  }
};
var Loader = class {
  /**
   * Initialize a new loader instance. Must only be called by the plugin constructor.
   * @param plugin Plugin instance where this loader works for
   * @param modules Package containing scripts (or technically functions)
   */
  constructor(plugin, modules) {
    this.plugin = plugin;
    this.modules = {};
    for (const path in modules) {
      this.modules[path] = new Module(path, this, modules[path]);
    }
  }
  /**
   * Start the loader operation
   * @param libs The dependencies
   * @param intent Optional additional parameters to pass
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  start(libs, intent) {
    this.libs = libs;
    this.intent = intent;
    this._running = true;
    const val = this.modules[this.plugin.entry].run();
    this._loaded = true;
    return val;
  }
  /**
   * Reset the loader
   * @throws This can throw errors
   */
  reset() {
    if (this._running) {
      if (!this._loaded)
        throw "Modules failed to terminate";
      this.libs = {};
      this.intent = [];
      for (const mod in this.modules)
        this.modules[mod].reset();
    }
  }
};

// dist/generated/plugins/index.js
var registry = {};
var Plugin = class {
  /**
   * Creates a plugin instance
   * @param manifest Information about the plugin
   * @param scripts An object containing functions
   */
  constructor(manifest, scripts) {
    this.manifest = manifest;
    this.id = manifest.id;
    this.name = manifest.name || this.id;
    this.version = new Version(manifest.version);
    this.engine = new Expression(manifest.engine || ">=*-0");
    this.entry = manifest.entry ? util_exports.normalizePath(manifest.entry) : "index.js";
    this.dependencies = {};
    for (const dep in manifest.dependencies || {}) {
      this.dependencies[dep] = new Expression(manifest.dependencies[dep]);
    }
    this.loader = new Loader(this, scripts);
  }
  /**
   * Installs this plugin to the registry
   * @returns {this}
   * @throws This can throw errors
   */
  register() {
    if (!this.engine.test(version)) {
      util_exports.debug(`Plugin "${this.name}" (${this.id}) failed to install with errors`);
      util_exports.debug(`Plugin "${this.id}" requires Creators\u2019 API engine version '${this.engine}' but ${version} were installed`);
      throw `incompatible api version: ${version}`;
    }
    (registry[this.id] || (registry[this.id] = [])).push(this);
    return this;
  }
  /**
   * Launch this plugin
   * @param intent Optional arguments to pass to the plugin
   * @returns {Exports}
   * @throws This can throw errors
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  start(...intent) {
    const libs = {};
    for (const dep in this.dependencies) {
      const expr = this.dependencies[dep];
      const collection = registry[dep];
      if (!collection)
        throw `Plugin '${this.id}' dependencies an unknown lib '${dep}'. Do you installed the lib?`;
      const versions = [];
      collection.forEach((v) => versions.push(v.version));
      const latest = expr.latest(versions);
      if (!latest)
        throw `Plugin '${this.id}' dependencies an unknown version of lib '${dep}': ${expr}`;
      libs[dep] = collection.find((v) => v.version.eq(latest));
    }
    return this.loader.start(libs, intent || []);
  }
  /**
   * Resets the plugin (we can't clear the cache)
   * @returns {this}
   * @throws This can throw errors
   */
  stop() {
    this.loader.reset();
    return this;
  }
};

// dist/generated/native/events/index.js
var events_exports = {};
__export(events_exports, {
  Events: () => Events,
  main: () => main
});

// dist/generated/native/events/minecraft.js
import * as mc from "@minecraft/server";
var handler = new Events();
mc.world.beforeEvents.chatSend.subscribe((ev) => handler.dispatchEvent("beforeChatSend", ev));
mc.world.beforeEvents.dataDrivenEntityTriggerEvent.subscribe((ev) => handler.dispatchEvent("beforeDataDrivenEntityTrigger", ev));
mc.world.beforeEvents.explosion.subscribe((ev) => handler.dispatchEvent("beforeExplosion", ev));
mc.world.beforeEvents.itemDefinitionEvent.subscribe((ev) => handler.dispatchEvent("beforeItemDefinition", ev));
mc.world.beforeEvents.itemUse.subscribe((ev) => handler.dispatchEvent("beforeItemUse", ev));
mc.world.beforeEvents.itemUseOn.subscribe((ev) => handler.dispatchEvent("beforeItemUseOn", ev));
mc.world.beforeEvents.pistonActivate.subscribe((ev) => handler.dispatchEvent("beforePistonActivate", ev));
mc.world.afterEvents.blockBreak.subscribe((ev) => handler.dispatchEvent("afterBlockBreak", ev));
mc.world.afterEvents.blockExplode.subscribe((ev) => handler.dispatchEvent("afterBlockExplode", ev));
mc.world.afterEvents.blockPlace.subscribe((ev) => handler.dispatchEvent("afterBlockPlace", ev));
mc.world.afterEvents.buttonPush.subscribe((ev) => handler.dispatchEvent("afterButtonPush", ev));
mc.world.afterEvents.chatSend.subscribe((ev) => handler.dispatchEvent("afterChatSend", ev));
mc.world.afterEvents.dataDrivenEntityTriggerEvent.subscribe((ev) => handler.dispatchEvent("afterDataDrivenEntityTrigger", ev));
mc.world.afterEvents.effectAdd.subscribe((ev) => handler.dispatchEvent("afterEffectAdd", ev));
mc.world.afterEvents.entityDie.subscribe((ev) => handler.dispatchEvent("afterEntityDie", ev));
mc.world.afterEvents.entityHealthChanged.subscribe((ev) => handler.dispatchEvent("afterEntityHealthChanged", ev));
mc.world.afterEvents.entityHitBlock.subscribe((ev) => handler.dispatchEvent("afterEntityHitBlock", ev));
mc.world.afterEvents.entityHitEntity.subscribe((ev) => handler.dispatchEvent("afterEntityHitEntity", ev));
mc.world.afterEvents.entityHurt.subscribe((ev) => handler.dispatchEvent("afterEntityHurt", ev));
mc.world.afterEvents.entityRemoved.subscribe((ev) => handler.dispatchEvent("afterEntityRemoved", ev));
mc.world.afterEvents.entitySpawn.subscribe((ev) => handler.dispatchEvent("afterEntitySpawn", ev));
mc.world.afterEvents.explosion.subscribe((ev) => handler.dispatchEvent("afterExplosion", ev));
mc.world.afterEvents.itemCompleteUse.subscribe((ev) => handler.dispatchEvent("afterItemCompleteUse", ev));
mc.world.afterEvents.itemDefinitionEvent.subscribe((ev) => handler.dispatchEvent("afterItemDefinition", ev));
mc.world.afterEvents.itemReleaseUse.subscribe((ev) => handler.dispatchEvent("afterItemReleaseUse", ev));
mc.world.afterEvents.itemStartUse.subscribe((ev) => handler.dispatchEvent("afterItemStartUse", ev));
mc.world.afterEvents.itemStartUseOn.subscribe((ev) => handler.dispatchEvent("afterItemStartUseOn", ev));
mc.world.afterEvents.itemStopUse.subscribe((ev) => handler.dispatchEvent("afterItemStopUse", ev));
mc.world.afterEvents.itemStopUseOn.subscribe((ev) => handler.dispatchEvent("afterItemStopUseOn", ev));
mc.world.afterEvents.itemUse.subscribe((ev) => handler.dispatchEvent("afterItemUse", ev));
mc.world.afterEvents.itemUseOn.subscribe((ev) => handler.dispatchEvent("afterItemUseOn", ev));
mc.world.afterEvents.leverAction.subscribe((ev) => handler.dispatchEvent("afterLeverAction", ev));
mc.world.afterEvents.messageReceive.subscribe((ev) => handler.dispatchEvent("afterMessageReceive", ev));
mc.world.afterEvents.pistonActivate.subscribe((ev) => handler.dispatchEvent("afterPistonActivate", ev));
mc.world.afterEvents.playerJoin.subscribe((ev) => handler.dispatchEvent("afterPlayerJoin", ev));
mc.world.afterEvents.playerLeave.subscribe((ev) => handler.dispatchEvent("afterPlayerLeave", ev));
mc.world.afterEvents.playerSpawn.subscribe((ev) => handler.dispatchEvent("afterPlayerSpawn", ev));
mc.world.afterEvents.pressurePlatePop.subscribe((ev) => handler.dispatchEvent("afterPressurePlatePop", ev));
mc.world.afterEvents.pressurePlatePush.subscribe((ev) => handler.dispatchEvent("afterPressurePlatePush", ev));
mc.world.afterEvents.projectileHitBlock.subscribe((ev) => handler.dispatchEvent("afterProjectileHitBlock", ev));
mc.world.afterEvents.projectileHitEntity.subscribe((ev) => handler.dispatchEvent("afterProjectileHitEntity", ev));
mc.world.afterEvents.targetBlockHit.subscribe((ev) => handler.dispatchEvent("afterTargetBlockHit", ev));
mc.world.afterEvents.tripWireTrip.subscribe((ev) => handler.dispatchEvent("afterTripWireTrip", ev));
mc.world.afterEvents.weatherChange.subscribe((ev) => handler.dispatchEvent("afterWeatherChange", ev));
mc.world.afterEvents.worldInitialize.subscribe((ev) => handler.dispatchEvent("afterWorldInitialize", ev));
mc.system.beforeEvents.watchdogTerminate.subscribe((ev) => handler.dispatchEvent("beforeWatchdogTerminate", ev));
mc.system.afterEvents.scriptEventReceive.subscribe((ev) => handler.dispatchEvent("afterScriptEventReceive", ev));

// dist/generated/native/events/index.js
var Events = class {
  constructor() {
    this._listeners = [];
    this._guid = 0;
  }
  addEventListener(event, listener, options) {
    const data = {
      event,
      listener,
      once: options?.once,
      id: ++this._guid
    };
    if (options?.prepend)
      this._listeners.unshift(data);
    else
      this._listeners.push(data);
    return data.id;
  }
  /**
   * Removes an event listener
   * @param id The id returned by the {@link Events.addEventListener} method
   * @returns {boolean} Whether the listener was successfully removed
   */
  removeEventListener(id) {
    const idx = this._listeners.findIndex((v) => v.id == id);
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
      } catch {
      }
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
};
var main = handler;
new Plugin({
  id: "events",
  version: "1.0.0"
}, {
  "index.js": (intent, require2, module, exports) => {
    exports.Events = Events;
    exports.main = handler;
  },
  "minecraft.js": (intent, require2, module, exports) => {
    exports.handler = handler;
  }
}).register();

// dist/generated/native/index.js
import * as mc2 from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
new Plugin({
  id: "@minecraft",
  version: "1.0.0",
  name: "Minecraft Scripts",
  engine: "*",
  author: "Minecraft"
}, {
  "index.js": (intent, require2, module, exports) => {
    exports["server"] = require2("./server");
    exports["server-ui"] = require2("./server-ui");
  },
  "server/index.js": (intent, require2, module) => {
    module.exports = mc2;
  },
  "server-ui/index.js": (intent, require2, module) => {
    module.exports = ui;
  }
}).register();

// dist/generated/index.js
var version = new Version("0.2.0");
var generated_default = generated_exports;
globalThis.creator = generated_exports;
export {
  config_exports as config,
  generated_default as default,
  events_exports as events,
  plugins_exports as plugins,
  util_exports as util,
  version
};
