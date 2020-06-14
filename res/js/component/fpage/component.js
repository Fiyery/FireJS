"use strict";

class ComponentFPage extends Component {

    static tag = "fpage";

    constructor(element) {
		super(element);

		this.default_urlparam = "page";
		this.default_view = 2;
    }

    html() {
        return `
			<div class="bloc_page">
				<div class="page_begin">
					<svg viewBox="0 0 24 24" >
						<path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"/>
						<path d="M24 24H0V0h24v24z" fill="none"/>
					</svg>
				</div>
				<div class="page_prev">
					<svg viewBox="0 0 24 24">
						<path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/>
						<path d="M0-.5h24v24H0z" fill="none"/>
					</svg>
				</div>
				<div class="bloc_page_number">
				
				</div>
				<div class="page_next">
					<svg viewBox="0 0 24 24">
						<path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/>
						<path d="M0-.25h24v24H0z" fill="none"/>
					</svg>
				</div>
				<div class="page_end">
					<svg viewBox="0 0 24 24">
						<path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"/>
						<path d="M0 0h24v24H0V0z" fill="none"/>
					</svg>
				</div>
            </div>
        `;
	}
	
	set() {
		super.set();
		let current = parseInt(this.new_element.attr("data-current"));
		if (!current) {
			let list = new URLSearchParams(window.location.search);
			let value = list.get(this.new_element.data("urlparam") || this.default_urlparam);
			current = parseInt(value) || 1;
		}
		let begin = parseInt(this.new_element.attr("data-begin")) || 1;
		let end = parseInt(this.new_element.attr("data-end")) || 1;
		let view = parseInt(this.new_element.attr("data-view")) || this.default_view;
		let bloc = this.new_element.find(".bloc_page_number").empty();
		let prev_split = false;
		let next_split = false;
		for (let i = begin; i <= end; i++) {
			if (i == begin || i == end || (i >= current - view && i <= current + view)) {
				let page = fire.create("div").text(i).attr("data-page", i);
				if (i == current) {
					page.addClass("selected");
				}
				bloc.append(page);
			} else {
				if (i < current - view && prev_split === false) {
					let page = fire.create("div").text("...").addClass("not_number");
					bloc.append(page);
					prev_split = true;
				}
				if (i > current + view && next_split === false) {
					let page = fire.create("div").text("...").addClass("not_number");
					bloc.append(page);
					next_split = true;
				}
			}
		}
		this.new_element.find(".page_begin").attr("data-page", begin);
		this.new_element.find(".page_prev").attr("data-page", (current - 1 > begin) ? (current - 1) : (begin));
		this.new_element.find(".page_next").attr("data-page", (current + 1 < end) ? (current + 1) : (end));
		this.new_element.find(".page_end").attr("data-page", end);
	 }
	 
    action() {
		let pages = this.new_element.find("*[data-page]");
		pages.off("click").on("click", (ev, el) => {
			this.new_element.trigger("change", {page: el.attr("data-page")});
		})	
	}
	
	handle() {
		let element = this.new_element;

		element.on("change", (ev) => {
			if (ev.detail && ev.detail.page) {
				let page = ev.detail.page;
				let target = element.data("target") || location.href;
				if (typeof window[target] === "function") {
					window[target](page);
				} else {
					if (target.indexOf("{$page}") > 0) {
						target = target.replace("{$page}", page)

						// Actualize the view.
						element.attr("data-current", page);
						this.set();
						this.action();
					} else {
						let urlparam = element.data("urlparam") || this.default_urlparam;
						if (target.indexOf("?") > 0) {
							target = target.replace("/" + urlparam + "/=\d+", "") + "&" + urlparam + "=" + page;
						} else {
							target = target + "?" + urlparam + "=" + page;
						}
						location.href = target;
					}
				}

				// Actualize the view.
				element.attr("data-current", page);
				this.set();
				this.action();
			}
		});
	}
}

fire.component.add(ComponentFPage);