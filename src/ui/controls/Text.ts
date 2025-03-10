import { Control } from './Control';

export class Text extends Control {
    public set align(align: string) {
        this.setStyle('textAlign', align);
    }

    public set color(color: string) {
        this.setStyle('color', color);
    }

    public set fontSize(fontSize: string | number) {
        this.setStyle('fontSize', fontSize);
    }

    constructor(text: string) {
        super();
        this.setInnerText(text);
    }
}
