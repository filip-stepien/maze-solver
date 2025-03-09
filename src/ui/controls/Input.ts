import { Control } from './Control';

export class Input extends Control {
    constructor() {
        super();

        const type = this.inputType();
        if (type) this._htmlElement.setAttribute('type', type);
    }

    public set value(value: string) {
        this._htmlElement.setAttribute('value', value);
    }

    public set placeholder(placeholder: string) {
        this._htmlElement.setAttribute('placeholder', placeholder);
    }

    protected inputType(): string | null {
        return null;
    }

    protected override htmlTag(): keyof HTMLElementTagNameMap {
        return 'input';
    }
}
