"use strict";
/**
 * Main class.
 */

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FireJS = /*#__PURE__*/function () {
  /**
   * Setup of object.
   */
  function FireJS() {
    _classCallCheck(this, FireJS);

    this.datalist = {};
    this.__ready = false; // to test whether we have singleton or not

    this.time = new Date();
    return this.instance;
  }
  /**
   * Execute the callback function when the page is loaded.
   * @param {Function} callback
   */


  _createClass(FireJS, [{
    key: "ready",
    value: function ready(callback) {
      var _this = this;

      if (callback && typeof callback === "function") {
        if (this.__ready) {
          callback();
        } else {
          document.addEventListener("DOMContentLoaded", function () {
            _this.__ready = true;
            callback();
          });
        }
      }
    }
    /**
     * Get the HTML elements with CSS selector.
     * @param {String} query CSS selector
     * @return {FireElements}
     */

  }, {
    key: "get",
    value: function get(query) {
      var res = document.querySelectorAll(query);
      var list = new FireElements();

      switch (res.length) {
        case 0:
          break;

        case 1:
          list.push(this["new"](res[0]));
          break;

        default:
          [].forEach.call(res, function (e) {
            list.push(this["new"](e));
          }, this);
      }

      return list;
    }
    /**
     * Create a FireElement from Element.
     * @param {Element} e
     * @return {FireElements}
     */

  }, {
    key: "new",
    value: function _new(e) {
      if (!e || !(e instanceof Element)) {
        throw "Fire.new() allow only Element";
        return null;
      }

      var el = e;
      var list = new FireElements();

      if (el.firejs_id && this.datalist[el.firejs_id]) {
        // If element is known, it was loaded from datalist.
        list.push(this.datalist[el.firejs_id]);
      } else {
        var f = new FireElement(e, this); // Add to datalist elements.

        this.datalist[f.prop("firejs_id")] = f;
        list.push(f);
      }

      return list;
    }
    /**
     * Create new HTML element.
     * @param {String} name Tag HTML
     * @return {FireElements}
     */

  }, {
    key: "create",
    value: function create(name) {
      return this["new"](document.createElement(name));
    }
    /**
     * Run AJAX query.
     * @param {Object} data 
     * @param {Function} callback 
     * @return {Promise}
     */

  }, {
    key: "ajax",
    value: function ajax(data, callback) {
      return new Promise(function (resolve, reject) {
        data.method = !data.method ? "GET" : data.method.toUpperCase();
        var xhr = new XMLHttpRequest();
        xhr.open(data.method, data.url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        var params = "";

        if (data.params && _typeof(data.params) === "object") {
          var params_list = [];

          for (var name in data.params) {
            switch (data.params[name]) {
              case true:
                data.params[name] = "1";
                break;

              case false:
                data.params[name] = "0";
                break;

              case null:
              case undefined:
              case NaN:
                data.params[name] = "";
                break;
            }

            params_list.push(name + "=" + encodeURIComponent(data.params[name]));
          }

          params = params_list.join("&");
        }

        xhr.onload = function () {
          var json_return;

          try {
            json_return = JSON.parse(xhr.response);
          } catch (e) {
            json_return = {
              error: "Server return wrong JSON response"
            };
          }

          new Promise(function (resolve, reject) {
            if (typeof callback === "function") {
              callback.call(xhr, json_return);
            }

            resolve();
          }).then(function () {
            resolve(json_return);
          });
        };

        xhr.onerror = function () {
          return reject(xhr.statusText);
        };

        xhr.send(params);
      });
    }
    /**
     * Observe object's value change and execute callback.
     * @param {Object} obj 
     * @param {String|Object|Function} prop
     * @param {Function} callback 
     */

  }, {
    key: "watch",
    value: function watch(obj, prop, callback) {
      if (typeof prop === "function") {
        callback = prop;
        prop = Object.keys(obj);
      }

      if (_typeof(prop) !== "object") {
        prop = [prop];
      }

      var _iterator = _createForOfIteratorHelper(prop),
          _step;

      try {
        var _loop = function _loop() {
          var p = _step.value;
          var value = obj[p];
          Object.defineProperty(obj, p, {
            get: function get() {
              return value;
            },
            set: function set(v) {
              var old_value = value;
              value = v;
              callback(old_value, p);
            }
          });
        };

        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }]);

  return FireJS;
}();
/**
 * Array class contains the FireElements and send to then the calls.
 */


var FireElements = /*#__PURE__*/function () {
  /**
   * Constructor.
   */
  function FireElements() {
    _classCallCheck(this, FireElements);

    // Contains FireElements.
    this.list = [];
  }
  /**
   * Get number of elements.
   * @return {number}
   */


  _createClass(FireElements, [{
    key: "size",
    value: function size() {
      return this.list.length;
    }
    /**
     * Add element to the list.
     * @param {FireElement} e
     * @return {FireElements}
     */

  }, {
    key: "push",
    value: function push(e) {
      this.list.push(e);
      return this;
    }
    /**
     * Walk the lsit of elements with callback.
     * @param {Function} callback 
     * @return {FireElements}
     */

  }, {
    key: "each",
    value: function each(callback) {
      if (callback && typeof callback === "function") {
        this.list.forEach(function (e) {
          callback.call(e, e);
        });
      }

      return this;
    }
    /**
     * Get the parent element.
     * @return {FireElements}
     */

  }, {
    key: "parent",
    value: function parent() {
      var list = new FireElements();
      this.each(function (e) {
        if (e.parent()) {
          list.push(e.parent());
        }
      });
      return list.size() > 0 ? list : null;
    }
    /**
     * Get the parents.
     * @param {String} query
     * @return {FireElements}
     */

  }, {
    key: "parents",
    value: function parents(query) {
      var list = new FireElements();
      this.each(function (e) {
        e.parents(query).each(function (p) {
          list.push(p);
        });
      });
      return list;
    }
    /**
     * Get chidren element.
     * @return {FireElements}
     */

  }, {
    key: "children",
    value: function children() {
      var list = new FireElements();
      this.each(function (e) {
        e.children().each(function () {
          list.push(this);
        });
      });
      return list;
    }
    /**
     * Get clones elements.
     * @param {bool} listeners Copy event listeners on new element.
     * @return {FireElements}
     */

  }, {
    key: "clone",
    value: function clone(listeners) {
      var list = new FireElements();
      this.each(function () {
        list.push(this.clone(listeners));
      });
      return list;
    }
    /**
     * Remove children.
     * @return {FireElements}
     */

  }, {
    key: "empty",
    value: function empty() {
      this.each(function () {
        this.empty();
      });
      return this;
    }
    /**
     * Remove selected elements.
     * @return {null}
     */

  }, {
    key: "remove",
    value: function remove() {
      this.each(function () {
        this.remove();
      });
      return null;
    }
    /**
     * Add element at the end.
     * @param {FireElement} e
     * @return {FireElements}
     */

  }, {
    key: "append",
    value: function append(e) {
      this.each(function (el) {
        if (e.each) {
          e.each(function (e) {
            el.append(e);
          });
        } else {
          el.append(e);
        }
      });
      return this;
    }
    /**
     * Add element at the begin.
     * @param {FireElement} e
     * @return {FireElements}
     */

  }, {
    key: "prepend",
    value: function prepend(e) {
      this.each(function (el) {
        if (e.each) {
          e.each(function (e) {
            el.prepend(e);
          });
        } else {
          el.prepend(e);
        }
      });
      return this;
    }
    /**
     * Set Text element.
     * @param {String} value
     * @return {FireElements}
     */

  }, {
    key: "text",
    value: function text(value) {
      if (typeof value !== "undefined") {
        this.each(function (e) {
          e.text(value);
        });
        return this;
      }

      return this.eq(0).text();
    }
    /**
     * Delete elements in the selected list.
     * @param {FireElements} elements
     * @return {FireElements}
     */

  }, {
    key: "not",
    value: function not(elements) {
      var _this2 = this;

      var list = new FireElements();

      var _loop2 = function _loop2(i) {
        var e = _this2.eq(i);

        if (elements.node()) {
          if (elements.node() !== e.node()) {
            list.push(e);
          }
        } else {
          var find = false;
          elements.each(function (el) {
            if (el.node() === e.node()) {
              find = true;
            }
          });

          if (find === false) {
            list.push(e);
          }
        }
      };

      for (var i = 0; i < this.size(); i++) {
        _loop2(i);
      }

      return list;
    }
    /**
     * Get the next element.
     * @return {FireElements}
     */

  }, {
    key: "next",
    value: function next() {
      var list = new FireElements();
      this.each(function (e) {
        list.push(e.next());
      });
      return list;
    }
    /**
     * Get the previous element.
     * @return {FireElements}
     */

  }, {
    key: "prev",
    value: function prev() {
      var list = new FireElements();
      this.each(function (e) {
        list.push(e.prev());
      });
      return list;
    }
    /**
     * Find elements in children nodes.
     * @param {String} query
     * @return {FireElements}
     */

  }, {
    key: "find",
    value: function find(query) {
      var list = new FireElements();
      this.each(function (el) {
        el.find(query).each(function (e) {
          list.push(e);
        });
      });
      return list;
    }
    /**
     * Trigger a event.
     * @param {String} event
     * @param {Object} params Additionnal parameters
     * @return {FireElements} 
     */

  }, {
    key: "trigger",
    value: function trigger(event, params) {
      this.each(function (e) {
        e.trigger(event, params);
      });
      return this;
    }
    /**
     * Listen a event and execute the callback function when event triggering.
     * @param {String} event
     * @param {Function} callback 
     * @return {FireElements}
     */

  }, {
    key: "on",
    value: function on(event, callback) {
      this.each(function (e) {
        e.on(event, callback);
      });
      return this;
    }
    /**
     * Unbind event listener.
     * @param {String} event
     * @return {FireElements}
     */

  }, {
    key: "off",
    value: function off(event) {
      this.each(function (e) {
        e.off(event);
      });
      return this;
    }
    /**
     * Get events listeners.
     * @param {Object} event 
     */

  }, {
    key: "events",
    value: function events(event) {
      return this.eq(0) ? this.eq(0).events() : {};
    }
    /**
     * Check if the element has the class.
     * @param {String} name
     * @return {bool}
     */

  }, {
    key: "hasClass",
    value: function hasClass(name) {
      var bool = true;
      this.each(function (e) {
        bool = bool && e.hasClass(name);
      });
      return bool;
    }
    /**
     * Add the class.
     * @param {String} name
     * @return {FireElements}
     */

  }, {
    key: "addClass",
    value: function addClass(name) {
      this.each(function (e) {
        e.addClass(name);
      });
      return this;
    }
    /**
     * Remove the class.
     * @param {String} name
     * @return {FireElements}
     */

  }, {
    key: "removeClass",
    value: function removeClass(name) {
      this.each(function (e) {
        e.removeClass(name);
      });
      return this;
    }
    /**
     * Toggle the class.
     * @param {String} name
     * @return {FireElements}
     */

  }, {
    key: "toggleClass",
    value: function toggleClass(name) {
      this.each(function (e) {
        e.toggleClass(name);
      });
      return this;
    }
    /**
     * Setter/getter of attribut the class.
     * @param {String} name
     * @param {String} value
     * @return {FireElements}
     */

  }, {
    key: "prop",
    value: function prop(name, value) {
      if (typeof value !== "undefined") {
        this.each(function (e) {
          e.prop(name, value);
        });
        return this;
      }

      return this.eq(0) ? this.eq(0).prop(name) : null;
    }
    /**
     * Setter/getter of attribut.
     * @param {String} name
     * @param {String} value
     * @return {FireElements}
     */

  }, {
    key: "attr",
    value: function attr(name, value) {
      if (typeof value !== "undefined") {
        this.each(function (e) {
          e.attr(name, value);
        });
        return this;
      }

      return this.eq(0) ? this.eq(0).attr(name) : null;
    }
    /**
     * Setter/getter of special attribut dataset.
     * @param {String} name
     * @param {String} value
     * @return {FireElements}
     */

  }, {
    key: "data",
    value: function data(name, value) {
      if (typeof value !== "undefined") {
        this.each(function (e) {
          e.data(name, value);
        });
        return this;
      }

      return this.eq(0) ? this.eq(0).data(name) : null;
    }
    /**
     * Define CSS properties.
     * @param {String} name
     * @param {String} value
     * @return {FireElements}
     */

  }, {
    key: "css",
    value: function css(name, value) {
      if (typeof value !== "undefined") {
        this.each(function (e) {
          e.css(name, value);
        });
        return this;
      }

      return this.eq(0).css(name);
    }
    /**
     * Define or not and get width element.
     * @param {int} value
     * @return {number}
     */

  }, {
    key: "width",
    value: function width(value) {
      if (value) {
        this.each(function (e) {
          e.width(value);
        });
      }

      return this.eq(0).width();
    }
    /**
     * Define or get height element.
     * @param {int} value
     * @return {number}
     */

  }, {
    key: "height",
    value: function height(value) {
      if (value) {
        this.each(function (e) {
          e.height(value);
        });
      }

      return this.eq(0).height();
    }
    /**
     * Get offset for top and left element in the page.
     * @return {Object} {left, top}
     */

  }, {
    key: "offset",
    value: function offset() {
      if (this.eq(0)) {
        return this.eq(0).offset();
      }

      return null;
    }
    /**
     * Show the element with its saved display property.
     * @return {FireElements}
     */

  }, {
    key: "show",
    value: function show() {
      this.each(function (e) {
        e.show();
      });
      return this;
    }
    /**
     * Hide the element with display egals none.
     * @return {FireElements}
     */

  }, {
    key: "hide",
    value: function hide() {
      this.each(function (e) {
        e.hide();
      });
      return this;
    }
    /**
     * Toggle the visibility of element.
     * @return {FireElements}
     */

  }, {
    key: "toggle",
    value: function toggle() {
      this.each(function (e) {
        e.toggle();
      });
      return this;
    }
    /**
     * Get values of form elements.
     * @return {String}
     */

  }, {
    key: "val",
    value: function val(data) {
      if (typeof data !== "undefined") {
        this.each(function (e) {
          e.val(data);
        });
        return this;
      }

      if (this.eq(0)) {
        return this.eq(0).val();
      }

      return null;
    }
    /**
     * Return the nodes.
     * @return {FireElements}
     */

  }, {
    key: "node",
    value: function node() {
      var list = [];
      this.each(function (e) {
        list.push(e.node());
      });

      if (list.length === 1) {
        return list[0];
      }

      return list;
    }
    /**
     * Get contents of the first element.
     * @return {String}
     */

  }, {
    key: "html",
    value: function html(content) {
      if (typeof content !== "undefined") {
        this.each(function (e) {
          e.html(content);
        });
        return this;
      }

      if (this.eq(0)) {
        return this.eq(0).html();
      }

      return null;
    }
    /**
     * Return the specifique element with its index.
     * @param {int} value 
     * @return {FireElement} 
     */

  }, {
    key: "eq",
    value: function eq(value) {
      if (value < 0) {
        value = this.list.length + (value - 1);
      }

      return this.list[value];
    }
    /**
     * Return the first element.
     * @return {FireElement} 
     */

  }, {
    key: "first",
    value: function first() {
      return this.list[0];
    }
    /**
     * Return the last element.
     * @return {FireElement} 
     */

  }, {
    key: "last",
    value: function last() {
      return this.list[this.list.length - 1];
    }
  }]);

  return FireElements;
}();
/**
 * Overloading of Element.
 */


var FireElement = /*#__PURE__*/function () {
  /**
   * Setup of object.
   * @param {Element} e
   * @param {FireJS} firejs
   */
  function FireElement(e, firejs) {
    _classCallCheck(this, FireElement);

    // Element overloaded.	
    this.__element = e; // Store event listeners for off().	

    this.__handlers = {}; // Library FireJS Factory for new FireElement.

    this.__firejs = firejs; // Save the display property for hide and show methods.

    this.__display = document.defaultView.getComputedStyle(this.node(), null).display.toLowerCase();
    this.__display_show = true;

    if (this.__display === "none") {
      this.__display_show = false;
    }

    this.prop("firejs_id", Date.now().toString() + "-" + Math.random().toString().substring(2, 7));
  }
  /**
   * Get the property of Element.
   * @param {String} name
   */


  _createClass(FireElement, [{
    key: "prop",
    value: function prop(name, value) {
      if (typeof value !== "undefined") {
        if (value === null) {
          this.node()[name] = null;
        } else {
          this.node()[name] = value;
        }

        return this;
      }

      return this.node()[name];
    }
    /**
     * Get the parent.
     * @return {FireElement}
     */

  }, {
    key: "parent",
    value: function parent() {
      return this.__firejs["new"](this.prop("parentNode"));
    }
    /**
     * Get the parents.
     * @param {String} query
     * @return {FireElements}
     */

  }, {
    key: "parents",
    value: function parents(query) {
      var list = new FireElements();
      var selectored = typeof query !== "undefined";
      var current = this;

      while (current.prop("parentElement")) {
        current = this.__firejs["new"](current.prop("parentNode"));
        var node = current.node();

        if (selectored === false || node.matches && node.matches(query) || node.msMatchesSelector && node.msMatchesSelector(query)) {
          list.push(current);
        }
      }

      return list;
    }
    /**
     * Get the chidren.
     * @return {FireElements}
     */

  }, {
    key: "children",
    value: function children() {
      var list = new FireElements();
      var that = this;
      [].forEach.call(that.prop("children"), function (e) {
        list.push(that.__firejs["new"](e));
      });
      return list;
    }
    /**
     * Get clone element.
     * @param {bool} listeners Copy event listeners on new element.
     * @return {FireElements}
     */

  }, {
    key: "clone",
    value: function clone(listeners) {
      var clone = this.__firejs["new"](this.node().cloneNode(true));

      if (!listeners) {
        return clone;
      }

      var events = this._get_events_recursive(this);

      this._copy_events_recursive(clone, events);

      return clone;
    }
    /**
     * Get all events of FireElement and its children.
     * @param {FireElement} node 
     * @param {string} pos 
     * @return {Object}
     */

  }, {
    key: "_get_events_recursive",
    value: function _get_events_recursive(node, pos) {
      var _this3 = this;

      pos = pos || "/";
      var events = {};

      if (Object.entries(node.events()).length > 0) {
        events[pos] = {
          handlers: node.events(),
          element: node.node()
        };
      }

      var i = 0;
      node.children().each(function (c) {
        Object.assign(events, _this3._get_events_recursive(c, pos + i++ + "/"));
      });
      return events;
    }
    /**
     * Copy all events into node and its children.
     * @param {FireElement} node 
     * @param {Object} events 
     * @param {string} pos 
     */

  }, {
    key: "_copy_events_recursive",
    value: function _copy_events_recursive(node, events, pos) {
      var _this4 = this;

      pos = pos || "/";

      if (events[pos]) {
        for (var name in events[pos].handlers) {
          var _iterator2 = _createForOfIteratorHelper(events[pos].handlers[name]),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var handler = _step2.value;
              node.on(name, handler);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      }

      var i = 0;
      node.children().each(function (c) {
        _this4._copy_events_recursive(c, events, pos + i + "/");

        i++;
      });
    }
    /**
     * Remove children.
     * @return {FireElements}
     */

  }, {
    key: "empty",
    value: function empty() {
      var node = this.node();

      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }

      return this;
    }
    /**
     * Remove selected elements.
     * @return {null}
     */

  }, {
    key: "remove",
    value: function remove() {
      this.node().remove();
      return null;
    }
    /**
     * Add element at the end.
     * @param {FireElement} e
     * @return {FireElements}
     */

  }, {
    key: "append",
    value: function append(e) {
      this.node().appendChild(e.clone(true).node());
      return this;
    }
    /**
     * Add element at the end.
     * @param {FireElement} e
     * @return {FireElements}
     */

  }, {
    key: "prepend",
    value: function prepend(e) {
      var children = this.children();
      var child = children.size() > 0 ? children.eq(0).node() : null;
      this.node().insertBefore(e.node(), child);
      return this;
    }
    /**
     * Set Text element.
     * @param {String} value
     * @return {FireElements}
     */

  }, {
    key: "text",
    value: function text(value) {
      if (typeof value !== "undefined") {
        this.prop("textContent", value);
        return this;
      }

      return this.prop("textContent");
    }
    /**
     * Get the next element.
     * @return {FireElement}
     */

  }, {
    key: "next",
    value: function next() {
      var el = this.prop("nextElementSibling");

      if (el) {
        return this.__firejs["new"](el);
      } else {
        return null;
      }
    }
    /**
     * Get the previous element.
     * @return {FireElement}
     */

  }, {
    key: "prev",
    value: function prev() {
      var el = this.prop("previousElementSibling");

      if (el) {
        return this.__firejs["new"](el);
      } else {
        return null;
      }
    }
    /**
     * Find elements in children nodes.
     * @param {String} query
     * @return {FireElements}
     */

  }, {
    key: "find",
    value: function find(query) {
      var list = new FireElements();
      var that = this;
      [].forEach.call(that.node().querySelectorAll(query), function (e) {
        var f = that.__firejs["new"](e);

        list.push(f);
      });
      return list;
    }
    /**
     * Trigger a event.
     * @param {String} event
     * @param {Object} params Additionnal parameters
     * @return {FireElement} 
     */

  }, {
    key: "trigger",
    value: function trigger(event, params) {
      if (typeof this.prop(event) === "function" && !params) {
        this.prop(event).call(this.node());
      } else {
        var object = new CustomEvent(event, {
          bubbles: false,
          cancelable: true,
          detail: params
        });
        this.node().dispatchEvent(object);
      }

      return this;
    }
    /**
     * Listen a event and execute the callback function when event triggering.
     * @param {String} event
     * @param {Function} callback 
     * @return {FireElement}
     */

  }, {
    key: "on",
    value: function on(event, callback) {
      var _this5 = this;

      if (callback && typeof callback === "function") {
        var context = this;

        var handler = function handler(event) {
          if (callback.call(context, event, context) === false) {
            event.preventDefault();
          }
        };

        event.split(/\s+/).forEach(function (e) {
          _this5.node().addEventListener(e, handler, false);

          _this5.__handlers[e] = _this5.__handlers[e] || [];

          _this5.__handlers[e].push(handler);
        });
      }

      return this;
    }
    /**
     * Unbind all event listeners on one event.
     * @param {String} event
     * @return {FireElement}
     */

  }, {
    key: "off",
    value: function off(event) {
      if (this.__handlers[event]) {
        for (var i = 0; i < this.__handlers[event].length; i++) {
          this.node().removeEventListener(event, this.__handlers[event][i], false);

          this.__handlers[event].splice(i--, 1);
        }
      }

      return this;
    }
    /**
     * Get events listeners.
     * @param {Object|Array} event 
     */

  }, {
    key: "events",
    value: function events(event) {
      if (typeof event === "undefined") {
        return this.__handlers;
      }

      return event in this.__handlers ? this.__handlers[event] : [];
    }
    /**
     * Setter/getter of attribut.
     * @param {String} name
     * @param {String} value
     * @return {FireElements}
     */

  }, {
    key: "attr",
    value: function attr(name, value) {
      if (typeof value !== "undefined") {
        if (value === null || value === false) {
          this.node().removeAttribute(name);
        } else {
          this.node().setAttribute(name, value);
        }

        return this;
      }

      return this.node().getAttribute(name);
    }
    /**
     * Setter/getter of special attribut data.
     * @param {String} name
     * @param {String} value
     * @return {FireElements}
     */

  }, {
    key: "data",
    value: function data(name, value) {
      if (typeof value !== "undefined") {
        if (value === null || value === false) {
          delete this.node().dataset[name];
        } else {
          this.node().dataset[name] = value;
        }

        return this;
      }

      return this.node().dataset[name];
    }
    /**
     * Get value of attribut.
     * @param {String} name
     * @return {FireElement}
     */

  }, {
    key: "get",
    value: function get(name) {
      return this.node().getAttribute(name);
    }
    /**
     * Check if the element has the class.
     * @param {String} name
     * @return {bool}
     */

  }, {
    key: "hasClass",
    value: function hasClass(name) {
      return this.node().classList.contains(name);
    }
    /**
     * Add the class.
     * @param {String} name
     * @return {FireElement}
     */

  }, {
    key: "addClass",
    value: function addClass(name) {
      if (name) {
        this.node().classList.add(name);
      }

      return this;
    }
    /**
     * Remove the class.
     * @param {String} name
     * @return {FireElement}
     */

  }, {
    key: "removeClass",
    value: function removeClass(name) {
      if (name) {
        this.node().classList.remove(name);
      }

      return this;
    }
    /**
     * Toggle the class.
     * @param {String} name
     * @return {FireElement}
     */

  }, {
    key: "toggleClass",
    value: function toggleClass(name) {
      if (name) {
        this.node().classList.toggle(name);
      }

      return this;
    }
    /**
     * Define CSS properties.
     * @param {String} name
     * @return {FireElement}
     */

  }, {
    key: "css",
    value: function css(name, value) {
      if (typeof name === "string") {
        this.node().style[name] = value;
      } else if (_typeof(name) === "object") {
        [].forEach.call(Object.keys(name), function (key) {
          this.node().style[key] = name[key];
        }, this);
      }

      return this;
    }
    /**
     * Define or get width element.
     * @param {int} value
     * @return {number}
     */

  }, {
    key: "width",
    value: function width(value) {
      if (value) {
        this.node().style.width = value + "px";
      }

      return this.prop("offsetWidth");
    }
    /**
     * Define or get height element.
     * @param {int} value
     * @return {number}
     */

  }, {
    key: "height",
    value: function height(value) {
      if (value) {
        this.node().style.height = value + "px";
      }

      return this.prop("offsetHeight");
    }
    /**
     * Get offset for top and left element in the page.
     * @return object {left, top}
     */

  }, {
    key: "offset",
    value: function offset() {
      var rect = this.node().getBoundingClientRect();
      return {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
      };
    }
    /**
     * Show the element with its saved display property.
     * @return {FireElement}
     */

  }, {
    key: "show",
    value: function show() {
      if (this.__display === "none") {
        this.node().style.display = "block";
      } else {
        this.node().style.display = "";
      }

      this.__display_show = true;
      return this;
    }
    /**
     * Hide the element with display egals none.
     * @return {FireElement}
     */

  }, {
    key: "hide",
    value: function hide() {
      this.node().style.display = "none";
      this.__display_show = false;
      return this;
    }
    /**
     * Toggle the visibility of element.
     * @return {FireElement}
     */

  }, {
    key: "toggle",
    value: function toggle() {
      if (this.__display_show) {
        this.hide();
      } else {
        this.show();
      }

      return this;
    }
    /**
     * Get values of form elements.
     * @return {String}
     */

  }, {
    key: "val",
    value: function val(data) {
      if (this.prop("type") && this.prop("type").toLowerCase() === "checkbox") {
        if (typeof data !== "undefined") {
          this.prop("checked", data);
        }

        return this.prop("checked");
      } else if (this.prop("type") && this.prop("type").toLowerCase() === "radio") {
        if (typeof data !== "undefined") {
          this.prop("checked", this.prop("value") == data);
        }

        return this.prop("value");
      } else if (typeof this.node().value !== "undefined") {
        if (typeof data !== "undefined") {
          this.prop("value", data);
        }

        return this.prop("value");
      } else {
        return null;
      }
    }
    /**
     * Get contents of the element.
     * @return {String}
     */

  }, {
    key: "html",
    value: function html(content) {
      if (typeof content !== "undefined") {
        this.prop("innerHTML", content);
      }

      return this.prop("innerHTML");
    }
    /**
     * Return the node.
     * @return {Node}
     */

  }, {
    key: "node",
    value: function node() {
      return this.__element;
    }
  }]);

  return FireElement;
}();

var fire = new FireJS();
"use strict";
/**
 * Generic component.
 */


var Component = /*#__PURE__*/function () {
  /**
   * Define defaut value.
   * @param {FireElement} element 
   */
  function Component(element) {
    _classCallCheck(this, Component);

    this.element = fire["new"](element);
    this.new_element = null;
    this.inner_html = false;
  }
  /**
   * Define html with var replacements.
   */


  _createClass(Component, [{
    key: "render",
    value: function render() {
      this.attr();
      var wrapper = document.createElement('div');
      wrapper.innerHTML = this.bind(this.html()).trim();
      this.new_element = fire["new"](wrapper.firstChild);

      if (this.inner_html) {
        this.fill(this.new_element);
      }

      this.set();
    }
    /**
     * Get attributs to main element.
     */

  }, {
    key: "attr",
    value: function attr() {
      var list = this.element.node().attributes;
      this.attributes = {};

      for (var i = 0; i < list.length; i++) {
        this.attributes[list[i].name] = list[i].value;
      }
    }
    /**
     * Set attributs to new element or dynamic HTML.
     * @param {FireElement} node facultative
     */

  }, {
    key: "set",
    value: function set(node) {
      node = node || this.new_element;

      if (this.element.attr("data-tag")) {
        node.attr("data-tag", this.element.attr("data-tag") + "," + this.constructor.tag);
        delete this.attributes["data-tag"];
      } else {
        node.attr("data-tag", this.constructor.tag);
      }

      for (var name in this.attributes) {
        if (name === "class") {
          var classes = this.attributes[name].trim().split(" ");

          var _iterator3 = _createForOfIteratorHelper(classes),
              _step3;

          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var c = _step3.value;
              node.addClass(c);
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
        } else {
          node.attr(name, this.attributes[name]);
        }
      }
    }
    /**
     * Replace variables in html.
     * @param {String} html
     * @return {String}
     */

  }, {
    key: "bind",
    value: function bind(html) {
      this.inner_html = html.indexOf("{$inner_html}") >= 0;
      return html;
    }
    /**
     * Define raw html content.
     * @return {String}
     */

  }, {
    key: "html",
    value: function html() {
      return "";
    }
    /**
     * Insert inner HTML if there is $inner_html var in template.
     * @param {FireElement} node
     */

  }, {
    key: "fill",
    value: function fill(node) {
      var _this6 = this;

      if (this.node_inner_html_found) {
        return true;
      }

      if (node.html().trim() === "{$inner_html}") {
        if (this.element.children().size() > 0) {
          node.empty();
          this.element.children().each(function (child) {
            node.append(child);
          });
        } else {
          node.html(this.element.html());
        }

        this.node_inner_html_found = true;
        return true;
      }

      node.children().each(function (child) {
        _this6.fill(child);
      });
    }
    /**
     * Replace current element by the new one.
     */

  }, {
    key: "replace",
    value: function replace() {
      this.element.parent().node().replaceChild(this.new_element.node(), this.element.node());
    }
    /**
     * Setup trigger of component.
     */

  }, {
    key: "action",
    value: function action() {}
    /**
     * Handle event of component, retrieve event listeners of previous element and and them to new one.
     */

  }, {
    key: "handle",
    value: function handle() {
      var events = this.element.events();

      for (var name in events) {
        var _iterator4 = _createForOfIteratorHelper(events[name]),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var handler = _step4.value;
            this.new_element.on(name, handler);
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      }
    }
  }]);

  return Component;
}();

_defineProperty(Component, "tag", "");

"use strict";
/**
 * Component Manager.
 */


var ComponentManager = /*#__PURE__*/function () {
  /**
   * Constructor.
   */
  function ComponentManager() {
    _classCallCheck(this, ComponentManager);

    this.list = {};
    this.tags = [];
  }
  /**
   * Add componant.
   * @param Component component 
   */


  _createClass(ComponentManager, [{
    key: "add",
    value: function add(component) {
      if (!component.tag) {
        throw "Component without tag property";
      }

      this.list[component.tag] = component;
      this.tags.push(component.tag);
    }
    /**
     * Replace HTML Component.
     * @param string tag 
     * @return bool
     */

  }, {
    key: "replace",
    value: function replace(tag) {
      var _this7 = this;

      if (!this.list[tag]) {
        throw "Tag undefined in component list";
      }

      var replacement = false;
      fire.get(tag).each(function (el) {
        var component = new _this7.list[tag](el.node());
        component.render();
        component.replace();
        component.action();
        component.handle();
        replacement = true;
      });
      return replacement;
    }
    /**
     * Reload operation of replacement.
     */

  }, {
    key: "run",
    value: function run() {
      var replacement = true;

      while (replacement) {
        replacement = false;

        var _iterator5 = _createForOfIteratorHelper(this.tags),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var tag = _step5.value;
            replacement = this.replace(tag) || replacement;
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      }
    }
  }]);

  return ComponentManager;
}();

fire.component = new ComponentManager(fire);
"use strict";

fire.ready(function () {
  fire.component.run();
});
"use strict";

var ComponentFButton = /*#__PURE__*/function (_Component) {
  _inherits(ComponentFButton, _Component);

  var _super = _createSuper(ComponentFButton);

  function ComponentFButton() {
    _classCallCheck(this, ComponentFButton);

    return _super.apply(this, arguments);
  }

  _createClass(ComponentFButton, [{
    key: "html",
    value: function html() {
      return "\n            <button class=\"button\">\n                {$inner_html}\n            </button>\n        ";
    }
  }]);

  return ComponentFButton;
}(Component);

_defineProperty(ComponentFButton, "tag", "fbutton");

fire.component.add(ComponentFButton);
"use strict";

var ComponentFGroupField = /*#__PURE__*/function (_Component2) {
  _inherits(ComponentFGroupField, _Component2);

  var _super2 = _createSuper(ComponentFGroupField);

  function ComponentFGroupField(element) {
    _classCallCheck(this, ComponentFGroupField);

    return _super2.call(this, element);
  }

  _createClass(ComponentFGroupField, [{
    key: "html",
    value: function html() {
      return "\n            <div class=\"group_field\">\n                {$inner_html}\n            </div>\n        ";
    }
  }, {
    key: "handle",
    value: function handle() {
      _get(_getPrototypeOf(ComponentFGroupField.prototype), "handle", this).call(this);

      var el = this.new_element;
      el.on("active", function (ev) {
        var el = fire["new"](ev.target);
        el.addClass("active");
      });
      el.on("desactive", function (ev) {
        var el = fire["new"](ev.target);
        el.removeClass("active");
      });
      el.children().trigger("init");
    }
  }]);

  return ComponentFGroupField;
}(Component);

_defineProperty(ComponentFGroupField, "tag", "fgroup_field");

fire.component.add(ComponentFGroupField);
"use strict";

var ComponentFInput = /*#__PURE__*/function (_Component3) {
  _inherits(ComponentFInput, _Component3);

  var _super3 = _createSuper(ComponentFInput);

  function ComponentFInput(element) {
    _classCallCheck(this, ComponentFInput);

    return _super3.call(this, element);
  }

  _createClass(ComponentFInput, [{
    key: "html",
    value: function html() {
      return "\n\t\t\t<fgroup_field>    \n\t\t\t\t<input/>\n\t\t\t\t<span class=\"bar\"></span>\n\t\t\t\t<label>{$label}</label>\n\t\t\t</fgroup_field>\n\t\t";
    }
  }, {
    key: "bind",
    value: function bind(html) {
      html = html.replace("{$label}", this.element.attr("data-label"));
      delete this.attributes["data-label"];
      return html;
    }
  }, {
    key: "set",
    value: function set() {
      _get(_getPrototypeOf(ComponentFInput.prototype), "set", this).call(this, this.new_element.find("input"));
    }
  }, {
    key: "action",
    value: function action() {
      var el = this.new_element.find("input");
      el.parent().trigger(el.val() ? "active" : "desactive");
    }
  }, {
    key: "handle",
    value: function handle() {
      var el = this.new_element.find("input");
      el.on("init blur input", function (ev) {
        var el = fire["new"](ev.target);
        var event = el.val() ? "active" : "desactive";
        el.parent().trigger(event);
      });
    }
  }]);

  return ComponentFInput;
}(Component);

_defineProperty(ComponentFInput, "tag", "finput");

fire.component.add(ComponentFInput);
"use strict";

var ComponentFModal = /*#__PURE__*/function (_Component4) {
  _inherits(ComponentFModal, _Component4);

  var _super4 = _createSuper(ComponentFModal);

  function ComponentFModal(element) {
    _classCallCheck(this, ComponentFModal);

    return _super4.call(this, element);
  }

  _createClass(ComponentFModal, [{
    key: "html",
    value: function html() {
      return "\n            <div class=\"modal\">\n                <div class=\"box\">\n                    <div class=\"head\">\n                        <div class=\"title\">{$title}</div>\n                        <a class=\"close\">\n                            <img src=\"{$image}\" title=\"Fermer la Popin\"/>\n                        </a>\n                    </div>\n                    <div class=\"content\">\n                        {$inner_html}\n                    </div>\n                </div>\n                <div class=\"background_mask\"></div>\n            </div>\n        ";
    }
  }, {
    key: "bind",
    value: function bind(html) {
      html = html.replace("{$title}", this.attributes["data-title"]);
      delete this.attributes["data-title"];
      html = html.replace("{$image}", this.attributes["data-image"]);
      delete this.attributes["data-image"];
      return _get(_getPrototypeOf(ComponentFModal.prototype), "bind", this).call(this, html);
    }
  }, {
    key: "action",
    value: function action() {
      var el = this.new_element;
      el.find(".close, .background_mask").on("click", function (ev) {
        var el = fire["new"](ev.target);
        el.parents(".modal").trigger("close");
      });
    }
  }, {
    key: "handle",
    value: function handle() {
      _get(_getPrototypeOf(ComponentFModal.prototype), "handle", this).call(this);

      var el = this.new_element;
      el.on("close", function (ev) {
        var el = fire["new"](ev.target);
        el.addClass("hide").removeClass("visible");
      });
      el.on("open", function (ev) {
        var el = fire["new"](ev.target);
        el.removeClass("hide").addClass("visible");
      });
    }
  }]);

  return ComponentFModal;
}(Component);

_defineProperty(ComponentFModal, "tag", "fmodal");

fire.component.add(ComponentFModal);
"use strict";

var ComponentFModalButton = /*#__PURE__*/function (_Component5) {
  _inherits(ComponentFModalButton, _Component5);

  var _super5 = _createSuper(ComponentFModalButton);

  function ComponentFModalButton(element) {
    _classCallCheck(this, ComponentFModalButton);

    return _super5.call(this, element);
  }

  _createClass(ComponentFModalButton, [{
    key: "html",
    value: function html() {
      return "\n            <fbutton>\n                {$inner_html}\n            </fbutton>\n        ";
    }
  }, {
    key: "action",
    value: function action() {
      var el = this.new_element;
      el.on("click", function () {
        fire.get("#" + this.attr("data-id")).trigger("open");
      });
    }
  }]);

  return ComponentFModalButton;
}(Component);

_defineProperty(ComponentFModalButton, "tag", "fmodal_button");

fire.component.add(ComponentFModalButton);
"use strict";

var ComponentFPage = /*#__PURE__*/function (_Component6) {
  _inherits(ComponentFPage, _Component6);

  var _super6 = _createSuper(ComponentFPage);

  function ComponentFPage(element) {
    var _this8;

    _classCallCheck(this, ComponentFPage);

    _this8 = _super6.call(this, element);
    _this8.default_urlparam = "page";
    _this8.default_view = 2;
    return _this8;
  }

  _createClass(ComponentFPage, [{
    key: "html",
    value: function html() {
      return "\n\t\t\t<div class=\"bloc_page\">\n\t\t\t\t<div class=\"page_begin\">\n\t\t\t\t\t<svg viewBox=\"0 0 24 24\" >\n\t\t\t\t\t\t<path d=\"M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z\"/>\n\t\t\t\t\t\t<path d=\"M24 24H0V0h24v24z\" fill=\"none\"/>\n\t\t\t\t\t</svg>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"page_prev\">\n\t\t\t\t\t<svg viewBox=\"0 0 24 24\">\n\t\t\t\t\t\t<path d=\"M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z\"/>\n\t\t\t\t\t\t<path d=\"M0-.5h24v24H0z\" fill=\"none\"/>\n\t\t\t\t\t</svg>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"bloc_page_number\">\n\t\t\t\t\n\t\t\t\t</div>\n\t\t\t\t<div class=\"page_next\">\n\t\t\t\t\t<svg viewBox=\"0 0 24 24\">\n\t\t\t\t\t\t<path d=\"M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z\"/>\n\t\t\t\t\t\t<path d=\"M0-.25h24v24H0z\" fill=\"none\"/>\n\t\t\t\t\t</svg>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"page_end\">\n\t\t\t\t\t<svg viewBox=\"0 0 24 24\">\n\t\t\t\t\t\t<path d=\"M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z\"/>\n\t\t\t\t\t\t<path d=\"M0 0h24v24H0V0z\" fill=\"none\"/>\n\t\t\t\t\t</svg>\n\t\t\t\t</div>\n            </div>\n        ";
    }
  }, {
    key: "set",
    value: function set() {
      _get(_getPrototypeOf(ComponentFPage.prototype), "set", this).call(this);

      var current = parseInt(this.new_element.attr("data-current"));

      if (!current) {
        var list = new URLSearchParams(window.location.search);
        var value = list.get(this.new_element.data("urlparam") || this.default_urlparam);
        current = parseInt(value) || 1;
      }

      var begin = parseInt(this.new_element.attr("data-begin")) || 1;
      var end = parseInt(this.new_element.attr("data-end")) || 1;
      var view = parseInt(this.new_element.attr("data-view")) || this.default_view;
      var bloc = this.new_element.find(".bloc_page_number").empty();
      var prev_split = false;
      var next_split = false;

      for (var i = begin; i <= end; i++) {
        if (i == begin || i == end || i >= current - view && i <= current + view) {
          var page = fire.create("div").text(i).attr("data-page", i);

          if (i == current) {
            page.addClass("selected");
          }

          bloc.append(page);
        } else {
          if (i < current - view && prev_split === false) {
            var _page = fire.create("div").text("...").addClass("not_number");

            bloc.append(_page);
            prev_split = true;
          }

          if (i > current + view && next_split === false) {
            var _page2 = fire.create("div").text("...").addClass("not_number");

            bloc.append(_page2);
            next_split = true;
          }
        }
      }

      this.new_element.find(".page_begin svg").attr("data-page", begin);
      this.new_element.find(".page_prev svg").attr("data-page", current - 1 > begin ? current - 1 : begin);
      this.new_element.find(".page_next svg").attr("data-page", current + 1 < end ? current + 1 : end);
      this.new_element.find(".page_end svg").attr("data-page", end);
    }
  }, {
    key: "action",
    value: function action() {
      var _this9 = this;

      var pages = this.new_element.find("*[data-page]");
      pages.off("click").on("click", function (ev) {
        var el = fire["new"](ev.target);

        _this9.new_element.trigger("change", {
          page: el.attr("data-page")
        });
      });
    }
  }, {
    key: "handle",
    value: function handle() {
      var _this10 = this;

      var element = this.new_element;
      element.on("change", function (ev) {
        if (ev.detail && ev.detail.page) {
          var page = ev.detail.page;
          var target = element.data("target") || location.href;

          if (typeof window[target] === "function") {
            window[target](page);
          } else {
            if (target.indexOf("{$page}") > 0) {
              target = target.replace("{$page}", page); // Actualize the view.

              element.attr("data-current", page);

              _this10.set();

              _this10.action();
            } else {
              var urlparam = element.data("urlparam") || _this10.default_urlparam;

              var regex = new RegExp("(\\?|\\&)page=\\d+");
              target = target.replace(regex, "");

              if (target.indexOf("?") > 0) {
                target = target + "&" + urlparam + "=" + page;
              } else {
                target = target + "?" + urlparam + "=" + page;
              }

              location.href = target;
            }
          } // Actualize the view.


          element.attr("data-current", page);

          _this10.set();

          _this10.action();
        }
      });
    }
  }]);

  return ComponentFPage;
}(Component);

_defineProperty(ComponentFPage, "tag", "fpage");

fire.component.add(ComponentFPage);
"use strict";

var ComponentFSelect = /*#__PURE__*/function (_Component7) {
  _inherits(ComponentFSelect, _Component7);

  var _super7 = _createSuper(ComponentFSelect);

  function ComponentFSelect(element) {
    _classCallCheck(this, ComponentFSelect);

    return _super7.call(this, element);
  }

  _createClass(ComponentFSelect, [{
    key: "html",
    value: function html() {
      return "\n\t\t\t<fgroup_field>    \n\t\t\t\t<select>{$inner_html}</select>\n\t\t\t\t<span class=\"bar\"></span>\n\t\t\t\t<label>{$label}</label>\n\t\t\t</fgroup_field>\n\t\t";
    }
  }, {
    key: "bind",
    value: function bind(html) {
      html = _get(_getPrototypeOf(ComponentFSelect.prototype), "bind", this).call(this, html);
      html = html.replace("{$label}", this.element.attr("data-label"));
      delete this.attributes["data-label"];
      return html;
    }
  }, {
    key: "set",
    value: function set() {
      _get(_getPrototypeOf(ComponentFSelect.prototype), "set", this).call(this, this.new_element.find("select"));
    }
  }, {
    key: "action",
    value: function action() {
      var el = this.new_element.find("select");
      el.parent().trigger(el.val() ? "active" : "desactive");
    }
  }, {
    key: "handle",
    value: function handle() {
      var el = this.new_element.find("select");
      el.on("init blur input", function (ev) {
        var el = fire["new"](ev.target);
        var event = el.val() ? "active" : "desactive";
        el.parent().trigger(event);
      });
    }
  }]);

  return ComponentFSelect;
}(Component);

_defineProperty(ComponentFSelect, "tag", "fselect");

fire.component.add(ComponentFSelect);
"use strict";

var ComponentFSubmit = /*#__PURE__*/function (_Component8) {
  _inherits(ComponentFSubmit, _Component8);

  var _super8 = _createSuper(ComponentFSubmit);

  function ComponentFSubmit() {
    _classCallCheck(this, ComponentFSubmit);

    return _super8.apply(this, arguments);
  }

  _createClass(ComponentFSubmit, [{
    key: "html",
    value: function html() {
      return "\n\t\t\t<div class=\"submit_form_center\">    \n                <button class=\"button\">\n                    {$inner_html}\n                </button>\n\t\t\t</div>\n\t\t";
    }
  }, {
    key: "set",
    value: function set() {
      _get(_getPrototypeOf(ComponentFSubmit.prototype), "set", this).call(this, this.new_element.find("button"));
    }
  }]);

  return ComponentFSubmit;
}(Component);

_defineProperty(ComponentFSubmit, "tag", "fsubmit");

fire.component.add(ComponentFSubmit);
"use strict";

var ComponentFTab = /*#__PURE__*/function (_Component9) {
  _inherits(ComponentFTab, _Component9);

  var _super9 = _createSuper(ComponentFTab);

  function ComponentFTab(element) {
    _classCallCheck(this, ComponentFTab);

    return _super9.call(this, element);
  }

  _createClass(ComponentFTab, [{
    key: "html",
    value: function html() {
      return "\n            <div class=\"bloc_tab\">\n\t\t\t\t<ul class=\"bloc_tab_navigation\"></ul>\n\t\t\t\t<div class=\"bloc_tab_container\">\n\t\t\t\t\t{$inner_html}\n\t\t\t\t</div>\n            </div>\n        ";
    }
  }, {
    key: "parse_id",
    value: function parse_id(id) {
      return id.replace(/\W+/, "").toLowerCase();
    }
  }, {
    key: "set",
    value: function set() {
      var _this11 = this;

      _get(_getPrototypeOf(ComponentFTab.prototype), "set", this).call(this);

      var menu = this.new_element.find(".bloc_tab_navigation");
      var container = this.new_element.find(".bloc_tab_container");
      var is_selected = false;
      container.children().each(function (tab) {
        var id = _this11.parse_id(tab.data("name"));

        tab.data("tab", id);
        is_selected = is_selected || tab.hasClass("selected");
        var li = fire.create("li").data("tab", id).text(tab.data("name"));

        if (tab.hasClass("selected")) {
          li.addClass("selected");
        }

        menu.append(li);
        tab.addClass("bloc_tab_container_part");
      });

      if (!is_selected) {
        // If HTML anchor is defined and fit tab, it will be showing.
        var replaced = false;

        if (location.hash !== "") {
          var id = this.parse_id(location.hash.substring(1));
          this.new_element.children().children().each(function () {
            if (this.data("tab") === id) {
              this.addClass("selected");
              replaced = true;
            } else {
              this.removeClass("selected");
            }
          });
        }

        if (!replaced) {
          menu.children().eq(0).addClass("selected");
          container.children().eq(0).addClass("selected");
        }
      }
    }
  }, {
    key: "action",
    value: function action() {
      _get(_getPrototypeOf(ComponentFTab.prototype), "action", this).call(this);

      var el = this.new_element.find(".bloc_tab_navigation li");
      el.on("click", function (ev) {
        var el = fire["new"](ev.target);
        el.parent().parent().find(".bloc_tab_container").trigger("change", {
          id: el.data("tab")
        });
      });
    }
  }, {
    key: "handle",
    value: function handle() {
      _get(_getPrototypeOf(ComponentFTab.prototype), "handle", this).call(this);

      var el = this.new_element.find(".bloc_tab_container");
      var parent = this.new_element;
      el.on("change", function (ev) {
        if (ev.detail) {
          var id = ev.detail.id;
          parent.children().children().each(function () {
            if (this.data("tab") === id) {
              this.addClass("selected");
            } else {
              this.removeClass("selected");
            }
          });
        }
      });
    }
  }]);

  return ComponentFTab;
}(Component);

_defineProperty(ComponentFTab, "tag", "ftab");

fire.component.add(ComponentFTab);