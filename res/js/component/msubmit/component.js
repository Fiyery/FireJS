"use strict";

class ComponentMSubmit extends Component {

    static tag = "msubmit";

    html() {
		return `
			<div class="submit_form_center">    
                <button class="button">
                    {$inner_html}
                </button>
			</div>
		`;
	}

	set() {
		super.set(this.new_element.find("button"));
    }
}

fire.component.add(ComponentMSubmit);