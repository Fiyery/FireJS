"use strict";

class ComponentFTextarea extends Component {

	static tag = "ftextarea";

	constructor(element) {
		super(element);
	}

	html() {
		return `
			<fgroup_field>    
				<textarea>{$inner_html}</textarea>
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
		super.set(this.new_element.find("textarea"));
    }
    
    action() {
        let el = this.new_element.find("textarea");
        el.parent().trigger(el.val() ? "active" : "desactive");
    }

    handle() {
        let el = this.new_element.find("textarea");

        el.on("init blur input", (ev) => {
            let el = fire.new(ev.target);
            let event = el.val() ? "active" : "desactive";
            el.parent().trigger(event);
        });
    }
}

fire.component.add(ComponentFTextarea);