"use strict";

class ComponentFState extends Component {

    static tag = "fstate";

    html() {
        return `
            <div class="fstate">
                {$inner_html}
            </div>
        `;
	}
	
	set() {
		super.set();
		this.new_element.addClass((this.attributes["data-color"]) || "gray");
    }
}

fire.component.add(ComponentFState);