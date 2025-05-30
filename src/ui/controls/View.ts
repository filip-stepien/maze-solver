import { Control } from './Control';

/**
 * Container for other controls.
 */
export class View extends Control<HTMLDivElement> {
    /**
     * Sets the [gap](https://developer.mozilla.org/en-US/docs/Web/CSS/gap) of the HTML element.
     * Number is treated as `px` unit.
     *
     * @param gap Number or value with CSS unit as a string.
     */
    public set gap(gap: number | string) {
        this.setStyle('gap', gap);
    }

    /**
     * Adds child controls to the current view by nesting them
     * inside HTML element of this container in the DOM.
     *
     * @param children The child controls to add to the view.
     */
    public addChild(...children: Control[]) {
        children.forEach(c => this.appendChild(c));
    }

    protected htmlElement(): HTMLDivElement {
        return document.createElement('div');
    }
}
