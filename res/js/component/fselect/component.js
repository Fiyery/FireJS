"use strict";

class ComponentFSelect extends Component {

	static tag = "fselect";

	constructor(element) {
		super(element);
	}

	html() {
		return `
			<fgroup_field>    
				<select>{$inner_html}</select>
				<span class="bar"></span>
				<label>{$label}</label>
			</fgroup_field>
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

fire.component.add(ComponentFSelect);