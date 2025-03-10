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
            this._options.forEach(opt => opt.unselect());
            option.select();
        }
    }

    public override set placeholder(placeholder: string) {
        const option = this._options.get(placeholder);

        if (option) {
            option.setLabel(placeholder);
        } else {
            const placeholderOption = new DropDownOption(placeholder);
            placeholderOption.setAsPlaceholder();
            placeholderOption.select();

            this.appendChild(placeholderOption);
            this._options.set(placeholder, option);
        }
    }

    protected override htmlTag(): keyof HTMLElementTagNameMap {
        return 'select';
    }
}
