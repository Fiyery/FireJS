"use strict";

class ComponentModal extends Component {

    static tag = "modal";

    constructor(element) {
        super(element);
    }

    html() {
        return `
            <div class="modal">
                <div class="box">
                    <div class="head">
                        <div class="title">{$title}</div>
                        <a class="close">
                            <img src="{$image}" title="Fermer la Popin"/>
                        </a>
                    </div>
                    <div class="content">
                        {$inner_html}
                    </div>
                </div>
                <div class="background_mask"></div>
            </div>
        `;
    }

    bind(html) {
        html = html.replace("{$title}", this.attributes["data-title"]);
        delete this.attributes["data-title"];
        html = html.replace("{$image}", this.attributes["data-image"]);
        delete this.attributes["data-image"];
        return super.bind(html);
    }

    action() {
        let el = this.new_element.attr("data-modal", "1");

        el.find(".close, .background_mask").on("click", (e) => {
            let el = fire.new(e.target);
            el.parents(".modal").trigger("close");
        });
    }

    handle() {
        super.handle();
        
        let el = this.new_element;

        el.on("close", (e) => {
            let el = fire.new(e.target);
            el.addClass("hide").removeClass("visible");
        });

        el.on("open", (e) => {
            let el = fire.new(e.target);
            el.removeClass("hide").addClass("visible");
        });
    }
}

fire.component.add(ComponentModal);