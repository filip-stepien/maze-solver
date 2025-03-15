import { Control } from './Control';

export abstract class ControlObservable<T extends HTMLElement = HTMLElement> extends Control<T> {
    public set onChange(handler: (value: string) => void) {}
    protected eventType(): keyof HTMLElementEventMap {
        return 'change';
    }
}
