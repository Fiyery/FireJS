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
			setTimeout(() => {
				console.log("component.hide");
				el.trigger("hide_end");
			}, 500);
		});
		
        el.on("show", (ev) => {
			let el = fire.new(ev.target);
			el.removeClass("fhidden").addClass("fshown");
			setTimeout(() => {
				console.log("component.show");
				el.trigger("show_end");
			}, 500);
        });
    }
}

fire.component.add(ComponentFLineBloc);