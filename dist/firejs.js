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
        this.datalist = {};
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
     */
    FireJs.prototype.get = function (query) {
        var res = document.querySelectorAll(query);
        var list = new FireElements();
        switch (res.length) {
            case 0:
                list = null;
                break;
            case 1:
                list.push(this.new(res[0]));
                break;
            default:
                [].forEach.call(res, function (e) {
                    list.push(this.new(e));
                }, this);
        }
        return list;
    };
    /**
     * Create a FireElement from HTMLElement.
     */
    FireJs.prototype.new = function (e) {
        var el = e;
        if (el.firejs_id && this.datalist[el.firejs_id]) {
            // If element is known, it was loaded from datalist.
            return this.datalist[el.firejs_id];
        }
        else {
            var f = new FireElement(e, this);
            // Add to datalist elements.
            this.datalist[f.getProperty('firejs_id')] = f;
            return f;
        }
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
     * Get the chidren element.
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
     * Delete on or  de la liste
     */
    FireElements.prototype.not = function (elements) {
        var list = new FireElements();
        var _loop_1 = function(i) {
            var e = this_1[i];
            if (elements.element) {
                if (elements.element !== e.element) {
                    list.push(e);
                }
            }
            else {
                var find_1 = false;
                elements.forEach(function (el) {
                    if (el.element === e.element) {
                        find_1 = true;
                    }
                });
                if (find_1 === false) {
                    list.push(e);
                }
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.length; i++) {
            _loop_1(i);
        }
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
    /**
     *	Get values of form elements.
     */
    FireElements.prototype.val = function () {
        var values = [];
        this.forEach(function (e) {
            values.push(e.val());
        });
        if (values.length === 1) {
            return values[0];
        }
        else {
            return values;
        }
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
    function FireElement(e, firejs) {
        /**
         * Save the display property for hide and show methods.
         */
        this.display = 'block';
        this.firejs = firejs;
        this.element = e;
        if (e) {
            this.css = document.defaultView.getComputedStyle(this.element, null);
            // Need for toggle. 
            this.element.style.display = this.css.display;
        }
        var node = this.element;
        node.firejs_id = Date.now().toString() + '-' + Math.random().toString().substring(2, 7);
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
        return this.firejs.new(this.getProperty('parentNode'));
    };
    /**
     * Get the chidren.
     */
    FireElement.prototype.children = function () {
        var list = new FireElements();
        [].forEach.call(this.getProperty('children'), function (e) {
            list.push(this.firejs.new(e));
        });
        return list;
    };
    /**
     * Get childNodes.
     */
    FireElement.prototype.childNodes = function () {
        return this.element.childNodes;
    };
    /**
     * Get the next element.
     */
    FireElement.prototype.next = function () {
        var el = this.getProperty('nextElementSibling');
        if (el) {
            return this.firejs.new(el);
        }
        else {
            return null;
        }
    };
    /**
     * Get the previous element.
     */
    FireElement.prototype.prev = function () {
        var el = this.getProperty('previousElementSibling');
        if (el) {
            return this.firejs.new(el);
        }
        else {
            return null;
        }
    };
    /**
     * Listen a event and execute the callback function when event triggering.
     */
    FireElement.prototype.on = function (event, callback) {
        if (callback && typeof callback === 'function') {
            var that_1 = this;
            this.element.addEventListener(event, function (event) {
                callback.call(that_1, event);
            });
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
        if (value === null) {
            this.element.removeAttribute(name);
        }
        else {
            this.element.setAttribute(name, value);
        }
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
        this.element.style.display = this.display;
        return this;
    };
    /**
     * Hide the element with display egals none.
     */
    FireElement.prototype.hide = function () {
        if (this.element.style.display !== 'none') {
            this.display = (this.element.style.display) ? (this.element.style.display) : ('block');
        }
        this.element.style.display = 'none';
        return this;
    };
    /**
     * Toggle the visibility of element.
     */
    FireElement.prototype.toggle = function () {
        if (this.element.style.display === 'none') {
            this.show();
        }
        else {
            this.hide();
        }
        return this;
    };
    /**
     *	Get values of form elements.
     */
    FireElement.prototype.val = function () {
        var el;
        if (this.get('id') === null) {
            var id = Math.random().toString();
            this.set('id', id);
            el = document.getElementById(id);
            this.set('id', null);
        }
        else {
            console.log('ko');
            el = document.getElementById(this.get('id'));
        }
        if (el.type && el.type.toLowerCase() === 'checkbox') {
            return el.checked;
        }
        else if (el.value) {
            return el.value;
        }
        else {
            return '';
        }
    };
    return FireElement;
}());
var fire = new FireJs();
