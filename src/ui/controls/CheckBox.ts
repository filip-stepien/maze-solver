import { InputLabeled } from './InputLabeled';

export class CheckBox extends InputLabeled {
    public set checked(checked: boolean) {
        if (checked) {
            this.setAttribute('checked', 'checked');
        } else {
            this.removeAttribute('checked');
        }
    }

    protected override inputType(): string {
        return 'checkbox';
    }

    protected override eventReturnValue(eventTarget: HTMLInputElement): string {
        return eventTarget.checked.toString();
    }
}
