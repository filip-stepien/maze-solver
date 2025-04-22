/**
 * Base class for HTML controls of user interface.
 */
export abstract class Control<T extends HTMLElement = HTMLElement> {
    /**
     * HTML DOM element.
     */
    private _htmlElement: T;

    /**
     * Creates HTML element and appends it to DOM.
     */
    constructor() {
        this._htmlElement = this.htmlElement();
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
    protected setAttribute(property: string, value: number | string) {
        this._htmlElement.setAttribute(property, value.toString());
    }

    protected getAttribute(property: string): string | null {
        return this._htmlElement.getAttribute(property);
    }

    protected removeAttribute(property: string) {
        this._htmlElement.removeAttribute(property);
    }

    protected checkValidity(showWarning: boolean): boolean | null {
        const input = this._htmlElement as unknown as HTMLInputElement;
        if (input.checkValidity) {
            const valid = input.checkValidity();

            if (!valid && showWarning) {
                input.reportValidity();
                return false;
            }

            return true;
        }

        return null;
    }

    /**
     * Adds event listener to the HTML element.
     * @param property Name of HTML event.
     * @param value Event handler function.
     */
    protected addEventListener(eventName: string, handler: (event: Event) => void) {
        const clone = this._htmlElement.cloneNode(true) as T;
        this._htmlElement.replaceWith(clone);
        this._htmlElement = clone;
        this._htmlElement.addEventListener(eventName, handler);
    }

    protected setInnerText(text: string) {
        this._htmlElement.innerText = text;
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
    protected abstract htmlElement(): T;

    /**
     * Method which can be overridden in subclasses to set the initial CSS style of the HTML element.
     * @returns CSS style for the element.
     */
    public set style(style: Partial<CSSStyleDeclaration>) {
        Object.assign(this._htmlElement.style, style);
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
