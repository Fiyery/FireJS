"use strict";

class ComponentMButton extends Component {

    static tag = "mbutton";

    html() {
        return `
            <button class="button">
                {$inner_html}
            </button>
        `;
    }
}

fire.component.add(ComponentMButton);