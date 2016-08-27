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
	 * Warning : All the queries are cached, to reset the query, set reset param to true
	 */
	get(query : string, reset : boolean = false) : FireElements {
		let res : any = document.querySelectorAll(query);
		let list : FireElements = new FireElements();
		switch (res.length) {
			case 0 : 
				list = null;
				break;
			case 1 : 
				if (res[0].firejs_id) {
					// If element is known, it was loaded from datalist.
					list.push(this.datalist[res[0].firejs_id]);
				} else {
					let f : FireElement = new FireElement(res[0]);
					// Add to datalist elements.
					this.datalist[f.getProperty('firejs_id')] = f;
					list.push(f);
				}
				break;
			default : 
				[].forEach.call(res, function(e : any){
					if (e.firejs_id) {
						// If element is known, it was loaded from datalist.
						list.push(this.datalist[e.firejs_id]);
					} else {
						let f : FireElement = new FireElement(e);
						// Add to datalist elements.
						this.datalist[f.getProperty('firejs_id')] = f;
						list.push(f);
					}
				}, this);
		}
		return list;
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
	next(name : string) : FireElements {
		let list : FireElements = new FireElements();
		this.forEach(function(e : FireElement){
			list.push(e.next());
		});
		return list;
	}
	
	/**
	 * Get the previous element.
	 */
	prev(name : string) : FireElements {
		let list : FireElements = new FireElements();
		this.forEach(function(e : FireElement){
			list.push(e.prev());
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
	val(): string | boolean | any {
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
	 * Liste of CSS Stylesheet properties.
	 */
	css : any;

	/**
	 * Setup of object.
	 */
	constructor(e : HTMLElement) {	
		this.element = e;
		if (e) {
			this.css = document.defaultView.getComputedStyle(this.element, null);

			// Need for toggle. 
			this.element.style.display = this.css.display;
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
		return new FireElement(this.getProperty('parentNode'));
	}
	
	/**
	 * Get the chidren.
	 */
	children() : FireElements {
		let list : FireElements = new FireElements();
		[].forEach.call(this.element.children, function(e){
			list.push(e);
		});
		return list;
	}

	/**
	 * Get childNodes.
	 */
	childNodes() : NodeList {
		return this.element.childNodes;
	}
	
	/**
	 * Get the next element.
	 */
	next() : FireElement {
		let el = this.getProperty('nextElementSibling');
		if (el) {
			return new FireElement(el);
		} else {
			return null;		
		}
	}
	
	/**
	 * Get the previous element.
	 */
	prev() : FireElement {
		let el = this.getProperty('previousElementSibling');
		if (el) {
			return new FireElement(el);
		} else {
			return null;
		}
	}
	
	/**
	 * Listen a event and execute the callback function when event triggering.
	 */
	on(event : string, callback) : FireElement {
		if (callback && typeof callback === 'function') {
			let that = this;
			this.element.addEventListener(event, function() {
				callback.call(that);
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
		this.display = (this.element.style.display) ? (this.element.style.display) : ('block');
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
}

let fire : FireJs = new FireJs();