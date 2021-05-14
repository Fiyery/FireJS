"use strict";

/**
 * Main class.
 */
class FireJS {
	/**
	 * Setup of object.
	 */
	constructor() {
		this.datalist = {}
		this.__ready = false;

		// to test whether we have singleton or not
		this.time = new Date()

		return this.instance;
	}

	/**
	 * Execute the callback function when the page is loaded.
	 * @param {Function} callback
	 */
	ready(callback) {
		if (callback && typeof callback === "function") {

			if (this.__ready) {
				callback();
			} else {
				document.addEventListener("DOMContentLoaded", () => {
					this.__ready = true;
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
	get(query) {
		let res = document.querySelectorAll(query);
		let list = new FireElements();
		switch (res.length) {
			case 0 : 
				break;
			case 1 : 
				list.push(this.new(res[0]));
				break;
			default : 
				[].forEach.call(res, function(e){
					list.push(this.new(e));
				}, this);
		}
		return list;
	}

	/**
	 * Create a FireElement from Element.
	 * @param {Element} e
	 * @return {FireElements}
	 */
	new(e) {
		if (typeof e === "string") {
			e = this.parse(e);
		}
		if (!e || !(e instanceof Element)) {
			console.trace();
			console.log("fire.new() => ", e);
			throw "Fire.new() allow only Element or HTML";
			return null;
		}
		let el = e;
		let list = new FireElements();
		if (el.firejs_id && this.datalist[el.firejs_id]) {
			// If element is known, it was loaded from datalist.
			list.push(this.datalist[el.firejs_id]);
		} else {
			let f = new FireElement(e, this);
			// Add to datalist elements.
			this.datalist[f.prop("firejs_id")] = f;
			list.push(f);
		}
		return list;
	}

	/**
	 * Convert HTML into Element
	 * @param {String} html 
	 * @return Element
	 */
	parse(html) {
		var div = document.createElement('div');
  		div.innerHTML = html.trim();
  		return div.firstElementChild; 
	}

	/**
	 * Create new HTML element.
	 * @param {String} name Tag HTML
	 * @return {FireElements}
	 */
	create(name) {
		return this.new(document.createElement(name));
	}

	/**
	 * Run AJAX query.
	 * @param {Object} data 
	 * @param {Function} callback 
	 * @return {Promise}
	 */
	ajax(data, callback) {
		return new Promise((resolve, reject) => {
			data.method = (!data.method) ? ("GET") : (data.method.toUpperCase());
			let xhr = new XMLHttpRequest();
			xhr.open(data.method, data.url);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			let params = "";
			if (data.params && (typeof data.params === "object")) {
				let params_list = [];
				for(let name in data.params) {
					switch (data.params[name]) {
						case true: 
							data.params[name] = "1"; break;
						case false: 
							data.params[name] = "0"; break;
						case null:
						case undefined:
						case NaN:
							data.params[name] = ""; break;
					}
					params_list.push(name+"="+encodeURIComponent(data.params[name]));
				}
				params = params_list.join("&");
			}
			xhr.onload = () => {
				let json_return;
				try {
					json_return = JSON.parse(xhr.response);
				} catch (e) {
					json_return = {error : "Server return wrong JSON response"};
				}
				new Promise((resolve, reject) => {
					if (typeof callback === "function") {
						callback.call(xhr, json_return);
					}
					resolve();
				}).then(() => {
					resolve(json_return);
				})
			};
			xhr.onerror = () => reject(xhr.statusText);
			xhr.send(params);
		});
	}

	/**
	 * Observe object's value change and execute callback.
	 * @param {Object} obj 
	 * @param {String|Object|Function} prop
	 * @param {Function} callback 
	 */
	watch(obj, prop, callback) {
		if (typeof prop === "function") {
			callback = prop;
			prop = Object.keys(obj);
		}
		if (typeof prop !== "object") {
			prop = [prop];
		}
		for(let p of prop) {
			let value = obj[p];
			Object.defineProperty(obj, p, {
				get: function () { 
					return value; 
				},
				set: function (v) {
					let old_value = value;
					value = v;
					callback(old_value, p);
				}
			});
		}
	}

	/**
	 * Iterate on object or array.
	 * @param {Object|Array} object 
	 * @param {Function} callback 
	 */
	each(object, callback) {
		if (typeof object !== "object" || typeof callback !== "function") {
			return false;
		}
		Object.keys(object).forEach(function(key) {
			callback(object[key], key);
		});
	}
}

/**
 * Array class contains the FireElements and send to then the calls.
 */
class FireElements {

	/**
	 * Constructor.
	 */
	constructor() {
		// Contains FireElements.
		this.list = [];
	}
	
	/**
	 * Get number of elements.
	 * @return {number}
	 */
	size() {
		return this.list.length;
	}

	/**
	 * Add element to the list.
	 * @param {FireElement} e
	 * @return {FireElements}
	 */
	push(e) {
		this.list.push(e);
		return this;
	}

	/**
	 * Walk the lsit of elements with callback.
	 * @param {Function} callback 
	 * @return {FireElements}
	 */
	each(callback) {
		if (callback && typeof callback === "function") {
			this.list.forEach((e) => {
				callback.call(e, e);
			});			
		}
		return this;
	}
	
	/**
	 * Get the parent element.
	 * @return {FireElements}
	 */
	parent() {
		let list = new FireElements();
		this.each(function(e){
			if (e.parent()) {
				list.push(e.parent());
			}
		});
		return (list.size() > 0) ? (list) : (null);
	}

	/**
	 * Get the parents.
	 * @param {String} query
	 * @return {FireElements}
	 */
	parents(query) {
		let list = new FireElements();
		this.each(function(e){
			e.parents(query).each(function(p){
				list.push(p);
			});
		});
		return list;
	}
	
	/**
	 * Get chidren element.
	 * @return {FireElements}
	 */
	children() {
		let list = new FireElements();
		this.each(function(e){
			e.children().each(function(){
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
	clone(listeners) {
		let list = new FireElements();
		this.each(function(){
			list.push(this.clone(listeners));
		});
		return list;
	}

	/**
	 * Remove children.
	 * @return {FireElements}
	 */
	empty() {
		this.each(function(){
			this.empty();
		});
		return this;
	}

	/**
	 * Remove selected elements.
	 * @return {null}
	 */
	remove() {
		this.each(function(){
			this.remove();
		});
		return null;
	}

	/**
	 * Add element at the end.
	 * @param {FireElement} e
	 * @return {FireElements}
	 */
	append(e) {
		this.each(function(el){
			if (e.each) {
				e.each(function(e){
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
	prepend(e) {
		this.each(function(el){
			if (e.each) {
				e.each(function(e){
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
	text(value) {
		if (typeof value !== "undefined") {
			this.each(function(e){
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
	not(elements) {
		let list = new FireElements();
		for (let i = 0; i < this.size(); i++) {
			let e = this.eq(i);
			if (elements.node()) {
				if (elements.node() !== e.node()) {
					list.push(e);
				}
			} else {
				let find = false;
				elements.each(function(el){
					if (el.node() === e.node()) {
						find = true;
					}
				});
				if (find === false) {
					list.push(e);
				}
			}
		}
		return list;
	}
	
	/**
	 * Get the next element.
	 * @return {FireElements}
	 */
	next() {
		let list = new FireElements();
		this.each(function(e){
			list.push(e.next());
		});
		return list;
	}
	
	/**
	 * Get the previous element.
	 * @return {FireElements}
	 */
	prev() {
		let list = new FireElements();
		this.each(function(e){
			list.push(e.prev());
		});
		return list;
	}

	/**
	 * Find elements in children nodes.
	 * @param {String} query
	 * @return {FireElements}
	 */
	find(query) {
		let list = new FireElements();
		this.each(function(el){
			el.find(query).each(function(e){
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
	trigger(event, params) {
		this.each(function(e){
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
	on(event, callback)  {
		this.each(function(e){
			e.on(event, callback);
		});
		return this;
	}

	/**
	 * Unbind event listener.
	 * @param {String} event
	 * @return {FireElements}
	 */
	off(event)  {
		this.each(function(e){
			e.off(event);
		});
		return this;
	}

	/**
	 * Get events listeners.
	 * @param {Object} event 
	 */
	events(event) {
		return (this.eq(0)) ? this.eq(0).events() : {};
	}
	
	/**
	 * Check if the element has the class.
	 * @param {String} name
	 * @return {bool}
	 */
	hasClass(name) {
		let bool = true;
		this.each(function(e){
			bool = bool && e.hasClass(name);
		});
		return bool;
	}
	
	/**
	 * Add the class.
	 * @param {String} name
	 * @return {FireElements}
	 */
	addClass(name) {
		this.each(function(e){
			e.addClass(name);
		});
		return this;
	}
	
	/**
	 * Remove the class.
	 * @param {String} name
	 * @return {FireElements}
	 */
	removeClass(name) {
		this.each(function(e){
			e.removeClass(name);
		});
		return this;
	}
	
	/**
	 * Toggle the class.
	 * @param {String} name
	 * @return {FireElements}
	 */
	toggleClass(name) {
		this.each(function(e){
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
	prop(name, value) {
		if (typeof value !== "undefined") {
			this.each(function(e){
				e.prop(name, value);
			});
			return this;
		}
		return (this.eq(0)) ? (this.eq(0).prop(name)) : (null);
	}

	/**
	 * Setter/getter of attribut.
	 * @param {String} name
	 * @param {String} value
	 * @return {FireElements}
	 */
	attr(name, value) {
		if (typeof value !== "undefined") {
			this.each(function(e){
				e.attr(name, value);
			});
			return this;
		}
		return (this.eq(0)) ? (this.eq(0).attr(name)) : (null);
	}

	/**
	 * Setter/getter of special attribut dataset.
	 * @param {String} name
	 * @param {String} value
	 * @return {FireElements}
	 */
	data(name, value) {
		if (typeof value !== "undefined") {
			this.each(function(e){
				e.data(name, value);
			});
			return this;
		}
		return (this.eq(0)) ? (this.eq(0).data(name)) : (null);
	}

	/**
	 * Define CSS properties.
	 * @param {String} name
	 * @param {String} value
	 * @return {FireElements}
	 */
	css(name, value) {
		if (typeof name !== "undefined") {
			this.each(function(e){
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
	width(value) {
		if (value) {
			this.each(function(e){
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
	height(value) {
		if (value) {
			this.each(function(e){
				e.height(value);
			});
		}
		return this.eq(0).height();
	}

	/**
	 * Get offset for top and left element in the page.
	 * @return {Object} {left, top}
	 */
	offset() {
		if (this.eq(0)) {
			return this.eq(0).offset();
		}
		return null;
	}
	
	/**
	 * Show the element with its saved display property.
	 * @return {FireElements}
	 */
	show() {
		this.each(function(e){
			e.show();
		});
		return this;
	}	

	/**
	 * Hide the element with display egals none.
	 * @return {FireElements}
	 */
	hide() {
		this.each(function(e){
			e.hide();
		});
		return this;
	}
	
	/**
	 * Toggle the visibility of element.
	 * @return {FireElements}
	 */
	toggle() {
		this.each(function(e){ 
			e.toggle();
		});
		return this;
	}

	/**
	 * Get values of form elements.
	 * @return {String}
	 */
	val(data) {
		if (typeof data !== "undefined") {
			this.each(function(e) {
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
	node() {
		let list = [];
		this.each(function(e) {
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
	html(content) {
		if (typeof content !== "undefined") {
			this.each(function(e) {
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
	eq(value) {
		if (value < 0) {
			value = this.list.length + (value - 1);
		}
		return this.list[value];
	}

	/**
	 * Return the first element.
	 * @return {FireElement} 
	 */
	first() {
		return this.list[0];
	}

	/**
	 * Return the last element.
	 * @return {FireElement} 
	 */
	last() {
		return this.list[this.list.length - 1];
	}
}

/**
 * Overloading of Element.
 */
class FireElement {
	/**
	 * Setup of object.
	 * @param {Element} e
	 * @param {FireJS} firejs
	 */
	constructor(e, firejs) {
		// Element overloaded.	
		this.__element = e;

		// Store event listeners for off().	
		this.__handlers = {};

		// Library FireJS Factory for new FireElement.
		this.__firejs = firejs;

		// Save the display property for hide and show methods.
		this.__display = document.defaultView.getComputedStyle(this.node(), null).display.toLowerCase();
		this.__display_show = true;
		if (this.__display === "none") {
			this.__display_show = false;
		}
		
		this.prop("firejs_id", Date.now().toString()+"-"+Math.random().toString().substring(2, 7));
	}
	
	/**
	 * Get the property of Element.
	 * @param {String} name
	 */
	prop(name, value) {
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
	parent() {
		return this.__firejs.new(this.prop("parentNode"));
	}

	/**
	 * Get the parents.
	 * @param {String} query
	 * @return {FireElements}
	 */
	parents(query) {
		let list = new FireElements();
		let selectored = (typeof query !== "undefined");

		let current = this;
		while (current.prop("parentElement")) {
			current = this.__firejs.new(current.prop("parentNode"));
			let node = current.node();
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
	children() {
		let list = new FireElements();
		let that = this;
		[].forEach.call(that.prop("children"), function(e){
			list.push(that.__firejs.new(e));
		});
		return list;
	}

	/**
	 * Get clone element.
	 * @param {bool} listeners Copy event listeners on new element.
	 * @return {FireElements}
	 */
	clone(listeners) {
		let clone = this.__firejs.new(this.node().cloneNode(true));
		if (!listeners) {
			return clone;
		}
		let events = this._get_events_recursive(this);
		this._copy_events_recursive(clone, events);
		return clone;
	}

	/**
	 * Get all events of FireElement and its children.
	 * @param {FireElement} node 
	 * @param {string} pos 
	 * @return {Object}
	 */
	_get_events_recursive(node, pos) {
		pos = pos || "/"
		let events = {};
		if (Object.entries(node.events()).length > 0) {
			events[pos] = {
				handlers: node.events(),
				element: node.node()
			}
		}
		let i = 0;
		node.children().each((c) => {
			Object.assign(events, this._get_events_recursive(c, pos + i++ + "/"));
		});
		return events;
	}

	/**
	 * Copy all events into node and its children.
	 * @param {FireElement} node 
	 * @param {Object} events 
	 * @param {string} pos 
	 */
	_copy_events_recursive(node, events, pos) {
		pos = pos || "/";
		if (events[pos]) {
			for (let name in events[pos].handlers) {
				for (let handler of events[pos].handlers[name]) {
					node.on(name, handler);
				}
			}
		}
		let i = 0;
		node.children().each((c) => {
			this._copy_events_recursive(c, events, pos + i + "/");
			i++;
		});
	}

	/**
	 * Remove children.
	 * @return {FireElements}
	 */
	empty() {
		let node = this.node();
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
		return this;
	}

	/**
	 * Remove selected elements.
	 * @return {null}
	 */
	remove() {
		this.node().remove();
		return null;
	}

	/**
	 * Add element at the end.
	 * @param {FireElement} e
	 * @return {FireElements}
	 */
	append(e) {
		this.node().appendChild(e.clone(true).node());
		return this;
	}

	/**
	 * Add element at the end.
	 * @param {FireElement} e
	 * @return {FireElements}
	 */
	prepend(e) {
		let children = this.children();
		let child = (children.size() > 0) ? (children.eq(0).node()) : (null);
		this.node().insertBefore(e.node(), child);
		return this;
	}

	/**
	 * Set Text element.
	 * @param {String} value
	 * @return {FireElements}
	 */
	text(value) {
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
	next() {
		let el = this.prop("nextElementSibling");
		if (el) {
			return this.__firejs.new(el);
		} else {
			return null;		
		}
	}
	
	/**
	 * Get the previous element.
	 * @return {FireElement}
	 */
	prev() {
		let el = this.prop("previousElementSibling");
		if (el) {
			return this.__firejs.new(el);
		} else {
			return null;
		}
	}

	/**
	 * Find elements in children nodes.
	 * @param {String} query
	 * @return {FireElements}
	 */
	find(query) {
		let list = new FireElements();
		let that = this;
		[].forEach.call(that.node().querySelectorAll(query), function(e){
			let f = that.__firejs.new(e);
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
	trigger(event, params) {
		if (typeof this.prop(event) === "function" && !params) {
			this.prop(event).call(this.node());
		} else {
			let object = new CustomEvent(event, {bubbles: false, cancelable: true, detail: params});
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
	on(event, callback) {
		if (callback && typeof callback === "function") {
			let context = this;
			let handler = function(event) {
				if (callback.call(context, event, context) === false) {
					event.preventDefault();
				}
			};
			event.split(/\s+/).forEach((e) => {
				this.node().addEventListener(e, handler, false);
				this.__handlers[e] = this.__handlers[e] || [];
				this.__handlers[e].push(handler);
			});
		}
		return this;
	}

	/**
	 * Unbind all event listeners on one event.
	 * @param {String} event
	 * @return {FireElement}
	 */
	off(event) {
		if (this.__handlers[event]) {
			for(let i = 0; i < this.__handlers[event].length; i++) {
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
	events(event) {
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
	attr(name, value) {
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
	data(name, value) {
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
	get(name) {
		return this.node().getAttribute(name);
	}
	
	/**
	 * Check if the element has the class.
	 * @param {String} name
	 * @return {bool}
	 */
	hasClass(name) {
		return this.node().classList.contains(name);
	}
	
	/**
	 * Add the class.
	 * @param {String} name
	 * @return {FireElement}
	 */
	addClass(name) {
		if (name) {
			name.split(" ").forEach((n) => {
				this.node().classList.add(n);
			});
		}
		return this;
	}
	
	/**
	 * Remove the class.
	 * @param {String} name
	 * @return {FireElement}
	 */
	removeClass(name) {
		if (name) {
			name.split(" ").forEach((n) => {
				this.node().classList.remove(n);
			});
		}
		return this;
	}
	
	/**
	 * Toggle the class.
	 * @param {String} name
	 * @return {FireElement}
	 */
	toggleClass(name) {
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
	css(name, value) {
		if (typeof name === "string") {
			this.node().style[name] = value;
		} else if (typeof name === "object") {
			[].forEach.call(Object.keys(name), function(key){
				this.node().style[key] = name[key]
			}, this);
		}
		return this;
	}

	/**
	 * Define or get width element.
	 * @param {int} value
	 * @return {number}
	 */
	width(value) {
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
	height(value) {
		if (value) {
			this.node().style.height = value + "px";
		}
		return this.prop("offsetHeight");
	}

	/**
	 * Get offset for top and left element in the page.
	 * @return object {left, top}
	 */
	offset() {
		var rect = this.node().getBoundingClientRect();
		return {
			top: rect.top + document.body.scrollTop,
			left: rect.left + document.body.scrollLeft
		}
	}
	
	/**
	 * Show the element with its saved display property.
	 * @return {FireElement}
	 */
	show() {
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
	hide() {
		this.node().style.display = "none";
		this.__display_show = false;
		return this;
	}
	
	/**
	 * Toggle the visibility of element.
	 * @return {FireElement}
	 */
	toggle() {
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
	val(data) {
		if (this.prop("type") && this.prop("type").toLowerCase() === "checkbox") {
			if (typeof data !== "undefined") {
				this.prop("checked", data);
			}
			return this.prop("checked");
		} else if (this.prop("type") && this.prop("type").toLowerCase() === "radio") {
			if (typeof data !== "undefined") {
				this.prop("checked", (this.prop("value") == data));
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
	html(content) {
		if (typeof content !== "undefined") {
			this.prop("innerHTML", content);
		}
		return this.prop("innerHTML");
	}

	/**
	 * Return the node.
	 * @return {Node}
	 */
	node() {
		return this.__element;
	}
}

var fire = new FireJS();