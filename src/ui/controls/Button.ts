import { Input } from './Input';

export class Button extends Input {
    protected override inputType(): string {
        return 'button';
    }

    protected override eventType(): keyof HTMLElementEventMap {
        return 'click';
    }

    protected override style(): Partial<CSSStyleDeclaration> {
        return {
            background: 'red'
        };
    }
}
