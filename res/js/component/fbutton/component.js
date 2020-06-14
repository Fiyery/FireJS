"use strict";

class ComponentFButton extends Component {

    static tag = "fbutton";

    html() {
        return `
            <button class="button">
                {$inner_html}
            </button>
        `;
    }
}

fire.component.add(ComponentFButton);