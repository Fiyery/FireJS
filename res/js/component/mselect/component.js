"use strict";

class ComponentMSelect extends Component {

	static tag = "mselect";

	constructor(element) {
		super(element);
	}

	html() {
		return `
			<mgroup_field>    
				<select>{$inner_html}</select>
				<span class="bar"></span>
				<label>{$label}</label>
			</mgroup_field>
		`;
	}

	bind(html) {
        html = super.bind(html);
		html = html.replace("{$label}", this.element.attr("data-label"));
		delete this.attributes["data-label"];
		return html;
	}

	set() {
		super.set(this.new_element.find("select"));
    }
    
    action() {
        let el = this.new_element.find("select");
        el.parent().trigger(el.val() ? "active" : "desactive");
    }

    handle() {
        let el = this.new_element.find("select");

        el.on("init blur input", (e) => {
            let el = fire.new(e.target);
            let event = el.val() ? "active" : "desactive";
            el.parent().trigger(event);
        });
    }
}

fire.component.add(ComponentMSelect);