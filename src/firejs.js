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
			this.datalist[f.getProperty("firejs_id")] = f;
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
	 * @param data 
	 * @param callback
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
	 * Get the parents.
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
	 * Get the chidren element.
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
	 * Add element at the end.
	 * @param e FireElement
	 * @return FireElements
	 */
	append(e) {
		this.each(function(el){
			el.append(e);
		});
		return this;
	}

	/**
	 * Set Text element.
	 * @param string string
	 * @return FireElements
	 */
	text(string) {
		this.each(function(e){
			e.text(string);
		});
		return this;
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
			if (elements.element) {
				if (elements.element !== e.element) {
					list.push(e);
				}
			} else {
				let find = false;
				elements.forEach(function(el){
					if (el.element === e.element) {
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
		this.element = e;

        // Library FireJS Factory for new FireElement.
		this.firejs = firejs;

        // Save the display property for hide and show methods.
		this.display = document.defaultView.getComputedStyle(this.element, null).display.toLowerCase();
		this.display_show = true;
		if (this.display === "none") {
			this.display_show = false;
		}
		
		let node = this.element;
		node.firejs_id = Date.now().toString()+"-"+Math.random().toString().substring(2, 7);
	}
	
	/**
	 * Get the property of HTMLElement.
	 * @param name string
	 */
	getProperty(name) {
		return this.element[name];
	}
	
	/**
	 * Get the parent.
	 * @return FireElement
	 */
	parent() {
		return this.firejs.new(this.getProperty("parentNode"));
	}
	
	/**
	 * Get the chidren.
	 * @return FireElements
	 */
	children() {
		let list = new FireElements();
		let that = this;
		[].forEach.call(that.getProperty("children"), function(e){
			list.push(that.firejs.new(e));
		});
		return list;
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
	 * Set Text element.
	 * @param string string
	 * @return FireElements
	 */
	text(string) {
		this.node().textContent = string;
		return this;
	}
	
	/**
	 * Get the next element.
	 * @return FireElement
	 */
	next() {
		let el = this.getProperty("nextElementSibling");
		if (el) {
			return this.firejs.new(el);
		} else {
			return null;		
		}
	}
	
	/**
	 * Get the previous element.
	 * @return FireElement
	 */
	prev() {
		let el = this.getProperty("previousElementSibling");
		if (el) {
			return this.firejs.new(el);
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
		[].forEach.call(that.element.querySelectorAll(query), function(e){
			let f = that.firejs.new(e);
			list.push(f);
		});
		return list;
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
			this.element.addEventListener(event, function(event) {
				if (callback.call(context, event, context) === false) {
					event.preventDefault();
				}
			}, false);
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
				this.element.removeAttribute(name);
			} else {
				this.element.setAttribute(name, value);
			}
			return this;
		}
		return this.element.getAttribute(name);
	}
	
	/**
	 * Get value of attribut.
	 * @param name string
	 * @return FireElement
	 */
	get(name) {
		return this.element.getAttribute(name);
	}
	
	/**
	 * Check if the element has the class.
	 * @param name string
	 * @return boolean
	 */
	hasClass(name) {
		return this.element.classList.contains(name);
	}
	
	/**
	 * Add the class.
	 * @param name string
	 * @return FireElement
	 */
	addClass(name) {
		if (name) {
			this.element.classList.add(name);
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
			this.element.classList.remove(name);
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
			this.element.classList.toggle(name);
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
			this.element.style[name] = value;
		} else if (typeof name === "object") {
			[].forEach.call(Object.keys(name), function(key){
				this.element.style[key] = name[key]
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
			this.element.style.width = value + "px";
		}
		return this.element.offsetWidth;
	}

	/**
	 * Define or get height element.
	 * @param value number
	 * @return number
	 */
	height(value) {
		if (value) {
			this.element.style.height = value + "px";
		}
		return this.element.offsetHeight;
	}
	
	/**
	 * Show the element with its saved display property.
	 * @return FireElement
	 */
	show() {
		if (this.display === "none") {
			this.element.style.display = "block";
		} else {
			this.element.style.display = "";
		}
		this.display_show = true;
		return this;
	} 
	
	/**
	 * Hide the element with display egals none.
	 * @return FireElement
	 */
	hide() {
		this.element.style.display = "none";
		this.display_show = false;
		return this;
	}
	
	/**
	 * Toggle the visibility of element.
	 * @return FireElement
	 */
	toggle() {
		if (this.display_show) {
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
		if (this.element.type && this.element.type.toLowerCase() === "checkbox") {
			if (typeof data !== "undefined") {
				this.element.checked = data;
			}
			return this.element.checked;
		} else if (this.element.type && this.element.type.toLowerCase() === "radio") {
			if (typeof data !== "undefined") {
				this.element.checked = (this.element.value == data);
			}
			return this.element.value;
		} else if (typeof this.element.value !== "undefined") {
			if (typeof data !== "undefined") {
				this.element.value = data;
			}
			return this.element.value;
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
			this.element.innerHTML = content;
		}
		return this.element.innerHTML;
	}

	/**
	 * Return the node.
	 * @return Node
	 */
	node() {
		return this.element;
	}
}

var fire = new FireJS();