import { Input } from './Input';

export class Button extends Input {
    constructor(label?: string) {
        super();
        if (label) this.value = label;
    }

    protected override inputType(): string {
        return 'button';
    }

    protected override eventType(): keyof HTMLElementEventMap {
        return 'click';
    }
}
