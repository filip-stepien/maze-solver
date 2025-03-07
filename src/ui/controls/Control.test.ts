// @vitest-environment jsdom

import { describe, expect, test } from 'vitest';
import { Control } from './Control';

const control = new Control();
const controlElement = document.body.firstElementChild as HTMLElement;

describe('Adding element to DOM', () => {
    test('Appending element to document body', () => {
        expect(document.body.firstChild).toBeTruthy();
    });

    test('Creating correct tag type', () => {
        expect(controlElement.tagName).toEqual('DIV');
    });
});

describe('Setting properties in runtime', () => {
    test('Converting number dimensions to px', () => {
        control.width = 100;
        control.height = 100;
        control.padding = 10;

        expect(controlElement.style.width).toEqual('100px');
        expect(controlElement.style.height).toEqual('100px');
        expect(controlElement.style.padding).toEqual('10px');
    });

    test('Handling string values', () => {
        control.width = '100%';
        control.height = '100%';
        control.padding = '1%';

        expect(controlElement.style.width).toEqual('100%');
        expect(controlElement.style.height).toEqual('100%');
        expect(controlElement.style.padding).toEqual('1%');
    });
});
