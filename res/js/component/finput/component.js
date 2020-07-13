"use strict";

class ComponentFInput extends Component {

	static tag = "finput";

	constructor(element) {
		super(element);
	}

	html() {
		return `
			<fgroup_field>    
				<input/>
				<span class="bar"></span>
				<label>{$label}</label>
			</fgroup_field>
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

        el.on("init blur input", (ev) => {
			let el = fire.new(ev.target);
            let event = el.val() ? "active" : "desactive";
            el.parent().trigger(event);
        });
    }
}

fire.component.add(ComponentFInput);