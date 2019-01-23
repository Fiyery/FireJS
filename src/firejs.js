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

        // to test whether we have singleton or not
        this.time = new Date()

        return this.instance;
    }

    /**
	 * Execute the callback function when the page is loaded.
     * @param callback
	 */
	ready(callback) {
		if (callback && typeof callback === "function") {
			document.addEventListener("DOMContentLoaded", callback);
		}
	}

    /**
	 * Get the HTML elements with CSS selector.
     * @param query CSS selector
     * @return FireElements
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
	 * Create a FireElement from HTMLElement.
     * @param e HTMLElement
	 */
	new(e) {
		if (!e || !(e instanceof HTMLElement)) {
			return null;
		}
		let el = e;
		if (el.firejs_id && this.datalist[el.firejs_id]) {
			// If element is known, it was loaded from datalist.
			return this.datalist[el.firejs_id];
		} else {
			let f = new FireElement(e, this);
			// Add to datalist elements.
			this.datalist[f.prop("firejs_id")] = f;
			return f;
		}
	}

	/**
	 * Create new HTML element.
	 * @param string name Tag HTML
	 */
	create(name) {
		return this.new(document.createElement(name));
	}

	/**
	 * Run AJAX query.
	 * @param data object
	 * @param callback Function
	 * @return Promise
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
					throw "Server return wrong JSON response";
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
	 * @param obj Object
	 * @param prop String|Object|Function 
	 * @param callback Function
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
     * @return number
	 */
	size() {
		return this.list.length;
	}

	/**
	 * Add element to the list.
	 * @param e FireElement
     * @return FireElements
	 */
	push(e) {
		this.list.push(e);
		return this;
	}

	/**
	 * Walk the lsit of elements with callback.
	 * @param callback Function
     * @return FireElements
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
	 * @return FireElements
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
	 * @param string query
	 * @return FireElements
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
	 * @return FireElements
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
	 * @return FireElements
	 */
	clone() {
		let list = new FireElements();
		this.each(function(){
			list.push(this.clone());
		});
		return list;
	}

	/**
	 * Remove children.
	 * @return FireElements
	 */
	empty() {
		this.each(function(){
			this.empty();
		});
		return this;
	}

	/**
	 * Remove selected elements.
	 * @return null
	 */
	remove() {
		this.each(function(){
			this.remove();
		});
		return null;
	}

	/**
	 * Add element at the end.
	 * @param e FireElement
	 * @return FireElements
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
	 * @param e FireElement
	 * @return FireElements
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
	 * @param string value
	 * @return FireElements
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
	 * @param elements FireElements
	 * @return FireElements
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
	 * @return FireElements
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
	 * @return FireElements
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
	 * @param query string
	 * @return FireElements
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
	 * @param event string
	 * @param FireElements 
	 */
	trigger(event) {
		this.each(function(e){
			e.trigger(event);
		});
		return this;
	}
	
	/**
	 * Listen a event and execute the callback function when event triggering.
	 * @param event string
	 * @param callback Function
	 * @return FireElements
	 */
	on(event, callback)  {
		this.each(function(e){
			e.on(event, callback);
		});
		return this;
	}

	/**
	 * Unbind event listener.
	 * @param event string
	 * @return FireElements
	 */
	off(event)  {
		this.each(function(e){
			e.off(event);
		});
		return this;
	}
	
	/**
	 * Check if the element has the class.
	 * @param name string
	 * @return boolean
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
	 * @param name string
	 * @return FireElements
	 */
	addClass(name) {
		this.each(function(e){
			e.addClass(name);
		});
		return this;
	}
	
	/**
	 * Remove the class.
	 * @param name string
	 * @return FireElements
	 */
	removeClass(name) {
		this.each(function(e){
			e.removeClass(name);
		});
		return this;
	}
	
	/**
	 * Toggle the class.
	 * @param name string
	 * @return FireElements
	 */
	toggleClass(name) {
		this.each(function(e){
			e.toggleClass(name);
		});
		return this;
	}

	/**
	 * Setter/getter of attribut the class.
	 * @param name string
	 * @param value string
	 * @return FireElements
	 */
	prop(name, value) {
		if (typeof value !== "undefined") {
			this.each(function(e){
				e.prop(name, value);
			});
			return this;
		}
		return this.eq(0).prop(name);
	}

	/**
	 * Setter/getter of attribut the class.
	 * @param name string
	 * @param value string
	 * @return FireElements
	 */
	attr(name, value) {
		if (typeof value !== "undefined") {
			this.each(function(e){
				e.attr(name, value);
			});
			return this;
		}
		return this.eq(0).attr(name);
	}

	/**
	 * Define CSS properties.
	 * @param name string
	 * @param value string
	 * @return FireElements
	 */
	css(name, value) {
		if (typeof value !== "undefined") {
			this.each(function(e){
				e.css(name, value);
			});
			return this;
		}
		return this.eq(0).css(name);
	}

	/**
	 * Define or not and get width element.
	 * @param value number
	 * @return number
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
	 * @param value number
	 * @return number
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
	 * @return object {left, top}
	 */
	offset() {
		if (this.eq(0)) {
			return this.eq(0).offset();
		}
		return null;
	}
	
	/**
	 * Show the element with its saved display property.
	 * @return FireElements
	 */
	show() {
		this.each(function(e){
			e.show();
		});
		return this;
	}	

	/**
	 * Hide the element with display egals none.
	 * @return FireElements
	 */
	hide() {
		this.each(function(e){
			e.hide();
		});
		return this;
	}
	
	/**
	 * Toggle the visibility of element.
	 * @return FireElements
	 */
	toggle() {
		this.each(function(e){ 
			e.toggle();
		});
		return this;
	}

	/**
	 * Get values of form elements.
	 * @return string
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
	 * @return FireElements
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
	 * @return string
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
	 * @param number index 
	 * @return FireElement 
	 */
	eq(index) {
		if (index < 0) {
			index = this.list.length + (index - 1);
		}
		return this.list[index];
	}

	/**
	 * Return the first element.
	 * @return FireElement 
	 */
	first() {
		return this.list[0];
	}

	/**
	 * Return the last element.
	 * @return FireElement 
	 */
	last() {
		return this.list[this.list.length - 1];
	}
}

/**
 * Overloading of HTMLElement.
 */
class FireElement {
	/**
	 * Setup of object.
	 * @param e HTMLElement
	 * @param firejs FireJS
	 */
	constructor(e, firejs) {
        // HTMLElement overloaded.	
		this.__element = e;

        // Store event listeners for off().	
		this.__handlers = [];

        // Library FireJS Factory for new FireElement.
		this.__firejs = firejs;

        // Save the display property for hide and show methods.
		this.__display = document.defaultView.getComputedStyle(this.node(), null).display.toLowerCase();
		this.__display_show = true;
		if (this.__display === "none") {
			this.__display_show = false;
		}
		
		this.node().firejs_id = Date.now().toString()+"-"+Math.random().toString().substring(2, 7);
	}
	
	/**
	 * Get the property of HTMLElement.
	 * @param name string
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
	 * @return FireElement
	 */
	parent() {
		return this.__firejs.new(this.prop("parentNode"));
	}

	/**
	 * Get the parents.
	 * @param string query
	 * @return FireElements
	 */
	parents(query) {
		let list = new FireElements();
		let selectored = (typeof query !== "undefined");

		let current = this;
		while (current.prop("parentElement")) {
			current = current.__firejs.new(current.prop("parentNode"));
			let node = current.node();
			if (selectored === false || node.matches && node.matches(query) || node.msMatchesSelector && node.msMatchesSelector(query)) {
				list.push(current);
			}
		}	
		return list;
	}
	
	/**
	 * Get the chidren.
	 * @return FireElements
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
	 * @return FireElements
	 */
	clone() {
		let clone = this.node().cloneNode(true);
		delete clone.firejs_id;
		return this.__firejs.new(clone);
	}

	/**
	 * Remove children.
	 * @return FireElements
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
	 * @return null
	 */
	remove() {
		this.node().remove();
		return null;
	}

	/**
	 * Add element at the end.
	 * @param e FireElement
	 * @return FireElements
	 */
	append(e) {
		this.node().appendChild(e.node());
		return this;
	}

	/**
	 * Add element at the end.
	 * @param e FireElement
	 * @return FireElements
	 */
	prepend(e) {
		let children = this.children();
		let child = (children.size() > 0) ? (children.eq(0).node()) : (null);
		this.node().insertBefore(e.node(), child);
		return this;
	}

	/**
	 * Set Text element.
	 * @param string value
	 * @return FireElements
	 */
	text(value) {
		if (typeof value !== "undefined") {
			this.node().textContent = value;
			return this;
		}
		return this.node().textContent;
	}
	
	/**
	 * Get the next element.
	 * @return FireElement
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
	 * @return FireElement
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
	 * @param query string
	 * @return FireElements
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
	 * @param event string
	 * @param FireElements 
	 */
	trigger(event) {
		if (typeof this.prop(event) === "function") {
			this.prop(event).call(this.node());
		} else {
			let object = null;
			if (typeof CustomEvent !== "undefined") {
				object = new CustomEvent(event, {bubbles: true, cancelable: true});
			} else {
				object = document.createEvent('Event');
				object.initEvent(event, true, true);
			}
			this.node().dispatchEvent(object);
		} 
		return this;
	}
	
	/**
	 * Listen a event and execute the callback function when event triggering.
	 * @param event string
	 * @param callback Function
	 * @return FireElement
	 */
	on(event, callback) {
		if (callback && typeof callback === "function") {
			let context = this;
			let handler = function(event) {
				if (callback.call(context, event, context) === false) {
					event.preventDefault();
				}
			};
			this.node().addEventListener(event, handler, false);
			if (!this.__handlers[event]) {
				this.__handlers[event] = [];
			}
			this.__handlers[event].push(handler);
		}
		return this;
	}

	/**
	 * Unbind a event listener.
	 * @param event string
	 * @return FireElement
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
	 * Setter/getter of attribut the class.
	 * @param name string
	 * @param value string
	 * @return FireElements
	 */
	attr(name, value) {
		if (typeof value !== "undefined") {
			if (value === null) {
				this.node().removeAttribute(name);
			} else {
				this.node().setAttribute(name, value);
			}
			return this;
		}
		return this.node().getAttribute(name);
	}
	
	/**
	 * Get value of attribut.
	 * @param name string
	 * @return FireElement
	 */
	get(name) {
		return this.node().getAttribute(name);
	}
	
	/**
	 * Check if the element has the class.
	 * @param name string
	 * @return boolean
	 */
	hasClass(name) {
		return this.node().classList.contains(name);
	}
	
	/**
	 * Add the class.
	 * @param name string
	 * @return FireElement
	 */
	addClass(name) {
		if (name) {
			this.node().classList.add(name);
		}
		return this;
	}
	
	/**
	 * Remove the class.
	 * @param name string
	 * @return FireElement
	 */
	removeClass(name) {
		if (name) {
			this.node().classList.remove(name);
		}
		return this;
	}
	
	/**
	 * Toggle the class.
	 * @param name string
	 * @return FireElement
	 */
	toggleClass(name) {
		if (name) {
			this.node().classList.toggle(name);
		}
		return this;
	}

	/**
	 * Define CSS properties.
	 * @param name string
	 * @return FireElement
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
	 * @param value number
	 * @return number
	 */
	width(value) {
		if (value) {
			this.node().style.width = value + "px";
		}
		return this.node().offsetWidth;
	}

	/**
	 * Define or get height element.
	 * @param value number
	 * @return number
	 */
	height(value) {
		if (value) {
			this.node().style.height = value + "px";
		}
		return this.node().offsetHeight;
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
	 * @return FireElement
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
	 * @return FireElement
	 */
	hide() {
		this.node().style.display = "none";
		this.__display_show = false;
		return this;
	}
	
	/**
	 * Toggle the visibility of element.
	 * @return FireElement
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
	 * @return string
	 */
	val(data) {
		if (this.node().type && this.node().type.toLowerCase() === "checkbox") {
			if (typeof data !== "undefined") {
				this.node().checked = data;
			}
			return this.node().checked;
		} else if (this.node().type && this.node().type.toLowerCase() === "radio") {
			if (typeof data !== "undefined") {
				this.node().checked = (this.node().value == data);
			}
			return this.node().value;
		} else if (typeof this.node().value !== "undefined") {
			if (typeof data !== "undefined") {
				this.node().value = data;
			}
			return this.node().value;
		} else {
			return null;
		}
	}

	/**
	 * Get contents of the element.
	 * @return string
	 */
	html(content) {
		if (typeof content !== "undefined") {
			this.node().innerHTML = content;
		}
		return this.node().innerHTML;
	}

	/**
	 * Return the node.
	 * @return Node
	 */
	node() {
		return this.__element;
	}
}

var fire = new FireJS();