import { Control } from './Control';

export class View extends Control {
    constructor() {
        super();
    }

    public addChild(...children: Control[]) {
        children.forEach(c => c.appendDomElement(this._htmlElement));
    }
}
