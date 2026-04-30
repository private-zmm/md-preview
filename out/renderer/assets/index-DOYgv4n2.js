/**
* @vue/shared v3.5.33
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function makeMap(str) {
  const map2 = /* @__PURE__ */ Object.create(null);
  for (const key of str.split(",")) map2[key] = 1;
  return (val) => val in map2;
}
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i2 = arr.indexOf(el);
  if (i2 > -1) {
    arr.splice(i2, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isDate = (val) => toTypeString(val) === "[object Date]";
const isFunction$1 = (val) => typeof val === "function";
const isString$2 = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject$1 = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return (isObject$1(val) || isFunction$1(val)) && isFunction$1(val.then) && isFunction$1(val.catch);
};
const objectToString$1 = Object.prototype.toString;
const toTypeString = (value) => objectToString$1.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString$2(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return ((str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  });
};
const camelizeRE = /-\w/g;
const camelize = cacheStringFunction(
  (str) => {
    return str.replace(camelizeRE, (c2) => c2.slice(1).toUpperCase());
  }
);
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction(
  (str) => {
    const s2 = str ? `on${capitalize(str)}` : ``;
    return s2;
  }
);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, ...arg) => {
  for (let i2 = 0; i2 < fns.length; i2++) {
    fns[i2](...arg);
  }
};
const def = (obj, key, value, writable = false) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    writable,
    value
  });
};
const looseToNumber = (val) => {
  const n2 = parseFloat(val);
  return isNaN(n2) ? val : n2;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i2 = 0; i2 < value.length; i2++) {
      const item = value[i2];
      const normalized = isString$2(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString$2(value) || isObject$1(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString$2(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i2 = 0; i2 < value.length; i2++) {
      const normalized = normalizeClass(value[i2]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject$1(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
function looseCompareArrays(a2, b2) {
  if (a2.length !== b2.length) return false;
  let equal = true;
  for (let i2 = 0; equal && i2 < a2.length; i2++) {
    equal = looseEqual(a2[i2], b2[i2]);
  }
  return equal;
}
function looseEqual(a2, b2) {
  if (a2 === b2) return true;
  let aValidType = isDate(a2);
  let bValidType = isDate(b2);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a2.getTime() === b2.getTime() : false;
  }
  aValidType = isSymbol(a2);
  bValidType = isSymbol(b2);
  if (aValidType || bValidType) {
    return a2 === b2;
  }
  aValidType = isArray(a2);
  bValidType = isArray(b2);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareArrays(a2, b2) : false;
  }
  aValidType = isObject$1(a2);
  bValidType = isObject$1(b2);
  if (aValidType || bValidType) {
    if (!aValidType || !bValidType) {
      return false;
    }
    const aKeysCount = Object.keys(a2).length;
    const bKeysCount = Object.keys(b2).length;
    if (aKeysCount !== bKeysCount) {
      return false;
    }
    for (const key in a2) {
      const aHasKey = a2.hasOwnProperty(key);
      const bHasKey = b2.hasOwnProperty(key);
      if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a2[key], b2[key])) {
        return false;
      }
    }
  }
  return String(a2) === String(b2);
}
function looseIndexOf(arr, val) {
  return arr.findIndex((item) => looseEqual(item, val));
}
const isRef$1 = (val) => {
  return !!(val && val["__v_isRef"] === true);
};
const toDisplayString = (val) => {
  return isString$2(val) ? val : val == null ? "" : isArray(val) || isObject$1(val) && (val.toString === objectToString$1 || !isFunction$1(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (isRef$1(val)) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce(
        (entries2, [key, val2], i2) => {
          entries2[stringifySymbol(key, i2) + " =>"] = val2;
          return entries2;
        },
        {}
      )
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()].map((v2) => stringifySymbol(v2))
    };
  } else if (isSymbol(val)) {
    return stringifySymbol(val);
  } else if (isObject$1(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const stringifySymbol = (v2, i2 = "") => {
  var _a2;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    isSymbol(v2) ? `Symbol(${(_a2 = v2.description) != null ? _a2 : i2})` : v2
  );
};
/**
* @vue/reactivity v3.5.33
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let activeEffectScope;
class EffectScope {
  // TODO isolatedDeclarations "__v_skip"
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this._on = 0;
    this.effects = [];
    this.cleanups = [];
    this._isPaused = false;
    this.__v_skip = true;
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = true;
      let i2, l2;
      if (this.scopes) {
        for (i2 = 0, l2 = this.scopes.length; i2 < l2; i2++) {
          this.scopes[i2].pause();
        }
      }
      for (i2 = 0, l2 = this.effects.length; i2 < l2; i2++) {
        this.effects[i2].pause();
      }
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active) {
      if (this._isPaused) {
        this._isPaused = false;
        let i2, l2;
        if (this.scopes) {
          for (i2 = 0, l2 = this.scopes.length; i2 < l2; i2++) {
            this.scopes[i2].resume();
          }
        }
        for (i2 = 0, l2 = this.effects.length; i2 < l2; i2++) {
          this.effects[i2].resume();
        }
      }
    }
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    if (++this._on === 1) {
      this.prevScope = activeEffectScope;
      activeEffectScope = this;
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    if (this._on > 0 && --this._on === 0) {
      if (activeEffectScope === this) {
        activeEffectScope = this.prevScope;
      } else {
        let current = activeEffectScope;
        while (current) {
          if (current.prevScope === this) {
            current.prevScope = this.prevScope;
            break;
          }
          current = current.prevScope;
        }
      }
      this.prevScope = void 0;
    }
  }
  stop(fromParent) {
    if (this._active) {
      this._active = false;
      let i2, l2;
      for (i2 = 0, l2 = this.effects.length; i2 < l2; i2++) {
        this.effects[i2].stop();
      }
      this.effects.length = 0;
      for (i2 = 0, l2 = this.cleanups.length; i2 < l2; i2++) {
        this.cleanups[i2]();
      }
      this.cleanups.length = 0;
      if (this.scopes) {
        for (i2 = 0, l2 = this.scopes.length; i2 < l2; i2++) {
          this.scopes[i2].stop(true);
        }
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
    }
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
let activeSub;
const pausedQueueEffects = /* @__PURE__ */ new WeakSet();
class ReactiveEffect {
  constructor(fn) {
    this.fn = fn;
    this.deps = void 0;
    this.depsTail = void 0;
    this.flags = 1 | 4;
    this.next = void 0;
    this.cleanup = void 0;
    this.scheduler = void 0;
    if (activeEffectScope && activeEffectScope.active) {
      activeEffectScope.effects.push(this);
    }
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    if (this.flags & 64) {
      this.flags &= -65;
      if (pausedQueueEffects.has(this)) {
        pausedQueueEffects.delete(this);
        this.trigger();
      }
    }
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags & 2 && !(this.flags & 32)) {
      return;
    }
    if (!(this.flags & 8)) {
      batch(this);
    }
  }
  run() {
    if (!(this.flags & 1)) {
      return this.fn();
    }
    this.flags |= 2;
    cleanupEffect(this);
    prepareDeps(this);
    const prevEffect = activeSub;
    const prevShouldTrack = shouldTrack;
    activeSub = this;
    shouldTrack = true;
    try {
      return this.fn();
    } finally {
      cleanupDeps(this);
      activeSub = prevEffect;
      shouldTrack = prevShouldTrack;
      this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let link2 = this.deps; link2; link2 = link2.nextDep) {
        removeSub(link2);
      }
      this.deps = this.depsTail = void 0;
      cleanupEffect(this);
      this.onStop && this.onStop();
      this.flags &= -2;
    }
  }
  trigger() {
    if (this.flags & 64) {
      pausedQueueEffects.add(this);
    } else if (this.scheduler) {
      this.scheduler();
    } else {
      this.runIfDirty();
    }
  }
  /**
   * @internal
   */
  runIfDirty() {
    if (isDirty(this)) {
      this.run();
    }
  }
  get dirty() {
    return isDirty(this);
  }
}
let batchDepth = 0;
let batchedSub;
let batchedComputed;
function batch(sub, isComputed = false) {
  sub.flags |= 8;
  if (isComputed) {
    sub.next = batchedComputed;
    batchedComputed = sub;
    return;
  }
  sub.next = batchedSub;
  batchedSub = sub;
}
function startBatch() {
  batchDepth++;
}
function endBatch() {
  if (--batchDepth > 0) {
    return;
  }
  if (batchedComputed) {
    let e2 = batchedComputed;
    batchedComputed = void 0;
    while (e2) {
      const next = e2.next;
      e2.next = void 0;
      e2.flags &= -9;
      e2 = next;
    }
  }
  let error2;
  while (batchedSub) {
    let e2 = batchedSub;
    batchedSub = void 0;
    while (e2) {
      const next = e2.next;
      e2.next = void 0;
      e2.flags &= -9;
      if (e2.flags & 1) {
        try {
          ;
          e2.trigger();
        } catch (err) {
          if (!error2) error2 = err;
        }
      }
      e2 = next;
    }
  }
  if (error2) throw error2;
}
function prepareDeps(sub) {
  for (let link2 = sub.deps; link2; link2 = link2.nextDep) {
    link2.version = -1;
    link2.prevActiveLink = link2.dep.activeLink;
    link2.dep.activeLink = link2;
  }
}
function cleanupDeps(sub) {
  let head;
  let tail = sub.depsTail;
  let link2 = tail;
  while (link2) {
    const prev = link2.prevDep;
    if (link2.version === -1) {
      if (link2 === tail) tail = prev;
      removeSub(link2);
      removeDep(link2);
    } else {
      head = link2;
    }
    link2.dep.activeLink = link2.prevActiveLink;
    link2.prevActiveLink = void 0;
    link2 = prev;
  }
  sub.deps = head;
  sub.depsTail = tail;
}
function isDirty(sub) {
  for (let link2 = sub.deps; link2; link2 = link2.nextDep) {
    if (link2.dep.version !== link2.version || link2.dep.computed && (refreshComputed(link2.dep.computed) || link2.dep.version !== link2.version)) {
      return true;
    }
  }
  if (sub._dirty) {
    return true;
  }
  return false;
}
function refreshComputed(computed2) {
  if (computed2.flags & 4 && !(computed2.flags & 16)) {
    return;
  }
  computed2.flags &= -17;
  if (computed2.globalVersion === globalVersion) {
    return;
  }
  computed2.globalVersion = globalVersion;
  if (!computed2.isSSR && computed2.flags & 128 && (!computed2.deps && !computed2._dirty || !isDirty(computed2))) {
    return;
  }
  computed2.flags |= 2;
  const dep = computed2.dep;
  const prevSub = activeSub;
  const prevShouldTrack = shouldTrack;
  activeSub = computed2;
  shouldTrack = true;
  try {
    prepareDeps(computed2);
    const value = computed2.fn(computed2._value);
    if (dep.version === 0 || hasChanged(value, computed2._value)) {
      computed2.flags |= 128;
      computed2._value = value;
      dep.version++;
    }
  } catch (err) {
    dep.version++;
    throw err;
  } finally {
    activeSub = prevSub;
    shouldTrack = prevShouldTrack;
    cleanupDeps(computed2);
    computed2.flags &= -3;
  }
}
function removeSub(link2, soft = false) {
  const { dep, prevSub, nextSub } = link2;
  if (prevSub) {
    prevSub.nextSub = nextSub;
    link2.prevSub = void 0;
  }
  if (nextSub) {
    nextSub.prevSub = prevSub;
    link2.nextSub = void 0;
  }
  if (dep.subs === link2) {
    dep.subs = prevSub;
    if (!prevSub && dep.computed) {
      dep.computed.flags &= -5;
      for (let l2 = dep.computed.deps; l2; l2 = l2.nextDep) {
        removeSub(l2, true);
      }
    }
  }
  if (!soft && !--dep.sc && dep.map) {
    dep.map.delete(dep.key);
  }
}
function removeDep(link2) {
  const { prevDep, nextDep } = link2;
  if (prevDep) {
    prevDep.nextDep = nextDep;
    link2.prevDep = void 0;
  }
  if (nextDep) {
    nextDep.prevDep = prevDep;
    link2.nextDep = void 0;
  }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function cleanupEffect(e2) {
  const { cleanup } = e2;
  e2.cleanup = void 0;
  if (cleanup) {
    const prevSub = activeSub;
    activeSub = void 0;
    try {
      cleanup();
    } finally {
      activeSub = prevSub;
    }
  }
}
let globalVersion = 0;
class Link {
  constructor(sub, dep) {
    this.sub = sub;
    this.dep = dep;
    this.version = dep.version;
    this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Dep {
  // TODO isolatedDeclarations "__v_skip"
  constructor(computed2) {
    this.computed = computed2;
    this.version = 0;
    this.activeLink = void 0;
    this.subs = void 0;
    this.map = void 0;
    this.key = void 0;
    this.sc = 0;
    this.__v_skip = true;
  }
  track(debugInfo) {
    if (!activeSub || !shouldTrack || activeSub === this.computed) {
      return;
    }
    let link2 = this.activeLink;
    if (link2 === void 0 || link2.sub !== activeSub) {
      link2 = this.activeLink = new Link(activeSub, this);
      if (!activeSub.deps) {
        activeSub.deps = activeSub.depsTail = link2;
      } else {
        link2.prevDep = activeSub.depsTail;
        activeSub.depsTail.nextDep = link2;
        activeSub.depsTail = link2;
      }
      addSub(link2);
    } else if (link2.version === -1) {
      link2.version = this.version;
      if (link2.nextDep) {
        const next = link2.nextDep;
        next.prevDep = link2.prevDep;
        if (link2.prevDep) {
          link2.prevDep.nextDep = next;
        }
        link2.prevDep = activeSub.depsTail;
        link2.nextDep = void 0;
        activeSub.depsTail.nextDep = link2;
        activeSub.depsTail = link2;
        if (activeSub.deps === link2) {
          activeSub.deps = next;
        }
      }
    }
    return link2;
  }
  trigger(debugInfo) {
    this.version++;
    globalVersion++;
    this.notify(debugInfo);
  }
  notify(debugInfo) {
    startBatch();
    try {
      if (false) ;
      for (let link2 = this.subs; link2; link2 = link2.prevSub) {
        if (link2.sub.notify()) {
          ;
          link2.sub.dep.notify();
        }
      }
    } finally {
      endBatch();
    }
  }
}
function addSub(link2) {
  link2.dep.sc++;
  if (link2.sub.flags & 4) {
    const computed2 = link2.dep.computed;
    if (computed2 && !link2.dep.subs) {
      computed2.flags |= 4 | 16;
      for (let l2 = computed2.deps; l2; l2 = l2.nextDep) {
        addSub(l2);
      }
    }
    const currentTail = link2.dep.subs;
    if (currentTail !== link2) {
      link2.prevSub = currentTail;
      if (currentTail) currentTail.nextSub = link2;
    }
    link2.dep.subs = link2;
  }
}
const targetMap = /* @__PURE__ */ new WeakMap();
const ITERATE_KEY = /* @__PURE__ */ Symbol(
  ""
);
const MAP_KEY_ITERATE_KEY = /* @__PURE__ */ Symbol(
  ""
);
const ARRAY_ITERATE_KEY = /* @__PURE__ */ Symbol(
  ""
);
function track(target, type, key) {
  if (shouldTrack && activeSub) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = new Dep());
      dep.map = depsMap;
      dep.key = key;
    }
    {
      dep.track();
    }
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    globalVersion++;
    return;
  }
  const run = (dep) => {
    if (dep) {
      {
        dep.trigger();
      }
    }
  };
  startBatch();
  if (type === "clear") {
    depsMap.forEach(run);
  } else {
    const targetIsArray = isArray(target);
    const isArrayIndex = targetIsArray && isIntegerKey(key);
    if (targetIsArray && key === "length") {
      const newLength = Number(newValue);
      depsMap.forEach((dep, key2) => {
        if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) {
          run(dep);
        }
      });
    } else {
      if (key !== void 0 || depsMap.has(void 0)) {
        run(depsMap.get(key));
      }
      if (isArrayIndex) {
        run(depsMap.get(ARRAY_ITERATE_KEY));
      }
      switch (type) {
        case "add":
          if (!targetIsArray) {
            run(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              run(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          } else if (isArrayIndex) {
            run(depsMap.get("length"));
          }
          break;
        case "delete":
          if (!targetIsArray) {
            run(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              run(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          }
          break;
        case "set":
          if (isMap(target)) {
            run(depsMap.get(ITERATE_KEY));
          }
          break;
      }
    }
  }
  endBatch();
}
function reactiveReadArray(array) {
  const raw = /* @__PURE__ */ toRaw(array);
  if (raw === array) return raw;
  track(raw, "iterate", ARRAY_ITERATE_KEY);
  return /* @__PURE__ */ isShallow(array) ? raw : raw.map(toReactive);
}
function shallowReadArray(arr) {
  track(arr = /* @__PURE__ */ toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
  return arr;
}
function toWrapped(target, item) {
  if (/* @__PURE__ */ isReadonly(target)) {
    return /* @__PURE__ */ isReactive(target) ? toReadonly(toReactive(item)) : toReadonly(item);
  }
  return toReactive(item);
}
const arrayInstrumentations = {
  __proto__: null,
  [Symbol.iterator]() {
    return iterator(this, Symbol.iterator, (item) => toWrapped(this, item));
  },
  concat(...args) {
    return reactiveReadArray(this).concat(
      ...args.map((x2) => isArray(x2) ? reactiveReadArray(x2) : x2)
    );
  },
  entries() {
    return iterator(this, "entries", (value) => {
      value[1] = toWrapped(this, value[1]);
      return value;
    });
  },
  every(fn, thisArg) {
    return apply$1(this, "every", fn, thisArg, void 0, arguments);
  },
  filter(fn, thisArg) {
    return apply$1(
      this,
      "filter",
      fn,
      thisArg,
      (v2) => v2.map((item) => toWrapped(this, item)),
      arguments
    );
  },
  find(fn, thisArg) {
    return apply$1(
      this,
      "find",
      fn,
      thisArg,
      (item) => toWrapped(this, item),
      arguments
    );
  },
  findIndex(fn, thisArg) {
    return apply$1(this, "findIndex", fn, thisArg, void 0, arguments);
  },
  findLast(fn, thisArg) {
    return apply$1(
      this,
      "findLast",
      fn,
      thisArg,
      (item) => toWrapped(this, item),
      arguments
    );
  },
  findLastIndex(fn, thisArg) {
    return apply$1(this, "findLastIndex", fn, thisArg, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(fn, thisArg) {
    return apply$1(this, "forEach", fn, thisArg, void 0, arguments);
  },
  includes(...args) {
    return searchProxy(this, "includes", args);
  },
  indexOf(...args) {
    return searchProxy(this, "indexOf", args);
  },
  join(separator) {
    return reactiveReadArray(this).join(separator);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...args) {
    return searchProxy(this, "lastIndexOf", args);
  },
  map(fn, thisArg) {
    return apply$1(this, "map", fn, thisArg, void 0, arguments);
  },
  pop() {
    return noTracking(this, "pop");
  },
  push(...args) {
    return noTracking(this, "push", args);
  },
  reduce(fn, ...args) {
    return reduce(this, "reduce", fn, args);
  },
  reduceRight(fn, ...args) {
    return reduce(this, "reduceRight", fn, args);
  },
  shift() {
    return noTracking(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(fn, thisArg) {
    return apply$1(this, "some", fn, thisArg, void 0, arguments);
  },
  splice(...args) {
    return noTracking(this, "splice", args);
  },
  toReversed() {
    return reactiveReadArray(this).toReversed();
  },
  toSorted(comparer) {
    return reactiveReadArray(this).toSorted(comparer);
  },
  toSpliced(...args) {
    return reactiveReadArray(this).toSpliced(...args);
  },
  unshift(...args) {
    return noTracking(this, "unshift", args);
  },
  values() {
    return iterator(this, "values", (item) => toWrapped(this, item));
  }
};
function iterator(self2, method, wrapValue) {
  const arr = shallowReadArray(self2);
  const iter = arr[method]();
  if (arr !== self2 && !/* @__PURE__ */ isShallow(self2)) {
    iter._next = iter.next;
    iter.next = () => {
      const result = iter._next();
      if (!result.done) {
        result.value = wrapValue(result.value);
      }
      return result;
    };
  }
  return iter;
}
const arrayProto = Array.prototype;
function apply$1(self2, method, fn, thisArg, wrappedRetFn, args) {
  const arr = shallowReadArray(self2);
  const needsWrap = arr !== self2 && !/* @__PURE__ */ isShallow(self2);
  const methodFn = arr[method];
  if (methodFn !== arrayProto[method]) {
    const result2 = methodFn.apply(self2, args);
    return needsWrap ? toReactive(result2) : result2;
  }
  let wrappedFn = fn;
  if (arr !== self2) {
    if (needsWrap) {
      wrappedFn = function(item, index) {
        return fn.call(this, toWrapped(self2, item), index, self2);
      };
    } else if (fn.length > 2) {
      wrappedFn = function(item, index) {
        return fn.call(this, item, index, self2);
      };
    }
  }
  const result = methodFn.call(arr, wrappedFn, thisArg);
  return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
}
function reduce(self2, method, fn, args) {
  const arr = shallowReadArray(self2);
  const needsWrap = arr !== self2 && !/* @__PURE__ */ isShallow(self2);
  let wrappedFn = fn;
  let wrapInitialAccumulator = false;
  if (arr !== self2) {
    if (needsWrap) {
      wrapInitialAccumulator = args.length === 0;
      wrappedFn = function(acc, item, index) {
        if (wrapInitialAccumulator) {
          wrapInitialAccumulator = false;
          acc = toWrapped(self2, acc);
        }
        return fn.call(this, acc, toWrapped(self2, item), index, self2);
      };
    } else if (fn.length > 3) {
      wrappedFn = function(acc, item, index) {
        return fn.call(this, acc, item, index, self2);
      };
    }
  }
  const result = arr[method](wrappedFn, ...args);
  return wrapInitialAccumulator ? toWrapped(self2, result) : result;
}
function searchProxy(self2, method, args) {
  const arr = /* @__PURE__ */ toRaw(self2);
  track(arr, "iterate", ARRAY_ITERATE_KEY);
  const res = arr[method](...args);
  if ((res === -1 || res === false) && /* @__PURE__ */ isProxy(args[0])) {
    args[0] = /* @__PURE__ */ toRaw(args[0]);
    return arr[method](...args);
  }
  return res;
}
function noTracking(self2, method, args = []) {
  pauseTracking();
  startBatch();
  const res = (/* @__PURE__ */ toRaw(self2))[method].apply(self2, args);
  endBatch();
  resetTracking();
  return res;
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
function hasOwnProperty(key) {
  if (!isSymbol(key)) key = String(key);
  const obj = /* @__PURE__ */ toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
class BaseReactiveHandler {
  constructor(_isReadonly = false, _isShallow = false) {
    this._isReadonly = _isReadonly;
    this._isShallow = _isShallow;
  }
  get(target, key, receiver) {
    if (key === "__v_skip") return target["__v_skip"];
    const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return isShallow2;
    } else if (key === "__v_raw") {
      if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
        return target;
      }
      return;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly2) {
      let fn;
      if (targetIsArray && (fn = arrayInstrumentations[key])) {
        return fn;
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(
      target,
      key,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ isRef(target) ? target : receiver
    );
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (isShallow2) {
      return res;
    }
    if (/* @__PURE__ */ isRef(res)) {
      const value = targetIsArray && isIntegerKey(key) ? res : res.value;
      return isReadonly2 && isObject$1(value) ? /* @__PURE__ */ readonly(value) : value;
    }
    if (isObject$1(res)) {
      return isReadonly2 ? /* @__PURE__ */ readonly(res) : /* @__PURE__ */ reactive(res);
    }
    return res;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(false, isShallow2);
  }
  set(target, key, value, receiver) {
    let oldValue = target[key];
    const isArrayWithIntegerKey = isArray(target) && isIntegerKey(key);
    if (!this._isShallow) {
      const isOldValueReadonly = /* @__PURE__ */ isReadonly(oldValue);
      if (!/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value)) {
        oldValue = /* @__PURE__ */ toRaw(oldValue);
        value = /* @__PURE__ */ toRaw(value);
      }
      if (!isArrayWithIntegerKey && /* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value)) {
        if (isOldValueReadonly) {
          return true;
        } else {
          oldValue.value = value;
          return true;
        }
      }
    }
    const hadKey = isArrayWithIntegerKey ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(
      target,
      key,
      value,
      /* @__PURE__ */ isRef(target) ? target : receiver
    );
    if (target === /* @__PURE__ */ toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  }
  deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0);
    }
    return result;
  }
  has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  ownKeys(target) {
    track(
      target,
      "iterate",
      isArray(target) ? "length" : ITERATE_KEY
    );
    return Reflect.ownKeys(target);
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(true, isShallow2);
  }
  set(target, key) {
    return true;
  }
  deleteProperty(target, key) {
    return true;
  }
}
const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(true);
const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
const toShallow = (value) => value;
const getProto = (v2) => Reflect.getPrototypeOf(v2);
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = /* @__PURE__ */ toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return extend(
      // inheriting all iterator properties
      Object.create(innerIterator),
      {
        // iterator protocol
        next() {
          const { value, done } = innerIterator.next();
          return done ? { value, done } : {
            value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
            done
          };
        }
      }
    );
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : type === "clear" ? void 0 : this;
  };
}
function createInstrumentations(readonly2, shallow) {
  const instrumentations = {
    get(key) {
      const target = this["__v_raw"];
      const rawTarget = /* @__PURE__ */ toRaw(target);
      const rawKey = /* @__PURE__ */ toRaw(key);
      if (!readonly2) {
        if (hasChanged(key, rawKey)) {
          track(rawTarget, "get", key);
        }
        track(rawTarget, "get", rawKey);
      }
      const { has: has2 } = getProto(rawTarget);
      const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
      if (has2.call(rawTarget, key)) {
        return wrap(target.get(key));
      } else if (has2.call(rawTarget, rawKey)) {
        return wrap(target.get(rawKey));
      } else if (target !== rawTarget) {
        target.get(key);
      }
    },
    get size() {
      const target = this["__v_raw"];
      !readonly2 && track(/* @__PURE__ */ toRaw(target), "iterate", ITERATE_KEY);
      return target.size;
    },
    has(key) {
      const target = this["__v_raw"];
      const rawTarget = /* @__PURE__ */ toRaw(target);
      const rawKey = /* @__PURE__ */ toRaw(key);
      if (!readonly2) {
        if (hasChanged(key, rawKey)) {
          track(rawTarget, "has", key);
        }
        track(rawTarget, "has", rawKey);
      }
      return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
    },
    forEach(callback, thisArg) {
      const observed = this;
      const target = observed["__v_raw"];
      const rawTarget = /* @__PURE__ */ toRaw(target);
      const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
      !readonly2 && track(rawTarget, "iterate", ITERATE_KEY);
      return target.forEach((value, key) => {
        return callback.call(thisArg, wrap(value), wrap(key), observed);
      });
    }
  };
  extend(
    instrumentations,
    readonly2 ? {
      add: createReadonlyMethod("add"),
      set: createReadonlyMethod("set"),
      delete: createReadonlyMethod("delete"),
      clear: createReadonlyMethod("clear")
    } : {
      add(value) {
        const target = /* @__PURE__ */ toRaw(this);
        const proto = getProto(target);
        const rawValue = /* @__PURE__ */ toRaw(value);
        const valueToAdd = !shallow && !/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value) ? rawValue : value;
        const hadKey = proto.has.call(target, valueToAdd) || hasChanged(value, valueToAdd) && proto.has.call(target, value) || hasChanged(rawValue, valueToAdd) && proto.has.call(target, rawValue);
        if (!hadKey) {
          target.add(valueToAdd);
          trigger(target, "add", valueToAdd, valueToAdd);
        }
        return this;
      },
      set(key, value) {
        if (!shallow && !/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value)) {
          value = /* @__PURE__ */ toRaw(value);
        }
        const target = /* @__PURE__ */ toRaw(this);
        const { has: has2, get } = getProto(target);
        let hadKey = has2.call(target, key);
        if (!hadKey) {
          key = /* @__PURE__ */ toRaw(key);
          hadKey = has2.call(target, key);
        }
        const oldValue = get.call(target, key);
        target.set(key, value);
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value);
        }
        return this;
      },
      delete(key) {
        const target = /* @__PURE__ */ toRaw(this);
        const { has: has2, get } = getProto(target);
        let hadKey = has2.call(target, key);
        if (!hadKey) {
          key = /* @__PURE__ */ toRaw(key);
          hadKey = has2.call(target, key);
        }
        get ? get.call(target, key) : void 0;
        const result = target.delete(key);
        if (hadKey) {
          trigger(target, "delete", key, void 0);
        }
        return result;
      },
      clear() {
        const target = /* @__PURE__ */ toRaw(this);
        const hadItems = target.size !== 0;
        const result = target.clear();
        if (hadItems) {
          trigger(
            target,
            "clear",
            void 0,
            void 0
          );
        }
        return result;
      }
    }
  );
  const iteratorMethods = [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ];
  iteratorMethods.forEach((method) => {
    instrumentations[method] = createIterableMethod(method, readonly2, shallow);
  });
  return instrumentations;
}
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = createInstrumentations(isReadonly2, shallow);
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
// @__NO_SIDE_EFFECTS__
function reactive(target) {
  if (/* @__PURE__ */ isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
// @__NO_SIDE_EFFECTS__
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
// @__NO_SIDE_EFFECTS__
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
// @__NO_SIDE_EFFECTS__
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject$1(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
// @__NO_SIDE_EFFECTS__
function isReactive(value) {
  if (/* @__PURE__ */ isReadonly(value)) {
    return /* @__PURE__ */ isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
// @__NO_SIDE_EFFECTS__
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
// @__NO_SIDE_EFFECTS__
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
// @__NO_SIDE_EFFECTS__
function isProxy(value) {
  return value ? !!value["__v_raw"] : false;
}
// @__NO_SIDE_EFFECTS__
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? /* @__PURE__ */ toRaw(raw) : observed;
}
function markRaw(value) {
  if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) {
    def(value, "__v_skip", true);
  }
  return value;
}
const toReactive = (value) => isObject$1(value) ? /* @__PURE__ */ reactive(value) : value;
const toReadonly = (value) => isObject$1(value) ? /* @__PURE__ */ readonly(value) : value;
// @__NO_SIDE_EFFECTS__
function isRef(r2) {
  return r2 ? r2["__v_isRef"] === true : false;
}
// @__NO_SIDE_EFFECTS__
function ref(value) {
  return createRef(value, false);
}
function createRef(rawValue, shallow) {
  if (/* @__PURE__ */ isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, isShallow2) {
    this.dep = new Dep();
    this["__v_isRef"] = true;
    this["__v_isShallow"] = false;
    this._rawValue = isShallow2 ? value : /* @__PURE__ */ toRaw(value);
    this._value = isShallow2 ? value : toReactive(value);
    this["__v_isShallow"] = isShallow2;
  }
  get value() {
    {
      this.dep.track();
    }
    return this._value;
  }
  set value(newValue) {
    const oldValue = this._rawValue;
    const useDirectValue = this["__v_isShallow"] || /* @__PURE__ */ isShallow(newValue) || /* @__PURE__ */ isReadonly(newValue);
    newValue = useDirectValue ? newValue : /* @__PURE__ */ toRaw(newValue);
    if (hasChanged(newValue, oldValue)) {
      this._rawValue = newValue;
      this._value = useDirectValue ? newValue : toReactive(newValue);
      {
        this.dep.trigger();
      }
    }
  }
}
function unref(ref2) {
  return /* @__PURE__ */ isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (/* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return /* @__PURE__ */ isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
class CustomRefImpl {
  constructor(factory) {
    this["__v_isRef"] = true;
    this._value = void 0;
    const dep = this.dep = new Dep();
    const { get, set: set2 } = factory(dep.track.bind(dep), dep.trigger.bind(dep));
    this._get = get;
    this._set = set2;
  }
  get value() {
    return this._value = this._get();
  }
  set value(newVal) {
    this._set(newVal);
  }
}
function customRef(factory) {
  return new CustomRefImpl(factory);
}
class ComputedRefImpl {
  constructor(fn, setter, isSSR) {
    this.fn = fn;
    this.setter = setter;
    this._value = void 0;
    this.dep = new Dep(this);
    this.__v_isRef = true;
    this.deps = void 0;
    this.depsTail = void 0;
    this.flags = 16;
    this.globalVersion = globalVersion - 1;
    this.next = void 0;
    this.effect = this;
    this["__v_isReadonly"] = !setter;
    this.isSSR = isSSR;
  }
  /**
   * @internal
   */
  notify() {
    this.flags |= 16;
    if (!(this.flags & 8) && // avoid infinite self recursion
    activeSub !== this) {
      batch(this, true);
      return true;
    }
  }
  get value() {
    const link2 = this.dep.track();
    refreshComputed(this);
    if (link2) {
      link2.version = this.dep.version;
    }
    return this._value;
  }
  set value(newValue) {
    if (this.setter) {
      this.setter(newValue);
    }
  }
}
// @__NO_SIDE_EFFECTS__
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  if (isFunction$1(getterOrOptions)) {
    getter = getterOrOptions;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, isSSR);
  return cRef;
}
const INITIAL_WATCHER_VALUE = {};
const cleanupMap = /* @__PURE__ */ new WeakMap();
let activeWatcher = void 0;
function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
  if (owner) {
    let cleanups = cleanupMap.get(owner);
    if (!cleanups) cleanupMap.set(owner, cleanups = []);
    cleanups.push(cleanupFn);
  }
}
function watch$1(source, cb, options = EMPTY_OBJ) {
  const { immediate, deep, once, scheduler, augmentJob, call } = options;
  const reactiveGetter = (source2) => {
    if (deep) return source2;
    if (/* @__PURE__ */ isShallow(source2) || deep === false || deep === 0)
      return traverse(source2, 1);
    return traverse(source2);
  };
  let effect2;
  let getter;
  let cleanup;
  let boundCleanup;
  let forceTrigger = false;
  let isMultiSource = false;
  if (/* @__PURE__ */ isRef(source)) {
    getter = () => source.value;
    forceTrigger = /* @__PURE__ */ isShallow(source);
  } else if (/* @__PURE__ */ isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s2) => /* @__PURE__ */ isReactive(s2) || /* @__PURE__ */ isShallow(s2));
    getter = () => source.map((s2) => {
      if (/* @__PURE__ */ isRef(s2)) {
        return s2.value;
      } else if (/* @__PURE__ */ isReactive(s2)) {
        return reactiveGetter(s2);
      } else if (isFunction$1(s2)) {
        return call ? call(s2, 2) : s2();
      } else ;
    });
  } else if (isFunction$1(source)) {
    if (cb) {
      getter = call ? () => call(source, 2) : source;
    } else {
      getter = () => {
        if (cleanup) {
          pauseTracking();
          try {
            cleanup();
          } finally {
            resetTracking();
          }
        }
        const currentEffect = activeWatcher;
        activeWatcher = effect2;
        try {
          return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
        } finally {
          activeWatcher = currentEffect;
        }
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    const depth = deep === true ? Infinity : deep;
    getter = () => traverse(baseGetter(), depth);
  }
  const scope = getCurrentScope();
  const watchHandle = () => {
    effect2.stop();
    if (scope && scope.active) {
      remove(scope.effects, effect2);
    }
  };
  if (once && cb) {
    const _cb = cb;
    cb = (...args) => {
      _cb(...args);
      watchHandle();
    };
  }
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = (immediateFirstRun) => {
    if (!(effect2.flags & 1) || !effect2.dirty && !immediateFirstRun) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v2, i2) => hasChanged(v2, oldValue[i2])) : hasChanged(newValue, oldValue))) {
        if (cleanup) {
          cleanup();
        }
        const currentWatcher = activeWatcher;
        activeWatcher = effect2;
        try {
          const args = [
            newValue,
            // pass undefined as the old value when it's changed for the first time
            oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
            boundCleanup
          ];
          oldValue = newValue;
          call ? call(cb, 3, args) : (
            // @ts-expect-error
            cb(...args)
          );
        } finally {
          activeWatcher = currentWatcher;
        }
      }
    } else {
      effect2.run();
    }
  };
  if (augmentJob) {
    augmentJob(job);
  }
  effect2 = new ReactiveEffect(getter);
  effect2.scheduler = scheduler ? () => scheduler(job, false) : job;
  boundCleanup = (fn) => onWatcherCleanup(fn, false, effect2);
  cleanup = effect2.onStop = () => {
    const cleanups = cleanupMap.get(effect2);
    if (cleanups) {
      if (call) {
        call(cleanups, 4);
      } else {
        for (const cleanup2 of cleanups) cleanup2();
      }
      cleanupMap.delete(effect2);
    }
  };
  if (cb) {
    if (immediate) {
      job(true);
    } else {
      oldValue = effect2.run();
    }
  } else if (scheduler) {
    scheduler(job.bind(null, true), true);
  } else {
    effect2.run();
  }
  watchHandle.pause = effect2.pause.bind(effect2);
  watchHandle.resume = effect2.resume.bind(effect2);
  watchHandle.stop = watchHandle;
  return watchHandle;
}
function traverse(value, depth = Infinity, seen) {
  if (depth <= 0 || !isObject$1(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Map();
  if ((seen.get(value) || 0) >= depth) {
    return value;
  }
  seen.set(value, depth);
  depth--;
  if (/* @__PURE__ */ isRef(value)) {
    traverse(value.value, depth, seen);
  } else if (isArray(value)) {
    for (let i2 = 0; i2 < value.length; i2++) {
      traverse(value[i2], depth, seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v2) => {
      traverse(v2, depth, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], depth, seen);
    }
    for (const key of Object.getOwnPropertySymbols(value)) {
      if (Object.prototype.propertyIsEnumerable.call(value, key)) {
        traverse(value[key], depth, seen);
      }
    }
  }
  return value;
}
/**
* @vue/runtime-core v3.5.33
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const stack = [];
let isWarning = false;
function warn$1(msg, ...args) {
  if (isWarning) return;
  isWarning = true;
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        // eslint-disable-next-line no-restricted-syntax
        msg + args.map((a2) => {
          var _a2, _b;
          return (_b = (_a2 = a2.toString) == null ? void 0 : _a2.call(a2)) != null ? _b : JSON.stringify(a2);
        }).join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
  isWarning = false;
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i2) => {
    logs.push(...i2 === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString$2(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (/* @__PURE__ */ isRef(value)) {
    value = formatProp(key, /* @__PURE__ */ toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction$1(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = /* @__PURE__ */ toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
function callWithErrorHandling(fn, instance, type, args) {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction$1(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  if (isArray(fn)) {
    const values = [];
    for (let i2 = 0; i2 < fn.length; i2++) {
      values.push(callWithAsyncErrorHandling(fn[i2], instance, type, args));
    }
    return values;
  }
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i2 = 0; i2 < errorCapturedHooks.length; i2++) {
          if (errorCapturedHooks[i2](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    if (errorHandler) {
      pauseTracking();
      callWithErrorHandling(errorHandler, null, 10, [
        err,
        exposedInstance,
        errorInfo
      ]);
      resetTracking();
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev, throwUnhandledErrorInProduction);
}
function logError(err, type, contextVNode, throwInDev = true, throwInProd = false) {
  if (throwInProd) {
    throw err;
  } else {
    console.error(err);
  }
}
const queue = [];
let flushIndex = -1;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id || middleJobId === id && middleJob.flags & 2) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!(job.flags & 1)) {
    const jobId = getId(job);
    const lastJob = queue[queue.length - 1];
    if (!lastJob || // fast path when the job id is larger than the tail
    !(job.flags & 2) && jobId >= getId(lastJob)) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(jobId), 0, job);
    }
    job.flags |= 1;
    queueFlush();
  }
}
function queueFlush() {
  if (!currentFlushPromise) {
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray(cb)) {
    if (activePostFlushCbs && cb.id === -1) {
      activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
    } else if (!(cb.flags & 1)) {
      pendingPostFlushCbs.push(cb);
      cb.flags |= 1;
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(instance, seen, i2 = flushIndex + 1) {
  for (; i2 < queue.length; i2++) {
    const cb = queue[i2];
    if (cb && cb.flags & 2) {
      if (instance && cb.id !== instance.uid) {
        continue;
      }
      queue.splice(i2, 1);
      i2--;
      if (cb.flags & 4) {
        cb.flags &= -2;
      }
      cb();
      if (!(cb.flags & 4)) {
        cb.flags &= -2;
      }
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)].sort(
      (a2, b2) => getId(a2) - getId(b2)
    );
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      const cb = activePostFlushCbs[postFlushIndex];
      if (cb.flags & 4) {
        cb.flags &= -2;
      }
      if (!(cb.flags & 8)) cb();
      cb.flags &= -2;
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
function flushJobs(seen) {
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && !(job.flags & 8)) {
        if (false) ;
        if (job.flags & 4) {
          job.flags &= ~1;
        }
        callWithErrorHandling(
          job,
          job.i,
          job.i ? 15 : 14
        );
        if (!(job.flags & 4)) {
          job.flags &= ~1;
        }
      }
    }
  } finally {
    for (; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job) {
        job.flags &= -2;
      }
    }
    flushIndex = -1;
    queue.length = 0;
    flushPostFlushCbs();
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs();
    }
  }
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx) return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    let res;
    try {
      res = fn(...args);
    } finally {
      setCurrentRenderingInstance(prevInstance);
      if (renderFnWithContext._d) {
        setBlockTracking(1);
      }
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function withDirectives(vnode, directives) {
  if (currentRenderingInstance === null) {
    return vnode;
  }
  const instance = getComponentPublicInstance(currentRenderingInstance);
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i2 = 0; i2 < directives.length; i2++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i2];
    if (dir) {
      if (isFunction$1(dir)) {
        dir = {
          mounted: dir,
          updated: dir
        };
      }
      if (dir.deep) {
        traverse(value);
      }
      bindings.push({
        dir,
        instance,
        value,
        oldValue: void 0,
        arg,
        modifiers
      });
    }
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i2 = 0; i2 < bindings.length; i2++) {
    const binding = bindings[i2];
    if (oldBindings) {
      binding.oldValue = oldBindings[i2].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
function provide(key, value) {
  if (currentInstance) {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = getCurrentInstance();
  if (instance || currentApp) {
    let provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null || instance.ce ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction$1(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else ;
  }
}
const ssrContextKey = /* @__PURE__ */ Symbol.for("v-scx");
const useSSRContext = () => {
  {
    const ctx = inject(ssrContextKey);
    return ctx;
  }
};
function watchSyncEffect(effect2, options) {
  return doWatch(
    effect2,
    null,
    { flush: "sync" }
  );
}
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, options = EMPTY_OBJ) {
  const { immediate, deep, flush, once } = options;
  const baseWatchOptions = extend({}, options);
  const runsImmediately = cb && immediate || !cb && flush !== "post";
  let ssrCleanup;
  if (isInSSRComponentSetup) {
    if (flush === "sync") {
      const ctx = useSSRContext();
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
    } else if (!runsImmediately) {
      const watchStopHandle = () => {
      };
      watchStopHandle.stop = NOOP;
      watchStopHandle.resume = NOOP;
      watchStopHandle.pause = NOOP;
      return watchStopHandle;
    }
  }
  const instance = currentInstance;
  baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
  let isPre = false;
  if (flush === "post") {
    baseWatchOptions.scheduler = (job) => {
      queuePostRenderEffect(job, instance && instance.suspense);
    };
  } else if (flush !== "sync") {
    isPre = true;
    baseWatchOptions.scheduler = (job, isFirstRun) => {
      if (isFirstRun) {
        job();
      } else {
        queueJob(job);
      }
    };
  }
  baseWatchOptions.augmentJob = (job) => {
    if (cb) {
      job.flags |= 4;
    }
    if (isPre) {
      job.flags |= 2;
      if (instance) {
        job.id = instance.uid;
        job.i = instance;
      }
    }
  };
  const watchHandle = watch$1(source, cb, baseWatchOptions);
  if (isInSSRComponentSetup) {
    if (ssrCleanup) {
      ssrCleanup.push(watchHandle);
    } else if (runsImmediately) {
      watchHandle();
    }
  }
  return watchHandle;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString$2(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction$1(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const reset = setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  reset();
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i2 = 0; i2 < segments.length && cur; i2++) {
      cur = cur[segments[i2]];
    }
    return cur;
  };
}
const TeleportEndKey = /* @__PURE__ */ Symbol("_vte");
const isTeleport = (type) => type.__isTeleport;
const leaveCbKey = /* @__PURE__ */ Symbol("_leaveCb");
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    vnode.transition = hooks;
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
function markAsyncBoundary(instance) {
  instance.ids = [instance.ids[0] + instance.ids[2]++ + "-", 0, 0];
}
function isTemplateRefKey(refs, key) {
  let desc;
  return !!((desc = Object.getOwnPropertyDescriptor(refs, key)) && !desc.configurable);
}
const pendingSetRefMap = /* @__PURE__ */ new WeakMap();
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray(rawRef)) {
    rawRef.forEach(
      (r2, i2) => setRef(
        r2,
        oldRawRef && (isArray(oldRawRef) ? oldRawRef[i2] : oldRawRef),
        parentSuspense,
        vnode,
        isUnmount
      )
    );
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) {
      setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
    }
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref3 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  const rawSetupState = /* @__PURE__ */ toRaw(setupState);
  const canSetSetupRef = setupState === EMPTY_OBJ ? NO : (key) => {
    if (isTemplateRefKey(refs, key)) {
      return false;
    }
    return hasOwn(rawSetupState, key);
  };
  const canSetRef = (ref22, key) => {
    if (key && isTemplateRefKey(refs, key)) {
      return false;
    }
    return true;
  };
  if (oldRef != null && oldRef !== ref3) {
    invalidatePendingSetRef(oldRawRef);
    if (isString$2(oldRef)) {
      refs[oldRef] = null;
      if (canSetSetupRef(oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (/* @__PURE__ */ isRef(oldRef)) {
      const oldRawRefAtom = oldRawRef;
      if (canSetRef(oldRef, oldRawRefAtom.k)) {
        oldRef.value = null;
      }
      if (oldRawRefAtom.k) refs[oldRawRefAtom.k] = null;
    }
  }
  if (isFunction$1(ref3)) {
    callWithErrorHandling(ref3, owner, 12, [value, refs]);
  } else {
    const _isString = isString$2(ref3);
    const _isRef = /* @__PURE__ */ isRef(ref3);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? canSetSetupRef(ref3) ? setupState[ref3] : refs[ref3] : canSetRef() || !rawRef.k ? ref3.value : refs[rawRef.k];
          if (isUnmount) {
            isArray(existing) && remove(existing, refValue);
          } else {
            if (!isArray(existing)) {
              if (_isString) {
                refs[ref3] = [refValue];
                if (canSetSetupRef(ref3)) {
                  setupState[ref3] = refs[ref3];
                }
              } else {
                const newVal = [refValue];
                if (canSetRef(ref3, rawRef.k)) {
                  ref3.value = newVal;
                }
                if (rawRef.k) refs[rawRef.k] = newVal;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref3] = value;
          if (canSetSetupRef(ref3)) {
            setupState[ref3] = value;
          }
        } else if (_isRef) {
          if (canSetRef(ref3, rawRef.k)) {
            ref3.value = value;
          }
          if (rawRef.k) refs[rawRef.k] = value;
        } else ;
      };
      if (value) {
        const job = () => {
          doSet();
          pendingSetRefMap.delete(rawRef);
        };
        job.id = -1;
        pendingSetRefMap.set(rawRef, job);
        queuePostRenderEffect(job, parentSuspense);
      } else {
        invalidatePendingSetRef(rawRef);
        doSet();
      }
    }
  }
}
function invalidatePendingSetRef(rawRef) {
  const pendingSetRef = pendingSetRefMap.get(rawRef);
  if (pendingSetRef) {
    pendingSetRef.flags |= 8;
    pendingSetRefMap.delete(rawRef);
  }
}
getGlobalThis().requestIdleCallback || ((cb) => setTimeout(cb, 1));
getGlobalThis().cancelIdleCallback || ((id) => clearTimeout(id));
const isAsyncWrapper = (i2) => !!i2.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      pauseTracking();
      const reset = setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      reset();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => {
  if (!isInSSRComponentSetup || lifecycle === "sp") {
    injectHook(lifecycle, (...args) => hook(...args), target);
  }
};
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook(
  "bu"
);
const onUpdated = createHook("u");
const onBeforeUnmount = createHook(
  "bum"
);
const onUnmounted = createHook("um");
const onServerPrefetch = createHook(
  "sp"
);
const onRenderTriggered = createHook("rtg");
const onRenderTracked = createHook("rtc");
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
const NULL_DYNAMIC_COMPONENT = /* @__PURE__ */ Symbol.for("v-ndc");
function renderList(source, renderItem, cache, index) {
  let ret;
  const cached = cache;
  const sourceIsArray = isArray(source);
  if (sourceIsArray || isString$2(source)) {
    const sourceIsReactiveArray = sourceIsArray && /* @__PURE__ */ isReactive(source);
    let needsWrap = false;
    let isReadonlySource = false;
    if (sourceIsReactiveArray) {
      needsWrap = !/* @__PURE__ */ isShallow(source);
      isReadonlySource = /* @__PURE__ */ isReadonly(source);
      source = shallowReadArray(source);
    }
    ret = new Array(source.length);
    for (let i2 = 0, l2 = source.length; i2 < l2; i2++) {
      ret[i2] = renderItem(
        needsWrap ? isReadonlySource ? toReadonly(toReactive(source[i2])) : toReactive(source[i2]) : source[i2],
        i2,
        void 0,
        cached
      );
    }
  } else if (typeof source === "number") {
    {
      ret = new Array(source);
      for (let i2 = 0; i2 < source; i2++) {
        ret[i2] = renderItem(i2 + 1, i2, void 0, cached);
      }
    }
  } else if (isObject$1(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(
        source,
        (item, i2) => renderItem(item, i2, void 0, cached)
      );
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i2 = 0, l2 = keys.length; i2 < l2; i2++) {
        const key = keys[i2];
        ret[i2] = renderItem(source[key], key, i2, cached);
      }
    }
  } else {
    ret = [];
  }
  return ret;
}
const getPublicInstance = (i2) => {
  if (!i2) return null;
  if (isStatefulComponent(i2)) return getComponentPublicInstance(i2);
  return getPublicInstance(i2.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    $: (i2) => i2,
    $el: (i2) => i2.vnode.el,
    $data: (i2) => i2.data,
    $props: (i2) => i2.props,
    $attrs: (i2) => i2.attrs,
    $slots: (i2) => i2.slots,
    $refs: (i2) => i2.refs,
    $parent: (i2) => getPublicInstance(i2.parent),
    $root: (i2) => getPublicInstance(i2.root),
    $host: (i2) => i2.ce,
    $emit: (i2) => i2.emit,
    $options: (i2) => resolveMergedOptions(i2),
    $forceUpdate: (i2) => i2.f || (i2.f = () => {
      queueJob(i2.update);
    }),
    $nextTick: (i2) => i2.n || (i2.n = nextTick.bind(i2.proxy)),
    $watch: (i2) => instanceWatch.bind(i2)
  })
);
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    if (key === "__v_skip") {
      return true;
    }
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    if (key[0] !== "$") {
      const n2 = accessCache[key];
      if (n2 !== void 0) {
        switch (n2) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (hasOwn(props, key)) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance.attrs, "get", "");
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else ;
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, props, type }
  }, key) {
    let cssModules;
    return !!(accessCache[key] || data !== EMPTY_OBJ && key[0] !== "$" && hasOwn(data, key) || hasSetupBinding(setupState, key) || hasOwn(props, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key) || (cssModules = type.__cssModules) && cssModules[key]);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
function normalizePropsOrEmits(props) {
  return isArray(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
function mergeModels(a2, b2) {
  if (!a2 || !b2) return a2 || b2;
  if (isArray(a2) && isArray(b2)) return a2.concat(b2);
  return extend({}, normalizePropsOrEmits(a2), normalizePropsOrEmits(b2));
}
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction$1(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject$1(data)) ;
    else {
      instance.data = /* @__PURE__ */ reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get = isFunction$1(opt) ? opt.bind(publicThis, publicThis) : isFunction$1(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set2 = !isFunction$1(opt) && isFunction$1(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c2 = computed({
        get,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c2.value,
        set: (v2) => c2.value = v2
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction$1(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook(created, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val,
          enumerable: true
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components) instance.components = components;
  if (directives) instance.directives = directives;
  if (serverPrefetch) {
    markAsyncBoundary(instance);
  }
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject$1(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (/* @__PURE__ */ isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v2) => injected.value = v2
      });
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  let getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString$2(raw)) {
    const handler = ctx[raw];
    if (isFunction$1(handler)) {
      {
        watch(getter, handler);
      }
    }
  } else if (isFunction$1(raw)) {
    {
      watch(getter, raw.bind(publicThis));
    }
  } else if (isObject$1(raw)) {
    if (isArray(raw)) {
      raw.forEach((r2) => createWatcher(r2, ctx, publicThis, key));
    } else {
      const handler = isFunction$1(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction$1(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else ;
}
function resolveMergedOptions(instance) {
  const base2 = instance.type;
  const { mixins, extends: extendsOptions } = base2;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base2);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base2;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m2) => mergeOptions(resolved, m2, optionMergeStrategies, true)
      );
    }
    mergeOptions(resolved, base2, optionMergeStrategies);
  }
  if (isObject$1(base2)) {
    cache.set(base2, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m2) => mergeOptions(to, m2, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose") ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction$1(to) ? to.call(this, this) : to,
      isFunction$1(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i2 = 0; i2 < raw.length; i2++) {
      res[raw[i2]] = raw[i2];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray(to) && isArray(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to) return from;
  if (!from) return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction$1(rootComponent)) {
      rootComponent = extend({}, rootComponent);
    }
    if (rootProps != null && !isObject$1(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new WeakSet();
    const pluginCleanupFns = [];
    let isMounted = false;
    const app = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v2) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin)) ;
        else if (plugin && isFunction$1(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app, ...options);
        } else if (isFunction$1(plugin)) {
          installedPlugins.add(plugin);
          plugin(app, ...options);
        } else ;
        return app;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app;
      },
      mount(rootContainer, isHydrate, namespace) {
        if (!isMounted) {
          const vnode = app._ceVNode || createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (namespace === true) {
            namespace = "svg";
          } else if (namespace === false) {
            namespace = void 0;
          }
          {
            render(vnode, rootContainer, namespace);
          }
          isMounted = true;
          app._container = rootContainer;
          rootContainer.__vue_app__ = app;
          return getComponentPublicInstance(vnode.component);
        }
      },
      onUnmount(cleanupFn) {
        pluginCleanupFns.push(cleanupFn);
      },
      unmount() {
        if (isMounted) {
          callWithAsyncErrorHandling(
            pluginCleanupFns,
            app._instance,
            16
          );
          render(null, app._container);
          delete app._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app;
      },
      runWithContext(fn) {
        const lastApp = currentApp;
        currentApp = app;
        try {
          return fn();
        } finally {
          currentApp = lastApp;
        }
      }
    };
    return app;
  };
}
let currentApp = null;
function useModel(props, name, options = EMPTY_OBJ) {
  const i2 = getCurrentInstance();
  const camelizedName = camelize(name);
  const hyphenatedName = hyphenate(name);
  const modifiers = getModelModifiers(props, camelizedName);
  const res = customRef((track2, trigger2) => {
    let localValue;
    let prevSetValue = EMPTY_OBJ;
    let prevEmittedValue;
    watchSyncEffect(() => {
      const propValue = props[camelizedName];
      if (hasChanged(localValue, propValue)) {
        localValue = propValue;
        trigger2();
      }
    });
    return {
      get() {
        track2();
        return options.get ? options.get(localValue) : localValue;
      },
      set(value) {
        const emittedValue = options.set ? options.set(value) : value;
        if (!hasChanged(emittedValue, localValue) && !(prevSetValue !== EMPTY_OBJ && hasChanged(value, prevSetValue))) {
          return;
        }
        const rawProps = i2.vnode.props;
        if (!(rawProps && // check if parent has passed v-model
        (name in rawProps || camelizedName in rawProps || hyphenatedName in rawProps) && (`onUpdate:${name}` in rawProps || `onUpdate:${camelizedName}` in rawProps || `onUpdate:${hyphenatedName}` in rawProps))) {
          localValue = value;
          trigger2();
        }
        i2.emit(`update:${name}`, emittedValue);
        if (hasChanged(value, emittedValue) && hasChanged(value, prevSetValue) && !hasChanged(emittedValue, prevEmittedValue)) {
          trigger2();
        }
        prevSetValue = value;
        prevEmittedValue = emittedValue;
      }
    };
  });
  res[Symbol.iterator] = () => {
    let i22 = 0;
    return {
      next() {
        if (i22 < 2) {
          return { value: i22++ ? modifiers || EMPTY_OBJ : res, done: false };
        } else {
          return { done: true };
        }
      }
    };
  };
  return res;
}
const getModelModifiers = (props, modelName) => {
  return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
};
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted) return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modifiers = isModelListener2 && getModelModifiers(props, event.slice(7));
  if (modifiers) {
    if (modifiers.trim) {
      args = rawArgs.map((a2) => isString$2(a2) ? a2.trim() : a2);
    }
    if (modifiers.number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
const mixinEmitsCache = /* @__PURE__ */ new WeakMap();
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = asMixin ? mixinEmitsCache : appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction$1(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject$1(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject$1(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const {
    type: Component,
    vnode,
    proxy,
    withProxy,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render,
    renderCache,
    props,
    data,
    setupState,
    ctx,
    inheritAttrs
  } = instance;
  const prev = setCurrentRenderingInstance(instance);
  let result;
  let fallthroughAttrs;
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      const thisProxy = false ? new Proxy(proxyToUse, {
        get(target, key, receiver) {
          warn$1(
            `Property '${String(
              key
            )}' was accessed via 'this'. Avoid using 'this' in templates.`
          );
          return Reflect.get(target, key, receiver);
        }
      }) : proxyToUse;
      result = normalizeVNode(
        render.call(
          thisProxy,
          proxyToUse,
          renderCache,
          false ? /* @__PURE__ */ shallowReadonly(props) : props,
          setupState,
          data,
          ctx
        )
      );
      fallthroughAttrs = attrs;
    } else {
      const render2 = Component;
      if (false) ;
      result = normalizeVNode(
        render2.length > 1 ? render2(
          false ? /* @__PURE__ */ shallowReadonly(props) : props,
          false ? {
            get attrs() {
              markAttrsAccessed();
              return /* @__PURE__ */ shallowReadonly(attrs);
            },
            slots,
            emit: emit2
          } : { attrs, slots, emit: emit2 }
        ) : render2(
          false ? /* @__PURE__ */ shallowReadonly(props) : props,
          null
        )
      );
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(
            fallthroughAttrs,
            propsOptions
          );
        }
        root = cloneVNode(root, fallthroughAttrs, false, true);
      }
    }
  }
  if (vnode.dirs) {
    root = cloneVNode(root, null, false, true);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    setTransitionHooks(root, vnode.transition);
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i2 = 0; i2 < dynamicProps.length; i2++) {
        const key = dynamicProps[i2];
        if (hasPropValueChanged(nextProps, prevProps, key) && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i2 = 0; i2 < nextKeys.length; i2++) {
    const key = nextKeys[i2];
    if (hasPropValueChanged(nextProps, prevProps, key) && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function hasPropValueChanged(nextProps, prevProps, key) {
  const nextProp = nextProps[key];
  const prevProp = prevProps[key];
  if (key === "style" && isObject$1(nextProp) && isObject$1(prevProp)) {
    return !looseEqual(nextProp, prevProp);
  }
  return nextProp !== prevProp;
}
function updateHOCHostEl({ vnode, parent, suspense }, el) {
  while (parent) {
    const root = parent.subTree;
    if (root.suspense && root.suspense.activeBranch === vnode) {
      root.suspense.vnode.el = root.el = el;
      vnode = root;
    }
    if (root === vnode) {
      (vnode = parent.vnode).el = el;
      parent = parent.parent;
    } else {
      break;
    }
  }
  if (suspense && suspense.activeBranch === vnode) {
    suspense.vnode.el = el;
  }
}
const internalObjectProto = {};
const createInternalObject = () => Object.create(internalObjectProto);
const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = createInternalObject();
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : /* @__PURE__ */ shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = /* @__PURE__ */ toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i2 = 0; i2 < propsToUpdate.length; i2++) {
        let key = propsToUpdate[i2];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance.attrs, "set", "");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = /* @__PURE__ */ toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i2 = 0; i2 < needCastKeys.length; i2++) {
      const key = needCastKeys[i2];
      props[key] = resolvePropValue(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction$1(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          const reset = setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          reset();
        }
      } else {
        value = defaultValue;
      }
      if (instance.ce) {
        instance.ce._setProp(key, value);
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
const mixinPropsCache = /* @__PURE__ */ new WeakMap();
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = asMixin ? mixinPropsCache : appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction$1(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys) needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject$1(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray(raw)) {
    for (let i2 = 0; i2 < raw.length; i2++) {
      const normalizedKey = camelize(raw[i2]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray(opt) || isFunction$1(opt) ? { type: opt } : extend({}, opt);
        const propType = prop.type;
        let shouldCast = false;
        let shouldCastTrue = true;
        if (isArray(propType)) {
          for (let index = 0; index < propType.length; ++index) {
            const type = propType[index];
            const typeName = isFunction$1(type) && type.name;
            if (typeName === "Boolean") {
              shouldCast = true;
              break;
            } else if (typeName === "String") {
              shouldCastTrue = false;
            }
          }
        } else {
          shouldCast = isFunction$1(propType) && propType.name === "Boolean";
        }
        prop[
          0
          /* shouldCast */
        ] = shouldCast;
        prop[
          1
          /* shouldCastTrue */
        ] = shouldCastTrue;
        if (shouldCast || hasOwn(prop, "default")) {
          needCastKeys.push(normalizedKey);
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject$1(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$" && !isReservedProp(key)) {
    return true;
  }
  return false;
}
const isInternalKey = (key) => key === "_" || key === "_ctx" || key === "$stable";
const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    if (false) ;
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key)) continue;
    const value = rawSlots[key];
    if (isFunction$1(value)) {
      slots[key] = normalizeSlot(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const assignSlots = (slots, children, optimized) => {
  for (const key in children) {
    if (optimized || !isInternalKey(key)) {
      slots[key] = children[key];
    }
  }
};
const initSlots = (instance, children, optimized) => {
  const slots = instance.slots = createInternalObject();
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      assignSlots(slots, children, optimized);
      if (optimized) {
        def(slots, "_", type, true);
      }
    } else {
      normalizeObjectSlots(children, slots);
    }
  } else if (children) {
    normalizeVNodeSlots(instance, children);
  }
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        assignSlots(slots, children, optimized);
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
        delete slots[key];
      }
    }
  }
};
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target = getGlobalThis();
  target.__VUE__ = true;
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    insertStaticContent: hostInsertStaticContent
  } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref3, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, namespace);
        }
        break;
      case Fragment:
        processFragment(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        break;
      default:
        if (shapeFlag & 1) {
          processElement(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 6) {
          processComponent(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 64) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else if (shapeFlag & 128) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else ;
    }
    if (ref3 != null && parentComponent) {
      setRef(ref3, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    } else if (ref3 == null && n1 && n1.ref != null) {
      setRef(n1.ref, null, parentSuspense, n1, true);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateText(n2.children),
        container,
        anchor
      );
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateComment(n2.children || ""),
        container,
        anchor
      );
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, namespace) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(
      n2.children,
      container,
      anchor,
      namespace,
      n2.el,
      n2.anchor
    );
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    if (n2.type === "svg") {
      namespace = "svg";
    } else if (n2.type === "math") {
      namespace = "mathml";
    }
    if (n1 == null) {
      mountElement(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      const customElement = n1.el && n1.el._isVueCE ? n1.el : null;
      try {
        if (customElement) {
          customElement._beginPatch();
        }
        patchElement(
          n1,
          n2,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } finally {
        if (customElement) {
          customElement._endPatch();
        }
      }
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { props, shapeFlag, transition, dirs } = vnode;
    el = vnode.el = hostCreateElement(
      vnode.type,
      namespace,
      props && props.is,
      props
    );
    if (shapeFlag & 8) {
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & 16) {
      mountChildren(
        vnode.children,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(vnode, namespace),
        slotScopeIds,
        optimized
      );
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "created");
    }
    setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    if (props) {
      for (const key in props) {
        if (key !== "value" && !isReservedProp(key)) {
          hostPatchProp(el, key, null, props[key], namespace, parentComponent);
        }
      }
      if ("value" in props) {
        hostPatchProp(el, "value", null, props.value, namespace);
      }
      if (vnodeHook = props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = needTransition(parentSuspense, transition);
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        try {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          needCallTransitionHooks && transition.enter(el);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
        } finally {
        }
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i2 = 0; i2 < slotScopeIds.length; i2++) {
        hostSetScopeId(el, slotScopeIds[i2]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
        const parentVNode = parentComponent.vnode;
        setScopeId(
          el,
          parentVNode,
          parentVNode.scopeId,
          parentVNode.slotScopeIds,
          parentComponent.parent
        );
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
    for (let i2 = start; i2 < children.length; i2++) {
      const child = children[i2] = optimized ? cloneIfMounted(children[i2]) : normalizeVNode(children[i2]);
      patch(
        null,
        child,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) {
      hostSetElementText(el, "");
    }
    if (dynamicChildren) {
      patchBlockChildren(
        n1.dynamicChildren,
        dynamicChildren,
        el,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds
      );
    } else if (!optimized) {
      patchChildren(
        n1,
        n2,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds,
        false
      );
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(el, oldProps, newProps, parentComponent, namespace);
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, namespace);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i2 = 0; i2 < propsToUpdate.length; i2++) {
            const key = propsToUpdate[i2];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(el, key, prev, next, namespace, parentComponent);
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(el, oldProps, newProps, parentComponent, namespace);
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
    for (let i2 = 0; i2 < newChildren.length; i2++) {
      const oldVNode = oldChildren[i2];
      const newVNode = newChildren[i2];
      const container = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
        oldVNode.shapeFlag & (6 | 64 | 128)) ? hostParentNode(oldVNode.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          fallbackContainer
        )
      );
      patch(
        oldVNode,
        newVNode,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        true
      );
    }
  };
  const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
    if (oldProps !== newProps) {
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(
              el,
              key,
              oldProps[key],
              null,
              namespace,
              parentComponent
            );
          }
        }
      }
      for (const key in newProps) {
        if (isReservedProp(key)) continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(el, key, prev, next, namespace, parentComponent);
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(
        // #10007
        // such fragment like `<></>` will be compiled into
        // a fragment which doesn't have a children.
        // In this case fallback to an empty array
        n2.children || [],
        container,
        fragmentEndAnchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
      // of renderSlot() with no valid children
      n1.dynamicChildren && n1.dynamicChildren.length === dynamicChildren.length) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          container,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds
        );
        if (
          // #2080 if the stable fragment has a key, it's a <template v-for> that may
          //  get moved around. Make sure all root level vnodes inherit el.
          // #2134 or if it's a component root, it may also get moved around
          // as the component is being moved.
          n2.key != null || parentComponent && n2 === parentComponent.subTree
        ) {
          traverseStaticChildren(
            n1,
            n2,
            true
            /* shallow */
          );
        }
      } else {
        patchChildren(
          n1,
          n2,
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(
          n2,
          container,
          anchor,
          namespace,
          optimized
        );
      } else {
        mountComponent(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          optimized
        );
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
    const instance = initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent,
      parentSuspense
    );
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance, false, optimized);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
        initialVNode.placeholder = placeholder.el;
      }
    } else {
      setupRenderEffect(
        instance,
        initialVNode,
        container,
        anchor,
        parentSuspense,
        namespace,
        optimized
      );
    }
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m: m2, parent, root, type } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        {
          if (root.ce && root.ce._hasShadowRoot()) {
            root.ce._injectChildStyle(
              type,
              instance.parent ? instance.parent.type : void 0
            );
          }
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(
            null,
            subTree,
            container,
            anchor,
            instance,
            parentSuspense,
            namespace
          );
          initialVNode.el = subTree.el;
        }
        if (m2) {
          queuePostRenderEffect(m2, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
            parentSuspense
          );
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u: u2, parent, vnode } = instance;
        {
          const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
          if (nonHydratedAsyncRoot) {
            if (next) {
              next.el = vnode.el;
              updateComponentPreRender(instance, next, optimized);
            }
            nonHydratedAsyncRoot.asyncDep.then(() => {
              queuePostRenderEffect(() => {
                if (!instance.isUnmounted) update();
              }, parentSuspense);
            });
            return;
          }
        }
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(
          prevTree,
          nextTree,
          // parent may have changed if it's in a teleport
          hostParentNode(prevTree.el),
          // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          namespace
        );
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u2) {
          queuePostRenderEffect(u2, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, next, vnode),
            parentSuspense
          );
        }
      }
    };
    instance.scope.on();
    const effect2 = instance.effect = new ReactiveEffect(componentUpdateFn);
    instance.scope.off();
    const update = instance.update = effect2.run.bind(effect2);
    const job = instance.job = effect2.runIfDirty.bind(effect2);
    job.i = instance;
    job.id = instance.uid;
    effect2.scheduler = () => queueJob(job);
    toggleRecurse(instance, true);
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs(instance);
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i2;
    for (i2 = 0; i2 < commonLength; i2++) {
      const nextChild = c2[i2] = optimized ? cloneIfMounted(c2[i2]) : normalizeVNode(c2[i2]);
      patch(
        c1[i2],
        nextChild,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
    if (oldLength > newLength) {
      unmountChildren(
        c1,
        parentComponent,
        parentSuspense,
        true,
        false,
        commonLength
      );
    } else {
      mountChildren(
        c2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
        commonLength
      );
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let i2 = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i2 <= e1 && i2 <= e2) {
      const n1 = c1[i2];
      const n2 = c2[i2] = optimized ? cloneIfMounted(c2[i2]) : normalizeVNode(c2[i2]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      i2++;
    }
    while (i2 <= e1 && i2 <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i2 > e1) {
      if (i2 <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i2 <= e2) {
          patch(
            null,
            c2[i2] = optimized ? cloneIfMounted(c2[i2]) : normalizeVNode(c2[i2]),
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          i2++;
        }
      }
    } else if (i2 > e2) {
      while (i2 <= e1) {
        unmount(c1[i2], parentComponent, parentSuspense, true);
        i2++;
      }
    } else {
      const s1 = i2;
      const s2 = i2;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i2 = s2; i2 <= e2; i2++) {
        const nextChild = c2[i2] = optimized ? cloneIfMounted(c2[i2]) : normalizeVNode(c2[i2]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i2);
        }
      }
      let j2;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i2 = 0; i2 < toBePatched; i2++) newIndexToOldIndexMap[i2] = 0;
      for (i2 = s1; i2 <= e1; i2++) {
        const prevChild = c1[i2];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j2 = s2; j2 <= e2; j2++) {
            if (newIndexToOldIndexMap[j2 - s2] === 0 && isSameVNodeType(prevChild, c2[j2])) {
              newIndex = j2;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i2 + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(
            prevChild,
            c2[newIndex],
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j2 = increasingNewIndexSequence.length - 1;
      for (i2 = toBePatched - 1; i2 >= 0; i2--) {
        const nextIndex = s2 + i2;
        const nextChild = c2[nextIndex];
        const anchorVNode = c2[nextIndex + 1];
        const anchor = nextIndex + 1 < l2 ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          anchorVNode.el || resolveAsyncComponentPlaceholder(anchorVNode)
        ) : parentAnchor;
        if (newIndexToOldIndexMap[i2] === 0) {
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (moved) {
          if (j2 < 0 || i2 !== increasingNewIndexSequence[j2]) {
            move(nextChild, container, anchor, 2);
          } else {
            j2--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i2 = 0; i2 < children.length; i2++) {
        move(children[i2], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition2) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove22 = () => {
          if (vnode.ctx.isUnmounted) {
            hostRemove(el);
          } else {
            hostInsert(el, container, anchor);
          }
        };
        const performLeave = () => {
          if (el._isLeaving) {
            el[leaveCbKey](
              true
              /* cancelled */
            );
          }
          leave(el, () => {
            remove22();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove22, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const {
      type,
      props,
      ref: ref3,
      children,
      dynamicChildren,
      shapeFlag,
      patchFlag,
      dirs,
      cacheIndex,
      memo
    } = vnode;
    if (patchFlag === -2) {
      optimized = false;
    }
    if (ref3 != null) {
      pauseTracking();
      setRef(ref3, null, parentSuspense, vnode, true);
      resetTracking();
    }
    if (cacheIndex != null) {
      parentComponent.renderCache[cacheIndex] = void 0;
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(
          vnode,
          parentComponent,
          parentSuspense,
          internals,
          doRemove
        );
      } else if (dynamicChildren && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !dynamicChildren.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(
          dynamicChildren,
          parentComponent,
          parentSuspense,
          false,
          true
        );
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    const shouldInvalidateMemo = memo != null && cacheIndex == null;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs || shouldInvalidateMemo) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
        if (shouldInvalidateMemo) {
          vnode.el = null;
        }
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, job, subTree, um, m: m2, a: a2 } = instance;
    invalidateMount(m2);
    invalidateMount(a2);
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (job) {
      job.flags |= 8;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i2 = start; i2 < children.length; i2++) {
      unmount(children[i2], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    const el = hostNextSibling(vnode.anchor || vnode.el);
    const teleportEnd = el && el[TeleportEndKey];
    return teleportEnd ? hostNextSibling(teleportEnd) : el;
  };
  let isFlushing = false;
  const render = (vnode, container, namespace) => {
    let instance;
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
        instance = container._vnode.component;
      }
    } else {
      patch(
        container._vnode || null,
        vnode,
        container,
        null,
        null,
        null,
        namespace
      );
    }
    container._vnode = vnode;
    if (!isFlushing) {
      isFlushing = true;
      flushPreFlushCbs(instance);
      flushPostFlushCbs();
      isFlushing = false;
    }
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  return {
    render,
    hydrate,
    createApp: createAppAPI(render)
  };
}
function resolveChildrenNamespace({ type, props }, currentNamespace) {
  return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
}
function toggleRecurse({ effect: effect2, job }, allowed) {
  if (allowed) {
    effect2.flags |= 32;
    job.flags |= 4;
  } else {
    effect2.flags &= -33;
    job.flags &= -5;
  }
}
function needTransition(parentSuspense, transition) {
  return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray(ch1) && isArray(ch2)) {
    for (let i2 = 0; i2 < ch1.length; i2++) {
      const c1 = ch1[i2];
      let c2 = ch2[i2];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i2] = cloneIfMounted(ch2[i2]);
          c2.el = c1.el;
        }
        if (!shallow && c2.patchFlag !== -2)
          traverseStaticChildren(c1, c2);
      }
      if (c2.type === Text) {
        if (c2.patchFlag === -1) {
          c2 = ch2[i2] = cloneIfMounted(c2);
        }
        c2.el = c1.el;
      }
      if (c2.type === Comment && !c2.el) {
        c2.el = c1.el;
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i2, j2, u2, v2, c2;
  const len = arr.length;
  for (i2 = 0; i2 < len; i2++) {
    const arrI = arr[i2];
    if (arrI !== 0) {
      j2 = result[result.length - 1];
      if (arr[j2] < arrI) {
        p2[i2] = j2;
        result.push(i2);
        continue;
      }
      u2 = 0;
      v2 = result.length - 1;
      while (u2 < v2) {
        c2 = u2 + v2 >> 1;
        if (arr[result[c2]] < arrI) {
          u2 = c2 + 1;
        } else {
          v2 = c2;
        }
      }
      if (arrI < arr[result[u2]]) {
        if (u2 > 0) {
          p2[i2] = result[u2 - 1];
        }
        result[u2] = i2;
      }
    }
  }
  u2 = result.length;
  v2 = result[u2 - 1];
  while (u2-- > 0) {
    result[u2] = v2;
    v2 = p2[v2];
  }
  return result;
}
function locateNonHydratedAsyncRoot(instance) {
  const subComponent = instance.subTree.component;
  if (subComponent) {
    if (subComponent.asyncDep && !subComponent.asyncResolved) {
      return subComponent;
    } else {
      return locateNonHydratedAsyncRoot(subComponent);
    }
  }
}
function invalidateMount(hooks) {
  if (hooks) {
    for (let i2 = 0; i2 < hooks.length; i2++)
      hooks[i2].flags |= 8;
  }
}
function resolveAsyncComponentPlaceholder(anchorVnode) {
  if (anchorVnode.placeholder) {
    return anchorVnode.placeholder;
  }
  const instance = anchorVnode.component;
  if (instance) {
    return resolveAsyncComponentPlaceholder(instance.subTree);
  }
  return null;
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
const Fragment = /* @__PURE__ */ Symbol.for("v-fgt");
const Text = /* @__PURE__ */ Symbol.for("v-txt");
const Comment = /* @__PURE__ */ Symbol.for("v-cmt");
const Static = /* @__PURE__ */ Symbol.for("v-stc");
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value, inVOnce = false) {
  isBlockTreeEnabled += value;
  if (value < 0 && currentBlock && inVOnce) {
    currentBlock.hasOnce = true;
  }
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(
    createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      true
    )
  );
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(
    createVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      true
    )
  );
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({
  ref: ref3,
  ref_key,
  ref_for
}) => {
  if (typeof ref3 === "number") {
    ref3 = "" + ref3;
  }
  return ref3 != null ? isString$2(ref3) || /* @__PURE__ */ isRef(ref3) || isFunction$1(ref3) ? { i: currentRenderingInstance, r: ref3, k: ref_key, f: !!ref_for } : ref3 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString$2(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
  !isBlockNode && // has current parent block
  currentBlock && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(
      type,
      props,
      true
      /* mergeRef: true */
    );
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag = -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString$2(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject$1(style)) {
      if (/* @__PURE__ */ isProxy(style) && !isArray(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString$2(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject$1(type) ? 4 : isFunction$1(type) ? 2 : 0;
  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true
  );
}
function guardReactiveProps(props) {
  if (!props) return null;
  return /* @__PURE__ */ isProxy(props) || isInternalObject(props) ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
  const { props, ref: ref3, patchFlag, children, transition } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      mergeRef && ref3 ? isArray(ref3) ? ref3.concat(normalizeRef(extraProps)) : [ref3, normalizeRef(extraProps)] : normalizeRef(extraProps)
    ) : ref3,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetStart: vnode.targetStart,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    placeholder: vnode.placeholder,
    el: vnode.el,
    anchor: vnode.anchor,
    ctx: vnode.ctx,
    ce: vnode.ce
  };
  if (transition && cloneTransition) {
    setTransitionHooks(
      cloned,
      transition.clone(cloned)
    );
  }
  return cloned;
}
function createTextVNode(text2 = " ", flag = 0) {
  return createVNode(Text, null, text2, flag);
}
function createCommentVNode(text2 = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text2)) : createVNode(Comment, null, text2);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray(child)) {
    return createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode
      child.slice()
    );
  } else if (isVNode(child)) {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !isInternalObject(children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction$1(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i2 = 0; i2 < args.length; i2++) {
    const toMerge = args[i2];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        } else if (incoming == null && existing == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !isModelListener(key)) {
          ret[key] = incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    ids: parent ? parent.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let setInSSRSetupState;
{
  const g2 = getGlobalThis();
  const registerGlobalSetter = (key, setter) => {
    let setters;
    if (!(setters = g2[key])) setters = g2[key] = [];
    setters.push(setter);
    return (v2) => {
      if (setters.length > 1) setters.forEach((set2) => set2(v2));
      else setters[0](v2);
    };
  };
  internalSetCurrentInstance = registerGlobalSetter(
    `__VUE_INSTANCE_SETTERS__`,
    (v2) => currentInstance = v2
  );
  setInSSRSetupState = registerGlobalSetter(
    `__VUE_SSR_SETTERS__`,
    (v2) => isInSSRComponentSetup = v2
  );
}
const setCurrentInstance = (instance) => {
  const prev = currentInstance;
  internalSetCurrentInstance(instance);
  instance.scope.on();
  return () => {
    instance.scope.off();
    internalSetCurrentInstance(prev);
  };
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false, optimized = false) {
  isSSR && setInSSRSetupState(isSSR);
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children, optimized || isSSR);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isSSR && setInSSRSetupState(false);
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
  const { setup } = Component;
  if (setup) {
    pauseTracking();
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    const reset = setCurrentInstance(instance);
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [
        instance.props,
        setupContext
      ]
    );
    const isAsyncSetup = isPromise(setupResult);
    resetTracking();
    reset();
    if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) {
      markAsyncBoundary(instance);
    }
    if (isAsyncSetup) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult);
        }).catch((e2) => {
          handleError(e2, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult);
    }
  } else {
    finishComponentSetup(instance);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction$1(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject$1(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else ;
  finishComponentSetup(instance);
}
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    instance.render = Component.render || NOOP;
  }
  {
    const reset = setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions(instance);
    } finally {
      resetTracking();
      reset();
    }
  }
}
const attrsProxyHandlers = {
  get(target, key) {
    track(target, "get", "");
    return target[key];
  }
};
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  {
    return {
      attrs: new Proxy(instance.attrs, attrsProxyHandlers),
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getComponentPublicInstance(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  } else {
    return instance.proxy;
  }
}
const classifyRE = /(?:^|[-_])\w/g;
const classify = (str) => str.replace(classifyRE, (c2) => c2.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component, includeInferred = true) {
  return isFunction$1(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function formatComponentName(instance, Component, isRoot = false) {
  let name = getComponentName(Component);
  if (!name && Component.__file) {
    const match2 = Component.__file.match(/([^/\\]+)\.\w+$/);
    if (match2) {
      name = match2[1];
    }
  }
  if (!name && instance) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component) {
          return key;
        }
      }
    };
    name = inferFromRegistry(instance.components) || instance.parent && inferFromRegistry(
      instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
function isClassComponent(value) {
  return isFunction$1(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  const c2 = /* @__PURE__ */ computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  return c2;
};
const version = "3.5.33";
/**
* @vue/runtime-dom v3.5.33
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let policy = void 0;
const tt = typeof window !== "undefined" && window.trustedTypes;
if (tt) {
  try {
    policy = /* @__PURE__ */ tt.createPolicy("vue", {
      createHTML: (val) => val
    });
  } catch (e2) {
  }
}
const unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
const svgNS = "http://www.w3.org/2000/svg";
const mathmlNS = "http://www.w3.org/1998/Math/MathML";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, namespace, is, props) => {
    const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text2) => doc.createTextNode(text2),
  createComment: (text2) => doc.createComment(text2),
  setText: (node, text2) => {
    node.nodeValue = text2;
  },
  setElementText: (el, text2) => {
    el.textContent = text2;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(content, parent, anchor, namespace, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling)) break;
      }
    } else {
      templateContainer.innerHTML = unsafeToTrustedHTML(
        namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content
      );
      const template = templateContainer.content;
      if (namespace === "svg" || namespace === "mathml") {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      // first
      before ? before.nextSibling : parent.firstChild,
      // last
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
const vtcKey = /* @__PURE__ */ Symbol("_vtc");
function patchClass(el, value, isSVG) {
  const transitionClasses = el[vtcKey];
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
const vShowOriginalDisplay = /* @__PURE__ */ Symbol("_vod");
const vShowHidden = /* @__PURE__ */ Symbol("_vsh");
const CSS_VAR_TEXT = /* @__PURE__ */ Symbol("");
const displayRE = /(?:^|;)\s*display\s*:/;
function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = isString$2(next);
  let hasControlledDisplay = false;
  if (next && !isCssString) {
    if (prev) {
      if (!isString$2(prev)) {
        for (const key in prev) {
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      } else {
        for (const prevStyle of prev.split(";")) {
          const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      }
    }
    for (const key in next) {
      if (key === "display") {
        hasControlledDisplay = true;
      }
      const value = next[key];
      if (value != null) {
        if (!shouldPreserveTextareaResizeStyle(
          el,
          key,
          !isString$2(prev) && prev ? prev[key] : void 0,
          value
        )) {
          setStyle(style, key, value);
        }
      } else {
        setStyle(style, key, "");
      }
    }
  } else {
    if (isCssString) {
      if (prev !== next) {
        const cssVarText = style[CSS_VAR_TEXT];
        if (cssVarText) {
          next += ";" + cssVarText;
        }
        style.cssText = next;
        hasControlledDisplay = displayRE.test(next);
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
  }
  if (vShowOriginalDisplay in el) {
    el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
    if (el[vShowHidden]) {
      style.display = "none";
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray(val)) {
    val.forEach((v2) => setStyle(style, name, v2));
  } else {
    if (val == null) val = "";
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(
          hyphenate(prefixed),
          val.replace(importantRE, ""),
          "important"
        );
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i2 = 0; i2 < prefixes.length; i2++) {
    const prefixed = prefixes[i2] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
function shouldPreserveTextareaResizeStyle(el, key, prev, next) {
  return el.tagName === "TEXTAREA" && (key === "width" || key === "height") && isString$2(next) && prev === next;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance, isBoolean = isSpecialBooleanAttr(key)) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (value == null || isBoolean && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(
        key,
        isBoolean ? "" : isSymbol(value) ? String(value) : value
      );
    }
  }
}
function patchDOMProp(el, key, value, parentComponent, attrName) {
  if (key === "innerHTML" || key === "textContent") {
    if (value != null) {
      el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value) : value;
    }
    return;
  }
  const tag = el.tagName;
  if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
  !tag.includes("-")) {
    const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
    const newValue = value == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      el.type === "checkbox" ? "on" : ""
    ) : String(value);
    if (oldValue !== newValue || !("_value" in el)) {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    el._value = value;
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e2) {
  }
  needRemove && el.removeAttribute(attrName || key);
}
function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}
const veiKey = /* @__PURE__ */ Symbol("_vei");
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el[veiKey] || (el[veiKey] = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(
        nextValue,
        instance
      );
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m2;
    while (m2 = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m2[0].length);
      options[m2[0].toLowerCase()] = true;
    }
  }
  const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event, options];
}
let cachedNow = 0;
const p$1 = /* @__PURE__ */ Promise.resolve();
const getNow = () => cachedNow || (p$1.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
  const invoker = (e2) => {
    if (!e2._vts) {
      e2._vts = Date.now();
    } else if (e2._vts <= invoker.attached) {
      return;
    }
    callWithAsyncErrorHandling(
      patchStopImmediatePropagation(e2, invoker.value),
      instance,
      5,
      [e2]
    );
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e2, value) {
  if (isArray(value)) {
    const originalStop = e2.stopImmediatePropagation;
    e2.stopImmediatePropagation = () => {
      originalStop.call(e2);
      e2._stopped = true;
    };
    return value.map(
      (fn) => (e22) => !e22._stopped && fn && fn(e22)
    );
  } else {
    return value;
  }
}
const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
const patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
  const isSVG = namespace === "svg";
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(el, key, nextValue);
    if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) {
      patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
    }
  } else if (
    // #11081 force set props for possible async custom element
    el._isVueCE && // #12408 check if it's declared prop or it's async custom element
    (shouldSetAsPropForVueCE(el, key) || // @ts-expect-error _def is private
    el._def.__asyncLoader && (/[A-Z]/.test(key) || !isString$2(nextValue)))
  ) {
    patchDOMProp(el, camelize(key), nextValue, parentComponent, key);
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && isNativeOn(key) && isFunction$1(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate" || key === "autocorrect") {
    return false;
  }
  if (key === "sandbox" && el.tagName === "IFRAME") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (key === "width" || key === "height") {
    const tag = el.tagName;
    if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
      return false;
    }
  }
  if (isNativeOn(key) && isString$2(value)) {
    return false;
  }
  return key in el;
}
function shouldSetAsPropForVueCE(el, key) {
  const props = (
    // @ts-expect-error _def is private
    el._def.props
  );
  if (!props) {
    return false;
  }
  const camelKey = camelize(key);
  return Array.isArray(props) ? props.some((prop) => camelize(prop) === camelKey) : Object.keys(props).some((prop) => camelize(prop) === camelKey);
}
const getModelAssigner = (vnode) => {
  const fn = vnode.props["onUpdate:modelValue"] || false;
  return isArray(fn) ? (value) => invokeArrayFns(fn, value) : fn;
};
function onCompositionStart(e2) {
  e2.target.composing = true;
}
function onCompositionEnd(e2) {
  const target = e2.target;
  if (target.composing) {
    target.composing = false;
    target.dispatchEvent(new Event("input"));
  }
}
const assignKey = /* @__PURE__ */ Symbol("_assign");
function castValue(value, trim, number) {
  if (trim) value = value.trim();
  if (number) value = looseToNumber(value);
  return value;
}
const vModelText = {
  created(el, { modifiers: { lazy, trim, number } }, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    const castToNumber = number || vnode.props && vnode.props.type === "number";
    addEventListener(el, lazy ? "change" : "input", (e2) => {
      if (e2.target.composing) return;
      el[assignKey](castValue(el.value, trim, castToNumber));
    });
    if (trim || castToNumber) {
      addEventListener(el, "change", () => {
        el.value = castValue(el.value, trim, castToNumber);
      });
    }
    if (!lazy) {
      addEventListener(el, "compositionstart", onCompositionStart);
      addEventListener(el, "compositionend", onCompositionEnd);
      addEventListener(el, "change", onCompositionEnd);
    }
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(el, { value }) {
    el.value = value == null ? "" : value;
  },
  beforeUpdate(el, { value, oldValue, modifiers: { lazy, trim, number } }, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    if (el.composing) return;
    const elValue = (number || el.type === "number") && !/^0\d/.test(el.value) ? looseToNumber(el.value) : el.value;
    const newValue = value == null ? "" : value;
    if (elValue === newValue) {
      return;
    }
    const rootNode = el.getRootNode();
    if ((rootNode instanceof Document || rootNode instanceof ShadowRoot) && rootNode.activeElement === el && el.type !== "range") {
      if (lazy && value === oldValue) {
        return;
      }
      if (trim && el.value.trim() === newValue) {
        return;
      }
    }
    el.value = newValue;
  }
};
const vModelCheckbox = {
  // #4096 array checkboxes need to be deep traversed
  deep: true,
  created(el, _2, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    addEventListener(el, "change", () => {
      const modelValue = el._modelValue;
      const elementValue = getValue(el);
      const checked = el.checked;
      const assign2 = el[assignKey];
      if (isArray(modelValue)) {
        const index = looseIndexOf(modelValue, elementValue);
        const found = index !== -1;
        if (checked && !found) {
          assign2(modelValue.concat(elementValue));
        } else if (!checked && found) {
          const filtered = [...modelValue];
          filtered.splice(index, 1);
          assign2(filtered);
        }
      } else if (isSet(modelValue)) {
        const cloned = new Set(modelValue);
        if (checked) {
          cloned.add(elementValue);
        } else {
          cloned.delete(elementValue);
        }
        assign2(cloned);
      } else {
        assign2(getCheckboxValue(el, checked));
      }
    });
  },
  // set initial checked on mount to wait for true-value/false-value
  mounted: setChecked,
  beforeUpdate(el, binding, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    setChecked(el, binding, vnode);
  }
};
function setChecked(el, { value, oldValue }, vnode) {
  el._modelValue = value;
  let checked;
  if (isArray(value)) {
    checked = looseIndexOf(value, vnode.props.value) > -1;
  } else if (isSet(value)) {
    checked = value.has(vnode.props.value);
  } else {
    if (value === oldValue) return;
    checked = looseEqual(value, getCheckboxValue(el, true));
  }
  if (el.checked !== checked) {
    el.checked = checked;
  }
}
const vModelSelect = {
  // <select multiple> value need to be deep traversed
  deep: true,
  created(el, { value, modifiers: { number } }, vnode) {
    const isSetModel = isSet(value);
    addEventListener(el, "change", () => {
      const selectedVal = Array.prototype.filter.call(el.options, (o2) => o2.selected).map(
        (o2) => number ? looseToNumber(getValue(o2)) : getValue(o2)
      );
      el[assignKey](
        el.multiple ? isSetModel ? new Set(selectedVal) : selectedVal : selectedVal[0]
      );
      el._assigning = true;
      nextTick(() => {
        el._assigning = false;
      });
    });
    el[assignKey] = getModelAssigner(vnode);
  },
  // set value in mounted & updated because <select> relies on its children
  // <option>s.
  mounted(el, { value }) {
    setSelected(el, value);
  },
  beforeUpdate(el, _binding, vnode) {
    el[assignKey] = getModelAssigner(vnode);
  },
  updated(el, { value }) {
    if (!el._assigning) {
      setSelected(el, value);
    }
  }
};
function setSelected(el, value) {
  const isMultiple = el.multiple;
  const isArrayValue = isArray(value);
  if (isMultiple && !isArrayValue && !isSet(value)) {
    return;
  }
  for (let i2 = 0, l2 = el.options.length; i2 < l2; i2++) {
    const option = el.options[i2];
    const optionValue = getValue(option);
    if (isMultiple) {
      if (isArrayValue) {
        const optionType = typeof optionValue;
        if (optionType === "string" || optionType === "number") {
          option.selected = value.some((v2) => String(v2) === String(optionValue));
        } else {
          option.selected = looseIndexOf(value, optionValue) > -1;
        }
      } else {
        option.selected = value.has(optionValue);
      }
    } else if (looseEqual(getValue(option), value)) {
      if (el.selectedIndex !== i2) el.selectedIndex = i2;
      return;
    }
  }
  if (!isMultiple && el.selectedIndex !== -1) {
    el.selectedIndex = -1;
  }
}
function getValue(el) {
  return "_value" in el ? el._value : el.value;
}
function getCheckboxValue(el, checked) {
  const key = checked ? "_trueValue" : "_falseValue";
  return key in el ? el[key] : checked;
}
const systemModifiers = ["ctrl", "shift", "alt", "meta"];
const modifierGuards = {
  stop: (e2) => e2.stopPropagation(),
  prevent: (e2) => e2.preventDefault(),
  self: (e2) => e2.target !== e2.currentTarget,
  ctrl: (e2) => !e2.ctrlKey,
  shift: (e2) => !e2.shiftKey,
  alt: (e2) => !e2.altKey,
  meta: (e2) => !e2.metaKey,
  left: (e2) => "button" in e2 && e2.button !== 0,
  middle: (e2) => "button" in e2 && e2.button !== 1,
  right: (e2) => "button" in e2 && e2.button !== 2,
  exact: (e2, modifiers) => systemModifiers.some((m2) => e2[`${m2}Key`] && !modifiers.includes(m2))
};
const withModifiers = (fn, modifiers) => {
  if (!fn) return fn;
  const cache = fn._withMods || (fn._withMods = {});
  const cacheKey = modifiers.join(".");
  return cache[cacheKey] || (cache[cacheKey] = ((event, ...args) => {
    for (let i2 = 0; i2 < modifiers.length; i2++) {
      const guard = modifierGuards[modifiers[i2]];
      if (guard && guard(event, modifiers)) return;
    }
    return fn(event, ...args);
  }));
};
const keyNames = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
};
const withKeys = (fn, modifiers) => {
  const cache = fn._withKeys || (fn._withKeys = {});
  const cacheKey = modifiers.join(".");
  return cache[cacheKey] || (cache[cacheKey] = ((event) => {
    if (!("key" in event)) {
      return;
    }
    const eventKey = hyphenate(event.key);
    if (modifiers.some(
      (k2) => k2 === eventKey || keyNames[k2] === eventKey
    )) {
      return fn(event);
    }
  }));
};
const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const createApp = ((...args) => {
  const app = ensureRenderer().createApp(...args);
  const { mount } = app;
  app.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container) return;
    const component = app._component;
    if (!isFunction$1(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    if (container.nodeType === 1) {
      container.textContent = "";
    }
    const proxy = mount(container, false, resolveRootNamespace(container));
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app;
});
function resolveRootNamespace(container) {
  if (container instanceof SVGElement) {
    return "svg";
  }
  if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
    return "mathml";
  }
}
function normalizeContainer(container) {
  if (isString$2(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
const _hoisted_1$c = ["aria-expanded"];
const _hoisted_2$9 = {
  key: 0,
  class: "file-popover",
  role: "menu"
};
const _hoisted_3$8 = {
  key: 0,
  class: "file-menu-separator"
};
const _hoisted_4$7 = ["onClick"];
const _hoisted_5$6 = { class: "file-menu-shortcut" };
const _hoisted_6$3 = { class: "file-submenu-wrap" };
const _hoisted_7$3 = {
  class: "file-submenu",
  role: "menu",
  "aria-label": "导出格式"
};
const _sfc_main$c = {
  __name: "FileMenu",
  emits: [
    "create",
    "open",
    "open-folder",
    "open-remote-folder",
    "save",
    "save-as",
    "export",
    "settings"
  ],
  setup(__props, { emit: __emit }) {
    const emit2 = __emit;
    const isOpen = /* @__PURE__ */ ref(false);
    const menuRef = /* @__PURE__ */ ref(null);
    const menuGroups = [
      [
        { label: "新建", shortcut: "Ctrl+N", event: "create" },
        { label: "打开...", shortcut: "Ctrl+O", event: "open" },
        { label: "打开文件夹...", shortcut: "Ctrl+Shift+O", event: "open-folder" },
        { label: "打开远程文件夹...", event: "open-remote-folder" }
      ],
      [
        { label: "保存", shortcut: "Ctrl+S", event: "save" },
        { label: "另存为...", shortcut: "Ctrl+Shift+S", event: "save-as" }
      ]
    ];
    function toggleMenu() {
      isOpen.value = !isOpen.value;
    }
    function runMenuAction(eventName) {
      emit2(eventName);
      isOpen.value = false;
    }
    function runExport(format2) {
      emit2("export", format2);
      isOpen.value = false;
    }
    function handlePointerDown(event) {
      if (!isOpen.value || menuRef.value?.contains(event.target)) return;
      isOpen.value = false;
    }
    function handleKeydown(event) {
      if (event.key === "Escape") isOpen.value = false;
    }
    onMounted(() => {
      window.addEventListener("pointerdown", handlePointerDown);
      window.addEventListener("keydown", handleKeydown);
    });
    onUnmounted(() => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeydown);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "menuRef",
        ref: menuRef,
        class: "popup-menu-wrap"
      }, [
        createBaseVNode("button", {
          class: "menu-button menu-bar-button",
          type: "button",
          "aria-haspopup": "menu",
          "aria-expanded": isOpen.value,
          onClick: toggleMenu
        }, " 文件(F) ", 8, _hoisted_1$c),
        isOpen.value ? (openBlock(), createElementBlock("div", _hoisted_2$9, [
          (openBlock(), createElementBlock(Fragment, null, renderList(menuGroups, (group, groupIndex) => {
            return openBlock(), createElementBlock(Fragment, { key: groupIndex }, [
              groupIndex > 0 ? (openBlock(), createElementBlock("div", _hoisted_3$8)) : createCommentVNode("", true),
              (openBlock(true), createElementBlock(Fragment, null, renderList(group, (item) => {
                return openBlock(), createElementBlock("button", {
                  key: item.event,
                  class: "file-menu-item",
                  type: "button",
                  role: "menuitem",
                  onClick: ($event) => runMenuAction(item.event)
                }, [
                  createBaseVNode("span", null, toDisplayString(item.label), 1),
                  createBaseVNode("span", _hoisted_5$6, toDisplayString(item.shortcut), 1)
                ], 8, _hoisted_4$7);
              }), 128))
            ], 64);
          }), 64)),
          _cache[9] || (_cache[9] = createBaseVNode("div", { class: "file-menu-separator" }, null, -1)),
          createBaseVNode("div", _hoisted_6$3, [
            _cache[7] || (_cache[7] = createBaseVNode("button", {
              class: "file-menu-item",
              type: "button",
              role: "menuitem",
              "aria-haspopup": "menu"
            }, [
              createBaseVNode("span", null, "导出"),
              createBaseVNode("span", { class: "file-menu-arrow" }, "›")
            ], -1)),
            createBaseVNode("div", _hoisted_7$3, [
              createBaseVNode("button", {
                class: "file-menu-item",
                type: "button",
                role: "menuitem",
                onClick: _cache[0] || (_cache[0] = ($event) => runExport("pdf"))
              }, [..._cache[4] || (_cache[4] = [
                createBaseVNode("span", null, "PDF", -1)
              ])]),
              createBaseVNode("button", {
                class: "file-menu-item",
                type: "button",
                role: "menuitem",
                onClick: _cache[1] || (_cache[1] = ($event) => runExport("html"))
              }, [..._cache[5] || (_cache[5] = [
                createBaseVNode("span", null, "HTML", -1)
              ])]),
              createBaseVNode("button", {
                class: "file-menu-item",
                type: "button",
                role: "menuitem",
                onClick: _cache[2] || (_cache[2] = ($event) => runExport("png"))
              }, [..._cache[6] || (_cache[6] = [
                createBaseVNode("span", null, "图像 PNG", -1)
              ])])
            ])
          ]),
          _cache[10] || (_cache[10] = createBaseVNode("div", { class: "file-menu-separator" }, null, -1)),
          createBaseVNode("button", {
            class: "file-menu-item",
            type: "button",
            role: "menuitem",
            onClick: _cache[3] || (_cache[3] = ($event) => runMenuAction("settings"))
          }, [..._cache[8] || (_cache[8] = [
            createBaseVNode("span", null, "设置...", -1)
          ])])
        ])) : createCommentVNode("", true)
      ], 512);
    };
  }
};
const _hoisted_1$b = ["aria-expanded"];
const _hoisted_2$8 = {
  key: 0,
  class: "editor-popover paragraph-popover",
  role: "menu"
};
const _hoisted_3$7 = {
  key: 0,
  class: "file-menu-separator"
};
const _hoisted_4$6 = ["onClick"];
const _hoisted_5$5 = {
  key: 0,
  class: "file-menu-arrow"
};
const _hoisted_6$2 = {
  key: 1,
  class: "file-menu-shortcut"
};
const _hoisted_7$2 = {
  key: 0,
  class: "editor-submenu table-submenu",
  role: "menu"
};
const _hoisted_8$2 = {
  key: 0,
  class: "file-menu-separator"
};
const _hoisted_9$2 = ["onClick"];
const _hoisted_10$2 = { class: "file-menu-shortcut" };
const _sfc_main$b = {
  __name: "ParagraphMenu",
  emits: ["command"],
  setup(__props, { emit: __emit }) {
    const emit2 = __emit;
    const isOpen = /* @__PURE__ */ ref(false);
    const menuRef = /* @__PURE__ */ ref(null);
    const menuGroups = [
      [
        { label: "一级标题", shortcut: "Ctrl+1", command: "heading-1" },
        { label: "二级标题", shortcut: "Ctrl+2", command: "heading-2" },
        { label: "三级标题", shortcut: "Ctrl+3", command: "heading-3" },
        { label: "四级标题", shortcut: "Ctrl+4", command: "heading-4" },
        { label: "五级标题", shortcut: "Ctrl+5", command: "heading-5" },
        { label: "六级标题", shortcut: "Ctrl+6", command: "heading-6" }
      ],
      [{ label: "段落", shortcut: "Ctrl+0", command: "paragraph" }],
      [
        { label: "提升标题级别", shortcut: "Ctrl+=", command: "heading-up" },
        { label: "降低标题级别", shortcut: "Ctrl+-", command: "heading-down" }
      ],
      [
        { label: "引用", shortcut: "Ctrl+Shift+Q", command: "quote" },
        { label: "有序列表", shortcut: "Ctrl+Shift+[", command: "ordered-list" },
        { label: "无序列表", shortcut: "Ctrl+Shift+]", command: "unordered-list" },
        { label: "任务列表", shortcut: "Ctrl+Shift+X", command: "task-list" }
      ],
      [
        { label: "在上方插入段落", command: "paragraph-before" },
        { label: "在下方插入段落", command: "paragraph-after" }
      ],
      [
        {
          label: "表格",
          children: [
            { label: "插入表格", shortcut: "Ctrl+T", command: "table-insert" },
            { separator: true },
            { label: "上方插入行", command: "table-row-before" },
            { label: "下方插入行", shortcut: "Ctrl+Enter", command: "table-row-after" },
            { separator: true },
            { label: "左侧插入列", command: "table-column-before" },
            { label: "右侧插入列", command: "table-column-after" },
            { separator: true },
            { label: "删除行", command: "table-row-delete" },
            { label: "删除列", command: "table-column-delete" },
            { separator: true },
            { label: "删除表格", command: "table-delete" }
          ]
        },
        { label: "代码块", shortcut: "Ctrl+Shift+K", command: "code-block" },
        { label: "水平分割线", command: "divider" }
      ]
    ];
    function toggleMenu() {
      isOpen.value = !isOpen.value;
    }
    function runCommand(command) {
      emit2("command", command);
      isOpen.value = false;
    }
    function handlePointerDown(event) {
      if (!isOpen.value || menuRef.value?.contains(event.target)) return;
      isOpen.value = false;
    }
    function handleKeydown(event) {
      if (event.key === "Escape") isOpen.value = false;
    }
    onMounted(() => {
      window.addEventListener("pointerdown", handlePointerDown);
      window.addEventListener("keydown", handleKeydown);
    });
    onUnmounted(() => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeydown);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "menuRef",
        ref: menuRef,
        class: "popup-menu-wrap"
      }, [
        createBaseVNode("button", {
          class: "menu-button menu-bar-button",
          type: "button",
          "aria-haspopup": "menu",
          "aria-expanded": isOpen.value,
          onMousedown: _cache[0] || (_cache[0] = withModifiers(() => {
          }, ["prevent"])),
          onClick: toggleMenu
        }, " 段落(P) ", 40, _hoisted_1$b),
        isOpen.value ? (openBlock(), createElementBlock("div", _hoisted_2$8, [
          (openBlock(), createElementBlock(Fragment, null, renderList(menuGroups, (group, groupIndex) => {
            return openBlock(), createElementBlock(Fragment, { key: groupIndex }, [
              groupIndex > 0 ? (openBlock(), createElementBlock("div", _hoisted_3$7)) : createCommentVNode("", true),
              (openBlock(true), createElementBlock(Fragment, null, renderList(group, (item) => {
                return openBlock(), createElementBlock("div", {
                  key: item.command || item.label,
                  class: normalizeClass(["paragraph-menu-row", { "has-submenu": item.children }])
                }, [
                  createBaseVNode("button", {
                    class: "file-menu-item",
                    type: "button",
                    role: "menuitem",
                    onMousedown: _cache[1] || (_cache[1] = withModifiers(() => {
                    }, ["prevent"])),
                    onClick: ($event) => item.children ? null : runCommand(item.command)
                  }, [
                    createBaseVNode("span", null, toDisplayString(item.label), 1),
                    item.children ? (openBlock(), createElementBlock("span", _hoisted_5$5, "›")) : (openBlock(), createElementBlock("span", _hoisted_6$2, toDisplayString(item.shortcut), 1))
                  ], 40, _hoisted_4$6),
                  item.children ? (openBlock(), createElementBlock("div", _hoisted_7$2, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(item.children, (child, childIndex) => {
                      return openBlock(), createElementBlock(Fragment, {
                        key: child.command || child.label || `separator-${childIndex}`
                      }, [
                        child.separator ? (openBlock(), createElementBlock("div", _hoisted_8$2)) : (openBlock(), createElementBlock("button", {
                          key: 1,
                          class: "file-menu-item",
                          type: "button",
                          role: "menuitem",
                          onMousedown: _cache[2] || (_cache[2] = withModifiers(() => {
                          }, ["prevent"])),
                          onClick: ($event) => runCommand(child.command)
                        }, [
                          createBaseVNode("span", null, toDisplayString(child.label), 1),
                          createBaseVNode("span", _hoisted_10$2, toDisplayString(child.shortcut), 1)
                        ], 40, _hoisted_9$2))
                      ], 64);
                    }), 128))
                  ])) : createCommentVNode("", true)
                ], 2);
              }), 128))
            ], 64);
          }), 64))
        ])) : createCommentVNode("", true)
      ], 512);
    };
  }
};
const _hoisted_1$a = ["aria-expanded"];
const _hoisted_2$7 = {
  key: 0,
  class: "editor-popover format-popover",
  role: "menu"
};
const _hoisted_3$6 = {
  key: 0,
  class: "file-menu-separator"
};
const _hoisted_4$5 = ["onClick"];
const _hoisted_5$4 = { class: "file-menu-shortcut" };
const _sfc_main$a = {
  __name: "FormatMenu",
  emits: ["command"],
  setup(__props, { emit: __emit }) {
    const emit2 = __emit;
    const isOpen = /* @__PURE__ */ ref(false);
    const menuRef = /* @__PURE__ */ ref(null);
    const menuGroups = [
      [
        { label: "加粗", shortcut: "Ctrl+B", command: "bold" },
        { label: "斜体", shortcut: "Ctrl+I", command: "italic" },
        { label: "下划线", shortcut: "Ctrl+U", command: "underline" },
        { label: "代码", shortcut: "Ctrl+Shift+`", command: "inline-code" }
      ],
      [
        { label: "删除线", shortcut: "Alt+Shift+5", command: "strike" },
        { label: "注释", command: "comment" }
      ],
      [{ label: "超链接", shortcut: "Ctrl+K", command: "link" }],
      [{ label: "清除样式", shortcut: "Ctrl+\\", command: "clear-format" }]
    ];
    function toggleMenu() {
      isOpen.value = !isOpen.value;
    }
    function runCommand(command) {
      emit2("command", command);
      isOpen.value = false;
    }
    function handlePointerDown(event) {
      if (!isOpen.value || menuRef.value?.contains(event.target)) return;
      isOpen.value = false;
    }
    function handleKeydown(event) {
      if (event.key === "Escape") isOpen.value = false;
    }
    onMounted(() => {
      window.addEventListener("pointerdown", handlePointerDown);
      window.addEventListener("keydown", handleKeydown);
    });
    onUnmounted(() => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeydown);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "menuRef",
        ref: menuRef,
        class: "popup-menu-wrap"
      }, [
        createBaseVNode("button", {
          class: "menu-button menu-bar-button",
          type: "button",
          "aria-haspopup": "menu",
          "aria-expanded": isOpen.value,
          onMousedown: _cache[0] || (_cache[0] = withModifiers(() => {
          }, ["prevent"])),
          onClick: toggleMenu
        }, " 格式(O) ", 40, _hoisted_1$a),
        isOpen.value ? (openBlock(), createElementBlock("div", _hoisted_2$7, [
          (openBlock(), createElementBlock(Fragment, null, renderList(menuGroups, (group, groupIndex) => {
            return openBlock(), createElementBlock(Fragment, { key: groupIndex }, [
              groupIndex > 0 ? (openBlock(), createElementBlock("div", _hoisted_3$6)) : createCommentVNode("", true),
              (openBlock(true), createElementBlock(Fragment, null, renderList(group, (item) => {
                return openBlock(), createElementBlock("button", {
                  key: item.command,
                  class: "file-menu-item",
                  type: "button",
                  role: "menuitem",
                  onMousedown: _cache[1] || (_cache[1] = withModifiers(() => {
                  }, ["prevent"])),
                  onClick: ($event) => runCommand(item.command)
                }, [
                  createBaseVNode("span", null, toDisplayString(item.label), 1),
                  createBaseVNode("span", _hoisted_5$4, toDisplayString(item.shortcut), 1)
                ], 40, _hoisted_4$5);
              }), 128))
            ], 64);
          }), 64))
        ])) : createCommentVNode("", true)
      ], 512);
    };
  }
};
const themes = {
  classic: "Github",
  paper: "Newsprint",
  night: "Night",
  modern: "Whitey"
};
function normalizeTheme(theme) {
  return themes[theme] ? theme : "classic";
}
const _hoisted_1$9 = ["aria-expanded"];
const _hoisted_2$6 = {
  key: 0,
  class: "theme-popover",
  role: "menu"
};
const _hoisted_3$5 = ["aria-checked", "onClick"];
const _hoisted_4$4 = { class: "theme-check" };
const _sfc_main$9 = {
  __name: "ThemeMenu",
  props: {
    theme: {
      type: String,
      required: true
    }
  },
  emits: ["update:theme"],
  setup(__props, { emit: __emit }) {
    const emit2 = __emit;
    const isOpen = /* @__PURE__ */ ref(false);
    const menuRef = /* @__PURE__ */ ref(null);
    function toggleMenu() {
      isOpen.value = !isOpen.value;
    }
    function selectTheme(theme) {
      emit2("update:theme", theme);
      isOpen.value = false;
    }
    function handlePointerDown(event) {
      if (!isOpen.value || menuRef.value?.contains(event.target)) return;
      isOpen.value = false;
    }
    function handleKeydown(event) {
      if (event.key === "Escape") isOpen.value = false;
    }
    onMounted(() => {
      window.addEventListener("pointerdown", handlePointerDown);
      window.addEventListener("keydown", handleKeydown);
    });
    onUnmounted(() => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeydown);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "menuRef",
        ref: menuRef,
        class: "popup-menu-wrap"
      }, [
        createBaseVNode("button", {
          class: "menu-button",
          type: "button",
          "aria-haspopup": "menu",
          "aria-expanded": isOpen.value,
          onClick: toggleMenu
        }, " 主题(T) ", 8, _hoisted_1$9),
        isOpen.value ? (openBlock(), createElementBlock("div", _hoisted_2$6, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(themes), (label, value) => {
            return openBlock(), createElementBlock("button", {
              key: value,
              class: "theme-option",
              type: "button",
              role: "menuitemradio",
              "aria-checked": __props.theme === value,
              onClick: ($event) => selectTheme(value)
            }, [
              createBaseVNode("span", _hoisted_4$4, toDisplayString(__props.theme === value ? "✓" : ""), 1),
              createBaseVNode("span", null, toDisplayString(label), 1)
            ], 8, _hoisted_3$5);
          }), 128))
        ])) : createCommentVNode("", true)
      ], 512);
    };
  }
};
const _hoisted_1$8 = { class: "topbar" };
const _hoisted_2$5 = {
  class: "menu-actions",
  "aria-label": "应用菜单"
};
const _hoisted_3$4 = {
  class: "actions",
  "aria-label": "视图操作"
};
const _hoisted_4$3 = {
  class: "segmented",
  role: "group",
  "aria-label": "视图切换"
};
const _hoisted_5$3 = ["onClick"];
const _sfc_main$8 = {
  __name: "TopBar",
  props: {
    isDirty: {
      type: Boolean,
      required: true
    },
    view: {
      type: String,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  emits: [
    "create",
    "open",
    "open-folder",
    "open-remote-folder",
    "save",
    "save-as",
    "export",
    "settings",
    "paragraph-command",
    "format-command",
    "update:view",
    "update:theme"
  ],
  setup(__props, { emit: __emit }) {
    const emit2 = __emit;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("header", _hoisted_1$8, [
        createBaseVNode("nav", _hoisted_2$5, [
          createVNode(_sfc_main$c, {
            onCreate: _cache[0] || (_cache[0] = ($event) => emit2("create")),
            onOpen: _cache[1] || (_cache[1] = ($event) => emit2("open")),
            onOpenFolder: _cache[2] || (_cache[2] = ($event) => emit2("open-folder")),
            onOpenRemoteFolder: _cache[3] || (_cache[3] = ($event) => emit2("open-remote-folder")),
            onSave: _cache[4] || (_cache[4] = ($event) => emit2("save")),
            onSaveAs: _cache[5] || (_cache[5] = ($event) => emit2("save-as")),
            onExport: _cache[6] || (_cache[6] = ($event) => emit2("export", $event)),
            onSettings: _cache[7] || (_cache[7] = ($event) => emit2("settings"))
          }),
          createVNode(_sfc_main$b, {
            onCommand: _cache[8] || (_cache[8] = ($event) => emit2("paragraph-command", $event))
          }),
          createVNode(_sfc_main$a, {
            onCommand: _cache[9] || (_cache[9] = ($event) => emit2("format-command", $event))
          }),
          createVNode(_sfc_main$9, {
            theme: __props.theme,
            "onUpdate:theme": _cache[10] || (_cache[10] = ($event) => emit2("update:theme", $event))
          }, null, 8, ["theme"]),
          createBaseVNode("span", {
            class: normalizeClass(["dirty-dot", { "is-visible": __props.isDirty }]),
            "aria-hidden": "true"
          }, null, 2)
        ]),
        createBaseVNode("nav", _hoisted_3$4, [
          createBaseVNode("div", _hoisted_4$3, [
            (openBlock(), createElementBlock(Fragment, null, renderList(["source", "split", "preview"], (viewMode) => {
              return createBaseVNode("button", {
                key: viewMode,
                class: normalizeClass(["segment", { active: __props.view === viewMode }]),
                type: "button",
                onClick: ($event) => emit2("update:view", viewMode)
              }, toDisplayString({ source: "源码", split: "分屏", preview: "预览" }[viewMode]), 11, _hoisted_5$3);
            }), 64))
          ])
        ])
      ]);
    };
  }
};
const _hoisted_1$7 = { class: "pane editor-pane" };
const _hoisted_2$4 = ["value"];
const maxHistorySize = 160;
const _sfc_main$7 = {
  __name: "EditorPane",
  props: /* @__PURE__ */ mergeModels({
    historyKey: {
      type: [Number, String],
      required: true
    },
    filePath: {
      type: String,
      default: null
    },
    defaultFolderPath: {
      type: String,
      default: ""
    },
    imageSavePath: {
      type: String,
      default: "images"
    },
    syncSettings: {
      type: Object,
      default: null
    }
  }, {
    "modelValue": {
      type: String,
      required: true
    },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["status", "image-inserted"], ["update:modelValue"]),
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit2 = __emit;
    const model = useModel(__props, "modelValue");
    const api = window.mdPreview;
    const textareaRef = /* @__PURE__ */ ref(null);
    const history = /* @__PURE__ */ ref([]);
    const historyIndex = /* @__PURE__ */ ref(-1);
    const lastSelection = /* @__PURE__ */ ref({
      start: model.value.length,
      end: model.value.length
    });
    resetHistory(model.value);
    function focusEditor() {
      textareaRef.value?.focus();
    }
    function normalizeSelection(range) {
      const start = Math.max(0, Math.min(range.start, model.value.length));
      const end = Math.max(start, Math.min(range.end, model.value.length));
      return { start, end };
    }
    function rememberSelection() {
      const textarea = textareaRef.value;
      if (!textarea) return lastSelection.value;
      lastSelection.value = normalizeSelection({
        start: textarea.selectionStart,
        end: textarea.selectionEnd
      });
      return lastSelection.value;
    }
    function restoreLastSelection() {
      const textarea = textareaRef.value;
      if (!textarea) return;
      const range = normalizeSelection(lastSelection.value);
      textarea.focus({ preventScroll: true });
      textarea.selectionStart = range.start;
      textarea.selectionEnd = range.end;
      lastSelection.value = range;
    }
    function getSelectionRange() {
      const textarea = textareaRef.value;
      if (textarea && document.activeElement === textarea) return rememberSelection();
      return normalizeSelection(lastSelection.value);
    }
    function createSnapshot(content = model.value, selectionStart, selectionEnd) {
      const range = typeof selectionStart === "number" && typeof selectionEnd === "number" ? { start: selectionStart, end: selectionEnd } : getSelectionRange();
      return {
        content,
        selectionStart: range.start,
        selectionEnd: range.end
      };
    }
    function resetHistory(content) {
      const cursor = content.length;
      lastSelection.value = {
        start: cursor,
        end: cursor
      };
      history.value = [
        {
          content,
          selectionStart: cursor,
          selectionEnd: cursor
        }
      ];
      historyIndex.value = 0;
    }
    function pushHistory(content, selectionStart, selectionEnd) {
      const snapshot = createSnapshot(content, selectionStart, selectionEnd);
      const current = history.value[historyIndex.value];
      if (current?.content === snapshot.content) {
        history.value[historyIndex.value] = snapshot;
        return;
      }
      const nextHistory = history.value.slice(0, historyIndex.value + 1);
      nextHistory.push(snapshot);
      if (nextHistory.length > maxHistorySize) {
        nextHistory.shift();
      }
      history.value = nextHistory;
      historyIndex.value = nextHistory.length - 1;
    }
    function setEditorSelection(selectionStart, selectionEnd) {
      lastSelection.value = normalizeSelection({
        start: selectionStart,
        end: selectionEnd
      });
      requestAnimationFrame(() => {
        if (!textareaRef.value) return;
        textareaRef.value.selectionStart = selectionStart;
        textareaRef.value.selectionEnd = selectionEnd;
        focusEditor();
      });
    }
    function commitEditorValue(nextValue, selectionStart, selectionEnd) {
      model.value = nextValue;
      pushHistory(nextValue, selectionStart, selectionEnd);
      setEditorSelection(selectionStart, selectionEnd);
    }
    function replaceSelection(nextValue, selectionStart, selectionEnd) {
      commitEditorValue(nextValue, selectionStart, selectionEnd);
    }
    function wrapSelection(before, after = before, placeholder = "文本") {
      const { start, end } = getSelectionRange();
      const selected = model.value.slice(start, end) || placeholder;
      const inserted = `${before}${selected}${after}`;
      const nextValue = `${model.value.slice(0, start)}${inserted}${model.value.slice(end)}`;
      const selectedStart = start + before.length;
      const selectedEnd = selectedStart + selected.length;
      replaceSelection(nextValue, selectedStart, selectedEnd);
    }
    function updateSelectedLines(transformLine) {
      const { start, end } = getSelectionRange();
      const { lineStart, lineEnd } = getLineBounds(start, end);
      const block2 = model.value.slice(lineStart, lineEnd);
      const nextBlock = block2.split("\n").map((line) => transformLine(line)).join("\n");
      replaceSelection(
        `${model.value.slice(0, lineStart)}${nextBlock}${model.value.slice(lineEnd)}`,
        lineStart,
        lineStart + nextBlock.length
      );
    }
    function getLineBounds(start, end) {
      const lineStart = model.value.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
      const nextBreak = model.value.indexOf("\n", end);
      const lineEnd = nextBreak === -1 ? model.value.length : nextBreak;
      return { lineStart, lineEnd };
    }
    function setHeadingLevel(level) {
      updateSelectedLines((line) => {
        const cleanLine = stripBlockMarker(line);
        return level > 0 ? `${"#".repeat(level)} ${cleanLine || "标题"}` : cleanLine;
      });
    }
    function adjustHeadingLevel(offset) {
      updateSelectedLines((line) => {
        const match2 = /^(#{1,6})\s+(.*)$/.exec(line);
        const nextLevel = Math.min(6, Math.max(1, (match2?.[1].length || 0) + offset));
        const text2 = match2?.[2] || line || "标题";
        return `${"#".repeat(nextLevel)} ${text2}`;
      });
    }
    function stripBlockMarker(line) {
      return line.replace(/^#{1,6}\s+/, "").replace(/^>\s?/, "").replace(/^[-*+]\s+\[[ xX]\]\s+/, "").replace(/^[-*+]\s+/, "").replace(/^\d+[.)]\s+/, "");
    }
    function prefixLines(prefix, placeholder) {
      updateSelectedLines((line) => {
        const cleanLine = stripBlockMarker(line);
        return `${prefix}${cleanLine || placeholder}`;
      });
    }
    function insertLink() {
      const { start, end } = getSelectionRange();
      const selected = model.value.slice(start, end) || "链接文本";
      const inserted = `[${selected}](https://)`;
      const nextValue = `${model.value.slice(0, start)}${inserted}${model.value.slice(end)}`;
      const urlStart = start + selected.length + 3;
      replaceSelection(nextValue, urlStart, urlStart + 8);
    }
    function insertPlainText(text2) {
      const { start, end } = getSelectionRange();
      const nextValue = `${model.value.slice(0, start)}${text2}${model.value.slice(end)}`;
      const nextCursor = start + text2.length;
      replaceSelection(nextValue, nextCursor, nextCursor);
    }
    function insertCode() {
      const { start, end } = getSelectionRange();
      const selected = model.value.slice(start, end);
      if (selected.includes("\n")) {
        const inserted = `
\`\`\`
${selected || "代码"}
\`\`\`
`;
        replaceSelection(
          `${model.value.slice(0, start)}${inserted}${model.value.slice(end)}`,
          start + 5,
          start + 5 + (selected || "代码").length
        );
        return;
      }
      wrapSelection("`", "`", "代码");
    }
    function insertCodeBlock() {
      const { start, end } = getSelectionRange();
      const selected = model.value.slice(start, end) || "代码";
      const inserted = `
\`\`\`
${selected}
\`\`\`
`;
      replaceSelection(
        `${model.value.slice(0, start)}${inserted}${model.value.slice(end)}`,
        start + 5,
        start + 5 + selected.length
      );
    }
    function insertDivider() {
      const { start, end } = getSelectionRange();
      const inserted = `${start > 0 ? "\n\n" : ""}---

`;
      const nextValue = `${model.value.slice(0, start)}${inserted}${model.value.slice(end)}`;
      const nextCursor = start + inserted.length;
      replaceSelection(nextValue, nextCursor, nextCursor);
    }
    function getCursorLineIndex(start) {
      return model.value.slice(0, start).split("\n").length - 1;
    }
    function isTableLine(line) {
      return line.includes("|");
    }
    function isTableSeparatorLine(line) {
      return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
    }
    function splitTableLine(line) {
      const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
      return trimmed.split("|").map((cell) => cell.trim());
    }
    function formatTableRow(cells) {
      return `| ${cells.join(" | ")} |`;
    }
    function findTableBlock() {
      const range = getSelectionRange();
      const lines = model.value.split("\n");
      const lineIndex = getCursorLineIndex(range.start);
      if (!isTableLine(lines[lineIndex] || "")) return null;
      let start = lineIndex;
      let end = lineIndex;
      while (start > 0 && isTableLine(lines[start - 1])) start -= 1;
      while (end < lines.length - 1 && isTableLine(lines[end + 1])) end += 1;
      const block2 = lines.slice(start, end + 1);
      const separatorIndex = block2.findIndex(isTableSeparatorLine);
      if (separatorIndex === -1) return null;
      const rowCells = block2.map(splitTableLine);
      const columnCount = Math.max(...rowCells.map((cells) => cells.length), 1);
      const normalizedRows = rowCells.map((cells, index) => {
        const nextCells = cells.slice(0, columnCount);
        while (nextCells.length < columnCount) nextCells.push(index === separatorIndex ? "---" : "");
        return index === separatorIndex ? Array.from({ length: columnCount }, () => "---") : nextCells;
      });
      return {
        lines,
        start,
        end,
        lineIndex,
        separatorIndex: start + separatorIndex,
        rows: normalizedRows,
        columnCount
      };
    }
    function replaceTableBlock(table2, rows, cursorRowOffset = 0) {
      const nextLines = [...table2.lines];
      nextLines.splice(table2.start, table2.end - table2.start + 1, ...rows.map(formatTableRow));
      const nextValue = nextLines.join("\n");
      const targetLine = Math.min(table2.start + cursorRowOffset, nextLines.length - 1);
      const selectionStart = nextLines.slice(0, targetLine).join("\n").length + (targetLine > 0 ? 1 : 0);
      commitEditorValue(nextValue, selectionStart, selectionStart);
    }
    function insertTable() {
      const { start, end } = getSelectionRange();
      const table2 = [
        "| 标题 | 标题 | 标题 |",
        "| --- | --- | --- |",
        "| 内容 | 内容 | 内容 |"
      ].join("\n");
      const prefix = start > 0 && model.value[start - 1] !== "\n" ? "\n\n" : "";
      const suffix = end < model.value.length && model.value[end] !== "\n" ? "\n\n" : "\n";
      const inserted = `${prefix}${table2}${suffix}`;
      const nextValue = `${model.value.slice(0, start)}${inserted}${model.value.slice(end)}`;
      const cursor = start + prefix.length + table2.length;
      replaceSelection(nextValue, cursor, cursor);
    }
    function insertTableRow(position) {
      const table2 = findTableBlock();
      if (!table2) {
        insertTable();
        return;
      }
      const rows = table2.rows.map((row) => [...row]);
      table2.lineIndex - table2.start;
      const safeLine = table2.lineIndex === table2.separatorIndex ? table2.separatorIndex + 1 : table2.lineIndex;
      const insertIndex = position === "before" ? Math.max(0, safeLine - table2.start) : Math.min(rows.length, safeLine - table2.start + 1);
      rows.splice(insertIndex, 0, Array.from({ length: table2.columnCount }, () => ""));
      replaceTableBlock(table2, rows, insertIndex);
    }
    function insertTableColumn(position) {
      const table2 = findTableBlock();
      if (!table2) {
        insertTable();
        return;
      }
      const { start } = getSelectionRange();
      const currentLineStart = model.value.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
      const beforeCursor = model.value.slice(currentLineStart, start);
      const currentColumn = Math.max(0, beforeCursor.split("|").length - 2);
      const insertIndex = position === "before" ? currentColumn : Math.min(table2.columnCount, currentColumn + 1);
      const rows = table2.rows.map((row, index) => {
        const nextRow = [...row];
        nextRow.splice(insertIndex, 0, table2.start + index === table2.separatorIndex ? "---" : "");
        return nextRow;
      });
      replaceTableBlock(table2, rows, table2.lineIndex - table2.start);
    }
    function deleteTableRow() {
      const table2 = findTableBlock();
      if (!table2) return;
      const relativeLine = table2.lineIndex - table2.start;
      if (table2.lineIndex === table2.separatorIndex || table2.rows.length <= 3) return;
      const rows = table2.rows.filter((_row, index) => index !== relativeLine);
      replaceTableBlock(table2, rows, Math.min(relativeLine, rows.length - 1));
    }
    function deleteTableColumn() {
      const table2 = findTableBlock();
      if (!table2 || table2.columnCount <= 1) return;
      const { start } = getSelectionRange();
      const currentLineStart = model.value.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
      const beforeCursor = model.value.slice(currentLineStart, start);
      const columnIndex = Math.max(0, Math.min(table2.columnCount - 1, beforeCursor.split("|").length - 2));
      const rows = table2.rows.map((row) => row.filter((_cell, index) => index !== columnIndex));
      replaceTableBlock(table2, rows, table2.lineIndex - table2.start);
    }
    function deleteTable() {
      const table2 = findTableBlock();
      if (!table2) return;
      const nextLines = [...table2.lines];
      nextLines.splice(table2.start, table2.end - table2.start + 1);
      const nextValue = nextLines.join("\n");
      const targetLine = Math.min(table2.start, nextLines.length - 1);
      const selectionStart = targetLine >= 0 ? nextLines.slice(0, targetLine).join("\n").length + (targetLine > 0 ? 1 : 0) : 0;
      commitEditorValue(nextValue, selectionStart, selectionStart);
    }
    function insertParagraphBefore() {
      const { start, end } = getSelectionRange();
      const { lineStart } = getLineBounds(start, end);
      const inserted = "\n";
      const nextCursor = lineStart;
      replaceSelection(
        `${model.value.slice(0, lineStart)}${inserted}${model.value.slice(lineStart)}`,
        nextCursor,
        nextCursor
      );
    }
    function insertParagraphAfter() {
      const { start, end } = getSelectionRange();
      const { lineEnd } = getLineBounds(start, end);
      const inserted = "\n";
      const nextCursor = lineEnd + inserted.length;
      replaceSelection(
        `${model.value.slice(0, lineEnd)}${inserted}${model.value.slice(lineEnd)}`,
        nextCursor,
        nextCursor
      );
    }
    function insertComment() {
      const { start, end } = getSelectionRange();
      const selected = model.value.slice(start, end) || "注释";
      const inserted = `<!-- ${selected} -->`;
      replaceSelection(
        `${model.value.slice(0, start)}${inserted}${model.value.slice(end)}`,
        start + 5,
        start + 5 + selected.length
      );
    }
    function clearFormat() {
      const { start, end } = getSelectionRange();
      const selected = model.value.slice(start, end);
      if (!selected) return;
      const nextText = selected.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/__([^_]+)__/g, "$1").replace(/\*([^*]+)\*/g, "$1").replace(/_([^_]+)_/g, "$1").replace(/~~([^~]+)~~/g, "$1").replace(/`([^`]+)`/g, "$1").replace(/<u>(.*?)<\/u>/g, "$1").replace(/\[([^\]]+)]\([^)]+\)/g, "$1");
      replaceSelection(
        `${model.value.slice(0, start)}${nextText}${model.value.slice(end)}`,
        start,
        start + nextText.length
      );
    }
    function runCommand(command) {
      restoreLastSelection();
      if (/^heading-[1-6]$/.test(command)) {
        setHeadingLevel(Number(command.at(-1)));
        return;
      }
      const commandMap = {
        paragraph: () => setHeadingLevel(0),
        "heading-up": () => adjustHeadingLevel(-1),
        "heading-down": () => adjustHeadingLevel(1),
        quote: () => prefixLines("> ", "引用"),
        "ordered-list": () => prefixLines("1. ", "列表项"),
        "unordered-list": () => prefixLines("- ", "列表项"),
        "task-list": () => prefixLines("- [ ] ", "任务"),
        "paragraph-before": insertParagraphBefore,
        "paragraph-after": insertParagraphAfter,
        "table-insert": insertTable,
        "table-row-before": () => insertTableRow("before"),
        "table-row-after": () => insertTableRow("after"),
        "table-column-before": () => insertTableColumn("before"),
        "table-column-after": () => insertTableColumn("after"),
        "table-row-delete": deleteTableRow,
        "table-column-delete": deleteTableColumn,
        "table-delete": deleteTable,
        "code-block": insertCodeBlock,
        divider: insertDivider,
        bold: () => wrapSelection("**"),
        italic: () => wrapSelection("*"),
        underline: () => wrapSelection("<u>", "</u>"),
        "inline-code": insertCode,
        strike: () => wrapSelection("~~"),
        comment: insertComment,
        link: insertLink,
        "clear-format": clearFormat
      };
      commandMap[command]?.();
    }
    function handleTab(event) {
      event.preventDefault();
      const textarea = event.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const nextValue = `${model.value.slice(0, start)}  ${model.value.slice(end)}`;
      const nextCursor = start + 2;
      commitEditorValue(nextValue, nextCursor, nextCursor);
    }
    function restoreHistory(targetIndex) {
      const snapshot = history.value[targetIndex];
      if (!snapshot) return;
      historyIndex.value = targetIndex;
      model.value = snapshot.content;
      setEditorSelection(snapshot.selectionStart, snapshot.selectionEnd);
    }
    function undoEdit() {
      if (historyIndex.value <= 0) return;
      restoreHistory(historyIndex.value - 1);
    }
    function redoEdit() {
      if (historyIndex.value >= history.value.length - 1) return;
      restoreHistory(historyIndex.value + 1);
    }
    function handleInput(event) {
      const textarea = event.target;
      lastSelection.value = normalizeSelection({
        start: textarea.selectionStart,
        end: textarea.selectionEnd
      });
      commitEditorValue(textarea.value, textarea.selectionStart, textarea.selectionEnd);
    }
    function handleKeydown(event) {
      const key = event.key.toLowerCase();
      const isModifierPressed = event.ctrlKey || event.metaKey;
      if (isModifierPressed && key === "z") {
        event.preventDefault();
        if (event.shiftKey) redoEdit();
        else undoEdit();
        return;
      }
      if (isModifierPressed && key === "y") {
        event.preventDefault();
        redoEdit();
        return;
      }
      if (isModifierPressed && /^[0-6]$/.test(key)) {
        event.preventDefault();
        setHeadingLevel(Number(key));
        return;
      }
      if (isModifierPressed && key === "b") {
        event.preventDefault();
        runCommand("bold");
        return;
      }
      if (isModifierPressed && key === "i") {
        event.preventDefault();
        runCommand("italic");
        return;
      }
      if (isModifierPressed && key === "u") {
        event.preventDefault();
        runCommand("underline");
        return;
      }
      if (isModifierPressed && key === "k" && !event.shiftKey) {
        event.preventDefault();
        runCommand("link");
        return;
      }
      if (isModifierPressed && key === "t") {
        event.preventDefault();
        runCommand("table-insert");
        return;
      }
      if (isModifierPressed && event.key === "Enter") {
        event.preventDefault();
        runCommand("table-row-after");
        return;
      }
      if (isModifierPressed && event.shiftKey && key === "k") {
        event.preventDefault();
        runCommand("code-block");
        return;
      }
      if (isModifierPressed && event.shiftKey && key === "q") {
        event.preventDefault();
        runCommand("quote");
        return;
      }
      if (isModifierPressed && event.shiftKey && event.code === "BracketLeft") {
        event.preventDefault();
        runCommand("ordered-list");
        return;
      }
      if (isModifierPressed && event.shiftKey && event.code === "BracketRight") {
        event.preventDefault();
        runCommand("unordered-list");
        return;
      }
      if (isModifierPressed && event.shiftKey && key === "x") {
        event.preventDefault();
        runCommand("task-list");
        return;
      }
      if (isModifierPressed && (key === "=" || key === "+")) {
        event.preventDefault();
        runCommand("heading-up");
        return;
      }
      if (isModifierPressed && key === "-") {
        event.preventDefault();
        runCommand("heading-down");
        return;
      }
      if (isModifierPressed && key === "\\") {
        event.preventDefault();
        runCommand("clear-format");
        return;
      }
      if (event.altKey && event.shiftKey && key === "5") {
        event.preventDefault();
        runCommand("strike");
        return;
      }
      if (isModifierPressed && event.shiftKey && event.code === "Backquote") {
        event.preventDefault();
        runCommand("inline-code");
        return;
      }
      if (event.key === "Tab") {
        handleTab(event);
      }
    }
    function hasClipboardImage(event) {
      return [...event.clipboardData?.items || []].some((item) => item.type.startsWith("image/"));
    }
    function toSerializable(value) {
      if (!value) return null;
      return JSON.parse(JSON.stringify(value));
    }
    async function handlePaste(event) {
      const text2 = event.clipboardData?.getData("text/plain");
      if (!hasClipboardImage(event) && text2) return;
      event.preventDefault();
      rememberSelection();
      if (typeof api?.saveClipboardImage !== "function") {
        emit2("status", "粘贴图片功能需要重启应用后生效");
        return;
      }
      try {
        const result = await api.saveClipboardImage({
          markdownFilePath: props.filePath || null,
          defaultFolderPath: props.defaultFolderPath || null,
          imageSavePath: props.imageSavePath || "images",
          syncSettings: toSerializable(props.syncSettings)
        });
        if (result?.canceled) {
          if (result.reason === "empty") emit2("status", "剪贴板里没有可粘贴的图片");
          return;
        }
        insertPlainText(`![image](${result.markdownPath})`);
        if (result.cleanup) {
          emit2("image-inserted", {
            ...result.cleanup,
            syncSettings: toSerializable(props.syncSettings)
          });
        }
        emit2("status", `已插入图片 ${result.markdownPath}`);
      } catch (error2) {
        emit2("status", `插入图片失败：${error2.message}`);
      }
    }
    function scrollToLine(lineIndex = 0) {
      const textarea = textareaRef.value;
      if (!textarea) return;
      const lines = model.value.split("\n");
      const safeLineIndex = Math.max(0, Math.min(Number(lineIndex) || 0, lines.length - 1));
      const selectionStart = safeLineIndex === 0 ? 0 : lines.slice(0, safeLineIndex).join("\n").length + 1;
      const lineHeight = Number.parseFloat(window.getComputedStyle(textarea).lineHeight) || 24;
      const targetTop = Math.max(0, safeLineIndex * lineHeight - textarea.clientHeight * 0.18);
      lastSelection.value = {
        start: selectionStart,
        end: selectionStart
      };
      textarea.selectionStart = selectionStart;
      textarea.selectionEnd = selectionStart;
      textarea.scrollTo({
        top: targetTop,
        behavior: "smooth"
      });
    }
    watch(
      () => props.historyKey,
      () => {
        resetHistory(model.value);
      },
      { flush: "post" }
    );
    __expose({
      runCommand,
      scrollToLine
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$7, [
        createBaseVNode("textarea", {
          ref_key: "textareaRef",
          ref: textareaRef,
          value: model.value,
          spellcheck: "false",
          "aria-label": "Markdown 源码编辑器",
          onInput: handleInput,
          onKeydown: handleKeydown,
          onSelect: rememberSelection,
          onPaste: handlePaste,
          onKeyup: rememberSelection,
          onMouseup: rememberSelection,
          onFocus: rememberSelection,
          onBlur: rememberSelection
        }, null, 40, _hoisted_2$4)
      ]);
    };
  }
};
const _hoisted_1$6 = ["innerHTML"];
const _sfc_main$6 = {
  __name: "PreviewPane",
  props: {
    html: {
      type: String,
      required: true
    }
  },
  emits: ["status"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit2 = __emit;
    const api = window.mdPreview;
    const previewRef = /* @__PURE__ */ ref(null);
    const imageMenu = /* @__PURE__ */ ref({
      visible: false,
      x: 0,
      y: 0,
      src: "",
      link: ""
    });
    function decorateLinks() {
      document.querySelectorAll(".markdown-body a[href]").forEach((link2) => {
        link2.setAttribute("target", "_blank");
        link2.setAttribute("rel", "noreferrer");
      });
    }
    function closeImageMenu() {
      imageMenu.value.visible = false;
    }
    function openImageMenu(event) {
      const image2 = event.target?.closest?.("img");
      if (!image2 || !previewRef.value?.contains(image2)) return;
      event.preventDefault();
      imageMenu.value = {
        visible: true,
        x: Math.min(event.clientX, window.innerWidth - 150),
        y: Math.min(event.clientY, window.innerHeight - 86),
        src: image2.currentSrc || image2.src,
        link: image2.dataset.originalSrc || image2.currentSrc || image2.src
      };
    }
    async function copyImage() {
      const source = imageMenu.value.src;
      closeImageMenu();
      try {
        if (typeof api?.copyImageToClipboard !== "function") {
          emit2("status", "复制图片功能需要重启应用后生效");
          return;
        }
        await api.copyImageToClipboard(source);
        emit2("status", "图片已复制到剪贴板");
      } catch (error2) {
        emit2("status", `复制图片失败：${error2.message}`);
      }
    }
    async function copyImageLink() {
      const source = imageMenu.value.link;
      closeImageMenu();
      try {
        if (typeof api?.copyTextToClipboard !== "function") {
          emit2("status", "复制链接功能需要重启应用后生效");
          return;
        }
        await api.copyTextToClipboard(source);
        emit2("status", "图片链接已复制");
      } catch (error2) {
        emit2("status", `复制链接失败：${error2.message}`);
      }
    }
    function handleKeydown(event) {
      if (event.key === "Escape") closeImageMenu();
    }
    onMounted(() => {
      window.addEventListener("pointerdown", closeImageMenu);
      window.addEventListener("keydown", handleKeydown);
    });
    onUnmounted(() => {
      window.removeEventListener("pointerdown", closeImageMenu);
      window.removeEventListener("keydown", handleKeydown);
    });
    watch(
      () => props.html,
      async () => {
        await nextTick();
        decorateLinks();
        closeImageMenu();
      },
      { immediate: true }
    );
    function scrollToOutline(item) {
      const headings = previewRef.value?.querySelectorAll?.(".markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6");
      const heading2 = headings?.[item?.headingIndex];
      if (!heading2) return;
      heading2.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
    __expose({
      scrollToOutline
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "previewRef",
        ref: previewRef,
        class: "pane preview-pane",
        onContextmenu: openImageMenu
      }, [
        createBaseVNode("article", {
          class: "markdown-body",
          innerHTML: __props.html
        }, null, 8, _hoisted_1$6),
        imageMenu.value.visible ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "image-context-menu",
          style: normalizeStyle({ left: `${imageMenu.value.x}px`, top: `${imageMenu.value.y}px` }),
          role: "menu",
          onPointerdown: _cache[0] || (_cache[0] = withModifiers(() => {
          }, ["stop"]))
        }, [
          createBaseVNode("button", {
            class: "file-menu-item",
            type: "button",
            role: "menuitem",
            onClick: copyImage
          }, [..._cache[1] || (_cache[1] = [
            createBaseVNode("span", null, "复制图片", -1)
          ])]),
          createBaseVNode("button", {
            class: "file-menu-item",
            type: "button",
            role: "menuitem",
            onClick: copyImageLink
          }, [..._cache[2] || (_cache[2] = [
            createBaseVNode("span", null, "复制链接", -1)
          ])])
        ], 36)) : createCommentVNode("", true)
      ], 544);
    };
  }
};
const _hoisted_1$5 = { class: "statusbar" };
const _sfc_main$5 = {
  __name: "StatusBar",
  props: {
    status: {
      type: String,
      required: true
    },
    stats: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("footer", _hoisted_1$5, [
        createBaseVNode("span", null, toDisplayString(__props.status), 1),
        createBaseVNode("span", null, toDisplayString(__props.stats), 1)
      ]);
    };
  }
};
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$4 = {};
const _hoisted_1$4 = { class: "shell" };
function _sfc_render(_ctx, _cache) {
  return openBlock(), createElementBlock("main", _hoisted_1$4, [..._cache[0] || (_cache[0] = [
    createBaseVNode("section", { class: "startup-error" }, [
      createBaseVNode("h1", null, "MdPreview 没有连接到桌面 API"),
      createBaseVNode("p", null, [
        createTextVNode(" 请通过 "),
        createBaseVNode("code", null, "npm run dev"),
        createTextVNode(" 或打包后的 "),
        createBaseVNode("code", null, "MdPreview.exe"),
        createTextVNode(" 启动，不要直接用浏览器打开 HTML。 ")
      ])
    ], -1)
  ])]);
}
const StartupError = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render]]);
const _hoisted_1$3 = {
  class: "file-sidebar",
  "aria-label": "Markdown 文件夹"
};
const _hoisted_2$3 = { class: "file-sidebar-header" };
const _hoisted_3$3 = {
  key: 0,
  class: "empty-folder"
};
const _hoisted_4$2 = ["title", "onClick", "onContextmenu"];
const _hoisted_5$2 = { class: "folder-file-title" };
const _hoisted_6$1 = { class: "folder-file-base" };
const _hoisted_7$1 = { class: "folder-file-ext" };
const _hoisted_8$1 = { class: "folder-file-summary" };
const _hoisted_9$1 = {
  key: 0,
  class: "file-menu-separator"
};
const _hoisted_10$1 = ["disabled", "onClick"];
const _hoisted_11$1 = {
  key: 1,
  class: "outline-list"
};
const _hoisted_12$1 = {
  key: 0,
  class: "empty-folder"
};
const _hoisted_13$1 = ["onClick"];
const _hoisted_14$1 = { class: "file-sidebar-footer" };
const _hoisted_15$1 = { class: "folder-footer-name" };
const _hoisted_16$1 = { class: "folder-count" };
const _sfc_main$3 = {
  __name: "FileSidebar",
  props: {
    folderName: {
      type: String,
      required: true
    },
    files: {
      type: Array,
      required: true
    },
    outline: {
      type: Array,
      default: () => []
    },
    activeFilePath: {
      type: String,
      default: null
    }
  },
  emits: ["create-file", "open-file", "folder-action", "select-outline"],
  setup(__props, { emit: __emit }) {
    const emit2 = __emit;
    const activeTab = /* @__PURE__ */ ref("files");
    const contextMenu = /* @__PURE__ */ ref({
      visible: false,
      x: 0,
      y: 0,
      file: null
    });
    const menuItems = [
      { label: "新建文件", action: "new-file" },
      { label: "新建文件夹", action: "new-folder" },
      { separator: true },
      { label: "重命名", action: "rename", needsFile: true },
      { label: "创建副本", action: "duplicate", needsFile: true },
      { label: "删除", action: "delete", needsFile: true, danger: true },
      { separator: true },
      { label: "打开文件位置", action: "show-location", needsFile: true }
    ];
    function closeContextMenu() {
      contextMenu.value.visible = false;
    }
    function openContextMenu(event, file = null) {
      if (activeTab.value !== "files") return;
      event.preventDefault();
      contextMenu.value = {
        visible: true,
        x: Math.min(event.clientX, window.innerWidth - 150),
        y: Math.min(event.clientY, window.innerHeight - 232),
        file
      };
    }
    function runMenuAction(item) {
      if (item.separator || item.needsFile && !contextMenu.value.file) return;
      emit2("folder-action", {
        action: item.action,
        file: contextMenu.value.file
      });
      closeContextMenu();
    }
    function handleKeydown(event) {
      if (event.key === "Escape") closeContextMenu();
    }
    onMounted(() => {
      window.addEventListener("pointerdown", closeContextMenu);
      window.addEventListener("keydown", handleKeydown);
    });
    onUnmounted(() => {
      window.removeEventListener("pointerdown", closeContextMenu);
      window.removeEventListener("keydown", handleKeydown);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("aside", _hoisted_1$3, [
        createBaseVNode("header", _hoisted_2$3, [
          createBaseVNode("button", {
            class: normalizeClass(["file-sidebar-tab", { active: activeTab.value === "files" }]),
            type: "button",
            onClick: _cache[0] || (_cache[0] = ($event) => activeTab.value = "files")
          }, " 文件 ", 2),
          createBaseVNode("button", {
            class: normalizeClass(["file-sidebar-tab", { active: activeTab.value === "outline" }]),
            type: "button",
            onClick: _cache[1] || (_cache[1] = ($event) => activeTab.value = "outline")
          }, " 大纲 ", 2)
        ]),
        activeTab.value === "files" ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "file-sidebar-list",
          onContextmenu: _cache[3] || (_cache[3] = ($event) => openContextMenu($event))
        }, [
          __props.files.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_3$3, "没有 Markdown 文件")) : (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList(__props.files, (file) => {
            return openBlock(), createElementBlock("button", {
              key: file.filePath,
              class: normalizeClass(["folder-file", { active: file.filePath === __props.activeFilePath }]),
              type: "button",
              title: file.relativePath,
              onClick: ($event) => emit2("open-file", file.filePath),
              onContextmenu: withModifiers(($event) => openContextMenu($event, file), ["stop"])
            }, [
              createBaseVNode("span", _hoisted_5$2, [
                createBaseVNode("span", _hoisted_6$1, toDisplayString(file.baseName || file.fileName), 1),
                createBaseVNode("span", _hoisted_7$1, toDisplayString(file.extension || ""), 1)
              ]),
              createBaseVNode("span", _hoisted_8$1, toDisplayString(file.summary || file.relativePath), 1)
            ], 42, _hoisted_4$2);
          }), 128)),
          contextMenu.value.visible ? (openBlock(), createElementBlock("div", {
            key: 2,
            class: "folder-context-menu",
            style: normalizeStyle({ left: `${contextMenu.value.x}px`, top: `${contextMenu.value.y}px` }),
            role: "menu",
            onPointerdown: _cache[2] || (_cache[2] = withModifiers(() => {
            }, ["stop"]))
          }, [
            (openBlock(), createElementBlock(Fragment, null, renderList(menuItems, (item, index) => {
              return openBlock(), createElementBlock(Fragment, {
                key: item.action || `separator-${index}`
              }, [
                item.separator ? (openBlock(), createElementBlock("div", _hoisted_9$1)) : (openBlock(), createElementBlock("button", {
                  key: 1,
                  class: normalizeClass(["file-menu-item", { danger: item.danger }]),
                  type: "button",
                  role: "menuitem",
                  disabled: item.needsFile && !contextMenu.value.file,
                  onClick: ($event) => runMenuAction(item)
                }, [
                  createBaseVNode("span", null, toDisplayString(item.label), 1)
                ], 10, _hoisted_10$1))
              ], 64);
            }), 64))
          ], 36)) : createCommentVNode("", true)
        ], 32)) : (openBlock(), createElementBlock("div", _hoisted_11$1, [
          __props.outline.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_12$1, "当前文件没有标题")) : (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList(__props.outline, (item) => {
            return openBlock(), createElementBlock("button", {
              key: item.id,
              class: normalizeClass(["outline-item", `level-${item.level}`]),
              type: "button",
              onClick: ($event) => emit2("select-outline", item)
            }, toDisplayString(item.title), 11, _hoisted_13$1);
          }), 128))
        ])),
        createBaseVNode("footer", _hoisted_14$1, [
          createBaseVNode("button", {
            class: "folder-add",
            type: "button",
            title: "新建 Markdown 文件",
            onClick: _cache[4] || (_cache[4] = ($event) => emit2("create-file"))
          }, " + "),
          createBaseVNode("span", _hoisted_15$1, toDisplayString(__props.folderName), 1),
          createBaseVNode("span", _hoisted_16$1, toDisplayString(__props.files.length), 1)
        ])
      ]);
    };
  }
};
const _hoisted_1$2 = {
  key: 0,
  class: "dialog-backdrop",
  role: "presentation"
};
const _hoisted_2$2 = {
  class: "unsaved-dialog",
  role: "dialog",
  "aria-modal": "true",
  "aria-labelledby": "unsavedTitle"
};
const _hoisted_3$2 = { class: "unsaved-actions" };
const _sfc_main$2 = {
  __name: "UnsavedDialog",
  props: {
    open: {
      type: Boolean,
      required: true
    }
  },
  emits: ["save", "discard", "cancel"],
  setup(__props, { emit: __emit }) {
    const emit2 = __emit;
    return (_ctx, _cache) => {
      return __props.open ? (openBlock(), createElementBlock("div", _hoisted_1$2, [
        createBaseVNode("section", _hoisted_2$2, [
          _cache[3] || (_cache[3] = createBaseVNode("h2", { id: "unsavedTitle" }, "保存", -1)),
          _cache[4] || (_cache[4] = createBaseVNode("p", null, "是否保存更改？", -1)),
          _cache[5] || (_cache[5] = createBaseVNode("p", null, "如果不保存，您的更改将会丢失。", -1)),
          createBaseVNode("div", _hoisted_3$2, [
            createBaseVNode("button", {
              class: "dialog-button primary",
              type: "button",
              onClick: _cache[0] || (_cache[0] = ($event) => emit2("save"))
            }, "保存"),
            createBaseVNode("button", {
              class: "dialog-button",
              type: "button",
              onClick: _cache[1] || (_cache[1] = ($event) => emit2("discard"))
            }, "丢弃"),
            createBaseVNode("button", {
              class: "dialog-button cancel",
              type: "button",
              onClick: _cache[2] || (_cache[2] = ($event) => emit2("cancel"))
            }, "取消")
          ])
        ])
      ])) : createCommentVNode("", true);
    };
  }
};
const _hoisted_1$1 = {
  class: "settings-page",
  "aria-labelledby": "settingsTitle"
};
const _hoisted_2$1 = { class: "settings-page-header" };
const _hoisted_3$1 = { class: "settings-page-body" };
const _hoisted_4$1 = {
  class: "settings-tabs",
  "aria-label": "设置分类"
};
const _hoisted_5$1 = ["onClick"];
const _hoisted_6 = { class: "settings-panel" };
const _hoisted_7 = {
  key: 0,
  class: "settings-section"
};
const _hoisted_8 = { class: "settings-row" };
const _hoisted_9 = {
  key: 0,
  class: "settings-row"
};
const _hoisted_10 = { class: "settings-inline" };
const _hoisted_11 = { key: 1 };
const _hoisted_12 = { class: "settings-form-grid" };
const _hoisted_13 = { class: "settings-field" };
const _hoisted_14 = { class: "settings-field" };
const _hoisted_15 = { class: "settings-field" };
const _hoisted_16 = { class: "settings-field" };
const _hoisted_17 = { class: "settings-field" };
const _hoisted_18 = { class: "settings-field" };
const _hoisted_19 = { class: "settings-field" };
const _hoisted_20 = { class: "settings-field" };
const _hoisted_21 = { class: "settings-check" };
const _hoisted_22 = {
  key: 1,
  class: "settings-section"
};
const _hoisted_23 = { class: "settings-form-grid" };
const _hoisted_24 = { class: "settings-field" };
const _hoisted_25 = { class: "settings-field" };
const _hoisted_26 = { class: "settings-field" };
const _hoisted_27 = { class: "settings-field" };
const _hoisted_28 = { class: "settings-field" };
const _hoisted_29 = { class: "settings-field" };
const _hoisted_30 = { class: "settings-page-footer" };
const _sfc_main$1 = {
  __name: "SettingsPage",
  props: {
    settings: {
      type: Object,
      required: true
    }
  },
  emits: ["close", "status", "save-image", "save-remote"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit2 = __emit;
    const activeTab = /* @__PURE__ */ ref("image");
    const tabs = [
      { key: "image", label: "图像设置" },
      { key: "remote", label: "远程设置" }
    ];
    function cloneSettings(settings) {
      return JSON.parse(JSON.stringify(settings));
    }
    const localSettings = /* @__PURE__ */ ref(cloneSettings(props.settings));
    watch(
      () => props.settings,
      (settings) => {
        localSettings.value = cloneSettings(settings);
      },
      { deep: true }
    );
    function saveCurrentSettings() {
      if (activeTab.value === "image") {
        emit2("save-image", cloneSettings(localSettings.value.image));
        return;
      }
      emit2("save-remote", cloneSettings(localSettings.value.remote));
    }
    async function chooseLocalImagePath() {
      const api = window.mdPreview;
      if (typeof api?.chooseFolder !== "function") return;
      const result = await api.chooseFolder("选择本地图片保存路径");
      if (result?.canceled) return;
      localSettings.value.image.imageSavePath = result.folderPath;
    }
    async function testConnection(provider, settings, successMessage) {
      const api = window.mdPreview;
      if (typeof api?.testSyncConnection !== "function") {
        emit2("status", "测试连接功能需要重启应用后生效");
        return;
      }
      try {
        await api.testSyncConnection({
          provider,
          settings: cloneSettings(settings)
        });
        emit2("status", successMessage);
      } catch (error2) {
        emit2("status", `远程服务器连接失败：${error2.message}`);
      }
    }
    function testImageS3() {
      testConnection(
        "s3",
        {
          s3: localSettings.value.image.s3
        },
        "图片 S3 连接成功"
      );
    }
    function testRemoteWebDav() {
      testConnection(
        "webdav",
        {
          webdav: localSettings.value.remote.webdav
        },
        "WebDAV 连接成功"
      );
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$1, [
        createBaseVNode("header", _hoisted_2$1, [
          _cache[19] || (_cache[19] = createBaseVNode("div", null, [
            createBaseVNode("h1", { id: "settingsTitle" }, "设置"),
            createBaseVNode("p", null, "配置图片保存位置和远程 WebDAV 文件夹。")
          ], -1)),
          createBaseVNode("button", {
            class: "settings-secondary",
            type: "button",
            onClick: _cache[0] || (_cache[0] = ($event) => emit2("close"))
          }, "返回")
        ]),
        createBaseVNode("div", _hoisted_3$1, [
          createBaseVNode("aside", _hoisted_4$1, [
            (openBlock(), createElementBlock(Fragment, null, renderList(tabs, (tab) => {
              return createBaseVNode("button", {
                key: tab.key,
                class: normalizeClass(["settings-tab", { active: activeTab.value === tab.key }]),
                type: "button",
                onClick: ($event) => activeTab.value = tab.key
              }, toDisplayString(tab.label), 11, _hoisted_5$1);
            }), 64))
          ]),
          createBaseVNode("div", _hoisted_6, [
            activeTab.value === "image" ? (openBlock(), createElementBlock("section", _hoisted_7, [
              _cache[32] || (_cache[32] = createBaseVNode("h2", null, "图像设置", -1)),
              createBaseVNode("div", _hoisted_8, [
                _cache[21] || (_cache[21] = createBaseVNode("div", null, [
                  createBaseVNode("h3", null, "本地文件插入图片"),
                  createBaseVNode("p", null, "粘贴图片时，可保存到本地路径或上传到 S3。")
                ], -1)),
                withDirectives(createBaseVNode("select", {
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => localSettings.value.image.imageProvider = $event),
                  class: "settings-input"
                }, [..._cache[20] || (_cache[20] = [
                  createBaseVNode("option", { value: "local" }, "本地路径", -1),
                  createBaseVNode("option", { value: "s3" }, "S3 服务器", -1)
                ])], 512), [
                  [vModelSelect, localSettings.value.image.imageProvider]
                ])
              ]),
              localSettings.value.image.imageProvider === "local" ? (openBlock(), createElementBlock("div", _hoisted_9, [
                _cache[22] || (_cache[22] = createBaseVNode("div", null, [
                  createBaseVNode("h3", null, "本地图片路径"),
                  createBaseVNode("p", null, "可填写相对路径，例如 images，也可以选择固定文件夹。")
                ], -1)),
                createBaseVNode("div", _hoisted_10, [
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => localSettings.value.image.imageSavePath = $event),
                    class: "settings-input",
                    type: "text",
                    placeholder: "images"
                  }, null, 512), [
                    [
                      vModelText,
                      localSettings.value.image.imageSavePath,
                      void 0,
                      { trim: true }
                    ]
                  ]),
                  createBaseVNode("button", {
                    class: "settings-secondary",
                    type: "button",
                    onClick: chooseLocalImagePath
                  }, "选择")
                ])
              ])) : (openBlock(), createElementBlock("div", _hoisted_11, [
                createBaseVNode("div", _hoisted_12, [
                  createBaseVNode("label", _hoisted_13, [
                    _cache[23] || (_cache[23] = createBaseVNode("span", null, "Endpoint", -1)),
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => localSettings.value.image.s3.endpoint = $event),
                      class: "settings-input",
                      type: "url",
                      placeholder: "https://s3.example.com"
                    }, null, 512), [
                      [
                        vModelText,
                        localSettings.value.image.s3.endpoint,
                        void 0,
                        { trim: true }
                      ]
                    ])
                  ]),
                  createBaseVNode("label", _hoisted_14, [
                    _cache[24] || (_cache[24] = createBaseVNode("span", null, "公开访问地址", -1)),
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => localSettings.value.image.s3.publicBaseUrl = $event),
                      class: "settings-input",
                      type: "url",
                      placeholder: "https://cdn.example.com/bucket"
                    }, null, 512), [
                      [
                        vModelText,
                        localSettings.value.image.s3.publicBaseUrl,
                        void 0,
                        { trim: true }
                      ]
                    ])
                  ]),
                  createBaseVNode("label", _hoisted_15, [
                    _cache[25] || (_cache[25] = createBaseVNode("span", null, "Region", -1)),
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => localSettings.value.image.s3.region = $event),
                      class: "settings-input",
                      type: "text"
                    }, null, 512), [
                      [
                        vModelText,
                        localSettings.value.image.s3.region,
                        void 0,
                        { trim: true }
                      ]
                    ])
                  ]),
                  createBaseVNode("label", _hoisted_16, [
                    _cache[26] || (_cache[26] = createBaseVNode("span", null, "Bucket", -1)),
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => localSettings.value.image.s3.bucket = $event),
                      class: "settings-input",
                      type: "text"
                    }, null, 512), [
                      [
                        vModelText,
                        localSettings.value.image.s3.bucket,
                        void 0,
                        { trim: true }
                      ]
                    ])
                  ]),
                  createBaseVNode("label", _hoisted_17, [
                    _cache[27] || (_cache[27] = createBaseVNode("span", null, "Access Key ID", -1)),
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => localSettings.value.image.s3.accessKeyId = $event),
                      class: "settings-input",
                      type: "text"
                    }, null, 512), [
                      [
                        vModelText,
                        localSettings.value.image.s3.accessKeyId,
                        void 0,
                        { trim: true }
                      ]
                    ])
                  ]),
                  createBaseVNode("label", _hoisted_18, [
                    _cache[28] || (_cache[28] = createBaseVNode("span", null, "Secret Access Key", -1)),
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => localSettings.value.image.s3.secretAccessKey = $event),
                      class: "settings-input",
                      type: "password"
                    }, null, 512), [
                      [vModelText, localSettings.value.image.s3.secretAccessKey]
                    ])
                  ]),
                  createBaseVNode("label", _hoisted_19, [
                    _cache[29] || (_cache[29] = createBaseVNode("span", null, "远程前缀", -1)),
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => localSettings.value.image.s3.prefix = $event),
                      class: "settings-input",
                      type: "text"
                    }, null, 512), [
                      [
                        vModelText,
                        localSettings.value.image.s3.prefix,
                        void 0,
                        { trim: true }
                      ]
                    ])
                  ]),
                  createBaseVNode("label", _hoisted_20, [
                    _cache[30] || (_cache[30] = createBaseVNode("span", null, "图片目录", -1)),
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => localSettings.value.image.s3.imagePath = $event),
                      class: "settings-input",
                      type: "text",
                      placeholder: "images"
                    }, null, 512), [
                      [
                        vModelText,
                        localSettings.value.image.s3.imagePath,
                        void 0,
                        { trim: true }
                      ]
                    ])
                  ]),
                  createBaseVNode("label", _hoisted_21, [
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => localSettings.value.image.s3.forcePathStyle = $event),
                      type: "checkbox"
                    }, null, 512), [
                      [vModelCheckbox, localSettings.value.image.s3.forcePathStyle]
                    ]),
                    _cache[31] || (_cache[31] = createBaseVNode("span", null, "使用 Path Style 地址", -1))
                  ])
                ]),
                createBaseVNode("div", { class: "settings-panel-actions" }, [
                  createBaseVNode("button", {
                    class: "settings-secondary",
                    type: "button",
                    onClick: testImageS3
                  }, "测试 S3")
                ])
              ]))
            ])) : (openBlock(), createElementBlock("section", _hoisted_22, [
              _cache[40] || (_cache[40] = createBaseVNode("h2", null, "远程设置", -1)),
              createBaseVNode("div", { class: "settings-row" }, [
                _cache[33] || (_cache[33] = createBaseVNode("div", null, [
                  createBaseVNode("h3", null, "WebDAV 连接"),
                  createBaseVNode("p", null, "文件菜单里的“打开远程文件夹”会使用此连接。")
                ], -1)),
                createBaseVNode("button", {
                  class: "settings-secondary",
                  type: "button",
                  onClick: testRemoteWebDav
                }, "测试 WebDAV")
              ]),
              createBaseVNode("div", _hoisted_23, [
                createBaseVNode("label", _hoisted_24, [
                  _cache[34] || (_cache[34] = createBaseVNode("span", null, "服务器地址", -1)),
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => localSettings.value.remote.webdav.url = $event),
                    class: "settings-input",
                    type: "url",
                    placeholder: "https://example.com/dav"
                  }, null, 512), [
                    [
                      vModelText,
                      localSettings.value.remote.webdav.url,
                      void 0,
                      { trim: true }
                    ]
                  ])
                ]),
                createBaseVNode("label", _hoisted_25, [
                  _cache[35] || (_cache[35] = createBaseVNode("span", null, "图片公开访问地址", -1)),
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => localSettings.value.remote.webdav.publicBaseUrl = $event),
                    class: "settings-input",
                    type: "url",
                    placeholder: "https://cdn.example.com/dav"
                  }, null, 512), [
                    [
                      vModelText,
                      localSettings.value.remote.webdav.publicBaseUrl,
                      void 0,
                      { trim: true }
                    ]
                  ])
                ]),
                createBaseVNode("label", _hoisted_26, [
                  _cache[36] || (_cache[36] = createBaseVNode("span", null, "用户名", -1)),
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => localSettings.value.remote.webdav.username = $event),
                    class: "settings-input",
                    type: "text"
                  }, null, 512), [
                    [
                      vModelText,
                      localSettings.value.remote.webdav.username,
                      void 0,
                      { trim: true }
                    ]
                  ])
                ]),
                createBaseVNode("label", _hoisted_27, [
                  _cache[37] || (_cache[37] = createBaseVNode("span", null, "密码 / Token", -1)),
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => localSettings.value.remote.webdav.password = $event),
                    class: "settings-input",
                    type: "password"
                  }, null, 512), [
                    [vModelText, localSettings.value.remote.webdav.password]
                  ])
                ]),
                createBaseVNode("label", _hoisted_28, [
                  _cache[38] || (_cache[38] = createBaseVNode("span", null, "默认远程文件夹", -1)),
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => localSettings.value.remote.webdav.remotePath = $event),
                    class: "settings-input",
                    type: "text",
                    placeholder: "/MdPreview"
                  }, null, 512), [
                    [
                      vModelText,
                      localSettings.value.remote.webdav.remotePath,
                      void 0,
                      { trim: true }
                    ]
                  ])
                ]),
                createBaseVNode("label", _hoisted_29, [
                  _cache[39] || (_cache[39] = createBaseVNode("span", null, "远程图片目录", -1)),
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => localSettings.value.remote.webdavImagePath = $event),
                    class: "settings-input",
                    type: "text",
                    placeholder: "images"
                  }, null, 512), [
                    [
                      vModelText,
                      localSettings.value.remote.webdavImagePath,
                      void 0,
                      { trim: true }
                    ]
                  ])
                ])
              ])
            ]))
          ])
        ]),
        createBaseVNode("footer", _hoisted_30, [
          createBaseVNode("button", {
            class: "dialog-button",
            type: "button",
            onClick: _cache[18] || (_cache[18] = ($event) => emit2("close"))
          }, "返回"),
          createBaseVNode("button", {
            class: "dialog-button primary settings-save-button",
            type: "button",
            onClick: saveCurrentSettings
          }, toDisplayString(activeTab.value === "image" ? "保存图像设置" : "保存远程设置"), 1)
        ])
      ]);
    };
  }
};
const sampleDocument = `# MdPreview

开始写你的 Markdown。

- 支持实时预览
- 支持表格、代码块、任务列表
- 使用 Ctrl+S 保存

> 一个安静的本地 Markdown 编辑器。

\`\`\`js
console.log('Hello MdPreview')
\`\`\`
`;
function createInitialDocumentState() {
  return /* @__PURE__ */ reactive({
    filePath: null,
    fileName: "Untitled.md",
    content: sampleDocument,
    savedContent: sampleDocument,
    view: "preview",
    theme: normalizeTheme(localStorage.getItem("mdpreview-theme"))
  });
}
function useDocumentState(state) {
  const isDirty2 = computed(() => state.content !== state.savedContent);
  const title = computed(() => `${isDirty2.value ? "* " : ""}${state.fileName} - MdPreview`);
  const wordCount = computed(() => `${state.content.length} 字`);
  function setDocument(documentState) {
    state.filePath = documentState.filePath || null;
    state.fileName = documentState.fileName || "Untitled.md";
    state.content = documentState.content ?? "";
    state.savedContent = state.content;
  }
  function markSaved(fileState) {
    state.filePath = fileState.filePath;
    state.fileName = fileState.fileName;
    state.savedContent = state.content;
  }
  return {
    isDirty: isDirty2,
    title,
    wordCount,
    setDocument,
    markSaved
  };
}
const decodeCache = {};
function getDecodeCache(exclude) {
  let cache = decodeCache[exclude];
  if (cache) {
    return cache;
  }
  cache = decodeCache[exclude] = [];
  for (let i2 = 0; i2 < 128; i2++) {
    const ch = String.fromCharCode(i2);
    cache.push(ch);
  }
  for (let i2 = 0; i2 < exclude.length; i2++) {
    const ch = exclude.charCodeAt(i2);
    cache[ch] = "%" + ("0" + ch.toString(16).toUpperCase()).slice(-2);
  }
  return cache;
}
function decode$1(string, exclude) {
  if (typeof exclude !== "string") {
    exclude = decode$1.defaultChars;
  }
  const cache = getDecodeCache(exclude);
  return string.replace(/(%[a-f0-9]{2})+/gi, function(seq) {
    let result = "";
    for (let i2 = 0, l2 = seq.length; i2 < l2; i2 += 3) {
      const b1 = parseInt(seq.slice(i2 + 1, i2 + 3), 16);
      if (b1 < 128) {
        result += cache[b1];
        continue;
      }
      if ((b1 & 224) === 192 && i2 + 3 < l2) {
        const b2 = parseInt(seq.slice(i2 + 4, i2 + 6), 16);
        if ((b2 & 192) === 128) {
          const chr = b1 << 6 & 1984 | b2 & 63;
          if (chr < 128) {
            result += "��";
          } else {
            result += String.fromCharCode(chr);
          }
          i2 += 3;
          continue;
        }
      }
      if ((b1 & 240) === 224 && i2 + 6 < l2) {
        const b2 = parseInt(seq.slice(i2 + 4, i2 + 6), 16);
        const b3 = parseInt(seq.slice(i2 + 7, i2 + 9), 16);
        if ((b2 & 192) === 128 && (b3 & 192) === 128) {
          const chr = b1 << 12 & 61440 | b2 << 6 & 4032 | b3 & 63;
          if (chr < 2048 || chr >= 55296 && chr <= 57343) {
            result += "���";
          } else {
            result += String.fromCharCode(chr);
          }
          i2 += 6;
          continue;
        }
      }
      if ((b1 & 248) === 240 && i2 + 9 < l2) {
        const b2 = parseInt(seq.slice(i2 + 4, i2 + 6), 16);
        const b3 = parseInt(seq.slice(i2 + 7, i2 + 9), 16);
        const b4 = parseInt(seq.slice(i2 + 10, i2 + 12), 16);
        if ((b2 & 192) === 128 && (b3 & 192) === 128 && (b4 & 192) === 128) {
          let chr = b1 << 18 & 1835008 | b2 << 12 & 258048 | b3 << 6 & 4032 | b4 & 63;
          if (chr < 65536 || chr > 1114111) {
            result += "����";
          } else {
            chr -= 65536;
            result += String.fromCharCode(55296 + (chr >> 10), 56320 + (chr & 1023));
          }
          i2 += 9;
          continue;
        }
      }
      result += "�";
    }
    return result;
  });
}
decode$1.defaultChars = ";/?:@&=+$,#";
decode$1.componentChars = "";
const encodeCache = {};
function getEncodeCache(exclude) {
  let cache = encodeCache[exclude];
  if (cache) {
    return cache;
  }
  cache = encodeCache[exclude] = [];
  for (let i2 = 0; i2 < 128; i2++) {
    const ch = String.fromCharCode(i2);
    if (/^[0-9a-z]$/i.test(ch)) {
      cache.push(ch);
    } else {
      cache.push("%" + ("0" + i2.toString(16).toUpperCase()).slice(-2));
    }
  }
  for (let i2 = 0; i2 < exclude.length; i2++) {
    cache[exclude.charCodeAt(i2)] = exclude[i2];
  }
  return cache;
}
function encode$1(string, exclude, keepEscaped) {
  if (typeof exclude !== "string") {
    keepEscaped = exclude;
    exclude = encode$1.defaultChars;
  }
  if (typeof keepEscaped === "undefined") {
    keepEscaped = true;
  }
  const cache = getEncodeCache(exclude);
  let result = "";
  for (let i2 = 0, l2 = string.length; i2 < l2; i2++) {
    const code2 = string.charCodeAt(i2);
    if (keepEscaped && code2 === 37 && i2 + 2 < l2) {
      if (/^[0-9a-f]{2}$/i.test(string.slice(i2 + 1, i2 + 3))) {
        result += string.slice(i2, i2 + 3);
        i2 += 2;
        continue;
      }
    }
    if (code2 < 128) {
      result += cache[code2];
      continue;
    }
    if (code2 >= 55296 && code2 <= 57343) {
      if (code2 >= 55296 && code2 <= 56319 && i2 + 1 < l2) {
        const nextCode = string.charCodeAt(i2 + 1);
        if (nextCode >= 56320 && nextCode <= 57343) {
          result += encodeURIComponent(string[i2] + string[i2 + 1]);
          i2++;
          continue;
        }
      }
      result += "%EF%BF%BD";
      continue;
    }
    result += encodeURIComponent(string[i2]);
  }
  return result;
}
encode$1.defaultChars = ";/?:@&=+$,-_.!~*'()#";
encode$1.componentChars = "-_.!~*'()";
function format(url) {
  let result = "";
  result += url.protocol || "";
  result += url.slashes ? "//" : "";
  result += url.auth ? url.auth + "@" : "";
  if (url.hostname && url.hostname.indexOf(":") !== -1) {
    result += "[" + url.hostname + "]";
  } else {
    result += url.hostname || "";
  }
  result += url.port ? ":" + url.port : "";
  result += url.pathname || "";
  result += url.search || "";
  result += url.hash || "";
  return result;
}
function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.pathname = null;
}
const protocolPattern = /^([a-z0-9.+-]+:)/i;
const portPattern = /:[0-9]*$/;
const simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/;
const delims = ["<", ">", '"', "`", " ", "\r", "\n", "	"];
const unwise = ["{", "}", "|", "\\", "^", "`"].concat(delims);
const autoEscape = ["'"].concat(unwise);
const nonHostChars = ["%", "/", "?", ";", "#"].concat(autoEscape);
const hostEndingChars = ["/", "?", "#"];
const hostnameMaxLen = 255;
const hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/;
const hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/;
const hostlessProtocol = {
  javascript: true,
  "javascript:": true
};
const slashedProtocol = {
  http: true,
  https: true,
  ftp: true,
  gopher: true,
  file: true,
  "http:": true,
  "https:": true,
  "ftp:": true,
  "gopher:": true,
  "file:": true
};
function urlParse(url, slashesDenoteHost) {
  if (url && url instanceof Url) return url;
  const u2 = new Url();
  u2.parse(url, slashesDenoteHost);
  return u2;
}
Url.prototype.parse = function(url, slashesDenoteHost) {
  let lowerProto, hec, slashes;
  let rest = url;
  rest = rest.trim();
  if (!slashesDenoteHost && url.split("#").length === 1) {
    const simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
      }
      return this;
    }
  }
  let proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    lowerProto = proto.toLowerCase();
    this.protocol = proto;
    rest = rest.substr(proto.length);
  }
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    slashes = rest.substr(0, 2) === "//";
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }
  if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
    let hostEnd = -1;
    for (let i2 = 0; i2 < hostEndingChars.length; i2++) {
      hec = rest.indexOf(hostEndingChars[i2]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
        hostEnd = hec;
      }
    }
    let auth, atSign;
    if (hostEnd === -1) {
      atSign = rest.lastIndexOf("@");
    } else {
      atSign = rest.lastIndexOf("@", hostEnd);
    }
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = auth;
    }
    hostEnd = -1;
    for (let i2 = 0; i2 < nonHostChars.length; i2++) {
      hec = rest.indexOf(nonHostChars[i2]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
        hostEnd = hec;
      }
    }
    if (hostEnd === -1) {
      hostEnd = rest.length;
    }
    if (rest[hostEnd - 1] === ":") {
      hostEnd--;
    }
    const host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);
    this.parseHost(host);
    this.hostname = this.hostname || "";
    const ipv6Hostname = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
    if (!ipv6Hostname) {
      const hostparts = this.hostname.split(/\./);
      for (let i2 = 0, l2 = hostparts.length; i2 < l2; i2++) {
        const part = hostparts[i2];
        if (!part) {
          continue;
        }
        if (!part.match(hostnamePartPattern)) {
          let newpart = "";
          for (let j2 = 0, k2 = part.length; j2 < k2; j2++) {
            if (part.charCodeAt(j2) > 127) {
              newpart += "x";
            } else {
              newpart += part[j2];
            }
          }
          if (!newpart.match(hostnamePartPattern)) {
            const validParts = hostparts.slice(0, i2);
            const notHost = hostparts.slice(i2 + 1);
            const bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = notHost.join(".") + rest;
            }
            this.hostname = validParts.join(".");
            break;
          }
        }
      }
    }
    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = "";
    }
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
    }
  }
  const hash = rest.indexOf("#");
  if (hash !== -1) {
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  const qm = rest.indexOf("?");
  if (qm !== -1) {
    this.search = rest.substr(qm);
    rest = rest.slice(0, qm);
  }
  if (rest) {
    this.pathname = rest;
  }
  if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
    this.pathname = "";
  }
  return this;
};
Url.prototype.parseHost = function(host) {
  let port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ":") {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) {
    this.hostname = host;
  }
};
const mdurl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  decode: decode$1,
  encode: encode$1,
  format,
  parse: urlParse
}, Symbol.toStringTag, { value: "Module" }));
const Any = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
const Cc = /[\0-\x1F\x7F-\x9F]/;
const regex$1 = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/;
const P$1 = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDEAD\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/;
const regex = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC2\uFD40-\uFD4F\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF76\uDF7B-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDE53\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC5\uDECE-\uDEDB\uDEE0-\uDEE8\uDEF0-\uDEF8\uDF00-\uDF92\uDF94-\uDFCA]/;
const Z$1 = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/;
const ucmicro = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Any,
  Cc,
  Cf: regex$1,
  P: P$1,
  S: regex,
  Z: Z$1
}, Symbol.toStringTag, { value: "Module" }));
const htmlDecodeTree = new Uint16Array(
  // prettier-ignore
  'ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻 ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌'.split("").map((c2) => c2.charCodeAt(0))
);
const xmlDecodeTree = new Uint16Array(
  // prettier-ignore
  "Ȁaglq	\x1Bɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map((c2) => c2.charCodeAt(0))
);
var _a;
const decodeMap = /* @__PURE__ */ new Map([
  [0, 65533],
  // C1 Unicode control character reference replacements
  [128, 8364],
  [130, 8218],
  [131, 402],
  [132, 8222],
  [133, 8230],
  [134, 8224],
  [135, 8225],
  [136, 710],
  [137, 8240],
  [138, 352],
  [139, 8249],
  [140, 338],
  [142, 381],
  [145, 8216],
  [146, 8217],
  [147, 8220],
  [148, 8221],
  [149, 8226],
  [150, 8211],
  [151, 8212],
  [152, 732],
  [153, 8482],
  [154, 353],
  [155, 8250],
  [156, 339],
  [158, 382],
  [159, 376]
]);
const fromCodePoint$1 = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, node/no-unsupported-features/es-builtins
  (_a = String.fromCodePoint) !== null && _a !== void 0 ? _a : function(codePoint) {
    let output = "";
    if (codePoint > 65535) {
      codePoint -= 65536;
      output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
      codePoint = 56320 | codePoint & 1023;
    }
    output += String.fromCharCode(codePoint);
    return output;
  }
);
function replaceCodePoint(codePoint) {
  var _a2;
  if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
    return 65533;
  }
  return (_a2 = decodeMap.get(codePoint)) !== null && _a2 !== void 0 ? _a2 : codePoint;
}
var CharCodes;
(function(CharCodes2) {
  CharCodes2[CharCodes2["NUM"] = 35] = "NUM";
  CharCodes2[CharCodes2["SEMI"] = 59] = "SEMI";
  CharCodes2[CharCodes2["EQUALS"] = 61] = "EQUALS";
  CharCodes2[CharCodes2["ZERO"] = 48] = "ZERO";
  CharCodes2[CharCodes2["NINE"] = 57] = "NINE";
  CharCodes2[CharCodes2["LOWER_A"] = 97] = "LOWER_A";
  CharCodes2[CharCodes2["LOWER_F"] = 102] = "LOWER_F";
  CharCodes2[CharCodes2["LOWER_X"] = 120] = "LOWER_X";
  CharCodes2[CharCodes2["LOWER_Z"] = 122] = "LOWER_Z";
  CharCodes2[CharCodes2["UPPER_A"] = 65] = "UPPER_A";
  CharCodes2[CharCodes2["UPPER_F"] = 70] = "UPPER_F";
  CharCodes2[CharCodes2["UPPER_Z"] = 90] = "UPPER_Z";
})(CharCodes || (CharCodes = {}));
const TO_LOWER_BIT = 32;
var BinTrieFlags;
(function(BinTrieFlags2) {
  BinTrieFlags2[BinTrieFlags2["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
  BinTrieFlags2[BinTrieFlags2["BRANCH_LENGTH"] = 16256] = "BRANCH_LENGTH";
  BinTrieFlags2[BinTrieFlags2["JUMP_TABLE"] = 127] = "JUMP_TABLE";
})(BinTrieFlags || (BinTrieFlags = {}));
function isNumber(code2) {
  return code2 >= CharCodes.ZERO && code2 <= CharCodes.NINE;
}
function isHexadecimalCharacter(code2) {
  return code2 >= CharCodes.UPPER_A && code2 <= CharCodes.UPPER_F || code2 >= CharCodes.LOWER_A && code2 <= CharCodes.LOWER_F;
}
function isAsciiAlphaNumeric(code2) {
  return code2 >= CharCodes.UPPER_A && code2 <= CharCodes.UPPER_Z || code2 >= CharCodes.LOWER_A && code2 <= CharCodes.LOWER_Z || isNumber(code2);
}
function isEntityInAttributeInvalidEnd(code2) {
  return code2 === CharCodes.EQUALS || isAsciiAlphaNumeric(code2);
}
var EntityDecoderState;
(function(EntityDecoderState2) {
  EntityDecoderState2[EntityDecoderState2["EntityStart"] = 0] = "EntityStart";
  EntityDecoderState2[EntityDecoderState2["NumericStart"] = 1] = "NumericStart";
  EntityDecoderState2[EntityDecoderState2["NumericDecimal"] = 2] = "NumericDecimal";
  EntityDecoderState2[EntityDecoderState2["NumericHex"] = 3] = "NumericHex";
  EntityDecoderState2[EntityDecoderState2["NamedEntity"] = 4] = "NamedEntity";
})(EntityDecoderState || (EntityDecoderState = {}));
var DecodingMode;
(function(DecodingMode2) {
  DecodingMode2[DecodingMode2["Legacy"] = 0] = "Legacy";
  DecodingMode2[DecodingMode2["Strict"] = 1] = "Strict";
  DecodingMode2[DecodingMode2["Attribute"] = 2] = "Attribute";
})(DecodingMode || (DecodingMode = {}));
class EntityDecoder {
  constructor(decodeTree, emitCodePoint, errors2) {
    this.decodeTree = decodeTree;
    this.emitCodePoint = emitCodePoint;
    this.errors = errors2;
    this.state = EntityDecoderState.EntityStart;
    this.consumed = 1;
    this.result = 0;
    this.treeIndex = 0;
    this.excess = 1;
    this.decodeMode = DecodingMode.Strict;
  }
  /** Resets the instance to make it reusable. */
  startEntity(decodeMode) {
    this.decodeMode = decodeMode;
    this.state = EntityDecoderState.EntityStart;
    this.result = 0;
    this.treeIndex = 0;
    this.excess = 1;
    this.consumed = 1;
  }
  /**
   * Write an entity to the decoder. This can be called multiple times with partial entities.
   * If the entity is incomplete, the decoder will return -1.
   *
   * Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
   * entity is incomplete, and resume when the next string is written.
   *
   * @param string The string containing the entity (or a continuation of the entity).
   * @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  write(str, offset) {
    switch (this.state) {
      case EntityDecoderState.EntityStart: {
        if (str.charCodeAt(offset) === CharCodes.NUM) {
          this.state = EntityDecoderState.NumericStart;
          this.consumed += 1;
          return this.stateNumericStart(str, offset + 1);
        }
        this.state = EntityDecoderState.NamedEntity;
        return this.stateNamedEntity(str, offset);
      }
      case EntityDecoderState.NumericStart: {
        return this.stateNumericStart(str, offset);
      }
      case EntityDecoderState.NumericDecimal: {
        return this.stateNumericDecimal(str, offset);
      }
      case EntityDecoderState.NumericHex: {
        return this.stateNumericHex(str, offset);
      }
      case EntityDecoderState.NamedEntity: {
        return this.stateNamedEntity(str, offset);
      }
    }
  }
  /**
   * Switches between the numeric decimal and hexadecimal states.
   *
   * Equivalent to the `Numeric character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericStart(str, offset) {
    if (offset >= str.length) {
      return -1;
    }
    if ((str.charCodeAt(offset) | TO_LOWER_BIT) === CharCodes.LOWER_X) {
      this.state = EntityDecoderState.NumericHex;
      this.consumed += 1;
      return this.stateNumericHex(str, offset + 1);
    }
    this.state = EntityDecoderState.NumericDecimal;
    return this.stateNumericDecimal(str, offset);
  }
  addToNumericResult(str, start, end, base2) {
    if (start !== end) {
      const digitCount = end - start;
      this.result = this.result * Math.pow(base2, digitCount) + parseInt(str.substr(start, digitCount), base2);
      this.consumed += digitCount;
    }
  }
  /**
   * Parses a hexadecimal numeric entity.
   *
   * Equivalent to the `Hexademical character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericHex(str, offset) {
    const startIdx = offset;
    while (offset < str.length) {
      const char = str.charCodeAt(offset);
      if (isNumber(char) || isHexadecimalCharacter(char)) {
        offset += 1;
      } else {
        this.addToNumericResult(str, startIdx, offset, 16);
        return this.emitNumericEntity(char, 3);
      }
    }
    this.addToNumericResult(str, startIdx, offset, 16);
    return -1;
  }
  /**
   * Parses a decimal numeric entity.
   *
   * Equivalent to the `Decimal character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericDecimal(str, offset) {
    const startIdx = offset;
    while (offset < str.length) {
      const char = str.charCodeAt(offset);
      if (isNumber(char)) {
        offset += 1;
      } else {
        this.addToNumericResult(str, startIdx, offset, 10);
        return this.emitNumericEntity(char, 2);
      }
    }
    this.addToNumericResult(str, startIdx, offset, 10);
    return -1;
  }
  /**
   * Validate and emit a numeric entity.
   *
   * Implements the logic from the `Hexademical character reference start
   * state` and `Numeric character reference end state` in the HTML spec.
   *
   * @param lastCp The last code point of the entity. Used to see if the
   *               entity was terminated with a semicolon.
   * @param expectedLength The minimum number of characters that should be
   *                       consumed. Used to validate that at least one digit
   *                       was consumed.
   * @returns The number of characters that were consumed.
   */
  emitNumericEntity(lastCp, expectedLength) {
    var _a2;
    if (this.consumed <= expectedLength) {
      (_a2 = this.errors) === null || _a2 === void 0 ? void 0 : _a2.absenceOfDigitsInNumericCharacterReference(this.consumed);
      return 0;
    }
    if (lastCp === CharCodes.SEMI) {
      this.consumed += 1;
    } else if (this.decodeMode === DecodingMode.Strict) {
      return 0;
    }
    this.emitCodePoint(replaceCodePoint(this.result), this.consumed);
    if (this.errors) {
      if (lastCp !== CharCodes.SEMI) {
        this.errors.missingSemicolonAfterCharacterReference();
      }
      this.errors.validateNumericCharacterReference(this.result);
    }
    return this.consumed;
  }
  /**
   * Parses a named entity.
   *
   * Equivalent to the `Named character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNamedEntity(str, offset) {
    const { decodeTree } = this;
    let current = decodeTree[this.treeIndex];
    let valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
    for (; offset < str.length; offset++, this.excess++) {
      const char = str.charCodeAt(offset);
      this.treeIndex = determineBranch(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char);
      if (this.treeIndex < 0) {
        return this.result === 0 || // If we are parsing an attribute
        this.decodeMode === DecodingMode.Attribute && // We shouldn't have consumed any characters after the entity,
        (valueLength === 0 || // And there should be no invalid characters.
        isEntityInAttributeInvalidEnd(char)) ? 0 : this.emitNotTerminatedNamedEntity();
      }
      current = decodeTree[this.treeIndex];
      valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
      if (valueLength !== 0) {
        if (char === CharCodes.SEMI) {
          return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
        }
        if (this.decodeMode !== DecodingMode.Strict) {
          this.result = this.treeIndex;
          this.consumed += this.excess;
          this.excess = 0;
        }
      }
    }
    return -1;
  }
  /**
   * Emit a named entity that was not terminated with a semicolon.
   *
   * @returns The number of characters consumed.
   */
  emitNotTerminatedNamedEntity() {
    var _a2;
    const { result, decodeTree } = this;
    const valueLength = (decodeTree[result] & BinTrieFlags.VALUE_LENGTH) >> 14;
    this.emitNamedEntityData(result, valueLength, this.consumed);
    (_a2 = this.errors) === null || _a2 === void 0 ? void 0 : _a2.missingSemicolonAfterCharacterReference();
    return this.consumed;
  }
  /**
   * Emit a named entity.
   *
   * @param result The index of the entity in the decode tree.
   * @param valueLength The number of bytes in the entity.
   * @param consumed The number of characters consumed.
   *
   * @returns The number of characters consumed.
   */
  emitNamedEntityData(result, valueLength, consumed) {
    const { decodeTree } = this;
    this.emitCodePoint(valueLength === 1 ? decodeTree[result] & ~BinTrieFlags.VALUE_LENGTH : decodeTree[result + 1], consumed);
    if (valueLength === 3) {
      this.emitCodePoint(decodeTree[result + 2], consumed);
    }
    return consumed;
  }
  /**
   * Signal to the parser that the end of the input was reached.
   *
   * Remaining data will be emitted and relevant errors will be produced.
   *
   * @returns The number of characters consumed.
   */
  end() {
    var _a2;
    switch (this.state) {
      case EntityDecoderState.NamedEntity: {
        return this.result !== 0 && (this.decodeMode !== DecodingMode.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
      }
      // Otherwise, emit a numeric entity if we have one.
      case EntityDecoderState.NumericDecimal: {
        return this.emitNumericEntity(0, 2);
      }
      case EntityDecoderState.NumericHex: {
        return this.emitNumericEntity(0, 3);
      }
      case EntityDecoderState.NumericStart: {
        (_a2 = this.errors) === null || _a2 === void 0 ? void 0 : _a2.absenceOfDigitsInNumericCharacterReference(this.consumed);
        return 0;
      }
      case EntityDecoderState.EntityStart: {
        return 0;
      }
    }
  }
}
function getDecoder(decodeTree) {
  let ret = "";
  const decoder = new EntityDecoder(decodeTree, (str) => ret += fromCodePoint$1(str));
  return function decodeWithTrie(str, decodeMode) {
    let lastIndex = 0;
    let offset = 0;
    while ((offset = str.indexOf("&", offset)) >= 0) {
      ret += str.slice(lastIndex, offset);
      decoder.startEntity(decodeMode);
      const len = decoder.write(
        str,
        // Skip the "&"
        offset + 1
      );
      if (len < 0) {
        lastIndex = offset + decoder.end();
        break;
      }
      lastIndex = offset + len;
      offset = len === 0 ? lastIndex + 1 : lastIndex;
    }
    const result = ret + str.slice(lastIndex);
    ret = "";
    return result;
  };
}
function determineBranch(decodeTree, current, nodeIdx, char) {
  const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
  const jumpOffset = current & BinTrieFlags.JUMP_TABLE;
  if (branchCount === 0) {
    return jumpOffset !== 0 && char === jumpOffset ? nodeIdx : -1;
  }
  if (jumpOffset) {
    const value = char - jumpOffset;
    return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIdx + value] - 1;
  }
  let lo = nodeIdx;
  let hi = lo + branchCount - 1;
  while (lo <= hi) {
    const mid = lo + hi >>> 1;
    const midVal = decodeTree[mid];
    if (midVal < char) {
      lo = mid + 1;
    } else if (midVal > char) {
      hi = mid - 1;
    } else {
      return decodeTree[mid + branchCount];
    }
  }
  return -1;
}
const htmlDecoder = getDecoder(htmlDecodeTree);
getDecoder(xmlDecodeTree);
function decodeHTML(str, mode = DecodingMode.Legacy) {
  return htmlDecoder(str, mode);
}
function _class$1(obj) {
  return Object.prototype.toString.call(obj);
}
function isString$1(obj) {
  return _class$1(obj) === "[object String]";
}
const _hasOwnProperty = Object.prototype.hasOwnProperty;
function has(object, key) {
  return _hasOwnProperty.call(object, key);
}
function assign$1(obj) {
  const sources = Array.prototype.slice.call(arguments, 1);
  sources.forEach(function(source) {
    if (!source) {
      return;
    }
    if (typeof source !== "object") {
      throw new TypeError(source + "must be object");
    }
    Object.keys(source).forEach(function(key) {
      obj[key] = source[key];
    });
  });
  return obj;
}
function arrayReplaceAt(src, pos, newElements) {
  return [].concat(src.slice(0, pos), newElements, src.slice(pos + 1));
}
function isValidEntityCode(c2) {
  if (c2 >= 55296 && c2 <= 57343) {
    return false;
  }
  if (c2 >= 64976 && c2 <= 65007) {
    return false;
  }
  if ((c2 & 65535) === 65535 || (c2 & 65535) === 65534) {
    return false;
  }
  if (c2 >= 0 && c2 <= 8) {
    return false;
  }
  if (c2 === 11) {
    return false;
  }
  if (c2 >= 14 && c2 <= 31) {
    return false;
  }
  if (c2 >= 127 && c2 <= 159) {
    return false;
  }
  if (c2 > 1114111) {
    return false;
  }
  return true;
}
function fromCodePoint(c2) {
  if (c2 > 65535) {
    c2 -= 65536;
    const surrogate1 = 55296 + (c2 >> 10);
    const surrogate2 = 56320 + (c2 & 1023);
    return String.fromCharCode(surrogate1, surrogate2);
  }
  return String.fromCharCode(c2);
}
const UNESCAPE_MD_RE = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g;
const ENTITY_RE = /&([a-z#][a-z0-9]{1,31});/gi;
const UNESCAPE_ALL_RE = new RegExp(UNESCAPE_MD_RE.source + "|" + ENTITY_RE.source, "gi");
const DIGITAL_ENTITY_TEST_RE = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
function replaceEntityPattern(match2, name) {
  if (name.charCodeAt(0) === 35 && DIGITAL_ENTITY_TEST_RE.test(name)) {
    const code2 = name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
    if (isValidEntityCode(code2)) {
      return fromCodePoint(code2);
    }
    return match2;
  }
  const decoded = decodeHTML(match2);
  if (decoded !== match2) {
    return decoded;
  }
  return match2;
}
function unescapeMd(str) {
  if (str.indexOf("\\") < 0) {
    return str;
  }
  return str.replace(UNESCAPE_MD_RE, "$1");
}
function unescapeAll(str) {
  if (str.indexOf("\\") < 0 && str.indexOf("&") < 0) {
    return str;
  }
  return str.replace(UNESCAPE_ALL_RE, function(match2, escaped, entity2) {
    if (escaped) {
      return escaped;
    }
    return replaceEntityPattern(match2, entity2);
  });
}
const HTML_ESCAPE_TEST_RE = /[&<>"]/;
const HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
const HTML_REPLACEMENTS = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;"
};
function replaceUnsafeChar(ch) {
  return HTML_REPLACEMENTS[ch];
}
function escapeHtml(str) {
  if (HTML_ESCAPE_TEST_RE.test(str)) {
    return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
  }
  return str;
}
const REGEXP_ESCAPE_RE = /[.?*+^$[\]\\(){}|-]/g;
function escapeRE$1(str) {
  return str.replace(REGEXP_ESCAPE_RE, "\\$&");
}
function isSpace(code2) {
  switch (code2) {
    case 9:
    case 32:
      return true;
  }
  return false;
}
function isWhiteSpace(code2) {
  if (code2 >= 8192 && code2 <= 8202) {
    return true;
  }
  switch (code2) {
    case 9:
    // \t
    case 10:
    // \n
    case 11:
    // \v
    case 12:
    // \f
    case 13:
    // \r
    case 32:
    case 160:
    case 5760:
    case 8239:
    case 8287:
    case 12288:
      return true;
  }
  return false;
}
function isPunctChar(ch) {
  return P$1.test(ch) || regex.test(ch);
}
function isMdAsciiPunct(ch) {
  switch (ch) {
    case 33:
    case 34:
    case 35:
    case 36:
    case 37:
    case 38:
    case 39:
    case 40:
    case 41:
    case 42:
    case 43:
    case 44:
    case 45:
    case 46:
    case 47:
    case 58:
    case 59:
    case 60:
    case 61:
    case 62:
    case 63:
    case 64:
    case 91:
    case 92:
    case 93:
    case 94:
    case 95:
    case 96:
    case 123:
    case 124:
    case 125:
    case 126:
      return true;
    default:
      return false;
  }
}
function normalizeReference(str) {
  str = str.trim().replace(/\s+/g, " ");
  if ("ẞ".toLowerCase() === "Ṿ") {
    str = str.replace(/ẞ/g, "ß");
  }
  return str.toLowerCase().toUpperCase();
}
const lib = { mdurl, ucmicro };
const utils = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  arrayReplaceAt,
  assign: assign$1,
  escapeHtml,
  escapeRE: escapeRE$1,
  fromCodePoint,
  has,
  isMdAsciiPunct,
  isPunctChar,
  isSpace,
  isString: isString$1,
  isValidEntityCode,
  isWhiteSpace,
  lib,
  normalizeReference,
  unescapeAll,
  unescapeMd
}, Symbol.toStringTag, { value: "Module" }));
function parseLinkLabel(state, start, disableNested) {
  let level, found, marker, prevPos;
  const max = state.posMax;
  const oldPos = state.pos;
  state.pos = start + 1;
  level = 1;
  while (state.pos < max) {
    marker = state.src.charCodeAt(state.pos);
    if (marker === 93) {
      level--;
      if (level === 0) {
        found = true;
        break;
      }
    }
    prevPos = state.pos;
    state.md.inline.skipToken(state);
    if (marker === 91) {
      if (prevPos === state.pos - 1) {
        level++;
      } else if (disableNested) {
        state.pos = oldPos;
        return -1;
      }
    }
  }
  let labelEnd = -1;
  if (found) {
    labelEnd = state.pos;
  }
  state.pos = oldPos;
  return labelEnd;
}
function parseLinkDestination(str, start, max) {
  let code2;
  let pos = start;
  const result = {
    ok: false,
    pos: 0,
    str: ""
  };
  if (str.charCodeAt(pos) === 60) {
    pos++;
    while (pos < max) {
      code2 = str.charCodeAt(pos);
      if (code2 === 10) {
        return result;
      }
      if (code2 === 60) {
        return result;
      }
      if (code2 === 62) {
        result.pos = pos + 1;
        result.str = unescapeAll(str.slice(start + 1, pos));
        result.ok = true;
        return result;
      }
      if (code2 === 92 && pos + 1 < max) {
        pos += 2;
        continue;
      }
      pos++;
    }
    return result;
  }
  let level = 0;
  while (pos < max) {
    code2 = str.charCodeAt(pos);
    if (code2 === 32) {
      break;
    }
    if (code2 < 32 || code2 === 127) {
      break;
    }
    if (code2 === 92 && pos + 1 < max) {
      if (str.charCodeAt(pos + 1) === 32) {
        break;
      }
      pos += 2;
      continue;
    }
    if (code2 === 40) {
      level++;
      if (level > 32) {
        return result;
      }
    }
    if (code2 === 41) {
      if (level === 0) {
        break;
      }
      level--;
    }
    pos++;
  }
  if (start === pos) {
    return result;
  }
  if (level !== 0) {
    return result;
  }
  result.str = unescapeAll(str.slice(start, pos));
  result.pos = pos;
  result.ok = true;
  return result;
}
function parseLinkTitle(str, start, max, prev_state) {
  let code2;
  let pos = start;
  const state = {
    // if `true`, this is a valid link title
    ok: false,
    // if `true`, this link can be continued on the next line
    can_continue: false,
    // if `ok`, it's the position of the first character after the closing marker
    pos: 0,
    // if `ok`, it's the unescaped title
    str: "",
    // expected closing marker character code
    marker: 0
  };
  if (prev_state) {
    state.str = prev_state.str;
    state.marker = prev_state.marker;
  } else {
    if (pos >= max) {
      return state;
    }
    let marker = str.charCodeAt(pos);
    if (marker !== 34 && marker !== 39 && marker !== 40) {
      return state;
    }
    start++;
    pos++;
    if (marker === 40) {
      marker = 41;
    }
    state.marker = marker;
  }
  while (pos < max) {
    code2 = str.charCodeAt(pos);
    if (code2 === state.marker) {
      state.pos = pos + 1;
      state.str += unescapeAll(str.slice(start, pos));
      state.ok = true;
      return state;
    } else if (code2 === 40 && state.marker === 41) {
      return state;
    } else if (code2 === 92 && pos + 1 < max) {
      pos++;
    }
    pos++;
  }
  state.can_continue = true;
  state.str += unescapeAll(str.slice(start, pos));
  return state;
}
const helpers = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseLinkDestination,
  parseLinkLabel,
  parseLinkTitle
}, Symbol.toStringTag, { value: "Module" }));
const default_rules = {};
default_rules.code_inline = function(tokens, idx, options, env, slf) {
  const token = tokens[idx];
  return "<code" + slf.renderAttrs(token) + ">" + escapeHtml(token.content) + "</code>";
};
default_rules.code_block = function(tokens, idx, options, env, slf) {
  const token = tokens[idx];
  return "<pre" + slf.renderAttrs(token) + "><code>" + escapeHtml(tokens[idx].content) + "</code></pre>\n";
};
default_rules.fence = function(tokens, idx, options, env, slf) {
  const token = tokens[idx];
  const info = token.info ? unescapeAll(token.info).trim() : "";
  let langName = "";
  let langAttrs = "";
  if (info) {
    const arr = info.split(/(\s+)/g);
    langName = arr[0];
    langAttrs = arr.slice(2).join("");
  }
  let highlighted;
  if (options.highlight) {
    highlighted = options.highlight(token.content, langName, langAttrs) || escapeHtml(token.content);
  } else {
    highlighted = escapeHtml(token.content);
  }
  if (highlighted.indexOf("<pre") === 0) {
    return highlighted + "\n";
  }
  if (info) {
    const i2 = token.attrIndex("class");
    const tmpAttrs = token.attrs ? token.attrs.slice() : [];
    if (i2 < 0) {
      tmpAttrs.push(["class", options.langPrefix + langName]);
    } else {
      tmpAttrs[i2] = tmpAttrs[i2].slice();
      tmpAttrs[i2][1] += " " + options.langPrefix + langName;
    }
    const tmpToken = {
      attrs: tmpAttrs
    };
    return `<pre><code${slf.renderAttrs(tmpToken)}>${highlighted}</code></pre>
`;
  }
  return `<pre><code${slf.renderAttrs(token)}>${highlighted}</code></pre>
`;
};
default_rules.image = function(tokens, idx, options, env, slf) {
  const token = tokens[idx];
  token.attrs[token.attrIndex("alt")][1] = slf.renderInlineAsText(token.children, options, env);
  return slf.renderToken(tokens, idx, options);
};
default_rules.hardbreak = function(tokens, idx, options) {
  return options.xhtmlOut ? "<br />\n" : "<br>\n";
};
default_rules.softbreak = function(tokens, idx, options) {
  return options.breaks ? options.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";
};
default_rules.text = function(tokens, idx) {
  return escapeHtml(tokens[idx].content);
};
default_rules.html_block = function(tokens, idx) {
  return tokens[idx].content;
};
default_rules.html_inline = function(tokens, idx) {
  return tokens[idx].content;
};
function Renderer() {
  this.rules = assign$1({}, default_rules);
}
Renderer.prototype.renderAttrs = function renderAttrs(token) {
  let i2, l2, result;
  if (!token.attrs) {
    return "";
  }
  result = "";
  for (i2 = 0, l2 = token.attrs.length; i2 < l2; i2++) {
    result += " " + escapeHtml(token.attrs[i2][0]) + '="' + escapeHtml(token.attrs[i2][1]) + '"';
  }
  return result;
};
Renderer.prototype.renderToken = function renderToken(tokens, idx, options) {
  const token = tokens[idx];
  let result = "";
  if (token.hidden) {
    return "";
  }
  if (token.block && token.nesting !== -1 && idx && tokens[idx - 1].hidden) {
    result += "\n";
  }
  result += (token.nesting === -1 ? "</" : "<") + token.tag;
  result += this.renderAttrs(token);
  if (token.nesting === 0 && options.xhtmlOut) {
    result += " /";
  }
  let needLf = false;
  if (token.block) {
    needLf = true;
    if (token.nesting === 1) {
      if (idx + 1 < tokens.length) {
        const nextToken = tokens[idx + 1];
        if (nextToken.type === "inline" || nextToken.hidden) {
          needLf = false;
        } else if (nextToken.nesting === -1 && nextToken.tag === token.tag) {
          needLf = false;
        }
      }
    }
  }
  result += needLf ? ">\n" : ">";
  return result;
};
Renderer.prototype.renderInline = function(tokens, options, env) {
  let result = "";
  const rules = this.rules;
  for (let i2 = 0, len = tokens.length; i2 < len; i2++) {
    const type = tokens[i2].type;
    if (typeof rules[type] !== "undefined") {
      result += rules[type](tokens, i2, options, env, this);
    } else {
      result += this.renderToken(tokens, i2, options);
    }
  }
  return result;
};
Renderer.prototype.renderInlineAsText = function(tokens, options, env) {
  let result = "";
  for (let i2 = 0, len = tokens.length; i2 < len; i2++) {
    switch (tokens[i2].type) {
      case "text":
        result += tokens[i2].content;
        break;
      case "image":
        result += this.renderInlineAsText(tokens[i2].children, options, env);
        break;
      case "html_inline":
      case "html_block":
        result += tokens[i2].content;
        break;
      case "softbreak":
      case "hardbreak":
        result += "\n";
        break;
    }
  }
  return result;
};
Renderer.prototype.render = function(tokens, options, env) {
  let result = "";
  const rules = this.rules;
  for (let i2 = 0, len = tokens.length; i2 < len; i2++) {
    const type = tokens[i2].type;
    if (type === "inline") {
      result += this.renderInline(tokens[i2].children, options, env);
    } else if (typeof rules[type] !== "undefined") {
      result += rules[type](tokens, i2, options, env, this);
    } else {
      result += this.renderToken(tokens, i2, options, env);
    }
  }
  return result;
};
function Ruler() {
  this.__rules__ = [];
  this.__cache__ = null;
}
Ruler.prototype.__find__ = function(name) {
  for (let i2 = 0; i2 < this.__rules__.length; i2++) {
    if (this.__rules__[i2].name === name) {
      return i2;
    }
  }
  return -1;
};
Ruler.prototype.__compile__ = function() {
  const self2 = this;
  const chains = [""];
  self2.__rules__.forEach(function(rule) {
    if (!rule.enabled) {
      return;
    }
    rule.alt.forEach(function(altName) {
      if (chains.indexOf(altName) < 0) {
        chains.push(altName);
      }
    });
  });
  self2.__cache__ = {};
  chains.forEach(function(chain) {
    self2.__cache__[chain] = [];
    self2.__rules__.forEach(function(rule) {
      if (!rule.enabled) {
        return;
      }
      if (chain && rule.alt.indexOf(chain) < 0) {
        return;
      }
      self2.__cache__[chain].push(rule.fn);
    });
  });
};
Ruler.prototype.at = function(name, fn, options) {
  const index = this.__find__(name);
  const opt = options || {};
  if (index === -1) {
    throw new Error("Parser rule not found: " + name);
  }
  this.__rules__[index].fn = fn;
  this.__rules__[index].alt = opt.alt || [];
  this.__cache__ = null;
};
Ruler.prototype.before = function(beforeName, ruleName, fn, options) {
  const index = this.__find__(beforeName);
  const opt = options || {};
  if (index === -1) {
    throw new Error("Parser rule not found: " + beforeName);
  }
  this.__rules__.splice(index, 0, {
    name: ruleName,
    enabled: true,
    fn,
    alt: opt.alt || []
  });
  this.__cache__ = null;
};
Ruler.prototype.after = function(afterName, ruleName, fn, options) {
  const index = this.__find__(afterName);
  const opt = options || {};
  if (index === -1) {
    throw new Error("Parser rule not found: " + afterName);
  }
  this.__rules__.splice(index + 1, 0, {
    name: ruleName,
    enabled: true,
    fn,
    alt: opt.alt || []
  });
  this.__cache__ = null;
};
Ruler.prototype.push = function(ruleName, fn, options) {
  const opt = options || {};
  this.__rules__.push({
    name: ruleName,
    enabled: true,
    fn,
    alt: opt.alt || []
  });
  this.__cache__ = null;
};
Ruler.prototype.enable = function(list2, ignoreInvalid) {
  if (!Array.isArray(list2)) {
    list2 = [list2];
  }
  const result = [];
  list2.forEach(function(name) {
    const idx = this.__find__(name);
    if (idx < 0) {
      if (ignoreInvalid) {
        return;
      }
      throw new Error("Rules manager: invalid rule name " + name);
    }
    this.__rules__[idx].enabled = true;
    result.push(name);
  }, this);
  this.__cache__ = null;
  return result;
};
Ruler.prototype.enableOnly = function(list2, ignoreInvalid) {
  if (!Array.isArray(list2)) {
    list2 = [list2];
  }
  this.__rules__.forEach(function(rule) {
    rule.enabled = false;
  });
  this.enable(list2, ignoreInvalid);
};
Ruler.prototype.disable = function(list2, ignoreInvalid) {
  if (!Array.isArray(list2)) {
    list2 = [list2];
  }
  const result = [];
  list2.forEach(function(name) {
    const idx = this.__find__(name);
    if (idx < 0) {
      if (ignoreInvalid) {
        return;
      }
      throw new Error("Rules manager: invalid rule name " + name);
    }
    this.__rules__[idx].enabled = false;
    result.push(name);
  }, this);
  this.__cache__ = null;
  return result;
};
Ruler.prototype.getRules = function(chainName) {
  if (this.__cache__ === null) {
    this.__compile__();
  }
  return this.__cache__[chainName] || [];
};
function Token(type, tag, nesting) {
  this.type = type;
  this.tag = tag;
  this.attrs = null;
  this.map = null;
  this.nesting = nesting;
  this.level = 0;
  this.children = null;
  this.content = "";
  this.markup = "";
  this.info = "";
  this.meta = null;
  this.block = false;
  this.hidden = false;
}
Token.prototype.attrIndex = function attrIndex(name) {
  if (!this.attrs) {
    return -1;
  }
  const attrs = this.attrs;
  for (let i2 = 0, len = attrs.length; i2 < len; i2++) {
    if (attrs[i2][0] === name) {
      return i2;
    }
  }
  return -1;
};
Token.prototype.attrPush = function attrPush(attrData) {
  if (this.attrs) {
    this.attrs.push(attrData);
  } else {
    this.attrs = [attrData];
  }
};
Token.prototype.attrSet = function attrSet(name, value) {
  const idx = this.attrIndex(name);
  const attrData = [name, value];
  if (idx < 0) {
    this.attrPush(attrData);
  } else {
    this.attrs[idx] = attrData;
  }
};
Token.prototype.attrGet = function attrGet(name) {
  const idx = this.attrIndex(name);
  let value = null;
  if (idx >= 0) {
    value = this.attrs[idx][1];
  }
  return value;
};
Token.prototype.attrJoin = function attrJoin(name, value) {
  const idx = this.attrIndex(name);
  if (idx < 0) {
    this.attrPush([name, value]);
  } else {
    this.attrs[idx][1] = this.attrs[idx][1] + " " + value;
  }
};
function StateCore(src, md2, env) {
  this.src = src;
  this.env = env;
  this.tokens = [];
  this.inlineMode = false;
  this.md = md2;
}
StateCore.prototype.Token = Token;
const NEWLINES_RE = /\r\n?|\n/g;
const NULL_RE = /\0/g;
function normalize(state) {
  let str;
  str = state.src.replace(NEWLINES_RE, "\n");
  str = str.replace(NULL_RE, "�");
  state.src = str;
}
function block(state) {
  let token;
  if (state.inlineMode) {
    token = new state.Token("inline", "", 0);
    token.content = state.src;
    token.map = [0, 1];
    token.children = [];
    state.tokens.push(token);
  } else {
    state.md.block.parse(state.src, state.md, state.env, state.tokens);
  }
}
function inline(state) {
  const tokens = state.tokens;
  for (let i2 = 0, l2 = tokens.length; i2 < l2; i2++) {
    const tok = tokens[i2];
    if (tok.type === "inline") {
      state.md.inline.parse(tok.content, state.md, state.env, tok.children);
    }
  }
}
function isLinkOpen$1(str) {
  return /^<a[>\s]/i.test(str);
}
function isLinkClose$1(str) {
  return /^<\/a\s*>/i.test(str);
}
function linkify$1(state) {
  const blockTokens = state.tokens;
  if (!state.md.options.linkify) {
    return;
  }
  for (let j2 = 0, l2 = blockTokens.length; j2 < l2; j2++) {
    if (blockTokens[j2].type !== "inline" || !state.md.linkify.pretest(blockTokens[j2].content)) {
      continue;
    }
    let tokens = blockTokens[j2].children;
    let htmlLinkLevel = 0;
    for (let i2 = tokens.length - 1; i2 >= 0; i2--) {
      const currentToken = tokens[i2];
      if (currentToken.type === "link_close") {
        i2--;
        while (tokens[i2].level !== currentToken.level && tokens[i2].type !== "link_open") {
          i2--;
        }
        continue;
      }
      if (currentToken.type === "html_inline") {
        if (isLinkOpen$1(currentToken.content) && htmlLinkLevel > 0) {
          htmlLinkLevel--;
        }
        if (isLinkClose$1(currentToken.content)) {
          htmlLinkLevel++;
        }
      }
      if (htmlLinkLevel > 0) {
        continue;
      }
      if (currentToken.type === "text" && state.md.linkify.test(currentToken.content)) {
        const text2 = currentToken.content;
        let links = state.md.linkify.match(text2);
        const nodes = [];
        let level = currentToken.level;
        let lastPos = 0;
        if (links.length > 0 && links[0].index === 0 && i2 > 0 && tokens[i2 - 1].type === "text_special") {
          links = links.slice(1);
        }
        for (let ln = 0; ln < links.length; ln++) {
          const url = links[ln].url;
          const fullUrl = state.md.normalizeLink(url);
          if (!state.md.validateLink(fullUrl)) {
            continue;
          }
          let urlText = links[ln].text;
          if (!links[ln].schema) {
            urlText = state.md.normalizeLinkText("http://" + urlText).replace(/^http:\/\//, "");
          } else if (links[ln].schema === "mailto:" && !/^mailto:/i.test(urlText)) {
            urlText = state.md.normalizeLinkText("mailto:" + urlText).replace(/^mailto:/, "");
          } else {
            urlText = state.md.normalizeLinkText(urlText);
          }
          const pos = links[ln].index;
          if (pos > lastPos) {
            const token = new state.Token("text", "", 0);
            token.content = text2.slice(lastPos, pos);
            token.level = level;
            nodes.push(token);
          }
          const token_o = new state.Token("link_open", "a", 1);
          token_o.attrs = [["href", fullUrl]];
          token_o.level = level++;
          token_o.markup = "linkify";
          token_o.info = "auto";
          nodes.push(token_o);
          const token_t = new state.Token("text", "", 0);
          token_t.content = urlText;
          token_t.level = level;
          nodes.push(token_t);
          const token_c = new state.Token("link_close", "a", -1);
          token_c.level = --level;
          token_c.markup = "linkify";
          token_c.info = "auto";
          nodes.push(token_c);
          lastPos = links[ln].lastIndex;
        }
        if (lastPos < text2.length) {
          const token = new state.Token("text", "", 0);
          token.content = text2.slice(lastPos);
          token.level = level;
          nodes.push(token);
        }
        blockTokens[j2].children = tokens = arrayReplaceAt(tokens, i2, nodes);
      }
    }
  }
}
const RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/;
const SCOPED_ABBR_TEST_RE = /\((c|tm|r)\)/i;
const SCOPED_ABBR_RE = /\((c|tm|r)\)/ig;
const SCOPED_ABBR = {
  c: "©",
  r: "®",
  tm: "™"
};
function replaceFn(match2, name) {
  return SCOPED_ABBR[name.toLowerCase()];
}
function replace_scoped(inlineTokens) {
  let inside_autolink = 0;
  for (let i2 = inlineTokens.length - 1; i2 >= 0; i2--) {
    const token = inlineTokens[i2];
    if (token.type === "text" && !inside_autolink) {
      token.content = token.content.replace(SCOPED_ABBR_RE, replaceFn);
    }
    if (token.type === "link_open" && token.info === "auto") {
      inside_autolink--;
    }
    if (token.type === "link_close" && token.info === "auto") {
      inside_autolink++;
    }
  }
}
function replace_rare(inlineTokens) {
  let inside_autolink = 0;
  for (let i2 = inlineTokens.length - 1; i2 >= 0; i2--) {
    const token = inlineTokens[i2];
    if (token.type === "text" && !inside_autolink) {
      if (RARE_RE.test(token.content)) {
        token.content = token.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/mg, "$1—").replace(/(^|\s)--(?=\s|$)/mg, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/mg, "$1–");
      }
    }
    if (token.type === "link_open" && token.info === "auto") {
      inside_autolink--;
    }
    if (token.type === "link_close" && token.info === "auto") {
      inside_autolink++;
    }
  }
}
function replace(state) {
  let blkIdx;
  if (!state.md.options.typographer) {
    return;
  }
  for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
    if (state.tokens[blkIdx].type !== "inline") {
      continue;
    }
    if (SCOPED_ABBR_TEST_RE.test(state.tokens[blkIdx].content)) {
      replace_scoped(state.tokens[blkIdx].children);
    }
    if (RARE_RE.test(state.tokens[blkIdx].content)) {
      replace_rare(state.tokens[blkIdx].children);
    }
  }
}
const QUOTE_TEST_RE = /['"]/;
const QUOTE_RE = /['"]/g;
const APOSTROPHE = "’";
function replaceAt(str, index, ch) {
  return str.slice(0, index) + ch + str.slice(index + 1);
}
function process_inlines(tokens, state) {
  let j2;
  const stack2 = [];
  for (let i2 = 0; i2 < tokens.length; i2++) {
    const token = tokens[i2];
    const thisLevel = tokens[i2].level;
    for (j2 = stack2.length - 1; j2 >= 0; j2--) {
      if (stack2[j2].level <= thisLevel) {
        break;
      }
    }
    stack2.length = j2 + 1;
    if (token.type !== "text") {
      continue;
    }
    let text2 = token.content;
    let pos = 0;
    let max = text2.length;
    OUTER:
      while (pos < max) {
        QUOTE_RE.lastIndex = pos;
        const t2 = QUOTE_RE.exec(text2);
        if (!t2) {
          break;
        }
        let canOpen = true;
        let canClose = true;
        pos = t2.index + 1;
        const isSingle = t2[0] === "'";
        let lastChar = 32;
        if (t2.index - 1 >= 0) {
          lastChar = text2.charCodeAt(t2.index - 1);
        } else {
          for (j2 = i2 - 1; j2 >= 0; j2--) {
            if (tokens[j2].type === "softbreak" || tokens[j2].type === "hardbreak") break;
            if (!tokens[j2].content) continue;
            lastChar = tokens[j2].content.charCodeAt(tokens[j2].content.length - 1);
            break;
          }
        }
        let nextChar = 32;
        if (pos < max) {
          nextChar = text2.charCodeAt(pos);
        } else {
          for (j2 = i2 + 1; j2 < tokens.length; j2++) {
            if (tokens[j2].type === "softbreak" || tokens[j2].type === "hardbreak") break;
            if (!tokens[j2].content) continue;
            nextChar = tokens[j2].content.charCodeAt(0);
            break;
          }
        }
        const isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
        const isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));
        const isLastWhiteSpace = isWhiteSpace(lastChar);
        const isNextWhiteSpace = isWhiteSpace(nextChar);
        if (isNextWhiteSpace) {
          canOpen = false;
        } else if (isNextPunctChar) {
          if (!(isLastWhiteSpace || isLastPunctChar)) {
            canOpen = false;
          }
        }
        if (isLastWhiteSpace) {
          canClose = false;
        } else if (isLastPunctChar) {
          if (!(isNextWhiteSpace || isNextPunctChar)) {
            canClose = false;
          }
        }
        if (nextChar === 34 && t2[0] === '"') {
          if (lastChar >= 48 && lastChar <= 57) {
            canClose = canOpen = false;
          }
        }
        if (canOpen && canClose) {
          canOpen = isLastPunctChar;
          canClose = isNextPunctChar;
        }
        if (!canOpen && !canClose) {
          if (isSingle) {
            token.content = replaceAt(token.content, t2.index, APOSTROPHE);
          }
          continue;
        }
        if (canClose) {
          for (j2 = stack2.length - 1; j2 >= 0; j2--) {
            let item = stack2[j2];
            if (stack2[j2].level < thisLevel) {
              break;
            }
            if (item.single === isSingle && stack2[j2].level === thisLevel) {
              item = stack2[j2];
              let openQuote;
              let closeQuote;
              if (isSingle) {
                openQuote = state.md.options.quotes[2];
                closeQuote = state.md.options.quotes[3];
              } else {
                openQuote = state.md.options.quotes[0];
                closeQuote = state.md.options.quotes[1];
              }
              token.content = replaceAt(token.content, t2.index, closeQuote);
              tokens[item.token].content = replaceAt(
                tokens[item.token].content,
                item.pos,
                openQuote
              );
              pos += closeQuote.length - 1;
              if (item.token === i2) {
                pos += openQuote.length - 1;
              }
              text2 = token.content;
              max = text2.length;
              stack2.length = j2;
              continue OUTER;
            }
          }
        }
        if (canOpen) {
          stack2.push({
            token: i2,
            pos: t2.index,
            single: isSingle,
            level: thisLevel
          });
        } else if (canClose && isSingle) {
          token.content = replaceAt(token.content, t2.index, APOSTROPHE);
        }
      }
  }
}
function smartquotes(state) {
  if (!state.md.options.typographer) {
    return;
  }
  for (let blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
    if (state.tokens[blkIdx].type !== "inline" || !QUOTE_TEST_RE.test(state.tokens[blkIdx].content)) {
      continue;
    }
    process_inlines(state.tokens[blkIdx].children, state);
  }
}
function text_join(state) {
  let curr, last;
  const blockTokens = state.tokens;
  const l2 = blockTokens.length;
  for (let j2 = 0; j2 < l2; j2++) {
    if (blockTokens[j2].type !== "inline") continue;
    const tokens = blockTokens[j2].children;
    const max = tokens.length;
    for (curr = 0; curr < max; curr++) {
      if (tokens[curr].type === "text_special") {
        tokens[curr].type = "text";
      }
    }
    for (curr = last = 0; curr < max; curr++) {
      if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") {
        tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
      } else {
        if (curr !== last) {
          tokens[last] = tokens[curr];
        }
        last++;
      }
    }
    if (curr !== last) {
      tokens.length = last;
    }
  }
}
const _rules$2 = [
  ["normalize", normalize],
  ["block", block],
  ["inline", inline],
  ["linkify", linkify$1],
  ["replacements", replace],
  ["smartquotes", smartquotes],
  // `text_join` finds `text_special` tokens (for escape sequences)
  // and joins them with the rest of the text
  ["text_join", text_join]
];
function Core() {
  this.ruler = new Ruler();
  for (let i2 = 0; i2 < _rules$2.length; i2++) {
    this.ruler.push(_rules$2[i2][0], _rules$2[i2][1]);
  }
}
Core.prototype.process = function(state) {
  const rules = this.ruler.getRules("");
  for (let i2 = 0, l2 = rules.length; i2 < l2; i2++) {
    rules[i2](state);
  }
};
Core.prototype.State = StateCore;
function StateBlock(src, md2, env, tokens) {
  this.src = src;
  this.md = md2;
  this.env = env;
  this.tokens = tokens;
  this.bMarks = [];
  this.eMarks = [];
  this.tShift = [];
  this.sCount = [];
  this.bsCount = [];
  this.blkIndent = 0;
  this.line = 0;
  this.lineMax = 0;
  this.tight = false;
  this.ddIndent = -1;
  this.listIndent = -1;
  this.parentType = "root";
  this.level = 0;
  const s2 = this.src;
  for (let start = 0, pos = 0, indent = 0, offset = 0, len = s2.length, indent_found = false; pos < len; pos++) {
    const ch = s2.charCodeAt(pos);
    if (!indent_found) {
      if (isSpace(ch)) {
        indent++;
        if (ch === 9) {
          offset += 4 - offset % 4;
        } else {
          offset++;
        }
        continue;
      } else {
        indent_found = true;
      }
    }
    if (ch === 10 || pos === len - 1) {
      if (ch !== 10) {
        pos++;
      }
      this.bMarks.push(start);
      this.eMarks.push(pos);
      this.tShift.push(indent);
      this.sCount.push(offset);
      this.bsCount.push(0);
      indent_found = false;
      indent = 0;
      offset = 0;
      start = pos + 1;
    }
  }
  this.bMarks.push(s2.length);
  this.eMarks.push(s2.length);
  this.tShift.push(0);
  this.sCount.push(0);
  this.bsCount.push(0);
  this.lineMax = this.bMarks.length - 1;
}
StateBlock.prototype.push = function(type, tag, nesting) {
  const token = new Token(type, tag, nesting);
  token.block = true;
  if (nesting < 0) this.level--;
  token.level = this.level;
  if (nesting > 0) this.level++;
  this.tokens.push(token);
  return token;
};
StateBlock.prototype.isEmpty = function isEmpty(line) {
  return this.bMarks[line] + this.tShift[line] >= this.eMarks[line];
};
StateBlock.prototype.skipEmptyLines = function skipEmptyLines(from) {
  for (let max = this.lineMax; from < max; from++) {
    if (this.bMarks[from] + this.tShift[from] < this.eMarks[from]) {
      break;
    }
  }
  return from;
};
StateBlock.prototype.skipSpaces = function skipSpaces(pos) {
  for (let max = this.src.length; pos < max; pos++) {
    const ch = this.src.charCodeAt(pos);
    if (!isSpace(ch)) {
      break;
    }
  }
  return pos;
};
StateBlock.prototype.skipSpacesBack = function skipSpacesBack(pos, min) {
  if (pos <= min) {
    return pos;
  }
  while (pos > min) {
    if (!isSpace(this.src.charCodeAt(--pos))) {
      return pos + 1;
    }
  }
  return pos;
};
StateBlock.prototype.skipChars = function skipChars(pos, code2) {
  for (let max = this.src.length; pos < max; pos++) {
    if (this.src.charCodeAt(pos) !== code2) {
      break;
    }
  }
  return pos;
};
StateBlock.prototype.skipCharsBack = function skipCharsBack(pos, code2, min) {
  if (pos <= min) {
    return pos;
  }
  while (pos > min) {
    if (code2 !== this.src.charCodeAt(--pos)) {
      return pos + 1;
    }
  }
  return pos;
};
StateBlock.prototype.getLines = function getLines(begin, end, indent, keepLastLF) {
  if (begin >= end) {
    return "";
  }
  const queue2 = new Array(end - begin);
  for (let i2 = 0, line = begin; line < end; line++, i2++) {
    let lineIndent = 0;
    const lineStart = this.bMarks[line];
    let first = lineStart;
    let last;
    if (line + 1 < end || keepLastLF) {
      last = this.eMarks[line] + 1;
    } else {
      last = this.eMarks[line];
    }
    while (first < last && lineIndent < indent) {
      const ch = this.src.charCodeAt(first);
      if (isSpace(ch)) {
        if (ch === 9) {
          lineIndent += 4 - (lineIndent + this.bsCount[line]) % 4;
        } else {
          lineIndent++;
        }
      } else if (first - lineStart < this.tShift[line]) {
        lineIndent++;
      } else {
        break;
      }
      first++;
    }
    if (lineIndent > indent) {
      queue2[i2] = new Array(lineIndent - indent + 1).join(" ") + this.src.slice(first, last);
    } else {
      queue2[i2] = this.src.slice(first, last);
    }
  }
  return queue2.join("");
};
StateBlock.prototype.Token = Token;
const MAX_AUTOCOMPLETED_CELLS = 65536;
function getLine(state, line) {
  const pos = state.bMarks[line] + state.tShift[line];
  const max = state.eMarks[line];
  return state.src.slice(pos, max);
}
function escapedSplit(str) {
  const result = [];
  const max = str.length;
  let pos = 0;
  let ch = str.charCodeAt(pos);
  let isEscaped = false;
  let lastPos = 0;
  let current = "";
  while (pos < max) {
    if (ch === 124) {
      if (!isEscaped) {
        result.push(current + str.substring(lastPos, pos));
        current = "";
        lastPos = pos + 1;
      } else {
        current += str.substring(lastPos, pos - 1);
        lastPos = pos;
      }
    }
    isEscaped = ch === 92;
    pos++;
    ch = str.charCodeAt(pos);
  }
  result.push(current + str.substring(lastPos));
  return result;
}
function table(state, startLine, endLine, silent) {
  if (startLine + 2 > endLine) {
    return false;
  }
  let nextLine = startLine + 1;
  if (state.sCount[nextLine] < state.blkIndent) {
    return false;
  }
  if (state.sCount[nextLine] - state.blkIndent >= 4) {
    return false;
  }
  let pos = state.bMarks[nextLine] + state.tShift[nextLine];
  if (pos >= state.eMarks[nextLine]) {
    return false;
  }
  const firstCh = state.src.charCodeAt(pos++);
  if (firstCh !== 124 && firstCh !== 45 && firstCh !== 58) {
    return false;
  }
  if (pos >= state.eMarks[nextLine]) {
    return false;
  }
  const secondCh = state.src.charCodeAt(pos++);
  if (secondCh !== 124 && secondCh !== 45 && secondCh !== 58 && !isSpace(secondCh)) {
    return false;
  }
  if (firstCh === 45 && isSpace(secondCh)) {
    return false;
  }
  while (pos < state.eMarks[nextLine]) {
    const ch = state.src.charCodeAt(pos);
    if (ch !== 124 && ch !== 45 && ch !== 58 && !isSpace(ch)) {
      return false;
    }
    pos++;
  }
  let lineText = getLine(state, startLine + 1);
  let columns = lineText.split("|");
  const aligns = [];
  for (let i2 = 0; i2 < columns.length; i2++) {
    const t2 = columns[i2].trim();
    if (!t2) {
      if (i2 === 0 || i2 === columns.length - 1) {
        continue;
      } else {
        return false;
      }
    }
    if (!/^:?-+:?$/.test(t2)) {
      return false;
    }
    if (t2.charCodeAt(t2.length - 1) === 58) {
      aligns.push(t2.charCodeAt(0) === 58 ? "center" : "right");
    } else if (t2.charCodeAt(0) === 58) {
      aligns.push("left");
    } else {
      aligns.push("");
    }
  }
  lineText = getLine(state, startLine).trim();
  if (lineText.indexOf("|") === -1) {
    return false;
  }
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  columns = escapedSplit(lineText);
  if (columns.length && columns[0] === "") columns.shift();
  if (columns.length && columns[columns.length - 1] === "") columns.pop();
  const columnCount = columns.length;
  if (columnCount === 0 || columnCount !== aligns.length) {
    return false;
  }
  if (silent) {
    return true;
  }
  const oldParentType = state.parentType;
  state.parentType = "table";
  const terminatorRules = state.md.block.ruler.getRules("blockquote");
  const token_to = state.push("table_open", "table", 1);
  const tableLines = [startLine, 0];
  token_to.map = tableLines;
  const token_tho = state.push("thead_open", "thead", 1);
  token_tho.map = [startLine, startLine + 1];
  const token_htro = state.push("tr_open", "tr", 1);
  token_htro.map = [startLine, startLine + 1];
  for (let i2 = 0; i2 < columns.length; i2++) {
    const token_ho = state.push("th_open", "th", 1);
    if (aligns[i2]) {
      token_ho.attrs = [["style", "text-align:" + aligns[i2]]];
    }
    const token_il = state.push("inline", "", 0);
    token_il.content = columns[i2].trim();
    token_il.children = [];
    state.push("th_close", "th", -1);
  }
  state.push("tr_close", "tr", -1);
  state.push("thead_close", "thead", -1);
  let tbodyLines;
  let autocompletedCells = 0;
  for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
    if (state.sCount[nextLine] < state.blkIndent) {
      break;
    }
    let terminate = false;
    for (let i2 = 0, l2 = terminatorRules.length; i2 < l2; i2++) {
      if (terminatorRules[i2](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) {
      break;
    }
    lineText = getLine(state, nextLine).trim();
    if (!lineText) {
      break;
    }
    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      break;
    }
    columns = escapedSplit(lineText);
    if (columns.length && columns[0] === "") columns.shift();
    if (columns.length && columns[columns.length - 1] === "") columns.pop();
    autocompletedCells += columnCount - columns.length;
    if (autocompletedCells > MAX_AUTOCOMPLETED_CELLS) {
      break;
    }
    if (nextLine === startLine + 2) {
      const token_tbo = state.push("tbody_open", "tbody", 1);
      token_tbo.map = tbodyLines = [startLine + 2, 0];
    }
    const token_tro = state.push("tr_open", "tr", 1);
    token_tro.map = [nextLine, nextLine + 1];
    for (let i2 = 0; i2 < columnCount; i2++) {
      const token_tdo = state.push("td_open", "td", 1);
      if (aligns[i2]) {
        token_tdo.attrs = [["style", "text-align:" + aligns[i2]]];
      }
      const token_il = state.push("inline", "", 0);
      token_il.content = columns[i2] ? columns[i2].trim() : "";
      token_il.children = [];
      state.push("td_close", "td", -1);
    }
    state.push("tr_close", "tr", -1);
  }
  if (tbodyLines) {
    state.push("tbody_close", "tbody", -1);
    tbodyLines[1] = nextLine;
  }
  state.push("table_close", "table", -1);
  tableLines[1] = nextLine;
  state.parentType = oldParentType;
  state.line = nextLine;
  return true;
}
function code(state, startLine, endLine) {
  if (state.sCount[startLine] - state.blkIndent < 4) {
    return false;
  }
  let nextLine = startLine + 1;
  let last = nextLine;
  while (nextLine < endLine) {
    if (state.isEmpty(nextLine)) {
      nextLine++;
      continue;
    }
    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      nextLine++;
      last = nextLine;
      continue;
    }
    break;
  }
  state.line = last;
  const token = state.push("code_block", "code", 0);
  token.content = state.getLines(startLine, last, 4 + state.blkIndent, false) + "\n";
  token.map = [startLine, state.line];
  return true;
}
function fence(state, startLine, endLine, silent) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  if (pos + 3 > max) {
    return false;
  }
  const marker = state.src.charCodeAt(pos);
  if (marker !== 126 && marker !== 96) {
    return false;
  }
  let mem = pos;
  pos = state.skipChars(pos, marker);
  let len = pos - mem;
  if (len < 3) {
    return false;
  }
  const markup = state.src.slice(mem, pos);
  const params = state.src.slice(pos, max);
  if (marker === 96) {
    if (params.indexOf(String.fromCharCode(marker)) >= 0) {
      return false;
    }
  }
  if (silent) {
    return true;
  }
  let nextLine = startLine;
  let haveEndMarker = false;
  for (; ; ) {
    nextLine++;
    if (nextLine >= endLine) {
      break;
    }
    pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    if (pos < max && state.sCount[nextLine] < state.blkIndent) {
      break;
    }
    if (state.src.charCodeAt(pos) !== marker) {
      continue;
    }
    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      continue;
    }
    pos = state.skipChars(pos, marker);
    if (pos - mem < len) {
      continue;
    }
    pos = state.skipSpaces(pos);
    if (pos < max) {
      continue;
    }
    haveEndMarker = true;
    break;
  }
  len = state.sCount[startLine];
  state.line = nextLine + (haveEndMarker ? 1 : 0);
  const token = state.push("fence", "code", 0);
  token.info = params;
  token.content = state.getLines(startLine + 1, nextLine, len, true);
  token.markup = markup;
  token.map = [startLine, state.line];
  return true;
}
function blockquote(state, startLine, endLine, silent) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  const oldLineMax = state.lineMax;
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  if (state.src.charCodeAt(pos) !== 62) {
    return false;
  }
  if (silent) {
    return true;
  }
  const oldBMarks = [];
  const oldBSCount = [];
  const oldSCount = [];
  const oldTShift = [];
  const terminatorRules = state.md.block.ruler.getRules("blockquote");
  const oldParentType = state.parentType;
  state.parentType = "blockquote";
  let lastLineEmpty = false;
  let nextLine;
  for (nextLine = startLine; nextLine < endLine; nextLine++) {
    const isOutdented = state.sCount[nextLine] < state.blkIndent;
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    if (pos >= max) {
      break;
    }
    if (state.src.charCodeAt(pos++) === 62 && !isOutdented) {
      let initial = state.sCount[nextLine] + 1;
      let spaceAfterMarker;
      let adjustTab;
      if (state.src.charCodeAt(pos) === 32) {
        pos++;
        initial++;
        adjustTab = false;
        spaceAfterMarker = true;
      } else if (state.src.charCodeAt(pos) === 9) {
        spaceAfterMarker = true;
        if ((state.bsCount[nextLine] + initial) % 4 === 3) {
          pos++;
          initial++;
          adjustTab = false;
        } else {
          adjustTab = true;
        }
      } else {
        spaceAfterMarker = false;
      }
      let offset = initial;
      oldBMarks.push(state.bMarks[nextLine]);
      state.bMarks[nextLine] = pos;
      while (pos < max) {
        const ch = state.src.charCodeAt(pos);
        if (isSpace(ch)) {
          if (ch === 9) {
            offset += 4 - (offset + state.bsCount[nextLine] + (adjustTab ? 1 : 0)) % 4;
          } else {
            offset++;
          }
        } else {
          break;
        }
        pos++;
      }
      lastLineEmpty = pos >= max;
      oldBSCount.push(state.bsCount[nextLine]);
      state.bsCount[nextLine] = state.sCount[nextLine] + 1 + (spaceAfterMarker ? 1 : 0);
      oldSCount.push(state.sCount[nextLine]);
      state.sCount[nextLine] = offset - initial;
      oldTShift.push(state.tShift[nextLine]);
      state.tShift[nextLine] = pos - state.bMarks[nextLine];
      continue;
    }
    if (lastLineEmpty) {
      break;
    }
    let terminate = false;
    for (let i2 = 0, l2 = terminatorRules.length; i2 < l2; i2++) {
      if (terminatorRules[i2](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) {
      state.lineMax = nextLine;
      if (state.blkIndent !== 0) {
        oldBMarks.push(state.bMarks[nextLine]);
        oldBSCount.push(state.bsCount[nextLine]);
        oldTShift.push(state.tShift[nextLine]);
        oldSCount.push(state.sCount[nextLine]);
        state.sCount[nextLine] -= state.blkIndent;
      }
      break;
    }
    oldBMarks.push(state.bMarks[nextLine]);
    oldBSCount.push(state.bsCount[nextLine]);
    oldTShift.push(state.tShift[nextLine]);
    oldSCount.push(state.sCount[nextLine]);
    state.sCount[nextLine] = -1;
  }
  const oldIndent = state.blkIndent;
  state.blkIndent = 0;
  const token_o = state.push("blockquote_open", "blockquote", 1);
  token_o.markup = ">";
  const lines = [startLine, 0];
  token_o.map = lines;
  state.md.block.tokenize(state, startLine, nextLine);
  const token_c = state.push("blockquote_close", "blockquote", -1);
  token_c.markup = ">";
  state.lineMax = oldLineMax;
  state.parentType = oldParentType;
  lines[1] = state.line;
  for (let i2 = 0; i2 < oldTShift.length; i2++) {
    state.bMarks[i2 + startLine] = oldBMarks[i2];
    state.tShift[i2 + startLine] = oldTShift[i2];
    state.sCount[i2 + startLine] = oldSCount[i2];
    state.bsCount[i2 + startLine] = oldBSCount[i2];
  }
  state.blkIndent = oldIndent;
  return true;
}
function hr(state, startLine, endLine, silent) {
  const max = state.eMarks[startLine];
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  const marker = state.src.charCodeAt(pos++);
  if (marker !== 42 && marker !== 45 && marker !== 95) {
    return false;
  }
  let cnt = 1;
  while (pos < max) {
    const ch = state.src.charCodeAt(pos++);
    if (ch !== marker && !isSpace(ch)) {
      return false;
    }
    if (ch === marker) {
      cnt++;
    }
  }
  if (cnt < 3) {
    return false;
  }
  if (silent) {
    return true;
  }
  state.line = startLine + 1;
  const token = state.push("hr", "hr", 0);
  token.map = [startLine, state.line];
  token.markup = Array(cnt + 1).join(String.fromCharCode(marker));
  return true;
}
function skipBulletListMarker(state, startLine) {
  const max = state.eMarks[startLine];
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  const marker = state.src.charCodeAt(pos++);
  if (marker !== 42 && marker !== 45 && marker !== 43) {
    return -1;
  }
  if (pos < max) {
    const ch = state.src.charCodeAt(pos);
    if (!isSpace(ch)) {
      return -1;
    }
  }
  return pos;
}
function skipOrderedListMarker(state, startLine) {
  const start = state.bMarks[startLine] + state.tShift[startLine];
  const max = state.eMarks[startLine];
  let pos = start;
  if (pos + 1 >= max) {
    return -1;
  }
  let ch = state.src.charCodeAt(pos++);
  if (ch < 48 || ch > 57) {
    return -1;
  }
  for (; ; ) {
    if (pos >= max) {
      return -1;
    }
    ch = state.src.charCodeAt(pos++);
    if (ch >= 48 && ch <= 57) {
      if (pos - start >= 10) {
        return -1;
      }
      continue;
    }
    if (ch === 41 || ch === 46) {
      break;
    }
    return -1;
  }
  if (pos < max) {
    ch = state.src.charCodeAt(pos);
    if (!isSpace(ch)) {
      return -1;
    }
  }
  return pos;
}
function markTightParagraphs(state, idx) {
  const level = state.level + 2;
  for (let i2 = idx + 2, l2 = state.tokens.length - 2; i2 < l2; i2++) {
    if (state.tokens[i2].level === level && state.tokens[i2].type === "paragraph_open") {
      state.tokens[i2 + 2].hidden = true;
      state.tokens[i2].hidden = true;
      i2 += 2;
    }
  }
}
function list(state, startLine, endLine, silent) {
  let max, pos, start, token;
  let nextLine = startLine;
  let tight = true;
  if (state.sCount[nextLine] - state.blkIndent >= 4) {
    return false;
  }
  if (state.listIndent >= 0 && state.sCount[nextLine] - state.listIndent >= 4 && state.sCount[nextLine] < state.blkIndent) {
    return false;
  }
  let isTerminatingParagraph = false;
  if (silent && state.parentType === "paragraph") {
    if (state.sCount[nextLine] >= state.blkIndent) {
      isTerminatingParagraph = true;
    }
  }
  let isOrdered;
  let markerValue;
  let posAfterMarker;
  if ((posAfterMarker = skipOrderedListMarker(state, nextLine)) >= 0) {
    isOrdered = true;
    start = state.bMarks[nextLine] + state.tShift[nextLine];
    markerValue = Number(state.src.slice(start, posAfterMarker - 1));
    if (isTerminatingParagraph && markerValue !== 1) return false;
  } else if ((posAfterMarker = skipBulletListMarker(state, nextLine)) >= 0) {
    isOrdered = false;
  } else {
    return false;
  }
  if (isTerminatingParagraph) {
    if (state.skipSpaces(posAfterMarker) >= state.eMarks[nextLine]) return false;
  }
  if (silent) {
    return true;
  }
  const markerCharCode = state.src.charCodeAt(posAfterMarker - 1);
  const listTokIdx = state.tokens.length;
  if (isOrdered) {
    token = state.push("ordered_list_open", "ol", 1);
    if (markerValue !== 1) {
      token.attrs = [["start", markerValue]];
    }
  } else {
    token = state.push("bullet_list_open", "ul", 1);
  }
  const listLines = [nextLine, 0];
  token.map = listLines;
  token.markup = String.fromCharCode(markerCharCode);
  let prevEmptyEnd = false;
  const terminatorRules = state.md.block.ruler.getRules("list");
  const oldParentType = state.parentType;
  state.parentType = "list";
  while (nextLine < endLine) {
    pos = posAfterMarker;
    max = state.eMarks[nextLine];
    const initial = state.sCount[nextLine] + posAfterMarker - (state.bMarks[nextLine] + state.tShift[nextLine]);
    let offset = initial;
    while (pos < max) {
      const ch = state.src.charCodeAt(pos);
      if (ch === 9) {
        offset += 4 - (offset + state.bsCount[nextLine]) % 4;
      } else if (ch === 32) {
        offset++;
      } else {
        break;
      }
      pos++;
    }
    const contentStart = pos;
    let indentAfterMarker;
    if (contentStart >= max) {
      indentAfterMarker = 1;
    } else {
      indentAfterMarker = offset - initial;
    }
    if (indentAfterMarker > 4) {
      indentAfterMarker = 1;
    }
    const indent = initial + indentAfterMarker;
    token = state.push("list_item_open", "li", 1);
    token.markup = String.fromCharCode(markerCharCode);
    const itemLines = [nextLine, 0];
    token.map = itemLines;
    if (isOrdered) {
      token.info = state.src.slice(start, posAfterMarker - 1);
    }
    const oldTight = state.tight;
    const oldTShift = state.tShift[nextLine];
    const oldSCount = state.sCount[nextLine];
    const oldListIndent = state.listIndent;
    state.listIndent = state.blkIndent;
    state.blkIndent = indent;
    state.tight = true;
    state.tShift[nextLine] = contentStart - state.bMarks[nextLine];
    state.sCount[nextLine] = offset;
    if (contentStart >= max && state.isEmpty(nextLine + 1)) {
      state.line = Math.min(state.line + 2, endLine);
    } else {
      state.md.block.tokenize(state, nextLine, endLine, true);
    }
    if (!state.tight || prevEmptyEnd) {
      tight = false;
    }
    prevEmptyEnd = state.line - nextLine > 1 && state.isEmpty(state.line - 1);
    state.blkIndent = state.listIndent;
    state.listIndent = oldListIndent;
    state.tShift[nextLine] = oldTShift;
    state.sCount[nextLine] = oldSCount;
    state.tight = oldTight;
    token = state.push("list_item_close", "li", -1);
    token.markup = String.fromCharCode(markerCharCode);
    nextLine = state.line;
    itemLines[1] = nextLine;
    if (nextLine >= endLine) {
      break;
    }
    if (state.sCount[nextLine] < state.blkIndent) {
      break;
    }
    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      break;
    }
    let terminate = false;
    for (let i2 = 0, l2 = terminatorRules.length; i2 < l2; i2++) {
      if (terminatorRules[i2](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) {
      break;
    }
    if (isOrdered) {
      posAfterMarker = skipOrderedListMarker(state, nextLine);
      if (posAfterMarker < 0) {
        break;
      }
      start = state.bMarks[nextLine] + state.tShift[nextLine];
    } else {
      posAfterMarker = skipBulletListMarker(state, nextLine);
      if (posAfterMarker < 0) {
        break;
      }
    }
    if (markerCharCode !== state.src.charCodeAt(posAfterMarker - 1)) {
      break;
    }
  }
  if (isOrdered) {
    token = state.push("ordered_list_close", "ol", -1);
  } else {
    token = state.push("bullet_list_close", "ul", -1);
  }
  token.markup = String.fromCharCode(markerCharCode);
  listLines[1] = nextLine;
  state.line = nextLine;
  state.parentType = oldParentType;
  if (tight) {
    markTightParagraphs(state, listTokIdx);
  }
  return true;
}
function reference(state, startLine, _endLine, silent) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  let nextLine = startLine + 1;
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  if (state.src.charCodeAt(pos) !== 91) {
    return false;
  }
  function getNextLine(nextLine2) {
    const endLine = state.lineMax;
    if (nextLine2 >= endLine || state.isEmpty(nextLine2)) {
      return null;
    }
    let isContinuation = false;
    if (state.sCount[nextLine2] - state.blkIndent > 3) {
      isContinuation = true;
    }
    if (state.sCount[nextLine2] < 0) {
      isContinuation = true;
    }
    if (!isContinuation) {
      const terminatorRules = state.md.block.ruler.getRules("reference");
      const oldParentType = state.parentType;
      state.parentType = "reference";
      let terminate = false;
      for (let i2 = 0, l2 = terminatorRules.length; i2 < l2; i2++) {
        if (terminatorRules[i2](state, nextLine2, endLine, true)) {
          terminate = true;
          break;
        }
      }
      state.parentType = oldParentType;
      if (terminate) {
        return null;
      }
    }
    const pos2 = state.bMarks[nextLine2] + state.tShift[nextLine2];
    const max2 = state.eMarks[nextLine2];
    return state.src.slice(pos2, max2 + 1);
  }
  let str = state.src.slice(pos, max + 1);
  max = str.length;
  let labelEnd = -1;
  for (pos = 1; pos < max; pos++) {
    const ch = str.charCodeAt(pos);
    if (ch === 91) {
      return false;
    } else if (ch === 93) {
      labelEnd = pos;
      break;
    } else if (ch === 10) {
      const lineContent = getNextLine(nextLine);
      if (lineContent !== null) {
        str += lineContent;
        max = str.length;
        nextLine++;
      }
    } else if (ch === 92) {
      pos++;
      if (pos < max && str.charCodeAt(pos) === 10) {
        const lineContent = getNextLine(nextLine);
        if (lineContent !== null) {
          str += lineContent;
          max = str.length;
          nextLine++;
        }
      }
    }
  }
  if (labelEnd < 0 || str.charCodeAt(labelEnd + 1) !== 58) {
    return false;
  }
  for (pos = labelEnd + 2; pos < max; pos++) {
    const ch = str.charCodeAt(pos);
    if (ch === 10) {
      const lineContent = getNextLine(nextLine);
      if (lineContent !== null) {
        str += lineContent;
        max = str.length;
        nextLine++;
      }
    } else if (isSpace(ch)) ;
    else {
      break;
    }
  }
  const destRes = state.md.helpers.parseLinkDestination(str, pos, max);
  if (!destRes.ok) {
    return false;
  }
  const href = state.md.normalizeLink(destRes.str);
  if (!state.md.validateLink(href)) {
    return false;
  }
  pos = destRes.pos;
  const destEndPos = pos;
  const destEndLineNo = nextLine;
  const start = pos;
  for (; pos < max; pos++) {
    const ch = str.charCodeAt(pos);
    if (ch === 10) {
      const lineContent = getNextLine(nextLine);
      if (lineContent !== null) {
        str += lineContent;
        max = str.length;
        nextLine++;
      }
    } else if (isSpace(ch)) ;
    else {
      break;
    }
  }
  let titleRes = state.md.helpers.parseLinkTitle(str, pos, max);
  while (titleRes.can_continue) {
    const lineContent = getNextLine(nextLine);
    if (lineContent === null) break;
    str += lineContent;
    pos = max;
    max = str.length;
    nextLine++;
    titleRes = state.md.helpers.parseLinkTitle(str, pos, max, titleRes);
  }
  let title;
  if (pos < max && start !== pos && titleRes.ok) {
    title = titleRes.str;
    pos = titleRes.pos;
  } else {
    title = "";
    pos = destEndPos;
    nextLine = destEndLineNo;
  }
  while (pos < max) {
    const ch = str.charCodeAt(pos);
    if (!isSpace(ch)) {
      break;
    }
    pos++;
  }
  if (pos < max && str.charCodeAt(pos) !== 10) {
    if (title) {
      title = "";
      pos = destEndPos;
      nextLine = destEndLineNo;
      while (pos < max) {
        const ch = str.charCodeAt(pos);
        if (!isSpace(ch)) {
          break;
        }
        pos++;
      }
    }
  }
  if (pos < max && str.charCodeAt(pos) !== 10) {
    return false;
  }
  const label = normalizeReference(str.slice(1, labelEnd));
  if (!label) {
    return false;
  }
  if (silent) {
    return true;
  }
  if (typeof state.env.references === "undefined") {
    state.env.references = {};
  }
  if (typeof state.env.references[label] === "undefined") {
    state.env.references[label] = { title, href };
  }
  state.line = nextLine;
  return true;
}
const block_names = [
  "address",
  "article",
  "aside",
  "base",
  "basefont",
  "blockquote",
  "body",
  "caption",
  "center",
  "col",
  "colgroup",
  "dd",
  "details",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "iframe",
  "legend",
  "li",
  "link",
  "main",
  "menu",
  "menuitem",
  "nav",
  "noframes",
  "ol",
  "optgroup",
  "option",
  "p",
  "param",
  "search",
  "section",
  "summary",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "title",
  "tr",
  "track",
  "ul"
];
const attr_name = "[a-zA-Z_:][a-zA-Z0-9:._-]*";
const unquoted = "[^\"'=<>`\\x00-\\x20]+";
const single_quoted = "'[^']*'";
const double_quoted = '"[^"]*"';
const attr_value = "(?:" + unquoted + "|" + single_quoted + "|" + double_quoted + ")";
const attribute = "(?:\\s+" + attr_name + "(?:\\s*=\\s*" + attr_value + ")?)";
const open_tag = "<[A-Za-z][A-Za-z0-9\\-]*" + attribute + "*\\s*\\/?>";
const close_tag = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>";
const comment = "<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->";
const processing = "<[?][\\s\\S]*?[?]>";
const declaration = "<![A-Za-z][^>]*>";
const cdata = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>";
const HTML_TAG_RE = new RegExp("^(?:" + open_tag + "|" + close_tag + "|" + comment + "|" + processing + "|" + declaration + "|" + cdata + ")");
const HTML_OPEN_CLOSE_TAG_RE = new RegExp("^(?:" + open_tag + "|" + close_tag + ")");
const HTML_SEQUENCES = [
  [/^<(script|pre|style|textarea)(?=(\s|>|$))/i, /<\/(script|pre|style|textarea)>/i, true],
  [/^<!--/, /-->/, true],
  [/^<\?/, /\?>/, true],
  [/^<![A-Z]/, />/, true],
  [/^<!\[CDATA\[/, /\]\]>/, true],
  [new RegExp("^</?(" + block_names.join("|") + ")(?=(\\s|/?>|$))", "i"), /^$/, true],
  [new RegExp(HTML_OPEN_CLOSE_TAG_RE.source + "\\s*$"), /^$/, false]
];
function html_block(state, startLine, endLine, silent) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  if (!state.md.options.html) {
    return false;
  }
  if (state.src.charCodeAt(pos) !== 60) {
    return false;
  }
  let lineText = state.src.slice(pos, max);
  let i2 = 0;
  for (; i2 < HTML_SEQUENCES.length; i2++) {
    if (HTML_SEQUENCES[i2][0].test(lineText)) {
      break;
    }
  }
  if (i2 === HTML_SEQUENCES.length) {
    return false;
  }
  if (silent) {
    return HTML_SEQUENCES[i2][2];
  }
  let nextLine = startLine + 1;
  if (!HTML_SEQUENCES[i2][1].test(lineText)) {
    for (; nextLine < endLine; nextLine++) {
      if (state.sCount[nextLine] < state.blkIndent) {
        break;
      }
      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];
      lineText = state.src.slice(pos, max);
      if (HTML_SEQUENCES[i2][1].test(lineText)) {
        if (lineText.length !== 0) {
          nextLine++;
        }
        break;
      }
    }
  }
  state.line = nextLine;
  const token = state.push("html_block", "", 0);
  token.map = [startLine, nextLine];
  token.content = state.getLines(startLine, nextLine, state.blkIndent, true);
  return true;
}
function heading(state, startLine, endLine, silent) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  let ch = state.src.charCodeAt(pos);
  if (ch !== 35 || pos >= max) {
    return false;
  }
  let level = 1;
  ch = state.src.charCodeAt(++pos);
  while (ch === 35 && pos < max && level <= 6) {
    level++;
    ch = state.src.charCodeAt(++pos);
  }
  if (level > 6 || pos < max && !isSpace(ch)) {
    return false;
  }
  if (silent) {
    return true;
  }
  max = state.skipSpacesBack(max, pos);
  const tmp = state.skipCharsBack(max, 35, pos);
  if (tmp > pos && isSpace(state.src.charCodeAt(tmp - 1))) {
    max = tmp;
  }
  state.line = startLine + 1;
  const token_o = state.push("heading_open", "h" + String(level), 1);
  token_o.markup = "########".slice(0, level);
  token_o.map = [startLine, state.line];
  const token_i = state.push("inline", "", 0);
  token_i.content = state.src.slice(pos, max).trim();
  token_i.map = [startLine, state.line];
  token_i.children = [];
  const token_c = state.push("heading_close", "h" + String(level), -1);
  token_c.markup = "########".slice(0, level);
  return true;
}
function lheading(state, startLine, endLine) {
  const terminatorRules = state.md.block.ruler.getRules("paragraph");
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  const oldParentType = state.parentType;
  state.parentType = "paragraph";
  let level = 0;
  let marker;
  let nextLine = startLine + 1;
  for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
    if (state.sCount[nextLine] - state.blkIndent > 3) {
      continue;
    }
    if (state.sCount[nextLine] >= state.blkIndent) {
      let pos = state.bMarks[nextLine] + state.tShift[nextLine];
      const max = state.eMarks[nextLine];
      if (pos < max) {
        marker = state.src.charCodeAt(pos);
        if (marker === 45 || marker === 61) {
          pos = state.skipChars(pos, marker);
          pos = state.skipSpaces(pos);
          if (pos >= max) {
            level = marker === 61 ? 1 : 2;
            break;
          }
        }
      }
    }
    if (state.sCount[nextLine] < 0) {
      continue;
    }
    let terminate = false;
    for (let i2 = 0, l2 = terminatorRules.length; i2 < l2; i2++) {
      if (terminatorRules[i2](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) {
      break;
    }
  }
  if (!level) {
    return false;
  }
  const content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
  state.line = nextLine + 1;
  const token_o = state.push("heading_open", "h" + String(level), 1);
  token_o.markup = String.fromCharCode(marker);
  token_o.map = [startLine, state.line];
  const token_i = state.push("inline", "", 0);
  token_i.content = content;
  token_i.map = [startLine, state.line - 1];
  token_i.children = [];
  const token_c = state.push("heading_close", "h" + String(level), -1);
  token_c.markup = String.fromCharCode(marker);
  state.parentType = oldParentType;
  return true;
}
function paragraph(state, startLine, endLine) {
  const terminatorRules = state.md.block.ruler.getRules("paragraph");
  const oldParentType = state.parentType;
  let nextLine = startLine + 1;
  state.parentType = "paragraph";
  for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
    if (state.sCount[nextLine] - state.blkIndent > 3) {
      continue;
    }
    if (state.sCount[nextLine] < 0) {
      continue;
    }
    let terminate = false;
    for (let i2 = 0, l2 = terminatorRules.length; i2 < l2; i2++) {
      if (terminatorRules[i2](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) {
      break;
    }
  }
  const content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
  state.line = nextLine;
  const token_o = state.push("paragraph_open", "p", 1);
  token_o.map = [startLine, state.line];
  const token_i = state.push("inline", "", 0);
  token_i.content = content;
  token_i.map = [startLine, state.line];
  token_i.children = [];
  state.push("paragraph_close", "p", -1);
  state.parentType = oldParentType;
  return true;
}
const _rules$1 = [
  // First 2 params - rule name & source. Secondary array - list of rules,
  // which can be terminated by this one.
  ["table", table, ["paragraph", "reference"]],
  ["code", code],
  ["fence", fence, ["paragraph", "reference", "blockquote", "list"]],
  ["blockquote", blockquote, ["paragraph", "reference", "blockquote", "list"]],
  ["hr", hr, ["paragraph", "reference", "blockquote", "list"]],
  ["list", list, ["paragraph", "reference", "blockquote"]],
  ["reference", reference],
  ["html_block", html_block, ["paragraph", "reference", "blockquote"]],
  ["heading", heading, ["paragraph", "reference", "blockquote"]],
  ["lheading", lheading],
  ["paragraph", paragraph]
];
function ParserBlock() {
  this.ruler = new Ruler();
  for (let i2 = 0; i2 < _rules$1.length; i2++) {
    this.ruler.push(_rules$1[i2][0], _rules$1[i2][1], { alt: (_rules$1[i2][2] || []).slice() });
  }
}
ParserBlock.prototype.tokenize = function(state, startLine, endLine) {
  const rules = this.ruler.getRules("");
  const len = rules.length;
  const maxNesting = state.md.options.maxNesting;
  let line = startLine;
  let hasEmptyLines = false;
  while (line < endLine) {
    state.line = line = state.skipEmptyLines(line);
    if (line >= endLine) {
      break;
    }
    if (state.sCount[line] < state.blkIndent) {
      break;
    }
    if (state.level >= maxNesting) {
      state.line = endLine;
      break;
    }
    const prevLine = state.line;
    let ok = false;
    for (let i2 = 0; i2 < len; i2++) {
      ok = rules[i2](state, line, endLine, false);
      if (ok) {
        if (prevLine >= state.line) {
          throw new Error("block rule didn't increment state.line");
        }
        break;
      }
    }
    if (!ok) throw new Error("none of the block rules matched");
    state.tight = !hasEmptyLines;
    if (state.isEmpty(state.line - 1)) {
      hasEmptyLines = true;
    }
    line = state.line;
    if (line < endLine && state.isEmpty(line)) {
      hasEmptyLines = true;
      line++;
      state.line = line;
    }
  }
};
ParserBlock.prototype.parse = function(src, md2, env, outTokens) {
  if (!src) {
    return;
  }
  const state = new this.State(src, md2, env, outTokens);
  this.tokenize(state, state.line, state.lineMax);
};
ParserBlock.prototype.State = StateBlock;
function StateInline(src, md2, env, outTokens) {
  this.src = src;
  this.env = env;
  this.md = md2;
  this.tokens = outTokens;
  this.tokens_meta = Array(outTokens.length);
  this.pos = 0;
  this.posMax = this.src.length;
  this.level = 0;
  this.pending = "";
  this.pendingLevel = 0;
  this.cache = {};
  this.delimiters = [];
  this._prev_delimiters = [];
  this.backticks = {};
  this.backticksScanned = false;
  this.linkLevel = 0;
}
StateInline.prototype.pushPending = function() {
  const token = new Token("text", "", 0);
  token.content = this.pending;
  token.level = this.pendingLevel;
  this.tokens.push(token);
  this.pending = "";
  return token;
};
StateInline.prototype.push = function(type, tag, nesting) {
  if (this.pending) {
    this.pushPending();
  }
  const token = new Token(type, tag, nesting);
  let token_meta = null;
  if (nesting < 0) {
    this.level--;
    this.delimiters = this._prev_delimiters.pop();
  }
  token.level = this.level;
  if (nesting > 0) {
    this.level++;
    this._prev_delimiters.push(this.delimiters);
    this.delimiters = [];
    token_meta = { delimiters: this.delimiters };
  }
  this.pendingLevel = this.level;
  this.tokens.push(token);
  this.tokens_meta.push(token_meta);
  return token;
};
StateInline.prototype.scanDelims = function(start, canSplitWord) {
  const max = this.posMax;
  const marker = this.src.charCodeAt(start);
  const lastChar = start > 0 ? this.src.charCodeAt(start - 1) : 32;
  let pos = start;
  while (pos < max && this.src.charCodeAt(pos) === marker) {
    pos++;
  }
  const count = pos - start;
  const nextChar = pos < max ? this.src.charCodeAt(pos) : 32;
  const isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
  const isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));
  const isLastWhiteSpace = isWhiteSpace(lastChar);
  const isNextWhiteSpace = isWhiteSpace(nextChar);
  const left_flanking = !isNextWhiteSpace && (!isNextPunctChar || isLastWhiteSpace || isLastPunctChar);
  const right_flanking = !isLastWhiteSpace && (!isLastPunctChar || isNextWhiteSpace || isNextPunctChar);
  const can_open = left_flanking && (canSplitWord || !right_flanking || isLastPunctChar);
  const can_close = right_flanking && (canSplitWord || !left_flanking || isNextPunctChar);
  return { can_open, can_close, length: count };
};
StateInline.prototype.Token = Token;
function isTerminatorChar(ch) {
  switch (ch) {
    case 10:
    case 33:
    case 35:
    case 36:
    case 37:
    case 38:
    case 42:
    case 43:
    case 45:
    case 58:
    case 60:
    case 61:
    case 62:
    case 64:
    case 91:
    case 92:
    case 93:
    case 94:
    case 95:
    case 96:
    case 123:
    case 125:
    case 126:
      return true;
    default:
      return false;
  }
}
function text$1(state, silent) {
  let pos = state.pos;
  while (pos < state.posMax && !isTerminatorChar(state.src.charCodeAt(pos))) {
    pos++;
  }
  if (pos === state.pos) {
    return false;
  }
  if (!silent) {
    state.pending += state.src.slice(state.pos, pos);
  }
  state.pos = pos;
  return true;
}
const SCHEME_RE = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i;
function linkify(state, silent) {
  if (!state.md.options.linkify) return false;
  if (state.linkLevel > 0) return false;
  const pos = state.pos;
  const max = state.posMax;
  if (pos + 3 > max) return false;
  if (state.src.charCodeAt(pos) !== 58) return false;
  if (state.src.charCodeAt(pos + 1) !== 47) return false;
  if (state.src.charCodeAt(pos + 2) !== 47) return false;
  const match2 = state.pending.match(SCHEME_RE);
  if (!match2) return false;
  const proto = match2[1];
  const link2 = state.md.linkify.matchAtStart(state.src.slice(pos - proto.length));
  if (!link2) return false;
  let url = link2.url;
  if (url.length <= proto.length) return false;
  let urlEnd = url.length;
  while (urlEnd > 0 && url.charCodeAt(urlEnd - 1) === 42) {
    urlEnd--;
  }
  if (urlEnd !== url.length) {
    url = url.slice(0, urlEnd);
  }
  const fullUrl = state.md.normalizeLink(url);
  if (!state.md.validateLink(fullUrl)) return false;
  if (!silent) {
    state.pending = state.pending.slice(0, -proto.length);
    const token_o = state.push("link_open", "a", 1);
    token_o.attrs = [["href", fullUrl]];
    token_o.markup = "linkify";
    token_o.info = "auto";
    const token_t = state.push("text", "", 0);
    token_t.content = state.md.normalizeLinkText(url);
    const token_c = state.push("link_close", "a", -1);
    token_c.markup = "linkify";
    token_c.info = "auto";
  }
  state.pos += url.length - proto.length;
  return true;
}
function newline(state, silent) {
  let pos = state.pos;
  if (state.src.charCodeAt(pos) !== 10) {
    return false;
  }
  const pmax = state.pending.length - 1;
  const max = state.posMax;
  if (!silent) {
    if (pmax >= 0 && state.pending.charCodeAt(pmax) === 32) {
      if (pmax >= 1 && state.pending.charCodeAt(pmax - 1) === 32) {
        let ws = pmax - 1;
        while (ws >= 1 && state.pending.charCodeAt(ws - 1) === 32) ws--;
        state.pending = state.pending.slice(0, ws);
        state.push("hardbreak", "br", 0);
      } else {
        state.pending = state.pending.slice(0, -1);
        state.push("softbreak", "br", 0);
      }
    } else {
      state.push("softbreak", "br", 0);
    }
  }
  pos++;
  while (pos < max && isSpace(state.src.charCodeAt(pos))) {
    pos++;
  }
  state.pos = pos;
  return true;
}
const ESCAPED = [];
for (let i2 = 0; i2 < 256; i2++) {
  ESCAPED.push(0);
}
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(ch) {
  ESCAPED[ch.charCodeAt(0)] = 1;
});
function escape(state, silent) {
  let pos = state.pos;
  const max = state.posMax;
  if (state.src.charCodeAt(pos) !== 92) return false;
  pos++;
  if (pos >= max) return false;
  let ch1 = state.src.charCodeAt(pos);
  if (ch1 === 10) {
    if (!silent) {
      state.push("hardbreak", "br", 0);
    }
    pos++;
    while (pos < max) {
      ch1 = state.src.charCodeAt(pos);
      if (!isSpace(ch1)) break;
      pos++;
    }
    state.pos = pos;
    return true;
  }
  let escapedStr = state.src[pos];
  if (ch1 >= 55296 && ch1 <= 56319 && pos + 1 < max) {
    const ch2 = state.src.charCodeAt(pos + 1);
    if (ch2 >= 56320 && ch2 <= 57343) {
      escapedStr += state.src[pos + 1];
      pos++;
    }
  }
  const origStr = "\\" + escapedStr;
  if (!silent) {
    const token = state.push("text_special", "", 0);
    if (ch1 < 256 && ESCAPED[ch1] !== 0) {
      token.content = escapedStr;
    } else {
      token.content = origStr;
    }
    token.markup = origStr;
    token.info = "escape";
  }
  state.pos = pos + 1;
  return true;
}
function backtick(state, silent) {
  let pos = state.pos;
  const ch = state.src.charCodeAt(pos);
  if (ch !== 96) {
    return false;
  }
  const start = pos;
  pos++;
  const max = state.posMax;
  while (pos < max && state.src.charCodeAt(pos) === 96) {
    pos++;
  }
  const marker = state.src.slice(start, pos);
  const openerLength = marker.length;
  if (state.backticksScanned && (state.backticks[openerLength] || 0) <= start) {
    if (!silent) state.pending += marker;
    state.pos += openerLength;
    return true;
  }
  let matchEnd = pos;
  let matchStart;
  while ((matchStart = state.src.indexOf("`", matchEnd)) !== -1) {
    matchEnd = matchStart + 1;
    while (matchEnd < max && state.src.charCodeAt(matchEnd) === 96) {
      matchEnd++;
    }
    const closerLength = matchEnd - matchStart;
    if (closerLength === openerLength) {
      if (!silent) {
        const token = state.push("code_inline", "code", 0);
        token.markup = marker;
        token.content = state.src.slice(pos, matchStart).replace(/\n/g, " ").replace(/^ (.+) $/, "$1");
      }
      state.pos = matchEnd;
      return true;
    }
    state.backticks[closerLength] = matchStart;
  }
  state.backticksScanned = true;
  if (!silent) state.pending += marker;
  state.pos += openerLength;
  return true;
}
function strikethrough_tokenize(state, silent) {
  const start = state.pos;
  const marker = state.src.charCodeAt(start);
  if (silent) {
    return false;
  }
  if (marker !== 126) {
    return false;
  }
  const scanned = state.scanDelims(state.pos, true);
  let len = scanned.length;
  const ch = String.fromCharCode(marker);
  if (len < 2) {
    return false;
  }
  let token;
  if (len % 2) {
    token = state.push("text", "", 0);
    token.content = ch;
    len--;
  }
  for (let i2 = 0; i2 < len; i2 += 2) {
    token = state.push("text", "", 0);
    token.content = ch + ch;
    state.delimiters.push({
      marker,
      length: 0,
      // disable "rule of 3" length checks meant for emphasis
      token: state.tokens.length - 1,
      end: -1,
      open: scanned.can_open,
      close: scanned.can_close
    });
  }
  state.pos += scanned.length;
  return true;
}
function postProcess$1(state, delimiters) {
  let token;
  const loneMarkers = [];
  const max = delimiters.length;
  for (let i2 = 0; i2 < max; i2++) {
    const startDelim = delimiters[i2];
    if (startDelim.marker !== 126) {
      continue;
    }
    if (startDelim.end === -1) {
      continue;
    }
    const endDelim = delimiters[startDelim.end];
    token = state.tokens[startDelim.token];
    token.type = "s_open";
    token.tag = "s";
    token.nesting = 1;
    token.markup = "~~";
    token.content = "";
    token = state.tokens[endDelim.token];
    token.type = "s_close";
    token.tag = "s";
    token.nesting = -1;
    token.markup = "~~";
    token.content = "";
    if (state.tokens[endDelim.token - 1].type === "text" && state.tokens[endDelim.token - 1].content === "~") {
      loneMarkers.push(endDelim.token - 1);
    }
  }
  while (loneMarkers.length) {
    const i2 = loneMarkers.pop();
    let j2 = i2 + 1;
    while (j2 < state.tokens.length && state.tokens[j2].type === "s_close") {
      j2++;
    }
    j2--;
    if (i2 !== j2) {
      token = state.tokens[j2];
      state.tokens[j2] = state.tokens[i2];
      state.tokens[i2] = token;
    }
  }
}
function strikethrough_postProcess(state) {
  const tokens_meta = state.tokens_meta;
  const max = state.tokens_meta.length;
  postProcess$1(state, state.delimiters);
  for (let curr = 0; curr < max; curr++) {
    if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
      postProcess$1(state, tokens_meta[curr].delimiters);
    }
  }
}
const r_strikethrough = {
  tokenize: strikethrough_tokenize,
  postProcess: strikethrough_postProcess
};
function emphasis_tokenize(state, silent) {
  const start = state.pos;
  const marker = state.src.charCodeAt(start);
  if (silent) {
    return false;
  }
  if (marker !== 95 && marker !== 42) {
    return false;
  }
  const scanned = state.scanDelims(state.pos, marker === 42);
  for (let i2 = 0; i2 < scanned.length; i2++) {
    const token = state.push("text", "", 0);
    token.content = String.fromCharCode(marker);
    state.delimiters.push({
      // Char code of the starting marker (number).
      //
      marker,
      // Total length of these series of delimiters.
      //
      length: scanned.length,
      // A position of the token this delimiter corresponds to.
      //
      token: state.tokens.length - 1,
      // If this delimiter is matched as a valid opener, `end` will be
      // equal to its position, otherwise it's `-1`.
      //
      end: -1,
      // Boolean flags that determine if this delimiter could open or close
      // an emphasis.
      //
      open: scanned.can_open,
      close: scanned.can_close
    });
  }
  state.pos += scanned.length;
  return true;
}
function postProcess(state, delimiters) {
  const max = delimiters.length;
  for (let i2 = max - 1; i2 >= 0; i2--) {
    const startDelim = delimiters[i2];
    if (startDelim.marker !== 95 && startDelim.marker !== 42) {
      continue;
    }
    if (startDelim.end === -1) {
      continue;
    }
    const endDelim = delimiters[startDelim.end];
    const isStrong = i2 > 0 && delimiters[i2 - 1].end === startDelim.end + 1 && // check that first two markers match and adjacent
    delimiters[i2 - 1].marker === startDelim.marker && delimiters[i2 - 1].token === startDelim.token - 1 && // check that last two markers are adjacent (we can safely assume they match)
    delimiters[startDelim.end + 1].token === endDelim.token + 1;
    const ch = String.fromCharCode(startDelim.marker);
    const token_o = state.tokens[startDelim.token];
    token_o.type = isStrong ? "strong_open" : "em_open";
    token_o.tag = isStrong ? "strong" : "em";
    token_o.nesting = 1;
    token_o.markup = isStrong ? ch + ch : ch;
    token_o.content = "";
    const token_c = state.tokens[endDelim.token];
    token_c.type = isStrong ? "strong_close" : "em_close";
    token_c.tag = isStrong ? "strong" : "em";
    token_c.nesting = -1;
    token_c.markup = isStrong ? ch + ch : ch;
    token_c.content = "";
    if (isStrong) {
      state.tokens[delimiters[i2 - 1].token].content = "";
      state.tokens[delimiters[startDelim.end + 1].token].content = "";
      i2--;
    }
  }
}
function emphasis_post_process(state) {
  const tokens_meta = state.tokens_meta;
  const max = state.tokens_meta.length;
  postProcess(state, state.delimiters);
  for (let curr = 0; curr < max; curr++) {
    if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
      postProcess(state, tokens_meta[curr].delimiters);
    }
  }
}
const r_emphasis = {
  tokenize: emphasis_tokenize,
  postProcess: emphasis_post_process
};
function link(state, silent) {
  let code2, label, res, ref2;
  let href = "";
  let title = "";
  let start = state.pos;
  let parseReference = true;
  if (state.src.charCodeAt(state.pos) !== 91) {
    return false;
  }
  const oldPos = state.pos;
  const max = state.posMax;
  const labelStart = state.pos + 1;
  const labelEnd = state.md.helpers.parseLinkLabel(state, state.pos, true);
  if (labelEnd < 0) {
    return false;
  }
  let pos = labelEnd + 1;
  if (pos < max && state.src.charCodeAt(pos) === 40) {
    parseReference = false;
    pos++;
    for (; pos < max; pos++) {
      code2 = state.src.charCodeAt(pos);
      if (!isSpace(code2) && code2 !== 10) {
        break;
      }
    }
    if (pos >= max) {
      return false;
    }
    start = pos;
    res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
    if (res.ok) {
      href = state.md.normalizeLink(res.str);
      if (state.md.validateLink(href)) {
        pos = res.pos;
      } else {
        href = "";
      }
      start = pos;
      for (; pos < max; pos++) {
        code2 = state.src.charCodeAt(pos);
        if (!isSpace(code2) && code2 !== 10) {
          break;
        }
      }
      res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
      if (pos < max && start !== pos && res.ok) {
        title = res.str;
        pos = res.pos;
        for (; pos < max; pos++) {
          code2 = state.src.charCodeAt(pos);
          if (!isSpace(code2) && code2 !== 10) {
            break;
          }
        }
      }
    }
    if (pos >= max || state.src.charCodeAt(pos) !== 41) {
      parseReference = true;
    }
    pos++;
  }
  if (parseReference) {
    if (typeof state.env.references === "undefined") {
      return false;
    }
    if (pos < max && state.src.charCodeAt(pos) === 91) {
      start = pos + 1;
      pos = state.md.helpers.parseLinkLabel(state, pos);
      if (pos >= 0) {
        label = state.src.slice(start, pos++);
      } else {
        pos = labelEnd + 1;
      }
    } else {
      pos = labelEnd + 1;
    }
    if (!label) {
      label = state.src.slice(labelStart, labelEnd);
    }
    ref2 = state.env.references[normalizeReference(label)];
    if (!ref2) {
      state.pos = oldPos;
      return false;
    }
    href = ref2.href;
    title = ref2.title;
  }
  if (!silent) {
    state.pos = labelStart;
    state.posMax = labelEnd;
    const token_o = state.push("link_open", "a", 1);
    const attrs = [["href", href]];
    token_o.attrs = attrs;
    if (title) {
      attrs.push(["title", title]);
    }
    state.linkLevel++;
    state.md.inline.tokenize(state);
    state.linkLevel--;
    state.push("link_close", "a", -1);
  }
  state.pos = pos;
  state.posMax = max;
  return true;
}
function image(state, silent) {
  let code2, content, label, pos, ref2, res, title, start;
  let href = "";
  const oldPos = state.pos;
  const max = state.posMax;
  if (state.src.charCodeAt(state.pos) !== 33) {
    return false;
  }
  if (state.src.charCodeAt(state.pos + 1) !== 91) {
    return false;
  }
  const labelStart = state.pos + 2;
  const labelEnd = state.md.helpers.parseLinkLabel(state, state.pos + 1, false);
  if (labelEnd < 0) {
    return false;
  }
  pos = labelEnd + 1;
  if (pos < max && state.src.charCodeAt(pos) === 40) {
    pos++;
    for (; pos < max; pos++) {
      code2 = state.src.charCodeAt(pos);
      if (!isSpace(code2) && code2 !== 10) {
        break;
      }
    }
    if (pos >= max) {
      return false;
    }
    start = pos;
    res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
    if (res.ok) {
      href = state.md.normalizeLink(res.str);
      if (state.md.validateLink(href)) {
        pos = res.pos;
      } else {
        href = "";
      }
    }
    start = pos;
    for (; pos < max; pos++) {
      code2 = state.src.charCodeAt(pos);
      if (!isSpace(code2) && code2 !== 10) {
        break;
      }
    }
    res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
    if (pos < max && start !== pos && res.ok) {
      title = res.str;
      pos = res.pos;
      for (; pos < max; pos++) {
        code2 = state.src.charCodeAt(pos);
        if (!isSpace(code2) && code2 !== 10) {
          break;
        }
      }
    } else {
      title = "";
    }
    if (pos >= max || state.src.charCodeAt(pos) !== 41) {
      state.pos = oldPos;
      return false;
    }
    pos++;
  } else {
    if (typeof state.env.references === "undefined") {
      return false;
    }
    if (pos < max && state.src.charCodeAt(pos) === 91) {
      start = pos + 1;
      pos = state.md.helpers.parseLinkLabel(state, pos);
      if (pos >= 0) {
        label = state.src.slice(start, pos++);
      } else {
        pos = labelEnd + 1;
      }
    } else {
      pos = labelEnd + 1;
    }
    if (!label) {
      label = state.src.slice(labelStart, labelEnd);
    }
    ref2 = state.env.references[normalizeReference(label)];
    if (!ref2) {
      state.pos = oldPos;
      return false;
    }
    href = ref2.href;
    title = ref2.title;
  }
  if (!silent) {
    content = state.src.slice(labelStart, labelEnd);
    const tokens = [];
    state.md.inline.parse(
      content,
      state.md,
      state.env,
      tokens
    );
    const token = state.push("image", "img", 0);
    const attrs = [["src", href], ["alt", ""]];
    token.attrs = attrs;
    token.children = tokens;
    token.content = content;
    if (title) {
      attrs.push(["title", title]);
    }
  }
  state.pos = pos;
  state.posMax = max;
  return true;
}
const EMAIL_RE = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/;
const AUTOLINK_RE = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
function autolink(state, silent) {
  let pos = state.pos;
  if (state.src.charCodeAt(pos) !== 60) {
    return false;
  }
  const start = state.pos;
  const max = state.posMax;
  for (; ; ) {
    if (++pos >= max) return false;
    const ch = state.src.charCodeAt(pos);
    if (ch === 60) return false;
    if (ch === 62) break;
  }
  const url = state.src.slice(start + 1, pos);
  if (AUTOLINK_RE.test(url)) {
    const fullUrl = state.md.normalizeLink(url);
    if (!state.md.validateLink(fullUrl)) {
      return false;
    }
    if (!silent) {
      const token_o = state.push("link_open", "a", 1);
      token_o.attrs = [["href", fullUrl]];
      token_o.markup = "autolink";
      token_o.info = "auto";
      const token_t = state.push("text", "", 0);
      token_t.content = state.md.normalizeLinkText(url);
      const token_c = state.push("link_close", "a", -1);
      token_c.markup = "autolink";
      token_c.info = "auto";
    }
    state.pos += url.length + 2;
    return true;
  }
  if (EMAIL_RE.test(url)) {
    const fullUrl = state.md.normalizeLink("mailto:" + url);
    if (!state.md.validateLink(fullUrl)) {
      return false;
    }
    if (!silent) {
      const token_o = state.push("link_open", "a", 1);
      token_o.attrs = [["href", fullUrl]];
      token_o.markup = "autolink";
      token_o.info = "auto";
      const token_t = state.push("text", "", 0);
      token_t.content = state.md.normalizeLinkText(url);
      const token_c = state.push("link_close", "a", -1);
      token_c.markup = "autolink";
      token_c.info = "auto";
    }
    state.pos += url.length + 2;
    return true;
  }
  return false;
}
function isLinkOpen(str) {
  return /^<a[>\s]/i.test(str);
}
function isLinkClose(str) {
  return /^<\/a\s*>/i.test(str);
}
function isLetter(ch) {
  const lc = ch | 32;
  return lc >= 97 && lc <= 122;
}
function html_inline(state, silent) {
  if (!state.md.options.html) {
    return false;
  }
  const max = state.posMax;
  const pos = state.pos;
  if (state.src.charCodeAt(pos) !== 60 || pos + 2 >= max) {
    return false;
  }
  const ch = state.src.charCodeAt(pos + 1);
  if (ch !== 33 && ch !== 63 && ch !== 47 && !isLetter(ch)) {
    return false;
  }
  const match2 = state.src.slice(pos).match(HTML_TAG_RE);
  if (!match2) {
    return false;
  }
  if (!silent) {
    const token = state.push("html_inline", "", 0);
    token.content = match2[0];
    if (isLinkOpen(token.content)) state.linkLevel++;
    if (isLinkClose(token.content)) state.linkLevel--;
  }
  state.pos += match2[0].length;
  return true;
}
const DIGITAL_RE = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i;
const NAMED_RE = /^&([a-z][a-z0-9]{1,31});/i;
function entity(state, silent) {
  const pos = state.pos;
  const max = state.posMax;
  if (state.src.charCodeAt(pos) !== 38) return false;
  if (pos + 1 >= max) return false;
  const ch = state.src.charCodeAt(pos + 1);
  if (ch === 35) {
    const match2 = state.src.slice(pos).match(DIGITAL_RE);
    if (match2) {
      if (!silent) {
        const code2 = match2[1][0].toLowerCase() === "x" ? parseInt(match2[1].slice(1), 16) : parseInt(match2[1], 10);
        const token = state.push("text_special", "", 0);
        token.content = isValidEntityCode(code2) ? fromCodePoint(code2) : fromCodePoint(65533);
        token.markup = match2[0];
        token.info = "entity";
      }
      state.pos += match2[0].length;
      return true;
    }
  } else {
    const match2 = state.src.slice(pos).match(NAMED_RE);
    if (match2) {
      const decoded = decodeHTML(match2[0]);
      if (decoded !== match2[0]) {
        if (!silent) {
          const token = state.push("text_special", "", 0);
          token.content = decoded;
          token.markup = match2[0];
          token.info = "entity";
        }
        state.pos += match2[0].length;
        return true;
      }
    }
  }
  return false;
}
function processDelimiters(delimiters) {
  const openersBottom = {};
  const max = delimiters.length;
  if (!max) return;
  let headerIdx = 0;
  let lastTokenIdx = -2;
  const jumps = [];
  for (let closerIdx = 0; closerIdx < max; closerIdx++) {
    const closer = delimiters[closerIdx];
    jumps.push(0);
    if (delimiters[headerIdx].marker !== closer.marker || lastTokenIdx !== closer.token - 1) {
      headerIdx = closerIdx;
    }
    lastTokenIdx = closer.token;
    closer.length = closer.length || 0;
    if (!closer.close) continue;
    if (!openersBottom.hasOwnProperty(closer.marker)) {
      openersBottom[closer.marker] = [-1, -1, -1, -1, -1, -1];
    }
    const minOpenerIdx = openersBottom[closer.marker][(closer.open ? 3 : 0) + closer.length % 3];
    let openerIdx = headerIdx - jumps[headerIdx] - 1;
    let newMinOpenerIdx = openerIdx;
    for (; openerIdx > minOpenerIdx; openerIdx -= jumps[openerIdx] + 1) {
      const opener = delimiters[openerIdx];
      if (opener.marker !== closer.marker) continue;
      if (opener.open && opener.end < 0) {
        let isOddMatch = false;
        if (opener.close || closer.open) {
          if ((opener.length + closer.length) % 3 === 0) {
            if (opener.length % 3 !== 0 || closer.length % 3 !== 0) {
              isOddMatch = true;
            }
          }
        }
        if (!isOddMatch) {
          const lastJump = openerIdx > 0 && !delimiters[openerIdx - 1].open ? jumps[openerIdx - 1] + 1 : 0;
          jumps[closerIdx] = closerIdx - openerIdx + lastJump;
          jumps[openerIdx] = lastJump;
          closer.open = false;
          opener.end = closerIdx;
          opener.close = false;
          newMinOpenerIdx = -1;
          lastTokenIdx = -2;
          break;
        }
      }
    }
    if (newMinOpenerIdx !== -1) {
      openersBottom[closer.marker][(closer.open ? 3 : 0) + (closer.length || 0) % 3] = newMinOpenerIdx;
    }
  }
}
function link_pairs(state) {
  const tokens_meta = state.tokens_meta;
  const max = state.tokens_meta.length;
  processDelimiters(state.delimiters);
  for (let curr = 0; curr < max; curr++) {
    if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
      processDelimiters(tokens_meta[curr].delimiters);
    }
  }
}
function fragments_join(state) {
  let curr, last;
  let level = 0;
  const tokens = state.tokens;
  const max = state.tokens.length;
  for (curr = last = 0; curr < max; curr++) {
    if (tokens[curr].nesting < 0) level--;
    tokens[curr].level = level;
    if (tokens[curr].nesting > 0) level++;
    if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") {
      tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
    } else {
      if (curr !== last) {
        tokens[last] = tokens[curr];
      }
      last++;
    }
  }
  if (curr !== last) {
    tokens.length = last;
  }
}
const _rules = [
  ["text", text$1],
  ["linkify", linkify],
  ["newline", newline],
  ["escape", escape],
  ["backticks", backtick],
  ["strikethrough", r_strikethrough.tokenize],
  ["emphasis", r_emphasis.tokenize],
  ["link", link],
  ["image", image],
  ["autolink", autolink],
  ["html_inline", html_inline],
  ["entity", entity]
];
const _rules2 = [
  ["balance_pairs", link_pairs],
  ["strikethrough", r_strikethrough.postProcess],
  ["emphasis", r_emphasis.postProcess],
  // rules for pairs separate '**' into its own text tokens, which may be left unused,
  // rule below merges unused segments back with the rest of the text
  ["fragments_join", fragments_join]
];
function ParserInline() {
  this.ruler = new Ruler();
  for (let i2 = 0; i2 < _rules.length; i2++) {
    this.ruler.push(_rules[i2][0], _rules[i2][1]);
  }
  this.ruler2 = new Ruler();
  for (let i2 = 0; i2 < _rules2.length; i2++) {
    this.ruler2.push(_rules2[i2][0], _rules2[i2][1]);
  }
}
ParserInline.prototype.skipToken = function(state) {
  const pos = state.pos;
  const rules = this.ruler.getRules("");
  const len = rules.length;
  const maxNesting = state.md.options.maxNesting;
  const cache = state.cache;
  if (typeof cache[pos] !== "undefined") {
    state.pos = cache[pos];
    return;
  }
  let ok = false;
  if (state.level < maxNesting) {
    for (let i2 = 0; i2 < len; i2++) {
      state.level++;
      ok = rules[i2](state, true);
      state.level--;
      if (ok) {
        if (pos >= state.pos) {
          throw new Error("inline rule didn't increment state.pos");
        }
        break;
      }
    }
  } else {
    state.pos = state.posMax;
  }
  if (!ok) {
    state.pos++;
  }
  cache[pos] = state.pos;
};
ParserInline.prototype.tokenize = function(state) {
  const rules = this.ruler.getRules("");
  const len = rules.length;
  const end = state.posMax;
  const maxNesting = state.md.options.maxNesting;
  while (state.pos < end) {
    const prevPos = state.pos;
    let ok = false;
    if (state.level < maxNesting) {
      for (let i2 = 0; i2 < len; i2++) {
        ok = rules[i2](state, false);
        if (ok) {
          if (prevPos >= state.pos) {
            throw new Error("inline rule didn't increment state.pos");
          }
          break;
        }
      }
    }
    if (ok) {
      if (state.pos >= end) {
        break;
      }
      continue;
    }
    state.pending += state.src[state.pos++];
  }
  if (state.pending) {
    state.pushPending();
  }
};
ParserInline.prototype.parse = function(str, md2, env, outTokens) {
  const state = new this.State(str, md2, env, outTokens);
  this.tokenize(state);
  const rules = this.ruler2.getRules("");
  const len = rules.length;
  for (let i2 = 0; i2 < len; i2++) {
    rules[i2](state);
  }
};
ParserInline.prototype.State = StateInline;
function reFactory(opts) {
  const re2 = {};
  opts = opts || {};
  re2.src_Any = Any.source;
  re2.src_Cc = Cc.source;
  re2.src_Z = Z$1.source;
  re2.src_P = P$1.source;
  re2.src_ZPCc = [re2.src_Z, re2.src_P, re2.src_Cc].join("|");
  re2.src_ZCc = [re2.src_Z, re2.src_Cc].join("|");
  const text_separators = "[><｜]";
  re2.src_pseudo_letter = "(?:(?!" + text_separators + "|" + re2.src_ZPCc + ")" + re2.src_Any + ")";
  re2.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
  re2.src_auth = "(?:(?:(?!" + re2.src_ZCc + "|[@/\\[\\]()]).)+@)?";
  re2.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?";
  re2.src_host_terminator = "(?=$|" + text_separators + "|" + re2.src_ZPCc + ")(?!" + (opts["---"] ? "-(?!--)|" : "-|") + "_|:\\d|\\.-|\\.(?!$|" + re2.src_ZPCc + "))";
  re2.src_path = "(?:[/?#](?:(?!" + re2.src_ZCc + "|" + text_separators + `|[()[\\]{}.,"'?!\\-;]).|\\[(?:(?!` + re2.src_ZCc + "|\\]).)*\\]|\\((?:(?!" + re2.src_ZCc + "|[)]).)*\\)|\\{(?:(?!" + re2.src_ZCc + '|[}]).)*\\}|\\"(?:(?!' + re2.src_ZCc + `|["]).)+\\"|\\'(?:(?!` + re2.src_ZCc + "|[']).)+\\'|\\'(?=" + re2.src_pseudo_letter + "|[-])|\\.{2,}[a-zA-Z0-9%/&]|\\.(?!" + re2.src_ZCc + "|[.]|$)|" + (opts["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") + // allow `,,,` in paths
  ",(?!" + re2.src_ZCc + "|$)|;(?!" + re2.src_ZCc + "|$)|\\!+(?!" + re2.src_ZCc + "|[!]|$)|\\?(?!" + re2.src_ZCc + "|[?]|$))+|\\/)?";
  re2.src_email_name = '[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]*';
  re2.src_xn = "xn--[a-z0-9\\-]{1,59}";
  re2.src_domain_root = // Allow letters & digits (http://test1)
  "(?:" + re2.src_xn + "|" + re2.src_pseudo_letter + "{1,63})";
  re2.src_domain = "(?:" + re2.src_xn + "|(?:" + re2.src_pseudo_letter + ")|(?:" + re2.src_pseudo_letter + "(?:-|" + re2.src_pseudo_letter + "){0,61}" + re2.src_pseudo_letter + "))";
  re2.src_host = "(?:(?:(?:(?:" + re2.src_domain + ")\\.)*" + re2.src_domain + "))";
  re2.tpl_host_fuzzy = "(?:" + re2.src_ip4 + "|(?:(?:(?:" + re2.src_domain + ")\\.)+(?:%TLDS%)))";
  re2.tpl_host_no_ip_fuzzy = "(?:(?:(?:" + re2.src_domain + ")\\.)+(?:%TLDS%))";
  re2.src_host_strict = re2.src_host + re2.src_host_terminator;
  re2.tpl_host_fuzzy_strict = re2.tpl_host_fuzzy + re2.src_host_terminator;
  re2.src_host_port_strict = re2.src_host + re2.src_port + re2.src_host_terminator;
  re2.tpl_host_port_fuzzy_strict = re2.tpl_host_fuzzy + re2.src_port + re2.src_host_terminator;
  re2.tpl_host_port_no_ip_fuzzy_strict = re2.tpl_host_no_ip_fuzzy + re2.src_port + re2.src_host_terminator;
  re2.tpl_host_fuzzy_test = "localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:" + re2.src_ZPCc + "|>|$))";
  re2.tpl_email_fuzzy = "(^|" + text_separators + '|"|\\(|' + re2.src_ZCc + ")(" + re2.src_email_name + "@" + re2.tpl_host_fuzzy_strict + ")";
  re2.tpl_link_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
  // but can start with > (markdown blockquote)
  "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" + re2.src_ZPCc + "))((?![$+<=>^`|｜])" + re2.tpl_host_port_fuzzy_strict + re2.src_path + ")";
  re2.tpl_link_no_ip_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
  // but can start with > (markdown blockquote)
  "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" + re2.src_ZPCc + "))((?![$+<=>^`|｜])" + re2.tpl_host_port_no_ip_fuzzy_strict + re2.src_path + ")";
  return re2;
}
function assign(obj) {
  const sources = Array.prototype.slice.call(arguments, 1);
  sources.forEach(function(source) {
    if (!source) {
      return;
    }
    Object.keys(source).forEach(function(key) {
      obj[key] = source[key];
    });
  });
  return obj;
}
function _class(obj) {
  return Object.prototype.toString.call(obj);
}
function isString(obj) {
  return _class(obj) === "[object String]";
}
function isObject(obj) {
  return _class(obj) === "[object Object]";
}
function isRegExp(obj) {
  return _class(obj) === "[object RegExp]";
}
function isFunction(obj) {
  return _class(obj) === "[object Function]";
}
function escapeRE(str) {
  return str.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
}
const defaultOptions = {
  fuzzyLink: true,
  fuzzyEmail: true,
  fuzzyIP: false
};
function isOptionsObj(obj) {
  return Object.keys(obj || {}).reduce(function(acc, k2) {
    return acc || defaultOptions.hasOwnProperty(k2);
  }, false);
}
const defaultSchemas = {
  "http:": {
    validate: function(text2, pos, self2) {
      const tail = text2.slice(pos);
      if (!self2.re.http) {
        self2.re.http = new RegExp(
          "^\\/\\/" + self2.re.src_auth + self2.re.src_host_port_strict + self2.re.src_path,
          "i"
        );
      }
      if (self2.re.http.test(tail)) {
        return tail.match(self2.re.http)[0].length;
      }
      return 0;
    }
  },
  "https:": "http:",
  "ftp:": "http:",
  "//": {
    validate: function(text2, pos, self2) {
      const tail = text2.slice(pos);
      if (!self2.re.no_http) {
        self2.re.no_http = new RegExp(
          "^" + self2.re.src_auth + // Don't allow single-level domains, because of false positives like '//test'
          // with code comments
          "(?:localhost|(?:(?:" + self2.re.src_domain + ")\\.)+" + self2.re.src_domain_root + ")" + self2.re.src_port + self2.re.src_host_terminator + self2.re.src_path,
          "i"
        );
      }
      if (self2.re.no_http.test(tail)) {
        if (pos >= 3 && text2[pos - 3] === ":") {
          return 0;
        }
        if (pos >= 3 && text2[pos - 3] === "/") {
          return 0;
        }
        return tail.match(self2.re.no_http)[0].length;
      }
      return 0;
    }
  },
  "mailto:": {
    validate: function(text2, pos, self2) {
      const tail = text2.slice(pos);
      if (!self2.re.mailto) {
        self2.re.mailto = new RegExp(
          "^" + self2.re.src_email_name + "@" + self2.re.src_host_strict,
          "i"
        );
      }
      if (self2.re.mailto.test(tail)) {
        return tail.match(self2.re.mailto)[0].length;
      }
      return 0;
    }
  }
};
const tlds_2ch_src_re = "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]";
const tlds_default = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф".split("|");
function resetScanCache(self2) {
  self2.__index__ = -1;
  self2.__text_cache__ = "";
}
function createValidator(re2) {
  return function(text2, pos) {
    const tail = text2.slice(pos);
    if (re2.test(tail)) {
      return tail.match(re2)[0].length;
    }
    return 0;
  };
}
function createNormalizer() {
  return function(match2, self2) {
    self2.normalize(match2);
  };
}
function compile(self2) {
  const re2 = self2.re = reFactory(self2.__opts__);
  const tlds2 = self2.__tlds__.slice();
  self2.onCompile();
  if (!self2.__tlds_replaced__) {
    tlds2.push(tlds_2ch_src_re);
  }
  tlds2.push(re2.src_xn);
  re2.src_tlds = tlds2.join("|");
  function untpl(tpl) {
    return tpl.replace("%TLDS%", re2.src_tlds);
  }
  re2.email_fuzzy = RegExp(untpl(re2.tpl_email_fuzzy), "i");
  re2.link_fuzzy = RegExp(untpl(re2.tpl_link_fuzzy), "i");
  re2.link_no_ip_fuzzy = RegExp(untpl(re2.tpl_link_no_ip_fuzzy), "i");
  re2.host_fuzzy_test = RegExp(untpl(re2.tpl_host_fuzzy_test), "i");
  const aliases = [];
  self2.__compiled__ = {};
  function schemaError(name, val) {
    throw new Error('(LinkifyIt) Invalid schema "' + name + '": ' + val);
  }
  Object.keys(self2.__schemas__).forEach(function(name) {
    const val = self2.__schemas__[name];
    if (val === null) {
      return;
    }
    const compiled = { validate: null, link: null };
    self2.__compiled__[name] = compiled;
    if (isObject(val)) {
      if (isRegExp(val.validate)) {
        compiled.validate = createValidator(val.validate);
      } else if (isFunction(val.validate)) {
        compiled.validate = val.validate;
      } else {
        schemaError(name, val);
      }
      if (isFunction(val.normalize)) {
        compiled.normalize = val.normalize;
      } else if (!val.normalize) {
        compiled.normalize = createNormalizer();
      } else {
        schemaError(name, val);
      }
      return;
    }
    if (isString(val)) {
      aliases.push(name);
      return;
    }
    schemaError(name, val);
  });
  aliases.forEach(function(alias) {
    if (!self2.__compiled__[self2.__schemas__[alias]]) {
      return;
    }
    self2.__compiled__[alias].validate = self2.__compiled__[self2.__schemas__[alias]].validate;
    self2.__compiled__[alias].normalize = self2.__compiled__[self2.__schemas__[alias]].normalize;
  });
  self2.__compiled__[""] = { validate: null, normalize: createNormalizer() };
  const slist = Object.keys(self2.__compiled__).filter(function(name) {
    return name.length > 0 && self2.__compiled__[name];
  }).map(escapeRE).join("|");
  self2.re.schema_test = RegExp("(^|(?!_)(?:[><｜]|" + re2.src_ZPCc + "))(" + slist + ")", "i");
  self2.re.schema_search = RegExp("(^|(?!_)(?:[><｜]|" + re2.src_ZPCc + "))(" + slist + ")", "ig");
  self2.re.schema_at_start = RegExp("^" + self2.re.schema_search.source, "i");
  self2.re.pretest = RegExp(
    "(" + self2.re.schema_test.source + ")|(" + self2.re.host_fuzzy_test.source + ")|@",
    "i"
  );
  resetScanCache(self2);
}
function Match(self2, shift) {
  const start = self2.__index__;
  const end = self2.__last_index__;
  const text2 = self2.__text_cache__.slice(start, end);
  this.schema = self2.__schema__.toLowerCase();
  this.index = start + shift;
  this.lastIndex = end + shift;
  this.raw = text2;
  this.text = text2;
  this.url = text2;
}
function createMatch(self2, shift) {
  const match2 = new Match(self2, shift);
  self2.__compiled__[match2.schema].normalize(match2, self2);
  return match2;
}
function LinkifyIt(schemas, options) {
  if (!(this instanceof LinkifyIt)) {
    return new LinkifyIt(schemas, options);
  }
  if (!options) {
    if (isOptionsObj(schemas)) {
      options = schemas;
      schemas = {};
    }
  }
  this.__opts__ = assign({}, defaultOptions, options);
  this.__index__ = -1;
  this.__last_index__ = -1;
  this.__schema__ = "";
  this.__text_cache__ = "";
  this.__schemas__ = assign({}, defaultSchemas, schemas);
  this.__compiled__ = {};
  this.__tlds__ = tlds_default;
  this.__tlds_replaced__ = false;
  this.re = {};
  compile(this);
}
LinkifyIt.prototype.add = function add(schema, definition) {
  this.__schemas__[schema] = definition;
  compile(this);
  return this;
};
LinkifyIt.prototype.set = function set(options) {
  this.__opts__ = assign(this.__opts__, options);
  return this;
};
LinkifyIt.prototype.test = function test(text2) {
  this.__text_cache__ = text2;
  this.__index__ = -1;
  if (!text2.length) {
    return false;
  }
  let m2, ml, me2, len, shift, next, re2, tld_pos, at_pos;
  if (this.re.schema_test.test(text2)) {
    re2 = this.re.schema_search;
    re2.lastIndex = 0;
    while ((m2 = re2.exec(text2)) !== null) {
      len = this.testSchemaAt(text2, m2[2], re2.lastIndex);
      if (len) {
        this.__schema__ = m2[2];
        this.__index__ = m2.index + m2[1].length;
        this.__last_index__ = m2.index + m2[0].length + len;
        break;
      }
    }
  }
  if (this.__opts__.fuzzyLink && this.__compiled__["http:"]) {
    tld_pos = text2.search(this.re.host_fuzzy_test);
    if (tld_pos >= 0) {
      if (this.__index__ < 0 || tld_pos < this.__index__) {
        if ((ml = text2.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy)) !== null) {
          shift = ml.index + ml[1].length;
          if (this.__index__ < 0 || shift < this.__index__) {
            this.__schema__ = "";
            this.__index__ = shift;
            this.__last_index__ = ml.index + ml[0].length;
          }
        }
      }
    }
  }
  if (this.__opts__.fuzzyEmail && this.__compiled__["mailto:"]) {
    at_pos = text2.indexOf("@");
    if (at_pos >= 0) {
      if ((me2 = text2.match(this.re.email_fuzzy)) !== null) {
        shift = me2.index + me2[1].length;
        next = me2.index + me2[0].length;
        if (this.__index__ < 0 || shift < this.__index__ || shift === this.__index__ && next > this.__last_index__) {
          this.__schema__ = "mailto:";
          this.__index__ = shift;
          this.__last_index__ = next;
        }
      }
    }
  }
  return this.__index__ >= 0;
};
LinkifyIt.prototype.pretest = function pretest(text2) {
  return this.re.pretest.test(text2);
};
LinkifyIt.prototype.testSchemaAt = function testSchemaAt(text2, schema, pos) {
  if (!this.__compiled__[schema.toLowerCase()]) {
    return 0;
  }
  return this.__compiled__[schema.toLowerCase()].validate(text2, pos, this);
};
LinkifyIt.prototype.match = function match(text2) {
  const result = [];
  let shift = 0;
  if (this.__index__ >= 0 && this.__text_cache__ === text2) {
    result.push(createMatch(this, shift));
    shift = this.__last_index__;
  }
  let tail = shift ? text2.slice(shift) : text2;
  while (this.test(tail)) {
    result.push(createMatch(this, shift));
    tail = tail.slice(this.__last_index__);
    shift += this.__last_index__;
  }
  if (result.length) {
    return result;
  }
  return null;
};
LinkifyIt.prototype.matchAtStart = function matchAtStart(text2) {
  this.__text_cache__ = text2;
  this.__index__ = -1;
  if (!text2.length) return null;
  const m2 = this.re.schema_at_start.exec(text2);
  if (!m2) return null;
  const len = this.testSchemaAt(text2, m2[2], m2[0].length);
  if (!len) return null;
  this.__schema__ = m2[2];
  this.__index__ = m2.index + m2[1].length;
  this.__last_index__ = m2.index + m2[0].length + len;
  return createMatch(this, 0);
};
LinkifyIt.prototype.tlds = function tlds(list2, keepOld) {
  list2 = Array.isArray(list2) ? list2 : [list2];
  if (!keepOld) {
    this.__tlds__ = list2.slice();
    this.__tlds_replaced__ = true;
    compile(this);
    return this;
  }
  this.__tlds__ = this.__tlds__.concat(list2).sort().filter(function(el, idx, arr) {
    return el !== arr[idx - 1];
  }).reverse();
  compile(this);
  return this;
};
LinkifyIt.prototype.normalize = function normalize2(match2) {
  if (!match2.schema) {
    match2.url = "http://" + match2.url;
  }
  if (match2.schema === "mailto:" && !/^mailto:/i.test(match2.url)) {
    match2.url = "mailto:" + match2.url;
  }
};
LinkifyIt.prototype.onCompile = function onCompile() {
};
const maxInt = 2147483647;
const base = 36;
const tMin = 1;
const tMax = 26;
const skew = 38;
const damp = 700;
const initialBias = 72;
const initialN = 128;
const delimiter = "-";
const regexPunycode = /^xn--/;
const regexNonASCII = /[^\0-\x7F]/;
const regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g;
const errors = {
  "overflow": "Overflow: input needs wider integers to process",
  "not-basic": "Illegal input >= 0x80 (not a basic code point)",
  "invalid-input": "Invalid input"
};
const baseMinusTMin = base - tMin;
const floor = Math.floor;
const stringFromCharCode = String.fromCharCode;
function error(type) {
  throw new RangeError(errors[type]);
}
function map(array, callback) {
  const result = [];
  let length = array.length;
  while (length--) {
    result[length] = callback(array[length]);
  }
  return result;
}
function mapDomain(domain, callback) {
  const parts = domain.split("@");
  let result = "";
  if (parts.length > 1) {
    result = parts[0] + "@";
    domain = parts[1];
  }
  domain = domain.replace(regexSeparators, ".");
  const labels = domain.split(".");
  const encoded = map(labels, callback).join(".");
  return result + encoded;
}
function ucs2decode(string) {
  const output = [];
  let counter = 0;
  const length = string.length;
  while (counter < length) {
    const value = string.charCodeAt(counter++);
    if (value >= 55296 && value <= 56319 && counter < length) {
      const extra = string.charCodeAt(counter++);
      if ((extra & 64512) == 56320) {
        output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
      } else {
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
}
const ucs2encode = (codePoints) => String.fromCodePoint(...codePoints);
const basicToDigit = function(codePoint) {
  if (codePoint >= 48 && codePoint < 58) {
    return 26 + (codePoint - 48);
  }
  if (codePoint >= 65 && codePoint < 91) {
    return codePoint - 65;
  }
  if (codePoint >= 97 && codePoint < 123) {
    return codePoint - 97;
  }
  return base;
};
const digitToBasic = function(digit, flag) {
  return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
};
const adapt = function(delta, numPoints, firstTime) {
  let k2 = 0;
  delta = firstTime ? floor(delta / damp) : delta >> 1;
  delta += floor(delta / numPoints);
  for (; delta > baseMinusTMin * tMax >> 1; k2 += base) {
    delta = floor(delta / baseMinusTMin);
  }
  return floor(k2 + (baseMinusTMin + 1) * delta / (delta + skew));
};
const decode = function(input) {
  const output = [];
  const inputLength = input.length;
  let i2 = 0;
  let n2 = initialN;
  let bias = initialBias;
  let basic = input.lastIndexOf(delimiter);
  if (basic < 0) {
    basic = 0;
  }
  for (let j2 = 0; j2 < basic; ++j2) {
    if (input.charCodeAt(j2) >= 128) {
      error("not-basic");
    }
    output.push(input.charCodeAt(j2));
  }
  for (let index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
    const oldi = i2;
    for (let w2 = 1, k2 = base; ; k2 += base) {
      if (index >= inputLength) {
        error("invalid-input");
      }
      const digit = basicToDigit(input.charCodeAt(index++));
      if (digit >= base) {
        error("invalid-input");
      }
      if (digit > floor((maxInt - i2) / w2)) {
        error("overflow");
      }
      i2 += digit * w2;
      const t2 = k2 <= bias ? tMin : k2 >= bias + tMax ? tMax : k2 - bias;
      if (digit < t2) {
        break;
      }
      const baseMinusT = base - t2;
      if (w2 > floor(maxInt / baseMinusT)) {
        error("overflow");
      }
      w2 *= baseMinusT;
    }
    const out = output.length + 1;
    bias = adapt(i2 - oldi, out, oldi == 0);
    if (floor(i2 / out) > maxInt - n2) {
      error("overflow");
    }
    n2 += floor(i2 / out);
    i2 %= out;
    output.splice(i2++, 0, n2);
  }
  return String.fromCodePoint(...output);
};
const encode = function(input) {
  const output = [];
  input = ucs2decode(input);
  const inputLength = input.length;
  let n2 = initialN;
  let delta = 0;
  let bias = initialBias;
  for (const currentValue of input) {
    if (currentValue < 128) {
      output.push(stringFromCharCode(currentValue));
    }
  }
  const basicLength = output.length;
  let handledCPCount = basicLength;
  if (basicLength) {
    output.push(delimiter);
  }
  while (handledCPCount < inputLength) {
    let m2 = maxInt;
    for (const currentValue of input) {
      if (currentValue >= n2 && currentValue < m2) {
        m2 = currentValue;
      }
    }
    const handledCPCountPlusOne = handledCPCount + 1;
    if (m2 - n2 > floor((maxInt - delta) / handledCPCountPlusOne)) {
      error("overflow");
    }
    delta += (m2 - n2) * handledCPCountPlusOne;
    n2 = m2;
    for (const currentValue of input) {
      if (currentValue < n2 && ++delta > maxInt) {
        error("overflow");
      }
      if (currentValue === n2) {
        let q2 = delta;
        for (let k2 = base; ; k2 += base) {
          const t2 = k2 <= bias ? tMin : k2 >= bias + tMax ? tMax : k2 - bias;
          if (q2 < t2) {
            break;
          }
          const qMinusT = q2 - t2;
          const baseMinusT = base - t2;
          output.push(
            stringFromCharCode(digitToBasic(t2 + qMinusT % baseMinusT, 0))
          );
          q2 = floor(qMinusT / baseMinusT);
        }
        output.push(stringFromCharCode(digitToBasic(q2, 0)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }
    ++delta;
    ++n2;
  }
  return output.join("");
};
const toUnicode = function(input) {
  return mapDomain(input, function(string) {
    return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
  });
};
const toASCII = function(input) {
  return mapDomain(input, function(string) {
    return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
  });
};
const punycode = {
  /**
   * A string representing the current Punycode.js version number.
   * @memberOf punycode
   * @type String
   */
  "version": "2.3.1",
  /**
   * An object of methods to convert from JavaScript's internal character
   * representation (UCS-2) to Unicode code points, and back.
   * @see <https://mathiasbynens.be/notes/javascript-encoding>
   * @memberOf punycode
   * @type Object
   */
  "ucs2": {
    "decode": ucs2decode,
    "encode": ucs2encode
  },
  "decode": decode,
  "encode": encode,
  "toASCII": toASCII,
  "toUnicode": toUnicode
};
const cfg_default = {
  options: {
    // Enable HTML tags in source
    html: false,
    // Use '/' to close single tags (<br />)
    xhtmlOut: false,
    // Convert '\n' in paragraphs into <br>
    breaks: false,
    // CSS language prefix for fenced blocks
    langPrefix: "language-",
    // autoconvert URL-like texts to links
    linkify: false,
    // Enable some language-neutral replacements + quotes beautification
    typographer: false,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: "“”‘’",
    /* “”‘’ */
    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,
    // Internal protection, recursion limit
    maxNesting: 100
  },
  components: {
    core: {},
    block: {},
    inline: {}
  }
};
const cfg_zero = {
  options: {
    // Enable HTML tags in source
    html: false,
    // Use '/' to close single tags (<br />)
    xhtmlOut: false,
    // Convert '\n' in paragraphs into <br>
    breaks: false,
    // CSS language prefix for fenced blocks
    langPrefix: "language-",
    // autoconvert URL-like texts to links
    linkify: false,
    // Enable some language-neutral replacements + quotes beautification
    typographer: false,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: "“”‘’",
    /* “”‘’ */
    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,
    // Internal protection, recursion limit
    maxNesting: 20
  },
  components: {
    core: {
      rules: [
        "normalize",
        "block",
        "inline",
        "text_join"
      ]
    },
    block: {
      rules: [
        "paragraph"
      ]
    },
    inline: {
      rules: [
        "text"
      ],
      rules2: [
        "balance_pairs",
        "fragments_join"
      ]
    }
  }
};
const cfg_commonmark = {
  options: {
    // Enable HTML tags in source
    html: true,
    // Use '/' to close single tags (<br />)
    xhtmlOut: true,
    // Convert '\n' in paragraphs into <br>
    breaks: false,
    // CSS language prefix for fenced blocks
    langPrefix: "language-",
    // autoconvert URL-like texts to links
    linkify: false,
    // Enable some language-neutral replacements + quotes beautification
    typographer: false,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: "“”‘’",
    /* “”‘’ */
    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,
    // Internal protection, recursion limit
    maxNesting: 20
  },
  components: {
    core: {
      rules: [
        "normalize",
        "block",
        "inline",
        "text_join"
      ]
    },
    block: {
      rules: [
        "blockquote",
        "code",
        "fence",
        "heading",
        "hr",
        "html_block",
        "lheading",
        "list",
        "reference",
        "paragraph"
      ]
    },
    inline: {
      rules: [
        "autolink",
        "backticks",
        "emphasis",
        "entity",
        "escape",
        "html_inline",
        "image",
        "link",
        "newline",
        "text"
      ],
      rules2: [
        "balance_pairs",
        "emphasis",
        "fragments_join"
      ]
    }
  }
};
const config = {
  default: cfg_default,
  zero: cfg_zero,
  commonmark: cfg_commonmark
};
const BAD_PROTO_RE = /^(vbscript|javascript|file|data):/;
const GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;
function validateLink(url) {
  const str = url.trim().toLowerCase();
  return BAD_PROTO_RE.test(str) ? GOOD_DATA_RE.test(str) : true;
}
const RECODE_HOSTNAME_FOR = ["http:", "https:", "mailto:"];
function normalizeLink(url) {
  const parsed = urlParse(url, true);
  if (parsed.hostname) {
    if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
      try {
        parsed.hostname = punycode.toASCII(parsed.hostname);
      } catch (er) {
      }
    }
  }
  return encode$1(format(parsed));
}
function normalizeLinkText(url) {
  const parsed = urlParse(url, true);
  if (parsed.hostname) {
    if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
      try {
        parsed.hostname = punycode.toUnicode(parsed.hostname);
      } catch (er) {
      }
    }
  }
  return decode$1(format(parsed), decode$1.defaultChars + "%");
}
function MarkdownIt(presetName, options) {
  if (!(this instanceof MarkdownIt)) {
    return new MarkdownIt(presetName, options);
  }
  if (!options) {
    if (!isString$1(presetName)) {
      options = presetName || {};
      presetName = "default";
    }
  }
  this.inline = new ParserInline();
  this.block = new ParserBlock();
  this.core = new Core();
  this.renderer = new Renderer();
  this.linkify = new LinkifyIt();
  this.validateLink = validateLink;
  this.normalizeLink = normalizeLink;
  this.normalizeLinkText = normalizeLinkText;
  this.utils = utils;
  this.helpers = assign$1({}, helpers);
  this.options = {};
  this.configure(presetName);
  if (options) {
    this.set(options);
  }
}
MarkdownIt.prototype.set = function(options) {
  assign$1(this.options, options);
  return this;
};
MarkdownIt.prototype.configure = function(presets) {
  const self2 = this;
  if (isString$1(presets)) {
    const presetName = presets;
    presets = config[presetName];
    if (!presets) {
      throw new Error('Wrong `markdown-it` preset "' + presetName + '", check name');
    }
  }
  if (!presets) {
    throw new Error("Wrong `markdown-it` preset, can't be empty");
  }
  if (presets.options) {
    self2.set(presets.options);
  }
  if (presets.components) {
    Object.keys(presets.components).forEach(function(name) {
      if (presets.components[name].rules) {
        self2[name].ruler.enableOnly(presets.components[name].rules);
      }
      if (presets.components[name].rules2) {
        self2[name].ruler2.enableOnly(presets.components[name].rules2);
      }
    });
  }
  return this;
};
MarkdownIt.prototype.enable = function(list2, ignoreInvalid) {
  let result = [];
  if (!Array.isArray(list2)) {
    list2 = [list2];
  }
  ["core", "block", "inline"].forEach(function(chain) {
    result = result.concat(this[chain].ruler.enable(list2, true));
  }, this);
  result = result.concat(this.inline.ruler2.enable(list2, true));
  const missed = list2.filter(function(name) {
    return result.indexOf(name) < 0;
  });
  if (missed.length && !ignoreInvalid) {
    throw new Error("MarkdownIt. Failed to enable unknown rule(s): " + missed);
  }
  return this;
};
MarkdownIt.prototype.disable = function(list2, ignoreInvalid) {
  let result = [];
  if (!Array.isArray(list2)) {
    list2 = [list2];
  }
  ["core", "block", "inline"].forEach(function(chain) {
    result = result.concat(this[chain].ruler.disable(list2, true));
  }, this);
  result = result.concat(this.inline.ruler2.disable(list2, true));
  const missed = list2.filter(function(name) {
    return result.indexOf(name) < 0;
  });
  if (missed.length && !ignoreInvalid) {
    throw new Error("MarkdownIt. Failed to disable unknown rule(s): " + missed);
  }
  return this;
};
MarkdownIt.prototype.use = function(plugin) {
  const args = [this].concat(Array.prototype.slice.call(arguments, 1));
  plugin.apply(plugin, args);
  return this;
};
MarkdownIt.prototype.parse = function(src, env) {
  if (typeof src !== "string") {
    throw new Error("Input data should be a String");
  }
  const state = new this.core.State(src, this, env);
  this.core.process(state);
  return state.tokens;
};
MarkdownIt.prototype.render = function(src, env) {
  env = env || {};
  return this.renderer.render(this.parse(src, env), this.options, env);
};
MarkdownIt.prototype.parseInline = function(src, env) {
  const state = new this.core.State(src, this, env);
  state.inlineMode = true;
  this.core.process(state);
  return state.tokens;
};
MarkdownIt.prototype.renderInline = function(src, env) {
  env = env || {};
  return this.renderer.render(this.parseInline(src, env), this.options, env);
};
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var markdownItTaskLists;
var hasRequiredMarkdownItTaskLists;
function requireMarkdownItTaskLists() {
  if (hasRequiredMarkdownItTaskLists) return markdownItTaskLists;
  hasRequiredMarkdownItTaskLists = 1;
  var disableCheckboxes = true;
  var useLabelWrapper = false;
  var useLabelAfter = false;
  markdownItTaskLists = function(md2, options) {
    if (options) {
      disableCheckboxes = !options.enabled;
      useLabelWrapper = !!options.label;
      useLabelAfter = !!options.labelAfter;
    }
    md2.core.ruler.after("inline", "github-task-lists", function(state) {
      var tokens = state.tokens;
      for (var i2 = 2; i2 < tokens.length; i2++) {
        if (isTodoItem(tokens, i2)) {
          todoify(tokens[i2], state.Token);
          attrSet2(tokens[i2 - 2], "class", "task-list-item" + (!disableCheckboxes ? " enabled" : ""));
          attrSet2(tokens[parentToken(tokens, i2 - 2)], "class", "contains-task-list");
        }
      }
    });
  };
  function attrSet2(token, name, value) {
    var index = token.attrIndex(name);
    var attr = [name, value];
    if (index < 0) {
      token.attrPush(attr);
    } else {
      token.attrs[index] = attr;
    }
  }
  function parentToken(tokens, index) {
    var targetLevel = tokens[index].level - 1;
    for (var i2 = index - 1; i2 >= 0; i2--) {
      if (tokens[i2].level === targetLevel) {
        return i2;
      }
    }
    return -1;
  }
  function isTodoItem(tokens, index) {
    return isInline(tokens[index]) && isParagraph(tokens[index - 1]) && isListItem(tokens[index - 2]) && startsWithTodoMarkdown(tokens[index]);
  }
  function todoify(token, TokenConstructor) {
    token.children.unshift(makeCheckbox(token, TokenConstructor));
    token.children[1].content = token.children[1].content.slice(3);
    token.content = token.content.slice(3);
    if (useLabelWrapper) {
      if (useLabelAfter) {
        token.children.pop();
        var id = "task-item-" + Math.ceil(Math.random() * (1e4 * 1e3) - 1e3);
        token.children[0].content = token.children[0].content.slice(0, -1) + ' id="' + id + '">';
        token.children.push(afterLabel(token.content, id, TokenConstructor));
      } else {
        token.children.unshift(beginLabel(TokenConstructor));
        token.children.push(endLabel(TokenConstructor));
      }
    }
  }
  function makeCheckbox(token, TokenConstructor) {
    var checkbox = new TokenConstructor("html_inline", "", 0);
    var disabledAttr = disableCheckboxes ? ' disabled="" ' : "";
    if (token.content.indexOf("[ ] ") === 0) {
      checkbox.content = '<input class="task-list-item-checkbox"' + disabledAttr + 'type="checkbox">';
    } else if (token.content.indexOf("[x] ") === 0 || token.content.indexOf("[X] ") === 0) {
      checkbox.content = '<input class="task-list-item-checkbox" checked=""' + disabledAttr + 'type="checkbox">';
    }
    return checkbox;
  }
  function beginLabel(TokenConstructor) {
    var token = new TokenConstructor("html_inline", "", 0);
    token.content = "<label>";
    return token;
  }
  function endLabel(TokenConstructor) {
    var token = new TokenConstructor("html_inline", "", 0);
    token.content = "</label>";
    return token;
  }
  function afterLabel(content, id, TokenConstructor) {
    var token = new TokenConstructor("html_inline", "", 0);
    token.content = '<label class="task-list-item-label" for="' + id + '">' + content + "</label>";
    token.attrs = [{ for: id }];
    return token;
  }
  function isInline(token) {
    return token.type === "inline";
  }
  function isParagraph(token) {
    return token.type === "paragraph_open";
  }
  function isListItem(token) {
    return token.type === "list_item_open";
  }
  function startsWithTodoMarkdown(token) {
    return token.content.indexOf("[ ] ") === 0 || token.content.indexOf("[x] ") === 0 || token.content.indexOf("[X] ") === 0;
  }
  return markdownItTaskLists;
}
var markdownItTaskListsExports = requireMarkdownItTaskLists();
const taskLists = /* @__PURE__ */ getDefaultExportFromCjs(markdownItTaskListsExports);
/*! @license DOMPurify 3.4.1 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.1/LICENSE */
const {
  entries,
  setPrototypeOf,
  isFrozen,
  getPrototypeOf,
  getOwnPropertyDescriptor
} = Object;
let {
  freeze,
  seal,
  create
} = Object;
let {
  apply,
  construct
} = typeof Reflect !== "undefined" && Reflect;
if (!freeze) {
  freeze = function freeze2(x2) {
    return x2;
  };
}
if (!seal) {
  seal = function seal2(x2) {
    return x2;
  };
}
if (!apply) {
  apply = function apply2(func, thisArg) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    return func.apply(thisArg, args);
  };
}
if (!construct) {
  construct = function construct2(Func) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    return new Func(...args);
  };
}
const arrayForEach = unapply(Array.prototype.forEach);
const arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
const arrayPop = unapply(Array.prototype.pop);
const arrayPush = unapply(Array.prototype.push);
const arraySplice = unapply(Array.prototype.splice);
const arrayIsArray = Array.isArray;
const stringToLowerCase = unapply(String.prototype.toLowerCase);
const stringToString = unapply(String.prototype.toString);
const stringMatch = unapply(String.prototype.match);
const stringReplace = unapply(String.prototype.replace);
const stringIndexOf = unapply(String.prototype.indexOf);
const stringTrim = unapply(String.prototype.trim);
const numberToString = unapply(Number.prototype.toString);
const booleanToString = unapply(Boolean.prototype.toString);
const bigintToString = typeof BigInt === "undefined" ? null : unapply(BigInt.prototype.toString);
const symbolToString = typeof Symbol === "undefined" ? null : unapply(Symbol.prototype.toString);
const objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
const objectToString = unapply(Object.prototype.toString);
const regExpTest = unapply(RegExp.prototype.test);
const typeErrorCreate = unconstruct(TypeError);
function unapply(func) {
  return function(thisArg) {
    if (thisArg instanceof RegExp) {
      thisArg.lastIndex = 0;
    }
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    return apply(func, thisArg, args);
  };
}
function unconstruct(Func) {
  return function() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return construct(Func, args);
  };
}
function addToSet(set2, array) {
  let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
  if (setPrototypeOf) {
    setPrototypeOf(set2, null);
  }
  if (!arrayIsArray(array)) {
    return set2;
  }
  let l2 = array.length;
  while (l2--) {
    let element = array[l2];
    if (typeof element === "string") {
      const lcElement = transformCaseFunc(element);
      if (lcElement !== element) {
        if (!isFrozen(array)) {
          array[l2] = lcElement;
        }
        element = lcElement;
      }
    }
    set2[element] = true;
  }
  return set2;
}
function cleanArray(array) {
  for (let index = 0; index < array.length; index++) {
    const isPropertyExist = objectHasOwnProperty(array, index);
    if (!isPropertyExist) {
      array[index] = null;
    }
  }
  return array;
}
function clone(object) {
  const newObject = create(null);
  for (const [property, value] of entries(object)) {
    const isPropertyExist = objectHasOwnProperty(object, property);
    if (isPropertyExist) {
      if (arrayIsArray(value)) {
        newObject[property] = cleanArray(value);
      } else if (value && typeof value === "object" && value.constructor === Object) {
        newObject[property] = clone(value);
      } else {
        newObject[property] = value;
      }
    }
  }
  return newObject;
}
function stringifyValue(value) {
  switch (typeof value) {
    case "string": {
      return value;
    }
    case "number": {
      return numberToString(value);
    }
    case "boolean": {
      return booleanToString(value);
    }
    case "bigint": {
      return bigintToString ? bigintToString(value) : "0";
    }
    case "symbol": {
      return symbolToString ? symbolToString(value) : "Symbol()";
    }
    case "undefined": {
      return objectToString(value);
    }
    case "function":
    case "object": {
      if (value === null) {
        return objectToString(value);
      }
      const valueAsRecord = value;
      const valueToString = lookupGetter(valueAsRecord, "toString");
      if (typeof valueToString === "function") {
        const stringified = valueToString(valueAsRecord);
        return typeof stringified === "string" ? stringified : objectToString(stringified);
      }
      return objectToString(value);
    }
    default: {
      return objectToString(value);
    }
  }
}
function lookupGetter(object, prop) {
  while (object !== null) {
    const desc = getOwnPropertyDescriptor(object, prop);
    if (desc) {
      if (desc.get) {
        return unapply(desc.get);
      }
      if (typeof desc.value === "function") {
        return unapply(desc.value);
      }
    }
    object = getPrototypeOf(object);
  }
  function fallbackValue() {
    return null;
  }
  return fallbackValue;
}
function isRegex(value) {
  try {
    regExpTest(value, "");
    return true;
  } catch (_unused) {
    return false;
  }
}
const html$1 = freeze(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
const svg$1 = freeze(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]);
const svgFilters = freeze(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]);
const svgDisallowed = freeze(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]);
const mathMl$1 = freeze(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]);
const mathMlDisallowed = freeze(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]);
const text = freeze(["#text"]);
const html = freeze(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns"]);
const svg = freeze(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]);
const mathMl = freeze(["accent", "accentunder", "align", "bevelled", "close", "columnalign", "columnlines", "columnspacing", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lquote", "lspace", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]);
const xml = freeze(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]);
const MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm);
const ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
const TMPLIT_EXPR = seal(/\$\{[\w\W]*/gm);
const DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/);
const ARIA_ATTR = seal(/^aria-[\-\w]+$/);
const IS_ALLOWED_URI = seal(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
);
const IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
const ATTR_WHITESPACE = seal(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
);
const DOCTYPE_NAME = seal(/^html$/i);
const CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
var EXPRESSIONS = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR,
  ATTR_WHITESPACE,
  CUSTOM_ELEMENT,
  DATA_ATTR,
  DOCTYPE_NAME,
  ERB_EXPR,
  IS_ALLOWED_URI,
  IS_SCRIPT_OR_DATA,
  MUSTACHE_EXPR,
  TMPLIT_EXPR
});
const NODE_TYPE = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
};
const getGlobal = function getGlobal2() {
  return typeof window === "undefined" ? null : window;
};
const _createTrustedTypesPolicy = function _createTrustedTypesPolicy2(trustedTypes, purifyHostElement) {
  if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") {
    return null;
  }
  let suffix = null;
  const ATTR_NAME = "data-tt-policy-suffix";
  if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
    suffix = purifyHostElement.getAttribute(ATTR_NAME);
  }
  const policyName = "dompurify" + (suffix ? "#" + suffix : "");
  try {
    return trustedTypes.createPolicy(policyName, {
      createHTML(html2) {
        return html2;
      },
      createScriptURL(scriptUrl) {
        return scriptUrl;
      }
    });
  } catch (_2) {
    console.warn("TrustedTypes policy " + policyName + " could not be created.");
    return null;
  }
};
const _createHooksMap = function _createHooksMap2() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
function createDOMPurify() {
  let window2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
  const DOMPurify = (root) => createDOMPurify(root);
  DOMPurify.version = "3.4.1";
  DOMPurify.removed = [];
  if (!window2 || !window2.document || window2.document.nodeType !== NODE_TYPE.document || !window2.Element) {
    DOMPurify.isSupported = false;
    return DOMPurify;
  }
  let {
    document: document2
  } = window2;
  const originalDocument = document2;
  const currentScript = originalDocument.currentScript;
  const {
    DocumentFragment,
    HTMLTemplateElement,
    Node,
    Element: Element2,
    NodeFilter,
    NamedNodeMap = window2.NamedNodeMap || window2.MozNamedAttrMap,
    HTMLFormElement,
    DOMParser,
    trustedTypes
  } = window2;
  const ElementPrototype = Element2.prototype;
  const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
  const remove2 = lookupGetter(ElementPrototype, "remove");
  const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
  const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
  const getParentNode = lookupGetter(ElementPrototype, "parentNode");
  if (typeof HTMLTemplateElement === "function") {
    const template = document2.createElement("template");
    if (template.content && template.content.ownerDocument) {
      document2 = template.content.ownerDocument;
    }
  }
  let trustedTypesPolicy;
  let emptyHTML = "";
  const {
    implementation,
    createNodeIterator,
    createDocumentFragment,
    getElementsByTagName
  } = document2;
  const {
    importNode
  } = originalDocument;
  let hooks = _createHooksMap();
  DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: MUSTACHE_EXPR2,
    ERB_EXPR: ERB_EXPR2,
    TMPLIT_EXPR: TMPLIT_EXPR2,
    DATA_ATTR: DATA_ATTR2,
    ARIA_ATTR: ARIA_ATTR2,
    IS_SCRIPT_OR_DATA: IS_SCRIPT_OR_DATA2,
    ATTR_WHITESPACE: ATTR_WHITESPACE2,
    CUSTOM_ELEMENT: CUSTOM_ELEMENT2
  } = EXPRESSIONS;
  let {
    IS_ALLOWED_URI: IS_ALLOWED_URI$1
  } = EXPRESSIONS;
  let ALLOWED_TAGS = null;
  const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
  let ALLOWED_ATTR = null;
  const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
  let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
    tagNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: false
    }
  }));
  let FORBID_TAGS = null;
  let FORBID_ATTR = null;
  const EXTRA_ELEMENT_HANDLING = Object.seal(create(null, {
    tagCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    }
  }));
  let ALLOW_ARIA_ATTR = true;
  let ALLOW_DATA_ATTR = true;
  let ALLOW_UNKNOWN_PROTOCOLS = false;
  let ALLOW_SELF_CLOSE_IN_ATTR = true;
  let SAFE_FOR_TEMPLATES = false;
  let SAFE_FOR_XML = true;
  let WHOLE_DOCUMENT = false;
  let SET_CONFIG = false;
  let FORCE_BODY = false;
  let RETURN_DOM = false;
  let RETURN_DOM_FRAGMENT = false;
  let RETURN_TRUSTED_TYPE = false;
  let SANITIZE_DOM = true;
  let SANITIZE_NAMED_PROPS = false;
  const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
  let KEEP_CONTENT = true;
  let IN_PLACE = false;
  let USE_PROFILES = {};
  let FORBID_CONTENTS = null;
  const DEFAULT_FORBID_CONTENTS = addToSet({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let DATA_URI_TAGS = null;
  const DEFAULT_DATA_URI_TAGS = addToSet({}, ["audio", "video", "img", "source", "image", "track"]);
  let URI_SAFE_ATTRIBUTES = null;
  const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]);
  const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
  let NAMESPACE = HTML_NAMESPACE;
  let IS_EMPTY_INPUT = false;
  let ALLOWED_NAMESPACES = null;
  const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
  let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ["mi", "mo", "mn", "ms", "mtext"]);
  let HTML_INTEGRATION_POINTS = addToSet({}, ["annotation-xml"]);
  const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ["title", "style", "font", "a", "script"]);
  let PARSER_MEDIA_TYPE = null;
  const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
  const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
  let transformCaseFunc = null;
  let CONFIG = null;
  const formElement = document2.createElement("form");
  const isRegexOrFunction = function isRegexOrFunction2(testValue) {
    return testValue instanceof RegExp || testValue instanceof Function;
  };
  const _parseConfig = function _parseConfig2() {
    let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (CONFIG && CONFIG === cfg) {
      return;
    }
    if (!cfg || typeof cfg !== "object") {
      cfg = {};
    }
    cfg = clone(cfg);
    PARSER_MEDIA_TYPE = // eslint-disable-next-line unicorn/prefer-includes
    SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
    transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
    ALLOWED_TAGS = objectHasOwnProperty(cfg, "ALLOWED_TAGS") && arrayIsArray(cfg.ALLOWED_TAGS) ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
    ALLOWED_ATTR = objectHasOwnProperty(cfg, "ALLOWED_ATTR") && arrayIsArray(cfg.ALLOWED_ATTR) ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
    ALLOWED_NAMESPACES = objectHasOwnProperty(cfg, "ALLOWED_NAMESPACES") && arrayIsArray(cfg.ALLOWED_NAMESPACES) ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
    URI_SAFE_ATTRIBUTES = objectHasOwnProperty(cfg, "ADD_URI_SAFE_ATTR") && arrayIsArray(cfg.ADD_URI_SAFE_ATTR) ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR, transformCaseFunc) : DEFAULT_URI_SAFE_ATTRIBUTES;
    DATA_URI_TAGS = objectHasOwnProperty(cfg, "ADD_DATA_URI_TAGS") && arrayIsArray(cfg.ADD_DATA_URI_TAGS) ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS, transformCaseFunc) : DEFAULT_DATA_URI_TAGS;
    FORBID_CONTENTS = objectHasOwnProperty(cfg, "FORBID_CONTENTS") && arrayIsArray(cfg.FORBID_CONTENTS) ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
    FORBID_TAGS = objectHasOwnProperty(cfg, "FORBID_TAGS") && arrayIsArray(cfg.FORBID_TAGS) ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : clone({});
    FORBID_ATTR = objectHasOwnProperty(cfg, "FORBID_ATTR") && arrayIsArray(cfg.FORBID_ATTR) ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : clone({});
    USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES && typeof cfg.USE_PROFILES === "object" ? clone(cfg.USE_PROFILES) : cfg.USE_PROFILES : false;
    ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
    ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
    ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
    ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
    SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
    SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false;
    WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
    RETURN_DOM = cfg.RETURN_DOM || false;
    RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
    RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
    FORCE_BODY = cfg.FORCE_BODY || false;
    SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
    SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
    KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
    IN_PLACE = cfg.IN_PLACE || false;
    IS_ALLOWED_URI$1 = isRegex(cfg.ALLOWED_URI_REGEXP) ? cfg.ALLOWED_URI_REGEXP : IS_ALLOWED_URI;
    NAMESPACE = typeof cfg.NAMESPACE === "string" ? cfg.NAMESPACE : HTML_NAMESPACE;
    MATHML_TEXT_INTEGRATION_POINTS = objectHasOwnProperty(cfg, "MATHML_TEXT_INTEGRATION_POINTS") && cfg.MATHML_TEXT_INTEGRATION_POINTS && typeof cfg.MATHML_TEXT_INTEGRATION_POINTS === "object" ? clone(cfg.MATHML_TEXT_INTEGRATION_POINTS) : addToSet({}, ["mi", "mo", "mn", "ms", "mtext"]);
    HTML_INTEGRATION_POINTS = objectHasOwnProperty(cfg, "HTML_INTEGRATION_POINTS") && cfg.HTML_INTEGRATION_POINTS && typeof cfg.HTML_INTEGRATION_POINTS === "object" ? clone(cfg.HTML_INTEGRATION_POINTS) : addToSet({}, ["annotation-xml"]);
    const customElementHandling = objectHasOwnProperty(cfg, "CUSTOM_ELEMENT_HANDLING") && cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING === "object" ? clone(cfg.CUSTOM_ELEMENT_HANDLING) : create(null);
    CUSTOM_ELEMENT_HANDLING = create(null);
    if (objectHasOwnProperty(customElementHandling, "tagNameCheck") && isRegexOrFunction(customElementHandling.tagNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.tagNameCheck = customElementHandling.tagNameCheck;
    }
    if (objectHasOwnProperty(customElementHandling, "attributeNameCheck") && isRegexOrFunction(customElementHandling.attributeNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.attributeNameCheck = customElementHandling.attributeNameCheck;
    }
    if (objectHasOwnProperty(customElementHandling, "allowCustomizedBuiltInElements") && typeof customElementHandling.allowCustomizedBuiltInElements === "boolean") {
      CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = customElementHandling.allowCustomizedBuiltInElements;
    }
    if (SAFE_FOR_TEMPLATES) {
      ALLOW_DATA_ATTR = false;
    }
    if (RETURN_DOM_FRAGMENT) {
      RETURN_DOM = true;
    }
    if (USE_PROFILES) {
      ALLOWED_TAGS = addToSet({}, text);
      ALLOWED_ATTR = create(null);
      if (USE_PROFILES.html === true) {
        addToSet(ALLOWED_TAGS, html$1);
        addToSet(ALLOWED_ATTR, html);
      }
      if (USE_PROFILES.svg === true) {
        addToSet(ALLOWED_TAGS, svg$1);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.svgFilters === true) {
        addToSet(ALLOWED_TAGS, svgFilters);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.mathMl === true) {
        addToSet(ALLOWED_TAGS, mathMl$1);
        addToSet(ALLOWED_ATTR, mathMl);
        addToSet(ALLOWED_ATTR, xml);
      }
    }
    EXTRA_ELEMENT_HANDLING.tagCheck = null;
    EXTRA_ELEMENT_HANDLING.attributeCheck = null;
    if (objectHasOwnProperty(cfg, "ADD_TAGS")) {
      if (typeof cfg.ADD_TAGS === "function") {
        EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
      } else if (arrayIsArray(cfg.ADD_TAGS)) {
        if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
          ALLOWED_TAGS = clone(ALLOWED_TAGS);
        }
        addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
      }
    }
    if (objectHasOwnProperty(cfg, "ADD_ATTR")) {
      if (typeof cfg.ADD_ATTR === "function") {
        EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
      } else if (arrayIsArray(cfg.ADD_ATTR)) {
        if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
          ALLOWED_ATTR = clone(ALLOWED_ATTR);
        }
        addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
      }
    }
    if (objectHasOwnProperty(cfg, "ADD_URI_SAFE_ATTR") && arrayIsArray(cfg.ADD_URI_SAFE_ATTR)) {
      addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
    }
    if (objectHasOwnProperty(cfg, "FORBID_CONTENTS") && arrayIsArray(cfg.FORBID_CONTENTS)) {
      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
        FORBID_CONTENTS = clone(FORBID_CONTENTS);
      }
      addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
    }
    if (objectHasOwnProperty(cfg, "ADD_FORBID_CONTENTS") && arrayIsArray(cfg.ADD_FORBID_CONTENTS)) {
      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
        FORBID_CONTENTS = clone(FORBID_CONTENTS);
      }
      addToSet(FORBID_CONTENTS, cfg.ADD_FORBID_CONTENTS, transformCaseFunc);
    }
    if (KEEP_CONTENT) {
      ALLOWED_TAGS["#text"] = true;
    }
    if (WHOLE_DOCUMENT) {
      addToSet(ALLOWED_TAGS, ["html", "head", "body"]);
    }
    if (ALLOWED_TAGS.table) {
      addToSet(ALLOWED_TAGS, ["tbody"]);
      delete FORBID_TAGS.tbody;
    }
    if (cfg.TRUSTED_TYPES_POLICY) {
      if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      }
      if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      }
      trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
      emptyHTML = trustedTypesPolicy.createHTML("");
    } else {
      if (trustedTypesPolicy === void 0) {
        trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
      }
      if (trustedTypesPolicy !== null && typeof emptyHTML === "string") {
        emptyHTML = trustedTypesPolicy.createHTML("");
      }
    }
    if (freeze) {
      freeze(cfg);
    }
    CONFIG = cfg;
  };
  const ALL_SVG_TAGS = addToSet({}, [...svg$1, ...svgFilters, ...svgDisallowed]);
  const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
  const _checkValidNamespace = function _checkValidNamespace2(element) {
    let parent = getParentNode(element);
    if (!parent || !parent.tagName) {
      parent = {
        namespaceURI: NAMESPACE,
        tagName: "template"
      };
    }
    const tagName = stringToLowerCase(element.tagName);
    const parentTagName = stringToLowerCase(parent.tagName);
    if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
      return false;
    }
    if (element.namespaceURI === SVG_NAMESPACE) {
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === "svg";
      }
      if (parent.namespaceURI === MATHML_NAMESPACE) {
        return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
      }
      return Boolean(ALL_SVG_TAGS[tagName]);
    }
    if (element.namespaceURI === MATHML_NAMESPACE) {
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === "math";
      }
      if (parent.namespaceURI === SVG_NAMESPACE) {
        return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
      }
      return Boolean(ALL_MATHML_TAGS[tagName]);
    }
    if (element.namespaceURI === HTML_NAMESPACE) {
      if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
    }
    if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) {
      return true;
    }
    return false;
  };
  const _forceRemove = function _forceRemove2(node) {
    arrayPush(DOMPurify.removed, {
      element: node
    });
    try {
      getParentNode(node).removeChild(node);
    } catch (_2) {
      remove2(node);
    }
  };
  const _removeAttribute = function _removeAttribute2(name, element) {
    try {
      arrayPush(DOMPurify.removed, {
        attribute: element.getAttributeNode(name),
        from: element
      });
    } catch (_2) {
      arrayPush(DOMPurify.removed, {
        attribute: null,
        from: element
      });
    }
    element.removeAttribute(name);
    if (name === "is") {
      if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
        try {
          _forceRemove(element);
        } catch (_2) {
        }
      } else {
        try {
          element.setAttribute(name, "");
        } catch (_2) {
        }
      }
    }
  };
  const _initDocument = function _initDocument2(dirty) {
    let doc2 = null;
    let leadingWhitespace = null;
    if (FORCE_BODY) {
      dirty = "<remove></remove>" + dirty;
    } else {
      const matches = stringMatch(dirty, /^[\r\n\t ]+/);
      leadingWhitespace = matches && matches[0];
    }
    if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) {
      dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + "</body></html>";
    }
    const dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
    if (NAMESPACE === HTML_NAMESPACE) {
      try {
        doc2 = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
      } catch (_2) {
      }
    }
    if (!doc2 || !doc2.documentElement) {
      doc2 = implementation.createDocument(NAMESPACE, "template", null);
      try {
        doc2.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
      } catch (_2) {
      }
    }
    const body = doc2.body || doc2.documentElement;
    if (dirty && leadingWhitespace) {
      body.insertBefore(document2.createTextNode(leadingWhitespace), body.childNodes[0] || null);
    }
    if (NAMESPACE === HTML_NAMESPACE) {
      return getElementsByTagName.call(doc2, WHOLE_DOCUMENT ? "html" : "body")[0];
    }
    return WHOLE_DOCUMENT ? doc2.documentElement : body;
  };
  const _createNodeIterator = function _createNodeIterator2(root) {
    return createNodeIterator.call(
      root.ownerDocument || root,
      root,
      // eslint-disable-next-line no-bitwise
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION,
      null
    );
  };
  const _isClobbered = function _isClobbered2(element) {
    return element instanceof HTMLFormElement && (typeof element.nodeName !== "string" || typeof element.textContent !== "string" || typeof element.removeChild !== "function" || !(element.attributes instanceof NamedNodeMap) || typeof element.removeAttribute !== "function" || typeof element.setAttribute !== "function" || typeof element.namespaceURI !== "string" || typeof element.insertBefore !== "function" || typeof element.hasChildNodes !== "function");
  };
  const _isNode = function _isNode2(value) {
    return typeof Node === "function" && value instanceof Node;
  };
  function _executeHooks(hooks2, currentNode, data) {
    arrayForEach(hooks2, (hook) => {
      hook.call(DOMPurify, currentNode, data, CONFIG);
    });
  }
  const _sanitizeElements = function _sanitizeElements2(currentNode) {
    let content = null;
    _executeHooks(hooks.beforeSanitizeElements, currentNode, null);
    if (_isClobbered(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    const tagName = transformCaseFunc(currentNode.nodeName);
    _executeHooks(hooks.uponSanitizeElement, currentNode, {
      tagName,
      allowedTags: ALLOWED_TAGS
    });
    if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(/<[/\w!]/g, currentNode.innerHTML) && regExpTest(/<[/\w!]/g, currentNode.textContent)) {
      _forceRemove(currentNode);
      return true;
    }
    if (SAFE_FOR_XML && currentNode.namespaceURI === HTML_NAMESPACE && tagName === "style" && _isNode(currentNode.firstElementChild)) {
      _forceRemove(currentNode);
      return true;
    }
    if (currentNode.nodeType === NODE_TYPE.progressingInstruction) {
      _forceRemove(currentNode);
      return true;
    }
    if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(/<[/\w]/g, currentNode.data)) {
      _forceRemove(currentNode);
      return true;
    }
    if (FORBID_TAGS[tagName] || !(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) && !ALLOWED_TAGS[tagName]) {
      if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) {
          return false;
        }
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) {
          return false;
        }
      }
      if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
        const parentNode = getParentNode(currentNode) || currentNode.parentNode;
        const childNodes = getChildNodes(currentNode) || currentNode.childNodes;
        if (childNodes && parentNode) {
          const childCount = childNodes.length;
          for (let i2 = childCount - 1; i2 >= 0; --i2) {
            const childClone = cloneNode(childNodes[i2], true);
            parentNode.insertBefore(childClone, getNextSibling(currentNode));
          }
        }
      }
      _forceRemove(currentNode);
      return true;
    }
    if (currentNode instanceof Element2 && !_checkValidNamespace(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(/<\/no(script|embed|frames)/i, currentNode.innerHTML)) {
      _forceRemove(currentNode);
      return true;
    }
    if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
      content = currentNode.textContent;
      arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
        content = stringReplace(content, expr, " ");
      });
      if (currentNode.textContent !== content) {
        arrayPush(DOMPurify.removed, {
          element: currentNode.cloneNode()
        });
        currentNode.textContent = content;
      }
    }
    _executeHooks(hooks.afterSanitizeElements, currentNode, null);
    return false;
  };
  const _isValidAttribute = function _isValidAttribute2(lcTag, lcName, value) {
    if (FORBID_ATTR[lcName]) {
      return false;
    }
    if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document2 || value in formElement)) {
      return false;
    }
    if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR2, lcName)) ;
    else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR2, lcName)) ;
    else if (EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function && EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag)) ;
    else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
      if (
        // First condition does a very basic check if a) it's basically a valid custom element tagname AND
        // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
        // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
        _isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName, lcTag)) || // Alternative, second condition checks if it's an `is`-attribute, AND
        // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
        lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))
      ) ;
      else {
        return false;
      }
    } else if (URI_SAFE_ATTRIBUTES[lcName]) ;
    else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE2, ""))) ;
    else if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]) ;
    else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA2, stringReplace(value, ATTR_WHITESPACE2, ""))) ;
    else if (value) {
      return false;
    } else ;
    return true;
  };
  const RESERVED_CUSTOM_ELEMENT_NAMES = addToSet({}, ["annotation-xml", "color-profile", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "missing-glyph"]);
  const _isBasicCustomElement = function _isBasicCustomElement2(tagName) {
    return !RESERVED_CUSTOM_ELEMENT_NAMES[stringToLowerCase(tagName)] && regExpTest(CUSTOM_ELEMENT2, tagName);
  };
  const _sanitizeAttributes = function _sanitizeAttributes2(currentNode) {
    _executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
    const {
      attributes
    } = currentNode;
    if (!attributes || _isClobbered(currentNode)) {
      return;
    }
    const hookEvent = {
      attrName: "",
      attrValue: "",
      keepAttr: true,
      allowedAttributes: ALLOWED_ATTR,
      forceKeepAttr: void 0
    };
    let l2 = attributes.length;
    while (l2--) {
      const attr = attributes[l2];
      const {
        name,
        namespaceURI,
        value: attrValue
      } = attr;
      const lcName = transformCaseFunc(name);
      const initValue = attrValue;
      let value = name === "value" ? initValue : stringTrim(initValue);
      hookEvent.attrName = lcName;
      hookEvent.attrValue = value;
      hookEvent.keepAttr = true;
      hookEvent.forceKeepAttr = void 0;
      _executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
      value = hookEvent.attrValue;
      if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name") && stringIndexOf(value, SANITIZE_NAMED_PROPS_PREFIX) !== 0) {
        _removeAttribute(name, currentNode);
        value = SANITIZE_NAMED_PROPS_PREFIX + value;
      }
      if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (lcName === "attributename" && stringMatch(value, "href")) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (hookEvent.forceKeepAttr) {
        continue;
      }
      if (!hookEvent.keepAttr) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (SAFE_FOR_TEMPLATES) {
        arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
          value = stringReplace(value, expr, " ");
        });
      }
      const lcTag = transformCaseFunc(currentNode.nodeName);
      if (!_isValidAttribute(lcTag, lcName, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function") {
        if (namespaceURI) ;
        else {
          switch (trustedTypes.getAttributeType(lcTag, lcName)) {
            case "TrustedHTML": {
              value = trustedTypesPolicy.createHTML(value);
              break;
            }
            case "TrustedScriptURL": {
              value = trustedTypesPolicy.createScriptURL(value);
              break;
            }
          }
        }
      }
      if (value !== initValue) {
        try {
          if (namespaceURI) {
            currentNode.setAttributeNS(namespaceURI, name, value);
          } else {
            currentNode.setAttribute(name, value);
          }
          if (_isClobbered(currentNode)) {
            _forceRemove(currentNode);
          } else {
            arrayPop(DOMPurify.removed);
          }
        } catch (_2) {
          _removeAttribute(name, currentNode);
        }
      }
    }
    _executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
  };
  const _sanitizeShadowDOM2 = function _sanitizeShadowDOM(fragment) {
    let shadowNode = null;
    const shadowIterator = _createNodeIterator(fragment);
    _executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
    while (shadowNode = shadowIterator.nextNode()) {
      _executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
      _sanitizeElements(shadowNode);
      _sanitizeAttributes(shadowNode);
      if (shadowNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM2(shadowNode.content);
      }
    }
    _executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
  };
  DOMPurify.sanitize = function(dirty) {
    let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let body = null;
    let importedNode = null;
    let currentNode = null;
    let returnNode = null;
    IS_EMPTY_INPUT = !dirty;
    if (IS_EMPTY_INPUT) {
      dirty = "<!-->";
    }
    if (typeof dirty !== "string" && !_isNode(dirty)) {
      dirty = stringifyValue(dirty);
      if (typeof dirty !== "string") {
        throw typeErrorCreate("dirty is not a string, aborting");
      }
    }
    if (!DOMPurify.isSupported) {
      return dirty;
    }
    if (!SET_CONFIG) {
      _parseConfig(cfg);
    }
    DOMPurify.removed = [];
    if (typeof dirty === "string") {
      IN_PLACE = false;
    }
    if (IN_PLACE) {
      const nn = dirty.nodeName;
      if (typeof nn === "string") {
        const tagName = transformCaseFunc(nn);
        if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
          throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
        }
      }
    } else if (dirty instanceof Node) {
      body = _initDocument("<!---->");
      importedNode = body.ownerDocument.importNode(dirty, true);
      if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") {
        body = importedNode;
      } else if (importedNode.nodeName === "HTML") {
        body = importedNode;
      } else {
        body.appendChild(importedNode);
      }
    } else {
      if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
      dirty.indexOf("<") === -1) {
        return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
      }
      body = _initDocument(dirty);
      if (!body) {
        return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
      }
    }
    if (body && FORCE_BODY) {
      _forceRemove(body.firstChild);
    }
    const nodeIterator = _createNodeIterator(IN_PLACE ? dirty : body);
    while (currentNode = nodeIterator.nextNode()) {
      _sanitizeElements(currentNode);
      _sanitizeAttributes(currentNode);
      if (currentNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM2(currentNode.content);
      }
    }
    if (IN_PLACE) {
      return dirty;
    }
    if (RETURN_DOM) {
      if (SAFE_FOR_TEMPLATES) {
        body.normalize();
        let html2 = body.innerHTML;
        arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
          html2 = stringReplace(html2, expr, " ");
        });
        body.innerHTML = html2;
      }
      if (RETURN_DOM_FRAGMENT) {
        returnNode = createDocumentFragment.call(body.ownerDocument);
        while (body.firstChild) {
          returnNode.appendChild(body.firstChild);
        }
      } else {
        returnNode = body;
      }
      if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
        returnNode = importNode.call(originalDocument, returnNode, true);
      }
      return returnNode;
    }
    let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
    if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
      serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
    }
    if (SAFE_FOR_TEMPLATES) {
      arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
        serializedHTML = stringReplace(serializedHTML, expr, " ");
      });
    }
    return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
  };
  DOMPurify.setConfig = function() {
    let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    _parseConfig(cfg);
    SET_CONFIG = true;
  };
  DOMPurify.clearConfig = function() {
    CONFIG = null;
    SET_CONFIG = false;
  };
  DOMPurify.isValidAttribute = function(tag, attr, value) {
    if (!CONFIG) {
      _parseConfig({});
    }
    const lcTag = transformCaseFunc(tag);
    const lcName = transformCaseFunc(attr);
    return _isValidAttribute(lcTag, lcName, value);
  };
  DOMPurify.addHook = function(entryPoint, hookFunction) {
    if (typeof hookFunction !== "function") {
      return;
    }
    arrayPush(hooks[entryPoint], hookFunction);
  };
  DOMPurify.removeHook = function(entryPoint, hookFunction) {
    if (hookFunction !== void 0) {
      const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
      return index === -1 ? void 0 : arraySplice(hooks[entryPoint], index, 1)[0];
    }
    return arrayPop(hooks[entryPoint]);
  };
  DOMPurify.removeHooks = function(entryPoint) {
    hooks[entryPoint] = [];
  };
  DOMPurify.removeAllHooks = function() {
    hooks = _createHooksMap();
  };
  return DOMPurify;
}
var purify = createDOMPurify();
/*!
  Highlight.js v11.11.1 (git: 08cb242e7d)
  (c) 2006-2024 Josh Goebel <hello@joshgoebel.com> and other contributors
  License: BSD-3-Clause
 */
function e(n2) {
  return n2 instanceof Map ? n2.clear = n2.delete = n2.set = () => {
    throw Error("map is read-only");
  } : n2 instanceof Set && (n2.add = n2.clear = n2.delete = () => {
    throw Error("set is read-only");
  }), Object.freeze(n2), Object.getOwnPropertyNames(n2).forEach(((t2) => {
    const a2 = n2[t2], i2 = typeof a2;
    "object" !== i2 && "function" !== i2 || Object.isFrozen(a2) || e(a2);
  })), n2;
}
class n {
  constructor(e2) {
    void 0 === e2.data && (e2.data = {}), this.data = e2.data, this.isMatchIgnored = false;
  }
  ignoreMatch() {
    this.isMatchIgnored = true;
  }
}
function t(e2) {
  return e2.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}
function a(e2, ...n2) {
  const t2 = /* @__PURE__ */ Object.create(null);
  for (const n3 in e2) t2[n3] = e2[n3];
  return n2.forEach(((e3) => {
    for (const n3 in e3) t2[n3] = e3[n3];
  })), t2;
}
const i = (e2) => !!e2.scope;
class r {
  constructor(e2, n2) {
    this.buffer = "", this.classPrefix = n2.classPrefix, e2.walk(this);
  }
  addText(e2) {
    this.buffer += t(e2);
  }
  openNode(e2) {
    if (!i(e2)) return;
    const n2 = ((e3, { prefix: n3 }) => {
      if (e3.startsWith("language:")) return e3.replace("language:", "language-");
      if (e3.includes(".")) {
        const t2 = e3.split(".");
        return [`${n3}${t2.shift()}`, ...t2.map(((e4, n4) => `${e4}${"_".repeat(n4 + 1)}`))].join(" ");
      }
      return `${n3}${e3}`;
    })(e2.scope, { prefix: this.classPrefix });
    this.span(n2);
  }
  closeNode(e2) {
    i(e2) && (this.buffer += "</span>");
  }
  value() {
    return this.buffer;
  }
  span(e2) {
    this.buffer += `<span class="${e2}">`;
  }
}
const s = (e2 = {}) => {
  const n2 = { children: [] };
  return Object.assign(n2, e2), n2;
};
class o {
  constructor() {
    this.rootNode = s(), this.stack = [this.rootNode];
  }
  get top() {
    return this.stack[this.stack.length - 1];
  }
  get root() {
    return this.rootNode;
  }
  add(e2) {
    this.top.children.push(e2);
  }
  openNode(e2) {
    const n2 = s({ scope: e2 });
    this.add(n2), this.stack.push(n2);
  }
  closeNode() {
    if (this.stack.length > 1) return this.stack.pop();
  }
  closeAllNodes() {
    for (; this.closeNode(); ) ;
  }
  toJSON() {
    return JSON.stringify(this.rootNode, null, 4);
  }
  walk(e2) {
    return this.constructor._walk(e2, this.rootNode);
  }
  static _walk(e2, n2) {
    return "string" == typeof n2 ? e2.addText(n2) : n2.children && (e2.openNode(n2), n2.children.forEach(((n3) => this._walk(e2, n3))), e2.closeNode(n2)), e2;
  }
  static _collapse(e2) {
    "string" != typeof e2 && e2.children && (e2.children.every(((e3) => "string" == typeof e3)) ? e2.children = [e2.children.join("")] : e2.children.forEach(((e3) => {
      o._collapse(e3);
    })));
  }
}
class l extends o {
  constructor(e2) {
    super(), this.options = e2;
  }
  addText(e2) {
    "" !== e2 && this.add(e2);
  }
  startScope(e2) {
    this.openNode(e2);
  }
  endScope() {
    this.closeNode();
  }
  __addSublanguage(e2, n2) {
    const t2 = e2.root;
    n2 && (t2.scope = "language:" + n2), this.add(t2);
  }
  toHTML() {
    return new r(this, this.options).value();
  }
  finalize() {
    return this.closeAllNodes(), true;
  }
}
function c(e2) {
  return e2 ? "string" == typeof e2 ? e2 : e2.source : null;
}
function d(e2) {
  return b("(?=", e2, ")");
}
function g(e2) {
  return b("(?:", e2, ")*");
}
function u(e2) {
  return b("(?:", e2, ")?");
}
function b(...e2) {
  return e2.map(((e3) => c(e3))).join("");
}
function m(...e2) {
  const n2 = ((e3) => {
    const n3 = e3[e3.length - 1];
    return "object" == typeof n3 && n3.constructor === Object ? (e3.splice(e3.length - 1, 1), n3) : {};
  })(e2);
  return "(" + (n2.capture ? "" : "?:") + e2.map(((e3) => c(e3))).join("|") + ")";
}
function p(e2) {
  return RegExp(e2.toString() + "|").exec("").length - 1;
}
const _ = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
function h(e2, { joinWith: n2 }) {
  let t2 = 0;
  return e2.map(((e3) => {
    t2 += 1;
    const n3 = t2;
    let a2 = c(e3), i2 = "";
    for (; a2.length > 0; ) {
      const e4 = _.exec(a2);
      if (!e4) {
        i2 += a2;
        break;
      }
      i2 += a2.substring(0, e4.index), a2 = a2.substring(e4.index + e4[0].length), "\\" === e4[0][0] && e4[1] ? i2 += "\\" + (Number(e4[1]) + n3) : (i2 += e4[0], "(" === e4[0] && t2++);
    }
    return i2;
  })).map(((e3) => `(${e3})`)).join(n2);
}
const f = "[a-zA-Z]\\w*", E = "[a-zA-Z_]\\w*", y = "\\b\\d+(\\.\\d+)?", w = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", v = "\\b(0b[01]+)", N = {
  begin: "\\\\[\\s\\S]",
  relevance: 0
}, k = {
  scope: "string",
  begin: "'",
  end: "'",
  illegal: "\\n",
  contains: [N]
}, x = {
  scope: "string",
  begin: '"',
  end: '"',
  illegal: "\\n",
  contains: [N]
}, O = (e2, n2, t2 = {}) => {
  const i2 = a({
    scope: "comment",
    begin: e2,
    end: n2,
    contains: []
  }, t2);
  i2.contains.push({
    scope: "doctag",
    begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
    end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
    excludeBegin: true,
    relevance: 0
  });
  const r2 = m("I", "a", "is", "so", "us", "to", "at", "if", "in", "it", "on", /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, /[A-Za-z]+[-][a-z]+/, /[A-Za-z][a-z]{2,}/);
  return i2.contains.push({ begin: b(/[ ]+/, "(", r2, /[.]?[:]?([.][ ]|[ ])/, "){3}") }), i2;
}, M = O("//", "$"), A = O("/\\*", "\\*/"), S = O("#", "$");
var C = Object.freeze({
  __proto__: null,
  APOS_STRING_MODE: k,
  BACKSLASH_ESCAPE: N,
  BINARY_NUMBER_MODE: {
    scope: "number",
    begin: v,
    relevance: 0
  },
  BINARY_NUMBER_RE: v,
  COMMENT: O,
  C_BLOCK_COMMENT_MODE: A,
  C_LINE_COMMENT_MODE: M,
  C_NUMBER_MODE: {
    scope: "number",
    begin: w,
    relevance: 0
  },
  C_NUMBER_RE: w,
  END_SAME_AS_BEGIN: (e2) => Object.assign(e2, {
    "on:begin": (e3, n2) => {
      n2.data._beginMatch = e3[1];
    },
    "on:end": (e3, n2) => {
      n2.data._beginMatch !== e3[1] && n2.ignoreMatch();
    }
  }),
  HASH_COMMENT_MODE: S,
  IDENT_RE: f,
  MATCH_NOTHING_RE: /\b\B/,
  METHOD_GUARD: { begin: "\\.\\s*" + E, relevance: 0 },
  NUMBER_MODE: { scope: "number", begin: y, relevance: 0 },
  NUMBER_RE: y,
  PHRASAL_WORDS_MODE: {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  },
  QUOTE_STRING_MODE: x,
  REGEXP_MODE: {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [N, { begin: /\[/, end: /\]/, relevance: 0, contains: [N] }]
  },
  RE_STARTERS_RE: "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
  SHEBANG: (e2 = {}) => {
    const n2 = /^#![ ]*\//;
    return e2.binary && (e2.begin = b(n2, /.*\b/, e2.binary, /\b.*/)), a({
      scope: "meta",
      begin: n2,
      end: /$/,
      relevance: 0,
      "on:begin": (e3, n3) => {
        0 !== e3.index && n3.ignoreMatch();
      }
    }, e2);
  },
  TITLE_MODE: { scope: "title", begin: f, relevance: 0 },
  UNDERSCORE_IDENT_RE: E,
  UNDERSCORE_TITLE_MODE: { scope: "title", begin: E, relevance: 0 }
});
function T(e2, n2) {
  "." === e2.input[e2.index - 1] && n2.ignoreMatch();
}
function R(e2, n2) {
  void 0 !== e2.className && (e2.scope = e2.className, delete e2.className);
}
function D(e2, n2) {
  n2 && e2.beginKeywords && (e2.begin = "\\b(" + e2.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", e2.__beforeBegin = T, e2.keywords = e2.keywords || e2.beginKeywords, delete e2.beginKeywords, void 0 === e2.relevance && (e2.relevance = 0));
}
function I(e2, n2) {
  Array.isArray(e2.illegal) && (e2.illegal = m(...e2.illegal));
}
function L(e2, n2) {
  if (e2.match) {
    if (e2.begin || e2.end) throw Error("begin & end are not supported with match");
    e2.begin = e2.match, delete e2.match;
  }
}
function B(e2, n2) {
  void 0 === e2.relevance && (e2.relevance = 1);
}
const $ = (e2, n2) => {
  if (!e2.beforeMatch) return;
  if (e2.starts) throw Error("beforeMatch cannot be used with starts");
  const t2 = Object.assign({}, e2);
  Object.keys(e2).forEach(((n3) => {
    delete e2[n3];
  })), e2.keywords = t2.keywords, e2.begin = b(t2.beforeMatch, d(t2.begin)), e2.starts = {
    relevance: 0,
    contains: [Object.assign(t2, { endsParent: true })]
  }, e2.relevance = 0, delete t2.beforeMatch;
}, F = ["of", "and", "for", "in", "not", "or", "if", "then", "parent", "list", "value"];
function z(e2, n2, t2 = "keyword") {
  const a2 = /* @__PURE__ */ Object.create(null);
  return "string" == typeof e2 ? i2(t2, e2.split(" ")) : Array.isArray(e2) ? i2(t2, e2) : Object.keys(e2).forEach(((t3) => {
    Object.assign(a2, z(e2[t3], n2, t3));
  })), a2;
  function i2(e3, t3) {
    n2 && (t3 = t3.map(((e4) => e4.toLowerCase()))), t3.forEach(((n3) => {
      const t4 = n3.split("|");
      a2[t4[0]] = [e3, j(t4[0], t4[1])];
    }));
  }
}
function j(e2, n2) {
  return n2 ? Number(n2) : ((e3) => F.includes(e3.toLowerCase()))(e2) ? 0 : 1;
}
const U = {}, P = (e2) => {
  console.error(e2);
}, K = (e2, ...n2) => {
  console.log("WARN: " + e2, ...n2);
}, q = (e2, n2) => {
  U[`${e2}/${n2}`] || (console.log(`Deprecated as of ${e2}. ${n2}`), U[`${e2}/${n2}`] = true);
}, H = Error();
function G(e2, n2, { key: t2 }) {
  let a2 = 0;
  const i2 = e2[t2], r2 = {}, s2 = {};
  for (let e3 = 1; e3 <= n2.length; e3++) s2[e3 + a2] = i2[e3], r2[e3 + a2] = true, a2 += p(n2[e3 - 1]);
  e2[t2] = s2, e2[t2]._emit = r2, e2[t2]._multi = true;
}
function Z(e2) {
  ((e3) => {
    e3.scope && "object" == typeof e3.scope && null !== e3.scope && (e3.beginScope = e3.scope, delete e3.scope);
  })(e2), "string" == typeof e2.beginScope && (e2.beginScope = {
    _wrap: e2.beginScope
  }), "string" == typeof e2.endScope && (e2.endScope = {
    _wrap: e2.endScope
  }), ((e3) => {
    if (Array.isArray(e3.begin)) {
      if (e3.skip || e3.excludeBegin || e3.returnBegin) throw P("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), H;
      if ("object" != typeof e3.beginScope || null === e3.beginScope) throw P("beginScope must be object"), H;
      G(e3, e3.begin, { key: "beginScope" }), e3.begin = h(e3.begin, { joinWith: "" });
    }
  })(e2), ((e3) => {
    if (Array.isArray(e3.end)) {
      if (e3.skip || e3.excludeEnd || e3.returnEnd) throw P("skip, excludeEnd, returnEnd not compatible with endScope: {}"), H;
      if ("object" != typeof e3.endScope || null === e3.endScope) throw P("endScope must be object"), H;
      G(e3, e3.end, { key: "endScope" }), e3.end = h(e3.end, { joinWith: "" });
    }
  })(e2);
}
function W(e2) {
  function n2(n3, t3) {
    return RegExp(c(n3), "m" + (e2.case_insensitive ? "i" : "") + (e2.unicodeRegex ? "u" : "") + (t3 ? "g" : ""));
  }
  class t2 {
    constructor() {
      this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
    }
    addRule(e3, n3) {
      n3.position = this.position++, this.matchIndexes[this.matchAt] = n3, this.regexes.push([n3, e3]), this.matchAt += p(e3) + 1;
    }
    compile() {
      0 === this.regexes.length && (this.exec = () => null);
      const e3 = this.regexes.map(((e4) => e4[1]));
      this.matcherRe = n2(h(e3, {
        joinWith: "|"
      }), true), this.lastIndex = 0;
    }
    exec(e3) {
      this.matcherRe.lastIndex = this.lastIndex;
      const n3 = this.matcherRe.exec(e3);
      if (!n3) return null;
      const t3 = n3.findIndex(((e4, n4) => n4 > 0 && void 0 !== e4)), a2 = this.matchIndexes[t3];
      return n3.splice(0, t3), Object.assign(n3, a2);
    }
  }
  class i2 {
    constructor() {
      this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
    }
    getMatcher(e3) {
      if (this.multiRegexes[e3]) return this.multiRegexes[e3];
      const n3 = new t2();
      return this.rules.slice(e3).forEach((([e4, t3]) => n3.addRule(e4, t3))), n3.compile(), this.multiRegexes[e3] = n3, n3;
    }
    resumingScanAtSamePosition() {
      return 0 !== this.regexIndex;
    }
    considerAll() {
      this.regexIndex = 0;
    }
    addRule(e3, n3) {
      this.rules.push([e3, n3]), "begin" === n3.type && this.count++;
    }
    exec(e3) {
      const n3 = this.getMatcher(this.regexIndex);
      n3.lastIndex = this.lastIndex;
      let t3 = n3.exec(e3);
      if (this.resumingScanAtSamePosition()) if (t3 && t3.index === this.lastIndex) ;
      else {
        const n4 = this.getMatcher(0);
        n4.lastIndex = this.lastIndex + 1, t3 = n4.exec(e3);
      }
      return t3 && (this.regexIndex += t3.position + 1, this.regexIndex === this.count && this.considerAll()), t3;
    }
  }
  if (e2.compilerExtensions || (e2.compilerExtensions = []), e2.contains && e2.contains.includes("self")) throw Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
  return e2.classNameAliases = a(e2.classNameAliases || {}), (function t3(r2, s2) {
    const o2 = r2;
    if (r2.isCompiled) return o2;
    [R, L, Z, $].forEach(((e3) => e3(r2, s2))), e2.compilerExtensions.forEach(((e3) => e3(r2, s2))), r2.__beforeBegin = null, [D, I, B].forEach(((e3) => e3(r2, s2))), r2.isCompiled = true;
    let l2 = null;
    return "object" == typeof r2.keywords && r2.keywords.$pattern && (r2.keywords = Object.assign({}, r2.keywords), l2 = r2.keywords.$pattern, delete r2.keywords.$pattern), l2 = l2 || /\w+/, r2.keywords && (r2.keywords = z(r2.keywords, e2.case_insensitive)), o2.keywordPatternRe = n2(l2, true), s2 && (r2.begin || (r2.begin = /\B|\b/), o2.beginRe = n2(o2.begin), r2.end || r2.endsWithParent || (r2.end = /\B|\b/), r2.end && (o2.endRe = n2(o2.end)), o2.terminatorEnd = c(o2.end) || "", r2.endsWithParent && s2.terminatorEnd && (o2.terminatorEnd += (r2.end ? "|" : "") + s2.terminatorEnd)), r2.illegal && (o2.illegalRe = n2(r2.illegal)), r2.contains || (r2.contains = []), r2.contains = [].concat(...r2.contains.map(((e3) => ((e4) => (e4.variants && !e4.cachedVariants && (e4.cachedVariants = e4.variants.map(((n3) => a(e4, {
      variants: null
    }, n3)))), e4.cachedVariants ? e4.cachedVariants : Q(e4) ? a(e4, {
      starts: e4.starts ? a(e4.starts) : null
    }) : Object.isFrozen(e4) ? a(e4) : e4))("self" === e3 ? r2 : e3)))), r2.contains.forEach(((e3) => {
      t3(e3, o2);
    })), r2.starts && t3(r2.starts, s2), o2.matcher = ((e3) => {
      const n3 = new i2();
      return e3.contains.forEach(((e4) => n3.addRule(e4.begin, {
        rule: e4,
        type: "begin"
      }))), e3.terminatorEnd && n3.addRule(e3.terminatorEnd, {
        type: "end"
      }), e3.illegal && n3.addRule(e3.illegal, { type: "illegal" }), n3;
    })(o2), o2;
  })(e2);
}
function Q(e2) {
  return !!e2 && (e2.endsWithParent || Q(e2.starts));
}
class X extends Error {
  constructor(e2, n2) {
    super(e2), this.name = "HTMLInjectionError", this.html = n2;
  }
}
const V = t, J = a, Y = Symbol("nomatch"), ee = (t2) => {
  const a2 = /* @__PURE__ */ Object.create(null), i2 = /* @__PURE__ */ Object.create(null), r2 = [];
  let s2 = true;
  const o2 = "Could not find the language '{}', did you forget to load/include a language module?", c2 = {
    disableAutodetect: true,
    name: "Plain text",
    contains: []
  };
  let p2 = {
    ignoreUnescapedHTML: false,
    throwUnescapedHTML: false,
    noHighlightRe: /^(no-?highlight)$/i,
    languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
    classPrefix: "hljs-",
    cssSelector: "pre code",
    languages: null,
    __emitter: l
  };
  function _2(e2) {
    return p2.noHighlightRe.test(e2);
  }
  function h2(e2, n2, t3) {
    let a3 = "", i3 = "";
    "object" == typeof n2 ? (a3 = e2, t3 = n2.ignoreIllegals, i3 = n2.language) : (q("10.7.0", "highlight(lang, code, ...args) has been deprecated."), q("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"), i3 = e2, a3 = n2), void 0 === t3 && (t3 = true);
    const r3 = { code: a3, language: i3 };
    O2("before:highlight", r3);
    const s3 = r3.result ? r3.result : f2(r3.language, r3.code, t3);
    return s3.code = r3.code, O2("after:highlight", s3), s3;
  }
  function f2(e2, t3, i3, r3) {
    const l2 = /* @__PURE__ */ Object.create(null);
    function c3() {
      if (!O3.keywords) return void A2.addText(S2);
      let e3 = 0;
      O3.keywordPatternRe.lastIndex = 0;
      let n2 = O3.keywordPatternRe.exec(S2), t4 = "";
      for (; n2; ) {
        t4 += S2.substring(e3, n2.index);
        const i4 = v3.case_insensitive ? n2[0].toLowerCase() : n2[0], r4 = (a3 = i4, O3.keywords[a3]);
        if (r4) {
          const [e4, a4] = r4;
          if (A2.addText(t4), t4 = "", l2[i4] = (l2[i4] || 0) + 1, l2[i4] <= 7 && (C2 += a4), e4.startsWith("_")) t4 += n2[0];
          else {
            const t5 = v3.classNameAliases[e4] || e4;
            g2(n2[0], t5);
          }
        } else t4 += n2[0];
        e3 = O3.keywordPatternRe.lastIndex, n2 = O3.keywordPatternRe.exec(S2);
      }
      var a3;
      t4 += S2.substring(e3), A2.addText(t4);
    }
    function d2() {
      null != O3.subLanguage ? (() => {
        if ("" === S2) return;
        let e3 = null;
        if ("string" == typeof O3.subLanguage) {
          if (!a2[O3.subLanguage]) return void A2.addText(S2);
          e3 = f2(O3.subLanguage, S2, true, M2[O3.subLanguage]), M2[O3.subLanguage] = e3._top;
        } else e3 = E2(S2, O3.subLanguage.length ? O3.subLanguage : null);
        O3.relevance > 0 && (C2 += e3.relevance), A2.__addSublanguage(e3._emitter, e3.language);
      })() : c3(), S2 = "";
    }
    function g2(e3, n2) {
      "" !== e3 && (A2.startScope(n2), A2.addText(e3), A2.endScope());
    }
    function u2(e3, n2) {
      let t4 = 1;
      const a3 = n2.length - 1;
      for (; t4 <= a3; ) {
        if (!e3._emit[t4]) {
          t4++;
          continue;
        }
        const a4 = v3.classNameAliases[e3[t4]] || e3[t4], i4 = n2[t4];
        a4 ? g2(i4, a4) : (S2 = i4, c3(), S2 = ""), t4++;
      }
    }
    function b2(e3, n2) {
      return e3.scope && "string" == typeof e3.scope && A2.openNode(v3.classNameAliases[e3.scope] || e3.scope), e3.beginScope && (e3.beginScope._wrap ? (g2(S2, v3.classNameAliases[e3.beginScope._wrap] || e3.beginScope._wrap), S2 = "") : e3.beginScope._multi && (u2(e3.beginScope, n2), S2 = "")), O3 = Object.create(e3, { parent: {
        value: O3
      } }), O3;
    }
    function m2(e3, t4, a3) {
      let i4 = ((e4, n2) => {
        const t5 = e4 && e4.exec(n2);
        return t5 && 0 === t5.index;
      })(e3.endRe, a3);
      if (i4) {
        if (e3["on:end"]) {
          const a4 = new n(e3);
          e3["on:end"](t4, a4), a4.isMatchIgnored && (i4 = false);
        }
        if (i4) {
          for (; e3.endsParent && e3.parent; ) e3 = e3.parent;
          return e3;
        }
      }
      if (e3.endsWithParent) return m2(e3.parent, t4, a3);
    }
    function _3(e3) {
      return 0 === O3.matcher.regexIndex ? (S2 += e3[0], 1) : (D2 = true, 0);
    }
    function h3(e3) {
      const n2 = e3[0], a3 = t3.substring(e3.index), i4 = m2(O3, e3, a3);
      if (!i4) return Y;
      const r4 = O3;
      O3.endScope && O3.endScope._wrap ? (d2(), g2(n2, O3.endScope._wrap)) : O3.endScope && O3.endScope._multi ? (d2(), u2(O3.endScope, e3)) : r4.skip ? S2 += n2 : (r4.returnEnd || r4.excludeEnd || (S2 += n2), d2(), r4.excludeEnd && (S2 = n2));
      do {
        O3.scope && A2.closeNode(), O3.skip || O3.subLanguage || (C2 += O3.relevance), O3 = O3.parent;
      } while (O3 !== i4.parent);
      return i4.starts && b2(i4.starts, e3), r4.returnEnd ? 0 : n2.length;
    }
    let y3 = {};
    function w3(a3, r4) {
      const o3 = r4 && r4[0];
      if (S2 += a3, null == o3) return d2(), 0;
      if ("begin" === y3.type && "end" === r4.type && y3.index === r4.index && "" === o3) {
        if (S2 += t3.slice(r4.index, r4.index + 1), !s2) {
          const n2 = Error(`0 width match regex (${e2})`);
          throw n2.languageName = e2, n2.badRule = y3.rule, n2;
        }
        return 1;
      }
      if (y3 = r4, "begin" === r4.type) return ((e3) => {
        const t4 = e3[0], a4 = e3.rule, i4 = new n(a4), r5 = [a4.__beforeBegin, a4["on:begin"]];
        for (const n2 of r5) if (n2 && (n2(e3, i4), i4.isMatchIgnored)) return _3(t4);
        return a4.skip ? S2 += t4 : (a4.excludeBegin && (S2 += t4), d2(), a4.returnBegin || a4.excludeBegin || (S2 = t4)), b2(a4, e3), a4.returnBegin ? 0 : t4.length;
      })(r4);
      if ("illegal" === r4.type && !i3) {
        const e3 = Error('Illegal lexeme "' + o3 + '" for mode "' + (O3.scope || "<unnamed>") + '"');
        throw e3.mode = O3, e3;
      }
      if ("end" === r4.type) {
        const e3 = h3(r4);
        if (e3 !== Y) return e3;
      }
      if ("illegal" === r4.type && "" === o3) return S2 += "\n", 1;
      if (R2 > 1e5 && R2 > 3 * r4.index) throw Error("potential infinite loop, way more iterations than matches");
      return S2 += o3, o3.length;
    }
    const v3 = N2(e2);
    if (!v3) throw P(o2.replace("{}", e2)), Error('Unknown language: "' + e2 + '"');
    const k3 = W(v3);
    let x3 = "", O3 = r3 || k3;
    const M2 = {}, A2 = new p2.__emitter(p2);
    (() => {
      const e3 = [];
      for (let n2 = O3; n2 !== v3; n2 = n2.parent) n2.scope && e3.unshift(n2.scope);
      e3.forEach(((e4) => A2.openNode(e4)));
    })();
    let S2 = "", C2 = 0, T2 = 0, R2 = 0, D2 = false;
    try {
      if (v3.__emitTokens) v3.__emitTokens(t3, A2);
      else {
        for (O3.matcher.considerAll(); ; ) {
          R2++, D2 ? D2 = false : O3.matcher.considerAll(), O3.matcher.lastIndex = T2;
          const e3 = O3.matcher.exec(t3);
          if (!e3) break;
          const n2 = w3(t3.substring(T2, e3.index), e3);
          T2 = e3.index + n2;
        }
        w3(t3.substring(T2));
      }
      return A2.finalize(), x3 = A2.toHTML(), {
        language: e2,
        value: x3,
        relevance: C2,
        illegal: false,
        _emitter: A2,
        _top: O3
      };
    } catch (n2) {
      if (n2.message && n2.message.includes("Illegal")) return {
        language: e2,
        value: V(t3),
        illegal: true,
        relevance: 0,
        _illegalBy: {
          message: n2.message,
          index: T2,
          context: t3.slice(T2 - 100, T2 + 100),
          mode: n2.mode,
          resultSoFar: x3
        },
        _emitter: A2
      };
      if (s2) return {
        language: e2,
        value: V(t3),
        illegal: false,
        relevance: 0,
        errorRaised: n2,
        _emitter: A2,
        _top: O3
      };
      throw n2;
    }
  }
  function E2(e2, n2) {
    n2 = n2 || p2.languages || Object.keys(a2);
    const t3 = ((e3) => {
      const n3 = { value: V(e3), illegal: false, relevance: 0, _top: c2, _emitter: new p2.__emitter(p2) };
      return n3._emitter.addText(e3), n3;
    })(e2), i3 = n2.filter(N2).filter(x2).map(((n3) => f2(n3, e2, false)));
    i3.unshift(t3);
    const r3 = i3.sort(((e3, n3) => {
      if (e3.relevance !== n3.relevance) return n3.relevance - e3.relevance;
      if (e3.language && n3.language) {
        if (N2(e3.language).supersetOf === n3.language) return 1;
        if (N2(n3.language).supersetOf === e3.language) return -1;
      }
      return 0;
    })), [s3, o3] = r3, l2 = s3;
    return l2.secondBest = o3, l2;
  }
  function y2(e2) {
    let n2 = null;
    const t3 = ((e3) => {
      let n3 = e3.className + " ";
      n3 += e3.parentNode ? e3.parentNode.className : "";
      const t4 = p2.languageDetectRe.exec(n3);
      if (t4) {
        const n4 = N2(t4[1]);
        return n4 || (K(o2.replace("{}", t4[1])), K("Falling back to no-highlight mode for this block.", e3)), n4 ? t4[1] : "no-highlight";
      }
      return n3.split(/\s+/).find(((e4) => _2(e4) || N2(e4)));
    })(e2);
    if (_2(t3)) return;
    if (O2("before:highlightElement", {
      el: e2,
      language: t3
    }), e2.dataset.highlighted) return void console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", e2);
    if (e2.children.length > 0 && (p2.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(e2)), p2.throwUnescapedHTML)) throw new X("One of your code blocks includes unescaped HTML.", e2.innerHTML);
    n2 = e2;
    const a3 = n2.textContent, r3 = t3 ? h2(a3, { language: t3, ignoreIllegals: true }) : E2(a3);
    e2.innerHTML = r3.value, e2.dataset.highlighted = "yes", ((e3, n3, t4) => {
      const a4 = n3 && i2[n3] || t4;
      e3.classList.add("hljs"), e3.classList.add("language-" + a4);
    })(e2, t3, r3.language), e2.result = {
      language: r3.language,
      re: r3.relevance,
      relevance: r3.relevance
    }, r3.secondBest && (e2.secondBest = {
      language: r3.secondBest.language,
      relevance: r3.secondBest.relevance
    }), O2("after:highlightElement", { el: e2, result: r3, text: a3 });
  }
  let w2 = false;
  function v2() {
    if ("loading" === document.readyState) return w2 || window.addEventListener("DOMContentLoaded", (() => {
      v2();
    }), false), void (w2 = true);
    document.querySelectorAll(p2.cssSelector).forEach(y2);
  }
  function N2(e2) {
    return e2 = (e2 || "").toLowerCase(), a2[e2] || a2[i2[e2]];
  }
  function k2(e2, { languageName: n2 }) {
    "string" == typeof e2 && (e2 = [e2]), e2.forEach(((e3) => {
      i2[e3.toLowerCase()] = n2;
    }));
  }
  function x2(e2) {
    const n2 = N2(e2);
    return n2 && !n2.disableAutodetect;
  }
  function O2(e2, n2) {
    const t3 = e2;
    r2.forEach(((e3) => {
      e3[t3] && e3[t3](n2);
    }));
  }
  Object.assign(t2, {
    highlight: h2,
    highlightAuto: E2,
    highlightAll: v2,
    highlightElement: y2,
    highlightBlock: (e2) => (q("10.7.0", "highlightBlock will be removed entirely in v12.0"), q("10.7.0", "Please use highlightElement now."), y2(e2)),
    configure: (e2) => {
      p2 = J(p2, e2);
    },
    initHighlighting: () => {
      v2(), q("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    },
    initHighlightingOnLoad: () => {
      v2(), q("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    },
    registerLanguage: (e2, n2) => {
      let i3 = null;
      try {
        i3 = n2(t2);
      } catch (n3) {
        if (P("Language definition for '{}' could not be registered.".replace("{}", e2)), !s2) throw n3;
        P(n3), i3 = c2;
      }
      i3.name || (i3.name = e2), a2[e2] = i3, i3.rawDefinition = n2.bind(null, t2), i3.aliases && k2(i3.aliases, {
        languageName: e2
      });
    },
    unregisterLanguage: (e2) => {
      delete a2[e2];
      for (const n2 of Object.keys(i2)) i2[n2] === e2 && delete i2[n2];
    },
    listLanguages: () => Object.keys(a2),
    getLanguage: N2,
    registerAliases: k2,
    autoDetection: x2,
    inherit: J,
    addPlugin: (e2) => {
      ((e3) => {
        e3["before:highlightBlock"] && !e3["before:highlightElement"] && (e3["before:highlightElement"] = (n2) => {
          e3["before:highlightBlock"](Object.assign({ block: n2.el }, n2));
        }), e3["after:highlightBlock"] && !e3["after:highlightElement"] && (e3["after:highlightElement"] = (n2) => {
          e3["after:highlightBlock"](Object.assign({ block: n2.el }, n2));
        });
      })(e2), r2.push(e2);
    },
    removePlugin: (e2) => {
      const n2 = r2.indexOf(e2);
      -1 !== n2 && r2.splice(n2, 1);
    }
  }), t2.debugMode = () => {
    s2 = false;
  }, t2.safeMode = () => {
    s2 = true;
  }, t2.versionString = "11.11.1", t2.regex = {
    concat: b,
    lookahead: d,
    either: m,
    optional: u,
    anyNumberOfTimes: g
  };
  for (const n2 in C) "object" == typeof C[n2] && e(C[n2]);
  return Object.assign(t2, C), t2;
}, ne = ee({});
ne.newInstance = () => ee({});
const te = (e2) => ({
  IMPORTANT: {
    scope: "meta",
    begin: "!important"
  },
  BLOCK_COMMENT: e2.C_BLOCK_COMMENT_MODE,
  HEXCOLOR: {
    scope: "number",
    begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
  },
  FUNCTION_DISPATCH: { className: "built_in", begin: /[\w-]+(?=\()/ },
  ATTRIBUTE_SELECTOR_MODE: {
    scope: "selector-attr",
    begin: /\[/,
    end: /\]/,
    illegal: "$",
    contains: [e2.APOS_STRING_MODE, e2.QUOTE_STRING_MODE]
  },
  CSS_NUMBER_MODE: {
    scope: "number",
    begin: e2.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
    relevance: 0
  },
  CSS_VARIABLE: { className: "attr", begin: /--[A-Za-z_][A-Za-z0-9_-]*/ }
}), ae = ["a", "abbr", "address", "article", "aside", "audio", "b", "blockquote", "body", "button", "canvas", "caption", "cite", "code", "dd", "del", "details", "dfn", "div", "dl", "dt", "em", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "mark", "menu", "nav", "object", "ol", "optgroup", "option", "p", "picture", "q", "quote", "samp", "section", "select", "source", "span", "strong", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "tr", "ul", "var", "video", "defs", "g", "marker", "mask", "pattern", "svg", "switch", "symbol", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feFlood", "feGaussianBlur", "feImage", "feMerge", "feMorphology", "feOffset", "feSpecularLighting", "feTile", "feTurbulence", "linearGradient", "radialGradient", "stop", "circle", "ellipse", "image", "line", "path", "polygon", "polyline", "rect", "text", "use", "textPath", "tspan", "foreignObject", "clipPath"], ie = ["any-hover", "any-pointer", "aspect-ratio", "color", "color-gamut", "color-index", "device-aspect-ratio", "device-height", "device-width", "display-mode", "forced-colors", "grid", "height", "hover", "inverted-colors", "monochrome", "orientation", "overflow-block", "overflow-inline", "pointer", "prefers-color-scheme", "prefers-contrast", "prefers-reduced-motion", "prefers-reduced-transparency", "resolution", "scan", "scripting", "update", "width", "min-width", "max-width", "min-height", "max-height"].sort().reverse(), re = ["active", "any-link", "blank", "checked", "current", "default", "defined", "dir", "disabled", "drop", "empty", "enabled", "first", "first-child", "first-of-type", "fullscreen", "future", "focus", "focus-visible", "focus-within", "has", "host", "host-context", "hover", "indeterminate", "in-range", "invalid", "is", "lang", "last-child", "last-of-type", "left", "link", "local-link", "not", "nth-child", "nth-col", "nth-last-child", "nth-last-col", "nth-last-of-type", "nth-of-type", "only-child", "only-of-type", "optional", "out-of-range", "past", "placeholder-shown", "read-only", "read-write", "required", "right", "root", "scope", "target", "target-within", "user-invalid", "valid", "visited", "where"].sort().reverse(), se = ["after", "backdrop", "before", "cue", "cue-region", "first-letter", "first-line", "grammar-error", "marker", "part", "placeholder", "selection", "slotted", "spelling-error"].sort().reverse(), oe = ["accent-color", "align-content", "align-items", "align-self", "alignment-baseline", "all", "anchor-name", "animation", "animation-composition", "animation-delay", "animation-direction", "animation-duration", "animation-fill-mode", "animation-iteration-count", "animation-name", "animation-play-state", "animation-range", "animation-range-end", "animation-range-start", "animation-timeline", "animation-timing-function", "appearance", "aspect-ratio", "backdrop-filter", "backface-visibility", "background", "background-attachment", "background-blend-mode", "background-clip", "background-color", "background-image", "background-origin", "background-position", "background-position-x", "background-position-y", "background-repeat", "background-size", "baseline-shift", "block-size", "border", "border-block", "border-block-color", "border-block-end", "border-block-end-color", "border-block-end-style", "border-block-end-width", "border-block-start", "border-block-start-color", "border-block-start-style", "border-block-start-width", "border-block-style", "border-block-width", "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-end-end-radius", "border-end-start-radius", "border-image", "border-image-outset", "border-image-repeat", "border-image-slice", "border-image-source", "border-image-width", "border-inline", "border-inline-color", "border-inline-end", "border-inline-end-color", "border-inline-end-style", "border-inline-end-width", "border-inline-start", "border-inline-start-color", "border-inline-start-style", "border-inline-start-width", "border-inline-style", "border-inline-width", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-radius", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-spacing", "border-start-end-radius", "border-start-start-radius", "border-style", "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-style", "border-top-width", "border-width", "bottom", "box-align", "box-decoration-break", "box-direction", "box-flex", "box-flex-group", "box-lines", "box-ordinal-group", "box-orient", "box-pack", "box-shadow", "box-sizing", "break-after", "break-before", "break-inside", "caption-side", "caret-color", "clear", "clip", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "color-scheme", "column-count", "column-fill", "column-gap", "column-rule", "column-rule-color", "column-rule-style", "column-rule-width", "column-span", "column-width", "columns", "contain", "contain-intrinsic-block-size", "contain-intrinsic-height", "contain-intrinsic-inline-size", "contain-intrinsic-size", "contain-intrinsic-width", "container", "container-name", "container-type", "content", "content-visibility", "counter-increment", "counter-reset", "counter-set", "cue", "cue-after", "cue-before", "cursor", "cx", "cy", "direction", "display", "dominant-baseline", "empty-cells", "enable-background", "field-sizing", "fill", "fill-opacity", "fill-rule", "filter", "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap", "float", "flood-color", "flood-opacity", "flow", "font", "font-display", "font-family", "font-feature-settings", "font-kerning", "font-language-override", "font-optical-sizing", "font-palette", "font-size", "font-size-adjust", "font-smooth", "font-smoothing", "font-stretch", "font-style", "font-synthesis", "font-synthesis-position", "font-synthesis-small-caps", "font-synthesis-style", "font-synthesis-weight", "font-variant", "font-variant-alternates", "font-variant-caps", "font-variant-east-asian", "font-variant-emoji", "font-variant-ligatures", "font-variant-numeric", "font-variant-position", "font-variation-settings", "font-weight", "forced-color-adjust", "gap", "glyph-orientation-horizontal", "glyph-orientation-vertical", "grid", "grid-area", "grid-auto-columns", "grid-auto-flow", "grid-auto-rows", "grid-column", "grid-column-end", "grid-column-start", "grid-gap", "grid-row", "grid-row-end", "grid-row-start", "grid-template", "grid-template-areas", "grid-template-columns", "grid-template-rows", "hanging-punctuation", "height", "hyphenate-character", "hyphenate-limit-chars", "hyphens", "icon", "image-orientation", "image-rendering", "image-resolution", "ime-mode", "initial-letter", "initial-letter-align", "inline-size", "inset", "inset-area", "inset-block", "inset-block-end", "inset-block-start", "inset-inline", "inset-inline-end", "inset-inline-start", "isolation", "justify-content", "justify-items", "justify-self", "kerning", "left", "letter-spacing", "lighting-color", "line-break", "line-height", "line-height-step", "list-style", "list-style-image", "list-style-position", "list-style-type", "margin", "margin-block", "margin-block-end", "margin-block-start", "margin-bottom", "margin-inline", "margin-inline-end", "margin-inline-start", "margin-left", "margin-right", "margin-top", "margin-trim", "marker", "marker-end", "marker-mid", "marker-start", "marks", "mask", "mask-border", "mask-border-mode", "mask-border-outset", "mask-border-repeat", "mask-border-slice", "mask-border-source", "mask-border-width", "mask-clip", "mask-composite", "mask-image", "mask-mode", "mask-origin", "mask-position", "mask-repeat", "mask-size", "mask-type", "masonry-auto-flow", "math-depth", "math-shift", "math-style", "max-block-size", "max-height", "max-inline-size", "max-width", "min-block-size", "min-height", "min-inline-size", "min-width", "mix-blend-mode", "nav-down", "nav-index", "nav-left", "nav-right", "nav-up", "none", "normal", "object-fit", "object-position", "offset", "offset-anchor", "offset-distance", "offset-path", "offset-position", "offset-rotate", "opacity", "order", "orphans", "outline", "outline-color", "outline-offset", "outline-style", "outline-width", "overflow", "overflow-anchor", "overflow-block", "overflow-clip-margin", "overflow-inline", "overflow-wrap", "overflow-x", "overflow-y", "overlay", "overscroll-behavior", "overscroll-behavior-block", "overscroll-behavior-inline", "overscroll-behavior-x", "overscroll-behavior-y", "padding", "padding-block", "padding-block-end", "padding-block-start", "padding-bottom", "padding-inline", "padding-inline-end", "padding-inline-start", "padding-left", "padding-right", "padding-top", "page", "page-break-after", "page-break-before", "page-break-inside", "paint-order", "pause", "pause-after", "pause-before", "perspective", "perspective-origin", "place-content", "place-items", "place-self", "pointer-events", "position", "position-anchor", "position-visibility", "print-color-adjust", "quotes", "r", "resize", "rest", "rest-after", "rest-before", "right", "rotate", "row-gap", "ruby-align", "ruby-position", "scale", "scroll-behavior", "scroll-margin", "scroll-margin-block", "scroll-margin-block-end", "scroll-margin-block-start", "scroll-margin-bottom", "scroll-margin-inline", "scroll-margin-inline-end", "scroll-margin-inline-start", "scroll-margin-left", "scroll-margin-right", "scroll-margin-top", "scroll-padding", "scroll-padding-block", "scroll-padding-block-end", "scroll-padding-block-start", "scroll-padding-bottom", "scroll-padding-inline", "scroll-padding-inline-end", "scroll-padding-inline-start", "scroll-padding-left", "scroll-padding-right", "scroll-padding-top", "scroll-snap-align", "scroll-snap-stop", "scroll-snap-type", "scroll-timeline", "scroll-timeline-axis", "scroll-timeline-name", "scrollbar-color", "scrollbar-gutter", "scrollbar-width", "shape-image-threshold", "shape-margin", "shape-outside", "shape-rendering", "speak", "speak-as", "src", "stop-color", "stop-opacity", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "tab-size", "table-layout", "text-align", "text-align-all", "text-align-last", "text-anchor", "text-combine-upright", "text-decoration", "text-decoration-color", "text-decoration-line", "text-decoration-skip", "text-decoration-skip-ink", "text-decoration-style", "text-decoration-thickness", "text-emphasis", "text-emphasis-color", "text-emphasis-position", "text-emphasis-style", "text-indent", "text-justify", "text-orientation", "text-overflow", "text-rendering", "text-shadow", "text-size-adjust", "text-transform", "text-underline-offset", "text-underline-position", "text-wrap", "text-wrap-mode", "text-wrap-style", "timeline-scope", "top", "touch-action", "transform", "transform-box", "transform-origin", "transform-style", "transition", "transition-behavior", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "translate", "unicode-bidi", "user-modify", "user-select", "vector-effect", "vertical-align", "view-timeline", "view-timeline-axis", "view-timeline-inset", "view-timeline-name", "view-transition-name", "visibility", "voice-balance", "voice-duration", "voice-family", "voice-pitch", "voice-range", "voice-rate", "voice-stress", "voice-volume", "white-space", "white-space-collapse", "widows", "width", "will-change", "word-break", "word-spacing", "word-wrap", "writing-mode", "x", "y", "z-index", "zoom"].sort().reverse(), le = re.concat(se).sort().reverse();
var ce = "[0-9](_*[0-9])*", de = `\\.(${ce})`, ge = "[0-9a-fA-F](_*[0-9a-fA-F])*", ue = {
  className: "number",
  variants: [{
    begin: `(\\b(${ce})((${de})|\\.)?|(${de}))[eE][+-]?(${ce})[fFdD]?\\b`
  }, {
    begin: `\\b(${ce})((${de})[fFdD]?\\b|\\.([fFdD]\\b)?)`
  }, {
    begin: `(${de})[fFdD]?\\b`
  }, { begin: `\\b(${ce})[fFdD]\\b` }, {
    begin: `\\b0[xX]((${ge})\\.?|(${ge})?\\.(${ge}))[pP][+-]?(${ce})[fFdD]?\\b`
  }, {
    begin: "\\b(0|[1-9](_*[0-9])*)[lL]?\\b"
  }, { begin: `\\b0[xX](${ge})[lL]?\\b` }, {
    begin: "\\b0(_*[0-7])*[lL]?\\b"
  }, { begin: "\\b0[bB][01](_*[01])*[lL]?\\b" }],
  relevance: 0
};
function be(e2, n2, t2) {
  return -1 === t2 ? "" : e2.replace(n2, ((a2) => be(e2, n2, t2 - 1)));
}
const me = "[A-Za-z$_][0-9A-Za-z$_]*", pe = ["as", "in", "of", "if", "for", "while", "finally", "var", "new", "function", "do", "return", "void", "else", "break", "catch", "instanceof", "with", "throw", "case", "default", "try", "switch", "continue", "typeof", "delete", "let", "yield", "const", "class", "debugger", "async", "await", "static", "import", "from", "export", "extends", "using"], _e = ["true", "false", "null", "undefined", "NaN", "Infinity"], he = ["Object", "Function", "Boolean", "Symbol", "Math", "Date", "Number", "BigInt", "String", "RegExp", "Array", "Float32Array", "Float64Array", "Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array", "Int32Array", "Uint16Array", "Uint32Array", "BigInt64Array", "BigUint64Array", "Set", "Map", "WeakSet", "WeakMap", "ArrayBuffer", "SharedArrayBuffer", "Atomics", "DataView", "JSON", "Promise", "Generator", "GeneratorFunction", "AsyncFunction", "Reflect", "Proxy", "Intl", "WebAssembly"], fe = ["Error", "EvalError", "InternalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"], Ee = ["setInterval", "setTimeout", "clearInterval", "clearTimeout", "require", "exports", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "unescape"], ye = ["arguments", "this", "super", "console", "window", "document", "localStorage", "sessionStorage", "module", "global"], we = [].concat(Ee, he, fe);
function ve(e2) {
  const n2 = e2.regex, t2 = me, a2 = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    isTrulyOpeningTag: (e3, n3) => {
      const t3 = e3[0].length + e3.index, a3 = e3.input[t3];
      if ("<" === a3 || "," === a3) return void n3.ignoreMatch();
      let i3;
      ">" === a3 && (((e4, { after: n4 }) => {
        const t4 = "</" + e4[0].slice(1);
        return -1 !== e4.input.indexOf(t4, n4);
      })(e3, { after: t3 }) || n3.ignoreMatch());
      const r3 = e3.input.substring(t3);
      ((i3 = r3.match(/^\s*=/)) || (i3 = r3.match(/^\s+extends\s+/)) && 0 === i3.index) && n3.ignoreMatch();
    }
  }, i2 = {
    $pattern: me,
    keyword: pe,
    literal: _e,
    built_in: we,
    "variable.language": ye
  }, r2 = "[0-9](_?[0-9])*", s2 = `\\.(${r2})`, o2 = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", l2 = {
    className: "number",
    variants: [{
      begin: `(\\b(${o2})((${s2})|\\.)?|(${s2}))[eE][+-]?(${r2})\\b`
    }, {
      begin: `\\b(${o2})\\b((${s2})\\b|\\.)?|(${s2})\\b`
    }, {
      begin: "\\b(0|[1-9](_?[0-9])*)n\\b"
    }, {
      begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"
    }, {
      begin: "\\b0[bB][0-1](_?[0-1])*n?\\b"
    }, { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" }, {
      begin: "\\b0[0-7]+n?\\b"
    }],
    relevance: 0
  }, c2 = {
    className: "subst",
    begin: "\\$\\{",
    end: "\\}",
    keywords: i2,
    contains: []
  }, d2 = { begin: ".?html`", end: "", starts: {
    end: "`",
    returnEnd: false,
    contains: [e2.BACKSLASH_ESCAPE, c2],
    subLanguage: "xml"
  } }, g2 = {
    begin: ".?css`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [e2.BACKSLASH_ESCAPE, c2],
      subLanguage: "css"
    }
  }, u2 = {
    begin: ".?gql`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [e2.BACKSLASH_ESCAPE, c2],
      subLanguage: "graphql"
    }
  }, b2 = {
    className: "string",
    begin: "`",
    end: "`",
    contains: [e2.BACKSLASH_ESCAPE, c2]
  }, m2 = {
    className: "comment",
    variants: [e2.COMMENT(/\/\*\*(?!\/)/, "\\*/", {
      relevance: 0,
      contains: [{
        begin: "(?=@[A-Za-z]+)",
        relevance: 0,
        contains: [{
          className: "doctag",
          begin: "@[A-Za-z]+"
        }, {
          className: "type",
          begin: "\\{",
          end: "\\}",
          excludeEnd: true,
          excludeBegin: true,
          relevance: 0
        }, {
          className: "variable",
          begin: t2 + "(?=\\s*(-)|$)",
          endsParent: true,
          relevance: 0
        }, { begin: /(?=[^\n])\s/, relevance: 0 }]
      }]
    }), e2.C_BLOCK_COMMENT_MODE, e2.C_LINE_COMMENT_MODE]
  }, p2 = [e2.APOS_STRING_MODE, e2.QUOTE_STRING_MODE, d2, g2, u2, b2, { match: /\$\d+/ }, l2];
  c2.contains = p2.concat({
    begin: /\{/,
    end: /\}/,
    keywords: i2,
    contains: ["self"].concat(p2)
  });
  const _2 = [].concat(m2, c2.contains), h2 = _2.concat([{
    begin: /(\s*)\(/,
    end: /\)/,
    keywords: i2,
    contains: ["self"].concat(_2)
  }]), f2 = {
    className: "params",
    begin: /(\s*)\(/,
    end: /\)/,
    excludeBegin: true,
    excludeEnd: true,
    keywords: i2,
    contains: h2
  }, E2 = { variants: [{
    match: [/class/, /\s+/, t2, /\s+/, /extends/, /\s+/, n2.concat(t2, "(", n2.concat(/\./, t2), ")*")],
    scope: { 1: "keyword", 3: "title.class", 5: "keyword", 7: "title.class.inherited" }
  }, {
    match: [/class/, /\s+/, t2],
    scope: { 1: "keyword", 3: "title.class" }
  }] }, y2 = {
    relevance: 0,
    match: n2.either(/\bJSON/, /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/, /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/, /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),
    className: "title.class",
    keywords: { _: [...he, ...fe] }
  }, w2 = {
    variants: [{
      match: [/function/, /\s+/, t2, /(?=\s*\()/]
    }, { match: [/function/, /\s*(?=\()/] }],
    className: { 1: "keyword", 3: "title.function" },
    label: "func.def",
    contains: [f2],
    illegal: /%/
  }, v2 = {
    match: n2.concat(/\b/, (N2 = [...Ee, "super", "import"].map(((e3) => e3 + "\\s*\\(")), n2.concat("(?!", N2.join("|"), ")")), t2, n2.lookahead(/\s*\(/)),
    className: "title.function",
    relevance: 0
  };
  var N2;
  const k2 = {
    begin: n2.concat(/\./, n2.lookahead(n2.concat(t2, /(?![0-9A-Za-z$_(])/))),
    end: t2,
    excludeBegin: true,
    keywords: "prototype",
    className: "property",
    relevance: 0
  }, x2 = {
    match: [/get|set/, /\s+/, t2, /(?=\()/],
    className: { 1: "keyword", 3: "title.function" },
    contains: [{ begin: /\(\)/ }, f2]
  }, O2 = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + e2.UNDERSCORE_IDENT_RE + ")\\s*=>", M2 = {
    match: [/const|var|let/, /\s+/, t2, /\s*/, /=\s*/, /(async\s*)?/, n2.lookahead(O2)],
    keywords: "async",
    className: { 1: "keyword", 3: "title.function" },
    contains: [f2]
  };
  return {
    name: "JavaScript",
    aliases: ["js", "jsx", "mjs", "cjs"],
    keywords: i2,
    exports: {
      PARAMS_CONTAINS: h2,
      CLASS_REFERENCE: y2
    },
    illegal: /#(?![$_A-z])/,
    contains: [e2.SHEBANG({ label: "shebang", binary: "node", relevance: 5 }), {
      label: "use_strict",
      className: "meta",
      relevance: 10,
      begin: /^\s*['"]use (strict|asm)['"]/
    }, e2.APOS_STRING_MODE, e2.QUOTE_STRING_MODE, d2, g2, u2, b2, m2, { match: /\$\d+/ }, l2, y2, {
      scope: "attr",
      match: t2 + n2.lookahead(":"),
      relevance: 0
    }, M2, {
      begin: "(" + e2.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
      keywords: "return throw case",
      relevance: 0,
      contains: [m2, e2.REGEXP_MODE, {
        className: "function",
        begin: O2,
        returnBegin: true,
        end: "\\s*=>",
        contains: [{
          className: "params",
          variants: [{ begin: e2.UNDERSCORE_IDENT_RE, relevance: 0 }, {
            className: null,
            begin: /\(\s*\)/,
            skip: true
          }, {
            begin: /(\s*)\(/,
            end: /\)/,
            excludeBegin: true,
            excludeEnd: true,
            keywords: i2,
            contains: h2
          }]
        }]
      }, {
        begin: /,/,
        relevance: 0
      }, { match: /\s+/, relevance: 0 }, { variants: [{ begin: "<>", end: "</>" }, {
        match: /<[A-Za-z0-9\\._:-]+\s*\/>/
      }, {
        begin: a2.begin,
        "on:begin": a2.isTrulyOpeningTag,
        end: a2.end
      }], subLanguage: "xml", contains: [{
        begin: a2.begin,
        end: a2.end,
        skip: true,
        contains: ["self"]
      }] }]
    }, w2, {
      beginKeywords: "while if switch catch for"
    }, {
      begin: "\\b(?!function)" + e2.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
      returnBegin: true,
      label: "func.def",
      contains: [f2, e2.inherit(e2.TITLE_MODE, {
        begin: t2,
        className: "title.function"
      })]
    }, { match: /\.\.\./, relevance: 0 }, k2, {
      match: "\\$" + t2,
      relevance: 0
    }, {
      match: [/\bconstructor(?=\s*\()/],
      className: { 1: "title.function" },
      contains: [f2]
    }, v2, {
      relevance: 0,
      match: /\b[A-Z][A-Z_0-9]+\b/,
      className: "variable.constant"
    }, E2, x2, { match: /\$[(.]/ }]
  };
}
const Ne = (e2) => b(/\b/, e2, /\w$/.test(e2) ? /\b/ : /\B/), ke = ["Protocol", "Type"].map(Ne), xe = ["init", "self"].map(Ne), Oe = ["Any", "Self"], Me = ["actor", "any", "associatedtype", "async", "await", /as\?/, /as!/, "as", "borrowing", "break", "case", "catch", "class", "consume", "consuming", "continue", "convenience", "copy", "default", "defer", "deinit", "didSet", "distributed", "do", "dynamic", "each", "else", "enum", "extension", "fallthrough", /fileprivate\(set\)/, "fileprivate", "final", "for", "func", "get", "guard", "if", "import", "indirect", "infix", /init\?/, /init!/, "inout", /internal\(set\)/, "internal", "in", "is", "isolated", "nonisolated", "lazy", "let", "macro", "mutating", "nonmutating", /open\(set\)/, "open", "operator", "optional", "override", "package", "postfix", "precedencegroup", "prefix", /private\(set\)/, "private", "protocol", /public\(set\)/, "public", "repeat", "required", "rethrows", "return", "set", "some", "static", "struct", "subscript", "super", "switch", "throws", "throw", /try\?/, /try!/, "try", "typealias", /unowned\(safe\)/, /unowned\(unsafe\)/, "unowned", "var", "weak", "where", "while", "willSet"], Ae = ["false", "nil", "true"], Se = ["assignment", "associativity", "higherThan", "left", "lowerThan", "none", "right"], Ce = ["#colorLiteral", "#column", "#dsohandle", "#else", "#elseif", "#endif", "#error", "#file", "#fileID", "#fileLiteral", "#filePath", "#function", "#if", "#imageLiteral", "#keyPath", "#line", "#selector", "#sourceLocation", "#warning"], Te = ["abs", "all", "any", "assert", "assertionFailure", "debugPrint", "dump", "fatalError", "getVaList", "isKnownUniquelyReferenced", "max", "min", "numericCast", "pointwiseMax", "pointwiseMin", "precondition", "preconditionFailure", "print", "readLine", "repeatElement", "sequence", "stride", "swap", "swift_unboxFromSwiftValueWithType", "transcode", "type", "unsafeBitCast", "unsafeDowncast", "withExtendedLifetime", "withUnsafeMutablePointer", "withUnsafePointer", "withVaList", "withoutActuallyEscaping", "zip"], Re = m(/[/=\-+!*%<>&|^~?]/, /[\u00A1-\u00A7]/, /[\u00A9\u00AB]/, /[\u00AC\u00AE]/, /[\u00B0\u00B1]/, /[\u00B6\u00BB\u00BF\u00D7\u00F7]/, /[\u2016-\u2017]/, /[\u2020-\u2027]/, /[\u2030-\u203E]/, /[\u2041-\u2053]/, /[\u2055-\u205E]/, /[\u2190-\u23FF]/, /[\u2500-\u2775]/, /[\u2794-\u2BFF]/, /[\u2E00-\u2E7F]/, /[\u3001-\u3003]/, /[\u3008-\u3020]/, /[\u3030]/), De = m(Re, /[\u0300-\u036F]/, /[\u1DC0-\u1DFF]/, /[\u20D0-\u20FF]/, /[\uFE00-\uFE0F]/, /[\uFE20-\uFE2F]/), Ie = b(Re, De, "*"), Le = m(/[a-zA-Z_]/, /[\u00A8\u00AA\u00AD\u00AF\u00B2-\u00B5\u00B7-\u00BA]/, /[\u00BC-\u00BE\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]/, /[\u0100-\u02FF\u0370-\u167F\u1681-\u180D\u180F-\u1DBF]/, /[\u1E00-\u1FFF]/, /[\u200B-\u200D\u202A-\u202E\u203F-\u2040\u2054\u2060-\u206F]/, /[\u2070-\u20CF\u2100-\u218F\u2460-\u24FF\u2776-\u2793]/, /[\u2C00-\u2DFF\u2E80-\u2FFF]/, /[\u3004-\u3007\u3021-\u302F\u3031-\u303F\u3040-\uD7FF]/, /[\uF900-\uFD3D\uFD40-\uFDCF\uFDF0-\uFE1F\uFE30-\uFE44]/, /[\uFE47-\uFEFE\uFF00-\uFFFD]/), Be = m(Le, /\d/, /[\u0300-\u036F\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]/), $e = b(Le, Be, "*"), Fe = b(/[A-Z]/, Be, "*"), ze = ["attached", "autoclosure", b(/convention\(/, m("swift", "block", "c"), /\)/), "discardableResult", "dynamicCallable", "dynamicMemberLookup", "escaping", "freestanding", "frozen", "GKInspectable", "IBAction", "IBDesignable", "IBInspectable", "IBOutlet", "IBSegueAction", "inlinable", "main", "nonobjc", "NSApplicationMain", "NSCopying", "NSManaged", b(/objc\(/, $e, /\)/), "objc", "objcMembers", "propertyWrapper", "requires_stored_property_inits", "resultBuilder", "Sendable", "testable", "UIApplicationMain", "unchecked", "unknown", "usableFromInline", "warn_unqualified_access"], je = ["iOS", "iOSApplicationExtension", "macOS", "macOSApplicationExtension", "macCatalyst", "macCatalystApplicationExtension", "watchOS", "watchOSApplicationExtension", "tvOS", "tvOSApplicationExtension", "swift"];
var Ue = Object.freeze({
  __proto__: null,
  grmr_bash: (e2) => {
    const n2 = e2.regex, t2 = {}, a2 = {
      begin: /\$\{/,
      end: /\}/,
      contains: ["self", { begin: /:-/, contains: [t2] }]
    };
    Object.assign(t2, { className: "variable", variants: [{
      begin: n2.concat(/\$[\w\d#@][\w\d_]*/, "(?![\\w\\d])(?![$])")
    }, a2] });
    const i2 = {
      className: "subst",
      begin: /\$\(/,
      end: /\)/,
      contains: [e2.BACKSLASH_ESCAPE]
    }, r2 = e2.inherit(e2.COMMENT(), { match: [/(^|\s)/, /#.*$/], scope: { 2: "comment" } }), s2 = {
      begin: /<<-?\s*(?=\w+)/,
      starts: { contains: [e2.END_SAME_AS_BEGIN({
        begin: /(\w+)/,
        end: /(\w+)/,
        className: "string"
      })] }
    }, o2 = {
      className: "string",
      begin: /"/,
      end: /"/,
      contains: [e2.BACKSLASH_ESCAPE, t2, i2]
    };
    i2.contains.push(o2);
    const l2 = {
      begin: /\$?\(\(/,
      end: /\)\)/,
      contains: [{ begin: /\d+#[0-9a-f]+/, className: "number" }, e2.NUMBER_MODE, t2]
    }, c2 = e2.SHEBANG({
      binary: "(fish|bash|zsh|sh|csh|ksh|tcsh|dash|scsh)",
      relevance: 10
    }), d2 = {
      className: "function",
      begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
      returnBegin: true,
      contains: [e2.inherit(e2.TITLE_MODE, { begin: /\w[\w\d_]*/ })],
      relevance: 0
    };
    return {
      name: "Bash",
      aliases: ["sh", "zsh"],
      keywords: {
        $pattern: /\b[a-z][a-z0-9._-]+\b/,
        keyword: ["if", "then", "else", "elif", "fi", "time", "for", "while", "until", "in", "do", "done", "case", "esac", "coproc", "function", "select"],
        literal: ["true", "false"],
        built_in: ["break", "cd", "continue", "eval", "exec", "exit", "export", "getopts", "hash", "pwd", "readonly", "return", "shift", "test", "times", "trap", "umask", "unset", "alias", "bind", "builtin", "caller", "command", "declare", "echo", "enable", "help", "let", "local", "logout", "mapfile", "printf", "read", "readarray", "source", "sudo", "type", "typeset", "ulimit", "unalias", "set", "shopt", "autoload", "bg", "bindkey", "bye", "cap", "chdir", "clone", "comparguments", "compcall", "compctl", "compdescribe", "compfiles", "compgroups", "compquote", "comptags", "comptry", "compvalues", "dirs", "disable", "disown", "echotc", "echoti", "emulate", "fc", "fg", "float", "functions", "getcap", "getln", "history", "integer", "jobs", "kill", "limit", "log", "noglob", "popd", "print", "pushd", "pushln", "rehash", "sched", "setcap", "setopt", "stat", "suspend", "ttyctl", "unfunction", "unhash", "unlimit", "unsetopt", "vared", "wait", "whence", "where", "which", "zcompile", "zformat", "zftp", "zle", "zmodload", "zparseopts", "zprof", "zpty", "zregexparse", "zsocket", "zstyle", "ztcp", "chcon", "chgrp", "chown", "chmod", "cp", "dd", "df", "dir", "dircolors", "ln", "ls", "mkdir", "mkfifo", "mknod", "mktemp", "mv", "realpath", "rm", "rmdir", "shred", "sync", "touch", "truncate", "vdir", "b2sum", "base32", "base64", "cat", "cksum", "comm", "csplit", "cut", "expand", "fmt", "fold", "head", "join", "md5sum", "nl", "numfmt", "od", "paste", "ptx", "pr", "sha1sum", "sha224sum", "sha256sum", "sha384sum", "sha512sum", "shuf", "sort", "split", "sum", "tac", "tail", "tr", "tsort", "unexpand", "uniq", "wc", "arch", "basename", "chroot", "date", "dirname", "du", "echo", "env", "expr", "factor", "groups", "hostid", "id", "link", "logname", "nice", "nohup", "nproc", "pathchk", "pinky", "printenv", "printf", "pwd", "readlink", "runcon", "seq", "sleep", "stat", "stdbuf", "stty", "tee", "test", "timeout", "tty", "uname", "unlink", "uptime", "users", "who", "whoami", "yes"]
      },
      contains: [c2, e2.SHEBANG(), d2, l2, r2, s2, { match: /(\/[a-z._-]+)+/ }, o2, { match: /\\"/ }, {
        className: "string",
        begin: /'/,
        end: /'/
      }, { match: /\\'/ }, t2]
    };
  },
  grmr_c: (e2) => {
    const n2 = e2.regex, t2 = e2.COMMENT("//", "$", {
      contains: [{ begin: /\\\n/ }]
    }), a2 = "decltype\\(auto\\)", i2 = "[a-zA-Z_]\\w*::", r2 = "(" + a2 + "|" + n2.optional(i2) + "[a-zA-Z_]\\w*" + n2.optional("<[^<>]+>") + ")", s2 = {
      className: "type",
      variants: [{ begin: "\\b[a-z\\d_]*_t\\b" }, {
        match: /\batomic_[a-z]{3,6}\b/
      }]
    }, o2 = { className: "string", variants: [{
      begin: '(u8?|U|L)?"',
      end: '"',
      illegal: "\\n",
      contains: [e2.BACKSLASH_ESCAPE]
    }, {
      begin: "(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
      end: "'",
      illegal: "."
    }, e2.END_SAME_AS_BEGIN({
      begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
      end: /\)([^()\\ ]{0,16})"/
    })] }, l2 = {
      className: "number",
      variants: [{ match: /\b(0b[01']+)/ }, {
        match: /(-?)\b([\d']+(\.[\d']*)?|\.[\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)/
      }, {
        match: /(-?)\b(0[xX][a-fA-F0-9]+(?:'[a-fA-F0-9]+)*(?:\.[a-fA-F0-9]*(?:'[a-fA-F0-9]*)*)?(?:[pP][-+]?[0-9]+)?(l|L)?(u|U)?)/
      }, { match: /(-?)\b\d+(?:'\d+)*(?:\.\d*(?:'\d*)*)?(?:[eE][-+]?\d+)?/ }],
      relevance: 0
    }, c2 = { className: "meta", begin: /#\s*[a-z]+\b/, end: /$/, keywords: {
      keyword: "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef elifdef elifndef include"
    }, contains: [{ begin: /\\\n/, relevance: 0 }, e2.inherit(o2, { className: "string" }), {
      className: "string",
      begin: /<.*?>/
    }, t2, e2.C_BLOCK_COMMENT_MODE] }, d2 = {
      className: "title",
      begin: n2.optional(i2) + e2.IDENT_RE,
      relevance: 0
    }, g2 = n2.optional(i2) + e2.IDENT_RE + "\\s*\\(", u2 = {
      keyword: ["asm", "auto", "break", "case", "continue", "default", "do", "else", "enum", "extern", "for", "fortran", "goto", "if", "inline", "register", "restrict", "return", "sizeof", "typeof", "typeof_unqual", "struct", "switch", "typedef", "union", "volatile", "while", "_Alignas", "_Alignof", "_Atomic", "_Generic", "_Noreturn", "_Static_assert", "_Thread_local", "alignas", "alignof", "noreturn", "static_assert", "thread_local", "_Pragma"],
      type: ["float", "double", "signed", "unsigned", "int", "short", "long", "char", "void", "_Bool", "_BitInt", "_Complex", "_Imaginary", "_Decimal32", "_Decimal64", "_Decimal96", "_Decimal128", "_Decimal64x", "_Decimal128x", "_Float16", "_Float32", "_Float64", "_Float128", "_Float32x", "_Float64x", "_Float128x", "const", "static", "constexpr", "complex", "bool", "imaginary"],
      literal: "true false NULL",
      built_in: "std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr"
    }, b2 = [c2, s2, t2, e2.C_BLOCK_COMMENT_MODE, l2, o2], m2 = {
      variants: [{ begin: /=/, end: /;/ }, {
        begin: /\(/,
        end: /\)/
      }, { beginKeywords: "new throw return else", end: /;/ }],
      keywords: u2,
      contains: b2.concat([{
        begin: /\(/,
        end: /\)/,
        keywords: u2,
        contains: b2.concat(["self"]),
        relevance: 0
      }]),
      relevance: 0
    }, p2 = {
      begin: "(" + r2 + "[\\*&\\s]+)+" + g2,
      returnBegin: true,
      end: /[{;=]/,
      excludeEnd: true,
      keywords: u2,
      illegal: /[^\w\s\*&:<>.]/,
      contains: [{ begin: a2, keywords: u2, relevance: 0 }, {
        begin: g2,
        returnBegin: true,
        contains: [e2.inherit(d2, { className: "title.function" })],
        relevance: 0
      }, { relevance: 0, match: /,/ }, {
        className: "params",
        begin: /\(/,
        end: /\)/,
        keywords: u2,
        relevance: 0,
        contains: [t2, e2.C_BLOCK_COMMENT_MODE, o2, l2, s2, {
          begin: /\(/,
          end: /\)/,
          keywords: u2,
          relevance: 0,
          contains: ["self", t2, e2.C_BLOCK_COMMENT_MODE, o2, l2, s2]
        }]
      }, s2, t2, e2.C_BLOCK_COMMENT_MODE, c2]
    };
    return {
      name: "C",
      aliases: ["h"],
      keywords: u2,
      disableAutodetect: true,
      illegal: "</",
      contains: [].concat(m2, p2, b2, [c2, {
        begin: e2.IDENT_RE + "::",
        keywords: u2
      }, {
        className: "class",
        beginKeywords: "enum class struct union",
        end: /[{;:<>=]/,
        contains: [{
          beginKeywords: "final class struct"
        }, e2.TITLE_MODE]
      }]),
      exports: {
        preprocessor: c2,
        strings: o2,
        keywords: u2
      }
    };
  },
  grmr_cpp: (e2) => {
    const n2 = e2.regex, t2 = e2.COMMENT("//", "$", {
      contains: [{ begin: /\\\n/ }]
    }), a2 = "decltype\\(auto\\)", i2 = "[a-zA-Z_]\\w*::", r2 = "(?!struct)(" + a2 + "|" + n2.optional(i2) + "[a-zA-Z_]\\w*" + n2.optional("<[^<>]+>") + ")", s2 = {
      className: "type",
      begin: "\\b[a-z\\d_]*_t\\b"
    }, o2 = { className: "string", variants: [{
      begin: '(u8?|U|L)?"',
      end: '"',
      illegal: "\\n",
      contains: [e2.BACKSLASH_ESCAPE]
    }, {
      begin: "(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
      end: "'",
      illegal: "."
    }, e2.END_SAME_AS_BEGIN({
      begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
      end: /\)([^()\\ ]{0,16})"/
    })] }, l2 = {
      className: "number",
      variants: [{
        begin: "[+-]?(?:(?:[0-9](?:'?[0-9])*\\.(?:[0-9](?:'?[0-9])*)?|\\.[0-9](?:'?[0-9])*)(?:[Ee][+-]?[0-9](?:'?[0-9])*)?|[0-9](?:'?[0-9])*[Ee][+-]?[0-9](?:'?[0-9])*|0[Xx](?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*(?:\\.(?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)?)?|\\.[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)[Pp][+-]?[0-9](?:'?[0-9])*)(?:[Ff](?:16|32|64|128)?|(BF|bf)16|[Ll]|)"
      }, {
        begin: "[+-]?\\b(?:0[Bb][01](?:'?[01])*|0[Xx][0-9A-Fa-f](?:'?[0-9A-Fa-f])*|0(?:'?[0-7])*|[1-9](?:'?[0-9])*)(?:[Uu](?:LL?|ll?)|[Uu][Zz]?|(?:LL?|ll?)[Uu]?|[Zz][Uu]|)"
      }],
      relevance: 0
    }, c2 = { className: "meta", begin: /#\s*[a-z]+\b/, end: /$/, keywords: {
      keyword: "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
    }, contains: [{ begin: /\\\n/, relevance: 0 }, e2.inherit(o2, { className: "string" }), {
      className: "string",
      begin: /<.*?>/
    }, t2, e2.C_BLOCK_COMMENT_MODE] }, d2 = {
      className: "title",
      begin: n2.optional(i2) + e2.IDENT_RE,
      relevance: 0
    }, g2 = n2.optional(i2) + e2.IDENT_RE + "\\s*\\(", u2 = {
      type: ["bool", "char", "char16_t", "char32_t", "char8_t", "double", "float", "int", "long", "short", "void", "wchar_t", "unsigned", "signed", "const", "static"],
      keyword: ["alignas", "alignof", "and", "and_eq", "asm", "atomic_cancel", "atomic_commit", "atomic_noexcept", "auto", "bitand", "bitor", "break", "case", "catch", "class", "co_await", "co_return", "co_yield", "compl", "concept", "const_cast|10", "consteval", "constexpr", "constinit", "continue", "decltype", "default", "delete", "do", "dynamic_cast|10", "else", "enum", "explicit", "export", "extern", "false", "final", "for", "friend", "goto", "if", "import", "inline", "module", "mutable", "namespace", "new", "noexcept", "not", "not_eq", "nullptr", "operator", "or", "or_eq", "override", "private", "protected", "public", "reflexpr", "register", "reinterpret_cast|10", "requires", "return", "sizeof", "static_assert", "static_cast|10", "struct", "switch", "synchronized", "template", "this", "thread_local", "throw", "transaction_safe", "transaction_safe_dynamic", "true", "try", "typedef", "typeid", "typename", "union", "using", "virtual", "volatile", "while", "xor", "xor_eq"],
      literal: ["NULL", "false", "nullopt", "nullptr", "true"],
      built_in: ["_Pragma"],
      _type_hints: ["any", "auto_ptr", "barrier", "binary_semaphore", "bitset", "complex", "condition_variable", "condition_variable_any", "counting_semaphore", "deque", "false_type", "flat_map", "flat_set", "future", "imaginary", "initializer_list", "istringstream", "jthread", "latch", "lock_guard", "multimap", "multiset", "mutex", "optional", "ostringstream", "packaged_task", "pair", "promise", "priority_queue", "queue", "recursive_mutex", "recursive_timed_mutex", "scoped_lock", "set", "shared_future", "shared_lock", "shared_mutex", "shared_timed_mutex", "shared_ptr", "stack", "string_view", "stringstream", "timed_mutex", "thread", "true_type", "tuple", "unique_lock", "unique_ptr", "unordered_map", "unordered_multimap", "unordered_multiset", "unordered_set", "variant", "vector", "weak_ptr", "wstring", "wstring_view"]
    }, b2 = {
      className: "function.dispatch",
      relevance: 0,
      keywords: {
        _hint: ["abort", "abs", "acos", "apply", "as_const", "asin", "atan", "atan2", "calloc", "ceil", "cerr", "cin", "clog", "cos", "cosh", "cout", "declval", "endl", "exchange", "exit", "exp", "fabs", "floor", "fmod", "forward", "fprintf", "fputs", "free", "frexp", "fscanf", "future", "invoke", "isalnum", "isalpha", "iscntrl", "isdigit", "isgraph", "islower", "isprint", "ispunct", "isspace", "isupper", "isxdigit", "labs", "launder", "ldexp", "log", "log10", "make_pair", "make_shared", "make_shared_for_overwrite", "make_tuple", "make_unique", "malloc", "memchr", "memcmp", "memcpy", "memset", "modf", "move", "pow", "printf", "putchar", "puts", "realloc", "scanf", "sin", "sinh", "snprintf", "sprintf", "sqrt", "sscanf", "std", "stderr", "stdin", "stdout", "strcat", "strchr", "strcmp", "strcpy", "strcspn", "strlen", "strncat", "strncmp", "strncpy", "strpbrk", "strrchr", "strspn", "strstr", "swap", "tan", "tanh", "terminate", "to_underlying", "tolower", "toupper", "vfprintf", "visit", "vprintf", "vsprintf"]
      },
      begin: n2.concat(/\b/, /(?!decltype)/, /(?!if)/, /(?!for)/, /(?!switch)/, /(?!while)/, e2.IDENT_RE, n2.lookahead(/(<[^<>]+>|)\s*\(/))
    }, m2 = [b2, c2, s2, t2, e2.C_BLOCK_COMMENT_MODE, l2, o2], p2 = {
      variants: [{ begin: /=/, end: /;/ }, {
        begin: /\(/,
        end: /\)/
      }, { beginKeywords: "new throw return else", end: /;/ }],
      keywords: u2,
      contains: m2.concat([{
        begin: /\(/,
        end: /\)/,
        keywords: u2,
        contains: m2.concat(["self"]),
        relevance: 0
      }]),
      relevance: 0
    }, _2 = {
      className: "function",
      begin: "(" + r2 + "[\\*&\\s]+)+" + g2,
      returnBegin: true,
      end: /[{;=]/,
      excludeEnd: true,
      keywords: u2,
      illegal: /[^\w\s\*&:<>.]/,
      contains: [{ begin: a2, keywords: u2, relevance: 0 }, {
        begin: g2,
        returnBegin: true,
        contains: [d2],
        relevance: 0
      }, { begin: /::/, relevance: 0 }, {
        begin: /:/,
        endsWithParent: true,
        contains: [o2, l2]
      }, { relevance: 0, match: /,/ }, {
        className: "params",
        begin: /\(/,
        end: /\)/,
        keywords: u2,
        relevance: 0,
        contains: [t2, e2.C_BLOCK_COMMENT_MODE, o2, l2, s2, {
          begin: /\(/,
          end: /\)/,
          keywords: u2,
          relevance: 0,
          contains: ["self", t2, e2.C_BLOCK_COMMENT_MODE, o2, l2, s2]
        }]
      }, s2, t2, e2.C_BLOCK_COMMENT_MODE, c2]
    };
    return {
      name: "C++",
      aliases: ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"],
      keywords: u2,
      illegal: "</",
      classNameAliases: { "function.dispatch": "built_in" },
      contains: [].concat(p2, _2, b2, m2, [c2, {
        begin: "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array|tuple|optional|variant|function|flat_map|flat_set)\\s*<(?!<)",
        end: ">",
        keywords: u2,
        contains: ["self", s2]
      }, { begin: e2.IDENT_RE + "::", keywords: u2 }, {
        match: [/\b(?:enum(?:\s+(?:class|struct))?|class|struct|union)/, /\s+/, /\w+/],
        className: { 1: "keyword", 3: "title.class" }
      }])
    };
  },
  grmr_csharp: (e2) => {
    const n2 = {
      keyword: ["abstract", "as", "base", "break", "case", "catch", "class", "const", "continue", "do", "else", "event", "explicit", "extern", "finally", "fixed", "for", "foreach", "goto", "if", "implicit", "in", "interface", "internal", "is", "lock", "namespace", "new", "operator", "out", "override", "params", "private", "protected", "public", "readonly", "record", "ref", "return", "scoped", "sealed", "sizeof", "stackalloc", "static", "struct", "switch", "this", "throw", "try", "typeof", "unchecked", "unsafe", "using", "virtual", "void", "volatile", "while"].concat(["add", "alias", "and", "ascending", "args", "async", "await", "by", "descending", "dynamic", "equals", "file", "from", "get", "global", "group", "init", "into", "join", "let", "nameof", "not", "notnull", "on", "or", "orderby", "partial", "record", "remove", "required", "scoped", "select", "set", "unmanaged", "value|0", "var", "when", "where", "with", "yield"]),
      built_in: ["bool", "byte", "char", "decimal", "delegate", "double", "dynamic", "enum", "float", "int", "long", "nint", "nuint", "object", "sbyte", "short", "string", "ulong", "uint", "ushort"],
      literal: ["default", "false", "null", "true"]
    }, t2 = e2.inherit(e2.TITLE_MODE, {
      begin: "[a-zA-Z](\\.?\\w)*"
    }), a2 = { className: "number", variants: [{
      begin: "\\b(0b[01']+)"
    }, {
      begin: "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)"
    }, {
      begin: "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
    }], relevance: 0 }, i2 = {
      className: "string",
      begin: '@"',
      end: '"',
      contains: [{ begin: '""' }]
    }, r2 = e2.inherit(i2, { illegal: /\n/ }), s2 = {
      className: "subst",
      begin: /\{/,
      end: /\}/,
      keywords: n2
    }, o2 = e2.inherit(s2, { illegal: /\n/ }), l2 = {
      className: "string",
      begin: /\$"/,
      end: '"',
      illegal: /\n/,
      contains: [{ begin: /\{\{/ }, {
        begin: /\}\}/
      }, e2.BACKSLASH_ESCAPE, o2]
    }, c2 = { className: "string", begin: /\$@"/, end: '"', contains: [{
      begin: /\{\{/
    }, { begin: /\}\}/ }, { begin: '""' }, s2] }, d2 = e2.inherit(c2, {
      illegal: /\n/,
      contains: [{ begin: /\{\{/ }, { begin: /\}\}/ }, { begin: '""' }, o2]
    });
    s2.contains = [c2, l2, i2, e2.APOS_STRING_MODE, e2.QUOTE_STRING_MODE, a2, e2.C_BLOCK_COMMENT_MODE], o2.contains = [d2, l2, r2, e2.APOS_STRING_MODE, e2.QUOTE_STRING_MODE, a2, e2.inherit(e2.C_BLOCK_COMMENT_MODE, {
      illegal: /\n/
    })];
    const g2 = { variants: [{
      className: "string",
      begin: /"""("*)(?!")(.|\n)*?"""\1/,
      relevance: 1
    }, c2, l2, i2, e2.APOS_STRING_MODE, e2.QUOTE_STRING_MODE] }, u2 = {
      begin: "<",
      end: ">",
      contains: [{ beginKeywords: "in out" }, t2]
    }, b2 = e2.IDENT_RE + "(<" + e2.IDENT_RE + "(\\s*,\\s*" + e2.IDENT_RE + ")*>)?(\\[\\])?", m2 = {
      begin: "@" + e2.IDENT_RE,
      relevance: 0
    };
    return {
      name: "C#",
      aliases: ["cs", "c#"],
      keywords: n2,
      illegal: /::/,
      contains: [e2.COMMENT("///", "$", {
        returnBegin: true,
        contains: [{ className: "doctag", variants: [{ begin: "///", relevance: 0 }, {
          begin: "<!--|-->"
        }, { begin: "</?", end: ">" }] }]
      }), e2.C_LINE_COMMENT_MODE, e2.C_BLOCK_COMMENT_MODE, {
        className: "meta",
        begin: "#",
        end: "$",
        keywords: {
          keyword: "if else elif endif define undef warning error line region endregion pragma checksum"
        }
      }, g2, a2, {
        beginKeywords: "class interface",
        relevance: 0,
        end: /[{;=]/,
        illegal: /[^\s:,]/,
        contains: [{
          beginKeywords: "where class"
        }, t2, u2, e2.C_LINE_COMMENT_MODE, e2.C_BLOCK_COMMENT_MODE]
      }, {
        beginKeywords: "namespace",
        relevance: 0,
        end: /[{;=]/,
        illegal: /[^\s:]/,
        contains: [t2, e2.C_LINE_COMMENT_MODE, e2.C_BLOCK_COMMENT_MODE]
      }, {
        beginKeywords: "record",
        relevance: 0,
        end: /[{;=]/,
        illegal: /[^\s:]/,
        contains: [t2, u2, e2.C_LINE_COMMENT_MODE, e2.C_BLOCK_COMMENT_MODE]
      }, {
        className: "meta",
        begin: "^\\s*\\[(?=[\\w])",
        excludeBegin: true,
        end: "\\]",
        excludeEnd: true,
        contains: [{
          className: "string",
          begin: /"/,
          end: /"/
        }]
      }, {
        beginKeywords: "new return throw await else",
        relevance: 0
      }, {
        className: "function",
        begin: "(" + b2 + "\\s+)+" + e2.IDENT_RE + "\\s*(<[^=]+>\\s*)?\\(",
        returnBegin: true,
        end: /\s*[{;=]/,
        excludeEnd: true,
        keywords: n2,
        contains: [{
          beginKeywords: "public private protected static internal protected abstract async extern override unsafe virtual new sealed partial",
          relevance: 0
        }, {
          begin: e2.IDENT_RE + "\\s*(<[^=]+>\\s*)?\\(",
          returnBegin: true,
          contains: [e2.TITLE_MODE, u2],
          relevance: 0
        }, { match: /\(\)/ }, {
          className: "params",
          begin: /\(/,
          end: /\)/,
          excludeBegin: true,
          excludeEnd: true,
          keywords: n2,
          relevance: 0,
          contains: [g2, a2, e2.C_BLOCK_COMMENT_MODE]
        }, e2.C_LINE_COMMENT_MODE, e2.C_BLOCK_COMMENT_MODE]
      }, m2]
    };
  },
  grmr_css: (e2) => {
    const n2 = e2.regex, t2 = te(e2), a2 = [e2.APOS_STRING_MODE, e2.QUOTE_STRING_MODE];
    return {
      name: "CSS",
      case_insensitive: true,
      illegal: /[=|'\$]/,
      keywords: {
        keyframePosition: "from to"
      },
      classNameAliases: { keyframePosition: "selector-tag" },
      contains: [t2.BLOCK_COMMENT, {
        begin: /-(webkit|moz|ms|o)-(?=[a-z])/
      }, t2.CSS_NUMBER_MODE, {
        className: "selector-id",
        begin: /#[A-Za-z0-9_-]+/,
        relevance: 0
      }, {
        className: "selector-class",
        begin: "\\.[a-zA-Z-][a-zA-Z0-9_-]*",
        relevance: 0
      }, t2.ATTRIBUTE_SELECTOR_MODE, {
        className: "selector-pseudo",
        variants: [{
          begin: ":(" + re.join("|") + ")"
        }, { begin: ":(:)?(" + se.join("|") + ")" }]
      }, t2.CSS_VARIABLE, { className: "attribute", begin: "\\b(" + oe.join("|") + ")\\b" }, {
        begin: /:/,
        end: /[;}{]/,
        contains: [t2.BLOCK_COMMENT, t2.HEXCOLOR, t2.IMPORTANT, t2.CSS_NUMBER_MODE, ...a2, {
          begin: /(url|data-uri)\(/,
          end: /\)/,
          relevance: 0,
          keywords: {
            built_in: "url data-uri"
          },
          contains: [...a2, {
            className: "string",
            begin: /[^)]/,
            endsWithParent: true,
            excludeEnd: true
          }]
        }, t2.FUNCTION_DISPATCH]
      }, {
        begin: n2.lookahead(/@/),
        end: "[{;]",
        relevance: 0,
        illegal: /:/,
        contains: [{
          className: "keyword",
          begin: /@-?\w[\w]*(-\w+)*/
        }, { begin: /\s/, endsWithParent: true, excludeEnd: true, relevance: 0, keywords: {
          $pattern: /[a-z-]+/,
          keyword: "and or not only",
          attribute: ie.join(" ")
        }, contains: [{
          begin: /[a-z-]+(?=:)/,
          className: "attribute"
        }, ...a2, t2.CSS_NUMBER_MODE] }]
      }, {
        className: "selector-tag",
        begin: "\\b(" + ae.join("|") + ")\\b"
      }]
    };
  },
  grmr_diff: (e2) => {
    const n2 = e2.regex;
    return { name: "Diff", aliases: ["patch"], contains: [{
      className: "meta",
      relevance: 10,
      match: n2.either(/^@@ +-\d+,\d+ +\+\d+,\d+ +@@/, /^\*\*\* +\d+,\d+ +\*\*\*\*$/, /^--- +\d+,\d+ +----$/)
    }, { className: "comment", variants: [{
      begin: n2.either(/Index: /, /^index/, /={3,}/, /^-{3}/, /^\*{3} /, /^\+{3}/, /^diff --git/),
      end: /$/
    }, { match: /^\*{15}$/ }] }, { className: "addition", begin: /^\+/, end: /$/ }, {
      className: "deletion",
      begin: /^-/,
      end: /$/
    }, {
      className: "addition",
      begin: /^!/,
      end: /$/
    }] };
  },
  grmr_go: (e2) => {
    const n2 = {
      keyword: ["break", "case", "chan", "const", "continue", "default", "defer", "else", "fallthrough", "for", "func", "go", "goto", "if", "import", "interface", "map", "package", "range", "return", "select", "struct", "switch", "type", "var"],
      type: ["bool", "byte", "complex64", "complex128", "error", "float32", "float64", "int8", "int16", "int32", "int64", "string", "uint8", "uint16", "uint32", "uint64", "int", "uint", "uintptr", "rune"],
      literal: ["true", "false", "iota", "nil"],
      built_in: ["append", "cap", "close", "complex", "copy", "imag", "len", "make", "new", "panic", "print", "println", "real", "recover", "delete"]
    };
    return {
      name: "Go",
      aliases: ["golang"],
      keywords: n2,
      illegal: "</",
      contains: [e2.C_LINE_COMMENT_MODE, e2.C_BLOCK_COMMENT_MODE, {
        className: "string",
        variants: [e2.QUOTE_STRING_MODE, e2.APOS_STRING_MODE, { begin: "`", end: "`" }]
      }, {
        className: "number",
        variants: [{
          match: /-?\b0[xX]\.[a-fA-F0-9](_?[a-fA-F0-9])*[pP][+-]?\d(_?\d)*i?/,
          relevance: 0
        }, {
          match: /-?\b0[xX](_?[a-fA-F0-9])+((\.([a-fA-F0-9](_?[a-fA-F0-9])*)?)?[pP][+-]?\d(_?\d)*)?i?/,
          relevance: 0
        }, { match: /-?\b0[oO](_?[0-7])*i?/, relevance: 0 }, {
          match: /-?\.\d(_?\d)*([eE][+-]?\d(_?\d)*)?i?/,
          relevance: 0
        }, {
          match: /-?\b\d(_?\d)*(\.(\d(_?\d)*)?)?([eE][+-]?\d(_?\d)*)?i?/,
          relevance: 0
        }]
      }, {
        begin: /:=/
      }, {
        className: "function",
        beginKeywords: "func",
        end: "\\s*(\\{|$)",
        excludeEnd: true,
        contains: [e2.TITLE_MODE, {
          className: "params",
          begin: /\(/,
          end: /\)/,
          endsParent: true,
          keywords: n2,
          illegal: /["']/
        }]
      }]
    };
  },
  grmr_graphql: (e2) => {
    const n2 = e2.regex;
    return {
      name: "GraphQL",
      aliases: ["gql"],
      case_insensitive: true,
      disableAutodetect: false,
      keywords: {
        keyword: ["query", "mutation", "subscription", "type", "input", "schema", "directive", "interface", "union", "scalar", "fragment", "enum", "on"],
        literal: ["true", "false", "null"]
      },
      contains: [e2.HASH_COMMENT_MODE, e2.QUOTE_STRING_MODE, e2.NUMBER_MODE, {
        scope: "punctuation",
        match: /[.]{3}/,
        relevance: 0
      }, {
        scope: "punctuation",
        begin: /[\!\(\)\:\=\[\]\{\|\}]{1}/,
        relevance: 0
      }, {
        scope: "variable",
        begin: /\$/,
        end: /\W/,
        excludeEnd: true,
        relevance: 0
      }, { scope: "meta", match: /@\w+/, excludeEnd: true }, {
        scope: "symbol",
        begin: n2.concat(/[_A-Za-z][_0-9A-Za-z]*/, n2.lookahead(/\s*:/)),
        relevance: 0
      }],
      illegal: [/[;<']/, /BEGIN/]
    };
  },
  grmr_ini: (e2) => {
    const n2 = e2.regex, t2 = {
      className: "number",
      relevance: 0,
      variants: [{ begin: /([+-]+)?[\d]+_[\d_]+/ }, {
        begin: e2.NUMBER_RE
      }]
    }, a2 = e2.COMMENT();
    a2.variants = [{ begin: /;/, end: /$/ }, {
      begin: /#/,
      end: /$/
    }];
    const i2 = { className: "variable", variants: [{ begin: /\$[\w\d"][\w\d_]*/ }, {
      begin: /\$\{(.*?)\}/
    }] }, r2 = {
      className: "literal",
      begin: /\bon|off|true|false|yes|no\b/
    }, s2 = {
      className: "string",
      contains: [e2.BACKSLASH_ESCAPE],
      variants: [{ begin: "'''", end: "'''", relevance: 10 }, {
        begin: '"""',
        end: '"""',
        relevance: 10
      }, { begin: '"', end: '"' }, { begin: "'", end: "'" }]
    }, o2 = {
      begin: /\[/,
      end: /\]/,
      contains: [a2, r2, i2, s2, t2, "self"],
      relevance: 0
    }, l2 = n2.either(/[A-Za-z0-9_-]+/, /"(\\"|[^"])*"/, /'[^']*'/);
    return {
      name: "TOML, also INI",
      aliases: ["toml"],
      case_insensitive: true,
      illegal: /\S/,
      contains: [a2, { className: "section", begin: /\[+/, end: /\]+/ }, {
        begin: n2.concat(l2, "(\\s*\\.\\s*", l2, ")*", n2.lookahead(/\s*=\s*[^#\s]/)),
        className: "attr",
        starts: { end: /$/, contains: [a2, o2, r2, i2, s2, t2] }
      }]
    };
  },
  grmr_java: (e2) => {
    const n2 = e2.regex, t2 = "[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*", a2 = t2 + be("(?:<" + t2 + "~~~(?:\\s*,\\s*" + t2 + "~~~)*>)?", /~~~/g, 2), i2 = {
      keyword: ["synchronized", "abstract", "private", "var", "static", "if", "const ", "for", "while", "strictfp", "finally", "protected", "import", "native", "final", "void", "enum", "else", "break", "transient", "catch", "instanceof", "volatile", "case", "assert", "package", "default", "public", "try", "switch", "continue", "throws", "protected", "public", "private", "module", "requires", "exports", "do", "sealed", "yield", "permits", "goto", "when"],
      literal: ["false", "true", "null"],
      type: ["char", "boolean", "long", "float", "int", "byte", "short", "double"],
      built_in: ["super", "this"]
    }, r2 = { className: "meta", begin: "@" + t2, contains: [{
      begin: /\(/,
      end: /\)/,
      contains: ["self"]
    }] }, s2 = {
      className: "params",
      begin: /\(/,
      end: /\)/,
      keywords: i2,
      relevance: 0,
      contains: [e2.C_BLOCK_COMMENT_MODE],
      endsParent: true
    };
    return {
      name: "Java",
      aliases: ["jsp"],
      keywords: i2,
      illegal: /<\/|#/,
      contains: [e2.COMMENT("/\\*\\*", "\\*/", { relevance: 0, contains: [{
        begin: /\w+@/,
        relevance: 0
      }, { className: "doctag", begin: "@[A-Za-z]+" }] }), {
        begin: /import java\.[a-z]+\./,
        keywords: "import",
        relevance: 2
      }, e2.C_LINE_COMMENT_MODE, e2.C_BLOCK_COMMENT_MODE, {
        begin: /"""/,
        end: /"""/,
        className: "string",
        contains: [e2.BACKSLASH_ESCAPE]
      }, e2.APOS_STRING_MODE, e2.QUOTE_STRING_MODE, {
        match: [/\b(?:class|interface|enum|extends|implements|new)/, /\s+/, t2],
        className: {
          1: "keyword",
          3: "title.class"
        }
      }, { match: /non-sealed/, scope: "keyword" }, {
        begin: [n2.concat(/(?!else)/, t2), /\s+/, t2, /\s+/, /=(?!=)/],
        className: {
          1: "type",
          3: "variable",
          5: "operator"
        }
      }, { begin: [/record/, /\s+/, t2], className: {
        1: "keyword",
        3: "title.class"
      }, contains: [s2, e2.C_LINE_COMMENT_MODE, e2.C_BLOCK_COMMENT_MODE] }, {
        beginKeywords: "new throw return else",
        relevance: 0
      }, {
        begin: ["(?:" + a2 + "\\s+)", e2.UNDERSCORE_IDENT_RE, /\s*(?=\()/],
        className: {
          2: "title.function"
        },
        keywords: i2,
        contains: [{
          className: "params",
          begin: /\(/,
          end: /\)/,
          keywords: i2,
          relevance: 0,
          contains: [r2, e2.APOS_STRING_MODE, e2.QUOTE_STRING_MODE, ue, e2.C_BLOCK_COMMENT_MODE]
        }, e2.C_LINE_COMMENT_MODE, e2.C_BLOCK_COMMENT_MODE]
      }, ue, r2]
    };
  },
  grmr_javascript: ve,
  grmr_json: (e2) => {
    const n2 = ["true", "false", "null"], t2 = {
      scope: "literal",
      beginKeywords: n2.join(" ")
    };
    return {
      name: "JSON",
      aliases: ["jsonc"],
      keywords: {
        literal: n2
      },
      contains: [{
        className: "attr",
        begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
        relevance: 1.01
      }, {
        match: /[{}[\],:]/,
        className: "punctuation",
        relevance: 0
      }, e2.QUOTE_STRING_MODE, t2, e2.C_NUMBER_MODE, e2.C_LINE_COMMENT_MODE, e2.C_BLOCK_COMMENT_MODE],
      illegal: "\\S"
    };
  },
  grmr_kotlin: (e2) => {
    const n2 = {
      keyword: "abstract as val var vararg get set class object open private protected public noinline crossinline dynamic final enum if else do while for when throw try catch finally import package is in fun override companion reified inline lateinit init interface annotation data sealed internal infix operator out by constructor super tailrec where const inner suspend typealias external expect actual",
      built_in: "Byte Short Char Int Long Boolean Float Double Void Unit Nothing",
      literal: "true false null"
    }, t2 = {
      className: "symbol",
      begin: e2.UNDERSCORE_IDENT_RE + "@"
    }, a2 = { className: "subst", begin: /\$\{/, end: /\}/, contains: [e2.C_NUMBER_MODE] }, i2 = {
      className: "variable",
      begin: "\\$" + e2.UNDERSCORE_IDENT_RE
    }, r2 = {
      className: "string",
      variants: [{ begin: '"""', end: '"""(?=[^"])', contains: [i2, a2] }, {
        begin: "'",
        end: "'",
        illegal: /\n/,
        contains: [e2.BACKSLASH_ESCAPE]
      }, {
        begin: '"',
        end: '"',
        illegal: /\n/,
        contains: [e2.BACKSLASH_ESCAPE, i2, a2]
      }]
    };
    a2.contains.push(r2);
    const s2 = {
      className: "meta",
      begin: "@(?:file|property|field|get|set|receiver|param|setparam|delegate)\\s*:(?:\\s*" + e2.UNDERSCORE_IDENT_RE + ")?"
    }, o2 = {
      className: "meta",
      begin: "@" + e2.UNDERSCORE_IDENT_RE,
      contains: [{
        begin: /\(/,
        end: /\)/,
        contains: [e2.inherit(r2, { className: "string" }), "self"]
      }]
    }, l2 = ue, c2 = e2.COMMENT("/\\*", "\\*/", { contains: [e2.C_BLOCK_COMMENT_MODE] }), d2 = {
      variants: [{ className: "type", begin: e2.UNDERSCORE_IDENT_RE }, {
        begin: /\(/,
        end: /\)/,
        contains: []
      }]
    }, g2 = d2;
    return g2.variants[1].contains = [d2], d2.variants[1].contains = [g2], {
      name: "Kotlin",
      aliases: ["kt", "kts"],
      keywords: n2,
      contains: [e2.COMMENT("/\\*\\*", "\\*/", { relevance: 0, contains: [{
        className: "doctag",
        begin: "@[A-Za-z]+"
      }] }), e2.C_LINE_COMMENT_MODE, c2, {
        className: "keyword",
        begin: /\b(break|continue|return|this)\b/,
        starts: { contains: [{
          className: "symbol",
          begin: /@\w+/
        }] }
      }, t2, s2, o2, {
        className: "function",
        beginKeywords: "fun",
        end: "[(]|$",
        returnBegin: true,
        excludeEnd: true,
        keywords: n2,
        relevance: 5,
        contains: [{
          begin: e2.UNDERSCORE_IDENT_RE + "\\s*\\(",
          returnBegin: true,
          relevance: 0,
          contains: [e2.UNDERSCORE_TITLE_MODE]
        }, {
          className: "type",
          begin: /</,
          end: />/,
          keywords: "reified",
          relevance: 0
        }, {
          className: "params",
          begin: /\(/,
          end: /\)/,
          endsParent: true,
          keywords: n2,
          relevance: 0,
          contains: [{
            begin: /:/,
            end: /[=,\/]/,
            endsWithParent: true,
            contains: [d2, e2.C_LINE_COMMENT_MODE, c2],
            relevance: 0
          }, e2.C_LINE_COMMENT_MODE, c2, s2, o2, r2, e2.C_NUMBER_MODE]
        }, c2]
      }, {
        begin: [/class|interface|trait/, /\s+/, e2.UNDERSCORE_IDENT_RE],
        beginScope: {
          3: "title.class"
        },
        keywords: "class interface trait",
        end: /[:\{(]|$/,
        excludeEnd: true,
        illegal: "extends implements",
        contains: [{
          beginKeywords: "public protected internal private constructor"
        }, e2.UNDERSCORE_TITLE_MODE, {
          className: "type",
          begin: /</,
          end: />/,
          excludeBegin: true,
          excludeEnd: true,
          relevance: 0
        }, {
          className: "type",
          begin: /[,:]\s*/,
          end: /[<\(,){\s]|$/,
          excludeBegin: true,
          returnEnd: true
        }, s2, o2]
      }, r2, {
        className: "meta",
        begin: "^#!/usr/bin/env",
        end: "$",
        illegal: "\n"
      }, l2]
    };
  },
  grmr_less: (e2) => {
    const n2 = te(e2), t2 = le, a2 = "[\\w-]+", i2 = "(" + a2 + "|@\\{" + a2 + "\\})", r2 = [], s2 = [], o2 = (e3) => ({
      className: "string",
      begin: "~?" + e3 + ".*?" + e3
    }), l2 = (e3, n3, t3) => ({
      className: e3,
      begin: n3,
      relevance: t3
    }), c2 = {
      $pattern: /[a-z-]+/,
      keyword: "and or not only",
      attribute: ie.join(" ")
    }, d2 = {
      begin: "\\(",
      end: "\\)",
      contains: s2,
      keywords: c2,
      relevance: 0
    };
    s2.push(e2.C_LINE_COMMENT_MODE, e2.C_BLOCK_COMMENT_MODE, o2("'"), o2('"'), n2.CSS_NUMBER_MODE, {
      begin: "(url|data-uri)\\(",
      starts: {
        className: "string",
        end: "[\\)\\n]",
        excludeEnd: true
      }
    }, n2.HEXCOLOR, d2, l2("variable", "@@?" + a2, 10), l2("variable", "@\\{" + a2 + "\\}"), l2("built_in", "~?`[^`]*?`"), {
      className: "attribute",
      begin: a2 + "\\s*:",
      end: ":",
      returnBegin: true,
      excludeEnd: true
    }, n2.IMPORTANT, { beginKeywords: "and not" }, n2.FUNCTION_DISPATCH);
    const g2 = s2.concat({
      begin: /\{/,
      end: /\}/,
      contains: r2
    }), u2 = {
      beginKeywords: "when",
      endsWithParent: true,
      contains: [{ beginKeywords: "and not" }].concat(s2)
    }, b2 = {
      begin: i2 + "\\s*:",
      returnBegin: true,
      end: /[;}]/,
      relevance: 0,
      contains: [{
        begin: /-(webkit|moz|ms|o)-/
      }, n2.CSS_VARIABLE, {
        className: "attribute",
        begin: "\\b(" + oe.join("|") + ")\\b",
        end: /(?=:)/,
        starts: { endsWithParent: true, illegal: "[<=$]", relevance: 0, contains: s2 }
      }]
    }, m2 = {
      className: "keyword",
      begin: "@(import|media|charset|font-face|(-[a-z]+-)?keyframes|supports|document|namespace|page|viewport|host)\\b",
      starts: { end: "[;{}]", keywords: c2, returnEnd: true, contains: s2, relevance: 0 }
    }, p2 = {
      className: "variable",
      variants: [{ begin: "@" + a2 + "\\s*:", relevance: 15 }, {
        begin: "@" + a2
      }],
      starts: { end: "[;}]", returnEnd: true, contains: g2 }
    }, _2 = {
      variants: [{
        begin: "[\\.#:&\\[>]",
        end: "[;{}]"
      }, { begin: i2, end: /\{/ }],
      returnBegin: true,
      returnEnd: true,
      illegal: `[<='$"]`,
      relevance: 0,
      contains: [e2.C_LINE_COMMENT_MODE, e2.C_BLOCK_COMMENT_MODE, u2, l2("keyword", "all\\b"), l2("variable", "@\\{" + a2 + "\\}"), {
        begin: "\\b(" + ae.join("|") + ")\\b",
        className: "selector-tag"
      }, n2.CSS_NUMBER_MODE, l2("selector-tag", i2, 0), l2("selector-id", "#" + i2), l2("selector-class", "\\." + i2, 0), l2("selector-tag", "&", 0), n2.ATTRIBUTE_SELECTOR_MODE, {
        className: "selector-pseudo",
        begin: ":(" + re.join("|") + ")"
      }, {
        className: "selector-pseudo",
        begin: ":(:)?(" + se.join("|") + ")"
      }, {
        begin: /\(/,
        end: /\)/,
        relevance: 0,
        contains: g2
      }, { begin: "!important" }, n2.FUNCTION_DISPATCH]
    }, h2 = {
      begin: a2 + `:(:)?(${t2.join("|")})`,
      returnBegin: true,
      contains: [_2]
    };
    return r2.push(e2.C_LINE_COMMENT_MODE, e2.C_BLOCK_COMMENT_MODE, m2, p2, h2, b2, _2, u2, n2.FUNCTION_DISPATCH), { name: "Less", case_insensitive: true, illegal: `[=>'/<($"]`, contains: r2 };
  },
  grmr_lua: (e2) => {
    const n2 = "\\[=*\\[", t2 = "\\]=*\\]", a2 = {
      begin: n2,
      end: t2,
      contains: ["self"]
    }, i2 = [e2.COMMENT("--(?!" + n2 + ")", "$"), e2.COMMENT("--" + n2, t2, {
      contains: [a2],
      relevance: 10
    })];
    return { name: "Lua", aliases: ["pluto"], keywords: {
      $pattern: e2.UNDERSCORE_IDENT_RE,
      literal: "true false nil",
      keyword: "and break do else elseif end for goto if in local not or repeat return then until while",
      built_in: "_G _ENV _VERSION __index __newindex __mode __call __metatable __tostring __len __gc __add __sub __mul __div __mod __pow __concat __unm __eq __lt __le assert collectgarbage dofile error getfenv getmetatable ipairs load loadfile loadstring module next pairs pcall print rawequal rawget rawset require select setfenv setmetatable tonumber tostring type unpack xpcall arg self coroutine resume yield status wrap create running debug getupvalue debug sethook getmetatable gethook setmetatable setlocal traceback setfenv getinfo setupvalue getlocal getregistry getfenv io lines write close flush open output type read stderr stdin input stdout popen tmpfile math log max acos huge ldexp pi cos tanh pow deg tan cosh sinh random randomseed frexp ceil floor rad abs sqrt modf asin min mod fmod log10 atan2 exp sin atan os exit setlocale date getenv difftime remove time clock tmpname rename execute package preload loadlib loaded loaders cpath config path seeall string sub upper len gfind rep find match char dump gmatch reverse byte format gsub lower table setn insert getn foreachi maxn foreach concat sort remove"
    }, contains: i2.concat([{
      className: "function",
      beginKeywords: "function",
      end: "\\)",
      contains: [e2.inherit(e2.TITLE_MODE, {
        begin: "([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*"
      }), {
        className: "params",
        begin: "\\(",
        endsWithParent: true,
        contains: i2
      }].concat(i2)
    }, e2.C_NUMBER_MODE, e2.APOS_STRING_MODE, e2.QUOTE_STRING_MODE, {
      className: "string",
      begin: n2,
      end: t2,
      contains: [a2],
      relevance: 5
    }]) };
  },
  grmr_makefile: (e2) => {
    const n2 = {
      className: "variable",
      variants: [{
        begin: "\\$\\(" + e2.UNDERSCORE_IDENT_RE + "\\)",
        contains: [e2.BACKSLASH_ESCAPE]
      }, { begin: /\$[@%<?\^\+\*]/ }]
    }, t2 = {
      className: "string",
      begin: /"/,
      end: /"/,
      contains: [e2.BACKSLASH_ESCAPE, n2]
    }, a2 = {
      className: "variable",
      begin: /\$\([\w-]+\s/,
      end: /\)/,
      keywords: {
        built_in: "subst patsubst strip findstring filter filter-out sort word wordlist firstword lastword dir notdir suffix basename addsuffix addprefix join wildcard realpath abspath error warning shell origin flavor foreach if or and call eval file value"
      },
      contains: [n2, t2]
    }, i2 = { begin: "^" + e2.UNDERSCORE_IDENT_RE + "\\s*(?=[:+?]?=)" }, r2 = {
      className: "section",
      begin: /^[^\s]+:/,
      end: /$/,
      contains: [n2]
    };
    return {
      name: "Makefile",
      aliases: ["mk", "mak", "make"],
      keywords: {
        $pattern: /[\w-]+/,
        keyword: "define endef undefine ifdef ifndef ifeq ifneq else endif include -include sinclude override export unexport private vpath"
      },
      contains: [e2.HASH_COMMENT_MODE, n2, t2, a2, i2, {
        className: "meta",
        begin: /^\.PHONY:/,
        end: /$/,
        keywords: { $pattern: /[\.\w]+/, keyword: ".PHONY" }
      }, r2]
    };
  },
  grmr_markdown: (e2) => {
    const n2 = { begin: /<\/?[A-Za-z_]/, end: ">", subLanguage: "xml", relevance: 0 }, t2 = {
      variants: [{ begin: /\[.+?\]\[.*?\]/, relevance: 0 }, {
        begin: /\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,
        relevance: 2
      }, {
        begin: e2.regex.concat(/\[.+?\]\(/, /[A-Za-z][A-Za-z0-9+.-]*/, /:\/\/.*?\)/),
        relevance: 2
      }, { begin: /\[.+?\]\([./?&#].*?\)/, relevance: 1 }, {
        begin: /\[.*?\]\(.*?\)/,
        relevance: 0
      }],
      returnBegin: true,
      contains: [{
        match: /\[(?=\])/
      }, {
        className: "string",
        relevance: 0,
        begin: "\\[",
        end: "\\]",
        excludeBegin: true,
        returnEnd: true
      }, {
        className: "link",
        relevance: 0,
        begin: "\\]\\(",
        end: "\\)",
        excludeBegin: true,
        excludeEnd: true
      }, {
        className: "symbol",
        relevance: 0,
        begin: "\\]\\[",
        end: "\\]",
        excludeBegin: true,
        excludeEnd: true
      }]
    }, a2 = {
      className: "strong",
      contains: [],
      variants: [{ begin: /_{2}(?!\s)/, end: /_{2}/ }, { begin: /\*{2}(?!\s)/, end: /\*{2}/ }]
    }, i2 = { className: "emphasis", contains: [], variants: [{ begin: /\*(?![*\s])/, end: /\*/ }, {
      begin: /_(?![_\s])/,
      end: /_/,
      relevance: 0
    }] }, r2 = e2.inherit(a2, {
      contains: []
    }), s2 = e2.inherit(i2, { contains: [] });
    a2.contains.push(s2), i2.contains.push(r2);
    let o2 = [n2, t2];
    return [a2, i2, r2, s2].forEach(((e3) => {
      e3.contains = e3.contains.concat(o2);
    })), o2 = o2.concat(a2, i2), { name: "Markdown", aliases: ["md", "mkdown", "mkd"], contains: [{
      className: "section",
      variants: [{ begin: "^#{1,6}", end: "$", contains: o2 }, {
        begin: "(?=^.+?\\n[=-]{2,}$)",
        contains: [{ begin: "^[=-]*$" }, {
          begin: "^",
          end: "\\n",
          contains: o2
        }]
      }]
    }, n2, {
      className: "bullet",
      begin: "^[ 	]*([*+-]|(\\d+\\.))(?=\\s+)",
      end: "\\s+",
      excludeEnd: true
    }, a2, i2, {
      className: "quote",
      begin: "^>\\s+",
      contains: o2,
      end: "$"
    }, { className: "code", variants: [{ begin: "(`{3,})[^`](.|\\n)*?\\1`*[ ]*" }, {
      begin: "(~{3,})[^~](.|\\n)*?\\1~*[ ]*"
    }, { begin: "```", end: "```+[ ]*$" }, {
      begin: "~~~",
      end: "~~~+[ ]*$"
    }, { begin: "`.+?`" }, {
      begin: "(?=^( {4}|\\t))",
      contains: [{ begin: "^( {4}|\\t)", end: "(\\n)$" }],
      relevance: 0
    }] }, {
      begin: "^[-\\*]{3,}",
      end: "$"
    }, t2, { begin: /^\[[^\n]+\]:/, returnBegin: true, contains: [{
      className: "symbol",
      begin: /\[/,
      end: /\]/,
      excludeBegin: true,
      excludeEnd: true
    }, {
      className: "link",
      begin: /:\s*/,
      end: /$/,
      excludeBegin: true
    }] }, {
      scope: "literal",
      match: /&([a-zA-Z0-9]+|#[0-9]{1,7}|#[Xx][0-9a-fA-F]{1,6});/
    }] };
  },
  grmr_objectivec: (e2) => {
    const n2 = /[a-zA-Z@][a-zA-Z0-9_]*/, t2 = {
      $pattern: n2,
      keyword: ["@interface", "@class", "@protocol", "@implementation"]
    };
    return {
      name: "Objective-C",
      aliases: ["mm", "objc", "obj-c", "obj-c++", "objective-c++"],
      keywords: {
        "variable.language": ["this", "super"],
        $pattern: n2,
        keyword: ["while", "export", "sizeof", "typedef", "const", "struct", "for", "union", "volatile", "static", "mutable", "if", "do", "return", "goto", "enum", "else", "break", "extern", "asm", "case", "default", "register", "explicit", "typename", "switch", "continue", "inline", "readonly", "assign", "readwrite", "self", "@synchronized", "id", "typeof", "nonatomic", "IBOutlet", "IBAction", "strong", "weak", "copy", "in", "out", "inout", "bycopy", "byref", "oneway", "__strong", "__weak", "__block", "__autoreleasing", "@private", "@protected", "@public", "@try", "@property", "@end", "@throw", "@catch", "@finally", "@autoreleasepool", "@synthesize", "@dynamic", "@selector", "@optional", "@required", "@encode", "@package", "@import", "@defs", "@compatibility_alias", "__bridge", "__bridge_transfer", "__bridge_retained", "__bridge_retain", "__covariant", "__contravariant", "__kindof", "_Nonnull", "_Nullable", "_Null_unspecified", "__FUNCTION__", "__PRETTY_FUNCTION__", "__attribute__", "getter", "setter", "retain", "unsafe_unretained", "nonnull", "nullable", "null_unspecified", "null_resettable", "class", "instancetype", "NS_DESIGNATED_INITIALIZER", "NS_UNAVAILABLE", "NS_REQUIRES_SUPER", "NS_RETURNS_INNER_POINTER", "NS_INLINE", "NS_AVAILABLE", "NS_DEPRECATED", "NS_ENUM", "NS_OPTIONS", "NS_SWIFT_UNAVAILABLE", "NS_ASSUME_NONNULL_BEGIN", "NS_ASSUME_NONNULL_END", "NS_REFINED_FOR_SWIFT", "NS_SWIFT_NAME", "NS_SWIFT_NOTHROW", "NS_DURING", "NS_HANDLER", "NS_ENDHANDLER", "NS_VALUERETURN", "NS_VOIDRETURN"],
        literal: ["false", "true", "FALSE", "TRUE", "nil", "YES", "NO", "NULL"],
        built_in: ["dispatch_once_t", "dispatch_queue_t", "dispatch_sync", "dispatch_async", "dispatch_once"],
        type: ["int", "float", "char", "unsigned", "signed", "short", "long", "double", "wchar_t", "unichar", "void", "bool", "BOOL", "id|0", "_Bool"]
      },
      illegal: "</",
      contains: [{
        className: "built_in",
        begin: "\\b(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)\\w+"
      }, e2.C_LINE_COMMENT_MODE, e2.C_BLOCK_COMMENT_MODE, e2.C_NUMBER_MODE, e2.QUOTE_STRING_MODE, e2.APOS_STRING_MODE, {
        className: "string",
        variants: [{
          begin: '@"',
          end: '"',
          illegal: "\\n",
          contains: [e2.BACKSLASH_ESCAPE]
        }]
      }, {
        className: "meta",
        begin: /#\s*[a-z]+\b/,
        end: /$/,
        keywords: {
          keyword: "if else elif endif define undef warning error line pragma ifdef ifndef include"
        },
        contains: [{ begin: /\\\n/, relevance: 0 }, e2.inherit(e2.QUOTE_STRING_MODE, {
          className: "string"
        }), {
          className: "string",
          begin: /<.*?>/,
          end: /$/,
          illegal: "\\n"
        }, e2.C_LINE_COMMENT_MODE, e2.C_BLOCK_COMMENT_MODE]
      }, {
        className: "class",
        begin: "(" + t2.keyword.join("|") + ")\\b",
        end: /(\{|$)/,
        excludeEnd: true,
        keywords: t2,
        contains: [e2.UNDERSCORE_TITLE_MODE]
      }, {
        begin: "\\." + e2.UNDERSCORE_IDENT_RE,
        relevance: 0
      }]
    };
  },
  grmr_perl: (e2) => {
    const n2 = e2.regex, t2 = /[dualxmsipngr]{0,12}/, a2 = {
      $pattern: /[\w.]+/,
      keyword: "abs accept alarm and atan2 bind binmode bless break caller chdir chmod chomp chop chown chr chroot class close closedir connect continue cos crypt dbmclose dbmopen defined delete die do dump each else elsif endgrent endhostent endnetent endprotoent endpwent endservent eof eval exec exists exit exp fcntl field fileno flock for foreach fork format formline getc getgrent getgrgid getgrnam gethostbyaddr gethostbyname gethostent getlogin getnetbyaddr getnetbyname getnetent getpeername getpgrp getpriority getprotobyname getprotobynumber getprotoent getpwent getpwnam getpwuid getservbyname getservbyport getservent getsockname getsockopt given glob gmtime goto grep gt hex if index int ioctl join keys kill last lc lcfirst length link listen local localtime log lstat lt ma map method mkdir msgctl msgget msgrcv msgsnd my ne next no not oct open opendir or ord our pack package pipe pop pos print printf prototype push q|0 qq quotemeta qw qx rand read readdir readline readlink readpipe recv redo ref rename require reset return reverse rewinddir rindex rmdir say scalar seek seekdir select semctl semget semop send setgrent sethostent setnetent setpgrp setpriority setprotoent setpwent setservent setsockopt shift shmctl shmget shmread shmwrite shutdown sin sleep socket socketpair sort splice split sprintf sqrt srand stat state study sub substr symlink syscall sysopen sysread sysseek system syswrite tell telldir tie tied time times tr truncate uc ucfirst umask undef unless unlink unpack unshift untie until use utime values vec wait waitpid wantarray warn when while write x|0 xor y|0"
    }, i2 = { className: "subst", begin: "[$@]\\{", end: "\\}", keywords: a2 }, r2 = {
      begin: /->\{/,
      end: /\}/
    }, s2 = { scope: "attr", match: /\s+:\s*\w+(\s*\(.*?\))?/ }, o2 = {
      scope: "variable",
      variants: [{ begin: /\$\d/ }, {
        begin: n2.concat(/[$%@](?!")(\^\w\b|#\w+(::\w+)*|\{\w+\}|\w+(::\w*)*)/, "(?![A-Za-z])(?![@$%])")
      }, { begin: /[$%@](?!")[^\s\w{=]|\$=/, relevance: 0 }],
      contains: [s2]
    }, l2 = {
      className: "number",
      variants: [{ match: /0?\.[0-9][0-9_]+\b/ }, {
        match: /\bv?(0|[1-9][0-9_]*(\.[0-9_]+)?|[1-9][0-9_]*)\b/
      }, {
        match: /\b0[0-7][0-7_]*\b/
      }, { match: /\b0x[0-9a-fA-F][0-9a-fA-F_]*\b/ }, {
        match: /\b0b[0-1][0-1_]*\b/
      }],
      relevance: 0
    }, c2 = [e2.BACKSLASH_ESCAPE, i2, o2], d2 = [/!/, /\//, /\|/, /\?/, /'/, /"/, /#/], g2 = (e3, a3, i3 = "\\1") => {
      const r3 = "\\1" === i3 ? i3 : n2.concat(i3, a3);
      return n2.concat(n2.concat("(?:", e3, ")"), a3, /(?:\\.|[^\\\/])*?/, r3, /(?:\\.|[^\\\/])*?/, i3, t2);
    }, u2 = (e3, a3, i3) => n2.concat(n2.concat("(?:", e3, ")"), a3, /(?:\\.|[^\\\/])*?/, i3, t2), b2 = [o2, e2.HASH_COMMENT_MODE, e2.COMMENT(/^=\w/, /=cut/, {
      endsWithParent: true
    }), r2, { className: "string", contains: c2, variants: [{
      begin: "q[qwxr]?\\s*\\(",
      end: "\\)",
      relevance: 5
    }, {
      begin: "q[qwxr]?\\s*\\[",
      end: "\\]",
      relevance: 5
    }, { begin: "q[qwxr]?\\s*\\{", end: "\\}", relevance: 5 }, {
      begin: "q[qwxr]?\\s*\\|",
      end: "\\|",
      relevance: 5
    }, {
      begin: "q[qwxr]?\\s*<",
      end: ">",
      relevance: 5
    }, { begin: "qw\\s+q", end: "q", relevance: 5 }, {
      begin: "'",
      end: "'",
      contains: [e2.BACKSLASH_ESCAPE]
    }, { begin: '"', end: '"' }, {
      begin: "`",
      end: "`",
      contains: [e2.BACKSLASH_ESCAPE]
    }, { begin: /\{\w+\}/, relevance: 0 }, {
      begin: "-?\\w+\\s*=>",
      relevance: 0
    }] }, l2, {
      begin: "(\\/\\/|" + e2.RE_STARTERS_RE + "|\\b(split|return|print|reverse|grep)\\b)\\s*",
      keywords: "split return print reverse grep",
      relevance: 0,
      contains: [e2.HASH_COMMENT_MODE, { className: "regexp", variants: [{
        begin: g2("s|tr|y", n2.either(...d2, { capture: true }))
      }, { begin: g2("s|tr|y", "\\(", "\\)") }, {
        begin: g2("s|tr|y", "\\[", "\\]")
      }, { begin: g2("s|tr|y", "\\{", "\\}") }], relevance: 2 }, {
        className: "regexp",
        variants: [{ begin: /(m|qr)\/\//, relevance: 0 }, {
          begin: u2("(?:m|qr)?", /\//, /\//)
        }, { begin: u2("m|qr", n2.either(...d2, {
          capture: true
        }), /\1/) }, { begin: u2("m|qr", /\(/, /\)/) }, { begin: u2("m|qr", /\[/, /\]/) }, {
          begin: u2("m|qr", /\{/, /\}/)
        }]
      }]
    }, {
      className: "function",
      beginKeywords: "sub method",
      end: "(\\s*\\(.*?\\))?[;{]",
      excludeEnd: true,
      relevance: 5,
      contains: [e2.TITLE_MODE, s2]
    }, {
      className: "class",
      beginKeywords: "class",
      end: "[;{]",
      excludeEnd: true,
      relevance: 5,
      contains: [e2.TITLE_MODE, s2, l2]
    }, { begin: "-\\w\\b", relevance: 0 }, {
      begin: "^__DATA__$",
      end: "^__END__$",
      subLanguage: "mojolicious",
      contains: [{
        begin: "^@@.*",
        end: "$",
        className: "comment"
      }]
    }];
    return i2.contains = b2, r2.contains = b2, {
      name: "Perl",
      aliases: ["pl", "pm"],
      keywords: a2,
      contains: b2
    };
  },
  grmr_php: (e2) => {
    const n2 = e2.regex, t2 = /(?![A-Za-z0-9])(?![$])/, a2 = n2.concat(/[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/, t2), i2 = n2.concat(/(\\?[A-Z][a-z0-9_\x7f-\xff]+|\\?[A-Z]+(?=[A-Z][a-z0-9_\x7f-\xff])){1,}/, t2), r2 = n2.concat(/[A-Z]+/, t2), s2 = {
      scope: "variable",
      match: "\\$+" + a2
    }, o2 = { scope: "subst", variants: [{ begin: /\$\w+/ }, {
      begin: /\{\$/,
      end: /\}/
    }] }, l2 = e2.inherit(e2.APOS_STRING_MODE, {
      illegal: null
    }), c2 = "[ 	\n]", d2 = { scope: "string", variants: [e2.inherit(e2.QUOTE_STRING_MODE, {
      illegal: null,
      contains: e2.QUOTE_STRING_MODE.contains.concat(o2)
    }), l2, {
      begin: /<<<[ \t]*(?:(\w+)|"(\w+)")\n/,
      end: /[ \t]*(\w+)\b/,
      contains: e2.QUOTE_STRING_MODE.contains.concat(o2),
      "on:begin": (e3, n3) => {
        n3.data._beginMatch = e3[1] || e3[2];
      },
      "on:end": (e3, n3) => {
        n3.data._beginMatch !== e3[1] && n3.ignoreMatch();
      }
    }, e2.END_SAME_AS_BEGIN({
      begin: /<<<[ \t]*'(\w+)'\n/,
      end: /[ \t]*(\w+)\b/
    })] }, g2 = {
      scope: "number",
      variants: [{
        begin: "\\b0[bB][01]+(?:_[01]+)*\\b"
      }, { begin: "\\b0[oO][0-7]+(?:_[0-7]+)*\\b" }, {
        begin: "\\b0[xX][\\da-fA-F]+(?:_[\\da-fA-F]+)*\\b"
      }, {
        begin: "(?:\\b\\d+(?:_\\d+)*(\\.(?:\\d+(?:_\\d+)*))?|\\B\\.\\d+)(?:[eE][+-]?\\d+)?"
      }],
      relevance: 0
    }, u2 = ["false", "null", "true"], b2 = ["__CLASS__", "__DIR__", "__FILE__", "__FUNCTION__", "__COMPILER_HALT_OFFSET__", "__LINE__", "__METHOD__", "__NAMESPACE__", "__TRAIT__", "die", "echo", "exit", "include", "include_once", "print", "require", "require_once", "array", "abstract", "and", "as", "binary", "bool", "boolean", "break", "callable", "case", "catch", "class", "clone", "const", "continue", "declare", "default", "do", "double", "else", "elseif", "empty", "enddeclare", "endfor", "endforeach", "endif", "endswitch", "endwhile", "enum", "eval", "extends", "final", "finally", "float", "for", "foreach", "from", "global", "goto", "if", "implements", "instanceof", "insteadof", "int", "integer", "interface", "isset", "iterable", "list", "match|0", "mixed", "new", "never", "object", "or", "private", "protected", "public", "readonly", "real", "return", "string", "switch", "throw", "trait", "try", "unset", "use", "var", "void", "while", "xor", "yield"], m2 = ["Error|0", "AppendIterator", "ArgumentCountError", "ArithmeticError", "ArrayIterator", "ArrayObject", "AssertionError", "BadFunctionCallException", "BadMethodCallException", "CachingIterator", "CallbackFilterIterator", "CompileError", "Countable", "DirectoryIterator", "DivisionByZeroError", "DomainException", "EmptyIterator", "ErrorException", "Exception", "FilesystemIterator", "FilterIterator", "GlobIterator", "InfiniteIterator", "InvalidArgumentException", "IteratorIterator", "LengthException", "LimitIterator", "LogicException", "MultipleIterator", "NoRewindIterator", "OutOfBoundsException", "OutOfRangeException", "OuterIterator", "OverflowException", "ParentIterator", "ParseError", "RangeException", "RecursiveArrayIterator", "RecursiveCachingIterator", "RecursiveCallbackFilterIterator", "RecursiveDirectoryIterator", "RecursiveFilterIterator", "RecursiveIterator", "RecursiveIteratorIterator", "RecursiveRegexIterator", "RecursiveTreeIterator", "RegexIterator", "RuntimeException", "SeekableIterator", "SplDoublyLinkedList", "SplFileInfo", "SplFileObject", "SplFixedArray", "SplHeap", "SplMaxHeap", "SplMinHeap", "SplObjectStorage", "SplObserver", "SplPriorityQueue", "SplQueue", "SplStack", "SplSubject", "SplTempFileObject", "TypeError", "UnderflowException", "UnexpectedValueException", "UnhandledMatchError", "ArrayAccess", "BackedEnum", "Closure", "Fiber", "Generator", "Iterator", "IteratorAggregate", "Serializable", "Stringable", "Throwable", "Traversable", "UnitEnum", "WeakReference", "WeakMap", "Directory", "__PHP_Incomplete_Class", "parent", "php_user_filter", "self", "static", "stdClass"], p2 = {
      keyword: b2,
      literal: ((e3) => {
        const n3 = [];
        return e3.forEach(((e4) => {
          n3.push(e4), e4.toLowerCase() === e4 ? n3.push(e4.toUpperCase()) : n3.push(e4.toLowerCase());
        })), n3;
      })(u2),
      built_in: m2
    }, _2 = (e3) => e3.map(((e4) => e4.replace(/\|\d+$/, ""))), h2 = { variants: [{
      match: [/new/, n2.concat(c2, "+"), n2.concat("(?!", _2(m2).join("\\b|"), "\\b)"), i2],
      scope: {
        1: "keyword",
        4: "title.class"
      }
    }] }, f2 = n2.concat(a2, "\\b(?!\\()"), E2 = { variants: [{
      match: [n2.concat(/::/, n2.lookahead(/(?!class\b)/)), f2],
      scope: {
        2: "variable.constant"
      }
    }, { match: [/::/, /class/], scope: { 2: "variable.language" } }, {
      match: [i2, n2.concat(/::/, n2.lookahead(/(?!class\b)/)), f2],
      scope: {
        1: "title.class",
        3: "variable.constant"
      }
    }, {
      match: [i2, n2.concat("::", n2.lookahead(/(?!class\b)/))],
      scope: { 1: "title.class" }
    }, { match: [i2, /::/, /class/], scope: {
      1: "title.class",
      3: "variable.language"
    } }] }, y2 = {
      scope: "attr",
      match: n2.concat(a2, n2.lookahead(":"), n2.lookahead(/(?!::)/))
    }, w2 = {
      relevance: 0,
      begin: /\(/,
      end: /\)/,
      keywords: p2,
      contains: [y2, s2, E2, e2.C_BLOCK_COMMENT_MODE, d2, g2, h2]
    }, v2 = {
      relevance: 0,
      match: [/\b/, n2.concat("(?!fn\\b|function\\b|", _2(b2).join("\\b|"), "|", _2(m2).join("\\b|"), "\\b)"), a2, n2.concat(c2, "*"), n2.lookahead(/(?=\()/)],
      scope: { 3: "title.function.invoke" },
      contains: [w2]
    };
    w2.contains.push(v2);
    const N2 = [y2, E2, e2.C_BLOCK_COMMENT_MODE, d2, g2, h2], k2 = {
      begin: n2.concat(/#\[\s*\\?/, n2.either(i2, r2)),
      beginScope: "meta",
      end: /]/,
      endScope: "meta",
      keywords: { literal: u2, keyword: ["new", "array"] },
      contains: [{
        begin: /\[/,
        end: /]/,
        keywords: { literal: u2, keyword: ["new", "array"] },
        contains: ["self", ...N2]
      }, ...N2, { scope: "meta", variants: [{ match: i2 }, { match: r2 }] }]
    };
    return {
      case_insensitive: false,
      keywords: p2,
      contains: [k2, e2.HASH_COMMENT_MODE, e2.COMMENT("//", "$"), e2.COMMENT("/\\*", "\\*/", {
        contains: [{ scope: "doctag", match: "@[A-Za-z]+" }]
      }), {
        match: /__halt_compiler\(\);/,
        keywords: "__halt_compiler",
        starts: {
          scope: "comment",
          end: e2.MATCH_NOTHING_RE,
          contains: [{ match: /\?>/, scope: "meta", endsParent: true }]
        }
      }, { scope: "meta", variants: [{
        begin: /<\?php/,
        relevance: 10
      }, { begin: /<\?=/ }, { begin: /<\?/, relevance: 0.1 }, {
        begin: /\?>/
      }] }, { scope: "variable.language", match: /\$this\b/ }, s2, v2, E2, {
        match: [/const/, /\s/, a2],
        scope: { 1: "keyword", 3: "variable.constant" }
      }, h2, {
        scope: "function",
        relevance: 0,
        beginKeywords: "fn function",
        end: /[;{]/,
        excludeEnd: true,
        illegal: "[$%\\[]",
        contains: [{
          beginKeywords: "use"
        }, e2.UNDERSCORE_TITLE_MODE, { begin: "=>", endsParent: true }, {
          scope: "params",
          begin: "\\(",
          end: "\\)",
          excludeBegin: true,
          excludeEnd: true,
          keywords: p2,
          contains: ["self", k2, s2, E2, e2.C_BLOCK_COMMENT_MODE, d2, g2]
        }]
      }, { scope: "class", variants: [{
        beginKeywords: "enum",
        illegal: /[($"]/
      }, {
        beginKeywords: "class interface trait",
        illegal: /[:($"]/
      }], relevance: 0, end: /\{/, excludeEnd: true, contains: [{
        beginKeywords: "extends implements"
      }, e2.UNDERSCORE_TITLE_MODE] }, {
        beginKeywords: "namespace",
        relevance: 0,
        end: ";",
        illegal: /[.']/,
        contains: [e2.inherit(e2.UNDERSCORE_TITLE_MODE, { scope: "title.class" })]
      }, {
        beginKeywords: "use",
        relevance: 0,
        end: ";",
        contains: [{
          match: /\b(as|const|function)\b/,
          scope: "keyword"
        }, e2.UNDERSCORE_TITLE_MODE]
      }, d2, g2]
    };
  },
  grmr_php_template: (e2) => ({ name: "PHP template", subLanguage: "xml", contains: [{
    begin: /<\?(php|=)?/,
    end: /\?>/,
    subLanguage: "php",
    contains: [{
      begin: "/\\*",
      end: "\\*/",
      skip: true
    }, { begin: 'b"', end: '"', skip: true }, {
      begin: "b'",
      end: "'",
      skip: true
    }, e2.inherit(e2.APOS_STRING_MODE, {
      illegal: null,
      className: null,
      contains: null,
      skip: true
    }), e2.inherit(e2.QUOTE_STRING_MODE, {
      illegal: null,
      className: null,
      contains: null,
      skip: true
    })]
  }] }),
  grmr_plaintext: (e2) => ({
    name: "Plain text",
    aliases: ["text", "txt"],
    disableAutodetect: true
  }),
  grmr_python: (e2) => {
    const n2 = e2.regex, t2 = new RegExp("[\\p{XID_Start}_]\\p{XID_Continue}*", "u"), a2 = ["and", "as", "assert", "async", "await", "break", "case", "class", "continue", "def", "del", "elif", "else", "except", "finally", "for", "from", "global", "if", "import", "in", "is", "lambda", "match", "nonlocal|10", "not", "or", "pass", "raise", "return", "try", "while", "with", "yield"], i2 = {
      $pattern: /[A-Za-z]\w+|__\w+__/,
      keyword: a2,
      built_in: ["__import__", "abs", "all", "any", "ascii", "bin", "bool", "breakpoint", "bytearray", "bytes", "callable", "chr", "classmethod", "compile", "complex", "delattr", "dict", "dir", "divmod", "enumerate", "eval", "exec", "filter", "float", "format", "frozenset", "getattr", "globals", "hasattr", "hash", "help", "hex", "id", "input", "int", "isinstance", "issubclass", "iter", "len", "list", "locals", "map", "max", "memoryview", "min", "next", "object", "oct", "open", "ord", "pow", "print", "property", "range", "repr", "reversed", "round", "set", "setattr", "slice", "sorted", "staticmethod", "str", "sum", "super", "tuple", "type", "vars", "zip"],
      literal: ["__debug__", "Ellipsis", "False", "None", "NotImplemented", "True"],
      type: ["Any", "Callable", "Coroutine", "Dict", "List", "Literal", "Generic", "Optional", "Sequence", "Set", "Tuple", "Type", "Union"]
    }, r2 = { className: "meta", begin: /^(>>>|\.\.\.) / }, s2 = {
      className: "subst",
      begin: /\{/,
      end: /\}/,
      keywords: i2,
      illegal: /#/
    }, o2 = { begin: /\{\{/, relevance: 0 }, l2 = {
      className: "string",
      contains: [e2.BACKSLASH_ESCAPE],
      variants: [{
        begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,
        end: /'''/,
        contains: [e2.BACKSLASH_ESCAPE, r2],
        relevance: 10
      }, {
        begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,
        end: /"""/,
        contains: [e2.BACKSLASH_ESCAPE, r2],
        relevance: 10
      }, {
        begin: /([fF][rR]|[rR][fF]|[fF])'''/,
        end: /'''/,
        contains: [e2.BACKSLASH_ESCAPE, r2, o2, s2]
      }, {
        begin: /([fF][rR]|[rR][fF]|[fF])"""/,
        end: /"""/,
        contains: [e2.BACKSLASH_ESCAPE, r2, o2, s2]
      }, {
        begin: /([uU]|[rR])'/,
        end: /'/,
        relevance: 10
      }, { begin: /([uU]|[rR])"/, end: /"/, relevance: 10 }, {
        begin: /([bB]|[bB][rR]|[rR][bB])'/,
        end: /'/
      }, {
        begin: /([bB]|[bB][rR]|[rR][bB])"/,
        end: /"/
      }, {
        begin: /([fF][rR]|[rR][fF]|[fF])'/,
        end: /'/,
        contains: [e2.BACKSLASH_ESCAPE, o2, s2]
      }, {
        begin: /([fF][rR]|[rR][fF]|[fF])"/,
        end: /"/,
        contains: [e2.BACKSLASH_ESCAPE, o2, s2]
      }, e2.APOS_STRING_MODE, e2.QUOTE_STRING_MODE]
    }, c2 = "[0-9](_?[0-9])*", d2 = `(\\b(${c2}))?\\.(${c2})|\\b(${c2})\\.`, g2 = "\\b|" + a2.join("|"), u2 = {
      className: "number",
      relevance: 0,
      variants: [{
        begin: `(\\b(${c2})|(${d2}))[eE][+-]?(${c2})[jJ]?(?=${g2})`
      }, { begin: `(${d2})[jJ]?` }, {
        begin: `\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${g2})`
      }, {
        begin: `\\b0[bB](_?[01])+[lL]?(?=${g2})`
      }, {
        begin: `\\b0[oO](_?[0-7])+[lL]?(?=${g2})`
      }, { begin: `\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${g2})` }, {
        begin: `\\b(${c2})[jJ](?=${g2})`
      }]
    }, b2 = {
      className: "comment",
      begin: n2.lookahead(/# type:/),
      end: /$/,
      keywords: i2,
      contains: [{ begin: /# type:/ }, { begin: /#/, end: /\b\B/, endsWithParent: true }]
    }, m2 = {
      className: "params",
      variants: [{ className: "", begin: /\(\s*\)/, skip: true }, {
        begin: /\(/,
        end: /\)/,
        excludeBegin: true,
        excludeEnd: true,
        keywords: i2,
        contains: ["self", r2, u2, l2, e2.HASH_COMMENT_MODE]
      }]
    };
    return s2.contains = [l2, u2, r2], {
      name: "Python",
      aliases: ["py", "gyp", "ipython"],
      unicodeRegex: true,
      keywords: i2,
      illegal: /(<\/|\?)|=>/,
      contains: [r2, u2, {
        scope: "variable.language",
        match: /\bself\b/
      }, { beginKeywords: "if", relevance: 0 }, {
        match: /\bor\b/,
        scope: "keyword"
      }, l2, b2, e2.HASH_COMMENT_MODE, { match: [/\bdef/, /\s+/, t2], scope: {
        1: "keyword",
        3: "title.function"
      }, contains: [m2] }, {
        variants: [{
          match: [/\bclass/, /\s+/, t2, /\s*/, /\(\s*/, t2, /\s*\)/]
        }, { match: [/\bclass/, /\s+/, t2] }],
        scope: { 1: "keyword", 3: "title.class", 6: "title.class.inherited" }
      }, {
        className: "meta",
        begin: /^[\t ]*@/,
        end: /(?=#)|$/,
        contains: [u2, m2, l2]
      }]
    };
  },
  grmr_python_repl: (e2) => ({ aliases: ["pycon"], contains: [{
    className: "meta.prompt",
    starts: { end: / |$/, starts: { end: "$", subLanguage: "python" } },
    variants: [{
      begin: /^>>>(?=[ ]|$)/
    }, { begin: /^\.\.\.(?=[ ]|$)/ }]
  }] }),
  grmr_r: (e2) => {
    const n2 = e2.regex, t2 = /(?:(?:[a-zA-Z]|\.[._a-zA-Z])[._a-zA-Z0-9]*)|\.(?!\d)/, a2 = n2.either(/0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*[pP][+-]?\d+i?/, /0[xX][0-9a-fA-F]+(?:[pP][+-]?\d+)?[Li]?/, /(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?[Li]?/), i2 = /[=!<>:]=|\|\||&&|:::?|<-|<<-|->>|->|\|>|[-+*\/?!$&|:<=>@^~]|\*\*/, r2 = n2.either(/[()]/, /[{}]/, /\[\[/, /[[\]]/, /\\/, /,/);
    return { name: "R", keywords: {
      $pattern: t2,
      keyword: "function if in break next repeat else for while",
      literal: "NULL NA TRUE FALSE Inf NaN NA_integer_|10 NA_real_|10 NA_character_|10 NA_complex_|10",
      built_in: "LETTERS letters month.abb month.name pi T F abs acos acosh all any anyNA Arg as.call as.character as.complex as.double as.environment as.integer as.logical as.null.default as.numeric as.raw asin asinh atan atanh attr attributes baseenv browser c call ceiling class Conj cos cosh cospi cummax cummin cumprod cumsum digamma dim dimnames emptyenv exp expression floor forceAndCall gamma gc.time globalenv Im interactive invisible is.array is.atomic is.call is.character is.complex is.double is.environment is.expression is.finite is.function is.infinite is.integer is.language is.list is.logical is.matrix is.na is.name is.nan is.null is.numeric is.object is.pairlist is.raw is.recursive is.single is.symbol lazyLoadDBfetch length lgamma list log max min missing Mod names nargs nzchar oldClass on.exit pos.to.env proc.time prod quote range Re rep retracemem return round seq_along seq_len seq.int sign signif sin sinh sinpi sqrt standardGeneric substitute sum switch tan tanh tanpi tracemem trigamma trunc unclass untracemem UseMethod xtfrm"
    }, contains: [e2.COMMENT(/#'/, /$/, {
      contains: [{
        scope: "doctag",
        match: /@examples/,
        starts: {
          end: n2.lookahead(n2.either(/\n^#'\s*(?=@[a-zA-Z]+)/, /\n^(?!#')/)),
          endsParent: true
        }
      }, { scope: "doctag", begin: "@param", end: /$/, contains: [{
        scope: "variable",
        variants: [{ match: t2 }, { match: /`(?:\\.|[^`\\])+`/ }],
        endsParent: true
      }] }, { scope: "doctag", match: /@[a-zA-Z]+/ }, { scope: "keyword", match: /\\[a-zA-Z]+/ }]
    }), e2.HASH_COMMENT_MODE, {
      scope: "string",
      contains: [e2.BACKSLASH_ESCAPE],
      variants: [e2.END_SAME_AS_BEGIN({
        begin: /[rR]"(-*)\(/,
        end: /\)(-*)"/
      }), e2.END_SAME_AS_BEGIN({
        begin: /[rR]"(-*)\{/,
        end: /\}(-*)"/
      }), e2.END_SAME_AS_BEGIN({
        begin: /[rR]"(-*)\[/,
        end: /\](-*)"/
      }), e2.END_SAME_AS_BEGIN({
        begin: /[rR]'(-*)\(/,
        end: /\)(-*)'/
      }), e2.END_SAME_AS_BEGIN({
        begin: /[rR]'(-*)\{/,
        end: /\}(-*)'/
      }), e2.END_SAME_AS_BEGIN({ begin: /[rR]'(-*)\[/, end: /\](-*)'/ }), {
        begin: '"',
        end: '"',
        relevance: 0
      }, { begin: "'", end: "'", relevance: 0 }]
    }, { relevance: 0, variants: [{ scope: {
      1: "operator",
      2: "number"
    }, match: [i2, a2] }, {
      scope: { 1: "operator", 2: "number" },
      match: [/%[^%]*%/, a2]
    }, { scope: { 1: "punctuation", 2: "number" }, match: [r2, a2] }, { scope: {
      2: "number"
    }, match: [/[^a-zA-Z0-9._]|^/, a2] }] }, {
      scope: { 3: "operator" },
      match: [t2, /\s+/, /<-/, /\s+/]
    }, { scope: "operator", relevance: 0, variants: [{ match: i2 }, {
      match: /%[^%]*%/
    }] }, { scope: "punctuation", relevance: 0, match: r2 }, {
      begin: "`",
      end: "`",
      contains: [{ begin: /\\./ }]
    }] };
  },
  grmr_ruby: (e2) => {
    const n2 = e2.regex, t2 = "([a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?)", a2 = n2.either(/\b([A-Z]+[a-z0-9]+)+/, /\b([A-Z]+[a-z0-9]+)+[A-Z]+/), i2 = n2.concat(a2, /(::\w+)*/), r2 = {
      "variable.constant": ["__FILE__", "__LINE__", "__ENCODING__"],
      "variable.language": ["self", "super"],
      keyword: ["alias", "and", "begin", "BEGIN", "break", "case", "class", "defined", "do", "else", "elsif", "end", "END", "ensure", "for", "if", "in", "module", "next", "not", "or", "redo", "require", "rescue", "retry", "return", "then", "undef", "unless", "until", "when", "while", "yield", "include", "extend", "prepend", "public", "private", "protected", "raise", "throw"],
      built_in: ["proc", "lambda", "attr_accessor", "attr_reader", "attr_writer", "define_method", "private_constant", "module_function"],
      literal: ["true", "false", "nil"]
    }, s2 = { className: "doctag", begin: "@[A-Za-z]+" }, o2 = {
      begin: "#<",
      end: ">"
    }, l2 = [e2.COMMENT("#", "$", {
      contains: [s2]
    }), e2.COMMENT("^=begin", "^=end", {
      contains: [s2],
      relevance: 10
    }), e2.COMMENT("^__END__", e2.MATCH_NOTHING_RE)], c2 = {
      className: "subst",
      begin: /#\{/,
      end: /\}/,
      keywords: r2
    }, d2 = {
      className: "string",
      contains: [e2.BACKSLASH_ESCAPE, c2],
      variants: [{ begin: /'/, end: /'/ }, { begin: /"/, end: /"/ }, { begin: /`/, end: /`/ }, {
        begin: /%[qQwWx]?\(/,
        end: /\)/
      }, { begin: /%[qQwWx]?\[/, end: /\]/ }, {
        begin: /%[qQwWx]?\{/,
        end: /\}/
      }, { begin: /%[qQwWx]?</, end: />/ }, {
        begin: /%[qQwWx]?\//,
        end: /\//
      }, { begin: /%[qQwWx]?%/, end: /%/ }, { begin: /%[qQwWx]?-/, end: /-/ }, {
        begin: /%[qQwWx]?\|/,
        end: /\|/
      }, { begin: /\B\?(\\\d{1,3})/ }, {
        begin: /\B\?(\\x[A-Fa-f0-9]{1,2})/
      }, { begin: /\B\?(\\u\{?[A-Fa-f0-9]{1,6}\}?)/ }, {
        begin: /\B\?(\\M-\\C-|\\M-\\c|\\c\\M-|\\M-|\\C-\\M-)[\x20-\x7e]/
      }, {
        begin: /\B\?\\(c|C-)[\x20-\x7e]/
      }, { begin: /\B\?\\?\S/ }, {
        begin: n2.concat(/<<[-~]?'?/, n2.lookahead(/(\w+)(?=\W)[^\n]*\n(?:[^\n]*\n)*?\s*\1\b/)),
        contains: [e2.END_SAME_AS_BEGIN({
          begin: /(\w+)/,
          end: /(\w+)/,
          contains: [e2.BACKSLASH_ESCAPE, c2]
        })]
      }]
    }, g2 = "[0-9](_?[0-9])*", u2 = {
      className: "number",
      relevance: 0,
      variants: [{
        begin: `\\b([1-9](_?[0-9])*|0)(\\.(${g2}))?([eE][+-]?(${g2})|r)?i?\\b`
      }, {
        begin: "\\b0[dD][0-9](_?[0-9])*r?i?\\b"
      }, {
        begin: "\\b0[bB][0-1](_?[0-1])*r?i?\\b"
      }, { begin: "\\b0[oO][0-7](_?[0-7])*r?i?\\b" }, {
        begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*r?i?\\b"
      }, {
        begin: "\\b0(_?[0-7])+r?i?\\b"
      }]
    }, b2 = { variants: [{ match: /\(\)/ }, {
      className: "params",
      begin: /\(/,
      end: /(?=\))/,
      excludeBegin: true,
      endsParent: true,
      keywords: r2
    }] }, m2 = [d2, { variants: [{ match: [/class\s+/, i2, /\s+<\s+/, i2] }, {
      match: [/\b(class|module)\s+/, i2]
    }], scope: {
      2: "title.class",
      4: "title.class.inherited"
    }, keywords: r2 }, { match: [/(include|extend)\s+/, i2], scope: {
      2: "title.class"
    }, keywords: r2 }, { relevance: 0, match: [i2, /\.new[. (]/], scope: {
      1: "title.class"
    } }, {
      relevance: 0,
      match: /\b[A-Z][A-Z_0-9]+\b/,
      className: "variable.constant"
    }, { relevance: 0, match: a2, scope: "title.class" }, {
      match: [/def/, /\s+/, t2],
      scope: { 1: "keyword", 3: "title.function" },
      contains: [b2]
    }, {
      begin: e2.IDENT_RE + "::"
    }, {
      className: "symbol",
      begin: e2.UNDERSCORE_IDENT_RE + "(!|\\?)?:",
      relevance: 0
    }, {
      className: "symbol",
      begin: ":(?!\\s)",
      contains: [d2, { begin: t2 }],
      relevance: 0
    }, u2, {
      className: "variable",
      begin: "(\\$\\W)|((\\$|@@?)(\\w+))(?=[^@$?])(?![A-Za-z])(?![@$?'])"
    }, {
      className: "params",
      begin: /\|(?!=)/,
      end: /\|/,
      excludeBegin: true,
      excludeEnd: true,
      relevance: 0,
      keywords: r2
    }, {
      begin: "(" + e2.RE_STARTERS_RE + "|unless)\\s*",
      keywords: "unless",
      contains: [{
        className: "regexp",
        contains: [e2.BACKSLASH_ESCAPE, c2],
        illegal: /\n/,
        variants: [{ begin: "/", end: "/[a-z]*" }, { begin: /%r\{/, end: /\}[a-z]*/ }, {
          begin: "%r\\(",
          end: "\\)[a-z]*"
        }, { begin: "%r!", end: "![a-z]*" }, {
          begin: "%r\\[",
          end: "\\][a-z]*"
        }]
      }].concat(o2, l2),
      relevance: 0
    }].concat(o2, l2);
    c2.contains = m2, b2.contains = m2;
    const p2 = [{
      begin: /^\s*=>/,
      starts: { end: "$", contains: m2 }
    }, {
      className: "meta.prompt",
      begin: "^([>?]>|[\\w#]+\\(\\w+\\):\\d+:\\d+[>*]|(\\w+-)?\\d+\\.\\d+\\.\\d+(p\\d+)?[^\\d][^>]+>)(?=[ ])",
      starts: { end: "$", keywords: r2, contains: m2 }
    }];
    return l2.unshift(o2), {
      name: "Ruby",
      aliases: ["rb", "gemspec", "podspec", "thor", "irb"],
      keywords: r2,
      illegal: /\/\*/,
      contains: [e2.SHEBANG({ binary: "ruby" })].concat(p2).concat(l2).concat(m2)
    };
  },
  grmr_rust: (e2) => {
    const n2 = e2.regex, t2 = /(r#)?/, a2 = n2.concat(t2, e2.UNDERSCORE_IDENT_RE), i2 = n2.concat(t2, e2.IDENT_RE), r2 = {
      className: "title.function.invoke",
      relevance: 0,
      begin: n2.concat(/\b/, /(?!let|for|while|if|else|match\b)/, i2, n2.lookahead(/\s*\(/))
    }, s2 = "([ui](8|16|32|64|128|size)|f(32|64))?", o2 = ["drop ", "Copy", "Send", "Sized", "Sync", "Drop", "Fn", "FnMut", "FnOnce", "ToOwned", "Clone", "Debug", "PartialEq", "PartialOrd", "Eq", "Ord", "AsRef", "AsMut", "Into", "From", "Default", "Iterator", "Extend", "IntoIterator", "DoubleEndedIterator", "ExactSizeIterator", "SliceConcatExt", "ToString", "assert!", "assert_eq!", "bitflags!", "bytes!", "cfg!", "col!", "concat!", "concat_idents!", "debug_assert!", "debug_assert_eq!", "env!", "eprintln!", "panic!", "file!", "format!", "format_args!", "include_bytes!", "include_str!", "line!", "local_data_key!", "module_path!", "option_env!", "print!", "println!", "select!", "stringify!", "try!", "unimplemented!", "unreachable!", "vec!", "write!", "writeln!", "macro_rules!", "assert_ne!", "debug_assert_ne!"], l2 = ["i8", "i16", "i32", "i64", "i128", "isize", "u8", "u16", "u32", "u64", "u128", "usize", "f32", "f64", "str", "char", "bool", "Box", "Option", "Result", "String", "Vec"];
    return {
      name: "Rust",
      aliases: ["rs"],
      keywords: {
        $pattern: e2.IDENT_RE + "!?",
        type: l2,
        keyword: ["abstract", "as", "async", "await", "become", "box", "break", "const", "continue", "crate", "do", "dyn", "else", "enum", "extern", "false", "final", "fn", "for", "if", "impl", "in", "let", "loop", "macro", "match", "mod", "move", "mut", "override", "priv", "pub", "ref", "return", "self", "Self", "static", "struct", "super", "trait", "true", "try", "type", "typeof", "union", "unsafe", "unsized", "use", "virtual", "where", "while", "yield"],
        literal: ["true", "false", "Some", "None", "Ok", "Err"],
        built_in: o2
      },
      illegal: "</",
      contains: [e2.C_LINE_COMMENT_MODE, e2.COMMENT("/\\*", "\\*/", {
        contains: ["self"]
      }), e2.inherit(e2.QUOTE_STRING_MODE, { begin: /b?"/, illegal: null }), {
        className: "symbol",
        begin: /'[a-zA-Z_][a-zA-Z0-9_]*(?!')/
      }, {
        scope: "string",
        variants: [{ begin: /b?r(#*)"(.|\n)*?"\1(?!#)/ }, { begin: /b?'/, end: /'/, contains: [{
          scope: "char.escape",
          match: /\\('|\w|x\w{2}|u\w{4}|U\w{8})/
        }] }]
      }, {
        className: "number",
        variants: [{ begin: "\\b0b([01_]+)" + s2 }, {
          begin: "\\b0o([0-7_]+)" + s2
        }, { begin: "\\b0x([A-Fa-f0-9_]+)" + s2 }, {
          begin: "\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)" + s2
        }],
        relevance: 0
      }, {
        begin: [/fn/, /\s+/, a2],
        className: { 1: "keyword", 3: "title.function" }
      }, {
        className: "meta",
        begin: "#!?\\[",
        end: "\\]",
        contains: [{
          className: "string",
          begin: /"/,
          end: /"/,
          contains: [e2.BACKSLASH_ESCAPE]
        }]
      }, {
        begin: [/let/, /\s+/, /(?:mut\s+)?/, a2],
        className: {
          1: "keyword",
          3: "keyword",
          4: "variable"
        }
      }, { begin: [/for/, /\s+/, a2, /\s+/, /in/], className: {
        1: "keyword",
        3: "variable",
        5: "keyword"
      } }, { begin: [/type/, /\s+/, a2], className: {
        1: "keyword",
        3: "title.class"
      } }, {
        begin: [/(?:trait|enum|struct|union|impl|for)/, /\s+/, a2],
        className: { 1: "keyword", 3: "title.class" }
      }, { begin: e2.IDENT_RE + "::", keywords: {
        keyword: "Self",
        built_in: o2,
        type: l2
      } }, { className: "punctuation", begin: "->" }, r2]
    };
  },
  grmr_scss: (e2) => {
    const n2 = te(e2), t2 = se, a2 = re, i2 = "@[a-z-]+", r2 = {
      className: "variable",
      begin: "(\\$[a-zA-Z-][a-zA-Z0-9_-]*)\\b",
      relevance: 0
    };
    return {
      name: "SCSS",
      case_insensitive: true,
      illegal: "[=/|']",
      contains: [e2.C_LINE_COMMENT_MODE, e2.C_BLOCK_COMMENT_MODE, n2.CSS_NUMBER_MODE, {
        className: "selector-id",
        begin: "#[A-Za-z0-9_-]+",
        relevance: 0
      }, {
        className: "selector-class",
        begin: "\\.[A-Za-z0-9_-]+",
        relevance: 0
      }, n2.ATTRIBUTE_SELECTOR_MODE, {
        className: "selector-tag",
        begin: "\\b(" + ae.join("|") + ")\\b",
        relevance: 0
      }, {
        className: "selector-pseudo",
        begin: ":(" + a2.join("|") + ")"
      }, {
        className: "selector-pseudo",
        begin: ":(:)?(" + t2.join("|") + ")"
      }, r2, {
        begin: /\(/,
        end: /\)/,
        contains: [n2.CSS_NUMBER_MODE]
      }, n2.CSS_VARIABLE, {
        className: "attribute",
        begin: "\\b(" + oe.join("|") + ")\\b"
      }, {
        begin: "\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b"
      }, {
        begin: /:/,
        end: /[;}{]/,
        relevance: 0,
        contains: [n2.BLOCK_COMMENT, r2, n2.HEXCOLOR, n2.CSS_NUMBER_MODE, e2.QUOTE_STRING_MODE, e2.APOS_STRING_MODE, n2.IMPORTANT, n2.FUNCTION_DISPATCH]
      }, { begin: "@(page|font-face)", keywords: { $pattern: i2, keyword: "@page @font-face" } }, {
        begin: "@",
        end: "[{;]",
        returnBegin: true,
        keywords: {
          $pattern: /[a-z-]+/,
          keyword: "and or not only",
          attribute: ie.join(" ")
        },
        contains: [{
          begin: i2,
          className: "keyword"
        }, {
          begin: /[a-z-]+(?=:)/,
          className: "attribute"
        }, r2, e2.QUOTE_STRING_MODE, e2.APOS_STRING_MODE, n2.HEXCOLOR, n2.CSS_NUMBER_MODE]
      }, n2.FUNCTION_DISPATCH]
    };
  },
  grmr_shell: (e2) => ({
    name: "Shell Session",
    aliases: ["console", "shellsession"],
    contains: [{
      className: "meta.prompt",
      begin: /^\s{0,3}[/~\w\d[\]()@-]*[>%$#][ ]?/,
      starts: {
        end: /[^\\](?=\s*$)/,
        subLanguage: "bash"
      }
    }]
  }),
  grmr_sql: (e2) => {
    const n2 = e2.regex, t2 = e2.COMMENT("--", "$"), a2 = ["abs", "acos", "array_agg", "asin", "atan", "avg", "cast", "ceil", "ceiling", "coalesce", "corr", "cos", "cosh", "count", "covar_pop", "covar_samp", "cume_dist", "dense_rank", "deref", "element", "exp", "extract", "first_value", "floor", "json_array", "json_arrayagg", "json_exists", "json_object", "json_objectagg", "json_query", "json_table", "json_table_primitive", "json_value", "lag", "last_value", "lead", "listagg", "ln", "log", "log10", "lower", "max", "min", "mod", "nth_value", "ntile", "nullif", "percent_rank", "percentile_cont", "percentile_disc", "position", "position_regex", "power", "rank", "regr_avgx", "regr_avgy", "regr_count", "regr_intercept", "regr_r2", "regr_slope", "regr_sxx", "regr_sxy", "regr_syy", "row_number", "sin", "sinh", "sqrt", "stddev_pop", "stddev_samp", "substring", "substring_regex", "sum", "tan", "tanh", "translate", "translate_regex", "treat", "trim", "trim_array", "unnest", "upper", "value_of", "var_pop", "var_samp", "width_bucket"], i2 = a2, r2 = ["abs", "acos", "all", "allocate", "alter", "and", "any", "are", "array", "array_agg", "array_max_cardinality", "as", "asensitive", "asin", "asymmetric", "at", "atan", "atomic", "authorization", "avg", "begin", "begin_frame", "begin_partition", "between", "bigint", "binary", "blob", "boolean", "both", "by", "call", "called", "cardinality", "cascaded", "case", "cast", "ceil", "ceiling", "char", "char_length", "character", "character_length", "check", "classifier", "clob", "close", "coalesce", "collate", "collect", "column", "commit", "condition", "connect", "constraint", "contains", "convert", "copy", "corr", "corresponding", "cos", "cosh", "count", "covar_pop", "covar_samp", "create", "cross", "cube", "cume_dist", "current", "current_catalog", "current_date", "current_default_transform_group", "current_path", "current_role", "current_row", "current_schema", "current_time", "current_timestamp", "current_path", "current_role", "current_transform_group_for_type", "current_user", "cursor", "cycle", "date", "day", "deallocate", "dec", "decimal", "decfloat", "declare", "default", "define", "delete", "dense_rank", "deref", "describe", "deterministic", "disconnect", "distinct", "double", "drop", "dynamic", "each", "element", "else", "empty", "end", "end_frame", "end_partition", "end-exec", "equals", "escape", "every", "except", "exec", "execute", "exists", "exp", "external", "extract", "false", "fetch", "filter", "first_value", "float", "floor", "for", "foreign", "frame_row", "free", "from", "full", "function", "fusion", "get", "global", "grant", "group", "grouping", "groups", "having", "hold", "hour", "identity", "in", "indicator", "initial", "inner", "inout", "insensitive", "insert", "int", "integer", "intersect", "intersection", "interval", "into", "is", "join", "json_array", "json_arrayagg", "json_exists", "json_object", "json_objectagg", "json_query", "json_table", "json_table_primitive", "json_value", "lag", "language", "large", "last_value", "lateral", "lead", "leading", "left", "like", "like_regex", "listagg", "ln", "local", "localtime", "localtimestamp", "log", "log10", "lower", "match", "match_number", "match_recognize", "matches", "max", "member", "merge", "method", "min", "minute", "mod", "modifies", "module", "month", "multiset", "national", "natural", "nchar", "nclob", "new", "no", "none", "normalize", "not", "nth_value", "ntile", "null", "nullif", "numeric", "octet_length", "occurrences_regex", "of", "offset", "old", "omit", "on", "one", "only", "open", "or", "order", "out", "outer", "over", "overlaps", "overlay", "parameter", "partition", "pattern", "per", "percent", "percent_rank", "percentile_cont", "percentile_disc", "period", "portion", "position", "position_regex", "power", "precedes", "precision", "prepare", "primary", "procedure", "ptf", "range", "rank", "reads", "real", "recursive", "ref", "references", "referencing", "regr_avgx", "regr_avgy", "regr_count", "regr_intercept", "regr_r2", "regr_slope", "regr_sxx", "regr_sxy", "regr_syy", "release", "result", "return", "returns", "revoke", "right", "rollback", "rollup", "row", "row_number", "rows", "running", "savepoint", "scope", "scroll", "search", "second", "seek", "select", "sensitive", "session_user", "set", "show", "similar", "sin", "sinh", "skip", "smallint", "some", "specific", "specifictype", "sql", "sqlexception", "sqlstate", "sqlwarning", "sqrt", "start", "static", "stddev_pop", "stddev_samp", "submultiset", "subset", "substring", "substring_regex", "succeeds", "sum", "symmetric", "system", "system_time", "system_user", "table", "tablesample", "tan", "tanh", "then", "time", "timestamp", "timezone_hour", "timezone_minute", "to", "trailing", "translate", "translate_regex", "translation", "treat", "trigger", "trim", "trim_array", "true", "truncate", "uescape", "union", "unique", "unknown", "unnest", "update", "upper", "user", "using", "value", "values", "value_of", "var_pop", "var_samp", "varbinary", "varchar", "varying", "versioning", "when", "whenever", "where", "width_bucket", "window", "with", "within", "without", "year", "add", "asc", "collation", "desc", "final", "first", "last", "view"].filter(((e3) => !a2.includes(e3))), s2 = {
      match: n2.concat(/\b/, n2.either(...i2), /\s*\(/),
      relevance: 0,
      keywords: { built_in: i2 }
    };
    function o2(e3) {
      return n2.concat(/\b/, n2.either(...e3.map(((e4) => e4.replace(/\s+/, "\\s+")))), /\b/);
    }
    const l2 = {
      scope: "keyword",
      match: o2(["create table", "insert into", "primary key", "foreign key", "not null", "alter table", "add constraint", "grouping sets", "on overflow", "character set", "respect nulls", "ignore nulls", "nulls first", "nulls last", "depth first", "breadth first"]),
      relevance: 0
    };
    return { name: "SQL", case_insensitive: true, illegal: /[{}]|<\//, keywords: {
      $pattern: /\b[\w\.]+/,
      keyword: ((e3, { exceptions: n3, when: t3 } = {}) => {
        const a3 = t3;
        return n3 = n3 || [], e3.map(((e4) => e4.match(/\|\d+$/) || n3.includes(e4) ? e4 : a3(e4) ? e4 + "|0" : e4));
      })(r2, { when: (e3) => e3.length < 3 }),
      literal: ["true", "false", "unknown"],
      type: ["bigint", "binary", "blob", "boolean", "char", "character", "clob", "date", "dec", "decfloat", "decimal", "float", "int", "integer", "interval", "nchar", "nclob", "national", "numeric", "real", "row", "smallint", "time", "timestamp", "varchar", "varying", "varbinary"],
      built_in: ["current_catalog", "current_date", "current_default_transform_group", "current_path", "current_role", "current_schema", "current_transform_group_for_type", "current_user", "session_user", "system_time", "system_user", "current_time", "localtime", "current_timestamp", "localtimestamp"]
    }, contains: [{
      scope: "type",
      match: o2(["double precision", "large object", "with timezone", "without timezone"])
    }, l2, s2, { scope: "variable", match: /@[a-z0-9][a-z0-9_]*/ }, { scope: "string", variants: [{
      begin: /'/,
      end: /'/,
      contains: [{ match: /''/ }]
    }] }, { begin: /"/, end: /"/, contains: [{
      match: /""/
    }] }, e2.C_NUMBER_MODE, e2.C_BLOCK_COMMENT_MODE, t2, {
      scope: "operator",
      match: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,
      relevance: 0
    }] };
  },
  grmr_swift: (e2) => {
    const n2 = { match: /\s+/, relevance: 0 }, t2 = e2.COMMENT("/\\*", "\\*/", {
      contains: ["self"]
    }), a2 = [e2.C_LINE_COMMENT_MODE, t2], i2 = {
      match: [/\./, m(...ke, ...xe)],
      className: { 2: "keyword" }
    }, r2 = {
      match: b(/\./, m(...Me)),
      relevance: 0
    }, s2 = Me.filter(((e3) => "string" == typeof e3)).concat(["_|0"]), o2 = { variants: [{
      className: "keyword",
      match: m(...Me.filter(((e3) => "string" != typeof e3)).concat(Oe).map(Ne), ...xe)
    }] }, l2 = {
      $pattern: m(/\b\w+/, /#\w+/),
      keyword: s2.concat(Ce),
      literal: Ae
    }, c2 = [i2, r2, o2], g2 = [{
      match: b(/\./, m(...Te)),
      relevance: 0
    }, {
      className: "built_in",
      match: b(/\b/, m(...Te), /(?=\()/)
    }], u2 = { match: /->/, relevance: 0 }, p2 = [u2, {
      className: "operator",
      relevance: 0,
      variants: [{ match: Ie }, { match: `\\.(\\.|${De})+` }]
    }], _2 = "([0-9]_*)+", h2 = "([0-9a-fA-F]_*)+", f2 = {
      className: "number",
      relevance: 0,
      variants: [{ match: `\\b(${_2})(\\.(${_2}))?([eE][+-]?(${_2}))?\\b` }, {
        match: `\\b0x(${h2})(\\.(${h2}))?([pP][+-]?(${_2}))?\\b`
      }, {
        match: /\b0o([0-7]_*)+\b/
      }, { match: /\b0b([01]_*)+\b/ }]
    }, E2 = (e3 = "") => ({
      className: "subst",
      variants: [{
        match: b(/\\/, e3, /[0\\tnr"']/)
      }, { match: b(/\\/, e3, /u\{[0-9a-fA-F]{1,8}\}/) }]
    }), y2 = (e3 = "") => ({
      className: "subst",
      match: b(/\\/, e3, /[\t ]*(?:[\r\n]|\r\n)/)
    }), w2 = (e3 = "") => ({
      className: "subst",
      label: "interpol",
      begin: b(/\\/, e3, /\(/),
      end: /\)/
    }), v2 = (e3 = "") => ({
      begin: b(e3, /"""/),
      end: b(/"""/, e3),
      contains: [E2(e3), y2(e3), w2(e3)]
    }), N2 = (e3 = "") => ({ begin: b(e3, /"/), end: b(/"/, e3), contains: [E2(e3), w2(e3)] }), k2 = {
      className: "string",
      variants: [v2(), v2("#"), v2("##"), v2("###"), N2(), N2("#"), N2("##"), N2("###")]
    }, x2 = [e2.BACKSLASH_ESCAPE, {
      begin: /\[/,
      end: /\]/,
      relevance: 0,
      contains: [e2.BACKSLASH_ESCAPE]
    }], O2 = {
      begin: /\/[^\s](?=[^/\n]*\/)/,
      end: /\//,
      contains: x2
    }, M2 = (e3) => {
      const n3 = b(e3, /\//), t3 = b(/\//, e3);
      return {
        begin: n3,
        end: t3,
        contains: [...x2, { scope: "comment", begin: `#(?!.*${t3})`, end: /$/ }]
      };
    }, A2 = {
      scope: "regexp",
      variants: [M2("###"), M2("##"), M2("#"), O2]
    }, S2 = {
      match: b(/`/, $e, /`/)
    }, C2 = [S2, { className: "variable", match: /\$\d+/ }, {
      className: "variable",
      match: `\\$${Be}+`
    }], T2 = [{ match: /(@|#(un)?)available/, scope: "keyword", starts: {
      contains: [{ begin: /\(/, end: /\)/, keywords: je, contains: [...p2, f2, k2] }]
    } }, {
      scope: "keyword",
      match: b(/@/, m(...ze), d(m(/\(/, /\s+/)))
    }, {
      scope: "meta",
      match: b(/@/, $e)
    }], R2 = { match: d(/\b[A-Z]/), relevance: 0, contains: [{
      className: "type",
      match: b(/(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)/, Be, "+")
    }, { className: "type", match: Fe, relevance: 0 }, { match: /[?!]+/, relevance: 0 }, {
      match: /\.\.\./,
      relevance: 0
    }, { match: b(/\s+&\s+/, d(Fe)), relevance: 0 }] }, D2 = {
      begin: /</,
      end: />/,
      keywords: l2,
      contains: [...a2, ...c2, ...T2, u2, R2]
    };
    R2.contains.push(D2);
    const I2 = { begin: /\(/, end: /\)/, relevance: 0, keywords: l2, contains: ["self", {
      match: b($e, /\s*:/),
      keywords: "_|0",
      relevance: 0
    }, ...a2, A2, ...c2, ...g2, ...p2, f2, k2, ...C2, ...T2, R2] }, L2 = {
      begin: /</,
      end: />/,
      keywords: "repeat each",
      contains: [...a2, R2]
    }, B2 = {
      begin: /\(/,
      end: /\)/,
      keywords: l2,
      contains: [{
        begin: m(d(b($e, /\s*:/)), d(b($e, /\s+/, $e, /\s*:/))),
        end: /:/,
        relevance: 0,
        contains: [{ className: "keyword", match: /\b_\b/ }, {
          className: "params",
          match: $e
        }]
      }, ...a2, ...c2, ...p2, f2, k2, ...T2, R2, I2],
      endsParent: true,
      illegal: /["']/
    }, $2 = {
      match: [/(func|macro)/, /\s+/, m(S2.match, $e, Ie)],
      className: {
        1: "keyword",
        3: "title.function"
      },
      contains: [L2, B2, n2],
      illegal: [/\[/, /%/]
    }, F2 = {
      match: [/\b(?:subscript|init[?!]?)/, /\s*(?=[<(])/],
      className: { 1: "keyword" },
      contains: [L2, B2, n2],
      illegal: /\[|%/
    }, z2 = { match: [/operator/, /\s+/, Ie], className: {
      1: "keyword",
      3: "title"
    } }, j2 = { begin: [/precedencegroup/, /\s+/, Fe], className: {
      1: "keyword",
      3: "title"
    }, contains: [R2], keywords: [...Se, ...Ae], end: /}/ }, U2 = {
      begin: [/(struct|protocol|class|extension|enum|actor)/, /\s+/, $e, /\s*/],
      beginScope: { 1: "keyword", 3: "title.class" },
      keywords: l2,
      contains: [L2, ...c2, {
        begin: /:/,
        end: /\{/,
        keywords: l2,
        contains: [{ scope: "title.class.inherited", match: Fe }, ...c2],
        relevance: 0
      }]
    };
    for (const e3 of k2.variants) {
      const n3 = e3.contains.find(((e4) => "interpol" === e4.label));
      n3.keywords = l2;
      const t3 = [...c2, ...g2, ...p2, f2, k2, ...C2];
      n3.contains = [...t3, {
        begin: /\(/,
        end: /\)/,
        contains: ["self", ...t3]
      }];
    }
    return { name: "Swift", keywords: l2, contains: [...a2, $2, F2, {
      match: [/class\b/, /\s+/, /func\b/, /\s+/, /\b[A-Za-z_][A-Za-z0-9_]*\b/],
      scope: {
        1: "keyword",
        3: "keyword",
        5: "title.function"
      }
    }, {
      match: [/class\b/, /\s+/, /var\b/],
      scope: { 1: "keyword", 3: "keyword" }
    }, U2, z2, j2, {
      beginKeywords: "import",
      end: /$/,
      contains: [...a2],
      relevance: 0
    }, A2, ...c2, ...g2, ...p2, f2, k2, ...C2, ...T2, R2, I2] };
  },
  grmr_typescript: (e2) => {
    const n2 = e2.regex, t2 = ve(e2), a2 = me, i2 = ["any", "void", "number", "boolean", "string", "object", "never", "symbol", "bigint", "unknown"], r2 = {
      begin: [/namespace/, /\s+/, e2.IDENT_RE],
      beginScope: { 1: "keyword", 3: "title.class" }
    }, s2 = {
      beginKeywords: "interface",
      end: /\{/,
      excludeEnd: true,
      keywords: {
        keyword: "interface extends",
        built_in: i2
      },
      contains: [t2.exports.CLASS_REFERENCE]
    }, o2 = {
      $pattern: me,
      keyword: pe.concat(["type", "interface", "public", "private", "protected", "implements", "declare", "abstract", "readonly", "enum", "override", "satisfies"]),
      literal: _e,
      built_in: we.concat(i2),
      "variable.language": ye
    }, l2 = {
      className: "meta",
      begin: "@" + a2
    }, c2 = (e3, n3, t3) => {
      const a3 = e3.contains.findIndex(((e4) => e4.label === n3));
      if (-1 === a3) throw Error("can not find mode to replace");
      e3.contains.splice(a3, 1, t3);
    };
    Object.assign(t2.keywords, o2), t2.exports.PARAMS_CONTAINS.push(l2);
    const d2 = t2.contains.find(((e3) => "attr" === e3.scope)), g2 = Object.assign({}, d2, {
      match: n2.concat(a2, n2.lookahead(/\s*\?:/))
    });
    return t2.exports.PARAMS_CONTAINS.push([t2.exports.CLASS_REFERENCE, d2, g2]), t2.contains = t2.contains.concat([l2, r2, s2, g2]), c2(t2, "shebang", e2.SHEBANG()), c2(t2, "use_strict", {
      className: "meta",
      relevance: 10,
      begin: /^\s*['"]use strict['"]/
    }), t2.contains.find(((e3) => "func.def" === e3.label)).relevance = 0, Object.assign(t2, {
      name: "TypeScript",
      aliases: ["ts", "tsx", "mts", "cts"]
    }), t2;
  },
  grmr_vbnet: (e2) => {
    const n2 = e2.regex, t2 = /\d{1,2}\/\d{1,2}\/\d{4}/, a2 = /\d{4}-\d{1,2}-\d{1,2}/, i2 = /(\d|1[012])(:\d+){0,2} *(AM|PM)/, r2 = /\d{1,2}(:\d{1,2}){1,2}/, s2 = {
      className: "literal",
      variants: [{ begin: n2.concat(/# */, n2.either(a2, t2), / *#/) }, {
        begin: n2.concat(/# */, r2, / *#/)
      }, { begin: n2.concat(/# */, i2, / *#/) }, {
        begin: n2.concat(/# */, n2.either(a2, t2), / +/, n2.either(i2, r2), / *#/)
      }]
    }, o2 = e2.COMMENT(/'''/, /$/, {
      contains: [{ className: "doctag", begin: /<\/?/, end: />/ }]
    }), l2 = e2.COMMENT(null, /$/, { variants: [{ begin: /'/ }, { begin: /([\t ]|^)REM(?=\s)/ }] });
    return {
      name: "Visual Basic .NET",
      aliases: ["vb"],
      case_insensitive: true,
      classNameAliases: { label: "symbol" },
      keywords: {
        keyword: "addhandler alias aggregate ansi as async assembly auto binary by byref byval call case catch class compare const continue custom declare default delegate dim distinct do each equals else elseif end enum erase error event exit explicit finally for friend from function get global goto group handles if implements imports in inherits interface into iterator join key let lib loop me mid module mustinherit mustoverride mybase myclass namespace narrowing new next notinheritable notoverridable of off on operator option optional order overloads overridable overrides paramarray partial preserve private property protected public raiseevent readonly redim removehandler resume return select set shadows shared skip static step stop structure strict sub synclock take text then throw to try unicode until using when where while widening with withevents writeonly yield",
        built_in: "addressof and andalso await directcast gettype getxmlnamespace is isfalse isnot istrue like mod nameof new not or orelse trycast typeof xor cbool cbyte cchar cdate cdbl cdec cint clng cobj csbyte cshort csng cstr cuint culng cushort",
        type: "boolean byte char date decimal double integer long object sbyte short single string uinteger ulong ushort",
        literal: "true false nothing"
      },
      illegal: "//|\\{|\\}|endif|gosub|variant|wend|^\\$ ",
      contains: [{
        className: "string",
        begin: /"(""|[^/n])"C\b/
      }, {
        className: "string",
        begin: /"/,
        end: /"/,
        illegal: /\n/,
        contains: [{ begin: /""/ }]
      }, s2, {
        className: "number",
        relevance: 0,
        variants: [{
          begin: /\b\d[\d_]*((\.[\d_]+(E[+-]?[\d_]+)?)|(E[+-]?[\d_]+))[RFD@!#]?/
        }, { begin: /\b\d[\d_]*((U?[SIL])|[%&])?/ }, { begin: /&H[\dA-F_]+((U?[SIL])|[%&])?/ }, {
          begin: /&O[0-7_]+((U?[SIL])|[%&])?/
        }, { begin: /&B[01_]+((U?[SIL])|[%&])?/ }]
      }, {
        className: "label",
        begin: /^\w+:/
      }, o2, l2, {
        className: "meta",
        begin: /[\t ]*#(const|disable|else|elseif|enable|end|externalsource|if|region)\b/,
        end: /$/,
        keywords: {
          keyword: "const disable else elseif enable end externalsource if region then"
        },
        contains: [l2]
      }]
    };
  },
  grmr_wasm: (e2) => {
    e2.regex;
    const n2 = e2.COMMENT(/\(;/, /;\)/);
    return n2.contains.push("self"), { name: "WebAssembly", keywords: {
      $pattern: /[\w.]+/,
      keyword: ["anyfunc", "block", "br", "br_if", "br_table", "call", "call_indirect", "data", "drop", "elem", "else", "end", "export", "func", "global.get", "global.set", "local.get", "local.set", "local.tee", "get_global", "get_local", "global", "if", "import", "local", "loop", "memory", "memory.grow", "memory.size", "module", "mut", "nop", "offset", "param", "result", "return", "select", "set_global", "set_local", "start", "table", "tee_local", "then", "type", "unreachable"]
    }, contains: [e2.COMMENT(/;;/, /$/), n2, {
      match: [/(?:offset|align)/, /\s*/, /=/],
      className: { 1: "keyword", 3: "operator" }
    }, { className: "variable", begin: /\$[\w_]+/ }, {
      match: /(\((?!;)|\))+/,
      className: "punctuation",
      relevance: 0
    }, {
      begin: [/(?:func|call|call_indirect)/, /\s+/, /\$[^\s)]+/],
      className: {
        1: "keyword",
        3: "title.function"
      }
    }, e2.QUOTE_STRING_MODE, {
      match: /(i32|i64|f32|f64)(?!\.)/,
      className: "type"
    }, {
      className: "keyword",
      match: /\b(f32|f64|i32|i64)(?:\.(?:abs|add|and|ceil|clz|const|convert_[su]\/i(?:32|64)|copysign|ctz|demote\/f64|div(?:_[su])?|eqz?|extend_[su]\/i32|floor|ge(?:_[su])?|gt(?:_[su])?|le(?:_[su])?|load(?:(?:8|16|32)_[su])?|lt(?:_[su])?|max|min|mul|nearest|neg?|or|popcnt|promote\/f32|reinterpret\/[fi](?:32|64)|rem_[su]|rot[lr]|shl|shr_[su]|store(?:8|16|32)?|sqrt|sub|trunc(?:_[su]\/f(?:32|64))?|wrap\/i64|xor))\b/
    }, {
      className: "number",
      relevance: 0,
      match: /[+-]?\b(?:\d(?:_?\d)*(?:\.\d(?:_?\d)*)?(?:[eE][+-]?\d(?:_?\d)*)?|0x[\da-fA-F](?:_?[\da-fA-F])*(?:\.[\da-fA-F](?:_?[\da-fA-D])*)?(?:[pP][+-]?\d(?:_?\d)*)?)\b|\binf\b|\bnan(?::0x[\da-fA-F](?:_?[\da-fA-D])*)?\b/
    }] };
  },
  grmr_xml: (e2) => {
    const n2 = e2.regex, t2 = n2.concat(/[\p{L}_]/u, n2.optional(/[\p{L}0-9_.-]*:/u), /[\p{L}0-9_.-]*/u), a2 = {
      className: "symbol",
      begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
    }, i2 = {
      begin: /\s/,
      contains: [{ className: "keyword", begin: /#?[a-z_][a-z1-9_-]+/, illegal: /\n/ }]
    }, r2 = e2.inherit(i2, { begin: /\(/, end: /\)/ }), s2 = e2.inherit(e2.APOS_STRING_MODE, {
      className: "string"
    }), o2 = e2.inherit(e2.QUOTE_STRING_MODE, { className: "string" }), l2 = {
      endsWithParent: true,
      illegal: /</,
      relevance: 0,
      contains: [{
        className: "attr",
        begin: /[\p{L}0-9._:-]+/u,
        relevance: 0
      }, { begin: /=\s*/, relevance: 0, contains: [{
        className: "string",
        endsParent: true,
        variants: [{ begin: /"/, end: /"/, contains: [a2] }, {
          begin: /'/,
          end: /'/,
          contains: [a2]
        }, { begin: /[^\s"'=<>`]+/ }]
      }] }]
    };
    return {
      name: "HTML, XML",
      aliases: ["html", "xhtml", "rss", "atom", "xjb", "xsd", "xsl", "plist", "wsf", "svg"],
      case_insensitive: true,
      unicodeRegex: true,
      contains: [{
        className: "meta",
        begin: /<![a-z]/,
        end: />/,
        relevance: 10,
        contains: [i2, o2, s2, r2, { begin: /\[/, end: /\]/, contains: [{
          className: "meta",
          begin: /<![a-z]/,
          end: />/,
          contains: [i2, r2, o2, s2]
        }] }]
      }, e2.COMMENT(/<!--/, /-->/, { relevance: 10 }), {
        begin: /<!\[CDATA\[/,
        end: /\]\]>/,
        relevance: 10
      }, a2, { className: "meta", end: /\?>/, variants: [{
        begin: /<\?xml/,
        relevance: 10,
        contains: [o2]
      }, { begin: /<\?[a-z][a-z0-9]+/ }] }, {
        className: "tag",
        begin: /<style(?=\s|>)/,
        end: />/,
        keywords: { name: "style" },
        contains: [l2],
        starts: {
          end: /<\/style>/,
          returnEnd: true,
          subLanguage: ["css", "xml"]
        }
      }, {
        className: "tag",
        begin: /<script(?=\s|>)/,
        end: />/,
        keywords: { name: "script" },
        contains: [l2],
        starts: {
          end: /<\/script>/,
          returnEnd: true,
          subLanguage: ["javascript", "handlebars", "xml"]
        }
      }, {
        className: "tag",
        begin: /<>|<\/>/
      }, {
        className: "tag",
        begin: n2.concat(/</, n2.lookahead(n2.concat(t2, n2.either(/\/>/, />/, /\s/)))),
        end: /\/?>/,
        contains: [{ className: "name", begin: t2, relevance: 0, starts: l2 }]
      }, {
        className: "tag",
        begin: n2.concat(/<\//, n2.lookahead(n2.concat(t2, />/))),
        contains: [{
          className: "name",
          begin: t2,
          relevance: 0
        }, { begin: />/, relevance: 0, endsParent: true }]
      }]
    };
  },
  grmr_yaml: (e2) => {
    const n2 = "true false yes no null", t2 = "[\\w#;/?:@&=+$,.~*'()[\\]]+", a2 = {
      className: "string",
      relevance: 0,
      variants: [{ begin: /"/, end: /"/ }, { begin: /\S+/ }],
      contains: [e2.BACKSLASH_ESCAPE, { className: "template-variable", variants: [{
        begin: /\{\{/,
        end: /\}\}/
      }, { begin: /%\{/, end: /\}/ }] }]
    }, i2 = e2.inherit(a2, { variants: [{
      begin: /'/,
      end: /'/,
      contains: [{ begin: /''/, relevance: 0 }]
    }, { begin: /"/, end: /"/ }, {
      begin: /[^\s,{}[\]]+/
    }] }), r2 = {
      end: ",",
      endsWithParent: true,
      excludeEnd: true,
      keywords: n2,
      relevance: 0
    }, s2 = { begin: /\{/, end: /\}/, contains: [r2], illegal: "\\n", relevance: 0 }, o2 = {
      begin: "\\[",
      end: "\\]",
      contains: [r2],
      illegal: "\\n",
      relevance: 0
    }, l2 = [{
      className: "attr",
      variants: [{ begin: /[\w*@][\w*@ :()\./-]*:(?=[ \t]|$)/ }, {
        begin: /"[\w*@][\w*@ :()\./-]*":(?=[ \t]|$)/
      }, {
        begin: /'[\w*@][\w*@ :()\./-]*':(?=[ \t]|$)/
      }]
    }, {
      className: "meta",
      begin: "^---\\s*$",
      relevance: 10
    }, {
      className: "string",
      begin: "[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*"
    }, {
      begin: "<%[%=-]?",
      end: "[%-]?%>",
      subLanguage: "ruby",
      excludeBegin: true,
      excludeEnd: true,
      relevance: 0
    }, { className: "type", begin: "!\\w+!" + t2 }, {
      className: "type",
      begin: "!<" + t2 + ">"
    }, { className: "type", begin: "!" + t2 }, {
      className: "type",
      begin: "!!" + t2
    }, { className: "meta", begin: "&" + e2.UNDERSCORE_IDENT_RE + "$" }, {
      className: "meta",
      begin: "\\*" + e2.UNDERSCORE_IDENT_RE + "$"
    }, {
      className: "bullet",
      begin: "-(?=[ ]|$)",
      relevance: 0
    }, e2.HASH_COMMENT_MODE, { beginKeywords: n2, keywords: { literal: n2 } }, {
      className: "number",
      begin: "\\b[0-9]{4}(-[0-9][0-9]){0,2}([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?(\\.[0-9]*)?([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?\\b"
    }, { className: "number", begin: e2.C_NUMBER_RE + "\\b", relevance: 0 }, s2, o2, {
      className: "string",
      relevance: 0,
      begin: /'/,
      end: /'/,
      contains: [{
        match: /''/,
        scope: "char.escape",
        relevance: 0
      }]
    }, a2], c2 = [...l2];
    return c2.pop(), c2.push(i2), r2.contains = c2, {
      name: "YAML",
      case_insensitive: true,
      aliases: ["yml"],
      contains: l2
    };
  }
});
const Pe = ne;
for (const e2 of Object.keys(Ue)) {
  const n2 = e2.replace("grmr_", "").replace("_", "-");
  Pe.registerLanguage(n2, Ue[e2]);
}
const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
  highlight(code2, language) {
    const canHighlight = language && Pe.getLanguage(language);
    if (canHighlight) {
      try {
        return `<pre class="hljs"><code>${Pe.highlight(code2, { language }).value}</code></pre>`;
      } catch {
        return "";
      }
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(code2)}</code></pre>`;
  }
}).use(taskLists, {
  enabled: true,
  label: true
});
const defaultImageRenderer = md.renderer.rules.image || ((tokens, idx, options, _env, self2) => self2.renderToken(tokens, idx, options));
md.renderer.rules.image = (tokens, idx, options, env, self2) => {
  const srcIndex = tokens[idx].attrIndex("src");
  if (srcIndex >= 0) {
    const original = tokens[idx].attrs[srcIndex][1];
    const resolved = env.assetMap?.get(original);
    tokens[idx].attrSet("data-original-src", original);
    if (resolved) tokens[idx].attrs[srcIndex][1] = resolved;
  }
  return defaultImageRenderer(tokens, idx, options, env, self2);
};
function extractImageSources(markdown) {
  return [...markdown.matchAll(/!\[[^\]]*]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g)].map(
    (match2) => match2[1]
  );
}
function useMarkdownRenderer(api) {
  const html2 = /* @__PURE__ */ ref("");
  let renderingToken = 0;
  async function collectAssetMap(markdown, markdownFilePath, syncSettings) {
    const sources = [...new Set(extractImageSources(markdown))];
    const assetMap = /* @__PURE__ */ new Map();
    await Promise.all(
      sources.map(async (source) => {
        try {
          const resolved = await api.resolveAssetUrl(markdownFilePath, source, syncSettings);
          assetMap.set(source, resolved);
        } catch {
          assetMap.set(source, source);
        }
      })
    );
    return assetMap;
  }
  async function render(markdown, markdownFilePath, syncSettings = null) {
    const token = ++renderingToken;
    const assetMap = await collectAssetMap(markdown, markdownFilePath, syncSettings);
    if (token !== renderingToken) return;
    const unsafeHtml = md.render(markdown, { assetMap });
    html2.value = purify.sanitize(unsafeHtml, {
      ADD_ATTR: ["target", "rel", "checked", "data-original-src"],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|file|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
    });
  }
  return {
    html: html2,
    render
  };
}
const _hoisted_1 = {
  key: 1,
  class: "shell"
};
const _hoisted_2 = {
  class: "toast-icon",
  "aria-hidden": "true"
};
const _hoisted_3 = { class: "toast-message" };
const _hoisted_4 = { id: "inputDialogTitle" };
const _hoisted_5 = { class: "input-dialog-actions" };
const _sfc_main = {
  __name: "App",
  setup(__props) {
    const api = window.mdPreview;
    const hasDesktopApi = Boolean(api);
    const defaultS3Settings = {
      endpoint: "",
      region: "auto",
      bucket: "",
      accessKeyId: "",
      secretAccessKey: "",
      publicBaseUrl: "",
      prefix: "MdPreview/",
      imagePath: "images",
      forcePathStyle: false
    };
    const defaultWebDavSettings = {
      url: "",
      publicBaseUrl: "",
      username: "",
      password: "",
      remotePath: "/MdPreview"
    };
    const defaultSettings = {
      image: {
        imageProvider: "local",
        imageSavePath: "images",
        s3: { ...defaultS3Settings }
      },
      remote: {
        webdav: { ...defaultWebDavSettings },
        webdavImagePath: "images"
      }
    };
    const state = createInitialDocumentState();
    const statusText = /* @__PURE__ */ ref("Ready");
    const folderPath = /* @__PURE__ */ ref("");
    const folderName = /* @__PURE__ */ ref("");
    const folderFiles = /* @__PURE__ */ ref([]);
    const isUnsavedDialogOpen = /* @__PURE__ */ ref(false);
    const isInputDialogOpen = /* @__PURE__ */ ref(false);
    const isSettingsOpen = /* @__PURE__ */ ref(false);
    const notification = /* @__PURE__ */ ref(null);
    const editorSessionKey = /* @__PURE__ */ ref(0);
    const editorPaneRef = /* @__PURE__ */ ref(null);
    const previewPaneRef = /* @__PURE__ */ ref(null);
    const inputDialogInputRef = /* @__PURE__ */ ref(null);
    const inputDialog = /* @__PURE__ */ ref({
      title: "",
      value: ""
    });
    const appSettings = /* @__PURE__ */ ref(loadSettings());
    const pendingInsertedImages = /* @__PURE__ */ ref([]);
    const { isDirty: isDirty2, title, wordCount, setDocument, markSaved } = useDocumentState(state);
    const { html: html2, render } = hasDesktopApi ? useMarkdownRenderer(api) : { html: /* @__PURE__ */ ref(""), render: async () => {
    } };
    const workspaceClass = computed(
      () => `workspace ${state.view}-view ${folderName.value ? "has-sidebar" : ""}`
    );
    const assetBasePath = computed(() => state.filePath || folderPath.value || null);
    const currentOutline = computed(() => {
      let headingIndex = 0;
      return state.content.split(/\r?\n/).map((line, index) => {
        const match2 = /^(#{1,6})\s+(.+)$/.exec(line.trim());
        if (!match2) return null;
        const item = {
          id: `${index}-${match2[1].length}`,
          level: match2[1].length,
          lineIndex: index,
          headingIndex,
          title: match2[2].replace(/[`*_~]/g, "").trim()
        };
        headingIndex += 1;
        return item;
      }).filter(Boolean);
    });
    let removeOpenListener = null;
    let removeCloseListener = null;
    let unsavedDialogResolver = null;
    let inputDialogResolver = null;
    let notificationTimer = null;
    function loadSettings() {
      try {
        const savedSettings = JSON.parse(localStorage.getItem("mdpreview-settings") || "{}");
        return normalizeSettings(savedSettings);
      } catch {
        return JSON.parse(JSON.stringify(defaultSettings));
      }
    }
    function normalizeS3Settings(settings = {}) {
      return {
        ...defaultS3Settings,
        ...settings,
        imagePath: settings.imagePath || settings.imageSavePath || defaultS3Settings.imagePath
      };
    }
    function normalizeWebDavSettings(settings = {}) {
      return {
        ...defaultWebDavSettings,
        ...settings
      };
    }
    function normalizeSettings(settings = {}) {
      const hasCurrentShape = settings.image || settings.remote?.webdavImagePath;
      const hasPreviousShape = settings.local || settings.remote;
      const legacyImagePath = settings.imageSavePath || defaultSettings.image.imageSavePath;
      const legacyS3 = normalizeS3Settings(settings.s3 || {});
      const legacyWebDav = normalizeWebDavSettings(settings.webdav || {});
      if (!hasCurrentShape && !hasPreviousShape) {
        return {
          image: {
            imageProvider: "local",
            imageSavePath: legacyImagePath,
            s3: {
              ...legacyS3,
              imagePath: legacyImagePath
            }
          },
          remote: {
            webdav: legacyWebDav,
            webdavImagePath: legacyImagePath
          }
        };
      }
      const previousLocal = settings.local || {};
      const previousRemote = settings.remote || {};
      return {
        image: {
          ...defaultSettings.image,
          ...settings.image || previousLocal,
          s3: normalizeS3Settings(settings.image?.s3 || previousLocal.s3 || {})
        },
        remote: {
          ...defaultSettings.remote,
          ...previousRemote,
          webdav: normalizeWebDavSettings(previousRemote.webdav || {}),
          webdavImagePath: previousRemote.webdavImagePath || previousLocal.imageSavePath || settings.imageSavePath || defaultSettings.remote.webdavImagePath
        }
      };
    }
    function setStatus(message) {
      statusText.value = message;
    }
    function toSerializable(value) {
      if (!value) return null;
      return JSON.parse(JSON.stringify(value));
    }
    function showNotification(message, type = "success") {
      notification.value = {
        id: Date.now(),
        message,
        type
      };
      window.clearTimeout(notificationTimer);
      notificationTimer = window.setTimeout(() => {
        notification.value = null;
      }, 2600);
    }
    function closeNotification() {
      notification.value = null;
      window.clearTimeout(notificationTimer);
    }
    function handleSettingsStatus(message) {
      const isError = /失败|错误|需要重启/.test(message);
      setStatus(message);
      showNotification(message, isError ? "error" : "success");
    }
    function persistSettings(settings) {
      appSettings.value = normalizeSettings(settings);
      localStorage.setItem("mdpreview-settings", JSON.stringify(appSettings.value));
    }
    function saveSettings(settings) {
      persistSettings(settings);
      setStatus("设置已保存");
      showNotification("设置已保存", "success");
    }
    function saveImageSettings(settings) {
      persistSettings({
        ...appSettings.value,
        image: settings
      });
      setStatus("图像设置已保存");
      showNotification("图像设置已保存", "success");
    }
    function saveRemoteSettings(settings) {
      persistSettings({
        ...appSettings.value,
        remote: settings
      });
      setStatus("远程设置已保存");
      showNotification("远程设置已保存", "success");
    }
    function createS3SyncSettings(s3) {
      return {
        syncProvider: "s3",
        s3: normalizeS3Settings(s3)
      };
    }
    function createWebDavSyncSettings(webdav) {
      return {
        syncProvider: "webdav",
        webdav: normalizeWebDavSettings(webdav)
      };
    }
    function getRemoteSyncSettings() {
      return createWebDavSyncSettings(appSettings.value.remote.webdav);
    }
    const activeImageConfig = computed(() => {
      const isRemoteDocument = state.filePath?.startsWith("webdav://") || folderPath.value?.startsWith("webdav://");
      if (isRemoteDocument) {
        const remote = appSettings.value.remote;
        return {
          imageSavePath: remote.webdavImagePath || "images",
          syncSettings: createWebDavSyncSettings(remote.webdav)
        };
      }
      const image2 = appSettings.value.image;
      if (image2.imageProvider === "s3") {
        return {
          imageSavePath: image2.s3.imagePath || "images",
          syncSettings: createS3SyncSettings(image2.s3)
        };
      }
      return {
        imageSavePath: image2.imageSavePath || "images",
        syncSettings: null
      };
    });
    function loadDocument(documentState) {
      setDocument(documentState);
      editorSessionKey.value += 1;
    }
    function setView(view) {
      state.view = view;
    }
    function setTheme(theme) {
      state.theme = normalizeTheme(theme);
      document.documentElement.dataset.theme = state.theme;
      localStorage.setItem("mdpreview-theme", state.theme);
    }
    function runEditorCommand(command) {
      editorPaneRef.value?.runCommand(command);
    }
    function handleOutlineSelect(item) {
      if (state.view !== "source") {
        previewPaneRef.value?.scrollToOutline(item);
      }
      if (state.view !== "preview") {
        editorPaneRef.value?.scrollToLine(item.lineIndex);
      }
    }
    function registerPendingImage(image2) {
      if (!image2?.type) return;
      pendingInsertedImages.value = [...pendingInsertedImages.value, toSerializable(image2)];
    }
    function confirmPendingImages() {
      pendingInsertedImages.value = [];
    }
    async function cleanupPendingImages() {
      if (pendingInsertedImages.value.length === 0) return;
      const images = pendingInsertedImages.value;
      pendingInsertedImages.value = [];
      try {
        if (typeof api.deleteInsertedImages !== "function") {
          setStatus("清理未保存图片功能需要重启应用后生效");
          return;
        }
        const result = await api.deleteInsertedImages({
          images: toSerializable(images),
          syncSettings: toSerializable(activeImageConfig.value.syncSettings)
        });
        if (result?.failedCount > 0) {
          const message = `已清理 ${result.deletedCount} 张未保存图片，${result.failedCount} 张清理失败`;
          setStatus(message);
          showNotification(message, "error");
        } else if (result?.deletedCount > 0) {
          setStatus(`已清理 ${result.deletedCount} 张未保存图片`);
        }
      } catch (error2) {
        setStatus(`清理未保存图片失败：${error2.message}`);
        showNotification(`清理未保存图片失败：${error2.message}`, "error");
      }
    }
    function escapeHtmlText(value) {
      return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
    function createExportHtml() {
      return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtmlText(state.fileName)}</title>
  <style>
    body {
      margin: 0;
      background: #ffffff;
      color: #2f2a25;
      font-family: Georgia, "Times New Roman", "Songti SC", "SimSun", serif;
    }
    .markdown-body {
      box-sizing: border-box;
      width: min(100%, 820px);
      margin: 0 auto;
      padding: 48px 56px 72px;
      font-size: 17px;
      line-height: 1.82;
      overflow-wrap: anywhere;
    }
    h1, h2, h3, h4 { color: #211f1c; font-weight: 600; line-height: 1.35; }
    h1 { margin: 0 0 26px; padding-bottom: 12px; border-bottom: 1px solid #e7e2da; font-size: 30px; }
    h2 { margin: 36px 0 14px; font-size: 23px; }
    h3 { margin: 30px 0 10px; font-size: 19px; }
    h4 { margin: 24px 0 8px; font-size: 16px; }
    p, ul, ol, blockquote, table, pre { margin-top: 0; margin-bottom: 18px; }
    a { color: #28708d; text-decoration: none; }
    blockquote { padding: 2px 0 2px 17px; border-left: 4px solid #d7cdc1; color: #686058; }
    code { padding: 2px 5px; border-radius: 5px; background: #ece7df; color: #7a3e2f; font-family: Consolas, monospace; font-size: 0.9em; }
    pre { overflow: auto; padding: 16px 18px; border-radius: 7px; background: #f0ece5; }
    pre code { padding: 0; background: transparent; color: inherit; }
    table { width: 100%; border-collapse: collapse; font-size: 15px; }
    th, td { padding: 9px 11px; border: 1px solid #ded6ca; }
    th { background: #f0ebe3; font-weight: 600; }
    img { max-width: 100%; height: auto; border-radius: 4px; }
    hr { height: 1px; margin: 28px 0; border: 0; background: #e7e2da; }
    .task-list-item { list-style: none; }
  </style>
</head>
<body>
  <article class="markdown-body">${html2.value}</article>
</body>
</html>`;
    }
    async function exportDocument(format2) {
      try {
        if (typeof api.exportMarkdownDocument !== "function") {
          setStatus("导出功能需要重启应用后生效");
          return;
        }
        const result = await api.exportMarkdownDocument({
          format: format2,
          fileName: state.fileName,
          html: createExportHtml()
        });
        if (result?.canceled) return;
        setStatus(`已导出 ${result.fileName}`);
      } catch (error2) {
        setStatus(`导出失败：${error2.message}`);
      }
    }
    function requestUnsavedDecision() {
      isUnsavedDialogOpen.value = true;
      return new Promise((resolve) => {
        unsavedDialogResolver = resolve;
      });
    }
    function resolveUnsavedDecision(decision) {
      isUnsavedDialogOpen.value = false;
      unsavedDialogResolver?.(decision);
      unsavedDialogResolver = null;
    }
    async function maybeContinueWithUnsavedChanges() {
      if (!isDirty2.value) {
        await cleanupPendingImages();
        return true;
      }
      const decision = await requestUnsavedDecision();
      if (decision === "cancel") return false;
      if (decision === "discard") {
        await cleanupPendingImages();
        return true;
      }
      if (decision === "save") return saveFile();
      return false;
    }
    async function openFile(filePath) {
      if (!await maybeContinueWithUnsavedChanges()) return;
      try {
        const result = filePath?.startsWith("webdav://") ? await api.openRemoteMarkdownFile(filePath, toSerializable(getRemoteSyncSettings())) : await api.openMarkdownFile(filePath);
        if (result?.canceled) return;
        loadDocument(result);
        setStatus(`已打开 ${result.fileName}`);
      } catch (error2) {
        setStatus(`打开失败：${error2.message}`);
      }
    }
    function sortFolderFiles(files) {
      return [...files].sort((left, right) => left.relativePath.localeCompare(right.relativePath));
    }
    function createSummary(content) {
      return content.replace(/^#{1,6}\s+/gm, "").replace(/!\[[^\]]*]\([^)]+\)/g, "").replace(/\[([^\]]+)]\([^)]+\)/g, "$1").replace(/[`*_~>#-]/g, "").replace(/\s+/g, " ").trim().slice(0, 50);
    }
    function upsertFolderFile(file) {
      if (!file || !folderPath.value) return;
      const nextFiles = folderFiles.value.filter((item) => item.filePath !== file.filePath);
      nextFiles.push(file);
      folderFiles.value = sortFolderFiles(nextFiles);
    }
    function updateActiveFolderFileSummary() {
      if (!state.filePath || folderFiles.value.length === 0) return;
      folderFiles.value = folderFiles.value.map(
        (file) => file.filePath === state.filePath ? { ...file, summary: createSummary(state.content) } : file
      );
    }
    function getFolderActionDir(file) {
      if (!file?.filePath) return folderPath.value;
      if (file.filePath.startsWith("webdav://")) {
        const index = file.filePath.lastIndexOf("/");
        return index > "webdav://".length - 1 ? file.filePath.slice(0, index) : folderPath.value;
      }
      return file.filePath.split(/[\\/]/).slice(0, -1).join("\\") || folderPath.value;
    }
    function requestInputName(title2, defaultValue = "") {
      inputDialog.value = {
        title: title2,
        value: defaultValue
      };
      isInputDialogOpen.value = true;
      nextTick(() => {
        inputDialogInputRef.value?.focus();
        inputDialogInputRef.value?.select();
      });
      return new Promise((resolve) => {
        inputDialogResolver = resolve;
      });
    }
    function resolveInputDialog(value) {
      isInputDialogOpen.value = false;
      const nextValue = typeof value === "string" ? value.trim() : null;
      inputDialogResolver?.(nextValue || null);
      inputDialogResolver = null;
    }
    function applyFolderResult(folder) {
      if (!folder) return;
      folderName.value = folder.folderName;
      folderPath.value = folder.folderPath;
      folderFiles.value = folder.files || [];
    }
    async function handleFolderAction({ action, file }) {
      if (!folderPath.value) return;
      try {
        const isRemoteFolder = folderPath.value.startsWith("webdav://");
        const remoteSettings = toSerializable(getRemoteSyncSettings());
        if (action === "new-file") {
          const fileName = await requestInputName("新建 Markdown 文件", "Untitled.md");
          if (!fileName) return;
          const result = isRemoteFolder ? await api.createRemoteMarkdownFileInFolder({
            settings: remoteSettings,
            folderPath: folderPath.value,
            targetDirPath: getFolderActionDir(file),
            fileName
          }) : await api.createMarkdownFileInFolder({
            folderPath: folderPath.value,
            targetDirPath: getFolderActionDir(file),
            fileName
          });
          applyFolderResult(result.folder);
          await openFile(result.file.filePath);
          return;
        }
        if (action === "new-folder") {
          const newFolderName = await requestInputName("新建文件夹", "New Folder");
          if (!newFolderName) return;
          const result = isRemoteFolder ? await api.createRemoteFolderInFolder({
            settings: remoteSettings,
            folderPath: folderPath.value,
            targetDirPath: getFolderActionDir(file),
            folderName: newFolderName
          }) : await api.createFolderInFolder({
            folderPath: folderPath.value,
            targetDirPath: getFolderActionDir(file),
            folderName: newFolderName
          });
          applyFolderResult(result);
          setStatus(`已新建文件夹 ${newFolderName}`);
          return;
        }
        if (!file?.filePath) return;
        if (action === "rename") {
          const nextName = await requestInputName("重命名", file.fileName);
          if (!nextName || nextName === file.fileName) return;
          const result = isRemoteFolder ? await api.renameRemoteFolderItem({
            settings: remoteSettings,
            folderPath: folderPath.value,
            itemPath: file.filePath,
            newName: nextName
          }) : await api.renameFolderItem({
            folderPath: folderPath.value,
            itemPath: file.filePath,
            newName: nextName
          });
          applyFolderResult(result.folder);
          if (state.filePath === result.oldPath && result.file) {
            loadDocument(result.file);
            setStatus(`已重命名为 ${result.file.fileName}`);
          }
          return;
        }
        if (action === "duplicate") {
          const result = isRemoteFolder ? await api.duplicateRemoteFolderFile({
            settings: remoteSettings,
            folderPath: folderPath.value,
            filePath: file.filePath
          }) : await api.duplicateFolderFile({
            folderPath: folderPath.value,
            filePath: file.filePath
          });
          applyFolderResult(result.folder);
          setStatus(`已创建副本 ${result.file.fileName}`);
          return;
        }
        if (action === "delete") {
          if (!window.confirm(`确定删除 ${file.fileName}？`)) return;
          const result = isRemoteFolder ? await api.deleteRemoteFolderItem({
            settings: remoteSettings,
            folderPath: folderPath.value,
            itemPath: file.filePath
          }) : await api.deleteFolderItem({
            folderPath: folderPath.value,
            itemPath: file.filePath
          });
          applyFolderResult(result.folder);
          if (state.filePath === result.deletedPath) {
            loadDocument({
              filePath: null,
              fileName: "Untitled.md",
              content: ""
            });
          }
          setStatus(`已删除 ${file.fileName}`);
          return;
        }
        if (action === "show-location") {
          if (isRemoteFolder) await api.showRemoteFolderItem(remoteSettings, file.filePath);
          else await api.showFolderItem(file.filePath);
        }
      } catch (error2) {
        setStatus(`文件操作失败：${error2.message}`);
        showNotification(`文件操作失败：${error2.message}`, "error");
      }
    }
    async function createFile() {
      if (!await maybeContinueWithUnsavedChanges()) return;
      loadDocument({
        filePath: null,
        fileName: "Untitled.md",
        content: ""
      });
      setStatus("已新建未保存文档");
    }
    async function openFolder() {
      try {
        const result = await api.openMarkdownFolder();
        if (result?.canceled) return;
        folderName.value = result.folderName;
        folderPath.value = result.folderPath;
        folderFiles.value = result.files || [];
        setStatus(`已打开文件夹 ${result.folderName}，找到 ${folderFiles.value.length} 个 Markdown 文件`);
      } catch (error2) {
        setStatus(`打开文件夹失败：${error2.message}`);
      }
    }
    async function openRemoteFolder() {
      if (!await maybeContinueWithUnsavedChanges()) return;
      try {
        if (typeof api.openRemoteMarkdownFolder !== "function") {
          setStatus("打开远程文件夹功能需要重启应用后生效");
          return;
        }
        const result = await api.openRemoteMarkdownFolder(toSerializable(getRemoteSyncSettings()));
        if (result?.canceled) return;
        folderName.value = result.folderName;
        folderPath.value = result.folderPath;
        folderFiles.value = result.files || [];
        setStatus(`已打开远程文件夹 ${result.folderName}，找到 ${folderFiles.value.length} 个 Markdown 文件`);
      } catch (error2) {
        setStatus(`打开远程文件夹失败：${error2.message}`);
        showNotification(`打开远程文件夹失败：${error2.message}`, "error");
      }
    }
    async function saveFile() {
      try {
        const result = state.filePath?.startsWith("webdav://") ? await api.saveRemoteMarkdownFile(
          toSerializable(getRemoteSyncSettings()),
          state.filePath,
          state.content
        ) : await api.saveMarkdownFile(state.filePath, state.content, folderPath.value || null);
        if (result?.canceled) return false;
        markSaved(result);
        confirmPendingImages();
        upsertFolderFile(result.file);
        updateActiveFolderFileSummary();
        setStatus(`已保存 ${result.fileName}`);
        showNotification(`已保存 ${result.fileName}`, "success");
        return true;
      } catch (error2) {
        setStatus(`保存失败：${error2.message}`);
        showNotification(`保存失败：${error2.message}`, "error");
        return false;
      }
    }
    async function saveFileAs() {
      try {
        const result = await api.saveMarkdownFileAs(state.content, folderPath.value || null);
        if (result?.canceled) return false;
        markSaved(result);
        confirmPendingImages();
        upsertFolderFile(result.file);
        updateActiveFolderFileSummary();
        setStatus(`已另存为 ${result.fileName}`);
        showNotification(`已另存为 ${result.fileName}`, "success");
        return true;
      } catch (error2) {
        setStatus(`另存为失败：${error2.message}`);
        showNotification(`另存为失败：${error2.message}`, "error");
        return false;
      }
    }
    function handleKeyboard(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (event.shiftKey) saveFileAs();
        else saveFile();
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "n") {
        event.preventDefault();
        createFile();
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "o") {
        event.preventDefault();
        if (event.shiftKey) openFolder();
        else openFile();
      }
    }
    onMounted(async () => {
      if (!hasDesktopApi) return;
      setTheme(state.theme);
      loadDocument({
        filePath: null,
        fileName: "Untitled.md",
        content: sampleDocument
      });
      await render(state.content, assetBasePath.value, toSerializable(activeImageConfig.value.syncSettings));
      window.addEventListener("keydown", handleKeyboard);
      removeOpenListener = api.onOpenFromSystem((filePath) => openFile(filePath));
      removeCloseListener = api.onRequestClose(async () => {
        if (await maybeContinueWithUnsavedChanges()) {
          api.forceClose();
        }
      });
      try {
        const initialFile = await api.getInitialFile();
        if (initialFile && !initialFile.canceled) {
          loadDocument(initialFile);
          setStatus(`已打开 ${initialFile.fileName}`);
        }
      } catch (error2) {
        setStatus(`启动载入失败：${error2.message}`);
      }
    });
    onUnmounted(() => {
      removeOpenListener?.();
      removeCloseListener?.();
      window.clearTimeout(notificationTimer);
      window.removeEventListener("keydown", handleKeyboard);
    });
    watch(
      () => [state.content, assetBasePath.value, JSON.stringify(activeImageConfig.value.syncSettings)],
      () => render(state.content, assetBasePath.value, toSerializable(activeImageConfig.value.syncSettings)),
      { flush: "post" }
    );
    watch(title, (nextTitle) => api?.setWindowTitle(nextTitle), { immediate: true });
    watch(isDirty2, (dirty) => api?.setDocumentEdited(dirty), { immediate: true });
    return (_ctx, _cache) => {
      return !unref(hasDesktopApi) ? (openBlock(), createBlock(StartupError, { key: 0 })) : (openBlock(), createElementBlock("main", _hoisted_1, [
        createVNode(_sfc_main$8, {
          "is-dirty": unref(isDirty2),
          view: unref(state).view,
          theme: unref(state).theme,
          onCreate: createFile,
          onOpen: openFile,
          onOpenFolder: openFolder,
          onOpenRemoteFolder: openRemoteFolder,
          onSave: saveFile,
          onSaveAs: saveFileAs,
          onExport: exportDocument,
          onSettings: _cache[0] || (_cache[0] = ($event) => isSettingsOpen.value = true),
          onParagraphCommand: runEditorCommand,
          onFormatCommand: runEditorCommand,
          "onUpdate:view": setView,
          "onUpdate:theme": setTheme
        }, null, 8, ["is-dirty", "view", "theme"]),
        isSettingsOpen.value ? (openBlock(), createBlock(_sfc_main$1, {
          key: 0,
          settings: appSettings.value,
          onClose: _cache[1] || (_cache[1] = ($event) => isSettingsOpen.value = false),
          onStatus: handleSettingsStatus,
          onSave: saveSettings,
          onSaveImage: saveImageSettings,
          onSaveRemote: saveRemoteSettings
        }, null, 8, ["settings"])) : (openBlock(), createElementBlock("section", {
          key: 1,
          class: normalizeClass(workspaceClass.value)
        }, [
          folderName.value ? (openBlock(), createBlock(_sfc_main$3, {
            key: 0,
            "folder-name": folderName.value,
            files: folderFiles.value,
            outline: currentOutline.value,
            "active-file-path": unref(state).filePath,
            onCreateFile: createFile,
            onOpenFile: openFile,
            onFolderAction: handleFolderAction,
            onSelectOutline: handleOutlineSelect
          }, null, 8, ["folder-name", "files", "outline", "active-file-path"])) : createCommentVNode("", true),
          createVNode(_sfc_main$7, {
            ref_key: "editorPaneRef",
            ref: editorPaneRef,
            modelValue: unref(state).content,
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => unref(state).content = $event),
            "history-key": editorSessionKey.value,
            "file-path": unref(state).filePath,
            "default-folder-path": folderPath.value,
            "image-save-path": activeImageConfig.value.imageSavePath,
            "sync-settings": activeImageConfig.value.syncSettings,
            onStatus: setStatus,
            onImageInserted: registerPendingImage
          }, null, 8, ["modelValue", "history-key", "file-path", "default-folder-path", "image-save-path", "sync-settings"]),
          createVNode(_sfc_main$6, {
            ref_key: "previewPaneRef",
            ref: previewPaneRef,
            html: unref(html2),
            onStatus: handleSettingsStatus
          }, null, 8, ["html"])
        ], 2)),
        createVNode(_sfc_main$5, {
          status: statusText.value,
          stats: unref(wordCount)
        }, null, 8, ["status", "stats"]),
        notification.value ? (openBlock(), createElementBlock("div", {
          key: notification.value.id,
          class: normalizeClass(["toast-notification", `toast-${notification.value.type}`]),
          role: "status"
        }, [
          _cache[11] || (_cache[11] = createBaseVNode("span", { class: "toast-accent" }, null, -1)),
          createBaseVNode("span", _hoisted_2, toDisplayString(notification.value.type === "error" ? "!" : "✓"), 1),
          createBaseVNode("span", _hoisted_3, toDisplayString(notification.value.message), 1),
          createBaseVNode("button", {
            class: "toast-close",
            type: "button",
            "aria-label": "关闭通知",
            onClick: closeNotification
          }, " × "),
          _cache[12] || (_cache[12] = createBaseVNode("span", { class: "toast-progress" }, null, -1))
        ], 2)) : createCommentVNode("", true),
        createVNode(_sfc_main$2, {
          open: isUnsavedDialogOpen.value,
          onSave: _cache[3] || (_cache[3] = ($event) => resolveUnsavedDecision("save")),
          onDiscard: _cache[4] || (_cache[4] = ($event) => resolveUnsavedDecision("discard")),
          onCancel: _cache[5] || (_cache[5] = ($event) => resolveUnsavedDecision("cancel"))
        }, null, 8, ["open"]),
        isInputDialogOpen.value ? (openBlock(), createElementBlock("div", {
          key: 3,
          class: "dialog-backdrop",
          role: "presentation",
          onClick: _cache[10] || (_cache[10] = withModifiers(($event) => resolveInputDialog(null), ["self"]))
        }, [
          createBaseVNode("form", {
            class: "input-dialog",
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": "inputDialogTitle",
            onSubmit: _cache[9] || (_cache[9] = withModifiers(($event) => resolveInputDialog(inputDialog.value.value), ["prevent"]))
          }, [
            createBaseVNode("h2", _hoisted_4, toDisplayString(inputDialog.value.title), 1),
            withDirectives(createBaseVNode("input", {
              ref_key: "inputDialogInputRef",
              ref: inputDialogInputRef,
              "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => inputDialog.value.value = $event),
              class: "input-dialog-field",
              type: "text",
              autocomplete: "off",
              onKeydown: _cache[7] || (_cache[7] = withKeys(withModifiers(($event) => resolveInputDialog(null), ["prevent"]), ["esc"]))
            }, null, 544), [
              [vModelText, inputDialog.value.value]
            ]),
            createBaseVNode("div", _hoisted_5, [
              createBaseVNode("button", {
                class: "dialog-button",
                type: "button",
                onClick: _cache[8] || (_cache[8] = ($event) => resolveInputDialog(null))
              }, "取消"),
              _cache[13] || (_cache[13] = createBaseVNode("button", {
                class: "dialog-button primary",
                type: "submit"
              }, "确定", -1))
            ])
          ], 32)
        ])) : createCommentVNode("", true)
      ]));
    };
  }
};
createApp(_sfc_main).mount("#app");
