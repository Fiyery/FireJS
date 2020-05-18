"use strict";

class ComponentMInput extends Component {

	static tag = "minput";

	constructor(element) {
		super(element);
	}

	html() {
		return `
			<mgroup_field>    
				<input/>
				<span class="bar"></span>
				<label>{$label}</label>
			</mgroup_field>
		`;
	}

	bind(html) {
		html = html.replace("{$label}", this.element.attr("data-label"));
		delete this.attributes["data-label"];
		return html;
	}

	set() {
		super.set(this.new_element.find("input"));
    }
    
    action() {
        let el = this.new_element.find("input");
        el.parent().trigger(el.val() ? "active" : "desactive");
    }

    handle() {
        let el = this.new_element.find("input");

        el.on("init blur input", (e) => {
            let el = fire.new(e.target);
            let event = el.val() ? "active" : "desactive";
            el.parent().trigger(event);
        });
    }
}

fire.component.add(ComponentMInput);