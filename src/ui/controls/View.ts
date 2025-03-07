import { Control } from './Control';

/**
 * Container for other controls.
 */
export class View extends Control {
    /**
     * Sets the [gap](https://developer.mozilla.org/en-US/docs/Web/CSS/gap) of the HTML element.
     * Number is treated as `px` unit.
     *
     * @param gap Number or value with CSS unit as a string.
     */
    public set gap(gap: number | string) {
        this._htmlElement.style.gap = this.ensurePx(gap);
    }

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
