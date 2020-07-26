"use strict";

class ComponentFTable extends Component {

	static tag = "ftable";
	
	/**
	 * Replace variables in html.
	 * @param {String} html
	 * @return {String}
	 */
	bind(html) {
		this.inner_html = true;
		return html;
	}

	/**
     * Set attributs to new element or dynamic HTML.
     * @param {FireElement} node facultative
     */
    set(node) {
		super.set(node);

		let i = 0;
		this.new_element.find("thead th").each((e) => {
			e.data("index", i++);
		});
	}
	
	/**
     * Insert inner HTML if there is $inner_html var in template.
     * @param {FireElement} node
     */
    fill(node) {
		node = this.new_element.find("table");

		this.element.find("table").children().each((child) => {
			node.append(child);
		});
    }

	/**
     * Define raw html content.
     * @return {String}
     */
    html() {
		return `
			<div class="table">
				<div class="hidden order asc">
					<svg version="1.1" baseProfile="full" width="24" height="24" viewBox="0 0 24.00 24.00" enable-background="new 0 0 24.00 24.00" xml:space="preserve">
						<path fill="#000000" fill-opacity="1" stroke-width="0.2" stroke-linejoin="round" d="M 7.41351,15.4121L 11.9995,10.8261L 16.5855,15.4121L 17.9995,13.9981L 11.9995,7.99807L 5.99951,13.9981L 7.41351,15.4121 Z "/>
					</svg>
				</div>
				<div class="hidden order desc">
					<svg version="1.1" baseProfile="full" width="24" height="24" viewBox="0 0 24.00 24.00" enable-background="new 0 0 24.00 24.00" xml:space="preserve">
						<path fill="#000000" fill-opacity="1" stroke-width="0.2" stroke-linejoin="round" d="M 7.41348,8.58407L 11.9995,13.1701L 16.5855,8.58407L 17.9995,9.99807L 11.9995,15.9981L 5.99948,9.99807L 7.41348,8.58407 Z "/>
					</svg>
				</div>
				<table>
					
				</table>
			</div>
		`;
	}


    /**
     * Setup trigger of component.
     */
    action() {
		super.action();

		let el = this.new_element.find("thead th");

        el.on("click", (ev) => {
			let el = fire.new(ev.target);
			if (!el.data("index")) {
				el = el.parents("[data-index]");
			}
			el.parents("table").trigger("sort", {id: el.data("index")});
        });
    }

    /**
     * Handle event of component, retrieve event listeners of previous element and and them to new one.
     */
	handle() {
		super.handle();

		let el = this.new_element.find("table");
		let sort = {
			asc : this.new_element.find(".hidden.asc"),
			desc : this.new_element.find(".hidden.desc")
		}

        el.on("sort", (ev) => {
			let el = fire.new(ev.target);
			let index = ev.detail.id;
			let th = el.find("thead th[data-index='" + index + "']");
			let order = (th.data("order") === "asc") ? ("desc") : ("asc");
			el.find("thead th").data("order", false).find(".order").remove();
			th.data("order", order).append(sort[order].clone().removeClass("hidden"));
			this.sort(el, index, order);
        });
	}

	/**
	 * 
	 * @param {FireElement} table 
	 * @param {String} index 
	 * @param {String} order 
	 */
	sort(table, index, order) {
		let list = [];
		let tbody = table.find("tbody");
		tbody.children("tr").each((e) => {
			list.push(e);
		});
		tbody.empty();
		list.sort(this.sort_compare(index, order === "asc"))
			.forEach(function(tr) {
				tbody.append(tr);
			});
	}

	/**
	 * 
	 * @param {*} index 
	 * @param {*} asc 
	 */
	sort_compare(index, asc) {
		let that = this;
		return function (a, b) {
			let v1 = that.sort_compare_value(asc ? a : b, index);
			let v2 = that.sort_compare_value(asc ? b : a, index);
			return (v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2)) ? (v1 - v2) : (v1.toString().localeCompare(v2));
		}
	}

	/**
	 * Returne the value index of a line.
	 * @param {FireElement} tr 
	 * @param {String} index 
	 * @return {String}
	 */
	sort_compare_value(tr, index) {
		return tr.children().eq(index).html();
	}
}
fire.component.add(ComponentFTable);

