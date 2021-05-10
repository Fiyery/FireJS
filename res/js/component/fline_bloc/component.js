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
			el.off("animationend").on("animationend", () => {
				el.trigger("hide_end");
			})
		});
		
		el.on("show", (ev) => {
			let el = fire.new(ev.target);
			el.removeClass("fhidden").addClass("fshown");
			el.off("animationend").on("animationend", () => {
				el.trigger("show_end");
			})
		});
	}
}

fire.component.add(ComponentFLineBloc);