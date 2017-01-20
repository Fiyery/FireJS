'use strict';

/**
 * Main class.
 */
class FireJs {
	
	datalist : any;

	/**
	 * Setup of object.
	 */
	constructor() {	
		this.datalist = {};
	}
	
	/**
	 * Execute the callback function when the page is loaded.
	 */
	ready(callback) {
		if (callback && typeof callback === 'function') {
			document.addEventListener("DOMContentLoaded", callback);
		}
	}
	
	/**
	 * Get the HTML elements with CSS selector.
	 */
	get(query : string) : FireElements {
		let res : any = document.querySelectorAll(query);
		let list : FireElements = new FireElements();
		switch (res.length) {
			case 0 : 
				list = null;
				break;
			case 1 : 
				list.push(this.new(res[0]));
				break;
			default : 
				[].forEach.call(res, function(e : any){
					list.push(this.new(e));
				}, this);
		}
		return list;
	}

	/**
	 * Create a FireElement from HTMLElement.
	 */
	new(e : HTMLElement) : FireElement {
		if (!e) {
			return null;
		}
		let el : any = e;
		if (el.firejs_id && this.datalist[el.firejs_id]) {
			// If element is known, it was loaded from datalist.
			return this.datalist[el.firejs_id];
		} else {
			let f : FireElement = new FireElement(e, this);
			// Add to datalist elements.
			this.datalist[f.getProperty('firejs_id')] = f;
			return f;
		}
	}
}

/**
 * Array class contains the FireElements and send to then the calls.
 */
class FireElements extends Array<FireElement> {
	
	size() : number {
		return this.length;
	}	
	
	/**
	 * Get the parents.
	 */
	parent() : FireElements {
		let list : FireElements = new FireElements();
		this.forEach(function(e : FireElement){
			list.push(e.parent());
		});
		return list;
	}
	
	/**
	 * Get the chidren element.
	 */
	children() : FireElements {
		let list : FireElements = new FireElements();
		this.forEach(function(e : FireElement){
			e.children().forEach(function(child){
				list.push(child);
			});
		});
		return list;
	}

	/**
	 * Delete on or  de la liste
	 */
	not(elements) : FireElements {
		let list : FireElements = new FireElements();
		for (let i = 0; i < this.length; i++) {
			let e = this[i];
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
	 */
	next() : FireElements {
		let list : FireElements = new FireElements();
		this.forEach(function(e : FireElement){
			list.push(e.next());
		});
		return list;
	}
	
	/**
	 * Get the previous element.
	 */
	prev() : FireElements {
		let list : FireElements = new FireElements();
		this.forEach(function(e : FireElement){
			list.push(e.prev());
		});
		return list;
	}

	/**
	 * Find elements in children nodes.
	 */
	find(query : string) : FireElements {
		let list : FireElements = new FireElements();
		this.forEach(function(el : FireElement){
			el.find(query).forEach(function(e : FireElement){
				list.push(e);
			});
		});
		return list;
	}
	
	/**
	 * Listen a event and execute the callback function when event triggering.
	 */
	on(event : string, callback) : FireElements  {
		this.forEach(function(e : FireElement){
			e.on(event, callback);
		});
		return this;
	}
	
	/**
	 * Check if the element has the attribut.
	 */
	has(name : string) : boolean {
		let bool : boolean = true;
		this.forEach(function(e : FireElement){
			bool = bool && e.has(name);
		});
		return bool;
	}
	
	/**
	 * Define a attribut and its value.
	 */
	set(name : string, value : string) : FireElements {
		this.forEach(function(e : FireElement){
			e.set(name, value);
		});
		return this;
	}
	
	/**
	 * Get value of attribut
	 */
	get(name : string) : String[] {
		let params : String[] = [];
		this.forEach(function(e : FireElement){
			params.push(e.get(name));
		});
		return params;
	}
	
	/**
	 * Check if the element has the class.
	 */
	hasClass(name : string) : boolean {
		let bool : boolean = true;
		this.forEach(function(e : FireElement){
			bool = bool && e.hasClass(name);
		});
		return bool;
	}
	
	/**
	 * Add the class.
	 */
	addClass(name : string) : FireElements {
		this.forEach(function(e : FireElement){
			e.addClass(name);
		});
		return this;
	}
	
	/**
	 * Remove the class.
	 */
	removeClass(name : string) : FireElements {
		this.forEach(function(e : FireElement){
			e.removeClass(name);
		});
		return this;
	}
	
	/**
	 * Toggle the class.
	 */
	toggleClass(name : string) : FireElements {
		this.forEach(function(e : FireElement){
			e.toggleClass(name);
		});
		return this;
	}

	/**
	 * Define CSS properties.
	 */
	css(name : string|Object, val ?: string) : FireElements {
		this.forEach(function(e : FireElement){
			e.css(name, val);
		});
		return this;
	}

	/**
	 * Define or get width element.
	 */
	width(val ?: number) : number {
		if (val) {
			this.forEach(function(e : FireElement){
				e.width(val);
			});
		}
		return this[0].width();
	}

	/**
	 * Define or get height element.
	 */
	height(val ?: number) : number {
		if (val) {
			this.forEach(function(e : FireElement){
				e.height(val);
			});
		}
		return this[0].height();
	}
	
	/**
	 * Show the element with its saved display property.
	 */
	show() : FireElements {
		this.forEach(function(e : FireElement){
			e.show();
		});
		return this;
	}	

	/**
	 * Hide the element with display egals none.
	 */
	hide() : FireElements {
		this.forEach(function(e : FireElement){
			e.hide();
		});
		return this;
	}
	
	/**
	 * Toggle the visibility of element.
	 */
	toggle() : FireElements {
		this.forEach(function(e : FireElement){ 
			e.toggle();
		});
		return this;
	}

	/**
	 *	Get values of form elements.
	 */
	val() : string | boolean | any {
		let values = [];
		this.forEach(function(e: FireElement) {
			values.push(e.val());
		});
		if (values.length === 1) {
			return values[0];
		} else {
			return values;
		}
	}

	/**
	 * Return the nodes.
	 */
	node() : Array<Node> {
		let list : Array<Node> = [];
		this.forEach(function(e: FireElement) {
			list.push(e.node());
		});
		return list;
	}
}

/**
 * Overloading of HTMLElement.
 */
class FireElement {
	
	/**
	 * HTMLElement overloaded.
	 */
	element : HTMLElement;

	/**
	 * Save the display property for hide and show methods.
	 */
	display : string = 'block';

	/**
	 * librairy FireJS Factory for new FireElement.
	 */
	firejs : FireJs;

	/**
	 * Setup of object.
	 */
	constructor(e : HTMLElement, firejs : FireJs) {	
		this.firejs = firejs;
		this.element = e;
		if (e) {
			// Need for toggle. 
			this.element.style.display = document.defaultView.getComputedStyle(this.element, null).display;
		}
		let node : any = this.element;
		node.firejs_id = Date.now().toString()+'-'+Math.random().toString().substring(2, 7);
	}
	
	/**
	 * Get the property of HTMLElement.
	 */
	getProperty(s : string) : any {
		return this.element[s];
	}
	
	/**
	 * Get the parent.
	 */
	parent() : FireElement {
		return this.firejs.new(this.getProperty('parentNode'));
	}
	
	/**
	 * Get the chidren.
	 */
	children() : FireElements {
		let list : FireElements = new FireElements();
		[].forEach.call(this.getProperty('children'), function(e){
			list.push(this.firejs.new(e));
		});
		return list;
	}
	
	/**
	 * Get the next element.
	 */
	next() : FireElement {
		let el : HTMLElement = this.getProperty('nextElementSibling');
		if (el) {
			return this.firejs.new(el);
		} else {
			return null;		
		}
	}
	
	/**
	 * Get the previous element.
	 */
	prev() : FireElement {
		let el : HTMLElement = this.getProperty('previousElementSibling');
		if (el) {
			return this.firejs.new(el);
		} else {
			return null;
		}
	}

	/**
	 * Find elements in children nodes.
	 */
	find(query : string) : FireElements {
		let list : FireElements = new FireElements();
		let that = this;
		[].forEach.call(this.element.querySelectorAll(query), function(e){
			let f : FireElement = that.firejs.new(e);
			list.push(f);
		});
		return list;
	}
	
	/**
	 * Listen a event and execute the callback function when event triggering.
	 */
	on(event : string, callback) : FireElement {
		if (callback && typeof callback === 'function') {
			let that = this;
			this.element.addEventListener(event, function(event) {
				callback.call(that, event);
			});
		}
		return this;
	}
	
	/**
	 * Check if the element has the attribut.
	 */
	has(name : string) : boolean {
		return (this.element.attributes.getNamedItem(name) !== null)
	}
	
	/**
	 * Define a attribut and its value.
	 */
	set(name : string, value : string) : FireElement {
		if (value === null) {
			this.element.removeAttribute(name);
		} else {
			this.element.setAttribute(name, value);
		}
		return this;
	}
	
	/**
	 * Get value of attribut
	 */
	get(name : string) : string {
		return this.element.getAttribute(name);
	}
	
	/**
	 * Check if the element has the class.
	 */
	hasClass(name : string) : boolean {
		return this.element.classList.contains(name);
	}
	
	/**
	 * Add the class.
	 */
	addClass(name : string) : FireElement {
		if (name) {
			this.element.classList.add(name);
		}
		return this;
	}
	
	/**
	 * Remove the class.
	 */
	removeClass(name : string) : FireElement {
		if (name) {
			this.element.classList.remove(name);
		}
		return this;
	}
	
	/**
	 * Toggle the class.
	 */
	toggleClass(name : string) : FireElement {
		if (name) {
			this.element.classList.toggle(name);
		}
		return this;
	}

	/**
	 * Define CSS properties.
	 */
	css(name : string|Object, val ?: string) : FireElement {
		if (typeof name === 'string') {
			this.element.style[name] = val;
		} else if (typeof name === 'object') {
			[].forEach.call(Object.keys(name), function(key){
				this.element.style[key] = name[key]
			}, this);
		}
		return this;
	}

	/**
	 * Define or get width element.
	 */
	width(val ?: number) : number {
		if (val) {
			this.element.style.width = val + 'px';
		}
		return this.element.offsetWidth;
	}

	/**
	 * Define or get height element.
	 */
	height(val ?: number) : number {
		if (val) {
			this.element.style.height = val + 'px';
		}
		return this.element.offsetHeight;
	}
	
	/**
	 * Show the element with its saved display property.
	 */
	show() : FireElement {
		this.element.style.display = this.display;
		return this;
	} 
	
	/**
	 * Hide the element with display egals none.
	 */
	hide() : FireElement {
		if (this.element.style.display !== 'none') {
			this.display = (this.element.style.display) ? (this.element.style.display) : ('block');
		}
		this.element.style.display = 'none';
		return this;
	}
	
	/**
	 * Toggle the visibility of element.
	 */
	toggle() : FireElement {
		if (this.element.style.display === 'none') {
			this.show();
		} else {
			this.hide();
		}
		return this;
	}

	/**
	 *	Get values of form elements.
	 */
	val(): string | boolean {
		let el: HTMLInputElement;
		if (this.get('id') === null) {
			let id = Math.random().toString();
			this.set('id', id);
			el = <HTMLInputElement>document.getElementById(id);
			this.set('id', null);
		} else {
			console.log('ko');
			el = <HTMLInputElement>document.getElementById(this.get('id'));
		}
		if (el.type && el.type.toLowerCase() === 'checkbox') {
			return el.checked;
		} else if (el.value) {
			return el.value;
		} else {
			return '';
		}
	}

	/**
	 * Return the node.
	 */
	node() : Node {
		return this.element;
	}
}

let fire : FireJs = new FireJs();