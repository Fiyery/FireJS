"use strict";

class ComponentFCircleProgress extends Component {

    static tag = "fcircle_progress";

	constructor(element) {
		super(element);

		// Options.
		this.data = {};
		this.data.value =  this.element.data("value") || 0;
		this.data.size = this.element.data("size") || "6em";
		this.data.line_width = this.element.data("line") || "0.015em";
		this.data.info = this.element.data("info") || 1;
	}

	bind(html) {
		delete this.attributes["data-value"];
		delete this.attributes["data-size"];
		delete this.attributes["data-line"];
		delete this.attributes["data-info"];
		return super.bind(html);
	}

    html() {
        return `
			<div class="fcircle_progress">
				<div class="mask">
					<div class="bar1"></div>
					<div class="bar2"></div>
				</div>
			</div>
        `;
    }

	action() {
		super.action();

		let el = this.new_element;

		// Sizing.
		el.css({
			"font-size" : this.data.size,
			"border-width" : this.data.line_width
		});
		el.find(".bar1, .bar2").css("border-width", this.data.line_width);
		el.find(".mask").css({
			"left" : "-"+this.data.line_width,
			"top" : "-"+this.data.line_width
		});

		// Check percent show.
		if (this.data.info != 0) {
			this.new_element.addClass("info");
		}

		this.update(this.data.value);
	}

	handle() {
		super.handle();

		this.new_element.on("update", (e) => {
			if (e.detail.value) {
				let value = parseFloat(e.detail.value).toFixed(1);
				if (value < 0) {
					value = 0;
				} else if (value > 100) {
					value = 100;
				}
				this.update(value);
				this.new_element.trigger("change");
			}
		});
	}

	update(value) {
		let bar1 = this.new_element.find(".bar1");
		value = value ? value * 1 : 0;
		let angle = 360 * value / 100;
		if (bar1.size() > 0) {
			this.new_element.data("value", value.toFixed(1));
			this.data.value = value.toFixed(1);
			bar1.css("transform", "rotate(" + angle + "deg)");
		}
	}
}

fire.component.add(ComponentFCircleProgress);