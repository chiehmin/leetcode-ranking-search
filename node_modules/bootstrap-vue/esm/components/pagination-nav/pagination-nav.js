function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_PAGINATION_NAV } from '../../constants/components';
import { IS_BROWSER } from '../../constants/env';
import { EVENT_NAME_CHANGE, EVENT_NAME_PAGE_CLICK } from '../../constants/events';
import { PROP_TYPE_ARRAY, PROP_TYPE_BOOLEAN, PROP_TYPE_FUNCTION, PROP_TYPE_NUMBER_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { BvEvent } from '../../utils/bv-event.class';
import { attemptBlur, requestAF } from '../../utils/dom';
import { isArray, isUndefined, isObject } from '../../utils/inspect';
import { looseEqual } from '../../utils/loose-equal';
import { mathMax } from '../../utils/math';
import { toInteger } from '../../utils/number';
import { omit, sortKeys } from '../../utils/object';
import { hasPropFunction, makeProp, makePropsConfigurable, pluckProps } from '../../utils/props';
import { computeHref, parseQuery } from '../../utils/router';
import { toString } from '../../utils/string';
import { warn } from '../../utils/warn';
import { paginationMixin, props as paginationProps } from '../../mixins/pagination';
import { props as BLinkProps } from '../link/link'; // --- Helper methods ---
// Sanitize the provided number of pages (converting to a number)

export var sanitizeNumberOfPages = function sanitizeNumberOfPages(value) {
  return mathMax(toInteger(value, 0), 1);
}; // --- Props ---

var _linkProps = omit(BLinkProps, ['event', 'routerTag']);

var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread(_objectSpread({}, paginationProps), _linkProps), {}, {
  baseUrl: makeProp(PROP_TYPE_STRING, '/'),
  linkGen: makeProp(PROP_TYPE_FUNCTION),
  // Disable auto page number detection if `true`
  noPageDetect: makeProp(PROP_TYPE_BOOLEAN, false),
  numberOfPages: makeProp(PROP_TYPE_NUMBER_STRING, 1,
  /* istanbul ignore next */
  function (value) {
    var number = toInteger(value, 0);

    if (number < 1) {
      warn('Prop "number-of-pages" must be a number greater than "0"', NAME_PAGINATION_NAV);
      return false;
    }

    return true;
  }),
  pageGen: makeProp(PROP_TYPE_FUNCTION),
  // Optional array of page links
  pages: makeProp(PROP_TYPE_ARRAY),
  useRouter: makeProp(PROP_TYPE_BOOLEAN, false)
})), NAME_PAGINATION_NAV); // --- Main component ---
// @vue/component

export var BPaginationNav = /*#__PURE__*/Vue.extend({
  name: NAME_PAGINATION_NAV,
  // The render function is brought in via the pagination mixin
  mixins: [paginationMixin],
  props: props,
  computed: {
    // Used by render function to trigger wrapping in '<nav>' element
    isNav: function isNav() {
      return true;
    },
    computedValue: function computedValue() {
      // Returns the value prop as a number or `null` if undefined or < 1
      var value = toInteger(this.value, 0);
      return value < 1 ? null : value;
    }
  },
  watch: {
    numberOfPages: function numberOfPages() {
      var _this = this;

      this.$nextTick(function () {
        _this.setNumberOfPages();
      });
    },
    pages: function pages() {
      var _this2 = this;

      this.$nextTick(function () {
        _this2.setNumberOfPages();
      });
    }
  },
  created: function created() {
    this.setNumberOfPages();
  },
  mounted: function mounted() {
    var _this3 = this;

    if (this.$router) {
      // We only add the watcher if vue router is detected
      this.$watch('$route', function () {
        _this3.$nextTick(function () {
          requestAF(function () {
            _this3.guessCurrentPage();
          });
        });
      });
    }
  },
  methods: {
    setNumberOfPages: function setNumberOfPages() {
      var _this4 = this;

      if (isArray(this.pages) && this.pages.length > 0) {
        this.localNumberOfPages = this.pages.length;
      } else {
        this.localNumberOfPages = sanitizeNumberOfPages(this.numberOfPages);
      }

      this.$nextTick(function () {
        _this4.guessCurrentPage();
      });
    },
    onClick: function onClick(event, pageNumber) {
      var _this5 = this;

      // Dont do anything if clicking the current active page
      if (pageNumber === this.currentPage) {
        return;
      }

      var target = event.currentTarget || event.target; // Emit a user-cancelable `page-click` event

      var clickEvt = new BvEvent(EVENT_NAME_PAGE_CLICK, {
        cancelable: true,
        vueTarget: this,
        target: target
      });
      this.$emit(clickEvt.type, clickEvt, pageNumber);

      if (clickEvt.defaultPrevented) {
        return;
      } // Update the `v-model`
      // Done in in requestAF() to allow browser to complete the
      // native browser click handling of a link


      requestAF(function () {
        _this5.currentPage = pageNumber;

        _this5.$emit(EVENT_NAME_CHANGE, pageNumber);
      }); // Emulate native link click page reloading behaviour by blurring the
      // paginator and returning focus to the document
      // Done in a `nextTick()` to ensure rendering complete

      this.$nextTick(function () {
        attemptBlur(target);
      });
    },
    getPageInfo: function getPageInfo(pageNumber) {
      if (!isArray(this.pages) || this.pages.length === 0 || isUndefined(this.pages[pageNumber - 1])) {
        var link = "".concat(this.baseUrl).concat(pageNumber);
        return {
          link: this.useRouter ? {
            path: link
          } : link,
          text: toString(pageNumber)
        };
      }

      var info = this.pages[pageNumber - 1];

      if (isObject(info)) {
        var _link = info.link;
        return {
          // Normalize link for router use
          link: isObject(_link) ? _link : this.useRouter ? {
            path: _link
          } : _link,
          // Make sure text has a value
          text: toString(info.text || pageNumber)
        };
      } else {
        return {
          link: toString(info),
          text: toString(pageNumber)
        };
      }
    },
    makePage: function makePage(pageNumber) {
      var pageGen = this.pageGen;
      var info = this.getPageInfo(pageNumber);

      if (hasPropFunction(pageGen)) {
        return pageGen(pageNumber, info);
      }

      return info.text;
    },
    makeLink: function makeLink(pageNumber) {
      var linkGen = this.linkGen;
      var info = this.getPageInfo(pageNumber);

      if (hasPropFunction(linkGen)) {
        return linkGen(pageNumber, info);
      }

      return info.link;
    },
    linkProps: function linkProps(pageNumber) {
      var props = pluckProps(_linkProps, this);
      var link = this.makeLink(pageNumber);

      if (this.useRouter || isObject(link)) {
        props.to = link;
      } else {
        props.href = link;
      }

      return props;
    },
    resolveLink: function resolveLink() {
      var to = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      // Given a to (or href string), convert to normalized route-like structure
      // Works only client side!
      var link;

      try {
        // Convert the `to` to a HREF via a temporary `a` tag
        link = document.createElement('a');
        link.href = computeHref({
          to: to
        }, 'a', '/', '/'); // We need to add the anchor to the document to make sure the
        // `pathname` is correctly detected in any browser (i.e. IE)

        document.body.appendChild(link); // Once href is assigned, the link will be normalized to the full URL bits

        var _link2 = link,
            pathname = _link2.pathname,
            hash = _link2.hash,
            search = _link2.search; // Remove link from document

        document.body.removeChild(link); // Return the location in a route-like object

        return {
          path: pathname,
          hash: hash,
          query: parseQuery(search)
        };
      } catch (e) {
        /* istanbul ignore next */
        try {
          link && link.parentNode && link.parentNode.removeChild(link);
        } catch (_unused) {}
        /* istanbul ignore next */


        return {};
      }
    },
    resolveRoute: function resolveRoute() {
      var to = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      // Given a to (or href string), convert to normalized route location structure
      // Works only when router available!
      try {
        var route = this.$router.resolve(to, this.$route).route;
        return {
          path: route.path,
          hash: route.hash,
          query: route.query
        };
      } catch (e) {
        /* istanbul ignore next */
        return {};
      }
    },
    guessCurrentPage: function guessCurrentPage() {
      var $router = this.$router,
          $route = this.$route;
      var guess = this.computedValue; // This section only occurs if we are client side, or server-side with `$router`

      if (!this.noPageDetect && !guess && (IS_BROWSER || !IS_BROWSER && $router)) {
        // Current route (if router available)
        var currentRoute = $router && $route ? {
          path: $route.path,
          hash: $route.hash,
          query: $route.query
        } : {}; // Current page full HREF (if client side)
        // Can't be done as a computed prop!

        var loc = IS_BROWSER ? window.location || document.location : null;
        var currentLink = loc ? {
          path: loc.pathname,
          hash: loc.hash,
          query: parseQuery(loc.search)
        } :
        /* istanbul ignore next */
        {}; // Loop through the possible pages looking for a match until found

        for (var pageNumber = 1; !guess && pageNumber <= this.localNumberOfPages; pageNumber++) {
          var to = this.makeLink(pageNumber);

          if ($router && (isObject(to) || this.useRouter)) {
            // Resolve the page via the `$router`
            guess = looseEqual(this.resolveRoute(to), currentRoute) ? pageNumber : null;
          } else if (IS_BROWSER) {
            // If no `$router` available (or `!this.useRouter` when `to` is a string)
            // we compare using parsed URIs
            guess = looseEqual(this.resolveLink(to), currentLink) ? pageNumber : null;
          } else {
            // Probably SSR, but no `$router` so we can't guess,
            // so lets break out of the loop early

            /* istanbul ignore next */
            guess = -1;
          }
        }
      } // We set `currentPage` to `0` to trigger an `$emit('input', null)`
      // As the default for `currentPage` is `-1` when no value is specified
      // Valid page numbers are greater than `0`


      this.currentPage = guess > 0 ? guess : 0;
    }
  }
});