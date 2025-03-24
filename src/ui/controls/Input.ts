import { Control } from './Control';
import { ControlObservable } from './ControlObservable';

export class Input extends ControlObservable<HTMLInputElement | HTMLSelectElement> {
    constructor() {
        super();

        const inputType = this.inputType();
        if (inputType) this.setAttribute('type', inputType);
    }

    public set value(value: string | number) {
        this.setAttribute('value', value.toString());
    }

    public set placeholder(placeholder: string) {
        this.setAttribute('placeholder', placeholder);
    }

    public set disabled(disabled: boolean) {
        if (disabled) {
            this.setAttribute('disabled', 'disabled');
        } else {
            this.removeAttribute('disabled');
        }
    }

    public validate(showWarning: boolean) {
        return this.checkValidity(showWarning) ?? false;
    }

    protected inputType(): string | null {
        return null;
    }

    protected eventReturnValue(eventTarget: HTMLInputElement): string {
        return eventTarget.value;
    }

    protected override htmlElement(): HTMLInputElement | HTMLSelectElement {
        return document.createElement('input');
    }

    public override set onChange(handler: (value: string) => void) {
        const eventType = this.eventType();
        if (eventType) {
            this.addEventListener(eventType, event => {
                const input = event.target as HTMLInputElement;
                const eventReturnValue = this.eventReturnValue(input);
                handler(eventReturnValue);
            });
        }
    }
}
