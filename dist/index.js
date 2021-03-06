'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = install;
/**
 * Created by lingchenxuan on 16-11-9.
 */
var scrollSections = [];

var bodyScrollEl = {};

// For ff, ie
Object.defineProperty(bodyScrollEl, 'scrollTop', {
    get: function get() {
        return document.body.scrollTop || document.documentElement.scrollTop;
    },
    set: function set(val) {
        document.body.scrollTop = val;
        document.documentElement.scrollTop = val;
    }
});

function init(el) {
    scrollSections = [];
    var sections = el.children;
    var elements = document.getElementsByClassName('scroll-spy');
    if (elements.length) {
        sections = elements[0].children;
    } else {
        return;
    }
    if (sections[0] && sections[0].offsetParent !== el) {
        el[scrollSpyContext].eventEl = window;
        el[scrollSpyContext].scrollEl = bodyScrollEl;
    }

    for (var i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop >= 0) {
            scrollSections.push(sections[i].offsetTop);
        }
    }
}

var scrollSpyContext = '@@scrollSpyContext';

function install(Vue) {
    Vue.directive('scroll-spy', {
        bind: function bind(el, binding, vnode) {
            function onScroll() {
                var _el$scrollSpyContext = el[scrollSpyContext],
                    scrollEl = _el$scrollSpyContext.scrollEl,
                    expression = _el$scrollSpyContext.expression;

                var pos = el.scrollTop;
                var i = 0;
                while (pos >= scrollSections[i]) {
                    i++;
                }

                vnode.context.$data[expression] = i ? i - 1 : 0;
            }

            function scrollTo(index) {
                var scrollEl = el[scrollSpyContext].scrollEl;

                var current = el.scrollTop;
                var target = scrollSections[index];
                var time = 200;
                var steps = 30;
                var timems = parseInt(time / steps);
                var gap = target - current;

                var _loop = function _loop(i) {
                    var pos = current + gap / steps * i;
                    setTimeout(function () {
                        return el.scrollTop = pos;
                    }, timems * i);
                };

                for (var i = 0; i <= steps; i++) {
                    _loop(i);
                }
            }
            vnode.context.$scrollTo = scrollTo;

            el[scrollSpyContext] = {
                onScroll: onScroll,
                expression: binding.expression,
                eventEl: el,
                scrollEl: el
            };
        },
        inserted: function inserted(el) {
            init(el);

            var _el$scrollSpyContext2 = el[scrollSpyContext],
                eventEl = _el$scrollSpyContext2.eventEl,
                onScroll = _el$scrollSpyContext2.onScroll;

            eventEl.addEventListener('scroll', onScroll);
        },
        componentUpdated: function componentUpdated(el) {
            init(el);
        },
        unbind: function unbind(el) {
            var _el$scrollSpyContext3 = el[scrollSpyContext],
                eventEl = _el$scrollSpyContext3.eventEl,
                onScroll = _el$scrollSpyContext3.onScroll;

            eventEl.removeEventListener('scroll', onScroll);
        }
    });
}
