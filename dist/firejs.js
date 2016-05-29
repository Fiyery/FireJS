var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
'use strict';
/**
 * Main class.
 */
var FireJs = (function () {
    /**
     * Setup of object.
     */
    function FireJs() {
        this.queries = {};
    }
    /**
     * Execute the callback function when the page is loaded.
     */
    FireJs.prototype.ready = function (callback) {
        if (callback && typeof callback === 'function') {
            document.addEventListener("DOMContentLoaded", callback);
        }
    };
    /**
     * Get the HTML elements with CSS selector.
     * Warning : All the queries are cached, to reset the query, set reset param to true
     */
    FireJs.prototype.get = function (query, reset) {
        if (reset === void 0) { reset = false; }
        if (reset || !this.queries[query]) {
            var res = document.querySelectorAll(query);
            var list_1 = new FireElements();
            switch (res.length) {
                case 0:
                    list_1 = null;
                    break;
                case 1:
                    list_1 = new FireElements();
                    var f = new FireElement(res[0]);
                    list_1.push(f);
                    break;
                default:
                    [].forEach.call(res, function (e) {
                        list_1.push(new FireElement(e));
                    });
            }
            this.queries[query] = list_1;
        }
        return this.queries[query];
    };
    return FireJs;
}());
/**
 * Array class contains the FireElements and send to then the calls.
 */
var FireElements = (function (_super) {
    __extends(FireElements, _super);
    function FireElements() {
        _super.apply(this, arguments);
    }
    FireElements.prototype.size = function () {
        return this.length;
    };
    /**
     * Get the parents.
     */
    FireElements.prototype.parent = function () {
        var list = new FireElements();
        this.forEach(function (e) {
            list.push(e.parent());
        });
        return list;
    };
    /**
     * Get the chidren.
     */
    FireElements.prototype.children = function () {
        var list = new FireElements();
        this.forEach(function (e) {
            e.children().forEach(function (child) {
                list.push(child);
            });
        });
        return list;
    };
    /**
     * Get the next element.
     */
    FireElements.prototype.next = function (name) {
        var list = new FireElements();
        this.forEach(function (e) {
            list.push(e.next());
        });
        return list;
    };
    /**
     * Get the previous element.
     */
    FireElements.prototype.prev = function (name) {
        var list = new FireElements();
        this.forEach(function (e) {
            list.push(e.prev());
        });
        return list;
    };
    /**
     * Listen a event and execute the callback function when event triggering.
     */
    FireElements.prototype.on = function (event, callback) {
        this.forEach(function (e) {
            e.on(event, callback);
        });
        return this;
    };
    /**
     * Check if the element has the attribut.
     */
    FireElements.prototype.has = function (name) {
        var bool = true;
        this.forEach(function (e) {
            bool = bool && e.has(name);
        });
        return bool;
    };
    /**
     * Define a attribut and its value.
     */
    FireElements.prototype.set = function (name, value) {
        this.forEach(function (e) {
            e.set(name, value);
        });
        return this;
    };
    /**
     * Get value of attribut
     */
    FireElements.prototype.get = function (name) {
        var params = [];
        this.forEach(function (e) {
            params.push(e.get(name));
        });
        return params;
    };
    /**
     * Check if the element has the class.
     */
    FireElements.prototype.hasClass = function (name) {
        var bool = true;
        this.forEach(function (e) {
            bool = bool && e.hasClass(name);
        });
        return bool;
    };
    /**
     * Add the class.
     */
    FireElements.prototype.addClass = function (name) {
        this.forEach(function (e) {
            e.addClass(name);
        });
        return this;
    };
    /**
     * Remove the class.
     */
    FireElements.prototype.removeClass = function (name) {
        this.forEach(function (e) {
            e.removeClass(name);
        });
        return this;
    };
    /**
     * Toggle the class.
     */
    FireElements.prototype.toggleClass = function (name) {
        this.forEach(function (e) {
            e.toggleClass(name);
        });
        return this;
    };
    /**
     * Show the element with its saved display property.
     */
    FireElements.prototype.show = function () {
        this.forEach(function (e) {
            e.show();
        });
        return this;
    };
    /**
     * Hide the element with display egals none.
     */
    FireElements.prototype.hide = function () {
        this.forEach(function (e) {
            e.hide();
        });
        return this;
    };
    /**
     * Toggle the visibility of element.
     */
    FireElements.prototype.toggle = function () {
        this.forEach(function (e) {
            e.toggle();
        });
        return this;
    };
    return FireElements;
}(Array));
/**
 * Overloading of HTMLElement.
 */
var FireElement = (function () {
    /**
     * Setup of object.
     */
    function FireElement(e) {
        this.element = e;
    }
    /**
     * Get the property of HTMLElement.
     */
    FireElement.prototype.getProperty = function (s) {
        return this.element[s];
    };
    /**
     * Get the parent.
     */
    FireElement.prototype.parent = function () {
        return new FireElement(this.getProperty('parentNode'));
    };
    /**
     * Get the chidren.
     */
    FireElement.prototype.children = function () {
        var list = new FireElements();
        [].forEach.call(this.element.children, function (e) {
            list.push(e);
        });
        return list;
    };
    /**
     * Get the next element.
     */
    FireElement.prototype.next = function () {
        return new FireElement(this.getProperty('nextSibling'));
    };
    /**
     * Get the previous element.
     */
    FireElement.prototype.prev = function () {
        return new FireElement(this.getProperty('previousSibling'));
    };
    /**
     * Listen a event and execute the callback function when event triggering.
     */
    FireElement.prototype.on = function (event, callback) {
        if (callback && typeof callback === 'function') {
            this.element.addEventListener(event, callback);
        }
        return this;
    };
    /**
     * Check if the element has the attribut.
     */
    FireElement.prototype.has = function (name) {
        return (this.element.attributes.getNamedItem(name) !== null);
    };
    /**
     * Define a attribut and its value.
     */
    FireElement.prototype.set = function (name, value) {
        this.element.setAttribute(name, value);
        return this;
    };
    /**
     * Get value of attribut
     */
    FireElement.prototype.get = function (name) {
        return this.element.getAttribute(name);
    };
    /**
     * Check if the element has the class.
     */
    FireElement.prototype.hasClass = function (name) {
        return this.element.classList.contains(name);
    };
    /**
     * Add the class.
     */
    FireElement.prototype.addClass = function (name) {
        if (name) {
            this.element.classList.add(name);
        }
        return this;
    };
    /**
     * Remove the class.
     */
    FireElement.prototype.removeClass = function (name) {
        if (name) {
            this.element.classList.remove(name);
        }
        return this;
    };
    /**
     * Toggle the class.
     */
    FireElement.prototype.toggleClass = function (name) {
        if (name) {
            this.element.classList.toggle(name);
        }
        return this;
    };
    /**
     * Show the element with its saved display property.
     */
    FireElement.prototype.show = function () {
        this.element.style.display = (this.display) ? (this.display) : ('');
        return this;
    };
    /**
     * Hide the element with display egals none.
     */
    FireElement.prototype.hide = function () {
        this.display = (this.element.style.display) ? (this.element.style.display) : ('');
        this.element.style.display = 'none';
        return this;
    };
    /**
     * Toggle the visibility of element.
     */
    FireElement.prototype.toggle = function () {
        if (this.element.style.display !== 'none') {
            this.hide();
        }
        else {
            this.show();
        }
        return this;
    };
    return FireElement;
}());
var fire = new FireJs();
