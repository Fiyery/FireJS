"use strict";

/**
 * Component Manager.
 */
class ComponentManager {

    /**
     * Constructor.
     */
    constructor() {
        this.list = {};
        this.tags = [];
    }

    /**
     * Add componant.
     * @param Component component 
     */
    add(component) {
        if (!component.tag) {
            throw "Component without tag property";
        }
        this.list[component.tag] = component;
        this.tags.push(component.tag);
    }

    /**
     * Replace HTML Component.
     * @param string tag 
     * @return bool
     */
    replace(tag) {
        if (!this.list[tag]) {
            throw "Tag undefined in component list";
        }
		let replacement = false;
		fire.get(tag + "[data-disabled]").hide();
        fire.get(tag + ":not([data-disabled])").each((el) => {
            let component = new this.list[tag](el.node());
            component.render();
            component.replace();
            component.action();
            component.handle();
            replacement = true;
        });
        return replacement;
    }

    /**
     * Reload operation of replacement.
     */
    run() {
        let replacement = true;
        while (replacement) {
            replacement = false;
            for (let tag of this.tags) {
                replacement = this.replace(tag) || replacement;
            }
        }
    }
}

fire.component = new ComponentManager(fire);