import { IS_BROWSER, HAS_PROMISE_SUPPORT, HAS_MUTATION_OBSERVER_SUPPORT } from '../constants/env';
import { getNoWarn } from './env';
/**
 * Log a warning message to the console with BootstrapVue formatting
 * @param {string} message
 */

export var warn = function warn(message)
/* istanbul ignore next */
{
  var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (!getNoWarn()) {
    console.warn("[BootstrapVue warn]: ".concat(source ? "".concat(source, " - ") : '').concat(message));
  }
};
/**
 * Warn when no Promise support is given
 * @param {string} source
 * @returns {boolean} warned
 */

export var warnNotClient = function warnNotClient(source) {
  /* istanbul ignore else */
  if (IS_BROWSER) {
    return false;
  } else {
    warn("".concat(source, ": Can not be called during SSR."));
    return true;
  }
};
/**
 * Warn when no Promise support is given
 * @param {string} source
 * @returns {boolean} warned
 */

export var warnNoPromiseSupport = function warnNoPromiseSupport(source) {
  /* istanbul ignore else */
  if (HAS_PROMISE_SUPPORT) {
    return false;
  } else {
    warn("".concat(source, ": Requires Promise support."));
    return true;
  }
};
/**
 * Warn when no MutationObserver support is given
 * @param {string} source
 * @returns {boolean} warned
 */

export var warnNoMutationObserverSupport = function warnNoMutationObserverSupport(source) {
  /* istanbul ignore else */
  if (HAS_MUTATION_OBSERVER_SUPPORT) {
    return false;
  } else {
    warn("".concat(source, ": Requires MutationObserver support."));
    return true;
  }
};