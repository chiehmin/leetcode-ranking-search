var _watch;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_CAROUSEL } from '../../constants/components';
import { IS_BROWSER, HAS_POINTER_EVENT_SUPPORT, HAS_TOUCH_SUPPORT } from '../../constants/env';
import { EVENT_NAME_PAUSED, EVENT_NAME_SLIDING_END, EVENT_NAME_SLIDING_START, EVENT_NAME_UNPAUSED, EVENT_OPTIONS_NO_CAPTURE } from '../../constants/events';
import { CODE_ENTER, CODE_LEFT, CODE_RIGHT, CODE_SPACE } from '../../constants/key-codes';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_NUMBER, PROP_TYPE_NUMBER_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { addClass, getActiveElement, reflow, removeClass, requestAF, selectAll, setAttr } from '../../utils/dom';
import { eventOn, eventOff, stopEvent } from '../../utils/events';
import { isUndefined } from '../../utils/inspect';
import { mathAbs, mathFloor, mathMax, mathMin } from '../../utils/math';
import { makeModelMixin } from '../../utils/model';
import { toInteger } from '../../utils/number';
import { noop } from '../../utils/noop';
import { sortKeys } from '../../utils/object';
import { observeDom } from '../../utils/observe-dom';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { idMixin, props as idProps } from '../../mixins/id';
import { normalizeSlotMixin } from '../../mixins/normalize-slot'; // --- Constants ---

var _makeModelMixin = makeModelMixin('value', {
  type: PROP_TYPE_NUMBER,
  defaultValue: 0
}),
    modelMixin = _makeModelMixin.mixin,
    modelProps = _makeModelMixin.props,
    MODEL_PROP_NAME = _makeModelMixin.prop,
    MODEL_EVENT_NAME = _makeModelMixin.event; // Slide directional classes


var DIRECTION = {
  next: {
    dirClass: 'carousel-item-left',
    overlayClass: 'carousel-item-next'
  },
  prev: {
    dirClass: 'carousel-item-right',
    overlayClass: 'carousel-item-prev'
  }
}; // Fallback Transition duration (with a little buffer) in ms

var TRANS_DURATION = 600 + 50; // Time for mouse compat events to fire after touch

var TOUCH_EVENT_COMPAT_WAIT = 500; // Number of pixels to consider touch move a swipe

var SWIPE_THRESHOLD = 40; // PointerEvent pointer types

var PointerType = {
  TOUCH: 'touch',
  PEN: 'pen'
}; // Transition Event names

var TransitionEndEvents = {
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'otransitionend oTransitionEnd',
  transition: 'transitionend'
}; // --- Helper methods ---
// Return the browser specific transitionEnd event name

var getTransitionEndEvent = function getTransitionEndEvent(el) {
  for (var name in TransitionEndEvents) {
    if (!isUndefined(el.style[name])) {
      return TransitionEndEvents[name];
    }
  } // Fallback

  /* istanbul ignore next */


  return null;
}; // --- Props ---


export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread(_objectSpread({}, idProps), modelProps), {}, {
  background: makeProp(PROP_TYPE_STRING),
  controls: makeProp(PROP_TYPE_BOOLEAN, false),
  // Enable cross-fade animation instead of slide animation
  fade: makeProp(PROP_TYPE_BOOLEAN, false),
  // Sniffed by carousel-slide
  imgHeight: makeProp(PROP_TYPE_NUMBER_STRING),
  // Sniffed by carousel-slide
  imgWidth: makeProp(PROP_TYPE_NUMBER_STRING),
  indicators: makeProp(PROP_TYPE_BOOLEAN, false),
  interval: makeProp(PROP_TYPE_NUMBER, 5000),
  labelGotoSlide: makeProp(PROP_TYPE_STRING, 'Goto slide'),
  labelIndicators: makeProp(PROP_TYPE_STRING, 'Select a slide to display'),
  labelNext: makeProp(PROP_TYPE_STRING, 'Next slide'),
  labelPrev: makeProp(PROP_TYPE_STRING, 'Previous slide'),
  // Disable slide/fade animation
  noAnimation: makeProp(PROP_TYPE_BOOLEAN, false),
  // Disable pause on hover
  noHoverPause: makeProp(PROP_TYPE_BOOLEAN, false),
  // Sniffed by carousel-slide
  noTouch: makeProp(PROP_TYPE_BOOLEAN, false),
  // Disable wrapping/looping when start/end is reached
  noWrap: makeProp(PROP_TYPE_BOOLEAN, false)
})), NAME_CAROUSEL); // --- Main component ---
// @vue/component

export var BCarousel = /*#__PURE__*/Vue.extend({
  name: NAME_CAROUSEL,
  mixins: [idMixin, modelMixin, normalizeSlotMixin],
  provide: function provide() {
    return {
      bvCarousel: this
    };
  },
  props: props,
  data: function data() {
    return {
      index: this[MODEL_PROP_NAME] || 0,
      isSliding: false,
      transitionEndEvent: null,
      slides: [],
      direction: null,
      isPaused: !(toInteger(this.interval, 0) > 0),
      // Touch event handling values
      touchStartX: 0,
      touchDeltaX: 0
    };
  },
  computed: {
    numSlides: function numSlides() {
      return this.slides.length;
    }
  },
  watch: (_watch = {}, _defineProperty(_watch, MODEL_PROP_NAME, function (newValue, oldValue) {
    if (newValue !== oldValue) {
      this.setSlide(toInteger(newValue, 0));
    }
  }), _defineProperty(_watch, "interval", function interval(newValue, oldValue) {
    /* istanbul ignore next */
    if (newValue === oldValue) {
      return;
    }

    if (!newValue) {
      // Pausing slide show
      this.pause(false);
    } else {
      // Restarting or Changing interval
      this.pause(true);
      this.start(false);
    }
  }), _defineProperty(_watch, "isPaused", function isPaused(newValue, oldValue) {
    if (newValue !== oldValue) {
      this.$emit(newValue ? EVENT_NAME_PAUSED : EVENT_NAME_UNPAUSED);
    }
  }), _defineProperty(_watch, "index", function index(to, from) {
    /* istanbul ignore next */
    if (to === from || this.isSliding) {
      return;
    }

    this.doSlide(to, from);
  }), _watch),
  created: function created() {
    // Create private non-reactive props
    this.$_interval = null;
    this.$_animationTimeout = null;
    this.$_touchTimeout = null;
    this.$_observer = null; // Set initial paused state

    this.isPaused = !(toInteger(this.interval, 0) > 0);
  },
  mounted: function mounted() {
    // Cache current browser transitionend event name
    this.transitionEndEvent = getTransitionEndEvent(this.$el) || null; // Get all slides

    this.updateSlides(); // Observe child changes so we can update slide list

    this.setObserver(true);
  },
  beforeDestroy: function beforeDestroy() {
    this.clearInterval();
    this.clearAnimationTimeout();
    this.clearTouchTimeout();
    this.setObserver(false);
  },
  methods: {
    clearInterval: function (_clearInterval) {
      function clearInterval() {
        return _clearInterval.apply(this, arguments);
      }

      clearInterval.toString = function () {
        return _clearInterval.toString();
      };

      return clearInterval;
    }(function () {
      clearInterval(this.$_interval);
      this.$_interval = null;
    }),
    clearAnimationTimeout: function clearAnimationTimeout() {
      clearTimeout(this.$_animationTimeout);
      this.$_animationTimeout = null;
    },
    clearTouchTimeout: function clearTouchTimeout() {
      clearTimeout(this.$_touchTimeout);
      this.$_touchTimeout = null;
    },
    setObserver: function setObserver() {
      var on = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      this.$_observer && this.$_observer.disconnect();
      this.$_observer = null;

      if (on) {
        this.$_observer = observeDom(this.$refs.inner, this.updateSlides.bind(this), {
          subtree: false,
          childList: true,
          attributes: true,
          attributeFilter: ['id']
        });
      }
    },
    // Set slide
    setSlide: function setSlide(slide) {
      var _this = this;

      var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      // Don't animate when page is not visible

      /* istanbul ignore if: difficult to test */
      if (IS_BROWSER && document.visibilityState && document.hidden) {
        return;
      }

      var noWrap = this.noWrap;
      var numSlides = this.numSlides; // Make sure we have an integer (you never know!)

      slide = mathFloor(slide); // Don't do anything if nothing to slide to

      if (numSlides === 0) {
        return;
      } // Don't change slide while transitioning, wait until transition is done


      if (this.isSliding) {
        // Schedule slide after sliding complete
        this.$once(EVENT_NAME_SLIDING_END, function () {
          // Wrap in `requestAF()` to allow the slide to properly finish to avoid glitching
          requestAF(function () {
            return _this.setSlide(slide, direction);
          });
        });
        return;
      }

      this.direction = direction; // Set new slide index
      // Wrap around if necessary (if no-wrap not enabled)

      this.index = slide >= numSlides ? noWrap ? numSlides - 1 : 0 : slide < 0 ? noWrap ? 0 : numSlides - 1 : slide; // Ensure the v-model is synched up if no-wrap is enabled
      // and user tried to slide pass either ends

      if (noWrap && this.index !== slide && this.index !== this[MODEL_PROP_NAME]) {
        this.$emit(MODEL_EVENT_NAME, this.index);
      }
    },
    // Previous slide
    prev: function prev() {
      this.setSlide(this.index - 1, 'prev');
    },
    // Next slide
    next: function next() {
      this.setSlide(this.index + 1, 'next');
    },
    // Pause auto rotation
    pause: function pause(event) {
      if (!event) {
        this.isPaused = true;
      }

      this.clearInterval();
    },
    // Start auto rotate slides
    start: function start(event) {
      if (!event) {
        this.isPaused = false;
      }
      /* istanbul ignore next: most likely will never happen, but just in case */


      this.clearInterval(); // Don't start if no interval, or less than 2 slides

      if (this.interval && this.numSlides > 1) {
        this.$_interval = setInterval(this.next, mathMax(1000, this.interval));
      }
    },
    // Restart auto rotate slides when focus/hover leaves the carousel

    /* istanbul ignore next */
    restart: function restart() {
      if (!this.$el.contains(getActiveElement())) {
        this.start();
      }
    },
    doSlide: function doSlide(to, from) {
      var _this2 = this;

      var isCycling = Boolean(this.interval); // Determine sliding direction

      var direction = this.calcDirection(this.direction, from, to);
      var overlayClass = direction.overlayClass;
      var dirClass = direction.dirClass; // Determine current and next slides

      var currentSlide = this.slides[from];
      var nextSlide = this.slides[to]; // Don't do anything if there aren't any slides to slide to

      if (!currentSlide || !nextSlide) {
        /* istanbul ignore next */
        return;
      } // Start animating


      this.isSliding = true;

      if (isCycling) {
        this.pause(false);
      }

      this.$emit(EVENT_NAME_SLIDING_START, to); // Update v-model

      this.$emit(MODEL_EVENT_NAME, this.index);

      if (this.noAnimation) {
        addClass(nextSlide, 'active');
        removeClass(currentSlide, 'active');
        this.isSliding = false; // Notify ourselves that we're done sliding (slid)

        this.$nextTick(function () {
          return _this2.$emit(EVENT_NAME_SLIDING_END, to);
        });
      } else {
        addClass(nextSlide, overlayClass); // Trigger a reflow of next slide

        reflow(nextSlide);
        addClass(currentSlide, dirClass);
        addClass(nextSlide, dirClass); // Transition End handler

        var called = false;
        /* istanbul ignore next: difficult to test */

        var onceTransEnd = function onceTransEnd() {
          if (called) {
            return;
          }

          called = true;
          /* istanbul ignore if: transition events cant be tested in JSDOM */

          if (_this2.transitionEndEvent) {
            var events = _this2.transitionEndEvent.split(/\s+/);

            events.forEach(function (event) {
              return eventOff(nextSlide, event, onceTransEnd, EVENT_OPTIONS_NO_CAPTURE);
            });
          }

          _this2.clearAnimationTimeout();

          removeClass(nextSlide, dirClass);
          removeClass(nextSlide, overlayClass);
          addClass(nextSlide, 'active');
          removeClass(currentSlide, 'active');
          removeClass(currentSlide, dirClass);
          removeClass(currentSlide, overlayClass);
          setAttr(currentSlide, 'aria-current', 'false');
          setAttr(nextSlide, 'aria-current', 'true');
          setAttr(currentSlide, 'aria-hidden', 'true');
          setAttr(nextSlide, 'aria-hidden', 'false');
          _this2.isSliding = false;
          _this2.direction = null; // Notify ourselves that we're done sliding (slid)

          _this2.$nextTick(function () {
            return _this2.$emit(EVENT_NAME_SLIDING_END, to);
          });
        }; // Set up transitionend handler

        /* istanbul ignore if: transition events cant be tested in JSDOM */


        if (this.transitionEndEvent) {
          var events = this.transitionEndEvent.split(/\s+/);
          events.forEach(function (event) {
            return eventOn(nextSlide, event, onceTransEnd, EVENT_OPTIONS_NO_CAPTURE);
          });
        } // Fallback to setTimeout()


        this.$_animationTimeout = setTimeout(onceTransEnd, TRANS_DURATION);
      }

      if (isCycling) {
        this.start(false);
      }
    },
    // Update slide list
    updateSlides: function updateSlides() {
      this.pause(true); // Get all slides as DOM elements

      this.slides = selectAll('.carousel-item', this.$refs.inner);
      var numSlides = this.slides.length; // Keep slide number in range

      var index = mathMax(0, mathMin(mathFloor(this.index), numSlides - 1));
      this.slides.forEach(function (slide, idx) {
        var n = idx + 1;

        if (idx === index) {
          addClass(slide, 'active');
          setAttr(slide, 'aria-current', 'true');
        } else {
          removeClass(slide, 'active');
          setAttr(slide, 'aria-current', 'false');
        }

        setAttr(slide, 'aria-posinset', String(n));
        setAttr(slide, 'aria-setsize', String(numSlides));
      }); // Set slide as active

      this.setSlide(index);
      this.start(this.isPaused);
    },
    calcDirection: function calcDirection() {
      var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var curIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var nextIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      if (!direction) {
        return nextIndex > curIndex ? DIRECTION.next : DIRECTION.prev;
      }

      return DIRECTION[direction];
    },
    handleClick: function handleClick(event, fn) {
      var keyCode = event.keyCode;

      if (event.type === 'click' || keyCode === CODE_SPACE || keyCode === CODE_ENTER) {
        stopEvent(event);
        fn();
      }
    },

    /* istanbul ignore next: JSDOM doesn't support touch events */
    handleSwipe: function handleSwipe() {
      var absDeltaX = mathAbs(this.touchDeltaX);

      if (absDeltaX <= SWIPE_THRESHOLD) {
        return;
      }

      var direction = absDeltaX / this.touchDeltaX; // Reset touch delta X
      // https://github.com/twbs/bootstrap/pull/28558

      this.touchDeltaX = 0;

      if (direction > 0) {
        // Swipe left
        this.prev();
      } else if (direction < 0) {
        // Swipe right
        this.next();
      }
    },

    /* istanbul ignore next: JSDOM doesn't support touch events */
    touchStart: function touchStart(event) {
      if (HAS_POINTER_EVENT_SUPPORT && PointerType[event.pointerType.toUpperCase()]) {
        this.touchStartX = event.clientX;
      } else if (!HAS_POINTER_EVENT_SUPPORT) {
        this.touchStartX = event.touches[0].clientX;
      }
    },

    /* istanbul ignore next: JSDOM doesn't support touch events */
    touchMove: function touchMove(event) {
      // Ensure swiping with one touch and not pinching
      if (event.touches && event.touches.length > 1) {
        this.touchDeltaX = 0;
      } else {
        this.touchDeltaX = event.touches[0].clientX - this.touchStartX;
      }
    },

    /* istanbul ignore next: JSDOM doesn't support touch events */
    touchEnd: function touchEnd(event) {
      if (HAS_POINTER_EVENT_SUPPORT && PointerType[event.pointerType.toUpperCase()]) {
        this.touchDeltaX = event.clientX - this.touchStartX;
      }

      this.handleSwipe(); // If it's a touch-enabled device, mouseenter/leave are fired as
      // part of the mouse compatibility events on first tap - the carousel
      // would stop cycling until user tapped out of it;
      // here, we listen for touchend, explicitly pause the carousel
      // (as if it's the second time we tap on it, mouseenter compat event
      // is NOT fired) and after a timeout (to allow for mouse compatibility
      // events to fire) we explicitly restart cycling

      this.pause(false);
      this.clearTouchTimeout();
      this.$_touchTimeout = setTimeout(this.start, TOUCH_EVENT_COMPAT_WAIT + mathMax(1000, this.interval));
    }
  },
  render: function render(h) {
    var _this3 = this;

    var indicators = this.indicators,
        background = this.background,
        noAnimation = this.noAnimation,
        noHoverPause = this.noHoverPause,
        noTouch = this.noTouch,
        index = this.index,
        isSliding = this.isSliding,
        pause = this.pause,
        restart = this.restart,
        touchStart = this.touchStart,
        touchEnd = this.touchEnd;
    var idInner = this.safeId('__BV_inner_'); // Wrapper for slides

    var $inner = h('div', {
      staticClass: 'carousel-inner',
      attrs: {
        id: idInner,
        role: 'list'
      },
      ref: 'inner'
    }, [this.normalizeSlot()]); // Prev and next controls

    var $controls = h();

    if (this.controls) {
      var makeControl = function makeControl(direction, label, handler) {
        var handlerWrapper = function handlerWrapper(event) {
          /* istanbul ignore next */
          if (!isSliding) {
            _this3.handleClick(event, handler);
          } else {
            stopEvent(event, {
              propagation: false
            });
          }
        };

        return h('a', {
          staticClass: "carousel-control-".concat(direction),
          attrs: {
            href: '#',
            role: 'button',
            'aria-controls': idInner,
            'aria-disabled': isSliding ? 'true' : null
          },
          on: {
            click: handlerWrapper,
            keydown: handlerWrapper
          }
        }, [h('span', {
          staticClass: "carousel-control-".concat(direction, "-icon"),
          attrs: {
            'aria-hidden': 'true'
          }
        }), h('span', {
          class: 'sr-only'
        }, [label])]);
      };

      $controls = [makeControl('prev', this.labelPrev, this.prev), makeControl('next', this.labelNext, this.next)];
    } // Indicators


    var $indicators = h('ol', {
      staticClass: 'carousel-indicators',
      directives: [{
        name: 'show',
        value: indicators
      }],
      attrs: {
        id: this.safeId('__BV_indicators_'),
        'aria-hidden': indicators ? 'false' : 'true',
        'aria-label': this.labelIndicators,
        'aria-owns': idInner
      }
    }, this.slides.map(function (slide, i) {
      var handler = function handler(event) {
        _this3.handleClick(event, function () {
          _this3.setSlide(i);
        });
      };

      return h('li', {
        class: {
          active: i === index
        },
        attrs: {
          role: 'button',
          id: _this3.safeId("__BV_indicator_".concat(i + 1, "_")),
          tabindex: indicators ? '0' : '-1',
          'aria-current': i === index ? 'true' : 'false',
          'aria-label': "".concat(_this3.labelGotoSlide, " ").concat(i + 1),
          'aria-describedby': slide.id || null,
          'aria-controls': idInner
        },
        on: {
          click: handler,
          keydown: handler
        },
        key: "slide_".concat(i)
      });
    }));
    var on = {
      mouseenter: noHoverPause ? noop : pause,
      mouseleave: noHoverPause ? noop : restart,
      focusin: pause,
      focusout: restart,
      keydown: function keydown(event) {
        /* istanbul ignore next */
        if (/input|textarea/i.test(event.target.tagName)) {
          return;
        }

        var keyCode = event.keyCode;

        if (keyCode === CODE_LEFT || keyCode === CODE_RIGHT) {
          stopEvent(event);

          _this3[keyCode === CODE_LEFT ? 'prev' : 'next']();
        }
      }
    }; // Touch support event handlers for environment

    if (HAS_TOUCH_SUPPORT && !noTouch) {
      // Attach appropriate listeners (prepend event name with '&' for passive mode)

      /* istanbul ignore next: JSDOM doesn't support touch events */
      if (HAS_POINTER_EVENT_SUPPORT) {
        on['&pointerdown'] = touchStart;
        on['&pointerup'] = touchEnd;
      } else {
        on['&touchstart'] = touchStart;
        on['&touchmove'] = this.touchMove;
        on['&touchend'] = touchEnd;
      }
    } // Return the carousel


    return h('div', {
      staticClass: 'carousel',
      class: {
        slide: !noAnimation,
        'carousel-fade': !noAnimation && this.fade,
        'pointer-event': HAS_TOUCH_SUPPORT && HAS_POINTER_EVENT_SUPPORT && !noTouch
      },
      style: {
        background: background
      },
      attrs: {
        role: 'region',
        id: this.safeId(),
        'aria-busy': isSliding ? 'true' : 'false'
      },
      on: on
    }, [$inner, $controls, $indicators]);
  }
});