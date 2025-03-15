import { Control } from './Control';

export class DropDownOption extends Control {
    constructor(label: string) {
        super();
        this.setInnerText(label);
    }

    public set selected(selected: boolean) {
        if (selected) {
            this.setAttribute('selected', 'selected');
        } else {
            this.removeAttribute('selected');
        }
    }

    public set isPlaceholder(isPlaceholder: boolean) {
        if (isPlaceholder) {
            this.setAttribute('disabled', 'disabled');
            this.setAttribute('hidden', 'hidden');
        } else {
            this.removeAttribute('disabled');
            this.removeAttribute('hidden');
        }
    }

    public set label(label: string) {
        this.setInnerText(label);
    }

    protected override htmlElement() {
        return document.createElement('option');
    }
}
