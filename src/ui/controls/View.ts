import { Control } from './Control';

/**
 * Container for other controls.
 */
export class View extends Control {
    /**
     * Adds child controls to the current view by nesting them
     * inside HTML element of this container in the DOM.
     *
     * @param children The child controls to add to the view.
     */
    public addChild(...children: Control[]) {
        children.forEach(c => c.appendDomElement(this._htmlElement));
    }
}
