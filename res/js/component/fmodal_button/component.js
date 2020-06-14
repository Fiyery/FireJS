"use strict";

class ComponentFModalButton extends Component {

    static tag = "fmodal_button";

    constructor(element) {
        super(element);
    }

    html() {
        return `
            <fbutton>
                {$inner_html}
            </fbutton>
        `;
    }

    action() {
        let el = this.new_element;

        el.on("click", function() {
            fire.get("#" + this.attr("data-id")).trigger("open");
        });
    }
}

fire.component.add(ComponentFModalButton);