'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash.isdate');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isarray');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.assign');

var _lodash6 = _interopRequireDefault(_lodash5);

var _events = require('./lib/events');

var _classutils = require('./lib/classutils');

var _dateutils = require('./lib/dateutils');

var _templating = require('./lib/templating');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
/* global moment:false */

var hasMoment = typeof moment === 'function';

var Pikaday2 = function Pikaday2(options) {
    _classCallCheck(this, Pikaday2);

    _initialiseProps.call(this);

    var opts = this.config(options);

    this.el = document.createElement('div');
    this.el.className = 'pika-single' + (opts.isRTL ? ' is-rtl' : '') + (opts.theme ? ' ' + opts.theme : '');

    (0, _events.addEvent)(this.el, 'mousedown', this._onMouseDown, true);
    (0, _events.addEvent)(this.el, 'touchend', this._onMouseDown, true);
    (0, _events.addEvent)(this.el, 'change', this._onChange);

    if (opts.field) {
        if (opts.container) {
            opts.container.appendChild(this.el);
        } else if (opts.bound) {
            document.body.appendChild(this.el);
        } else {
            opts.field.parentNode.insertBefore(this.el, opts.field.nextSibling);
        }

        (0, _events.addEvent)(opts.field, 'change', this._onInputChange);

        if (!opts.defaultDate) {
            if (opts.field.value) {
                if (hasMoment) {
                    opts.defaultDate = moment(opts.field.value, opts.format).toDate();
                } else {
                    opts.defaultDate = new Date(Date.parse(opts.field.value));
                }

                opts.setDefaultDate = true;
            }
        }
    }

    if ((0, _lodash2.default)(opts.defaultDate)) {
        if (opts.setDefaultDate) {
            this.setDate(opts.defaultDate, true);
        } else {
            this.gotoDate(opts.defaultDate);
        }
    } else {
        this.gotoDate(new Date());
    }

    if (opts.bound) {
        this.hide();
        this.el.className += ' is-bound';

        (0, _events.addEvent)(opts.trigger, 'click', this._onInputClick);
        (0, _events.addEvent)(opts.trigger, 'focus', this._onInputFocus);
        (0, _events.addEvent)(opts.trigger, 'blur', this._onInputBlur);
    } else {
        this.show();
    }
}

// Public API

// Events

;

var _initialiseProps = function _initialiseProps() {
    var _this = this;

    this.config = function (options) {
        if (!_this.options) {
            _this.options = (0, _lodash6.default)({}, Pikaday2.defaults, true);
        }

        var opts = (0, _lodash6.default)(_this.options, options, true);

        opts.isRTL = !!opts.isRTL;

        opts.field = opts.field && opts.field.nodeName ? opts.field : null;

        opts.theme = typeof opts.theme === 'string' && opts.theme ? opts.theme : null;

        opts.bound = !!(opts.bound !== undefined ? opts.field && opts.bound : opts.field);

        opts.trigger = opts.trigger && opts.trigger.nodeName ? opts.trigger : opts.field;

        opts.disableWeekends = !!opts.disableWeekends;

        opts.disableDayFn = typeof opts.disableDayFn === 'function' ? opts.disableDayFn : null;

        var nom = parseInt(opts.numberOfMonths, 10) || 1;
        opts.numberOfMonths = nom > 4 ? 4 : nom;

        if (!(0, _lodash2.default)(opts.minDate)) {
            opts.minDate = false;
        }

        if (!(0, _lodash2.default)(opts.maxDate)) {
            opts.maxDate = false;
        }

        if (opts.minDate && opts.maxDate && opts.maxDate < opts.minDate) {
            opts.maxDate = opts.minDate = false;
        }

        if (opts.minDate) {
            _this.setMinDate(opts.minDate);
        }

        if (opts.maxDate) {
            _this.setMaxDate(opts.maxDate);
        }

        if ((0, _lodash4.default)(opts.yearRange)) {
            var fallback = new Date().getFullYear() - 10;
            opts.yearRange[0] = parseInt(opts.yearRange[0], 10) || fallback;
            opts.yearRange[1] = parseInt(opts.yearRange[1], 10) || fallback;
        } else {
            opts.yearRange = Math.abs(parseInt(opts.yearRange, 10)) || Pikaday2.defaults.yearRange;
            if (opts.yearRange > 100) {
                opts.yearRange = 100;
            }
        }

        return opts;
    };

    this.toString = function (format) {
        return !(0, _lodash2.default)(_this._d) ? '' : hasMoment ? moment(_this._d).format(format || _this.options.format) : _this._d.toDateString();
    };

    this.getMoment = function () {
        return hasMoment ? moment(_this._d) : null;
    };

    this.setMoment = function (date, preventOnSelect) {
        if (hasMoment && moment.isMoment(date)) {
            _this.setDate(date.toDate(), preventOnSelect);
        }
    };

    this.getDate = function () {
        return (0, _lodash2.default)(_this._d) ? new Date(_this._d.getTime()) : null;
    };

    this.setDate = function (date, preventOnSelect) {
        if (!date) {
            _this._d = null;

            if (_this.options.field) {
                _this.options.field.value = '';
                (0, _events.fireEvent)(_this.options.field, 'change', { firedBy: _this });
            }

            return _this.draw();
        }

        if (typeof date === 'string') {
            date = new Date(Date.parse(date));
        }

        if (!(0, _lodash2.default)(date)) {
            return;
        }

        var min = _this.options.minDate,
            max = _this.options.maxDate;

        if ((0, _lodash2.default)(min) && date < min) {
            date = min;
        } else if ((0, _lodash2.default)(max) && date > max) {
            date = max;
        }

        _this._d = new Date(date.getTime());

        (0, _dateutils.setToStartOfDay)(_this._d);

        _this.gotoDate(_this._d);

        if (_this.options.field) {
            _this.options.field.value = _this.toString();
            (0, _events.fireEvent)(_this.options.field, 'change', { firedBy: _this });
        }

        if (!preventOnSelect && typeof _this.options.onSelect === 'function') {
            _this.options.onSelect.call(_this, _this.getDate());
        }
    };

    this.gotoDate = function (date) {
        var newCalendar = true;

        if (!(0, _lodash2.default)(date)) {
            return;
        }

        if (_this.calendars) {
            var firstVisibleDate = new Date(_this.calendars[0].year, _this.calendars[0].month, 1),
                lastVisibleDate = new Date(_this.calendars[_this.calendars.length - 1].year, _this.calendars[_this.calendars.length - 1].month, 1),
                visibleDate = date.getTime();
            // get the end of the month
            lastVisibleDate.setMonth(lastVisibleDate.getMonth() + 1);
            lastVisibleDate.setDate(lastVisibleDate.getDate() - 1);
            newCalendar = visibleDate < firstVisibleDate.getTime() || lastVisibleDate.getTime() < visibleDate;
        }

        if (newCalendar) {
            _this.calendars = [{
                month: date.getMonth(),
                year: date.getFullYear()
            }];
            if (_this.options.mainCalendar === 'right') {
                _this.calendars[0].month += 1 - _this.options.numberOfMonths;
            }
        }

        _this.adjustCalendars();
    };

    this.adjustCalendars = function () {
        _this.calendars[0] = (0, _dateutils.adjustCalendar)(_this.calendars[0]);

        for (var c = 1; c < _this.options.numberOfMonths; c++) {
            _this.calendars[c] = (0, _dateutils.adjustCalendar)({
                month: _this.calendars[0].month + c,
                year: _this.calendars[0].year
            });
        }

        _this.draw();
    };

    this.gotoToday = function () {
        _this.gotoDate(new Date());
    };

    this.gotoMonth = function (month) {
        if (!isNaN(month)) {
            _this.calendars[0].month = parseInt(month, 10);
            _this.adjustCalendars();
        }
    };

    this.nextMonth = function () {
        _this.calendars[0].month++;
        _this.adjustCalendars();
    };

    this.prevMonth = function () {
        _this.calendars[0].month--;
        _this.adjustCalendars();
    };

    this.gotoYear = function (year) {
        if (!isNaN(year)) {
            _this.calendars[0].year = parseInt(year, 10);
            _this.adjustCalendars();
        }
    };

    this.setMinDate = function (value) {
        (0, _dateutils.setToStartOfDay)(value);

        _this.options.minDate = value;
        _this.options.minYear = value.getFullYear();
        _this.options.minMonth = value.getMonth();
    };

    this.setMaxDate = function (value) {
        (0, _dateutils.setToStartOfDay)(value);

        _this.options.maxDate = value;
        _this.options.maxYear = value.getFullYear();
        _this.options.maxMonth = value.getMonth();
    };

    this.setStartRange = function (value) {
        _this.options.startRange = value;
    };

    this.setEndRange = function (value) {
        _this.options.endRange = value;
    };

    this.draw = function (force) {
        if (!_this.visible && !force) {
            return;
        }

        var opts = _this.options,
            minYear = opts.minYear,
            maxYear = opts.maxYear,
            minMonth = opts.minMonth,
            maxMonth = opts.maxMonth,
            html = '';

        if (_this._y <= minYear) {
            _this._y = minYear;

            if (!isNaN(minMonth) && _this._m < minMonth) {
                _this._m = minMonth;
            }
        }

        if (_this._y >= maxYear) {
            _this._y = maxYear;

            if (!isNaN(maxMonth) && _this._m > maxMonth) {
                _this._m = maxMonth;
            }
        }

        for (var c = 0; c < opts.numberOfMonths; c++) {
            html += '<div class="pika-lendar">' + (0, _templating.renderTitle)(opts, c, _this.calendars[c].year, _this.calendars[c].month, _this.calendars[0].year) + _this.render(_this.calendars[c].year, _this.calendars[c].month) + '</div>';
        }

        _this.el.innerHTML = html;

        if (opts.bound) {
            if (opts.field.type !== 'hidden') {
                setTimeout(function () {
                    opts.trigger.focus();
                }, 1);
            }
        }

        if (typeof _this.options.onDraw === 'function') {
            setTimeout(function () {
                _this.options.onDraw.call(_this);
            }, 0);
        }
    };

    this.adjustPosition = function () {
        var field = undefined,
            pEl = undefined,
            width = undefined,
            height = undefined,
            viewportWidth = undefined,
            viewportHeight = undefined,
            scrollTop = undefined,
            left = undefined,
            top = undefined,
            clientRect = undefined,
            opts = _this.options;

        if (opts.container) return;

        _this.el.style.position = 'absolute';

        field = opts.trigger;
        pEl = field;

        width = _this.el.offsetWidth;
        height = _this.el.offsetHeight;

        viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;

        if (typeof field.getBoundingClientRect === 'function') {
            clientRect = field.getBoundingClientRect();
            left = clientRect.left + window.pageXOffset;
            top = clientRect.bottom + window.pageYOffset;
        } else {
            left = pEl.offsetLeft;
            top = pEl.offsetTop + pEl.offsetHeight;
            while (pEl = pEl.offsetParent) {
                left += pEl.offsetLeft;
                top += pEl.offsetTop;
            }
        }

        // default position is bottom & left
        if (opts.reposition && left + width > viewportWidth || opts.position.indexOf('right') > -1 && left - width + field.offsetWidth > 0) {
            left = left - width + field.offsetWidth;
        }
        if (opts.reposition && top + height > viewportHeight + scrollTop || opts.position.indexOf('top') > -1 && top - height - field.offsetHeight > 0) {
            top = top - height - field.offsetHeight;
        }

        _this.el.style.left = left + 'px';
        _this.el.style.top = top + 'px';
    };

    this.render = function (year, month) {
        var opts = _this.options,
            now = new Date(),
            days = (0, _dateutils.getDaysInMonth)(year, month),
            before = new Date(year, month, 1).getDay(),
            data = [],
            row = [];

        (0, _dateutils.setToStartOfDay)(now);

        if (opts.firstDay > 0) {
            before -= opts.firstDay;

            if (before < 0) {
                before += 7;
            }
        }

        var cells = days + before,
            after = cells;

        while (after > 7) {
            after -= 7;
        }

        cells += 7 - after;

        for (var i = 0, r = 0; i < cells; i++) {
            var day = new Date(year, month, 1 + (i - before)),
                isSelected = (0, _lodash2.default)(_this._d) ? (0, _dateutils.compareDates)(day, _this._d) : false,
                isToday = (0, _dateutils.compareDates)(day, now),
                isEmpty = i < before || i >= days + before,
                isStartRange = opts.startRange && (0, _dateutils.compareDates)(opts.startRange, day),
                isEndRange = opts.endRange && (0, _dateutils.compareDates)(opts.endRange, day),
                isInRange = opts.startRange && opts.endRange && opts.startRange < day && day < opts.endRange,
                isDisabled = opts.minDate && day < opts.minDate || opts.maxDate && day > opts.maxDate || opts.disableWeekends && (0, _dateutils.isWeekend)(day) || opts.disableDayFn && opts.disableDayFn(day),
                dayConfig = {
                day: 1 + (i - before),
                month: month,
                year: year,
                isSelected: isSelected,
                isToday: isToday,
                isDisabled: isDisabled,
                isEmpty: isEmpty,
                isStartRange: isStartRange,
                isEndRange: isEndRange,
                isInRange: isInRange
            };

            row.push((0, _templating.renderDay)(dayConfig));

            if (++r === 7) {
                if (opts.showWeekNumber) {
                    row.unshift((0, _templating.renderWeek)(i - before, month, year));
                }
                data.push((0, _templating.renderRow)(row, opts.isRTL));
                row = [];
                r = 0;
            }
        }

        return (0, _templating.renderTable)(opts, data);
    };

    this.isVisible = function () {
        return _this.visible;
    };

    this.show = function () {
        if (!_this.visible) {
            (0, _classutils.removeClass)(_this.el, 'is-hidden');

            _this.visible = true;
            _this.draw();

            if (_this.options.bound) {
                (0, _events.addEvent)(document, 'click', _this._onClick);
                _this.adjustPosition();
            }

            if (typeof _this.options.onOpen === 'function') {
                _this.options.onOpen.call(_this);
            }
        }
    };

    this.hide = function () {
        var v = _this.visible;

        if (v !== false) {
            if (_this.options.bound) {
                (0, _events.removeEvent)(document, 'click', _this._onClick);
            }

            _this.el.style.position = 'static'; // reset
            _this.el.style.left = 'auto';
            _this.el.style.top = 'auto';

            (0, _classutils.addClass)(_this.el, 'is-hidden');

            _this.visible = false;

            if (v !== undefined && typeof _this.options.onClose === 'function') {
                _this.options.onClose.call(_this);
            }
        }
    };

    this.destroy = function () {
        _this.hide();

        (0, _events.removeEvent)(_this.el, 'mousedown', _this._onMouseDown, true);
        (0, _events.removeEvent)(_this.el, 'touchend', _this._onMouseDown, true);
        (0, _events.removeEvent)(_this.el, 'change', _this._onChange);

        if (_this.options.field) {
            (0, _events.removeEvent)(_this.options.field, 'change', _this._onInputChange);

            if (_this.options.bound) {
                (0, _events.removeEvent)(_this.options.trigger, 'click', _this._onInputClick);
                (0, _events.removeEvent)(_this.options.trigger, 'focus', _this._onInputFocus);
                (0, _events.removeEvent)(_this.options.trigger, 'blur', _this._onInputBlur);
            }
        }

        if (_this.el.parentNode) {
            _this.el.parentNode.removeChild(_this.el);
        }
    };

    this._onMouseDown = function (e) {
        if (!_this.visible) {
            return;
        }

        e = e || window.event;

        var target = e.target || e.srcElement;

        if (!target) {
            return;
        }

        if (!(0, _classutils.hasClass)(target.parentNode, 'is-disabled')) {
            if ((0, _classutils.hasClass)(target, 'pika-button') && !(0, _classutils.hasClass)(target, 'is-empty')) {
                _this.setDate(new Date(target.getAttribute('data-pika-year'), target.getAttribute('data-pika-month'), target.getAttribute('data-pika-day')));

                if (_this.options.bound) {
                    setTimeout(function () {
                        _this.hide();

                        if (_this.options.field) {
                            _this.options.field.blur();
                        }
                    }, 100);
                }
            } else if ((0, _classutils.hasClass)(target, 'pika-prev')) {
                _this.prevMonth();
            } else if ((0, _classutils.hasClass)(target, 'pika-next')) {
                _this.nextMonth();
            }
        }

        if (!(0, _classutils.hasClass)(target, 'pika-select')) {
            // if this is touch event prevent mouse events emulation
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
                return false;
            }
        } else {
            _this._c = true;
        }
    };

    this._onChange = function (e) {
        e = e || window.event;

        var target = e.target || e.srcElement;

        if (!target) {
            return;
        }

        if ((0, _classutils.hasClass)(target, 'pika-select-month')) {
            _this.gotoMonth(target.value);
        } else if ((0, _classutils.hasClass)(target, 'pika-select-year')) {
            _this.gotoYear(target.value);
        }
    };

    this._onInputChange = function (e) {
        var date = undefined;

        if (e.firedBy === _this) {
            return;
        }

        if (hasMoment) {
            date = moment(_this.options.field.value, _this.options.format);
            date = date && date.isValid() ? date.toDate() : null;
        } else {
            date = new Date(Date.parse(_this.options.field.value));
        }

        if ((0, _lodash2.default)(date)) {
            _this.setDate(date);
        }

        if (!_this.visible) {
            _this.show();
        }
    };

    this._onInputFocus = function () {
        _this.show();
    };

    this._onInputClick = function () {
        _this.show();
    };

    this._onInputBlur = function () {
        // IE allows pika div to gain focus; catch blur the input field
        var pEl = document.activeElement;

        do {
            if ((0, _classutils.hasClass)(pEl, 'pika-single')) {
                return;
            }
        } while (pEl = pEl.parentNode);

        if (!_this._c) {
            _this._b = setTimeout(function () {
                _this.hide();
            }, 50);
        }
        _this._c = false;
    };

    this._onClick = function (e) {
        e = e || window.event;

        var target = e.target || e.srcElement,
            pEl = target;

        if (!target) {
            return;
        }

        if (!_events.hasEventListeners && (0, _classutils.hasClass)(target, 'pika-select')) {
            if (!target.onchange) {
                target.setAttribute('onchange', 'return;');
                (0, _events.addEvent)(target, 'change', _this._onChange);
            }
        }

        do {
            if ((0, _classutils.hasClass)(pEl, 'pika-single') || pEl === _this.options.trigger) {
                return;
            }
        } while (pEl = pEl.parentNode);

        if (_this.visible && target !== _this.options.trigger && pEl !== _this.options.trigger) {
            _this.hide();
        }
    };
};

Pikaday2.defaults = {
    // bind the picker to a form field
    field: null,

    // automatically show/hide the picker on `field` focus (default `true` if `field` is set)
    bound: undefined,

    // position of the datepicker, relative to the field (default to bottom & left)
    // ('bottom' & 'left' keywords are not used, 'top' & 'right' are modifier on the bottom/left position)
    position: 'bottom left',

    // automatically fit in the viewport even if it means repositioning from the position option
    reposition: true,

    // the default output format for `.toString()` and `field` value
    format: 'YYYY-MM-DD',

    // the initial date to view when first opened
    defaultDate: null,

    // make the `defaultDate` the initial selected value
    setDefaultDate: false,

    // first day of week (0: Sunday, 1: Monday etc)
    firstDay: 0,

    // the minimum/earliest date that can be selected
    minDate: null,
    // the maximum/latest date that can be selected
    maxDate: null,

    // number of years either side, or array of upper/lower range
    yearRange: 10,

    // show week numbers at head of row
    showWeekNumber: false,

    // used internally (don't config outside)
    minYear: 0,
    maxYear: 9999,
    minMonth: undefined,
    maxMonth: undefined,

    startRange: null,
    endRange: null,

    isRTL: false,

    // Additional text to append to the year in the calendar title
    yearSuffix: '',

    // Render the month after year in the calendar title
    showMonthAfterYear: false,

    // how many months are visible
    numberOfMonths: 1,

    // when numberOfMonths is used, this will help you to choose where the main calendar will be (default `left`, can be set to `right`)
    // only used for the first display or when a selected date is not visible
    mainCalendar: 'left',

    // Specify a DOM element to render the calendar in
    container: undefined,

    // internationalization
    i18n: {
        previousMonth: 'Previous Month',
        nextMonth: 'Next Month',
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    },

    // Theme Classname
    theme: null,

    // callback function
    onSelect: null,
    onOpen: null,
    onClose: null,
    onDraw: null
};

exports.default = Pikaday2;