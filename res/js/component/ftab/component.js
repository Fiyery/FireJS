"use strict";

class ComponentFTab extends Component {

    static tag = "ftab";

    constructor(element) {
        super(element);
    }

    html() {
        return `
            <div class="bloc_tab">
				<ul class="bloc_tab_navigation"></ul>
				<div class="bloc_tab_container">
					{$inner_html}
				</div>
            </div>
        `;
	}

	parse_id(id) {
		return id.replace(/\W+/, "").toLowerCase();
	}
	
	set() {
		super.set();
		let menu = this.new_element.find(".bloc_tab_navigation");
		let container = this.new_element.find(".bloc_tab_container");
		let is_selected = false;
		container.children().each((tab) => {
			let id = this.parse_id(tab.data("name"));
			tab.data("tab", id);
			is_selected = is_selected || tab.hasClass("selected");
			let li = fire.create("li").data("tab", id).text(tab.data("name"));
			if (tab.hasClass("selected")) {
				li.addClass("selected");
			}
			menu.append(li);
			tab.addClass("bloc_tab_container_part");
		});
		if (!is_selected) {
			// If HTML anchor is defined and fit tab, it will be showing.
			let replaced = false;
			if (location.hash !== "") {
				let id = this.parse_id(location.hash.substring(1))

				this.new_element.children().children().each(function(){
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
	
	action() {
		super.action();
        
        let el = this.new_element.find(".bloc_tab_navigation li");

        el.on("click", (ev) => {
			let el = fire.new(ev.target);
			el.parent().parent().find(".bloc_tab_container").trigger("change", {id: el.data("tab")});
        });
	}

    handle() {
        super.handle();
        
		let el = this.new_element.find(".bloc_tab_container");
		let parent = this.new_element;

        el.on("change", (ev) => {
			if (ev.detail) {
				let id = ev.detail.id;
				parent.children().children().each(function(){
					if (this.data("tab") === id) {
						this.addClass("selected");
					} else {
						this.removeClass("selected");
					}
				});
			}
        });
    }
}

fire.component.add(ComponentFTab);