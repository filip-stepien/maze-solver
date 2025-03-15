import { DropDownOption } from './DropDownOption';
import { Input } from './Input';

export class DropDown extends Input {
    private _options: Map<string, DropDownOption>;

    constructor() {
        super();
        this._options = new Map();
    }

    public addOption(label: string) {
        const option = new DropDownOption(label);
        this._options.set(label, option);
        this.appendChild(option);
    }

    public override set value(value: string) {
        const option = this._options.get(value);
        if (option) {
            this._options.forEach(opt => (opt.selected = false));
            option.selected = true;
        }
    }

    public override set placeholder(placeholder: string) {
        const option = this._options.get(placeholder);

        if (option) {
            option.label = placeholder;
        } else {
            const placeholderOption = new DropDownOption(placeholder);
            placeholderOption.isPlaceholder = true;
            placeholderOption.selected = true;

            this.appendChild(placeholderOption);
            this._options.set(placeholder, option);
        }
    }

    protected override htmlElement(): keyof HTMLElementTagNameMap {
        return 'select';
    }
}
