import { Control } from './Control';
import { ControlObservable } from './ControlObservable';

export class Input extends Control implements ControlObservable {
    constructor() {
        super();

        const inputType = this.inputType();
        if (inputType) this.setAttribute('type', inputType);
    }

    public set value(value: string) {
        this.setAttribute('value', value);
    }

    public set placeholder(placeholder: string) {
        this.setAttribute('placeholder', placeholder);
    }

    public set onChange(handler: (value: string) => void) {
        const eventType = this.eventType();
        if (eventType) {
            this.addEventListener(eventType, event => {
                const input = event.target as HTMLInputElement;
                handler(input.value);
            });
        }
    }

    protected inputType(): string | null {
        return null;
    }

    protected eventType(): keyof HTMLElementEventMap | null {
        return null;
    }

    protected override htmlTag(): keyof HTMLElementTagNameMap {
        return 'input';
    }
}
