/**
 * ydui
 */
!function (win) {
    var ydui = {},
        doc = win.document;

    window.addEventListener('load', function () {
        /* 直接绑定FastClick */
        if (typeof FastClick == 'function') {
            FastClick.attach(document.body);
        }

        /* 解决:active这个高端洋气的CSS伪类不能使用问题 */
        doc.addEventListener('touchstart', function () {
        }, false);
    }, false);

    if (typeof define === 'function') {
        define(ydui);
    } else {
        win.YDUI = ydui;
    }

}(window);
/**
 * dialog
 */
!function (win, $) {
    var dialog = $.dialog = $.dialog || {},
        doc = win.document,
        body = doc.querySelectorAll('body')[0];

    /**
     * 确认提示框
     * @param title 标题String 【可选】
     * @param mes   内容String 【必填】
     * @param opts  按钮们Array 或 “确定按钮”回调函数Function 【必填】
     * @constructor
     */
    dialog.confirm = function (title, mes, opts) {
        var that = $, al = arguments.length;
        if (al < 2) {
            console.error('From YDUI\'s confirm: Please set two or three parameters!!!');
            return;
        }

        if (typeof arguments[1] != 'function' && al == 2 && !arguments[1] instanceof Array) {
            console.error('From YDUI\'s confirm: The second parameter must be a function or array!!!');
            return;
        }

        if (al == 2) {
            opts = mes;
            mes = title;
            title = '提示';
        }

        var btnArr = opts;
        if (typeof opts === 'function') {
            btnArr = [{
                txt: '取消',
                color: false
            }, {
                txt: '确定',
                color: true,
                callback: function () {
                    opts && opts();
                }
            }];
        }

        // 创建confirm主体DOM
        var dom = doc.createElement('div'), _id = 'YDUI_CONFRIM';
        dom.id = _id;
        dom.innerHTML =
            '<div class="mask-black"></div>' +
            '<div class="m-confirm">' +
            '    <div class="confirm-hd"><strong class="confirm-title">' + title + '</strong></div>' +
            '    <div class="confirm-bd">' + mes + '</div>' +
            '</div>';

        var old = doc.querySelector('#' + _id);
        old && dom.parentNode.removeChild(dom);

        // 遍历按钮数组
        var temp = doc.createElement('div');
        temp.className = 'confirm-ft';
        btnArr.forEach(function (val, i) {
            var btn = doc.createElement('a');
            btn.href = 'javascript:;';
            // 指定按钮颜色
            if (typeof val.color == 'boolean') {
                btn.className = 'confirm-btn ' + (val.color ? 'primary' : 'default');
            } else if (typeof val.color == 'string') {
                btn.setAttribute('style', 'color: ' + val.color);
            }
            btn.innerHTML = val.txt || '';

            // 给对应按钮添加点击事件
            (function (p) {
                btn.onclick = function () {
                    // 是否保留弹窗
                    if (!btnArr[p].stay) {
                        // 释放页面滚动
                        that.pageScroll.unlock();
                        dom.parentNode.removeChild(dom);
                    }
                    btnArr[p].callback && btnArr[p].callback();
                }
            })(i);
            temp.appendChild(btn);
        });

        dom.querySelector('.m-confirm').appendChild(temp);

        // 禁止滚动屏幕【移动端】
        that.pageScroll.lock();

        body.appendChild(dom);
    };

    /**
     * 弹出警示框
     * @param mes       提示文字String 【必填】
     * @param callback  回调函数Function 【可选】
     */
    dialog.alert = function (mes, callback) {
        var dom = doc.createElement('div'), _id = 'YDUI_ALERT';
        dom.innerHTML =
            '<div>' +
            '    <div class="mask-black"></div>' +
            '    <div class="m-confirm m-alert">' +
            '        <div class="confirm-bd">' + (mes || 'YDUI Touch') + '</div>' +
            '        <div class="confirm-ft">' +
            '            <a href="javascript:;" class="confirm-btn primary">确定</a>' +
            '        </div>' +
            '    </div>' +
            '</div>';
        var old = doc.querySelector('#' + _id);
        old && dom.parentNode.removeChild(dom);

        $.pageScroll.lock();

        body.appendChild(dom);

        dom.querySelectorAll('a')[0].onclick = function () {
            dom.parentNode.removeChild(dom);
            $.pageScroll.unlock();
            typeof callback === 'function' && callback();
        };
    };

    /**
     * 弹出提示层
     * @param mes       提示文字String 【必填】
     * @param type      类型String success or error 【必填】
     * @param timeout   多久后消失Number 毫秒 【默认：2000ms】【可选】
     * @param callback  回调函数Function 【可选】
     */
    dialog.toast = function (mes, type, timeout, callback) {
        var al = arguments.length;
        if (al < 2) {
            console.error('From YDUI\'s tipMes: Please set two or more parameters!!!');
            return;
        }

        var ico = type == 'error' ? 'tipmes-error-ico' : 'tipmes-success-ico';
        var dom = doc.createElement('div'), _id = 'YDUI_TIPMES';
        dom.id = _id;
        dom.innerHTML =
            '<div>' +
            '    <div class="mask-white"></div>' +
            '    <div class="m-tipmes">' +
            '        <div class="' + ico + '"></div>' +
            '        <p class="tipmes-content">' + (mes || '') + '</p>' +
            '    </div>' +
            '</div>';

        var old = doc.querySelector('#' + _id);
        old && dom.parentNode.removeChild(dom);

        $.pageScroll.lock();

        body.appendChild(dom);

        if (typeof timeout === 'function' && arguments.length >= 3) {
            callback = timeout;
            timeout = 2000;
        }

        var inter = setTimeout(function () {
            clearTimeout(inter);
            $.pageScroll.unlock();
            dom.parentNode.removeChild(dom);
            typeof callback === 'function' && callback();
        }, (~~timeout || 2000) + 100);//100为动画时间
    };

    /**
     * 加载中提示框
     */
    dialog.loading = function () {
        return {
            /**
             * 加载中 - 显示
             * @param text 显示文字String 【可选】
             */
            show: function (text) {
                var dom = doc.createElement('div'), _id = 'YDUI_LOADING';
                dom.id = _id;
                dom.innerHTML =
                    '    <div class="mask-white"></div>' +
                    '    <div class="m-loading">' +
                    '        <div class="ld-loading">' +
                    '            <div class="m-loading-leaf m-loading-leaf-0"></div>' +
                    '            <div class="m-loading-leaf m-loading-leaf-1"></div>' +
                    '            <div class="m-loading-leaf m-loading-leaf-2"></div>' +
                    '            <div class="m-loading-leaf m-loading-leaf-3"></div>' +
                    '            <div class="m-loading-leaf m-loading-leaf-4"></div>' +
                    '            <div class="m-loading-leaf m-loading-leaf-5"></div>' +
                    '            <div class="m-loading-leaf m-loading-leaf-6"></div>' +
                    '            <div class="m-loading-leaf m-loading-leaf-7"></div>' +
                    '            <div class="m-loading-leaf m-loading-leaf-8"></div>' +
                    '            <div class="m-loading-leaf m-loading-leaf-9"></div>' +
                    '            <div class="m-loading-leaf m-loading-leaf-10"></div>' +
                    '            <div class="m-loading-leaf m-loading-leaf-11"></div>' +
                    '        </div>' +
                    '        <p class="ld-toast-content">' + (text || '数据加载中') + '</p>' +
                    '    </div>';
                var old = doc.querySelector('#' + _id);
                old && dom.parentNode.removeChild(dom);

                $.pageScroll.lock();
                body.appendChild(dom);
            },
            /**
             * 加载中 - 隐藏
             */
            hide: function () {
                $.pageScroll.unlock();

                var dom = doc.querySelector('#YDUI_LOADING');
                dom.parentNode.removeChild(dom);
            }
        };
    }();
}(window, YDUI);
/**
 * Copy for SUI-Mobile
 * https://github.com/sdc-alibaba/SUI-Mobile/
 */
!function () {
    'use strict';

    /**
     * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
     *
     * @codingstandard ftlabs-jsv2
     * @copyright The Financial Times Limited [All Rights Reserved]
     * @license MIT License (see LICENSE.txt)
     */

    /*jslint browser:true, node:true, elision:true*/
    /*global Event, Node*/


    /**
     * Instantiate fast-clicking listeners on the specified layer.
     *
     * @constructor
     * @param {Element} layer The layer to listen on
     * @param {Object} [options={}] The options to override the defaults
     */
    function FastClick(layer, options) {
        var oldOnClick;

        options = options || {};

        /**
         * Whether a click is currently being tracked.
         *
         * @type boolean
         */
        this.trackingClick = false;


        /**
         * Timestamp for when click tracking started.
         *
         * @type number
         */
        this.trackingClickStart = 0;


        /**
         * The element being tracked for a click.
         *
         * @type EventTarget
         */
        this.targetElement = null;


        /**
         * X-coordinate of touch start event.
         *
         * @type number
         */
        this.touchStartX = 0;


        /**
         * Y-coordinate of touch start event.
         *
         * @type number
         */
        this.touchStartY = 0;


        /**
         * ID of the last touch, retrieved from Touch.identifier.
         *
         * @type number
         */
        this.lastTouchIdentifier = 0;


        /**
         * Touchmove boundary, beyond which a click will be cancelled.
         *
         * @type number
         */
        this.touchBoundary = options.touchBoundary || 10;


        /**
         * The FastClick layer.
         *
         * @type Element
         */
        this.layer = layer;

        /**
         * The minimum time between tap(touchstart and touchend) events
         *
         * @type number
         */
        this.tapDelay = options.tapDelay || 200;

        /**
         * The maximum time for a tap
         *
         * @type number
         */
        this.tapTimeout = options.tapTimeout || 700;

        if (FastClick.notNeeded(layer)) {
            return;
        }

        // Some old versions of Android don't have Function.prototype.bind
        function bind(method, context) {
            return function () {
                return method.apply(context, arguments);
            };
        }


        var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
        var context = this;
        for (var i = 0, l = methods.length; i < l; i++) {
            context[methods[i]] = bind(context[methods[i]], context);
        }

        // Set up event handlers as required
        if (deviceIsAndroid) {
            layer.addEventListener('mouseover', this.onMouse, true);
            layer.addEventListener('mousedown', this.onMouse, true);
            layer.addEventListener('mouseup', this.onMouse, true);
        }

        layer.addEventListener('click', this.onClick, true);
        layer.addEventListener('touchstart', this.onTouchStart, false);
        layer.addEventListener('touchmove', this.onTouchMove, false);
        layer.addEventListener('touchend', this.onTouchEnd, false);
        layer.addEventListener('touchcancel', this.onTouchCancel, false);

        // Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
        // which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
        // layer when they are cancelled.
        if (!Event.prototype.stopImmediatePropagation) {
            layer.removeEventListener = function (type, callback, capture) {
                var rmv = Node.prototype.removeEventListener;
                if (type === 'click') {
                    rmv.call(layer, type, callback.hijacked || callback, capture);
                } else {
                    rmv.call(layer, type, callback, capture);
                }
            };

            layer.addEventListener = function (type, callback, capture) {
                var adv = Node.prototype.addEventListener;
                if (type === 'click') {
                    adv.call(layer, type, callback.hijacked || (callback.hijacked = function (event) {
                        if (!event.propagationStopped) {
                            callback(event);
                        }
                    }), capture);
                } else {
                    adv.call(layer, type, callback, capture);
                }
            };
        }

        // If a handler is already declared in the element's onclick attribute, it will be fired before
        // FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
        // adding it as listener.
        if (typeof layer.onclick === 'function') {

            // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
            // - the old one won't work if passed to addEventListener directly.
            oldOnClick = layer.onclick;
            layer.addEventListener('click', function (event) {
                oldOnClick(event);
            }, false);
            layer.onclick = null;
        }
    }

    /**
     * Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
     *
     * @type boolean
     */
    var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

    /**
     * Android requires exceptions.
     *
     * @type boolean
     */
    var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


    /**
     * iOS requires exceptions.
     *
     * @type boolean
     */
    var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


    /**
     * iOS 4 requires an exception for select elements.
     *
     * @type boolean
     */
    var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


    /**
     * iOS 6.0-7.* requires the target element to be manually derived
     *
     * @type boolean
     */
    var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

    /**
     * BlackBerry requires exceptions.
     *
     * @type boolean
     */
    var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

    /**
     * 判断是否组合型label
     * @type {Boolean}
     */
    var isCompositeLabel = false;

    /**
     * Determine whether a given element requires a native click.
     *
     * @param {EventTarget|Element} target Target DOM element
     * @returns {boolean} Returns true if the element needs a native click
     */
    FastClick.prototype.needsClick = function (target) {

        // 修复bug: 如果父元素中有 label
        // 如果label上有needsclick这个类，则用原生的点击，否则，用模拟点击
        var parent = target;
        while (parent && (parent.tagName.toUpperCase() !== "BODY")) {
            if (parent.tagName.toUpperCase() === "LABEL") {
                isCompositeLabel = true;
                if ((/\bneedsclick\b/).test(parent.className)) return true;
            }
            parent = parent.parentNode;
        }

        switch (target.nodeName.toLowerCase()) {

            // Don't send a synthetic click to disabled inputs (issue #62)
            case 'button':
            case 'select':
            case 'textarea':
                if (target.disabled) {
                    return true;
                }

                break;
            case 'input':

                // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
                if ((deviceIsIOS && target.type === 'file') || target.disabled) {
                    return true;
                }

                break;
            case 'label':
            case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
            case 'video':
                return true;
        }

        return (/\bneedsclick\b/).test(target.className);
    };


    /**
     * Determine whether a given element requires a call to focus to simulate click into element.
     *
     * @param {EventTarget|Element} target Target DOM element
     * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
     */
    FastClick.prototype.needsFocus = function (target) {
        switch (target.nodeName.toLowerCase()) {
            case 'textarea':
                return true;
            case 'select':
                return !deviceIsAndroid;
            case 'input':
                switch (target.type) {
                    case 'button':
                    case 'checkbox':
                    case 'file':
                    case 'image':
                    case 'radio':
                    case 'submit':
                        return false;
                }

                // No point in attempting to focus disabled inputs
                return !target.disabled && !target.readOnly;
            default:
                return (/\bneedsfocus\b/).test(target.className);
        }
    };


    /**
     * Send a click event to the specified element.
     *
     * @param {EventTarget|Element} targetElement
     * @param {Event} event
     */
    FastClick.prototype.sendClick = function (targetElement, event) {
        var clickEvent, touch;

        // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
        if (document.activeElement && document.activeElement !== targetElement) {
            document.activeElement.blur();
        }

        touch = event.changedTouches[0];

        // Synthesise a click event, with an extra attribute so it can be tracked
        clickEvent = document.createEvent('MouseEvents');
        clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
        clickEvent.forwardedTouchEvent = true;
        targetElement.dispatchEvent(clickEvent);
    };

    FastClick.prototype.determineEventType = function (targetElement) {

        //Issue #159: Android Chrome Select Box does not open with a synthetic click event
        if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
            return 'mousedown';
        }

        return 'click';
    };


    /**
     * @param {EventTarget|Element} targetElement
     */
    FastClick.prototype.focus = function (targetElement) {
        var length;

        // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
        var unsupportedType = ['date', 'time', 'month', 'number', 'email'];
        if (deviceIsIOS && targetElement.setSelectionRange && unsupportedType.indexOf(targetElement.type) === -1) {
            length = targetElement.value.length;
            targetElement.setSelectionRange(length, length);
        } else {
            targetElement.focus();
        }
    };


    /**
     * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
     *
     * @param {EventTarget|Element} targetElement
     */
    FastClick.prototype.updateScrollParent = function (targetElement) {
        var scrollParent, parentElement;

        scrollParent = targetElement.fastClickScrollParent;

        // Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
        // target element was moved to another parent.
        if (!scrollParent || !scrollParent.contains(targetElement)) {
            parentElement = targetElement;
            do {
                if (parentElement.scrollHeight > parentElement.offsetHeight) {
                    scrollParent = parentElement;
                    targetElement.fastClickScrollParent = parentElement;
                    break;
                }

                parentElement = parentElement.parentElement;
            } while (parentElement);
        }

        // Always update the scroll top tracker if possible.
        if (scrollParent) {
            scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
        }
    };


    /**
     * @param {EventTarget} targetElement
     * @returns {Element|EventTarget}
     */
    FastClick.prototype.getTargetElementFromEventTarget = function (eventTarget) {

        // On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
        if (eventTarget.nodeType === Node.TEXT_NODE) {
            return eventTarget.parentNode;
        }

        return eventTarget;
    };


    /**
     * On touch start, record the position and scroll offset.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchStart = function (event) {
        var targetElement, touch, selection;

        // Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
        if (event.targetTouches.length > 1) {
            return true;
        }

        targetElement = this.getTargetElementFromEventTarget(event.target);
        touch = event.targetTouches[0];

        if (deviceIsIOS) {

            // Only trusted events will deselect text on iOS (issue #49)
            selection = window.getSelection();
            if (selection.rangeCount && !selection.isCollapsed) {
                return true;
            }

            if (!deviceIsIOS4) {

                // Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
                // when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
                // with the same identifier as the touch event that previously triggered the click that triggered the alert.
                // Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
                // immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
                // Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
                // which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
                // random integers, it's safe to to continue if the identifier is 0 here.
                if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
                    event.preventDefault();
                    return false;
                }

                this.lastTouchIdentifier = touch.identifier;

                // If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
                // 1) the user does a fling scroll on the scrollable layer
                // 2) the user stops the fling scroll with another tap
                // then the event.target of the last 'touchend' event will be the element that was under the user's finger
                // when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
                // is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
                this.updateScrollParent(targetElement);
            }
        }

        this.trackingClick = true;
        this.trackingClickStart = event.timeStamp;
        this.targetElement = targetElement;

        this.touchStartX = touch.pageX;
        this.touchStartY = touch.pageY;

        // Prevent phantom clicks on fast double-tap (issue #36)
        if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
            event.preventDefault();
        }

        return true;
    };


    /**
     * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.touchHasMoved = function (event) {
        var touch = event.changedTouches[0], boundary = this.touchBoundary;

        if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
            return true;
        }

        return false;
    };


    /**
     * Update the last position.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchMove = function (event) {
        if (!this.trackingClick) {
            return true;
        }

        // If the touch has moved, cancel the click tracking
        if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
            this.trackingClick = false;
            this.targetElement = null;
        }

        return true;
    };


    /**
     * Attempt to find the labelled control for the given label element.
     *
     * @param {EventTarget|HTMLLabelElement} labelElement
     * @returns {Element|null}
     */
    FastClick.prototype.findControl = function (labelElement) {

        // Fast path for newer browsers supporting the HTML5 control attribute
        if (labelElement.control !== undefined) {
            return labelElement.control;
        }

        // All browsers under test that support touch events also support the HTML5 htmlFor attribute
        if (labelElement.htmlFor) {
            return document.getElementById(labelElement.htmlFor);
        }

        // If no for attribute exists, attempt to retrieve the first labellable descendant element
        // the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
        return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
    };


    /**
     * On touch end, determine whether to send a click event at once.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchEnd = function (event) {
        var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

        if (!this.trackingClick) {
            return true;
        }

        // Prevent phantom clicks on fast double-tap (issue #36)
        if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
            this.cancelNextClick = true;
            return true;
        }

        if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
            return true;
        }
        //修复安卓微信下，input type="date" 的bug，经测试date,time,month已没问题
        var unsupportedType = ['date', 'time', 'month'];
        if (unsupportedType.indexOf(event.target.type) !== -1) {
            return false;
        }
        // Reset to prevent wrong click cancel on input (issue #156).
        this.cancelNextClick = false;

        this.lastClickTime = event.timeStamp;

        trackingClickStart = this.trackingClickStart;
        this.trackingClick = false;
        this.trackingClickStart = 0;

        // On some iOS devices, the targetElement supplied with the event is invalid if the layer
        // is performing a transition or scroll, and has to be re-detected manually. Note that
        // for this to function correctly, it must be called *after* the event target is checked!
        // See issue #57; also filed as rdar://13048589 .
        if (deviceIsIOSWithBadTarget) {
            touch = event.changedTouches[0];

            // In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
            targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
            targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
        }

        targetTagName = targetElement.tagName.toLowerCase();
        if (targetTagName === 'label') {
            forElement = this.findControl(targetElement);
            if (forElement) {
                this.focus(targetElement);
                if (deviceIsAndroid) {
                    return false;
                }

                targetElement = forElement;
            }
        } else if (this.needsFocus(targetElement)) {

            // Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
            // Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
            if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
                this.targetElement = null;
                return false;
            }

            this.focus(targetElement);
            this.sendClick(targetElement, event);

            // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
            // Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
            if (!deviceIsIOS || targetTagName !== 'select') {
                this.targetElement = null;
                event.preventDefault();
            }

            return false;
        }

        if (deviceIsIOS && !deviceIsIOS4) {

            // Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
            // and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
            scrollParent = targetElement.fastClickScrollParent;
            if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
                return true;
            }
        }

        // Prevent the actual click from going though - unless the target node is marked as requiring
        // real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
        if (!this.needsClick(targetElement)) {
            event.preventDefault();
            this.sendClick(targetElement, event);
        }

        return false;
    };


    /**
     * On touch cancel, stop tracking the click.
     *
     * @returns {void}
     */
    FastClick.prototype.onTouchCancel = function () {
        this.trackingClick = false;
        this.targetElement = null;
    };


    /**
     * Determine mouse events which should be permitted.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onMouse = function (event) {

        // If a target element was never set (because a touch event was never fired) allow the event
        if (!this.targetElement) {
            return true;
        }

        if (event.forwardedTouchEvent) {
            return true;
        }

        // Programmatically generated events targeting a specific element should be permitted
        if (!event.cancelable) {
            return true;
        }

        // Derive and check the target element to see whether the mouse event needs to be permitted;
        // unless explicitly enabled, prevent non-touch click events from triggering actions,
        // to prevent ghost/doubleclicks.
        if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

            // Prevent any user-added listeners declared on FastClick element from being fired.
            if (event.stopImmediatePropagation) {
                event.stopImmediatePropagation();
            } else {

                // Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
                event.propagationStopped = true;
            }

            // Cancel the event
            event.stopPropagation();
            // 允许组合型label冒泡
            if (!isCompositeLabel) {
                event.preventDefault();
            }
            // 允许组合型label冒泡
            return false;
        }

        // If the mouse event is permitted, return true for the action to go through.
        return true;
    };


    /**
     * On actual clicks, determine whether this is a touch-generated click, a click action occurring
     * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
     * an actual click which should be permitted.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onClick = function (event) {
        var permitted;

        // It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
        if (this.trackingClick) {
            this.targetElement = null;
            this.trackingClick = false;
            return true;
        }

        // Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
        if (event.target.type === 'submit' && event.detail === 0) {
            return true;
        }

        permitted = this.onMouse(event);

        // Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
        if (!permitted) {
            this.targetElement = null;
        }

        // If clicks are permitted, return true for the action to go through.
        return permitted;
    };


    /**
     * Remove all FastClick's event listeners.
     *
     * @returns {void}
     */
    FastClick.prototype.destroy = function () {
        var layer = this.layer;

        if (deviceIsAndroid) {
            layer.removeEventListener('mouseover', this.onMouse, true);
            layer.removeEventListener('mousedown', this.onMouse, true);
            layer.removeEventListener('mouseup', this.onMouse, true);
        }

        layer.removeEventListener('click', this.onClick, true);
        layer.removeEventListener('touchstart', this.onTouchStart, false);
        layer.removeEventListener('touchmove', this.onTouchMove, false);
        layer.removeEventListener('touchend', this.onTouchEnd, false);
        layer.removeEventListener('touchcancel', this.onTouchCancel, false);
    };


    /**
     * Check whether FastClick is needed.
     *
     * @param {Element} layer The layer to listen on
     */
    FastClick.notNeeded = function (layer) {
        var metaViewport;
        var chromeVersion;
        var blackberryVersion;
        var firefoxVersion;

        // Devices that don't support touch don't need FastClick
        if (typeof window.ontouchstart === 'undefined') {
            return true;
        }

        // Chrome version - zero for other browsers
        chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

        if (chromeVersion) {

            if (deviceIsAndroid) {
                metaViewport = document.querySelector('meta[name=viewport]');

                if (metaViewport) {
                    // Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
                    if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
                        return true;
                    }
                    // Chrome 32 and above with width=device-width or less don't need FastClick
                    if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
                        return true;
                    }
                }

                // Chrome desktop doesn't need FastClick (issue #15)
            } else {
                return true;
            }
        }

        if (deviceIsBlackBerry10) {
            blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

            // BlackBerry 10.3+ does not require Fastclick library.
            // https://github.com/ftlabs/fastclick/issues/251
            if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
                metaViewport = document.querySelector('meta[name=viewport]');

                if (metaViewport) {
                    // user-scalable=no eliminates click delay.
                    if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
                        return true;
                    }
                    // width=device-width (or less than device-width) eliminates click delay.
                    if (document.documentElement.scrollWidth <= window.outerWidth) {
                        return true;
                    }
                }
            }
        }

        // IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
        if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
            return true;
        }

        // Firefox version - zero for other browsers
        firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

        if (firefoxVersion >= 27) {
            // Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

            metaViewport = document.querySelector('meta[name=viewport]');
            if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
                return true;
            }
        }

        // IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
        // http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
        if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
            return true;
        }

        return false;
    };


    /**
     * Factory method for creating a FastClick object
     *
     * @param {Element} layer The layer to listen on
     * @param {Object} [options={}] The options to override the defaults
     */
    FastClick.attach = function (layer, options) {
        return new FastClick(layer, options);
    };

    window.FastClick = FastClick;
}();
/**
 * pageScroll
 */
!function (win, $) {
    var doc = win.document;

    /**
     * 页面滚动方法
     * @type {{lock, unlock}}
     * lock：禁止页面滚动, unlock：释放页面滚动
     */
    $.pageScroll = function () {
        var fn = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };
        var islock = false;

        return {
            lock: function () {
                if (islock)return;
                islock = true;
                doc.addEventListener('touchmove', fn);
            },
            unlock: function () {
                islock = false;
                doc.removeEventListener('touchmove', fn);
            }
        };
    }();

}(window, YDUI);
/**
 * util
 */
!function (win, $) {
    var util = $.util = $.util || {},
        doc = win.document;

    /**
     * 日期格式化
     * @param format 日期格式 {%d天}{%h时}{%m分}{%s秒}{%f毫秒}
     * @param time 单位 毫秒
     * @returns {string}
     */
    util.timestampTotime = function (format, time) {
        var t = {};

        var checkTime = function (i) {
            return i < 10 ? '0' + i : i;
        };

        t.f = time % 1000;
        time = Math.floor(time / 1000);
        t.s = time % 60;
        time = Math.floor(time / 60);
        t.m = time % 60;
        time = Math.floor(time / 60);
        t.h = time % 24;
        t.d = Math.floor(time / 24);

        var ment = function (a) {
            return '$1' + checkTime(a) + '$2';
        };

        format = format.replace(/\{([^{]*?)%d(.*?)\}/g, ment(t.d));
        format = format.replace(/\{([^{]*?)%h(.*?)\}/g, ment(t.h));
        format = format.replace(/\{([^{]*?)%m(.*?)\}/g, ment(t.m));
        format = format.replace(/\{([^{]*?)%s(.*?)\}/g, ment(t.s));
        format = format.replace(/\{([^{]*?)%f(.*?)\}/g, ment(t.f));

        return format;
    };

    /**
     * js倒计时
     * @param format 时间格式 {%d天}{%h时}{%m分}{%s秒}{%f毫秒}
     * @param time 时间 毫秒
     * @param speed 速度 毫秒
     * @param callback(ret) 倒计时结束回调函数 ret 时间字符 ；ret == '' 则倒计时结束
     * DEMO: YDUI.util.countdown('{%d天}{%h时}{%m分}{%s秒}{%f毫秒}', 60000, 1000, function(ret){ console.log(ret); }
     */
    util.countdown = function (format, time, speed, callback) {
        var that = this, tm = new Date().getTime();
        var timer = setInterval(function () {
            var l_time = time - new Date().getTime() + tm;
            if (l_time > 0) {
                callback(that.timestampTotime(format, l_time));
            } else {
                clearInterval(timer);
                typeof callback == 'function' && callback('');
            }
        }, speed);
    };

    /**
     * js 加减乘除
     * @param arg1 数值1
     * @param arg2 数值2
     * @param op 操作符string 【+ - * /】
     * @returns {Object} arg1 与 arg2运算的精确结果
     */
    util.calc = function (arg1, arg2, op) {
        var ra = 1, rb = 1, m;

        try {
            ra = arg1.toString().split('.')[1].length;
        } catch (e) {
        }
        try {
            rb = arg2.toString().split('.')[1].length;
        } catch (e) {
        }
        m = Math.pow(10, Math.max(ra, rb));

        switch (op) {
            case '+':
            case '-':
                arg1 = Math.round(arg1 * m);
                arg2 = Math.round(arg2 * m);
                break;
            case '*':
                ra = Math.pow(10, ra);
                rb = Math.pow(10, rb);
                m = ra * rb;
                arg1 = Math.round(arg1 * ra);
                arg2 = Math.round(arg2 * rb);
                break;
            case '/':
                arg1 = Math.round(arg1 * m);
                arg2 = Math.round(arg2 * m);
                m = 1;
                break;
        }
        try {
            var result = eval('(' + '(' + arg1 + ')' + op + '(' + arg2 + ')' + ')/' + m);
        } catch (e) {
        }
        return result;
    };

    /**
     * 读取图片文件 并返回图片的DataUrl
     * @param obj
     * @param callback
     */
    util.getImgBase64 = function (obj, callback) {
        var that = this, dataimg = '', file = obj.files[0];
        if (!file)return;
        if (!/image\/\w+/.test(file.type)) {
            that.tipMes('请上传图片文件', 'error');
            return;
        }
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            dataimg = this.result;
            typeof callback === 'function' && callback(dataimg);
        };
    };

    /**
     * 获取地址栏参数
     * @param name
     * @returns {*}
     */
    util.getQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
            r = win.location.search.substr(1).match(reg),
            qs = '';
        if (r != null)qs = decodeURIComponent(r[2]);
        return qs;
    };

    /**
     * 序列化
     * @param value
     * @returns {string}
     */
    util.serialize = function (value) {
        if (typeof value === 'string') return value;
        return JSON.stringify(value);
    };

    /**
     * 反序列化
     * @param value
     * @returns {*}
     */
    util.deserialize = function (value) {
        if (typeof value !== 'string') return undefined;
        try {
            return JSON.parse(value);
        } catch (e) {
            return value || undefined;
        }
    };

    /**
     * 本地存储
     */
    util.localStorage = function () {
        return storage(win.localStorage);
    }();

    /**
     * Session存储
     */
    util.sessionStorage = function () {
        return storage(win.sessionStorage);
    }();

    /**
     * Cookie
     * @type {{get, set}}
     */
    util.cookie = function () {
        return {
            /**
             * 获取 Cookie
             * @param  {String} name
             * @return {String}
             */
            get: function (name) {
                var m = doc.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
                return (m && m[1]) ? decodeURIComponent(m[1]) : '';
            },
            /**
             * 设置 Cookie
             * @param {String}  name 名称
             * @param {String}  val 值
             * @param {Number} expires 单位（秒）
             * @param {String}  domain 域
             * @param {String}  path 所在的目录
             * @param {Boolean} secure 跨协议传递
             */
            set: function (name, val, expires, domain, path, secure) {
                var text = String(encodeURIComponent(val)),
                    date = expires;

                // 从当前时间开始，多少小时后过期
                if (typeof date === 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + expires * 1000);
                }

                date instanceof Date && (text += '; expires=' + date.toUTCString());

                !!domain && (text += '; domain=' + domain);

                text += '; path=' + (path || '/');

                secure && (text += '; secure');

                doc.cookie = name + '=' + text;
            }
        }
    }();

    /**
     * 获取浏览器UA
     * @return {String}
     */
    util.getUA = function () {
        return win.navigator && win.navigator.userAgent || '';
    };

    /**
     * 是否移动终端
     * @return {Boolean}
     */
    util.isMobile = function () {
        return !!getUA.match(/AppleWebKit.*Mobile.*/) || 'ontouchstart' in doc.documentElement;
    };

    /**
     * 是否IOS终端
     * @returns {boolean}
     */
    util.isIOS = function () {
        return !!getUA.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    };

    /**
     * 是否微信端
     * @returns {boolean}
     */
    util.isWeixin = function () {
        return getUA.indexOf('MicroMessenger') > -1;
    };

    /**
     * HTML5存储
     */
    function storage(ls) {
        var _util = util;
        return {
            set: function (key, value) {
                ls.setItem(key, _util.serialize(value));
            },
            get: function (key) {
                return _util.deserialize(ls.getItem(key));
            },
            remove: function (key) {
                ls.removeItem(key);
            },
            clear: function () {
                ls.clear();
            }
        };
    }

    var getUA = util.getUA();
    $.isMobile = util.isMobile();
    $.isWeixin = util.isWeixin();
    $.isIOS = util.isIOS();
}(window, YDUI);