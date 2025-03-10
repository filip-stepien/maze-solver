import { Control } from './Control';

export class ControlObservable extends Control {
    public set onChange(handler: (value: string) => void) {}
    protected eventType(): keyof HTMLElementEventMap {
        return 'change';
    }
}
