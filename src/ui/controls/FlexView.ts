import { View } from './View';

export class FlexView extends View {
    constructor() {
        super();
        this._htmlElement.style.display = 'flex';
    }

    public set direction(direction: 'column' | 'row') {
        this._htmlElement.style.direction = direction;
    }

    public set alignItems(alignment: string) {
        this._htmlElement.style.alignItems = alignment;
    }

    public set justifyContent(justify: string) {
        this._htmlElement.style.justifyContent = justify;
    }
}
