"use strict";

class ComponentModalButton extends Component {

    static tag = "modal_button";

    constructor(element) {
        super(element);
    }

    html() {
        return `
            <mbutton>
                {$inner_html}
            </mbutton>
        `;
    }

    action() {
        let el = this.new_element;

        el.on("click", function() {
            fire.get("#" + this.attr("data-id")).trigger("open");
        });
    }
}

fire.component.add(ComponentModalButton);