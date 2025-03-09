/**
 * Base class for HTML controls of user interface.
 */
export class Control {
    /**
     * HTML DOM element.
     */
    protected _htmlElement: HTMLElement;

    /**
     * Creates HTML element and appends it to DOM.
     */
    constructor() {
        this._htmlElement = document.createElement(this.htmlTag());
        this.applyStyles();
        this.appendDomElement();
    }

    private applyStyles() {
        Object.assign(this._htmlElement.style, this.style());
    }

    /**
     * Formats number as a CSS pixel value.
     * If the input is already a string, it leaves the value as it is.
     *
     * @param num The value to be formatted.
     * @returns Formatted CSS pixel string or the input string if it was already a string.
     */
    protected ensurePx(num: number | string): string {
        return typeof num === 'number' ? num.toString() + 'px' : num;
    }

    /**
     * Sets the width of the HTML element.
     * Number is treated as `px` unit.
     *
     * @param width Number or value with CSS unit as a string.
     */
    public set width(width: number | string) {
        this._htmlElement.style.width = this.ensurePx(width);
    }

    /**
     * Sets the height of the HTML element.
     * Number is treated as `px` unit.
     *
     * @param width Number or value with CSS unit as a string.
     */
    public set height(height: number | string) {
        this._htmlElement.style.height = this.ensurePx(height);
    }

    /**
     * Sets the padding of the HTML element.
     * Number is treated as `px` unit.
     *
     * @param padding Number or value with CSS unit as a string.
     */
    public set padding(padding: number | string) {
        this._htmlElement.style.padding = this.ensurePx(padding);
    }

    /**
     * Appends the current HTML element to the specified target element in the DOM.
     * If no target is provided, the element will be appended to the body by default.
     *
     * @param target Element to append the HTML element to.
     */
    public appendDomElement(target: HTMLElement = document.body) {
        target.appendChild(this._htmlElement);
    }

    /**
     * Method which can be overridden in subclasses to create different tags in the DOM.
     * @returns HTML tag name for the element.
     */
    protected htmlTag(): keyof HTMLElementTagNameMap {
        return 'div';
    }

    protected style(): Partial<CSSStyleDeclaration> {
        return {};
    }
}
