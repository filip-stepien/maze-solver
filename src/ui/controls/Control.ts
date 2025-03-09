/**
 * Base class for HTML controls of user interface.
 */
export class Control {
    /**
     * HTML DOM element.
     */
    private _htmlElement: HTMLElement;

    /**
     * Creates HTML element and appends it to DOM.
     */
    constructor() {
        this._htmlElement = document.createElement(this.htmlTag());
        this.applyStyles();
        this.appendDomElement();
    }

    /**
     * Appends the current HTML element to the specified target element in the DOM.
     * If no target is provided, the element will be appended to the body by default.
     *
     * @param target Element to append the HTML element to.
     */
    private appendDomElement(target: HTMLElement = document.body) {
        target.appendChild(this._htmlElement);
    }

    /**
     * Applies initial styles returned by `style()` method to the HTML element.
     */
    private applyStyles() {
        Object.assign(this._htmlElement.style, this.style());
    }

    /**
     * Sets the CSS property of the HTML element.
     * @param property Name of the CSS property.
     * @param value CSS property value.
     */
    protected setStyle(property: string, value: string | number) {
        Object.assign(this._htmlElement.style, { [property]: this.ensurePx(value) });
    }

    /**
     * Appends attribute to the HTML tag.
     * @param property Name of HTML property.
     * @param value HTML property value.
     */
    protected setAttribute(property: string, value: string) {
        this._htmlElement.setAttribute(property, value);
    }

    /**
     * Nests controls' HTML tags inside tag of this control.
     * @param control Controls to be nested.
     */
    protected appendChild(...control: Control[]) {
        control.forEach(c => c.appendDomElement(this._htmlElement));
    }

    /**
     * Formats number as a CSS pixel value.
     * If the input is already a string, it leaves the value as it is.
     *
     * @param num The value to be formatted.
     * @returns Formatted CSS pixel string or the input string if it was already a string.
     */
    private ensurePx(num: number | string): string {
        return typeof num === 'number' ? num.toString() + 'px' : num;
    }

    /**
     * Method which can be overridden in subclasses to create different tags in the DOM.
     * @returns HTML tag name for the element.
     */
    protected htmlTag(): keyof HTMLElementTagNameMap {
        return 'div';
    }

    /**
     * Method which can be overridden in subclasses to set the initial CSS style of the HTML element.
     * @returns CSS style for the element.
     */
    protected style(): Partial<CSSStyleDeclaration> {
        return {};
    }

    /**
     * Sets the width of the HTML element.
     * Number is treated as `px` unit.
     *
     * @param width Number or value with CSS unit as a string.
     */
    public set width(width: number | string) {
        this.setStyle('width', this.ensurePx(width));
    }

    /**
     * Sets the height of the HTML element.
     * Number is treated as `px` unit.
     *
     * @param width Number or value with CSS unit as a string.
     */
    public set height(height: number | string) {
        this.setStyle('height', this.ensurePx(height));
    }

    /**
     * Sets the padding of the HTML element.
     * Number is treated as `px` unit.
     *
     * @param padding Number or value with CSS unit as a string.
     */
    public set padding(padding: number | string) {
        this.setStyle('padding', this.ensurePx(padding));
    }
}
