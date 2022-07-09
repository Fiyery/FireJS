"use strict";

class ComponentFRadio extends Component {

	static tag = "fradio";

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
						<input type="radio" value="` + input.val() + `" title="` + input.text() + `" name="` + this.element.attr("name") + `">
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
		
    }

    handle() {

    }
}

fire.component.add(ComponentFRadio);