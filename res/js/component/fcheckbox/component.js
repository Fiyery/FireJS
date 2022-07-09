"use strict";

class ComponentFCheckbox extends Component {

	static tag = "fcheckbox";

	constructor(element) {
		super(element);
	}

	html() {
		let html = `
			<div class="grid group_checkbox margin">
				<div class="label">{$label}</div>
				{$inputs}
			</div>
		`;
		return html;
	}

	bind(html) {
        html = super.bind(html);
		html = html.replace("{$label}", this.element.attr("data-label"));
		delete this.attributes["data-label"];

		// Input.
		let inputs_html = "";
		this.element.children().each((input) => {
			console.log(input);
			inputs_html = inputs_html + `
				<div class="grid_4">
					<fgroup_field> 
						<input type="checkbox" value="` + input.val() + `" title="` + input.text() + `" name="` + this.element.attr("name") + `">
						<span class="bar"></span>
						<label>` + input.text() + `</label>
					</fgroup_field>
				</div>
			`;
		});
		html = html.replace("{$inputs}", inputs_html);
		return html;
	}

	set() {
		super.set();
    }
    
    action() {
        // let el = this.new_element.find("select");
        // el.parent().trigger(el.val() ? "active" : "desactive");
    }

    handle() {
        // let el = this.new_element.find("select");

        // el.on("init blur input", (ev) => {
        //     let el = fire.new(ev.target);
        //     let event = el.val() ? "active" : "desactive";
        //     el.parent().trigger(event);
        // });
    }
}

fire.component.add(ComponentFCheckbox);