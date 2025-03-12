import { InputLabeled } from './InputLabeled';

export class RangeSlider extends InputLabeled {
    constructor() {
        super();
        this.onChange = value => (this.label.content = value);
    }

    protected override inputType(): string {
        return 'range';
    }

    public override set value(value: string | number) {
        const strValue = value.toString();
        this.label.content = strValue;
        this.setAttribute('value', strValue);
    }

    public set min(min: number) {
        this.setAttribute('min', min);
    }

    public set max(max: number) {
        this.setAttribute('max', max);
    }

    public set step(step: number) {
        this.setAttribute('step', step);
    }

    protected override eventType(): keyof HTMLElementEventMap {
        return 'input';
    }
}
