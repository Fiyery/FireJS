"use strict";

class ComponentFModal extends Component {

    static tag = "fmodal";

    constructor(element) {
        super(element);
    }

    html() {
        return `
            <div class="modal">
                <div class="box">
                    <div class="head">
                        <div class="title">{$title}</div>
                        <a class="close" title="Fermer la Popin">
							<svg fill="#FFF" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg">
								<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
								<path d="M0 0h24v24H0z" fill="none"/>
							</svg>
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
	
	set() {
		super.set();
		if (this.attributes["data-lock"]) {
			this.new_element.addClass("lock");
		}
	}

    action() {
        let el = this.new_element;

        el.find(".close, .background_mask").on("click", (ev) => {
            let el = fire.new(ev.target);
            el.parents(".modal").trigger("close");
        });
    }

    handle() {
        super.handle();
        
        let el = this.new_element;

        el.on("close", (ev) => {
			let el = fire.new(ev.target);
			if (el.hasClass("lock")) {
				return false;
			}
            el.addClass("hide").removeClass("visible");
        });

        el.on("open", (ev) => {
            let el = fire.new(ev.target);
            el.removeClass("hide").addClass("visible");
        });
    }
}

fire.component.add(ComponentFModal);