// @vitest-environment jsdom

import { describe, expect, test, beforeEach } from 'vitest';
import { Control } from './Control';

let control: Control;
let controlElement: HTMLElement;

beforeEach(() => {
    document.body.innerHTML = '';
    control = new Control();
    controlElement = document.body.firstElementChild as HTMLElement;
});

describe('Adding element to DOM', () => {
    test('Appending element to document body', () => {
        expect(document.body.firstChild).toBeTruthy();
    });

    test('Creating correct tag type', () => {
        expect(controlElement.tagName).toEqual('DIV');
    });
});

describe('Changing properties in runtime', () => {
    test('Converting number dimensions to px', () => {
        control.width = 100;
        control.height = 100;

        expect(controlElement.style.width).toEqual('100px');
        expect(controlElement.style.height).toEqual('100px');
    });

    test('Handling string dimensions', () => {
        control.width = '100%';
        control.height = '100%';

        expect(controlElement.style.width).toEqual('100%');
        expect(controlElement.style.height).toEqual('100%');
    });
});
