export class Control {
    protected _width: string;
    protected _height: string;
    protected _htmlElement: HTMLElement;

    constructor() {
        this._htmlElement = document.createElement(this.htmlTag());
    }

    private ensurePx(num: number | string) {
        return typeof num === 'number' ? num.toString() + 'px' : num;
    }

    public set width(width: number | string) {
        this._width = this.ensurePx(width);
    }

    public set height(height: number | string) {
        this._height = this.ensurePx(height);
    }

    private applyStyles() {
        const styles: Partial<CSSStyleDeclaration> = {};
        let current: Control = this;

        while (current) {
            if (current && typeof current.css === 'function') {
                Object.assign(styles, current.css.call(this));
            }

            current = Object.getPrototypeOf(current);
        }

        Object.assign(this._htmlElement.style, styles);
    }

    public appendDomElement(target: HTMLElement = document.body) {
        this.applyStyles();
        target.appendChild(this._htmlElement);
    }

    protected htmlTag(): keyof HTMLElementTagNameMap {
        return 'div';
    }

    protected css(): Partial<CSSStyleDeclaration> {
        return {
            width: this._width,
            height: this._height
        };
    }
}
