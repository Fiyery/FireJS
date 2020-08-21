"use strict";

class ComponentFLineBloc extends Component {

    static tag = "fline_bloc";

    html() {
        return `
            <div class="fanimate_width fshown">
                {$inner_html}
            </div>
        `;
	}
	
	handle() {
		super.handle();

		let el = this.new_element;

        el.on("hide", (ev) => {
			let el = fire.new(ev.target);
			el.addClass("fhidden").removeClass("fshown");
		});
		
        el.on("show", (ev) => {
			let el = fire.new(ev.target);
			el.removeClass("fhidden").addClass("fshown");
        });
    }
}

fire.component.add(ComponentFLineBloc);