"use strict";

/**
 * Generic component.
 */
class Component {

    static tag = ""

    /**
     * Define defaut value.
     * @param FireElement element 
     */
    constructor(element) {
        this.element = fire.new(element);
        this.new_element = null;
        this.inner_html = false;
    }

    /**
     * Return html with var replacements.
     */
    render() {
        this.attr();
        var wrapper = document.createElement('div');
		wrapper.innerHTML = this.bind(this.html()).trim();
		this.new_element = fire.new(wrapper.firstChild);
        if (this.inner_html) {
			this.fill(this.new_element);
		}
		this.set();
    }

    /**
     * Get attributs to main element.
     */
    attr() {
        let list = this.element.node().attributes;
        this.attributes = {};
        for (let i = 0; i < list.length; i++) {
            this.attributes[list[i].name] = list[i].value;
        }
    }

    /**
     * Set attributs to new element or dynamic HTML.
     * @param FireElement node facultative
     */
    set(node) {
        node = node || this.new_element;
        if (this.element.attr("data-tag")) {
            node.attr("data-tag", this.element.attr("data-tag") + "," + this.constructor.tag);
            delete this.attributes["data-tag"];
        } else {
            node.attr("data-tag", this.constructor.tag);
        }
        for (let name in this.attributes) {
            if (name === "class") {
                let classes = this.attributes[name].trim().split(" ");
                for (let c of classes) {
                    node.addClass(c);
                }
            } else {
                node.attr(name, this.attributes[name]);
            }
        }
    }

    /**
     * Define raw html content.
     * @return string
     */
    html() {
        return "";
    }

    /**
     * Replace variables in html.
     * @param string html
     * @return string
     */
    bind(html) {
        this.inner_html = (html.indexOf("{$inner_html}") >= 0);
        return html;
    }

    /**
     * Insert inner HTML if there is $inner_html var in template.
     * @param FireElement node
     */
    fill(node) {
        if (this.node_inner_html_found) {
            return true;
        }
        if (node.html().trim() === "{$inner_html}") {
            if (this.element.children().size() > 0) {
                node.html('');
                this.element.children().each((child) => {
                    node.append(child);
                });
            } else {
                node.html(this.element.html());
            }
            this.node_inner_html_found = true;
            return true;
        }
        node.children().each((child) => {
            this.fill(child);
        });
    }

    /**
     * Replace current element by the new one.
     */
    replace() {
        this.element.parent().node().replaceChild(this.new_element.node(), this.element.node());
    }

    /**
     * Setup trigger of component.
     */
    action() {
        
    }

    /**
     * Handle event of component, retrieve event listeners of previous element and and them to new one.
     */
    handle() {
        let events = this.element.events();
        for (let name in events) {
            for (let handler of events[name]) {
                this.new_element.on(name, handler);
            }
        }
    }
}