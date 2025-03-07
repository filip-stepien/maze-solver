export class Control {
    protected _htmlElement: HTMLElement;

    constructor() {
        this._htmlElement = document.createElement(this.htmlTag());
        this.appendDomElement();
    }

    private ensurePx(num: number | string) {
        return typeof num === 'number' ? num.toString() + 'px' : num;
    }

    public set width(width: number | string) {
        this._htmlElement.style.width = this.ensurePx(width);
    }

    public set height(height: number | string) {
        this._htmlElement.style.height = this.ensurePx(height);
    }

    public appendDomElement(target: HTMLElement = document.body) {
        target.appendChild(this._htmlElement);
    }

    protected htmlTag(): keyof HTMLElementTagNameMap {
        return 'div';
    }
}
