import { Control } from './Control';

export class Text extends Control<HTMLDivElement> {
    constructor(text?: string) {
        super();
        this.content = text ?? '';
    }

    public set content(content: string) {
        this.setInnerText(content);
    }

    public set align(align: string) {
        this.setStyle('textAlign', align);
    }

    public set color(color: string) {
        this.setStyle('color', color);
    }

    public set fontSize(fontSize: string | number) {
        this.setStyle('fontSize', fontSize);
    }

    protected htmlElement() {
        return document.createElement('div');
    }
}
