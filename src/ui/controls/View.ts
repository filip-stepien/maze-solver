import { Control } from './Control';

export class View extends Control {
    private _children: Control[];

    constructor() {
        super();
        this._children = [];
    }

    public addChild(...children: Control[]) {
        this._children.push(...children);
    }

    public get children(): Control[] {
        return this._children;
    }

    public override appendDomElement(target: HTMLElement = document.body): void {
        super.appendDomElement(target);
        this._children.forEach(c => {
            c.appendDomElement(this._htmlElement);
        });
    }
}
