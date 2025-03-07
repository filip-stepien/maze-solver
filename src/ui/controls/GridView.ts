import { View } from './View';

/**
 * Container for other controls utilizing grid layout to arrange its child controls.
 */
export class GridView extends View {
    /**
     * Initializes grid layout by setting the display property to `grid`.
     */
    constructor() {
        super();
        this._htmlElement.style.display = 'grid';
    }

    /**
     * Formats number as a CSS fraction value.
     * If the input is already a string, it leaves the value as it is.
     *
     * @param num The value to be formatted.
     * @returns Formatted CSS fraction string or the input string if it was already a string.
     */
    private ensureFraction(num: number | string) {
        return typeof num === 'number' ? num.toString() + 'fr' : num;
    }

    /**
     * Converts an array of numbers or strings into a CSS grid pattern.
     * Each number is formatted as an `fr` unit, while strings are left unchanged.
     *
     * @param pattern Array of numbers or strings representing the grid pattern.
     * @returns String formatted for use in CSS grid properties.
     */
    private gridPattern(pattern: (number | string)[]) {
        return pattern.map(this.ensureFraction).join(' ');
    }

    /**
     * Sets the column layout of the grid using a pattern of numbers or string CSS units.
     * Numbers are treated as `fr` units.
     *
     * @param pattern Array representing column sizes.
     */
    public set columns(pattern: (number | string)[]) {
        this._htmlElement.style.gridTemplateColumns = this.gridPattern(pattern);
    }

    /**
     * Sets the row layout of the grid using a pattern of numbers (`fr` units) or string CSS units.
     * Numbers are treated as `fr` units.
     *
     * @param pattern Array representing row sizes.
     */
    public set rows(pattern: (number | string)[]) {
        this._htmlElement.style.gridTemplateRows = this.gridPattern(pattern);
    }

    /**
     * Sets the item placement within the grid using a CSS
     * [place-items](https://developer.mozilla.org/en-US/docs/Web/CSS/place-items#syntax) value.
     *
     * @param placement String representing a single alignment value or array of two strings for vertical and horizontal alignment respectively.
     */
    public set itemPlacement(placement: string | [string, string]) {
        placement = typeof placement === 'string' ? placement : placement.join(' ');
        this._htmlElement.style.placeItems = placement;
    }
}
