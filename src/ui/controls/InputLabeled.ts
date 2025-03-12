import { FlexView } from './FlexView';
import { Input } from './Input';
import { Text } from './Text';

export class InputLabeled extends Input {
    private _label: Text;
    private _container: FlexView;

    constructor(label?: string) {
        super();
        this._label = new Text(label);
        this._container = new FlexView();
        this._container.addChild(this);
        this._container.addChild(this._label);
        this._container.alignItems = 'center';
    }

    public get label() {
        return this._label;
    }

    public get container() {
        return this._container;
    }
}
