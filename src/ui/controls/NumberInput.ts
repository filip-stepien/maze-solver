import { Input } from './Input';

export class NumberInput extends Input {
    public set min(min: number) {
        this.setAttribute('min', min);
    }

    public set max(max: number) {
        this.setAttribute('max', max);
    }

    protected override inputType(): string {
        return 'number';
    }
}
