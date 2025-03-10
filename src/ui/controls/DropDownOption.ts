import { Control } from './Control';

export class DropDownOption extends Control {
    constructor(label: string) {
        super();
        this.setInnerText(label);
    }

    public select() {
        this.setAttribute('selected', 'selected');
    }

    public unselect() {
        this.removeAttribute('selected');
    }

    public setAsPlaceholder() {
        this.setAttribute('disabled', 'disabled');
        this.setAttribute('hidden', 'hidden');
    }

    public unsetPlaceholder() {
        this.removeAttribute('disabled');
        this.removeAttribute('hidden');
    }

    public setLabel(label: string) {
        this.setInnerText(label);
    }

    protected override htmlTag(): keyof HTMLElementTagNameMap {
        return 'option';
    }
}
