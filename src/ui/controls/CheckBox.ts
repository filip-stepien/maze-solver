import { FlexView } from './FlexView';
import { Input } from './Input';
import { Text } from './Text';

export class CheckBox extends Input {
    private _text: Text;
    private _container: FlexView;

    constructor(text: string) {
        super();
        this._text = new Text(text);
        this._container = new FlexView();
        this._container.addChild(this);
        this._container.addChild(this._text);
        this._container.alignItems = 'center';
    }

    public get text() {
        return this._text;
    }

    public get container() {
        return this._container;
    }

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
