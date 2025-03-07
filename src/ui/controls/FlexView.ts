import { View } from './View';

export class FlexView extends View {
    private _direction: 'column' | 'row';
    private _alignItems: string;
    private _justifyContent: string;

    public set direction(direction: 'column' | 'row') {
        this._direction = direction;
    }

    public set alignItems(alignment: string) {
        this._alignItems = alignment;
    }

    public set justifyContent(justify: string) {
        this._justifyContent = justify;
    }

    protected override css(): Partial<CSSStyleDeclaration> {
        return {
            display: 'flex',
            flexDirection: this._direction,
            alignItems: this._alignItems,
            justifyContent: this._justifyContent
        };
    }
}
